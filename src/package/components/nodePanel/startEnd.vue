<template>
    <div>
        <x-form ref="xForm" v-model="formData" :config="formConfig">
        </x-form>
    </div>
</template>

<script>
import mixinPanel from '../../common/mixinPanel'

export default {
    mixins: [mixinPanel],
    data() {
        return {
            formData: {
                executionListener: []
            }
        }
    },
    mounted() {
        if (this.element.type === 'bpmn:EndEvent') {
            this.formData.executionListener = [
                {
                    $type: 'camunda:EndEvent',
                    event: 'end',
                    class: 'com.boot.base.common.util.workflow.EndListener'
                }
            ]
            this.updateElement()
        }
    },
    computed: {
        formConfig() {
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
                    }
                ]
            }
        }
    },
    watch: {
        'formData.initiator': function(val) {
            if (val === '') val = null
            this.updateProperties({ 'camunda:initiator': val })
        },
        'formData.formKey': function(val) {
            if (val === '') val = null
            this.updateProperties({ 'camunda:formKey': val })
        }
    },
    created() {
        const cache = {
            ...this.element.businessObject,
            ...this.element.businessObject.$attrs
        }
        // 移除camunda前缀，格式化数组
        for (const key in cache) {
            if (key.indexOf('camunda:') === 0) {
                const newKey = key.replace('camunda:', '')
                cache[newKey] = cache[key]
                delete cache[key]
            }
        }
        this.formData = cache
    },
    methods: {
        updateElement() {
            if (this.formData.executionListener?.length) {
                let extensionElements = this.element.businessObject.get('extensionElements')
                if (!extensionElements) {
                    extensionElements = this.modeler.get('moddle').create('bpmn:ExtensionElements')
                }
                // 清除旧值
                extensionElements.values = extensionElements.values?.filter(item => item.$type !== 'camunda:ExecutionListener') ?? []
                this.formData.executionListener.forEach(item => {
                    const executionListener = this.modeler.get('moddle').create('camunda:ExecutionListener')
                    executionListener.event = item.event
                    executionListener.class = item.class
                    extensionElements.get('values').push(executionListener)
                })
                this.updateProperties({ extensionElements: extensionElements })
            } else {
                const extensionElements = this.element.businessObject.extensionElements
                if (extensionElements) {
                    extensionElements.values = extensionElements.values?.filter(item => item.$type !== 'camunda:ExecutionListener') ?? []
                }
            }
        }
    }
}
</script>

<style>

</style>
