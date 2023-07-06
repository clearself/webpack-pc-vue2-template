<template>
    <div class="wrapper">
        <x-form ref="xForm" v-model="formData" :config="formConfig">
            <template #dutyPeople>
                <el-form :model="addData" ref="addData" class="unit" label-position="top">
                    <el-form-item
                        label="责任人"
                        prop='dutyPeople'
                        label-width="90px"
                        :rules="{required: true, message: '请选择', trigger: ['change']}">
                        <el-select :disabled="disabled" :filterable="true" style="width: 100%;" v-model="addData.dutyPeople" placeholder="请选择" size="mini">
                            <el-option
                                v-for="item in dutyPeopleList"
                                :key="item.id"
                                :label="item.chineseName"
                                :value="item.id">
                                <span style="float: left">{{ item.chineseName }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.depName }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>

                </el-form>
            </template>
            <template #titleInfo>
                <!-- <div class="base-info">
                    <div class="cell">
                        <div class="cell-label"><span class="verify">*</span>人工任务类型</div>
                        <el-select style="width: 100%;" v-model="mission" placeholder="请选择" size="mini">
                            <el-option
                                v-for="item in missionList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                </div> -->
                <div class="title-info ub" v-if="!disabled">
                    <div class="line"></div>
                    <div class="text">问题设置</div>
                </div>
            </template>
            <template #option v-if="!disabled">
                <el-form :model="inputData" ref="inputData" class="unit" label-position="top">
                    <div class="ub" v-for="(item,index) in inputData.optionList" :key="index" style="margin: 10px 0">
                        <div style="margin-right: 6px;">
                            <el-form-item
                                :label="`选项${index+1}`"
                                :prop='"optionList." + index + ".option"'
                                label-width="90px"
                                :rules="{required: true, message: '请输入', trigger: ['blur']}">
                                <el-input :maxlength="20" style="width: 250px;" v-model="item.option" size="mini" placeholder="请输入"></el-input>
                            </el-form-item>
                        </div>
                        <div v-if="index">
                            <i class="el-icon-remove-outline" @click="deleteFields(index)" style="margin: 35px 10px 13px 10px;color: red;font-size: 12px;cursor: pointer"></i>
                        </div>
                    </div>
                </el-form>
                <div class="btn" @click="addFields">
                    <i class="el-icon-plus"></i>
                    <span>添加新选项</span>
                </div>
            </template>
            <template #detail v-if="disabled">
                <div class="title-info ub">
                    <div class="line"></div>
                    <div class="text">问题详情</div>
                </div>
                <div class="detail-title">{{ dealContent.title?`题干：${dealContent.title}`:'' }}</div>
                <div class="detail-title">{{ dealContent.answer?`处理意见：${dealContent.answer}`:'' }}</div>
            </template>
        </x-form>
    </div>
</template>

