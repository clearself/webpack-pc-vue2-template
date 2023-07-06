/**
 * 存储流程设计相关参数
 */
import { getsessionStorage } from '@/assets/js/public_fun.js'
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
                action: 'create.timer-event',
                icon: 'icon-custom icon-custom-boundaryEvent',
                title: '延时'
            },
            {
                action: 'create.businessRule',
                icon: 'icon-custom icon-custom-businessRule',
                title: '人工'
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
            }
        ]
        function customUtilsData(data, arr) {
            data.forEach(group => {
                group.actions.forEach(action => {
                    arr.push({
                        action: `create.task${action.id}`,
                        icon: 'icon-custom icon-custom-task',
                        title: action.name
                    })
                })
            })
        }
        let data = getsessionStorage('customAutoList')
        if (data) {
            customUtilsData(data, this.controls)
        }
    }

    //  获取控件配置信息
    getControl(action) {
        const result = this.controls.filter(item => item.action === action)
        return result[0] || {}
    }
}
