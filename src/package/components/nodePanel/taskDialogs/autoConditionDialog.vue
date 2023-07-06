<template>
    <div>
        <el-dialog
            title="条件设置"
            :visible.sync="dialogVisible"
            width="650px"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :show-close="false"
            @closed="$emit('close')"
            custom-class="attendance-dialog">
            <div class="w100" style="mini-height:300px;">
                <el-form :model="formData" :inline="true" class="unit w100">
                    <div class="group" v-for="(group,index) in formData.group" :key="index">
                        <div class="w100">
                            <div class="ub w100">
                                <div class="ub ub-ac ub-pc" style='width:80px;'>AND</div>
                                <div class="ub ub-ver ub-f1">
                                    <div class="ub ub-ac ub-f1" v-for="(item,_index) in group.and" :key="_index">
                                        <div>
                                            <el-form-item label-width="0px">
                                                <el-select style="width:150px;" size="mini" v-model="item.field" placeholder="请选择字段" @change="changeFiled(item)">
                                                    <el-option v-for="filed in fields" :key="filed.value" :label="filed.label" :value="filed.value"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>
                                        <div>
                                            <el-form-item label-width="0px">
                                                <el-select style="width:150px;" size="mini" v-model="item.condition" placeholder="请选择">
                                                    <el-option
                                                        v-for="(relationship,relationshipIndex) in relationships"
                                                        :key="relationshipIndex"
                                                        :label="relationship.label"
                                                        :value="relationship.value"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>
                                        <div v-if="getFieldType(group,index,item,_index) === 'text'">
                                            <el-form-item label-width="0px">
                                                <el-input style="width:150px;" placeholder="请输入" clearable v-model.trim="item.val" size="mini"></el-input>
                                            </el-form-item>
                                        </div>
                                        <div v-if="getFieldType(group,index,item,_index) === 'select'">
                                            <el-form-item label-width="0px">
                                                <el-select  placeholder="请选择" style="width: 150px;" v-model="item.val" size="mini">
                                                    <el-option v-for="(tag,_index) in item.item" :label="tag.value" :value="tag.key" :key="_index"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>
                                        <div v-if="getFieldType(group,index,item,_index) === 'date'">
                                            <el-form-item label-width="0px">
                                                <el-date-picker
                                                    style="width:150px;"
                                                    size="mini"
                                                    v-model="item.val"
                                                    value-format="yyyy-MM-dd"
                                                    type="date"
                                                    placeholder="选择日期">
                                                </el-date-picker>
                                            </el-form-item>
                                        </div>
                                        <div v-if="getFieldType(group,index,item,_index) === 'dateTime'">
                                            <el-form-item label-width="0px">
                                                <el-date-picker
                                                    style="width:150px;"
                                                    size="mini"
                                                    v-model="item.val"
                                                    value-format="yyyy-MM-dd HH:mm:ss"
                                                    type="datetime"
                                                    placeholder="选择日期">
                                                </el-date-picker>
                                            </el-form-item>
                                        </div>
                                        <div class="close-box" v-if="_index>0" @click="deleteCon(group.and,_index)">
                                            <i class="el-icon-close"></i>
                                        </div>
                                        <div class="close-box" v-else></div>
                                    </div>
                                </div>
                            </div>
                            <div class="addbtn">
                                <el-button size="mini" type="text" icon="el-icon-plus" @click="addFun(group.and)">添加条件</el-button>
                                <el-button v-if="index>0" size="mini" type="text" icon="el-icon-close" @click="deleteGroupFun(formData.group,index)">删除组</el-button>
                            </div>
                        </div>
                        <el-divider class="condition" v-if="index>=0&&index<formData.group.length-1">OR</el-divider>

                    </div>

                    <el-divider></el-divider>
                    <div class="ub ub-pj ub-ac" style="width:98%;box-sizing: border-box;margin: 30px auto 0;">
                        <div>
                            <el-button size="mini" type="text" icon="el-icon-plus" @click="addGroupFun(formData.group)">添加组</el-button>
                        </div>
                    </div>
                </el-form>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" @click="saveData">确 定</el-button>
                <el-button size="small" @click="closeDialog">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import mixinPanel from '../../../common/mixinPanel'
