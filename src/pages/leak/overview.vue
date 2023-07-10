<template>
    <div class="event overview leak">
        <div class="w100">
            <div class="event-content w100">
                <div class="top-chart w100 ub ub-pj">
                    <div class="chart-box w100 border">
                        <div class="ub ub-pj ub-ac">
                            <div class="chart-title">漏洞类型统计</div>
                        </div>
                        <div style="width:100%;height:230px;">
                            <Bar :chartData="barData" name="数量" type="1" :isData="bar_no_data" />
                        </div>
                    </div>
                    <div class="chart-box w100 border">
                        <div class="ub ub-pj ub-ac">
                            <div class="chart-title">漏洞等级分布</div>
                        </div>
                        <div style="width:100%;height:230px;">
                            <Pie :chartData="levelData" name="数量" type="1" :isData="level_no_data" />
                        </div>
                    </div>
                    <div class="chart-box w100 border">
                        <div class="ub ub-pj ub-ac">
                            <div class="chart-title">实时漏洞更新</div>
                        </div>
                        <div class="leak-table" style="width:100%;height:230px;padding:0 10px;box-sizing:border-box;">
                            <el-table ref="multipleTable" v-loading="loading" :data="tableData" style="min-height: 0px">
                                <el-table-column prop="nodeName" label="漏洞名称" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column prop="ip" label="IP" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column prop="createTime" label="发现时间" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column align="center" label="操作" width="60">
                                    <template slot-scope="{row}">
                                        <span style="color: #0052d9;text-decoration: underline;cursor: pointer;" @click="handelSee(row)">查看</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </div>
                <div class="center-chart w100 ub">
                    <div class="chart-box w100 border" style="padding: 10px;height:300px;">
                        <div class="ub ub-pj ub-ac">
                            <div class="chart-title">年度漏洞统计趋势</div>
                        </div>
                        <div style="width:100%;height:230px;">
                            <brokenLine :chartData="yearData" name="数量" type="1" :isData="year_no_data" />
                        </div>
                    </div>
                </div>
                <div class="bottom-chart w100 ub ub-pj">
                    <div class="chart-box w100 border">
                        <div class="ub ub-pj ub-ac">
                            <div class="chart-title">漏洞类型趋势</div>
                        </div>
                        <div style="width:100%;height:230px;">
                            <brokenLineMut :chartData="leakTypeTendData"  :isData="leak_type_tend_no_data" />
                        </div>
                    </div>
                    <div class="chart-box w100 border">
                        <div class="ub ub-pj ub-ac">
                            <div class="chart-title">漏洞类型等级分布</div>
                        </div>
                        <div style="width:100%;height:230px;">
                            <TypeBar :chartData="leakTypeLevelData" type="1"  :isData="leak_type_level_no_data" />
                        </div>
                    </div>
                    <div class="chart-box w100 border">
                        <div class="ub ub-pj ub-ac">
                            <div class="chart-title">业务系统漏洞等级分布TOP10</div>
                        </div>
                        <div style="width:100%;height:230px;">
                            <TypeBar :chartData="systemData" type="2"  :isData="system_no_data" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog title="详情" :visible.sync="detailDialog" width="50%" custom-class="attendance-dialog">
            <div class="ub w100 ub-ver baseInfo-list">
                <div class="ub w100 baseInfo-list-item">
                    <div>漏洞名称 </div>
                    <div class="ub ub-f1">{{detailFORM.nodeName}}</div>
                </div>
                <div class="ub w100 baseInfo-list-item">
                    <div>危险级别</div>
                    <div class="ub ub-f1">
                        <span style="color:#0088d8;" v-if="detailFORM.riskLevel==1">
                            {{detailFORM.riskLevelCN}}
                        </span>
                        <span style="color:#f5ed6b;" v-if="detailFORM.riskLevel==2">
                            {{detailFORM.riskLevelCN}}
                        </span>
                        <span style="color:#f76801;" v-if="detailFORM.riskLevel==3">
                            {{detailFORM.riskLevelCN}}
                        </span>
                        <span style="color:#6bfcfc;" v-if="detailFORM.riskLevel==4">
                            {{detailFORM.riskLevelCN}}
                        </span>
                    </div>
                </div>
                <div class="ub w100 baseInfo-list-item">
                    <div>漏洞类型</div>
                    <div class="ub ub-f1">{{detailFORM.leakTypeCN}}</div>
                </div>
                <div class="ub w100 baseInfo-list-item">
                    <div>ip</div>
                    <div class="ub ub-f1">{{detailFORM.ip}}</div>
                </div>
                <div class="ub w100 baseInfo-list-item">
                    <div>创建时间</div>
                    <div class="ub ub-f1">{{detailFORM.createTime}}</div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    get_leak_type,
    get_leak_level,
    get_year_statistic,
    get_leak_type_tend,
    get_leak_type_level,
    get_system_leak,
    get_overview_table
} from '../../server/leak/api.js'

