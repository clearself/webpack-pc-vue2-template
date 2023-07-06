<template>
    <div class="list">
        <SearchTop @search="search" @reset="reset" style="border-top-left-radius:0;border-top-right-radius:0;box-shadow:none">
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params">
                    <el-form-item label="剧本名称：" label-width="80px">
                        <el-input placeholder="请输入" clearable v-model="get_params.name" size="small" maxlength="20"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params">
                    <el-form-item label="人工任务类型：" prop="type" label-width="100px">
                        <el-select placeholder="请选择" style="width: 100%;" v-model="get_params.type" size="small">
                            <el-option label="确认类" :value="1"></el-option>
                            <el-option label="判断类" :value="2"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :md="13" :lg="9" :xl="7">
                <el-form :model="get_params">
                    <el-form-item label="时间：" class="date-close" label-width="85px">
                        <el-date-picker style="width:100%;" size="small" prefix-icon="iconfont icon-riqi" value-format="yyyy-MM-dd HH:mm:ss" v-model="sayTimes" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                </el-form>
            </el-col>
        </SearchTop>
        <div class="list-container">
            <div class="ub ub-pj w100 mb-1 ub-ac">
                <div class="list-tips">我的任务</div>
            </div>
            <el-table
                ref="multipleTable"
                v-loading="loading"
                class='bigTable'
                :data="tableData"
                border
                stripe
                tooltip-effect="dark"
                :row-class-name="tableRowClassName"
                :height="tabHeight"
                :row-style="{ height: '32px' }"
                :header-row-style="{ height: '32px' }">
                <el-table-column type="index" width="50" label="序号" align="center" :index="indexMethod">
                </el-table-column>
                <el-table-column prop="runningTime" label="任务执行时间"></el-table-column>
                <el-table-column prop="autoOrderId" label="任务ID"></el-table-column>
                <el-table-column prop="autoName" label="关联剧本"></el-table-column>
                <el-table-column prop="mouldType" label="剧本类型" width="120">
                    <template slot-scope="scoped">
                        <div v-if="scoped.row.mouldType == 1">应急响应</div>
                        <div v-if="scoped.row.mouldType == 0">分析处置</div>
                        <div v-if="scoped.row.mouldType == 2">运维支持</div>
                    </template>
                </el-table-column>
                <el-table-column prop="mission" label="人工任务类型" width="120"></el-table-column>
                <el-table-column prop="tillTime" label="状态" width="140">
                    <template slot-scope="scope">
                        <span
                            style="display: inline-block;width: 110px; height: 20px;text-align: center;border-radius: 24px;color:#03864F;background-color: #CCF5E4;"
                            v-if="new Date(scope.row.tillTime).getTime() > new Date().getTime()"
                        >
                            进行中
                        </span>
                        <span
                            style="display: inline-block;width: 110px; height: 20px;text-align: center;border-radius: 24px;color:#F56C6C;background-color: rgba(245,108,108,.3);"
                            v-else-if="new Date(scope.row.tillTime).getTime() < new Date().getTime()"
                        >
                            已超时
                        </span>
                        <span
                            style="display: inline-block;width: 110px; height: 20px;text-align: center;border-radius: 24px;color:#03864F;background-color: #CCF5E4;"
                            v-else
                        >
                            进行中
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="describe" label="任务描述" width="300"></el-table-column>
                <el-table-column align="center" label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button v-per="['auto_task_do']" type="text" size="small" @click="handleSee(scope.row)">去处理</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size" @pagination="get_data" style="padding-top:10px;" v-show="total_num>0"/>
        </div>
        <!-- 查看详情 -->
        <el-drawer title="查看" :visible.sync="seeDialog" :size="920">
            <auto_response @submitCloes="submitCloes" :seeForm="seeForm" v-if="seeDialog" :alarmForm="alarmForm"></auto_response>
        </el-drawer>
    </div>
