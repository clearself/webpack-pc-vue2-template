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
    name: 'Pie',
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
            let data = []; let legendData = []
            var colorArr = ['#0088d8', '#f5ed6b', '#f76801', '#6bfcfc', '#cb0000', '#FF00FF']
            var colorAlpha = ['rgba(60,170,211,0.05)', 'rgba(1,203,179,0.05)', 'rgba(133,230,71,0.05)', 'rgba(93,92,218,0.05)', 'rgba(5,197,176,0.05)', 'rgba(194,153,39,0.05)']
            let fontColor = ''
            // if (this.$store.state.common.currentTheme === 'white-theme') {
            data = this.chartData.map((item, index) => {
                let obj = {}
                obj.name = item.name
                obj.value = item.value
                legendData.push(item.name)
                return obj
            })
            fontColor = '#3f4f57'
            // } else {
            //     data = this.chartData.map((item, index) => {
            //         let obj = {}
            //         obj.name = item.name
            //         obj.value = item.value
            //         legendData.push(item.name)
            //         obj.itemStyle = {
            //             borderColor: colorArr[index],
            //             borderWidth: 2,
            //             shadowBlur: 20,
            //             shadowColor: colorArr[index],
            //             shadowOffsetx: 25,
            //             shadowOffsety: 20,
            //             color: colorAlpha[index]
            //         }
            //         return obj
            //     })
            //     fontColor = '#fff'
            // }
            let option = {
                color: colorArr,
                grid: {
                    left: '2%',
                    right: '2%',
                    top: '2%',
                    bottom: '0',
                    containLabel: true
                },
                legend: { // 图例组件，颜色和名字
                    data: legendData,
                    type: 'scroll',
                    pageTextStyle: {
                        color: '#999'
                    },
                    show: true,
                    orient: 'vertical',
                    right: '20px',
                    y: '30%',
                    icon: 'stack',
                    itemWidth: 15,
                    itemHeight: 5,
                    textStyle: {
                        color: '#999',
                        fontSize: 10
                    },
                    nameTextStyle: {
                        color: '#999'
                    }
                },
                tooltip: {
                    show: false,
                    trigger: 'item'
                },
                series: [{
                    name: '',
                    type: 'pie',
                    legendHoverLink: true,
                    clockwise: true, // 饼图的扇区是否是顺时针排布
                    startAngle: 2,
                    minAngle: 2, // 最小的扇区角度（0 ~ 360）
                    center: ['50%', '40%'], // 饼图的中心（圆心）坐标
                    radius: this.type == 1 ? [60, 80] : '50', // 饼图的半径
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center',
                        formatter(v) {
                            console.log(v)
                            let text = v.name + '\n\n' + v.value
                            return text
                        }
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 16,
                            color: fontColor
                        }
                    },

                    data: data

                }]
            }

            // eslint-disable-next-line no-undef
            this.myChart = echarts.init(this.$refs.myEcharts)
            this.myChart.setOption(option)

            setTimeout(function() {
                that.myChart.dispatchAction({
                    type: 'highlight',
                    seriesIndex: 0,
                    dataIndex: 0
                })

                that.myChart.on('mouseover', function(params) {
                // console.log(params)
                    if (params.name == that.chartData[0].name) {
                        that.myChart.dispatchAction({
                            type: 'highlight',
                            seriesIndex: 0,
                            dataIndex: 0
                        })
                    } else {
                        that.myChart.dispatchAction({
                            type: 'downplay',
                            seriesIndex: 0,
                            dataIndex: 0
                        })
                    }
                })

                that.myChart.on('mouseout', function(params) {
                    that.myChart.dispatchAction({
                        type: 'highlight',
                        seriesIndex: 0,
                        dataIndex: 0
                    })
                })
            }, 1000)
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
    color:#333;
    font-size:14px;
}
.echarts ::v-deep .el-loading-mask{
    background-color:rgba(0,0,0,.5);
}
</style>
