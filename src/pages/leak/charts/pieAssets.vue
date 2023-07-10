<template>
    <div ref="myEcharts" class="echarts"></div>
</template>

<script>
// import echarts from 'echarts';
export default {
    name: 'Pie',
    props: ['chartData', 'title', 'type'],
    data() {
        return {

        }
    },
    mounted() {
        let that = this
        let data = this.chartData
        let colors; let fontColor = ''

        if (this.$store.state.common.currentTheme === 'white-theme') {
            colors = ['#218de0', '#01cbb3', '#85e647', '#5d5cda', '#05c5b0', '#c29927']
            fontColor = '#3f4f57'
        } else {
            colors = ['#7efcfb', '#00c7ff', '#fdfe7f', '#fc7f00', '#fd0001', '#3aa6e4']
            fontColor = '#fff'
        }

        let option = {
            color: colors,
            grid: {
                left: '2%',
                right: '2%',
                top: '2%',
                containLabel: true
            },
            legend: { // 图例组件，颜色和名字
                type: 'scroll',
                pageTextStyle: {
                    color: '#fff'
                },
                show: false,
                x: 'center',
                y: 'bottom',
                icon: 'stack',
                itemWidth: 15,
                itemHeight: 5,
                textStyle: {
                    color: 'rgba(255,255,255,1)',
                    fontSize: 15
                },
                nameTextStyle: {
                    color: 'rgba(255,255,255,1)'
                }
            },
            series: [{
                name: '',
                type: 'pie',
                legendHoverLink: true,
                clockwise: true, // 饼图的扇区是否是顺时针排布
                minAngle: 2, // 最小的扇区角度（0 ~ 360）
                center: ['50%', '50%'], // 饼图的中心（圆心）坐标
                radius: [60, 80], // 饼图的半径
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center',
                        formatter: '{c}个\n{text|{b}}',
                        rich: {
                            text: {
                                color: fontColor,
                                fontSize: 16,
                                align: 'center',
                                verticalAlign: 'middle',
                                padding: 5
                            },
                            value: {
                                color: fontColor,
                                fontSize: 12,
                                align: 'center',
                                verticalAlign: 'middle'
                            }
                        }
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '26'
                        }
                    }
                },
                data: data
            }]
        }

        // eslint-disable-next-line no-undef
        var myChart = echarts.init(this.$refs.myEcharts)
        myChart.setOption(option)

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
