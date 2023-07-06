<template>
    <div class="help-contain">
        <div class="headline">2 工单管理</div>
        <div class="headline-two">2.1 工单模板</div>
        <div class="headline-two">2.1.1 名词解释：</div>
        <div class="text">发起对象：下拉选择工单类型；</div>
        <div class="text">发起人范围：谁可以使用本工单模板；</div>
        <div class="text">触发条件：前置触发条件，当有多个模板时，便于快速精准选择，直接体现在下拉结果中；</div>
        <div class="headline-two">2.1.2 具体的使用步骤</div>
        <div class="text">
            ☆ 开始、结束节点只能有一个，所有节点必须选择要做的事、处理业务的人、选填描述和超时提醒功能；
        </div>
        <div class="text">
            ☆
            审批/会签节点必须一进二出（一条流入线，通过和不通过的流出线）自动节点流转设置提醒或字段变更，分支可一进多出（一条流入线，多个流出线），并行-多个流程同时流转。可对不同的流程进行阶段划分。
        </div>
        <div class="text">☆ 草稿：模板设置过程中保存至草稿</div>
        <div class="headline-two">2.1.3 触发发起工单的模块：</div>
        <div class="text">☆ 事件列表-更多-发起事件工单；</div>
        <div class="text">☆ 漏洞管理-更多-发起漏洞工单；</div>
        <div class="text">☆ 受害资产分析-发起受害资产工单；</div>
        <div class="text">☆ 攻击者分析-发起攻击者工单；</div>
        <div class="text">☆ 钓鱼邮件/事件管理-发起钓鱼邮件工单；</div>
        <div class="headline-two">2.1.4 常见的问题；</div>
        <div class="text">流程节点及流程线匹配错误，或未选择节点做的事情、未选节点处理人。</div>
        <div class="headline-two">2.2 全部工单</div>
        <div class="text">平台内全部工单展示，不分用户角色。</div>
        <div class="headline-two">2.2.1 具体的使用步骤；</div>
        <div class="text">可导出全部工单数据，状态已完成的工单可以删除，状态进行中的工单可撤销流程。</div>
        <div class="headline-two">2.2.2 常见的问题；</div>
        <div class="text">仅限工单发起人对工单进行删除、撤销操作。</div>
        <div class="headline-two">2.3 工单任务</div>
        <div class="text">任务根据当前登录用户获取待办、已办、发起的工单，查看进行节点操作</div>
        <div class="headline-two">2.3.1 具体的使用步骤</div>
        <div class="text">☆ 待办工单：接收当前用户待处理的任务，工作台根据单个工单跳转至此；</div>
        <div class="text">☆ 已办工单：当前用户已完成操作的工单；</div>
        <div class="text">☆ 发起工单：本人可发起自定义类型工单、不使用模板工单两种；</div>
        <div class="headline-two">2.3.2 常见的问题</div>
        <div class="text">☆ 工单描述添加文本、图片、文件等格式，任务详情中跟踪体现；</div>
        <div class="text">☆ 选择不使用模板，确定人员范围定向处理指定流程，流程已指定；</div>
        <div class="text">☆ 规则中可设置自动发起工单，发起的工单分配至节点处理人待办任务下。</div>
        <div class="headline-two">2.4 工单类型</div>
        <div class="text">内置五种工单类型，可自定义添加。</div>
        <div class="headline-two">2.4.1 具体的使用步骤；</div>
        <div class="text">工单模板引用工单类型，封装了事件和漏洞类型字段，在模板内容-操作对象中体现。</div>
        <div class="headline-two">2.4.2 常见的问题</div>
        <div class="text">自定义类型添加，模板中引用只有一个备注字段，暂无其他字段可选。</div>
    </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
@import "./help_manual.scss";
</style>
