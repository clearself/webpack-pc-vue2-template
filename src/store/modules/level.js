const state = {
    toolTip: {
        position: 'fixed',
        show: false,
        x: '',
        y: ''
    },
    timeOut: ''
}
const mutations = {
    chooseLevel: (state) => {
        state.toolTip.x = window.event.clientX - 30
        state.toolTip.y = window.event.clientY + 30
        state.timeOut = setTimeout(() => {
            state.toolTip.show = true
        }, 110)
    },
    unchooseLevel: (state) => {
        clearTimeout(state.timeOut)
        state.toolTip.show = false
        state.toolTip.x = ''
        state.toolTip.y = ''
    },
    startLevel: (state) => {
        state.toolTip.show = false
        state.toolTip.x = ''
        state.toolTip.y = ''
    }
}
const actions = {}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
