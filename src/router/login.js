import { getlocalStorage } from '@/assets/js/public_fun.js'
const login = () => import('@/pages/login/index.vue')
const index = () => import('@/pages/login/login.vue')
const register = () => import('@/pages/retrieve_password/index.vue')
const expire = () => import('@/pages/expire/index.vue')
const project = getlocalStorage('project')
export default [
    {
        path: '/',
        redirect: project == 1 ? '/index' : '/login'
    },
    {
        path: '/power_expire',
        name: 'expire',
        component: expire,
        meta: {
            title: '授权过期'
        }
    },
    {
        path: '/index',
        name: 'index',
        component: index,
        meta: {
            title: '登录'
        }
    },
    {
        path: '/login',
        name: 'login',
        component: login,
        meta: {
            title: '登录'
        }
    },
    {
        path: '/retrieve_password',
        name: 'register',
        component: register,
        meta: {
            title: '重置密码'
        }
    }
]
