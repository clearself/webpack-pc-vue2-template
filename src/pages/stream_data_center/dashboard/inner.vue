<template>
    <div class="event event-wrapper attendance-list dashboard" @mouseleave="leavePage" @mousemove="bindMouseover($event)" @mouseup="bindMouseup">
        <div class="ub w100" style="box-sizing: border-box;padding-top:30px;margin-bottom: 10px;">
            <div class="w100">
                <div class="ub w100 ub-pj">
                    <div class="tag-name">{{ data.labelName }}</div>
                    <div class="tag-btns ub ub-ac">
                        <Refresh @selectChange="selectChange" />
                        <el-popover :append-to-body="false" popper-class="popoeradd" placement="bottom" width="90" trigger="click" ref="optionPopover">
                            <div class="addinner"><span @click.stop="addChart">添加图表</span></div>
                            <i slot="reference" class="iconfont icon-tianjia"></i>
                        </el-popover>
                        <i class="iconfont icon-sousuo" @click.stop="isShowSearch = !isShowSearch" style="margin-top:5px"></i>
                        <i class="iconfont icon-yibiaopan-quanping" @click.stop="allScreen" style="margin-top:5px"></i>
                    </div>
                </div>
                <div v-if="isShowSearch">
                    <div class="ub w100">
                        <div class="ub ub-ver ub-f1">
                            <div class="w100 search-box">
                                <div class="search-more ub ub-as">
                                    <div class="search-more ub ub-f1">
                                        <div class="ub ub-ac">
                                            <el-form :model="get_params" label-position="right" label-width="0">
                                                <el-form-item label="">
                                                    <CustomDate
                                                        :append-to-body="appendToBodyAll"
                                                        :chart-time-range="chartTimeRangeAll"
                                                        @getCustomTime="getCustomTimeAll"
                                                        @getDateData="getDateDataAll"
                                                        :inputWidth="292"
                                                        @useing="customDateUseAll"
                                                        :current-type="2"
                                                        :empty="true"
                                                        ref="customDateAll"
                                                    ></CustomDate>
                                                </el-form-item>
                                            </el-form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="sql-box ub ub-pj">
                        <CustomSearch ref="customSearch" :auto="true" class="ub-f1" @getData="getData" :type="2" />
                        <div class="ub ub-pe" style="width:200px;">
                            <Debounce :time="1500" :isDebounce="2">
                                <el-button :loading="loading" size="small" type="primary" @click.native="searchAssets">搜 索</el-button>
                            </Debounce>
                            <Debounce :time="1500" :isDebounce="2">
                                <el-button size="small" @click.native="resetFun">重 置</el-button>
                            </Debounce>
                        </div>
                    </div>
                    <div style="position: relative">
                        <FilterCondition :condition-data="conditionData" />
                        <div v-if="conditionShow" class="condition-area">
                            <ConditionRules :treeData="treeData" />
                            <div class="split-line"></div>
                            <div class="ub ub-pe footer">
                                <el-button style="margin-right: 10px;" size="small" @click="conditionShow = false">取消</el-button>
                                <Debounce :time='1500' :isDebounce="2">
                                    <el-button @click.native="addFilterCondition" size="small" type="primary">{{ conditionData.some(it => it.id === this.recordId) ? '编 辑' :'添 加' }}</el-button>
                                </Debounce>
                            </div>
                        </div>
                        <div class="closeup" @click.stop="isShowSearch = false">
                            <span class="iconwrap"><i class="iconfont icon-right-arrow"></i></span>
                            <!-- 收起 -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="allList.length == 0" style="height: 100%;" class="ub ub-pc ub-ac">
            <div class="empty-txt">
                <div class="no-content">无内容</div>
                <div @click.stop="addChart" class="add-chart">点击添加图表</div>
            </div>
        </div>
        <draggable
            v-model="allList[index]"
            :group="getGroupOption(list)"
            animation="300"
            dragClass="dragClass"
            ghostClass="ghostClass"
            chosenClass="chosenClass"
            @start="onStart"
            @end="onEnd"
            :move="onMove"
            handle=".mover"
            class="draggAble"
            v-for="(list, index) in allList"
            :key="index"
        >
            <transition-group :style="style(list)">
                <div class="item" :style="getHeight(item)" v-for="item in list" :key="item.chartid">
                    <!-- <div class="line topline" @mousedown.prevent="resizableMousedown(item)"></div> -->
                    <div class="chart-box border" style="height: 100%;">
                        <span class="angle angle1"></span>
                        <span class="angle angle2"></span>
                        <span class="angle angle3"></span>
                        <span class="angle angle4"></span>
                        <div class="ub ub-ac ub-pj w100 chart-top" style="box-sizing: border-box;">
                            <div class="ub ub-ac">
                                <div class="title">{{ item.chartName }}</div>
                            </div>
                            <div class="ub ub-ac">
                                <!-- <span style="color: red;">{{item.tableData}}</span> -->
                                <CustomDateChange
                                    :append-to-body="appendToBody"
                                    :chart-time-range="item.chartTimeRange"
                                    @getCustomTime="
                                        (val, ischartTime, hands) => {
                                            getCustomTime(val, ischartTime, hands, item)
                                        }
                                    "
                                    @getDateData="
                                        (date, mode, useDate, useIndex) => {
                                            getDateData(date, mode, useDate, useIndex, item)
                                        }
                                    "
                                    :time="item.time"
                                    :timeStatus="item.timeStatus"
                                    :chartid="item.chartid"
                                    :inputWidth="200"
                                    @useing="customDateUse"
                                    :current-type="2"
                                    :empty="true"
                                    :ref="'customDate' + item.chartid"
                                ></CustomDateChange>
                                <el-popover
                                    v-show="list.length < 3"
                                    :append-to-body="false"
                                    popper-class="popoerpeizhi"
                                    placement="bottom"
                                    width="90"
                                    trigger="click"
                                    ref="optionPopover"
                                >
                                    <div class="peizhiinner">
                                        <span @click.stop="setHeader(item)">配置表头</span>
                                        <span @click.stop="setContent(item)">编辑内容</span>
                                    </div>
                                    <i slot="reference" class="iconfont icon-shezhi"></i>
                                </el-popover>
                                <i v-show="list.length < 3" @click="deleteChart(item)" class="iconfont icon-shanchu3"></i>
                                <el-popover
                                    v-show="list.length > 2"
                                    :append-to-body="false"
                                    popper-class="popoerpeizhi"
                                    placement="bottom"
                                    width="90"
                                    trigger="click"
                                    ref="optionPopover"
                                >
                                    <div class="peizhiinner">
                                        <span @click.stop="setHeader(item)">配置表头</span>
                                        <span @click.stop="setContent(item)">编辑内容</span>
                                        <span @click.stop="deleteChart(item)">删除</span>
                                    </div>
                                    <i slot="reference" class="iconfont icon-gengduo"></i>
                                </el-popover>
                                <i class="iconfont icon-yidong mover"></i>
                            </div>
                        </div>
                        <div class="work-table">
                            <div class="ub ub-pj action-btn">
                                <div @click="handleLeft(item.chartid)"><i class="el-icon-d-arrow-left"></i></div>
                                <div @click="handleRight(item.chartid)"><i class="el-icon-d-arrow-right"></i></div>
                            </div>
                            <el-table
                                :ref="'scrollContent' + item.chartid"
                                class="bigTable chart-table"
                                :data="item.tableData"
                                :row-key="
                                    row => {
                                        return row.id
                                    }
                                "
                                v-loading="item.loading"
                                border
                                tooltip-effect="dark"
                            >
                                <el-table-column align="center" type="index" width="80" label="序号"></el-table-column>
                                <el-table-column
                                    min-width="120"
                                    v-for="(col, index) in item.labelChartHeader"
                                    :key="index"
                                    :prop="col.fieldName"
                                    :label="col.name"
                                    show-overflow-tooltip
                                >
                                    <template slot-scope="scope">
                                        <div v-if="['ip', 'url', '域名'].some(keyWord => col.fieldName.toLowerCase().includes(keyWord))">
                                            <el-popover popper-class="add-search" placement="bottom" title="" trigger="click">
                                                <div>
                                                    <p
                                                        v-if="['ip'].some(keyWord => col.fieldName.toLowerCase().includes(keyWord))"
                                                        @click="jumpAsset(scope.row[col.fieldName])"
                                                        class="ub ub-ac click-btn"
                                                    >
                                                        <i class="iconfont icon-chaxunzichan" style="font-size:12px"></i>
                                                        <span>查询资产</span>
                                                    </p>
                                                    <p
                                                        style="margin-top:10px"
                                                        v-if="['ip', 'url', '域名'].some(keyWord => col.fieldName.toLowerCase().includes(keyWord))"
                                                        @click="jumpThreat(scope.row[col.fieldName])"
                                                        class="ub ub-ac click-btn"
                                                    >
                                                        <i class="iconfont icon-chaxunqingbao" style="font-size:12px"></i>
                                                        <span>查询情报</span>
                                                    </p>
                                                </div>
                                                <p
                                                    class="highlighted"
                                                    :style="
                                                        ['ip', 'url', '域名'].some(keyWord => col.fieldName.toLowerCase().includes(keyWord))
                                                            ? 'cursor: pointer; text-decoration: underline; color: #03a5dd;'
                                                            : 'cursor: default; text-decoration: unset; color: #ffffff;'
                                                    "
                                                    slot="reference"
                                                    v-html="scope.row[col.fieldName]"
                                                ></p>
                                            </el-popover>
                                        </div>
                                        <div v-if="!['ip', 'url', '域名'].some(keyWord => col.fieldName.toLowerCase().includes(keyWord))">{{ scope.row[col.fieldName] }}</div>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div class="page-box">
                                <el-pagination
                                    @current-change="
                                        val => {
                                            handleCurrentChange(val, item)
                                        }
                                    "
                                    :page-size="item.page.pageSize"
                                    :current-page="item.page.page"
                                    :layout="item.tableData.length < 20 ? 'slot, pager, prev' : 'slot, pager, prev, next'"
                                    prev-text="<上一页"
                                    next-text="下一页>"
                                >
                                    <span style="margin-left: 5px; color: #666666;">第{{ item.page.page }}页</span>
                                </el-pagination>
                            </div>
                        </div>
                    </div>
                    <div
                        class="line bottomline"
                        @mousedown.prevent="
                            e => {
                                resizableMousedown(item, e)
                            }
                        "
                    ></div>
                </div>
            </transition-group>
        </draggable>
        <el-dialog title="添加图表" :visible.sync="addChartDialog" width="940px" custom-class="common-dialog add-chart-dialog">
            <div style="width:100%;margin: 0 auto;">
                <el-form label-width="100px" inline label-position="right" ref="addForm" :model="searchForm">
                    <el-row>
                        <el-form-item label="">
                            <treeselect
                                class="treeselect"
                                style="width:300px;margin-top: 5px;"
                                :options="dataTree"
                                :normalizer="normalizer"
                                noChildrenText="当前分支无子节点"
                                noOptionsText="无可用选项"
                                placeholder="请选择分组"
                                v-model="searchForm.groupManageId"
                                loadingText="下拉框无匹配项"
                                :clearable="false"
                            />
                        </el-form-item>
                        <el-form-item label="">
                            <el-input v-model="searchForm.chartName" placeholder="请输入图表名称" style="width: 300px" size="small">
                                <i @click.stop="searchChartList" slot="suffix" class="iconfont icon-sousuo" style="cursor: pointer; font-size: 12px;"></i>
                            </el-input>
                        </el-form-item>
                    </el-row>
                </el-form>
                <el-table
                    ref="multipleTable"
                    class="bigTable"
                    :data="addChartList"
                    :row-key="
                        row => {
                            return row.id
                        }
                    "
                    @selection-change="handleSelectionChange"
                    border
                    stripe
                    tooltip-effect="dark"
                    style="margin-top: 10px;"
                >
                    <el-table-column type="selection" width="50"></el-table-column>
                    <el-table-column prop="name" label="图表名称" width="auto" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="groupName" label="所属分组" width="235" show-overflow-tooltip></el-table-column>
                </el-table>
                <pagination v-show="total_num_addchart>0" :total="total_num_addchart" :page.sync="searchForm.page" :limit.sync="searchForm.size" @pagination="getAddChartList" />
                <!-- <div class="pagination">
                    <el-pagination
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChangeAddChart"
                        :current-page="searchForm.page"
                        :page-sizes="[20, 30, 40, 50]"
                        :page-size="searchForm.size"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total_num_addchart"
                    ></el-pagination>
                </div> -->
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small"  @click="addChartDialog = false">取 消</el-button>
                <el-button size="small" type="primary" @click="submitAdd">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="编辑内容" :visible.sync="editContentDialog" width="700px" custom-class="common-dialog">
            <div style="width:100%;margin: 0 auto;">
                <el-form label-width="100px" label-position="top" ref="addForm" :model="editContent">
                    <el-row>
                        <!-- <el-form-item label="时间范围:" style="margin-bottom: 20px;">
                            <CustomDate
                                :append-to-body="appendToBodyEdit"
                                :chart-time-range="chartTimeRangeEdit"
                                @getCustomTime="getCustomTimeEdit"
                                @getDateData="getDateDataEdit"
                                :inputWidth="292"
                                @useing="customDateUseEdit"
                                :current-type="2"
                                :empty="true"
                                ref="customDateEdit"
                            ></CustomDate>
                        </el-form-item> -->
                        <el-form-item label="查询语句">
                            <el-input type="textarea" v-model="editContent.labelChartSqlNew" class="sql-input" placeholder="请输入查询语句" size="small"></el-input>
                        </el-form-item>
                    </el-row>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="editContentDialog = false">取消</el-button>
                <el-button size="small" type="primary" @click="submitEditContent">确认</el-button>
            </span>
        </el-dialog>
        <CustomTransfer :list-all="listAllField" :list="listField" :transfer-dialog="transferDialog" />
        <DeleteDialog
            :dialogVisible = delDialog
            @delete="delConfim"
            @cancel="delDialog = false">
        </DeleteDialog>
    </div>
