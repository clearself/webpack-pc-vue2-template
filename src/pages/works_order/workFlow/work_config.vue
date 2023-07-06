<template>
    <div class="event event-wrapper work-config">
        <div class="event-content w100" v-loading="loading">
            <div class="ub w100 relative" style="margin-bottom: 20px;">
                <div class="title-created">新建模板</div>
                <div class="ub" style="margin-left: 20px;">
                    <el-steps :space="100" :active="activeStep">
                        <el-step><i class="step1 step1Finish" slot="icon">工单基本信息</i></el-step>
                        <el-step><i class="step2 step2Active" slot="icon">配置流程信息</i></el-step>
                    </el-steps>
                </div>
                <div class="btn-wrap" style="font-size: 0;">
                    <el-button size="small" @click="cancel">取 消</el-button>
                    <el-button size="small" @click="goBack">上一步</el-button>
                    <!-- <cancel-btn title="取 消" @click="cancel"></cancel-btn> -->
                    <!-- <cancel-btn class="back" title="上一步" @click="goBack"></cancel-btn> -->
                    <Debounce :time='2000' :isDebounce="2">
                        <!-- <search-btn title="保存至草稿" style="margin: 0 10px" @click.native="finish(0)"></search-btn> -->
                        <el-button size="small" style="background-color: #387dee;" type="primary" @click.native="finish(0)">保存至草稿</el-button>
                    </Debounce>
                    <Debounce :time='2000' :isDebounce="2">
                        <!-- <search-btn title="完成提交" @click.native="finish(1)"></search-btn> -->
                        <el-button size="small" style="background-color: #387dee;" type="primary" @click.native="finish(1)">完成提交</el-button>
                    </Debounce>
                </div>
            </div>
            <div class="w100 pic-wrapper" style="color: #ffffff;">
                <bpmn-modeler
                    ref="refNode"
                    :xml="xml"
                    :users="users"
                    :groups="groups"
                    :categorys="categorys"
                    :is-view="false"
                    @getNewXMLInFo="getNewXMLInFo"
                    @save="saveModeler"
                />
            </div>
        </div>
    </div>
</template>

