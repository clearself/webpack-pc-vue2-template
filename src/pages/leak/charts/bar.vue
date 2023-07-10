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
    name: 'Bar',
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
    mounted() {

    },
    methods: {
        init() {
            let that = this
            let data = this.chartData
            let fontColor = ''; let axisLineColor = ''; let splitLineColor = ''
            fontColor = '#3f4f57'
            axisLineColor = '#cbcfd2'
            splitLineColor = '#cbcfd2'
            let xData = []; let yData = []
            data.forEach(item => {
                xData.push(item.name)
                yData.push(item.value)
            })
            let option = {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: [this.name],
                    show: true,
                    x: 'right',
                    y: '5px',
                    icon: 'stack',
                    itemWidth: 15,
                    itemHeight: 5,
                    textStyle: {
                        color: fontColor,
                        fontSize: 10
                    },
                    nameTextStyle: {
                        color: fontColor
                    }
                },
                grid: {
                    left: '2%',
                    right: '2%',
                    top: '14%',
                    bottom: '0',
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
                            color: axisLineColor
                        }
                    },
                    axisLabel: {
                        formatter: '{value}',
                        color: fontColor,
                        fontSize: 10,
                        rotate: 30
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
                        fontSize: 12
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: splitLineColor,
                            type: 'dashed'
                        }
                    }
                },
                series: [{
                    name: this.name,
                    type: 'bar',
                    barWidth: '10',
                    barMinHeight: '5',
                    data: yData,
                    itemStyle: {
                        normal: {
                            color: this.type == 1 ? '#266fe8' : '#ffc835',
                            barBorderRadius: 3
                        }
                    }
                }]
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
