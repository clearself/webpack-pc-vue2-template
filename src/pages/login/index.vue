<template>
    <div class="login w100 h100 ub ub-ac ub-pc">
        <div class="main ub ub-ac ub-pc">
            <div class="title-info ub ub-pc ub-ac">
                <p>{{safetyInfo.systemName}}</p>
            </div>
            <div class="form">
                <p v-if="failed" class="warn-tips">您的账号输入失败次数过多，系统将锁定账号{{safetyInfo.lockTime}}{{safetyInfo.lockTimeUnit | limitUnit}}后解除，或您可<span :class="{'admin-phone': safetyInfo.adminPhone}" @click="()=>{(safetyInfo.adminPhone) && (adminDialog = true)}">联系管理员进行申诉</span></p>
                <p v-if="loginCount && !failed" class="warn-tips">账号或密码错误，您还可以尝试{{loginCount}}次</p>
                <div class="login-form">
                    <el-form
                        class="login-from-box"
                        label-position="top"
                        :model="loginForm"
                        :rules="loginRules"
                        ref="loginForm">
                        <el-form-item prop="username" label="用户名" :label-width="formLabelWidth" :class="{'mt40': safetyInfo.graphicVerification !== 1}">
                            <el-input
                                prefix-icon="iconfont icon-zhanghu"
                                clearable
                                placeholder="请输入用户名"
                                v-model.trim="loginForm.username"
                                autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item
                            label="用户密码"
                            class="password"
                            :class="{'mt40': safetyInfo.graphicVerification !== 1}"
                            prop="password"
                            :label-width="formLabelWidth">
                            <el-input
                                prefix-icon="iconfont icon-mima"
                                show-password
                                placeholder="请输入密码"
                                @keyup.native.enter="validUser"
                                v-model.trim="loginForm.password"
                                autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item
                            v-if="safetyInfo.graphicVerification == 1"
                            label="图形验证码"
                            prop="captcha"
                            :label-width="formLabelWidth">
                            <el-input
                                prefix-icon="iconfont icon-yanzhengma"
                                clearable
                                placeholder="请输入验证码"
                                class="input-code"
                                v-model.trim="loginForm.captcha"
                                @keyup.native.enter="validUser"
                                autocomplete="off">

                                <img
                                    slot="append"
                                    @click="handleRefresh"
                                    style="width: 120px;height: 38px;display: block;border-radius: 4px"
                                    :src="verifyCode"
                                    alt="验证码">

                            </el-input>
                        </el-form-item>
                        <div class="submit">
                            <el-button :disabled="isLogin" class="w100" type="primary" @click="validUser">{{isLogin ? '正在登录中，请稍后...' : '登 录'}}</el-button>
                            <div class="mark ub ub-pj ub-ac">
                                <div class="remember-pwd">
                                    <el-checkbox v-model="checked">记住密码</el-checkbox>
                                </div>
                                <div  class="forget-pwd" @click="goRegister">重置密码？</div>
                            </div>
                        </div>
                    </el-form>
                </div>
            </div>
        </div>

        <AdminDialog
            :dialogVisible="adminDialog"
            :text="safetyInfo.adminPhone"
            @cancel="adminDialog = false"
            @sure="adminDialog = false"></AdminDialog>

        <VerifyCodeDialog
            :dialogVisible="verifyDialog"
            :msg="myMsg"
            :captcha="loginForm.captcha"
            :time="refresh"
            @changeType="(val)=>verifyType = val"
            @sendCode="sendCode"
            :type= 'verifyType'>
        </VerifyCodeDialog>
    </div>
</template>
<script>
import md5 from 'js-md5'
import { encode, decode } from 'js-base64'
import DevicePixelRatio from '@/assets/js/devicePixelRatio.js'
import AdminDialog from '@/pages/login/AdminDialog'
import VerifyCodeDialog from '@/pages/login/VerifyCodeDialog'
import {
    get_security_policy,
    login,
    sendVerifyCode,
    getCode
} from '@/server/login/index.js'

