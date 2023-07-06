<template>
    <div>
        <x-form ref="xForm" v-model="formData" :config="formConfig">
        </x-form>
    </div>
</template>

<script>
import mixinPanel_stage from '../../common/mixinPanel_stage'
import mixinPanel from '../../common/mixinPanel'
export default {
    mixins: [mixinPanel_stage],
    data() {
        return {
            formData: {},
            nodeList: null
        }
    },
    computed: {
        formConfig() {
            const _this = this
            return {
                inline: false,
                item: [
                    // {
                    //   xType: 'input',
                    //   name: 'id',
                    //   label: '阶段 id',
                    //   rules: [{ required: true, message: 'Id 不能为空' }]
                    // },
                    // {
                    //     xType: 'input',
                    //     name: 'name',
                    //     label: '阶段名称'
                    // },
                    // {
                    //     xType: 'colorPicker',
                    //     name: 'color',
                    //     showAlpha: true,
                    //     label: '节点颜色'
                    // },
                ]
            }
        }
    },
    created() {
        const cache = {
            ...this.element.businessObject,
            ...this.element.businessObject.$attrs
        }
        for (const key in cache) {
            if (key.indexOf('camunda:') === 0) {
                const newKey = key.replace('camunda:', '')
                cache[newKey] = cache[key]
                delete cache[key]
            }
        }
        console.log('cache', cache)
        // this.formData.name = cache.name;
    },
    methods: {

    }
}
</script>

<style>

</style>
