<template>
    <div style="width: 100%;height: 100%;">
        <div
            style="position: relative;top: 0;left: 0;
                overflow-y: auto;
                width: 100%;">
            <div class="drawer-pad">
                <div style="margin-bottom: 10px;">
                    <CustomDate
                        :append-to-body="appendToBody"
                        @getCustomTime="getCustomTime"
                        :inputWidth="300"
                        :empty="emptyData"
                        @getDateData="getDateData"
                        ref="customDate"
                    ></CustomDate>
                </div>
                <div class="ub ub-pj">
                    <div style="width: 90%;"><CustomSearch :auto="true" ref="customSearch" @getData="getData" :type="1" /></div>
                    <Debounce :time="1500" :isDebounce="2"><el-button class="search-btn" type="primary" size="small" @click.native="searchAssets">搜索</el-button></Debounce>
                </div>
                <div style="position: relative;">
                    <FilterCondition :condition-data="conditionData" />
                    <div v-if="conditionShow" class="condition-area">
                        <ConditionRules :select-data="listAll" :treeData="treeData" />
                        <div class="split-line"></div>
                        <div class="ub ub-pe footer">
                            <el-button style="margin-right: 10px;" size="small" @click="conditionShow = false">取消</el-button>
                            <Debounce :time="1500" :isDebounce="2">
                                <el-button size="small" type="primary" @click.native="addFilterCondition">{{this.conditionData.some(it => it.id === this.recordId) ? '编 辑' : '添 加'}}</el-button>
                            </Debounce>
                        </div>
                    </div>
                </div>
                <div class="ub ub-pe" style="margin-bottom: 10px;">
                    <div class="set-header" @click="transferDialog = true">
                        <span style="margin-right: 5px;font-size: 12px;" class="iconfont icon-zidingyibiaotou"></span>
                        <span style="font-size: 12px;">自定表头</span>
                    </div>
                </div>
                <div>
                    <el-table
                        :height="tableHeight"
                        style="width: 100%;"
                        v-loading="loading"
                        ref="myTable"
                        @expand-change="handleExpand"
                        class="bigTable fixedTable"
                        :row-class-name="tableRowClassName"
                        :row-key="
                            row => {
                                return row.id
                            }
                        "
                        :data="tableData"
                        border
                        stripe
                        tooltip-effect="dark"
                        :row-style="{ height: '32px' }"
                        :header-row-style="{ height: '32px' }"
                        :expand-row-keys="expandRowKeys"
                        @sort-change="changeTableSort"
                        @selection-change="handleSelectionChange"
                    >
                        <el-table-column align="center" :reserve-selection="true" :selectable="checkSelectable" type="selection" width="50"></el-table-column>
                        <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号"></el-table-column>
                        <el-table-column type="expand" class-name="expand-col" width="40">
                            <template slot-scope="{ row }">
                                <el-tabs>
                                    <el-tab-pane label="键/值" style="overflow: hidden;padding: 0 20px;" class="demo-table-left">
                                        <div class="table-expand" style="overflow-y: auto;height: 500px;">
                                            <el-form label-position="left" label-width="150px">
                                                <el-form-item :label="item.name" v-for="(item, index) in expandData" :key="index + row.id" style="margin-bottom: 0;">
                                                    <div v-if="item.name != '源IP'" style="width: 800px;text-align: justify;word-break: break-all;">
                                                        <span>{{ item.value }}</span>
                                                    </div>
                                                    <div v-if="item.name == '源IP'" style="max-width: 800px;text-align: justify;word-break: break-all;">
                                                        <el-popover popper-class="add-search" placement="bottom" title="" trigger="click">
                                                            <div>
                                                                <p
                                                                    @click="jumpAsset(item.value)"
                                                                    class="ub ub-ac click-btn"
                                                                >
                                                                    <i class="el-icon-s-promotion" style="font-size: 12px;"></i>
                                                                    <span>查询资产</span>
                                                                </p>
                                                                <p
                                                                    style="margin-top: 10px;"
                                                                    @click="jumpThreat(item.value)"
                                                                    class="ub ub-ac click-btn"
                                                                >
                                                                    <i class="iconfont icon-chaxunqingbao" style="font-size: 12px;"></i>
                                                                    <span>查询情报</span>
                                                                </p>
                                                            </div>
                                                            <span
                                                                class="highlighted-inner"
                                                                style="cursor: pointer; text-decoration: underline; color: #387dee;"
                                                                slot="reference"
                                                            >
                                                                <!-- <i
                                                                    v-if="item.value && item.srcIpVenusIsSpite != '内网'"
                                                                    class="iconfont"
                                                                    :style="{
                                                                        color: [
                                                                            { type: '安全', color: '#00ff48' },
                                                                            { type: '恶意', color: '#ff0000' },
                                                                            { type: '未知', color: '#7c7c7c' }
                                                                        ].filter(co => co.type == item.srcIpVenusIsSpite)[0].color
                                                                    }"
                                                                    :title="'VenusEye：'+item.srcIpVenusIsSpite"
                                                                    :class="{
                                                                        'icon-liebiaonei-anquan': item.srcIpVenusIsSpite == '安全',
                                                                        'icon-liebiaonei-buanquan': item.srcIpVenusIsSpite == '恶意',
                                                                        'icon-liebiaonei-weizhi': item.srcIpVenusIsSpite == '未知'
                                                                    }"
                                                                ></i> -->
                                                                <i
                                                                    v-if="item.value && item.srcIpIsSpite != '内网'"
                                                                    class="iconfont"
                                                                    :style="{
                                                                        color: [
                                                                            { type: '安全', color: '#00ff48' },
                                                                            { type: '恶意', color: '#ff0000' },
                                                                            { type: '未知', color: '#7c7c7c' }
                                                                        ].filter(co => co.type == item.srcIpIsSpite)[0].color
                                                                    }"
                                                                    :title="'微步：'+item.srcIpIsSpite"
                                                                    :class="{
                                                                        'icon-liebiaonei-anquan': item.srcIpIsSpite == '安全',
                                                                        'icon-liebiaonei-buanquan': item.srcIpIsSpite == '恶意',
                                                                        'icon-liebiaonei-weizhi': item.srcIpIsSpite == '未知'
                                                                    }"
                                                                ></i>
                                                                {{ item.value }}
                                                            </span>
                                                        </el-popover>
                                                    </div>
                                                </el-form-item>
                                            </el-form>
                                        </div>
                                    </el-tab-pane>
                                    <el-tab-pane label="JSON" style="overflow: hidden;padding: 0 20px;">
                                        <div class="table-expand" style="overflow-y: auto;width: 800px;height: 500px;font-size: 12px;text-align: justify;word-break: break-all;">
                                            <json-viewer :value="expandJsonData" :expand-depth="5" copyable theme="my-awesome-json-theme" sort></json-viewer>
                                        </div>
                                    </el-tab-pane>

                                    <el-tab-pane v-if="row.nftData === 2" label="PCAP包" style="overflow: hidden;padding: 0 20px;max-width: 1000px;">
                                        <div class="table-expand pcap-detail" style="overflow-y: auto;max-height: 500px;font-size: 12px;text-align: justify;word-break: break-all;">
                                            <div style="margin-bottom: 10px;">
                                                <addBtn
                                                    class="pcap-btn"
                                                    style="margin-right: 10px;"
                                                    icon="iconfont icon-tianjia"
                                                    :disabled="row.nftData === 0"
                                                    title="创建PCAP包任务"
                                                    @click="createPackTask(row)"
                                                ></addBtn>
                                                <a :href="'/api/data_center/manage/syslog/downloadPacap?logId=' + row.id" download>
                                                    <!--<opt-btn :disabled="scope.row.nftData===2" icon="iconfont icon-xiazai1" title="下载PCAP包"></opt-btn>-->
                                                    <addBtn class="pcap-btn" icon="iconfont icon-xiazai1" title="下载PCAP包" />
                                                </a>
                                            </div>
                                            <el-tabs v-model="tabsValue" type="card" style="height: 100%;">
                                                <el-tab-pane :key="index" v-for="(item, index) in pacpData" :label="item.name" :name="item.name" style="height: 100%;">
                                                    <div v-if="item.content.length > 0" class="w100 left-content">
                                                        <div v-for="(_item, _index) in item.content" :key="_index" class="ub w100 ub-ver">
                                                            <div v-if="_item.type === 'req'" class="ub ub-f1 request" style="width: 100%;">
                                                                <pre>{{ _item.payload }}</pre>
                                                            </div>
                                                            <div v-if="_item.type === 'res'" class="ub ub-f1 response" style="width: 100%;">
                                                                <pre>{{ _item.payload }}</pre>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </el-tab-pane>
                                            </el-tabs>
                                        </div>
                                    </el-tab-pane>
                                </el-tabs>
                            </template>
                        </el-table-column>
                        <el-table-column
                            v-for="(item, index) in tableList"
                            :key="index"
                            :label="item.name"
                            min-width="140"
                            :sortable="item.type === 3 || item.type === 2"
                            show-overflow-tooltip
                            :prop="item.fieldName"
                        >
                            <template slot-scope="scope">
                                <div>
                                    <el-popover popper-class="add-search" placement="bottom" title="" trigger="click">
                                        <div>
                                            <p
                                                v-if="item.fieldName !== 'message' && item.fieldName !== 'dt'"
                                                class="ub ub-ac click-btn"
                                                @click="
                                                    equalVal({
                                                        key: item.fieldName,
                                                        name: item.name,
                                                        attrType: item.type,
                                                        value: scope.row[item.fieldName]
                                                    })
                                                "
                                            >
                                                <i class="el-icon-plus"></i>
                                                <span>{{ item.name }}</span>
                                                <span>=</span>
                                                <span class="val">{{ scope.row[item.fieldName] }}</span>
                                            </p>
                                            <p
                                                v-if="item.fieldName !== 'message' && item.fieldName !== 'dt'"
                                                class="ub ub-ac click-btn"
                                                style="margin: 10px 0;"
                                                @click="
                                                    unequalVal({
                                                        key: item.fieldName,
                                                        name: item.name,
                                                        attrType: item.type,
                                                        value: scope.row[item.fieldName]
                                                    })
                                                "
                                            >
                                                <i class="el-icon-plus"></i>
                                                <span>{{ item.name }}</span>
                                                <span>!=</span>
                                                <span class="val">{{ scope.row[item.fieldName] }}</span>
                                            </p>
                                            <p
                                                @click="item.visible = false"
                                                class="ub ub-ac click-btn"
                                                v-clipboard:copy="scope.row[item.fieldName]"
                                                v-clipboard:success="firstCopySuccess"
                                                v-clipboard:error="firstCopyError"
                                            >
                                                <i class="el-icon-document-copy"></i>
                                                <span>复制</span>
                                            </p>
                                            <p
                                                style="margin-top: 10px;"
                                                v-if="['ip'].some(keyWord => item.fieldName.toLowerCase().includes(keyWord))"
                                                @click="jumpAsset(scope.row[item.fieldName])"
                                                class="ub ub-ac click-btn"
                                            >
                                                <i class="iconfont icon-chaxunzichan" style="font-size: 12px;"></i>
                                                <span>查询资产</span>
                                            </p>
                                            <p
                                                style="margin-top: 10px;"
                                                v-if="['ip', 'url', '域名'].some(keyWord => item.fieldName.toLowerCase().includes(keyWord))"
                                                @click="jumpThreat(scope.row[item.fieldName])"
                                                class="ub ub-ac click-btn"
                                            >
                                                <i class="iconfont icon-chaxunqingbao" style="font-size: 12px;"></i>
                                                <span>查询情报</span>
                                            </p>
                                        </div>
                                        <p slot="reference" v-if="item.fieldName === 'aDate'" style="color: rgb(0 0 0 / 90%);">{{ scope.row[item.fieldName] }}</p>
                                        <p
                                            v-else
                                            slot="reference"
                                            :style="
                                                ['ip', 'url', '域名'].some(keyWord => item.fieldName.toLowerCase().includes(keyWord))
                                                    ? 'cursor: pointer; text-decoration: underline; color: #387dee;'
                                                    : 'cursor: default; text-decoration: unset; '
                                            "
                                        >
                                            {{ scope.row[item.fieldName] }}
                                        </p>
                                    </el-popover>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center" width="150" fixed="right" class-name="deepBg">
                            <template slot-scope="scope">
                                <el-button :disabled="scope.row.nftData !== 0" type="text" size="small" @click="createPackTask(scope.row)">下载PCAP包任务</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <pagination :page.sync="get_params.page" :limit.sync="get_params.size"  style="padding-top: 10px;" @pagination="get_data" :total="total_num" />
            </div>
        </div>
        <el-dialog title="提示" :visible.sync="createAllTaskDialog" width="700px" custom-class="common-dialog" :append-to-body="true">
            <span>确定创建所选PCAP包任务吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="createAllTaskDialog=false" size="small">取消</el-button>
                <el-button type="primary" @click="createAllTaskConfim()" size="small">确认</el-button>
            </span>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="createTaskDialog" width="700px" custom-class="common-dialog" :append-to-body="true">
            <span>确定创建PCAP包任务吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="createTaskDialog=false" size="small">取消</el-button>
                <el-button type="primary" @click="createTaskConfim()" size="small">确认</el-button>
            </span>
        </el-dialog>
        <Alarm :alarm-dialog="alarmDialog" :select-mode="selectMode" @addAlarmSucess="addAlarmSucess" ref="drawerRef"></Alarm>
        <CustomTransfer :list-all="listAll" :list="list" :transfer-dialog="transferDialog" />
    </div>
