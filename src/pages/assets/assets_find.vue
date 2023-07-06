<template>
    <div class="list">
        <div class="tab-button ub" style="padding: 0 10px;background: #ffffff;">
            <div class="work-btn" @click="tabClick('1')" :class="{ 'tab-active': currentTab === '1' }">发现库</div>
            <div class="draft-btn" @click="tabClick('2')" :class="{ 'tab-active': currentTab === '2' }">黑名单</div>
        </div>
        <component v-if="currentTab === '1'" v-bind:is="'asset_part'"></component>
        <component v-if="currentTab === '2'" v-bind:is="'asset_part_black'"></component>
        <!-- <div
            v-if="currentTab === '3'"
            class="list-container"
            key="key2"
            style="margin-top: -1px;margin-bottom: 10px;padding: 10px;border: none;background: #ffffff;box-shaow: none;border-top-left-radius: 0;border-top-right-radius: 0;"
        >
            <SearchTop style="box-shadow: none;" @search="searchAssets" @reset="reset">
                <el-col :md="12" :lg="8" :xl="6">
                    <el-form :model="get_params">
                        <el-form-item label="任务名称：" label-width="80px">
                            <el-input placeholder="请输入任务名称" clearable v-model="get_params.taskName" @keyup.enter.native="searchAssets" size="small"></el-input>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :md="12" :lg="8" :xl="6">
                    <el-form :model="get_params">
                        <el-form-item label="任务类型：" label-width="80px">
                            <el-select v-model="get_params.taskType" size="small" placeholder="请选择业务系统" style="width: 100%;" clearable >
                                <el-option v-for="(item, index) in types" :key="index" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </el-col>
            </SearchTop>
            <div class="ub ub-pj w100 mb-1 mt-1 ub-ac">
                <div class="list-tips">任务管理</div>
                <div>
                    <el-button icon="el-icon-plus" size="small" type="primary" @click="addDialog = true">添加</el-button>
                    <el-button icon="el-icon-delete" size="small" type="danger" @click="delMutile">删除</el-button>
                </div>
            </div>
            <div class="safe-event">
                <el-table
                    ref="multipleTable"
                    v-loading="loading_task"
                    class="bigTable"
                    :data="tableDataTask"
                    :row-class-name="tableRowClassName"
                    border
                    stripe
                    tooltip-effect="dark"
                    :height="tabHeight"
                    :row-style="{ height: '32px' }"
                    :header-row-style="{ height: '32px' }"
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column align="center" type="selection" width="30"></el-table-column>
                    <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                    </el-table-column>
                    <el-table-column prop="name" label="任务名称" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column label="任务类型" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <div>{{isTaskType(scope.row.taskType)}}</div>
                        </template>
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
                                <div class="ub ub-ac ub-pj" :style="{'background':row.onOf?'#0052d9':'#c5c5c5'}">
                                    <div style="margin-left: -1px;">是</div>
                                    <div>否</div>
                                </div>
                                <div class="circle"></div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="120">
                        <template slot-scope="scope">
                            <el-button @click="handleSeeTask(scope.row)" size="small" type="text">查看</el-button>
                            <el-button @click="handleEditTask(scope.row)" size="small" type="text">编辑</el-button>
                            <el-button @click="handleDeleteTask(scope.row)" size="small" type="text">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination
                    :total="total_num"
                    :page.sync="get_params.page"
                    :limit.sync="get_params.size"
                    @pagination="get_data"
                    style="padding-top: 10px;"
                    v-show="total_num > 0"
                />
            </div>
        </div> -->
        <!-- 添加任务 -->
        <el-drawer :visible.sync="addDialog" direction="rtl" :size="720" :title="taskTitle" :before-close="handleClose" custom-class="drawer-dialog">
            <el-form :model="addForm" ref="addForm" class="task" label-position="top">
                <div class="ub ub-pj">
                    <el-form-item
                        label="任务名称："
                        :label-width="formLabelWidth"
                        prop="name"
                        :rules="{
                            required: true,
                            message: '请输入',
                            trigger: 'blur'
                        }"
                    >
                        <el-input placeholder="请输入" clearable v-model="addForm.name" size="small" style="width: 300px;"></el-input>
                    </el-form-item>
                </div>
                <div class="ub ub-pj">
                    <el-form-item
                        label="执行方式："
                        prop="runMethod"
                        :label-width="formLabelWidth"
                        :rules="{
                            required: true,
                            message: '请选择',
                            trigger: 'change'
                        }"
                    >
                        <el-select v-model="addForm.runMethod" filterable placeholder="请选择" style="width: 300px;" size="small" clearable>
                            <el-option v-for="(item, index) in runMethods" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        v-if="addForm.runMethod == 1"
                        label="开始时间："
                        prop="time"
                        :label-width="formLabelWidth"
                        :rules="{
                            required: true,
                            message: '请选择',
                            trigger: 'change'
                        }"
                    >
                        <el-date-picker
                            v-model="addForm.time"
                            type="datetime"
                            placeholder="选择开始时间"
                            style="width: 300px;"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            size="small"
                            clearable
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item
                        v-if="addForm.runMethod == 2"
                        label="执行时间："
                        prop="type"
                        :label-width="formLabelWidth"
                        :rules="{
                            required: true,
                            message: '请选择',
                            trigger: 'change'
                        }"
                    >
                        <el-select v-model="addForm.type" filterable placeholder="请选择" style="width: 300px;" size="small" clearable @change="changeDoTime">
                            <el-option v-for="(item, index) in timeTypes" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <el-form-item
                    v-if="addForm.type !== '' && addForm.runMethod == 2"
                    label="扫描时间："
                    prop="time"
                    :label-width="formLabelWidth"
                    :rules="{
                        required: true,
                        message: '请选择',
                        trigger: 'change'
                    }"
                >
                    <el-time-picker v-model="addForm.time" placeholder="选择时间" style="width: 300px;" value-format="HH:mm:ss" size="small" clearable></el-time-picker>
                </el-form-item>
                <el-form-item
                    v-if="addForm.type === 1"
                    label="星期："
                    prop="day"
                    :label-width="formLabelWidth"
                    :rules="{
                        required: true,
                        message: '请选择',
                        trigger: 'change'
                    }"
                >
                    <div class="attack-box">
                        <div class="show-box" ref="show-box-add">
                            <div class="wrapper clearfix" ref="wrapper-add">
                                <div class="attack-item" v-for="item in dayList" :class="{ active: item.isfold }" :key="item.name" @click="handleClickItem(item.val)">
                                    {{ item.name }}
                                    <span class="checkd-img"><i class="el-icon-check"></i></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item
                    v-if="addForm.type === 2"
                    label="日期："
                    prop="day"
                    :label-width="formLabelWidth"
                    :rules="{
                        required: true,
                        message: '请选择',
                        trigger: 'change'
                    }"
                >
                    <div class="attack-box">
                        <div class="show-box" ref="show-box-add">
                            <div class="wrapper clearfix" ref="wrapper-add">
                                <div class="attack-item" v-for="item in mouthList" :class="{ active: item.isfold }" :key="item.name" @click="handleClickItem1(item.val)">
                                    {{ item.name }}
                                    <span class="checkd-img"><i class="el-icon-check"></i></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-form-item>
                <div class="ub ub-pj">
                    <el-form-item
                        label="引擎名称："
                        prop="engineType"
                        :label-width="formLabelWidth"
                        :rules="{
                            required: true,
                            message: '请选择',
                            trigger: 'change'
                        }"
                    >
                        <el-select v-model="addForm.engineType" filterable placeholder="请选择" style="width: 300px;" size="small" clearable>
                            <el-option v-for="(item, index) in engineTypes" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="ub ub-pj">
                    <el-form-item
                        label="扫描范围："
                        style="width: 100%;"
                        prop="scanRange"
                        :label-width="formLabelWidth"
                        :rules="{
                            required: true, message: '请输入', trigger: 'blur'
                        }">
                        <div class="ub ub-pj ub-ac w100">
                            <div style="width: 100%;">
                                <el-input type="textarea" placeholder="请输入" clearable v-model="addForm.scanRange" size="small" style="width: 100%;"></el-input>
                            </div>
                            <div style="position: absolute;top: -30px;right: 0;">
                                <el-checkbox v-model="addForm.checked">IPV6</el-checkbox>
                            </div>
                        </div>
                    </el-form-item>
                </div>
                <div class="ub ub-pj" style="font-size: 12px;">
                    注：支持单IP、192.168.1.1/24、192.168.1.1-192.168.1.255,以英文半角逗号分割
                </div>
            </el-form>
            <div
                style="
                    position: fixed;
                    right: 0;
                    bottom: 0;
                    z-index: 9999;
                    padding-bottom: 10px;
                    width: 700px;
                    text-align: right;
                    background: #ffffff;"
            >
                <el-button @click="back" size="small">取消</el-button>
                <el-button @click="finishDialogShow" size="small" type="primary" style="margin-right: 30px;">确定</el-button>
            </div>
        </el-drawer>
        <!-- 查看任务详情 -->
        <el-drawer :visible.sync="seeDialog" direction="rtl" :size="900" title="查看详情" custom-class="drawer-dialog">
            <div class="drawer-pad">
                <div>
                    <div class="title">概览</div>
                    <div class="container">
                        <el-descriptions size="mini" title="" :column="2" border>
                            <el-descriptions-item label="任务名称">{{seeData.name}}</el-descriptions-item>
                            <el-descriptions-item label="执行方式">{{getDoWay(seeData)}}</el-descriptions-item>
                            <el-descriptions-item label="扫描范围">{{seeData.scanRange}}</el-descriptions-item>
                            <el-descriptions-item label="创建人">{{seeData.createUserCN}}</el-descriptions-item>
                            <el-descriptions-item label="创建时间">{{seeData.createTime}}</el-descriptions-item>
                        </el-descriptions>
                    </div>
                </div>
                <div>
                    <div class="title" style="margin-top: 20px;">执行记录</div>
                    <div class="container">
                        <el-table
                            ref="multipleTable"
                            class="bigTable"
                            :data="execRecords"
                            :row-class-name="tableRowClassName"
                            border
                            stripe
                            tooltip-effect="dark"
                            :row-style="{ height: '32px' }"
                            :header-row-style="{ height: '32px' }"
                        >
                            <el-table-column prop="name" label="任务名称" width="auto" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="createTime" label="开始时间" width="200" align="center" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="type" label="执行状态" width="80">
                                <template slot-scope="{ row }">
                                    <div>
                                        <span v-if="row.type == 1">完成</span>
                                        <span v-if="row.type == 2">未完成</span>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="操作" width="120">
                                <template slot-scope="scope">
                                    <el-button @click="handleSeeResult(scope.row)" size="small" type="text">查看结果</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
        </el-drawer>
        <el-drawer :visible.sync="seeTaskResult" direction="rtl" :size="900" title="查看执行结果" custom-class="drawer-dialog">
            <el-table
                ref="multipleTable"
                class="bigTable"
                :data="recordList"
                :row-class-name="tableRowClassName"
                border
                stripe
                tooltip-effect="dark"
                :row-style="{ height: '32px' }"
                :header-row-style="{ height: '32px' }"
            >
                <el-table-column prop="ip" label="IP" width="auto" show-overflow-tooltip></el-table-column>
                <el-table-column prop="port" label="端口" width="200" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="mac" label="资产mac地址" width="200" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="type" label="资产类型" width="200" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="system" label="操作系统" width="200" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="version" label="系统版本" width="200" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="service" label="服务" width="200" align="center" show-overflow-tooltip></el-table-column>
            </el-table>
        </el-drawer>
        <DeleteDialog :dialogVisible="delTaskDialog" @delete="deleteTaskFn" @cancel="delTaskDialog = false"></DeleteDialog>
        <DeleteDialog :dialogVisible="delTaskDialogMutile" @delete="deleteTaskFnMutile" @cancel="delTaskDialogMutile = false"></DeleteDialog>
    </div>
