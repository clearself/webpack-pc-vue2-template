<template>
    <div class="event">
        <div class="w100">
            <div class="ub w100 search-area" style="box-sizing: border-box;">
                <SearchTop @search="searchCheck" @reset="reset">
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="引擎名称：" label-width="80px">
                                <el-input
                                    placeholder="请输入"
                                    clearable
                                    v-model="get_params.name"
                                    @keyup.enter.native="searchCheck"
                                    size="small"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="引擎类型：" label-width="80px">
                                <el-select
                                    v-model="get_params.type"
                                    filterable
                                    placeholder="请选择"
                                    style="width: 100%"
                                    size="small"
                                    clearable>
                                    <el-option
                                        v-for="(item, index) in types"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="厂商：" label-width="80px">
                                <el-select
                                    v-model="get_params.factory"
                                    filterable
                                    placeholder="请选择"
                                    style="width: 100%"
                                    size="small"
                                    clearable>
                                    <el-option
                                        v-for="(item, index) in factorys"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </SearchTop>
            </div>
            <div class="attendance-list table-area">
                <div class="ub ub-pj ub-ac w100" style="margin-bottom: 10px;">
                    <div class="list-tips">列表内容</div>
                    <div>
                        <el-button  v-per="['leaks_scanEngine_add']" size="small" type="primary" @click="addDialog = true" icon="el-icon-plus">添加引擎</el-button>
                        <el-button v-per="['leaks_scanEngine_del']" size="small" type="danger" @click="handleDeleteAll" icon="el-icon-delete">刪 除</el-button>
                    </div>
                </div>
                <el-table
                    :height="tableHeight"
                    :row-class-name="tableRowClassName"
                    ref="multipleTable"
                    v-loading="loading"
                    class='bigTable full-table'
                    :data="tableData"
                    border
                    stripe
                    tooltip-effect="dark"
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="50"></el-table-column>
                    <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                    </el-table-column>
                    <el-table-column prop="name" label="引擎名称" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="typeCN" label="引擎类型" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="factoryCN" label="引擎厂商" >
                    </el-table-column>
                    <el-table-column prop="engineVersion" label="引擎版本">
                    </el-table-column>
                    <el-table-column prop="interfaceAddress" label="接口地址">
                    </el-table-column>
                    <el-table-column prop="interfaceUser" label="接口账号">
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建时间" width="160">
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="100">
                        <template slot-scope="scope">
                            <el-button v-per="['leaks_scanEngine_edit']"  @click="handleEdit(scope.row)" size="small" type="text">编辑</el-button>
                            <el-button v-per="['leaks_scanEngine_del']"  @click="handleDelete(scope.row)" size="small" type="text">删除</el-button>
                        </template>
                    </el-table-column>

                </el-table>
                <pagination v-show="total_num>0" :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size" @pagination="get_data" />
            </div>
        </div>
        <el-dialog v-dialogDrag title="添加引擎" :visible.sync="addDialog" width="700px" custom-class="common-dialog">
            <el-form label-position="top" :model="addForm" :rules="rules" ref="addForm" :inline="true">
                <div class="ub ub-pj">
                    <el-form-item  style="margin-right: 60px;width: 100%;" label="引擎名称：" :label-width="formLabelWidth" prop="name">
                        <el-input style="width:100%;" placeholder="请输入" clearable v-model="addForm.name" size="small"></el-input>
                    </el-form-item>
                    <el-form-item style="width:100%;" label="引擎类型：" :label-width="formLabelWidth" prop="type">
                        <el-select style="width:100%;" size="small" v-model="addForm.type" clearable placeholder="请选择">
                            <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="ub ub-pj">
                    <el-form-item style="margin-right: 60px;width: 100%;" label="引擎厂商：" prop="factory" :label-width="formLabelWidth">
                        <el-select style="width:100%;" size="small" v-model="addForm.factory" clearable placeholder="请选择">
                            <el-option v-for="item in factorys" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item style="width:100%;" label="引擎版本：" prop="engineVersion" :label-width="formLabelWidth">
                        <el-input style="width:100%;" placeholder="请输入" clearable v-model="addForm.engineVersion" size="small"></el-input>
                    </el-form-item>
                </div>
                <div class="ub ub-pj">
                    <el-form-item style="margin-right: 60px;width: 100%;" label="接口地址：" prop="interfaceAddress" :label-width="formLabelWidth">
                        <el-input style="width:100%;" placeholder="请输入" clearable v-model="addForm.interfaceAddress" size="small"></el-input>
                    </el-form-item>
                    <el-form-item style="width:100%;" label="接口账号：" prop="interfaceUser" :label-width="formLabelWidth">
                        <el-input style="width:100%;" placeholder="请输入" clearable v-model="addForm.interfaceUser" size="small"></el-input>
                    </el-form-item>
                </div>
                <div class="ub ub-pj">
                    <el-form-item style="width:100%;" label="接口密码：" prop="interfacePwd" :label-width="formLabelWidth">
                        <el-input style="width:100%;" placeholder="请输入" clearable v-model="addForm.interfacePwd" size="small"></el-input>
                    </el-form-item>
                </div>
                <el-form-item style="width:100%;" label="描述信息：" prop="description" :label-width="formLabelWidth">
                    <el-input style="width:100%;" type="textarea" placeholder="请输入" clearable v-model="addForm.description" size="small"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" @click="submitForm('addForm')">确 定</el-button>
                <el-button size="small" @click="addDialog = false">取 消</el-button>
            </span>
        </el-dialog>
        <!--编辑对象-->
        <el-dialog v-dialogDrag title="编辑引擎" :visible.sync="editDialog" width="700px" custom-class="common-dialog">
            <el-form label-position="top" :model="editForm" :rules="rules" ref="editForm" :inline="true">
                <div class="ub ub-pj">
                    <el-form-item  style="margin-right: 60px;width: 100%;" label="引擎名称：" :label-width="formLabelWidth" prop="name">
                        <el-input style="width:100%;" placeholder="请输入" clearable v-model="editForm.name" size="small"></el-input>
                    </el-form-item>
                    <el-form-item style="width:100%;" label="引擎类型：" :label-width="formLabelWidth" prop="type">
                        <el-select style="width:100%;" size="small" v-model="editForm.type" clearable placeholder="请选择">
                            <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="ub ub-pj">
                    <el-form-item style="margin-right: 60px;width: 100%;" label="引擎厂商：" prop="factory" :label-width="formLabelWidth">
                        <el-select style="width:100%;" size="small" v-model="editForm.factory" clearable placeholder="请选择">
                            <el-option v-for="item in factorys" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item style="width:100%;" label="引擎版本：" prop="engineVersion" :label-width="formLabelWidth">
                        <el-input style="width:100%;" placeholder="请输入" clearable v-model="editForm.engineVersion" size="small"></el-input>
                    </el-form-item>
                </div>
                <div class="ub ub-pj">
                    <el-form-item style="margin-right: 60px;width: 100%;" label="接口地址：" prop="interfaceAddress" :label-width="formLabelWidth">
                        <el-input style="width:100%;" placeholder="请输入" clearable v-model="editForm.interfaceAddress" size="small"></el-input>
                    </el-form-item>
                    <el-form-item style="width:100%;" label="接口账号：" prop="interfaceUser" :label-width="formLabelWidth">
                        <el-input style="width:100%;" placeholder="请输入" clearable v-model="editForm.interfaceUser" size="small"></el-input>
                    </el-form-item>
                </div>
                <div class="ub ub-pj">
                    <el-form-item style="width:100%;" label="接口密码：" prop="interfacePwd" :label-width="formLabelWidth">
                        <el-input style="width:100%;" placeholder="请输入" clearable v-model="editForm.interfacePwd" size="small"></el-input>
                    </el-form-item>
                </div>
                <el-form-item style="width:100%;" label="描述信息：" prop="description" :label-width="formLabelWidth">
                    <el-input style="width:100%;" type="textarea" placeholder="请输入" clearable v-model="editForm.description" size="small"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" @click="submitFormEdit('editForm')">确 定</el-button>
                <el-button size="small" @click="editDialog = false">取 消</el-button>
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
import {
    getEngTypes,
    getFactoryTypes,
    getEngList,
    deleteEng,
    saveEng,
    updateEng
} from '../../server/leak/api.js'

