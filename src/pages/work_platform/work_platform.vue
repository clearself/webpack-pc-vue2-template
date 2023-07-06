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
                                <span style="margin-right: 10px;" @click="changeWorkTime(1)" :class="{ 'change-time': this.pageDate == 1 }">周</span>
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
                                    <div class="icon"><img src="../../assets/img/work_platform/tongji.png" alt="" /></div>
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
                                    <div class="icon"><img src="../../assets/img/work_platform/wancheng.png" alt="" /></div>
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
                                    <div class="icon"><img src="../../assets/img/work_platform/daichuli.png" alt="" /></div>
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
                                    <div class="icon"><img src="../../assets/img/work_platform/chaoshi.png" alt="" /></div>
                                </div>
                            </div>
                        </div>
                        <div class="ub ub-pj w100">
                            <div class="chart-box bg" style="padding-top: 15px; width: calc(75% - 5px);height: 350px;">
                                <div>
                                    <div class="ub work-title" style="box-sizing: border-box;">
                                        <div class="ub work-title-todo" style="padding: 0 20px;box-sizing: border-box;"><div style="font-size: 14px;color: rgb(0 0 0 / 90%);">我的待办</div></div>
                                        <div class="ub work-box">
                                            <div class="work-item">
                                                <el-badge class="item">
                                                    <p class="work-type-title" :class="{ isCurrent: currentNum === '' }" @click="getCurrentTable('')">工单</p>
                                                </el-badge>
                                            </div>
                                        </div>
                                        <div class="ub-f1"></div>
                                        <div class="ub ub-pe workOrderType">
                                            <el-form v-if="workOrderType">
                                                <el-form-item label="工单类型：" label-width="80px">
                                                    <el-select placeholder="请选择" style="width: 150px;" v-model="type" size="small"  @change="changType" clearable>
                                                        <el-option  v-for="(item, index) in myWorkList.slice(0, this.screenShow)" :key="index" :label="item.name" :value="item.id"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-form>
                                            <div class="page-box text-right mr-2 ml-2">
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
                                </div>
                                <div v-if="currentNum != 'securityReview' && currentNum != '111111'" class="work-table" style="overflow: scroll;padding: 0 20px;height: 284px;">
                                    <el-table ref="multipleTable" v-loading="loading" :data="tableData" :row-class-name="showRowClass" style="min-height: 0;">
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
                                                <div style="line-height: 34px;">
                                                    <div v-if="row.currentTime < row.outTime || !row.outTime" class="ub ub-ac work-state" style="background-color: #fdf6d8;">
                                                        <div class="one">待处理</div>
                                                    </div>
                                                    <div v-if="row.currentTime > row.outTime" class="ub ub-ac work-state" style="background-color: #fad7dd;">
                                                        <div class="two">已超时</div>
                                                    </div>
                                                </div>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="receiveTime" label="接收时间" width="160"></el-table-column>
                                        <el-table-column align="center" label="操作" width="80">
                                            <template slot-scope="scope">
                                                <!-- <i @click="gotoWork(scope.row)" class="operate iconfont icon-quchuli"></i> -->
                                                <el-button type="text" size="small" @click="gotoWork(scope.row)" >去处理</el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                                <div v-if="currentNum == 'securityReview'" class="work-table" style="overflow: scroll;padding: 0 20px;height: 284px;">
                                    <el-table ref="multipleTable" v-loading="loading" :data="tableData" :row-class-name="showRowClass" style="min-height: 0;">
                                        <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号"></el-table-column>
                                        <el-table-column prop="taskName" label="任务名称"></el-table-column>
                                        <el-table-column prop="time" label="任务起止时间" width="260"></el-table-column>
                                        <el-table-column align="center" label="操作" width="80">
                                            <template slot-scope="scope">
                                                <el-button :disabled="new Date().getTime() > new Date(scope.row.endDate + ' 23:59:59').getTime() || new Date().getTime() < new Date(scope.row.startDate).getTime()" type="text" size="small" @click="gotoSecurity(scope.row)">去处理</el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                                <div v-if="currentNum == '111111'" class="work-table" style="overflow: scroll;padding: 0 20px;height: 284px;">
                                    <el-table ref="multipleTable" v-loading="loading" :data="tableData" :row-class-name="showRowClass" style="min-height: 0;">
                                        <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号"></el-table-column>
                                        <el-table-column prop="autoName" label="任务名称"></el-table-column>
                                        <el-table-column prop="time" label="任务起止时间" width="300"></el-table-column>
                                        <el-table-column prop="mission" label="状态" width="120" align="left">
                                            <template slot-scope="scope">
                                                <div style="line-height: 34px;">
                                                    <div v-if="new Date(scope.row.tillTime).getTime() > new Date().getTime()" class="ub ub-ac work-state" style="background-color: #ccf5e4;">
                                                        <div class="one" style="color: #03864f !important;">进行中</div>
                                                    </div>
                                                    <div v-else-if="new Date(scope.row.tillTime).getTime() < new Date().getTime()" class="ub ub-ac work-state" style="background-color: #fad7dd;">
                                                        <div class="two">已超时</div>
                                                    </div>
                                                    <div v-else  class="ub ub-ac work-state" style="background-color: #ccf5e4;">
                                                        <div class="one" style="color: #03864f !important;">进行中</div>
                                                    </div>
                                                </div>
                                            </template>
                                        </el-table-column>
                                        <el-table-column align="center" label="操作" width="80">
                                            <template slot-scope="scope">
                                                <el-button type="text" size="small" @click="gotoAuto(scope.row)">去处理</el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </div>
                            <div class="chart-box bg" style="padding-top: 30px; width: calc(25% - 5px);height: 350px;">
                                <div class="ub ub-pj ub-ac w100 chart-top" style="padding: 0 20px;box-sizing: border-box;"><div class="title">通知</div></div>
                                <div class="page-box ub ub-pe" style="position: absolute;top: 0;right: 0;padding: 0 20px;box-sizing: border-box;">
                                    <el-pagination
                                        :page-size="message.size"
                                        @current-change="handleCurrentChangeMessage"
                                        :current-page="message.page"
                                        layout="prev, pager, next"
                                        :total="totalPagesMessage"
                                    ></el-pagination>
                                </div>
                                <div class="tabs">
                                    <span class="tab" :class="{'active-message': readStatus == 0}" @click="changeStatus(0)">未读</span>
                                    <span class="tab" :class="{'active-message': readStatus == 1}" @click="changeStatus(1)">已读</span>
                                </div>
                                <div class="news-box" v-loading="loading_message" style="overflow: scroll;padding: 0 20px;width: 100%;height: 278px;box-sizing: border-box;">
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
                                            <!-- <div class="point" :class="{ 'unread-point': item.status != 1 }"></div> -->
                                        </div>
                                        <div class="news-icon ub">
                                            <p class="left-news">{{ item.title }}</p>
                                        </div>
                                    </div>
                                    <div v-if="newsList.length == 0" class="ub ub-f1 ub-ac ub-pc" style="height: 100%;font-size: 14px;color: #909399; cursor: pointer;">暂无数据</div>
                                </div>
                            </div>
                        </div>
                        <div class="ub ub-pj w100">
                            <div class="chart-box bg" style="margin-top: 10px;padding-top: 30px;width: calc(30% - 5px);height: 320px;">
                                <div class="ub ub-pj ub-ac w100 chart-top" style="padding: 0 20px;box-sizing: border-box;"><div class="title">工单类型量总计</div></div>
                                <div v-loading="loading_pie" style="width: 100%;height: 100%;">
                                    <div v-if="workTypeSum.length == 0" class="ub ub-f1 ub-ac ub-pc" style="height: 100%;font-size: 14px;color: #909399; cursor: pointer;">
                                        暂无数据
                                    </div>
                                    <pie v-if="workTypeSum.length > 0" :chartData="workTypeSum" />
                                </div>
                            </div>
                            <div class="chart-box bg" style="margin-top: 10px;padding-top: 30px;width: calc(70% - 5px);height: 320px;">
                                <div class="ub ub-pj ub-ac w100 chart-top" style="padding: 0 20px;box-sizing: border-box;"><div class="title">工单趋势统计</div></div>
                                <div v-loading="loading_line" style="width: 100%;height: 100%;">
                                    <div v-if="workLineData.length == 0" class="ub ub-f1 ub-ac ub-pc" style="height: 100%;font-size: 14px;color: #909399; cursor: pointer;">
                                        暂无数据
                                    </div>
                                    <brokenLineMut v-if="workLineData.length > 0" :chartData="workLineData" />
                                </div>
                            </div>
                        </div>
                        <div class="ub ub-pj w100">
                            <div class="chart-box bg" style="margin-top: 10px;padding-top: 30px;width: calc(30% - 5px);height: 320px;">
                                <div class="ub ub-pj ub-ac w100 chart-top" style="padding: 0 20px;box-sizing: border-box;"><div class="title">工单类型统计</div></div>
                                <div v-loading="loading_bar" style="width: 100%;height: 100%;">
                                    <div v-if="workTypeBar.length == 0" class="ub ub-f1 ub-ac ub-pc" style="height: 100%;font-size: 14px;color: #909399; cursor: pointer;">
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
                <div class="work_plat_content" style="width: 46px;text-align: left;color: #606266;">内容：</div>
                <div style="word-break: break-all; width: 560px;">{{ oneMessage }}</div>
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
    get_work_bar,
    getSafetyTask,
    getAutoTask
} from '@/server/work_platform/work_platform.js'
import pie from './charts/pie.vue'
import brokenLineMut from './charts/brokenLineMut.vue'
import bar from './charts/bar.vue'