</template>

<script>
import { saveAndUpdateTags, findTagsContent, getAddChartListFn, findSearchTypeDetail, getChartList, getFieldByAll, getFilterSql } from '@/server/stream_data_center/dash_board.js'
import { get_threat_search } from '@/server/intelligence/api.js'
import draggable from 'vuedraggable'
import CustomDateChange from './components/custom_date1/index.vue'
import CustomDate from './components/custom_date/index.vue'
import Refresh from './components/refresh/index.vue'
import CustomSearch from './components/custom_search/index.vue'
import FilterCondition from './components/FilterCondition'
import ConditionRules from './components/ConditionRules'
import CustomTransfer from './components/custom_transfer/index.vue'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
    name: 'DashBoard',
    inject: ['indexTypeData'],
    components: {
        draggable,
        CustomDateChange,
        CustomDate,
        CustomSearch,
        Refresh,
        FilterCondition,
        ConditionRules,
        Treeselect,
        CustomTransfer
    },
    data() {
        return {
            timer: null,
            delDialog: false,
            editContentDialog: false,
            editContent: {
                labelChartSqlNew: ''
            },
            sqlTermData: '',
            transitionChart: null,
            transferDialog: false,
            listAllField: [],
            listField: [],
            isShowSearch: false,
            searchForm: {
                page: 1,
                pageSize: 20,
                chartName: '',
                groupManageId: ''
            },
            total_num_addchart: 0,
            multipleSelection: [],
            dataTree: [],
            addChartList: [],
            normalizer(node) {
                if (node.child && !node.child.length) {
                    delete node.child
                }
                return {
                    id: node.id,
                    label: node.name,
                    children: node.child
                }
            },
            drag: false,
            loading: false,
            defaultHeight: 280,
            appendToBody: true,
            mouse_position_y: 0,
            move_y: 0,
            timerId: null,
            sizeChangeItem: null,
            originHeight: 0,
            get_params: {},
            labelWidth: '80px',
            appendToBodyAll: true,
            appendToBodyEdit: true,
            chartTimeRangeAll: [],
            chartTimeRangeEdit: [],
            conditionData: [],
            conditionShow: false,
            listAll: [],
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
            allList: [],
            addChartDialog: false,
            customTimeAll: [],
            refreshVal: 1,
            dateDataAll: '', // noUse usetwo custom
            dateModeAll: '',
            useDateAll: {},
            useIndexAll: '',
            dateDataEdit: '', // noUse usetwo custom
            dateModeEdit: '',
            useDateEdit: {},
            useIndexEdit: ''
        }
    },
    props: {
        dashboardId: {
            type: String,
            default: ''
        },
        data: {
            type: Object,
            default: () => {}
        }
    },
    created() {
        console.log(this.data)
    },
    mounted() {
        this.initCanSelectedFileds()
        this.dealTableData()
        this.refreshData(60000)
    },
    computed: {
        getHeight() {
            return item => {
                return `height: ${item.height}px;`
            }
        }
    },
    beforeDestroy() {
        clearInterval(this.timer)
    },
    beforeRouterLeave(to, from, next) {
        clearInterval(this.timer)
        next()
    },
    watch: {
        move_y(val) {
            if (this.sizeChangeItem) {
                // console.log(val, this.originHeight)
                this.sizeChangeItem.height = val + this.originHeight
            }
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
        list: {
            handler(newVal, oldVal) {
                let arr = []
                this.listAll.map(item => {
                    if (!newVal.some(_item => item.fieldName === _item.fieldName)) {
                        arr.push(item)
                    }
                })
                this.listCanSelect = this.$deepCopy(arr)
            },
            // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
            immediate: true
        }
    },
    methods: {
        jumpAsset(value) {
            this.$setsessionStorage('currentPath', '/assets/assets_asset_info?ip=' + value)
            window.open(window.location.origin + '/#' + '/assets/assets_asset_info?ip=' + value)
        },
        jumpThreat(value) {
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
        handleLeft(chartId) {
            this.$nextTick(() => {
                let bodyWrapper = this.$refs['scrollContent' + chartId][0].bodyWrapper
                // console.log(bodyWrapper)
                bodyWrapper.scrollLeft = bodyWrapper.scrollLeft - 100
            })
        },
        handleRight(chartId) {
            this.$nextTick(() => {
                let bodyWrapper = this.$refs['scrollContent' + chartId][0].bodyWrapper
                bodyWrapper.scrollLeft = bodyWrapper.scrollLeft + 100
            })
        },
        allScreen() {
            this.fullScreen()
        },
        fullScreen() {
            // documentElement 属性以一个元素对象返回一个文档的文档元素
            let el = document.documentElement
            if (el.requestFullscreen || el.mozRequestFullScreen || el.webkitRequestFullscreen || el.msRequestFullScreen) {
                el.requestFullscreen() || el.mozRequestFullScreen() || el.webkitRequestFullscreen() || el.msRequestFullscreen()
            }
        },
        submitEditContent() {
            // this.transitionChart.labelChartStartTime = this.customTimeEdit[0]
            // this.transitionChart.labelChartEndTime = this.customTimeEdit[1]
            this.transitionChart.labelChartSqlNew = this.editContent.labelChartSqlNew
            // this.transitionChart.chartTimeRange = this.customTimeEdit
            // this.transitionChart.chartid
            // this.dateDataEdit = date
            // this.dateModeEdit = mode
            // this.useDateEdit = useDate
            // this.useIndexEdit = useIndex
            console.log(this.dateDataEdit, this.dateModeEdit, this.useDateEdit, this.useIndexEdit)
            // this.formatDate(this.transitionChart.time, this.transitionChart.timeStatus, this.customTimeEdit[0], this.customTimeEdit[1], this.transitionChart)
            this.saveTags(2, 'update')
            this.editContentDialog = false
            // this.setDateEditList(this.transitionChart.chartid)
            // this.$forceUpdate()
        },
        submitAdd() {
            this.multipleSelection.forEach(item => {
                let labelChartSqlNew = ''
                if (item.labelChartSqlNew && item.groupStr) {
                    labelChartSqlNew = `(${item.labelChartSqlNew}) and ${item.groupStr}`
                } else if (item.labelChartSqlNew) {
                    labelChartSqlNew = item.labelChartSqlNew
                } else if (item.groupStr) {
                    labelChartSqlNew = item.groupStr
                }
                const list = [
                    {
                        chartName: item.name,
                        chartid: item.id,
                        height: 300,
                        labelChartHeader: item.chart_header,
                        labelChartHeaderAll: this.$lodash.cloneDeep(item.chart_header),
                        labelChartSql: item.chart_sql,
                        labelChartStartTime: item.chart_start_time,
                        labelChartEndTime: item.chart_end_time,
                        chartTimeRange: null,
                        labelChartSqlNew: labelChartSqlNew,
                        time: item.time,
                        timeStatus: item.timeStatus,
                        loading: false,
                        page: {
                            page: 1,
                            pageSize: 20,
                            total: 0
                        },
                        tableData: [],
                        indexType: item.indexType
                    }
                ]
                this.allList.push(list)
                setTimeout(() => {
                    if (item.chart_start_time && item.chart_end_time) {
                        list[0].chartTimeRange = [item.chart_start_time, item.chart_end_time]
                    } else {
                        list[0].chartTimeRange = []
                    }
                    this.$forceUpdate()
                })
            })
            console.log(this.allList)
            this.saveTags(2, 'update')
            this.addChartDialog = false
        },
        // 刷新当前所有图表
        refeshTable() {
            console.log(this.allList)
            this.allList.forEach((item, itemIndex) => {
                item.forEach((chart, chartIndex) => {
                    const inputTerm = [
                        {
                            field: 'startTime',
                            value: this.customTimeAll[0] || ''
                        },
                        {
                            field: 'endTime',
                            value: this.customTimeAll[1] || ''
                        }
                    ]
                    console.log('我执行了几次')
                    console.log(chart)
                    // this.setDateList(chart)
                    const sqlTerm = this.sqlTermData
                    const filterTerm = this.conditionData.map(it => it.origin[0])
                    const fields = chart.labelChartHeader.map(i => i.fieldName)
                    chart.page.page = 1
                    chart.tableData = []
                    this.getTableData(fields, inputTerm, sqlTerm, filterTerm, chart.page.page, chart.page.pageSize, chart, itemIndex, chartIndex)
                })
            })
        },
        getTableData(fields, inputTerm, sqlTerm, filterTerm, page, pageSize, chart, itemIndex, chartIndex) {
            this.formatDate(chart.time, chart.timeStatus, chart.chartStartTime, chart.chartEndTime, chart)
            const chartSql = {
                fields,
                inputTerm,
                sqlTerm,
                filterTerm
            }
            console.log(chart)
            chart.loading = true
            this.$forceUpdate()
            getChartList({
                paramsData: {
                    chartSql: JSON.stringify(chartSql),
                    chartId: chart.chartid,
                    labelId: this.data.labelId,
                    chartStartTime: chart.chartTimeRange ? chart.chartTimeRange[0] : '',
                    chartEndTime: chart.chartTimeRange ? chart.chartTimeRange[1] : '',
                    key: Math.random(),
                    indexType: chart.indexType
                },
                queryData: {
                    page,
                    pageSize
                }
            })
                .then(res => {
                    res.records.forEach(item => {
                        chart.tableData.push(item)
                    })
                    chart.loading = false
                    this.$forceUpdate()
                })
                .catch(err => {
                    console.log(err)
                    chart.loading = false
                    this.$forceUpdate()
                })
        },
        editSelectFields(select) {
            console.log(select)
            this.transitionChart.labelChartHeader = this.transitionChart.labelChartHeaderAll.filter(header => {
                return select.includes(header.fieldId)
            })
            console.log(this.allList)
            this.saveTags(2)
            this.transferDialog = false
        },
        deleteChart(data) {
            this.delDialog = true
            this.transitionChart = data
        },
        delConfim() {
            this.allList.forEach(item => {
                item.forEach((chart, index) => {
                    if (chart.chartid == this.transitionChart.chartid) {
                        item.splice(index, 1)
                    }
                })
            })
            this.allList = this.allList.filter(list => list.length)
            this.saveTags(2)
            this.delDialog = false
        },
        handleSizeChange(val) {
            this.searchForm.pageSize = val
            this.getAddChartList()
        },
        handleCurrentChangeAddChart(val) {
            this.searchForm.page = val
            this.getAddChartList()
        },
        handleSelectionChange(val) {
            console.log(val)
            this.multipleSelection = val
        },
        searchChartList() {
            this.searchForm.page = 1
            this.getAddChartList()
        },
        getAddChartList() {
            // 查询需要添加的图表列表
            getAddChartListFn({
                queryData: {
                    page: this.searchForm.page,
                    pageSize: this.searchForm.pageSize
                },
                paramsData: {
                    groupManageId: this.searchForm.groupManageId,
                    chartName: this.searchForm.chartName,
                    chartIds: this.getChartsIds()
                }
            }).then(res => {
                this.addChartList = []
                this.total_num_addchart = res.total
                res.records.forEach(item => {
                    this.addChartList.push({
                        chart_header: JSON.parse(item.chartHeader),
                        chart_sql: JSON.parse(item.chartSql),
                        groupName: item.groupName,
                        groupStr: item.groupStr,
                        chart_start_time: item.chartStartTime,
                        chart_end_time: item.chartEndTime,
                        group_id: item.groupId,
                        id: item.id,
                        name: item.name,
                        user_id: item.userId,
                        labelChartSql: item.labelChartSql,
                        labelChartSqlNew: item.sqlStr,
                        time: item.time,
                        timeStatus: item.timeStatus,
                        indexType: item.indexType
                    })
                })
                console.log(this.addChartList)
            })
        },
        getChartsIds() {
            const chartIds = []
            this.allList.forEach(item => {
                item.forEach(chart => {
                    chartIds.push(chart.chartid)
                })
            })
            return chartIds
        },
        getSearchTypeDetail() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            findSearchTypeDetail(data)
                .then(res => {
                    this.dataTree = res
                })
                .catch(error => {
                    console.log('error' + error)
                })
        },
        addChart() {
            // 添加图表
            this.addChartDialog = true
            this.getSearchTypeDetail()
            this.getAddChartList()
        },
        saveTags(flag, type) {
            let pageLayoutList = []
            const chartList = this.$lodash.cloneDeep(this.allList)
            chartList.forEach(item => {
                item.forEach(chart => {
                    chart.labelChartHeader = chart.labelChartHeader ? JSON.stringify(chart.labelChartHeader) : ''
                    chart.labelChartHeaderAll = chart.labelChartHeaderAll ? JSON.stringify(chart.labelChartHeaderAll) : ''
                    chart.labelChartSql = chart.labelChartSql ? JSON.stringify(chart.labelChartSql) : ''
                })
            })
            pageLayoutList.push({
                chartList,
                labelId: this.data.labelId,
                labelName: this.data.labelName
            })
            let data = {
                queryData: {},
                paramsData: {
                    id: this.data.labelId,
                    name: this.data.labelName,
                    dashboardId: this.dashboardId,
                    pageLayoutList
                }
            }
            saveAndUpdateTags(data).then(res => {
                console.log('--------------------------')
                console.log(res)
                console.log(this.allList)
                if (flag == 2) {
                    clearInterval(this.timer)
                    this.timer = null
                    this.selectChange(this.refreshVal)
                }
                if (type == 'update') {
                    this.refeshTable()
                }
            })
        },
        dealTableData() {
            this.allList = this.$lodash.cloneDeep(this.data.chartList) || []
            if (this.allList && this.allList.length) {
                this.allList.forEach((item, itemIndex) => {
                    item.forEach((chart, chartIndex) => {
                        chart.page = {
                            page: 1,
                            pageSize: 20,
                            total: 0
                        }
                        chart.labelChartHeader = typeof chart.labelChartHeader == 'string' ? JSON.parse(chart.labelChartHeader) : chart.labelChartHeader
                        chart.labelChartHeaderAll =
                            typeof chart.labelChartHeaderAll == 'string' && chart.labelChartHeaderAll != '' ? JSON.parse(chart.labelChartHeaderAll) : chart.labelChartHeaderAll
                        chart.labelChartSql = typeof chart.labelChartSql == 'string' ? JSON.parse(chart.labelChartSql) : chart.labelChartSql
                        console.log(chart)
                        chart.tableData = []
                        chart.loading = false
                        const inputTerm = [
                            {
                                field: 'startTime',
                                value: this.customTimeAll[0] || ''
                            },
                            {
                                field: 'endTime',
                                value: this.customTimeAll[1] || ''
                            }
                        ]
                        const sqlTerm = this.sqlTermData
                        const fields = chart.labelChartHeader.map(i => i.fieldName)
                        const filterTerm = this.conditionData.map(it => it.origin[0])
                        this.$nextTick(() => {
                            // this.formatDate(chart.time, chart.timeStatus, chart.chartStartTime, chart.chartEndTime, chart)
                            this.getTableData(fields, inputTerm, sqlTerm, filterTerm, chart.page.page, chart.page.pageSize, chart, itemIndex, chartIndex)
                        })
                    })
                })
            }
        },
        getGroupOption(list) {
            return {
                name: 'chart',
                pull: true,
                put: true
            }
        },
        style(list) {
            if (list.length == 0) {
                return 'height: 400px;'
            }
        },
        onStart() {
            this.drag = true
            this.allList.push([])
        },
        onEnd() {
            this.drag = false
            console.log(this.allList)
            this.allList = this.allList.filter(list => list.length)
            this.allList.forEach(item => {
                item.forEach(chart => {
                    chart.chartTimeRange = null
                    setTimeout(() => {
                        chart.chartTimeRange = [chart.labelChartStartTime, chart.labelChartEndTime]
                        this.$forceUpdate()
                    })
                })
            })
            this.saveTags()
        },
        onMove(e) {
            console.log(e)
            // 将要停靠的数组，如果长度为3并且，不包含当前正在拖动的表格，则不可拖入
            let inList = e.relatedContext.list
            let dragChartId = e.draggedContext.element.chartid
            if (inList.length == 3 && !inList.some(li => li.chartid == dragChartId)) {
                return false
            }
        },
        bindMouseover(e) {
            if (this.sizeChangeItem) {
                // 存在鼠标点住了高度变化
                this.isChangeHeight = true
            } else {
                this.isChangeHeight = false
            }
            this.mouse_position_y = e.y // 鼠标移动到的位置
        },
        leavePage() {
            clearInterval(this.timerId)
            this.sizeChangeItem = null
            if (this.isChangeHeight) {
                this.saveTags()
            }
        },
        bindMouseup() {
            clearInterval(this.timerId) // 鼠标抬起，清除定时器
            if (this.isChangeHeight) {
                this.saveTags()
            }
            this.sizeChangeItem = null
        },
        resizableMousedown(item, e) {
            this.sizeChangeItem = item
            this.originHeight = item.height
            console.log('11111')
            console.log(e)
            const clickY = this.mouse_position_y // 点击时鼠标的y轴位置
            if (!this.timerId) {
                clearInterval(this.timerId)
            }
            this.timerId = setInterval(() => {
                // console.log(this.mouse_position_y, clickY)
                this.move_y = this.mouse_position_y - clickY // 10ms计算一次移动的高度
            }, 10)
        },
        getCustomTime(val, isChartTime, isHands, item) {
            // 非手动为回显，不需请求保存
            item.chartTimeRange = val
            item.labelChartStartTime = val[0]
            item.labelChartEndTime = val[1]
            // console.log(val, isChartTime, isHands, item, 21)
            console.log(JSON.stringify(val))
            if (isHands) {
                // 手动修改表格的时间数据，需要保存
                const timeObj = this.modeChangeTime(item.dateData, item.dateMode, item.useDate, item.useIndex, item.chartid)
                console.log(timeObj)
                item.time = timeObj.time
                item.timeStatus = timeObj.timeStatus
                this.saveTags(2, 'update')
            }
        },
        modeChangeTime(dateData, dateMode, useDate, useIndex, chartid) {
            console.log(dateMode)
            let timeObj = {
                time: '',
                timeStatus: ''
            }
            if (dateMode === 'noUse') {
                timeObj.time = dateData
                timeObj.timeStatus = ''
            } else if (dateMode === 'use' || dateMode === 'useTwo') {
                timeObj.time = this.$getsessionStorage(`temporary${chartid}`).actualTime
                timeObj.timeStatus = this.$getsessionStorage(`temporary${chartid}`).timeUnit
            } else if (dateMode === 'custom') {
                timeObj.time = dateData
                timeObj.timeStatus = ''
            }
            return timeObj
        },
        getCustomTimeAll(val, isChartTime) {
            console.log(val, isChartTime)
            this.customTimeAll = val
            console.log('时间', val)
        },
        getCustomTimeEdit(val, isChartTime) {
            console.log(val, isChartTime)
            this.customTimeEdit = val
            console.log('时间', val)
        },
        getDateData(date, mode, useDate, useIndex, list) {
            console.log(mode, mode, useDate, useIndex, list)
            list.dateData = date
            list.dateMode = mode
            list.useDate = useDate
            list.useIndex = useIndex
        },
        getDateDataAll(date, mode, useDate, useIndex) {
            console.log(date, mode, useDate, useIndex)
            this.dateDataAll = date
            this.dateModeAll = mode
            this.useDateAll = useDate
            this.useIndexAll = useIndex
        },
        getDateDataEdit(date, mode, useDate, useIndex) {
            this.dateDataEdit = date
            this.dateModeEdit = mode
            this.useDateEdit = useDate
            this.useIndexEdit = useIndex
        },
        initCanSelectedFileds() {
            let data = {
                queryData: {},
                paramsData: {
                    indexType: this.indexTypeData
                }
            }
            /* 先获取已选的字段，在获取所有字段，避免左侧抖动*/
            // this.initSelectedFileds()
            getFieldByAll(data)
                .then(res => {
                    this.listAll = []
                    return res
                })
                .then(res => {
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
                    console.log(this.listAll)
                })
                .then(() => {
                    this.list = this.$lodash.cloneDeep(this.list)
                })
                .catch(error => {
                    console.log('error' + error)
                })
        },
        customDateUse() {
            this.initCanSelectedFileds()
        },
        customDateUseAll() {
            this.initCanSelectedFileds()
        },
        customDateUseEdit() {
            this.initCanSelectedFileds()
        },
        setHeader(item) {
            console.log(item)
            this.transitionChart = item
            this.listField = []
            this.listAllField = []
            item.labelChartHeader.forEach(header => {
                this.listField.push(header)
            })
            item.labelChartHeaderAll.forEach(header => {
                this.listAllField.push(header)
            })
            this.transferDialog = true
            this.$forceUpdate()
        },
        setContent(item) {
            console.log(item)
            this.transitionChart = item
            this.editContentDialog = true
            this.$nextTick(() => {
                // if (item.labelChartStartTime && item.labelChartEndTime) {
                //     this.dateDataEdit = item.dateData // noUse usetwo custom
                //     this.dateModeEdit = item.dateMode
                //     this.useDateEdit = item.useDate
                //     this.useIndexEdit = item.useIndex
                //     // this.setDateEdit()
                // }
                this.editContent.labelChartSqlNew = item.labelChartSqlNew
            })
        },
        handleCurrentChange(val, chart) {
            console.log(1111)
            console.log(chart.page.page)
            console.log(val)
            // chart.page.page = val
            // if (chart.tableData.length < 20) {
            //     return
            // }
            chart.page.page = val
            chart.tableData = []
            const inputTerm = [
                {
                    field: 'startTime',
                    value: this.customTimeAll[0] || ''
                },
                {
                    field: 'endTime',
                    value: this.customTimeAll[1] || ''
                }
            ]
            const sqlTerm = this.sqlTermData
            const fields = chart.labelChartHeader.map(i => i.fieldName)
            const filterTerm = this.conditionData.map(it => it.origin[0])
            this.getTableData(fields, inputTerm, sqlTerm, filterTerm, val, chart.page.pageSize, chart)
        },
        selectChange(val) {
            this.refreshVal = val
            if (this.refreshVal == 0) {
                clearInterval(this.timer)
                this.timer = null
            } else if (this.refreshVal == 1) {
                this.refreshData(60000)
            } else if (this.refreshVal == 2) {
                this.refreshData(5 * 60000)
            } else if (this.refreshVal == 3) {
                this.refreshData(15 * 60000)
            } else if (this.refreshVal == 4) {
                this.refreshData(30 * 60000)
            } else if (this.refreshVal == 5) {
                this.refreshData(60 * 60000)
            } else if (this.refreshVal == 6) {
                this.refreshData(2 * 60 * 60000)
            } else if (this.refreshVal == 7) {
                this.refreshData(12 * 60 * 60000)
            } else if (this.refreshVal == 8) {
                this.refreshData(24 * 60 * 60000)
            } else if (this.refreshVal.length > 0) {
                let timeData = this.refreshVal[0].actualTime
                let unitData = this.getTimeUnit(this.refreshVal[0].timeUnit)
                this.refreshData(timeData * unitData)
            }
            console.log('刷新', val)
        },
        getTimeUnit(val) {
            if (val == 0) {
                return 1000
            } else if (val == 1) {
                return 60000
            } else if (val == 2) {
                return 60 * 60000
            } else if (val == 3) {
                return 24 * 60 * 60000
            }
        },
        refreshData(val) {
            console.log(11111)
            clearInterval(this.timer)
            this.timer = null
            this.setDate()
            this.timer = setInterval(() => {
                this.refeshTable()
            }, val)
        },
        getUnitText1(val) {
            if (val == 1) {
                return '秒'
            } else if (val == 2) {
                return '分钟'
            } else if (val == 3) {
                return '小时'
            } else if (val == 4) {
                return '天'
            }
        },
        formatDate(time, timeStatus, start, end, list) {
            console.log(time, timeStatus, start, end, list)
            if (timeStatus) {
                let unitText1 = this.getUnitText1(timeStatus)
                list.useDate = { id: '', name: '最近' + time + unitText1, time: time, timeUnit: timeStatus - 1 }
                this.$refs[`customDate${list.chartid}`][0].handleOther(list.useDate, list.useIndex)
            } else {
                if (time === '最近10分钟') {
                    this.$refs[`customDate${list.chartid}`][0].handleRecently({ value: 0, name: '最近10分钟' }, 0)
                } else if (time === '最近30分钟') {
                    this.$refs[`customDate${list.chartid}`][0].handleRecently({ value: 1, name: '最近30分钟' }, 1)
                } else if (time === '最近1小时') {
                    this.$refs[`customDate${list.chartid}`][0].handleRecently({ value: 2, name: '最近1小时' }, 2)
                } else if (time === '最近1天') {
                    this.$refs[`customDate${list.chartid}`][0].handleRecently({ value: 3, name: '最近1天' }, 3)
                } else if (time === '最近2天') {
                    this.$refs[`customDate${list.chartid}`][0].handleRecently({ value: 4, name: '最近2天' }, 4)
                } else if (time === '最近7天') {
                    this.$refs[`customDate${list.chartid}`][0].handleRecently({ value: 5, name: '最近7天' }, 5)
                } else if (time === '今天') {
                    this.$refs[`customDate${list.chartid}`][0].handleRelative({ value: 0, name: '今天' }, 0)
                } else if (time === '昨天') {
                    this.$refs[`customDate${list.chartid}`][0].handleRelative({ value: 1, name: '昨天' }, 1)
                } else if (time === '本周') {
                    this.$refs[`customDate${list.chartid}`][0].handleRelative({ value: 2, name: '本周' }, 2)
                } else if (time === '上周') {
                    this.$refs[`customDate${list.chartid}`][0].handleRelative({ value: 3, name: '上周' }, 3)
                } else if (time === '本月') {
                    this.$refs[`customDate${list.chartid}`][0].handleRelative({ value: 4, name: '本月' }, 4)
                } else if (time === '上月') {
                    this.$refs[`customDate${list.chartid}`][0].handleRelative({ value: 5, name: '上月' }, 5)
                } else {
                    if (time) {
                        let timeTmp = time.split('~')
                        list.customTime = [timeTmp[0], timeTmp[1]]
                        list.chartTimeRange = [timeTmp[0], timeTmp[1]]
                    }
                }
            }
        },
        setDate() {
            if (this.dateModeAll === 'noUse') {
                if (this.dateDataAll === '最近10分钟') {
                    this.$refs.customDateAll.handleRecently({ value: 0, name: '最近10分钟' }, 0)
                } else if (this.dateDataAll === '最近30分钟') {
                    this.$refs.customDateAll.handleRecently({ value: 1, name: '最近30分钟' }, 1)
                } else if (this.dateDataAll === '最近1小时') {
                    this.$refs.customDateAll.handleRecently({ value: 2, name: '最近1小时' }, 2)
                } else if (this.dateDataAll === '最近1天') {
                    this.$refs.customDateAll.handleRecently({ value: 3, name: '最近1天' }, 3)
                } else if (this.dateDataAll === '最近2天') {
                    this.$refs.customDateAll.handleRecently({ value: 4, name: '最近2天' }, 4)
                } else if (this.dateDataAll === '最近7天') {
                    this.$refs.customDateAll.handleRecently({ value: 5, name: '最近7天' }, 5)
                } else if (this.dateDataAll === '今天') {
                    this.$refs.customDateAll.handleRelative({ value: 0, name: '今天' }, 0)
                } else if (this.dateDataAll === '昨天') {
                    this.$refs.customDateAll.handleRelative({ value: 1, name: '昨天' }, 1)
                } else if (this.dateDataAll === '本周') {
                    this.$refs.customDateAll.handleRelative({ value: 2, name: '本周' }, 2)
                } else if (this.dateDataAll === '上周') {
                    this.$refs.customDateAll.handleRelative({ value: 3, name: '上周' }, 3)
                } else if (this.dateDataAll === '本月') {
                    this.$refs.customDateAll.handleRelative({ value: 4, name: '本月' }, 4)
                } else if (this.dateDataAll === '上月') {
                    this.$refs.customDateAll.handleRelative({ value: 5, name: '上月' }, 5)
                }
            } else if (this.dateModeAll === 'use') {
                this.$refs.customDateAll.handleOther(this.useDateAll, this.useIndexAll)
            } else if (this.dateModeAll === 'useTwo') {
                this.$refs.customDateAll.handleUse()
            }
        },
        setDateEditList(id) {
            if (this.dateModeEdit === 'noUse') {
                if (this.dateDataEdit === '最近10分钟') {
                    this.$refs[`customDate${id}`][0].handleRecently({ value: 0, name: '最近10分钟' }, 0)
                } else if (this.dateDataEdit === '最近30分钟') {
                    this.$refs[`customDate${id}`][0].handleRecently({ value: 1, name: '最近30分钟' }, 1)
                } else if (this.dateDataEdit === '最近1小时') {
                    this.$refs[`customDate${id}`][0].handleRecently({ value: 2, name: '最近1小时' }, 2)
                } else if (this.dateDataEdit === '最近1天') {
                    this.$refs[`customDate${id}`][0].handleRecently({ value: 3, name: '最近1天' }, 3)
                } else if (this.dateDataEdit === '最近2天') {
                    this.$refs[`customDate${id}`][0].handleRecently({ value: 4, name: '最近2天' }, 4)
                } else if (this.dateDataEdit === '最近7天') {
                    this.$refs[`customDate${id}`][0].handleRecently({ value: 5, name: '最近7天' }, 5)
                } else if (this.dateDataEdit === '今天') {
                    this.$refs[`customDate${id}`][0].handleRelative({ value: 0, name: '今天' }, 0)
                } else if (this.dateDataEdit === '昨天') {
                    this.$refs[`customDate${id}`][0].handleRelative({ value: 1, name: '昨天' }, 1)
                } else if (this.dateDataEdit === '本周') {
                    this.$refs[`customDate${id}`][0].handleRelative({ value: 2, name: '本周' }, 2)
                } else if (this.dateDataEdit === '上周') {
                    this.$refs[`customDate${id}`][0].handleRelative({ value: 3, name: '上周' }, 3)
                } else if (this.dateDataEdit === '本月') {
                    this.$refs[`customDate${id}`][0].handleRelative({ value: 4, name: '本月' }, 4)
                } else if (this.dateDataEdit === '上月') {
                    this.$refs[`customDate${id}`][0].handleRelative({ value: 5, name: '上月' }, 5)
                }
            } else if (this.dateModeEdit === 'use') {
                this.$refs[`customDate${id}`][0].handleOther(this.useDateEdit, this.useIndexEdit)
            } else if (this.dateModeEdit === 'useTwo') {
                this.$refs[`customDate${id}`][0].handleUse()
            }
        },
        setDateEdit() {
            if (this.dateModeEdit === 'noUse') {
                if (this.dateDataEdit === '最近10分钟') {
                    this.$refs.customDateEdit.handleRecently({ value: 0, name: '最近10分钟' }, 0)
                } else if (this.dateDataEdit === '最近30分钟') {
                    this.$refs.customDateEdit.handleRecently({ value: 1, name: '最近30分钟' }, 1)
                } else if (this.dateDataEdit === '最近1小时') {
                    this.$refs.customDateEdit.handleRecently({ value: 2, name: '最近1小时' }, 2)
                } else if (this.dateDataEdit === '最近1天') {
                    this.$refs.customDateEdit.handleRecently({ value: 3, name: '最近1天' }, 3)
                } else if (this.dateDataEdit === '最近2天') {
                    this.$refs.customDateEdit.handleRecently({ value: 4, name: '最近2天' }, 4)
                } else if (this.dateDataEdit === '最近7天') {
                    this.$refs.customDateEdit.handleRecently({ value: 5, name: '最近7天' }, 5)
                } else if (this.dateDataEdit === '今天') {
                    this.$refs.customDateEdit.handleRelative({ value: 0, name: '今天' }, 0)
                } else if (this.dateDataEdit === '昨天') {
                    this.$refs.customDateEdit.handleRelative({ value: 1, name: '昨天' }, 1)
                } else if (this.dateDataEdit === '本周') {
                    this.$refs.customDateEdit.handleRelative({ value: 2, name: '本周' }, 2)
                } else if (this.dateDataEdit === '上周') {
                    this.$refs.customDateEdit.handleRelative({ value: 3, name: '上周' }, 3)
                } else if (this.dateDataEdit === '本月') {
                    this.$refs.customDateEdit.handleRelative({ value: 4, name: '本月' }, 4)
                } else if (this.dateDataEdit === '上月') {
                    this.$refs.customDateEdit.handleRelative({ value: 5, name: '上月' }, 5)
                }
            } else if (this.dateModeEdit === 'use') {
                this.$refs.customDateEdit.handleOther(this.useDateEdit, this.useIndexEdit)
            } else if (this.dateModeEdit === 'useTwo') {
                this.$refs.customDateEdit.handleUse()
            }
        },
        getData(val) {
            this.sqlTermData = val
            console.log('智能搜索框时间', val)
        },
        searchAssets() {
            this.setDate()
            this.refeshTable()
        },
        resetFun() {
            this.taskId = ''
            this.conditionData = []
            this.sqlTermData = ''
            this.$refs.customSearch.inputData = ''
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
        }
    }
}
</script>

