<template>
    <div class="list">
        <SearchTop @search="searchCheck" @reset="reset">
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params">
                    <el-form-item label="任务名称：" label-width="80px">
                        <el-input placeholder="请输入" clearable v-model="get_params.name" @keyup.enter.native="searchCheck" size="small"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params">
                    <el-form-item label="任务类型：" label-width="80px">
                        <el-select v-model="get_params.type" filterable placeholder="请选择" style="width: 100%" size="small" clearable>
                            <el-option v-for="(item, index) in types" :key="index" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-col>
        </SearchTop>
        <div class="list-container">
            <div class="ub ub-pj w100 mb-1 ub-ac">
                <div class="list-tips">任务管理</div>
                <div>
                    <el-button icon="el-icon-plus" size="small" type="primary" @click="handleAdd" v-per="['leaks_taskInfo_add']">添加任务</el-button>
                    <el-button style="margin-left: 10px;" icon="el-icon-delete" size="small" type="danger" @click="handleDeleteAll" v-per="['leaks_taskInfo_del']">删除</el-button>
                </div>
            </div>
            <el-table
                ref="multipleTable"
                v-loading="loading"
                class='bigTable full-table'
                :data="tableData"
                border
                stripe
                :height="tabHeight"
                :row-class-name="tableRowClassName"
                :row-style="{ height: '32px' }"
                :header-row-style="{ height: '32px' }"
                tooltip-effect="dark"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="30" align="center"></el-table-column>
                <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                </el-table-column>
                <el-table-column prop="name" label="任务名称" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="taskTypeCN" label="任务类型" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="runMethodCN" label="执行方式">
                    <template slot-scope="{row}">
                        <span>{{getDoWay(row)}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="160">
                </el-table-column>
                <el-table-column label="是否开始" width="120">
                    <template slot-scope="{row}">
                        <div class="switch-wrapper" :class="{'yes':row.onOf,'no':!row.onOf}" @click="deploymentEnvironment(row)">
                            <div class="ub ub-ac ub-pj" :style="{'background':row.status?'#0052d9':'#c5c5c5'}">
                                <div style="margin-left: -1px">是</div>
                                <div>否</div>
                            </div>
                            <div class="circle"></div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="180">
                    <template slot-scope="scope">
                        <el-button @click="handelSee(scope.row)" size="small" type="text" v-per="['leaks_taskInfo_look']">查看</el-button>
                        <el-button @click="changeOption(1,scope.row)" size="small" type="text" v-per="['leaks_taskInfo_result']">扫描结果</el-button>
                        <el-button @click="changeOption(2,scope.row)" size="small" type="text" v-per="['leaks_taskInfo_edit']">编辑</el-button>
                        <el-button @click="changeOption(3,scope.row)" size="small" type="text" v-per="['leaks_taskInfo_del']">删除</el-button>
                    </template>
                </el-table-column>

            </el-table>
            <pagination :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size" @pagination="get_data" style="padding-top:10px"/>
        </div>
        <!--删除资源-->
        <DeleteDialog
            :dialogVisible="deleteDialog"
            @delete="handleDeleteFun"
            @cancel="deleteDialog = false">
        </DeleteDialog>
        <el-dialog title="详情" :visible.sync="detailDialog" width="700px" custom-class="common-dialog">
            <div class="ub w100 ub-ver baseInfo-list">
                <div class="ub w100 baseInfo-list-item">
                    <div>任务名称 </div>
                    <div class="ub ub-f1">{{detailFORM.name}}</div>
                </div>
                <div class="ub w100 baseInfo-list-item">
                    <div>任务类型</div>
                    <div class="ub ub-f1">{{detailFORM.taskTypeCN}}</div>
                </div>
                <div class="ub w100 baseInfo-list-item">
                    <div>引擎名称</div>
                    <div class="ub ub-f1">{{detailFORM.engineTypeCN}}</div>
                </div>
                <div class="ub w100 baseInfo-list-item">
                    <div>扫描策略</div>
                    <div class="ub ub-f1">{{getpolicy(detailFORM)}}</div>
                </div>
                <div class="ub w100 baseInfo-list-item">
                    <div>执行方式</div>
                    <div class="ub ub-f1">{{getDoWay(detailFORM)}}</div>
                </div>
                <div class="ub w100 baseInfo-list-item">
                    <div>是否IPV6</div>
                    <div class="ub ub-f1">{{detailFORM.isIpv6==1?'是':'否'}}</div>
                </div>
                <div class="ub w100 baseInfo-list-item">
                    <div>扫描目标类型</div>
                    <div class="ub ub-f1">{{detailFORM.scanType==1?'业务系统':'资产'}}</div>
                </div>
                <div class="ub w100 baseInfo-list-item">
                    <div>端口类型</div>
                    <div class="ub ub-f1">{{detailFORM.portType|getportType}}</div>
                </div>
                <div class="ub w100 baseInfo-list-item">
                    <div>端口内容</div>
                    <div class="ub ub-f1">{{detailFORM.port}}</div>
                </div>
                <div class="ub w100 baseInfo-list-item">
                    <div>创建人</div>
                    <div class="ub ub-f1">{{detailFORM.createUserCN}}</div>
                </div>
                <div class="ub w100 baseInfo-list-item">
                    <div>创建时间</div>
                    <div class="ub ub-f1">{{detailFORM.createTime}}</div>
                </div>
            </div>
        </el-dialog>
        <el-dialog title="扫描日志" :visible.sync="logDiaLog" width="700px" custom-class="common-dialog">
            <el-table
                ref="multipleTableLog"
                v-loading="loadingLog"
                class='bigTable full-table'
                :data="tableDataLog"
                border
                stripe
                :row-style="{ height: '32px' }"
                :header-row-style="{ height: '32px' }"
                tooltip-effect="dark">
                <el-table-column align="center" type="index" width="50" :index="indexMethodLog" label="序号">
                </el-table-column>
                <el-table-column prop="name" label="任务名称" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="beginTimeFMT" label="开始时间">
                </el-table-column>
                <el-table-column prop="endTimeFMT" label="结束时间">
                </el-table-column>
                <el-table-column prop="taskStatusCN" label="状态" show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="操作" align="center" width="150">
                    <template slot-scope="scope">
                        <div>
                            <a :href="'api/manage/taskInfo/downloadReport?id='+scope.row.id" download>
                                <el-button style="margin-right: 12px;" type="text" size="small">下载模板</el-button>
                            </a>
                            <el-button style="margin-right: 12px;" type="text" size="small" @click="handelReScan(scope.row)">重扫</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :total="total_numLog" :page.sync="get_paramsLog.page" :limit.sync="get_paramsLog.size" @pagination="get_dataLog(TaskId)" style="padding-top:10px"/>
        </el-dialog>
        <el-dialog :title="scanTitle" :visible.sync="scanDialog" width="700px" custom-class="common-dialog">
            <span>确定{{scanTitle}}吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="scanDialog = false">取消</el-button>
                <el-button size="small" type="primary" @click="handleScanFun">确认</el-button>
            </span>
        </el-dialog>
        <taskAdd ref="taskAddRef"></taskAdd>
        <taskEdit ref="taskEditRef"></taskEdit>
    </div>
</template>

<script>
import {
    getTaskList,
    deleteTask,
    get_policy,
    getTaskListLog,
    switchScan,
    reScan
} from '../../server/leak/api.js'
import taskAdd from './task_add.vue'
import taskEdit from './task_edit.vue'
export default {
    components: { taskAdd, taskEdit },
    name: 'Taskine',
    data() {
        return {
            tabHeight: document.body.clientHeight - 260,
            optionType: [{
                label: '扫描结果',
                value: 1,
                isActive: false
            }, {
                label: '编辑',
                value: 2,
                isActive: false
            }, {
                label: '删除',
                value: 3,
                isActive: false
            }],
            scanTitle: '',
            scanId: '',
            scanDialog: false,
            TaskId: '',
            logDiaLog: false,
            policys: [],
            detailFORM: {},
            detailDialog: false,
            deleteDialog: false,
            deleteId: '',
            formLabelWidth: '100px',
            loading: false,
            total_num: 0,
            multipleSelection: [],
            tableData: [],
            types: [{
                label: '主机漏洞',
                value: 0
            }, {
                label: '基线漏洞',
                value: 1
            }, {
                label: '网站漏洞',
                value: 2
            }, {
                label: '口令猜测',
                value: 3
            }

            ],
            factorys: [],
            get_params: {
                page: 1,
                size: 20,
                name: '',
                type: ''
            },
            loadingLog: false,
            total_numLog: 0,
            tableDataLog: [],
            get_paramsLog: {
                page: 1,
                size: 20
            }

        }
    },
    filters: {
        getportType(ids) {
            if (ids == 1) {
                return '常用端口'
            } else if (ids == 2) {
                return '全端口'
            } else if (ids == 3) {
                return '自定义端口'
            } else {
                return ''
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.get_data()
            this.init_policy()
        })
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
        reset() {
            this.get_params = {
                page: 1,
                size: 20,
                name: '',
                type: ''
            }
            this.get_data()
        },
        handelReScan(row) {
            let data = {
                queryData: {},
                paramsData: {
                    id: row.id
                }
            }
            reScan(data).then(res => {
                this.$message({
                    message: '重扫成功',
                    type: 'success'
                })
            }).catch(error => {
                console.log(error + 'error')
            })
        },
        changeOption(item, row) {
            console.log(item, row)
            this.optionType = this.optionType.map(_item => {
                _item.isActive = false
                return _item
            })
            item.isActive = true
            if (item.value == 1) {
            // 扫描结果
                this.logDiaLog = true
                this.TaskId = row.id
                this.get_dataLog(row.id)
            } else if (item.value == 2) {
            // 编辑
                console.log(row)
                let obj = {}
                obj.id = row.id
                obj.name = row.name
                obj.taskType = row.taskType
                obj.runMethod = row.runMethod
                obj.engineType = row.engineType
                obj.scanType = row.scanType
                obj.objId = row.objId
                obj.portType = row.portType
                obj.port = row.port
                obj.checked = row.isIpv6 == 1
                obj.policyId = row.policyId
                if (row.runMethod == 1) {
                    obj.time = row.runConfig
                } else if (row.runMethod == 2) {
                    let runConfig = JSON.parse(row.runConfig)
                    if (runConfig.type == 0) {
                        obj.type = runConfig.type
                        obj.time = runConfig.time
                    } else {
                        obj.type = runConfig.type
                        obj.day = runConfig.day
                        obj.time = runConfig.time
                    }
                }
                this.$setlocalStorage('taskInfo', obj)
                // this.$router.push({
                //     name: 'leak_task_edit'
                // })
                this.$refs.taskEditRef.addDialog = true
            } else if (item.value == 3) {
            // 删除
                this.deleteId = [`${row.id}`]
                this.deleteDialog = true
            }
        },
        deploymentEnvironment(row) {
            row.onOf = !row.onOf
            row.isOpen = row.onOf ? 1 : 0
            this.scanId = row.id
            this.handleScanFun()
        },
        handleScanFun() {
            let data = {
                queryData: {},
                paramsData: {
                    id: this.scanId
                }
            }
            switchScan(data).then(res => {
                this.$message({
                    message: '操作成功',
                    type: 'success'
                })
            }).catch(error => {
                console.log(error + 'error')
            })
        },
        getpolicy(detailFORM) {
            if (this.policys.some(item => item.value === detailFORM.policyId)) {
                let name = this.policys.filter(item => item.value === detailFORM.policyId)[0].label
                return name
            } else {
                return ''
            }
        },
        init_policy() {
            this.policys = []
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_policy(data).then(res => {
                console.log('策略', res)
                if (res.length > 0) {
                    res.map(item => {
                        this.policys.push({
                            label: item.policyName,
                            value: item.policyID
                        })
                    })
                }
            }).catch(error => {
                console.log(error + 'error')
            })
        },
        getDoWay(detailFORM) {
            let wayStr = ''
            let day = ''
            let time = ''
            if (detailFORM.runMethod == 1) {
                wayStr = '定时任务'
                time = detailFORM.runConfig
            } else if (detailFORM.runMethod == 0) {
                wayStr = '立即执行'
            } else if (detailFORM.runMethod == 2) {
                let runConfig = JSON.parse(detailFORM.runConfig)
                wayStr = '周期任务'
                time = runConfig.time
                if (runConfig.type == 1) {
                    if (runConfig.day == 1) {
                        day = '星期一'
                    } else if (runConfig.day == 2) {
                        day = '星期二'
                    } else if (runConfig.day == 3) {
                        day = '星期三'
                    } else if (runConfig.day == 4) {
                        day = '星期四'
                    } else if (runConfig.day == 5) {
                        day = '星期五'
                    } else if (runConfig.day == 6) {
                        day = '星期六'
                    } else if (runConfig.day == 7) {
                        day = '星期日'
                    }
                } else if (runConfig.type == 2) {
                    day = runConfig.day + '日'
                }
            }
            if (day === '' && time === '') {
                return wayStr
            }
            return wayStr + '（ ' + day + ' ' + time + ' ）'
        },
        handleAdd() {
            // this.$router.push({
            //     name: 'leak_task_add'
            // })
            this.$refs.taskAddRef.init()
        },
        get_data() {
            this.loading = true
            this.tableData = []
            let data = {
                queryData: {
                    page: this.get_params.page,
                    pageSize: this.get_params.size
                },
                paramsData: {
                    name: this.get_params.name,
                    taskType: this.get_params.type
                }
            }
            getTaskList(data).then(res => {
                console.log('列表', res)
                this.loading = false
                this.total_num = res.total
                let list = res.records
                if (list.length > 0) {
                    list.forEach(item => {
                        let obj = {}
                        obj.id = item.id
                        obj.taskType = item.taskType
                        obj.name = item.name
                        obj.runMethod = item.runMethod
                        obj.runConfig = item.runConfig
                        obj.engineType = item.engineType
                        obj.isIpv6 = item.isIpv6
                        obj.scanType = item.scanType
                        obj.objId = item.objId
                        obj.portType = item.portType
                        obj.createTime = item.createTime
                        obj.port = item.port
                        obj.isOpen = item.isOpen
                        obj.onOf = item.isOpen == 1

                        obj.policyId = item.policyId
                        obj.createUser = item.createUser
                        obj.taskTypeCN = item.taskTypeCN
                        obj.runMethodCN = item.runMethodCN
                        obj.createUserCN = item.createUserCN
                        obj.engineTypeCN = item.engineTypeCN
                        this.tableData.push(obj)
                    })
                }
            }).catch(error => {
                this.loading = false
                console.log('error' + error)
            })
        },
        get_dataLog(id) {
            this.loadingLog = true
            this.tableDataLog = []
            let data = {
                queryData: {
                    page: this.get_paramsLog.page,
                    pageSize: this.get_paramsLog.size
                },
                paramsData: {
                    id: id
                }
            }
            getTaskListLog(data).then(res => {
                console.log('列表', res)
                this.loadingLog = false
                this.total_numLog = res.totalElements
                let list = res.content
                if (list.length > 0) {
                    list.forEach(item => {
                        let obj = {}
                        obj.id = item.id
                        obj.name = item.tjTaskInfo.taskName
                        obj.beginTimeFMT = item.tjTaskInfo.beginTimeFMT
                        obj.endTimeFMT = item.tjTaskInfo.endTimeFMT
                        obj.taskStatusCN = item.tjTaskInfo.taskStatusCN
                        this.tableDataLog.push(obj)
                    })
                }
            }).catch(error => {
                this.loadingLog = false
                console.log('error' + error)
            })
        },
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        indexMethodLog(index) {
            return (this.get_paramsLog.page - 1) * this.get_paramsLog.size + index + 1
        },
        searchCheck() {
            this.get_params.page = 1
            this.get_data()
        },

        handelSee(row) {
            this.$set(this, 'detailFORM', row)
            this.detailDialog = true
        },
        handleEdit(row) {
            console.log(row)
            let obj = {}
            obj.id = row.id
            obj.name = row.name
            obj.taskType = row.taskType
            obj.runMethod = row.runMethod
            obj.engineType = row.engineType
            obj.scanType = row.scanType
            obj.objId = row.objId
            obj.portType = row.portType
            obj.port = row.port
            obj.checked = row.isIpv6 == 1
            obj.policyId = row.policyId
            if (row.runMethod == 1) {
                obj.time = row.runConfig
            } else if (row.runMethod == 2) {
                let runConfig = JSON.parse(row.runConfig)
                if (runConfig.type == 0) {
                    obj.type = runConfig.type
                    obj.time = runConfig.time
                } else {
                    obj.type = runConfig.type
                    obj.day = runConfig.day
                    obj.time = runConfig.time
                }
            }
            this.$setlocalStorage('taskInfo', obj)
            this.$router.push({
                name: 'task_edit'
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
            // console.log(this.deleteId)
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
            deleteTask(data).then(res => {
                this.deleteDialog = false
                console.log('删除成功')
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
        },
        handleSizeChangeLog(val) {
            this.get_paramsLog.size = val
            this.get_dataLog(this.TaskId)
        },
        handleCurrentChangeLog(val) {
            this.get_paramsLog.page = val
            this.get_dataLog(this.TaskId)
        }
    }
}
</script>

<style lang="scss" scoped>
.name:hover {
    cursor: pointer;
    text-decoration: underline;
}

.baseInfo-list {
    border-radius: 4px;
    border-bottom: solid 1px #dddddd;
}

.baseInfo-list-item{
    min-height: 34px;
    margin-top: -2px;
}
.baseInfo-list-item:nth-child(1){
    margin-top:0;
}
.baseInfo-list-item>div:nth-child(1){
    width: 100px;
    min-height: 32px;
    line-height:32px;
    text-indent: 10px;
    font-size:12px;
    color:rgba(0,0,0,0.9);
    box-sizing: border-box;
    background-color: #ebf1f5;
    border: 1px solid #ddd;
}
.baseInfo-list-item>div:nth-child(2){
    min-height: 32px;
    line-height:32px;
    text-indent: 10px;
    font-size:12px;
    color:rgba(0,0,0,0.9);
    padding:0 10px;
    box-sizing: border-box;
    border-top:1px solid #ddd;
    border-right:1px solid #ddd;
}
.switch-wrapper{
    width:56px;
    height:20px;
    position: relative;
    cursor: pointer;
    margin-left: 10px;
}
.switch-wrapper>div:nth-child(1){
    width:56px;
    height:20px;
    background-color: #0052d9;
    border-radius: 14px;
    div{
        font-size: 12px;
        line-height: 20px;
        padding:0 8px;
    }
    >div:nth-child(1){
        color: rgba(255,255,255,0.9);
    }
    >div:nth-child(2){
        color: rgba(255,255,255,0.9);
    }
}
.switch-wrapper>div:nth-child(2){
    width: 20px;
    height: 20px;
    position: absolute;
    left:0;
    top:50%;
    margin-top: -10px;
    border-radius:100%;
}

.switch-wrapper.yes>div:nth-child(2) {
    animation: moveone 0s linear forwards;
}

.switch-wrapper.no>div:nth-child(2) {
    animation: _moveone 0s linear forwards;
}

@keyframes moveone {
    0% {
        background-color: rgb(255,255,255);
        left: 1px
    }

    100% {
        background-color: rgb(255,255,255);
        left: 35px;
    }
}
@-webkit-keyframes moveone {
    0% {
        background-color: rgb(255,255,255);
        left: 1px;
    }

    100% {
        background-color: rgb(255,255,255);
        left: 35px;
    }
}
@keyframes _moveone {
    0% {
        background-color: rgb(255,255,255);
        left: 35px;
    }

    100% {
        background-color: rgb(255,255,255);
        left: 1px;
    }
}
@-webkit-keyframes _moveone {
    0% {
        background-color: rgb(255,255,255);
        left: 35px;
    }

    100% {
        background-color: rgb(255,255,255);
        left: 1px;
    }
}
@keyframes moveone_white {
    0% {
        background-color: #fff;
        left: 0;
    }

    100% {
        background-color: #fff;
        left: 36px;
    }
}
@-webkit-keyframes moveone_white {
    0% {
        background-color: #fff;
        left: 0;
    }

    100% {
        background-color: #fff;
        left: 36px;
    }
}
@keyframes _moveone_white {
    0% {
        background-color: #fff;
        left: 36px;
    }

    100% {
        background-color: #fff;
        left: 0;;
    }
}
@-webkit-keyframes _moveone_white {
    0% {
        background-color: #fff;
        left: 36px;
    }

    100% {
        background-color: #fff;
        left: 0;
    }
}
.white-theme .switch-wrapper.yes>div:nth-child(2){
    animation: moveone_white 0s linear forwards;
}
.white-theme .switch-wrapper.no>div:nth-child(2){
    animation: _moveone_white 0s linear forwards;
}
</style>
