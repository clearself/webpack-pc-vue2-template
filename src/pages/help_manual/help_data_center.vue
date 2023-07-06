<template>
    <div class="help-contain">
        <div class="headline">4 数据中心</div>
        <div class="headline-two">4.1 名称解释</div>
        <div class="headline-two">4.1.1 Grok表达式</div>
        <div class="text">常用Grok表达式</div>
        <table border="1" cellspacing="0" cellpadding="20">
            <tr>
                <td>表达式标识</td>
                <td>名称</td>
                <td>详情</td>
                <td>匹配例子</td>
            </tr>
            <tr>
                <td>USERNAME 或 USER</td>
                <td>用户名</td>
                <td>由数字、大小写及特殊字符(._-)组成的字符串</td>
                <td>1234、Bob、Alex.Wong</td>
            </tr>
            <tr>
                <td>EMAILLOCALPART</td>
                <td>用户名</td>
                <td>
                    首位由大小写字母组成，其他位由数字、大小写及特殊字符(_.+-=:)组成的字符串。注意，国内的QQ纯数字邮箱账号是无法匹配的，需要修改正则
                </td>
                <td>windcoder、windcoder_com、abc-123</td>
            </tr>
            <tr>
                <td>EMAILADDRESS</td>
                <td>电子邮件</td>
                <td></td>
                <td>windcoder@abc.com、windcoder_com@gmail.com、abc-123@163.com</td>
            </tr>
            <tr>
                <td>HTTPDUSER</td>
                <td>Apache服务器的用户</td>
                <td>可以是EMAILADDRESS或USERNAME</td>
                <td></td>
            </tr>
            <tr>
                <td>INT</td>
                <td>整数</td>
                <td>包括0和正负整数</td>
                <td>0、-123、43987</td>
            </tr>
            <tr>
                <td>BASE10NUM 或 NUMBER</td>
                <td>十进制数字</td>
                <td>包括整数和小数</td>
                <td>0、18、5.23</td>
            </tr>
            <tr>
                <td>BASE16NUM</td>
                <td>十六进制数字</td>
                <td>整数</td>
                <td>0x0045fa2d、-0x3F8709</td>
            </tr>
            <tr>
                <td>WORD</td>
                <td>字符串</td>
                <td>包括数字和大小写字母</td>
                <td>String、3529345、ILoveYou</td>
            </tr>
            <tr>
                <td>NOTSPACE</td>
                <td>不带任何空格的字符串</td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>SPACE</td>
                <td>空格字符串</td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>QUOTEDSTRING 或 QS</td>
                <td>带引号的字符串</td>
                <td></td>
                <td>"This is an apple"、'What is your name?'</td>
            </tr>
            <tr>
                <td>UUID</td>
                <td>标准UUID</td>
                <td></td>
                <td>550E8400-E29B-11D4-A716-446655440000</td>
            </tr>
            <tr>
                <td>MAC</td>
                <td>MAC地址</td>
                <td>可以是Cisco设备里的MAC地址，也可以是通用或者Windows系统的MAC地址</td>
                <td></td>
            </tr>
            <tr>
                <td>IP</td>
                <td>IP地址</td>
                <td>IPv4或IPv6地址</td>
                <td>127.0.0.1、FE80:0000:0000:0000:AAAA:0000:00C2:0002</td>
            </tr>
            <tr>
                <td>HOSTNAME</td>
                <td>IP或者主机名称</td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>HOSTPORT</td>
                <td>主机名(IP)+端口</td>
                <td></td>
                <td>127.0.0.1:3306、api.windcoder.com:8000</td>
            </tr>
            <tr>
                <td>PATH</td>
                <td>路径</td>
                <td>Unix系统或者Windows系统里的路径格式</td>
                <td>/usr/local/nginx/sbin/nginx、c:\windows\system32\clr.exe</td>
            </tr>
            <tr>
                <td>URIPROTO</td>
                <td>URI协议</td>
                <td></td>
                <td>http、ftp</td>
            </tr>
            <tr>
                <td>URIHOST</td>
                <td>URI主机</td>
                <td></td>
                <td>windcoder.com、10.0.0.1:22</td>
            </tr>
            <tr>
                <td>URIPATH</td>
                <td>URI路径</td>
                <td></td>
                <td>//windcoder.com/abc/、/api.php</td>
            </tr>
            <tr>
                <td>URIPARAM</td>
                <td>URI里的GET参数</td>
                <td></td>
                <td>?a=1&b=2&c=3</td>
            </tr>
            <tr>
                <td>URIPATHPARAM</td>
                <td>URI路径+GET参数</td>
                <td>/windcoder.com/abc/api.php?a=1&b=2&c=3</td>
                <td></td>
            </tr>
            <tr>
                <td>URI</td>
                <td>完整的URI</td>
                <td></td>
                <td>https://windcoder.com/abc/api.php?a=1&b=2&c=3</td>
            </tr>
            <tr>
                <td>LOGLEVEL</td>
                <td>Log表达式</td>
                <td>Log表达式</td>
                <td>Alert、alert、ALERT、Error</td>
            </tr>
        </table>

        <div class="headline-two">4.1.2 日期时间表达式</div>
        <table border="1" cellspacing="0" cellpadding="20">
            <tr>
                <td>表达式标识</td>
                <td>名称</td>
                <td>匹配例子</td>
            </tr>
            <tr>
                <td>MONTH</td>
                <td>月份名称</td>
                <td>Jan、January</td>
            </tr>
            <tr>
                <td>MONTHNUM</td>
                <td>月份数字</td>
                <td>03、9、12</td>
            </tr>
            <tr>
                <td>MONTHDAY</td>
                <td>日期数字</td>
                <td>03、9、31</td>
            </tr>
            <tr>
                <td>DAY</td>
                <td>星期几名称</td>
                <td>Mon、Monday</td>
            </tr>
            <tr>
                <td>YEAR</td>
                <td>年份数字</td>
                <td></td>
            </tr>
            <tr>
                <td>HOUR</td>
                <td>小时数字</td>
                <td></td>
            </tr>
            <tr>
                <td>MINUTE</td>
                <td>分钟数字</td>
                <td></td>
            </tr>
            <tr>
                <td>SECOND</td>
                <td>秒数字</td>
                <td></td>
            </tr>
            <tr>
                <td>TIME</td>
                <td>时间</td>
                <td></td>
            </tr>
            <tr>
                <td>DATE_US</td>
                <td>美国时间</td>
                <td>10-01-1892、10/01/1892/</td>
            </tr>
            <tr>
                <td>DATE_EU</td>
                <td>欧洲日期格式</td>
                <td>01-10-1892、01/10/1882、01.10.1892</td>
            </tr>
            <tr>
                <td>ISO8601_TIMEZONE</td>
                <td>ISO8601时间格式</td>
                <td>+10:23、-1023</td>
            </tr>
            <tr>
                <td>TIMESTAMP_ISO8601</td>
                <td>ISO8601时间戳格式</td>
                <td>2016-07-03T00:34:06+08:00</td>
            </tr>
            <tr>
                <td>DATE</td>
                <td>日期</td>
                <td>美国日期%{DATE_US}或者欧洲日期%{DATE_EU} |</td>
            </tr>
            <tr>
                <td>DATESTAMP</td>
                <td>完整日期+时间</td>
                <td>07-03-2016 00:34:06</td>
            </tr>
            <tr>
                <td>HTTPDATE</td>
                <td>http默认日期格式</td>
                <td>03/Jul/2016:00:36:53 +0800</td>
            </tr>
        </table>
        <div class="headline-two">4.2 系统管理模块</div>
        <div class="text">此图为平台输出配置</div>
        <img class="img-width" src="../../assets/img/help/data_center1.png" alt="">
        <div class="text">第一步根据配置填写(红色的为下发接受安全设备的机器标识、橙色的为每台机器的最大目录、绿色的为启动logstash接入安全设备的指定目录,每台机器的启动logstash唯一,即绿色的唯一),若有多个设备按照此图相应配置即可</div>
        <img class="img-width" src="../../assets/img/help/data_center2.png" alt="">
        <div class="headline-two">4.3 数据中心</div>
        <div class="text">数据中心功能有事件数据展示，规则匹配，数据接入，解析，字段管理,服务监控等</div>
        <img class="img-width" src="../../assets/img/help/data_center3.png" alt="">
        <div class="text">此图为该平台接入过不同厂商的配置文件,若客户环境有相应厂商的设备,可直接下发使用</div>
        <div class="headline-two">4.3.1 配置库使用步骤：</div>
        <div class="text">①案例若接入已有的配置AH_WAF</div>
        <img class="img-width" src="../../assets/img/help/data_center4.png" alt="">
        <div class="text">点击新建接入,绿色的为自定义安全标识,选择对应需要接入的安全配置文件,点击保存</div>
        <img class="img-width" src="../../assets/img/help/data_center5.png" alt="">
        <div class="text">红色圈住的即为上步添加保存的信息,下一步点击发送到相应的机器。</div>
        <img class="img-width" src="../../assets/img/help/data_center6.png" alt="">
        <div class="text">点击发送选择配置好的对应的机器即可。</div>
        <img class="img-width" src="../../assets/img/help/data_center7.png" alt="">
        <div class="text">②配置新接入的安全设备</div>
        <div class="text">1 在采集配置库添加内容</div>
        <img class="img-width" src="../../assets/img/help/data_center8.png" alt="">
        <div class="text"> 2 根据备注修改对应的参数,蓝色标注为配置文件名,红色标注为此次接入安全设备的端口,绿色标注是日志范式化Grok表达式,一种设备只有一种日志格式写一条正则即可,多条用逗号隔开。</div>
        <img class="img-width" src="../../assets/img/help/data_center9.png" alt="">
        <div class="text">Grok表达式可以用kibana的grok工具进行编写,红色标注为安全设备日志,绿色标注为Grok正则,蓝色标注为验证grok正则是否正确,Grok正则固定别名 源Ip、源端口、目的Ip、目的端口、事件名称 、事件时间为srcIp、srcPort、desIp、desPort、subject、alarmTime1，其他的可自定义。</div>
        <img class="img-width" src="../../assets/img/help/data_center10.png" alt="">
        <div class="text">根据日志里面的事件时间格式做格式化</div>
        <img class="img-width" src="../../assets/img/help/data_center11.png" alt="">
        <table border="1"  cellspacing="0" cellpadding="20">
            <tr>
                <td>事件时间格式为</td>
                <td>对应的时间格式</td>
            </tr>
            <tr>
                <td>2021-05-01 17:55:66 </td>
                <td>yyyy-MM-dd HH:mm:ss</td>
            </tr>
            <tr>
                <td>1621838995649</td>
                <td>UNIX_MS</td>
            </tr>
            <tr>
                <td>2021-05-01’T’17:15:16.000  </td>
                <td>yyyy-MM-dd’T’HH:mm:ss.000+0800</td>
            </tr>
        </table>
        <div class="text">配置完成保存后根据上一步骤下发机器即可。</div>
        <div class="headline-two">4.4 数据接入、解析使用步骤;</div>
        <div class="text">正则库类似于采集配置库，都是积累更新，可选配使用！</div>
        <div class="text">① 数据解析模块中新建解析</div>
        <img class="img-width" src="../../assets/img/help/data_center12.png" alt="">
        <img class="img-width" src="../../assets/img/help/data_center13.png" alt="">
        <div class="text">红色标注为名称自定义即可，蓝色标注资产自定义，选择Grok表达式，案例demo日志填入框中，根据第一标题中的了解学习Grok表达式，黑色标注根据案例日志开始编写表达式，编写完之后点击下面解析即可解析出对应的字段，点击下一步完成即可。</div>
        <div class="text">② 数据接入</div>
        <div class="text">数据解析写完之后，可以直接使用数据接入模块调用上一步写的数据解析。点击数据接入模块新建接入：</div>
        <img class="img-width" src="../../assets/img/help/data_center14.png" alt="">
        <div class="text">红色标注自定义名字，橙色标注选择数据解析，蓝色标注一般为syslog接入，绿色标注为我们自定义的正则名称，点击完成后在列表中更多操作选择下发指定的机器即可。</div>
    </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
@import "./help_manual.scss";
</style>
