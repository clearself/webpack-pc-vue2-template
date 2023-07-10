<template>
    <div class="container h100">
        <!--默认模式-->
        <div :class="{'default':layoutModeSettings === 'default','ub left-theme':layoutModeSettings === 'left','ub ub-ver top':layoutModeSettings === 'top'}">
            <div class="header w100 no-copy" v-if="layoutModeSettings === 'default'">
                <TopNav :type="typeDataTwo" />
            </div>

            <div class="header w100" v-if="layoutModeSettings === 'top'">
                <Topbar :menus="menuData" class="topbar-container" />
                <Breadcrumb :menuData="menuData" />
            </div>
            <div :class="{'ub ub-f1 second-view-wrapper':layoutModeSettings === 'default','ub w100':layoutModeSettings === 'left','w100':layoutModeSettings === 'top'}">
                <div class="left" v-if="layoutModeSettings === 'left'">
                    <Sidebar :menus="menuData" :type="typeData" />
                    <!-- <div class="all-menu">全部菜单</div> -->
                </div>
                <div class="left no-copy" v-if="layoutModeSettings === 'default'">
                    <Sidebar :menus="menuData" />
                    <!-- <div class="all-menu">全部菜单</div> -->
                </div>
                <div :class="{'ub ub-f1 second-box':layoutModeSettings === 'default','w100 second-box':layoutModeSettings === 'left'}" >
                    <div class="w100 breadcrumb" v-if="layoutModeSettings === 'default'">
                        <Breadcrumb :menuData="menuData" />
                    </div>
                    <div class="header w100 no-copy" v-if="layoutModeSettings === 'left'">
                        <TopNav type="typeData" />
                        <Breadcrumb :menuData="menuData" />
                    </div>
                    <router-view class="second-view" />
                </div>
            </div>
        </div>
        <!--左右模式-->
        <!-- <div class="ub left-theme" v-if="layoutModeSettings === 'left'">
            <div class="left">
                <Sidebar :menus="menuData" :type="typeData" />
            </div>
            <div class="w100 ub-f1 second-box">
                <div class="header w100 no-copy">
                    <TopNav type="typeData" />
                    <Breadcrumb />
                </div>
                <router-view class="second-view" />
            </div>
        </div> -->
        <!--顶部模式-->
        <!-- <div class="ub ub-ver top" v-if="layoutModeSettings === 'top'">
            <div class="header">
                <Topbar :menus="menuData" class="topbar-container" />
                <Breadcrumb />
            </div>
            <router-view class="second-view" />
        </div> -->
        <!--<div v-per="['2']">按钮权限</div>-->
        <!--<div v-per="['6']">其他权限</div>-->
        <ThemeDrawer :drawer="themeDrawer" />
        <Password ref="passwordDialog" :isChangeSelf="isChangeSelf"  @close="close" :dialogVisible="passwordDialog" />
    </div>
</template>

