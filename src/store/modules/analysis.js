const state = {
    refresh_polar: 0
}
const mutations = {
    SET_REFRESH_POLAR: (state) => {
        state.refresh_polar++
    }
}
const actions = {
    refreshPolar(ctx) {
        ctx.commit('SET_REFRESH_POLAR')
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
