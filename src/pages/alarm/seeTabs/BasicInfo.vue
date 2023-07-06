/* eslint-disable vue/valid-v-for */
<template>
    <div class="container">
        <el-descriptions size="mini" title="" :column="2" border>

            <el-descriptions-item label="事件来源">
                {{ fromMap(seeForm.reportFrom) }}
                <span v-if="seeForm.dt">-{{ seeForm.dt }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="事件ID">{{ seeForm.id }}</el-descriptions-item>
            <el-descriptions-item label="事件类型">{{ seeForm.reportTypeName }}</el-descriptions-item>
            <el-descriptions-item label="事件时间">{{ dateFormat(seeForm) }}</el-descriptions-item>
            <el-descriptions-item label="事件资产">{{ seeForm.assetName }}</el-descriptions-item>
            <el-descriptions-item label="资产IP">{{ seeForm.desIp }}</el-descriptions-item>
            <el-descriptions-item label="源IP">
                <el-popover popper-class="add-search-order-detail desIp-popover-box" placement="bottom" title="" trigger="click">
                    <div>
                        <p @click="jumpAsset(seeForm.srcIp)" class="ub ub-ac click-btn">
                            <i class="iconfont icon-chaxunzichan" style="font-size: 12px;"></i>
                            <span>查询资产</span>
                        </p>
                        <!--                        <p style="margin-top: 10px;" @click="jumpThreat(seeForm.srcIp)" class="ub ub-ac click-btn">-->
                        <!--                            <i class="iconfont icon-chaxunqingbao" style="font-size: 12px;"></i>-->
                        <!--                            <span>查询情报</span>-->
                        <!--                        </p>-->
                    </div>
                    <p class="highlighted" style=" display: inline-block; text-decoration: underline; color: #387dee;cursor: pointer;" slot="reference">
                        <i
                            v-if="seeForm.srcIpVenusIsSpite != '内网'"
                            class="iconfont"
                            :style="{
                                color: formatColor(seeForm.srcIpVenusIsSpite)
                            }"
                            :title="'VenusEye：'+seeForm.srcIpVenusIsSpite"
                            :class="{
                                'icon-liebiaonei-anquan': seeForm.srcIpVenusIsSpite == '安全',
                                'icon-liebiaonei-buanquan': seeForm.srcIpVenusIsSpite == '恶意',
                                'icon-liebiaonei-weizhi': seeForm.srcIpVenusIsSpite == '未知'
                            }"
                        ></i>
                        <i
                            v-if="seeForm.srcIpIsSpite != '内网'"
                            class="iconfont"
                            :style="{
                                color: formatColor(seeForm.srcIpIsSpite)
                            }"
                            :title="'微步：'+seeForm.srcIpIsSpite"
                            :class="{
                                'icon-liebiaonei-anquan': seeForm.srcIpIsSpite == '安全',
                                'icon-liebiaonei-buanquan': seeForm.srcIpIsSpite == '恶意',
                                'icon-liebiaonei-weizhi': seeForm.srcIpIsSpite == '未知'
                            }"
                        ></i>
                        {{ seeForm.srcIp }}
                    </p>
                </el-popover>
            </el-descriptions-item>
            <el-descriptions-item label="源端口">{{ seeForm.srcPort }}</el-descriptions-item>
            <el-descriptions-item label="目的IP">
                <el-popover popper-class="add-search-order-detail desIp-popover-box" placement="bottom" title="" trigger="click">
                    <div>
                        <p @click="jumpAsset(seeForm.desIp)" class="ub ub-ac click-btn">
                            <i class="iconfont icon-chaxunzichan" style="font-size: 12px;"></i>
                            <span>查询资产</span>
                        </p>
                        <!--                        <p style="margin-top: 10px;" @click="jumpThreat(seeForm.desIp)" class="ub ub-ac click-btn">-->
                        <!--                            <i class="iconfont icon-chaxunqingbao" style="font-size: 12px;"></i>-->
                        <!--                            <span>查询情报</span>-->
                        <!--                        </p>-->
                    </div>
                    <p class="highlighted" style=" display: inline-block; text-decoration: underline; color: #387dee;cursor: pointer;" slot="reference">
                        <i
                            v-if="seeForm.desIpVenusIsSpite != '内网'"
                            class="iconfont"
                            :style="{
                                color: formatColor(seeForm.desIpVenusIsSpite)
                            }"
                            :title="'VenusEye：'+seeForm.desIpVenusIsSpite"
                            :class="{
                                'icon-liebiaonei-anquan': seeForm.desIpVenusIsSpite == '安全',
                                'icon-liebiaonei-buanquan': seeForm.desIpVenusIsSpite == '恶意',
                                'icon-liebiaonei-weizhi': seeForm.desIpVenusIsSpite == '未知'
                            }"
                        ></i>
                        <i
                            v-if="seeForm.desIpIsSpite != '内网'"
                            class="iconfont"
                            :style="{
                                color: formatColor(seeForm.desIpIsSpite)
                            }"
                            :title="'微步：'+seeForm.desIpIsSpite"
                            :class="{
                                'icon-liebiaonei-anquan': seeForm.desIpIsSpite == '安全',
                                'icon-liebiaonei-buanquan': seeForm.desIpIsSpite == '恶意',
                                'icon-liebiaonei-weizhi': seeForm.desIpIsSpite == '未知'
                            }"
                        ></i>
                        {{ seeForm.desIp }}
                    </p>
                </el-popover>
            </el-descriptions-item>
            <el-descriptions-item label="目的端口">{{ seeForm.desPort }}</el-descriptions-item>

            <el-descriptions-item label="源-姓名">{{ seeForm.srcChineseName }}</el-descriptions-item>
            <el-descriptions-item label="目的-姓名">{{ seeForm.desChineseName }}</el-descriptions-item>
            <el-descriptions-item label="源-用户名">{{ seeForm.srcName }}</el-descriptions-item>
            <el-descriptions-item label="目的-用户名">{{ seeForm.desName }}</el-descriptions-item>
            <el-descriptions-item label="源-手机号">{{ seeForm.srcPhone }}</el-descriptions-item>
            <el-descriptions-item label="目的-手机号">{{ seeForm.desPhone }}</el-descriptions-item>
            <el-descriptions-item label="源-组织架构">{{ seeForm.srcOrg }}</el-descriptions-item>
            <el-descriptions-item label="目的-组织架构">{{ seeForm.desOrg }}</el-descriptions-item>

            <el-descriptions-item label="域名">{{ seeForm.domainName }}</el-descriptions-item>
            <el-descriptions-item label="安全域">{{ seeForm.securityDomain }}</el-descriptions-item>
            <el-descriptions-item label="归并量">{{ seeForm.gbNum }}</el-descriptions-item>
            <el-descriptions-item label="封禁状态">{{ seeForm.isBanned == 1 ? '已封禁' : seeForm.isBanned === 0 ? '未封禁' : '--' }}</el-descriptions-item>
            <el-descriptions-item label="总数">{{ seeForm.count ? seeForm.count : '' }}</el-descriptions-item>
            <el-descriptions-item label="规则名称">
                <p style="cursor: pointer; color: #387dee;" v-if="seeForm.ruleName" @click="findRule(seeForm.ruleId)">{{ seeForm.ruleName }}</p>
            </el-descriptions-item>

            <el-descriptions-item label="事件描述" :span="2"><div class="text-color" style="width: 600px;" v-html="seeForm.reportDesc"></div></el-descriptions-item>
            <el-descriptions-item label="攻击结果" :span="2"><div class="text-color" style="width: 600px;" v-html="seeForm.attackResult"></div></el-descriptions-item>
            <el-descriptions-item label="处置建议" :span="2"><div class="text-color" style="width: 600px;" v-html="seeForm.advice"></div></el-descriptions-item>
            <el-descriptions-item label="处置方式" :span="2"><div class="text-color" style="width: 600px;" v-html="seeForm.actionType"></div></el-descriptions-item>
            <el-descriptions-item label="二线分析" :span="2"><div class="text-color" style="width: 600px;" v-html="seeForm.appendProposal"></div></el-descriptions-item>
            <el-descriptions-item label="变更理由" :span="2">
                <div class="small-table" v-for="(item, index) in seeForm.records.d1" :key="index">
                    <div class="ub head">
                        <div class="head-left">
                            <span class="head-icon iconfont icon-jiediankaishishijian"></span>
                            <span>{{ item.createTime }}</span>
                        </div>
                        <div class="head-right">
                            <span class="text-one">{{ item.oldStatus | reportStatusText }}</span>
                            <span class="head-icon iconfont icon-quchuli"></span>
                            <span class="text-two">{{ item.newStatus | reportStatusText }}</span>
                        </div>
                    </div>
                    <div class="content" v-html="item.detail"></div>
                </div>
            </el-descriptions-item>

            <!--            <el-descriptions-item label="资产IP">{{ seeForm.desIp }}</el-descriptions-item>-->
            <el-descriptions-item label="资产名称">{{ seeForm.assetName }}</el-descriptions-item>
            <el-descriptions-item v-if="seeForm.records" label="处置动作" :span="2">
                <div class="small-table" v-for="(item, index) in seeForm.records.d2" :key="index">
                    <div class="ub head">
                        <div class="head-left">
                            <span class="head-icon iconfont icon-jiediankaishishijian"></span>
                            <span>{{ item.createTime }}</span>
                        </div>
                        <div class="head-right">
                            <span class="text-one">{{ item.oldStatus | reportStatusText }}</span>
                            <span class="head-icon iconfont icon-quchuli"></span>
                            <span class="text-two">{{ item.newStatus | reportStatusText }}</span>
                        </div>
                    </div>
                    <div class="content" v-html="item.detail"></div>
                </div>
            </el-descriptions-item>
            <el-descriptions-item label="分析过程" :span="2">
                <div class="small-table" v-for="(item, index) in seeForm.records.d4" :key="index">
                    <div class="ub head">
                        <div class="head-left">
                            <span class="head-icon iconfont icon-jiediankaishishijian"></span>
                            <span>{{ item.createTime }}</span>
                        </div>
                        <div class="head-right">
                            <span class="text-one">{{ item.oldStatus | reportStatusText }}</span>
                            <span class="head-icon iconfont icon-quchuli"></span>
                            <span class="text-two">{{ item.newStatus | reportStatusText }}</span>
                        </div>
                    </div>
                    <div class="content" v-html="item.detail"></div>
                </div>
            </el-descriptions-item>
            <el-descriptions-item label="处置结果" :span="2">
                <div class="small-table" v-for="(item, index) in seeForm.records.d2" :key="index">
                    <div class="ub head">
                        <div class="head-left">
                            <span class="head-icon iconfont icon-jiediankaishishijian"></span>
                            <span>{{ item.createTime }}</span>
                        </div>
                        <div class="head-right">
                            <span class="text-one">{{ item.oldStatus | reportStatusText }}</span>
                            <span class="head-icon iconfont icon-quchuli"></span>
                            <span class="text-two">{{ item.newStatus | reportStatusText }}</span>
                        </div>
                    </div>
                    <div class="content" v-html="item.detail"></div>
                </div>
            </el-descriptions-item>
            <el-descriptions-item label="驳回理由" :span="2" v-for="(item, index) in seeForm.records.d3" :key="index">
                <div class="small-table">
                    <div class="ub head">
                        <div class="head-left">
                            <span class="head-icon iconfont icon-jiediankaishishijian"></span>
                            <span>{{ item.createTime }}</span>
                        </div>
                        <div class="head-right">
                            <span class="text-one">{{ item.oldStatus | reportStatusText }}</span>
                            <span class="head-icon iconfont icon-quchuli"></span>
                            <span class="text-two">{{ item.newStatus | reportStatusText }}</span>
                        </div>
                    </div>
                    <div class="content" v-html="item.detail"></div>
                </div>
            </el-descriptions-item>
        </el-descriptions>

        <div class="model-title my-2">行为基线</div>
        <div class="w100 echart-wrapper">
            <div v-if="!polar_no_data" class="area left">
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
            <div v-if="!polar_no_data" class="area right">
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
                <div v-show="!polar_no_data" class="time-select-box">
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
    </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'
