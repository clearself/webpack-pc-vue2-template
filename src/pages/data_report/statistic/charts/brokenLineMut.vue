<template>
    <div ref="myEcharts" class="echarts"></div>
</template>

<script>
export default {
    name: 'BrokenLineMut',
    props: ['chartData', 'title', 'type'],
    data() {
        return {

        }
    },
    mounted() {
        let backgroundColor, lineColor, legendColor, splitColor
        backgroundColor = '#fff'
        lineColor = '#3aa6e4'
        legendColor = '#000'
        splitColor = 'rgba(0,0,0,0)'
        let data = this.chartData
        let xData = []
        let jrl = []
        let shl = []
        let sbl = []

        data.forEach((item, index) => {
            xData.push(item.day)
            jrl.push(item.jrl)
            shl.push(item.shl)
            sbl.push(item.sbl)
        })
        let legendData = ['合规量', '上报量']
        let series = [{
            name: '合规量',
            type: 'line',
            smooth: true, // true 为平滑曲线，false为直线
            itemStyle: {
                normal: {
                    color: 'rgb(19,163,255)',
                    lineStyle: {
                        color: 'rgb(19,163,255)',
                        width: 2
                    },
                    areaStyle: {
                        // eslint-disable-next-line no-undef
                        color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                            offset: 0,
                            color: 'rgba(19,163,255,0)'
                        }, {
                            offset: 1,
                            color: 'rgba(19,163,255,0.3)'
                        }])
                    }
                }
            },
            data: jrl

        },
        {
            name: '上报量',
            type: 'line',
            smooth: true, // true 为平滑曲线，false为直线
            itemStyle: {
                normal: {
                    color: 'rgb(255,98,13)',
                    lineStyle: {
                        color: 'rgb(255,98,13)',
                        width: 2
                    },
                    areaStyle: {
                        // eslint-disable-next-line no-undef
                        color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                            offset: 0,
                            color: 'rgba(255,73,137,0)'
                        }, {
                            offset: 1,
                            color: 'rgba(255,73,137,.3)'
                        }])
                    }
                }
            },
            data: sbl

        }
        ]

        let option = {
            backgroundColor: backgroundColor,
            grid: {
                left: '2%',
                right: '3%',
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
                    fontSize: 12
                },
                nameTextStyle: {
                    color: legendColor
                },
                data: legendData
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
            series: series
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
