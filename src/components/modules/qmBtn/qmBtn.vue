<template>
    <div class="btn_wapper" :class="[type]" @click="searchBtn">
        <div class="btn_inner">
            <i v-if="icon!=''"  :class="icon"></i>
            <span>{{title}}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'QmBtn',
    props: {
        title: {
            type: String,
            default: ''
        },
        icon: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: 'add'
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
.btn_wapper{
    min-width:70px;
    width:auto;
    text-align: center;
    display: inline-block;
    padding:0 10px;
    height:30px;
    background-image: url(./images/add_pt.png);
    background-repeat: no-repeat;
    background-position: 0 0;
    background-size:100% 100%;
}
.btn_inner{
    cursor:pointer;
    display: inline-block;
    height:30px;
    line-height: 27px;
    opacity: .8;
    font-size:0;
    i{
        font-size:12px;
        color: #fff;
        transition: all .3s;
        margin-right:5px;
    }
    span{
        font-size:12px;
        color: #fff;
        transition: all .3s;
    }
    &:hover {
        opacity: 1;
        span {
            color: #fff;
        }
        i {
            color: #fff;
        }
    }
}

.btn_wapper.add{
    background-image: url(./images/add_pt.png);
}
.btn_wapper.del{
    background-image: url(./images/del_btn.png);
}
</style>
