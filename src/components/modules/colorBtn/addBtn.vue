<template>
    <div class="btn_box add" :class="{'dis-add' :disabled,'onlyRead':loading === true}" @click="searchBtn">
        <div class="ub ub-ac ub-pc btn_inner_box">
            <div v-if="loading" class="el-icon-loading"></div>
            <i v-if="icon!=''"  :class="icon"></i>
            <span>{{title}}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AddBtn',
    props: {
        title: {
            type: String,
            default: ''
        },
        icon: {
            type: String,
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
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
    min-width:70px;
    width:auto;
    display: inline-block;
    padding-left: 8px;
    height:30px;
    line-height: 30px;
    opacity: 0.9;

    background-image: url(./images/addBg.png);
    background-repeat: no-repeat;
    background-position: right 0;
    background-size:100% 30px;
}
.btn_box:hover {
    opacity: 1;
}
.btn_inner_box{
    cursor:pointer;
    height:30px;
    position: relative;
    i{
        font-size:12px;
        color:#fff;
        transition: all .3s;
        margin-right: 5px;
    }
    span{
        margin:0 10px 0 0;
        font-size:12px;
        color:#fff;
        transition: all .3s;
    }
     .el-icon-loading {
        width: 12px;
        height: 12px;
        line-height: 12px;
        color:#fff;
        position: absolute;
        top:  9px;
        left: -5px;
    }
}
.dis-add {
    cursor: not-allowed;
    opacity: .5 !important;
    & div, i, span {
        cursor: not-allowed;
    }
}
</style>
