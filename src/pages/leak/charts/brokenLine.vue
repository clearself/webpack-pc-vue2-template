<template>
    <div style="width:100%;height:100%;position: relative;">
        <div class="ub ub-ac ub-pc no-data" v-if="isData">暂无数据</div>
        <div ref="myEcharts" class="echarts" v-loading="loading">

        </div>
    </div>
</template>

<script>
// import echarts from 'echarts';
export default {
    name: 'BrokenLine',
    props: ['chartData', 'title', 'type', 'name', 'isData'],
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
            let backgroundColor = ''; let legendColor = ''; let lineColor = ''; let fontColor = ''; let axisLineColor = ''; let splitLineColor = ''
            lineColor = '#1e88e5'
            legendColor = '#3f4f57'
            backgroundColor = 'rgba(0,0,0,0)'
            fontColor = '#3f4f57'
            axisLineColor = '#cbcfd2'
            splitLineColor = '#cbcfd2'
            let data = this.chartData
            let xData = []
            let yData = []
            data.forEach(item => {
                xData.push(item.name)
                yData.push(item.value)
            })
            let option = {
                backgroundColor: backgroundColor,
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
                        color: legendColor,
                        fontSize: 15
                    },
                    nameTextStyle: {
                        color: legendColor
                    }
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
                            color: axisLineColor
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: splitLineColor
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
                        formatter: '{value}',
                        textStyle: {
                            color: fontColor,
                            fontSize: 10
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: axisLineColor
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: splitLineColor,
                            type: 'ddashed'
                        }
                    }
                }],
                series: [{
                    type: 'line',
                    smooth: true, // true 为平滑曲线，false为直线
                    // smooth:true,  //这个是把线变成曲线
                    symbolSize: 8,
                    itemStyle: {
                        normal: {
                            color: '#1da4f4',
                            lineStyle: {
                                color: lineColor,
                                width: 2
                            },
                            shadowBlur: 2,
                            areaStyle: {
                                // eslint-disable-next-line no-undef
                                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                                    offset: 0,
                                    color: 'rgba(29,164,244,0)'
                                }, {
                                    offset: 1,
                                    color: 'rgba(29,164,244,.5)'
                                }])
                            }
                        }
                    },
                    data: yData
                }
                ]
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
