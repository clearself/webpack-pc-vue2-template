const Layout = () => import('@/layout')
const rule_simulation = () =>
    import('@/pages/rule/simulation_data.vue')
const rule_resource_list = () =>
    import('@/pages/rule/resource_list.vue')
const rule_new_rules_type = () =>
    import('@/pages/rule/new_rules_type.vue')
const rule_cep_show = () =>
    import('@/pages/rule/cep_show.vue')
export default [
    {
        path: '/rule',
        name: 'rule',
        component: Layout,
        meta: {
            title: '规则管理'
        },
        redirect: '/rule/rule_new_rules_type',
        children: [
            {
                path: 'rule_simulation',
                name: 'rule_simulation',
                component: rule_simulation,
                meta: {
                    title: '模拟数据'
                }
            },
            {
                path: 'rule_resource_list',
                name: 'rule_resource_list',
                component: rule_resource_list,
                meta: {
                    title: '资源池管理'
                }
            },
            {
                path: 'rule_new_rules_type',
                name: 'rule_new_rules_type',
                component: rule_new_rules_type,
                meta: {
                    title: '分析规则管理'
                }
            },
            {
                path: 'rule_cep_show',
                name: 'rule_cep_show',
                component: rule_cep_show,
                meta: {
                    title: '分析规则列表'
                    // guidePath: true,
                    // jumpPath: '/rule/rule_new_rules_type'
                }
            }
        ]
    }
]
