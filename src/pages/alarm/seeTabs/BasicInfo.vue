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
                            <i class="iconfont icon-chaxunzichan" style="font-size:12px"></i>
                            <span>查询资产</span>
                        </p>
                        <p style="margin-top:10px" @click="jumpThreat(seeForm.srcIp)" class="ub ub-ac click-btn">
                            <i class="iconfont icon-chaxunqingbao" style="font-size:12px"></i>
                            <span>查询情报</span>
                        </p>
                    </div>
                    <p class="highlighted" style="cursor: pointer; text-decoration: underline; color: #387dee; display: inline-block;" slot="reference">
                        <i
                            v-if="seeForm.srcIpIsSpite != '内网' && seeForm.srcIp"
                            class="iconfont"
                            :style="{
                                color: [{ type: '安全', color: '#00ff48' }, { type: '恶意', color: '#ff0000' }, { type: '未知', color: '#7c7c7c' }].filter(
                                    co => co.type == seeForm.srcIpIsSpite
                                )[0].color
                            }"
                            :title="seeForm.srcIpIsSpite"
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
                            <i class="iconfont icon-chaxunzichan" style="font-size:12px"></i>
                            <span>查询资产</span>
                        </p>
                        <p style="margin-top:10px" @click="jumpThreat(seeForm.desIp)" class="ub ub-ac click-btn">
                            <i class="iconfont icon-chaxunqingbao" style="font-size:12px"></i>
                            <span>查询情报</span>
                        </p>
                    </div>
                    <p class="highlighted" style="cursor: pointer; text-decoration: underline; color: #387dee; display: inline-block;" slot="reference">
                        <i
                            v-if="seeForm.desIpIsSpite != '内网' && seeForm.desIp"
                            class="iconfont"
                            :style="{
                                color: [{ type: '安全', color: '#00ff48' }, { type: '恶意', color: '#ff0000' }, { type: '未知', color: '#7c7c7c' }].filter(
                                    co => co.type == seeForm.desIpIsSpite
                                )[0].color
                            }"
                            :title="seeForm.desIpIsSpite"
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
            <el-descriptions-item label="域名">{{ seeForm.domainName }}</el-descriptions-item>
            <el-descriptions-item label="安全域">{{ seeForm.securityDomain }}</el-descriptions-item>
            <el-descriptions-item label="归并量">{{ seeForm.gbNum }}</el-descriptions-item>
            <el-descriptions-item label="封禁状态">{{ seeForm.isBanned == 1 ? '已封禁' : seeForm.isBanned === 0 ? '未封禁' : '--' }}</el-descriptions-item>
            <el-descriptions-item label="总数">{{ seeForm.count ? seeForm.count : '' }}</el-descriptions-item>
            <el-descriptions-item label="规则名称">
                <p style="cursor: pointer; color: #387dee" v-if="seeForm.ruleName" @click="findRule(seeForm.ruleId)">{{ seeForm.ruleName }}</p>
            </el-descriptions-item>

            <el-descriptions-item label="事件描述" :span="2"><div class="text-color" style="width: 600px;" v-html="seeForm.reportDesc"></div></el-descriptions-item>
            <el-descriptions-item label="攻击结果" :span="2"><div class="text-color" style="width: 600px;" v-html="seeForm.attackResult"></div></el-descriptions-item>
            <!-- <el-descriptions-item label="分析过程" :span="2">
                <div class="text-color" style="width: 600px;" v-html="seeForm.analyzePro"></div>
            </el-descriptions-item> -->
            <el-descriptions-item label="处置建议" :span="2"><div class="text-color" style="width: 600px;" v-html="seeForm.advice"></div></el-descriptions-item>
            <el-descriptions-item label="处置方式" :span="2"><div class="text-color" style="width: 600px;" v-html="seeForm.actionType"></div></el-descriptions-item>
            <!-- <el-descriptions-item label="处置结果" :span="2">
                <div class="text-color" style="width: 600px;" v-html="seeForm.actionResults"></div>
            </el-descriptions-item> -->
            <el-descriptions-item label="二线分析" :span="2"><div class="text-color" style="width: 600px;" v-html="seeForm.appendProposal"></div></el-descriptions-item>
            <!-- <el-descriptions-item label="驳回理由" :span="2">
                <div class="text-color" style="width: 600px;" v-html="seeForm.rejectReason"></div>
            </el-descriptions-item> -->
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
        </el-descriptions>
    </div>
</template>

<script>
import { get_threat_search } from '@/server/intelligence/api.js'
export default {
    name: 'BasicInfo',
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
                return '已处置'
            } else if (val == 3) {
                return '已驳回'
            } else {
                return '--'
            }
        }
    },
    watch: {
        seeForm(val) {
            if (val) {
                // this.getRecords()
            }
        }
    },
    data() {
        return {
            recordsData: []
        }
    },
    mounted() {
        // this.getRecords()
        console.log(this.seeForm)
    },
    methods: {
        jumpAsset(value) {
            this.$setsessionStorage('currentPath', '/assets/assets_asset_info?ip=' + value)
            window.open(window.location.origin + '/#' + '/assets/assets_asset_info?ip=' + value)
        },
        jumpThreat(value) {
            let obj = {
                queryData: { value },
                paramsData: {}
            }
            get_threat_search(obj)
                .then(res => {
                    console.log(res)
                    this.$setsessionStorage('search-item', res)
                    let route = this.$router.resolve({
                        name: 'intelligence_threat_detail',
                        query: {
                            searchStr: value
                        }
                    })
                    window.open(route.href, '_blank')
                })
                .catch(err => {
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
        color: rgba(0,0,0,.9);
    }
}
.click-btn:hover {
    // background: #0d4873;
}
.container ::v-deep .el-icon-arrow-down:before {
    content: '';
}
.container ::v-deep .icon-sousuo:before {
    content: '';
}
.container {
    ::v-deep .el-descriptions-item__label{
        width:100px;
    }
    .small-table {
        margin-bottom: 10px;
        &:last-child {
            margin-bottom: 0;
        }
        .head {
            background-color: #ebf1f5;
            // box-shadow: inset 0px 0px 6px 0px rgba(0, 186, 255, 0.73);
            border-radius: 4px 4px 0px 0px;
            border: solid 1px #dddddd;
            padding: 10px;
            .head-icon {
                font-size: 12px;
                color: #387dee;
                margin-right: 10px;
            }
            .head-left {
                margin-right: 40%;
            }
            .head-right {
                .text-one {
                    color: rgba(0,0,0,0.4);
                    margin-right: 10px;
                }
            }
        }
        .content {
            // width: 600px;
            // background-color: #033254;
            // box-shadow: inset 0px 0px 6px 0px rgba(0, 186, 255, 0.73), inset 0px -1px 0px 0px rgba(40, 82, 124, 0.5);
            border: solid 1px #dddddd;
            border-top:none;
            padding: 10px;
        }
    }
}
</style>
