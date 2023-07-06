<template>
    <div>
        <SearchTop @search="searchCheck" @reset="resetFun" :hasMore="true">
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params" label-position="right" :label-width="labelWidth">
                    <el-form-item label="事件时间：">
                        <CustomDate
                            :append-to-body="true"
                            :auto="true"
                            @getCustomTime="getCustomTime"
                            @getDateData="getDateData"
                            @actualTime="actualTimeData"
                            style="width:100%"
                            @timeUnit="timeUnitData"
                            :empty="false"
                            :chartTimeRange="customTimeRange"
                            ref="customDate"></CustomDate>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params" label-position="right" :label-width="labelWidth">
                    <el-form-item label="事件状态：">
                        <el-select
                            v-model="get_params.reportStatus"
                            placeholder="请选择"
                            filterable
                            style="width:100%"
                            multiple
                            collapse-tags
                            size="small">
                            <el-option v-for="(item, index) in alarmStates" :key="index" :label="item.text" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params" label-position="right" :label-width="labelWidth">
                    <el-form-item label="目的IP：">
                        <el-input placeholder="请输入" clearable v-model="get_params.desIp" size="small" style="width:100%">
                        </el-input>
                    </el-form-item>

                </el-form>
            </el-col>
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params" label-position="right" :label-width="labelWidth">
                    <el-form-item label="事件等级：">
                        <el-select
                            v-model="get_params.reportLevel"
                            style="width:100%"
                            placeholder="请选择"
                            multiple
                            filterable
                            size="small"
                            collapse-tags
                            clearable>
                            <el-option v-for="(item, index) in levels" :key="index" :label="item.name" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params" label-position="right" :label-width="labelWidth">
                    <el-form-item label="事件类型：">
                        <el-select size="small" v-model="get_params.reportType" multiple clearable placeholder="请选择" style="width:100%" collapse-tags>
                            <el-option v-for="(item) in typeList" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params" label-position="right" :label-width="labelWidth">
                    <el-form-item label="源IP：">
                        <el-input placeholder="请输入" clearable v-model="get_params.srcIp" size="small" style="width:100%">
                        </el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params" label-position="right" :label-width="labelWidth">
                    <el-form-item label="源端口：">
                        <el-input placeholder="请输入" clearable v-model="get_params.srcPort" size="small" style="width:100%">
                        </el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params" label-position="right" :label-width="labelWidth">
                    <el-form-item label="事件名称：">
                        <el-input placeholder="请输入" clearable v-model="get_params.reportName" size="small" style="width:100%">
                        </el-input>
                    </el-form-item>

                </el-form>
            </el-col>
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params" label-position="right" :label-width="labelWidth">
                    <el-form-item label="目的端口：">
                        <el-input placeholder="请输入" clearable v-model="get_params.desPort" size="small" style="width:100%">
                        </el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params" label-position="right" :label-width="labelWidth">
                    <el-form-item label="攻击结果：">
                        <el-select filterable size="small" v-model="get_params.attackResult" multiple clearable placeholder="请选择" style="width:100%" collapse-tags>
                            <el-option v-for="(item) in attackResultList" :key="item.id" :label="item.name" :value="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params" label-position="right" :label-width="labelWidth">
                    <el-form-item label="事件来源：">
                        <el-select size="small" v-model="get_params.reportFrom" clearable placeholder="请选择" style="width:100%" multiple collapse-tags>
                            <el-option v-for="(item) in reportFromList" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params" label-position="right" :label-width="labelWidth">
                    <el-form-item label="关联规则：">
                        <el-select filterable size="small" v-model="get_params.ruleIds" clearable placeholder="请选择" style="width:100%" multiple collapse-tags>
                            <el-option v-for="(item) in relevanceRuleList" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-col>
        </SearchTop>
        <div class="list-container mb-2">
            <div class="ub ub-pj w100 mb-1 ub-ac">
                <div class="list-tips">列表内容</div>
                <div>
                </div>
            </div>
            <el-table
                ref="multipleTable1"
                v-loading="tableLoading"
                class='bigTable'
                :data="tableData"
                border
                stripe
                tooltip-effect="dark"
                :row-class-name="tableRowClassName"
                :height="tabHeight"
                :row-style="{ height: '32px' }"
                :header-row-style="{ height: '32px' }">
                <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                </el-table-column>
                <el-table-column prop="id" label="事件ID">
                </el-table-column>
                <el-table-column prop="reportName" label="事件名称">
                </el-table-column>
                <el-table-column prop="reportLevel" label="事件等级">
                    <template slot-scope="scope">
                        <div>
                            <span v-if="scope.row.reportLevel == 0" style="color:#03864f">低</span>
                            <span v-if="scope.row.reportLevel == 1" style="color:#0052d9">中低</span>
                            <span v-if="scope.row.reportLevel == 2" style="color:#ddd000">中</span>
                            <span v-if="scope.row.reportLevel == 3" style="color:#e47700">中高</span>
                            <span v-if="scope.row.reportLevel == 4" style="color:#e47700">高</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="reportTypeName" label="事件类型">
                </el-table-column>
                <el-table-column prop="eventId" label="事件状态">
                    <template slot-scope="scope">
                        <div >
                            <div v-if="scope.row.reportStatus == 0" class="ub ub-ac ub-pc alarm-state one">
                                <div>待确认</div>
                            </div>
                            <div v-if="scope.row.reportStatus == 1" class="ub ub-ac ub-pc alarm-state two">
                                <div>已确认</div>
                            </div>
                            <div v-if="scope.row.reportStatus == 2" class="ub ub-ac ub-pc alarm-state three">
                                <div>已处置</div>
                            </div>
                            <div v-if="scope.row.reportStatus == 3" class="ub ub-ac ub-pc alarm-state four">
                                <div>已驳回</div>
                            </div>
                        </div>
                    </template>

                </el-table-column>
                <el-table-column prop="srcIp" label="源IP">
                </el-table-column>
                <el-table-column prop="srcPort" label="源端口">
                </el-table-column>
                <el-table-column prop="desIp" label="目的IP">
                </el-table-column>
                <el-table-column prop="desPort" label="目的端口">
                </el-table-column>
                <el-table-column prop="assetName" label="受影响资产" show-overflow-tooltip>
                </el-table-column>
                <el-table-column align="center" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="handleSee(scope.row)">查看</el-button>
                        <el-button type="text" size="small" @click="handleAdd(scope.row)">添加</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size" @pagination="get_data" style="padding-top:10px" v-show="total_num>0"/>
        </div>
        <div v-loading="loading">
            <topological v-if="!loading" @add="addChart" @del="delChart" @search="searchChart" @click="nextChain" @handleEdge="handleEdge" :value="graphDataShow"  ref="topologicalGraph"></topological>
        </div>
        <el-drawer :append-to-body="true" :visible.sync="seeDialog" direction="rtl" :size="1200" :wrapperClosable="false" title="详情">
            <div class="drawer-content event">
                <div style="position: relative;left:0;top:0;width:100%;height:100%;overflow-y: auto;">
                    <div class="ub ub-pj w100">
                        <div class="list-tip">
                            <span style="font-weight:600">{{ seeForm.reportName }}</span>
                            <span v-if="seeForm.reportLevel == 0" class="title-level zero">低</span>
                            <span v-if="seeForm.reportLevel == 1" class="title-level one">中低</span>
                            <span v-if="seeForm.reportLevel == 2" class="title-level two">中</span>
                            <span v-if="seeForm.reportLevel == 3" class="title-level three">中高</span>
                            <span v-if="seeForm.reportLevel == 4" class="title-level fore">高</span>

                            <span
                                v-if="seeForm.reportStatus == 0"
                                style="color:#e47700;background:rgba(255,186,0,0.3);font-size: 12px;border-radius: 16px;line-height: 1;padding: 3px 15px;">待确认</span>
                            <span
                                v-if="seeForm.reportStatus == 1"
                                style="color:#03864f;background:rgba(0,255,0,0.3);font-size: 12px;border-radius: 16px;line-height: 1;padding: 3px 15px;">已确认</span>
                            <span
                                v-if="seeForm.reportStatus == 2"
                                style="color:#0052d9;background:rgba(0,192,255,0.3);font-size: 12px;border-radius: 16px;line-height: 1;padding: 3px 15px;">已处置</span>
                            <span
                                v-if="seeForm.reportStatus == 3"
                                style="color:#aa0202;background:rgba(255,58,58,0.3);font-size: 12px;border-radius: 16px;line-height: 1;padding: 3px 15px;">已驳回</span>
                        </div>
                    </div>
                    <div class="drawer-pad">
                        <el-tabs v-model="activeName">
                            <el-tab-pane label="基本信息" name="first">
                                <BasicInfo :seeForm="seeForm"></BasicInfo>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </div>
            </div>
        </el-drawer>
    </div>
