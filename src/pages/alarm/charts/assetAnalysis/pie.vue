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
        let theme = 'white-theme'
        let legendColor, themeColors, shadowColor
        switch (theme) {
            case 'white-theme':
                legendColor = ['#266fe8', '#f57984', '#50cea4', '#f4a465', '#c559dd', '#39eae8', '#0023bb', '#e14096', '#e3d43c', '#adadad']
                themeColors = ['#266fe8', '#f57984', '#50cea4', '#f4a465', '#c559dd', '#39eae8', '#0023bb', '#e14096', '#e3d43c', '#adadad']
                shadowColor = 'transparent'
                break
        }
        let that = this
        let legendData = []
        let data = this.chartData
        let colors = themeColors
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
                left: 20,
                top: 10,
                bottom: 10,
                itemWidth: 14,
                itemHeight: 4,
                textStyle: {
                    color: legendColor,
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
                            shadowColor: shadowColor
                        }
                    }
                }
            ]
        }

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
