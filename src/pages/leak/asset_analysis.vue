<template>
    <div class="event event-wrapper">
        <div class="w100">
            <div class="event-content w100">
                <div class="chart-row ub ub-pj">
                    <div class="chart-left">
                        <div class="chart-box">
                            <span class="angle1"></span>
                            <span class="angle2"></span>
                            <span class="angle3"></span>
                            <span class="angle4"></span>
                            <div class="ub ub-pj ub-ac">
                                <div class="chart-title">{{currentBar1 === '1' ? '受害安全域统计TOP10' : '受害业务系统统计TOP10'}}</div>
                                <div class="ub ub-pe chart-btn" @click="changeMap">
                                    <i class="el-icon-sort"></i>
                                    <p>{{currentBar1 === '1' ? '业务系统' : '安全域'}}</p>
                                </div>
                            </div>
                            <div class="chart-map">
                                <div v-loading="loading_safe" style="height:210px;">
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
                            <span class="angle1"></span>
                            <span class="angle2"></span>
                            <span class="angle3"></span>
                            <span class="angle4"></span>
                            <div class="ub ub-pj ub-ac">
                                <div class="chart-title">{{currentBar2 | showBar2}}</div>
                                <div class="ub ub-pe chart-btn select">
                                    <el-dropdown trigger="click">
                                        <span class="el-dropdown-link" style="cursor: pointer;color: #00fffe;font-size: 12px">
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
                                <div v-loading="loading_asset_bar" style="height:210px;">
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
                        <div class="chart-box">
                            <span class="angle1"></span>
                            <span class="angle2"></span>
                            <span class="angle3"></span>
                            <span class="angle4"></span>
                            <div class="chart-title">受害资产类型TOP10</div>
                            <div class="chart-map">
                                <div v-loading="loading_asset_pie" class="ub ub-f1" style="height:210px;">
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

                <div class="w100 search-box">
                    <div>
                        <el-row align="middle" class="w100 " :gutter="20">
                            <el-col :span="4" class="event-btn-col">
                                <el-form :model="get_params" style="width: 100%">
                                    <el-form-item label="">
                                        <el-input
                                            placeholder="受害资产IP"
                                            clearable
                                            v-model="get_params.desIp"
                                            style="width: 100%"
                                            size="small">
                                            <el-button
                                                slot="append"
                                                icon="el-icon-search"
                                                @click="searchCheck"></el-button>
                                        </el-input>
                                    </el-form-item>
                                </el-form>
                            </el-col>
                            <el-col :span="4" class="event-btn-col">
                                <el-form :model="get_params" style="width: 100%">
                                    <el-form-item label="">
                                        <el-select
                                            v-model="get_params.reportType"
                                            filterable
                                            placeholder="攻击手段"
                                            style="width: 100%"
                                            @change="searchCheck"
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
                            <el-col :span="5" class="event-btn-col">
                                <el-form :model="get_params">
                                    <el-form-item label="" label-width="">
                                        <el-date-picker
                                            clearable
                                            size="small"
                                            :default-time="['00:00:00', '23:59:59']"
                                            value-format="yyyy-MM-dd HH:mm:ss"
                                            format="yyyy-MM-dd HH:mm:ss"
                                            v-model="sayTimes"
                                            type="datetimerange"
                                            :picker-options="pickerOptions"
                                            range-separator="至"
                                            start-placeholder="开始日期"
                                            end-placeholder="结束日期"
                                            style="width: 100%;"
                                            @change="searchCheck">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-form>
                            </el-col>
                        </el-row>
                    </div>
                </div>
                <div class="table-area">
                    <div class="ub ub-pj w100">
                        <div class="list-tips">列表内容</div>
                        <div>
                            <!--<addBtn icon="iconfont icon-daochu" title="导出内容" @click="addDialog = true"/>-->
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
                        @sort-change="changeOrder"
                        @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="50"></el-table-column>
                        <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                        </el-table-column>
                        <el-table-column prop="desIp" label="资产IP" width="200" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="lastTime" label="最新攻击时间" width="160" sortable="custom">
                        </el-table-column>
                        <el-table-column prop="reportTypeCN" label="攻击手段" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="num" label="已处置事件/事件总量" width="160" align="center">
                            <template slot-scope="{row}">
                                <p style="font-size: 0;cursor: pointer" @click="handleSeeAlarm(row)">
                                    <span style="color: #00ffe4;font-size: 12px; text-decoration: underline">{{row.dealAlarmNum}}/</span>
                                    <span style="color: #fff;font-size: 12px; text-decoration: underline">{{row.num}}</span>
                                </p>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center" width="100">
                            <template slot-scope="scope">
                                <el-button type="text" :disabled="scope.row.isStart == 1" :style="{color: scope.row.isStart == 1 ? '#666' : '#409eff'}" @click="handleEdit(scope.row)">发起工单</el-button>
                            </template>
                        </el-table-column>

                    </el-table>
                    <div class="pagination">
                        <el-pagination
                            background
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="get_params.page"
                            :page-sizes="[20, 30, 40,50]"
                            :page-size="get_params.size"
                            layout="total, sizes, prev, pager, next"
                            prev-text="上一页"
                            next-text="下一页"
                            :total="total_num">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog v-dialogDrag title="发起工单" :visible.sync="taskDialog" width="700px" custom-class="attendance-dialog">
            <el-form :model="taskForm" :rules="rules" ref="taskForm" label-position="right">
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
                        <el-option v-for="item in allTemplate" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <searchBtn title="确 定" @click="submitTaskForm('taskForm')"/>
                <cancel-btn title="取 消" @click="taskDialog = false"/>
            </span>
        </el-dialog>
        <el-dialog v-dialogDrag title="事件详情" :visible.sync="alarmDetailDialog" width="940px" custom-class="attendance-dialog">
            <div>
                <el-table
                    ref="multipleTable"
                    v-loading="loading_alarm"
                    class='bigTable full-table'
                    :data="alarmTableData"
                    border
                    stripe
                    tooltip-effect="dark">
                    <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                    </el-table-column>
                    <el-table-column prop="id" label="事件ID" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="reportName" label="事件名称" width="160">
                    </el-table-column>
                    <el-table-column prop="reportLevel" label="事件等级"  width="100" align="center">
                        <template slot-scope="scope">
                            <div>
                                <span v-if="scope.row.reportLevel == 0" style="color:#7efcfb">低</span>
                                <span v-if="scope.row.reportLevel == 1" style="color:#00c7ff">中低</span>
                                <span v-if="scope.row.reportLevel == 2" style="color:#fdfe7f">中</span>
                                <span v-if="scope.row.reportLevel == 3" style="color:#fc7f00">中高</span>
                                <span v-if="scope.row.reportLevel == 4" style="color:#fd0001">高</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="reportTypeName" label="事件类型" width="100" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="attackResult" label="攻击结果" width="100">
                    </el-table-column>
                    <el-table-column prop="num" label="事件状态" width="100">
                        <template slot-scope="scope">
                            <div>
                                <div v-if="scope.row.reportStatus == 0" class="ub ub-ac match-state one">
                                    <div></div>
                                    <div>待确认</div>
                                </div>
                                <div v-if="scope.row.reportStatus == 1" class="ub ub-ac match-state two">
                                    <div></div>
                                    <div>已确认</div>
                                </div>
                                <div v-if="scope.row.reportStatus == 2" class="ub ub-ac match-state three">
                                    <div></div>
                                    <div>已处理</div>
                                </div>
                                <div v-if="scope.row.reportStatus == 3" class="ub ub-ac match-state alarm four">
                                    <div></div>
                                    <div>已驳回</div>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="140">
                        <template slot-scope="scope">
                            <el-button v-if="!(scope.row.isStart == 1)" type="text" style="color: #409eff" @click="handleEdit_alarm(scope.row)">发起工单</el-button>
                            <el-button type="text" style="color: #409eff" @click="handleChangeStatus(scope.row)">状态变更</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination
                        background
                        @size-change="handleSizeChange_alarm"
                        @current-change="handleCurrentChange_alarm"
                        :current-page="alarm_params.page"
                        :page-sizes="[10, 20, 30, 40,50]"
                        :page-size="alarm_params.size"
                        layout="total, sizes, prev, pager, next"
                        prev-text="上一页"
                        next-text="下一页"
                        :total="alarm_total_num">
                    </el-pagination>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <cancelBtn title="取 消" @click="alarmDetailDialog = false" />
            </span>
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
                        <vue-ueditor-wrap v-model="stateForm.disposalResult" :config="myConfig"></vue-ueditor-wrap>
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
    </div>
