const help_asset_center = () =>
    import('@/pages/help_manual/help_asset_center.vue')
const help_data_center = () =>
    import('@/pages/help_manual/help_data_center.vue')
const help_rule_manage = () =>
    import('@/pages/help_manual/help_rule_manage.vue')
const help_label_manage = () =>
    import('@/pages/help_manual/help_label_manage.vue')
const help_work_order_manage = () =>
    import('@/pages/help_manual/help_work_order_manage.vue')
const help_reported_data = () =>
    import('@/pages/help_manual/help_reported_data.vue')

export default [
    // 资产中心
    {
        path: 'help_asset_center',
        name: 'help_asset_center',
        component: help_asset_center,
        meta: {
            title: '平台帮助手册'
        }
    },
    // 数据中心
    {
        path: 'help_data_center',
        name: 'help_data_center',
        component: help_data_center,
        meta: {
            title: '平台帮助手册'
        }
    },
    // 规则管理
    {
        path: 'help_rule_manage',
        name: 'help_rule_manage',
        component: help_rule_manage,
        meta: {
            title: '平台帮助手册'
        }
    },
    // 标签使用与书写
    {
        path: 'help_label_manage',
        name: 'help_label_manage',
        component: help_label_manage,
        meta: {
            title: '平台帮助手册'
        }
    },
    // 工单管理
    {
        path: 'help_work_order_manage',
        name: 'help_work_order_manage',
        component: help_work_order_manage,
        meta: {
            title: '平台帮助手册'
        }
    },
    // 上报数据
    {
        path: 'help_reported_data',
        name: 'help_reported_data',
        component: help_reported_data,
        meta: {
            title: '平台帮助手册'
        }
    }
]
