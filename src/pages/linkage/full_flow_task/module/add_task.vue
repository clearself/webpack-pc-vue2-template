<template>
    <div>
        <el-dialog title="添加任务" :visible.sync="addDialog" width="700px" custom-class="common-dialog">
            <el-form :model="addForm" :rules="rules" ref="addForm" label-position="top">
                <el-form-item label="源IP：" prop="srcIp" :label-width="formLabelWidth">
                    <el-input placeholder="请输入源IP" clearable v-model="addForm.srcIp" size="small"></el-input>
                </el-form-item>
                <el-form-item label="源端口：" prop="srcPort" :label-width="formLabelWidth">
                    <el-input placeholder="请输入源端口" clearable v-model="addForm.srcPort" size="small"></el-input>
                </el-form-item>
                <el-form-item label="目的IP：" prop="desIp" :label-width="formLabelWidth">
                    <el-input placeholder="请输入目的IP" clearable v-model="addForm.desIp" size="small"></el-input>
                </el-form-item>
                <el-form-item label="目的端口：" prop="desPort" :label-width="formLabelWidth">
                    <el-input placeholder="请输入目的端口" clearable v-model="addForm.desPort" size="small"></el-input>
                </el-form-item>
                <el-form-item label="事件时间：" prop="aDate" :label-width="formLabelWidth">
                    <el-date-picker v-model="addForm.aDate" type="datetime" placeholder="选择时间" size="small" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" style="width:100%"> </el-date-picker>
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
import { addFlowTask } from '@/server/linkage/full_flow_task'
export default {
    name: 'AddTask',
    mixins: [],
    data() {
        return {
            addDialog: false,
            addForm: {
                srcIp: '',
                srcPort: '',
                desIp: '',
                desPort: '',
                aDate: ''
            },
            formLabelWidth: '120px',
            rules: {
                aDate: [
                    {
                        required: true,
                        message: '请选择时间',
                        trigger: 'change'
                    }
                ],
                srcIp: [
                    {
                        required: true,
                        message: '请输入源IP',
                        trigger: 'blur'
                    }
                ],
                srcPort: [
                    {
                        required: true,
                        message: '请输入源端口',
                        trigger: 'blur'
                    }
                ],
                desIp: [
                    {
                        required: true,
                        message: '请输入目的IP',
                        trigger: 'blur'
                    }
                ],
                desPort: [
                    {
                        required: true,
                        message: '请输入目的端口',
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    watch: {
        addDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.addForm.resetFields()
                    this.addForm = {
                        srcIp: '',
                        srcPort: '',
                        desIp: '',
                        desPort: '',
                        aDate: ''
                    }
                }
            }
        }
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    let data = {
                        queryData: {},
                        paramsData: this.addForm
                    }
                    addFlowTask(data)
                        .then(res => {
                            this.addDialog = false
                            this.$message({
                                message: '添加任务成功',
                                type: 'success'
                            })
                            setTimeout(() => {
                                this.$emit('submitForm')
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
        }
    }
}
</script>

<style lang="scss" scoped>

.el-date-editor{
    ::v-deep .el-input__prefix{
        height:32px !important;
    }
}
</style>