<script>
import { getDealContent } from '@/server/auto_respond/execution_list.js'
import mixinPanel from '../../common/mixinPanel'
import mixinXcrud from '../../common/mixinXcrud'
export default {
    mixins: [mixinPanel, mixinXcrud],
    props: {
        disabled: {
            type: Boolean,
            default: true
        },
        processInstanceId: {
            type: String,
            default: ''
        },
        users: {
            type: Array,
            required: true
        },
        groups: {
            type: Array,
            required: true
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
                    {
                        xType: 'select',
                        name: 'mission',
                        size: 'mini',
                        label: '人工任务类型',
                        filterable: true,
                        rules: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
                        dic: { data: _this.missionList, label: 'name', value: 'id' },
                        disabled: _this.disabled
                    },
                    {
                        xType: 'input',
                        name: 'affirmContent',
                        size: 'mini',
                        label: '确认内容',
                        maxlength: 20,
                        rules: [{ required: true, message: '请输入', trigger: ['blur'] }],
                        show: _this.formData.mission == 1,
                        disabled: _this.disabled
                    },
                    {
                        xType: 'input',
                        name: 'taskContent',
                        size: 'mini',
                        label: '任务内容',
                        maxlength: 20,
                        rules: [{ required: true, message: '请输入', trigger: ['blur'] }],
                        show: _this.formData.mission == 2,
                        disabled: _this.disabled
                    },
                    {
                        slot: 'dutyPeople'
                    },
                    // {
                    //     xType: 'select',
                    //     name: 'dutyPeople',
                    //     size: 'mini',
                    //     label: '责任人',
                    //     filterable: true,
                    //     rules: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
                    //     dic: { data: _this.dutyPeopleList, label: 'chineseName', value: 'id' }
                    // },
                    {
                        xType: 'select',
                        name: 'priority',
                        size: 'mini',
                        label: '优先级',
                        rules: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
                        dic: { data: _this.priorityList, label: 'name', value: 'id' },
                        show: _this.formData.mission == 1,
                        disabled: _this.disabled
                    },
                    {
                        xType: 'input',
                        maxlength: 200,
                        type: 'textarea',
                        name: 'describe',
                        size: 'mini',
                        label: '描述',
                        disabled: _this.disabled
                    },
                    {
                        xType: 'datePicker',
                        type: 'datetime',
                        name: 'tillTime',
                        size: 'mini',
                        label: '截止时间',
                        valueFormat: 'yyyy-MM-dd HH:mm:ss',
                        disabled: _this.disabled
                    },
                    {
                        slot: 'titleInfo',
                        show: _this.formData.mission == 2
                    },
                    {
                        xType: 'input',
                        name: 'question',
                        size: 'mini',
                        maxlength: 50,
                        label: '问题题干',
                        rules: [{ required: true, message: '请输入', trigger: ['blur'] }],
                        show: _this.formData.mission == 2 && !_this.disabled,
                        disabled: _this.disabled
                    },
                    {
                        slot: 'option',
                        show: _this.formData.mission == 2
                    },
                    {
                        slot: 'detail'
                    }
                ]
            }
        }
    },
    watch: {
        'formData.mission': function(val, oldVal) {
            if (val === '') val = ''
            let documentation = JSON.parse(this.formData.documentation)
            documentation.mission = val || 1
            this.formData.documentation = JSON.stringify(documentation)
            this.updateProperties({ 'camunda:mission': val })
        },
        'formData.affirmContent': function(val, oldVal) {
            if (val === '') val = ''
            let documentation = JSON.parse(this.formData.documentation)
            documentation.affirmContent = val || ''
            this.formData.documentation = JSON.stringify(documentation)
            this.updateProperties({ 'camunda:affirmContent': val })
        },
        'formData.taskContent': function(val, oldVal) {
            if (val === '') val = ''
            let documentation = JSON.parse(this.formData.documentation)
            documentation.taskContent = val || ''
            this.formData.documentation = JSON.stringify(documentation)
            this.updateProperties({ 'camunda:taskContent': val })
        },
        'addData.dutyPeople': function(val, oldVal) {
            if (val === '') val = ''
            let documentation = JSON.parse(this.formData.documentation)
            documentation.dutyPeople = val || ''
            this.formData.documentation = JSON.stringify(documentation)
            this.updateProperties({ 'camunda:dutyPeople': val })
        },
        'formData.priority': function(val, oldVal) {
            if (val === '') val = '1'
            let documentation = JSON.parse(this.formData.documentation)
            documentation.priority = val || ''
            this.formData.documentation = JSON.stringify(documentation)
            this.updateProperties({ 'camunda:priority': val })
        },
        'formData.describe': function(val, oldVal) {
            if (val === '') val = ''
            let documentation = JSON.parse(this.formData.documentation)
            documentation.describe = val || ''
            this.formData.documentation = JSON.stringify(documentation)
            this.updateProperties({ 'camunda:describe': val })
        },
        'formData.tillTime': function(val, oldVal) {
            if (val === '') val = ''
            let documentation = JSON.parse(this.formData.documentation)
            documentation.tillTime = val || ''
            this.formData.documentation = JSON.stringify(documentation)
            this.updateProperties({ 'camunda:tillTime': val })
        },
        'formData.question': function(val, oldVal) {
            if (val === '') val = ''
            let documentation = JSON.parse(this.formData.documentation)
            documentation.question = val || ''
            this.formData.documentation = JSON.stringify(documentation)
            this.updateProperties({ 'camunda:question': val })
        },
        'inputData.optionList': {
            deep: true,
            handler(newValue, oldValue) {
                let documentation = JSON.parse(this.formData.documentation)
                documentation.optionList = newValue
                this.formData.documentation = JSON.stringify(documentation)
                this.updateProperties({ 'camunda:optionList': JSON.stringify(newValue) })
            }
        }
    },
    mounted() {
        this.updateProperties({ 'camunda:priority': '1' })
        this.formData.taskListener = [
            {
                $type: 'camunda:TaskListener',
                event: 'create',
                class: 'com.boot.base.common.util.scriptflow.ScriptTaskCreateListener'
            },
            {
                $type: 'camunda:TaskListener',
                event: 'complete',
                class: 'com.boot.base.common.util.scriptflow.ScriptTaskCompleteListener'
            }
        ]
        this.updateElement()
    },
    created() {
        this.dutyPeopleList = this.$getsessionStorage('dutyPeopleList')
        const cache = {
            ...this.element.businessObject,
            ...this.element.businessObject.$attrs
        }
        this.updateProperties({ 'camunda:taskType': 2 })
        // 移除camunda前缀，格式化数组
        for (const key in cache) {
            if (key.indexOf('camunda:') === 0) {
                const newKey = key.replace('camunda:', '')
                cache[newKey] = cache[key]
                delete cache[key]
            }
        }
        console.log(cache, '这个啥事')
        /* 审批会签节点注入后台变量*/
        this.formData.candidateUsers = '${' + this.element.id + '_users}'
        this.updateProperties({ 'camunda:candidateUsers': this.formData.candidateUsers })
        let documentation = {
            id: cache.id,
            mission: cache.mission ? cache.mission : 1,
            dutyPeople: cache.dutyPeople ? cache.dutyPeople : '',
            describe: cache.describe ? cache.describe : '',
            tillTime: cache.tillTime ? cache.tillTime : '',
            type: 2
        }
        if (this.disabled) {
            this.nodeId = cache.id
            this.getDealContentData()
        }
        if (cache.mission == 1) {
            documentation.affirmContent = cache.affirmContent ? cache.affirmContent : ''
            documentation.priority = cache.priority ? cache.priority : '1'
            // documentation = {
            //     affirmContent: cache.affirmContent ? cache.affirmContent : '',
            //     priority: cache.priority ? cache.priority : ''
            // }
        } else if (cache.mission == 2) {
            documentation.taskContent = cache.taskContent && cache.mission == 2 ? cache.taskContent : ''
            documentation.question = cache.question ? cache.question : ''
            documentation.optionList = cache.optionList ? cache.optionList : this.inputData.optionList
            // documentation = {
            //     taskContent: cache.taskContent && cache.mission == 2 ? cache.taskContent : '',
            //     question: cache.question ? cache.question : '',
            //     optionList: cache.optionList ? cache.optionList : this.inputData.optionList
            // }
        }

        cache.documentation = JSON.stringify(documentation)
        this.formData = cache
        this.addData.dutyPeople = cache.dutyPeople ? cache.dutyPeople : ''
        this.inputData.optionList = cache.optionList ? JSON.parse(cache.optionList) : this.inputData.optionList
    },
    data() {
        return {
            nodeId: '',
            dealContent: {},
            addData: {
                dutyPeople: ''
            },
            inputData: {
                optionList: [
                    {
                        option: ''
                    }
                ]
            },
            mission: '',
            formData: {
                candidateUsers: '',
                mission: 1,
                taskListener: []
            },
            dutyPeopleList: [],
            priorityList: [
                {
                    id: '1',
                    name: '高'
                },
                {
                    id: '2',
                    name: '中'
                },
                {
                    id: '3',
                    name: '低'
                },
                {
                    id: '4',
                    name: '紧急'
                }
            ],
            missionList: [
                {
                    id: '1',
                    name: '确认类'
                },
                {
                    id: '2',
                    name: '判断类'
                }
            ]
        }
    },
    methods: {
        getDealContentData() {
            let data = {
                queryData: {},
                paramsData: {
                    type: 1,
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
        // 注入任务监听
        updateElement() {
            if (this.formData.taskListener?.length) {
                let extensionElements = this.element.businessObject.get('extensionElements')
                if (!extensionElements) {
                    extensionElements = this.modeler.get('moddle').create('bpmn:ExtensionElements')
                }
                // 清除旧值
                extensionElements.values = extensionElements.values?.filter(item => item.$type !== 'camunda:TaskListener') ?? []
                this.formData.taskListener.forEach(item => {
                    const taskListener = this.modeler.get('moddle').create('camunda:TaskListener')
                    taskListener.event = item.event
                    taskListener.class = item.class
                    extensionElements.get('values').push(taskListener)
                })
                this.updateProperties({ extensionElements: extensionElements })
            } else {
                const extensionElements = this.element.businessObject.extensionElements
                if (extensionElements) {
                    extensionElements.values = extensionElements.values?.filter(item => item.$type !== 'camunda:TaskListener') ?? []
                }
            }
        },
        addFields() {
            this.inputData.optionList.push(
                {
                    option: ''
                }
            )
        },
        deleteFields(index) {
            this.inputData.optionList.splice(index, 1)
        }
    }
}
</script>

<style scoped lang="scss">
.wrapper {
    .base-info {
        .cell {
            margin-bottom: 16px;
            .cell-label {
                width: 80px;
                font-size: 12px;
                text-align: left;
                line-height: 20px;
                color: rgba(0,0,0,0.60);
                margin-bottom: 8px;
                .verify {
                    font-size: 12px;
                    line-height: 20px;
                    color: red;
                }
            }
        }

    }
    .title-info {
        margin-bottom: 18px;
        .line {
            width: 4px;
            height: 18px;
            border-radius: 4px;
            background-color: #387DEE;
            margin-right: 8px;
        }
        .text {
            font-size: 14px;
            color: rgba(0,0,0,0.90);
            line-height: 18px;
        }
    }
    .detail-title {
        font-size: 12px;
        color: #606266;
        line-height: 18px;
    }
    .btn {
        width: 280px;
        height: 28px;
        line-height: 28px;
        font-size: 12px;
        color: #0052D9;
        text-align: center;
        background: rgba(56,125,238,0.05);
        border: 1px dashed rgba(56,125,238,1);
        border-radius: 4px;
    }
}
</style>
