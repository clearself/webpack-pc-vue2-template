const Layout = () => import('@/layout')
const region = () =>
    import('@/pages/protect_net/region.vue')
const team = () =>
    import('@/pages/protect_net/team.vue')
const organization = () =>
    import('@/pages/protect_net/organization.vue')
const fightSchedule = () =>
    import('@/pages/protect_net/fightSchedule.vue')
const ruleStandard = () =>
    import('@/pages/protect_net/ruleStandard.vue')
const ruleDetail = () =>
    import('@/pages/protect_net/ruleDetail.vue')
const baseTask = () =>
    import('@/pages/protect_net/base_task.vue')
const task_add = () =>
    import('@/pages/protect_net/tasks/add.vue')
const task_edit = () =>
    import('@/pages/protect_net/tasks/edit.vue')
const task_detail = () =>
    import('@/pages/protect_net/tasks/detail.vue')
const recycle = () =>
    import('@/pages/protect_net/recycle.vue')
const myTask = () =>
    import('@/pages/protect_net/myTask.vue')
const myTask_inner = () =>
    import('@/pages/protect_net/myTask_inner.vue')
const time_set = () =>
    import('@/pages/protect_net/time_set.vue')
const chat_set = () =>
    import('@/pages/protect_net/chat_set.vue')
const defense_set = () =>
    import('@/pages/protect_net/defense_set.vue')
export default [
    {
        path: '/protect',
        name: 'protect',
        component: Layout,
        meta: {
            title: '指挥调度'
        },
        redirect: '/protect/defense_set',
        children: [
            {
                path: 'defense_set',
                name: 'defense_set',
                component: defense_set,
                meta: {
                    title: '告警规则设置'
                }
            },
            {
                path: 'chat_set',
                name: 'chat_set',
                component: chat_set,
                meta: {
                    title: '交流大厅数据源配置'
                }
            },
            {
                path: 'time_set',
                name: 'time_set',
                component: time_set,
                meta: {
                    title: '时间设置'
                }
            },
            {
                path: 'baseTask',
                name: 'baseTask',
                component: baseTask,
                meta: {
                    title: '基线任务'
                }
            },
            {
                path: 'task_detail',
                name: 'task_detail',
                component: task_detail,
                meta: {
                    title: '基线任务处理',
                    guidePath: true,
                    jumpPath: '/home/baseTask'
                }
            },
            {
                path: 'task_edit',
                name: 'task_edit',
                component: task_edit,
                meta: {
                    title: '编辑任务',
                    guidePath: true,
                    jumpPath: '/home/baseTask'
                }
            },
            {
                path: 'task_add',
                name: 'task_add',
                component: task_add,
                meta: {
                    title: '新建任务',
                    guidePath: true,
                    jumpPath: '/home/ruleStandard'
                }
            },
            {
                path: 'myTask',
                name: 'myTask',
                component: myTask,
                meta: {
                    title: '我的任务'
                }
            },
            {
                path: 'myTask_inner',
                name: 'myTask_inner',
                component: myTask_inner,
                meta: {
                    title: '我的任务',
                    guidePath: true,
                    jumpPath: '/home/myTask'
                }
            },
            {
                path: 'region',
                name: 'region',
                component: region,
                meta: {
                    title: '作战室布置'
                }
            },
            {
                path: 'team',
                name: 'team',
                component: team,
                meta: {
                    title: '团队管理'
                }
            },
            {
                path: 'organization',
                name: 'organization',
                component: organization,
                meta: {
                    title: '组织架构列表'
                }
            },
            {
                path: 'fightSchedule',
                name: 'fightSchedule',
                component: fightSchedule,
                meta: {
                    title: '排班(列表视图)'
                }
            },
            {
                path: 'ruleStandard',
                name: 'ruleStandard',
                component: ruleStandard,
                meta: {
                    title: '工作规范纪律'
                }
            },
            {
                path: 'ruleDetail',
                name: 'ruleDetail',
                component: ruleDetail,
                meta: {
                    title: '规则规范纪律',
                    guidePath: true,
                    jumpPath: '/home/ruleStandard'
                }
            },
            {
                path: 'recycle',
                name: 'recycle',
                component: recycle,
                meta: {
                    title: '回收站'
                }
            }
        ]
    }
]
