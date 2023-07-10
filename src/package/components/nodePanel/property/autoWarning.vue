<template>
    <div>
        <el-dialog
            title="提醒"
            :visible.sync="dialogVisible"
            @closed="$emit('close')"
            width="700px"
            @click.native="closeDrop"
            custom-class="attendance-dialog">
            <el-form :model="formData" ref="formData" :rules="rules" label-position="top">
                <el-form-item label="提醒方式：" prop="type" label-width="90px">
                    <el-select
                        filterable
                        clearable
                        v-model="formData.type"
                        multiple
                        size="small"
                        style="width: 100%;"
                        placeholder="请选择">
                        <el-option label="站内消息" value="0"></el-option>
                        <el-option label="邮件" value="1"></el-option>
                        <el-option label="短信" value="2"></el-option>
                        <el-option label="蓝鲸快信" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="人员范围：" prop="persons" label-width="90px" style="margin: 20px 0" class="red-star">
                    <dropdown-box
                        :usersList="allUserList"
                        :depList="allDepList"
                        :rolesList="allRolesList"
                        :dataList="dataList"
                        :usersShow="usersShow"
                        ref="personRange"
                        :noFlow="true"
                        @confirmData="confirmData"
                    ></dropdown-box>
                    <span v-if="personFlag" class="red-warn warn-person">请选择人员</span>
                </el-form-item>
                <el-form-item label="提醒内容：" prop="content" label-width="90px" class="red-star">
                    <insert-fields ref="field" :title="formData.title" :mes="formData.mes"></insert-fields>
                    <span v-if="mesFlag" class="red-warn warn-content">请填写提醒内容</span>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" @click="updateWarn">确 定</el-button>
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                <!-- <searchBtn title="确 定" @click="updateWarn" /> -->
                <!-- <cancelBtn title="取 消" @click="dialogVisible = false" /> -->
            </span>
        </el-dialog>
    </div>
</template>

<script>
import dropdownBox from '../../../../pages/works_order/workFlow/workComponents/dropdownBox'
import insertFields from '../../../../pages/works_order/workFlow/workComponents/insertFields'
import mixinPanel from '../../../common/mixinPanel'
import listenerParam from './listenerParam'

