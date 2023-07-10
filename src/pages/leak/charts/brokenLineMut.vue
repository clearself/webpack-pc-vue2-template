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
    name: 'BrokenLineMut',
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
            let backgroundColor = ''; let legendColor = ''; let fontColor = ''; let axisLineColor = ''; let splitLineColor = ''; let colors = []
            legendColor = '#3f4f57'
            backgroundColor = 'rgba(0,0,0,0)'
            fontColor = '#3f4f57'
            axisLineColor = '#cbcfd2'
            splitLineColor = '#cbcfd2'
            colors = ['#e980ff', '#4a9d07', '#00b6f1', '#f69c00', '#10f6ff']
            let data = this.chartData
            console.log('结果', data)
            if (data) {

            }
            let xData = []
            let legendData = []
            let series = []
            data.forEach((item, index) => {
                xData.push(item.month)
            })
            if (data.length > 0) {
                data[0].values.forEach((item, index) => {
                    let names = []
                    let list = []
                    data.forEach((_item, _index) => {
                        list.push(_item.values[index].num)
                    })
                    legendData.push(item.name)
                    let obj = {
                        name: item.name,
                        type: 'line',
                        smooth: false, // true 为平滑曲线，false为直线
                        itemStyle: {
                            normal: {
                                color: colors[index],
                                lineStyle: {
                                    color: colors[index],
                                    width: 1
                                }
                            }
                        },
                        data: list
                    }
                    series.push(obj)
                })
            }

            let option = {
                backgroundColor: backgroundColor,
                grid: {
                    left: '2%',
                    right: '2%',
                    top: '14%',
                    bottom: '10px',
                    containLabel: true
                },
                tooltip: {
                    show: true,
                    trigger: 'item'
                },
                legend: { // 图例组件，颜色和名字
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
                    data: legendData
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
                            type: 'dashed'
                        }
                    }
                }],
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
