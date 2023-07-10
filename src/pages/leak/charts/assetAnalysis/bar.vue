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
                trigger: 'axis',
                axisPointer: {
                    type: 'none'
                }
            },
            legend: {
                show: true,
                right: '1%',
                top: '0%',
                itemWidth: 14,
                itemHeight: 4,
                textStyle: {
                    color: 'rgba(255,255,255,1)',
                    fontSize: 10
                },
                nameTextStyle: {
                    color: 'rgba(255,255,255,1)'
                },
                data: ['事件量']
            },
            grid: {
                left: '4%',
                right: '2%',
                top: '8%',
                bottom: '0%',
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
                    color: fontColor,
                    fontSize: 10,
                    // interval:0,
                    rotate: 45,
                    formatter: function(name) {
                        return (name.length > 7 ? (name.slice(0, 7) + '...') : name)
                    }
                },
                splitLine: {
                    show: false
                }
            }],
            yAxis: {
                type: 'value',
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
                    color: fontColor,
                    fontSize: 10
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: 'rgba(255,255,255,0.1)',
                        type: 'solid'
                    }
                }
            },
            series: [{
                name: '事件量',
                type: 'bar',
                barWidth: '10',
                barMinHeight: '5',
                data: yData,
                itemStyle: {
                    normal: {
                        barBorderRadius: [5, 5, 0, 0],
                        color: this.type == 1 ? '#00ffe4' : '#eaff00'
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
