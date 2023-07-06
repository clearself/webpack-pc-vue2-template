<template>
    <div style="width: 100%;height: 100%;" ref="myEcharts"></div>
</template>

<script>
// import echarts from 'echarts/index';
export default {
    name: 'ResultPie1',
    props: ['chartData', 'title', 'type'],
    data() {
        return {
        }
    },
    mounted() {
        let data = this.chartData
        console.log(data)
        let option = {
            color: ['#0bcfff', '#00fff4', '#7ffffe'],
            title: {
                text: '成果审核总数',
                left: 'center',
                bottom: '5',
                textStyle: {
                    color: '#fff'
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} 件',
                position: ['50%', '50%']
            },
            series: [
                {
                    name: '',
                    type: 'pie',
                    radius: '60%',
                    center: ['50%', '40%'],
                    data: data,
                    label: {
                        formatter: '{c} 件'
                    },
                    labelLine: {
                        show: true,
                        smooth: false,
                        length: 10,
                        length2: 10,
                        lineStyle: {
                            type: 'dotted'
                        }
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        }
        // eslint-disable-next-line no-undef
        let myChart = echarts.init(this.$refs.myEcharts)
        myChart.setOption(option, true)
    }
}
</script>

<style scoped>

</style>
