<template>
    <div class="ub ub-ac list">
        <div>
            <el-form :model="formData"  :rules="rules" ref="formData">
                <el-form-item label="常用IP时间范围：" prop="ipTime" :label-width="formLabelWidth">
                    <div class="w100 ub">
                        <div>
                            <el-input onkeyup="value=value.replace(/[^\d]/g,'').replace(/^0{1,}/g,'')" size="small" placeholder="请输入" v-model.number="formData.ipTime"></el-input>
                        </div>
                        <div>&nbsp;&nbsp;天</div>
                    </div>
                </el-form-item>
                <el-form-item label="常访问资产时间范围：" prop="zcTime" :label-width="formLabelWidth">
                    <div class="w100 ub">
                        <div>
                            <el-input onkeyup="value=value.replace(/[^\d]/g,'').replace(/^0{1,}/g,'')" size="small" placeholder="请输入" v-model.number="formData.zcTime"></el-input>
                        </div>
                        <div>&nbsp;&nbsp;天</div>
                    </div>
                </el-form-item>
                <el-form-item label="访问次数时间范围：" prop="csTime" :label-width="formLabelWidth">
                    <div class="w100 ub">
                        <div>
                            <el-input onkeyup="value=value.replace(/[^\d]/g,'').replace(/^0{1,}/g,'')" size="small" placeholder="请输入" v-model.number="formData.csTime"></el-input>
                        </div>
                        <div>&nbsp;&nbsp;天</div>
                    </div>
                </el-form-item>
                <el-form-item label="访问次数阈值(百分比)：" prop="csNum" :label-width="formLabelWidth">
                    <div class="w100 ub">
                        <div>
                            <el-input onkeyup="value=value.replace(/[^\d]/g,'').replace(/^0{1,}/g,'')" size="small" placeholder="请输入" v-model.number="formData.csNum"></el-input>
                        </div>
                        <div>&nbsp;&nbsp;%</div>
                    </div>
                </el-form-item>
                <el-form-item label="访问时间时间范围：" prop="sjTime" :label-width="formLabelWidth">
                    <div class="w100 ub">
                        <div>
                            <el-input onkeyup="value=value.replace(/[^\d]/g,'').replace(/^0{1,}/g,'')" size="small" placeholder="请输入" v-model.number="formData.sjTime"></el-input>
                        </div>
                        <div>&nbsp;&nbsp;天</div>
                    </div>
                </el-form-item>
                <el-form-item label="访问时间阈值：" prop="sjNum" :label-width="formLabelWidth">
                    <div class="w100 ub">
                        <div>
                            <el-input onkeyup="value=value.replace(/[^\d]/g,'').replace(/^0{1,}/g,'')" size="small" placeholder="请输入" v-model.number="formData.sjNum"></el-input>
                        </div>
                        <div>&nbsp;&nbsp;小时</div>
                    </div>
                </el-form-item>
                <el-form-item label="访问端口时间范围：" prop="portTime" :label-width="formLabelWidth">
                    <div class="w100 ub">
                        <div>
                            <el-input onkeyup="value=value.replace(/[^\d]/g,'').replace(/^0{1,}/g,'')" size="small" placeholder="请输入" v-model.number="formData.portTime"></el-input>
                        </div>
                        <div>&nbsp;&nbsp;天</div>
                    </div>
                </el-form-item>
            </el-form>
            <div class="ub ub-ac ub-pc w100" style="margin-top: 100px;">
                <el-button size="small" type="primary" @click="submitForm('formData')">保 存</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import {
    getPoolSetting,
    addPoolSetting
} from '@/server/data_manage/api.js'
export default {
    name: 'Pool',
    data() {
        return {
            formLabelWidth: '160px',
            formData: {
                id: '',
                ipTime: '',
                zcTime: '',
                csNum: '',
                csTime: '',
                sjTime: '',
                sjNum: '',
                portTime: ''

            },
            rules: {
                ipTime: [
                    {
                        required: true,
                        message: '请输入',
                        trigger: 'blur'
                    }
                ],
                zcTime: [
                    {
                        required: true,
                        message: '请输入',
                        trigger: 'blur'
                    }
                ],
                csNum: [
                    {
                        required: true,
                        message: '请输入',
                        trigger: 'blur'
                    }
                ],
                csTime: [
                    {
                        required: true,
                        message: '请输入',
                        trigger: 'blur'
                    }
                ],
                sjTime: [
                    {
                        required: true,
                        message: '请输入',
                        trigger: 'blur'
                    }
                ],
                sjNum: [
                    {
                        required: true,
                        message: '请输入',
                        trigger: 'blur'
                    }
                ],
                portTime: [
                    {
                        required: true,
                        message: '请输入',
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.init()
        })
    },
    methods: {
        init() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            getPoolSetting(data).then(res => {
                this.formData = res
            }).catch(error => {
                console.log('error' + error)
            })
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.add()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        add() {
            let data = {
                queryData: {},
                paramsData: this.formData
            }
            addPoolSetting(data).then(res => {
                this.$message({
                    message: '保存成功！',
                    type: 'success'
                })
            }).catch(error => {
                console.log('error' + error)
            })
        }
    }
}
</script>

<style scoped lang="scss">
.list {
    >div {
        padding-left: 100px;
    }

    background-color: #ffffff;
    ::v-deep .el-form-item {
        margin-bottom: 40px;
    }
    ::v-deep .el-form-item__label {
        line-height: 32px;
    }
}
.custom-star {
    .list {
        background: unset
    }
}
</style>
