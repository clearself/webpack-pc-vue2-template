<template>
    <div class="event event-wrapper overview report-platform">
        <div class="w100">
            <div class="event-content w100">
                <div class="ub ub-ac ub-pj w100" style="margin-bottom: 33px;">
                    <div class="list-tips" style="margin: 0;">数据概览</div>
                    <div class="ub ub-ac ub-pc change-box">
                        <div class="time-btn" :class="{'active':item.isActive}" v-for="(item,index) in timeType" :key="index" @click="changeTimeType(item,index)">{{item.label}}</div>
                    </div>
                </div>
                <div v-loading="statistic_loading" class="w100 statistic-box">
                    <div class="ub w100 num-statistic mb-2">
                        <div class="ub ub-f1 chart-box bg" v-for="(item,index) in topList1" :key="item.type">
                            <span class="angle1"></span>
                            <span class="angle2"></span>
                            <span class="angle3"></span>
                            <span class="angle4"></span>
                            <div class="ub w100 ub-ver statistic-item">
                                <div class="ub ub-ver w100 ub-ac ub-pc">
                                    <div class='icon'><i class="iconfont icon-tongjigailanzongliangicon" :class="['color'+(index+1)]" style="font-size: 64px"></i></div>
                                    <div class="text">{{item.label}}</div>
                                </div>
                                <div class="ub w100 ub-ver statistic-item-bottom">
                                    <div class="ub w100 ub-pj color1">
                                        <div>
                                            <i></i>
                                            <span>今日</span>
                                        </div>
                                        <div>
                                            <span>{{item.jt | numChange}}<sub style="font-size:12px;position: relative;top:-5px;">{{item.jt>9999 ? '万': ''}}</sub></span>
                                        </div>
                                    </div>
                                    <div class="ub w100 ub-pj color1" style="margin-top: 5px;">
                                        <div>
                                            <i></i>
                                            <span>昨日</span>
                                        </div>
                                        <div>
                                            <span>{{item.zt|numChange}}<sub style="font-size:12px;position: relative;top:-5px;">{{item.zt>9999 ? '万': ''}}</sub></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="ub w100 num-statistic mb-2">
                        <div class="ub ub-f1 chart-box bg" v-for="(item,index) in topList2" :key="item.type">
                            <span class="angle1"></span>
                            <span class="angle2"></span>
                            <span class="angle3"></span>
                            <span class="angle4"></span>
                            <div class="ub w100 ub-ver statistic-item">
                                <div class="ub ub-ver w100 ub-ac ub-pc">
                                    <div class='icon'><i class="iconfont icon-tongjigailanzongliangicon" :class="['color'+(index+1)]" style="font-size: 64px"></i></div>
                                    <div class="text">{{item.label}}</div>
                                </div>
                                <div class="ub w100 ub-ver statistic-item-bottom">
                                    <div class="ub w100 ub-pj color1">
                                        <div>
                                            <i></i>
                                            <span>今日</span>
                                        </div>
                                        <div>
                                            <span>{{item.jt | numChange}}<sub style="font-size:12px;position: relative;top:-5px;">{{item.jt>9999 ? '万': ''}}</sub></span>
                                        </div>
                                    </div>
                                    <div class="ub w100 ub-pj color1" style="margin-top: 5px;">
                                        <div>
                                            <i></i>
                                            <span>昨日</span>
                                        </div>
                                        <div>
                                            <span>{{item.zt|numChange}}<sub style="font-size:12px;position: relative;top:-5px;">{{item.zt>9999 ? '万': ''}}</sub></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="chart-box w100 border mb-2" style="height:320px;padding-top:50px;">
                    <span class="angle1"></span>
                    <span class="angle2"></span>
                    <span class="angle3"></span>
                    <span class="angle4"></span>
                    <div class="ub ub-pj ub-ac w100 chart-top" style="padding:0 20px;box-sizing: border-box;">
                        <div class="title">{{attrackTitle}}量</div>
                        <div class="ub changeAttrack">
                            <!-- eslint-disable-next-line vue/no-use-v-if-with-v-for -->
                            <div :class="{'active':item.isActive}" v-for="(item,index) in attrackType" :key="index" v-if="index<=2" @click="changeAttrackType(item,index)">{{item.label}}</div>
                            <el-dropdown trigger="click">
                                <span class="el-dropdown-link" :class="{'active':otherActive}">
                                    <i class="el-icon-arrow-down el-icon--right" :class="{'active':otherActive}"></i> 其他
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <!-- eslint-disable-next-line vue/no-use-v-if-with-v-for -->
                                    <el-dropdown-item :class="{'active':item.isActive}"  v-for="(item,index) in attrackType" :key="index" v-if="index>2" @click.native="changeAttrackType(item,index)">{{item.label}}</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </div>
                    <div v-loading="logs_loading" style="width:100%;height:100%;cursor: pointer;padding: 2px;box-sizing: border-box;">
                        <div v-if="logs_no_data" class="ub ub-f1 ub-ac ub-pc" style="height:100%;color:#909399;font-size:14px; cursor: pointer;">
                            暂无数据
                        </div>
                        <brokenLine :chartData="brokenData" v-if="brokenData.length>0" />
                    </div>
                </div>
                <div class='ub ub-pj w100 mb-2'>
                    <div class="chart-box border" style="width:48%;height:320px;padding-top:50px;">
                        <span class="angle1"></span>
                        <span class="angle2"></span>
                        <span class="angle3"></span>
                        <span class="angle4"></span>
                        <div class="ub ub-pj ub-ac w100 chart-top" style="padding:0 20px;box-sizing: border-box;">
                            <div class="title">事件统计</div>
                        </div>
                        <div v-loading="event_loading" style="width:100%;height:100%;cursor: pointer;padding: 2px;box-sizing: border-box;">
                            <div v-if="event_no_data" class="ub ub-f1 ub-ac ub-pc" style="height:100%;color:#909399;font-size:14px; cursor: pointer;">
                                暂无数据
                            </div>
                            <typeBar :chartData="eventData" v-if="eventData.length>0" />
                        </div>
                    </div>
                    <div class="chart-box border" style="width:48%;height:320px;padding-top:50px;">
                        <span class="angle1"></span>
                        <span class="angle2"></span>
                        <span class="angle3"></span>
                        <span class="angle4"></span>
                        <div class="ub ub-pj ub-ac w100 chart-top" style="padding:0 20px;box-sizing: border-box;">
                            <div class="title">攻击类型TOP10</div>
                        </div>
                        <div v-loading="distribution_loading" style="width:100%;height:100%;cursor: pointer;padding: 2px;box-sizing: border-box;">
                            <div v-if="distribution_no_data" class="ub ub-f1 ub-ac ub-pc" style="height:100%;color:#909399;font-size:14px; cursor: pointer;">
                                暂无数据
                            </div>
                            <Bar :chartData="distributionData" v-if="distributionData.length>0" />
                        </div>
                    </div>
                </div>
                <!-- <div class="ub ub-pj w100 mb-2">
                    <div class="chart-box border" style="width:48%;height:484px;padding-top:50px;">
                        <span class="angle1"></span>
                        <span class="angle2"></span>
                        <span class="angle3"></span>
                        <span class="angle4"></span>
                        <div class="ub ub-pj ub-ac w100 chart-top" style="padding:0 20px;box-sizing: border-box;">
                            <div class="title">攻击源地域分布</div>
                        </div>
                        <div v-loading="attrackSrc_loading" style="width:100%;height:100%;cursor: pointer;padding: 2px;box-sizing: border-box;">
                            <div v-if="attrackSrc_no_data" class="ub ub-f1 ub-ac ub-pc" style="height:100%;color:#909399;font-size:14px; cursor: pointer;">
                                暂无数据
                            </div>
                            <chinaMap :chartData="attrackSrcData" v-if="attrackSrcData.length>0" />
                        </div>
                    </div>
                    <div class="chart-box border" style="width:48%;padding-top:50px;">
                        <span class="angle1"></span>
                        <span class="angle2"></span>
                        <span class="angle3"></span>
                        <span class="angle4"></span>
                        <div class="ub ub-pj ub-ac w100 chart-top" style="padding:0 20px;box-sizing: border-box;">
                            <div class="title">攻击源地址TOP10</div>
                        </div>
                        <el-table v-loading="attrack_src_address_loading" class="drill-table" :data="attrack_src_addressData" style="width: 96%;margin: 0 auto;">
                            <el-table-column align="center" type="index" label="排名" width="100" class-name="sortRank">
                            </el-table-column>
                            <el-table-column align="center" prop="sourceIp" label="攻击源地址">
                            </el-table-column>
                            <el-table-column align="center" prop="num" label="网络攻击量">
                            </el-table-column>
                            <el-table-column align="center" label="占比" width="100">
                                <template slot-scope="scope">
                                    <p style="color:#01cdf4;">{{scope.row.proportion}}</p>
                                </template>
                            </el-table-column>
                        </el-table>

                    </div>
                </div> -->
                <div class='ub ub-pj w100'>
                    <div class="chart-box border" style="width:48%; min-height:480px;padding-top:50px;">
                        <span class="angle1"></span>
                        <span class="angle2"></span>
                        <span class="angle3"></span>
                        <span class="angle4"></span>
                        <div class="ub ub-pj ub-ac w100 chart-top" style="padding:0 20px;box-sizing: border-box;">
                            <div class="title">被攻击系统TOP10</div>
                        </div>
                        <el-table v-loading="attracked_sys_loading" class="drill-table" :data="attracked_sys_Data" style="width: 96%;margin: 0 auto;">
                            <el-table-column align="center" type="index" label="排名" width="100" class-name="sortRank">
                            </el-table-column>
                            <el-table-column align="center" prop="targetSystem" label="被攻击系统">
                            </el-table-column>
                            <el-table-column align="center" prop="num" label="网络攻击量">
                            </el-table-column>
                            <el-table-column align="center" label="占比" width="100">
                                <template slot-scope="scope">
                                    <p style="color:#01cdf4;">{{scope.row.proportion}}%</p>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="chart-box border" style="width:48%; min-height:480px;padding-top:50px;">
                        <span class="angle1"></span>
                        <span class="angle2"></span>
                        <span class="angle3"></span>
                        <span class="angle4"></span>
                        <div class="ub ub-pj ub-ac w100 chart-top" style="padding:0 20px;box-sizing: border-box;">
                            <div class="title">被攻击IP地址TOP10</div>
                        </div>
                        <el-table v-loading="attracked_ip_loading" class="drill-table" :data="attracked_ip_Data" style="width: 96%;margin: 0 auto;">
                            <el-table-column align="center" type="index" label="排名" width="100" class-name="sortRank">
                            </el-table-column>
                            <el-table-column align="center" prop="destinationIp" label="被攻击IP">
                            </el-table-column>
                            <el-table-column align="center" prop="num" label="网络攻击量">
                            </el-table-column>
                            <el-table-column align="center" label="占比" width="100">
                                <template slot-scope="scope">
                                    <p style="color:#01cdf4;">{{scope.row.proportion}}%</p>
                                </template>
                            </el-table-column>
                        </el-table>

                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import {
    get_statistical_top,
    get_trend,
    get_event_bar,
    get_attrack_virus,
    // get_attrack_src,
    // get_attrack_src_address,
    get_attracked_sys,
    get_attracked_ip
} from '@/server/reporting_platform/setting.js'
import {
    event_data

} from '../config_data.js'
import brokenLine from './charts/brokenLine.vue'
import typeBar from './charts/typeBar.vue'
import Bar from './charts/bar.vue'
export default {
    name: 'Overview',
    components: {
        brokenLine,
        typeBar,
        Bar
    },
    data() {
        return {
            statistic_loading: false,
            topList1: [],
            topList2: [],
            attrackTitle: '网络攻击',
            otherActive: false,
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
            siteApp: {
                jt: '',
                zt: ''

            },
            ddosAttack: {
                jt: '',
                zt: ''
            },
            viralInfection: {
                jt: '',
                zt: ''
            },
            viralInfectionNum: {
                jt: '',
                zt: ''
            },
            maliciousMail: {
                jt: '',
                zt: ''
            },
            networkAttack: {
                jt: '',
                zt: ''
            },
            antiWasteMail: {
                jt: '',
                zt: ''
            },
            networkType: 1,
            networkFromType: 1,
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
            // [{
            //     label: '网络攻击',
            //     value: 0,
            //     isActive: true
            // }, {
            //     label: 'DDOS攻击',
            //     value: 1,
            //     isActive: false
            // }, {
            //     label: '病毒感染',
            //     value: 2,
            //     isActive: false
            // }, {
            //     label: '恶意邮件',
            //     value: 3,
            //     isActive: false
            // }, {
            //     label: '反垃圾邮件',
            //     value: 4,
            //     isActive: false
            // }, {
            //     label: '防病毒安装数',
            //     value: 5,
            //     isActive: false
            // }, {
            //     label: '钓鱼网站/假冒APP',
            //     value: 6,
            //     isActive: false
            // }],

            // 折线
            logs_loading: false,
            logs_no_data: false,
            brokenData: [],
            event_loading: false,
            event_no_data: false,
            eventData: [],
            attrackSrc_loading: false,
            attrackSrc_no_data: false,
            attrackSrcData: [],

            distribution_loading: false,
            distribution_no_data: false,
            distributiondDataType: true,
            distributionData: [],

            // 年度攻击
            attrack_loading: false,
            attrackData: [],
            // 攻击源地址top0
            attrack_src_address_loading: false,
            attrack_src_addressData: [],
            // 攻击源地址top0
            attracked_sys_loading: false,
            attracked_sys_Data: [],
            // 攻击源地址top0
            attracked_ip_loading: false,
            attracked_ip_Data: []
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
                    isActive: index === 0
                }
            })
            return list
        }
    },
    mounted() {
        console.log(this.$message)
        this.$nextTick(() => {
            this.initTopStatic()
            this.initNetworkAttack()
            this.initEventBar()
            this.initAttrackVirus()
            // this.initAttrackSrc()
            // this.initAttrackSrcAddress()
            this.initAttrackedSys()
            this.initAttrackedIp()
        })
    },
    methods: {
        changeDistributiondData() {
            this.distributiondDataType = !this.distributiondDataType
            this.initAttrackVirus()
        },
        changeTimeType(obj, index) {
            console.log(obj)
            this.timeType = this.timeType.map(item => {
                item.isActive = false
                return item
            })
            obj.isActive = true
            this.networkType = obj.value
            // 刷新数据
            this.initNetworkAttack()
            this.initEventBar()

            this.initAttrackVirus()
            // this.initAttrackSrc()
            // this.initAttrackSrcAddress()
            this.initAttrackedSys()
            this.initAttrackedIp()
        },
        changeAttrackType(obj, index) {
            console.log(obj)
            this.attrackType = this.attrackType.map(item => {
                item.isActive = false
                return item
            })
            if (index > 2) {
                this.otherActive = true
            } else {
                this.otherActive = false
            }
            this.attrackTitle = obj.label
            obj.isActive = true
            this.networkFromType = obj.value
            // 刷新数据
            this.initNetworkAttack()
        },

        initTopStatic() {
            this.statistic_loading = true
            this.topList1 = []
            this.topList2 = []
            get_statistical_top().then(res => {
                console.log('顶部统计', res)
                this.statistic_loading = false
                let all_list = event_data.filter(item => item.type !== 11)
                let list = this.$deepCopy(all_list)
                list.forEach((item, index) => {
                    let cur = res.filter(_item => _item.dataType === item.type)
                    if (cur.length > 0) {
                        item.jt = cur[0].today
                        item.zt = cur[0].yesterday
                    } else {
                        item.jt = 0
                        item.zt = 0
                    }

                    if (index <= 4) {
                        this.topList1.push(item)
                    } else {
                        this.topList2.push(item)
                    }
                })
                // this.siteApp = res.siteApp
                // this.ddosAttack = res.ddosAttack
                // this.viralInfection = res.viralInfection
                // this.viralInfectionNum = res.viralInfectionNum
                // this.maliciousMail = res.maliciousMail
                // this.networkAttack = res.networkAttack
                // this.antiWasteMail = res.antiWasteMail
            }).catch(error => {
                this.statistic_loading = false
                console.log('error' + error)
            })
        },
        initNetworkAttack() {
            this.logs_loading = true
            this.logs_no_data = true
            this.brokenData = []
            let data = {
                queryData: {},
                paramsData: {
                    type: this.networkType,
                    dataType: this.networkFromType
                }
            }
            get_trend(data).then(res => {
                console.log('网络攻击量', res)
                this.logs_loading = false
                if (res.length > 0) {
                    this.logs_no_data = false
                    this.brokenData = res.map(item => {
                        return {
                            days: item.time,
                            num: item.sent
                        }
                    })
                }
            }).catch(error => {
                this.logs_loading = false
                console.log('error' + error)
            })
        },
        initEventBar() {
            this.event_loading = true
            this.event_no_data = true
            this.eventData = []
            let data = {
                queryData: {},
                paramsData: {
                    type: this.networkType
                }
            }
            get_event_bar(data).then(res => {
                console.log('事件', res)
                this.event_loading = false
                let arr = []
                if (res) {
                    this.event_no_data = false
                    res.forEach(item => {
                        let cur = event_data.filter(_item => _item.code === item.dataCode)
                        arr.push({
                            name: cur.length > 0 ? cur[0].label : '',
                            jr: item.total,
                            sb: item.sent
                        })
                    })
                    this.eventData = arr
                }
            }).catch(error => {
                this.event_loading = false
                console.log('error' + error)
            })
        },

        initAttrackVirus() {
            this.distribution_loading = true
            this.distribution_no_data = true
            this.distributionData = []
            let data = {
                queryData: {},
                paramsData: {
                    type: this.networkType
                }
            }
            get_attrack_virus(data).then(res => {
                console.log('攻击型分布', res)
                this.distribution_loading = false
                if (res.length > 0) {
                    this.distribution_no_data = false
                    res.forEach(item => {
                        this.distributionData.push({
                            name: item.reportType,
                            num: item.count
                        })
                    })
                }
            }).catch(error => {
                this.distribution_loading = false
                console.log('error' + error)
            })
        },
        initAttrackSrc() {
            this.attrackSrc_loading = true
            this.attrackSrc_no_data = true
            this.attrackSrcData = []
            let data = {
                queryData: {},
                paramsData: {
                    type: this.networkType
                }
            }
            // get_attrack_src(data).then(res => {
            //     console.log('攻击源地域分布', res)
            //     this.attrackSrc_loading = false
            //     let _data = {}
            //     let arr = []
            //     if (JSON.stringify(res) != '{}') {
            //         for (let attr in res) {
            //             if (attr === '不明省份') {
            //                 continue
            //             }
            //             if (attr.indexOf('省') > -1 || attr.indexOf('市') > -1) {
            //                 let _attr = attr.substring(0, attr.length - 1)
            //                 _data[_attr] = res[attr]
            //             } else {
            //                 _data[attr] = res[attr]
            //             }
            //         }
            //         console.log('_data', _data)
            //         this.attrackSrc_no_data = false
            //         let keyList = Object.keys(_data)
            //         console.log(keyList)
            //         keyList.forEach(item => {
            //             arr.push({
            //                 name: item,
            //                 value: _data[item]
            //             })
            //         })
            //         this.attrackSrcData = arr
            //     }
            // }).catch(error => {
            //     this.attrackSrc_loading = false
            //     console.log('error' + error)
            // })
        },

        initAttrackSrcAddress() {
            this.attrack_src_address_loading = true
            this.attrack_src_addressData = []
            let data = {
                queryData: {},
                paramsData: {
                    type: this.networkType
                }
            }
            // get_attrack_src_address(data).then(res => {
            //     console.log('攻击源地址top10', res)
            //     this.attrack_src_address_loading = false
            //     if (res.length > 0) {
            //         res.forEach(item => {
            //             let obj = {}
            //             obj.sourceIp = item.sourceIp
            //             obj.num = item.num
            //             obj.proportion = item.proportion
            //             this.attrack_src_addressData.push(obj)
            //         })
            //     }
            // }).catch(error => {
            //     this.attrack_src_address_loading = false
            //     console.log('error' + error)
            // })
        },
        initAttrackedSys() {
            this.attrack_sys_loading = true
            this.attracked_sys_Data = []
            let data = {
                queryData: {},
                paramsData: {
                    type: this.networkType
                }
            }
            get_attracked_sys(data).then(res => {
                console.log('攻击源地址top10', res)
                this.attrack_sys_loading = false
                if (res.length > 0) {
                    res.forEach(item => {
                        let obj = {}
                        obj.targetSystem = item.destinationSystem
                        obj.num = item.sumnum
                        obj.proportion = item.percent ? item.percent : 0
                        this.attracked_sys_Data.push(obj)
                    })
                }
            }).catch(error => {
                this.attrack_sys_loading = false
                console.log('error' + error)
            })
        },
        initAttrackedIp() {
            this.attrack_ip_loading = true
            this.attracked_ip_Data = []
            let data = {
                queryData: {},
                paramsData: {
                    type: this.networkType
                }
            }
            get_attracked_ip(data).then(res => {
                console.log('攻击源地址top10', res)
                this.attrack_ip_loading = false
                if (res.length > 0) {
                    res.forEach(item => {
                        let obj = {}
                        obj.destinationIp = item.destinationIp
                        obj.num = item.sumnum
                        obj.proportion = item.percent ? item.percent : 0
                        this.attracked_ip_Data.push(obj)
                    })
                }
            }).catch(error => {
                this.attrack_ip_loading = false
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
.statistic-box{
    min-height:100px;
}
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
}

.el-table--border::after,
.el-table--group::after,
.el-table::before {
    background-color: #d7d7d7!important;
}

.drill-table.el-table--enable-row-hover .el-table__body tr:hover>td {
    background: rgba(0, 0, 0, 0)!important;
}

</style>
