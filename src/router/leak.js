const Layout = () => import('@/layout')
const leak = () => import('@/pages/leak/leak.vue')
const engine = () => import('@/pages/leak/engine.vue')
const label = () => import('@/pages/leak/label.vue')
const loophole = () => import('@/pages/leak/loophole.vue')
// const task_edit = () => import('@/pages/leak/task_edit.vue')
// const task_add = () => import('@/pages/leak/task_add.vue')
const task = () => import('@/pages/leak/task.vue')
const leak_overview = () => import('@/pages/leak/overview.vue')

export default [
    {
        path: '/leak',
        name: 'leak',
        component: Layout,
        meta: {
            title: '脆弱性'
        },
        redirect: '/leak/leak_overview',
        children: [
            {
                path: 'leak_overview',
                name: 'leak_overview',
                component: leak_overview,
                meta: {
                    title: '漏洞概览'
                }
            },
            {
                path: 'leak_leak',
                name: 'leak_leak',
                component: leak,
                meta: {
                    title: '漏洞管理'
                }
            },
            {
                path: 'leak_loophole',
                name: 'leak_loophole',
                component: loophole,
                meta: {
                    title: '漏洞信息库'
                }
            },
            {
                path: 'leak_engine',
                name: 'leak_engine',
                component: engine,
                meta: {
                    title: '引擎管理'
                }
            },
            {
                path: 'leak_task',
                name: 'leak_task',
                component: task,
                meta: {
                    title: '任务管理'
                }
            },
            {
                path: 'leak_label',
                name: 'leak_label',
                component: label,
                meta: {
                    title: '标签管理'
                }
            }
        ]
    }
]

// export default [{
//         path: 'leak_overview',
//         name: 'leak_overview',
//         component: overview,
//         meta: {
//             title: '概览'
//         }
//     },
//     {
//         path: 'leak_leak',
//         name: 'leak_leak',
//         component: leak,
//         meta: {
//             title: '漏洞管理'
//         }
//     },
//     {
//         path: 'leak_engine',
//         name: 'leak_engine',
//         component: engine,
//         meta: {
//             title: '引擎管理'
//         }
//     },
//     {
//         path: 'leak_label',
//         name: 'leak_label',
//         component: label,
//         meta: {
//             title: '标签管理'
//         }
//     },
//     {
//         path: 'leak_loophole',
//         name: 'leak_loophole',
//         component: loophole,
//         meta: {
//             title: '漏洞信息库'
//         }
//     },
//     {
//         path: 'leak_task',
//         name: 'leak_task',
//         component: task,
//         meta: {
//             title: '任务管理'
//         }
//     },
//     {
//         path: 'leak_task/add',
//         name: 'leak_task_add',
//         component: task_add,
//         meta: {
//             title: '任务新建'
//         }
//     },
//     {
//         path: 'leak_task/edit',
//         name: 'leak_task_edit',
//         component: task_edit,
//         meta: {
//             title: '任务编辑'
//         }
//     }
// ]
