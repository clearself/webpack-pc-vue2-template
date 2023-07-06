<template>
    <div class="modal" v-if="dialogVisible" :class="{now: now}">
        <div class="mail" :class="{now: now}">
            <img v-if="type === 'mail'" class="picture" src="../../../assets/img/login/login-mail.png" alt="" />
            <img v-else class="picture" src="../../../assets/img/login/login-phone.png" alt="" />
            <div class="content ub ub-ver ub-ac">
                <p class="title">输入验证码</p>
                <p class="tips">我们已向 {{type==='mail' ? msg.mail : msg.phone}} 发送了一个4位验证码</p>
                <VerifyCodeInput :type="type" :captcha="captcha" :time="time"></VerifyCodeInput>
                <p v-if="type==='phone'" class="count-time" :class="{'code-getting' : isPhoneGetting}" @click="getPhoneVerifyCode">{{getPhoneCode}}</p>
                <p v-else class="count-time" :class="{'code-getting' : isMailGetting}" @click="getMailVerifyCode">{{getMailCode}}</p>
                <p v-if="type === 'mail'" class="change-way">邮箱无法接受验证码？点击切换 <span @click="changeWay('phone')"> 手机验证</span></p>
                <p v-else class="change-way">手机无法接受短信码？点击切换 <span @click="changeWay('mail')"> 邮件验证</span></p>

            </div>
        </div>
    </div>
</template>

<script>
import VerifyCodeInput from '@/pages/login/VerifyCodeInput'
export default {
    name: 'VerifyCodeDialog',
    components: {
        VerifyCodeInput
    },
    props: {
        dialogVisible: {
            default: true
        },
        captcha: {
            default: ''
        },
        time: {
            default: ''
        },
        type: {
            default: ''
        },
        msg: {
            default: {
                mail: '',
                phone: ''
            }
        }
    },
    data() {
        return {
            phoneCount: 60,
            mailCount: 60,
            getPhoneCode: '获取验证码',
            getMailCode: '获取验证码',
            isPhoneGetting: false,
            isMailGetting: false,
            now: false
        }
    },
    watch: {
        dialogVisible(newValue) {
            if (newValue) {
                setTimeout(() => {
                    this.now = true
                }, 80)
            }
        }
    },
    methods: {
        changeWay(type) {
            this.$emit('changeType', type)
        },
        getPhoneVerifyCode() {
            if (this.isPhoneGetting) return
            this.$emit('sendCode')
            const countDown = setInterval(() => {
                if (this.phoneCount < 1) {
                    this.isPhoneGetting = false
                    this.getPhoneCode = '获取验证码'
                    this.phoneCount = 60
                    clearInterval(countDown)
                } else {
                    this.isPhoneGetting = true
                    this.getPhoneCode = '（' + this.phoneCount-- + 's）' + '后重新发送'
                }
            }, 1000)
        },
        getMailVerifyCode() {
            if (this.isMailGetting) return
            this.$emit('sendCode')
            const countDown = setInterval(() => {
                if (this.mailCount < 1) {
                    this.isMailGetting = false
                    this.getMailCode = '获取验证码'
                    this.mailCount = 60
                    clearInterval(countDown)
                } else {
                    this.isMailGetting = true
                    this.getMailCode = '（' + this.mailCount-- + 's）' + '后重新发送'
                }
            }, 1000)
        }
    }
}
</script>

<style scoped lang="scss">
$blue: #387dee;
.modal {
    position: fixed;
    z-index: 9999;
    left:0;
    top:0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color:rgba(0,0,0,0);
    transition: background-color .5s;
}
.modal.now {
    background-color:rgba(0,0,0,.4);
}
.mail {
    position: fixed;
    width: 560px;
    height: 500px;
    top: 5vh;
    left: 50%;
    background-color: #fff;
    z-index: 999;
    border-radius: 20px;
    transform: translateX(-50%);
    transition: all 0.5s ease-in;
}
.mail.now {
    top: 20vh;
}
.picture {
    width:320px;
    top: 20px;
    left: 56%;
    transform: translateX(-50%);
    position: absolute;
}
.content {
    margin-top: 206px;

    .title {
        color: rgba(0,0,0,0.9);
        font-size: 20px;
        line-height: 28px;
        margin-bottom: 16px;
    }
    .tips {
        color: rgba(0, 0, 0, 0.4);
        font-size: 14px;
        margin-bottom: 32px;
    }
    .count-time {
        color: $blue;
        cursor: pointer;
        font-size: 14px;
        margin: 16px 0 44px;
    }
    .change-way {
        color: rgba(0, 0, 0, 0.4);
        font-size: 12px;
        span {
            text-decoration: underline;
            color: $blue;
            cursor: pointer;
        }
    }
    .code-getting {
        cursor: not-allowed;
        color: rgba(0, 0, 0, 0.26) !important;
    }
}
</style>

