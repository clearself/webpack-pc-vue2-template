<template>
    <el-drawer
        class="checkdia"
        :visible.sync="showDialog"
        direction="rtl"
        :size="1100"
        :wrapperClosable="false"
        :before-close="handleClose"
        title="查看内容">
        <div id="drawer-content" class="drawer-content" ref="drawerContent">
            <div>
                <!-- 告警分析需要 -->
                <!-- <div class="ub ub-pj w100">
                    <div class="list-tip">
                        <span style="font-weight:600">{{ seeForm.reportName }}</span>
                        <span v-if="seeForm.reportLevel == 0" class="title-level zero">低</span>
                        <span v-if="seeForm.reportLevel == 1" class="title-level one">中低</span>
                        <span v-if="seeForm.reportLevel == 2" class="title-level two">中</span>
                        <span v-if="seeForm.reportLevel == 3" class="title-level three">中高</span>
                        <span v-if="seeForm.reportLevel == 4" class="title-level fore">高</span>

                        <span
                            v-if="seeForm.reportStatus == 0"
                            style="color:#eeb174;background:#fde6d8;font-size: 12px;border-radius: 16px;line-height: 1;padding: 3px 15px;">待确认</span>
                        <span
                            v-if="seeForm.reportStatus == 1"
                            style="color:#3fa87b;background:#ccf6e4;font-size: 12px;border-radius: 16px;line-height: 1;padding: 3px 15px;">已确认</span>
                        <span
                            v-if="seeForm.reportStatus == 2"
                            style="color:#3c7ce2;background:#d5e5fa;font-size: 12px;border-radius: 16px;line-height: 1;padding: 3px 15px;">已处置</span>
                        <span
                            v-if="seeForm.reportStatus == 3"
                            style="color:#aa0202;background:#fad7dd;font-size: 12px;border-radius: 16px;line-height: 1;padding: 3px 15px;">已驳回</span>
                    </div>
                </div> -->
                <div class="model-title my-2">基本信息</div>
                <!-- 部门防火线 -->
                <el-descriptions
                    v-if="curData.tab==1"
                    size="mini"
                    title=""
                    :column="2"
                    border>
                    <el-descriptions-item label="组织部门">{{ curData.orgName }}</el-descriptions-item>
                    <el-descriptions-item label="人员数量">{{ curData.personNum }}</el-descriptions-item>
                    <el-descriptions-item label="异常人员数量">{{ curData.exceptionPersonNum }}</el-descriptions-item>
                    <el-descriptions-item label="告警量">{{ curData.alarmNum }}</el-descriptions-item>
                    <el-descriptions-item label="最新告警时间">{{ curData.latestAlarmTime }}</el-descriptions-item>
                </el-descriptions>
                <!-- 人员防火线 -->
                <el-descriptions
                    v-if="curData.tab==2"
                    size="mini"
                    title=""
                    :column="2"
                    border>
                    <el-descriptions-item label="姓名">{{ curData.chineseName }}</el-descriptions-item>
                    <el-descriptions-item label="组织部门">{{ curData.orgName }}</el-descriptions-item>
                    <el-descriptions-item label="手机号">{{ curData.phone }}</el-descriptions-item>
                    <el-descriptions-item label="告警量">{{ curData.alarmNum }}</el-descriptions-item>
                    <el-descriptions-item label="最新告警时间">{{ curData.latestAlarmTime }}</el-descriptions-item>
                </el-descriptions>
                <!-- 资产防火线 -->
                <el-descriptions
                    v-if="curData.tab==3"
                    size="mini"
                    title=""
                    :column="2"
                    border>
                    <el-descriptions-item label="资产责任人">{{ curData.assetPerson }}</el-descriptions-item>
                    <el-descriptions-item label="资产IP">{{ curData.assetIps }}</el-descriptions-item>
                    <el-descriptions-item label="资产名称">{{ curData.assetName }}</el-descriptions-item>
                    <el-descriptions-item label="告警量">{{ curData.alarmNum }}</el-descriptions-item>
                    <el-descriptions-item label="最新告警时间">{{ curData.latestAlarmTime }}</el-descriptions-item>
                </el-descriptions>
                <div class="model-title my-2">行为基线</div>
                <div class="w100 echart-wrapper">
                    <div class="area left">
                        <div class="title">A级区域</div>
                        <div class="list" @click.stop>
                            <el-popover
                                v-for="item in listA"
                                :key="item.id"
                                popper-class="popover"
                                placement="top-start"
                                trigger="hover">
                                <div
                                    style="
                                                font-size: 12px;
                                                border-radius: 3px;
                                                background-color: #ffffff;
