<template>
    <div class="log">
        <div class="statistics">
            <div class="chart-box mb-2">
                <div class="ub ub-pj ub-ac w100 chart-top" style="padding: 5px 10px 0;box-sizing: border-box;">
                    <div class="title">最近1天告警趋势</div>
                </div>
                <div class="chart-map">
                    <!-- v-loading="load_loading1"  -->
                    <div class="ub ub-f1" style="height: 130px;" v-loading="load_loading1" element-loading-background="transparent">
                        <div v-if="load_no_data1" class="ub ub-f1 ub-ac ub-pc" style="height: 100%;font-size: 14px;color: rgb(144 147 153);">
                            暂无数据
                        </div>
                        <brokenLine v-if="load_data.length>0" :chartData="load_data" :sayTimes="sayTimes" :title="title"/>
                    </div>
                </div>
            </div>
        </div>
        <!-- 日期选项 -->
        <div class="ub ub-ac mt-1">
            <el-form :model="get_params" label-position="right">
                <!-- label="发生时间:" -->
                <el-form-item >
                    <CustomDate :append-to-body="appendToBody" :chart-time-range="chartTimeRange" @getCustomTime="getCustomTime" @getDateData="getDateData" :inputWidth="292"  @useing="customDateUse" :current-type="2" :empty="false" ref="customDate" :xiangxi="xiangxi"></CustomDate>
                </el-form-item>
            </el-form>
        </div>
        <!-- sql搜索 -->
        <div class="sql-box ub ub-pj" style="margin-top: -10px;">
            <CustomSearch ref="customSearch" :auto="true" class="ub-f1" @getData="getData" :type="1"/>
            <div class="ub ub-pe" style="width: 100px;height: 32px;">
                <Debounce :time='1500' :isDebounce="2">
                    <el-button style="min-width: 60px !important;" :loading="loading" size="small" type="primary" @click.native="searchAssets">搜 索</el-button>
                </Debounce>
            </div>
        </div>
        <!-- 过滤条件 -->
        <div style="position: relative;">
            <FilterCondition :condition-data="conditionData" style="margin-left: -16px;"/>
            <div v-if="conditionShow" class="condition-area">
                <ConditionRules
                    :select-data="listAll1"
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
        <!-- 自定义表头 -->
        <div class="ub ub-pe" style="margin-bottom: 20px;">
            <div class="set-header" @click="handleTransfer">
                <span style="margin-right: 5px;font-size: 12px;" class="iconfont icon-zidingyibiaotou"></span>
                <span>自定表头</span>
            </div>
        </div>
        <CustomTransfer :list-all="listAll" :list="list" :transfer-dialog="transferDialog" />
        <el-table
            :row-class-name="tableRowClassName"
            style="width: 100%;"
            v-loading="loading"
            ref="multipleTable"
            @expand-change="handleExpand"
            class='bigTable expert-table'
            :row-key="(row)=>{ return row.id}"
            :data="tableData"
            border
            stripe
            tooltip-effect="dark"
            :expand-row-keys="expandRowKeys">
            <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
            </el-table-column>
            <el-table-column
                v-for="(item, index) in tableList"
                :key="index"
                :label="item.name"
                min-width="140"
                sortable
                show-overflow-tooltip
                :prop="item.field">
                <template slot-scope="scope">
                    <div>
                        <el-popover
                            popper-class="add-search"
                            placement="bottom"
                            title=""
                            trigger="click"
                        >
                            <div>
                                <p
                                    v-if="item.field !== 'message' && item.field !== 'dt'"
                                    class="ub ub-ac click-btn"
                                    @click="equalVal({
                                        key: item.field,
                                        name: item.name,
                                        attrType: item.type,
                                        value:scope.row[item.field]
                                    })">
                                    <i class="el-icon-plus"></i>
                                    <span>{{ item.name }}</span>
                                    <span>=</span>
                                    <span class="val">{{scope.row[item.field]}}</span>
                                </p>
                                <p
                                    v-if="item.field !== 'message' && item.field !== 'dt'"
                                    class="ub ub-ac click-btn"
                                    style="margin: 10px 0;"
                                    @click="unequalVal({
                                        key: item.field,
                                        name: item.name,
                                        attrType: item.type,
                                        value:scope.row[item.field]
                                    })">
                                    <i class="el-icon-plus"></i>
                                    <span>{{ item.name }}</span>
                                    <span>!=</span>
                                    <span class="val">{{scope.row[item.field]}}</span>
                                </p>
                                <p
                                    @click="item.visible = false"
                                    class="ub ub-ac click-btn"
                                    v-clipboard:copy="scope.row[item.field]"
                                    v-clipboard:success="firstCopySuccess"
                                    v-clipboard:error="firstCopyError">
                                    <i class="el-icon-document-copy"></i>
                                    <span>复制</span>
                                </p>
                                <p
                                    style="margin-top: 10px;"
                                    v-if="item.field == 'srcIp' || item.field == 'desIp'"
                                    @click="jumpAsset(item, scope.row[item.field])"
                                    class="ub ub-ac click-btn">
                                    <i class="el-icon-s-promotion" style="font-size: 12px;"></i>
                                    <span>跳转到资产</span>
                                </p>
                            </div>
                            <p slot="reference" v-if="item.field==='aDate'" style="color: #00c0ff;">{{scope.row[item.field]}}</p>
                            <p slot="reference" :style="{cursor: ['srcIp', 'desIp'].includes(item.field) ? 'default' : 'default' }" v-else>{{scope.row[item.field]}}</p>
                        </el-popover>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="200" fixed="right" class-name="deepBg">
                <template slot-scope="scope">
                    <el-button @click="handleSee(scope.row)" type="text" size="small">查看</el-button>
                    <el-button @click="createPackTask(scope.row)" type="text" size="small">创建PCAP包</el-button>
                    <el-button @click="changeOption(scope.row)" type="text" size="small">发起事件</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination :total="totalData" :page.sync="get_params.page" :limit.sync="get_params.size" @pagination="get_data" />
        <el-dialog title="提示" :visible.sync="createTaskDialog" width="30%" custom-class="attendance-dialog" :modal="false">
            <span>确定创建PCAP包任务吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="createTaskDialog = false">取消</el-button>
                <el-button size="small" type="primary" @click="createTaskConfim">确认</el-button>
            </span>
        </el-dialog>
        <Alarm :alarm-dialog="alarmDialog" :select-mode='selectMode' @addAlarmSucess="addAlarmSucess" ref="drawerRef" :modal="false"></Alarm>
        <seeDetail ref="seeDetails"></seeDetail>
    </div>