</template>

<script>
import Alarm from '@/pages/data_manage/new_search/components/alarm/index.vue'
import ConditionRules from '@/pages/data_manage/new_search/components/ConditionRules'
import FilterCondition from '@/pages/data_manage/new_search/components/FilterCondition'
import CustomDate from '@/pages/data_manage/new_search/components/custom_date/index.vue'
import CustomSearch from '@/pages/data_manage/new_search/components/custom_search/index.vue'
import CustomTransfer from '@/pages/data_manage/new_search/components/custom_transfer/index.vue'
import { getFilterSql, getDataTree, getExpandLog, getList, createTask, download, saveLogIds, viewPcap, getFieldByAll, getUserField } from '@/server/data_manage/new_search.js'
import { updateAlarmFields } from '@/server/data_manage/stash.js'
import { get_threat_search, getStartConfig, get_threat_searchVenus } from '@/server/alarm/api.js'
export default {
    name: 'SaveList',
    components: {
        CustomDate,
        CustomSearch,
        FilterCondition,
        ConditionRules,
        CustomTransfer,
        Alarm
    },
    props: {
        alarmId: {
            default() {
                return ''
            }
        },
        logIds: {
            default() {
                return []
            }
        },
        tabindex: {
            default() {
                return ''
            }
        }
    },
    computed: {
        tableList() {
            console.log('this.list', this.list)
            return this.list.length > 0 ? this.list : this.listAll
        }
    },
    watch: {
        logIds: {
            handler(val) {
                this.logIdsData = this.logIds.filter(it => it !== '')
            },
            immediate: true
        },
        conditionShow(newVal) {
            if (!newVal) {
                this.treeData = [
                    {
                        connect: 'and',
                        children: [
                            {
                                field: '',
                                operator: '',
                                value: '',
                                dataType: 1, // 1.常量 2.变量
                                attrType: 1
                            }
                        ]
                    }
                ]
            }
        },
        tabindex(val) {
            if (val === 'four') {
                console.log('four也走了吗')
                // this.chartTimeRange = ['', '']
                this.isAlarmData = 1
                this.emptyData = true
                this.tableData = []
                this.conditionData = []
                this.sqlTermData = ''
                if (this.$refs.customSearch) {
                    this.$refs.customSearch.inputData = ''
                }
                this.initCanSelectedFileds()
            }
        }
    },
    mounted() {
        this.getStartConfigData()
    },
    data() {
        return {
            startData: [],
            tableHeight: document.body.clientHeight - 300,
            emptyData: false,
            tabsValue: '',
            pacpData: [],
            appendToBody: false,
            createTaskId: '',
            createTaskDialog: false,
            createAllTaskDialog: false,
            alarmDialog: false,
            selectMode: 0,
            conditionShow: false,
            conditionData: [],
            recordId: '',
            transferDialog: false,
            treeData: [
                {
                    connect: 'and',
                    children: [
                        {
                            field: '',
                            operator: '',
                            value: '',
                            dataType: 1, // 1.常量 2.变量
                            attrType: 1
                        }
                    ]
                }
            ],
            list: [],
            listAll: [],
            selectAll: [],
            sqlTermData: '',
            customTime: ['', ''],
            get_params: {
                page: 1,
                size: 50,
                dataType: null,
                topId: '',
                startTime: '',
                endTime: ''
            },
            multipleSelection: [],
            loading: false,
            tableData: [],
            expandRowKeys: [],
            expandData: [],
            expandJsonData: [],
            isAlarmData: 1,
            logIdsData: [],
            dateData: '',
            dateMode: '',
            useDate: {},
            useIndex: '',
            sysLogListData: [
                {
                    srcIp: '',
                    desIp: '',
                    srcPort: '',
                    desPort: '',
                    aDate: '',
                    logId: ''
                }
            ],
            total_num: 0
        }
    },
    methods: {
        getStartConfigData() {
            getStartConfig({ queryData: {}, paramsData: {}}).then(res => {
                this.startData = res
            })
        },
        tableRowClassName({ row, rowIndex }) {
            console.log(rowIndex)
            if (rowIndex % 2) {
                return 'table-row2'
            } else {
                return 'table-row1'
            }
        },
        getDateData(date, mode, useDate, useIndex) {
            this.dateData = date
            this.dateMode = mode
            this.useDate = useDate
            this.useIndex = useIndex
        },
        setDate() {
            if (this.dateMode === 'noUse') {
                if (this.dateData === '最近10分钟') {
                    this.$refs.customDate.handleRecently({ value: 0, name: '最近10分钟' }, 0)
                } else if (this.dateData === '最近30分钟') {
                    this.$refs.customDate.handleRecently({ value: 1, name: '最近30分钟' }, 1)
                } else if (this.dateData === '最近1小时') {
                    this.$refs.customDate.handleRecently({ value: 2, name: '最近1小时' }, 2)
                } else if (this.dateData === '最近1天') {
                    this.$refs.customDate.handleRecently({ value: 3, name: '最近1天' }, 3)
                } else if (this.dateData === '最近2天') {
                    this.$refs.customDate.handleRecently({ value: 4, name: '最近2天' }, 4)
                } else if (this.dateData === '最近7天') {
                    this.$refs.customDate.handleRecently({ value: 5, name: '最近7天' }, 5)
                } else if (this.dateData === '今天') {
                    this.$refs.customDate.handleRelative({ value: 0, name: '今天' }, 0)
                } else if (this.dateData === '昨天') {
                    this.$refs.customDate.handleRelative({ value: 1, name: '昨天' }, 1)
                } else if (this.dateData === '本周') {
                    this.$refs.customDate.handleRelative({ value: 2, name: '本周' }, 2)
                } else if (this.dateData === '上周') {
                    this.$refs.customDate.handleRelative({ value: 3, name: '上周' }, 3)
                } else if (this.dateData === '本月') {
                    this.$refs.customDate.handleRelative({ value: 4, name: '本月' }, 4)
                } else if (this.dateData === '上月') {
                    this.$refs.customDate.handleRelative({ value: 5, name: '上月' }, 5)
                }
            } else if (this.dateMode === 'use') {
                this.$refs.customDate.handleOther(this.useDate, this.useIndex)
            } else if (this.dateMode === 'useTwo') {
                this.$refs.customDate.handleUse()
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
        initSelectedFileds() {
            let data = { queryData: { searchType: 2 }, paramsData: { searchType: 2 }}
            getUserField(data)
                .then(res => {
                    this.list = []
                    return res
                })
                .then(res => {
                    console.log('用户已选字段', res)
                    if (res.length > 0) {
                        res.forEach((item, index) => {
                            let obj = {}
                            obj.show = false
                            // obj.fixed = false
                            // obj.top5 = []
                            obj.name = item.name
                            obj.fieldId = item.fieldId
                            obj.fieldName = item.field
                            obj.type = item.type

                            // 事件时间放前面，原始信息放最后
                            if (this.list.find(it => it.fieldName === 'alarmTime') && obj.fieldName !== 'message') {
                                this.list.splice(1, 0, obj)
                            } else if (obj.fieldName === 'message') {
                                this.list.push(obj)
                            } else {
                                this.list.splice(this.list.length - 1, 0, obj)
                            }
                        })
                    }
                })
                .then(() => {
                    this.get_data()
                })
                .catch(error => {
                    console.log('error' + error)
                })
        },
        initCanSelectedFileds() {
            let data = { queryData: {}, paramsData: {}}
            /* 先获取已选的字段，在获取所有字段，避免左侧抖动*/
            this.initSelectedFileds()
            getFieldByAll(data)
                .then(res => {
                    this.listAll = []
                    console.log('所有综合可选字段', res)
                    if (res.length > 0) {
                        res.forEach(item => {
                            let obj = {}
                            obj.fieldId = item.fieldId
                            obj.show = false
                            // obj.fixed = false
                            // obj.top5 = []
                            obj.name = item.name
                            obj.fieldName = item.field
                            obj.type = item.type
                            if (item.enums) {
                                obj.enums = item.enums
                            }
                            this.listAll.push(obj)
                        })
                    }
                })
                .then(() => {
                    this.list = this.$lodash.cloneDeep(this.list)
                })
                .catch(error => {
                    console.log('error' + error)
                })
        },
        equalVal(item) {
            console.log(item)
            let data = {
                origin: [
                    {
                        connect: 'and',
                        children: [{ field: item.key, operator: '=', value: item.value, dataType: 1, attrType: item.attrType }]
                    }
                ],
                msg: `((${item.name} = ${item.value}))`,
                id: Date.now() + Math.random()
            }
            this.conditionData.push(data)
            console.log(item.value)
            item.visible = false
        },
        unequalVal(item) {
            let data = {
                origin: [
                    {
                        connect: 'and',
                        children: [{ field: item.key, operator: '!=', value: item.value, dataType: 1, attrType: item.attrType }]
                    }
                ],
                msg: `((${item.name} != ${item.value}))`,
                id: Date.now() + Math.random()
            }
            this.conditionData.push(data)
            console.log(item.value)
            item.visible = false
        },
        firstCopySuccess(e) {
            console.log('copy arguments e:', e)
            this.$message.success('复制成功')
        },
        firstCopyError(e) {
            console.log('copy arguments e:', e)
            this.$message.error('复制失败')
        },
        createPackTask(row) {
            // this.createTaskId = row.id
            this.sysLogListData[0].srcIp = row.srcIp
            this.sysLogListData[0].desIp = row.desIp
            this.sysLogListData[0].srcPort = row.srcPort
            this.sysLogListData[0].desPort = row.desPort
            this.sysLogListData[0].aDate = row.aDate
            this.sysLogListData[0].logId = row.logId
            this.createTaskDialog = true
        },
        changeOption(row) {
            this.$setlocalStorage('newSearchRowData', row)
            this.selectMode = 1
            this.alarmDialog = true
        },
        hanleSave(row) {
            let idsData = [row.id]
            this.saveLogIdsData(idsData)
        },
        saveLogIdsData(idsData) {
            let userId = this.$getsessionStorage('userInfo').id
            let data = {
                queryData: {},
                paramsData: {
                    ids: idsData,
                    userId: userId
                }
            }
            saveLogIds(data)
                .then(res => {
                    this.$message({
                        message: '暂存成功',
                        type: 'success'
                    })
                })
                .catch(error => {
                    console.log(error + 'error')
                })
        },
        createTaskConfim() {
            let data = {
                queryData: {},
                paramsData: {
                    sysLogList: this.sysLogListData
                }
            }
            createTask(data).then(res => {
                this.createTaskDialog = false
                this.$message.success('操作成功！')
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            })
        },
        createAllTaskConfim() {
            let ids = []
            ids = this.multipleSelection.map(item => {
                return item.id
            })
            let data = {
                queryData: {},
                paramsData: {
                    logIds: ids
                }
            }
            createTask(data).then(res => {
                this.createAllTaskDialog = false
                this.$message.success('操作成功！')
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            })
        },
        addAlarmSucess() {
            this.get_data()
        },
        editSelectFields(list) {
            console.log(list, '已选字段')
            let data = {
                queryData: {},
                paramsData: {
                    fieldIds: list
                }
            }
            updateAlarmFields(data)
                .then(res => {
                    this.transferDialog = false
                    this.$message.success('操作成功')
                    this.initCanSelectedFileds()
                })
                .catch(err => {
                    console.log(err)
                })
        },
        checkSelectable(row, index) {
            let flag = false
            if (row.nftData === 0) {
                flag = true
            }
            return flag
        },
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        handleSizeChange(val) {
            this.get_params.size = val
            this.get_data()
        },
        handleCurrentChange(val) {
            this.get_params.page = val
            this.get_data()
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        get_data() {
            this.loading = true
            console.log(this.customTime)
            let data = {
                queryData: {
                    page: this.get_params.page,
                    pageSize: this.get_params.size
                },
                paramsData: {
                    inputTerm:
                        this.emptyData === true
                            ? []
                            : [
                                { field: 'startTime', value: this.customTime[0] },
                                {
                                    field: 'endTime',
                                    value: this.customTime[1]
                                }
                            ],
                    sqlTerm: this.sqlTermData,
                    filterTerm: this.conditionData.map(it => it.origin[0]),
                    fields: this.list.map(it => it.fieldName),
                    // logIds: this.logIds.filter(it => it !== ''),
                    logIds: this.logIdsData,
                    isAlarm: this.isAlarmData,
                    alarmId: this.alarmId
                }
            }
            getList(data, {})
                .then(res => {
                    this.tableData = []
                    return res
                })
                .then(res => {
                    console.log('数据查询列表', res)
                    this.loading = false
                    let arr = res.records
                    this.total_num = res.total
                    if (arr.length > 0) {
                        this.tableData = this.$lodash.cloneDeep(arr)
                        this.$refs.myTable.doLayout()
                    } else if (arr.length === 0) {
                        if (this.get_params.page > 1) {
                            this.get_params.page = this.get_params.page - 1
                            this.get_data()
                            this.$refs.myTable.doLayout()
                        }
                    }
                    // setTimeout(() => {
                    //     this.$refs.tableContent.filterKeyword()
                    // }, 500)
                })
                .catch(error => {
                    this.loading = false
                    this.$refs.myTable.doLayout()
                    console.log('error' + error)
                })
        },
        handleExpand(row, expandedRows) {
            // this.filterKeyword()
            let that = this
            if (expandedRows.length) {
                that.expandRowKeys = []
                if (row) {
                    that.expandRowKeys.push(row.id)

                    console.log(row, '展开')
                    this.expandData = []
                    this.expandJsonData = {}
                    let data = {
                        queryData: {
                        },
                        paramsData: {
                            id: row.id,
                            logType: row.logType,
                            alarmTime: row.alarmTime
                        }
                    }
                    getExpandLog(data)
                        .then(res => {
                            let arr = []
                            let obj = {}
                            let messageObj = null
                            let alarmTimeObj = null
                            console.log(res, '展开信息')
                            for (const resKey in res) {
                                if (res[resKey] !== '') {
                                    if (resKey === 'message') {
                                        messageObj = {
                                            name: '原始字段',
                                            value: res.message
                                        }
                                        continue
                                    }
                                    if (resKey === 'alarmTime') {
                                        alarmTimeObj = {
                                            name: '发生时间',
                                            value: res.alarmTime
                                        }
                                        continue
                                    }
                                    let item = this.listAll.find(it => it.fieldName === resKey)
                                    if (item) {
                                        const obj1 = {
                                            fieldName: item.fieldName,
                                            name: item.name,
                                            value: res[resKey],
                                            type: item.type
                                        }
                                        if (obj1.fieldName == 'srcIp' || obj1.fieldName == 'desIp') {
                                            const field = `${obj1.fieldName}IsSpite`
                                            obj1[field] = res[field]
                                            const field1 = `${obj1.fieldName}VenusIsSpite`
                                            obj1[field1] = res[field1]
                                            console.log(res[field])
                                        }
                                        arr.push(obj1)
                                        obj[item.fieldName] = res[resKey]
                                    }
                                }
                            }
                            if (messageObj) {
                                arr.push(messageObj)
                            }
                            if (alarmTimeObj) {
                                arr.unshift(alarmTimeObj)
                            }
                            this.expandData = arr
                            this.expandJsonData = obj
                        })
                        .then(() => {
                            if (row.nftData === 2) {
                                that.lookPcac(row)
                            }
                        })
                        .catch(err => {
                            console.log(err)
                        })
                }
            } else {
                that.expandRowKeys = []
            }
        },
        lookPcac(row) {
            this.tabsValue = ''
            this.pacpData = []
            let data = {
                queryData: {
                    logId: row.id
                },
                paramsData: {}
            }
            viewPcap(data)
                .then(res => {
                    console.log('pcac包', res)
                    // let arr = []
                    // for(let i=0;i<20;i++){
                    //     arr.push(res[0])
                    // }
                    if (res.length > 0) {
                        this.tabsValue = res[0].name.split('.json')[0]
                        this.pacpData = res.map(item => {
                            item.name = item.name.split('.json')[0]
                            return item
                        })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        // 排序列改变返回当前需要排序的列
        changeTableSort(e) {
            console.log('e', e)
            // 获取当前列的字段
            const prop = e.prop
            // 如果按降序
            if (e.order === 'descending') {
                // 根据需要对字段进行写排序
                this.tableData = this.tableData.sort((a, b) => {
                    return parseFloat(a[prop]) - parseFloat(b[prop])
                })
            } else {
                // 发果是降序
                this.tableData = this.tableData.sort((a, b) => {
                    return parseFloat(b[prop]) - parseFloat(a[prop])
                })
            }
        },
        addFilterCondition() {
            let that = this
            console.log(this.treeData)
            let data = {
                filterTerm: this.treeData
            }
            getFilterSql(data)
                .then(res => {
                    console.log(res, '过滤条件转sql')
                    let data = {
                        origin: this.treeData,
                        msg: res ?? '',
                        id: Date.now() + res
                    }
                    if (this.conditionData.some(it => it.id === this.recordId)) {
                        let index = this.conditionData.findIndex(it => it.id === that.recordId)
                        that.conditionData.splice(index, 1, that.$lodash.cloneDeep(data))
                    } else {
                        that.conditionData.push(that.$lodash.cloneDeep(data))
                    }
                    that.conditionShow = false
                })
                .catch(err => {
                    console.log(err)
                })
        },
        addEqualCondition(data) {
            console.log(data, '新增相等条件')
            this.conditionData.push(data)
        },
        addUnequalCondition(data) {
            console.log(data, '新增不等条件')
            this.conditionData.push(data)
        },
        searchAssets() {
            this.emptyData = false
            console.log(this.dateData)
            // if (this.dateData === '') {
            //     debugger
            //     this.$refs.customDate.initData()
            // }
            this.isAlarmData = 0
            this.logIdsData = []
            this.setDate()
            setTimeout(() => {
                this.get_data()
            }, 1000)
        },
        getData(val) {
            this.sqlTermData = val
            console.log('智能搜索框时间', val)
        },
        getCustomTime(val) {
            this.emptyData = false
            this.customTime = val
            console.log('时间', val)
        },
        handleCommand(statusData) {
            let data = {
                queryData: {},
                paramsData: {
                    searchType: 2,
                    fileType: statusData,
                    inputTerm: [
                        { field: 'startTime', value: this.customTime[0] },
                        {
                            field: 'endTime',
                            value: this.customTime[1]
                        }
                    ],
                    sqlTerm: this.sqlTermData
                }
            }
            download(data)
                .then(res => {
                    this.$message({
                        message: '下载成功',
                        type: 'success'
                    })
                })
                .catch(error => {
                    console.log('error', error)
                })
        },
        handleAlarm() {
            if (this.multipleSelection.length === 0) {
                this.$message({
                    message: '请勾选行内容',
                    type: 'warning'
                })
            } else {
                this.selectMode = 2
                this.$setlocalStorage('newSearchMoreRowData', this.multipleSelection)
                this.alarmDialog = true
            }
        },
        createAllPackTask() {
            if (this.multipleSelection.length === 0) {
                this.$message({
                    message: '请先选择数据！',
                    type: 'warning'
                })
                return
            }
            this.createAllTaskDialog = true
        }
    }
}
</script>
<style lang="scss">
// body .v-modal {
//     z-index: 999 !important;
// }
</style>
<style scoped lang="scss">
// body .v-modal {
//     z-index: 999 !important;
// }
// @import '../../../assets/css/pacap1.scss';
.fixedTable {
    ::-webkit-scrollbar {
        width: 20px;          /* 纵向滚动条 宽度 */
        height: 5px;         /* 横向滚动条 高度 */
        border-radius: 10px;  /* 整体 圆角 */
    }
}
.pcap-btn {
    background-image: url(../../../assets/img/XZWJ.png);
    background-position: 0 0;
    background-repeat: no-repeat;
    background-size: 100% 100%;
}
.drawer-pad {
    overflow-y: auto;
    // padding: 0 20px;
    height: calc(100% - 53px);
    .dialog-footer {
        //float: right;
        margin: 10px 0;
    }
    & ::v-deep img {
        max-width: 600px;
        max-height: 600px;
    }
    &::-webkit-scrollbar,
    li::-webkit-scrollbar,
    ul::-webkit-scrollbar {
        width: 4px;
    }
    &::-webkit-scrollbar-track,
    li::-webkit-scrollbar-track,
    ul::-webkit-scrollbar-track {
        background: none;
    }
    .el-form--inline .el-form-item {
        margin-right: 0;
    }
    .set-header {
        color: #0052d9;
        cursor: pointer;
    }
    ::v-deep .time-panel-picker {
        top: 168px !important;
    }
    ::v-deep .filter-title {
        margin-left: 0 !important;
    }
    ::v-deep .el-tabs__item.is-active {
        padding-left: 10px;
    }
    ::v-deep .el-tabs__item {
        padding-left: 10px !important;
    }
    ::v-deep .el-input__suffix {
        line-height: 30px;
    }
}
.drawer-pad ::v-deep.el-form-item__content {
    font-size: 12px;
}
.drawer-pad ::v-deep .el-form-item__label {
    font-size: 12px;
}
.condition-area {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    z-index: 1000;
    padding: 20px;
    border: solid 1px #dcdcdc;
    border-radius: 2px;
    background-color: #ffffff;
    // box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.8), inset 0px 0px 6px 0px rgba(0, 186, 255, 0.73);
    box-shadow: 0 0 20px 0 rgb(0 0 0 / 10%);
    transition: all 0.3s;
}
.split-line {
    position: absolute;
    bottom: 60px;
    left: 0;
    width: 100%;
    height: 1px;
    background: #dcdcdc;
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
.click-btn:hover {
    // background: #0d4873;
}
::-webkit-scrollbar {
    width: 0 !important;
}
div ::v-deep .el-table__expand-column.expand-col {
    width: 30px;
    border: none;
}
div ::v-deep .el-tabs__nav {
    margin-left: 20px !important;
}
</style>
