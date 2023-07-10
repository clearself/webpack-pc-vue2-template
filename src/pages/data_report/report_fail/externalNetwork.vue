<template>
    <div class="event reporting_platform" style="box-sizing: border-box;overflow-y: hidden;">
        <div ref="searchWrap" class="ub w100" style="box-sizing: border-box;">
            <SearchTop class="seaTopBox" @search="searchData" @reset="reset"  @isOpen="isOpen1">
                <el-col :md="12" :lg="8" :xl="6">
                    <el-form :model="get_params">
                        <el-form-item label="审核状态：" :label-width="formLabelWidthSearch">
                            <el-select style="width: 100%;" clearable size="small" v-model.trim="get_params.approveStatus" placeholder="请选择">
                                <el-option label="待审核" value="0"></el-option>
                                <el-option label="审核通过" value="1"></el-option>
                                <el-option label="审核不通过" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :md="12" :lg="8" :xl="6">
                    <el-form :model="get_params">
                        <el-form-item label="发生时间：" :label-width="formLabelWidthSearch">
                            <el-date-picker
                                style="width:100%;"
                                @change="changeTime"
                                size="small"
                                v-model.trim="search_time"
                                type="datetimerange"
                                :picker-options="pickerOptions2"
                                range-separator="至"
                                start-placeholder="开始时间"
                                end-placeholder="结束时间"
                                align="right"
                                value-format="yyyy-MM-dd HH:mm:ss">
                            </el-date-picker>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :md="12" :lg="8" :xl="6">
                    <el-form :model="get_params">
                        <el-form-item label="告警ID：" :label-width="formLabelWidthSearch">
                            <el-input style="width: 100%;" clearable size="small" placeholder="请输入" v-model.trim="get_params.alertId"></el-input>
                        </el-form-item>
                    </el-form>
                </el-col>

                <template v-if="tag == 122 || tag == 123 || tag == 124">
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="攻击源地址：" :label-width="formLabelWidthSearch">
                                <el-input style="width: 100%;" clearable size="small" placeholder="请输入" v-model.trim="get_params.sourceIp"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="被攻击IP：" :label-width="formLabelWidthSearch">
                                <el-input style="width: 100%;" clearable size="small" placeholder="请输入" v-model.trim="get_params.destinationIp"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </template>

                <template v-if="tag == 125">
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="本地外连IP：" :label-width="formLabelWidthSearch">
                                <el-input
                                    style="width: 100%;"
                                    clearable
                                    size="small"
                                    placeholder="请输入"
                                    v-model.trim="get_params.localIp"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="外连IP：" :label-width="formLabelWidthSearch">
                                <el-input
                                    style="width: 100%;"
                                    clearable
                                    size="small"
                                    placeholder="请输入"
                                    v-model.trim="get_params.connectIp"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </template>

                <template v-if="tag == 126">
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="被攻击IP：" :label-width="formLabelWidthSearch">
                                <el-input style="width: 100%;" clearable size="small" placeholder="请输入" v-model.trim="get_params.destinationIp"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </template>

                <template v-if="tag == 127">
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="感染设备IP：" :label-width="formLabelWidthSearch">
                                <el-input style="width: 100%;" clearable size="small" placeholder="请输入" v-model.trim="get_params.deviceIp"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </template>

                <template v-if="tag == 117">
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="发件人源地址：" label-width="105px">
                                <el-input style="width: 100%;" clearable size="small" placeholder="请输入" v-model.trim="get_params.addresserSourceIp"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="邮件标题：" :label-width="formLabelWidthSearch">
                                <el-input style="width: 100%;" clearable size="small" placeholder="请输入" v-model.trim="get_params.mailTitle"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </template>

                <template v-if="tag == 118">
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="假冒网站域名：" label-width="105px">
                                <el-input style="width: 100%;" clearable size="small" placeholder="请输入" v-model.trim="get_params.fakeDomainName"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="假冒网站URL：" label-width="105px">
                                <el-input style="width: 100%;" clearable size="small" placeholder="请输入" v-model.trim="get_params.fakeUrl"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </template>

                <template v-if="tag == 119">
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="假冒APP发布平台：" label-width="120px">
                                <el-input style="width: 100%;" clearable size="small" placeholder="请输入" v-model.trim="get_params.platform"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="被仿冒APP名称：" label-width="115px">
                                <el-input style="width: 100%;" clearable size="small" placeholder="请输入" v-model.trim="get_params.befakedApp"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </template>

                <template v-if="tag == 120">
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="篡改类型：" :label-width="formLabelWidthSearch">
                                <el-select style="width: 100%;" clearable size="small" v-model.trim="get_params.tamperType" placeholder="请选择">
                                    <el-option
                                        v-for="item in (staticDict['tamper'] || [])"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="嵌入黑链地址名称：" label-width="120px">
                                <el-input style="width: 100%;" clearable size="small" placeholder="请输入" v-model.trim="get_params.blackLinkUrl"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </template>

            </SearchTop>
        </div>
        <div class="list-container" style="overflow-y: auto;height: calc(100% - 70px)">
            <div class="ub ub-pj w100 mb-1">
                <div class="list-tips">上报结果</div>
                <div>
                    <el-switch
                        v-model="refsh5"
                        @change="changeRefsh"
                        :active-text="refsh5 ? '关闭5秒刷新' : '开启5秒刷新'">
                    </el-switch>
                    <add-btn isReuse style="margin-left: 10px;" icon="el-icon-upload" title="重新上报" @click="handleReportAll" />
                    <add-btn isReuse style="margin-left: 10px;" icon="el-icon-download" @click="handleExp" title="导 出" />
                    <delete-btn isReuse style="margin-left: 10px;" icon="el-icon-delete" title="删除" @click="handleDelAll" />
                    <columnsTool ref="columnsTool" :filter="{tag:tag}"  @updateHeaders="updateHeaders"></columnsTool>
                </div>
            </div>
            <el-table
                :key="tbKey"
                ref="multipleTable"
                :height="tableHeight"
                v-loading="loading"
                :row-key="(row)=>{ return row.id}"
                tooltip-effect="dark"
                class='bigTable fixedTable'
                :data="tableData"
                :row-class-name="tableRowClassName"
                :row-style="{ height: '32px' }"
                :header-row-style="{ height: '32px' }"
                border
                stripe
                @selection-change="handleSelectionChange">
                <el-table-column align="center" type="selection" :reserve-selection="true" :selectable="checkSelectable" width="50"></el-table-column>
                <el-table-column align="center" type="index" width="50" label="序号" :index="indexMethod"></el-table-column>
                <template v-for="(it) in tableHeaders">
                    <el-table-column v-if="it.prop == 'date' && tag== 121" :key="it.prop" :label="it.label" align="center">
                        <template slot-scope="scope">
                            <span>{{ scope.row[it.prop] ? scope.row[it.prop].slice(0,10) : '' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column v-else :key="it.prop" :label="it.label" align="center">
                        <template slot-scope="scope">
                            <span>{{ scope.row[it.prop] }}</span>
                        </template>
                    </el-table-column>
                </template>

                <el-table-column align="center" label="操作" width="180" fixed="right" class-name="deepBg">
                    <template slot-scope="scope">
                        <div>
                            <div>
                                <el-button :disabled="scope.row.status!=2" size="small" type="text" @click="handleReport(scope.row)">重新上报</el-button>
                                <el-button class="delBtn" :disabled="scope.row.status!=2" size="small" type="text" style="color: #f78989" @click="handleDel(scope.row)">删除</el-button>
                            </div>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <pagination
                :total="total_num"
                :page.sync="get_params.page"
                :limit.sync="get_params.size"
                @pagination="getList"
            />
        </div>

        <el-dialog title="审核" :visible.sync="examineDialog" width="30%" custom-class="attendance-dialog">
            <el-form :model="examineFormEdit" ref="examineFormEdit" :rules="rules" :inline="true" class="unit">
                <el-form-item label="是否通过：" style="margin-bottom: 10px!important;">
                    <el-radio-group v-model="examineFormEdit.status">
                        <el-radio label="1">审核通过</el-radio>
                        <el-radio label="2">审核不通过</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <Debounce :time='10000' :isDebounce="2">
                    <searchBtn isReuse title="确 定" @click.native="checkConfim" />
                </Debounce>
                <cancel-btn isReuse style="margin-left: 10px;" title="取 消" @click="examineDialog = false" />
            </span>
        </el-dialog>
        <el-dialog title="审核" :visible.sync="examineAllDialog" width="30%" custom-class="attendance-dialog">
            <el-form :model="examineFormEditAll" ref="examineFormEditAll" :rules="rules" :inline="true" class="unit">
                <el-form-item label="是否通过：" style="margin-bottom: 10px!important;">
                    <el-radio-group v-model="examineFormEditAll.status">
                        <el-radio label="1">审核通过</el-radio>
                        <el-radio label="2">审核不通过</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <Debounce :time='10000' :isDebounce="2">
                    <searchBtn isReuse title="确 定" @click.native="checkConfimAll" />
                </Debounce>
                <cancel-btn isReuse style="margin-left: 10px;" title="取 消" @click="examineAllDialog = false" />
            </span>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="delDialog" width="30%" custom-class="attendance-dialog">
            <span>确定删除吗？</span>
            <span slot="footer" class="dialog-footer">
                <searchBtn isReuse title="确 定" @click="delConfim" />
                <cancel-btn isReuse style="margin-left: 10px;" title="取 消" @click="delDialog = false" />
            </span>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="delAllDialog" width="30%" custom-class="attendance-dialog">
            <span>确定删除全部吗？</span>
            <span slot="footer" class="dialog-footer">
                <searchBtn isReuse title="确 定" @click="delAllConfim" />
                <cancel-btn isReuse style="margin-left: 10px;" title="取 消" @click="delAllDialog = false" />
            </span>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="reportDialog" width="30%" custom-class="attendance-dialog">
            <span>确定上报吗？</span>
            <span slot="footer" class="dialog-footer">
                <Debounce :time='10000' :isDebounce="2">
                    <searchBtn isReuse title="确 定" @click.native="reportConfim" />
                </Debounce>
                <cancel-btn isReuse style="margin-left: 10px;" title="取 消" @click="reportDialog = false" />
            </span>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="reportAllDialog" width="30%" custom-class="attendance-dialog">
            <span>确定上报全部吗？</span>
            <span slot="footer" class="dialog-footer">
                <Debounce :time='10000' :isDebounce="2">
                    <searchBtn isReuse title="确 定" @click.native="reportAllConfim" />
                </Debounce>
                <cancel-btn isReuse style="margin-left: 10px;" title="取 消" @click="reportAllDialog = false" />
            </span>
        </el-dialog>
        <el-dialog title="追溯" :visible.sync="allFieldsDialog" width="50%" custom-class="attendance-dialog">
            <div style="font-size:12px;" v-if="JSON.stringify(fields)!='{}'">
                <json-viewer :value="fields" :expand-depth="5" copyable theme="my-awesome-json-theme" sort></json-viewer>
            </div>
            <div v-else>
                <div v-if="fieldNull==''">此条数据为手动添加，无追溯内容</div>
                <div v-else>此条数据为子银行数据，无追溯内容</div>
            </div>
            <span slot="footer" class="dialog-footer">
                <cancel-btn isReuse style="margin-left: 10px;" title="取 消" @click="allFieldsDialog = false" />
            </span>
        </el-dialog>
        <externalNetworkDia v-if="tag == 22" :beAttackOpt="beAttackOpt" :attackOpt="attackOpt" ref="editDia" @refresh="getList"></externalNetworkDia>
        <internalNetworkDia v-else-if="tag == 23" :beAttackOpt="beAttackOpt" :attackOpt="attackOpt" ref="editDia" @refresh="getList"></internalNetworkDia>
        <certificateNetworkDia v-else-if="tag == 24" :beAttackOpt="beAttackOpt" :attackOpt="attackOpt" ref="editDia" @refresh="getList"></certificateNetworkDia>
        <abnormalOutreachDia v-else-if="tag == 25" :beAttackOpt="beAttackOpt" :attackOpt="attackOpt" ref="editDia" @refresh="getList"></abnormalOutreachDia>
        <ddocDia v-else-if="tag == 26" :beAttackOpt="beAttackOpt" :attackOpt="attackOpt" ref="editDia" @refresh="getList"></ddocDia>
        <maliciousCodeDia v-else-if="tag == 27" :beAttackOpt="beAttackOpt" :attackOpt="attackOpt" ref="editDia" @refresh="getList"></maliciousCodeDia>
        <maliciousMailDia v-else-if="tag == 17" :beAttackOpt="beAttackOpt" :attackOpt="attackOpt" ref="editDia" @refresh="getList"></maliciousMailDia>
        <phishingWebsiteDia v-else-if="tag == 18" :beAttackOpt="beAttackOpt" :attackOpt="attackOpt" ref="editDia" @refresh="getList"></phishingWebsiteDia>
        <fakeAppDia v-else-if="tag == 19" :beAttackOpt="beAttackOpt" :attackOpt="attackOpt" ref="editDia" @refresh="getList"></fakeAppDia>
        <websiteTamperingDia v-else-if="tag == 20" :beAttackOpt="beAttackOpt" :attackOpt="attackOpt" ref="editDia" @refresh="getList"></websiteTamperingDia>
    </div>

</template>

<script>
import * as totalMethods from '@/server/reporting_platform/report_pages'
import * as staticDict from '../config_data'
import publicParams from '@/mixins/report'
import columnsTool from '@/components/columnsTool/index.vue'
import externalNetworkDia from './../report_pages/dia/externalNetworkDia.vue'
import internalNetworkDia from './../report_pages/dia/internalNetworkDia.vue'
import certificateNetworkDia from './../report_pages/dia/certificateNetworkDia.vue'
import abnormalOutreachDia from './../report_pages/dia/abnormalOutreachDia.vue'
import ddocDia from './../report_pages/dia/ddocDia.vue'
import maliciousCodeDia from './../report_pages/dia/maliciousCodeDia.vue'
import maliciousMailDia from './../report_pages/dia/maliciousMailDia.vue'
import phishingWebsiteDia from './../report_pages/dia/phishingWebsiteDia.vue'
import fakeAppDia from './../report_pages/dia/fakeAppDia.vue'
import websiteTamperingDia from './../report_pages/dia/websiteTamperingDia.vue'
import { get_branch_city } from '@/server/reporting_platform/setting.js'

function isValidIP(ip) {
    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    return reg.test(ip)
}
let pageMethod, delMethod, audMethod, expMethod, repMethod
export default {
    mixins: [publicParams],
    components: {
        columnsTool,
        externalNetworkDia,
        internalNetworkDia,
        certificateNetworkDia,
        abnormalOutreachDia,
        ddocDia,
        maliciousCodeDia,
        maliciousMailDia,
        phishingWebsiteDia,
        fakeAppDia,
        websiteTamperingDia
    },
    data() {
        var isIp = (rule, value, callback) => {
            if (isValidIP(value)) {
                callback()
            } else {
                callback(new Error('ip地址格式不正确'))
            }
        }
        return {
            staticDict,
            tag: 22,

            tbKey: 0,
            tableHeight: document.body.clientHeight - 340,
            tableHeaders: [],

            examineFormEditAll: {
                status: '1'
            },
            examineAllDialog: false,
            delDialog: false,
            delAllDialog: false,

            examineFormEdit: {
                id: '',
                status: '1'
            },
            examineDialog: false,
            reportAllDialog: false,
            reportids: [],
            reportId: '',
            reportDialog: false,
            rules: {
                time: [{
                    required: true,
                    message: '请选择时间',
                    trigger: 'change'
                }],
                destination_ip: [{
                    required: true,
                    validator: isIp,
                    trigger: 'blur'
                }],
                source_ip: [{
                    required: true,
                    validator: isIp,
                    trigger: 'blur'
                }],
                source_port: [{
                    required: true,
                    message: '请输入攻击源端口',
                    trigger: 'blur'
                }],
                destination_port: [{
                    required: true,
                    message: '请输入攻击目的端口',
                    trigger: 'blur'
                }],
                target_system: [{
                    required: true,
                    message: '请输入目标系统',
                    trigger: 'blur'
                }],
                attack_type: [{
                    required: true,
                    message: '请选择攻击类型',
                    trigger: 'change'
                }],
                attack_type_sub: [{
                    required: true,
                    message: '请输入细分子类',
                    trigger: 'blur'
                }]
            },
            isOpen: false,
            formLabelWidthSearch: '85px',
            formLabelWidth: '110px',
            types: [],
            search_time: null,
            total_num: 0,
            loading: false,
            get_params: {
                page: 1,
                size: 20,
                status: '', // 上报状态
                approveStatus: '' // 审核状态
            },
            sendStatusList: [
                // {
                //     label: '未上报',
                //     value: 0
                // },
                {
                    label: '已上报',
                    value: 1
                },
                {
                    label: '上报失败',
                    value: 2
                },
                {
                    label: '上报中',
                    value: 3
                },
                {
                    label: '上报超限',
                    value: 4
                }
            ],
            beAttackOpt: [], // 被攻击类型级联数据
            attackOpt: [], // 攻击类型级联数据

            subCodeList: [

            ],
            rule: null,
            tableData: [],
            multipleSelection: [],
            refsh5: false,
            kaiguan: false,
            refshInterval: null
        }
    },
    watch: {
        kaiguan(val) {
            if (val) {
                this.$nextTick(() => {
                    let searchHeight = this.$refs.searchWrap.offsetHeight
                    this.tableHeight = document.body.clientHeight - searchHeight - 276
                })
            } else {
                this.tableHeight = document.body.clientHeight - 340
            }
        },
        examineDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.examineFormEdit.status = '1'
                }
            }
        },
        examineAllDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.examineFormEditAll.status = '1'
                }
            }
        }
    },
    computed: {},
    methods: {
        isOpen1(val) {
            console.log(val)
            this.kaiguan = val
        },
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex % 2) {
                return 'table-row2'
            } else {
                return 'table-row1'
            }
        },
        toAdd() {
            this.$refs.editDia.initDia()
        },
        toEdit(row) {
            this.$refs.editDia.initDia('修改', row)
        },
        // 更新表头方法
        updateHeaders(val) {
            this.$nextTick(() => {
                this.tbKey = Math.random()
                this.tableHeaders = val || []
                console.log(this.tableHeaders, '表头')
            })
        },

        reset() {
            this.get_params = {
                page: 1,
                size: 20,
                status: '',
                send_status: ''
            }
            this.search_time = null
            this.getList()
        },
        changeRefsh(val) {
            console.log(val)
            if (val) {
                this.refshInterval = setInterval(() => {
                    this.getList()
                }, 5000)
            } else {
                window.clearInterval(this.refshInterval)
            }
        },
        checkSelectable(row, index) {
            let flag = true
            if (row.send_status === 3) {
                flag = false
            }
            return flag
        },
        changeTime() {

        },
        async handleExp() {
            let ids = []
            this.multipleSelection.map(item => {
                ids.push(item.id)
            })
            let data = {
                queryData: {},
                paramsData: {
                    status: this.get_params.status,
                    approveStatus: this.get_params.approveStatus,
                    startTime: this.search_time === null ? '' : this.search_time[0],
                    endTime: this.search_time === null ? '' : this.search_time[1],
                    ids: ids,
                    titleList: this.tableHeaders,
                    result: true
                }
            }
            try {
                await expMethod(data)
                this.$message({
                    message: '导出成功',
                    type: 'success'
                })
            } catch (e) {
                this.$message({
                    message: '导出失败',
                    type: 'error'
                })
                console.log(e)
            }
        },
        handleCheck(row) {
            this.examineFormEdit.id = row.id
            this.examineDialog = true
        },
        handleCheckAll() {
            if (this.multipleSelection.length > 0) {
                console.log(this.multipleSelection)
                if (this.multipleSelection.some(item => (item.approve_status == 1 || item.approve_status == 2))) {
                    this.$message({
                        message: '请选择未审核的数据！',
                        type: 'warning'
                    })
                } else {
                    this.examineAllDialog = true
                }
            } else {
                this.$message({
                    message: '请选择要审核的数据！',
                    type: 'warning'
                })
            }
        },
        checkConfimAll() {
            let ids = []
            this.multipleSelection.map(item => {
                ids.push(item.id)
            })
            let data = {
                queryData: {},
                paramsData: {
                    ids: ids,
                    approveStatus: this.examineFormEditAll.status
                }
            }
            console.log(data)
            audMethod(data).then(res => {
                this.examineAllDialog = false
                this.$message({
                    message: '审核成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.$refs.multipleTable.clearSelection()
                    this.getList()
                }, 1500)
            }).catch(error => {
                console.log('error', error)
            })
        },
        checkConfim() {
            let data = {
                queryData: {},
                paramsData: {
                    ids: [this.examineFormEdit.id],
                    approveStatus: this.examineFormEdit.status
                }
            }
            console.log(data)
            audMethod(data).then(res => {
                this.examineDialog = false
                this.$message({
                    message: '审核成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.getList()
                }, 1500)
            }).catch(error => {
                console.log('error', error)
            })
        },
        beforeUpLoad() {
            this.up_loading = this.$loading({
                lock: true,
                text: '上传中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })
        },
        upLoadExcle(res) {
            this.up_loading.close()
            if (res.code == 1) {
                this.getList()
            } else if (res.code == 2) { // 请求成功但流程不对
                this.$message({
                    message: res.message,
                    type: 'warning'
                })
            } else if (res.code == 9999) {
                this.$setsessionStorage('errorInfo', res.message)
                this.$router.push('/error')
            } else if (res.code == 9005) {
                this.$message({
                    message: '登录已失效，请重新登录！',
                    type: 'warning'
                })
            } else {
                this.$message({
                    message: res.message,
                    type: 'warning'
                })
            }
        },
        // eslint-disable-next-line handle-callback-err
        upLoadError(error) {
            this.up_loading.close()
        },

        handleReport(row) {
            this.reportDialog = true
            this.reportId = row.id
        },
        getList() {
            this.tableData = []
            this.loading = true

            let paramsData = {
                startTime: this.search_time === null ? '' : this.search_time[0],
                endTime: this.search_time === null ? '' : this.search_time[1]
            }
            for (let key in this.get_params) {
                if (key != 'page' && key != 'size' && !(key in paramsData)) {
                    paramsData[key] = this.get_params[key]
                }
            }
            console.log(paramsData)
            let data = {
                queryData: {
                    page: this.get_params.page,
                    pageSize: this.get_params.size
                },
                paramsData
            }
            pageMethod(data).then(res => {
                console.log('列表', res)
                this.loading = false
                this.total_num = res.total
                this.tableData = res.records || []
                if (this.$refs.multipleTable) {
                    this.$refs.multipleTable.clearSelection()
                }
            }).catch(error => {
                this.loading = false
                console.log('error', error)
            })
        },

        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        searchData() {
            this.get_params.page = 1
            this.getList()
        },
        handleReportAll() {
            if (this.multipleSelection.length > 0) {
                if (this.multipleSelection.some(item => (item.status != 2))) {
                    this.$message({
                        message: '请选择上报失败的数据！',
                        type: 'warning'
                    })
                } else {
                    this.reportAllDialog = true
                }
            } else {
                this.$message({
                    message: '请选择要上报的数据！',
                    type: 'warning'
                })
            }
        },
        handleDelAll() {
            if (this.multipleSelection.length > 0) {
                if (this.multipleSelection.some(item => (item.status != 2))) {
                    this.$message({
                        message: '请选择允许删除的数据！',
                        type: 'warning'
                    })
                } else {
                    this.delAllDialog = true
                }
            } else {
                this.$message({
                    message: '请选择要删除的数据！',
                    type: 'warning'
                })
            }
        },
        handleDel(obj) {
            console.log(this.multipleSelection, '555555555555')
            this.delDialog = true
            this.deleteId = []
            this.deleteId.push(obj.id)
        },
        delAllConfim() {
            let ids = []
            this.multipleSelection.map(item => {
                ids.push(item.id)
            })
            let data = {
                queryData: {},
                paramsData: {
                    ids: ids
                }
            }
            delMethod(data).then(res => {
                this.delAllDialog = false
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.$refs.multipleTable.clearSelection()
                    this.getList()
                }, 1500)
            }).catch(error => {
                console.log('error', error)
            })
        },
        delConfim() {
            let data = {
                queryData: {},
                paramsData: {
                    ids: this.deleteId
                }
            }
            delMethod(data).then(res => {
                this.delDialog = false
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.delMultipleSelection(this.deleteId[0])
                    this.getList()
                }, 1500)
            }).catch(error => {
                this.delDialog = false
                console.log('error', error)
            })
        },
        delMultipleSelection(id) {
            if (this.multipleSelection.some(item => item.id === id)) {
                let index = this.multipleSelection.findIndex(item => item.id === id)
                this.multipleSelection.splice(index, 1)
            }
        },
        reportAllConfim() {
            let ids = []
            this.multipleSelection.map(item => {
                ids.push(item.id)
            })
            let data = {
                queryData: {},
                paramsData: {
                    ids: ids
                }
            }
            console.log(data)
            repMethod(data).then(res => {
                this.reportAllDialog = false
                this.$message({
                    message: '上报成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.$refs.multipleTable.clearSelection()
                    this.getList()
                }, 1500)
            }).catch(error => {
                console.log('error', error)
            })
        },
        reportConfim() {
            let data = {
                queryData: {},
                paramsData: {
                    ids: [this.reportId]
                }
            }
            console.log(data)
            repMethod(data).then(res => {
                this.reportDialog = false
                this.$message({
                    message: '上报成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.getList()
                }, 1500)
            }).catch(error => {
                console.log('error', error)
            })
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        async getDict() {
            let beAttackFilter = {
                queryData: {},
                paramsData: {
                    type: 5
                }
            }
            let attackFilter = {
                queryData: {},
                paramsData: {
                    type: 2
                }
            }
            try {
                let beAttackRes = await totalMethods.dictQueryReq(beAttackFilter)
                let attackRes = await totalMethods.dictQueryReq(attackFilter)
                let beAttackOpt = []
                let attackOpt = []

                let keys = Object.keys(beAttackRes)
                for (let i = 0; i < keys.length; i++) {
                    let keyItem = keys[i]
                    let obj = {
                        value: keyItem,
                        label: keyItem
                    }
                    let children = beAttackRes[keyItem] || []
                    obj.children = children.map(item => {
                        item.value = item.code
                        item.label = item.name
                        return item
                    })
                    beAttackOpt.push(obj)
                }

                let keysSec = Object.keys(attackRes)
                for (let i = 0; i < keysSec.length; i++) {
                    let keyItem = keysSec[i]
                    let obj = {
                        value: keyItem,
                        label: keyItem
                    }
                    let children = attackRes[keyItem] || []
                    obj.children = children.map(item => {
                        item.value = item.code
                        item.label = item.name
                        return item
                    })
                    attackOpt.push(obj)
                }
                this.beAttackOpt = beAttackOpt
                this.attackOpt = attackOpt
            } catch (e) {

            }
        },
        get_Area() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_branch_city(data).then(res => {
                console.log('所属区域', res)
                let option_area = []
                if (res.length > 0) {
                    res.forEach(item => {
                        let object = {}
                        object.label = item.name
                        object.value = item.code
                        option_area.push(object)
                    })
                }
                this.$store.commit('common/addDict', {
                    key: 'option_area',
                    data: option_area
                })
            }).catch(error => {
                console.log('error', error)
            })
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.getList()
            // this.getDict()
        })
    },
    created() {
        if (this.$route.name == 'externalNetwork_fail') {
            this.tag = 122
            pageMethod = totalMethods.externalNetworkResPageReq
            delMethod = totalMethods.externalNetworkDelReq
            audMethod = totalMethods.externalNetworkAudReq
            expMethod = totalMethods.externalNetworkExpReq
            repMethod = totalMethods.externalNetworkRepReq
            this.getDict()
        } else if (this.$route.name == 'internalNetwork_fail') {
            this.tag = 123
            pageMethod = totalMethods.internalNetworkResPageReq
            delMethod = totalMethods.internalNetworkDelReq
            audMethod = totalMethods.internalNetworkAudReq
            expMethod = totalMethods.internalNetworkExpReq
            repMethod = totalMethods.internalNetworkRepReq
            this.getDict()
        } else if (this.$route.name == 'certificateNetwork_fail') {
            this.tag = 124
            pageMethod = totalMethods.certificateNetworkResPageReq
            delMethod = totalMethods.certificateNetworkDelReq
            audMethod = totalMethods.certificateNetworkAudReq
            expMethod = totalMethods.certificateNetworkExpReq
            repMethod = totalMethods.certificateNetworkRepReq
        } else if (this.$route.name == 'abnormalOutreach_fail') {
            this.tag = 125
            pageMethod = totalMethods.abnormalOutreachResPageReq
            delMethod = totalMethods.abnormalOutreachDelReq
            audMethod = totalMethods.abnormalOutreachAudReq
            expMethod = totalMethods.abnormalOutreachExpReq
            repMethod = totalMethods.abnormalOutreachRepReq
        } else if (this.$route.name == 'ddoc_fail') {
            this.tag = 126
            pageMethod = totalMethods.ddocResPageReq
            delMethod = totalMethods.ddocDelReq
            audMethod = totalMethods.ddocAudReq
            expMethod = totalMethods.ddocExpReq
            repMethod = totalMethods.ddocRepReq
            this.getDict()
        } else if (this.$route.name == 'maliciousCode_fail') {
            this.tag = 127
            pageMethod = totalMethods.maliciousCodeResPageReq
            delMethod = totalMethods.maliciousCodeDelReq
            audMethod = totalMethods.maliciousCodeAudReq
            expMethod = totalMethods.maliciousCodeExpReq
            repMethod = totalMethods.maliciousCodeRepReq
            this.get_Area()
        } else if (this.$route.name == 'maliciousMail_fail') {
            this.tag = 117
            pageMethod = totalMethods.maliciousMailResPageReq
            delMethod = totalMethods.maliciousMailDelReq
            audMethod = totalMethods.maliciousMailAudReq
            expMethod = totalMethods.maliciousMailExpReq
            repMethod = totalMethods.maliciousMailRepReq
        } else if (this.$route.name == 'phishingWebsite_fail') {
            this.tag = 118
            pageMethod = totalMethods.fakePhiWebResPageReq
            delMethod = totalMethods.fakePhiWebDelReq
            audMethod = totalMethods.fakePhiWebAudReq
            expMethod = totalMethods.fakePhiWebExpReq
            repMethod = totalMethods.fakePhiWebRepReq
        } else if (this.$route.name == 'fakeApp_fail') {
            this.tag = 119
            pageMethod = totalMethods.fakeAppResPageReq
            delMethod = totalMethods.fakeAppDelReq
            audMethod = totalMethods.fakeAppAudReq
            expMethod = totalMethods.fakeAppExpReq
            repMethod = totalMethods.fakeAppRepReq
        } else if (this.$route.name == 'websiteTampering_fail') {
            this.tag = 120
            pageMethod = totalMethods.webTamResPageReq
            delMethod = totalMethods.webTamDelReq
            audMethod = totalMethods.webTamAudReq
            expMethod = totalMethods.webTamExpReq
            repMethod = totalMethods.webTamRepReq
        } else if (this.$route.name == 'reportStatistics_fail') {
            this.tag = 121
            pageMethod = totalMethods.staVerResPageReq
            delMethod = totalMethods.staVerDelReq
            audMethod = totalMethods.staVerAudReq
            expMethod = totalMethods.staVerExpReq
            repMethod = totalMethods.staVerRepReq
        }
    },
    beforeRouterEnter(to, form, next) {
        console.log('xxxxxxxxxxxxxxxxxxxxxx')
        next()
    },
    beforeRouteLeave(to, form, next) {
        window.clearInterval(this.refshInterval)
        next()
    }
}
</script>

<style lang="scss" scoped>
.upload-demo {
    display: inline-block;
    margin: 0 10px;
}

.upload-demo ::v-deep .el-button--primary {
    background-color: rgba(0, 0, 0, 0);
    border-color: rgba(0, 0, 0, 0);
    background-image: url(../../../assets/img/XZWJ.png);
    background-position: 0 0;
    background-repeat: no-repeat;
    background-size: 100% 100%;
}

.event ::v-deep .el-input-group__append,
.event ::v-deep .el-input-group__prepend {
    background-color: rgba(0, 0, 0, 0);
    color: #1cd7fa;
    border: 1px solid #1cd7fa;
    border-left: 0;
}

.upload-demo ::v-deep a,
.upload-demo ::v-deep i {
    color: #1cd7fa;
}

.upload-demo ::v-deep .el-upload-list__item:hover {
    background-color: rgba(0, 0, 0, 0);
}

.delBtn {
    color: #f78989 !important;
}
.delBtn:disabled {
    color: #c0c4cc !important;
}

</style>
