<template>
    <div class="zancun">
        <el-drawer title="暂存列表" :visible.sync="saveListDialog" direction="rtl" :size="1300" :show-close="true" :before-close="closeDialog" @close="closeDialog" :wrapperClosable="false">
            <div class="drawer-content">
                <div
                    style="position: relative;
                        top: 0;
                        left: 0;
                        overflow-y: auto;
                        width: 100%;
                        height: 100%;
">
                    <div class="ub ub-pe w100">
                        <!-- <div class="list-tips"></div> -->
                        <div class="ub">
                            <!-- <el-button size="small" icon="iconfont icon-fasongyoujian1" type="primary" @click="handleAlarm">发起事件</el-button>
                            <el-button size="small" icon="iconfont icon-tianjia" type="primary" @click="createAllPackTask">创建PCAP包任务</el-button> -->
                            <el-dropdown trigger="click" @command="handleCommand">
                                <span class="el-dropdown-link">
                                    <el-button style="margin-right: 10px;margin-left: 10px;" size="small" icon="iconfont icon-daochu" type="primary">导 出</el-button>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="0">导出json</el-dropdown-item>
                                    <el-dropdown-item command="1">导出excel</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                            <el-button icon="el-icon-delete" type="danger" size="small" @click="handleClearAllDialog = true">清空列表</el-button>
                        </div>
                    </div>
                    <div class="drawer-pad">
                        <div style="margin-bottom: 10px;">
                            <CustomDate :append-to-body="appendToBody"  @getCustomTime="getCustomTime" :inputWidth="675" :empty="emptyData" @getDateData="getDateData"  @useing="customDateUse" ref="customDate"></CustomDate>
                        </div>
                        <div class="ub ub-pj">
                            <div style="width: 1100px;">
                                <CustomSearch ref="customSearch" :selectWidth="1100" @getData="getData" :type="1" />
                            </div>
                            <Debounce :time='1500' :isDebounce="2">
                                <el-button size="small" type="primary" @click.native="searchAssets">搜 索</el-button>
                            </Debounce>
                        </div>
                        <div style="position: relative;">
                            <FilterCondition :is-drawer="true" :condition-data="conditionData" />
                            <div v-if="conditionShow" class="condition-area">
                                <ConditionRules
                                    :select-data="selectAll"
                                    :treeData="treeData" />
                                <div class="split-line"></div>
                                <div class="ub ub-pe footer">
                                    <el-button style="margin-right: 10px;" size="small" @click="conditionShow = false">取消</el-button>
                                    <Debounce :time='1500' :isDebounce="2">
                                        <el-button @click.native="addFilterCondition" size="small" type="primary">{{ conditionData.some(it => it.id === this.recordId) ? '编 辑' :'添 加' }}</el-button>
                                    </Debounce>
                                </div>
                            </div>
                        </div>
                        <div class="ub ub-pe" style="margin-bottom: 20px;">
                            <div class="set-header" @click="transferDialog = true">
                                <span style="margin-right: 5px;font-size: 12px;" class="iconfont icon-zidingyibiaotou"></span>
                                <span>自定表头</span>
                            </div>
                        </div>
                        <div>
                            <el-table
                                :row-class-name="tableRowClassName"
                                style="width: 100%;"
                                v-loading="loading"
                                ref="multipleTable"
                                @expand-change="handleExpand"
                                class='bigTable expert-table'
                                :row-key="(row)=>{ return row.id}"
                                :data="tableData"
                                :height="620"
                                border
                                stripe
                                tooltip-effect="dark"
                                :expand-row-keys="expandRowKeys"
                                @sort-change="changeTableSort"
                                @selection-change="handleSelectionChange">
                                <el-table-column align="center" :reserve-selection="true" :selectable="checkSelectable" type="selection" width="50">
                                </el-table-column>
                                <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                                </el-table-column>
                                <el-table-column type="expand" class-name="expand-col" width="40">
                                    <template slot-scope="{row}">
                                        <el-tabs>
                                            <el-tab-pane label="键/值" style="overflow: hidden;padding: 0 20px;" class="demo-table-left">
                                                <div class="table-expand" style="overflow-y: auto;max-height: 500px;">
                                                    <el-form label-position="left" label-width="150px">
                                                        <el-form-item :label="item.name" v-for="(item,index) in expandData" :key="index+row.id">
                                                            <div style="max-width: 800px;text-align: justify;word-break: break-all;">
                                                                <span>{{item.value}}</span>
                                                            </div>
                                                        </el-form-item>
                                                    </el-form>
                                                </div>

                                            </el-tab-pane>
                                            <el-tab-pane label="JSON" style="overflow: hidden;padding: 0 20px;">
                                                <div class="table-expand" style="overflow-y: auto;max-width: 800px;max-height: 500px;font-size: 12px;text-align: justify;word-break: break-all;">
                                                    <json-viewer :value="expandJsonData" :expand-depth="5" copyable theme="my-awesome-json-theme" sort></json-viewer>
                                                </div>
                                            </el-tab-pane>

                                            <el-tab-pane v-if="row.nftData === 2" label="PCAP包" style="overflow: hidden;padding: 0 20px;max-width: 1000px;">
                                                <div class="table-expand pcap-detail" style="overflow-y: auto;max-width: 800px;max-height: 500px;font-size: 12px;text-align: justify;word-break: break-all;">
                                                    <!-- <div style="margin-bottom: 10px;">
                                                        <addBtn class="pcap-btn" style="margin-right: 10px;" icon="iconfont icon-tianjia" :disabled="row.nftData===0" title="创建PCAP包任务" @click="createPackTask(row)"></addBtn>
                                                        <a :href="'/api/data_center/manage/syslog/downloadPacap?logId='+row.id" download>
                                                            <addBtn class="pcap-btn" icon="iconfont icon-xiazai1" title="下载PCAP包" />
                                                        </a>
                                                    </div> -->
                                                    <el-tabs v-model="tabsValue" type="card" style="height: 100%;">
                                                        <el-tab-pane
                                                            :key="index"
                                                            v-for="(item, index) in pacpData"
                                                            :label="item.name"
                                                            :name="item.name"
                                                            style="height: 100%;"
                                                        >
                                                            <div v-if="item.content.length>0" class="w100 left-content">
                                                                <div v-for="(_item,_index) in item.content" :key="_index" class="ub w100 ub-ver">
                                                                    <div v-if="_item.type==='req'" class="ub ub-f1 request" style="width: 100%;"><pre>{{_item.payload}}</pre></div>
                                                                    <div v-if="_item.type==='res'" class="ub ub-f1 response" style="width: 100%;"><pre>{{_item.payload}}</pre></div>
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
                                    sortable
                                    show-overflow-tooltip
                                    :prop="item.field">
                                    <template slot-scope="scope">
                                        <div>
                                            <el-popover
                                                popper-class="add-search"
                                                placement="bottom"
                                                title=""
                                                trigger="click"
                                            >
                                                <div>
                                                    <p
                                                        v-if="item.field !== 'message' && item.field !== 'dt'"
                                                        class="ub ub-ac click-btn"
                                                        @click="equalVal({
                                                            key: item.field,
                                                            name: item.name,
                                                            attrType: item.type,
                                                            value:scope.row[item.field]
                                                        })">
                                                        <i class="el-icon-plus"></i>
                                                        <span>{{ item.name }}</span>
                                                        <span>=</span>
                                                        <span class="val">{{scope.row[item.field]}}</span>
                                                    </p>
                                                    <p
                                                        v-if="item.field !== 'message' && item.field !== 'dt'"
                                                        class="ub ub-ac click-btn"
                                                        style="margin: 10px 0;"
                                                        @click="unequalVal({
                                                            key: item.field,
                                                            name: item.name,
                                                            attrType: item.type,
                                                            value:scope.row[item.field]
                                                        })">
                                                        <i class="el-icon-plus"></i>
                                                        <span>{{ item.name }}</span>
                                                        <span>!=</span>
                                                        <span class="val">{{scope.row[item.field]}}</span>
                                                    </p>
                                                    <p
                                                        @click="item.visible = false"
                                                        class="ub ub-ac click-btn"
                                                        v-clipboard:copy="scope.row[item.field]"
                                                        v-clipboard:success="firstCopySuccess"
                                                        v-clipboard:error="firstCopyError">
                                                        <i class="el-icon-document-copy"></i>
                                                        <span>复制</span>
                                                    </p>
                                                    <p
                                                        style="margin-top: 10px;"
                                                        v-if="item.field == 'srcIp' || item.field == 'desIp'"
                                                        @click="jumpAsset(item, scope.row[item.field])"
                                                        class="ub ub-ac click-btn">
                                                        <i class="el-icon-s-promotion" style="font-size: 12px;"></i>
                                                        <span>跳转到资产</span>
                                                    </p>
                                                </div>
                                                <p slot="reference" v-if="item.field==='aDate'" style="color: #00c0ff;">{{scope.row[item.field]}}</p>
                                                <p slot="reference" :style="{cursor: ['srcIp', 'desIp'].includes(item.field) ? 'default' : 'default' }" v-else>{{scope.row[item.field]}}</p>
                                            </el-popover>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" align="center" width="80" fixed="right" class-name="deepBg">
                                    <template slot-scope="scope">
                                        <!-- <el-button @click="createPackTask(scope.row)" type="text" size="small">创建PCAP包</el-button>
                                        <el-button @click="changeOption(scope.row)" type="text" size="small">发起事件</el-button> -->
                                        <el-button @click="handleClear(scope.row)" type="text" size="small">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <pagination :total="totalData" :page.sync="get_params.page" :limit.sync="get_params.size" @pagination="get_data" />
                            <!-- <div class="pagination">
                                <el-pagination
                                    background
                                    @size-change="handleSizeChange"
                                    @current-change="handleCurrentChange"
                                    :current-page="get_params.page"
                                    :page-sizes="[30,50,100]"
                                    :page-size="get_params.size"
                                    layout="slot,sizes, prev, next"
                                    prev-text="上一页"
                                    next-text="下一页"></el-pagination>
                            </div> -->
                        </div>
                    </div>
                </div>
            </div>
        </el-drawer>
        <el-dialog title="提示" :visible.sync="createAllTaskDialog" width="30%" custom-class="attendance-dialog">
            <span>确定创建所选PCAP包任务吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="createAllTaskDialog = false">取消</el-button>
                <el-button size="small" type="primary" @click="createAllTaskConfim">确认</el-button>
            </span>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="handleClearAllDialog" width="30%" custom-class="attendance-dialog">
            <span>确定清空列表吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="handleClearAllDialog = false">取消</el-button>
                <el-button size="small" type="primary" @click="handleClearAll">确认</el-button>
            </span>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="createTaskDialog" width="30%" custom-class="attendance-dialog">
            <span>确定创建PCAP包任务吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="createTaskDialog = false">取消</el-button>
                <el-button size="small" type="primary" @click="createTaskConfim">确认</el-button>
            </span>
        </el-dialog>
        <Alarm :alarm-dialog="alarmDialog" :select-mode='selectMode' @addAlarmSucess="addAlarmSucess" ref="drawerRef"></Alarm>
        <CustomTransfer :list-all="listAll" :list="list" :transfer-dialog="transferDialog" />
    </div>
