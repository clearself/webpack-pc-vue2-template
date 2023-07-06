<template>
    <div class="wrapper">
        <x-form ref="xForm" v-model="formData" :config="formConfig">
            <template #addSlot>
                <div class="ub ub-pj ub-ac" style="margin-top: 20px">
                    <p style="font-size: 12px;color:#606266">这个任务需要做什么</p>
                    <el-dropdown trigger="click">
                        <span class="el-dropdown-link" style="font-size: 12px;color:#606266">
                            添加<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown" style="width: 100px!important;">
                            <el-dropdown-item :disabled="!!warn.find(item=> {return item.type==0})" style="padding: 0 10px!important;font-size:12px" @click.native="dialogName = 'autoWarningDialog'">提醒</el-dropdown-item>
                            <el-dropdown-item :disabled="!!warn.find(item=> {return item.type==1})" style="padding: 0 10px!important;font-size:12px" @click.native="dialogName = 'autoFieldDialog'">字段变更</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </template>
            <template #warnSlot>
                <div class="warn-wrapper">
                    <div class="ub ub-pj ub-ac">
                        <p style="font-size: 12px;color:#387dee">提醒</p>
                        <p>
                            <i class="iconfont icon-bianji" style="font-size: 12px;color:#387dee;cursor: pointer;margin-right: 4px" @click="dialogName = 'autoWarningDialog'"></i>
                            <i class="iconfont icon-guanbi" style="font-size: 12px;color:#387dee;cursor: pointer" @click="deleteWarnItem"></i>
                        </p>
                    </div>
                    <div>
                        <p class="warn-top">提醒方式：</p>
                        <p class="warn-body">{{show_warn_type}}</p>
                        <p class="warn-top">提醒人员范围：</p>
                        <p class="warn-body">{{show_warn_user}}</p>
                        <p class="warn-top">提醒内容：</p>
                        <p class="warn-body" v-html="show_warn_mes"></p>
                    </div>
                </div>
            </template>
            <template #fieldSlot>
                <div class="field-wrapper">
                    <div class="ub ub-pj ub-ac">
                        <p style="font-size: 12px;color: #387dee">字段变更</p>
                        <p>
                            <i class="iconfont icon-bianji" style="font-size: 12px;color: #387dee;cursor: pointer;margin-right: 4px" @click="dialogName = 'autoFieldDialog'"></i>
                            <i class="iconfont icon-guanbi" style="font-size: 12px;color: #387dee;cursor: pointer" @click="deleteFieldItem"></i>
                        </p>
                    </div>
                    <div v-html="show_field"></div>
                </div>
            </template>
        </x-form>
        <autoWarning
            v-if="dialogName === 'autoWarningDialog'"
            :element="element"
            :modeler="modeler"
            :usersName="usersName"
            :warnItem="warn.find(item=> {return item.type==0})"
            @close="finishAddWarn"
            @getNewWarnSet="getNewWarnSet"
        />
        <autoFields
            v-if="dialogName === 'autoFieldDialog'"
            :element="element"
            :fieldItem="warn.find(item=> {return item.type==1})"
            :modeler="modeler"
            @close="finishAddField"
            @getNewFieldSet="getNewFieldSet"
        />
    </div>
</template>

<script>
import mixinPanel from '../../common/mixinPanel'
import mixinXcrud from '../../common/mixinXcrud'
import autoWarning from './property/autoWarning'
import autoFields from './property/autoFields'

