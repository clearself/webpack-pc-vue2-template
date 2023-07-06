<template>
    <div class="list" style="overflow-y:hidden">
        <SearchTop @search="searchCheck" @reset="reset">
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params" style="width: 100%" label-position="left" label-width="75px">
                    <el-form-item label="受害资产IP:">
                        <el-input
                            placeholder="请输入"
                            clearable
                            v-model="get_params.desIp"
                            style="width: 100%"
                            size="small">
                        </el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params" style="width: 100%" label-position="left" label-width="65px">
                    <el-form-item label="攻击手段:">
                        <el-select
                            v-model="get_params.reportType"
                            filterable
                            placeholder="请选择"
                            style="width: 100%"
                            size="small"
                            clearable>
                            <el-option
                                v-for="(item, index) in alarmTypeList"
                                :key="index"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params">
                    <el-form-item label="攻击时间:" label-position="left" label-width="65px">
                        <CustomDate :append-to-body="true" :auto="true" @getCustomTime="getCustomTime" @getDateData="getDateData"  @actualTime="actualTimeData" @timeUnit="timeUnitData" :empty="isReset" ref="customDate"></CustomDate>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params">
                    <el-form-item label-width="65px" label="组织架构:" label-position="left">
                        <div class="treeselect">
                            <Treeselect
                                @input="inputChange"
                                :appendToBody="true"
                                size="small"
                                style="width:100%;"
                                :options="treeData"
                                :normalizer="normalizer"
                                noChildrenText="当前分支无子节点"
                                noOptionsText="无可用选项"
                                noResultsText="无可用选项"
                                placeholder="请选择"
                                v-model="get_params.orgId"
                            />
                        </div>
                    </el-form-item>
                </el-form>
            </el-col>
        </SearchTop>
        <div class="list-container">
            <div class="ub ub-pj w100 isunfold ">
                <div class="list-tips" style="height:24px;line-height:24px">统计</div>
                <div class="unfold" @click="handleUnfold">{{isunfold?'收起':'展开'}}<i :class="['el-icon-arrow-down',isunfold?'icon-select':'icon-select1']"></i>
                </div>
            </div>
            <div class="chart-row ub ub-pj" v-show="isunfold">
                <div class="chart-left">
                    <div class="chart-box">
                        <div class="ub ub-pj ub-ac">
                            <div class="chart-title">{{currentBar1 === '1' ? '受害安全域统计TOP10' : '受害业务系统统计TOP10'}}</div>
                            <div class="ub ub-pe chart-btn" @click="changeMap">
                                <i class="el-icon-sort"></i>
                                <p>{{currentBar1 === '1' ? '业务系统' : '安全域'}}</p>
                            </div>
                        </div>
                        <div class="chart-map">
                            <!-- v-loading="loading_safe" -->
                            <div  style="height:210px;" element-loading-background="transparent" v-loading="loading_safe">
                                <div
                                    v-if="!safetyData.length"
                                    class="ub ub-f1 ub-ac ub-pc"
                                    style="height:100%;color:rgb(144, 147, 153);font-size:14px;">
                                    暂无数据
                                </div>
                                <bar v-if="safetyData.length>0" type="1" :chartData="safetyData"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="chart-center">
                    <div class="chart-box">
                        <div class="ub ub-pj ub-ac">
                            <div class="chart-title">{{currentBar2 | showBar2}}</div>
                            <div class="ub ub-pe chart-btn select">
                                <el-dropdown trigger="click">
                                    <span class="el-dropdown-link" style="cursor: pointer;color: rgba(0,0,0,.9);font-size: 12px">
                                        {{currentBar2 | showBar2_title}}<i class="el-icon-arrow-down el-icon--right"></i>
                                    </span>
                                    <el-dropdown-menu slot="dropdown" class="bar-select" style="width: 80px !important;" @click.native="changeBar2($event)">
                                        <el-dropdown-item data-type="zc">资产</el-dropdown-item>
                                        <el-dropdown-item data-type="zj">主机</el-dropdown-item>
                                        <el-dropdown-item data-type="aqsb">安全设备</el-dropdown-item>
                                        <el-dropdown-item data-type="wlsb">网络设备</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </div>
                        </div>
                        <div class="chart-map">
                            <!-- v-loading="loading_asset_bar" -->
                            <div v-loading="loading_asset_bar" style="height:210px;" element-loading-background="transparent">
                                <div
                                    v-if="!assetBar.length"
                                    class="ub ub-f1 ub-ac ub-pc"
                                    style="height:100%;color:rgb(144, 147, 153);font-size:14px;">
                                    暂无数据
                                </div>
                                <bar v-if="assetBar.length>0" type="2" :chartData="assetBar"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="chart-right">
                    <div class="chart-box" style="top:-12px">
                        <div class="chart-title" style="padding-top: 12px;">受害资产类型TOP10</div>
                        <div class="chart-map">
                            <!-- v-loading="loading_asset_pie"  -->
                            <div class="ub ub-f1" style="height:240px !important;" element-loading-background="transparent" v-loading="loading_asset_pie">
                                <div
                                    v-if="!assetPie.length"
                                    class="ub ub-f1 ub-ac ub-pc"
                                    style="height:100%;color:rgb(144, 147, 153);font-size:14px;">
                                    暂无数据
                                </div>
                                <pie v-if="assetPie.length>0" :chartData="assetPie"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="table-area">
                <div class="ub ub-pj w100 mb-1 ub-ac">
                    <div class="list-tips">受害资产分析</div>
                </div>
                <el-table
                    ref="multipleTable"
                    v-loading="loading"
                    class='bigTable full-table'
                    :data="tableData"
                    :row-class-name="tableRowClassName"
                    border
                    stripe
                    tooltip-effect="dark"
                    @sort-change="changeOrder"
                    :height="tabHeight"
                    :row-style="{ height: '32px' }"
                    :header-row-style="{ height: '32px' }"
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="30" align="center"></el-table-column>
                    <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                    </el-table-column>
                    <el-table-column prop="desIp" label="资产IP" width="200" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="lastTime" label="最新攻击时间" width="160" sortable="custom">
                    </el-table-column>
                    <el-table-column prop="reportTypeCN" label="攻击手段" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="num" label="已处置事件/事件总量" width="160" align="right">
                        <template slot-scope="{row}">
                            <p style="font-size: 0;cursor: pointer" @click="handleSeeAlarm(row)">
                                <span class="num-end" style="color: #0052d9;font-size: 12px; text-decoration: underline">{{row.dealAlarmNum}}/</span>
                                <span class="num-sum" style="color: rgba(0,0,0,0.9);font-size: 12px; text-decoration: underline">{{row.num}}</span>
                            </p>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="120">

                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="handleSee(scope.row)" v-per="['alarm_assetsAnalysis_look']">查看</el-button>
                            <el-button type="text" size="small" :disabled="scope.row.isStart == 1"  @click="handleEdit(scope.row)" v-per="['alarm_assetsAnalysis_order']">发起工单</el-button>
                        </template>
                    </el-table-column>

                </el-table>
                <pagination :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size"  style="padding-top:10px" @pagination="get_data" v-show="total_num>0"/>
            </div>
        </div>
        <el-dialog v-dialogDrag title="发起工单" :visible.sync="taskDialog" width="700px" custom-class="common-dialog">
            <el-form :model="taskForm" :rules="rules" ref="taskForm" label-position="top" >
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
                <el-form-item label="模板类型:" prop="mouldType" :label-width="formLabelWidth">
                    <el-select style="width: 100%;" size="small" v-model="taskForm.mouldType" clearable placeholder="请选择"  @change="changeMouldType">
                        <el-option v-for="(item, index) in mouldTypeList" :key="index" :label="item.name" :value="item.id"></el-option>
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
                    <el-button :loading="isSubmitTask" type="primary" @click.native="submitTaskForm('taskForm')" size="small">确认</el-button>
                </Debounce>
            </span>
        </el-dialog>
        <el-dialog v-dialogDrag title="资产详情" :visible.sync="assetsDetailDialog" width="700px" custom-class="common-dialog">
            <div class="frame">
                <el-descriptions :column="1" size="mini" border>
                    <el-descriptions-item label="资产名称">
                        {{ assetsInfo.deviceName||'--' }}
                    </el-descriptions-item>
                    <el-descriptions-item label="资产标识">
                        {{ assetsInfo.uniqueCode||'--' }}
                    </el-descriptions-item>
                    <el-descriptions-item label="设备类型">
                        {{ assetsInfo.deviceTypeName||'--' }}
                    </el-descriptions-item>
                    <el-descriptions-item label="厂商">
                        {{ assetsInfo.manufacturerName||'--' }}
                    </el-descriptions-item>
                    <el-descriptions-item label="型号">
                        {{ assetsInfo.modelInfo||'--' }}
                    </el-descriptions-item>
                    <el-descriptions-item label="系统">
                        {{ assetsInfo.pcSystem||'--' }}
                    </el-descriptions-item>
                    <el-descriptions-item label="是否边界">
                        <div v-if="JSON.stringify(assetsInfo) !== '{}'">{{ assetsInfo.isBoundary==1?'是':'否' }}</div>
                        <div v-else>--</div>
                    </el-descriptions-item>
                    <el-descriptions-item label="业务系统">
                        {{ assetsInfo.systemName||'--' }}
                    </el-descriptions-item>
                    <el-descriptions-item label="所属安全域">
                        {{ assetsInfo.zoneName||'--' }}
                    </el-descriptions-item>
                    <el-descriptions-item label="创建时间">
                        {{ assetsInfo.createTime||'--' }}
                    </el-descriptions-item>
                    <el-descriptions-item label="资产联系人">
                        <el-tag style="margin-right: 10px;" type="success" color="lightgreen" size="mini" v-for="(item,index) in assetsInfo.systemUsers"  :key="index">{{item.chineseName}}</el-tag>
                        <div v-if="!assetsInfo.systemUsers">--</div>
                    </el-descriptions-item>
                </el-descriptions>
            </div>
            <div v-if="assetsInfo.ips&&assetsInfo.ips.length>0">
                <el-table ref="ipstiple" class='bigTable' :data="assetsInfo.ips" border stripe tooltip-effect="dark">
                    <el-table-column prop="assetsIp" label="IP">
                    </el-table-column>
                    <el-table-column label="端口">
                        <template slot-scope="scope">
                            <div>
                                <div v-if="scope.row.ports.length>0">
                                    <span style="margin: 10px;" v-for="(item,index) in scope.row.ports" :key="index">{{item.port}}</span>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-dialog>
        <el-dialog v-dialogDrag title="事件状态变更" :visible.sync="stateDialog" width="800px" custom-class="attendance-dialog">
            <el-form :model="stateForm" :rules="rules" ref="stateForm">
                <el-form-item style="width:100%;" label="事件状态：" :label-width="formLabelWidth" prop="reportStatus">
                    <el-select size="small" style="width:660px" v-model="stateForm.reportStatus" placeholder="请选择">
                        <el-option label="已处置" value="2"></el-option>
                        <el-option label="已驳回" value="3"></el-option>
                    </el-select>
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
                <searchBtn title="确 定" @click="submitStateForm('stateForm')" />
                <cancelBtn title="取 消" @click="stateDialog = false" />
            </span>
        </el-dialog>
        <!-- 新的资产详情 -->
        <list ref="alarmDetailRef" @parentBack="parentBack"></list>
    </div>
