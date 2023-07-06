const Layout = () => import('@/layout')
const script_arrange = () =>
    import('@/pages/auto_respond/script_arrange/index.vue')
const script_base = () =>
    import('@/pages/auto_respond/script_arrange/script_base.vue')
const script_config = () =>
    import('@/pages/auto_respond/script_arrange/script_config.vue')
const test = () =>
    import('@/pages/auto_respond/test/index.vue')
const execution_list = () => import('@/pages/auto_respond/execution_list/index.vue')
const action_manage = () => import('@/pages/auto_respond/action_manage/index.vue')
const application_linkage = () => import('@/pages/auto_respond/application_linkage/index.vue')
const application_detail = () => import('@/pages/auto_respond/application_linkage/detail.vue')
export default [{
    path: '/auto_respond',
    name: 'auto_respond',
    component: Layout,
    meta: {
        title: '自动化响应'
    },
    redirect: '/auto_respond/script_arrange',
    children: [{
        path: 'script_arrange',
        name: 'script_arrange',
        component: script_arrange,
        meta: {
            title: '剧本编排'
        }
    },
    {
        path: 'action_manage',
        name: 'action_manage',
        component: action_manage,
        meta: {
            title: '动作管理'
        }
    },
    {
        path: 'application_detail',
        name: 'application_detail',
        component: application_detail,
        meta: {
            title: '详情'
        }
    },
    {
        path: 'application_linkage',
        name: 'application_linkage',
        component: application_linkage,
        meta: {
            title: '应用联动'
        }
    },
    {
        path: 'script_base',
        name: 'script_base',
        component: script_base,
        meta: {
            title: '基本信息'
        }
    },
    {
        path: 'script_config',
        name: 'script_config',
        component: script_config,
        meta: {
            title: '流程配置'
        }
    },
    {
        path: 'execution_list',
        name: 'execution_list',
        component: execution_list,
        meta: {
            title: '执行列表'
        }
    },
    {
        path: 'test',
        name: 'test',
        component: test,
        meta: {
            title: '剧本编排1'
        }
    }
    ]
}]
