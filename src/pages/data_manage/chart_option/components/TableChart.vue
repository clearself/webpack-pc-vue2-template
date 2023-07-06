<template>
    <div style="width:100%;height:100%" :style="{'overflow-y':heigRight?'none':'auto'}">
        <div :style="{'height': heigRight?heightCalc:'', 'overflow-y': 'scroll'}">
            <el-table
                class="bigTable expert-table"
                :data="tableData"
                style="width: 100%;min-height: 100%;"
                :row-class-name="tableRowClassName"
                stripe
                tooltip-effect="dark"
                :row-style="{ height: '32px' }"
                :header-row-style="{ height: '32px' }"
            >
                <el-table-column v-for="(item, key) in chatTableOption" :key="key" :prop="item.code" :label="item.name" width="auto"></el-table-column>
            </el-table>
        </div>
        <div v-show="tableData.length>0" class="pagination pag" style="padding: 0px !important;text-align: right;z-index:20">
            <el-pagination
                background
                @current-change="handleCurrentChange"
                :current-page="$parent.tabPage.page"
                :page-size="$parent.tabPage.size"
                :total="$parent.tabPage.total"
                layout="slot, prev, next, total, pager"
                prev-text="＜ 上一页"
                next-text="下一页 ＞"></el-pagination>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TableChart',
    props: ['allFieldList', 'chartData', 'chatTableOption', 'heigRight'],
    data() {
        return {
            myChart: null,
            loading: true,
            tableData: [],
            tableOption: null
        }
    },
    watch: {
        chatTableOption: {
            deep: true, // 深度监听
            handler(newVal, oldVal) {
                if (newVal) {
                    this.tableOption = newVal
                }
            }
        },
        chartData: {
            deep: true, // 深度监听
            handler(newVal, oldVal) {
                if (newVal) {
                    this.tableData = newVal
                }
            }
        }
    },
    computed: {
        heightCalc() {
            return this.heigRight.substr(0, this.heigRight.length - 1) + ' - 28px)'
        }
    },
    mounted() {
        // this.renderChart()
    },
    beforeDestroy() {},
    methods: {
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex % 2) {
                return 'table-row2'
            } else {
                return 'table-row1'
            }
        },
        handleCurrentChange(val) {
            this.$parent.tabPage.page = val
            this.$parent.submitTable()
        }
    }
}
</script>

<style scoped lang="scss">
.echarts {
    width: 100%;
    height: 100%;
}
.no-data {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    color: #fff;
    font-size: 14px;
    opacity: 0.4;
    letter-spacing: 2px;
}
.echarts ::v-deep .el-loading-mask {
    background-color: rgba(0, 0, 0, 0.5);
}
</style>