<script>
import {
    saveWorkTemplate
} from '../../../server/works_order/define.js'
import bpmnModeler from '../../../package/index'
import { xmlStr } from './xmlData.js'
export default {
    name: 'WorkConfig',
    components: {
        bpmnModeler
    },
    data() {
        return {
            loading: false,
            activeStep: 0,
            formData: {
                name: '',
                xml: ''
            },
            isSubmit: false,
            xml: '', // 后端查询到的xml
            users: [
                { name: '张三', id: 'zhangsan' },
                { name: '李四', id: 'lisi' },
                { name: '王五', id: 'wangwu' }
            ],
            groups: [
                { name: 'web组', id: 'web' },
                { name: 'java组', id: 'java' },
                { name: 'python组', id: 'python' }
            ],
            categorys: [
                { name: 'OA', id: 'oa' },
                { name: '财务', id: 'finance' }
            ]
        }
    },

    mounted() {
        console.log(this.$route)
        if (this.$route.query.id) {
            // this.formData.id = this.$route.query.id;
        }
        this.getModelDetail()
    },
    beforeDestroy() {
        if (this.$getsessionStorage('copyAdd')) {
            this.$removesessionStorage('copyAdd')
        }
    },
    computed: {
    },
    methods: {
        getNewXMLInFo({ xml, name }) {
            this.formData.xml = xml
            this.formData.name = name
            console.log('this.formData', this.formData)
        },
        cancel() {
            this.$router.push('/works_order/work_template')
        },
        goBack() {
            this.$router.push('/works_order/work_base?record=1')
        },
        finish(val) {
            let record_baseForm = this.$getsessionStorage('baseForm')
            console.log(record_baseForm, 'qqqqqqqqqqqqqqqqqqqqqqqqqqqqqq')
            record_baseForm.status = val
            record_baseForm.xml = this.formData.xml
            record_baseForm.xmlName = this.formData.name
            if (this.isSubmit) return
            let reguser = /"dealUserType"/g
            if (!reguser.test(this.formData.xml)) {
                this.$message({
                    message: '请在流程中配置相关节点处理人!',
                    type: 'warning'
                })
            } else {
                this.isSubmit = true
                let data = {
                    queryData: {},
                    paramsData: record_baseForm
                }
                saveWorkTemplate(data).then(res => {
                    console.log(res)
                    this.$message({
                        message: '提交成功',
                        type: 'success'
                    })
                    this.isSubmit = false
                    setTimeout(() => {
                        this.cancel()
                    }, 500)
                }).catch(error => {
                    this.isSubmit = false
                    console.log(error)
                })
            }
        },
        getModelDetail() {
            let record_baseForm = this.$getsessionStorage('baseForm')
            if (record_baseForm.xml) {
                this.xml = record_baseForm.xml
                if (this.$getsessionStorage('send_object_change')) {
                    let reg = /fieldsReal=["][^"]*["]/g
                    let reg1 = /"fields":\[(.+?)\]/g
                    this.xml = record_baseForm.xml = this.xml.replace(reg, 'fieldsReal=""').replace(reg1, '"fields":[]')
                    this.$setsessionStorage('baseForm', record_baseForm)
                    this.$setsessionStorage('send_object_change', false)
                }
            } else {
                this.xml = xmlStr
            }
            this.formData.name = record_baseForm.xmlName ?? ''
        },
        saveModeler(data) {
            console.log(data)
        }
    }
}
</script>

<style lang="scss" scoped>
    .custom-star {
        .work-config {
            border: solid 1px #50b0ff;
            background-color: #111d2b;
            box-shadow: -4px 0 14px 0
                rgb(0 0 0 / 20%),
                inset 0 0 28px 0
                #00b4ff;
            .event-content {
                background-color: #111d2b;
                .title-created {
                    color: #ffffff;
                }
            }
        }
    }
    .work-config {
        margin: 10px;
        padding: 20px;
    }
    .event-content {
        background-color: #ffffff;
    }
    .work-config ::v-deep .el-form {
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
    .title-created {
        height: 28px;
        font-size: 14px;
        color: rgb(0 0 0 / 90%);
        line-height: 28px;
    }
    .work-config ::v-deep .is-disabled {
        .el-textarea__inner {
            border: 1px solid #1cd7fa;
            color: #cccccc;
            background: transparent;
            box-shadow: 0 0 7px #389bf7 inset;
        }
    }
    .work-config ::v-deep .el-steps {
        .el-step {
            .el-step__head {
                .el-step__line {
                    display: none;
                    height: 0;
                }
                .is-text {
                    margin-left: 20px;
                    width: 200px;
                    height: 28px;
                    border-style: hidden;
                    background-color: transparent !important;
                }
            }
            .step1, .step2, .step3 {
                width: 200px;
                height: 28px;
                text-indent: 20px;
                color: rgb(0 0 0 / 26%);
                background-color: #f3f3f3;
                line-height: 28px;
                font-style: normal;
            }
            .step2, .step3 {
                text-indent: 40px;
            }
            .step1Active {
                position: relative;
                color: #ffffff;
                background-color: #387dee;
                &::after {
                    position: absolute;
                    top: 0;
                    right: -20px;
                    width: 0;
                    height: 0;
                    border-top: 14px solid transparent;
                    border-right: none;
                    border-bottom: 14px solid transparent;
                    border-left: 20px solid #387dee;
                    content: '';
                }
            }
            .step2Active,.step3Active {
                color: #ffffff;
                background-color: #387dee;
                &::after {
                    position: absolute;
                    top: 0;
                    right: -20px;
                    width: 0;
                    height: 0;
                    border-top: 14px solid transparent;
                    border-right: none;
                    border-bottom: 14px solid transparent;
                    border-left: 20px solid #387dee;
                    content: '';
                }
                &::before {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 0;
                    height: 0;
                    border-top: 14px solid transparent;
                    border-right: none;
                    border-bottom: 14px solid transparent;
                    border-left: 20px solid #ffffff;
                    content: '';
                }
            }
            .step1Finish {
                position: relative;
                color: #ffffff;
                background-color: #387dee;
                &::after {
                    position: absolute;
                    top: 0;
                    right: -20px;
                    width: 0;
                    height: 0;
                    border-top: 14px solid transparent;
                    border-right: none;
                    border-bottom: 14px solid transparent;
                    border-left: 20px solid #387dee;
                    content: '';
                }
            }
            .step2Finish,.step3Finish {
                color: #ffffff;
                background-color: #387dee;
                &::after {
                    position: absolute;
                    top: 0;
                    right: -20px;
                    width: 0;
                    height: 0;
                    border-top: 14px solid transparent;
                    border-right: none;
                    border-bottom: 14px solid transparent;
                    border-left: 20px solid #387dee;
                    content: '';
                }
                &::before {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 0;
                    height: 0;
                    border-top: 14px solid transparent;
                    border-right: none;
                    border-bottom: 14px solid transparent;
                    border-left: 20px solid #ffffff;
                    content: '';
                }
            }
            .step1Ready {
                color: rgb(0 0 0 / 26%);
                background-color: #f3f3f3;
                &::after {
                    position: absolute;
                    top: 0;
                    right: -20px;
                    width: 0;
                    height: 0;
                    border-top: 14px solid transparent;
                    border-right: none;
                    border-bottom: 14px solid transparent;
                    border-left: 20px solid #f3f3f3;
                    content: '';
                }
            }
            .step2Ready,.step3Ready {
                color: rgb(0 0 0 / 26%);
                background-color: #f3f3f3;
                &::after {
                    position: absolute;
                    top: 0;
                    right: -20px;
                    width: 0;
                    height: 0;
                    border-top: 14px solid transparent;
                    border-right: none;
                    border-bottom: 14px solid transparent;
                    border-left: 20px solid #f3f3f3;
                    content: '';
                }
                &::before {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 0;
                    height: 0;
                    border-top: 14px solid transparent;
                    border-right: none;
                    border-bottom: 14px solid transparent;
                    border-left: 20px solid #ffffff;
                    content: '';
                }
            }
        }
    }
    .title {
        line-height: 2;
        border-bottom: 1px solid #00e9ff;
        .t1 {
            display: inline-block;
            margin-left: 23px;
            font-size: 14px;
            border-bottom: 1px solid #00e9ff;
            color: #ffffff;
            letter-spacing: 1px;
        }
        .tips {
            margin-left: 30px;
            font-size: 12px;
            color: #ffffff;
            opacity: 0.8;
            letter-spacing: 0;
            .iconfont {
                font-size: 12px;
            }
        }
    }
    .pic-wrapper {
        overflow: auto;
        height: calc(100vh - 186px);
        border: 1px solid #dddddd;
    }
    .arrow {
        display: inline-block;
        margin-right: 84px;
        margin-left: 84px;
        width: 52px;
        height: 31px;
        background-image: url(../../../assets/img/work_order/arrow.png);
    }
    .dis {
        cursor: no-drop;
    }
</style>