</template>

<script>
import CustomDate from '@/pages/alarm/new_alarm/components/custom_date/index.vue'
import BasicInfo from './BasicInfo'
import topological from './topological.vue'
import {
    getAlarmList,
    acquireAttackChain,
    editWireEdge,
    nextAttackChain,
    addNodeAttackChain,
    deleteNodeAttackChain,
    getMenace
} from '@/server/alarm/alarm.js'
export default {
    name: 'AttackChain',
    components: {
        topological,
        BasicInfo,
        CustomDate
    },
    filters: {
        getReportFrom(type) {
            if (type == 0) {
                return '手动'
            } else if (type == 1) {
                return '自动'
            }
        },
        getLevel(level) {
            if (level == 0) {
                return '低'
            } else if (level == 1) {
                return '中低'
            } else if (level == 2) {
                return '中'
            } else if (level == 3) {
                return '中高'
            } else if (level == 4) {
                return '高'
            }
        }
    },
    props: {
        see: {
            type: Boolean,
            default() {
                return false
            }
        },
        alarmId: {
            default() {
                return ''
            }
        },
        attackResultList: {
            default() {
                return []
            }
        },
        relevanceRuleList: {
            default() {
                return []
            }
        },
        typeList: {
            default() {
                return []
            }
        }
    },
    mounted() {
        // this.initGraph()
        // this.getShowInitData()
        this.getChartData()
    },
    watch: {
        // see: {
        //     handler(newVal, oldVal) {
        //         if (newVal) {
        //             this.resetFun()
        //         }
        //     }
        // }
    },
    data() {
        return {
            isColor: 0,
            searchNode: {},
            delNode: {},
            addNode: '',
            // 时间开始
            sayTimes: [],
            customTimeRange: [],
            actualTime: '',
            timeUnit: '',
            dateData: '',
            dateMode: '',
            useDate: {},
            useIndex: '',
            // 时间结束
            seeForm: {},
            activeName: 'first',
            seeDialog: false,
            total_num: 0,
            tabHeight: 250,
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
            labelWidth: '80px',
            loading: false,
            tableLoading: false,
            comboType: 'circle',
            tableData: [],
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
                ids: [],
                orgId: null,
                attCk: null,
                attChain: ''
            },
            graphDataShow: {}
        }
    },
    methods: {
        handleEdge(val) {
            console.log('点击边的id', val)
            let data = {
                queryData: {

                },
                paramsData: {
                    eventId: this.alarmId,
                    edgeId: val

                }
            }
            editWireEdge(data).then(res => {
                console.log('图表修改', res)
                this.changeColor(val, res)
            }).catch(error => {
                console.log('error' + error)
            })
        },
        changeColor(edgeId, isColor) {
            // edgeId be7c55b693be4cca804b905bd3f74a56
            // 62d83e566adf4d32ba597cae1898cb9b
            console.log('edgeId', edgeId)
            let edges = this.graphDataShow.edges
            let nodes = this.graphDataShow.nodes
            let styleData = {
                stroke: ''
            }
            if (isColor == 0) {
                styleData.stroke = '#dcdcdc'
            } else if (isColor == 1) {
                styleData.stroke = '#5faee3'
            }
            let colorEdge = edges.filter(item => item.id == edgeId).map(item => {
                return {
                    id: item.id,
                    source: item.source,
                    style: styleData,
                    target: item.target,
                    type: item.type,
                    data: item.data
                }
            })
            let otherEdge = edges.filter(item => item.id != edgeId)
            let newEdges = [...otherEdge, ...colorEdge]
            this.graphDataShow = { nodes: nodes, edges: newEdges }
            console.log('变色后', this.graphDataShow)
            setTimeout(() => {
                this.$refs.topologicalGraph.changeData()
            }, 100)
        },
        getChartData() {
            this.loading = true
            let data = {
                queryData: {

                },
                paramsData: {
                    id: this.alarmId

                }
            }
            acquireAttackChain(data).then(res => {
                this.loading = false
                this.graphDataShow = res.graphDataShow
                console.log('图表', res)
            }).catch(error => {
                this.loading = false
                console.log('error' + error)
            })
        },
        get_data() {
            this.setDate()
            this.tableLoading = true
            this.tableData = []
            let data = {
                queryData: {
                    page: this.get_params.page,
                    pageSize: this.get_params.size
                },
                paramsData: {
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
            }
            getAlarmList(data).then(res => {
                console.log('getAlarmList', res)
                this.tableLoading = false
                this.total_num = res.total
                let list = res.records
                if (list.length > 0) {
                    list.forEach(item => {
                        let obj = {}
                        obj.id = item.id
                        obj.count = item.count ? item.count : ''
                        obj.assetName = item.assetName
                        obj.alarm_from = item.reportFrom
                        obj.reportFrom = item.reportFrom
                        obj.reportName = item.reportName
                        obj.reportDesc = item.reportDesc
                        obj.createTime = item.createTime
                        obj.reportType = `${item.reportType}`
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
                        obj.attCk = item.attCk
                        obj.attChain = item.attChain

                        this.tableData.push(obj)
                    })
                    this.$nextTick(() => {
                        if (this.$refs.multipleTable1) {
                            this.$refs.multipleTable1.doLayout()
                        }
                    })
                }
            }).catch(error => {
                this.loading = false
                console.log('error' + error)
            })
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
                this.$refs.customDate.actualTime = this.actualTime
                this.$refs.customDate.timeUnit = this.timeUnit
                this.$refs.customDate.isSelectRelative = null
                this.$refs.customDate.isSelectRecently = null
                this.$refs.customDate.isSelectOther = null
                this.$refs.customDate.handleUse()
            }
            // else if (this.dateMode === 'custom') {
            //     this.sayTimes = this.customTimeRange
            //     this.$refs.customDate.isSelectRelative = null
            //     this.$refs.customDate.isSelectRecently = null
            //     this.$refs.customDate.isSelectOther = null
            // }
        },
        timeUnitData(val) {
            this.timeUnit = val
        },
        actualTimeData(val) {
            this.actualTime = val
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
        handleAdd(row) {
            if (this.addNode) {
                this.loading = true
                let data = {
                    queryData: {

                    },
                    paramsData: {
                        eventId: this.alarmId,
                        ip: this.addNode.name,
                        eventIdNew: row.id,
                        nodeId: this.addNode.id
                    }
                }
                addNodeAttackChain(data).then(res => {
                    this.graphDataShow = res.graphDataShow
                    this.$refs.topologicalGraph.changeData()
                    this.loading = false
                    console.log('addNodeAttackChain', res)
                }).catch(error => {
                    this.loading = false
                    console.log('error' + error)
                })
            } else {
                this.$message({
                    message: '请选择连接的节点',
                    type: 'warning'
                })
            }
        },
        addChart(val) {
            this.addNode = val
        },
        delChart(val) {
            if (val.isDel == 1) {
                this.delNode = val
                this.loading = true
                let data = {
                    queryData: {

                    },
                    paramsData: {
                        eventId: this.alarmId,
                        nodeId: val.id
                    }
                }
                deleteNodeAttackChain(data).then(res => {
                    this.graphDataShow = res.graphDataShow
                    // setTimeout(() => {
                    this.$refs.topologicalGraph.changeData()
                    this.loading = false
                    // }, 1500)
                    console.log('addNodeAttackChain', res)
                }).catch(error => {
                    this.loading = false
                    console.log('error' + error)
                })
            }
        },
        searchChart(val) {
            this.get_params.desIp = val.name
            setTimeout(() => {
                this.get_data()
            }, 100)
        },
        async handleSee(row) {
            this.seeForm = row
            if (this.seeForm.srcIp) {
                try {
                    let srcIpIsSpite = await getMenace({
                        queryData: {
                            value: row.srcIp
                        }
                    })
                    console.log(srcIpIsSpite)
                    this.seeForm.srcIpVenusIsSpite = srcIpIsSpite[0]
                    this.seeForm.srcIpIsSpite = srcIpIsSpite[1]
                } catch (e) {
                    console.log(e)
                }
            }
            if (this.seeForm.desIp) {
                try {
                    let desIpIsSpite = await getMenace({
                        queryData: {
                            value: row.desIp
                        }
                    })
                    // console.log(desIpIsSpite)
                    this.seeForm.desIpVenusIsSpite = desIpIsSpite[0]
                    this.seeForm.desIpIsSpite = desIpIsSpite[1]
                } catch (e) {
                    console.log(e)
                }
            }
            this.seeDialog = true
        },
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        tableRowClassName({ row, rowIndex }) {
            console.log(rowIndex)
            if (rowIndex % 2) {
                return 'table-row2'
            } else {
                return 'table-row1'
            }
        },
        nextChain(nodeDetails) {
            if (nodeDetails._cfg.model.isCheck == 1) {
                this.loading = true
                let data = {
                    queryData: {

                    },
                    paramsData: {
                        eventId: this.alarmId,
                        ip: nodeDetails._cfg.model.name,
                        time: nodeDetails._cfg.model.time,
                        nodeId: nodeDetails._cfg.model.id
                    }
                }
                nextAttackChain(data).then(res => {
                    this.graphDataShow = res.graphDataShow
                    // setTimeout(() => {
                    this.$refs.topologicalGraph.changeData()
                    this.loading = false
                    // }, 1500)
                    console.log('nextAttackChain', res)
                }).catch(error => {
                    this.loading = false
                    console.log('error' + error)
                })
            }
        },
        searchCheck() {
            this.get_params.page = 1
            setTimeout(() => {
                this.get_data()
            }, 100)
        },
        resetFun() {
            this.get_params.reportStatus = []
            this.get_params.reportName = ''
            this.get_params.reportLevel = []
            this.get_params.reportType = []
            this.get_params.srcIp = ''
            this.get_params.srcPort = ''
            this.get_params.desIp = ''
            this.get_params.desPort = ''
            this.get_params.attackResult = []
            this.get_params.reportFrom = []
            this.get_params.ruleIds = []
            this.$refs.customDate.handleRecently({ value: 3, name: '最近1天' }, 3)
            setTimeout(() => {
                this.get_data()
            }, 100)
        }
    }

}
</script>

<style lang="scss" scoped>
 $zero: #03864f;
    $one: #0052d9;
    $two: #ddd000;
    $three: #e47700;
    $fore: #e47700;
// #container {
//     width: 100%;
//     height: 400px;
//     border: 1px solid #DADEE8;
// }
.alarm-state{
        width:80px;
        height:18px;
        padding:2px 5px;
        border-radius: 11px;
        &.one{
            background-color: #fde6d8;
            color:#de7400;
        }
        &.two{
            background-color: #ccf6e4;
            color:#03864f;
        }
        &.three{
            background-color: #d5e5fa;
            color:#0052d9;
        }
        &.four{
            background-color: #fad7dd;
            color:#aa0202;
        }
    }
.title-level {
        color: $zero;
        font-size: 12px;
        border-radius: 3px;
        line-height: 1;
        padding: 2px 10px;
        margin: 0 5px;

        &.one {
            color: $one;
        }

        &.two {
            color: $two;
        }

        &.three {
            color: $three;
        }

        &.fore {
            color: $fore;
        }
    }
</style>
