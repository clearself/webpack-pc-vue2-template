<template>
    <div class="list">
        <div class="ub w100" style="box-sizing: border-box;">
            <SearchTop @search="searchAssets" @reset="reset">
                <el-col :md="12" :lg="8" :xl="6">
                    <el-form :model="get_params">
                        <el-form-item label="任务名称：" label-width="85px">
                            <el-input placeholder="请输入" style="width: 100%" clearable v-model="get_params.taskName" size="small"></el-input>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :md="12" :lg="8" :xl="6">
                    <el-form :model="get_params">
                        <el-form-item label="输出物：" label-width="85px">
                            <el-input placeholder="请输入" style="width: 100%" clearable v-model="get_params.output" size="small"></el-input>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :md="12" :lg="8" :xl="6">
                    <el-form :model="get_params">
                        <el-form-item label="任务状态：" label-width="85px">
                            <el-select v-model="get_params.status" style="width: 100%" size="small" clearable>
                                <el-option label="未发起" value=0></el-option>
                                <el-option label="未完成" value=1></el-option>
                                <el-option label="已完成" value=2></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </el-col>
            </SearchTop>
        </div>
        <div class="list-container">
            <div class="ub ub-pj w100 mb-1">
                <div class="list-tips">回收站列表</div>
                <div>
                    <el-button icon="iconfont icon-piliangtubiao" size="small" type="primary" @click="recoverGroup">批量恢复</el-button>
                </div>
            </div>
            <el-table
                ref="multipleTable"
                v-loading="loading"
                class='bigTable'
                :height="tableHeight"
                :row-class-name="tableRowClassName"
                :row-style="{ height: '32px' }"
                :header-row-style="{ height: '32px' }"
                :data="tableData"
                border
                stripe
                tooltip-effect="dark"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="50"></el-table-column>
                <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                </el-table-column>
                <el-table-column prop="taskName" label="任务名称" width="180">
                </el-table-column>
                <!--<el-table-column prop="des" label="任务描述" min-width="200" show-overflow-tooltip>
                    </el-table-column>-->
                <el-table-column prop="output" label="输出物" width="160">
                </el-table-column>
                <el-table-column prop="users" label="执行人">
                    <template slot-scope="scope">
                        <div>
                            <div class="mb0 roles" v-if="scope.row.users && scope.row.users.length > 0">
                                <!--eslint-disable-->
                                <el-tag style="margin-right: 5px" v-if="names.userName !== null" size="mini" type="success" v-for="(names,index) in scope.row.users" :key="index">{{ names.userName }}</el-tag>
                                <!--eslint-disable-->
                            </div>
                            <div v-else>--</div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="hours" label="耗时" width="160">
                </el-table-column>
                <el-table-column prop="startTime" label="发起时间" width="180">
                </el-table-column>
                <el-table-column prop="endTime" label="完成时间" width="180">
                </el-table-column>
                <el-table-column label="操作" align="center" width="80" fixed="right" class-name="deepBg">
                    <template slot-scope="scope">
                        <!-- <opt-btn title="恢复" icon="iconfont icon-huifu2" @click="handleFeedback(scope.row)"></opt-btn> -->
                        <el-button type="text" size="small" @click="handleFeedback(scope.row)">恢复</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination
                :total="total_num"
                :page.sync="get_params.page"
                :limit.sync="get_params.size"
                @pagination="get_data"
                style="padding-top:10px"
                v-show="total_num>0"/>
        </div>

        <!-- 单个恢复 -->
        <DeleteDialog
            :dialogVisible="recoverDialog"
            @delete="handleRecover"
            :title="'确认恢复吗？'"
            :text="'该任务将恢复至原有任务组'"
            @cancel="recoverDialog = false">
        </DeleteDialog>
        <!-- 批量恢复 -->
        <DeleteDialog
            :dialogVisible="recover_groupDialog"
            @delete="handleRecoverGroup"
            :title="'确认批量恢复吗？'"
            :text="'未找到任务组的将自动恢复至全部任务根目录下'"
            @cancel="recover_groupDialog = false">
        </DeleteDialog>

    </div>
</template>

