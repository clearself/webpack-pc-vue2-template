<template>
    <el-dialog custom-class="common-dialog user-dialog" width="700px" :title="type === 'add' ? '添加用户' : '编辑用户'" :visible.sync="dialogVisible" :before-close="cancel">
        <el-form ref="userForm" :rules="rules" label-position="top" :model="userForm" label-width="80px">
            <el-row :gutter="50">
                <el-col :span="12">
                    <el-form-item size="small" v-if="type === 'add'" label="用户名:" prop="username" :label-width="formLabelWidth">
                        <el-input size="small" v-model="userForm.username" placeholder="请输入内容" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item size="small" v-if="type === 'edit'" label="用户名:"  :label-width="formLabelWidth">
                        <el-input size="small" v-model="userForm.username" placeholder="请输入内容" autocomplete="off" :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item size="small" label="姓名:" prop="chineseName" :label-width="formLabelWidth">
                        <el-input size="small" v-model="userForm.chineseName" placeholder="请输入内容" autocomplete="off"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="50">
                <el-col :span="12">
                    <el-form-item size="small" v-if="type === 'add'" label="首次登录密码:" prop="password" :label-width="formLabelWidth">
                        <el-input show-password size="small" v-model="userForm.password" placeholder="请输入内容" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item size="small" v-if="type === 'edit'" label="首次登录密码:" :label-width="formLabelWidth">
                        <el-input show-password size="small" v-model="userForm.password" placeholder="请输入内容" autocomplete="off" :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item size="small" label="所属部门:" prop="departmentId" :label-width="formLabelWidth">
                        <!-- <el-input size="small" v-model="userForm.department" placeholder="请输入内容" autocomplete="off"></el-input> -->
                        <div class="treeselect">
                            <Treeselect @input="treeChange" style="width: 100%" :options="treeData" :normalizer="normalizer" noChildrenText="当前分支无子节点" noOptionsText="无可用选项" placeholder="请选择" v-model="userForm.departmentId" />
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="50">
                <el-col :span="12">
                    <el-form-item size="small" label="直接上级:" prop="parentId" :label-width="formLabelWidth">
                        <!-- <el-input size="small" v-model="userForm.parentId" placeholder="请输入内容" autocomplete="off"></el-input> -->
                        <el-select filterable v-model="userForm.parentId" placeholder="请选择" size="small" style="width: 100%">
                            <el-option v-for="item in parentList" :key="item.id" :label="item.chineseName" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item size="small" label="联系方式:" prop="phone" :label-width="formLabelWidth">
                        <el-input size="small" v-model="userForm.phone" placeholder="请输入内容" autocomplete="off"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="50">
                <el-col :span="12">
                    <el-form-item size="small" label="邮箱地址:" prop="mailbox" :label-width="formLabelWidth">
                        <el-input size="small" v-model="userForm.mailbox" placeholder="请输入内容" autocomplete="off"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item size="small" label="设置用户角色:" prop="roles" :label-width="formLabelWidth">
                        <el-select v-model="userForm.roles" placeholder="请选择" size="small" style="width: 100%" multiple>
                            <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                        <!-- <el-input size="small" v-model="userForm.role" placeholder="请输入内容" autocomplete="off"></el-input> -->
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item size="small" label="IP地址登录:" prop="isLimit" :label-width="formLabelWidth">
                <el-radio-group v-model="userForm.isLimit">
                    <el-radio :label="0">不限定IP地址登录</el-radio>
                    <el-radio :label="1">仅特定IP地址可登录</el-radio>
                </el-radio-group>
            </el-form-item>
            <template v-if="userForm.isLimit == 1">
                <el-form-item size="small" v-for="(item, index) in userForm.ips" :key="index" :label="'IP地址' + (index + 1) + '：'" :prop="'ips.' + index + '.value'" :rules="rules.ip" style="position: relative" :label-width="formLabelWidth">
                    <i v-if="index !== 0 && index === userForm.ips.length - 1" class="delete-btn iconfont icon-shanchu" @click="deleteIp"></i>
                    <el-input size="small" v-model="item.value"></el-input>
                </el-form-item>
                <p class="ub ub-ps ub-ac add-ip" @click="addIp">
                    <i class="iconfont icon-tianjia"></i>
                    <span>添加IP地址</span>
                </p>
            </template>
        </el-form>
        <div slot="footer">
            <el-button size="small" @click="cancel">取消</el-button>
            <el-button size="small" type="primary" @click="submit">确认</el-button>
        </div>
    </el-dialog>
