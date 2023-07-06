<template>
    <div style="width: 100%;height: 100%;" ref="myEcharts"></div>
</template>

<script>
// import echarts from 'echarts/index';
export default {
    name: 'AttackArea',
    props: ['chartData', 'title', 'type'],
    data() {
        return {
        }
    },
    mounted() {
        let data = this.chartData
        let dataX = data.map(item => item.name)
        let dataY = data.map(item => item.value)
        let colorList = ['#6cf3f7', '#44dbf6', '#56b9f5', '#228ffd', '#0c51d7', '#0f2ed5', '#1900ae', '#001bae', '#ffffff']
        let option = {
            color: colorList,
            tooltip: {
                trigger: 'item',
                textStyle: {
                    fontSize: 12
                },
                formatter(params) {
                    // console.log(params)
                    let color = params.color
                    var htmlStr = '<div>'
                    // 实现了一个点的效果
                    htmlStr += '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;background-color:' + color + ';"></span>'
                    htmlStr += params.name + '<br />'
                    // 这里可以自定义文本内容
                    htmlStr += `<span style="color:${color};">${params.value * 100}%</span>`
                    htmlStr += '</div>'
                    return htmlStr
                }
            },
            grid: {
                left: 0,
                right: 15,
                top: 15,
                bottom: 0,
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: dataX,
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'dashed',
                        color: 'rgba(255,255,255,0.3)'
                    }
                },
                axisLabel: {
                    interval: 0,
                    rotate: 40,
                    textStyle: {
                        color: '#fff',
                        fontSize: 11
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: 'rgba(255,255,255,0.3)', // 颜色
                        width: 1 // 粗细
                    }
                },
                max: '10%'
            },
            yAxis: {
                show: false,
                splitLine: {
                    lineStyle: {
                        type: 'dashed'
                    }
                },
                scale: true
            },
            series: [{
                name: '1990',
                data: dataY,
                type: 'scatter',
                symbolSize: (dataY) => {
                    // return data;
                    return Math.sqrt(dataY) * 60 // 气泡图的大小，要根据情况调整了
                },
                label: {
                    show: true,
                    position: 'inside',
                    formatter: (param) => {
                        console.log('paramparam', param)
                        return param.data * 100 + '%'
                    }
                },
                itemStyle: {
                    color: (params) => {
                        // console.log(params)
                        return colorList[params.dataIndex]
                    },
                    width: '10px'
                    // shadowBlur: 10,
                    // shadowColor: 'rgba(120, 36, 50, 0.5)',
                    // shadowOffsetY: 5
                },
                emphasis: {
                    label: {
                        show: true,
                        formatter: (param) => {
                            console.log('paramparam', param)
                            return param.data * 100 + '%'
                        },
                        position: 'inside'
                    }
                }
            }]
        }
        // eslint-disable-next-line no-undef
        let myChart = echarts.init(this.$refs.myEcharts)
        myChart.setOption(option)
    }
}
</script>

<style scoped>

</style>
