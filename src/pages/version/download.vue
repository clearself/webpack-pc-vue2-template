<template>
    <div class="bj">
        <div class="content">
            <div class="text">客户端下载</div>
            <div class="tips">如已安装 请先卸载后下载新版本</div>
            <a class="btn w270" :href="downloadURl" download="蓝鲸快信.exe" v-if="url">
                <img src="./../../assets/img/version/windows-fill.svg" alt="">
                <span>Windows客户端下载{{ versionNo }}</span>
            </a>
            <div class="btn" v-else @click="$message.info('请联系管理员上传新版本')">
                <img src="./../../assets/img/version/windows-fill.svg" alt="">
                <span>Windows客户端下载</span>
            </div>
            <div class="tip">支持windows系统</div>
            <div class="content-bj"></div>
        </div>
    </div>
</template>

<script>
import {
    getUrl,
    checkUp
} from '../../server/version/manage.js'
export default {
    data() {
        return {
            url: '',
            versionNo: ''
        }
    },
    computed: {
        downloadURl() {
            let a = '/api/im/file/download' + encodeURI(encodeURI(this.url)) + '?token=' + this.$getlocalStorage('initInfo').user.token
            console.log(a, '1aaaaaaaaaaa')
            return a
        }
    },
    mounted() {
        this.getVersion()
    },
    methods: {
        getVersion() {
            let data = {
                queryData: {
                    version: 1
                },
                paramsData: {}
            }
            getUrl(data).then(res => {
                console.log(res, '下载地址')
                if (res) {
                    this.url = res
                } else {
                    this.$message.info('请联系管理员上传版本')
                }
            })
            let data1 = {
                queryData: {},
                paramsData: {
                    versionNo: '0.0.0'
                }
            }
            checkUp(data1).then(res => {
                console.log(res, '获取检查更新版本号')
                this.versionNo = res.versions.versionNo
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.bj {
    width: 100%;
    height: 100%;
    background-image: url(./../../assets/img/version/bigbj.jpg);
}
.title {
    width: 100%;
    height: 50px;
    line-height: 50px;
    background-color: #2196f3;
    padding-left: 14px;
    box-shadow: 0px 4px 14px 0px rgba(67, 129, 230, 0.35);
    display: flex;
    align-items: center;
}
.title img {
    width: 34px;
    height: 34px;
}
.title span {
    margin-left: 10px;
    font-size: 26px;
    font-family: PingFang-SC-Regular;
    letter-spacing: 3px;
    color: #ffffff;
}
.content {
    padding-top: 80px;
    text-align: center;
}
.content .text {
    font-size: 34px;
    color: #64686a;
    margin-bottom: 19px;
    letter-spacing: 2px;
}
.content .tips {
    font-size: 18px;
    color: #64686a;
    letter-spacing: 1px;
    margin-bottom: 41px;
}
.content .btn {
    display: block;
    text-decoration: none;
    display: block;
    margin: 0 auto;
    width: 240px;
    height: 46px;
    line-height: 46px;
    border-radius: 4px;
    border: 1px solid #2196f3;
    color: #2196f3;
    font-size: 18px;
    text-align: center;
    display: flex;
    align-items: center;
    padding-left: 18px;
    cursor: pointer;
}
.content .w270 {
    width: 270px;
}
.btn img {
    width: 23px;
    position: relative;
    left: -8880px;
    filter: drop-shadow(#2196f3 8880px 0);
}
.btn span {
    margin-left: 9px;
}
.btn:hover {
    background-color: #2196f3;
    color: #fff;
}
.btn:hover img{
    filter: drop-shadow(#fff 8880px 0);
}
.content .tip {
    margin-top: 10px;
    font-size: 14px;
    color: #999999;
    font-family: PingFang-SC-Medium;
}
.content .content-bj {
    margin: 0 auto;
    margin-top: 40px;
    width: 742px;
    height: 308px;
    background-image: url(./../../assets/img/version/bj.png);
    background-repeat: no-repeat;
}
</style>
