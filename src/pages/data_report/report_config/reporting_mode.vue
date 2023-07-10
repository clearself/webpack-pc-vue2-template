<template>
    <div class="event event-wrapper report-platform" style="box-sizing: border-box;height:100%;">
        <div class="attendance-list content" style="margin-top: 0;height:100%;box-sizing: border-box;overflow-y:auto;padding-bottom:100px;">
            <div class="ub ub-pj w100">
                <div class="list-tips">上报配置</div>
            </div>
            <el-divider></el-divider>
            <div class="mt-2" style="width:100%;margin:0 auto 50px;">
                <el-form :model="timeForm" :rules="rules" ref="timeForm" :inline="true" class="unit set">
                    <div class="ub ub-pj ub-ac" style="width:80%;margin:0 auto;">
                        <div class="ub" style="width:90%;">
                            <el-form-item label="上报方式：" label-width="110px">
                                <el-select :disabled="true" clearable size="small" v-model.trim="timeForm.type" placeholder="请选择">
                                    <el-option v-for="item in types" :key="item.value" :label="item.name" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div v-if="timeForm.type==1&&timeForm.isMultipoint==1">
                            <angleBtn icon="el-icon-plus" title="添 加" @click="addHttps"/>
                        </div>
                    </div>
                    <el-divider></el-divider>
                    <div class="w100" v-if="timeForm.type==0">
                        <el-form-item style="width:48%;" label="外部网络攻击topic：" prop="externalNetworkAttackTopic" :label-width="formLabelWidth">
                            <el-input placeholder="请输入" clearable v-model.trim="timeForm.externalNetworkAttackTopic" size="small"></el-input>
                        </el-form-item>
                        <el-form-item style="width:48%;" label="内部网络攻击topic：" prop="internalNetworkAttackTopic" :label-width="formLabelWidth">
                            <el-input placeholder="请输入" clearable v-model.trim="timeForm.internalNetworkAttackTopic" size="small"></el-input>
                        </el-form-item>
                        <el-form-item style="width:48%;" label="证联网接入区安全告警topic：" prop="networkAccessZoneAlarmTopic" :label-width="formLabelWidth">
                            <el-input placeholder="请输入" clearable v-model.trim="timeForm.networkAccessZoneAlarmTopic" size="small"></el-input>
                        </el-form-item>
                        <el-form-item style="width:48%;" label="异常外连topic：" prop="abnormalExternalConnectionTopic" :label-width="formLabelWidth">
                            <el-input placeholder="请输入" clearable v-model.trim="timeForm.abnormalExternalConnectionTopic" size="small"></el-input>
                        </el-form-item>
                        <el-form-item style="width:48%;" label="DDOS攻击topic：" prop="ddosAttackTopic" :label-width="formLabelWidth">
                            <el-input placeholder="请输入" clearable v-model.trim="timeForm.ddosAttackTopic" size="small"></el-input>
                        </el-form-item>
                        <el-form-item style="width:48%;" label="恶意代码感染topic：" prop="maliciousCodeInfectionTopic" :label-width="formLabelWidth">
                            <el-input placeholder="请输入" clearable v-model.trim="timeForm.maliciousCodeInfectionTopic" size="small"></el-input>
                        </el-form-item>
                        <el-form-item style="width:48%;" label="恶意邮件topic：" prop="maliciousMailTopic" :label-width="formLabelWidth">
                            <el-input placeholder="请输入" clearable v-model.trim="timeForm.maliciousMailTopic" size="small"></el-input>
                        </el-form-item>
                        <el-form-item style="width:48%;" label="仿冒/钓鱼网站topic：" prop="fakePhishingWebsiteTopic" :label-width="formLabelWidth">
                            <el-input placeholder="请输入" clearable v-model.trim="timeForm.fakePhishingWebsiteTopic" size="small"></el-input>
                        </el-form-item>
                        <el-form-item style="width:48%;" label="仿冒APPtopic：" prop="fakeAppTopic" :label-width="formLabelWidth">
                            <el-input placeholder="请输入" clearable v-model.trim="timeForm.fakeAppTopic" size="small"></el-input>
                        </el-form-item>
                        <el-form-item style="width:50%;" label="网站篡改topic：" prop="websiteTamperingTopic" :label-width="formLabelWidth">
                            <el-input placeholder="请输入" clearable v-model.trim="timeForm.websiteTamperingTopic" size="small"></el-input>
                        </el-form-item>
                        <el-form-item style="width:50%;" label="上报统计校验topic：" prop="statisticalVerificationTopic" :label-width="formLabelWidth">
                            <el-input placeholder="请输入" clearable v-model.trim="timeForm.statisticalVerificationTopic" size="small"></el-input>
                        </el-form-item>

                    </div>
                    <div class="ub ub-pc w100">
                        <el-button size="small" type="primary" @click="submitTimeForm('timeForm')">确 定</el-button>
                    </div>
                    <div class="w100" v-if="timeForm.type==1">
                        <div class="ub ub-ac ub-pj http-item" :class="{'noBorder':timeForm.multipointConfigArr.length==1 || index===timeForm.multipointConfigArr.length-1,'noBg':timeForm.isMultipoint==0}" v-for="(item,index) in timeForm.multipointConfigArr" :key="index" style="width:80%;margin: 0 auto;">
                            <div class="ub ub-ver ub-f1">
                                <div style="margin-bottom: 22px;">
                                    <el-form-item style="width:40%;" label="IP白名单：" :label-width="formLabelWidthHttps">
                                        <el-input placeholder="请输入" clearable v-model.trim="item.ip" size="small"></el-input>
                                    </el-form-item>
                                    <el-form-item style="width:40%;" label="上报接口地址：" :label-width="formLabelWidthHttps">
                                        <el-input placeholder="请输入https开头的地址" clearable v-model.trim="item.url" size="small"></el-input>
                                    </el-form-item>
                                    <!--"-->
                                    <div v-if="timeForm.isMultipoint==1" class="check-box" style="display: inline-block;" @click="selectBank(item,index)">
                                        <i class="iconfont" :class="{'icon-selected active':item.type==1,'icon-circle':item.type==0}"></i>
                                        <span :class="{'active':item.type==1}">人行接口</span>
                                    </div>
                                    <!--<el-checkbox @change="selectBank(item)" style="margin-top: 7px;color:#fff;" :checked="item.checked" v-model="item.checked">是否上报人行</el-checkbox>-->
                                </div>
                                <div>
                                    <el-form-item style="width:40%;" label="用户名：" :label-width="formLabelWidthHttps">
                                        <el-input placeholder="请输入" clearable v-model.trim="item.username" size="small"></el-input>
                                    </el-form-item>
                                    <el-form-item style="width:40%;" label="密码：" :label-width="formLabelWidthHttps">
                                        <el-input type="password" placeholder="请输入" clearable show-password v-model.trim="item.password" size="small" autocomplete="off"></el-input>
                                    </el-form-item>
                                </div>

                            </div>

                            <div v-if="timeForm.isMultipoint==1" class="del-btn" @click='removeHttp(index)'>
                                <el-button size="small" type="danger" icon="el-icon-delete" circle></el-button>
                            </div>
                        </div>
                    </div>
                </el-form>

            </div>

        </div>
    </div>
