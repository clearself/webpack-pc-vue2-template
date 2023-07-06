<template>
    <div class="off-line-task">
        <el-dialog title="离线任务" :visible.sync="taskDialog" width="940px" custom-class="common-dialog" :before-close="cancel">
            <div class="content" style="width:100%;">
                <div style="margin-bottom: 10px">
                    <el-input placeholder="请输入任务名称" clearable v-model="get_params.name" class="tree-input" size="small" style="width: 500px">
                        <el-button class="ub ub-ac" slot="append" icon="el-icon-search" @click="handleSearch" style="height:32px !important;border-top-right-radius: 3px !important;border-bottom-right-radius: 3px !important;"></el-button>
                    </el-input>
                </div>
                <div>
                    <el-table ref="multipleTable" v-loading="loading" class='bigTable' :data="tableData" border stripe tooltip-effect="dark" :row-style="{ height: '32px' }" :header-row-style="{ height: '32px' }" :row-class-name="tableRowClassName">
                        <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                        </el-table-column>
                        <el-table-column prop="name" width="400" label="任务名称" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="createTime" width="200" label="创建时间" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="status" label="任务状态" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <div class="ub ub-ac">
                                    <div class='status' :class="{'state-zero': scope.row.status===0,'state-one': scope.row.status===1,'state-two': scope.row.status===2,'state-three': scope.row.status===3}"></div>
                                    <div>{{ scope.row.status | statusText }}</div>
                                </div>
                            </template>
                        </el-table-column>

                        <el-table-column align="center" label="操作" width="120">
                            <template slot-scope="scope">
                                <el-button v-if="scope.row.offType ===0 &&scope.row.status !== 2"  type="text" size="small" @click="begin(scope.row)">开始</el-button>
                                <el-button v-if="scope.row.offType !==0 &&scope.row.status !== 2"  type="text" size="small" @click="suspend(scope.row)">暂停</el-button>
                                <el-button v-if="scope.row.status===2"  type="text" size="small" @click="see(scope.row)">查看</el-button>
                                <el-button :disabled="scope.row.status === 2"  type="text" size="small" @click="abolish(scope.row)">取消</el-button>
                                <el-button  type="text" size="small" @click="delBtn(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <pagination v-show="total_num>0" :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size" @pagination="getData" />

                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="cancel">取消</el-button>
            </span>
        </el-dialog>
        <!--删除-->
        <DeleteDialog
            :dialogVisible = deleteDialog
            @delete="handleDelete"
            @cancel="deleteDialog = false">
        </DeleteDialog>
    </div>
</template>

<script>
import initData from '@/mixins/initData.js'
// import { pageSearchTask, saveSearchTask, deleteSearchTask, startOrStop } from '@/server/data_manage/new_search.js'
import { pageSearchTask, saveSearchTask, deleteSearchTask, startOrStop } from '@/server/alarm_log/api.js'
export default {
    mixins: [initData],
    props: ['taskDialog'],
    components: {
    },
    filters: {
        statusText(val) {
            if (val === 0) {
                return '未开始'
            } else if (val === 1) {
                return '进行中'
            } else if (val === 2) {
                return '已完成'
            } else if (val === 3) {
                return '暂停中'
            } else {
                return '--'
            }
        }
    },
    watch: {
        taskDialog(val) {
            if (val) {
                this.getData()
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.getData()
        })
    },
    data() {
        return {
            delIds: [],
            total_num: 0,
            get_params: {
                page: 1,
                size: 10,
                name: ''
            },
            tableData: [],
            loading: false,
            deleteDialog: false,
            name: ''
        }
    },
    methods: {
        cancel() {
            this.$parent.taskDialog = false
        },
        handleSearch() {
            this.get_params.page = 1
            this.getData()
        },
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        // 开始
        begin(row) {
            let data = {
                queryData: {
                },
                paramsData: {
                    id: row.id,
                    queryMap: row.queryMap,
                    offType: 1
                }
            }
            startOrStop(data).then(res => {
                this.$message({
                    message: '开始成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.getData()
                }, 1500)
            }).catch(error => {
                console.log(error + 'error')
            })
        },
        // 暂停
        suspend(row) {
            let data = {
                queryData: {
                },
                paramsData: {
                    id: row.id,
                    queryMap: row.queryMap,
                    offType: 0
                }
            }
            startOrStop(data).then(res => {
                this.$message({
                    message: '暂停成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.getData()
                }, 1500)
            }).catch(error => {
                console.log(error + 'error')
            })
        },
        // 查看
        see(row) {
            this.$parent.taskDialog = false
            this.$emit('handleSee', row)
        },
        // 取消
        abolish(row) {
            let data = {
                queryData: {
                },
                paramsData: {
                    id: row.id,
                    status: 0,
                    queryMap: row.queryMap
                }
            }
            startOrStop(data).then(res => {
                this.$message({
                    message: '取消成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.getData()
                }, 1500)
            }).catch(error => {
                console.log(error + 'error')
            })
        },
        delBtn(row) {
            this.delIds = row.id
            this.deleteDialog = true
        },
        handleDelete() {
            let data = {
                queryData: {
                },
                paramsData: {
                    id: this.delIds
                }
            }
            deleteSearchTask(data).then(res => {
                this.deleteDialog = false
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.getData()
                }, 1500)
            }).catch(error => {
                this.deleteDialog = false
                console.log(error + 'error')
            })
        },
        handleCurrentChange(val) {
            this.get_params.page = val
            this.getData()
        },
        handleSizeChange(val) {
            this.get_params.size = val
            this.getData()
        },
        getData() {
            this.tableData = []
            let data = {
                queryData: {
                    page: this.get_params.page,
                    pageSize: this.get_params.size
                },
                paramsData: {
                    name: this.get_params.name
                }
            }
            pageSearchTask(data).then(res => {
                console.log('getSystem', res)
                this.total_num = res.total
                this.tableData = res.records
                this.loading = false
            }).catch(error => {
                this.loading = false
                console.log('error' + error)
            })
        }

    }
}
</script>

<style scoped lang="scss">
.off-line-task {
    .status {
        width: 10px;
        height: 10px;
        border-radius:50%;
        margin-right: 10px;
    }
    .state-zero {
        background-color: #c0c0c0;
        box-shadow: 0px 0px 10px 0px #bebebe;
    }
    .state-one {
        background-color: #00ff00;
        box-shadow: 0px 0px 10px 0px #00ff00;
    }
    .state-two {
        background-color: #00c0ff;
        box-shadow: 0px 0px 10px 0px #00c0ff;
    }
    .state-three {
        background-color: #ffba00;
        box-shadow: 0px 0px 10px 0px #ffba00;
    }
}

</style>
<style lang="scss">
  .common-dialog {
   .content {
      .content-left {
        width: 200px;
        height: 470px;
        // background-color: red;
      }
      .content-right {
        width: 690px;
        height: 470px;
        // background-color: blue;
      }
    }
    .el-input-group__append, .el-input-group__prepend {
        // background-color: rgba($color: #000000, $alpha: 0);
        color:#7e7e7e;
        border: none;
        // box-shadow: inset 0px 0px 7px 0px #389bf7;
        padding: 0 10px;
        line-height: 20px;
    }
    .el-input-group__append button.el-button {
        height: 30px !important;
        margin-top: 0px !important;
    }
  }
</style>
