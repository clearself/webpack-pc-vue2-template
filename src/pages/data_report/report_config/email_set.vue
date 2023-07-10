<template>
    <div class="event event-wrapper" style="box-sizing: border-box;">
        <div class="attendance-list content btn-1366" style="margin-top: 0;box-sizing: border-box;">
            <!-- <img  v-if="$store.state.common.currentTheme==='white-theme'" src="../../../public/static/img/white_angle_left.png" alt="" class="angle-img-left">
            <img  v-if="$store.state.common.currentTheme==='white-theme'" src="../../../public/static/img/white_angle_right.png" alt="" class="angle-img-right"> -->
            <div class="ub ub-pj w100">
                <div class="list-tips">邮件配置</div>
            </div>
            <el-divider></el-divider>
            <div class="ub ub-ac ub-pc ub-ver w100 instruction-content mt-2">
                <div class="from-box">
                    <el-form :model="emailForm" ref="emailForm" :rules="rules" class="unit">
                        <el-form-item prop="sendRate" label="邮件发送频率：" label-width="120px">
                            <el-select v-model.trim="emailForm.sendRate" placeholder="请选择">
                                <el-option label="30分钟" value="1"></el-option>
                                <el-option label="60分钟" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="收件人：" label-width="120px" prop="toAddress">
                            <el-input type="textarea" :rows="4"  size="small" placeholder="请输入" v-model="emailForm.toAddress"></el-input>
                            <el-tooltip
                                class="item"
                                style="position: absolute;top:40%;right: -20px;"
                                effect="dark"
                                content="每行为一个收件人地址，按Enter折行批量录入"
                                placement="right">
                                <i class="el-icon-question"></i>
                            </el-tooltip>
                        </el-form-item>
                    </el-form>
                </div>
                <div style="margin-top: 90px;">
                    <el-button size="small" type="primary" @click="validAdd('emailForm')">保 存</el-button>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import {
    get_email_config,
    add_email_config
} from '@/server/reporting_platform/setting.js'

export default {
    name: 'EmailSet',
    data() {
        var validateEmail = (rule, value, callback) => {
            if (value.trim() === '') {
                callback()
            } else if (value.trim() !== '') {
                let arr = value.trim().split(/[(\r\n)\r\n]+/)
                /* console.log(arr)*/
                arr.forEach(item => {
                    if (!/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(item.trim())) {
                        callback(new Error('请输入真实邮箱'))
                    }
                })
                callback()
            } else {
                callback()
            }
        }
        return {
            emailForm: {
                sendRate: '1',
                toAddress: ''
            },
            rules: {
                sendRate: [{
                    required: true,
                    message: '请选择发送频率',
                    trigger: 'change'
                }],
                toAddress: [{
                    validator: validateEmail,
                    trigger: 'blur'
                }]
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.getList()
        })
    },
    methods: {
        validAdd(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.addData()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        addData() {
            let data = {
                queryData: {},
                paramsData: {
                    sendRate: this.emailForm.sendRate,
                    toAddress: this.emailForm.toAddress
                }
            }
            console.log(data)
            add_email_config(data).then(res => {
                this.$message({
                    message: '保存成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.getList()
                }, 1500)
            }).catch(error => {
                console.log('error', error)
            })
        },
        getList() {
            let data = {}
            console.log('获取邮箱配置11')
            get_email_config().then(res => {
                console.log('获取邮箱配置', res)
                this.emailForm = {
                    sendRate: res.sendRate + '',
                    toAddress: res.toAddress
                }
            }).catch(error => {
                console.log('error', error)
            })
        }

    }
}
</script>

<style lang="scss" scoped>
$fontColor:#409eff;
    .content {

        /* background: url("../../assets/img/content_bg.png") center bottom no-repeat;
        background-color: rgba(17, 29, 43, .8);
        background-size: contain;
        height: 100%;
        position: relative; */
    }
    .angle-img-left {
        position: absolute;
        left: 20px;
        top: 20px;
    }
    .angle-img-right {
        position: absolute;
        right: 20px;
        bottom: 20px;
    }

    .instruction-content {
        position: absolute;
        left: 0;
        top: 100px;
        //bottom: 0;
    }

    .el-switch>>>.el-switch__label.is-active {
        color: #78ddff;
    }

    .switch>>>.el-input__inner {
        width: 100px !important;
    }

    .switch .yuzhi {
        margin-left: 40px;

        >div {
            font-size: 12px;
            color: #ffff;
            padding-right: 5px;
        }
    }
    .from-box{
        transform: translateX(-30px);
    }
    .from-box>>>.el-date-editor.el-input{
        width:220px!important;
    }
    .el-icon-question{
        color:$fontColor;
    }
</style>

