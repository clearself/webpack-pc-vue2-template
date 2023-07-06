const getters = {
    layoutModeSettings: state => state.settings.layoutModeSettings,
    themeSettings: state => state.settings.themeSettings,
    navCollapseSettings: state => state.settings.navCollapseSettings,
    logoAddress: state => state.common.logoAddress,
    systemName: state => state.common.systemName,
    per: state => state.user.per
}
export default getters
