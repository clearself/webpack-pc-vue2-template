<template>
    <div ref="myEcharts" class="echarts"></div>
</template>

<script>
export default {
    name: 'Funnel',
    props: ['chartData', 'title'],
    data() {
        return {

        }
    },
    mounted() {
        let theme = this.$store.state.common.currentTheme
        let legendColor
        switch (theme) {
            case 'white-theme':
                legendColor = '#000'
                break
            default :
                legendColor = '#fff'
        }
        let that = this
        let legendData = []
        let data = this.chartData
        let colors = ['#0adcff', '#1f8ffb', '#ff29cd', '#ffaa2a', '#8cff26']
        data.forEach((item, index) => {
            legendData.push(item.name)
        })
        let option = {
            color: colors,
            tooltip: {
                trigger: 'item',
                formatter: '{b} : {c}'
            },
            legend: {
                type: 'scroll',
                orient: 'vertical',
                left: 10,
                bottom: 10,
                sort: 'descending',
                itemWidth: 14,
                itemHeight: 4,
                textStyle: {
                    color: legendColor,
                    fontSize: 10
                }
            },
            calculable: true,
            series: [
                {
                    name: '',
                    type: 'funnel',
                    left: '40%',
                    bottom: 10,
                    top: 20,
                    width: '45%',
                    sort: 'descending',
                    labelLine: false,
                    label: {
                        show: true,
                        position: 'inside',
                        formatter: '{c}'
                    },
                    data: data
                }
            ]
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