</template>

<script>
import seeDetail from '@/pages/alarm_log/new_search/components/see_detail/index.vue'
import Alarm from '@/pages/alarm_log/new_search/components/alarm/index.vue'
import CustomDate from '../components/custom_date/index.vue'
import CustomSearch from '@/pages/alarm_log/new_search/components/custom_search/index'
import ConditionRules from '@/pages/alarm_log/new_search/components/ConditionRules'
import FilterCondition from '@/pages/alarm_log/new_search/components/FilterCondition'
import CustomTransfer from '@/pages/alarm_log/new_search/components/custom_transfer/index.vue'
import brokenLine from '../components/brokenLine.vue'
import {
    getExpandLog,
    getFieldByAll,
    getFilterSql,
    getList,
    getTableChart,
    createTask
} from '@/server/assets/assets_info_alarm.js'
import {
    getField,
    saveField
} from '@/server/assets/api.js'
export default {
    components: {
        seeDetail,
        CustomDate,
        CustomSearch,
        ConditionRules,
        FilterCondition,
        brokenLine,
        CustomTransfer,
        Alarm
    },
    props: {
        ipsData: {
            type: Array,
            default() {
                return []
            }
        }
        // listALL: {
        //     type: Array,
        //     default() {
        //         return []
        //     }
        // }
    },
    data() {
        return {
            expandRowKeys: [],
            expandData: [],
            expandJsonData: [],
            totalData: 0,
            title: '日志量',
            sayTimes: [],
            load_data: [],
            load_no_data1: false,
            load_loading1: false,
            transferDialog: false,
            conditionShow: false,
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
            listAll: [],
            listAll1: [],
            list1: [],
            get_params: {
                page: 1,
                size: 20,
                dataType: null,
                topId: '',
                startTime: '',
                endTime: ''
            },
            appendToBody: false,
            chartTimeRange: [],
            customTime: [],
            resetShow: false,
            dateData: '',
            dateMode: '',
            useDate: {},
            useIndex: '',
            xiangxi: '',
            sqlTermData: '',
            taskId: '',
            conditionData: [],
            loading: false,
            list: [],
            tableData: [],
            cancelObj: {
                cancel: null
            },
            createTaskDialog: false,
            sysLogListData: [
                {
                    srcIp: '',
                    desIp: '',
                    srcPort: '',
                    desPort: '',
                    aDate: '',
                    logId: ''
                }
            ],
            alarmDialog: false,
            selectMode: 0
        }
    },
    watch: {
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
        }
    },
    computed: {
        tableList() {
            console.log('this.list', this.list)
            // if (this.listALL.length > 0 && this.list.length == 0) {
            //     return this.listALL.length > 0 ? this.listALL : [{ field: 'id', name: 'ID' }]
            // } else {
            return this.list.length > 0 ? this.list : [{ field: 'id', name: 'ID' }]
            // }
        }
    },
    async created() {
        await this.initCanSelectedFileds()
        this.getStashFields()
        this.get_chart_data()
        let startTime = this.$moment().add(-1, 'days').format('YYYY-MM-DD HH:mm:ss')
        let endTime = this.$moment().format('YYYY-MM-DD HH:mm:ss')
        this.sayTimes = [startTime, endTime]
    },
    mounted() {
        // this.get_data()
    },
    methods: {
        handleTransfer() {
            this.getStashFields()
            this.transferDialog = true
        },
        handleSee(row) {
            this.$refs.seeDetails.init(row, this.list)
        },
        addAlarmSucess() {
            this.get_data()
        },
        createTaskConfim() {
            let data = {
                queryData: {},
                paramsData: {
                    sysLogList: this.sysLogListData
                }
            }
            createTask(data).then(res => {
                this.createTaskDialog = false
                this.$message.success('操作成功！')
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            })
        },
        equalVal(item) {
            console.log(item)
            let data = {
                origin: [{ connect: 'and', children: [{ field: item.key, operator: '=', value: item.value, dataType: 1, attrType: item.attrType }] }],
                msg: `((${item.name} = ${item.value}))`,
                id: Date.now() + Math.random()
            }
            this.conditionData.push(data)
            console.log(item.value)
            item.visible = false
        },
        changeOption(row) {
            this.$setlocalStorage('newSearchRowData', row)
            this.selectMode = 1
            this.alarmDialog = true
        },
        createPackTask(row) {
            // this.createTaskId = row.id
            this.sysLogListData[0].srcIp = row.srcIp
            this.sysLogListData[0].desIp = row.desIp
            this.sysLogListData[0].srcPort = row.srcPort
            this.sysLogListData[0].desPort = row.desPort
            this.sysLogListData[0].aDate = row.alarmTime
            this.sysLogListData[0].logId = row.id
            this.createTaskDialog = true
        },
        firstCopySuccess(e) {
            console.log('copy arguments e:', e)
            this.$message.success('复制成功')
        },
        firstCopyError(e) {
            console.log('copy arguments e:', e)
            this.$message.error('复制失败')
        },
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        handleExpand(row, expandedRows) {
            // this.filterKeyword()
            let that = this
            if (expandedRows.length) {
                that.expandRowKeys = []
                if (row) {
                    that.expandRowKeys.push(row.id)

                    console.log(row, '展开')
                    this.expandData = []
                    this.expandJsonData = {}
                    let data = {
                        queryData: {

                        },
                        paramsData: {
                            id: row.id,
                            logType: row.logType,
                            alarmTime: row.alarmTime
                        }
                    }
                    getExpandLog(data).then(res => {
                        let arr = []
                        let obj = {}
                        let messageObj = null
                        let alarmTimeObj = null
                        console.log(res, '展开信息')
                        for (const resKey in res) {
                            if (res[resKey] !== '') {
                                if (resKey === 'message') {
                                    messageObj = {
                                        name: '原始字段',
                                        value: res.message
                                    }
                                    continue
                                }
                                if (resKey === 'alarmTime') {
                                    alarmTimeObj = {
                                        name: '发生时间',
                                        value: res.alarmTime
                                    }
                                    continue
                                }
                                let item = this.listAll.find(it => it.field === resKey)
                                if (item) {
                                    arr.push({
                                        name: item.name,
                                        value: res[resKey]
                                    })
                                    obj[item.field] = res[resKey]
                                }
                            }
                        }
                        if (messageObj) {
                            arr.push(messageObj)
                        }
                        if (alarmTimeObj) {
                            arr.unshift(alarmTimeObj)
                        }
                        this.expandData = arr
                        this.expandJsonData = obj
                    }).then(() => {
                        if (row.nftData === 2) {
                            that.lookPcac(row)
                        }
                    }).catch(err => {
                        console.log(err)
                    })
                }
            } else {
                that.expandRowKeys = []
            }
        },
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex % 2) {
                return 'table-row2'
            } else {
                return 'table-row1'
            }
        },
        // 更新自定义表头
        editSelectFields(list) {
            console.log(list, '已选字段')
            let data = {
                queryData: {},
                paramsData: {
                    menuTag: 'assets_gj',
                    fieldIds: list.length > 0 ? list.map(item => item) : []
                }
            }
            saveField(data).then(res => {
                this.transferDialog = false
                this.$message.success('操作成功')
                this.getStashFields()
            }).catch(err => {
                console.log(err)
            })
        },
        get_chart_data() {
            this.load_loading1 = true
            this.load_no_data1 = true
            this.load_data = []
            let ipsVal = []
            if (this.ipsData.length > 0) {
                ipsVal = this.ipsData.map(item => {
                    return {
                        field: 'desIp',
                        value: item
                    }
                })
            }
            let data = {
                queryData: {},
                paramsData: {
                    inputTerm: [{ field: 'startTime', value: this.$moment().add(-1, 'days').format('YYYY-MM-DD HH:mm:ss') }, { field: 'endTime', value: this.$moment().format('YYYY-MM-DD HH:mm:ss') }, ...ipsVal],
                    sqlTerm: '',
                    filterTerm: [],
                    fields: [],
                    taskId: ''
                }
            }
            getTableChart(data).then(res => {
                // this.load_data = res.detail ?? []
                if (res.detail.length > 0) {
                    res.detail.map(item => {
                        let level = {}
                        level.value = item.num
                        level.name = item.nodeTime
                        this.load_data.push(level)
                    })
                }
                console.log('图表', this.load_data)
                this.load_loading1 = false
                this.load_no_data1 = false
            }).catch(error => {
                this.load_loading1 = false
                this.load_no_data1 = false
                console.log('error' + error)
            })
        },
        async initCanSelectedFileds() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            /* 先获取已选的字段，在获取所有字段，避免左侧抖动*/
            // this.initSelectedFileds()
            await getFieldByAll(data).then(res => {
                this.listAll1 = []
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
                        obj.field = item.field
                        obj.type = item.type
                        if (item.enums) {
                            obj.enums = item.enums
                        }
                        this.listAll1.push(obj)
                        this.listAll.push(obj)
                    })
                }
            }).then(() => {
                this.list1 = this.$lodash.cloneDeep(this.list1)
            }).catch(error => {
                console.log('error' + error)
            })
        },
        setData(val) {
            let list = []
            val.map(it => {
                this.listAll1.map(item => {
                    if (it == item.fieldId) {
                        list.push(item)
                    }
                })
            })
            console.log(list)
            return list
            // const arr3 = this.listAll1.filter((item) => {
            //     return val.some(i => item.fieldId == i)
            // })
            // return arr3
        },
        getStashFields() {
            let data = {
                queryData: {},
                paramsData: {
                    menuTag: 'assets_gj'
                }
            }
            getField(data).then(res => {
                console.log('缓存字段', res)
                this.list = this.setData(res)
                console.log('list字段', this.list)
                // this.listAll = res.allField ?? []
                // this.selectAll = res.allField.map(it => {
                //     return Object.assign({}, it, { fieldName: it.field })
                // })
                // this.list = res.logStorage ?? []
            }).then(() => {
                this.get_data()
            }).catch(err => {
                console.log(err, 'err')
            })
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
        searchAssets() {
            // this.searchLoading = true
            this.get_params.page = 1
            this.setDate()
            this.get_data()
        },
        get_data() {
            console.log(this.list)
            let list1 = []
            // if (this.listALL.length > 0 && this.list.length == 0) {
            //     list1 = this.listALL
            // } else {
            //     list1 = this.list
            // }
            this.loading = true
            let ipsVal = []
            ipsVal = [{ field: 'desIp', value: this.ipsData.join(',') }]
            // if (this.ipsData.length > 0) {
            //     ipsVal = this.ipsData.map(item => {
            //         return {
            //             field: 'desIp',
            //             value: item
            //         }
            //     })
            // }
            let data = {
                queryData: {
                    page: this.get_params.page,
                    pageSize: this.get_params.size
                },
                paramsData: {
                    inputTerm: this.customTime.length > 0 ? [{ field: 'startTime', value: this.customTime[0] }, { field: 'endTime', value: this.customTime[1] }, ...ipsVal] : ipsVal,
                    sqlTerm: this.sqlTermData,
                    filterTerm: this.conditionData.map(it => it.origin[0]),
                    fields: this.list.map(it => it.field),
                    taskId: this.taskId
                }
            }
            getList(data, this.cancelObj).then(res => {
                this.tableData = []
                return res
            }).then(res => {
                console.log('数据查询列表', res)
                this.loading = false
                let arr = res.records
                if (arr.length > 0) {
                    this.tableData = this.$lodash.cloneDeep(arr)
                } else if (arr.length === 0) {
                    if (this.get_params.page > 1) {
                        this.get_params.page = this.get_params.page - 1
                        this.get_data()
                    }
                }
                this.totalData = res.total
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
                this.$refs.customDate.handleUse()
            }
        },
        getData(val) {
            this.sqlTermData = val
            console.log('智能搜索框时间', val)
        },
        getCustomTime(val, isChartTime) {
            this.customTime = val
            if (isChartTime) {
                this.resetShow = true
            } else {
                this.resetShow = false
            }
            // if (this.$refs.tableContent.$refs.multipleTable) {
            console.log('时间变了，清空表格')
            // this.$refs.tableContent.$refs.multipleTable.clearSelection()
            // }
            console.log('时间', val)
        },
        getDateData(date, mode, useDate, useIndex) {
            this.dateData = date
            this.dateMode = mode
            this.useDate = useDate
            this.useIndex = useIndex
        },
        customDateUse() {
            // this.searchLoading = true
            this.get_params.page = 1
            // this.initCanSelectedFileds()
        }
    }
}
</script>

