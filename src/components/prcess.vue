<template>
    <div class="prcess">
        <div class="ub ub-pj w100 prcess-top">
            <div class="ub line-1" style="width:130px;">
                <el-tooltip class="item" effect="dark" :content="chartData.value" placement="top">
                    <span>
                        {{chartData.value}}
                    </span>
                </el-tooltip>
            </div>
            <div>{{chartData.percent}}%</div>
        </div>
        <div class="w100 prcess-box">
            <div class="ani-box" :class="{'active':hexColors.length>0}">
                <div v-for="(item,index) in hexColors" :key="index" :style="{backgroundColor:item}"></div>
            </div>
        </div>
    </div>
</template>

<script>
import publicParams from '../mixins/data_center/index'
export default {
    name: 'Prcess',
    mixins: [publicParams],
    props: ['chartData'],
    data() {
        return {
            hexColors: []
        }
    },
    mounted() {
        let curPrecent = Math.floor((this.chartData.percent * 42) / 100)
        let arr = this.interpolateColors('#00ddff', '#0091ff', curPrecent)
        this.hexColors = arr.map(item => {
            item = this.rgbArrayToHex(item)
            return item
        })
        // console.log(this.hexColors)
    }
}
</script>

<style lang="scss" scoped>
    .prcess{
        width:180px;
        margin-bottom:10px;
    }
    .prcess-top{
        margin-bottom: 5px;
        div{
            color:rgba(0,0,0,0.4);
            font-size:12px;
        }
    }
    .prcess-box{
        height: 10px;
        background-color: #387dee;
        // box-shadow: 0px 0px 10px 0px
        //     rgba(0,122,247,0.6);
        font-size:0;

        >div.ani-box{
            width:0;
            overflow: hidden;
            height: 10px;
            div{
                display: inline-block;
                width: 2px;
                height: 10px;
                margin: 0 1px;
                transform: skewX(30deg);
                background-color: #fff !important;
            }
        }
        >div.active{
            animation: showAni 1s forwards;
        }
    }
    @keyframes showAni {
        0% {
            width: 0;
        }

        100% {
            width: 100%;
        }
    }
    @-webkit-keyframes showAni {
        0% {
            width: 0;
        }

        100% {
            width: 100%;
        }
    }
</style>
