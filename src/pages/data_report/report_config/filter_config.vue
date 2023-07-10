<template>
    <div class="event event-wrapper report-platform" style="box-sizing:border-box">
        <div class="ub w100" style="box-sizing: border-box;">
            <SearchTop @search="searchData" @reset="reset">
                <el-col :md="12" :lg="8" :xl="6">
                    <el-form :model="get_params">
                        <el-form-item label="规则名称：" label-width="85px">
                            <el-input size="small" placeholder="请输入" clearable v-model.trim="get_params.ruleName"></el-input>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :md="12" :lg="8" :xl="6">
                    <el-form :model="get_params">
                        <el-form-item label="事件类型：" label-width="85px">
                            <el-select clearable size="small" v-model.trim="get_params.eventType" placeholder="请选择">
                                <el-option v-for="(item,index) in eventList" :key="index+'ab'" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </el-col>
            </SearchTop>

        </div>
        <div class="list-container">
            <div class="ub ub-pj w100 mb-1">
                <div class="list-tips">过滤器</div>
                <div>
                    <!-- <span class="filter-switch">过滤器开关（不启用过滤器，合规数据自动上报；启用过滤器，合规数据依据过滤规则自动或手动报）：</span> -->
                    <el-switch @change="changeFilterSwitch" v-model="filters.value" active-text="开" inactive-text="关" active-color="#13ce66" inactive-color="#ccc" style="margin-right: 20px"></el-switch>
                    <el-button size="small" icon="el-icon-plus" type="primary" @click="toAdd">添加规则</el-button>
                </div>
            </div>
            <el-table
                ref="multipleTable"
                v-loading="listLoading"
                class='bigTable'
                :data="tableData"
                border
                stripe
                tooltip-effect="dark"
                :row-class-name="tableRowClassName"
                @selection-change="handleSelectionChange"
                :height="tableHeight"
                :row-style="{ height: '32px' }"
                :header-row-style="{ height: '32px' }">
                <!--<el-table-column align="center" type="selection" :reserve-selection="true" width="50"></el-table-column>-->
                <el-table-column align="center" type="index" width="50" label="序号" :index="indexMethod">
                </el-table-column>
                <el-table-column prop="name" label="规则名称" width="200" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="eventType" label="事件类型" width="200" show-overflow-tooltip>
                    <template slot-scope="{row}">
                        <span>{{get_event_name(row.type)}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="规则范围" show-overflow-tooltip>
                    <template slot-scope="{row}">
                        <div>
                            <div v-if="row.ruleItemList.length>0">
                                <ConditionTips :select-data="first_options" type="filterConfig" v-model="row.ruleItemList" />
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="120" fixed="right" class-name="deepBg">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button  type="text" size="small" @click="handleDel(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-if="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
        </div>
        <el-dialog title="添加规则"  width="918px" :visible.sync="rulesDialog"  custom-class="common-dialog rule-dialog">
            <div style="width:100%;margin: 0 auto;">
                <el-form :model="addRuleForm" ref="addRuleForm" label-position="top" :rules="rules">
                    <el-row :gutter="40">
                        <el-col :span="12">
                            <el-form-item label="规则名称：" prop="ruleName" label-width="100px">
                                <el-input style="width: 100%;" size="small" placeholder="请输入" v-model.trim="addRuleForm.ruleName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="事件类型：" prop="eventType" label-width="100px">
                                <el-select style="width: 100%;" size="small" v-model.trim="addRuleForm.eventType" placeholder="请选择" @change="changeEvent">
                                    <el-option v-for="item in eventList" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-form-item label="规则范围：" label-width="100px">
                        <div class="w100 ub ub-ac ub-pc">
                            <ConditionFilter v-if="addRuleForm.eventType!=''" :select-data="first_options" v-model="addRuleForm.ruleList" />
                            <div v-if="addRuleForm.ruleList.length===0||addRuleForm.ruleList[0].children.length === 0" class="rule-area">
                                <div class="empty-array ub ub-ac ub-pc">
                                    <div>
                                        <el-button size="mini" @click="toAddRule">去添加规则</el-button>
                                    </div>
                                    <!-- 请先选择事件类型！ -->
                                </div>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label="人工审核：" prop="isVerify" label-width="100px">
                        <el-checkbox v-model="addRuleForm.isVerify">开 启</el-checkbox>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="ub ub-pe dialog-footer">
                    <el-button size="small" @click="rulesDialog = false">取 消</el-button>
                    <el-button size="small" type="primary" @click="validAdd('addRuleForm')">确 认</el-button>
                </div>
            </div>
        </el-dialog>

        <el-dialog title="编辑规则" width="918px" :visible.sync="rulesDialogEdit" custom-class="common-dialog rule-dialog">
            <el-form :model="editRuleForm" ref="editRuleForm" label-position="top" :rules="rules">
                <el-row :gutter="40">
                    <el-col :span="12">
                        <el-form-item label="规则名称：" prop="ruleName" label-width="100px">
                            <el-input style="width: 100%;" size="small" placeholder="请输入" v-model.trim="editRuleForm.ruleName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="事件类型：" prop="eventType" label-width="100px">
                            <el-select style="width: 100%;" size="small" v-model.trim="editRuleForm.eventType" placeholder="请选择" @change="changeEvent">
                                <el-option v-for="(item,index) in eventList" :key="index+'ab'" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="规则范围：" label-width="100px">
                    <div class="w100 ub ub-ac ub-pc">
                        <ConditionFilter v-if="editRuleForm.eventType!=''" :select-data="first_options" v-model="editRuleForm.ruleList" />
                        <div v-if="editRuleForm.ruleList.length===0||editRuleForm.ruleList[0].children.length === 0" class="rule-area">
                            <div class="empty-array ub ub-ac ub-pc">
                                <div>
                                    <el-button size="mini" @click="toAddRule">去添加规则</el-button>
                                </div>
                                <!-- 请先选择事件类型！ -->
                            </div>
                        </div>
                    </div>

                </el-form-item>
                <el-form-item label="人工审核：" prop="isVerify" label-width="100px">
                    <el-checkbox v-model="editRuleForm.isVerify">开 启</el-checkbox>
                </el-form-item>
            </el-form>
            <div slot="footer" class="ub ub-pe dialog-footer">
                <el-button size="small" @click="rulesDialogEdit = false">取 消</el-button>
                <el-button size="small" type="primary" @click="validSaveEdit('editRuleForm')">确 认</el-button>
            </div>
        </el-dialog>

        <el-dialog title="提示" :visible.sync="delDialog" width="30%" custom-class="attendance-dialog">
            <span>确定删除吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="delDialog = false">取 消</el-button>
                <el-button size="small" type="primary" @click="delConfim">确 认</el-button>
            </span>
        </el-dialog>
    </div>

</template>

<script>
import {
    get_rules_list,
    save_rules,
    delete_rules,
    get_filter_status,
    modify_filter_status,
    get_branch_city
} from '@/server/reporting_platform/setting.js'
import {
    public_page,
    getLeftMenu,
    getReportField
} from '@/server/reporting_platform/report_config.js'
import {
    selectData,
    allCondition,
    options_time,
    options_attackTraffic,
    options_other,
    options_blocked,
    options_deviceType,
    external_type_data,
    connect_condition_data,
    area_data,
    hash_name_data,
    virus_type_data,
    action_data,
    trade_condition,
    timeData,
    event_data
} from '../config_data.js'
import ConditionFilter from './components/ConditionFilter'
import ConditionTips from './components/ConditionTips'
import initData from '@/mixins/initData.js'
function isValidIP(ip) {
    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    return reg.test(ip)
}
const isIps = (value) => {
    if (value === '') {
        return true
    } else if (value.indexOf('\n') > -1) {
        console.log(value)
        value = value.replace(/(\r)|(\r\n)/g, '\n')
        console.log(value)
        let ips = value.split('\n')
        let _ips = []
        ips.forEach(item => {
            if (item != '') {
                let ips = item.split('-')
                _ips = _ips.concat(ips)
            }
        })
        console.log('_ips', _ips)
        if (_ips.length == 0) {
            return true
        } else if (_ips.every(item => isValidIP(item))) {
            return true
        } else {
            return false
        }
    } else if (isValidIP(value)) {
        return true
    } else {
        let ips = value.split('-')
        if (ips.every(item => isValidIP(item))) {
            return true
        } else {
            return false
        }
    }
}
export default {
    name: 'FilterConfig',
    mixins: [initData],
    components: {
        ConditionFilter,
        ConditionTips
    },
    data() {
        return {
            treeData: [
                {
                    intersymbol: 'y',
                    children: [
                        {
                            field: '',
                            symbol: '',
                            fieldCN: '源IP',
                            symbolCN: '等于',
                            value: '192.168.1.123'
                        }
                    ]
                }
            ],
            report_data_type: [], // 报送数据类型数据源
            selectData: selectData,
            tableHeight: document.body.clientHeight - 350,
            eventList: [],
            editRuleForm: {
                id: '',
                ruleName: '',
                eventType: '',
                ruleList: [],
                isVerify: false
            },
            rulesDialogEdit: false,
            deleteId: '',
            delAllDialog: false,
            delDialog: false,
            rulesDialog: false,
            addRuleForm: {
                ruleName: '',
                eventType: '',
                ruleList: [],
                isVerify: false
            },

            rules: {
                ruleName: [{
                    required: true,
                    message: '请输入规则名称',
                    trigger: 'blur'
                }],
                eventType: [{
                    required: true,
                    message: '请选择事件类型',
                    trigger: 'change'
                }]
            },
            isOpen: false,
            formLabelWidth: '110px',
            types: [],
            search_time: null,
            total_num: 0,
            loading: false,
            get_params: {
                ruleName: '',
                eventType: ''
            },
            tableData: [],
            multipleSelection: [],
            first_options: [], // 第一列
            allCondition: allCondition,
            /* 第二列*/
            options_time: options_time,
            options_attackTraffic: options_attackTraffic,
            options_other: options_other,

            /* 第三列*/
            external_area: [],
            third_options_attackType: [], // 攻击类型
            options_blocked: options_blocked,
            // 本地外连设备类型数据源
            options_deviceType: options_deviceType,
            // 异常外连类型数据源
            external_type_data: external_type_data,
            // 连接情况数据源
            connect_condition_data: connect_condition_data,
            // 外联区域数据源
            area_data: area_data,
            hash_name_data: hash_name_data, //  哈希算法
            virus_type_data: virus_type_data, //  恶意代码类型
            action_data: action_data, //   处置动作
            trade_condition: trade_condition, // 涉及交易情况
            option_info_systems: [], // 信息系统
            timeData: timeData, // 时间类型字段
            filters: {
                id: '',
                value: '0',
                item: '',
                other: '',
                bak: ''
            }
        }
    },
    watch: {
        rulesDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.addRuleForm.ruleList = []
                    this.$refs.addRuleForm.resetFields()
                // for(let attr in this.addRuleForm){
                //     this.addRuleForm[attr] = '';
                // }
                }
            }
        },
        rulesDialogEdit: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.editRuleForm.resetFields()
                    console.log(this.editRuleForm)
                }
            }
        }
    },
    mounted() {
        this.$eventBus.$on('del-first', () => {
            if (this.rulesDialog) {
                let index = this.addRuleForm.ruleList[0].children.findIndex(item => item.intersymbol && item.children.length === 0)
                if (index > -1) {
                    this.addRuleForm.ruleList[0].children.splice(index, 1)
                }
            } else {
                let index = this.editRuleForm.ruleList[0].children.findIndex(item => item.intersymbol && item.children.length === 0)
                if (index > -1) {
                    this.editRuleForm.ruleList[0].children.splice(index, 1)
                }
            }
        })
        this.$nextTick(() => {
            this.initEvents()
            this.getList()
            // this.get_external_area()
            this.get_attackType()
            this.get_Branchs()
            this.get_Area()
            this.get_filterStatus()
            this.get_report_data_type()
        })
    },
    beforeDestroy() {
        this.$eventBus.$off('del-first')
    },
    methods: {
        filterValue(obj) {
            if (selectData.includes(obj.name)) {
                let data_sources = this.get_dropdown_select_data(obj.name, {}, true)
                let list = obj.val.split('!=!')
                return list.map(item => {
                    if (data_sources.some(_item => _item.value === item)) {
                        let name = data_sources.filter(_item => _item.value === item)[0].label
                        return name
                    } else {
                        return ''
                    }
                })
            } else if (timeData.includes(obj.name) && obj.term == 11) {
                return obj.val.split('!=!')
            } else {
                return obj.val
            }
        },
        get_event_name(type) {
            if (event_data.some(item => item.type === type)) {
                let cur = event_data.filter(item => item.type === type)
                return cur[0].label
            } else {
                return ''
            }
        },
        get_dropdown_select_data(index, relItem, isListReview) {
            let name = isListReview ? index : relItem[index].name
            if (name == 'external_area') { // 外部网络区域
                return this.area_data
            } else if (name == 'is_blocked') { // 是否封禁/阻断
                return this.options_blocked
            } else if (name == 'attack_type') { // 攻击类型
                return this.third_options_attackType
            } else if (name == 'destination_system_type') { // 被攻击系统类型 (信息系统)
                return this.option_info_systems
            } else if (name == 'data_type') { // 数据报送类型
                return this.report_data_type
            } else if (name == 'external_type') { // 异常外连类型数据源
                return this.external_type_data
            } else if (name == 'local_device_type') { // 本地外连设备类型
                return this.options_deviceType
            } else if (name == 'local_system_type') { // 本地外连系统类型(信息系统)
                return this.option_info_systems
            } else if (name == 'connect_condition') { // 连接情况
                return this.connect_condition_data
            } else if (name == 'area') { // 外联区域
                return this.area_data
            } else if (name == 'institution_branch_area') { // 风险发生地区
                return this.option_area
            } else if (name == 'device_type') { // 感染设备类型
                return this.options_deviceType
            } else if (name == 'system_type') { // 感染系统类型(信息系统)
                return this.option_info_systems
            } else if (name == 'hash_name') { // 哈希算法
                return this.hash_name_data
            } else if (name == 'virus_type') { // 恶意代码类型
                return this.virus_type_data
            } else if (name == 'action') { // 处置动作
                return this.action_data
            } else if (name == 'befaked_url_type') { // 被仿冒网站业务类型(信息系统)
                return this.option_info_systems
            } else if (name == 'trade_condition') { // 涉及交易情况
                return this.trade_condition_data
            }
        },
        toAdd() {
            this.rulesDialog = true
        },
        handleEdit(obj) {
            console.log('编辑', obj)
            this.rulesDialogEdit = true
            let relationalArr = []
            let ruleItemList = this.$deepCopy(obj.ruleItemList)
            if (ruleItemList.length > 0) {
                let ruleCnDTO = ruleItemList[0]
                ruleCnDTO.children = ruleCnDTO.children.map(item => {
                    if (item.intersymbol) { // 组
                        item.children = item.children.map(t => {
                            let obj = {}
                            obj.field = t.name
                            obj.symbol = t.term + ''
                            let val = ''
                            if (selectData.includes(t.name)) {
                                if (t.val === '') {
                                    val = []
                                } else if (t.val.indexOf('!=!') > -1) {
                                    val = t.val.split('!=!')
                                } else {
                                    val = [t.val]
                                }
                            } else if (timeData.includes(t.name) && t.term == 11) {
                                if (t.val === '') {
                                    val = []
                                } else if (t.val.indexOf('!=!') > -1) {
                                    val = t.val.split('!=!')
                                } else {
                                    val = [t.val]
                                }
                            } else {
                                val = t.val
                            }
                            obj.value = val
                            return obj
                        })
                    } else {
                        item.field = item.name
                        item.symbol = item.term + ''
                        let val = ''
                        if (selectData.includes(item.name)) {
                            if (item.val === '') {
                                val = []
                            } else if (item.val.indexOf('!=!') > -1) {
                                val = item.val.split('!=!')
                            } else {
                                val = [item.val]
                            }
                        } else if (timeData.includes(item.name) && item.term == 11) {
                            if (item.val === '') {
                                val = []
                            } else if (item.val.indexOf('!=!') > -1) {
                                val = item.val.split('!=!')
                            } else {
                                val = [item.val]
                            }
                        } else {
                            val = item.val
                        }
                        item.value = val
                    }
                    return item
                })
                relationalArr = this.$deepCopy(ruleItemList)
            } else {
                relationalArr = [
                    {
                        intersymbol: 'y',
                        children: [
                            {
                                field: '',
                                symbol: '',
                                value: ''
                            }
                        ]
                    }
                ]
            }
            this.$nextTick(() => {
                this.editRuleForm = {
                    id: obj.id,
                    eventType: obj.type,
                    ruleName: obj.name,
                    isVerify: !!obj.isVerify,
                    ruleList: relationalArr
                }
                console.log(this.editRuleForm, 'this.editRuleForm')
                // this.changeEvent(obj.type)
                let value = event_data.filter(item => item.type === obj.type)[0].value
                this.getReportField(value)
                console.log('回显', this.editRuleForm)
            })
        },
        toAddRule() {
            if (this.rulesDialog) {
                if (this.addRuleForm.eventType == '') {
                    this.$message.warning('请选择事件类型')
                    return
                }
                this.addRuleForm.ruleList = [
                    {
                        intersymbol: 'y',
                        children: [
                            {
                                field: '',
                                symbol: '',
                                value: ''
                            }
                        ]
                    }
                ]
            } else {
                if (this.editRuleForm.eventType == '') {
                    this.$message.warning('请选择事件类型')
                    return
                }
                this.editRuleForm.ruleList = [
                    {
                        intersymbol: 'y',
                        children: [
                            {
                                field: '',
                                symbol: '',
                                value: ''
                            }
                        ]
                    }
                ]
            }
        },
        changeEvent(val) {
            console.log('事件id', val)

            if (this.rulesDialog) {
                this.addRuleForm.ruleList = [
                    {
                        intersymbol: 'y',
                        children: [
                            {
                                field: '',
                                symbol: '',
                                value: ''
                            }
                        ]
                    }
                ]
            } else {
                this.editRuleForm.ruleList = [
                    {
                        intersymbol: 'y',
                        children: [
                            {
                                field: '',
                                symbol: '',
                                value: ''
                            }
                        ]
                    }
                ]
            }
            let value = event_data.filter(item => item.type === val)[0].value

            this.getReportField(value)
        },
        getReportField(val) {
            getReportField(val).then(res => {
                console.log('事件字段', res)
                let list = res ?? []
                this.first_options = list.map(item => {
                    return {
                        name: item.name,
                        code: item.code
                    }
                })
                console.log(this.first_options, 'this.first_options')
            })
        },
        initEvents() {
            this.eventList = []
            getLeftMenu().then(res => {
                let list = res || []
                let eventList = list.map(item => {
                    let type = event_data.filter(_item => _item.value === item.code)[0].type
                    return {
                        label: item.name,
                        value: type
                    }
                })
                this.eventList = eventList.filter(item => item.value !== 11)
            })
        },
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex % 2) {
                return 'table-row2'
            } else {
                return 'table-row1'
            }
        },
        reset() {
            this.get_params.ruleName = ''
            this.get_params.eventType = ''
            this.listQuery.page = 1
            this.getList()
        },
        get_filterStatus() {
            get_filter_status({}).then(res => {
                console.log(res, '12121212121')
                // this.filters = res
                this.filters.value = !!res
            })
        },
        symbol() {
            // eslint-disable-next-line symbol-description
            return Symbol()
        },

        /**
     * 清空第二列或第三列表单
     * @param index
     * @param term {string} 传参清空第3列，不传参清空第2列和第3列
     */
        change_thirdOption(relItem, index, term) {
            console.log(1111)
            if (this.selectData.includes(relItem[index].name)) {
                relItem[index].val = []
            } else {
                relItem[index].val = ''
            }
            !term && (relItem[index].term = '')
        },

        getSecond(index, relItem) {
            switch (relItem[index].name) {
                case 'time':
                    return this.options_time
                    // eslint-disable-next-line no-unreachable
                    break
                case 'attack_flow':
                    return this.options_attackTraffic
                    // eslint-disable-next-line no-unreachable
                    break
                default:
                    return this.options_other
                    // eslint-disable-next-line no-unreachable
                    break
            }
        },

        // 获取外部网络区域
        get_external_area() {
            this.external_area = []
            let data = {
                queryData: {
                    page: 1,
                    pageSize: 1000
                },
                paramsData: {
                    type: 4
                }
            }
            public_page(data).then(res => {
                this.external_area = res.records.map(item => {
                    return {
                        label: item.name,
                        value: item.name
                    }
                })
            }).catch((error) => {
                console.log('error' + error)
            })
        },
        // 获取报送数据类型数据源
        get_report_data_type() {
            this.report_data_type = []
            let data = {
                queryData: {
                    page: 1,
                    pageSize: 1000
                },
                paramsData: {
                    type: 1
                }
            }
            public_page(data).then(res => {
                this.report_data_type = res.records.map(e => {
                    let obj = {
                        value: e.code,
                        label: e.name
                    }
                    return obj
                })
            }).catch((error) => {
                console.log('error' + error)
            })
        },
        // 获取攻击类型数据源
        get_attackType() {
            this.third_options_attackType = []
            let data = {
                queryData: {
                    page: 1,
                    pageSize: 1000
                },
                paramsData: {
                    type: 2
                }
            }
            public_page(data).then(res => {
                this.third_options_attackType = res.records.map(e => {
                    let obj = {
                        value: e.code,
                        label: e.name
                    }
                    return obj
                })
            }).catch((error) => {
                this.loading = false
                console.log('error' + error)
            })
        },
        // 获取信息系统数据源
        get_Branchs() {
            this.option_info_systems = [] // 信息系统
            let data = {
                queryData: {
                    page: 1,
                    pageSize: 1000
                },
                paramsData: {
                    type: 5
                }
            }
            public_page(data).then(res => {
                this.option_info_systems = res.records.map(e => {
                    let obj = {
                        value: e.code,
                        label: e.name
                    }
                    return obj
                })
            }).catch((error) => {
                console.log('error' + error)
            })
        },

        get_Area() {
            this.option_area = [] // 分支所属city
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_branch_city(data).then(res => {
                console.log('所属区域', res)
                if (res.length > 0) {
                    res.forEach(item => {
                        let object = {}
                        object.label = item.name
                        object.value = item.code
                        this.option_area.push(object)
                    })
                }
            }).catch(error => {
                console.log('error', error)
            })
        },

        getList() {
            this.tableData = []
            this.listLoading = true
            let data = {
                queryData: {
                    page: this.listQuery.page,
                    pageSize: this.listQuery.limit
                },
                paramsData: {
                    name: this.get_params.ruleName,
                    type: this.get_params.eventType
                }
            }
            get_rules_list(data).then(res => {
                console.log('规则配置', res)
                this.listLoading = false
                this.total = res.total
                if (res.records.length > 0) {
                    this.tableData = res.records.map((e) => {
                        e.ruleItemList = e.ruleCnDTO ? [e.ruleCnDTO] : []
                        return e
                    })
                }
            }).catch(error => {
                this.listLoading = false
                console.log('error', error)
            })
        },

        addRuleItem(form) {
            let list = form.ruleList
            if (form.eventType === '') {
                this.$message.warning('请选择事件类型')
                return
            }
            list.push([{
                name: '',
                term: '',
                val: ''
            }])
        },
        delRuleItem(list, index) {
            list.splice(index, 1)
        },

        addRulesRange(relItem, form) {
            if (form.eventType === '') {
                this.$message.warning('请选择事件类型')
                return
            }
            relItem.push({
                name: '',
                term: '',
                val: ''
            })
        },
        delSingleData(relItem, index) {
            relItem.splice(index, 1)
        },

        indexMethod(index) {
            return (this.listQuery.page - 1) * this.listQuery.limit + index + 1
        },
        searchData() {
            this.listQuery.page = 1
            this.getList()
        },

        handleDelAll() {
            if (this.multipleSelection.length > 0) {
                this.delAllDialog = true
            } else {
                this.$message({
                    message: '请选择要删除的数据！',
                    type: 'warning'
                })
            }
        },
        handleDel(obj) {
            this.delDialog = true
            this.deleteId = obj.id
        },
        delConfim() {
            let data = {
                queryData: {},
                paramsData: {
                    id: this.deleteId
                }
            }
            delete_rules(data).then(res => {
                this.delDialog = false
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.getList()
                }, 1500)
            }).catch(error => {
                this.delDialog = false
                console.log('error', error)
            })
        },

        validateRel(ruleList) {
            let list = []
            let arr = this.$deepCopy(ruleList[0].children)
            arr.map(item => {
                if (item.intersymbol) { // 组
                    list = [...list, ...item.children]
                } else {
                    list = [...list, ...[item]]
                }
            })
            let validateRes = true
            if (list.some(item => item.field != '' && (item.symbol == '' || (item.symbol != 9 && item.symbol != 10 && item.value == '')))) {
                this.$message({
                    message: '字段/条件/值有一个不为空时，其余两个不能为空',
                    type: 'warning'
                })
                validateRes = false
            }
            if (list.some(item => ((item.symbol != '' && item.symbol != 9 && item.symbol != 10 && (item.field == '' || item.value == ''))) || ((item.symbol == 9 || item.symbol == 10) && item.field == ''))) {
                this.$message({
                    message: '条件为空/不为空时，字段不能为空',
                    type: 'warning'
                })
                validateRes = false
            }
            if (list.some(item => item.value != '' && (item.symbol == '' || item.field == ''))) {
                this.$message({
                    message: '字段/条件/值有一个不为空时，其余两个不能为空',
                    type: 'warning'
                })
                validateRes = false
            }
            if (list.some(item => item.symbol == 9 && item.field == '')) {
                this.$message({
                    message: '条件为空时，所选字段不能为空',
                    type: 'warning'
                })
                validateRes = false
            }
            if (list.some(item => (item.symbol == 12 || item.symbol == 13) && !isIps(item.value))) {
                this.$message({
                    message: 'IP范围格式不正确',
                    type: 'warning'
                })
                validateRes = false
            }
            return validateRes
        },
        validAdd(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid && this.validateRel(this.addRuleForm.ruleList)) {
                    this.addData()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        addData() {
            let form = JSON.parse(JSON.stringify(this.addRuleForm))
            form.isVerify ? (form.isVerify = 1) : (form.isVerify = 0)
            let intersymbol = this.addRuleForm.ruleList[0].intersymbol
            let list = this.addRuleForm.ruleList[0].children
            let _list = []
            list.map(item => {
                let arr = []
                if (item.intersymbol) { // 组
                    if (item.children.length === 1) {
                        let obj = {}
                        obj.name = item.children[0].field
                        obj.term = item.children[0].symbol
                        if (selectData.includes(obj.name)) {
                            obj.val = item.children[0].value.join('!=!')
                        } else if (timeData.includes(obj.name) && obj.term == 11) {
                            obj.val = item.children[0].value.join('!=!')
                        } else {
                            obj.val = item.children[0].value
                        }
                        arr.push(obj)
                    } else if (item.children.length > 1) {
                        item.children.forEach(e => {
                            let obj = {}
                            obj.name = e.field
                            obj.term = e.symbol
                            if (selectData.includes(obj.name)) {
                                obj.val = e.value.join('!=!')
                            } else if (timeData.includes(obj.name) && obj.term == 11) {
                                obj.val = e.value.join('!=!')
                            } else {
                                obj.val = e.value
                            }
                            arr.push(obj)
                        })
                        arr.push({
                            intersymbol: item.intersymbol
                        })
                    }
                } else { // 条件
                    let obj = {}
                    obj.name = item.field
                    obj.term = item.symbol
                    if (selectData.includes(obj.name)) {
                        obj.val = item.value.join('!=!')
                    } else if (timeData.includes(obj.name) && obj.term == 11) {
                        obj.val = item.value.join('!=!')
                    } else {
                        obj.val = item.value
                    }
                    arr.push(obj)
                }
                _list.push(arr)
            })
            console.log(_list, '_list')
            _list = _list.map(item => JSON.stringify(item))
            let str = intersymbol === 'y' ? _list.join('&&') : _list.join('||')
            console.log(str, 'str')
            // let relationalArr = []
            // this.addRuleForm.ruleList.forEach(itemOne => {
            //     let relItem = this.$deepCopy(itemOne)
            //     if (relItem.length > 0) {
            //         relItem = relItem.map(item => {
            //             if (this.selectData.includes(item.name)) {
            //                 item.val = item.val.join('!=!')
            //             } else if (this.timeData.includes(item.name) && item.term == 11) {
            //                 item.val = item.val.join('!=!')
            //             }
            //             return {
            //                 ...item
            //             }
            //         })
            //     }
            //     relationalArr.push(relItem)
            // })
            // let mapping = ''
            // if (relationalArr.length) {
            //     relationalArr = relationalArr.map(item => {
            //         return JSON.stringify(item)
            //     })
            //     mapping = relationalArr.join('&&')
            // }

            let data = {
                queryData: {},
                paramsData: {
                    name: form.ruleName,
                    type: form.eventType,
                    mapping: str,
                    isVerify: form.isVerify
                }
            }
            console.log('过滤器参数', data)

            save_rules(data).then(res => {
                this.rulesDialog = false
                this.addRuleForm.ruleList = []
                this.$message({
                    message: '添加成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.getList()
                }, 1500)
            }).catch(error => {
                console.log('error', error)
            })
        },

        validSaveEdit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid && this.validateRel(this.editRuleForm.ruleList)) {
                    this.editData()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        editData() {
            let form = JSON.parse(JSON.stringify(this.editRuleForm))
            form.isVerify ? (form.isVerify = 1) : (form.isVerify = 0)
            let intersymbol = this.editRuleForm.ruleList[0].intersymbol
            let list = this.editRuleForm.ruleList[0].children
            let _list = []
            list.map(item => {
                let arr = []
                if (item.intersymbol) { // 组
                    if (item.children.length === 1) {
                        let obj = {}
                        obj.name = item.children[0].field
                        obj.term = item.children[0].symbol
                        if (selectData.includes(obj.name)) {
                            obj.val = item.children[0].value.join('!=!')
                        } else if (timeData.includes(obj.name) && obj.term == 11) {
                            obj.val = item.children[0].value.join('!=!')
                        } else {
                            obj.val = item.children[0].value
                        }
                        arr.push(obj)
                    } else if (item.children.length > 1) {
                        item.children.forEach(e => {
                            let obj = {}
                            obj.name = e.field
                            obj.term = e.symbol
                            if (selectData.includes(obj.name)) {
                                obj.val = e.value.join('!=!')
                            } else if (timeData.includes(obj.name) && obj.term == 11) {
                                obj.val = e.value.join('!=!')
                            } else {
                                obj.val = e.value
                            }
                            arr.push(obj)
                        })
                        arr.push({
                            intersymbol: item.intersymbol
                        })
                    }
                } else { // 条件
                    let obj = {}
                    obj.name = item.field
                    obj.term = item.symbol
                    if (selectData.includes(obj.name)) {
                        obj.val = item.value.join('!=!')
                    } else if (timeData.includes(obj.name) && obj.term == 11) {
                        obj.val = item.value.join('!=!')
                    } else {
                        obj.val = item.value
                    }
                    arr.push(obj)
                }
                _list.push(arr)
            })
            console.log(_list, '_list')
            _list = _list.map(item => JSON.stringify(item))
            let str = intersymbol === 'y' ? _list.join('&&') : _list.join('||')
            console.log(str, 'str')
            // let relationalArr = []
            // this.editRuleForm.ruleList.forEach(itemOne => {
            //     let relItem = this.$deepCopy(itemOne)
            //     if (relItem.length > 0) {
            //         relItem = relItem.map(item => {
            //             if (this.selectData.includes(item.name)) {
            //                 item.val = item.val.join('!=!')
            //             } else if (this.timeData.includes(item.name) && item.term == 11) {
            //                 item.val = item.val.join('!=!')
            //             }
            //             return {
            //                 ...item
            //             }
            //         })
            //     }
            //     relationalArr.push(relItem)
            // })
            // let mapping = ''
            // if (relationalArr.length) {
            //     relationalArr = relationalArr.map(item => {
            //         return JSON.stringify(item)
            //     })
            //     mapping = relationalArr.join('&&')
            // }

            let data = {
                queryData: {},
                paramsData: {
                    id: form.id,
                    name: form.ruleName,
                    type: form.eventType,
                    mapping: str,
                    isVerify: form.isVerify
                }
            }
            console.log(data)
            save_rules(data).then(res => {
                this.rulesDialogEdit = false
                this.editRuleForm.ruleList = []
                this.$message({
                    message: '编辑成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.getList()
                }, 1500)
            }).catch(error => {
                this.rulesDialogEdit = false
                console.log('error', error)
            })
        },
        handleSelectionChange(val) {
            console.log(val)
            this.multipleSelection = val
        },
        changeFilterSwitch(val) {
            console.log(val)
            // let paramsData = Object.assign({}, this.filters)
            // paramsData.value = val ? '1' : '0'
            modify_filter_status().then(res => {
                // eslint-disable-next-line no-undef
                this.get_filterStatus()
            })
        }
    }
}
</script>

