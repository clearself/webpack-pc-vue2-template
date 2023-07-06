import echarts from 'echarts/index'

function byteConversion(b) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    let l = 0
    let n = parseInt(b, 10) || 0
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
    color: ['#3398DB'],
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        },
        formatter: (params) => {
            return toolTipFormatter(params) // 传入params和定义的单位数组
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
        axisLabel: {
            formatter: function(value, index) {
                return byteConversion(value)
            }
        }
    },
    yAxis: {
        type: 'category',
        data: []
    },
    series: [
        {
            name: '日志大小',
            type: 'bar',
            data: []
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
            let xData = []
            let seriesData = []
            chartData.forEach(item => {
                xData.push(item.name)
                if (item.size) {
                    let size = Number(item.size)
                    seriesData.push(size)
                } else {
                    seriesData.push(0)
                }
            })
            this.chartOption.yAxis.data = xData
            this.chartOption.xAxis.axisLabel = {
                formatter: function(value, index) {
                    return byteConversion(value)
                }
            }
            this.chartOption.tooltip = {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: (params) => {
                    return toolTipFormatter(params) // 传入params和定义的单位数组
                }
            }

            this.chartOption.series[0].data = seriesData
            // console.log(this.chartOption)
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
