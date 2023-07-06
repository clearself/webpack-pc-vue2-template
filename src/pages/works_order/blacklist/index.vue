<template>
    <div class="list">
        <SearchTop @search="searchDomain" @reset="reset">
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params">
                    <el-form-item label="IP：" label-width="50px">
                        <el-input placeholder="请输入IP" clearable v-model="get_params.ip" @keyup.enter.native="searchDomain" size="small"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
        </SearchTop>
        <div class="list-container">
            <div class="ub ub-pj w100 mb-1 ub-ac">
                <div class="list-tips">列表内容</div>
                <div>
                    <el-button @click="toAdd" size="small" icon="el-icon-plus" type="primary">添加</el-button>
                    <el-button @click="handleDeleteAll" type="danger" size="small">刪 除</el-button>
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
                @selection-change="handleSelectionChange"
                :height="tabHeight"
                :row-style="{ height: '32px' }"
                :header-row-style="{ height: '32px' }">
                <!--                <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号"></el-table-column>-->
                <el-table-column align="center" type="selection" width="30"></el-table-column>
                <el-table-column prop="ip" label="IP">
                </el-table-column>
                <el-table-column prop="name" label="姓名">
                </el-table-column>
                <el-table-column prop="remark" label="备注">
                </el-table-column>
                <el-table-column align="center" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size" @pagination="get_data" style="padding-top: 10px;" v-show="total_num>0"/>
        </div>
        <el-dialog custom-class="common-dialog" title="添加类型" :visible.sync="addDialog" width="500px" class="diaBox" top="20vh" @close="resetForm">
            <el-form :model="addForm" :rules="rules" label-position="right" ref="addForm">
                <el-form-item label="IP：" prop="ip" label-width="70px">
                    <el-input placeholder="请输入类型名称" clearable v-model="addForm.ip" size="small" maxlength="20"></el-input>
                </el-form-item>
                <el-form-item label="姓名：" prop="userId" label-width="70px">
                    <el-select
                        style="display: block; width: 100%;"
                        @change="changeName"
                        v-model="addForm.userId"
                        :remote-method="remoteMethod"
                        :loading="selLoading"
                        remote
                        reserve-keyword
                        size="small"
                        filterable
                        placeholder="请搜索选择姓名"
                        clearable>
                        <el-option
                            v-for="(item, index) in nameList"
                            :key="index"
                            :label="item.name"
                            :value="item.id"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注：" prop="remark" label-width="70px">
                    <el-input type="textarea" :rows="3" placeholder="请输入描述" maxlength="300" clearable v-model="addForm.remark" size="small"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm('addForm')" size="small">确 定</el-button>
                <el-button @click="addDialog = false" size="small">取 消</el-button>
            </span>
        </el-dialog>
        <DeleteDialog
            :dialogVisible = deleteDialog
            @delete="handleDeleteFun"
            @cancel="deleteDialog = false">
        </DeleteDialog>
    </div>
</template>

<script>
import { ipRosterPageReq, ipRosterAddReq, ipRosterDelReq, getAssetsUserReq } from '@/server/works_order/black_white_list'
var validateDesIp = (rule, value, callback) => {
    if (value.trim() === '') {
        callback(new Error('请输入正确的ip'))
    } else if (!(/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(value))) {
        callback(new Error('请输入正确的ip'))
    } else {
        callback()
    }
}
export default {
    data() {
        return {
            tabHeight: document.body.clientHeight - 260,
            loading: false,
            selLoading: false,
            total_num: 0,
            tableData: [],
            multipleSelection: [],
            get_params: {
                page: 1,
                size: 20,
                ip: ''
            },
            deleteDialog: false,
            delIds: '',
            userAllDeleteDialog: false,

            addDialog: false,
            addForm: {
                ip: '',
                userId: '',
                remark: ''
            },
            nameList: [],
            rules: {
                ip: [{
                    required: true,
                    validator: validateDesIp,
                    trigger: 'blur'
                }],
                userId: [
                    {
                        required: true,
                        message: '请选择名称',
                        trigger: 'change'
                    }
                ]
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
                size: 20,
                ip: ''
            }
            this.get_data()
        },
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        searchDomain() {
            this.get_params.page = 1
            this.get_data()
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        get_data() {
            this.loading = true
            this.tableData = []
            this.showPage = true
            let data = {
                queryData: {
                    page: this.get_params.page,
                    pageSize: this.get_params.size
                },
                paramsData: {
                    ip: this.get_params.ip,
                    type: 1
                }
            }
            ipRosterPageReq(data).then(res => {
                this.loading = false
                this.total_num = res.total
                this.tableData = res.records || []
            }).catch(error => {
                this.loading = false
                console.log('error' + error)
            })
        },

        toAdd() {
            this.addDialog = true
        },
        changeName() {

        },
        async remoteMethod(query) {
            if (query !== '') {
                this.selLoading = true
                let filter = {
                    queryData: {
                        name: query
                    },
                    paramsData: {}
                }
                try {
                    let res = await getAssetsUserReq(filter)
                    console.log(res)
                    this.nameList = res.filter((item) => {
                        return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1
                    })
                    this.selLoading = false
                } catch (e) {
                    this.selLoading = false
                }
            } else {
                this.nameList = []
            }
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    let data = {
                        ...this.addForm,
                        type: 1
                    }
                    ipRosterAddReq({ paramsData: data, queryData: {}}).then(res => {
                        this.addDialog = false
                        this.$message({
                            message: '添加成功',
                            type: 'success'
                        })
                        this.get_data()
                    }).catch(error => {
                        console.log(error + 'error')
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        resetForm() {
            this.addForm = {
                ip: '',
                userId: '',
                remark: ''
            }
            this.nameList = []
            this.$refs.addForm.resetFields()
        },

        handleDeleteAll() {
            if (this.multipleSelection.length == 0) {
                this.$message({
                    message: '请先选择类型',
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
                ids: this.deleteId
            }
            ipRosterDelReq({ paramsData: data, queryData: {}})
                .then(res => {
                    this.deleteDialog = false
                    console.log('删除成功')
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    })
                    setTimeout(() => {
                        this.get_data()
                    }, 1500)
                })
                .catch(error => {
                    this.deleteDialog = false
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
        }
    }
}
</script>

<style lang="scss" scoped>
// .event ::v-deep .addUserForm.el-form--inline {
//     .el-form-item:nth-child(2n) {
//         margin-left: 70px;
//     }
// }
.row {
    display: flex;
    justify-content: space-between;
}
.event ::v-deep .el-input--small .el-input__inner {
    height: 30px;
    line-height: 30px;
}
.diaBox ::v-deep .el-form-item__content {
    line-height: 40px !important;
}
</style>
