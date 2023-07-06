<template>
    <div class="container">
        <CodeInput ref="code" :loading="false" :fields="4" :fieldWidth="60" :fieldHeight="60" class="input" v-on:change="onChange" v-on:complete="onComplete" />
    </div>
</template>

<script>
import CodeInput from 'vue-verification-code-input'
import {
    login
} from '@/server/login/index.js'
import { encode, decode } from 'js-base64'
import md5 from 'js-md5'

export default {
    name: 'VerifyCodeInput',
    components: {
        CodeInput
    },
    props: {
        type: {
            type: String,
            required: true
        },
        captcha: {
            default: ''
        },
        time: {
            default: ''
        }
    },
    watch: {
        type(val) {
            if (val) {
                this.$refs.code.values = ['', '', '', '']
            }
        }
    },
    methods: {
        onChange(v) {
            // console.log('onChange ', v)
        },
        onComplete(v) {
            console.log('onComplete ', v)
            let loginInfo = this.$getlocalStorage('loginInfo')
            let data = {
                queryData: {},
                paramsData: {
                    username: loginInfo.username,
                    verificationCode: v,
                    sendType: this.type === 'mail' ? 1 : 0,
                    password: md5(decode(loginInfo.password)),
                    captcha: this.captcha,
                    time: this.time,
                    loginType: 1
                }
            }
            login(data).then(res => {
                console.log('res', '验证码登录成功')
                this.$parent.$parent.verifyDialog = false
                let initInfo = this.$getlocalStorage('initInfo')
                if (initInfo && initInfo.user) {
                    initInfo.user.chineseName = res.chineseName
                    initInfo.user.token = res.token
                }
                this.$setlocalStorage('initInfo', initInfo)
                this.$router.push('/layout')
            }).catch(err => {
                console.log(err)
                this.$refs.code.values = ['', '', '', '']
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.container {
    width: 360px;
}
.container ::v-deep .react-code-input {
    width: 360px;
}
.container ::v-deep .react-code-input input {
    border-radius: 0 !important;
    border-left: none !important;
    border-right: none !important;
    border-top: none !important;
    margin-right: 40px;
}
.container ::v-deep .react-code-input input:last-child {
    margin-right: 0;
}
</style>
