<template>
    <div ref="myEcharts" class="echarts"></div>
</template>

<script>
export default {
    name: 'BrokenLine',
    props: ['chartData', 'title', 'type', 'sayTimes'],
    data() {
        return {

        }
    },

    mounted() {
        let that = this
        let timeSecond = (new Date(this.sayTimes[1]).getTime() - new Date(this.sayTimes[0]).getTime()) / 1000
        let lineColor = '#387dee'
        let legendColor = '#387dee'
        let backgroundColor = 'transparent'
        let fontColor = '#aeaeae'
        let axisLineColor = '#cbcfd2'
        let splitLineColor = '#cbcfd2'
        let data = this.chartData
        let xData = []
        let yData = []
        data.forEach(item => {
            xData.push(item.name)
            yData.push(item.value)
        })
        let option = {
            backgroundColor: backgroundColor,
            grid: {
                left: '2%',
                right: '2%',
                top: '10%',
                bottom: '5%',
                containLabel: true
            },
            tooltip: {
                show: true,
                trigger: 'item',
                formatter: '{b} <br /> 事件量：{c}'
            },
            legend: {
                show: true,
                right: '1%',
                top: '-2%',
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
                data: ['事件量']
            },
            xAxis: [{
                type: 'category',
                boundaryGap: false,
                axisLabel: {
                    color: fontColor,
                    fontSize: 12,
                    margin: 12,
                    // rotate: 10,
                    formatter: function(params) {
                        console.log('2222222', params)
                        if (timeSecond <= 3600 * 24 * 7) { // 两天以内显示 月日 时分
                            let top = params.substring(5, 10)
                            let bottom = params.substring(11, 16)
                            return bottom + '\n' + top
                        } else if (timeSecond > 3600 * 24 * 2 && timeSecond <= 3600 * 24 * 31) { // 30天以内显示 月日
                            let top = params.substring(5, 10)
                            return top
                        } else { // 一年以内显示 月   if (timeSecond > 3600 * 24 * 31 && timeSecond <= 3600 * 24 * 365)
                            let top = params.substring(5, 10)
                            let bottom = params.substring(11, 16)
                            return bottom + '\n' + top
                        }
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
                    show: false,
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
                    textStyle: {
                        color: fontColor,
                        fontSize: 12
                    },
                    margin: 12,
                    formatter: function(value, index) {
                        return that.$handelNum(value)
                    }
                },
                axisLine: {
                    show: false,
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
                }
            }],
            series: [{
                name: '事件量',
                type: 'line',
                smooth: true, // true 为平滑曲线，false为直线
                // symbolSize:8 ,
                itemStyle: {
                    normal: {
                        color: '#0394c1',
                        lineStyle: {
                            color: lineColor,
                            width: 1
                        },
                        areaStyle: {
                            // eslint-disable-next-line no-undef
                            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                                offset: 0,
                                color: '#d5e5fa'

                            }])
                            /*, {
                                offset: 1,
                                color: 'rgba(30, 136, 229, .4)'
                            }*/
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
        this.$resizeEcharts(this.$refs.myEcharts, myChart)
    }
}
</script>

<style scoped lang="scss">
    .echarts {
        width: 100%;
        height: 100%;
    }
</style>
