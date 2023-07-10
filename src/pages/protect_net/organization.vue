<template>
    <div class="list" v-loading="isClick">
        <div class="ub w100" style="height: calc(100vh - 80px); overflow: hidden">
            <div style="background:#fff;border: solid 1px #dadee8;border-radius: 4px;overflow-y:auto;width:200px" class="mr-1 mb-1">
                <div class="asset-tree" style="position: relative;">
                    <div class="ub ub-pj ub-ac w100 mt-1 pl-1 mb-1">
                        <div class="list-tips" style="margin-bottom: 0;font-size:12px;">分组列表</div>
                        <div class="tree-option" style="font-size:12px;color:#1cd7fa;padding-right:10px;">
                            <el-tooltip class="item" effect="dark" v-per="['protective_group_add']" content="新增" placement="top-start">
                                <i class="iconfont icon-tianjiashu" style="font-size: 12px;color:#387dee" @click="addRuleShow"></i>
                            </el-tooltip>
                            <el-tooltip v-if="currentNode.id!=''" v-per="['protective_group_edit']" class="item" effect="dark" content="编辑" placement="top-start">
                                <i class="iconfont icon-xiugaishu" style="font-size: 12px;color:#387dee" @click="editRuleShow"></i>
                            </el-tooltip>
                            <el-tooltip v-if="currentNode.id!=''" v-per="['protective_group_del']" class="item" effect="dark" content="删除" placement="top-start">
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
                        <span class="custom-tree-node" slot-scope="{ node, data }">
                            <span style="font-size:12px;">{{ node.label }}</span>
                            <span style="color:#718492;font-size:12px;">
                                ({{ data.sum }})
                            </span>
                        </span>
                    </el-tree>
                </div>
            </div>
            <div class="ub ub-f1 ub-ver" style="height: 100%;overflow: auto">
                <div class="ub w100" style="box-sizing: border-box;">
                    <SearchTop @search="searchCheck" @reset="reset">
                        <el-col :md="12" :lg="8" :xl="6">
                            <el-form :model="get_params">
                                <el-form-item label="姓名搜索：" label-width="85px">
                                    <el-input
                                        placeholder="姓名搜索"
                                        clearable
                                        v-model="get_params.name"
                                        @keyup.enter.native="searchCheck"
                                        size="small"></el-input>
                                </el-form-item>
                            </el-form>
                        </el-col>
                        <el-col :md="12" :lg="8" :xl="6">
                            <el-form :model="get_params">
                                <el-form-item label="手机号搜索：" label-width="96px">
                                    <el-input
                                        placeholder="手机号搜索"
                                        clearable
                                        v-model="get_params.phone"
                                        @keyup.enter.native="searchCheck"
                                        size="small"></el-input>
                                </el-form-item>
                            </el-form>
                        </el-col>
                        <el-col :md="12" :lg="8" :xl="6">
                            <el-form :model="get_params">
                                <el-form-item label="职务搜索：" label-width="85px">
                                    <el-input
                                        placeholder="职务搜索"
                                        clearable
                                        v-model="get_params.duty"
                                        @keyup.enter.native="searchCheck"
                                        size="small"></el-input>
                                </el-form-item>
                            </el-form>
                        </el-col>
                    </SearchTop>

                </div>
                <div class="attendance-list table-area">
                    <div class="ub ub-pj w100 mb-1">
                        <div class="list-tips">组织架构列表</div>
                        <div>
                            <el-button
                                icon="el-icon-plus"
                                style="margin-left: 5px;"
                                size="small"
                                type="primary"
                                @click="addUserDialog=true"
                                v-per="['protective_orger_add']"
                            >添加人员</el-button>
                            <el-button
                                icon="iconfont icon-daochu"
                                style="margin-left: 5px;"
                                size="small"
                                type="primary"
                                @click="exportExcel"
                                v-per="['protective_orger_exp']"
                            >导出内容</el-button>
                            <el-button
                                icon="el-icon-delete"
                                style="margin-left: 5px;"
                                size="small"
                                type="danger"
                                @click="handleDeleteAll"
                                v-per="['protective_orger_del']"
                            >删除人员</el-button>
                        </div>
                    </div>

                    <el-table
                        ref="multipleTable"
                        v-loading="loading"
                        class='bigTable fixedTable'
                        :data="tableData"
                        border
                        stripe
                        tooltip-effect="dark"
                        :height="tableHeight"
                        :row-style="{ height: '32px' }"
                        :header-row-style="{ height: '32px' }"
                        :row-class-name="tableRowClassName"
                        @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="50"></el-table-column>
                        <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="userName" label="姓名" width="180">
                        </el-table-column>
                        <el-table-column prop="phone" label="手机号" width="170">
                        </el-table-column>
                        <el-table-column prop="duty" label="职务" width="120">
                        </el-table-column>
                        <el-table-column prop="orgName" label="所属组织">
                        </el-table-column>
                        <el-table-column align="center" label="操作" width="120">
                            <template slot-scope="scope">
                                <el-button size="small" type="text" v-per="['protective_orger_edit']" @click="handleEdit(scope.row)">编辑</el-button>
                                <el-button size="small" type="text" v-per="['protective_orger_del']" @click="handleDelete(scope.row)">删除</el-button>
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

        <el-dialog title="添加人员" :visible.sync="addUserDialog" width="600px" custom-class="common-dialog">
            <el-form class="select-tree" :model="addUserForm" :rules="rules" ref="addUserForm" label-position="top">
                <el-form-item label="所属组织：" prop="orgId" label-width="120px">
                    <el-select
                        style="width:100%;"
                        placeholder="请选择"
                        v-model="addUserForm.orgId"
                        size="small"
                        ref="addSelectTree"
                        popper-class="tree_dropdown">
                        <el-option
                            :label="innerLabel_addUser"
                            :value="innerValue_addUser"
                            style="height: 200px;overflow: scroll">
                            <el-tree
                                ref="tree_addUser"
                                node-key="id"
                                :default-expand-all="true"
                                :highlight-current="true"
                                :data="treeData"
                                :props='propsData'
                                @node-click="handleNodeClick_addUser"
                                :check-strictly="true"
                                :expand-on-click-node="false"
                                :indent='indent'>
                                <span class="custom-tree-node" slot-scope="{ node, data }">
                                    <span style="font-size:14px;">{{ node.label }}</span>
                                    <span style="color:#718492;font-size:12px;">
                                        ({{ data.sum }})
                                    </span>
                                </span>
                            </el-tree>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择人员：" prop="userId" label-width="120px">
                    <el-select
                        v-model="addUserForm.userId"
                        style="width:100%;"
                        placeholder="请选择"
                        size="small"
                        filterable>
                        <el-option
                            v-for="item in allUserList"
                            :key="item.id"
                            :label="item.chineseName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="margin-bottom: 40px;" prop="duty" label="组织职位：" label-width="120px" label-position="left">
                    <el-input
                        style="width:100%;"
                        placeholder="请输入"
                        clearable
                        v-model="addUserForm.duty"
                        size="small"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button
                    size="small"
                    type="primary"
                    @click="submitAddUser('addUserForm')"
                >确 定</el-button>
                <el-button
                    style="margin-left: 10px;"
                    size="small"
                    @click="addUserDialog = false"
                >取 消</el-button>
            </span>
        </el-dialog>

        <el-dialog title="编辑人员" :visible.sync="editUserDialog" width="600px" custom-class="common-dialog">
            <el-form class="select-tree" :model="editUserForm" :rules="rules" ref="editUserForm" label-position="top">
                <el-form-item label="所属组织：" prop="orgId" label-width="120px">
                    <el-select ref="editSelectTree" style="width:100%;" placeholder="请选择" v-model="editUserForm.orgId" size="small">
                        <el-option
                            ref="innerValue_editUser"
                            :label="innerLabel_editUser"
                            :value="innerValue_editUser"
                            style="height: 200px;overflow: scroll">
                            <el-tree
                                ref="tree_editUser"
                                node-key="id"
                                :default-expand-all="true"
                                :highlight-current="true"
                                :data="treeData"
                                :props='propsData'
                                @node-click="handleNodeClick_editUser"
                                :check-strictly="true"
                                :expand-on-click-node="false"
                                :indent='indent'
                                @check-change="handleClick">
                                <span class="custom-tree-node" slot-scope="{ node, data }">
                                    <span style="font-size:12px;">{{ node.label }}</span>
                                    <span style="color:#718492;font-size:12px;">
                                        ({{ data.sum }})
                                    </span>
                                </span>
                            </el-tree>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择人员：" prop="userId" label-width="120px">
                    <el-select
                        v-model="editUserForm.userId"
                        style="width:100%;"
                        placeholder="请选择"
                        size="small"
                        filterable>
                        <el-option
                            v-for="item in allUserList"
                            :key="item.id"
                            :label="item.chineseName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="margin-bottom: 40px;" prop="duty" label="组织职位：" label-width="120px" label-position="left">
                    <el-input
                        style="width:100%;"
                        placeholder="请输入"
                        clearable
                        v-model="editUserForm.duty"
                        size="small"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button
                    size="small"
                    type="primary"
                    @click="submitEditUser('editUserForm')"
                >确 定</el-button>
                <el-button
                    style="margin-left: 10px;"
                    size="small"
                    @click="editUserDialog = false"
                >取 消</el-button>
            </span>
        </el-dialog>

        <el-dialog title="创建组织" :visible.sync="addRuleGroupDialog" width="600px" custom-class="common-dialog">
            <el-form :model="addRuleGroupForm" ref="addRuleGroupForm" :rules="group_rules" label-position="top">
                <el-form-item label="组织名称：" prop="name" label-width="120px">
                    <el-input
                        style="width:100%;"
                        placeholder="请输入"
                        clearable
                        v-model="addRuleGroupForm.name"
                        size="small"></el-input>
                </el-form-item>
                <el-form-item label="上级组织：" prop="upper" label-width="120px">
                    <el-select
                        style="width:100%;"
                        placeholder="请选择"
                        ref="addGroup"
                        v-model="addRuleGroupForm.upper"
                        size="small"
                        popper-class="tree_dropdown">
                        <el-option :label="innerLabel" :value="innerValue" style="height: 200px;overflow-y: scroll">
                            <el-tree
                                ref="inner_tree"
                                node-key="id"
                                :default-expand-all="true"
                                :highlight-current="true"
                                :data="treeData"
                                :props='propsData'
                                @node-click="handleNodeClick_inner"
                                :check-strictly="true"
                                :expand-on-click-node="false"
                                :indent='indent'>
                                <span class="custom-tree-node" slot-scope="{ node, data }">
                                    <span style="font-size:14px;">{{ node.label }}</span>
                                    <span style="color:#718492;font-size:12px;">
                                        ({{ data.sum }})
                                    </span>
                                </span>
                            </el-tree>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="负责人：" prop="user" label-width="120px">
                    <el-select
                        v-model="addRuleGroupForm.user"
                        style="width:100%;"
                        placeholder="请选择"
                        size="small"
                        filterable>
                        <el-option
                            v-for="item in allUserList"
                            :key="item.id"
                            :label="item.chineseName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
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

        <el-dialog title="编辑组织" :visible.sync="editRuleGroupDialog" width="600px" custom-class="common-dialog">
            <el-form :model="editRuleGroupForm" ref="editRuleGroupForm" :rules="group_rules" label-position="top">
                <el-form-item label="组织名称：" prop="name" label-width="120px">
                    <el-input
                        style="width:100%;"
                        placeholder="请输入"
                        clearable
                        v-model="editRuleGroupForm.name"
                        size="small"></el-input>
                </el-form-item>
                <el-form-item label="上级组织：" prop="upper" label-width="120px">
                    <el-select ref="editGroup" style="width:100%;" placeholder="请选择" v-model="editRuleGroupForm.upper" size="small">
                        <el-option
                            :label="innerLabel_edit"
                            :value="innerValue_edit"
                            style="height: 200px;overflow-y: scroll">
                            <el-tree
                                ref="inner_treeEdit"
                                node-key="id"
                                :default-expand-all="true"
                                :highlight-current="true"
                                :data="treeData"
                                :props='propsData'
                                @node-click="handleNodeClick_innerEdit"
                                :check-strictly="true"
                                :expand-on-click-node="false"
                                :indent='indent'>
                                <span class="custom-tree-node" slot-scope="{ node, data }">
                                    <span style="font-size:14px;">{{ node.label }}</span>
                                    <span style="color:#718492;font-size:12px;">
                                        ({{ data.sum }})
                                    </span>
                                </span>
                            </el-tree>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="负责人：" prop="user" label-width="120px">
                    <el-select
                        v-model="editRuleGroupForm.user"
                        style="width:100%;"
                        placeholder="请选择"
                        size="small"
                        filterable>
                        <el-option
                            v-for="item in allUserList"
                            :key="item.id"
                            :label="item.chineseName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
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

        <DeleteDialog
            :dialogVisible="delRuleGroupDialog"
            @delete="handleDeleteGroupFun"
            :title="'确定删除这条组织树吗？'"
            :text="'删除该组，组内节点会一并删除'"
            @cancel="delRuleGroupDialog = false">
        </DeleteDialog>

        <DeleteDialog
            :dialogVisible="deleteDialog"
            @delete="handleDeleteFun"
            @cancel="deleteDialog = false">
        </DeleteDialog>
        <DeleteDialog
            :dialogVisible="deleteAllDialog"
            @delete="handleDeleteAllFun"
            @cancel="deleteAllDialog = false">
        </DeleteDialog>
    </div>
