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
        let colors = ['#fdbb47', '#4bcbff', '#13c7ff', '#c987ff', '#10f6ff']
        var fontColor = 'rgba(255,255,255,1)'
        let data = this.chartData
        console.log('结果', data)
        let xData = []; let list1 = []; let list2 = []
        let legendData = ['提交总量', '审核总量']
        let series = null
        if (data.length > 0) {
            data.forEach((item, index) => {
                xData.push(item.day)
                list1.push(item.allNum)
                list2.push(item.passNum)
            })
        };
        series = [
            {
                name: '提交总量',
                type: 'line',
                smooth: false, // true 为平滑曲线，false为直线
                itemStyle: {
                    normal: {
                        color: colors[0],
                        lineStyle: {
                            color: colors[0],
                            width: 1
                        }
                    }
                },
                areaStyle: {
                    // eslint-disable-next-line no-undef
                    color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                        offset: 0,
                        color: 'rgba(0,255,255,0)'
                    }, {
                        offset: 1,
                        color: 'rgba(0,255,255,0.6)'
                    }])
                },
                data: list1
            },
            {
                name: '审核总量',
                type: 'line',
                smooth: false, // true 为平滑曲线，false为直线
                itemStyle: {
                    normal: {
                        color: colors[1],
                        lineStyle: {
                            color: colors[1],
                            width: 1
                        }
                    }
                },
                areaStyle: {
                    // eslint-disable-next-line no-undef
                    color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                        offset: 0,
                        color: 'rgba(0,255,255,0)'
                    }, {
                        offset: 1,
                        color: 'rgba(0,255,255,0.6)'
                    }])
                },
                data: list2
            }
        ]

        let option = {
            backgroundColor: 'rgba(0, 0, 0, 0)',
            grid: {
                left: '2%',
                right: '2%',
                top: '28%',
                bottom: '5%',
                containLabel: true
            },
            tooltip: {
                show: true,
                trigger: 'item'
            },
            legend: {
                type: 'scroll',
                pageTextStyle: {
                    color: '#fff'
                },
                show: true,
                x: 'right',
                y: 0,
                icon: 'stack',
                itemWidth: 15,
                itemHeight: 5,
                textStyle: {
                    color: 'rgba(255,255,255,1)',
                    fontSize: 10
                },
                nameTextStyle: {
                    color: 'rgba(255,255,255,1)'
                },
                data: legendData
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
                        color: 'rgba(255,255,255,0.1)'
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: 'rgba(255,255,255,0.05)'
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
                axisLabel: {
                    formatter: '{value}',
                    textStyle: {
                        color: fontColor,
                        fontSize: 10
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: 'rgba(255,255,255,0.1)'
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: 'rgba(255,255,255,0.05)'
                    }
                }
            }],
            series: series
        }
        // eslint-disable-next-line no-undef
        var myChart = echarts.init(this.$refs.myEcharts)
        myChart.setOption(option)
    }
}
</script>

<style scoped >
    .echarts {
        width: 100%;
        height: 100%;
    }
</style>
