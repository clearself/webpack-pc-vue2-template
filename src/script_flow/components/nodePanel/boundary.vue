<template>
    <div>
        <x-form ref="xForm" v-model="formData" :config="formConfig">
            <!-- <template #executionListener>
        <el-badge :value="executionListenerLength">
          <el-button size="small" @click="dialogName = 'executionListenerDialog'">编辑</el-button>
        </el-badge>
      </template>
      <template #signal>
        <el-badge :value="signalLength">
          <el-button size="small" @click="dialogName = 'signalDialog'">编辑</el-button>
        </el-badge>
      </template> -->
        </x-form>
    <!-- <executionListenerDialog
      v-if="dialogName === 'executionListenerDialog'"
      :element="element"
      :modeler="modeler"
      @close="finishExecutionListener"
    />
    <signalDialog
      v-if="dialogName === 'signalDialog'"
      :element="element"
      :modeler="modeler"
      @close="finishExecutionListener"
    /> -->
    </div>
</template>

<script>
import mixinPanel from '../../common/mixinPanel'
export default {
    mixins: [mixinPanel],
    data() {
        return {
            formData: {}
        }
    },
    computed: {
        formConfig() {
            const _this = this
            return {
                inline: false,
                item: [
                    {
                        xType: 'input',
                        name: 'id',
                        label: '边界定时id',
                        rules: [{ required: true, message: 'Id 不能为空' }]
                    },
                    {
                        xType: 'input',
                        name: 'name',
                        label: '边界定时名称'
                    },
                    {
                        xType: 'colorPicker',
                        name: 'color',
                        showAlpha: true,
                        label: '节点颜色'
                    }
                ]
            }
        }
    },
    watch: {

    },
    created() {
        const cache = {
            ...this.element.businessObject,
            ...this.element.businessObject.$attrs
        }
        const timerEventDefinition = this.modeler.get('moddle').create('bpmn:TimerEventDefinition', { id: 'TimerEventDefinition_' + Date.now() })
        timerEventDefinition.$parent = this.element.businessObject
        console.log('timerEventDefinition', timerEventDefinition)
        const newObjectList = []
        newObjectList.push(timerEventDefinition)
        this.updateProperties({ eventDefinitions: newObjectList })
        console.log('cache1111111111111111111', cache)
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

    }
}
</script>

<style>

</style>

