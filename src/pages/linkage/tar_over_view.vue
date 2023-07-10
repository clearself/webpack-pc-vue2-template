<template>
    <div class="list">
        <div class="ub link-back" @click="goBack" style="cursor: pointer;padding-top: 6px;position:absolute;top:8px;right:20px;z-index:50">
            <i class="iconfont icon-houtui" style="font-size: 12px;color: #0052d9;">  返回列表</i>
        </div>
        <div class="w100" style="height:100%;">
            <div class="list-container ub ub-pj" style="margin-top:0">
                <div style="color:rgba(0,0,0,0.4);font-size:12px;line-height: 22px;">设备IP:{{$route.query.ip}}<span style="color:rgba(0,0,0,0.9);font-size: 18px;" class="ml-1">2.2.2.2</span></div>
                <div class="ub ub-ac change-box">
                    <div class="time-btn" :class="{'active':item.isActive}" v-for="(item,index) in timeType" :key="index" @click="changeTimeType(item,index)">{{item.label}}</div>
                </div>
            </div>
            <div class="mt-1">
                <div class="ub w100 num-statistic">
                    <div class="ub ub-f1 chart-box bg">
                        <div class="ub ub-f1 ub-ac statistic-item">
                            <div class="ub ub-ver">
                                <div class="text ml-2"><i class="iconfont icon-dengjizichan" style="font-size:14px;color:#2a78ef;margin-right:5px"></i>持续运行时间</div>
                                <div class="num" style="color:#2a78ef;margin-left:35px"><p style="font-size: 20px;display: inline-block;vertical-align: middle;margin-top: -6px">{{ststisticInfo.running_time ? ststisticInfo.running_time : 0}}小时</p></div>
                            </div>
                            <div class="ub-f1 text-right">
                                <img src="../../assets/img/assets/dengjizichanliang.png">
                            </div>
                        </div>
                    </div>
                    <div class="ub ub-f1 chart-box bg">
                        <div class="ub ub-f1 ub-ac statistic-item">
                            <div class="ub ub-ver">
                                <div class="text ml-2"><i class="iconfont icon-weidengji" style="font-size:14px;color:#f2995f;margin-right:5px"></i>已使用大小/总大小</div>
                                <div class="num" style="color:#f2995f;margin-left:35px"><p style="font-size: 20px;display: inline-block;vertical-align: middle;margin-top: -6px">{{ststisticInfo.used+'/'+ststisticInfo.size}}(GB)</p></div>
                            </div>
                            <div class="ub-f1 text-right">
                                <img src="../../assets/img/assets/weidengjizichanliang.png">
                            </div>
                        </div>
                    </div>
                    <div class="ub ub-f1 chart-box bg">
                        <div class="ub ub-f1 ub-ac statistic-item">
                            <div class="ub ub-ver">
                                <div class="text ml-2"><i class="iconfont icon-weidengji" style="font-size:14px;color:#48c79c;margin-right:5px"></i>内存利用率</div>
                                <div class="num" style="color:#48c79c;margin-left:35px"><p style="font-size: 20px;display: inline-block;vertical-align: middle;margin-top: -6px">{{ststisticInfo.mem_percent}}%</p></div>
                            </div>
                            <div class="ub-f1 text-right">
                                <img src="../../assets/img/assets/yewuxitongliang.png">
                            </div>
                        </div>
                    </div>
                    <div class="ub ub-f1 chart-box bg">
                        <div class="ub ub-f1 ub-ac statistic-item">
                            <div class="ub ub-ver">
                                <div class="text ml-2"><i class="iconfont icon-weidengji" style="font-size:14px;color:#387dee;margin-right:5px"></i>系统服务状态</div>
                                <div class="num" style="color:#387dee;margin-left:35px"><p style="font-size: 20px;display: inline-block;vertical-align: middle;margin-top: -6px">{{ststisticInfo.service_status===0?'正常':'异常'}}</p></div>
                            </div>
                            <div class="ub-f1 text-right">
                                <img src="../../assets/img/assets/anquanyu.png">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="chart-box bg border" style="width:100%;height:340px;margin: 10px 0;padding-top:10px;">
                    <div class="ub ub-pj ub-ac ub-pj w100 chart-top" style="padding:0 10px;box-sizing: border-box;">
                        <div class="title">利用率概览</div>
                    </div>
                    <div v-loading="loading_line" style="width:100%;height:100%;">
                        <div v-if="workLineData.length == 0" class="ub ub-f1 ub-ac ub-pc" style="height:100%;color:#909399;font-size:14px; cursor: pointer;">
                            暂无数据
                        </div>
                        <brokenLineMut v-if="workLineData.length > 0" :chartData="workLineData" />
                    </div>
                </div>
                <div class="chart-box bg border" style="width:100%;height:340px;margin: 10px 0;padding-top:10px;">
                    <div class="ub ub-pj ub-ac ub-pj w100 chart-top" style="padding:0 10px;box-sizing: border-box;">
                        <div class="title">当前接入镜像流量值</div>
                    </div>
                    <div v-loading="loading_line_one" style="width:100%;height:100%;">
                        <div v-if="workLineDataOne.length == 0" class="ub ub-f1 ub-ac ub-pc" style="height:100%;color:#909399;font-size:14px; cursor: pointer;">
                            暂无数据
                        </div>
                        <brokenLineMut v-if="workLineDataOne.length > 0" :chartData="workLineDataOne" type="1" />
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import {
    get_tar_statistic,
    get_tar_line_data
} from '../../server/linkage/tar.js'
import brokenLineMut from './charts/linesMut.vue'

