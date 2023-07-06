import echarts from 'echarts/index'

const option = {
    // tooltip: {
    //     trigger: 'item',
    //     formatter: '{a0}：{c0}'
    // },
    title: [
        {
            text: '已使用 \n{num|34%}',
            x: '48%',
            y: '30%',
            textAlign: 'center',
            textStyle: {
                color: '#d5852f',
                rich: {
                    num: {
                        fontSize: 28,
                        fontWeight: 'bold',
                        lineHeight: 40,
                        color: '#d5852f'
                    }
                }
            }
        }
    ],
    legend: {
        width: '240',
        x: 'center',
        bottom: '8%',
        data: [
            {
                name: '总容量',
                icon: 'circle'
            },
            {
                name: '剩余容量',
                icon: 'circle'
            }

        ]
    },
    angleAxis: {
        max: 100,
        clockwise: true,
        show: false
    },
    radiusAxis: {
        type: 'category',
        show: true,
        axisLabel: {
            show: false
        },
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        }
    },
    polar: {
        center: [
            '50%',
            '36%'
        ],
        radius: [
            '44%',
            '70%'
        ]
    },
    series: [
        {
            name: '剩余容量',
            type: 'bar',
            data: [
                {
                    value: 30,
                    value2: 30
                }
            ],
            stack: 'one',
            coordinateSystem: 'polar',
            roundCap: true,
            zlevel: 21,
            itemStyle: {
                normal: {
                    color: '#ff9908',
                    borderWidth: 2,
                    borderColor: '#ff9908'
                }
            }
        },
        {
            name: '总容量',
            type: 'bar',
            data: [
                {
                    value: 100,
                    value2: 100
                }
            ],
            stack: 'one',
            coordinateSystem: 'polar',
            roundCap: true,
            zlevel: 20,
            itemStyle: {
                normal: {
                    color: '#eaeaea',
                    borderWidth: 2,
                    borderColor: '#eaeaea'
                }
            }
        },
        {
            name: '外层背景',
            type: 'pie',
            radius: [
                '0%',
                '38%'
            ],
            silent: true,
            center: [
                '50%',
                '36%'
            ],
            itemStyle: {
                normal: {
                    opacity: 1,
                    color: '#ffffff'
                }
            },
            label: {
                normal: {
                    show: false
                }
            },
            data: [
                {
                    value: 0,
                    name: '外层背景'
                }
            ]
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
            if (!this.chartMes) {
                this.myChart.clear()
                return
            }
            this.chartOption = this.$deepCopy(option)
            // let chartData = this.$deepCopy(this.chartMes)
            let perNum = 0
            if (this.chartMes.residualCap) {
                this.chartMes.residualCap = this.chartMes.residualCap.slice(0, -1)
                perNum = Number(this.chartMes.residualCap)
            }

            // console.log(perNum, 'xxxxxxxxxxxxxxxxx')
            this.chartOption.series[0].data = [
                {
                    value: perNum,
                    value2: perNum
                }
            ]
            this.chartOption.title[0].text = `剩余容量 \n{num|${perNum}%}`
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
