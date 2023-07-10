<template>
    <div class="wrapper">
        <div class="container" :class="{ screen1680: window.screen.width < 1680 }">
            <div class="content">
                <div class="center-top">
                    <p class="top-title">ASAP</p>
                    <p class="top-title2">— 威胁情报查询 —</p>
                </div>
                <el-tabs v-model="activeName">
                    <el-tab-pane label="查 询" name="first">
                        <div class="search">
                            <el-form ref="form" label-width="80px">
                                <el-input
                                    maxlength="80"
                                    v-model.trim="input"
                                    placeholder="请输入要查找的ip、域名、邮箱、文件、证书指纹或者其他字符串"
                                    class="input-with-select"
                                    style="width: 506px;height: 40px;line-height: 40px"
                                    size="small"
                                ></el-input>
                            </el-form>
                            <el-button v-loading="btnLoading" class="search-btn" type="primary" @click="searchAssets">搜 索</el-button>
                        </div>
                        <div class="history" style="margin-bottom: 10px">
                            <div class="h-left" style="font-size: 12px;">历史记录</div>
                            <div class="h-right">
                                <span :class="{ disBtn: this.page === 1 }" @click="prePage">
                                    <i style="font-size: 12px;" class="iconfont icon-zuo1"></i>
                                </span>
                                <span :class="{ disBtn: this.page * this.size >= detailData.length }" style="margin-left: 20px;display: inline-block;transform: rotate(180deg);" @click="nextPage"><i style="font-size: 12px;" class="iconfont icon-zuo1"></i></span>
                            </div>
                        </div>
                        <div class="detail-box">
                            <div class="detail-list" :key="index" v-for="(item, index) in detailData.slice((this.page - 1) * this.size, this.page * this.size)">
                                <div class="left-list line-1" style="width:500px">
                                    <i class="iconfont icon-sousuo" style="font-size: 16px;color: #0052d9"></i>
                                    <el-divider direction="vertical"></el-divider>
                                    <span class="ip-text">{{ item.value }}</span>
                                </div>
                                <div class="right-list" ref="detail" :data-ip="item.ip" :data-type="item.type" @click="goDetail(item)" style="cursor: pointer;margin-right: 20px">
                                    详 情
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="文 件" name="second">
                        <el-upload
                            class="upload-demo"
                            drag
                            :headers="header"
                            :on-success="loadSuccess"
                            :on-progress="loadProgressFile"
                            :before-upload="beforeUpload"
                            name="file"
                            :disabled="uploadBtnLoading"
                            :on-error="loadError"
                            :show-file-list="false"
                            action="api/intelligence/manage/intelligenceQuery/fileUploadUrl"
                        >
                            <i class="el-icon-upload" style="color: #387dee;margin-top: 70px;"></i>
                            <div class="el-upload__text" style="margin-top: -10px;margin-bottom:10px;color: #266fe8;">点击或将文件拖拽到这里上传</div>
                            <div class="el-upload__text" style="font-size: 12px;color: rgba(0, 0, 0, 0.6)">
                                支持的文件类型包括：PE 可执行文件(EXE、DLL、COM 等)，Office 文档(DOC、XLS、PPT 等)，PDF，HTML，Script，MSI，SWF，JAR，LNK
                                ，ELF，各种压缩包(ZIP、RAR、7Z 等)
                            </div>
                            <div class="el-upload__text" v-if="uploadBtnLoading" style="font-size:12px">文件上传中... {{ precent.toFixed(2) }}%</div>
                        </el-upload>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
</template>

<script>
import { get_threat_log, get_threat_search } from '@/server/intelligence/api.js'
export default {
    name: 'ThreatDatabase',
    data() {
        return {
            window: window,
            input: '',
            type: '1',
            size: 6,
            page: 1,
            limit: 1,
            detailData: [],
            activeName: 'first',
            uploadBtnLoading: false,
            precent: 0,
            btnLoading: false
        }
    },
    computed: {
        header() {
            return { token: this.$getlocalStorage('initInfo').user.token }
        }
    },
    created() {},
    mounted() {
        this.getLog()
    },
    methods: {
        searchAssets() {
            if (this.input === '') {
                this.$message({
                    message: '请输入查询条件',
                    type: 'warning'
                })
                return
            }
            const ipRules = /^((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9]))$/
            // let res = ipRules.test(this.input.trim())
            let res = true // 不校验输入框了
            let obj = {
                value: this.input
            }
            this.btnLoading = true
            get_threat_search({ queryData: obj, paramsData: {}})
                .then(res => {
                    this.btnLoading = false
                    console.log(res)
                    this.$setsessionStorage('search-item', res)
                    this.$router.push({
                        name: 'threat_detail',
                        query: {
                            searchStr: this.input
                        }
                    })
                })
                .catch(err => {
                    this.btnLoading = false
                    console.log(err + 'err')
                })
        },
        getLog() {
            get_threat_log({ queryData: {}, paramsData: {}}).then(res => {
                console.log('记录', res)
                this.detailData = res.records
            })
        },
        loadProgressFile(event, file, fileList) {
            this.uploadBtnLoading = true
            this.precent = event.percent
        },
        goDetail(item) {
            let that = this
            this.$setsessionStorage('log-item', item)
            that.$router.push({
                name: 'threat_detail'
            })
        },
        prePage() {
            if (this.page > 1) {
                this.page -= 1
            }
        },
        nextPage() {
            if (this.page * this.size < this.detailData.length) {
                this.page += 1
                console.log(this.page)
            }
        },
        loadSuccess(response) {
            console.log('response', response)
            this.uploadBtnLoading = false
            if (response.code == 1) {
                this.$message({
                    message: '文件上传成功!',
                    type: 'success'
                })
                setTimeout(() => {
                    this.$setsessionStorage('file-item', response.data)
                    this.$router.push({
                        name: 'threat_detail',
                        query: {
                            file: 2
                        }
                    })
                }, 1000)
            } else {
                this.$message({
                    message: response.message,
                    type: 'warning'
                })
            }
        },
        beforeUpload(file) {
            // const allowTypes = ['zip', 'docx', 'pdf', 'doc', 'jpg', 'jpeg', 'png', 'rar']
            // console.log(file)
            // let arr = file.name.split('.')
            // if (!allowTypes.includes(arr[arr.length - 1])) {
            //     this.$message.warning('请上传正确格式文件')
            //     return false
            // }
            if (file.size > 100 * 1024 * 1024) {
                this.$message.warning('请上传小于100M文件')
                return false
            }
        },
        loadError(err) {
            console.log(err)
        }
    }
}
</script>

