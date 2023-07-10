<template>
    <div class="list">
        <SearchTop @search="searchAssets" @reset="reset">
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params">
                    <el-form-item label="业务系统：" label-width="80px">
                        <el-input placeholder="请输入" clearable v-model.trim="get_params.systemName" @keyup.enter.native="searchAssets" size="small"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params">
                    <el-form-item label="域名：" label-width="80px">
                        <el-input placeholder="请输入" clearable v-model.trim="get_params.domainName" @keyup.enter.native="searchAssets" size="small"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params">
                    <el-form-item label="IP：" label-width="80px">
                        <el-input placeholder="请输入" clearable v-model.trim="get_params.ip" @keyup.enter.native="searchAssets" size="small"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
        </SearchTop>
        <div class="list-container">
            <div class="ub ub-pj w100 mb-1 ub-ac">
                <div class="list-tips">业务系统管理</div>
                <div>
                    <el-button size="small" icon="el-icon-plus" type="primary" title="添加业务系统" @click="addUser" v-per="['assets_system_add']">添加业务系统</el-button>
                    <el-button style="margin-left: 10px;" size="small" icon="el-icon-download" type="primary" @click="downLoad" v-per="['assets_system_xls']">下载模板</el-button>
                    <el-upload
                        action="/api/assets-manage/manage/system/importExcel"
                        name="fileUpload"
                        accept=".xlsx,.xlsx"
                        :headers="header"
                        :file-list="fileList"
                        :show-file-list="false"
                        :on-success="handleSuccess"
                        style="display: inline-block;">
                        <el-button style="margin-left: 10px;" type="primary" size="small" v-per="['assets_system_imp']" icon="iconfont icon-daoru">导入</el-button>
                    </el-upload>
                    <el-button style="margin-left: 10px;" type="primary" size="small" @click="downData" v-per="['assets_system_exp']" icon="iconfont icon-daochu">导出</el-button>
                    <el-button style="margin-left: 10px;" size="small" icon="el-icon-delete" type="danger" @click="delAllUserBtn" v-per="['assets_system_del']">删除</el-button>
                </div>
            </div>
            <el-table
                ref="multipleTable"
                v-loading="loading"
                class='bigTable'
                :data="tableData"
                border
                stripe
                tooltip-effect="dark"
                :row-class-name="tableRowClassName"
                @selection-change="handleSelectionChange"
                :height="tabHeight"
                :row-style="{ height: '32px' }"
                :header-row-style="{ height: '32px' }">
                <el-table-column align="center" type="selection" width="30"></el-table-column>
                <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                </el-table-column>
                <el-table-column prop="systemName" label="业务系统名称" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="domainName" label="域名" show-overflow-tooltip>
                    <template slot-scope="{row}">
                        <p v-for="(item,index) in row.infos" :key="index">{{item.domainName}}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="ip" label="IP">
                    <template slot-scope="{row}">
                        <p v-for="(item, index) in row.infos" :key="index">{{item.ip}}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="users" label="资产联系人" width="200">
                    <template slot-scope="scope">
                        <!--eslint-disable-->
                        <el-tag v-if="item.chineseName" type="success" size="mini" v-for="(item,index) in scope.row.users" :key="index">{{item.chineseName}}</el-tag>
                        <!--eslint-disable-->
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="创建时间" width="160">
                </el-table-column>
                <el-table-column align="center" label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="handleSee(JSON.parse(JSON.stringify(scope.row)))" v-per="['assets_system_look']">查看</el-button>
                        <el-button type="text" size="small" @click="handleEdit(scope.row)" v-per="['assets_system_edit']">编辑</el-button>
                        <el-button type="text" size="small" @click="delUserBtn(scope.row)" v-per="['assets_system_del']">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size" @pagination="get_data" style="padding-top:10px" v-show="total_num>0"/>
        </div>
        <!--增加内容开始-->
        <el-dialog title="添加业务系统" :visible.sync="addDomainDialog" width="700px" custom-class="common-dialog">
            <el-form :model="deviceForm" :inline="true" :rules="rules" ref="deviceForm" label-width="100px" label-position="top">
                <el-form-item label="系统名称：" prop="systemName">
                    <el-input size="small" clearable v-model="deviceForm.systemName" placeholder="请输入业务系统名称" autocomplete="off" style="width:652px !important"></el-input>
                </el-form-item>
                <el-form-item style="width:100%;">
                    <div class="ub ub-pj w100">
                        <div style="color:rgba(0,0,0,.9);font-size:12px">联系人：</div>
                        <div style="cursor: pointer;" @click="addPeoples(deviceForm)">
                            <i style="color:#0052d9;" class="el-icon-plus"></i><span style="color:#0052d9;margin-left: 3px;font-size: 12px">添加</span>
                        </div>
                    </div>
                    <div>
                        <el-table class='bigTable system' :data="deviceForm.users" border stripe tooltip-effect="dark">
                            <el-table-column align="center" type="index" width="50" label="序号">
                            </el-table-column>
                            <el-table-column label="联系人" align="center" width="130">
                                <template slot-scope="scope">
                                    <el-select style="width:100px;" size="mini" v-model="scope.row.userId"  placeholder="请选择" @change="changeUser(scope.row)">
                                        <el-option v-for="item in users" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column prop="code" label="员工编号" width="80" align="center">
                            </el-table-column>
                            <el-table-column prop="departmentName" label="部门" width="90" align="center">
                            </el-table-column>
                            <el-table-column prop="phone" label="电话" align="center" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column prop="landline" label="座机" show-overflow-tooltip align="center">
                            </el-table-column>
                            <el-table-column prop="mailBox" label="邮箱" show-overflow-tooltip align="center">
                            </el-table-column>
                            <el-table-column align="center" label="操作" width="50">
                                <template slot-scope="scope">
                                    <el-button @click="handleAddDelete(scope.$index,deviceForm)" icon="el-icon-remove-outline" title="删除" type="text" style="color:red"></el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-form-item>

                <el-form-item style="width:100%;margin-bottom: 0">
                    <div class="ub ub-pj w100">
                        <div style="color:rgba(0,0,0,.9);font-size:12px">域名：</div>
                        <div style="cursor: pointer;" @click="addAddress(deviceForm)">
                            <i style="color:#0052d9;" class="el-icon-plus"></i><span style="color:#0052d9;margin-left: 3px;font-size: 12px">添加</span>
                        </div>
                    </div>
                </el-form-item>
                <div>
                    <el-table class='bigTable system' :data="deviceForm.infos" border stripe tooltip-effect="dark">
                        <el-table-column align="center" type="index" width="50" label="序号">
                        </el-table-column>
                        <el-table-column label="域名" align="center">
                            <template slot-scope="scope">
                                <el-form-item :prop="'infos.' + scope.$index + '.domainName'" class="mb0" :rules="rules.domainName">
                                    <el-input size="mini" v-model.trim="scope.row.domainName" placeholder="请输入域名" autocomplete="off"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="IP" align="center">
                            <template slot-scope="scope">
                                <el-form-item :prop="'infos.' + scope.$index + '.ip'" class="mb0" :rules="rules.ip">
                                    <el-input size="mini" v-model.trim="scope.row.ip" placeholder="请输入IP" autocomplete="off"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="端口" align="center">
                            <template slot-scope="scope">
                                <el-form-item :prop="'infos.' + scope.$index + '.port'" class="mb0" :rules="rules.port">
                                    <el-input size="mini" type="number" v-model.trim="scope.row.port" placeholder="请输入端口" autocomplete="off"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="操作" width="50">
                            <template slot-scope="scope">
                                <el-button @click="handleAdressDelete(scope.$index,deviceForm)" title="删除" icon="el-icon-remove-outline" type="text" style="color:red"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="addDomainDialog=false" size="small">取消</el-button>
                <el-button type="primary" @click="submitForm('deviceForm')" size="small">确认</el-button>
            </span>
        </el-dialog>
        <!--编辑内容-->
        <el-dialog title="编辑业务系统" :visible.sync="editUserDialog"  width="700px" custom-class="common-dialog">
            <el-form :model="assetsFormEdit" :inline="true" :rules="rules" ref="assetsFormEdit" label-width="100px" label-position="top">
                <el-form-item label="系统名称：" prop="systemName">
                    <el-input size="small"  style="width:652px !important" clearable v-model="assetsFormEdit.systemName" placeholder="请输入业务系统名称" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item style="width:100%;">
                    <div class="ub ub-pj w100">
                        <div style="color:rgba(0,0,0,.9);font-size:12px">联系人：</div>
                        <div style="cursor: pointer;" @click="editPeoples(assetsFormEdit)">
                            <i style="color:#0052d9;" class="el-icon-plus"></i><span style="color:#0052d9;margin-left: 3px;font-size: 12px">添加</span>
                        </div>
                    </div>
                    <div>
                        <el-table class='bigTable system' :data="assetsFormEdit.users" border stripe tooltip-effect="dark">
                            <el-table-column align="center" type="index" width="50" label="序号">
                            </el-table-column>
                            <el-table-column label="联系人" prop="userId" align="center" width="130">
                                <template slot-scope="scope">
                                    <el-select style="width:100px;" size="mini" v-model="scope.row.userId" filterable placeholder="请选择" @change="changeUser(scope.row)">
                                        <el-option v-for="item in users" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column prop="code" label="员工编号" width="80" align="center">
                            </el-table-column>
                            <el-table-column prop="departmentName" label="部门" width="90" align="center">
                            </el-table-column>
                            <el-table-column prop="phone" label="电话" align="center" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column prop="landline" label="座机" show-overflow-tooltip align="center">
                            </el-table-column>
                            <el-table-column prop="mailBox" label="邮箱" show-overflow-tooltip align="center">
                            </el-table-column>
                            <el-table-column align="center" label="操作" width="50">
                                <template slot-scope="scope">
                                    <el-button @click="handleEditDelete(scope.$index,assetsFormEdit)" title="删除" icon="el-icon-remove-outline" type="text" style="color:red"></el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-form-item>

                <el-form-item style="width:100%;margin-bottom: 0">
                    <div class="ub ub-pj w100">
                        <div style="color:rgba(0,0,0,.9);font-size:12px">域名：</div>
                        <div style="cursor: pointer;" @click="editAddress(assetsFormEdit)">
                            <i style="color:#0052d9;" class="el-icon-plus"></i><span style="color:#0052d9;margin-left: 3px;font-size: 12px">添加</span>
                        </div>
                    </div>
                </el-form-item>
                <div>
                    <el-table class='bigTable system' :data="assetsFormEdit.infos" border stripe tooltip-effect="dark">
                        <el-table-column align="center" type="index" width="50" label="序号">
                        </el-table-column>
                        <el-table-column label="域名" align="center">
                            <template slot-scope="scope">
                                <el-form-item :prop="'infos.' + scope.$index + '.domainName'" class="mb0" :rules="rules.domainName">
                                    <el-input size="mini" v-model.trim="scope.row.domainName" placeholder="请输入域名" autocomplete="off"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="IP" align="center">
                            <template slot-scope="scope">
                                <el-form-item :prop="'infos.' + scope.$index + '.ip'" class="mb0" :rules="rules.ip">
                                    <el-input size="mini" v-model.trim="scope.row.ip" placeholder="请输入IP" autocomplete="off"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="端口" align="center">
                            <template slot-scope="scope">
                                <el-form-item :prop="'infos.' + scope.$index + '.port'" class="mb0" :rules="rules.port">
                                    <el-input size="mini" type="number" v-model.trim="scope.row.port" placeholder="请输入端口" autocomplete="off"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="操作" width="50">
                            <template slot-scope="scope">
                                <el-button @click="editAddressDelete(scope.$index,assetsFormEdit)" title="删除" icon="el-icon-remove-outline" type="text" style="color:red"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editUserDialog=false" size="small">取消</el-button>
                <el-button type="primary" @click="submitFormEdit('assetsFormEdit')" size="small">确认</el-button>
            </span>
        </el-dialog>

        <!--查看内容-->
        <el-dialog title="查看业务系统" :visible.sync="seeDetaildialog" width="700px" custom-class="common-dialog" class="seedetail">
                <el-descriptions size="mini" border>
                    <el-descriptions-item label="业务系统">{{seeForm.systemName}}</el-descriptions-item>
                </el-descriptions>
                        <el-table class='bigTable system mt-1' :data="seeForm.users" border stripe tooltip-effect="dark" :row-style="{ height: '32px' }">
                            <el-table-column align="center" type="index" width="50" label="序号">
                            </el-table-column>
                            <el-table-column label="联系人" prop="chineseName" width="100" align="center">
                            </el-table-column>
                            <el-table-column prop="code" label="员工编号" width="80" align="center">
                            </el-table-column>
                            <el-table-column prop="departmentName" label="部门" width="100" align="center">
                            </el-table-column>
                            <el-table-column prop="phone" label="电话" show-overflow-tooltip align="center">
                            </el-table-column>
                            <el-table-column prop="landline" label="座机" show-overflow-tooltip align="center">
                            </el-table-column>
                            <el-table-column prop="mailBox" label="邮箱" align="center">
                            </el-table-column>
                        </el-table>
                        <el-table class='bigTable system mt-1' :data="seeForm.infos" border stripe tooltip-effect="dark" :row-style="{ height: '32px' }"
                :header-row-style="{ height: '32px' }">
                            <el-table-column align="center" type="index" width="50" label="序号">
                            </el-table-column>
                            <el-table-column prop="domainName" label="域名" align="center">
                            </el-table-column>
                            <el-table-column prop="ip" label="IP" align="center">
                            </el-table-column>
                            <el-table-column prop="port" label="端口" align="center">
                            </el-table-column>
                            <el-table-column prop="extranet_ip" label="外网IP" align="center">
                            </el-table-column>
                            <el-table-column prop="extranet_port" label="外网端口" align="center">
                            </el-table-column>
                            <el-table-column prop="fictitious_ip" label="虚IP" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column prop="fictitious_port" label="虚端口" show-overflow-tooltip>
                            </el-table-column>
                        </el-table>
        </el-dialog>

        <!--删除-->
        <DeleteDialog
            :dialogVisible = userDeleteDialog
            @delete="handleDelete"
            @cancel="userDeleteDialog = false">
        </DeleteDialog>
        <DeleteDialog
            :dialogVisible = userDeleteAllDialog
            @delete="handleDelete"
            @cancel="userDeleteAllDialog = false">
        </DeleteDialog>
    </div>