export default {
    name: 'Overview',
    components: {
        brokenLineMut
    },
    data() {
        return {
            currentType: 1,
            ststisticInfo: {
                running_time: 0,
                mem_percent: 0,
                size: 0,
                used: 0,
                service_status: 0
            },
            sayTimes: [],
            timeType: [{
                label: '今天',
                value: 1,
                isActive: true
            }, {
                label: '昨天',
                value: 2,
                isActive: false
            }, {
                label: '前天',
                value: 3,
                isActive: false
            }],
            loading_line: false,
            workLineData: [],
            loading_line_one: false,
            workLineDataOne: []

        }
    },
    mounted() {
        this.$nextTick(() => {
            this.initRunTime()
            this.initLine()
        })
    },
    methods: {
        goBack() {
            this.$router.push({
                name: 'linkage_tar',
                params: {
                    back: true
                }
            })
        },
        initRunTime() {
            let data = {
                queryData: {},
                paramsData: {
                    appKey: this.$route.query.id
                }
            }
            get_tar_statistic(data).then(res => {
                console.log('tar统计', res)
                res.size = res.mem_size ?? 0
                res.used = res.used ?? 0
                res.size = (res.size / 1024 / 1024).toFixed(2)
                res.used = (res.used / 1024 / 1024).toFixed(2)
                this.$set(this, 'ststisticInfo', res)
            }).catch(error => {
                console.log('error' + error)
            })
        },
        changeTimeType(obj, index) {
            console.log(obj)
            this.timeType = this.timeType.map(item => {
                item.isActive = false
                return item
            })
            obj.isActive = true
            this.currentType = obj.value

            this.initLine()
        },
        initLine() {
            this.workLineData = []
            this.workLineDataOne = []
            if (this.currentType === 1) {
                // 今天
                this.sayTimes[0] = this.$getTime(new Date().getTime(), '-', false) + ' 00:00:00'
                this.sayTimes[1] = this.$getTime(new Date().getTime(), '-', true)
            } else if (this.currentType === 2) {
                // 昨天
                let start = new Date().getTime() - 1000 * 60 * 60 * 24
                this.sayTimes[0] = this.$getTime(start, '-', false) + ' 00:00:00'
                this.sayTimes[1] = this.$getTime(start, '-', false) + ' 23:59:59'
            } else if (this.currentType === 3) {
                // 前天
                let start = new Date().getTime() - 1000 * 60 * 60 * 24 * 2
                this.sayTimes[0] = this.$getTime(start, '-', false) + ' 00:00:00'
                this.sayTimes[1] = this.$getTime(start, '-', false) + ' 23:59:59'
            }
            let data = {
                queryData: {},
                paramsData: {
                    startTime: this.sayTimes[0],
                    endTime: this.sayTimes[1],
                    appKey: this.$route.query.id
                }
            }
            get_tar_line_data(data).then(res => {
                console.log('系统统计图', res)
                if (res.length > 0) {
                    this.workLineData = res.map(item => {
                        let obj = {}
                        obj.day = item.create_time
                        obj.from = []
                        obj.from[0] = {
                            fromCN: '内存利用率',
                            num: item.mem_percent
                        }
                        obj.from[1] = {
                            fromCN: '磁盘利用率',
                            num: item.hd_percent
                        }
                        obj.from[2] = {
                            fromCN: '处理器利用率',
                            num: item.cpu_percent
                        }
                        return obj
                    })

                    this.workLineDataOne = res.map(item => {
                        let obj = {}
                        obj.day = item.create_time
                        obj.from = []
                        obj.from[0] = {
                            fromCN: '当前接入镜像流量值',
                            num: item.mirror_traffic_size
                        }
                        return obj
                    })
                }
            }).catch(error => {
                console.log('error' + error)
            })
        },
        writeCurrentDate() {
            this.serve_time = this.$getTime(this.timeStr, '-', true)
            // 设置得到当前日期的函数的执行间隔时间，每1000毫秒刷新一次。
            this.timeStr = this.timeStr + 1000
            this.timerOut = setTimeout(this.writeCurrentDate, 1000)
        },
        timeDown() {
            let d = parseInt(this.nowTime / (24 * 60 * 60))
            let h = this.formate(parseInt(this.nowTime / (60 * 60) % 24))
            let m = this.formate(parseInt(this.nowTime / 60 % 60))
            let s = this.formate(parseInt(this.nowTime % 60))
            this.run_time = `${d}天${h}小时${m}分${s}秒`
            this.nowTime = this.nowTime + 1
            this.timer = setTimeout(this.timeDown, 1000)
        },
        formate(time) {
            if (time >= 10) {
                return time
            } else {
                return `0${time}`
            }
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

.chart-box.big{
    height:140px;
}
.chart-box .title{
    color:rgba(0,0,0,.9);
    font-size:14px;
}
.chart-box .bottom{
    width:90%;
    margin:10px auto 0;
    height:44px;
    border-top:1px solid rgba(255,255,255,0.2);
    >div{
        color:#fff;
        font-size:13px;
    }
}
.chart-box.border {
    position: relative;
}

.chart-box.bg {
    background-color:#fff;
    border-radius: 4px;
    border: solid 1px #dadee8;
}
.num-statistic .chart-box {
    width: 1%;
}

.chart-box .image {
    width: 100%;
    height: 100%;
    background-position: center;
    background-repeat: no-repeat;
}

.chart-box .options {
    width: 50px;
    position: absolute;
    right: 0;
    bottom: 0;
}

.chart-box .options div {
    width: 30px;
    height: 30px;
    cursor: pointer;
    i {
        font-size: 20px;
        color: #00CFFB;
    }
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
    color: rgba(0,0,0,.9);
}

.statistic-item .num {
    margin-top: 6px;
    font-size: 20px;
    color: #fff;
}

.statistic-item>.icon i.color1,
.statistic-item .color1 {
    color: #f86900;
}

.statistic-item>.icon i.color2,
.statistic-item .color2 {
    color: #ffba00;
}

.statistic-item>.icon i.color3,
.statistic-item .color3 {
    color: #00c0ff ;
}

.statistic-item>.icon i.color4,
.statistic-item .color4 {
    color: #00ff00;
}

.statistic-item>.icon i.color5,
.statistic-item .color5 {
    color: #00e1ff;
}

.change-box>div.time-btn {
    width: 40px;
    text-align: right;
    font-size: 12px;
    color: rgba(0,0,0,0.4);
    padding: 4px 2px;
    margin-right: 10px;
    cursor: pointer;
    // box-shadow: inset 0px 0px 10px 0px rgba(0, 167, 245, 0.97);
    border-radius: 3px;
    // border: 1px solid #39caf3;
}

.change-box>div.active {
    // background-color: #00c0ff;
    // box-shadow: inset 0px 0px 35px 0px #00a7f5;
    // border: 1px solid #1cd7fa;
    color: #0052d9;
}
</style>
