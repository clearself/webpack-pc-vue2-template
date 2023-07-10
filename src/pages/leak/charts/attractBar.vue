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
        let that = this
        let colors = ['red', 'green', 'yellow', '#C71585', '#C71585', '#FF00FF', '#1E90FF', '#00FF7F']
        var fontColor = 'rgba(255,255,255,0.5)'
        let data = this.chartData
        console.log('结果', data)
        let xData = []
        let list = []
        data.forEach((item, index) => {
            xData.push(item.host)
            list.push(item.num)
        })
        let option = {
            title: {
                text: this.title,
                bottom: '3%',
                left: 'center',
                textStyle: {
                    color: '#FFF',
                    fontSize: 12
                }
            },
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                show: true,
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
                left: '2%',
                right: '2%',
                top: '10%',
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
                    formatter: '{value}',
                    color: fontColor,
                    fontSize: 12
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
                    fontSize: 12
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: 'rgba(255,255,255,0.05)',
                        type: 'dashed'
                    }
                }
            },
            series: [
                {
                    name: '',
                    type: 'bar',
                    barWidth: '10',
                    barMinHeight: '2',
                    data: list,
                    itemStyle: {
                        normal: {
                            color: 'rgba(84,232,215,1)'
                        }
                    }
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
