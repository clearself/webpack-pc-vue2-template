<template>
    <div id="container1" style="height:100%;width:100%;"></div>
</template>

<script>
import echarts from 'echarts'
import 'echarts/map/js/china'
import 'echarts/map/js/world'

export default {
    name: 'Map1',
    data() {
        return {}
    },
    props: {
        mapType: {
            type: String,
            default: 'china'
        },
        chartData: {
            type: Array,
            default: function() {
                return []
            }

        }
    },
    mounted() {
        let myChart = echarts.init(document.getElementById('container1'))
        var mapName = this.mapType
        var mapObj = {
            Anhui: '安徽',
            Beijing: '北京',
            Fujian: '福建',
            Gansu: '甘肃',
            Guangdong: '广东',
            Guangxi: '广西',
            Guizhou: '贵州',
            Hainan: '海南',
            Hebei: '河北',
            Henan: '河南',
            Heilongjiang: '黑龙江',
            Hubei: '湖北',
            Hunan: '湖南',
            Jilin: '吉林',
            Jiangsu: '江苏',
            Jiangxi: '江西',
            Liaoning: '辽宁',
            'Nei Mongol': '内蒙古',
            Ningxia: '宁夏',
            Qinghai: '青海',
            Shandong: '山东',
            Shanxi: '山西',
            Shaanxi: '陕西',
            Shanghai: '上海',
            Sichuan: '四川',
            Tianjin: '天津',
            Xizang: '西藏',
            Xinjiang: '新疆',
            Yunnan: '云南',
            Zhejiang: '浙江',
            Chongqing: '重庆',
            'Hong Kong': '香港',
            Macao: '澳门'
            // '台湾': '台湾',
            // '南海诸岛': '南海诸岛'
        }
        if (this.mapType === 'china') {
            this.chartData.forEach(item => {
                if (mapObj[item.name]) {
                    item.name = mapObj[item.name]
                }
            })
        }
        var data = this.chartData
        let num = data.map(item => { return item.value })
        var maxNum = Math.max.apply(null, num)
        console.log(maxNum, '最大值')
        /* var data = [
            {name:"北京",value:199},
            {name:"天津",value:42},
            {name:"河北",value:102},
            {name:"山西",value:81},
            {name:"内蒙古",value:47},
            {name:"辽宁",value:67},
            {name:"吉林",value:82},
            {name:"黑龙江",value:123},
            {name:"上海",value:24},
            {name:"江苏",value:92},
            {name:"浙江",value:114},
            {name:"安徽",value:109},
            {name:"福建",value:116},
            {name:"江西",value:91},
            {name:"山东",value:119},
            {name:"河南",value:137},
            {name:"湖北",value:116},
            {name:"湖南",value:114},
            {name:"重庆",value:91},
            {name:"四川",value:125},
            {name:"贵州",value:62},
            {name:"云南",value:83},
            {name:"西藏",value:9},
            {name:"陕西",value:80},
            {name:"甘肃",value:56},
            {name:"青海",value:10},
            {name:"宁夏",value:18},
            {name:"新疆",value:180},
            {name:"广东",value:123},
            {name:"广西",value:59},
            {name:"海南",value:14},
        ];*/

        var geoCoordMap = {}
        /* 获取地图数据*/
        myChart.showLoading()
        var mapFeatures = echarts.getMap(mapName).geoJson.features
        myChart.hideLoading()
        mapFeatures.forEach(function(v) {
            // 地区名称
            var name = v.properties.name
            // 地区经纬度
            geoCoordMap[name] = v.properties.cp
        })

        console.log(data)
        var max = 480
        var min = 9 // todo
        var maxSize4Pin = 100
        var minSize4Pin = 20

        var convertData = function(data) {
            var res = []
            for (var i = 0; i < data.length; i++) {
                var geoCoord = geoCoordMap[data[i].name]
                if (geoCoord) {
                    res.push({
                        name: data[i].name,
                        value: geoCoord.concat(data[i].value)
                    })
                }
            }
            console.log(res)
            return res
        }
        var option = {
            tooltip: {
                padding: 0,
                enterable: true,
                transitionDuration: 1,
                textStyle: {
                    color: '#FFF',
                    decoration: 'none'
                },
                formatter: function(params) {
                    // console.log(params)
                    var tipHtml = ''
                    tipHtml = `<div><p>${params.name || '--'}：</p><p>攻击量：${params.value || '--'}</p><p>占比：${params.data ? (params.data.proportion || '--') : '--'}</p></div>`
                    return tipHtml
                }
            },

            visualMap: {
                show: false,
                min: 0,
                max: maxNum,
                left: '10%',
                top: 'bottom',
                calculable: true,
                seriesIndex: [0], // 取打series.data哪列
                inRange: {
                    color: ['#bd50d3', '#f36d78', '#f2995f', '#266fe8', '#48c79c'] // 蓝绿
                }
            },
            geo: {
                show: true,
                zoom: 1.25,
                map: mapName,
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
                        areaColor: '#e0e0e0'
                        // borderColor: '#1180c7'
                    },
                    emphasis: {
                        areaColor: '#e0e0e0'
                    }
                }
            },
            series: [
                {
                    type: 'map',
                    map: mapName,
                    geoIndex: 0,
                    aspectScale: 1.3, // 长宽比
                    showLegendSymbol: false, // 存在legend时显示
                    label: {
                        normal: {
                            show: true,
                            textStyle: {
                                fontSize: 12,
                                color: 'red'
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
                            areaColor: '#e0e0e0'
                            // borderColor: '#3B5077'
                        },
                        emphasis: {
                            areaColor: '#e0e0e0'
                        }
                    },
                    animation: false,
                    data: data
                }
            ]
        }
        myChart.setOption(option)
        window.addEventListener('resize', function() {
            myChart.resize()
        })
    },
    computed: {},
    watch: {},
    methods: {}
}
</script>

<style scoped>
</style>
