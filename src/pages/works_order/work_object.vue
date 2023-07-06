<template>
    <div class="event work-object">
        <div class="w100" v-show="!firstShow">
            <div class="ub w100 search-area" style="box-sizing: border-box;">
                <SearchTop @search="searchCheck" @reset="reset">
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="类型名称：" label-width="70px">
                                <el-input placeholder="请输入" clearable v-model="get_params.name" @keyup.enter.native="searchCheck" size="small"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="类型描述：" label-width="70px">
                                <el-input placeholder="请输入" clearable v-model="get_params.des" @keyup.enter.native="searchCheck" size="small"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="创建人：" label-width="70px">
                                <el-input placeholder="请输入" clearable v-model="get_params.createUser" @keyup.enter.native="searchCheck" size="small"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="创建时间：" label-width="70px">
                                <el-date-picker
                                    size="small"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    v-model="sayTimes"
                                    style="width: 280px;"
                                    type="datetimerange"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    :default-time="['00:00:00', '23:59:59']"
                                ></el-date-picker>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </SearchTop>
            </div>
            <div class="list-container table-area">
                <div class="ub ub-pj w100" style="margin-bottom: 10px;">
                    <div class="list-tips">列表内容</div>
                    <div>
                        <el-button v-per="['work_obj_add']" icon="el-icon-plus" type="primary" size="small" @click="addDialog = true">添加类型</el-button>
                        <el-button v-per="['work_obj_del']" type="danger" size="small" @click="handleDeleteAll">刪 除</el-button>
                    </div>
                </div>
                <el-table
                    :row-class-name="tableRowClassName"
                    :height="tableHeight"
                    ref="multipleTable"
                    v-loading="loading"
                    class="bigTable full-table"
                    :data="tableData"
                    border
                    stripe
                    tooltip-effect="dark"
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column
                        align="center"
                        type="selection"
                        :selectable="
                            row => {
                                return row.type != 0
                            }
                        "
                        width="50"
                    ></el-table-column>
                    <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号"></el-table-column>
                    <el-table-column prop="name" label="类型名称" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="des" label="类型描述" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="createUserName" label="创建人" width="160"></el-table-column>
                    <!-- <el-table-column prop="createTime" label="创建日期" width="160"></el-table-column> -->
                    <el-table-column label="操作" align="center" fixed="right" class-name="deepBg" width="140">
                        <template slot-scope="scope">
                            <div>
                                <el-button v-per="['work_obj_edit']" v-if="scope.row.type == 1" type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                                <el-button v-per="['work_obj_del']" v-if="scope.row.type == 1" type="text" size="small" @click="handleDelete(scope.row)" :disabled="scope.row.typeDel == 1">删除</el-button>
                                <el-button v-if="scope.row.type == 0" disabled type="text" size="small">内置类型</el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination v-show="total_num>0" :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size" @pagination="get_data" />
            </div>
        </div>

        <!--增加类型-->
        <el-dialog title="添加类型" :visible.sync="addDialog" width="700px" custom-class="common-dialog" top="20vh">
            <el-form :model="addForm" :rules="rules" label-position="top" ref="addForm">
                <el-form-item label="类型名称：" prop="name" :label-width="formLabelWidth">
                    <el-input placeholder="请输入类型名称" clearable v-model="addForm.name" size="small"></el-input>
                </el-form-item>
                <el-form-item label="类型描述：" prop="des" :label-width="formLabelWidth">
                    <el-input type="textarea" :rows="3" placeholder="请输入描述" clearable v-model="addForm.des" size="small"></el-input>
                </el-form-item>
                <el-form-item label="字段信息：" :label-width="formLabelWidth">
                    <div class="ub ub-ac custom-form" v-for="(_it, _inx) in addForm.attrs" :key="_inx">
                        <div v-if="_inx > 0" class="del-item" style="font-size: 12px;" @click="deleteCustom(_inx)">
                            <i class="el-icon-close" style="color: #e34d59;cursor: pointer;"></i>
                            删除
                        </div>
                        <div style="width: 100%;">
                            <div style="display: flex;align-items: center;width: 91%;">
                                <el-form-item
                                    label="字段名称："
                                    label-width="60px"
                                    class="ub full-width"
                                    style="flex: 2;width: 100%;"
                                    :rules="{
                                        required: true,
                                        message: '请输入',
                                        trigger: 'blur'
                                    }"
                                    :prop="'attrs.' + _inx + '.name'"
                                >
                                    <el-input style="width: 100%;" placeholder="请输入字段名称" clearable maxlength="8" show-word-limit v-model.trim="_it.name" size="small"></el-input>
                                </el-form-item>
                                <span style="width: 32px;font-size: 24px;text-align: center;">-</span>
                                <el-form-item
                                    label="字段属性："
                                    label-width="60px"
                                    class="ub full-width"
                                    :rules="{
                                        required: true,
                                        message: '选择',
                                        trigger: 'blur'
                                    }"
                                    :prop="'attrs.' + _inx + '.type'"
                                    style="flex: 1;"
                                >
                                    <el-select v-model="_it.type" style="width: 100%;height: 32px;">
                                        <el-option
                                            v-for="(item, index) in attrTypeList"
                                            :key="index"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <template v-for="(item, index) in _it.items">
                                <el-form-item
                                    v-if="_it.type == 6 || _it.type == 7"
                                    :label="'选项-' + (index + 1) + '：'"
                                    style="vertical-align: center;"
                                    class="ub full-width"
                                    :key="item.key"
                                    label-width="60px"
                                    label-position="left"
                                    :rules="{
                                        required: true,
                                        message: '请输入',
                                        trigger: 'blur'
                                    }"
                                    :prop="'attrs.' + _inx + '.items.' + index + '.value'"
                                >
                                    <el-input style="width: 90%;" placeholder="请输入选项" clearable v-model.trim="item.value" size="small"></el-input>
                                    <i
                                        @click.stop="addSelect(_inx)"
                                        class="el-icon-circle-plus-outline"
                                        v-if="_it.items.length - 1 === index"
                                        style="display: inline-block;margin: 5px 0 0 6px;font-size: 14px;color: #0052d9;cursor: pointer;"
                                    ></i>
                                    <i
                                        @click.stop="deleteSelect(item, _inx)"
                                        v-if="index > 0"
                                        class="el-icon-remove-outline"
                                        style="display: inline-block;margin: 5px 0 0 6px;font-size: 14px;color: #0052d9;cursor: pointer;"
                                    ></i>
                                </el-form-item>
                            </template>
                        </div>
                        <!-- <div style="width: 10%;">
                            <div class="ub ub-pc">
                            </div>
                        </div> -->
                    </div>
                    <el-form-item label="" size="small">
                        <i style="font-size: 12px;color: #0052d9;cursor: pointer;" @click.stop.prevent="addCustom" class="el-icon-plus"></i>
                        <span style="font-size: 12px; color: #0052d9;cursor: pointer;" @click.stop.prevent="addCustom">添加字段信息</span>
                    </el-form-item>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm('addForm')" size="small">确 定</el-button>
                <el-button @click="addDialog = false" size="small">取 消</el-button>
            </span>
        </el-dialog>

        <!--list编辑类型-->
        <el-dialog title="编辑类型" :visible.sync="editDialog" width="700px" custom-class="common-dialog">
            <el-form :model="editForm" :rules="rules" ref="editForm" label-position="top">
                <el-form-item label="类型名称：" prop="name" :label-width="formLabelWidth">
                    <el-input placeholder="请输入类型名称" clearable v-model="editForm.name" size="small"></el-input>
                </el-form-item>
                <el-form-item label="类型描述：" prop="des" :label-width="formLabelWidth">
                    <el-input type="textarea" :rows="3" placeholder="请输入描述" clearable v-model="editForm.des" size="small"></el-input>
                </el-form-item>
                <el-form-item label="字段信息：" :label-width="formLabelWidth">
                    <div class="ub ub-ac custom-form" v-for="(_it, _inx) in editForm.attrs" :key="_inx">
                        <div v-if=" _it.typeNotice != 1 && editForm.id == 6 " class="del-item" style="font-size: 12px;" @click="deleteEditCustom(_inx)">
                            <i class="el-icon-close" style="color: #e34d59;cursor: pointer;"></i>
                            删除
                        </div>
                        <div v-if="_inx > 0&&editForm.id != 6 " class="del-item" style="font-size: 12px;" @click="deleteEditCustom(_inx)">
                            <i class="el-icon-close" style="color: #e34d59;cursor: pointer;"></i>
                            删除
                        </div>
                        <div style="width: 100%;">
                            <div style="display: flex;align-items: center;width: 91%;">
                                <el-form-item
                                    label="字段名称："
                                    class="ub full-width"
                                    style="flex: 2;width: 100%;"
                                    :rules="{
                                        required: true,
                                        message: '请输入',
                                        trigger: 'blur'
                                    }"
                                    :prop="'attrs.' + _inx + '.name'"
                                >
                                    <el-input style="width: 100%;" placeholder="请输入字段名称" clearable maxlength="8" show-word-limit v-model.trim="_it.name" size="small"></el-input>
                                </el-form-item>
                                <span style="width: 32px;font-size: 24px;text-align: center;">-</span>
                                <el-form-item
                                    label="字段属性："
                                    class="ub full-width"
                                    :rules="{
                                        required: true,
                                        message: '选择',
                                        trigger: 'blur'
                                    }"
                                    :prop="'attrs.' + _inx + '.type'"
                                    style="flex: 1;"
                                >
                                    <el-select v-model="_it.type" style="width: 100%;height: 32px;">
                                        <el-option
                                            v-for="(item, index) in attrTypeList"
                                            :key="index"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <template v-for="(item, index) in _it.items">
                                <el-form-item
                                    v-if="_it.type == 6 || _it.type == 7"
                                    :label="'选项-' + (index + 1) + '：'"
                                    style="vertical-align: center;"
                                    class="ub full-width"
                                    :key="item.key"
                                    label-position="left"
                                    :rules="{
                                        required: true,
                                        message: '请输入',
                                        trigger: 'blur'
                                    }"
                                    :prop="'attrs.' + _inx + '.items.' + index + '.value'"
                                >
                                    <el-input style="width: 90%;" placeholder="请输入选项" clearable v-model.trim="item.value" size="small"></el-input>
                                    <i
                                        @click.stop="addEditSelect(_inx)"
                                        class="el-icon-circle-plus-outline"
                                        v-if="_it.items.length - 1 === index"
                                        style="display: inline-block;margin: 5px 0 0 6px;font-size: 14px;color: #0052d9;cursor: pointer;"
                                    ></i>
                                    <i
                                        @click.stop="deleteEditSelect(item, _inx)"
                                        v-if="index > 0"
                                        class="el-icon-remove-outline"
                                        style="display: inline-block;margin: 5px 0 0 6px;font-size: 14px;color: #0052d9;cursor: pointer;"
                                    ></i>
                                </el-form-item>
                            </template>
                        </div>
                    </div>
                    <el-form-item label="" size="small">
                        <i style="font-size: 12px;color: #0052d9;cursor: pointer;" @click.stop.prevent="addEditCustom" class="el-icon-plus"></i>
                        <span style="font-size: 12px; color: #0052d9;cursor: pointer;" @click.stop.prevent="addEditCustom">添加字段信息</span>
                    </el-form-item>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitFormEdit('editForm')" size="small">确 定</el-button>
                <el-button @click="editDialog = false" size="small">取 消</el-button>
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
import { getWorkObject, saveWorkObject, deleteWorkObject } from '../../server/works_order/define.js'

