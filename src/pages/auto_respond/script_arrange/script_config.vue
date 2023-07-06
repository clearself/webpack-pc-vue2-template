<template>
    <div class="event event-wrapper work-config">
        <div class="event-content w100" v-loading="loading">
            <div class="ub w100 relative" style="margin-bottom: 20px;">
                <div class="title-created">新建模板</div>
                <div class="ub" style="margin-left: 20px">
                    <el-steps :space="100" :active="activeStep">
                        <el-step><i class="step1 step1Finish" slot="icon">工单基本信息</i></el-step>
                        <el-step><i class="step2 step2Active" slot="icon">配置流程信息</i></el-step>
                    </el-steps>
                </div>
                <div class="btn-wrap" style="font-size: 0">
                    <el-button size="small" @click="cancel">取 消</el-button>
                    <el-button size="small" @click="goBack">上一步</el-button>
                    <!-- <cancel-btn title="取 消" @click="cancel"></cancel-btn> -->
                    <!-- <cancel-btn class="back" title="上一步" @click="goBack"></cancel-btn> -->
                    <Debounce :time="2000" :isDebounce="2">
                        <!-- <search-btn title="保存至草稿" style="margin: 0 10px" @click.native="finish(0)"></search-btn> -->
                        <el-button size="small" style="background-color: #387dee;" type="primary" @click.native="finish(0)">保存至草稿</el-button>
                    </Debounce>
                    <Debounce :time="2000" :isDebounce="2">
                        <!-- <search-btn title="完成提交" @click.native="finish(1)"></search-btn> -->
                        <el-button size="small" style="background-color: #387dee;" type="primary" @click.native="finish(1)">完成提交</el-button>
                    </Debounce>
                </div>
            </div>
            <div class="w100 pic-wrapper" style="color: #fff;">
                <bpmn-modeler
                    v-if="bpmnLoad"
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
import { saveWorkTemplate, updateWorkTemplate } from '@/server/auto_respond/action_edit.js'
import bpmnModeler from '../../../script_flow/index'
import { getAllUsers } from '@/server/auto_respond/action_manage.js'
// import { groupList } from '@/server/auto_respond/action_manage.js'
// import { xmlStr } from './xmlData.js'
export default {
    name: 'WorkConfig',
    components: {
        bpmnModeler
    },
    data() {
        return {
            dutyPeopleList: [],
            findFacilityList: [],
            bpmnLoad: true,
            loading: false,
            activeStep: 0,
            formData: {
                name: '',
                xml: ''
            },
            isSubmit: false,
            xml: '', // 后端查询到的xml
            users: [{ name: '张三', id: 'zhangsan' }, { name: '李四', id: 'lisi' }, { name: '王五', id: 'wangwu' }],
            groups: [{ name: 'web组', id: 'web' }, { name: 'java组', id: 'java' }, { name: 'python组', id: 'python' }],
            categorys: [{ name: 'OA', id: 'oa' }, { name: '财务', id: 'finance' }]
        }
    },
    mounted() {
        console.log(this.$route)
        if (this.$route.query.id) {
            // this.formData.id = this.$route.query.id;
        }
        this.getAllUsersData()
        this.getModelDetail()
        // setTimeout(() => {
        //     this.bpmnLoad = true
        // }, 1000)
        // this.groupListFn()
    },
    beforeDestroy() {
        if (this.$getsessionStorage('copyAdd')) {
            this.$removesessionStorage('copyAdd')
        }
    },
    computed: {},
    methods: {
        // groupListFn() {
        //     let data = {
        //         queryData: {},
        //         paramsData: {
        //             type: 0
        //         }
        //     }
        //     console.log(groupList)
        //     groupList(data)
        //         .then(res => {
        //             this.customList = res
        //             this.$setsessionStorage('customAutoList', res)
        //             this.bpmnLoad = true
        //         })
        //         .catch(err => {
        //             console.log(err)
        //         })
        // },
        getAllUsersData() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            getAllUsers(data).then(res => {
                this.dutyPeopleList = res
                this.$setsessionStorage('dutyPeopleList', res)
            }).catch(err => {
                console.log(err)
            })
        },
        getNewXMLInFo({ xml, name }) {
            this.formData.xml = xml
            this.formData.name = name
            console.log('this.formData', this.formData)
        },
        cancel() {
            this.$router.push('/auto_respond/script_arrange')
        },
        goBack() {
            this.$router.push('/auto_respond/script_base?record=1')
        },
        finish(val) {
            let record_baseForm = this.$getsessionStorage('baseForm')
            console.log(record_baseForm, 'qqqqqqqqqqqqqqqqqqqqqqqqqqqqqq')
            record_baseForm.status = val
            record_baseForm.xml = this.formData.xml
            record_baseForm.xmlName = this.formData.name
            if (this.isSubmit) return
            // let reguser = /"dealUserType"/g
            // if (!reguser.test(this.formData.xml)) {
            //     this.$message({
            //         message: '请在流程中配置相关节点处理人!',
            //         type: 'warning'
            //     })
            // } else {
            this.isSubmit = true
            let data = {
                queryData: {},
                paramsData: record_baseForm
            }
            let request = saveWorkTemplate
            if (record_baseForm.id) {
                request = updateWorkTemplate
            }
            request(data)
                .then(res => {
                    console.log(res)
                    this.$message({
                        message: '提交成功',
                        type: 'success'
                    })
                    this.isSubmit = false
                    setTimeout(() => {
                        this.cancel()
                    }, 500)
                })
                .catch(error => {
                    this.isSubmit = false
                    console.log(error)
                })
            // }
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
                // this.xml = xmlStr
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
.work-config {
    margin: 10px;
    padding: 20px;
}
.event-content {
    background-color: #fff;
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
    font-size: 13px;
    color: rgba(0, 0, 0, 0.9);
    height: 28px;
    line-height: 28px;
}

.work-config ::v-deep .is-disabled {
    .el-textarea__inner {
        background: transparent;
        border: 1px solid #1cd7fa;
        box-shadow: 0px 0px 7px #389bf7 inset;
        color: #ccc;
    }
}
.work-config ::v-deep .el-steps {
    .el-step {
        .el-step__head {
            .el-step__line {
                display: none;
                height: 0px;
            }
            .is-text {
                height: 28px;
                width: 200px;
                margin-left: 20px;
                border-style: hidden;
                background-color: transparent !important;
            }
        }
        .step1,
        .step2,
        .step3 {
            color: rgba(0, 0, 0, 0.26);
            text-indent: 20px;
            width: 200px;
            line-height: 28px;
            font-style: normal;
            height: 28px;
            background-color: #f3f3f3;
        }
        .step2,
        .step3 {
            text-indent: 40px;
        }
        .step1Active {
            color: #fff;
            background-color: #387dee;
            position: relative;
            &:after {
                position: absolute;
                top: 0;
                right: -20px;
                content: '';
                width: 0;
                height: 0;
                border-left: 20px solid #387dee;
                border-top: 14px solid transparent;
                border-bottom: 14px solid transparent;
                border-right: none;
            }
        }
        .step2Active,
        .step3Active {
            color: #fff;
            background-color: #387dee;
            &:after {
                position: absolute;
                top: 0;
                right: -20px;
                content: '';
                width: 0;
                height: 0;
                border-left: 20px solid #387dee;
                border-top: 14px solid transparent;
                border-bottom: 14px solid transparent;
                border-right: none;
            }
            &:before {
                position: absolute;
                top: 0;
                left: 0;
                content: '';
                width: 0;
                height: 0;
                border-left: 20px solid #fff;
                border-top: 14px solid transparent;
                border-bottom: 14px solid transparent;
                border-right: none;
            }
        }
        .step1Finish {
            color: #fff;
            background-color: #387dee;
            position: relative;
            &:after {
                position: absolute;
                top: 0;
                right: -20px;
                content: '';
                width: 0;
                height: 0;
                border-left: 20px solid #387dee;
                border-top: 14px solid transparent;
                border-bottom: 14px solid transparent;
                border-right: none;
            }
        }
        .step2Finish,
        .step3Finish {
            color: #fff;
            background-color: #387dee;
            &:after {
                position: absolute;
                top: 0;
                right: -20px;
                content: '';
                width: 0;
                height: 0;
                border-left: 20px solid #387dee;
                border-top: 14px solid transparent;
                border-bottom: 14px solid transparent;
                border-right: none;
            }
            &:before {
                position: absolute;
                top: 0;
                left: 0;
                content: '';
                width: 0;
                height: 0;
                border-left: 20px solid #fff;
                border-top: 14px solid transparent;
                border-bottom: 14px solid transparent;
                border-right: none;
            }
        }
        .step1Ready {
            background-color: #f3f3f3;
            color: rgba(0, 0, 0, 0.26);
            &:after {
                position: absolute;
                top: 0;
                right: -20px;
                content: '';
                width: 0;
                height: 0;
                border-left: 20px solid #f3f3f3;
                border-top: 14px solid transparent;
                border-bottom: 14px solid transparent;
                border-right: none;
            }
        }
        .step2Ready,
        .step3Ready {
            background-color: #f3f3f3;
            color: rgba(0, 0, 0, 0.26);
            &:after {
                position: absolute;
                top: 0;
                right: -20px;
                content: '';
                width: 0;
                height: 0;
                border-left: 20px solid #f3f3f3;
                border-top: 14px solid transparent;
                border-bottom: 14px solid transparent;
                border-right: none;
            }
            &:before {
                position: absolute;
                top: 0;
                left: 0;
                content: '';
                width: 0;
                height: 0;
                border-left: 20px solid #fff;
                border-top: 14px solid transparent;
                border-bottom: 14px solid transparent;
                border-right: none;
            }
        }
    }
}

.title {
    line-height: 2;
    border-bottom: 1px solid #00e9ff;
    .t1 {
        display: inline-block;
        font-size: 14px;
        letter-spacing: 1px;
        border-bottom: 1px solid #00e9ff;
        margin-left: 23px;
        color: #fff;
    }
    .tips {
        font-size: 12px;
        letter-spacing: 0px;
        color: #ffffff;
        opacity: 0.8;
        margin-left: 30px;
        .iconfont {
            font-size: 12px;
        }
    }
}
.pic-wrapper {
    height: calc(100vh - 186px);
    overflow: auto;
    border: 1px solid #dddddd;
}
.arrow {
    width: 52px;
    height: 31px;
    display: inline-block;
    margin-left: 84px;
    margin-right: 84px;
    background-image: url(../../../assets/img/work_order/arrow.png);
}

.dis {
    cursor: no-drop;
}
</style>