</template>

<script>
import {
    // delete_attr,
    // 1
    saveTaskMaster,
    updateTaskMaster,
    findTaskMaster,
    findTaskSub,
    findSubData,
    deleteTaskMaster,
    assetsFindOpen
} from '../../server/assets/api.js'
import asset_part from './asset_part'
import asset_part_black from './asset_part_black'
export default {
    name: 'AssetFind',
    components: {
        asset_part,
        asset_part_black
    },
    data() {
        return {
            addDialog: false,
            seeDialog: false,
            tabHeight: document.body.clientHeight - 218,
            loading_task: false,
            total_num: 0,
            indent: 5,
            multipleSelection: [],
            recordId: '',
            recordType: '',
            editTypeDialog: false,
            delTaskDialog: false,
            delTaskDialogMutile: false,
            seeTaskResult: false,
            taskTitle: '添加任务',
            types: [
                {
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
            addForm: {
                name: '',
                runMethod: '',
                runConfig: '',
                engineType: '',
                objId: '',
                port: '',
                checked: false,
                type: '', // 执行时间类型
                time: '', // 扫描时间
                day: '',
                scanRange: ''// 扫描范围
            },
            formLabelWidth: '110px',
            tableDataTask: [],
            transtionTaskId: '',
            oldParent: '', // 回显id
            currentTab: '1',
            get_params: {
                taskName: '',
                taskType: '',
                page: 1,
                size: 20
            },
            timeTypes: [
                {
                    label: '每天执行',
                    value: 0
                }, {
                    label: '每周执行',
                    value: 1
                }, {
                    label: '每月执行',
                    value: 2
                }
            ],
            dayList: [
                { name: '星期一', isfold: false, val: 1 },
                { name: '星期二', isfold: false, val: 2 },
                { name: '星期三', isfold: false, val: 3 },
                { name: '星期四', isfold: false, val: 4 },
                { name: '星期五', isfold: false, val: 5 },
                { name: '星期六', isfold: false, val: 6 },
                { name: '星期日', isfold: false, val: 7 }
            ],
            mouthList: [
                { name: '01', isfold: false, val: 1 },
                { name: '02', isfold: false, val: 2 },
                { name: '03', isfold: false, val: 3 },
                { name: '04', isfold: false, val: 4 },
                { name: '05', isfold: false, val: 5 },
                { name: '06', isfold: false, val: 6 },
                { name: '07', isfold: false, val: 7 },
                { name: '08', isfold: false, val: 8 },
                { name: '09', isfold: false, val: 9 },
                { name: '10', isfold: false, val: 10 },
                { name: '11', isfold: false, val: 11 },
                { name: '12', isfold: false, val: 12 },
                { name: '13', isfold: false, val: 13 },
                { name: '14', isfold: false, val: 14 },
                { name: '15', isfold: false, val: 15 },
                { name: '16', isfold: false, val: 16 },
                { name: '17', isfold: false, val: 17 },
                { name: '18', isfold: false, val: 18 },
                { name: '19', isfold: false, val: 19 },
                { name: '20', isfold: false, val: 20 },
                { name: '21', isfold: false, val: 21 },
                { name: '22', isfold: false, val: 22 },
                { name: '23', isfold: false, val: 23 },
                { name: '24', isfold: false, val: 24 },
                { name: '25', isfold: false, val: 25 },
                { name: '26', isfold: false, val: 26 },
                { name: '27', isfold: false, val: 27 },
                { name: '28', isfold: false, val: 28 },
                { name: '29', isfold: false, val: 29 },
                { name: '30', isfold: false, val: 30 },
                { name: '31', isfold: false, val: 31 }
            ],
            runMethods: [
                {
                    label: '立即执行',
                    value: 0
                }, {
                    label: '定时任务',
                    value: 1
                }, {
                    label: '周期任务',
                    value: 2
                }
            ],
            engineTypes: [
                {
                    label: '天境漏扫',
                    value: 1
                }
            ],
            seeData: {},
            execRecords: [
                // {
                //     name: '111',
                //     createTime: '2023-02-08 15:48:00',
                //     type: 1,
                //     id: '12121'
                // }
            ],
            recordList: [
                // {
                //     ip: '12222',
                //     port: '12222',
                //     mac: '12222',
                //     type: '12222',
                //     system: '12222',
                //     version: '12222',
                //     service: '12222'
                // }
            ]
        }
    },
    mounted() {
        this.$nextTick(() => {
            // this.get_data()
        })
    },
    watch: {},
    computed: {
        runConfig() {
            if (this.addForm.runMethod == 1) {
                return this.addForm.time
            } else if (this.addForm.runMethod == 2) {
                if (this.addForm.type == 0) {
                    return JSON.stringify({
                        type: this.addForm.type,
                        time: this.addForm.time
                    })
                } else {
                    return JSON.stringify({
                        type: this.addForm.type,
                        day: this.addForm.day,
                        time: this.addForm.time
                    })
                }
            } else {
                return ''
            }
        }
    },
    methods: {
        isTaskType(val) {
            if (val == 0) {
                return '主机漏洞'
            } else if (val == 1) {
                return '基线漏洞'
            } else if (val == 2) {
                return '网站漏洞'
            } else if (val == 3) {
                return '口令猜测'
            }
        },
        handleSeeResult(row) {
            findSubData({
                queryData: {},
                paramsData: {
                    taskSubId: row.id
                }
            }).then(res => {
                this.recordList = []
                res.length && res.forEach(item => {
                    this.recordList.push({
                        ip: item.ip,
                        port: item.port,
                        mac: item.mac,
                        type: item.status,
                        system: item.system || '',
                        version: item.version || '',
                        service: item.service || '',
                        zoneId: item.zoneId,
                        taskSubId: item.taskSubId
                    })
                })
            })
            this.seeTaskResult = true
        },
        back() {
            this.addDialog = false
        },
        delMutile() {
            if (this.multipleSelection.length !== 0) {
                this.delTaskDialogMutile = true
            }
        },
        handleSeeTask(row) {
            this.seeData = this.$deepCopy(row)
            this.seeDialog = true
            findTaskSub({
                queryData: {},
                paramsData: {
                    assetsTaskMasterId: this.seeData.id
                }
            }).then(res => {
                this.execRecords = []
                if (res.records.length) {
                    res.records.forEach(item => {
                        this.execRecords.push({
                            id: row.id,
                            name: row.name,
                            createTime: item.createTime,
                            type: item.status,
                            assetsTaskMasterId: item.assetsTaskMasterId
                        })
                    })
                }
            })
        },
        deleteTaskFnMutile() {
            // const ids = this.multipleSelection.join(',')
            deleteTaskMaster({
                queryData: {},
                paramsData: {
                    taskMasterIdList: this.multipleSelection
                }
            })
                .then(res => {
                    this.delTaskDialogMutile = false
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    })
                    setTimeout(() => {
                        this.get_data()
                    }, 1500)
                })
                .catch(err => {
                    this.delTaskDialog = false
                    console.log(err + 'err')
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
        changeDoTime() {
            this.addForm.day = ''
            this.addForm.time = ''
        },
        finishDialogShow() {
            this.$refs.addForm.validate((valid) => {
                if (!valid) {
                    console.log('error submit!!')
                    return false
                } else {
                    this.finishConfim()
                }
            })
        },
        finishConfim() {
            let data = {
                queryData: {},
                paramsData: {
                    name: this.addForm.name,
                    taskType: this.addForm.taskType,
                    runMethod: this.addForm.runMethod,
                    runConfig: this.runConfig,
                    engineType: this.addForm.engineType,
                    scanType: this.addForm.scanType,
                    objId: this.addForm.objId,
                    portType: this.addForm.portType,
                    port: this.addForm.port,
                    isOpen: 1, // 创建任务默认开启
                    isIpv6: this.addForm.checked ? 1 : 0
                }
            }
            let methods = saveTaskMaster
            if (this.addForm.id) {
                data.paramsData.id = this.addForm.id
                methods = updateTaskMaster
            }
            console.log('data', data)
            methods(data).then(res => {
                this.finishDialog = false
                console.log('任务完成', res)
                this.$message({
                    message: '操作成功！',
                    type: 'success'
                })
                setTimeout(() => {
                    this.back()
                    this.get_data()
                }, 1500)
            }).catch(err => {
                console.log(err, 'err')
            })
        },
        handleClickItem(val) {
            this.dayList.map(item => {
                if (item.val == val) {
                    item.isfold = true
                } else {
                    item.isfold = false
                }
            })
            this.addForm.day = val
        },
        handleClickItem1(val) {
            this.mouthList.map(item => {
                if (item.val == val) {
                    item.isfold = true
                } else {
                    item.isfold = false
                }
            })
            this.addForm.day = val
        },
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    this.addDialog = false
                    done()
                })
                .catch(_ => {})
        },
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
                taskName: '',
                taskType: ''
            }
            this.get_data()
        },
        searchAssets() {
            this.get_data()
        },
        tabClick(val = '1') {
            this.currentTab = val
            if (val === '3') {
                this.get_data()
            }
        },
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        get_data() {
            this.loading_task = true
            this.tableDataTask = []
            let data = {
                queryData: {
                    page: this.get_params.page,
                    pageSize: this.get_params.size
                },
                paramsData: {
                    name: this.get_params.taskName,
                    taskType: this.get_params.taskType
                }
            }
            findTaskMaster(data)
                .then(res => {
                    console.log(res)
                    this.total_num = res.total
                    let list = res.records
                    this.loading_task = false
                    if (list.length) {
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
                            obj.createUser = item.createUser
                            obj.taskTypeCN = item.taskTypeCN
                            obj.runMethodCN = item.runMethodCN
                            obj.createUserCN = item.createUserCN
                            obj.engineTypeCN = item.engineTypeCN
                            this.tableDataTask.push(obj)
                        })
                    }
                })
                .catch(error => {
                    this.loading_task = false
                    console.log('error' + error)
                })
        },
        deepData(data) {
            if (data.length > 0) {
                data.forEach(item => {
                    if (item.sub) {
                        item.children = item.sub
                        this.deepData(item.children)
                    }
                })
            }
        },
        handleEditTask(row) {
            this.taskTitle = '编辑任务'
            this.addForm = {
                id: row.id,
                name: row.name,
                taskType: row.taskType,
                runMethod: row.runMethod,
                engineType: row.engineType,
                scanType: row.scanType,
                objId: row.objId,
                portType: row.portType,
                port: row.port,
                policyId: row.policyId,
                checked: row.isIpv6 == 1
            }
            if (row.runMethod == 1) {
                this.addForm.time = row.runConfig
            } else if (row.runMethod == 2) {
                let runConfig = JSON.parse(row.runConfig)
                if (runConfig.type == 0) {
                    this.addForm.type = runConfig.type
                    this.addForm.time = runConfig.time
                } else {
                    this.addForm.type = runConfig.type
                    this.addForm.day = runConfig.day
                    this.addForm.time = runConfig.time
                }
            }
            this.addDialog = true
        },
        handleDeleteTask(row) {
            this.transtionTaskId = row.id
            this.delTaskDialog = true
        },
        deleteTaskFn() {
            deleteTaskMaster({
                queryData: {
                },
                paramsData: {
                    taskMasterIdList: [this.transtionTaskId]
                }
            })
                .then(res => {
                    this.delTaskDialog = false
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    })
                    setTimeout(() => {
                        this.get_data()
                    }, 1500)
                })
                .catch(err => {
                    this.delTaskDialog = false
                    console.log(err + 'err')
                })
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
            console.log(this.multipleSelection) // create_id:
        },
        handleSizeChange(val) {
            this.get_params.size = val
            this.get_data()
        },
        handleCurrentChange(val) {
            this.get_params.page = val
            this.get_data()
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
            assetsFindOpen(data).then(res => {
                this.$message({
                    message: '操作成功',
                    type: 'success'
                })
            }).catch(error => {
                console.log(error + 'error')
            })
        }
    }
}
</script>

