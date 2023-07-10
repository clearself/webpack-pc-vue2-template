<template>
    <div class="event add_template">
        <div class="event-wrapper event-content w100">
            <div class="ub w100 relative mb-2">
                <div class="list-tips">kafka、es配置页面</div>
                <div class="btn-wrap" style="margin-left: auto;">
                    <!-- <cancel-btn title="取 消" style="margin-right: 8px" @click="cancel"></cancel-btn> -->
                    <el-button size="small" type="primary" @click="submit">提 交</el-button>
                </div>
            </div>
            <div class="w100 form-wrapper" style="color: #fff;">
                <el-form  ref="formData" :model="formData" :rules="formDataRules" label-width="100px" label-position="top">
                    <div class="title w100">
                        <span class="t1">Kafka配置</span>
                    </div>
                    <div class="ub ub-pj" style="width:100%;">
                        <el-form-item label="Kafka地址:" style="width: 30%" prop="kafkaAddress" size="small">
                            <el-input clearable v-model.trim="formData.kafkaAddress" size="small" placeholder="请填写Kafka地址"></el-input>
                        </el-form-item>
                        <el-form-item label="端口：" style="width: 30%;" prop="port" size="small">
                            <el-input clearable v-model.trim="formData.port" size="small" placeholder="请填写端口" type="number" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
                        </el-form-item>
                        <el-form-item label="topic:" style="width: 30%" prop="topic" size="small">
                            <el-input clearable v-model.trim="formData.topic" size="small" placeholder="请填写topic"></el-input>
                        </el-form-item>
                    </div>
                    <div class="ub ub-pj" style="width:100%;">
                        <el-form-item label="分区" style="width: 30%;" prop="subregion" size="small">
                            <el-input clearable v-model.trim="formData.subregion" size="small" placeholder="请填写分区"></el-input>
                        </el-form-item>
                        <el-form-item label="用户名:" style="width: 30%" prop="name" size="small">
                            <el-input clearable v-model.trim="formData.name" size="small" placeholder="请填写用户名"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" style="width: 30%;" prop="password" size="small">
                            <el-input clearable v-model.trim="formData.password" size="small" placeholder="请填写密码" show-password></el-input>
                        </el-form-item>
                    </div>
                </el-form>
                <div class="ub mb-3" style="width:100%;">
                    <el-button
                        v-per="['yc_config_test']"
                        style="width:80px;margin-right: 8px;"
                        size="small"
                        type="primary"
                        @click="testKafka"
                    >测试连接
                    </el-button>
                    <div class="box-text" :style="colorText(kafkaConnect)">{{ kafkaConnect }}</div>
                </div>
                <el-form  ref="formDataEs" :model="formDataEs" :rules="formDataEsRules" label-width="100px" label-position="top">
                    <div class="title w100">
                        <span class="t1">ES配置</span>
                    </div>
                    <div class="ub ub-pj" style="width:100%;">
                        <el-form-item label="ES地址:" style="width: 30%" prop="esAddress" size="small">
                            <el-input clearable v-model.trim="formDataEs.esAddress" size="small" placeholder="请填写ES地址"></el-input>
                        </el-form-item>
                        <el-form-item label="端口：" style="width: 30%;" prop="esPort" size="small">
                            <el-input clearable v-model.trim="formDataEs.esPort" size="small" placeholder="请填写端口" type="number" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
                        </el-form-item>
                        <el-form-item label="用户名:" style="width: 30%" prop="esName" size="small">
                            <el-input clearable v-model.trim="formDataEs.esName" size="small" placeholder="请填写用户名"></el-input>
                        </el-form-item>
                    </div>
                    <div class="ub" style="width:100%;">
                        <el-form-item label="密码" style="width: 30%;" prop="esPassword" size="small">
                            <el-input clearable v-model.trim="formDataEs.esPassword" size="small" placeholder="请填写密码" show-password></el-input>
                        </el-form-item>
                    </div>
                </el-form>
                <div class="ub" style="width:100%;">
                    <el-button
                        v-per="['yc_config_test']"
                        style="width:80px;margin-right: 8px;"
                        size="small"
                        type="primary"
                        @click="testEs"
                    >测试连接
                    </el-button>
                    <div class="box-text" :style="colorEsText(esConnect)">{{ esConnect }}</div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>

