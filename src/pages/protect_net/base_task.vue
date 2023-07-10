<template>
    <div class="list" @click="preventFun">
        <div class="ub w100"  style="height: calc(100vh - 80px); overflow: hidden">
            <div style="background:#fff;border: solid 1px #dadee8;border-radius: 4px;overflow-y:auto;width:200px" class="mr-1 mb-1">
                <div class="tree pt-1" style="position: relative;">
                    <div class="ub ub-pj ub-ac w100 mt-1 pl-1 mb-1">
                        <div class="list-tips" style="margin-bottom: 0;font-size:12px;">分组列表</div>
                        <div class="tree-option" style="font-size:12px;color:#1cd7fa;padding-right:10px;">
                            <el-tooltip class="item" effect="dark" v-per="['protective_group_add']" content="新增" placement="top-start">
                                <i class="iconfont icon-tianjiashu" style="font-size: 12px;color:#387dee" @click="addRuleShow"></i>
                            </el-tooltip>
                            <el-tooltip v-if="currentNode.id!=''" class="item" effect="dark" v-per="['protective_group_edit']" content="编辑" placement="top-start">
                                <i class="iconfont icon-xiugaishu" style="font-size: 12px;color:#387dee" @click="editRuleShow"></i>
                            </el-tooltip>
                            <el-tooltip v-if="currentNode.id!=''" class="item" effect="dark" v-per="['protective_group_del']" content="删除" placement="top-start">
                                <i class="iconfont icon-shanchushu" style="font-size: 12px;color:#387dee" @click="delRuleShow"></i>
                            </el-tooltip>
                        </div>
                    </div>
                    <div style="padding: 0 5px 10px 5px">
                        <el-input
                            placeholder="请输入关键词搜索"
                            clearable
                            v-model="filterText"
                            class="tree-input"
                            suffix-icon="el-icon-search"
                            size="mini">
                        </el-input>
                    </div>
                    <el-tree
                        show-checkbox
                        ref="tree"
                        node-key="id"
                        :filter-node-method="filterNode"
                        :default-expand-all="true"
                        :highlight-current="true"
                        :data="treeData"
                        :props='propsData'
                        @node-click="handleNodeClick"
                        :check-strictly="true"
                        :expand-on-click-node="false"
                        :indent='indent'
                        @check-change="handleClick">
                        <span class="custom-tree-node" slot-scope="{ node }">
                            <span style="font-size:14px;">{{ node.label }}</span>
                        </span>
                    </el-tree>
                </div>
            </div>
            <div class="ub ub-f1 ub-ver" style="height: 100%;overflow: auto">
                <div class="ub w100" style="box-sizing: border-box;">
                    <SearchTop @search="searchCheck" @reset="reset">
                        <el-col :md="12" :lg="8" :xl="6">
                            <el-form :model="get_params">
                                <el-form :model="get_params">
                                    <el-form-item label="任务名称：" label-width="85px">
                                        <el-input placeholder="请输入" style="width: 100%;" clearable v-model="get_params.taskName" @keyup.enter.native="searchCheck" size="small"></el-input>
                                    </el-form-item>
                                </el-form>
                            </el-form>
                        </el-col>
                        <el-col :md="12" :lg="8" :xl="6">
                            <el-form :model="get_params">
                                <el-form-item label="输出物：" label-width="85px">
                                    <el-input placeholder="请输入" style="width: 100%;" clearable v-model="get_params.exports" @keyup.enter.native="searchCheck" size="small"></el-input>
                                </el-form-item>
                            </el-form>
                        </el-col>
                        <el-col :md="12" :lg="8" :xl="6">
                            <el-form :model="get_params">
                                <el-form-item label="任务状态：" label-width="85px">
                                    <el-select size="small" style="width: 100%;" clearable v-model="get_params.status" filterable placeholder="请选择任务状态">
                                        <el-option v-for="item in states" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-form>
                        </el-col>
                    </SearchTop>
                </div>
                <div class="list-container">
                    <div class="ub ub-pj w100 mb-1">
                        <div class="list-tips">任务列表</div>
                        <div class="ub">
                            <el-button style="margin-right: 10px;" icon="el-icon-plus" v-per="['protective_task_add']" size="small" type="primary" @click="toAddTask">新增任务</el-button>
                            <el-upload :headers="header" style="margin-right: 10px;" :show-file-list="false" action="/api/protective-net/manage/baseTask/importExcel" accept=".xls,.xlsx" :before-upload="beforeUpLoad" :on-success="upLoadExcle" :on-error="upLoadError" name="fileUpload">
                                <el-button icon="iconfont icon-daoru" size="small" v-per="['protective_task_imp']" type="primary">批量导入</el-button>
                            </el-upload>
                            <el-button icon="iconfont icon-daochu" size="small" v-per="['protective_task_exp']" @click="exportUrl" type="primary">导 出</el-button>
                            <el-button icon="el-icon-download" size="small" type="primary" v-per="['protective_task_download']" @click="exportTem">下载模板</el-button>
                            <el-button icon="el-icon-delete" size="small" type="danger" v-per="['protective_task_del']" @click="handleDeleteAll">刪 除</el-button>
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
                        :row-style="{ height: '32px' }"
                        :header-row-style="{ height: '32px' }"
                        :row-class-name="tableRowClassName"
                        :height="tableHeight"
                        @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="50"></el-table-column>
                        <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="taskName" label="任务名称" width="150">
                        </el-table-column>
                        <!-- <el-table-column show-overflow-tooltip prop="des" label="任务描述">
                            </el-table-column> -->
                        <el-table-column show-overflow-tooltip prop="output" label="输出物">
                        </el-table-column>
                        <el-table-column label="执行人" width="200">
                            <template slot-scope="scope">
                                <div class="mb0 roles" v-if="scope.row.users.length > 0">
                                    <el-tag style="margin-right: 5px;" size="mini" type="success" v-for="(names,index) in scope.row.users" :key="index">{{ names.userName }}</el-tag>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="耗时/h">
                            <template slot-scope="scope">
                                <div class="mb0 roles">
                                    <span>{{scope.row.hours}}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="startTime" label="发起时间" width="170">
                        </el-table-column>
                        <el-table-column prop="endTime" label="完后时间" width="170">
                        </el-table-column>
                        <el-table-column align="center" fixed="right" label="任务状态" width="80" class-name="deepBg">
                            <template slot-scope="scope">
                                <div>
                                    <div v-if="scope.row.status==0" class="ub ub-ac last-state one">
                                        <div></div>
                                        <div>{{scope.row.statusCN}}</div>
                                    </div>
                                    <div v-if="scope.row.status==1" class="ub ub-ac last-state two">
                                        <div></div>
                                        <div>{{scope.row.statusCN}}</div>
                                    </div>
                                    <div v-if="scope.row.status==2" class="ub ub-ac last-state three">
                                        <div></div>
                                        <div>{{scope.row.statusCN}}</div>
                                    </div>
                                </div>
                            </template>
                            <template slot-scope="scope">
                                <div>
                                    <el-popover
                                        placement="top"
                                        width="180"
                                        popper-class="desIp-popover-box"
                                        trigger="click">
                                        <div class="desIp-popover">
                                            <div class="click-btn">
                                                <!-- <div class="click-btn"  @click="addSearch('reportStatus',scope.row.status)"> -->
                                                <i class="el-icon-plus"></i>
                                                <span>事件状态 = {{scope.row.statusCN}}</span>
                                            </div>
                                            <div >
                                                <i
                                                    class="el-icon-document-copy"
                                                    v-clipboard:copy="scope.row.statusCN"
                                                    v-clipboard:success="firstCopySuccess"
                                                    v-clipboard:error="firstCopyError"
                                                ></i>
                                                <span>复制</span>
                                            </div>
                                        </div>
                                        <div slot="reference">
                                            <div :class="getStatus(scope.row.status)" class="ub ub-ac ub-pc alarm-state">
                                                <div>{{ scope.row.statusCN }}</div>
                                            </div>
                                        </div>
                                    </el-popover>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" fixed="right" label="操作" width="200" class-name="deepBg">
                            <template slot-scope="scope">
                                <el-button size="small" :disabled="scope.row.status == 1" type="text" v-per="['protective_task_assign']" @click="handleAssign(scope.row)">指派</el-button>
                                <el-button size="small" type="text" v-per="['protective_task_view']" @click="handleSee(scope.row)">查看</el-button>
                                <el-button :disabled="scope.row.status == 1" v-per="['protective_task_del']" size="small" type="text" @click="handleDelete(scope.row)">删除</el-button>
                                <el-button :disabled="scope.row.status == 1" v-per="['protective_task_edit']" size="small" type="text" @click="handleEdit(scope.row)">编辑</el-button>
                            </template>
                        </el-table-column>

                    </el-table>
                    <pagination
                        :total="total_num"
                        :page.sync="get_params.page"
                        :limit.sync="get_params.size"
                        @pagination="get_data"
                        style="padding-top:10px"
                        v-show="total_num>0"/>
                </div>
            </div>
        </div>
        <el-dialog title="创建分组" :visible.sync="addRuleGroupDialog" width="500px" custom-class="common-dialog">
            <el-form :model="addRuleGroupForm" :rules="rules" ref="addRuleGroupForm" label-position="top">
                <el-form-item label="分组名称：" prop="name" label-width="120px">
                    <el-input style="width:100%;" placeholder="请输入" clearable v-model="addRuleGroupForm.name" size="small"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <!-- <searchBtn title="确 定" @click="submitGroupForm('addRuleGroupForm')" />
                <cancel-btn title="取 消" style="margin-left: 10px;" @click="addRuleGroupDialog = false"></cancel-btn> -->
                <el-button
                    size="small"
                    type="primary"
                    @click="submitGroupForm('addRuleGroupForm')"
                >确 定</el-button>
                <el-button
                    style="margin-left: 10px;"
                    size="small"
                    @click="addRuleGroupDialog = false"
                >取 消</el-button>
            </span>
        </el-dialog>
        <el-dialog title="编辑分组" :visible.sync="editRuleGroupDialog" width="500px" custom-class="common-dialog">
            <el-form :model="editRuleGroupForm" :rules="rules" ref="editRuleGroupForm" label-position="top">
                <el-form-item label="分组名称：" prop="name" label-width="120px">
                    <el-input style="width: 100%;" placeholder="请输入" clearable v-model="editRuleGroupForm.name" size="small"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <!-- <searchBtn title="确 定" @click="submitGroupFormEdit('editRuleGroupForm')" />
                <cancel-btn title="取 消" style="margin-left: 10px;" @click="editRuleGroupDialog = false"></cancel-btn> -->
                <el-button
                    size="small"
                    type="primary"
                    @click="submitGroupFormEdit('editRuleGroupForm')"
                >确 定</el-button>
                <el-button
                    style="margin-left: 10px;"
                    size="small"
                    @click="editRuleGroupDialog = false"
                >取 消</el-button>
            </span>
        </el-dialog>
        <!-- <el-dialog title="删除分组" :visible.sync="delRuleGroupDialog" width="30%" custom-class="common-dialog">
            <span>确定删除吗？</span>
            <span slot="footer" class="dialog-footer">
                <searchBtn title="确 定" @click="handleDeleteGroupFun" />
                <cancel-btn title="取 消" style="margin-left: 10px;" @click="delRuleGroupDialog = false"></cancel-btn>
                <el-button
                    size="small"
                    type="primary"
                    @click="handleDeleteGroupFun"
                >确 定</el-button>
                <el-button
                    style="margin-left: 10px;"
                    size="small"
                    @click="delRuleGroupDialog = false"
                >取 消</el-button>
            </span>
        </el-dialog> -->
        <DeleteDialog
            :dialogVisible = "delRuleGroupDialog"
            @delete="handleDeleteGroupFun"
            @cancel="delRuleGroupDialog = false">
        </DeleteDialog>
        <el-dialog title="发起任务" class="assign-dialog" :visible.sync="assignDialog" width="600px" custom-class="common-dialog">
            <el-form :model="assignForm" label-position="top">
                <el-form-item label="选择指派人：" size="mini">
                    <div class="select-box">
                        <div style="cursor:pointer;" class="ub ub-ac select-title" @click.stop="onOffAssign=!onOffAssign">
                            <div class="ub ub-f1 line1" style="text-indent: 20px;height:26px;text-align:left;line-height: 28px;font-size: 12px;">{{getSelectAssignUser}}</div>
                            <div style="width:28px;height:28px;text-align: center;line-height: 28px;">
                                <i style="color:#ccc;" :class="{'el-icon-arrow-up':onOffAssign,'el-icon-arrow-down':!onOffAssign}"></i>
                            </div>
                        </div>
                        <div v-show="onOffAssign" class="select-mask" style="padding:10px 0;" @click.stop>
                            <div class="assign-box w100" v-for="(item,index) in assignUsers" :key="index">
                                <div class="ub ub-pj assign-title w100" style="padding:0 10px;box-sizing: border-box;">
                                    <div>{{item.roleName}}</div>
                                    <div class="allSelect" :class="{'active':item.checked}" @click.stop="allSelectFun(item)">全选</div>
                                </div>
                                <div v-for="(_item,_index) in item.children" :key="_index" class="ub ub-ac assign-user w100" style="box-sizing: border-box;padding:0 10px 0 20px;background-color:rgba(0,0,0,0.05);" @click.stop="SingleSelectFun(_item,item)">
                                    <div class="ub ub-f1 assign-name" :class="{'active':_item.checked}">{{_item.username}}</div>
                                    <div style="color:#387dee;" class="right-icon" :class="{'el-icon-check':_item.checked}"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <!-- <searchBtn title="确 定" @click="submitAssign" />
                <cancel-btn title="取 消" style="margin-left: 10px;" @click="assignDialog = false"></cancel-btn> -->
                <el-button
                    size="small"
                    type="primary"
                    @click="submitAssign"
                >确 定</el-button>
                <el-button
                    style="margin-left: 10px;"
                    size="small"
                    @click="assignDialog = false"
                >取 消</el-button>
            </span>
        </el-dialog>
        <!--删除-->
        <DeleteDialog
            :dialogVisible = "deleteDialog"
            @delete="handleDeleteFun"
            @cancel="deleteDialog = false">
        </DeleteDialog>
        <DeleteDialog
            :dialogVisible = "deleteAllDialog"
            @delete="handleDeleteAllFun"
            @cancel="deleteAllDialog = false">
        </DeleteDialog>
    </div>
