<template>
    <div class="wrapper">
        <div class="ub ub-ac" v-for="(item,index) in treeData" :key="index">
            <!--规则组-->
            <div v-if="item.intersymbol && item.children&&item.children.length>0" class="ub ub-ac">
                <div class="and-btn">
                    <el-select style="width: 80px" size="mini" v-model="item.intersymbol" placeholder="请选择">
                        <el-option label="AND" value="y"></el-option>
                        <el-option label="OR" value="h"></el-option>
                    </el-select>
                </div>
                <div class="ub-f1 right-area">
                    <div v-for="(it,ix) in item.children" :key="ix">
                        <div v-if="it.intersymbol && it.children">
                            <ConditionFilter
                                :inner-flag="true"
                                @delete-parent="item.children.splice(ix,1)"
                                :select-data="selectData"
                                :value="[it]" />
                            <div v-if="ix === item.children.length-1" class="ub btn">
                                <p @click="addItem(item)"><i class="el-icon-plus"/>添加条件</p>
                                <p @click="addGroup(item)"><i class="el-icon-plus"/>添加组</p>
                                <p v-if="innerFlag" @click="deleteGroup"><i class="el-icon-close"/>删除组</p>
                            </div>
                        </div>
                        <div v-else>
                            <div class="ub" :class="{'right-first': ix===0}" style="margin-bottom: 10px">
                                <!-- @change="clearAfterData(it)" -->
                                <el-select
                                    size="mini"
                                    v-model="it.field"
                                    @change="changeField(it)"
                                    filterable
                                    placeholder="请选择">
                                    <el-option
                                        v-for="(select) in selectData"
                                        :label="select.name"
                                        :value="select.code"
                                        :key="select.code"></el-option>
                                </el-select>
                                <el-select
                                    size="mini"
                                    style="margin: 0 10px"
                                    v-model="it.symbol"
                                    @change="changeSymbol(it)"
                                    placeholder="请选择">
                                    <el-option
                                        v-for="select in getSecond(it)"
                                        :label="select.label"
                                        :value="select.value"
                                        :key="select.value"></el-option>
                                </el-select>
                                <el-select
                                    v-if="selectDatas.includes(it.field)"
                                    v-model="it.value"
                                    style="width:280px;"
                                    placeholder="请选择"
                                    size="mini"
                                    multiple
                                    collapse-tags
                                    :disabled = "(it.symbol != 9 && it.symbol != 10) ? false :true">
                                    <el-option
                                        v-for="(k, j) in get_dropdown_select_data(it.field)"
                                        :key="j+'ab'"
                                        :value="k.value"
                                        :label="k.label">
                                    </el-option>
                                </el-select>
                                <el-date-picker
                                    v-model="it.value"
                                    v-else-if ="timeData.includes(it.value) && it.symbol != 11"
                                    size="mini"
                                    class="date-time"
                                    style="width:280px;"
                                    type="datetime"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    placeholder="选择日期时间">
                                </el-date-picker>
                                <el-date-picker
                                    v-else-if="it.symbol == 11"
                                    size="mini"
                                    v-model="it.value"
                                    type="datetimerange"
                                    style="width:280px;"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                                </el-date-picker>
                                <el-input
                                    v-else-if="it.symbol==12||it.symbol==13"
                                    size="mini"
                                    style="width:280px;height:auto"
                                    :rows="2"
                                    :disabled = "(it.symbol == 9||it.symbol == 10)? true :false"
                                    v-model="it.value"
                                    placeholder="请输入内容"
                                    autocomplete="off"
                                    type="textarea"></el-input>
                                <el-input
                                    v-else
                                    v-model="it.value"
                                    placeholder="请输入"
                                    clearable
                                    :disabled = "(it.symbol == 9||it.symbol == 10)? true :false"
                                    size="mini"
                                    style="width:280px;">
                                </el-input>
                                <i style="cursor: pointer;font-size:16px;margin-left: 5px" class="iconfont icon-liebiaoshanchu" @click="deleteItem(item, ix)"/>
                            </div>
                            <div v-if="ix === item.children.length-1" class="ub btn">
                                <p @click="addItem(item)"><i class="el-icon-plus"></i>添加条件</p>
                                <p v-if="!innerFlag"  @click="addGroup(item)"><i class="el-icon-plus"></i>添加组</p>
                                <p @click="deleteGroup" v-if="innerFlag"><i class="el-icon-close"/>删除组</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
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
    name: 'ConditionFilter',
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
        }
    },
    computed: {
        treeData: {
            get() {
                console.log('this.value', this.value)
                return this.value
            },
            set(val) {
                this.$emit('input', val)
            }
        }
    },
    created() {
        this.get_Branchs()
        this.get_attackType()
        this.get_Area()
        this.get_report_data_type()
    },
    // watch: {
    //     selectData: {
    //         handler(newVal, oldVal) {
    //             console.log(newVal)
    //             if (newVal) {
    //                 this.optionsData = this.$lodash.cloneDeep(newVal)
    //             }
    //         },
    //         immediate: true
    //     }
    // },
    methods: {
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
        changeField(item) {
            console.log(item, 'item')
            if (selectData.includes(item.field)) {
                item.value = []
            } else {
                item.value = ''
            }
            !item.symbol && (item.symbol = '')
            let cur = selectData.filter(e => e.code === item.field)
            if (cur.length > 0) {
                item.fieldType = cur[0].type
            }
        },
        changeSymbol(item) {
            if (item.symbol == 9 || item.symbol == 10) {
                item.value = ''
            }
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
            this.$eventBus.$emit('del-first')
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
        getSecond(item) {
            switch (item.field) {
                case 'time':
                    return this.options_time
                    // eslint-disable-next-line no-unreachable
                    break
                case 'attack_flow':
                    return this.options_attackTraffic
                    // eslint-disable-next-line no-unreachable
                    break
                default:
                    return this.options_other
                    // eslint-disable-next-line no-unreachable
                    break
            }
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
        background: #fff;
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
        margin-top: -20px;
        margin-right: 20px;
    }
    .and-btn:after {
        position: absolute;
        right: -10px;
        top: 48%;
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
        bottom: 20px;
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
    ::v-deep .el-date-editor .el-range-separator{
        width:7%;
    }
</style>
