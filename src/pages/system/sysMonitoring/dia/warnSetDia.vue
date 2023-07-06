<template>
    <el-dialog
        title="告警配置"
        :visible.sync="showDia"
        width="700px"
        @close="resetForm">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="ruleFormBox">
            <el-form-item label="cpu使用率" prop="cpuUsage">
                <div class="slideInBox">
                    <el-slider class="leftSli"  v-model="ruleForm.cpuUsage"></el-slider>
                    <el-input
                        onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode || event.which))) || event.which === 8"
                        class="rightIn"
                        v-model.number="ruleForm.cpuUsage"
                        placeholder=""></el-input>
                    <span class="tex">%</span>
                </div>
            </el-form-item>
            <el-form-item label="内存使用率" prop="memaryUsage">
                <div class="slideInBox">
                    <el-slider class="leftSli" v-model="ruleForm.memaryUsage"></el-slider>
                    <el-input
                        onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode || event.which))) || event.which === 8"
                        class="rightIn"
                        v-model.number="ruleForm.memaryUsage"
                        placeholder=""></el-input>
                    <span class="tex">%</span>
                </div>
            </el-form-item>
            <el-form-item label="总磁盘占用(系统)" prop="systemDiskUsage">
                <div class="slideInBox">
                    <el-slider class="leftSli" v-model="ruleForm.systemDiskUsage"></el-slider>
                    <el-input
                        onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode || event.which))) || event.which === 8"
                        class="rightIn"
                        v-model.number="ruleForm.systemDiskUsage"
                        placeholder=""></el-input>
                    <span class="tex">%</span>
                </div>
            </el-form-item>
            <el-form-item label="总磁盘占用(数据)" prop="dataDiskUsage">
                <div class="slideInBox">
                    <el-slider class="leftSli" v-model="ruleForm.dataDiskUsage"></el-slider>
                    <el-input
                        onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode || event.which))) || event.which === 8"
                        class="rightIn"
                        v-model.number="ruleForm.dataDiskUsage"
                        placeholder=""></el-input>
                    <span class="tex">%</span>
                </div>
            </el-form-item>
            <el-form-item label="通知方式" prop="sendType">
                <el-radio-group v-model="ruleForm.sendType">
                    <el-radio disabled :label="0">蓝信</el-radio>
                    <el-radio :label="1">短信</el-radio>
                    <el-radio :label="2">邮件</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="选择通知人" prop="sendTo">
                <el-select multiple style="width: 100%" v-model="ruleForm.sendTo" placeholder="请选择">
                    <el-tabs style="padding: 0 10px" v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane label="系统用户" name="sys"></el-tab-pane>
                        <el-tab-pane label="资产用户" name="ass"></el-tab-pane>
                    </el-tabs>
                    <el-option
                        v-show="activeName == 'sys'"
                        v-for="item in systemUser"
                        :key="item.id"
                        :label="item.chineseName"
                        :value="item.id"
                    >
                    </el-option>
                    <el-option
                        v-show="activeName == 'ass'"
                        v-for="item in assetUser"
                        :key="item.id"
                        :label="item.chineseName"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="showDia = false">取 消</el-button>
            <el-button size="small" type="primary" :loading="subLoading  " @click="submit">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>

import {
    saveAlarmConfigReq
} from '@/server/system/sysMonitoring.js'

export default {
    props: {
        assetUser: {
            type: Array,
            default: () => []
        },
        systemUser: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            showDia: false,
            title: '',
            row: {},
            userOptions: [],
            ruleForm: {
                cpuUsage: 0,
                memaryUsage: 0,
                systemDiskUsage: 0,
                dataDiskUsage: 0,
                sendType: null,
                sendTo: []
            },
            rules: {
                ip: [
                    { required: true, message: '设备ip不能为空', trigger: 'blur' }
                ],
                port: [
                    { required: true, message: '设备端口不能为空', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '设备名称不能为空', trigger: 'blur' }
                ],
                type: [
                    { required: true, message: '设备类型不能为空', trigger: 'change' }
                ]
            },
            subLoading: false,
            activeName: 'sys'
        }
    },
    methods: {
        initDia(row) {
            // this.row = this.$deepCopy(row)
            this.ruleForm = this.$deepCopy(row)
            this.showDia = true
        },
        handleClick(tab, event) {
            console.log(tab, event)
        },
        resetForm() {
            // this.ruleForm = {
            //     cpuUsage: 0,
            //     memaryUsage: 0,
            //     systemDiskUsage: 0,
            //     dataDiskUsage: 0,
            //     sendType: [],
            //     sendTo: []
            // }
            this.activeName = 'sys'
            this.$refs.ruleForm.resetFields()
        },
        submit() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.subLoading = true
                    let data = {
                        queryData: {},
                        paramsData: {
                            id: this.ruleForm.id,
                            cpuUsage: this.ruleForm.cpuUsage,
                            memaryUsage: this.ruleForm.memaryUsage,
                            systemDiskUsage: this.ruleForm.systemDiskUsage,
                            dataDiskUsage: this.ruleForm.dataDiskUsage,
                            sendType: this.ruleForm.sendType,
                            sendTo: this.ruleForm.sendTo
                        }
                    }
                    data.paramsData.sendTo = data.paramsData.sendTo ? data.paramsData.sendTo.join() : ''

                    // console.log(data)

                    saveAlarmConfigReq(data).then(res => {
                        this.subLoading = false
                        this.$message.success('保存配置成功')
                        this.$emit('refresh')
                        this.showDia = false
                    }).catch(error => {
                        this.subLoading = false
                        console.log('error' + error)
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
.ruleFormBox {
    padding: 0 20px 0 0;
    box-sizing: border-box;

    .slideInBox {
        display: flex;
        padding: 0 5px;
        box-sizing: border-box;
        align-items: center;
        .leftSli {
            margin-right: 10px;
            width: 60%
        }
        .rightIn {
            width: 35%
        }
        .tex {
            padding-left: 5px;
        }
    }
}
::v-deep .tabBox {
    padding: 0 15px;
}
::v-deep .el-dialog__footer {
    padding-top: 0 !important;
}
</style>
