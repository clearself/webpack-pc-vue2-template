<template>
    <div style="width:100%;height:100%" :style="{'overflow-y':heigRight?'none':'auto'}" v-if="targetData">
        <div :style="{'height': heigRight?heightCalc:'', 'overflow-y': 'scroll'}" class="target-wrap">
            <div class="name" v-if="chatTargetOption.nameInfo">{{chatTargetOption.nameInfo.name}}({{chatTargetOption.nameInfo.aggTypeName}})</div>
            <div class="total">{{targetData.total}}</div>
            <div class="hb" v-if="chatTargetOption.contrastData.isHb">
                <span class="field-name">环 比：</span>
                <span>{{chartData.hbCount}}</span>
                <span v-if="chartData.hbCount != 0 && chartData.hbCount">
                    （
                    <i v-if="hbPre > 0" class="iconfont icon-changjiantou-xia up"></i>
                    <i v-if="hbPre < 0" class="iconfont icon-changjiantou-xia"></i>
                    <span>{{hbPre}}%</span>
                    ）
                </span>
            </div>
            <div class="tb" v-if="chatTargetOption.contrastData.isTb">
                <span class="field-name">同比（{{chatTargetOption.contrastData.conValue == 'month' ? '月' : '年'}})：</span>
                <span>{{chartData.tbCount}}</span>
                <span v-if="chartData.tbCount != 0 && chartData.tbCount">
                    （
                    <i v-if="tbPre > 0" class="iconfont icon-changjiantou-xia up"></i>
                    <i v-if="tbPre < 0" class="iconfont icon-changjiantou-xia"></i>
                    <span>{{tbPre}}%</span>
                    ）
                </span>
            </div>
            <div class="db" v-if="chatTargetOption.contrastData.contrastTime">
                <span class="field-name">对比日期：</span>
                <span>{{chatTargetOption.contrastData.db}}</span>
                <span style="margin-left: 10px;">数量：{{chartData.dbCount}}</span>
                <span v-if="chartData.dbCount != 0 && chartData.dbCount">
                    （
                    <i v-if="dbPre > 0" class="iconfont icon-changjiantou-xia up"></i>
                    <i v-if="dbPre < 0" class="iconfont icon-changjiantou-xia"></i>
                    <span>{{dbPre}}%</span>
                    ）
                </span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TargetChart',
    props: ['allFieldList', 'chartData', 'chatTargetOption', 'heigRight'],
    data() {
        return {
            myChart: null,
            loading: true,
            targetData: null,
            targetOption: null
        }
    },
    watch: {
        chatTargetOption: {
            deep: true, // 深度监听
            handler(newVal, oldVal) {
                if (newVal) {
                    this.targetOption = newVal
                }
            }
        },
        chartData: {
            deep: true, // 深度监听
            handler(newVal, oldVal) {
                if (newVal) {
                    this.targetData = newVal
                }
            }
        }
    },
    computed: {
        heightCalc() {
            return this.heigRight.substr(0, this.heigRight.length - 1) + ' - 28px)'
        },
        hbPre() {
            return ((this.targetData.total - this.chartData.hbCount) / this.chartData.hbCount * 100).toFixed(2)
        },
        tbPre() {
            return ((this.targetData.total - this.chartData.tbCount) / this.chartData.tbCount * 100).toFixed(2)
        },
        dbPre() {
            return ((this.targetData.total - this.chartData.dbCount) / this.chartData.dbCount * 100).toFixed(2)
        }
    },
    mounted() {
        // this.renderChart()
    },
    beforeDestroy() {},
    methods: {
    }
}
</script>

<style scoped lang="scss">
    .target-wrap {
        padding-left: 70px;
        .name {
            font-size: 20px;
            margin-top: 20px;
            color: rgba(0, 0, 0, 0.9);
        }
        .total {
            margin-top: 10px;
            font-size: 70px;
            font-weight: 700;
            color: #387DEE;
        }
        .hb,.tb,.db {
            font-size: 20px;
            margin-top: 20px;
            color: rgba(0, 0, 0, 0.9);
        }
        .field-name {
            display: inline-block;
            width: 110px;
            margin-right: 10px;
        }
        .icon-changjiantou-xia {
            color: #00FF51;
        }
        .up {
            transform: rotate(180deg);
            color: #FF0000;
        }
    }
</style>
