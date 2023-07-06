<template>
    <div class="auto">
        <div class="title mb-1">剧本信息</div>
        <el-descriptions :column="2" size="mini" border>
            <el-descriptions-item label="人工任务类型">{{seeForm.mission||'--'}}</el-descriptions-item>
            <el-descriptions-item label="审核内容">{{seeForm.affirmContent||'--'}}</el-descriptions-item>
            <el-descriptions-item label="责任人">{{seeForm.dutyPeople||'--'}}</el-descriptions-item>
            <el-descriptions-item label="优先级">{{seeForm.priority | priorityList}}</el-descriptions-item>
            <el-descriptions-item label="任务描述">{{seeForm.describe||'--'}}</el-descriptions-item>
            <el-descriptions-item label="截止时间">{{seeForm.tillTime||'--'}}</el-descriptions-item>
        </el-descriptions>
        <div class="title mt-1 mb-1">事件详情</div>
        <el-descriptions :column="2" size="mini" border>
            <el-descriptions-item label="事件名称">{{alarmForm.reportName||'--'}}</el-descriptions-item>
            <el-descriptions-item label="事件等级">
                <span v-if="alarmForm.reportLevel == 0" class="title-level zero">低</span>
                <span v-if="alarmForm.reportLevel == 1" class="title-level one">中低</span>
                <span v-if="alarmForm.reportLevel == 2" class="title-level two">中</span>
                <span v-if="alarmForm.reportLevel == 3" class="title-level three">中高</span>
                <span v-if="alarmForm.reportLevel == 4" class="title-level fore">高</span>
            </el-descriptions-item>
            <el-descriptions-item label="事件类型">{{alarmForm.reportTypeName||'--'}}</el-descriptions-item>
            <!-- <el-descriptions-item label="事件状态">{{'--'}}</el-descriptions-item> -->
            <el-descriptions-item label="源IP">
                <el-popover popper-class="add-search-order-detail desIp-popover-box" placement="bottom" title="" trigger="click">
                    <div>
                        <p @click="jumpAsset(alarmForm.srcIp)" class="ub ub-ac click-btn">
                            <i class="iconfont icon-chaxunzichan" style="font-size: 12px;"></i>
                            <span>查询资产</span>
                        </p>
                        <p style="margin-top: 10px;" @click="jumpThreat(alarmForm.srcIp)" class="ub ub-ac click-btn">
                            <i class="iconfont icon-chaxunqingbao" style="font-size: 12px;"></i>
                            <span>查询情报</span>
                        </p>
                    </div>
                    <p class="highlighted" style=" display: inline-block; text-decoration: underline; color: #387dee;cursor: pointer;" slot="reference">
                        <i
                            v-if="alarmForm.srcIpVenusIsSpite != '内网'"
                            class="iconfont"
                            :style="{
                                color: formatColor(alarmForm.srcIpVenusIsSpite)
                            }"
                            :title="'VenusEye：'+alarmForm.srcIpVenusIsSpite"
                            :class="{
                                'icon-liebiaonei-anquan': alarmForm.srcIpVenusIsSpite == '安全',
                                'icon-liebiaonei-buanquan': alarmForm.srcIpVenusIsSpite == '恶意',
                                'icon-liebiaonei-weizhi': alarmForm.srcIpVenusIsSpite == '未知'
                            }"
                        ></i>
                        <i
                            v-if="alarmForm.srcIpIsSpite != '内网'"
                            class="iconfont"
                            :style="{
                                color: formatColor(alarmForm.srcIpIsSpite)
                            }"
                            :title="'微步：'+alarmForm.srcIpIsSpite"
                            :class="{
                                'icon-liebiaonei-anquan': alarmForm.srcIpIsSpite == '安全',
                                'icon-liebiaonei-buanquan': alarmForm.srcIpIsSpite == '恶意',
                                'icon-liebiaonei-weizhi': alarmForm.srcIpIsSpite == '未知'
                            }"
                        ></i>
                        {{ alarmForm.srcIp }}
                    </p>
                </el-popover>
            </el-descriptions-item>
            <el-descriptions-item label="攻击源端口">{{alarmForm.srcPort||'--'}}</el-descriptions-item>
            <el-descriptions-item label="目的IP">
                <el-popover popper-class="add-search-order-detail desIp-popover-box" placement="bottom" title="" trigger="click">
                    <div>
                        <p @click="jumpAsset(alarmForm.desIp)" class="ub ub-ac click-btn">
                            <i class="iconfont icon-chaxunzichan" style="font-size: 12px;"></i>
                            <span>查询资产</span>
                        </p>
                        <p style="margin-top: 10px;" @click="jumpThreat(alarmForm.desIp)" class="ub ub-ac click-btn">
                            <i class="iconfont icon-chaxunqingbao" style="font-size: 12px;"></i>
                            <span>查询情报</span>
                        </p>
                    </div>
                    <p class="highlighted" style=" display: inline-block; text-decoration: underline; color: #387dee;cursor: pointer;" slot="reference">
                        <i
                            v-if="alarmForm.desIpVenusIsSpite != '内网'"
                            class="iconfont"
                            :style="{
                                color: formatColor(alarmForm.desIpVenusIsSpite)
                            }"
                            :title="'VenusEye：'+alarmForm.desIpVenusIsSpite"
                            :class="{
                                'icon-liebiaonei-anquan': alarmForm.desIpVenusIsSpite == '安全',
                                'icon-liebiaonei-buanquan': alarmForm.desIpVenusIsSpite == '恶意',
                                'icon-liebiaonei-weizhi': alarmForm.desIpVenusIsSpite == '未知'
                            }"
                        ></i>
                        <i
                            v-if="alarmForm.desIpIsSpite != '内网'"
                            class="iconfont"
                            :style="{
                                color: formatColor(alarmForm.desIpIsSpite)
                            }"
                            :title="'微步：'+alarmForm.desIpIsSpite"
                            :class="{
                                'icon-liebiaonei-anquan': alarmForm.desIpIsSpite == '安全',
                                'icon-liebiaonei-buanquan': alarmForm.desIpIsSpite == '恶意',
                                'icon-liebiaonei-weizhi': alarmForm.desIpIsSpite == '未知'
                            }"
                        ></i>
                        {{ alarmForm.desIp }}
                    </p>
                </el-popover>
            </el-descriptions-item>
            <el-descriptions-item label="攻击结果">{{alarmForm.attackResult||'--'}}</el-descriptions-item>
            <el-descriptions-item label="是否封禁">{{alarmForm.isBanned||'--'}}</el-descriptions-item>
            <el-descriptions-item label="规则名称">{{alarmForm.ruleName||'--'}}</el-descriptions-item>
            <el-descriptions-item label="是否溯源">{{alarmForm.isTrace||'--'}}</el-descriptions-item>
        </el-descriptions>
        <div class="title mt-1">原始日志</div>
        <logs :id="seeForm.autoOrderId" :logId="alarmForm.logId"></logs>
        <div style="position: relative;">
            <div class="title">任务处理</div>
            <div v-if="isShow == 1">
                <el-form label-width="80px" label-position="top" ref="addForm" :model="addForm" style="margin-bottom: 100px;">
                    <el-form-item label="处理意见:">
                        <el-input maxlength="200" v-model="addForm.des" placeholder="请输入" style="width: 100%;" size="small" clearable type="textarea"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div v-if="isShow == 2">
                <el-form label-width="80px" label-position="top" ref="addForm" :model="addForm" style="margin-bottom: 100px;">
                    <el-form-item :label="seeForm.question+':'">
                        <el-select placeholder="请选择" style="width: 100%;" v-model="addForm.des" size="small">
                            <el-option :label="item.option" :value="item.option" v-for="(item,index) in seeForm.optionList" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer" style="position: fixed;right: 0;bottom: 0;z-index: 9999;padding-bottom: 10px;width: 720px;text-align: right;background: #ffffff;">
                <el-button size="small" @click="submitCloes">取消</el-button>
                <el-button size="small" type="primary" style="margin-right: 10px;" @click="submitAdd('addForm')">确定</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import logs from './logs.vue'
