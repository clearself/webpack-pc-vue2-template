<template>
    <div class="list">
        <SearchTop @search="search" @reset="reset">
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="searchForm">
                    <el-form-item label="角色名称:" label-width="80px">
                        <el-input size="small" clearable v-model.trim="searchForm.roleName" placeholder="请输入"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="searchForm">
                    <el-form-item label="创建时间:" label-width="80px">
                        <el-date-picker
                            size="small"
                            style="width:100%"
                            v-model="searchForm.createTime"
                            type="daterange"
                            prefix-icon="iconfont icon-riqi"
                            range-separator="~"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd"
                            :clearable="false"
                        ></el-date-picker>
                    </el-form-item>
                </el-form>
            </el-col>
        </SearchTop>
        <div class="list-container">
            <div class="ub ub-pj w100 mb-1">
                <div class="list-tips">列表内容</div>
                <div>
                    <el-button v-per="['base_role_add']" size="small" icon="el-icon-plus" type="primary" @click="addRole">添加角色</el-button>
                    <el-button v-per="['base_role_del']" size="small" icon="el-icon-delete" type="danger" @click="deleteR">删除角色</el-button>
                </div>
            </div>
            <el-table
                ref="multipleTable"
                v-loading="listLoading"
                class="bigTable"
                :data="tableData"
                border
                stripe
                tooltip-effect="dark"
                :row-class-name="tableRowClassName"
                @selection-change="handleSelectionChange"
                :height="tableHeight"
                :row-style="{ height: '32px' }"
                :header-row-style="{ height: '32px' }"
            >
                <el-table-column type="selection" width="50"></el-table-column>
                <el-table-column align="center" type="index" width="50" label="序号"></el-table-column>
                <el-table-column prop="roleName" label="角色名称"></el-table-column>
                <el-table-column prop="relativeUser" label="相关用户(人)"></el-table-column>
                <el-table-column prop="createdTime" label="创建时间"></el-table-column>
                <el-table-column label="操作" align="center" width="160" fixed="right">
                    <template slot-scope="scope">
                        <el-button v-per="['base_role_view']" type="text" size="small" @click="handleSee(scope.row)">查看</el-button>
                        <el-button v-per="['base_role_edit']" type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button v-per="['base_role_del']"  type="text" size="small" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
        </div>
        <Drawer :diaType="handleType" @addRole="submitRole" ref="drawerRef" :propRoute="transitionRoute" :name="transitionName" :desc="transitionDetail"></Drawer>
        <Show-drawer ref="seeDrawerRef" :propRoute="seeRoute" :name="seeName" :desc="seeDetail" :time="seeCreateTime"></Show-drawer>
        <DeleteDialog :dialogVisible="deleteDialog" @delete="submitDelete" @cancel="deleteDialog = false"></DeleteDialog>
    </div>
</template>

<script>
import initData from '@/mixins/initData.js'
import Drawer from '@/pages/system/role_manage/drawer/drawer.vue'
import ShowDrawer from '@/pages/system/role_manage/viewDrawer/index.vue'
import DeleteDialog from '@/components/DeleteDialog/index.vue'
import { add_role, update_role, list, get_resources, delete_role } from '@/server/system/role_manage.js'

