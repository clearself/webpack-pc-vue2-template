<template>
    <div class="w100 top-bar">
        <el-scrollbar>
            <div class="ub top-nav">
                <div class="logo" v-if="type==='default'">
                    <Logo />
                </div>
                <div class="more-btn ub ub-pc ub-ac" :class="{'operation': type!=='default'}">
                    <div class="iconfont icon-dingbuzhedie operation-icon" @click="fold"></div>
                </div>
                <div class="nav-menu ub-f1">
                </div>
                <div class="tool-bar">
                    <Toolbar />
                </div>
            </div>
        </el-scrollbar>
    </div>
</template>

<script>
import Logo from './Logo.vue'
import Toolbar from './Toolbar.vue'
import { mapMutations, mapGetters } from 'vuex'
export default {
    name: 'SideBar',
    components: {
        Logo,
        Toolbar
    },
    props: ['type'],
    data() {
        return {}
    },
    watch: {},
    computed: {},
    methods: {
        ...mapMutations({
            changeSetting: 'settings/changeSetting'
        }),
        fold() {
            let isCollapse = this.$store.state.settings.navCollapseSettings
            this.changeSetting({
                key: 'navCollapseSettings',
                value: !isCollapse
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.top-nav, .el-menu {
    @include themeify {
        background: themed('top-nav-bg');
    }
}
.logo {
    margin-right: 10px;
    margin-left: 10px;
    // width: 256px;
    height: 40px;
    // margin-left: -10px;
}
.nav-menu {
    overflow: hidden;
    height: 40px;
}
.tool-bar {
    width: 300px;
    height: 40px;
}
.operation {
    margin-left: 40px;
}
.more-btn {
    margin-right: 24px;
    width: 20px;
    height: 40px;
    cursor: pointer;
    .operation-icon {
        color: #95aac9;
    }
    & i {
        @include themeify {
            color: themed('top-font-color');
        }
    }
    &:hover, &:hover i {
        @include themeify {
            color: themed('top-hover-font-color') !important;
        }
    }
}
</style>
