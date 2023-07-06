<template>
    <div class="help-contain">
        <div class="headline">5 标签管理</div>
        <div class="headline-two">5.1 标签名称</div>
        <img class="img-width" src="../../assets/img/help/label1.png" alt="">
        <!-- eslint-disable-next-line no-tabs -->
        <div class="headline-two">5.1.1	简介</div>
        <div class="text">平台内置一套标准的事件名称字段，可以将其他设备的事件字段进行相关映射。该模块默认标准为出场内置，一般通过升级包方式进行更新，但如果有特殊情况也可以通过自定义进行添加。</div>
        <!-- eslint-disable-next-line no-tabs -->
        <div class="headline-two">5.1.2	使用</div>
        <div class="text">特殊情况，点击右上角添加标签，进行自定义标签修改及添加。（一般情况，不建议进行自定义添加，推荐使用升级包方式进行更新）</div>
        <div class="headline-two">5.2 标签管理</div>
        <img class="img-width" src="../../assets/img/help/label2.png" alt="">
        <!-- eslint-disable-next-line no-tabs -->
        <div class="headline-two">5.2.1	简介</div>
        <div class="text">将其他安全设备日志中的事件名称，映射到平台内置的标签名称中，方便平台规则调用。如果标签管理中没有相关产品，一般建议，客户将该产品日志事件syslog字段发送于我方专业分析师。待分析师完成分类后，再进行更新升级便可。如果为特殊情况，也可以进行自定义编写。</div>
        <!-- eslint-disable-next-line no-tabs -->
        <div class="headline-two">5.2.2	使用</div>
        <img class="img-width" src="../../assets/img/help/label3.png" alt="">
        <div class="text">自定义，点击添加标签，标签内容输入安全设备的事件名称。标签名称支持模糊选择，选择相应的内置标签即可。</div>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
    @import './help_manual.scss';
</style>
