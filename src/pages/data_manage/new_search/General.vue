<template>
    <div class="event event-wrapper attendance-list expert general" style="overflow: hidden !important;">
        <div class="ub w100" style="box-sizing: border-box;padding-top: 20px;">
            <div class="w100">
                <div class="ub w100">
                    <div class="ub ub-ver ub-f1">
                        <div class="w100 search-box">
                            <div class="search-more ub ub-as">
                                <div class="search-more ub ub-f1">
                                    <div class="ub ub-ac">
                                        <Refresh @selectChange="selectChange" />
                                    </div>

                                    <div class="ub ub-ac">
                                        <el-form :model="get_params" label-position="right" label-width="20px">
                                            <!-- label="发生时间:" -->
                                            <el-form-item >
                                                <CustomDate :append-to-body="appendToBody" :chart-time-range="chartTimeRange" @getCustomTime="getCustomTime" @getDateData="getDateData" :inputWidth="292"  @useing="customDateUse" :current-type="2" :empty="false" ref="customDate" :xiangxi="xiangxi"></CustomDate>
                                            </el-form-item>
                                        </el-form>
                                    </div>
                                </div>
                                <div class="input-btn ub ub-ac ub-pe mt-1">
                                    <!-- <p @click="chartDialog = true">
                                        <i class="el-icon-brush"></i>
                                        <span>输出图表记录</span>
                                    </p> -->
                                    <p @click="taskDialog = true">
                                        <i class="iconfont icon-lixianrenwu"></i>
                                        <span>离线任务查询</span>
                                    </p>
                                    <p @click="recordDialog = true">
                                        <i class="iconfont icon-lishijilu"></i>
                                        <span>历史查询记录</span>
                                    </p>
                                    <!-- <p>
                                        <i class="iconfont icon-daochu"></i>
                                        <span>输出</span>
                                    </p> -->
                                </div>
                                <div style="width: 200px;"></div>
                                <!--<div class="search-text" v-show="isOpen && searchType==='normal'"  @click="isOpen=false">收 起</div>-->
                                <!--<div class="search-text" v-show="!isOpen && searchType==='normal'"  @click="isOpen=true">展 开</div>-->
                            </div>
                        </div>
                    </div>
                </div>
                <div class="sql-box ub ub-pj">
                    <CustomSearch ref="customSearch" :auto="true" class="ub-f1" @getData="getData" :type="2" @saveTask="saveTask" />
                    <div class="ub ub-pe" style="width: 200px;">
                        <Debounce :time='1500' :isDebounce="2">
                            <el-button style="min-width: 60px !important;" size="small"  @click.native="resetFun">重 置</el-button>
                        </Debounce>
                        <Debounce :time='1500' :isDebounce="2">
                            <el-button style="min-width: 60px !important;" :loading="loading" size="small" type="primary" @click.native="searchAssets">搜 索</el-button>
                        </Debounce>
                    </div>
                </div>
                <div style="position: relative;">
                    <FilterCondition :condition-data="conditionData" />
                    <div v-if="conditionShow" class="condition-area">
                        <ConditionRules
                            :select-data="listAll"
                            :treeData="treeData" />
                        <div class="split-line"></div>
                        <div class="ub ub-pe footer">
                            <el-button style="margin-right: 10px;" size="mini" @click="conditionShow = false">取消</el-button>
                            <Debounce :time='1500' :isDebounce="2">
                                <el-button @click.native="addFilterCondition" size="mini" type="primary">{{ conditionData.some(it => it.id === this.recordId) ? '编 辑' :'添 加' }}</el-button>
                            </Debounce>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div
            class="chart-wrapper log_num">
            <div class="progress-box">
                <ProgressBar ref="progressBar" :status="barStatus" />
                <div class="ub chart-title">
                    <!-- <div class="table-view ub ub-pc" @click="viewTab = 'tableView'" :class="{'active': viewTab === 'tableView'}">表格视图</div> -->
                    <!--<div class="chart-view ub ub-pc" @click="viewTab = 'chartView'" :class="{'active': viewTab === 'chartView'}">图表视图</div>-->
                    <div class="table-view ub ub-pc" @click="viewTab = 'tableView'" :class="{'active': viewTab === 'tableView'}">
                        <div style="padding-left: 0;">表格视图</div>
                        <div>
                            <!-- <i class="el-icon-caret-top" v-show="viewChartOpen"  @click="viewChartOpen=false"></i>
                            <i class="el-icon-caret-bottom" v-show="!viewChartOpen"  @click="viewChartOpen=true"></i> -->
                            <i :class="['iconfont', 'icon-a-yibiaopan-xiala1',viewChartOpen?'icon-select1':'icon-select' ]" @click="viewChartOpen=!viewChartOpen" style="font-size: 12px;"></i>
                        </div>
                    </div>
                    <div class="chart-view ub ub-pc" @click="viewTab = 'chartView'" :class="{'active': viewTab === 'chartView'}">图表视图</div>
                </div>
            </div>
            <!-- <div class="ub ub-pe fold-box" style="color: #0052D9;">
                <div v-show="viewChartOpen"  @click="viewChartOpen=false">收 起<i style="margin-left: 3px;" class="el-icon-arrow-up"></i></div>
                <div v-show="!viewChartOpen"  @click="viewChartOpen=true">展 开<i style="margin-left: 3px;" class="el-icon-arrow-down"></i></div>
            </div> -->
            <div
                style="background: #f2f6fd;"
                class="ub w100"
                v-show="viewChartOpen "
                v-loading.lock="log_loading"
                element-loading-background="rgba(0, 0, 0, 0.05)"
                element-loading-text="拼命加载中......">
                <div class="chart-num-box" style="margin-top: 15px;width: 200px;">
                    <div class="ub ub-ac mb-3">
                        <p style="font-size: 14px;">结果总量</p>
                        <el-tooltip v-if="resetShow" class="item" effect="dark" content="还原" placement="top-start">
                            <i style="margin-left: 10px; font-size: 12px;color: #387dee;cursor: pointer;" @click="handleChartRefresh" class="iconfont icon-shuaxin"></i>
                        </el-tooltip>
                    </div>
                    <div class="mb-2" style="font-size: 24px;color: #0052d9;">{{parseInt(logs_total)}}</div>
                    <div class="chart-bg"></div>
                </div>
                <div class="ub ub-f1" style="height: 140px;">
                    <div style="position: relative;padding: 2px;width: 100%;height: 100%;cursor: pointer;box-sizing: border-box;">
                        <div v-if="log_no_data" class="ub ub-f1 ub-ac ub-pc" style="height: 100%;font-size: 16px;color: #e7e7e7; cursor: pointer;">
                            暂无数据
                        </div>
                        <TableChart :chart-data="chartData" />
                        <div class="chart-bg-two"></div>
                        <div class="chart-bg-three"></div>
                    </div>
                </div>
            </div>
        </div>
        <TableContent
            :type="2"
            :viewChartOpen="viewChartOpen"
            v-loading.lock="loading"
            element-loading-background="rgba(0, 0, 0, 0.05)"
            element-loading-text="拼命加载中......"
            ref="tableContent"
            :list-all="listAll"
            :list="list"
            :table-data="tableData"
            :list-can-select="listCanSelect"
            :keywords="highlightKeywords"
            :rank-data="rankData"
            :top-loading="topLoading"
            @saveLogIdSuccess="saveLogIdSuccess"
            @createTaskSucess="createTaskSucess"
            @handleDownload="handleDownload"
            v-show="viewTab === 'tableView'">
        </TableContent>
        <ChartContent
            :type="3"
            :tab="'general'"
            v-loading.lock="loading"
            element-loading-background="rgba(0, 0, 0, 0.05)"
            element-loading-text="拼命加载中......"
            ref="chartContent"
            :sortFieldObj="sortFieldObj"
            v-show="viewTab === 'chartView'">
        </ChartContent>
        <Alarm :alarm-dialog="alarmDialog" :select-mode='selectMode' @addAlarmSucess="addAlarmSucess" ref="drawerRef"></Alarm>
        <SaveList :type="2" :save-list-dialog="saveListDialog"></SaveList>
        <OffLineTask :task-dialog="taskDialog" @handleSee="seeTask" ref="offLineTask"></OffLineTask>
        <HistoryRecord :record-dialog='recordDialog' @query="historyQuery" ref="historyRecordRef"></HistoryRecord>
        <el-dialog title="配置高亮词" width="700px" :visible.sync="highlightDialog" custom-class="common-dialog">
            <el-form :model="highlightForm" ref="highlightForm" :rules="rules" label-position="top">
                <el-form-item prop="keywords" label-width="90px">
                    <span slot="label">
                        <span>高亮词名称：</span>
                    </span>
                    <el-input size="mini" style="width: 98%;" placeholder="请输入高亮词，多个以英文逗号隔开" v-model.trim="highlightForm.keywords"></el-input>
                    <el-tooltip class="item" effect="dark" content="为优化页面性能，请将高亮词填写详细，修改成功后，需重新搜索" placement="top-start">
                        <i style="position: absolute; margin-left: 4px;font-size: 12px;color: #0052d9;" class="iconfont icon-qiangtishi"></i>
                    </el-tooltip>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="closeHighLight">取 消</el-button>
                <el-button size="small" type="primary" @click="sendHighlight">确 认</el-button>
            </div>
        </el-dialog>
        <el-dialog title="保存查询记录" width="700px" :visible.sync="saveRecordDialog" custom-class="attendance-dialog">
            <el-form :model="saveRecordForm" ref="saveRecordForm" :rules="saveRecordRules" label-position="top">
                <el-form-item label="条件名称：" prop="name" label-width="80px" style="margin-bottom: 20px;">
                    <el-input size="small" placeholder="请输入" v-model.trim="saveRecordForm.name"></el-input>
                </el-form-item>
                <el-form-item label="所属分组：" prop="typeId" label-width="80px">
                    <treeselect
                        class="treeselect"
                        style="margin-top: 3px;width: 660px;"
                        :options="dataTree"
                        :normalizer="normalizer"
                        noChildrenText="当前分支无子节点"
                        noOptionsText="无可用选项"
                        placeholder="请选择资产类型"
                        v-model="saveRecordForm.typeId"
                        loadingText="下拉框无匹配项"
                        noResultsText="无可用选项"
                        :clearable="false"
                    />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" @click="handleSaveRecord('saveRecordForm')">确 认</el-button>
                <el-button size="small" @click="saveRecordDialog=false">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog title="保存至离线任务" width="700px" :visible.sync="saveTaskDialog" custom-class="attendance-dialog">
            <el-form :model="saveTaskForm" ref="saveTaskForm" :rules="saveTaskRules" label-position="top">
                <el-form-item label="任务名称：" prop="name" label-width="80px">
                    <el-input size="mini" placeholder="请输入" v-model="saveTaskForm.name"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" @click="handleSaveTask('saveTaskForm')">确 认</el-button>
                <el-button size="small" @click="saveTaskDialog=false">取消</el-button>
            </div>
        </el-dialog>
        <el-dialog title="保存至输出图表" width="700px" :visible.sync="chartTaskDialog" custom-class="common-dialog">
            <el-form :model="chartTaskForm" ref="chartTaskForm" :rules="saveTaskRules" label-position="top">
                <el-form-item label="名称：" prop="name" label-width="86px" style="margin-bottom: 20px;">
                    <el-input size="mini" placeholder="请输入" v-model="chartTaskForm.name" style="margin-top: 3px;width: 652px;"></el-input>
                </el-form-item>
                <el-form-item label="所属分组：" prop="typeId" label-width="86px" style="margin-bottom: 20px;">
                    <treeselect
                        class="treeselect"
                        style="margin-top: 3px;width: 652px;"
                        :options="dataTree1"
                        :normalizer="normalizer"
                        noChildrenText="当前分支无子节点"
                        noOptionsText="无可用选项"
                        placeholder="请选择资产类型"
                        v-model="chartTaskForm.typeId"
                        loadingText="下拉框无匹配项"
                        noResultsText="无可用选项"
                        :clearable="false"
                    />
                </el-form-item>
                <el-form :model="get_params" label-width="86px" label-position="top">
                    <el-form-item label="发生时间:" v-if="chartTaskDialog">
                        <CustomDate1
                            :append-to-body="appendToBody"
                            :chart-time-range="chartTimeRange1"
                            @getCustomTime="getCustomTime1"
                            @getDateData="getDateData1"
                            :inputWidth="652"
                            @useing="customDateUse"
                            :current-type="2"
                            :empty="false"
                            ref="customDate1"
                            :xiangxi="dateData1"></CustomDate1>
                    </el-form-item>
                </el-form>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="handlechartTaskClose()">取消</el-button>
                <el-button size="small" type="primary" @click="handleChartTask('chartTaskForm')">确认</el-button>
            </div>
        </el-dialog>
        <ChartRecord :chart-dialog='chartDialog' @query="historyChart" ref="chartRecordRef"></ChartRecord>
    </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import HistoryRecord from './components/history_record/index.vue'