export default {
    name: 'Engine',
    data() {
        return {
            tableHeight: document.body.clientHeight - 266,
            addDialog: false,
            addForm: {
                name: '',
                type: '',
                factory: '',
                engineVersion: '',
                interfaceUser: '',
                interfacePwd: '',
                interfaceAddress: '',
                description: ''
            },
            editForm: {
                id: '',
                name: '',
                type: '',
                factory: '',
                engineVersion: '',
                interfaceUser: '',
                interfacePwd: '',
                interfaceAddress: '',
                description: ''
            },
            rules: {
                name: [{
                    required: true,
                    message: '请输入',
                    trigger: 'blur'
                }],
                type: [{
                    required: true,
                    message: '请选择',
                    trigger: 'change'
                }],
                engineVersion: [{
                    required: true,
                    message: '请输入',
                    trigger: 'blur'
                }],

                factory: [{
                    required: true,
                    message: '请选择',
                    trigger: 'change'
                }],
                interfaceUser: [{
                    required: true,
                    message: '请输入',
                    trigger: 'blur'
                }],
                interfacePwd: [{
                    required: true,
                    message: '请输入',
                    trigger: 'blur'
                }],
                interfaceAddress: [{
                    required: true,
                    message: '请输入',
                    trigger: 'blur'
                }]
            },

            deleteDialog: false,
            deleteId: '',
            editDialog: false,
            formLabelWidth: '90px',
            loading: false,
            total_num: 0,
            multipleSelection: [],
            tableData: [],
            types: [],
            factorys: [],
            get_params: {
                page: 1,
                size: 20,
                name: '',
                type: '',
                factory: ''
            }

        }
    },
    watch: {
        addDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.addForm.resetFields()
                    this.addForm.description = ''
                }
            }
        },
        editDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.editForm.resetFields()
                    this.editForm.description = ''
                }
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.get_data()
            this.gettypes()
            this.getfactorys()
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
            this.get_params = {
                page: 1,
                size: 20,
                name: '',
                type: '',
                factory: ''
            }
            this.get_data()
        },
        // 引擎类型
        gettypes() {
            this.types = []
            getEngTypes({ paramsData: {}, queryData: {}}).then(res => {
                console.log(res, '所有引擎类型')
                if (res.length > 0) {
                    res.forEach(item => {
                        let obj = {}
                        obj.label = item.name
                        obj.value = item.value
                        this.types.push(obj)
                    })
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // 引擎类型
        getfactorys() {
            this.factorys = []
            getFactoryTypes({ paramsData: {}, queryData: {}}).then(res => {
                console.log(res, '所有厂商')
                if (res.length > 0) {
                    res.forEach(item => {
                        let obj = {}
                        obj.label = item.name
                        obj.value = item.value
                        this.factorys.push(obj)
                    })
                }
            }).catch(err => {
                console.log(err)
            })
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
                    type: this.get_params.type,
                    factory: this.get_params.factory
                }
            }
            getEngList(data).then(res => {
                console.log('列表', res)
                this.loading = false
                this.total_num = res.total
                let list = res.records
                if (list.length > 0) {
                    list.forEach(item => {
                        let obj = {}
                        obj.id = item.id
                        obj.type = item.type
                        obj.name = item.name
                        obj.factory = item.factory
                        obj.engineVersion = item.engineVersion
                        obj.interfaceAddress = item.interfaceAddress
                        obj.interfaceUser = item.interfaceUser
                        obj.interfacePwd = item.interfacePwd
                        obj.description = item.description
                        obj.createTime = item.createTime
                        obj.typeCN = item.typeCN
                        obj.factoryCN = item.factoryCN
                        this.tableData.push(obj)
                    })
                }
            }).catch(error => {
                this.loading = false
                console.log('error' + error)
            })
        },

        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        searchCheck() {
            this.get_params.page = 1
            this.get_data()
        },

        handleEdit(row) {
            console.log(row)
            this.editForm.id = row.id
            this.editForm.name = row.name
            this.editForm.factory = row.factory
            this.editForm.type = row.type
            this.editForm.engineVersion = row.engineVersion
            this.editForm.interfaceUser = row.interfaceUser
            this.editForm.interfaceAddress = row.interfaceAddress
            this.editForm.description = row.description
            this.editForm.interfacePwd = row.interfacePwd
            this.editDialog = true
        },
        handleDeleteAll() {
            if (this.multipleSelection.length == 0) {
                this.$message({
                    message: '请先选择行',
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
                queryData: {},
                paramsData: {
                    ids: this.deleteId
                }
            }
            deleteEng(data).then(res => {
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
                this.deleteDialog = false
                console.log(error + 'error')
            })
        },

        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = {
                        queryData: {},
                        paramsData: {
                            name: this.addForm.name,
                            type: this.addForm.type,
                            factory: this.addForm.factory,
                            engineVersion: this.addForm.engineVersion,
                            interfaceUser: this.addForm.interfaceUser,
                            interfacePwd: this.addForm.interfacePwd,
                            interfaceAddress: this.addForm.interfaceAddress,
                            description: this.addForm.description
                        }
                    }
                    saveEng(data).then(res => {
                        this.addDialog = false
                        console.log('添加成功')
                        this.$message({
                            message: '添加成功',
                            type: 'success'
                        })
                        setTimeout(() => {
                            this.get_data()
                        }, 1500)
                    }).catch(error => {
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
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = {
                        queryData: {},
                        paramsData: {
                            id: this.editForm.id,
                            name: this.editForm.name,
                            type: this.editForm.type,
                            factory: this.editForm.factory,
                            engineVersion: this.editForm.engineVersion,
                            interfaceUser: this.editForm.interfaceUser,
                            interfacePwd: this.editForm.interfacePwd,
                            interfaceAddress: this.editForm.interfaceAddress,
                            description: this.editForm.description
                        }
                    }
                    updateEng(data).then(res => {
                        this.editDialog = false
                        console.log('编辑成功')
                        this.$message({
                            message: '编辑成功',
                            type: 'success'
                        })
                        setTimeout(() => {
                            this.get_data()
                        }, 1500)
                    }).catch(error => {
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
</style>