export default {
    components: {
        autoWarning,
        autoFields
    },
    mixins: [mixinPanel, mixinXcrud],
    props: {
        users: {
            type: Array,
            required: true
        },
        groups: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            userTypeOption: [
                { label: '指定人员', value: 'assignee' },
                { label: '候选人员', value: 'candidateUsers' },
                { label: '候选组', value: 'candidateGroups' }
            ],
            dialogName: '',
            autoWarningDialog: false,
            autoFieldDialog: false,
            executionListenerLength: 0,
            taskListenerLength: 0,
            hasMultiInstance: false,
            formData: {},
            warn: [],
            usersName: []
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
                        size: 'mini',
                        label: '节点名称'
                    },
                    {
                        xType: 'input',
                        size: 'mini',
                        type: 'textarea',
                        name: 'des',
                        label: '节点描述',
                        placeholder: '请输入',
                        show: !!_this.showConfig.des
                    },
                    {
                        slot: 'addSlot'
                    },
                    {
                        slot: 'warnSlot',
                        show: !!this.warn.find(item => { return item.type == 0 })
                    },
                    {
                        slot: 'fieldSlot',
                        show: !!this.warn.find(item => { return item.type == 1 })
                    }
                ]
            }
        },
        show_warn_type() {
            console.log(this.warn)
            let data = this.warn.find(item => { return item.type == 0 })
            let type
            let str = ''
            console.log(data)
            if (data) {
                data.data.type.forEach(item => {
                    if (item == 0) {
                        str += '站内消息、'
                    } else if (item == 1) {
                        str += '邮件、'
                    } else if (item == 2) {
                        str += '短信、'
                    } else if (item == 3) {
                        str += '蓝信、'
                    }
                })
            }
            (str[str.length - 1] === '、') && (str = str.slice(0, str.length - 1))
            return str
        },
        show_warn_user() {
            let str = ''
            if (this.usersName.length) {
                this.usersName.forEach(item => {
                    if (item !== '流程相关') {
                        item = JSON.parse(item)
                    }
                    if (item.type == 0) {
                        str += item.chineseName + '、'
                    } else if (item.type == 1) {
                        str += item.name + '、'
                    } else if (item.type == 2) {
                        str += item.roleName + '、'
                    } else if (item.type == 3) {
                        str += item.name + '、'
                    } else if (item == '流程相关') {
                        str += item + '、'
                    }
                })
            }
            (str[str.length - 1] === '、') && (str = str.slice(0, str.length - 1))
            return str
        },
        show_warn_mes() {
            let data = this.warn.find(item => { return item.type == 0 })
            return data?.data?.mes
        },
        show_field() {
            let data = this.warn.find(item => { return item.type == 1 })
            let type
            let str = ''
            console.log(data)
            let alarmList = this.$getsessionStorage('alarmList') || []

            if (data) {
                data.data.forEach(item => {
                    let name = alarmList.find(it => it.value == item.field)
                    str += `<div class="field-item">
                            <span class="warn-body">${name?.label || item.field}</span>
                            <span class="warn-top">变更为</span>
                            <span class="warn-body">${item.value}</span>
                            </div>`
                })
            }
            return str
        }
    },
    watch: {
        'formData.des': function(val, oldVal) {
            if (val === '') val = ''
            console.log(this.formData)
            let documentation = JSON.parse(this.formData.documentation)
            documentation.des = val || ''
            this.formData.documentation = JSON.stringify(documentation)
            this.updateProperties({ 'camunda:des': val })
        },
        warn: function(val) {
            if (val === '') val = null
            console.log(val)
            let documentation = JSON.parse(this.formData.documentation)
            documentation.warn = val ? this.$deepCopy(val) : []
            if (documentation.warn.length) {
                let item = documentation.warn.filter(item => item.type == 0)
                console.log(item[0])
                if (item.length) {
                    item[0].data.mes = item[0].data.mes.replace(/<[^>]*>|<\/[^>]*>/gm, '')
                    item[0].data.title = item[0].data.title.replace(/<[^>]*>|<\/[^>]*>/gm, '')
                }
            }
            this.formData.documentation = JSON.stringify(documentation)
            this.updateProperties({ 'camunda:warn': JSON.stringify(val) })
        },
        usersName: function(val) {
            if (val === '') val = []
            console.log(val)
            this.updateProperties({ 'camunda:usersName': JSON.stringify(val) })
        }
    },
    created() {
        console.log(this.element.businessObject)
        const cache = {
            ...this.element.businessObject,
            ...this.element.businessObject.$attrs
        }
        // cache.documentation = this.getDocumentation();
        console.log('cache11111', cache)
        this.updateProperties({ 'camunda:taskType': 3 })

        // 移除camunda前缀，格式化数组
        for (const key in cache) {
            if (key.indexOf('camunda:') === 0) {
                const newKey = key.replace('camunda:', '')
                cache[newKey] = cache[key]
                delete cache[key]
            }
        }
        for (const key in cache) {
            if (key === 'candidateUsers') {
                cache.userType = 'candidateUsers'
                cache[key] = cache[key]?.split(',') || []
            } else if (key === 'candidateGroups') {
                cache.userType = 'candidateGroups'
                cache[key] = cache[key]?.split(',') || []
            } else if (key === 'assignee') {
                cache.userType = 'assignee'
            }
        }
        // cache.taskType = 0;
        /* 注意避免操作同一对象*/
        let copyWarn = cache.warn ? JSON.parse(cache.warn) : []
        if (copyWarn.length) {
            let item = copyWarn.filter(item => item.type == 0)
            if (item.length) {
                item[0].data.mes = item[0].data.mes.replace(/<[^>]*>|<\/[^>]*>/gm, '')
                item[0].data.title = item[0].data.title.replace(/<[^>]*>|<\/[^>]*>/gm, '')
            }
        }
        let documentation = {
            id: cache.id,
            type: cache.taskType ? cache.taskType : '',
            des: cache.des ? cache.des : '',
            warn: cache.warn ? copyWarn : []
        }

        cache.documentation = JSON.stringify(documentation)
        this.formData = cache
        console.log(typeof cache.documentation)
        this.warn = cache.warn ? JSON.parse(cache.warn) : []
        this.usersName = cache.usersName ? JSON.parse(cache.usersName) : []
        this.computedExecutionListenerLength()
        this.computedTaskListenerLength()
        this.computedHasMultiInstance()
        this.updateEventClass()
    },
    methods: {
        //
        updateEventClass() {
            this.updateProperties({ 'camunda:class': 'com.boot.base.common.util.scriptflow.ScriptCallExternalSystemDelegate' })
        },
        // 获取新的提醒字段配置
        getNewWarnSet(obj) {
            console.log('obj', obj)
            let newObj = this.$deepCopy(obj)
            // 提醒状态为0，字段1
            if (newObj.type === 'warn') {
                let arr = this.warn.filter(item => {
                    return item.type == 1
                })
                arr.push({
                    type: 0,
                    data: {
                        type: newObj.val.type,
                        mes: newObj.val.mes,
                        title: newObj.val.title,
                        users: newObj.val.users
                    }
                })
                this.warn = arr
                this.usersName = newObj.val.usersName
            }
            console.log('this.warn', this.warn)
        },
        deleteWarnItem() {
            let arr = this.warn.filter(item => {
                return item.type != 0
            })
            this.warn = arr || []
            this.usersName = []
        },
        // 获取新的字段变更配置
        getNewFieldSet(obj) {
            console.log('obj', obj)
            let newObj = this.$deepCopy(obj)
            // 提醒状态为0，字段1
            if (newObj.type === 'field') {
                let arr = this.warn.filter(item => {
                    return item.type == 0
                })
                arr.push({
                    type: 1,
                    data: newObj.val.fieldsList
                })

                this.warn = arr
            }
            console.log('this.warn', this.warn)
        },
        deleteFieldItem() {
            let arr = this.warn.filter(item => {
                return item.type != 1
            })
            this.warn = arr || []
        },
        computedExecutionListenerLength() {
            this.executionListenerLength = this.element.businessObject.extensionElements?.values
                ?.filter(item => item.$type === 'camunda:ExecutionListener').length ?? 0
        },
        computedTaskListenerLength() {
            this.taskListenerLength = this.element.businessObject.extensionElements?.values
                ?.filter(item => item.$type === 'camunda:TaskListener').length ?? 0
        },
        computedHasMultiInstance() {
            if (this.element.businessObject.multiInstanceLoopCharacteristics) {
                this.hasMultiInstance = true
            } else {
                this.hasMultiInstance = false
            }
        },
        finishExecutionListener() {
            if (this.dialogName === 'executionListenerDialog') {
                this.computedExecutionListenerLength()
            }
            this.dialogName = ''
        },
        finishTaskListener() {
            if (this.dialogName === 'taskListenerDialog') {
                this.computedTaskListenerLength()
            }
            this.dialogName = ''
        },
        finishMultiInstance() {
            if (this.dialogName === 'multiInstanceDialog') {
                this.computedHasMultiInstance()
            }
            this.dialogName = ''
        },
        finishAddWarn() {
            this.dialogName = ''
        },
        finishAddField() {
            this.dialogName = ''
        }
    }
}
</script>

<style scoped lang="scss">
.wrapper ::v-deep .el-dropdown-link {
    cursor: pointer;
    color: #00c0ff;
}
.wrapper ::v-deep .el-icon-arrow-down {
    font-size: 12px;
}
.wrapper ::v-deep .warn-wrapper {
    box-sizing: border-box;
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 10px;
    margin-top: 10px;
    background-color: rgba(56, 125, 238, 0.05);
    border-radius: 2px;
    color: #606266;

    & p {
        font-size: 12px;
        margin: 5px 0;

        &.warn-top {
            color: #606266;
        }
        &.warn-body {
            color: #606266;
            opacity: .6;
            word-break: break-all;
        }
    }

}
.wrapper ::v-deep .field-wrapper {
    padding: 10px;
    box-sizing: border-box;
    margin-top: 10px;
    background-color: rgba(56, 125, 238, 0.05);
    border-radius: 2px;

    & p {
        font-size: 12px;
        margin: 5px 0;
    }
    .field-item {
        span {
            font-size: 12px;
        }
        & .warn-top {
            color: #606266;
            opacity: .6;
        }
        & .warn-body {
            color: #606266;
            word-break: break-all;
        }
    }

}
</style>
