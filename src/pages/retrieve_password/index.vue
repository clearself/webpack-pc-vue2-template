<template>
    <div class="register w100 h100 ub ub-ac ub-pc">
        <div class="main ub ub-ac ub-pc">
            <div class="title-info ub ub-pc ub-ac">
                <p>{{safetyInfo.systemName}}</p>
            </div>
            <div class="w100 form">
                <div class="back-btn" @click="goBack">
                    <i class="iconfont icon-fanhui"></i>
                </div>
                <div class="register-form">
                    <el-form
                        class="register-form-box"
                        label-position="top"
                        :model="registerForm"
                        :rules="registerRules"
                        ref="registerForm">
                        <el-form-item prop="username" label="请输入您的用户名" :label-width="formLabelWidth">
                            <el-input
                                prefix-icon="iconfont icon-zhanghu"
                                clearable
                                placeholder="请输入您的用户名"
                                v-model.trim="registerForm.username"
                                autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item
                            style="position:relative"
                            v-if="verifyType === 'phone'"
                            label="请输入手机号"
                            prop="phone"
                            :label-width="formLabelWidth">
                            <span class="toggle-way" @click="changeType('mail')">邮箱验证</span>
                            <el-input
                                prefix-icon="iconfont icon-shouji"
                                clearable
                                placeholder="请输入手机号"
                                v-model.trim="registerForm.phone"
                                autocomplete="off">

                                <p class="ub ub-pc ub-ac sent-text" :class="{'code-getting' : isPhoneGetting}" slot="append" @click="getPhoneVerifyCode">{{getPhoneCode}}</p>
                            </el-input>
                        </el-form-item>
                        <el-form-item
                            style="position:relative"
                            v-if="verifyType === 'mail'"
                            label="请输入邮箱"
                            prop="mail"
                            :label-width="formLabelWidth">
                            <span class="toggle-way" @click="changeType('phone')">手机验证</span>
                            <el-input
                                prefix-icon="iconfont icon-shouji"
                                clearable
                                placeholder="请输入邮箱"
                                v-model.trim="registerForm.mail"
                                autocomplete="off">
                                <p class="ub ub-pc ub-ac sent-text" :class="{'code-getting' : isMailGetting}" slot="append" @click="getMailVerifyCode">{{getMailCode}}</p>
                            </el-input>
                        </el-form-item>
                        <el-form-item
                            label="请输入验证码"
                            prop="verificationCode"
                            :label-width="formLabelWidth">
                            <el-input
                                prefix-icon="iconfont icon-yanzhengma"
                                clearable
                                placeholder="请输入验证码"
                                v-model.trim="registerForm.verificationCode"
                                :readOnly="registerForm.readOnly"
                                @click.native="registerForm.readOnly = false"
                                autocomplete="off">
                            </el-input>
                        </el-form-item>
                        <el-form-item
                            label="请输入密码"
                            class="password"
                            prop="password"
                            :label-width="formLabelWidth">
                            <el-input
                                prefix-icon="iconfont icon-mima"
                                show-password
                                placeholder="请输入密码"
                                v-model.trim="registerForm.password"></el-input>
                        </el-form-item>
                        <el-form-item
                            label="请再次输入密码"
                            class="surePassWord"
                            prop="surePassWord"
                            :label-width="formLabelWidth">
                            <el-input
                                prefix-icon="iconfont icon-mima"
                                show-password
                                placeholder="请输入密码"
                                v-model.trim="registerForm.surePassWord"></el-input>
                        </el-form-item>
                        <div class="submit">
                            <el-button :disabled="isLogin" class="w100" type="primary" @click="validUser">{{isLogin ? '正在登录中，请稍后...' : '重置并登录'}}</el-button>
                        </div>
                    </el-form>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import DevicePixelRatio from '@/assets/js/devicePixelRatio.js'