</template>
<script>
import auto_response from './add.vue'
import { myTaskPage, myTaskGetInfo } from '@/server/auto_respond/execution_list.js'
import { getMenace } from '@/server/alarm/alarm.js'
export default {
    components: { auto_response },
    data() {
        return {
            get_params: {
                page: 1,
                size: 20,
                name: '',
                type: null
            },
            sayTimes: [],
            loading: false,
            tableData: [],
            tabHeight: document.body.clientHeight - 286,
            total_num: 0,
            seeDialog: false,
            seeForm: {
                mission: '',
                affirmContent: '',
                dutyPeople: '',
                priority: '',
                describe: '',
                tillTime: '',
                question: '',
                optionList: [],
                autoOrderId: '',
                taskId: '',
                processInstanceId: '',
                deploymentId: '',
                runningTime: '',
                nodeId: ''
            },
            alarmForm: {}
        }
    },
    created() {
        this.get_data()
    },
    watch: {
        seeDialog(val) {
            if (!val) {
                this.seeForm = {
                    mission: '',
                    affirmContent: '',
                    dutyPeople: '',
                    priority: '',
                    describe: '',
                    tillTime: '',
                    question: '',
                    optionList: [],
                    autoOrderId: '',
                    taskId: '',
                    processInstanceId: '',
                    deploymentId: '',
                    runningTime: '',
                    nodeId: ''
                }
            }
        }
    },
    methods: {
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        handleSee(row) {
            this.seeForm = {
                mission: row.mission,
                affirmContent: row.affirmContent,
                dutyPeople: row.dutyPeople,
                priority: row.priority,
                describe: row.describe,
                tillTime: row.tillTime,
                question: row.question,
                optionList: typeof row.optionList == 'string' ? JSON.parse(row.optionList) : [],
                autoOrderId: row.autoOrderId,
                taskId: row.taskId,
                processInstanceId: row.processInstanceId,
                deploymentId: row.deploymentId,
                runningTime: row.runningTime,
                nodeId: row.nodeId
            }
            let data = {
                queryData: {
                    autoOrderId: row.autoOrderId
                }
            }
            myTaskGetInfo(data).then(async res => {
                this.alarmForm = {}
                if (res.srcIp) {
                    console.log(1)
                    try {
                        let srcIpIsSpite = await getMenace({
                            queryData: {
                                value: res.srcIp
                            }
                        })
                        console.log(srcIpIsSpite)
                        res.srcIpVenusIsSpite = srcIpIsSpite[0]
                        res.srcIpIsSpite = srcIpIsSpite[1]
                    } catch (e) {
                        console.log(e)
                    }
                }
                if (res.desIp) {
                    console.log(11)
                    try {
                        let desIpIsSpite = await getMenace({
                            queryData: {
                                value: res.desIp
                            }
                        })
                        // console.log(desIpIsSpite)
                        res.desIpVenusIsSpite = desIpIsSpite[0]
                        res.desIpIsSpite = desIpIsSpite[1]
                    } catch (e) {
                        console.log(e)
                    }
                }
                this.alarmForm = res
                console.log(this.alarmForm)
            }).catch(err => {
                console.log(err)
            })
            this.seeDialog = true
        },
        submitCloes(val) {
            if (val == '1') {
                this.get_data()
            }
            console.log(';')
            this.seeDialog = false
        },
        search() {
            this.get_params.page = 1
            this.get_data()
        },
        reset() {
            this.get_params = {
                page: 1,
                size: 20,
                name: '',
                type: null
            }
            this.sayTimes = []
            this.get_data()
        },
        get_data() {
            let data = {
                queryData: {
                    page: this.get_params.page,
                    pageSize: this.get_params.size
                },
                paramsData: {
                    autoName: this.get_params.name,
                    mission: this.get_params.type,
                    startTime: this.sayTimes[0] || '',
                    endTime: this.sayTimes[1] || ''
                }
            }
            this.loading = true
            myTaskPage(data).then(res => {
                this.tableData = res.records
                this.total_num = res.total
                this.loading = false
                if (this.$route.query.id) {
                    let autoOrderId = this.$route.query.id
                    this.$nextTick(() => {
                        let atdata = this.$getsessionStorage('autoResponseData') || {}
                        let data = JSON.parse(atdata[autoOrderId])
                        this.handleSee(data)
                    })
                }
            }).catch(err => {
                this.loading = false
                console.log(err)
            })
        },
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex % 2) {
                return 'table-row2'
            } else {
                return 'table-row1'
            }
        }
    }
}
</script>
