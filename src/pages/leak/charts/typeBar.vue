<template>
    <div style="width:100%;height:100%;position: relative;">
        <div class="ub ub-ac ub-pc no-data" v-if="isData">暂无数据</div>
        <div ref="myEcharts" class="echarts" v-loading="loading">

        </div>
    </div>
</template>

<script>
// import echarts from 'echarts/index';
export default {
    name: 'TypeBar',
    props: ['chartData', 'title', 'type', 'isData'],
    data() {
        return {
            myChart: null,
            loading: true
        }
    },
    watch: {
        chartData: {
            deep: true, // 深度监听
            handler(newVal, oldVal) {
                if (newVal.length > 0) {
                    this.loading = false
                } else {
                    this.loading = true
                }
                this.init()
            }
        },
        isData: {
            deep: true, // 深度监听
            handler(newVal, oldVal) {
                if (newVal) {
                    this.loading = false
                }
            }
        }
    },
    methods: {
        init() {
            let that = this
            let backgroundColor = ''; let legendColor = ''; let fontColor = ''; let axisLineColor = ''; let splitLineColor = ''; let colors = []
            legendColor = '#3f4f57'
            backgroundColor = '#fff'
            fontColor = '#3f4f57'
            axisLineColor = '#cbcfd2'
            splitLineColor = '#cbcfd2'
            colors = ['#0088d8', '#f5ed6b', '#f76801', '#6bfcfc', '#cb0000', '#FF00FF', '#1E90FF', '#00FF7F']
            let data = this.chartData
            console.log('结果', data)
            let xData = []
            let series = []
            data.forEach((item, index) => {
                if (this.type == 1) {
                    xData.push(item.name)
                } else {
                    xData.push(item.systemName)
                }
            })
            let legendData = []
            if (data.length > 0) {
                data[0].levels.forEach((item, index) => {
                    let names = []
                    let list = []
                    data.forEach((_item, _index) => {
                        list.push(_item.levels[index].num)
                    })
                    legendData.push(item.name)
                    let obj = {
                        name: item.name,
                        type: 'bar',
                        barWidth: '10',
                        stack: '总数',
                        barMinHeight: '2',
                        data: list,
                        itemStyle: {
                            normal: {
                                // eslint-disable-next-line no-undef
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: colors[index]
                                }, {
                                    offset: 1,
                                    color: colors[index]
                                }]),
                                opacity: 1
                            }
                        }
                    }
                    series.push(obj)
                })
            }
            let option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    data: legendData,
                    type: 'scroll',
                    pageTextStyle: {
                        color: '#fff'
                    },
                    show: true,
                    x: 'right',
                    y: 'top',
                    icon: 'stack',
                    itemWidth: 15,
                    itemHeight: 5,
                    textStyle: {
                        color: legendColor,
                        fontSize: 10
                    },
                    nameTextStyle: {
                        color: legendColor
                    },
                    // eslint-disable-next-line no-dupe-keys
                    data: legendData
                },
                grid: {
                    left: '2%',
                    right: '2%',
                    top: '14%',
                    bottom: this.type == 1 ? '10px' : '0',
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
                            color: axisLineColor,
                            type: 'dashed'
                        }
                    },
                    axisLabel: {
                        formatter: '{value}',
                        color: fontColor,
                        fontSize: 10,
                        rotate: this.type == 1 ? 0 : 20,
                        interval: 0
                    },
                    splitLine: {
                        show: false
                    }
                }],
                yAxis: {
                    type: 'value',
                    minInterval: 1,
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: axisLineColor
                        }
                    },
                    axisLabel: {
                        formatter: '{value}',
                        color: fontColor,
                        fontSize: 10
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: splitLineColor,
                            type: 'dashed'
                        }
                    }
                },
                series: series
            }
            // eslint-disable-next-line no-undef
            this.myChart = echarts.init(this.$refs.myEcharts)
            this.myChart.setOption(option)
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
}
.echarts ::v-deep .el-loading-mask{
    background-color:rgba(0,0,0,.5);
}
</style>
