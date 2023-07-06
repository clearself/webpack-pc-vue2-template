/**
 * A palette that allows you to create BPMN _and_ custom elements.
 */

import { customShapeAction, customFlowAction, batchCreateCustom } from '../utils/util'
export default function PaletteProvider(palette, create, elementFactory, globalConnect, bpmnFactory) {
    this.create = create
    this.elementFactory = elementFactory
    this.globalConnect = globalConnect
    this.bpmnFactory = bpmnFactory
    palette.registerProvider(this)
}

PaletteProvider.$inject = [
    'palette',
    'create',
    'elementFactory',
    'globalConnect',
    'bpmnFactory'
]

PaletteProvider.prototype.getPaletteEntries = function(element) {
    var actions = {}
    const {
        create,
        elementFactory,
        globalConnect,
        bpmnFactory
    } = this

    function createConnect(type, group, className, title, options) {
        return {
            group,
            className,
            title: '新增' + title,
            action: {
                click: function(event) {
                    globalConnect.toggle(event)
                }
            }
        }
    }

    function createAction(type, group, className, title, options) {
        function createListener(event) {
            const businessObject = bpmnFactory.create(type, options)
            // var shape = elementFactory.createShape(Object.assign({ type }, businessObject))
            var shape = elementFactory.createShape({ type, businessObject })
            create.start(event, shape)
        }

        return {
            group,
            // className,
            title: '新增' + title,
            action: {
                dragstart: createListener,
                click: createListener
            }
        }
    }
    Object.assign(actions, {
        ...batchCreateCustom(customFlowAction, createConnect), // 线
        ...batchCreateCustom(customShapeAction, createAction)
    })
    return actions
}
