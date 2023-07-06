<template>
    <div class="w100 event work-detail" style="overflow-x:hidden;padding: 10px;">
        <div class="ub ub-pj w100" style="margin-bottom: 10px;">
            <div class="list-tips">列表内容</div>
        </div>
        <el-table ref="multipleTable" v-loading="loading" class='bigTable work-overview' border stripe :span-method="arraySpanMethod"  :data="tableData" :height="tableHeight">
            <el-table-column label="工单名称" align="center">
                <template slot-scope="scope" width="160">
                    <div>{{scope.row.workOrderName}}</div>
                </template>
            </el-table-column>
            <el-table-column label="参与人" align="center" width="800">
                <template slot-scope="scope">
                    <div style="width:1000px;overflow-x:hidden;">
                        <el-table v-if="scope.row.sub&&scope.row.sub.length>0" style="width:100%;height:auto;" class="bigTable work-overview-inner" :show-header="false" ref="multipleTableInner" :data="scope.row.sub">
                            <el-table-column label="参与人" align="center" width="800">
                                <template slot-scope="{row}">
                                    <div>
                                        <span class="num-end" v-if="type===4" style="color: #0052d9;font-size: 12px;">{{row.userName}}</span>
                                        <span class="num-end" v-else @click="handleSeeaRecord(scope.row)" style="color: #0052d9;font-size: 12px;cursor: pointer;text-decoration: underline">{{row.userName}}</span>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column :prop="timeValue" :label="timeLabel" align="center" width="200">
                            </el-table-column>
                        </el-table>
                    </div>
                </template>
            </el-table-column>
            <el-table-column :prop="timeValue" :label="timeLabel" align="center" width="200">
            </el-table-column>
        </el-table>
        <pagination v-show="total_num>0" :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size" @pagination="get_data" />

        <el-dialog title="流转记录" :visible.sync="detailDialog" width="900px" custom-class="attendance-dialog">
            <div v-if="bpmRecord.length>0" class="w100 work-record" id="pdfPrint">
                <el-row style="margin:20px 0;background: #fff" type="flex" justify="center">
                    <el-timeline style="width:90%;margin-left: 140px;">
                        <el-timeline-item
                            class="w100"
                            v-for="(activity, index) in bpmRecord"
                            :key="index"
                            :icon="activity.icon"
                            :type="activity.type"
                            :color="activity.color"
                            :size="activity.size"
                            :hide-timestamp="false"
                            :timestamp="activity.createTime"
                            placement="top">
                            <div class="ub ub-pj ub-ac time-box">
                                <div class="ub" style="width: 50%;">
                                    <h4 style="color: rgba(0, 0, 0, 0.9);font-size: 16px;">{{activity.userName|NullStr}}
                                        <sub style="font-size:12px;color: rgba(0, 0, 0, 0.6);opacity: 0.6;margin-left: 10px;vertical-align: bottom;">{{activity.userRole|NullStr}}</sub>
                                        <sub style="font-size:12px;color: rgba(0, 0, 0, 0.6);opacity: 0.6;margin-left: 10px;vertical-align: bottom;">当前节点：{{activity.nodeName ? activity.nodeName:''}}</sub>
                                    </h4>
                                </div>
                                <div class="time-right" style="width: 150px;text-align: right">
                                    <el-button
                                        type="text"
                                        style="text-decoration: underline;font-size:12px;"
                                        :class="{'el-icon-arrow-down':activity.isOpen,'el-icon-arrow-up':!activity.isOpen}"
                                        @click="activity.isOpen=!activity.isOpen">{{activity.isOpen?'收起内容':'展开查看'}}</el-button>
                                </div>
                            </div>

                            <div v-show="activity.isOpen">
                                <div class="time-text-box" v-if="(workTaskInfo.workOrderObject == 1||workTaskInfo.workOrderObject == 2)&&activity.dealType==0">
                                    <div class="w100 time-text-box-item" v-for="(item,_index) in activity.dealContent" :key="_index">
                                        <div class="time-text-box-left">{{item.name}}:</div>
                                        <div v-if="item.valType==='text'||item.valType==='select'" class="ub ub-f1 ub-ver time-text-box-right">{{item|getVal}}</div>
                                        <div v-else class="time-text-box-right" v-html="item.val" @click="imageEnlargement"></div>
                                    </div>
                                </div>
                                <div class="w100 time-text-box" v-if="workTaskInfo.workOrderObject == 1&&activity.operation==0">
                                    <div class="w100 time-text-box-item">
                                        <div class="time-text-box-left">是否驳回：</div>
                                        <div class="time-text-box-right">{{activity.dealContent.isReject==1?'是':'否'}}</div>
                                    </div>
                                    <div class="w100 time-text-box-item">
                                        <div class="time-text-box-left">分析过程：</div>
                                        <div class="time-text-box-right" v-html="activity.dealContent.analyzePro" @click="imageEnlargement"></div>
                                    </div>
                                    <div class="w100 time-text-box-item" v-if="activity.dealContent.isReject==1">
                                        <div class="time-text-box-left">驳回理由：</div>
                                        <div class="time-text-box-right" v-html="activity.dealContent.rejectReason" @click="imageEnlargement"></div>
                                    </div>
                                    <div v-else class="w100 time-text-box-item">
                                        <div class="time-text-box-left">处置建议：</div>
                                        <div class="time-text-box-right" v-html="activity.dealContent.advice" @click="imageEnlargement"></div>
                                    </div>
                                </div>
                                <!-- 漏洞处置 -->
                                <div class="time-text-box" v-if="workTaskInfo.workOrderObject == 2&&activity.operation&&activity.operation==2">
                                    <div class="w100">
                                        <div class="w100 time-text-box-item">
                                            <div class="time-text-box-left">处置方式：</div>
                                            <div class="time-text-box-right">{{ activity.dealContent.disposalType|getdisposalLeakType }}</div>
                                        </div>
                                        <div class="w100 time-text-box-item" v-if="activity.dealContent.disposalType == 2" >
                                            <div class="time-text-box-left">描述：</div>
                                            <div class="time-text-box-right" v-html="activity.dealContent.des"></div>
                                        </div>
                                    </div>
                                </div>
                                <!-- 事件处置 -->
                                <div class="time-text-box" v-if="workTaskInfo.workOrderObject == 1&&activity.operation&&activity.operation==2">
                                    <div class="w100 time-text-box-item">
                                        <div class="time-text-box-left">审核状态：</div>
                                        <div class="time-text-box-right">{{activity.dealContent.isReject==1?'驳回':'处置'}}</div>
                                    </div>
                                    <div class="w100 time-text-box-item" v-if="activity.dealContent.isReject==1">
                                        <div class="time-text-box-left">驳回理由：</div>
                                        <div class="time-text-box-right" v-html="activity.dealContent.rejectReason" @click="imageEnlargement"></div>
                                    </div>
                                    <div class="w100" v-if="activity.dealContent.isReject!=1">
                                        <div class="w100 time-text-box-item">
                                            <div class="time-text-box-left">处置方式：</div>
                                            <div class="time-text-box-right">{{ activity.dealContent.disposalType|getdisposalType }}</div>
                                        </div>
                                        <div class="w100 time-text-box-item" v-if="activity.dealContent.disposalType == 0">
                                            <div class="time-text-box-left">IP：</div>
                                            <div class="time-text-box-right">{{handdeelIps(activity.dealContent.ips)}}</div>
                                        </div>
                                        <div class="w100 time-text-box-item" v-if="activity.dealContent.disposalType == 0 && activity.dealContent.isReject != 3">
                                            <div class="time-text-box-left">封禁对象：</div>
                                            <div class="time-text-box-right">{{getObjs(activity.dealContent.objs)}}</div>
                                        </div>
                                        <div class="w100 time-text-box-item" v-if="activity.dealContent.disposalType == 1||activity.dealContent.disposalType == 2">
                                            <div class="time-text-box-left">变更项：</div>
                                            <div class="time-text-box-right">{{ activity.dealContent.changeItem|getchangeItem }}</div>
                                        </div>
                                        <div class="w100 time-text-box-item" v-if="activity.dealContent.disposalType == 1||activity.dealContent.disposalType == 2||activity.dealContent.disposalType == 3">
                                            <div class="time-text-box-left">设备：</div>
                                            <div class="time-text-box-right">{{ getassetIds(activity.dealContent.assetIds) }}</div>
                                        </div>
                                        <div class="w100 time-text-box-item" v-if="activity.dealContent.disposalType == 4">
                                            <div class="time-text-box-left">业务系统：</div>
                                            <div class="time-text-box-right">{{ getassetSystemId(activity.dealContent.assetSystemId) }}</div>
                                        </div>
                                        <div class="w100 time-text-box-item" v-if="activity.dealContent.disposalType == 4">
                                            <div class="time-text-box-left">业务人员：</div>
                                            <div class="time-text-box-right">{{ getassetUserId(activity.dealContent.assetUserId) }}</div>
                                        </div>
                                        <div class="w100 time-text-box-item" v-if="activity.dealContent.disposalType == 5">
                                            <div class="time-text-box-left">其他：</div>
                                            <div class="time-text-box-right" v-html="activity.dealContent.otherMsg" @click="imageEnlargement"></div>
                                        </div>
                                        <div class="w100 time-text-box-item" v-if="activity.dealContent.disposalType != 0 && activity.dealContent.disposalType != 5">
                                            <div class="time-text-box-left">备注：</div>
                                            <div class="time-text-box-right" v-html="activity.dealContent.changeLog" @click="imageEnlargement"></div>
                                        </div>
                                    </div>
                                    <div class="w100 time-text-box-item">
                                        <div class="time-text-box-left">处置结果：</div>
                                        <div class="time-text-box-right" v-html="activity.dealContent.actionResults" @click="imageEnlargement"></div>
                                    </div>
                                </div>
                                <!-- 事件溯源 -->
                                <div class="time-text-box" v-if="workTaskInfo.workOrderObject == 1&&activity.operation&&activity.operation==3">
                                    <div class="w100 time-text-box-item">
                                        <div class="time-text-box-left">溯源结果：</div>
                                        <div class="time-text-box-right" v-html="activity.dealContent.traceResult" @click="imageEnlargement"></div>
                                    </div>
                                </div>
                                <!-- 状态变更 -->
                                <div class="time-text-box" v-if="workTaskInfo.workOrderObject==1&&activity.operation&&activity.operation==1">
                                    <div class="w100 time-text-box-item">
                                        <div class="time-text-box-left">事件状态：</div>
                                        <div class="time-text-box-right">{{activity.dealContent.reportStatus|getreportStatus}}</div>
                                    </div>
                                </div>
                                <!-- 二线分析 -->
                                <div class="time-text-box" v-if="workTaskInfo.workOrderObject == 1&&activity.operation&&activity.operation==4">
                                    <div class="w100 time-text-box-item">
                                        <div class="time-text-box-left">追加建议：</div>
                                        <div class="time-text-box-right" v-html="activity.dealContent.appendProposal" @click="imageEnlargement"></div>
                                    </div>
                                </div>

                                <!-- 备注 -->
                                <div class="time-text-box" v-if="workTaskInfo.workOrderObject != 1&&workTaskInfo.workOrderObject != 2&&activity.dealContent">
                                    <div class="w100 time-text-box-item">
                                        <div class="time-text-box-left">备注：</div>
                                        <div
                                            class="time-text-box-right"
                                            v-html="activity.dealContent?activity.dealContent.remark:''"
                                            @click="imageEnlargement"></div>
                                    </div>
                                </div>

                                <!-- 审核 -->
                                <div class="time-text-box" v-if="activity.dealType&&activity.dealType==2">
                                    <div class="w100 time-text-box-item">
                                        <div class="time-text-box-left">审核意见：</div>
                                        <div class="time-text-box-right" v-html="activity.approveOpinion" @click="imageEnlargement"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="w100 time-box-item-bottom" style="margin-top: 8px;">
                                <div class="time-text-box-bottom"><i class="iconfont icon-jiediankaishishijian"></i> <span>开始：{{activity.receiveTime|NullStr}}</span></div>
                                <div class="time-text-box-bottom"><i class="iconfont icon-jiediantingliushijian"></i> <span>停留时长：<strong>{{activity.stayTime|NullStr}}</strong></span></div>
                                <div class="time-text-box-bottom"><i class="iconfont icon-jiediantingliushijian"></i> <span>超时时长：<strong>{{activity.allTime|NullStr}}</strong></span></div>
                                <div class="time-text-box-bottom"><i class="iconfont icon-chuliren"></i> <span>处理人：<strong class="users">{{activity.players|NullStr}}</strong></span></div>
                            </div>
                        </el-timeline-item>
                    </el-timeline>
                </el-row>
            </div>
            <div v-else class="ub ub-f1 ub-ac ub-pc" style="height:100%;color:#e7e7e7;font-size:16px; cursor: pointer;">
                暂无数据
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="detailDialog = false" size="small">取 消</el-button>
                <!-- <cancel-btn title="取 消" @click="detailDialog = false"/> -->
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {
    get_work_order_overview_list,
    get_statistic_workTask_detail
} from '../../server/works_order/api.js'
import 'vant/lib/index.css'
import {
    ImagePreview
} from 'vant'
export default {
    name: 'OverviewTableCopy',
    props: {
        type: {
            type: Number,
            default: 1
        },
        timeType: {
            type: Number,
            default: 0
        },
        search: {
            type: String,
            default: ''
        },
        selectTimes: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            tableHeight: document.body.clientHeight - 446,
            bpmRecord: [],
            detailDialog: false,
            totalPages: 0,
            loading: false,
            get_params: {
                page: 1,
                size: 20
            },
            total_num: 0,
            tableData: [],
            rowIndex: '-1',
            OrderIndexArr: [],
            hoverOrderArr: [],
            workTaskInfo: {
                workOrderObject: ''
            },
            oneKeyList: [],
            userList: [],
            assetList: [],
            systemList: []
        }
    },
    computed: {
        // eslint-disable-next-line vue/return-in-computed-property
        timeLabel() {
            if (this.type === 1) {
                return '耗时'
            } else if (this.type === 2) {
                return '接收时间'
            } else if (this.type === 3) {
                return '接收时间'
            } else if (this.type === 4) {
                return '创建时间'
            }
        },
        // eslint-disable-next-line vue/return-in-computed-property
        timeValue() {
            if (this.type === 1) {
                return 'time'
            } else if (this.type === 2) {
                return 'receiveTime'
            } else if (this.type === 3) {
                return 'receiveTime'
            } else if (this.type === 4) {
                return 'createTime'
            }
        }
    },
    filters: {
        getVal(item) {
            if (item.valType === 'text' || item.valType === 'richText') {
                return item.val
            }
            if (item.valType === 'select') {
                let arr = item.item
                let selected = arr.filter(tag => item.val == tag.key)
                if (selected.length > 0) {
                    return selected[0].value
                } else {
                    return ''
                }
            }
        },
        // 漏洞处置
        getdisposalLeakType(type) {
            let types = [{
                label: '补丁',
                value: 0
            }, {
                label: '升级',
                value: 1
            }, {
                label: '其他',
                value: 2
            }]
            let selected = types.filter(item => item.value == type)
            if (selected.length > 0) {
                return selected[0].label
            } else {
                return ''
            }
        },
        // 变更项
        getchangeItem(type) {
            let types = [{
                label: 'WAF规则变更',
                value: 0
            }, {
                label: 'IPS规则变更',
                value: 1
            }, {
                label: 'FW规则变更',
                value: 2
            }, {
                label: 'IDS规则变更',
                value: 3
            }]
            let selected = types.filter(item => item.value == type)
            if (selected.length > 0) {
                return selected[0].label
            } else {
                return ''
            }
        },
        getreportStatus(status) {
            if (status == 0) {
                return '待确认'
            } else if (status == 1) {
                return '已确认'
            } else if (status == 2) {
                return '已处置'
            } else if (status == 3) {
                return '已驳回'
            }
        },
        // 处置方式
        getdisposalType(type) {
            let types = [{
                label: '一键封堵',
                value: 0
            }, {
                label: '阻断规则变更',
                value: 1
            }, {
                label: '检测规则变更',
                value: 2
            }, {
                label: '访问规则变更',
                value: 3
            }, {
                label: '业务安全检查变更',
                value: 4
            }, {
                label: '其他',
                value: 5
            }]
            let selected = types.filter(item => item.value == type)
            if (selected.length > 0) {
                return selected[0].label
            } else {
                return ''
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.get_data()
        })
    },
    methods: {
        tableRowClassNameTwo({ row, rowIndex }) {
            if (rowIndex % 2) {
                return 'table-row2'
            } else {
                return 'table-row1'
            }
        },
        // 业务人员
        getassetUserId(type) {
            let selected = this.userList.filter(item => item.id == type)
            if (selected.length > 0) {
                return selected[0].chineseName
            } else {
                return ''
            }
        },
        // 业务系统
        getassetSystemId(type) {
            let selected = this.systemList.filter(item => item.id == type)
            if (selected.length > 0) {
                return selected[0].system_name
            } else {
                return ''
            }
        },
        // 设备
        getassetIds(type) {
            let selected = this.assetList.filter(item => item.id == type)
            if (selected.length > 0) {
                return selected[0].name
            } else {
                return ''
            }
        },
        getObjs(objs) {
            let arr = []
            if (objs.length > 0) {
                objs.forEach(item => {
                    let selected = this.oneKeyList.filter(tag => tag.id === item)
                    if (selected.length > 0) {
                        arr.push(selected[0].device_name)
                    }
                })
            }
            return arr.join(',')
        },
        handdeelIps(ips) {
            if (typeof ips === 'string') {
                return ips
            } else {
                return ips.join(',')
            }
        },
        // 富文本图片预览
        imageEnlargement(e) {
            console.log(e)
            if (e.target.nodeName == 'IMG') { // 判断点击富文本内容为img图片
                // this.eduitURL = e.target.currentSrc;
                ImagePreview({
                    images: [e.target.currentSrc], // 获取当前图片src
                    showIndex: false,
                    loop: false,
                    closeable: true
                })
            } else {
                console.log('点击内容不为img')
            }
        },
        handleSeeaRecord(row) {
            this.detailDialog = true
            this.workTaskInfo.workOrderObject = row.workOrderObject
            this.assetList = row.disposeData.assets ?? []
            this.userList = row.disposeData.users ?? []
            this.systemList = row.disposeData.systems ?? []
            this.oneKeyList = row.disposeData.closeObject ?? []
            console.log(row)
            this.get_history(row.workOrderId)
        },
        get_history(workOrderId) {
            let data = {
                queryData: {},
                paramsData: {
                    workOrderId: workOrderId
                }
            }
            get_statistic_workTask_detail(data).then(res => {
                console.log('工单任务详情', res)

                let arr = []
                if (res.length > 0) {
                    res.forEach((item, index) => {
                        item.size = 'large'
                        item.isOpen = true
                        item.color = 'rgba(0,0,0,1)'
                        item.icon = index === 0 ? 'el-icon-circle-check' : 'iconfont icon-circle'
                        item.dealContent = JSON.parse(item.dealContent)
                        arr.push(item)
                    })
                }
                this.bpmRecord = arr
            }).catch(err => {
                console.log(err, 'err')
            })
        },
        reset() {
            this.get_params.page = 1
        },
        arraySpanMethod({ row, column, rowIndex, columnIndex }) {
            if (columnIndex !== 0) {
                return [1, 3]
            }
        },
        tableRowClassName({ row, rowIndex }) {
            let arr = this.hoverOrderArr
            for (let i = 0; i < arr.length; i++) {
                if (rowIndex == arr[i]) {
                    return 'hovered-row'
                }
            }
        },

        cellMouseEnter(row, column, cell, event) {
            this.rowIndex = row.rowIndex
            this.hoverOrderArr = []
            this.OrderIndexArr.forEach(element => {
                if (element.indexOf(this.rowIndex) >= 0) {
                    this.hoverOrderArr = element
                }
            })
        },

        cellMouseLeave(row, column, cell, event) {
            this.rowIndex = '-1'
            this.hoverOrderArr = []
        },
        get_data() {
            let data = {
                queryData: {
                    page: this.get_params.page,
                    pageSize: this.get_params.size
                },
                paramsData: {
                    type: this.type,
                    startTime: '',
                    endTime: '',
                    name: this.search
                }
            }
            console.log('this.timeType', this.timeType)
            if (this.timeType === 1) {
                /* 星期*/
                data.paramsData.startTime = this.dateFormat(1)
                data.paramsData.endTime = this.dateFormat()
            } else if (this.timeType === 2) {
                /* 月份*/
                data.paramsData.startTime = this.dateFormat(2)
                data.paramsData.endTime = this.dateFormat()
            } else if (this.selectTimes) {
                data.paramsData.startTime = this.selectTimes ? this.selectTimes[0] : ''
                data.paramsData.endTime = this.selectTimes ? this.selectTimes[1] : ''
            }
            this.loading = true
            this.tableData = []
            get_work_order_overview_list(data).then(res => {
                console.log(res, '111111111工单列表')
                this.loading = false
                this.total_num = res.total
                let list = res.records
                if (list.length > 0) {
                    this.tableData = list
                    this.$nextTick(() => {
                        this.$refs.multipleTable.doLayout()
                    })
                }
            }).catch(err => {
                this.loading = false
                console.log(err, 'err')
            })
        },
        dateFormat(val) {
            var date0 = Date.now()// 时间戳为10位需*1000，时间戳为13位的话不需乘1000
            if (val === 1) {
                date0 = date0 - 7 * 24 * 60 * 60 * 1000
            } else if (val === 2) {
                date0 = date0 - 30 * 24 * 60 * 60 * 1000
            }
            var date = new Date(date0)
            var Y = date.getFullYear() + '-'
            var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
            var D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' '
            var h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':'
            var m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':'
            var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
            return Y + M + D + h + m + s
        },
        handleSizeChange(val) {
            this.get_params.size = val
            this.get_data()
        },
        handleCurrentChange(val) {
            this.get_params.page = val
            this.get_data()
        },
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        }
    }
}
</script>