<style lang="scss" scoped>
.custom-star {
    .event-content {
        border: solid 1px #dadee8;
        background: transparent !important;
    }
    .chart-top {
        .title {
            color: #ffffff;
        }
    }
    .log {
        overflow-y: hidden;
        .statistics {
            width: 100%;
            height: 150px;
            border: 1px solid #1cd7fa;
            box-shadow: 0 0 7px inset #389bf7;
        }
    }
}
.log {
    ::v-deep .el-drawer__container {
        background: rgb(0 0 0 / 40%);
    }
    ::v-deep .el-dialog__wrapper {
        background: rgb(0 0 0 / 40%);
    }
}
.bigTable {
    ::v-deep .el-form-item {
        margin-bottom: 0;
    }
}
.click-btn {
    cursor: pointer;
    font-size: 12px;
    i {
        margin-right: 5px;
        color: #0052d9;
    }
    span.val {
        color: #0052d9;
    }
}
.click-btn:hover {
    background-color: #f3f3f3;
}
.chart-box {
    height: 150px;
    border-radius: 6px;
    background: rgb(56 125 238 / 5%);
    .chart-title {
        margin: 20px 10px 20px 20px;
        font-size: 12px;
    }
    .title {
        font-size: 12px;
        color: rgb(0 0 0 / 90%);
    }
}
.set-header {
    font-size: 12px;
    color: #0052d9;
    cursor: pointer;
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
        padding-bottom: 10px;
    }
}
.log {
    overflow-y: hidden;
    .statistics {
        width: 100%;
        height: 150px;
        border: 1px solid #ebf1f5;
    }
}
.log ::v-deep .time-panel-picker {
    top: 396px !important;
}
</style>
