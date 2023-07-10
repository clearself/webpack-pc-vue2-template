<template>
    <div class="event">
        <div class="w100">
            <div class="event-content w100">
                <div class="ub w100 num-statistic">
                    <div class="ub ub-f1 chart-box bg">
                        <div class="ub ub-f1 ub-ac statistic-item">
                            <div class="ub ub-ver">
                                <div class="text ml-2"><i class="iconfont icon-yanlianzongliang" style="font-size:14px;color:#8b8b8b;margin-right:5px"></i>演练总量</div>
                                <div class="num" style="color:#8b8b8b;margin-left:35px">{{drillStatisticData._allNum}}<p style="font-size: 20px;display: inline-block;vertical-align: middle;margin-top: -6px">{{drillStatisticData.allNum>9999 ? '万': ''}}</p></div>
                            </div>
                            <div class="ub-f1 text-right">
                                <img src="../../assets/img/defense_drill/01.png">
                            </div>
                        </div>
                    </div>
                    <div class="ub ub-f1 chart-box bg">
                        <div class="ub ub-f1 ub-ac statistic-item">
                            <div class="ub ub-ver">
                                <div class="text ml-2"><i class="iconfont icon-benyueyiyanlian" style="font-size:14px;color:rgba(56,125,238,1);margin-right:5px"></i>本月已演练</div>
                                <div class="num" style="color:rgba(56,125,238,1);margin-left:35px">{{drillStatisticData._monthStartNum}}<p style="font-size: 20px;display: inline-block;vertical-align: middle;margin-top: -6px">{{drillStatisticData.monthStartNum>9999 ? '万': ''}}</p></div>
                            </div>
                            <div class="ub-f1 text-right">
                                <img src="../../assets/img/defense_drill/02.png">
                            </div>
                        </div>
                    </div>
                    <div class="ub ub-f1 chart-box bg">
                        <div class="ub ub-f1 ub-ac statistic-item">
                            <div class="ub ub-ver">
                                <div class="text ml-2"><i class="iconfont icon-jinhangzhong" style="font-size:14px;color:rgba(242,153,95,1);margin-right:5px"></i>进行中演练</div>
                                <div class="num" style="color:rgba(242,153,95,1);margin-left:35px">{{drillStatisticData._runNum}}<p style="font-size: 20px;display: inline-block;vertical-align: middle;margin-top: -6px">{{drillStatisticData.runNum>9999 ? '万': ''}}</p></div>
                            </div>
                            <div class="ub-f1 text-right">
                                <img src="../../assets/img/defense_drill/03.png">
                            </div>
                        </div>
                    </div>
                    <div class="ub ub-f1 chart-box bg">
                        <div class="ub ub-f1 ub-ac statistic-item">
                            <div class="ub ub-ver">
                                <div class="text ml-2"><i class="iconfont icon-yijieshudeyanlian" style="font-size:14px;color:rgba(189,80,211,1);margin-right:5px"></i>已结束演练</div>
                                <div class="num" style="color:rgba(189,80,211,1);margin-left:35px">{{drillStatisticData._endNum}}<p style="font-size: 20px;display: inline-block;vertical-align: middle;margin-top: -6px">{{drillStatisticData.endNum>9999 ? '万': ''}}</p></div>
                            </div>
                            <div class="ub-f1 text-right">
                                <img src="../../assets/img/defense_drill/04.png">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="chart-box w100 border" style="height:320px;margin: 10px 0;padding-top:50px;">
                    <div class="ub ub-pj ub-ac w100 chart-top" style="padding:0 10px;box-sizing: border-box;">
                        <div class="title">年度攻防演练趋势</div>
                    </div>
                    <div v-loading="logs_loading" style="width:100%;height:100%;cursor: pointer;padding: 2px;box-sizing: border-box;">
                        <!-- <div v-if="!logs_no_data" class="ub ub-f1 ub-ac ub-pc" style="height:100%;color:rgba(0,0,0,.4);font-size:14px; cursor: pointer;">
                            暂无数据
                        </div> -->
                        <brokenLine :chartData="brokenData" v-if="brokenData.length>0" />
                    </div>
                </div>
                <div class='ub ub-pj w100'>
                    <div class="chart-box border" style="width:49.7%;padding-top:50px;min-height: 400px">
                        <div class="ub ub-pj ub-ac w100 chart-top" style="padding:0 10px;box-sizing: border-box;">
                            <div class="title">年度攻击方排名</div>
                        </div>
                        <div class="work-table">
                            <el-table v-loading="attrack_loading" class="drill-table" :data="attrackData" style="width: 98%;margin: 0 auto;min-height: 0px">
                                <el-table-column type="index" label="排名" width="100" class-name="sortRank">
                                </el-table-column>
                                <el-table-column prop="teamName" label="攻击方">
                                </el-table-column>
                                <el-table-column align="center" label="得分" width="100">
                                    <template slot-scope="scope">
                                        <p style="color:rgba(0,82,217,1);">{{scope.row.score}}</p>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                    <div class="chart-box border" style="width:49.7%;padding-top:50px;min-height: 400px">
                        <div class="ub ub-pj ub-ac w100 chart-top" style="padding:0 10px;box-sizing: border-box;">
                            <div class="title defense-title">年度防守方排名</div>
                        </div>
                        <div class="work-table">
                            <el-table v-loading="defense_loading" class="drill-table" :data="defenseData" style="width: 98%;margin: 0 auto;">
                                <el-table-column type="index" label="排名" width="100" class-name="sortRank">
                                </el-table-column>
                                <el-table-column prop="teamName" label="防守方">
                                </el-table-column>
                                <el-table-column align="center" label="得分" width="100">
                                    <template slot-scope="scope">
                                        <p style="color:rgba(227,77,89,1);">{{scope.row.score}}</p>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    </div>
