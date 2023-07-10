<template>
    <div class="tool ub ub-pe ub-ac h100 w100">
        <div>
            <i class="iconfont icon-dingbuxiaoxi"></i>
        </div>
        <div>
            <i class="iconfont icon-dingbutongzhi"></i>
        </div>
        <div>
            <i class="iconfont icon-mima" @click="changePassword"></i>
        </div>
        <div class="settings">
            <i class="iconfont icon-zhuti" @click="openDrawer"></i>
        </div>
        <div class="user">
            <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">
                    {{ chineseName }}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="exit">退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown></div>
    </div>
</template>

<script>
import { exit } from '@/server/login/index.js'
export default {
    name: 'Toolbar',
    data() {
        return {
            chineseName: ''
        }
    },
    created() {
        this.chineseName = this.$getlocalStorage('initInfo')?.user?.chineseName
    },
    methods: {
        changePassword() {
            this.$eventBus.$emit('passwordShow')
        },
        handleCommand(command) {
            if (command === 'exit') {
                exit({}).then(res => {
                    this.$removesessionStorage('currentPath')
                    this.$router.push({
                        name: 'login'
                    })
                }).catch(error => {
                    console.log('error', error)
                })
            }
        },
        openDrawer() {
            console.log(this.$parent.$parent.$parent)
            this.$parent.$parent.$parent.themeDrawer = true
        }
    }
}
</script>

<style scoped lang="scss">
.tool> div {
    font-size: 14px;
    cursor: pointer;
    &:not(:first-child) {
        margin-left: 10px;
    }

    @include themeify {
        color: themed('top-tool-font-color');
    }
    i {
        font-size: 16px;
    }
    &.settings {
        @include themeify {
            color: themed('top-tool-high-color');
        }
    }
    &.user {
        margin-right: 24px;
        .el-dropdown-link {
            cursor: pointer;
            font-size: 12px;
            line-height: 22px;
            @include themeify {
                color: themed('top-tool-font-color');
            }
        }
        .el-icon-arrow-down {
            font-size: 12px;
        }
    }
}
</style>
