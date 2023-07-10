<template>
    <div>
        <div class="event event-wrapper config-edit">
            <div style="width:100%" v-loading="testLoading">
                <div class="drag-dialog__body">
                    <el-form :model="configForm" :rules="rules" ref="configForm">
                        <el-form-item label="情报对接方式：" prop="dockingWay" :label-width="formLabelWidth">
                            <el-select size="small" v-model="configForm.dockingWay" clearable placeholder="请选择" style="width:780px">
                                <el-option label="保存至本地" value="0"></el-option>
                                <el-option label="云端查询" value="1"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="情报源名称：" prop="type" :label-width="formLabelWidth">
                            <el-select size="small" v-model="configForm.type" clearable placeholder="请选择" style="width:780px">
                                <el-option label="微步" value="1"></el-option>
                                <el-option label="VenusEys" value="0"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="请求地址：" prop="url" :label-width="formLabelWidth">
                            <el-input v-model="configForm.url" size="small" placeholder="请输入" clearable style="width:780px"></el-input>
                        </el-form-item>
                        <el-form-item label="API Key：" prop="apiKey" :label-width="formLabelWidth">
                            <el-input v-model="configForm.apiKey" size="small" placeholder="请输入" clearable style="width:780px"></el-input>
                        </el-form-item>
                        <el-form-item v-if="configForm.dockingWay == '0'" label="是否自动同步：" prop="isAuto" :label-width="formLabelWidth">
                            <el-switch v-model="configForm.isAuto" active-color="#13ce66" inactive-color="#ff4949" active-text="开" inactive-text="关"></el-switch>
                        </el-form-item>
                        <el-form-item v-if="configForm.isAuto && configForm.dockingWay == '0'" label="同步周期：" prop="period" :label-width="formLabelWidth">
                            <el-input v-model="configForm.period" size="small" placeholder="请输入" clearable style="width:780px" oninput="value=value.replace(/[^0-9.]/g,'')">
                                <template slot="append">
                                    天
                                </template>
                            </el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="ub drag-dialog__footer" style="margin: 70px 0 0 640px">
                    <el-button size="small" @click="$router.back(-1)">返 回</el-button>
                    <el-button type="primary" size="small" @click="submitTest('configForm')">测试连接</el-button>
                    <el-button type="primary" size="small" @click="submitConfigForm('configForm')">保 存</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { save_threat_config, update_threat_config, test_threat_config } from '../../server/intelligence/api.js'
export default {
    name: 'ThreatConfig',
    data() {
        return {
            matches: [],
            testLoading: false,
            timer: null,
            timer2: null,
            configForm: {
                dockingWay: '1',
                id: '',
                type: '1',
                url: '',
                isAuto: false,
                apiKey: '',
                period: ''
            },
            rules: {
                dockingWay: [
                    {
                        required: true,
                        message: '请输入情报对接方式',
                        trigger: 'change'
                    }
                ],
                url: [
                    {
                        required: true,
                        message: '请输入请求地址',
                        trigger: 'blur'
                    }
                ],
                type: [
                    {
                        required: true,
                        message: '请选择情报类型',
                        trigger: 'change'
                    }
                ],
                period: [
                    {
                        required: true,
                        message: '请输入采集周期',
                        trigger: 'blur'
                    }
                ],
                apiKey: [
                    {
                        required: true,
                        message: '请输入apiKey',
                        trigger: 'blur'
                    }
                ]
            },
            formLabelWidth: '120px'
        }
    },

    mounted() {
        this.$nextTick(() => {
            this.get_config()
        })
    },
    methods: {
        get_config() {
            if (this.$route.query.id) {
                console.log(this.$getsessionStorage('configDetail'))
                const data = this.$getsessionStorage('configDetail')
                this.configForm.dockingWay = String(data.dockingWay)
                this.configForm.type = String(data.type)
                this.configForm.url = data.url
                this.configForm.isAuto = !!data.isAuto
                this.configForm.apiKey = data.apiKey
                this.configForm.period = data.period
            }
        },
        submitConfigForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.timer && clearTimeout(this.timer)
                    this.timer = setTimeout(() => {
                        this.addConfigFun()
                        this.timer = null
                    }, 1500)
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        submitTest(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.testLoading = true
                    this.timer2 && clearTimeout(this.timer2)
                    this.timer2 = setTimeout(() => {
                        this.testConfigFun()
                        this.timer2 = null
                    }, 1500)
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        addConfigFun() {
            if (this.configForm.url.slice(0, 8) != 'https://') {
                this.$message({
                    type: 'warning',
                    message: '测试地址不标准，例如：https://www.baidu.com！'
                })
                this.testLoading = false
                return
            }
            let data = {
                dockingWay: Number(this.configForm.dockingWay),
                type: Number(this.configForm.type),
                url: this.configForm.url,
                apiKey: this.configForm.apiKey,
                isAuto: Number(this.configForm.isAuto),
                period: this.configForm.period
            }
            let method = save_threat_config
            if (this.$route.query.id) {
                data.id = this.$route.query.id
                method = update_threat_config
            }
            method({ paramsData: data, queryData: {}})
                .then(res => {
                    this.$message({
                        message: '保存成功',
                        type: 'success'
                    })
                    setTimeout(() => {
                        this.$router.back(-1)
                    }, 1500)
                })
                .catch(error => {
                    console.log(error + 'error')
                })
        },
        testConfigFun() {
            if (this.configForm.url.slice(0, 8) != 'https://') {
                this.$message({
                    type: 'warning',
                    message: '测试地址不标准，例如：https://www.baidu.com！'
                })
                this.testLoading = false
                return
            }
            let data = {
                url: this.configForm.url,
                apiKey: this.configForm.apiKey
            }
            test_threat_config({ paramsData: data, queryData: {}})
                .then(res => {
                    console.log(res)
                    this.testLoading = false
                    if (res) {
                        this.$message.success('连接成功')
                    } else {
                        this.$message.warning('连接失败')
                    }
                })
                .catch(error => {
                    this.testLoading = false
                    console.log(error + 'error')
                })
        }
    }
}
</script>

<style lang="scss" scoped>
    .config-edit {
        padding: 20px;
        height: calc(100vh - 80px);
    }
// .event ::v-deep .el-input--small .el-input__inner {
//     height: 30px;
//     line-height: 30px;
// }

// .event ::v-deep .el-input-group__append {
//     background-color: transparent;
//     border: 1px solid #1cd7fa;
//     border-left: none;
//     color: #fff;
//     box-shadow: 0px 0px 7px #389bf7 inset;
// }
</style>
