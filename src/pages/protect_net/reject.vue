<template>
    <div class="reject-row">
        <div class="reject" :class="{'active':item.isSelected, small:list.length <= 10,middle:list.length >10 && list.length <= 30, big: list.length >=30 }" v-for="(item,index) in list" :key="index" @click="rejectClick(item)">
            <!-- {{item.color==''?'其他':''}} -->
            <i class="iconfont icon-zuoxi" :style="{'font-size': getFontSize(list.length), color:item.color==''?'':item.color}"></i>
            <p v-if="item.name" class="text-seats" :style="{scale: getScale(list.length)}">{{textSeats(item.name)}}</p>
            <p v-else class="text-seats" :style="{scale: getScale(list.length)}">{{item.color==''?'':''}}</p>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Reject',
    props: ['list'],

    data() {
        return {
            ids: []
        }
    },
    mounted() {

    },
    methods: {
        getScale(num) {
            if (num <= 10) {
                return 1
            } else if (num > 10 && num <= 30) {
                return 0.75
            } else if (num >= 30) {
                return 0.5
            }
        },
        getFontSize(num) {
            if (num <= 10) {
                return '55px'
            } else if (num > 10 && num <= 30) {
                return '34px'
            } else if (num >= 30) {
                return '30px'
            }
        },
        textSeats(str) {
            if (str.length) {
                return str.slice(0, 2)
            }
        },
        rejectClick(item) {
            console.log(111111)
            this.$emit('click', item)
        },
        multipleSelection(item) {
            this.$emit('multipleSelect', item)
            console.log(item)
            //
        },
        singleClick() {
            this.$emit('multipleSelect', this.ids)
        }
    }
}
</script>

<style lang="scss" scoped>
    .reject-row{
        font-size:0;
        white-space:nowrap;
    }
    .reject.big{
        width:30px;
        height:30px;
        vertical-align: top;
        display: inline-block;
        // border:1px dashed #A2B7D2;
        text-align: center;
        line-height: 20px;
        font-size:14px;
        margin-left: -1px;
        margin-top: -1px;
        color:#A2B7D2;
        cursor: pointer;
    }
    .reject.middle{
        width:41px;
        height:41px;
        vertical-align: top;
        display: inline-block;
        // border:1px dashed #A2B7D2;
        text-align: center;
        line-height: 41px;
        font-size:28px;
        margin-left: -1px;
        margin-top: -1px;
        color:#A2B7D2;
        cursor: pointer;
    }
    .reject.small{
        width:62px;
        height:62px;
        vertical-align: top;
        display: inline-block;
        // border:1px dashed #A2B7D2;
        text-align: center;
        line-height: 62px;
        font-size:42px;
        margin-left: -1px;
        margin-top: -1px;
        color:#A2B7D2;
        cursor: pointer;
    }
    .reject.active{
        background-color: rgba(20,128,255,0.2)!important;
        font-size:0;
    }
    .reject {
        position: relative;
    }
    .text-seats {
        position: absolute;
        font-size: 16px;
        width: 100%;
        height: 100%;
        top: 0%;
        text-align: center;
        color: #fff;
    }
</style>
