const Layout = () => import('@/layout')
const UserList = () => import('@/pages/system/user/List')
const ThemeManage = () => import('@/pages/system/theme_manage/index.vue')
const SecurityPolicy = () => import('@/pages/system/security_policy/index.vue')
const ModulesManage = () => import('@/pages/system/modules_manage/index.vue')
const RoleManage = () => import('@/pages/system/role_manage/index.vue')
const Department = () => import('@/pages/system/department/index.vue')
const LogAudit = () => import('@/pages/system/log_audit/index.vue')
const Upgrade = () => import('@/pages/system/upgrade/index.vue')
const SystemParams = () => import('@/pages/system/system_params/index.vue')
const AssetUsers = () => import('@/pages/system/asset_users/index.vue')
const AdConfig = () => import('@/pages/system/asset_users/ad_config.vue')
const sysMonitoring = () => import('@/pages/system/sysMonitoring/index.vue')
const sysDetail = () => import('@/pages/system/sysMonitoring/sysDetail.vue')
const PowerManage = () => import('@/pages/system/power_manage/index.vue')
export default [
    {
        path: '/system',
        name: 'system',
        component: Layout,
        meta: {
            title: '系统管理'
        },
        redirect: '/system/user',
        // redirect: '/system/page'
        children: [
            {
                path: 'log_audit',
                name: 'log_audit',
                component: LogAudit,
                meta: {
                    title: '日志审计'
                }
            },
            {
                path: 'department',
                name: 'department',
                component: Department,
                meta: {
                    title: '部门管理'
                }
            },
            {
                path: 'user',
                name: 'user',
                component: UserList,
                meta: {
                    title: '用户管理'
                }
            },
            {
                path: 'theme_manage',
                name: 'theme_manage',
                component: ThemeManage,
                meta: {
                    title: '主题管理'
                }
            },
            {
                path: 'security_policy',
                name: 'security_policy',
                component: SecurityPolicy,
                meta: {
                    title: '安全策略'
                }
            },
            {
                path: 'modules_manage',
                name: '模块管理',
                component: ModulesManage,
                meta: {
                    title: '模块管理'
                }

            },
            {
                path: 'role_manage',
                name: 'role_manage',
                component: RoleManage,
                meta: {
                    title: '角色管理'
                }
            },
            {
                path: 'upgrade',
                name: 'upgrade',
                component: Upgrade,
                meta: {
                    title: '升级管理'
                }
            },
            {
                path: 'system_params',
                name: 'system_params',
                component: SystemParams,
                meta: {
                    title: '基础输出配置'
                }
            },
            {
                path: 'asset_users',
                name: 'asset_users',
                component: AssetUsers,
                meta: {
                    title: '资产用户管理'
                }
            },
            {
                path: 'ad_config',
                name: 'ad_config',
                component: AdConfig,
                meta: {
                    title: 'AD域同步配置'
                }
            },
            {
                path: 'sysMonitoring',
                name: 'sysMonitoring',
                component: sysMonitoring,
                meta: {
                    title: '系统监控'
                }
            },
            {
                path: 'sysMonitoring/sysDetail',
                name: 'sysDetail',
                component: sysDetail,
                meta: {
                    title: '系统监控详情',
                    guidePath: true,
                    jumpPath: '/system/sysMonitoring'
                }
            },
            {
                path: 'power_manage',
                name: 'power_manage',
                component: PowerManage,
                meta: {
                    title: '授权管理'
                }
            }
        ]
    }
]