import brokenLine from './charts/brokenLine.vue'
import brokenLineMut from './charts/brokenLineMut.vue'
import Bar from './charts/bar.vue'
import Pie from './charts/pie.vue'
import TypeBar from './charts/typeBar.vue'

export default {
    name: 'Overview',
    components: {
        brokenLine,
        brokenLineMut,
        Bar,
        Pie,
        TypeBar
    },
    data() {
        return {
            detailDialog: false,
            detailFORM: {},
            system_no_data: false,
            systemData: [],
            year_no_data: false,
            yearData: [],
            leak_type_level_no_data: false,
            leakTypeLevelData: [],
            leak_type_tend_no_data: false,
            leakTypeTendData: [],
            loading: false,
            tableData: [{}],
            bar_no_data: true,
            barData: [],
            level_no_data: true,
            levelData: []
        }
    },
    computed: {},
    mounted() {
        this.$nextTick(() => {
            this.initPage()
        // setInterval(() => {
        //     this.initPage();
        // }, 1000*60)
        })
    },
    methods: {
        handelSee(row) {
            this.$set(this, 'detailFORM', row)
            this.detailDialog = true
        },
        back() {
            this.$router.go(-1)
        },
        initPage() {
            this.initLeakType()
            this.initLeakLevel()
            this.initLeakYearStatistic()
            this.initLeakTypeTend()
            this.initLeakTypeLevel()
            this.initSystemLeak()
            this.initTable()
        },
        initTable() {
            this.loading = true
            this.tableData = []
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_overview_table(data).then(res => {
                console.log('table', res)
                this.loading = false
                if (res.length > 0) {
                    res.map((item, index) => {
                        if (index < 6) {
                            this.tableData.push(item)
                        }
                    })
                }
            }).catch(error => {
                console.log(error + 'error')
            })
        },
        initSystemLeak() {
            this.system_no_data = true
            this.systemData = []
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_system_leak(data).then(res => {
                console.log('系统漏洞类型级别', res)
                if (res.length > 0) {
                    this.system_no_data = false
                    this.systemData = res.map(item => {
                        return item
                    })
                } else {
                    this.system_no_data = true
                }
            }).catch(error => {
                console.log(error + 'error')
            })
        },
        initLeakTypeLevel() {
            this.leak_type_level_no_data = true
            this.leakTypeLevelData = []
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_leak_type_level(data).then(res => {
                console.log('漏洞类型级别', res)
                if (res.length > 0) {
                    this.leak_type_level_no_data = false
                    this.leakTypeLevelData = res.map(item => {
                        return item
                    })
                } else {
                    this.leak_type_level_no_data = true
                }
            }).catch(error => {
                console.log(error + 'error')
            })
        },
        initLeakType() {
            this.bar_no_data = true
            this.barData = []
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_leak_type(data).then(res => {
                console.log('漏洞类型统计', res)
                if (res.length > 0) {
                    this.bar_no_data = false
                    this.barData = res.map(item => {
                        return {
                            name: item.name,
                            value: item.num
                        }
                    })
                } else {
                    this.bar_no_data = true
                }
            }).catch(error => {
                console.log(error + 'error')
            })
        },
        initLeakLevel() {
            this.level_no_data = true
            this.levelData = []
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_leak_level(data).then(res => {
                console.log('漏洞级别统计', res)
                if (res.length > 0) {
                    this.level_no_data = false
                    this.levelData = res.map(item => {
                        return {
                            name: item.leakTypeCN,
                            value: item.num
                        }
                    })
                } else {
                    this.level_no_data = true
                }
            }).catch(error => {
                console.log(error + 'error')
            })
        },
        initLeakYearStatistic() {
            this.year_no_data = true
            this.yearData = []
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_year_statistic(data).then(res => {
                console.log('漏洞年度统计', res)
                if (res.length > 0) {
                    this.year_no_data = false
                    this.yearData = res.map(item => {
                        return {
                            name: item.createMonth,
                            value: item.num
                        }
                    })
                } else {
                    this.year_no_data = true
                }
            }).catch(error => {
                console.log(error + 'error')
            })
        },
        initLeakTypeTend() {
            this.leak_type_tend_no_data = true
            this.leakTypeTendData = []
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_leak_type_tend(data).then(res => {
                console.log('漏洞类型趋势', res)
                if (res.length > 0) {
                    this.leak_type_tend_no_data = false
                    this.leakTypeTendData = res.map(item => {
                        return item
                    })
                } else {
                    this.leak_type_tend_no_data = true
                }
            }).catch(error => {
                console.log(error + 'error')
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
.leak-table ::v-deep .el-table th, .leak-table ::v-deep .el-table tr{
    background-color: #fff;
}
.top-chart {
    height: 282px;

    &>div {
        width: 32%;
        height: 100%;
    }
}

.center-chart {
    margin: 10px 0;
}

.bottom-chart {
    height: 280px;
    margin-bottom: 20px;
    &>div {
        width: 32%;
        height: 100%;
    }
}

.chart-box {
    position: relative;
    box-sizing: border-box;
    background-color: #ffffff;
    box-shadow: 0px 2px 8px 0px rgba(140, 152, 164, 0.2);
    border-radius: 4px;
    border: solid 1px #dadee8;
    .chart-title {
        margin: 10px;
        height: 20px;
        line-height: 20px;
        font-size: 14px;
        // padding-left: 10px;
        font-weight: 500;
        color: rgba(0, 0, 0, .9);
        position: relative;
    }
}

.chart-box.bg {
    background-color: #fff;
}

.chart-top {
    height: 30px;

    .title {
        color: rgba(0, 0, 0, .9);
        font-size: 16px;
        /*border-left: 4px solid #5ed8ff;*/
        line-height: 22px;
        padding-left: 12px;
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

    .back {
        margin-left: 20px;
    }

    .back>div {
        cursor: pointer;
        color: #5ed8ff;
        font-size: 13px;
        margin-right: 6px;

        i {
            color: #5ed8ff;
            font-size: 12px;
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

.el-table ::v-deep .el-table__footer-wrapper tbody td {
    background-color: rgba(0, 0, 0, 0);
    color: #fff;
}

.title:before {
    width: 4px;
    height: 24px;
    content: ' ';
    position: absolute;
    left: 0px;
    top: 2px;
    border-radius: 3px;
    background: #00e9ff;
}

.leak-table {
    ::v-deep .el-table::before{
        height:0;
    }
    ::v-deep .el-table {
        background: transparent;
        border: none;
        position: relative;

        .el-table__header tr {
            background: transparent;
        }

        .cell {
            height: 32px !important;
            line-height: 34px;
            color: rgba(0, 0, 0, .9);
        }

        td {
            padding: 0;
            line-height: 34px;
        }

        th {
            padding: 0;
            color: #0052d9;
            background-color: transparent;
            font-size: 12px;
        }

        th.is-leaf {
            border-color: transparent;

            .cell {
                color: #0052d9;
                font-weight: normal;
            }
        }

        tr {
            // box-shadow: 0 0 10px rgba(0, 168, 255, .2) inset;
            position: relative !important;

            td {
                // border: none;
            }

            td:first-child {
                border: 1px;
            }

            td:last-child {
                border: 1px;
            }

            /* background:url("../assets/img/listBg.png") center no-repeat;
            background-size: 130% 100%;*/
            opacity: 1;
        }
    }

    ::v-deep .el-table::before {
        // background: rgba(0, 168, 255, .2);
        left: 2px;
        right: 2px;

    }

    ::v-deep .el-table--enable-row-hover .el-table__body tr:hover>td {
        background: transparent !important;
    }
}
.baseInfo-list {
    border-radius: 4px;
}

.baseInfo-list-item {
    height: 34px;
    margin-top: -2px;
    background-color: #fff;
    border: 1px solid #ddd;
}

.baseInfo-list-item:nth-child(1) {
    margin-top: 0;
}

.baseInfo-list-item>div:nth-child(1) {
    width: 200px;
    height: 32px;
    line-height: 32px;
    text-indent: 10px;
    font-size: 12px;
    color: rgba(0, 0, 0, .9);
    background-color: #fff;
    border-right: 1px solid #ddd;
    // border: solid 1px rgba(0, 0, 0, .9);
}

.baseInfo-list-item>div:nth-child(2) {
    height: 32px;
    line-height: 32px;
    text-indent: 10px;
    font-size: 12px;
    color: rgba(0, 0, 0, .9);
}
</style>
<style>
.time-box .el-picker-panel__footer>button:nth-child(1) {
    display: none !important;
}
</style>
