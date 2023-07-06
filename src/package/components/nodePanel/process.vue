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
            signalLength: 0,
            formData: {
                isExecutable: true
            }
        }
    },
    computed: {
        formConfig() {
            const _this = this
            return {
                inline: false,
                labelPosition: 'top',
                item: [
                    //        {
                    //          xType: 'select',
                    // size:'mini',
                    //          name: 'processCategory',
                    //          label: '流程分类',
                    //          dic: { data: _this.categorys, label: 'name', value: 'id' }
                    //        },
                    {
                        xType: 'input',
                        size: 'mini',
                        name: 'id',
                        disabled: true,
                        label: '流程标识key',
                        rules: [{ required: true, message: 'Id 不能为空' }]
                    },
                    {
                        xType: 'input',
                        size: 'mini',
                        name: 'name',
                        label: '流程名称'
                    }
                ]
            }
        }
    },
    // watch: {
    //   'formData.processCategory': function(val) {
    //     if (val === '') val = null
    //     this.updateProperties({ 'camunda:processCategory': val })
    //   }
    // },
    created() {
        const cache = {
            ...this.element.businessObject,
            ...this.element.businessObject.$attrs
        }
        console.log('cache', cache)
        // 移除camunda前缀，格式化数组
        for (const key in cache) {
            if (key.indexOf('camunda:') === 0) {
                const newKey = key.replace('camunda:', '')
                cache[newKey] = cache[key]
                delete cache[key]
            }
        }
        // 添加 isExecutable
        this.updateProperties({ isExecutable: true })

        this.formData = cache
        if (cache.id && !this.$getsessionStorage('copyAdd')) {
            this.formData.id = cache.id
            this.$setsessionStorage('processId', cache.id)
        } else {
            let processId = this.$getsessionStorage('processId')
            if (processId == '' || this.$getsessionStorage('copyAdd')) {
                processId = 'process_' + new Date().getTime()
                console.log('processId', processId)
                this.$setsessionStorage('processId', processId)
            }
            this.formData.id = processId
        }
    },
    methods: {}
}
</script>

<style>

</style>
