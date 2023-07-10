/* 流数据中心*/
const Layout = () => import('@/layout')
const stream_data_center_config_manage = () =>
    import('@/pages/stream_data_center/config_manage/index.vue')
const stream_data_center_dash_board = () =>
    import('@/pages/stream_data_center/dash_board/list.vue')
const stream_data_manage_dashboard = () =>
    import('@/pages/stream_data_center/dashboard/index.vue')
const stream_data_center_one = () =>
    import('@/pages/stream_data_center/data_manage/http.vue')
const stream_data_center_dns = () =>
    import('@/pages/stream_data_center/data_manage/dns.vue')
const stream_data_center_database = () =>
    import('@/pages/stream_data_center/data_manage/database.vue')
const stream_data_center_ftp = () =>
    import('@/pages/stream_data_center/data_manage/ftp.vue')
const stream_data_center_smb = () =>
    import('@/pages/stream_data_center/data_manage/smb.vue')
const stream_data_center_mail = () =>
    import('@/pages/stream_data_center/data_manage/mail.vue')

// export default [
//     {
//         path: 'stream_data_center_config_manage',
//         name: 'stream_data_center_config_manage',
//         component: stream_data_center_config_manage,
//         meta: {
//             title: '配置管理'
//         }
//     }
// ]
export default [
    {
        path: '/stream_data_center',
        name: 'stream_data_center',
        component: Layout,
        meta: {
            title: '流数据中心'
        },
        redirect: '/stream_data_center/stream_data_center_config_manage',
        // redirect: '/system/page'
        children: [
            {
                path: 'config_manage',
                name: 'stream_data_center_config_manage',
                component: stream_data_center_config_manage,
                meta: {
                    title: '配置管理'
                }
            },
            {
                path: 'stream_data_manage_dashboard',
                name: 'stream_data_manage_dashboard',
                component: stream_data_manage_dashboard,
                meta: {
                    title: '仪表盘'
                }
            },
            {
                path: 'dash_board',
                name: 'stream_data_center_dash_board',
                component: stream_data_center_dash_board,
                meta: {
                    title: '仪表盘列表'
                }
            },
            {
                path: 'data_http',
                name: 'stream_data_center_one',
                component: stream_data_center_one,
                meta: {
                    title: 'HTTP数据检索'
                }
            },
            {
                path: 'dns',
                name: 'stream_data_center_dns',
                component: stream_data_center_dns,
                meta: {
                    title: 'DNS数据检索'
                }
            },
            {
                path: 'database',
                name: 'stream_data_center_database',
                component: stream_data_center_database,
                meta: {
                    title: '数据库数据检索'
                }
            },
            {
                path: 'ftp',
                name: 'stream_data_center_ftp',
                component: stream_data_center_ftp,
                meta: {
                    title: 'FTP数据检索'
                }
            },
            {
                path: 'smb',
                name: 'stream_data_center_smb',
                component: stream_data_center_smb,
                meta: {
                    title: 'SMB数据检索'
                }
            },
            {
                path: 'mail',
                name: 'stream_data_center_mail',
                component: stream_data_center_mail,
                meta: {
                    title: '邮件数据检索'
                }
            }
        ]
    }
]