import { accAdd } from '@/assets/js/public_fun.js'
export default {
    name: 'Home',
    components: {
        pie,
        brokenLineMut,
        bar
    },
    data() {
        return {
            workOrderType: false,
            type: '',
            readStatus: 0,
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
    created() {
    },
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
                return 7
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
        changType(val) {
            console.log(val)
            this.getCurrentTable(val, 'selChange')
        },
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
            if (row.workOrderObj != '6') {
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
                // document.title = '工单任务详情'
            } else if (row.workOrderObj == '6') {
                this.$router.push({
                    path: '/safe_notice/list',
                    query: {
                        id: row.workOrderId
                    }
                })
                // document.title = '通知公告'
            }
        },
        gotoSecurity(row) {
            if (!this.$isModular('/safety_review/task_fill')) {
                this.$message({
                    message: '该用户没有安全审查任务填报权限',
                    type: 'warning'
                })
                return
            }
            this.$router.push({
                path: '/safety_review/task_fill',
                query: {
                    type: '1',
                    id: row.id
                }
            })
        },
        gotoAuto(row) {
            if (!this.$isModular('/auto_respond/execution_list')) {
                this.$message({
                    message: '该用户没有自动化响应填报权限',
                    type: 'warning'
                })
                return
            }
            let atdata = this.$getsessionStorage('autoResponseData') || {}
            atdata[row.autoOrderId] = JSON.stringify(row)
            this.$setsessionStorage('autoResponseData', atdata)
            console.log(atdata)
            this.$router.push({
                path: '/auto_respond/execution_list',
                query: {
                    id: row.autoOrderId
                }
            })
        },
        getWorkNum() {
            get_three_work_num({
                queryData: {},
                paramsData: {}
            })
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
            get_out_work_num({
                queryData: {},
                paramsData: {}
            })
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
            get_work_type_num({
                queryData: {},
                paramsData: {}
            })
                .then(res => {
                    console.log(res, '列表头')
                    if (res) {
                        this.myWorkList = this.$deepCopy(res)
                    }
                })
                .catch(err => {
                    console.log(err, 'err')
                })
        },
        getCurrentTable(id = '', tp) {
            if (id != '111111') {
                this.workOrderType = true
                // this.type = ''
            } else {
                if (tp != 'selChange') {
                    this.workOrderType = false
                }
                // this.type = id
            }
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
            if (id == '111111') {
                // 自动化响应，特殊处理
                getAutoTask(data).then(res => {
                    if (this.config_table_id != uid) {
                        return
                    }
                    this.loading = false
                    this.totalPages = res ? res.total : 0
                    this.tableData = res ? res.records : []
                    this.tableData.forEach(item => {
                        item.time = `${item.runningTime}~${item.tillTime}`
                    })
                })
            } else {
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
                                obj.workOrderObj = item.workOrderObj
                                obj.url = item.url
                                this.tableData.push(obj)
                            })
                        }
                    })
                    .catch(err => {
                        console.log(err, 'err')
                        this.loading = false
                    })
            }
        },
        getSecurityReview() {
            this.currentNum = 'securityReview'
            this.workOrderType = false
            this.loading = true
            let data = {
                queryData: {
                    page: this.get_params.page,
                    pageSize: this.get_params.size
                },
                paramsData: {}
            }
            getSafetyTask(data)
                .then(res => {
                    this.loading = false
                    this.totalPages = res ? res.total : 0
                    this.tableData = res ? res.records : []
                    this.tableData.forEach(item => {
                        item.time = `${item.startDate}~${item.endDate}`
                    })
                })
                .catch(err => {
                    console.log(err, 'err')
                    this.loading = false
                })
        },
        changeStatus(status) {
            this.readStatus = status
            this.message.page = 1
            this.getCurrentMessage()
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
                    end: this.work_end_time,
                    status: this.readStatus
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
                            obj.create_time = item.createTime
                            obj.update_time = item.updateTime
                            obj.create_user = item.createUser
                            obj.receive_user = item.receiveUser
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
                    if (res) {
                        setTimeout(() => {
                            this.workLineData = this.$deepCopy(res.workLineData)
                        }, 50)
                    }
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
                        if (res && res.workTypeSum.length) {
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
                    if (res) {
                        setTimeout(() => {
                            this.workTypeBar = this.$deepCopy(res.workTypeBar)
                        }, 50)
                    }
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
            if (this.currentNum != 'securityReview') {
                this.getCurrentTable(this.currentNum)
            } else {
                this.getSecurityReview()
            }
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
.workOrderType {
    ::v-deep .el-form-item__label {
        line-height: 32px !important;
    }
}
.tabs {
    margin-bottom: 10px;
    padding: 0 20px;
    .tab {
        display: inline-block;
        margin-right: 10px;
        padding-bottom: 4px;
        font-size: 14px;
        cursor: pointer;
    }
    .active-message {
        border-bottom: 2px solid #387dee;
        color: #387dee;
    }
}
.work-state {
    margin-top: 9px;
    padding-left: 20px;
    width: 80px;
    height: 16px;
    border-radius: 8px;
    line-height: 16px;
    .one {
        // background-color: #fdf6d8;
        color: #de7400;
    }
    .two {
        // background-color: #fad7dd;
        color: #aa0202;
    }
}
.plat-box {
    /* position: absolute;
    left: 0px;
    top: 0px;
    right: 0px;
    bottom: 20px; */

    /* z-index: 1; */
    min-width: 950px;

    /* overflow-y: auto; */
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
    margin-right: 20px;
    margin-bottom: 10px;
    height: 80px;
}
.num-statistic > div:last-child {
    margin-right: 0;
}
.chart-box {
    position: relative;
    border-radius: 4px;
    box-shadow: 0 2px 8px 0 rgb(140 152 164 / 20%);
}
.chart-box.border {
    border: 1px solid #00274e;
}
.chart-box.bg {
    position: relative;
    background: #ffffff;
}
.statistic-item > .icon {
    i {
        font-size: 40px !important;
        color: #ffffff;
    }
}
.statistic-item .text {
    font-size: 14px;
    text-indent: 2px;
    color: #8b8b8b;
}
.statistic-item .num {
    margin-top: 10px;
    font-size: 24px;
    line-height: 26px;
    color: #ffffff;
}
.chart-top {
    position: absolute;
    top: 0;
    left: 0;
    height: 30px;
    .title {
        font-size: 14px;
        color: rgb(0 0 0 / 90%);
    }
    .options {
        font-size: 0;
    }
    .options > div {
        display: inline-block;
        padding: 0 8px;
        font-size: 12px;
        color: #666666;
        cursor: pointer;
    }
    .options > div.active {
        color: #ffffff;
    }
}
.title-level {
    margin: 0 5px;
    padding: 2px 10px;
    font-size: 12px;
    border: 1px solid $zero;
    border-radius: 3px;
    color: $zero;
    background: rgba($zero, 0.2);
    line-height: 1;
    &.one {
        border-color: $one;
        color: $one;
        background: rgba($one, 0.2);
    }
    &.two {
        border-color: $two;
        color: $two;
        background: rgba($two, 0.2);
    }
    &.three {
        border-color: $three;
        color: $three;
        background: rgba($three, 0.2);
    }
    &.fore {
        border-color: $fore;
        color: $fore;
        background: rgba($fore, 0.2);
    }
}
.title-status {
    padding: 2px 10px;
    font-size: 12px;
    border: 1px solid $status1;
    border-radius: 3px;
    color: #ffffff;
    background: $status1;
    line-height: 1;
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
    color: #ffffff;
}
.el-input.ips {
    display: block;
    width: 100%;
}
.el-link {
    cursor: pointer;
}
.drawer-pad {
    overflow-y: auto;
    padding: 0 20px;
    height: calc(100% - 53px);
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
.event::v-deep.el-range-input {
    color: #ffffff;
    background-color: rgb(0 0 0 / 0%);
}
.event::v-deep.el-range-separator {
    color: #ffffff;
}
.event::v-deep.el-radio__label,
.event::v-deep.el-checkbox__label {
    color: #ffffff;
}
.bigTable {
    ::v-deep.caret-wrapper {
        height: 22px;
    }
    ::v-deep.sort-caret.ascending {
        top: 0;
        border-bottom-color: #ffffff;
    }
    ::v-deep.sort-caret.descending {
        bottom: 0;
        border-top-color: #ffffff;
    }
    ::v-deep.descending .sort-caret.descending {
        border-top-color: #01fdfe;
    }
    ::v-deep.ascending .sort-caret.ascending {
        border-bottom-color: #01fdfe;
    }
}
.div-table {
    border: 1px solid #1a5c92;
    color: #ffffff;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    .table-title {
        line-height: 48px;
        padding: 0 30px;
        border-bottom: 1px solid #1a5c92;
        background: rgb(29 65 105 / 50%);
    }
    dl {
        position: relative;
        height: 46px;
        border-bottom: 1px solid #1a5c92;
        background: rgb(3 50 84 / 50%);
        box-shadow: 0 0 3px rgb(0 186 255 / 73%) inset;
        line-height: 46px;
        dt {
            position: absolute;
            padding: 0 30px;
            width: 50%;
            border-right: 1px solid #1a5c92;
            box-sizing: border-box;
        }
        dd {
            padding-left: calc(50% + 30px);
        }
        &:nth-child(2n + 1) {
            background: rgb(29 65 105 / 50%);
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
        top: 0;
        left: 0;
        width: 340px;
    }
}
.statistic-item {
    .iconfont {
        display: inline-block;
        margin-right: 6px;
        margin-left: 20px;
        height: 19px;
        font-size: 14px;
        line-height: 19px;
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
        margin-left: -2px;
        font-size: 14px;
        color: #ffffff;
    }
    div:nth-child(2) {
        margin-right: -2px;
        font-size: 12px;
        color: #1cd7fa;
    }
    span {
        color: #666666;
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
        color: rgb(0 0 0 / 40%);
        i,
        p {
            color: #e34d59;
        }
        i {
            transform: rotate(180deg);
            display: inline-block;
            margin: 0 !important;
        }
    }

    vertical-align: bottom;
}
.work-title {
    margin-bottom: 10px;
    height: 30px;
    border-bottom: 1px solid rgb(255 255 255 / 10%);
    line-height: 30px;
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
        font-size: 14px;
        color: #666666;
        cursor: pointer;
    }
}
.page-box {
    height: 30px;
    line-height: 30px;
    ::v-deep .el-pagination {
        font-weight: normal;
        background: transparent;
        .btn-next,
        .btn-prev,
        .el-pager li {
            min-width: 26px;
            color: #666666;
            background-color: transparent;
        }
        .btn-next:hover,
        .btn-prev:hover,
        .el-pager li:hover,
        .el-pager li.active {
            color: #0052d9;
        }
    }
}
@media screen and (max-width: 1366px) {
    .chart-box .page-box {
        ::v-deep .el-pagination {
            .btn-next,
            .btn-prev,
            .el-pager li {
                min-width: 16px;
            }
        }
    }
}
.work-table {
    ::v-deep .el-table {
        position: relative;
        background: transparent;
        .el-table__header-wrapper {
            margin-bottom: 6px;
            border-radius: 3px;
            .cell {
                font-weight: 400;
            }
        }
        .el-table__header tr {
            background: transparent;
            background-color: rgb(56 125 238 / 10%);
        }
        .cell {
            height: 34px !important;
            line-height: 34px;
            color: rgb(0 0 0 / 90%);
        }
        td {
            padding: 0;
            line-height: 34px;
        }
        th {
            padding: 0;
            font-size: 12px;
            color: rgb(0 0 0 / 90%);
            background-color: transparent;
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
                border-bottom: 6px solid #ffffff !important;
                .operate {
                    cursor: pointer;
                    color: #387dee;
                }
            }
            td:first-child {
                border-radius: 4px 0 0 4px;
            }
            td:last-child {
                border-radius: 0 4px 4px 0;
            }

            background: #f3f3f3;
        }
        .el-table__body-wrapper {
            tr {
                &:hover {
                    background-color: #ffffff;
                }
            }
        }
    }
    ::v-deep .el-table::before {
        right: 2px;
        left: 2px;
        background: rgb(0 168 255 / 20%);
    }
    ::v-deep .el-table--enable-row-hover .el-table__body tr:hover > td {
        background: transparent !important;
    }
}
.news-box {
    overflow: hidden;
    color: rgb(0 0 0 / 90%);
    .news-item {
        position: relative;
        margin-bottom: 6px;
        padding: 14px 10px 14px 26px;
        height: 70px;
        font-size: 12px;
        border-radius: 4px;
        background: rgb(243 243 243 / 50%);
        box-sizing: border-box;
        .news-icon {
            p {
                color: rgb(0 0 0 / 90%);
            }
            .left-news {
                overflow: hidden;
                max-width: 100%;
                height: 22px;
                font-size: 14px;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: rgb(0 0 0 / 90%);
                line-height: 22px;
            }
        }
        .work-time {
            position: relative;
            height: 20px;
            color: rgb(0 0 0 / 40%);
            line-height: 20px;
            .point {
                position: absolute;
                top: 7px;
                left: -16px;
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background-color: #a6a6a6;
            }
            .unread-point {
                background-color: #387dee;
            }
        }
    }
    .news-item.unread {
        background-color: rgb(56 125 238 / 5%);
    }
}
.timer-box ::v-deep .el-checkbox__label {
    font-size: 12px;
    color: #666666;
}
.timer-box ::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #0052d9;
}
.custom-star {
    .chart-box.bg {
        background: #052942;
    }
    .chart-top .title {
        color: #ffffff;
    }
    .work-title-todo {
        >div {
            color: #ffffff!important;
        }
    }
    .work-table ::v-deep {
        .el-table {
            .cell {
                color: #ffffff!important;
            }
        }
    }
    .page-box {
        ::v-deep .el-pagination {
            font-weight: normal;
            background: transparent;
            .btn-next,
            .btn-prev,
            .el-pager li {
                color: #ffffff;
            }
        }
    }
    .tabs .tab {
        color: #ffffff;
    }
    .tabs .active-message {
        color: #387dee;
    }
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
