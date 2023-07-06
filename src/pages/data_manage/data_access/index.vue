<template>
    <div class="event  data" style="box-sizing: border-box;">
        <SearchTop @search="searchData" @reset="reserFun" @isOpen="isOpen1">
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params">
                    <el-form-item label="任务名称:" label-width="80px">
                        <el-input placeholder="请输入" clearable v-model.trim="get_params.taskName" size="small"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params">
                    <el-form-item label="接入类型:" label-width="80px">
                        <el-select size="small" filterable clearable v-model.trim="get_params.type" placeholder="请选择" style="width: 100%">
                            <el-option v-for="(item, index) in typeList" :key="index" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params">
                    <el-form-item label="解析规则:" label-width="80px">
                        <el-select size="small" filterable clearable v-model.trim="get_params.ruleId" placeholder="请选择" style="width: 100%">
                            <el-option v-for="(item,index) in ruleIdList" :key="index" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params">
                    <el-form-item label="工作节点:" label-width="80px">
                        <el-select  size="small" filterable clearable v-model.trim="get_params.nodeId" placeholder="请选择" style="width: 100%">
                            <el-option v-for="(item, index) in nodeIdList" :key="index" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params">
                    <el-form-item label="数据源目标:" label-width="80px">
                        <el-input placeholder="请输入" clearable v-model.trim="get_params.dataSourceTaget" size="small"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params">
                    <el-form-item label="数据源状态:" label-width="80px">
                        <el-select size="small" filterable clearable v-model.trim="get_params.dataSourceType" placeholder="请选择" style="width: 100%">
                            <el-option v-for="(item,index) in dataSourceTypeList" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params">
                    <el-form-item label="对接状态:" label-width="80px">
                        <el-select size="small" filterable clearable v-model.trim="get_params.status" placeholder="请选择" style="width: 100%">
                            <el-option v-for="(item,index) in statusList" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-col>
        </SearchTop>
        <div class="list-container">
            <div class="ub ub-pj w100 mb-1">
                <div class="list-tips">数据接入</div>
                <div class="ub">
                    <!-- <opt-btn style="margin-right: 10px;" title="点击查看帮助手册" icon="el-icon-question" @click="$pushRouter('/help_manual/help_data_center')"></opt-btn> -->
                    <el-button v-per="['data_access_add']" size="small" icon="el-icon-plus" type="primary" @click="toAdd">新 建</el-button>
                    <el-upload
                        :headers="header"
                        action="/api/data-center/manage/dataAccess/import"
                        name="file"
                        :file-list="fileList"
                        :show-file-list="false"
                        :on-success="handleSuccess"
                        style="display: inline-block;margin-left: 10px">
                        <el-button v-per="['data_access_import']" size="small" icon="iconfont icon-daoru" type="primary">导 入</el-button>
                    </el-upload>
                    <el-button v-per="['data_access_export']" style="margin-left: 10px" size="small" icon="iconfont icon-daochu" type="primary" @click="exportAll">导 出</el-button>
                    <el-button v-per="['data_access_effect']" size="small" icon="iconfont icon-jiefeng" type="primary" @click="takeEffectAll">数据生效</el-button>
                    <el-button v-per="['data_access_expire']" size="small" icon="iconfont icon-fengdu" type="primary" @click="invalidAll">数据失效</el-button>
                    <el-button v-per="['data_access_del']" size="small" icon="el-icon-delete" type="danger" @click="handleDeleteAll">刪 除</el-button>
                </div>
            </div>
            <el-table
                :row-class-name="tableRowClassName"
                ref="multipleTable"
                v-loading="loading"
                class='bigTable'
                :data="tableData"
                :row-key="(row)=>{ return row.id}"
                border
                stripe
                tooltip-effect="dark"
                @selection-change="handleSelectionChange"
                :height="tableHeight"
                :row-style="{ height: '32px' }"
                :header-row-style="{ height: '32px' }">
                <el-table-column align="center" type="selection" :reserve-selection="true" width="50"></el-table-column>
                <el-table-column align="center" type="index" width="50" label="序号" :index="indexMethod">
                </el-table-column>
                <el-table-column prop="taskName" label="任务名称" width="150">
                </el-table-column>
                <el-table-column prop="ruleName" label="解析规则" show-overflow-tooltip>
                    <!-- <template slot-scope="scope">
                        <div>{{ scope.row.ruleId.length>0?scope.row.ruleId.length.join(','):'' }}</div>
                    </template> -->
                </el-table-column>
                <el-table-column prop="type" label="接入类型" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div>{{ scope.row.type | typeText }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="nodeName" label="工作节点" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="dataSourceTaget" label="数据源目标" show-overflow-tooltip>
                    <!-- <template slot-scope="scope">
                        <el-tag type="success" size="mini" v-for="(item,index) in scope.row.dataSourcTarget" :key="index">{{item.data}}</el-tag>
                    </template> -->
                </el-table-column>
                <el-table-column prop="dataSourceType" label="数据源状态" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div class="ub">
                            <div :class="setDataSourceTypeColor(scope.row.dataSourceType)">{{ scope.row.dataSourceType | dataSourceTypeText }}</div>
                            <!-- <span style="color: rgba(0, 0, 0, 0.9)">{{ scope.row.dataSourceType | dataSourceTypeText }}</span> -->
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="对接状态" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span :style="setStatusColor(scope.row.status )">{{ scope.row.status | statusText }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="200" fixed="right" class-name="deepBg">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="handleSee(scope.row)">查看</el-button>
                        <!-- <opt-btn @click="changeOption(1,scope.row)" title="发送" icon="iconfont icon-fasong"></opt-btn> -->
                        <el-button v-per="['data_access_effect']" type="text" size="small" @click="changeOption(5,scope.row)" v-if="scope.row.status==2">生效</el-button>
                        <el-button v-per="['data_access_expire']" type="text" size="small" @click="changeOption(4,scope.row)" v-if="scope.row.status==1">失效</el-button>
                        <el-dropdown trigger="click">
                            <span style="color: #409EFF;font-size: 12px;margin-left: 6px;margin-right: 6px;cursor: pointer;">
                                更多
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>
                                    <el-button v-per="['data_access_export']" type="text" size="small" @click="handleExport(scope.row.id)">导出</el-button>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button v-per="['data_access_edit']" type="text" size="small" @click="changeOption(2,scope.row)">编辑</el-button>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <el-button v-per="['data_access_del']" type="text" size="small" @click="changeOption(3,scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="total_num>0" :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size" @pagination="getList" />
        </div>
        <ViewDialog
            ref="viewDialog"
            @close="detailDialog = false"
            :seeForm="seeForm"
            :configContentData="configContentData"
            :dialogVisible="detailDialog"></ViewDialog>
        <DeleteDialog
            :dialogVisible = delDialog
            @delete="delConfim"
            @cancel="delDialog = false">
        </DeleteDialog>
        <DeleteDialog
            :dialogVisible = deleteAllDialog
            @delete="deleteAllData"
            @cancel="deleteAllDialog = false">
        </DeleteDialog>
        <el-dialog
            title="提示"
            :visible.sync="invalidDialog"
            width="30%"
            custom-class="attendance-dialog"
            v-loading="invaliding"
            element-loading-text="拼命失效中,请耐心等待!"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.5)"
        >
            <span class="custom-text">确定失效吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="invalidDialog = false">取 消</el-button>
                <Debounce :time='10000' :isDebounce="2">
                    <el-button size="small" type="primary" @click.native="invalidConfim">确 定</el-button>
                </Debounce>
            </span>
        </el-dialog>
        <el-dialog
            title="失效选中的数据"
            :visible.sync="invalidAllDialog"
            width="30%"
            custom-class="attendance-dialog"
            v-loading="invaliding"
            element-loading-text="拼命失效中,请耐心等待!"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.5)"
        >
            <span>确定失效吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="invalidAllDialog = false">取 消</el-button>
                <Debounce :time='10000' :isDebounce="2">
                    <el-button size="small" type="primary" @click.native="invalidAllConfim">确 定</el-button>
                </Debounce>
            </span>
        </el-dialog>

        <el-dialog
            title="提示"
            :visible.sync="takeEffectDialog"
            width="30%"
            custom-class="attendance-dialog"
            v-loading="invaliding"
            element-loading-text="拼命生效中,请耐心等待!"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.5)"
        >
            <span>确定生效吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="takeEffectDialog = false">取 消</el-button>
                <Debounce :time='10000' :isDebounce="2">
                    <el-button size="small" type="primary" @click.native="takeEffectConfim">确 定</el-button>
                </Debounce>
            </span>
        </el-dialog>
        <el-dialog
            title="生效选中的数据"
            :visible.sync="takeEffectAllDialog"
            width="30%"
            custom-class="attendance-dialog"
            v-loading="invaliding"
            element-loading-text="拼命生效中,请耐心等待!"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.5)"
        >
            <span>确定生效吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="takeEffectAllDialog = false">取 消</el-button>
                <Debounce :time='10000' :isDebounce="2">
                    <el-button size="small" type="primary" @click.native="takeEffectAllConfim">确 定</el-button>
                </Debounce>
            </span>
        </el-dialog>

        <el-dialog
            title="提示"
            :visible.sync="sendDialog"
            width="700px"
            custom-class="attendance-dialog"
            v-loading="sending"
            element-loading-text="发送中,请耐心等待!"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.5)"
        >
            <div
                class="w100"
            >
                <!-- <span>确定生效吗？</span> -->
                <span>确定发送吗？</span>
                <span slot="footer" class="ub ub-pe dialog-footer" style="margin-top: 40px;">
                    <el-button size="small" style="margin-left: 10px;" @click="sendDialog = false">取 消</el-button>
                    <Debounce :time='10000' :isDebounce="2">
                        <el-button size="small" type="primary" @click.native="validSend">发 送</el-button>
                    </Debounce>
                </span>
            </div>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="exportDialog" width="30%" custom-class="attendance-dialog">
            <span>确定创建导出吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" style="margin-left: 10px;" @click="exportDialog = false">取 消</el-button>
                <el-button size="small" type="primary" @click="confimDownload">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="导出规则" :visible.sync="exportAllDialog" width="30%" custom-class="attendance-dialog">
            <span>确定创建导出吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="exportAllDialog = false">取 消</el-button>
                <el-button size="small" type="primary" @click="confimAllDownload">确 定</el-button>
            </span>
        </el-dialog>
    </div>

