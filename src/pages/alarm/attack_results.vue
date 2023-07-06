<template>
    <div class="list">
        <SearchTop @search="searchAssets" @reset="reset" style="border-top-left-radius:0;border-top-right-radius:0;box-shadow:none">
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params">
                    <el-form-item label="攻击结果：" label-width="80px">
                        <el-input placeholder="请输入" clearable v-model.trim="get_params.name" size="small"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
        </SearchTop>
        <div class="list-container">
            <div class="ub ub-pj w100 mb-1 ub-ac">
                <div class="list-tips">攻击结果</div>
                <div class="ub">
                    <el-button icon="el-icon-plus" size="small" type="primary" @click="addDialog = true" v-per="['alarm_attack_add']">添加结果</el-button>
                </div>
            </div>
            <el-table
                ref="multipleTable"
                v-loading="loading"
                class='bigTable'
                :data="tableData"
                border
                stripe
                tooltip-effect="light"
                :row-class-name="tableRowClassName"
                :height="tabHeight"
                :row-style="{ height: '32px' }"
                :header-row-style="{ height: '32px' }"
                @selection-change="handleSelectionChange">
                <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                </el-table-column>
                <el-table-column prop="name" label="攻击结果">
                </el-table-column>
                <el-table-column align="center" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" @click="handleEdit(scope.row)" v-per="['alarm_attack_edit']">编辑</el-button>
                        <el-button size="small" type="text" @click="delUserBtn(scope.row)" v-per="['alarm_attack_del']">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!--增加内容开始-->
        <el-dialog title="添加攻击结果" :visible.sync="addDialog" width="700px" custom-class="common-dialog">
            <el-form :model="alarmTypeForm" :rules="rules" ref="alarmTypeForm" label-position="top">
                <el-form-item label="攻击结果名称：" prop="name" :label-width="formLabelWidth">
                    <el-input size="small" v-model.trim="alarmTypeForm.name" placeholder="请输入" autocomplete="off" clearable></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialog=false" size="small">取消</el-button>
                <el-button type="primary" @click="submitForm('alarmTypeForm')" size="small">确认</el-button>
            </span>
        </el-dialog>
        <!--编辑内容开始-->
        <el-dialog title="编辑攻击结果" :visible.sync="editDialog" width="700px" custom-class="common-dialog">
            <el-form :model="alarmTypeFormEdit" :rules="rules" ref="alarmTypeFormEdit" label-position="top">
                <el-form-item label="攻击结果名称：" prop="name" :label-width="formLabelWidth">
                    <el-input size="small" v-model.trim="alarmTypeFormEdit.name" placeholder="请输入" autocomplete="off" clearable></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialog=false" size="small">取消</el-button>
                <el-button type="primary" @click="submitFormEdit('alarmTypeFormEdit')" size="small">确认</el-button>
            </span>
        </el-dialog>
        <!--删除-->
        <DeleteDialog
            :dialogVisible = userDeleteDialog
            @delete="handleDelete"
            @cancel="userDeleteDialog = false">
        </DeleteDialog>
    </div>
</template>

<script>
import {
    get_attack_results,
    save_attack_results,
    update_attack_results,
    delete_attack_results
} from '../../server/alarm/api.js'
export default {
    name: 'AttackResults',
    data() {
        return {
            tabHeight: document.body.clientHeight - 256,
            userDeleteAllDialog: false,
            formLabelWidth: '140px',
            loading: false,
            total_num: 0,
            tableData: [],
            multipleSelection: [],
            get_params: {
                page: 1,
                size: 10,
                name: ''
            },
            res: '',
            userDeleteDialog: false,
            delIds: '',
            addDialog: false,
            editDialog: false,
            alarmTypeForm: {
                name: ''
            },
            alarmTypeFormEdit: {
                id: '',
                name: ''
            },
            rules: {
                name: [{
                    required: true,
                    message: '请输入攻击结果名称',
                    trigger: 'blur'
                }]
            }
        }
    },
    watch: {
        addDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.alarmTypeForm.resetFields()
                }
            }
        },
        editDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.alarmTypeFormEdit.resetFields()
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
                size: 10,
                name: ''
            }
            this.get_data()
        },
        deleteAll() {
            if (this.multipleSelection.length == 0) {
                this.$message({
                    message: '请先选择事件类型',
                    type: 'warning'
                })
                return
            }
            this.userDeleteAllDialog = true
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
                queryData: {},
                paramsData: {
                    name: this.get_params.name
                }
            }
            get_attack_results(data).then(res => {
                console.log(res)
                this.loading = false
                // this.total_num = res.sum;
                let list = res
                if (list.length > 0) {
                    list.forEach(item => {
                        let obj = {}
                        obj.id = item.id
                        obj.name = item.name
                        obj.isSys = item.isSys
                        this.tableData.push(obj)
                    })
                }
            }).catch(error => {
                this.loading = false
                console.log('error' + error)
            })
        },
        addUser() {
            this.addDialog = true
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.addAssets()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        addAssets() {
            let data = {
                queryData: {},
                paramsData: {
                    name: this.alarmTypeForm.name
                }
            }
            save_attack_results(data).then(res => {
                console.log(res)
                this.addDialog = false
                this.$message({
                    message: '添加成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(error => {
                // this.addDialog = false
                console.log('error' + error)
            })
        },
        editDevice() {
            let data = {
                queryData: {},
                paramsData: {
                    id: this.alarmTypeFormEdit.id,
                    name: this.alarmTypeFormEdit.name
                }
            }
            update_attack_results(data).then(res => {
                console.log(res)
                this.editDialog = false
                this.$message({
                    message: '修改成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(error => {
                // this.editDialog = false
                console.log('error' + error)
            })
        },
        submitFormEdit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.editDevice(false)
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        delUserBtn(row) {
            this.delIds = row.id
            this.userDeleteDialog = true
        },
        handleDelete() {
            let data = {
                queryData: {},
                paramsData: {
                    id: this.delIds
                }
            }
            delete_attack_results(data).then(res => {
                this.userDeleteDialog = false
                console.log('删除成功')
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(error => {
                this.userDeleteDialog = false
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
        handleEdit(row) {
            console.log('row', row)
            this.alarmTypeFormEdit = {
                id: row.id,
                name: row.name
            }
            this.editDialog = true
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        }
    }
}
</script>

<style lang="scss" scoped>
.pagination {
    padding: 30px 0 20px;
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
</style>
