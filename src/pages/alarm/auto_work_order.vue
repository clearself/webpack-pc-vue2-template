<template>
    <div class="list">
        <SearchTop @search="searchAssets" @reset="reset" style="border-top-left-radius:0;border-top-right-radius:0;box-shadow:none">
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params">
                    <el-form-item label="启用状态：" label-width="80px">
                        <el-select
                            v-model="get_params.status"
                            placeholder="请选择"
                            style="width: 100%"
                            size="small"
                            clearable>
                            <el-option label="启用" value="1"></el-option>
                            <el-option label="停用" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params">
                    <el-form-item label="规则名称：" label-width="80px">
                        <el-input placeholder="请输入" clearable v-model.trim="get_params.name" size="small"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
        </SearchTop>
        <div class="list-container">
            <div class="ub ub-pj w100 mb-1 ub-ac">
                <div class="list-tips">自动工单配置</div>
                <div class="ub">
                    <el-button icon="el-icon-plus" type="primary" size="small" @click="addDialog = true" v-per="['alarm_auto_add']">添加</el-button>
                    <el-button style="margin-left: 10px;" icon="el-icon-delete" type="danger" size="small" @click="handleDeleteAll" v-per="['alarm_auto_del']">删除</el-button>
                </div>
            </div>
            <el-table
                ref="multipleTable"
                v-loading="loading"
                class='bigTable'
                :data="tableData"
                border
                stripe
                :row-class-name="tableRowClassName"
                tooltip-effect="dark"
                :height="tabHeight"
                :row-style="{ height: '32px' }"
                :header-row-style="{ height: '32px' }"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="30" align="center"></el-table-column>
                <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                </el-table-column>
                <el-table-column prop="configName" label="规则名称" width="300">
                </el-table-column>
                <el-table-column prop="startType" label="启用状态" align="center" width="100">
                    <template slot-scope="{row}">
                        <div>
                            <div v-if="row.startType == 1" class="ub ub-ac ub-pc">
                                <div></div>
                                <div style="color:#00d95c">已启用</div>
                            </div>
                            <div v-else class="ub ub-ac ub-pc">
                                <div></div>
                                <div style="color:#e34d59">已停用</div>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="workOrder" label="工单模板" width="200">
                    <template slot-scope="{row}">
                        <p>{{workTemplateName(row.workOrder)}}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="ruleScope" label="规则范围">
                    <template slot-scope="{row}">
                        <p v-html="defHighlight(row.ruleScope)"></p>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.startType == 0" type="text" size="small" @click="handleChangeState(scope.row)" v-per="['alarm_auto_start']">启用</el-button>
                        <el-button v-if="scope.row.startType == 1" type="text" size="small" @click="handleChangeState(scope.row)" v-per="['alarm_auto_stop']">停用</el-button>
                        <el-button type="text" size="small" @click="handleEdit(scope.row)" v-per="['alarm_auto_edit']">编辑</el-button>
                        <el-button type="text" size="small" @click="delUserBtn(scope.row)" v-per="['alarm_auto_del']">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size"  style="padding-top:10px" @pagination="get_data" v-show="total_num>0"/>
        </div>
        <!--增加内容开始-->
        <el-dialog title="添加自动工单配置" :visible.sync="addDialog" width="700px" custom-class="common-dialog">
            <el-form :model="addForm" :rules="rules" ref="addForm" label-position="top">
                <el-form-item label="规则名称：" prop="name" :label-width="formLabelWidth">
                    <el-input size="small" v-model.trim="addForm.name" placeholder="请输入" autocomplete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="工单模板：" prop="template" :label-width="formLabelWidth">
                    <el-select
                        v-model="addForm.template"
                        placeholder="请选择"
                        style="width: 100%"
                        size="small"
                        clearable>
                        <el-option v-for="it in templateList" :label="it.name" :value="it.id" :key="it.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="规则范围：" prop="rules" :label-width="formLabelWidth">
                    <div class="rule-condition ub ub-ac">
                        <div class="left-condition">AND</div>
                        <div class="ub ub-ver">
                            <div class="part-condition" v-for="(_item, _index) in addForm.rules" :key="_index">
                                <el-select filterable clearable v-model="_item.field" size="mini" style="width: 100px" placeholder="请选择" @change="()=>{_item.val='';_item.condition=''}">
                                    <el-option v-for="(item, index) in fieldsList" :key="index" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                                <span style="color:#dddddd"> — </span>
                                <el-select filterable clearable v-model="_item.condition" size="mini" style="margin: 0 0;width: 100px" placeholder="请选择" @change="_item.val=''" v-if="_item.field == 'reportLevel' || _item.field == 'reportTypeName'">
                                    <el-option v-for="(item, index) in filtration1" :key="index" :label="item.name" :value="item.value"></el-option>
                                </el-select>
                                <el-select filterable clearable v-model="_item.condition" size="mini" style="margin: 0 0;width: 100px" placeholder="请选择" @change="_item.val=''" v-else-if="_item.field == 'attackResult'">
                                    <el-option v-for="(item, index) in filtration2" :key="index" :label="item.name" :value="item.value"></el-option>
                                </el-select>
                                <el-select filterable clearable v-model="_item.condition" size="mini" style="margin: 0 0;width: 100px" placeholder="请选择" @change="_item.val=''" v-else>
                                    <el-option v-for="(item, index) in conditionList" :key="index" :label="item.name" :value="item.value"></el-option>
                                </el-select>
                                <span style="color:#dddddd"> — </span>
                                <el-input v-if="showValue(_item) === 'text'&&(_item.condition!=4&&_item.condition!=5)" v-model="_item.val" clearable size="mini" style="width: 290px" placeholder="请输入"></el-input>
                                <el-select v-if="showValue(_item) === 'select'&&(_item.condition!=4&&_item.condition!=5)"  placeholder="请选择" style="width: 290px;" v-model="_item.val" size="mini">
                                    <el-option v-for="(tag,_index) in _item.item" :label="tag.value" :value="tag.key" :key="_index"></el-option>
                                </el-select>
                                <i
                                    @click.stop="deleteOneRule(_index)"
                                    v-if="_index != 0"
                                    class="el-icon-remove-outline"
                                    style="cursor: pointer;font-size:14px;color:#ff0000;margin-left:10px"></i>
                                <i class="el-icon-circle-plus-outline ml-1" style="font-size:14px;color:#266fe8;cursor: pointer" @click="addOneRule" v-if="_index == addForm.rules.length -1"></i>
                            </div>
                            <!-- <p class="del-btn">
                                <i class="el-icon-circle-plus-outline" style="font-size:14px;color:#266fe8;cursor: pointer" @click="addOneRule"></i>
                            </p> -->
                        </div>
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialog=false" size="small">取消</el-button>
                <el-button type="primary" @click="submitForm('addForm')" size="small">确认</el-button>
            </span>
        </el-dialog>
        <!--编辑内容开始-->
        <el-dialog title="编辑自动工单配置" :visible.sync="editDialog" width="700px" custom-class="common-dialog">
            <el-form :model="editForm" :rules="rules" ref="editForm" label-position="top">
                <el-form-item label="规则名称：" prop="name" :label-width="formLabelWidth">
                    <el-input size="small" v-model.trim="editForm.name" placeholder="请输入" autocomplete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="工单模板：" prop="template" :label-width="formLabelWidth">
                    <el-select
                        v-model="editForm.template"
                        placeholder="请选择"
                        style="width: 100%"
                        size="small"
                        clearable>
                        <el-option v-for="it in templateList" :label="it.name" :value="it.id" :key="it.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="规则范围：" prop="rules" :label-width="formLabelWidth">
                    <div class="rule-condition ub ub-ac">
                        <div class="left-condition">AND</div>
                        <div class="ub ub-ver">
                            <div class="part-condition" v-for="(_item, _index) in editForm.rules" :key="_index">
                                <el-select filterable clearable v-model="_item.field" size="mini" style="width: 100px" placeholder="请选择" @change="()=>{_item.val='';_item.condition=''}">
                                    <el-option v-for="(item, index) in fieldsList" :key="index" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                                <span style="color:#dddddd"> — </span>
                                <el-select filterable clearable v-model="_item.condition" size="mini" style="margin: 0 0;width: 100px" placeholder="请选择" @change="_item.val=''" v-if="_item.field == 'reportLevel' || _item.field == 'reportTypeName'">
                                    <el-option v-for="(item, index) in filtration1" :key="index" :label="item.name" :value="item.value"></el-option>
                                </el-select>
                                <el-select filterable clearable v-model="_item.condition" size="mini" style="margin: 0 0;width: 100px" placeholder="请选择" @change="_item.val=''" v-else-if="_item.field == 'attackResult'">
                                    <el-option v-for="(item, index) in filtration2" :key="index" :label="item.name" :value="item.value"></el-option>
                                </el-select>
                                <el-select filterable clearable v-model="_item.condition" size="mini" style="margin: 0 0;width: 100px" placeholder="请选择" @change="_item.val=''" v-else>
                                    <el-option v-for="(item, index) in conditionList" :key="index" :label="item.name" :value="item.value"></el-option>
                                </el-select>
                                <span style="color:#dddddd"> — </span>
                                <el-input v-if="showValue(_item) === 'text'&&(_item.condition!=4&&_item.condition!=5)" v-model="_item.val" clearable size="mini" style="width: 280px" placeholder="请输入"></el-input>
                                <el-select v-if="showValue(_item) === 'select'&&(_item.condition!=4&&_item.condition!=5)"  placeholder="请选择" style="width: 280px;" v-model="_item.val" size="mini">
                                    <el-option v-for="(tag,_index) in _item.item" :label="tag.value" :value="tag.key" :key="_index"></el-option>
                                </el-select>
                                <i
                                    @click.stop="deleteOneRuleEdit(_index)"
                                    v-if="_index != 0"
                                    class="el-icon-remove-outline"
                                    style="cursor: pointer;font-size:14px;color:#ff0000;margin-left:10px"></i>
                                <i class="el-icon-circle-plus-outline ml-1" style="font-size:14px;color:#266fe8;cursor: pointer" @click="addOneRuleEdit" v-if="_index == editForm.rules.length -1"></i>
                            </div>
                            <!-- <p class="del-btn">
                                <i class="el-icon-circle-plus-outline" style="font-size:14px;color:#266fe8;cursor: pointer" @click="addOneRuleEdit"></i>
                            </p> -->
                        </div>
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialog=false" size="small">取消</el-button>
                <el-button type="primary" @click="submitFormEdit('editForm')" size="small">确认</el-button>
            </span>
        </el-dialog>
        <!--删除-->
        <DeleteDialog
            :dialogVisible = deleteDialog
            @delete="handleDelete"
            @cancel="deleteDialog = false">
        </DeleteDialog>
    </div>
