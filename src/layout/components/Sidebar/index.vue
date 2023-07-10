<template>
    <div class="side-bar">
        <div class="menu-content ub ub-ac" v-if="type === 'left'">
            <img :class="{'menu-logo': $store.state.settings.navCollapseSettings===false}" :src="'/api/base-server/file/download' + encodeURI(encodeURI($store.state.common.logoAddress)) + '?token=' +this.$getlocalStorage('initInfo').user.token" alt="logo" />
            <el-collapse-transition>
                <div class="menu-text" style='' v-if="!$store.state.settings.navCollapseSettings">{{$store.state.common.systemName}}</div>
            </el-collapse-transition>
        </div>
        <div style="height:50px"></div>
        <el-scrollbar style="height: 85vh" wrap-class="wap-list">
            <!-- <div class="w100 menu"> -->
            <el-menu
                :collapse="isCollapse"
                class="menu-item"
                text-color="#496573"
                :unique-opened="true"
                :default-active="routerPath"
                router
                active-text-color="#409EFF"
            >
                <z-menu :menus="menus"></z-menu>
            </el-menu>
            <!-- </div> -->
        </el-scrollbar>
    </div>
</template>

<script>
import ZMenu from './ZMenu.vue'
export default {
    name: 'SideBar',
    components: {
        ZMenu
    },
    props: ['menus', 'type'],
    data() {
        return {
            token: ''
        }
    },
    mounted() {
        this.token = this.$getlocalStorage('initInfo').user.token
    },
    computed: {
        isCollapse() {
            console.log('111111111111', this.$store.state.settings.navCollapseSettings)
            return this.$store.state.settings.navCollapseSettings
        },
        routerPath() {
            console.log('path1111111111111111', this.$route.path)
            return this.$route.meta.guidePath
                ? this.$route.meta.jumpPath
                : this.$route.path
        }
    },
    methods: {}
}
</script>

<style lang="scss" scoped>
.side-bar {
    height: 98%;
    overflow: hidden;
    ::v-deep .all-menu {
        width: 100%;
        height: 20px;
        color: #fff;
        font-size: 12px;
    }
    .menu-content {
        position: relative;
        height: 40px;
        img {
            width: 36px;
            height: 36px;
            position: absolute;
            left: 16px;
        }
        .menu-logo {
            // margin-right: 16px;
        }
        div {
            font-size: 20px;
            font-weight: normal;
            @include themeify {
                color: themed("top-menu-logo-text-color");
            }
        }
        .menu-text {
            position: absolute;
            right: 0px;
            white-space:nowrap;
            text-overflow:ellipsis;
            overflow:hidden;
            width: 160px;
        }
    }
    // .operation {
    //     z-index: 99;
    //     padding: 10px 0 10px 20px;
    //     color: #9fbbc7;
    //     font-size: 12px;
    //     line-height: 12px;
    //     margin-bottom: 10px;
    //     .iconfont {
    //         font-size: 12px;
    //     }
    //     .operation-icon {
    //         margin-right: 10px;
    //         &:hover {
    //             cursor: pointer;
    //         }
    //     }
    // }
}

