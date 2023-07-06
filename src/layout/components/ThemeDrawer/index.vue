<template>
    <div>
        <el-drawer
            custom-class="right-drawer"
            :size="320"
            title="主题更换"
            :visible.sync="drawer"
            :direction="direction"
            :before-close="handleClose">
            <div class="drawer-body">
                <!--布局样式-->
                <div class="mode-title">布局样式</div>
                <div class="setting-mode layout-mode ub ub-wrap ub-pj">
                    <div class="mode-item ub ub-ver ub-ac" :class="{selected: item.value === layoutConfigValue}" v-for="(item, index) in layoutConfig" :key="index" @click="selectLayoutMode(item)">
                        <div class="mode-img">
                            <img :src="item.img" alt="">
                        </div>
                        <p class="mode-text ub ub-pc ub-ac">{{item.key}}</p>
                    </div>
                </div>

                <div class="mode-title">导航样式</div>
                <div class="setting-mode layout-mode ub ub-wrap ub-pj">
                    <div class="mode-item ub ub-ver ub-ac" :class="{selected: item.value === navCollapseSettings, 'top-disabled': layoutConfigValue == 'top'}" v-for="(item, index) in navConfig" :key="index" @click="selectNavMode(item)">
                        <div class="mode-img">
                            <img :src="item.img" alt="">
                        </div>
                        <p class="mode-text ub ub-pc ub-ac">{{item.key}}</p>
                    </div>
                </div>

                <div class="mode-title">主题颜色 </div>
                <div class="setting-mode layout-mode ub ub-wrap ub-pj">
                    <div class="mode-item ub ub-ver ub-ac" :class="{selected: item.value === themeConfigValue}" v-for="(item, index) in themeConfig" :key="index" @click="selectThemeMode(item)">
                        <div class="mode-img ub ub-ac ub-pc">
                            <img :src="item.img" alt="" style="width: 40px;height: 40px;">
                        </div>
                        <p class="mode-text ub ub-pc ub-ac">{{item.key}}</p>
                    </div>
                </div>
            </div>
            <div class="drawer-footer">
                <!--<el-button type="primary" @click="handleSubmit" size="small">确 认</el-button>-->
            </div>
        </el-drawer>
    </div>
</template>

