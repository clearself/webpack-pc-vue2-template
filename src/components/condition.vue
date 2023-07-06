<template>
    <div class="condition" >
        <el-form  :model="fromData" :inline="true" class="unit w100">
            <div class="group" v-for="(group,index) in fromData.group" :key="index">
                <div class="w100">
                    <div class="ub ub-ac ub-pc w100" v-for="(item,_index) in group.list" :key="_index">
                        <div v-if="_index!=0" style="width:100px;">
                            <el-form-item label-width="0px">
                                <el-select size="mini" v-model="item.andOr" placeholder="请选择">
                                    <el-option label="AND" value="AND"></el-option>
                                    <el-option label="OR" value="OR"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div v-else style="width:100px;"></div>
                        <div>
                            <el-form-item label-width="0px">
                                <el-select style="width:300px;" size="mini" v-model="item.fieldName" placeholder="请选择字段" @change="changeFiled(item)" filterable>
                                    <el-option v-for="filed in fields" :key="filed.id" :label="filed.name" :value="filed.name"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div>
                            <el-form-item label-width="0px">
                                <el-select style="width:150px;" size="mini" v-model="item.relationship" placeholder="请选择">
                                    <el-option v-for="(relationship,relationshipIndex) in relationships" :key="relationshipIndex" :label="relationship.label" :value="relationship.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div
                            v-if="['告警时间', '接收时间'].includes(item.fieldName)"
                        >
                            <el-form-item label-width="0px">
                                <el-date-picker
                                    style="width:300px;"
                                    size="mini"
                                    v-model="item.val"
                                    type="datetime"
                                    value-format="timestamp"
                                    placeholder="选择日期时间">
                                </el-date-picker>
                            </el-form-item>
                        </div>
                        <div
                            v-else-if="['是否告警'].includes(item.fieldName)"
                        >   <el-form-item label-width="0px">
                            <el-select style="width:300px;" size="mini" v-model="item.val" placeholder="请选择">
                                <el-option label="是" :value="1"></el-option>
                                <el-option label="否" :value="0"></el-option>
                            </el-select>
                        </el-form-item>
                        </div>
                        <div v-else>
                            <el-form-item label-width="0px">
                                <el-input style="width:300px;" placeholder="请输入" clearable v-model.trim="item.val" size="mini"></el-input>
                            </el-form-item>
                        </div>

                        <div class="close-box" v-if="_index>0" @click="deleteCon(group.list,_index)">
                            <i class="el-icon-close"></i>
                        </div>
                        <div class="close-box" v-else></div>
                    </div>
                    <div class="addbtn">
                        <el-button size="mini" type="text" icon="el-icon-plus" @click="addFun(group.list)">添加条件</el-button>
                        <el-button v-if="index>0" size="mini" type="text" icon="el-icon-close" @click="deleteGroupFun(fromData.group,index)">删除组</el-button>
                    </div>
                </div>
                <el-divider v-if="index>=0&&index<fromData.group.length-1">
                    <el-form-item label-width="0px">
                        <el-select style="width:100px;" size="mini" v-model="group.andOr" placeholder="请选择字段">
                            <el-option label="AND" value="AND"></el-option>
                            <el-option label="OR" value="OR"></el-option>
                        </el-select>
                    </el-form-item>
                </el-divider>

            </div>

            <el-divider></el-divider>
            <div class="ub ub-pj ub-ac" style="width:90%;box-sizing: border-box;margin: 30px auto 0;">
                <div>
                    <el-button size="mini" type="text" icon="el-icon-plus" @click="addGroupFun(fromData.group)">添加组</el-button>
                </div>
                <div class="ub">
                    <cancel-btn title="取 消" @click="cancel" style="margin-right: 10px"></cancel-btn>
                    <!--<div class="ub ub-ac ub-pc reset-btn" @click="createRule">生成规则</div>-->
                    <searchBtn class="search-btn" title="搜 索" @click="getStr" />
                </div>
            </div>
        </el-form>
    </div>
</template>

