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
                                <p style="margin-left: 16px" @click.stop="handleRouter(_it)">{{_it.name}}</p>
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
    width: auto;
    min-width: 700px;
    height: 500px;
    padding: 12px;
    float: left;
    writing-mode: vertical-lr;

    .menu-module {
        width: 120px;
        display: inline-block;
        height: auto;
        color: rgba(0,0,0,0.4);
        writing-mode: horizontal-tb;
    }
    .first-menu-title,.second-menu-title,.third-menu-title {
        height: 20px;
        line-height: 20px;
        margin-bottom: 8px;
        cursor: pointer;
        width: 120px;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        position: relative;
    }
    .first-menu-title {
        color: $dark-color;
        height: 32px;
        line-height:32px;
    }
    .third-menu-title {
        .icon {
            font-size: 14px;
            position: absolute;
            top: -5px;
        }
    }
}
</style>
