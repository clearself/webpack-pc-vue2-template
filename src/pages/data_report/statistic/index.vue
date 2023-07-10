<template>
    <div class="report-platform" style="position: relative;">
        <div class="ub ub-ac w100" style="box-sizing: border-box;">
            <div class="ub w100" style="height:50px;padding-top:0;padding-bottom:0;">
                <div class="ub ub-ac ub-pc report-nav" v-for="(item,index) in types" :key="index"  @click="tabClick(item,index)" :class="{ 'active': item.isActive }">{{item.name}}</div>
            </div>
        </div>
        <div class="w100 components">
            <component class="p-2" v-bind:is="currentTabComponent"></component>
        </div>
    </div>
</template>

<script>
import Overview from './overview'
import Statistic from './trend'

export default {
    name: 'ReportStatistic',
    mixins: [],
    components: { Overview, Statistic },
    data() {
        return {
            types: [
                {
                    id: 0,
                    name: '数据概览',
                    isActive: true,
                    component: 'Overview'
                },
                {
                    id: 1,
                    name: '趋势统计',
                    isActive: false,
                    component: 'Statistic'
                }
            ]
        }
    },
    computed: {
        currentTabComponent() {
            let component = this.types.filter(item => item.isActive)[0].component
            return component
        }
    },
    mounted() {
        this.$nextTick(() => {
            if (this.$route.params.back) {
                this.types.forEach(it => {
                    if (it.id === 0) {
                        it.isActive = true
                    } else {
                        it.isActive = false
                    }
                })
            }
        })
    },
    methods: {
        tabClick(item, index) {
            this.types = this.types.map(e => {
                e.isActive = false
                return e
            })
            item.isActive = true
        }
    }
}
</script>

<style lang="scss" scoped>
.report-platform{
    background-color: #fff;
}
.report-nav{
    height:100%;
    margin: 0 10px;
    font-size:16px;
    color:#666;
    cursor: pointer;
    border-bottom:1px solid rgba(255,255,255,0)
}
.report-nav:hover{
    @include themeify {
        color: themed('theme-color');
    }
}
.report-nav.active{
    @include themeify {
        color: themed('theme-color');
        border-bottom: 1px solid themed('theme-color');
    }
}
.components{
    box-sizing: border-box;
}
</style>
