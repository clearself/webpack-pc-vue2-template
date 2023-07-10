<template>
    <div class="home">
        <div class="plat-box">
            <div class="event overview" style="height: 100% !important;">
                <div class="w100">
                    <div class="event-content w100">
                        <div class="ub ub-pj plat-title" style="position: fixed; top: 40px; right: 20px;z-index: 999;">
                            <div></div>
                            <div class="ub">
                                <div class="timer-box"><el-checkbox size="mini" style="margin-right: 10px;" v-model="isTimeChected">60s刷新一次</el-checkbox></div>
                                <span>统计范围：</span>
                                <span style="margin-right: 10px" @click="changeWorkTime(1)" :class="{ 'change-time': this.pageDate == 1 }">周</span>
                                <span @click="changeWorkTime(2)" :class="{ 'change-time': this.pageDate == 2 }">月</span>
                            </div>
                        </div>
                        <div class="ub w100 num-statistic">
                            <div class="ub ub-f1 chart-box bg">
                                <div class="ub ub-f1 ub-pj ub-ac statistic-item">
                                    <div class="ub ub-as">
                                        <i class="iconfont icon-renwuzongliang color1"></i>
                                        <div class="ub ub-ver">
                                            <div class="text">全部工单</div>
                                            <div class="num color1">{{ allOrder }}</div>
                                        </div>
                                        <div class="ub today-num ub-ae">
                                            <div>今日</div>
                                            <div class="ub ub-ae">
                                                <i class="iconfont icon-changjiantou-xia"></i>
                                                <p>{{ todayOrder }}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="icon">
                                        <img src="../../assets/img/work_platform/tongji.png" alt="">
                                    </div>
                                </div>
                            </div>
                            <div class="ub ub-f1 chart-box bg">
                                <div class="ub ub-f1 ub-pj ub-ac statistic-item">
                                    <div class="ub ub-as">
                                        <i class="iconfont icon-yiwancheng color2"></i>
                                        <div class="ub ub-ver">
                                            <div class="text">完成工单</div>
                                            <div class="num color2">{{ finishOrder }}</div>
                                        </div>
                                        <div class="ub today-num ub-ae">
                                            <div>今日</div>
                                            <div class="ub ub-ae">
                                                <i class="iconfont icon-changjiantou-xia"></i>
                                                <p>{{ todayFinishOrder }}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="icon">
                                        <img src="../../assets/img/work_platform/wancheng.png" alt="">
                                    </div>
                                </div>
                            </div>
                            <div class="ub ub-f1 chart-box bg">
                                <div class="ub ub-f1 ub-pj ub-ac statistic-item">
                                    <div class="ub ub-as">
                                        <i class="iconfont icon-daichuli color3"></i>
                                        <div class="ub ub-ver">
                                            <div class="text">待办工单</div>
                                            <div class="num color3">{{ toDoOrder }}</div>
                                        </div>
                                        <div class="ub today-num ub-ae">
                                            <div>今日</div>
                                            <div class="ub ub-ae">
                                                <i class="iconfont icon-changjiantou-xia"></i>
                                                <p>{{ todayToDoOrder }}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="icon">
                                        <img src="../../assets/img/work_platform/daichuli.png" alt="">
                                    </div>
                                </div>
                            </div>
                            <div class="ub ub-f1 chart-box bg">
                                <div class="ub ub-f1 ub-pj ub-ac statistic-item">
                                    <div class="ub ub-as">
                                        <i class="iconfont icon-shalou color4"></i>
                                        <div class="ub ub-ver">
                                            <div class="text">超时工单</div>
                                            <div class="num color4">{{ outToDoOrder }}</div>
                                        </div>
                                        <div class="ub today-num ub-ae">
                                            <div>今日</div>
                                            <div class="ub ub-ae">
                                                <i class="iconfont icon-changjiantou-xia"></i>
                                                <p>{{ todayOutToDoOrder }}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="icon">
                                        <img src="../../assets/img/work_platform/chaoshi.png" alt="">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="ub ub-pj w100">
                            <div class="chart-box bg" style="height:350px;padding-top:15px; width: calc(75% - 5px)">
                                <div>
                                    <div class="ub ub-pj ub-ae work-title" style="box-sizing: border-box;">
                                        <div class="ub" style="padding:0 20px;box-sizing: border-box;"><div style="font-size:14px;color:rgba(0,0,0,.9)">我的待办</div></div>
                                        <div class="ub work-box">
                                            <div class="work-item" v-for="(item, index) in myWorkList.slice(0, this.screenShow)" :key="index">
                                                <el-badge :value="item.num" class="item" :hidden="!item.num">
                                                    <p class="work-type-title" :class="{ isCurrent: currentNum === item.id }"   @click="getCurrentTable(item.id)">{{ item.name }}</p>
                                                </el-badge>
                                            </div>
                                            <div v-if="myWorkList.length > this.screenShow" class="">
                                                <el-dropdown trigger="click">
                                                    <p class="el-dropdown-link" style="color: #2c3e50">
                                                        更多分类
                                                        <i class="el-icon-arrow-down el-icon--right"></i>
                                                    </p>
                                                    <el-dropdown-menu slot="dropdown" style="width: auto !important;" class="work-drop">
                                                        <el-dropdown-item v-for="(item, index) in myWorkList.slice(this.screenShow)"   :key="index">
                                                            <el-badge :value="item.num" class="item" :hidden="!item.num">
                                                                <p
                                                                    class="work-type-title"
                                                                    :class="{ isCurrent: currentNum === item.id }"
                                                                    style="color: #666"
                                                                    @click="getCurrentTable(item.id)">{{ item.name }}</p>
                                                            </el-badge>
                                                        </el-dropdown-item>
                                                    </el-dropdown-menu>
                                                </el-dropdown>
                                            </div>
                                        </div>
                                        <div class="page-box ub-f1 text-right mr-2">
                                            <el-pagination
                                                :page-size="10"
                                                :pager-count="5"
                                                @current-change="handleCurrentChange"
                                                :current-page="get_params.page"
                                                layout="prev, pager, next"
                                                :total="totalPages"
                                            ></el-pagination>
                                        </div>
                                    </div>
                                </div>
                                <div class="work-table" style="padding:0 20px;height: 284px;overflow: scroll;">
                                    <el-table ref="multipleTable" v-loading="loading" :data="tableData" :row-class-name="showRowClass" style="min-height: 0px">
                                        <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号"></el-table-column>
                                        <el-table-column prop="workOrderName" label="工单名称"></el-table-column>
                                        <el-table-column prop="name" label="当前节点">
                                            <template slot-scope="{ row }">
                                                <div>
                                                    <p v-if="row.runningNodeName.length">{{ row.runningNodeName.join(',') }}</p>
                                                    <p v-else>--</p>
                                                </div>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="currentTime" label="当前节点状态" width="100">
                                            <template slot-scope="{ row }">
                                                <div style="line-height:34px">
                                                    <div v-if="row.currentTime < row.outTime || !row.outTime" class="ub ub-ac work-state" style="background-color:#fdf6d8;">
                                                        <div class="one">待处理</div>
                                                    </div>
                                                    <div v-if="row.currentTime > row.outTime" class="ub ub-ac work-state" style="background-color:#fad7dd;">
                                                        <div class="two">已超时</div>
                                                    </div>
                                                </div>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="receiveTime" label="接收时间" width="160"></el-table-column>
                                        <el-table-column align="center" label="操作" width="80">
                                            <template slot-scope="scope">
                                                <!-- <i @click="gotoWork(scope.row)" class="operate iconfont icon-quchuli"></i> -->
                                                <el-button type="text" size="small" @click="gotoWork(scope.row)">去处理</el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </div>
                            <div class="chart-box bg" style="height:350px;padding-top:30px; width: calc(25% - 5px);">
                                <div class="ub ub-pj ub-ac w100 chart-top" style="padding:0 20px;box-sizing: border-box;"><div class="title">通知</div></div>
                                <div class="page-box ub ub-pe" style="padding:0 20px;box-sizing: border-box;position: absolute;top: 0;right:0;">
                                    <el-pagination
                                        :page-size="message.size"
                                        @current-change="handleCurrentChangeMessage"
                                        :current-page="message.page"
                                        layout="prev, pager, next"
                                        :total="totalPagesMessage"
                                    ></el-pagination>
                                </div>
                                <div class="news-box" v-loading="loading_message" style="width:100%;padding:0 20px;box-sizing: border-box;height: 306px;overflow: scroll;">
                                    <div
                                        class="news-item w100"
                                        :class="{ unread: item.status != 1 }"
                                        @click="openMessage(item)"
                                        v-for="(item, index) in newsList"
                                        :key="index"
                                        :style="{ opacity: 1 - 0.08 * index, cursor: 'pointer' }"
                                    >
                                        <div class="work-time ub ub-pj">
                                            <p class="w100" style="">工单任务</p>
                                            <p class="w100" style="text-align: right;">{{ item.create_time }}</p>
                                            <div class="point" :class="{ 'unread-point': item.status != 1 }"></div>
                                        </div>
                                        <div class="news-icon ub">
                                            <p class="left-news">
                                                {{ item.title }}
                                            </p>
                                        </div>
                                    </div>
                                    <div v-if="newsList.length == 0" class="ub ub-f1 ub-ac ub-pc" style="height:100%;color:#909399;font-size:14px; cursor: pointer;">暂无数据</div>
                                </div>
                            </div>
                        </div>
                        <div class="ub ub-pj w100">
                            <div class="chart-box bg" style="width:calc(30% - 5px);margin-top: 10px;height:320px;padding-top:30px;">
                                <div class="ub ub-pj ub-ac w100 chart-top" style="padding:0 20px;box-sizing: border-box;"><div class="title">工单类型量总计</div></div>
                                <div v-loading="loading_pie" style="width:100%;height:100%;">
                                    <div v-if="workTypeSum.length == 0" class="ub ub-f1 ub-ac ub-pc" style="height:100%;color:#909399;font-size:14px; cursor: pointer;">
                                        暂无数据
                                    </div>
                                    <pie v-if="workTypeSum.length > 0" :chartData="workTypeSum" />
                                </div>
                            </div>
                            <div class="chart-box bg" style="width:calc(70% - 5px);margin-top: 10px;height:320px;padding-top:30px;">
                                <div class="ub ub-pj ub-ac w100 chart-top" style="padding:0 20px;box-sizing: border-box;"><div class="title">工单趋势统计</div></div>
                                <div v-loading="loading_line" style="width:100%;height:100%;">
                                    <div v-if="workLineData.length == 0" class="ub ub-f1 ub-ac ub-pc" style="height:100%;color:#909399;font-size:14px; cursor: pointer;">
                                        暂无数据
                                    </div>
                                    <brokenLineMut v-if="workLineData.length > 0" :chartData="workLineData" />
                                </div>
                            </div>
                        </div>
                        <div class="ub ub-pj w100">
                            <div class="chart-box bg" style="width:calc(30% - 5px);margin-top: 10px;height:320px;padding-top:30px;">
                                <div class="ub ub-pj ub-ac w100 chart-top" style="padding:0 20px;box-sizing: border-box;"><div class="title">工单类型统计</div></div>
                                <div v-loading="loading_bar" style="width:100%;height:100%;">
                                    <div v-if="workTypeBar.length == 0" class="ub ub-f1 ub-ac ub-pc" style="height:100%;color:#909399;font-size:14px; cursor: pointer;">
                                        暂无数据
                                    </div>
                                    <bar v-if="workTypeBar.length > 0" :chartData="workTypeBar" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog title="通知" width="700px" :visible.sync="messageDetailDialog" custom-class="attendance-dialog">
            <div class="ub">
                <div class="work_plat_content" style="width: 46px;text-align: left;color: #606266">内容：</div>
                <div style="word-break: break-all; width: 560px">{{ oneMessage }}</div>
            </div>
            <div slot="footer" class="dialog-footer"><el-button size="small" @click="messageDetailDialog = false">取 消</el-button></div>
        </el-dialog>
    </div>
