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
        let theme = this.$store.state.common.currentTheme
        let backgroundColor, lineColor, legendColor, splitColor
        backgroundColor = '#fff'
        lineColor = '#3aa6e4'
        legendColor = '#000'
        splitColor = 'rgba(0,0,0,0)'
        let data = this.chartData
        let xData = []
        let yData = []
        data.forEach(item => {
            xData.push(item.days)
            yData.push(item.num)
        })
        let option = {
            backgroundColor: backgroundColor,
            grid: {
                left: '2%',
                right: '2%',
                top: '5%',
                bottom: '10%',
                containLabel: true
            },
            tooltip: {
                show: true,
                trigger: 'item'
            },
            legend: {
                show: true,
                x: 'center',
                y: 'bottom',
                icon: 'stack',
                itemWidth: 15,
                itemHeight: 5,
                textStyle: {
                    color: legendColor,
                    fontSize: 15
                },
                nameTextStyle: {
                    color: legendColor
                }
            },
            xAxis: [{
                type: 'category',
                boundaryGap: false,
                axisLabel: {
                    color: legendColor,
                    fontSize: 10
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: splitColor
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: splitColor
                    }
                },
                data: xData
            }],
            yAxis: [{
                type: 'value',
                minInterval: 1,
                nameTextStyle: {
                    color: legendColor,
                    fontSize: 12
                },
                axisLabel: {
                    formatter: '{value}',
                    textStyle: {
                        color: legendColor,
                        fontSize: 10
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: splitColor
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: splitColor
                    }
                }
            }],
            series: [{
                type: 'line',
                smooth: true, // true 为平滑曲线，false为直线
                // smooth:true,  //这个是把线变成曲线
                itemStyle: {
                    normal: {
                        color: lineColor,
                        lineStyle: {
                            color: lineColor,
                            width: 2
                        },
                        areaStyle: {
                            // eslint-disable-next-line no-undef
                            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                                offset: 0,
                                color: 'rgba(0,255,255,0)'
                            }, {
                                offset: 1,
                                color: lineColor
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
