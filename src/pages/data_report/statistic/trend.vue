<template>
    <div class="event event-wrapper overview report-platform">
        <div class="w100" style="height:100%;">
            <div class="event-content w100" style="min-height:100%;">
                <div class="ub ub-ac ub-pj w100" style="margin-bottom: 33px;">
                    <div class="list-tips" style="margin: 0;">趋势统计</div>
                    <div class="ub ub-ac ub-pc change-box">
                        <div class="time-btn" :class="{'active':item.isActive}" v-for="(item,index) in timeType" :key="index" @click="changeTimeType(item,index)">{{item.label}}</div>
                        <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" style='width:300px;' size="mini" v-model="sayTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="changeTime">
                        </el-date-picker>
                    </div>
                </div>
                <div class="chart-box w100 border marB20" style="height:330px;padding-top:50px;">
                    <span class="angle1"></span>
                    <span class="angle2"></span>
                    <span class="angle3"></span>
                    <span class="angle4"></span>
                    <div class="ub ub-pj ub-ac w100 chart-top" style="padding:0 20px;box-sizing: border-box;">
                        <div class="title">趋势统计</div>
                        <div class="ub changeAttrack">
                            <div :class="{'active':item.isActive}" v-for="(item,index) in attrackType" :key="index" @click="changeAttrackType(item,index)">{{item.label}}</div>
                        </div>
                    </div>
                    <div v-loading="logs_loading" style="width:100%;height:100%;cursor: pointer;padding: 2px 4px 2px 2px;box-sizing: border-box;">
                        <div v-if="logs_no_data" class="ub ub-f1 ub-ac ub-pc" style="height:100%;color:#e7e7e7;font-size:16px; cursor: pointer;">
                            暂无数据
                        </div>
                        <brokenLineMut :chartData="brokenData" v-if="brokenData.length>0" />
                    </div>
                </div>
                <div class="w100">
                    <el-table ref="multipleTable" v-loading="loading" class='bigTable' :data="tableData" border stripe tooltip-effect="dark">
                        <el-table-column prop="time" :label="isDate" width="160">
                        </el-table-column>
                        <el-table-column v-for="item in attrackType" :key="item.type" header-align="center"  align="center" :label="item.label">
                            <el-table-column header-align="center"  align="center" label="合规量">
                                <template slot-scope="scope">
                                    <span style="font-size:14px;color:#13a3ff;">{{scope.row[item.code].total}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column header-align="center"  align="center" label="上报量">
                                <template slot-scope="scope">
                                    <span style="font-size:14px;color:#ff620d;">{{scope.row[item.code].sent}}</span>
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <!-- <el-table-column header-align="center"  align="center" label="DDOS网络攻击量">
                            <el-table-column header-align="center"  align="center" label="合规量">
                                <template slot-scope="scope">
                                    <span style="font-size:14px;color:#13a3ff;">{{scope.row.ddosAttack.jr}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column header-align="center"  align="center" label="上报量">
                                <template slot-scope="scope">
                                    <span style="font-size:14px;color:#ff620d;">{{scope.row.ddosAttack.sb}}</span>
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column header-align="center"  align="center" label="病毒感染量">
                            <el-table-column header-align="center"  align="center" label="合规量">
                                <template slot-scope="scope">
                                    <span style="font-size:14px;color:#13a3ff;">{{scope.row.viralInfection.jr}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column header-align="center"  align="center" label="上报量">
                                <template slot-scope="scope">
                                    <span style="font-size:14px;color:#ff620d;">{{scope.row.viralInfection.sb}}</span>
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column header-align="center"  align="center" label="恶意邮件量">
                            <el-table-column header-align="center"  align="center" label="合规量">
                                <template slot-scope="scope">
                                    <span style="font-size:14px;color:#13a3ff;">{{scope.row.maliciousMail.jr}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column header-align="center"  align="center" label="上报量">
                                <template slot-scope="scope">
                                    <span style="font-size:14px;color:#ff620d;">{{scope.row.maliciousMail.sb}}</span>
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column header-align="center"  align="center" label="反垃圾邮件量">
                            <el-table-column header-align="center"  align="center" label="合规量">
                                <template slot-scope="scope">
                                    <span style="font-size:14px;color:#13a3ff;">{{scope.row.antiWasteMail.jr}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column header-align="center"  align="center" label="上报量">
                                <template slot-scope="scope">
                                    <span style="font-size:14px;color:#ff620d;">{{scope.row.antiWasteMail.sb}}</span>
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column header-align="center"  align="center" label="防病毒安装数">
                            <el-table-column header-align="center"  align="center" label="合规量">
                                <template slot-scope="scope">
                                    <span style="font-size:14px;color:#13a3ff;">{{scope.row.viralInfectionNum.jr}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column header-align="center"  align="center" label="上报量">
                                <template slot-scope="scope">
                                    <span style="font-size:14px;color:#ff620d;">{{scope.row.viralInfectionNum.sb}}</span>
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column header-align="center"  align="center" label="钓鱼网站/假冒APP量">
                            <el-table-column header-align="center"  align="center" label="合规量">
                                <template slot-scope="scope">
                                    <span style="font-size:14px;color:#13a3ff;">{{scope.row.siteApp.jr}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column header-align="center"  align="center" label="上报量">
                                <template slot-scope="scope">
                                    <span style="font-size:14px;color:#ff620d;">{{scope.row.siteApp.sb}}</span>
                                </template>
                            </el-table-column>
                        </el-table-column> -->
                    </el-table>
                    <div class="ub ub-pe pagination mt-1">
                        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="get_params.page" :page-sizes="[10, 20, 30, 40,50]" :page-size="get_params.size" layout="total, sizes, prev, pager, next, jumper" :total="total_num">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    get_trend,
    get_trend_list
} from '@/server/reporting_platform/setting.js'
import {
    event_data
} from '../config_data.js'
import brokenLineMut from './charts/brokenLineMut.vue'
import typeBar from './charts/typeBar.vue'
import Bar from './charts/bar.vue'
import chinaMap from './charts/chinaMap.vue'
export default {
    name: 'Trend',
    components: {
        brokenLineMut,
        // eslint-disable-next-line vue/no-unused-components
        typeBar,
        // eslint-disable-next-line vue/no-unused-components
        Bar,
        // eslint-disable-next-line vue/no-unused-components
        chinaMap
    },
    data() {
        return {
            isFreeTime: false,
            networkType: 1,
            networkFromType: 1,
            total_num: 0,
            loading: false,
            get_params: {
                page: 1,
                size: 10
            },
            tableData: [],
            sayTime: null,
            timeType: [{
                label: '今日',
                value: 1,
                isActive: true
            }, {
                label: '昨天',
                value: 2,
                isActive: false
            }, {
                label: '最近7天',
                value: 3,
                isActive: false
            }, {
                label: '最近30天',
                value: 4,
                isActive: false
            }],

            // 折线
            logs_loading: true,
            logs_no_data: true,
            brokenData: []
        }
    },
    computed: {
        attrackType() {
            let all_list = event_data.filter(item => item.type !== 11)
            console.log(all_list, 'all_list')
            let list = all_list.map((item, index) => {
                return {
                    label: item.label,
                    value: item.type,
                    code: item.code,
                    isActive: index === 0
                }
            })
            return list
        },
        isDate() {
            if (this.networkType == 1 || this.networkType == 2 || (this.sayTime && this.sayTime[0] === this.sayTime[1])) {
                return '时间'
            } else {
                return '日期'
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.initTrend()
            this.getList()
        })
    },
    methods: {
        GetNextDay(date) {
            let today = new Date(date)
            let yesterday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24
            let yesterday = new Date()
            yesterday.setTime(yesterday_milliseconds)
            let strYear = yesterday.getFullYear()
            let strDay = yesterday.getDate()
            let strMonth = yesterday.getMonth() + 1
            if (strMonth < 10) {
                strMonth = '0' + strMonth
            }
            if (strDay < 10) {
                strDay = '0' + strDay
            }
            return strYear + '-' + strMonth + '-' + strDay + ' 00:00:00'
        },
        changeTimeType(obj, index) {
            console.log(obj)
            this.timeType = this.timeType.map(item => {
                item.isActive = false
                return item
            })
            this.isFreeTime = false
            obj.isActive = true
            this.sayTime = null
            this.networkType = obj.value
            // 刷新数据
            this.initTrend()
            this.getList()
        },
        changeAttrackType(obj, index) {
            console.log(obj)
            this.attrackType = this.attrackType.map(item => {
                item.isActive = false
                return item
            })
            obj.isActive = true
            this.networkFromType = obj.value
            // 刷新数据
            this.initTrend()
        },

        initTrend() {
            this.logs_loading = true
            this.logs_no_data = false
            this.brokenData = []
            let data = {
                queryData: {},
                paramsData: {
                    type: this.isFreeTime ? 5 : this.networkType,
                    dataType: this.networkFromType
                }
            }
            if (this.isFreeTime) {
                let startTime = this.sayTime === null ? '' : this.sayTime[0]
                let endTime = this.sayTime === null ? '' : this.sayTime[1]
                if (this.sayTime && (startTime.substring(0, 10) === endTime.substring(0, 10))) {
                    startTime = startTime.substring(0, 10) + ' 00:00:00'
                    endTime = endTime.substring(0, 10) + ' 23:59:59'
                }
                data.paramsData.customStartTime = startTime
                data.paramsData.customEndTime = endTime
            }
            get_trend(data).then(res => {
                console.log('网络攻击量趋势', res)
                this.logs_loading = false
                let arr = []
                if (res.length > 0) {
                    this.logs_no_data = false
                    res.forEach(item => {
                        arr.push({
                            day: item.time,
                            jrl: item.total,
                            sbl: item.sent
                        })
                    })
                    this.brokenData = arr
                } else {
                    this.logs_no_data = true
                }
            }).catch(error => {
                this.logs_loading = false
                console.log('error' + error)
            })
        },
        getList() {
            this.loading = true
            this.tableData = []
            let data = {
                queryData: {
                    page: this.get_params.page,
                    pageSize: this.get_params.size
                },
                paramsData: {
                    type: this.isFreeTime ? 5 : this.networkType

                }
            }
            if (this.isFreeTime) {
                let startTime = this.sayTime === null ? '' : this.sayTime[0]
                let endTime = this.sayTime === null ? '' : this.sayTime[1]
                if (this.sayTime && (startTime.substring(0, 10) === endTime.substring(0, 10))) {
                    startTime = startTime.substring(0, 10) + ' 00:00:00'
                    endTime = endTime.substring(0, 10) + ' 23:59:59'
                }
                data.paramsData.customStartTime = startTime
                data.paramsData.customEndTime = endTime
            }
            get_trend_list(data).then(res => {
                console.log('网络攻击量趋势列表', res)
                this.loading = false
                this.total_num = res.total
                let list = res.records

                if (list && list.length > 0) {
                    this.tableData = list
                }
            }).catch(error => {
                this.loading = false
                console.log('error' + error)
            })
        },
        handleSizeChange(val) {
            this.get_params.size = val
            this.getList()
        },
        handleCurrentChange(val) {
            this.get_params.page = val
            this.getList()
        },
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        changeTime() {
            if (this.sayTime === null) {
                this.$message({
                    message: '请选择时间！',
                    type: 'warning'
                })
                return
            }
            this.timeType = this.timeType.map(item => {
                item.isActive = false
                return item
            })
            console.log(this.sayTime)
            this.isFreeTime = true

            // 刷新数据
            this.initTrend()
            this.getList()
        }
    }
}
</script>

<style lang="scss" scoped>
$zero: #7efcfb;
$one: #00c7ff;
$two: #fdfe7f;
$three: #fc7f00;
$fore: #fd0001;
$status1:#ffdd00;
$status2:#01ff01;
$status3:#00e1fd;
$status4:#e1e2e4;
.num-statistic>div {
    /*height: 100px;*/
    margin-right: 24px;
}

.num-statistic>div:last-child {
    margin-right: 0px;
}

.chart-box {
    position: relative;
    &>span {
        position: absolute;
        left: -1px;
        top: -1px;
        width: 10px;
        height: 10px;
        /* background: url('/static/img/icon-jiao.png') no-repeat; */
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

.chart-box.border {
    border: 1px solid #d7d7d7;
}

.chart-box.bg {
    /* background-color: rgba(17, 76, 132, .2); */
    box-shadow: 0 0 10px rgba(0,0,0,.2);
}

.num-statistic .chart-box {
    width: 1%;
}

.statistic-item>.icon {
    font-size: 0px;
    margin-right: 15px;
    margin-left: 15px;
    i {
        font-size: 30px;
        color: #00FE00;
    }
}

.statistic-item .text {
    height:40px;
    text-align: center;
    font-size: 16px;
    color: #333;
}
/* .num-statistic .chart-box:nth-of-type(1) .text {
    text-shadow: 0px 0px 16px #13a3ff;
}
.num-statistic .chart-box:nth-of-type(2) .text {
    text-shadow: 0px 0px 16px #10e4ff;
}
.num-statistic .chart-box:nth-of-type(3) .text {
    text-shadow: 0px 0px 16px #ffdc62;
}
.num-statistic .chart-box:nth-of-type(4) .text {
    text-shadow: 0px 0px 16px #ff4989;
}
.num-statistic .chart-box:nth-of-type(5) .text {
    text-shadow: 0px 0px 16px #00ff00;
}
.num-statistic .chart-box:nth-of-type(6) .text {
    text-shadow: 0px 0px 16px #ffa613;
}
.num-statistic .chart-box:nth-of-type(7) .text {
    text-shadow: 0px 0px 16px #a56fff;
} */
.statistic-item .num {
    margin-top: 6px;
    font-size: 32px;
    color: #999;
}
.statistic-item-bottom{
    padding:0px 27px 20px;
    box-sizing: border-box;
}
.statistic-item-bottom i{
    width: 6px;
    height: 6px;
    border-radius:50%;
    display: inline-block;
    margin-right: 3px;
}
.statistic-item-bottom>div div:nth-child(1) span{
    font-size:12px;
    color:#666;
}

.statistic-item-bottom .color1 i{
    background-color: #13a3ff;
}
.statistic-item-bottom .color1 div:nth-child(2) span{
    font-size: 18px;
    color: #13a3ff;
}

.statistic-item-bottom .color2 i{
    background-color: #10e4ff;
}
.statistic-item-bottom .color2 div:nth-child(2) span{
    font-size: 18px;
    color: #10e4ff;
}

.statistic-item-bottom .color3 i{
    background-color: #ffdc62;
}
.statistic-item-bottom .color3 div:nth-child(2) span{
    font-size: 18px;
    color: #ffdc62;
}
.statistic-item-bottom .color4 i{
    background-color: #ff4989;
}
.statistic-item-bottom .color4 div:nth-child(2) span{
    font-size: 18px;
    color: #ff4989;
}
.statistic-item-bottom .color5 i{
    background-color: #00ff00;
}
.statistic-item-bottom .color5 div:nth-child(2) span{
    font-size: 18px;
    color: #00ff00;
}
.statistic-item-bottom .color6 i{
    background-color: #ffa613;
}
.statistic-item-bottom .color6 div:nth-child(2) span{
    font-size: 18px;
    color: #ffa613;
}
.statistic-item-bottom .color7 i{
    background-color: #a56fff;
}
.statistic-item-bottom .color7 div:nth-child(2) span{
    font-size: 18px;
    color: #a56fff;
}

.chart-top {
    position: absolute;
    left: 0;
    top: 0;
    height: 50px;
    .title {
        color: #333;
        font-size: 16px;
        /*font-weight: bold;*/
        /* text-shadow: 0px 0px 6px #00cffb, 0px 0px 6px #00cffb; */
    }
    .defense-title {
        /* text-shadow: 0px 0px 6px #98370a, 0px 0px 6px #98370a; */
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
.changeAttrack>div{
    color: #606266;
    font-size: 14px;
    margin: 0 5px;
    cursor:pointer;
}
.changeAttrack>div.active{
    @include themeify {
        color: themed('theme-color');
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
}

.event ::v-deep .el-range-separator {
    color: #fff;
}
.event ::v-deep .el-radio__label,
.event ::v-deep .el-checkbox__label {
    color: #fff;
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
        box-shadow: 0 0 3px rgba(0, 186, 255, .73) inset;
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
        &:nth-child(2n+1) {
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

.statistic-item>.icon i.color1,
.statistic-item .color1 {
    color: #13a3ff;
}

.statistic-item>.icon i.color2,
.statistic-item .color2 {
    color: #10e4ff;
}

.statistic-item>.icon i.color3,
.statistic-item .color3 {
    color: #ffdc62;
}

.statistic-item>.icon i.color4,
.statistic-item .color4 {
    color: #ff4989;
}

.statistic-item>.icon i.color5,
.statistic-item .color5 {
    color: #00ff00;
}
.statistic-item>.icon i.color6,
.statistic-item .color6 {
    color: #ffa613;
}
.statistic-item>.icon i.color7,
.statistic-item .color7 {
    color: #a56fff;
}
.change-box {
    height: 30px;
}

.change-box>div.time-btn {
    min-width: 55px;
    text-align: center;
    font-size: 12px;
    color: #39caf3;
    padding: 4px 4px;
    margin-right: 10px;
    cursor: pointer;
    /* box-shadow: inset 0px 0px 10px 0px rgba(0, 167, 245, 0.97); */
    border-radius: 3px;
    border: 1px solid #39caf3;
}

.change-box>div.active {
    background-color: #00c0ff;
    box-shadow: inset 0px 0px 35px 0px #00a7f5;
    border: 1px solid #00c0ff;
    color: #fff;
}

.change-box ::v-deep .el-range-editor--mini.el-input__inner {
    height: 26px;
}
.change-btn{
    cursor: pointer;
    >i{
        font-size:13px;
        color:#13a3ff;
        margin-right: 10px;
    }
    >a{
        cursor: pointer;
        font-size:13px;
        color:#13a3ff;
    }
}
</style>
<style>
.drill-table {
    background: rgba(0, 0, 0, 0)!important;
    min-height: 0!important;
}

.drill-table .sortRank div {
    color: #13a3ff;
}
.drill-table th,
.drill-table td {
    padding:10px 0;
}
.drill-table th,
.drill-table tr {
    background: rgba(0, 0, 0, 0)!important;
}

.drill-table td,
.drill-table th.is-leaf {
    border-color: #d7d7d7!important;
    color: #fff;
}

.el-table--border::after,
.el-table--group::after,
.el-table::before {
    background-color: #d7d7d7!important;
}

.drill-table.el-table--enable-row-hover .el-table__body tr:hover>td {
    background: rgba(0, 0, 0, 0)!important;
}

.drill-table .cell {
    color: #fff;
}
