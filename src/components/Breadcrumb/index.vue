
<template>
    <el-breadcrumb class="app-breadcrumb" separator="/">
        <!-- <transition-group name="breadcrumb"> -->
        <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
            <span v-if="index==levelList.length-1" class="no-redirect">{{ item.meta.title }}</span>
            <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
        </el-breadcrumb-item>
        <!-- </transition-group> -->
    </el-breadcrumb>
</template>

<script>
export default {
    name: 'Breadcrumb',
    data() {
        return {
            levelList: []
        }
    },
    props: ['menuData'],
    watch: {
        $route() {
            this.getBreadcrumb() // 监听路由变化
        }
    },
    created() {
        this.getBreadcrumb()
    },
    methods: {
        handleLink(item) {
            const { redirect, path } = item
            if (this.menuData.length > 0) {
                this.menuData.forEach((val) => {
                    if (val.name == item.meta.title) {
                        let url = val.menus[0].url
                        this.$router.push(`${url}`)
                    }
                })
            }
            // if (redirect) {
            //     this.$router.push(redirect)
            //     return
            // }
            // this.$router.push(path)
            // this.$router.push('/system/role_manage')
        },
        getBreadcrumb() {
            let matched = this.$route.matched.filter(item => item.name) // 获取路由信息，并过滤保留路由名称信息存入数组
            this.levelList = matched
            console.log('matched', matched)
        }
    }
}
</script>
<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
    display: inline-block;
    margin-left: 10px;
    font-size: 12px;
    color: #8d8e90;
    line-height: 40px;
    .no-redirect {
        color: #171717;
        cursor: text;
    }
}
.custom-star #app .no-redirect {
    color: #8d8e90;
}
.el-breadcrumb__inner a, .el-breadcrumb__inner.is-link {
    font-weight: normal;
    color: #8d8e90;
}
</style>