import Polar from './polar'
import { get_threat_search, getStartConfig, get_threat_searchVenus } from '@/server/alarm/api.js'
import { reqChart } from '@/server/alarm/alarm_analysis.js'
import { mapState } from 'vuex'
export default {
    name: 'BasicInfo',
    components: {
        Polar
    },
    props: {
        seeForm: {
            default: {}
        }
    },
    filters: {
        reportStatusText(val) {
            if (val == 0) {
                return '待确认'
            } else if (val == 1) {
                return '已确认'
            } else if (val == 2) {
                return '已处理'
            } else if (val == 3) {
                return '已驳回'
            } else {
                return '--'
            }
        }
    },
    computed: {
        ...mapState('analysis', ['refresh_polar'])
    },
    watch: {
        seeForm: {
            handler(val) {
                this.timeVal = 1
                this.initTime()
                this.init()
            },
            immediate: true
        },
        refresh_polar(newVal, oldVal) {
            this.init()
        }
    },
    data() {
        return {
            startData: [],
            recordsData: [],
            polar_loading: false,
            polar_no_data: false,
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
    mounted() {
        // this.getRecords()
        // this.getStartConfigData()
        console.log(this.seeForm.srcIpVenusIsSpite, 'zhegedongxi')
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
        init() {
            if (!this.seeForm.srcName) {
                this.polar_no_data = true
                return
            }
            this.polar_loading = true
            this.polar_no_data = true
            this.list = []
            let data = {
                queryData: {},
                paramsData: {
                    startTime: this.timeObj.startTime,
                    endTime: this.timeObj.endTime
                }
            }
            data.paramsData.username = this.seeForm.srcName
            // data.paramsData.username = '5012239'

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

                this.listA = arearA
                this.listB = arearB
                this.list = [..._alarmData, ..._flowData]
                console.log('this.listA', this.listA)
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
        getStartConfigData() {
            getStartConfig({ queryData: {}, paramsData: {}}).then(res => {
                this.startData = res
            })
        },
        formatColor(val) {
            console.log(val)
            if (val == '安全') {
                return '#00ff48'
            } else if (val == '恶意') {
                return '#ff0000'
            } else if (val == '未知') {
                return '#7c7c7c'
            }
        },
        jumpAsset(value) {
            this.$setsessionStorage('currentPath', '/assets/assets_asset_info?ip=' + value)
            window.open(window.location.origin + '/#' + '/assets/assets_asset_info?ip=' + value)
        },
        jumpThreat(value) {
            console.log(value)
            let obj = {
                queryData: {},
                paramsData: { value }
            }
            if (this.startData.includes(1)) {
                this.searchWeibu(obj, value)
            } else if (this.startData.includes(0)) {
                this.searchVenus(obj, value)
            }
        },
        searchWeibu(obj, value) {
            get_threat_search(obj)
                .then(res => {
                    console.log(res)
                    this.$setsessionStorage('search-item', res)
                    window.open(window.location.origin + '/#' + '/intelligence/threat_detail?searchStr=' + value)
                })
                .catch(err => {
                    console.log(err + 'err')
                })
        },
        searchVenus(obj, value) {
            get_threat_searchVenus(obj, value)
                .then(res => {
                    console.log(res)
                    this.$setsessionStorage('search-item', res)
                    window.open(window.location.origin + '/#' + '/intelligence/threat_detail?searchStr=' + value)
                })
                .catch(err => {
                    this.btnLoading = false
                    console.log(err + 'err')
                })
        },
        getRecords() {
            let records = this.seeForm.records
            if (records.length > 0) {
                this.recordsData = records.map(item => JSON.parse(item))
            } else {
                this.recordsData = []
            }
        },
        fromMap(reportFrom) {
            if (reportFrom == 0) {
                return '手动'
            } else if (reportFrom == 1) {
                return '自动'
            } else if (reportFrom == 2) {
                return '模型'
            }
        },
        findRule(id) {
            if (!id) {
                this.$message.warning('无法查询对应规则')
                return
            }
            // this.$router.push({
            //     path: '/home/rule_cep_show',
            //     query: {
            //         id: id
            //     }
            // })
            this.$setsessionStorage('currentPath', '/rule/rule_cep_show?id=' + id)
            window.open(window.location.origin + '/#' + '/rule/rule_cep_show?id=' + id)
        },
        dateFormat(row, column, cellValue, index) {
            if (!row.createTime) {
                return ''
            }
            console.log(row.createTime)
            var date = new Date(row.createTime) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
            console.log(date)
            var Y = date.getFullYear() + '-'
            var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
            var D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' '
            var h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':'
            var m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':'
            var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
            return Y + M + D + h + m + s
        }
    }
}
</script>

<style scoped lang="scss">
.click-btn {
    cursor: pointer;
    font-size: 12px;
    i {
        margin-right: 5px;
        color: #387dee;
    }
    span {
        color: rgb(0 0 0 / 90%);
    }
}
.click-btn:hover {
    // background: #0d4873;
}
.container ::v-deep .el-icon-arrow-down::before {
    content: '';
}
.container ::v-deep .icon-sousuo::before {
    content: '';
}
.container {
    ::v-deep .el-descriptions-item__label {
        width: 100px;
    }
    .small-table {
        margin-bottom: 10px;
        &:last-child {
            margin-bottom: 0;
        }
        .head {
            padding: 10px;
            border: solid 1px #dddddd;
            // box-shadow: inset 0px 0px 6px 0px rgba(0, 186, 255, 0.73);
            border-radius: 4px 4px 0 0;
            background-color: #ebf1f5;
            .head-icon {
                margin-right: 10px;
                font-size: 12px;
                color: #387dee;
            }
            .head-left {
                margin-right: 40%;
            }
            .head-right {
                .text-one {
                    margin-right: 10px;
                    color: rgb(0 0 0 / 40%);
                }
            }
        }
        .content {
            padding: 10px;
            // width: 600px;
            // background-color: #033254;
            // box-shadow: inset 0px 0px 6px 0px rgba(0, 186, 255, 0.73), inset 0px -1px 0px 0px rgba(40, 82, 124, 0.5);
            border: solid 1px #dddddd;
            border-top: none;
        }
    }
}
</style>
<style lang="scss" scoped>
.echart-box {
    position: relative;
    margin: 0 auto;
    width: 700px;
    height: 700px;
    .time-select-box {
        position: absolute;
        top: -45px;
        right: 20px;
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
