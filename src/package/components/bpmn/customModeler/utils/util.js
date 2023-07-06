// 静态文件路径
import start from '../../../../images/start.png'
import end from '../../../../images/end.png'
import auto from '../../../../images/auto.png'
import business from '../../../../images/business.png'
import userTask from '../../../../images/shenpi.png'
import signTask from '../../../../images/joinSing.png'
import exclusiveGateway from '../../../../images/bingxing.png'
import branch from '../../../../images/branch.png'
import border from '../../../../images/border.png'; const customElements = ['bpmn:StartEvent', 'bpmn:EndEvent', 'bpmn:ServiceTask', 'bpmn:UserTask', 'bpmn:BoundaryEvent', 'bpmn:TimerEventDefinition', 'bpmn:BusinessRuleTask', 'bpmn:ExclusiveGateway', 'bpmn:ParallelGateway', 'bpmn:DataObjectReference'] // 自定义元素的类型
const STATICPATH = '@/package/images/'

const customConfig = { // 自定义元素的配置
    'bpmn:StartEvent': {
        field: 'start',
        url: start,
        title: '开始节点',
        attr: { x: 0, y: 0, width: 40, height: 40 }
    },
    'bpmn:EndEvent': {
        field: 'end',
        url: end,
        title: '结束节点',
        attr: { x: 0, y: 0, width: 40, height: 40 }
    },
    'bpmn:SequenceFlow': {
        field: 'flow',
        title: '连接线'
    },
    'bpmn:ServiceTask': {
        field: 'rules',
        url: auto,
        title: '自动节点',
        attr: { x: 0, y: 0, width: 100, height: 34 }
    },
    'bpmn:UserTask0': {
        field: 'rules',
        url: userTask,
        title: '审批',
        attr: { x: 0, y: 0, width: 48, height: 48 }
    },
    'bpmn:BoundaryEvent': {
        field: 'rules',
        url: border,
        title: '边界',
        attr: { x: 0, y: 0, width: 40, height: 40 }
    },
    'bpmn:TimerEventDefinition': {
        field: 'rules',
        url: auto,
        title: '',
        attr: { x: 0, y: 0, width: 40, height: 34 }
    },
    'bpmn:UserTask1': {
        field: 'rules',
        url: signTask,
        title: '会签',
        attr: { x: 0, y: 0, width: 48, height: 48 }
    },
    'bpmn:UserTask2': {
        field: 'rules',
        url: business,
        title: '业务',
        attr: { x: 0, y: 0, width: 100, height: 34 }
    },
    'bpmn:ExclusiveGateway': {
        field: 'decision',
        url: branch,
        title: '分支',
        attr: { x: 0, y: 0, width: 48, height: 48 }
    },
    'bpmn:ParallelGateway': {
        field: 'decision',
        url: exclusiveGateway,
        title: '并行',
        attr: { x: 0, y: 0, width: 48, height: 48 }
    },
    'bpmn:DataObjectReference': {
        field: 'score',
        title: '变量',
        attr: { x: 0, y: 0, width: 48, height: 48 }
    }
}
const getTimerElement = (vm) => {
    vm.modeler.get('moddle').create('bpmn:TimerEventDefinition', { id: Date.now() })
}
const hasLabelElements = ['bpmn:StartEvent', 'bpmn:EndEvent', 'bpmn:ExclusiveGateway', 'bpmn:ParallelGateway', 'bpmn:BoundaryEvent', 'bpmn:DataObjectReference', 'bpmn:Group'] // 一开始就有label标签的元素类型

const flowAction = {
    type: 'global-connect-tool',
    action: ['bpmn:SequenceFlow', 'tools', 'icon-custom icon-custom-flow', '连接线']
}
const customShapeAction = [{
    type: 'create.start-event',
    action: ['bpmn:StartEvent', 'event', 'icon-custom icon-custom-start', '开始', { name: '开始' }]
},
{
    type: 'create.end-event',
    action: ['bpmn:EndEvent', 'event', 'icon-custom icon-custom-end', '结束', { name: '结束' }]
},
// {
//     type: 'create.boundary-event',
//     action: ['bpmn:BoundaryEvent', 'event', 'icon-custom icon-custom-boundaryEvent', '边界',{cancelActivity:false}]
// },
{
    type: 'create.task',
    action: ['bpmn:ServiceTask', 'activity', 'icon-custom icon-custom-task', '自动', { name: '自动', 'camunda:taskType': 3 }]
},
{
    type: 'create.businessRule',
    action: ['bpmn:UserTask', 'activity', 'icon-custom icon-custom-businessRule', '业务', { name: '业务', 'camunda:taskType': 2 }]
},
{
    type: 'create.user-task',
    action: ['bpmn:UserTask', 'activity', 'icon-custom icon-custom-user-task', '审批', { name: '审批', 'camunda:taskType': 0 }]
},
{
    type: 'create.sign-task',
    action: ['bpmn:UserTask', 'activity', 'icon-custom icon-custom-sign-task', '会签', { name: '会签', 'camunda:taskType': 1 }]
},
{
    type: 'create.exclusive-gateway',
    action: ['bpmn:ExclusiveGateway', 'activity', 'icon-custom icon-custom-exclusive-gateway', '分支', { name: '分支' }]
},
{
    type: 'create.parallel-gateway',
    action: ['bpmn:ParallelGateway', 'activity', 'icon-custom icon-custom-exclusive-gateway', '并行', { name: '并行' }]
},

{
    type: 'create.group',
    action: ['bpmn:Group', 'activity', 'icon-custom icon-custom-group', '阶段']
}
]
const customFlowAction = [
    flowAction
]
/**
     * 循环创建出一系列的元素
     * @param {Array} actions 元素集合
     * @param {Object} fn 处理的函数
     */
export function batchCreateCustom(actions, fn) {
    const customs = {}
    actions.forEach(item => {
        customs[item.type] = fn(...item.action)
    })
    return customs
}

export { customElements, customConfig, STATICPATH, hasLabelElements, customShapeAction, customFlowAction }
