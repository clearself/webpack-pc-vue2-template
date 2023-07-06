<template>
    <div class="expire w100">
        <div class="content">
            <img class="mb-3" src="./../../assets/img/expire/remind.png" alt="">
            <div class="one">您的授权已到期！</div>
            <div class="two mb-1">序列号: {{ serialCode }}</div>
            <div class="two mb-4">您之前的系统授权已到期，请在此输入新的授权码</div>
            <div>
                <el-input size="small" v-model="powerCode" placeholder="请输入新的授权码" style="width: 480px;" class="mr-1"></el-input>
                <el-button size="small" type="primary" @click="sendCode">确认</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import {
    sendPowerCode
} from '@/server/login/index.js'
export default {
    data() {
        return {
            serialCode: '',
            powerCode: ''
        }
    },
    created() {
        this.serialCode = this.$route.query.serialNo
    },
    methods: {
        sendCode() {
            let data = {
                queryData: {},
                paramsData: {
                    serialNo: this.serialCode,
                    authorizationCode: this.powerCode
                }
            }
            sendPowerCode(data).then(res => {
                console.log(res)
                this.$message.success('授权成功')
                this.$router.replace('/login')
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.expire {
    height: 100vh;
    background: url('./../../assets/img/expire/bg.jpg') no-repeat;
    background-size: 100% 100%;
    background-attachment: fixed;
    padding-top: 30vh;
    .content {
        text-align: center;
        img {
            width: 104px;
        }
        .one {
            margin-bottom: 14px;
            font-size: 20px;
            color: rgba(0, 0, 0, 0.9);
        }
        .two {
            font-size: 14px;
            color: rgba(0, 0, 0, 0.6);
        }
    }
}
</style>