export default {
    name: 'Login',
    components: {
        AdminDialog,
        VerifyCodeDialog
    },
    data() {
        return {
            adminDialog: false,
            verifyDialog: false,
            verifyType: 'mail',
            formLabelWidth: '80px',
            loginForm: {
                username: '',
                password: '',
                captcha: '',
                phone: '',
                mailbox: ''
            },
            myMsg: {
                phone: '',
                mail: ''
            },
            failed: false,
            loginCount: '',
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
                logoAddress: require('../../assets/img/logo.png'), // logo 地址
                adminPhone: '', // 管理员联系方式
                lockTime: '', // 锁定时间
                lockTimeUnit: '' // 锁定时间单位 1分、2小时、3天、4月
            },
            loginRules: {
                username: [{
                    required: true,
                    message: '请输入用户名',
                    trigger: 'blur'
                }],
                password: [{
                    required: true,
                    message: '请输入密码',
                    trigger: 'blur'
                }],
                captcha: [{
                    required: true,
                    message: '请输入验证码',
                    trigger: 'blur'
                }]
            },
            isLogin: false,
            checked: true,
            refresh: Date.now()
        }
    },

    computed: {
        verifyCode() {
            return '/api/base-server/getCaptcha?width=120&height=38&time=' + this.refresh
        }
    },
    created() {
        // 判断授权是否过期
        this.getExpire()
        // 监听屏幕比例变化，强制禁止缩放
        // new DevicePixelRatio().init()
        this.handleRefresh()
        let loginInfo = this.$getlocalStorage('loginInfo')
        if (loginInfo != '') {
            loginInfo.password = decode(loginInfo.password)
            this.loginForm = loginInfo
            this.checked = true
        }
        this.getInitInfo()
    },
    filters: {
        limitUnit(val) {
            let obj = {
                1: '分钟',
                2: '小时',
                3: '天',
                4: '月'
            }
            return obj[val]
        }
    },
    methods: {
        getExpire() {
            getCode().then(res => {
                console.log(res)
                if (res.code == '9001') {
                    this.$message.warning('未授权')
                    this.$router.replace({
                        path: '/power_expire',
                        query: {
                            serialNo: res.serialNo
                        }
                    })
                }
            })
        },
        checkViChange() {
            if (!document.hidden) {
                this.getInitInfo() // 页面可见时
            }
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
                // this.safetyInfo.logoAddress = '/api/base-server/terminal/toViewPicture'
                this.safetyInfo.adminPhone = res.adminPhone ?? ''
                this.safetyInfo.lockTime = res.lockTime ?? ''
                this.safetyInfo.lockTimeUnit = res.lockTimeUnit ?? ''
                // this.$setsessionStorage('userInfo', userInfo)
                this.$store.commit('common/setLogo', res.logoAddress)
                this.$store.commit('common/setName', res.systemName)

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
            }).catch(error => {
                console.log(error)
            })
        },
        handleRefresh() {
            this.refresh = Date.now()
        },
        validUser() {
            this.$refs.loginForm.validate((valid) => {
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
                    username: this.loginForm.username,
                    password: md5(this.loginForm.password),
                    time: this.refresh,
                    captcha: this.loginForm.captcha,
                    loginType: 0
                }
            }
            login(data).then(res => {
                this.isLogin = false
                // if (res.status == 1) {
                //     this.$message.warning('您的账号输入失败次数过多，系统将锁定账号!')
                //     this.failed = true
                //     return
                // } else if (res.status == 2) {
                //     this.$message.warning('您的账号已被禁用，请联系系统管理员!')
                //     this.failed = true
                //     return
                // } else if (res.status == 3) {
                //     this.$message.warning('账号或密码错误!')
                //     this.failed = false
                //     this.loginCount = res.look ?? ''
                //     return
                // }
                this.loginForm.phone = this.myMsg.phone = res.phone
                this.loginForm.mailbox = this.myMsg.mail = res.mailbox

                if (this.checked) {
                    let obj = {
                        username: this.loginForm.username,
                        password: encode(this.loginForm.password),
                        phone: this.loginForm.phone,
                        mailbox: this.loginForm.mailbox,
                        pwUpdateTime: res.pwUpdateTime
                    }
                    this.$setlocalStorage('loginInfo', obj)
                }
                /* ----开启双因子---*/
                if (this.safetyInfo.doubleVerification == 1) {
                    if (this.safetyInfo.verificationMode == 1) {
                        this.verifyType = 'mail'
                    } else {
                        this.verifyType = 'phone'
                    }

                    this.verifyDialog = true
                } else {
                    let initInfo = this.$getlocalStorage('initInfo')
                    if (initInfo && initInfo.user) {
                        initInfo.user.chineseName = res.chineseName
                        initInfo.user.token = res.token
                        this.$setlocalStorage('initInfo', initInfo)
                    }
                    this.$router.push('/layout')
                }
                console.log(res)
            }).catch(err => {
                this.isLogin = false
                this.handleRefresh()
                console.log(err)
            })
        },
        goRegister() {
            this.$router.push('/retrieve_password')
        },
        sendCode() {
            let data = {
                queryData: {},
                paramsData: {
                    username: this.loginForm.username,
                    sendType: this.verifyType === 'mail' ? 1 : 0
                }
            }
            sendVerifyCode(data).then(res => {
                console.log(res, '发送验证码')
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
.login {
    position: fixed;
    background: url('../../assets/img/login/login-bg.jpg') center center no-repeat fixed;
    background-size: 100% 99%;
    .main {
        width: 1446px;
        height: 1084px;
        background-color: #ebf6fd;
        position: relative;
        background: url('../../assets/img/login/login-inner.png') center center no-repeat;
        background-size: 90% 90%;
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
                letter-spacing: 8px;
            }
        }
        .form {
            z-index: 999;
            width: 380px;
            position: relative;
            .warn-tips {
                font-size: 12px;
                color: #ff1414;

                span.admin-phone {
                    text-decoration: underline;
                    cursor: pointer;
                }
            }
        }
        .login-form {
            & ::v-deep .el-form--label-top .el-form-item__label {
                font-size: 13px!important;
                color: rgba(0, 0, 0, 0.26);
                height: 20px;
                line-height: 20px;
                padding: 0;
                margin-bottom: 8px;
            }
            & ::v-deep .el-form-item {
                margin-bottom: 30px;

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
                    // &:hover {
                        // border-color: #3579ec!important;
                    // }
                }
            }
            &::v-deep {
                .el-input-group__append {
                    padding: 0;
                    width: 120px;
                    cursor: pointer;
                    height: 40px;
                    box-sizing: border-box;
                    background-color: #fff;

                    img {
                        padding: 4px 16px;
                    }
                }
            }
            .input-code {
                ::v-deep .el-input__inner {
                    border-right: none!important;
                }
            }
        }
        .mt40 {
            margin-bottom: 40px!important;
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
                    &:hover {
                        text-decoration: underline;
                    }
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
            .remember-pwd {
                & ::v-deep .el-checkbox__inner::after {
                    top: 0;
                    left: 3px;
                }
            }
        }
        & ::v-deep .el-icon-view:before {
            content: '\e7e5';
            font-family: iconfont;
        }
        & ::v-deep .el-input__inner:focus {
            box-shadow: 0 4px 8px rgba(0,0,0,.1)
        }
    }
}
</style>
