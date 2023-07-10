<template>
    <div>
        <!-- 事件详情 -->
        <el-drawer :visible.sync="detailDialog" direction="rtl" :size="900"  title="事件详情">
            <!-- 搜索框 -->
            <div class="ub ub-ver ub-f1 search" v-if="detailDialog">
                <el-row :gutter="24" type="flex" justify="space-between" style="height:48px">
                    <el-col :span="8">
                        <div>
                            <el-form :model="get_params" label-position="right" :label-width="labelWidth">
                                <el-form-item label="事件时间：">
                                    <CustomDate :append-to-body="true" :auto="true" @getCustomTime="getCustomTime" @getDateData="getDateData" :empty="isEmpty" ref="customDate"></CustomDate>
                                </el-form-item>
                            </el-form>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div>
                            <el-form :model="get_params" label-position="right" :label-width="labelWidth">
                                <el-form-item label="事件状态：">
                                    <el-select
                                        style="width:100%"
                                        v-model="get_params.reportStatus"
                                        placeholder="请选择"
                                        filterable
                                        multiple
                                        clearable
                                        collapse-tags
                                        size="small">
                                        <el-option v-for="(item, index) in alarmStates" :key="index" :label="item.text" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-form>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div>
                            <el-form :model="get_params" label-position="right" :label-width="labelWidth">
                                <el-form-item label="事件名称：">
                                    <el-input placeholder="请输入" clearable v-model="get_params.reportName" size="small">
                                    </el-input>
                                </el-form-item>
                            </el-form>
                        </div>
                    </el-col>
                </el-row>
                <el-row v-show="isOpen" :gutter="24" type="flex" justify="space-between" style="height:48px">
                    <el-col :span="8">
                        <div>
                            <el-form :model="get_params" label-position="right" :label-width="labelWidth">
                                <el-form-item label="事件等级：">
                                    <el-select
                                        v-model="get_params.reportLevel"
                                        style="width:100%"
                                        placeholder="请选择"
                                        multiple
                                        filterable
                                        collapse-tags
                                        size="small"
                                        clearable>
                                        <el-option v-for="(item, index) in levels" :key="index" :label="item.name" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-form>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div>
                            <el-form :model="get_params" label-position="right" :label-width="labelWidth">
                                <el-form-item label="事件类型：">
                                    <el-select size="small" v-model="get_params.reportType" multiple clearable placeholder="请选择" style="width:100%" collapse-tags>
                                        <el-option v-for="(item) in typeList" :key="item.id" :label="item.name" :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-form>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div>
                            <el-form :model="get_params" label-position="right" :label-width="labelWidth">
                                <el-form-item label="源IP：">
                                    <el-input placeholder="请输入" clearable v-model="get_params.srcIp" size="small" :disabled="name=='攻击'?true:false">
                                    </el-input>
                                </el-form-item>
                            </el-form>
                        </div>
                    </el-col>
                </el-row>
                <el-row v-show="isOpen" :gutter="24" type="flex" justify="space-between" style="height:48px">
                    <el-col :span="8">
                        <div>
                            <el-form :model="get_params" label-position="right" :label-width="labelWidth">
                                <el-form-item label="源端口：">
                                    <el-input placeholder="请输入" clearable v-model="get_params.srcPort" size="small">
                                    </el-input>
                                </el-form-item>
                            </el-form>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div>
                            <el-form :model="get_params" label-position="right" :label-width="labelWidth">
                                <el-form-item label="目的IP：">
                                    <el-input placeholder="请输入" clearable v-model="get_params.desIp" size="small" :disabled="name=='受害'?true:false">
                                    </el-input>
                                </el-form-item>
                            </el-form>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div>
                            <el-form :model="get_params" label-position="right" :label-width="labelWidth">
                                <el-form-item label="目的端口：">
                                    <el-input placeholder="请输入" clearable v-model="get_params.desPort" size="small">
                                    </el-input>
                                </el-form-item>
                            </el-form>
                        </div>
                    </el-col>
                </el-row>
                <el-row v-show="isOpen" :gutter="24" type="flex" justify="space-between" style="height:48px">
                    <el-col :span="8">
                        <div>
                            <el-form :model="get_params" label-position="right" :label-width="labelWidth">
                                <el-form-item label="攻击结果：">
                                    <el-select size="small" v-model="get_params.attackResult" multiple clearable placeholder="请选择" style="width:100%" collapse-tags>
                                        <el-option v-for="(item) in attackResultList" :key="item.id" :label="item.name" :value="item.name">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-form>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div>
                            <el-form :model="get_params" label-position="right" :label-width="labelWidth">
                                <el-form-item label="事件来源：" >
                                    <el-select size="small" v-model="get_params.reportFrom" clearable placeholder="请选择" style="width:100%" multiple collapse-tags>
                                        <el-option v-for="(item) in reportFromList" :key="item.id" :label="item.name" :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-form>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div>
                            <el-form :model="get_params" label-position="right" :label-width="labelWidth">
                                <el-form-item label="关联规则：">
                                    <el-select size="small" v-model="get_params.ruleIds" clearable placeholder="请选择" style="width:100%" multiple collapse-tags>
                                        <el-option v-for="(item) in relevanceRuleList" :key="item.id" :label="item.name" :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-form>
                        </div>
                    </el-col>
                </el-row>
                <div class="ub ub-pe" style="margin-bottom:20px">
                    <div class="search-text" v-show="isOpen" @click="isOpen=false">收 起<i style="margin-left: 3px;" class="el-icon-arrow-up"></i></div>
                    <div class="search-text" v-show="!isOpen" @click="isOpen=true">展 开<i style="margin-left: 3px;" class="el-icon-arrow-down"></i></div>
                    <el-button @click="resetFun" style="margin-left:20px" size="small">重置</el-button>
                    <Debounce :time='1500' :isDebounce="2">
                        <el-button @click.native="searchCheck" size="small" type="primary" class="search1">搜索</el-button>
                    </Debounce>
                </div>
            </div>
            <!-- 表格 -->
            <div>
                <el-table
                    ref="multipleTable"
                    v-loading="loading_alarm"
                    class='bigTable full-table'
                    :data="alarmTableData"
                    :height="tableHeight"
                    :row-class-name="tableRowClassName"
                    border
                    stripe
                    :row-style="{ height: '32px' }"
                    :header-row-style="{ height: '32px' }"
                    tooltip-effect="dark">
                    <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                    </el-table-column>
                    <el-table-column prop="id" label="事件ID" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="reportName" label="事件名称" width="150">
                    </el-table-column>
                    <el-table-column prop="reportLevel" label="事件等级"  width="90" align="center">
                        <template slot-scope="scope">
                            <div>
                                <span v-if="scope.row.reportLevel == 0" style="color:#6cfeff">低</span>
                                <span v-if="scope.row.reportLevel == 1" style="color:#00a2ff">中低</span>
                                <span v-if="scope.row.reportLevel == 2" style="color:#fff76c">中</span>
                                <span v-if="scope.row.reportLevel == 3" style="color:#f86900">中高</span>
                                <span v-if="scope.row.reportLevel == 4" style="color:#ff0000">高</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="reportTypeName" label="事件类型" width="100" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="attackResult" label="攻击结果" width="100">
                    </el-table-column>
                    <el-table-column prop="num" label="事件状态" width="90">
                        <template slot-scope="scope">
                            <div>
                                <div v-if="scope.row.reportStatus == 0" class="ub ub-ac ub-pc alarm-state one">
                                    <div>待确认</div>
                                </div>
                                <div v-if="scope.row.reportStatus == 1" class="ub ub-ac ub-pc alarm-state two">
                                    <div>已确认</div>
                                </div>
                                <div v-if="scope.row.reportStatus == 2" class="ub ub-ac ub-pc alarm-state three">
                                    <div>已处理</div>
                                </div>
                                <div v-if="scope.row.reportStatus == 3" class="ub ub-ac ub-pc alarm-state four">
                                    <div>已驳回</div>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="180">
                        <template slot-scope="scope">
                            <el-button size="small" type="text" @click="handleSee(scope.row)">查看</el-button>
                            <el-button :disabled="(scope.row.isStart == 1)" size="small" type="text" @click="handleEdit_alarm(scope.row)">发起工单</el-button>
                            <el-button size="small" type="text" @click="handleChangeStatus(scope.row)">状态变更</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination :total="alarm_total_num" :page.sync="alarm_params.page" :limit.sync="alarm_params.size"  style="padding-top:10px" @pagination="getAlarmTableList"/>
            </div>
        </el-drawer>
        <!-- 发起工单 -->
        <el-dialog v-dialogDrag title="发起工单" :visible.sync="taskDialog" width="700px" custom-class="common-dialog" style="background:rgba(0,0,0,.4)">
            <el-form :model="taskForm" :rules="rules" ref="taskForm" label-position="top">
                <el-form-item label="工单名称：" prop="workOrderName" :label-width="formLabelWidth">
                    <el-input placeholder="请输入工单名称" clearable v-model="taskForm.workOrderName" size="small"></el-input>
                </el-form-item>
                <el-form-item label="优先级：" prop="level" :label-width="formLabelWidth">
                    <el-select
                        placeholder="请选择"
                        style="width: 100%;"
                        v-model="taskForm.level"
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
                        v-model="taskForm.workMouldId"
                        size="small">
                        <el-option v-for="(item) in allTemplate" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="width:100%;" label="工单描述：" :label-width="formLabelWidth">
                    <div style="width:100%;">
                        <vue-ueditor-wrap v-model="taskForm.workOrderContent" :config="myConfig"></vue-ueditor-wrap>
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="taskDialog=false" size="small" class="mr-1">取消</el-button>
                <Debounce :time='1500' :isDebounce="2">
                    <el-button type="primary" @click.native="submitTaskForm('taskForm')" size="small">确认</el-button>
                </Debounce>
            </span>
        </el-dialog>
        <!-- 状态变更 -->
        <el-dialog v-dialogDrag title="事件状态变更" :visible.sync="stateDialog" width="700px" custom-class="common-dialog" style="background:rgba(0,0,0,.4)">
            <el-form :model="stateForm" :rules="rules" ref="stateForm" label-position="top">
                <el-form-item style="width:100%;" label="事件状态：" :label-width="formLabelWidth" prop="reportStatus">
                    <el-select size="small" style="width:660px" v-model="stateForm.reportStatus" placeholder="请选择">
                        <el-option label="待确认" value="0"></el-option>
                        <el-option label="已确认" value="1"></el-option>
                        <el-option label="已处置" value="2"></el-option>
                        <el-option label="已驳回" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="stateForm.reportStatus==0||stateForm.reportStatus==1" style="width:100%;" label="变更原因：" :label-width="formLabelWidth">
                    <div class="ub ub-pc ub-f1">
                        <vue-ueditor-wrap v-model="stateForm.remark" :config="myConfig"></vue-ueditor-wrap>
                    </div>
                </el-form-item>
                <el-form-item v-if="stateForm.reportStatus==2" style="width:100%;" label="处置结果：" :label-width="formLabelWidth">
                    <div class="ub ub-pc ub-f1">
                        <vue-ueditor-wrap v-model="stateForm.actionResults" :config="myConfig"></vue-ueditor-wrap>
                    </div>
                </el-form-item>
                <el-form-item v-if="stateForm.reportStatus==3" style="width:100%;" label="驳回理由：" :label-width="formLabelWidth">
                    <div class="ub ub-pc ub-f1">
                        <vue-ueditor-wrap v-model="stateForm.rejectReason" :config="myConfig"></vue-ueditor-wrap>
                    </div>
                </el-form-item>
                <el-form-item v-if="stateForm.reportStatus==3" style="width:100%;" label="分析过程：" :label-width="formLabelWidth">
                    <div class="ub ub-pc ub-f1">
                        <vue-ueditor-wrap v-model="stateForm.analyzePro" :config="myConfig"></vue-ueditor-wrap>
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="stateDialog=false" size="small" class="mr-1">取消</el-button>
                <el-button type="primary" @click="submitStateForm('stateForm')" size="small">确认</el-button>
            </span>
        </el-dialog>
        <!-- 查看 -->
        <alarm_detail ref="alarmDetailRef" @back="back"></alarm_detail>
    </div>