import md5 from 'js-md5'
import myRules from '@/utils/rules.js'
import {
    get_security_policy,
    forget,
    sendVerifyCode
} from '@/server/login/index.js'
export default {
    name: 'Retrieve',
    data() {
        var validatePhone = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入手机号'))
            } else if (!(/^1[345678]\d{9}$/.test(value))) {
                callback(new Error('请输入真实手机号'))
            } else {
                callback()
            }
        }
        var validateMail = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入邮箱'))
            } else if (!(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/.test(value))) {
                callback(new Error('请输入有效的邮箱地址'))
            } else {
                callback()
            }
        }
        var validatePwdSure = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'))
            } else if (value !== this.registerForm.password) {
                callback(new Error('两次输入密码不一致'))
            } else {
                callback()
            }
        }
        return {
            verifyType: 'phone', // phone、mail
            phoneCount: 60,
            mailCount: 60,
            getPhoneCode: '获取验证码',
            getMailCode: '获取验证码',
            isPhoneGetting: false,
            isMailGetting: false,
            adminText: '请联系管理员 13845123XXX(张)',
            formLabelWidth: '310px',
            safetyInfo: {
                pwLimit: 10,
                pwDefault: 1, // 密码策略，1 默认 2 自定义
                pwCustom: 1, // 1 数字， 2 大写字母， 3 小写字母， 4 特殊字符
                graphicVerification: 2, // 是否图形验证码 1 是 2 否
                verificationMode: 1, // 双因子 1 邮箱  2 手机校验
                doubleVerification: 2, // 是否开启双因子 1 是 2 否
                style: 1, // 1 默认 2 左侧 3 顶部
                colour: '', // 主题颜色： 1 默认 2 浅色 3 深色
                systemName: '基础开发平台', // 系统名称
                logoAddress: '', // logo 地址
                adminPhone: '', // 管理员联系方式
                lockTime: '', // 锁定时间
                lockTimeUnit: '' // 锁定时间单位 1分、2小时、3天、4月
            },
            registerForm: {
                username: '',
                phone: '',
                mail: '',
                verificationCode: '',
                password: '',
                surePassWord: '',
                readOnly: true
            },
            registerRules: {
                username: [{
                    required: true,
                    message: '请输入用户名',
                    trigger: 'blur'
                }],
                phone: [{
                    required: true,
                    validator: validatePhone,
                    trigger: 'blur'
                }],
                mail: [{
                    required: true,
                    validator: validateMail,
                    trigger: 'blur'
                }],
                surePassWord: [{
                    required: true,
                    validator: validatePwdSure,
                    trigger: 'blur'
                }],
                password: Object.assign(myRules.loginPwd[0], { limit: 8, pwDefault: 1 }),
                verificationCode: [{
                    required: true,
                    message: '请输入验证码',
                    trigger: 'blur'
                }]
            },
            isLogin: false,
            checked: true,
            refresh: 0
        }
    },
    created() {
        // 监听屏幕比例变化，强制禁止缩放
        new DevicePixelRatio().init()
        this.getInitInfo()
    },
    methods: {
        goBack() {
            this.$router.back(-1)
        },
        getInitInfo() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_security_policy(data).then(res => {
                console.log(res, '安全策略')
                this.safetyInfo.pwLimit = res.pwLimit ?? 8
                this.safetyInfo.pwDefault = res.pwDefault ?? 1
                this.safetyInfo.pwCustom = res.pwCustom ?? '1,2'
                this.safetyInfo.graphicVerification = res.graphicVerification ?? 2
                this.safetyInfo.verificationMode = res.verificationMode ?? 1
                this.safetyInfo.doubleVerification = res.doubleVerification ?? 2
                this.safetyInfo.style = res.style ?? 1
                this.safetyInfo.colour = res.colour ?? 1
                this.safetyInfo.systemName = res.systemName ?? '基础开发平台'
                this.safetyInfo.logoAddress = res.logoAddress ?? ''
                this.safetyInfo.adminPhone = res.adminPhone ?? ''
                this.safetyInfo.lockTime = res.lockTime ?? ''
                this.safetyInfo.lockTimeUnit = res.lockTimeUnit ?? ''

                let obj = {
                    user: {

                    },
                    pwd: {
                        pwDefault: res.pwDefault,
                        pwCustom: res.pwCustom,
                        limit: res.pwLimit
                    },
                    theme: {
                        style: res.style,
                        color: res.colour,
                        systemName: res.systemName,
                        logoAddress: res.logoAddress
                    }
                }
                this.$setlocalStorage('initInfo', obj)
                document.title = res.systemName ?? '基础开发平台'
                this.registerRules.password = Object.assign(myRules.loginPwd[0], obj.pwd)
            }).catch(error => {
                console.log(error)
            })
        },
        changeType(type) {
            type === 'mail' && this.$refs.registerForm.clearValidate(['phone'])
            type === 'phone' && this.$refs.registerForm.clearValidate(['mail'])
            this.verifyType = type
        },
        handleRefresh() {
            console.log(12)
            this.refresh = Date.now()
        },
        validUser() {
            this.$refs.registerForm.validate((valid) => {
                if (valid) {
                    if (this.isLogin) return
                    this.isLogin = true
                    this.login()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        login() {
            let data = {
                queryData: {},
                paramsData: {
                    username: this.registerForm.username,
                    password: md5(this.registerForm.surePassWord),
                    sendType: this.verifyType === 'mail' ? 1 : 0,
                    verificationCode: this.registerForm.verificationCode
                }
            }
            if (data.paramsData.sendType == 1) {
                data.paramsData.mailBox = this.registerForm.mail
            } else {
                data.paramsData.phone = this.registerForm.phone
            }
            forget(data).then(res => {
                this.isLogin = false
                if (res.status == 1) {
                    this.$message.warning('您的账号输入失败次数过多，系统将锁定账号!')
                    this.failed = true
                    return
                } else if (res.status == 2) {
                    this.$message.warning('您的账号已被禁用，请联系系统管理员!')
                    this.failed = true
                    return
                }
                let initInfo = this.$getlocalStorage('initInfo')
                if (initInfo && initInfo.user) {
                    initInfo.user.chineseName = res.chineseName
                    initInfo.user.token = res.token
                    this.$setlocalStorage('initInfo', initInfo)
                }

                this.$router.push('/layout')
                console.log(res)
            }).catch(err => {
                this.isLogin = false
                this.handleRefresh()
                console.log(err)
            })
        },
        sendCode() {
            let data = {
                queryData: {},
                paramsData: {
                    username: this.registerForm.username,
                    sendType: this.verifyType === 'mail' ? 1 : 0
                }
            }
            if (this.verifyType === 'mail') {
                data.paramsData.mailbox = this.registerForm.mail
            } else {
                data.paramsData.phone = this.registerForm.phone
            }
            return sendVerifyCode(data).then(res => {
                console.log(res, '发送验证码')
            })
        },
        getPhoneVerifyCode() {
            if (this.isPhoneGetting) return
            let fieldsToValidate = ['username', 'phone']
            Promise.all(fieldsToValidate.map(item => {
                return new Promise((resolve, reject) => {
                    this.$refs.registerForm.validateField(item, result => {
                        resolve(result)
                    })
                })
            })).then(res => {
                console.log(res, '校验字段')
                let msg = res.find(res => {
                    return res !== ''
                })
                if (!msg) {
                    this.sendCode().then(res => {
                        console.log(res)
                        const countDown = setInterval(() => {
                            if (this.phoneCount < 1) {
                                this.isPhoneGetting = false
                                this.getPhoneCode = '获取验证码'
                                this.phoneCount = 60
                                clearInterval(countDown)
                            } else {
                                this.isPhoneGetting = true
                                this.getPhoneCode = this.phoneCount-- + 's后重发'
                            }
                        }, 1000)
                    }).catch(err => {
                        console.log(err)
                    })
                }
            })
        },
        getMailVerifyCode() {
            if (this.isMailGetting) return
            let fieldsToValidate = ['username', 'mail']
            Promise.all(fieldsToValidate.map(item => {
                return new Promise((resolve, reject) => {
                    this.$refs.registerForm.validateField(item, result => {
                        resolve(result)
                    })
                })
            })).then(res => {
                console.log(res, '校验字段')
                let msg = res.find(res => {
                    return res !== ''
                })
                if (!msg) {
                    this.sendCode().then(res => {
                        const countDown = setInterval(() => {
                            if (this.mailCount < 1) {
                                this.isMailGetting = false
                                this.getMailCode = '获取验证码'
                                this.mailCount = 60
                                clearInterval(countDown)
                            } else {
                                this.isMailGetting = true
                                this.getMailCode = this.mailCount-- + 's后重发'
                            }
                        }, 1000)
                    }).catch(err => {
                        console.log(err)
                    })
                }
            }).catch(err => {
                console.log(err)
            })
        }
    }
}
</script>

<style scoped lang="scss">
$dark: rgba(0, 0, 0, 0.9);
$blue: #387dee;
.register {
    position: fixed;
    background: url('../../assets/img/login/login-bg.jpg') center center no-repeat fixed;
    background-size: cover;
    .main {
        width: 1446px;
        height: 1084px;
        background-color: #ebf6fd;
        position: relative;
        background: url('../../assets/img/login/register-inner.png') center center no-repeat;
        background-size: 96% 96%;
        background-position-y: 45px;
        .title-info {
            height: 40px;
            line-height: 40px;
            top: 200px;
            position: absolute;
            z-index: 10;
            p {
                font-size: 50px;
                font-family: Hkxzy;
                color: #3579ec;
                text-shadow: 10px 10px 4px rgba(13, 64, 133, .1);
            }
        }
        .form {
            position: relative;
            width: 380px;
            .back-btn {
                position: absolute;
                top: 57px;
                right: -57px;
                cursor: pointer;
                color: #3579ec;
            }
            .toggle-way {
                position: absolute;
                right: 0;
                height: 20px;
                line-height: 20px;
                top: -27px;
                font-size: 12px;
                text-decoration: underline;
                color: $blue;
                cursor: pointer;
            }
            .sent-text {
                font-size: 12px;
            }
        }
        .register-form {
            margin-top: 60px;
            & ::v-deep .el-form--label-top .el-form-item__label {
                font-size: 12px;
                color: rgba(0, 0, 0, 0.26);
                height: 20px;
                line-height: 20px;
                padding: 0;
                margin-bottom: 8px;
            }
            & ::v-deep .el-form-item {
                margin-bottom: 16px;

                .el-input__prefix {
                    color: $blue;
                    left: 16px;
                    i {
                        font-weight: 500;
                        font-size: 20px;
                    }
                }
                .el-input--prefix .el-input__inner {
                    padding-left: 42px;
                }
            }
            &::v-deep {
                .el-input-group__append {
                    padding: 0;
                    width: 80px;
                    cursor: pointer;
                    height: 40px;
                    box-sizing: border-box;
                    background-color: #fff;

                    p {
                        color: $blue;
                        text-decoration: underline;
                    }
                }
            }
        }

        .submit {
            .el-button {
                margin: 8px 0;
            }
            & ::v-deep .el-checkbox__label,
            .el-checkbox {
                font-size: 12px;
            }
            .mark {
                height: 20px;
                font-size: 12px;

                .forget-pwd {
                    cursor: pointer;
                    color: $blue;
                    text-align: right;
                }
            }
            & ::v-deep .el-checkbox__input.is-checked+.el-checkbox__label,
            & ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner {
                color: $blue;
            }
            & ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner {
                background-color: $blue;
                border-color: $blue;
            }
            & ::v-deep .el-button--primary {
                background-color: $blue;
                border-color: $blue;
            }
            & ::v-deep .el-button--primary:focus,
            & ::v-deep .el-button--primary:hover {
                opacity: .9;
            }
            & ::v-deep .el-button--primary.is-disabled {
                background-color: #dcdcdc;
                border-color: #dcdcdc;
            }
        }
        & ::v-deep .el-icon-view:before {
            content: '\e7e5';
            font-family: iconfont;
        }
        & ::v-deep .el-input__inner:focus {
            box-shadow: 0 4px 8px rgba(0,0,0,.1)
        }
        .code-getting {
            cursor: not-allowed;
            color: rgba(0, 0, 0, 0.26) !important;
        }
    }
}
</style>
