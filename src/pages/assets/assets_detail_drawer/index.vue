<template>
    <el-drawer :visible.sync="assetsSeeDialog" direction="rtl" :size="1200" :wrapperClosable="false" :before-close="handleClose" title="详情" :modal="false" v-if="assetsSeeDialog">
        <div class="drawer-content">
            <div style="position: relative;top: 0;left: 0;overflow-y: auto;width: 100%;height: 100%;">

                <div class="drawer-pad">
                    <el-tabs v-model="activeData">
                        <el-tab-pane label="资产信息" name="first" v-if="sys == ''">
                            <AssetsInfo :infoData="infoData" v-if="activeData == 'first'"></AssetsInfo>
                        </el-tab-pane>
                        <el-tab-pane label="业务系统" name="first" v-if="sys == 'system'">
                            <relationWork :infoData="infoData" v-if="activeData == 'first'" :seeSystem="seeSystem"></relationWork>
                        </el-tab-pane>
                        <el-tab-pane label="关联事件" name="two">
                            <RelationEvent :ipsData="ipsData" v-if="activeData == 'two'"></RelationEvent>
                        </el-tab-pane>
                        <el-tab-pane label="关联告警" name="three">
                            <RelationAlarm :ipsData="ipsData" v-if="activeData == 'three'"></RelationAlarm>
                        </el-tab-pane>
                        <el-tab-pane label="关联日志" name="four">
                            <relationLog :ipsData="ipsData" v-if="activeData == 'four'"></relationLog>
                        </el-tab-pane>
                        <el-tab-pane label="关联漏洞" name="five">
                            <relation-leak :ipsData="ipsData" :assetsId="assetsId" v-if="activeData == 'five'"></relation-leak>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </div>
    </el-drawer>
</template>

<script>
import AssetsInfo from './tabs/assets_info.vue'
import relationLeak from './tabs/relation_leak.vue'
import RelationEvent from './tabs/relation_event.vue'
import relationLog from './tabs/relation_log.vue'
import RelationAlarm from './tabs/relation_alarm.vue'
import relationWork from './tabs/relation_work.vue'

import {
    getFieldByAll
} from '@/server/assets/assets_info_log.js'
import {
    getFieldByAllAlarm
} from '@/server/assets/assets_info_alarm.js'
import {
    getField
} from '@/server/assets/api.js'