</template>

<script>
import {
    get_types,
    addSystem,
    updateSystem,
    getSystem,
    delectSystem,
    getUsers,
    systemExportExcel1,
    systemTemplate
} from '../../server/assets/api.js'
export default {
    name: 'User',
    data() {
        return {
            tabHeight: document.body.clientHeight - 260,
            fileList: [],
            existIp: '',
            types: [],
            loading: true,
            total_num: 0,
            tableData: [],
            multipleSelection: [],
            get_params: {
                page: 1,
                size: 20,
                systemName: '',
                domainName: '',
                ip: ''
            },
            userDeleteDialog: false,
            userDeleteAllDialog: false,
            delIds: [],
            addDomainDialog: false,
            editUserDialog: false,
            seeDetaildialog: false,
            ips: [{
                value: ''
            }],
            upstreamVoList: [{
                state: '1',
                value: ''
            }],
            deviceForm: {
                systemName: '',
                domainName: '',
                ip: '',
                port: '',
                users: [],
                infos: []
            },
            assetsFormEdit: {
                id: '',
                systemName: '',
                domainName: '',
                ip: '',
                port: '',
                users: [],
                infos: []
            },
            seeForm: {
                id: '',
                systemName: '',
                users: [],
                infos: []
            },
            users: [],
            rules: {
                systemName: [{
                    required: true,
                    message: '请输入业务系统名称',
                    trigger: 'blur'
                }],
                ip: [{
                    required: true,
                    message: 'IP不能为空',
                    trigger: 'blur'
                },
                {
                    pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
                    message: '请填写正确的IP',
                    trigger: 'blur'
                }
                ],
                port: [{
                    required: true,
                    message: '请输入端口',
                    trigger: 'blur'
                }],
                domainName: [{
                    required: true,
                    message: '请输入域名',
                    trigger: 'blur'
                }]
            }
        }
    },
    watch: {
        addDomainDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.deviceForm.resetFields()
                    this.deviceForm.infos = []
                    this.deviceForm.users = []
                }
            }
        },
        editUserDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.assetsFormEdit.resetFields()
                    this.assetsFormEdit.infos = []
                    this.assetsFormEdit.users = []
                }
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            // this.getTypes();
            this.initUser()
            this.get_data()
        })
    },
    computed: {
        header() {
            return { token: this.$getlocalStorage('initInfo').user.token }
        }
    },
    methods: {
        tableRowClassName({ row, rowIndex }) {
            console.log(rowIndex)
            if (rowIndex % 2) {
                return 'table-row2'
            } else {
                return 'table-row1'
            }
        },
        reset() {
            this.get_params = {
                page: 1,
                size: 20,
                systemName: '',
                domainName: '',
                ip: ''
            }
            this.get_data()
        },
        changeUser(row) {
            let selected = this.users.filter(item => item.value === row.userId)
            console.log('selected', selected)
            if (selected.length > 0) {
                row.phone = selected[0].phone
                row.departmentName = selected[0].depName
                row.mailBox = selected[0].mailbox
                row.code = selected[0].code
                row.landline = selected[0].landline
            } else {
                row.phone = ''
                row.departmentName = ''
                row.mailBox = ''
                row.code = ''
                row.landline = ''
            }
        },
        resetData(val) {
            if ((val + '' === '') || (val == null) || (val == undefined) || (val == 'undefined')) {
                return ''
            } else {
                return val
            }
        },
        downData() {
            let data = {
                queryData: {
                },
                paramsData: {
                    systemName: this.resetData(this.get_params.systemName),
                    domainName: this.get_params.domainName,
                    ip: this.get_params.ip
                }
            }
            systemExportExcel1(data).then(res => {
                console.log(res)
            })
        },
        downLoad() {
            // window.location.href = '/api/assets-manage/manage/system/template'
            let data = {
                queryData: {},
                paramsData: {}
            }
            systemTemplate(data).then(res => {
                console.log(res)
            })
        },
        addPeoples(deviceForm) {
            deviceForm.users.push({
                userId: '',
                departmentName: '',
                mailBox: '',
                phone: '',
                code: '',
                landline: ''
            })
        },
        addAddress(deviceForm) {
            deviceForm.infos.push({
                domainName: '',
                ip: '',
                port: ''
            })
        },
        handleAddDelete(index, deviceForm) {
            deviceForm.users.splice(index, 1)
        },
        handleAdressDelete(index, deviceForm) {
            deviceForm.infos.splice(index, 1)
        },
        editPeoples(assetsFormEdit) {
            assetsFormEdit.users.push({
                userId: '',
                departmentName: '',
                mailBox: '',
                phone: '',
                code: '',
                landline: ''
            })
        },
        editAddress(assetsFormEdit) {
            console.log(assetsFormEdit)
            assetsFormEdit.infos.push({
                domainName: '',
                ip: '',
                port: ''
            })
        },
        handleEditDelete(index, assetsFormEdit) {
            assetsFormEdit.users.splice(index, 1)
        },
        editAddressDelete(index, assetsFormEdit) {
            console.log(index, assetsFormEdit)
            assetsFormEdit.infos.splice(index, 1)
        },

        handleSuccess(response, file, fileList) {
            console.log('response', response)
            if (response.code == 1) {
                this.$message({
                    message: '文件上传成功!',
                    type: 'success'
                })
                this.get_data()
            } else {
                this.$message({
                    message: response.message,
                    type: 'warning'
                })
            }
        },
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        initUser() {
            this.users = []
            let data = {
                queryData: {},
                paramsData: {}
            }
            getUsers(data).then(res => {
                console.log('获取所有用户', res)
                if (res.length > 0) {
                    res.forEach(item => {
                        let obj = {}
                        obj.value = item.id
                        obj.label = item.chineseName
                        obj.phone = item.phone
                        obj.depName = item.depName
                        obj.mailbox = item.mailbox
                        obj.code = item.code
                        obj.landline = item.landline
                        this.users.push(obj)
                    })
                }
            }).catch(error => {
                console.log('error' + error)
            })
        },
        getTypes() {
            this.types = []
            let data = {}
            get_types(data).then(res => {
                console.log(res)
                if (res.length > 0) {
                    res.forEach(item => {
                        let obj = {}
                        obj.value = item.id
                        obj.label = item.name
                        this.types.push(obj)
                    })
                }
            }).catch(error => {
                console.log('error' + error)
            })
        },

        searchAssets() {
            this.get_params.page = 1
            this.get_data()
        },
        get_data() {
            this.tableData = []
            let data = {
                queryData: {
                    page: this.get_params.page,
                    pageSize: this.get_params.size
                },
                paramsData: {
                    systemName: this.get_params.systemName,
                    domainName: this.get_params.domainName,
                    ip: this.get_params.ip
                }
            }
            getSystem(data).then(res => {
                console.log('getSystem', res)
                this.total_num = res.total
                if (res.records.length > 0) {
                    res.records.forEach(item => {
                        this.tableData.push({
                            create_time: item.createTime,
                            systemName: item.systemName,
                            id: item.id,
                            status: item.status,
                            version: item.version,
                            users: item.users,
                            infos: item.infos
                        })
                    })
                }
                this.loading = false
            }).catch(error => {
                this.loading = false
                console.log('error' + error)
            })
        },
        addUser() {
            this.addDomainDialog = true
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.addAssets()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        addAssets() {
            let data = {
                queryData: {},
                paramsData: {
                    systemName: this.deviceForm.systemName,
                    users: this.deviceForm.users.map(item => { return { userId: item.userId } }),
                    infos: this.deviceForm.infos
                }
            }
            if (this.deviceForm.infos.length == 0) {
                this.$message.warning('请添加域名')
                return
            }
            if (this.deviceForm.users && this.deviceForm.users[0] && !this.deviceForm.users[0].userId) {
                this.$message.warning('已添加联系人不能为空')
                return
            }
            if (this.deviceForm.infos && this.deviceForm.infos[0] && (!this.deviceForm.infos[0].domainName || !this.deviceForm.infos[0].ip)) {
                this.$message.warning('已添加域名或ip不能为空')
                return
            }
            console.log('data', data)
            addSystem(data).then(res => {
                console.log(res)
                this.addDomainDialog = false
                this.$message({
                    message: '添加成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(error => {
                // this.addDomainDialog = false
                console.log('error' + error)
            })
        },
        editAssets() {
            let data = {
                queryData: {},
                paramsData: {
                    id: this.assetsFormEdit.id,
                    systemName: this.assetsFormEdit.systemName,
                    users: this.assetsFormEdit.users.map(item => { return { userId: item.userId } }),
                    infos: this.assetsFormEdit.infos
                }
            }
            if (this.assetsFormEdit.infos.length == 0) {
                this.$message.warning('请添加域名')
                return
            }
            if (this.assetsFormEdit.users && this.assetsFormEdit.users[0] && !this.assetsFormEdit.users[0].userId) {
                this.$message.warning('已添加联系人不能为空')
                return
            }
            if (this.assetsFormEdit.infos && this.assetsFormEdit.infos[0] && (!this.assetsFormEdit.infos[0].domainName || !this.assetsFormEdit.infos[0].ip)) {
                this.$message.warning('已添加域名或ip不能为空')
                return
            }
            updateSystem(data).then(res => {
                console.log(res)
                this.editUserDialog = false
                this.$message({
                    message: '修改成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(error => {
                // this.editUserDialog = false
                console.log('error' + error)
            })
        },
        submitFormEdit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.editAssets()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        handleSelectionChange(val) {
            console.log(val)
            this.multipleSelection = []
            if (val.length > 0) {
                val.forEach(item => {
                    this.multipleSelection.push(item.id)
                })
            }
        },
        delAllUserBtn() {
            if (this.multipleSelection.length > 0) {
                this.userDeleteAllDialog = true
                this.delIds = this.multipleSelection
            } else {
                this.$message({
                    message: '请选择要删除的业务系统',
                    type: 'warning'
                })
            }
        },
        delUserBtn(row) {
            this.delIds = [row.id]
            this.userDeleteDialog = true
        },
        handleDelete() {
            let data = {
                queryData: {
                },
                paramsData: {
                    ids: this.delIds
                }
            }
            delectSystem(data).then(res => {
                this.userDeleteDialog = false
                this.userDeleteAllDialog = false
                console.log('删除成功')
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(error => {
                this.userDeleteDialog = false
                this.userDeleteAllDialog = false
                console.log(error + 'error')
            })
        },
        handleSizeChange(val) {
            this.get_params.size = val
            this.get_data()
        },
        handleCurrentChange(val) {
            this.get_params.page = val
            this.get_data()
        },
        handleSee(row) {
            this.seeForm = {
                id: row.id,
                systemName: row.systemName,
                users: JSON.parse(JSON.stringify(row.users)),
                infos: JSON.parse(JSON.stringify(row.infos))
            }
            this.seeDetaildialog = true
        },
        handleEdit(row) {
            console.log('row', row)
            this.editUserDialog = true
            this.assetsFormEdit = {
                id: row.id,
                systemName: row.systemName,
                users: [],
                infos: []
            }
            row.users.forEach(item => {
                this.assetsFormEdit.users.push({
                    userId: item.userId,
                    phone: item.phone,
                    departmentName: item.departmentName,
                    chineseName: item.chineseName,
                    mailBox: item.mailBox,
                    code: item.code,
                    landline: item.landline
                })
            })
            row.infos.forEach(item => {
                this.assetsFormEdit.infos.push({
                    domainName: item.domainName,
                    ip: item.ip,
                    port: item.port
                })
            })
        },
        handleView(row) {
            this.$setsessionStorage('assetsInfo', row)
            this.$router.push({
                path: this.$route.path + '/tp'
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .seedetail{
        ::v-deep .el-descriptions-item__label{
            width:100px !important;
        }
    }
    .el-input.ips {
        display: block;
        width: 100%;
    }
    .roles ::v-deep .el-tag.el-tag--success {
        background-color: rgba(0, 0, 0, 0);
        border-color: #01c5ff;
        color: #00fdff;
    }
    .event  ::v-deep  .el-dialog {
        position: absolute;
        top: 110px;
        left: 50%;
        margin: 0 !important;
        transform: translateX(-50%);
        max-height: calc(100% - 150px);
        max-width: calc(100% - 50px);
        display: flex;
        flex-direction: column;
    }
    .event  ::v-deep .el-dialog__body {
        overflow: auto;
    }
    .el-form--inline  ::v-deep .mb0{
        margin: 0!important;

    }
    .mb0  ::v-deep .el-form-item__error{
        position: static!important;
        text-align: left;
    }
    .bigTable ::v-deep .el-tag.el-tag--success {
        background-color: transparent;
        border-color: #01c5ff;
        color: #00fdff;
    }
    .event .el-input.is-disabled .el-input__inner {
        box-shadow: none;
    }
</style>