<style scoped lang="scss">
.custom-star {
    .tab-button {
        border: 1px solid #1cd7fa;
        border-radius: 4px;
        color: #ffffff !important;
        background-color: transparent !important;
        box-shadow: 0 0 7px inset #389bf7;
        & div {
            color: #ffffff !important;
            &.tab-active {
                border-bottom: 1px solid #387dee;
                color: #387dee !important;
            }
        }
    }
}
.el-select-dropdown__item:hover {
    background: none;
}
.el-select-dropdown__item {
    background: none;
}
.tab-button {
    margin-bottom: 2px;
    height: 30px;
    border-radius: 4px;
    background-color: rgb(19 109 172 / 20%);
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    & div {
        margin-right: 10px;
        width: 80px;
        height: 30px;
        font-size: 14px;
        text-align: center;
        // background: url("../../assets/img/tab_btn.jpg") 100% 100% no-repeat;
        color: rgb(0 0 0 / 60%);
        line-height: 30px;
        cursor: pointer;
        box-sizing: border-box;
        &.tab-active {
            border-bottom: 1px solid #387dee;
            color: #387dee;
        }
    }
}
.attendance-list {
    margin-top: 0;
}
.attendance-list::before {
    top: -1px;
    width: 90px;
    height: 28px;
    // background-image: url('/static/img/list-title.png');
    background-size: 100%;
}
.container ::v-deep .dialog-footer div:nth-child(2) .top_light {
    background: none;
}
.container ::v-deep .dialog-footer div:nth-child(2) .bottom_light {
    background: none;
}
.container ::v-deep .el-icon-arrow-right {
    color: #1cd7fa;
}
.el-select-dropdown__item.selected {
    font-weight: normal;
}
.tree_dropdown .el-select-dropdown__item.hover span {
    color: #ffffff;
}
.el-tree {
    background: rgb(0 0 0 / 0%);
}
.tree_dropdown .el-select-dropdown__item.hover span {
    color: #ffffff;
}
.container ::v-deep .disBtn {
    color: #666666;
}
.safe-event ::v-deep .el-tag.el-tag--success {
    border: solid 1px rgb(56 125 238 / 40%) !important;
    color: #387dee !important;
    background-color: rgb(56 125 238 / 20%) !important;
}
.event ::v-deep .el-input .el-input__count .el-input__count-inner {
    background: transparent;
}
.title {
    margin-bottom: 5px;
    font-size: 12px;
    color: #387dee;
}
.container ::v-deep .el-descriptions-item__label.is-bordered-label {
    width: 120px;
}
.attack-box {
    .show-box {
        // height: 70px;
        overflow: hidden;
        width: 100%;
        .attack-item {
            position: relative;
            float: left;
            margin-right: 10px;
            margin-bottom: 10px;
            padding: 0 30px 0 10px;
            height: 30px;
            font-size: 12px;
            border: solid 1px #dcdcdc;
            border-radius: 3px;
            color: rgb(0 0 0 / 40%);
            cursor: pointer;
            box-sizing: border-box;
            line-height: 30px;
            .checkd-img {
                position: absolute;
                top: 0;
                right: 0;
                width: 0;
                height: 0;
                border-style: solid;
                border-width: 10px;
                border-color: #d8d8d8 #d8d8d8 transparent transparent;
                i {
                    position: absolute;
                    top: -10px;
                    right: -10px;
                    font-size: 12px;
                    color: #ffffff;
                }
            }
        }
        .attack-item.active {
            color: #ffffff;
            background-color: #387dee;
            .checkd-img {
                border-color: #387dee #387dee transparent transparent;
            }
        }
        .attack-item:hover {
            color: #ffffff;
            background-color: #387dee;
            .checkd-img {
                border-color: #387dee #387dee transparent transparent;
            }
        }
    }
    .more-btn {
        height: 20px;
        font-size: 12px;
        color: #1cd7fa;
        cursor: pointer;
        p {
            margin-right: 4px;
        }
        i {
            display: inline-block;
            font-size: 12px;
            transform: rotate(-90deg);
        }
    }
    .more-btn.open {
        i {
            transform: rotate(90deg);
        }
    }
}
.switch-wrapper {
    position: relative;
    margin-left: 10px;
    width: 56px;
    height: 20px;
    cursor: pointer;
}
.switch-wrapper>div:nth-child(1) {
    width: 56px;
    height: 20px;
    border-radius: 14px;
    background-color: #0052d9;
    div {
        padding: 0 8px;
        font-size: 12px;
        line-height: 20px;
    }
    >div:nth-child(1) {
        color: rgb(255 255 255 / 90%);
    }
    >div:nth-child(2) {
        color: rgb(255 255 255 / 90%);
    }
}
.switch-wrapper>div:nth-child(2) {
    position: absolute;
    top: 50%;
    left: 0;
    margin-top: -10px;
    width: 20px;
    height: 20px;
    border-radius: 100%;
}
.switch-wrapper.yes>div:nth-child(2) {
    animation: moveone 0s linear forwards;
}
.switch-wrapper.no>div:nth-child(2) {
    animation: _moveone 0s linear forwards;
}

