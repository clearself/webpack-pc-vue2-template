<template>
    <div class="home">
        <div class="event" style="height: 100% !important;">
            <div class="w100" style="height: 100%">
                <div class="event-content w100" style="min-height: 100%">
                    <div style="background-color: #fff;">
                        <div class="ub ub-pe" style="position: fixed; top: 45px; right: 0;z-index: 999;">
                            <div class="chart-title ub ub-ac">
                                <p>统计范围：</p>
                                <div class="ub-f1 ub chart-date">
                                    <p :class="{active: timeType === '1'}" @click="changeMailCount('1')">最近7天</p>
                                    <p :class="{active: timeType === '2'}" @click="changeMailCount('2')">最近30天</p>
                                    <p style="margin-top: 1px;margin-right: 10px;" :class="{'hight-date': this.selectTimes}">
                                        <el-date-picker
                                            v-model="selectTimes"
                                            style="width: 340px"
                                            type="datetimerange"
                                            :default-time="['00:00:00', '23:59:59']"
                                            align="right"
                                            size="mini"
                                            unlink-panels
                                            value-format="yyyy-MM-dd HH:mm:ss"
                                            range-separator="至"
                                            start-placeholder="开始日期"
                                            end-placeholder="结束日期"
                                            :clearable="true">
                                        </el-date-picker>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="ub w100 num-statistic" v-show="!hide">
                            <div class="ub ub-f1 chart-box bg bg1">
                                <div class="ub ub-f1 ub-pj ub-ac statistic-item">
                                    <div class="ub ub-as">
                                        <i class="iconfont icon-renwuzongliang color1"></i>
                                        <div class="ub ub-ver">
                                            <div class="text">全部工单</div>
                                            <div class="num color1">{{ allNum }}</div>
                                        </div>
                                    </div>
                                    <div class="icon">
                                        <img src="../../assets/img/work_platform/tongji.png" alt="">
                                    </div>
                                </div>
                            </div>
                            <div class="ub ub-f1 chart-box bg bg2">
                                <div class="ub ub-f1 ub-pj ub-ac statistic-item">
                                    <div class="ub ub-as">
                                        <i class="iconfont icon-yiwancheng color2"></i>
                                        <div class="ub ub-ver">
                                            <div class="text">完成工单</div>
                                            <div class="num color2">{{ finishNum }}</div>
                                        </div>
                                    </div>
                                    <div class="icon">
                                        <img src="../../assets/img/work_platform/wancheng.png" alt="">
                                    </div>
                                </div>
                            </div>
                            <div class="ub ub-f1 chart-box bg bg3">
                                <div class="ub ub-f1 ub-pj ub-ac statistic-item">
                                    <div class="ub ub-as">
                                        <i class="iconfont icon-daichuli color3"></i>
                                        <div class="ub ub-ver">
                                            <div class="text">待处理工单</div>
                                            <div class="num color3">{{ todoNum }}</div>
                                        </div>
                                    </div>
                                    <div class="icon">
                                        <img src="../../assets/img/work_platform/daichuli.png" alt="">
                                    </div>
                                </div>
                            </div>
                            <div class="ub ub-f1 chart-box bg bg4">
                                <div class="ub ub-f1 ub-pj ub-ac statistic-item">
                                    <div class="ub ub-as">
                                        <i class="iconfont icon-jinhangzhong color4"></i>
                                        <div class="ub ub-ver">
                                            <div class="text">进行中工单</div>
                                            <div class="num color4">{{ runningNum }}</div>
                                        </div>
                                    </div>
                                    <div class="icon">
                                        <img src="../../assets/img/work_order/running.png" alt="">
                                    </div>
                                </div>
                            </div>
                            <div class="ub ub-f1 chart-box bg bg5">
                                <div class="ub ub-f1 ub-pj ub-ac statistic-item">
                                    <div class="ub ub-as">
                                        <i class="iconfont icon-fanhui color5"></i>
                                        <div class="ub ub-ver">
                                            <div class="text">已撤销工单</div>
                                            <div class="num color5">{{ revokeNum }}</div>
                                        </div>
                                    </div>
                                    <div class="icon">
                                        <img src="../../assets/img/work_order/revoke.png" alt="">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="ub w100" style="box-sizing: border-box;margin-top: 10px;background-color: #fff;padding: 10px 20px;border-bottom: 1px solid #ddd;">
                        <div class="ub w100">
                            <div class="ub ub-ver ub-ac ub-f1">
                                <el-row type="flex" align="middle" class="w100" style="border-radius:0 0 5px 5px;">
                                    <el-col :span="7" class="event-btn-col">
                                        <el-form :model="get_params">
                                            <el-form-item label="处置人：" label-width="60px">
                                                <el-select
                                                    placeholder="请选择"
                                                    @change="get_data"
                                                    :clearable="true"
                                                    v-model="get_params.user"
                                                    size="small">
                                                    <el-option v-for="(item, index) in userList" :key="index" :label="item.chineseName" :value="item.id"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-form>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                    </div>
                    <div class="ub ub-pj w100" style="background-color: #fff;">
                        <div class="attendance-list w100">
                            <div class="ub ub-pj w100" style="margin-bottom: 10px;">
                                <div class="list-tips">人员统计</div>
                            </div>
                            <el-table :row-class-name="tableRowClassName" class='bigTable' ref="multipleTable" v-loading="loading"  :data="tableData" border stripe tooltip-effect="dark" :height="tableHeight">
                                <el-table-column align="center" type="index" width="50" label="序号">
                                </el-table-column>
                                <el-table-column align="center" prop="userName" label="处置人">
                                </el-table-column>
                                <el-table-column align="center" prop="userFinishNum" label="完成工单">
                                    <template slot-scope="{row}">
                                        <span class="num-end" @click="handleSeeAsset(1, row)" style="color: #00ccff;font-size: 12px;cursor: pointer;text-decoration: underline">{{row.userFinishNum}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" prop="userToDoNum" label="待处理工单">
                                    <template slot-scope="{row}">
                                        <span class="num-end" @click="handleSeeAsset(2, row)" style="color: #00ccff;font-size: 12px;cursor: pointer;text-decoration: underline">{{row.userToDoNum}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" prop="userRunningNum" label="进行中工单">
                                    <template slot-scope="{row}">
                                        <span class="num-end" @click="handleSeeAsset(3, row)" style="color: #00ccff;font-size: 12px;cursor: pointer;text-decoration: underline">{{row.userRunningNum}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" prop="userRevokeNum" label="已撤销工单">
                                    <template slot-scope="{row}">
                                        <span class="num-end" @click="handleSeeAsset(4, row)" style="color: #00ccff;font-size: 12px;cursor: pointer;text-decoration: underline">{{row.userRevokeNum}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" prop="userAvgTime" label="平均处置工单时间">
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                    <el-dialog v-dialogDrag :title="getTitle()" :visible.sync="orderDialog" width="940px" custom-class="attendance-dialog">
                        <div>
                            <el-table
                                v-loading="loading_order"
                                ref="multipleTable"
                                class='bigTable full-table'
                                :data="orderTableData"
                                border
                                stripe
                                tooltip-effect="dark">
                                <el-table-column align="center" type="index" width="50" label="序号" :index="indexMethod"></el-table-column>
                                <el-table-column prop="workOrderName" label="工单名称">
                                </el-table-column>
                                <el-table-column prop="name" label="当前节点">
                                    <template slot-scope="{row}">
                                        <div>
                                            <div v-if="currentType === 1">已完成</div>
                                            <div v-if="currentType === 2 || currentType === 3">
                                                <p v-if="row.runningNodeName && row.runningNodeName.length">{{row.runningNodeName.join(',')}}</p>
                                                <p v-else>--</p>
                                            </div>
                                            <div v-if="currentType === 4">已撤销</div>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column v-if="currentType === 2" prop="receiveTime" label="接收时间" width="160">
                                </el-table-column>
                            </el-table>
                        </div>
                        <div class="pagination" style="margin-top: 10px; text-align: right;">
                            <el-pagination
                                background
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :current-page="get_params.page"
                                :page-sizes="[20, 30, 40,50]"
                                :page-size="get_params.size"
                                layout="slot,sizes, prev, next"
                                prev-text="上一页"
                                next-text="下一页"
                            >
                            </el-pagination>
                        </div>
                        <span slot="footer" class="dialog-footer">
                            <el-button size="small" @click="()=>{orderDialog = false;get_params.size = 20;get_params.page = 1}">取 消</el-button>
                            <!-- <cancelBtn title="取 消" @click="orderDialog = false" /> -->
                        </span>
                    </el-dialog>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    get_work_users,
    get_work_order_data,
    get_work_detail_data
} from '../../server/works_order/api.js'

export default {
    name: 'StatisticalOrder',
    data() {
        return {
            tableHeight: document.body.clientHeight - 370,
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

            config_table_id: '',
            config_message_id: '',
            defaultOpens: [],
            activeIndex: '',
            menuData: [],
            timeStr: null,
            allNum: 0, // 全部工单
            finishNum: 0, // 完成工单
            revokeNum: 0, // 已撤销
            runningNum: 0, // 进行中
            todoNum: 0, // 待处理
            myWorkList: [],
            currentNum: '',
            totalPages: 0,
            totalPagesMessage: 0,
            newsList: [],
            loading: false,
            tableData: [],
            get_params: {
                page: 1,
                size: 20,
                user: ''
            },
            userList: [],
            currentType: '', // 1:完成工单，2：待处理工单， 3：进行中工单，4：已撤销工单
            selectTimes: '',
            timeType: '1',
            orderTableData: [],
            orderDialog: false,
            loading_order: false,
            total_num: 0,
            hide: false,
            userId: '',
            type: ''
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.get_users()
            this.get_data()
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
    },
    watch: {
        selectTimes: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.timeType = ''
                    this.get_params.user = ''
                    this.get_users()
                    this.get_data()
                } else if (this.timeType === '' && !newVal) {
                    this.timeType = '1'
                    this.get_params.user = ''
                    this.get_users()
                    this.get_data()
                }
            }
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
        changeMailCount(type) {
            if (type === this.timeType) return
            this.get_params.user = ''
            if (['1', '2'].includes(type)) {
                this.timeType = type
                this.selectTimes = ''
                this.get_users()
                this.get_data()
            } else {
                this.timeType = ''
            }
        },
        getTitle() {
            if (this.currentType === 1) {
                return '完成工单节点详情'
            } else if (this.currentType === 2) {
                return '待处理工单详情'
            } else if (this.currentType === 3) {
                return '进行中工单详情'
            } else if (this.currentType === 4) {
                return '已撤销工单详情'
            }
        },
        get_data() {
            let data = {
                startTime: '',
                endTime: '',
                userId: this.get_params.user
            }
            if (this.timeType === '1') {
                /* 星期*/
                data.startTime = this.dateFormat(1)
                data.endTime = this.dateFormat()
            } else if (this.timeType === '2') {
                /* 月份*/
                data.startTime = this.dateFormat(2)
                data.endTime = this.dateFormat()
            } else if (this.selectTimes) {
                data.startTime = this.selectTimes ? this.selectTimes[0] : ''
                data.endTime = this.selectTimes ? this.selectTimes[1] : ''
            }
            this.loading = true
            get_work_order_data({ paramsData: data, queryData: {}}).then(res => {
                console.log(res, '工单列表')
                this.loading = false
                this.allNum = res.allNum ?? 0
                this.finishNum = res.finishNum ?? 0
                this.revokeNum = res.revokeNum ?? 0
                this.runningNum = res.runningNum ?? 0
                this.todoNum = res.todoNum ?? 0

                this.tableData = res.data ?? []
            }).catch(err => {
                this.loading = false
                console.log(err, 'err')
            })
        },
        get_users() {
            let data = {
                startTime: '',
                endTime: ''
            }
            if (this.timeType === '1') {
                data.startTime = this.dateFormat(1)
                data.endTime = this.dateFormat()
            } else if (this.timeType === '2') {
                data.startTime = this.dateFormat(2)
                data.endTime = this.dateFormat()
            } else if (this.selectTimes) {
                data.startTime = this.selectTimes ? this.selectTimes[0] : ''
                data.endTime = this.selectTimes ? this.selectTimes[1] : ''
            }

            get_work_users({ paramsData: data, queryData: {}}).then(res => {
                console.log(res, '工单人')
                this.userList = this.$deepCopy(res)
            }).catch(err => {
                console.log(err, 'err')
            })
        },
        dateFormat(val) {
            var date0 = Date.now()// 时间戳为10位需*1000，时间戳为13位的话不需乘1000
            if (val === 1) {
                date0 = date0 - 7 * 24 * 60 * 60 * 1000
            } else if (val === 2) {
                date0 = date0 - 30 * 24 * 60 * 60 * 1000
            }
            var date = new Date(date0)
            var Y = date.getFullYear() + '-'
            var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
            var D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' '
            var h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':'
            var m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':'
            var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
            return Y + M + D + h + m + s
        },
        handleSeeAsset(val, row) {
            this.currentType = val
            this.orderTableData = []
            this.orderDialog = true
            this.loading_order = true
            let data = {
                startTime: '',
                endTime: '',
                userId: row.userId,
                type: val
            }
            this.userId = row.userId
            this.type = val
            if (this.timeType === '1') {
                data.startTime = this.dateFormat(1)
                data.endTime = this.dateFormat()
            } else if (this.timeType === '2') {
                data.startTime = this.dateFormat(2)
                data.endTime = this.dateFormat()
            } else if (this.selectTimes) {
                data.startTime = this.selectTimes ? this.selectTimes[0] : ''
                data.endTime = this.selectTimes ? this.selectTimes[1] : ''
            }
            get_work_detail_data({
                paramsData: data,
                queryData: {
                    page: this.get_params.page,
                    pageSize: this.get_params.size
                }
            }).then(res => {
                console.log(res, '详情')
                this.loading_order = false
                this.orderTableData = res.records ?? []
            }).catch(err => {
                this.loading_order = false
                console.log(err, 'err')
            })
        },
        handleSizeChange(val) {
            this.get_params.size = val
            this.handleSeeAsset(this.type, { userId: this.userId })
        },
        handleCurrentChange(val) {
            this.get_params.page = val
            this.handleSeeAsset(this.type, { userId: this.userId })
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
.plat-box {
    min-width: 950px;
}
$zero: #7efcfb;
$one: #00c7ff;
$two: #fdfe7f;
$three: #fc7f00;
$fore: #fd0001;
$status1:#ffdd00;
$status2:#01ff01;
$status3:#00e1fd;
$status4:#e1e2e4;
.num-statistic {
    padding: 20px 20px;
}
.num-statistic>div {
    height: 80px;
    margin-right: 24px;
}
.num-statistic>div:last-child {
    margin-right: 0px;
}
.event-btn-col {
    .el-form-item {
        margin: 0;
    }
}
.attendance-list {
    padding: 10px;
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
}
.bg1 {
    background-color: #f2f2f2;
}
.bg2 {
    background-color: #d7e5ff;
}
.bg3 {
    background-color: #fcebdf;
}
.bg4 {
    background-color: #daf4eb;
}
.bg5 {
    background-color: #fcdcf9;
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
    font-size: 30px;
    line-height: 26px;
    color: #fff;
}

.chart-top {
    position: absolute;
    left: 0;
    top: 0;
    height: 50px;
    .title {
        color: #fff;
        font-size: 14px;
        text-shadow: 0px 0px 6px #00cffb, 0px 0px 6px #00cffb;
    }
    .options {
        font-size: 0;
    }
    .options>div {
        display: inline-block;
        padding: 0 8px;
        color: #666;
        font-size: 12px;
        cursor: pointer;
    }
    .options>div.active {
        color: #fff;
    }
}

.title-level {
    border: 1px solid $zero;
    background: rgba($zero, .2);
    color: $zero;
    font-size: 12px;
    border-radius: 3px;
    line-height: 1;
    padding: 2px 10px;
    margin: 0 5px;
    &.one {
        border-color: $one;
        background: rgba($one, .2);
        color: $one;
    }
    &.two {
        border-color: $two;
        background: rgba($two, .2);
        color: $two;
    }
    &.three {
        border-color: $three;
        background: rgba($three, .2);
        color: $three;
    }
    &.fore {
        border-color: $fore;
        background: rgba($fore, .2);
        color: $fore;
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

.event ::v-deep .el-range-input {
    background-color: rgba(0, 0, 0, 0);
    color: #0052d9;
}

.event ::v-deep .el-range-separator {
    color: #0052d9;
}

.event ::v-deep .el-radio__label,
.event ::v-deep .el-checkbox__label {
    color: #0052d9;
}

.bigTable {
    ::v-deep .caret-wrapper {
        height: 22px;
    }
    ::v-deep .sort-caret.ascending {
        border-bottom-color: #fff;
        top: 0;
    }
    ::v-deep .sort-caret.descending {
        border-top-color: #fff;
        bottom: 0;
    }
    ::v-deep .descending .sort-caret.descending {
        border-top-color: #01fdfe;
    }
    ::v-deep .ascending .sort-caret.ascending {
        border-bottom-color: #01fdfe;
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
        font-size: 12px;
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

.statistic-item .color5 {
    color: #e34d59;
}

span.change-time {
    color: #0052d9 !important;
}
.plat-box {
    .message-bg::before {
        font-family: "iconfont";
        transform: scale(0.5);
        width: 10px;
        height: 4px;
        position: absolute;
        left: -4px;
        bottom: 11px;
        content: '\e738';
        color: #0264b1;
    }
}
.plat-title {
    height: 20px;
    line-height: 20px;
    margin:10px 0 20px;
    div:nth-child(1) {
        font-size: 14px;
        margin-left: -2px;
        color: #fff;
    }
    div:nth-child(2) {
        margin-right: -2px;
        font-size: 12px;
        color: #0052d9;
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
        color: #fff;

        i,p {
            color: #00c0ff;
        }
        i {
            transform: rotate(180deg);
            display: inline-block;
        }
    }
    vertical-align: bottom;
}
.work-title {
    height: 30px;
    line-height: 30px;
    border-bottom: 1px solid rgba(255,255,255,.1);
    margin-bottom: 10px;

    ::v-deep  .el-badge__content {
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

.timer-box  ::v-deep  .el-checkbox__label {
    font-size: 12px;
    color: #666;
}
.timer-box  ::v-deep  .el-checkbox__input.is-checked+.el-checkbox__label {
    color: #0052d9;
}
.chart-title {
    >p{
        min-width: 80px;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.9);
    }
}
.chart-date {
    height: 30px;
    line-height: 30px;
    p {
        font-size: 12px;
        color: #777;
        margin-right: 20px;
        cursor: pointer;
        min-width: 50px;
    }
    p.active {
        color: #387dee;
    }
    p:nth-child(2) {
        margin-right: 20px;
    }
}
.event ::v-deep .hight-date .el-range-input {
    background-color: rgba(0, 0, 0, 0);
    color: #0052d9;
    opacity: 1;
}

.white-theme .chart-title{
    >p{
        color:#333;
    }
}
</style>
