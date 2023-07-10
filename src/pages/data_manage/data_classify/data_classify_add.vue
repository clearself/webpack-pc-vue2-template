<template>
    <div class="event classify-add" style="box-sizing: border-box; overflow-y: hidden !important">
        <div class="ub w100">
            <GroupList @getBusIdData="getBusIdData"  @getMode="getMode"  @getParentIdData="getParentIdData" @getTreeData="getTreeData" @getgrade="getgrade" @click="handleNode" @editNode="editNode" ref="groupList" />
            <div class="bg-color ub ub-f1 ub-ver" style="margin-left: 10px; height: 100%; overflow: auto">
                <div class="attendance-list event-content">
                    <div class="ub ub-pj w100 mb-3">
                        <div class="list-tips">
                            {{ this.$getlocalStorage('treeClassifyData').name }}
                        </div>
                        <div>
                            <!-- <cancel-btn title="取 消" style="margin-right: 10px;" @click="reserFun"></cancel-btn> -->
                            <el-button size="small" @click="reserFun" style="margin-right: 10px;">取 消</el-button>
                            <Debounce :time='2000' :isDebounce="2">
                                <!-- <searchBtn title="提 交" @click.native="validAdd('formData')" /> -->
                                <el-button type="primary" size="small" @click.native="validAdd('formData')">提 交</el-button>
                            </Debounce>

                        </div>
                    </div>
                    <div>
                        <div class="title" v-if="$route.query.grade===2 || $route.query.grade===3 || $route.query.mode===0">基础信息</div>
                        <el-form label-position="top" :inline="true" ref="formData" :model="formData" :rules="rules" v-if="$route.query.grade===2 || $route.query.grade===3 || $route.query.mode===0">
                            <!-- 新字段名日志类型 -->
                            <el-form-item label="日志类型:" style="margin-bottom:26px;margin-right:40px" prop="parentId" size="small" v-if="$route.query.mode===0" label-width="80px">
                                <el-select filterable v-model="formData.parentId" size="small"  placeholder="请选择" @change="parentIdChange" style="width:300px">
                                    <el-option v-for="(item, index) in parentIdList" :key="index" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item  v-if="$route.query.grade ===2||$route.query.grade ===3 || $route.query.mode===0" prop="assetType" size="small" style="margin-right:40px">
                                <div>
                                    <div class="custom-label"><span style="color:#F56C6C">* </span><span>资产类型:</span></div>
                                    <treeselect
                                        :disabled ="$route.query.grade ===3"
                                        :disable-branch-nodes="true"
                                        :clearable="false"
                                        style="width:300px"
                                        :options="assetTypeList"
                                        :normalizer="normalizer"
                                        placeholder="请选择"
                                        noChildrenText="当前分支无子节点"
                                        noOptionsText="无可用选项"
                                        @select="assetTypeChange"
                                        v-model="formData.assetType"
                                    />
                                </div>

                            </el-form-item>
                            <el-form-item label="厂商:" style="margin-bottom:30px;position: relative" prop="manufacturer" size="small"  v-if="$route.query.grade===3 || $route.query.mode===0" label-width="80px">
                                <div class="add-manufacturer" @click="addDialog = true">
                                    <span class="iconfont icon-tianjia"></span>
                                    <span class="add-text">添加厂商</span>
                                </div>
                                <el-select filterable v-model="formData.manufacturer" size="small" placeholder="请选择" :disabled ="manufacturerDis" style="width:300px">
                                    <el-option v-for="(item, index) in manufacturerList" :key="index" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                        <div class="title-two">属性字段信息</div>
                        <el-form>
                            <el-form-item label="" style=""  size="small">
                                <el-transfer
                                    class="transfer"
                                    style="text-align: left; display: flex;justify-content: space-between;background-color: rgba(0,0,0,0);width:50%;"
                                    v-model="formData.optionalField"
                                    filter-placeholder="请输入选项名称"
                                    filterable
                                    :titles="['待选列表', '已选列表']"
                                    :format="{
                                        noChecked: '${total}',
                                        hasChecked: '${checked}/${total}'
                                    }"
                                    :props="{
                                        key: 'id',
                                        label: 'name'
                                    }"
                                    :data="transferData">
                                </el-transfer>
                            </el-form-item>

                        </el-form>

                    </div>
                </div>
            </div>
        </div>
        <!--增加内容开始-->
        <el-dialog custom-class="common-dialog user-dialog" title="添加厂商" :visible.sync="addDialog" width="700px">
            <el-form :model="addForm" :rules="rulesTwo" ref="addForm" :inline="true" label-position="top">
                <el-form-item label="厂商：" prop="manufacturer" label-width="60px">
                    <el-input size="small"  v-model="addForm.manufacturer" placeholder="请输入" autocomplete="off" clearable style="width:680px"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button style="margin-right: 10px;" size="small" @click="addDialog = false">取 消</el-button>
                <Debounce :time='2000' :isDebounce="2">
                    <el-button type="primary" size="small" @click.native="submitForm('addForm')">确 定</el-button>
                </Debounce>
            </span>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="seeDialog" width="30%" custom-class="attendance-dialog">
            <span>是否放弃当前编辑的内容</span>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="seeDialog = false" style="margin-right:10px">取 消</el-button>
                <el-button type="primary" size="small" @click="handleSee">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="editDialog" width="30%" custom-class="attendance-dialog">
            <span>是否放弃当前编辑的内容</span>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="handleEditCancel" style="margin-right:10px">取 消</el-button>
                <el-button type="primary" size="small" @click="handleEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getManufacturer, getAssetsType, getAllField, saveManufacturer, saveChild, getDetail, updateChild, updateParent, getDetailByBusId } from '@/server/data_manage/data_classify.js'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import GroupList from './GroupList'