</template>

<script>
import Alarm from '@/pages/data_manage/new_search/components/alarm/index.vue'
import EventBus from '@/assets/js/bus'
import ConditionRules from '@/pages/data_manage/new_search/components/ConditionRules'
import FilterCondition from '@/pages/data_manage/new_search/components/FilterCondition'
import CustomDate from './custom_date.vue'
import CustomSearch from '../custom_search/index.vue'
import CustomTransfer from '../../components/custom_transfer/index.vue'
import {
    getFilterSql,
    getDataTree,
    getExpandLog,
    getList,
    createTask,
    downloadTwo,
    saveLogIds,
    viewPcap
} from '@/server/data_manage/new_search.js'
import {
    getStashField,
    getStashList,
    updateStashFields,
    clearStashFields
} from '@/server/data_manage/stash.js'
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
        saveListDialog: {
            type: Boolean,
            default() {
                return false
            }
        },
        type: {
            type: Number
        }
    },
    computed: {
        tableList() {
            console.log('this.list', this.list)
            return this.list.length > 0 ? this.list : [{ field: 'id', name: 'ID' }, { field: 'srcIp', name: '源IP' }]
        }
    },
    watch: {
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
        saveListDialog(val) {
            if (val) {
                this.emptyData = true
                this.conditionData = []
                this.sqlTermData = ''
                this.multipleSelection = []
                this.$nextTick(() => {
                    this.$refs.multipleTable.clearSelection()
                })
                if (this.$refs.customSearch) {
                    this.$refs.customSearch.inputData = ''
                }
                this.getStashFields()
            }
        }
    },
    mounted() {
        this.$nextTick(() => {

        })
    },
    data() {
        return {
            handleClearAllDialog: false,
            tableHeight: document.body.clientHeight - 310,
            totalData: 0,
            emptyData: true,
            tabsValue: '',
            pacpData: [],
            appendToBody: false,
            createTaskId: '',
            createTaskDialog: false,
            createAllTaskDialog: false,
            alarmDialog: false,
            selectMode: 0,
            conditionShow: false,
            recordId: '',
            conditionData: [],
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
                size: 20,
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
            ]

        }
    },
    methods: {
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex % 2) {
                return 'table-row2'
            } else {
                return 'table-row1'
            }
        },
        customDateUse() {
            this.get_params.page = 1
            this.get_data()
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
        getDateData(date, mode, useDate, useIndex) {
            this.dateData = date
            this.dateMode = mode
            this.useDate = useDate
            this.useIndex = useIndex
        },
        jumpAsset(item, value) {
            if (item.field !== 'srcIp' && item.field !== 'desIp') {
                return
            }
            console.log('ip', item.field, value)
            this.$setsessionStorage('currentPath', '/assets/assets_asset_info?ip=' + value)
            window.open(window.location.origin + '/#' + '/assets/assets_asset_info?ip=' + value)
        },
        equalVal(item) {
            console.log(item)
            let data = {
                origin: [{ connect: 'and', children: [{ field: item.key, operator: '=', value: item.value, dataType: 1, attrType: item.attrType }] }],
                msg: `((${item.name} = ${item.value}))`,
                id: Date.now() + Math.random()
            }
            this.conditionData.push(data)
            console.log(item.value)
            item.visible = false
        },
        unequalVal(item) {
            let data = {
                origin: [{ connect: 'and', children: [{ field: item.key, operator: '!=', value: item.value, dataType: 1, attrType: item.attrType }] }],
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
            this.sysLogListData[0].aDate = row.alarmTime
            this.sysLogListData[0].logId = row.id
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
            saveLogIds(data).then(res => {
                this.$message({
                    message: '暂存成功',
                    type: 'success'
                })
            }).catch(error => {
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
            let sysLogList = []
            sysLogList = this.multipleSelection.map(item => {
                return {
                    srcIp: item.srcIp,
                    desIp: item.desIp,
                    srcPort: item.srcPort,
                    desPort: item.desPort,
                    aDate: item.alarmTime,
                    logId: item.id
                }
            })
            let data = {
                queryData: {},
                paramsData: {
                    sysLogList: sysLogList
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
                    type: this.type,
                    fields: list
                }
            }
            updateStashFields(data).then(res => {
                this.transferDialog = false
                this.$message.success('操作成功')
                this.getStashFields()
            }).catch(err => {
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
        getStashFields() {
            let data = {
                queryData: {},
                paramsData: {
                    searchType: this.type
                }
            }
            getStashField(data).then(res => {
                this.list = []
                this.listAll = []
                this.selectAll = []
                return res
            }).then(res => {
                console.log('缓存字段', res)
                this.listAll = res.allField ?? []
                this.selectAll = res.allField.map(it => {
                    return Object.assign({}, it, { fieldName: it.field })
                })
                this.list = res.logStorage ?? []
            }).then(() => {
                this.get_data()
            }).catch(err => {
                console.log(err, 'err')
            })
        },
        get_data() {
            this.loading = true
            let data = {
                queryData: {
                    page: this.get_params.page,
                    pageSize: this.get_params.size
                },
                paramsData: {
                    inputTerm: this.emptyData === true ? [] : [{ field: 'startTime', value: this.customTime[0] }, { field: 'endTime', value: this.customTime[1] }],
                    sqlTerm: this.sqlTermData,
                    filterTerm: this.conditionData.map(it => it.origin[0]),
                    fields: this.list.map(it => it.field),
                    logType: '5'
                }
            }
            getStashList(data).then(res => {
                this.tableData = []
                return res
            }).then(res => {
                console.log('数据暂存列表', res)
                this.loading = false
                let arr = res.records
                this.totalData = res.total
                if (arr.length > 0) {
                    this.tableData = this.$lodash.cloneDeep(arr)
                    this.$nextTick(() => {
                        this.$refs.multipleTable.doLayout()
                    })
                } else if (arr.length === 0) {
                    if (this.get_params.page > 1) {
                        this.get_params.page = this.get_params.page - 1
                        this.get_data()
                    }
                }
            }).catch(error => {
                this.loading = false
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
                    getExpandLog(data).then(res => {
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
                                let item = this.listAll.find(it => it.field === resKey)
                                if (item) {
                                    arr.push({
                                        name: item.name,
                                        value: res[resKey]
                                    })
                                    obj[item.field] = res[resKey]
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
                    }).then(() => {
                        if (row.nftData === 2) {
                            that.lookPcac(row)
                        }
                    }).catch(err => {
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

                },
                paramsData: {
                    logId: row.id
                }
            }
            viewPcap(data).then(res => {
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
            }).catch(err => {
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
            } else { // 发果是降序
                this.tableData = this.tableData.sort((a, b) => {
                    return parseFloat(b[prop]) - parseFloat(a[prop])
                })
            }
        },
        addFilterCondition() {
            let that = this
            console.log(this.treeData)
            let data = {
                queryData: {},
                paramsData: {
                    filterTerm: this.treeData
                }
            }
            getFilterSql(data).then(res => {
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
            }).catch(err => {
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
            this.get_params.page = 1
            this.setDate()
            this.get_data()
        },
        getData(val) {
            this.sqlTermData = val
            console.log('智能搜索框时间', val)
        },
        getCustomTime(val) {
            this.emptyData = false
            this.customTime = val
            console.log('时间走没走', val)
        },
        handleClearAll() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            clearStashFields(data).then(res => {
                this.$message.success('操作成功！')
                this.handleClearAllDialog = false
                setTimeout(() => {
                    this.tableData = []
                    // this.get_data()
                }, 2000)
            }).catch(err => {
                console.log(err)
            })
        },
        handleClear(row) {
            let data = {
                queryData: {},
                paramsData: {
                    id: ''
                }
            }
            if (row) {
                data.paramsData.id = row.id
            }
            clearStashFields(data).then(res => {
                this.$message.success('操作成功！')
                setTimeout(() => {
                    this.get_data()
                }, 2000)
            }).catch(err => {
                console.log(err)
            })
        },
        handleCommand(statusData) {
            let data = {
                queryData: {},
                paramsData: {
                    logIds: this.multipleSelection.length > 0 ? this.multipleSelection.map(item => item.id) : [],
                    searchType: 2,
                    fileType: statusData,
                    inputTerm: this.emptyData === true ? [] : [{ field: 'startTime', value: this.customTime[0] }, { field: 'endTime', value: this.customTime[1] }],
                    sqlTerm: this.sqlTermData,
                    filterTerm: this.conditionData.map(it => it.origin[0]),
                    fields: this.list.map(it => it.field),
                    logType: '5'
                }
            }
            downloadTwo(data).then(res => {
                this.$message({
                    message: '下载成功',
                    type: 'success'
                })
            }).catch(error => {
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
        },
        closeDialog() {
            this.$parent.saveListDialog = false
        }
    }
}
</script>
<style lang="scss">
.zancun {
    .el-table__body-wrapper {
        height: 584px !important;
    }
}
</style>
<style scoped lang="scss">
@import '../../../../../assets/css/pacap';
.pcap-btn {
    background-image: url(../../../../../assets/img/XZWJ.png);
    background-position: 0 0;
    background-repeat: no-repeat;
    background-size: 100% 100%;
}
.drawer-pad {
    overflow-y: auto;
    // padding: 0 20px;
    height: calc(100% - 53px);
    .dialog-footer {
        float: right;
        margin-top: 78px;
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
        font-size: 12px;
        color: #0052d9;
        cursor: pointer;
    }
    ::v-deep .time-panel-picker {
        top: 168px !important;
    }
    ::v-deep .filter-title {
        margin-left: 0 !important;
        font-size: 12px;
        color: rgb(0 0 0 / 90%);
    }
    .bigTable {
        ::v-deep .el-form-item {
            margin-bottom: 0;
        }
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
        color: #0052d9;
    }
    span.val {
        color: #0052d9;
    }
}
.click-btn:hover {
    background-color: #f3f3f3;
}
::-webkit-scrollbar {
    width: 0 !important;
}
div ::v-deep .el-table__expand-column.expand-col {
    width: 30px;
    border: none;
}
</style>
<style lang="scss">
// .black-theme {
//     .time-panel-picker {
//         top: 168px !important;
//     }
// }

</style>