export default {
    name: 'WorkObject',
    data() {
        return {
            tableHeight: document.body.clientHeight - 270,
            fileList: [],
            data_id: '',
            editItemDialog: false,
            file_num: 0,

            addDialog: false,
            addForm: {
                // id: '',
                name: '',
                des: '',
                attrs: [
                    {
                        name: '',
                        type: '1',
                        items: [
                            {
                                value: '',
                                key: '1'
                            }
                        ]
                    }
                ]
            },
            editForm: {
                id: '',
                name: '',
                des: '',
                attrs: [
                    {
                        name: '',
                        type: '1',
                        items: [
                            {
                                value: '',
                                key: '1'
                            }
                        ]
                    }
                ]
            },
            addTempItem: {
                id: '',
                poolId: '',
                content: [
                    {
                        value: '',
                        key: '1'
                    }
                ],
                createTime: ''
            },
            editTempItem: {
                id: '',
                poolId: '',
                content: '',
                createTime: ''
            },
            rules: {
                name: [
                    {
                        required: true,
                        message: '请输入名称',
                        trigger: 'blur'
                    }
                ],
                des: [
                    {
                        required: false,
                        message: '请输入描述',
                        trigger: 'blur'
                    }
                ]
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
                    label: '富文本',
                    value: '5'
                },
                {
                    label: '单选',
                    value: '6'
                },
                {
                    label: '多选',
                    value: '7'
                }
            ],
            firstShow: false,
            isOpen: false,
            inner_name: '',
            templateId: '',
            deleteItemDialog: false,
            deleteDialog: false,
            deleteId: '',
            deleteItemId: '',
            editDialog: false,
            customDialog: false,
            formLabelWidth: '82px',
            loading: false,
            total_num: 0,
            multipleSelection: [],
            itemSelection: [],
            tableData: [],
            sayTimes: [],
            get_params: {
                page: 1,
                size: 20,
                name: '',
                des: '',
                createUser: '',
                createTime: ''
                // content: "",
                // desc: "",
                // template: "",
                // creater: '',
            }
        }
    },
    watch: {
        addDialog: {
            handler(newVal, oldVal) {
                // console.log(newVal, oldVal,'---------------------')
                if (!newVal) {
                    this.$refs.addForm.resetFields()
                    this.addForm = {
                        // id: '',
                        name: '',
                        des: '',
                        attrs: [
                            {
                                name: '',
                                type: '1',
                                items: [
                                    {
                                        value: '',
                                        key: Date.now()
                                    }
                                ]
                            }
                        ]
                    }
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
            this.sayTimes = []
            this.get_params = {
                page: 1,
                size: 20,
                name: '',
                des: '',
                createUser: '',
                createTime: ''
            }
            this.get_data()
        },
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        indexInnerMethod(index) {
            return (this.get_inner_params.page - 1) * this.get_inner_params.size + index + 1
        },
        searchCheck() {
            // alert(123)
            this.get_params.page = 1
            this.get_data()
        },
        searchCheckItem() {
            this.get_inner_params.page = 1
            this.get_Item()
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
                    des: this.get_params.des,
                    createUser: this.get_params.createUser,
                    beginTime: this.sayTimes && this.sayTimes.length > 0 ? this.sayTimes[0] : '',
                    endTime: this.sayTimes && this.sayTimes.length > 0 ? this.sayTimes[1] : ''
                }
            }
            console.log(data)
            getWorkObject(data)
                .then(res => {
                    console.log('getList', res)
                    this.loading = false
                    this.total_num = res.total
                    let list = res.records
                    if (list.length > 0) {
                        list.forEach(item => {
                            let obj = {}
                            if (item.id == '5') {
                                item.type = 0
                            }
                            if (item.name == '未知资产') {
                                item.type = 0
                            }
                            if (item.id == '6') {
                                item.typeDel = 1
                            }
                            obj.id = item.id
                            obj.name = item.name
                            obj.des = item.des ? item.des : '--'
                            obj.typeDel = item.typeDel || 0
                            obj.type = item.type
                            obj.createTime = item.createTime
                            obj.attrs = item.attrs
                            obj.createUser = item.createUser ? item.createUser : '--'
                            obj.createUserName = item.createUserName ? item.createUserName : '--'
                            this.tableData.push(obj)
                        })
                    }
                })
                .catch(error => {
                    this.loading = false
                    console.log('error' + error)
                })
        },
        handleCustom(row) {
            console.log(row)
            // this.addAttrForm.id = row.id
            // this.addAttrForm.name = row.name
            // this.addAttrForm.des = row.des
            // this.addAttrForm.type = row.type + ''
            // this.addAttrForm.items = row.items
            this.customDialog = true
        },
        addCustom() {
            this.addForm.attrs.push({
                name: '',
                type: '1',
                items: [
                    {
                        value: '',
                        key: '1'
                    }
                ]
            })
        },
        addEditCustom() {
            this.editForm.attrs.push({
                name: '',
                type: '1',
                items: [
                    {
                        value: '',
                        key: '1'
                    }
                ]
            })
        },
        addSelect(inx) {
            this.addForm.attrs[inx].items.push({
                value: '',
                key: Date.now()
            })
        },
        addEditSelect(inx) {
            this.editForm.attrs[inx].items.push({
                value: '',
                key: Date.now()
            })
        },
        deleteSelect(item, inx) {
            var index = this.addForm.attrs[inx].items.indexOf(item)
            if (index !== -1) {
                this.addForm.attrs[inx].items.splice(index, 1)
            }
        },
        deleteEditSelect(item, inx) {
            var index = this.editForm.attrs[inx].items.indexOf(item)
            if (index !== -1) {
                this.editForm.attrs[inx].items.splice(index, 1)
            }
        },
        deleteCustom(inx) {
            this.addForm.attrs.splice(inx, 1)
        },
        deleteEditCustom(inx) {
            this.editForm.attrs.splice(inx, 1)
        },
        handleEdit(row) {
            console.log(row)
            this.editForm.id = row.id
            this.editForm.name = row.name
            this.editForm.des = row.des
            this.editForm.attrs = row.attrs.map(it => {
                return {
                    items: it.items
                        ? it.items.split('#').map(its => {
                            return { key: this.$uuid(), value: its }
                        })
                        : [
                            {
                                value: '',
                                key: '1'
                            }
                        ],
                    name: it.name ?? '',
                    type: it.type + '',
                    typeNotice: row.id == 6 && (it.name == '标题' || it.name == '内容') ? 1 : 0
                }
            })
            console.log(this.editForm.attrs)
            this.editDialog = true
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
                // console.log(this.deleteId)
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
            deleteWorkObject({ paramsData: data, queryData: {}})
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

        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    let data = {
                        // id: this.addForm.id,
                        name: this.addForm.name,
                        des: this.addForm.des,
                        attrs: this.addForm.attrs.map(it => {
                            return {
                                name: it.name,
                                type: it.type,
                                items: it.type == 6 || it.type == 7 ? it.items.map(item => item.value).join('#') : ''
                            }
                        })
                    }
                    saveWorkObject({ paramsData: data, queryData: {}})
                        .then(res => {
                            this.addDialog = false
                            console.log('添加成功')
                            this.$message({
                                message: '添加成功',
                                type: 'success'
                            })
                            setTimeout(() => {
                                this.get_data()
                            }, 1500)
                        })
                        .catch(error => {
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
            this.$refs[formName].validate(valid => {
                if (valid) {
                    let data = {
                        id: this.editForm.id,
                        name: this.editForm.name,
                        des: this.editForm.des,
                        attrs: this.editForm.attrs.map(it => {
                            return {
                                name: it.name,
                                type: it.type,
                                items: it.type == 6 || it.type == 7 ? it.items.map(item => item.value).join('#') : ''
                            }
                        })
                    }
                    saveWorkObject({ paramsData: data, queryData: {}})
                        .then(res => {
                            this.editDialog = false
                            console.log('编辑成功')
                            this.$message({
                                message: '编辑成功',
                                type: 'success'
                            })
                            setTimeout(() => {
                                this.get_data()
                            }, 1500)
                        })
                        .catch(error => {
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
    margin-top: 10px;
    padding: 10px;
    border: solid 1px #dadee8;
    border-radius: 4px;
    background-color: #ffffff;
    box-shadow: 0 0 8px 0 rgb(140 152 164 / 20%);
    .pagination {
        margin-top: 20px;
        text-align: right;
    }
}
.el-input.ips {
    display: block;
    width: 100%;
}
.el-link {
    cursor: pointer;
}
.drawer-pad {
    padding: 0 20px;
}
.domain-add {
    line-height: 1;
    position: relative;
    padding: 0 20px;
    color: #1cd7fa;
    .el-button {
        position: absolute;
        top: 0;
        right: 20px;
        padding: 0;
        color: #1cd7fa;
    }
}
.domain-list {
    margin: 3px 0 20px;
    padding: 20px 0 1px;
    background: rgb(0 0 0 / 30%);
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
            color: #f56c6c;
        }
    }
}
.event ::v-deep .el-range-input {
    background-color: rgb(0 0 0 / 0%);
    // color: #fff;
}
.event ::v-deep .el-range-separator {
    // color: #fff;
}
.event ::v-deep .el-form-item__label {
    padding: 0;
}
.event ::v-deep .el-upload-list__item-name {
    color: #01e9ff;
    i {
        color: #01e9ff;
    }
}
.event ::v-deep .el-input .el-input__count .el-input__count-inner {
    background: transparent;
}
.event ::v-deep .custom-form {
    position: relative;
    margin-bottom: 10px;
    padding: 20px 10px;
    border: solid 1px #dddddd;
    border-radius: 4px;
    background-color: rgb(56 125 238 / 2%);
    .el-input__inner {
        height: 32px;
    }
    .full-width {
        margin-bottom: 0;
        .el-form-item__label {
            width: 80px;
            font-size: 12px;
            line-height: 32px;
        }
        .el-form-item__content {
            flex: 1;
        }
    }
    .del-item {
        position: absolute;
        top: 0;
        right: 0;
        width: 66px;
        height: 24px;
        border: solid 1px #dddddd;
        border-top: none;
        border-right: none;
        border-radius: 0 0 0 10px !important;
        text-align: center;
        color: #e34d59 !important;
        cursor: pointer;
        line-height: 24px;
    }
}
.custom-star .event ::v-deep .custom-form {
    border: solid 1px#1cd7fa;
    box-shadow: inset 0 0 7px 0
        #389bf7;
}
</style>
<style></style>