import OffLineTask from './components/off_line_task/index.vue'
import SaveList from './components/save_list/index.vue'
import CustomDate from './components/custom_date/index.vue'
import ChartContent from '@/pages/data_manage/chart_option/components/ChartContent'
import {
    saveHighlight,
    getHighlight,
    getDataTree,
    getFieldByAll,
    getUserField,
    saveUserField,
    getFilterSql,
    getList,
    getTopField,
    download,
    getTableChart,
    saveSearchTask,
    saveSearchHistory,
    findSearchType,
    searchFieldVal,
    getSortField
} from '@/server/data_manage/new_search.js'
import draggable from 'vuedraggable'
import Prcess from '@/components/prcess.vue'
import condition from '@/components/condition.vue'
import ueditorConfig from '@/mixins/ueditorConfig'
import ProgressBar from '@/pages/data_manage/new_search/components/chart/ProgressBar'
// import the component
import TableContent from '@/pages/data_manage/new_search/components/content/TableContent'
import Alarm from '@/pages/data_manage/new_search/components/alarm/index.vue'
import FilterCondition from '@/pages/data_manage/new_search/components/FilterCondition'
import CustomSearch from '@/pages/data_manage/new_search/components/custom_search/index'
import ConditionRules from '@/pages/data_manage/new_search/components/ConditionRules'
import TableChart from '@/pages/data_manage/new_search/components/chart/TableChart'
import EventBus from '@/assets/js/bus'
import Refresh from './components/refresh/index.vue'
import { addDashboardChart, findSearchTypeChart } from '@/server/alarm_log/chart_record.js'
import CustomDate1 from '@/pages/alarm_log/new_search/components/chart_record/custom_date.vue'
import ChartRecord from './components/chart_record/index.vue'
export default {
    name: 'General',
    components: {
        // Bar,
        // draggable,
        ProgressBar,
        TableContent,
        CustomSearch,
        Alarm,
        FilterCondition,
        ConditionRules,
        TableChart,
        CustomDate,
        SaveList,
        Refresh,
        OffLineTask,
        HistoryRecord,
        ChartContent,
        Treeselect,
        CustomDate1,
        ChartRecord
    },
    mixins: [ueditorConfig],
    data() {
        var checkcallFailedFlowId = (rule, value, callback) => {
            if (value && !Number.isInteger(value)) {
                callback(new Error('请输入数字值'))
            } else {
                callback()
            }
        }
        var validateDesIp = (rule, value, callback) => {
            if (!(/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(value))) {
                callback(new Error('请输入正确的ip'))
            } else {
                callback()
            }
        }
        var validateKeywords = (rule, value, callback) => {
            if (value.trim().split(',').length > 10) {
                callback(new Error('输入高亮词过多，请控制在10个以内'))
            } else {
                callback()
            }
        }
        return {
            chartDialog: false,
            dataTree1: [],
            chartTaskForm: {
                name: '',
                chartTaskForm: '',
                startTime: '',
                endTime: '',
                typeId: null
            },
            chartTaskDialog: false,
            requestFlag: true,
            searchLoading: false,
            resetShow: false,
            taskId: '',
            appendToBody: false,
            saveRecordDialog: false,
            saveRecordForm: {
                name: '',
                saveRecordForm: '',
                typeId: ''
            },
            saveTaskDialog: false,
            saveTaskForm: {
                name: ''
            },
            refreshVal: '',
            recordDialog: false,
            taskDialog: false,
            selectMode: 0,
            sqlTermData: '',
            customTime: [],
            isOpen: false,
            viewTab: 'tableView', // 'tableView', 'chartView'
            viewChartOpen: false,
            searchType: 'normal', // 'normal', 'sql'
            labelWidth: '80px',
            alarmDialog: false,
            conditionData: [],
            treeData: [
                {
                    connect: 'and',
                    children: [
                        {
                            field: '',
                            operator: '',
                            value: '',
                            dataType: 1, // 1.常量 2.变量
                            attrType: 1
                        }
                    ]
                }
            ],
            eventType: 'AlarmEvent',
            highlightDialog: false,
            highlightForm: {
                keywords: ''
            },
            highlightKeywords: '',
            barStatus: 1, // 0 未开始，1 完成， 2暂停
            cancelObj: {
                cancel: null
            },
            dataTree: [],
            rankData: [],
            rankMarkField: '',
            topLoading: false,
            chartData: [],
            chartTimeRange: [],
            safeLogForm: {
                type: ''
            },
            hostLogForm: {
                type: ''
            },
            flowLogForm: {
                type: ''
            },
            applicationLogForm: {
                type: ''
            },

            isCanOption: true,
            treeselectWidth: window.screen.width >= 1600 ? 500 : 240,
            tabsValue: '',
            createTaskDialog: false,
            createAllTaskDialog: false,
            createTaskId: '',
            stopIndex: '',
            pacpData: [],
            pcacDialog: false,
            stopId: '',
            stopDialog: false,
            seeSaveDilog: false,
            momentList: [],
            valueConsistsOf: 'LEAF_PRIORITY',
            normalizer(node) {
                if (node.sub && !node.sub.length) {
                    delete node.sub
                }
                return {
                    id: node.id,
                    label: node.name,
                    children: node.child
                }
            },
            limitText(count) {
                return `+${count}`
            },
            isLoadDliog: false,
            loadId: '',
            timestrId: '',
            timestrIdData: '',
            timer: null,
            formLabelWidth: '100px',
            typeList: [],
            addForm: {
                reportDesc: '',
                reportName: '',
                reportType: '',
                reportLevel: '',
                reportStatus: '0',
                asset: '',
                srcIp: '',
                srcPort: '',
                desIp: '',
                desPort: '',
                dt: '',
                attackResult: ''
            },
            rules: {
                reportName: [{
                    required: true,
                    message: '请输入名称',
                    trigger: 'blur'
                }],
                keywords: [{
                    validator: validateKeywords,
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
                    validator: validateDesIp,
                    trigger: 'blur'
                }],
                srcIp: [{
                    required: false,
                    message: '请输入正确的ip',
                    trigger: 'blur'
                }],
                srcPort: [
                    { validator: checkcallFailedFlowId, trigger: 'blur' }
                ],
                desPort: [
                    { validator: checkcallFailedFlowId, trigger: 'blur' }
                ],
                reportLevel: [{
                    required: true,
                    message: '请选择事件等级',
                    trigger: 'change'
                }],
                name: [{
                    required: true,
                    message: '请输入条件名称',
                    trigger: 'blur'
                }]
            },
            saveTaskRules: {
                name: [{
                    required: true,
                    message: '请输入名称',
                    trigger: 'blur'
                }]
            },
            saveRecordRules: {
                name: [{
                    required: true,
                    message: '请输入名称',
                    trigger: 'blur'
                }]
            },
            searchId: '',
            timeStr: '',
            deleteId: '',
            delDialog: false,
            saveListDialog: false,
            saveForm: {
                name: ''
            },
            saveDialog: false,
            conditionShow: false,
            recordId: '',
            listAll: [],
            listCanSelect: [],
            list: [],
            editable: true,
            isDragging: false,
            delayedDragging: false,
            log_loading: false,
            log_no_data: false,
            logs_total: 0,
            logData: [],
            timeSelectTitle: '年',
            timeSelectId: 2,
            timeType: [{
                label: '年',
                value: 2,
                isActive: true
            }, {
                label: '月',
                value: 1,
                isActive: false
            }, {
                label: '日',
                value: 0,
                isActive: false
            }],
            optionsCanSelect: [],
            options: [],
            fieldsShow: false,
            fields: [{
                label: '事件名称',
                value: 'alarmName'
            }, {
                label: '事件等级',
                value: 'alarmLevel'
            }, {
                label: '事件类型',
                value: 'type'
            }],
            loading: false,
            total_num: 0,
            total__count: 0,
            tableData: [],
            multipleSelection: [],
            sayTimes: null,
            get_params: {
                page: 1,
                size: 50,
                dataType: null,
                topId: '',
                startTime: '',
                endTime: ''
            },
            loadingSave: false,
            total_numSave: 0,
            tableDataSave: [],
            get_paramsSave: {
                page: 1,
                size: 10,
                name: ''

            },
            loadingHistory: false,
            total_numHistory: 0,
            tableDataHistory: [],
            get_paramsHistory: {
                page: 1,
                size: 10

            },
            historySave: false,
            saveData: null,
            rule_url: '',
            logIds: [],
            dateData: '',
            dateMode: '',
            useDate: {},
            useIndex: '',
            sortFieldObj: null,
            xiangxi: '',
            dateData1: '',
            dateMode1: '',
            useDate1: {},
            useIndex1: ''
        }
    },
    computed: {
        tableList() {
            console.log('this.list', this.list)
            return this.list.length > 0 ? this.list : this.listAll
        },
        exportUrl() {
            let startTime = this.sayTimes === null ? '' : this.sayTimes[0]
            let endTime = this.sayTimes === null ? '' : this.sayTimes[1]
            return 'data_center/manage/syslog/export?type=0&dtArr=' + this.get_params.dt + '&content=' + this.get_params.content +
                '&startTime=' + startTime + '&endTime=' + endTime
        },
        exportUrl1() {
            let startTime = this.sayTimes === null ? '' : this.sayTimes[0]
            let endTime = this.sayTimes === null ? '' : this.sayTimes[1]
            return 'data_center/manage/syslog/export?type=1&dtArr=' + this.get_params.dt + '&content=' + this.get_params.content +
                '&startTime=' + startTime + '&endTime=' + endTime
        },
        dragOptions() {
            return {
                animation: 100
                // group: "description",
                // disabled: !this.editable,
                // ghostClass: "ghost"
            }
        },

        listString() {
            return JSON.stringify(this.list, null, 2)
        }
    },
    watch: {
        // chartTimeRange(newVal, oldVal) {
        //     if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
        //         this.customTime[0] = newVal[0]
        //         this.customTime[1] = newVal[1]
        //         this.get_data()
        //         this.get_chart_data()
        //     }
        // },
        alarmDialog(newVal) {
            if (!newVal) {
                this.$refs.tableContent.$refs.multipleTable.clearSelection()
            }
        },
        conditionShow(newVal) {
            if (!newVal) {
                this.treeData = [
                    {
                        connect: 'and',
                        children: [
                            {
                                field: '',
                                operator: '',
                                value: '',
                                dataType: 1, // 1.常量 2.变量
                                attrType: 1
                            }
                        ]
                    }
                ]
            }
        },
        pcacDialog(newVal, oldVal) {
            if (!newVal) {
                this.tabsValue = ''
                this.pacpData = []
            }
        },
        list: {
            handler(newVal, oldVal) {
                let arr = []
                this.listAll.map(item => {
                    if (!newVal.some(_item => item.fieldName === _item.fieldName)) {
                        arr.push(item)
                    }
                })
                this.listCanSelect = this.$deepCopy(arr)
            },
            // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
            immediate: true
        },
        saveDialog(newValue) {
            if (!newValue) {
                this.saveForm.name = ''
                this.historySave = false
            }
        },
        isDragging(newValue) {
            if (newValue) {
                this.delayedDragging = true
                return
            }
            this.$nextTick(() => {
                this.delayedDragging = false
            })
        },
        viewChartOpen(val) {
            if (val) {
                this.setDate()
                this.get_chart_data()
            }
        }
    },
    created() {
        let momentList = this.$getsessionStorage('momentList')
        if (momentList) {
            this.momentList = momentList
        }
        EventBus.$on('addEqualCondition', this.addEqualCondition)
        EventBus.$on('addUnequalCondition', this.addUnequalCondition)
        EventBus.$on('getTopFieldTwo', this.getTopFieldFun)
    },
    beforeDestroy() {
        EventBus.$off('getTopFieldTwo')
        this.$removesessionStorage('saveDate')
        this.$removesessionStorage('temporaryOld')
    },
    mounted() {
        this.getMinute()
        // if (this.$route.params.markId && this.$route.params.markId.length) {
        //     this.markId = this.$route.params.markId
        // }
        this.initCanSelectedFileds()
        this.initSelectedFileds1()
        this.getSortFieldFn()
        this.isShow = true
        this.$nextTick(() => {
            this.getHighlight()
        })
    },
    methods: {
        getSortFieldFn() {
            getSortField({ queryData: {}, paramsData: {}}).then(res => {
                console.log(res)
                this.sortFieldObj = res
            })
        },
        handlechartTaskClose() {
            this.chartTaskForm = {
                name: '',
                typeId: null
            }
            this.saveTaskForm = {
                name: ''
            }
            this.saveRecordForm = {
                name: '',
                typeId: ''
            }
            this.chartTimeRange1 = this.customTime
            this.saveRecordDialog = false
            this.saveTaskDialog = false
            this.chartTaskDialog = false
        },
        customDateUse() {
            this.searchLoading = true
            this.get_params.page = 1
            this.initCanSelectedFileds()
        },
        getDateData(date, mode, useDate, useIndex) {
            this.dateData = date
            this.dateMode = mode
            this.useDate = useDate
            this.useIndex = useIndex
        },
        getDateData1(date, mode, useDate, useIndex) {
            this.dateData1 = date
            this.dateMode1 = mode
            this.useDate1 = useDate
            this.useIndex1 = useIndex
        },
        seeTask(val) {
            console.log('queryMap', JSON.parse(val.queryMap))
            let queryObj = JSON.parse(val.queryMap)
            let startTimeData = JSON.parse(val.queryMap).inputTerm[0].value
            // let endTimeData = this.$moment().format('YYYY-MM-DD HH:mm:ss')
            let endTimeData = JSON.parse(val.queryMap).inputTerm[1].value
            this.customTime = [startTimeData, endTimeData]
            this.chartTimeRange = [startTimeData, endTimeData]
            this.taskId = val.id
            this.sqlTermData = queryObj.sqlTerm
            this.$refs.customSearch.inputData = queryObj.sqlTerm ?? ''
            this.conditionData = queryObj.conditionData ?? []
            this.get_data()
            this.get_chart_data()
        },
        getFindSearchType() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            findSearchType(data).then(res => {
                this.dataTree = res
            }).catch(error => {
                console.log('error', error)
            })
        },
        saveTask(val) {
            if (val === 1) {
                this.getFindSearchType()
                this.saveRecordDialog = true
            } else if (val === 2) {
                this.saveTaskDialog = true
            } else if (val === 3) {
                this.getFindSearchType1()
                this.chartTimeRange1 = this.customTime
                this.chartTaskDialog = true
                this.dateData1 = this.$getsessionStorage('saveDate').title ? this.$getsessionStorage('saveDate').title : this.$getsessionStorage('saveDate').value.join(',')
            }
        },
        getFindSearchType1() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            findSearchTypeChart(data).then(res => {
                this.dataTree1 = res
            }).catch(error => {
                console.log('error', error)
            })
        },
        handleSaveTask(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = {
                        queryData: {},
                        paramsData: {
                            name: this.saveTaskForm.name,
                            param: {
                                inputTerm: [{ field: 'startTime', value: this.customTime[0] }, { field: 'endTime', value: this.customTime[1] }],
                                sqlTerm: this.sqlTermData,
                                filterTerm: this.conditionData.length > 0 ? this.conditionData.map(it => it.origin[0]) : [],
                                conditionData: this.conditionData
                            }
                        }
                    }
                    saveSearchTask(data).then(res => {
                        this.$message({
                            message: '保存成功！',
                            type: 'success'
                        })
                        this.saveTaskDialog = false
                    }).catch(error => {
                        console.log('error', error)
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        handleChartTask(formName) {
            console.log(this.chartTaskForm, '输出图表')
            console.log('111', this.dateData, this.dateData1)
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = {
                        queryData: {},
                        paramsData: {
                            name: this.chartTaskForm.name,
                            param: {
                                inputTerm: [{ field: 'startTime', value: this.customTime[0] }, { field: 'endTime', value: this.customTime[1] }],
                                sqlTerm: this.sqlTermData,
                                filterTerm: this.conditionData.length > 0 ? this.conditionData.map(it => it.origin[0]) : [],
                                conditionData: this.conditionData,
                                time: this.$getsessionStorage('temporary').actualTime ? this.$getsessionStorage('temporary').actualTime : this.dateData1,
                                timeStatus: this.$getsessionStorage('temporary').timeUnit ? this.$getsessionStorage('temporary').timeUnit : ''
                            },
                            groupId: this.chartTaskForm.typeId || '',
                            originHeader: this.list,
                            indexType: 7,
                            originType: 1
                        }
                    }
                    console.log(data)
                    addDashboardChart(data).then(res => {
                        this.$message({
                            message: '保存成功！',
                            type: 'success'
                        })
                        this.chartTaskDialog = false
                        this.chartTaskForm = {
                            name: '',
                            typeId: null
                        }
                    }).catch(error => {
                        console.log('error', error)
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        handleSaveRecord(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = {
                        queryData: {},
                        paramsData: {
                            name: this.saveRecordForm.name,
                            param: {
                                inputTerm: [{ field: 'startTime', value: this.customTime[0] }, { field: 'endTime', value: this.customTime[1] }],
                                sqlTerm: this.sqlTermData,
                                filterTerm: this.conditionData.length > 0 ? this.conditionData.map(it => it.origin[0]) : [],
                                conditionData: this.conditionData,
                                time: this.$getsessionStorage('temporaryOld').actualTime ? this.$getsessionStorage('temporaryOld').actualTime : this.dateData,
                                timeStatus: this.$getsessionStorage('temporaryOld').timeUnit ? this.$getsessionStorage('temporaryOld').timeUnit : ''
                            },
                            typeId: this.saveRecordForm.typeId
                        }
                    }
                    saveSearchHistory(data).then(res => {
                        this.$message({
                            message: '保存成功！',
                            type: 'success'
                        })
                        this.saveRecordDialog = false
                    }).catch(error => {
                        console.log('error', error)
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        historyQuery(val) {
            let queryMapData = JSON.parse(val.queryMap)
            console.log('历史查询任务', queryMapData)
            // this.customTime = this.formatDate(val.time, val.timeStatus, queryMapData.inputTerm[0].value, queryMapData.inputTerm[1].value)
            // this.chartTimeRange = this.formatDate(val.time, val.timeStatus, queryMapData.inputTerm[0].value, queryMapData.inputTerm[1].value)
            this.sqlTermData = queryMapData.sqlTerm ?? ''
            this.$refs.customSearch.inputData = queryMapData.sqlTerm ?? ''
            this.conditionData = queryMapData.conditionData ?? []
            this.formatDate(val.time, val.timeStatus, queryMapData.inputTerm[0].value, queryMapData.inputTerm[1].value)
            this.get_data()
            if (this.viewChartOpen) {
                this.get_chart_data()
            }
        },
        historyChart(val) {
            let queryMapData = JSON.parse(val.chartQueryCriteria)
            console.log('历史查询任务', queryMapData)
            this.sqlTermData = queryMapData.sqlTerm ?? ''
            this.$refs.customSearch.inputData = queryMapData.sqlTerm ?? ''
            this.conditionData = queryMapData.conditionData ?? []
            this.formatDate(val.time, val.timeStatus, queryMapData.inputTerm[0].value, queryMapData.inputTerm[1].value)
            this.get_data()
            if (this.viewChartOpen) {
                this.get_chart_data()
            }
        },
        formatDate(time, timeStatus, start, end) {
            if (timeStatus) {
                let unitText1 = this.getUnitText1(timeStatus)
                this.useDate = { id: '', name: '最近' + time + unitText1, time: time, timeUnit: timeStatus - 1 }
                this.$refs.customDate.handleOther(this.useDate, this.useIndex)
            } else {
                if (time === '最近10分钟') {
                    this.$refs.customDate.handleRecently({ value: 0, name: '最近10分钟' }, 0)
                } else if (time === '最近30分钟') {
                    this.$refs.customDate.handleRecently({ value: 1, name: '最近30分钟' }, 1)
                } else if (time === '最近1小时') {
                    this.$refs.customDate.handleRecently({ value: 2, name: '最近1小时' }, 2)
                } else if (time === '最近1天') {
                    this.$refs.customDate.handleRecently({ value: 3, name: '最近1天' }, 3)
                } else if (time === '最近2天') {
                    this.$refs.customDate.handleRecently({ value: 4, name: '最近2天' }, 4)
                } else if (time === '最近7天') {
                    this.$refs.customDate.handleRecently({ value: 5, name: '最近7天' }, 5)
                } else if (time === '今天') {
                    this.$refs.customDate.handleRelative({ value: 0, name: '今天' }, 0)
                } else if (time === '昨天') {
                    this.$refs.customDate.handleRelative({ value: 1, name: '昨天' }, 1)
                } else if (time === '本周') {
                    this.$refs.customDate.handleRelative({ value: 2, name: '本周' }, 2)
                } else if (time === '上周') {
                    this.$refs.customDate.handleRelative({ value: 3, name: '上周' }, 3)
                } else if (time === '本月') {
                    this.$refs.customDate.handleRelative({ value: 4, name: '本月' }, 4)
                } else if (time === '上月') {
                    this.$refs.customDate.handleRelative({ value: 5, name: '上月' }, 5)
                } else {
                    this.customTime = [start, end]
                    this.chartTimeRange = [start, end]
                }
            }
        },
        getUnitText(val) {
            if (val == 1) {
                return 'second'
            } else if (val == 2) {
                return 'minute'
            } else if (val == 3) {
                return 'hour'
            } else if (val == 4) {
                return 'days'
            }
        },
        getUnitText1(val) {
            if (val == 1) {
                return '秒'
            } else if (val == 2) {
                return '分钟'
            } else if (val == 3) {
                return '小时'
            } else if (val == 4) {
                return '天'
            }
        },
        selectChange(val) {
            this.refreshVal = val
            if (this.refreshVal == 0) {
                clearInterval(this.timer)
                this.timer = null
            } else if (this.refreshVal == 1) {
                this.refreshData(60000)
            } else if (this.refreshVal == 2) {
                this.refreshData(5 * 60000)
            } else if (this.refreshVal == 3) {
                this.refreshData(15 * 60000)
            } else if (this.refreshVal == 4) {
                this.refreshData(30 * 60000)
            } else if (this.refreshVal == 5) {
                this.refreshData(60 * 60000)
            } else if (this.refreshVal == 6) {
                this.refreshData(2 * 60 * 60000)
            } else if (this.refreshVal == 7) {
                this.refreshData(12 * 60 * 60000)
            } else if (this.refreshVal == 8) {
                this.refreshData(24 * 60 * 60000)
            } else if (this.refreshVal == 9) {
                clearInterval(this.timer)
                this.timer = null
            } else if (this.refreshVal.length > 0) {
                let timeData = this.refreshVal[0].actualTime
                let unitData = this.getTimeUnit(this.refreshVal[0].timeUnit)
                this.refreshData(timeData * unitData)
            }
            console.log('刷新', val)
        },
        getTimeUnit(val) {
            console.log(val)
            if (val == 0) {
                return 1000
            } else if (val == 1) {
                return 60000
            } else if (val == 2) {
                return 60 * 60000
            } else if (val == 3) {
                return 24 * 60 * 60000
            }
        },
        refreshData(val) {
            clearInterval(this.timer)
            this.timer = null
            this.timer = setInterval(() => {
                this.get_params.page = 1
                this.setDate()
                this.get_data()
                this.get_chart_data()
            }, val)
        },
        handleChartRefresh() {
            // this.setDate()
            this.setRecordDate()
            setTimeout(() => {
                this.get_data()
                this.get_chart_data()
            }, 1000)
        },
        setRecordDate() {
            let recordDate = this.$getsessionStorage('saveDate')

            if (recordDate && recordDate.currentTab) {
                if (recordDate.type === 1) {
                    let time = recordDate.value
                    let interval = new Date(time[1]).getTime() - new Date(time[0]).getTime()
                    let end = Date.now()
                    let start = end - interval

                    let startFormat = this.$moment(start).format('YYYY-MM-DD HH:mm:ss')
                    let endFormat = this.$moment(end).format('YYYY-MM-DD HH:mm:ss')
                    console.log(startFormat)
                    this.chartTimeRange = [startFormat, endFormat, recordDate.title ? recordDate.title : undefined]

                    let saveDate = {
                        value: [startFormat, endFormat],
                        type: 1,
                        currentTab: 1,
                        title: recordDate.title ? recordDate.title : undefined
                    }
                    this.$setsessionStorage('saveDate', saveDate)
                } else {
                    this.chartTimeRange = recordDate.value
                    let saveDate = {
                        value: recordDate.value,
                        type: 2,
                        currentTab: 1
                    }
                    this.$setsessionStorage('saveDate', saveDate)
                }
            }
            setTimeout(() => {
                this.resetShow = false
            }, 1500)
        },
        setDate() {
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
        handleDownload(statusData, multipleSelection) {
            this.$refs.tableContent.downLoading = true
            let data = {
                queryData: {},
                paramsData: {
                    logIds: multipleSelection.length > 0 ? multipleSelection.map(item => item.id) : [],
                    searchType: 2,
                    fileType: statusData,
                    inputTerm: [{ field: 'startTime', value: this.customTime[0] }, { field: 'endTime', value: this.customTime[1] }],
                    sqlTerm: this.sqlTermData,
                    filterTerm: this.conditionData.map(it => it.origin[0]),
                    fields: this.list.map(it => it.fieldName),
                    taskId: this.taskId
                }
            }
            download(data).then(res => {
                this.$refs.tableContent.downLoading = false
                this.$message({
                    message: '下载成功',
                    type: 'success'
                })
            }).catch(error => {
                this.$refs.tableContent.downLoading = false
                this.$message({
                    message: error,
                    type: 'error'
                })
                console.log('error', error)
            })
        },
        createTaskSucess() {
            this.get_data()
        },
        saveLogIdSuccess() {
            this.get_data()
        },
        addAlarmSucess() {
            this.get_data()
        },
        addEqualCondition(data) {
            console.log(data, '新增相等条件')
            this.conditionData.push(data)
        },
        addUnequalCondition(data) {
            console.log(data, '新增不等条件')
            this.conditionData.push(data)
        },
        getData(val) {
            this.sqlTermData = val
            console.log('智能搜索框时间', val)
        },
        getCustomTime(val, isChartTime) {
            this.customTime = val
            this.chartTimeRange1 = val
            if (isChartTime) {
                this.resetShow = true
            } else {
                this.resetShow = false
            }
            if (this.$refs.tableContent.$refs.multipleTable) {
                console.log('时间变了，清空表格')
                this.$refs.tableContent.$refs.multipleTable.clearSelection()
            }
            console.log('时间', val)
        },
        getCustomTime1(val, isChartTime) {
            this.customTime1 = val
            this.saveTaskForm.startTime = val[0]
            this.saveTaskForm.endTime = val[1]
        },
        addFilterCondition() {
            let that = this
            console.log(this.treeData)
            let data = {
                queryData: {},
                paramsData: {
                    filterTerm: this.treeData
                }
            }
            getFilterSql(data).then(res => {
                console.log(res, '过滤条件转sql')
                let data = {
                    origin: this.treeData,
                    msg: res ?? '',
                    id: Date.now() + res
                }
                if (this.conditionData.some(it => it.id === this.recordId)) {
                    let index = this.conditionData.findIndex(it => it.id === that.recordId)
                    that.conditionData.splice(index, 1, that.$lodash.cloneDeep(data))
                } else {
                    that.conditionData.push(that.$lodash.cloneDeep(data))
                }
                that.conditionShow = false
                this.searchAssets()
            }).catch(err => {
                console.log(err)
            })
        },
        focus() {
            this.$nextTick(() => {
                document
                    .getElementsByClassName('el-picker-panel__link-btn')[0]
                    .setAttribute('style', 'display:none')
            })
        },
        getMinute() {
            const start = this.$moment().add(-15, 'minute').format('YYYY-MM-DD HH:mm:ss')
            const end = this.$moment().format('YYYY-MM-DD HH:mm:ss')
            this.sayTimes = [start, end]
        },
        checkSelectable(row, index) {
            let flag = false
            if (row.nftData === 0) {
                flag = true
            }
            return flag
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        createPackTask(row) {
            this.createTaskId = row.id
            this.createTaskDialog = true
        },
        createAllPackTask(row) {
            if (this.multipleSelection.length === 0) {
                this.$message({
                    message: '请先选择数据！',
                    type: 'warning'
                })
                return
            }
            this.createAllTaskDialog = true
        },
        async top5Show(element) {
            if (element.show) {
                element.show = false
                return
            }
            let top5Obj = await this.getTop5(element.fieldName)
            console.log('top5Obj', top5Obj)
            element.totalNum = top5Obj.totalNum
            element.top5 = top5Obj.top5.map(item => {
                item.percent = ((item.num * 100) / element.totalNum).toFixed(2)
                return item
            })
            element.show = true
        },
        downloadFun() {
            this.$router.push('/home/data_center_download')
        },

        seeSave() {
            this.seeSaveDilog = true
        },
        cancelStay(row) {
            let index = this.momentList.findIndex(item => JSON.stringify(item) === JSON.stringify(row))
            this.momentList.splice(index, 1)
            this.$setsessionStorage('momentList', this.momentList)
            this.$message({
                message: '删除成功',
                type: 'success'
            })
        },
        handleSeeSaveDel(row, index) {
            this.momentList.splice(index, 1)
            this.$setsessionStorage('momentList', this.momentList)
            this.$message({
                message: '删除成功',
                type: 'success'
            })
        },
        momentSave(row) {
            this.momentList.push(row)
            this.$setsessionStorage('momentList', this.momentList)
            this.$message({
                message: '暂存成功',
                type: 'success'
            })
        },
        selectTree(val) {
            if (val.length === 0) {
                this.get_params.dt = []
            }
            console.log('this.get_params.dt', this.get_params.dt)
        },
        createLoad(type) {
            this.loadId = type
            this.isLoadDliog = true
        },
        createRuleFun() {
            /* window.open(this.rule_url+'/#/home/cep_show?data_tule=1');*/
            this.$router.push('/home/rule_cep_show?data_tule=1')
        },
        get_dtId(data, obj) {
            if (data.length > 0) {
                data.forEach(item => {
                    if (item.sub && item.sub.length > 0) {
                        this.get_dtId(item.sub, obj)
                    } else {
                        obj.push(item.codeNum)
                    }
                })
            }
        },
        // 排序列改变返回当前需要排序的列
        changeTableSort(e) {
            console.log('e', e)
            // 获取当前列的字段
            const prop = e.prop
            // 如果按降序
            if (e.order === 'descending') {
                // 根据需要对字段进行写排序
                this.tableData = this.tableData.sort((a, b) => {
                    return parseFloat(a[prop]) - parseFloat(b[prop])
                })
            } else { // 发果是降序
                this.tableData = this.tableData.sort((a, b) => {
                    return parseFloat(b[prop]) - parseFloat(a[prop])
                })
            }
        },
        validForm(formName) {
            return new Promise((resolve, reject) => {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        resolve()
                    } else {
                        console.log('error submit!!')
                        reject(new Error('校验失败'))
                        return false
                    }
                })
            })
        },
        getHighlight() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            getHighlight(data).then(res => {
                console.log(res, '关键词！！！！！！！！！！！！！！！！！')
                this.highlightKeywords = res ?? ''
                this.highlightForm.keywords = res ?? ''
            })
                .catch(err => {
                    console.log(err)
                })
        },
        closeHighLight() {
            this.highlightForm.keywords = this.highlightKeywords
            this.highlightDialog = false
        },
        sendHighlight() {
            this.validForm('highlightForm').then(res => {
                console.log('校验成功')
                let data = {
                    queryData: {},
                    paramsData: {
                        highlight: this.highlightForm.keywords
                    }
                }
                saveHighlight(data).then(res => {
                    this.$message.success('操作成功！')
                    this.highlightDialog = false
                    this.getHighlight()
                    this.tableData = []
                    this.get_data()
                })
                    .catch(err => {
                        console.log(err)
                        this.highlightForm.keywords = this.highlightKeywords
                        this.highlightDialog = false
                    })
            }).catch(() => {})
        },
        saveShowFun() {
            this.saveDialog = true
        },
        resetFun() {
            this.taskId = ''
            this.conditionData = []
            this.sqlTermData = ''
            this.$refs.customSearch.inputData = ''
        },
        onEnd() {},
        delFileds(element) {
            var _index
            this.list.forEach((item, index) => {
                if (element.fieldName === item.fieldName) {
                    _index = index
                }
            })
            this.list.splice(_index, 1)
            let data = {
                queryData: {},
                paramsData: {
                    searchType: 2,
                    fieldIds: this.list.map(it => it.fieldId)
                }
            }

            saveUserField(data).then(res => {
                this.requestFlag = true
                this.$message.success('删除成功！')
            })
                .then(() => {

                })
                .catch(err => console.log(err))
        },
        changeFileds() {
            let data = {
                queryData: {},
                paramsData: {
                    searchType: 2,
                    fieldIds: this.list.map(it => it.fieldId)
                }
            }

            saveUserField(data).then(res => {
                this.requestFlag = true
                this.$message.success('操作成功！')
            })
                .then(() => {

                })
                .catch(err => console.log(err))
        },
        addFileds(element) {
            if (this.list.some(item => item.fieldName === element.fieldName)) {
                this.$message({
                    message: '该字段已经存在',
                    type: 'warning'
                })
                return
            }
            if (this.list.find(it => it.fieldName === 'alarmTime') && this.list.find(it => it.fieldName === 'message')) {
                this.list.splice(this.list.length - 1, 0, {
                    fieldName: element.fieldName,
                    name: element.name,
                    fieldId: element.fieldId,
                    show: false
                })
            } else if (element.fieldName === 'alarmTime') {
                this.list.unshift({
                    fieldName: element.fieldName,
                    name: element.name,
                    fieldId: element.fieldId,
                    show: false
                })
            } else if (element.fieldName === 'message') {
                this.list.push({
                    fieldName: element.fieldName,
                    name: element.name,
                    fieldId: element.fieldId,
                    show: false
                })
            } else {
                this.list.push({
                    fieldName: element.fieldName,
                    name: element.name,
                    fieldId: element.fieldId,
                    show: false
                })
            }

            let data = {
                queryData: {},
                paramsData: {
                    searchType: 2,
                    fieldIds: this.list.map(it => it.fieldId)
                }
            }
            saveUserField(data).then(res => {
                this.requestFlag = true
                this.$message.success('操作成功！')
            }).then(() => {

            }).catch(err => console.log(err))
            let ids = []
            let copyList = this.tableData
            copyList.map(item => {
                ids.push({ id: item.id, alarmTime: item.alarmTime })
            })
            let fieldVal = {
                queryData: {},
                paramsData: {
                    logType: '',
                    data: ids,
                    field: element.fieldName
                }
            }
            searchFieldVal(fieldVal).then(res => {
                let list = res
                copyList.map(item => {
                    list.map(items => {
                        if (item.id == items.id) {
                            item[element.fieldName] = items[element.fieldName]
                        }
                    })
                })
                this.tableData = this.$lodash.cloneDeep(copyList)
                console.log(this.tableData)
            }).catch(err => console.log(err))
            // this.get_data()
        },
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        indexMethodSave(index) {
            return (this.get_paramsSave.page - 1) * this.get_paramsSave.size + index + 1
        },
        indexMethodHistory(index) {
            return (this.get_paramsHistory.page - 1) * this.get_paramsHistory.size + index + 1
        },
        timeDiffer() {
            if (this.sayTimes.length > 0) {
                let t1 = this.$moment(this.sayTimes[0])
                let t2 = this.$moment(this.sayTimes[1])
                let timeDifferData = t2.diff(t1, 'hour')
                return timeDifferData
            }
        },
        searchAssets() {
            this.searchLoading = true
            this.get_params.page = 1
            this.setDate()
            if (this.requestFlag) {
                // this.initCanSelectedFileds()
                // this.initSelectedFileds()
                this.get_data()
                if (this.viewChartOpen) {
                    this.get_chart_data()
                }
            } else {
                this.get_data()
                if (this.viewChartOpen) {
                    this.get_chart_data()
                }
            }
        },
        initSelectedFileds() {
            let data = {
                queryData: {},
                paramsData: {
                    searchType: 2
                }
            }
            getUserField(data).then(res => {
                this.list = []
                return res
            }).then(res => {
                console.log('用户已选字段', res)
                this.searchLoading = false
                if (res.length > 0) {
                    res.forEach((item, index) => {
                        let obj = {}
                        obj.show = false
                        // obj.fixed = false
                        // obj.top5 = []
                        obj.name = item.name
                        obj.fieldId = item.fieldId
                        obj.fieldName = item.field
                        obj.type = item.type

                        this.list.push(obj)
                        // 事件事件放前面，原始信息放最后
                        // if (this.list.find(it => it.fieldName === 'alarmTime') && obj.fieldName !== 'message') {
                        //     this.list.splice(1, 0, obj)
                        // } else if (obj.fieldName === 'message') {
                        //     this.list.push(obj)
                        // } else {
                        //     this.list.splice(this.list.length - 1, 0, obj)
                        // }
                    })
                }
            }).then(() => {
                // this.get_data()
                // this.get_chart_data()
            }).catch(error => {
                console.log('error' + error)
            })
        },
        initSelectedFileds1() {
            let data = {
                queryData: {},
                paramsData: {
                    searchType: 2
                }
            }
            getUserField(data).then(res => {
                this.list = []
                return res
            }).then(res => {
                console.log('用户已选字段', res)
                this.searchLoading = false
                if (res.length > 0) {
                    res.forEach((item, index) => {
                        let obj = {}
                        obj.show = false
                        // obj.fixed = false
                        // obj.top5 = []
                        obj.name = item.name
                        obj.fieldId = item.fieldId
                        obj.fieldName = item.field
                        obj.type = item.type

                        this.list.push(obj)
                    })
                }
            }).then(() => {
                this.get_data()
                // this.get_chart_data()
            }).catch(error => {
                console.log('error' + error)
            })
        },
        initCanSelectedFileds() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            /* 先获取已选的字段，在获取所有字段，避免左侧抖动*/
            // this.initSelectedFileds()
            getFieldByAll(data).then(res => {
                this.listAll = []
                return res
            }).then(res => {
                console.log('所有综合可选字段', res)
                if (res.length > 0) {
                    res.forEach(item => {
                        let obj = {}
                        obj.fieldId = item.fieldId
                        obj.show = false
                        // obj.fixed = false
                        // obj.top5 = []
                        obj.name = item.name
                        obj.fieldName = item.field
                        obj.type = item.type
                        if (item.enums) {
                            obj.enums = item.enums
                        }
                        this.listAll.push(obj)
                    })
                }
            }).then(() => {
                this.list = this.$lodash.cloneDeep(this.list)
            }).catch(error => {
                console.log('error' + error)
            })
        },
        get_chart_data() {
            this.log_loading = true
            let data = {
                queryData: {},
                paramsData: {
                    inputTerm: this.customTime.length > 0 ? [{ field: 'startTime', value: this.customTime[0] }, { field: 'endTime', value: this.customTime[1] }] : [],
                    sqlTerm: this.sqlTermData,
                    filterTerm: this.conditionData.map(it => it.origin[0]),
                    fields: this.list.map(it => it.fieldName),
                    taskId: this.taskId
                }
            }
            getTableChart(data).then(res => {
                this.logs_total = res.total ?? 0
                this.chartData = res.detail ?? []
                console.log('图表', res)
                this.log_loading = false
            }).catch(error => {
                this.log_loading = false
                console.log('error' + error)
            })
        },
        getSearchParams() {
            let data = {
                queryData: {
                },
                paramsData: {
                    inputTerm: this.customTime.length > 0 ? [{ field: 'startTime', value: this.customTime[0] }, { field: 'endTime', value: this.customTime[1] }] : [],
                    sqlTerm: this.sqlTermData,
                    filterTerm: this.conditionData.map(it => it.origin[0]),
                    fields: this.list.map(it => it.fieldName),
                    taskId: this.taskId,
                    time: this.$getsessionStorage('temporaryOld').actualTime ? this.$getsessionStorage('temporaryOld').actualTime : this.dateData,
                    timeStatus: this.$getsessionStorage('temporaryOld').timeUnit ? this.$getsessionStorage('temporaryOld').timeUnit : ''
                }
            }
            return data
        },
        get_data() {
            this.loading = true

            if (this.barStatus === 1) {
                this.barStatus = 0
                this.$refs.progressBar.restart()
            } else {
                this.barStatus = 0
                this.$refs.progressBar.start()
            }

            let data = {
                queryData: {
                    page: this.get_params.page,
                    pageSize: this.get_params.size
                },
                paramsData: {
                    inputTerm: this.customTime.length > 0 ? [{ field: 'startTime', value: this.customTime[0] }, { field: 'endTime', value: this.customTime[1] }] : [],
                    sqlTerm: this.sqlTermData,
                    filterTerm: this.conditionData.map(it => it.origin[0]),
                    fields: this.list.map(it => it.fieldName),
                    taskId: this.taskId
                }
            }
            getList(data, this.cancelObj).then(res => {
                this.requestFlag = false
                this.tableData = []
                return res
            }).then(res => {
                console.log('数据查询列表', res)
                this.total_num = res.total
                this.loading = false
                this.barStatus = 1
                let arr = res.records
                if (arr.length > 0) {
                    this.tableData = this.$lodash.cloneDeep(arr)
                } else if (arr.length === 0) {
                    if (this.get_params.page > 1) {
                        this.get_params.page = this.get_params.page - 1
                        this.get_data()
                    }
                }
                setTimeout(() => {
                    this.$refs.tableContent.filterKeyword()
                }, 100)
            }).catch(error => {
                this.loading = false
                this.barStatus = 2
                console.log('error' + error)
            })
        },
        getTopFieldFun(params) {
            this.rankData = []
            this.topLoading = true
            let data = {
                queryData: {},
                paramsData: {
                    inputTerm: [{ field: 'startTime', value: this.customTime[0] }, { field: 'endTime', value: this.customTime[1] }],
                    sqlTerm: this.sqlTermData,
                    filterTerm: this.conditionData.map(it => it.origin[0]),
                    fields: params.fields,
                    orderType: params.orderType
                }
            }
            this.rankMarkField = params.fields[0]
            getTopField(data).then(res => {
                console.log('Top10列表', res)
                if (res && res.length && res[0][this.rankMarkField] !== undefined) {
                    this.rankData = res ?? []
                }
                this.topLoading = false
            }).catch(error => {
                console.log('error' + error)
                this.topLoading = false
            })
        },
        handleDel(row) {
            this.deleteId = row.id
            this.delDialog = true
        },
        searchSQLCon() {
            this.get_paramsSave.page = 1
            this.get_dataSave()
        },
        handleSave(row) {
            console.log(row)
            this.saveData = this.$deepCopy(row)
            this.saveDialog = true
            this.historySave = true
        },

        handleSizeChange(val) {
            this.get_params.size = val
            this.get_data()
        },
        handleCurrentChange(val) {
            this.get_params.page = val
            this.get_data()
        },

        handleSizeChangeSave(val) {
            this.get_paramsSave.size = val
            this.get_dataSave()
        },
        handleCurrentChangeSave(val) {
            this.get_paramsSave.page = val
            this.get_dataSave()
        },

        handleSizeChangeHistory(val) {
            this.get_paramsHistory.size = val
            this.get_dataHistory()
        },
        handleCurrentChangeHistory(val) {
            this.get_paramsHistory.page = val
            this.get_dataHistory()
        },
        twoStr(n) {
            return n < 10 ? '0' + n : n
        },
        getCurrentDay() {
            let myDate = new Date()
            let day = myDate.getFullYear() + '-' + this.twoStr(myDate.getMonth() + 1) + '-' + this.twoStr(myDate.getDate())
            return day
        },
        getCurrentWeek() {
            let myDate = new Date()
            let day = myDate.getFullYear() + '-' + this.twoStr(myDate.getMonth() + 1) + '-' + this.twoStr(myDate.getDate())
            return day
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/css/pacap';
.event-wrapper {
    border-top: none;
    border-radius: 0 0 4px 4px;
    box-shadow: 0 0 0 0 rgb(140 152 164 / 20%);
}
.ub-wrap {
    flex-wrap: wrap;
}
.event .sql-btn {
    width: 30px;
    height: 30px;
}
.search-box {
    .search-more {
        display: flex;
        flex-wrap: wrap;
        .search-more-left {
            display: flex;
            flex-wrap: wrap;
            div {
                margin-right: 20px;
                padding: 5px 0;
                ::v-deep .el-select {
                    width: 253px;
                }
                ::v-deep .el-input__inner {
                    height: 30px;
                    line-height: 30px;
                }
            }
        }
        .search-text {
            display: block;
            margin-top: 10px;
            width: 114px;
            height: 20px;
            font-size: 12px;
            text-align: right;
            color: #03e9ff;
            cursor: pointer;
        }
    }
    & ::v-deep .el-form-item__label {
        line-height: 40px !important;
    }
    & ::v-deep .el-form-item__content {
        line-height: 40px !important;
    }
}
.sql-box {
    margin-top: 5px;
}
.split-line {
    position: absolute;
    bottom: 30px;
    left: 0;
    width: 100%;
    height: 1px;
    background: #dcdcdc;
}
.progress-box {
    position: relative;
    height: 24px;
    .chart-title {
        position: absolute;
        top: 0;
        height: 24px;
        font-size: 12px;
        color: rgb(77 77 77 / 60%);
        line-height: 24px;

        // div:nth-child(1) {
        //     padding:0 10px;
        //     // width: 80px;
        //     cursor: pointer;
        // }
        .table-view, .chart-view {
            padding: 0 10px;
            // width: 80px;
            cursor: pointer;
            div:nth-child(1) {
                padding-right: 10px;
            }
        }
        div.active {
            //background-color: #008aff;
            color: #0052d9;
            background-color: rgb(255 255 255 / 50%);
            // box-shadow: 0 0 12px rgba(0,180,255,.9) inset;
        }
        .icon-select::before {
            display: inline-block;
            transform: rotate(-180deg);
            transition: 0.4s;
            transform-origin: center;
        }
        .icon-select1::before {
            display: inline-block;
            transition: 0.4s;
            transform-origin: center;
        }
    }
}
.fold-box {
    padding-right: 20px;
    height: 24px;
    color: #ffffff;
    line-height: 24px;
    box-sizing: border-box;
    cursor: pointer;
}
.expert ::v-deep .vue-treeselect__placeholder, .vue-treeselect__single-value {
    line-height: 30px;
}
.expert ::v-deep .vue-treeselect__limit-tip-text {
    padding: 0 2px;
    border: 1px solid #00e9ff;
    border-radius: 2px;
    color: #00e9ff;
}
.expert ::v-deep .vue-treeselect__limit-tip {
    padding-top: 0;
}
.fields-ver-line {
    position: absolute;
    top: 0;
    left: -8px;
    width: 2px;
    height: 26px;
    border-radius: 1px;
    background-color: #ffffff;
    box-shadow: 0 0 4px 0 #00d0ff,
        0 0 6px 0 #00d0ff;
}
.expert ::v-deep .el-input-group__append {
    position: relative;
    top: -1px;
    display: table-cell;
    margin-left: -1px;
    padding: 0 20px;
    width: 1px;
    border: none;
    border-radius: 4px;
    background-color: rgb(0 0 0 / 0%);
    box-sizing: border-box;
}
.expert ::v-deep .el-input-group__append button.el-button,
.expert ::v-deep .el-input-group__append div.el-select .el-input__inner,
.expert ::v-deep .el-input-group__append div.el-select:hover .el-input__inner,
.expert ::v-deep .el-input-group__prepend button.el-button,
.expert ::v-deep .el-input-group__prepend div.el-select .el-input__inner,
.expert ::v-deep .el-input-group__prepend div.el-select:hover .el-input__inner {
    height: 28px;
    border: solid 1px #dcdcdc;
    border-left: none;
    // background-color: rgb(4, 33, 54);
    // box-shadow: inset 0px 0px 7px 0px #389bf7;
    border-radius: 0 2px 2px 0;
    box-sizing: border-box;
    i.el-icon-search {
        margin-top: -4px;
        color: #dcdcdc;
    }
    .el-icon-search::before {
        position: relative;
        top: -4px;
    }
}
.expert ::v-deep .el-tabs__item {
    padding-left: 20px !important;
    height: 30px;
    font-size: 12px;
    color: rgb(0 0 0 / 60%);
    line-height: 30px;
}
.expert ::v-deep .el-tabs__item.is-active {
    color: #0052d9;
}
.expert ::v-deep .el-tabs__active-bar {
    height: 1px;
    background-color: #0052d9;
}
.expert ::v-deep .el-tabs__nav-wrap::after {
    height: 1px;
    background-color: rgb(210 216 57 / 20%);
}
.expert ::v-deep .el-form-item__label {
    font-size: 12px;
    color: #999999;
}
.popper-item {
    font-size: 12px;
    text-align: center;
    color: #ffffff;
    background-color: #1a5c92;
    line-height: 30px;
    cursor: pointer;
}
.popper-item.active {
    font-size: 12px;
    color: #00fffc;
    background-color: rgb(0 186 255 / 73%);
}
.add_expert {
    width: 80px;
    height: 30px;
    color: #63e6ff;
    background-position: center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    opacity: 0.8;
    box-sizing: border-box;
    background-image: url(../../../assets/img/XZWJ.png);
}
.add_expert:hover {
    color: #63e6ff!important;
    opacity: 1;
}
.export {
    font-size: 12px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-image: url(../../../assets/img/export_bg.png);
}
.export1 {
    font-size: 12px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-image: url(../../../assets/img/add_expert.png);
}
.export ::v-deep span,
.export1 ::v-deep span {
    margin-left: 5px;
}
.el-form-item {
    margin-bottom: 0;
}
.alarm-from .el-form-item {
    margin-bottom: 22px;
}
.expert ::v-deep .el-icon-date {
    color: rgb(0 0 0 / 40%);
}
.search-fileds-box ::v-deep .el-form-item {
    margin-bottom: 10px;
}
.add_expert:hover,
.export:hover,
.export1:hover {
    color: #ffffff;
}
.field-del-icon {
    display: inline-block;
    width: 20px;
    height: 20px;
    cursor: pointer;
    vertical-align: middle;
    font-size: 0;
    text-align: center;
    >i {
        font-size: 16px;
        color: #0052d9;
        line-height: 18px;
    }
}
.search-option {
    padding-left: 100px;
}
.search-option ::v-deep .el-button--text {
    color: #0052d9;
}
.search-list-btn {
    // margin-top: -10px;
    >div {
        cursor: pointer;
        margin: 0 10px;
    }
}
.search-list-btn i {
    margin-right: 5px;
    font-size: 12px;
    color: #00e9ff;
}
.search-list-btn span {
    font-size: 12px;
    color: #00e9ff;
}
.chart-desc {
    font-size: 12px;
    line-height: 36px;
    color: #ffffff;
}
.event ::v-deep .el-input--small .el-input__inner {
    height: 32px;
    line-height: 32px;
}
.expert ::v-deep .el-radio__label,
.expert ::v-deep .el-checkbox__label {
    // color: #fff;
    font-size: 12px;
}
.chart-num-box {
    margin-right: 10px;
    padding-left: 20px;
    box-sizing: border-box;
    >div:nth-child(1) {
        font-size: 12px;
        line-height: 15px;
        color: rgb(0 0 0 / 90%);
    }
    >div:nth-child(2) {
        bottom: 6px;
        margin-top: 10px;
        font-size: 12px;
        color: rgb(0 0 0 / 90%);
        // text-shadow: 0px 0px 10px rgba(247, 232, 0, 0.9);
    }
    .chart-bg {
        width: 90px;
        height: 40px;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        opacity: 0.5;
        background-image: url('../../../assets/img/data_manage/chart_three.png');
    }
}
.chart-bg-two {
    position: absolute;
    top: -4px;
    width: 40px;
    height: 40px;
    background-position: center;
    // background-image: url('../../../assets/img/data_manage/chart_two.png');
    background-repeat: no-repeat;
    background-size: cover;
    opacity: 0.5;
}
.chart-bg-three {
    position: absolute;
    right: -19px;
    bottom: -8px;
    width: 40px;
    height: 40px;
    background-position: center;
    // background-image: url('../../../assets/img/data_manage/chart_one.png');
    background-repeat: no-repeat;
    background-size: cover;
    opacity: 0.5;
}
.expert-left {
    margin-right: 10px;
    padding: 8px 10px;
    width: 200px;
    border: solid 1px rgb(80 176 255 / 40%);
    background-color: #07101a;
    box-sizing: border-box;
}
.expert-right {
    padding: 10px;
    border: solid 1px rgb(80 176 255 / 40%);
    background-color: #07101a;
}
.left-title {
    font-size: 14px;
    color: #ffffff;
}
.reset-btn, .sql-btn {
    margin-left: 10px;
    width: 80px;
    height: 30px;
    font-size: 12px;
    border: solid 1px #39caf3;
    border-radius: 5px;
    color: #a2ece8;
    background-color: #041f38;
    box-shadow: inset 0 0 10px 0
        rgb(0 167 245 / 97%);
    line-height: 15px;
    letter-spacing: 1px;
    cursor: pointer;
    box-sizing: border-box;
}
.search-btn ::v-deep .btn {
    width: 80px;
    height: 30px;
    border: none;
    background: none;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    background-image: url(../../../assets/img/expert_search_btn.png);
    i {
        display: none;
    }
}
.chart-wrapper {
    width: 100%;
    border-radius: 4px;
    background: #dadee8;
    box-sizing: border-box;
    // border: solid 1px rgba(80, 176, 255, 0.4);
    // background-image: url(../../../assets/img/log_num.png);
    // background-size: cover;
    // background-repeat: no-repeat;
    // background-position: left top;
    ::v-deep .el-loading-spinner {
        top: 40px !important;
    }
}
.left-tip {
    margin-top: 10px;
    font-size: 0;
    >i {
        margin-right: 5px;
        font-size: 12px;
        color: #0052d9;
        vertical-align: middle;
    }
    >span {
        vertical-align: middle;
        font-size: 10px;
        color: #0052d9;
    }
}
.list-group {
    min-height: 26px;
}
.list-title {
    margin: 0 auto;
    width: 170px;
    height: 26px;
    background-position: left top;
    background-repeat: no-repeat;
    background-size: cover;
    background-image: url(../../../assets/img/field_bg.jpg);
}
.list-group-item {
    margin: 8px 0;
    color: #ffffff;
    cursor: move;
    // padding:0 10px;
    box-sizing: border-box;
}
.list-group-item1 {
    margin: 8px 0;
    color: #ffffff;
    // padding:0 10px;
    box-sizing: border-box;
}
.list-group-item i,
.list-group-item1 i {
    cursor: pointer;
}
.open-box,
.close-box {
    width: 26px;
    height: 100%;
    text-align: center;
    color: #0052d9;
    line-height: 26px;
}
.list-inner-tip {
    margin: 6px 0;
    font-size: 12px;
    color: #0052d9;
    line-height: 15px;
}
.list-inner {
    margin: 0 auto;
    width: 170px;
}
.condition-box {
    position: absolute;
    top: 106%;
    left: 0;
    z-index: 999;
    overflow-y: auto;
    padding-bottom: 20px;
    width: 1000px;
    border: solid 1px #0052d9;
    border-radius: 2px;
    background-color: #033254;
    box-shadow: 0 0 20px 0 rgb(0 0 0 / 80%),
        inset 0 0 6px 0 rgb(0 186 255 / 73%);
}
.condition-area {
    position: absolute;
    top: 27px;
    right: 0;
    left: 0;
    z-index: 1000;
    padding: 20px;
    border: solid 1px #dcdcdc;
    border-radius: 4px;
    background-color: #ffffff;
    box-shadow: 0 0 20px 0 rgb(0 0 0 / 10%);
    transition: all 0.3s;
    .footer {
        position: absolute;
        right: 10px;
        bottom: 1px;
    }
}
.attendance-list {
    margin-top: 0;
    padding-top: 0;
    padding-right: 10px;
    padding-left: 10px;
    height: -ms-calc(100vh - 126px);
    height: calc(100vh - 126px);
    box-sizing: border-box;
}
.pagination {
    padding: 30px 0 20px;
    text-align: right;
}
.el-input.ips {
    display: block;
    width: 100%;
}
.drawer-pad {
    padding: 0 20px;
}
.event ::v-deep .el-range-input {
    color: #ffffff;
    background-color: rgb(0 0 0 / 0%);
}
.event ::v-deep .el-range-separator {
    color: #ffffff;
}
.event ::v-deep .el-radio__inner {
    background-color: transparent;
}
.event ::v-deep .el-radio__label {
    color: #ffffff;
}
.event ::v-deep .el-radio__input.is-checked+.el-radio__label {
    color: #409eff;
}
.event ::v-deep .el-radio__input.is-disabled .el-radio__inner,
.event ::v-deep .el-radio__input.is-disabled.is-checked .el-radio__inner {
    border-color: #409eff;
    background: transparent;
}
.search ::v-deep .el-tag.el-tag--info {
    border-color: #0052d9;
    color: #0052d9;
    background-color: rgb(0 0 0 / 0%);
}
.search ::v-deep .el-tag.el-tag--info .el-tag__close {
    font-size: 14px!important;
    color: #0052d9;
}
.search ::v-deep .el-select .el-tag__close.el-icon-close {
    background-color: rgb(0 0 0 / 0%);
}
.option a {
    margin: 0 3px;
}
.switch-wrapper {
    position: relative;
    width: 68px;
    height: 28px;
    cursor: pointer;
}
.switch-wrapper>div:nth-child(1) {
    width: 68px;
    height: 28px;
    border-radius: 14px;
    background-color: #001a2c;
    box-shadow: inset 0 0 7px 0 #000000;
    div {
        padding: 0 8px;
        font-size: 14px;
        line-height: 28px;
    }
    >div:nth-child(1) {
        color: #00d7ff;
        opacity: 0.6;
    }
    >div:nth-child(2) {
        color: #ffaa47;
        opacity: 0.6;
    }
}
.switch-wrapper>div:nth-child(2) {
    position: absolute;
    top: 50%;
    left: 0;
    margin-top: -16px;
    width: 32px;
    height: 32px;
    border-radius: 100%;
}
.switch-wrapper.yes>div:nth-child(2) {
    animation: moveone 0.3s linear forwards;
}
.switch-wrapper.no>div:nth-child(2) {
    animation: _moveone 0.3s linear forwards;
}

@keyframes moveone {
    0% {
        left: 0;
        background-color: #fa941c;
        box-shadow: 0 0 10px 0 #9c5603;
    }
    100% {
        left: 36px;
        background-color: #0052d9;
        box-shadow: 0 0 10px 0 #058fa9;
    }
}

@keyframes moveone {
    0% {
        left: 0;
        background-color: #fa941c;
        box-shadow: 0 0 10px 0 #9c5603;
    }
    100% {
        left: 36px;
        background-color: #0052d9;
        box-shadow: 0 0 10px 0 #058fa9;
    }
}

@keyframes _moveone {
    0% {
        left: 36px;
        background-color: #0052d9;
        box-shadow: 0 0 10px 0 #058fa9;
    }
    100% {
        left: 0;
        background-color: #fa941c;
        box-shadow: 0 0 10px 0 #9c5603;
    }
}
@keyframes _moveone {
    0% {
        left: 36px;
        background-color: #0052d9;
        box-shadow: 0 0 10px 0 #058fa9;
    }
    100% {
        left: 0;
        background-color: #fa941c;
        box-shadow: 0 0 10px 0 #9c5603;
    }
}
table-expand::-webkit-scrollbar {
    width: 0;
    height: 5px;
}
.input-btn {
    width: 300px;
    p {
        margin-left: 10px;
        font-size: 12px;
        color: #0052d9;
        cursor: pointer;
        i {
            margin-right: 5px;
            font-size: 12px;
        }
    }
}
.general ::v-deep .search-box .time-panel-picker {
    top: -12px !important;
}
.general ::v-deep .filter-title {
    margin-left: 0 !important;
}
.general ::v-deep .common-dialog .time-panel-picker {
    top: 500px !important;
}
</style>
<style lang="scss">
// .time-panel-picker {
//     top: 250px !important;
// }
</style>
