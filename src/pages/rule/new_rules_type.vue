<template>
    <div class="list">
        <div class="ub w100" style="height: calc(100vh - 80px); overflow: hidden">
            <div style="background:#fff;border: solid 1px #dadee8;border-radius: 4px;overflow-y:auto;width:178px" class="mr-1 mb-1 leftListTree">
                <div class="tree" style="position: relative">
                    <div class="ub ub-pj ub-ac w100 mt-1 pl-1 mb-1">
                        <div class="list-tips" style="margin-bottom: 0;font-size:12px;">分组列表</div>
                        <div class="tree-option" style="font-size:12px;color:#1cd7fa;padding-right:10px;">
                            <el-tooltip class="item" effect="dark" content="新增" placement="top-start">
                                <i class="iconfont icon-tianjiashu" style="font-size: 12px;color:#387dee" @click="addRuleShow"></i>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                                <i class="iconfont icon-xiugaishu" style="font-size: 12px;color:#387dee" @click="editRuleShow"></i>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
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
                                ({{ data.number }})
                            </span>
                        </span>
                    </el-tree>
                </div>
            </div>
            <div class="ub ub-f1 ub-ver mb-1 right-wrapper" style="height: 100%;">
                <SearchTop @search="searchCheck" @reset="reset" @isOpen="isOpen1">
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="规则名称：" label-width="75px">
                                <el-input placeholder="请输入" clearable v-model.trim="get_params.name" @keyup.enter.native="searchCheck" size="small"></el-input></el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="规则编号：" label-width="75px">
                                <el-input placeholder="请输入"  clearable v-model.trim="get_params.ruleNumber" @keyup.enter.native="searchCheck" size="small"></el-input></el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="状态：" label-width="60px">
                                <el-select size="small" clearable v-model="get_params.status" filterable placeholder="请选择" style="width: 100%">
                                    <el-option label="已启用" value="1"></el-option>
                                    <el-option label="未启用" value="0"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="创建人：" label-width="75px">
                                <el-input placeholder="请输入"  clearable v-model.trim="get_params.createUserName" @keyup.enter.native="searchCheck" size="small"></el-input></el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="修改人：" label-width="75px">
                                <el-input placeholder="请输入" clearable v-model.trim="get_params.updateUserName" @keyup.enter.native="searchCheck" size="small"></el-input></el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="模糊搜索：" label-width="75px">
                                <el-input placeholder="请输入" clearable v-model.trim="get_params.vagueSearch" @keyup.enter.native="searchCheck" size="small"></el-input></el-form-item>
                        </el-form>
                    </el-col>
                </SearchTop>
                <div class="list-container">
                    <div class="ub ub-pj w100 mb-1 ub-ac">
                        <div class="list-tips">分析规则管理</div>
                        <div>
                            <!-- <el-button style="color:rgba(0,0,0,.26);font-size:12px" title="点击查看帮助手册" icon="el-icon-question" @click="$pushRouter('/help_manual/help_rule_manage')" type="text">帮助手册</el-button> -->
                            <el-button  icon="el-icon-plus" size="small" type="primary" @click="handleAdd" v-per="['rule_manage_add']">新建规则</el-button>
                            <el-button icon="iconfont icon-kaiqi" size="small" type="primary" @click="handleDeployAll(1)" v-per="['rule_manage_enable']">启用规则</el-button>
                            <el-button icon="iconfont icon-zanting" size="small" type="primary" @click="handleDeployAll(0)" v-per="['rule_manage_disable']">停用规则</el-button>
                            <el-button size="small" type="primary" icon="el-icon-edit" @click="handleRuleGroup" v-per="['rule_manage_group']">修改分组</el-button>
                            <el-upload
                                action="/api/rule/manage/rule/import"
                                :headers="{'token': this.$getlocalStorage('initInfo').user.token}"
                                name="file"
                                accept=".rule"
                                :with-credentials="true"
                                :file-list="fileList"
                                :show-file-list="false"
                                :on-success="handleSuccess"
                                :before-upload="beforeUpload"
                                style="display: inline-block;">
                                <el-button :loading="uploading" style="margin-left: 10px;" icon="iconfont icon-daoru" size="small" type="primary" v-per="['rule_manage_import']">导入</el-button>
                            </el-upload>
                            <!-- <a :href="downloadUrl" download> -->
                            <el-button :loading="downLoading" style="margin:0 0 0 10px;" icon="iconfont icon-daochu" size="small" type="primary" @click="downData" v-per="['rule_manage_export']">导出</el-button>
                            <!-- </a> -->
                            <el-button icon="el-icon-delete" size="small" type="danger" @click="handleDeleteAll" v-per="['rule_manage_del']">删除</el-button>
                        </div>
                    </div>
                    <!--没加搜索,临时加最小高度-->
                    <el-table
                        ref="multipleTable"
                        v-loading="loading"
                        class='bigTable full-table'
                        :data="tableData"
                        border
                        stripe
                        :row-class-name="tableRowClassName"
                        :height="tabHeight"
                        :row-style="{ height: '32px' }"
                        :header-row-style="{ height: '32px' }"
                        :row-key="(row)=>{ return row.id}"
                        tooltip-effect="dark"
                        @selection-change="handleSelectionChange">
                        <el-table-column type="selection" :reserve-selection="false" width="30" :selectable="checkSelect" align="center">
                        </el-table-column>
                        <el-table-column prop="codeNum" label="编号" width="90">
                        </el-table-column>

                        <el-table-column prop="name" show-overflow-tooltip>
                            <template slot="header">
                                规则名称
                            </template>
                            <template slot-scope="{row}">
                                <span>{{row.name}}</span>
                                <span v-if="row.isExtend === true" style="color: #01ff01">(已被其它规则继承)</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="typeName" label="规则分组" width="140" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="" label="最近7天事件趋势" width="200" align="center" style="padding: 0px !important;">
                            <template slot-scope="{row}">
                                <div style="width: 200px;height: 26px;margin: 0;padding: 0">
                                    <tableLine :data-x="row.dataX" :data-y="row.dataY" :list="tableData"></tableLine>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="count" label="事件量" align="left" sortable width="90">
                        </el-table-column>
                        <el-table-column prop="createTime" label="创建日期" width="160">
                        </el-table-column>
                        <el-table-column prop="createTime" label="是否启用" width="100" align="left">
                            <template slot-scope="{row}">
                                <div class="switch-wrapper" :class="{'yes':row.status,'no':!row.status}"  @click="deploymentEnvironment(row)">
                                    <div class="ub ub-ac ub-pj" :style="{'background':row.status?'#0052d9':'#c5c5c5'}">
                                        <div style="margin-left: -1px"><i class="el-icon-check"></i></div>
                                        <div></div>
                                    </div>
                                    <div class="circle"></div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="createUserName" label="创建人" width="100">
                        </el-table-column>
                        <el-table-column prop="updateUserName" label="修改人" width="100">
                        </el-table-column>
                        <el-table-column align="center" label="操作" width="160">
                            <template slot-scope="scope">
                                <el-button size="small" type="text" @click="handleSee(scope.row)" v-per="['rule_manage_edit']">编辑</el-button>
                                <el-button size="small" type="text" @click="handleCopySee(scope.row)" v-per="['rule_manage_copy']">复制新建</el-button>
                                <el-button size="small" type="text" :disabled="scope.row.isExtend" @click="handleDelete(scope.row)" v-per="['rule_manage_del']">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <pagination v-show="total_num>0" :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size" @pagination="get_data" style="padding-top:10px"/>
                </div>
            </div>
        </div>

        <el-dialog title="事件详情" :visible.sync="detailDialog" width="920px" custom-class="common-dialog">
            <div style="width:70%;margin: 0 auto;">
                <div v-for="(item,index) in detailArr" :key="index" style="margin:12px 0;">
                    <span style="font-size:16px;color:red;padding-right:10px;">{{item._key}}&nbsp;&nbsp;:</span>
                    <span>{{item.value}}</span>
                </div>
            </div>
        </el-dialog>
        <!--环境部署-->
        <el-dialog
            title="规则状态"
            width="620px"
            :visible.sync="deployDialog"
            custom-class="common-dialog">
            <el-row>
                <el-col :span="4">规则状态</el-col>
                <el-col :span="20">
                    <el-radio v-model="editDeploy.status" label="1" style="color: #fff">已启用</el-radio>
                    <el-radio v-model="editDeploy.status" label="0" style="color: #fff">未启用</el-radio>
                </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <searchBtn title="确 定" @click='submitDeployForm'  />
                <cancelBtn title="取 消" @click='deployDialog = false'  />
            </div>
        </el-dialog>

        <!--统一部署-->
        <el-dialog
            title="规则状态"
            width="620px"
            :visible.sync="deployAllDialog"
            custom-class="common-dialog">
            <el-row>
                <el-col :span="4">规则状态</el-col>
                <el-col :span="20">
                    <el-radio v-model="allDeploy.status" label="1" style="color: #fff">已启用</el-radio>
                    <el-radio v-model="allDeploy.status" label="0" style="color: #fff">未启用</el-radio>
                </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <searchBtn title="确 定" @click='submitAllDeployForm'  />
                <cancelBtn title="取 消" @click='deployAllDialog = false'  />
            </div>
        </el-dialog>
        <DeleteDialog
            :dialogVisible = deleteItemDialog
            @delete="deleteItemData"
            @cancel="deleteItemDialog = false">
        </DeleteDialog>
        <DeleteDialog
            :dialogVisible = deleteAllDialog
            @delete="deleteAllData"
            @cancel="deleteAllDialog = false">
        </DeleteDialog>

        <el-dialog title="创建规则组" :visible.sync="addRuleGroupDialog" width="700px" custom-class="common-dialog">
            <el-form :model="addRuleGroupForm" :rules="rules" ref="addRuleGroupForm" label-position="top">
                <el-form-item label="规则组名称：" prop="name" label-width="100px">
                    <el-input style="width:100%;" placeholder="请输入" clearable v-model="addRuleGroupForm.name" size="small"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="addRuleGroupDialog = false">取消</el-button>
                <el-button size="small" type="primary" @click="submitGroupForm('addRuleGroupForm')">确认</el-button>
            </span>
        </el-dialog>
        <el-dialog title="编辑规则组" :visible.sync="editRuleGroupDialog" width="700px" custom-class="common-dialog">
            <el-form :model="editRuleGroupForm" :rules="rules" ref="editRuleGroupForm" label-position="top">
                <el-form-item label="规则组名称：" prop="name" label-width="100px">
                    <el-input style="width:100%;" placeholder="请输入" clearable v-model="editRuleGroupForm.name" size="small"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="editRuleGroupDialog = false">取消</el-button>
                <el-button size="small" type="primary" @click="submitGroupFormEdit('editRuleGroupForm')">确认</el-button>
            </span>
        </el-dialog>
        <DeleteDialog
            :dialogVisible="delRuleGroupDialog"
            @delete="handleDeleteGroupFun"
            @cancel="delRuleGroupDialog = false">
        </DeleteDialog>
        <el-dialog title="修改规则分组" width="700px" :visible.sync="ruleGroupDialog" custom-class="common-dialog">
            <el-form :model="ruleGroupForm" status-icon label-position="top">
                <el-form-item label="规则分组：" style="margin-bottom: 20px;width: 100%">
                    <treeselect
                        class="treeselect"
                        style="width:100%;height:30px"
                        :options="tableDataCopy"
                        :normalizer="normalizer"
                        noChildrenText="当前分支无子节点"
                        noOptionsText="无可用选项"
                        noResultsText="无可用选项"
                        placeholder="请选择"
                        v-model="ruleGroupForm.typeId"
                    />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="ruleGroupDialog = false">取消</el-button>
                <el-button size="small" type="primary" @click="modifyRulesGroup">确认</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {
    get_rule_tree,
    add_rule_group,
    delete_rule_group,
    modify_rules_group
} from '../../server/rule/inspection.js'
import {
    getDrools,
    modify_deployData,
    modify_deployAllData,
    delete_singleData,
    reloadData,
    get_fields,
    enable,
    disable
} from '../../server/rule/attect.js'
import { ruleExport } from '../../server/rule/api.js'
import tableLine from './charts/tableLine.vue'
export default {
    name: 'NewRulesType',
    components: {
        tableLine,
        Treeselect
    },
    data() {
        return {
            downLoading: false,
            uploading: false,
            kaiguan: '',
            tabHeight: document.body.clientHeight - 270,
            ruleGroupDialog: false,
            ruleGroupForm: {
                typeId: ''
            },
            normalizer(node) {
                if (node.childTypeInfo && !node.childTypeInfo.length) {
                    delete node.childTypeInfo
                }
                return {
                    id: node.id,
                    label: node.name,
                    children: node.childTypeInfo
                }
            },
            tableDataCopy: [],
            isClick: true,
            isFirst: true,
            indent: 10,
            initId: null,
            depId: '',
            config_id: '',
            treeData: [],
            propsData: {
                children: 'childTypeInfo',
                label: 'name'
            },

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
            task_types: [
                {
                    value: 1,
                    label: '高级'
                }, {
                    value: 2,
                    label: '中级'
                }, {
                    value: 3,
                    label: '低级'
                }
            ],
            prioritys: [
                {
                    value: 1,
                    label: '高级'
                }, {
                    value: 2,
                    label: '中级'
                }, {
                    value: 3,
                    label: '低级'
                }
            ],
            assign_groups: [
                {
                    value: 1,
                    label: '高级'
                }, {
                    value: 2,
                    label: '中级'
                }, {
                    value: 3,
                    label: '低级'
                }
            ],
            autoFrom: {
                handle_way: false,
                checkList: ['1'],
                task_name: '',
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
            userId: '',
            files_list: [],
            // downloadDialog:false,
            files: [],
            fileList: [],
            uploadDialog: false,
            file_num: 0,
            flag: null,
            record_row: {},

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

            testData: [],
            isOpen: false,
            detailArr: [],
            detailDialog: false,
            deployDialog: false,
            deployAllDialog: false,
            deleteDialog: false,
            deleteItemId: '',
            deleteItemDialog: false,
            deleteAllDialog: false,
            formLabelWidth: '100px',
            loading: false,
            total_num: 0,
            multipleSelection: [],
            tableData: [
                // {
                //   id: '1',
                //   modelMap:'你的钱为你的确为',
                //   drl:'eqweqweqwioeq',
                //   createTime: '2019-12-02 15:20:30',
                //   status: '0'
                // }
            ],
            allDeploy: {
                status: ''
            },
            editDeploy: {
                id: '',
                status: ''
            },
            sayTimes: [],
            get_params: {
                page: 1,
                size: 20,
                sourceIP: '',
                sourcePort: '',
                purposeIP: '',
                purposePort: '',
                respBody: '',
                beginDate: '',
                endDate: '',
                typeId: '',
                name: '',
                status: '',
                createUserName: '',
                updateUserName: '',
                ruleNumber: '',
                vagueSearch: ''
            },
            typeList: [],
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
        ruleGroupDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.ruleGroupForm.typeId = ''
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
        kaiguan(val) {
            if (val) {
                this.tabHeight = document.body.clientHeight - 320
            } else {
                this.tabHeight = document.body.clientHeight - 270
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            let userInfo = this.$getsessionStorage('userInfo')
            this.userId = userInfo.id
            this.initTree()
            this.get_data_fields()
        })
    },
    computed: {
        downloadUrl() {
            return '/api/rule/manage/rule/export'
        }
    },
    methods: {
        beforeUpload(file) {
            this.uploading = true
        },
        tableRowClassName({ row, rowIndex }) {
            console.log(rowIndex)
            if (rowIndex % 2) {
                return 'table-row2'
            } else {
                return 'table-row1'
            }
        },
        downData() {
            this.downLoading = true
            ruleExport({}).then(res => {
                this.downLoading = false
                console.log(res)
            })
        },
        isOpen1(val) {
            console.log(val)
            this.kaiguan = val
        },
        reset() {
            this.get_params = {
                page: 1,
                size: 20,
                sourceIP: '',
                sourcePort: '',
                purposeIP: '',
                purposePort: '',
                respBody: '',
                beginDate: '',
                endDate: '',
                typeId: '',
                name: '',
                status: '',
                createUserName: '',
                updateUserName: '',
                ruleNumber: ''
            }
            this.get_data()
        },
        modifyRulesGroup() {
            let data = {
                ids: this.multipleSelection.map(item => { return item.id }),
                typeId: this.ruleGroupForm.typeId
            }
            console.log(data)
            // eslint-disable-next-line no-undef
            modify_rules_group(data).then(res => {
                this.ruleGroupDialog = false
                this.$message({
                    message: '操作成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.initTree()
                    this.get_data()
                }, 1500)
            }).catch(error => {
                console.log(error + 'error')
            })
        },
        getStyle() {
            console.log(window.screen.width)
            let ws = window.screen.width
            if (ws >= 1680) {
                return {
                    width: '300px'
                }
            } else if (ws < 1680) {
                return {
                    width: '200px'
                }
            }
        },
        get_data_fields() {
            let data = {}
            get_fields(data).then(res => {
                console.log(res, '这个是什么')
                this.$setsessionStorage('rule_fields', res)
            }).catch(error => {
                console.log('error' + error)
            })
        },
        checkSelect(row, index) {
            let isChecked = true
            if (row.isExtend === false) { // 判断里面是否存在某个参数
                isChecked = true
            } else {
                isChecked = false
            }
            return isChecked
        },
        initTree() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_rule_tree(data).then(res => {
                console.log('tree', res)
                if (this.isFirst) {
                    this.depId = res[0].id
                    this.initId = res[0].id
                    this.get_data()
                }
                this.isFirst = false
                this.isClick = false
                this.treeData = res
                this.tableDataCopy = res
            }).then(() => {
                this.$refs.tree.setCheckedKeys([this.currentNodeId])
                this.$refs.tree.setCurrentKey(this.depId)
                this.isClick = true
            }).catch(error => {
                console.log('error' + error)
            })
        },
        filterNode(value, data) {
            if (!value) return true
            return data.name.indexOf(value) !== -1
        },
        initParams() {
            this.get_params = {
                page: 1,
                size: 20,
                name: '',
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
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },

        searchCheck() {
            this.get_params.page = 1
            this.get_data()
        },
        handleEdit(row) {
            this.editRuleForm.rule_name = row.name
            this.editRuleDialog = true
        },
        handleDelete(row) {
            this.deleteItemId = row.id
            this.deleteItemDialog = true
        },
        handleDeleteFun() {
            let data = {
                ids: this.deleteId
            }
            // eslint-disable-next-line no-undef
            delete_module(data).then(res => {
                this.deleteItemDialog = false
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
                id: this.currentNode.id
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
                    this.get_data()
                }, 1500)
            }).catch(error => {
                console.log(error + 'error')
            })
        },
        delRuleShow() {
            if (this.currentNode.id === '') {
                this.$message({
                    message: '顶级组织不能编辑和删除！',
                    type: 'warning'
                })
                return
            }
            // if (this.depId === this.currentNode.id) {
            //     this.$message({
            //         message: '当前组目前处于显示状态不能删除！',
            //         type: 'warning'
            //     })
            //     return
            // }
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
                    message: '请勾选新增所在规则组',
                    type: 'warning'
                })
                return
            }
            this.addRuleGroupDialog = true
        },
        editRuleShow() {
            if (this.currentNode.id === '') {
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
                    message: '请勾选编辑所在规则组',
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
            let data = {
                queryData: {},
                paramsData: {
                    name: this.addRuleGroupForm.name,
                    parentId: this.currentNode.id
                }
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
        handleSuccess(response, file, fileList) {
            console.log('response', response)
            if (response.code == 1) {
                this.uploading = false
                this.$message({
                    message: '导入成功!',
                    type: 'success'
                })
                this.get_data()
                this.initTree()
            } else {
                this.uploading = false
                this.$message({
                    message: response.message,
                    type: 'warning'
                })
            }
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

        get_rules_type() {
            let data = {
                queryData: {},
                paramsData: {
                    name: this.get_params.name
                }
            }
            // eslint-disable-next-line no-undef
            get_rule_type(data).then(res => {
                console.log(res)
                this.typeList = res
            }).catch(err => {
                console.log(err)
            })
        },

        searchAssets() {
            this.get_params.page = 1
            this.get_data()
        },

        get_data() {
            let uid = this.config_id = new Date().getTime()
            this.loading = true
            this.tableData = []
            let data = {
                queryData: {
                    page: this.get_params.page,
                    pageSize: this.get_params.size
                },
                paramsData: {
                    typeId: this.depId,
                    ruleName: this.get_params.name,
                    status: this.get_params.status,
                    codeNum: this.get_params.ruleNumber,
                    createUserName: this.get_params.createUserName,
                    updateUserName: this.get_params.updateUserName,
                    vagueSearch: this.get_params.vagueSearch
                }
            }
            getDrools(data).then(res => {
                if (this.config_id != uid) {
                    return
                }
                console.log(res)
                this.loading = false
                this.testData = res
                this.total_num = res.total
                let list = res.records
                if (list.length > 0) {
                    list.forEach((item, index) => {
                        // console.log(index)
                        let obj = {}
                        obj.id = item.id
                        obj.drl = item.drl
                        obj.modelMap = item.modelMap
                        item.modelMap && (obj.name = JSON.parse(item.modelMap).name)
                        obj.createTime = item.createTime
                        obj.status = item.status
                        obj.count = item.count
                        obj.typeName = item.typeName || '--'
                        obj.typeId = item.typeId
                        obj.codeNum = item.codeNum
                        obj.isExtend = item.isExtend
                        obj.createUserName = item.createUserName || '--'
                        obj.updateUserName = item.updateUserName || '--'

                        obj.dataY = item.alarm7Num ? item.alarm7Num : [0, 0, 0, 0, 0, 0, 0]
                        obj.dataX = ['1', '2', '3', '4', '5', '6', '7']

                        this.tableData.push(obj)
                        // console.log(obj.drl)
                    })
                }
            }).catch(error => {
                this.loading = false
                console.log('error' + error)
            })
        },

        handleSee(row) {
            // console.log(row)
            let data = JSON.parse(JSON.stringify(row))
            data.isEdit = true
            data.modelMap = JSON.parse(data.modelMap)
            data.modelMap.status = data.status // 以json外面的status为准
            data.modelMap = JSON.stringify(data.modelMap)
            console.log(data)
            sessionStorage.setItem(`editParams`, JSON.stringify(data))
            // this.$router.push({ name: 'rule_cep_show', params: data })
            this.$setsessionStorage('currentPath', '/rule/rule_cep_show?ids=' + 'edit')
            let routeData = this.$router.resolve({
                name: 'rule_cep_show',
                query: { ids: 'edit' }
            })
            window.open(routeData.href, '_blank')
        },

        handleCopySee(row) {
            // console.log(row)
            let data = JSON.parse(JSON.stringify(row))
            data.modelMap = JSON.parse(data.modelMap)
            data.modelMap.id = data.id = ''
            data.modelMap.status = data.status // 以json外面的status为准
            data.modelMap.name = data.modelMap.name + '-copy'
            data.modelMap = JSON.stringify(data.modelMap)
            console.log(data)
            sessionStorage.setItem(`copyParams`, JSON.stringify(data))
            // this.$router.push({ name: 'rule_cep_show', params: data })
            this.$setsessionStorage('currentPath', '/rule/rule_cep_show?ids=' + 'copy')
            let routeData = this.$router.resolve({
                name: 'rule_cep_show',
                query: { ids: 'copy' }
            })
            window.open(routeData.href, '_blank')
        },

        deploymentEnvironment(val) {
            if (val.isExtend === true) {
                this.$message.warning('该规则已被其它规则继承，不能修改状态')
                return
            }
            this.flag = setTimeout(() => {
                this.record_row = {}
            }, 1000)
            if (val.id === this.record_row.id) {
                return
            }
            this.record_row = val
            this.editDeploy.id = val.id
            console.log(val.status)
            this.editDeploy.status = val.status = (val.status == 1 ? 0 : 1)
            this.submitDeployForm()
        },

        submitDeployForm(row) {
            let obj = {}
            obj.ids = [this.editDeploy.id]
            obj.status = this.editDeploy.status
            if (obj.status) {
                enable(obj).then(res => {
                    if (document.getElementsByClassName('el-message').length === 0) {
                        this.$message({
                            message: '状态修改成功',
                            type: 'success'
                        })
                    }
                }).catch(error => {
                    console.log(error + 'error')
                })
            } else {
                disable(obj).then(res => {
                    if (document.getElementsByClassName('el-message').length === 0) {
                        this.$message({
                            message: '状态修改成功',
                            type: 'success'
                        })
                    }
                }).catch(error => {
                    console.log(error + 'error')
                })
            }
        },

        submitAllDeployForm(val) {
            let obj = {}
            console.log(this.multipleSelection)
            obj.ids = this.multipleSelection.map(item => { return item.id })
            obj.status = val
            if (obj.status) {
                enable(obj).then(res => {
                    if (document.getElementsByClassName('el-message').length === 0) {
                        this.$message({
                            message: '状态修改成功',
                            type: 'success'
                        })
                    }
                    this.get_data()
                }).catch(error => {
                    console.log(error + 'error')
                })
            } else {
                disable(obj).then(res => {
                    if (document.getElementsByClassName('el-message').length === 0) {
                        this.$message({
                            message: '状态修改成功',
                            type: 'success'
                        })
                    }
                    this.get_data()
                }).catch(error => {
                    console.log(error + 'error')
                })
            }
            this.deployAllDialog = false
        },

        deleteItemData() {
            let obj = {
                ids: [this.deleteItemId]
            }
            delete_singleData(obj).then(res => {
                this.deleteItemDialog = false
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.initTree()
                    this.get_data()
                }, 1000)
            }).catch(error => {
                this.deleteItemDialog = false
                console.log(error + 'error')
            })
        },

        deleteAllData() {
            let ids = []
            this.multipleSelection.forEach(item => {
                console.log(item)
                ids.push(item.id)
            })
            let obj = {
                ids: ids
            }
            delete_singleData(obj).then(res => {
                this.deleteAllDialog = false
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.initTree()
                    this.get_data()
                }, 1000)
            }).catch(error => {
                this.deleteAllDialog = false
                console.log(error + 'error')
            })
        },

        handleAdd() {
            // this.$router.push('/rule/rule_cep_show?add=1')
            this.$setsessionStorage('currentPath', '/rule/rule_cep_show?add=' + 1)
            let routeData = this.$router.resolve({
                name: 'rule_cep_show',
                query: { add: '1' }
            })
            window.open(routeData.href, '_blank')
        },

        handleDeleteAll() {
            if (this.multipleSelection.length === 0) {
                this.$message({
                    message: '请勾选删除的行',
                    type: 'warning'
                })
            } else {
                this.deleteAllDialog = true
            }
        },
        handleRuleGroup() {
            if (this.multipleSelection.length === 0) {
                this.$message({
                    message: '请先选择规则！',
                    type: 'warning'
                })
            } else {
                this.ruleGroupDialog = true
            }
        },

        handleDeployAll(val) {
            if (this.multipleSelection.length === 0) {
                this.$message({
                    message: '请勾选规则行',
                    type: 'warning'
                })
            } else {
                this.submitAllDeployForm(val)
            }
        },

        reload() {
            reloadData().then(res => {
                this.$message({
                    message: 'reload 成功',
                    type: 'success'
                })
            }).catch(error => {
                console.log('error' + error)
            })
        }

    },
    beforeDestroy() {
        if (this.flag) {
            clearTimeout(this.flag)
            this.flag = null
        }
    }
}
</script>

