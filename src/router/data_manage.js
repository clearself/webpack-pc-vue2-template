const Layout = () => import('@/layout')
const data_manage_new_search = () =>
    import('@/pages/data_manage/new_search/index.vue')
const data_manage_data_classify = () =>
    import('@/pages/data_manage/data_classify/index.vue')
const data_manage_data_classify_add = () =>
    import('@/pages/data_manage/data_classify/data_classify_add.vue')
const data_manage_data_tag = () =>
    import('@/pages/data_manage/data_tag/index.vue')
const data_manage_data_attr = () =>
    import('@/pages/data_manage/data_attr/index.vue')
const data_manage_data_analysis = () =>
    import('@/pages/data_manage/data_analysis/index.vue')
const data_manage_data_analysis_add = () =>
    import('@/pages/data_manage/data_analysis/add_rule.vue')
const data_manage_data_access = () =>
    import('@/pages/data_manage/data_access/index.vue')
const data_manage_data_access_add = () =>
    import('@/pages/data_manage/data_access/data_access_add.vue')
const data_manage_alarm_log = () =>
    import('@/pages/alarm_log/new_search/index.vue')
const data_manage_log_config = () =>
    import('@/pages/data_manage/log_config/index.vue')
// export default [
//     {
//         path: 'data_manage_new_search',
//         name: 'data_manage_new_search',
//         component: data_manage_new_search,
//         meta: {
//             title: '新日志检索'
//         }
//     },
//     {
//         path: 'data_manage_demo',
//         name: 'data_manage_demo',
//         component: data_manage_demo,
//         meta: {
//             title: 'demo'
//         }
//     }
// ]
export default [
    {
        path: '/data_manage',
        name: 'data_manage',
        component: Layout,
        meta: {
            title: '数据中心'
        },
        redirect: '/data_manage/new_search',
        // redirect: '/system/page'
        children: [
            {
                path: 'log_config',
                name: 'data_manage_log_config',
                component: data_manage_log_config,
                meta: {
                    title: '日志配置'
                }
            },
            {
                path: 'data_alarm_log',
                name: 'data_manage_alarm_log',
                component: data_manage_alarm_log,
                meta: {
                    title: '告警查询'
                }
            },
            {
                path: 'log_search',
                name: 'data_manage_new_search',
                component: data_manage_new_search,
                meta: {
                    title: '日志查询'
                }
            },
            {
                path: 'data_access',
                name: 'data_manage_data_access',
                component: data_manage_data_access,
                meta: {
                    title: '数据接入'
                }
            },
            {
                path: 'data_manage_data_access_add',
                name: 'data_manage_data_access_add',
                component: data_manage_data_access_add,
                meta: {
                    title: '新建接入'
                }
            },
            {
                path: 'data_analysis',
                name: 'data_manage_data_analysis',
                component: data_manage_data_analysis,
                meta: {
                    title: '数据解析'
                }
            },
            {
                path: 'data_manage_data_analysis_add',
                name: 'data_manage_data_analysis_add',
                component: data_manage_data_analysis_add,
                meta: {
                    title: '新建规则'
                }
            },
            {
                path: 'data_attr',
                name: 'data_manage_data_attr',
                component: data_manage_data_attr,
                meta: {
                    title: '数据属性'
                }
            },
            {
                path: 'data_classify',
                name: 'data_manage_data_classify',
                component: data_manage_data_classify,
                meta: {
                    title: '数据分类'
                }
            },
            {
                path: 'data_tag',
                name: 'data_manage_data_tag',
                component: data_manage_data_tag,
                meta: {
                    title: '数据标签'
                }
            },
            {
                path: 'data_manage_data_classify_add',
                name: 'data_manage_data_classify_add',
                component: data_manage_data_classify_add,
                meta: {
                    title: '数据分类添加'
                }
            }
        ]
    }
]
