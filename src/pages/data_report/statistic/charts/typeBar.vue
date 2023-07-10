<template>
    <div ref="myEcharts" class="echarts"></div>
</template>

<script>
export default {
    name: 'TypeBar',
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
        splitColor = 'rgba(0,0,0,0.1)'
        let colors = ['#13a3ff', '#ffdc62', '#ff4989']
        let data = this.chartData
        console.log('结果', data)
        let xData = []; let jrl = []; let sbl = []

        data.forEach((item, index) => {
            xData.push(item.name)
            jrl.push(item.jr)
            // shl.push(item.sh);
            sbl.push(item.sb)
        })
        let legendData = ['合规量', '上报量']

        let series = [{
            name: '合规量',
            type: 'bar',
            barWidth: '10',
            barMinHeight: '2',
            data: jrl,
            itemStyle: {
                normal: {
                    // eslint-disable-next-line no-undef
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: colors[0]
                    }, {
                        offset: 1,
                        color: colors[0]
                    }]),
                    opacity: 1
                }
            }
        },

        {
            name: '上报量',
            type: 'bar',
            barWidth: '10',
            barMinHeight: '2',
            data: sbl,
            itemStyle: {
                normal: {
                    // eslint-disable-next-line no-undef
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: colors[2]
                    }, {
                        offset: 1,
                        color: colors[2]
                    }]),
                    opacity: 1
                }
            }
        }
        ]
        let option = {
            backgroundColor: backgroundColor,
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: legendData,
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
                }
            },
            grid: {
                left: '2%',
                right: '2%',
                top: '4%',
                bottom: '3%',
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
                        color: splitColor,
                        type: 'dashed'
                    }
                },
                axisLabel: {
                    formatter: '{value}',
                    color: legendColor,
                    fontSize: 10,
                    rotate: 20,
                    interval: 0// 代表显示所有x轴标签显示
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
                        color: splitColor
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
                        color: splitColor,
                        type: 'dashed'
                    }
                }
            },
            series: series
        }
        // eslint-disable-next-line no-undef
        var myChart = echarts.init(this.$refs.myEcharts)
        myChart.setOption(option)
        window.onresize = myChart.resize
    }
}
</script>

<style scoped lang="scss">
    .echarts {
        width: 100%;
        height: 100%;
    }
</style>
