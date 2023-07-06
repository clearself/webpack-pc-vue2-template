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
            formData: {}
        }
    },
    computed: {
        formConfig() {
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
    }
}
</script>

<style>

</style>
