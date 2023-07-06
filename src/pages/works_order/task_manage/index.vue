<template>
    <div>
        <div class="ub w100 search-area" style="box-sizing: border-box;">
            <SearchTop @search="searchCheck" :has-more="false" @reset="reset">
                <el-col :md="12" :lg="8" :xl="6">
                    <el-form :model="get_params">
                        <el-form-item label="任务名称：" label-width="80px">
                            <el-input placeholder="请输入" clearable v-model="get_params.taskName" @keyup.enter.native="searchCheck" size="small"></el-input>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :md="12" :lg="8" :xl="6">
                    <el-form :model="get_params">
                        <el-form-item label="任务状态：" label-width="80px">
                            <el-select v-model="get_params.taskStatus" filterable placeholder="请选择" style="width: 100%;" size="small" clearable>
                                <el-option label="未开始" value="1"></el-option>
                                <el-option label="进行中" value="2"></el-option>
                                <el-option label="已完成" value="3"></el-option>
                                <el-option label="已撤销" value="4"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :md="12" :lg="8" :xl="6">
                    <el-form :model="get_params">
                        <el-form-item label="创建时间：" label-width="90px">
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
        <div class="list-container">
            <div class="ub ub-pj ub-ac w100 mb-1">
                <div class="list-tips">列表内容</div>
                <div v-if="page !== 'work_task'">
                    <el-button size="small" type="primary" v-per="['safety_task_add']" @click="addDialog = true" icon="el-icon-plus">添加</el-button>
                    <el-button style="margin-left: 10px;" v-per="['safety_task_del']" @click="handleDeleteAll" size="small" type="danger" icon="el-icon-delete">刪 除</el-button>
                </div>
            </div>
            <el-table
                :height="tableHeight"
                :row-class-name="tableRowClassName"
                ref="multipleTable"
                v-loading="loading"
                class="bigTable full-table"
                :data="tableData"
                border
                stripe
                tooltip-effect="dark"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="50"></el-table-column>
                <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号"></el-table-column>
                <el-table-column prop="taskName" label="任务名称" show-overflow-tooltip></el-table-column>
                <el-table-column prop="templateName" label="模板名称"></el-table-column>
                <el-table-column prop="taskStatus" label="任务状态">
                    <template slot-scope="scope">
                        <div>
                            <span
                                style="display: inline-block;width: 140px;border-radius: 24px;text-align: center; color: rgb(0 0 0 / 40%);background-color: #e2e6e9; heihgt: 20px;"
                                v-if="scope.row.taskStatus == 1"
                            >
                                未开始
                            </span>
                            <span
                                style="display: inline-block;width: 140px;border-radius: 24px;text-align: center;color: #03864f;background-color: #ccf5e4; heihgt: 20px;"
                                v-if="scope.row.taskStatus == 2"
                            >
                                进行中
                            </span>
                            <span
                                style="display: inline-block;width: 140px;border-radius: 24px;text-align: center;color: #0052d9;background-color: #d5e5fa; heihgt: 20px;"
                                v-if="scope.row.taskStatus == 3"
                            >
                                已完成
                            </span>
                            <span
                                style="display: inline-block;width: 140px;border-radius: 24px;text-align: center;color: #a502cf;background-color: #fad7f6; heihgt: 20px;"
                                v-if="scope.row.taskStatus == 4"
                            >
                                已撤销
                            </span>
                            <span
                                style="display: inline-block;width: 140px;border-radius: 24px;text-align: center;color: #aa0202;background-color: #fad7dd; heihgt: 20px;"
                                v-if="scope.row.taskStatus == 5"
                            >
                                已延迟
                            </span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="taskType" label="任务类型"></el-table-column>
                <el-table-column prop="taskTime" label="任务起止时间" show-overflow-tooltip></el-table-column>
                <el-table-column prop="des" label="描述" show-overflow-tooltip></el-table-column>
                <el-table-column prop="createUser" label="创建人" width="160"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="160"></el-table-column>
                <el-table-column label="操作" align="center" width="240" v-if="page !== 'work_task'">
                    <template slot-scope="scope">
                        <el-button :disabled="scope.row.taskStatus != 1 || new Date().getTime() > new Date(scope.row.endDate + ' 23:59:59').getTime()" v-per="['safety_task_issue']" type="text" @click="handleDistribute(scope.row)" size="small">
                            下发
                        </el-button>
                        <el-button :disabled="scope.row.taskStatus != 2 || new Date().getTime() < new Date(scope.row.startDate).getTime()" v-per="['safety_task_reminder']" type="text" @click="press(scope.row)" size="small">催办</el-button>
                        <el-button :disabled="scope.row.taskStatus != 2" v-per="['safety_task_cancel']" type="text" @click="cancel(scope.row)" size="small">撤销</el-button>
                        <el-button v-per="['safety_task_look']" type="text" @click="detail(scope.row)" size="small">详情</el-button>
                        <el-button :disabled="scope.row.taskStatus != 1" v-per="['safety_task_edit']" type="text" @click="edit(scope.row)" size="small">编辑</el-button>
                        <el-button :disabled="scope.row.taskStatus != 1" v-per="['safety_task_del']" type="text" @click="deleteTask(scope.row)" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="total_num > 0" :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size" @pagination="get_data" />
        </div>
        <el-dialog :title="taskForm.id ? '编辑任务' : '添加任务'" :visible.sync="addDialog" width="700px" custom-class="common-dialog">
            <el-form :model="taskForm" :rules="rules" ref="taskForm" label-position="top">
                <el-form-item label="任务名称：" prop="taskName" :label-width="formLabelWidth">
                    <el-input placeholder="请输入任务名称" clearable v-model="taskForm.taskName" size="small"></el-input>
                </el-form-item>
                <el-form-item label="任务类型：" prop="taskType" :label-width="formLabelWidth">
                    <el-input placeholder="请输入任务类型" clearable v-model="taskForm.taskType" size="small"></el-input>
                </el-form-item>
                <el-form-item label="起止时间：" prop="time" :label-width="formLabelWidth">
                    <el-date-picker
                        v-model="taskForm.time"
                        type="daterange"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        style="width: 100%;"
                        value-format="yyyy-MM-dd"
                        size="small"
                        clearable
                    ></el-date-picker>
                </el-form-item>
                <el-form-item style="width: 100%;" prop="template" label="选择模板：" :label-width="formLabelWidth">
                    <el-select placeholder="请选择" style="width: 100%;" v-model="taskForm.template" size="small">
                        <el-option v-for="(item, index) in templates" :key="index" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="width: 100%;" label="任务描述：" :label-width="formLabelWidth">
                    <el-input placeholder="请输入任务描述" maxlength="400" type="textarea" clearable v-model="taskForm.des" size="small"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <Debounce :time="1500" :isDebounce="2"><el-button size="small" type="primary" @click.native="submitTaskForm('taskForm')">确 定</el-button></Debounce>
                <el-button size="small" @click="cancelTask">取 消</el-button>
            </span>
        </el-dialog>
        <el-dialog title="下发任务" :visible.sync="distributeTaskDialog" width="900px" custom-class="common-dialog">
            <div class="ub">
                <div class="dia-left">
                    <el-tree
                        ref="distributeRef"
                        :props="{
                            label: 'name',
                            children: 'childDepInfo'
                        }"
                        node-key="id"
                        show-checkbox
                        :data="treeData"
                        @check-change="handleCheckChange"
                    ></el-tree>
                </div>
                <div class="dia-right">
                    <el-table
                        :row-class-name="tableRowClassName"
                        ref="systemMultipleTable"
                        v-loading="Sysloading"
                        class="bigTable full-table"
                        :data="systableData"
                        max-height="380px"
                        border
                        stripe
                        tooltip-effect="dark"
                        @selection-change="handleSysSelectionChange"
                    >
                        <el-table-column type="selection" width="50"></el-table-column>
                        <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号"></el-table-column>
                        <el-table-column prop="name" label="系统名称"></el-table-column>
                    </el-table>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <Debounce :time="1500" :isDebounce="2"><el-button size="small" type="primary" @click.native="submitDistributeTaskForm">确 定</el-button></Debounce>
                <el-button size="small" @click="distributeTaskDialog = false">取 消</el-button>
            </span>
        </el-dialog>
        <el-drawer :visible.sync="seeDialog" title="任务详情" direction="rtl" size="1020px">
            <div class="drawer-content">
                <div style="position: relative;top: 0;left: 0;overflow-y: hidden;margin-top: 5px;width: 100%;height: 100%;">
                    <div class="ub w100 ub-ver baseInfo-list">
                        <div class="ub">
                            <div class="ub w100 baseInfo-list-item">
                                <div class="label">任务名称</div>
                                <div class="ub ub-f1">{{ detailInfo.taskName }}</div>
                            </div>
                            <div class="ub w100 baseInfo-list-item" style="margin-top: 0;">
                                <div class="label" style="border-left: none;">模板名称</div>
                                <div class="ub ub-f1">{{ detailInfo.templateName }}</div>
                            </div>
                        </div>
                        <div class="ub">
                            <div class="ub w100 baseInfo-list-item" style="margin-top: -2px;">
                                <div class="label">任务状态</div>
                                <div class="ub ub-f1">
                                    <div>
                                        <span v-if="detailInfo.taskStatus == 1">未开始</span>
                                        <span v-if="detailInfo.taskStatus == 2">进行中</span>
                                        <span v-if="detailInfo.taskStatus == 3">已完成</span>
                                        <span v-if="detailInfo.taskStatus == 4">已撤销</span>
                                        <span v-if="detailInfo.taskStatus == 5">已延迟</span>
                                    </div>
                                </div>
                            </div>
                            <div class="ub w100 baseInfo-list-item">
                                <div class="label" style="border-left: none;">任务类型</div>
                                <div class="ub ub-f1">{{ detailInfo.taskType }}</div>
                            </div>
                        </div>
                        <div class="ub w100 baseInfo-list-item">
                            <div class="label">任务起止时间</div>
                            <div class="ub ub-f1">{{ detailInfo.taskTime }}</div>
                        </div>
                        <div class="ub w100 baseInfo-list-item">
                            <div class="label">描述</div>
                            <div class="ub ub-f1">{{ detailInfo.des }}</div>
                        </div>
                        <div class="ub w100 baseInfo-list-item">
                            <div class="label">创建人</div>
                            <div class="ub ub-f1">{{ detailInfo.createUser }}</div>
                        </div>
                        <div class="ub w100 baseInfo-list-item">
                            <div class="label">创建时间</div>
                            <div class="ub ub-f1">{{ detailInfo.createTime }}</div>
                        </div>
                    </div>
                    <el-table
                        :height="tableHeight"
                        :row-class-name="tableRowClassName"
                        ref="multipleTable"
                        class="bigTable full-table"
                        :data="detailInfoList"
                        v-if="detailInfoList.length"
                        border
                        stripe
                        tooltip-effect="dark"
                    >
                        <el-table-column prop="systemName" label="业务系统名称" show-overflow-tooltip width="150"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="status" label="状态" width="70">
                            <template slot-scope="scope">
                                <span v-if="scope.row.status == 0">未填报</span>
                                <span v-if="scope.row.status == 1">已填报</span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="createTime" label="创建时间"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="createUserName" label="填报人" width="100"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="dabiao" width="80" label="达标率"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="hg" width="60" label="合规项"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="bhg" width="70" label="不合规项"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="bsy" width="60" label="不适用"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="updateTime" label="提交时间"></el-table-column>
                    </el-table>
                    <pagination
                        v-show="detailPage.total_num > 0"
                        :total="detailPage.total_num"
                        :page.sync="detailPage.get_params.page"
                        :limit.sync="detailPage.get_params.size"
                        @pagination="get_data_detail"
                    />
                </div>
            </div>
        </el-drawer>
        <DeleteDialog :dialogVisible="deleteDialog" @delete="handleDeleteFun" @cancel="deleteDialog = false"></DeleteDialog>
    </div>
