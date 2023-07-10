<template>
    <div ref="myEcharts" class="echarts"></div>
</template>

<script>
export default {
    name: 'PortLine',
    props: ['chartData', 'title', 'type', 'ip', 'port'],
    data() {
        return {

        }
    },
    mounted() {
        let colors = ['#ededef', '#03d4f3', 'yellow', '#C71585', '#C71585', '#FF00FF', '#1E90FF', '#00FF7F']
        var fontColor = 'rgba(255,255,255,0.5)'
        let data = this.chartData
        console.log('结果', data)
        let xData = []
        let legendData
        let series = []; let list1 = []; let list2 = []
        if (this.type == 1) {
            legendData = ['整体流量', this.ip + '流量']
            data.forEach((item, index) => {
                xData.push(item.day)
                list1.push(item.allNum)
                list2.push(item.ipNum)
            })
        } else if (this.type == 2) {
            console.log('legendData', this.port)
            legendData = ['整体流量', this.port + '流量']
            data.forEach((item, index) => {
                xData.push(item.day)
                list1.push(item.allNum)
                list2.push(item.portNum)
            })
        }

        series = [
            {
                name: '整体流量',
                type: 'line',
                smooth: false, // true 为平滑曲线，false为直线
                itemStyle: {
                    normal: {
                        color: colors[0],
                        lineStyle: {
                            color: colors[0],
                            width: 1
                        },
                        areaStyle: {
                            // eslint-disable-next-line no-undef
                            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                                offset: 0,
                                color: 'rgba(255,255,255,.2)'
                            }, {
                                offset: 1,
                                color: 'rgba(255,255,255,.2)'
                            }])
                        }
                    }
                },
                data: list1
            },
            {
                name: this.type == 1 ? this.ip + '流量' : this.port + '流量',
                type: 'line',
                smooth: false, // true 为平滑曲线，false为直线
                itemStyle: {
                    normal: {
                        color: colors[1],
                        lineStyle: {
                            color: colors[1],
                            width: 1
                        },
                        areaStyle: {
                            // eslint-disable-next-line no-undef
                            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                                offset: 0,
                                color: 'rgba(23,51,55,.8)'
                            }, {
                                offset: 1,
                                color: 'rgba(23,51,55,0.8)'
                            }])
                        }
                    }
                },
                data: list2
            }
        ]

        let option = {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
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
                    color: 'rgba(255,255,255,1)',
                    fontSize: 15
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

<style scoped lang="scss">
    .echarts {
        width: 100%;
        height: 100%;
    }
</style>
