<template>
    <div class="custom-search">
        <div class="box">
            <el-form-plus
                :formModel="fromData"
                size="mini"
                :fieldList="fieldList"
            >
                <template #item-depId>
                    <dep-search multiple v-model="fromData['depId']" />
                </template>
                <template #item-year>
                    <el-date-picker
                        v-model="fromData['year']"
                        type="year"
                        value-format="yyyy"
                        placeholder="选择年">
                    </el-date-picker>
                </template>

            </el-form-plus>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CustomSearch',
    props: {
        value: {
            type: Object,
            default: null
        },
        fieldList: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        fromData: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input', val)
            }
        }
    },
    data() {
        return {}
    },
    mounted() {},
    methods: {}
}
</script>

<style lang="scss" scoped>
.custom-search {
    width: 100%;
}
.box {
    width: 100%;
}
::v-deep .el-form--label-left .el-form-item__label {
    text-align: right;
}
</style>
