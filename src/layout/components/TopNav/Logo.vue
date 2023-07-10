<template>
    <div class="logo ub ub-pc ub-ac">
        <img :src="'/api/base-server/file/download' + encodeURI(encodeURI($store.state.common.logoAddress))  + '?token=' + this.$getlocalStorage('initInfo').user.token" alt="">
        <h2>{{$store.state.common.systemName}}</h2>
    </div>
</template>

<script>
export default {
    name: 'Logo'
}
</script>

<style scoped lang="scss">
img {
    width: 36px;
    height: 36px;
    margin-right: 16px;
}
h2 {
    font-size: 20px;
    font-weight: normal;
    @include themeify {
        color: themed('top-nav-logo-text-color');
    }
}

</style>
