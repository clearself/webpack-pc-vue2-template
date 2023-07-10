<template>
    <div class="list">
        <div class="w100">
            <SearchTop @search="searchCheck" @reset="reset">
                <el-col :md="12" :lg="8" :xl="6">
                    <el-form :model="get_params">
                        <el-form-item label="资源池名称：" label-width="90px">
                            <el-input
                                placeholder="请输入"
                                clearable
                                v-model="get_params.name"
                                @keyup.enter.native="searchCheck"
                                size="small"></el-input>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :md="12" :lg="8" :xl="6">
                    <el-form :model="get_params">
                        <el-form-item label="创建时间：" label-width="80px">
                            <el-date-picker
                                class="picker"
                                size="small"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                v-model="sayTimes"
                                type="datetimerange"
                                :default-time="['00:00:00', '23:59:59']"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-form>
                </el-col>
            </SearchTop>
            <div class="list-container">
                <div class="ub ub-pj w100 mb-1 ub-ac">
                    <div class="list-tips">资源池管理</div>
                    <div>
                        <el-button icon="el-icon-plus" title="新增资源池" @click="addDialog = true" style="margin-left: 10px;" size="small" type="primary" v-per="['rule_pool_add']">新增资源池</el-button>
                        <el-button style="margin-left: 10px;" icon="el-icon-delete" title="刪 除" @click="handleDeleteAll" size="small" type="danger" v-per="['rule_pool_del']">删除</el-button>
                    </div>
                </div>
                <el-table
                    ref="multipleTable"
                    v-loading="loading"
                    class='bigTable full-table'
                    :data="tableData"
                    border
                    stripe
                    tooltip-effect="dark"
                    :row-class-name="tableRowClassName"
                    :height="tabHeight"
                    :row-style="{ height: '32px' }"
                    :header-row-style="{ height: '32px' }"
                    @selection-change="handleSelectionChange">
                    <el-table-column align="center" type="selection" width="30"></el-table-column>
                    <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                    </el-table-column>
                    <el-table-column prop="poolName" label="资源池名称" width="200" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="describe" label="描述" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="type" label="类型" show-overflow-tooltip width="100">
                        <template slot-scope="scope">
                            <div>{{scope.row.type==1?'其他':scope.row.type==2?'IP区间':''}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="资源池内容" align="right" width="100">
                        <template slot-scope="scope">
                            <el-link type="primary" style="font-size: 12px;color:#0052d9" @click="showItem(scope.row)">{{ scope.row.sum }}</el-link>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建日期" width="160">
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="100">
                        <template slot-scope="scope">
                            <el-button size="small" type="text" @click="handleEdit(scope.row)" v-per="['rule_pool_edit']">编辑</el-button>
                            <el-button size="small" type="text" @click="handleDelete(scope.row)" v-per="['rule_pool_del']">删除</el-button>
                        </template>
                    </el-table-column>

                </el-table>
                <pagination v-show="total_num>0" :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size" @pagination="get_data" style="padding-top:10px"/>
            </div>
        </div>
        <el-drawer :visible.sync="firstShow" direction="rtl" :size="900" :title="inner_name.length>80?inner_name.slice(0,80)+'......':inner_name + '下内容'" :before-close="handleClose">
            <el-form :model="get_inner_params">
                <div class="ub ub-pj">
                    <el-form-item label="资源内容：" label-width="80px">
                        <el-input
                            style="width:680px"
                            placeholder="请输入"
                            clearable
                            v-model="get_inner_params.name"
                            @keyup.enter.native="searchCheckItem"
                            size="small"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="创建时间：" label-width="80px">
                        <el-date-picker
                            size="small"
                            class="picker"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            v-model="sayInnerTimes"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item> -->
                    <!-- <div class="ub-f1"></div> -->
                    <!-- <el-button size="small" type="" style="margin-top:4px" @click="resetItem">重置</el-button> -->
                    <el-button size="small" type="primary" style="margin-top:4px" @click="searchCheckItem">搜索</el-button>
                </div>
                <div class="ub ub-pe mb-1">
                    <el-button icon="el-icon-plus" size="small" type="primary" @click="addItemDialog = true" v-per="['rule_resource_add']">新增资源</el-button>
                    <el-button icon="el-icon-download" size="small" type="primary" @click="downLoad" v-per="['rule_resource_download']">下载模板</el-button>
                    <el-upload
                        action="/api/rule/manage/resource/importExcel"
                        name="fileUpload"
                        accept=".xlsx,.xlsx"
                        :headers="{'token': this.$getlocalStorage('initInfo').user.token}"
                        :data='canshu'
                        :file-list="fileList"
                        :show-file-list="false"
                        :on-success="handleSuccess"
                        :on-progress="handleProgress"
                        style="display: inline-block;">
                        <el-button style="margin:0px 10px;" icon="iconfont icon-daoru" size="small" type="primary" v-per="['rule_resource_import']">导入</el-button>
                    </el-upload>
                    <el-button
                        style="margin-left: 10px;"
                        icon="el-icon-delete"
                        size="small"
                        type="danger"
                        @click="handleDeleteAllItem"
                        v-per="['rule_resource_del']">删除</el-button>
                </div>
                <el-table
                    ref="multipleTable"
                    v-loading="loading_inner"
                    class='bigTable'
                    :data="tableInnerData"
                    :row-class-name="tableRowClassName"
                    border
                    stripe
                    tooltip-effect="light"
                    :height="tabHeight"
                    :row-style="{ height: '32px' }"
                    :header-row-style="{ height: '32px' }"
                    @selection-change="handleItemChange">
                    <el-table-column align="center" type="selection" width="30"></el-table-column>
                    <el-table-column align="center" type="index" width="50" :index="indexInnerMethod" label="序号">
                    </el-table-column>
                    <el-table-column prop="content" label="内容">
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建日期" width="180">
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="100">
                        <template slot-scope="scope">
                            <el-button size="small" type="text" @click="handleInnerEdit(scope.row)" v-per="['rule_resource_edit']">编辑</el-button>
                            <el-button size="small" type="text" @click="handleDeleteItem(scope.row)" v-per="['rule_resource_del']">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination v-show="total_inner_num>0" :total="total_inner_num" :page.sync="get_inner_params.page" :limit.sync="get_inner_params.size" @pagination="get_Item" style="padding-top:10px"/>
            </el-form>
        </el-drawer>
        <!--增加资源池-->
        <el-dialog title="添加资源池" :visible.sync="addDialog" width="700px" custom-class="common-dialog">
            <el-form :model="addForm" :rules="rules" ref="addForm" label-position="top">
                <el-form-item label="资源池名称：" prop="poolName" :label-width="formLabelWidth">
                    <el-input placeholder="请输入资源池名称" clearable v-model="addForm.poolName" size="small"></el-input>
                </el-form-item>
                <el-form-item label="类型：" prop="poolName" :label-width="formLabelWidth">
                    <el-select size="small" v-model="addForm.type" clearable placeholder="请选择" style="width:100%">
                        <el-option v-for="(item) in typeList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="资源池描述：" prop="describe" :label-width="formLabelWidth">
                    <el-input
                        type="textarea"
                        :rows="3"
                        placeholder="请输入描述"
                        clearable
                        v-model="addForm.describe"
                        size="small"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="addDialog = false">取消</el-button>
                <el-button size="small" type="primary" @click="submitForm('addForm')">确认</el-button>
            </span>
        </el-dialog>

        <!--list编辑资源池-->
        <el-dialog title="编辑资源池" :visible.sync="editDialog" width="700px" custom-class="common-dialog">
            <el-form :model="editForm" :rules="rules" ref="editForm" label-position="top">
                <el-form-item label="资源名称：" prop="poolName" :label-width="formLabelWidth">
                    <el-input placeholder="请输入资源名称" clearable v-model="editForm.poolName" size="small"></el-input>
                </el-form-item>
                <el-form-item label="类型：" prop="poolName" :label-width="formLabelWidth">
                    <el-select size="small" v-model="editForm.type" clearable placeholder="请选择" style="width:100%">
                        <el-option v-for="(item) in typeList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="资源池描述：" :label-width="formLabelWidth">
                    <el-input
                        type="textarea"
                        :rows="3"
                        placeholder="请输入描述"
                        clearable
                        v-model="editForm.describe"
                        size="small"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="editDialog = false">取消</el-button>
                <el-button size="small" type="primary" @click="submitFormEdit('editForm')">确认</el-button>
            </span>
        </el-dialog>

        <!--firstShow 新增资源-->
        <el-dialog title="新增资源" width="700px" :visible.sync="addItemDialog" custom-class="common-dialog">
            <el-form :model="addTempItem" ref="addTempItem" label-position="top">
                <el-form-item
                    v-for="(item, index) in addTempItem.content"
                    :label="'资源内容-' + (index+1)+ ':'"
                    style="vertical-align: center"
                    :rules="{
                        required: true, message: drawerName1+'不能为空', trigger: 'blur'
                    }"
                    :key="item.key"
                    :label-width="formLabelWidth"
                    :prop="'content.' + index + '.value'">
                    <el-input
                        type="textarea"
                        :rows="2"
                        :placeholder="name"
                        clearable
                        v-model="item.value"
                        size="small"
                        @blur="blur(item.value,index)"
                        style="width: 92%"></el-input>
                    <i
                        @click.stop="addResource"
                        class="el-icon-plus"
                        v-if="addTempItem.content.length -1 === index"
                        style="cursor: pointer;font-size:14px;color:#0052d9;vertical-align: super;margin-left: 6px"></i>
                    <i
                        @click.stop="deleteResource(item)"
                        v-if="index > 0"
                        class="el-icon-close"
                        style="cursor: pointer;font-size:14px;color:#0052d9;vertical-align: super;margin-left: 6px"></i>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="addItemDialog = false">取消</el-button>
                <el-button size="small" type="primary" @click="submitItem('addTempItem')">确认</el-button>
            </div>
        </el-dialog>

        <!--firstShow list 编辑资源-->
        <el-dialog title="编辑资源" width="700px" :visible.sync="editItemDialog" custom-class="common-dialog">
            <el-form class="w100" :model="editTempItem" :rules="rules" ref="editTempItem" label-position="top">
                <el-form-item label="资源内容：" :label-width="formLabelWidth" prop="content">
                    <el-input
                        type="textarea"
                        :rows="3"
                        :placeholder="name"
                        @blur="blur(editTempItem.content)"
                        clearable
                        v-model="editTempItem.content"
                        size="small"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="editItemDialog = false">取消</el-button>
                <el-button size="small" type="primary" @click="submitUpload('editTempItem')">确认</el-button>
            </div>
        </el-dialog>
        <!--删除资源-->
        <DeleteDialog
            :dialogVisible="deleteDialog"
            @delete="handleDeleteFun"
            @cancel="deleteDialog = false">
        </DeleteDialog>
        <DeleteDialog
            :dialogVisible="deleteItemDialog"
            @delete="handleDeleteItemFun"
            @cancel="deleteItemDialog = false">
        </DeleteDialog>
    </div>
