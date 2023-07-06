import { getlocalStorage, setlocalStorage } from '@/assets/js/public_fun'

const state = {
    logoAddress: '',
    systemName: ''
}
const mutations = {
    setLogo: (state, val) => {
        state.logoAddress = val
        let initInfo = getlocalStorage('initInfo')
        if (initInfo && initInfo.theme) {
            initInfo.theme.logoAddress = val
        }
        setlocalStorage('initInfo', initInfo)
    },
    setName: (state, val) => {
        state.systemName = val
        let initInfo = getlocalStorage('initInfo')
        if (initInfo && initInfo.theme) {
            initInfo.theme.systemName = val
        }
        setlocalStorage('initInfo', initInfo)
    }
}
const actions = {}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