</template>

<script>
import CustomDate from '@/pages/alarm/alarm_detail_drawer/index.vue'
import bar from './charts/assetAnalysis/bar'
import pie from './charts/assetAnalysis/pie'
import VueUeditorWrap from '../../components/vue-ueditor-wrap.vue' // ES6 Module
import ueditorConfig from '../../mixins/ueditorConfig'
import list from './alarm_detail_drawer/alarm_list.vue'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {
    getAssetList,
    getAlarmTemplate,
    getAssetTemplate,
    getAssetAlarmType,
    addWorkOrder,
    changeStatus,
    getAssetAlarmTable,
    getAssetBarPie,
    getAssetBar2,
    getAssetBarPie3,
    assetsInfo1,
    assetsAnalysisAdd_workTask
} from '../../server/alarm/define.js'
import {
    getTreeOrg
} from '../../server/alarm/alarm.js'
export default {
    name: 'AssetAnalysis',
    components: {
        bar,
        pie,
        VueUeditorWrap,
        list,
        CustomDate,
        Treeselect
    },
    mixins: [ueditorConfig],
    data() {
        return {
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
            isSubmitTask: false,
            tabHeight: document.body.clientHeight - 580,
            isReset: false,
            isunfold: true,
            assetsDetailDialog: false,
            assetsInfo: {},
            pickerOptions: {
                shortcuts: [{
                    text: '1小时内',
                    onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    text: '1天内',
                    onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    text: '7天内',
                    onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    text: '本月',
                    onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setDate(1)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                        picker.$emit('pick', [start, end])
                    }
                }]
            },

            currentBar1: '1',
            currentBar2: 'zc',
            loading_safe: false,
            loading_asset_bar: false,
            loading_asset_pie: false,
            loading_alarm: false,
            recordType: 'zc',
            securityDomainData: [], // 安全域
            systemNameData: [], // 业务系统
            safetyData: [],
            assetBar: [],
            assetPie: [],
            meargeData: [],
            formLabelWidth: '100px',
            loading: false,
            total_num: 0,
            multipleSelection: [],
            recordId: '',
            record_desIp: '',
            tableData: [],
            sayTimes: null,
            get_params: {
                id: '',
                page: 1,
                size: 20,
                sortField: 'num',
                order: 'DESC',
                desIp: '',
                reportType: '',
                orgId: null
            },
            // 弃用
            alarm_total_num: 0,
            alarm_total__count: 0,
            alarmTableData: [],
            alarm_params: {
                id: '',
                page: 1,
                size: 10
            },

            alarmTypeList: [],
            taskDialog: false,
            taskForm: {
                mouldType: '',
                workOrderName: '',
                workMouldId: '',
                level: '',
                workOrderContent: ''
            },
            stateForm: {
                reportStatus: '2',
                actionResults: '',
                analyzePro: '',
                rejectReason: ''
            },
            stateDialog: false,
            statusId: '',
            alarmDetailDialog: false,
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
                mouldType: [{
                    required: true,
                    message: '请选择模板类型',
                    trigger: 'change'
                }],
                workMouldId: [{
                    required: true,
                    message: '请选择工单模板',
                    trigger: 'change'
                }]
            },
            treeData: [],
            normalizer(node) {
                return {
                    id: node.id,
                    label: node.name,
                    children: node.children
                }
            },
            orderType: '',
            allTemplate: [],
            assetTemplate: [],
            alarmTemplate: []
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.initTree()
            // this.get_asset_template()
            this.get_data()
            this.getAlarmList()
            this.getAssetChartBar()
            this.getAssetChartPie3()
            this.getAssetChartPie1()
        })
    },
    watch: {
        taskDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.taskForm.resetFields()
                    this.taskForm = {
                        workOrderName: '',
                        workMouldId: '',
                        level: '',
                        mouldType: '',
                        workOrderContent: ''
                    }
                }
            }
        },
        stateDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.stateForm.resetFields()
                    this.stateForm.rejectReason = ''
                    this.stateForm.analyzePro = ''
                    this.stateForm.actionResults = ''
                }
            }
        },
        assetsDetailDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.assetsInfo = {}
                }
            }
        },
        isunfold(val) {
            if (val) {
                this.tabHeight = document.body.clientHeight - 580
            } else {
                this.tabHeight = document.body.clientHeight - 288
            }
        }
    },
    filters: {
        showBar2(val = 'zc') {
            let obj = {
                zc: '资产',
                zj: '主机',
                aqsb: '安全设备',
                wlsb: '网络设备'
            }
            return '受害' + obj[val] + 'TOP10'
        },
        showBar2_title(val = 'zc') {
            let obj = {
                zc: '资产',
                zj: '主机',
                aqsb: '安全设备',
                wlsb: '网络设备'
            }
            return obj[val]
        }
    },
    methods: {
        changeMouldType(val) {
            if (val !== '') {
                this.get_asset_template()
            } else {
                this.allTemplate = []
            }
        },
        initTree() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            getTreeOrg(data).then(res => {
                console.log('tree', res)
                this.treeData = res
                console.log(this.organizationIds)
            }).catch(error => {
                console.log('error' + error)
            })
        },
        inputChange() {
        },
        tableRowClassName({ row, rowIndex }) {
            console.log(rowIndex)
            if (rowIndex % 2) {
                return 'table-row2'
            } else {
                return 'table-row1'
            }
        },
        actualTimeData(val) {
            this.actualTime = val
        },
        timeUnitData(val) {
            this.timeUnit = val
        },
        getDateData(date, mode, useDate, useIndex) {
            this.dateData = date
            this.dateMode = mode
            console.log('getDateData----dateData', this.dateData)
            this.useDate = useDate
            this.useIndex = useIndex
        },
        getCustomTime(val, isChartTime) {
            this.sayTimes = val
            console.log('时间', val)
        },
        parentBack() {
            this.get_data()
        },
        handleUnfold() {
            this.isunfold = !this.isunfold
        },
        reset() {
            this.get_params = {
                id: '',
                page: 1,
                size: 20,
                sortField: 'num',
                order: 'DESC',
                desIp: '',
                reportType: '',
                orgId: null
            }
            this.sayTimes = null
            this.isReset = true
            setTimeout(() => {
                this.isReset = false
            }, 300)
            this.get_params.page = 1
            this.get_data()
            this.getAssetChartBar()
            this.getAssetChartPie3()
            this.getAssetChartPie1()
        },
        handleSee(row) {
            console.log(row)
            this.assetsDetailDialog = true
            assetsInfo1({ ip: row.desIp }).then(res => {
                console.log(res)
                this.$set(this, 'assetsInfo', res)
            }).catch(err => {
                console.log(err)
            })
        },
        changeMap() {
            if (this.currentBar1 === '1') {
                this.currentBar1 = '2'
                this.safetyData = []
                setTimeout(() => {
                    this.safetyData = this.$deepCopy(this.systemNameData)
                }, 0)
            } else if (this.currentBar1 === '2') {
                this.currentBar1 = '1'
                this.safetyData = []
                setTimeout(() => {
                    this.safetyData = this.$deepCopy(this.securityDomainData)
                }, 0)
            }
        },
        changeBar2(e) {
            // console.log(e.target.dataset)
            if (e.target.dataset.type) {
                this.currentBar2 = e.target.dataset.type
                this.getAssetChartBar()
            }
        },
        changeOrder(val) {
            console.log(val)
            let obj = {
                ascending: 'ASC',
                descending: 'DESC'
            }
            this.get_params.sortField = val.prop
            this.get_params.order = (val.order && obj[val.order])
            val.order === null && (this.get_params.order = 'DESC') && (this.get_params.sortField = 'num')
            this.get_data()
        },
        // 图表一
        getAssetChartPie1() {
            this.loading_safe = true
            getAssetBarPie({
                orgId: this.get_params.orgId != null ? this.get_params.orgId : ''
            }).then(res => {
                this.loading_safe = false
                this.safetyData = []
                this.securityDomainData = []
                this.systemNameData = []
                if (res.getSystems.length) {
                    res.getSystems.splice(10)
                    res.getSystems.forEach(item => {
                        let obj_system = {}

                        obj_system.name = item.systemName
                        obj_system.value = item.num

                        this.systemNameData.push(obj_system)
                    })
                    this.safetyData = this.$deepCopy(this.systemNameData)
                }
                if (res.safetyZone.length) {
                    res.safetyZone.splice(10)
                    res.safetyZone.forEach(item => {
                        let obj_security = {}

                        obj_security.name = item.name
                        obj_security.value = item.num

                        this.securityDomainData.push(obj_security)
                    })
                    this.safetyData = this.$deepCopy(this.securityDomainData)
                }
            }).catch(err => {
                this.loading_safe = false
                console.log(err)
            })
        },
        // 图表三
        getAssetChartPie3() {
            this.loading_asset_pie = true
            getAssetBarPie3({
                orgId: this.get_params.orgId != null ? this.get_params.orgId : ''
            }).then(res => {
                this.loading_asset_pie = false
                this.assetPie = []
                if (res.length) {
                    res.splice(10)
                    res.forEach(item => {
                        let obj_pie = {}

                        obj_pie.name = item.name
                        obj_pie.value = item.num

                        this.assetPie.push(obj_pie)
                    })
                }
            }).catch(err => {
                this.loading_asset_pie = false
                console.log(err)
            })
        },
        // 图表二
        getAssetChartBar() {
            this.loading_asset_bar = true
            let obj = {
                type: this.currentBar2,
                orgId: this.get_params.orgId != null ? this.get_params.orgId : ''
            }
            this.assetBar = []
            getAssetBar2(obj).then(res => {
                console.log('2图表', res)
                if (res.length) {
                    res.splice(10)
                    res.forEach(item => {
                        let obj = {}
                        obj.name = item.assetName
                        obj.value = item.num

                        this.assetBar.push(obj)
                    })
                }
                this.loading_asset_bar = false
            }).catch(err => {
                this.loading_asset_bar = false
                console.log(err)
            })
        },
        getAlarmList() {
            this.alarmTypeList = []
            getAssetAlarmType({}).then(res => {
                console.log(res, '攻击行为')
                this.alarmTypeList = res
            }).catch(err => {
                console.log(err + 'err')
            })
        },
        submitTaskForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.isSubmitTask = true
                    let data = {
                        queryData: {},
                        paramsData: {
                            sourceId: this.recordId,
                            workOrderName: this.taskForm.workOrderName,
                            level: this.taskForm.level,
                            mouldType: this.taskForm.mouldType,
                            workMouldId: this.taskForm.workMouldId,
                            workOrderContent: this.taskForm.workOrderContent,
                            type: this.orderType
                        }
                    }
                    assetsAnalysisAdd_workTask(data).then(res => {
                        this.isSubmitTask = false
                        this.taskDialog = false
                        console.log('发起工单成功')
                        this.$message({
                            message: '发起工单成功',
                            type: 'success'
                        })
                        setTimeout(() => {
                            this.get_data()
                            if (this.orderType == '1') {
                                this.getAlarmTableList()
                            }
                        }, 1500)
                    }).catch(error => {
                        this.isSubmitTask = false
                        this.taskDialog = false
                        console.log(error + 'error')
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        submitStateForm() {
            let data = {
                ids: [this.statusId],
                reportStatus: this.stateForm.reportStatus,
                analyzePro: this.stateForm.analyzePro,
                rejectReason: this.stateForm.rejectReason,
                actionResults: this.stateForm.actionResults
            }
            changeStatus(data).then(res => {
                this.stateDialog = false
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
        get_alarm_template(row) {
            // this.alarmTemplate = []
            let obj = {
                id: 4,
                mouldType: this.taskForm.mouldType
            }
            getAlarmTemplate(obj).then(res => {
                console.log('事件模板', res)
                // this.alarmTemplate = res
                this.allTemplate = res
                // this.allTemplate = this.$deepCopy(this.alarmTemplate)
            }).catch(err => {
                console.log(err)
            })
        },
        get_asset_template(row) {
            let obj = {
                id: 3,
                mouldType: this.taskForm.mouldType
            }
            getAssetTemplate(obj).then(res => {
                this.allTemplate = res
                console.log('资产模板', res)
            }).catch(err => {
                console.log(err)
            })
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
                    sortField: this.get_params.sortField,
                    order: this.get_params.order,
                    desIp: this.get_params.desIp,
                    reportType: this.get_params.reportType,
                    startTime: this.sayTimes && this.sayTimes.length > 0 ? this.sayTimes[0] : '',
                    endTime: this.sayTimes && this.sayTimes.length > 0 ? this.sayTimes[1] : '',
                    orgId: this.get_params.orgId != null ? this.get_params.orgId : ''
                }
            }
            getAssetList(data).then(res => {
                console.log('列表', res)
                this.loading = false
                this.tableData = []
                let total = res.total
                /* 动态设置总页数*/
                // if (this.get_params.page < 4 && total > 7 * this.get_params.size) {
                //     this.total_num = 7 * this.get_params.size
                // } else if (this.get_params.page >= 4 && (total > (this.get_params.page + 3) * this.get_params.size)) {
                //     this.total_num = (this.get_params.page + 3) * this.get_params.size
                // } else {
                this.total_num = res.total
                // }
                let content = res.records
                if (content.length) {
                    content.forEach(item => {
                        let obj = {}
                        obj.dealAlarmNum = item.dealAlarmNum
                        obj.desIp = item.desIp
                        obj.firstTime = item.firstTime
                        obj.id = item.id
                        obj.lastTime = item.lastTime
                        obj.num = item.num
                        obj.assetsInfo = item.assetsInfo
                        obj.reportType = item.reportType
                        obj.reportTypeCN = item.reportTypeCN || '--'
                        obj.isStart = item.isStart
                        this.tableData.push(obj)
                    })
                }
            }).catch(err => {
                this.loading = false
                console.log(err + 'err')
            })
        },
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        searchCheck() {
            this.get_params.page = 1
            this.safetyData = []
            this.get_data()
            this.getAssetChartBar()
            this.getAssetChartPie3()
            this.getAssetChartPie1()
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
        },
        handleSeeAlarm(row) {
            // this.alarmDetailDialog = true
            this.record_desIp = row.desIp
            // this.getAlarmTableList()
            this.$refs.alarmDetailRef.init(row.desIp, '受害')
        },
        // 方法弃用
        getAlarmTableList() {
            this.alarmTableData = []
            this.loading_alarm = true
            let data = {
                paramsData: {
                    desIp: this.record_desIp
                },
                queryData: {
                    page: this.alarm_params.page,
                    pageSize: this.alarm_params.size
                }
            }
            getAssetAlarmTable(data).then(res => {
                console.log(res, '告警')
                this.loading_alarm = false
                this.alarm_total__count = res.totalElements
                let total = res.totalElements
                /* 动态设置总页数*/
                if (this.alarm_params.page < 4 && total > 7 * this.alarm_params.size) {
                    this.alarm_total_num = 7 * this.alarm_params.size
                } else if (this.alarm_params.page >= 4 && (total > (this.alarm_params.page + 3) * this.alarm_params.size)) {
                    this.alarm_total_num = (this.alarm_params.page + 3) * this.alarm_params.size
                } else {
                    this.alarm_total_num = res.totalElements
                }
                let content = res.content
                if (content.length) {
                    content.forEach(item => {
                        let obj = {}
                        obj.id = item.id
                        obj.reportFrom = item.reportFrom
                        obj.reportTypeName = item.reportTypeName
                        obj.reportLevel = item.reportLevel
                        obj.reportName = item.reportName
                        obj.reportStatus = item.reportStatus
                        obj.attackResult = item.attackResult
                        obj.isStart = item.isStart

                        this.alarmTableData.push(obj)
                    })
                }
            }).catch(err => {
                this.loading_alarm = false
                console.log(err, 'err')
            })
        },

        handleEdit(row) {
            console.log(row, 1111111111)
            this.recordId = row.desIp
            this.allTemplate = this.attackTemplate
            this.taskDialog = true
            this.orderType = 3
        },
        async handleEdit_alarm(row) {
            this.recordId = row.id
            await this.get_alarm_template(row)
            this.taskDialog = true
            this.orderType = 1
        },
        handleChangeStatus(row) {
            this.stateDialog = true
            this.statusId = row.id
        },
        indexMethod_alarm(index) {
            return (this.alarm_params.page - 1) * this.alarm_params.size + index + 1
        },
        handleSizeChange_alarm(val) {
            this.alarm_params.size = val
            this.getAlarmTableList()
        },
        handleCurrentChange_alarm(val) {
            this.alarm_params.page = val
            this.getAlarmTableList()
        }
    }
}
</script>

<style lang="scss" scoped>
.frame{
    ::v-deep .el-descriptions-item__label{
        width:100px;
    }
}
.search{
    ::v-deep input{
        height:30px !important;
        margin-top:2px;
    }
    ::v-deep .el-input__inner{
        margin-top:2px;
    }
}
.reset-btn{
    width: 80px;
    height: 30px;
    background-color: #041f38;
    box-shadow: inset 0px 0px 10px 0px
    rgba(0, 167, 245, 0.97);
    border: solid 1px #39caf3;
    font-size: 12px;
    line-height: 15px;
    letter-spacing: 1px;
    color: #a2ece8;
    border-radius: 5px;
    margin-right: 10px;
    cursor: pointer;
    box-sizing: border-box;
}
.isunfold{
    height:24px !important;
    border-radius: 2px;
    background-color: rgba(56, 125, 238,.1);
    margin-bottom:10px;
    line-height:24px;
    .unfold{
        letter-spacing: 1px;
        color: #0052d9;
        cursor: pointer;
        font-size:12px;
        i{
            font-size:14px;
        }
        .icon-select::before {
            display:inline-block;
            transform: rotate(-180deg);
            transition: .4s;
            transform-origin: center;
        }
        .icon-select1::before {
            display:inline-block;
            transition: .4s;
            transform-origin: center;
        }
    }
}
.chart-row {
    font-size: 0;
    .chart-left {
        width: 38%;
    }
    .chart-center {
        width: 38%;
    }
    .chart-right {
        width: 22%;
    }
}

.chart-box {
    position: relative;
    height: 280px;
    background-color: rgba(56, 125, 238, 0.05);
    border-radius: 6px;

    & > span {
        position: absolute;
        left: -1px;
        top: -1px;
        width: 10px;
        height: 10px;
        background: url('/static/img/icon-jiao.png') no-repeat;

        &.angle2 {
            left: auto;
            right: -1px;
            transform: rotate(90deg);
        }

        &.angle3 {
            left: auto;
            right: -1px;
            top: auto;
            bottom: -1px;
            transform: rotate(180deg);
        }

        &.angle4 {
            top: auto;
            bottom: -1px;
            transform: rotate(270deg);
        }
    }

    .chart-title {
        margin: 12px 0 10px 0px;
        height: 24px;
        line-height: 24px;
        font-size: 12px;
        padding-left: 10px;
        font-weight: 500;
        color: rgba(0,0,0,0.9);
        position: relative;
    }
}
.search-box {
    // margin: 30px 0 20px;
    margin:4px 0;
}
.event  ::v-deep  .el-range-input {
    background-color: rgba(0, 0, 0, 0);
    color: #fff;
}

.event  ::v-deep  .el-range-separator {
    color: #fff;
}
.chart-btn {
    min-width: 60px;
    height: 24px;
    line-height: 24px;
    font-size: 12px;
    margin: 12px 10px 10px 0;
    color: rgba(0,0,0,0.9);
    cursor: pointer;
    i {
        transform: rotate(90deg);
        color:#387dee;
    }
    p {
        font-size: 12px;
        margin-left: 10px;
    }
}
.chart-btn.select {
    i {
        transform: rotate(0deg);
    }
}
.bar-select .el-dropdown-menu__item {
    padding: 0 5px !important;
    line-height: 30px !important;
    font-size:12px;
}
.event ::v-deep .el-divider {
    background-color: #50b0ff;
    opacity: 0.5;
    margin-top: 0px;
}
</style>
