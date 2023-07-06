<template>
    <div class="switch-wrapper" :class="{'yes':status===1,'no':status===0}"  @click="deploymentEnvironment">
        <div class="ub ub-ac ub-pj">
            <div style="margin-left: -1px">是</div>
            <div>否</div>
        </div>
        <div class="circle"></div>
    </div>
</template>

<script>
export default {
    name: 'SwitchBtn',
    props: {
        status: {
            type: Number,
            default: 1
        }
    },
    data() {
        return {}
    },
    mounted() {

    },
    methods: {
        deploymentEnvironment() {
            this.$emit('click')
        }
    }
}
</script>

<style lang="scss" scoped>
.switch-wrapper{
    width:56px;
    height:20px;
    position: relative;
    cursor: pointer;
    margin-left: 10px;
}
.switch-wrapper>div:nth-child(1){
    width:56px;
    height:20px;
    background-color: #001a2c;
    box-shadow: inset 0px 0px 7px 0px #000000;
    border-radius: 14px;
    div{
        font-size: 12px;
        line-height: 20px;
        padding:0 8px;
    }
    >div:nth-child(1){
        color: #00d7ff;
        opacity: 0.6;
    }
    >div:nth-child(2){
        color: #ffaa47;
        opacity: 0.6;
    }
}
.switch-wrapper>div:nth-child(2){
    width: 20px;
    height: 20px;
    position: absolute;
    left:0;
    top:50%;
    margin-top: -10px;
    border-radius:100%;
}
.switch-wrapper.yes>div:nth-child(2){
    animation: moveone 0s linear forwards;
}
.switch-wrapper.no>div:nth-child(2){
    animation: _moveone 0s linear forwards;
}
@keyframes moveone {
    0% {
        background-color: #fa941c;
        box-shadow: 0px 0px 6px 0px #9c5603;
        left: 0;
    }

    100% {
        background-color: #1cd7fa;
        box-shadow: 0px 0px 6px 0px #058fa9;
        left: 36px;
    }
}
@-webkit-keyframes moveone {
    0% {
        background-color: #fa941c;
        box-shadow: 0px 0px 6px 0px #9c5603;
        left: 0;
    }

    100% {
        background-color: #1cd7fa;
        box-shadow: 0px 0px 6px 0px #058fa9;
        left: 36px;
    }
}
@keyframes _moveone {
    0% {
        background-color: #1cd7fa;
        box-shadow: 0px 0px 6px 0px #058fa9;
        left: 36px;
    }

    100% {
        background-color: #fa941c;
        box-shadow: 0px 0px 6px 0px #9c5603;
        left: 0;;
    }
}
@-webkit-keyframes _moveone {
    0% {
        background-color: #1cd7fa;
        left: 36px;
    }

    100% {
        background-color: #fa941c;
        left: 0;
    }
}
@keyframes moveone_white {
    0% {
        background-color: #fff;
        box-shadow: 0px 0px 10px 0px #e5e5e5;
        left: 1px;
    }

    100% {
        background-color: #fff;
        box-shadow: 0px 0px 10px 0px #e5e5e5;
        left: 37px;
    }
}
@-webkit-keyframes moveone_white {
    0% {
        background-color: #fff;
        box-shadow: 0px 0px 10px 0px #e5e5e5;
        left: 1px;
    }

    100% {
        background-color: #fff;
        box-shadow: 0px 0px 10px 0px #e5e5e5;
        left: 37px;
    }
}
@keyframes _moveone_white {
    0% {
        background-color: #fff;
        box-shadow: 0px 0px 10px 0px #e5e5e5;
        left: 37px;
    }

    100% {
        background-color: #fff;
        box-shadow: 0px 0px 10px 0px #e5e5e5;
        left: 1px;
    }
}
@-webkit-keyframes _moveone_white {
    0% {
        background-color: #fff;
        box-shadow: 0px 0px 10px 0px #e5e5e5;
        left: 37px;
    }

    100% {
        background-color: #fff;
        box-shadow: 0px 0px 10px 0px #e5e5e5;
        left: 1px;
    }
}
.white-theme .switch-wrapper.yes>div:nth-child(2){
    animation: moveone_white 0s linear forwards;
}
.white-theme .switch-wrapper.no>div:nth-child(2){
    animation: _moveone_white 0s linear forwards;
}
</style>