</template>

<script>
// import initData from '@/mixins/initData.js'
import Enum from './enum.js'
import { getLogstashNodes, list, deleteData, send, download, getRules, downloadLogstash, stop, start } from '@/server/data_manage/data_access.js'
import ViewDialog from './ViewDialog'
export default {
    name: 'DataAccess',
    // mixins: [initData],
    components: {
        ViewDialog
    },
    data() {
        return {
            kaiguan: '',
            tableHeight: document.body.clientHeight - 270,
            nodeIdList: [],
            configContentData: {},
            statusData: '',
            typeList: Enum.typeList(),
            fileList: [],
            deleteAllDialog: false,
            takeEffectAllDialog: false,
            invalidAllDialog: false,
            statusList: [
                {
                    label: '生效',
                    value: 1
                },
                {
                    label: '失效',
                    value: 2
                }
            ],
            dataSourceTypeList: [
                {
                    label: '异常',
                    value: 0
                },
                {
                    label: '运行',
                    value: 1
                },
                {
                    label: '未知',
                    value: 2
                }
            ],
            ruleIdList: [],
            filters: [{
                text: '默认',
                value: ''
            },
            {
                text: '未部署',
                value: 0
            },
            {
                text: '已部署',
                value: 1
            },
            {
                text: '失效',
                value: 2
            }
            ],
            invalidDialog: false,
            takeEffectDialog: false,
            cities: [],
            rules: [],
            analysisTypes: [{
                label: '正则表达式',
                value: 1
            }, {
                label: 'Grok正则',
                value: 0
            }, {
                label: '分隔符',
                value: 2
            }, {
                label: '键值对',
                value: 3
            }, {
                label: 'JSON',
                value: 4
            }],
            types: [{
                label: 'SYSLOG',
                value: 0
            }, {
                label: 'KAFKA',
                value: 1
            }, {
                label: '目录',
                value: 2
            }, {
                label: '数据库',
                value: 3
            }],
            exportDialog: false,
            exportAllDialog: false,
            sendDialog: false,
            delId: '',
            delDialog: false,
            detailDialog: false,
            formLabelWidth: '100px',
            seeForm: {},
            search_time: null,
            total_num: 0,
            loading: false,
            first_attack_time: null,
            last_attack_time: null,
            nodes: [],
            sendFrom: {
                id: '',
                nodeId: ''
            },
            invaliding: false,
            sending: false,
            get_params: {
                page: 1,
                size: 20,
                taskName: '',
                status: '',
                type: '',
                ruleId: '',
                nodeId: '',
                dataSourceTaget: '',
                dataSourceType: ''
                // type:'',
                // rule:'',
                // analysisType:'',

            },
            tableData: [],
            multipleSelection: []
        }
    },
    filters: {
        typeText(val) {
            if (val == '1') {
                return '目录 '
            } else if (val == '2') {
                return '数据库'
            } else if (val == '3') {
                return 'KAFKA'
            } else if (val == '4') {
                return 'SYSLOG'
            } else if (val == '5') {
                return 'HDFS'
            } else if (val == '6') {
                return 'ES'
            } else {
                return ''
            }
        },
        dataSourceTypeText(val) {
            if (val == '0') {
                return '异常'
            } else if (val == '1') {
                return '运行'
            } else if (val == '2') {
                return '未知'
            } else {
                return ''
            }
        },
        statusText(val) {
            if (val == '1') {
                return '生效'
            } else if (val == '2') {
                return '失效'
            } else {
                return ''
            }
        }
    },
    watch: {
        kaiguan(val) {
            if (val) {
                this.tableHeight = document.body.clientHeight - 320
            } else {
                this.tableHeight = document.body.clientHeight - 270
            }
        }
        // sendDialog: function(val, oldVla) {
        //     if (!val) {
        //         this.$refs.sendFrom.resetFields()
        //     }
        // }
    },
    mounted() {
        this.$nextTick(() => {
            this.getLogstashNodesData()
            this.getList()
            this.getRulesData()
        })
    },
    computed: {
        header() {
            return { token: this.$getlocalStorage('initInfo').user.token }
        },
        downloadUrl() {
            return '/api/rule/manage/rule/export'
        }
    },
    methods: {
        isOpen1(val) {
            console.log(val)
            this.kaiguan = val
        },
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex % 2) {
                return 'table-row2'
            } else {
                return 'table-row1'
            }
        },
        handleExport(val) {
            let data = {
                queryData: {
                },
                paramsData: {
                    ids: [val]
                }
            }
            download(data).then(res => {
                this.$message({
                    message: '下载成功',
                    type: 'success'
                })
            }).catch(error => {
                console.log(error + 'error')
            })
        },
        getLogstashNodesData() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            getLogstashNodes(data).then(res => {
                this.nodeIdList = res
            }).catch(error => {
                console.log('error', error)
            })
        },
        getRulesData() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            getRules(data).then(res => {
                this.ruleIdList = res
            }).catch(error => {
                console.log('error', error)
            })
        },
        setDataSourceTypeColor(val) {
            if (val == 0) {
                return 'data-source-zero'
            } else if (val == 1) {
                return 'data-source-one'
            } else if (val == 2) {
                return 'data-source-two'
            } else {
                return ''
            }
        },
        setStatusColor(val) {
            if (val == 1) {
                return 'color: #0052d9'
            } else if (val == 2) {
                return 'color: rgba(0, 0, 0, 0.4);'
            }
        },
        exportAll() {
            this.exportAllDialog = true
            // if (this.multipleSelection.length === 0) {
            //     this.$message({
            //         message: '请勾选导出的行',
            //         type: 'warning'
            //     })
            // } else {
            //     this.exportAllDialog = true
            // }
        },
        confimDownload() {
            let data = {
                queryData: {},
                paramsData: {
                    ids: [this.delId]
                }
            }
            download(data).then(res => {
                console.log('走没走')
                this.exportDialog = false
                this.$message({
                    message: '下载成功',
                    type: 'success'
                })
            }).catch(error => {
                this.exportDialog = false
                console.log('error', error)
            })
        },
        confimAllDownload() {
            let ids = []
            this.multipleSelection.forEach(item => {
                console.log(item)
                ids.push(item.id)
            })
            let data = {
                queryData: {},
                paramsData: {
                    ids: ids
                }
            }
            download(data).then(res => {
                this.exportAllDialog = false
                this.$message({
                    message: '下载成功',
                    type: 'success'
                })
            }).catch(error => {
                this.exportAllDialog = false
                console.log(error + 'error')
            })
        },
        handleSuccess(response, file, fileList) {
            console.log('response', response)
            if (response.code == 1) {
                this.$message({
                    message: '文件上传成功!',
                    type: 'success'
                })
                this.getList()
            } else {
                this.$message({
                    message: response.message,
                    type: 'warning'
                })
            }
        },
        takeEffectAll() {
            if (this.multipleSelection.length === 0) {
                this.$message({
                    message: '请勾选生效的行',
                    type: 'warning'
                })
            } else {
                this.takeEffectAllDialog = true
            }
        },
        invalidAll() {
            if (this.multipleSelection.length === 0) {
                this.$message({
                    message: '请勾选失效的行',
                    type: 'warning'
                })
            } else {
                this.invalidAllDialog = true
            }
        },
        handleDeleteAll() {
            if (this.multipleSelection.length === 0) {
                this.$message({
                    message: '请勾选删除的行',
                    type: 'warning'
                })
            } else {
                this.deleteAllDialog = true
            }
        },
        deleteAllData() {
            let ids = []
            this.multipleSelection.forEach(item => {
                console.log(item)
                ids.push(item.id)
            })
            let data = {
                queryData: {},
                paramsData: {
                    ids: ids
                }
            }
            deleteData(data).then(res => {
                this.deleteAllDialog = false
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.getList()
                }, 1000)
            }).catch(error => {
                this.deleteAllDialog = false
                console.log(error + 'error')
            })
        },
        reserFun() {
            this.get_params.taskName = ''
            this.get_params.status = ''
            this.get_params.type = ''
            this.get_params.ruleId = ''
            this.get_params.nodeId = ''
            this.get_params.dataSourceTaget = ''
            this.get_params.dataSourceType = ''
            setTimeout(() => {
                this.getList()
            }, 1000)
        },
        shaixuan(val) {
            this.get_params.status = val
            this.getList()
        },
        changeOption(value, row) {
            console.log(value, row)
            if (value == 2) {
                this.$setlocalStorage('dataAccessInfo', row)
                this.$router.push({
                    name: 'data_manage_data_access_add'
                })
            } else if (value == 3) {
                this.delId = row.id
                this.delDialog = true
            } else if (value == 1) {
                this.sendFrom.id = row.id
                this.sendFrom.nodeId = row.nodeId
                this.sendDialog = true
            } else if (value == 4) {
                this.delId = row.id
                this.statusData = row.status
                this.invalidDialog = true
            } else if (value == 5) {
                this.delId = row.id
                this.statusData = row.status
                this.takeEffectDialog = true
            } else if (value == 6) {
                this.delId = row.id
                this.exportDialog = true
            }
        },
        toAdd() {
            this.$router.push({
                name: 'data_manage_data_access_add'
            })
        },
        handleEdit() {
            this.$router.push({
                name: 'data_center_data_edit'
            })
        },
        handleSend(row) {
            this.sendDialog = true
            this.delId = row.id
        },
        delConfim() {
            let data = {
                queryData: {},
                paramsData: {
                    ids: [this.delId]
                }
            }
            deleteData(data).then(res => {
                this.delDialog = false
                this.$message({
                    message: '删除成功！',
                    type: 'success'
                })
                setTimeout(() => {
                    this.getList()
                }, 1500)
            }).catch(error => {
                console.log('error', error)
            })
        },
        invalidConfim() {
            let data = {
                queryData: {},
                paramsData: {
                    ids: [this.delId],
                    status: 2
                }
            }
            stop(data).then(res => {
                this.invalidDialog = false
                this.$message({
                    message: '失效成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.getList()
                }, 1500)
            }).catch(error => {
                console.log('error', error)
            })
        },
        invalidAllConfim() {
            let ids = []
            this.multipleSelection.forEach(item => {
                console.log(item)
                ids.push(item.id)
            })
            let data = {
                queryData: {},
                paramsData: {
                    ids: ids,
                    status: 2
                }
            }
            stop(data).then(res => {
                this.invalidAllDialog = false
                this.$message({
                    message: '失效成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.getList()
                }, 1000)
            }).catch(error => {
                this.invalidAllDialog = false
                console.log(error + 'error')
            })
        },
        takeEffectConfim() {
            let data = {
                queryData: {},
                paramsData: {
                    ids: [this.delId],
                    status: 1
                }
            }
            start(data).then(res => {
                this.takeEffectDialog = false
                this.$message({
                    message: '生效成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.getList()
                }, 1500)
            }).catch(error => {
                console.log('error', error)
            })
        },
        takeEffectAllConfim() {
            let ids = []
            this.multipleSelection.forEach(item => {
                console.log(item)
                ids.push(item.id)
            })
            let data = {
                queryData: {},
                paramsData: {
                    ids: ids,
                    status: 1
                }
            }
            start(data).then(res => {
                this.takeEffectAllDialog = false
                this.$message({
                    message: '生效成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.getList()
                }, 1000)
            }).catch(error => {
                this.takeEffectAllDialog = false
                console.log(error + 'error')
            })
        },
        validSend() {
            this.sending = true
            let data = {
                queryData: {},
                paramsData: {
                    id: this.sendFrom.id,
                    nodeId: this.sendFrom.nodeId
                }
            }
            send(data).then(res => {
                this.sending = false
                this.sendDialog = false
                this.$message({
                    message: '发送成功！',
                    type: 'success'
                })
                setTimeout(() => {
                    this.getList()
                }, 1500)
            }).catch(error => {
                this.$message({
                    message: '请求超时！',
                    type: 'warning'
                })
                this.sending = false
                console.log('error', error)
            })
        },
        getList() {
            this.tableData = []
            this.loading = true
            let data = {
                queryData: {
                    page: this.get_params.page,
                    pageSize: this.get_params.size
                },
                paramsData: {
                    taskName: this.get_params.taskName,
                    ruleId: this.get_params.ruleId,
                    type: this.get_params.type,
                    nodeId: this.get_params.nodeId,
                    dataSourceTaget: this.get_params.dataSourceTaget,
                    dataSourceType: this.get_params.dataSourceType,
                    status: this.get_params.status
                }
            }
            list(data).then(res => {
                console.log('数据接入列表', res)
                this.loading = false
                this.total_num = res.total
                this.tableData = res.records
            }).catch(error => {
                this.loading = false
                console.log('error', error)
            })
        },
        handleSee(obj) {
            this.seeForm = obj
            this.configContentData = JSON.parse(obj.configContent)
            this.detailDialog = true
        },
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        searchData() {
            this.get_params.page = 1
            this.getList()
        },
        handleSizeChange(val) {
            this.get_params.size = val
            this.getList()
        },
        handleCurrentChange(val) {
            this.get_params.page = val
            this.getList()
        },
        handleSelectionChange(val) {
            console.log(val)
            this.multipleSelection = val
        }
    }
}
</script>

