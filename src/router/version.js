const Layout = () => import('@/layout')
const manage = () =>
    import('@/pages/version/manage.vue')
const download = () =>
    import('@/pages/version/download.vue')
export default [
    {
        path: '/version',
        name: 'version',
        component: Layout,
        meta: {
            title: '聊天版本管理'
        },
        redirect: '/version/manage',
        children: [
            {
                path: 'manage',
                name: 'manage',
                component: manage,
                meta: {
                    title: '版本管理'
                }
            },
            {
                path: 'download',
                name: 'download',
                component: download,
                meta: {
                    title: '下载管理'
                }
            }
        ]
    }
]
