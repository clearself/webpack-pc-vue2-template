<template>
    <div ref="myEcharts" class="echarts"></div>
</template>

<script>
export default {
    name: 'Lnie',
    props: ['chartData', 'title', 'type'],
    data() {
        return {

        }
    },
    mounted() {
        var fontColor = '#30eee9'
        var xdata = [] // x轴
        var dataArr = []
        var dataName = []
        console.log('this.chartData', this.chartData)

        this.chartData.date.forEach(item => {
            xdata.push(item)
        })
        this.chartData.data.forEach(item => {
            dataArr.push(item)
            dataName.push(item.name)
        })
        let option = {
            title: {
            // text: '事件时间分析',
                top: '5%',
                left: 'center',
                textStyle: {
                    color: '#FFF'
                }
            },
            legend: { // 图例组件，颜色和名字
                type: 'scroll',
                pageTextStyle: {
                    color: '#fff'
                },
                show: true,
                x: 'center',
                y: 'bottom',
                icon: 'stack',
                itemWidth: 15,
                itemHeight: 5,
                textStyle: {
                    color: 'rgba(255,255,255,1)',
                    fontSize: 10
                },
                nameTextStyle: {
                    color: 'rgba(255,255,255,1)'
                },
                data: dataName
            },
            grid: {
                left: '5%',
                right: '2%',
                bottom: '12%',
                top: '6%',
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                gridIndex: 0,
                data: xdata,
                axisTick: {
                    alignWithLabel: true
                },
                axisLine: {
                    lineStyle: {
                        color: '#dff6fc' // 'rgb(170,170,170)'
                    }
                },
                axisLabel: {
                    show: true,
                    color: '#a9b8bd', // x轴文字颜色
                    fontSize: 10
                // rotate: 20,
                }
            }],
            tooltip: {
                trigger: 'axis'
            },
            yAxis: {
                type: 'value',
                minInterval: 1,
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: 'rgba(255,255,255,.3)'
                    }
                },
                axisLabel: {
                    fontSize: 10,
                    color: '#a9b8bd'
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: '#dff6fc'
                    }
                }
            },
            series: dataArr
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
