<template>
    <div>
        <x-form ref="xForm" v-model="formData" :config="formConfig">
            <template #line1>
                <el-divider></el-divider>
            </template>
            <!-- <template #executionListener>
        <el-badge :value="executionListenerLength">
          <el-button size="small" @click="dialogName = 'executionListenerDialog'">编辑</el-button>
        </el-badge>
      </template> -->
            <template #autoCondition>
                <div>
                    <div class="ub ub-pc">
                        <el-button style="width:258px;" size="mini" type="primary" @click="dialogName = 'autoConditionListenerDialog'" >添加/编辑</el-button>
                    </div>
                    <div class="ub ub-pc ub-ver" style="width:258px;margin-top: 10px;">
                        <div class="ub ub-ver w100" v-for="(item,index) in conditionsShows" :key="index">
                            <div class="condition-item" v-for="(_item,_index) in item.and" :key="_index">
                                and
                                {{_item.fieldName}}
                                {{_item.conditionName}}
                                {{_item|getval}}
                            </div>
                            <el-divider></el-divider>
                        </div>

                    </div>
                </div>
            </template>
        </x-form>
        <!--  <executionListenerDialog
      v-if="dialogName === 'executionListenerDialog'"
      :element="element"
      :modeler="modeler"
      @close="finishExecutionListener"
    /> -->
        <autoConditionDialog
            v-if="dialogName === 'autoConditionListenerDialog'"
            :element="element"
            :modeler="modeler"
            :condition="conditions"
            @getCondition="getCondition"
            @close="dialogName = ''"
        />
    </div>
</template>

<script>
import mixinPanel from '../../common/mixinPanel'
import mixinExecutionListener from '../../common/mixinExecutionListener'
import { parseCDATA } from '../../common/util'

import autoConditionDialog from './taskDialogs/autoConditionDialog'
export default {
    mixins: [mixinPanel, mixinExecutionListener],
    components: {
        autoConditionDialog
    },
    data() {
        return {
            conditions: [],
            conditionsShows: [],
            formData: {}
        }
    },
    filters: {
        getval(item) {
            let type = item.type
            if (type === 'text') {
                return item.val
            } else if (type === 'select') {
                let items = item.item
                let selected = items.filter(tag => tag.key == item.val)
                if (selected.length > 0) {
                    return selected[0].value
                } else {
                    return ''
                }
            }
        }
    },
    computed: {
        formConfig() {
            let baseForm = this.$getsessionStorage('baseForm')
            const _this = this
            return {
                inline: false,
                labelPosition: 'top',
                item: [
                    // {
                    //   xType: 'input',
                    //   name: 'id',
                    //   label: '节点 id',
                    //   rules: [{ required: true, message: 'Id 不能为空' }]
                    // },
                    {
                        xType: 'input',
                        name: 'name',
                        label: '节点名称',
                        size: 'mini'
                    },
                    {
                        slot: 'line1'
                    },
                    {
                        xType: 'select',
                        name: 'conditionExpression',
                        label: '跳转条件',
                        // eslint-disable-next-line no-template-curly-in-string
                        dic: [{ label: '通过', value: '${result==true}' }, { label: '不通过', value: '${result==false}' }],
                        show: _this.conditions.length == 0
                    },
                    {
                        xType: 'slot',
                        name: 'autoCondition',
                        label: '自定义条件',
                        show: baseForm.sendId != 3 || baseForm.sendId != 4 || baseForm.sendId != 5

                    }
                ]
            }
        }
    },
    watch: {
        'formData.conditionExpression': function(val) {
            if (val) {
                const newCondition = this.modeler.get('moddle').create('bpmn:FormalExpression', { body: `${val}` })
                this.updateProperties({ conditionExpression: newCondition })
            } else {
                this.updateProperties({ conditionExpression: null })
            }
        },
        conditions: function(val) {
            if (val) {
                let repStr = JSON.stringify(val).replaceAll('"', "'", false)
                let _str = '"' + repStr + '"'
                let _body = '${' + 'workflowService.expressionBack(' + _str + ',workOrderId,workOrderObj)}'
                const newCondition = this.modeler.get('moddle').create('bpmn:FormalExpression', { body: _body })
                console.log('newCondition', newCondition)
                this.updateProperties({ conditionExpression: newCondition })
            } else {
                this.updateProperties({ conditionExpression: null })
            }
            this.updateProperties({ 'camunda:conditions': encodeURI(JSON.stringify(val)) })
            this.updateProperties({ 'camunda:conditionsShows': encodeURI(JSON.stringify(this.conditionsShows)) })
        }
    // 'formData.skipExpression': function(val) {
    //   if (val === '') val = null
    //   this.updateProperties({ 'camunda:skipExpression': val })
    // }
    },
    created() {
        const cache = {
            ...this.element.businessObject,
            ...this.element.businessObject.$attrs
        }
        console.log('9999999999999', cache)

        let conditionsStr = cache['camunda:conditions'] ? decodeURI(cache['camunda:conditions']) : '[]'
        let conditions = JSON.parse(conditionsStr)
        console.log('conditions', conditions)
        let conditionsShowsStr = cache['camunda:conditionsShows'] ? decodeURI(cache['camunda:conditionsShows']) : '[]'
        let conditionsShows = JSON.parse(conditionsShowsStr)
        if (conditions.length > 0) {
            this.conditions = conditions
            this.conditionsShows = conditionsShows
        } else {
            for (let attr in cache) {
                if (attr === 'conditionExpression') {
                    this.formData.conditionExpression = cache.conditionExpression.body
                } else {
                    this.formData.attr = cache[attr]
                }
            }
        }
        this.formData.id = cache.id ?? ''
        this.formData.name = cache.name ?? ''
    },
    methods: {

        getCondition({ data1, data2 }) {
            console.log('data1', data1)
            let conditions = []
            data1.map(item => {
                let obj = {}
                obj.and = []
                item.and.map(_item => {
                    let _obj = {}
                    _obj.field = _item.field
                    _obj.condition = _item.condition
                    _obj.val = _item.val
                    obj.and.push(_obj)
                })
                conditions.push(obj)
            })
            this.conditions = this.$deepCopy(conditions)
            console.log('this.conditions', this.conditions)
            this.conditionsShows = this.$deepCopy(data2)
        }
    }
}
</script>

<style lang="scss" scoped>
    .condition-item{
        font-size: 12px;
        line-height: 15px;
        color: #00c0ff;
    }
</style>