export default {
    name: 'DataClassify',
    components: {
        GroupList,
        Treeselect
    },
    data() {
        // const generateData = _ => {
        //     const data = []
        //     for (let i = 1; i <= 15; i++) {
        //         data.push({
        //             key: i,
        //             label: `备选项 ${i}`,
        //             disabled: i === 4
        //         })
        //     }
        //     return data
        // }
        return {
            parentIdList: [],
            editDialog: false,
            seeDialog: false,
            busIdThree: '',
            manufacturerDis: false,
            assetTypeDis: false,
            treeData: [],
            addDialog: false,
            // transferData: generateData(),
            transferData: [],
            manufacturerList: [],
            assetTypeList: [],
            normalizer(node) {
                if (node.sub && !node.sub.length) {
                    delete node.sub
                }
                return {
                    id: node.id,
                    label: node.name,
                    children: node.sub
                }
            },
            grade: '',
            formData: {
                parentId: '',
                assetType: null,
                optionalField: [],
                manufacturer: ''
            },
            rules: {
                assetType: [{
                    required: true,
                    message: '请选择',
                    trigger: 'change'
                }],
                parentId: [{
                    required: true,
                    message: '请选择',
                    trigger: 'change'
                }]
                // manufacturer: [{
                //     required: true,
                //     message: '请选择',
                //     trigger: 'change'
                // }]
            },
            rulesTwo: {
                manufacturer: [{
                    required: true,
                    message: '请输入',
                    trigger: 'blur'
                }]
            },
            addForm: {
                manufacturer: ''
            },
            propertyField: [],
            intersectionData: [],
            differenceData: [],
            parentId: '',
            currentNode: {}
        }
    },
    watch: {},
    async mounted() {
        await this.getAssetsTypeData()
        await this.getManufacturerData()
        this.getAllFieldData()
        if (this.$route.query.mode == 1) {
            this.initEditData()
        }
        this.$nextTick(() => {
        })
    },
    methods: {
        async  assetTypeChange(node, instanceId) {
            if (node) {
                this.$refs.formData.clearValidate('assetType')
            }
            if (this.formData.parentId) {
                await this.getDetailByBusIdData(node.id)
                this.initAddData()
            }
        },
        async parentIdChange(val) {
            if (this.parentIdList.length > 0) {
                let data = this.parentIdList.filter(item => {
                    return item.id == val
                })
                await this.getNodeDetail(data[0])
                this.initAddData()
            }
        },
        async initAddData() {
            // 交集
            this.intersection()
            // 差集
            await this.difference()
            setTimeout(() => {
                this.transferData = [...this.intersectionData, ...this.differenceData]
            }, 200)

            if (this.intersectionData.length > 0) {
                console.log('intersectionData', this.intersectionData)
                // debugger
                this.formData.optionalField = this.intersectionData.map(val => {
                    return val.id
                })
            } else {
                // debugger
                this.formData.optionalField = []
            }
        },
        handleEditCancel() {
            this.editDialog = false
            this.$refs.groupList.mode = ''
        },
        handleEdit() {
            let currentNode = this.$getlocalStorage('treeClassifyData')
            // debugger
            this.editDialog = false
            this.$refs.groupList.mode = ''
            this.$router.push({
                name: 'data_manage_data_classify_add',
                query: {
                    id: currentNode.id,
                    grade: currentNode.grade,
                    busId: currentNode.busId ? currentNode.busId : '',
                    mode: 1,
                    busIdThree: this.busIdThree ? this.busIdThree : null
                }
            })
            this.initEditData()
        },
        handleSee() {
            let currentNode = this.$getlocalStorage('treeClassifyData')
            // debugger
            setTimeout(() => {
                this.$router.push({
                    name: 'data_manage_data_classify',
                    query: {
                        id: currentNode.id
                    }
                })
            }, 1500)
        },
        getMode(val) {
            if (val === 0) {
                this.formData.assetType = null
                this.formData.optionalField = []
                this.formData.manufacturer = ''
                this.getAllFieldData()
            }
        },
        getBusIdData(val) {
            this.busIdThree = val
        },
        getParentIdData(val) {
            this.parentId = val
        },
        getTreeData(val) {
            this.treeData = val
            this.getParentListData(val)
        },
        getParentListData(val) {
            let treeData = val
            if (treeData.length > 0) {
                this.parentIdList = treeData.map(item => {
                    return {
                        id: item.id,
                        name: item.name,
                        grade: item.grade
                    }
                })
            }
        },
        async  initEditData() {
            if (this.$route.query.grade === 3 && this.$route.query.mode === 1) {
                this.formData.assetType = this.$route.query.busIdThree
            }
            this.transferData = []
            if (this.$route.query.grade === 2) {
                this.formData.assetType = this.$route.query.busId ?? null
            }
            // debugger
            this.formData.manufacturer = this.$route.query.busId

            // 交集
            this.intersection()
            // 差集
            await this.difference()
            setTimeout(() => {
                this.transferData = [...this.intersectionData, ...this.differenceData]
            }, 200)

            if (this.intersectionData.length > 0) {
                console.log('intersectionData', this.intersectionData)
                // debugger
                this.formData.optionalField = this.intersectionData.map(val => {
                    return val.id
                })
            } else {
                // debugger
                this.formData.optionalField = []
            }
            // debugger
            console.log(this.formData.optionalField)
            console.log(this.transferData)
        },
        intersection() {
            let propertyFieldData = this.$getlocalStorage('propertyFieldData') ?? []
            // debugger
            if (propertyFieldData.length > 0) {
                // let selectData = propertyFieldData.filter(item => {
                //     return item.status === 0
                // })
                this.intersectionData = propertyFieldData.map(item => {
                    return {
                        id: item.fieldId,
                        name: item.name,
                        disabled: item.status === 0
                    }
                })
                console.log('intersectionData', this.intersectionData)
                // debugger
            } else {
                this.intersectionData = []
            }
        },
        async difference() {
            await this.getAllFieldData()
            let a = this.intersectionData
            let b = this.transferData
            let arr = [...b].filter(x => [...a].every(y => y.id !== x.id))
            this.differenceData = arr
            console.log('differenceData', this.differenceData)
            // debugger
        },
        async  getManufacturerData() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            await getManufacturer(data).then(res => {
                this.manufacturerList = res
            }).catch(error => {
                console.log('error' + error)
            })
        },
        async getAssetsTypeData() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            await getAssetsType(data).then(res => {
                // debugger
                this.assetTypeList = res
            }).catch(error => {
                console.log('error' + error)
            })
        },
        async getAllFieldData() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            await getAllField(data).then(res => {
                this.transferData = res
                // debugger
            }).catch(error => {
                console.log('error' + error)
            })
        },
        async editNode(node) {
            await this.getNodeDetail(node)
            this.editDialog = true
            // this.$router.push({
            //     name: 'data_manage_data_classify_add',
            //     query: {
            //         id: node.id,
            //         grade: node.grade,
            //         busId: node.busId ? node.busId : '',
            //         mode: 1,
            //         busIdThree: this.busIdThree ? this.busIdThree : null
            //     }
            // })
            // this.initEditData()
        },
        async getNodeDetail(node) {
            let data = {
                queryData: {},
                paramsData: {
                    id: node.id,
                    grade: node.grade
                }
            }
            await getDetail(data).then(res => {
                this.propertyField = res
                this.$setlocalStorage('propertyFieldData', this.propertyField)
            }).catch(error => {
                console.log('error' + error)
            })
        },
        async getDetailByBusIdData(idVal) {
            let data = {
                queryData: {},
                paramsData: {
                    id: this.formData.parentId,
                    busId: idVal
                }
            }
            await getDetailByBusId(data).then(res => {
                this.propertyField = res
                this.$setlocalStorage('propertyFieldData', this.propertyField)
            }).catch(error => {
                console.log('error' + error)
            })
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.addManufacturer()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        addManufacturer() {
            let data = {
                queryData: {},
                paramsData: {
                    name: this.addForm.manufacturer
                }
            }
            saveManufacturer(data).then(res => {
                console.log(res)
                this.addDialog = false
                this.$message({
                    message: '添加成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.getManufacturerData()
                }, 1500)
            }).catch(error => {
                this.addDialog = false
                console.log('error' + error)
            })
        },
        getgrade(val) {
            console.log(val)
            this.grade = val
        },
        handleNode(node) {
            console.log(node)
        },
        reserFun() {
            if (this.$route.query.mode === 1) {
                this.seeDialog = true
            } else {
                this.$router.push({
                    name: 'data_manage_data_classify'
                })
            }
        },
        validAdd(formName) {
            console.log('11111111')
            if (this.$route.query.mode === 1 && this.$route.query.grade === 1) {
                this.editData()
            } else {
                this.$refs[formName].validate((valid) => {
                    console.log('22222222')
                    if (valid) {
                        if (this.$route.query.mode === 0) {
                            this.addData()
                        } else if (this.$route.query.mode === 1) {
                            this.editData()
                        }
                    } else {
                        console.log('error submit!!')
                        return false
                    }
                })
            }
        },
        addData() {
            let data = {
                queryData: {},
                paramsData: {
                    parentId: this.formData.parentId,
                    assetsTypeId: this.formData.assetType,
                    manufacturerId: this.formData.manufacturer,
                    fieldIds: this.formData.optionalField
                }
            }
            saveChild(data).then(res => {
                this.$message({
                    message: '添加成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.$router.push({
                        name: 'data_manage_data_classify'
                    })
                }, 1500)
            }).catch(error => {
                this.addDialog = false
                console.log('error' + error)
            })
        },
        editData() {
            if (this.$route.query.grade === 3 || this.$route.query.grade === 2) {
                let data = {
                    queryData: {},
                    paramsData: {
                        id: this.$route.query.id,
                        busId: this.$route.query.grade === 3 ? this.formData.manufacturer : this.formData.assetType,
                        grade: this.$route.query.grade,
                        fieldIds: this.formData.optionalField
                    }
                }
                updateChild(data).then(res => {
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    })
                    setTimeout(() => {
                        this.$router.push({
                            name: 'data_manage_data_classify',
                            query: {
                                id: this.$route.query.id
                            }
                        })
                    }, 1500)
                }).catch(error => {
                    this.addDialog = false
                    console.log('error' + error)
                })
            } else if (this.$route.query.grade === 1) {
                let data = {
                    queryData: {},
                    paramsData: {
                        id: this.$route.query.id,
                        fieldIds: this.formData.optionalField
                    }
                }
                updateParent(data).then(res => {
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    })
                    setTimeout(() => {
                        this.$router.push({
                            name: 'data_manage_data_classify',
                            query: {
                                id: this.$route.query.id
                            }
                        })
                    }, 1500)
                }).catch(error => {
                    this.addDialog = false
                    console.log('error' + error)
                })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.event{
    ::v-deep .vue-treeselect__single-value{
        line-height:32px !important;
    }
}
.event ::v-deep .el-form .el-form-item:nth-child(2) .el-form-item__error {
    left: 80px;
}
.custom-label {
    text-align: left;
    color: #606266;
    width: 80px;
    font-size: 12px;
    padding-right: 10px;
    box-sizing: border-box;
}
.event {
    ::v-deep .el-transfer-panel__filter{
        margin: 0px;
        .el-input__inner {
            border-radius: 0px;
        }
    }

    ::v-deep .el-transfer__buttons {
        padding: 190px 0px 0 0px;
        display: block;
        button{
            min-width: 50px !important;
        }
    }
    ::v-deep .el-button+.el-button {
        margin-left: 0px;
    }
}
// .event-content {
//         background-color: #111d2b;
//     }
  .classify-add {
      .add-manufacturer {
        right: 0px;
        top: -32px;
         position:absolute;
          color: #0052d9;
          font-size: 12px;
          margin-left: 10px;
          .iconfont {
              font-size: 12px;
          }
          .add-text {
              margin-left: 4px;
          }
          &:hover {
              cursor: pointer;
          }
      }
  }
  .main {
    margin: 20px 0;
  }
  .attendance-list {
    margin-top: 0;
    padding-bottom: 30px;
    min-height: calc(100vh - 80px);
    flex-shrink: 0;
    padding-left: 20px;
    padding-right: 20px;
  }
  .title {
    margin-bottom: 16px;
    // width: 100%;
    // height: 30px;
    // box-sizing: border-box;
    // border-bottom: 1px solid rgba(28, 215, 250, 0.2);
    font-size: 12px;
    color: #0052d9;
    // padding-left: 30px;
    // position: relative;
    line-height: 20px;
    // &::after {
    //     content: "";
    //     background-color:#1cd7fa;
    //     width: 90px;
    //     height: 1px;
    //     position: absolute;
    //     bottom: 0;
    //     left: 10px;
    // }
  }
  .title-two {
    margin-bottom: 26px;
    // width: 100%;
    // height: 30px;
    // box-sizing: border-box;
    // border-bottom: 1px solid rgba(28, 215, 250, 0.2);
    font-size: 12px;
    color: #0052d9;
    // padding-left: 30px;
    // position: relative;
    line-height: 20px;
    // &::after {
    //     content: "";
    //     background-color:#1cd7fa;
    //     width: 120px;
    //     height: 1px;
    //     position: absolute;
    //     bottom: 0;
    //     left: 10px;
    // }
  }
   .transfer ::v-deep .el-transfer-panel {
    background-color: rgba(0, 0, 0, 0);
    // border-color: #1bd7fa;
    width: 300px;
    // box-shadow: inset 0px 0px 7px 0px #389bf7;
}
.transfer ::v-deep .el-transfer-panel .el-checkbox__inner {
    height: 12px;
    width: 12px;
}
.transfer ::v-deep .el-transfer-panel__body {
    height: 350px;
}
@media screen and (max-width: 1366px){
    .transfer ::v-deep .el-transfer-panel__body {
        height: 216px;
    }
    .event ::v-deep .el-transfer__buttons {
        padding: 80px 0px 0 0px;
    }
}
.transfer ::v-deep .el-checkbox__input.is-disabled .el-checkbox__inner {
    background-color: rgba($color: #fff, $alpha: 0);
    // border-color:  rgba($color: #1bd7fa, $alpha: 0.5);
}
.transfer ::v-deep .el-checkbox__input.is-disabled+span.el-checkbox__label {
    // color: rgba($color: #fff, $alpha: 0.5);
}
.transfer ::v-deep .el-transfer-panel__list.is-filterable {
    height: 308px;
}

.transfer ::v-deep .el-transfer-panel .el-transfer-panel__header {
    background-color: #ebf1f5;
    // border-color: #1bd7fa;
    // box-shadow: inset 0px 0px 14px 0px #389bf7;
    height: 30px;
    line-height: 30px;
}
.transfer ::v-deep .el-transfer-panel__filter .el-input__inner {
    height: 30px;
}
.transfer ::v-deep  .el-transfer-panel .el-transfer-panel__header .el-checkbox {
    line-height: 30px;
}

.transfer ::v-deep .el-transfer-panel .el-transfer-panel__header .el-checkbox .el-checkbox__label {
    font-size: 12px;
    // color: #fff;
}

.transfer ::v-deep .el-transfer-panel .el-transfer-panel__header .el-checkbox .el-checkbox__label span {
    // color: #fff;
}

.trans ::v-deep .el-input__inner {
    border-radius: 4px 4px 0 0;
}

.transfer ::v-deep .el-transfer-panel__item.el-checkbox {
    // color: #fff;
}

.transfer ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #0052d9;
    border-color: #0052d9;
}

.transfer ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner:hover {
    border-color: #0052d9;
}

.transfer ::v-deep .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    // background-color: #024861;
    // border-color: #01d9f0;
}

.transfer ::v-deep .el-checkbox__input .el-checkbox__inner:hover {
    // border-color: #01d9f0;
}

.transfer ::v-deep .el-checkbox__inner::after {
    // border-color: #01d9f0;
}

.transfer ::v-deep .el-checkbox__input.is-checked+.el-checkbox__label {
    color: #0052d9;
}

.transfer ::v-deep .el-input__inner,
.transfer ::v-deep .el-textarea__inner,
.chart .el-input__inner {
    box-shadow: none;
    // border-color: #01d9f0;
}

.transfer ::v-deep .el-transfer__button.is-disabled,
.transfer ::v-deep .el-transfer__button.is-disabled:hover {
    border: 1px solid rgba(0, 0, 0, 0);
    background-color: rgba(0, 0, 0, 0);
    // color: #00e9ff;
    // color: rgba($color: #00e9ff, $alpha: 0.5)
}

.transfer ::v-deep .el-transfer__button {
    color: #387dee;
    background-color: rgba($color: #000000, $alpha: 0);
}
.transfer ::v-deep .el-button--primary {
    border: none;
}

</style>

