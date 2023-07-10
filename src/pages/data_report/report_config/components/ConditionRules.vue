<template>
    <div class="wrapper">
        <div class="ub ub-ac" v-for="(item,index) in treeData" :key="index">
            <!--规则组-->
            <div v-if="item.intersymbol && item.children && item.children.length>0" class="ub ub-ac">
                <div class="and-btn">
                    <el-select style="width: 80px" size="mini" v-model="item.intersymbol" placeholder="请选择">
                        <el-option label="AND" value="y"></el-option>
                        <el-option label="OR" value="h"></el-option>
                    </el-select>
                </div>
                <div class="ub-f1 right-area">
                    <div v-for="(it,ix) in item.children" :key="ix">
                        <div v-if="it.intersymbol && it.children">
                            <ConditionRules
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
                                        v-for="select in getOperatorOptions(it)"
                                        :label="select.name"
                                        :value="select.code"
                                        :key="select.code"></el-option>
                                </el-select>
                                <el-input
                                    v-if="it.symbol==12||it.symbol==13"
                                    size="mini"
                                    style="width:250px;height:auto"
                                    :rows="2"
                                    :disabled = "(it.symbol == 9||it.symbol == 10)? true :false"
                                    v-model="it.value"
                                    placeholder="请输入内容"
                                    autocomplete="off"
                                    type="textarea"></el-input>
                                <el-input
                                    v-else
                                    style="width:250px;"
                                    size="mini"
                                    placeholder="请输入"
                                    :disabled = "(it.symbol == 9||it.symbol == 10)? true :false"
                                    v-model="it.value"
                                ></el-input>
                                <i style="cursor: pointer;font-size:16px;margin-left: 5px" class="iconfont icon-liebiaoshanchu" @click="deleteItem(item, ix, index, treeData)" />
                                <!-- <i v-if="ix>=1" style="cursor: pointer;font-size:16px;margin-left: 5px" class="iconfont icon-liebiaoshanchu" @click="deleteItem(item, ix)"/> -->
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
    options_other,
    options_ips
} from '../../config_data.js'
export default {
    name: 'ConditionRules',
    data() {
        return {
            // optionsData: []
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
                return this.value
            },
            set(val) {
                this.$emit('input', val)
            }
        }
    },
    created() {
        // console.log(this.treeData)
        // console.log(this.selectData, '------------')
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
        changeField(item) {
            item.symbol = ''
            let cur = this.selectData.filter(e => e.code === item.field)
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
        deleteItem(item, index, _index, treeData) {
            console.log(index, 'index')
            console.log(item, 'item')
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
</style>
