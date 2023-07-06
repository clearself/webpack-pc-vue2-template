<template>
    <div class="help-contain">
        <div class="headline">3 规则管理</div>
        <div class="text">规则管理模块，包括分析规则管理、资源池管理、攻击结果管理、事件类型管理以及创建模拟数据。</div>
        <div class="headline-two">3.1 模块简介</div>
        <table border="1"  cellspacing="0" cellpadding="20">
            <tr>
                <td>分析规则管理</td>
                <td>新建规则或变更规则</td>
            </tr>
            <tr>
                <td>资源池管理</td>
                <td>新建规则或变更规则需要引用的一组需要检测的元素的集合</td>
            </tr>
            <tr>
                <td>攻击结果管理</td>
                <td>新建规则或变更规则定义的被攻击结果，作为展示项，显示在事件管理模块里的事件列表中。</td>
            </tr>
            <tr>
                <td>事件类型管理</td>
                <td>新建规则或变更规则定义的被攻击类型，作为展示项，显示在事件管理模块里的事件列表中。</td>
            </tr>
            <tr>
                <td>创建模拟数据</td>
                <td>测试已经开启的规则是否事件</td>
            </tr>
        </table>
        <div class="headline-two">3.2 常见步骤</div>
        <table border="1"  cellspacing="0" cellpadding="20">
            <tr>
                <td>使用难度</td>
                <td>标签管理</td>
                <td>事件类型管理</td>
                <td>攻击结果管理</td>
                <td>资源池管理</td>
                <td>分析规则管理</td>
                <td>创建模拟数据</td>
                <td>事件列表</td>
            </tr>
            <tr>
                <td>L1</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>1</td>
                <td>2</td>
                <td>3</td>
            </tr>
            <tr>
                <td>L2</td>
                <td></td>
                <td></td>
                <td></td>
                <td>1</td>
                <td>2</td>
                <td>3</td>
                <td>4</td>
            </tr>
            <tr>
                <td>L3</td>
                <td></td>
                <td></td>
                <td>1</td>
                <td>2</td>
                <td>3</td>
                <td>4</td>
                <td>5</td>
            </tr>
            <tr>
                <td>L4</td>
                <td></td>
                <td>1</td>
                <td>2</td>
                <td>3</td>
                <td>4</td>
                <td>5</td>
                <td>6</td>
            </tr>
            <tr>
                <td>L5</td>
                <td>1</td>
                <td>2</td>
                <td>3</td>
                <td>4</td>
                <td>5</td>
                <td>6</td>
                <td>7</td>
            </tr>
        </table>
        <div class="headline-two">3.3 事件类型管理</div>
        <table border="1"  cellspacing="0" cellpadding="20">
            <tr>
                <td>事件类型</td>
                <td colspan="2">填写需要快速筛选查询的名称，点击右侧搜索按钮可以获取结果。</td>
            </tr>
            <tr>
                <td>序号</td>
                <td colspan="2">多个事件类型被添加时，序号表示x-y个事件类型被添加的次序。</td>
            </tr>
            <tr>
                <td>事件类型名称</td>
                <td colspan="2">事件类型的名字</td>
            </tr>
            <tr>
                <td rowspan="3">操作</td>
                <td>内置类型</td>
                <td>不可修改的系统内置类型，可以使用但不可变更</td>
            </tr>
            <tr>
                <td>编辑</td>
                <td>变更修改已有的事件类型名称</td>
            </tr>
            <tr>
                <td>删除</td>
                <td>变更删除已有的事件类型名称</td>
            </tr>
        </table>
        <!-- eslint-disable-next-line no-tabs -->
        <div class="headline-two">3.3.1	创建一个事件类型</div>
        <div class="text">概述：点击添加类型，在已弹出的窗口中输入待添加的事件类型，结果显示在列表内容中，请尝试添加2项事件类型，webshell文件上传与端口扫描，将在新建规则时使用。</div>
        <img class="img-width" src="../../assets/img/help/rule_manage1.png" alt="">
        <!-- eslint-disable-next-line no-tabs -->
        <div class="headline-two">3.4	攻击结果管理</div>
        <table border="1"  cellspacing="0" cellpadding="20">
            <tr>
                <td>页面顶部的攻击结果</td>
                <td colspan="2">填写需要快速筛选查询的名称，点击右侧搜索按钮可以获取结果。</td>
            </tr>
            <tr>
                <td>添加结果</td>
                <td colspan="2">可以添加需要的攻击结果。</td>
            </tr>
            <tr>
                <td>序号</td>
                <td colspan="2">多个攻击结果被添加时，序号表示x-y个攻击结果被添加的次序。</td>
            </tr>
            <tr>
                <td>页面中部的攻击结果</td>
                <td colspan="2">攻击结果的名字</td>
            </tr>
            <tr>
                <td rowspan="2">操作</td>
                <td>编辑</td>
                <td>变更修改已有的攻击结果名称</td>
            </tr>
            <tr>
                <td>删除</td>
                <td>变更删除已有的事件类型名称</td>
            </tr>
        </table>
        <div class="headline-two">3.4.1 创建一个攻击结果</div>
        <div class="text">概述：点击添加类型，在已弹出的窗口中输入待添加的攻击结果，结果显示在列表内容中，请尝试添加2项攻击结果，持久化与信息泄露，将在新建规则时使用。</div>
        <img class="img-width" src="../../assets/img/help/rule_manage2.png" alt="">
        <div class="headline-two">3.5 资源池管理</div>
        <table border="1"  cellspacing="0" cellpadding="20">
            <tr>
                <td rowspan="12">资源池界面</td>
                <td>资源池名称与创建时间</td>
                <td colspan="2">填写需要快速筛选查询的名称和时间，点击右侧搜索按钮可以获取结果。</td>
            </tr>
            <tr>
                <td>新增资源池</td>
                <td colspan="2">添加需要的集合的名称</td>
            </tr>
            <tr>
                <td>删除</td>
                <td colspan="2">列表内容下侧的方框在被勾选时，点击页面右侧顶部的橙色删除按钮，可以批量删除</td>
            </tr>
            <tr>
                <td>序号</td>
                <td colspan="2">多个资源池名称被添加时，序号表示x-y个资源池名称被添加的次序。</td>
            </tr>
            <tr>
                <td>资源池名称</td>
                <td colspan="2">资源池的名字</td>
            </tr>
            <tr>
                <td>描述</td>
                <td colspan="2">创建资源池或变更资源时添加一段描述</td>
            </tr>
            <tr>
                <td>资源池内容</td>
                <td colspan="2">数值x-y表示当前资源池集合包含的元素的总数</td>
            </tr>
            <tr>
                <td>描述</td>
                <td colspan="2">创建资源池或变更资源时添加一段描述</td>
            </tr>
            <tr>
                <td>资源池内容</td>
                <td colspan="2">数值x-y表示当前资源池集合包含的元素的总数</td>
            </tr>
            <tr>
                <td>创建日期</td>
                <td colspan="2">表示该资源池创建的时间</td>
            </tr>
            <tr>
                <td rowspan="2">操作</td>
                <td>编辑</td>
                <td>变更修改已有的资源池名称和其描述</td>
            </tr>
            <tr>
                <td>删除</td>
                <td>变更删除当前行的资源池</td>
            </tr>
            <tr>
                <td rowspan="8">资源界面</td>
                <td>资源名称与创建时间</td>
                <td colspan="2">填写需要快速筛选查询的名称和时间，点击右侧搜索按钮可以获取结果。</td>
            </tr>
            <tr>
                <td>新增资源</td>
                <td colspan="2">添加需要的集合的n个值，弹出窗口中右侧的+符号表示批量增加。</td>
            </tr>
            <tr>
                <td>删除</td>
                <td colspan="2">列表内容下侧的方框在被勾选时，点击页面右侧顶部的橙色删除按钮，可以批量删除。</td>
            </tr>
            <tr>
                <td>序号</td>
                <td colspan="2">多个资源名称被添加时，序号表示x-y个资源名称被添加的次序。</td>
            </tr>
            <tr>
                <td>资源内容</td>
                <td colspan="2">资源的名字</td>
            </tr>
            <tr>
                <td>创建日期</td>
                <td colspan="2">表示该资源创建的时间</td>
            </tr>
            <tr>
                <td rowspan="2">操作</td>
                <td>编辑</td>
                <td>变更修改已有的资池名称</td>
            </tr>
            <tr>
                <td>删除</td>
                <td>变更删除当前行的资源</td>
            </tr>
        </table>
        <!-- eslint-disable-next-line no-tabs -->
        <div class="headline-two">3.5.1	创建一个资源池</div>
        <div class="text">概述：点击新增资源池，在已弹出的窗口中输入待添加的资源池名称和资源池描述，结果显示在列表内容中，请尝试添加1项资源池，并在创建成功后，点击资源内容下方的0值，进入资源编辑页面。进入资源编辑页面以后， 点击新增资源，在已弹出的窗口中输入待添加的资源内容，并通过+符号增加多项，请尝试添加3资源内容，10.0.0.123、172.16.0.123、192.168.0.123，将在新建规则时使用。</div>
        <img class="img-width" src="../../assets/img/help/rule_manage3.png" alt="">
        <div class="headline-two">3.6 分析规则管理</div>
        <!-- eslint-disable-next-line no-tabs -->
        <div class="headline-two">3.6.1	分析规则管理（A）</div>
        <div class="text">概述：点击规则管理中的分析规则管理模块，会出现2部的展示内容，第1部分为页面左侧的规则分组，第2部分为页面右侧的规则筛选查询，和规则创建编辑。整个部分，前者的作用是将已经创建的规则分箱管理，后者的作用是展示分箱中所含的具体规则，以对其进行直观的新建，或者变更。</div>
        <table border="1"  cellspacing="0" cellpadding="20">
            <tr>
                <td rowspan="24">分析规则管理界面</td>
                <td rowspan="3">页面左侧</td>
                <td rowspan="3">分组</td>
                <td>新增</td>
                <td>根节点新增为1级组，进入1级组点击新增时为2级组，可以创建n级子孙组，删除父级组时子孙组同时消失。</td>
            </tr>
            <tr>
                <td>编辑</td>
                <td>变更修改规则组的名称</td>
            </tr>
            <tr>
                <td>删除</td>
                <td>变更删除当前指定的规则组，若当前规则组为父组，则子孙组同时被删除。</td>
            </tr>
            <tr>
                <td rowspan="5">页面右侧顶部</td>
                <td>规则名称</td>
                <td colspan="2">填写需要快速筛选查询的规则名称，点击右侧搜索按钮可以获取结果。</td>
            </tr>
            <tr>
                <td>状态</td>
                <td colspan="2">填写需要快速筛选查询的状态，点击右侧搜索按钮可以获取结果。</td>
            </tr>
            <tr>
                <td>创建人</td>
                <td colspan="2">填写需要快速筛选查询的创建人，点击右侧搜索按钮可以获取结果</td>
            </tr>
            <tr>
                <td>修改人</td>
                <td colspan="2">填写需要快速筛选查询的修改人，点击右侧搜索按钮可以获取结果。</td>
            </tr>
            <tr>
                <td>规则编号</td>
                <td colspan="2">填写需要快速筛选查询的规则编号，点击右侧搜索按钮可以获取结果。</td>
            </tr>
            <tr>
                <td  rowspan="4">页面右侧中部</td>
                <td>新建规则</td>
                <td colspan="2">新建一条规则</td>
            </tr>
            <tr>
                <td>启用规则</td>
                <td colspan="2">启用一条处于关闭状态的规则</td>
            </tr>
            <tr>
                <td>停用规则</td>
                <td colspan="2">停用一条处于启用状态的规则</td>
            </tr>
            <tr>
                <td>删除规则</td>
                <td colspan="2">删除一条规则</td>
            </tr>
            <tr>
                <td rowspan="12">列表内容部分</td>
                <td>编号</td>
                <td colspan="2">多个规则被添加时，序号表示x-y个规则被添加的次序。</td>
            </tr>
            <tr>
                <td>规则名称</td>
                <td colspan="2">规则的名字</td>
            </tr>
            <tr>
                <td>规则分组</td>
                <td colspan="2">规则当前的所属分组</td>
            </tr>
            <tr>
                <td>最近7天事件趋势</td>
                <td colspan="2">规则被成功触发的7天的数据趋势图</td>
            </tr>
            <tr>
                <td>事件量</td>
                <td colspan="2">规则总计的事件数量</td>
            </tr>
            <tr>
                <td>创建日期</td>
                <td colspan="2">规则的创建时间</td>
            </tr>
            <tr>
                <td>是否启用</td>
                <td colspan="2">规则的开启关闭状态，点击按钮可以控制开闭。</td>
            </tr>
            <tr>
                <td>创建人</td>
                <td colspan="2">规则的创建用户</td>
            </tr>
            <tr>
                <td>修改人</td>
                <td colspan="2">最后一次修改过该规则的用户</td>
            </tr>
            <tr>
                <td rowspan="3">操作</td>
                <td>编辑</td>
                <td>变更修改已有的规则</td>
            </tr>
            <tr>
                <td>复制并新建</td>
                <td>复制已有规则并在其基础之上进行规则创建</td>
            </tr>
            <tr>
                <td>删除</td>
                <td>变更删除已有的规则</td>
            </tr>
        </table>
        <!-- eslint-disable-next-line no-tabs -->
        <div class="headline-two">3.6.2	分析规则管理（B）</div>
        <div class="text">概述：点击规则管理中的分析规则管理模块，点击右侧的新建规则，或者点击已经创建规则右侧的编辑按钮，或者点击复制并新建，将进入规则的编辑页面，此时会出现3个部分的编辑内容。第1部分基础信息，提供规则在分析规则管理模块中，列表内容里，展示的名称，以及为其选择规则适合的分组，和控制规则是否作为其他已有规则的子孙规则。第2部分条件信息，提供控制规则的判断过程，请见分析规则管理（C）的描述。第3部分输出信息，调整是否在规则生效时归并，以及控制展示在事件列表中的展示结果，和确定是否准备在生效时自动发起工单。第1-3部的待填选信息中，标识为红色星号的为必填项，其余为可选项，必填项完整时允许提交，可选项缺失时无碍。第4部通知信息，控制规则生效时通知组织的对象与通讯方式。</div>
        <table border="1"  cellspacing="0" cellpadding="20">
            <tr>
                <td rowspan="25">新建规则&编辑规则界面</td>
                <td rowspan="5">基础信息</td>
                <td>规则名称</td>
                <td colspan="2">规则在分析规则管理模块中的列表部分的展示名字</td>
            </tr>
            <tr>
                <td>规则描述</td>
                <td colspan="2">创建规则或变更规则时添加一段描述</td>
            </tr>
            <tr>
                <td>是否启用</td>
                <td colspan="2">选择当前规则编辑提交以后的默认状态为启用，或关闭状态</td>
            </tr>
            <tr>
                <td>规则继承</td>
                <td colspan="2">选择当前规则是否作为其他规则的子孙规则继承</td>
            </tr>
            <tr>
                <td>规则分组</td>
                <td colspan="2">选择当前规则适合的分组位置</td>
            </tr>
            <tr>
                <td rowspan="16">输出信息</td>
                <td rowspan="5">事件列表展示部分</td>
                <td>事件类型</td>
                <td>选择事件的类别，其中所包含的值，由事件类型管理模块控制。</td>
            </tr>
            <tr>
                <td>事件级别</td>
                <td>选择低、中低、中、中高、高等危害级别</td>
            </tr>
            <tr>
                <td>事件名称</td>
                <td>规则生效时在事件列表模块中的展示名字</td>
            </tr>
            <tr>
                <td>事件状态</td>
                <td>默认是不可变更的待确认状态，直到被事件列表模块中的更多操作菜单中的，状态变更或发起工单处理。</td>
            </tr>
            <tr>
                <td>攻击结果</td>
                <td>选择攻击的结果，其中所包含的值，由攻击结果管理模块控制。</td>
            </tr>
            <tr>
                <td rowspan="2">信息描述部分</td>
                <td>处置建议</td>
                <td>创建规则或变更规则时添加一段当前规则的处置建议描述</td>
            </tr>
            <tr>
                <td>分析过程</td>
                <td>创建规则或变更规则时添加一段当前规则的分析过程描述</td>
            </tr>
            <tr>
                <td rowspan="5">工单流转部分</td>
                <td>是否发起工单</td>
                <td>选择当前规则生效以后是否立即发起工单，仅在为是时，工单名称、优先级、工单模板、工单发起人才为必填项。</td>
            </tr>
            <tr>
                <td>工单名称</td>
                <td>工单的名字</td>
            </tr>
            <tr>
                <td>优先级</td>
                <td>选择低、中、高等工单的优先级别</td>
            </tr>
            <tr>
                <td>工单模板</td>
                <td>选择发起工单时使用的模板，具体请详见工单文档。</td>
            </tr>
            <tr>
                <td>工单发起人</td>
                <td>从下拉列表中选择工单的发起人</td>
            </tr>
            <tr>
                <td>自动封禁部分</td>
                <td>自动封禁</td>
                <td>控制规则生效时是否自动进行封禁</td>
            </tr>
            <tr>
                <td rowspan="3">归并条件部分</td>
                <td>归并时间</td>
                <td>合并x个分钟内的事件，填写分钟数值</td>
            </tr>
            <tr>
                <td>condition-1</td>
                <td>合并的条件，必须引用变量且变量对象的值需要变更为驼峰式</td>
            </tr>
            <tr>
                <td>condition-+</td>
                <td>合并的条件，当condition-1不能满足归并需要时，新增的字段框可以命名为condition-2，condition-3，condition-p等，继续填写。例如$E1.SrcIp，按源IP归并，$E1.DesIp，按目的IP归并，其中$E1表示绑定的变量名称，请根据实际情况替换</td>
            </tr>
            <tr>
                <td rowspan="3">通知信息</td>
                <td>邮件</td>
                <td colspan="2">选择规则生效时需要邮件通知的组织对象。</td>
            </tr>
            <tr>
                <td>短信</td>
                <td colspan="2">选择规则生效时需要短信通知的组织对象。</td>
            </tr>
            <tr>
                <td>蓝鲸</td>
                <td colspan="2">选择规则生效时需要蓝鲸通知的组织对象。</td>
            </tr>
            <tr>
                <td>条件信息</td>
                <td colspan="3">请见下方文档</td>
            </tr>
        </table>
        <!-- eslint-disable-next-line no-tabs -->
        <div class="headline-two">3.6.3	分析规则管理（C）</div>
        <div class="text">概述：本节内容指规则编辑页面中的条件信息部分，主要涉及到3个符号意义部分。</div>
        <div class="text">● 第1部分的计算符号，分别出现在，默认规则编辑页面条件信息的下方，和应用符号+的里面，支持AND与OR判断。</div>
        <div class="text">● 第2部分的应用符号，分别支持，网络设备警告、网络流、主机日志、历史IP、引用资产、引用情报事件，按需选择。</div>
        <div class="text">● 第3部分的通用符号，出现在点击数据源、累计以后的右侧，其中向上、向下、向内添加菜单控制新增事件的位置和条件的位置，属性菜单控制绑定的变量名称和时间次数。</div>
        <table border="1"  cellspacing="0" cellpadding="20">
            <tr>
                <td rowspan="20">新建规则和编辑规则界面符号释义</td>
                <td rowspan="2">计算符号</td>
                <td>AND</td>
                <td colspan="3">基于一个以上的条件对记录进行过滤，如果第一个条件和第二个条件都成立，and生效。</td>
            </tr>
            <tr>
                <td>OR</td>
                <td colspan="3">基于一个以上的条件对记录进行过滤，如果第一个条件和第二个条件中只要有一个成立，or生效。</td>
            </tr>
            <tr>
                <td rowspan="8">应用符号</td>
                <td rowspan="8">+</td>
                <td rowspan="6">数据源</td>
                <td>安全设备警告事件</td>
                <td>判断来自安全设备的事件时选择它</td>
            </tr>
            <tr>
                <td>网络流事件</td>
                <td>判断来自网络流的事件时选择它</td>
            </tr>
            <tr>
                <td>主机日志事件</td>
                <td>判断来自主机的事件时选择它</td>
            </tr>
            <tr>
                <td>历史IP事件</td>
                <td>判断历史IP时选择它</td>
            </tr>
            <tr>
                <td>引用资产</td>
                <td>判断是否涉及资产时候选择它</td>
            </tr>
            <tr>
                <td>引用情报</td>
                <td>判断威胁情报时选择它</td>
            </tr>
            <tr>
                <td rowspan="2">累计</td>
                <td>变量名</td>
                <td>累计数值结果的变量绑定名称</td>
            </tr>
            <tr>
                <td>数值</td>
                <td>累计数值结果的大于小于等判断</td>
            </tr>
            <tr>
                <td rowspan="10">通用符号</td>
                <td rowspan="5">属性</td>
                <td>变量名</td>
                <td colspan="2">当前事件类型的变量绑定名称</td>
            </tr>
            <tr>
                <td rowspan="2">滑动窗口</td>
                <td>时间</td>
                <td>最近多长，若干的时间内生效的次数。例如最近30min内的漏扫>=10。</td>
            </tr>
            <tr>
                <td>数量</td>
                <td>最近多少，若干的事件内生效的次数。例如最近30个事件内的漏扫>=10。</td>
            </tr>
            <tr>
                <td  rowspan="2">AFTER</td>
                <td>固定时间</td>
                <td>表示自此以后，既被调用事件被触发的若干时间以后到正无穷大时间之间。例如口令爆破成功以后的30秒后产生外联。使用时，必须填写AFTER尾部被调用的变量名称。</td>
            </tr>
            <tr>
                <td>范围时间</td>
                <td>表示自此之间，既被调用事件被触发的指定时间范围之间，例如口令爆破成功以后的30秒到60分钟产生外联。使用时，必须填写AFTER尾部被调用的变量名称。</td>
            </tr>
            <tr>
                <td>向上添加</td>
                <td colspan="3">事件级别的向上添加，在当前事件的上方添加另外一个事件。事件内级别的向上添加，在当前条件的上方添加另外一个条件。</td>
            </tr>
            <tr>
                <td>向下添加</td>
                <td colspan="3">事件级别的向下添加，在当前事件的下方添加另外一个事件。事件内级别的向下添加，在当前条件的下方添加另外一个条件。</td>
            </tr>
            <tr>
                <td>向内添加</td>
                <td colspan="3">只出现在事件级的计算符号右侧并向内添加字段名或逻辑符。</td>
            </tr>
            <tr>
                <td>删除</td>
                <td colspan="3">事件级别的删除，删除当前一个事件。事件内级别的删除，删除一个条件。</td>
            </tr>
            <tr>
                <td>注释</td>
                <td colspan="3">一段描述</td>
            </tr>
        </table>
        <div class="headline-two">3.6.4 分析规则管理（D）</div>
        <div class="text">概述：本节内容指规则编辑页面中的条件信息部分所含的字段和条件，主要有2个部分，第1是不同事件中包含的字段，其中一般字段是系统内置的，特殊字段是可以调整变更的。第2是不同事件中包含的字段能够使用的判断条件，所有的事件都可以使用这些条件。</div>
        <table border="1"  cellspacing="0" cellpadding="20">
            <tr>
                <td rowspan="18">新建规则和编辑规则界面 字段释义条件释义</td>
                <td rowspan="3">一般字段</td>
                <td>源IP字段</td>
                <td>当前所选事件类型的判断条件为源IP</td>
            </tr>
            <tr>
                <td>目的IP字段</td>
                <td>当前所选事件类型的判断条件为目的IP</td>
            </tr>
            <tr>
                <td>其他字段</td>
                <td>见字面意义</td>
            </tr>
            <tr>
                <td rowspan="3">特殊字段</td>
                <td>Lable1</td>
                <td>数据中心标签管理模块中定义的1级标签，请详见标签文档。</td>
            </tr>
            <tr>
                <td>Lable2</td>
                <td>数据中心标签管理模块中定义的2级标签，请详见标签文档。</td>
            </tr>
            <tr>
                <td>Lable3</td>
                <td>数据中心标签管理模块中定义的3级标签，请详见标签文档</td>
            </tr>
            <tr>
                <td rowspan="12">字段条件</td>
                <td>等于</td>
                <td>相等判断</td>
            </tr>
            <tr>
                <td>不等于</td>
                <td>不相等判断</td>
            </tr>
            <tr>
                <td>大于</td>
                <td>>判断</td>
            </tr>
            <tr>
                <td>小于</td>
                <!--  eslint-disable-next-line vue/no-parsing-error -->
                <td><判断</td>
            </tr>
            <tr>
                <td>大于或等于</td>
                <td>>=判断，既>和=满足1项或都满足时成立。</td>
            </tr>
            <tr>
                <td>小于或等于</td>
                <!-- eslint-disable-next-line vue/no-parsing-error -->
                <td><=判断，既<和=满足1项或都满足时成立。</td>
            </tr>
            <tr>
                <td>Matches</td>
                <td>匹配标准正则表达式，存在转义的部分需要再次转义。例如匹配屏蔽内网地址的正则表达式10\..*，在实际应用时，需要为\增加转义，最终正则为10\\..*。</td>
            </tr>
            <tr>
                <td>Not matches</td>
                <td>不匹配标准正则表达式，存在转义的部分需要再次转义</td>
            </tr>
            <tr>
                <td>Contains</td>
                <td>包含</td>
            </tr>
            <tr>
                <td>Not Contains</td>
                <td>不包含</td>
            </tr>
            <tr>
                <td>in</td>
                <td>在的判断，对象必须为资源池。</td>
            </tr>
            <tr>
                <td>Not in</td>
                <td>不在的判断，对象必须为资源池</td>
            </tr>
        </table>
        <!-- eslint-disable-next-line no-tabs -->
        <div class="headline-two">3.6.5	创建一个分组</div>
        <div class="text">概述：点击分组列表右侧的+符号，在已弹出的窗口中输入待添加的规则组名称，结果显示在全部组中。</div>
        <img class="img-width" src="../../assets/img/help/rule_manage4.png" alt="">
        <!-- eslint-disable-next-line no-tabs -->
        <div class="headline-two">3.6.6	创建一个规则（1）</div>
        <div class="text">概述：点击规则管理中的分析规则管理模块，点击右侧的新建规则，或者点击已经创建规则右侧的编辑按钮，或者点击复制并新建，将进入规则的编辑页面，按照图示，分别填写基础信息、条件信息、输出信息、通知信息部分，然后确认提交。</div>
        <div class="text">该规则的虚拟环境是，A需要事件来自安全设备的HTTP_Webshell_Jsp_ProcessBuilder_x和Lable3中所含的webshell植入，且希望事件类别显示为webshell文件上传，攻击结果显示为持久化威胁，但也需要排除来自内部渗透测试地址。请同时参考，文档前半部分关于，创建一个资源池，创建一个事件类型，创建一个攻击结果的设置，填写必要项。</div>
        <img class="img-width" src="../../assets/img/help/rule_manage5.png" alt="">
        <!-- eslint-disable-next-line no-tabs -->
        <div class="headline-two">3.6.7	创建一个规则（2）</div>
        <div class="text">概述：点击规则管理中的分析规则管理模块，点击右侧的新建规则，或者点击已经创建规则右侧的编辑按钮，或者点击复制并新建，将进入规则的编辑页面，按照图示，分别填写基础信息、条件信息、输出信息、通知信息部分，然后确认提交。</div>
        <div class="text">该规则的虚拟环境是，A需要事件来自安全设备的HTTP_Nmap_网络扫描和Lable3中所含的Nmap，且希望事件类别显示为端口扫描，攻击结果显示为信息泄露，但也需要排除来自内部渗透测试地址。同时，因为扫描的特殊性，A决定放弃扫描次数不足5次的扫描动作，但对于1小时5分20秒以内满足5次，或者大于5次的扫描，则正常事件。请同时参考，文档前半部分关于，创建一个资源池，创建一个事件类型，创建一个攻击结果的设置，填写必要项。</div>
        <img class="img-width" src="../../assets/img/help/rule_manage6.png" alt="">
        <!-- eslint-disable-next-line no-tabs -->
        <div class="headline-two">3.6.8	创建一个规则（3）</div>
        <div class="text">概述：点击规则管理中的分析规则管理模块，点击右侧的新建规则，或者点击已经创建规则右侧的编辑按钮，或者点击复制并新建，将进入规则的编辑页面，按照图示，分别填写基础信息、条件信息、输出信息、通知信息部分，然后确认提交。</div>
        <div class="text">该规则的虚拟环境是，A需要事件来自安全设备的HTTP_SQL疑似注入和HTTP_SQL注入攻击与Label2里的sql注入，且希望事件类别显示为ATT&CK安装植入，攻击结果显示为失陷，但也需要排除来自内部渗透测试地址。同时，因为攻击的连续性，A也希望在发生HTTP_木马后门_WebShell上传_Godzill和HTTP_木马后门_WEbshell_php_eval事件，以及Lable2中所含的webshell扫描连接攻击时，判断是否为相同攻击者的持续攻击。考虑应急响应的质量，A认为相同攻击的持续攻击间隔不会超过1小时。请同时参考，文档前半部分关于，创建一个资源池，创建一个事件类型，创建一个攻击结果的设置，填写必要项。</div>
        <div class="text">请注意，A为第一个事件绑定了变量名称$E1，它的意义是，若第1个事件没有绑定变量，则第2个事件无法引用第1个事件，既第2个事件不能获取到第1个事件发生时的IP，这是变量区别于常量的应用意义。</div>
        <img class="img-width" src="../../assets/img/help/rule_manage7.png" alt="">
        <div class="headline-two">3.7 创建模拟数据</div>
        <table border="1"  cellspacing="0" cellpadding="20">
            <tr>
                <td>安全设备警告事件</td>
                <td rowspan="3">测试新建或已有规则，当规则中仅有1个事件且判断的事件类型为安全警告事件时，发送模拟数据的菜单项，也需要为安全警告事件。当规则中有n个事件时，需要按需逐项点选不同的菜单项，逐个创建发送模拟数据。</td>
            </tr>
            <tr>
                <td>网络流事件</td>
            </tr>
            <tr>
                <td>主机日志事件</td>
            </tr>
        </table>
        <!-- eslint-disable-next-line no-tabs -->
        <div class="headline-two">3.7.1	创建一个模拟数据</div>
        <div class="text">概述：点击创建模拟数据，点击右侧的安全设备警告事件菜单，按照图示，分别填写带有*号的必选项和没有*号的可选项，然后确认提交。该创建模拟数据，测试文档上方提及的，创建一个规则（1），请同时参考。 测试结果请在，事件管理模块中的事件列表中，查看。</div>
        <img class="img-width" src="../../assets/img/help/rule_manage8.png" alt="">
    </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
@import "./help_manual.scss";
</style>
