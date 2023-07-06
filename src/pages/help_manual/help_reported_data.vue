<template>
    <div class="help-contain">
        <div class="headline">6 人行报送</div>
        <div class="headline-two">6.1 人行概览</div>
        <div class="text">1. 数据概览</div>
        <div class="text">近2天各类上报数据量</div>
        <div class="text">展示近2天的7类攻击数据的上报数据量</div>
        <div class="text">2. 上报数据趋势图</div>
        <div class="text">展示7类数据之一（可选）的上报趋势图，可通过页面右上角选择显示日趋势或近n天上报数据趋势。</div>
        <div class="text">3. 事件统计</div>
        <div class="text">显示7类数据的合规量及上报量。</div>
        <div class="text">合规量：符合上报标准要求（如无必要字段缺失）的数据量。</div>
        <div class="text">上报量：真实上报的数据量。</div>
        <div class="text">4. 攻击类型/病毒类型分布TOP10</div>
        <div class="text">5. 攻击源地域分布</div>
        <div class="text">6. 攻击源地址TOP10</div>
        <div class="text">7. 被攻击目标系统TOP10</div>
        <div class="text">8. 被攻击IP地址TOP10</div>
        <div class="text">以上依据对应排序及涉及地域等维度做展示。</div>
        <div class="headline-two">6.2 趋势统计</div>
        <div class="headline-two">6.2.1 趋势统计图</div>
        <div class="text">依据时间维度（用户可选时间范围）展示某类数据的合规量及上报量。</div>
        <div class="headline-two">6.2.2 趋势统计表</div>
        <div class="text">内容类似趋势统计图，仅改变表现形式。</div>
        <div class="headline-two">6.3 待上报数据</div>
        <div class="text">
            7类事件数据可选择显示，此列表均为合规数据，会更新到待上报列表，等待进一步操作或自动上报。
        </div>
        <div class="headline-two">6.3.1 筛选框</div>
        <div class="text">可依据某些字段值筛选用户需要显示的数据。</div>
        <div class="headline-two">6.3.2 待上报功能栏</div>
        <div class="text">
            开启5秒刷新：开启后，每5秒自动刷新，便于查看是否有新数据进入列表。
            添加数据：用户可手动按规则添加数据，添加后可保存或直接上报。 上报：用户可选中多条数据后，批量上报数据。
        </div>
        <div class="text">上报：用户可选中多条数据后，批量上报数据。</div>
        <div class="text">审核：配置页开启人工审核后，需要手动审核通过，再上报数据，用户可选审核通过或审核不通过。</div>
        <div class="text">导出：用户可以通过导出功能将该列表数据以表格形式导出。</div>
        <div class="text">删除：用户可选中多条上报失败的数据后，删除对应数据。</div>
        <div class="headline-two">6.3.3 数据操作功能栏</div>
        <div class="text">追溯：可查看数据来源内容，手动添加数据不可追溯。</div>
        <div class="text">上报：上报该单条数据。</div>
        <div class="text">修改：手动修改该条数据内容。</div>
        <div class="text">删除：删除该单条数据。</div>
        <div class="headline-two">6.4 上报结果</div>
        <div class="text">注：上报成功的数据无法选中，不可操作。</div>
        <div class="headline-two">6.4.1 筛选框</div>
        <div class="text">可依据某些字段值筛选用户需要显示的数据。</div>
        <div class="headline-two">6.4.2 上报结果功能栏</div>
        <div class="text">开启5秒刷新：开启后，每5秒自动刷新，便于查看是否有新数据进入列表。</div>
        <div class="text">重新上报：用户可选中多条上报失败的数据后，点击重新上报，尝试再次报送。</div>
        <div class="text">导出：用户可以通过导出功能将该列表数据以表格形式导出。</div>
        <div class="text">删除：用户可选中多条上报失败的数据后，删除对应数据。</div>
        <div class="headline-two">6.4.3 数据操作功能栏</div>
        <div class="text">上报失败/上报超限的数据，可进行以下操作。</div>
        <div class="text">重新上报：尝试再次报送该条数据</div>
        <div class="text">修改：手动修改该条数据内容，并可选择保存或重新上报</div>
        <div class="text">删除：删除该单条数据。</div>
        <div class="headline-two">6.5 上报配置</div>
        <div class="text">上报配置以下必须设置项有※标志</div>
        <div class="headline-two">6.5.1 数据源※</div>
        <div class="text">此处配置采集报送数据的来源，可选事件或日志。</div>
        <div class="headline-two">6.5.2 上报方式※</div>
        <div class="text">此处配置报送数据的方式，有kafka和https两种方式可选</div>
        <div class="text">1. kafka方式</div>
        <div class="text">需要填写7类数据对应topic，此外接收方kafka地址等相关信息需要在后台配置。</div>
        <div class="text">2. 方式</div>
        <div class="text">IP白名单：填写报送方ip地址</div>
        <div class="text">上报接口地址：填写https://接收方ip地址（如：https://1.2.3.4）</div>
        <div class="text">用户名密码：提前与接收方确认，便于接收数据时验证用户信息使用。</div>
        <div class="headline-two">6.5.3 过滤器※</div>
        <div class="text">1. 开关</div>
        <div class="text">开关关闭：不使用过滤器功能，即数据源所有合规数据均采集至待上报列表，待手动审核并上报</div>
        <div class="text">
            开关打开：需要添加过滤规则，需要报送的事件类型（如：网络攻击、ddos攻击等）至少配置一条数据可通过的规则。
        </div>
        <div class="text">2. 过滤规则</div>
        <div class="text">
            合规数据无论是否符合过滤规则，均在待上报列表显示，符合过滤规则的“类型”为自动，不符合过滤规则的“类型”为手动。
        </div>
        <div class="text">
            添加规则时需要选择是否开启人工审核，开启审核，上述自动数据也需要手动上报，不开启审核，自动数据可以自动上报；手动数据均需要手动上报。
        </div>
        <div class="text">问：我需要把所有合规数据自动上报，如何配置过滤器？</div>
        <div class="text">
            答：开启过滤器，添加规则，选择要自动上报的数据类型（如有多类，则每类至少添加一条规则），添加规则范围，选择发生时间大于2000月1月1日00:00:00，不开启人工审核，保存即可。这样所有数据均能满足过滤条件，自动上报。
        </div>
        <div class="headline-two">6.5.4 上报开关※</div>
        <div class="text">1. 开关</div>
        <div class="text">7类事件均可以在此处选择是否开启上报，若关闭则该类数据无法上报。</div>
        <div class="text">2. 日报送阈值</div>
        <div class="text">可以设置每天该类数据报送条数的上限</div>
        <div class="headline-two">6.5.5 机构信息※</div>
        <div class="text">需要填写机构简称和机构代码，数据报送会携带机构信息，便于接收方识别数据的来源机构。</div>
        <div class="headline-two">6.5.6 分支机构※</div>
        <div class="text">
            病毒感染类数据必填字段，意为感染该病毒的分支机构名称，报送方用定值机构名或源地址（ip）对应出机构名。
        </div>
        <div class="text">定值：适用于报送方只有一个分支机构的情况。</div>
        <div class="text">设置固定的分支机构名，所有病毒感染事件均对应该分支机构。</div>
        <div class="text">ip匹配：适用于报送方有多个分支机构的情况。</div>
        <div class="text">
            用户添加对应关系，机构名称对应ip段；通过病毒感染事件的源地址（ip），对应的ip匹配范围，去匹配分支机构
        </div>
        <div class="text">ip范围填写方法</div>
        <div class="text">示例1：192.168.1.1-192.168.1.255</div>
        <div class="text">示例2：1.1.1.1-255.255.255.255</div>
        <div class="headline-two">6.5.7 目标系统※</div>
        <div class="text">
            网络攻击类必填字段，被攻击目的地址相对应的目标系统中文名称，可以使用定值目标系统名或源ip对应出目标系统。
        </div>
        <div class="text">定值：适用于报送方只有一个目标系统的情况。</div>
        <div class="text">设置固定的目标系统名，所有网络攻击类数据均对应该目标系统。</div>
        <div class="text">ip匹配：适用于报送方有多个目标系统的情况。</div>
        <div class="text">用户添加目标系统及ip范围，每个目标系统对应一定的ip范围。</div>
        <div class="text">ip范围填写方法同分支机构的ip范围</div>
        <div class="headline-two">6.5.8 数据匹配※</div>
        <div class="text">此处配置7类安全事件的来源对应关系，每类事件可配置对应数据来源的事件分类。</div>
        <div class="headline-two">6.5.9 设备类型※</div>
        <div class="text">
            设备类型是病毒感染类数据的必填字段，通过源ip对应，配置被感染的设备类型。 ip范围填写方法同分支机构的ip范围
        </div>
        <div class="headline-two">6.5.10 攻击类型匹配</div>
        <div class="text">
            网络攻击或病毒感染类事件的攻击类型定义，用户可自行更改字段与攻击类型的匹配关系。
        </div>
        <div class="headline-two">6.5.11 DDOS流量单位</div>
        <div class="text">
            ddos攻击类数据有流量字段，采集到的数据如无流量单位，则需在此配置。
        </div>
        <div class="headline-two">6.5.12 邮件提醒</div>
        <div class="text">可配置发送频率及收件人信息</div>
        <div class="headline-two">6.6 数据威胁情报</div>
        <div class="text">
            此处无需配置，可通过报送的接收方接口，同步威胁情报信息，程序会每10分钟自动获取，并在页面展示。
        </div>
        <div class="text">批量导入：可以把本地的情报信息导入威胁情报列表。</div>
        <div class="text">导出：可将平台的威胁情报信息下载至本地。</div>
    </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
@import "./help_manual.scss";
</style>