<script>
import {
    get_selested_all_fileds
} from '../server/data_center/api.js'
export default {
    name: 'Condition',
    data() {
        return {
            relationships: [
                {
                    label: '>',
                    value: '>'
                },
                {
                    label: '=',
                    value: '='
                },
                {
                    label: '<',
                    value: '<'
                }, {
                    label: '!=',
                    value: '!='
                }, {
                    label: '>=',
                    value: '>='
                }, {
                    label: '<=',
                    value: '<='
                }, {
                    label: 'like',
                    value: 'like'
                }
            ],
            fields: [],
            fromData: {
                group: [
                    {
                        andOr: 'AND',
                        list: [
                            {
                                andOr: 'AND',
                                fieldName: '',
                                isStr: false,
                                relationship: '',
                                val: ''
                            }
                        ]
                    }
                ]
            }
        }
    },
    mounted() {
        this.initCanSelectedFileds()
    },
    methods: {
        createRule() {
            this.$emit('create')
        },
        cancel() {
            this.$emit('cancel')
        },
        getStr() {
            let str = ''
            console.log(this.fromData.group)
            this.fromData.group.map((item, index) => {
                if (item.list.some((_item, _index) => {
                    if (_item.fieldName == '' || _item.relationship == '' || _item.val === '') {
                        return true
                    } else {
                        return false
                    }
                })) {
                    this.$message({
                        message: '添加条件不能为空',
                        type: 'info'
                    })
                    return false
                }
                str += '('
                item.list.forEach((_item, _index) => {
                    let val = ''
                    if (_index != 0) {
                        str += ' ' + _item.andOr + ' '
                    }
                    if (_item.isStr) {
                        if (_item.relationship === 'like') {
                            val = "'%" + _item.val + "%'"
                        } else {
                            val = "'" + _item.val + "'"
                        }
                    } else {
                        if (_item.relationship === 'like') {
                            val = '%' + _item.val + '%'
                        } else {
                            val = _item.val
                        }
                    }

                    str += _item.fieldName + ' ' + _item.relationship + ' ' + `'${val}'`
                })
                str += ')'

                if (index < this.fromData.group.length - 1) {
                    str += ' ' + item.andOr + ' '
                }
            })
            if (str != '') {
                this.$emit('getResult', str)
            }
        },
        changeFiled(item) {
            console.log(item)
            let searchFieldName = this.fields.filter(_item => _item.name === item.fieldName)[0].searchFieldName
            console.log('searchFieldName', searchFieldName)
            if (searchFieldName.indexOf('keyword') > -1) {
                item.isStr = true
                console.log(item)
            } else {
                item.isStr = false
            }
            item.val = ''
            console.log(item)
        },
        deleteCon(list, _index) {
            list.splice(_index, 1)
        },
        addFun(list) {
            list.push({
                andOr: 'AND',
                fieldName: '',
                isStr: false,
                relationship: '',
                val: ''
            })
        },
        addGroupFun(group) {
            group.push({
                andOr: 'AND',
                list: [
                    {
                        andOr: 'AND',
                        fieldName: '',
                        isStr: false,
                        relationship: '',
                        val: ''
                    }
                ]
            })
        },
        deleteGroupFun(group, index) {
            group.splice(index, 1)
        },
        initCanSelectedFileds() {
            this.fields = []
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_selested_all_fileds(data).then(res => {
                console.log('可选字段', res)
                if (res.length > 0) {
                    res.forEach(item => {
                        let obj = {}
                        obj.id = item.id
                        // obj.totalNum = item.totalNum;
                        obj.show = false
                        obj.fixed = false
                        obj.name = item.name
                        obj.fieldName = item.fieldName
                        obj.searchFieldName = item.searchFieldName
                        this.fields.push(obj)
                        console.log(this.fields)
                    })
                }
            }).catch(error => {
                console.log('error' + error)
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .search-btn::v-deep.btn{
        width: 80px;
        height: 30px;
        border: none;
        background: none;
        font-size:12px;
        background-image: url(../assets/img/sure-btn.png);
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        i{
            display: none;
        }
    }
    .condition{
        width:100%;
    }
    .group{
        width:100%;
        margin: 10px auto;
    }
    .el-form-item{
        margin-bottom: 0;
    }
    .addbtn{
        width:90%;
        margin: 10px auto;
    }
    .el-divider{
        background-color:rgba(28,215,250,.2);
    }
    .condition::v-deep.el-divider__text{
        background-color: #033254;
        padding: 0 2px;
    }
    .reset-btn {
        width: 80px;
        height: 30px;
        background-color: #041f38;
        box-shadow: inset 0px 0px 10px 0px rgba(0, 167, 245, 0.97);
        border: solid 1px #39caf3;
        font-size: 12px;
        line-height: 15px;
        letter-spacing: 1px;
        color: #a2ceec;
        border-radius: 5px;
        margin-right: 10px;
        cursor: pointer;
        box-sizing:border-box;
    }
    .close-box {
        width: 26px;
        // height: 100%;
        color: #1cd7fa;
        text-align: center;
        line-height: 26px;
        cursor: pointer;
    }
</style>

