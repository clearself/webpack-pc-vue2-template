<template>
    <div>
        <el-dialog title="历史查询记录" :visible.sync="recordDialog" width="900px" custom-class="common-dialog" :before-close="cancel">
            <div class="content ub ub-pj" style="width:100%;">
                <div class="content-left-one mr-1">
                    <Classify :recordDialog="recordDialog"  @getCurrentNode="getCurrentNode" ref="classify"></Classify>
                </div>
                <div class="content-right-one">
                    <div style="margin-bottom: 10px">
                        <el-input placeholder="依据名称搜索" clearable v-model="get_params.name" class="tree-input" size="small" style="width: 500px">
                            <el-button slot="append" icon="el-icon-search" @click="handleSearch" style="height:32px !important;border-top-right-radius: 3px !important;border-bottom-right-radius: 3px !important;"></el-button>
                        </el-input>
                    </div>
                    <div>
                        <el-table ref="multipleTable" v-loading="loading" class='bigTable' :data="tableData" border stripe tooltip-effect="dark" :height="310">
                            <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                            </el-table-column>
                            <el-table-column prop="name" width="60" label="名称" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column prop="typeName" width="120" label="分类名称" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column label="查询条件">
                                <template slot-scope="scope">
                                    <!-- <div class="ub">
                                        <div style="width: 90px;color:#00e9ff">检索时间：</div> <div style="width: 668px;word-break:break-all;word-wrap: break-word;overflow:auto"> {{ scope.row.inputStr }}</div>
                                    </div> -->
                                    <div class="ub">
                                        <!-- {{ scope.row.inputStr }} -->
                                        <!-- String(scope.row.time).indexOf('最近') == -1?'最近'+scope.row.time:scope.row.time -->
                                        <div style="width: 90px;color:#378dee">检索时间：</div> <div style="width: 250px;word-break:break-all;word-wrap: break-word;overflow:auto"> {{unitTime(scope.row.time,scope.row.timeStatus)}}{{scope.row.timeStatus?unitText(scope.row.timeStatus):''}}</div>
                                    </div>
                                    <div class="ub">
                                        <div style="width: 90px;color:#378dee">搜索条件：</div> <div style="width: 250px;word-break:break-all;word-wrap: break-word;overflow:auto"> {{ scope.row.sqlStr }}</div>
                                    </div>
                                    <div class="ub">
                                        <div style="width: 90px;color:#378dee">过滤条件：</div> <div style="width: 250px;word-break:break-all;word-wrap: break-word;overflow:auto"> {{ scope.row.groupStr }}</div>
                                    </div>
                                </template>
                            </el-table-column>

                            <el-table-column align="center" label="操作" width="100">
                                <template slot-scope="scope">
                                    <el-button  type="text" size="small" @click="query(scope.row)">查询</el-button>
                                    <el-button  type="text" size="small" @click="delBtn(scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <pagination v-show="total_num>0" :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size" @pagination="getData" />
                    </div>
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
import Classify from './classify.vue'
import { pageSearchHistory, deleteSearchHistory } from '@/server/data_manage/new_search.js'
export default {
    props: ['recordDialog'],
    components: {
        Classify
    },
    watch: {
        recordDialog(val) {
            if (val) {
                // this.getData()
            }
        }
    },
    data() {
        return {
            delIds: [],
            total_num: 0,
            get_params: {
                page: 1,
                size: 10,
                name: '',
                typeId: ''
            },
            tableData: [],
            loading: false,
            // recordDialog: false,
            deleteDialog: false,
            name: ''
        }
    },
    mounted() {
        this.$nextTick(() => {
            // this.getData()
        })
    },
    methods: {
        unitTime(time, timeStatus) {
            let str = '今天昨天本周上周本月上月'
            if (timeStatus) {
                return '最近' + time
            } else {
                if (String(time).indexOf('最近') == -1 && str.indexOf(time) == -1 && String(time).length <= 15) {
                    return '最近' + time
                } else {
                    return time
                }
            }
        },
        unitText(val) {
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
        cancel() {
            this.$parent.recordDialog = false
        },
        getCurrentNode(node) {
            this.get_params.typeId = node.id
            this.getData()
            console.log('树信息', node)
        },
        handleSearch() {
            this.get_params.page = 1
            this.getData()
        },
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        query(row) {
            this.$emit('query', row)
            this.$parent.recordDialog = false
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
            deleteSearchHistory(data).then(res => {
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
                    name: this.get_params.name,
                    typeId: this.get_params.typeId
                }
            }
            pageSearchHistory(data).then(res => {
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
.content-right-one{
    ::v-deep .search-btn{
        height: 32px !important;
        border-top-right-radius: 3px !important;
        border-bottom-right-radius: 3px !important;
    }
}
.common-dialog .el-input-group__append button.el-button {
    height: 30px !important;
    margin-top: 0px !important;
}

</style>
<style lang="scss">
  .common-dialog {
    .el-dialog__body{
        overflow-y:hidden;
    }
   .content {
      .content-left-one {
        width: 140px;
        min-height: 320px;
        // background-color: red;
      }
      .content-right-one {
        width: 685px !important;
        min-height: 320px;
        // background-color: blue;
      }
    }
    .el-input-group__append, .el-input-group__prepend {
        // background-color: rgba($color: #000000, $alpha: 0);
        // color:#00e9ff;
        border: none;
        // box-shadow: inset 0px 0px 7px 0px #389bf7;
        padding: 0 10px;
        line-height: 20px;
    }
  }
</style>
