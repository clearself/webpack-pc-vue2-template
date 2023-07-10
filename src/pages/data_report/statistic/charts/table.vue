<template>
    <el-table show-summary class='bigTable' :data="tableColumns" style="width: 100%" border stripe tooltip-effect="dark">
        <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
        </el-table-column>
        <el-table-column v-for="(item,key) in titleData" :key="key" :prop="item.value" :label="item.name">
        </el-table-column>
    </el-table>
</template>

<script>
export default {
    name: 'TbComponents',
    props: ['tableColumns', 'titleData', 'page', 'size'],
    methods: {
        indexMethod(index) {
            return (this.page - 1) * this.size + index + 1
        },
        getSummary(param) {
            console.log('合计', param)
            const { columns, data } = param
            const sums = []

            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '合计'
                    return
                }
                if (index === 2) {
                    sums[index] = data.length > 0 ? data[0].sum : 0
                }
            })
            return sums
        }
    }
}
</script>

<style>
</style>
