import echarts from 'echarts/index'

const option = {
    tooltip: {
        trigger: 'item'
    },
    legend: {
        type: 'scroll',
        orient: 'vertical',
        height: '80%',
        left: '60%',
        top: 'center',
        itemWidth: 15,
        itemHeight: 15,
        itemGap: 25,
        data: [],
        textStyle: {
            rich: {
                name: {
                    fontSize: 14,
                    fontWeight: 400,
                    width: 100,
                    height: 20,
                    padding: [
                        0,
                        0,
                        0,
                        5
                    ],
                    color: 'rgba(0, 0, 0, 0.85)',
                    fontFamily: 'Source Han Sans CN-Regular'
                },
                value: {
                    fontSize: 14,
                    fontWeight: 500,
                    height: 20,
                    width: 50,
                    align: 'left',
                    color: 'rgba(0, 0, 0, 0.65)',
                    fontFamily: 'Source Han Sans CN-Regular'
                }
            }
        }
    },
    series: [
        {
            type: 'pie',
            radius: [
                '43%',
                '55%'
            ],
            center: [
                '35%',
                '50%'
            ],
            // itemStyle: {
            //     shadowBlur: 8,
            //     shadowColor: 'rgba(255, 255, 255, 0)',
            //     borderColor: '#FFF',
            //     borderWidth: 2
            // },
            label: {
                show: false
            },
            labelLine: {
                show: false
            },
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
                let obj = {
                    name: item.name,
                    value: item.num || 0
                }
                seriesData.push(obj)
            })
            this.chartOption.legend.data = xData
            this.chartOption.series[0].data = seriesData
            console.log(this.chartOption, 'sssssssssszzzzzzzzzzzzz')
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
