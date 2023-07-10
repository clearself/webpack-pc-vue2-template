<template>
    <div class="wrapper conditionRulesTips">
        <div class="ub ub-ac" v-for="(item,index) in treeData" :key="index">
            <!--规则组-->
            <div v-if="item.intersymbol && item.children" class="ub ub-ac">
                <div class="and-btn">
                    <span>{{ item.intersymbol === 'y' ? 'AND' : 'OR' }}</span>
                </div>
                <div class="ub-f1 right-area">
                    <div v-for="(it,ix) in item.children" :key="ix">
                        <div v-if="it.intersymbol && it.children">
                            <ConditionTips
                                :inner-flag="true"
                                :type='type'
                                @delete-parent="item.children.splice(ix,1)"
                                :select-data="selectData"
                                :value="[it]" />
                        </div>
                        <div v-else class="item-list">
                            <div class="ub item-tip" :class="{'right-first': ix===0}">
                                <!-- @change="clearAfterData(it)" -->
                                <div v-if="type==='filterConfig'">
                                    <span>{{ it.nameCn }}</span>
                                    <span>{{ it.termCn }}</span>
                                    <span>{{ filterValue(it) }}</span>
                                </div>

                                <div v-else>
                                    <span>{{ it.fieldCn }}</span>
                                    <span>{{ it.symbolCn }}</span>
                                    <span>{{ it.value }}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// import {
//     opt_string,
//     options_others,
//     options_other,
//     options_ips
// } from '../../config_data.js'
import {
    opt_string,
    options_others,
    // options_other,
    options_ips,

    selectData,
    allCondition,
    options_time,
    options_attackTraffic,
    options_other,
    options_blocked,
    options_deviceType,
    external_type_data,
    connect_condition_data,
    area_data,
    hash_name_data,
    virus_type_data,
    action_data,
    trade_condition,
    timeData
} from '../../config_data.js'
import {
    get_branch_city
} from '@/server/reporting_platform/setting.js'
import {
    public_page
} from '@/server/reporting_platform/report_config.js'
export default {
    name: 'ConditionTips',
    data() {
        return {
            report_data_type: [], // 报送数据类型数据源
            selectDatas: selectData,
            allCondition: allCondition,
            /* 第二列*/
            options_time: options_time,
            options_attackTraffic: options_attackTraffic,
            options_other: options_other,

            /* 第三列*/
            external_area: [],
            third_options_attackType: [], // 攻击类型
            options_blocked: options_blocked,
            // 本地外连设备类型数据源
            options_deviceType: options_deviceType,
            // 异常外连类型数据源
            external_type_data: external_type_data,
            // 连接情况数据源
            connect_condition_data: connect_condition_data,
            // 外联区域数据源
            area_data: area_data,
            hash_name_data: hash_name_data, //  哈希算法
            virus_type_data: virus_type_data, //  恶意代码类型
            action_data: action_data, //   处置动作
            trade_condition: trade_condition, // 涉及交易情况
            option_info_systems: [], // 信息系统
            timeData: timeData // 时间类型字段
        }
    },
    props: {
        value: {
            type: Array,
            default: () => []
        },
        innerFlag: {
            type: Boolean,
            default: false
        },
        selectData: {
            type: Array,
            default: () => []
        },
        type: {
            type: String,
            default: ''
        }

    },
    computed: {
        treeData: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input', val)
            }
        }
    },
    created() {
        if (this.third_options_attackType.type === 'filterConfig') {
            this.get_Branchs()
            this.get_attackType()
            this.get_Area()
            this.get_report_data_type()
        }
    },
    methods: {
        filterValue(obj) {
            if (selectData.includes(obj.name)) {
                let data_sources = this.get_dropdown_select_data(obj.name)
                let list = obj.val.split('!=!')
                return list.map(item => {
                    if (data_sources.some(_item => _item.value === item)) {
                        let name = data_sources.filter(_item => _item.value === item)[0].label
                        return name
                    } else {
                        return ''
                    }
                })
            } else if (timeData.includes(obj.name) && obj.term == 11) {
                return obj.val.split('!=!')
            } else {
                return obj.val
            }
        },
        get_dropdown_select_data(filed) {
            let name = filed
            if (name == 'external_area') { // 外部网络区域
                return this.area_data
            } else if (name == 'is_blocked') { // 是否封禁/阻断
                return this.options_blocked
            } else if (name == 'attack_type') { // 攻击类型
                return this.third_options_attackType
            } else if (name == 'destination_system_type') { // 被攻击系统类型 (信息系统)
                return this.option_info_systems
            } else if (name == 'data_type') { // 数据报送类型
                return this.report_data_type
            } else if (name == 'external_type') { // 异常外连类型数据源
                return this.external_type_data
            } else if (name == 'local_device_type') { // 本地外连设备类型
                return this.options_deviceType
            } else if (name == 'local_system_type') { // 本地外连系统类型(信息系统)
                return this.option_info_systems
            } else if (name == 'connect_condition') { // 连接情况
                return this.connect_condition_data
            } else if (name == 'area') { // 外联区域
                return this.area_data
            } else if (name == 'institution_branch_area') { // 风险发生地区
                return this.option_area
            } else if (name == 'device_type') { // 感染设备类型
                return this.options_deviceType
            } else if (name == 'system_type') { // 感染系统类型(信息系统)
                return this.option_info_systems
            } else if (name == 'hash_name') { // 哈希算法
                return this.hash_name_data
            } else if (name == 'virus_type') { // 恶意代码类型
                return this.virus_type_data
            } else if (name == 'action') { // 处置动作
                return this.action_data
            } else if (name == 'befaked_url_type') { // 被仿冒网站业务类型(信息系统)
                return this.option_info_systems
            } else if (name == 'trade_condition') { // 涉及交易情况
                return this.trade_condition
            }
        },
        get_Area() {
            this.option_area = [] // 分支所属city
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_branch_city(data).then(res => {
                console.log('所属区域', res)
                if (res.length > 0) {
                    res.forEach(item => {
                        let object = {}
                        object.label = item.name
                        object.value = item.code
                        this.option_area.push(object)
                    })
                }
            }).catch(error => {
                console.log('error', error)
            })
        },
        // 获取报送数据类型数据源
        get_report_data_type() {
            this.report_data_type = []
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
                this.report_data_type = res.records.map(e => {
                    let obj = {
                        value: e.code,
                        label: e.name
                    }
                    return obj
                })
            }).catch((error) => {
                console.log('error' + error)
            })
        },
        // 获取信息系统数据源
        get_Branchs() {
            this.option_info_systems = [] // 信息系统
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
                this.option_info_systems = res.records.map(e => {
                    let obj = {
                        value: e.code,
                        label: e.name
                    }
                    return obj
                })
            }).catch((error) => {
                console.log('error' + error)
            })
        },
        // 获取攻击类型数据源
        get_attackType() {
            this.third_options_attackType = []
            let data = {
                queryData: {
                    page: 1,
                    pageSize: 1000
                },
                paramsData: {
                    type: 2
                }
            }
            public_page(data).then(res => {
                this.third_options_attackType = res.records.map(e => {
                    let obj = {
                        value: e.code,
                        label: e.name
                    }
                    return obj
                })
            }).catch((error) => {
                this.loading = false
                console.log('error' + error)
            })
        },
        getOperatorOptions(it) {
            console.log(it)
            let list = this.get_tj(it.field, this.selectData)
            return list.length > 0 ? list : []
        },
        addItem(item) {
            item.children.push({
                field: '',
                symbol: '',
                value: ''
            })
        },
        deleteItem(item, index) {
            item.children.splice(index, 1)
        },
        addGroup(item) {
            item.children.push({
                intersymbol: 'y',
                children: [
                    {
                        field: '',
                        symbol: '',
                        value: ''
                    }
                ]
            })
        },
        /* 父级删除*/
        deleteGroup(data, index) {
            console.log(data)
            this.$emit('delete-parent')
        },
        get_tj(field, columnNames = []) {
            let terms = []
            if (field) {
                let cur = columnNames.filter(item => item.code === field)
                if (cur.length > 0) {
                    if (['srcIp', 'desIp'].includes(field)) {
                        let options = cur[0].type == 1 ? [...opt_string, options_ips] : [...options_others, ...options_ips]
                        terms = options.map(item => {
                            return {
                                code: item.value,
                                name: item.label
                            }
                        })
                    } else {
                        terms = cur[0].type == 1 ? opt_string.map(item => {
                            return {
                                code: item.value,
                                name: item.label
                            }
                        }) : options_others.map(item => {
                            return {
                                code: item.value,
                                name: item.label
                            }
                        })
                    }
                } else {
                    if (['srcIp', 'desIp'].includes(field)) {
                        let options = [...options_other, ...options_ips]
                        terms = options.map(item => {
                            return {
                                code: item.value,
                                name: item.label
                            }
                        })
                    } else {
                        terms = options_other.map(item => {
                            return {
                                code: item.value,
                                name: item.label
                            }
                        })
                    }
                }
            } else {
                terms = options_other.map(item => {
                    return {
                        code: item.value,
                        name: item.label
                    }
                })
            }
            return terms
        }
    }
}
</script>

