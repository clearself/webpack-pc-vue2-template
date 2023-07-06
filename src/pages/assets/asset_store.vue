<template>
    <div class="list">
        <SearchTop @search="searchVal" @reset="reset">
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                    <el-form-item label="厂商名称:" label-width="80px">
                        <el-input size="small" clearable v-model.trim="searchForm.name" placeholder="请输入"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
        </SearchTop>
        <div class="list-container">
            <div class="ub ub-pj w100 mb-1 ub-ac">
                <div class="list-tips">资产信息库 <div class="back-btn" style="display: inline-block;font-size:13px;color:#0052d9;cursor: pointer;margin-left: 20px;" @click="$router.go(-1)"><i
                    style="margin-right: 6px;"
                    class="el-icon-back"
                    aria-hidden="true"></i>返回</div></div>
                <div>
                    <el-button size="small" icon="el-icon-plus" type="primary" @click="addUserDialog = true">添加</el-button>
                    <el-button style="margin-left: 10px;" size="small" icon="el-icon-delete" type="danger" @click="deleteAll">删除</el-button>
                </div>
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
                :header-row-style="{ height: '32px' }"
                @selection-change="handleSelectionChange">
                <el-table-column align="center" type="selection" width="30">
                </el-table-column>
                <el-table-column align="center" type="index" label="序号" width="50" :index="indexMatchUserMethod">
                </el-table-column>
                <el-table-column align="left" prop="name" label="厂商名称">
                </el-table-column>
                <el-table-column align="left" prop="createTimeFormat" label="创建时间" width="170">
                </el-table-column>
                <el-table-column align="center" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button @click="handleEdit(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
                        <el-button @click="handleDelete(scope.$index, scope.row)" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :total="totalPages" :page.sync="currentPage" :limit.sync="pagesize" @pagination="getAllList" style="padding-top:10px" v-show="totalPages>0"/>
        </div>
        <!--新增厂商-->
        <el-dialog title="新增厂商" :visible.sync="addUserDialog" width="700px" custom-class="common-dialog">
            <el-form :model="addUserForm" status-icon :rules="rules" label-position="top" ref="addUserForm">
                <el-form-item label="厂商名：" :label-width="formLabelWidth" prop="name" size="small">
                    <el-input v-model.trim="addUserForm.name" placeholder="请输入厂商名" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addUserDialog=false" size="small">取消</el-button>
                <el-button type="primary" @click="handleAdd('addUserForm',addUserForm)" size="small">确认</el-button>
            </div>
        </el-dialog>
        <!--修改厂商-->
        <el-dialog title="修改厂商" :visible.sync="changeUserDialog" width="700px" custom-class="common-dialog">
            <el-form :model="changeUserForm" status-icon :rules="rules" label-position="top" ref="changeUserForm">
                <el-form-item label="厂商名" :label-width="formLabelWidth" prop="name" size="small">
                    <el-input v-model.trim="changeUserForm.name" placeholder="请输入厂商名" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="changeUserDialog=false" size="small">取消</el-button>
                <el-button type="primary" @click="changeUser('changeUserForm',changeUserForm)" size="small">确认</el-button>
            </div>
        </el-dialog>
        <!--user删除开始-->
        <DeleteDialog
            :dialogVisible = userDeleteDialog
            @delete="deleteUser"
            @cancel="userDeleteDialog = false">
        </DeleteDialog>
        <DeleteDialog
            :dialogVisible = userDeleteAll
            @delete="deleteAllUser"
            @cancel="userDeleteAll = false">
        </DeleteDialog>
    </div>
</template>