export default {
    props: {
        assetsSeeDialog: {
            type: Boolean,
            default: false
        },
        activeName: {
            type: String,
            default: 'first'
        },
        system: {
            type: String,
            default: ''
        }
    },
    watch: {
        activeName: {
            handler: function(value) {
                console.log(value)
                this.activeData = value
            }
        },
        system: {
            handler: function(value) {
                this.sys = value
            }
        }
    },
    components: {
        AssetsInfo,
        relationLeak,
        RelationEvent,
        relationLog,
        RelationAlarm,
        relationWork
    },
    data() {
        return {
            activeData: this.activeName,
            assetsId: '',
            ipsData: [],
            infoData: {},
            sys: '',
            seeSystem: [],
            list1: [],
            listAll1: [],
            list2: [],
            listAll2: []
        }
    },
    created() {
        // if (this.activeData == 'four') {
        // this.initCanSelectedFileds()
        // this.getStashFields()
        // } else if (this.activeData == 'three') {
        // this.initCanSelectedFiledsAlarm()
        // this.getStashFieldsAlarm()
        // }
    },
    methods: {
        handleClose() {
            // this.activeData = 'first'
            this.$parent.drawerSeeDialog = false
        },
        setData(val) {
            const arr3 = this.listAll1.filter((item) => {
                return val.some(i => item.fieldId == i)
            })
            return arr3
        },
        setDataAlarm(val) {
            const arr3 = this.listAll2.filter((item) => {
                return val.some(i => item.fieldId == i)
            })
            return arr3
        },
        initCanSelectedFileds() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            /* 先获取已选的字段，在获取所有字段，避免左侧抖动*/
            // this.initSelectedFileds()
            getFieldByAll(data).then(res => {
                this.listAll1 = []
                return res
            }).then(res => {
                console.log('所有综合可选字段', res)
                if (res.length > 0) {
                    res.forEach(item => {
                        let obj = {}
                        obj.fieldId = item.fieldId
                        obj.show = false
                        // obj.fixed = false
                        // obj.top5 = []
                        obj.name = item.name
                        obj.fieldName = item.field
                        obj.type = item.type
                        if (item.enums) {
                            obj.enums = item.enums
                        }
                        this.listAll1.push(obj)
                    })
                }
            }).catch(error => {
                console.log('error' + error)
            })
        },
        getStashFields() {
            let data = {
                queryData: {},
                paramsData: {
                    menuTag: 'assets_rz'
                }
            }
            getField(data).then(res => {
                // this.list = []
                // this.listAll = []
                // this.selectAll = []
                return res
            }).then(res => {
                console.log('缓存字段', res)
                this.list1 = this.setData(res)
                console.log('list字段', this.list)
                // this.listAll = res.allField ?? []
                // this.selectAll = res.allField.map(it => {
                //     return Object.assign({}, it, { fieldName: it.field })
                // })
                // this.list = res.logStorage ?? []
            }).catch(err => {
                console.log(err, 'err')
            })
        },
        initCanSelectedFiledsAlarm() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            /* 先获取已选的字段，在获取所有字段，避免左侧抖动*/
            // this.initSelectedFileds()
            getFieldByAllAlarm(data).then(res => {
                this.listAll2 = []
                return res
            }).then(res => {
                console.log('所有综合可选字段', res)
                if (res.length > 0) {
                    res.forEach(item => {
                        let obj = {}
                        obj.fieldId = item.fieldId
                        obj.show = false
                        // obj.fixed = false
                        // obj.top5 = []
                        obj.name = item.name
                        obj.fieldName = item.field
                        obj.type = item.type
                        if (item.enums) {
                            obj.enums = item.enums
                        }
                        this.listAll2.push(obj)
                    })
                }
            }).catch(error => {
                console.log('error' + error)
            })
        },
        getStashFieldsAlarm() {
            let data = {
                queryData: {},
                paramsData: {
                    menuTag: 'assets_gj'
                }
            }
            getField(data).then(res => {
                // this.list = []
                // this.listAll = []
                // this.selectAll = []
                return res
            }).then(res => {
                console.log('缓存字段', res)
                this.list2 = this.setData(res)
                console.log('list字段', this.list)
                // this.listAll = res.allField ?? []
                // this.selectAll = res.allField.map(it => {
                //     return Object.assign({}, it, { fieldName: it.field })
                // })
                // this.list = res.logStorage ?? []
            }).catch(err => {
                console.log(err, 'err')
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    $zero: #00bcd4;
    $one: #00c7ff;
    $two: #f2cd00;
    $three: #fc7f00;
    $fore: #fd0001;
    $status1: #ffdd00;
    $status2: #01ff01;
    $status3: #00e1fd;
    $status4: #e1e2e4;
    .list-tip {
        position: relative;
        height: 24px;
        font-size: 14px;
        color: #1c1c1c;
        line-height: 24px;
    }
    .drawer-pad {
        overflow-y: auto;
        // padding: 0 20px;
        height: calc(100% - 53px);
        & ::v-deep img {
            max-width: 600px;
            max-height: 600px;
        }
        &::-webkit-scrollbar, li::-webkit-scrollbar, ul::-webkit-scrollbar {
            width: 4px;
        }
        &::-webkit-scrollbar-track, li::-webkit-scrollbar-track, ul::-webkit-scrollbar-track {
            background: none;
        }
    }
    .drawer-pad ::v-deep .el-form-item__content {
        font-size: 12px;
    }
    .drawer-pad ::v-deep .el-form-item__label {
        font-size: 12px;
        color: #999999!important;
    }
    .title-level {
        margin: 0 5px;
        padding: 2px 10px;
        font-size: 12px;
        border-radius: 3px;
        color: $zero;
        line-height: 1;
        &.one {
            color: $one;
        }
        &.two {
            color: $two;
        }
        &.three {
            color: $three;
        }
        &.fore {
            color: $fore;
        }
    }
    .el-tabs ::v-deep .el-tabs__nav-wrap::after {
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 1;
        width: 100%;
        height: 1px;
        background-color: #e7e7e7;
        content: '';
    }
    .el-tabs ::v-deep .el-tabs__active-bar {
        background: #387dee;
        // margin-left: 14px;
    }
    .el-tabs ::v-deep .el-tabs__item.is-active {
        height: 34px;
        border: none !important;
        color: #387dee;
        box-shadow: none !important;
        line-height: 34px;
    }

</style>