<style lang="scss" scoped>
.event-wrapper {
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 0px !important;
    min-height: 100% !important;
    width: 100% !important;
    box-sizing: border-box;
    overflow-x: hidden !important;
    overflow-y: auto !important;
}
.click-btn {
    cursor: pointer;
    font-size: 12px;
    i {
        margin-right: 5px;
        color: #1cd7fa;
    }
    span.val {
        color: #00fffe;
    }
}
.click-btn:hover {
    background-color: #f3f3f3;
}
.dashboard {
    height: calc(100vh - 100px);
    padding-bottom: 100px;
    margin-top: 0;
    border-radius: 0 0 4px 4px;
    .el-form-item {
        margin-bottom: 0;
    }
    ::v-deep.filter-title {
        margin-left: 0 !important;
    }
    .tag-name {
        font-size: 18px;
        height: 20px;
        line-height: 20px;
        letter-spacing: 2px;
        color: rgba(0, 0, 0, 0.9);
        font-weight: 600;
    }
    .tag-btns {
        color: rgba(0,0,0,0.4);
        .iconfont {
            margin-left: 20px;
            font-size: 14px;
            cursor: pointer;
        }
        .popoeradd {
            padding-left: 0;
            padding-right: 0;
            min-width: 90px;
            text-align: center;
            background-color: #033254;
            box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.59), inset 0px 0px 6px 0px rgba(0, 186, 255, 0.73), inset 0px -1px 0px 0px rgba(40, 82, 124, 0.5);
            border: solid 1px #1a5c92;
            color: #fff;
            font-size: 12px;
            .addinner {
                span {
                    width: 100%;
                    cursor: pointer;
                    justify-content: center;
                    height: 24px;
                    line-height: 24px;
                    &:hover {
                        color: #0052d9;
                    }
                }
            }
        }
    }
    ::v-deep.vue-treeselect__placeholder {
        line-height: 30px;
    }
    .closeup {
        position: absolute;
        color: rgba(0, 0, 0, 0.4);
        font-size: 12px;
        cursor: pointer;
        right: 0;
        top: 0;
        .iconwrap {
            display: inline-block;
            transform: rotate(-90deg);
            margin-right: 6px;
        }
    }
    .empty-txt {
        .no-content {
            font-size: 18px;
            color: rgba(0,0,0,0.9);
            text-align: center;
        }
        .add-chart {
            font-size: 14px;
            color: #0096ff;
            cursor: pointer;
            text-decoration: underline;
        }
    }
}
.event ::v-deep.vue-treeselect__control {
    height: 32px !important;
}

