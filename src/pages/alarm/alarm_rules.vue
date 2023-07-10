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
                <div class="list-tips">事件归并规则</div>
                <div class="ub">
                    <el-button icon="el-icon-plus" size="small" type="primary" @click="addDialog = true" v-per="['alarm_merger_add']">添加</el-button>
                    <el-button style="margin-left: 10px;" icon="el-icon-delete" size="small" type="danger" @click="handleDeleteAll" v-per="['alarm_merger_del']">删除</el-button>
                </div>
            </div>
            <el-table
                ref="multipleTable"
                v-loading="loading"
                class='bigTable'
                :data="tableData"
                border
                stripe
                :height="tabHeight"
                :row-class-name="tableRowClassName"
                :row-style="{ height: '32px' }"
                :header-row-style="{ height: '32px' }"
                tooltip-effect="dark"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="30" align="center"></el-table-column>
                <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                </el-table-column>
                <el-table-column prop="rulesName" label="规则名称" width="300">
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
                <el-table-column prop="alarmTypeName" label="事件类型" width="200">
                    <template slot-scope="{row}">
                        <p>{{row.alarmTypeName ? row.alarmTypeName : '--'}}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="mergingTime" label="归并时间间隔" width="200">
                </el-table-column>
                <el-table-column prop="mergingCount" label="归并条数" align="right" width="100">
                    <template slot-scope="{row}">
                        <p style="color:#0052d9">{{row.mergingCount}}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="mergingCondition" label="归并条件">
                    <template slot-scope="{row}">
                        <!-- <p>{{row.mergingCondition | filterCondition}}</p> -->
                        <el-tag type="success" size="mini" style="border:1px solid rgba(56,125,238,.4);" v-for="item in filterCondition(row.mergingCondition)" :key="item">{{item}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.startType == 0" type="text" size="small" @click="handleChangeState(scope.row)" v-per="['alarm_merger_start']">启用</el-button>
                        <el-button v-if="scope.row.startType == 1" type="text" size="small" @click="handleChangeState(scope.row)" v-per="['alarm_merger_stop']">停用</el-button>
                        <el-button type="text" size="small" @click="handleEdit(scope.row)" v-per="['alarm_merger_edit']">编辑</el-button>
                        <el-button type="text" size="small" @click="delUserBtn(scope.row)" v-per="['alarm_merger_del']">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size"  style="padding-top:10px" @pagination="get_data" v-show="total_num>0"/>
        </div>
        <!--增加内容开始-->
        <el-dialog title="添加归并规则" :visible.sync="addDialog" width="700px" custom-class="common-dialog">
            <el-form :model="alarmRuleForm" :rules="rules" ref="alarmRuleForm" label-position="top">
                <div class="ub ub-pj">
                    <el-form-item label="规则名称：" prop="name" :label-width="formLabelWidth">
                        <el-input size="small" v-model.trim="alarmRuleForm.name" placeholder="请输入" autocomplete="off" clearable style="width: 300px"></el-input>
                    </el-form-item>
                    <el-form-item label="事件类型：" prop="alarmType" :label-width="formLabelWidth">
                        <el-select
                            v-model="alarmRuleForm.alarmType"
                            placeholder="请选择"
                            style="width: 300px"
                            clearable
                            size="small">
                            <el-option v-for="item in alarmTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <el-form-item class="mul-row" :label="'归并时间间隔：'" prop="interval" :label-width="formLabelWidth">
                    <div class="ub">
                        <el-input size="small" v-model.trim="alarmRuleForm.interval" oninput ="value=value.replace(/[^0-9.]/g,'')"  @blur="alarmRuleForm.interval = $event.target.value" placeholder="请输入1-48的整数，从产生事件到完成一次归并的时间间隔" autocomplete="off" clearable style="width: 610px;" class="shijian">
                        </el-input>
                        <div style="font-size:12px;border:1px solid #dcdcdc;height:32px;width:60px;line-height:30px;text-align: center;color:#0052d9;border-radius: 4px;">小时</div>
                    </div>
                </el-form-item>
                <el-form-item label="归并条数：" prop="number" :label-width="formLabelWidth">
                    <el-input size="small" v-model.trim="alarmRuleForm.number" oninput ="value=value.replace(/[^0-9.]/g,'')"  @blur="alarmRuleForm.number = $event.target.value" placeholder="请输入1-100000的整数，事件达到合并条数后完成一次归并" autocomplete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="归并条件：" prop="checkList" :label-width="formLabelWidth">
                    <el-checkbox-group v-model="alarmRuleForm.checkList" class="check-box">
                        <el-checkbox label="1">事件名称</el-checkbox>
                        <el-checkbox label="2">源IP</el-checkbox>
                        <el-checkbox label="3">目的IP</el-checkbox>
                        <el-checkbox label="4">源端口</el-checkbox>
                        <el-checkbox label="5">目的端口</el-checkbox>
                        <el-checkbox label="6">事件等级</el-checkbox>
                        <el-checkbox label="7">事件类型</el-checkbox>
                        <el-checkbox label="8">规则ID</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialog=false" size="small">取消</el-button>
                <el-button type="primary" @click="submitForm('alarmRuleForm')" size="small">确认</el-button>
            </span>
        </el-dialog>
        <!--编辑内容开始-->
        <el-dialog title="编辑归并规则" :visible.sync="editDialog" width="700px" custom-class="common-dialog">
            <el-form :model="alarmRuleFormEdit" :rules="rules" ref="alarmRuleFormEdit"  label-position="top">
                <div class="ub ub-pj">
                    <el-form-item label="规则名称：" prop="name" :label-width="formLabelWidth">
                        <el-input size="small" v-model.trim="alarmRuleFormEdit.name" placeholder="请输入" autocomplete="off" clearable style="width: 300px"></el-input>
                    </el-form-item>
                    <el-form-item label="事件类型：" prop="alarmType" :label-width="formLabelWidth">
                        <el-select
                            v-model="alarmRuleFormEdit.alarmType"
                            placeholder="请选择"
                            style="width: 300px"
                            clearable
                            size="small">
                            <el-option v-for="item in alarmTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <el-form-item class="mul-row" :label="'归并时间间隔：'" prop="interval" :label-width="formLabelWidth">
                    <div class="ub">
                        <el-input size="small" v-model.trim="alarmRuleFormEdit.interval" oninput ="value=value.replace(/[^0-9.]/g,'')"  @blur="alarmRuleFormEdit.interval = $event.target.value" placeholder="请输入1-48的整数，从产生事件到完成一次归并的时间间隔" autocomplete="off" clearable  style="width: 610px" class="shijian">
                        </el-input>
                        <div style="font-size:12px;border:1px solid #dcdcdc;height:32px;width:60px;line-height:30px;text-align: center;color:#0052d9;border-radius: 4px;">小时</div>
                    </div>
                </el-form-item>
                <el-form-item label="归并条数：" prop="number" :label-width="formLabelWidth">
                    <el-input size="small" v-model.trim="alarmRuleFormEdit.number" oninput ="value=value.replace(/[^0-9.]/g,'')"  @blur="alarmRuleFormEdit.number = $event.target.value" placeholder="请输入1-100000的整数，事件达到合并条数后完成一次归并" autocomplete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="归并条件：" prop="checkList" :label-width="formLabelWidth">
                    <el-checkbox-group v-model="alarmRuleFormEdit.checkList" class="check-box">
                        <el-checkbox label="1">事件名称</el-checkbox>
                        <el-checkbox label="2">源IP</el-checkbox>
                        <el-checkbox label="3">目的IP</el-checkbox>
                        <el-checkbox label="4">源端口</el-checkbox>
                        <el-checkbox label="5">目的端口</el-checkbox>
                        <el-checkbox label="6">事件等级</el-checkbox>
                        <el-checkbox label="7">事件类型</el-checkbox>
                        <el-checkbox label="8">规则ID</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialog=false" size="small">取消</el-button>
                <el-button type="primary" @click="submitFormEdit('alarmRuleFormEdit')" size="small">确认</el-button>
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
import { typeOf } from '../../assets/js/public_fun.js'
import {
    get_alarm_rule_list,
    save_alarm_rule,
    delete_alarm_rule,
    get_alarm_options,
    change_alarm_start_type
} from '../../server/alarm/api.js'
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
            alarmTypeList: [],
            alarmRuleForm: {
                name: '',
                alarmType: '',
                interval: '',
                number: '',
                unit: '1',
                checkList: []
            },
            alarmRuleFormEdit: {
                id: '',
                name: '',
                alarmType: '',
                startType: '',
                interval: '',
                number: '',
                unit: '1',
                checkList: []
            },
            rules: {
                name: [{
                    required: true,
                    message: '请输入规则名称',
                    trigger: 'blur'
                }],
                // alarmType: [{
                //     required: true,
                //     message: '请选择事件类型',
                //     trigger: 'change'
                // }],
                interval: [{
                    required: true,
                    message: '请输入归并时间间隔',
                    trigger: 'blur'
                }],
                number: [{
                    required: true,
                    message: '请输入归并条数',
                    trigger: 'blur'
                }],
                checkList: [{
                    required: true,
                    message: '请选择归并条件',
                    trigger: 'change'
                }]
            }
        }
    },
    filters: {
        // filterCondition(val) {
        //     if (!val) return '--'
        //     let arr = val.split(',')
        //     let obj = {
        //         1: '事件名称',
        //         2: '源IP',
        //         3: '目的IP',
        //         4: '源端口',
        //         5: '目的端口',
        //         6: '事件等级',
        //         7: '事件类型',
        //         8: '规则ID'
        //     }
        //     let arrCn = arr.map(it => obj[it])
        //     console.log(arrCn)
        //     return arrCn.join(',')
        // }
    },
    watch: {
        addDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.alarmRuleForm.resetFields()
                }
            }
        },
        editDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.alarmRuleFormEdit.resetFields()
                }
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.get_data()
            this.getAlarmType()
        })
    },
    methods: {
        filterCondition(val) {
            if (!val) return '--'
            let arr = val.split(',')
            let obj = {
                1: '事件名称',
                2: '源IP',
                3: '目的IP',
                4: '源端口',
                5: '目的端口',
                6: '事件等级',
                7: '事件类型',
                8: '规则ID'
            }
            let arrCn = arr.map(it => obj[it])
            console.log(arrCn)
            return arrCn
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
        getAlarmType() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_alarm_options(data).then(res => {
                console.log(res, '事件类型')
                this.alarmTypeList = res ?? []
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
                    rulesName: this.get_params.name,
                    startType: this.get_params.status
                }
            }
            get_alarm_rule_list(data).then(res => {
                console.log(res)
                this.loading = false
                this.total_num = res.total
                let list = res.records
                if (list.length > 0) {
                    list.forEach(item => {
                        let obj = {}
                        obj.id = item.id
                        obj.rulesName = item.rulesName
                        obj.startType = item.startType
                        obj.alarmType = item.alarmType ? item.alarmType : ''
                        obj.alarmTypeName = item.alarmTypeName
                        obj.mergingTime = item.mergingTime
                        obj.mergingCount = item.mergingCount
                        obj.mergingCondition = item.mergingCondition
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
                    this.addRules()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        addRules() {
            let data = {
                queryData: {},
                paramsData: {
                    rulesName: this.alarmRuleForm.name,
                    startType: 1,
                    alarmType: this.alarmRuleForm.alarmType,
                    mergingTime: +this.alarmRuleForm.interval,
                    mergingCount: +this.alarmRuleForm.number,
                    mergingCondition: this.alarmRuleForm.checkList.join(',')
                }
            }
            save_alarm_rule(data).then(res => {
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
        editRules() {
            let data = {
                queryData: {},
                paramsData: {
                    id: this.alarmRuleFormEdit.id,
                    rulesName: this.alarmRuleFormEdit.name,
                    startType: this.alarmRuleFormEdit.startType,
                    alarmType: this.alarmRuleFormEdit.alarmType,
                    mergingTime: +this.alarmRuleFormEdit.interval,
                    mergingCount: +this.alarmRuleFormEdit.number,
                    mergingCondition: this.alarmRuleFormEdit.checkList.join(',')
                }
            }
            save_alarm_rule(data).then(res => {
                console.log(res)
                this.editDialog = false
                this.$message({
                    message: '编辑成功',
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
                    this.editRules(false)
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
            delete_alarm_rule(data).then(res => {
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
        handleSizeChange(val) {
            this.get_params.size = val
            this.get_data()
        },
        handleCurrentChange(val) {
            this.get_params.page = val
            this.get_data()
        },
        handleEdit(row) {
            console.log('row', typeOf())
            this.alarmRuleFormEdit.id = row.id
            this.alarmRuleFormEdit.name = row.rulesName
            this.alarmRuleFormEdit.alarmType = row.alarmType
            this.alarmRuleFormEdit.startType = row.startType
            this.alarmRuleFormEdit.interval = row.mergingTime
            this.alarmRuleFormEdit.number = row.mergingCount
            this.alarmRuleFormEdit.checkList = row.mergingCondition.split(',')
            this.editDialog = true
        },
        handleChangeState(row) {
            let data = {
                queryData: {},
                paramsData: {
                    id: row.id,
                    startType: row.startType == 1 ? 0 : 1
                }
            }
            change_alarm_start_type(data).then(res => {
                this.$message({
                    message: '操作成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1000)
            })
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        }
    }
}
</script>

<style lang="scss" scoped>
.shijian{
    ::v-deep input{
        border-right:none !important;
    }
}
.check-box{
    ::v-deep .el-checkbox__label{
        font-size:12px !important;
        color:rgba(0,0,0,.9);
    }
    ::v-deep .el-checkbox__label:hover{
        color:rgba(0,0,0,.9);
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
    //margin: 0;
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
.event ::v-deep .mul-row .el-form-item__label{
    line-height: 16px !important;
}
.event ::v-deep .el-input-group__append {
    background-color: transparent;
    border-color: #1cd7fa;
    width: 30px;
    padding-right: 30px;
    padding-left: 15px;
    border: 1px solid #1cd7fa;
}
.event ::v-deep .el-input-group__append div.el-select .el-input__inner {
    border: none;
    color: #1cd7fa;
    box-shadow: none;
}
</style>
