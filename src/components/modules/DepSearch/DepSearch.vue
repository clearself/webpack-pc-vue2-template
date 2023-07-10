<template>
    <div class="dep-search">
        <treeselect
            class="treeselect-main"
            :multiple="multiple"
            :clearable="clearable"
            :zIndex="9999"
            :appendToBody="true"
            style=" display: inline-block;width: 100%; vertical-align: middle;"
            :options="departmentData"
            :normalizer="normalizer"
            placeholder="请选择"
            noChildrenText="当前部门无下级部门"
            noOptionsText="暂无数据"
            noResultsText="没有匹配到数据"
            value-consists-of="ALL"
            :limit="1"
            :limitText="limitTextShow"
            v-model="departments"
        />
    </div>
</template>
<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
    name: 'DepSearch',
    props: {
        value: [Array, String],
        multiple: {
            type: Boolean,
            default: false
        },
        clearable: {
            type: Boolean,
            default: false
        },
        height: {
            type: Number,
            default: 2
        }
    },
    components: {
        Treeselect
    },
    data() {
        return {
            normalizer(node) {
                return {
                    id: node.id,
                    label: node.name,
                    children: node.children
                }
            },
            departmentData: []
        }
    },
    computed: {
        departments: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input', val)
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.$store.dispatch('get_dep_data').then((res) => {
                console.log('res', res)
                this.departmentData = res
            })
        })
    },
    methods: {
        limitTextShow(count) {
            return `共 ${count + 1} 条`
        }
    }
}
</script>
<style lang="scss" scoped>
.dep-search {
    width: 100%;
}

/* Treeselect */
.treeselect-main {
    width: 100%;
    line-height: 20px;
    ::v-deep .vue-treeselect__control {
        line-height: 20px;
    }
    ::v-deep .vue-treeselect__multi-value-item {
        height: 20px;
        line-height: 20px;
    }
}

</style>