.sql-box {
    margin-top: 5px;
}
.condition-area {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    z-index: 1000;
    background-color: #fff;
    padding: 20px;
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    border: solid 1px #dcdcdc;
    transition: all 0.3s;
}
.reset-btn {
    width: 80px;
    height: 30px;
    background-color: #041f38;
    box-shadow: inset 0px 0px 10px 0px rgba(0, 167, 245, 0.97);
    border: solid 1px #39caf3;
    font-size: 12px;
    line-height: 15px;
    letter-spacing: 1px;
    color: #a2ece8;
    border-radius: 5px;
    margin-left: 10px;
    cursor: pointer;
    box-sizing: border-box;
}
.search-box {
    .search-more {
        display: flex;
        flex-wrap: wrap;
        ::v-deep.refresh {
            .el-input__inner {
                height: 30px;
                line-height: 30px;
            }
        }
        .search-more-left {
            display: flex;
            flex-wrap: wrap;
            div {
                padding: 5px 0;
                margin-right: 20px;
                ::v-deep.el-select {
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
            color: #03e9ff;
            cursor: pointer;
            font-size: 12px;
            height: 20px;
            margin-top: 10px;
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
</style>
<style lang="scss">
.add-chart-dialog {
    .el-form-item {
        .el-input__suffix {
            cursor: pointer;
            right: 0;
            box-sizing: border-box;
            width: 30px;
            height: 30px;
            // box-shadow: inset 0px 0px 7px 0px #389bf7;
            border-radius: 0px 2px 2px 0px;
            // border: solid 1px #1cd7fa;
        }
    }
}
.draggAble {
    margin-bottom: 10px;
    span {
        display: flex;
        .item {
            width: 100%;
            overflow: hidden;
            position: relative;
            flex: 1;
            &:not(:last-child) {
                margin-right: 10px;
            }
            .line {
                height: 8px;
                background: transparent;
                width: 100%;
                position: absolute;
                cursor: row-resize;
                left: 0;
                z-index: 1;
                right: 0;
                &.topline {
                    top: 0;
                }
                &.bottomline {
                    bottom: -4px;
                }
            }
        }
        .popoerpeizhi {
            padding-left: 0;
            padding-right: 0;
            min-width: 90px;
            background-color: #fff;
            box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
            border: solid 1px #dcdcdc;
            color: rgba(0, 0, 0, 0.9);
            font-size: 12px;
            .peizhiinner {
                span {
                    width: 100%;
                    cursor: pointer;
                    justify-content: center;
                    height: 24px;
                    line-height: 24px;
                    &:hover {
                        background-color: #f3f3f3;
                        color: rgba(0,0,0,0.9);
                    }
                }
            }
        }
        .page-box {
            height: 30px;
            line-height: 30px;
            text-align: right;
            .el-pagination {
                background: transparent;
                font-weight: normal;

                .btn-next,
                .btn-prev,
                .el-pager li {
                    background-color: transparent;
                    color: #666;
                    min-width: 26px;
                }
                .btn-next:hover,
                .btn-prev:hover,
                .el-pager li:hover,
                .el-pager li.active {
                    // color: #00fffc;
                }
            }
            .cannot-click-next {
                .btn-next {
                    cursor: not-allowed;
                }
            }
        }
        .chart-box {
            position: relative;
            box-sizing: border-box;
            .angle {
                position: absolute;
                left: -1px;
                top: -1px;
                width: 10px;
                height: 10px;
                z-index: 10;
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
        }

        .chart-box.border {
            border: 1px solid #dadee8;
            background-color: rgba(0, 82, 217, 0.03);
            border-radius: 4px;
        }
        .chart-top {
            height: 30px;
            margin-bottom: 5px;
            .title {
                color: rgba(0,0,0,0.9);
                font-size: 12px;
                // text-shadow: 0px 0px 6px #00cffb, 0px 0px 6px #00cffb;
                white-space: nowrap;
                max-width: 200px;
                text-overflow: ellipsis;
                overflow: hidden;
            }
            .options {
                font-size: 0;
            }
            .options > div {
                display: inline-block;
                padding: 0 8px;
                color: #666;
                font-size: 12px;
                cursor: pointer;
            }
            .options > div.active {
                color: #fff;
            }
            .iconfont {
                color: #387dee;
                cursor: pointer;
                margin-left: 10px;
            }
            .mover {
                cursor: move;
            }
        }
        .work-table {
            position: relative;
            height: calc(100% - 30px);
            overflow-y: auto;
            .el-table {
                border: none;
                position: relative;
                .el-table__header tr {
                    background: rgba(4, 31, 51, 0.1) !important;
                }
                .cell {
                    height: 24px !important;
                    line-height: 24px !important;
                    color: rgba(0,0,0,0.9);
                }
                td {
                    padding: 0;
                    height: 24px !important;
                    line-height: 24px !important;
                }
                th {
                    padding: 0;
                    color: #496573;
                    border: none;
                    height: 24px !important;
                    line-height: 24px !important;
                    background-color: #e5e9f0 !important;
                    font-size: 12px;
                    .cell {
                        color: #496573;
                    }
                }
                th.is-leaf {
                    border-color: transparent;
                }
                tr {
                    // box-shadow: inset 0px -1px 0px 0px #00274e;
                    border-radius: 0px;
                    height: 24px !important;
                    line-height: 24px !important;
                    position: relative !important;
                    background: transparent !important;
                    td {
                        padding: 0 !important;
                        border: none;
                        background-color:rgba(0, 82, 217, 0.03);
                    }
                    td:first-child {
                        border: 1px;
                    }
                    td:last-child {
                        border: 1px;
                    }
                    background: url('/src/assets/img/listBg.png') center no-repeat;
                    background-size: 130% 100%;
                    opacity: 1;
                }
            }
            .el-table::before {
                background: rgba(0, 168, 255, 0.2);
                left: 2px;
                right: 2px;
            }
            .el-table--enable-row-hover .el-table__body tr:hover > td {
                background: transparent !important;
            }
            .action-btn {
                position: absolute;
                width: 100%;
                height: 24px;
                line-height: 24px;
                z-index: 10;
                div {
                    text-align: center;
                    cursor: pointer;
                    width: 20px;
                    height: 26px;
                    background-color: #e5e9f0;
                    // box-shadow: 2px 0px 4px 0px rgba(0, 0, 0, 0.5);
                    border: solid 1px #dadee8;
                    color: #387dee;
                }
            }
        }
        .el-table__empty-text {
            display: inline;
        }
    }
}
</style>
