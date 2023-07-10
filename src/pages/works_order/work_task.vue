<template>
    <div class="event work-task">
        <div class="w100">
            <div class="tab-button ub">
                <div class="draft-btn" @click="tabClick('1')" :class="{'tab-active': currentTab === '1'}">待办工单</div>
                <div class="draft-btn" @click="tabClick('2')" :class="{'tab-active': currentTab === '2'}">已办工单</div>
                <div class="draft-btn" @click="tabClick('3')" :class="{'tab-active': currentTab === '3'}">发起工单</div>
            </div>
            <div class="ub w100 search-area event-content" style="box-sizing: border-box;padding: 0;">
                <SearchTop @search="searchCheck" :border="false" @reset="reset">
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="工单名称：" label-width="70px">
                                <el-input
                                    placeholder="请输入"
                                    clearable
                                    v-model.trim="get_params.workOrderName"
                                    @keyup.enter.native="searchCheck"
                                    size="small"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="工单类型：" label-width="70px">
                                <el-select filterable clearable v-model="get_params.workOrderObject" size="small" style="width: 100%" placeholder="请选择">
                                    <el-option v-for="(item, index) in workTypeList" :key="index" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col v-if="currentTab!=='1'" :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="优先级：" label-width="70px">
                                <el-select
                                    placeholder="请选择"
                                    style="width: 100%;"
                                    clearable
                                    v-model="get_params.level"
                                    size="small">
                                    <el-option label="高" value="1"></el-option>
                                    <el-option label="中" value="2"></el-option>
                                    <el-option label="低" value="3"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </SearchTop>
            </div>
            <div class="attendance-list table-area">
                <div class="ub ub-pj w100" style="margin-bottom: 10px;">
                    <div class="list-tips">列表内容</div>
                    <div>
                        <el-checkbox v-if="currentTab == 1" style="margin-right: 10px" v-model="isTimeChected">60s刷新一次</el-checkbox>
                        <el-button v-per="['work_order_add']" @click="handleAddTemplate" v-if="currentTab == 3" icon="el-icon-plus" type="primary" size="small">发起工单</el-button>
                    </div>
                </div>
                <el-table
                    :height="tableHeight"
                    :row-class-name="tableRowClassName"
                    ref="multipleTable"
                    v-loading="loading"
                    class='bigTable full-table'
                    :data="tableData"
                    border
                    stripe
                    tooltip-effect="dark"
                    @selection-change="handleSelectionChange">
                    <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                    </el-table-column>
                    <el-table-column prop="workOrderId" label="工单编号" width="135"  show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="workOrderName" label="工单名称" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="workMouldName" label="工单模板" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column label="工单来源" width="70" show-overflow-tooltip>
                        <template slot-scope="{row}">
                            <span>{{row.orderFrom?'自动':'手动'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="level" label="优先级" width="100" align="center" sortable>
                        <template slot-scope="{row}">
                            <div>
                                <div>
                                    <span v-if="row.level == 1" style="color: #ff0000">高</span>
                                    <span v-if="row.level == 2" style="color: #f2cd00">中</span>
                                    <span v-if="row.level == 3" style="color: #48ccca">低</span>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="工单类型" width="70" show-overflow-tooltip>
                        <template slot-scope="{row}">
                            <div>
                                {{row.workOrderObjectName|NullStr}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="工单状态" width="70" align="center">
                        <template slot-scope="{row}">
                            <div>
                                <div>
                                    <span v-if="row.status == 0" style="color: #ff3a3a">已撤销</span>
                                    <span v-if="row.status == 1" style="color: #08a508">进行中</span>
                                    <span v-if="row.status == 2" style="color: #00c0ff">已完成</span>
                                </div>
                            </div>

                        </template>
                    </el-table-column>
                    <el-table-column prop="runningNodeName" label="当前节点" width="140" show-overflow-tooltip>
                        <template slot-scope="{row}">
                            <div>
                                <span v-if="row.runningNodeName.length">{{row.runningNodeName.join(',')}}</span>
                                <span v-else>--</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column v-if="currentTab == 1" key="abc" prop="createUserCN" label="当前节点状态"  width="100">
                        <template slot-scope="{row}">
                            <div>
                                <div v-if="row.status==1&&((row.currentTime <= row.outTime) || !row.outTime)" class="ub ub-ac work-state one">
                                    <div></div>
                                    <div>待处理</div>
                                </div>
                                <div v-if="row.status==1&&(row.currentTime > row.outTime)" class="ub ub-ac work-state two">
                                    <div></div>
                                    <div>已超时</div>
                                </div>
                                <div v-if="row.status==2" class="ub ub-ac work-state three">
                                    <div></div>
                                    <div>已完成</div>
                                </div>
                                <div v-if="row.status==0" class="ub ub-ac work-state four">
                                    <div></div>
                                    <div>已撤销</div>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column v-if="currentTab != 3" key="bcd" prop="receiveTime" label="接收时间" width="150">
                    </el-table-column>
                    <el-table-column prop="createUser" label="创建人" width="100">
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建时间" width="150">
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="160" fixed="right" class-name="deepBg">
                        <template slot-scope="scope">
                            <!--<el-button type="text" @click="seeWorkImg(scope.row)">流程图</el-button>-->
                            <el-button v-per="['work_order_view']" type="text" size="small" @click="handleSee(scope.row)">查看</el-button>
                            <el-button v-per="['work_order_urge']" type="text" size="small" v-if="currentTab == 3" @click="urgeWork(scope.row)" :disabled="scope.row.status !== 1 && currentTab == 3">催办</el-button>
                            <el-button v-per="['work_order_revoke']" type="text" size="small" v-if="currentTab == 3" @click="revertWork(scope.row)" :disabled="scope.row.status !== 1 && currentTab == 3">撤销</el-button>
                            <el-button v-per="['work_order_del']" type="text" size="small" v-if="currentTab == 3" @click="handleDelete(scope.row)" :disabled="scope.row.status !== 2 && currentTab == 3">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination v-show="total_num>0" :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size" @pagination="get_data" />
            </div>
        </div>
        <!--增加对象-->
        <el-dialog title="发起工单" :visible.sync="addDialog" width="700px" custom-class="attendance-dialog" @click.native="closeUser">
            <el-form :model="addForm" :rules="rules" ref="addForm" label-position="top">
                <el-form-item label="工单名称：" prop="workOrderName" :label-width="formLabelWidth">
                    <el-input placeholder="请输入工单名称" clearable v-model="addForm.workOrderName" size="small"></el-input>
                </el-form-item>
                <el-form-item label="优先级：" prop="level" :label-width="formLabelWidth">
                    <el-select
                        placeholder="请选择"
                        style="width: 100%;"
                        v-model="addForm.level"
                        size="small">
                        <el-option label="高" value="1"></el-option>
                        <el-option label="中" value="2"></el-option>
                        <el-option label="低" value="3"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="工单模板：" prop="workMouldId" :label-width="formLabelWidth">
                    <el-select
                        placeholder="请选择"
                        style="width: 100%;"
                        v-model="addForm.workMouldId"
                        size="small"
                        @change="changeworkMouldId"
                    >
                        <el-option v-for="item in allTemplate" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <div class="fields-wapper" v-if="addForm.attrs.length>0">
                    <div>
                        <div>
                            <div class="w100" v-for="(item, index) in addForm.attrs" :key="index">
                                <el-form-item v-if="item.type == 1" :key="'a1' + index" :label="item.name+ '：'" label-width="120px" style="width: 100%">
                                    <el-input size="small" v-model="item.val" placeholder="请输入字符串" autocomplete="off" clearable></el-input>
                                </el-form-item>
                                <el-form-item v-if="item.type == 2" :key="'a2' + index" :label="item.name+ '：'" label-width="120px" style="width: 100%">
                                    <el-input size="small" type="number"  v-model="item.val" oninput ="value=value.replace(/[^0-9.]/g,'')"  @blur="item.val = $event.target.value"  clearable placeholder="请输入数字" autocomplete="off"></el-input>
                                </el-form-item>
                                <el-form-item v-if="item.type == 3" :key="'a3' + index" :label="item.name+ '：'" label-width="120px">
                                    <el-date-picker
                                        style="width:100%"
                                        v-model="item.val"
                                        align="right"
                                        type="date"
                                        size="small"
                                        value-format="yyyy-MM-dd"
                                        placeholder="选择日期"
                                        :picker-options="pickerOptions">
                                    </el-date-picker>
                                </el-form-item>
                                <el-form-item v-if="item.type == 4" :key="'a4' + index" :label="item.name+ '：'" label-width="120px">
                                    <el-date-picker
                                        style="width:100%"
                                        v-model="item.val"
                                        type="datetime"
                                        size="small"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        placeholder="选择日期时间"
                                        align="right"
                                        :picker-options="pickerOptions">
                                    </el-date-picker>
                                </el-form-item>
                                <el-form-item v-if="item.type == 5" :label="item.name + '：'" label-width="120px" style="width: 100%">
                                    <vue-ueditor-wrap style="width: 100%" :config="myConfig" v-model="item.val"></vue-ueditor-wrap>
                                </el-form-item>
                                <el-form-item v-if="item.type == 6" :key="'ss8' + index" :label="item.name+ '：'" label-width="120px" style="width: 100%">
                                    <el-select style="width:100%" size="small" v-model="item.val" clearable placeholder="请选择">
                                        <el-option v-for="(_it,_inx) in typeof item.items === 'string' ? item.items.split('#') : []" :key="_inx" :label="_it" :value="_it"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item v-if="item.type == 7" :key="'ss9' + index" :label="item.name+ '：'" label-width="120px" style="width: 100%">
                                    <el-select style="width:100%" size="small" v-model="item.val" multiple collapse-tags clearable placeholder="请选择">
                                        <el-option v-for="(_it,_inx) in typeof item.items === 'string' ? item.items.split('#') : []" :key="_inx" :label="_it" :value="_it"></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                        </div>
                    </div>
                </div>
                <el-form-item class="users" style="position: relative;z-index:101" v-if="addForm.workMouldId==='null'" label="人员范围：" :label-width="formLabelWidth">
                    <div style="width:100%;">
                        <Users
                            ref="users"
                            style="width: 100%;min-height: 32px;"
                            :usersList="allUserList"
                            :depList="allDepList"
                            :rolesList="allRolesList"
                            @confirmData="confirmData"
                        ></Users>
                    </div>
                    <div v-if="usersSelected.length===0&&flag" class="el-form-item__error">
                        请选择人员
                    </div>
                </el-form-item>
                <el-form-item style="width:100%;" label="工单描述：" :label-width="formLabelWidth">
                    <div style="width:100%;">
                        <vue-ueditor-wrap v-model="addForm.workOrderContent" :config="myConfig"></vue-ueditor-wrap>
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <Debounce :time='1500' :isDebounce="2">
                    <el-button type="primary" size="small" @click.native="submitForm('addForm')">确 定</el-button>
                </Debounce>
                <el-button size="small" @click="addDialog = false">取 消</el-button>
            </span>
        </el-dialog>

        <!--删除-->
        <el-dialog title="删除工单" :visible.sync="deleteDialog" width="30%" custom-class="attendance-dialog">
            <span>确定删除吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" @click="handleDeleteFun">确 定</el-button>
                <el-button size="small" @click="deleteDialog = false">取 消</el-button>
            </span>
        </el-dialog>
        <!--撤销-->
        <el-dialog title="撤销工单" :visible.sync="revertDialog" width="30%" custom-class="attendance-dialog">
            <span>确定撤销工单吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" @click="handleRevertFun">确 定</el-button>
                <el-button size="small" @click="revertDialog = false">取 消</el-button>
                <!-- <searchBtn title="确 定" @click="handleRevertFun"/> -->
                <!-- <cancel-btn title="取 消" @click="revertDialog = false"/> -->
            </span>
        </el-dialog>
    </div>
</template>

<script>
import Users from '../../components/users'
import VueUeditorWrap from '../../components/vue-ueditor-wrap.vue' // ES6 Module
import ueditorConfig from '../../mixins/ueditorConfig'
import {
    get_workTask,
    get_workObject,
    getAllUsersOrder,
    getAllRolesOrder,
    getAllDepOrder,
    get_workTemplate,
    add_workTask,
    urge_workTask,
    revert_workTask,
    delete_workTask
} from '../../server/works_order/define.js'
import {
    get_one_work
} from '../../server/works_order/api.js'

export default {
    name: 'WorkObject',
    mixins: [ueditorConfig],
    components: {
        // dropdownBox,
        // bpmnModeler,
        VueUeditorWrap,
        Users
    },
    data() {
        return {
            tableHeight: document.body.clientHeight - 290,
            isTimeChected: false,
            timer: null,
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now()
                },
                shortcuts: [{
                    text: '今天',
                    onClick(picker) {
                        picker.$emit('pick', new Date())
                    }
                }, {
                    text: '昨天',
                    onClick(picker) {
                        const date = new Date()
                        date.setTime(date.getTime() - 3600 * 1000 * 24)
                        picker.$emit('pick', date)
                    }
                }, {
                    text: '一周前',
                    onClick(picker) {
                        const date = new Date()
                        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
                        picker.$emit('pick', date)
                    }
                }]
            },
            flag: false,
            usersSelected: [],
            count: 0,
            users: [
                { name: '张三', id: 'zhangsan' },
                { name: '李四', id: 'lisi' },
                { name: '王五', id: 'wangwu' }
            ],
            groups: [
                { name: 'web组', id: 'web' },
                { name: 'java组', id: 'java' },
                { name: 'python组', id: 'python' }
            ],
            categorys: [
                { name: 'OA', id: 'oa' },
                { name: '财务', id: 'finance' }
            ],

            currentTab: '1',
            that: this,
            seeActive: 'first',
            seeDialog: false,
            seeForm: {},
            workTypeList: [], // 工单类型
            // flag: null,
            config_id: '',
            addDialog: false,
            addForm: {
                workOrderName: '',
                workMouldId: '',
                level: '',
                attrs: [],
                workOrderContent: ''
            },
            allUserList: [], // 所有人
            allDepList: [], // 所有部门
            allRolesList: [], // 所有角色
            sendObjectList: [], // 工单发起对象
            allTemplate: [], // 当前登录人可用的模板
            alarmList: [], // 事件字段
            conditionList: [], // 条件字段
            leakList: [], // 漏洞字段
            dataList: [
                {
                    name: '资产负责人',
                    type: '3',
                    id: 0
                },
                {
                    name: '事件创建人',
                    type: '3',
                    id: 1
                }
            ],
            rules: {
                workOrderName: [{
                    required: true,
                    message: '请输入名称',
                    trigger: 'blur'
                }],
                level: [{
                    required: true,
                    message: '请选择优先级',
                    trigger: 'change'
                }],
                workMouldId: [{
                    required: true,
                    message: '请选择工单模板',
                    trigger: 'change'
                }]
            },
            workStatus: false,
            currentWorkIds: [],
            deleteDialog: false,
            revertDialog: false,
            personFlag: false,
            deleteId: '',
            revertParams: {
                processInstanceId: '',
                workOrderId: ''
            },
            formLabelWidth: '80px',
            loading: false,
            total_num: 0,
            multipleSelection: [],
            itemSelection: [],
            tableData: [],
            sayTimes: [],
            get_params: {
                page: 1,
                size: 20,
                workOrderObject: '',
                workOrderName: '',
                level: '',
                type: '1'
            }
        }
    },
    watch: {
        isTimeChected: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.get_params.page = 1
                    this.get_data()
                    this.timer = setInterval(() => {
                        this.get_params.page = 1
                        this.get_data()
                    }, 60000)
                } else {
                    if (this.timer) {
                        clearInterval(this.timer)
                        this.timer = null
                    }
                }
            }
        },
        addDialog: {
            handler(newVal, oldVal) {
                // console.log(newVal, oldVal,'---------------------')
                if (!newVal) {
                    this.$refs.addForm.resetFields()
                    this.addForm.workMouldId = ''
                    this.addForm.workOrderContent = ''
                    this.addForm.attrs = []
                    this.usersSelected = []
                    this.flag = false
                }
            }
        }
    },
    mounted() {
        this.init()
        if (this.$route.params.name) {
            this.get_params.workOrderName = this.$route.params.name
        }
        if (this.$getsessionStorage('currentTab')) {
            this.currentTab = this.get_params.type = this.$getsessionStorage('currentTab')
            this.$removesessionStorage('currentTab')
        }
        this.$nextTick(() => {
            let id = this.$route.params.id
            console.log(id)
            this.get_data(id)
        })
    },
    computed: {
        show_warn_type() {
            let str = ''
            if (this.seeForm?.endEventObj?.type.length) {
                // eslint-disable-next-line no-unused-expressions
                this.seeForm?.endEventObj?.type.forEach(item => {
                    if (item == 0) {
                        str += '站内消息、'
                    } else if (item == 1) {
                        str += '邮件、'
                    } else if (item == 2) {
                        str += '短信、'
                    } else if (item == 3) {
                        str += '蓝鲸快信、'
                    }
                })
            }
            (str[str.length - 1] === '、') && (str = str.slice(0, str.length - 1))
            return str
        },
        show_warn_user() {
            let str = ''
            if (this.seeForm?.endEventObj?.users.length) {
                // eslint-disable-next-line no-unused-expressions
                this.seeForm?.endEventObj?.users.forEach(item => {
                    if (item.userType == 0) {
                        item.ids.forEach(_item => {
                            let one = this.allUserList.find(it => it.id == _item)
                            one && (str += one.chineseName + '、')
                        })
                    } else if (item.userType == 1) {
                        item.ids.forEach(_item => {
                            let one = this.allDepList.find(it => it.id == _item)
                            one && (str += one.name + '、')
                        })
                    } else if (item.userType == 2) {
                        item.ids.forEach(_item => {
                            let one = this.allRolesList.find(it => it.id == _item)
                            one && (str += one.roleName + '、')
                        })
                    } else if (item.userType == 3) {
                        item.ids.forEach(_item => {
                            let one = this.dataList.find(it => it.id == _item)
                            one && (str += one.name + '、')
                        })
                        str += item.name + '、'
                    } else if (item.userType == 4) {
                        str += '流程相关' + '、'
                    }
                })
            }
            (str[str.length - 1] === '、') && (str = str.slice(0, str.length - 1))
            return str ?? ''
        },
        show_warn_mes() {
            return this.seeForm?.endEventObj?.mes === '' ? '--' : this.seeForm?.endEventObj?.mes
        }
    },
    methods: {
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex % 2) {
                return 'table-row2'
            } else {
                return 'table-row1'
            }
        },
        reset() {
            let type
            if (this.currentTab == '1') {
                type = 1
            } else if (this.currentTab == '2') {
                type = 2
            } else {
                type = 3
            }
            this.get_params = {
                page: 1,
                size: 20,
                workOrderObject: '',
                workOrderName: '',
                level: '',
                type
            }
            if (this.$route.params.name) {
                this.get_params.workOrderName = this.$route.params.name
            }
            this.$nextTick(() => {
                let id = this.$route.params.id
                console.log(id)
                this.get_data(id)
            })
        },
        changeworkMouldId(val) {
            if (this.allTemplate.some(item => item.id === val)) {
                let selected = this.allTemplate.filter(item => item.id === val)[0]
                if (selected.attrs) {
                    this.addForm.attrs = selected.attrs
                } else {
                    this.addForm.attrs = []
                }
            } else {
                this.addForm.attrs = []
            }
        },
        closeUser() {
            if (this.$refs.users) {
                this.$refs.users.showMore = false
            }
        },
        confirmData(obj) {
            this.usersSelected = obj
            console.log('val1111111111111', obj)
        },
        handleSee(row) {
            console.log('row', row)
            this.$setsessionStorage('currentTab', this.currentTab)
            this.$router.push({
                path: '/works_order/work_task_detail',
                query: {
                    id: row.workOrderId,
                    taskId: row.taskId,
                    designee: row.designee,
                    userNum: row.userIds ? row.userIds.length : 0,
                    type: this.currentTab
                }
            })
        },
        seeWorkImg(row) {
            this.workStatus = row.status == 2
            let obj = {
                workMouldId: row.workMouldId,
                processInstanceId: row.processInstanceId
            }
            get_one_work({ paramsData: obj, queryData: {}}).then(res => {
                console.log(res, '查看数据')
                this.seeDialog = true
                this.seeForm = res
                this.currentWorkIds = this.seeForm.mouldInfo.running
            }).catch(err => {
                console.log(err + 'err')
            })
            console.log(this.seeForm)
        },
        getStyle() {
            console.log(window.screen.width)
            let ws = window.screen.width
            if (ws >= 1680) {
                return {
                    width: '220px'
                }
            } else if (ws < 1680) {
                return {
                    width: '156px'
                }
            }
        },
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        indexInnerMethod(index) {
            return (this.get_inner_params.page - 1) * this.get_inner_params.size + index + 1
        },
        tabClick(val = '1') {
            this.currentTab = val
            val === '1' && (this.get_params.type = 1)
            val === '2' && (this.get_params.type = 2)
            val === '3' && (this.get_params.type = 3)
            this.get_data()
        },
        handleAddTemplate() {
            this.addDialog = true
        },

        searchCheck() {
            this.get_params.page = 1
            this.get_data()
        },
        searchCheckItem() {
            this.get_inner_params.page = 1
            this.get_Item()
        },

        get_data(id) {
            this.loading = true
            this.tableData = []
            let uid = this.config_id = new Date().getTime()
            let data = {
                queryData: {
                    page: this.get_params.page,
                    pageSize: this.get_params.size
                },
                paramsData: {
                    type: this.get_params.type,
                    workOrderObject: this.get_params.workOrderObject,
                    workOrderName: this.get_params.workOrderName,
                    level: this.get_params.level,
                    id: id && typeof (id) == 'string' ? id : ''
                    // startTime: this.sayTimes && this.sayTimes.length > 0 ? this.sayTimes[0] : '',
                    // endTime: this.sayTimes && this.sayTimes.length > 0 ? this.sayTimes[1] : '',
                }
            }
            get_workTask(data).then(res => {
                console.log('任务列表', res)
                this.loading = false
                if (this.config_id !== uid) {
                    return
                }
                this.total_num = res.total
                let list = res.records
                if (list.length > 0) {
                    list.forEach(item => {
                        let obj = {}
                        obj.createTime = item.createTime
                        obj.createUser = item.createUser
                        obj.deploymentId = item.deploymentId
                        obj.outTime = item.outTime
                        obj.status = item.status
                        obj.currentTime = item.currentTime
                        obj.currentNodeStatus = ''
                        obj.workMouldName = item.workMouldName ? item.workMouldName : '--'
                        obj.workMouldId = item.workMouldId
                        obj.workOrderContent = item.workOrderContent
                        obj.nodeIds = item.nodeIds

                        if (item.status == 1) {
                            if (item.currentTime <= item.outTime || !item.outTime) {
                                obj.currentNodeStatus = '待处理'
                            }
                            if (item.currentTime > item.outTime) {
                                obj.currentNodeStatus = '已超时'
                            }
                        } else if (item.status == 0) {
                            obj.currentNodeStatus = '已撤销'
                        } else if (item.status == 2) {
                            obj.currentNodeStatus = '已完成'
                        }

                        obj.nodeDes = item.nodeDes
                        obj.dealType = item.dealType
                        obj.operation = item.operation
                        if (item.disposeData) {
                            obj.disposeData = this.$deepCopy(item.disposeData)
                        }
                        if (item.fields) {
                            obj.fields = item.fields
                        }

                        obj.players = item.players
                        obj.approveOpinion = item.approveOpinion
                        obj.approve = item.approve
                        obj.nodeId = item.nodeId
                        obj.level = item.level
                        obj.processInstanceId = item.processInstanceId
                        obj.receiveTime = item.receiveTime ? item.receiveTime : '--'
                        obj.runningNodeName = item.runningNodeName
                        obj.sourceId = item.sourceId
                        obj.designee = item.designee

                        obj.taskId = item.taskId
                        obj.workOrderContent = item.workOrderContent
                        obj.workOrderId = item.workOrderId
                        obj.workOrderObject = item.workOrderObject
                        obj.workOrderName = item.workOrderName
                        obj.workOrderObjectName = item.workOrderObjectName
                        obj.orderFrom = item.orderFrom
                        obj.userIds = item.userIds
                        this.tableData.push(obj)
                    })
                    this.$nextTick(() => {
                        this.$refs.multipleTable.doLayout()
                    })
                }
            }).catch(error => {
                this.loading = false
                console.log('error' + error)
            })
        },
        init() {
            this.get_sendObject()
            this.get_dep()
            this.get_roles()
            this.get_users()
            this.get_workMound()
        },
        get_sendObject() {
            get_workObject({ paramsData: {}, queryData: {}}).then(res => {
                console.log('工单发起对象', res)
                this.workTypeList = res
            }).catch(err => {
                console.log(err, 'err')
            })
        },
        get_workMound() {
            this.allTemplate = []
            get_workTemplate({ paramsData: {}, queryData: {}}).then(res => {
                console.log('可用工单模板', res)
                this.allTemplate.push({
                    name: '不使用模板',
                    id: 'null'
                })
                res.map(item => {
                    this.allTemplate.push(item)
                })
            }).catch(err => {
                console.log(err, 'err')
            })
        },
        get_users() {
            getAllUsersOrder({ paramsData: {}, queryData: {}}).then(res => {
                console.log('所有人员', res)
                res.forEach(item => {
                    item.type = '0'
                })
                this.allUserList = res
            }).catch(err => {
                console.log(err, 'err')
            })
        },
        get_roles() {
            getAllRolesOrder({ paramsData: {}, queryData: {}}).then(res => {
                console.log('所有角色', res)
                res.forEach(item => {
                    item.type = '2'
                })
                this.allRolesList = res
            }).catch(err => {
                console.log(err, 'err')
            })
        },
        get_dep() {
            getAllDepOrder({ paramsData: {}, queryData: {}}).then(res => {
                console.log('所有部门', res)
                res.forEach(item => {
                    item.type = '1'
                })
                this.allDepList = res
            }).catch(err => {
                console.log(err, 'err')
            })
        },
        urgeWork(row) {
            let data = {
                workOrderName: row.workOrderName,
                workOrderId: row.workOrderId,
                userIds: row.userIds,
                nodeIds: row.nodeIds
            }
            urge_workTask({ paramsData: data, queryData: {}}).then(res => {
                this.$message({
                    message: '催办成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(error => {
                console.log(error + 'error')
            })
        },
        revertWork(row) {
            this.revertParams.processInstanceId = row.processInstanceId
            this.revertParams.workOrderId = row.workOrderId
            this.revertDialog = true
        },
        handleRevertFun() {
            let data = {
                processInstanceId: this.revertParams.processInstanceId,
                workOrderId: this.revertParams.workOrderId
            }
            revert_workTask({ paramsData: data, queryData: {}}).then(res => {
                this.revertDialog = false
                this.$message({
                    message: '撤销成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(error => {
                this.revertDialog = false
                console.log(error + 'error')
            })
        },
        handleDelete(row) {
            this.deleteId = [`${row.workOrderId}`]
            this.deleteDialog = true
        },
        handleDeleteFun() {
            let data = {
                workOrderIds: this.deleteId
            }
            delete_workTask({ paramsData: data, queryData: {}}).then(res => {
                this.deleteDialog = false
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

        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    console.log('this.addForm', this.addForm)

                    let data = {
                        workOrderName: this.addForm.workOrderName,
                        level: this.addForm.level,
                        attrs: JSON.stringify(this.addForm.attrs),
                        workMouldId: this.addForm.workMouldId === 'null' ? '' : this.addForm.workMouldId,
                        workOrderContent: this.addForm.workOrderContent

                    }
                    if (this.addForm.workMouldId === 'null') {
                        if (this.usersSelected.length === 0) {
                            console.log('this.usersSelected', this.usersSelected)
                            this.flag = true
                            return
                        }
                        let usersSelected = this.usersSelected.map(item => {
                            return JSON.parse(item)
                        })
                        this.flag = false
                        data.users = usersSelected.filter(item => item.type == 0).map(item => {
                            return item.id
                        })
                        data.deps = usersSelected.filter(item => item.type == 1).map(item => {
                            return item.id
                        })
                        data.roles = usersSelected.filter(item => item.type == 2).map(item => {
                            return item.id
                        })
                    }
                    add_workTask({ paramsData: data, queryData: {}}).then(res => {
                        this.addDialog = false
                        console.log('发起工单成功')
                        this.$message({
                            message: '发起工单成功',
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
        handleSizeChange(val) {
            this.get_params.size = val
            this.get_data()
        },
        handleCurrentChange(val) {
            this.get_params.page = val
            this.get_data()
        },
        handleSelectionChange(val) {
            console.log(val)
            this.multipleSelection = val
        }
    },
    beforeDestroy() {
        if (this.timer) {
            clearInterval(this.timer)
            this.timer = null
        }
        if (this.flag) {
            clearTimeout(this.flag)
            this.flag = null
        }
    }
}
</script>

<style lang="scss" scoped>
.search-area {
    .wrapper {
        border-radius: 0 0 4px 4px;
        box-shadow: none;
        border: none;
        border-top: 1px solid #DADEE8;
    }
}
.tab-button {
    height: 30px;
    background-color: #fff;
    border-radius: 4px 0 0 4px;

    & div {
        width: 80px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        cursor: pointer;
        color: rgba(0, 0, 0, 0.6);
        box-sizing: border-box;
        font-size: 14px;

        &.tab-active {
            color: #387dee;
            border-bottom: 1px solid #387dee;
        }
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
.event  ::v-deep  .el-form-item__label {
    padding: 0;
}
.event  ::v-deep  .el-upload-list__item-name {
    color: #01E9FF;
    i {
        color: #01E9FF;
    }
}
.attendance-list.table-area {
    margin-top: 10px;
    padding: 10px;
    background-color: #fff;
    border-radius: 4px;
    border: solid 1px #dadee8;
}
.event ::v-deep .edui-editor-iframeholder {
    height: 200px !important;
}
.event  ::v-deep  .drawer-content {
    .box-title {
        color: #00e9ff;
        font-size: 14px;
        margin: 30px 0 20px;
    }
    .label {
        width: 60px;
        font-size: 12px;
        color: #999;
        text-align: right;
        margin-right: 15px;
    }
    .label-val {
        font-size: 12px;
        color: #fff;
        img {
            max-width: 300px;
        }
    }
}
.event  ::v-deep  .condition-box {
    .part-condition {
        margin-bottom: 10px;
    }
    .condition_black {
        font-size: 12px;
        color: #999;
        margin-right: 6px;
    }
    .condition_white {
        font-size: 12px;
        color: #fff;
        margin-right: 6px;
    }
}
.event  ::v-deep  .warn-wrapper {
    width: 640px;
    padding-left: 10px;
    box-sizing: border-box;
    background: rgba(0,0,0,.2);
    border-radius: 2px;

    & p {
        font-size: 12px;
        margin: 5px 0;

        &.warn-top {
            color: #fff;
            opacity: .6;
        }
        &.warn-body {
            color: #fff;
            word-break: break-all;
        }
    }
}
.event  ::v-deep  .pic-wrapper {
    height: calc(100vh - 190px);
    width: 99%;
    overflow: auto;
    border: 1px solid #1cd7fa;
}
.users  ::v-deep  .el-form-item__label:before {
    content: '*';
    color: #F56C6C;
    margin-right: 4px;
}
.fields-wapper{
    width: 100%;
    box-sizing: border-box;
    >div{
        min-height: 100px;
        border:1px solid #dcdcdc;
        background-color: rgba(56, 125, 238, 0.02);
        border-radius:5px;
        padding: 10px;
        .el-form-item {
            margin-bottom: 10px;
        }
    }
}
</style>
<style>
.nav-tips {
    pointer-events: none !important;
}
/*下拉菜单*/
.el-dropdown-link.active {
    font-size: 12px;
    color:#409EFF ;
}
.work-task .el-dropdown-menu__item {
    padding: 0 20px !important;
}
</style>
