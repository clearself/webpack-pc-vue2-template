<template>
    <div @click="searchBtn" :class="{'btn_box':!isReuse,'del':!isReuse, 'reuseBtn':isReuse}">
        <div v-if="!isReuse" class="ub ub-ac ub-pc btn_inner_box">
            <i v-if="icon!=''" :class="icon"></i>
            <span>{{title}}</span>
        </div>
        <div v-else>
            <el-button size="small" :icon="icon" type="danger">{{title}}</el-button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DeleteBtn',
    props: {
        title: {
            type: String,
            default: ''
        },
        icon: {
            type: String,
            default: 'el-icon-delete'
        },
        isReuse: {
            type: Boolean,
            default: (val) => Boolean(val)
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
.reuseBtn {
    display: inline-block;
}
.btn_box{
    min-width:70px;
    width:auto;
    display: inline-block;
    padding-left: 8px;
    height:30px;
    line-height: 30px;
    opacity:0.9;

    background-image: url(./images/deleteBg.png);
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
}

</style>
