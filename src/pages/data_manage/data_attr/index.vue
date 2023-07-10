<template>
    <div class="event w100">
        <SearchTop @search="searchAssets" @reset="reserFun">
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params">
                    <el-form-item label="属性名称：" label-width="80px">
                        <el-input placeholder="请输入" clearable v-model="get_params.attrName" size="small"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params">
                    <el-form-item label="字段名称：" label-width="90px">
                        <el-input placeholder="请输入" clearable v-model="get_params.fieldName" size="small"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params">
                    <el-form-item label="属性类型：" label-width="90px">
                        <el-select style="width:100%"  v-model="get_params.type" placeholder="请选择" size="small" clearable>
                            <el-option v-for="(item, index) in attrTypeList" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params">
                    <el-form-item label="是否数组：" label-width="90px">
                        <el-select style="width:100%"  v-model="get_params.isArray" placeholder="请选择" size="small" clearable>
                            <el-option label="是" :value="1"></el-option>
                            <el-option label="否" :value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-col>
        </SearchTop>
        <div class="list-container">
            <div class="ub ub-pj w100 mb-1">
                <div class="list-tips">数据属性</div>
                <div>
                    <el-button v-per="['data_field_add']" size="small" icon="el-icon-plus" type="primary" @click="addDialog = true">新 建</el-button>
                    <el-upload
                        :action="action"
                        :headers="header"
                        name="file"
                        accept=".access"
                        :file-list="fileList"
                        :show-file-list="false"
                        :on-success="handleSuccess"
                        style="display: inline-block;margin:0 10px">
                        <el-button v-per="['data_field_import']" size="small" icon="iconfont icon-daoru" type="primary">导 入</el-button>
                    </el-upload>
                    <el-button v-per="['data_field_export']" size="small" icon="iconfont icon-daochu" type="primary" @click="handleDownLoad">导 出</el-button>
                    <el-button  v-per="['data_field_del']" size="small" icon="el-icon-delete" type="danger" @click="deleteAll">刪 除</el-button>

                    <!-- <addBtn icon="el-icon-plus" title="新 建" @click="addDialog = true" />
                    <el-upload
                        :action="action"
                        name="file"
                        accept=".access"
                        :file-list="fileList"
                        :show-file-list="false"
                        :on-success="handleSuccess"
                        style="display: inline-block;margin:0 10px">
                        <add-btn icon="iconfont icon-daoru" title="导 入" />
                    </el-upload>
                    <add-btn style="margin-right: 10px" icon="iconfont icon-daochu" @click="handleDownLoad" title="导 出" />
                    <deleteBtn icon="el-icon-delete" title="刪 除" @click="deleteAll" /> -->
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
                :height="tableHeight"
                :row-style="{ height: '32px' }"
                :header-row-style="{ height: '32px' }">
                <el-table-column type="selection" width="50" align="center"></el-table-column>
                <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                </el-table-column>
                <el-table-column prop="name" label="属性名称" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="code" label="字段名称" width="200">
                </el-table-column>
                <el-table-column prop="type" label="属性类型" width="100" align="center">
                    <template slot-scope="{row}">
                        <div>
                            <span v-if="row.type==1">字符</span>
                            <span v-if="row.type==2">数字</span>
                            <span v-if="row.type==3">时间</span>
                            <span v-if="row.type==4">IP</span>
                            <span v-if="row.type==5">枚举</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="isDefault" label="是否数组" width="80" align="center">
                    <template slot-scope="{row}">
                        <div>
                            <span v-if="row.isArray===0">否</span>
                            <span v-if="row.isArray===1">是</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="detail" label="描述" show-overflow-tooltip>
                    <template slot-scope="{row}">
                        <div>
                            <span> {{row.detail}} </span>
                            <!-- <span v-if="row.detail">{{row.detail}}</span>
                            <span v-else>--</span> -->
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="isDefault" label="是否内置" width="80" align="center">
                    <template slot-scope="{row}">
                        <div>
                            <span v-if="row.isDefault===0">否</span>
                            <span v-if="row.isDefault===1">是</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="handleSee(scope.row)">查看</el-button>
                        <el-button v-per="['data_field_edit']" type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button v-per="['data_field_del']" :disabled="scope.row.isDefault === 1" type="text" size="small" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="total_num>0" :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size" @pagination="get_data" />
        </div>
        <el-dialog title="查看" :visible.sync="seeDialog" width="700px" custom-class="common-dialog">
            <div style="width:100%;margin: 0 auto;">
                <el-descriptions class="margin-top" title="" :column="1" size="mini" border>
                    <el-descriptions-item>
                        <template slot="label">
                            属性名称
                        </template>
                        {{seeForm.name}}
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template slot="label">
                            字段名称
                        </template>
                        {{ seeForm.code }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template slot="label">
                            属性类型
                        </template>
                        <div>
                            <span v-if="seeForm.type==1">字符</span>
                            <span v-if="seeForm.type==2">数字</span>
                            <span v-if="seeForm.type==3">时间</span>
                            <span v-if="seeForm.type==4">IP</span>
                            <span v-if="seeForm.type==5">枚举</span>
                        </div>
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template slot="label">
                            枚举值
                        </template>
                        {{seeForm.enums}}
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template slot="label">
                            是否数组
                        </template>
                        <div>
                            <span v-if="seeForm.isArray===0">否</span>
                            <span v-if="seeForm.isArray===1">是</span>
                        </div>
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template slot="label">
                            描述
                        </template>
                        {{seeForm.detail}}
                    </el-descriptions-item>
                </el-descriptions>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="seeDialog = false">取消</el-button>
            </span>
        </el-dialog>

        <el-dialog title="新建属性" :visible.sync="addDialog" width="700px" custom-class="common-dialog">
            <div style="width:100%;margin: 0 auto;">
                <el-form label-width="80px" label-position="top" :rules="rules" ref="addForm" :model="addForm">
                    <el-row :gutter="40">
                        <el-col :span="12">
                            <el-form-item label="属性名称：" prop="name">
                                <el-input v-model="addForm.name" placeholder="请输入" style="width: 100%" size="small" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="属性类型：" prop="type">
                                <el-select v-model="addForm.type" placeholder="请选择" size="small" style="width: 100%">
                                    <el-option v-for="(item, index) in attrTypeList" :key="index" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item v-if="addForm.type == 5" label="枚举值：" prop="enum">
                        <el-input v-model="addForm.enum" placeholder="请输入不同枚举值，多个值以 ',' 隔开" style="width: 100%" :maxlength="100" size="small" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="是否数组：" prop="isArray">
                        <div style="margin-top:5px">
                            <KSwitch :value="addForm.isArray" class="kswitch" :handle="true" @changeSwitch="changeArray"></KSwitch>
                            <!-- <div class="switch-wrapper" :class="{'yes':addForm.isArray,'no':!addForm.isArray}"  @click="changeArray(addForm)">
                                <div class="ub ub-ac ub-pj">
                                    <div style="margin-left: -1px">是</div>
                                    <div>否</div>
                                </div>
                                <div class="circle"></div>
                            </div> -->
                        </div>
                    </el-form-item>
                    <el-form-item label="描述：" prop="des">
                        <el-input v-model="addForm.des" placeholder="请输入" style="width: 100%" size="small" clearable></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="addDialog = false">取消</el-button>
                <el-button size="small" type="primary" @click="submitAdd('addForm')">确认</el-button>
                <!-- <searchBtn title="确 定" @click="submitAdd('addForm')" />
                <cancelBtn title="取 消" @click="addDialog = false" /> -->
            </span>
        </el-dialog>

        <el-dialog title="编辑属性" :visible.sync="editDialog" width="700px" custom-class="common-dialog">
            <div style="width:100%;margin: 0 auto;">
                <el-form label-width="80px" label-position="top" :rules="rules" ref="editForm" :model="editForm">
                    <el-row :gutter="40">
                        <el-col :span="12">
                            <el-form-item label="属性名称：" prop="name">
                                <el-input v-model="editForm.name" placeholder="请输入" style="width: 100%" size="small" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="属性类型：" prop="type">
                                <el-select v-model="editForm.type" placeholder="请选择" size="small" style="width: 100%">
                                    <el-option v-for="(item, index) in attrTypeList" :key="index" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="枚举值：" v-if="editForm.type == 5" prop="enum">
                        <el-input v-model="editForm.enum" placeholder="请输入不同枚举值，多个值以 ',' 隔开" :maxlength="100" style="width: 100%" size="small" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="是否数组：" prop="isArray">
                        <div style="margin-top:5px">
                            <KSwitch :value="editForm.isArray" class="kswitch" :handle="true" @changeSwitch="changeEditArray"></KSwitch>
                            <!-- <div class="switch-wrapper" :class="{'yes':editForm.isArray,'no':!editForm.isArray}"  @click="changeArray(editForm)">
                                <div class="ub ub-ac ub-pj">
                                    <div style="margin-left: -1px">是</div>
                                    <div>否</div>
                                </div>
                                <div class="circle"></div>
                            </div> -->
                        </div>
                    </el-form-item>
                    <el-form-item label="描述：" prop="des">
                        <el-input v-model="editForm.des" placeholder="请输入" style="width: 100%" size="small" clearable></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="editDialog = false">取 消</el-button>
                <el-button size="small" type="primary" @click="submitEdit('editForm')">确 定</el-button>
            </span>
        </el-dialog>
        <DeleteDialog
            :dialogVisible = deleteItemDialog
            @delete="handleDeleteItemFun"
            @cancel="deleteItemDialog = false">
        </DeleteDialog>
        <DeleteDialog
            :dialogVisible = deleteAllDialog
            @delete="handleDeleteAll"
            @cancel="deleteAllDialog = false">
        </DeleteDialog>
    </div>
</template>

<script>
// import initData from '@/mixins/initData.js'
import {
    getAttrList,
    saveAttrList,
    updateAttrList,
    deleteAttrList,
    downLoad

} from '@/server/data_manage/api.js'

export default {
    name: 'Index',
    // mixins: [initData],
    data() {
        var validateEnums = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入'))
            } else if (value.trim().split(',').filter(it => it !== '').length !== [...new Set(value.trim().split(',').filter(it => it !== ''))].length) {
                callback(new Error('枚举值不能重复'))
            } else {
                callback()
            }
        }
        return {
            tableHeight: document.body.clientHeight - 270,
            isOpen: false,
            createDialog: false,
            editDialog: false,
            deleteItemDialog: false,
            deleteAllDialog: false,
            loading: false,
            total_num: 0,
            tableData: [],
            fileList: [],
            multipleSelection: [],
            delId: '',
            addForm: {
                name: '',
                type: '',
                enum: '',
                isArray: false,
                des: ''
            },
            editForm: {
                id: '',
                name: '',
                type: '',
                enum: '',
                isArray: true,
                des: ''
            },
            seeForm: {
                enums: '',
                classify: '',
                code: '',
                name: '',
                isArray: '',
                detail: '',
                type: ''
            },
            addDialog: false,
            seeDialog: false,
            rules: {
                name: { required: true, message: '请输入', trigger: 'blur' },
                type: { required: true, message: '请输入', trigger: 'blur' },
                isArray: { required: true, message: '', trigger: 'blur' },
                enum: { required: true, trigger: 'blur', validator: validateEnums }
            },
            get_params: {
                page: 1,
                size: 20,
                attrName: '',
                fieldName: '',
                category: '',
                type: '',
                isArray: ''
            },
            attrTypeList: [
                {
                    label: '字符',
                    value: 1
                },
                {
                    label: '数字',
                    value: 2
                },
                {
                    label: '时间',
                    value: 3
                },
                {
                    label: 'IP',
                    value: 4
                },
                {
                    label: '枚举',
                    value: 5
                }
            ],
            categoryList: []
        }
    },

    mounted() {
        this.$nextTick(() => {
            this.get_data()
        })
    },
    computed: {
        action() {
            return '/api/data-center/manage/logField/import'
        },
        header() {
            return { token: this.$getlocalStorage('initInfo').user.token }
        }
    },
    watch: {
        addDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.addForm.resetFields()
                }
            }
        },
        editDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.editForm.resetFields()
                }
            }
        }
    },
    methods: {
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex % 2) {
                return 'table-row2'
            } else {
                return 'table-row1'
            }
        },
        handleDownLoad() {
            let data = {
                queryData: {
                    page: this.get_params.page,
                    pageSize: this.get_params.size
                },
                paramsData: {
                    ids: this.multipleSelection.map(item => item.id),
                    name: this.get_params.attrName,
                    type: this.get_params.type,
                    isArray: this.get_params.isArray
                }
            }
            downLoad(data).then(res => {
                console.log(res)
            }).catch(e => {
                console.log(e)
            })
        },
        reserFun() {
            this.get_params.attrName = ''
            this.get_params.fieldName = ''
            this.get_params.type = ''
            this.get_params.isArray = ''
            setTimeout(() => {
                this.get_data()
            }, 1000)
        },
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        searchAssets() {
            this.get_params.page = 1
            this.get_data()
        },
        changeEditArray(checked) {
            this.editForm.isArray = checked
        },
        changeArray(checked) {
            this.addForm.isArray = checked
            // if (form.isArray) {
            //     form.isArray = 0
            // } else {
            //     form.isArray = 1
            // }
        },
        handleSuccess(response, file, fileList) {
            console.log('response', response)
            if (response.code == 1) {
                this.$message({
                    message: '文件上传成功!',
                    type: 'success'
                })
                this.get_data()
            } else {
                this.$message({
                    message: response.message,
                    type: 'warning'
                })
            }
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
                    name: this.get_params.attrName,
                    classify: this.get_params.category,
                    code: this.get_params.fieldName,
                    type: this.get_params.type,
                    isArray: this.get_params.isArray
                }
            }
            getAttrList(data).then(res => {
                console.log(res)
                this.loading = false
                this.total_num = res.total
                let list = res.records
                if (list.length > 0) {
                    list.forEach(item => {
                        let obj = {}
                        obj.id = item.id
                        obj.enums = item.enums ?? []
                        obj.classify = item.classify
                        obj.code = item.code
                        obj.name = item.name
                        obj.isArray = item.isArray
                        obj.detail = item.detail
                        obj.type = item.type
                        obj.isDefault = item.isDefault

                        this.tableData.push(obj)
                        // console.log(this.tableData)
                    })
                }
            }).catch(error => {
                this.loading = false
                console.log('error' + error)
            })
        },
        submitAdd(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.add_success()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        submitEdit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.edit_success()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        handleSee(row) {
            this.seeForm.name = row.name || '--'
            this.seeForm.enums = row.enums.join(',') || '--'
            this.seeForm.classify = row.classify || '--'
            this.seeForm.code = row.code || '--'
            this.seeForm.isArray = row.isArray
            this.seeForm.detail = row.detail || '--'
            this.seeForm.type = row.type
            this.seeDialog = true
        },
        add_success() {
            let obj = {
                queryData: {},
                paramsData: {
                    name: this.addForm.name,
                    type: this.addForm.type,
                    isArray: this.addForm.isArray === true ? 1 : 0,
                    detail: this.addForm.des
                }
            }
            if (this.addForm.type == 5) {
                obj.paramsData.enums = this.addForm.enum.trim().split(',').filter(it => it !== '')
            }
            saveAttrList(obj).then(res => {
                console.log(res)
                this.addDialog = false
                this.$message({
                    message: '添加成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1000)
            }).catch(err => {
                this.addDialog = false
                console.log(err + 'err')
            })
        },
        handleEdit(row) {
            this.editForm.id = row.id
            this.editForm.name = row.name
            this.editForm.type = row.type
            this.editForm.enum = row.enums.join(',')
            if (row.isArray === 1) {
                this.editForm.isArray = true
            } else {
                this.editForm.isArray = false
            }
            // this.editForm.isArray = row.isArray
            this.editForm.des = row.detail
            this.editDialog = true
        },
        handleDelete(row) {
            this.delId = row.id
            this.deleteItemDialog = true
        },
        handleSelectionChange(val) {
            console.log(val)
            this.multipleSelection = val
        },
        handleSizeChange(val) {
            this.get_params.size = val
            this.get_data()
        },
        handleCurrentChange(val) {
            this.get_params.page = val
            this.get_data()
        },
        edit_success() {
            let obj = {
                queryData: {},
                paramsData: {
                    id: this.editForm.id,
                    name: this.editForm.name,
                    type: this.editForm.type,
                    isArray: this.editForm.isArray === true ? 1 : 0,
                    detail: this.editForm.des
                }
            }
            if (this.editForm.type == 5) {
                obj.paramsData.enums = this.editForm.enum.trim().split(',').filter(it => it !== '')
            }
            updateAttrList(obj).then(res => {
                this.editDialog = false
                this.$message({
                    message: '编辑成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1000)
            }).catch(err => {
                this.editDialog = false
                console.log(err + 'err')
            })
        },
        handleDeleteItemFun() {
            let data = {
                queryData: {},
                paramsData: {
                    ids: [this.delId]
                }
            }
            console.log(data)
            deleteAttrList(data).then(res => {
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                this.deleteItemDialog = false
                setTimeout(() => {
                    this.get_data()
                }, 1000)
            }).catch(err => {
                this.deleteItemDialog = false
                console.log(err + 'err')
            })
        },
        deleteAll() {
            if (!this.multipleSelection.length) {
                this.$message.warning('请先选择数据！')
                return
            }
            this.deleteAllDialog = true
        },
        handleDeleteAll() {
            let idsData = this.multipleSelection.map(item => item.id)
            let data = {
                queryData: {},
                paramsData: {
                    ids: idsData
                }
            }
            deleteAttrList(data).then(res => {
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                this.deleteAllDialog = false
                setTimeout(() => {
                    this.get_data()
                }, 1000)
            }).catch(err => {
                this.deleteAllDialog = false
                console.log(err + 'err')
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.event ::v-deep .el-tag.el-tag--success {
    background-color: rgba(0, 0, 0, 0);
    border-color: #01c5ff;
    color: #00fdff;
}
.black-theme .event ::v-deep .el-descriptions__body {
    background: #033254;
    color: #fff;
}
.black-theme .event ::v-deep .el-descriptions .is-bordered .el-descriptions-item__cell {
    border: 1px solid #3990d8;
    box-shadow: inset 0px 0px 6px 0px rgba(0, 186, 255, 0.73), inset 0px -1px 0px 0px rgba(40, 82, 124, 0.5);
}
.black-theme .event ::v-deep .el-descriptions-item__label.is-bordered-label {
    width: 120px;
    background:#00466d;
    color: #fff;
    border-left: 1px solid #3990d8 !important;
    border-right: 1px solid #3990d8 !important;
}
.black-theme .event ::v-deep .el-descriptions__table tbody:first-child .is-bordered-label {
    border-top: 1px solid #3990d8 !important;
}
.black-theme .event ::v-deep .el-descriptions__table tbody:last-child .is-bordered-label {
    border-bottom: 1px solid #3990d8 !important;
}
//.event ::v-deep .el-descriptions__table tbody:first-child td {
//    border-top: 1px solid #3990d8 !important;
//}
//.event ::v-deep .el-descriptions__table tbody:last-child td {
//    border-bottom: 1px solid #3990d8 !important;
//}
.black-theme .event ::v-deep .el-descriptions__table tbody td {
    border-right: 1px solid #3990d8 !important;
}
.switch-wrapper{
    width:50px;
    height:24px;
    position: relative;
    cursor: pointer;
}
.switch-wrapper>div:nth-child(1){
    width:50px;
    height:24px;
    background-color: #0052d9;
    // box-shadow: inset 0px 0px 7px 0px #000000;
    border-radius: 14px;
    div{
        font-size: 12px;
        line-height: 20px;
        padding:0 6px;
    }
    >div:nth-child(1){
        color: #fff;
        // opacity: 0.6;
    }
    >div:nth-child(2){
        color: #fff;
        // opacity: 0.6;
    }
}
.switch-wrapper>div:nth-child(2){
    width: 24px;
    height: 24px;
    position: absolute;
    left:0;
    top:50%;
    margin-top: -12px;
    border-radius:100%;
}
.switch-wrapper.yes>div:nth-child(2){
    animation: moveone 0.1s linear forwards;
}
.switch-wrapper.no>div:nth-child(2){
    animation: _moveone 0.1s linear forwards;
}
.switch-wrapper.no > div:nth-child(1) {
    background: #c5c5c5 !important;
}
@keyframes moveone{
    0% {
        background-color: #fff;
        // box-shadow: 0px 0px 10px 0px #e5e5e5;
        left: 1px;
    }

    100% {
        background-color: #fff;
        // box-shadow: 0px 0px 10px 0px #e5e5e5;
        left: 30px;
    }
}
@-webkit-keyframes moveone {
    0% {
        background-color: #fff;
        // box-shadow: 0px 0px 10px 0px #e5e5e5;
        left: 1px;
    }

    100% {
        background-color: #fff;
        // box-shadow: 0px 0px 10px 0px #e5e5e5;
        left: 30px;
    }
}
@keyframes _moveone {
    0% {
        background-color: #fff;
        // box-shadow: 0px 0px 10px 0px #e5e5e5;
        left: 30px;
    }

    100% {
        background-color: #fff;
        // box-shadow: 0px 0px 10px 0px #e5e5e5;
        left: 1px;
    }
}
@-webkit-keyframes _moveone {
    0% {
        background-color: #fff;
        // box-shadow: 0px 0px 10px 0px #e5e5e5;
        left: 30px;
    }

    100% {
        background-color: #fff;
        // box-shadow: 0px 0px 10px 0px #e5e5e5;
        left: 1px;
    }
}
.switch-wrapper.yes>div:nth-child(2){
    animation: moveone 0.1s linear forwards;
}
.switch-wrapper.no>div:nth-child(2){
    animation: _moveone 0.1s linear forwards;
}
.reset-btn {
    width: 80px;
    height: 30px;
    background-color: #041f38;
    box-shadow: inset 0px 0px 10px 0px rgba(0, 167, 245, 0.97);
    border: solid 1px #39caf3;
    font-size: 12px;
    line-height: 15px;
    letter-spacing: 1px;
    color: #a2ceec;
    border-radius: 5px;
    margin-right: 10px;
    cursor: pointer;
    box-sizing: border-box;
}
</style>
