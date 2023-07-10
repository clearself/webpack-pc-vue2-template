<template>
    <div ref="myEcharts" class="echarts"></div>
</template>

<script>
import echarts from 'echarts/index'
import geoCoordMap from './coord_map.json'
import 'echarts/map/js/china'
export default {
    name: 'ChinaMap',
    props: ['chartData', 'title', 'type'],
    data() {
        return {

        }
    },
    mounted() {
        let that = this
        console.log('this.chartData', this.chartData)
        let colors = ['red', 'green', 'yellow', '#C71585', '#C71585', '#FF00FF', '#1E90FF', '#00FF7F']
        let theme = this.$store.state.common.currentTheme
        let fontColor = ''

        switch (theme) {
            case 'white-theme':
                fontColor = '#000'
                break
            default :
                fontColor = 'rgba(255,255,255,0.5)'
        }
        let data = this.chartData
        let total = this.chartData.reduce((_total, current) => {
            // eslint-disable-next-line no-return-assign
            return _total = _total + current.value
        }, 0)
        let present20 = this.$accMul(total, 0.2)
        let present15 = this.$accMul(total, 0.15)
        let present10 = this.$accMul(total, 0.1)
        let present5 = this.$accMul(total, 0.05)
        console.log('total', total)
        console.log('present20', present20)
        console.log('present15', present15)
        console.log('present10', present10)
        console.log('present5', present5)

        let roundSize = 2
        if (total < 5) {
            roundSize = 1
        } else if (total < 100 && total > 50) {
            roundSize = 10
        } else if (total >= 100) {
            roundSize = 20
        }
        var mapName = 'china'
        var convertData = function(data) {
            var res = []
            for (var i = 0; i < data.length; i++) {
                for (let attr in geoCoordMap) {
                    if (data[i].name.indexOf(attr) > -1) {
                        res.push({
                            name: attr,
                            value: geoCoordMap[attr].concat(data[i].value)
                        })
                    }
                }
            }
            return res
        }
        let option = {
            tooltip: {
                padding: 10,
                // enterable: true,
                transitionDuration: 1,
                textStyle: {
                    color: '#fff',
                    decoration: 'none'
                }

            },
            visualMap: { // 左边的图标
                min: 0,
                type: 'piecewise',
                left: '2%',
                top: 'bottom',
                showLabel: !0,
                seriesIndex: [1],
                calculable: true,
                itemWidth: 14,
                itemHeight: 5,
                textStyle: {
                    color: fontColor
                },
                text: ['高', '低'],
                pieces: [{
                    gt: present20,
                    label: '20%以上',
                    color: '#4092d6'
                }, {
                    gte: present10,
                    lte: present20,
                    label: '10% - 20%',
                    color: '#2e7cc6'
                }, {
                    gte: present5,
                    lte: present10,
                    label: '5% -10%',
                    color: '#256fb3'
                }, {
                    gt: 1,
                    lt: present5,
                    label: '5%以下',
                    color: '#075099'
                }, {
                    value: 0,
                    label: '0%',
                    color: '#0b3b6e'
                }],
                show: !0
            },
            geo: {
                show: true,
                map: 'china',
                label: {
                    normal: {
                        show: false
                    },
                    emphasis: {
                        show: false
                    }
                },
                roam: false,
                itemStyle: {
                    normal: {
                        areaColor: '#0b3b6e',
                        borderColor: '#1180c7'
                    },
                    emphasis: {
                        areaColor: '#2B91B7'
                    }
                }
            },
            series: [{
                name: '散点',
                type: 'scatter',
                coordinateSystem: 'geo',
                data: convertData(data),
                symbolSize: function(val) {
                    return val[2] / 20
                },
                tooltip: {
                    formatter: (val) => {
                        console.log('val', val)
                        return val.name + ':' + val.value[2]
                    }
                },
                label: {
                    normal: {
                        formatter: '{b}',
                        position: 'right',
                        show: true
                    },
                    emphasis: {
                        show: false
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#fff'
                    }
                }
            },
            {
                type: 'map',
                map: mapName,
                geoIndex: 0,
                aspectScale: 0.6, // 长宽比
                zoom: 2,
                showLegendSymbol: false, // 存在legend时显示
                tooltip: {
                    formatter: (val) => {
                        console.log('val', val)
                        return val.name + ':' + (isNaN(val.value) ? 0 : val.value)
                    }
                },
                label: {
                    normal: {
                        show: true,
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    emphasis: {
                        show: false,
                        textStyle: {
                            color: '#fff'
                        }
                    }
                },
                roam: true,
                itemStyle: {
                    normal: {
                        areaColor: '#0b3b6e',
                        borderColor: '#1180c7'
                    },
                    emphasis: {
                        areaColor: '#2B91B7'
                    }
                },
                animation: false,
                data: data
            },
            {
                name: '点',
                type: 'scatter',
                coordinateSystem: 'geo',
                zlevel: 6
            },
            {
                name: 'Top 10',
                type: 'effectScatter',
                coordinateSystem: 'geo',
                data: convertData(data.sort(function(a, b) {
                    return b.value - a.value
                }).slice(0, 10)),
                symbolSize: function(val) {
                    return val[2] / roundSize
                },
                showEffectOn: 'render',
                rippleEffect: {
                    brushType: 'stroke'
                },

                tooltip: {
                    formatter: (val) => {
                        console.log('val', val)
                        return val.name + ':' + val.value[2]
                    }
                },
                hoverAnimation: true,
                label: {
                    normal: {
                        formatter: '{b}',
                        position: 'left',
                        show: false
                    }
                },
                itemStyle: {
                    normal: {
                        color: 'yellow',
                        shadowBlur: 10,
                        shadowColor: 'yellow'
                    }
                },
                zlevel: 1
            }

            ]
        }
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
