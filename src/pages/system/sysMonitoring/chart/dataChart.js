import echarts from 'echarts/index'

function byteConversion(b) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    let l = 0; let n = parseInt(b, 10) || 0
    while (n >= 1024 && ++l) {
        n = n / 1024
    }
    return (n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l])
}

const toolTipFormatter = (params) => { // unit添加的单位
    let htmlStr = ''
    for (let i = 0; i < params.length; i++) {
        const param = params[i]
        const xName = param.name // x轴的名称
        const seriesName = param.seriesName // 图例名称
        let value = param.value // y轴值
        const color = param.color // 图例颜色
        value = byteConversion(value)
        if (value) { // 兼容没有值得情况不显示图例名称和value，同时兼容颜色上有渐变取第一个色值
            if (i === 0) {
                htmlStr = `
          <div style="padding:5px 3px">
            ${xName}<br/>
            <div style="display:flex">
              <div style="width:10px;height:10px;border-radius: 50%;margin:6px 4px 0 0;background:
              ${typeof color === 'string' ? color : color.colorStops[0].color}"></div>
              <div>${seriesName}：${value}</div>
            </div>
        `
            } else {
                htmlStr += `
          <div style="display:flex">
            <div style="width:10px;height:10px;border-radius: 50%;margin:6px 4px 0 0;background:
            ${typeof color === 'string' ? color : color.colorStops[0].color}"></div>
            <div>${seriesName}：${value}</div>
          </div>
        `
            }
        }
    }
    htmlStr += `</div>`
    return htmlStr
}

const option = {
    tooltip: {
        trigger: 'axis',
        transitionDuration: 1, // 提示框浮层的移动动画过渡时间
        formatter: function(params) {
            console.log(params)
            // name:类目轴数据，value：数值轴数据, dataIndex：数据的索引
            // return params[0].name + '<br>' + yData[params[0].dataIndex]
            // return params[0].name + '<br>' + params[0].value
        },
        axisPointer: {
            type: 'line',
            axis: 'x',
            snap: true // axisPointer自动吸附到最近的点上
        }
    },
    xAxis: {
        type: 'category',
        data: [],
        axisTick: {
            show: false // 不显示坐标轴刻度线
        },
        axisLine: {
            show: false // 不显示坐标轴线
        }
    },
    yAxis: {
        type: 'value',
        axisTick: {
            show: false // 不显示坐标轴刻度线
        },
        axisLine: {
            show: false // 不显示坐标轴线
        },
        axisLabel: {
            margin: 5,
            textStyle: {
                fontSize: 12
            },
            formatter: function(value) {
                return value * value * value
                // return value
            }
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
            data: [],
            type: 'line',
            color: '#501399',
            symbol: 'circle', // 设定为实心点
            symbolSize: 7 // 设定实心点的大小
        }
    ]
}

export default {
    template: `
        <div style="width:100%;height:100%"></div>`,
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
            if (!this.chartMes) {
                this.myChart.clear()
                return
            }
            this.chartOption = this.$deepCopy(option)
            this.chartOption.color = this.colorArr
            let chartData = this.$deepCopy(this.chartMes)
            let xData = []
            let seriesData = []
            let tps = Object.keys(chartData)
            if (!tps || !tps.length) return
            let firstTpArr = chartData[tps[0]]
            firstTpArr.forEach(item => {
                xData.push(item.resTime)
            })
            for (let i = 0; i < tps.length; i++) {
                seriesData.push({
                    name: tps[i],
                    type: 'line',
                    stack: 'Total' + i,
                    data: [],
                    symbol: 'circle', // 设定为实心点
                    symbolSize: 7 // 设定实心点的大小
                })
            }

            function formateInfo(info) {
                if (!info) {
                    return 0
                } else {
                    // info = Number(info)
                    // return  Math.round(info/)
                    return Number(info)
                }
            }

            seriesData.forEach(item => {
                let name = item.name
                let tpItem = chartData[name]
                let serData = []
                tpItem.forEach(serItem => {
                    serData.push(formateInfo(serItem.resInfo))
                })
                item.data = serData
            })
            console.log(seriesData)

            this.chartOption.tooltip = {
                trigger: 'axis'
            }
            this.chartOption.xAxis.data = xData
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
            this.chartOption.yAxis.axisLabel = {
                formatter: function(value) {
                    return value
                }
            }

            this.chartOption.series = seriesData

            console.log(chartData, 'zzzzzzzzzzzzzzzz')
            console.log(this.chartOption, 'zzzzzzzzzzzzzzzz')
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