import { autoOrderApprove } from '@/server/auto_respond/execution_list'
import { get_threat_search, getStartConfig, get_threat_searchVenus } from '@/server/alarm/api.js'
export default {
    props: ['id', 'seeForm', 'alarmForm'],
    components: { logs },
    data() {
        return {
            startData: [],
            addForm: {
                des: ''
            },
            isShow: 1
        }
    },
    created() {
        this.getStartConfigData()
        if (this.seeForm.mission == '确认类') {
            this.isShow = 1
        } else if (this.seeForm.mission == '判断类') {
            this.isShow = 2
        }
    },
    filters: {
        priorityList(val) {
            console.log(val)
            if (val == 1) {
                return '高'
            } else if (val == 2) {
                return '中'
            } else if (val == 3) {
                return '低'
            } else if (val == 4) {
                return '紧急'
            }
        }
    },
    methods: {
        getStartConfigData() {
            getStartConfig({ queryData: {}, paramsData: {}}).then(res => {
                this.startData = res
            })
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
        formatColor(val) {
            console.log(val)
            if (val == '安全') {
                return '#00ff48'
            } else if (val == '恶意') {
                return '#ff0000'
            } else if (val == '未知') {
                return '#7c7c7c'
            } else {
                return '--'
            }
        },
        submitCloes() {
            console.log(this.$parent)
            this.$emit('submitCloes')
        },
        submitAdd() {
            let data = {
                queryData: {},
                paramsData: {
                    autoOrderId: this.seeForm.autoOrderId,
                    taskId: this.seeForm.taskId,
                    processInstanceId: this.seeForm.processInstanceId,
                    deploymentId: this.seeForm.deploymentId,
                    runningTime: this.seeForm.runningTime,
                    approveOpinion: this.addForm.des,
                    dealContent: JSON.stringify({ title: this.seeForm.question, answer: this.addForm.des }),
                    nodeId: this.seeForm.nodeId
                }
            }
            console.log(data)
            autoOrderApprove(data).then(res => {
                this.$message({
                    message: '处理成功',
                    type: 'success'
                })
                this.$emit('submitCloes', '1')
            }).catch(err => {
                console.log(err)
            })
        },
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex % 2) {
                return 'table-row2'
            } else {
                return 'table-row1'
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.click-btn {
    cursor: pointer;
    font-size: 12px;
    i {
        margin-right: 5px;
        color: #387dee;
    }
    span .val {
        color: #387dee;
    }
}
.title {
    font-size: 12px;
    color: #0052d9;
}
.auto {
    ::v-deep .el-descriptions-item__label {
        width: 120px !important;
    }
}
</style>