@keyframes moveone {
    0% {
        left: 1px;
        background-color: rgb(255 255 255);
    }
    100% {
        left: 35px;
        background-color: rgb(255 255 255);
    }
}
@keyframes moveone {
    0% {
        left: 1px;
        background-color: rgb(255 255 255);
    }
    100% {
        left: 35px;
        background-color: rgb(255 255 255);
    }
}
@keyframes _moveone {
    0% {
        left: 35px;
        background-color: rgb(255 255 255);
    }
    100% {
        left: 1px;
        background-color: rgb(255 255 255);
    }
}
@keyframes _moveone {
    0% {
        left: 35px;
        background-color: rgb(255 255 255);
    }
    100% {
        left: 1px;
        background-color: rgb(255 255 255);
    }
}
@keyframes moveone_white {
    0% {
        left: 0;
        background-color: #ffffff;
    }
    100% {
        left: 36px;
        background-color: #ffffff;
    }
}
@keyframes moveone_white {
    0% {
        left: 0;
        background-color: #ffffff;
    }
    100% {
        left: 36px;
        background-color: #ffffff;
    }
}
@keyframes _moveone_white {
    0% {
        left: 36px;
        background-color: #ffffff;
    }
    100% {
        left: 0;
        background-color: #ffffff;
    }
}
@keyframes _moveone_white {
    0% {
        left: 36px;
        background-color: #ffffff;
    }
    100% {
        left: 0;
        background-color: #ffffff;
    }
}
.white-theme .switch-wrapper.yes>div:nth-child(2) {
    animation: moveone_white 0s linear forwards;
}
.white-theme .switch-wrapper.no>div:nth-child(2) {
    animation: _moveone_white 0s linear forwards;
}
</style>
