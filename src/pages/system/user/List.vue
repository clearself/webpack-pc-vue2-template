<template>
    <div class="list">
        <SearchTop @search="search" @reset="reset">
            <el-col :md="12" :lg="8" :xl="6">
                <el-form  :model="searchForm">
                    <el-form-item label="用户名:" label-width="80px">
                        <el-input size="small" clearable v-model.trim="searchForm.username" placeholder="请输入"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="searchForm">
                    <el-form-item label="姓名:" label-width="80px">
                        <el-input size="small" clearable v-model.trim="searchForm.chineseName" placeholder="请输入"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="searchForm">
                    <el-form-item label="所属部门:" label-width="80px" style="height: 32px;">
                        <div class="treeselect">
                            <Treeselect
                                :appendToBody="true"
                                size="small"
                                style="width: 100%;"
                                :options="treeData"
                                :normalizer="normalizer"
                                noChildrenText="当前分支无子节点"
                                noOptionsText="无可用选项"
                                placeholder="请选择"
                                v-model="searchForm.departmentId"
                            />
                        </div>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="searchForm">
                    <el-form-item label="用户角色:" label-width="80px">
                        <el-select v-model="searchForm.roleId" placeholder="请选择" size="small" style="width: 100%;" clearable>
                            <el-option
                                v-for="item in roleList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-col>
        </SearchTop>
        <DeleteDialog
            :dialogVisible = deleteDialog
            @delete="handleDelete"
            @cancel="deleteDialog = false">
        </DeleteDialog>
        <div class="list-container">
            <div class="ub ub-pj w100 mb-1">
                <div class="list-tips">列表内容</div>
                <div>
                    <el-button v-per="['base_user_add']" size="small" icon="el-icon-plus" type="primary" @click="handleAdd">添加用户</el-button>
                    <el-button v-per="['base_user_del']" size="small" icon="el-icon-delete" type="danger" @click="handleDeleteAll">删除用户</el-button>
                    <el-button icon="el-icon-download" @click="downLoad" size="small" type="primary" v-per="['base_user_template']">下载模板</el-button>
                    <el-upload
                        class="mr-1 ml-1"
                        action="/api/base-server/manage/adminUser/importUser"
                        :headers="header"
                        :with-credentials="true"
                        name="fileUpload"
                        accept=".xlsx,.xlsx"
                        :file-list="fileList"
                        :show-file-list="false"
                        :on-success="handleSuccess"
                        style="display: inline-block;">
                        <el-button size="small" type="primary" icon="iconfont icon-daoru" v-per="['base_user_import']">导入</el-button>
                    </el-upload>
                </div>
            </div>
            <el-table
                ref="multipleTable"
                v-loading="listLoading"
                class='bigTable'
                :data="tableData"
                border
                stripe
                tooltip-effect="dark"
                :row-class-name="tableRowClassName"
                @selection-change="handleSelectionChange"
                :height="tableHeight"
                :row-style="{ height: '32px' }"
                :header-row-style="{ height: '32px' }">
                <el-table-column type="selection" width="50"></el-table-column>
                <el-table-column align="center" type="index" width="50" label="序号">
                </el-table-column>
                <el-table-column prop="username" label="用户名">
                </el-table-column>
                <el-table-column prop="chineseName" label="姓名">
                </el-table-column>
                <el-table-column prop="departmentName" label="所属部门">
                </el-table-column>
                <el-table-column prop="phone" label="手机号码">
                </el-table-column>
                <el-table-column prop="mailbox" label="邮箱号码">
                </el-table-column>
                <el-table-column prop="roleName" label="用户角色">
                </el-table-column>
                <el-table-column prop="status" label="状态" align="center" width="120">
                    <template slot-scope="scope">
                        <div :class="{'table-template-active': scope.row.status===0,'table-template-inactive': scope.row.status===2}">{{ statusText(scope.row.status) }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间">
                </el-table-column>
                <el-table-column label="操作" align="center" width="260" fixed="right">
                    <template slot-scope="scope">
                        <el-button  v-per="['base_user_view']" type="text" size="small" @click="handleSee(scope.row)">查看</el-button>
                        <el-button v-per="['base_user_disable']" type="text" size="small" @click="handleDisable(scope.row)" v-if="scope.row.status===0">禁用</el-button>
                        <el-button v-per="['base_user_enable']" type="text" size="small" @click="handleEnable(scope.row)" v-if="scope.row.status===2">启用</el-button>
                        <el-button v-per="['base_user_edit']" type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button v-per="['base_user_del']" type="text" size="small" @click="deleteUser(scope.row)">删除</el-button>
                        <el-button v-per="['base_user_change_password']" type="text" size="small" @click="handleResetPassword(scope.row)">重置密码</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
        </div>

        <AddUserDialog
            ref="addEditUser"
            @close="userDialog = false"
            @submit="submitAddUser"
            :treeData="treeData"
            :roleList="roleList"
            :parentList="parentList"
            :type="handleType"
            :dialogVisible="userDialog"></AddUserDialog>
        <ViewDialog
            ref="viewDialog"
            @close="viewDialog = false"
            :seeForm="seeForm"
            :dialogVisible="viewDialog"></ViewDialog>
        <PasswordDialog ref="passwordDialog"  @close="passwordDialog = false" @submit="submitPassword" :dialogVisible="passwordDialog"></PasswordDialog>
    </div>

</template>

<script>
import { get_table_list, get_dep, get_role, get_all_user, delete_user, enable_user, disable_user, template } from '@/server/system/user.js'
import initData from '@/mixins/initData.js'
import AddUserDialog from '@/pages/system/user/AddUserDialog'
import ViewDialog from '@/pages/system/user/ViewDialog'
import PasswordDialog from '@/pages/system/user/PasswordDialog'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
    name: 'List',
    mixins: [initData],
    components: {
        AddUserDialog,
        ViewDialog,
        Treeselect,
        PasswordDialog
    },
    data() {
        return {
            fileList: [],
            tableHeight: document.body.clientHeight - 270,
            deleteId: '',
            treeData: [],
            normalizer(node) {
                return {
                    id: node.id,
                    label: node.name,
                    children: node.sub && node.sub.length > 0 ? node.sub : 0
                }
            },
            handleType: 'add',
            searchForm: {
                username: '',
                chineseName: '',
                departmentId: null,
                roleId: '',
                page: 1
            },
            roleList: [],
            parentList: [],
            deleteDialog: false,
            userDialog: false,
            viewDialog: false,
            passwordDialog: false,
            seeForm: {}

        }
    },
    computed: {
        header() {
            return { token: this.$getlocalStorage('initInfo').user.token }
        }
    },
    watch: {},
    mounted() {},
    created() {
        this.getList()
        this.getDepData()
        this.getRoleData()
        this.getParentData()
    },
    beforeDestroy() {
        console.log('关闭了')
    },
    methods: {
        downLoad() {
            template({ queryData: {}, paramsData: {}}).then(res => {
                console.log(res)
            })
        },
        handleSuccess(response) {
            console.log('response', response)
            if (response.code == 1) {
                this.$message({
                    message: '导入成功!',
                    type: 'success'
                })
                this.getList()
            } else {
                this.$message({
                    message: response.message,
                    type: 'warning'
                })
            }
        },
        handleAdd() {
            this.handleType = 'add'
            this.$refs.addEditUser.userForm.id = ''
            this.$refs.addEditUser.userForm.username = ''
            this.$refs.addEditUser.userForm.chineseName = ''
            this.$refs.addEditUser.userForm.password = ''
            this.$refs.addEditUser.userForm.departmentId = null
            this.$refs.addEditUser.userForm.parentId = ''
            this.$refs.addEditUser.userForm.phone = ''
            this.$refs.addEditUser.userForm.mailbox = ''
            this.$refs.addEditUser.userForm.roles = ''
            this.$refs.addEditUser.userForm.isLimit = 0
            this.$refs.addEditUser.userForm.ips = [{ value: '' }]
            this.userDialog = true
        },
        search() {
            this.listQuery.page = 1
            this.getList()
        },
        reset() {
            this.searchForm.username = ''
            this.searchForm.chineseName = ''
            this.searchForm.departmentId = null
            this.searchForm.roleId = ''
            setTimeout(() => {
                this.getList()
            }, 1500)
        },
        handleResetPassword(row) {
            this.passwordDialog = true
            this.$refs.passwordDialog.userForm.id = row.id
        },
        handleDisable(row) {
            let data = {
                queryData: {},
                paramsData: {
                    id: row.id
                }
            }
            disable_user(data).then(res => {
                this.$message({
                    message: '禁用成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.getList()
                }, 1500)
            }).catch(error => {
                console.log(error + 'error')
            })
        },
        handleEnable(row) {
            let data = {
                queryData: {},
                paramsData: {
                    id: row.id
                }
            }
            enable_user(data).then(res => {
                this.$message({
                    message: '启用成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.getList()
                }, 1500)
            }).catch(error => {
                console.log(error + 'error')
            })
        },
        handleSee(row) {
            this.viewDialog = true
            this.$refs.viewDialog.userForm.username = row.username
            this.$refs.viewDialog.userForm.chineseName = row.chineseName
            this.$refs.viewDialog.userForm.departmentName = row.departmentName
            this.$refs.viewDialog.userForm.parentName = row.parentName
            this.$refs.viewDialog.userForm.phone = row.phone
            this.$refs.viewDialog.userForm.mailbox = row.mailbox
            this.$refs.viewDialog.userForm.roleName = row.roleName
            this.$refs.viewDialog.userForm.status = row.status
            this.$refs.viewDialog.userForm.isLimit = row.isLimit
            this.$refs.viewDialog.userForm.createTime = row.createTime
            this.$refs.viewDialog.userForm.ips = []
            if (row.ips.length > 0) {
                this.$refs.viewDialog.userForm.ips = row.ips.map(item => {
                    return {
                        value: item
                    }
                })
            }
        },
        statusText(val) {
            switch (val) {
                case 0:
                    return '启用'
                case 2:
                    return '禁用'
                default:
                    return ''
            }
        },
        handleEdit(row) {
            this.handleType = 'edit'
            this.userDialog = true
            this.$refs.addEditUser.userForm.id = row.id
            this.$refs.addEditUser.userForm.username = row.username
            this.$refs.addEditUser.userForm.chineseName = row.chineseName
            // this.$refs.addEditUser.userForm.password = row.password
            this.$refs.addEditUser.userForm.departmentId = row.departmentId
            this.$refs.addEditUser.userForm.parentId = row.parentId
            this.$refs.addEditUser.userForm.phone = row.phone
            this.$refs.addEditUser.userForm.mailbox = row.mailbox
            this.$refs.addEditUser.userForm.roles = row.roles
            this.$refs.addEditUser.userForm.isLimit = row.isLimit
            this.$refs.addEditUser.userForm.adminAssets = row.userOrg.map(item => { return item.orgId })
            this.$refs.addEditUser.userForm.assetUser = row.assetUser
            this.$refs.addEditUser.userForm.assetsUserName = row.assetsUserName
            this.$refs.addEditUser.userForm.orgType = row.orgType
            if (row.ips.length > 0) {
                this.$refs.addEditUser.userForm.ips = row.ips.map(item => {
                    return {
                        value: item
                    }
                })
            }
        },
        deleteUser(row) {
            this.deleteDialog = true
            this.deleteId = [`${row.id}`]
        },
        handleDeleteAll() {
            if (this.multipleSelection.length == 0) {
                this.$message({
                    message: '请选择要删除的数据',
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
        handleDelete() {
            let data = {
                queryData: {},
                paramsData: {
                    ids: this.deleteId
                }
            }
            delete_user(data).then(res => {
                this.deleteDialog = false
                console.log('删除成功')
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.getList()
                }, 1500)
            }).catch(error => {
                this.deleteDialog = false
                console.log(error + 'error')
            })
        },
        submitAddUser(val) {
            this.userDialog = false
            this.getList()
            console.log(val, '子组件')
        },
        submitPassword(val) {
            this.passwordDialog = false
            this.getList()
        },
        getDepData() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_dep(data).then(res => {
                this.treeData = res
            }).catch(error => {
                console.log('error' + error)
            })
        },
        getRoleData() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_role(data).then(res => {
                this.roleList = res
            }).catch(error => {
                console.log('error' + error)
            })
        },
        getParentData() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_all_user(data).then(res => {
                this.parentList = res
            }).catch(error => {
                console.log('error' + error)
            })
        },
        getList() {
            this.listLoading = true
            let data = {
                queryData: {
                    page: this.listQuery.page,
                    pageSize: this.listQuery.limit
                },
                paramsData: {
                    username: this.searchForm.username,
                    chineseName: this.searchForm.chineseName,
                    departmentId: this.searchForm.departmentId,
                    roleId: this.searchForm.roleId
                }
            }
            get_table_list(data).then(res => {
                this.listLoading = false
                this.total = res.total
                this.tableData = res.records
            }).catch(error => {
                console.log(error, '我是error')
                if (!error.isCancel) {
                    this.listLoading = false
                }
            })
        }
    }
}
</script>

<style scoped lang="scss">
$blue: #387dee;
.table-template-text {
    color: $blue;
}
.custom-star #app .table-template-inactive {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 102px;
    height: 24px;
    text-align: center;
    color: #ff9696;
    background-color: rgba(255, 186, 0, .2);
    border-radius: 4px;
    border: solid 1px #ff3a3a;
}
.custom-star #app .table-template-active {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 102px;
    height: 24px;
    text-align: center;
    color: #96ff96;
    background-color: rgba(0, 255, 0, .2);
    border-radius: 4px;
    border: solid 1px #00ff00;
}
.table-template-inactive {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 102px;
    height: 18px;
    border-radius: 11px;
    text-align: center;
    color: #aa0202;
    background-color: #fdd8d8;
}
.table-template-active {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 102px;
    height: 18px;
    border-radius: 11px;
    text-align: center;
    color: #048450;
    background-color: #ccf6e4;
}
.treeselect {
    padding: 0;
    ::v-deep .vue-treeselect__control {
        height: 30px;
        line-height: 30px;
    }
    ::v-deep .vue-treeselect__input {
        vertical-align: middle;
    }
}
</style>
