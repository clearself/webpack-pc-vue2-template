const Layout = () => import('@/layout')
const work_platform = () =>
    import('@/pages/work_platform/work_platform.vue')
export default [
    {
        path: '/work_platform',
        name: 'work_platform',
        component: Layout,
        meta: {
            title: '工作台'
        },
        redirect: '/work_platform/work_platform',
        children: [
            {
                path: 'work_platform',
                name: 'work_platform',
                component: work_platform,
                meta: {
                    title: '工作台'
                }
            }
        ]
    }
]
