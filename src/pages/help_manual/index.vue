<template>
    <div class="help-manual">
        <el-container>
            <el-header class="head">
                <!-- <img src="../../assets/img/help.png" style="margin-left: 30px;height: 24px;width: auto" alt="" /> -->
                平台帮助手册
            </el-header>
            <div style="padding-right:20px">
                <el-container class="main-content">
                    <el-aside class="aside" style="width:181px">
                        <el-menu
                            class="el-menu-vertical-demo"
                            @open="handleOpen"
                            @close="handleClose"
                            :default-active="routerPath"
                            router
                            active-text-color="#0052d9"
                        >
                            <el-menu-item
                                v-for="menu in menuData"
                                :key="menu.id"
                                :index="menu.url + ''"
                                @click="handleRouter(menu)"
                            >
                                <span slot="title">{{ menu.name }}</span>
                            </el-menu-item>
                        </el-menu>
                    </el-aside>
                    <el-main class="content-cell">
                        <router-view></router-view>
                    </el-main>
                </el-container>
            </div>
        </el-container>
    </div>
</template>

<script>
export default {
    name: 'HelpManual',
    components: {},
    data() {
        return {
            menuData: [
                {
                    id: 0,
                    name: '资产中心',
                    url: '/help_manual/help_asset_center'
                },
                {
                    id: 4,
                    name: '工单管理',
                    url: '/help_manual/help_work_order_manage'
                },
                {
                    id: 2,
                    name: '规则管理',
                    url: '/help_manual/help_rule_manage'
                },
                {
                    id: 1,
                    name: '数据中心',
                    url: '/help_manual/help_data_center'
                },
                {
                    id: 3,
                    name: '标签管理',
                    url: '/help_manual/help_label_manage'
                },
                {
                    id: 5,
                    name: '上报数据',
                    url: '/help_manual/help_reported_data'
                }
            ]
        }
    },
    computed: {
        routerPath() {
            return this.$route.path
        }
    },
    created() {
        document.title = '平台帮助手册'
    },
    methods: {
        handleOpen(key, keyPath) {
            console.log(key, keyPath)
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath)
        },
        handleRouter(menu) {
            this.$router.push(menu.url)
        }
    }
}
</script>

<style lang="scss" scoped>
.help-manual {
    height: 100%;
    // background-color: #111d2b;
    min-width: 1200px;
    // background-image: url("../../assets/img/BG.jpg");
    background-position: center;
    background-repeat: no-repeat;
    background-size: 150%;
    .head {
        padding-top: 18px;
        height: 60px;
        margin-bottom: 10px;
        font-size: 20px;
        background: #fff;
        // background: url("/static/img/bar_bg.png") no-repeat;
        // background-size: 100% 60px;
    }
    .main-content {
        background-color: #fff;
        // box-shadow: inset 0px 0px 18px 0px #00b4ff;
        border: solid 1px #ddd;
        .aside {
            color: rgba(0, 0, 0, .9);
            width: 180px;
            border-right: 1px solid #ddd;
            padding-left: 14px;
            .el-menu {
                width: 150px;
                background-color: #fff;
                border-right: none;
                margin-top: 15px;
            }
            .el-menu-item {
                color: rgba(0, 0, 0, .9);
            }
            .el-menu-item,
            .el-submenu__title {
                height: 40px;
                line-height: 40px;
            }
            .el-menu-item:focus,
            .el-menu-item:hover {
                background-color: #ddd;
            }
        }
        .content-cell {
            height: 862px;
            overflow: auto;
            color: rgba(0, 0, 0, .9);
            // background-image: url("/static/img/content_bg.png");
            background-repeat: no-repeat;
            background-position-x: right;
            background-position-y: 180px;
        }
    }
    ::-webkit-scrollbar {
        width: 4px;
        height: 4px;
        /**/
    }
    ::-webkit-scrollbar-track {
        padding: 0 3px;
        background: #010205;
        /*rgb(239, 239, 239);*/
        border-radius: 8px;
    }
    ::-webkit-scrollbar-thumb {
        background: #01e9ff;
        border-radius: 14px;
    }
    ::-webkit-scrollbar-thumb:hover {
        background: #01e9ff;
    }
    ::-webkit-scrollbar-corner {
        background: #179a16;
    }
}
@media screen and (max-width: 1400px) {
    .help-manual {
        .main-content {
            .content-cell {
                height: 550px;
            }
        }
    }
}
</style>
