<template>
    <div ref="myEcharts" class="echarts"></div>
</template>

<script>
export default {
    name: 'Pie',
    props: ['chartData', 'title'],
    data() {
        return {

        }
    },
    mounted() {
        let that = this
        let legendData = []
        let data = this.chartData
        let colors = ['#00f9f9', '#4f2c87', '#d569c5', '#0f4586', '#66cc67', '#bc8027', '#2cb4c8']
        data.forEach((item, index) => {
            legendData.push(item.name)
        })
        let option = {
            color: colors,
            grid: {
                left: '2%',
                right: '2%',
                top: '0',
                containLabel: true
            },
            tooltip: {
                trigger: 'item',
                formatter: '{b} <br/>事件量： {c} <br/>占比：{d}%'
            },
            legend: {
                type: 'scroll',
                orient: 'vertical',
                left: 10,
                top: 10,
                bottom: 10,
                itemWidth: 14,
                itemHeight: 4,
                textStyle: {
                    color: 'rgba(255,255,255,1)',
                    fontSize: 10
                }
            },
            series: [
                {
                    name: '',
                    type: 'pie',
                    radius: '65%',
                    center: ['65%', '45%'],
                    labelLine: false,
                    label: {
                        show: false
                    },
                    minAngle: 2,
                    data: data,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
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
