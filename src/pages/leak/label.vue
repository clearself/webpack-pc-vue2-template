<template>
    <div class="event">
        <div class="w100">
            <div class="ub w100 search-area" style="box-sizing: border-box;">
                <SearchTop @search="searchCheck" @reset="reset">
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="标签名称：" label-width="80px">
                                <el-input
                                    placeholder="请输入"
                                    clearable
                                    v-model="get_params.name"
                                    @keyup.enter.native="searchCheck"
                                    size="small"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </SearchTop>
            </div>
            <div class="attendance-list table-area">
                <div class="ub ub-pj ub-ac w100" style="margin-bottom: 10px;">
                    <div class="list-tips">列表内容</div>
                    <div>
                        <el-button v-per="['leaks_labelInfo_add']" size="small" type="primary" @click="addDialog = true" icon="el-icon-plus">添加标签</el-button>
                        <el-button v-per="['leaks_labelInfo_del']" size="small" type="danger" @click="handleDeleteAll" icon="el-icon-delete">刪 除</el-button>
                    </div>
                </div>
                <el-table
                    :height="tableHeight"
                    :row-class-name="tableRowClassName"
                    ref="multipleTable"
                    v-loading="loading"
                    class='bigTable full-table'
                    :data="tableData"
                    border
                    stripe
                    tooltip-effect="dark"
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="50"></el-table-column>
                    <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                    </el-table-column>
                    <el-table-column prop="name" label="标签名称" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建时间" width="160">
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="100">
                        <template slot-scope="scope">
                            <el-button v-per="['leaks_labelInfo_edit']" size="small" type="text" @click="handleEdit(scope.row)">编辑</el-button>
                            <el-button v-per="['leaks_labelInfo_del']" size="small" type="text" @click="handleDelete(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>

                </el-table>
                <pagination v-show="total_num>0" :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size" @pagination="get_data" />
            </div>
        </div>
        <el-dialog v-dialogDrag title="添加标签" :visible.sync="addDialog" width="700px" custom-class="common-dialog">
            <el-form :model="addForm" :rules="rules" ref="addForm" label-position="top">
                <el-form-item label="标签名称：" :label-width="formLabelWidth" prop="name">
                    <el-input placeholder="请输入" clearable v-model="addForm.name" size="small"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" @click="submitForm('addForm')">确 定</el-button>
                <el-button size="small" @click="addDialog = false">取 消</el-button>
            </span>
        </el-dialog>
        <!--编辑对象-->
        <el-dialog v-dialogDrag title="编辑标签" :visible.sync="editDialog" width="700px" custom-class="common-dialog">
            <el-form :model="editForm" :rules="rules" ref="editForm" label-position="top">
                <el-form-item label="标签名称：" :label-width="formLabelWidth" prop="name">
                    <el-input placeholder="请输入" clearable v-model="editForm.name" size="small"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" @click="submitFormEdit('editForm')">确 定</el-button>
                <el-button size="small" @click="editDialog = false">取 消</el-button>
            </span>
        </el-dialog>

        <!--删除资源-->
        <DeleteDialog
            :dialogVisible = deleteDialog
            @delete="handleDeleteFun"
            @cancel="deleteDialog = false">
        </DeleteDialog>
    </div>
</template>

<script>
import {
    getLabelList,
    deleteLabel,
    saveLabel,
    updateLabel
} from '../../server/leak/api.js'

export default {
    name: 'Label',
    data() {
        return {
            tableHeight: document.body.clientHeight - 266,
            addDialog: false,
            addForm: {
                name: ''
            },
            editForm: {
                id: '',
                name: ''
            },
            rules: {
                name: [{
                    required: true,
                    message: '请输入',
                    trigger: 'blur'
                }]

            },

            deleteDialog: false,
            deleteId: '',
            editDialog: false,
            formLabelWidth: '82px',
            loading: false,
            total_num: 0,
            multipleSelection: [],
            tableData: [],
            get_params: {
                page: 1,
                size: 20,
                name: ''
            }

        }
    },
    watch: {
        addDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.addForm.resetFields()
                }
            }
        },
        editDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.editForm.resetFields()
                }
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
        reset() {
            this.get_params = {
                page: 1,
                size: 20,
                name: ''
            }
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
                    name: this.get_params.name,
                    type: this.get_params.type,
                    factory: this.get_params.factory
                }
            }
            getLabelList(data).then(res => {
                console.log('列表', res)
                this.loading = false
                this.total_num = res.total
                let list = res.records
                if (list.length > 0) {
                    list.forEach(item => {
                        let obj = {}
                        obj.id = item.id
                        obj.name = item.name
                        obj.createTime = item.createTime
                        this.tableData.push(obj)
                    })
                }
            }).catch(error => {
                this.loading = false
                console.log('error' + error)
            })
        },

        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        searchCheck() {
            this.get_params.page = 1
            this.get_data()
        },

        handleEdit(row) {
            console.log(row)
            this.editForm.id = row.id
            this.editForm.name = row.name
            this.editDialog = true
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
        handleDelete(row) {
            this.deleteId = [`${row.id}`]
            this.deleteDialog = true
        },
        handleDeleteFun() {
            let data = {
                queryData: {},
                paramsData: {
                    ids: this.deleteId
                }
            }
            deleteLabel(data).then(res => {
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

        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = {
                        queryData: {},
                        paramsData: {
                            name: this.addForm.name,
                            type: this.addForm.type,
                            factory: this.addForm.factory,
                            engineVersion: this.addForm.engineVersion,
                            interfaceUser: this.addForm.interfaceUser,
                            interfacePwd: this.addForm.interfacePwd,
                            interfaceAddress: this.addForm.interfaceAddress,
                            description: this.addForm.description
                        }
                    }
                    saveLabel(data).then(res => {
                        this.addDialog = false
                        console.log('添加成功')
                        this.$message({
                            message: '添加成功',
                            type: 'success'
                        })
                        setTimeout(() => {
                            this.get_data()
                        }, 1500)
                    }).catch(error => {
                        // this.addDialog = false
                        console.log(error + 'error')
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        submitFormEdit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = {
                        queryData: {},
                        paramsData: {
                            id: this.editForm.id,
                            name: this.editForm.name,
                            type: this.editForm.type,
                            factory: this.editForm.factory,
                            engineVersion: this.editForm.engineVersion,
                            interfaceUser: this.editForm.interfaceUser,
                            interfacePwd: this.editForm.interfacePwd,
                            interfaceAddress: this.editForm.interfaceAddress,
                            description: this.editForm.description
                        }
                    }
                    updateLabel(data).then(res => {
                        this.editDialog = false
                        console.log('编辑成功')
                        this.$message({
                            message: '编辑成功',
                            type: 'success'
                        })
                        setTimeout(() => {
                            this.get_data()
                        }, 1500)
                    }).catch(error => {
                        // this.editDialog = false
                        console.log(error + 'error')
                    })
                } else {
                    console.log('error submit!!')
                    return false
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
            console.log(val)
            this.multipleSelection = val
        }
    }
}
</script>

<style lang="scss" scoped>
.table-area {
    background-color: #fff;
    padding: 10px 10px;
    box-shadow: 0px 0px 8px 0px rgba(140, 152, 164, 0.2);
    border-radius: 4px;
    border: solid 1px #dadee8;
    margin-top: 10px;
    .pagination {
        margin-top: 20px;
        text-align: right;
    }
}
</style>
