<template>
    <div class="list">
        <div class="tab-button ub" style="background:#fff;padding:0 10px">
            <div class="work-btn" @click="tabClick('1')" :class="{'tab-active': currentTab === '1'}">类型管理</div>
            <div class="draft-btn" @click="tabClick('2')" :class="{'tab-active': currentTab === '2'}">属性管理</div>
            <div class="draft-btn" @click="tabClick('3')" :class="{'tab-active': currentTab === '3'}">标签管理</div>
        </div>
        <div v-if="currentTab === '1'" class="list-container" key="key1" style="background:#fff;padding: 10px;margin-top:-1px;border:none;box-shadow:none;margin-bottom:10px;border-top-left-radius:0;border-top-right-radius:0;">
            <div class="ub ub-pj w100 mb-1 ub-ac">
                <div class="list-tips">类型管理</div>
                <div>
                    <el-button icon="el-icon-plus" size="small" type="primary" @click="addTypeDialog = true" v-per="['assets_deviceType_add']">添加类型</el-button>
                </div>
            </div>
            <div class="safe-event">
                <el-table
                    ref="multipleTable"
                    v-loading="loading"
                    class='bigTable'
                    :data="tableData"
                    border
                    stripe
                    :height="tabHeight + 34"
                    :row-class-name="tableRowClassName"
                    tooltip-effect="dark"
                    row-key="id"
                    default-expand-all
                    :tree-props="{children:'children', hasChildren: 'hasChildren'}"
                    :row-style="{ height: '32px' }"
                    :header-row-style="{ height: '32px' }"
                    @selection-change="handleSelectionChange">
                    <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                    </el-table-column>
                    <el-table-column prop="name" label="类别名称">
                    </el-table-column>
                    <el-table-column prop="des" label="备注">
                        <template slot-scope="scope">
                            <div>
                                <span v-if="scope.row.des">{{scope.row.des}}</span>
                                <span v-else>--</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="120">
                        <template slot-scope="scope">
                            <el-button :disabled="scope.row.type == 0" @click="handleEdit(scope.row)" type="text" size="small" :style="{'color':scope.row.type != 0?'#0052d9':'rgba(0, 0, 0, 0.4)'}" v-per="['assets_deviceType_edit']">编辑</el-button>
                            <el-button :disabled="scope.row.type == 0" v-if="scope.row.children && scope.row.children.length>0" @click="handleDelete_group(scope.row)" type="text" size="small" :style="{'color':scope.row.type != 0?'#0052d9':'rgba(0, 0, 0, 0.4)'}">删除组</el-button>
                            <el-button :disabled="scope.row.type == 0" v-if="!scope.row.children || scope.row.children.length===0"  @click="handleDelete(scope.row)" type="text" size="small" :style="{'color':scope.row.type != 0?'#0052d9':'rgba(0, 0, 0, 0.4)'}" v-per="['assets_deviceType_del']">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div v-if="currentTab === '2'" class="list-container" key="key2" style="background:#fff;padding: 10px;margin-top:-1px;border:none;box-shaow:none;margin-bottom:10px;border-top-left-radius:0;border-top-right-radius:0;">
            <div class="ub ub-pj w100 mb-1 ub-ac">
                <div class="list-tips">属性管理</div>
                <div>
                    <el-button icon="el-icon-plus" size="small" type="primary" @click="addAttrDialog = true" v-per="['assets_attribute_add']">添加属性</el-button>
                </div>
            </div>
            <div class="safe-event">
                <el-table
                    ref="multipleTable"
                    v-loading="loading_attr"
                    class='bigTable'
                    :data="tableDataAttr"
                    :row-class-name="tableRowClassName"
                    border
                    stripe
                    tooltip-effect="dark"
                    :height="tabHeight"
                    :row-style="{ height: '32px' }"
                    :header-row-style="{ height: '32px' }"
                    @selection-change="handleSelectionChange">
                    <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                    </el-table-column>
                    <el-table-column prop="name" label="属性名称" width="200" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="status" label="系统属性" width="80" align="center">
                        <template slot-scope="{row}">
                            <span class="sys-attr" v-if="row.status == 1" style="color: #0052d9">是</span>
                            <span v-if="row.status == 0" style="color: #8e8e8e">否</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="type" label="属性类型" width="80">
                        <template slot-scope="{row}">
                            <div>
                                <span v-if="row.type == 1">字符串</span>
                                <span v-if="row.type == 2">数字</span>
                                <span v-if="row.type == 3">日期</span>
                                <span v-if="row.type == 4">时间</span>
                                <span v-if="row.type == 5">IP</span>
                                <span v-if="row.type == 6">密码</span>
                                <span v-if="row.type == 7">富文本</span>
                                <span v-if="row.type == 8">单选</span>
                                <span v-if="row.type == 9">多选</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="typeName" label="资产类型">
                        <template slot-scope="{row}">
                            <p v-if="row.status == 1" style="font-size: 12px;">全部</p>
                            <p v-else>
                                <!--eslint-disable-->
                                <el-tag v-if="row.typeName !== ''" type="success" size="mini" v-for="(item,index) in row.typeName.split(',')" :key="index">{{item}}</el-tag>
                                <!--eslint-disable-->
                            </p>
                        </template>
                    </el-table-column>
                    <el-table-column prop="des" label="属性描述" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="120">
                        <template slot-scope="scope">
                            <el-button @click="handleEditAttr(scope.row)" size="small" type="text" v-per="['assets_attribute_edit']">编辑</el-button>
                            <el-button @click="handleDeleteAttr(scope.row)" size="small" type="text" v-per="['assets_attribute_del']">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size" @pagination="get_data_attr" style="padding-top:10px" v-show="total_num>0"/>
            </div>
        </div>
        <component v-if="currentTab === '3'" is="asset_label"></component>
        <!--类型管理-->
        <el-dialog title="添加资产类别" :visible.sync="addTypeDialog" width="700px" custom-class="common-dialog">
            <el-form :model="addTypeForm" :rules="rules" ref="addTypeForm" label-position="top">
                <el-form-item label="选择类别：" prop="id" label-width="80px">
                    <el-select style="width:100%;" ref="add-select" placeholder="请选择" v-model="addTypeForm.id" size="small">
                        <el-option label="作为顶级类型" value="null" style="margin-left: 5px"></el-option>
                        <el-option :label="innerLabel" :value="innerValue" style="overflow:scroll;height: 200px">
                            <el-tree ref="tree_add" node-key="id" :default-expand-all="true" :highlight-current="true" :data="treeData" :props='propsData' @node-click="handleNodeClick" :check-strictly="true" :expand-on-click-node="false" :indent='indent'>
                                <span class="custom-tree-node" slot-scope="{ node, data }">
                                    <span style="font-size:12px;">{{ node.label }}</span>
                                </span>
                            </el-tree>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="类别名称：" label-width="80px" label-position="left" prop="name">
                    <el-input style="width:100%;" placeholder="请输入类别名称" clearable v-model="addTypeForm.name" size="small"></el-input>
                </el-form-item>
                <el-form-item style="margin-bottom: 40px;" label="备 注：" label-width="80px" label-position="left" prop="des">
                    <el-input style="width:100%;" type="textarea" :rows="3" placeholder="请输入" clearable v-model="addTypeForm.des" size="small"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addTypeDialog = false" size="small">取消</el-button>
                <el-button @click="submitAddType('addTypeForm')" size="small" type="primary">确定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="编辑资产类别" :visible.sync="editTypeDialog" width="700px" custom-class="common-dialog">
            <el-form :model="editForm" :rules="edit_rules" ref="editForm" label-position="top">
                <el-form-item label="选择类别：" prop="type" label-width="80px">
                    <el-select style="width:100%;" ref="edit-select" placeholder="请选择" v-model="editForm.id" size="small">
                        <el-option label="作为顶级类型" value="null"></el-option>
                        <el-option :label="editLabel" :value="editValue" style="overflow:scroll;height: 200px">
                            <el-tree ref="tree_addUser" node-key="id" :default-expand-all="true" :highlight-current="true" :data="treeData" :props='propsData' @node-click="handleNodeClick_edit" :check-strictly="true" :expand-on-click-node="false" :indent='indent'>
                                <span class="custom-tree-node" slot-scope="{ node, data }">
                                    <span style="font-size:12px;">{{ node.label }}</span>
                                </span>
                            </el-tree>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="类别名称：" label-width="80px" prop="name" label-position="left">
                    <el-input style="width:100%;" placeholder="请输入类别名称" clearable v-model="editForm.name" size="small"></el-input>
                </el-form-item>
                <el-form-item style="margin-bottom: 40px;" prop="des" label="备 注：" label-width="80px" label-position="left">
                    <el-input style="width:100%;" type="textarea" :rows="3" placeholder="请输入" clearable v-model="editForm.des" size="small"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editTypeDialog = false" size="small">取消</el-button>
                <el-button @click="submitEditType('editForm')" size="small" type="primary">确定</el-button>
            </span>
        </el-dialog>

        <!--删除-->
        <DeleteDialog
            :dialogVisible = del_itemDialog
            @delete="delete_success"
            @cancel="del_itemDialog = false">
        </DeleteDialog>
        <!--删除组-->
        <DeleteDialog
            :dialogVisible = del_groupDialog
            @delete="delete_group_success"
            @cancel="del_groupDialog = false">
        </DeleteDialog>
        <!--属性管理-->
        <el-dialog title="添加属性" :visible.sync="addAttrDialog" width="700px" custom-class="common-dialog">
            <el-form :model="addAttrForm" :rules="rules_attr" ref="addAttrForm" label-position="top">
                <el-form-item label="属性名称：" label-width="120px" label-position="left" prop="name">
                    <el-input
                        placeholder="请输入类别名称"
                        clearable
                        maxlength="8"
                        show-word-limit
                        v-model.trim="addAttrForm.name"
                        size="small"></el-input>
                </el-form-item>
                <el-form-item label="系统属性：" label-width="120px" label-position="left" prop="status" style="margin-bottom: 10px">
                    <el-radio-group v-model="addAttrForm.status">
                        <el-radio label="1">是</el-radio>
                        <el-radio label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="addAttrForm.status != 1" label="资产类型：" label-width="120px" label-position="left" prop="typeIds">
                    <el-select :multiple="true" size="small" v-model="addAttrForm.typeIds" clearable placeholder="请选择" filterable>
                        <el-option v-for="(item,index) in deviceTypeList" :label="item.name" :value="item.id" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="属性类型：" label-width="120px" label-position="left" prop="type" style="margin-bottom: 10px">
                    <el-radio-group v-model="addAttrForm.type">
                        <el-radio style="padding: 6px 0;" v-for="(item, index) in attrTypeList" :key="index" :label="item.value">{{item.label}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                    v-if="addAttrForm.type == 8 || addAttrForm.type == 9"
                    v-for="(item, index) in addAttrForm.items"
                    :label="'选项-' + (index+1)+ '：'"
                    style="vertical-align: center"
                    :key="item.key"
                    label-width="120px"
                    label-position="left"
                    :rules="{
                        required: true, message: '请输入', trigger: 'blur'
                    }"
                    :prop="'items.' + index + '.value'">
                    <el-input style="width:90%;"  placeholder="请输入选项" clearable v-model.trim="item.value" size="small"></el-input>
                    <i
                        @click.stop="addSelect"
                        class="el-icon-plus"
                        v-if="addAttrForm.items.length -1 === index"
                        style="cursor: pointer;font-size:14px;color:#1cd7fa;display: inline-block;margin:5px 0 0 6px"></i>
                    <i
                        @click.stop="deleteSelect(item)"
                        v-if="index > 0"
                        class="el-icon-close"
                        style="cursor: pointer;font-size:14px;color:#1cd7fa;display: inline-block;margin:5px 0 0 6px"></i>
                </el-form-item>
                <el-form-item style="margin-bottom: 40px;" label="属性描述：" label-width="120px" label-position="left" prop="des">
                    <el-input type="textarea" :rows="3" placeholder="请输入描述" clearable v-model="addAttrForm.des" size="small"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="addAttrDialog = false">取消</el-button>
                <el-button size="small" type="primary" @click="submitAddAttr('addAttrForm')">确定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="编辑属性" :visible.sync="editAttrDialog" width="700px" custom-class="common-dialog">
            <el-form :model="editAttrForm" :rules="rules_attr" ref="editAttrForm" label-position="top">
                <el-form-item label="属性名称：" label-width="120px" label-position="left" prop="name">
                    <el-input
                        placeholder="请输入类别名称"
                        clearable
                        maxlength="8"
                        show-word-limit
                        v-model.trim="editAttrForm.name"
                        size="small"></el-input>
                </el-form-item>
                <el-form-item label="系统属性：" label-width="120px" label-position="left" prop="status" style="margin-bottom: 10px">
                    <el-radio-group v-model="editAttrForm.status">
                        <el-radio label="1" :disabled="!editAttrForm.edit">是</el-radio>
                        <el-radio label="0" :disabled="!editAttrForm.edit">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="editAttrForm.status != 1" label="资产类型：" label-width="120px" label-position="left" prop="typeIds">
                    <el-select :disabled="!editAttrForm.edit" :multiple="true" size="small" v-model="editAttrForm.typeIds" clearable placeholder="请选择" filterable style="width: 100%">
                        <el-option v-for="(item,index) in deviceTypeList" :label="item.name" :value="item.id" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="属性类型：" label-width="120px" label-position="left" prop="type" style="margin-bottom: 10px">
                    <el-radio-group v-model="editAttrForm.type">
                        <el-radio :disabled="!editAttrForm.edit" style="padding: 6px 0;" v-for="(item, index) in attrTypeList" :key="index" :label="item.value">{{item.label}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                    v-if="editAttrForm.type == 8 || editAttrForm.type == 9"
                    v-for="(item, index) in editAttrForm.items"
                    :label="'选项-' + (index+1)+ '：'"
                    style="vertical-align: center"
                    :key="item.key"
                    label-width="120px"
                    label-position="left"
                    :rules="{
                        required: true, message: '请输入', trigger: 'blur'
                    }"
                    :prop="'items.' + index + '.value'">
                    <el-input :disabled="!editAttrForm.edit" placeholder="请输入选项" clearable v-model.trim="item.value" size="small" style="width:93%"></el-input>
                    <i
                        @click.stop="addEditSelect"
                        class="el-icon-plus"
                        v-if="editAttrForm.items.length -1 === index && editAttrForm.edit"
                        style="cursor: pointer;font-size:14px;color:#387dee;display: inline-block;margin:5px 0 0 6px"></i>
                    <i
                        @click.stop="deleteEditSelect(item)"
                        v-if="index > 0 && editAttrForm.edit"
                        class="el-icon-close"
                        style="cursor: pointer;font-size:14px;color:#387dee;display: inline-block;margin:5px 0 0 6px"></i>
                </el-form-item>
                <el-form-item style="margin-bottom: 40px;" label="属性描述：" label-width="120px" label-position="left" prop="des">
                    <el-input type="textarea" :rows="3" placeholder="请输入描述" clearable v-model="editAttrForm.des" size="small"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editAttrDialog = false" size="small">取消</el-button>
                <el-button @click="submitEditAttr('editAttrForm')" size="small" type="primary">确定</el-button>
            </span>
        </el-dialog>

        <DeleteDialog
            :dialogVisible = delAttrDialog
            @delete="delete_attr_success"
            @cancel="delAttrDialog = false">
        </DeleteDialog>
    </div>
