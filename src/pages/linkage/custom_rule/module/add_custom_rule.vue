<template>
    <div>
        <el-dialog
            :title="addForm.id ? '编辑规则' : '新增规则'"
            :visible.sync="addDialog"
            width="700px"
            custom-class="common-dialog"
        >
            <el-form :model="addForm" :rules="rules" ref="addForm" label-position="top">
                <el-form-item label="规则名称："  :label-width="formLabelWidth">
                    <el-input placeholder="请输入" clearable v-model="addForm.ruleName" size="small"></el-input>
                </el-form-item>
                <el-form-item label="威胁类型：" prop="eventType" :label-width="formLabelWidth">
                    <el-select
                        clearable
                        filterable
                        v-model="addForm.eventType"
                        placeholder="请选择"
                        size="small"
                        style="width:100%"
                        @change="eventTypeChange"
                    >
                        <el-option
                            v-for="item in eventTypeData"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="威胁子类型：" prop="eventSubType" :label-width="formLabelWidth">
                    <el-select
                        clearable
                        filterable
                        v-model="addForm.eventSubType"
                        placeholder="请选择"
                        size="small"
                        style="width:100%"
                    >
                        <el-option
                            v-for="item in eventSubTypeData"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="威胁级别：" prop="eventServerity" :label-width="formLabelWidth">
                    <el-select
                        clearable
                        filterable
                        v-model="addForm.eventServerity"
                        placeholder="请选择"
                        size="small"
                        style="width:100%"
                    >
                        <el-option
                            v-for="item in eventServerityData"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="源IP：" :label-width="formLabelWidth" prop="sourceIp">
                    <el-input placeholder="请输入" clearable v-model="addForm.sourceIp" size="small"></el-input>
                </el-form-item>
                <el-form-item label="源端口：" :label-width="formLabelWidth">
                    <el-input placeholder="请输入" clearable v-model="addForm.sourcePort" size="small" type="number"></el-input>
                </el-form-item>
                <el-form-item label="目的IP：" :label-width="formLabelWidth" prop="sourceIp">
                    <el-input placeholder="请输入" clearable v-model="addForm.destinationIp" size="small"></el-input>
                </el-form-item>
                <el-form-item label="目的端口：" :label-width="formLabelWidth">
                    <el-input placeholder="请输入" clearable v-model="addForm.destinationPort" size="small" type="number"></el-input>
                </el-form-item>
                <el-form-item label="特征值：" prop="featureValue" :label-width="formLabelWidth">
                    <el-input placeholder="请输入" clearable v-model="addForm.featureValue" size="small"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="addDialog = false">取消</el-button>
                <Debounce :time="1500" :isDebounce="2">
                    <el-button size="small" type="primary" @click.native="submitForm('addForm')">确认</el-button>
                </Debounce>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { addCustomRule, updateCustomRule } from '@/server/linkage/custom_rule'
export default {
    name: 'AddCustomRule',
    mixins: [],
    props: ['sumData', 'eventTypeData', 'eventServerityData'],
    data() {
        return {
            addDialog: false,
            addForm: {
                id: '',
                ruleName: '',
                eventType: '',
                eventSubType: '',
                eventServerity: '',
                sourceIp: '',
                sourcePort: '',
                destinationIp: '',
                destinationPort: '',
                featureValue: ''
            },
            formLabelWidth: '120px',
            rules: {
                eventType: [
                    {
                        required: true,
                        message: '请选择威胁类型',
                        trigger: 'change'
                    }
                ],
                eventSubType: [
                    {
                        required: true,
                        message: '请选择威胁子类型',
                        trigger: 'change'
                    }
                ],
                eventServerity: [
                    {
                        required: true,
                        message: '请选择威胁级别',
                        trigger: 'change'
                    }
                ],
                featureValue: [
                    {
                        required: true,
                        message: '请输入特征值',
                        trigger: 'blur'
                    }
                ],
                sourceIp: [
                    {
                        pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
                        message: '请填写正确的IP',
                        trigger: 'blur'
                    }
                ]
            },
            eventSubTypeData: []
        }
    },
    watch: {
        addDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.addForm.resetFields()
                    this.addForm = {
                        ruleName: '',
                        eventType: '',
                        eventSubType: '',
                        eventServerity: '',
                        sourceIp: '',
                        sourcePort: '',
                        destinationIp: '',
                        destinationPort: '',
                        featureValue: ''
                    }
                }
            }
        }
    },
    created() {
    },
    methods: {
        setEventSubTypeData(val) {
            let optionData = []
            this.sumData.forEach(item => {
                if (item.name === val) {
                    optionData = item.sub
                }
            })
            if (optionData.length > 0 && val) {
                this.eventSubTypeData = optionData.map(item => {
                    return {
                        value: item,
                        label: item
                    }
                })
            } else {
                this.eventSubTypeData = []
            }
        },
        eventTypeChange(val) {
            this.addForm.eventSubType = ''
            this.setEventSubTypeData(val)
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    let data = {
                        queryData: {},
                        paramsData: this.addForm
                    }
                    if (this.addForm.id) {
                        updateCustomRule(data)
                            .then(res => {
                                this.addDialog = false
                                if (this.addForm.id) {
                                    this.$message({
                                        message: '修改成功',
                                        type: 'success'
                                    })
                                } else {
                                    this.$message({
                                        message: '添加成功',
                                        type: 'success'
                                    })
                                }
                                setTimeout(() => {
                                    this.$emit('handleConfirm')
                                }, 1500)
                            })
                            .catch(error => {
                            // this.addDialog = false
                                console.log(error + 'error')
                            })
                    } else {
                        addCustomRule(data)
                            .then(res => {
                                this.addDialog = false
                                if (this.addForm.id) {
                                    this.$message({
                                        message: '修改成功',
                                        type: 'success'
                                    })
                                } else {
                                    this.$message({
                                        message: '添加成功',
                                        type: 'success'
                                    })
                                }
                                setTimeout(() => {
                                    this.$emit('handleConfirm')
                                }, 1500)
                            })
                            .catch(error => {
                            // this.addDialog = false
                                console.log(error + 'error')
                            })
                    }
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        }
    }
}
</script>

<style></style>