</template>

<script>
import {
    getDrillStatistic,
    getDrillBrokenLine,
    getAttrackRank,
    getDefenseRank
} from '../../server/defense_drill/overview.js'
import brokenLine from './charts/brokenLine.vue'
export default {
    name: 'Overview',
    components: {
        brokenLine
    },
    data() {
        return {
            drillStatisticData: {
                monthStartNum: 0,
                runNum: 0,
                endNum: 0,
                allNum: 0,

                _monthStartNum: 0,
                _runNum: 0,
                _endNum: 0,
                _allNum: 0

            },

            // 折线
            logs_loading: true,
            logs_no_data: true,
            brokenData: [],
            // 年度攻击
            attrack_loading: true,
            attrackData: [],
            // 年度防守
            defense_loading: true,
            defenseData: []
        }
    },

    mounted() {
        this.$nextTick(() => {
            this.initDrillStatistic()
            this.initDrillBrokenLine()
            this.initAttrack()
            this.initDefense()
        })
    },
    methods: {

        initDrillStatistic() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            getDrillStatistic(data).then(res => {
                console.log('演练统计', res)
                this.drillStatisticData = res

                this.drillStatisticData._monthStartNum = this.$numChange((res.monthStartNum ? res.monthStartNum : 0))
                this.drillStatisticData._runNum = this.$numChange((res.runNum ? res.runNum : 0))
                this.drillStatisticData._endNum = this.$numChange((res.endNum ? res.endNum : 0))
                this.drillStatisticData._allNum = this.$numChange((res.allNum ? res.allNum : 0))
            }).catch(error => {
                console.log('error' + error)
            })
        },
        initDrillBrokenLine() {
            this.logs_loading = true
            this.logs_no_data = true
            this.brokenData = []
            let data = {
                queryData: {},
                paramsData: {}
            }
            getDrillBrokenLine(data).then(res => {
                console.log('演练折线统计', res)
                this.logs_loading = false
                if (res.length > 0) {
                    this.logs_no_data = false
                    this.brokenData = res
                }
            }).catch(error => {
                this.logs_loading = false
                this.logs_no_data = false
                console.log('error' + error)
            })
        },
        initAttrack() {
            this.attrack_loading = true
            this.attrackData = []
            let data = {
                queryData: {},
                paramsData: {}
            }
            getAttrackRank(data).then(res => {
                console.log('年度攻击', res)
                this.attrack_loading = false
                if (res.length > 0) {
                    res.forEach(item => {
                        let obj = {}
                        obj.teamName = item.teamName
                        obj.score = item.score
                        this.attrackData.push(obj)
                    })
                }
            }).catch(error => {
                this.attrack_loading = false
                console.log('error' + error)
            })
        },
        initDefense() {
            this.defense_loading = true
            this.defenseData = []
            let data = {
                queryData: {},
                paramsData: {}
            }
            getDefenseRank(data).then(res => {
                console.log('年度防守', res)
                this.defense_loading = false
                if (res.length > 0) {
                    res.forEach(item => {
                        let obj = {}
                        obj.teamName = item.teamName
                        obj.score = item.score
                        this.defenseData.push(obj)
                    })
                }
            }).catch(error => {
                this.defense_loading = false
                console.log('error' + error)
            })
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
        height: 100px;
        margin-right: 10px;
    }

    .num-statistic>div:last-child {
        margin-right: 0px;
    }

    .chart-box {
        position: relative;
        span {
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
    }

    .chart-box.border {
        background:#fff;
        border-radius: 4px;
        // border: 1px solid #00274e;
    }

    .chart-box.bg {
        background-color: #FFFFFF;
        border-radius: 4px;
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
        font-size: 13px;
        color: rgba(0,0,0,0.9);
    }

    .statistic-item .num {
        margin-top: 6px;
        font-size: 20px;
        color: #fff;
    }

    .chart-top {
        position: absolute;
        left: 0;
        top: 0;
        height: 50px;
        .title {
            color: rgba(0,0,0,.9);
            font-size: 14px;
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
        color: #fff;
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
        color: #a56fff;
    }

    .statistic-item>.icon i.color5,
    .statistic-item .color5 {
        color: #ff52ab;
    }

</style>
<style scoped lang="scss">
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
            border:none !important;
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
    /* .drill-table{
        background: rgba(0,0,0,0)!important;
        min-height: 0!important;
    }
    .drill-table .sortRank div {
        color: #00e9ff;
    }
    .drill-table th, .drill-table tr {
        background: rgba(0,0,0,0)!important;
    }

    .drill-table td, .drill-table th.is-leaf {
        border-color: #343537!important;
        color:#fff!important;
    }
    .el-table--border::after, .el-table--group::after, .el-table::before{
        background-color:#343537!important;
    }
    .drill-table.el-table--enable-row-hover .el-table__body tr:hover>td{
        background: rgba(0,0,0,0)!important;
    }
    .drill-table .cell{
        color:#fff!important;
    } */
</style>
