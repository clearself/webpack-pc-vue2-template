<template>
    <div ref="myEcharts" class="echarts"></div>
</template>

<script>
export default {
    name: 'BrokenLine',
    props: ['chartData', 'title', 'type'],
    data() {
        return {

        }
    },
    mounted() {
        let backgroundColor = ''; let legendColor = ''; let lineColor = ''; let fontColor = ''; let axisLineColor = ''; let splitLineColor = ''
        lineColor = '#1e88e5'
        legendColor = '#3f4f57'
        backgroundColor = '#fff'
        fontColor = '#3f4f57'
        axisLineColor = '#cbcfd2'
        splitLineColor = '#cbcfd2'
        let data = this.chartData
        let xData = []
        let yData = []
        data.forEach(item => {
            xData.push(item.month)
            yData.push(item.num)
        })
        let option = {
            backgroundColor: backgroundColor,
            grid: {
                left: '2%',
                right: '3%',
                top: '8%',
                bottom: '5%',
                containLabel: true
            },
            tooltip: {
                show: true,
                trigger: 'item'
            },
            legend: {
                show: true,
                x: 'right',
                y: 'top',
                icon: 'stack',
                itemWidth: 15,
                itemHeight: 5,
                textStyle: {
                    color: legendColor,
                    fontSize: 12
                },
                nameTextStyle: {
                    color: legendColor
                },
                data: ['演练次数']
            },
            xAxis: [{
                type: 'category',
                boundaryGap: false,
                axisLabel: {
                    color: fontColor,
                    fontSize: 10
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: axisLineColor
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: splitLineColor
                    }
                },
                data: xData
            }],
            yAxis: [{
                type: 'value',
                nameTextStyle: {
                    color: '#fff',
                    fontSize: 12
                },
                minInterval: 1,
                axisLabel: {
                    formatter: '{value}',
                    textStyle: {
                        color: fontColor,
                        fontSize: 10
                    }
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: axisLineColor
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: splitLineColor,
                        type: 'dashed'
                    }
                }
            }],
            series: [{
                name: '演练次数',
                type: 'line',
                smooth: true, // true 为平滑曲线，false为直线
                symbolSize: 8,
                itemStyle: {
                    normal: {
                        color: '#1da4f4',
                        lineStyle: {
                            color: lineColor,
                            width: 2
                        },
                        areaStyle: {
                            // eslint-disable-next-line no-undef
                            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                                offset: 0,
                                color: 'rgba(4, 255, 252, 0)'

                            }, {
                                offset: 1,
                                color: 'rgba(30, 136, 229, .6)'
                            }])
                        }
                    }
                },
                data: yData
            }
            ]
        }
        // eslint-disable-next-line no-undef
        var myChart = echarts.init(this.$refs.myEcharts)
        myChart.setOption(option)
    }
}
</script>

<style scoped lang="scss">
    .echarts {
        width: 100%;
        height: 100%;
    }
</style>
