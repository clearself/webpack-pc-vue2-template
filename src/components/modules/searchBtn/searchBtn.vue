<template>
    <div class="btn_box"  @click="searchBtn" :class="{'isAggary':bgc==='no_aggary','onlyRead':loading === true}">
        <div class="btn_inner_box ub">
            <div v-if="loading" class="el-icon-loading"></div>
            <p>{{title}}</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SearchBtn',
    props: {
        title: {
            type: String,
            default: ''
        },
        bgc: {
            type: String,
            default: ''
        },
        loading: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {}
    },
    mounted() {

    },
    methods: {
        searchBtn() {
            this.$emit('click')
        }
    }
}
</script>

<style lang="scss" scoped>
.btn_box.onlyRead {
    pointer-events: none
}
.btn_box{
    width:80px;
    display: inline-block;
    height:30px;
    line-height: 30px;

    background-image: url(./images/searchBg.png);
    background-repeat: no-repeat;
    background-position: right 0;
    background-size:100% 30px;
    opacity: .9;
}
.btn_box:hover {
    opacity: 1;
}
.btn_box.isAggary{
    background-image: url(./images/no_aggary.png);
}
.btn_inner_box{
    cursor:pointer;
    height:30px;
    position: relative;

    p{
        width: 80px;
        text-align: center;
        font-size:12px;
        color:#fff;
    }
    .el-icon-loading {
        width: 12px;
        height: 12px;
        line-height: 12px;
        color:#fff;
        position: absolute;
        top:  10px;
        left: 4px;
        // margin-top: 10px;
        // margin-left: 4px;
    }
}
</style>
