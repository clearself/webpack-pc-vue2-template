const Layout = () => import('@/layout')
const rule_tab_alarm_config = () =>
    import('@/pages/alarm/tab_alarm_config.vue')
const asset_analysis = () =>
    import('@/pages/alarm/asset_analysis.vue')
const attack_analysis = () =>
    import('@/pages/alarm/attack_analysis.vue')
const alarm_list = () =>
    import('@/pages/alarm/alarm_list.vue')
const fire_line = () =>
    import('@/pages/alarm/fire_line/index.vue')
const flow_analysis = () =>
    import('@/pages/alarm/flow_analysis/index.vue')
export default [
    {
        path: '/alarm',
        name: 'alarm',
        component: Layout,
        meta: {
            title: '分析中心'
        },
        redirect: '/alarm/alarm_tab_alarm_config',
        children: [
            {
                path: 'alarm_config',
                name: 'alarm_onfig',
                component: rule_tab_alarm_config,
                meta: {
                    title: '事件配置'
                }
            },
            {
                path: 'alarm_asset_analysis',
                name: 'alarm_asset_analysis',
                component: asset_analysis,
                meta: {
                    title: '受害资产分析'
                }
            },
            {
                path: 'alarm_attack_analysis',
                name: 'alarm_attack_analysis',
                component: attack_analysis,
                meta: {
                    title: '攻击者分析'
                }
            },
            {
                path: 'alarm_list',
                name: 'alarm_list',
                component: alarm_list,
                meta: {
                    title: '告警分析'
                }
            },
            {
                path: 'fire_line',
                name: 'fire_line',
                component: fire_line,
                meta: {
                    title: '防火线'
                }
            },
            {
                path: 'flow_analysis',
                name: 'flow_analysis',
                component: flow_analysis,
                meta: {
                    title: '流量分析'
                }
            }
        ]
    }
]
