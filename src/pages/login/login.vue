<template>
    <div></div>
</template>
<script>
import {
    ssoloading,
    get_security_policy
} from '@/server/login/index.js'

export default {
    created() {
        this.getInitInfo()
        console.log(1111)
        let data = {
            queryData: {},
            paramsData: {}
        }
        ssoloading(data).then(res => {
            if (res == null) {
                this.$router.push('/login')
            } else {
                // this.$router.push('/login')
                window.location.href = '/api/base-server/sso/initAuthorize'
                // this.$router.push('/login')
            }
            console.log(res)
        })
    },
    data() {
        return {
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
        }
    }
}
</script>
