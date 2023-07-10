import 'core-js/stable'
import 'regenerator-runtime/runtime'
import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import Element from 'element-ui'
import './assets/css/base.css'
import './assets/css/element-variables.scss'
import 'element-ui/lib/theme-chalk/index.css'
import JsonViewer from 'vue-json-viewer'
import './assets/css/common.scss'
import lodash from 'lodash'
import dataV from '@jiaminghi/data-view'

import './oldIcon/iconfontOld.css'
import './icon/iconfont.css'

import store from './store/index.js'
import Debounce from './assets/js/utils.js'

// 时间处理
import moment from 'moment'

// 自定义组件
import Components from '@/components'

// 自定义组件库
import FLYmodules from './components/modules/index.js'

// 自定义全局方法库
import PublicFun from './assets/js/exit_fun.js'

import htmlToPdf from '@/components/utils/htmlToPdf.js'

// 自定义过滤器
import filters from './assets/js/filters.js'
// 国际化
// import { i18n } from './i18n/index'

// 指令统一处理加载
import directives from './assets/js/directives.js' // 引入样式库

import VueClipBoard from 'vue-clipboard2'

// 权限指令加载
import per from '@/directive/per/index.js' // 引入样式库
// import ElFormPlus from '@springleo/el-form-plus'

// 工作流样式
import './package/css/app.css'
Vue.use(dataV)
Vue.prototype.$eventBus = new Vue()
Vue.prototype.$moment = moment
Vue.prototype.$lodash = lodash
Vue.use(JsonViewer)
Vue.use(Element)
Vue.use(per)
/* eslint-disable */
Vue.use(VueClipBoard)
Element.Dialog.props.closeOnClickModal.default = false
Vue.component('Debounce', Debounce)
Vue.use(FLYmodules)
Vue.use(PublicFun)
Vue.use(htmlToPdf)
Vue.use(Debounce)
// Vue.use(ElFormPlus)
// 过滤器统一处理加载
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})
Object.keys(directives).forEach(key => {
    Vue.directive(key, {
        bind: directives[key].bind,
        inserted: directives[key].inserted,
        update: directives[key].update,
        componentUpdated: directives[key].componentUpdated,
        unbind: directives[key].unbind
    })
})

router.afterEach(transition => {
    // console.log('查看tab名', sessionStorage.getItem('currentTabName'))
    // if (window.location.hash === '#/login') {
    //     document.title = '积极安全防御分析工具'
    //     // 防止退出登录重进时，标题闪一下
    //     sessionStorage.setItem('currentTabName', '积极安全防御分析工具')
    // } else if (window.location.hash === '#/home/work_platform') {
    //     document.title = '工作台'
    //     sessionStorage.setItem('currentTabName', '积极安全防御分析工具')
    // }
})
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    router,
    store,
    // i18n,
    render: h => h(App)
}).$mount('#app')