<style lang="scss" scoped>

.bigTable {
    ::v-deep .caret-wrapper {
        height: 22px;
    }
    ::v-deep .sort-caret.ascending {
        border-bottom-color: #fff;
        top: 0;
    }
    ::v-deep .sort-caret.descending {
        border-top-color: #fff;
        bottom: 0;
    }
    ::v-deep .descending .sort-caret.descending {
        border-top-color: #01fdfe;
    }
    ::v-deep .ascending .sort-caret.ascending {
        border-bottom-color: #01fdfe;
    }
}

.event ::v-deep .el-timeline-item__timestamp.is-top {
    margin-bottom: 8px;
    padding-top: 3px;
    position: absolute;
    left: -145px;
    top: 0;
    font-size: 12px;
    width: 130px;
    text-align: right;
    color: rgba(0, 0, 0, 0.9);
}

.event ::v-deep .el-range-input {
    background-color: rgba(0, 0, 0, 0);
    color: #fff;
}

.event ::v-deep .el-range-separator {
    color: #fff;
}

.el-tabs ::v-deep .el-tabs__nav-wrap::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1px;
    background-color: rgba(28, 215, 250, 0.2);
    z-index: 1;
}

.el-tabs ::v-deep .el-tabs__active-bar {
    background: #1cd7fa;
    margin-left: 14px;
}