<style scoped lang="scss">

    .wrapper {
        background: transparent;
        margin-bottom: 10px;
        // min-height: 100px;
        overflow: auto;
    }
    .btn {
        p {
            height: 20px;
            line-height: 20px;
            cursor: pointer;
            color: rgba(0, 0, 0, 0.4);
            margin-right: 10px;
            margin-bottom: 10px;
            font-size: 12px;
        }
        p:hover{
            color:#387dee;
        }
    }
    .el-icon-close {
        color: rgba(0, 0, 0, 0.4);
    }
    .and-btn {
        position: relative;
        // margin-top: -20px;
        margin-right: 20px;
        font-size:12px;
    }
    .and-btn:after {
        position: absolute;
        right: -10px;
        top: 50%;
        content: '';
        width: 10px;
        height: 1px;
        background: #dcdcdc;
    }
    .right-area{
        position: relative;
    }
    .right-area:before {
        position: absolute;
        left: -10px;
        top: 10px;
        bottom: 8px;
        content: '';
        width: 1px;
        background: #dcdcdc;
    }
    .btn{
        position: relative;
    }
    .btn:before {
        position: absolute;
        width: 10px;
        height: 1px;
        left: -10px;
        background: #dcdcdc;
        content: '';
        top: 10px;
    }
    .btn:after {
        //position: absolute;
        //width: 10px;
        //left: -10px;
        //background: #033254;
        //content: '';
        //top: 11px;
        //bottom: 0;
        //z-index: 99;
    }
    .right-first{
        position:relative;
    }
    .right-first:before {
        position: absolute;
        width: 10px;
        height: 1px;
        left: -10px;
        background: #dcdcdc;
        content: '';
        top: 10px;
    }
</style>
<style lang="scss">
.item-tip{
    line-height: 20px!important;
    font-size:12px;
    margin-bottom: 0;
    position: relative;
}
.item-list>div.item-tip:last-child::before{
    position: absolute;
    width: 10px;
    height: 1px;
    left: -10px;
    background: #dcdcdc;
    content: "";
    top: 10px;
}
</style>
