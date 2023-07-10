<template>
    <div ref="myEcharts" class="echarts"></div>
</template>

<script>
export default {
    name: 'Pie',
    props: ['chartData', 'title', 'type'],
    data() {
        return {

        }
    },
    mounted() {
        let that = this
        let data = this.chartData

        var colors = ['#64c128', '#ffaa01', '#ff0101']
        var texts = ['安全', '中危', '高危']
        function getIdx(value) {
            var p = value / 100; var idx = 0
            if (p <= 0.4) {
                idx = 0
            } else if (p > 0.4 && p <= 0.8) {
                idx = 1
            } else if (p > 0.8 && p <= 1) {
                idx = 2
            }
            return idx
        }
        function getColor(value) {
            return colors[getIdx(value)]
        }
        function getText(value) {
            return texts[getIdx(value)]
        }
        let option = {
            series: [
                {
                    name: '',
                    type: 'gauge',
                    detail: {
                        formatter: '{value}',
                        fontSize: 30,
                        fontWeight: 'bold'

                    },
                    data: [{ value: 0, name: getText(0) }],
                    min: 0,
                    max: 100,
                    title: {
                        offsetCenter: [0, '20%'],
                        fontSize: 20,
                        color: getColor(0)
                    },
                    axisLine: {
                        lineStyle: {
                            width: 25,
                            color: [[0.2, colors[0]], [0.4, colors[1]], [0.6, colors[2]], [0.8, colors[3]], [1, colors[4]]]
                        }
                    },
                    axisLabel: {
                        fontSize: 16,
                        fontWeight: 'bold'
                    }
                }
            ]
        }

        // eslint-disable-next-line no-undef
        var myChart = echarts.init(this.$refs.myEcharts)
        myChart.setOption(option)
        window.addEventListener('resize', function() {
            myChart.resize()
        })
    }
}
</script>

<style scoped lang="scss">
    .echarts {
        width: 100%;
        height: 100%;
    }
</style>