</template>

<script>
import md5 from 'js-md5'
import { add_user, update_user } from '@/server/system/user.js'
import myRules from '@/utils/rules.js'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
    name: 'Index',
    props: {
        dialogVisible: {
            default: false
        },
        type: {
            default: 'add'
        },
        treeData: {
            type: Array,
            default: function() {
                return []
            }
        },
        roleList: {
            type: Array,
            default: function() {
                return []
            }
        },
        parentList: {
            type: Array,
            default: function() {
                return []
            }
        }
    },
    components: {
        Treeselect
    },
    created() {
    // let initInfoData = this.$getlocalStorage('initInfo')
    // if (initInfoData) {
    //     this.rules.password = Object.assign(myRules.loginPwd[0], initInfoData.pwd)
    // }
    },
    data() {
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
                username: '',
                chineseName: '',
                password: '',
                departmentId: null,
                parentId: '',
                phone: '',
                mailbox: '',
                roles: '',
                isLimit: 0,
                ips: [{ value: '' }]
            },
            rules: {
                username: [
                    {
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur'
                    }
                ],
                chineseName: [
                    {
                        required: true,
                        message: '请输入姓名',
                        trigger: 'blur'
                    }
                ],
                password: [
                    {
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur'
                    }
                ],
                phone: myRules.phone,
                roles: [
                    {
                        required: true,
                        message: '请输入角色',
                        trigger: 'blur'
                    }
                ],
                ip: myRules.ip,
                isLimit: [
                    {
                        required: true,
                        message: '请输入内容',
                        trigger: 'blur'
                    }
                ],
                mailbox: Object.assign(myRules.mail[0], { required: true })
            }
        }
    },
    watch: {
        dialogVisible(val) {
            if (!val) {
                this.reset()
                this.userForm.departmentId = null
            }
        }
    },
    methods: {
        treeChange(value, instanceId) {
            if (!value) this.userForm.departmentId = null
        },
        addIp() {
            this.userForm.ips.push({ value: '' })
        },
        deleteIp() {
            this.userForm.ips.pop()
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
                    if (this.type === 'edit') {
                        this.updateUser()
                    } else {
                        this.addUser()
                    }
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        addUser() {
            let ipsData = []
            if (this.userForm.ips.length > 0) {
                ipsData = this.userForm.ips.map(item => {
                    return item.value
                })
            }
            let data = {
                queryData: {},
                paramsData: {
                    username: this.userForm.username,
                    password: md5(this.userForm.password),
                    chineseName: this.userForm.chineseName,
                    departmentId: this.userForm.departmentId ?? '',
                    phone: this.userForm.phone,
                    mailbox: this.userForm.mailbox,
                    parentId: this.userForm.parentId,
                    isLimit: this.userForm.isLimit,
                    roles: this.userForm.roles,
                    ips: ipsData
                }
            }
            add_user(data)
                .then(res => {
                    this.$message({
                        message: '添加成功',
                        type: 'success'
                    })
                    setTimeout(() => {
                        this.$emit('submit', 1)
                    }, 1500)
                })
                .catch(error => {
                    console.log('error' + error)
                })
        },
        updateUser() {
            let ipsData = []
            if (this.userForm.ips.length > 0) {
                ipsData = this.userForm.ips.map(item => {
                    return item.value
                })
            }
            let data = {
                queryData: {},
                paramsData: {
                    id: this.userForm.id,
                    username: this.userForm.username,
                    password: md5(this.userForm.password),
                    chineseName: this.userForm.chineseName,
                    departmentId: this.userForm.departmentId,
                    phone: this.userForm.phone,
                    mailbox: this.userForm.mailbox,
                    parentId: this.userForm.parentId,
                    isLimit: this.userForm.isLimit,
                    roles: this.userForm.roles,
                    ips: ipsData
                }
            }
            update_user(data)
                .then(res => {
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    })
                    setTimeout(() => {
                        this.$emit('submit', 1)
                    }, 1500)
                })
                .catch(error => {
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
  .treeselect {
    padding: 0;
    ::v-deep .vue-treeselect__control {
      height: 30px;
      line-height: 30px;
    }
    ::v-deep .vue-treeselect__input {
      vertical-align: middle;
    }
  }
  ::v-deep .custom-purple .el-radio__label {
    font-size: 12px !important;
}

</style>
<style>
.common-dialog.user-dialog .el-dialog__body {
    height: 500px !important;
    background-color: #fff;
}
</style>
