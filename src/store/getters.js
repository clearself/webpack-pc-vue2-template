const getters = {
    layoutModeSettings: state => state.settings.layoutModeSettings,
    themeSettings: state => state.settings.themeSettings,
    navCollapseSettings: state => state.settings.navCollapseSettings,
    logoAddress: state => state.common.logoAddress,
    systemName: state => state.common.systemName,
    per: state => state.user.per,
    dict: state => state.common.dict,
    orgInfo: state => state.common.orgInfo
}
export default getters
