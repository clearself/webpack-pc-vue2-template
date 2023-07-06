<template>
    <div class="time-select">
        <el-select
            ref="selectDom"
            style="width: 100%;"
            v-model="valId"
            :clearable="clearable"
            :size="size"
            :filterable="filterable"
            placeholder="请选择时间范围"
            @change="change"
        >
            <el-option
                v-for="(item, index) in dataList"
                :key="index"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
        </el-select>
    </div>
</template>
<script>
export default {
    name: 'TimeSelect',
    props: {
        value: {
            type: [String, Number],
            default: ''
        },
        name: {
            type: String,
            default: ''
        },
        clearable: {
            type: Boolean,
            default: true
        },
        filterable: {
            type: Boolean,
            default: true
        },
        size: {
            type: String,
            default: 'small'
        },
        list: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            loading: false,
            listData: []
        }
    },
    computed: {
        valId: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input', val)
                //
            }
        },
        dataList() {
            return this.list
        }
    },
    methods: {
        change(val) {
            let now = new Date().getTime()
            let end = now - 1000 * 3600 * 24 * val
            let endTime = this.$getTime(now, '-', true)
            let startTime = this.$getTime(end, '-', true)
            this.$emit('change', [startTime, endTime])
        }
    }
}
</script>
<style lang="scss" scoped>
.time-select {
    width: 100%;
}
</style>
