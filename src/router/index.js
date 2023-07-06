import Vue from 'vue'
import Router from 'vue-router'
import login from './login'
import common from './common'
// 系统设置
import system from './system'
// 资产中心
import assets from './assets'
// 数据中心
import data_manage from './data_manage'
// 工作台
import work_platform from './work_platform'
// 工单处置
import works_order from './works_order'
// import intelligence from './intelligence'
// 分析中心
import alarm from './alarm'
// import stream_data_center from './stream_data_center'
// 防火线规则
import rule from './rule'
// import linkage from './linkage'
// import leak from './leak'
// import defense_drill from '@/router/defense_drill'
// import protect_net from '@/router/protect_net'
// import version from '@/router/version'
// import safe_affair_manage from './safe_affair_manage'
// import dashboard from './dashboard'
// import safe_notice from './safe_notice'
// import space_fight from './space_fight'
// import large_screen from './large_screen'
// import strategy from './strategy'
// import safety_review from './safety_review'
// import auto_respond from './auto_respond'
// import report from './report'
// import defense from './defense'

Vue.use(Router)
const VueRouterReplace = Router.prototype.replace
Router.prototype.replace = function replace(to) {
    return VueRouterReplace.call(this, to).catch(err => err)
}
const VueRouterPush = Router.prototype.push
Router.prototype.push = function push(to) {
    return VueRouterPush.call(this, to).catch(err => err)
}

const router = new Router({
    routes: [
        ...login,
        ...common,
        ...system,
        ...assets,
        ...data_manage,
        ...work_platform,
        // ...intelligence,
        ...alarm,
        ...works_order,
        // ...stream_data_center,
        ...rule
        // ...linkage,
        // ...leak,
        // ...defense_drill,
        // ...protect_net,
        // ...version,
        // ...safe_affair_manage,
        // ...dashboard,
        // ...safe_notice,
        // ...space_fight,
        // ...large_screen,
        // ...strategy,
        // ...safety_review,
        // ...auto_respond,
        // ...report,
        // ...defense
    ]
})

// router.beforeEach((to, from, next) => {
//     const userInfo = Vue.prototype.$getlocalStorage('userInfo')
//     if (userInfo) {
//         if (to.meta.title) {
//             document.title = to.meta.title
//         }
//         next()
//     } else {
//         if (to.path === '/login') {
//             next()
//         } else {
//             next({
//                 path: '/login'
//             })
//         }
//     }
// })

/* addRoutes的作用注入新的路由，而不是替换其他路由,需要先清空原来的路由*/
// router.selfaddRoutes = function(params) {
//     router.matcher = new Router().matcher
//     router.addRoutes(params)
// }
export default router
