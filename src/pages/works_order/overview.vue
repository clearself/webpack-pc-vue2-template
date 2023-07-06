<template>
    <div class="home">
        <div class="event" style="height: 100% !important;">
            <div class="w100" style="height: 100%">
                <div class="event-content w100" style="min-height: 100%">
                    <div style="background-color: #fff;">
                        <div class="ub ub-pe" style="position: fixed; top: 45px; right: 0;z-index: 999;">
                            <div class="chart-title ub ub-ac">
                                <p>统计范围：</p>
                                <div class="ub ub-f1 chart-date">
                                    <p :class="{active: timeType === 1}" @click="changeMailCount(1)">最近7天</p>
                                    <p :class="{active: timeType === 2}" @click="changeMailCount(2)">最近30天</p>
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
                                            :clearable="true"
                                            @change="chageTime"
                                        >
                                        </el-date-picker>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="ub w100 num-statistic" v-if="!hide">
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
                    <div class="ub w100" style="box-sizing: border-box;margin-top: 10px;background-color: #fff;padding: 10px 20px;">
                        <div class="ub event-content w100">
                            <div class="ub ub-ver ub-ac ub-f1">
                                <el-row type="flex" align="middle" class="w100" style="border-radius:0 0 5px 5px;">
                                    <el-col :span="7" class="event-btn-col">
                                        <el-form :model="get_params" label-position="left">
                                            <el-form-item label="工单名称：" label-width="85px">
                                                <el-input placeholder="请输入" clearable v-model="searchVal" style="width: 100%" size="small">
                                                    <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                                                </el-input>
                                            </el-form-item>
                                        </el-form>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                    </div>
                    <div class="w100" style="position: relative;">
                        <div v-if="tabsValue==='tab0'" class="complate">平均处置时间：{{timeVal}}</div>
                        <el-tabs class="overview-tabs" v-model="tabsValue" style="height:100%;background-color: #fff;" @tab-click="handelTabclick">
                            <el-tab-pane
                                label="待处理"
                                name="tab1"
                                style="height:100%;"
                            >
                                <div class="w100">
                                    <OverviewTable ref="tab1" :search="searchVal" :time-type="timeType" :type="2" :selectTimes="selectTimes" ></OverviewTable>
                                </div>
                            </el-tab-pane>
                            <el-tab-pane
                                label="已完成"
                                name="tab0"
                                style="height:100%;position: relative;"
                            >
                                <div class="w100">

                                    <OverviewTable ref="tab0" :search="searchVal" :time-type="timeType" :type="1" :selectTimes="selectTimes" ></OverviewTable>
                                </div>
                            </el-tab-pane>

                            <el-tab-pane
                                label="进行中"
                                name="tab2"
                                style="height:100%;"
                            >
                                <div class="w100">
                                    <OverviewTable ref="tab2" :search="searchVal" :time-type="timeType" :type="3" :selectTimes="selectTimes" ></OverviewTable>
                                </div>
                            </el-tab-pane>
                            <el-tab-pane
                                label="已撤销"
                                name="tab3"
                                style="height:100%;"
                            >
                                <div class="w100">
                                    <OverviewTableCopy ref="tab3" :search="searchVal" :time-type="timeType" :type="4" :selectTimes="selectTimes" ></OverviewTableCopy>
                                </div>
                            </el-tab-pane>
                        </el-tabs>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    get_work_order_statistic,
    get_timeVal
} from '../../server/works_order/api.js'
import OverviewTable from './overview_table_copy.vue'
import OverviewTableCopy from './overview_table.vue'
export default {
    name: 'StatisticalOrder',
    components: {
        OverviewTable,
        OverviewTableCopy
    },
    data() {
        return {
            timeVal: '',
            tabsValue: 'tab1',
            get_params: {},
            timeNum: {
                week: '',
                hourMinute: '',
                dateTime: ''
            },
            formLabelWidth: '120px',
            allNum: 0, // 全部工单
            finishNum: 0, // 完成工单
            revokeNum: 0, // 已撤销
            runningNum: 0, // 进行中
            todoNum: 0, // 待处理
            searchVal: '',
            currentType: '',
            selectTimes: '',
            timeType: 1,
            hide: false
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.initStatistic()
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

                }
            }
        }
    },
    methods: {
        chageTime() {
            if (this.selectTimes) {
                this.timeType = 0
            } else {
                this.timeType = 1
            }

            this.searchVal = ''
            setTimeout(() => {
                this.refreshData()
            }, 500)
        },
        initTime() {
            let data = {
                queryData: {},
                paramsData: {
                    startTime: '',
                    endTime: ''
                }
            }
            if (this.timeType === 1) {
                /* 星期*/
                data.paramsData.startTime = this.dateFormat(1)
                data.paramsData.endTime = this.dateFormat()
            } else if (this.timeType === 2) {
                /* 月份*/
                data.paramsData.startTime = this.dateFormat(2)
                data.paramsData.endTime = this.dateFormat()
            } else if (this.selectTimes) {
                data.paramsData.startTime = this.selectTimes ? this.selectTimes[0] : ''
                data.paramsData.endTime = this.selectTimes ? this.selectTimes[1] : ''
            }
            get_timeVal(data).then(res => {
                console.log(res, '平均时间')
                this.timeVal = res
            }).catch(err => {
                console.log(err, 'err')
            })
        },
        search() {
            this.refreshData()
        },
        handelTabclick(val) {
            console.log(val)
            console.log(this.tabsValue)
            this.refreshData()
        },
        refreshData() {
            if (this.tabsValue === 'tab0') {
                this.$refs.tab0.reset()
                this.$refs.tab0.get_data()
                this.initTime()
            } else if (this.tabsValue === 'tab1') {
                this.$refs.tab1.reset()
                this.$refs.tab1.get_data()
            } else if (this.tabsValue === 'tab2') {
                this.$refs.tab2.reset()
                this.$refs.tab2.get_data()
            } else if (this.tabsValue === 'tab3') {
                this.$refs.tab3.reset()
                this.$refs.tab3.get_data()
            } else if (this.tabsValue === 'tab4') {
                this.$refs.tab4.reset()
                this.$refs.tab4.get_data()
            }
        },
        changeMailCount(type) {
            console.log(type, this.timeType)
            if (type === this.timeType) return
            this.searchVal = ''
            if ([1, 2].includes(type)) {
                this.timeType = type
                this.selectTimes = ''
                console.log(this.$refs)
                setTimeout(() => {
                    this.refreshData()
                }, 500)
            } else {
                this.timeType = 0
            }
        },
        initStatistic() {
            let data = {
                queryData: {},
                paramsData: {
                    startTime: '',
                    endTime: ''
                }
            }
            if (this.timeType === 1) {
                /* 星期*/
                data.paramsData.startTime = this.dateFormat(1)
                data.paramsData.endTime = this.dateFormat()
            } else if (this.timeType === 2) {
                /* 月份*/
                data.paramsData.startTime = this.dateFormat(2)
                data.paramsData.endTime = this.dateFormat()
            } else if (this.selectTimes) {
                data.paramsData.startTime = this.selectTimes ? this.selectTimes[0] : ''
                data.paramsData.endTime = this.selectTimes ? this.selectTimes[1] : ''
            }
            get_work_order_statistic(data).then(res => {
                console.log(res, '工单列表')
                this.loading = false
                this.allNum = res.allNum ?? 0
                this.finishNum = res.finishNum ?? 0
                this.revokeNum = res.revokeNum ?? 0
                this.runningNum = res.runningNum ?? 0
                this.todoNum = res.todoNum ?? 0
            }).catch(err => {
                this.loading = false
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
        getTitle() {
            if (this.currentType === 1) {
                return '完成工单详情'
            } else if (this.currentType === 2) {
                return '待处理工单详情'
            } else if (this.currentType === 3) {
                return '进行中工单详情'
            } else if (this.currentType === 4) {
                return '已撤销工单详情'
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../assets/css/pacap.scss';
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

.overview-tabs {
    ::v-deep .el-tabs__item {
        width: 88px;
        text-align: center;
    }
    ::v-deep .el-tabs__header {
       margin-bottom: 0px;
    }
}

.chart-box {
    position: relative;
    span {
        position: absolute;
        left: -1px;
        top: -1px;
        width: 10px;
        height: 10px;
        z-index: 10;
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
.event-btn-col {
    .el-form-item {
        margin: 0;
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
        border-top-color: #0052d9;
    }
    ::v-deep .ascending .sort-caret.ascending {
        border-bottom-color: #0052d9;
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
    color: #5bf2ff !important;
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
        color: #5bf2ff;
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
.complate{
    position: absolute;
    top:9px;
    right:0px;
    color:#fff;
    z-index: 999;
    font-size: 15px;
}
</style>
<style>
.work-overview.el-table tr{
    box-shadow:none!important;
}
.work-overview.el-table tr:hover {
    background-color: rgba(0,0,0,0)!important;

}
</style>
