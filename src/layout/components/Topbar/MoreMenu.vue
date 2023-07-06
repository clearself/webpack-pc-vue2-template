<template>
    <div class="content">
        <div class="menu-module" v-for="menu in menus" :key="menu.id">
            <div v-if="menu.menus && menu.menus.length >= 1" class="title">
                <!--最外层菜单-->
                <div class="first-menu-title"> {{menu.name}}</div>
                <div v-for="(item) in menu.menus" :key="item.id">
                    <!--二级菜单-->
                    <div v-if="item.menus && item.menus.length >= 1">
                        <div class="second-menu-title">{{item.name}}</div>
                        <!--三级菜单-->
                        <div v-for="(_it) in item.menus" :key="_it.id">
                            <div class="third-menu-title ub">
                                <i class="icon iconfont icon-fudongcaidanliebiaoshu"></i>
                                <p style="margin-left: 16px;" @click.stop="handleRouter(_it)">{{_it.name}}</p>
                            </div>
                        </div>
                    </div>
                    <div v-else>
                        <p class="second-menu-title" @click.stop="handleRouter(item)">{{item.name}}</p>
                    </div>
                </div>
            </div>
            <div v-else>
                <p class="first-menu-title" @click.stop="handleRouter(menu)">{{menu.name}}</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MoreMenu',
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
            console.log(menu, 'url')
            setTimeout(() => {
                this.$router.push(menu.url)
                // document.title = menu.name
            })
        }
    }
}
</script>

<style scoped lang="scss">
.content {
    float: left;
    padding: 12px;
    width: auto;
    min-width: 700px;
    height: 500px;
    writing-mode: vertical-lr;
    .menu-module {
        display: inline-block;
        width: 120px;
        height: auto;
        color: rgb(0 0 0 / 40%);
        writing-mode: horizontal-tb;
    }
    .first-menu-title,.second-menu-title,.third-menu-title {
        position: relative;
        overflow: hidden;
        margin-bottom: 8px;
        width: 120px;
        height: 20px;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 20px;
        cursor: pointer;
    }
    .first-menu-title {
        height: 32px;
        color: $dark-color;
        line-height: 32px;
    }
    .third-menu-title {
        .icon {
            position: absolute;
            top: -5px;
            font-size: 14px;
        }
    }
}
</style>