</template>

<script>
import bar from './charts/assetAnalysis/bar'
import pie from './charts/assetAnalysis/pie'
import VueUeditorWrap from '../../components/vue-ueditor-wrap.vue' // ES6 Module
import ueditorConfig from '../../mixins/ueditorConfig'
import {
    getAssetList,
    getAlarmTemplate,
    getAssetTemplate,
    getAlarmType,
    addWorkOrder,
    changeStatus,
    getAssetAlarmTable,
    getAssetBarPie,
    getAssetBar2
} from '../../server/leak/define.js'
export default {
    name: 'AssetAnalysis',
    components: {
        bar,
        pie,
        VueUeditorWrap
    },
    mixins: [ueditorConfig],
    data() {
        return {
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
                reportType: ''
            },
            alarm_total_num: 0,
            alarmTableData: [],
            alarm_params: {
                id: '',
                page: 1,
                size: 10
            },
            alarmTypeList: [],
            taskDialog: false,
            taskForm: {
                workOrderName: '',
                workMouldId: '',
                level: '',
                workOrderContent: ''
            },
            stateForm: {
                reportStatus: '2',
                disposalResult: '',
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
                workMouldId: [{
                    required: true,
                    message: '请选择工单模板',
                    trigger: 'change'
                }]
            },
            orderType: '',
            allTemplate: [],
            assetTemplate: [],
            alarmTemplate: []
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.get_asset_template()
            this.get_data()
            this.getAlarmList()
            this.getAssetChartBar()
            this.getAssetChartPie()
        })
    },
    watch: {
        taskDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.taskForm.resetFields()
                }
            }
        },
        stateDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.stateForm.resetFields()
                    this.stateForm.rejectReason = ''
                    this.stateForm.analyzePro = ''
                    this.stateForm.disposalResult = ''
                }
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
        getAssetChartPie() {
            this.loading_safe = this.loading_asset_pie = true
            getAssetBarPie({}).then(res => {
                this.loading_safe = this.loading_asset_pie = false
                console.log('1,3图表', res)
                this.securityDomainData = []
                this.systemNameData = []
                this.assetPie = []
                if (res.length) {
                    res.splice(10)
                    res.forEach(item => {
                        let obj_security = {}
                        let obj_system = {}
                        let obj_pie = {}

                        obj_security.name = item.securityDomain
                        obj_security.value = item.num

                        obj_system.name = item.systemName
                        obj_system.value = item.num

                        obj_pie.name = item.assetsTypeName
                        obj_pie.value = item.num

                        this.securityDomainData.push(obj_security)
                        this.systemNameData.push(obj_system)
                        this.assetPie.push(obj_pie)
                    })
                    this.safetyData = this.$deepCopy(this.securityDomainData)
                }
            }).catch(err => {
                this.loading_safe = this.loading_asset_pie = false
                console.log(err)
            })
        },
        getAssetChartBar() {
            this.loading_asset_bar = true
            let obj = {
                type: this.currentBar2
            }
            getAssetBar2(obj).then(res => {
                console.log('2图表', res)
                this.assetBar = []
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
            getAlarmType({}).then(res => {
                console.log(res, '攻击行为')
                this.alarmTypeList = res
            }).catch(err => {
                console.log(err + 'err')
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
                        setTimeout(() => {
                            this.get_data()
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
        submitStateForm() {
            let data = {
                ids: [this.statusId],
                reportStatus: this.stateForm.reportStatus,
                analyzePro: this.stateForm.analyzePro,
                rejectReason: this.stateForm.rejectReason,
                disposalResult: this.stateForm.disposalResult
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
        get_asset_template(row) {
            this.attackTemplate = []
            let obj = {
                id: 3
            }
            getAssetTemplate(obj).then(res => {
                console.log('资产模板', res)
                this.attackTemplate = res
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
                    endTime: this.sayTimes && this.sayTimes.length > 0 ? this.sayTimes[1] : ''
                }
            }
            getAssetList(data).then(res => {
                console.log('列表', res)
                this.loading = false
                this.tableData = []
                this.total_num = res.totalElements
                let content = res.content
                if (content.length) {
                    content.forEach(item => {
                        let obj = {}
                        obj.dealAlarmNum = item.dealAlarmNum
                        obj.desIp = item.desIp
                        obj.firstTime = item.firstTime
                        obj.id = item.id
                        obj.lastTime = item.lastTime
                        obj.num = item.num
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
            this.get_data()
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
            this.alarmDetailDialog = true
            this.record_desIp = row.desIp
            this.getAlarmTableList()
        },
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
                console.log(res, '事件')
                this.loading_alarm = false
                this.alarm_total_num = res.totalElements
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
            this.recordId = row.id
            this.allTemplate = this.$deepCopy(this.attackTemplate)
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
    border: 1px solid #00274e;

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
        margin: 20px 0 10px 10px;
        height: 24px;
        line-height: 24px;
        font-size: 14px;
        padding-left: 10px;
        font-weight: 500;
        color: #fff;
        position: relative;
        text-shadow: 0 0 6px #00cffb, 0 0 6px #00cffb;
    }
}
.search-box {
    margin: 30px 0 20px;
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
    font-size: 14px;
    margin: 20px 10px 10px 0;
    color: #00fffe;
    cursor: pointer;
    i {
        transform: rotate(90deg);
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
}
</style>