</template>

<script>
import {
    addResourcePool,
    addResource,
    editResourcePool,
    editResource,
    selectResourcePool,
    selectResource,
    deleteResourcePool,
    deleteResource,
    resourceTemplate
} from '../../server/rule/attect'

export default {
    name: 'InspectionCheck',
    computed: {
        canshu() {
            return { poolName: this.inner_name }
        },
        name() {
            if (this.drawerName1 == 'IP区间') {
                return '请输入IP区间，例：10.10.10.1-10.10.10.100'
            } else if (this.drawerName1 == '资源内容') {
                return '请输入资源内容'
            } else {
                return '请输入'
            }
        }
    },
    data() {
        return {
            drawerName: '资源内容：',
            drawerName1: '资源内容',
            typeList: [{ id: 1, name: '其他' }, { id: 2, name: 'IP区间' }],
            tabHeight: document.body.clientHeight - 260,
            linkDis: false,
            fileList: [],
            data_id: '',
            editItemDialog: false,
            file_num: 0,
            // upload_file_params: {
            //   state: '',
            // },
            addDialog: false,
            addForm: {
                // id: '',
                poolName: '',
                describe: '',
                type: 1
            },
            editForm: {
                id: '',
                poolName: '',
                describe: '',
                type: 1
            },
            addTempItem: {
                id: '',
                poolId: '',
                content: [
                    {
                        value: '',
                        key: '1'
                    }
                ],
                createTime: ''
            },
            editTempItem: {
                id: '',
                poolId: '',
                content: '',
                createTime: ''
            },
            rules: {
                name: [{
                    required: true,
                    message: '请输入名称',
                    trigger: 'blur'
                }],
                poolName: [{
                    required: true,
                    message: '请输入名称',
                    trigger: 'blur'
                }],
                describe: [{
                    required: false,
                    message: '请输入描述',
                    trigger: 'blur'
                }],
                content: [{
                    required: true,
                    message: '请输入内容',
                    trigger: 'blur'
                }]
            },
            firstShow: false,
            isOpen: false,
            inner_name: '',
            templateId: '',
            deleteItemDialog: false,
            deleteDialog: false,
            deleteId: '',
            deleteItemId: '',
            editDialog: false,
            formLabelWidth: '94px',
            loading: false,
            total_num: 0,
            multipleSelection: [],
            itemSelection: [],
            tableData: [],
            sayTimes: [],
            get_params: {
                page: 1,
                size: 20,
                name: ''
                // content: "",
                // desc: "",
                // template: "",
                // creater: '',
            },
            total_inner_num: 0,
            sayInnerTimes: [],
            get_inner_params: {
                page: 1,
                size: 20,
                name: ''
                // updater: "",
            },
            loading_inner: false,
            // tableInnerData: [],
            tableInnerData: [],
            addItemDialog: false
        }
    },
    watch: {
        addDialog: {
            handler(newVal, oldVal) {
                // console.log(newVal, oldVal,'---------------------')
                if (!newVal) {
                    this.$refs.addForm.resetFields()
                }
            }
        },
        addItemDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.addTempItem.resetFields()
                    this.addTempItem.content = [
                        {
                            value: '',
                            key: '1'
                        }
                    ]
                }
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.get_data()
        })
    },
    methods: {
        blur(cont, index = 9999) {
            console.log('失去焦点', cont.split('-'))
            if (this.drawerName1 == '资源内容' || cont.length == 0) {
                return false
            }
            let list = cont.split('-')
            if (list.length == 2) {
                let reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
                if (!reg.test(list[0]) || !reg.test(list[1])) {
                    this.$message({
                        message: '请输入IP区间，例：10.10.10.1-10.10.10.100',
                        type: 'warning'
                    })
                    if (index != 9999) {
                        this.addTempItem.content[index].key = 1
                    }
                    this.editTempItem.key = 1
                } else {
                    if (index != 9999) {
                        this.addTempItem.content[index].key = 2
                    }
                    this.editTempItem.key = 2
                }
            } else {
                this.$message({
                    message: '请输入IP区间，例：10.10.10.1-10.10.10.100',
                    type: 'warning'
                })
                if (index != 9999) {
                    this.addTempItem.content[index].key = 1
                }
                this.editTempItem.key = 1
            }
        },
        handleClose(done) {
            console.log('关闭')
            this.$confirm('确认关闭？')
                .then(_ => {
                    this.firstShow = false
                    done()
                })
                .catch(_ => {})
        },
        tableRowClassName({ row, rowIndex }) {
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
                name: ''
            }
            this.sayTimes = []
            this.get_data()
        },
        resetItem() {
            this.get_inner_params = {
                page: 1,
                size: 20,
                name: ''
            }
            this.sayInnerTimes = []
            this.get_Item()
        },
        handleProgress() {

        },
        handleSuccess(response, file, fileList) {
            console.log('response', response)
            if (response.code == 1) {
                this.$message({
                    message: '文件上传成功!',
                    type: 'success'
                })
                this.get_Item()
            } else {
                this.$message({
                    message: response.message,
                    type: 'warning'
                })
            }
        },
        downLoad() {
            // window.location.href = '/api/rule/manage/resource/template'
            resourceTemplate({}).then(res => {
                console.log(res)
            }).catch(err => {
                console.log(err)
            })
        },
        textColor(val) {
            if (val > 0) {
                return 'content-one'
            } else {
                return 'content-zero'
            }
        },
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        indexInnerMethod(index) {
            return (this.get_inner_params.page - 1) * this.get_inner_params.size + index + 1
        },
        searchCheck() {
            // alert(123)
            this.get_params.page = 1
            this.get_data()
        },
        searchCheckItem() {
            this.get_inner_params.page = 1
            this.get_Item()
        },

        goBack() {
            this.firstShow = false
            this.get_data()
        },

        get_data() {
            this.loading = true
            this.tableData = []
            let data = {
                queryData: {
                    page: this.get_params.page,
                    pageSize: this.get_params.size
                },
                paramsData: {
                    name: this.get_params.name,
                    beginDate: this.sayTimes && this.sayTimes.length > 0 ? this.sayTimes[0] : '',
                    endDate: this.sayTimes && this.sayTimes.length > 0 ? this.sayTimes[1] : ''
                }
            }
            console.log(data)
            selectResourcePool(data).then(res => {
                console.log('getList', res)
                this.loading = false
                this.total_num = res.total
                let list = res.records
                if (list.length > 0) {
                    list.forEach(item => {
                        let obj = {}
                        obj.id = item.id
                        obj.poolName = item.poolName
                        obj.describe = item.describe
                        obj.createTime = item.createTime
                        obj.sum = item.sum
                        obj.type = item.type
                        if (item.sum > 0) {
                            obj.linkDis = false
                        } else {
                            obj.linkDis = true
                        }
                        this.tableData.push(obj)
                    })
                }
            }).catch(error => {
                this.loading = false
                console.log('error' + error)
            })
        },
        showItem(obj) {
            // console.log(obj);
            this.firstShow = true
            this.inner_name = obj.poolName
            this.templateId = obj.id
            if (obj.type == 1) {
                this.drawerName = '资源内容：'
                this.drawerName1 = '资源内容'
            } else if (obj.type == 2) {
                this.drawerName = 'IP区间：'
                this.drawerName1 = 'IP区间'
            }
            this.get_Item()
        },
        get_Item() {
            this.loading_inner = true
            this.tableInnerData = []
            let data = {
                queryData: {
                    page: this.get_inner_params.page,
                    pageSize: this.get_inner_params.size
                },
                paramsData: {
                    poolId: this.templateId,
                    name: this.get_inner_params.name,
                    beginDate: this.sayInnerTimes && this.sayInnerTimes.length > 0 ? this.sayInnerTimes[0] : '',
                    endDate: this.sayInnerTimes && this.sayInnerTimes.length > 0 ? this.sayInnerTimes[1] : ''
                }
            }
            selectResource(data).then(res => {
                console.log(res)
                this.loading_inner = false
                this.total_inner_num = res.total
                let list = res.records
                if (list.length > 0) {
                    list.forEach(item => {
                        let obj = {}
                        obj.id = item.id
                        obj.poolId = item.poolId
                        obj.content = item.content
                        obj.createTime = item.createTime
                        this.tableInnerData.push(obj)
                    })
                }
            }).catch(error => {
                this.loading_inner = false
                console.log('error' + error)
            })
        },
        handleEdit(row) {
            this.editForm.id = row.id
            this.editForm.poolName = row.poolName
            this.editForm.describe = row.describe
            this.editForm.type = row.type
            this.editDialog = true
        },
        handleInnerEdit(row) {
            // console.log('row', row);
            this.editTempItem.id = row.id
            this.editTempItem.poolId = row.poolId
            this.editTempItem.content = row.content
            if (this.drawerName1 == 'IP区间') {
                this.editTempItem.key = 2
            }
            this.editTempItem.createTime = row.createTime
            this.editItemDialog = true
        },

        handleDeleteAll() {
            if (this.multipleSelection.length == 0) {
                this.$message({
                    message: '请先选择资源池',
                    type: 'warning'
                })
                return
            } else {
                let ids = []
                this.multipleSelection.forEach(item => {
                    ids.push(item.id)
                })
                this.deleteId = ids
                // console.log(this.deleteId)
            }
            this.deleteDialog = true
        },
        handleDeleteAllItem() {
            if (this.itemSelection.length == 0) {
                this.$message({
                    message: '请先选择资源',
                    type: 'warning'
                })
                return
            } else {
                let ids = []
                this.itemSelection.forEach(item => {
                    ids.push(item.id)
                })
                this.deleteItemId = ids
            }
            this.deleteItemDialog = true
        },
        handleDeleteItem(row) {
            this.deleteItemId = [`${row.id}`]
            this.deleteItemDialog = true
        },
        handleDelete(row) {
            this.deleteId = [`${row.id}`]
            this.deleteDialog = true
        },
        handleDeleteFun() {
            let data = {
                ids: this.deleteId
            }
            deleteResourcePool(data).then(res => {
                this.deleteDialog = false
                console.log('删除成功')
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(error => {
                this.deleteDialog = false
                console.log(error + 'error')
            })
        },
        handleDeleteItemFun() {
            let data = {
                ids: this.deleteItemId
            }
            deleteResource(data).then(res => {
                this.deleteItemDialog = false
                console.log('删除成功')
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_Item()
                }, 1500)
            }).catch(error => {
                this.deleteItemDialog = false
                console.log(error + 'error')
            })
        },
        handelAdd() {
            this.addDialog = true
        },
        addResource() {
            this.addTempItem.content.push({
                value: '',
                key: Date.now()
            })
        },
        deleteResource(item) {
            var index = this.addTempItem.content.indexOf(item)
            if (index !== -1) {
                this.addTempItem.content.splice(index, 1)
            }
        },
        submitItem(formName) {
            console.log(this.addTempItem.content)
            let list = []
            this.addTempItem.content.map(item => {
                list.push(item.key)
            })
            console.log(new Set(list))
            console.log(new Set(list).has(2))
            if (new Set(list).has(2) && new Set(list).size == 1 && this.drawerName1 == 'IP区间') {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let data = {
                            poolId: this.templateId,
                            content: this.addTempItem.content.map(item => {
                                return item.value
                            })
                        }
                        addResource(data).then(res => {
                            this.addItemDialog = false
                            console.log('添加成功')
                            this.$message({
                                message: '添加成功',
                                type: 'success'
                            })
                            setTimeout(() => {
                                this.get_Item()
                            }, 1500)
                        }).catch(error => {
                        // this.addItemDialog = false
                            console.log(error + 'error')
                        })
                    } else {
                        console.log('error submit!!')
                        return false
                    }
                })
            } else if (this.drawerName1 == '资源内容') {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let data = {
                            poolId: this.templateId,
                            content: this.addTempItem.content.map(item => {
                                return item.value
                            })
                        }
                        addResource(data).then(res => {
                            this.addItemDialog = false
                            console.log('添加成功')
                            this.$message({
                                message: '添加成功',
                                type: 'success'
                            })
                            setTimeout(() => {
                                this.get_Item()
                            }, 1500)
                        }).catch(error => {
                        // this.addItemDialog = false
                            console.log(error + 'error')
                        })
                    } else {
                        console.log('error submit!!')
                        return false
                    }
                })
            }
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = {
                        // id: this.addForm.id,
                        poolName: this.addForm.poolName,
                        describe: this.addForm.describe,
                        type: this.addForm.type
                    }
                    addResourcePool(data).then(res => {
                        this.addDialog = false
                        console.log('添加成功')
                        this.$message({
                            message: '添加成功',
                            type: 'success'
                        })
                        setTimeout(() => {
                            this.get_data()
                        }, 1500)
                    }).catch(error => {
                        // this.addDialog = false
                        console.log(error + 'error')
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        submitFormEdit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = {
                        id: this.editForm.id,
                        poolName: this.editForm.poolName,
                        describe: this.editForm.describe,
                        type: this.editForm.type
                    }
                    editResourcePool(data).then(res => {
                        this.editDialog = false
                        console.log('编辑成功')
                        this.$message({
                            message: '编辑成功',
                            type: 'success'
                        })
                        setTimeout(() => {
                            this.get_data()
                        }, 1500)
                    }).catch(error => {
                        // this.editDialog = false
                        console.log(error + 'error')
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
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
        handleSizeInnerChange(val) {
            this.get_inner_params.size = val
            this.get_Item()
        },
        handleCurrentInnerChange(val) {
            this.get_inner_params.page = val
            this.get_Item()
        },
        handleSelectionChange(val) {
            console.log(val)
            this.multipleSelection = val
        },
        handleItemChange(val) {
            this.itemSelection = val
        },
        submitUpload(formName) {
            console.log(this.editTempItem.key)
            if (this.editTempItem.key == 1 && this.drawerName1 == 'IP区间') {
                return false
            }
            // this.$refs.upload.submit();
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = {
                        id: this.editTempItem.id,
                        poolId: this.editTempItem.poolId,
                        content: this.editTempItem.content
                    }
                    editResource(data).then(res => {
                        this.editItemDialog = false
                        console.log('编辑成功')
                        this.$message({
                            message: '编辑成功',
                            type: 'success'
                        })
                        setTimeout(() => {
                            this.get_Item()
                        }, 1500)
                    }).catch(error => {
                        // this.editItemDialog = false
                        console.log(error + 'error')
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        }
        // uploadSuccess(response, file, fileList) {
        //   this.file_num++;
        //   if (this.file_num === fileList.length) {
        //     this.$message({
        //       message: '上传成功！',
        //       type: 'success'
        //     })
        //     this.editItemDialog = false;
        //     this.fileList = [];
        //     this.file_num = 0;
        //     setTimeout(() => {
        //
        //     }, 1200)
        //   }
        //
        // },
    }
}
</script>

<style lang="scss" scoped>
.picker{
    ::v-deep input{
        font-size:12px !important;
    }
}
.event ::v-deep .el-input--small .el-input__inner {
    height: 30px;
    line-height: 30px;
}
.content-one {
    ::v-deep .el-link--inner {
        color: #409eff
    }
}
.content-zero {
    ::v-deep .el-link--inner {
        cursor: not-allowed;
        color: #008080;
    }
}
.el-input.ips {
    display: block;
    width: 100%;
}

.el-link {
    cursor: pointer;
}

.drawer-pad {
    padding: 0 20px;
}

.domain-add {
    line-height: 1;
    position: relative;
    padding: 0 20px;
    color: #1cd7fa;

    .el-button {
        position: absolute;
        right: 20px;
        top: 0;
        padding: 0;
        color: #1cd7fa;
    }
}

.domain-list {
    background: rgba(0, 0, 0, .3);
    margin: 3px 0 20px;
    padding: 20px 0 1px;

    .list-tit {
        width: 100px;
        text-align: right;
    }

    .ub {
        margin-bottom: 20px;
    }

    .list-btn {
        padding-left: 20px;

        .el-button {
            color: #F56C6C;
        }
    }
}

.event  ::v-deep  .el-range-input {
    background-color: rgba(0, 0, 0, 0);
    color: #fff;
}

.event  ::v-deep  .el-range-separator {
    color: #fff;
}

.event  ::v-deep  .el-radio {
    margin: 0 150px 0 30px;
}

.event  ::v-deep  .el-upload-list__item-name {
    color: #01E9FF;

    i {
        color: #01E9FF;
    }
}
.event  ::v-deep  .el-date-editor--datetimerange.el-input, .el-date-editor--datetimerange.el-input__inner {
    width: 300px;
}
</style>
