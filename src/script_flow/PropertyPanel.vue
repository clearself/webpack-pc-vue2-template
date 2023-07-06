<template>
    <div ref="propertyPanel" class="property-panel">
        <div v-if="nodeName" class="node-name"><i></i><span>{{ nodeName }}</span></div>
        <component
            :is="getComponent"
            v-if="element"
            :element="element"
            :modeler="modeler"
            :users="users"
            :disabled="disabled"
            :processInstanceId="processInstanceId"
            :groups="groups"
            :categorys="categorys"
        />
    </div>
</template>

<script>
import delayPanel from './components/nodePanel/delayPanel'
import customPanel from './components/nodePanel/customPanel'
import taskPanel from './components/nodePanel/task'
import signPanel from './components/nodePanel/sign'
import startEndPanel from './components/nodePanel/startEnd'
import processPanel from './components/nodePanel/process'
import sequenceFlowPanel from './components/nodePanel/sequenceFlow'
import gatewayPanel from './components/nodePanel/gateway'
import stage from './components/nodePanel/stage'
import boundary from './components/nodePanel/boundary'
import noUser from './components/nodePanel/noUser'
import auto from './components/nodePanel/auto'
import business from './components/nodePanel/business'
import artificialPanel from './components/nodePanel/artificialPanel'
import { NodeName } from './lang/zh'

export default {
    name: 'PropertyPanel',
    components: { processPanel, taskPanel, signPanel, startEndPanel, sequenceFlowPanel, gatewayPanel, stage, boundary, noUser, auto, business, customPanel, delayPanel, artificialPanel },
    props: {
        processInstanceId: {
            type: String,
            default: ''
        },
        disabled: {
            type: Boolean,
            default: true
        },
        users: {
            type: Array,
            required: true
        },
        groups: {
            type: Array,
            required: true
        },
        categorys: {
            type: Array,
            required: true
        },
        modeler: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            element: null,
            elementId: '',
            form: {
                id: '',
                name: '',
                color: null
            },
            roles: [
                { value: 'manager', label: '经理' },
                { value: 'personnel', label: '人事' },
                { value: 'charge', label: '主管' }
            ]
        }
    },
    computed: {
        getComponent() {
            const type = this.element.type
            console.log('type', type)
            // 'bpmn:IntermediateThrowEvent',
            let taskType = this.element['camunda:taskType'] ?? this.element.businessObject.$attrs['camunda:taskType']
            if (['bpmn:StartEvent', 'bpmn:EndEvent'].includes(type)) {
                return 'startEndPanel'
            } else if (type === 'bpmn:UserTask' && (taskType == 2)) {
                return 'artificialPanel'
            } else if (type === 'bpmn:UserTask' && (taskType == 1)) {
                return 'signPanel'
            } else if (type === 'bpmn:UserTask' && (taskType == 0)) {
                return 'taskPanel'
            } else if (type === 'bpmn:SequenceFlow') {
                return 'sequenceFlowPanel'
            } else if (type === 'bpmn:Group') {
                return 'stage'
            } else if (type === 'bpmn:BoundaryEvent') {
                return 'boundary'
            } else if (type === 'bpmn:ServiceTask') {
                return 'customPanel'
            } else if (type === 'bpmn:IntermediateCatchEvent') {
                return 'delayPanel'
            } else if ([
                'bpmn:InclusiveGateway',
                'bpmn:ExclusiveGateway',
                'bpmn:ParallelGateway',
                'bpmn:EventBasedGateway'
            ].includes(type)) {
                return 'gatewayPanel'
            } else if (type === 'bpmn:Process') {
                return 'processPanel'
            }
            return 'noUser'
        },
        nodeName() {
            if (this.element) {
                console.log('this.element2222222', this.element)
                const bizObj = this.element.businessObject
                if (this.element.type === 'bpmn:BoundaryEvent') {
                    if (bizObj.eventDefinitions && bizObj.eventDefinitions[0].$type === 'bpmn:TimerEventDefinition') {
                        return NodeName[this.element.type]
                    }
                }
                let taskType = this.element['camunda:taskType'] ?? this.element.businessObject.$attrs['camunda:taskType']
                const type = bizObj?.eventDefinitions
                    ? bizObj.eventDefinitions[0].$type
                    : bizObj.$type
                if (type === 'bpmn:UserTask' && (taskType == 2)) {
                    return '人工节点'
                } else if (type === 'bpmn:UserTask' && (taskType == 0)) {
                    return '审批节点'
                } else if (type === 'bpmn:UserTask' && (taskType == 1)) {
                    return '会签节点'
                } else if (type === 'bpmn:ServiceTask') {
                    return '自定义节点'
                } else if (type === 'bpmn:IntermediateCatchEvent') {
                    return '延时节点'
                }
                return NodeName[type] || type
            }
            return ''
        }
    },
    mounted() {
        this.handleModeler()
    },
    methods: {
        handleModeler() {
            this.modeler.on('root.added', e => {
                if (e.element.type === 'bpmn:Process') {
                    this.element = null
                    this.$nextTick().then(() => {
                        this.element = e.element
                    })
                }
            })
            this.modeler.on('element.click', e => {
                const { element } = e
                if (element.type === 'bpmn:Process') {
                    this.element = element
                }
            })
            this.modeler.on('selection.changed', e => {
                // hack 同类型面板不刷新
                this.element = null
                const element = e.newSelection[0]
                if (element) {
                    this.$nextTick().then(() => {
                        console.log('element', element)
                        this.element = element
                    })
                }
            })
        }
    }
}
</script>

<style lang="scss">
.property-panel {
    padding: 20px 10px;

    // reset element css
    .el-form--label-top .el-form-item__label {
        padding: 0;
        line-height: 12px;
        margin-bottom: 8px;
    }

    .el-form-item {
        margin-bottom: 16px;
    }

    .tab-table .el-form-item {
        margin-bottom: 16px;
    }

    .node-name {
        position: relative;
    }

    .node-name span {
        display: block;
        line-height: 24px;
        margin-bottom: 10px;
        font-size: 14px;
        color: #387dee;
        padding-left: 10px;
    }

    .node-name i {
        width: 4px;
        height: 24px;
        content: ' ';
        position: absolute;
        left: 0px;
        top: 0px;
        border-radius: 3px;
        background: #387dee;
    }
}
</style>
