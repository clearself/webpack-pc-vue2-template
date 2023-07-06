<template>
    <div ref="myEcharts" class="echarts"></div>
</template>

<script>
export default {
    name: 'Pie',
    props: ['chartData', 'title'],
    data() {
        return {

        }
    },
    mounted() {
        let that = this
        let data = this.chartData
        let colors = ['#3082f5', '#f78690', '#5bd5ac', '#f6b06e', '#ce65e6', '#41eceb']
        data.forEach((item, index) => {
            item.itemStyle = {
                borderColor: colors[index],
                borderWidth: 1
            }
        })
        let option = {
            color: colors,
            grid: {
                left: '2%',
                right: '2%',
                top: '0',
                containLabel: true
            },
            legend: { // 图例组件，颜色和名字
                type: 'scroll',
                show: true,
                // x: '2%',
                right: '2%',
                top: '0',
                // y: 'top',
                // icon: 'circle',
                itemWidth: 14,
                itemHeight: 4,
                textStyle: {
                    color: 'rgba(0,0,0,1)',
                    fontSize: 10
                },
                nameTextStyle: {
                    color: 'rgba(0,0,0,1)'
                }
            },
            tooltip: {
                trigger: 'item'
            },
            series: [{
                name: '',
                type: 'pie',
                // legendHoverLink: true,
                // clockwise: true, // 饼图的扇区是否是顺时针排布
                // minAngle: 2, // 最小的扇区角度（0 ~ 360）
                center: ['50%', '60%'], // 饼图的中心（圆心）坐标
                radius: [30, 80], // 饼图的半径
                roseType: 'area',
                itemStyle: {
                    borderRadius: 8
                },
                labelLine: {
                    show: false // 隐藏指示线
                },
                label: {
                    show: false // 隐藏标示文字
                },
                // avoidLabelOverlap: false,
                // label: {
                //     normal: {
                //         show: false,
                //         position: 'center',
                //         formatter: '{text|{b}}\n{c}个',
                //         rich: {
                //             text: {
                //                 color: '#fff',
                //                 fontSize: 14,
                //                 align: 'center',
                //                 verticalAlign: 'middle',
                //                 padding: 5
                //             },
                //             value: {
                //                 color: '#fff',
                //                 fontSize: 34,
                //                 align: 'center',
                //                 verticalAlign: 'middle'
                //             }
                //         }
                //     },
                //     emphasis: {
                //         show: true,
                //         textStyle: {
                //             fontSize: '26'
                //         }
                //     }
                // },
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
                console.log(params)
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
        window.addEventListener('resize', function() {
            myChart.resize()
        })
    }
}
</script>

<style scoped lang="scss">
    .echarts {
        width: 100%;
        height: 100%;
    }
</style>
