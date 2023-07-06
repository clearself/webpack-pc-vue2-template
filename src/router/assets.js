import demo from '@/pages/assets/topo/graph'
const Layout = () => import('@/layout')
const assets_overview = () =>
    import('@/pages/assets/overview.vue')
const assets_asset_info = () =>
    import('@/pages/assets/asset_info.vue')
const assets_net_segment = () =>
    import('@/pages/assets/net_segment.vue')
const assets_found = () =>
    import('@/pages/assets/assets_found.vue')
const assets_asset_type = () =>
    import('@/pages/assets/asset_type.vue')
const assets_topology = () =>
    import('@/pages/assets/topology.vue')
const assets_mapping = () =>
    import('@/pages/assets/mapping.vue')
const assets_system = () =>
    import('@/pages/assets/system.vue')
const assets_asset_store = () =>
    import('@/pages/assets/asset_store.vue')
const assets_img = () =>
    import('@/pages/assets/img.vue')
const assets_add_tmap_before = () =>
    import('@/pages/assets/add_tmap_before.vue')
const assets_find = () =>
    import('@/pages/assets/assets_find.vue')

export default [
    {
        path: '/assets',
        name: 'assets',
        component: Layout,
        meta: {
            title: '资产中心'
        },
        redirect: '/assets/assets_overview',
        children: [

            {
                path: 'assets_overview',
                name: 'assets_overview',
                component: assets_overview,
                meta: {
                    title: '资产概览'
                }
            }, {
                path: 'assets_asset_info',
                name: 'assets_asset_info',
                component: assets_asset_info,
                meta: {
                    title: '资产库'
                }
            },
            {
                path: 'assets_net_segment',
                name: 'assets_net_segment',
                component: assets_net_segment,
                meta: {
                    title: '网段管理'
                }
            },
            {
                path: 'assets_found',
                name: 'assets_found',
                component: assets_found,
                meta: {
                    title: '无主资产库'
                }
            },
            {
                path: 'assets_type',
                name: 'assets_asset_type',
                component: assets_asset_type,
                meta: {
                    title: '资产配置'
                }
            },
            {
                path: 'assets_topology',
                name: 'assets_topology',
                component: assets_topology,
                meta: {
                    title: '安全域管理'
                }
            },
            {
                path: 'assets_mapping',
                name: 'assets_mapping',
                component: assets_mapping,
                meta: {
                    title: '映射管理'
                }
            },
            {
                path: 'assets_system',
                name: 'assets_system',
                component: assets_system,
                meta: {
                    title: '业务系统库'
                }
            },
            {
                path: 'assets_asset_store',
                name: 'assets_asset_store',
                component: assets_asset_store,
                meta: {
                    title: ''
                }
            },
            {
                path: 'assets_img',
                name: 'assets_img',
                component: assets_img,
                meta: {
                    title: '拓扑管理'
                }
            },
            {
                path: 'assets_add_tmap_before',
                name: 'assets_add_tmap_before',
                component: assets_add_tmap_before,
                meta: {
                    title: '选择资产'
                }
            },
            {
                path: 'assets_topo',
                name: 'demo',
                component: demo,
                meta: {
                    title: '拓扑图'
                }
            },
            {
                path: 'assets_find',
                name: 'assets_find',
                component: assets_find,
                meta: {
                    title: '无主资产库'
                }
            }
        ]
    }
]