</template>

<script>
import {
    getDeviceTypeTree,
    saveDeviceType,
    updateDeviceType,
    delDeviceType,
    get_attr_list,
    save_attr,
    update_attr,
    delete_attr,
    get_device_attr
} from '../../server/assets/api.js'
import asset_label from './asset_label'
export default {
    name: 'AssetType',
    components: {
        asset_label
    },
    data() {
        return {
            tabHeight: document.body.clientHeight - 218,
            normalizer(node) {
                return {
                    id: node.id,
                    label: node.name,
                    children: node.sub
                }
            },
            one_ip: '',
            loading: false,
            loading_attr: false,
            total_num: 0,
            indent: 5,
            multipleSelection: [],
            innerLabel: '',
            innerValue: '',
            editLabel: '',
            editValue: '',
            propsData: {
                children: 'sub',
                label: 'name'
            },
            recordId: '',
            recordType: '',
            del_groupDialog: false,
            del_itemDialog: false,
            addTypeDialog: false,
            editTypeDialog: false,
            addAttrDialog: false,
            editAttrDialog: false,
            delAttrDialog: false,
            tableData: [],
            treeData: [],
            addTypeForm: {
                id: '',
                name: '',
                des: '',
                parentId: ''

            },
            editForm: {
                recordId: '',
                id: '',
                name: '',
                des: '',
                parentId: ''
            },
            attrTypeList: [
                {
                    label: '字符串',
                    value: '1'
                },
                {
                    label: '数字',
                    value: '2'
                },
                {
                    label: '日期',
                    value: '3'
                },
                {
                    label: '日期+时间',
                    value: '4'
                },
                {
                    label: 'IP',
                    value: '5'
                },
                {
                    label: '密码',
                    value: '6'
                },
                {
                    label: '富文本',
                    value: '7'
                },
                {
                    label: '单选',
                    value: '8'
                },
                {
                    label: '多选',
                    value: '9'
                }
            ],
            addAttrForm: {
                id: '',
                name: '',
                des: '',
                status: '1',
                type: '1',
                field: '',
                typeIds: [],
                items: [
                    {
                        value: '',
                        key: '1'
                    }
                ]
            },
            editAttrForm: {
                id: '',
                name: '',
                des: '',
                status: '1',
                type: '1',
                field: '',
                typeIds: [],
                edit: '',
                items: [
                    {
                        value: '',
                        key: '1'
                    }
                ]
            },
            tableDataAttr: [],
            recordAttrId: '',
            oldParent: '', // 回显id
            rules: {
                name: {
                    required: true,
                    message: '请输入类别名称',
                    trigger: 'blur'
                },
                id: {
                    required: true,
                    message: '请选择类别',
                    trigger: 'change'
                }
            },
            deviceTypeList: [],
            rules_attr: {
                name: {
                    required: true,
                    message: '请输入',
                    trigger: 'blur'
                },
                status: {
                    required: true,
                    message: '请选择',
                    trigger: 'change'
                },
                typeIds: {
                    required: true,
                    message: '请选择',
                    trigger: 'change'
                },
                type: {
                    required: true,
                    message: '请选择',
                    trigger: 'change'
                }
            },
            edit_rules: {
                name: {
                    required: true,
                    message: '请输入类别名称',
                    trigger: 'blur'
                },
                id: {
                    required: true,
                    message: '请选择类别',
                    trigger: 'change'
                }
            },
            currentTab: '1',
            get_params: {
                page: 1,
                size: 20
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.get_data()
            this.get_attr_device()
        })
    },
    watch: {
        addTypeDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.addTypeForm.resetFields()
                    this.addTypeForm = {
                        id: '',
                        name: '',
                        des: '',
                        parentId: ''
                    }
                }
            },
            deep: true
        },
        addAttrDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.addAttrForm.resetFields()
                    this.addAttrForm.items = [
                        {
                            value: '',
                            key: '1'
                        }
                    ]
                }
            }
        },
        editAttrDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.editAttrForm.resetFields()
                }
            }
        }
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
        tabClick(val = '1') {
            this.currentTab = val
            if (val === '1') {
                this.get_data()
            } else {
                this.get_data_attr()
            }
        },

        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        submitAddType(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // this.addTypeDialog = false
                    this.handleSuccess()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        submitEditType(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // this.editTypeDialog = false;
                    this.editSuccess()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        submitAddAttr(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.handleAddAttr()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        submitEditAttr(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.handleEditAttrSuccess()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        handleNodeClick(node) {
            console.log(node)
            // this.depId = node.id;
            this.innerValue = node.id
            this.addTypeForm.parentId = node.id
            this.addTypeForm.id = node.id
            this.innerLabel = node.name
            this.$refs['add-select'].blur()
        },
        handleNodeClick_edit(node) {
            console.log(node)
            // this.depId = node.id;
            this.editValue = node.id
            this.editForm.parentId = node.id
            this.editForm.id = node.id
            this.editLabel = node.name
            this.$refs['edit-select'].blur()
        },
        addSelect() {
            this.addAttrForm.items.push({
                value: '',
                key: Date.now()
            })
        },
        deleteSelect(item) {
            var index = this.addAttrForm.items.indexOf(item)
            if (index !== -1) {
                this.addAttrForm.items.splice(index, 1)
            }
        },
        addEditSelect() {
            this.editAttrForm.items.push({
                value: '',
                key: Date.now()
            })
        },
        deleteEditSelect(item) {
            var index = this.editAttrForm.items.indexOf(item)
            if (index !== -1) {
                this.editAttrForm.items.splice(index, 1)
            }
        },

        get_data() {
            this.loading = true
            this.tableData = []
            getDeviceTypeTree({}).then(res => {
                console.log(res)
                this.treeData = JSON.parse(JSON.stringify(res))
                this.loading = false
                this.deepData(res) // 新增 children
                this.tableData = res
            }).catch(error => {
                this.loading = false
                console.log('error' + error)
            })
        },
        get_attr_device() {
            get_device_attr({}).then(res => {
                this.deviceTypeList = res
            }).catch(err => {
                console.log(err)
            })
        },
        get_data_attr() {
            this.loading_attr = true
            this.tableDataAttr = []
            let data = {
                queryData: {
                    page: this.get_params.page,
                    pageSize: this.get_params.size
                },
                paramsData: {
                }
            }
            get_attr_list(data).then(res => {
                console.log(res)
                this.total_num = res.total
                let list = res.records
                this.loading_attr = false
                if (list.length) {
                    list.forEach(item => {
                        let obj = {}
                        obj.createTime = item.createTime
                        obj.des = item.des
                        obj.field = item.field
                        obj.id = item.id
                        obj.name = item.name
                        obj.status = item.status
                        obj.edit = item.edit
                        obj.type = item.type
                        if (item.items && item.items.length) {
                            obj.items = item.items.map((it, inx) => {
                                return {
                                    key: inx,
                                    value: it
                                }
                            })
                        } else {
                            obj.items = [
                                {
                                    value: '',
                                    key: '1'
                                }
                            ]
                        }
                        obj.typeName = item.typeName
                        obj.typeIds = item.typeIds ? item.typeIds.split(',') : []
                        obj.typeIds = item.status == 1 ? [] : obj.typeIds
                        this.tableDataAttr.push(obj)
                    })
                }
            }).catch(error => {
                this.loading_attr = false
                console.log('error' + error)
            })
        },
        handleAddAttr() {
            let data = {
                name: this.addAttrForm.name,
                status: this.addAttrForm.status,
                type: this.addAttrForm.type,
                des: this.addAttrForm.des,
                typeIds: this.addAttrForm.status != 1 ? this.addAttrForm.typeIds : [],
                items: (this.addAttrForm.type == 8 || this.addAttrForm.type == 9) ? this.addAttrForm.items.map(item => item.value) : []
            }
            save_attr(data).then(res => {
                this.addAttrDialog = false
                this.$message({
                    type: 'success',
                    message: '添加属性成功'
                })
                setTimeout(() => {
                    this.get_data_attr()
                }, 1500)
            }).catch(err => {
                // this.addAttrDialog = false
                console.log(err + 'err')
            })
        },
        handleEditAttrSuccess() {
            let data = {
                id: this.editAttrForm.id,
                name: this.editAttrForm.name,
                status: this.editAttrForm.status,
                type: this.editAttrForm.type,
                des: this.editAttrForm.des,
                typeIds: this.editAttrForm.status != 1 ? this.editAttrForm.typeIds : [],
                items: (this.editAttrForm.type == 8 || this.editAttrForm.type == 9) ? this.editAttrForm.items.map(item => item.value) : []
            }
            update_attr(data).then(res => {
                this.editAttrDialog = false
                this.$message({
                    type: 'success',
                    message: '编辑属性成功'
                })
                setTimeout(() => {
                    this.get_data_attr()
                }, 1500)
            }).catch(err => {
                // this.editAttrDialog = false
                console.log(err + 'err')
            })
        },
        deepData(data) {
            if (data.length > 0) {
                data.forEach(item => {
                    if (item.sub) {
                        item.children = item.sub
                        this.deepData(item.children)
                    }
                })
            }
        },
        handleSuccess() {
            (this.addTypeForm.id === 'null') && (this.addTypeForm.id = null)
            let data = {
                name: this.addTypeForm.name,
                des: this.addTypeForm.des,
                parentId: this.addTypeForm.id
            }
            saveDeviceType(data).then(res => {
                this.addTypeDialog = false
                this.$message({
                    type: 'success',
                    message: '添加类型成功'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(err => {
                console.log(err + 'err')
            })
        },
        editSuccess() {
            (this.editForm.id === 'null') && (this.editForm.id = null)
            let data = {
                id: this.editForm.recordId,
                name: this.editForm.name,
                des: this.editForm.des
            }
            data.parentId = this.editForm.id === this.oldParent ? this.editForm.parentId : this.editForm.id
            updateDeviceType(data).then(res => {
                this.editTypeDialog = false
                this.$message({
                    type: 'success',
                    message: '编辑类型成功'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(err => {
                this.editTypeDialog = false
                console.log(err + 'err')
            })
        },
        handleEdit(row) {
            this.recordType = row.type
            this.oldParent = row.parentName
            this.editForm.id = row.parentName ? row.parentName : 'null'
            this.editForm.recordId = row.id
            this.editForm.parentId = row.parentId
            this.editForm.name = row.name
            this.editForm.des = row.des
            if (this.recordType === 0) {
                this.$message({
                    type: 'warning',
                    message: '内置类型不能编辑'
                })
            } else {
                this.editTypeDialog = true
            }
        },
        handleDelete(row) {
            this.recordType = row.type
            this.recordId = row.id
            if (this.recordType === 0) {
                this.$message({
                    type: 'warning',
                    message: '内置类型不能删除'
                })
            } else {
                this.del_itemDialog = true
            }
        },
        handleEditAttr(row) {
            console.log(row)
            this.editAttrForm.id = row.id
            this.editAttrForm.name = row.name
            this.editAttrForm.des = row.des
            this.editAttrForm.status = row.status + ''
            this.editAttrForm.edit = row.edit
            this.editAttrForm.type = row.type + ''
            this.editAttrForm.typeIds = row.typeIds
            this.editAttrForm.items = row.items
            this.editAttrDialog = true
        },
        handleDeleteAttr(row) {
            this.recordAttrId = row.id
            this.delAttrDialog = true
        },
        delete_attr_success() {
            let obj = {
                ids: [this.recordAttrId]
            }
            delete_attr(obj).then(res => {
                this.delAttrDialog = false
                this.$message({
                    type: 'success',
                    message: '删除成功'
                })
                setTimeout(() => {
                    this.get_data_attr()
                }, 1500)
            }).catch(err => {
                this.delAttrDialog = false
                console.log(err + 'err')
            })
        },
        delete_success() {
            let obj = {
                id: this.recordId
            }
            delDeviceType(obj).then(res => {
                this.del_itemDialog = false
                this.$message({
                    type: 'success',
                    message: '删除成功'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(err => {
                this.del_itemDialog = false
                console.log(err + 'err')
            })
        },
        handleDelete_group(row) {
            this.recordType = row.type
            this.recordId = row.id
            if (this.recordType === 0) {
                this.$message({
                    type: 'warning',
                    message: '内置类型不能删除'
                })
            } else {
                this.del_groupDialog = true
            }
        },
        delete_group_success() {
            let obj = {
                id: this.recordId
            }
            delDeviceType(obj).then(res => {
                this.del_groupDialog = false
                this.$message({
                    type: 'success',
                    message: '删除成功'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(err => {
                this.del_groupDialog = false
                console.log(err + 'err')
            })
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
            console.log(this.multipleSelection) // create_id:
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

<style scoped lang="scss">
    .el-select-dropdown__item:hover{
        background:none;
    }
    .el-select-dropdown__item{
        background:none;
    }
    .tab-button {
        height: 30px;
        background-color: rgba(19,109,172,.2);
        margin-bottom: 2px;
        border-radius: 4px;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        & div {
            width: 80px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            margin-right: 10px;
            cursor: pointer;
            // background: url("../../assets/img/tab_btn.jpg") 100% 100% no-repeat;
            color: rgba(0,0,0,.6);
            box-sizing: border-box;
            font-size: 14px;
            &.tab-active {
                color: #387dee;
                border-bottom:1px solid #387dee;
            }
        }
    }
    .attendance-list{
        margin-top: 0;
    }
    .attendance-list:before {
        top:-1px;
        width: 90px;
        height: 28px;
        // background-image: url('/static/img/list-title.png');
        background-size:100%;
    }
    .container ::v-deep .dialog-footer div:nth-child(2) .top_light {
        background: none;
    }
    .container ::v-deep .dialog-footer div:nth-child(2) .bottom_light {
        background: none;
    }
    .container ::v-deep .el-icon-arrow-right {
        color: #1cd7fa;
    }
    .el-select-dropdown__item.selected {
        font-weight: normal;
    }
    .tree_dropdown .el-select-dropdown__item.hover span {
        color: #fff;
    }
    .el-tree {
        background: rgba(0, 0, 0, 0);
    }
    .tree_dropdown .el-select-dropdown__item.hover span {
        color: #fff;
    }
    .container ::v-deep .disBtn {
        color: #666;
    }
    .safe-event ::v-deep  .el-tag.el-tag--success {
        background-color: rgba(56, 125, 238, 0.2) !important;
        color: #387dee !important;
        border: solid 1px rgba(56, 125, 238,.4) !important;
    }
    .event  ::v-deep  .el-input .el-input__count .el-input__count-inner {
        background: transparent;
    }
</style>
