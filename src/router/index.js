import Vue from 'vue'
import Router from 'vue-router'
import login from './login'
import common from './common'
import system from './system'
// import assets from './assets'
import data_manage from './data_manage'
// import work_platform from './work_platform'

// import works_order from './works_order'
// import intelligence from './intelligence'
// import alarm from './alarm'
// import stream_data_center from './stream_data_center'
// import rule from './rule'
// import linkage from './linkage'
// import leak from './leak'
// import defense_drill from '@/router/defense_drill'
// import protect_net from '@/router/protect_net'
// import version from '@/router/version'
// 上报
import data_report from './data_report'

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
        // ...assets,
        ...data_manage,
        // ...work_platform,
        // ...intelligence,
        // ...alarm,
        // ...works_order,
        // ...stream_data_center,
        // ...rule,
        // ...linkage,
        // ...leak,
        // ...defense_drill,
        // ...protect_net,
        // ...version,
        ...data_report
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