</template>
<script>
import {
    getAssetAlarmTable,
    getAlarmTable,
    getAlarmTemplate,
    addWorkOrder,
    changeStatus
} from '@/server/alarm/define.js'
import {
    get_alarm_type_auto,
    getSearchResultData,
    getSearchRulesData
} from '@/server/alarm/alarm.js'
import {
    get_time
} from '@/server/common.js'
import CustomDate from '@/pages/alarm/new_alarm/components/custom_date/index.vue'
import VueUeditorWrap from '@/components/vue-ueditor-wrap.vue' // ES6 Module
import ueditorConfig from '@/mixins/ueditorConfig'
import alarm_detail from './alarm_detail.vue'
export default {
    components: {
        VueUeditorWrap,
        CustomDate,
        alarm_detail
    },
    mixins: [ueditorConfig],
    data() {
        return {
            tableHeight: document.body.clientHeight - 370,
            isEmpty: false,
            isRefresh: false,
            // 搜索内容
            get_params: {
                id: '',
                page: 1,
                size: 20,
                reportName: '',
                reportLevel: [],
                reportFrom: [],
                reportStatus: [],
                srcIp: '',
                srcPort: '',
                desIp: '',
                desPort: '',
                reportType: [],
                attackResult: [],
                ruleIds: [],
                ids: []
            },
            isOpen: true,
            labelWidth: '80px',
            startStates: [
                {
                    text: '默认',
                    value: ''
                },
                {
                    text: '否',
                    value: 0
                },
                {
                    text: '是',
                    value: 1
                }
            ],
            alarmStates: [
                {
                    text: '待确认',
                    value: 0
                },
                {
                    text: '已确认',
                    value: 1
                },
                {
                    text: '已处置',
                    value: 2
                }, {
                    text: '已驳回',
                    value: 3
                }
            ],
            alarmFroms: [{
                text: '默认',
                value: ''
            },
            {
                text: '自动',
                value: 1
            },
            {
                text: '手动',
                value: 0
            }
            ],
            levels: [{
                name: '高',
                value: 4
            }, {
                name: '中高',
                value: 3
            }, {
                name: '中',
                value: 2
            }, {
                name: '中低',
                value: 1
            }, {
                name: '低',
                value: 0
            }],
            typeList: [], // 事件类型
            relevanceRuleList: [],
            reportFromList: [
                {
                    name: '手动',
                    id: 0
                },
                {
                    name: '自动',
                    id: 1
                }
            ],
            attackResultList: [],

            // 事件详情
            detailDialog: false,
            alarmTableData: [],
            alarm_total_num: 0,
            alarm_total__count: 0,
            alarm_params: {
                id: '',
                page: 1,
                size: 20
            },
            loading_alarm: false,
            ip: '',
            name: '',

            // 发起工单
            recordId: '',
            orderType: '',
            formLabelWidth: '100px',
            taskDialog: false,
            taskForm: {
                workOrderName: '',
                workMouldId: '',
                level: '',
                workOrderContent: ''
            },
            allTemplate: [],

            // 状态变更
            stateDialog: false,
            stateForm: {
                reportStatus: '0',
                actionResults: '',
                analyzePro: '',
                rejectReason: '',
                remark: ''
            },
            statusId: '',

            rules: {
                reportName: [{
                    required: true,
                    message: '请输入名称',
                    trigger: 'blur'
                }],
                reportType: [{
                    required: true,
                    message: '请选择事件类型',
                    trigger: 'change'
                }],
                status: [{
                    required: true,
                    message: '请选择变更状态',
                    trigger: 'change'
                }],
                desIp: [{
                    required: true,
                    message: '请输入正确的ip',
                    trigger: 'blur'
                }],
                srcIp: [{
                    required: false,
                    message: '请输入正确的ip',
                    trigger: 'blur'
                }],
                reportLevel: [{
                    required: true,
                    message: '请选择事件等级',
                    trigger: 'change'
                }],

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
            dateData: '',
            dateMode: '',
            useDate: {},
            useIndex: '',
            sayTimes: []
        }
    },
    async mounted() {
        this.$nextTick(() => {
            this.getAlarmType()
            // 获取搜索结果列表
            this.initSearchResultData()
            // 获取关联规则列表
            this.initSearchRulesData()
            // 获取事件类型列表
            this.getAlarmType()
        })
    },
    watch: {
        stateDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.stateForm.resetFields()
                    this.stateForm = {
                        reportStatus: '0',
                        actionResults: '',
                        analyzePro: '',
                        rejectReason: '',
                        remark: ''
                    }
                }
            }
        },
        taskDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.taskForm.resetFields()
                    this.taskForm = {
                        workOrderName: '',
                        workMouldId: '',
                        level: '',
                        workOrderContent: ''
                    }
                }
            }
        },
        detailDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.customDate.handleRecently({ value: 3, name: '最近1天' }, 3)
                }
            }
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
        handleClose(done) {
            console.log('关闭')
            this.$confirm('确认关闭？')
                .then(_ => {
                    this.detailDialog = false
                    if (this.isRefresh) {
                        this.$emit('parentBack')
                        this.isRefresh = false
                    }
                    done()
                })
                .catch(_ => {})
        },
        back(refresh) {
            console.log(refresh, '是否刷新呀')
            this.isRefresh = true
            this.getAlarmTableList()
        },
        // 获取事件类型列表
        getAlarmType() {
            this.typeList = []
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_alarm_type_auto(data).then(res => {
                console.log(res)
                let list = res
                if (list.length > 0) {
                    list.forEach(item => {
                        let obj = {}
                        obj.id = item.id
                        obj.name = item.name
                        this.typeList.push(obj)
                    })
                }
            }).catch(error => {
                console.log('error' + error)
            })
        },
        // 获取关联规则列表
        initSearchRulesData() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            getSearchRulesData(data).then(res => {
                console.log('获取搜索关联规则列表', res)
                if (res.length > 0) {
                    this.relevanceRuleList = res.map(item => {
                        let obj = {}
                        obj.id = item.id
                        obj.name = item.name
                        return obj
                    })
                }
            }).catch(error => {
                console.log('error', error)
            })
        },
        // 获取搜索结果列表
        initSearchResultData() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            getSearchResultData(data).then(res => {
                console.log('获取搜索结果列表', res)
                if (res.length > 0) {
                    this.attackResultList = res.map(item => {
                        let obj = {}
                        obj.id = item.id
                        obj.name = item.name
                        return obj
                    })
                }
            }).catch(error => {
                console.log('error', error)
            })
        },
        initStartTime() {
            return new Promise((resolve, reject) => {
                let data = {
                    queryData: {},
                    paramsData: {}
                }
                get_time(data).then(res => {
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 搜索框内容
        resetFun() {
            this.alarm_params.page = 1
            this.alarm_params.size = 20
            this.get_params = {
                id: '',
                page: 1,
                size: 20,
                reportName: '',
                reportLevel: [],
                reportFrom: [],
                reportStatus: [],
                srcIp: '',
                srcPort: '',
                desIp: '',
                desPort: '',
                reportType: [],
                attackResult: [],
                ruleIds: [],
                ids: []
            }
            if (this.name == '受害') {
                this.get_params.desIp = this.ip
            } else if (this.name == '攻击') {
                this.get_params.srcIp = this.ip
            }
            setTimeout(() => {
                this.getAlarmTableList()
            }, 200)
        },
        searchCheck() {
            this.alarm_params.page = 1
            this.alarm_params.size = 20
            setTimeout(() => {
                this.getAlarmTableList()
            }, 100)
        },
        getCustomTime(val, isChartTime) {
            this.sayTimes = val
            console.log('时间', val)
        },
        setDate() {
            console.log(this.dateMode)
            if (this.dateMode === 'noUse') {
                if (this.dateData === '最近10分钟') {
                    this.$refs.customDate.handleRecently({ value: 0, name: '最近10分钟' }, 0)
                } else if (this.dateData === '最近30分钟') {
                    this.$refs.customDate.handleRecently({ value: 1, name: '最近30分钟' }, 1)
                } else if (this.dateData === '最近1小时') {
                    this.$refs.customDate.handleRecently({ value: 2, name: '最近1小时' }, 2)
                } else if (this.dateData === '最近1天') {
                    this.$refs.customDate.handleRecently({ value: 3, name: '最近1天' }, 3)
                } else if (this.dateData === '最近2天') {
                    this.$refs.customDate.handleRecently({ value: 4, name: '最近2天' }, 4)
                } else if (this.dateData === '最近7天') {
                    this.$refs.customDate.handleRecently({ value: 5, name: '最近7天' }, 5)
                } else if (this.dateData === '今天') {
                    this.$refs.customDate.handleRelative({ value: 0, name: '今天' }, 0)
                } else if (this.dateData === '昨天') {
                    this.$refs.customDate.handleRelative({ value: 1, name: '昨天' }, 1)
                } else if (this.dateData === '本周') {
                    this.$refs.customDate.handleRelative({ value: 2, name: '本周' }, 2)
                } else if (this.dateData === '上周') {
                    this.$refs.customDate.handleRelative({ value: 3, name: '上周' }, 3)
                } else if (this.dateData === '本月') {
                    this.$refs.customDate.handleRelative({ value: 4, name: '本月' }, 4)
                } else if (this.dateData === '上月') {
                    this.$refs.customDate.handleRelative({ value: 5, name: '上月' }, 5)
                }
            } else if (this.dateMode === 'use') {
                this.$refs.customDate.handleOther(this.useDate, this.useIndex)
            } else if (this.dateMode === 'useTwo') {
                this.$refs.customDate.handleUse()
            }
        },
        getDateData(date, mode, useDate, useIndex) {
            this.dateData = ''
            console.log(date, mode, useDate, useIndex)
            this.dateMode = ''
            this.useDate = useDate
            this.useIndex = useIndex
        },
        // 查看
        handleSee(row) {
            this.$refs.alarmDetailRef.handleSee(row)
        },
        // 发起工单
        async handleEdit_alarm(row) {
            console.log('发起工单', row)
            this.recordId = row.id
            await this.get_alarm_template(row)
            this.taskDialog = true
            this.orderType = 1
        },
        get_alarm_template(row) {
            this.alarmTemplate = []
            let obj = {
                id: row.id
            }
            getAlarmTemplate(obj).then(res => {
                console.log('事件模板', res)
                this.alarmTemplate = res
                this.allTemplate = this.$deepCopy(this.alarmTemplate)
            }).catch(err => {
                console.log(err)
            })
        },
        submitTaskForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = {
                        queryData: {},
                        paramsData: {
                            sourceId: this.recordId,
                            workOrderName: this.taskForm.workOrderName,
                            level: this.taskForm.level,
                            workMouldId: this.taskForm.workMouldId,
                            workOrderContent: this.taskForm.workOrderContent,
                            type: this.orderType
                        }
                    }
                    addWorkOrder(data).then(res => {
                        this.taskDialog = false
                        console.log('发起工单成功')
                        this.$message({
                            message: '发起工单成功',
                            type: 'success'
                        })
                        this.isRefresh = true
                        setTimeout(() => {
                            // this.get_data()
                            if (this.orderType == '1') {
                                this.getAlarmTableList()
                            }
                        }, 1500)
                    }).catch(error => {
                        this.taskDialog = false
                        console.log(error + 'error')
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },

        // 状态变更
        handleChangeStatus(row) {
            this.stateDialog = true
            this.statusId = row.id
        },
        submitStateForm() {
            let data = {
                ids: [this.statusId],
                reportStatus: this.stateForm.reportStatus,
                analyzePro: this.stateForm.analyzePro,
                rejectReason: this.stateForm.rejectReason,
                actionResults: this.stateForm.actionResults,
                changeLog: this.stateForm.remark
            }
            changeStatus(data).then(res => {
                this.stateDialog = false
                this.isRefresh = true
                this.$message({
                    message: '状态变更成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.getAlarmTableList()
                }, 1500)
            }).catch(err => {
                this.stateDialog = false
                console.log(err)
            })
        },

        // 初始数据
        init(ip, name) {
            this.detailDialog = true
            this.get_params = {
                id: '',
                page: 1,
                size: 20,
                reportName: '',
                reportLevel: [],
                reportFrom: [],
                reportStatus: [],
                srcIp: '',
                srcPort: '',
                desIp: '',
                desPort: '',
                reportType: [],
                attackResult: [],
                ruleIds: [],
                ids: []
            }
            this.ip = ip
            this.name = name
            this.sayTimes = []
            if (this.name == '受害') {
                this.get_params.desIp = ip
            } else if (this.name == '攻击') {
                this.get_params.srcIp = ip
            }
            this.isEmpty = true
            this.alarm_total_num = 0
            this.alarm_total__count = 0
            this.alarm_params = {
                id: '',
                page: 1,
                size: 20
            }
            console.log('点击进来')
            // setTimeout(() => {
            this.getAlarmTableList()
            // }, 300)
        },
        indexMethod(index) {
            return (this.alarm_params.page - 1) * this.alarm_params.size + index + 1
        },
        handleSizeChange_alarm(val) {
            this.alarm_params.size = val
            this.getAlarmTableList()
        },
        handleCurrentChange_alarm(val) {
            this.alarm_params.page = val
            this.getAlarmTableList()
        },
        getAlarmTableList() {
            setTimeout(() => {
                this.setDate()
            }, 100)
            this.alarmTableData = []
            this.loading_alarm = true
            let obj = {
                id: this.get_params.id,
                reportFrom: this.get_params.reportFrom, // 事件来源
                reportStatus: this.get_params.reportStatus, // 事件状态
                reportName: this.get_params.reportName, // 事件名称
                reportLevel: this.get_params.reportLevel, // 事件等级
                reportType: this.get_params.reportType, // 事件类型
                startTime: this.sayTimes.length === 0 ? '' : this.sayTimes[0], // 开始时间
                endTime: this.sayTimes.length === 0 ? '' : this.sayTimes[1], // 结束时间
                srcIp: this.get_params.srcIp, // 源IP
                srcPort: this.get_params.srcPort, // 源端口
                desIp: this.get_params.desIp, // 目的IP
                desPort: this.get_params.desPort, // 目的端口
                attackResult: this.get_params.attackResult, // 攻击结果
                ruleIds: this.get_params.ruleIds // 规则集合
            }
            if (this.name == '受害') {
                let data = {
                    paramsData: {
                        // desIp: this.ip
                        ...obj
                    },
                    queryData: {
                        page: this.alarm_params.page,
                        pageSize: this.alarm_params.size
                    }
                }
                getAssetAlarmTable(data).then(res => {
                    console.log(res, '告警')
                    this.loading_alarm = false
                    this.alarm_total__count = res.total
                    let total = res.total
                    /* 动态设置总页数*/
                    // if (this.alarm_params.page < 4 && total > 7 * this.alarm_params.size) {
                    //     this.alarm_total_num = 7 * this.alarm_params.size
                    // } else if (this.alarm_params.page >= 4 && (total > (this.alarm_params.page + 3) * this.alarm_params.size)) {
                    //     this.alarm_total_num = (this.alarm_params.page + 3) * this.alarm_params.size
                    // } else {
                    this.alarm_total_num = res.total
                    // }
                    let content = res.records
                    if (content.length) {
                        content.forEach(item => {
                            let obj = {}
                            // obj.id = item.id
                            // obj.reportFrom = item.reportFrom
                            // obj.reportTypeName = item.reportTypeName
                            // obj.reportLevel = item.reportLevel
                            // obj.reportName = item.reportName
                            // obj.reportStatus = item.reportStatus
                            // obj.attackResult = item.attackResult
                            // obj.isStart = item.isStart
                            obj.id = item.id
                            obj.count = item.count ? item.count : ''
                            obj.assetName = item.assetName
                            obj.alarm_from = item.reportFrom == 1 ? '自动' : '手动'
                            obj.reportFrom = item.reportFrom
                            obj.reportName = item.reportName
                            obj.reportDesc = item.reportDesc
                            obj.createTime = item.createTime
                            obj.reportType = item.reportType
                            obj.reportTypeName = item.reportTypeName
                            obj.reportLevel = item.reportLevel
                            obj.reportStatus = item.reportStatus
                            obj.asset = item.asset
                            obj.sourcePort = item.sourcePort
                            obj.sourceAddr = item.sourceAddr
                            obj.targetAddr = item.targetAddr
                            obj.targetPort = item.targetPort
                            obj.object = item.object
                            obj.result = item.result
                            obj.sendFlow = item.sendFlow
                            obj.duraTime = item.duraTime
                            obj.initMsg = item.initMsg
                            obj.operate = item.operate
                            obj.analyzePro = item.analyzePro
                            obj.advice = item.advice
                            obj.actionType = item.actionType
                            obj.actionResults = item.actionResults
                            obj.appendProposal = item.appendProposal
                            obj.rejectReason = item.rejectReason
                            obj.msg = item.msg ? item.msg : '[]'
                            obj.assetIp = item.assetIp
                            obj.actionType = item.actionType
                            obj.actionResults = item.actionResults
                            obj.appendProposal_disposal = item.appendProposal_disposal ? item.appendProposal_disposal : ''
                            obj.appendProposal_analysis = item.appendProposal_analysis ? item.appendProposal_analysis : ''
                            obj.appendProposal_report = item.appendProposal_report ? item.appendProposal_report : ''
                            obj.appendProposal_trace = item.appendProposal_trace ? item.appendProposal_trace : ''
                            obj.traceResult = item.traceResult ? item.traceResult : ''
                            obj.isTrace = item.isTrace
                            obj.isTraceEnd = item.isTraceEnd
                            obj.isAnalysis = item.isAnalysis
                            obj.isBanned = item.isBanned === '0' ? 0 : item.isBanned
                            obj.isStart = item.isStart
                            obj.ruleName = item.ruleName
                            obj.ruleId = item.ruleId
                            obj.srcIp = item.srcIp
                            obj.srcPort = item.srcPort
                            obj.desIp = item.desIp
                            obj.desPort = item.desPort
                            obj.domainName = item.domainName
                            obj.securityDomain = item.securityDomain
                            obj.gbNum = item.gbNum
                            obj.attackResult = item.attackResult
                            obj.dt = item.dt
                            obj.logId = item.logId ?? ''
                            obj.logType = item.logType ?? ''
                            obj.taskType = item.taskType ? item.taskType : ''
                            obj.checkStatus = item.checkStatus === '0' ? 0 : item.checkStatus
                            obj.records = item.records

                            this.alarmTableData.push(obj)
                        })
                    }
                }).catch(err => {
                    this.loading_alarm = false
                    console.log(err, 'err')
                })
            } else if (this.name == '攻击') {
                let data = {
                    paramsData: {
                        // srcIp: this.ip
                        ...obj
                    },
                    queryData: {
                        page: this.alarm_params.page,
                        pageSize: this.alarm_params.size
                    }
                }
                getAlarmTable(data).then(res => {
                    console.log(res, '告警')
                    this.loading_alarm = false
                    this.alarm_total__count = res.totalElements
                    let total = res.totalElements
                    /* 动态设置总页数*/
                    // if (this.alarm_params.page < 4 && total > 7 * this.alarm_params.size) {
                    //     this.alarm_total_num = 7 * this.alarm_params.size
                    // } else if (this.alarm_params.page >= 4 && (total > (this.alarm_params.page + 3) * this.alarm_params.size)) {
                    //     this.alarm_total_num = (this.alarm_params.page + 3) * this.alarm_params.size
                    // } else {
                    this.alarm_total_num = res.total
                    // }
                    let content = res.records
                    if (content.length) {
                        content.forEach(item => {
                            let obj = {}
                            // obj.id = item.id
                            // obj.reportFrom = item.reportFrom
                            // obj.reportTypeName = item.reportTypeName
                            // obj.reportLevel = item.reportLevel
                            // obj.reportName = item.reportName
                            // obj.reportStatus = item.reportStatus
                            // obj.attackResult = item.attackResult
                            // obj.isStart = item.isStart
                            obj.id = item.id
                            obj.count = item.count ? item.count : ''
                            obj.assetName = item.assetName
                            obj.alarm_from = item.reportFrom == 1 ? '自动' : '手动'
                            obj.reportFrom = item.reportFrom
                            obj.reportName = item.reportName
                            obj.reportDesc = item.reportDesc
                            obj.createTime = item.createTime
                            obj.reportType = item.reportType
                            obj.reportTypeName = item.reportTypeName
                            obj.reportLevel = item.reportLevel
                            obj.reportStatus = item.reportStatus
                            obj.asset = item.asset
                            obj.sourcePort = item.sourcePort
                            obj.sourceAddr = item.sourceAddr
                            obj.targetAddr = item.targetAddr
                            obj.targetPort = item.targetPort
                            obj.object = item.object
                            obj.result = item.result
                            obj.sendFlow = item.sendFlow
                            obj.duraTime = item.duraTime
                            obj.initMsg = item.initMsg
                            obj.operate = item.operate
                            obj.analyzePro = item.analyzePro
                            obj.advice = item.advice
                            obj.actionType = item.actionType
                            obj.actionResults = item.actionResults
                            obj.appendProposal = item.appendProposal
                            obj.rejectReason = item.rejectReason
                            obj.msg = item.msg ? item.msg : '[]'
                            obj.assetIp = item.assetIp
                            obj.actionType = item.actionType
                            obj.actionResults = item.actionResults
                            obj.appendProposal_disposal = item.appendProposal_disposal ? item.appendProposal_disposal : ''
                            obj.appendProposal_analysis = item.appendProposal_analysis ? item.appendProposal_analysis : ''
                            obj.appendProposal_report = item.appendProposal_report ? item.appendProposal_report : ''
                            obj.appendProposal_trace = item.appendProposal_trace ? item.appendProposal_trace : ''
                            obj.traceResult = item.traceResult ? item.traceResult : ''
                            obj.isTrace = item.isTrace
                            obj.isTraceEnd = item.isTraceEnd
                            obj.isAnalysis = item.isAnalysis
                            obj.isBanned = item.isBanned === '0' ? 0 : item.isBanned
                            obj.isStart = item.isStart
                            obj.ruleName = item.ruleName
                            obj.ruleId = item.ruleId
                            obj.srcIp = item.srcIp
                            obj.srcPort = item.srcPort
                            obj.desIp = item.desIp
                            obj.desPort = item.desPort
                            obj.domainName = item.domainName
                            obj.securityDomain = item.securityDomain
                            obj.gbNum = item.gbNum
                            obj.attackResult = item.attackResult
                            obj.dt = item.dt
                            obj.logId = item.logId ?? ''
                            obj.logType = item.logType ?? ''
                            obj.taskType = item.taskType ? item.taskType : ''
                            obj.checkStatus = item.checkStatus === '0' ? 0 : item.checkStatus
                            obj.records = item.records

                            this.alarmTableData.push(obj)
                        })
                    }
                }).catch(err => {
                    this.loading_alarm = false
                    console.log(err, 'err')
                })
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .el-select{
            ::v-deep .el-input{
                // height:32px !important;
            }
        }
    .search{
        ::v-deep .el-input__inner{
            height:32px;
            line-height:32px;
        }
    }
    .search-text {
        display: block;
        width: 80px;
        color:rgba(0,0,0,0.4);
        cursor: pointer;
        font-size:12px;
        height: 20px;
        margin-top: 8px;
        text-align: right;
    }
    .alarm-state{
        width:70px;
        height:18px;
        padding:0px 5px;
        border-radius: 11px;
        &.one{
            background-color: #fde6d8;
            // border: 1px solid rgb(255,186,0);
            color:#e47700;
        }
        &.two{
            background-color: #ccf6e4;
            // border: 1px solid rgb(150,255,150);
            color:#03864f;
        }
        &.three{
            background-color: #d5e5fa;
            // border: 1px solid rgb(0,192,255);
            color:#0052d9;
        }
        &.four{
            background-color: #fad7dd;
            // border: 1px solid rgb(255,58,58);
            color:#aa0202;
        }
    }
</style>