.el-tabs ::v-deep .el-tabs__item.is-active {
    color: #1cd7fa;
    height: 34px;
    line-height: 34px;
    border-color: transparent;
}

.el-tabs ::v-deep .el-tabs__item.is-top {
    margin-left: 14px;
    color: #1cd7fa;
    border-bottom: 2px solid #1cd7fa;
}

.task-status {
    padding-right: 30px;
    box-sizing: border-box;
    margin: 16px 0 30px;
}

.task-status>div:nth-child(1) {
    color: #fff;
    font-size: 22px;
}

.assets-big-image ::v-deep .el-image-viewer__close {
    color: #00E1FF !important;
}

.task-status>div:nth-child(2) {
    color: #fff;
    font-size: 12px;

    span.one {
        color: #c0c0c0;
    }

    span.two {
        color: #fdb900;
    }

    span.three {
        color: #00bffe;
    }
}

.label {
    width: 100px;
    font-size: 12px;
    color: #999;
    text-align: right;
    margin-right: 15px;
}

.label-val {
    font-size: 12px;
    color: #fff;
}

.event ::v-deep .el-timeline-item__tail {
    border-left: 2px solid #00B7EE !important;
}
.event ::v-deep .el-timeline-item__node--large {
    z-index: 2;
    background-color: #387dee!important;
}

