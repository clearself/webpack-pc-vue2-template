<template>
    <div class="list">
        <SearchTop @search="searchCheck" @reset="reset" @isOpen="isOpen1">
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params" style="width: 100%;line-height: 50px" label-position="left" label-width="65px">
                    <el-form-item label="攻击者IP:">
                        <el-input
                            placeholder="请输入"
                            clearable
                            v-model.trim="get_params.srcIp"
                            style="width: 100%"
                            size="small">
                        </el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params" style="width: 100%" label-position="left" label-width="80px">
                    <el-form-item label="受害资产IP:">
                        <el-input
                            placeholder="请输入"
                            clearable
                            v-model.trim="get_params.desIp"
                            style="width: 100%"
                            size="small">
                        </el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params" style="width: 100%" label-position="left" label-width="65px">
                    <el-form-item label="攻击手段:">
                        <el-select
                            v-model="get_params.reportType"
                            filterable
                            placeholder="请选择"
                            style="width: 100%"
                            size="small"
                            clearable>
                            <el-option
                                v-for="(item, index) in alarmTypeList"
                                :key="index"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params" label-position="left" label-width="100px">
                    <el-form-item label="首次攻击时间:">
                        <CustomDate :append-to-body="true" :auto="true" @getCustomTime="getCustomTime" @getDateData="getDateData"  @actualTime="actualTimeData" @timeUnit="timeUnitData" :empty="isReset" ref="customDate"></CustomDate>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params" style="width: 100%" label-position="left" label-width="65px">
                    <el-form-item label="IP归属地:">
                        <el-input
                            placeholder="请输入省份"
                            clearable
                            v-model.trim="get_params.province"
                            style="width: 100%;margin-bottom: 10px"
                            size="small">
                        </el-input>
                    </el-form-item>
                </el-form>
            </el-col>
        </SearchTop>
        <div class="list-container">
            <div class="ub ub-pj w100 isunfold">
                <div class="list-tips" style="height:24px;line-height:24px">统计</div>
                <div class="unfold" @click="handleUnfold">{{isunfold?'收起':'展开'}}<i :class="['el-icon-arrow-down',isunfold?'icon-select':'icon-select1']"></i>
                </div>
            </div>
            <div class="chart-row ub ub-pj" v-show="isunfold" style="margin-bottom:12px">
                <div class="chart-left">
                    <div class="chart-box">
                        <div class="ub ub-pj ub-ac">
                            <div class="chart-title">攻击地域统计</div>
                            <div class="ub ub-pe chart-btn" @click="changeMap">
                                <i class="el-icon-sort"></i>
                                <p>{{currentMap === '1' ? '世界展示' : '中国展示'}}</p>
                            </div>
                        </div>
                        <div class="ub">
                            <div class="chart-map" style="width: 55%">
                                <!--  v-loading="loading_map" -->
                                <div style="height:210px;" element-loading-background="transparent" v-loading="loading_map">
                                    <div
                                        v-if="!mapData.length"
                                        class="ub ub-f1 ub-ac ub-pc"
                                        style="height:100%;color:rgb(144, 147, 153);font-size:14px;">
                                        暂无数据
                                    </div>
                                    <map1 v-if="mapData.length>0" :mapType="mapType" :chartData="mapData"/>
                                </div>
                            </div>
                            <div style="width:45%;overflow: hidden!important;min-width: 300px">
                                <div class="ub ub-ac table-top w100">
                                </div>
                                <!-- v-loading="loading_map"  -->
                                <el-table class="map-table" :data="mapTableData" style="width: 300px;margin: 0 auto;overflow: hidden!important;" element-loading-background="transparent" v-loading="loading_map">
                                    <el-table-column :label="currentMap === '1' ? '省份' : '国家'" show-overflow-tooltip prop="name" width="80">
                                    </el-table-column>
                                    <el-table-column label="攻击量"  align="center" prop="value" width="130">
                                        <template slot-scope="{row}">
                                            {{row.value | addUnit}}
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="占比" width="90" align="center" prop="proportion">
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="chart-center">
                    <div class="chart-box">
                        <div class="ub ub-pj ub-ac">
                            <div class="chart-title">攻击者TOP20</div>
                        </div>
                        <div class="chart-map">
                            <!-- v-loading="loading_bar" -->
                            <div  style="height:210px;" v-loading="loading_bar" element-loading-background="transparent">
                                <div
                                    v-if="!attackTopData.length"
                                    class="ub ub-f1 ub-ac ub-pc"
                                    style="height:100%;color:rgb(144, 147, 153);font-size:14px;">
                                    暂无数据
                                </div>
                                <bar v-if="attackTopData.length>0" type="1" :chartData="attackTopData"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="table-area">
                <div class="ub ub-pj w100 mb-1 ub-ac">
                    <div class="list-tips">攻击者分析</div>
                </div>
                <el-table
                    ref="multipleTable"
                    v-loading="loading"
                    class='bigTable full-table'
                    :data="tableData"
                    border
                    stripe
                    tooltip-effect="dark"
                    :row-class-name="tableRowClassName"
                    @sort-change="changeOrder"
                    :height="tabHeight"
                    :row-style="{ height: '32px' }"
                    :header-row-style="{ height: '32px' }"
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="30" align="center"></el-table-column>
                    <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                    </el-table-column>
                    <el-table-column prop="city" label="攻击者IP归属地" show-overflow-tooltip>
                        <template slot-scope="{row}">
                            <p>{{row.county || '--' }} {{ row.province || '--'}} {{row.city || '--'}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column prop="srcIp" label="源IP" width="140">
                        <template slot-scope="scope">
                            <div>
                                <el-popover popper-class="add-search-attack" placement="bottom" title="" trigger="click">
                                    <div>
                                        <p
                                            @click="jumpAsset(scope.row.srcIp)"
                                            class="ub ub-ac click-btn"
                                        >
                                            <i class="iconfont icon-chaxunzichan" style="font-size:12px;color:#0052d9"></i>
                                            <span>查询资产</span>
                                        </p>
                                        <p
                                            style="margin-top:10px"
                                            @click="jumpThreat(scope.row.srcIp)"
                                            class="ub ub-ac click-btn"
                                        >
                                            <i class="iconfont icon-chaxunqingbao" style="font-size:12px;color:#0052d9"></i>
                                            <span>查询情报</span>
                                        </p>
                                    </div>
                                    <p
                                        style="cursor: pointer; text-decoration: underline; color: #0052d9;"
                                        slot="reference"
                                        v-html="scope.row.srcIp"
                                    ></p>
                                </el-popover>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="assetsNum" label="受害资产IP数量"  width="120" align="right">
                        <template slot-scope="{row}">
                            <span class="num-end" @click="handleSeeAsset(row)" style="color: #de7400;font-size: 12px;cursor: pointer;text-decoration: underline">{{row.assetsNum}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="reportTypeCN" label="攻击手段" width="160" show-overflow-tooltip>
                    </el-table-column>
                    <!--<el-table-column prop="alarmStageCN" label="攻击链阶段" width="160" show-overflow-tooltip>
                            </el-table-column>-->
                    <el-table-column prop="num" label="已处置事件/事件总量" width="160" align="right">
                        <template slot-scope="{row}">
                            <p style="font-size: 0;cursor: pointer" @click="handleSeeAlarm(row)">
                                <span class="num-end" style="color: #0052d9;font-size: 12px; text-decoration: underline">{{row.dealAlarmNum}}/</span>
                                <span class="num-sum" style="color: rgba(0,0,0,0.9);font-size: 12px; text-decoration: underline">{{row.num}}</span>
                            </p>
                        </template>
                    </el-table-column>
                    <el-table-column prop="startAttack" label="首次攻击时间"  width="160" sortable="custom">
                    </el-table-column>
                    <el-table-column prop="lastAttack" label="最新攻击时间"  width="160" sortable="custom">
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="80">
                        <template slot-scope="scope">
                            <el-button :disabled="scope.row.isStart == 1" size="small" type="text" @click="handleEdit(scope.row)" v-per="['alarm_attackAnalysis_order']">发起工单</el-button>
                        </template>
                    </el-table-column>

                </el-table>
                <pagination :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size"  style="padding-top:10px" @pagination="get_data" v-show="total_num>0"/>
            </div>
        </div>
        <el-dialog v-dialogDrag title="发起工单" :visible.sync="taskDialog" width="700px" custom-class="common-dialog">
            <el-form :model="taskForm" :rules="rules" ref="taskForm" label-position="top">
                <el-form-item label="工单名称：" prop="workOrderName" :label-width="formLabelWidth" >
                    <el-input placeholder="请输入工单名称" clearable v-model="taskForm.workOrderName" size="small"></el-input>
                </el-form-item>
                <el-form-item label="优先级：" prop="level" :label-width="formLabelWidth">
                    <el-select
                        placeholder="请选择"
                        style="width: 100%;"
                        v-model="taskForm.level"
                        size="small">
                        <el-option label="高" value="1"></el-option>
                        <el-option label="中" value="2"></el-option>
                        <el-option label="低" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="工单模板：" prop="workMouldId" :label-width="formLabelWidth">
                    <el-select
                        placeholder="请选择"
                        style="width: 100%;"
                        v-model="taskForm.workMouldId"
                        size="small">
                        <el-option v-for="(item) in allTemplate" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="width:100%;" label="工单描述：" :label-width="formLabelWidth">
                    <div style="width:100%;">
                        <vue-ueditor-wrap v-model="taskForm.workOrderContent" :config="myConfig"></vue-ueditor-wrap>
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="taskDialog=false" size="small" class="mr-1">取消</el-button>
                <Debounce :time='1500' :isDebounce="2">
                    <el-button :loading="isSubmitTask" type="primary" @click.native="submitTaskForm('taskForm')" size="small">确认</el-button>
                </Debounce>
            </span>
        </el-dialog>
        <el-dialog v-dialogDrag title="事件详情" :visible.sync="alarmDetailDialog" width="700px" custom-class="common-dialog">
            <div>
                <el-table
                    ref="multipleTable"
                    v-loading="loading_alarm"
                    class='bigTable full-table'
                    :data="alarmTableData"
                    border
                    stripe
                    tooltip-effect="dark">
                    <el-table-column align="center" type="index" width="50" :index="indexMethod_alarm" label="序号">
                    </el-table-column>
                    <el-table-column prop="id" label="事件ID" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="reportName" label="事件名称" width="160">
                    </el-table-column>
                    <el-table-column prop="reportLevel" label="事件等级"  width="100">
                        <template slot-scope="scope">
                            <div>
                                <span v-if="scope.row.reportLevel == 0" style="color:#00bcd4">低</span>
                                <span v-if="scope.row.reportLevel == 1" style="color:#00c7ff">中低</span>
                                <span v-if="scope.row.reportLevel == 2" style="color:#f2cd00">中</span>
                                <span v-if="scope.row.reportLevel == 3" style="color:#fc7f00">中高</span>
                                <span v-if="scope.row.reportLevel == 4" style="color:#fd0001">高</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="reportTypeName" label="事件类型" width="100" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="attackResult" label="攻击结果" width="100">
                    </el-table-column>
                    <el-table-column prop="reportStatus" label="事件状态" width="100">
                        <template slot-scope="scope">
                            <div>
                                <div v-if="scope.row.reportStatus == 0" class="ub ub-ac match-state one">
                                    <div></div>
                                    <div>待确认</div>
                                </div>
                                <div v-if="scope.row.reportStatus == 1" class="ub ub-ac match-state two">
                                    <div></div>
                                    <div>已确认</div>
                                </div>
                                <div v-if="scope.row.reportStatus == 2" class="ub ub-ac match-state three">
                                    <div></div>
                                    <div>已处理</div>
                                </div>
                                <div v-if="scope.row.reportStatus == 3" class="ub ub-ac match-state alarm four">
                                    <div></div>
                                    <div>已驳回</div>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="100">
                        <template slot-scope="scope">
                            <el-button :disabled="!(scope.row.isStart == 1)" icon="iconfont icon-fasong" title="发起工单" @click="handleEdit_alarm(scope.row)"></el-button>
                            <el-button title="状态变更" icon="iconfont icon-zhuangtaibiangeng" @click="handleChangeStatus(scope.row)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination
                        background
                        @size-change="handleSizeChange_alarm"
                        @current-change="handleCurrentChange_alarm"
                        :current-page="alarm_params.page"
                        :page-sizes="[10, 20, 30, 40,50]"
                        :page-size="alarm_params.size"
                        layout="slot,sizes, prev, pager, next"
                        prev-text="上一页"
                        next-text="下一页"
                        :total="alarm_total_num">
                        <span>共{{alarm_total__count}}条</span>
                    </el-pagination>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <cancelBtn title="取 消" @click="alarmDetailDialog = false" />
            </span>
        </el-dialog>
        <el-dialog v-dialogDrag title="事件状态变更" :visible.sync="stateDialog" width="700px" custom-class="common-dialog">
            <el-form :model="stateForm" :rules="rules" ref="stateForm">
                <el-form-item style="width:100%;" label="事件状态：" :label-width="formLabelWidth" prop="reportStatus">
                    <el-select size="small" style="width:660px" v-model="stateForm.reportStatus" placeholder="请选择">
                        <el-option label="已处置" value="2"></el-option>
                        <el-option label="已驳回" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="stateForm.reportStatus==2" style="width:100%;" label="处置结果：" :label-width="formLabelWidth">
                    <div class="ub ub-pc ub-f1">
                        <vue-ueditor-wrap v-model="stateForm.actionResults" :config="myConfig"></vue-ueditor-wrap>
                    </div>
                </el-form-item>
                <el-form-item v-if="stateForm.reportStatus==3" style="width:100%;" label="驳回理由：" :label-width="formLabelWidth">
                    <div class="ub ub-pc ub-f1">
                        <vue-ueditor-wrap v-model="stateForm.rejectReason" :config="myConfig"></vue-ueditor-wrap>
                    </div>
                </el-form-item>
                <el-form-item v-if="stateForm.reportStatus==3" style="width:100%;" label="分析过程：" :label-width="formLabelWidth">
                    <div class="ub ub-pc ub-f1">
                        <vue-ueditor-wrap v-model="stateForm.analyzePro" :config="myConfig"></vue-ueditor-wrap>
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <searchBtn title="确 定" @click="submitStateForm('stateForm')" />
                <cancelBtn title="取 消" @click="stateDialog = false" />
            </span>
        </el-dialog>
        <el-dialog v-dialogDrag title="资产列表" :visible.sync="assetDialog" width="700px" custom-class="common-dialog">
            <div>
                <el-table
                    ref="multipleTable"
                    v-loading="loading_asset"
                    class='bigTable full-table'
                    :data="assetTableData"
                    border
                    stripe
                    :row-style="{ height: '32px' }"
                    :header-row-style="{ height: '32px' }"
                    tooltip-effect="dark">
                    <el-table-column align="center" type="index" width="50" label="序号">
                    </el-table-column>
                    <el-table-column prop="deviceName" label="资产名称">
                        <template slot-scope="{row}">
                            {{row.deviceName || '--'}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="ip" label="资产IP">
                        <template slot-scope="{row}">
                            {{row.ip || '--'}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="deviceTypeName" label="资产类型">
                        <template slot-scope="{row}">
                            {{row.deviceTypeName || '--'}}
                        </template>
                    </el-table-column>
                </el-table>
                <pagination :total="asset_params.total" :page.sync="asset_params.page" :limit.sync="asset_params.size" @pagination="seeAsset" style="padding-top:10px"/>
            </div>
        </el-dialog>
        <!-- 新的资产详情 -->
        <list ref="alarmDetailRef" @parentBack="parentBack"></list>
    </div>
</template>

<script>
import { get_threat_search } from '@/server/intelligence/api.js'
import CustomDate from '@/pages/alarm/alarm_detail_drawer/index.vue'
import bar from './charts/assetAnalysis/bar'
import map1 from './charts/attackAnalysis/map'
// import funnel from './charts/attackAnalysis/funnel'
import VueUeditorWrap from '../../components/vue-ueditor-wrap.vue' // ES6 Module
import ueditorConfig from '../../mixins/ueditorConfig'
import list from './alarm_detail_drawer/alarm_list.vue'
import {
    getAttackTopBar,
    getAttackMap,
    getAttackStage,
    getAlarmType,
    getAttackList,
    getAssetTable,
    getAlarmTable,
    getAlarmTemplate,
    getAssetTemplate,
    addWorkOrder,
    changeStatus,
    attackAnalysisAdd_workTask
} from '../../server/alarm/define.js'
export default {
    name: 'AssetAnalysis',
    components: {
        bar,
        map1,
        VueUeditorWrap,
        list,
        CustomDate
    },
    mixins: [ueditorConfig],
    data() {
        return {
            isSubmitTask: false,
            tabHeight: document.body.clientHeight - 580,
            isReset: false,
            isunfold: true,
            pickerOptions: {
                shortcuts: [{
                    text: '1小时内',
                    onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    text: '1天内',
                    onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    text: '7天内',
                    onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    text: '本月',
                    onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setDate(1)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                        picker.$emit('pick', [start, end])
                    }
                }]
            },

            isOpen: true,

            mapData: [],
            currentMap: '1',
            mapType: 'china',
            loading_map: false,
            loading_bar: false,
            loading_stage: false,
            attackTopData: [],
            stageData: [],
            meargeData: [],
            formLabelWidth: '100px',
            loading: false,
            loading_alarm: false,
            total_num: 0,
            alarm_total_num: 0,
            alarm_total__count: 0,
            multipleSelection: [],
            tableData: [],
            alarmTableData: [],
            mapTableData: [],
            sayTimes: [],
            get_params: {
                id: '',
                page: 1,
                size: 20,
                sortField: 'num',
                order: 'DESC',
                srcIp: '',
                desIp: '',
                province: '',
                reportType: ''
            },
            alarm_params: {
                id: '',
                page: 1,
                size: 10
            },
            alarmTypeList: [],
            taskDialog: false,
            recordId: '',
            record_srcIp: '',
            taskForm: {
                workOrderName: '',
                workMouldId: '',
                level: '',
                workOrderContent: ''
            },
            stateForm: {
                reportStatus: '2',
                actionResults: '',
                analyzePro: '',
                rejectReason: ''
            },
            stateDialog: false,
            statusId: '',
            alarmDetailDialog: false,
            assetDialog: false,
            loading_asset: false,
            assetTableData: [],
            attackTemplate: [],
            alarmTemplate: [],
            rules: {
                reportName: [{
                    required: true,
                    message: '请输入名称',
                    trigger: 'blur'
                }],
                reportType: [{
                    required: true,
                    message: '请选择事件类型',
                    trigger: 'change'
                }],
                status: [{
                    required: true,
                    message: '请选择变更状态',
                    trigger: 'change'
                }],
                desIp: [{
                    required: true,
                    message: '请输入正确的ip',
                    trigger: 'blur'
                }],
                srcIp: [{
                    required: false,
                    message: '请输入正确的ip',
                    trigger: 'blur'
                }],
                reportLevel: [{
                    required: true,
                    message: '请选择事件等级',
                    trigger: 'change'
                }],

                workOrderName: [{
                    required: true,
                    message: '请输入名称',
                    trigger: 'blur'
                }],
                level: [{
                    required: true,
                    message: '请选择优先级',
                    trigger: 'change'
                }],
                workMouldId: [{
                    required: true,
                    message: '请选择工单模板',
                    trigger: 'change'
                }]
            },
            orderType: '',
            allTemplate: [],
            asset_params: {
                page: 1,
                size: 20,
                total: 0,
                srcIp: ''
            },
            kaiguan: false
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.getBarTop()
            this.getMap()
            this.getStage()
            this.getAlarmList()
            this.get_attack_template()
            this.get_data()
        })
    },
    watch: {
        taskDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.taskForm.resetFields()
                    this.taskForm = {
                        workOrderName: '',
                        workMouldId: '',
                        level: '',
                        workOrderContent: ''
                    }
                }
            }
        },
        stateDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.stateForm.resetFields()
                    this.stateForm.rejectReason = ''
                    this.stateForm.analyzePro = ''
                    this.stateForm.actionResults = ''
                }
            }
        },
        assetDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.asset_params = {
                        page: 1,
                        size: 20,
                        total: 0,
                        srcIp: ''
                    }
                }
            }
        },
        isunfold(val) {
            if (val) {
                if (this.kaiguan == true) {
                    this.tabHeight = document.body.clientHeight - 640
                } else {
                    this.tabHeight = document.body.clientHeight - 580
                }
            } else {
                if (this.kaiguan == true) {
                    this.tabHeight = document.body.clientHeight - 348
                } else {
                    this.tabHeight = document.body.clientHeight - 288
                }
            }
        },
        kaiguan(val) {
            if (val) {
                if (this.isunfold == false) {
                    this.tabHeight = document.body.clientHeight - 348
                } else {
                    this.tabHeight = document.body.clientHeight - 640
                }
            } else {
                if (this.isunfold == false) {
                    this.tabHeight = document.body.clientHeight - 288
                } else {
                    this.tabHeight = document.body.clientHeight - 580
                }
            }
        }
    },
    filters: {
        addUnit(val) {
            if (val > 9999) {
                return (Math.floor(val / 1000) / 10) + 'w'
            } else {
                return val
            }
        }
    },
    methods: {
        tableRowClassName({ row, rowIndex }) {
            console.log(rowIndex)
            if (rowIndex % 2) {
                return 'table-row2'
            } else {
                return 'table-row1'
            }
        },
        isOpen1(val) {
            console.log(val)
            console.log(this.isunfold)
            this.kaiguan = val
        },
        jumpAsset(value) {
            this.$setsessionStorage('currentPath', '/assets/assets_asset_info?ip=' + value)
            window.open(window.location.origin + '/#' + '/assets/assets_asset_info?ip=' + value)
            // let router = this.$router.resolve({
            //     path: '/assets/assets_asset_info',
            //     query: {
            //         ip: value,
            //         newWindow: 'newWindow'
            //     }
            // })
            // window.open(router.href)
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
        handleSizeChangeAsset(val) {
            this.asset_params.size = val
            this.seeAsset()
        },
        handleCurrentChangeAsset(val) {
            this.asset_params.page = val
            this.seeAsset()
        },
        actualTimeData(val) {
            this.actualTime = val
        },
        timeUnitData(val) {
            this.timeUnit = val
        },
        getDateData(date, mode, useDate, useIndex) {
            this.dateData = date
            this.dateMode = mode
            console.log('getDateData----dateData', this.dateData)
            this.useDate = useDate
            this.useIndex = useIndex
        },
        getCustomTime(val, isChartTime) {
            this.sayTimes = val
            console.log('时间', val)
        },
        parentBack() {
            this.get_data()
        },
        handleUnfold() {
            this.isunfold = !this.isunfold
        },
        reset() {
            this.get_params = {
                id: '',
                page: 1,
                size: 20,
                sortField: 'num',
                order: 'DESC',
                srcIp: '',
                desIp: '',
                province: '',
                reportType: ''
            }
            this.sayTimes = null
            this.isReset = true
            setTimeout(() => {
                this.isReset = false
            }, 300)
            this.get_params.page = 1
            this.get_data()
        },
        changeMap() {
            if (this.currentMap === '1') {
                this.currentMap = '2'
                this.getMap()
                this.mapType = 'world'
            } else if (this.currentMap === '2') {
                this.currentMap = '1'
                this.getMap()
                this.mapType = 'china'
            }
        },
        changeOrder(val) {
            console.log(val)
            let obj = {
                ascending: 'ASC',
                descending: 'DESC'
            }
            this.get_params.sortField = val.prop
            this.get_params.order = (val.order && obj[val.order])
            val.order === null && (this.get_params.order = 'DESC') && (this.get_params.sortField = 'num')
            this.get_data()
        },
        getMap() {
            this.mapData = []
            this.mapTableData = []
            this.loading_map = true
            let data = {
                fromType: this.currentMap === '1' ? 1 : 0
            }
            getAttackMap(data).then(res => {
                this.loading_map = false
                console.log('地图', res)
                if (res.length) {
                    res.forEach(item => {
                        let obj = {}
                        if (item.county) {
                            item.county = item.county == 'United States of America' ? 'United States' : item.county
                        }
                        obj.name = item.province || item.county
                        obj.value = item.num
                        obj.total = item.total
                        obj.proportion = item.proportion
                        this.mapData.push(obj)
                        this.mapTableData.push(obj)
                    })
                }
                this.mapTableData.splice(6)
            }).catch(err => {
                this.loading_map = false
                console.log(err + 'err')
            })
        },
        getBarTop() {
            this.attackTopData = []
            this.loading_bar = true
            getAttackTopBar({}).then(res => {
                console.log('top20', res)
                this.loading_bar = false
                if (res.length) {
                    res.forEach(item => {
                        let obj = {}
                        obj.name = item.ip
                        obj.value = item.num
                        this.attackTopData.push(obj)
                    })
                }
            }).catch(err => {
                this.loading_bar = false
                console.log(err + 'err')
            })
        },
        getStage() {
            this.stageData = []
            this.loading_stage = true
            getAttackStage({}).then(res => {
                console.log('漏斗图', res)
                this.loading_stage = false
                if (res.length) {
                    res.forEach(item => {
                        let obj = {}
                        obj.name = item.reportType
                        obj.value = item.num
                        this.stageData.push(obj)
                    })
                }
            }).catch(err => {
                this.loading_stage = false
                console.log(err + 'err')
            })
        },
        getAlarmList() {
            this.alarmTypeList = []
            getAlarmType({}).then(res => {
                console.log(res, '攻击行为')
                this.alarmTypeList = res
            }).catch(err => {
                console.log(err + 'err')
            })
        },
        get_alarm_template(row) {
            this.alarmTemplate = []
            let obj = {
                id: row.id
            }
            getAlarmTemplate(obj).then(res => {
                console.log('事件模板', res)
                this.alarmTemplate = res
                this.allTemplate = this.$deepCopy(this.alarmTemplate)
            }).catch(err => {
                console.log(err)
            })
        },
        get_attack_template(row) {
            this.attackTemplate = []
            let obj = {
                id: 4
            }
            getAssetTemplate(obj).then(res => {
                console.log('攻击者模板', res)
                this.attackTemplate = res
            }).catch(err => {
                console.log(err)
            })
        },
        get_data() {
            this.tableData = []
            this.loading = true
            let data = {
                queryData: {
                    page: this.get_params.page,
                    pageSize: this.get_params.size
                },
                paramsData: {
                    sortField: this.get_params.sortField,
                    order: this.get_params.order,
                    srcIp: this.get_params.srcIp,
                    desIp: this.get_params.desIp,
                    startFirstTime: this.sayTimes && this.sayTimes.length > 0 ? this.sayTimes[0] : '',
                    endFirstTime: this.sayTimes && this.sayTimes.length > 0 ? this.sayTimes[1] : '',
                    province: this.get_params.province,
                    reportType: this.get_params.reportType
                }
            }
            getAttackList(data).then(res => {
                this.loading = false
                console.log('列表', res)
                this.tableData = []
                let total = res.total
                /* 动态设置总页数*/
                // if (this.get_params.page < 4 && total > 7 * this.get_params.size) {
                //     this.total_num = 7 * this.get_params.size
                // } else if (this.get_params.page >= 4 && (total > (this.get_params.page + 3) * this.get_params.size)) {
                //     this.total_num = (this.get_params.page + 3) * this.get_params.size
                // } else {
                this.total_num = res.total
                // }
                let content = res.records
                if (content.length) {
                    content.forEach(item => {
                        let obj = {}
                        obj.alarmStage = item.alarmStage
                        obj.assetsNum = item.assetsNum
                        obj.city = item.city
                        obj.county = item.county
                        obj.countyCode = item.countyCode
                        obj.dealAlarmNum = item.dealAlarmNum
                        obj.startAttack = item.startAttack
                        obj.id = item.id
                        obj.lastAttack = item.lastAttack
                        obj.latitude = item.latitude
                        obj.longitude = item.longitude
                        obj.num = item.num
                        obj.province = item.province
                        obj.reportType = item.reportType
                        obj.reportTypeCN = item.reportTypeCN || '--'
                        obj.srcIp = item.srcIp
                        obj.alarmStageCN = item.alarmStageCN || '--'
                        obj.isStart = item.isStart

                        this.tableData.push(obj)
                    })
                }
            }).catch(err => {
                this.loading = false
                console.log(err + 'err')
            })
        },
        submitTaskForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.isSubmitTask = true
                    let data = {
                        queryData: {},
                        paramsData: {
                            sourceId: this.recordId,
                            workOrderName: this.taskForm.workOrderName,
                            level: this.taskForm.level,
                            workMouldId: this.taskForm.workMouldId,
                            workOrderContent: this.taskForm.workOrderContent,
                            type: this.orderType
                        }
                    }
                    attackAnalysisAdd_workTask(data).then(res => {
                        this.isSubmitTask = false
                        this.taskDialog = false
                        console.log('发起工单成功')
                        this.$message({
                            message: '发起工单成功',
                            type: 'success'
                        })
                        setTimeout(() => {
                            this.get_data()
                            if (this.orderType == '1') {
                                this.getAlarmTableList()
                            }
                        }, 1500)
                    }).catch(error => {
                        this.isSubmitTask = false
                        this.taskDialog = false
                        console.log(error + 'error')
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        submitStateForm() {
            let data = {
                ids: [this.statusId],
                reportStatus: this.stateForm.reportStatus,
                analyzePro: this.stateForm.analyzePro,
                rejectReason: this.stateForm.rejectReason,
                actionResults: this.stateForm.actionResults
            }
            changeStatus(data).then(res => {
                this.stateDialog = false
                this.$message({
                    message: '状态变更成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.getAlarmTableList()
                }, 1500)
            }).catch(err => {
                this.stateDialog = false
                console.log(err)
            })
        },
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        searchCheck() {
            this.get_params.page = 1
            this.get_data()
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
            console.log(val)
            this.multipleSelection = val
        },
        indexMethod_alarm(index) {
            return (this.alarm_params.page - 1) * this.alarm_params.size + index + 1
        },
        handleSizeChange_alarm(val) {
            this.alarm_params.size = val
            this.getAlarmTableList()
        },
        handleCurrentChange_alarm(val) {
            this.alarm_params.page = val
            this.getAlarmTableList()
        },
        handleSeeAsset(row) {
            this.assetTableData = []
            this.assetDialog = true
            this.loading_asset = true
            // let data = {
            //     srcIp: row.srcIp
            // }
            // getAssetTable(data).then(res => {
            //     console.log(res, '资产')
            //     this.loading_asset = false
            //     this.assetTableData = this.$deepCopy(res)
            // }).catch(err => {
            //     this.loading_asset = false
            //     console.log(err, 'err')
            // })
            this.asset_params.srcIp = row.srcIp
            this.seeAsset()
        },
        seeAsset() {
            let data = {
                paramsData: {
                    srcIp: this.asset_params.srcIp
                },
                queryData: {
                    page: this.asset_params.page,
                    pageSize: this.asset_params.size
                }
            }
            getAssetTable(data).then(res => {
                console.log(res, '资产')
                this.loading_asset = false
                this.asset_params.totle = res.total
                this.assetTableData = res.records
            }).catch(err => {
                this.loading_asset = false
                console.log(err, 'err')
            })
        },
        handleSeeAlarm(row) {
            // this.alarmDetailDialog = true
            this.record_srcIp = row.srcIp
            // this.getAlarmTableList()
            this.$refs.alarmDetailRef.init(row.srcIp, '攻击')
        },
        // 弃用
        getAlarmTableList() {
            this.alarmTableData = []
            this.loading_alarm = true
            let data = {
                paramsData: {
                    srcIp: this.record_srcIp
                },
                queryData: {
                    page: this.alarm_params.page,
                    pageSize: this.alarm_params.size
                }
            }
            getAlarmTable(data).then(res => {
                console.log(res, '告警')
                this.loading_alarm = false
                this.alarm_total__count = res.totalElements
                let total = res.totalElements
                /* 动态设置总页数*/
                if (this.alarm_params.page < 4 && total > 7 * this.alarm_params.size) {
                    this.alarm_total_num = 7 * this.alarm_params.size
                } else if (this.alarm_params.page >= 4 && (total > (this.alarm_params.page + 3) * this.alarm_params.size)) {
                    this.alarm_total_num = (this.alarm_params.page + 3) * this.alarm_params.size
                } else {
                    this.alarm_total_num = res.totalElements
                }
                let content = res.content
                if (content.length) {
                    content.forEach(item => {
                        let obj = {}
                        obj.id = item.id
                        obj.reportFrom = item.reportFrom
                        obj.reportTypeName = item.reportTypeName
                        obj.reportLevel = item.reportLevel
                        obj.reportName = item.reportName
                        obj.reportStatus = item.reportStatus
                        obj.attackResult = item.attackResult
                        obj.isStart = item.isStart

                        this.alarmTableData.push(obj)
                    })
                }
            }).catch(err => {
                this.loading_alarm = false
                console.log(err, 'err')
            })
        },

        handleEdit(row) {
            this.recordId = row.srcIp
            this.orderType = 4
            this.allTemplate = this.$deepCopy(this.attackTemplate)
            this.taskDialog = true
        },
        async handleEdit_alarm(row) {
            console.log(row)
            this.recordId = row.id
            this.orderType = 1
            await this.get_alarm_template(row)
            this.taskDialog = true
        },
        handleChangeStatus(row) {
            this.stateDialog = true
            this.statusId = row.id
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
        color: #1cd7fa;
    }
    span.val {
        color: #1cd7fa;
    }
}
.click-btn:hover {
    // background: #0d4873;
}
.reset-btn{
    width: 80px;
    height: 30px;
    background-color: #041f38;
    box-shadow: inset 0px 0px 10px 0px
    rgba(0, 167, 245, 0.97);
    border: solid 1px #39caf3;
    font-size: 12px;
    line-height: 15px;
    letter-spacing: 1px;
    color: #a2ece8;
    border-radius: 5px;
    margin-right: 10px;
    cursor: pointer;
    box-sizing: border-box;
}
.isunfold{
    height:24px !important;
    border-radius: 2px;
    background-color: rgba(56, 125, 238,.1);
    margin-bottom:10px;
    line-height:24px;
    .unfold{
        letter-spacing: 1px;
        color: #0052d9;
        cursor: pointer;
        font-size:12px;
        i{
            font-size:14px;
        }
        .icon-select::before {
            display:inline-block;
            transform: rotate(-180deg);
            transition: .4s;
            transform-origin: center;
        }
        .icon-select1::before {
            display:inline-block;
            transition: .4s;
            transform-origin: center;
        }
    }
}
.chart-row {
    font-size: 0;
    .chart-left {
        width: 49.5%;
    }
    .chart-center {
        width: 49.5%;
    }
    .chart-right {
        width: 22%;
    }
}

.chart-box {
    position: relative;
    height: 280px;
    overflow: hidden;
    background-color: rgba(56, 125, 238, 0.05);
    border-radius: 6px;

    & > span {
        position: absolute;
        left: -1px;
        top: -1px;
        width: 10px;
        height: 10px;
        background: url('/static/img/icon-jiao.png') no-repeat;

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

    .chart-title {
        margin: 12px 0 10px 0px;
        height: 24px;
        line-height: 24px;
        font-size: 12px;
        padding-left: 10px;
        font-weight: 500;
        color: rgba(0,0,0,0.9);
        position: relative;
    }
    .chart-btn {
        min-width: 60px;
        height: 24px;
        line-height: 24px;
        font-size: 12px;
        margin: 12px 10px 10px 0;
        color: rgba(0,0,0,0.9);
        cursor: pointer;
        i {
            transform: rotate(90deg);
            color:#387dee;
        }
        p {
            font-size: 12px;
            margin-left: 10px;
        }
    }
    .chart-btn.select {
        i {
            transform: rotate(0deg);
        }
    }
}
.event  ::v-deep  .el-range-input {
    background-color: rgba(0, 0, 0, 0);
    color: #fff;
}

.event  ::v-deep  .el-range-separator {
    color: #fff;
}
.search-box {
    margin-bottom:10px;
    .search-more {
        display: flex;
        justify-content: space-between;
        .has-more{
            height: 70px !important;
            overflow-y: hidden;
        }
        .search-more-left {
            display: flex;
            flex-wrap: wrap;
            div {
                // padding: 5px 0;
                margin-right: 20px;
                ::v-deep .el-select {
                    width: 253px;
                }
                ::v-deep .el-input__inner {
                    height: 30px;
                    line-height: 30px;
                }
            }
        }
        .search-text {
            display: block;
            width: 114px;
            color:#03e9ff;
            cursor: pointer;
            font-size:12px;
            height: 20px;
            margin-top: 10px;
            margin-right:20px;
            text-align: right;
        }
    }
    & ::v-deep .el-form-item__label {
        line-height: 40px !important;
    }
    & ::v-deep .el-form-item__content {
        line-height: 40px !important;
    }

}
.event ::v-deep .el-divider {
    background-color: #50b0ff;
    opacity: 0.5;
    margin-top: 0;
}
</style>
<style>
.add-search-attack.el-popover{
    background: #fff;
    /* box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.59) inset; */
    border: solid 1px #dcdcdc;
    color: rgba(0,0,0,.9);
}
.map-table {
    background: rgba(0, 0, 0, 0)!important;
    min-height: 0!important;
}
.map-table .el-table__empty-block {
    min-height: 30px !important;
    height: 30px !important;
    width: auto !important;
}
.map-table .el-table__empty-text {
    height: 30px !important;
    line-height: 30px !important;
}

.map-table th,
.map-table tr {
    background: rgba(0, 0, 0, 0)!important;
}

.map-table td,
.map-table th.is-leaf {
    /* border-color: #c5c5c5!important; */
    color: #fff!important;
    padding: 1px 0 !important;
}

.el-table--border::after,
.el-table--group::after,
.el-table::before {
    background-color: #c5c5c5!important;
}

.map-table.el-table--enable-row-hover .el-table__body tr:hover>td {
    /* background: #c5c5c5!important; */
}

.map-table .cell {
    color: rgba(0,0,0,.9)!important;
}
.map-table th .cell {
    color: #0052d9!important;
}
</style>
