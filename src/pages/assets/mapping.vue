<template>
    <div class="list">
        <SearchTop @search="searchDomain" @reset="reset">
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params">
                    <el-form-item label="IP搜索：" label-width="80px">
                        <el-input placeholder="请输入IP" clearable v-model="get_params.ip" @keyup.enter.native="searchDomain" size="small"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
        </SearchTop>
        <div class="list-container">
            <div class="ub ub-pj w100 mb-1 ub-ac">
                <div class="list-tips">映射管理</div>
                <div>
                    <el-button size="small" icon="el-icon-plus" type="primary" @click="addDomainDialog = true" v-per="['assets_ipLink_add']">添加新映射</el-button>
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
                <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                </el-table-column>
                <el-table-column prop="intranetIp" label="内网IP">
                </el-table-column>
                <el-table-column prop="intranetPort" label="内网端口">
                </el-table-column>
                <el-table-column prop="extranetIp" label="外网IP">
                </el-table-column>
                <el-table-column prop="extranetPort" label="外网端口">
                </el-table-column>
                <el-table-column prop="fictitiousIp" label="虚IP">
                    <template slot-scope="scope">
                        <div>
                            <span v-if="scope.row.fictitiousIp">{{scope.row.fictitiousIp}}</span>
                            <span v-else>--</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="fictitiousPort" label="虚端口">
                    <template slot-scope="scope">
                        <div>
                            <span v-if="scope.row.fictitiousPort">{{scope.row.fictitiousPort}}</span>
                            <span v-else>--</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" @click="handleEdit(scope.row)" v-per="['assets_ipLink_edit']">编辑</el-button>
                        <el-button size="small" type="text" @click="delUserBtn(scope.row)" v-per="['assets_ipLink_del']">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size" @pagination="get_data" style="padding-top:10px" v-show="total_num>0"/>
        </div>
        <el-dialog title="增加映射" :visible.sync="addDomainDialog" width="700px" custom-class="common-dialog">
            <el-form :model="domainForm" :rules="rules" ref="domainForm" label-width="80px" class="demo-ruleForm" label-position="top">
                <div class="row">
                    <el-form-item label="内网ip：" prop="intranetIp">
                        <el-input size="small" clearable v-model="domainForm.intranetIp"  placeholder="请输入" autocomplete="off" style="width:317px;"></el-input>
                    </el-form-item>
                    <el-form-item label="内网端口：" prop="intranetPort">
                        <el-input size="small" clearable v-model="domainForm.intranetPort" placeholder="请输入" autocomplete="off" style="width:317px;"></el-input>
                    </el-form-item>
                </div>
                <div class="row">
                    <el-form-item label="外网ip：" prop="extranetIp">
                        <el-input size="small" clearable v-model="domainForm.extranetIp" placeholder="请输入" autocomplete="off" style="width:317px;"></el-input>
                    </el-form-item>
                    <el-form-item label="外网端口：" prop="extranetPort">
                        <el-input size="small" clearable v-model="domainForm.extranetPort" placeholder="请输入" autocomplete="off" style="width:317px;"></el-input>
                    </el-form-item>
                </div>
                <div class="row">
                    <el-form-item label="虚IP：" prop="fictitiousIp">
                        <el-input size="small" clearable v-model="domainForm.fictitiousIp" placeholder="请输入" autocomplete="off" style="width:317px;"></el-input>
                    </el-form-item>
                    <el-form-item label="虚IP端口：" prop="fictitiousPort">
                        <el-input size="small" clearable v-model="domainForm.fictitiousPort" placeholder="请输入" autocomplete="off" style="width:317px;"></el-input>
                    </el-form-item>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDomainDialog=false" size="small">取消</el-button>
                <el-button type="primary" @click="submitForm('domainForm')" size="small">确认</el-button>
            </span>
        </el-dialog>
        <!--编辑内容-->
        <el-dialog title="编辑映射" :visible.sync="editUserDialog" width="700px" custom-class="common-dialog">
            <el-form :model="domainFormEdit" :rules="rules" ref="domainFormEdit" label-width="80px" class="demo-ruleForm" label-position="top">
                <div class="row">
                    <el-form-item label="内网ip：" prop="intranetIp">
                        <el-input size="small" clearable v-model="domainFormEdit.intranetIp" placeholder="请输入" autocomplete="off" style="width:317px;"></el-input>
                    </el-form-item>
                    <el-form-item label="内网端口：" prop="intranetPort">
                        <el-input size="small" clearable v-model="domainFormEdit.intranetPort" placeholder="请输入" autocomplete="off" style="width:317px;"></el-input>
                    </el-form-item>
                </div>
                <div class="row">
                    <el-form-item label="外网ip：" prop="extranetIp">
                        <el-input size="small" clearable v-model="domainFormEdit.extranetIp" placeholder="请输入" autocomplete="off" style="width:317px;"></el-input>
                    </el-form-item>
                    <el-form-item label="外网端口：" prop="extranetPort">
                        <el-input size="small" clearable v-model="domainFormEdit.extranetPort" placeholder="请输入" autocomplete="off" style="width:317px;"></el-input>
                    </el-form-item>
                </div>
                <div class="row">
                    <el-form-item label="虚IP：" prop="fictitiousIp">
                        <el-input size="small" clearable v-model="domainFormEdit.fictitiousIp" placeholder="请输入" autocomplete="off" style="width:317px;"></el-input>
                    </el-form-item>
                    <el-form-item label="虚IP端口：" prop="fictitiousPort">
                        <el-input size="small" clearable v-model="domainFormEdit.fictitiousPort" placeholder="请输入" autocomplete="off" style="width:317px;"></el-input>
                    </el-form-item>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editUserDialog=false" size="small">取消</el-button>
                <el-button type="primary" @click="submitFormEdit('domainFormEdit')" size="small">确认</el-button>
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
    addIpLink,
    updateIpLink,
    findIpLinkList,
    findOneIpLink,
    deleteIpLink,
    editIpLink
} from '../../server/assets/api.js'
export default {
    name: 'User',
    data() {
        return {
            tabHeight: document.body.clientHeight - 260,
            loading: false,
            total_num: 0,
            tableData: [],
            multipleSelection: [],
            get_params: {
                page: 1,
                size: 20,
                ip: ''
            },
            userDeleteDialog: false,
            delIds: '',
            userAllDeleteDialog: false,
            addDomainDialog: false,
            editUserDialog: false,
            showPage: true,
            domainForm: {
                intranetIp: '',
                intranetPort: '',
                fictitiousIp: '',
                fictitiousPort: '',
                extranetIp: '',
                extranetPort: ''
            },
            domainFormEdit: {
                id: '',
                intranetIp: '',
                intranetPort: '',
                fictitiousIp: '',
                fictitiousPort: '',
                extranetIp: '',
                extranetPort: ''
            },
            rules: {
                intranetIp: [
                    {
                        required: true,
                        message: '内网IP不能为空',
                        trigger: 'blur'
                    },
                    {
                        pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
                        message: '请填写正确的内网IP',
                        trigger: 'blur'
                    }
                ],
                extranetIp: [
                    {
                        required: true,
                        message: '外网IP不能为空',
                        trigger: 'blur'
                    },
                    {
                        pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
                        message: '请填写正确的外网IP',
                        trigger: 'blur'
                    }
                ],
                intranetPort: [
                    {
                        required: true,
                        message: '内网端口不能为空',
                        trigger: 'blur'
                    }
                ],
                extranetPort: [
                    {
                        required: true,
                        message: '外网端口不能为空',
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    watch: {
        addDomainDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.domainForm.resetFields()
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
            console.log(val)
            this.multipleSelection = []
            if (val.length > 0) {
                val.forEach(item => {
                    this.multipleSelection.push(item.id)
                })
            }
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
                    ip: this.get_params.ip
                }
            }
            findIpLinkList(data).then(res => {
                this.loading = false
                this.total_num = res.total
                let list = res.records
                if (list.length > 0) {
                    list.forEach(item => {
                        let obj = {}
                        obj.id = item.id
                        obj.intranetIp = item.intranetIp
                        obj.intranetPort = item.intranetPort
                        obj.fictitiousIp = item.fictitiousIp
                        obj.fictitiousPort = item.fictitiousPort
                        obj.extranetIp = item.extranetIp
                        obj.extranetPort = item.extranetPort
                        this.tableData.push(obj)
                    })
                }
            }).catch(error => {
                this.loading = false
                console.log('error' + error)
            })
        },
        addUser() {
            this.addDomainDialog = true
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = {
                        queryData: {},
                        paramsData: {
                            intranetIp: this.domainForm.intranetIp,
                            intranetPort: this.domainForm.intranetPort,
                            fictitiousIp: this.domainForm.fictitiousIp,
                            fictitiousPort: this.domainForm.fictitiousPort,
                            extranetIp: this.domainForm.extranetIp,
                            extranetPort: this.domainForm.extranetPort
                        }
                    }
                    addIpLink(data).then(res => {
                        console.log(res)
                        this.addDomainDialog = false
                        this.$message({
                            message: '添加映射成功',
                            type: 'success'
                        })
                        setTimeout(() => {
                            this.get_data()
                        }, 1500)
                    }).catch(error => {
                        // this.addDomainDialog = false
                        console.log('error' + error)
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
                            id: this.domainFormEdit.id,
                            intranetIp: this.domainFormEdit.intranetIp,
                            intranetPort: this.domainFormEdit.intranetPort,
                            fictitiousIp: this.domainFormEdit.fictitiousIp,
                            fictitiousPort: this.domainFormEdit.fictitiousPort,
                            extranetIp: this.domainFormEdit.extranetIp,
                            extranetPort: this.domainFormEdit.extranetPort
                        }
                    }
                    updateIpLink(data).then(res => {
                        console.log(res)
                        this.editUserDialog = false
                        this.$message({
                            message: '修改映射成功',
                            type: 'success'
                        })
                        setTimeout(() => {
                            this.get_data()
                        }, 1500)
                    }).catch(error => {
                        // this.editUserDialog = false
                        console.log('error' + error)
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        delAllUser() {
            if (this.multipleSelection.length === 0) {
                this.$message({
                    message: '请选择要删除的域名',
                    type: 'warning'
                })
            } else {
                this.userAllDeleteDialog = true
            }
        },
        delUserBtn(row) {
            this.delIds = row.id
            this.userDeleteDialog = true
        },
        handleDelete() {
            this.userDeleteDialog = false
            let data = {
                queryData: {},
                paramsData: {
                    id: this.delIds
                }
            }
            deleteIpLink(data).then(res => {
                console.log('删除成功')
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(error => {
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
            this.domainFormEdit = {
                id: row.id,
                intranetIp: row.intranetIp,
                intranetPort: row.intranetPort,
                fictitiousIp: row.fictitiousIp,
                fictitiousPort: row.fictitiousPort,
                extranetIp: row.extranetIp,
                extranetPort: row.extranetPort
            }
            this.editUserDialog = true
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
</style>
