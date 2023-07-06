// import variables from '@/styles/element-variables.scss'
import defaultSettings from '@/settings'
import { setlocalStorage, getlocalStorage } from '@/assets/js/public_fun.js'

const { layoutModeSettings, navCollapseSettings, themeSettings } = defaultSettings

const state = {
    layoutModeSettings: layoutModeSettings,
    navCollapseSettings: navCollapseSettings,
    themeSettings: themeSettings
}

const mutations = {
    changeSetting: (state, { key, value }) => {
        // eslint-disable-next-line no-prototype-builtins
        if (state.hasOwnProperty(key)) {
            state[key] = value
        }
        if (['layoutModeSettings', 'navCollapseSettings', 'themeSettings'].includes(key)) {
            /* 同步到本地*/
            let initInfo = getlocalStorage('initInfo')
            if (key === 'layoutModeSettings') {
                let layoutObj = {
                    default: 1,
                    left: 2,
                    top: 3
                }
                initInfo.theme.style = layoutObj[value]
            } else if (key === 'themeSettings') {
                let colorObj = {
                    default: 1,
                    dark: 2,
                    purple: 3,
                    star: 4
                }
                initInfo.theme.color = colorObj[value]
            } else if (key === 'navCollapseSettings') {
                initInfo.theme.navCollapseSettings = value
            }
            setlocalStorage('initInfo', initInfo)
            console.log('布局同步成功')
        }
    }
}

const actions = {}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