export default {
    // eslint-disable-next-line vue/no-unused-components
    components: { listenerParam, insertFields, dropdownBox },
    mixins: [mixinPanel],
    data() {
        return {
            dialogVisible: true,
            showParamDialog: false,
            nowIndex: null,
            allUserList: [],
            allDepList: [],
            allRolesList: [],
            dataList: [
                {
                    name: '资产负责人',
                    type: '3',
                    id: 0
                },
                {
                    name: '告警创建人',
                    type: '3',
                    id: 1
                }
            ],
            mesFlag: false,
            personFlag: false,
            rules: {
                type: [
                    { required: true, message: '请选择提醒方式', trigger: 'change' }
                ]
            },
            usersShow: [],
            formData: {
                type: [],
                mes: '',
                title: '',
                users: [
                    // {
                    //     userType: '0',
                    //     ids: []
                    // }
                ],
                usersName: [

                ]
            }
        }
    },
    props: ['warnItem', 'usersName'],
    computed: {

    },
    mounted() {
        // this.formData.taskListener = this.element.businessObject.extensionElements?.values
        //     .filter(item => item.$type === 'camunda:TaskListener')
        //     .map(item => {
        //         let type
        //         if ('class' in item) type = 'class'
        //         if ('expression' in item) type = 'expression'
        //         if ('delegateExpression' in item) type = 'delegateExpression'
        //         return {
        //             event: item.event,
        //             type: type,
        //             className: item[type],
        //             params: item.fields?.map(field => {
        //                 let fieldType
        //                 if ('stringValue' in field) fieldType = 'stringValue'
        //                 if ('expression' in field) fieldType = 'expression'
        //                 return {
        //                     name: field.name,
        //                     type: fieldType,
        //                     value: field[fieldType]
        //                 }
        //             }) ?? []
        //         }
        //     }) ?? []
        this.$getsessionStorage('allUserList') && (this.allUserList = this.$getsessionStorage('allUserList'))
        this.$getsessionStorage('allRolesList') && (this.allRolesList = this.$getsessionStorage('allRolesList'))
        this.$getsessionStorage('allDepList') && (this.allDepList = this.$getsessionStorage('allDepList'))

        console.log(this.warnItem)
        this.warnItem && (this.formData = this.$deepCopy(this.warnItem.data))
        if (this.usersName) {
            this.usersShow = this.usersName
        }
    },
    methods: {
        closeDrop() {
            if (this.$refs.field) {
                this.$refs.field.showFidles = false
            }
            if (this.$refs.personRange) {
                this.$refs.personRange.showMore = false
            }
        },
        configParam(index) {
            this.nowIndex = index
            const nowObj = this.formData.taskListener[index]
            if (!nowObj.params) {
                nowObj.params = []
            }
            this.showParamDialog = true
        },
        confirmData(val) {
            val = val.length ? val : []
            let type0 = []
            let type1 = []
            let type2 = []
            let type3 = []; let type4
            this.formData.users = []
            val.forEach(item => {
                if (item !== '流程相关') {
                    item = JSON.parse(item)
                }
                if (item.type === '0') {
                    type0.push(item.id)
                } else if (item.type === '1') {
                    type1.push(item.id)
                } else if (item.type === '2') {
                    type2.push(item.id)
                } else if (item.type === '3') {
                    type3.push(item.id)
                } else if (item === '流程相关') {
                    type4 = true
                }
            })
            this.formData.usersName = val || []
            type0.length && this.formData.users.push({ userType: '0', ids: type0 })
            type1.length && this.formData.users.push({ userType: '1', ids: type1 })
            type2.length && this.formData.users.push({ userType: '2', ids: type2 })
            type3.length && this.formData.users.push({ userType: '3', ids: type3 })
            type4 && this.formData.users.push({ userType: '4' })
            console.log(this.formData.users, '提醒人列表')
        },
        updateWarn() {
            console.log(this.$refs.field.$refs)
            console.log(this.$refs.field.$refs.editHead.innerHTML, 'ooooooooooooo')
            this.formData.title = this.$refs.field.$refs.editHead.innerHTML
            this.formData.mes = this.$refs.field.$refs.editBody.innerHTML

            if (this.formData.title.trim() === '' || this.formData.mes.trim() === '') {
                this.mesFlag = true
                return
            } else if (this.formData.users.length == 0) {
                this.personFlag = true
                return
            }

            this.$refs.formData.validate((valid) => {
                if (valid) {
                    this.$emit('getNewWarnSet', {
                        type: 'warn',
                        val: this.formData
                    })
                    this.mesFlag = this.personFlag = false
                    this.dialogVisible = false
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        finishConfigParam(param) {
            this.showParamDialog = false
            // hack 数量不更新问题
            const cache = this.formData.taskListener[this.nowIndex]
            cache.params = param
            this.$set(this.formData.taskListener[this.nowIndex], this.nowIndex, cache)
            this.nowIndex = null
        },
        updateElement() {
            if (this.formData.taskListener?.length) {
                let extensionElements = this.element.businessObject.get('extensionElements')
                if (!extensionElements) {
                    extensionElements = this.modeler.get('moddle').create('bpmn:ExtensionElements')
                }
                // 清除旧值
                extensionElements.values = extensionElements.values?.filter(item => item.$type !== 'camunda:TaskListener') ?? []
                this.formData.taskListener.forEach(item => {
                    const taskListener = this.modeler.get('moddle').create('camunda:TaskListener')
                    taskListener.event = item.event
                    taskListener[item.type] = item.className
                    if (item.params && item.params.length) {
                        item.params.forEach(field => {
                            const fieldElement = this.modeler.get('moddle').create('camunda:Field')
                            fieldElement.name = field.name
                            fieldElement[field.type] = field.value
                            // 注意：camunda.json 中定义的string和expression类为小写，不然会和原生的String类冲突，此处为hack
                            // const valueElement = this.modeler.get('moddle').create(`camunda:${field.type}`, { body: `<![CDATA[${field.value}]]>` })
                            // fieldElement[field.type] = valueElement
                            taskListener.get('fields').push(fieldElement)
                        })
                    }
                    extensionElements.get('values').push(taskListener)
                })
                this.updateProperties({ extensionElements: extensionElements })
            } else {
                const extensionElements = this.element.businessObject.extensionElements
                if (extensionElements) {
                    extensionElements.values = extensionElements.values?.filter(item => item.$type !== 'camunda:TaskListener') ?? []
                }
            }
        },
        closeDialog() {
            this.$refs.xForm.validate().then(() => {
                this.updateElement()
                this.dialogVisible = false
            }).catch(e => console.error(e))
        }
    }
}
</script>

<style>
.flow-containers .el-badge__content.is-fixed {
    top: 18px;
}
.warn-num {
    margin-left: 10px;
    width: 99%;
    height: 20px;
    line-height: 20px;
    position: relative;
    padding: 20px 0 10px 0;
    font-size: 14px;
    border-bottom: 1px solid rgba(0,0,0,.8);
}
.warn-num span {
    width: 60px;
    display: inline-block;
    color: #dcdcdc;
    text-align: center;
    border-bottom: 1px solid #dcdcdc;
}
.warn-num i {
    float: right;
    font-size: 14px;
    color: #ff7200;
}
.attendance-dialog .red-star {
    position: relative;
}
.attendance-dialog .red-star::before {
    content: '*';
    position: absolute;
    left: -8px;
    top: -2px;
    color: #F56C6C;
}
.attendance-dialog .red-warn {
    color: #F56C6C;
    font-size: 12px;
    position: absolute;
    top: calc(100% - 10px);
    left: 0;
}
</style>
