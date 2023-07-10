<template>
    <!-- <fragment> -->
    <div>
        <template v-for="menu in menus">
            <el-submenu v-if="menu.menus && menu.menus.length >= 1" :index="menu.url?menu.url:''" :key="menu.id" popper-class="nav-shrink" style="position: relative;">
                <template slot="title">
                    <i :class="menu.icon"></i>
                    <span slot="title" v-show="!$store.state.settings.navCollapseSettings">{{menu.name}}</span>
                </template>
                <el-menu-item-group v-show="$store.state.settings.navCollapseSettings">
                    <span slot="title">{{menu.name}}</span>
                </el-menu-item-group>
                <z-menu :menus="menu.menus"></z-menu>
            </el-submenu>
            <el-menu-item v-else :index="menu.url?menu.url:''" @click="handleRouter(menu)" :key="menu.id">
                <!-- <i :class="menu.icon"></i> -->
                <!-- <span class="iconfont icon-wifi-"></span> -->
                <div class="dot"></div>
                <span slot="title">{{menu.name}}</span>
            </el-menu-item>
        </template>
    </div>
    <!-- </fragment> -->
</template>
<script>
import { searchDefault } from '@/server/stream_data_center/dash_board.js'
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
            if (menu.name === '仪表盘') {
                this.searchDefaultData()
            } else {
                this.$router.push(menu.url)
                // document.title = menu.name
            }
        },
        searchDefaultData() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            searchDefault(data).then((res) => {
                if (res) {
                    this.$router.push({
                        path: '/stream_data_center/stream_data_manage_dashboard',
                        query: {
                            id: res.id,
                            name: res.name,
                            indexType: res.indexType
                        }
                    })
                } else {
                    this.$router.push('/stream_data_center/dash_board')
                }
            })
        }
    }
}
</script>
<style scoped lang="scss">
</style>
