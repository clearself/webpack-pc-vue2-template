<template>
    <div class="list">
        <SearchTop @search="search" @reset="reset" style="border-top-left-radius: 0;border-top-right-radius: 0;box-shadow: none;">
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params">
                    <el-form-item label="剧本名称：" label-width="80px">
                        <el-input placeholder="请输入" clearable v-model="get_params.name" size="small" maxlength="20"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params">
                    <el-form-item label="剧本类型：" prop="type" label-width="80px">
                        <el-select placeholder="请选择" style="width: 100%;" v-model="get_params.type" size="small">
                            <el-option label="分析处置" value="0"></el-option>
                            <el-option label="应急响应" value="1"></el-option>
                            <el-option label="运维支持" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :md="13" :lg="9" :xl="7">
                <el-form :model="get_params">
                    <el-form-item label="时间：" class="date-close" label-width="85px">
                        <el-date-picker
                            style="width: 100%;"
                            clearable
                            size="small"
                            value-format="yyyy-MM-dd"
                            v-model="sayTimes"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            prefix-icon="iconfont icon-riqi">
                        </el-date-picker>
                    </el-form-item>
                </el-form>
            </el-col>
        </SearchTop>
        <div class="list-container">
            <div class="ub ub-pj w100 mb-1 ub-ac">
                <div class="list-tips">任务执行列表</div>
            </div>
            <el-table
                ref="multipleTable"
                v-loading="loading"
                class='bigTable'
                :data="tableData"
                border
                stripe
                tooltip-effect="dark"
                :row-class-name="tableRowClassName"
                :height="tabHeight"
                :row-style="{ height: '32px' }"
                :header-row-style="{ height: '32px' }">
                <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号"></el-table-column>
                <el-table-column prop="createTime" label="任务执行时间"></el-table-column>
                <el-table-column prop="autoOrderId" label="任务ID"></el-table-column>
                <el-table-column prop="autoName" label="剧本名称"></el-table-column>
                <el-table-column prop="mouldType" label="剧本类型">
                    <template slot-scope="scoped">
                        <div v-if="scoped.row.mouldType == 1">应急响应</div>
                        <div v-if="scoped.row.mouldType == 0">分析处置</div>
                        <div v-if="scoped.row.mouldType == 2">运维支持</div>
                    </template>
                </el-table-column>
                <el-table-column prop="userName" label="任务发起人"></el-table-column>
                <el-table-column prop="statusName" label="状态">
                    <template slot-scope="scope">
                        <span
                            style="display: inline-block;width: 140px;border-radius: 24px;text-align: center;color: #03864f;background-color: #ccf5e4; heihgt: 20px;"
                            v-if="scope.row.statusName == '进行中'"
                        >
                            进行中
                        </span>
                        <span
                            style="display: inline-block;width: 140px;border-radius: 24px;text-align: center;color: #0052d9;background-color: #d5e5fa; heihgt: 20px;"
                            v-if="scope.row.statusName == '已完成'"
                        >
                            已完成
                        </span>
                        <span
                            style="display: inline-block;width: 140px;border-radius: 24px;text-align: center;color: #a502cf;background-color: #fad7f6; heihgt: 20px;"
                            v-if="scope.row.statusName == '已撤销'"
                        >
                            已撤销
                        </span>
                        <span
                            style="display: inline-block;width: 140px;border-radius: 24px;text-align: center;color: #f56c6c;background-color: rgb(245 108 108 / 30%); heihgt: 20px;"
                            v-if="scope.row.statusName == '已超时'"
                        >
                            已超时
                        </span>
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="autoOrderContent" label="任务描述">
                    <template slot-scope="scoped">
                        <div v-html="scoped.row.autoOrderContent"></div>
                    </template>
                </el-table-column> -->
                <!-- </el-table-column> -->
                <el-table-column label="任务描述">
                    <template slot-scope="scope">
                        <!-- <span v-html="scope.row.des"></span> -->
                        <span v-if="scope.row.autoOrderContent" @click="showDesc(scope.row.autoOrderContent)" style="text-decoration: underline; color: #409eff; cursor: pointer;">描述内容</span>
                        <span v-else>--</span>
                    </template>
                </el-table-column>
                <el-table-column prop="endTime" label="任务结束时间"></el-table-column>
                <el-table-column align="center" label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button v-per="['auto_zx_look']" type="text" size="small" @click="handleSee(scope.row)">查看</el-button>
                        <el-button v-per="['auto_zx_cx']" type="text" size="small" @click="handleRevoke(scope.row)" :disabled="scope.row.statusName == '已完成' || scope.row.statusName == '已撤销'">撤销</el-button>
                        <el-button  v-per="['auto_zx_cf']" type="text" size="small" @click="handleRepeat(scope.row)" :disabled="scope.row.statusName != '已撤销'||scope.row.statusName != '已超时'">重发</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size" @pagination="get_data" style="padding-top: 10px;" v-show="total_num>0"/>
        </div>
        <!-- 查看详情 -->
        <el-drawer title="查看" :visible.sync="seeDialog" :size="920">
            <div class="auto" v-if="seeDialog">
                <div class="title mb-1">剧本信息</div>
                <el-descriptions :column="2" size="mini" border>
                    <el-descriptions-item label="任务ID">{{seeForm.autoOrderId||'--'}}</el-descriptions-item>
                    <el-descriptions-item label="剧本名称">{{seeForm.autoName||'--'}}</el-descriptions-item>
                    <el-descriptions-item label="剧本类型">
                        <div v-if="seeForm.mouldType == 1">应急响应</div>
                        <div v-if="seeForm.mouldType == 0">分析处置</div>
                        <div v-if="seeForm.mouldType == 2">运维支持</div>
                    </el-descriptions-item>
                    <el-descriptions-item label="任务状态">{{seeForm.statusName||'--'}}</el-descriptions-item>
                    <el-descriptions-item label="创建人">{{seeForm.userName||'--'}}</el-descriptions-item>
                    <el-descriptions-item label="任务开始时间">{{seeForm.createTime||'--'}}</el-descriptions-item>
                    <el-descriptions-item label="任务结束时间">{{seeForm.endTime||'--'}}</el-descriptions-item>
                    <el-descriptions-item label="任务描述">
                        <div v-html="seeForm.autoOrderContent"></div>
                    </el-descriptions-item>
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
                <logs :id="seeForm.sourceId" v-if="seeDialog" :logId="alarmForm.logId"></logs>
                <div class="title mb-1 mt-1">剧本详情</div>
                <bpmn-modeler
                    ref="refNode"
                    :xml="workFlowInfo.xml"
                    :workStatus="workStatus"
                    :currentWorkIds="currentWorkIds"
                    :processInstanceId="seeForm.processInstanceId"
                    :is-view="false"
                />
            </div>
        </el-drawer>
        <!-- 撤销 -->
        <!-- <el-dialog title="撤销" width="500px" :visible.sync="revokeDialog" custom-class="attendance-dialog">
            <div class="ub">
                <div class="work_plat_content" style="text-align: left;color: #606266">是否撤销？</div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="revokeDialog = false">取 消</el-button>
                <el-button size="small" type="primary" style="margin-right:10px" @click="submitRevoke()">确定</el-button>
            </div>
        </el-dialog> -->
        <StateDialog :dialogVisible=revokeDialog @delete="submitRevoke" @cancel="revokeDialog = false" :title="'是否撤销？'">
        </StateDialog>
        <StateDialog :dialogVisible=repeatDialog @delete="submitRepeat" @cancel="repeatDialog = false" :title="'是否重发？'">
        </StateDialog>
        <!-- 重发 -->
        <!-- <el-dialog title="重发" width="500px" :visible.sync="repeatDialog" custom-class="attendance-dialog">
            <div class="ub">
                <div class="work_plat_content" style="text-align: left;color: #606266">是否重发？</div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="repeatDialog = false">取 消</el-button>
                <el-button size="small" type="primary" style="margin-right:10px" @click="submitRepeat()">确定</el-button>
            </div>
        </el-dialog> -->
        <el-dialog title="描述详情" :visible.sync="descVis" width="700px" custom-class="common-dialog " @click.native="closeDrop">
            <div v-html="descHtml"></div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="closeDrop">取 消</el-button>
                <!-- <el-button type="primary" size="small" @click="closeDrop">确 定</el-button> -->
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { autoOrderPage, autoOrderStop, myTaskGetInfo, autoDramaRetransmission } from '@/server/auto_respond/execution_list.js'
import logs from './logs.vue'
import bpmnModeler from '../../../../script_flow/detailXml'
import { getMenace } from '@/server/alarm/alarm.js'
import { get_threat_search, getStartConfig, get_threat_searchVenus } from '@/server/alarm/api.js'
export default {
    components: { logs, bpmnModeler },
    data() {
        return {
            startData: [],
            get_params: {
                page: 1,
                size: 20,
                name: '',
                type: ''
            },
            sayTimes: [],
            loading: false,
            tableData: [],
            tabHeight: document.body.clientHeight - 286,
            total_num: 0,
            seeDialog: false,
            revokeDialog: false,
            repeatDialog: false,
            revokeForm: {
                processInstanceId: '',
                autoOrderId: ''
            },
            workFlowInfo: {
                xml: ''
            },
            workStatus: false,
            currentWorkIds: [],
            seeForm: {},
            alarmForm: {},
            repeatForm: {},
            descVis: false,
            descHtml: ''
        }
    },
    created() {
        this.get_data()
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
        showDesc(desc) {
            this.descVis = true
            this.descHtml = desc
        },
        closeDrop() {
            this.descVis = false
            this.descHtml = ''
        },
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
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
        async handleSee(row) {
            this.workFlowInfo.xml = row.xml
            this.workStatus = row.statusName != '进行中'
            this.currentWorkIds = row?.mouldInfo?.running
            this.seeForm = row
            this.seeDialog = true
            // this.currentWorkIds = row.nodeId
            let data = {
                queryData: {
                    autoOrderId: row.autoOrderId
                }
            }
            myTaskGetInfo(data).then(async res => {
                this.alarmForm = {}
                if (res.srcIp) {
                    try {
                        let srcIpIsSpite = await getMenace({
                            queryData: {
                                value: res.srcIp
                            }
                        })
                        console.log(srcIpIsSpite)
                        res.srcIpVenusIsSpite = srcIpIsSpite[0]
                        res.srcIpIsSpite = srcIpIsSpite[1]
                    } catch (e) {
                        console.log(e)
                    }
                }
                if (res.desIp) {
                    try {
                        let desIpIsSpite = await getMenace({
                            queryData: {
                                value: res.desIp
                            }
                        })
                        // console.log(desIpIsSpite)
                        res.desIpVenusIsSpite = desIpIsSpite[0]
                        res.desIpIsSpite = desIpIsSpite[1]
                    } catch (e) {
                        console.log(e)
                    }
                }
                this.alarmForm = res
                console.log(this.alarmForm)
            }).catch(err => {
                console.log(err)
            })
        },
        handleRevoke(row) {
            console.log(row)
            this.revokeForm = {
                processInstanceId: row.processInstanceId,
                autoOrderId: row.autoOrderId
            }
            this.revokeDialog = true
        },
        handleRepeat(row) {
            this.repeatForm = { ...row }
            this.repeatDialog = true
        },
        submitRevoke() {
            let data = {
                queryData: {},
                paramsData: {
                    processInstanceId: this.revokeForm.processInstanceId,
                    autoOrderId: this.revokeForm.autoOrderId
                }
            }
            autoOrderStop(data).then(res => {
                this.$message({
                    message: '撤销成功',
                    type: 'success'
                })
                this.revokeDialog = false
                setTimeout(() => {
                    this.get_data()
                }, 500)
            }).catch(err => {
                console.log(err)
            })
        },
        submitRepeat() {
            let data = {
                queryData: {},
                paramsData: {
                    ...this.repeatForm
                }
            }
            autoDramaRetransmission(data).then(res => {
                this.$message({
                    message: '重发成功',
                    type: 'success'
                })
                this.repeatDialog = false
                setTimeout(() => {
                    this.get_data()
                }, 500)
            }).catch(err => {
                console.log(err)
            })
        },
        search() {
            this.get_params.page = 1
            this.get_data()
        },
        reset() {
            this.get_params = {
                page: 1,
                size: 20,
                name: '',
                type: ''
            }
            this.sayTimes = []
            this.get_data()
        },
        get_data() {
            let data = {
                queryData: {
                    page: this.get_params.page,
                    pageSize: this.get_params.size
                },
                paramsData: {
                    autoName: this.get_params.name,
                    mouldType: this.get_params.type,
                    startTime: this.sayTimes[0] || '',
                    endTime: this.sayTimes[1] || ''
                }
            }
            this.tableData = []
            this.loading = true
            autoOrderPage(data).then(res => {
                this.tableData = res.records
                this.total_num = res.total
                this.loading = false
            }).catch(err => {
                this.loading = false
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
.title {
    font-size: 12px;
    color: #0052d9;
}
.auto {
    ::v-deep .el-descriptions-item__label {
        width: 120px !important;
    }
}
.set-header {
    color: #0052d9;
    cursor: pointer;
}
.click-btn {
    cursor: pointer;
    font-size: 12px;
    i {
        margin-right: 5px;
        color: #387dee;
    }
    span.val {
        color: #387dee;
    }
}
div ::v-deep .el-table__expand-column.expand-col {
    width: 30px;
    border: none;
}
.el-tabs__nav-scroll {
    margin-left: 20px !important;
}
</style>
