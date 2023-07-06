<template>
    <div class="event">
        <div class="w100" v-show="!firstShow">
            <div class="tab-button ub" style="padding: 0 10px;border-bottom: none;">
                <div class="work-btn" @click="tabClick('1')" :class="{'tab-active': currentTab === '1'}">工单模板</div>
                <div class="draft-btn" @click="tabClick('2')" :class="{'tab-active': currentTab === '2'}">草 稿</div>
            </div>
            <div>
                <SearchTop @search="searchCheck" @reset="reset" :border="false">
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="模板名称：" label-width="70px">
                                <el-input
                                    placeholder="请输入"
                                    clearable
                                    style="width: 100%;"
                                    v-model="get_params.name"
                                    @keyup.enter.native="searchCheck"
                                    size="small"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="发起类型：" label-width="70px">
                                <el-select filterable clearable v-model="get_params.sendId" size="small" style="width: 100%;" placeholder="请选择">
                                    <el-option v-for="(item, index) in sendObjectList" :key="index" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :md="12" :lg="8" :xl="6" v-if="currentTab === '1'">
                        <el-form :model="get_params">
                            <el-form-item label="模板状态：" label-width="70px">
                                <el-select
                                    placeholder="请选择"
                                    clearable
                                    style="width: 100%;"
                                    v-model="get_params.status"
                                    size="small">
                                    <el-option label="未启用" value="2"></el-option>
                                    <el-option label="已启用" value="1"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :md="12" :lg="8" :xl="6" v-if="currentTab === '1'">
                        <el-form :model="get_params">
                            <el-form-item label="模板类型：" label-width="70px">
                                <el-select
                                    placeholder="请选择"
                                    clearable
                                    style="width: 100%;"
                                    v-model="get_params.mouldType"
                                    size="small">
                                    <el-option v-for="(item, index) in mouldTypeList" :key="index" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="创建时间：" label-width="70px">
                                <el-date-picker
                                    :clearable="false"
                                    size="small"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    v-model="sayTimes"
                                    style="width: 100%;"
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
            </div>
            <div class="list-container table-area">
                <div class="ub ub-pj w100" style="margin-bottom: 10px;">
                    <div class="list-tips">列表内容</div>
                    <div>
                        <!-- <div class="help" @click="$pushRouter('/help_manual/help_work_order_manage')">
                            <i class="el-icon-info"></i>
                            <span>帮助手册</span>
                        </div> -->
                        <el-button v-per="['work_mould_add']" size="small" icon="el-icon-plus" type="primary" @click="handleAddTemplate">添加模板</el-button>
                    </div>
                </div>
                <el-table
                    :row-class-name="tableRowClassName"
                    :height="tableHeight"
                    ref="multipleTable"
                    v-loading="loading"
                    class='bigTable'
                    :data="tableData"
                    border
                    stripe
                    tooltip-effect="dark"
                    v-if="get_params.type != 1"
                    :key="1"
                    @selection-change="handleSelectionChange">
                    <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                    </el-table-column>
                    <el-table-column prop="name" label="模板名称" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="sendCN" label="发起类型" width="200">
                    </el-table-column>
                    <el-table-column prop="mouldName" label="模板类型" width="200">
                    </el-table-column>
                    <el-table-column prop="userIds" label="适用范围" show-overflow-tooltip>
                        <template slot-scope="{row}">
                            <div>
                                <span v-for="(item, index) in row.userIds" :key="index">{{item.name}}
                                    <span v-if="index !== row.userIds.length-1">，</span>
                                </span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createUserCN" label="创建人"  width="100">
                    </el-table-column>
                    <!-- <el-table-column prop="createTime" label="创建时间" width="160">
                    </el-table-column> -->
                    <el-table-column prop="status" label="是否启用" width="100" align="center">
                        <template slot-scope="{row}">
                            <div class="switch-wrapper" :class="{'yes':row.status == 1,'no':row.status == 2}"  @click="deploymentEnvironment(row)">
                                <div class="ub ub-ac ub-pj">
                                    <div style="margin-left: -1px;"><i class="el-icon-check"></i></div>
                                    <!-- <div>否</div> -->
                                </div>
                                <div class="circle"></div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="num" label="使用次数" align="right" class-name="deepBg" width="80"></el-table-column>
                    <el-table-column label="操作" align="center" width="160">
                        <template slot-scope="scope">
                            <el-button size="small" type="text" v-per="['work_mould_copy']" @click="handleCopyAdd(scope.row)">复制并新建</el-button>
                            <el-button v-if="scope.row.isUse !== 1" size="small" v-per="['work_mould_edit']" :disabled="(scope.row.isUse === 1)" type="text" @click="handleEdit(scope.row)">编辑</el-button>
                            <el-tooltip v-if="scope.row.isUse === 1" class="item" effect="dark" content="有正在进行中的工单，禁止操作" placement="top-start">
                                <div style="display: inline-block;margin-left: 10px;">
                                    <el-button size="small" v-per="['work_mould_edit']" :disabled="(scope.row.isUse === 1)" type="text" @click="handleEdit(scope.row)">编辑</el-button>
                                </div>
                            </el-tooltip>
                            <el-button size="small" v-if="scope.row.isUse !== 1" v-per="['work_mould_del']" :disabled="(scope.row.isUse === 1)" type="text" @click="handleDelete(scope.row)">删除</el-button>
                            <el-tooltip v-if="scope.row.isUse === 1" class="item" effect="dark" content="有正在进行中的工单，禁止操作" placement="top-start">
                                <div style="display: inline-block;margin-left: 10px;">
                                    <el-button size="small" v-per="['work_mould_del']" :disabled="(scope.row.isUse === 1)" type="text" @click="handleDelete(scope.row)">删除</el-button>
                                </div>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
                <el-table
                    :row-class-name="tableRowClassName"
                    :height="tableHeight"
                    ref="multipleTable"
                    v-loading="loading"
                    class='bigTable'
                    :data="tableData"
                    border
                    stripe
                    tooltip-effect="dark"
                    v-if="get_params.type == 1"
                    :key="2"
                    @selection-change="handleSelectionChange">
                    <!--<el-table-column type="selection" width="40"></el-table-column>-->
                    <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                    </el-table-column>
                    <el-table-column prop="name" label="模板名称" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="sendCN" label="发起类型" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="userIds" label="适用范围" width="260" show-overflow-tooltip>
                        <template slot-scope="{row}">
                            <span v-for="(item, index) in row.userIds" :key="index">{{item.name}}
                                <span v-if="index !== row.userIds.length-1">，</span>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="num" label="使用次数" align="center" width="80">
                    </el-table-column>
                    <el-table-column prop="createUserCN" label="创建人" width="80">
                    </el-table-column>
                    <!-- <el-table-column prop="createTime" label="创建时间" width="160">
                    </el-table-column> -->
                    <el-table-column label="操作" align="center" width="160">
                        <template slot-scope="scope">
                            <el-button v-per="['work_mould_edit']" type="text" @click="handleEdit(scope.row)">编辑草稿</el-button>
                            <el-button v-per="['work_mould_del']" type="text" @click="handleDelete(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination v-show="total_num>0" :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size" @pagination="get_data" />
            </div>
        </div>
        <DeleteDialog
            :dialogVisible = deleteDialog
            @delete="handleDeleteFun"
            @cancel="deleteDialog = false">
        </DeleteDialog>
        <el-drawer :visible.sync="seeDialog" direction="rtl" size="850px">
            <div class="drawer-content">
                <div style="position: absolute;top: 0;left: 0;overflow-y: auto;padding: 20px;width: 100%;height: 100%;box-sizing: border-box;">
                    <div class="ub ub-pj w100">
                        <div class="list-tips">
                            {{'模板名称'}}
                        </div>
                        <div>
                            <i
                                class="el-icon-close"
                                style="font-size: 20px;color: #00b3ca;cursor: pointer;"
                                @click="seeDialog=false"></i>
                        </div>
                    </div>
                    <el-tabs v-model="seeActive">
                        <el-tab-pane label="详情信息" name="first">
                            <p class="box-title">基本信息</p>
                            <div class="baseinfo-box">
                                <el-row style='margin: 20px 0;' type="flex" justify="start">
                                    <div class="ub" style="width: 33%;">
                                        <div class="label">模板名称：</div>
                                        <div class="ub ub-f1 line1 label-val">{{seeForm.name | NullStr}}</div>
                                    </div>
                                    <div class="ub" style="width: 33%;">
                                        <div class="label">发起类型：</div>
                                        <div class="ub ub-f1 line1 label-val">{{seeForm.sendCN | NullStr}}</div>
                                    </div>
                                    <div class="ub" style="width: 33%;">
                                        <div class="label">模板状态：</div>
                                        <div class="ub ub-f1 line1 label-val">
                                            <span v-if="seeForm.status == 1" style="color: #00ff00;">已启用</span>
                                            <span v-if="seeForm.status == 2" style="color: rgb(255 255 255 / 50%);">未启用</span>
                                        </div>
                                    </div>
                                </el-row>
                                <el-row style='margin: 20px 0;' type="flex" justify="start">
                                    <div class="ub" style="width: 33%;">
                                        <div class="label">使用次数：</div>
                                        <div class="ub ub-f1 line1 label-val">
                                            <span style="color: #00ffe4;">{{seeForm.num | NullStr}}</span>
                                        </div>
                                    </div>
                                    <div class="ub" style="width: 33%;">
                                        <div class="label">创建人：</div>
                                        <div class="ub ub-f1 line1 label-val">{{seeForm.createUserCN | NullStr}}</div>
                                    </div>
                                    <div class="ub" style="width: 33%;">
                                        <div class="label">创建时间：</div>
                                        <div class="ub ub-f1 line1 label-val">{{seeForm.createTime | NullStr}}</div>
                                    </div>
                                </el-row>
                                <el-row style='margin: 20px 0;' type="flex" justify="start">
                                    <div class="ub">
                                        <div class="label">适用范围：</div>
                                        <div class="ub ub-f1 line1 label-val">
                                            <span v-for="(item, index) in seeForm.userIds" :key="index">{{item.name}}
                                                <span v-if="index !== seeForm.userIds.length-1">，</span>
                                            </span>
                                        </div>
                                    </div>
                                </el-row>
                                <el-row style='margin: 20px 0;' type="flex" justify="start">
                                    <div class="ub">
                                        <div class="label">工单描述：</div>
                                        <div class="ub ub-f1 line1 label-val" v-html="seeForm.des"></div>
                                    </div>
                                </el-row>
                            </div>
                            <p class="box-title">触发条件</p>
                            <div class="condition-box">
                                <div class="single-condition" v-for="(item, index) in seeForm.startConditionObj" :key="index">
                                    <div v-if="index != 0" style="margin-bottom: 10px;height: 21px;font-size: 12px;color: #fff584;line-height: 21px;">或（or）</div>
                                    <div class="ub ub-ver">
                                        <div class="part-condition ub ub-ac" v-for="(_item, _index) in item.and" :key="_index">
                                            <span class="condition_black">且（and）</span>
                                            <span class="condition_white">{{_item.field | showField(that)}}</span>
                                            <span class="condition_black">{{_item.condition | showCondition(that)}}</span>
                                            <span class="condition_white">{{_item.val || '--' }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p class="box-title">结束工单后动作</p>
                            <div class="finish-box">
                                <div class="warn-wrapper">
                                    <div class="ub ub-pj ub-ac">
                                        <p style="font-size: 12px;color: #00ffff;">提醒</p>
                                        <p>
                                            <i class="iconfont icon-xiugai" style="font-size: 12px;color: #00ffff;"></i>
                                            <i class="el-icon-close" style="font-size: 12px;color: #00ffff;"></i>
                                        </p>
                                    </div>
                                    <div>
                                        <p class="warn-top">提醒方式：</p>
                                        <p class="warn-body">{{show_warn_type || '--'}}</p>
                                        <p class="warn-top">提醒人员范围：</p>
                                        <p class="warn-body">{{show_warn_user || '--'}}</p>
                                        <p class="warn-top">提醒内容：</p>
                                        <p class="warn-body" v-html="show_warn_mes"></p>
                                    </div>
                                </div>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="流程详情" name="second">
                        </el-tab-pane>
                    </el-tabs>
                    <div v-if="seeActive == 'second'" class="w100 pic-wrapper" style="color: #ffffff;">
                        <bpmn-modeler
                            ref="refNode"
                            :xml="seeForm.xml"
                            :users="users"
                            :groups="groups"
                            :categorys="categorys"
                            :is-view="false"
                        />
                    </div>
                </div>
            </div>
        </el-drawer>
    </div>
</template>

<script>
import {
    getSendObject,
    getAllUsers,
    getAllDep,
    getAllRoles,
    getWorkTemplateList,
    deleteWorkTemplateList,
    changeWorkStatus
} from '../../server/works_order/define.js'
import {
    get_selested_all_fileds,
    get_condition,
    get_leak_fileds
} from '../../server/works_order/api.js'
import bpmnModeler from '../../package/detailXml.vue'
import axios from 'axios'
import { observerDomResize } from '@jiaminghi/data-view/lib/util'
export default {
    name: 'WorkObject',
    components: {
        bpmnModeler
    },
    data() {
        return {
            tableHeight: document.body.clientHeight - 300,
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
            mouldTypeList: [
                {
                    id: 0,
                    name: '分析'
                },
                {
                    id: 1,
                    name: '应急'
                },
                {
                    id: 2,
                    name: '通报'
                }
            ],
            that: this,
            currentTab: '1',
            seeActive: 'first',
            seeDialog: false,
            fileList: [],
            data_id: '',
            editItemDialog: false,
            file_num: 0,
            sendObjectList: [], // 工单发起类型
            flag: null,
            record_row: {},
            editDeploy: {
                id: '',
                status: ''
            },
            config_id: '',

            addDialog: false,
            addForm: {
                // id: '',
                name: '',
                des: ''
            },
            editForm: {
                id: '',
                name: '',
                des: ''
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
                des: [{
                    required: false,
                    message: '请输入描述',
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
            formLabelWidth: '120px',
            loading: false,
            total_num: 0,
            multipleSelection: [],
            itemSelection: [],
            tableData: [],
            sayTimes: [],
            get_params: {
                page: 1,
                size: 20,
                name: '',
                sendId: '',
                status: '',
                type: 0,
                mouldType: ''
            },
            seeForm: {},
            allUserList: [], // 所有人
            allDepList: [], // 所有部门
            allRolesList: [], // 所有角色
            alarmList: [], // 事件字段
            conditionList: [], // 条件字段
            leakList: [], // 漏洞字段
            dataList: [
                {
                    name: '资产负责人',
                    id: 0
                },
                {
                    name: '事件创建人',
                    id: 1
                }
            ]
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
        }
    },
    mounted() {
        this.init()
        this.$nextTick(() => {
            this.get_data()
        })
    },
    filters: {
        showField(val, that) {
            if (that.seeForm?.sendId == '1') {
                let item = that.alarmList.find(it => it.value == val)
                if (item) {
                    return item.label
                } else {
                    return '--'
                }
            } else if (that.seeForm?.sendId == '2') {
                let item = that.leakList.find(it => it.value == val)
                if (item) {
                    return item.label
                } else {
                    return '--'
                }
            }
        },
        showCondition(val, that) {
            let item = that.conditionList.find(it => it.value === val)
            if (item) {
                return item.name
            } else {
                return '--'
            }
        }
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
            this.sayTimes = []
            this.get_params = {
                page: 1,
                size: 20,
                name: '',
                sendId: '',
                status: '',
                mouldType: '',
                type: this.currentTab == '1' ? 0 : 1
            }
            this.get_data()
        },
        getSeeList() {
            axios.all([getAllUsers({ queryData: {}, paramsData: {}}), getAllDep({ queryData: {}, paramsData: {}}), getAllRoles({ queryData: {}, paramsData: {}})]).then(axios.spread((users, deps, roles) => {
                console.log(users, deps, roles)
                this.allUserList = users
                this.allDepList = deps
                this.allRolesList = roles
            }))
        },
        getWorkFields() {
            axios.all([get_selested_all_fileds({ queryData: {}, paramsData: {}}), get_condition({ queryData: {}, paramsData: {}}), get_leak_fileds({ queryData: {}, paramsData: {}})]).then(axios.spread((alarm, condition, leak) => {
                console.log(alarm, condition, leak)
                this.alarmList = alarm
                this.conditionList = condition
                this.leakList = leak
            }))
        },
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        indexInnerMethod(index) {
            return (this.get_inner_params.page - 1) * this.get_inner_params.size + index + 1
        },
        tabClick(val = '1') {
            this.currentTab = val
            val === '1' && (this.get_params.type = 0)
            val === '2' && (this.get_params.type = 1)
            this.get_data()
        },
        handleAddTemplate() {
            this.$router.push('/works_order/work_base')
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

        get_data() {
            this.loading = true
            this.tableData = []
            let uid = this.config_id = new Date().getTime()
            let data = {
                queryData: {
                    page: this.get_params.page,
                    pageSize: this.get_params.size
                },
                paramsData: {
                    name: this.get_params.name,
                    sendId: this.get_params.sendId,
                    status: this.get_params.status,
                    type: this.get_params.type,
                    mouldType: this.get_params.mouldType,
                    startTime: this.sayTimes && this.sayTimes.length > 0 ? this.sayTimes[0] : '',
                    endTime: this.sayTimes && this.sayTimes.length > 0 ? this.sayTimes[1] : ''
                }
            }
            getWorkTemplateList(data).then(res => {
                console.log('模板列表', res)
                this.loading = false
                if (this.config_id !== uid) {
                    return
                }
                this.total_num = res.total
                let list = res.records
                if (list.length > 0) {
                    list.forEach(item => {
                        let obj = {}
                        obj.id = item.id
                        obj.name = item.name
                        obj.num = item.num
                        obj.sendId = item.sendId
                        obj.sendCN = item.sendCN
                        obj.startConditionObj = item.startConditionObj
                        obj.status = item.status
                        obj.statusCN = item.statusCN
                        obj.xmlName = item.xmlName
                        obj.xml = item.xml
                        obj.endEventObj = item.endEventObj
                        obj.des = item.des
                        obj.createTime = item.createTime
                        obj.createUserId = item.createUserId
                        obj.createUserCN = item.createUserCN
                        obj.deploymentId = item.deploymentId
                        obj.userIds = item.userIds
                        obj.isUse = item.isUse
                        obj.mouldType = item.mouldType
                        obj.mouldName = item.mouldName
                        this.tableData.push(obj)
                    })
                }
            }).catch(error => {
                this.loading = false
                console.log('error' + error)
            })
        },
        init() {
            this.get_sendObject()
            this.getSeeList()
            this.getWorkFields()
        },
        get_sendObject() {
            getSendObject({ queryData: {}, paramsData: {}}).then(res => {
                console.log('工单发起类型', res)
                this.sendObjectList = res
                this.$setsessionStorage('sendObjectList', res)
            }).catch(err => {
                console.log(err, 'err')
            })
        },
        deploymentEnvironment(val) {
            if (val.isUse === 1) {
                this.$message.warning('该模板有正在进行中的工单，禁止操作!')
                return
            }
            this.flag = setTimeout(() => {
                this.record_row = {}
            }, 1000)
            /* 防止频繁点击*/
            if (val.id === this.record_row.id) {
                return
            }
            this.record_row = val
            this.editDeploy.id = val.id
            // console.log(val.status)
            val.status = (val.status == 1 ? 2 : 1)
            this.submitDeployForm()
        },
        submitDeployForm(row) {
            let obj = {
                id: this.editDeploy.id
            }
            changeWorkStatus({ paramsData: obj, queryData: {}}).then(res => {
                if (document.getElementsByClassName('el-message').length === 0) {
                    this.$message({
                        message: '状态修改成功',
                        type: 'success'
                    })
                }
            }).catch(error => {
                console.log(error + 'error')
            })
        },
        handleSee(row) {
            this.seeDialog = true
            this.seeForm = row
            console.log(this.seeForm)
        },
        handleCopyAdd(row) {
            let form = this.$deepCopy(row)
            form.id = ''
            form.name = form.name + '--copy'
            this.$setsessionStorage('copyTemplate', form)
            this.$setsessionStorage('copyAdd', true)
            this.$router.push('/works_order/work_base')
        },
        handleEdit(row) {
            let form = this.$deepCopy(row)
            this.$setsessionStorage('editTemplate', form)
            this.$router.push('/works_order/work_base')
        },
        handleDeleteAll() {
            if (this.multipleSelection.length == 0) {
                this.$message({
                    message: '请先选择类型',
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
        handleDelete(row) {
            this.deleteId = row.id
            this.deleteDialog = true
        },
        handleDeleteFun() {
            let data = {
                id: this.deleteId
            }
            deleteWorkTemplateList({ paramsData: data, queryData: {}}).then(res => {
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
        if (this.flag) {
            clearTimeout(this.flag)
            this.flag = null
        }
        if (this.$getsessionStorage('send_object_change') || this.$getsessionStorage('send_object_change') === false) {
            this.$removesessionStorage('send_object_change')
        }
    }
}
</script>

<style lang="scss" scoped>
.custom-star {
    .tab-button {
        border: solid 1px #50b0ff;
        background-color: rgba($color: #136dac, $alpha: 20%);
        box-shadow: inset 0 0 18px 0
            #00b4ff;
        & div {
            color: #ffffff;
        }
    }
}
.tab-button {
    height: 30px;
    border-bottom: 1px solid #e7e7e7;
    background-color: #ffffff;
    & div {
        margin-right: 10px;
        width: 80px;
        height: 30px;
        font-size: 14px;
        border-radius: 2px;
        text-align: center;
        color: rgb(0 0 0 / 60%);
        line-height: 30px;
        cursor: pointer;
        box-sizing: border-box;
        &.tab-active {
            border-bottom: 1px solid #387dee;
            color: #387dee;
        }
    }
}
.help {
    display: inline-block;
    margin-right: 24px;
    font-size: 12px;
    color: rgb(0 0 0 / 26%);
    cursor: pointer;
    i {
        margin-right: 6px;
    }
}
.search-area {
    .wrapper {
        border: 0;
        border-radius: 0;
        box-shadow: none;
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
        top: 0;
        right: 20px;
        padding: 0;
        color: #1cd7fa;
    }
}
.domain-list {
    margin: 3px 0 20px;
    padding: 20px 0 1px;
    background: rgb(0 0 0 / 30%);
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
            color: #f56c6c;
        }
    }
}
.event  ::v-deep  .el-range-input {
    background-color: rgb(0 0 0 / 0%);
}
.event  ::v-deep  .el-range-separator {
    // color: #fff;
}
.event  ::v-deep  .el-radio {
    margin: 0 150px 0 30px;
}
.event  ::v-deep  .el-form-item__label {
    padding: 0;
}
.event  ::v-deep  .el-upload-list__item-name {
    color: #01e9ff;
    i {
        color: #01e9ff;
    }
}
.switch-wrapper {
    position: relative;
    margin-left: 15px;
    width: 56px;
    height: 20px;
    cursor: pointer;
}
.switch-wrapper>div:nth-child(1) {
    width: 48px;
    height: 20px;
    // box-shadow: inset 0px 0px 7px 0px #000000;
    border-radius: 14px;
    color: #ffffff;
    background-color: #0052d9;
    div {
        padding: 0 8px;
        font-size: 12px;
        line-height: 20px;
    }
    >div:nth-child(1) {
        color: #ffffff;
        opacity: 1;
    }
    >div:nth-child(2) {
        color: #ffffff;
        opacity: 1;
    }
}
.switch-wrapper>div:nth-child(2) {
    position: absolute;
    top: 50%;
    left: 2px;
    margin-top: -9px;
    width: 18px;
    height: 18px;
    border-radius: 100%;
}
.switch-wrapper.yes>div:nth-child(2) {
    animation: moveone 0s linear forwards;
}
.switch-wrapper.no>div:nth-child(2) {
    animation: _moveone 0s linear forwards;
}
.switch-wrapper.no>div:nth-child(1) {
    background-color: #c5c5c5;
}
@keyframes moveone {
    0% {
        left: 2px;
        background-color: #ffffff;
        box-shadow: 0 0 6px 0 #ffffff;
    }
    100% {
        left: 28px;
        background-color: #ffffff;
        box-shadow: 0 0 6px 0 #ffffff;
    }
}
@keyframes moveone {
    0% {
        left: 2px;
        background-color: #ffffff;
        box-shadow: 0 0 6px 0 #ffffff;
    }
    100% {
        left: 28px;
        background-color: #ffffff;
        box-shadow: 0 0 6px 0 #ffffff;
    }
}
@keyframes _moveone {
    0% {
        left: 28px;
        background-color: #ffffff;
        box-shadow: 0 0 6px 0 #ffffff;
    }
    100% {
        left: 2px;
        background-color: #ffffff;
        box-shadow: 0 0 6px 0 #ffffff;
    }
}
@keyframes _moveone {
    0% {
        left: 28px;
        background-color: #ffffff;
        box-shadow: 0 0 6px 0 #ffffff;
    }
    100% {
        left: 2px;
        background-color: #ffffff;
        box-shadow: 0 0 6px 0 #ffffff;
    }
}
.attendance-list.table-area {
    margin-top: 10px;
    padding: 10px;
    border: solid 1px #dadee8;
    border-radius: 4px;
    background-color: #ffffff;
    box-shadow: 0 0 8px 0 rgb(140 152 164 / 20%);
    .pagination {
        margin-top: 20px;
        text-align: right;
    }
}
.bigTable ::v-deep tr {
    height: 32px;
}
.event  ::v-deep  .drawer-content {
    .box-title {
        margin: 30px 0 20px;
        font-size: 14px;
        color: #00e9ff;
    }
    .label {
        margin-right: 15px;
        width: 60px;
        font-size: 12px;
        text-align: right;
        color: #999999;
    }
    .label-val {
        font-size: 12px;
        color: #ffffff;
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
        margin-right: 6px;
        font-size: 12px;
        color: #999999;
    }
    .condition_white {
        margin-right: 6px;
        font-size: 12px;
        color: #ffffff;
    }
}
.event  ::v-deep  .warn-wrapper {
    padding-left: 10px;
    width: 640px;
    border-radius: 2px;
    background: rgb(0 0 0 / 20%);
    box-sizing: border-box;
    & p {
        margin: 5px 0;
        font-size: 12px;
        &.warn-top {
            color: #ffffff;
            opacity: 0.6;
        }
        &.warn-body {
            color: #ffffff;
            word-break: break-all;
        }
    }
}
.event  ::v-deep  .pic-wrapper {
    overflow: auto;
    width: 99%;
    height: calc(100vh - 190px);
    border: 1px solid #1cd7fa;
}
@keyframes moveone_white {
    0% {
        left: 1px;
        background-color: #ffffff;
    }
    100% {
        left: 37px;
        background-color: #ffffff;
    }
}
@keyframes moveone_white {
    0% {
        left: 1px;
        background-color: #ffffff;
    }
    100% {
        left: 37px;
        background-color: #ffffff;
    }
}
@keyframes _moveone_white {
    0% {
        left: 37px;
        background-color: #ffffff;
    }
    100% {
        left: 1px;
        background-color: #ffffff;
    }
}
@keyframes _moveone_white {
    0% {
        left: 37px;
        background-color: #ffffff;
    }
    100% {
        left: 1px;
        background-color: #ffffff;
    }
}
.white-theme .switch-wrapper.yes>div:nth-child(2) {
    animation: moveone_white 0s linear forwards;
}
.white-theme .switch-wrapper.no>div:nth-child(2) {
    animation: _moveone_white 0s linear forwards;
}
</style>
<style>
.nav-tips {
    pointer-events: none !important;
}
</style>
