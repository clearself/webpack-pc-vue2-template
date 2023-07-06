<template>
    <div ref="myEcharts" class="echarts"></div>
</template>

<script>
// import white_line from '../../../mixins/whiteCharts'
import { mapGetters } from 'vuex'
export default {
    name: 'BrokenLineMut',
    // mixins: [white_line],
    props: ['chartData', 'title', 'type'],
    computed: {
        ...mapGetters(['themeSettings'])
    },
    data() {
        return {

        }
    },
    mounted() {
        let colors = null
        var fontColor = 'rgba(255,255,255,0.5)'
        let data = this.chartData
        let lendcolor = ''
        if (this.themeSettings === 'star') {
            lendcolor = '#fff'
        } else {
            lendcolor = '#333'
        }
        console.log('趋势', data)
        let xData = []
        let legendData = []
        let series = []
        colors = ['#266fe8', '#5bd5ac', '#f6b06e']
        data.forEach((item, index) => {
            xData.push(item.day)
        })

        data[0].from.forEach((item, index) => {
            let names = []
            let list = []
            data.forEach((_item, _index) => {
                list.push(_item.from[index].num)
            })
            legendData.push(item.fromCN)
            let obj = {
                name: item.fromCN,
                type: 'line',
                smooth: true, // true 为平滑曲线，false为直线
                symbolSize: 6,
                itemStyle: {
                    normal: {
                        color: colors[index],
                        lineStyle: {
                            color: colors[index],
                            width: 2
                        },
                        borderWidth: 2// 拐点边框大小
                    }
                },
                data: list
            }

            obj.areaStyle = {
                normal: {
                    // eslint-disable-next-line no-undef
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: colors[index]
                    }, {
                        offset: 1,
                        color: 'rgba(38,197,254,0)'
                    }]),
                    opacity: 0.2
                }
            }

            series.push(obj)
        })

        let option = {
            backgroundColor: 'rgba(0,0,0,0)',
            grid: {
                left: '2%',
                right: '3%',
                top: '10%',
                bottom: '5%',
                containLabel: true
            },
            tooltip: {
                show: true,
                trigger: 'axis',
                formatter: function(params) {
                    let str = params[0].name + '<br />'
                    params.forEach((item) => {
                        str +=
                        '<div style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;background-color:' + item.color + '"></div>' + item.seriesName + ' : ' + item.value + '<br />'
                    })
                    return str
                }
            },
            legend: {
                show: true,
                // x: '1%',
                // y: 'top',
                top: '0',
                right: '2%',
                icon: 'rect',
                itemWidth: 14,
                itemHeight: 4,
                textStyle: {
                    color: 'lendcolor',
                    fontSize: 10
                },
                nameTextStyle: {
                    color: 'lendcolor'
                },
                data: legendData
            },
            xAxis: [{
                type: 'category',
                boundaryGap: false,
                axisLabel: {
                    color: 'rgba(0,0,0,1)',
                    fontSize: 10
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: 'rgba(0,0,0,0.1)'
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false,
                    lineStyle: {
                        color: 'rgba(0,0,0,0.1)'
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
                        color: 'rgba(0,0,0,1)',
                        fontSize: 10
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: 'rgba(0,0,0,0.1)'
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: 'rgba(0,0,0,0.1)'
                    }
                }
            }],
            series: series
        }
        // eslint-disable-next-line no-undef
        var myChart = echarts.init(this.$refs.myEcharts)
        myChart.setOption(option)
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