<script>
import {
    getDepsAll,
    addDeps,
    delDeps
} from '../../server/assets/asset_store.js'
export default {
    name: 'Store',
    data() {
        return {
            tabHeight: document.body.clientHeight - 260,
            rules: {
                name: [{
                    required: true,
                    message: '请输入厂商名称',
                    trigger: 'blur'
                }]
            },
            form: {
                name: ''
            },
            loading: true,
            departmentOp: [],
            delIds: [],
            pagesize: 20,
            currentPage: 1,
            totalPages: 1,
            totalElements: 1,
            tableData: [],
            multipleSelection: [],
            addUserDialog: false,
            searchForm: {
                name: '',
                page: 1
            },
            addUserForm: {
                name: ''
            },
            changeUserDialog: false,
            changeUserForm: {},
            formLabelWidth: '120px',
            userDeleteDialog: false,
            userDeleteAll: false

        }
    },
    created: function() {
        this.getAllList()
        // this.getAllDeps();
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
            this.form = {
                name: ''
            }
            this.pagesize = 20
            this.currentPage = 1
            this.getAllList()
        },
        indexMatchUserMethod(index) {
            return (this.currentPage - 1) * this.pagesize + index + 1
        },
        searchVal() {
            this.currentPage = 1
            let data = {
                queryData: {
                    pageSize: this.pagesize,
                    page: this.currentPage
                },
                paramsData: {
                    name: this.searchForm.name
                }
            }
            getDepsAll(data).then(res => {
                this.loading = false
                this.totalPages = res.total
                this.tableData = res.records
            }).catch(error => {
                console.log('error', error)
            })
        },
        handleAdd(formVal, obj) {
            let data = {
                queryData: {},
                paramsData: this.addUserForm
            }
            this.$refs[formVal].validate((valid) => {
                if (valid) {
                    addDeps(data).then(res => {
                        this.addUserDialog = false
                        this.$refs[formVal].resetFields()
                        this.getAllList()
                    }).catch(error => {
                        console.log('error', error)
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        handleEdit(index, row) {
            if (this.$refs.changeUserForm !== undefined) {
                this.$refs.changeUserForm.resetFields()
            }
            this.changeUserDialog = true
            this.changeUserForm = {
                id: row.id,
                name: row.name
            }
        },
        handleDelete(index, row) { // 确定删除厂商弹窗
            this.userDeleteDialog = true
            let ids = []
            ids.push(row.id)
            this.delIds = ids
        },
        changeUser(formVal, obj) {
            // this.$refs[formVal].resetFields();
            let data = {
                queryData: {},
                paramsData: this.changeUserForm
            }
            this.$refs[formVal].validate((valid) => {
                if (valid) {
                    addDeps(data).then(res => {
                        this.changeUserDialog = false
                        this.$message({
                            message: '编辑成功',
                            type: 'success'
                        })
                        this.getAllList()
                    }).catch(error => {
                        console.log('error', error)
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        deleteUser() { // 删除厂商
            this.userDeleteDialog = false
            let data = {
                queryData: {},
                paramsData: {
                    ids: this.delIds
                }
            }
            delDeps(data).then(res => {
                // console.log('success', res);
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.getAllList()
                }, 1000)
            }).catch(error => {
                console.log('error', error)
            })
        },
        deleteAllUser() { // 删除全部厂商
            this.userDeleteAll = false

            console.log(this.multipleSelection)
            let data = {
                queryData: {},
                paramsData: {
                    ids: this.multipleSelection
                }
            }
            delDeps(data).then(res => {
                // console.log('success', res);
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.getAllList()
                }, 1000)
            }).catch(error => {
                console.log('error', error)
            })
        },
        handleSizeChange(size) {
            this.pagesize = size
            this.getAllList()
        },
        handleCurrentChange(currentPage) {
            this.currentPage = currentPage
            this.getAllList()
            // console.log(this.currentPage);
        },
        handleSelectionChange(val) {
            let arr = []
            for (const index in val) {
                arr.push(val[index].id)
            }
            this.multipleSelection = arr
        },
        deleteAll() {
            if (this.multipleSelection.length === 0) {
                this.$message({
                    message: '请先选择厂商！',
                    type: 'warning'
                })
            } else {
                this.userDeleteAll = true
            }
        },
        getAllList() {
            let data = {
                queryData: {
                    pageSize: this.pagesize,
                    page: this.currentPage
                },
                paramsData: {
                    name: this.searchForm.name
                }
            }
            getDepsAll(data).then(res => {
                this.loading = false
                this.totalPages = res.total
                this.tableData = res.records
                this.departmentOp = res.records
            }).catch(error => {
                console.log('error', error)
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.department {
    font-size: 30px;
    padding: 0px 20px 10px 0;
    box-sizing: border-box;
}
.event-btn-col {
    display: flex;
    align-items: center;
}

.event-btn {
    font-size: 14px;
}

.user-search {
    border-radius: 20px;
}

.search-right {
    margin-right: -10px;

    .el-form {
        float: right;
        margin-right: -10px;

        .el-form-item {
            margin-bottom: 0;
        }

    }
}
</style>