export default {
    name: 'RoleManage',
    mixins: [initData],
    components: {
        Drawer,
        DeleteDialog,
        ShowDrawer
    },
    data() {
        return {
            tableHeight: document.body.clientHeight - 270,
            handleType: 'add',
            searchForm: {
                roleName: '',
                createTime: []
            },
            deleteDialog: false,
            userDialog: false,
            viewDialog: false,
            seeForm: {},
            // transitionId: '', // 编辑id
            transitionRoute: [], // 编辑回显
            transitionName: '', // 编辑回显名称
            transitionDetail: '', // 编辑回显描述
            deleteId: '', // 删除id
            seeId: '', // 查看
            seeRoute: [],
            seeName: '',
            seeDetail: '',
            seeCreateTime: ''
        }
    },
    watch: {},
    mounted() {},
    created() {
        this.getList()
    },
    beforeDestroy() {
        // console.log('关闭了')
    },
    methods: {
        deleteR() {
            if (this.multipleSelection.length) {
                this.deleteDialog = true
            } else {
                this.$message({
                    message: '请选择要删除的数据',
                    type: 'warning'
                })
            }
        },
        search() {
            console.log(this.searchForm)
            this.getList()
        },
        addRole() {
            this.handleType = 'add'
            get_resources({}).then(res => {
                this.transitionId = ''
                this.transitionRoute = res
                this.transitionName = ''
                this.transitionDetail = ''
                this.$refs.drawerRef.init()
            })
        },
        dealParams(role) {
            const menus = []
            const buttons = []
            const _this = this
            function receyle(roleData) {
                roleData.forEach(item => {
                    let status
                    if (item.id3) {
                        status = 'status3'
                    } else if (item.id2) {
                        status = 'status2'
                    } else {
                        status = 'status1'
                    }
                    if (item[status] && item[status] != 0) {
                        // 处理菜单id
                        _this.btnDeal(item, buttons, menus)
                        if (item.children) {
                            receyle(item.children)
                        }
                    }
                })
            }
            receyle(role)
            return { menus, buttons }
        },
        btnDeal(item, buttons, menus) {
            menus.push(item.id)
            if (item.btns) {
                item.btns
                    .filter(btn => btn.status)
                    .forEach(btn => {
                        buttons.push(btn.id)
                    })
            }
        },
        submitRole(data) {
            console.log(data)
            const perms = this.dealParams(data.role)
            const params = {
                name: data.roleName,
                detail: data.roleDesc,
                perms
            }
            let request
            if (this.handleType == 'add') {
                request = add_role
            } else if (this.handleType == 'edit') {
                request = update_role
                params.id = this.transitionId
            }
            console.log(params)
            request({
                queryData: {},
                paramsData: params
            }).then(res => {
                this.$message({
                    message: '操作成功',
                    type: 'success'
                })
                console.log(res)
                this.$refs.drawerRef.cancel()
                this.transitionId = ''
                this.transitionRoute = []
                this.transitionName = ''
                this.transitionDetail = ''
                this.getList()
            })
        },
        reset() {
            this.searchForm.roleName = ''
            this.searchForm.createTime = []
            this.search()
        },
        handleSee(row) {
            this.seeId = row.id
            this.seeRoute = row.resources
            this.seeName = row.roleName
            this.seeDetail = row.detail
            this.seeCreateTime = row.createdTime
            this.$refs.seeDrawerRef.init()
        },
        handleEdit(row) {
            this.handleType = 'edit'
            this.transitionId = row.id
            this.transitionRoute = row.resources
            this.transitionName = row.roleName
            this.transitionDetail = row.detail
            this.$refs.drawerRef.init()
        },
        handleDelete(row) {
            this.deleteId = row.id
            this.deleteDialog = true
        },
        submitDelete() {
            console.log(this.deleteId)
            console.log(this.multipleSelection)
            let ids = []
            if (this.deleteId) {
                // 单独删除
                console.log(this.deleteId)
                ids.push(this.deleteId)
            } else if (this.multipleSelection.length) {
                // 多个删除
                console.log(this.multipleSelection)
                ids = this.multipleSelection.map(item => item.id)
            }
            console.log(ids)
            delete_role({
                queryData: {},
                paramsData: {
                    ids
                }
            }).then(res => {
                this.deleteId = ''
                this.deleteDialog = false
                this.getList()
            }).catch(err => {
                console.log(err)
                this.deleteId = ''
                this.deleteDialog = false
            })
        },
        getList(data) {
            this.listLoading = true
            list({
                queryData: {
                    page: this.listQuery.page,
                    pageSize: this.listQuery.limit
                },
                paramsData: {
                    name: this.searchForm.roleName,
                    beginTime: this.searchForm.createTime[0],
                    endTime: this.searchForm.createTime[1]
                }
            })
                .then(res => {
                    this.listLoading = false
                    this.tableData = []
                    this.total = res.total
                    res.records.forEach(item => {
                        this.tableData.push({
                            roleName: item.name,
                            relativeUser: item.userNum,
                            createdTime: item.createTime,
                            id: item.id,
                            detail: item.detail,
                            resources: item.resources
                        })
                    })
                })
                .catch(error => {
                    this.listLoading = false
                    console.log('error' + error)
                })
        }
    }
}
</script>

<style scoped lang="scss">
$blue: #387DEE;
.table-template-text {
    color: $blue;
}
.table-template-inactive {
    width: 102px;
    height: 18px;
    color: #aa0202;
    background-color: #fdd8d8;
    border-radius: 11px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
}
.table-template-active {
    width: 102px;
    height: 18px;
    color: #048450;
    background-color: #ccf6e4;
    border-radius: 11px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
