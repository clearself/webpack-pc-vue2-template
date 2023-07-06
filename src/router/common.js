// 帮助手册
import help from './help'
const Layout = () => import('@/layout')
const errorPage = () => import('@/pages/common/Error.vue')
const NoPer = () => import('@/pages/common/NoPer.vue')
const help_manual = () => import('@/pages/help_manual')
export default [
    {
        path: '/layout',
        name: 'layout',
        component: Layout,
        meta: {
            title: ''
        }
    },
    {
        path: '/error',
        name: 'error',
        component: errorPage,
        meta: {
            title: '系统出错了'
        }
    },
    {
        path: '/help_manual',
        name: 'help_manual',
        component: help_manual,
        children: [
            ...help
        ]
    },
    {
        path: '/inner',
        name: 'inner',
        component: Layout,
        children: [
            {
                path: 'no_per',
                name: 'no_per',
                component: NoPer,
                meta: {
                    title: '无权限'
                }
            }
        ]
    }
]