<script>
import per from '@/directive/per/index.js' // 权限判断指令
import { mapMutations, mapGetters } from 'vuex'
import { Sidebar, Topbar, ThemeDrawer, TopNav, Password } from './components'
import { get_menus, get_update_password_state } from '@/server/common.js'
export default {
    name: 'Index',
    components: {
        Sidebar,
        Topbar,
        ThemeDrawer,
        TopNav,
        Password
    },
    directives: { per },
    data() {
        return {
            isChangeSelf: true,
            passwordDialog: false,
            themeDrawer: false,
            typeData: 'left',
            menuData: [],
            typeDataTwo: 'default',
            url: ''

        }
    },
    created() {
        this.initUpdatePassword()
        this.getMenu()
    },
    mounted() {
        this.$eventBus.$on('passwordShow', () => {
            this.isChangeSelf = false
            console.log(this.isChangeSelf)
            this.passwordDialog = true
        })
        let initInfo = this.$getlocalStorage('initInfo')
        let { theme } = initInfo
        if (initInfo && theme) {
            let layoutObj = {
                1: 'default',
                2: 'left',
                3: 'top'
            }
            let colorObj = {
                1: 'default',
                2: 'dark',
                3: 'purple'
            }
            this.changeSetting({
                key: 'layoutModeSettings',
                value: layoutObj[theme.style]
            })
            this.changeSetting({
                key: 'themeSettings',
                value: colorObj[theme.color]
            })
            if (theme.navCollapseSettings) {
                this.changeSetting({
                    key: 'navCollapseSettings',
                    value: theme.navCollapseSettings
                })
            }
            if (theme.logoAddress) {
                this.$store.commit('common/setLogo', theme.logoAddress)
            }
            if (theme.systemName) {
                this.$store.commit('common/setName', theme.systemName)
            }
        }
    },
    watch: {
        $route: {
            handler(newVal, oldVal) {
                let menus = this.$getsessionStorage('systemMenus')
                if (newVal && JSON.stringify(menus).includes(newVal.path)) {
                    console.log(newVal.path, '新路由')
                    this.$setsessionStorage('currentPath', newVal.path)
                }
            }
            // immediate: true
        }
    },
    methods: {
        close() {
            this.passwordDialog = false
            setTimeout(() => {
                this.isChangeSelf = true
            }, 1000)
        },
        initUpdatePassword() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_update_password_state(data).then(res => {
                console.log('是否更新密码', res)
                if (res.code == 1) {
                    this.isChangeSelf = true
                    this.passwordDialog = true
                }
            }).catch(error => {
                console.log('error' + error)
            })
        },
        getMenu() {
            this.roles = []
            let data = {
                queryData: { },
                paramsData: {}
            }
            get_menus(data).then(res => {
                console.log('左侧菜单', res)
                if (res.buttons.length > 0) {
                    this.set_per(res.buttons)
                } else {
                    /* 配合store解決异步指令更新问题*/
                    this.set_per([{}])
                }
                let menuUrls = []
                res.menus.map((item, index) => {
                    if (item.menus.length > 0) {
                        item.menus.forEach(element => {
                            menuUrls.push(element.url)
                        })
                    }
                    return item
                })
                this.$setsessionStorage('menuUrls', menuUrls)

                let menus = res.menus.filter(item => item.id !== 'b981f964ef9f7c28a26dd4b540c9ceea')
                this.$setsessionStorage('systemMenus', menus)
                if (menus.length > 0) {
                    this.gethandeltUrl(menus)
                    this.menuData = menus
                    if (menus[0].menus.length > 0) {
                        this.getFirstUrl(menus[0])
                    } else {
                        this.url = menus[1].menus[0].url
                    }

                    console.log('urlurl', this.url)

                    // 涉及三级路由页面 不走返回跳转的逻辑
                    if (this.$route.path.includes('/data_report/report_pages') ||
                        this.$route.path.includes('/data_report/report_fail') ||
                        this.$route.path.includes('/data_report/report_config')) {
                        return
                    }

                    let currentPath = this.$getsessionStorage('currentPath')
                    if ('newWindow' in this.$route.query) {
                        return
                    }
                    if (currentPath) {
                        this.$router.replace(currentPath)
                    } else if (this.$getsessionStorage('currentPath').includes('rule_new_rules_type') || this.$getsessionStorage('currentPath').includes('assets_asset_info')) {
                        // this.$router.replace('/home/rule_new_rules_type')
                    } else {
                        this.$router.replace(this.url)
                    }
                }
            }).catch(error => {
                console.log('error' + error)
            })
            // this.menuData = Menu.menuList()
        },
        getFirstUrl(obj) {
            if (obj.menus.length === 0) {
                this.url = obj.url
            } else {
                this.getFirstUrl(obj.menus[0])
            }
        },
        gethandeltUrl(arr) {
            if (arr.length === 0) {
                return
            }
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].url === undefined) {
                    arr[i].url = this.$uuid(16, 16)
                }
                if (arr[i].menus.length > 0) {
                    this.gethandeltUrl(arr[i].menus)
                }
            }
        },
        toogle(position) {
            this.changeSetting({
                key: 'layoutModeSettings',
                value: position
            })
        },
        ...mapMutations({
            set_per: 'user/SET_PER'
        }),
        ...mapMutations({
            changeSetting: 'settings/changeSetting'
        })
    },
    computed: {
        ...mapGetters(['layoutModeSettings']),
        ...mapGetters(['themeSettings']),
        ...mapGetters(['navCollapseSettings'])
    }
}
</script>

<style scoped lang="scss">
.container {
    overflow: hidden;
}
.main {
    height: 100%;
    overflow: hidden;
}
.all-menu {
    position: relative;
    font-size: 12px;
    @include themeify {
        color: themed("left-font-color");
    }
    top: 88px;
    left: 150px;
    &:hover {
        cursor: pointer;
        @include themeify {
            color: themed("left-hover-font-color");
        }
    }
}
.default {
    width: 100%;
    height: 100%;
    overflow: hidden;

    .header {
        position: fixed;
        height: 40px;
        z-index: 999;
        box-shadow: 0 0 32px 0 rgba(41,48,66,0.1);
    }
    .second-view-wrapper {
        height: calc(100vh - 40px);
        margin-top: 40px;
        overflow: hidden;
        position: relative;
        .second-box {
            overflow: hidden;
            .breadcrumb {
                position:fixed;
                height: 40px;
            }
            .second-view {
                margin-top: 40px;
                box-sizing: border-box;
                overflow: auto;
            }
        }
    }
}
.custom-default .left {
    background-image: url('../assets/img/login/default.png') !important;
    background-position: bottom;
    background-repeat: no-repeat;
    background-size: cover;
}
.custom-dark .left {
    background-image: url('../assets/img/login/black.png') !important;
    background-position: bottom;
    background-repeat: no-repeat;
    background-size: cover;
}
.custom-purple .left {
    background-image: url('../assets/img/login/purple.png') !important;
    background-position: bottom;
    background-repeat: no-repeat;
    background-size: cover;
}
.left-theme {
    width: 100%;
    height: 100%;
    overflow: hidden;

    .second-box {
        overflow: hidden;
        position: relative;
        .header {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            // height: 120px;
            z-index: 999;
        }
        .second-view {
            height: calc(100vh - 80px);
            margin-top:80px;
            box-sizing: border-box;
            overflow: auto;
        }
    }
}

.top {
    width: 100%;
    height: 100%;
    overflow: hidden;

    .header {
        position: fixed;
        height: 100px;
        z-index: 999;
    }
    .second-view {
        height: calc(100vh - 80px);
        margin-top:80px;
        box-sizing: border-box;
        overflow: auto;
    }
}
.second-view {
    padding: 0px 10px 0 10px;
    width: 100%;
}
</style>
