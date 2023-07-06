<template>
    <div ref="myEcharts" class="echarts"></div>
</template>

<script>
export default {
    name: 'TableLine',
    props: ['dataX', 'dataY', 'list'],
    data() {
        return {

        }
    },
    mounted() {
        let itemColor = '#0052d9'
        let maxVal = 0
        let arr = []
        if (this.list.length > 0) {
            this.list.forEach(item => {
                arr = arr.concat(item.dataY)
            })
            maxVal = arr.sort((a, b) => a - b)[arr.length - 1]
        }
        let option = {

            /* legend: {
                bottom: 10,
                left: 'center',
                data: ['香料香精']
            },*/
            tooltip: {
                show: false
                /* trigger: 'item',
                position: 'left'*/
                /* axisPointer: {
                    type: 'cross'
                }*/
            },

            xAxis: [{
                /* gridIndex: 0,
                show: true,*/
                type: 'category',
                boundaryGap: false,
                data: this.dataX,
                axisLabel: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                axisLine: {
                    show: false
                }
            }

            ],
            yAxis: [{
                max: maxVal,
                gridIndex: 0,
                axisLabel: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                name: ''

            }
            ],
            grid: [
                {
                    bottom: '8%',
                    left: '2%',
                    height: '80%'
                }
            ],
            series: [{
                type: 'line',
                data: this.dataY,
                smooth: true,
                symbol: 'none',
                areaStyle: {
                    // eslint-disable-next-line no-undef
                    color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                        offset: 1,
                        color: '#d5e5fa'
                    }, {
                        offset: 0,
                        color: 'rgba(0,82,217,.2)'
                    }])
                },
                itemStyle: {
                    normal: {
                        color: itemColor,
                        lineStyle: {
                            color: itemColor,
                            width: 1
                        }
                    }
                }
            }
            ]
        }

        // eslint-disable-next-line no-undef
        var myChart = echarts.init(this.$refs.myEcharts)
        myChart.setOption(option)
    }
}
</script>

<style scoped lang="scss">
.echarts {
    width: 100%;
    height: 100%;
}
</style>
