import Vue from 'vue'
import Vuex from 'vuex'
import getters from '@store/getters'
/* 以下代码可使用require.context*/
import common from '@store/modules/common'
import settings from '@store/modules/settings'
import user from '@store/modules/user'
import referee from '@/store/modules/referee'
import vueXAlong from 'vuex-along'
Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        common,
        settings,
        user,
        referee
    },
    state: {},
    mutations: {

    },
    actions: {},
    getters,
    plugins: [vueXAlong({
        name: 'along',
        local: true,
        session: { list: [], isFilter: false }
    })]
})