</template>

<script>
import {
    get_rule_tree,
    add_rule_group,
    delete_rule_group,
    get_task_list,
    get_assign_users,
    assign_user,
    import_module,
    statrt_stop,
    delete_task,
    exportTask,
    exportTemplate
} from '../../server/protect_net/inspection.js'
export default {
    name: 'Module',
    data() {
        return {
            tableHeight: document.body.clientHeight - 260,
            assignUsersIds_prev: [],
            assignUsersIds: [],
            assignUsers: [],
            onOffAssign: false,
            assignForm: {
                id: ''
            },
            onOff: false,
            assignDialog: false,

            isClick: true,
            isFirst: true,
            indent: 5,
            initId: null,
            depId: '',
            treeData: [{
                id: 1,
                name: '一级 2',
                childGroupInfo: [{
                    id: 3,
                    name: '二级 2-1',
                    childGroupInfo: [{
                        id: 4,
                        name: '三级 3-1-1'
                    }, {
                        id: 5,
                        name: '三级 3-1-2'
                    }]
                }, {
                    id: 2,
                    name: '二级 2-2',
                    childGroupInfo: [{
                        id: 6,
                        name: '三级 3-2-1'
                    }, {
                        id: 7,
                        name: '三级 3-2-2'
                    }]
                }]
            }],
            propsData: {
                children: 'sub',
                label: 'name'
            },

            currentNode: {
                id: ''
            },
            states: [{
                value: 0,
                label: '未发起'
            }, {
                value: 1,
                label: '未完成'
            }, {
                value: 2,
                label: '已完成'
            }],
            get_params: {
                page: 1,
                size: 20,
                taskName: '',
                exports: '',
                status: ''
            },
            addRuleForm: {
                rule_name: ''
            },
            addRuleDialog: false,
            // 导入数据
            importDialog: false,
            importForm: {
                name: '',
                state: '1'
            },
            // 编辑数据
            editRuleForm: {
                id: '',
                rule_name: ''
            },
            currentId: '',
            editRuleDialog: false,

            // 自动处置数据
            autoDialog: false,
            task_types: [{
                value: 1,
                label: '高级'
            }, {
                value: 2,
                label: '中级'
            }, {
                value: 3,
                label: '低级'
            }],
            prioritys: [{
                value: 1,
                label: '高级'
            }, {
                value: 2,
                label: '中级'
            }, {
                value: 3,
                label: '低级'
            }],
            assign_groups: [{
                value: 1,
                label: '高级'
            }, {
                value: 2,
                label: '中级'
            }, {
                value: 3,
                label: '低级'
            }],
            autoFrom: {
                handle_way: false,
                checkList: ['1'],
                taskName: '',
                task_type: '',
                priority: '',
                assign_group: '',
                advise: ''
            },
            addRuleGroupDialog: false,
            addRuleGroupForm: {
                name: ''
            },
            editRuleGroupDialog: false,
            editRuleGroupForm: {
                name: ''
            },
            delRuleGroupDialog: false,
            sayTimes: [],
            userId: '',
            files_list: [],
            // downloadDialog:false,
            files: [],
            fileList: [],
            uploadDialog: false,
            file_num: 0,

            rules: {
                rule_name: [{
                    required: true,
                    message: '请输入规则名称',
                    trigger: 'blur'
                }],
                name: [{
                    required: true,
                    message: '请输入规则组名称',
                    trigger: 'blur'
                }]
            },
            currentNodeId: '',
            isOpen: false,

            deleteAllDialog: false,
            deleteDialog: false,
            deleteId: '',
            formLabelWidth: '100px',
            loading: true,
            total_num: 0,
            multipleSelection: [],
            tableData: [],
            up_loading: null,
            filterText: ''
        }
    },
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val)
        },
        addRuleDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.addRuleForm.resetFields()
                }
            }
        },
        addRuleGroupDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.addRuleGroupForm.resetFields()
                }
            }
        }
    },
    computed: {
        header() {
            return { token: this.$getlocalStorage('initInfo').user.token }
        },
        getSelectAssignUser() {
            let users = []
            let names = []
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.assignUsersIds = []
            this.assignUsers.forEach(item => {
                let selecteds = item.children.filter(_item => _item.checked)
                users = users.concat(selecteds)
            })
            users.forEach(item => {
                names.push(item.username)
                this.assignUsersIds.push(item.id)
            })
            return names.join(',')
        }
    },
    mounted() {
        this.$nextTick(() => {
            let userInfo = this.$getsessionStorage('userInfo')
            this.userId = userInfo.id
            this.initTree()
            this.initAssignUsers()
        })
    },
    methods: {
        getStatus(status) {
            if (status == 0) {
                return 'three'
            } else if (status == 1) {
                return 'one'
            } else {
                return 'two'
            }
        },
        filterNode(value, data) {
            if (!value) return true
            return data.name.indexOf(value) !== -1
        },
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex % 2) {
                return 'table-row2'
            } else {
                return 'table-row1'
            }
        },
        exportUrl() {
            let data = {
                paramsData: {},
                queryData: {
                    taskName: this.get_params.taskName,
                    output: this.get_params.exports,
                    status: this.get_params.status,
                    groupId: this.depId
                }
            }
            this.isClick = true
            exportTask(data).then(res => {
                console.log(res, '查看下载')
                this.isClick = false
                let url = window.URL.createObjectURL(new Blob([res], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                }))
                let link = document.createElement('a')
                link.style.display = 'none'
                link.href = url
                link.setAttribute('download', '组织架构列表.xlsx')
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link) // 下载完成移除元素
                window.URL.revokeObjectURL(url) // 释放掉blob对象
            }).catch(err => {
                this.isClick = false
                console.log(err + 'err')
            })
        },
        exportTem() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            this.isClick = true
            exportTemplate(data).then(res => {
                console.log(res, '查看下载')
                this.isClick = false
                let url = window.URL.createObjectURL(new Blob([res], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                }))
                let link = document.createElement('a')
                link.style.display = 'none'
                link.href = url
                link.setAttribute('download', '组织架构列表.xlsx')
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link) // 下载完成移除元素
                window.URL.revokeObjectURL(url) // 释放掉blob对象
            }).catch(err => {
                this.isClick = false
                console.log(err + 'err')
            })
        },
        reset() {
            this.get_params = {
                page: 1,
                size: 20,
                taskName: '',
                exports: '',
                status: ''
            }
            this.get_data()
        },
        selectInit(row, index) {
            if (row.status == 0) {
                // eslint-disable-next-line no-irregular-whitespace
                return true  // 不可勾选
            } else {
                // eslint-disable-next-line no-irregular-whitespace
                return false  // 可勾选
            }
        },
        beforeUpLoad() {
            this.up_loading = this.$loading({
                lock: true,
                text: '上传中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })
        },
        upLoadExcle(res) {
            this.up_loading.close()
            if (res.code == 1) {
                this.get_data()
            } else if (res.code == 2) { // 请求成功但流程不对
                this.$message({
                    message: res.message,
                    type: 'warning'
                })
            } else if (res.code == 9999) {
                this.$setsessionStorage('errorInfo', res.message)
                this.$router.push('/error')
            } else if (res.code == 9005) {
                this.$message({
                    message: '登录已失效，请重新登录！',
                    type: 'warning'
                })
            } else {
                this.$message({
                    message: res.message,
                    type: 'warning'
                })
            }
        },
        upLoadError() {
            this.up_loading.close()
        },
        toAddTask() {
            this.$router.push({
                path: 'task_add'
            })
        },
        preventFun() {
            this.onOff = false
            this.onOffAssign = false
        },
        allSelectFun(item) {
            if (item.checked) {
                item.children = item.children.map(_item => {
                    _item.checked = false
                    return _item
                })
            } else {
                item.children = item.children.map(_item => {
                    _item.checked = true
                    return _item
                })
            }
            item.checked = !item.checked
        },
        SingleSelectFun(_item, item) {
            if (!_item.checked) {
                _item.checked = !_item.checked
                if (!item.children.some(_items => _items.checked === false)) {
                    item.checked = true
                }
            } else {
                _item.checked = !_item.checked
                item.checked = false
            }
        },
        initAssignUsers() {
            this.assignUsers = []
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_assign_users(data).then(res => {
                console.log('11111111111', res)
                if (res.length > 0) {
                    res.forEach(item => {
                        if (item.users.length > 0) {
                            let obj = {}
                            obj.id = item.id
                            obj.checked = false
                            obj.roleName = item.roleName
                            obj.children = []
                            item.users.forEach(_item => {
                                let _obj = {}
                                _obj.id = _item.id
                                _obj.checked = false
                                _obj.username = _item.chineseName
                                obj.children.push(_obj)
                            })
                            this.assignUsers.push(obj)
                        }
                    })
                }
            }).catch(error => {
                console.log('error' + error)
            })
        },
        initTree() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_rule_tree(data).then(res => {
                console.log('tree', res)
                let _data = [
                    res
                ]
                if (this.isFirst) {
                    this.depId = _data[0].id
                    this.initId = _data[0].id
                    this.get_data()
                }
                this.isFirst = false
                this.isClick = false
                this.treeData = _data
            }).then(() => {
                this.$refs.tree.setCheckedKeys([this.currentNodeId])
                this.$refs.tree.setCurrentKey(this.depId)
                this.isClick = true
            }).catch(error => {
                console.log('error' + error)
            })
        },
        initParams() {
            this.get_params = {
                page: 1,
                size: 20,
                taskName: '',
                exports: '',
                status: ''
            }
            this.total_num = 0
        },
        handleClick(data, checked, node) {
            if (checked) {
                this.currentNode = data
                if (this.isClick) {
                    this.currentNodeId = data.id
                }
                this.$refs.tree.setCheckedNodes([data])
            }
        },

        handleNodeClick(node) {
            console.log(node)
            this.depId = node.id
            this.initParams()
            this.get_data()
        },
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },

        searchCheck() {
            this.get_params.page = 1
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
                    taskName: this.get_params.taskName,
                    output: this.get_params.exports,
                    status: this.get_params.status,
                    groupId: this.depId
                }
            }
            get_task_list(data).then(res => {
                console.log('模型列表', res)
                this.loading = false
                this.total_num = res.total
                let list = res.records
                if (list.length > 0) {
                    list.forEach(item => {
                        let obj = {}
                        obj.id = item.id
                        obj.taskName = item.taskName
                        obj.users = []
                        if (item.users.length > 0) {
                            item.users.forEach(_item => {
                                if (_item.userName) {
                                    obj.users.push(_item)
                                }
                            })
                        }
                        obj.des = item.des
                        obj.createTime = item.createTime
                        obj.output = item.output
                        obj.hours = item.hours
                        obj.status = item.status
                        obj.statusCN = item.statusCN
                        obj.groupId = item.groupId
                        obj.groupName = item.groupName
                        obj.startTime = item.startTime
                        obj.endTime = item.endTime
                        obj.history = item.history
                        this.tableData.push(obj)
                    })
                }
            }).catch(error => {
                this.loading = false
                console.log('error' + error)
            })
        },
        handleStart(row) {
            let data = {
                id: row.id,
                status: row.status == 1 ? 2 : 1
            }
            statrt_stop(data).then(res => {
                this.$message({
                    message: row.status == 1 ? '已暂停' : '已启用',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(error => {
                this.loading = false
                console.log('error' + error)
            })
        },
        handleEdit(row) {
            console.log(row)
            this.$setsessionStorage('editInfo', row)
            this.$router.push({
                path: 'task_edit',
                query: {
                    id: row.id
                }
            })
        },
        handleDeleteAll() {
            if (this.multipleSelection.length == 0) {
                this.$message({
                    message: '请先选择模型',
                    type: 'warning'
                })
                return
            }
            this.deleteAllDialog = true
        },
        handleSee(row) {
            console.log(row)
            this.$setsessionStorage('editInfo', row)
            this.$router.push({
                path: 'task_detail',
                query: {
                    id: row.id
                }
            })
        },
        handleAssign(row) {
            this.assignForm.id = row.id
            this.assignUsersIds_prev = []
            if (row.users.length > 0) {
                row.users.forEach(item => {
                    this.assignUsersIds_prev.push(item.userId)
                })
            }
            this.assignUsers = this.assignUsers.map(item => {
                item.children.forEach(_item => {
                    if (this.assignUsersIds_prev.some(items => items === _item.id)) {
                        _item.checked = true
                    } else {
                        _item.checked = false
                    }
                })
                if (!item.children.some(_items => _items.checked === false)) {
                    item.checked = true
                }
                return item
            })
            this.assignDialog = true
        },
        submitAssign() {
            let data = {
                queryData: {},
                paramsData: {
                    id: this.assignForm.id,
                    userIds: this.assignUsersIds
                }
            }
            assign_user(data).then(res => {
                this.assignDialog = false
                this.$message({
                    message: '指派成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(error => {
                console.log(error + 'error')
            })
        },
        handleDeleteAllFun() {
            let ids = []
            this.multipleSelection.map(item => {
                ids.push(item.id)
            })
            let data = {
                queryData: {},
                paramsData: {
                    ids: ids
                }
            }
            delete_task(data).then(res => {
                this.deleteAllDialog = false
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
        handleDelete(row) {
            this.deleteId = row.id
            this.deleteDialog = true
        },
        handleDeleteFun() {
            let data = {
                queryData: {},
                paramsData: {
                    ids: [this.deleteId]
                }
            }
            delete_task(data).then(res => {
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
                console.log(error + 'error')
            })
        },

        handleDeleteGroupFun() {
            let data = {
                queryData: {},
                paramsData: {
                    id: this.currentNode.id
                }
            }
            delete_rule_group(data).then(res => {
                this.delRuleGroupDialog = false
                console.log('删除成功')
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.initTree()
                }, 1500)
            }).catch(error => {
                console.log(error + 'error')
            })
        },
        delRuleShow() {
            if (this.depId === this.currentNode.id) {
                this.$message({
                    message: '当前组目前处于显示状态不能删除！',
                    type: 'warning'
                })
                return
            }
            let selects = this.$refs.tree.getCheckedKeys()
            console.log(selects)
            if (selects.length === 0) {
                this.$message({
                    message: '请勾选要删除的规则组',
                    type: 'warning'
                })
                return
            }
            this.delRuleGroupDialog = true
        },
        addRuleShow() {
            let selects = this.$refs.tree.getCheckedKeys()
            console.log(selects)
            if (selects.length === 0) {
                this.$message({
                    message: '请勾选要新增的规则组',
                    type: 'warning'
                })
                return
            }
            this.addRuleGroupDialog = true
        },
        editRuleShow() {
            let selects = this.$refs.tree.getCheckedKeys()
            console.log(selects)
            if (selects.length === 0) {
                this.$message({
                    message: '请勾选要删除的规则组',
                    type: 'warning'
                })
                return
            }
            this.editRuleGroupForm.name = this.currentNode.name
            this.editRuleGroupDialog = true
        },
        submitGroupFormEdit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.editGroupFun()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        submitGroupForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.addGroupFun()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },

        editGroupFun() {
            let data = {
                queryData: {},
                paramsData: {
                    name: this.editRuleGroupForm.name,
                    id: this.currentNode.id
                }
            }
            add_rule_group(data).then(res => {
                this.editRuleGroupDialog = false
                this.$message({
                    message: '编辑成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.initTree()
                }, 1500)
            }).catch(error => {
                console.log(error + 'error')
            })
        },
        addGroupFun() {
            console.log('this.currentNode.id', this.currentNode.id)
            let data = {
                queryData: {},
                paramsData: {
                    name: this.addRuleGroupForm.name
                }
            }
            if (this.currentNode.id != '') {
                data.paramsData.parentId = this.currentNode.id
            }

            add_rule_group(data).then(res => {
                this.addRuleGroupDialog = false
                console.log('添加成功')
                this.$message({
                    message: '添加成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.initTree()
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

        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        submitUpload(params) {
            let data = {
                queryData: {},
                paramsData: {
                    groupId: this.depId,
                    name: params.name,
                    importMethod: params.state,
                    annexList: this.files
                }
            }
            import_module(data).then(res => {
                this.uploadDialog = false
                this.fileList = []
                this.file_num = 0
                this.files = []
                this.$message({
                    message: '导入成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(error => {
                console.log(error + 'error')
            })
        },
        uploadSuccess(response, file, fileList) {
            this.files = []
            this.file_num++
            if (this.file_num === fileList.length) {
                console.log('fileList', fileList)
                console.log('this.fileList', this.fileList)
                if (fileList.length > 0) {
                    fileList.forEach(item => {
                        let obj = {}
                        obj.fileName = item.name.split('.')[0]
                        obj.filePath = item.response.data.successFile
                        this.files.push(obj)
                    })
                }
                this.$message({
                    message: '上传成功！',
                    type: 'success'
                })
            }
        },
        firstCopySuccess(e) {
            console.log('copy arguments e:', e)
            this.$message({
                message: '复制成功!',
                type: 'success'
            })
        },
        firstCopyError(e) {
            console.log('copy arguments e:', e)
            this.$message({
                message: '复制失败!',
                type: 'warning'
            })
        }
    }
}
</script>

    <style lang="scss" scoped>
    .desIp-popover{
        i{
            font-size:12px;
            margin-right:10px;
            cursor: pointer;
            color: #0052d9;
            &:hover{
                opacity:0.8;
            }
        }
        span{
            font-size:12px;
            color: rgba(0,0,0,.9);
        }
        >div:nth-child(1){
            margin-bottom:10px;
        }
    }
    .alarm-state{
        width:80px;
        height:18px;
        padding:2px 5px;
        border-radius: 11px;
        &.one{
            background-color: #fde6d8;
            color:#de7400;
        }
        &.two{
            background-color: #ccf6e4;
            color:#03864f;
        }
        &.three{
            background-color: #d5e5fa;
            color:#0052d9;
        }
        &.four{
            background-color: #fad7dd;
            color:#aa0202;
        }
    }
        .pagination {
            padding: 0px 0 20px;
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

        .event ::v-deep .el-range-input {
            background-color: rgba(0, 0, 0, 0);
            color: #fff;
        }

        .event ::v-deep .el-range-separator {
            color: #fff;
        }
        .event ::v-deep .el-upload-list__item-name {
            color: #01E9FF;
            i {
                color: #01E9FF;
            }
        }

        .attendance-dialog .el-form-item {
            margin-bottom: 30px;
        }
        .el-tree {
            background: rgba(0, 0, 0, 0);
        }

        .tree ::v-deep .el-tree--highlight-current .el-tree-node>.el-tree-node__content {
            .custom-tree-node {
                span:nth-child(1) {
                    color: #777;
                }
                span:nth-child(2) {
                    color: #777;
                }
            }
        }

        .tree ::v-deep .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
            background-color: rgba(0, 0, 0, 0)!important;
            .custom-tree-node {
                span {
                    // color: #387dee;
                }
            }
        }

        .tree ::v-deep .el-tree--highlight-current .el-tree-node>.el-tree-node__content:hover {
            background-color: rgba(0, 0, 0, 0)!important;
            .custom-tree-node {
                span {
                    color: #387dee;
                }
            }
        }

        .tree ::v-deep .el-checkbox__input.is-disabled .el-checkbox__inner {
            // background-color: #387dee;
            border-color: #387dee;
        }

        .tree ::v-deep .el-checkbox__input .el-checkbox__inner,
        .auto ::v-deep .el-checkbox__input .el-checkbox__inner {
            border-color: #387dee;
        }

        .tree ::v-deep .el-checkbox__input.is-focus .el-checkbox__inner,
        .auto ::v-deep .el-checkbox__input.is-focus .el-checkbox__inner {
            border-color: #387dee;
        }

        .tree ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner,
        .el-checkbox__input.is-indeterminate .el-checkbox__inner,
        .auto ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner,
        .el-checkbox__input.is-indeterminate .el-checkbox__inner {
            background-color: #387dee !important;
            border-color: #387dee;
        }

        .tree-option i {
            margin: 0 3px;
            cursor: pointer;
        }

        .tree ::v-deep .el-checkbox__inner::after,
        .auto ::v-deep .el-checkbox__inner::after {
            // border-color: #387dee;
        }

        .auto ::v-deep .el-checkbox__input.is-checked+.el-checkbox__label {
            color: #387dee;
        }

        .roles ::v-deep .el-tag.el-tag--success {
            // background-color: rgba(0, 0, 0, 0);
            // border-color: #01c5ff;
            // color: #00fdff;
        }
        .assign-dialog ::v-deep .el-dialog__body {
            min-height: 284px;
            overflow-y: hidden;
        }
        .last-state>div:nth-child(1) {
            width: 10px;
            height: 10px;
            border-radius: 10px;
            margin-right: 5px;
        }

        .last-state.one>div:nth-child(1) {
            background-color: #c0c0c0;
            -webkit-box-shadow: 0px 0px 7px #c0c0c0;
        }

        .last-state>div:nth-child(2) {
            // color: #fff;
        }

        .last-state.two>div:nth-child(1) {
            background-color: #fdb900;
            -webkit-box-shadow: 0px 0px 7px #fdb900;
        }

        .last-state.three>div:nth-child(1) {
            background-color: #00bffe;
            -webkit-box-shadow: 0px 0px 7px #00bffe;
        }
        /*.el-select{
            width:100%;
        }*/

        .select-box {
            width: 100%;
            height: 28px;
            display: inline-block;
            position: relative;
        }

        .select-title {
            width: 100%;
            height: 100%;
            // background: transparent;
            border: 1px solid #dcdcdc;
            // box-shadow: 0px 0px 7px #389bf7 inset;
            // color: #fff;
            border-radius: 3px;
        }

        .select-mask {
            width: 100%;
            min-height: 100px;
            max-height: 190px;
            position: absolute;
            left: 0;
            top: 34px;
            z-index: 999;
            overflow-y: auto;
            // background: transparent;
            border: 1px solid #dcdcdc;
            // box-shadow: 0px 0px 7px #389bf7 inset;
            // color: #fff;
            border-radius: 3px;
            // background-color: #043254;
        }

        .assign-box {
            /*padding:10px;*/
            box-sizing: border-box;
        }

        .assign-title,
        .assign-user {
            line-height: 28px;
            cursor: pointer;
        }

        .assign-name {
            font-size: 12px;
            cursor: pointer;
        }

        .assign-name:hover {
            color: #387dee
        }

        .assign-name.active {
            color: #387dee
        }

        .allSelect.active {
            color: #387dee
        }
    </style>
