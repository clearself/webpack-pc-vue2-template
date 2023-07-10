<template>
    <div class="report-platform" style="position: relative;overflow: hidden!important;">
        <div class="ub ub-ac w100" style="box-sizing: border-box;">
            <div class="ub w100" style="height:50px;padding-top:0;padding-bottom:0;">
                <div class="ub ub-ac ub-pc report-nav" v-for="(item,index) in report_navs" :key="index" :class="{'active':item.isActive}" @click="switchNav(item)">{{item.name}}</div>
            </div>
        </div>
        <router-view class="second-view-child"></router-view>
    </div>

</template>

<script>

export default {
    name: 'Examine',
    data() {
        return {
            report_navs: [
                {
                    name: '数据源',
                    id: 1,
                    isActive: true,
                    pathName: 'report_data_source'
                },
                {
                    name: '字段映射',
                    id: 2,
                    isActive: true,
                    pathName: 'report_field_mapping'
                },
                {
                    name: '报送数据类型',
                    id: 3,
                    isActive: true,
                    pathName: 'report_data_type'
                },
                {
                    name: '攻击类型',
                    id: 4,
                    isActive: false,
                    pathName: 'report_attack_type'
                },
                {
                    name: '设备类型',
                    id: 5,
                    isActive: false,
                    pathName: 'report_equipment_type'
                },
                {
                    name: '外部网络区域',
                    id: 6,
                    isActive: false,
                    pathName: 'report_network_area'
                },
                {
                    name: '信息系统',
                    id: 7,
                    isActive: false,
                    pathName: 'report_information_system'
                },
                {
                    name: '分支机构',
                    id: 8,
                    isActive: false,
                    pathName: 'report_branch_office'
                },
                {
                    name: 'DDOS流量单位',
                    id: 9,
                    isActive: false,
                    pathName: 'report_flow_set'
                },
                {
                    name: '过滤器',
                    id: 10,
                    isActive: false,
                    pathName: 'report_filter_config'
                },
                {
                    name: '上报方式',
                    id: 11,
                    isActive: false,
                    pathName: 'report_pagesing_mode'
                },
                {
                    name: '机构信息',
                    id: 12,
                    isActive: false,
                    pathName: 'report_organization_information'
                },
                {
                    name: '邮件提醒',
                    id: 13,
                    isActive: false,
                    pathName: 'report_email_set'
                }
            ]
        }
    },

    watch: {
        $route: { // $route可以用引号，也可以不用引号  监听的对象
            handler(to, from) {
                console.log('to', to)
                let path = to.name
                this.report_navs = this.report_navs.map(item => {
                    if (item.pathName === path) {
                        item.isActive = true
                    } else {
                        item.isActive = false
                    }
                    return item
                })
            },
            deep: true, // 深度观察监听 设置为 true
            immediate: true // 第一次初始化渲染就可以监听到
        }
    },
    // mounted() {
    //     this.$nextTick(() => {
    //         console.log('this.$route', this.$route)
    //         let path = this.$route.name
    //         this.report_navs = this.report_navs.map(item => {
    //             if (item.pathName === path) {
    //                 item.isActive = true
    //             } else {
    //                 item.isActive = false
    //             }
    //             return item
    //         })
    //     })
    // },
    methods: {
        switchNav(item) {
            this.report_navs = this.report_navs.map(_item => {
                _item.isActive = false
                return _item
            })
            item.isActive = true
            this.$router.push({
                name: item.pathName
            })
        }

    }
}
</script>

<style lang="scss" scoped>
$fontColor:#409eff;
.report-platform{
    background-color: #fff;
}
.second-view-child{
    position: absolute;
    width:100%;
    left: 0;
    top:60px;
    right: 0;
    bottom: 0;
    padding:20px;
    overflow: hidden;
    box-sizing: border-box;
}
.report-nav{
    height:100%;
    margin: 0 10px;
    font-size:14px;
    color:#666;
    cursor: pointer;
    border-bottom:1px solid rgba(255,255,255,0)
}
.report-nav:hover{
    @include themeify {
        color: themed('theme-color');
    }
}
.report-nav.active{
     @include themeify {
        color: themed('theme-color');
        border-bottom: 1px solid themed('theme-color');
    }
}
</style>
