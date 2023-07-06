<template>
    <div ref="myEcharts" class="echarts" @click.stop></div>
</template>

<script>
import echarts from 'echarts'
import ChartTip from './chart_tip'
import { getOffset } from '@/assets/js/public_fun.js'
export default {
    name: 'Bar',
    props: ['chartData', 'title'],
    data() {
        return {}
    },
    mounted() {
        console.log(this.chartData, 'chartData')
        let vm = this
        var data = []
        var data2 = []
        let red = '#EE5C38'; let blue = '#387DEE'
        let maxarr = this.$deepCopy(this.chartData)
        maxarr = maxarr.sort((a, b) => b.num - a.num)
        let max = maxarr.length > 0 ? maxarr[0].num : 1000
        this.chartData.forEach((item) => {
            let num = Math.floor(Math.random() * 115)
            let num2 = Math.floor(Math.random() * 23 + 125)
            if (item.type == 1) { // 访问数据
                data.push({
                    alarmName: item.alarmName || '',
                    srcIp: item.srcIp || '',
                    srcPort: item.srcPort || '',
                    disIp: item.disIp || '',
                    disPort: item.disPort || '',
                    disResult: item.disResult || '',
                    num: item.num,
                    value: [item.isNormal ? num : num2, item.position_num],
                    type: item.type,
                    isNormal: item.isNormal,
                    id: item.id
                })
            } else { // 被访问数据
                data2.push({
                    alarmName: item.alarmName || '',
                    srcIp: item.srcIp || '',
                    srcPort: item.srcPort || '',
                    disIp: item.disIp || '',
                    disPort: item.disPort || '',
                    disResult: item.disResult || '',
                    num: item.num,
                    value: [item.isNormal ? num : num2, item.position_num],
                    type: item.type,
                    isNormal: item.isNormal,
                    id: item.id
                })
            }
        })
        let option = {
            legend: {
                data: ['访问', '被访问']
            },
            grid: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0
                // containLabel: true,
            },
            polar: {},
            tooltip: {
                trigger: 'item',
                axisPointer: {
                    type: 'cross'
                },
                padding: 0,
                position: 'top',
                formatter: function(params) {
                    let obj = params.data
                    var tipHtml = ''
                    let bgColor = obj.type == 1 ? blue : red
                    // let text = obj.type == 1 ? '访问次数' : '被访问次数'
                    if (obj.isNormal) {
                        tipHtml = `<div style="background-color:${bgColor};padding:5px;border-radius:3px;;font-size:12px;">
                                        <p style="color:#fff;text-align:center;">${obj.srcIp}</p>
                                        <p style="color:#fff;text-align:center;">${obj.num}次</p>
                                    </div>`
                    } else {
                        tipHtml = `<div style="background-color:#fff;padding:5px;border-radius:3px;box-shadow: 0px 0px 5px rgba(0,0,0,.3);font-size:12px;">
                                        <p style="color:#555;"><span style="color:#999;">告警名称：</span>${obj.alarmName}</p>
                                        <p style="color:#555;"><span style="color:#999;">源IP：</span>${obj.srcIp}</p>
                                        <p style="color:#555;"><span style="color:#999;">源端口：</span>${obj.srcPort}</p>
                                        <p style="color:#555;"><span style="color:#999;">目的IP：</span>${obj.disIp}</p>
                                        <p style="color:#555;"><span style="color:#999;">目的端口：</span>${obj.disPort}</p>
                                        <p style="color:#555;"><span style="color:#999;">处置结果：</span>${obj.disResult}</p>
                                    </div>`
                    }
                    // <p style="color:#555;"><span style="color:#999;">${text}：</span>${obj.value[1]}次</p>
                    return tipHtml
                }
            },
            angleAxis: {
                type: 'value',
                min: 0,
                max: max,
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#ABABAB'
                    }
                }
            },
            radiusAxis: {
                type: 'value',
                min: 0,
                max: 150,
                splitNumber: 5,
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: ['transparent', 'transparent', 'transparent', 'transparent', '#CCCCCC', 'transparent']
                    }
                },
                splitArea: {
                    show: true,
                    areaStyle: {
                        color: ['transparent', 'transparent', 'transparent', 'transparent', '#F3FAFF']
                    }

                }
            },
            series: [
                {
                    coordinateSystem: 'polar',
                    name: '访问',
                    symbolSize: 10,
                    itemStyle: {
                        normal: {
                            color: blue
                        }
                    },
                    label: {
                        normal: {
                            show: false,
                            // formatter: '{b}',
                            position: 'inside',
                            textStyle: {
                                color: '#fff',
                                fontSize: 15
                            }
                        }
                    },
                    type: 'scatter',
                    data: data
                },
                {
                    coordinateSystem: 'polar',
                    name: '被访问',
                    symbolSize: 10,
                    itemStyle: {
                        normal: {
                            color: red
                        }
                    },
                    label: {
                        normal: {
                            show: false,
                            formatter: '{b}',
                            position: 'inside',
                            textStyle: {
                                color: '#fff',
                                fontSize: 15
                            }
                        }
                    },
                    type: 'scatter',
                    data: data2
                }
            ]
        }
        // eslint-disable-next-line no-undef
        var myChart = echarts.init(this.$refs.myEcharts)
        myChart.setOption(option)
        window.addEventListener('resize', function() {
            myChart.resize()
        })
        window.addEventListener('click', function() {
            if (document.getElementsByClassName('echart-tip').length > 0) {
                let curNode = document.getElementsByClassName('echart-tip')[0]
                let parentNode = curNode.parentNode
                parentNode.parentNode && parentNode.parentNode.removeChild(parentNode)
            }
        })
        myChart.on('click', function(params) {
            if (params.data.isNormal) {
                if (document.getElementsByClassName('echart-tip').length > 0) {
                    let curNode = document.getElementsByClassName('echart-tip')[0]
                    let parentNode = curNode.parentNode
                    parentNode.parentNode && parentNode.parentNode.removeChild(parentNode)
                }
                return
            }
            if (document.getElementsByClassName('echart-tip').length > 0) {
                let curNode = document.getElementsByClassName('echart-tip')[0]
                let parentNode = curNode.parentNode
                parentNode.parentNode && parentNode.parentNode.removeChild(parentNode)
            }
            let offsetTop = document.querySelector('#drawer-content').scrollTop
            let x = getOffset(vm.$refs.myEcharts).left
            let y = getOffset(vm.$refs.myEcharts).top
            let offsetX = params.event.offsetX
            let offsetY = params.event.offsetY
            let left = x + offsetX + 20
            let top = y + offsetY - 25 - offsetTop
            let bgColor = params.data.type == 1 ? blue : red
            vm.$openDialog(ChartTip)({
                styleObj: { top: top + 'px', left: left + 'px', backgroundColor: bgColor },
                curData: params.data
            }, vm)
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
