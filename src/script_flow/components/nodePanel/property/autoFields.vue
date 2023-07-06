<template>
    <div>
        <el-dialog
            title="字段变更"
            :visible.sync="dialogVisible"
            @closed="$emit('close')"
            width="700px"
            custom-class="attendance-dialog">
            <p style="color: rgba(0,0,0,0.5);font-size: 12px;margin-bottom: 20px;">
                <i class="el-icon-info"></i>
                <span>当字段变更后的值不符合规则或者出现异常时，则该字段不变更。例如：将必填字段为空时，则该字段不变更。</span>
            </p>
            <el-form :model="formData" ref="formData" class="unit" label-position="top">
                <div class="ub" v-for="(item,index) in formData.fieldsList" :key="index" style="margin: 10px 0">
                    <div class="mr-1">
                        <el-form-item
                            label="变更字段："
                            :prop='"fieldsList." + index + ".field"'
                            label-width="90px"
                            :rules="{required: true, message: '请选择变更字段', trigger: ['blur', 'change']}">
                            <el-select filterable clearable v-model="item.field" size="small" style="width: 300px;" placeholder="请选择">
                                <el-option :label="item.label" :value="item.value" v-for="(item ,index) in alarmList" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div>
                        <el-form-item label="变更为：" prop="value" label-width="90px">
                            <el-input  clearable v-model="item.value"  size="small" style="width: 300px;" placeholder="请选择">
                            </el-input>
                        </el-form-item>
                    </div>
                    <div v-if="index">
                        <i class="el-icon-remove-outline" @click="deleteFields(index)" style="margin: 35px 10px 13px 10px;color: #ff6060;font-size: 12px;cursor: pointer"></i>
                    </div>
                </div>
            </el-form>
            <p class="field-change" style="font-size: 12px;color:#387dee;margin:10px 0 10px 0px;cursor: pointer;width: 70px" @click="addFields">
                <i class="el-icon-plus"></i>
                添加字段</p>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="updateField" size="small">确 定</el-button>
                <el-button @click="dialogVisible = false" size="small">取 消</el-button>
                <!-- <searchBtn title="确 定" @click="updateField" /> -->
                <!-- <cancelBtn title="取 消" @click="dialogVisible = false" /> -->
            </span>
        </el-dialog>
    </div>
</template>

<script>
import mixinPanel from '../../../common/mixinPanel'
import listenerParam from './listenerParam'

export default {
    // eslint-disable-next-line vue/no-unused-components
    components: { listenerParam },
    mixins: [mixinPanel],
    data() {
        return {
            dialogVisible: true,
            showParamDialog: false,
            nowIndex: null,
            alarmList: [],
            formData: {
                fieldsList: [
                    {
                        field: '',
                        value: ''
                    }
                ]
            }
        }
    },
    props: ['fieldItem'],
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

        this.fieldItem && (this.formData.fieldsList = this.$deepCopy(this.fieldItem.data))
        this.alarmList = this.$getsessionStorage('alarmList') ?? []
    },
    methods: {
        configParam(index) {
            this.nowIndex = index
            const nowObj = this.formData.taskListener[index]
            if (!nowObj.params) {
                nowObj.params = []
            }
            this.showParamDialog = true
        },
        addFields() {
            this.formData.fieldsList.push(
                {
                    field: '',
                    value: ''
                }
            )
        },
        deleteFields(index) {
            this.formData.fieldsList.splice(index, 1)
        },
        finishConfigParam(param) {
            this.showParamDialog = false
            // hack 数量不更新问题
            const cache = this.formData.taskListener[this.nowIndex]
            cache.params = param
            this.$set(this.formData.taskListener[this.nowIndex], this.nowIndex, cache)
            this.nowIndex = null
        },
        updateField() {
            this.$refs.formData.validate((valid) => {
                if (valid) {
                    this.$emit('getNewFieldSet', {
                        type: 'field',
                        val: this.formData
                    })
                    this.dialogVisible = false
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
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
</style>