<style lang="scss" scoped>
$borderColor:#DCDFE6;
.right-wrapper{
    height:100%;
    overflow: hidden;
    overflow-y: hidden;
}
.treeselect{
    ::v-deep .vue-treeselect__control{
        height: 30px;
        line-height: 30px;
        border-color: $borderColor;
    }
    ::v-deep .vue-treeselect__input{
        vertical-align: middle;
    }
    ::v-deep .vue-treeselect__single-value{
        font-size:12px;
        line-height:30px;
    }
}
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
.common-dialog .el-form-item {
    margin-bottom: 30px;
}
.upload-demo ::v-deep .el-button--primary{
    background-color: rgba(0,0,0,0);
    border-color: rgba(0,0,0,0);
    background-image: url(../../assets/img/XZWJ.png);
    background-position: 0 0;
    background-repeat: no-repeat;
    background-size: 100% 100%;
}
.el-tree{
    background: rgba(0,0,0,0);
    padding-bottom:20px;
}
.tree ::v-deep .el-tree--highlight-current .el-tree-node>.el-tree-node__content {
    .custom-tree-node{
        span:nth-child(1){
            color:rgba(0,0,0,0.9);
        }
        span:nth-child(2){
            color:#86939e;
        }

    }
}
.tree ::v-deep .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
    background-color: rgba(0,0,0,0)!important;
    .custom-tree-node{
        span{
            color:#0052d9;
        }
    }
}
.tree ::v-deep .el-tree--highlight-current .el-tree-node>.el-tree-node__content:hover{
    background-color: rgba(0,0,0,0);
    .custom-tree-node{
        span{
            color:#0052d9;
        }
    }
}
.tree ::v-deep .el-checkbox__input.is-disabled .el-checkbox__inner{
    background-color: #0052d9;
    border-color: #0052d9;
}
.tree ::v-deep .el-checkbox__input .el-checkbox__inner,.auto ::v-deep .el-checkbox__input .el-checkbox__inner{
    // border-color: rgba(0,0,0,.9);
    border-color: #0052d9;
}
.tree ::v-deep .el-checkbox__input.is-focus .el-checkbox__inner,.auto ::v-deep .el-checkbox__input.is-focus .el-checkbox__inner{
    border-color: #0052d9;
}
.tree ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner,.auto ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: rgba(0,0,0,0);
    border-color: rgba(0,0,0,.9);
}
.tree-option i{
    margin: 0 3px;
    cursor: pointer;
}
.tree ::v-deep .el-checkbox__inner::after,.auto ::v-deep .el-checkbox__inner::after{
    border-color:#0052d9;
}
.tree ::v-deep .el-tree-node__content {
    background-color: rgba(0,0,0,0)!important;
}
.auto ::v-deep .el-checkbox__input.is-checked+.el-checkbox__label{
    color:#1cd7fa;
}
.switch-wrapper{
    width:46px;
    height:20px;
    position: relative;
    cursor: pointer;
    // margin-left: 10px;
}
.switch-wrapper>div:nth-child(1){
    width:46px;
    height:20px;
    background-color: #0052d9;
    border-radius: 12px;
    div{
        font-size: 12px;
        line-height: 20px;
        padding:0 8px;
    }
    >div:nth-child(1){
        color: rgba(255,255,255,0.9);
    }
    >div:nth-child(2){
        color: rgba(255,255,255,0.9);
    }
}
.switch-wrapper>div:nth-child(2){
    width: 18px;
    height: 18px;
    position: absolute;
    left:0;
    top:53%;
    margin-top: -10px;
    border-radius:100%;
    background-color: #c5c5c5;
}
.switch-wrapper.yes>div:nth-child(2){
    animation: moveone 0s linear forwards;
}
.switch-wrapper.no>div:nth-child(2){
    animation: _moveone 0s linear forwards;
}
@keyframes moveone {
    0% {
        background-color: rgb(255,255,255);
        left: 0;
    }

    100% {
        background-color: rgb(255,255,255);
        left: 26px;
    }
}
@-webkit-keyframes moveone {
    0% {
        background-color: rgb(255,255,255);
        left: 1px;
    }

    100% {
        background-color: rgb(255,255,255);
        left: 26px;
    }
}
@keyframes _moveone {
    0% {
        background-color: rgb(255,255,255);
        left: 26px;
    }

    100% {
        background-color: rgb(255,255,255);
        left: 1px;
    }
}
@-webkit-keyframes _moveone {
    0% {
        background-color: rgb(255,255,255);
        left: 26px;
    }

    100% {
        background-color: rgb(255,255,255);
        left: 1px;
    }
}
.event  ::v-deep  .bigTable.el-table td {
    min-height: 34px !important;
    padding: 4px 0 !important;
}
@keyframes moveone_white {
    0% {
        background-color: #fff;
        box-shadow: 0px 0px 10px 0px #e5e5e5;
        left: 1px;
    }

    100% {
        background-color: #fff;
        box-shadow: 0px 0px 10px 0px #e5e5e5;
        left: 37px;
    }
}
@-webkit-keyframes moveone_white {
    0% {
        background-color: #fff;
        box-shadow: 0px 0px 10px 0px #e5e5e5;
        left: 1px;
    }

    100% {
        background-color: #fff;
        box-shadow: 0px 0px 10px 0px #e5e5e5;
        left: 37px;
    }
}
@keyframes _moveone_white {
    0% {
        background-color: #fff;
        box-shadow: 0px 0px 10px 0px #e5e5e5;
        left: 37px;
    }

    100% {
        background-color: #fff;
        box-shadow: 0px 0px 10px 0px #e5e5e5;
        left: 1px;
    }
}
@-webkit-keyframes _moveone_white {
    0% {
        background-color: #fff;
        box-shadow: 0px 0px 10px 0px #e5e5e5;
        left: 37px;
    }

    100% {
        background-color: #fff;
        box-shadow: 0px 0px 10px 0px #e5e5e5;
        left: 1px;
    }
}
.white-theme .switch-wrapper.yes>div:nth-child(2){
    animation: moveone_white 0s linear forwards;
}
.white-theme .switch-wrapper.no>div:nth-child(2){
    animation: _moveone_white 0s linear forwards;
}

.custom-star .leftListTree {
    border: 1px solid #1cd7fa !important;
    background-color: transparent !important;
    box-shadow: 0 0 7px inset #389bf7 !important;
    .list-tips {
        color: #ffffff !important;
    }
}

.custom-star .leftListTree {
    .tree ::v-deep .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
        background-color: rgba(0,0,0,0)!important;
        .custom-tree-node{
            span{
                color:#fff;
            }
        }
    }

    .tree ::v-deep .el-tree--highlight-current .el-tree-node>.el-tree-node__content:hover{
        background-color: rgba(0,0,0,0);
        .custom-tree-node{
            span{
                color:#fff;
            }
        }
    }

    .tree ::v-deep .el-tree--highlight-current .el-tree-node>.el-tree-node__content {
        .custom-tree-node{
            span:nth-child(1){
                color:rgba(255,255,255,0.9);
            }
            span:nth-child(2){
                color:#86939e;
            }

        }
    }

    .tree ::v-deep .el-checkbox__inner::after,.auto ::v-deep .el-checkbox__inner::after{
        border-color:#fff;
    }
}

</style>