</template>

<script>
import {
    safetyTaskPage,
    safetyTaskSave,
    safetyTaskUpdate,
    safetyTaskDelete,
    safetyTaskCancel,
    safetyTaskIssue,
    safetyTaskReminder,
    safetyTaskGetOrg,
    safetyTaskGetSystem,
    safetyTaskGetTemplate,
    safetyTaskGetDetail
} from '@/server/works_order/review_task.js'
import { getSafetyTaskPage } from '@/server/works_order/define.js'
export default {
    props: {
        page: {
            type: String,
            default: ''
        }
    },
    name: 'TaskManage',
    watch: {
        addDialog(newVal) {
            if (!newVal) {
                this.$refs.taskForm.clearValidate()
            }
        }
    },
    data() {
        return {
            sayTimes: [],
            distributeTaskDialog: false,
            distributeTaskData: null,
            distributeTaskForm: {
                company: []
            },
            systableData: [],
            Sysloading: false,
            treeData: [],
            distributeRules: {
                company: [
                    {
                        required: true,
                        message: '请输入',
                        trigger: ['blur', 'change']
                    }
                ]
            },
            get_params: {
                page: 1,
                size: 20,
                taskName: '',
                taskStatus: ''
            },
            detailInfoList: [],
            tableData: [],
            tableHeight: document.body.clientHeight - 270,
            loading: false,
            total_num: 10,
            deleteId: [],
            deleteDialog: false,
            multipleSelection: [],
            addDialog: false,
            formLabelWidth: '110px',
            templates: [],
            taskForm: {
                id: '',
                taskName: '',
                taskType: '',
                time: '',
                template: '',
                des: ''
            },
            seeDialog: false,
            detailInfo: {},
            detailPage: {
                total_num: 0,
                get_params: {
                    page: 1,
                    size: 20
                }
            },
            rules: {
                taskName: [
                    {
                        required: true,
                        message: '请输入',
                        trigger: 'blur'
                    }
                ],
                taskType: [
                    {
                        required: true,
                        message: '请输入',
                        trigger: 'blur'
                    }
                ],
                time: [
                    {
                        required: true,
                        message: '请选择',
                        trigger: 'blur'
                    }
                ],
                template: [
                    {
                        required: true,
                        message: '请选择',
                        trigger: 'blur'
                    }
                ]
            },
            sysMultipleSelection: []
        }
    },
    created() {
        // this.getCompany()
        // this.getTemplate()
        this.get_data()
    },
    methods: {
        getTemplate() {
            safetyTaskGetTemplate({
                queryData: {},
                paramsData: {}
            })
                .then(res => {
                    this.templates = res
                })
                .catch(err => {
                    console.log(err)
                })
        },
        getCompany() {
            safetyTaskGetOrg({
                queryData: {},
                paramsData: {}
            })
                .then(res => {
                    this.treeData = res
                    if (this.treeData[0].name == '全公司') this.treeData[0].id = 'all'
                })
                .catch(err => {
                    console.log(err)
                })
        },
        handleCheckChange(data, checked, indeterminate) {
            console.log(data, checked)
            console.log(this.$refs.distributeRef.getCheckedNodes())
            let companyArrId = this.$refs.distributeRef.getCheckedNodes().map(item => item.id)
            this.getSystemList(companyArrId)
        },
        getSystemList(ids) {
            let tmpSysMultipleSelection = this.$lodash.cloneDeep(this.sysMultipleSelection)
            safetyTaskGetSystem({
                queryData: {},
                paramsData: {
                    depIds: ids
                }
            }).then(res => {
                this.systableData = res
                this.$nextTick(() => {
                    console.log(tmpSysMultipleSelection)
                    tmpSysMultipleSelection.forEach(trow => {
                        let row = this.systableData.filter(item => item.id == trow.id)[0]
                        if (row) {
                            this.$refs.systemMultipleTable.toggleRowSelection(row, true)
                        }
                    })
                })
            })
        },
        handleSysSelectionChange(val) {
            // console.log(val)
            this.sysMultipleSelection = val
        },
        cancelTask() {
            this.addDialog = false
            this.taskForm = {
                id: '',
                taskName: '',
                taskType: '',
                time: '',
                template: '',
                des: ''
            }
        },
        handleDistribute(data) {
            this.distributeTaskData = data
            this.distributeTaskDialog = true
            this.$nextTick(() => {
                this.getSystemList([this.treeData[0].id])
                this.$refs.distributeRef.setChecked(this.treeData[0], true, true)
            })
            console.log(data)
        },
        press(data) {
            console.log(data)
            safetyTaskReminder({
                queryData: {},
                paramsData: {
                    id: data.id
                }
            }).then(res => {
                this.$message({
                    message: '操作成功',
                    type: 'success'
                })
            })
        },
        cancel(data) {
            console.log(data)
            safetyTaskCancel({
                queryData: {},
                paramsData: {
                    id: data.id
                }
            }).then(res => {
                this.$message({
                    message: '操作成功',
                    type: 'success'
                })
                this.get_data()
            })
        },
        detail(data) {
            console.log(data)
            this.detailInfo = data
            this.get_data_detail()
            this.seeDialog = true
        },
        edit(data) {
            console.log(data)
            this.taskForm.id = data.id
            this.taskForm.taskName = data.taskName
            this.taskForm.taskType = data.taskType
            this.taskForm.time = data.taskTime.split('~')
            this.taskForm.template = data.mouldId
            this.taskForm.des = data.des
            this.addDialog = true
        },
        deleteTask(data) {
            this.deleteId = [data.id]
            this.deleteDialog = true
            console.log(data)
        },
        get_data_detail() {
            safetyTaskGetDetail({
                queryData: {
                    page: this.detailPage.get_params.page,
                    pageSize: this.detailPage.get_params.size
                },
                paramsData: {
                    taskIds: [this.detailInfo.id]
                }
            }).then(res => {
                this.detailPage.total_num = res.total
                this.detailInfoList = res.records
                this.detailInfoList.forEach(item => {
                    let sum = item.hg + item.bhg + item.bsy
                    if (sum != 0) {
                        item.dabiao = `${((item.hg / sum) * 100).toFixed(2)}%`
                    } else {
                        item.dabiao = '0%'
                    }
                })
            })
        },
        searchCheck() {
            this.get_params.page = 1
            this.get_data()
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
                    name: this.get_params.taskName,
                    status: this.get_params.taskStatus,
                    timeStart: this.sayTimes && this.sayTimes.length > 0 ? this.sayTimes[0] : '',
                    timeEnd: this.sayTimes && this.sayTimes.length > 0 ? this.sayTimes[1] : ''
                }
            }
            let request = this.page == 'work_task' ? getSafetyTaskPage : safetyTaskPage
            request(data)
                .then(res => {
                    this.loading = false
                    this.total_num = res.total
                    res.records.forEach(item => {
                        this.tableData.push({
                            id: item.id,
                            taskName: item.name,
                            templateName: item.mouldName,
                            mouldId: item.mouldId,
                            taskStatus: item.status,
                            taskType: item.type,
                            startDate: item.startDate,
                            endDate: item.endDate,
                            taskTime: `${item.startDate}~${item.endDate}`,
                            des: item.content,
                            createUser: item.userName,
                            createTime: item.createTime
                        })
                    })
                })
                .catch(error => {
                    this.loading = false
                    console.log(error + 'error')
                })
        },
        handleDeleteAll() {
            if (this.multipleSelection.length == 0) {
                this.$message({
                    message: '请先选择行',
                    type: 'warning'
                })
                return
            } else {
                let ids = []
                this.multipleSelection.forEach(item => {
                    ids.push(item.id)
                })
                this.deleteId = ids
            }
            this.deleteDialog = true
        },
        handleDeleteFun() {
            let data = {
                queryData: {},
                paramsData: {
                    ids: this.deleteId
                }
            }
            safetyTaskDelete(data)
                .then(res => {
                    this.deleteDialog = false
                    console.log('删除成功')
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    })
                    setTimeout(() => {
                        this.get_data()
                    }, 1500)
                })
                .catch(error => {
                    this.deleteDialog = false
                    console.log(error + 'error')
                })
        },
        submitDistributeTaskForm() {
            let data = {
                queryData: {},
                paramsData: {
                    taskId: this.distributeTaskData.id,
                    taskName: this.distributeTaskData.taskName,
                    taskType: this.distributeTaskData.taskType,
                    mouldId: this.distributeTaskData.mouldId,
                    startDate: this.distributeTaskData.startDate,
                    endDate: this.distributeTaskData.endDate,
                    systemIds: this.sysMultipleSelection.map(item => item.id)
                }
            }
            safetyTaskIssue(data)
                .then(res => {
                    this.distributeTaskDialog = false
                    this.$message({
                        message: '下发成功',
                        type: 'success'
                    })
                    setTimeout(() => {
                        this.get_data()
                    }, 1500)
                })
                .catch(error => {
                    this.distributeTaskDialog = false
                    console.log(error + 'error')
                })
        },
        submitTaskForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    let data = {
                        queryData: {},
                        paramsData: {
                            name: this.taskForm.taskName,
                            mouldId: this.taskForm.template,
                            type: this.taskForm.taskType,
                            startDate: this.taskForm.time[0],
                            endDate: this.taskForm.time[1],
                            content: this.taskForm.des
                        }
                    }
                    let request = safetyTaskSave
                    if (this.taskForm.id) {
                        data.paramsData.id = this.taskForm.id
                        request = safetyTaskUpdate
                    }
                    request(data)
                        .then(res => {
                            this.$message({
                                message: '添加成功',
                                type: 'success'
                            })
                            this.cancelTask()
                            setTimeout(() => {
                                this.get_data()
                            }, 1500)
                        })
                        .catch(error => {
                            console.log(error + 'error')
                        })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        reset() {
            this.sayTimes = []
            this.get_params = {
                page: 1,
                size: 20,
                taskName: '',
                taskStatus: ''
            }
            this.get_data()
        },
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex % 2) {
                return 'table-row2'
            } else {
                return 'table-row1'
            }
        },
        handleSelectionChange(val) {
            console.log(val)
            this.multipleSelection = val
        },
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        }
    }
}
</script>

<style scoped lang="scss">
.baseInfo-list {
    border-radius: 4px;
}
.baseInfo-list-item {
    margin-top: -2px;
    min-height: 34px;
    background-color: #ffffff;
}
.baseInfo-list-item:nth-child(1) {
    margin-top: 0;
}
.baseInfo-list-item > div:nth-child(1) {
    width: 200px;
    min-height: 32px;
    font-size: 12px;
    border: solid 1px #dcdcdc;
    text-indent: 10px;
    color: rgb(0 0 0 / 90%);
    background-color: #ebf1f5;
    line-height: 32px;
}
.baseInfo-list-item > div:nth-child(2) {
    padding: 0 10px;
    min-height: 32px;
    font-size: 12px;
    border: solid 1px #dcdcdc;
    border-left: none;
    text-indent: 10px;
    color: rgb(0 0 0 / 90%);
    line-height: 32px;
    box-sizing: border-box;
}
.dia-left {
    overflow-y: auto;
    margin-right: 10px;
    width: 30%;
    height: 380px;
    background: #f5f8fe;
    .el-tree {
        background: #f5f8fe;
    }
}
.dia-right {
    width: 70%;
}
</style>