</template>

<script>
import {
    get_tree_data,
    get_allUser,
    add_organizationGroup,
    del_organizationGroup,
    get_organization_data,
    add_organization_user,

    del_organization_user,
    del_muiti_user,
    downOrganization
} from '../../server/protect_net/api.js'

export default {
    name: 'Organization',
    data() {
        return {
            tableHeight: document.body.clientHeight - 260,
            isClick: true,
            isFirst: true,
            indent: 10,
            initId: null,
            depId: '',
            treeData: [],
            propsData: {
                children: 'tree',
                label: 'name'
            },
            innerLabel: '', // 新增组织
            innerValue: '',
            innerLabel_edit: '', // 编辑组织
            innerValue_edit: '',
            innerLabel_addUser: '', // 新增人员
            innerValue_addUser: '',
            innerLabel_editUser: '', // 编辑人员
            innerValue_editUser: '',
            allUserList: [],

            currentNode: {
                id: ''
            },
            states: [
                {
                    value: 1,
                    label: '已启用'
                }, {
                    value: 2,
                    label: '已暂停'
                }
            ],
            get_params: {
                page: 1,
                size: 20,
                name: '',
                phone: '',
                duty: ''
            },
            addRuleForm: {
                rule_name: ''
            },
            addRuleDialog: false,
            // 导入数据
            addUserDialog: false,
            addUserForm: {
                orgId: '',
                userId: '',
                duty: ''
            },
            // 编辑数据
            editUserForm: {
                id: '',
                orgId: '',
                userId: '',
                duty: ''
            },
            currentId: '',
            editUserDialog: false,
            addRuleGroupDialog: false,
            addRuleGroupForm: {
                name: '',
                upper: '',
                user: ''
            },
            editRuleGroupDialog: false,
            editRuleGroupForm: {
                id: '',
                name: '',
                upper: '',
                user: ''
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

            group_rules: {
                name: [{
                    required: true,
                    message: '请输入组织名称',
                    trigger: 'change'
                }],
                upper: [{
                    required: false,
                    message: '请选择上级组织',
                    trigger: 'change'
                }],
                user: [{
                    required: true,
                    message: '请选择负责人',
                    trigger: 'change'
                }]
            },
            rules: {
                orgId: [{
                    required: true,
                    message: '请选择所属组织',
                    trigger: 'change'
                }],
                userId: [{
                    required: true,
                    message: '请选择人员',
                    trigger: 'change'
                }],
                duty: [{
                    required: true,
                    message: '请输入组织职位',
                    trigger: 'blur'
                }]
            },
            currentNodeId: '',

            deleteAllDialog: false,
            deleteDialog: false,
            deleteId: '',
            loading: true,
            total_num: 0,
            multipleSelection: [],
            tableData: [],
            filterText: ''
        }
    },
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val)
        },
        addUserDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.addUserForm.resetFields()
                }
            }
        },
        editUserDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.editUserForm.resetFields()
                }
            }
        },

        addRuleGroupDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.addRuleGroupForm.resetFields()
                }
            }
        },
        editRuleGroupDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.editRuleGroupForm.resetFields()
                }
            }
        }
    },

    computed: {
        multipleData() {
            let arr = []
            this.multipleSelection.forEach(item => {
                arr.push(item.id)
            })
            return arr.toString()
        }
    },
    mounted() {
        this.get_data()
        this.$nextTick(() => {
            // let userInfo = this.$getsessionStorage('userInfo');
            // this.userId = userInfo.id;
            this.initTree()
            this.get_allUser_data()
        })
    },
    methods: {
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
        exportExcel() {
            let data = {
                paramsData: {},
                queryData: {
                    str: this.multipleData
                }
            }
            this.isClick = true
            downOrganization(data).then(res => {
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
                name: '',
                phone: '',
                duty: ''
            }
            this.get_data()
        },
        initTree() {
            this.treeData = []
            get_tree_data({}).then(res => {
                console.log('tree', res)
                let obj = {
                    id: 'woshiyigejiaid',
                    ...res
                }
                if (this.isFirst) {
                    // this.depId = res[0].id;
                    // this.initId = res[0].id;
                    this.get_data()
                }
                this.isFirst = false
                this.isClick = false
                this.treeData.push(obj)
            }).then(() => {
                this.$refs.tree.setCheckedKeys([this.currentNodeId])
                this.$refs.tree.setCurrentKey(this.depId)
            }).catch(error => {
                console.log('error' + error)
            })
        },
        initParams() {
            this.get_params = {
                page: 1,
                size: 20,
                name: '',
                phone: '',
                duty: ''
            }
            this.total_num = 0
        },
        handleClick(data, checked, node) {
            console.log(data, checked, node)
            if (checked) {
                this.currentNode = data
                if (this.isClick) {
                    this.currentNodeId = data.id
                }
                this.$refs.tree.setCheckedNodes([data])
            }
        },

        handleNodeClick(node) {
            this.currentNode = node
            if (this.isClick) {
                this.currentNodeId = node.id
            }
            this.$refs.tree.setCheckedNodes([node])
            console.log(node)
            this.depId = node.id
            this.initParams()
            this.get_data()
        },

        handleNodeClick_inner(node) {
            console.log(node)
            // this.depId = node.id;
            this.innerValue = node.id
            this.addRuleGroupForm.upper = node.id
            this.innerLabel = node.name
            this.$refs.addGroup.blur()
        },

        handleNodeClick_innerEdit(node) {
            console.log(node)
            // this.depId = node.id;
            this.innerValue_edit = node.id
            this.editRuleGroupForm.upper = node.id
            this.innerLabel_edit = node.name
            this.$refs.editGroup.blur()
        },

        handleNodeClick_addUser(node) {
            if (node.name == '全公司') {
                this.$message.warning('请勿选择顶级组织')
                return false
            }
            console.log(node)
            this.innerValue_addUser = node.id
            this.addUserForm.orgId = node.id
            this.innerLabel_addUser = node.name
            this.$refs.addSelectTree.blur()
        },

        handleNodeClick_editUser(node) {
            if (node.name == '全公司') {
                this.$message.warning('请勿选择顶级组织')
                return false
            }
            this.innerValue_editUser = node.id
            this.editUserForm.orgId = node.id
            this.innerLabel_editUser = node.name
            this.$refs.editSelectTree.blur()
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
            let page = this.get_params.page
            let pageSize = this.get_params.size
            console.log(this.get_params.phone)
            let data = {
                userName: this.get_params.name,
                phone: this.get_params.phone.trim(),
                orgId: this.depId,
                duty: this.get_params.duty
            }
            get_organization_data(data, page, pageSize).then(res => {
                console.log('列表', res)
                this.loading = false
                this.total_num = res.total
                let list = res.records
                if (list.length > 0) {
                    list.forEach(item => {
                        let obj = {}
                        obj.id = item.id
                        obj.userId = item.userId
                        obj.orgId = item.orgId
                        obj.duty = item.duty
                        obj.phone = item.phone
                        obj.orgName = item.orgName
                        obj.userName = item.userName
                        this.tableData.push(obj)
                    })
                }
            }).catch(error => {
                this.loading = false
                console.log('error' + error)
            })
        },

        get_allUser_data() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_allUser(data).then(res => {
                console.log(res)
                this.allUserList = res
            }).catch(err => {
                console.log(err + 'err')
            })
        },
        handleEdit(row) {
            console.log(row)
            this.editUserForm.id = row.id
            this.editUserForm.orgId = row.orgId
            this.editUserForm.duty = row.duty
            this.editUserForm.userId = row.userId
            this.innerLabel_editUser = row.orgName
            this.innerValue_editUser = row.orgId
            this.editUserDialog = true
        },
        handleDeleteAll() {
            if (this.multipleSelection.length == 0) {
                this.$message({
                    message: '请先选择删除项',
                    type: 'warning'
                })
                return
            }
            this.deleteAllDialog = true
        },
        handleDeleteAllFun() {
            let obj = {
                ids: []
            }
            this.multipleSelection.map(item => {
                obj.ids.push(item.id)
            })

            del_muiti_user(obj).then(res => {
                this.deleteAllDialog = false
                console.log('删除成功')
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                    this.initTree()
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
                id: this.deleteId
            }
            del_organization_user(data).then(res => {
                this.deleteDialog = false
                // console.log('删除成功');
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                    this.initTree()
                }, 1500)
            }).catch(error => {
                console.log(error + 'error')
            })
        },

        handleDeleteGroupFun() {
            let data = {
                id: this.currentNode.id
            }
            del_organizationGroup(data).then(res => {
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
            if (!this.currentNode.id || this.currentNode.id === '') {
                this.$message({
                    message: '顶级组织不能编辑和删除！',
                    type: 'warning'
                })
                return
            }
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
                    message: '请勾选要删除的分组',
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
                    message: '请先勾选分组',
                    type: 'warning'
                })
                return
            } else if (selects.length > 1) {
                this.$message({
                    message: '请只勾选一个分组',
                    type: 'warning'
                })
                return
            }
            // this.$refs.tree.setCheckedNodes([node])
            this.addRuleGroupForm.upper = this.currentNode.id
            this.innerValue = this.currentNode.id
            this.innerLabel = this.currentNode.name
            this.addRuleGroupDialog = true
        },
        editRuleShow() {
            if (!this.currentNode.id || this.currentNode.id === '') {
                this.$message({
                    message: '顶级组织不能编辑和删除！',
                    type: 'warning'
                })
                return
            }
            let selects = this.$refs.tree.getCheckedKeys()
            console.log(selects)
            if (selects.length === 0) {
                this.$message({
                    message: '请勾选要编辑的分组',
                    type: 'warning'
                })
                return
            }
            console.log(this.currentNode)
            this.editRuleGroupForm.name = this.currentNode.name
            this.editRuleGroupForm.user = this.currentNode.userId
            this.editRuleGroupForm.upper = this.currentNode.pid
            this.innerValue_edit = this.currentNode.pid
            this.innerLabel_edit = this.currentNode.pname
            this.editRuleGroupForm.id = this.currentNode.id
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
                id: this.editRuleGroupForm.id,
                name: this.editRuleGroupForm.name,
                pid: this.editRuleGroupForm.upper,
                uid: this.editRuleGroupForm.user
            }
            add_organizationGroup(data).then(res => {
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
            let data = {
                name: this.addRuleGroupForm.name,
                pid: this.addRuleGroupForm.upper,
                uid: this.addRuleGroupForm.user
            }
            add_organizationGroup(data).then(res => {
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
        submitAddUser(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = {
                        orgId: this.addUserForm.orgId,
                        userId: this.addUserForm.userId,
                        duty: this.addUserForm.duty
                    }
                    add_organization_user(data).then(res => {
                        this.addUserDialog = false
                        this.$message({
                            message: '添加成功',
                            type: 'success'
                        })
                        setTimeout(() => {
                            this.get_data()
                            this.initTree()
                        }, 1500)
                    }).catch(error => {
                        console.log(error + 'error')
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },

        submitEditUser(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = {
                        id: this.editUserForm.id,
                        orgId: this.editUserForm.orgId,
                        userId: this.editUserForm.userId,
                        duty: this.editUserForm.duty
                    }
                    add_organization_user(data).then(res => {
                        this.editUserDialog = false
                        this.$message({
                            message: '编辑成功',
                            type: 'success'
                        })
                        setTimeout(() => {
                            this.get_data()
                            this.initTree()
                        }, 1500)
                    }).catch(error => {
                        console.log(error + 'error')
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
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

.attendance-list.table-area {
    background-color: #fff;
    padding: 10px;
    box-shadow: 0px 0px 8px 0px rgba(140, 152, 164, 0.2);
    border-radius: 4px;
    border: solid 1px #dadee8;
    margin-top: 10px;
    .pagination {
        margin-top: 20px;
        text-align: right;
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

.event  ::v-deep  .el-range-input {
    background-color: rgba(0, 0, 0, 0);
    color: #fff;
}

.event  ::v-deep  .el-range-separator {
    color: #fff;
}

.event  ::v-deep  .el-upload-list__item-name {
    color: #01E9FF;

    i {
        color: #01E9FF;
    }
}

.upload-demo  ::v-deep  .el-button--primary {
    background-color: rgba(0, 0, 0, 0);
    border-color: rgba(0, 0, 0, 0);
    /*background-image: url(../assets/img/XZWJ.png);*/
    background-position: 0 0;
    background-repeat: no-repeat;
    background-size: 100% 100%;
}

.el-tree {
    background: rgba(0, 0, 0, 0);
}

.tree  ::v-deep  .el-tree--highlight-current .el-tree-node > .el-tree-node__content {
    .custom-tree-node {
        span:nth-child(1) {
            color: #bfdce4;
        }

        span:nth-child(2) {
            color: #86939e;
        }

    }
}
.select-tree ::v-deep .el-select-dropdown__item.hover, .el-select-dropdown__item:hover {
    background-color: #fff;
}
.tree  ::v-deep  .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
    background-color: rgba(0, 0, 0, 0) !important;

    .custom-tree-node {
        span {
            color: #387dee;
        }
    }
}

.tree  ::v-deep  .el-tree--highlight-current .el-tree-node > .el-tree-node__content:hover {
    background-color: rgba(0, 0, 0, 0) !important;

    .custom-tree-node {
        span {
            // color: #1cd7fa;
        }
    }
}

.tree  ::v-deep  .el-checkbox__input.is-disabled .el-checkbox__inner {
    background-color: #387dee;
    border-color: #387dee;
}

.tree  ::v-deep  .el-checkbox__input .el-checkbox__inner, .auto  ::v-deep  .el-checkbox__input .el-checkbox__inner {
    border-color: #387dee;
}

.tree  ::v-deep  .el-checkbox__input.is-focus .el-checkbox__inner, .auto  ::v-deep  .el-checkbox__input.is-focus .el-checkbox__inner {
    border-color: #387dee;
}

.tree  ::v-deep  .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner, .auto  ::v-deep  .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: rgba(0, 0, 0, 0) !important;
    border-color: #387dee;
}

.tree-option i {
    margin: 0 3px;
    cursor: pointer;
}

.tree  ::v-deep  .el-checkbox__inner::after, .auto  ::v-deep  .el-checkbox__inner::after {
    border-color: #387dee;
}

.auto  ::v-deep  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #387dee;
}

.el-select-dropdown__item.selected {
    font-weight: normal;
}
.fixedTable{
    ::-webkit-scrollbar {
        width: 6px;          /* 纵向滚动条 宽度 */
        height: 5px;         /* 横向滚动条 高度 */
        border-radius: 3px;  /* 整体 圆角 */
    }
}

</style>
<style>
.el-tree-node__content:hover, .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
    background: none !important;
}

/* .el-select-dropdown {
    background-color: transparent;
} */

li::-webkit-scrollbar {
    display: none !important;
}
.custom-tree-node span:hover {
    color: #387dee;
}
.el-tree-node__content {
    background-color: rgba(0,0,0,0)!important;
}
</style>