</template>

<script>
import {
    get_history_messages,
    get_sys_info_decoding,
    get_user_info_base,
    get_sys_info_base,
    get_three_work_num,
    get_out_work_num,
    get_work_type_num,
    get_current_workTable,
    get_message_list,
    markRead,
    get_work_trend,
    get_work_pie,
    get_work_bar
} from '@/server/work_platform/work_platform.js'
import pie from './charts/pie.vue'
import brokenLineMut from './charts/brokenLineMut.vue'
import bar from './charts/bar.vue'

export default {
    name: 'Home',
    components: {
        pie,
        brokenLineMut,
        bar
    },
    data() {
        return {
            messages: [],
            messagePageInfo: null,
            baseInfo: '',
            assetInfo: false,
            tipsData: [],
            curActive: false,
            timer: null,
            timerUpdate: null,
            timeNum: {
                week: '',
                hourMinute: '',
                dateTime: ''
            },
            sysId: '',
            logoName: '',
            decoding_tool_url: '',
            menu: [],
            userInfo: {
                cnName: ''
            },
            permissions: [],
            formLabelWidth: '120px',
            mySwiper: null,
            timer1: 0,
            timer2: 0,
            pageDate: 1,
            isTimeChected: false,

            messageDetailDialog: false,
            oneMessage: '',
            config_table_id: '',
            config_message_id: '',
            defaultOpens: [],
            activeIndex: '',
            menuData: [],
            timeStr: null,
            allOrder: 0, // 全部工单
            todayOrder: 0, // 今日新增全部工单
            finishOrder: 0, // 完成工单
            todayFinishOrder: 0, // 今日新增完成工单
            toDoOrder: 0, // 待办工单
            todayToDoOrder: 0, // 今日新增待办工单
            outToDoOrder: 0, // 超时工单
            todayOutToDoOrder: 0, // 今日新增超时工单
            myWorkList: [],
            currentNum: '',
            totalPages: 0,
            totalPagesMessage: 0,
            newsList: [],
            loading: false,
            loading_message: false,
            loading_pie: false,
            loading_line: false,
            loading_bar: false,
            tableData: [],
            workTypeSum: [],
            workLineData: [],
            workTypeBar: [],
            get_params: {
                page: 1,
                size: 10
            },
            message: {
                page: 1,
                size: 5
            },
            work_start_time: '',
            work_end_time: ''
        }
    },
    created() {},
    mounted() {
        this.$nextTick(() => {
            /*  this.get_sys_info();
            this.getSys();
            this.get_decoding_tool();*/
            this.initWork()
        })
    },
    computed: {
        screenShow() {
            if (window.screen.width > 1680) {
                return 6
            } else {
                return 3
            }
        }
    },
    beforeDestroy() {
        if (this.timerUpdate) {
            clearTimeout(this.timerUpdate)
            this.timerUpdate = null
        }
        if (this.timer) {
            clearTimeout(this.timer)
            this.timer = null
        }
    },
    watch: {
        isTimeChected: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.timerUpdate = setInterval(() => {
                        this.initWork()
                    }, 60000)
                } else {
                    if (this.timerUpdate) {
                        clearInterval(this.timerUpdate)
                        this.timerUpdate = null
                    }
                }
            }
        }
    },
    methods: {
        get_sys_info() {
            let data = {
                queryData: {},
                paramsData: {
                    sysId: 12
                }
            }
            get_sys_info_base(data)
                .then(res => {
                    console.log('33333333333333333', res)
                    this.messagePageInfo = res
                })
                .catch(error => {
                    console.log('error', error)
                })
        },
        get_decoding_tool() {
            let data = {
                queryData: {},
                paramsData: {
                    sysId: 13
                }
            }
            get_sys_info_decoding(data)
                .then(res => {
                    this.decoding_tool_url = res.url
                })
                .catch(error => {
                    console.log('error', error)
                })
        },
        checkViChange() {
            if (!document.hidden) {
                this.initTime()
            } else {
                clearInterval(this.timer)
                this.timer = null
                console.log(this.timer, 111)
            }
        },
        // initMessages(userId) {
        //     let data = {
        //         queryData: {},
        //         paramsData: {
        //             userId: userId
        //         }
        //     }
        //     get_history_messages(data)
        //         .then(res => {
        //             console.log('历史信息', res)
        //             if (res) {
        //                 this.messages = this.$deepCopy(res.data)
        //             }
        //         })
        //         .catch(error => {
        //             console.log('error', error)
        //         })
        // },
        splitArray(data, num) {
            var result = []
            for (var i = 0; i < data.length; i += num) {
                result.push(data.slice(i, i + num))
            }
            return result
        },

        initWork() {
            this.getWorkNum()
            this.getWorkTypeNum()
            this.getCurrentTable()
            this.initTime() // 初始化时间
            this.getCurrentMessage()
            this.getWorkTrend()
            this.getWorkTypeSum()
            this.getWorkTypeBar()
        },

        async gotoWork(row) {
            if (!this.$isModular('/works_order/work_task')) {
                this.$message({
                    message: '该用户没有工单任务权限',
                    type: 'warning'
                })
                return
            }
            console.log(row)
            this.$router.push({
                path: '/works_order/work_task_detail',
                query: {
                    id: row.workOrderId,
                    taskId: row.taskId,
                    designee: row.designee,
                    userNum: row.userIds ? row.userIds.length : 0,
                    type: '1'
                }
            })
            document.title = '工单任务详情'
        },
        getWorkNum() {
            get_three_work_num({ queryData: {}, paramsData: {}})
                .then(res => {
                    console.log(res, '工单数量')
                    this.allOrder = res.allOrder
                    this.todayOrder = res.todayOrder
                    this.finishOrder = res.finishOrder
                    this.todayFinishOrder = res.todayFinishOrder
                    this.toDoOrder = res.toDoOrder
                    this.todayToDoOrder = res.todayToDoOrder
                    // this.outToDoOrder = res.outToDoOrder;
                    // this.todayOutToDoOrder = res.todayOutToDoOrder;
                })
                .catch(err => {
                    console.log(err, 'err')
                })
            get_out_work_num({ queryData: {}, paramsData: {}})
                .then(res => {
                    console.log(res, '超时工单')
                    this.outToDoOrder = res.outToDoOrder
                    this.todayOutToDoOrder = res.todayOutToDoOrder
                })
                .catch(err => {
                    console.log(err, 'err')
                })
        },
        getWorkTypeNum() {
            get_work_type_num({ queryData: {}, paramsData: {}})
                .then(res => {
                    console.log(res, '列表头')
                    this.myWorkList = this.$deepCopy(res)
                })
                .catch(err => {
                    console.log(err, 'err')
                })
        },
        getCurrentTable(id = '') {
            this.currentNum = id
            this.loading = true

            let uid = (this.config_table_id = new Date().getTime())
            let data = {
                queryData: {
                    page: this.get_params.page,
                    pageSize: this.get_params.size
                },
                paramsData: {
                    workOrderObj: id
                }
            }
            get_current_workTable(data)
                .then(res => {
                    console.log(res, '当前选中表格')
                    if (this.config_table_id != uid) {
                        return
                    }
                    this.loading = false
                    this.tableData = []
                    this.totalPages = res.total
                    let content = res.records
                    if (content.length) {
                        content.forEach(item => {
                            let obj = {}
                            obj.processInstanceId = item.processInstanceId
                            obj.isNew = item.isNew
                            obj.dealType = item.dealType
                            obj.runningNodeName = item.runningNodeName
                            obj.deploymentId = item.deploymentId
                            obj.receiveTime = item.receiveTime
                            obj.currentTime = item.currentTime
                            obj.outTime = item.outTime
                            obj.name = item.name
                            obj.designee = item.designee
                            obj.userIds = item.userIds
                            obj.workOrderName = item.workOrderName
                            obj.workOrderId = item.workOrderId
                            obj.fields = item.fields
                            obj.nodeId = item.nodeId
                            obj.taskId = item.taskId
                            obj.url = item.url

                            this.tableData.push(obj)
                        })
                    }
                })
                .catch(err => {
                    console.log(err, 'err')
                    this.loading = false
                })
        },
        getCurrentMessage() {
            this.loading_message = true

            let uid = (this.config_message_id = new Date().getTime())
            let data = {
                queryData: {
                    page: this.message.page,
                    pageSize: this.message.size
                },
                paramsData: {
                    begin: this.work_start_time,
                    end: this.work_end_time
                }
            }
            get_message_list(data)
                .then(res => {
                    if (this.config_message_id != uid) {
                        return
                    }
                    console.log(res, '消息')
                    this.loading_message = false
                    this.newsList = []
                    this.totalPagesMessage = res.total
                    let list = res.records
                    if (list.length) {
                        list.forEach(item => {
                            let obj = {}
                            obj.create_time = item.create_time
                            obj.update_time = item.update_time
                            obj.create_user = item.create_user
                            obj.receive_user = item.receive_user
                            obj.mes = item.mes
                            obj.id = item.id
                            obj.title = item.title
                            obj.status = item.status
                            this.newsList.push(obj)
                        })
                    }
                })
                .catch(err => {
                    this.loading_message = false
                    console.log(err)
                })
        },
        getWorkTrend() {
            this.loading_line = true

            let data = {
                begin: this.work_start_time,
                end: this.work_end_time
            }
            const data1 = {
                paramsData: data,
                queryData: {}
            }
            get_work_trend(data1)
                .then(res => {
                    console.log(res, '折线图')
                    this.loading_line = false
                    this.workLineData = []

                    setTimeout(() => {
                        this.workLineData = this.$deepCopy(res.workLineData)
                    }, 50)
                })
                .catch(err => {
                    this.loading_line = false
                    console.log(err)
                })
        },
        getWorkTypeSum() {
            this.loading_pie = true

            let data = {
                begin: this.work_start_time,
                end: this.work_end_time
            }
            const data1 = {
                paramsData: data,
                queryData: {}
            }
            get_work_pie(data1)
                .then(res => {
                    console.log(res, '饼图')
                    this.loading_pie = false
                    this.workTypeSum = []
                    setTimeout(() => {
                        if (res.workTypeSum.length) {
                            this.workTypeSum = res.workTypeSum.map(item => {
                                return {
                                    // id: item.id,
                                    name: item.name,
                                    value: item.num
                                }
                            })
                        }
                    }, 50)
                })
                .catch(err => {
                    this.loading_pie = false
                    console.log(err)
                })
        },
        getWorkTypeBar() {
            this.loading_bar = true

            let data = {
                begin: this.work_start_time,
                end: this.work_end_time
            }
            const data1 = {
                paramsData: data,
                queryData: {}
            }
            get_work_bar(data1)
                .then(res => {
                    console.log(res, '柱形图')
                    this.loading_bar = false
                    this.workTypeBar = []
                    setTimeout(() => {
                        this.workTypeBar = this.$deepCopy(res.workTypeBar)
                    }, 50)
                })
                .catch(err => {
                    this.loading_bar = false
                    console.log(err)
                })
        },
        openMessage(item) {
            this.messageDetailDialog = true
            console.log(item)
            this.oneMessage = item.mes
            if (item.status != 1) {
                item.status = 1
                let obj = {
                    id: item.id
                }
                const data = {
                    paramsData: obj,
                    queryData: {}
                }
                markRead(data)
                    .then(res => {
                        console.log(res)
                    })
                    .catch(err => {
                        console.log(err + 'err')
                    })
            }
        },
        initTime() {
            this.work_start_time = this.work_start_time || this.getStartDayOfWeek()
            this.work_end_time = this.work_end_time || this.getEndDayOfWeek()
        },
        changeWorkTime(type = 1) {
            this.pageDate = type
            if (type == 1) {
                this.work_start_time = this.getStartDayOfWeek()
                this.work_end_time = this.getEndDayOfWeek()
            } else if (type == 2) {
                this.work_start_time = this.getStartDayOfMonth()
                this.work_end_time = this.getEndDayOfMonth()
            }

            this.getNewData()
        },
        getNewData() {
            this.getCurrentMessage()
            this.getWorkTrend()
            this.getWorkTypeSum()
            this.getWorkTypeBar()
        },
        twoStr(n) {
            return n < 10 ? '0' + n : n
        },
        getStartDayOfWeek() {
            var now = new Date() // 当前日期
            var nowDayOfWeek = now.getDay() // 今天本周的第几天
            var nowDay = now.getDate() // 当前日
            var nowMonth = now.getMonth() // 当前月
            var nowYear = now.getYear() // 当前年
            nowYear += nowYear < 2000 ? 1900 : 0
            var day = nowDayOfWeek || 7
            return this.formatDate(new Date(now.getFullYear(), nowMonth, nowDay + 1 - day))
        },
        getEndDayOfWeek() {
            var now = new Date() // 当前日期
            var nowDayOfWeek = now.getDay() // 今天本周的第几天
            var nowDay = now.getDate() // 当前日
            var nowMonth = now.getMonth() // 当前月
            var nowYear = now.getYear() // 当前年
            nowYear += nowYear < 2000 ? 1900 : 0
            var day = nowDayOfWeek || 7
            return this.formatDate(new Date(now.getFullYear(), nowMonth, nowDay + 7 - day))
        },
        getStartDayOfMonth() {
            var now = new Date() // 当前日期
            var nowDayOfWeek = now.getDay() // 今天本周的第几天
            var nowDay = now.getDate() // 当前日
            var nowMonth = now.getMonth() // 当前月
            var nowYear = now.getYear() // 当前年
            nowYear += nowYear < 2000 ? 1900 : 0
            var monthStartDate = new Date(nowYear, nowMonth, 1)
            return this.formatDate(monthStartDate)
        },
        getEndDayOfMonth() {
            var now = new Date() // 当前日期
            var nowDayOfWeek = now.getDay() // 今天本周的第几天
            var nowDay = now.getDate() // 当前日
            var nowMonth = now.getMonth() // 当前月
            var nowYear = now.getYear() // 当前年
            nowYear += nowYear < 2000 ? 1900 : 0
            var monthEndDate = new Date(nowYear, nowMonth, this.getMonthDays())
            return this.formatDate(monthEndDate)
        },
        getMonthDays() {
            var now = new Date() // 当前日期
            var nowDayOfWeek = now.getDay() // 今天本周的第几天
            var nowDay = now.getDate() // 当前日
            var nowMonth = now.getMonth() // 当前月
            var nowYear = now.getYear() // 当前年
            nowYear += nowYear < 2000 ? 1900 : 0
            var monthStartDate = new Date(nowYear, nowMonth, 1)
            var monthEndDate = new Date(nowYear, nowMonth + 1, 1)
            var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24)
            return days
        },
        formatDate(date) {
            var myyear = date.getFullYear()
            var mymonth = date.getMonth() + 1
            var myweekday = date.getDate()

            if (mymonth < 10) {
                mymonth = '0' + mymonth
            }
            if (myweekday < 10) {
                myweekday = '0' + myweekday
            }
            return myyear + '-' + mymonth + '-' + myweekday
        },
        handleCurrentChange(val) {
            this.get_params.page = val
            console.log(this.currentNum)
            this.getCurrentTable(this.currentNum)
        },
        handleCurrentChangeMessage(val) {
            this.message.page = val
            this.getCurrentMessage()
        },
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        showRowClass({ rowIndex }) {
            let val = rowIndex % 10
            return 'rowBg' + val
        }
    }
}
</script>

