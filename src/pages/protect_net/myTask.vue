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
                        <el-form-item label="任务状态：" style="width: 100%" label-width="85px">
                            <el-select v-model="get_params.status" size="small" clearable>
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
                <div class="list-tips">任务列表
                </div>
                <div>
                    <el-button icon="iconfont icon-daochu" v-per="['protective_my_imp']" size="small" @click="downloadUrl" type="primary">导出内容</el-button>
                </div>
            </div>
            <el-table
                ref="multipleTable"
                v-loading="loading"
                class='bigTable'
                :data="tableData"
                :row-class-name="tableRowClassName"
                :row-style="{ height: '32px' }"
                :header-row-style="{ height: '32px' }"
                border
                stripe
                tooltip-effect="dark"
                :height="tableHeight"
                @selection-change="handleSelectionChange">
                <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="taskName" label="任务名称" width="180">
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="output" label="输出物" show-tooltip-when-overflow>
                </el-table-column>
                <el-table-column label="执行人" width="200">
                    <template slot-scope="scope">
                        <div>
                            <div class="mb0 roles" v-if="scope.row.users.length > 0">
                                <el-tag style="margin-right: 5px;" size="mini" type="success" v-for="(names,index) in scope.row.users" :key="index">{{ names.userName }}</el-tag>
                            </div>
                            <div v-else>--</div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="耗时/h" width="100">
                    <template slot-scope="scope">
                        <div class="mb0 roles">
                            <span>{{scope.row.hours}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="startTime" label="发起时间" width="170">
                </el-table-column>
                <el-table-column prop="endTime" label="完后时间" width="170">
                </el-table-column>
                <el-table-column align="center" fixed="right" label="任务状态" width="100" class-name="deepBg">
                    <template slot-scope="scope">
                        <div>
                            <el-popover
                                placement="top"
                                width="180"
                                popper-class="desIp-popover-box"
                                trigger="click">
                                <div class="desIp-popover">
                                    <div class="click-btn">
                                        <!-- <div class="click-btn"  @click="addSearch('reportStatus',scope.row.status)"> -->
                                        <i class="el-icon-plus"></i>
                                        <span>事件状态 = {{scope.row.statusCN}}</span>
                                    </div>
                                    <div >
                                        <i
                                            class="el-icon-document-copy"
                                            v-clipboard:copy="scope.row.statusCN"
                                            v-clipboard:success="firstCopySuccess"
                                            v-clipboard:error="firstCopyError"
                                        ></i>
                                        <span>复制</span>
                                    </div>
                                </div>
                                <div slot="reference">
                                    <div :class="getStatus(scope.row.status)" class="ub ub-ac ub-pc alarm-state">
                                        <div>{{ scope.row.statusCN }}</div>
                                    </div>
                                </div>
                            </el-popover>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="center" fixed="right" label="操作" width="120" class-name="deepBg">
                    <template slot-scope="scope">
                        <el-button v-per="['protective_my_posal']" :disabled="scope.row.userEnd == 1" size="small" type="text" @click="handleDisposal(scope.row)">处理</el-button>
                        <el-button v-per="['protective_my_view']" size="small" type="text" @click="handleSee(scope.row)">查看</el-button>
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
    </div>
</template>

<script>
import {
    get_myTaskData,
    exportMyTask
} from '../../server/protect_net/api.js'

export default {
    name: 'MyTask',
    data() {
        return {
            tableHeight: document.body.clientHeight - 260,
            isOpen: false,
            detailArr: [],
            loading: false,
            total_num: 0,
            tableData: [],
            sayTimes: [],
            multipleSelection: [],
            row: {},
            get_params: {
                page: 1,
                size: 20,
                taskName: '',
                output: '',
                status: ''
            },
            states: [
                {
                    value: 1,
                    label: '未完成'
                }, {
                    value: 2,
                    label: '已完成'
                }
            ]
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.get_data()
        })
    },
    methods: {
        getStatus(status) {
            if (status == 1) {
                return 'one'
            } else {
                return 'two'
            }
        },
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex % 2) {
                return 'table-row2'
            } else {
                return 'table-row1'
            }
        },
        downloadUrl() {
            if (!this.tableData.length) {
                this.$message.warning('无可导出数据')
                return false
            }
            let data = {
                queryData: {
                    taskName: this.get_params.taskName,
                    output: this.get_params.output,
                    status: this.get_params.status
                },
                paramsData: {}
            }
            this.isClick = true
            exportMyTask(data).then(res => {
                console.log(res, '查看下载')
                this.isClick = false
                let url = window.URL.createObjectURL(new Blob([res], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                }))
                let link = document.createElement('a')
                link.style.display = 'none'
                link.href = url
                link.setAttribute('download', '组织架构列表.xlsx')
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link) // 下载完成移除元素
                window.URL.revokeObjectURL(url) // 释放掉blob对象
            }).catch(err => {
                this.isClick = false
                console.log(err + 'err')
            })
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
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        searchAssets() {
            this.get_params.page = 1
            this.get_data()
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
                    startTime: this.sayTimes && this.sayTimes.length > 0 ? this.sayTimes[0] : '',
                    endTime: this.sayTimes && this.sayTimes.length > 0 ? this.sayTimes[1] : '',
                    taskName: this.get_params.taskName,
                    output: this.get_params.output,
                    status: this.get_params.status ? this.get_params.status * 1 : ''
                }
            }
            console.log(data)
            get_myTaskData(data).then(res => {
                console.log(res)
                this.loading = false
                this.total_num = res.total
                let list = res.records
                if (list.length > 0) {
                    list.forEach(item => {
                        let obj = {}
                        obj.hours = item.hours
                        obj.statusCN = item.statusCN
                        obj.isDelete = item.isDelete
                        obj.groupId = item.groupId
                        obj.history = item.history
                        obj.version = item.version
                        obj.users = []
                        if (item.users.length > 0) {
                            item.users.forEach(_item => {
                                if (_item.userName) {
                                    obj.users.push(_item)
                                }
                            })
                        }
                        obj.output = item.output
                        obj.groupName = item.groupName
                        obj.des = item.des
                        obj.createTime = item.createTime
                        obj.taskName = item.taskName
                        obj.startTime = item.startTime
                        obj.endTime = item.endTime
                        obj.id = item.id
                        obj.status = item.status
                        obj.userEnd = item.userEnd
                        obj.userFeedback = item.userFeedback

                        this.tableData.push(obj)
                        // console.log(this.tableData)
                    })
                }
            }).catch(error => {
                this.loading = false
                console.log('error' + error)
            })
        },
        handleDisposal(row) {
            this.$router.push({
                name: 'myTask_inner',
                params: {
                    row: row,
                    from: 'disposal'
                }
            })
        },
        handleSee(row) {
            this.$router.push({
                name: 'myTask_inner',
                params: {
                    row: row,
                    from: 'see'
                }
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
            this.multipleSelection = val
        },
        firstCopySuccess(e) {
            console.log('copy arguments e:', e)
            this.$message({
                message: '复制成功!',
                type: 'success'
            })
        },
        firstCopyError(e) {
            console.log('copy arguments e:', e)
            this.$message({
                message: '复制失败!',
                type: 'warning'
            })
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
        .roles ::v-deep .el-tag.el-tag--success {
            background-color: rgba(0, 0, 0, 0);
            border-color: #01c5ff;
            color: #00fdff;
        }
        .bigTable  ::v-deep  .colorDot {
            width: 10px;
            height: 10px;
            margin-right: 10px;
            vertical-align: center;
            display: inline-block;
            border-radius: 50%;

            &.status0 {
                background-color: #c0c0c0;
                box-shadow: 0 0 10px #bebebe;
            }
            &.status1 {
                background-color: #ffba00;
                box-shadow: 0 0 10px #ffba00;
            }
            &.status2 {
                background-color: #00c0ff;
                box-shadow: 0 0 10px #00c0ff;
            }
        }
    .alarm-state{
        width:80px;
        height:18px;
        padding:2px 5px;
        border-radius: 11px;
        &.one{
            background-color: #fde6d8;
            color:#de7400;
        }
        &.two{
            background-color: #ccf6e4;
            color:#03864f;
        }
        &.three{
            background-color: #d5e5fa;
            color:#0052d9;
        }
        &.four{
            background-color: #fad7dd;
            color:#aa0202;
        }
    }
.desIp-popover{
    i{
        font-size:12px;
        margin-right:10px;
        cursor: pointer;
        color: #0052d9;
        &:hover{
            opacity:0.8;
        }
    }
    span{
        font-size:12px;
        color: rgba(0,0,0,.9);
    }
    >div:nth-child(1){
        margin-bottom:10px;
    }
}
    </style>
