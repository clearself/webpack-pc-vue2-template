<template>
    <div ref="myEcharts" class="echarts"></div>
</template>

<script>
// import white_line from '../../../mixins/whiteCharts'
export default {
    name: 'Bar',
    // mixins: [white_line],
    props: ['chartData', 'title'],
    data() {
        return {

        }
    },
    mounted() {
        let that = this
        var fontColor = 'rgba(0,0,0,0.9)'
        let arr = []
        let series = []
        let legendData = []
        this.chartData.forEach((item, index) => {
            arr.push(item.name)
        })
        this.chartData[0].val.forEach((item, index) => {
            let names = []
            let list = []
            this.chartData.forEach((_item, _index) => {
                list.push(_item.val[index].num)
            })
            legendData.push(item.fromCN)

            let obj = {
                name: item.fromCN,
                type: 'bar',
                stack: 'Tik Tok',
                barWidth: 14,
                symbolSize: 8,
                data: list
            }
            series.push(obj)
        })
        console.log(legendData)
        let option = {
            tooltip: {
                trigger: 'axis',
                formatter: function(params) {
                    console.log('params', params)
                    let str = params[0].name + '<br />'
                    params.forEach((item) => {
                        // str += '<div style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;background:linear-gradient(-90deg,' + item.color.colorStops[0].color + ',' + item.color.colorStops[1].color + ')"></div>' + item.seriesName + ' : ' + item.value + '<br />'
                        str += '<div style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;background:' + item.color + '"></div>' + item.seriesName + ' : ' + item.value + '<br />'
                    })
                    return str
                },
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                show: true,
                // left: '2%',
                right: '2%',
                top: '0',
                // icon: 'circle',
                itemWidth: 14,
                itemHeight: 4,
                textStyle: {
                    color: 'rgba(0,0,0,1)',
                    fontSize: 10
                },
                nameTextStyle: {
                    color: 'rgba(0,0,0,1)'
                },
                data: legendData
            },
            grid: {
                left: '3%',
                top: '10%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            yAxis: {
                type: 'value',
                minInterval: 1,
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#e7e7e7'
                    }
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisLabel: {
                    color: 'rgba(0,0,0,1)'
                }
            },
            xAxis: {
                type: 'category',
                data: arr,
                axisLine: {
                    lineStyle: {
                        color: '#e7e7e7'
                    }
                },
                splitLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    // margin: 10,
                    color: 'rgba(0,0,0,1)'
                }
            },
            series: series
        }
        option.color = [
            // new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
            //     offset: 0,
            //     color: '#1589eb'
            // },
            // {
            //     offset: 1,
            //     color: 'rgba(76,145,203,0)'
            // }
            // ]),
            // new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
            //     offset: 0,
            //     color: '#03b0aa'
            // },
            // {
            //     offset: 1,
            //     color: 'rgba(160,237,234,0)'
            // }
            // ]),
            '#5bd5ac', '#f6b06e'
        ]
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