<style lang="scss" scoped>
.work-state{
    width: 80px;
    height: 16px;
    border-radius: 8px;
    line-height: 16px;
    margin-top:9px;
    padding-left:20px;
    .one{
        // background-color: #fdf6d8;
        color:#de7400;
    }
    .two{
        // background-color: #fad7dd;
        color: #aa0202;
    }
}
.plat-box {
    /* position: absolute;
    left: 0px;
    top: 0px;
    right: 0px;
    bottom: 20px;*/
    /*z-index: 1;*/
    min-width: 950px;
    /*overflow-y: auto;*/
    ::v-deep .el-table th.el-table__cell.is-leaf {
        border-bottom: none !important;
    }
}
$zero: #7efcfb;
$one: #00c7ff;
$two: #fdfe7f;
$three: #fc7f00;
$fore: #fd0001;
$status1: #ffdd00;
$status2: #01ff01;
$status3: #00e1fd;
$status4: #e1e2e4;
.num-statistic > div {
    height: 80px;
    margin-right: 20px;
    margin-bottom: 10px;
}

.num-statistic > div:last-child {
    margin-right: 0px;
}

.chart-box {
    position: relative;
    box-shadow: 0px 2px 8px 0px rgba(140, 152, 164, 0.2);
    border-radius: 4px;
}