.menu-item:not(.el-menu--collapse) {
    width: 220px;
}
.menu {
    padding-right: 20px;
    margin-top: 25px;
}
// .menu::before {
//     width: 220px;
//     content: '';
//     position: absolute;
//     top: 0;
//     left: 0;
//     right: 0;
//     bottom: 0;
//     background-color:red;
//     opacity: 0.2;
//     background-image: url('../../assets/img/leftBg.png');
//     z-index: -1;
// }
// body.theme-name .menu-item .el-menu-item span{
//     color: #fff;
// }
// body.theme-name .menu-item .el-menu-item span{
//     color: #fff;
// }
// body.theme-name .menu-item .el-menu-item span{
//     color: #fff;
// }
.menu-item {
    border: 0;
    // @include themeify {
    //     background: themed("left-nav-bg");
    // }
     background: transparent;
    ::v-deep .el-menu-item {
        margin: 14px auto;
        height: 34px;
        line-height: 34px;
        cursor: pointer;
        span {
            font-size: 14px;
            @include themeify {
                color: themed("left-font-color");
            }
        }
        i {
            width: 16px;
            margin-right: 10px;
            @include themeify {
                color: themed("left-font-color");
            }
        }
    }
    ::v-deep .el-submenu {
        .el-menu {
            .el-menu-item {
                margin: 14px auto;
                height: 34px;
                line-height: 34px;
                cursor: pointer;
                span {
                    font-size: 12px;
                }
                &:hover {
                    span {
                        @include themeify {
                            color: themed("left-hover-font-color");
                        }
                    }
                    i {
                        @include themeify {
                            color: themed("left-hover-font-color");
                        }
                    }
                }
            }
            ::v-deep .is-active {
                span {
                    @include themeify {
                        color: themed("left-hover-font-color");
                    }
                }
                i {
                    @include themeify {
                        color: themed("left-hover-font-color");
                    }
                }
            }
        }
    }
    ::v-deep .el-submenu {
        .el-menu {
            .el-menu-item.is-active {
                .dot {
                    @include themeify {
                        background-color: themed("left-hover-font-color") !important;
                    }
                }
                span {
                    @include themeify {
                        color: themed("left-hover-font-color") !important;
                    }
                }
                i {
                    @include themeify {
                        color: themed("left-hover-font-color") !important;
                    }
                }
            }
        }
    }
    ::v-deep .el-submenu {
        margin-bottom: 14px;
        .el-submenu__title {
            height: 40px;
            line-height: 40px;
            text-align: left;
            span {
                @include themeify {
                    color: themed("left-font-color");
                }
            }
            > i {
                margin-right: 18px;
                @include themeify {
                    color: themed("left-font-color");
                }
            }
            .el-icon-arrow-down {
                margin-right: 0;
            }
            &:hover {
                background: transparent;
                span {
                    @include themeify {
                        color: themed("left-hover-font-color") !important;
                    }
                }
                i {
                    @include themeify {
                        color: themed("left-hover-font-color") !important;
                    }
                }
            }
        }
        .el-menu,
        .el-menu.el-menu--inline {
            background: transparent;
        }
        .el-menu.el-menu--inline {
            .el-menu-item {
                background: none !important;
                margin: 0;
                text-align: left;
                display: flex;
                .dot {
                    margin-top: 14px;
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    @include themeify {
                        background: themed("left-font-color");
                    }
                }
                i {
                    display: none;
                }
                span {
                    padding-left: 20px;
                }
                &:hover {
                    .dot {
                        @include themeify {
                            background: themed("left-hover-font-color");
                        }
                    }
                }
                &.is-active {
                    background: none;
                }
            }
        }
        .el-menu {
            margin-top: 14px;
        }
    }
    ::v-deep .el-submenu.is-active > .el-submenu__title {
        span {
            @include themeify {
                color: themed("left-hover-font-color");
            }
        }
    }
    ::v-deep .el-submenu__title {
        padding: 0 24px !important;
    }
}

.el-menu--collapse {
    ::v-deep .el-submenu {
        .el-submenu__title {
            .el-submenu__icon-arrow {
                display: none;
            }
        }
    }
}
</style>
<style lang="scss">
.side-bar {
    // .el-menu-item-group__title {
    //     display: none;
    // }
    // .el-menu--vertical {
    //     .el-menu-item-group__title {
    //         display: inline-block;
    //     }
    // }
    // .el-scrollbar__bar.is-vertical > div {
    //     background: #01eaffa8;
    // }
    // .el-scrollbar__bar.is-vertical {
    //     width: 4px;
    // }
    // .el-scrollbar__bar.is-horizontal {
    //     height: 0px;
    // }
}
.wap-list {
    overflow-x: hidden !important;
}
// .el-menu--vertical .el-menu--popup {
//     min-width: 150px !important;
// }
</style>
