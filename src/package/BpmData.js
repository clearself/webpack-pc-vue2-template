/**
 * 存储流程设计相关参数
 */
export default class BpmData {
    constructor() {
        this.controls = [] // 设计器控件
        this.init()
    }

    init() {
        this.controls = [
            {
                action: 'create.start-event',
                icon: 'icon-custom icon-custom-start',
                title: '开始'
            },
            {
                action: 'create.end-event',
                icon: 'icon-custom icon-custom-end',
                title: '结束'
            },
            {
                action: 'create.exclusive-gateway',
                icon: 'icon-custom icon-custom-exclusive-gateway',
                title: '分支'
            },
            {
                action: 'create.parallel-gateway',
                icon: 'icon-custom icon-custom-exclusive-gateway',
                title: '并行'
            },
            {
                action: 'create.task',
                icon: 'icon-custom icon-custom-task',
                title: '自动'
            },
            {
                action: 'create.businessRule',
                icon: 'icon-custom icon-custom-businessRule',
                title: '业务'
            },
            {
                action: 'create.user-task',
                icon: 'icon-custom icon-custom-user-task',
                title: '审批'
            },
            {
                action: 'create.sign-task',
                icon: 'icon-custom icon-custom-sign-task',
                title: '会签'
            },
            {
                action: 'create.group',
                icon: 'icon-custom icon-custom-group',
                title: '阶段'
            }
        ]
    }

    //  获取控件配置信息
    getControl(action) {
        const result = this.controls.filter(item => item.action === action)
        return result[0] || {}
    }
}
