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
        let theme = this.$store.state.common.currentTheme
        let legendColor, splitColor
        switch (theme) {
            case 'white-theme':
                legendColor = '#000'
                splitColor = '#ebedee'
                break
            default :
                legendColor = 'rgba(255,255,255,0.5)'
                splitColor = 'rgba(255,255,255,0.05)'
        }

        let that = this
        let data = this.chartData
        var fontColor = 'rgba(255,255,255,0.5)'
        let xData = []; let yData = []

        data.forEach((item, index) => {
            xData.push(item.day)
            yData.push(item.num)
        })
        let option = {
            tooltip: {
                trigger: 'axis',
                formatter: function(params) {
                    return params[0].name + '：' + params[0].data
                }
            },
            legend: {
                show: false,
                data: [''],
                x: 'center',
                y: 'bottom',
                icon: 'stack',
                itemWidth: 15,
                itemHeight: 5,
                textStyle: {
                    color: 'rgba(255,255,255,1)',
                    fontSize: 15
                },
                nameTextStyle: {
                    color: 'rgba(255,255,255,1)'
                }
            },
            grid: {
                left: '10px',
                right: '0',
                top: '10px',
                bottom: 0,
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
                        color: '',
                        type: 'dashed'
                    }
                },
                axisLabel: {
                    formatter: '{value}',
                    color: legendColor,
                    fontSize: 10,
                    rotate: this.type == 1 ? 20 : 0,
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
                        color: 'rgba(255,255,255,0.05)'
                    }
                },
                axisLabel: {
                    formatter: '{value}',
                    color: legendColor,
                    fontSize: 10
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
                name: '',
                type: 'bar',
                barWidth: '8px',
                data: yData,
                itemStyle: {
                    normal: {
                        color: '#f0ff00'
                    }
                }
            }]
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