<style scoped lang="scss">
.wrapper {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
}

.container {
    padding: 12px 20px 10px 20px;
    border: 1px solid #4faffd;
    box-sizing: border-box;
    box-shadow: 0px 0px 14px #00b4ff inset;
    background: url('../../assets/img/intelligence/threat_bg.png') center bottom no-repeat;
    background-color: rgba(17, 29, 43, 0.8);
    background-size: 82%;
    background-position: 60% 70%;
    min-height: 100%;
    font-family: '微软雅黑', 'digital-7', '宋体', 'Helvetica';
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ffffff;
    box-shadow: 0px 0px 8px 0px rgba(140, 152, 164, 0.2);
    border-radius: 4px;
    border: solid 1px #dadee8;
    & .title {
        height: 24px;
        line-height: 24px;
        font-size: 14px;
        color: #000000;
        padding-left: 14px;
        font-weight: 500;
        position: relative;
        /*border-left: 4px solid #00e9ff;*/
        margin: 4px 0 24px;
        color: #fff;
    }
}
@media screen and (max-width: 1440px){
    .container {
        background-size: contain;
        background-position: 20% 37%;
    }
}
@media screen and (max-width: 1366px){
    .container {
        background-size: contain;
        background-position: 60% 0%;
    }
}
.screen1680 {
    min-height: 120% !important;
}

.title:before {
    width: 4px;
    height: 24px;
    content: ' ';
    position: absolute;
    left: 0px;
    top: 0px;
    border-radius: 3px;
    background: #00e9ff;
}

.content {
    width: 600px;
    min-height: 200px;
}

.screen1680 .content {
    top: 84px;
}

.center-top {
    margin-bottom: 20px;
}

.top-title {
    font-family: '宋体';
    text-align: center;
    font-size: 50px;
    letter-spacing: 10px;
    color: #387dee;
    font-weight: 600;
}
.top-title2 {
    text-align: center;
    font-size: 36px;
    letter-spacing: 11px;
    color: #387dee;
}

.search {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
}

.search ::v-deep .el-input--small .el-input__inner {
    height: 40px;
}

.search ::v-deep .btn {
    width: 100px !important;
    height: 40px !important;
}

.history {
    display: flex;
    justify-content: space-between;
    color: #0052d9;
    font-size: 14px;
    .h-right {
        & span {
            cursor: pointer;
        }
    }
}

.detail-list {
    display: flex;
    justify-content: space-between;
    color: rgba(0, 0, 0, 0.9);
    margin-bottom: 10px;
    line-height: 32px;
    box-sizing: border-box;
    height: 32px;
    background-color: #ffffff;
    border-radius: 2px;
    border: solid 1px #dcdcdc;
}

.left-list {
    padding-left: 12px;
    display: flex;
    .ip-text {
        color: rgba(0, 0, 0, .9);
        font-size: 14px;
    }
}

.right-list {
    font-size: 12px;
    color: #0052d9;
}

.left-list ::v-deep .el-divider {
    background-color: #dcdcdc;
    font-size: 14px;
    height: 100%;
}

.disBtn {
    cursor: not-allowed !important;
    color: rgba(0, 0, 0, 0.4);
    font-size: 12px;
}
.el-tabs ::v-deep .el-tabs__header {
    margin: 0 0 10px;
}
.el-tabs ::v-deep .el-tabs__item.is-active {
    color: #387dee;
    opacity: 1;
    height: 34px;
    line-height: 34px;
    border: none !important;
    box-shadow: none !important;
}

.el-tabs ::v-deep .el-tabs__nav-wrap::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 0px;
    background-color: rgba(28, 215, 250, 0.2);
    z-index: 1;
}

.el-tabs ::v-deep .el-tabs__active-bar {
    background: #387dee;
    height: 1px;
    width: 60px !important;
    //margin-left: 14px;
}

.el-tabs ::v-deep .el-tabs__item {
    color: rgba(0, 0, 0, 0.6);
    font-size: 16px;
    padding: 0;
    width: 60px;
    text-align: center;
}
.el-tabs ::v-deep .el-upload-dragger {
    width: 100%;
    border: 1px dashed #dcdcdc;
    background: #fff;
    height: 280px;
    margin-bottom: 66px;
}
.el-tabs ::v-deep .el-upload-list__item:hover {
    background-color: transparent;
}
.search-btn {
    background-color: #0052d9;
    border: none;
}

.event ::v-deep .el-upload-dragger .el-upload__text {
    color: #fff;
    font-size: 16px;
}
.event ::v-deep .el-upload-dragger .el-upload__tip {
    color: #3f4f57;
    opacity: 0.4;
    font-size: 12px;
}
</style>
