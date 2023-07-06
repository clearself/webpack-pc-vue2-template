<template>
    <div ref="myEcharts" class="echarts"></div>
</template>

<script>
export default {
    name: 'BarMut',
    props: ['chartData', 'title', 'type'],
    data() {
        return {

        }
    },
    mounted() {
        let that = this
        let data = this.chartData
        console.log(data)
        var fontColor = 'rgba(255,255,255,1)'
        let lendData = data[0].x.length > 0 ? ['提交总数', '审核通过数'] : []
        let option = {
            // color: ["#ed9d3c", '#4fd7fd'],
            tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter(params) {
                    // console.log(params)
                    let color = params.color
                    var htmlStr = '<div>'
                    // 实现了一个点的效果
                    htmlStr += '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;background-color:#fff' + ';"></span>'
                    htmlStr += '提交总量：' + params[0].value + '<br />'
                    // 这里可以自定义文本内容
                    htmlStr += '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;background-color:darkmagenta' + ';"></span>'
                    htmlStr += `<span style="color:;"> 审核通过量：${params[1].value}</span>`
                    htmlStr += '</div>'
                    return htmlStr
                }
            },
            legend: {
                show: true,
                x: 'right',
                y: 'top',
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

                selectedMode: false, // 取消图例上的点击事件
                data: lendData

            },
            grid: {
                left: '2%',
                right: '2%',
                top: '15%',
                bottom: '2%',
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                data: data[0].x,
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: 'rgba(255,255,255,0.05)',
                        type: 'dashed'
                    }
                },
                axisLabel: {
                    formatter: function(value, index) {
                        return value.split(',')[0]
                    },
                    color: fontColor,
                    fontSize: 12,
                    rotate: 10
                },
                splitLine: {
                    show: false
                }
            }],
            yAxis: [{
                type: 'value',
                minInterval: 1,
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: 'rgba(255,255,255,0.05)'
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
                        color: 'rgba(255,255,255,0.05)',
                        type: 'dashed'
                    }
                }
            }],
            series: [{
                name: lendData[0],
                type: 'bar',
                stack: '排名',
                data: data[0].y1,
                barWidth: 8,
                itemStyle: {
                    normal: {
                        color: '#4fd7fd'
                    }
                }
            },
            {
                name: lendData[1],
                type: 'bar',
                stack: '排名',
                data: data[0].y2,
                barWidth: 8,
                itemStyle: {
                    normal: {
                        color: '#1c96e9'
                    }
                }
            }
            ]
        }
        // eslint-disable-next-line no-undef
        var myChart = echarts.init(this.$refs.myEcharts)
        myChart.setOption(option, true)
        myChart.on('click', (params) => {
            this.$emit('click', params)
        })
    }
}
</script>

<style scoped>
    .echarts {
        width: 100%;
        height: 100%;
    }
</style>
