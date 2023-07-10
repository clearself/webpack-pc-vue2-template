<template>
    <div class="event event-wrapper defense_set">
        <div class="attendance-list" style="margin-top: 0px;min-height: 100%;box-sizing: border-box;">
            <div class="ub ub-pj w100">
                <div class="list-tips">{{$store.state.common.currentTabName}}</div>
                <div>
                    <addBtn icon="el-icon-plus" title="添加规则" @click="addRuleShow" />
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
                @selection-change="handleSelectionChange">
                <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                </el-table-column>
                <el-table-column label="规则描述">
                    <template slot-scope="scope">
                        <span class="rule-des" style="color:#00e9ff;" v-html="filterRuleDesc(scope.row.arrObj)"></span>
                    </template>
                </el-table-column>

                <el-table-column label="操作" align="center" width="160" fixed="right" class-name="deepBg">
                    <template slot-scope="scope">
                        <opt-btn v-if="scope.row.status===0" title="禁用" @click="handleStart(scope.row)" icon="iconfont icon-jinyong"></opt-btn>
                        <opt-btn v-if="scope.row.status!==0" title="启用" @click="handleStart(scope.row)" icon="iconfont icon-qiyong"></opt-btn>
                        <opt-btn title="编辑" @click="handleEdit(scope.row)" icon="iconfont icon-bianji1"></opt-btn>
                        <opt-btn title="删除" @click="handleDel(scope.row)" icon="iconfont icon-shanchu3"></opt-btn>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog title="添加规则" width="900px" :visible.sync="data_typeDialog" custom-class="attendance-dialog">
            <el-form :model="data_typeForm" ref="data_typeForm" :rules="rules" :inline="true" class="unit defense_set">
                <el-form-item label="规则范围：" label-width="90px">
                </el-form-item>
                <div class="rule-area" style="width:83%;">
                    <p class="add-Btn" @click="addMappings">
                        <i class="el-icon-plus white-color-text" style="margin-right: 5px">添 加</i>
                    </p>
                    <div class="ub ub-ac w100">
                        <div class="ub ub-f1 ub-ver">
                            <div
                                class="ub ub-f1 ub-pj mapping-item"
                                style="padding:22px 5px;"
                                v-for="(_item,index) in data_typeForm.arrObj"
                                :key="index">
                                <div class="ub ub-ac" style="width:90%;">
                                    <el-form-item style="width:29%;margin: 0!important;" label="" :prop="'arrObj.'+ index +'.fieldName'" :rules="{required: true,message: '请选择字段名称',trigger: 'change'}">
                                        <el-select clearable size="small" v-model.trim="_item.fieldName" placeholder="请选择" @change="changeField(_item)">
                                            <el-option v-for="item in columnNames" :key="item.value" :label="item.name" :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <div class="connectLine"></div>
                                    <el-form-item
                                        style="width:29%;margin: 0!important;"
                                        label=""
                                        label-width="0px"
                                        :prop="'arrObj.'+ index +'.condition'"
                                        :rules="{required: true,message: '请选择条件',trigger: 'change'}">
                                        <el-select clearable size="small" v-model.trim="_item.condition" placeholder="请选择">
                                            <el-option v-for="item in terms" :key="item.value" :label="item.name" :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <div class="connectLine"></div>
                                    <el-form-item v-if="['reportLevel', 'reportType','isBanned'].includes(data_typeForm.arrObj[index].fieldName)" style="width:29%;margin: 0!important;" label="" label-width="0px" >
                                        <el-select
                                            v-model="_item.value"
                                            placeholder="请选择"
                                            size="small"
                                            :multiple="['reportLevel', 'reportType','isBanned'].includes(data_typeForm.arrObj[index].fieldName) ? true : false"
                                            collapse-tags
                                            :key="symbol()"
                                            popper-class="select-option">
                                            <el-option
                                                v-for="(it, ix) in getThird(index, data_typeForm)"
                                                :key="ix"
                                                :value="it.value"
                                                :label="it.name">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item v-else style="width:29%;margin: 0!important;" label="" label-width="0px">
                                        <el-input size="small" placeholder="请输入" v-model.trim="_item.value"></el-input>
                                    </el-form-item>
                                </div>
                                <div v-if="index>0" class="ub ub-ac">
                                    <span style="font-size:18px;" class="del-btn el-icon-circle-close" @click="removeMapping(index)"></span>
                                </div>
                            </div>
                            <div v-if="data_typeForm.arrObj.length === 0" class="empty-array ub ub-ac w100 ub-pc">
                                暂无数据
                            </div>
                        </div>
                    </div>
                </div>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <searchBtn title="确 认" @click="validAdd('data_typeForm')" />
                <cancel-btn title="取 消" style="margin-left: 10px;" @click="data_typeDialog = false"></cancel-btn>
            </div>
        </el-dialog>
        <el-dialog title="编辑规则" width="900px" :visible.sync="data_typeDialogEdit" custom-class="attendance-dialog">
            <el-form :model="data_typeFormEdit" ref="data_typeFormEdit" :rules="rules" :inline="true" class="unit defense_set">
                <el-form-item label="规则范围：" label-width="90px">
                </el-form-item>
                <div class="rule-area" style="width:83%;">
                    <p class="add-Btn" @click="addMappingsEdit">
                        <i class="el-icon-plus white-color-text" style="margin-right: 5px">添 加</i>
                    </p>
                    <div class="ub ub-ac w100">
                        <div class="ub ub-f1 ub-ver">
                            <div
                                class="ub ub-f1 ub-pj mapping-item"
                                style="padding:22px 5px;"
                                v-for="(_item,index) in data_typeFormEdit.arrObj"
                                :key="index">
                                <div class="ub ub-ac" style="width:90%;">
                                    <el-form-item style="width:29%;margin: 0!important;" label="" :prop="'arrObj.'+ index +'.fieldName'" :rules="{required: true,message: '请选择字段名称',trigger: 'change'}">
                                        <el-select clearable size="small" v-model.trim="_item.fieldName" placeholder="请选择" @change="changeFieldEdit(_item)">
                                            <el-option v-for="item in columnNames" :key="item.value" :label="item.name" :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <div class="connectLine"></div>
                                    <el-form-item
                                        style="width:29%;margin: 0!important;"
                                        label=""
                                        label-width="0px"
                                        :prop="'arrObj.'+ index +'.condition'"
                                        :rules="{required: true,message: '请选择条件',trigger: 'change'}">
                                        <el-select clearable size="small" v-model.trim="_item.condition" placeholder="请选择">
                                            <el-option v-for="item in terms" :key="item.value" :label="item.name" :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <div class="connectLine"></div>
                                    <el-form-item v-if="['reportLevel', 'reportType','isBanned'].includes(data_typeFormEdit.arrObj[index].fieldName)" style="width:30%;margin: 0!important;" label="" label-width="0px" >
                                        <el-select
                                            style="width:178px;"
                                            v-model="_item.value"
                                            placeholder="请选择"
                                            size="small"
                                            :multiple="['reportLevel', 'reportType','isBanned'].includes(data_typeFormEdit.arrObj[index].fieldName) ? true : false"
                                            collapse-tags
                                            :key="symbol()"
                                            popper-class="select-option">
                                            <el-option
                                                v-for="(it, ix) in getThird(index, data_typeFormEdit)"
                                                :key="ix"
                                                :value="it.value"
                                                :label="it.name">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item v-else style="width:30%;margin: 0!important;" label="" label-width="0px">
                                        <el-input size="small" placeholder="请输入" v-model.trim="_item.value"></el-input>
                                    </el-form-item>
                                </div>
                                <div v-if="index>0" class="ub ub-ac">
                                    <span style="font-size:18px;" class="del-btn el-icon-circle-close" @click="removeMappingEdit(index)"></span>
                                </div>
                            </div>
                            <div v-if="data_typeFormEdit.arrObj.length === 0" class="empty-array ub ub-ac w100 ub-pc">
                                暂无数据
                            </div>
                        </div>
                    </div>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <searchBtn title="确 定" @click="validSaveEdit('data_typeFormEdit')"/>
                <cancel-btn title="取 消" style="margin-left: 10px;" @click="data_typeDialogEdit = false"></cancel-btn>
            </div>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="delDialog" width="30%" custom-class="attendance-dialog">
            <span>确定删除吗？</span>
            <span slot="footer" class="dialog-footer">
                <searchBtn title="确 定" @click="delConfim" />
                <cancel-btn title="取 消" style="margin-left: 10px;" @click="delDialog = false"></cancel-btn>
            </span>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="startDialog" width="30%" custom-class="attendance-dialog">
            <span>确定{{status===0?'禁用':'启用'}}吗？</span>
            <span slot="footer" class="dialog-footer">
                <searchBtn title="确 定" @click="startConfim" />
                <cancel-btn title="取 消" style="margin-left: 10px;" @click="startDialog = false"></cancel-btn>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {
    add_rule,
    get_alarm_type,
    get_rule_list,
    delete_rule,
    start_rule
} from '../../server/protect_net/api.js'
export default {
    name: 'DefenseSet',
    data() {
        return {
            startDialog: false,
            columnNames: [
                {
                    name: '事件等级',
                    value: 'reportLevel'
                }, {
                    name: '事件类型',
                    value: 'reportType'
                }, {
                    name: '源IP',
                    value: 'srcIp'
                }, {
                    name: '目的IP',
                    value: 'desIp'
                }, {
                    name: '事件名称',
                    value: 'reportName'
                }, {
                    name: '是否封禁',
                    value: 'isBanned'
                }

            ],
            terms: [
                {
                    name: '等于',
                    value: 0
                }, {
                    name: '不等',
                    value: 1
                }, {
                    name: '包含',
                    value: 2
                }, {
                    name: '不包含',
                    value: 3
                }
            ],
            alarm_level: [
                {
                    name: '高',
                    value: 4
                }, {
                    name: '中高',
                    value: 3
                }, {
                    name: '中',
                    value: 2
                }, {
                    name: '中低',
                    value: 1
                }, {
                    name: '低',
                    value: 0
                }

            ],
            banned_type: [
                {
                    name: '已封禁',
                    value: 1
                }, {
                    name: '未封禁',
                    value: 0
                }
            ],
            alarm_type: [],
            data_typeFormEdit: {
                id: '',
                arrObj: []
            },
            data_typeDialogEdit: false,
            deleteId: '',
            status: '',
            delAllDialog: false,
            delDialog: false,
            data_typeDialog: false,
            data_typeForm: {
                arrObj: []
            },
            rules: {},

            isOpen: false,
            formLabelWidth: '100px',
            loading: false,
            total_num: 0,
            recordId: '',
            multipleSelection: [],
            tableData: [{
                date: '2016-05-02',
                name: '王小虎',
                person: [{
                    name: 123
                }]
            }, {
                date: '2016-05-02',
                name: '王小虎',
                person: [{
                    name: 123
                }]
            }],
            get_params: {
                page: 1,
                size: 10,
                ruleDesc: ''
            }
        }
    },
    mounted() {
        this.initAlarmType()
        this.$nextTick(() => {
            this.get_data()
        })
    },
    methods: {
        changeField(item) {
            item.value = ''
        },
        changeFieldEdit(item) {
            console.log(item)
            item.value = ''
        },
        filterRuleDesc(obj) {
            console.log('obj', obj)
            if (obj && obj.length > 0) {
                let arr = []
                let fieldNameCN = ''; let conditionCN = ''; let valueCN = ''; let fieldName = ''; let condition = ''; let value = ''
                obj.forEach(item => {
                    fieldName = item.fieldName
                    condition = item.condition
                    value = item.value
                    fieldNameCN = this.columnNames.filter(_item => _item.value === fieldName)[0].name
                    conditionCN = this.terms.filter(_item => _item.value === condition)[0].name
                    switch (fieldName) {
                        case 'reportLevel':
                            valueCN = this.getValue(value, this.alarm_level)
                            break
                        case 'reportType':
                            valueCN = this.getValue(value, this.alarm_type)
                            break
                        case 'isBanned':
                            valueCN = this.getValue(value, this.banned_type)
                            break

                        default:
                            valueCN = value
                            break
                    }
                    arr.push(fieldNameCN + conditionCN + valueCN)
                })

                return arr.join('<i class="table-and" style="color:#fff;font-style:normal;margin:0 10px;">and</i>')
            }
        },
        getValue(arr1, arr2) {
            console.log('arr1', arr1)
            console.log('arr2', arr2)
            let arr = []
            arr1.map(item => {
                if (arr2.some(_item => _item.value == item)) {
                    let name = arr2.filter(_item => _item.value == item)[0].name
                    arr.push(name)
                }
            })
            return arr.join('、')
        },
        symbol() {
            // eslint-disable-next-line symbol-description
            return Symbol()
        },
        initAlarmType() {
            this.alarm_type = []
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_alarm_type(data).then(res => {
                console.log('type', res)

                if (res.length > 0) {
                    res.forEach(item => {
                        let obj = {}
                        obj.name = item.name
                        obj.value = item.id
                        this.alarm_type.push(obj)
                    })
                }
            }).catch(error => {
                this.loading = false
                console.log('error' + error)
            })
        },
        getThird(index, form) {
            if (form.arrObj[index].fieldName == 'reportType') {
                return this.alarm_type
            } else if (form.arrObj[index].fieldName == 'reportLevel') {
                return this.alarm_level
            } else if (form.arrObj[index].fieldName == 'isBanned') {
                return this.banned_type
            }
        },
        addRuleShow() {
            this.data_typeForm.arrObj = []
            this.data_typeForm.arrObj.push({
                fieldName: '',
                condition: '',
                value: ''
            })
            this.data_typeDialog = true
        },
        removeMapping(index) {
            this.data_typeForm.arrObj.splice(index, 1)
        },
        addMappings() {
            this.data_typeForm.arrObj.push({
                fieldName: '',
                condition: '',
                value: ''
            })
        },
        removeMappingEdit(index) {
            this.data_typeFormEdit.arrObj.splice(index, 1)
        },
        addMappingsEdit() {
            this.data_typeFormEdit.arrObj.push({
                fieldName: '',
                condition: '',
                value: ''
            })
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
                queryData: {},
                paramsData: {}
            }
            get_rule_list(data).then(res => {
                this.loading = false
                console.log('规则', res)
                if (res.length > 0) {
                    res.forEach(item => {
                        this.tableData.push(item)
                    })
                }
            }).catch(error => {
                this.loading = false
                console.log('error' + error)
            })
        },
        validAdd(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    console.log(formName)
                    this.addData()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        addData() {
            if (this.data_typeForm.arrObj.length == 0) {
                this.$message({
                    message: '请添加规则！',
                    type: 'warning'
                })
                return
            }
            let data = {
                queryData: {},
                paramsData: {
                    arrObj: this.data_typeForm.arrObj
                }
            }
            console.log(data)
            add_rule(data).then(res => {
                this.data_typeDialog = false
                this.$message({
                    message: '添加成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(error => {
                console.log('error', error)
            })
        },
        editData() {
            if (this.data_typeFormEdit.arrObj.length == 0) {
                this.$message({
                    message: '请添加规则！',
                    type: 'warning'
                })
                return
            }
            let data = {
                queryData: {},
                paramsData: {
                    id: this.data_typeFormEdit.id,
                    arrObj: this.data_typeFormEdit.arrObj
                }
            }
            console.log(data)
            add_rule(data).then(res => {
                this.data_typeDialogEdit = false
                this.$message({
                    message: '修改成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(error => {
                console.log('error', error)
            })
        },
        handleStart(obj) {
            this.startDialog = true
            this.deleteId = obj.id
            this.status = obj.status
        },
        startConfim() {
            let data = {
                queryData: {},
                paramsData: {
                    id: this.deleteId,
                    status: this.status === 0 ? 1 : 0
                }
            }
            start_rule(data).then(res => {
                this.startDialog = false
                this.$message({
                    message: this.status === 0 ? '禁用成功' : '启用成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(error => {
                this.startDialog = false
                console.log('error', error)
            })
        },
        handleDel(obj) {
            this.delDialog = true
            this.deleteId = obj.id
        },
        delConfim() {
            let data = {
                queryData: {},
                paramsData: {
                    id: this.deleteId
                }
            }
            delete_rule(data).then(res => {
                this.delDialog = false
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(error => {
                this.delDialog = false
                console.log('error', error)
            })
        },
        validSaveEdit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.editData()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        handleEdit(obj) {
            console.log(obj)
            this.data_typeDialogEdit = true
            this.data_typeFormEdit = {
                id: obj.id,
                arrObj: this.$deepCopy(obj.arrObj)
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
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

        .event ::v-deep .el-radio__label {
            color: #C0C4CC;
        }

        .el-tag.el-tag--success {
            background-color: transparent;
            border-color: #01c5ff;
            color: #00fdff;
        }

        .el-select ::v-deep .el-tag {
            background-color: transparent;
            border-color: #1bd7fa;
            color: #1bd7fa;
        }

        .bigTable ::v-deep .el-table__fixed-right::before,
        .bigTable .el-table__fixed::before {
            background: transparent !important;
        }

        .rule-area {
            width: 88%;
            position: relative;
            left: 100px;
            top: -20px;
            background: rgba(0, 0, 0, .2);
            border-radius: 4px 4px 2px 4px;
            padding: 20px;
            box-sizing: border-box;
            border: 1px solid rgba(28, 215, 250, .2);
        }

        .add-Btn {
            position: absolute;
            top: -26px;
            right: 10px;
            color: #01e9ff;
            font-size: 14px;
            cursor: pointer;
        }

        .del-btn {
            display: inline-block;
            box-sizing: border-box;
            width: 30px;
            color: #1cd7fa;
            cursor: pointer;
            text-align: center;
        }

        .connectLine {
            width: 16px;
            margin-left: 5px;
            /*margin: 0 4px;*/
            height: 1px;
            content: '';
            font-size: 0;
            box-sizing: border-box;
            display: inline-block;
            background-color: #fff;
        }

        .empty-array {
            color: #fff;
            height: 68px;
        }

        .mapping-item:nth-child(odd) {
            background-color: rgba(0, 192, 255, .1);
        }

        .mapping-item:nth-child(even) {
            background-color: rgba(0, 240, 255, .2);
        }
    </style>
    <style>
        .submit-dialog.el-dialog {
            border: 1px solid #4faffd !important;
            box-shadow: 0px 0px 14px #00b4ff inset;
            background-color: #042842;
        }

        .submit-dialog .el-dialog__footer {
            text-align: center;
        }

        .submit-dialog .el-button {
            position: relative;
            width: 110px;
            height: 36px;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            border: 1px solid #33c4f1;
            border-radius: 6px;
            background-color: transparent;
        }
        .defense_set .el-input--small .el-input__inner{
             width: 178px;
        }
    </style>