">
                                    <p style="color: #555555;">
                                        <span style="color: #999999;">告警名称：</span>{{ item.reportName }}
                                    </p>
                                    <p style="color: #555555;">
                                        <span style="color: #999999;">源IP：</span>{{ item.srcIp }}
                                    </p>
                                    <p style="color: #555555;">
                                        <span style="color: #999999;">源端口：</span>{{ item.srcPort }}
                                    </p>
                                    <p style="color: #555555;">
                                        <span style="color: #999999;">目的IP：</span>{{ item.desIp }}
                                    </p>
                                    <p style="color: #555555;">
                                        <span style="color: #999999;">目的端口：</span>{{ item.desPort }}
                                    </p>
                                    <p style="color: #555555;">
                                        <span style="color: #999999;">处置结果：</span>{{ item.actionResults }}
                                    </p>
                                </div>
                                <span
                                    @click="moveArea($event, item)"
                                    :class="{
                                        red: item.mold == 2,
                                        blue: item.mold == 1,
                                    }"
                                    slot="reference"></span>
                            </el-popover>
                        </div>
                    </div>
                    <div class="area right">
                        <div class="title">B级区域</div>
                        <div class="list" @click.stop>
                            <el-popover
                                v-for="item in listB"
                                :key="item.id"
                                popper-class="popover"
                                placement="top-start"
                                trigger="hover">
                                <div
                                    style="font-size: 12px; border-radius: 3px;background-color: #ffffff;
">
                                    <p style="color: #555555;">
                                        <span style="color: #999999;">告警名称：</span>{{ item.reportName }}
                                    </p>
                                    <p style="color: #555555;">
                                        <span style="color: #999999;">源IP：</span>{{ item.srcIp }}
                                    </p>
                                    <p style="color: #555555;">
                                        <span style="color: #999999;">源端口：</span>{{ item.srcPort }}
                                    </p>
                                    <p style="color: #555555;">
                                        <span style="color: #999999;">目的IP：</span>{{ item.desIp }}
                                    </p>
                                    <p style="color: #555555;">
                                        <span style="color: #999999;">目的端口：</span>{{ item.desPort }}
                                    </p>
                                    <!-- <p style="color: #555555;">
                                        <span style="color: #999999;">{{
                                            item.type == 1
                                                ? "访问"
                                                : "被访问"
                                        }}次数：</span>{{ item.num }}次
                                    </p> -->
                                    <p style="color: #555555;">
                                        <span style="color: #999999;">处置结果：</span>{{ item.actionResults }}
                                    </p>
                                </div>
                                <span
                                    @click="moveArea($event, item)"
                                    :class="{
                                        red: item.mold == 2,
                                        blue: item.mold == 1,
                                    }"
                                    slot="reference"></span>
                            </el-popover>
                        </div>
                    </div>

                    <div class="echart-box">
                        <div class="time-select-box">
                            <time-select v-model="timeVal" :list="timelist" @change="changeTime"  />
                        </div>
                        <div
                            v-loading="polar_loading"
                            style="padding: 2px;width: 100%;height: 100%;box-sizing: border-box;cursor: pointer;">
                            <div
                                v-if="polar_no_data"
                                class="ub ub-f1 ub-ac ub-pc"
                                style="height: 100%;
                                            font-size: 14px;
                                            color: #909399;
                                            cursor: pointer;
">
                                暂无数据
                            </div>
                            <Polar v-if="list.length > 0" :chartData="list"></Polar>
                        </div>
                    </div>
                </div>
                <!-- <div class="w100">
                    <v-clamp :max-lines="lines" autoresize>
                        哈哈啊哈哈哈哈哈啊哈哈哈哈啊哈哈哈啊哈哈哈哈哈啊哈哈哈哈啊哈哈哈啊哈哈哈哈哈啊哈哈哈哈啊哈哈哈啊哈哈哈哈哈啊哈哈哈哈啊哈哈哈啊哈哈哈哈哈啊哈哈哈哈啊哈哈哈啊哈哈哈哈哈啊哈哈哈哈啊哈哈哈啊哈哈哈哈哈啊哈哈哈哈啊哈哈哈啊哈哈哈哈哈啊哈哈哈哈啊哈哈哈啊哈哈哈哈哈啊哈哈哈哈啊哈哈哈啊哈哈哈哈哈啊哈哈哈哈啊哈哈哈啊哈哈哈哈哈啊哈哈哈哈啊哈
                    </v-clamp>
                </div> -->
                <div class="model-title my-2">告警列表</div>
                <div class="w100">
                    <AlarmEventList ref="AlarmEventList"  :detailData="detailData" :tab="tab" />
                </div>
            </div>
        </div>
    </el-drawer>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'
