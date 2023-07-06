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
        let theme = 'white-theme'
        let legendColor
        switch (theme) {
            case 'white-theme':
                legendColor = '#31444d'
                break
            default :
                legendColor = '#fff'
        }
        let that = this
        let data = this.chartData
        let colors = null
        if (theme === 'white-theme') {
            if (this.type == 1) {
                colors = ['#2a78ef', '#f57984', '#50cea4', '#f4a465', '#c559dd', '#39eae8', '#0024bd', '#afafaf']
            } else if (this.type == 2) {
                colors = ['#2a78ef', '#f57984', '#50cea4', '#f4a465', '#c559dd', '#39eae8', '#0024bd', '#afafaf']
            }
        }
        let option = {
            color: colors,
            grid: {
                left: '2%',
                right: '2%',
                top: '2%',
                bottom: '0',
                containLabel: true
            },
            legend: { // 图例组件，颜色和名字
                type: 'scroll',
                pageTextStyle: {
                    color: '#fff'
                },
                orient: 'vertical',
                show: true,
                // x: 'right',
                y: 'center',
                right: 0,
                icon: 'stack',
                itemWidth: 15,
                itemHeight: 5,
                textStyle: {
                    color: legendColor,
                    fontSize: 10
                },
                nameTextStyle: {
                    color: legendColor
                }
            },
            series: [{
                name: '',
                type: 'pie',
                legendHoverLink: true,
                clockwise: true, // 饼图的扇区是否是顺时针排布
                minAngle: 2, // 最小的扇区角度（0 ~ 360）
                center: ['30%', '50%'], // 饼图的中心（圆心）坐标
                radius: [80, 100], // 饼图的半径
                avoidLabelOverlap: false,
                label: {
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '24'
                        }
                    },
                    normal: {
                        show: false,
                        position: 'center',
                        formatter: '{text|{b}}\n{c}',
                        rich: {
                            text: {
                                color: legendColor,
                                fontSize: 12,
                                align: 'center',
                                verticalAlign: 'middle',
                                padding: 5
                            },
                            value: {
                                color: legendColor,
                                fontSize: 20,
                                align: 'center',
                                verticalAlign: 'middle'
                            }
                        }
                    }
                },
                data: data
            }]
        }

        // eslint-disable-next-line no-undef
        var myChart = echarts.init(this.$refs.myEcharts)
        myChart.setOption(option)
        window.addEventListener('resize', function() {
            myChart.resize()
        })

        // setTimeout(function() {
        //     myChart.dispatchAction({
        //         type: 'highlight',
        //         seriesIndex: 0,
        //         dataIndex: 0
        //     })

        //     myChart.on('mouseover', function(params) {
        //         // console.log(params)
        //         if (params.name == that.chartData[0].name) {
        //             myChart.dispatchAction({
        //                 type: 'highlight',
        //                 seriesIndex: 0,
        //                 dataIndex: 0
        //             })
        //         } else {
        //             myChart.dispatchAction({
        //                 type: 'downplay',
        //                 seriesIndex: 0,
        //                 dataIndex: 0
        //             })
        //         }
        //     })

        //     myChart.on('mouseout', function(params) {
        //         myChart.dispatchAction({
        //             type: 'highlight',
        //             seriesIndex: 0,
        //             dataIndex: 0
        //         })
        //     })
        // }, 1000)
    }
}
</script>

<style scoped lang="scss">
.echarts {
    width: 100%;
    height: 100%;
}
</style>