<script>
import layout_default from '../../../assets/img/system/layout_default.png'
import layout_left from '../../../assets/img/system/layout_left.png'
import layout_top from '../../../assets/img/system/layout_top.png'
import nav_unfold from '../../../assets/img/system/nav_unfold.png'
import nav_fold from '../../../assets/img/system/nav_fold.png'
import theme_default from '../../../assets/img/system/theme_default.png'
import theme_dark from '../../../assets/img/system/theme_dark.png'
import theme_purple from '../../../assets/img/system/theme_purple.png'
import theme_star from '../../../assets/img/system/theme_star.png'
import { mapMutations, mapGetters } from 'vuex'
import { get_user_system_config } from '@/server/system/security_policy.js'
import { update_subject_sideslip } from '@/server/system/theme_manage.js'
export default {
    name: 'Index',
    props: ['drawer'],
    data() {
        return {
            id: '',
            direction: 'rtl',
            layoutConfigValue: 'default',
            themeConfigValue: 'default',
            layoutConfig: [
                {
                    key: '默认',
                    value: 'default',
                    img: layout_default
                },
                {
                    key: '左侧',
                    value: 'left',
                    img: layout_left
                },
                {
                    key: '顶部',
                    value: 'top',
                    img: layout_top
                }
            ],
            navConfig: [
                {
                    key: '展开',
                    value: false,
                    img: nav_unfold
                },
                {
                    key: '折叠',
                    value: true,
                    img: nav_fold
                }
            ],
            themeConfig: [
                {
                    key: '默认',
                    value: 'default',
                    img: theme_default
                },
                {
                    key: '黑色',
                    value: 'dark',
                    img: theme_dark
                },
                {
                    key: '紫色',
                    value: 'purple',
                    img: theme_purple
                },
                {
                    key: '星空蓝',
                    value: 'star',
                    img: theme_star
                }
            ]
        }
    },
    watch: {
        drawer(val) {
            if (val) {
                this.initTheme()
            }
        }
    },
    computed: {
        ...mapGetters(['navCollapseSettings'])
    },
    methods: {
        initTheme() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_user_system_config(data)
                .then(res => {
                    this.setLayout(res.style)
                    this.setColor(res.colour)
                    this.id = res.id
                })
                .catch(error => {
                    console.log('error' + error)
                })
        },
        setLayout(style) {
            if (style === 1) {
                this.layoutConfigValue = 'default'
            } else if (style === 2) {
                this.layoutConfigValue = 'left'
            } else if (style === 3) {
                this.layoutConfigValue = 'top'
            }
            this.changeSetting({
                key: 'layoutModeSettings',
                value: this.layoutConfigValue
            })
        },
        setColor(colour) {
            if (colour === 1) {
                this.themeConfigValue = 'default'
            } else if (colour === 2) {
                this.themeConfigValue = 'dark'
            } else if (colour === 3) {
                this.themeConfigValue = 'purple'
            } else if (colour === 4) {
                this.themeConfigValue = 'star'
            }
            this.changeSetting({
                key: 'themeSettings',
                value: this.themeConfigValue
            })
        },
        styleNum(val) {
            if (val === 'default') {
                return 1
            } else if (val === 'left') {
                return 2
            } else if (val === 'top') {
                return 3
            }
        },
        colourNum(val) {
            if (val === 'default') {
                return 1
            } else if (val === 'dark') {
                return 2
            } else if (val === 'purple') {
                return 3
            } else if (val === 'star') {
                return 4
            }
        },
        handleClose() {
            this.$parent.themeDrawer = false
        },
        handleSubmit() {
            let data = {
                queryData: {},
                paramsData: {
                    id: this.id,
                    style: this.styleNum(this.layoutConfigValue),
                    colour: this.colourNum(this.themeConfigValue)
                }
            }
            update_subject_sideslip(data)
                .then(res => {
                    this.$message({
                        message: '设置成功',
                        type: 'success'
                    })
                })
                .catch(error => {
                    // this.themeDialog = false
                    console.log(error + 'error')
                })
        },
        ...mapMutations({
            changeSetting: 'settings/changeSetting'
        }),
        selectLayoutMode(mode) {
            if (this.layoutConfigValue === mode.value) return
            this.layoutConfigValue = mode.value
            this.handleSubmit()
            this.changeSetting({
                key: 'layoutModeSettings',
                value: mode.value
            })
        },
        selectNavMode(mode) {
            if (this.navCollapseSettings === mode.value) return
            if (this.layoutConfigValue === 'top') return

            this.changeSetting({
                key: 'navCollapseSettings',
                value: mode.value
            })
        },
        selectThemeMode(mode) {
            if (this.themeConfigValue === mode.value) return
            this.themeConfigValue = mode.value
            this.handleSubmit()
            this.changeSetting({
                key: 'themeSettings',
                value: mode.value
            })
        }
    }
}
</script>

<style scoped lang="scss">
.drawer-body {
    // padding: 0 24px;
}
.drawer-footer {
    position: absolute;
    right: 0;
    bottom: 10px;
    padding: 0 24px;
}
.mode-title {
    margin-bottom: 16px;
    font-size: 12px;
}
.mode-title:not(:first-child) {
    margin-top: 20px;
}
.custom-star {
    .mode-title {
        color: #ffffff;
    }
    .mode-text {
        color: #ffffff;
    }
    .mode-item.selected .mode-text {
        color: #1cd7fa!important;
    }
}
.setting-mode {
    &>div {
        margin-bottom: 16px;
        width: 120px;
        height: 118px;
        cursor: pointer;
        img {
            width: 120px;
            height: 88px;
        }
        .mode-img {
            width: 120px;
            height: 90px;
            border: solid 1px #dddddd;
            border-radius: 4px;
            box-sizing: border-box;
        }
        .mode-text {
            margin-top: 8px;
            height: 20px;
            font-size: 12px;
        }
    }
    .mode-item.selected {
        .mode-img {
            position: relative;
            border-color: $high-color;
        }
        .mode-img::before {
            position: absolute;
            top: 5px;
            right: 5px;
            font-family: iconfont;
            color: $high-color;
            content: '\e7e6';
        }
        .mode-text {
            color: $high-color;
        }
    }
    .top-disabled {
        // cursor:  not-allowed;
        pointer-events: none;
        opacity: 0.5;
        .mode-img {
            img {
                opacity: 0.5;
            }
        }
        .mode-text {
            opacity: 0.5;
        }
    }
}
</style>
