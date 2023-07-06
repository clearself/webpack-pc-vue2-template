<template>
    <div class="container h100">
        <!--默认模式-->
        <div :class="{'default':layoutModeSettings === 'default','ub left-theme':layoutModeSettings === 'left','ub ub-ver top':layoutModeSettings === 'top'}" v-if="show">
            <div class="header w100 no-copy" v-if="layoutModeSettings === 'default'">
                <TopNav :type="typeDataTwo"/>
            </div>

            <div class="header w100" v-if="layoutModeSettings === 'top'">
                <Topbar :menus="menuData" class="topbar-container"/>
                <Breadcrumb :menuData="menuData"/>
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
import { ssoLogin } from '@/server/system/user.js'
import { groupList } from '@/server/auto_respond/action_manage.js'
import {
    get_security_policy
} from '@/server/login/index.js'
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
            url: '',
            safetyInfo: {
                pwLimit: 10,
                pwDefault: 1, // 密码策略，1 默认 2 自定义
                pwCustom: 1, // 1 数字， 2 大写字母， 3 小写字母， 4 特殊字符
                graphicVerification: 2, // 是否图形验证码 1 是 2 否
                verificationMode: 1, // 双因子 1 邮箱  2 手机校验
                doubleVerification: 2, // 是否开启双因子 1 是 2 否
                style: 1, // 1 默认 2 左侧 3 顶部
                colour: '', // 主题颜色： 1 默认 2 浅色 3 深色
                systemName: '基础开发平台', // 系统名称
                logoAddress: require('../assets/img/logo.png'), // logo 地址
                adminPhone: '', // 管理员联系方式
                lockTime: '', // 锁定时间
                lockTimeUnit: '' // 锁定时间单位 1分、2小时、3天、4月
            },
            show: false

        }
    },
    async created() {
        // await this.getInitInfo()
        const code = this.$route.query.code || ''
        const state = this.$route.query.state || ''
        if (code) {
            const data = {
                queryData: {
                    code: code,
                    state: state
                },
                paramsData: {}
            }
            ssoLogin(data)
                .then((res) => {
                    console.log(res)
                    if (typeof res != 'string') {
                        let initInfo = this.$getlocalStorage('initInfo')
                        if (initInfo && initInfo.user) {
                            initInfo.user.chineseName = res.chineseName
                            initInfo.user.token = res.token
                            this.$setlocalStorage('initInfo', initInfo)
                        }
                        setTimeout(() => {
                            this.initUpdatePassword()
                            this.getMenu()
                            this.show = true
                        }, 1000)
                    } else {
                        this.$alert('您的账号不存在或被禁用', '提示', {
                            confirmButtonText: '确定',
                            showClose: false,
                            callback: action => {
                                window.location.href = '/api/base-server/sso/clean'
                            }
                        })
                    }
                })
                .catch((err) => {
                    // window.location.href = '/api/base-server/sso/clean'
                    // this.$router.replace('/index')
                    this.$router.replace('/login')
                    console.log(err)
                })
        } else {
            let initInfo = this.$getlocalStorage('initInfo')
            if (initInfo.user == '') {
                this.$router.replace('/login') // 如果获取不到用户信息，重新登录
            } else {
                setTimeout(() => {
                    if (initInfo.user.token != '') {
                        this.initUpdatePassword()
                        this.getMenu()
                        this.show = true
                    }
                }, 1000)
            }
        }
        // this.initUpdatePassword()
        // this.getMenu()
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
                3: 'purple',
                4: 'star'
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
        this.groupListFn()
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
        groupListFn() {
            let data = {
                queryData: {},
                paramsData: {
                    type: 0
                }
            }
            groupList(data)
                .then(res => {
                    this.$setsessionStorage('customAutoList', res)
                    // this.$setsessionStorage('customAutoList', [])
                })
                .catch(err => {
                    console.log(err)
                })
        },
        getInitInfo() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_security_policy(data).then(res => {
                console.log(res, '安全策略')
                this.safetyInfo.pwLimit = res.pwLimit ?? 8
                this.safetyInfo.pwDefault = res.pwDefault ?? 1
                this.safetyInfo.pwCustom = res.pwCustom ?? '1,2'
                this.safetyInfo.graphicVerification = res.graphicVerification ?? 2
                this.safetyInfo.verificationMode = res.verificationMode ?? 1
                this.safetyInfo.doubleVerification = res.doubleVerification ?? 2
                this.safetyInfo.style = res.style ?? 1
                this.safetyInfo.colour = res.colour ?? 1
                this.safetyInfo.systemName = res.systemName ?? '基础开发平台'
                // this.safetyInfo.logoAddress = '/api/base-server/terminal/toViewPicture'
                this.safetyInfo.adminPhone = res.adminPhone ?? ''
                this.safetyInfo.lockTime = res.lockTime ?? ''
                this.safetyInfo.lockTimeUnit = res.lockTimeUnit ?? ''
                // this.$setsessionStorage('userInfo', userInfo)
                this.$store.commit('common/setLogo', res.logoAddress)
                this.$store.commit('common/setName', res.systemName)

                let obj = {
                    user: {

                    },
                    pwd: {
                        pwDefault: res.pwDefault,
                        pwCustom: res.pwCustom,
                        limit: res.pwLimit
                    },
                    theme: {
                        style: res.style,
                        color: res.colour,
                        systemName: res.systemName,
                        logoAddress: res.logoAddress
                    }
                }
                this.$setlocalStorage('initInfo', obj)
                document.title = res.systemName ?? '基础开发平台'
            }).catch(error => {
                console.log(error)
            })
        },
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

                let menus = res.menus
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
    overflow: hidden;
    height: 100%;
}
.all-menu {
    position: relative;
    top: 88px;
    left: 150px;
    font-size: 12px;
    @include themeify {
        color: themed('left-font-color');
    }
    &:hover {
        cursor: pointer;
        @include themeify {
            color: themed('left-hover-font-color');
        }
    }
}
.default {
    overflow: hidden;
    width: 100%;
    height: 100%;
    .header {
        position: fixed;
        z-index: 999;
        height: 40px;
        box-shadow: 0 0 32px 0 rgb(41 48 66 / 10%);
    }
    .second-view-wrapper {
        position: relative;
        overflow: hidden;
        margin-top: 40px;
        height: calc(100vh - 40px);
        .second-box {
            overflow: hidden;
            .breadcrumb {
                position: fixed;
                z-index: 10;
                height: 40px;
                @include themeify {
                    background: themed('breadcrumb-bg-color');
                }
            }
            .second-view {
                overflow: auto;
                margin-top: 40px;
                box-sizing: border-box;
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
.custom-star .left {
    border: 1px solid #1cd7fa;
    border-radius: 5px;
    background-position: bottom;
    background-repeat: no-repeat;
    background-size: cover;
    box-shadow: 0 0 7px inset #389bf7;
    background-image: url('../assets/img/login/star.png') !important;
}
.left-theme {
    overflow: hidden;
    width: 100%;
    height: 100%;
    .second-box {
        position: relative;
        overflow: hidden;
        .header {
            position: absolute;
            top: 0;
            right: 0;
            left: 0;
            // height: 120px;
            z-index: 999;
        }
        .second-view {
            overflow: auto;
            margin-top: 80px;
            height: calc(100vh - 80px);
            box-sizing: border-box;
        }
    }
}
.top {
    overflow: hidden;
    width: 100%;
    height: 100%;
    .header {
        position: fixed;
        z-index: 999;
        height: 100px;
    }
    .second-view {
        overflow: auto;
        margin-top: 80px;
        height: calc(100vh - 80px);
        box-sizing: border-box;
    }
}
.second-view {
    padding: 0 10px;
    width: 100%;
}
</style>
