const Layout = () => import('@/layout')
const threat_detail = () =>
    import('@/pages/intelligence/threat_detail.vue')
const threat_database = () =>
    import('@/pages/intelligence/threat_database.vue')
const threat_config = () =>
    import('@/pages/intelligence/threat_config.vue')
const threat_config_list = () =>
    import('@/pages/intelligence/threat_config_list.vue')
const threat_intelligence = () =>
    import('@/pages/intelligence/threat_intelligence.vue')
export default [
    {
        path: '/intelligence',
        name: 'intelligence',
        component: Layout,
        meta: {
            title: '威胁情报'
        },
        redirect: '/intelligence/threat_database',
        children: [
            {
                path: 'threat_database',
                name: 'threat_database',
                component: threat_database,
                meta: {
                    title: '情报查询'
                }
            },
            {
                path: 'threat_detail',
                name: 'threat_detail',
                component: threat_detail,
                meta: {
                    title: '情报查询'
                }
            },
            {
                path: 'threat_intelligence',
                name: 'threat_intelligence',
                component: threat_intelligence,
                meta: {
                    title: '威胁情报库'
                }
            },
            {
                path: 'threat_config_list',
                name: 'threat_config_list',
                component: threat_config_list,
                meta: {
                    title: '采集配置'
                }
            },
            {
                path: 'threat_config',
                name: 'threat_config',
                component: threat_config,
                meta: {
                    title: '编辑采集配置'
                }
            }
        ]
    }
]
