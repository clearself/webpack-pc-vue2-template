<template>
    <div style="width: 100%;height: 100%;" ref="myEcharts"></div>
</template>

<script>
import echarts from 'echarts/index'
export default {
    name: 'LevelPie',
    props: ['chartData', 'title', 'type'],
    data() {
        return {
        }
    },
    mounted() {
        let data = this.chartData
        console.log('8888888888888888888888', data)
        let option = {
            color: ['#7efcfb', '#00c7ff', '#fdfe7f', '#fc7f00', '#fd0001', '#5ec0ff', '#00ccff'],
            grid: {
                left: '2%',
                right: '2%',
                bottom: '0',
                containLabel: true
            },
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
                    htmlStr += `<span style="color:${color};">${params.value} 次</span>`
                    htmlStr += '</div>'
                    return htmlStr
                }
            },
            legend: {
                type: 'scroll',
                pageTextStyle: {
                    color: '#fff'
                },
                show: true,
                orient: 'vertical',
                top: 'center',
                left: 0,
                icon: 'circle',
                itemWidth: 8,
                itemHeight: 8,
                itemGap: 12,
                textStyle: {
                    color: '#fff',
                    lineHeight: 11
                }
            },
            series: [{
                name: '',
                type: 'pie',
                radius: ['30%', '70%'],
                roseType: 'radius',
                left: '30%',
                top: '10%',
                width: '70%',
                label: {
                    formatter: '{d}%'
                },
                labelLine: {
                    show: true,
                    smooth: false,
                    length2: 0,
                    lineStyle: {
                        type: 'dotted'
                    }
                },
                data: data.sort(function(b, a) { return a.value - b.value })
            }]
        }
        let myindex = 0
        let recordId
        let myChart = echarts.init(this.$refs.myEcharts)
        myChart.setOption(option)
        // 定时器
        function DrawPieArea(curIndex) {
            if (curIndex == null) {
                myChart.dispatchAction({ type: 'highlight', seriesIndex: 0, dataIndex: 0 })
            } else {
                myChart.dispatchAction({ type: 'highlight', seriesIndex: 0, dataIndex: curIndex }) // 高亮
                myChart.dispatchAction({ type: 'showTip', seriesIndex: 0, dataIndex: curIndex }) // 显示
                recordId = setInterval(function() {
                    let dataLen = data.length
                    myChart.dispatchAction({ type: 'downplay', seriesIndex: 0, dataIndex: curIndex })
                    myChart.dispatchAction({ type: 'hidTip', seriesIndex: 0, dataIndex: curIndex })
                    curIndex = (curIndex + 1) % dataLen
                    myChart.dispatchAction({ type: 'highlight', seriesIndex: 0, dataIndex: curIndex })
                    myChart.dispatchAction({ type: 'showTip', seriesIndex: 0, dataIndex: curIndex })
                }, 3000)
            }
        }

        DrawPieArea(myindex)
        // 鼠标呼入清定时器
        myChart.on('mouseover', function(params) {
            clearInterval(recordId)
            for (let i in data) {
                if (Number(i) != params.dataIndex) {
                    myChart.dispatchAction({ type: 'downplay', seriesIndex: 0, dataIndex: Number(i) })
                    myChart.dispatchAction({ type: 'hideTip', seriesIndex: 0, dataIndex: Number(i) })
                }
            }
        })

        myChart.on('mouseout', function(params) {
            // console.log(params)
            for (let i in data) {
                myChart.dispatchAction({ type: 'downplay', seriesIndex: 0, dataIndex: Number(i) })
                myChart.dispatchAction({ type: 'hideTip', seriesIndex: 0, dataIndex: Number(i) })
            }
            myindex = params.dataIndex
            DrawPieArea(myindex)
        })
    }
}
</script>

<style scoped>

</style>
