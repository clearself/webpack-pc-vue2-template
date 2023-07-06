<template>
    <div ref="myEcharts" class="echarts"></div>
</template>

<script>
export default {
    name: 'BrokenLine',
    props: ['chartData', 'name', 'colorData', 'xData', 'areaColor', 'maxData', 'sayTimes'],
    data() {
        return {

        }
    },

    mounted() {
        let that = this
        let timeSecond = (new Date(this.sayTimes[1]).getTime() - new Date(this.sayTimes[0]).getTime()) / 1000
        // prettier-ignore
        const days = [
            '目标达成'
        ]
        // prettier-ignore
        const data = this.chartData.map(function(item) {
            return [item[1], item[0], item[2] || '-']
        })
        let option = {
            tooltip: {
                trigger: 'axis',
                extraCssText: 'box-shadow: 0px 0px 8px 0px rgba(140,152,164,0.4);',
                backgroundColor: '#fff',
                textStyle: {
                    color: 'rgba(0,0,0,0.9)'
                },
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function(params) {
                    var tar = params[0]
                    console.log('params', params)
                    return tar.axisValue + '<br/>' + '<div style="text-align:center"><span style="color: #0052D9">数量</span>' + '<span style="color: #0052D9">：</span>' + '<span style="color: #0052D9">' + tar.data[2] + '</span></div>'
                }
            },
            grid: {
                height: '100%',
                top: '0%',
                left: '0%',
                right: '0%'
            },
            xAxis: {
                axisLabel: {
                    // formatter: function() {
                    //     return ''
                    // }
                    show: false,
                    formatter: function(params) {
                        console.log('123456', params)
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
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: 'rgba(0,0,0,0.9)'// x轴轴线颜色
                    }
                },
                type: 'category',
                data: this.xData,
                splitArea: {
                    show: true,
                    areaStyle: {
                        color: this.areaColor
                    }
                }
            },
            yAxis: {
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#D5D5D5'// x轴轴线颜色
                    }
                },
                axisLabel: {
                    formatter: function() {
                        return ''
                    }
                },
                type: 'category',
                data: days,
                splitArea: {
                    show: true
                }
            },
            visualMap: {
                min: 0,
                max: this.maxData,
                show: false,
                inRange: {
                    color: this.colorData
                }
                // calculable: true,
                // orient: 'horizontal',
                // left: 'center',
                // bottom: '15%'
            },
            series: [
                {
                    name: 'Punch Card',
                    type: 'heatmap',
                    data: data,
                    label: {
                        show: false
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
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
