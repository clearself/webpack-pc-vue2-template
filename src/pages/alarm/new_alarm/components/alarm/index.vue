<template>
    <div>
        <el-drawer :visible.sync="alarmDialog" direction="rtl" :size="720" :show-close="true" :before-close="closeDialog" :wrapperClosable="false" :title="addForm.id ? '编辑事件':'发起事件'"  custom-class="drawer-dialog">
            <div class="drawer-content mb-3" style="margin-top: -5px;">
                <div
                    style="
                        position: relative;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: 100%;
                        overflow-x: hidden;
                        overflow-y: auto;
                    ">
                    <div class="drawer-pad">
                        <el-form :model="addForm" :rules="rules" ref="addForm" :inline="true" label-position="top">
                            <div class="ub ub-pj">
                                <el-form-item label="事件名称:" :label-width="formLabelWidth" prop="reportName">
                                    <el-input :maxlength="100" placeholder="请输入事件名称" clearable v-model="addForm.reportName" size="small" style="width: 300px" @change="reportNameChange"></el-input>
                                </el-form-item>
                                <el-form-item label="事件类型:" :label-width="formLabelWidth" prop="reportType">
                                    <el-select size="small" v-model="addForm.reportType" clearable placeholder="请选择" style="width: 300px">
                                        <el-option v-for="(item) in typeList" :key="item.id" :label="item.name" :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div  class="ub ub-pj">
                                <el-form-item label="目的IP:" prop="desIp" :label-width="formLabelWidth">
                                    <el-input style="width: 300px" placeholder="请输入目的IP" v-model="addForm.desIp" size="small">
                                    </el-input>
                                </el-form-item>
                                <el-form-item label="目的端口:" :label-width="formLabelWidth" prop="desPort">
                                    <el-input
                                        style="width: 300px"
                                        placeholder="请输入目的端口"
                                        clearable
                                        v-model="addForm.desPort"
                                        type="number"
                                        onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                                        size="small"></el-input>
                                </el-form-item>
                            </div>
                            <div class="ub ub-pj">
                                <el-form-item label="源IP:" :label-width="formLabelWidth" prop="srcIp">
                                    <el-input style="width: 300px" placeholder="请输入源IP" clearable v-model="addForm.srcIp" size="small"></el-input>
                                </el-form-item>
                                <el-form-item label="源端口:" :label-width="formLabelWidth" prop="srcPort">
                                    <el-input
                                        style="width: 300px"
                                        placeholder="请输入源端口"
                                        clearable
                                        v-model="addForm.srcPort"
                                        type="number"
                                        onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                                        size="small"></el-input>
                                </el-form-item>
                            </div>
                            <div class="ub ub-pj">
                                <el-form-item label="事件等级:" :label-width="formLabelWidth" prop="reportLevel">
                                    <el-select style="width: 300px" size="small" v-model="addForm.reportLevel" clearable placeholder="请选择">
                                        <el-option :key="index" v-for="(item,index) in reportLevelList" :label="item.name" :value="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="事件状态:" :label-width="formLabelWidth" prop="reportStatus">
                                    <el-select style="width: 300px" size="small" v-model="addForm.reportStatus" clearable placeholder="请选择">
                                        <el-option :key="index" v-for="(item,index) in reportStatusList" :label="item.name" :value="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>

                            <el-form-item label="事件描述:">
                                <div class="ub w100">
                                    <div>
                                        <div class="ub ub-pc ub-f1">
                                            <vue-ueditor-wrap v-model="addForm.reportDesc" :config="myConfig"></vue-ueditor-wrap>
                                        </div>
                                    </div>
                                </div>
                            </el-form-item>
                            <el-form-item label="创建工单:" :label-width="formLabelWidth" prop="isStart " v-if="!addForm.id">
                                <KSwitch :value="addForm.isStart " class="kswitch" :handle="handleSwitch" @changeSwitch="isStartChange"></KSwitch>
                            </el-form-item>
                            <div class="ub ub-pj" v-if="addForm.isStart">
                                <el-form-item label="工单名称:" :label-width="formLabelWidth" prop="workOrderName">
                                    <el-input placeholder="请输入" clearable v-model="addForm.workOrderName" size="small" style="width: 300px"></el-input>
                                </el-form-item>
                                <el-form-item label="工单模板:" :label-width="formLabelWidth" prop="workMouldId">
                                    <el-select style="width: 300px" size="small" v-model="addForm.workMouldId" clearable placeholder="请选择">
                                        <el-option :key="index" v-for="(item,index) in workMouldIdList" :label="item.name" :value="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div class="ub ub-pj" v-if="addForm.isStart">
                                <el-form-item label="优先级:" :label-width="formLabelWidth" prop="level">
                                    <el-select style="width: 300px" size="small" v-model="addForm.level" clearable placeholder="请选择">
                                        <el-option :key="index" v-for="(item,index) in levelList" :label="item.name" :value="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <el-form-item label="工单描述:" v-if="addForm.isStart">
                                <div class="ub w100 mb-3">
                                    <div>
                                        <div class="ub ub-pc ub-f1">
                                            <vue-ueditor-wrap v-model="addForm.workOrderContent" :config="myConfig"></vue-ueditor-wrap>
                                        </div>
                                    </div>
                                </div>
                            </el-form-item>

                        </el-form>
                        <div
                            slot="footer"
                            class="dialog-footer"
                            style="
                            position: fixed;
                            bottom: 0;
                            right: 0;
                            z-index: 9999;
                            width: 720px;
                            background: #fff;
                            padding-bottom: 10px;
                            text-align: right;">
                            <el-button @click="closeDialog" size="small" class="mr-1">取消</el-button>
                            <Debounce :time='1500' :isDebounce="2">
                                <el-button type="primary" @click.native="handleQuery('addForm')" size="small" style="margin-right:30px">确认</el-button>
                            </Debounce>
                        </div>
                    </div>
                </div>
            </div>
        </el-drawer>
    </div>
