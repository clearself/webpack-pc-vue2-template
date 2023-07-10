<template>
    <div class="event event-wrapper field_mapping">
        <div class="ub ub-pj w100 mb-1">
            <div class="list-tips">字段映射</div>
        </div>
        <div class="ub w100 card-container">
            <el-tabs class="event_data" tab-position="left" v-model="activeName" @tab-click="handleClick">
                <el-tab-pane v-for="item in eventTypeList" :key="item.code" :label="item.name" :name="item.code"></el-tab-pane>
            </el-tabs>
            <div class="bub ub-f1 ub-ver card-form" >
                <div class="ub ub-pe mb-2">
                    <el-button size="mini" @click="handleRefresh">刷新</el-button>
                    <el-button size="mini" type="primary" @click="handleSave">保存</el-button>
                </div>
                <div class="formList" v-loading="loading" :style="{'height':autoHeight+'px'}">
                    <el-form ref="formInline" :model="formInline" label-position="right" label-width="120px">
                        <div v-for="(_item,index) in formInline.fieldMappingDTOS" :key="_item.uid" class="whole">
                            <div class="ub ub-f1 ub-pj p-2" >
                                <div class="ub ub-ac ub-f1" >
                                    <el-form-item
                                        label="上报字段："
                                        :prop="'fieldMappingDTOS.'+ index +'.reportField'"
                                        :rules="{required: true,message: '请选择上报字段',trigger: 'change'}"
                                        style="width:33%;margin:0">
                                        <el-select clearable size="small" v-model="_item.reportField" filterable placeholder="请选择" style="width:100%" @change="fieldChange(_item)">
                                            <el-option v-for="item in reportField" :key="item.code" :label="item.name" :value="item.code">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item
                                        label="系统字段："
                                        :prop="'fieldMappingDTOS.'+ index +'.systemField'"
                                        :rules="[
                                            {
                                                required: true,
                                                validator: ((rule, value, callback) => {
                                                    validateLeval(rule, value, callback,index,_item) }), trigger: 'change'
                                            }
                                        ]"
                                        style="width:33%;margin:0">
                                        <el-select @change="sysFieldChange(_item)" clearable size="small" v-model="_item.systemField" filterable placeholder="请选择" style="width:100%">
                                            <el-option v-for="item in columnNames" :key="item.code" :label="item.name" :value="item.code">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item
                                        v-if="isrequired(_item)"
                                        label="默认值："
                                        :key="_item.uid"
                                        :prop="'fieldMappingDTOS.'+ index +'.defaultValue'"
                                        :rules="{required: true,message: '请输入',trigger:'blur'}"
                                        style="width:33%;margin:0">
                                        <el-input size="small" v-model="_item.defaultValue" placeholder="请输入"></el-input>
                                    </el-form-item>
                                    <!--  -->
                                    <el-form-item
                                        v-else
                                        label="默认值："
                                        style="width:33%;margin:0">
                                        <el-input size="small" v-model="_item.defaultValue" placeholder="请输入"></el-input>
                                    </el-form-item>
                                </div>
                                <div class="ub ub-ac ub-pj btn-list">
                                    <i class="add-btn el-icon-plus" v-if="index+1 == formInline.fieldMappingDTOS.length" @click="addReports(_item)"></i>
                                    <i class="del-btn el-icon-delete-solid" v-if="index !== 0" @click="removeReports(index)"></i>
                                </div>
                            </div>
                            <div v-for="(val,index1) in _item.mappingList" :key="index1">
                                <div class="ub ub-f1 ub-pj p-2" >
                                    <div class="ub ub-ac ub-f1" >
                                        <el-form-item
                                            label="映射类型："
                                            style="width:33%;margin:0">
                                            <el-input size="small" v-model="val.mappedType" disabled placeholder="请输入"></el-input>
                                        </el-form-item>
                                        <el-form-item
                                            label="匹配值："
                                            style="width:33%;margin:0">
                                            <el-input size="small" v-model="val.mappedVal" placeholder="请输入"></el-input>
                                        </el-form-item>
                                        <el-form-item
                                            label="映射值："
                                            style="width:33%;margin:0">
                                            <el-input size="small" v-model="val.matchVal" placeholder="请输入"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="ub ub-ac ub-pj btn-list">
                                        <i class="add-btn el-icon-circle-plus-outline" v-if="index1+1 == _item.mappingList.length" @click="addMappings(_item)"></i>
                                        <i class="del-btn el-icon-remove-outline" @click="removeMapping(index1,_item)"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-form>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import {
    getLeftMenu,
    getLogFieldList,
    getFieldMapping,
    getReportField,
    saveFieldMapping
} from '@/server/reporting_platform/report_config.js'
import { v4 as uuidv4 } from 'uuid'
import initData from '@/mixins/initData.js'
export default {
    name: 'FieldMapping',
    mixins: [initData],
    data() {
        var validateLeval = (rule, value, callback, index, item) => {
            console.log(item, 'item')
            if (value === '' || value === null) {
                callback(new Error('选择系统字段'))
            } else if (item.reportType && item.systemType) {
                if ((item.reportType == 3 && item.systemType != 3) || (item.reportType == 1 && item.systemType == 3)) {
                    callback(new Error('该字段与上报字段类型不一致'))
                } else {
                    callback()
                }
            } else {
                callback()
            }
        }
        return {
            validateLeval,
            loading: false,
            autoHeight: document.body.clientHeight - 300,
            eventTypeList: [], // 事件类型
            activeName: '',
            formInline: {
                fieldMappingDTOS: []
            },
            columnNames: [], // 系统字段
            reportField: [], // 上报字段
            fieldName: ''
        }
    },
    watch: {

    },
    methods: {
        isrequired(item) {
            console.log(item, 'item22')
            let cur = this.reportField.filter(e => e.code === item.reportField)
            if (cur.length > 0) {
                return cur[0].isDefault == 1
            } else {
                return false
            }
        },
        // 切换tab标签
        handleClick() {
            this.getReportField()
        },
        // 刷新
        handleRefresh() {
            this.getLogFieldList()
        },
        // 编辑
        handleSave() {
            this.$refs.formInline.validate((valid) => {
                if (valid) {
                    this.saveFieldMapping()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        // 保存
        saveFieldMapping() {
            console.log(this.formInline.fieldMappingDTOS, 'this.formInline.fieldMappingDTOS')
            // if (this.formInline.fieldMappingDTOS.some(item => (item.reportType == 3 && item.systemType != 3) || (item.reportType == 1 && item.systemType == 3))) {
            //     this.$message({
            //         message: '存在上报字段与所选系统字段类型不一致情况',
            //         type: 'warning'
            //     })
            //     return
            // }
            let data = {
                queryData: {},
                paramsData: {
                    type: this.activeName,
                    fieldMappingDTOS: this.formInline.fieldMappingDTOS
                }
            }
            saveFieldMapping(data).then(res => {
                this.$message({
                    message: '编辑成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.getFieldMapping()
                }, 500)
            })
        },
        // 添加上报信息
        addReports() {
            this.formInline.fieldMappingDTOS.push({
                uid: uuidv4(),
                reportField: '',
                reportType: '',
                systemType: '',
                systemField: '',
                defaultValue: '',
                mappingList: []
            })
        },
        // 删除上报信息
        removeReports(index) {
            this.formInline.fieldMappingDTOS.splice(index, 1)
        },
        // 添加映射
        addMappings(data) {
            data.mappingList.push({
                mappedType: '文本',
                mappedVal: '',
                matchVal: ''
            })
        },
        // 删除映射
        removeMapping(index, data) {
            data.mappingList.splice(index, 1)
        },
        // 上报字段切换
        fieldChange(data) {
            console.log(data, '当前上报字段')
            let reportFiuleds = this.reportField.filter(item => item.code === data.reportField)
            data.reportType = reportFiuleds.length > 0 ? reportFiuleds[0].type : ''
            console.log(data, '当前上报字段')
            this.fieldName = reportFiuleds.length > 0 ? reportFiuleds[0].name : ''
            let arr = ['篡改类型', '篡改意图类型', '哈希算法']
            data.mappingList = []
            if (arr.includes(this.fieldName)) {
                data.mappingList.push({
                    mappedType: '文本',
                    mappedVal: '',
                    matchVal: ''
                })
            }
        },
        sysFieldChange(data) {
            console.log(data, '当前上报字段')
            let systemFiuleds = this.columnNames.filter(item => item.code === data.systemField)
            data.systemType = systemFiuleds.length > 0 ? systemFiuleds[0].type : ''
            console.log(data, '当前上报字段')
        },
        // 获取系统字段集合
        getLogFieldList() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            this.columnNames = []
            getLogFieldList(data).then(res => {
                console.log(res, '获取系统字段')
                this.columnNames = res
            })
        },
        // 获取上报字段集合
        getReportField() {
            getReportField(this.activeName).then(res => {
                console.log(res, '获取上报字段')
                this.reportField = res
                this.getFieldMapping()
            })
        },
        // 获取上报配置字段映射数据
        getFieldMapping() {
            this.formInline.fieldMappingDTOS = []
            this.loading = true
            getFieldMapping(this.activeName).then(res => {
                this.loading = false
                if (res.length > 0) {
                    this.formInline.fieldMappingDTOS = res.map(item => {
                        console.log('item', item)

                        item.uid = uuidv4()
                        let reportTypes = this.reportField.filter(_item => _item.code === item.reportField)
                        let systemTypes = this.columnNames.filter(_item => _item.code === item.systemField)
                        item.reportType = reportTypes.length > 0 ? reportTypes[0].type : ''
                        item.systemType = systemTypes.length > 0 ? systemTypes[0].type : ''
                        return item
                    })
                    console.log(this.formInline.fieldMappingDTOS, '字段回显')
                } else {
                    this.formInline.fieldMappingDTOS.push({
                        uid: uuidv4(),
                        reportField: '',
                        systemField: '',
                        reportType: '',
                        systemType: '',
                        defaultValue: '',
                        mappingList: []
                    })
                }
            }).catch(() => {
                this.loading = false
            })
        },
        // 获取事件类型集合
        getLeftMenu() {
            let promise = new Promise((resolve, reject) => {
                getLeftMenu().then(res => {
                    this.eventTypeList = res.filter(item => item.code !== 'statisticalverification')
                    resolve(this.activeName = (res.length > 0 && res[0].code) || 'externalnetworkattack')
                })
            })
            promise.then(res => {
                this.getReportField()
            }, err => { console.log(err) })
        }
    },
    mounted() {
        this.getLeftMenu()
        this.getLogFieldList()
    }
}
</script>

<style lang='scss' scoped>
@import "@/assets/css/mixin.scss";
::v-deep .el-tabs--left .el-tabs__item.is-left{
    text-align: center!important;
}
.event_data::v-deep.el-tabs{
        .el-tabs__active-bar{
            display: none;
          }
          .el-tabs__item{
            width: 240px;
            height: 50px;
            padding: 0;
            text-align: center;
            line-height: 50px;
            border: 1px solid #e9e9e9;
            background-color: #f2f2f2;
            font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑';
            font-weight: 700;
            font-style: normal;
            font-size: 14px;
            color: #999999;
            &.is-active{
                @include themeify {
                    color: themed('theme-color')!important;
                }
                background: #fff;
          }
          }
    }

  .el-tabs__nav-wrap::after{
    display: none;
  }
  ::v-deep.field_mapping{
    .el-form-item__content{
        line-height:40px !important
    }
  }
  .card-container{
    margin-top: 10px;
    box-sizing: border-box;
    position: relative;
    background-color: #ffffff;
    box-shadow: 0px 0px 8px rgba(140, 152, 164, 0.2);
    border: 1px solid #dadee8;
    border-radius: 4px;
    .event_data::v-deep .el-tabs__item:not(.is-active):hover{
        @include themeify {
            color: themed('theme-color')!important;
        }
    }
  }
  .card-form{
    border: 1px solid #dadee8;
    padding: 20px;
    overflow-y: auto;
  }
  .formList{
    overflow-y: auto;
  }
  .btn-list{
    margin-left: 10px;
    width: 50px;
  }
  .add-btn {
    cursor: pointer;
}
  .del-btn {
    cursor: pointer;
}
.whole{
    border: 1px solid #ddd;
}
</style>
