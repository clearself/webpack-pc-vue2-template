<template>
    <div style="width:100%;height:100%"><div style="width:100%;height: 100%;" ref="myEcharts" class="echarts"></div></div>
</template>

<script>
import echarts from 'echarts'
import _ from 'loadsh'
export default {
    name: 'Bar',
    props: ['allFieldList', 'pieData', 'chatPieOption'],
    data() {
        return {
            myChart: null,
            loading: true,
            timer: null,
            aggTypeList: {
                1: '求和',
                2: '平均数',
                3: '中位数',
                4: '计数',
                5: '去重计数',
                6: '最大值',
                7: '最小值'
            },
            // chartData: [
            //     { level: '5', num: 7, attackType: 'SQL注入' },
            //     { level: '4', num: 5, attackType: 'NMap扫描' },
            //     { level: '1', num: 4, attackType: 'WEB访问' },
            //     { level: '1', num: 2, attackType: '攻击利用' },
            //     { level: '6', num: 8, attackType: '目录访问' },
            //     { level: '1', num: 5, attackType: 'NMap扫描' },
            //     { level: '4', num: 7, attackType: 'WEB访问' },
            //     { level: '5', num: 4, attackType: '目录访问' },
            //     { level: '6', num: 6, attackType: 'SQL注入' },
            //     { level: '4', num: 5, attackType: '攻击利用' },
            //     { level: '1', num: 4, attackType: '目录访问' },
            //     { level: '4', num: 3, attackType: 'SQL注入' },
            //     { level: '5', num: 4, attackType: 'NMap扫描' },
            //     { level: '6', num: 7, attackType: '攻击利用' },
            //     { level: '6', num: 2, attackType: 'WEB访问' },
            //     { level: '5', num: 8, attackType: 'WEB访问' },
            //     { level: '4', num: 2, attackType: '目录访问' },
            //     { level: '1', num: 5, attackType: 'SQL注入' },
            //     { level: '6', num: 9, attackType: 'NMap扫描' },
            //     { level: '5', num: 3, attackType: '攻击利用' }
            // ],
            // chartData: [{ level: '5', num: 7 }, { level: '1', num: 2 }, { level: '6', num: 8 }, { level: '4', num: 7 }],
            // chartData: [
            //     { level: '4', srcPortNum: 7, desPortNum: 12 },
            //     { level: '1', srcPortNum: 6, desPortNum: 11 },
            //     { level: '3', srcPortNum: 3, desPortNum: 10 },
            //     { level: '2', srcPortNum: 2, desPortNum: 18 },
            //     { level: '5', srcPortNum: 1, desPortNum: 3 }
            // ],
            // chartData: [
            //     { level: '5', srcPortNum: 10, desPortNum: 2, attackType: 'NMap扫描' },
            //     { level: '1', srcPortNum: 11, desPortNum: 3, attackType: 'NMap扫描' },
            //     { level: '2', srcPortNum: 7, desPortNum: 2, attackType: 'NMap扫描' },
            //     { level: '4', srcPortNum: 6, desPortNum: 8, attackType: 'NMap扫描' },
            //     { level: '6', srcPortNum: 21, desPortNum: 12, attackType: 'NMap扫描' },
            //     { level: '8', srcPortNum: 13, desPortNum: 16, attackType: 'NMap扫描' }
            // ],
            chartData: null,
            pieOption: null
            // pieOption: {
            //     attr: {
            //         type: 1,
            //         color: ['level'],
            //         subdivision: ['attackType'],
            //         angle: []
            //     },
            //     measureList: ['srcPort', 'desPort']
            // }
        }
    },
    watch: {
        chatPieOption: {
            deep: true, // 深度监听
            handler(newVal, oldVal) {
                if (newVal) {
                    this.pieOption = newVal
                    // this.renderChart()
                }
            }
        },
        pieData: {
            deep: true, // 深度监听
            handler(newVal, oldVal) {
                // console.log(newVal)
                if (newVal) {
                    this.chartData = newVal
                    // console.log(this.pieOption)
                    this.renderChart()
                }
            }
        }
    },
    computed: {},
    mounted() {
        // this.renderChart()
    },
    beforeDestroy() {
        if (!this.myChart) return
        window.removeEventListener('resize', this.myChart.resize)
    },
    methods: {
        getNameByCode(code) {
            return this.allFieldList.filter(i => i.code == code)[0].name
        },
        renderChart() {
            // chart分为四种状态
            // 第一种，只有颜色角度，没有细分，没有度量。
            // 第二种，有颜色角度，有细分，没有度量。
            // 第三种，有颜色角度，无细分，有度量。
            // 第四种，有颜色角度，有细分，有度量。
            // 细分字段
            console.log(this.pieOption)
            console.log(this.pieOption.attr.angle[0])
            let sub = this.pieOption.attr.subdivision[0]
            // 颜色字段
            let x = this.pieOption.attr.color[0]
            let color = this.pieOption.attr.color[0]
            // 角度字段
            let y = this.pieOption.attr.angle[0]
            // 度量字段
            let measureList = this.pieOption.measureList
            // 是否有度量
            let hasMeasure = measureList.length != 0
            // 把数据按x轴分开存储在此
            let tmpXData = {}
            // 细分数据，如果有度量，每个细分分别与每个度量取交集
            let legend = []
            // 数据信息
            let series = []
            // 生成颜色数据，只有颜色字段值与细分字段值相同，或者颜色字段值是度量名称，且存在度量列表需要处理颜色数据，否则，颜色为默认不需要处理
            let colors = {}
            // 特殊处理事件等级
            let colorList = this.pieOption.attr.colorSet
            if (color && sub && hasMeasure) {
                if (color == 'dlmc') {
                    measureList.forEach(item => {
                        let name = this.getNameByCode(item)
                        colors[name] = this.$color16()
                    })
                } else {
                    this.chartData.forEach(item => {
                        if (!(item[color] in colors)) {
                            let name = item[color]
                            colors[name] = this.$color16()
                        }
                    })
                }
            }
            // 是否弧度
            let isStack = this.pieOption.attr.type == 2
            if (!sub && !hasMeasure) {
                // 无细分，无度量，只有xy
                this.chartData.forEach(item => {
                    // 横坐标
                    console.log(y)
                    let tmpX = item[x]
                    if (!tmpX) {
                        console.log(this.allFieldList)
                        tmpX = this.allFieldList.filter(fie => fie.code == y)[0].name
                        console.log(tmpX)
                        if (tmpX == '记录数' || tmpX == '度量值') {
                            tmpX = ''
                        }
                    }
                    legend.push(tmpX)
                    if (series[0]) {
                        series[0].data.push({
                            name: tmpX,
                            value: item.num
                        })
                    } else {
                        series[0] = {}
                        series[0].type = 'pie'
                        series[0].name = '饼图'
                        series[0].radius = [0, '80%']
                        series[0].label = {
                            normal: {
                                show: true
                            },
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                        series[0].labelLine = {
                            show: true
                        }
                        series[0].data = [
                            {
                                name: tmpX,
                                value: item.num
                            }
                        ]
                    }
                })
            }
            if (!sub && hasMeasure) {
                // 无细分,有度量
                this.chartData.forEach(item => {
                    if (series[0]) {
                        for (let key in item) {
                            if (key !== x) {
                                let keyCode = key.substr(0, key.length - 3)
                                let keyName = this.allFieldList.filter(fie => fie.code == keyCode)[0].name
                                let name = x ? `${item[x]}(${keyName})` : keyName
                                series[0].data.push({
                                    name: name,
                                    value: item[key]
                                })
                                legend.push(name)
                            }
                        }
                    } else {
                        series[0] = {}
                        series[0].name = '饼图'
                        series[0].type = 'pie'
                        series[0].radius = [0, '80%']
                        series[0].label = {
                            normal: {
                                show: true
                            },
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                        series[0].labelLine = {
                            show: true
                        }
                        series[0].data = []
                        // { level: '5', srcPortNum: 1, desPortNum: 3  }
                        for (let key in item) {
                            if (key !== x) {
                                let keyCode = key.substr(0, key.length - 3)
                                let keyName = this.allFieldList.filter(fie => fie.code == keyCode)[0].name
                                let name = x ? `${item[x]}(${keyName})` : keyName
                                series[0].data.push({
                                    name: name,
                                    value: item[key]
                                })
                                legend.push(name)
                            }
                        }
                    }
                })
            }
            if (sub && !hasMeasure) {
                // 有细分，无度量
                // { level: '6', num: 5, attackType: 'SQL注入' }
                this.chartData.forEach(item => {
                    if (series[0]) {
                        let name = x ? `${item[x]}(${item[sub]})` : item[sub]
                        series[0].data.push({
                            name: name,
                            value: item.num
                        })
                        legend.push(name)
                    } else {
                        series[0] = {
                            name: '饼图'
                        }
                        series[0].type = 'pie'
                        series[0].radius = [0, '80%']
                        series[0].label = {
                            normal: {
                                show: true
                            },
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                        series[0].labelLine = {
                            show: true
                        }
                        // { level: '6', num: 5, attackType: 'SQL注入' }
                        let name = x ? `${item[x]}(${item[sub]})` : item[sub]
                        series[0].data = [
                            {
                                name: name,
                                value: item.num
                            }
                        ]
                        legend.push(name)
                    }
                })
            }
            console.log(sub, measureList)
            if (sub && hasMeasure) {
                //  { level: '5', srcPortNum: 10, desPortNum: 2, attackType: 'NMap扫描' },
                // 有细分，有度量
                this.chartData.forEach(item => {
                    if (series[0]) {
                        for (let key in item) {
                            if (key != x && key != sub) {
                                // 只次拆分度量，不拆分颜色和细分
                                let keyCode = key.substr(0, key.length - 3)
                                let keyName = this.allFieldList.filter(fie => fie.code == keyCode)[0].name
                                let name = x ? `${item[x]}(${item[sub]}-${keyName})` : `${item[sub]}-${keyName}`
                                series[0].data.push({
                                    name: name,
                                    value: item[key]
                                })
                                legend.push(name)
                            }
                        }
                    } else {
                        series[0] = {}
                        series[0].type = 'pie'
                        series[0].name = '饼图'
                        series[0].avoidLabelOverlap = true
                        series[0].radius = [0, '80%']
                        series[0].label = {
                            normal: {
                                show: true
                            },
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                        series[0].labelLine = {
                            show: true
                        }
                        series[0].data = []
                        console.log(colors)
                        if (!_.isEmpty(colors)) {
                            series[0].itemStyle = {
                                normal: {
                                    // 这里是颜色
                                    color: function(params) {
                                        console.log(params)
                                        let c = ''
                                        for (let key in colors) {
                                            if (params.data.name.includes(key)) {
                                                c = colors[key]
                                            }
                                        }
                                        console.log(c)
                                        return c
                                        // return '#0011ee'
                                    }
                                }
                            }
                        }
                        for (let key in item) {
                            if (key != x && key != sub) {
                                // 只次拆分度量，不拆分颜色和细分
                                let keyCode = key.substr(0, key.length - 3)
                                let keyName = this.allFieldList.filter(fie => fie.code == keyCode)[0].name
                                let name = x ? `${item[x]}(${item[sub]}-${keyName})` : `${item[sub]}-${keyName}`
                                series[0].data.push({
                                    name: name,
                                    value: item[key]
                                })
                                legend.push(name)
                            }
                        }
                    }
                })
            }
            console.log(series)
            console.log(legend)
            console.log(isStack)
            console.log(colorList)
            let colorname = color ? this.getNameByCode(color) : ''
            if (colorname == '事件等级' && !sub && !hasMeasure && colorList.length && series.length) {
                series[0].data.forEach(pie => {
                    let color = colorList.filter(cl => cl.name == pie.name)[0].color
                    pie.itemStyle = { color }
                })
            }
            if (isStack) {
                series[0].radius = ['70%', '80%']
            }
            let option = {
                legend: {
                    type: 'scroll',
                    x: 'center',
                    y: 'bottom',
                    data: legend
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)',
                    extraCssText: 'white-space:pre-line',
                    confine: true
                },
                graphic: [
                    {
                        type: 'group',
                        left: '1%',
                        top: '35%',
                        rotation: Math.PI / 2,
                        children: [
                            {
                                type: 'text',
                                z: 100,
                                left: 'center',
                                top: 'middle',
                                style: {
                                    fill: '#333',
                                    text: this.getNameByCode(y) + '（' + this.aggTypeList[this.pieOption.attr.angleType] + '）',
                                    font: '14px Microsoft YaHei'
                                }
                            }
                        ]
                    }
                ],
                series: series
            }
            this.myChart = echarts.init(this.$refs.myEcharts)
            this.myChart.setOption(option, true)
            window.addEventListener('resize', this.myChart.resize)
        },
        replenishData(x, data, sub, legend) {
            legend.forEach(lg => {
                if (!data.some(dt => dt[sub] == lg)) {
                    data.push({
                        [x]: data[0][x],
                        num: 0,
                        [sub]: lg
                    })
                }
            })
        }
    }
}
</script>

<style scoped lang="scss">
.echarts {
    width: 100%;
    height: 100%;
}
.no-data {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    color: #fff;
    font-size: 14px;
    opacity: 0.4;
    letter-spacing: 2px;
}
.echarts ::v-deep .el-loading-mask {
    background-color: rgba(0, 0, 0, 0.5);
}
</style>