.chart-box.border {
    border: 1px solid #00274e;
}

.chart-box.bg {
    position: relative;
    background: #fff;
}

.statistic-item > .icon {
    i {
        font-size: 40px !important;
        color: #fff;
    }
}

.statistic-item .text {
    font-size: 14px;
    color: #8b8b8b;
    text-indent: 2px;
}

.statistic-item .num {
    margin-top: 10px;
    font-size: 24px;
    line-height: 26px;
    color: #fff;
}

.chart-top {
    position: absolute;
    left: 0;
    top: 0;
    height: 30px;
    .title {
        color: rgba(0, 0, 0, 0.9);
        font-size: 14px;
    }
    .options {
        font-size: 0;
    }
    .options > div {
        display: inline-block;
        padding: 0 8px;
        color: #666;
        font-size: 12px;
        cursor: pointer;
    }
    .options > div.active {
        color: #fff;
    }
}

.title-level {
    border: 1px solid $zero;
    background: rgba($zero, 0.2);
    color: $zero;
    font-size: 12px;
    border-radius: 3px;
    line-height: 1;
    padding: 2px 10px;
    margin: 0 5px;
    &.one {
        border-color: $one;
        background: rgba($one, 0.2);
        color: $one;
    }
    &.two {
        border-color: $two;
        background: rgba($two, 0.2);
        color: $two;
    }
    &.three {
        border-color: $three;
        background: rgba($three, 0.2);
        color: $three;
    }
    &.fore {
        border-color: $fore;
        background: rgba($fore, 0.2);
        color: $fore;
    }
}

