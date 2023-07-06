<template>
    <div style="width:100%;height:100%;position: relative;border-radius: 4px">
        <div class="ub ub-ac ub-pc no-data" v-if="!xData.length">暂无数据</div>
        <div class="ub ub-ac ub-pc no-data" v-if="xData.length === 1">不支持1秒内图表展示</div>
        <div ref="myEcharts" class="echarts"></div>
    </div>
</template>

<script>
import echarts from 'echarts'
export default {
    name: 'Bar',
    props: ['chartData'],
    data() {
        return {
            myChart: null,
            loading: true,
            timer: null
        }
    },
    watch: {
        chartData: {
            deep: true, // 深度监听
            handler(newVal, oldVal) {
                if (newVal.length > 0) {
                    console.log(this.xData, '图表数据')
                    this.renderChart()
                    this.clickChart()
                } else {
                    console.log(this.chartData, '图表数据')
                    // this.renderChart()
                }
            }
        }
        // isData: {
        //     deep: true, // 深度监听
        //     handler(newVal, oldVal) {
        //         if (newVal) {
        //             this.loading = false
        //         }
        //     }
        // }
    },
    computed: {
        xData() {
            return this.chartData.map(it => {
                return [new Date(it.nodeTime).getTime(), it.num]
            })
        }
    },
    mounted() {
        // this.renderChart()
        // this.clickChart()
    },
    beforeDestroy() {
        if (!this.myChart) return
        window.removeEventListener('resize', this.myChart.resize)
    },
    methods: {
        renderChart() {
            let options = {
                // backgroundColor: '#344b58',
                title: {
                    // text: '数据统计',
                    x: '4%',

                    textStyle: {
                        color: '#fff',
                        fontSize: '22'
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: (params) => {
                        // console.log(params)
                        let relVal = ''
                        if (params.value && params.value[1]) {
                            relVal += '数量：' + params.value[1] + '<br>' + '时间：' + this.chartData[params.dataIndex].startTime + ' - ' + this.chartData[params.dataIndex].endTime
                        }
                        return relVal
                    }
                },
                grid: {
                    borderWidth: 0,
                    top: 10,
                    left: 50,
                    right: 40,
                    bottom: 40,
                    textStyle: {
                        color: '#fff'
                    }
                },

                calculable: true,
                xAxis: [{
                    type: 'time',
                    axisLine: {
                        lineStyle: {
                            color: '#e7e7e7'
                        }
                    },
                    splitLine: {
                        show: false
                    },
                    splitNumber: 10,
                    // interval: 1,
                    axisTick: {
                        show: false
                    },
                    splitArea: {
                        show: false
                    },
                    axisLabel: {
                        color: 'rgba(0, 0, 0, 0.4)',
                        formatter: {
                            year: '{yyyy}',
                            month: '{MMM}',
                            day: '{d}',
                            hour: '{HH}:{mm}',
                            minute: '{HH}:{mm}',
                            second: '{HH}:{mm}:{ss}'
                        },
                        fontSize: '10'
                    }
                }],
                yAxis: [{
                    type: 'value',
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#e7e7e7'
                        }
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    splitNumber: 3,
                    minInterval: 1,
                    axisLabel: {
                        color: 'rgba(0, 0, 0, 0.4)',
                        formatter: function(value) {
                            if (value >= 10000 && value < 100000000) {
                                value = value / 10000 + '万'
                            } else if (value >= 10000000) {
                                value = value / 10000000 + '千万'
                            }
                            return value
                        }

                    },
                    splitArea: {
                        show: false
                    }
                }],
                toolbox: {
                    show: false
                },
                brush: {
                    brushType: 'lineX',
                    xAxisIndex: 'all',
                    yAxisIndex: 'all',
                    transformable: false,
                    throttleType: 'debounce',
                    removeOnClick: false,
                    brushStyle: {
                        borderWidth: 1,
                        color: 'rgba(255,255,255,0.1)',
                        borderColor: 'rgba(255,255,255,.2)'
                    }
                    // 选取之外的颜色
                    // outOfBrush: {
                    //     color: 'rgb(236, 217, 0)'
                    // }
                },
                series: [
                    {
                        type: 'bar',
                        barMinWidth: 10,
                        barMaxWidth: 50,
                        itemStyle: {
                            normal: {
                                color: '#387dee',
                                barBorderRadius: 0,
                                label: {
                                    // show: true,
                                    position: 'inside'

                                }
                            }
                        },
                        data: this.xData.length === 1 ? [] : this.xData
                    }
                ]
            }
            // eslint-disable-next-line no-undef
            this.myChart = echarts.init(this.$refs.myEcharts)
            if (this.$store.state.settings.themeSettings == 'star') {
                options.xAxis[0].axisLabel.textStyle = {
                    color: '#fff'
                }
                options.yAxis[0].axisLabel.textStyle = {
                    color: '#fff'
                }
            }

            this.myChart.setOption(options)
            this.myChart.dispatchAction({
                type: 'brush',
                areas: []
            })

            this.myChart.on('mouseover', () => {
                this.myChart.dispatchAction({
                    type: 'takeGlobalCursor',
                    // 如果想变为“可刷选状态”，必须设置。不设置则会关闭“可刷选状态”。
                    key: 'brush',
                    brushOption: {
                        // 参见 brush 组件的 brushType。如果设置为 false 则关闭“可刷选状态”。
                        brushType: 'lineX'
                        // 参见 brush 组件的 brushMode。如果不设置，则取 brush 组件的 brushMode 设置。
                        // brushMode: string
                    }
                })
            })

            this.myChart.on('brushEnd', (event) => {
                console.log('选取完毕', event)
                if (this.timer) return
                this.timer = setTimeout(() => {
                    if (event.areas?.[0]?.coordRange) {
                        let start = this.$moment(parseInt(event.areas[0].coordRange[0])).format('YYYY-MM-DD HH:mm:ss')
                        let end = this.$moment(parseInt(event.areas[0].coordRange[1])).format('YYYY-MM-DD HH:mm:ss')
                        console.log(start, end)
                        this.$parent.chartTimeRange = [start, end]
                        this.$parent.resetShow = true

                        setTimeout(() => {
                            this.$parent.get_data()
                            this.$parent.get_chart_data()
                        }, 300)
                    }
                    setTimeout(() => {
                        this.timer = null
                    }, 100)
                })
            })
            window.addEventListener('resize', this.myChart.resize)
        },
        clickChart() {
            let that = this
            if (!this.myChart) return
            this.myChart.on('click', params => {
                console.log(params)
                if (params.dataIndex == undefined) return
                let dataItem = that.chartData[params.dataIndex]
                console.log(dataItem)
                if (dataItem.startTime && dataItem.endTime) {
                    let start = this.$moment(dataItem.startTime).format('YYYY-MM-DD HH:mm:ss')
                    let end = this.$moment(dataItem.endTime).format('YYYY-MM-DD HH:mm:ss')
                    console.log(start, end)
                    this.$parent.chartTimeRange = [start, end]
                    this.$parent.resetShow = true
                    this.$parent.searchAssets()
                }
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
.no-data{
    width: 100%;
    height: 100%;
    position: absolute;
    left:0;
    top:0;
    color:#fff;
    font-size:14px;
    opacity: .4;
    letter-spacing: 2px;
}
.echarts ::v-deep .el-loading-mask{
    background-color:rgba(0,0,0,.5);
}
</style>
