<template>
    <div class="wrapper">
        <x-form ref="xForm" v-model="formData" :config="formConfig">
            <template #baseInfo>
                <div class="baseinfo">
                    <div class="row ub">
                        <div class="base-label">动作名称:</div>
                        <div class="base-value">{{ baseInfo.name }}</div>
                    </div>
                    <div class="row ub">
                        <div class="base-label">绑定应用:</div>
                        <div class="base-value">{{ baseInfo.adhibitionName }}</div>
                    </div>
                    <div class="row ub">
                        <div class="base-label">动作描述:</div>
                        <div class="base-value">{{ baseInfo.description }}</div>
                    </div>
                </div>
            </template>
            <template #card>
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="输入参数" name="first">输入参数</el-tab-pane>
                    <el-tab-pane label="输出参数" name="second">输出参数</el-tab-pane>
                </el-tabs>
                <div v-if="activeName=='first'">
                    <div class="card mb-1" v-for="(item,index) in paramList" :key="index">
                        <div class="num">{{ index+1 }}</div>
                        <div class="cell ub mb-1">
                            <div class="cell-label">参数名称</div>
                            <div class="cell-val">{{ item.name }}</div>
                        </div>
                        <div class="cell ub mb-1">
                            <div class="cell-label">默认值</div>
                            <div class="cell-val">{{ item.default }}</div>
                        </div>
                        <div class="cell ub mb-1">
                            <div class="cell-label">是否必填</div>
                            <div class="cell-val">{{ item.empty |  emptyText  }}</div>
                        </div>
                        <div class="cell ub mb-1">
                            <div class="cell-label"><span v-show="item.empty==1" style="color:red">*</span>参数值</div>
                            <div class="cell-val"><el-input size="mini" v-model="item.paramData" placeholder="请输入" :disabled="disabled"></el-input></div>
                        </div>
                        <div  v-show="item.empty==1&&!item.paramData" class="mb-1" style="color:red;font-size: 12px;margin-left: 10px;">请输入参数值</div>
                        <div class="hint mb-1">
                            <span class="iconfont icon-zhushi" style="margin-right: 6px;"></span>
                            <span>输入$可选择引用变量</span>
                        </div>
                    </div>
                </div>
                <div v-if="activeName=='second'">
                    <div class="card mb-1" v-for="(item,index) in cardTwoList" :key="index">
                        <div class="num">{{ index+1 }}</div>
                        <div class="cell ub mb-1">
                            <div class="cell-label">参数名称</div>
                            <div class="cell-val">{{ item.name }}</div>
                        </div>
                        <div class="cell ub mb-1">
                            <div class="cell-label">默认值</div>
                            <div class="cell-val">{{ item.default }}</div>
                        </div>
                    </div>
                </div>

            </template>
        </x-form>
    </div>
</template>