<style lang="scss" scoped>
.custom-star {
    .custom-text {
        color: #fff;
    }
}
.data-source-zero {
    width: 80px;
    height: 18px;
    background-color: #fad7dd;
    border-radius: 11px;
    text-align: center;
    line-height: 18px;
    color: #ba2e2f;
}
.data-source-one {
    width: 80px;
    height: 18px;
    background-color: #ccf6e4;
    border-radius: 11px;
    text-align: center;
    line-height: 18px;
    color: #078853;
}
.data-source-two {
    width: 80px;
    height: 18px;
    background-color: #e3e6ea;
    border-radius: 11px;
    text-align: center;
    line-height: 18px;
    color: #96989b;
}
.reset-btn {
    width: 80px;
    height: 30px;
    background-color: #041f38;
    box-shadow: inset 0px 0px 10px 0px rgba(0, 167, 245, 0.97);
    border: solid 1px #39caf3;
    font-size: 12px;
    line-height: 15px;
    letter-spacing: 1px;
    color: #a2ceec;
    border-radius: 5px;
    margin-right: 10px;
    cursor: pointer;
    box-sizing: border-box;
}
    .btns ::v-deep .btn_box {
        background-image: none;
    }
    .btns ::v-deep .btn_inner_box {
        // background-image: url(../../../assets/img/add_pt.png);
        background-size: 100% 100%;
        padding-left: 9px;
        line-height: 0.5;
        opacity: 0.8;
        span {
            color: #fff;
        }
        i {
            color: #fff;
        }
        &:hover {
            opacity: 1;
            span {
                color: #fff;
            }
            i {
                color: #fff;
            }
        }
    }
    // .el-table th>.cell {
    //     white-space: pre-line;
    //     text-align: center;
    // }

    .dialog-conten {
        width: 100%;
        height: 360px;
        overflow-y: auto;
    }
    .from-item{
        margin-bottom: 20px;
    }
    .dialog-item {
        width: 40%;
        font-size: 0;
        // margin-bottom: 30px;
    }

    .dialog-item>span {
        display: inline-block;
        vertical-align: top;
        font-size: 12px;
    }

    .dialog-item>span:nth-child(1) {
        width: 110px;
        text-align: right;
        color: #ffffff;
        opacity: 0.6;
    }

    .dialog-item>span:nth-child(2) {
        width: 62%;
        padding-left:6px;
        box-sizing: border-box;
    }
    .access_state{
        span{
            color:#fff;
            margin-right: 6px;
        }
        i{
            font-size:15px;
            color:#00e9ff;
        }
    }
    .white-theme .access_state{
        span{
            color:#333;
        }
    }
</style>