</template>

<script>
import {
    get_auto_work_list,
    save_auto_work,
    update_auto_work,
    delete_auto_work,
    change_auto_work_start,
    get_auto_work_template
} from '../../server/alarm/api.js'
import {
    getConfigCondition,
    getAlarmFields
} from '../../server/alarm/define.js'
export default {
    name: 'AttackResults',
    data() {
        return {
            tabHeight: document.body.clientHeight - 290,
            userDeleteAllDialog: false,
            formLabelWidth: '80px',
            loading: false,
            total_num: 0,
            tableData: [],
            multipleSelection: [],
            get_params: {
                page: 1,
                size: 20,
                name: '',
                status: ''
            },
            res: '',
            deleteDialog: false,
            delIds: '',
            addDialog: false,
            editDialog: false,
            conditionList: [],
            fieldsList: [],
            templateList: [],
            addForm: {
                name: '',
                template: '',
                rules: [
                    {
                        field: '',
                        condition: '',
                        val: ''
                    }
                ]
            },
            editForm: {
                id: '',
                name: '',
                template: '',
                startType: '',
                rules: [
                ]
            },
            rules: {
                name: [{
                    required: true,
                    message: '请输入规则名称',
                    trigger: 'blur'
                }],
                template: [{
                    required: true,
                    message: '请选择工单模板',
                    trigger: 'change'
                }],
                rules: [{
                    required: true
                }]
            },
            filtration1: [
                { name: '等于', value: 2 },
                { name: '不等于', value: 3 }
            ],
            filtration2: [
                { name: '等于', value: 2 },
                { name: '不等于', value: 3 },
                { name: '为空', value: 4 },
                { name: '不为空', value: 5 }
            ]
        }
    },
    watch: {
        addDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.addForm.resetFields()
                    this.addForm = {
                        name: '',
                        template: '',
                        rules: [
                            {
                                field: '',
                                condition: '',
                                val: ''
                            }
                        ]
                    }
                }
            }
        },
        editDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.editForm.resetFields()
                    this.editForm = {
                        id: '',
                        name: '',
                        template: '',
                        startType: '',
                        rules: [
                        ]
                    }
                }
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.get_data()
            this.getCondition()
            this.getFields()
            this.getWorkTemplate()
            this.defHighlight()
        })
    },
    methods: {
        defHighlight(value) {
            var a = value.replace(/ AND /g, "<span style='color: red;'>&nbsp&nbspAND&nbsp&nbsp</span>")
            return a
        },
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
                size: 10,
                name: '',
                status: ''
            }
            this.get_data()
        },
        workTemplateName(val) {
            let item = this.templateList.find(it => it.id === val)
            if (item) {
                return item.name
            } else {
                return '--'
            }
        },
        getCondition() {
            this.conditionList = []
            getConfigCondition({}).then(res => {
                console.log(res, '条件')
                this.conditionList = res
            }).catch(err => {
                console.log(err)
            })
        },
        getFields() {
            this.fieldsList = []
            getAlarmFields({}).then(res => {
                console.log(res, '字段')
                this.fieldsList = res
            }).catch(err => {
                console.log(err)
            })
        },
        getWorkTemplate() {
            this.templateList = []
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_auto_work_template(data).then(res => {
                console.log(res, '工单模板')
                this.templateList = res ?? []
            })
        },
        deleteAll() {
            if (this.multipleSelection.length == 0) {
                this.$message({
                    message: '请先选择行',
                    type: 'warning'
                })
                return
            }
            this.userDeleteAllDialog = true
        },
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },

        searchAssets() {
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
                    configName: this.get_params.name,
                    startType: this.get_params.status
                }
            }
            get_auto_work_list(data).then(res => {
                console.log(res, '自动工单')
                this.loading = false
                this.total_num = res.total
                let list = res.records
                if (list.length > 0) {
                    list.forEach(item => {
                        let obj = {}
                        obj.id = item.id
                        obj.configName = item.configName
                        obj.startType = item.startType
                        obj.workOrder = item.workOrder
                        obj.ruleScope = item.ruleScope
                        obj.startConditionObj = item.startConditionObj ?? []
                        obj.createTime = item.createTime
                        this.tableData.push(obj)
                    })
                }
            }).catch(error => {
                this.loading = false
                console.log('error' + error)
            })
        },
        addUser() {
            this.addDialog = true
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.addWork()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        addWork() {
            let data = {
                queryData: {},
                paramsData: {
                    configName: this.addForm.name,
                    startType: 1,
                    workOrder: this.addForm.template,
                    startConditionObj: this.addForm.rules
                }
            }
            save_auto_work(data).then(res => {
                console.log(res)
                this.addDialog = false
                this.$message({
                    message: '添加成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(error => {
                // this.addDialog = false
                console.log('error' + error)
            })
        },
        editWork() {
            let data = {
                queryData: {},
                paramsData: {
                    id: this.editForm.id,
                    configName: this.editForm.name,
                    startType: this.editForm.startType,
                    workOrder: this.editForm.template,
                    startConditionObj: this.editForm.rules
                }
            }
            update_auto_work(data).then(res => {
                console.log(res)
                this.editDialog = false
                this.$message({
                    message: '修改成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(error => {
                // this.editDialog = false
                console.log('error' + error)
            })
        },
        submitFormEdit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.editWork(false)
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        delUserBtn(row) {
            this.delIds = row.id
            this.deleteDialog = true
        },
        handleDelete() {
            let data = {
                queryData: {},
                paramsData: {
                    ids: typeof this.delIds === 'string' ? [this.delIds] : this.delIds
                }
            }
            delete_auto_work(data).then(res => {
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
                this.delIds = ids
            }
            this.deleteDialog = true
        },
        handleChangeState(row) {
            let data = {
                queryData: {},
                paramsData: {
                    id: row.id,
                    startType: row.startType == 1 ? 0 : 1
                }
            }
            change_auto_work_start(data).then(res => {
                this.$message({
                    message: '操作成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1000)
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
            this.editForm.id = row.id
            this.editForm.name = row.configName
            this.editForm.rules = row.startConditionObj.map(it => { return { condition: it.condition, field: it.field, it: it.item, type: it.type, val: it.val } })
            this.editForm.template = row.workOrder
            this.editForm.startType = row.startType
            this.editDialog = true
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        showValue(item) {
            let field = item.field
            let arr = this.fieldsList.find(item => item.value == field)
            if (arr) {
                if (arr.type === 'text') {
                    item.type = 'text'
                    return 'text'
                } else if (arr.type === 'select') {
                    item.type = 'select'
                    item.item = arr.item
                    return 'select'
                }
            } else {
                item.type = 'text'
                return 'text'
            }
        },
        addOneRule() {
            this.addForm.rules.push({
                field: '',
                condition: '',
                val: ''
            })
        },
        deleteOneRule(index) {
            this.addForm.rules.splice(index, 1)
        },
        addOneRuleEdit() {
            this.editForm.rules.push({
                field: '',
                condition: '',
                val: ''
            })
        },
        deleteOneRuleEdit(index) {
            this.editForm.rules.splice(index, 1)
        }
    }
}
</script>

<style lang="scss" scoped>
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
.event ::v-deep .use-state div:first-child {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 10px;
}
.event ::v-deep .use-state.one div:first-child {
    background-color: #00ff00;
    box-shadow: 0 0 10px #00ff00;
}
.event ::v-deep .use-state.two div:first-child {
    background-color: #ff3737;
    box-shadow: 0 0 10px #ff3737;
}
.rule-condition {
    margin-top: 0px;
    padding: 10px;
    box-sizing: border-box;
    flex-wrap: wrap;
    border: 1px solid rgba(0,0,0,.1);
    border-radius: 4px;
    background-color:rgba(56, 125, 238, 0.02);

}
.part-condition {
    margin-top: 10px;
}
.left-condition {
    font-size: 12px;
    margin-right: 10px;
    margin-top: 5px;
    width: 30px;
    height: 100%;

}
</style>
