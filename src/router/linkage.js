const Layout = () => import('@/layout')
const linkage_nft = () =>
    import('@/pages/linkage/nft.vue')
const linkage_time_config = () =>
    import('@/pages/linkage/time_config.vue')
const linkage_tar = () =>
    import('@/pages/linkage/tar.vue')
const linkage_tar_over_view = () =>
    import('@/pages/linkage/tar_over_view.vue')
export default [
    {
        path: '/linkage',
        name: 'linkage',
        component: Layout,
        meta: {
            title: '规则管理'
        },
        redirect: '/linkage/linkage_nft',
        children: [
            {
                path: 'linkage_nft',
                name: 'linkage_nft',
                component: linkage_nft,
                meta: {
                    title: 'NFT'
                }
            },
            {
                path: 'linkage_time_config',
                name: 'linkage_time_config',
                component: linkage_time_config,
                meta: {
                    title: '时间配置'
                }
            },
            {
                path: 'linkage_tar',
                name: 'linkage_tar',
                component: linkage_tar,
                meta: {
                    title: 'TAR'
                }
            },
            {
                path: 'linkage_tar_over_view',
                name: 'linkage_tar_over_view',
                component: linkage_tar_over_view,
                meta: {
                    title: 'TAR概览'
                }
            }
        ]
    }
]
