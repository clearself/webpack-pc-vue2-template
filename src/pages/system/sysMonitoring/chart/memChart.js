import echarts from 'echarts/index'

const option = {
    tooltip: {
        trigger: 'axis'
    },
    xAxis: {
        type: 'category',
        data: ['08/08', '08/09', '08/10', '08/11', '08/12', '08/13'],
        axisTick: {
            show: false // 不显示坐标轴刻度线
        },
        axisLine: {
            show: false // 不显示坐标轴线
        }
    },
    yAxis: {
        scale: true,
        type: 'value',
        axisTick: {
            show: false // 不显示坐标轴刻度线
        },
        axisLine: {
            show: false // 不显示坐标轴线
        },
        axisLabel: {
            formatter: '{value}%'
        },
        splitLine: {
            show: true,
            lineStyle: {
                // 使用深浅的间隔色
                color: '#e1f5fc'
            },
            color: '#e1f5fc'
        }
    },
    series: [
        {
            data: [150, 230, 224, 218, 135, 147, 260],
            formatter: '{value}%',
            type: 'line',
            color: '#501399',
            symbol: 'circle', // 设定为实心点
            symbolSize: 7 // 设定实心点的大小
        }
    ]
}

export default {
    template: `
        <div style="width:100%;height:100%;"></div>`,
    props: ['chartMes', 'searchTp', 'preSearchFilter'],
    data() {
        return {
            myChart: null,
            chartOption: null
        }
    },
    watch: {
        chartMes() {
            this.drawMap()
        }
    },
    methods: {
        drawMap() {
            if (!this.myChart) {
                this.myChart = echarts.init(this.$el)
            }
            if (!this.chartMes || !this.chartMes.length) {
                this.myChart.clear()
                return
            }
            let chartData = this.$deepCopy(this.chartMes)
            this.chartOption = this.$deepCopy(option)
            // console.log(chartData, 'cpucpucpucpucpucpucpucpucpucpucpucpu')
            let xData = []
            let seriesData = []
            chartData.forEach(item => {
                xData.push(item.resTime)
                if (item.memaryUsage) {
                    let memaryUsage = item.memaryUsage.slice(0, -1)
                    memaryUsage = Number(memaryUsage)
                    seriesData.push(memaryUsage)
                } else {
                    seriesData.push(0)
                }
            })

            this.chartOption.tooltip = {
                trigger: 'axis',
                formatter: function(params) {
                    var relVal = params[0].name
                    for (var i = 0, l = params.length; i < l; i++) {
                        relVal += '<br/>' + params[i].marker + params[i].value + '%'
                    }
                    return relVal
                }
            }
            this.chartOption.xAxis.data = xData
            this.chartOption.series[0].data = seriesData

            this.chartOption.xAxis.axisLabel = {
                formatter: function(value) {
                    var ret = '' // 拼接加\n返回的类目项
                    var max = 10 // 每行显示的文字字数
                    var val = value.length // X轴内容的文字字数
                    var rowN = Math.ceil(val / max) // 需要换的行数
                    if (rowN > 1) { // 判断 如果字数大于2就换行
                        for (var i = 0; i < rowN; i++) {
                            var temp = '' // 每次截取的字符串
                            var start = i * max // 开始截取的位置
                            var end = start + max // 结束截取的位置
                            temp = value.substring(start, end) + '\n'
                            ret += temp // 最终的字符串
                        }
                        return ret
                    } else { return value }
                }
            }
            this.myChart.clear()
            this.myChart.setOption(this.chartOption)
        },
        resizeMap() {
            if (this.myChart) {
                this.myChart.resize()
            }
        }
    }
}
