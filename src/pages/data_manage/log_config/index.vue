<template>
    <div class="event log_config">
        <div class="event-wrapper event-content w100">
            <div class="ub w100 relative mb-2">
                <div class="list-tips">日志配置</div>
                <div class="btn-wrap" style="margin-left: auto">
                    <!-- <cancel-btn title="取 消" style="margin-right: 8px" @click="cancel"></cancel-btn> -->
                    <el-button size="small" type="primary" @click="submit">提 交</el-button>
                </div>
            </div>
            <div class="w100 form-wrapper" style="color: #fff">
                <el-form ref="formData" :model="formData" :rules="formDataRules" label-width="100px" label-position="top">
                    <!-- <div class="title w100">
                        <span class="t1">日志配置</span>
                    </div> -->
                    <div class="ub ub-pj" style="width: 100%">
                        <el-form-item label="安全设备日志保留时长：" style="width: 30%" prop="alarmDay" size="small">
                            <el-input-number size="small" :precision="0" v-model="formData.alarmDay"  :max="1000" :min="1" :controls="false" style="width: 90%">
                            </el-input-number>
                            <span class="unit-text ml-1">天</span>
                        </el-form-item>
                        <el-form-item label="应用日志保留时长：" style="width: 30%" prop="appDay" size="small">
                            <el-input-number size="small" :precision="0" v-model="formData.appDay"  :max="1000" :min="1" :controls="false" style="width: 90%">
                            </el-input-number>
                            <span class="unit-text ml-1">天</span>
                        </el-form-item>
                        <el-form-item label="流日志保留时长：" style="width: 30%" prop="flowDay" size="small">
                            <el-input-number size="small" :precision="0" v-model="formData.flowDay"  :max="1000" :min="1" :controls="false" style="width: 90%">
                            </el-input-number>
                            <span class="unit-text ml-1">天</span>
                        </el-form-item>
                    </div>
                    <div class="ub ub-pj" style="width: 100%">
                        <el-form-item label="主机日志保留时长：" style="width: 30%" prop="hostDay" size="small">
                            <el-input-number size="small" :precision="0" v-model="formData.hostDay"  :max="1000" :min="1" :controls="false" style="width: 90%">
                            </el-input-number>
                            <span class="unit-text ml-1">天</span>
                        </el-form-item>
                    </div>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
import { getData, saveData } from '@/server/data_manage/log_config.js'
export default {
    name: 'LogConfig',
    components: {},
    data() {
        return {
            formLabelWidth: '120px',
            formData: {
                id: '',
                alarmDay: undefined,
                appDay: undefined,
                flowDay: undefined,
                hostDay: undefined
            },
            formDataRules: {
                alarmDay: [
                    {
                        required: true,
                        message: '请填写安全设备日志保留时间',
                        trigger: 'blur'
                    }
                ],
                appDay: [
                    {
                        required: true,
                        message: '请填写应用日志保留时间',
                        trigger: 'blur'
                    }
                ],
                flowDay: [
                    {
                        required: true,
                        message: '请填写流日志保留时间',
                        trigger: 'blur'
                    }
                ],
                hostDay: [
                    {
                        required: true,
                        message: '请填写主机日志保留时间',
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.initData()
        })
    },
    beforeDestroy() {},
    computed: {},
    methods: {
        initData() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            getData(data).then(res => {
                if (res) {
                    this.formData.id = res.id
                    this.formData.alarmDay = res.alarmDay
                    this.formData.appDay = res.appDay
                    this.formData.flowDay = res.flowDay
                    this.formData.hostDay = res.hostDay
                }
            }).catch(err => {
                console.log(err + 'err')
            })
        },
        submit() {
            this.$refs.formData.validate(valid => {
                if (valid) {
                    let data = {
                        queryData: {},
                        paramsData: {
                            id: this.formData.id,
                            alarmDay: this.formData.alarmDay,
                            appDay: this.formData.appDay,
                            flowDay: this.formData.flowDay,
                            hostDay: this.formData.hostDay
                        }
                    }
                    saveData(data).then(res => {
                        this.$message({
                            type: 'success',
                            message: '保存成功'
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
  .event-content {
    padding: 20px;
    ::v-deep .el-form-item--small.el-form-item {
      margin-bottom: 16px;
    }
  }
  .log_config ::v-deep .el-form {
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
  .log_config ::v-deep .el-input-number.is-without-controls .el-input__inner {
    text-align: left;
  }

  .form-wrapper {
    height: calc(100vh - 175px);
    overflow: auto;
  }
  .unit-text {
    font-size: 12px;
    line-height: 32px;
    color: #606266;
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