import Polar from './polar'
import AlarmEventList from './alarm_event_list'
import Move from './move'
import { mapState } from 'vuex'
import {
    get_dep_fire_line_chart,
    get_personal_fire_line_chart,
    get_assets_fire_line_chart
    // get_dep_fire_line_alarm,
    // get_personal_fire_line_alarm,
    // get_assets_fire_line_alarm
} from '@/server/alarm/fire_line.js'
let red = '#EE5C38'
let blue = '#387DEE'
export default {
    props: ['detailData', 'showDialog', 'tab'],
    components: {
        Polar,
        AlarmEventList
    },
    data() {
        return {
            lines: 2,
            width1: 600,
            location: 'end',
            hyphens1: true,
            rtl1: false,
            expanded1: false,
            height: 'calc(48px + 12em)',
            polar_loading: false,
            polar_no_data: false,
            curData: {},
            listA: [],
            listB: [],
            list: [],
            timelist: [
                {
                    label: '最近一天',
                    value: 1
                }, {
                    label: '最近两天',
                    value: 2
                }, {
                    label: '最近三天',
                    value: 3
                }, {
                    label: '最近七天',
                    value: 7
                }
            ],
            timeVal: 1,
            timeObj: {
                startTime: '',
                endTime: ''
            }

        }
    },
    computed: {
        ...mapState('analysis', ['refresh_polar'])
    },
    watch: {
        detailData: {
            handler(newVal) {
                this.$set(this, 'curData', newVal)
            }
        },
        refresh_polar(newVal, oldVal) {
            this.init()
        },
        showDialog(newVal) {
            if (newVal) {
                this.initTime()
                this.$nextTick(() => {
                    this.init()
                    this.$refs.AlarmEventList.get_params.page = 1
                    this.$refs.AlarmEventList.init()
                })
            } else {
                this.timeVal = 1
                this.$refs.AlarmEventList.taskDialog = false
                this.$refs.AlarmEventList.stateDialog = false
                this.$refs.AlarmEventList.seeDialog = false
            }
        }

    },
    mounted() {
        console.log(this.$store, 'this.$store')
        // this.$nextTick(() => {

        // })
    },
    methods: {
        initTime() {
            let now = new Date().getTime()
            let end = now - 1000 * 3600 * 24 * this.timeVal
            let endTime = this.$getTime(now, '-', true)
            let startTime = this.$getTime(end, '-', true)
            this.timeObj.startTime = startTime
            this.timeObj.endTime = endTime
        },
        changeTime(arr) {
            if (arr.length > 0) {
                this.timeObj.startTime = arr[0]
                this.timeObj.endTime = arr[1]
                this.init()
            }
        },
        moveArea(e, item) {
            console.log(e, 33)
            console.log(e.target, 33)
            if (document.getElementsByClassName('move-tip').length > 0) {
                let curNode = document.getElementsByClassName('move-tip')[0]
                let parentNode = curNode.parentNode
                parentNode.parentNode &&
                    parentNode.parentNode.removeChild(parentNode)
            }
            let x = e.pageX
            let y = e.pageY
            let left = x + 16
            let top = y - 13
            let bgColor = item.type == 1 ? blue : red
            this.$openDialog(Move)({
                styleObj: {
                    top: top + 'px',
                    left: left + 'px',
                    backgroundColor: bgColor
                },
                curData: item
            }, this)
        },

        init() {
            console.log('this.curData33333', this.curData)
            this.polar_loading = true
            this.polar_no_data = true
            this.list = []
            let reqChart = null
            switch (this.tab) {
                case '1':
                    reqChart = get_dep_fire_line_chart
                    break
                case '2':
                    reqChart = get_personal_fire_line_chart
                    break
                case '3':
                    reqChart = get_assets_fire_line_chart
                    break
                default:
                    reqChart = get_dep_fire_line_chart
                    break
            }
            let data = {
                queryData: {},
                paramsData: {
                    startTime: this.timeObj.startTime,
                    endTime: this.timeObj.endTime
                }
            }
            if (this.tab == 1) { // 部门
                data.paramsData.departmentId = this.detailData.orgName === null ? '' : this.detailData.orgName
            }
            if (this.tab == 2) { // 人员
                data.paramsData.departmentId = this.detailData.orgName === null ? '' : this.detailData.orgName
                data.paramsData.username = this.detailData.userName
            }
            if (this.tab == 3) { // 资产
                data.paramsData.assetIps = this.detailData.assetIps
            }
            reqChart(data).then(res => {
                this.polar_loading = false
                this.polar_no_data = false
                console.log('极限图数据this.currentTab' + this.currentTab, res)
                if (res.alarmList.length === 0 && res.flowSysLogList.length === 0) {
                    this.polar_no_data = true
                }
                let alarmData = res.alarmList || []
                let flowData = res.flowSysLogList || []
                let arearA = alarmData.filter(item => item.emergency === 'A')
                let arearB = alarmData.filter(item => item.emergency === 'B')
                console.log('arearA', arearA)
                console.log('arearB', arearB)
                let _alarmData = alarmData.filter(item => item.emergency === 'N')
                console.log(_alarmData, '_alarmData')
                let maxarr = this.$deepCopy(flowData)
                maxarr = maxarr.sort((a, b) => b.num - a.num)
                let max = maxarr.length > 0 ? maxarr[0].num : 1000
                let _flowData = flowData.map(item => {
                    let obj = {
                        id: uuidv4(),
                        type: item.mold,
                        srcIp: item.srcIp,
                        isNormal: true,
                        num: item.num,
                        position_num: Math.floor(Math.random() * max)
                    }
                    return obj
                })

                _alarmData = _alarmData.map(item => {
                    let obj = {
                        id: item.id,
                        type: item.mold,
                        alarmName: item.reportName,
                        srcIp: item.srcIp,
                        srcPort: item.srcPort,
                        disIp: item.desIp,
                        disPort: item.desPort,
                        disResult: item.actionResults,
                        isNormal: false,
                        num: Math.floor(Math.random() * max),
                        position_num: Math.floor(Math.random() * max)
                    }
                    return obj
                })

                this.listA = arearA.sort((a, b) => new Date(a.emergencyCreateTime).getTime() - new Date(b.emergencyCreateTime).getTime())
                console.log('this.listA', this.listA)
                this.listB = arearB.sort((a, b) => new Date(a.emergencyCreateTime).getTime() - new Date(b.emergencyCreateTime).getTime())
                this.list = [..._alarmData, ..._flowData]
            }).catch(error => {
                this.polar_loading = false
                this.polar_no_data = true
                console.log('error' + error)
            })
            // setTimeout(() => {
            //     this.polar_loading = false
            //     this.polar_no_data = false
            //     for (let i = 0; i < 100; i++) {
            //         this.list.push({
            //             id: uuidv4(),
            //             alarmName: '告警名称告警',
            //             srcIp: '192.168.1.34',
            //             srcPort: '9090',
            //             disIp: '192.168.1.33',
            //             disPort: '7070',
            //             disResult: '处置结果',
            //             ip: '192.168.1.123',
            //             isNormal: !!Math.floor(Math.random() * 2),
            //             num: Math.floor(Math.random() * 300)
            //         })
            //     }
            // }, 1000)
        },
        handleClose() {
            this.$parent.fireLineDialog = false
        }
    }
}
</script>

