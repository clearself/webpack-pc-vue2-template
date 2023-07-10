import { getlocalStorage, setlocalStorage } from '@/assets/js/public_fun'

const state = {
    logoAddress: '',
    systemName: '',
    dict: {},
    orgInfo: {}
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
    },
    addDict: (state, val) => {
        let key = val.key
        state.dict[key] = val.data
    },
    setOrg: (state, val) => {
        state.orgInfo = val
    }
}
const actions = {}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