</template>

<script>
import {
    get_report_set,
    add_report_set
} from '@/server/reporting_platform/setting.js'
export default {
    name: 'ReportSet',
    data() {
        var reg = /^[1-9]\d*$/
        var isNumber = (rule, value, callback) => {
            if (!reg.test(value)) {
                return callback(new Error('请输入大于0整数'))
            } else {
                callback()
            }
        }
        return {
            checked: false,
            types: [{
                name: 'Kafka',
                value: 0
            },
            {
                name: 'HTTPS',
                value: 1
            }
            ],
            tabIndex: 0,
            activeName: 'first',
            timeForm: {
                ddosAttackTopic: '', // ddos攻击数据
                networkAccessZoneAlarmTopic: '', // 证联网介入区安全告警
                fakeAppTopic: '', // 仿冒app
                externalNetworkAttackTopic: '', // 外部网络攻击
                websiteTamperingTopic: '', // 网站篡改
                internalNetworkAttackTopic: '', // 内部网络攻击
                maliciousCodeInfectionTopic: '', // 恶意代码感染数据
                fakePhishingWebsiteTopic: '', // 钓鱼网站数据
                maliciousMailTopic: '', // 恶意邮件
                abnormalExternalConnectionTopic: '', // 异常外连数据
                statisticalVerificationTopic: '',

                type: 0,
                isMultipoint: '0',
                multipointConfigArr: []
            },
            rules: {

            },
            formLabelWidthHttps: '110px',
            formLabelWidth: '50%'
        }
    },

    mounted() {
        this.$nextTick(() => {
            this.get_sets()
        })
    },
    methods: {
        selectBank(item, index) {
            if (item.type == 1) {
                item.type = 0
            } else {
                this.timeForm.multipointConfigArr = this.timeForm.multipointConfigArr.map(_item => {
                    _item.type = 0
                    return _item
                })
                item.type = 1
            }
        },
        removeHttp(index) {
            this.timeForm.multipointConfigArr.splice(index, 1)
        },
        addHttps() {
            this.timeForm.multipointConfigArr.push({
                ip: '',
                url: '',
                username: '',
                password: '',
                type: 0
            })
        },
        handleClick(val) {
            console.log(val)
            this.tabIndex = val.index
        },
        get_sets() {
            let data = {}
            get_report_set(data).then(res => {
                console.log('1111', res)
                if (res.multipointConfigArr == null) {
                    res.multipointConfigArr = []
                    res.multipointConfigArr.push({
                        ip: '',
                        url: '',
                        type: 0,
                        username: '',
                        password: ''
                    })
                }
                this.timeForm = res
            }).catch(error => {
                console.log(error + 'error')
            })
        },
        submitTimeForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.addTimeFun()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        addTimeFun() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            if (this.timeForm.type == 0) {
                data.paramsData = {
                    type: this.timeForm.type,
                    ddosAttackTopic: this.timeForm.ddosAttackTopic, // ddos攻击数据
                    networkAccessZoneAlarmTopic: this.timeForm.networkAccessZoneAlarmTopic, // 证联网介入区安全告警
                    fakeAppTopic: this.timeForm.fakeAppTopic, // 仿冒app
                    externalNetworkAttackTopic: this.timeForm.externalNetworkAttackTopic, // 外部网络攻击
                    websiteTamperingTopic: this.timeForm.websiteTamperingTopic, // 网站篡改
                    internalNetworkAttackTopic: this.timeForm.internalNetworkAttackTopic, // 内部网络攻击
                    maliciousCodeInfectionTopic: this.timeForm.maliciousCodeInfectionTopic, // 恶意代码感染数据
                    fakePhishingWebsiteTopic: this.timeForm.fakePhishingWebsiteTopic, // 钓鱼网站数据
                    maliciousMailTopic: this.timeForm.maliciousMailTopic, // 恶意邮件
                    abnormalExternalConnectionTopic: this.timeForm.abnormalExternalConnectionTopic, // 异常外连数据
                    statisticalVerificationTopic: this.timeForm.statisticalVerificationTopic
                    // networkAttackTopic: this.timeForm.networkAttackTopic,
                    // ddosAttackTopic: this.timeForm.ddosAttackTopic,
                    // viralInfectionTopic: this.timeForm.viralInfectionTopic,
                    // maliciousMailTopic: this.timeForm.maliciousMailTopic,
                    // viralInfectionNumTopic: this.timeForm.viralInfectionNumTopic,
                    // antiWasteMailTopic: this.timeForm.antiWasteMailTopic,
                    // siteAppTopic: this.timeForm.siteAppTopic
                }
            } else if (this.timeForm.type == 1) {
                if (this.timeForm.isMultipoint == 0) {
                    this.timeForm.multipointConfigArr[0].type = 1
                } else {
                    if (this.timeForm.multipointConfigArr.length <= 0) {
                        this.$message({
                            message: '请先添加上报配置！',
                            type: 'warning'
                        })
                        return
                    }
                    if (!this.timeForm.multipointConfigArr.some(item => item.type == 1)) {
                        this.$message({
                            message: '必须要选一个上报人行！',
                            type: 'warning'
                        })
                        return
                    }
                }

                data.paramsData = {
                    type: this.timeForm.type,
                    multipointConfigArr: this.timeForm.multipointConfigArr
                }
            }
            if (this.timeForm.id) {
                data.paramsData.id = this.timeForm.id
            }
            add_report_set(data).then(res => {
                this.$message({
                    message: '保存成功',
                    type: 'success'
                })
            }).catch(error => {
                console.log(error + 'error')
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .event {
        width: 100%;
        height: 100%;
    }

    .time_set_box {
        width: 300px;
        height: 200px;
        background: #fff;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }

    .region {
        width: 100%;
        position: absolute;
        left: 0;
        top: 20%;
        bottom: 0;
        right: 0;
        overflow: auto;
    }

    .reject-wrapper {
        height: 100%;
        padding: 50px 0 20px 50px;
        box-sizing: border-box;
        position: relative;
    }

    .reject-box {
        width: auto;
        position: relative;
    }

    .col {
        position: absolute;
        top: -22px;
        left: 0px;
        right: 0;
        height: 20px;
        font-size: 0;
        z-index: 99;
    }

    .col>div {
        width: 22px;
        height: 22px;
        display: inline-block;
        text-align: center;
        line-height: 10px;
        font-size: 10px;
        margin-left: -1px;
        margin-top: -1px;
        color: #007aff;
    }

    .row {
        position: absolute;
        top: 0px;
        left: -22px;
        bottom: 0;
        width: 20px;
        font-size: 0;
        z-index: 99;
    }

    .row>div {
        width: 22px;
        height: 22px;
        line-height: 22px;
        font-size: 10px;
        margin-left: -1px;
        margin-top: -1px;
        color: #007aff;
    }

    .event>>>.el-range-input {
        background-color: rgba(0, 0, 0, 0);
        color: #fff;
    }

    .no-data {
        width: 200px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }

    .top-bg {
        width: 80%;
        margin: 20px auto 0px;
        height: 60px;
        /*background-image:url(../assets/img/Large_screen.png);*/
        background-position: center;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        z-index: 999;
    }

    .seat-team {
        width: 100%;
        margin: 50px 0;
        overflow: hidden;
    }

    .seat-team>div {
        margin: 10px;
        font-size: 0;
        float: left;
    }

    .seat-team>div i {
        display: inline-block;
        width: 20px;
        height: 12px;
        vertical-align: middle;
    }

    .seat-team>div span {
        margin-left: 5px;
        display: inline-block;
        vertical-align: middle;
        font-size: 12px;
        color: #fff;
    }

    .content {
        /* background: url("../../assets/img/content_bg.png") center bottom no-repeat;
        background-color: rgba(17, 29, 43, .8);
        background-size: contain;
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
        bottom: 0;
    }

    .content>>>.el-tabs__item {
        color: #c3c4c4;
        font-size: 15px;
    }

    .content>>>.el-tabs__item.is-active {
        color: #00e9ff;
    }
    .content>>>.el-tabs__active-bar {
        background-color: #00e9ff;
    }

    .el-divider {
        background-color: rgba(195, 196, 196, .5);
    }
    .del-btn {
        width:50px;
        font-size:14px;
        color:#fff;
    }
    .http-item{
        background-color: rgba(0,192,255,.1);
        padding:20px;
        border-bottom: 1px solid rgba(195,196,196,0.5);
    }
    .http-item.noBorder{
        border:none;
    }
    .http-item.noBg{
        background-color: rgba(0,192,255,0);
    }
    .http-item .el-form-item{
        margin-bottom: 0;
    }
    .check-box{
        font-size:0;
        cursor: pointer;
    }
    .check-box span,.check-box i{
        vertical-align: middle;

    }
    .check-box i{
        color:rgba(195, 196, 196, 1);
        margin-right: 10px;
        margin-top: 3px;
        font-size:16px;
    }
    .check-box span{
        color:#fff;
        font-size:12px;
    }
    .check-box .active{
        color:#409EFF;
    }
</style>