.title-status {
    border: 1px solid $status1;
    background: $status1;
    color: #fff;
    font-size: 12px;
    border-radius: 3px;
    line-height: 1;
    padding: 2px 10px;
    &.one {
        border-color: $status2;
        background: $status2;
    }
    &.two {
        border-color: $status3;
        background: $status3;
    }
    &.three {
        border-color: $status4;
        background: $status4;
    }
    .chart-title {
        margin: 20px 0 20px 20px;
    }
}

.text-color {
    color: #fff;
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
    height: calc(100% - 53px);
    overflow-y: auto;
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
    background: rgba(0, 0, 0, 0.3);
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
            color: #f56c6c;
        }
    }
}

.event::v-deep.el-range-input {
    background-color: rgba(0, 0, 0, 0);
    color: #fff;
}

.event::v-deep.el-range-separator {
    color: #fff;
}

.event::v-deep.el-radio__label,
.event::v-deep.el-checkbox__label {
    color: #fff;
}

.bigTable {
    ::v-deep.caret-wrapper {
        height: 22px;
    }
    ::v-deep.sort-caret.ascending {
        border-bottom-color: #fff;
        top: 0;
    }
    ::v-deep.sort-caret.descending {
        border-top-color: #fff;
        bottom: 0;
    }
    ::v-deep.descending .sort-caret.descending {
        border-top-color: #01fdfe;
    }
    ::v-deep.ascending .sort-caret.ascending {
        border-bottom-color: #01fdfe;
    }
}

