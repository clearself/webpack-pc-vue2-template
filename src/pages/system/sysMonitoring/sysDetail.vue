<template>
    <div class="event w100" v-loading="reqLoading">
        <div class="topHead">
            <i class="el-icon-back back" style="font-size: 22px; color: #409eff;" @click="$router.go(-1)"></i>
            <CustomDate
                class="tpCusBox"
                :append-to-body="true"
                :chart-time-range="chartTimeRange"
                @getCustomTime="getCustomTime"
                @getDateData="getDateData"
                :inputWidth="292"
                @useing="customDateUse"
                :current-type="2"
                :empty="false"
                ref="customDate"
                :xiangxi="xiangxi"></CustomDate>
            <Refresh style="margin-right: 21px" @selectChange="selectChange"/>
        </div>
        <div class="topCon">
            <div class="topLeft wrapBg">
                <div class="boxTit">
                    <div class="block"></div>
                    <div class="tex">系统状态</div>
                </div>
                <div class="infoBox">
                    <div :class="{'err':sysObj.status != 1}" class="statusLogo"></div>
                    <div v-if="sysObj.status == 1" class="statusTex">正常</div>
                    <div v-else class="statusTex err">异常</div>
                    <!-- <div style="margin-bottom: 38px" class="infoTit">设备IP：{{ sysObj.ip }}</div> -->
                    <div style="margin-top: 38px" class="desItem">主机名称：{{ sysObj.name }}</div>
                    <div class="desItem">主机IP：{{ sysObj.ip }}</div>
                    <div class="desItem">运行时间：{{ sysObj.runTime }}</div>
                </div>
            </div>
            <div class="topRight">
                <div class="cpuBox wrapBg">
                    <div class="boxTit">
                        <div class="block"></div>
                        <div class="tex">cpu利用率</div>
                    </div>
                    <div class="chartWrap">
                        <cpuChart ref="cpuChart" :chartMes="cpuMes"></cpuChart>
                        <el-empty :image-size="100" v-show="!cpuMes" class="empBox" description="暂无数据"></el-empty>
                    </div>
                </div>
                <div class="storageSpaBox wrapBg">
                    <div class="boxTit">
                        <div class="block"></div>
                        <div class="tex">储存空间占用</div>
                    </div>
                    <div class="chartWrap">
                        <stoChart ref="stoChart" :chartMes="stoMes"></stoChart>
                        <el-empty :image-size="100" v-show="!stoMes" class="empBox" description="暂无数据"></el-empty>
                    </div>
                </div>
            </div>
        </div>

        <div class="secBox">
            <div class="memoryUtiBox wrapBg">
                <div class="boxTit">
                    <div class="block"></div>
                    <div class="tex">内存利用率</div>
                </div>
                <div class="chartWrap">
                    <memChart ref="memChart" :chartMes="memMes"></memChart>
                    <el-empty :image-size="100" v-show="!memMes" class="empBox" description="暂无数据"></el-empty>
                </div>
            </div>
            <div style="margin-left: 10px" class="epsBox wrapBg">
                <div class="boxTit">
                    <div class="block"></div>
                    <div class="tex">实时处理EPS</div>
                </div>
                <div class="chartWrap">
                    <epsChart ref="epsChart" :chartMes="epsMes"></epsChart>
                    <el-empty :image-size="100" v-show="!epsMes" class="empBox" description="暂无数据"></el-empty>
                </div>
            </div>
        </div>

        <div class="botCon">
            <div class="netBox wrapBg">
                <div class="boxTit">
                    <div class="block"></div>
                    <div class="tex">网络I/O</div>
                </div>
                <div class="chartWrap">
                    <netChart :colorArr="colorArr1" ref="netChart" :chartMes="netMes"></netChart>
                    <el-empty :image-size="100" v-show="!netMes" class="empBox" description="暂无数据"></el-empty>
                </div>
                <table v-if="netTbArr && netTbArr.length" class="botTable">
                    <thead>
                        <tr>
                            <th style="width: 24%"></th>
                            <th>Min</th>
                            <th>Max</th>
                            <th>Avg</th>
                            <th>Current</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,index) in netTbArr" :key="index">
                            <td class="firstTd">
                                <div :style="{'background-color':colorArr1[index]}" class="legend"></div>
                                {{ item.name }}
                            </td>
                            <td>{{ byteConversion(item.min) }}</td>
                            <td>{{ byteConversion(item.max) }}</td>
                            <td>{{ byteConversion(item.avg) }}</td>
                            <td>{{ byteConversion(item.current) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="diskBox wrapBg">
                <div class="boxTit">
                    <div class="block"></div>
                    <div class="tex">磁盘I/O</div>
                </div>
                <div class="chartWrap">
                    <diskChart :colorArr="colorArr2" ref="diskChart" :chartMes="diskMes"></diskChart>
                    <el-empty :image-size="100" v-show="!diskMes" class="empBox" description="暂无数据"></el-empty>
                </div>
                <table v-if="diskTbArr && diskTbArr.length" class="botTable">
                    <thead>
                        <tr>
                            <th style="width: 24%"></th>
                            <th>Min</th>
                            <th>Max</th>
                            <th>Avg</th>
                            <th>Current</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,index) in diskTbArr" :key="index">
                            <td class="firstTd">
                                <div :style="{'background-color':colorArr1[index]}" class="legend"></div>
                                {{ item.name }}
                            </td>
                            <td>{{ item.min }}</td>
                            <td>{{ item.max }}</td>
                            <td>{{ item.avg }}</td>
                            <td>{{ item.current }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="lasBox">
            <div class="logNumBox wrapBg w50">
                <div class="boxTit">
                    <div class="block"></div>
                    <div class="tex">数据报送统计</div>
                </div>
                <div class="chartWrap">
                    <staticChart ref="staticChart" :chartMes="logNumMes"></staticChart>
                    <el-empty :image-size="100" v-show="!logNumMes" class="empBox" description="暂无数据"></el-empty>
                </div>
            </div>
            <div class="logSizBox wrapBg w50">
                <div class="boxTit">
                    <div class="block"></div>
                    <div class="tex">数据采集EPS</div>
                </div>
                <div style="height: calc(100% - 21px)" class="chartWrap">
                    <dataChart ref="dataChart" :chartMes="dataMes"></dataChart>
                    <el-empty :image-size="100" v-show="!dataMes" class="empBox" description="暂无数据"></el-empty>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Refresh from '../../../components/sysMan/refresh/index.vue'
import CustomDate from '../../../components/sysMan/custom_date/index.vue'
import cpuChart from './chart/cpuChart.js'
import diskChart from './chart/diskChart.js'
import memChart from './chart/memChart.js'
import netChart from './chart/netChart.js'
import stoChart from './chart/stoChart.js'
import epsChart from './chart/epsChart.js'
import dataChart from './chart/dataChart.js'
import staticChart from './chart/staticChart.js'

import {
    getSystemMonitorInfoReq
} from '@/server/system/sysMonitoring.js'

export default {
    name: 'Index',
    components: {
        Refresh,
        CustomDate,
        cpuChart,
        diskChart,
        memChart,
        netChart,
        stoChart,
        epsChart,
        dataChart,
        staticChart
    },
    data() {
        return {
            queryForm: {
                id: ''
            },
            sayTimes: [],
            row: {},

            sysObj: {},
            reqLoading: false,
            cpuMes: [],
            memMes: [],
            stoMes: [],
            netMes: [],
            diskMes: [],
            epsMes: [],
            logNumMes: [],
            dataMes: [],

            netTbArr: [],
            diskTbArr: [],
            colorArr1: ['#b38ce2', '#f5bd46', '#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83',
                '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
            colorArr2: ['#bb1687', '#5ca1ff', '#b38ce2', '#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83',
                '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
            chartTimeRange: [],
            xiangxi: '',
            deleteId: null,
            deleteDialog: false,
            refreshVal: '',
            queryNum: 0,
            timer: null
        }
    },
    computed: {},
    watch: {},
    methods: {
        initPage() {
            // this.loading = true
            this.sysObj = this.$getsessionStorage('machiDetail') || {}
            this.get_data()
            console.log(this.sysObj)
            // moment(new Date().getTime()).diff(moment(new Date(this.sysObj.createTime).getTime()), 'seconds'
            // console.log(this.getGapTime(runTime), '12312312312zzzzzzzz')
            // getAttrList(data).then(res => {
            //     console.log(res)
            //     this.loading = false
            // }).catch(error => {
            //     this.loading = false
            //     console.log('error' + error)
            // })
        },
        isDataEmpty(data) {
            if (!data) {
                return null
            } else {
                if (data instanceof Array && !data.length) {
                    return null
                } else if (data instanceof Object && JSON.stringify(data) == '{}') {
                    return null
                }
            }
            return data
        },
        byteConversion(b) {
            if (!b) return ''
            const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
            let l = 0
            let n = parseInt(b, 10) || 0
            while (n >= 1024 && ++l) {
                n = n / 1024
            }
            return (n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l])
        },
        get_data() {
            this.reqLoading = true
            let data = {
                queryData: {},
                paramsData: {
                    // serviceId: '943a2055cf2c7999e44768b939d91b37',
                    // beginTime: '2023-03-17 11:46:00',
                    // endTime: '2023-03-17 11:50:00'

                    beginTime: this.sayTimes[0] || '',
                    endTime: this.sayTimes[1] || '',
                    serviceId: this.sysObj.id
                }
                // paramsData: { beginTime: '2023-03-22 15:00:00', endTime: '2023-03-22 17:00:00', serviceId: '943a2055cf2c7999e44768b939d91b37' }
            }
            // console.log(data)
            this.getGapTime()
            // this.loading = true
            getSystemMonitorInfoReq(data).then(res => {
                console.log(res)
                this.cpuMes = this.isDataEmpty(res.smList)
                this.stoMes = {
                    residualCap: res.residualCap,
                    totalCap: res.totalCap
                }
                this.memMes = this.isDataEmpty(res.smList)
                this.netMes = this.isDataEmpty(res.netIO)
                this.diskMes = this.isDataEmpty(res.diskIO)
                this.netTbArr = this.isDataEmpty(res.netTb)
                this.diskTbArr = this.isDataEmpty(res.diskTb)
                this.epsMes = this.isDataEmpty(res.processingEps)
                this.dataMes = this.isDataEmpty(res.collecEpsInfo)
                this.logNumMes = this.isDataEmpty(res.staticReport)

                // processingEps
                // this.memMes = ['']
                // this.stoMes = ['']
                // this.netMes = ['']
                // this.diskMes = ['']
                // this.epsMes = ['']
                // this.dataMes = ['']
                // this.loading = false
                this.reqLoading = false
            }).catch(error => {
                // this.loading = false
                this.reqLoading = false
                console.log('error' + error)
            })
        },
        getGapTime() {
            let createTime = new Date(this.sysObj.createTime).getTime()
            let nowTime = new Date().getTime()
            let time = nowTime - createTime
            let t = time / 1000
            let d = Math.floor(t / (24 * 3600)) // 剩余天数，如果需要可以自行补上
            let _h = Math.floor((t - 24 * 3600 * d) / 3600) // 保留天数后得小时
            let m = Math.floor((t - 24 * 3600 * d - _h * 3600) / 60)
            let s = Math.floor((t - 24 * 3600 * d - _h * 3600 - m * 60))
            this.sysObj.runTime = `${d}天${_h}小时${m}分${s}秒`
            // return `${d}天${_h}小时${m}分${s}秒`
        },
        selectChange(val) {
            this.refreshVal = val
            if (this.refreshVal == 0) {
                clearInterval(this.timer)
                this.timer = null
            } else if (this.refreshVal == 1) {
                this.refreshData(60000)
            } else if (this.refreshVal == 2) {
                this.refreshData(5 * 60000)
            } else if (this.refreshVal == 3) {
                this.refreshData(15 * 60000)
            } else if (this.refreshVal == 4) {
                this.refreshData(30 * 60000)
            } else if (this.refreshVal == 5) {
                this.refreshData(60 * 60000)
            } else if (this.refreshVal == 6) {
                this.refreshData(2 * 60 * 60000)
            } else if (this.refreshVal == 7) {
                this.refreshData(12 * 60 * 60000)
            } else if (this.refreshVal == 8) {
                this.refreshData(24 * 60 * 60000)
            } else if (this.refreshVal.length > 0) {
                let timeData = this.refreshVal[0].actualTime
                let unitData = this.getTimeUnit(this.refreshVal[0].timeUnit)
                this.refreshData(timeData * unitData)
            }
            console.log('刷新', val)
        },
        refreshData(val) {
            this.timer = setInterval(() => {
                this.get_data()
            }, val)
        },
        getCustomTime(val, isChartTime) {
            this.sayTimes = val
            if (this.queryNum) {
                this.get_data()
            } else {
                this.queryNum++
            }
            // console.log('时间', val)
        },
        getDateData() {

        },
        customDateUse() {

        },
        drawChart() {
            this.$refs.cpuChart.drawMap()
            this.$refs.diskChart.drawMap()
            this.$refs.memChart.drawMap()
            this.$refs.netChart.drawMap()
            this.$refs.stoChart.drawMap()
            this.$refs.epsChart.drawMap()
            this.$refs.staticChart.drawMap()
            this.$refs.dataChart.drawMap()
        },
        resizeCharts() {
            this.$refs.cpuChart.resizeMap()
            this.$refs.diskChart.resizeMap()
            this.$refs.memChart.resizeMap()
            this.$refs.netChart.resizeMap()
            this.$refs.stoChart.resizeMap()
            this.$refs.epsChart.resizeMap()
            this.$refs.staticChart.resizeMap()
            this.$refs.dataChart.resizeMap()
        }
    },
    mounted() {
        this.initPage()
        window.addEventListener('resize', this.resizeCharts)
    },
    beforeDestroy() {
        if (this.timer) {
            clearInterval(this.timer)
        }
        window.removeEventListener('resize', this.resizeCharts)
        this.$removesessionStorage('machiDetail')
    }
}
</script>

<style lang="scss" scoped>
::v-deep .tpCusBox .el-input__suffix-inner {
    position: relative;
    top: 7px;
}

.topHead {
    padding: 0 51px;
    width: 100%;
    height: 65px;
    background-color: #ffffff;
    border-radius: 2px;
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
    box-sizing: border-box;
    position: relative;
    .back {
        font-size: 26px;
        cursor: pointer;
        color: #409eff;
        position: absolute;
        top: 20px;
        left: 20px;
    }
}

.topCon {
    margin: 11px 0 0 0;
    width: 100%;
    height: 580px;
    display: flex;

    .topLeft {
        width: 410px;
        height: 100%;
    }

    .topRight {
        flex: 1;
        padding: 0 0 0 10px;
        height: 100%;
        box-sizing: border-box;
        display: flex;

        .cpuBox {
            margin: 0 10px 0 0;
            width: calc(60% - 10px);
        }

        .storageSpaBox {
            flex: 1;
        }
    }
}

.infoBox {
    margin: 0 auto;
    width: 73.8%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .statusLogo {
        width: 239px;
        height: 239px;
        background-image: url(../../../assets/img/sysMan/scSuc.png);
        background-size: 100% 100%;
    }

    .statusLogo.err {
        background-image: url(../../../assets/img/sysMan/scErr.png);
    }

    .statusTex {
        margin-top: 26px;
        line-height: 33px;
        font-family: AdobeHeitiStd-Regular;
        font-size: 36px;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0px;
        color: #22b1a8;
    }

    .statusTex.err {
        color: #cc1336;
    }

    .infoTit {
        width: 100%;
        text-align: left;
        margin-top: 29px;
        line-height: 20px;
        font-family: PingFangSC-Medium;
        font-size: 20px;
        font-weight: normal;
        font-stretch: normal;
        color: #154259;
    }

    .controlBox {
        margin: 16px 0 30px 0;
        width: 100%;
        display: flex;

        .conOne {
            cursor: pointer;
            margin-right: 20px;
            color: #2976eb;
            font-size: 12px;
        }
    }

    .desItem {
        margin-bottom: 18px;
        width: 100%;
        font-family: PingFangSC-Regular;
        font-size: 18px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 19px;
        letter-spacing: 0px;
        color: #646464;
    }
}

.memoryUtiBox, .epsBox {
    margin: 9px 0 0 0;
    width: 50%;
    height: 340px;
    background-color: #ffffff;
    border-radius: 4px;
    border: solid 1px #d7dfe3;
}

.secBox {
    margin: 9px 0 0 0;
    width: 100%;
    min-height: 321px;
    display: flex;
    justify-content: space-between;
}

.lasBox {
    margin: 9px 0 0 0;
    width: 100%;
    min-height: 321px;
    display: flex;
    justify-content: space-between;

    .chartWrap {
        height: calc(100% - 34px);
    }

    .timeWrap {
        padding: 0 0 6px 30px;
        text-align: left;
        line-height: 28px;
        box-sizing: border-box;
        color: #ccc;
        font-size: 14px;
    }

    .wrapBg {
        width: calc(33.3% - 3px);
    }
    .w50 {
        width: calc(50% - 3px);
    }
    .w40 {
        width: calc(41.3% - 3px);
    }
}

.botCon {
    margin: 9px 0 0 0;
    width: 100%;
    min-height: 321px;
    display: flex;
    justify-content: space-between;

    .chartWrap {
        height: 180px;
    }

    .botTable {
        margin: 0 auto;
        width: 80%;

        thead th {
            padding: 3px 0;
            font-family: AdobeHeitiStd-Regular;
            font-size: 12px;
            font-weight: normal;
            font-stretch: normal;
            letter-spacing: 0px;
            color: #5ca1ff;
            text-align: right;
        }

        tbody td {
            padding: 3px 0;
            font-family: AdobeHeitiStd-Regular;
            font-weight: normal;
            font-stretch: normal;
            letter-spacing: 0px;
            font-size: 12px;
            color: #99abb4;
            text-align: right;

        }

        .firstTd {
            padding: 3px 0;
            display: flex;
            align-items: center;
            font-family: AdobeHeitiStd-Regular;
            font-size: 12px;
            font-weight: normal;
            font-stretch: normal;
            color: #354c58;

            .legend {
                position: relative;
                top: 1px;
                margin-right: 7px;
                width: 21px;
                height: 8px;
                background-color: #b38ce2;
                border-radius: 4px;
            }
        }
    }

    .netBox {
        width: 50%;
    }

    .diskBox {
        margin-left: 10px;
        width: 50%;
    }
}

.event {
    padding-bottom: 10px !important;
}

.chartWrap {
    position: relative;
    width: 100%;
    height: calc(100% - 21px);

    .empBox {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
}

.wrapBg {
    padding: 21px;
    background-color: #ffffff;
    border-radius: 4px;
    border: solid 1px #d7dfe3;
    box-sizing: border-box;

    .boxTit {
        margin-bottom: 5px;
        display: flex;
        align-items: center;

        .block {
            margin: 0 10px 0 0;
            width: 4px;
            height: 16px;
            background-color: #409eff;
            border-radius: 2px;
        }

        .tex {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            font-weight: normal;
            font-stretch: normal;
            line-height: 16px;
            color: #496573;
        }
    }
}
</style>
