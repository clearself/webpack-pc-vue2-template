<template>
    <div class="ub w100" style="margin-top: 10px;min-height: 400px;">
        <div class="expert-left" :class="{'left-fold': leftFold}">
            <i class="fold iconfont icon-zhedie" @click="leftFold=!leftFold"></i>
            <div v-show="!leftFold">
                <div v-if="list.length > 0" class="left-title ub">
                    <div class="left-mark mr-1"></div>
                    <div>已选字段</div>
                </div>
                <div class="left-title" v-if="list.length == 0">可选字段</div>
                <div v-if="list.length>0" class="left-tip"><i class="el-icon-info"></i><span>拖拽字段进行排序</span></div>
                <div :style="{'height':heigLeft,'overflow-y':'auto'}">
                    <div v-if="list.length>0" class="w100 drag drag-top mb-1" style="">
                        <draggable
                            class="list-group w100"
                            tag="ul"
                            :disabled="!isCanOption"
                            filter=".forbid"
                            v-model="innerList"
                            v-bind="{scroll: true,animation: 150}"
                            :move="onMove"
                            @end="onEnd">
                            <transition-group>
                                <li
                                    class="list-group-item w100"
                                    :class="(element.fieldName === 'alarmTime' || element.fieldName==='message') ? 'forbid' : ''"
                                    v-for="element in list"
                                    :key="element.fieldName">
                                    <div class="ub ub-ac list-title">
                                        <div class="vertical-line active"></div>
                                        <div class="open-box">
                                            <i
                                                v-if="element.fieldName !== 'alarmTime' && element.fieldName!=='message' && element.fieldName !=='isAlarm'"
                                                :class="element.show? 'el-icon-arrow-down' : 'el-icon-arrow-right'"
                                                @click="top10Show(element)"
                                                aria-hidden="true"></i>
                                        </div>
                                        <div class="ub ub-f1 line1" style="font-size: 12px;">
                                            {{element.name}}
                                        </div>
                                        <div class="close-box" @click="$parent.delFileds(element)">
                                            <i class="el-icon-close"></i>
                                        </div>
                                        <span class="fields-ver-line"></span>
                                    </div>
                                    <div v-if="element.show" class="list-inner">
                                        <RankChart
                                            :rank-data="rankData"
                                            :top-loading="topLoading"
                                            :element-data="element"/>
                                    </div>

                                </li>
                            </transition-group>
                        </draggable>
                    </div>
                    <div class="left-title ub" v-if="listCanSelect.length > 0 && list.length > 0">
                        <div class="left-mark mr-1" style="background-color: #dcdcdc;"></div>
                        <div>可选字段</div>
                    </div>
                    <el-input v-if="listCanSelect.length>0" placeholder="请输入字段" style="margin: 10px 0 0;width: 180px;" size="small" v-model="filterCanFields" clearable>
                        <i slot="suffix" class="iconfont icon-sousuo"></i>
                    </el-input>
                    <div class="w100 drag" style="margin-top: 10px;margin-bottom: 40px;max-height: 3000px;">
                        <ul>
                            <li class="list-group-item1 w100" v-for="(element,index) in (filterCanFields.trim() ? listCanSelect.filter(it =>it.name.includes(filterCanFields.trim())) : listCanSelect)" :key="index">
                                <div class="ub ub-ac list-title">
                                    <div class="vertical-line"></div>
                                    <div class="open-box">
                                        <i
                                            v-if="element.fieldName !== 'alarmTime' && element.fieldName!=='message' && element.fieldName !=='isAlarm'"
                                            :class="element.show? 'el-icon-arrow-down' : 'el-icon-arrow-right'"
                                            @click="top10Show(element)"
                                            aria-hidden="true"></i>
                                    </div>
                                    <div class="ub ub-f1 line1" style="font-size: 12px;">
                                        {{element.name}}
                                    </div>
                                    <div class="close-box" @click="$parent.addFileds(element)">
                                        <i class="el-icon-plus"></i>
                                    </div>
                                </div>
                                <div v-if="element.show" class="list-inner">
                                    <RankChart
                                        :rank-data="rankData"
                                        :top-loading="topLoading"
                                        :element-data="element" />
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="ub ub-f1 ub-ver expert-right" style="overflow-x: hidden;">
            <div class="ub ub-pj w100 mb-1">
                <div class="list-tips active">告警查询</div>
                <div style="flex: 1;text-align: right;">
                    <el-button style="border-radius: 4px;" v-per="['data_agg_start']" size="small" icon="iconfont icon-fasongyoujian1" type="primary" @click="handleAlarm">发起事件</el-button>
                    <el-button  v-per="['data_agg_storage']" size="small" icon="iconfont icon-sousuotiaojianbaocun" type="primary" @click="handleSaveLogIds" style="border-radius: 4px;background: #00a870;">暂 存</el-button>
                    <el-button v-per="['data_agg_storage_list']"  size="small" icon="iconfont icon-zancunliebiao" type="primary" @click="handleSaveList" style="border-radius: 4px;background: #00a870;">暂存列表</el-button>
                    <el-button style="border-radius: 4px;" v-per="['data_agg_pcap']" size="small" icon="iconfont icon-tianjia" type="primary" @click="createAllPackTask">创建PCAP包任务</el-button>
                    <el-dropdown trigger="click" @command="handleCommand">
                        <span class="el-dropdown-link">
                            <el-button v-per="['data_agg_export']" style="margin-left: 10px;border-radius: 4px;" :loading="downLoading" size="small" icon="iconfont icon-daochu" type="primary">导 出</el-button>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="0">导出json</el-dropdown-item>
                            <el-dropdown-item command="1">导出excel</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-button v-per="['data_agg_highlight']" style="margin-left: 10px;border-radius: 4px;background: #b500ff;" size="small" icon="iconfont icon-shezhi" type="primary" @click="$parent.highlightDialog = true">配置高亮词</el-button>
                </div>
            </div>
            <div :style="{'height':heigRight,'overflow-y':'auto'}">
                <el-table
                    :row-class-name="tableRowClassName"
                    style="width: 100%;"
                    ref="multipleTable"
                    @expand-change="handleExpand"
                    class='bigTable expert-table'
                    :row-key="(row)=>{ return row.id}"
                    :data="tableData"
                    border
                    stripe
                    tooltip-effect="dark"
                    :expand-row-keys="expandRowKeys"
                    :row-style="{ height: '32px' }"
                    :header-row-style="{ height: '32px' }"
                    @sort-change="changeTableSort"
                    @selection-change="handleSelectionChange">
                    <el-table-column align="center" :reserve-selection="true" :selectable="checkSelectable" type="selection" width="30">
                    </el-table-column>
                    <!-- <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                    </el-table-column> -->
                    <el-table-column
                        v-for="(item, index) in tableList"
                        :key="index"
                        :label="item.name"
                        min-width="140"
                        :sortable="item.type===3||item.type===2"
                        show-overflow-tooltip
                        :prop="item.fieldName">
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
                                            v-if="item.fieldName !== 'message' && item.fieldName !== 'dt'"
                                            class="ub ub-ac click-btn"
                                            @click="equalVal({
                                                key: item.fieldName,
                                                attrType: item.type,
                                                name: item.name,
                                                value:scope.row[item.fieldName]
                                            })">
                                            <i class="el-icon-plus"></i>
                                            <span>{{ item.name }}</span>
                                            <span>=</span>
                                            <span class="val">{{scope.row[item.fieldName]}}</span>
                                        </p>
                                        <p
                                            v-if="item.fieldName !== 'message' && item.fieldName !== 'dt'"
                                            class="ub ub-ac click-btn"
                                            style="margin: 10px 0;"
                                            @click="unequalVal({
                                                key: item.fieldName,
                                                attrType: item.type,
                                                name: item.name,
                                                value:scope.row[item.fieldName]
                                            })">
                                            <i class="el-icon-plus"></i>
                                            <span>{{ item.name }}</span>
                                            <span>!=</span>
                                            <span class="val">{{scope.row[item.fieldName]}}</span>
                                        </p>
                                        <p
                                            @click="item.visible = false"
                                            class="ub ub-ac click-btn"
                                            v-clipboard:copy="scope.row[item.fieldName]"
                                            v-clipboard:success="firstCopySuccess"
                                            v-clipboard:error="firstCopyError">
                                            <i class="el-icon-document-copy"></i>
                                            <span>复制</span>
                                        </p>
                                        <p
                                            style="margin-top: 10px;"
                                            v-if="item.fieldName == 'srcIp' || item.fieldName == 'desIp'"
                                            @click="jumpAsset(item, scope.row[item.fieldName])"
                                            class="ub ub-ac click-btn">
                                            <i class="el-icon-s-promotion" style="font-size: 12px;"></i>
                                            <span>跳转到资产</span>
                                        </p>
                                        <p
                                            style="margin-top: 10px;"
                                            v-if="['ip', 'url', '域名'].some(keyWord => item.fieldName.toLowerCase().includes(keyWord))"
                                            @click="jumpThreat(item, scope.row[item.fieldName])"
                                            class="ub ub-ac click-btn"
                                        >
                                            <i class="iconfont icon-chaxunqingbao" style="font-size: 12px;"></i>
                                            <span>查询情报</span>
                                        </p>
                                    </div>
                                    <p class="highlighted" slot="reference" v-html="scope.row[item.fieldName]" v-if="item.fieldName==='aDate'" style="color: #00c0ff;"></p>
                                    <p
                                        v-else
                                        class="highlighted"
                                        :style="['ip', 'url', '域名'].some(keyWord => item.fieldName.toLowerCase().includes(keyWord)) ? 'cursor: pointer; text-decoration: underline; color: #0052D9;'
                                            : 'cursor: default; text-decoration: unset; color: #191919;font-size:12px'
                                        "
                                        slot="reference"
                                        v-html="scope.row[item.fieldName]"
                                    ></p>
                                </el-popover>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="280" fixed="right" class-name="deepBg">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="handleSee(scope.row)">查看</el-button>
                            <el-button v-per="['data_agg_storage']" :disabled="scope.row.holdType !== 0"  type="text" size="small" @click="hanleSave(scope.row)">暂存</el-button>
                            <!-- <opt-btn icon="iconfont icon-chakan1" :disabled="scope.row.nftData===2" title="查看PCAP包" @click="lookPcac(scope.row)"></opt-btn> -->
                            <el-button v-if="scope.row.nftData === 1"  type="text" size="small">加载中</el-button>
                            <el-button v-per="['data_agg_pcap']" @click="createPackTask(scope.row)" :disabled="scope.row.nftData !== 0" type="text" size="small">创建PCAP包</el-button>
                            <el-button v-per="['data_agg_start']" @click="changeOption(scope.row)" type="text" size="small">发起事件</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div v-show="tableData.length>0" class="pagination pag" style="z-index: 20;padding: 0 !important;text-align: right;">
                <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="$parent.get_params.page"
                    :page-sizes="[30,50,100]"
                    :page-size="$parent.get_params.size"
                    layout="slot,sizes, prev, next"
                    :total="$parent.total_num"
                    prev-text="＜ 上一页"
                    next-text="下一页 ＞"></el-pagination>
            </div>
            <!-- <div class="pagination" style="padding: 0 !important; text-align: right;">
                <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="$parent.get_params.page"
                    :page-sizes="[30,50,100]"
                    :page-size="$parent.get_params.size"
                    layout="slot,sizes, prev, next"
                    prev-text="上一页"
                    next-text="下一页"></el-pagination>
            </div> -->
        </div>
        <el-dialog title="提示" :visible.sync="createTaskDialog" width="30%" custom-class="attendance-dialog">
            <span>确定创建PCAP包任务吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="createTaskDialog = false">取消</el-button>
                <el-button size="small" type="primary" @click="createTaskConfim">确认</el-button>
            </span>
        </el-dialog>
        <DeleteDialog
            :title="'确定创建所选PCAP包任务吗？'"
            :text="' '"
            :dialogVisible = createAllTaskDialog
            @delete="createAllTaskConfim"
            @cancel="createAllTaskDialog = false">
        </DeleteDialog>
        <seeDetail ref="seeDetails"></seeDetail>
    </div>