<script>
import { getDealContent } from '@/server/auto_respond/execution_list.js'
import { findFacilityList } from '@/server/auto_respond/action_manage.js'
import { json } from 'body-parser'
import mixinPanel from '../../common/mixinPanel'
import mixinXcrud from '../../common/mixinXcrud'
export default {
    mixins: [mixinPanel, mixinXcrud],
    props: {
        processInstanceId: {
            type: String,
            default: ''
        },
        users: {
            type: Array,
            required: true
        },
        disabled: {
            type: Boolean,
            default: true
        },
        groups: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            dealContent: {},
            nodeId: '',
            baseInfo: {},
            paramList: [],
            cardTwoList: [],
            deviceList: [],
            input: '',
            activeName: 'first',
            formData: {}
        }
    },
    watch: {
        'formData.device': function(val, oldVal) {
            if (val.length == 0) val = []
            console.log(this.formData)
            let documentation = JSON.parse(this.formData.documentation)
            documentation.device = val || ''
            this.formData.documentation = JSON.stringify(documentation)
            this.updateProperties({ 'camunda:device': val.join(',') })
        },
        paramList: {
            deep: true,
            handler(newValue, oldValue) {
                let documentation = JSON.parse(this.formData.documentation)
                documentation.paramList = newValue
                this.formData.documentation = JSON.stringify(documentation)
                this.updateProperties({ 'camunda:paramList': JSON.stringify(newValue) })
            }
        }

    },
    mounted() {},
    created() {
        console.log(this.element, '3333333')
        let taskType = this.element['camunda:taskType'
        ]
        if (taskType) this.updateProperties({ 'camunda:taskType': taskType })
        console.log(taskType, 'taskType')
        let customAutoList = this.$getsessionStorage('customAutoList')
        console.log('customAutoList', customAutoList)
        const cache = {
            ...this.element.businessObject,
            ...this.element.businessObject.$attrs
        }

        // 移除camunda前缀，格式化数组
        for (const key in cache) {
            if (key.indexOf('camunda:') === 0) {
                const newKey = key.replace('camunda:', '')
                cache[newKey] = cache[key]
                delete cache[key]
            }
        }
        this.baseInfo = this.findItemById(cache.taskType, customAutoList)
        this.paramList = JSON.parse(this.baseInfo.outInput).imports
        this.cardTwoList = JSON.parse(this.baseInfo.outInput).outputs
        this.facilityList()
        console.log('outInput', JSON.parse(this.baseInfo.outInput))
        let documentation = {
            id: cache.id,
            actionName: cache.name ? cache.name : '',
            actionId: cache.taskType ? cache.taskType : '',
            device: cache.device ? cache.device : '',
            paramList: cache.paramList ? cache.paramList : this.paramList,
            type: 3
        }
        // if (this.disabled) {
        //     this.nodeId = cache.id
        //     this.getDealContentData()
        // }
        cache.documentation = JSON.stringify(documentation)
        this.formData = cache
        this.formData.device = cache.device ? cache.device.split(',') : ''
        this.paramList = cache.paramList ? JSON.parse(cache.paramList) : this.paramList
        this.updateEventClass()
        console.log('自动节点', JSON.stringify(documentation))
    },
    filters: {
        emptyText(val) {
            if (val == 2) {
                return '否'
            } else if (val == 1) {
                return '是'
            } else {
                return ''
            }
        }
    },
    computed: {
        formConfig() {
            const _this = this
            return {
                inline: false,
                labelPosition: 'top',
                item: [
                    {
                        xType: 'input',
                        name: 'name',
                        label: '节点名称',
                        size: 'mini',
                        disabled: _this.disabled
                    },
                    { slot: 'baseInfo' },
                    {
                        xType: 'select',
                        name: 'device',
                        size: 'mini',
                        label: '选择设备',
                        disabled: _this.disabled,
                        multiple: true,
                        filterable: true,
                        dic: { data: _this.deviceList, label: 'facilityName', value: 'id' }
                    },
                    { slot: 'card' }
                ]
            }
        }
    },
    methods: {
        getDealContentData() {
            let data = {
                queryData: {},
                paramsData: {
                    type: 2,
                    processInstanceId: this.processInstanceId,
                    nodeId: this.nodeId
                }
            }
            getDealContent(data).then(res => {
                if (res.dealContent) {
                    this.dealContent = JSON.parse(res.dealContent)
                }
            }).catch(err => {
                console.log(err)
            })
        },
        facilityList() {
            let data = {
                queryData: {},
                paramsData: {
                    adhibitions: this.baseInfo.adhibitions
                }
            }
            findFacilityList(data).then(res => {
                this.deviceList = res
            }).catch(err => {
                console.log(err)
            })
        },
        updateEventClass() {
            this.updateProperties({ 'camunda:class': 'com.boot.base.common.util.scriptflow.ScriptTaskAutoListener' })
        },
        findItemById(id, list) {
            let res = list.find(item => item.id == id)
            if (res) {
                return res
            } else {
                for (let i = 0; i < list.length; i++) {
                    if (list[i].actions instanceof Array && list[i].actions.length > 0) {
                        res = this.findItemById(id, list[i].actions)
                        if (res) {
                            return res
                        }
                    }
                }
                return null
            }
        },

        handleClick(tab, event) {
            console.log(tab, event)
        }
    }
}
</script>

<style scoped lang="scss">
.wrapper {
    .baseinfo {
        .row {
            margin-bottom: 16px;
            .base-label {
                width: 60px;
                font-size: 12px;
                text-align: left;
                line-height: 20px;
                color: rgba(0,0,0,0.60);
            }
            .base-value {
                word-wrap:break-word;
                width: 220px;
                font-size: 12px;
                color: rgba(0,0,0,0.90);
                letter-spacing: 0;
                line-height: 20px;
            }
        }

    }
    .card {
        width: 280px;
        border: 1px solid rgba(221,221,221,1);
        border-radius: 4px;
        .num {
            background: rgba(101,101,101,0.05);
            border: 1px solid rgba(221,221,221,1);
            border-radius: 0px 0px 12px 0px;
            font-size: 12px;
            color: #000000;
            text-align: center;
            width: 66px;
            height: 24px;
            line-height: 24px;
            margin-bottom: 6px;
        }
        .cell {
            margin-left: 10px;
            width: 260px;
            border: 1px solid rgba(220,220,220,1);
            border-radius: 2px;
            font-size: 12px;
            color: rgba(0,0,0,0.90);
            line-height: 32px;
            .cell-label {
                box-sizing: border-box;
                padding-left: 6px;
                width: 70px;
                border-right: 1px solid #DCDCDC;
                color: #0052D9;
            }
            .cell-val {
                box-sizing: border-box;
                padding-left: 6px;
                color: rgba(0,0,0,0.90);
            }
        }
        .hint {
            margin-left: 10px;
            line-height: 20px;
            font-size: 12px;
            color: rgba(0,0,0,0.26);
        }
    }
    .card ::v-deep .el-input__inner{
        border: none !important;
    }
}
</style>
