<template>
    <div class="w100 log-audit">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="登录日志" name="first"><LoginLogs :roles="roles"></LoginLogs></el-tab-pane>
            <el-tab-pane label="操作日志" name="second"><OptionLogs :roles="roles"></OptionLogs></el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import LoginLogs from './login_logs.vue'
import OptionLogs from './option_logs.vue'

import { get_roles } from '@/server/system/logos.js'
export default {
    name: 'LogAudit',
    components: {
        LoginLogs,
        OptionLogs
    },
    data() {
        return {
            roles: [],
            activeName: 'first'
        }
    },
    created() {
        this.initRoles()
    },
    methods: {
        initRoles() {
            this.roles = []
            let data = {
                queryData: { },
                paramsData: {}
            }
            get_roles(data).then(res => {
                console.log('角色', res)
                if (res.length > 0) {
                    this.roles = res.map(item => {
                        let obj = {}
                        obj.label = item.name
                        obj.value = item.id
                        return obj
                    })
                }
            }).catch(error => {
                console.log('error' + error)
            })
        },
        handleClick(obj) {

        }
    }
}
</script>
<style scoped lang="scss">
    .log-audit ::v-deep .el-tabs__header {
        margin-bottom: 0px;
        background-color: #fff;
        padding-left: 10px;
        border: 1px solid #DADEE8;
        border-bottom: none;
        border-radius: 4px 4px 0 0;

    }
    .log-audit ::v-deep .wrapper  {
        border-radius: 0 0 4px 4px;
    }
</style>
