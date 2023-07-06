// 静态文件路径
import start from '../../../../images/start.png'
import end from '../../../../images/end.png'
import auto from '../../../../images/auto.png'
import business from '../../../../images/business.png'
import userTask from '../../../../images/shenpi.png'
import signTask from '../../../../images/joinSing.png'
import exclusiveGateway from '../../../../images/bingxing.png'
import branch from '../../../../images/branch.png'
import border from '../../../../images/border.png'

import { getsessionStorage } from '@/assets/js/public_fun.js'

function customUtils(data, arr) {
    data.forEach(group => {
        group.actions.forEach(action => {
            arr.push({
                type: `create.task${action.id}`,
                action: ['bpmn:ServiceTask', `custom${group.id}`, 'icon-custom icon-custom-task', action.name, {
                    name: action.name,
                    'camunda:taskType': action.id
                }]
            })
        })
    })
}
// console.log(getsessionStorage('customAutoList'))
const customElements = ['bpmn:StartEvent', 'bpmn:EndEvent', 'bpmn:ServiceTask', 'bpmn:UserTask', 'bpmn:BoundaryEvent',
    'bpmn:TimerEventDefinition', 'bpmn:BusinessRuleTask', 'bpmn:ExclusiveGateway', 'bpmn:ParallelGateway',
    'bpmn:DataObjectReference', 'bpmn:IntermediateCatchEvent'
] // 自定义元素的类型
const STATICPATH = '@/package/images/'

const customConfig = { // 自定义元素的配置
    'bpmn:StartEvent': {
        field: 'start',
        url: start,
        title: '开始节点',
        attr: {
            x: 0,
            y: 0,
            width: 40,
            height: 40
        }
    },
    'bpmn:EndEvent': {
        field: 'end',
        url: end,
        title: '结束节点',
        attr: {
            x: 0,
            y: 0,
            width: 40,
            height: 40
        }
    },
    'bpmn:SequenceFlow': {
        field: 'flow',
        title: '连接线'
    },
    'bpmn:ServiceTask': {
        field: 'rules',
        url: auto,
        title: '自动节点',
        attr: {
            x: 0,
            y: 0,
            width: 100,
            height: 34
        }
    },
    'bpmn:UserTask0': {
        field: 'rules',
        url: userTask,
        title: '审批',
        attr: {
            x: 0,
            y: 0,
            width: 48,
            height: 48
        }
    },
    'bpmn:BoundaryEvent': {
        field: 'rules',
        url: border,
        title: '边界',
        attr: {
            x: 0,
            y: 0,
            width: 40,
            height: 40
        }
    },
    'bpmn:IntermediateCatchEvent': {
        field: 'rules',
        url: border,
        title: '延时',
        attr: {
            x: 0,
            y: 0,
            width: 40,
            height: 34
        }
    },
    'bpmn:UserTask1': {
        field: 'rules',
        url: signTask,
        title: '会签',
        attr: {
            x: 0,
            y: 0,
            width: 48,
            height: 48
        }
    },
    'bpmn:UserTask2': {
        field: 'rules',
        url: business,
        title: '业务',
        attr: {
            x: 0,
            y: 0,
            width: 100,
            height: 34
        }
    },
    'bpmn:ExclusiveGateway': {
        field: 'decision',
        url: branch,
        title: '分支',
        attr: {
            x: 0,
            y: 0,
            width: 48,
            height: 48
        }
    },
    'bpmn:ParallelGateway': {
        field: 'decision',
        url: exclusiveGateway,
        title: '并行',
        attr: {
            x: 0,
            y: 0,
            width: 48,
            height: 48
        }
    },
    'bpmn:DataObjectReference': {
        field: 'score',
        title: '变量',
        attr: {
            x: 0,
            y: 0,
            width: 48,
            height: 48
        }
    }
}
const getTimerElement = (vm) => {
    vm.modeler.get('moddle').create('bpmn:TimerEventDefinition', {
        id: Date.now()
    })
}
const hasLabelElements = ['bpmn:StartEvent', 'bpmn:EndEvent', 'bpmn:ExclusiveGateway', 'bpmn:ParallelGateway',
    'bpmn:BoundaryEvent', 'bpmn:DataObjectReference', 'bpmn:Group', 'bpmn:IntermediateCatchEvent'
] // 一开始就有label标签的元素类型

const flowAction = {
    type: 'global-connect-tool',
    action: ['bpmn:SequenceFlow', 'tools', 'icon-custom icon-custom-flow', '连接线']
}
const customShapeAction = [
    {
        type: 'create.start-event',
        action: ['bpmn:StartEvent', 'event', 'icon-custom icon-custom-start', '开始', {
            name: '开始'
        }]
    },
    {
        type: 'create.end-event',
        action: ['bpmn:EndEvent', 'event', 'icon-custom icon-custom-end', '结束', {
            name: '结束'
        }]
    },
    {
        type: 'create.timer-event',
        action: ['bpmn:IntermediateCatchEvent', 'event', 'icon-custom icon-custom-boundaryEvent', '延时', {
            name: '延时'
        }]
    },
    {
        type: 'create.businessRule',
        action: ['bpmn:UserTask', 'activity', 'icon-custom icon-custom-businessRule', '人工', { name: '人工', 'camunda:taskType': 2 }]
    },
    {
        type: 'create.exclusive-gateway',
        action: ['bpmn:ExclusiveGateway', 'activity', 'icon-custom icon-custom-exclusive-gateway', '分支', {
            name: '分支'
        }]
    },
    {
        type: 'create.parallel-gateway',
        action: ['bpmn:ParallelGateway', 'activity', 'icon-custom icon-custom-exclusive-gateway', '并行', {
            name: '并行'
        }]
    }
]
// let data = getsessionStorage('customAutoList') || []
// let data = getsessionStorage('customAutoList') || []
// console.log('执行获取customAutoList逻辑', data)
// customUtils(data, customShapeAction)
const refeshCustomShapeAction = () => {
    let data = getsessionStorage('customAutoList') || []
    console.log('执行获取customAutoList逻辑', data)
    customUtils(data, customShapeAction)
}
refeshCustomShapeAction()
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
    console.log(customs)
    return customs
}

export {
    refeshCustomShapeAction,
    customElements,
    customConfig,
    STATICPATH,
    hasLabelElements,
    customShapeAction,
    customFlowAction
}
