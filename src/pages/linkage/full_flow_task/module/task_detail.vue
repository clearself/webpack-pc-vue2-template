<template>
    <div>
        <el-dialog :visible.sync="detailDialog" title="查看任务条件" width="900px" custom-class="attendance-dialog">
            <div style="width: 96%; margin: 0 auto">
                <el-table
                    ref="multipleTable"
                    v-loading="loading"
                    class="bigTable"
                    :data="tableData"
                    border
                    stripe
                    tooltip-effect="dark"
                >
                    <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号" />
                    <el-table-column align="center" prop="srcIp" label="源IP" show-overflow-tooltip />
                    <el-table-column align="center" prop="srcPort" label="源端口" show-overflow-tooltip />
                    <el-table-column align="center" prop="desIp" label="目的IP" show-overflow-tooltip />
                    <el-table-column align="center" prop="desPort" label="目的端口" show-overflow-tooltip />
                    <el-table-column align="center" prop="createTime" label="创建时间" width="140" show-overflow-tooltip />
                    <el-table-column align="center" label="操作" width="90">
                        <template slot-scope="scope">
                            <el-button type="text" @click="handleDelete(scope.row)">删 除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination
                        background
                        :current-page="page"
                        :page-sizes="[5, 10]"
                        :page-size="size"
                        layout="total, sizes, prev, pager, next"
                        prev-text="上一页"
                        next-text="下一页"
                        :total="total"
                        @size-change="sizeChange"
                        @current-change="pageChange"
                    />
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <cancelBtn title="取 消" @click="detailDialog = false" />
            </span>
        </el-dialog>
        <!--删除-->
        <el-dialog title="删除" :visible.sync="deleteDialog" width="30%" custom-class="attendance-dialog">
            <span>确定删除吗？</span>
            <span slot="footer" class="dialog-footer">
                <searchBtn title="确 定" @click="handleDeleteFun" />
                <cancel-btn title="取 消" @click="deleteDialog = false" />
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { conditionPage, delCondition } from '@/server/linkage/full_flow_task'
export default {
    name: 'TaskDetail',
    mixins: [],
    data() {
        return {
            deleteDialog: false,
            deleteId: '',
            loading: false,
            tableData: [],
            detailDialog: false,
            size: 10,
            total: 0,
            page: 1
        }
    },
    watch: {
        // detailDialog: {
        //     handler(newVal, oldVal) {
        //         if (!newVal) {
        //             this.page = 1;
        //             this.total = 0;
        //             this.tableData = [];
        //         }
        //     }
        // }
    },
    methods: {
        handleDeleteFun() {
            let data = {
                queryData: {},
                paramsData: {
                    id: this.deleteId
                }
            }
            delCondition(data)
                .then(res => {
                    this.deleteDialog = false
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    })
                    setTimeout(() => {
                        this.init()
                    }, 1500)
                })
                .catch(error => {
                    this.deleteDialog = false
                    console.log(error + 'error')
                })
        },
        handleDelete(row) {
            this.deleteId = row.id
            this.deleteDialog = true
        },
        indexMethod(index) {
            return (this.page - 1) * this.size + index + 1
        },
        init() {
            this.loading = true
            this.tableData = []
            const data = {
                queryData: {
                    page: this.page,
                    pageSize: this.size
                },
                paramsData: {
                }
            }
            conditionPage(data)
                .then((res) => {
                    console.log(res)
                    this.loading = false
                    this.total = res.total
                    this.tableData = res.records
                })
                .catch((error) => {
                    this.loading = false
                    console.log('error' + error)
                })
        },
        pageChange(e) {
            this.page = e
            this.init()
        },
        sizeChange(e) {
            this.size = e
            this.init()
        }
    }
}
</script>
<style lang="scss" scoped></style>
