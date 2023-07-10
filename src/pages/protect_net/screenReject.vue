<template>
    <div class="reject-row">
        <div class="reject" :class="{'active':item.isSelected, small:list.length <= 10,middle:list.length >10 && list.length <= 30, big: list.length >=30 }" v-for="(item,index) in list" :key="index" :style="{color:item.color==''?'none':item.color}">
            <i v-if="item.color!=''" class="iconfont icon-zuowei"></i>
        </div>
    </div>
</template>
<script>
export default {
    name: 'LargeReject',
    props: ['list'],
    data() {
        return {

        }
    },
    mounted() {

    },
    methods: {

    }
}
</script>

<style lang="scss" scoped>
    .reject-row{
        font-size:0;
        white-space:nowrap;
    }
    /*.reject{
        width:20px;
        height:20px;
        vertical-align: top;
        display: inline-block;
        border:1px dashed rgba(0,0,0,0);
        text-align: center;
        line-height: 8px;
        font-size:30px;
        margin-left: -1px;
        margin-top: -1px;
        color:#007aff;
    }*/
    .reject.big{
        width:20px;
        height:20px;
        vertical-align: top;
        display: inline-block;
        border:1px dashed #007aff;
        text-align: center;
        line-height: 8px;
        font-size:30px;
        margin-left: -1px;
        margin-top: -1px;
        color:#007aff;

        i {
            font-size: 16px;
        }
    }
    .reject.middle{
        width:40px;
        height:40px;
        vertical-align: top;
        display: inline-block;
        border:1px dashed #007aff;
        text-align: center;
        line-height: 16px;
        font-size:60px;
        margin-left: -1px;
        margin-top: -1px;
        color:#007aff;
        i {
            font-size: 34px;
        }
    }
    .reject.small{
        width:60px;
        height:60px;
        vertical-align: top;
        display: inline-block;
        border:1px dashed #007aff;
        text-align: center;
        line-height: 24px;
        font-size:90px;
        margin-left: -1px;
        margin-top: -1px;
        color:#007aff;
        i {
            font-size: 50px;
        }
    }

</style>