<style lang="scss" scoped>
$fontColor:rgb(255, 73, 73);
.filter-switch {
    color: #333;
    font-size: 12px;
    margin-right: 10px;
}
.event  ::v-deep  .el-form-item__label {
    padding: 0;
}
.event  ::v-deep  .rule-box.el-dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: 0 !important;
    box-sizing: border-box;
    padding-right: 8px;
    transform: translate(-50%, -50%);
    max-height: 50vh;
    display: flex;
    flex-direction: column;
}

.event  ::v-deep .rule-dialog .el-dialog__body {
    max-height:80vh;
    background-color: #fff;
    overflow-y: auto;
}

.connectLine {
    width: 16px;
    margin: 0 4px;
    height: 1px;
    content: '';
    box-sizing: border-box;
    display: inline-block;
    background-color: #fff;
    vertical-align: middle;
}

.rule-area {
    margin-top: 5px;
    width: 100%;
    /* position: relative;
    left: 100px;
    top: -20px; */
    position: relative;
    // background-color: rgba(0, 0, 0 , .2);
    border-radius: 4px 4px 2px 4px;
    padding: 20px;
    box-sizing: border-box;
    .removeBtn {
        position: absolute;
        top: 7px;
        right: 7px;
        color: red;
        cursor: pointer;
    }
}

.add-Btn {
    position: absolute;
    top: -30px;
    right: 0px;
    font-size: 14px;
    cursor: pointer;
    @include themeify {
        color: themed('theme-color');
    }
}

.rule-box {
    height: 68px;
    line-height: 68px;
    border-bottom:1px solid #ddd;
    &:last-of-type{
        border-bottom:1px solid rgba(0,0,0,0);
    }

    span.number {
        display: inline-block;
        box-sizing: border-box;
        width: 20px;
        text-align: center;
    }

    .spanGroup {
        width: 80px;
    }
    span.addBtn {
        margin: 0 15px 0 0;
        display: inline-block;
        box-sizing: border-box;
        color:#409EFF;
        cursor: pointer;
        text-align: center;
        transition: all .2s;
        &:hover{
            opacity: .7;
            font-size:18px;
        }
    }
    span.del-btn {
        display: inline-block;
        box-sizing: border-box;
        color:$fontColor;
        cursor: pointer;
        text-align: center;
        transition: all .2s;
        &:hover{
            opacity: .7;
            font-size:18px;
        }
    }
}

.empty-array {
    color: #999;
    height: 68px;
}
.date-time ::v-deep .el-input__prefix{
    height:auto;
}
</style>
