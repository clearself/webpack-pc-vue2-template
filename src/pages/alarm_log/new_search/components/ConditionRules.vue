<template>
    <div class="wrapper">
        <div class="ub ub-ac" v-for="(item,index) in treeData" :key="index">
            <!--规则组-->
            <div v-if="item.connect && item.children" class="ub ub-ac">
                <div class="and-btn">
                    <el-select style="width: 80px" size="mini" v-model="item.connect" placeholder="请选择">
                        <el-option label="AND" value="and"></el-option>
                        <el-option label="OR" value="or"></el-option>
                        <!-- <el-option label="NOT" value="not"></el-option> -->
                    </el-select>
                </div>
                <div class="ub-f1 right-area">
                    <div v-for="(it,ix) in item.children" :key="ix">
                        <div v-if="it.connect && it.children">
                            <ConditionRules
                                :inner-flag="true"
                                @delete-parent="item.children.splice(ix,1)"
                                :select-data="selectData"
                                :tree-data="[it]" />
                            <div v-if="ix === item.children.length-1" class="ub btn">
                                <p @click="addItem(item)"><i class="el-icon-plus"/>添加条件</p>
                                <p @click="addGroup(item)"><i class="el-icon-plus"/>添加组</p>
                                <p v-if="innerFlag" @click="deleteGroup"><i class="el-icon-close"/>删除组</p>
                            </div>
                        </div>
                        <div v-else>
                            <div class="ub ub-ac" :class="{'right-first': ix===0}" style="margin-bottom: 10px">
                                <el-select
                                    size="mini"
                                    v-model="it.field"
                                    @change="clearAfterData(it)"
                                    filterable
                                    placeholder="请选择">
                                    <el-option
                                        v-for="(select) in selectData"
                                        :label="select.name"
                                        :value="select.fieldName"
                                        :key="select.fieldId"></el-option>
                                </el-select>
                                <el-select
                                    size="mini"
                                    style="margin: 0 10px"
                                    v-model="it.operator"
                                    placeholder="请选择">
                                    <el-option
                                        v-for="(select, num) in getOperatorOptions(it)"
                                        :label="select.label"
                                        :value="select.value"
                                        :key="num"></el-option>
                                </el-select>
                                <el-select
                                    size="mini"
                                    v-model="it.dataType"
                                    @change="it.value = ''"
                                    style="margin-right: 10px;width: 80px"
                                    placeholder="请选择">
                                    <el-option label="常量" :value="1"></el-option>
                                    <el-option label="变量" :value="2"></el-option>
                                </el-select>
                                <el-select
                                    v-if="it.attrType === 5 && it.dataType !== 2"
                                    size="mini"
                                    v-model="it.value"
                                    placeholder="请选择">
                                    <el-option
                                        v-for="(select, num) in getEnumOptions(it.field)"
                                        :label="select.label"
                                        :value="select.value"
                                        :key="num">
                                    </el-option>
                                </el-select>
                                <el-date-picker
                                    v-model="it.value"
                                    v-if="it.attrType === 3 && it.dataType !== 2"
                                    style="width: 180px;font-size: 12px"
                                    class="handleTime"
                                    popper-class="handleDrop"
                                    type="datetime"
                                    size="mini"
                                    value-format="timestamp"
                                    placeholder="选择日期时间">
                                </el-date-picker>
                                <el-select
                                    v-if="it.dataType === 2"
                                    size="mini"
                                    v-model="it.value"
                                    filterable
                                    placeholder="请选择">
                                    <el-option
                                        v-for="(select) in selectData"
                                        :label="select.name"
                                        :value="select.fieldName"
                                        :key="select.fieldId"></el-option>
                                </el-select>
                                <el-input
                                    v-if="it.attrType !== 3 && it.attrType !== 5 && it.dataType !== 2"
                                    v-model="it.value"
                                    placeholder="请输入值"
                                    size="mini"
                                    clearable
                                    style="width: 180px"></el-input>
                                <i v-if="ix>=1" style="cursor: pointer;font-size:16px;margin-left: 5px" class="iconfont icon-liebiaoshanchu" @click="deleteItem(item, ix)"/>
                            </div>
                            <div v-if="ix === item.children.length-1" class="ub btn">
                                <p @click="addItem(item)"><i class="el-icon-plus"></i>添加条件</p>
                                <p @click="addGroup(item)"><i class="el-icon-plus"></i>添加组</p>
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
/*
* 字符 1、IP 4： = , !=,  like
* 数字 2、时间 3：=, >, <, !=
* 枚举 5： =， ！=
* */
export default {
    name: 'ConditionRules',
    data() {
        return {
            optionsData: [],
            operatorOptions: {
                str: [
                    { label: '=', value: '=' },
                    { label: '!=', value: '!=' },
                    { label: 'like', value: 'like' }
                ],
                number: [
                    { label: '<', value: '<' },
                    { label: '<=', value: '<=' },
                    { label: '>', value: '>' },
                    { label: '>=', value: '>=' },
                    { label: '=', value: '=' },
                    { label: '!=', value: '!=' }
                ],
                enum: [
                    { label: '=', value: '=' },
                    { label: '!=', value: '!=' }
                ]
            }
        }
    },
    props: ['treeData', 'innerFlag', 'eventType', 'selectData'],
    created() {
        console.log(this.treeData)
        console.log(this.selectData, '------------')
    },
    watch: {
        selectData: {
            handler(newVal, oldVal) {
                console.log(newVal)
                if (newVal) {
                    this.optionsData = this.$lodash.cloneDeep(newVal)
                }
            },
            immediate: true
        }
    },
    methods: {
        getOperatorOptions(it) {
            console.log(it)
            if (it.attrType === 1 || it.attrType === 4) {
                return this.operatorOptions.str
            } else if (it.attrType === 2 || it.attrType === 3) {
                return this.operatorOptions.number
            } else if (it.attrType === 5) {
                return this.operatorOptions.enum
            } else {
                return []
            }
        },
        addItem(item) {
            item.children.push({
                field: '',
                operator: '',
                value: '',
                dataType: 1,
                attrType: 1
            })
        },
        deleteItem(item, index) {
            item.children.splice(index, 1)
        },
        addGroup(item) {
            item.children.push({
                connect: 'and',
                children: [
                    {
                        field: '',
                        operator: '',
                        value: '',
                        dataType: 1,
                        attrType: 1
                    }
                ]
            })
        },
        /* 父级删除*/
        deleteGroup(data, index) {
            console.log(data)
            this.$emit('delete-parent')
        },
        getEnumOptions(labelVal) {
            console.log(labelVal)
            let item = this.optionsData.find(it => it.fieldName === labelVal)
            console.log(this.optionsData)
            if (item && item.enums) {
                return item.enums
            } else {
                return []
            }
        },
        clearAfterData(item) {
            console.log(item)
            let selectItem = this.optionsData.find(it => it.fieldName === item.field)
            if (selectItem) {
                item.attrType = selectItem.type
            } else {
                item.attrType = 1
            }

            item.operator = ''
            item.value = ''
            item.dataType = 1
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
