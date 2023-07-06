<template>
    <el-dialog custom-class="common-dialog" width="700px" :visible.sync="dialogVisible" :before-close="cancel">
        <div slot="title" class="common-title">修改密码<span v-if="isChangeSelf" style="color:red;">(密码已过期，请定时更新)</span></div>
        <el-form ref="userForm" :rules="rules" label-position="top" :model="userForm" label-width="80px">
            <el-row :gutter="50">
                <el-col :span="8">
                    <el-form-item label="原密码:" prop="password" :label-width="formLabelWidth">
                        <el-input  show-password size="small" v-model="userForm.password" placeholder="请输入内容" autocomplete="off"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="新密码:" prop="newPassword" :label-width="formLabelWidth">
                        <el-input  show-password size="small" v-model="userForm.newPassword" placeholder="请输入内容" autocomplete="off"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="确认新密码:" prop="surePassword" :label-width="formLabelWidth">
                        <el-input  show-password size="small" v-model="userForm.surePassword" placeholder="请输入内容" autocomplete="off"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer">
            <el-button size="small" @click="cancel">取消</el-button>
            <el-button size="small" type="primary" @click="submit">确认</el-button>
        </div>
    </el-dialog>
</template>

<script>
import md5 from 'js-md5'
import myRules from '@/utils/rules.js'
import { update_password_new } from '@/server/common.js'
import {
    get_security_policy
} from '@/server/login/index.js'
export default {
    name: 'Index',
    props: {
        dialogVisible: {
            default: false
        },
        isChangeSelf: {
            default: false
        }
    },
    components: {
    },
    created() {
        this.getInitInfo()
    },
    data() {
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'))
            } else if (value !== this.userForm.newPassword) {
                callback(new Error('两次输入密码不一致!'))
            } else {
                callback()
            }
        }
        return {
            formLabelWidth: '80px',
            userForm: {
                password: '',
                newPassword: '',
                surePassword: ''
            },
            rules: {
                password: [{
                    required: true,
                    message: '请输入密码',
                    trigger: 'blur'
                }],
                newPassword: Object.assign(myRules.loginPwd[0], { limit: 8, pwDefault: 1 }),
                surePassword: [
                    { required: true, validator: validatePass2, trigger: 'blur' }
                ]
            }
        }
    },
    watch: {
        dialogVisible(val) {
            if (!val) {
                this.reset()
            }
        }
    },
    methods: {
        getInitInfo() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_security_policy(data).then(res => {
                console.log(res, '安全策略')
                let obj = {
                    pwd: {
                        pwDefault: res.pwDefault,
                        pwCustom: res.pwCustom,
                        limit: res.pwLimit
                    }
                }
                this.rules.newPassword = Object.assign(myRules.loginPwd[0], obj.pwd)
            }).catch(error => {
                console.log(error)
            })
        },
        cancel() {
            this.$emit('close')
        },
        reset() {
            this.$refs.userForm.resetFields()
        },
        submit() {
            this.$refs.userForm.validate(valid => {
                if (valid) {
                    this.updateUser()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        updateUser() {
            let data = {
                queryData: {},
                paramsData: {
                    password: md5(this.userForm.password),
                    nowpassword: md5(this.userForm.newPassword)
                }
            }
            update_password_new(data).then(res => {
                this.$message({
                    message: '修改成功',
                    type: 'success'
                })
                this.$parent.passwordDialog = false
            }).catch(error => {
                console.log('error' + error)
            })
        }
    }
}
</script>

<style scoped lang="scss">
.common-title{
    height: 24px;
    line-height: 24px;
    color: rgba(0, 0, 0, 0.9);
    font-size: 14px;
}
.add-ip {
    cursor: pointer;
    color: $high-color;
    width: 76px;
    i {
        font-size: 14px;
        margin-right: 2px;
    }
    span {
        font-size: 12px;
    }
}
.delete-btn {
    color: $danger-color;
    position: absolute;
    right: 0;
    top: -40px;
    font-size: 14px;
    cursor: pointer;
}
</style>
