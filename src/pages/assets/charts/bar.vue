<template>
    <div ref="myEcharts" class="echarts"></div>
</template>

<script>
export default {
    name: 'Bar',
    props: ['chartData', 'title', 'type', 'name'],
    data() {
        return {

        }
    },
    mounted() {
        let theme = 'white-theme'
        let splitColor, legendColor
        switch (theme) {
            case 'white-theme':
                splitColor = '#ebedee'
                legendColor = '#aeaeae'
                break
            default :
                splitColor = 'rgba(255,255,255,.3)'
                legendColor = '#fff'
        }

        let that = this
        let data = this.chartData
        var fontColor = 'rgba(255,255,255,0.5)'
        let xData = []; let yData = []
        data.forEach(item => {
            xData.push(item.name)
            yData.push(item.value)
        })
        let option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: [this.name],
                show: true,
                x: 'right',
                y: 'top',
                icon: 'stack',
                itemWidth: 15,
                itemHeight: 5,
                textStyle: {
                    color: this.type == 1 ? '#266fe8' : '#50cea4',
                    fontSize: 10
                },
                nameTextStyle: {
                    color: legendColor
                }
            },
            grid: {
                left: '2%',
                right: '2%',
                top: '10%',
                bottom: '6%',
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                data: xData,
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: 'rgba(255,255,255,0.05)',
                        type: 'dashed'
                    }
                },
                axisLabel: {
                    formatter: '{value}',
                    color: legendColor,
                    fontSize: 12,
                    interval: 0
                    // rotate: 30,
                },
                splitLine: {
                    show: false
                }
            }],
            yAxis: {
                type: 'value',
                minInterval: 1,
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: 'rgba(255,255,255,0.05)'
                    }
                },
                axisLabel: {
                    formatter: '{value}',
                    color: legendColor,
                    fontSize: 12
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: splitColor
                    }
                }
            },
            series: [{
                name: this.name,
                type: 'bar',
                barWidth: '20',
                barMinHeight: '5',
                data: yData,
                itemStyle: {
                    normal: {
                        color: this.type == 1 ? '#266fe8' : '#50cea4',
                        barBorderRadius: [10, 10, 0, 0]
                    }
                }
            }]
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
