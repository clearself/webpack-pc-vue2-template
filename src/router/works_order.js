const Layout = () => import('@/layout')
const work_object = () =>
    import('@/pages/works_order/work_object.vue')
const work_template = () =>
    import('@/pages/works_order/work_template.vue')
const work_base = () =>
    import('@/pages/works_order/workFlow/work_base.vue')
const work_config = () =>
    import('@/pages/works_order/workFlow/work_config.vue')
const work_task = () =>
    import('@/pages/works_order/work_task.vue')
const work_task_detail = () =>
    import('@/pages/works_order/work_task_detail.vue')
const all_work_task = () =>
    import('@/pages/works_order/all_work_task.vue')
const all_work_task_detail = () =>
    import('@/pages/works_order/all_work_task_detail.vue')
// const statistical_order = () =>
//     import('@/pages/works_order/statistical_order.vue')
// const word_overview = () =>
//     import('@/pages/works_order/overview.vue')
const work_tab_statistics = () =>
    import('@/pages/works_order/tab_statistics.vue')

export default [
    {
        path: '/works_order',
        name: 'works_order',
        component: Layout,
        meta: {
            title: '系统管理'
        },
        redirect: '/works_order/work_template',
        children: [
            {
                path: 'work_template',
                name: 'work_template',
                component: work_template,
                meta: {
                    title: '工单模板'
                }
            },
            {
                path: 'work_base',
                name: 'work_base',
                component: work_base,
                meta: {
                    title: '工单基本信息',
                    guidePath: true,
                    jumpPath: '/works_order/work_template'
                }
            },
            {
                path: 'work_config',
                name: 'work_config',
                component: work_config,
                meta: {
                    title: '配置流程信息',
                    guidePath: true,
                    jumpPath: '/works_order/work_template'
                }
            },
            {
                path: 'all_work_task',
                name: 'all_work_task',
                component: all_work_task,
                meta: {
                    title: '所有工单'
                }
            },
            {
                path: 'all_work_task_detail',
                name: 'all_work_task_detail',
                component: all_work_task_detail,
                meta: {
                    title: '工单详情',
                    guidePath: true,
                    jumpPath: '/works_order/all_work_task'
                }
            },
            {
                path: 'work_task',
                name: 'work_task',
                component: work_task,
                meta: {
                    title: '工单任务'
                }
            },
            {
                path: 'work_task_detail',
                name: 'work_task_detail',
                component: work_task_detail,
                meta: {
                    title: '工单任务详情',
                    guidePath: true,
                    jumpPath: '/works_order/work_task'
                }
            },
            {
                path: 'work_object',
                name: 'work_object',
                component: work_object,
                meta: {
                    title: '工单对象'
                }
            },
            {
                path: 'work_tab_statistics',
                name: 'work_tab_statistics',
                component: work_tab_statistics,
                meta: {
                    title: '工单统计'
                }
            }
        ]
    }
]
// export default [
//     {
//         path: 'word_overview',
//         name: 'word_overview',
//         component: word_overview,
//         meta: {
//             title: '工单统计'
//         }
//     },
//     {
//         path: 'work_tab_statistics',
//         name: 'work_tab_statistics',
//         component: work_tab_statistics,
//         meta: {
//             title: '工单统计'
//         }
//     },
//     {
//         path: 'work_object',
//         name: 'work_object',
//         component: work_object,
//         meta: {
//             title: '自定义对象管理'
//         }
//     },
//     {
//         path: 'work_template',
//         name: 'work_template',
//         component: work_template,
//         meta: {
//             title: '工单模板'
//         }
//     },
//     {
//         path: 'work_task_detail',
//         name: 'work_task_detail',
//         component: work_task_detail,
//         meta: {
//             title: '工单任务详情',
//             guidePath: true,
//             jumpPath: '/home/work_task'
//         }
//     },

//     {
//         path: 'work_template/work_base',
//         name: 'work_base',
//         component: work_base,
//         meta: {
//             title: '工单基本信息',
//             guidePath: true,
//             jumpPath: '/home/work_template'
//         }
//     },
//     {
//         path: 'work_template/work_config',
//         name: 'work_config',
//         component: work_config,
//         meta: {
//             title: '配置流程信息',
//             guidePath: true,
//             jumpPath: '/home/work_template'
//         }
//     },
//     {
//         path: 'work_task',
//         name: 'work_task',
//         component: work_task,
//         meta: {
//             title: '工单任务'
//         }
//     },
//     {
//         path: 'all_work_task',
//         name: 'all_work_task',
//         component: all_work_task,
//         meta: {
//             title: '所有工单'
//         }
//     },
//     {
//         path: 'work_statistical_order',
//         name: 'work_statistical_order',
//         component: statistical_order,
//         meta: {
//             title: '工单统计'
//         }
//     },
//     {
//         path: 'all_work_task_detail',
//         name: 'all_work_task_detail',
//         component: all_work_task_detail,
//         meta: {
//             title: '所有工单详情',
//             guidePath: true,
//             jumpPath: '/home/all_work_task'
//         }
//     }
// ]