<script>
import {
    get_recoverList,
    recoverData
} from '../../server/protect_net/api.js'
export default {
    name: 'Recycle',
    data() {
        return {
            tableHeight: document.body.clientHeight - 260,
            isOpen: false,
            detailArr: [],
            recoverDialog: false,
            recover_groupDialog: false,
            formLabelWidth: '100px',
            loading: false,
            total_num: 0,
            recordId: '',
            multipleSelection: [],
            tableData: [{
                date: '2016-05-02',
                name: '王小虎',
                person: [{
                    name: 123
                }]
            }, {
                date: '2016-05-02',
                name: '王小虎',
                person: [{
                    name: 123
                }]
            }],
            sayTimes: [],
            get_params: {
                page: 1,
                size: 20,
                taskName: '',
                output: '',
                status: ''
            }
        }
    },

    mounted() {
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
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        reset() {
            this.get_params = {
                page: 1,
                size: 20,
                taskName: '',
                output: '',
                status: ''
            }
            this.get_data()
        },
        searchAssets() {
            this.get_params.page = 1
            this.get_data()
        },
        get_data() {
            this.loading = true
            this.tableData = []
            let data = {
                taskName: this.get_params.taskName,
                output: this.get_params.output,
                status: this.get_params.status ? this.get_params.status * 1 : ''
            }
            let page = this.get_params.page
            let pageSize = this.get_params.size
            get_recoverList(data, page, pageSize).then(res => {
                console.log(res)
                this.loading = false
                this.total_num = res.total
                let list = res.records
                if (list.length > 0) {
                    list.forEach(item => {
                        let obj = {}
                        obj.id = item.id
                        obj.statusCN = item.statusCN
                        obj.isDelete = item.isDelete
                        obj.groupId = item.groupId
                        obj.output = item.output
                        obj.groupName = item.groupName
                        obj.des = item.des
                        obj.createTime = item.createTime
                        obj.taskName = item.taskName
                        obj.startTime = item.startTime
                        obj.endTime = item.endTime
                        obj.status = item.status
                        obj.users = item.users
                        obj.version = item.version
                        obj.history = item.history
                        item.hours && (obj.hours = item.hours)

                        this.tableData.push(obj)
                    })
                }
            }).catch(error => {
                this.loading = false
                console.log('error' + error)
            })
        },
        handleRecover() {
            let data = {
                ids: [this.recordId]
            }
            recoverData(data).then(res => {
                this.recoverDialog = false
                this.$message({
                    message: '恢复成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(error => {
                console.log(error)
            })
        },
        recoverGroup() {
            if (this.multipleSelection.length === 0) {
                this.$message({
                    message: '请选择要恢复的行',
                    type: 'warning'
                })
            } else {
                this.recover_groupDialog = true
            }
        },
        handleRecoverGroup() {
            console.log(this.multipleSelection)
            let arr = []
            this.multipleSelection.forEach(item => {
                arr.push(item.id)
            })
            console.log(arr)
            let data = {
                ids: arr
            }
            recoverData(data).then(res => {
                this.recover_groupDialog = false
                this.$message({
                    message: '恢复成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(error => {
                console.log(error)
            })
        },
        handleFeedback(row) {
            this.recordId = row.id
            this.recoverDialog = true
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        handleSizeChange(val) {
            this.get_params.size = val
            this.get_data()
        },
        handleCurrentChange(val) {
            this.get_params.page = val
            this.get_data()
        }
    }
}
</script>

    <style lang="scss" scoped>
        .pagination {
            padding: 0px 0 20px;
            text-align: right;
        }

        .el-input.ips {
            display: block;
            width: 100%;
        }

        .drawer-pad {
            padding: 0 20px;
        }

        .el-form-item {
            margin: 0;
        }

        .domain-add {
            line-height: 1;
            position: relative;
            padding: 0 20px;
            color: #1cd7fa;

            .el-button {
                position: absolute;
                right: 20px;
                top: 0;
                padding: 0;
                color: #1cd7fa;
            }
        }

        .domain-list {
            background: rgba(0, 0, 0, .3);
            margin: 3px 0 20px;
            padding: 20px 0 1px;

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
                    color: #F56C6C;
                }
            }
        }
        .event ::v-deep .el-range-input {
            background-color: rgba(0, 0, 0, 0);
            color: #fff;
        }
        .event ::v-deep .el-range-separator {
            color: #fff;
        }
        .event ::v-deep .el-radio__label {
            color: #C0C4CC;
        }
        .el-tag.el-tag--success {
            background-color: transparent;
            border-color: #01c5ff;
            color: #00fdff;
        }
        .el-select  ::v-deep  .el-tag {
            background-color: transparent;
            border-color: #1bd7fa;
            color: #1bd7fa;
        }
        .bigTable  ::v-deep .el-table__fixed-right::before, .bigTable .el-table__fixed::before {
            background: transparent !important;
        }
    </style>
    <style>
        .submit-dialog.el-dialog {
            /* border: 1px solid #4faffd !important; */
            /* box-shadow: 0px 0px 14px #00b4ff inset; */
            /* background-color: #042842; */
        }
        .submit-dialog .el-dialog__footer {
            text-align: center;
        }
    </style>