.div-table {
    color: #fff;
    border: 1px solid #1a5c92;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    .table-title {
        line-height: 48px;
        padding: 0 30px;
        border-bottom: 1px solid #1a5c92;
        background: rgba(29, 65, 105, 0.5);
    }
    dl {
        position: relative;
        line-height: 46px;
        height: 46px;
        background: rgba(3, 50, 84, 0.5);
        box-shadow: 0 0 3px rgba(0, 186, 255, 0.73) inset;
        border-bottom: 1px solid #1a5c92;
        dt {
            position: absolute;
            width: 50%;
            padding: 0 30px;
            border-right: 1px solid #1a5c92;
            box-sizing: border-box;
        }
        dd {
            padding-left: calc(50% + 30px);
        }
        &:nth-child(2n + 1) {
            background: rgba(29, 65, 105, 0.5);
        }
    }
}

.search-box {
    margin: 60px 0 20px;
}

.chart-row {
    position: relative;
    padding-left: 380px;
    .chart-left {
        position: absolute;
        left: 0;
        top: 0;
        width: 340px;
    }
}

.statistic-item {
    .iconfont {
        font-size: 14px;
        display: inline-block;
        height: 19px;
        line-height: 19px;
        margin-left: 20px;
        margin-right: 6px;
    }
}
.statistic-item .color1 {
    color: #8b8b8b;
}

