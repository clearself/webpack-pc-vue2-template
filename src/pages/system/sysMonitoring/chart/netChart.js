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
        trigger: 'axis'
    },
    color: [],
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['16:00', '18:00', '20:00', '22:00', '00:00', '02:00'],
        axisTick: {
            show: false // 不显示坐标轴刻度线
        },
        axisLine: {
            show: false // 不显示坐标轴线
        }
    },
    yAxis: {
        type: 'value',
        splitLine: { show: false }, // 去除网格线
        axisTick: { // y轴刻度线
            show: false
        },
        axisLine: { // y轴
            show: false
        },
        axisLabel: {
            color: '#444343',
            formatter: function(value, index) {
                return byteConversion(value)
            }
        }
    },
    series: [
        {
            name: 'Direct',
            type: 'line',
            stack: 'Total',
            data: [320, 332, 301, 334, 390, 330, 320],
            symbol: 'circle', // 设定为实心点
            symbolSize: 7 // 设定实心点的大小
        },
        {
            name: 'Search Engine',
            type: 'line',
            stack: 'Total',
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            symbol: 'circle', // 设定为实心点
            symbolSize: 7 // 设定实心点的大小
        }
    ]
}

export default {
    template: `
        <div style="width:100%;height:100%;"></div>`,
    props: ['chartMes', 'searchTp', 'preSearchFilter', 'colorArr'],
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
                    stack: 'Total',
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
                trigger: 'axis',
                formatter: (params) => {
                    return toolTipFormatter(params) // 传入params和定义的单位数组
                }
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
                color: '#444343',
                formatter: function(value, index) {
                    return byteConversion(value)
                }
            }

            this.chartOption.series = seriesData

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
