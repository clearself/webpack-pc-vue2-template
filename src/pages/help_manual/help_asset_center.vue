<template>
    <div class="help-contain">
        <div class="headline">1 资产中心</div>
        <div class="text">资产中心模块可实现对客户资产的入库、资产风险的全周期管理，承载企业架构中资产管理角色。可以通过资产的详细视图查看资产最近的相关日志以及事件信息。资产包含资产概览、资产信息库、资产发现、业务系统管理、安全域管理、网段管理、映射管理、拓扑管理、资产配置和标签管理，实现对资产全方位管理，形成大的资产台帐。</div>
        <div class="headline-two">1.1 资产概览</div>
        <div class="text">资产概览页面展示的是对资产从不同维度展示的统计信息。包括登记资产量、未登记资产量、业务系统量、安全域、资产类型分布、安全域资产分布、业务系统资产、漏洞资产TOP10、情报资产TOP10、事件资产TOP10等维度。</div>
        <div class="headline-two">1.2 资产信息库</div>
        <div class="text">资产信息库从资产类型、业务系统、组织架构、安全域等四个视角展示了对资产的统计信息。</div>
        <div class="headline-two">1.2.1 具体的使用步骤</div>
        <div class="text">点击【添加资产】按钮可添加相应的资产信息，业务系统信息在业务系统列表菜单中维护，所属安全域在安全域管理菜单中维护，设备类型在资产配置-类型管理中进行维护，厂商在系统管理-厂商管理中维护，资产标签在标签管理中维护。</div>
        <div class="headline-two">1.3 业务系统列表</div>
        <div class="text">对资产所属的业务系统进行统一的管理。</div>
        <div class="headline-two">1.4 安全域管理</div>
        <div class="text">对资产所属的安全域进行管理，但是这里的安全域要客户本身有自己的安全域系统。</div>
        <!-- eslint-disable-next-line no-tabs -->
        <div class="headline-two">1.5	映射管理</div>
        <div class="text">映射管理主要是把内网的IP地址映射的外网，保证了内网的安全性。</div>
        <!-- eslint-disable-next-line no-tabs -->
        <div class="headline-two">1.6	资产配置</div>
        <div class="headline-two">1.6.1 类型管理</div>
        <div class="text">对资产类型进行管理，可自定义资产类型。</div>
        <div class="headline-two">1.6.2 属性管理</div>
        <div class="text">添加资产时，如果资产的字段不能满足要求可自定义资产的属性。可按照资产的类型进行资产的属性的定义，目前支持7种属性的类型。属性定义以后，在新增和编辑资产时显示自定义的属性字段。</div>
        <!-- eslint-disable-next-line no-tabs -->
        <div class="headline-two">1.7	资产发现</div>
        <div class="text">目前该模块还处于开发阶段，暂不支持。</div>
        <!-- eslint-disable-next-line no-tabs -->
        <div class="headline-two">1.8	拓扑管理</div>
        <div class="text">该模块支持上传拓扑图，暂不支持自动绘制拓扑图。</div>
        <!-- eslint-disable-next-line no-tabs -->
        <div class="headline-two">1.9	网段管理</div>
        <div class="text">对网段的管理和维护。</div>
        <div class="headline-two">1.10 标签管理</div>
        <div class="text">对资产进行打标签的操作，可以建立标签组，新建资产时选择相应的标签。</div>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
@import './help_manual.scss';
</style>