.statistic-item .color2 {
    color: #387dee;
}

.statistic-item .color3 {
    color: #f2995f;
}

.statistic-item .color4 {
    color: #bd50d3;
}

span.change-time {
    color: #0052d9 !important;
}

.plat-title {
    height: 40px;
    line-height: 40px;
    div:nth-child(1) {
        font-size: 14px;
        margin-left: -2px;
        color: #fff;
    }
    div:nth-child(2) {
        margin-right: -2px;
        font-size: 12px;
        color: #1cd7fa;
    }
    span {
        color: #666;
        cursor: pointer;
    }
    span:nth-child(1) {
        margin-right: 20px;
    }
}
.today-num {
    margin-left: 18px;
    div {
        font-size: 12px;
        color: rgba(0, 0, 0, 0.4);

        i,
        p {
            color: #e34d59;
        }
        i {
            transform: rotate(180deg);
            display: inline-block;
            margin: 0!important;
        }
    }
    vertical-align: bottom;
}
.work-title {
    height: 30px;
    line-height: 30px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    margin-bottom: 10px;

    ::v-deep .el-badge__content {
        border: none;
    }
}
.work-box {
    .work-item {
        margin-right: 24px;
        height: 100%;
    }
    p {
        color: #666;
        font-size: 14px;
        cursor: pointer;
    }
}
.page-box {
    height: 30px;
    line-height: 30px;

    ::v-deep .el-pagination {
        background: transparent;
        font-weight: normal;

        .btn-next,
        .btn-prev,
        .el-pager li {
            background-color: transparent;
            color: #666;
            min-width: 26px;
        }
        .btn-next:hover,
        .btn-prev:hover,
        .el-pager li:hover,
        .el-pager li.active {
            color: #0052d9;
        }
    }
}
.work-table {
    ::v-deep .el-table {
        background: transparent;
        position: relative;

        .el-table__header-wrapper {
            border-radius: 3px;
            margin-bottom: 6px;
            .cell {
                font-weight: 400;
            }
        }
        .el-table__header tr {
            background: transparent;
            background-color: rgba(56, 125, 238, 0.1);
        }
        .cell {
            height: 34px !important;
            line-height: 34px;
            color: rgba(0, 0, 0, 0.9);
        }
        td {
            padding: 0;
            line-height: 34px;
        }
        th {
            padding: 0;
            color: rgba(0, 0, 0, 0.9);
            background-color: transparent;
            font-size: 12px;
        }
        th.is-leaf {
            border-color: transparent;
        }
        tr {
            position: relative !important;
            // &:hover {
            //     background-color: #fff;
            // }
            td {
                // border: none;
                border-bottom: 6px solid #fff !important;
                .operate {
                    cursor: pointer;
                    color: #387dee;
                }
            }
            td:first-child {
                border-radius: 4px 0 0 4px;
            }
            td:last-child {
                border-radius: 0px 4px 4px 0;
            }
            background: #f3f3f3;
        }
        .el-table__body-wrapper {
            tr {
                &:hover {
                    background-color: #fff;
                }
            }
        }
    }
    ::v-deep .el-table::before {
        background: rgba(0, 168, 255, 0.2);
        left: 2px;
        right: 2px;
    }
    ::v-deep .el-table--enable-row-hover .el-table__body tr:hover > td {
        background: transparent !important;
    }
}
.news-box {
    color: rgba(0, 0, 0, 0.9);
    overflow: hidden;
    .news-item {
        background: rgba(243, 243, 243, 0.5);
        border-radius: 4px;
        padding: 14px 10px 14px 26px;
        box-sizing: border-box;
        height: 70px;
        font-size: 12px;
        margin-bottom: 6px;
        position: relative;

        .news-icon {
            p {
                color: rgba(0, 0, 0, 0.9);
            }
            .left-news {
                max-width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                height: 22px;
                line-height: 22px;
                color: rgba(0, 0, 0, 0.9);
                font-size: 14px;
            }
        }
        .work-time {
            height: 20px;
            line-height: 20px;
            color: rgba(0, 0, 0, 0.4);
            position: relative;
            .point {
                position: absolute;
                left: -16px;
                top: 7px;
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background-color: #a6a6a6;;
            }
            .unread-point {
                background-color: #387dee;
            }
        }
    }
    .news-item.unread {
        background-color: rgba(56, 125, 238, .05);
    }
}
.timer-box ::v-deep .el-checkbox__label {
    font-size: 12px;
    color: #666;
}
.timer-box ::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #0052d9;
}
</style>
<style>
.work-type-title:hover {
    color: #0052d9 !important;
}
.work-type-title.isCurrent {
    color: #0052d9 !important;
}
</style>
