<template>
    <div ref="myEcharts" class="echarts"></div>
</template>

<script>
export default {
    name: 'Pie',
    props: ['chartData', 'title', 'type'],
    data() {
        return {

        }
    },
    mounted() {
        let themeColors = ['#48c79c', '#266fe8', '#e3d43c', '#f2995f', '#f36d78']

        let that = this
        let data = this.chartData
        let option = {
            color: themeColors,
            grid: {
                left: '2%',
                right: '2%',
                top: '2%',
                containLabel: true
            },
            tooltip: {
                trigger: 'item',
                formatter: '{b} <br /> 事件量：{c}<br /> 占比：{d}%'
            },

            visualMap: {
                show: false,
                min: 500,
                max: 600,
                inRange: {
                    // colorLightness: [0, 1]
                }
            },
            series: [{
                name: '',
                type: 'pie',
                legendHoverLink: true,
                minAngle: 2,
                startAngle: 2,
                clockwise: true, // 饼图的扇区是否是顺时针排布
                radius: ['10%', '70%'],
                center: ['48%', '50%'],
                // roseType: 'radius',
                color: themeColors,
                label: {
                    normal: {
                        show: true,
                        position: 'outer',
                        alignTo: 'edge',
                        margin: '20%',
                        // formatter(v) {
                        //     let text = v.percent + '%' + '' + v.name
                        //     if (text.length <= 8) {
                        //         return text
                        //     } else if (text.length > 8) {
                        //         // eslint-disable-next-line no-return-assign
                        //         return text = `${text.slice(0, 8)}...`
                        //     }
                        // },
                        textStyle: {
                            fontSize: 11
                        },
                        avoidLabelOverlap: true,
                        rich: {
                            b: {
                                fontSize: 12,
                                align: 'left',
                                height: 40
                            }
                        }
                    }
                },
                labelLine: {
                    normal: {
                        // lineStyle: {
                        //     color: 'rgb(98,137,169)',
                        // },
                        // smooth: 0.2,
                        length: 20,
                        length2: 20

                    }
                },
                data: data
            }]
        }

        // eslint-disable-next-line no-undef
        var myChart = echarts.init(this.$refs.myEcharts)
        myChart.setOption(option)
        this.$resizeEcharts(this.$refs.myEcharts, myChart)
        window.addEventListener('resize', function() {
            myChart.resize()
        })
        setTimeout(function() {
            myChart.dispatchAction({
                type: 'highlight',
                seriesIndex: 0,
                dataIndex: 0
            })

            myChart.on('mouseover', function(params) {
                // console.log(params)
                if (params.name == that.chartData[0].name) {
                    myChart.dispatchAction({
                        type: 'highlight',
                        seriesIndex: 0,
                        dataIndex: 0
                    })
                } else {
                    myChart.dispatchAction({
                        type: 'downplay',
                        seriesIndex: 0,
                        dataIndex: 0
                    })
                }
            })

            myChart.on('mouseout', function(params) {
                myChart.dispatchAction({
                    type: 'highlight',
                    seriesIndex: 0,
                    dataIndex: 0
                })
            })
        }, 1000)
    }
}
</script>

<style scoped lang="scss">
.echarts {
    width: 100%;
    height: 100%;
}
</style>
