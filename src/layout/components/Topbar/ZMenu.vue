<template>
    <div class="wrapper">
        <template v-for="menu in menus">
            <el-submenu v-if="menu.menus && menu.menus.length >= 1" :index="menu.url + ''" :key="menu.id" popper-class="top-nav-menu" style="position: relative;">
                <template slot="title">
                    <i :class="menu.icon" style="margin-right: 5px"></i>
                    <span slot="title">{{menu.name}}</span>
                </template>
                <z-menu class="inner" :menus="menu.menus"></z-menu>
            </el-submenu>
            <el-menu-item v-else :index="menu.url+ ''" @click="handleRouter(menu)" :key="menu.id">
                <i :class="menu.icon"></i>
                <span slot="title">{{menu.name}}</span>
            </el-menu-item>
        </template>
    </div>
</template>
<script>

export default {
    name: 'ZMenu', // 至关重要，就靠这个名字递归了
    props: {
        menus: {
            type: Array,
            default: function() {
                return []
            },
            required: false
        }
    },
    methods: {
        handleRouter(menu) {
            this.$router.push(menu.url)
            // document.title = menu.name
        }
    }
}
</script>

<style scoped lang="scss">
$blue: #387DEE;
.wrapper ::v-deep .el-submenu,
.wrapper ::v-deep .el-menu--horizontal .el-menu .el-menu-item {
    height: 40px;
}
.wrapper ::v-deep .el-submenu__title {

}
.wrapper ::v-deep .el-submenu__title {
    height: 40px;
    line-height: 40px;

    @include themeify {
        background: themed('top-bar-bg') !important;
        color: themed('top-font-color') !important;
    }
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
/*区别二级下拉选样式*/
.inner ::v-deep .el-submenu{
    height: 36px !important;
}
.inner ::v-deep .el-submenu__title{
    height: 36px !important;
    line-height: 36px !important;
}
.inner ::v-deep .el-menu--horizontal .el-menu .el-menu-item{
    height: 36px !important;
}
.wrapper ::v-deep .el-submenu__icon-arrow {
    position: absolute;
    right: 0 !important;
    margin-top: -5px !important;
}
.wrapper ::v-deep .el-menu-item.is-active {
    @include themeify {
        color: themed('font-color-high') !important;
    }
}
</style>

<style lang="scss">
.top-nav-menu .el-menu-item {

    @include themeify {
        color: themed('font-color-dark')
    }
    &:hover {
        @include themeify {
            color: themed('font-color-high');
            background: themed('drop-item-bg');
        }
    }
}
.top-nav-menu .el-menu.el-menu--horizontal {
    border-bottom: none;
}
</style>
