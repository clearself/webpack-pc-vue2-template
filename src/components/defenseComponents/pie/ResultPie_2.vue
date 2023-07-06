<template>
    <div style="width: 100%;height: 100%;" ref="myEcharts"></div>
</template>

<script>
// import echarts from 'echarts/index';
export default {
    name: 'ResultPie2',
    props: ['chartData', 'title', 'type'],
    data() {
        return {
        }
    },
    mounted() {
        let data = this.chartData[0]
        if (!data.value && data.value != 0) {
            data.value = 100
        }
        console.log(data)
        let option = {
            color: ['#00fff4', '#fff'],
            title: {
                text: '审核通过率',
                left: 'center',
                bottom: '5',
                textStyle: {
                    color: '#fff'
                }
            },
            series: [
                {
                    name: '',
                    type: 'pie',
                    radius: ['45%', '60%'],
                    center: ['50%', '40%'],
                    avoidLabelOverlap: false,
                    label: {
                        position: 'center',
                        fontSize: '20',
                        color: '#fff',
                        formatter: data.value + '%'
                    },
                    labelLine: {
                        show: false
                    },
                    data: [{
                        value: data.value,
                        label: {
                            normal: {
                                show: true
                            }
                        }
                    },
                    {
                        value: 100 - data.value,
                        name: ''
                    }]
                }
            ]
        }
        // eslint-disable-next-line no-undef
        let myChart = echarts.init(this.$refs.myEcharts)
        myChart.setOption(option)
    }
}
</script>

<style scoped>

</style>
