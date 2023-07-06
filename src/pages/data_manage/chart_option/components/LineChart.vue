<template>
    <div style="width:100%;height:100%" ref="lineRef"><div style="width:100%;height: 100%;" ref="myEcharts" class="echarts"></div></div>
</template>

<script>
import echarts from 'echarts'
import _ from 'loadsh'
import 'echarts/lib/component/dataZoom'
export default {
    name: 'LineChart',
    props: ['allFieldList', 'chartData', 'chatLineOption', 'seq', 'type'],
    data() {
        return {
            myChart: null,
            loading: true,
            timer: null,
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
            // chartData: [
            //     { level: '5', num: 7 },
            //     { level: '1', num: 2 },
            //     { level: '6', num: 8 },
            //     { level: '4', num: 7 }
            // ],
            lineData: [
                { level: '5', num: 1, attackType: 'NMap扫描' },
                { level: '1', num: 10, attackType: '目录访问' },
                { level: '6', num: 2, attackType: '攻击利用' },
                { level: '4', num: 5, attackType: 'SQL注入' },
                { level: '1', num: 1, attackType: 'NMap扫描' },
                { level: '5', num: 10, attackType: '目录访问' },
                { level: '4', num: 2, attackType: '攻击利用' },
                { level: '6', num: 5, attackType: 'SQL注入' }
            ],
            aggTypeList: {
                1: '求和',
                2: '平均数',
                3: '中位数',
                4: '计数',
                5: '去重计数',
                6: '最大值',
                7: '最小值'
            },
            lineOption: null
            // lineOption: {
            //     xData: {
            //         field: ['level']
            //     },
            //     yData: {
            //         field: [],
            //         aggType: null,
            //         sortType: 'desc',
            //         count: 0
            //     },
            //     attr: {
            //         color: [],
            //         subdivision: ['attackType']
            //     },
            //     measureList: []
            // }
        }
    },
    watch: {
        chatLineOption: {
            deep: true, // 深度监听
            handler(newVal, oldVal) {
                if (newVal) {
                    // console.log(this.xData, '图表数据')
                    this.lineOption = newVal
                    // this.renderChart()
                }
            }
        },
        chartData: {
            deep: true, // 深度监听
            handler(newVal, oldVal) {
                if (newVal) {
                    this.lineData = newVal
                    this.renderChart()
                }
            }
        }
    },
    computed: {
        // xData() {
        //     return this.chartData.map(it => {
        //         return [new Date(it.nodeTime).getTime(), it.num]
        //     })
        // }
    },
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
            console.log(this.lineOption)
            // chart分为四种状态
            // 第一种，只有xy，没有细分，没有度量。
            // 第二种，有xy，有细分，没有度量。
            // 第三种，有xy，无细分，有度量。
            // 第四种，有xy，有细分，有度量。
            // 细分字段
            let sub = this.lineOption.attr.subdivision[0]
            // x轴字段
            let x = this.lineOption.xData.field[0]
            // y轴字段
            let y = this.lineOption.yData.field[0]
            // 颜色区分字段
            let color = this.lineOption.attr.color[0]
            // 度量字段
            let measureList = this.lineOption.measureList
            // 是否有度量
            let hasMeasure = measureList.length != 0
            // 把数据按x轴分开存储在此
            let tmpXData = {}
            // x轴数据
            let xData = []
            // 细分数据，如果有度量，每个细分分别与每个度量取交集
            let legend = []
            // 数据信息
            let series = []
            // 生成颜色数据，只有颜色字段值与细分字段值相同，或者颜色字段值是度量名称，且存在度量列表需要处理颜色数据，否则，颜色为默认不需要处理
            let colors = {}
            if (color && color == sub) {
                this.chartData.forEach(item => {
                    if (!(item[sub] in colors)) {
                        let name = item[sub]
                        colors[name] = this.$color16()
                    }
                })
            } else if (hasMeasure && color == 'dlmc') {
                measureList.forEach(item => {
                    let name = this.getNameByCode(item)
                    colors[name] = this.$color16()
                })
            }
            if (!sub && !hasMeasure) {
                // 无细分，无度量，只有xy
                let yname = this.allFieldList.filter(item => item.code == y)[0].name
                legend.push(yname)
                this.lineData.forEach(item => {
                    // 横坐标
                    let tmpX = item[x]
                    xData.push(tmpX)
                    legend.push(tmpX)
                    if (series[0]) {
                        series[0].data.push(item.num)
                    } else {
                        series[0] = {}
                        series[0].type = 'line'
                        series[0].data = [item.num]
                        series[0].name = yname
                    }
                })
            }
            if (!sub && hasMeasure) {
                // 无细分,有度量
                // { level: '4', srcPortNum: 7, desPortNum: 12  }
                measureList.forEach(item => {
                    this.allFieldList.forEach(fie => {
                        if (fie.code == item) {
                            legend.push(fie.name)
                        }
                    })
                })
                console.log(this.allFieldList)
                console.log(measureList)
                console.log(legend)
                this.lineData.forEach(item => {
                    // 横坐标
                    let tmpX = item[x]
                    xData.push(tmpX)
                    legend.forEach((lg, lgi) => {
                        console.log(measureList[lgi])
                        let seriesItem = series.filter(ser => {
                            console.log(ser.name)
                            return ser.name == lg
                        })[0]
                        console.log(seriesItem)
                        if (seriesItem) {
                            console.log(item)
                            if (this.type == 6 || this.type == 7) {
                                // 资产和漏洞
                                seriesItem.data.push(item[`${measureList[lgi]}_num`])
                            } else {
                                seriesItem.data.push(item[`${measureList[lgi]}Num`])
                            }
                        } else {
                            let tmps = {
                                name: lg,
                                data: null,
                                type: 'line'
                            }
                            if (this.type == 6 || this.type == 7) {
                                // 资产和漏洞
                                tmps.data = [item[`${measureList[lgi]}_num`]]
                            } else {
                                tmps.data = [item[`${measureList[lgi]}Num`]]
                            }
                            series.push(tmps)
                        }
                    })
                })
            }
            if (sub && !hasMeasure) {
                // 有细分，无度量
                this.lineData.forEach(item => {
                    // 横坐标
                    let tmpX = item[x]
                    if (!xData.includes(tmpX)) xData.push(tmpX)

                    if (tmpXData[tmpX]) {
                        tmpXData[tmpX].push(item)
                    } else {
                        tmpXData[tmpX] = [item]
                    }
                    // 存在细分
                    let tmpSub = item[sub]
                    if (!legend.includes(tmpSub)) legend.push(tmpSub)
                })
                xData.forEach(x1 => {
                    // 每个横坐标的数据
                    let tmpItemArr = tmpXData[x1]
                    this.replenishData(x, tmpItemArr, sub, legend)
                    tmpItemArr.forEach(tia => {
                        let seriesItem = series.filter(ser => ser.name == tia[sub])[0]
                        if (seriesItem) {
                            // series 中已存在当前细分
                            seriesItem.data.push(tia.num)
                        } else {
                            let tmps = {
                                name: tia[sub],
                                data: [tia.num],
                                type: 'line'
                            }
                            series.push(tmps)
                        }
                    })
                })
            }
            if (sub && hasMeasure) {
                //  { level: '5', srcPortNum: 10, desPortNum: 2, attackType: 'NMap扫描' },
                // 有细分，有度量
                const tmpCahrtData = []
                this.lineData.forEach(item => {
                    measureList.forEach(ms => {
                        const name = this.allFieldList.filter(f => f.code == ms)[0].name
                        if (this.type == 6 || this.type == 7) {
                            tmpCahrtData.push({
                                [x]: item[x],
                                num: item[`${ms}_num`],
                                [sub]: `${item[`${sub}`]}(${name})`
                            })
                        } else {
                            tmpCahrtData.push({
                                [x]: item[x],
                                num: item[`${ms}Num`],
                                [sub]: `${item[`${sub}`]}(${name})`
                            })
                        }
                    })
                })
                console.log(tmpCahrtData)
                tmpCahrtData.forEach(item => {
                    // 横坐标
                    let tmpX = item[x]
                    if (!xData.includes(tmpX)) xData.push(tmpX)
                    if (tmpXData[tmpX]) {
                        tmpXData[tmpX].push(item)
                    } else {
                        tmpXData[tmpX] = [item]
                    }
                    // 存在细分
                    let tmpSub = item[sub]
                    if (!legend.includes(tmpSub)) legend.push(tmpSub)
                })
                xData.forEach(x1 => {
                    // 每个横坐标的数据
                    let tmpItemArr = tmpXData[x1]
                    console.log(tmpItemArr)
                    this.replenishData(x, tmpItemArr, sub, legend)
                    tmpItemArr.forEach(tia => {
                        let seriesItem = series.filter(ser => ser.name == tia[sub])[0]
                        if (seriesItem) {
                            // series 中已存在当前细分
                            seriesItem.data.push(tia.num)
                        } else {
                            let tmps = {
                                name: tia[sub],
                                data: [tia.num],
                                type: 'line'
                            }
                            if (!_.isEmpty(colors)) {
                                // console.log('???????')
                                // 如果筛选了颜色
                                tmps.itemStyle = {
                                    normal: {
                                        // 这里是颜色
                                        color: function(params) {
                                            let c = ''
                                            for (let key in colors) {
                                                if (params.data.name.includes(key)) {
                                                    c = colors[key]
                                                }
                                            }
                                            return c
                                            // return '#0011ee'
                                        }
                                    }
                                }
                            }
                            series.push(tmps)
                        }
                    })
                })
            }
            const legendSort = []
            const legendColor = []
            series.forEach(item => {
                legendSort.push(item.name)
                for (let key in colors) {
                    if (item.name.includes(key)) {
                        legendColor.push(colors[key])
                    }
                }
            })
            console.log(xData)
            console.log(series)
            console.log(legend)
            let clientWidth = this.$refs.lineRef.clientWidth
            let fontSize = 12
            let formatter = function(value) {
                let tmpStr = value
                let split = parseInt(value.length / 10) + 1
                let returnValue = ''
                if (split) {
                    for (let i = 0; i < split; i++) {
                        returnValue += tmpStr.substring(i * 10, (i + 1) * 10) + '\n'
                        if (i == 2) {
                            returnValue += '...'
                            break
                        }
                    }
                }
                return returnValue
            }
            if (clientWidth < 600) {
                formatter = function(value) {
                    let tmpStr = value
                    let returnValue = tmpStr.substring(0, 4) + '...'
                    return returnValue
                }
                fontSize = 10
            }
            if (clientWidth < 900) {
                formatter = function(value) {
                    let tmpStr = value
                    let returnValue = tmpStr.substring(0, 5) + '...'
                    return returnValue
                }
                fontSize = 10
            }
            let option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    extraCssText: 'white-space:pre-line',
                    confine: true
                },
                grid: {
                    show: false,
                    top: '5%',
                    right: '5%',
                    bottom: '25%',
                    left: '10%'
                },
                dataZoom: [],
                xAxis: {},
                yAxis: {},
                legend: {
                    type: 'scroll',
                    x: 'center',
                    y: 'bottom',
                    data: legendSort
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
                                    text: this.seq ? this.getNameByCode(y) + '（' + this.aggTypeList[this.lineOption.yData.aggType] + '）' : this.getNameByCode(x),
                                    font: '14px Microsoft YaHei'
                                }
                            }
                        ]
                    },
                    {
                        type: 'group',
                        left: 'center',
                        bottom: '10%',
                        children: [
                            {
                                type: 'text',
                                z: 100,
                                left: 'center',
                                top: 'middle',
                                style: {
                                    fill: '#333',
                                    text: this.seq ? this.getNameByCode(x) : this.getNameByCode(y) + '（' + this.aggTypeList[this.lineOption.yData.aggType] + '）',
                                    font: '14px Microsoft YaHei'
                                }
                            }
                        ]
                    }
                ],
                series: series
            }
            if (!this.seq) {
                option.xAxis = {
                    type: 'value',
                    minInterval: 1
                }
                option.dataZoom = [
                    {
                        show: xData.length > 10,
                        height: 5,
                        yAxisIndex: [0],
                        bottom: 20,
                        orient: 'horizontal',
                        showDetail: false,
                        showDataShadow: false,
                        borderColor: 'transparent',
                        textStyle: {
                            fontSize: 0
                        },
                        endValue: 9, // 从0开始的相当于10个
                        backgroundColor: 'rgba(0,0,0,0)',
                        borderWidth: 0,
                        handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
                        handleSize: '0%',
                        handleStyle: {
                            color: '#d3dee5'
                        }
                    }
                ]
                option.yAxis = {
                    type: 'category',
                    data: xData,
                    axisLabel: {
                        interval: 0,
                        fontSize: fontSize,
                        rotate: clientWidth < 600 ? 30 : 0,
                        formatter: formatter
                    }
                }
            } else {
                option.xAxis = {
                    type: 'category',
                    data: xData,
                    axisLabel: {
                        interval: 0,
                        fontSize: fontSize,
                        rotate: clientWidth < 600 ? 30 : 0,
                        formatter: formatter
                    }
                }
                option.dataZoom = [
                    {
                        show: xData.length > 10,
                        height: 5,
                        xAxisIndex: [0],
                        bottom: 20,
                        showDetail: false,
                        showDataShadow: false,
                        borderColor: 'transparent',
                        textStyle: {
                            fontSize: 0
                        },
                        endValue: 9, // 从0开始的相当于10个
                        backgroundColor: 'rgba(0,0,0,0)',
                        borderWidth: 0,
                        handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
                        handleSize: '0%',
                        handleStyle: {
                            color: '#d3dee5'
                        }
                    }
                ]
                option.yAxis = {
                    type: 'value',
                    minInterval: 1
                }
            }
            if (!_.isEmpty(colors)) {
                option.color = legendColor
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