</template>

<script>
import { addReport, getAlarmType, getAlarmWorkMould } from '@/server/alarm/alarm.js'
import VueUeditorWrap from '@/components/vue-ueditor-wrap.vue' // ES6 Module
import ueditorConfig from '@/mixins/ueditorConfig'
export default {
    name: 'Alarm',
    mixins: [ueditorConfig],
    components: {
        VueUeditorWrap

    },
    props: {
        selectMode: {
            type: Number,
            default() {
                return 0
            }
        },
        alarmDialog: {
            type: Boolean,
            default() {
                return false
            }
        },
        rowData: {
            type: Object,
            default() {
                return {}
            }
        }
    },
    watch: {
        alarmDialog(newVal, oldVal) {
            if (!newVal) {
                this.$refs.addForm.resetFields()
            } else {
                this.getAlarmTypeData()
                this.getAlarmWorkMouldData()
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.getAlarmTypeData()
            this.getAlarmWorkMouldData()
        })
    },
    data() {
        return {
            allData: [],
            logIds: [],
            reportLevelList: [
                {
                    id: 0,
                    name: '低'
                },
                {
                    id: 1,
                    name: '中低'
                },
                {
                    id: 2,
                    name: '中'
                },
                {
                    id: 3,
                    name: '中高'
                },
                {
                    id: 4,
                    name: '高'
                }
            ],
            reportStatusList: [
                {
                    id: 0,
                    name: '待确认'
                },
                {
                    id: 1,
                    name: '已确认'
                },
                {
                    id: 2,
                    name: '已处理'
                },
                {
                    id: 3,
                    name: '已驳回'
                }
            ],
            levelList: [
                {
                    id: 1,
                    name: '高'
                },
                {
                    id: 2,
                    name: '中'
                },
                {
                    id: 3,
                    name: '低'
                }
            ],
            workMouldIdList: [],
            handleSwitch: true,
            formLabelWidth: '83px',
            typeList: [],
            rules: {
                isStart: [{
                    required: true,
                    message: '请选择',
                    trigger: 'change'
                }],
                reportStatus: [{
                    required: true,
                    message: '请输入名称',
                    trigger: 'change'
                }],
                reportName: [{
                    required: true,
                    message: '请输入名称',
                    trigger: 'blur'
                }],
                reportType: [{
                    required: true,
                    message: '请选择事件类型',
                    trigger: 'change'
                }],
                status: [{
                    required: true,
                    message: '请选择变更状态',
                    trigger: 'change'
                }],
                desIp: [
                    {
                        required: true,
                        message: '请输入目的IP',
                        trigger: 'blur'
                    },
                    {
                        pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
                        message: '请输入合法的IP地址'

                    }
                ],
                srcIp: [
                    {
                        required: true,
                        message: '请输入源IP',
                        trigger: 'blur'
                    },
                    {
                        pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
                        message: '请输入合法的IP地址'

                    }
                ],

                reportLevel: [{
                    required: true,
                    message: '请选择事件等级',
                    trigger: 'change'
                }],
                workOrderName: [{
                    required: true,
                    message: '请输入名称',
                    trigger: 'blur'
                }],
                level: [{
                    required: true,
                    message: '请选择优先级',
                    trigger: 'change'
                }],
                workMouldId: [{
                    required: true,
                    message: '请选择工单模板',
                    trigger: 'change'
                }]
            },
            addForm: {
                id: '',
                reportDesc: '',
                reportName: '',
                reportType: '',
                reportLevel: '',
                reportStatus: 0,
                srcIp: '',
                srcPort: '',
                desIp: '',
                desPort: '',
                isStart: false,
                workOrderName: '',
                workMouldId: '',
                level: '',
                workOrderContent: ''
            }
        }
    },
    computed: {},
    methods: {
        reportNameChange(val) {
            if (val && this.addForm.isStart) {
                this.addForm.workOrderName = `${val}${this.$moment().format('x')}`
            } else {
                this.addForm.workOrderName = ''
            }
        },
        getAlarmTypeData() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            getAlarmType(data).then(res => {
                if (res.length > 0) {
                    this.typeList = res.map((item) => {
                        return {
                            id: item.id,
                            name: item.name
                        }
                    })
                }
            }).catch(error => {
                console.log(error + 'error')
            })
        },
        getAlarmWorkMouldData() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            getAlarmWorkMould(data).then(res => {
                this.workMouldIdList = res
            }).catch(error => {
                console.log(error + 'error')
            })
        },
        isStartChange(checked) {
            if (checked && this.addForm.reportName) {
                this.addForm.workOrderName = `${this.addForm.reportName}${this.$moment().format('x')}`
            } else {
                this.addForm.workOrderName = ''
            }
            this.addForm.isStart = checked
        },
        closeDialog(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    this.$parent.alarmDialog = false
                    done()
                })
                .catch(_ => {})
        },
        handleQuery(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.addForm.id) {
                        this.editData()
                    } else {
                        this.addData()
                    }
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        searchReportTypeName(val) {
            this.typeList.forEach(item => {
                if (item.id == val) {
                    this.addForm.reportTypeName = item.name
                }
            })
        },
        addData() {
            this.searchReportTypeName(this.addForm.reportType)
            let data = {
                queryData: {},
                paramsData: {
                    alarm: {
                        reportName: this.addForm.reportName,
                        reportType: this.addForm.reportType,
                        reportTypeName: this.addForm.reportTypeName,
                        desIp: this.addForm.desIp,
                        desPort: this.addForm.desPort,
                        srcIp: this.addForm.srcIp,
                        srcPort: this.addForm.srcPort,
                        reportLevel: this.addForm.reportLevel,
                        reportStatus: this.addForm.reportStatus,
                        reportDesc: this.addForm.reportDesc,
                        attackResult: '',
                        logType: '',
                        dt: '',
                        logId: '',
                        msg: ''
                    },
                    isStart: this.addForm.isStart === true ? 1 : 0,
                    workOrder: {
                        workOrderName: this.addForm.workOrderName,
                        workMouldId: this.addForm.workMouldId,
                        level: this.addForm.level,
                        workOrderContent: this.addForm.workOrderContent
                    }
                }
            }

            addReport(data).then(res => {
                this.$parent.alarmDialog = false
                this.$message({
                    message: '发起成功',
                    type: 'success'
                })
                this.$emit('addAlarmSucess')
            }).catch(error => {
                this.$parent.alarmDialog = false
                console.log(error + 'error')
            })
        },
        editData() {
            this.searchReportTypeName(this.addForm.reportType)
            let data = {
                queryData: {},
                paramsData: {
                    alarm: {
                        id: this.addForm.id,
                        reportName: this.addForm.reportName,
                        reportType: this.addForm.reportType,
                        reportTypeName: this.addForm.reportTypeName,
                        desIp: this.addForm.desIp,
                        desPort: this.addForm.desPort,
                        srcIp: this.addForm.srcIp,
                        srcPort: this.addForm.srcPort,
                        reportLevel: this.addForm.reportLevel,
                        reportStatus: this.addForm.reportStatus,
                        reportDesc: this.addForm.reportDesc,
                        attackResult: '',
                        logType: '',
                        dt: '',
                        logId: '',
                        msg: ''
                    },
                    isStart: this.addForm.isStart === true ? 1 : 0,
                    workOrder: {
                        workOrderName: this.addForm.workOrderName,
                        workMouldId: this.addForm.workMouldId,
                        level: this.addForm.level,
                        workOrderContent: this.addForm.workOrderContent
                    }
                }
            }

            addReport(data).then(res => {
                this.$parent.alarmDialog = false
                this.$message({
                    message: '修改成功',
                    type: 'success'
                })
                this.$emit('addAlarmSucess')
            }).catch(error => {
                this.$parent.alarmDialog = false
                console.log(error + 'error')
            })
        }

    }
}
</script>

<style scoped lang="scss">
  .drawer-pad {
    // padding: 0 20px;
    height: calc(100% - 53px);
    overflow-y: auto;
    overflow-x: hidden;
    //   padding-right: 10px;
    .dialog-footer {
        float: right;
        margin-top: 120px;
    }

    & ::v-deep img {
      max-width: 600px;
      max-height: 600px;
    }
    &::-webkit-scrollbar,
    li::-webkit-scrollbar,
    ul::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-track,
    li::-webkit-scrollbar-track,
    ul::-webkit-scrollbar-track {
      background: none;
    }
    .el-form--inline .el-form-item {
        margin-right: 0;
    }
    .kswitch {
        margin-top: 4px;
    }
  }
  .drawer-pad ::v-deep.el-form-item__content {
    font-size: 12px;
  }
  .drawer-pad ::v-deep .el-form-item__label {
    font-size: 12px;
  }
</style>
