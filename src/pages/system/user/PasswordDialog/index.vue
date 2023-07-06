<template>
    <el-dialog custom-class="common-dialog" width="700px" title="重置密码" :visible.sync="dialogVisible" :before-close="cancel">
        <el-form ref="userForm" :rules="rules" label-position="top" :model="userForm" label-width="80px">
            <el-row :gutter="50">
                <el-col :span="12">
                    <el-form-item label="密码:" prop="password" :label-width="formLabelWidth">
                        <el-input  show-password size="small" v-model="userForm.password" placeholder="请输入内容" autocomplete="off"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="确认密码:" prop="repassword" :label-width="formLabelWidth">
                        <el-input  show-password size="small" v-model="userForm.repassword" placeholder="请输入内容" autocomplete="off"></el-input>
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
import { update_password } from '@/server/system/user.js'
import myRules from '@/utils/rules.js'
export default {
    name: 'Index',
    props: {
        dialogVisible: {
            default: false
        }
    },
    components: {
    },
    created() {
        // let initInfoData = this.$getlocalStorage('initInfo')
        // if (initInfoData) {
        //     this.rules.password = Object.assign(myRules.loginPwd[0], initInfoData.pwd)
        // }
    },
    data() {
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'))
            } else if (value !== this.userForm.password) {
                callback(new Error('两次输入密码不一致!'))
            } else {
                callback()
            }
        }
        return {
            normalizer(node) {
                return {
                    id: node.id,
                    label: node.name,
                    children: node.sub
                }
            },
            formLabelWidth: '80px',
            userForm: {
                id: '',
                password: '',
                repassword: ''
            },
            rules: {
                password: [{
                    required: true,
                    message: '请输入密码',
                    trigger: 'blur'
                }],
                repassword: [
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
                    id: this.userForm.id,
                    password: md5(this.userForm.password)
                }
            }
            update_password(data).then(res => {
                this.$message({
                    message: '重置成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.$emit('submit', 1)
                }, 1500)
            }).catch(error => {
                console.log('error' + error)
            })
        }
    }
}
</script>

<style scoped lang="scss">
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
