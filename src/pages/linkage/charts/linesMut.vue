<template>
    <div ref="myEcharts" class="echarts"></div>
</template>

<script>
export default {
    name: 'BrokenLineMut',
    props: ['chartData', 'title', 'type'],
    data() {
        return {
            isWhite: 'white-theme'
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.init()
        })
    },
    methods: {
        init() {
            let colors = ['#1fb1fe', '#fa7f25', '#ffdc00', '#65c294', '#00FFFF']
            var fontColor = 'rgba(255,255,255,0.5)'
            let data = this.chartData
            console.log('趋势', data)
            let xData = []
            let legendData = []
            let series = []
            data.forEach((item, index) => {
                xData.push(item.day)
            })

            data[0].from.forEach((item, index) => {
                let names = []
                let list = []
                data.forEach((_item, _index) => {
                    list.push(_item.from[index].num)
                })
                legendData.push(item.fromCN)
                let obj = {
                    name: item.fromCN,
                    type: 'line',
                    smooth: true, // true 为平滑曲线，false为直线
                    symbolSize: 10,
                    itemStyle: {
                        normal: {
                            color: colors[index],
                            lineStyle: {
                                color: colors[index],
                                width: 2
                            }
                        }
                    },
                    data: list
                }
                series.push(obj)
            })

            let option = {
                title: {
                    show: !!(this.type && this.type == 1),
                    text: '单位（Mbps）',
                    textStyle: {
                        color: this.isWhite ? '#333' : '#fff',
                        fontSize: 12
                    }
                },
                backgroundColor: this.isWhite ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,.2)',
                grid: {
                    left: '2%',
                    right: '3%',
                    top: '8%',
                    bottom: '16%',
                    containLabel: true
                },
                tooltip: {
                    show: true,
                    trigger: 'axis',
                    formatter: (params) => {
                        let str = params[0].name + '<br />'
                        if (this.type && this.type == 1) {
                            params.forEach((item) => {
                                str +=
                            '<div style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;background-color:' + item.color + '"></div>' + item.seriesName + ' : ' + item.value + '<br />'
                            })
                        } else {
                            params.forEach((item) => {
                                str +=
                            '<div style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;background-color:' + item.color + '"></div>' + item.seriesName + ' : ' + item.value + '%<br />'
                            })
                        }

                        return str
                    }
                },
                legend: {
                    show: true,
                    x: 'center',
                    bottom: '8%',
                    icon: 'circle',
                    itemWidth: 12,
                    itemHeight: 10,
                    textStyle: {
                        color: this.isWhite ? 'rgba(0,0,0,1)' : 'rgba(255,255,255,1)',
                        fontSize: 12
                    },
                    nameTextStyle: {
                        color: this.isWhite ? 'rgba(0,0,0,1)' : 'rgba(255,255,255,1)'
                    },
                    data: legendData
                },
                xAxis: [{
                    type: 'category',
                    boundaryGap: false,
                    axisLabel: {
                        color: this.isWhite ? 'rgba(0,0,0,1)' : 'rgba(255,255,255,1)',
                        fontSize: 10
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: this.isWhite ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: !this.isWhite,
                        lineStyle: {
                            color: this.isWhite ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'
                        }
                    },
                    data: xData
                }],
                yAxis: [{
                    type: 'value',
                    minInterval: 1,
                    nameTextStyle: {
                        color: '#fff',
                        fontSize: 12
                    },
                    axisLabel: {
                        formatter: this.type && this.type == 1 ? '{value}' : '{value}%',
                        textStyle: {
                            color: this.isWhite ? 'rgba(0,0,0,1)' : 'rgba(255,255,255,1)',
                            fontSize: 10
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: this.isWhite ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: this.isWhite ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'
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
}
</script>

<style scoped lang="scss">
.echarts {
    width: 100%;
    height: 100%;
}
</style>