import {
    get_selested_all_fileds,
    get_condition,
    get_selested_all_leak_fileds,
    getAlarmFieldcusor
} from '../../../../server/works_order/api.js'
export default {
    mixins: [mixinPanel],
    components: {
        // dropdownBox
    },
    props: {
        condition: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            dialogVisible: true,
            showParamDialog: false,
            nowIndex: null,
            relationships: [],
            fields: [],
            formData: {
                group: [{
                    and: [{
                        field: '',
                        condition: '',
                        val: ''
                    }]
                }]
            }

        }
    },

    mounted() {
        this.formData.group = this.$deepCopy(this.condition.length == 0 ? [{
            and: [{
                field: '',
                condition: '',
                val: ''
            }]
        }] : this.condition)
        console.log('this.formData.selectedList1111111', this.formData.group)
        this.$nextTick(() => {
            this.initCanSelectedFileds()
            this.initCondition()
        })
    },
    methods: {
        getFieldType(group, index, item, _index) {
            let field = item.field
            let selected = this.fields.filter(tag => tag.value === field)
            if (selected.length > 0) {
                if (selected[0].type === 'text') {
                    item.type = 'text'
                    return 'text'
                } else if (selected[0].type === 'select') {
                    item.type = 'select'
                    item.item = this.$deepCopy(selected[0].item)
                    return 'select'
                } else if (selected[0].type === 3) {
                    item.type = 'date'
                    return 'date'
                } else if (selected[0].type === 4) {
                    item.type = 'dateTime'
                    return 'dateTime'
                } else {
                    item.type = 'text'
                    return 'text'
                }
                // if (selected[0].type === 1) {
                //     item.type = 'text'
                //     return 'text'
                // }
                // if (selected[0].type === 2) {
                //     item.type = 'text'
                //     return 'text'
                // }

                // if (selected[0].type === 5) {
                //     item.type = 'text'
                //     return 'text'
                // }
                // if (selected[0].type === 6) {
                //     item.type = 'text'
                //     return 'text'
                // }
                // if (selected[0].type === 7) {
                //     item.type = 'text'
                //     return 'text'
                // }
            } else {
                item.type = 'text'
                return 'text'
            }
        },
        saveData() {
            let groups = []
            this.formData.group.map(item => {
                let obj = {}
                obj.and = []
                item.and.map(_item => {
                    let _obj = {}
                    _obj.fieldName = this.fields.filter(itm => itm.value === _item.field)[0].label
                    _obj.conditionName = this.relationships.filter(itm => itm.value === _item.condition)[0].label
                    _obj.type = _item.type
                    if (_item.type === 'select') {
                        _obj.item = this.$deepCopy(_item.item)
                        delete _item.item
                    }
                    delete _item.type
                    _obj.val = _item.val
                    obj.and.push(_obj)
                    return _item
                })
                groups.push(obj)
                return item
            })
            console.log(1111111, this.formData.group)
            console.log(222222222, groups)
            let obj = {
                data1: this.formData.group,
                data2: groups
            }
            this.$emit('getCondition', obj)
            console.log('this.formData', this.formData.group)
            this.closeDialog()
        },
        changeFiled(item) {
            console.log(item)
            item.val = ''
        },
        deleteCon(and, _index) {
            and.splice(_index, 1)
        },
        addFun(and) {
            and.push({
                field: '',
                condition: '',
                val: ''
            })
        },
        addGroupFun(group) {
            group.push({
                and: [{
                    field: '',
                    condition: '',
                    val: ''
                }]
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
            let baseForm = this.$getsessionStorage('baseForm')
            if (baseForm.sendId == 1) {
                get_selested_all_fileds(data).then(res => {
                    console.log('可选字段告警', res)
                    if (res.length > 0) {
                        res.forEach(item => {
                            let obj = {}
                            obj.value = item.value
                            obj.label = item.label
                            obj.type = item.type
                            if (item.item) {
                                obj.item = this.$deepCopy(item.item)
                            }
                            this.fields.push(obj)
                        })
                    }
                }).catch(error => {
                    console.log('error' + error)
                })
            } else if (baseForm.sendId == 2) {
                get_selested_all_leak_fileds(data).then(res => {
                    console.log('可选字段漏洞', res)
                    if (res.length > 0) {
                        res.forEach(item => {
                            let obj = {}
                            obj.value = item.value
                            obj.label = item.label
                            obj.type = item.type
                            if (item.item) {
                                obj.item = this.$deepCopy(item.item)
                            }
                            this.fields.push(obj)
                        })
                    }
                }).catch(error => {
                    console.log('error' + error)
                })
            } else {
                let dataTwo = {
                    queryData: {},
                    paramsData: {
                        id: baseForm.sendId
                    }
                }
                getAlarmFieldcusor(dataTwo).then(res => {
                    console.log('自定义字段', res)
                    if (res.length > 0) {
                        res.forEach(item => {
                            let obj = {}
                            obj.value = item.value
                            obj.label = item.label
                            obj.type = item.type
                            if (item.item) {
                                obj.item = this.$deepCopy(item.item)
                            }
                            this.fields.push(obj)
                        })
                    }
                }).catch(error => {
                    console.log('error' + error)
                })
            }
        },
        initCondition() {
            this.relationships = []
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_condition(data).then(res => {
                console.log('条件', res)
                if (res.length > 0) {
                    res.forEach(item => {
                        let obj = {}
                        obj.value = item.value
                        obj.label = item.name

                        this.relationships.push(obj)
                    })
                }
            }).catch(error => {
                console.log('error' + error)
            })
        },
        closeDialog() {
            // this.updateElement()
            this.dialogVisible = false
        }
    }
}
</script>

<style lang="scss" scoped>
    .flow-containers .el-badge__content.is-fixed {
        top: 18px;
    }

    .close-btn {
        cursor: pointer;
        font-size: 16px;
        color: #ff6060;
    }

    .condition {
        opacity: 1 !important;
        background-color: rgba(28, 215, 250, .5) !important;

        &::v-deep.el-divider__text {
            background-color: rgb(4, 33, 54);
            color: #fff;
        }
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
