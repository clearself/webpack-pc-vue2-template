<template>
    <div ref="myEcharts" class="echarts"></div>
</template>

<script>
export default {
    name: 'Bar',
    props: ['chartData', 'title', 'type'],
    data() {
        return {

        }
    },
    mounted() {
        let backgroundColor; let lineColor; let legendColor; let splitColor; let fontColor = ''

        backgroundColor = '#fff'
        lineColor = '#3aa6e4'
        legendColor = '#000'
        splitColor = 'rgba(0,0,0,0.1)'
        fontColor = '#000'
        let data = this.chartData

        let xData = []; let yData = []

        data.forEach((item, index) => {
            xData.push(item.name)
            yData.push(item.num)
        })
        let option = {
            tooltip: {
                trigger: 'axis',
                formatter: function(params) {
                    console.log(params)
                    return params[0].name + '：' + params[0].data
                }
            },
            legend: {
                data: ['数量'],
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
                    color: fontColor,
                    fontSize: 10,
                    rotate: 45,
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
                    color: fontColor,
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
            series: [{
                name: '数量',
                type: 'bar',
                barWidth: '14',
                barMinHeight: '2',
                data: yData,
                itemStyle: {
                    normal: {
                        color: '#13a3ff'
                    }
                }
            }]
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