<style lang="scss" scoped>
.echart-box {
    position: relative;
    margin: 0 auto;
    width: 700px;
    height: 700px;
    .time-select-box {
        position: absolute;
        top: 0;
        right: 20px;
        z-index: 999;
        width: 150px;
    }
}
.model-title {
    font-size: 13px;
    color: #387dee;
}
.drawer-content {
    overflow-y: auto;
    padding: 10px 20px;
    height: calc(100vh - 40px);
}
::v-deep {
    .el-drawer__body {
        padding: 0!important;
    }
}
.echart-wrapper {
    position: relative;
    min-height: 500px;
    .area {
        position: absolute;
        top: 0;
        padding: 8px;
        width: 180px;
        min-height: 150px;
        border: 1px solid #cccccc;
        border-radius: 5px;
        &.left {
            left: 0;
        }
        &.right {
            right: 0;
        }
        .title {
            font-size: 13px;
            color: #999999;
        }
        .list {
            margin-top: 8px;
            width: 100%;
            span {
                display: inline-block;
                margin: 5px;
                width: 10px;
                height: 10px;
                border-radius: 5px;
                transition: all 0.1s ease-in;
                cursor: pointer;
                &.red {
                    background-color: #ee5c38;
                }
                &.blue {
                    background-color: #387dee;
                }
            }
        }
    }
}
</style>
<style>
.popover {
    padding: 5px !important;
}
</style>
