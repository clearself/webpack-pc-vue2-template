<template>
    <div class="w100 top-bar">
        <el-scrollbar>
            <div class="ub top-nav">
                <div class="logo">
                    <Logo />
                </div>
                <div class="more-btn ub ub-pc ub-ac">
                    <el-popover
                        placement="top-start"
                        trigger="hover">
                        <MoreMenu :menus="menus" />
                        <i class="el-icon-share" slot="reference"></i>
                    </el-popover>
                </div>
                <div class="nav-menu ub-f1">
                    <el-menu mode="horizontal" :unique-opened="true" :default-active="routerPath" router active-text-color="#409EFF">
                        <z-menu :menus="menus"></z-menu>
                    </el-menu>
                </div>
                <div class="tool-bar">
                    <Toolbar />
                </div>
            </div>
        </el-scrollbar>
    </div>
</template>

<script>
import ZMenu from './ZMenu.vue'
import Logo from './Logo.vue'
import Toolbar from './Toolbar.vue'
import MoreMenu from './MoreMenu.vue'

export default {
    name: 'SideBar',
    components: {
        ZMenu,
        Logo,
        Toolbar,
        MoreMenu
    },
    props: ['menus'],
    data() {
        return {}
    },
    computed: {
        isCollapse() {
            console.log('111111111111', this.$store.state.common.isCollapse)
            return this.$store.state.common.isCollapse
        },
        routerPath() {
            // console.log('path1111111111111111',this.$route.path)
            return this.$route.meta.guidePath ? this.$route.meta.jumpPath : this.$route.path
        }
    },
    methods: {
        fold() {
            let isCollapse = this.$store.state.common.isCollapse
            this.$store.commit('common/toggleCollapse', !isCollapse)
        }
    }
}
</script>

<style lang="scss" scoped>
.top-nav, .el-menu  {
    @include themeify {
        background: themed('top-bar-bg');
    }
}
.logo {
    width: 256px;
    height: 40px;
}
.nav-menu {
    height: 40px;
    overflow: hidden;

    /*重写element 样式*/
    &::v-deep .el-menu--horizontal .el-menu-item {
         float: left;
         height: 40px;
         line-height: 40px;
         margin: 0;
         border-bottom: 2px solid transparent;
         color: #909399;
    }
    &::v-deep .el-menu--horizontal .el-submenu {
        float: left;
    }
    &::v-deep .el-menu.el-menu--horizontal {
        border: 1px solid transparent;
    }
}
.tool-bar {
    width: 300px;
    height: 40px;
}
.more-btn {
    width: 20px;
    height: 40px;
    margin-right: 24px;
    cursor: pointer;

    & i{
        @include themeify {
            color: themed('top-font-color');
        }
    }
    &:hover, &:hover i{
        @include themeify {
            color: themed('top-hover-font-color') !important;
        }
    }
}
</style>