import { esSave, kafkaSave, testConnect, getDataConfig } from '@/server/stream_data_center/config_manage.js'
export default {
    name: 'ConfigManage',
    components: {
    },
    data() {
        return {
            esConnect: '',
            kafkaConnect: '',
            formLabelWidth: '120px',
            formData: {
                kafkaAddress: '',
                port: '',
                topic: '',
                subregion: '',
                name: '',
                password: ''
            },
            formDataEs: {
                esAddress: '',
                esPort: '',
                esName: '',
                esPassword: ''
            },
            formDataRules: {
                kafkaAddress: [
                    { required: true, message: '请填写Kafka地址', trigger: 'blur' },
                    {
                        pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
                        message: '请输入合法的IP地址'

                    }
                ],
                port: [
                    { required: true, message: '请填写端口', trigger: 'blur' }
                ],
                topic: [
                    { required: true, message: '请填写topic', trigger: 'blur' }
                ],
                // subregion: [
                //     { required: true, message: '请填写分区', trigger: 'blur' }
                // ],
                esAddress: [
                    { required: true, message: '请填写ES地址', trigger: 'blur' },
                    {
                        pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
                        message: '请输入合法的IP地址'

                    }
                ],
                esPort: [
                    { required: true, message: '请填写端口', trigger: 'blur' }
                ],
                // name: [
                //     { required: true, message: '请填写用户名', trigger: 'blur' }
                // ],
                // password: [
                //     { required: true, message: '请填写密码', trigger: 'blur' }
                // ],
                esName: [
                    { required: true, message: '请填写用户名', trigger: 'blur' }
                ],
                esPassword: [
                    { required: true, message: '请填写密码', trigger: 'blur' }
                ]
            },
            formDataEsRules: {
                esAddress: [
                    { required: true, message: '请填写ES地址', trigger: 'blur' },
                    {
                        pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
                        message: '请输入合法的IP地址'

                    }
                ],
                esPort: [
                    { required: true, message: '请填写端口', trigger: 'blur' }
                ],
                esName: [
                    { required: true, message: '请填写用户名', trigger: 'blur' }
                ],
                esPassword: [
                    { required: true, message: '请填写密码', trigger: 'blur' }
                ]
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.getDataConfigData()
        })
    },
    beforeDestroy() {
    },
    computed: {
    },
    methods: {
        colorEsText(val) {
            if (val == 'es连接成功') {
                return 'color: #0cff00'
            } else if (val == 'es连接失败') {
                return 'color: #ff5033'
            } else {
                return 'color: #fff'
            }
        },
        colorText(val) {
            if (val == 'kafka连接成功') {
                return 'color: #0cff00'
            } else if (val == 'kafka连接失败') {
                return 'color: #ff5033'
            } else {
                return 'color: #fff'
            }
        },
        getDataConfigData() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            getDataConfig(data).then(res => {
                this.formData.kafkaAddress = res.kafka.ip
                this.formData.port = res.kafka.port
                this.formData.topic = res.kafka.topic
                this.formData.subregion = res.kafka.subregion
                this.formData.name = res.kafka.user
                this.formData.password = res.kafka.password

                this.formDataEs.esAddress = res.es.ip
                this.formDataEs.esPort = res.es.port
                this.formDataEs.esName = res.es.user
                this.formDataEs.esPassword = res.es.password
            }).catch(err => {
                console.log(err + 'err')
            })
        },
        testKafka() {
            this.$refs.formData.validate((valid) => {
                if (valid) {
                    let data = {
                        queryData: {},
                        paramsData: {
                            type: 0,
                            ip: this.formData.kafkaAddress,
                            port: this.formData.port,
                            topic: this.formData.topic,
                            subregion: this.formData.subregion,
                            user: this.formData.name,
                            password: this.formData.password
                        }
                    }
                    testConnect(data).then(res => {
                        console.log(res)
                        this.$message({
                            type: 'success',
                            message: 'kafka连接成功'
                        })
                        this.kafkaConnect = 'kafka连接成功'
                    }).catch(err => {
                        this.kafkaConnect = err.message
                        console.log(err + 'err')
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        testEs() {
            this.$refs.formDataEs.validate((valid) => {
                if (valid) {
                    let data = {
                        queryData: {},
                        paramsData: {
                            type: 1,
                            ip: this.formDataEs.esAddress,
                            port: this.formDataEs.esPort,
                            user: this.formDataEs.esName,
                            password: this.formDataEs.esPassword
                        }
                    }
                    testConnect(data).then(res => {
                        this.$message({
                            type: 'success',
                            message: 'es连接成功'
                        })
                        this.esConnect = 'es连接成功'
                    }).catch(err => {
                        this.esConnect = err.message
                        console.log(err + 'err')
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        submit() {
            this.addEs()
            this.addKafka()
        },
        addEs() {
            this.$refs.formDataEs.validate((valid) => {
                if (valid) {
                    let data = {
                        queryData: {},
                        paramsData: {
                            type: 1,
                            ip: this.formDataEs.esAddress,
                            port: this.formDataEs.esPort,
                            user: this.formDataEs.esName,
                            password: this.formDataEs.esPassword
                        }
                    }
                    esSave(data).then(res => {
                        this.$message({
                            type: 'success',
                            message: '添加成功'
                        })
                    }).catch(err => {
                        console.log(err + 'err')
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        addKafka() {
            this.$refs.formData.validate((valid) => {
                if (valid) {
                    let data = {
                        queryData: {},
                        paramsData: {
                            type: 0,
                            ip: this.formData.kafkaAddress,
                            port: this.formData.port,
                            topic: this.formData.topic,
                            subregion: this.formData.subregion,
                            user: this.formData.name,
                            password: this.formData.password
                        }
                    }
                    kafkaSave(data).then(res => {
                        this.$message({
                            type: 'success',
                            message: '添加成功'
                        })
                    }).catch(err => {
                        console.log(err + 'err')
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

<style lang="scss" scoped>
    .event-content{
        padding: 20px;
        ::v-deep .el-form-item--small.el-form-item {
            margin-bottom: 16px;
        }
    }
    .add_template ::v-deep .el-form {
        .el-form-item__label {
            font-size: 12px;
        }
    }
    .relative {
        position: relative;
        .btn-wrap {
            position: absolute;
            right: 0;
        }
    }

    .add_template ::v-deep .is-disabled {
        .el-textarea__inner {
            background: transparent;
            border: 1px solid #1cd7fa;
            box-shadow: 0px 0px 7px #389bf7 inset;
            color: #ccc;
        }
    }

    .title {
        // line-height: 2;
        // border-bottom: 1px solid rgba(0,233,255,.5);
        margin-bottom: 10px;
        .t1 {
            // display: inline-block;
            font-size: 12px;
            // letter-spacing: 1px;
            // border-bottom: 1px solid #00e9ff;
            // margin-left: 23px;
            // margin-bottom: -1px;
            color: #0052d9;
        }
        // .tips {
        //     font-size: 12px;
        //     letter-spacing: 0px;
        //     color: #ffffff;
        //     opacity: 0.8;
        //     margin-left: 30px;
        //     .iconfont {
        //         font-size: 12px;
        //     }
        // }
    }
    .form-wrapper {
        height: calc(100vh - 175px);
        overflow: auto;
    }
    .form-wrapper ::v-deep .el-form {
        // padding: 30px 40px 20px 20px;
    }
    .box-text {
        margin-left: 10px;
        width: calc(100% - 100px);
        max-height: 100px;
        overflow-y: auto;
        font-size: 12px;
        // border: 1px solid #1cd7fa;
        margin-right: 40px;
        line-height: 30px;
    }
</style>