</template>

<script>
import _ from 'loadsh'
import seeDetail from '@/pages/alarm_log/new_search/components/see_detail/index.vue'
import draggable from 'vuedraggable'
import RankChart from '@/pages/alarm_log/new_search/components/chart/RankChart'
import EventBus from '@/assets/js/bus'
import { get_threat_search, getStartConfig, get_threat_searchVenus } from '@/server/alarm/api.js'
import {
    getExpandLog,
    saveLogIds,
    createTask,
    viewPcap
} from '@/server/alarm_log/api.js'
export default {
    name: 'TableContent',
    components: {
        RankChart,
        draggable,
        seeDetail
    },
    props: {
        listAll: {
            default() {
                return []
            }
        },
        list: {
            default() {
                return []
            }
        },
        listCanSelect: {
            default() {
                return []
            }
        },
        tableData: {
            default() {
                return []
            }
        },
        keywords: {
            default() {
                return ''
            }
        },
        rankData: {
            default() {
                return []
            }
        },
        topLoading: {
            default: false
        },
        viewChartOpen: {
            default: false
        }
    },
    data() {
        return {
            startData: [],
            downLoading: false,
            leftFold: false,
            tabsValue: '',
            pacpData: [],
            createTaskId: '',
            createAllTaskDialog: false,
            createTaskDialog: false,
            highColor: [
                '#ff0000',
                '#ea00ff',
                '#ffd200',
                '#00ff06',
                '#ff4aca',
                '#3888ff',
                '#ff8400',
                '#7e00ff',
                '#00ffea',
                '#aeff00'
            ],
            isCanOption: true,
            // listAll: [],
            // listCanSelect: [],
            // list: [],
            filterCanFields: '',
            innerList: [],
            editable: true,
            isDragging: false,
            delayedDragging: false,
            expandRowKeys: [],
            expandData: [],
            expandJsonData: [],
            get_params: {
                // page: 1,
                // size: 100,
                // content: '',
                // startTime: '',
                // endTime: '',
                // dt_type: '',
                // dt: null,
                // dstIpType: '',
                // dstPortType: '',
                // srcIpType: '',
                // srcPortType: '',
                // protocolType: '',
                // desIp: '',
                // desPort: '',
                // srcIp: '',
                // srcPort: '',
                // protocol: ''
            },
            loading: false,
            total_num: 0,
            total__count: 0,
            // tableData: [],
            multipleSelection: [],
            sayTimes: null,
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
            heigRight: 'calc(100vh - 350px)',
            heigLeft: 'calc(100vh - 315px)'
        }
    },
    computed: {
        tableList() {
            console.log('this.list', this.list)
            return this.list.length > 0 ? this.list : [{ fieldName: 'id', name: 'ID' }, { fieldName: 'srcIp', name: '源IP' }]
        },
        dragOptions() {
            return {
                animation: 100
            }
        },

        listString() {
            return JSON.stringify(this.list, null, 2)
        }
    },
    watch: {
        viewChartOpen(val) {
            if (val) {
                this.heigRight = 'calc(100vh - 500px)'
                this.heigLeft = 'calc(100vh - 415px)'
            } else {
                this.heigRight = 'calc(100vh - 350px)'
                this.heigLeft = 'calc(100vh - 315px)'
            }
        },
        list: {
            handler(newVal) {
                this.innerList = _.cloneDeep(newVal)
            },
            immediate: true
        },
        innerList: {
            handler(newVal) {
                if (JSON.stringify(newVal) !== JSON.stringify(this.list)) {
                    this.$parent.list = _.cloneDeep(newVal)
                }
            }
        },
        isDragging(newValue) {
            if (newValue) {
                this.delayedDragging = true
                return
            }
            this.$nextTick(() => {
                this.delayedDragging = false
            })
        }
    },
    mounted() {
        this.getStartConfigData()
    },
    methods: {
        getStartConfigData() {
            getStartConfig({ queryData: {}, paramsData: {}}).then(res => {
                this.startData = res
            })
        },
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex % 2) {
                return 'table-row2'
            } else {
                return 'table-row1'
            }
        },
        jumpThreat(item, value) {
            if (item.fieldName !== 'srcIp' && item.fieldName !== 'desIp') {
                return
            }
            console.log('ip', item.fieldName, value)
            let obj = {
                queryData: {},
                paramsData: { value }
            }
            console.log(this.startData)
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
        handleSee(row) {
            this.$refs.seeDetails.init(row, this.list)
            this.$refs.seeDetails.startData = this.startData
        },
        jumpAsset(item, value) {
            if (item.fieldName !== 'srcIp' && item.fieldName !== 'desIp') {
                return
            }
            console.log('ip', item.fieldName, value)
            this.$setsessionStorage('currentPath', '/assets/assets_asset_info?ip=' + value)
            window.open(window.location.origin + '/#' + '/assets/assets_asset_info?ip=' + value)
        },
        handleSaveList() {
            // this.$parent.startData = this.startData
            this.$parent.saveListDialog = true
        },
        handleCommand(command) {
            this.$emit('handleDownload', command, this.multipleSelection)
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
                    this.$emit('createTaskSucess')
                }, 1500)
            })
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
                    this.$emit('createTaskSucess')
                }, 1500)
            })
        },
        handleSaveLogIds() {
            if (this.multipleSelection.length === 0) {
                this.$message({
                    message: '请先选择数据！',
                    type: 'warning'
                })
            } else {
                let idsData = this.multipleSelection.map((item) => {
                    return {
                        alarmTime: item.alarmTime,
                        id: item.id
                    }
                })
                this.saveLogIdsData(idsData)
            }
        },
        hanleSave(row) {
            let idsData = [{ alarmTime: row.alarmTime, id: row.id }]
            this.saveLogIdsData(idsData)
        },
        saveLogIdsData(idsData) {
            // let userId = this.$getsessionStorage('userInfo').id
            let data = {
                queryData: {},
                paramsData: {
                    ids: idsData
                }
            }
            saveLogIds(data).then(res => {
                this.$message({
                    message: '暂存成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.$emit('saveLogIdSuccess')
                }, 1000)
            }).catch(error => {
                console.log(error + 'error')
            })
        },
        changeOption(row) {
            this.$setlocalStorage('newSearchRowData', row)
            this.$parent.selectMode = 1
            this.$parent.alarmDialog = true
        },
        handleAlarm() {
            console.log('multipleSelection', this.multipleSelection)
            // debugger
            if (this.multipleSelection.length <= 1) {
                this.$message({
                    message: '请至少选择两条数据！',
                    type: 'warning'
                })
            } else {
                this.$parent.selectMode = 2
                this.$setlocalStorage('newSearchMoreRowData', this.multipleSelection)
                this.$parent.alarmDialog = true
            }
        },
        handleExpand(row, expandedRows) {
            let that = this
            if (expandedRows.length) {
                that.expandRowKeys = []
                if (row) {
                    that.expandRowKeys.push(row.id)

                    console.log(row, '展开')
                    this.expandData = []
                    this.expandJsonData = {}
                    let data = {
                        id: row.id,
                        logType: row.logType,
                        alarmTime: row.alarmTime
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
                                        fieldName: 'message',
                                        value: res.message,
                                        type: 1
                                    }
                                    continue
                                }
                                if (resKey === 'alarmTime') {
                                    alarmTimeObj = {
                                        name: '发生时间',
                                        fieldName: 'alarmTime',
                                        value: res.alarmTime,
                                        type: 3
                                    }
                                    continue
                                }
                                let item = this.listAll.find(it => it.fieldName === resKey)
                                // console.log(item, '字段信息')
                                if (item) {
                                    arr.push({
                                        fieldName: item.fieldName,
                                        name: item.name,
                                        value: res[resKey],
                                        type: item.type
                                    })
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
                    }).then(() => {
                        this.filterKeyword('highlighted-inner')
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

                logId: row.id

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
        defHighlight(node, keyword, index) {
            const reg = new RegExp(keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'))
            // console.log(node.nodeType)
            if (node.nodeType == 3) { // 只处理文本节点
                const match = node.data.match(new RegExp(reg))
                if (match) {
                    console.log('匹配到了')
                    const highlightEl = document.createElement('b')
                    highlightEl.style.color = this.highColor[index]
                    const wordNode = node.splitText(match.index)
                    wordNode.splitText(match[0].length) // 切割成前 关键词 后三个Text 节点
                    const wordNew = document.createTextNode(wordNode.data)
                    highlightEl.appendChild(wordNew)// highlight 节点构建成功
                    wordNode.parentNode.replaceChild(highlightEl, wordNode)// 替换该文本节点
                }
            } else {
                for (var i = 0; i < node.childNodes.length; i++) {
                    this.defHighlight(node.childNodes[i], keyword, index)
                    i++
                }
            }
        },
        filterKeyword(className = 'highlighted') {
            if (this.keywords.trim() === '') return
            this.$nextTick(() => {
                let arr = [...document.getElementsByClassName(className)]
                arr.forEach(it => {
                    // console.log(it)
                    let keywordsArr = this.keywords.split(',').filter(it => it !== '')
                    keywordsArr.forEach((item, index) => {
                        this.defHighlight(it, item, index)
                    })
                })
            }, 100)
        },
        equalVal(item) {
            console.log(item)
            let data = {
                origin: [{ connect: 'and', children: [{ field: item.key, operator: '=', value: item.value, dataType: 1, attrType: item.attrType }] }],
                msg: `((${item.name} = ${item.value}))`,
                id: Date.now() + Math.random()
            }
            this.$parent.conditionData.push(data)
            this.$message.success('添加成功')
            console.log(item.value)
            item.visible = false
            this.$parent.searchAssets()
        },
        unequalVal(item) {
            let data = {
                origin: [{ connect: 'and', children: [{ field: item.key, operator: '!=', value: item.value, dataType: 1, attrType: item.attrType }] }],
                msg: `((${item.name} != ${item.value}))`,
                id: Date.now() + Math.random()
            }
            this.$parent.conditionData.push(data)
            this.$message.success('添加成功')
            console.log(item.value)
            item.visible = false
            this.$parent.searchAssets()
        },

        firstCopySuccess(e) {
            console.log('copy arguments e:', e)
            this.$message.success('复制成功')
        },
        firstCopyError(e) {
            console.log('copy arguments e:', e)
            this.$message.error('复制失败')
        },
        onEnd() {
            console.log('拖拽结束')
            this.$parent.changeFileds()
        },
        onMove(e) {
            console.log(e.relatedContext.element.fieldName)
            if (e.relatedContext.element.fieldName === 'alarmTime' || e.relatedContext.element.fieldName === 'message') return false
            return true
        },
        top10Show(element) {
            if (element.show) {
                element.show = false
                return
            }
            console.log(element)
            this.$parent.listAll.forEach(it => {
                if (it.fieldName !== element.fieldName) {
                    it.show = false
                }
            })
            this.$parent.list.forEach(it => {
                if (it.fieldName !== element.fieldName) {
                    it.show = false
                }
            })
            this.$parent.listCanSelect.forEach(it => {
                if (it.fieldName !== element.fieldName) {
                    it.show = false
                }
            })
            EventBus.$emit('getTopField', {
                fields: [element.fieldName],
                orderType: 'desc'
            })
            EventBus.$emit('getTopFieldTwo', {
                fields: [element.fieldName],
                orderType: 'desc'
            })
            element.show = true
        },
        handleSizeChange(val) {
            this.$parent.get_params.size = val
            this.$parent.get_data()
        },
        handleCurrentChange(val) {
            this.$parent.get_params.page = val
            this.$parent.get_data()
        },
        indexMethod(index) {
            return (this.$parent.get_params.page - 1) * this.$parent.get_params.size + index + 1
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
        checkSelectable(row, index) {
            let flag = false
            if (row.nftData === 0) {
                flag = true
            }
            return flag
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        }
    }
}
</script>

<style lang="scss">
    .el-tooltip__popper {
        max-width: 50vw;
    }
</style>
<style scoped lang="scss">
@import '../../../../../assets/css/pacap';
i.fold {
    position: absolute;
    top: 18px;
    right: 15px;
    font-size: 12px;
    color: #999999;
    cursor: pointer;
}
.pag {
    ::v-deep .el-input__inner {
        border: none !important;
    }
    ::v-deep .btn-prev {
        margin-left: -5px !important;
        border: none !important;
        background: none !important;
        box-shadow: none !important;
        span {
            font-size: 12px !important;
            color: #676a71 !important;
        }
        span:hover {
            color: #0052d9 !important;
        }
    }
    ::v-deep .btn-next {
        border: none !important;
        background: none !important;
        box-shadow: none !important;
        span {
            font-size: 12px !important;
            color: #676a71 !important;
        }
        span:hover {
            color: #0052d9 !important;
        }
    }
}
.pcap-btn {
    background-image: url(../../../../../assets/img/XZWJ.png);
    background-position: 0 0;
    background-repeat: no-repeat;
    background-size: 100% 100%;
}
.expert-left {
    position: relative;
    padding: 10px 0;
    width: 190px;
    border: solid 1px #ffffff;
    background-color: #ffffff;
    // margin-right: 10px;
    transition: width 0.2s linear;
    box-sizing: border-box;
    ::v-deep .el-input__suffix-inner {
        line-height: 32px;
    }
}
.expert-left.left-fold {
    width: 30px;
    transition: width 0.2s linear;
    i.fold {
        right: 8px;
        color: #999999;
        transform: rotate(180deg);
    }
}
.expert-right {
    padding: 10px 0 10px 10px;
    border: solid 1px #ffffff;
    background-color: #ffffff;
    ::v-deep .el-button--primary {
        border-color: #ffffff;
    }
    ::v-deep .el-button--text {
        // color: #0052d9;
    }
}
.left-title {
    font-size: 14px;
    color: #191919;
}
.left-mark {
    width: 5px;
    height: 24px;
    border-radius: 4px;
    background-color: #387dee;
}
.left-tip {
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 0;
    > i {
        margin-right: 5px;
        font-size: 12px;
        color: #bdbdbd;
        vertical-align: middle;
    }
    > span {
        vertical-align: middle;
        font-size: 10px;
        color: #bdbdbd;
    }
}
.list-group {
    min-height: 26px;
}
.list-title {
    // margin-left: 6px;
    position: relative;
    width: 180px;
    height: 26px;
    border-radius: 4px;
    // background-image: url(../../../../../assets/img/field_bg.jpg);
    // background-size: 100% 100%;
    // background-repeat: no-repeat;
    // background-position: left top;
    .vertical-line {
        position: absolute;
        left: -6px;
        width: 2px;
        height: 26px;
        background: rgb(255 255 255 / 20%);
        &.active {
            // background: #fff;
            // box-shadow: 0 0 4px #00d0ff, 0 0 6px #00d0ff;
        }
    }
}
.list-group-item.forbid {
    .vertical-line.active {
        // background: red;
    }
}
.list-group-item {
    margin: 4px 0;
    color: #ffffff;
    cursor: move;
    // padding:0 10px;
    box-sizing: border-box;
    .list-title {
        background-color: #387dee;
    }
}
.list-group-item1 {
    margin: 8px 0;
    color: #616161;
    // padding:0 10px;
    box-sizing: border-box;
    .list-title {
        background-color: #e7e7e7;
    }
    .open-box,
    .close-box {
        color: #5c5c5c;
    }
}
.list-group-item i,
.list-group-item1 i {
    cursor: pointer;
}
.open-box,
.close-box {
    width: 26px;
    height: 100%;
    text-align: center;
    color: #ffffff;
    line-height: 26px;
}
.list-inner-tip {
    margin: 6px 0;
    font-size: 12px;
    color: #0052d9;
    line-height: 15px;
}
.list-inner {
    margin: 10px 0;
    width: 170px;
}
div ::v-deep .store.btn_box {
    background-image: url('../../../../../components/modules/colorBtn/images/downloadBg.png');
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
    background: #f3f3f3;
}
::-webkit-scrollbar {
    width: 0 !important;
}
div ::v-deep .el-table__expand-column.expand-col {
    width: 30px;
    border: none;
}
.el-dropdown-menu {
    width: 120px !important;
}
</style>
