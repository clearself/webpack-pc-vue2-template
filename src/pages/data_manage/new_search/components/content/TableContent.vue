<template>
    <div class="ub w100" style="margin-top: 10px;min-height: 400px;">
        <div class="expert-left" :class="{ 'left-fold': leftFold }">
            <i class="fold iconfont icon-zhedie" @click="leftFold = !leftFold"></i>
            <div v-show="!leftFold">
                <div v-if="list.length > 0" class="left-title ub ub-ac">
                    <!-- <div class="left-mark mr-1"></div> -->
                    <div class="list-tips active">已选字段</div>
                </div>
                <div v-if="list.length > 0" class="left-tip">
                    <i class="el-icon-info"></i>
                    <span>拖拽字段进行排序</span>
                </div>
                <div :style="{ height: heigLeft, 'overflow-y': 'auto' }">
                    <div v-if="list.length > 0" class="w100 drag drag-top mb-1" style="">
                        <draggable
                            class="list-group w100"
                            tag="ul"
                            :disabled="!isCanOption"
                            filter=".forbid"
                            v-model="innerList"
                            v-bind="{ scroll: true, animation: 150 }"
                            :move="onMove"
                            @end="onEnd"
                        >
                            <transition-group>
                                <li
                                    class="list-group-item w100"
                                    :class="element.fieldName === 'alarmTime' || element.fieldName === 'message' ? 'forbid' : ''"
                                    v-for="element in list"
                                    :key="element.fieldName"
                                >
                                    <div class="ub ub-ac list-title">
                                        <!-- <div class="vertical-line active"></div> -->
                                        <div class="open-box">
                                            <i
                                                v-if="element.fieldName !== 'alarmTime' && element.fieldName !== 'message' && element.fieldName !== 'isAlarm'"
                                                :class="element.show ? 'el-icon-arrow-down' : 'el-icon-arrow-right'"
                                                @click="top10Show(element)"
                                                aria-hidden="true"
                                            ></i>
                                        </div>
                                        <div class="ub ub-f1 line1" style="font-size:12px;">{{ element.name }}</div>
                                        <div class="close-box" @click="$parent.delFileds(element)"><i class="el-icon-close"></i></div>
                                        <!-- <span class="fields-ver-line"></span> -->
                                    </div>
                                    <div v-if="element.show" class="list-inner"><RankChart :rank-data="rankData" :top-loading="topLoading" :element-data="element" /></div>
                                </li>
                            </transition-group>
                        </draggable>
                    </div>
                    <div class="left-title ub" v-if="listCanSelect.length > 0">
                        <div class="left-mark mr-1" style="background-color: #dcdcdc"></div>
                        <div>可选字段</div>
                    </div>
                    <el-input
                        v-if="listCanSelect.length > 0"
                        placeholder="请输入字段"
                        style="width: 180px;margin: 10px 0 0 0px"
                        size="small"
                        v-model="filterCanFields"
                        clearable
                    >
                        <i slot="suffix" class="iconfont icon-sousuo"></i>
                    </el-input>
                    <div class="w100 drag" style="margin-top: 10px;margin-bottom: 40px;">
                        <ul>
                            <li
                                class="list-group-item1 w100"
                                v-for="(element, index) in filterCanFields.trim() ? listCanSelect.filter(it => it.name.includes(filterCanFields.trim())) : listCanSelect"
                                :key="index"
                            >
                                <div class="ub ub-ac list-title">
                                    <!-- <div class="vertical-line"></div> -->
                                    <div class="open-box">
                                        <i
                                            v-if="element.fieldName !== 'alarmTime' && element.fieldName !== 'message' && element.fieldName !== 'isAlarm'"
                                            :class="element.show ? 'el-icon-arrow-down' : 'el-icon-arrow-right'"
                                            @click="top10Show(element)"
                                            aria-hidden="true"
                                        ></i>
                                    </div>
                                    <div class="ub ub-f1 line1" style="font-size:12px;">{{ element.name }}</div>
                                    <div class="close-box" @click="$parent.addFileds(element)"><i class="el-icon-plus"></i></div>
                                </div>
                                <div v-if="element.show" class="list-inner"><RankChart :rank-data="rankData" :top-loading="topLoading" :element-data="element" /></div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="ub ub-f1 ub-ver expert-right" style="overflow-x:hidden;">
            <div class="ub ub-pj w100 mb-1">
                <div class="list-tips active">日志查询</div>
                <!-- <div class="pagination pag" style="padding: 0px 0px 10px 0 !important;">
                    <el-pagination
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="$parent.get_params.page"
                        :page-sizes="[30, 50, 100]"
                        :page-size="$parent.get_params.size"
                        layout="slot,sizes, prev, next"
                        prev-text="＜ 上一页"
                        next-text="下一页 ＞"
                    ></el-pagination>
                </div> -->
                <div style="flex:1;text-align:right">
                    <el-button v-per="['data_log_start']" size="small" icon="iconfont icon-fasongyoujian1" type="primary" @click="handleAlarm" style="border-radius: 4px;">发起事件</el-button>
                    <el-button v-per="['data_log_storage']" size="small" icon="iconfont icon-sousuotiaojianbaocun" type="primary" @click="handleSaveLogIds" style="background:#00a870;border-radius: 4px;">暂 存</el-button>
                    <el-button v-per="['data_log_storage_list']" size="small" icon="iconfont icon-zancunliebiao" type="primary" @click="handleSaveList" style="background:#00a870;border-radius: 4px;">暂存列表</el-button>
                    <el-button v-per="['data_log_pcap']" size="small" icon="iconfont icon-tianjia" type="primary" @click="createAllPackTask" style="border-radius: 4px;">创建PCAP包任务</el-button>
                    <el-dropdown trigger="click" @command="handleCommand">
                        <span class="el-dropdown-link">
                            <el-button v-per="['data_log_export']" style="margin-left: 10px;border-radius: 4px;" :loading="downLoading" size="small" icon="iconfont icon-daochu" type="primary">导 出</el-button>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="0">导出json</el-dropdown-item>
                            <el-dropdown-item command="1">导出excel</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-button v-per="['data_log_highlight']" style="margin-left: 10px;background:#b500ff;border-radius: 4px;" size="small" icon="iconfont icon-shezhi" type="primary" @click="$parent.highlightDialog = true">配置高亮词</el-button>

                    <!--<addBtn icon="el-icon-download" title="下载任务" @click="downloadFun" />-->
                    <!--<addBtn style="margin-left:10px;" icon="el-icon-box" title="创建PCAP包任务" @click="createAllPackTask" />-->
                </div>
            </div>
            <div :style="{ height: heigRight, 'overflow-y': 'auto' }">
                <el-table
                    :row-class-name="tableRowClassName"
                    style="width:100%;"
                    ref="multipleTable"
                    @expand-change="handleExpand"
                    class="bigTable expert-table"
                    :row-key="
                        row => {
                            return row.id
                        }
                    "
                    :data="tableData"
                    border
                    stripe
                    tooltip-effect="dark"
                    :expand-row-keys="expandRowKeys"
                    :row-style="{ height: '32px' }"
                    :header-row-style="{ height: '32px' }"
                    @sort-change="changeTableSort"
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column align="center" :reserve-selection="true" :selectable="checkSelectable" type="selection" width="30"></el-table-column>
                    <!-- <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号"></el-table-column> -->
                    <el-table-column type="expand" class-name="expand-col" width="40">
                        <template slot-scope="{ row }">
                            <el-tabs>
                                <el-tab-pane label="键/值" style="padding:0 20px;overflow:hidden;" class="demo-table-left">
                                    <div class="table-expand" style="max-height:500px;overflow-y:auto;">
                                        <el-form label-position="left" label-width="120px">
                                            <el-form-item :label="item.name" v-for="(item, index) in expandData" :key="index + row.id">
                                                <div style="max-width: 100%;text-align: justify;word-break:break-all">
                                                    <el-popover popper-class="add-search" placement="bottom" title="" trigger="click">
                                                        <div>
                                                            <p
                                                                v-if="item.fieldName !== 'message' && item.fieldName !== 'dt'"
                                                                class="ub ub-ac click-btn"
                                                                @click="
                                                                    equalVal({
                                                                        key: item.fieldName,
                                                                        attrType: item.type,
                                                                        name: item.name,
                                                                        value: item.value
                                                                    })
                                                                "
                                                            >
                                                                <i class="el-icon-plus"></i>
                                                                <span>{{ item.name }}</span>
                                                                <span>=</span>
                                                                <span class="val" style="max-width: 100%">{{ item.value }}</span>
                                                            </p>
                                                            <p
                                                                v-if="item.fieldName !== 'message' && item.fieldName !== 'dt'"
                                                                class="ub ub-ac click-btn"
                                                                style="margin: 10px 0"
                                                                @click="
                                                                    unequalVal({
                                                                        key: item.fieldName,
                                                                        attrType: item.type,
                                                                        name: item.name,
                                                                        value: item.value
                                                                    })
                                                                "
                                                            >
                                                                <i class="el-icon-plus"></i>
                                                                <span>{{ item.name }}</span>
                                                                <span>!=</span>
                                                                <span class="val" style="max-width: 100%">{{ item.value }}</span>
                                                            </p>
                                                            <p
                                                                @click="item.visible = false"
                                                                class="ub ub-ac click-btn"
                                                                v-clipboard:copy="item.value"
                                                                v-clipboard:success="firstCopySuccess"
                                                                v-clipboard:error="firstCopyError"
                                                            >
                                                                <i class="el-icon-document-copy"></i>
                                                                <span>复制</span>
                                                            </p>
                                                            <p
                                                                style="margin-top:10px"
                                                                v-if="['ip'].some(keyWord => item.fieldName.toLowerCase().includes(keyWord))"
                                                                @click="jumpAsset(item, item.value)"
                                                                class="ub ub-ac click-btn"
                                                            >
                                                                <i class="el-icon-s-promotion" style="font-size:12px"></i>
                                                                <span>查询资产</span>
                                                            </p>
                                                            <p
                                                                style="margin-top:10px"
                                                                v-if="['ip', 'url', '域名'].some(keyWord => item.fieldName.toLowerCase().includes(keyWord))"
                                                                @click="jumpThreat(item, item.value)"
                                                                class="ub ub-ac click-btn"
                                                            >
                                                                <i class="iconfont icon-chaxunqingbao" style="font-size:12px"></i>
                                                                <span>查询情报</span>
                                                            </p>
                                                        </div>
                                                        <span
                                                            class="highlighted-inner"
                                                            :style="
                                                                ['ip', 'url', '域名'].some(keyWord => item.fieldName.toLowerCase().includes(keyWord))
                                                                    ? 'cursor: pointer; text-decoration: underline; color: #0052D9;'
                                                                    : 'cursor: default; text-decoration: unset; color: #191919;font-size:12px'
                                                            "
                                                            slot="reference"
                                                        >
                                                            <i
                                                                v-if="item.fieldName == 'srcIp' && item.value && item.srcIpIsSpite != '内网'"
                                                                class="iconfont"
                                                                :style="{
                                                                    color: [
                                                                        { type: '安全', color: '#00ff48' },
                                                                        { type: '恶意', color: '#ff0000' },
                                                                        { type: '未知', color: '#7c7c7c' }
                                                                    ].filter(co => co.type == item.srcIpIsSpite)[0].color
                                                                }"
                                                                :title="item.srcIpIsSpite"
                                                                :class="{
                                                                    'icon-liebiaonei-anquan': item.srcIpIsSpite == '安全',
                                                                    'icon-liebiaonei-buanquan': item.srcIpIsSpite == '恶意',
                                                                    'icon-liebiaonei-weizhi': item.srcIpIsSpite == '未知'
                                                                }"
                                                            ></i>
                                                            <i
                                                                v-if="item.fieldName == 'desIp' && item.value && item.desIpIsSpite != '内网'"
                                                                class="iconfont"
                                                                :style="{
                                                                    color: [
                                                                        { type: '安全', color: '#00ff48' },
                                                                        { type: '恶意', color: '#ff0000' },
                                                                        { type: '未知', color: '#7c7c7c' }
                                                                    ].filter(co => co.type == item.desIpIsSpite)[0].color
                                                                }"
                                                                :title="item.desIpIsSpite"
                                                                :class="{
                                                                    'icon-liebiaonei-anquan': item.desIpIsSpite == '安全',
                                                                    'icon-liebiaonei-buanquan': item.desIpIsSpite == '恶意',
                                                                    'icon-liebiaonei-weizhi': item.desIpIsSpite == '未知'
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
                                <el-tab-pane label="JSON" style="padding:0 20px;overflow:hidden;">
                                    <div class="table-expand" style="font-size:12px;max-width: 100%;text-align: justify;word-break:break-all;max-height:500px;overflow-y:auto;">
                                        <json-viewer :value="expandJsonData" :expand-depth="5" copyable theme="my-awesome-json-theme" sort></json-viewer>
                                    </div>
                                </el-tab-pane>

                                <el-tab-pane v-if="row.nftData === 2" label="PCAP包" style="padding:0 20px;overflow:hidden;max-width: 1300px">
                                    <div class="table-expand pcap-detail" style="font-size:12px;text-align: justify;word-break:break-all;max-height:500px;overflow-y:auto;">
                                        <div style="margin-bottom: 10px">
                                            <addBtn
                                                class="pcap-btn"
                                                style="margin-right: 10px"
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
                                        <el-tabs v-model="tabsValue" type="card" style="height:100%;">
                                            <el-tab-pane :key="index" v-for="(item, index) in pacpData" :label="item.name" :name="item.name" style="height:100%;">
                                                <div v-if="item.content.length > 0" class="w100 left-content">
                                                    <div v-for="(_item, _index) in item.content" :key="_index" class="ub w100 ub-ver">
                                                        <div v-if="_item.type === 'req'" class="ub ub-f1 request" style="width:100%;">
                                                            <pre>{{ _item.payload }}</pre>
                                                        </div>
                                                        <div v-if="_item.type === 'res'" class="ub ub-f1 response" style="width:100%;">
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
                                                    attrType: item.type,
                                                    name: item.name,
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
                                            style="margin: 10px 0"
                                            @click="
                                                unequalVal({
                                                    key: item.fieldName,
                                                    attrType: item.type,
                                                    name: item.name,
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
                                            style="margin-top:10px"
                                            v-if="['ip'].some(keyWord => item.fieldName.toLowerCase().includes(keyWord))"
                                            @click="jumpAsset(item, scope.row[item.fieldName])"
                                            class="ub ub-ac click-btn"
                                        >
                                            <i class="iconfont icon-chaxunzichan" style="font-size:12px"></i>
                                            <span>查询资产</span>
                                        </p>
                                        <p
                                            style="margin-top:10px"
                                            v-if="['ip', 'url', '域名'].some(keyWord => item.fieldName.toLowerCase().includes(keyWord))"
                                            @click="jumpThreat(item, scope.row[item.fieldName])"
                                            class="ub ub-ac click-btn"
                                        >
                                            <i class="iconfont icon-chaxunqingbao" style="font-size:12px"></i>
                                            <span>查询情报</span>
                                        </p>
                                    </div>
                                    <p class="highlighted" slot="reference" v-html="scope.row[item.fieldName]" v-if="item.fieldName === 'aDate'" style="color:#00c0ff"></p>
                                    <p
                                        v-else
                                        class="highlighted"
                                        :style="
                                            ['ip', 'url', '域名'].some(keyWord => item.fieldName.toLowerCase().includes(keyWord))
                                                ? 'cursor: pointer; text-decoration: underline; color: #0052D9;'
                                                : 'cursor: default; text-decoration: unset; color: #191919;'
                                        "
                                        slot="reference"
                                        v-html="scope.row[item.fieldName]"
                                    ></p>
                                </el-popover>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="240" fixed="right" class-name="deepBg">
                        <template slot-scope="scope">
                            <el-button v-per="['data_log_storage']"  :disabled="scope.row.holdType !== 0"  type="text" size="small" @click="hanleSave(scope.row)">暂存</el-button>
                            <!-- <opt-btn icon="iconfont icon-chakan1" :disabled="scope.row.nftData===2" title="查看PCAP包" @click="lookPcac(scope.row)"></opt-btn> -->
                            <el-button v-if="scope.row.nftData === 1"  type="text" size="small">加载中</el-button>
                            <el-button  v-per="['data_log_pcap']" @click="createPackTask(scope.row)" :disabled="scope.row.nftData !== 0" type="text" size="small">创建PCAP包</el-button>
                            <el-button v-per="['data_log_start']"  @click="changeOption(scope.row)" type="text" size="small">发起事件</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div v-show="tableData.length>0" class="pagination pag" style="padding: 0px !important;text-align: right;z-index:20">
                <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="$parent.get_params.page"
                    :page-sizes="[30,50,100]"
                    :page-size="$parent.get_params.size"
                    layout="slot,sizes, prev, next"
                    prev-text="＜ 上一页"
                    next-text="下一页 ＞"></el-pagination>
            </div>
        </div>
        <el-dialog title="提示" :visible.sync="createTaskDialog" width="30%" custom-class="common-dialog">
            <span>确定创建PCAP包任务吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button size="small"  @click="createTaskDialog = false">取消</el-button>
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
    </div>
</template>

<script>
import VueClipBoard from 'vue-clipboard2'
import _ from 'loadsh'
import draggable from 'vuedraggable'
// import JsonViewer from 'vue-json-viewer'
import RankChart from '@/pages/data_manage/new_search/components/chart/RankChart'
import EventBus from '@/assets/js/bus'
import axios from 'axios'
import { getExpandLog, saveLogIds, createTask, viewPcap } from '@/server/data_manage/new_search'
import { get_threat_search } from '@/server/intelligence/api.js'
export default {
    name: 'TableContent',
    components: {
        RankChart,
        // JsonViewer,
        draggable
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
        },
        type: {
            type: [Number],
            default: 2
        },
        searchType: {
            type: [String],
            default: 'normal'
        }
    },
    data() {
        return {
            downLoading: false,
            leftFold: false,
            tabsValue: '',
            pacpData: [],
            createTaskId: '',
            createAllTaskDialog: false,
            createTaskDialog: false,
            highColor: ['#ff0000', '#ea00ff', '#ffd200', '#00ff06', '#ff4aca', '#3888ff', '#ff8400', '#7e00ff', '#00ffea', '#aeff00'],
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
            // heigRight: 'calc(100vh - 380px)',
            // heigLeft: 'calc(100vh - 410px)'

            heigRight: 'calc(100vh - 450px)',
            heigLeft: 'calc(100vh - 410px)'
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
        type: {
            handler(newVal) {
                if (newVal === 1) {
                    this.heigRight = 'calc(100vh - 450px)'
                    this.heigLeft = 'calc(100vh - 410px)'
                } else {
                    this.heigRight = 'calc(100vh - 360px)'
                    this.heigLeft = 'calc(100vh - 410px)'
                }
                console.log('typeData', newVal)
            },
            immediate: true
        },
        viewChartOpen: {
            handler(newVal) {
                if (newVal) {
                    if (this.type == 1) {
                        this.heigRight = 'calc(100vh - 610px)'
                        this.heigLeft = 'calc(100vh - 560px)'
                    } else {
                        this.heigRight = 'calc(100vh - 535px)'
                        this.heigLeft = 'calc(100vh - 520px)'
                    }
                } else {
                    if (this.type == 1) {
                        this.heigRight = 'calc(100vh - 460px)'
                        this.heigLeft = 'calc(100vh - 410px)'
                    } else {
                        this.heigRight = 'calc(100vh - 385px)'
                        this.heigLeft = 'calc(100vh - 410px)'
                    }
                }
            },
            immediate: true
        },
        searchType: {
            handler(newVal) {
                console.log('searchType', newVal)
                if (newVal == 'normal') {
                    if (this.type == 1) {
                        this.heigRight = 'calc(100vh - 470px)'
                        this.heigLeft = 'calc(100vh - 410px)'
                    }
                } else {
                    if (this.type == 1) {
                        this.heigRight = 'calc(100vh - 396px)'
                        this.heigLeft = 'calc(100vh - 410px)'
                    }
                }
            },
            immediate: true
        },
        // viewChartOpen(val) {
        //     if (val) {
        //         this.heigRight = 'calc(100vh - 520px)'
        //         this.heigLeft = 'calc(100vh - 520px)'
        //     } else {
        //         this.heigRight = 'calc(100vh - 380px)'
        //         this.heigLeft = 'calc(100vh - 410px)'
        //     }
        // },
        // list: {
        //     handler(newVal, oldVal) {
        //         let arr = []
        //         this.listAll.map(item => {
        //             if (!newVal.some(_item => item.fieldName === _item.fieldName)) {
        //                 arr.push(item)
        //             }
        //         })
        //         this.listCanSelect = this.$deepCopy(arr)
        //     },
        //     // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
        //     immediate: true
        // },
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
    mounted() {},
    methods: {
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex % 2) {
                return 'table-row2'
            } else {
                return 'table-row1'
            }
        },
        jumpAsset(item, value) {
            if (item.fieldName !== 'srcIp' && item.fieldName !== 'desIp') {
                return
            }
            console.log('ip', item.fieldName, value)
            this.$setsessionStorage('currentPath', '/assets/assets_asset_info?ip=' + value)
            window.open(window.location.origin + '/#' + '/assets/assets_asset_info?ip=' + value)
        },
        jumpThreat(item, value) {
            if (item.fieldName !== 'srcIp' && item.fieldName !== 'desIp') {
                return
            }
            console.log('ip', item.fieldName, value)
            let obj = {
                queryData: {
                    value
                },
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
        handleSaveList() {
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
                    aDate: item.aDate,
                    logId: item.logId
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
            this.sysLogListData[0].aDate = row.aDate
            this.sysLogListData[0].logId = row.logId
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
                let idsData = this.multipleSelection.map(item => {
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
            saveLogIds(data)
                .then(res => {
                    this.$message({
                        message: '暂存成功',
                        type: 'success'
                    })
                    setTimeout(() => {
                        this.$emit('saveLogIdSuccess')
                    }, 1000)
                })
                .catch(error => {
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
                        queryData: {},
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
                                    // console.log(this.listAll)
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
                            console.log(this.expandData)
                            this.expandJsonData = obj
                        })
                        .then(() => {
                            this.filterKeyword('highlighted-inner')
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
                queryData: {},
                paramsData: {
                    logId: row.id
                }
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
        defHighlight(node, keyword, index) {
            const reg = new RegExp(keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'))
            // console.log(node.nodeType)
            if (node.nodeType == 3) {
                // 只处理文本节点
                const match = node.data.match(new RegExp(reg))
                if (match) {
                    console.log('匹配到了')
                    const highlightEl = document.createElement('b')
                    highlightEl.style.color = this.highColor[index]
                    const wordNode = node.splitText(match.index)
                    wordNode.splitText(match[0].length) // 切割成前 关键词 后三个Text 节点
                    const wordNew = document.createTextNode(wordNode.data)
                    highlightEl.appendChild(wordNew) // highlight 节点构建成功
                    wordNode.parentNode.replaceChild(highlightEl, wordNode) // 替换该文本节点
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

            // let top5Obj = await this.getTop5(element.fieldName)
            // console.log('top5Obj', top5Obj)
            // element.totalNum = top5Obj.totalNum
            // element.top5 = top5Obj.top5.map(item => {
            //     item.percent = ((item.num * 100) / element.totalNum).toFixed(2)
            //     return item
            // })
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
            } else {
                // 发果是降序
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

<style scoped lang="scss">
@import '../../../../../assets/css/pacap.scss';
i.fold {
    position: absolute;
    cursor: pointer;
    color: #999999;
    right: 15px;
    top: 18px;
    font-size: 12px;
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
            color: #0052D9 !important;
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
            color: #0052D9 !important;
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
    width: 190px;
    padding: 10px 0;
    background-color: #fff;
    position: relative;
    border: solid 1px #fff;
    box-sizing: border-box;
    // margin-right: 10px;
    transition: width 0.2s linear;
    ::v-deep .el-input__suffix-inner {
        line-height: 32px;
    }
}
.expert-left.left-fold {
    width: 30px;
    transition: width 0.2s linear;

    i.fold {
        color: #999999;
        right: 8px;
        transform: rotate(180deg);
    }
}

.expert-right {
    padding: 10px 0 10px 10px;
    background-color: #fff;
    border: solid 1px #fff;
    ::v-deep .el-button--primary {
        border-color: #FFF;
    }
    ::v-deep .el-button--text {
        // color: #0052d9;
    }
    .bigTable  {
       ::v-deep .el-form-item {
            margin-bottom: 0px
       }
    }

}
.left-title {
    font-size: 14px;
    color: #191919;
}
.left-mark {
    width: 5px;
    height: 24px;
    background-color: #387dee;
    border-radius: 4px;
}
.left-tip {
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 0;

    > i {
        vertical-align: middle;
        font-size: 12px;
        color: #bdbdbd;
        margin-right: 5px;
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
    width: 180px;
    height: 26px;
    // margin-left: 6px;
    position: relative;
    border-radius: 4px;
    // background-image: url(../../../../../assets/img/field_bg.jpg);
    // background-size: 100% 100%;
    // background-repeat: no-repeat;
    // background-position: left top;

    .vertical-line {
        position: absolute;
        width: 2px;
        height: 26px;
        background: rgba(255, 255, 255, 0.2);
        left: -6px;

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
    color: #ffffff;
    cursor: move;
    margin: 4px 0;
    // padding:0 10px;
    box-sizing: border-box;
    .list-title {
        background-color: #387dee;
    }
}

.list-group-item1 {
    color: #616161;
    margin: 8px 0;
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
    color: #fff;
    text-align: center;
    line-height: 26px;
}

.list-inner-tip {
    font-size: 12px;
    line-height: 15px;
    color: #0052D9;
    margin: 6px 0;
}

.list-inner {
    width: 170px;
    margin: 10px 0;
}
div ::v-deep .store.btn_box {
    background-image: url('../../../../../components/modules/colorBtn/images/downloadBg.png');
}
.click-btn {
    cursor: pointer;
    font-size: 12px;
    i {
        margin-right: 5px;
        color: #0052D9;
    }
    span.val {
        color: #0052D9;
    }
}
.click-btn:hover {
    background: #f3f3f3;
}
::-webkit-scrollbar {
    width: 0 !important;
}
div ::v-deep .el-table__expand-column.expand-col {
    border: none;
    width: 30px;
}
.el-dropdown-menu {
    width: 120px !important;
}
</style>
