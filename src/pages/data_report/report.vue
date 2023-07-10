<template>
    <div class="event w100" style="position: relative;overflow: hidden!important;">
        <div class="ub w100 topTabWraper" style="box-sizing: border-box;">
            <div class="ub event-content w100" style="height:60px;padding-top:0;padding-bottom:0;">
                <div class="ub ub-ac ub-pc report-nav" v-for="(item,index) in report_navs" :key="index" :class="{'active':item.isActive}" @click="switchNav(item)">{{item.name}}</div>
            </div>
        </div>
        <div class="routerWrap">
            <router-view :key="$route.fullPath" class="second-view-child"></router-view>
        </div>
    </div>
</template>

<script>
import {
    public_page
} from '@/server/reporting_platform/report_config.js'
import {
    get_instruction
} from '@/server/reporting_platform/setting.js'
export default {
    name: 'Report',
    data() {
        return {
            report_navs: [
                {
                    name: '外部网络攻击',
                    id: 1,
                    isActive: true,
                    pathName: 'externalNetwork'
                },
                {
                    name: '内部网络攻击',
                    id: 2,
                    isActive: true,
                    pathName: 'internalNetwork'
                },
                {
                    name: '证联网接入区安全告警',
                    id: 3,
                    isActive: true,
                    pathName: 'certificateNetwork'
                },
                {
                    name: '异常外连',
                    id: 4,
                    isActive: true,
                    pathName: 'abnormalOutreach'
                },
                {
                    name: 'DDOS攻击',
                    id: 5,
                    isActive: false,
                    pathName: 'ddoc'
                },
                {
                    name: '恶意代码感染',
                    id: 6,
                    isActive: false,
                    pathName: 'maliciousCode'
                },
                {
                    name: '恶意邮件',
                    id: 7,
                    isActive: false,
                    pathName: 'maliciousMail'
                },
                {
                    name: '仿冒/钓鱼网站',
                    id: 8,
                    isActive: false,
                    pathName: 'phishingWebsite'
                },
                {
                    name: '仿冒APP',
                    id: 9,
                    isActive: false,
                    pathName: 'fakeApp'
                }, {
                    name: '网站篡改',
                    id: 10,
                    isActive: false,
                    pathName: 'websiteTampering'
                }
                // , {
                //     name: '上报统计校验',
                //     id: 11,
                //     isActive: false,
                //     pathName: 'reportStatistics'
                // }
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
    mounted() {
        this.$nextTick(() => {
            // console.log('this.$route', this.$route)
            // let path = this.$route.name
            this.get_report_data_type()
            this.getInstruction()
            this.get_Branchs()
            // this.report_navs = this.report_navs.map(item => {
            //     if (item.pathName === path) {
            //         item.isActive = true
            //     } else {
            //         item.isActive = false
            //     }
            //     return item
            // })
        })
    },
    methods: {
        // 获取机构信息
        getInstruction() {
            let data = {}
            get_instruction(data).then(res => {
                this.$store.commit('common/setOrg', res)
            }).catch(error => {
                console.log('error', error)
            })
        },
        // 获取报送数据类型数据源
        get_report_data_type() {
            let data = {
                queryData: {
                    page: 1,
                    pageSize: 1000
                },
                paramsData: {
                    type: 1
                }
            }
            public_page(data).then(res => {
                let report_data_type = res.records.map(e => {
                    let obj = {
                        value: e.code,
                        label: e.name
                    }
                    return obj
                })
                this.$store.commit('common/addDict', {
                    key: 'report_data_type',
                    data: report_data_type
                })
            }).catch((error) => {
                console.log('error' + error)
            })
        },
        get_Branchs() {
            let data = {
                queryData: {
                    page: 1,
                    pageSize: 1000
                },
                paramsData: {
                    type: 5
                }
            }
            public_page(data).then(res => {
                let option_info_systems = res.records.map(e => {
                    let obj = {
                        value: e.code,
                        label: e.name
                    }
                    return obj
                })
                this.$store.commit('common/addDict', {
                    key: 'option_info_systems',
                    data: option_info_systems
                })
            }).catch((error) => {
                console.log('error' + error)
            })
        },
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

.topTabWraper {
    background-color: #fff;
    //padding: 16px 10px 0px;
    border-radius: 4px;
    box-shadow: 0px 0px 8px rgba(140,152,164,.2);
    border: 1px solid #DADEE8;
    box-sizing: border-box;
    &::v-deep .el-form-item__label,
    &::v-deep .el-form-item__content {
        line-height: 32px;
        font-size: 12px;
    }
    &::v-deep .el-input__inner{
        font-size: 12px;
        &::placeholder {
            font-size: 12px;
        }
    }
    .el-range-editor--small .el-range-input {
        font-size: 12px;
    }

}

.routerWrap {
    margin-top: 7px;
    position: relative;
    width: 100%;
    height: calc(100% - 77px);
    //border-radius: 4px;
    //box-shadow: 0px 0px 8px rgba(140,152,164,.2);
    //border: 1px solid #DADEE8;
    //background-color: #ffff;
    //box-sizing: border-box;
}

.second-view-child{
    position: absolute;
    width:100%;
    left: 0;
    top:0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    //padding: 0 10px 10px 10px;
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
