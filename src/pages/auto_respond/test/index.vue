<template>
    <div class="event event-wrapper work-config">
        <div class="event-content w100">
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
import bpmnModeler from '../../../script_flow/index'
import { xmlStr } from './xmlData.js'
import { groupList, findFacilityList } from '@/server/auto_respond/action_manage.js'
export default {
    name: 'WorkConfig1',
    components: {
        bpmnModeler
    },
    data() {
        return {
            findFacilityList: [],
            bpmnLoad: false,
            customList: [],
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
        this.groupListFn()
        this.facilityList()
    },
    beforeDestroy() {
        if (this.$getsessionStorage('copyAdd')) {
            this.$removesessionStorage('copyAdd')
        }
    },
    computed: {
    },
    methods: {
        facilityList() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            findFacilityList(data).then(res => {
                this.findFacilityList = res
                this.$setsessionStorage('findFacilityList', res)
            }).catch(err => {
                console.log(err)
            })
        },
        groupListFn() {
            let data = {
                queryData: {},
                paramsData: {
                    type: 0
                }
            }
            groupList(data).then(res => {
                this.customList = res
                this.$setsessionStorage('customAutoList', res)
                this.bpmnLoad = true
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
            this.$router.push('/works_order/work_template')
        },
        goBack() {
            this.$router.push('/works_order/work_base?record=1')
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
    .event-content{
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
        font-size: 14px;
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
                   background-color:transparent !important;
                }
            }
            .step1, .step2, .step3 {
                color: rgba(0, 0, 0, 0.26);
                text-indent: 20px;
                width: 200px;
                line-height: 28px;
                font-style: normal;
                height: 28px;
                background-color: #f3f3f3;
            }
            .step2, .step3 {
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
            .step2Active,.step3Active {
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
            .step2Finish,.step3Finish {
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
            .step1Ready{
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
            .step2Ready,.step3Ready {
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
