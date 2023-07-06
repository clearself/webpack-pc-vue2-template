<template>
    <div class="list" v-loading="loading">
        <div class="ub ub-pj w100 mb-1 mt-2">
            <div class="list-tips">授权内容</div>
        </div>
        <div class="content">
            <div class="mb-2">
                您的授权码到期时间为
                <span style="color: #387dee"> {{ getymdDate(surplusDate) }}</span>
            </div>
            <div class="text mb-1">
                序列号: {{ serialCode }}
            </div>
            <div class="text mb-4">
                请在此输入新的授权码
            </div>
            <div>
                <el-input size="small" v-model="powerCode" placeholder="请输入新的授权码" style="width: 480px;" class="mr-1"></el-input>
                <el-button size="small" type="primary" v-per="['add_power']" @click="sendCode">确认</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import {
    sendPowerCode,
    viewCode
} from '@/server/login/index.js'
export default {
    data() {
        return {
            surplusDate: '',
            serialCode: '',
            powerCode: '',
            loading: false
        }
    },
    created() {
        this.getCode()
    },
    methods: {
        getymdDate(data) {
            if (data === '0') {
                return '已过期'
            } else {
                return data
            }
        },
        getCode() {
            viewCode().then(res => {
                console.log(res, '授权信息')
                this.surplusDate = res.countDown
                this.serialCode = res.serialNo
            })
        },
        sendCode() {
            this.loading = true
            let data = {
                queryData: {},
                paramsData: {
                    serialNo: this.serialCode,
                    authorizationCode: this.powerCode
                }
            }
            sendPowerCode(data).then(res => {
                this.powerCode = ''
                console.log(res)
                this.$message.success('授权成功')
                this.loading = false
                this.getCode()
            }).catch(error => {
                console.log(error)
                this.loading = false
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.list {
    height: calc(100vh - 120px);
    background-color: #fff;
    margin: 0 24px;
    box-shadow: 0px 0px 10px 0px rgba(41, 48, 66, 0.1);
    border-radius: 4px;
    .content {
        text-align: center;
        padding-top: 25vh;
        .text {
            font-size: 14px;
            color: rgba(0, 0, 0, 0.6);
        }
    }
}
</style>
