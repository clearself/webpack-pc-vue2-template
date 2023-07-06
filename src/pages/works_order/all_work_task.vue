<template>
    <div class="event" v-loading.fullscreen.lock="fullscreenLoading"  element-loading-text="拼命下载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0,0,0,.5)">
        <div class="ub tab-button">
            <div @click="currentTabWrap = 'all'" :class="{'tab-active': currentTabWrap === 'all'}">全部工单</div>
            <!-- <div @click="currentTabWrap = 'safe'" :class="{'tab-active': currentTabWrap === 'safe'}">安全审查任务管理</div> -->
        </div>
        <div class="w100" v-show="currentTabWrap == 'all'">
            <div class="ub w100 search-area" style="box-sizing: border-box;">
                <SearchTop @search="searchCheck" @reset="reset">
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="工单名称：" label-width="70px">
                                <el-input
                                    placeholder="请输入"
                                    clearable
                                    v-model.trim="get_params.workOrderName"
                                    @keyup.enter.native="searchCheck"
                                    size="small"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="工单类型：" label-width="70px">
                                <el-select filterable clearable v-model="get_params.workOrderObject" size="small" style="width: 100%;" placeholder="请选择">
                                    <el-option v-for="(item, index) in workTypeList" :key="index" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="优先级：" label-width="70px">
                                <el-select
                                    placeholder="请选择"
                                    clearable
                                    style="width: 100%;"
                                    v-model="get_params.level"
                                    size="small">
                                    <el-option label="高" value="1"></el-option>
                                    <el-option label="中" value="2"></el-option>
                                    <el-option label="低" value="3"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="创建时间：" label-width="70px">
                                <el-date-picker
                                    size="small"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    v-model="sayTimes"
                                    style="width: 280px;"
                                    type="datetimerange"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    :default-time="['00:00:00', '23:59:59']"
                                ></el-date-picker>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </SearchTop>
            </div>
            <div class="list-container table-area">
                <div class="ub ub-pj w100" style="margin-bottom: 10px;">
                    <div class="list-tips">列表内容</div>
                    <div>
                        <el-button v-if="currentTab == 3" icon="el-icon-plus" type="primary" size="small" @click="handleAddTemplate">发起工单</el-button>
                        <el-button v-per="['work_all_export']" icon="iconfont icon-daochu" type="primary" size="small" @click="exportExcel">导 出</el-button>
                    </div>
                </div>
                <el-table
                    :row-class-name="tableRowClassName"
                    :height="tableHeight"
                    ref="multipleTable"
                    v-loading="loading"
                    class='bigTable full-table'
                    :data="tableData"
                    border
                    stripe
                    tooltip-effect="dark"
                    @selection-change="handleSelectionChange">
                    <!--<el-table-column type="selection" width="40"></el-table-column>-->
                    <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                    </el-table-column>
                    <el-table-column prop="workOrderId" label="工单编号" width="135">
                    </el-table-column>
                    <el-table-column prop="workOrderName" label="工单名称" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="workMouldName" label="工单模板" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column label="工单来源" width="70" show-overflow-tooltip>
                        <template slot-scope="{row}">
                            <span>{{row.orderFrom?'自动':'手动'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="level" label="优先级" width="100" align="center" sortable>
                        <template slot-scope="{row}">
                            <div>
                                <div>
                                    <span v-if="row.level == 1" style="color: #ff0000;">高</span>
                                    <span v-if="row.level == 2" style="color: #f2cd00;">中</span>
                                    <span v-if="row.level == 3" style="color: #48ccca;">低</span>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column label="工单类型" width="70" show-overflow-tooltip>
                        <template slot-scope="{row}">
                            <div>
                                {{row.workOrderObjectName|NullStr}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="" width="100" align="center">
                        <template slot="header">
                            <span>
                                工单状态
                                <el-popover popper-class="popover" placement='bottom' width='80' height='350' trigger="click">
                                    <span slot="reference" style="padding: 0 5px;cursor: pointer;">
                                        <i class="iconfont icon-filter-fill" style="color: #387dee;"></i>
                                    </span>
                                    <div class="w100 popover-list" @click="shaixuan_status">
                                        <div style="font-size: 12px;" data-type="">默认</div>
                                        <div style="font-size: 12px;" data-type="0">已撤销</div>
                                        <div style="font-size: 12px;" data-type="1">进行中</div>
                                        <div style="font-size: 12px;" data-type="2">已完成</div>
                                    </div>
                                </el-popover>
                            </span>
                        </template>
                        <template slot-scope="{row}">
                            <div>
                                <div>
                                    <span v-if="row.status == 0" style="color: #ff3a3a;">已撤销</span>
                                    <span v-if="row.status == 1" style="color: #08a508;">进行中</span>
                                    <span v-if="row.status == 2" style="color: #00c0ff;">已完成</span>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="runningNodeName" label="当前节点" width="140" show-overflow-tooltip>
                        <template slot-scope="{row}">
                            <div>
                                <span v-if="row.runningNodeName.length">{{row.runningNodeName.join(',')}}</span>
                                <span v-else>--</span>
                            </div>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="createTime" label="创建时间" width="150">
                    </el-table-column> -->
                    <el-table-column prop="createUser" label="创建人" width="100">
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="160">
                        <template slot-scope="scope">
                            <!--<el-button type="text" @click="seeWorkImg(scope.row)">流程图</el-button>-->
                            <el-button size="small" v-per="['work_all_view']" type="text" @click="handleSee(scope.row)">查看</el-button>
                            <el-button size="small" v-per="['work_all_revoke']" type="text" :disabled="scope.row.status != 1" @click="revertWork(scope.row)">撤销</el-button>
                            <el-button size="small" v-per="['work_all_del']" type="text" :disabled="scope.row.status != 2 && scope.row.status != 0" @click="handleDelete(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination v-show="total_num>0" :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size" @pagination="get_data" />
            </div>
        </div>
        <TaskManage v-show="currentTabWrap == 'safe'" page="work_task"></TaskManage>
        <!--删除资源-->
        <DeleteDialog
            :dialogVisible = deleteDialog
            @delete="handleDeleteFun"
            @cancel="deleteDialog = false">
        </DeleteDialog>
        <!--撤销-->
        <el-dialog title="撤销工单" :visible.sync="revertDialog" width="30%" custom-class="attendance-dialog">
            <span>确定撤销工单吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" @click="handleRevertFun">确 定</el-button>
                <el-button size="small" @click="revertDialog = false">取 消</el-button>
                <!-- <searchBtn title="确 定" @click="handleRevertFun"/>
                <cancel-btn title="取 消" @click="revertDialog = false"/> -->
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {
    get_all_workTaskAllTask,
    get_workObjectAllTask,
    get_workTemplateAllTask,
    revert_workTaskAllTask,
    delete_workTaskAllTask,
    exportWorkTaskExcelAllTask
} from '../../server/works_order/define.js'
import TaskManage from '@/pages/works_order/task_manage/index'
export default {
    name: 'WorkObject',
    components: {
        TaskManage
        // dropdownBox,
        // bpmnModeler
    },
    data() {
        return {
            currentTabWrap: 'all',
            tableHeight: document.body.clientHeight - 270,

            count: 0,

            currentTab: '1',
            revertParams: {
                processInstanceId: '',
                workOrderId: ''
            },
            fullscreenLoading: false,
            that: this,
            seeActive: 'first',
            seeDialog: false,
            revertDialog: false,
            seeForm: {},
            workTypeList: [], // 工单类型
            flag: null,
            config_id: '',
            addDialog: false,
            addForm: {
                workOrderName: '',
                workMouldId: '',
                level: '',
                workOrderContent: ''
            },
            allUserList: [], // 所有人
            allDepList: [], // 所有部门
            allRolesList: [], // 所有角色
            sendObjectList: [], // 工单发起对象
            allTemplate: [], // 当前登录人可用的模板
            alarmList: [], // 事件字段
            conditionList: [], // 条件字段
            leakList: [], // 漏洞字段
            dataList: [
                {
                    name: '资产负责人',
                    type: '3',
                    id: 0
                },
                {
                    name: '事件创建人',
                    type: '3',
                    id: 1
                }
            ],
            rules: {
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
            workStatus: false,
            currentWorkIds: [],
            deleteDialog: false,
            personFlag: false,
            deleteId: '',
            formLabelWidth: '120px',
            loading: false,
            total_num: 0,
            multipleSelection: [],
            itemSelection: [],
            tableData: [],
            sayTimes: [],
            get_params: {
                page: 1,
                size: 20,
                workOrderObject: '',
                workOrderName: '',
                level: '',
                type: '1',
                status: ''
            }
        }
    },
    watch: {
        addDialog: {
            handler(newVal, oldVal) {
                // console.log(newVal, oldVal,'---------------------')
                if (!newVal) {
                    this.$refs.addForm.resetFields()
                }
            }
        }
    },
    mounted() {
        this.init()
        this.$nextTick(() => {
            this.get_data()
        })
    },
    methods: {
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex % 2) {
                return 'table-row2'
            } else {
                return 'table-row1'
            }
        },
        reset() {
            this.sayTimes = []
            this.get_params = {
                page: 1,
                size: 20,
                workOrderObject: '',
                workOrderName: '',
                level: '',
                type: '1',
                status: ''
            }
            this.get_data()
        },
        downLoad() {
            window.location.href = '/api/works_order/manage/assets/template'
        },
        exportExcel() {
            if (this.fullscreenLoading) return
            let data = { paramsData: {}, queryData: {}}
            this.fullscreenLoading = true
            exportWorkTaskExcelAllTask(data).then(res => {
                console.log(res, '查看下载')
                this.fullscreenLoading = false
                // let url = window.URL.createObjectURL(new Blob([res], {
                //     type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                // }))
                // let link = document.createElement('a')
                // link.style.display = 'none'
                // link.href = url
                // link.setAttribute('download', '全部工单.xlsx')
                // document.body.appendChild(link)
                // link.click()
                // document.body.removeChild(link) // 下载完成移除元素
                // window.URL.revokeObjectURL(url) // 释放掉blob对象
            }).catch(err => {
                this.fullscreenLoading = false
                console.log(err + 'err')
            })
        },
        handleSee(row) {
            this.$setsessionStorage('currentTab', this.currentTab)
            this.$setsessionStorage('workTaskInfo', row)
            this.$router.push({
                name: 'all_work_task_detail'
            })
        },
        getStyle() {
            console.log(window.screen.width)
            let ws = window.screen.width
            if (ws >= 1680) {
                return {
                    width: '220px'
                }
            } else if (ws < 1680) {
                return {
                    width: '156px'
                }
            }
        },
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        indexInnerMethod(index) {
            return (this.get_inner_params.page - 1) * this.get_inner_params.size + index + 1
        },
        tabClick(val = '1') {
            this.currentTab = val
            val === '1' && (this.get_params.type = 1)
            val === '2' && (this.get_params.type = 2)
            val === '3' && (this.get_params.type = 3)
            this.get_data()
        },
        handleAddTemplate() {
            this.addDialog = true
        },

        searchCheck() {
            this.get_params.page = 1
            this.get_data()
        },
        searchCheckItem() {
            this.get_inner_params.page = 1
            this.get_Item()
        },
        shaixuan_status(e) {
            this.get_params.status = e.target.dataset.type
            this.get_data()
        },

        get_data() {
            this.loading = true
            this.tableData = []
            let uid = this.config_id = new Date().getTime()
            let data = {
                queryData: {
                    page: this.get_params.page,
                    pageSize: this.get_params.size
                },
                paramsData: {
                    // type: this.get_params.type,
                    workOrderObject: this.get_params.workOrderObject,
                    workOrderName: this.get_params.workOrderName,
                    level: this.get_params.level,
                    status: this.get_params.status,
                    timeStart: this.sayTimes && this.sayTimes.length > 0 ? this.sayTimes[0] : '',
                    timeEnd: this.sayTimes && this.sayTimes.length > 0 ? this.sayTimes[1] : ''
                    // startTime: this.sayTimes && this.sayTimes.length > 0 ? this.sayTimes[0] : '',
                    // endTime: this.sayTimes && this.sayTimes.length > 0 ? this.sayTimes[1] : '',
                }
            }
            get_all_workTaskAllTask(data).then(res => {
                console.log('任务列表', res)
                this.loading = false
                if (this.config_id !== uid) {
                    return
                }
                this.total_num = res.total
                let list = res.records
                if (list.length > 0) {
                    list.forEach(item => {
                        let obj = {}
                        obj.createTime = item.createTime
                        obj.createUser = item.createUser
                        obj.deploymentId = item.deploymentId
                        obj.outTime = item.outTime
                        obj.status = item.status
                        obj.currentTime = item.currentTime
                        obj.currentNodeStatus = ''
                        obj.workMouldName = item.workMouldName ? item.workMouldName : '--'
                        obj.workMouldId = item.workMouldId
                        obj.workOrderContent = item.workOrderContent
                        obj.nodeIds = item.nodeIds
                        let _outTime = new Date(item.outTime).getTime()
                        let _currentTime = new Date(item.currentTime).getTime()
                        if (item.status == 1) {
                            obj.currentNodeStatus = _currentTime > _outTime ? '已超时' : '待处理'
                        } else if (item.status == 0) {
                            obj.currentNodeStatus = '已撤销'
                        } else if (item.status == 2) {
                            obj.currentNodeStatus = '已完成'
                        }

                        obj.nodeDes = item.nodeDes
                        obj.dealType = item.dealType
                        if (item.operation || item.operation === 0) {
                            obj.operation = item.operation
                        }
                        if (item.disposeData) {
                            obj.disposeData = this.$deepCopy(item.disposeData)
                        }
                        if (item.fields) {
                            obj.fields = item.fields
                        }

                        obj.players = item.players
                        obj.approveOpinion = item.approveOpinion
                        obj.approve = item.approve
                        obj.nodeId = item.nodeId
                        obj.level = item.level
                        obj.processInstanceId = item.processInstanceId
                        obj.receiveTime = item.receiveTime ? item.receiveTime : '--'
                        obj.runningNodeName = item.runningNodeName
                        obj.sourceId = item.sourceId

                        obj.taskId = item.taskId
                        obj.workOrderContent = item.workOrderContent
                        obj.workOrderId = item.workOrderId
                        obj.workOrderObject = item.workOrderObject
                        obj.workOrderName = item.workOrderName
                        obj.workOrderObjectName = item.workOrderObjectName
                        obj.orderFrom = item.orderFrom
                        obj.userIds = item.userIds
                        this.tableData.push(obj)
                    })
                }
            }).catch(error => {
                this.loading = false
                console.log('error' + error)
            })
        },
        init() {
            this.get_sendObject()
            this.get_workMound()
        },
        get_sendObject() {
            get_workObjectAllTask({ queryData: {}, paramsData: {}}).then(res => {
                console.log('工单发起对象', res)
                this.workTypeList = res
            }).catch(err => {
                console.log(err, 'err')
            })
        },
        get_workMound() {
            get_workTemplateAllTask({ queryData: {}, paramsData: {}}).then(res => {
                console.log('可用工单模板', res)
                this.allTemplate = res
            }).catch(err => {
                console.log(err, 'err')
            })
        },
        revertWork(row) {
            this.revertParams.processInstanceId = row.processInstanceId
            this.revertParams.workOrderId = row.workOrderId
            this.revertDialog = true
        },
        handleRevertFun() {
            let data = {
                processInstanceId: this.revertParams.processInstanceId,
                workOrderId: this.revertParams.workOrderId
            }
            revert_workTaskAllTask({ queryData: {}, paramsData: data }).then(res => {
                this.revertDialog = false
                this.$message({
                    message: '撤销成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(error => {
                this.revertDialog = false
                console.log(error + 'error')
            })
        },
        handleDelete(row) {
            this.deleteId = [`${row.workOrderId}`]
            this.deleteDialog = true
        },
        handleDeleteFun() {
            let data = {
                workOrderIds: this.deleteId
            }
            delete_workTaskAllTask({ paramsData: data, queryData: {}}).then(res => {
                this.deleteDialog = false
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(error => {
                this.deleteDialog = false
                console.log(error + 'error')
            })
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
        }
    },
    beforeDestroy() {
        if (this.flag) {
            clearTimeout(this.flag)
            this.flag = null
        }
    }
}
</script>

<style lang="scss" scoped>
.custom-star {
    .tab-button {
        border: solid 1px #50b0ff;
        background-color: rgba($color: #136dac, $alpha: 20%);
        box-shadow: inset 0 0 18px 0
            #00b4ff;
    }
}
.tab-button {
    height: 32px;
    border: 1px solid #dadee8;
    border-radius: 4px 4px 0 0;
    background-color: #ffffff;

    // margin-bottom: 2px;
    & div {
        margin-right: 10px;
        width: 120px;
        height: 31px;
        font-size: 14px;
        // border: 1px solid #76dee2;
        border-radius: 2px;
        text-align: center;
        // background: url("../../../assets/img/tab_btn.jpg") 100% 100% no-repeat;
        color: rgb(0 0 0 / 60%);
        line-height: 32px;
        cursor: pointer;
        box-sizing: border-box;
        &.tab-active {
            border-bottom: 1px solid #387dee;
            color: #387dee;
            // background: url("../../../assets/img/tab_active.jpg") 100% 100% no-repeat;
        }
    }
}
.el-input.ips {
    display: block;
    width: 100%;
}
.popover-list > div {
    height: 30px;
    font-size: 15px;
    text-align: center;
    color: #496573;
    line-height: 30px;
    cursor: pointer;
    &:hover {
        color: #387dee;
    }
}
.el-link {
    cursor: pointer;
}
.drawer-pad {
    padding: 0 20px;
}
.domain-add {
    line-height: 1;
    position: relative;
    padding: 0 20px;
    color: #1cd7fa;
    .el-button {
        position: absolute;
        top: 0;
        right: 20px;
        padding: 0;
        color: #1cd7fa;
    }
}
.domain-list {
    margin: 3px 0 20px;
    padding: 20px 0 1px;
    background: rgb(0 0 0 / 30%);
    .list-tit {
        width: 100px;
        text-align: right;
    }
    .ub {
        margin-bottom: 20px;
    }
    .list-btn {
        padding-left: 20px;
        .el-button {
            color: #f56c6c;
        }
    }
}
.event  ::v-deep  .el-range-input {
    background-color: rgb(0 0 0 / 0%);
}
.event  ::v-deep  .el-range-separator {
    color: #ffffff;
}
.event  ::v-deep  .el-radio {
    margin: 0 150px 0 30px;
}
.event  ::v-deep  .el-form-item__label {
    padding: 0;
}
.event  ::v-deep  .el-upload-list__item-name {
    color: #01e9ff;
    i {
        color: #01e9ff;
    }
}
.attendance-list.table-area {
    margin-top: 10px;
    padding: 10px;
    border: solid 1px #dadee8;
    border-radius: 4px;
    background-color: #ffffff;
    box-shadow: 0 0 8px 0 rgb(140 152 164 / 20%);
    .pagination {
        margin-top: 20px;
        text-align: right;
    }
}
.event ::v-deep .edui-editor-iframeholder {
    height: 200px !important;
}
.event  ::v-deep  .drawer-content {
    .box-title {
        margin: 30px 0 20px;
        font-size: 14px;
        color: #00e9ff;
    }
    .label {
        margin-right: 15px;
        width: 60px;
        font-size: 12px;
        text-align: right;
        color: #999999;
    }
    .label-val {
        font-size: 12px;
        color: #ffffff;
        img {
            max-width: 300px;
        }
    }
}
.event  ::v-deep  .condition-box {
    .part-condition {
        margin-bottom: 10px;
    }
    .condition_black {
        margin-right: 6px;
        font-size: 12px;
        color: #999999;
    }
    .condition_white {
        margin-right: 6px;
        font-size: 12px;
        color: #ffffff;
    }
}
.event  ::v-deep  .warn-wrapper {
    padding-left: 10px;
    width: 640px;
    border-radius: 2px;
    background: rgb(0 0 0 / 20%);
    box-sizing: border-box;
    & p {
        margin: 5px 0;
        font-size: 12px;
        &.warn-top {
            color: #ffffff;
            opacity: 0.6;
        }
        &.warn-body {
            color: #ffffff;
            word-break: break-all;
        }
    }
}
.event  ::v-deep  .pic-wrapper {
    overflow: auto;
    width: 99%;
    height: calc(100vh - 190px);
    border: 1px solid #1cd7fa;
}
</style>
<style>
.edui-default .edui-editor {
    /* border: 1px solid #01e9ff !important; */
    background-color: rgb(0 0 0 / 0%) !important;
}
.edui-default .edui-editor-toolbarboxouter {
    /* border-bottom: 1px solid #01e9ff !important; */
    background-color: rgb(0 0 0 / 0%) !important;
}
#edui_fixedlayer {
    z-index: 999999 !important;
}
.nav-tips {
    pointer-events: none !important;
}

/* 下拉菜单 */
.el-dropdown-link.active {
    font-size: 12px;
    color: #409eff;
}
.el-dropdown-menu__item {
    padding: 0 20px !important;
}
</style>
