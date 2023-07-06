<template>
    <div class="security-policy">
        <div class="content event-wrapper">
            <el-form :model="addform" ref="addform" :rules="rules" label-position="left" :inline="true">
                <div class="list-tips">账号管理规则填写</div>
                <div class="label-text">登录密码策略:<span class="annotation"><span class="iconfont icon-zhushi"></span>默认密码规则：最少8位字符，且必须包含数字、大写字母、小写字母及特殊字符</span></div>

                <div class="ub ub-ac mb-3" style="flex-wrap: wrap;">
                    <el-radio-group v-model="addform.pwDefault" class="pw-default" @change="pwDefaultChange">
                        <el-radio :label="1">默认</el-radio>
                        <el-radio :label="2">自定义</el-radio>
                    </el-radio-group>
                    <el-form-item label="" prop="pwCustom" v-if="addform.pwDefault===2">
                        <el-checkbox-group v-model="addform.pwCustom"  @change="pwCustomChange" style="width: 596px">
                            <el-checkbox v-for="item in pwCustomData" :label="item.value" :key="item.label">{{item.label}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="最小字符限制" prop="pwLimit" v-if="addform.pwDefault===2">
                        <el-input-number  size="small" v-model="addform.pwLimit" :controls="false"  :min="8" :max="32" style="width:60px;margin-right:8px"></el-input-number>
                    </el-form-item>
                    <div v-if="addform.pwDefault===2" class="text-len"  style="width:56px">以内</div>
                    <div v-if="addform.pwDefault===2" class="text-len" style="width:76px;margin-right:8px">密码安全强度:</div>
                    <Password v-if="addform.pwDefault===2" :strength="pwStrength" />
                </div>
                <div class="label-text">双因子认证:<span class="annotation"><span class="iconfont icon-zhushi"></span>开启后，登录系统时需完成密码和动态验证码的双重验证</span></div>
                <div class="ub ub-ac mb-3">
                    <KSwitch :value="addform.doubleVerification" class="kswitch" :handle="handleSwitch" @changeSwitch="dbSwitchChange" />
                    <el-form-item label="" prop="verificationMode" v-if="addform.doubleVerification">
                        <el-radio-group v-model="addform.verificationMode" style="width: 268px">
                            <el-radio :label="2">手机验证码登录</el-radio>
                            <el-radio :label="1">邮箱验证码登录</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </div>
                <div class="label-text">登录图形验证码:<span class="annotation"><span class="iconfont icon-zhushi"></span>开启后，登录系统时需完成图形验证码的验证</span></div>
                <div class="mb-3">
                    <KSwitch :value="addform.graphicVerification" class="kswitch" :handle="handleSwitch" @changeSwitch="graphSwitchChane" />
                </div>
                <div class="label-text">账号锁定:<span class="annotation"><span class="iconfont icon-zhushi"></span>开启后，当用户连续输入账号密码错误，且全部尝试登录次数用尽时，账号将被锁定</span></div>
                <div class="ub ub-ac mb-3">
                    <KSwitch :value="addform.userLock" class="kswitch" :handle="handleSwitch" @changeSwitch="lockSwitchChange" />
                    <div class="ub ub-ac" v-if="addform.userLock">
                        <el-form-item label="时间区间:" prop="timeout">
                            <el-input-number class="input-left" size="small" v-model="addform.timeout" :controls="false"   style="width:60px;" placeholder=""></el-input-number>
                        </el-form-item>
                        <el-select class="input-right" v-model="addform.timeoutUnit" placeholder="请选择" size="small" style="width:60px;margin-right: 50px">
                            <el-option
                                v-for="item in timeData"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                        <el-form-item label="尝试登录次数:" prop="failCount" style="margin-right:50px">
                            <el-input-number  size="small" v-model="addform.failCount" :controls="false"   style="width:60px;" placeholder=""></el-input-number>
                            <span style="margin-left: 8px">次</span>
                        </el-form-item>
                        <el-form-item label="锁定时间:" prop="lockTime">
                            <el-input-number class="input-left" size="small" v-model="addform.lockTime" :controls="false"   style="width:60px;" placeholder=""></el-input-number>
                        </el-form-item>
                        <el-select v-model="addform.lockTimeUnit" placeholder="请选择" size="small" style="width:60px;" class="input-right">
                            <el-option
                                v-for="item in lockTimeData"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="label-text">是否开启密码定时更新:</div>
                <div class="ub ub-ac mb-3">
                    <KSwitch :value="addform.pwTimeUpdate" class="kswitch" :handle="handleSwitch" @changeSwitch="timeSwitchChange" />
                    <div class="ub ub-ac" v-if="addform.pwTimeUpdate">
                        <el-form-item label="更新周期:" prop="pwTime">
                            <span style="margin-right:6px">每</span>
                            <el-input-number class="input-left"  size="small" v-model="addform.pwTime" :controls="false"   style="width:60px;" placeholder=""></el-input-number>
                        </el-form-item>
                        <el-select v-model="addform.pwTimeUnit" placeholder="请选择" size="small" style="width:66px;" class="input-right">
                            <el-option
                                v-for="item in pwTimeData"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="label-text">允许多终端登录:</div>
                <div class="mb-3">
                    <KSwitch :value="addform.pwTerminal" class="kswitch" :handle="handleSwitch" @changeSwitch="moreSwitchChange" />
                </div>
                <div class="label-text">管理员联系方式:</div>
                <el-form-item label="" prop="adminPhone"  label-position="top">
                    <el-input v-model="addform.adminPhone" placeholder="请输入" size="small" style="width:300px;"></el-input>
                </el-form-item>
            </el-form>
            <div class="ub ub-pc">
                <el-button style="width: 120px" v-per="['base_safe_save']" type="primary" size="small" @click="submitForm('addform')">保 存</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import Password from './password.vue'
import { get_user_system_config, update_safety } from '@/server/system/security_policy.js'
export default {
    data() {
        return {
            rules: {
                pwCustom: [
                    {
                        required: true,
                        message: '请选择',
                        trigger: 'change'
                    }
                ],
                pwLimit: [
                    {
                        required: true,
                        message: '请输入',
                        trigger: 'blur'
                    }
                ],
                doubleVerification: [
                    {
                        required: true,
                        message: '请选择',
                        trigger: 'change'
                    }
                ],
                verificationMode: [
                    {
                        required: true,
                        message: '请选择',
                        trigger: 'change'
                    }
                ],
                timeout: [
                    {
                        required: true,
                        message: '请输入',
                        trigger: 'blur'
                    }
                ],
                failCount: [
                    {
                        required: true,
                        message: '请输入',
                        trigger: 'blur'
                    }
                ],
                lockTime: [
                    {
                        required: true,
                        message: '请输入',
                        trigger: 'blur'
                    }
                ],
                pwTime: [
                    {
                        required: true,
                        message: '请输入',
                        trigger: 'blur'
                    }
                ],
                adminPhone: [
                    {
                        required: true,
                        message: '请输入',
                        trigger: 'blur'
                    }
                ]

            },
            timeData: [
                {
                    value: 1,
                    label: '分钟'
                },
                {
                    value: 2,
                    label: '小时'
                },
                {
                    value: 3,
                    label: '天'
                }
            ],
            pwTimeData: [
                {
                    value: 1,
                    label: '天/次'
                },
                {
                    value: 2,
                    label: '月/次'
                },
                {
                    value: 3,
                    label: '年/次'
                }
            ],
            lockTimeData: [
                {
                    value: 1,
                    label: '分钟'
                },
                {
                    value: 2,
                    label: '小时'
                },
                {
                    value: 3,
                    label: '天'
                },
                {
                    value: 4,
                    label: '月'
                }
            ],
            pwStrength: '',
            handleSwitch: true,
            addform: {
                id: '',
                verificationMode: '',
                pwDefault: '',
                pwCustom: [],
                pwLimit: '',
                doubleVerification: false,
                graphicVerification: false,
                userLock: false,
                pwTimeUpdate: false,
                pwTerminal: false,
                timeout: '',
                timeoutUnit: 1,
                failCount: '',
                lockTime: '',
                lockTimeUnit: 4,
                pwTimeUnit: 1,
                adminPhone: ''
            },
            pwCustomData: [
                {
                    label: '必须包含数字',
                    value: 1
                },
                {
                    label: '必须包含大写字母',
                    value: 2
                },
                {
                    label: '必须包含小写字母',
                    value: 3
                },
                {
                    label: '必须包含特殊字符',
                    value: 4
                }
            ]
        }
    },
    components: {
        Password
    },
    mounted() {
        this.initData()
    },
    methods: {
        initData() {
            let data = {
                queryData: {},
                paramsData: {
                    // userName: 'admin'
                }
            }
            get_user_system_config(data).then(res => {
                this.addform = res
                if (res.pwCustom) {
                    let pwCustomData = res.pwCustom.split(',')
                    this.addform.pwCustom = pwCustomData.map(i => parseInt(i, 0))
                } else {
                    this.addform.pwCustom = []
                }

                this.pwCustomChange(this.addform.pwCustom)

                res.doubleVerification && res.doubleVerification === 1 ? this.addform.doubleVerification = true : this.addform.doubleVerification = false

                res.graphicVerification && res.graphicVerification === 1 ? this.addform.graphicVerification = true : this.addform.graphicVerification = false

                res.userLock && res.userLock === 1 ? this.addform.userLock = true : this.addform.userLock = false

                res.pwTimeUpdate && res.pwTimeUpdate === 1 ? this.addform.pwTimeUpdate = true : this.addform.pwTimeUpdate = false

                res.pwTerminal && res.pwTerminal === 1 ? this.addform.pwTerminal = true : this.addform.pwTerminal = false
            }).catch(error => {
                console.log('error' + error)
            })
        },
        pwCustomChange(val) {
            if (val.length <= 2 && val.length > 0) {
                this.pwStrength = 1
            } else if (val.length == 3) {
                this.pwStrength = 2
            } else if (val.length == 4) {
                this.pwStrength = 3
            } else if (val.length == 0) {
                this.pwStrength = 0
            }
        },
        pwDefaultChange(val) {
            // if (val === 1) {
            //     this.addform.pwLimit = 8
            //     this.addform.pwCustom = []
            //     this.pwStrength = 0
            // }
        },
        moreSwitchChange(checked, id, index) {
            this.addform.pwTerminal = checked
        },
        timeSwitchChange(checked, id, index) {
            this.addform.pwTimeUpdate = checked
            // if (checked === false) {
            //     this.addform.pwTime = ''
            // }
        },
        lockSwitchChange(checked, id, index) {
            this.addform.userLock = checked
            // if (checked === false) {
            //     this.addform.timeout = ''
            //     this.addform.failCount = ''
            //     this.addform.lockTime = ''
            // }
        },
        graphSwitchChane(checked, id, index) {
            this.addform.graphicVerification = checked
        },
        dbSwitchChange(checked) {
            this.addform.doubleVerification = checked
            // if (checked === false) {
            //     this.addform.verificationMode = ''
            // }
        },
        submitForm(formName) {
            if (this.addform.pwDefault === 1) {
                this.addform.pwLimit = 8
                this.addform.pwCustom = []
                this.pwStrength = 0
            }
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = {
                        queryData: {},
                        paramsData: {
                            id: this.addform.id,
                            pwDefault: this.addform.pwDefault,
                            pwCustomList: this.addform.pwCustom,
                            pwLimit: this.addform.pwLimit,
                            doubleVerification: this.addform.doubleVerification === true ? 1 : 2,
                            verificationMode: this.addform.verificationMode,
                            graphicVerification: this.addform.graphicVerification === true ? 1 : 2,
                            userLock: this.addform.userLock === true ? 1 : 2,
                            timeout: this.addform.timeout,
                            timeoutUnit: this.addform.timeoutUnit,
                            failCount: this.addform.failCount,
                            lockTime: this.addform.lockTime,
                            lockTimeUnit: this.addform.lockTimeUnit,
                            pwTimeUpdate: this.addform.pwTimeUpdate === true ? 1 : 2,
                            pwTime: this.addform.pwTime,
                            pwTimeUnit: this.addform.pwTimeUnit,
                            pwTerminal: this.addform.pwTerminal === true ? 1 : 2,
                            adminPhone: this.addform.adminPhone
                        }
                    }
                    update_safety(data).then(res => {
                        this.$message({
                            message: '设置成功',
                            type: 'success'
                        })
                    }).catch(error => {
                        this.themeDialog = false
                        console.log(error + 'error')
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        }
    }

}
</script>

<style scoped lang="scss">
.security-policy {
    .event-wrapper {
        height: calc(100vh - 90px);
    }
    .content {
        padding: 20px 24px 24px 24px;
        .list-tips {
            margin-bottom: 36px;
        }
        .label-text {
            color: rgba(0, 0, 0, 0.9);
            margin-bottom: 14px;
            font-size: 12px;
            .annotation {
                color: rgba(0, 0, 0, 0.26);
                margin-left: 10px;
                font-size: 12px;
            }
        }
        .pw-default {
            width: 180px;
            // margin-right: 34px;
        }
        .text-len {
            height: 20px;
            line-height: 20px;
            font-size: 12px;
            color: rgba(0, 0, 0, 0.9);
        }
        .label-width {
            width: 140px;
        }
        .kswitch {
            margin-right: 24px;
        }
    }
    ::v-deep .el-radio__label {
        font-size: 12px;
        color: rgba(0, 0, 0, 0.9);
    }
    ::v-deep .el-checkbox__label {
        font-size: 12px;
        color: rgba(0, 0, 0, 0.9);
    }
    ::v-deep .el-form-item {
         margin-bottom: 0px;
    }
    ::v-deep .el-form-item__content {
        line-height: 20px;
        font-size: 12px;
    }
    ::v-deep .el-form-item__label {
        // text-align: right;
        // vertical-align: middle;
        // float: left;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.9);
        line-height: 20px;
        margin-top: 4px;
        // padding: 0 12px 0 0;
        // -webkit-box-sizing: border-box;
        // box-sizing: border-box;
    }
    ::v-deep .el-form--inline .el-form-item {
        margin-right: 0px;
    }
    ::v-deep .el-input__inner {
        padding: 0 8px;
        font-size: 12px;
    }
    ::v-deep .el-checkbox__label {
        line-height: 32px;
    }
}
.custom-star {
    .security-policy {
        .event-wrapper {
            height: calc(100vh - 90px);
        }
        .content {
            background-color: #021c31;
            box-shadow: inset 0px 0px 18px 0px rgba(0, 180, 255, 0.5);
            border: 1px solid #50b0ff;
            padding: 20px 24px 24px 24px;
            .list-tips {
                margin-bottom: 36px;
                color: #fff;
            }
            .label-text {
                color: #fff;
                margin-bottom: 14px;
                font-size: 12px;
                .annotation {
                    color: rgba(255, 255, 255, .7);
                    margin-left: 10px;
                    font-size: 12px;
                }
            }
            .pw-default {
                width: 180px;
                // margin-right: 34px;
            }
            .text-len {
                height: 20px;
                line-height: 20px;
                font-size: 12px;
                color: rgba(255, 255, 255, .7);
            }
            .label-width {
                width: 140px;
            }
            .kswitch {
                margin-right: 24px;
            }
        }
        ::v-deep .el-radio__label {
            font-size: 12px;
            color: #fff;
        }
        ::v-deep .el-checkbox__label {
            font-size: 12px;
            color: rgba(0, 0, 0, 0.9);
        }
        ::v-deep .el-form-item {
            margin-bottom: 0px;
        }
        ::v-deep .el-form-item__content {
            line-height: 20px;
            font-size: 12px;
        }
        ::v-deep .el-form-item__label {
            // text-align: right;
            // vertical-align: middle;
            // float: left;
            font-size: 12px;
            color: rgba(0, 0, 0, 0.9);
            line-height: 20px;
            margin-top: 4px;
            // padding: 0 12px 0 0;
            // -webkit-box-sizing: border-box;
            // box-sizing: border-box;
        }
        ::v-deep .el-form--inline .el-form-item {
            margin-right: 0px;
        }
        ::v-deep .el-input__inner {
            padding: 0 8px;
            font-size: 12px;
        }
        ::v-deep .el-checkbox__label {
            line-height: 32px;
        }
    }
}

</style>