.event ::v-deep .el-timeline-item__icon.el-icon-circle-check {
    color: #fff !important;
    font-size: 20px !important;
}

.event ::v-deep .el-timeline-item__icon.icon-circle {
    color: #00b7ee !important;
    font-size: 16px !important;
    font-weight: 500;
}

.time-box {
    width: 100%;
}

.time-left>h4 {
    color: #fff;
    font-weight: 500;
}

.time-left>p {
    color: #999;
    font-size: 12px;
    margin-top: 5px;
}

.time-right>div.one {
    color: #c0c0c0;
}

.time-right>div.two {
    color: #fdb900;
}

.time-right>div.three {
    color: #00bffe;
}

.time-right>p {
    color: #fff;
    font-size: 12px;
    margin-top: 5px;
}
</style>
<style>
    .time-text-box {
        padding: 5px;
        background-color: #f5f8fe;
        border-radius: 3px;
        border: solid 1px #dddddd;
    }
    .time-text-box-item {
        margin: 10px 0;
        overflow: hidden;
    }
    .time-text-box-left {
        float: left;
        font-size: 12px;
        letter-spacing: 1px;
        color: rgba(0, 0, 0, 0.4);
        margin-right: 10px;
        vertical-align: top;
    }
    .time-box-item-bottom div {
        display: inline-block;
    }
    .time-text-box-bottom {
        margin-right: 40px;
    }
    .time-text-box-bottom i {
        font-size: 10px;
        color: #999;
    }
    .time-text-box-bottom span {
        font-size: 10px;
        color: #999;
    }
    .time-text-box-right {
        width: 88%;
        float: left;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.9);
        vertical-align: top;
    }
    .time-text-box-right * {
        word-break: break-all;
    }

    .time-text-box-right p {
        font-size: 12px !important;
    }

    .time-text-box-right img {
        max-width: 50% !important;
    }
    .work-overview-inner.el-table--border::after, .work-overview-inner.el-table--group::after, .work-overview-inner.el-table::before {
        background-color: rgba(0,0,0,0) !important;
    }
    .work-overview-inner.el-table tbody>tr td {
        max-height: 36px!important;
    }
    .work-overview-inner.el-table tbody>tr:last-of-type td {
        border-bottom: 1px solid rgba(0,0,0,0) !important;
    }
    .white-theme .work-overview-inner.el-table--border::after, .white-theme .work-overview-inner.el-table::before {
        background-color: rgba(0,0,0,0) !important;
    }
</style>
