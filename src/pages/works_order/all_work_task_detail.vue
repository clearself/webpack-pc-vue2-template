<template>
    <div class="event work-detail" style="position: relative;">
        <div class="ub w100" style="box-sizing: border-box;">
            <div class="event-content w100" :style="{ 'min-height': window.screen.width > 1600 ? '820px' : '510px' }">
                <div class="tab-button ub" @click="toogleTab">
                    <div class="work-btn" :class="{ 'tab-active': activeTabName === 'one' }">任务详情</div>
                    <div class="draft-btn" :class="{ 'tab-active': activeTabName === 'two' }">流程图</div>
                </div>
                <div class="ub ub-pj w100" style="padding:20px">
                    <div>{{ workTaskInfo.workOrderName }}</div>
                    <div><el-button @click="back" size="small">返回</el-button></div>
                </div>
                <div style="padding: 0 20px 20px;" v-if="activeTabName === 'one'">
                    <div class="info-title">基本信息</div>
                    <div>
                        <el-row style="margin: 0;" type="flex" justify="start">
                            <div class="ub" style="width:50%;">
                                <div class="label">工单编号：</div>
                                <div class="ub ub-f1 line1 label-val">{{ workTaskInfo.workOrderId | NullStr }}</div>
                            </div>
                            <div class="ub" style="width:50%;">
                                <div class="label">工单名称：</div>
                                <div class="ub ub-f1 line1 label-val">{{ workTaskInfo.workOrderName | NullStr }}</div>
                            </div>
                        </el-row>
                        <el-row style="margin: 0;" type="flex" justify="start">
                            <div class="ub" style="width:50%;">
                                <div class="label">工单类型：</div>
                                <div class="ub ub-f1 line1 label-val">{{ workTaskInfo.workOrderObjectName | NullStr }}</div>
                            </div>
                            <div class="ub" style="width:50%;">
                                <div class="label">优先级：</div>
                                <div class="ub ub-f1 line1 label-val">
                                    <span v-if="workTaskInfo.level == 1" style="color:#ff0000;">{{ workTaskInfo.level | getLevel }}</span>
                                    <span v-else-if="workTaskInfo.level == 2" style="color:#ffdd00;">{{ workTaskInfo.level | getLevel }}</span>
                                    <span v-else style="color:#00e1fd;">{{ workTaskInfo.level | getLevel }}</span>
                                </div>
                            </div>
                        </el-row>
                        <el-row style="margin: 0;" type="flex" justify="start">
                            <div class="ub" style="width:50%;">
                                <div class="label">工单状态：</div>
                                <div class="ub ub-f1 line1 label-val">{{ workTaskInfo.status | getTaskStatus }}</div>
                            </div>
                            <div class="ub" style="width:50%;">
                                <div class="label">待办节点：</div>
                                <div class="ub ub-f1 line1 label-val">{{ workTaskInfo.runningNodeName | getRunningNodeName }}</div>
                            </div>
                        </el-row>
                        <el-row style="margin: 0;" type="flex" justify="start">
                            <div class="ub" style="width:50%;">
                                <div class="label">待办节点状态：</div>
                                <div class="ub ub-f1 line1 label-val">
                                    <span v-if="workTaskInfo.currentNodeStatus === '待处理'" style="color:#ffba00;">{{ workTaskInfo.currentNodeStatus }}</span>
                                    <span v-if="workTaskInfo.currentNodeStatus === '已超时'" style="color:#ff00e4;">{{ workTaskInfo.currentNodeStatus }}</span>
                                    <span v-if="workTaskInfo.currentNodeStatus === '已撤销'" style="color:#ccc;">{{ workTaskInfo.currentNodeStatus }}</span>
                                    <span v-if="workTaskInfo.currentNodeStatus === '已完成'" style="color:lightgreen;">{{ workTaskInfo.currentNodeStatus }}</span>
                                </div>
                            </div>
                            <div class="ub" style="width:50%;">
                                <div class="label">创建人：</div>
                                <div class="ub ub-f1 line1 label-val">{{ workTaskInfo.createUser | NullStr }}</div>
                            </div>
                        </el-row>
                        <el-row style="margin: 0;" type="flex" justify="start">
                            <div class="ub" style="width:50%;">
                                <div class="label">创建时间：</div>
                                <div class="ub ub-f1 line1 label-val">{{ workTaskInfo.createTime | NullStr }}</div>
                            </div>
                            <div class="ub" style="width:50%;">
                                <div class="label">待办节点处理人：</div>
                                <div class="ub ub-f1 line1 label-val">{{ workTaskInfo.players | NullStr }}</div>
                            </div>
                        </el-row>
                        <el-row style="margin: 0;" type="flex" justify="start">
                            <div class="ub" style="width:100%;">
                                <div class="label">工单描述：</div>
                                <div class="ub ub-f1 ub-ver label-val" v-html="workTaskInfo.workOrderContent"></div>
                            </div>
                        </el-row>
                    </div>
                    <div v-if="workTaskInfo.workOrderObject == 1" style="margin-top: 18px;" class="info-title">事件详情</div>
                    <div v-if="workTaskInfo.workOrderObject == 1">
                        <el-row style="margin: 0;" type="flex" justify="start">
                            <div class="ub" style="width:50%;">
                                <div class="label">事件名称：</div>
                                <div class="ub ub-f1 line1 label-val">{{ alarmInfo.reportName | NullStr }}</div>
                            </div>
                            <div class="ub" style="width:50%;">
                                <div class="label">时间等级：</div>
                                <div class="ub ub-f1 line1 label-val">
                                    <span v-if="alarmInfo.reportLevel == 0" style="color:#00bcd4">{{ alarmInfo.reportLevel | getrePortLevel }}</span>
                                    <span v-if="alarmInfo.reportLevel == 1" style="color:#00c7ff">{{ alarmInfo.reportLevel | getrePortLevel }}</span>
                                    <span v-if="alarmInfo.reportLevel == 2" style="color:#f2cd00">{{ alarmInfo.reportLevel | getrePortLevel }}</span>
                                    <span v-if="alarmInfo.reportLevel == 3" style="color:#fc7f00">{{ alarmInfo.reportLevel | getrePortLevel }}</span>
                                    <span v-if="alarmInfo.reportLevel == 4" style="color:#fd0001">{{ alarmInfo.reportLevel | getrePortLevel }}</span>
                                    <span v-if="!alarmInfo.reportLevel && alarmInfo.reportLevel != 0">--</span>
                                </div>
                            </div>
                        </el-row>
                        <el-row style="margin: 0;" type="flex" justify="start">
                            <div class="ub" style="width:50%;">
                                <div class="label">事件类型：</div>
                                <div class="ub ub-f1 line1 label-val">{{ alarmInfo.reportTypeName | NullStr }}</div>
                            </div>
                            <div class="ub" style="width:50%;">
                                <div class="label">事件状态：</div>
                                <div class="ub ub-f1 line1 label-val">
                                    <span v-if="alarmInfo.reportStatus == 0" style="color:#ffdd00">{{ alarmInfo.reportStatus | getreportStatus }}</span>
                                    <span v-if="alarmInfo.reportStatus == 1" style="color:#01ff01">{{ alarmInfo.reportStatus | getreportStatus }}</span>
                                    <span v-if="alarmInfo.reportStatus == 2" style="color:#00e1fd">{{ alarmInfo.reportStatus | getreportStatus }}</span>
                                    <span v-if="alarmInfo.reportStatus == 3" style="color:#fd0001">{{ alarmInfo.reportStatus | getreportStatus }}</span>
                                    <span v-if="!alarmInfo.reportStatus && alarmInfo.reportStatus != 0">--</span>
                                </div>
                            </div>
                        </el-row>
                        <el-row style="margin: 0;" type="flex" justify="start">
                            <div class="ub" style="width:50%;">
                                <div class="label">攻击源头IP：</div>
                                <el-popover v-if="alarmInfo.srcIp" popper-class="add-search-order" placement="bottom" title="" trigger="click">
                                    <div>
                                        <p @click="jumpAsset(alarmInfo.srcIp)" class="ub ub-ac click-btn">
                                            <i class="iconfont icon-chaxunzichan" style="font-size:12px"></i>
                                            <span>查询资产</span>
                                        </p>
                                        <p style="margin-top:10px" @click="jumpThreat(alarmInfo.srcIp)" class="ub ub-ac click-btn">
                                            <i class="iconfont icon-chaxunqingbao" style="font-size:12px"></i>
                                            <span>查询情报</span>
                                        </p>
                                    </div>
                                    <div slot="reference" class="ub ub-f1 line1 label-val" style="cursor: pointer; text-decoration: underline; color: #03a5dd;">
                                        <i
                                            v-if="alarmInfo.srcIpIsSpite != '内网'"
                                            class="iconfont"
                                            :style="{
                                                color: [
                                                    { type: '安全', color: '#00ff48' },
                                                    { type: '恶意', color: '#ff0000' },
                                                    { type: '未知', color: '#7c7c7c' }
                                                ].filter(co => co.type == alarmInfo.srcIpIsSpite)[0].color
                                            }"
                                            :title="alarmInfo.srcIpIsSpite"
                                            :class="{
                                                'icon-liebiaonei-anquan': alarmInfo.srcIpIsSpite == '安全',
                                                'icon-liebiaonei-buanquan': alarmInfo.srcIpIsSpite == '恶意',
                                                'icon-liebiaonei-weizhi': alarmInfo.srcIpIsSpite == '未知'
                                            }"
                                        ></i>
                                        {{ alarmInfo.srcIp | NullStr }}
                                    </div>
                                </el-popover>
                                <div v-if="!alarmInfo.srcIp" class="ub ub-f1 line1 label-val">
                                    {{ alarmInfo.srcIp | NullStr }}
                                </div>
                            </div>
                            <div class="ub" style="width:50%;">
                                <div class="label">攻击源端口：</div>
                                <div class="ub ub-f1 line1 label-val">{{ alarmInfo.srcPort | NullStr }}</div>
                            </div>
                        </el-row>
                        <el-row style="margin: 0;" type="flex" justify="start">
                            <div class="ub" style="width:50%;">
                                <div class="label">目的IP：</div>
                                <el-popover v-if="alarmInfo.desIp" popper-class="add-search-order" placement="bottom" title="" trigger="click">
                                    <div>
                                        <p @click="jumpAsset(alarmInfo.desIp)" class="ub ub-ac click-btn">
                                            <i class="iconfont icon-chaxunzichan" style="font-size:12px"></i>
                                            <span>查询资产</span>
                                        </p>
                                        <p style="margin-top:10px" @click="jumpThreat(alarmInfo.desIp)" class="ub ub-ac click-btn">
                                            <i class="iconfont icon-chaxunqingbao" style="font-size:12px"></i>
                                            <span>查询情报</span>
                                        </p>
                                    </div>
                                    <div slot="reference" class="ub ub-f1 line1 label-val" style="cursor: pointer; text-decoration: underline; color: #03a5dd;">
                                        <i
                                            v-if="alarmInfo.desIpIsSpite != '内网'"
                                            class="iconfont"
                                            :style="{
                                                color: [
                                                    { type: '安全', color: '#00ff48' },
                                                    { type: '恶意', color: '#ff0000' },
                                                    { type: '未知', color: '#7c7c7c' }
                                                ].filter(co => co.type == alarmInfo.desIpIsSpite)[0].color
                                            }"
                                            :title="alarmInfo.desIpIsSpite"
                                            :class="{
                                                'icon-liebiaonei-anquan': alarmInfo.desIpIsSpite == '安全',
                                                'icon-liebiaonei-buanquan': alarmInfo.desIpIsSpite == '恶意',
                                                'icon-liebiaonei-weizhi': alarmInfo.desIpIsSpite == '未知'
                                            }"
                                        ></i>
                                        {{ alarmInfo.desIp | NullStr }}
                                    </div>
                                </el-popover>
                                <div v-if="!alarmInfo.desIp" class="ub ub-f1 line1 label-val">
                                    {{ alarmInfo.desIp | NullStr }}
                                </div>
                            </div>
                            <div class="ub" style="width:50%;">
                                <div class="label">攻击结果：</div>
                                <div class="ub ub-f1 line1 label-val">{{ alarmInfo.attackResult | NullStr }}</div>
                            </div>
                        </el-row>
                        <el-row style="margin: 0;" type="flex" justify="start">
                            <div class="ub" style="width:50%;">
                                <div class="label">是否封禁：</div>
                                <div class="ub ub-f1 line1 label-val">{{ alarmInfo.isBanned == 1 ? '是' : '否' }}</div>
                            </div>
                            <div class="ub" style="width:50%;">
                                <div class="label">规则名称：</div>
                                <div class="ub ub-f1 line1 label-val">{{ alarmInfo.ruleName | NullStr }}</div>
                            </div>
                        </el-row>
                        <el-row style="margin: 0;" type="flex" justify="start">
                            <div class="ub" style="width:100%;">
                                <div class="label">是否溯源：</div>
                                <div class="ub ub-f1 line1 label-val">{{ alarmInfo.isTrace ? '是' : '否' }}</div>
                            </div>
                        </el-row>
                        <!-- <el-row style="margin: 0;" type="flex" justify="start"> -->
                        <div class="" style="width:100%;">
                            <div class="" style="font-size:12px;color:#0052d9;margin-bottom:18px;margin-top:18px">原始日志：</div>
                            <div class="ub ub-f1">
                                <div class="ub ub-ver ub-f1">
                                    <el-table
                                        ref="multipleTable3"
                                        v-loading="loading"
                                        class="bigTable"
                                        style="min-height: auto;"
                                        :data="msgTable"
                                        border
                                        stripe
                                        tooltip-effect="dark"
                                    >
                                        <el-table-column
                                            fixed="left"
                                            align="center"
                                            type="index"
                                            width="50"
                                            class-name="deepBg"
                                            :index="dex => (paramsArry.page - 1) * paramsArry.size + dex + 1"
                                            label="序号"
                                        ></el-table-column>
                                        <el-table-column prop="type" label="事件类型">
                                            <template slot-scope="scope">
                                                <div>
                                                    <span v-if="scope.row.type == 'alarm'">安全设备警告事件</span>
                                                    <span v-if="scope.row.type == 'asset'">资产事件</span>
                                                    <span v-if="scope.row.type == 'host'">主机日志事件</span>
                                                    <span v-if="scope.row.type == 'menace'">威胁情报事件</span>
                                                    <span v-if="scope.row.type == 'traffic'">网络流事件</span>
                                                    <span v-if="scope.row.type == 'vulnerability'">漏洞事件</span>
                                                </div>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="srcIp" label="源地址">
                                            <template slot-scope="scope">
                                                <div>
                                                    <el-popover popper-class="add-search-order" placement="bottom" title="" trigger="click">
                                                        <div>
                                                            <p
                                                                @click="jumpAsset(scope.row.srcIp)"
                                                                class="ub ub-ac click-btn"
                                                            >
                                                                <i class="iconfont icon-chaxunzichan" style="font-size:12px"></i>
                                                                <span>查询资产</span>
                                                            </p>
                                                            <p
                                                                style="margin-top:10px"
                                                                @click="jumpThreat(scope.row.srcIp)"
                                                                class="ub ub-ac click-btn"
                                                            >
                                                                <i class="iconfont icon-chaxunqingbao" style="font-size:12px"></i>
                                                                <span>查询情报</span>
                                                            </p>
                                                        </div>
                                                        <p
                                                            class="highlighted"
                                                            style='cursor: pointer; text-decoration: underline; color: #03a5dd;'
                                                            slot="reference"
                                                        >{{scope.row.srcIp}}</p>
                                                    </el-popover>
                                                </div>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="srcPort" label="源端口"></el-table-column>
                                        <el-table-column prop="desIp" label="目的地址" width="160">
                                            <template slot-scope="scope">
                                                <div>
                                                    <el-popover popper-class="add-search-order" placement="bottom" title="" trigger="click">
                                                        <div>
                                                            <p
                                                                @click="jumpAsset(scope.row.desIp)"
                                                                class="ub ub-ac click-btn"
                                                            >
                                                                <i class="iconfont icon-chaxunzichan" style="font-size:12px"></i>
                                                                <span>查询资产</span>
                                                            </p>
                                                            <p
                                                                style="margin-top:10px"
                                                                @click="jumpThreat(scope.row.desIp)"
                                                                class="ub ub-ac click-btn"
                                                            >
                                                                <i class="iconfont icon-chaxunqingbao" style="font-size:12px"></i>
                                                                <span>查询情报</span>
                                                            </p>
                                                        </div>
                                                        <p
                                                            class="highlighted"
                                                            style='cursor: pointer; text-decoration: underline; color: #03a5dd;'
                                                            slot="reference"
                                                        >{{scope.row.desIp}}</p>
                                                    </el-popover>
                                                </div>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="desPort" label="目的端口" width="160"></el-table-column>
                                        <el-table-column prop="callDateTime" label="事件接收时间" width="180" :formatter="dateFormat_inner"></el-table-column>
                                        <el-table-column prop="subject" label="事件名称"></el-table-column>
                                        <el-table-column align="center" label="操作" fixed="right" class-name="deepBg" width="80">
                                            <template slot-scope="scope">
                                                <el-button type="text" @click="detailData(scope.row)">详情</el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                    <div class="pagination" style="margin-top: 10px;text-align: right;">
                                        <el-pagination
                                            background
                                            @size-change="val => (paramsArry.size = val)"
                                            @current-change="val => (paramsArry.page = val)"
                                            :current-page="paramsArry.page"
                                            :page-sizes="[5, 10, 20, 30, 40, 50]"
                                            :page-size="paramsArry.size"
                                            layout="total, sizes, prev, pager, next"
                                            :total="msgTable.length"
                                        ></el-pagination>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- </el-row> -->
                    </div>
                    <div v-if="workTaskInfo.workOrderObject == 2" class="info-title">漏洞详情</div>
                    <div v-if="workTaskInfo.workOrderObject == 2">
                        <el-row style="margin: 0;" type="flex" justify="start">
                            <div class="ub" style="width:50%;">
                                <div class="label">漏洞名称：</div>
                                <div class="ub ub-f1 line1 label-val">{{ leaksInfo.nodeName | NullStr }}</div>
                            </div>
                            <div class="ub" style="width:50%;">
                                <div class="label">漏洞类型：</div>
                                <div class="ub ub-f1 line1 label-val">{{ leaksInfo.leakTypeCN | NullStr }}</div>
                            </div>
                        </el-row>
                        <el-row style="margin: 0;" type="flex" justify="start">
                            <div class="ub" style="width:50%;">
                                <div class="label">漏洞级别：</div>
                                <div class="ub ub-f1 line1">
                                    <span style="color:#00a2ff;font-size:12px;line-height:32px;margin-left:8px" v-if="leaksInfo.riskLevel == 1">{{ leaksInfo.riskLevelCN }}</span>
                                    <span style="color:#f2cd00;font-size:12px;line-height:32px;margin-left:8px" v-if="leaksInfo.riskLevel == 2">{{ leaksInfo.riskLevelCN }}</span>
                                    <span style="color:#f86900;font-size:12px;line-height:32px;margin-left:8px" v-if="leaksInfo.riskLevel == 3">{{ leaksInfo.riskLevelCN }}</span>
                                    <span style="color:#19b0b1;font-size:12px;line-height:32px;margin-left:8px" v-if="leaksInfo.riskLevel == 4">{{ leaksInfo.riskLevelCN }}</span>
                                </div>
                            </div>
                            <div class="ub" style="width:50%;">
                                <div class="label">修复建议：</div>
                                <div class="ub ub-f1 line1 label-val">{{ leaksInfo.repairAdvice | NullStr }}</div>
                            </div>
                        </el-row>
                        <el-row style="margin: 0;" type="flex" justify="start">
                            <div class="ub" style="width:50%;">
                                <div class="label">简短描述：</div>
                                <div class="ub ub-f1 line1 label-val">{{ leaksInfo.shortDesc | NullStr }}</div>
                            </div>
                            <div class="ub" style="width:50%;">
                                <div class="label">详细描述：</div>
                                <div class="ub ub-f1 line1 label-val">{{ leaksInfo.fullDesc | NullStr }}</div>
                            </div>
                        </el-row>
                        <el-row style="margin: 0;" type="flex" justify="start">
                            <div class="ub" style="width:50%;">
                                <div class="label">漏洞CVSS分值：</div>
                                <div class="ub ub-f1 line1 label-val">{{ leaksInfo.cvssScore | NullStr }}</div>
                            </div>
                            <div class="ub" style="width:50%;">
                                <div class="label">CVE编号：</div>
                                <div class="ub ub-f1 line1 label-val">{{ leaksInfo.cveTag | NullStr }}</div>
                            </div>
                        </el-row>
                        <el-row style="margin: 0;" type="flex" justify="start">
                            <div class="ub" style="width:50%;">
                                <div class="label">CNVD编号：</div>
                                <div class="ub ub-f1 line1 label-val">{{ leaksInfo.cnvdTag | NullStr }}</div>
                            </div>
                            <div class="ub" style="width:50%;">
                                <div class="label">CNNVD编号：</div>
                                <div class="ub ub-f1 line1 label-val">{{ leaksInfo.cnnvdTag | NullStr }}</div>
                            </div>
                        </el-row>
                        <el-row style="margin: 0;" type="flex" justify="start">
                            <div class="ub" style="width:50%;">
                                <div class="label">CNCVE编号：</div>
                                <div class="ub ub-f1 line1 label-val">{{ leaksInfo.cncveTag | NullStr }}</div>
                            </div>
                            <div class="ub" style="width:50%;">
                                <div class="label">BUGTRAP：</div>
                                <div class="ub ub-f1 line1 label-val">{{ leaksInfo.bugTraqTag | NullStr }}</div>
                            </div>
                        </el-row>
                        <el-row style="margin: 0;" type="flex" justify="start">
                            <div class="ub" style="width:50%;">
                                <div class="label">更新时间：</div>
                                <div class="ub ub-f1 line1 label-val">{{ leaksInfo.updateTime | NullStr }}</div>
                            </div>
                            <div class="ub" style="width:50%;">
                                <div class="label">影响平台：</div>
                                <div class="ub ub-f1 line1 label-val">{{ leaksInfo.platforms | NullStr }}</div>
                            </div>
                        </el-row>
                        <el-row style="margin: 0;" type="flex" justify="start">
                            <div class="ub" style="width:50%;">
                                <div class="label">创建时间：</div>
                                <div class="ub ub-f1 line1 label-val">{{ leaksInfo.createTime | NullStr }}</div>
                            </div>
                            <div class="ub" style="width:50%;">
                                <div class="label">漏洞端口：</div>
                                <div class="ub ub-f1 line1 label-val">{{ leaksInfo.port | NullStr }}</div>
                            </div>
                        </el-row>
                        <el-row style="margin: 0;" type="flex" justify="start">
                            <div class="ub" style="width:50%;">
                                <div class="label">服务名称：</div>
                                <div class="ub ub-f1 line1 label-val">{{ leaksInfo.serviceName | NullStr }}</div>
                            </div>
                            <div class="ub" style="width:50%;">
                                <div class="label">检查结果：</div>
                                <div class="ub ub-f1 line1 label-val">{{ leaksInfo.checkResult | NullStr }}</div>
                            </div>
                        </el-row>
                        <el-row style="margin: 0;" type="flex" justify="start">
                            <div class="ub" style="width:50%;">
                                <div class="label">检查类型：</div>
                                <div class="ub ub-f1 line1 label-val">{{ leaksInfo.checkType | NullStr }}</div>
                            </div>
                            <div class="ub" style="width:50%;">
                                <div class="label">合规项描述：</div>
                                <div class="ub ub-f1 line1 label-val">{{ leaksInfo.compliance | NullStr }}</div>
                            </div>
                        </el-row>
                        <el-row style="margin: 0;" type="flex" justify="start">
                            <div class="ub" style="width:50%;">
                                <div class="label">加固方案：</div>
                                <div class="ub ub-f1 line1 label-val">{{ leaksInfo.reinforcement | NullStr }}</div>
                            </div>
                            <div class="ub" style="width:50%;">
                                <div class="label">漏洞URL：</div>
                                <div class="ub ub-f1 line1 label-val">{{ leaksInfo.leakUrl | NullStr }}</div>
                            </div>
                        </el-row>
                        <el-row style="margin: 0;" type="flex" justify="start">
                            <div class="ub" style="width:50%;">
                                <div class="label">网站名称：</div>
                                <div class="ub ub-f1 line1 label-val">{{ leaksInfo.webName | NullStr }}</div>
                            </div>
                            <div class="ub" style="width:50%;">
                                <div class="label">提交类型：</div>
                                <div class="ub ub-f1 line1 label-val">{{ leaksInfo.submitType | NullStr }}</div>
                            </div>
                        </el-row>
                        <el-row style="margin: 0;" type="flex" justify="start">
                            <div class="ub" style="width:50%;">
                                <div class="label">测试数据：</div>
                                <div class="ub ub-f1 line1 label-val">{{ leaksInfo.testData | NullStr }}</div>
                            </div>
                            <div class="ub" style="width:50%;">
                                <div class="label">post数据：</div>
                                <div class="ub ub-f1 line1 label-val">{{ leaksInfo.postData | NullStr }}</div>
                            </div>
                        </el-row>
                    </div>
                    <div v-if="bpmRecord.length > 0" class="info-title">流转记录</div>
                    <div class="ub ub-ac ub-pe w100" v-if="workTaskInfo.status == 2 && bpmRecord.length > 0">
                        <el-button type="text" icon="el-icon-download" v-on:click="getPdf('pdfPrint', workTaskInfo.workOrderName)">生成PDF</el-button>
                    </div>
                    <div class="w100 work-record" id="pdfPrint">
                        <el-row style="margin: 0;background: #fff" type="flex" justify="center">
                            <el-timeline style="width:90%;margin-left: 140px;">
                                <el-timeline-item
                                    class="w100"
                                    v-for="(activity, index) in bpmRecord"
                                    :key="index"
                                    :icon="activity.icon"
                                    :type="activity.type"
                                    :color="activity.color"
                                    :size="activity.size"
                                    :hide-timestamp="false"
                                    :timestamp="activity.createTime"
                                    placement="top"
                                >
                                    <div class="ub ub-pj ub-ac time-box">
                                        <div class="ub" style="width: 50%;">
                                            <h4 style="color: rgba(0, 0, 0, 0.9);font-size: 16px;">
                                                {{ activity.userName | NullStr }}
                                                <sub style="font-size:12px;color: rgba(0, 0, 0, 0.6);margin-left: 10px;vertical-align: bottom;">
                                                    {{ activity.userRole | NullStr }}
                                                </sub>
                                                <sub style="font-size:12px;color: rgba(0, 0, 0, 0.6);margin-left: 10px;vertical-align: bottom;">
                                                    当前节点：{{ activity.nodeName ? activity.nodeName : '' }}
                                                </sub>
                                            </h4>
                                        </div>
                                        <div class="time-right" style="width: 150px;text-align: right">
                                            <el-button
                                                type="text"
                                                style="text-decoration: underline;font-size:12px;"
                                                :class="{ 'el-icon-arrow-down': activity.isOpen, 'el-icon-arrow-up': !activity.isOpen }"
                                                @click="activity.isOpen = !activity.isOpen"
                                            >
                                                {{ activity.isOpen ? '收起内容' : '展开查看' }}
                                            </el-button>
                                        </div>
                                    </div>

                                    <div v-show="activity.isOpen">
                                        <div class="time-text-box" v-if="(workTaskInfo.workOrderObject == 1 || workTaskInfo.workOrderObject == 2) && activity.dealType == 0">
                                            <div class="w100 time-text-box-item" v-for="(item, _index) in activity.dealContent" :key="_index">
                                                <div class="time-text-box-left">{{ item.name }}:</div>
                                                <div v-if="item.valType === 'text' || item.valType === 'select'" class="ub ub-f1 ub-ver time-text-box-right">
                                                    {{ item | getVal }}
                                                </div>
                                                <div v-else class="time-text-box-right" v-html="item.val" @click="imageEnlargement"></div>
                                            </div>
                                        </div>
                                        <div class="time-text-box" v-if="!['1', '2', '3', '4', '5'].includes(workTaskInfo.workOrderObject)">
                                            <div class="w100 time-text-box-item" v-for="(item, _index) in activity.dealContent" :key="_index">
                                                <div class="time-text-box-left">{{ _index }}：</div>
                                                <div class="time-text-box-right" v-html="item" @click="imageEnlargement"></div>
                                            </div>
                                        </div>
                                        <div class="w100 time-text-box" v-if="workTaskInfo.workOrderObject == 1 && activity.operation == 0">
                                            <div class="w100 time-text-box-item">
                                                <div class="time-text-box-left">是否驳回：</div>
                                                <div class="time-text-box-right">{{ activity.dealContent.isReject == 1 ? '是' : '否' }}</div>
                                            </div>
                                            <div class="w100 time-text-box-item">
                                                <div class="time-text-box-left">分析过程：</div>
                                                <div class="time-text-box-right" v-html="activity.dealContent.analyzePro" @click="imageEnlargement"></div>
                                            </div>
                                            <div class="w100 time-text-box-item" v-if="activity.dealContent.isReject == 1">
                                                <div class="time-text-box-left">驳回理由：</div>
                                                <div class="time-text-box-right" v-html="activity.dealContent.rejectReason" @click="imageEnlargement"></div>
                                            </div>
                                            <div v-else class="w100 time-text-box-item">
                                                <div class="time-text-box-left">处置建议：</div>
                                                <div class="time-text-box-right" v-html="activity.dealContent.advice" @click="imageEnlargement"></div>
                                            </div>
                                        </div>
                                        <!-- 漏洞处置 -->
                                        <div class="time-text-box" v-if="workTaskInfo.workOrderObject == 2 && activity.operation && activity.operation == 2">
                                            <div class="w100">
                                                <div class="w100 time-text-box-item">
                                                    <div class="time-text-box-left">处置方式：</div>
                                                    <div class="time-text-box-right">{{ activity.dealContent.disposalType | getdisposalLeakType }}</div>
                                                </div>
                                                <div class="w100 time-text-box-item" v-if="activity.dealContent.disposalType == 2">
                                                    <div class="time-text-box-left">描述：</div>
                                                    <div class="time-text-box-right" v-html="activity.dealContent.des"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- 事件处置 -->
                                        <div class="time-text-box" v-if="workTaskInfo.workOrderObject == 1 && activity.operation && activity.operation == 2">
                                            <div class="w100 time-text-box-item">
                                                <div class="time-text-box-left">审核状态：</div>
                                                <div class="time-text-box-right">{{ activity.dealContent.isReject == 1 ? '驳回' : '处置' }}</div>
                                            </div>
                                            <div class="w100 time-text-box-item" v-if="activity.dealContent.isReject == 1">
                                                <div class="time-text-box-left">驳回理由：</div>
                                                <div class="time-text-box-right" v-html="activity.dealContent.rejectReason" @click="imageEnlargement"></div>
                                            </div>
                                            <div class="w100" v-if="activity.dealContent.isReject != 1">
                                                <div class="w100 time-text-box-item">
                                                    <div class="time-text-box-left">处置方式：</div>
                                                    <div class="time-text-box-right">{{ activity.dealContent.disposalType | getdisposalType }}</div>
                                                </div>
                                                <div class="w100 time-text-box-item" v-if="activity.dealContent.disposalType == 0">
                                                    <div class="time-text-box-left">IP：</div>
                                                    <div class="time-text-box-right">{{ handdeelIps(activity.dealContent.ips) }}</div>
                                                </div>
                                                <div class="w100 time-text-box-item" v-if="activity.dealContent.disposalType == 0 && activity.dealContent.isReject != 3">
                                                    <div class="time-text-box-left">封禁对象：</div>
                                                    <div class="time-text-box-right">{{ getObjs(activity.dealContent.objs) }}</div>
                                                </div>
                                                <div class="w100 time-text-box-item" v-if="activity.dealContent.disposalType == 1 || activity.dealContent.disposalType == 2">
                                                    <div class="time-text-box-left">变更项：</div>
                                                    <div class="time-text-box-right">{{ activity.dealContent.changeItem | getchangeItem }}</div>
                                                </div>
                                                <div
                                                    class="w100 time-text-box-item"
                                                    v-if="
                                                        activity.dealContent.disposalType == 1 || activity.dealContent.disposalType == 2 || activity.dealContent.disposalType == 3
                                                    "
                                                >
                                                    <div class="time-text-box-left">设备：</div>
                                                    <div class="time-text-box-right">{{ getassetIds(activity.dealContent.assetIds) }}</div>
                                                </div>
                                                <div class="w100 time-text-box-item" v-if="activity.dealContent.disposalType == 4">
                                                    <div class="time-text-box-left">业务系统：</div>
                                                    <div class="time-text-box-right">{{ getassetSystemId(activity.dealContent.assetSystemId) }}</div>
                                                </div>
                                                <div class="w100 time-text-box-item" v-if="activity.dealContent.disposalType == 4">
                                                    <div class="time-text-box-left">业务人员：</div>
                                                    <div class="time-text-box-right">{{ getassetUserId(activity.dealContent.assetUserId) }}</div>
                                                </div>
                                                <div class="w100 time-text-box-item" v-if="activity.dealContent.disposalType == 5">
                                                    <div class="time-text-box-left">其他：</div>
                                                    <div class="time-text-box-right" v-html="activity.dealContent.otherMsg" @click="imageEnlargement"></div>
                                                </div>
                                                <div class="w100 time-text-box-item" v-if="activity.dealContent.disposalType != 0 && activity.dealContent.disposalType != 5">
                                                    <div class="time-text-box-left">备注：</div>
                                                    <div class="time-text-box-right" v-html="activity.dealContent.changeLog" @click="imageEnlargement"></div>
                                                </div>
                                            </div>
                                            <div class="w100 time-text-box-item">
                                                <div class="time-text-box-left">处置结果：</div>
                                                <div class="time-text-box-right" v-html="activity.dealContent.actionResults" @click="imageEnlargement"></div>
                                            </div>
                                        </div>
                                        <!-- 事件溯源 -->
                                        <div class="time-text-box" v-if="workTaskInfo.workOrderObject == 1 && activity.operation && activity.operation == 3">
                                            <div class="w100 time-text-box-item">
                                                <div class="time-text-box-left">溯源结果：</div>
                                                <div class="time-text-box-right" v-html="activity.dealContent.traceResult" @click="imageEnlargement"></div>
                                            </div>
                                        </div>
                                        <!-- 状态变更 -->
                                        <div class="time-text-box" v-if="workTaskInfo.workOrderObject == 1 && activity.operation && activity.operation == 1">
                                            <div class="w100 time-text-box-item">
                                                <div class="time-text-box-left">事件状态：</div>
                                                <div class="time-text-box-right">{{ activity.dealContent.reportStatus | getreportStatus }}</div>
                                            </div>
                                        </div>
                                        <!-- 二线分析 -->
                                        <div class="time-text-box" v-if="workTaskInfo.workOrderObject == 1 && activity.operation && activity.operation == 4">
                                            <div class="w100 time-text-box-item">
                                                <div class="time-text-box-left">追加建议：</div>
                                                <div class="time-text-box-right" v-html="activity.dealContent.appendProposal" @click="imageEnlargement"></div>
                                            </div>
                                        </div>

                                        <!-- 备注 -->
                                        <div
                                            class="time-text-box"
                                            v-if="
                                                (workTaskInfo.workOrderObject == 3 || workTaskInfo.workOrderObject == 4 || workTaskInfo.workOrderObject == 5) &&
                                                    activity.dealContent
                                            "
                                        >
                                            <div class="w100 time-text-box-item">
                                                <div class="time-text-box-left">备注：</div>
                                                <div class="time-text-box-right" v-html="activity.dealContent ? activity.dealContent.remark : ''" @click="imageEnlargement"></div>
                                            </div>
                                        </div>

                                        <!-- 审核 -->
                                        <div class="time-text-box" v-if="activity.dealType && activity.dealType == 2">
                                            <div class="w100 time-text-box-item">
                                                <div class="time-text-box-left">审核意见：</div>
                                                <div class="time-text-box-right" v-html="activity.approveOpinion" @click="imageEnlargement"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="w100 time-box-item-bottom" style="margin-top: 8px;">
                                        <div class="time-text-box-bottom">
                                            <i class="iconfont icon-jiediankaishishijian"></i>
                                            <span>开始：{{ activity.receiveTime | NullStr }}</span>
                                        </div>
                                        <div class="time-text-box-bottom">
                                            <i class="iconfont icon-jiediantingliushijian"></i>
                                            <span>
                                                停留时长：
                                                <strong>{{ activity.stayTime | NullStr }}</strong>
                                            </span>
                                        </div>
                                        <div class="time-text-box-bottom">
                                            <i class="iconfont icon-jiediantingliushijian"></i>
                                            <span>
                                                超时时长：
                                                <strong>{{ activity.allTime | NullStr }}</strong>
                                            </span>
                                        </div>
                                        <div class="time-text-box-bottom">
                                            <i class="iconfont icon-chuliren"></i>
                                            <span>
                                                处理人：
                                                <strong class="users">{{ activity.players | NullStr }}</strong>
                                            </span>
                                        </div>
                                    </div>
                                </el-timeline-item>
                            </el-timeline>
                        </el-row>
                    </div>
                </div>
                <div style="padding: 0 20px 20px;" v-if="activeTabName === 'two'">
                    <bpmn-modeler
                        ref="refNode"
                        :xml="seeForm.xml"
                        :users="users"
                        :workStatus="workStatus"
                        :currentWorkIds="currentWorkIds"
                        :groups="groups"
                        :categorys="categorys"
                        :is-view="false"
                    />
                </div>
            </div>
        </div>
        <el-dialog title="提示" :visible.sync="finishDialog" width="30%" custom-class="attendance-dialog">
            <span>确定完成吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" @click="finishConfim">确 定</el-button>
                <el-button size="small" @click="finishDialog = false">取 消</el-button>
                <!-- <searchBtn title="确 定" @click="finishConfim" /> -->
                <!-- <cancel-btn style="margin-left: 10px;" title="取 消" @click="finishDialog = false" /> -->
            </span>
        </el-dialog>
        <el-dialog v-dialogDrag :title="agreeTitle" :visible.sync="checkDialog" width="65%" custom-class="attendance-dialog">
            <el-form class="w100" :model="checkkForm" :rules="rules" ref="checkkForm">
                <el-form-item style="width:100%;margin-bottom: 20px;" label="审批意见：" prop="" :label-width="formLabelWidth">
                    <div class="ub ub-pc ub-f1"><vue-ueditor-wrap v-model="checkkForm.approveOpinion" :config="myConfig"></vue-ueditor-wrap></div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" @click="finishConfim">确 定</el-button>
                <el-button size="small" @click="checkDialog = false">取 消</el-button>
            </span>
        </el-dialog>
        <el-dialog v-dialogDrag title="事件详情" :visible.sync="detailDialog" width="700" custom-class="attendance-dialog" top="10vh">
            <div style="width:90%;margin: 0 auto;display: flex;flex-wrap: wrap;overflow-y: auto">
                <div class="table-container" v-for="(val, key) in detailArr" :key="key">
                    <div class="table-left">{{ fieldToChinese(key) }}</div>
                    <div class="table-right" v-html="val"></div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import 'vant/lib/index.css'
import xml from '@/components/buit-inTemplate.js'
import { ImagePreview } from 'vant'
import VueUeditorWrap from '../../components/vue-ueditor-wrap.vue' // ES6 Module
import ueditorConfig from '../../mixins/ueditorConfig'
import { get_workTask_detailAllTask, finish_workTask, get_one_workAllTask, get_task_infoAllTask } from '../../server/works_order/api.js'
import { get_threat_search } from '@/server/intelligence/api.js'
import bpmnModeler from '../../package/detailXml'
export default {
    name: 'TaskDetail',
    components: {
        VueUeditorWrap,
        bpmnModeler
    },
    mixins: [ueditorConfig],
    data() {
        return {
            // 填入导出的pdf文件名和html元素
            pdfTitle: '流传记录报告',
            pdfSelector: 'pdfPrint',
            window: window,
            eduitURL: '',
            agreeStatus: '',
            agreeTitle: '',
            finishDialog: false,
            formLabelWidth: '120px',
            // msgTable:[],
            loading: false,
            checkDialog: false,
            fieldsForm: {
                fields: []
            },
            users: [{ name: '张三', id: 'zhangsan' }, { name: '李四', id: 'lisi' }, { name: '王五', id: 'wangwu' }],
            groups: [{ name: 'web组', id: 'web' }, { name: 'java组', id: 'java' }, { name: 'python组', id: 'python' }],
            categorys: [{ name: 'OA', id: 'oa' }, { name: '财务', id: 'finance' }],
            seeForm: {
                xml: ''
            },
            workStatus: false,
            currentWorkIds: [],
            // 事件表单
            assetList: [],
            userList: [],
            systemList: [],
            oneKeyList: [],
            // 处置操作：
            // 是否驳回--isReject
            // 处置方式--disposalType
            // 封禁对象--objs
            // ip--ips
            // 选择设备--assetIds
            // 变更项--changeItem
            // 备注--changeLog
            // 业务系统--assetSystemId
            // 业务员--assetUserId
            // 其它--otherMsg
            handleForm: {
                isReject: '0',
                disposalType: '',
                ips: '',
                rejectReason: '',
                objs: [],
                assetIdsZDGZ: '',
                assetIdsJCGZ: '',
                assetIdsFWGZ: '',
                changeItemZDGZ: '',
                changeItemJCGZ: '',
                changeLog: '',
                assetSystemId: '',
                assetUserId: '',
                otherMsg: ''
            },
            handleLeakForm: {
                disposalType: '',
                des: ''
            },
            analysisForm: {
                isReject: '0',
                analyzePro: '', // 分析过程
                advice: '', // 处置建议
                rejectReason: '' // 驳回理由
            },
            backForm: {
                traceResult: ''
            },
            alarmAddviceForm: {
                appendProposal: ''
            },
            alarmStatusForm: {
                reportStatus: ''
            },
            otherForm: {
                remark: ''
            },
            checkkForm: {
                approveOpinion: ''
            },
            rules: {},
            disposalRules: {
                isReject: [
                    {
                        required: true,
                        message: '请选择',
                        trigger: 'change'
                    }
                ],
                disposalType: [
                    {
                        required: true,
                        message: '请选择',
                        trigger: 'change'
                    }
                ]
            },
            analysisRules: {
                isReject: [
                    {
                        required: true,
                        message: '请选择',
                        trigger: 'change'
                    }
                ]
            },
            historyDialog: false,
            activities: [],
            activeName: 'first',
            activeTabName: 'one',
            workTaskInfos: {},
            alarmInfo: {},
            leaksInfo: {},
            bpmRecord: [],
            detailInfo: {
                createTime: '',
                des: '',
                hours: '',
                endTime: null,
                groupName: '',
                output: '',
                startTime: '',
                status: '',
                statusCN: '',
                taskName: '',
                feedback: '',
                history: [],
                users: ''
            },
            currentTab: '',
            msg: '',
            paramsArry: {
                page: 1,
                size: 5
            },
            detailDialog: false,
            detailArr: {},
            dealContent: null
        }
    },
    filters: {
        // 变更项
        getchangeItem(type) {
            let types = [
                {
                    label: 'WAF规则变更',
                    value: 0
                },
                {
                    label: 'IPS规则变更',
                    value: 1
                },
                {
                    label: 'FW规则变更',
                    value: 2
                },
                {
                    label: 'IDS规则变更',
                    value: 3
                }
            ]
            let selected = types.filter(item => item.value == type)
            if (selected.length > 0) {
                return selected[0].label
            } else {
                return ''
            }
        },
        // 漏洞处置
        getdisposalLeakType(type) {
            let types = [
                {
                    label: '补丁',
                    value: 0
                },
                {
                    label: '升级',
                    value: 1
                },
                {
                    label: '其他',
                    value: 2
                }
            ]
            let selected = types.filter(item => item.value == type)
            if (selected.length > 0) {
                return selected[0].label
            } else {
                return ''
            }
        },
        // 处置方式
        getdisposalType(type) {
            let types = [
                {
                    label: '一键封堵',
                    value: 0
                },
                {
                    label: '阻断规则变更',
                    value: 1
                },
                {
                    label: '检测规则变更',
                    value: 2
                },
                {
                    label: '访问规则变更',
                    value: 3
                },
                {
                    label: '业务安全检查变更',
                    value: 4
                },
                {
                    label: '其他',
                    value: 5
                }
            ]
            let selected = types.filter(item => item.value == type)
            if (selected.length > 0) {
                return selected[0].label
            } else {
                return ''
            }
        },
        getVal(item) {
            if (item.valType === 'text' || item.valType === 'richText') {
                return item.val
            }
            if (item.valType === 'select') {
                let arr = item.item
                let selected = arr.filter(tag => item.val == tag.key)
                if (selected.length > 0) {
                    return selected[0].value
                } else {
                    return ''
                }
            }
        },
        getLevel(level) {
            if (level == 1) {
                return '高'
            } else if (level == 2) {
                return '中'
            } else if (level == 3) {
                return '低'
            }
        },
        getTaskStatus(status) {
            if (status == 0) {
                return '已撤销'
            } else if (status == 1) {
                return '进行中'
            } else if (status == 2) {
                return '已完成'
            }
        },
        getRunningNodeName(arr) {
            if (arr && arr.length > 0) {
                return arr.join(',')
            } else {
                return ''
            }
        },
        getrePortLevel(level) {
            if (level == 0) {
                return '低'
            } else if (level == 1) {
                return '中低'
            } else if (level == 2) {
                return '中'
            } else if (level == 3) {
                return '中'
            } else if (level == 4) {
                return '高'
            }
        },
        getreportStatus(status) {
            if (status == 0) {
                return '待确认'
            } else if (status == 1) {
                return '已确认'
            } else if (status == 2) {
                return '已处置'
            } else if (status == 3) {
                return '已驳回'
            }
        }
    },
    computed: {
        msgTable() {
            let result = []
            if (this.msg) {
                try {
                    JSON.parse(this.msg).map(item => {
                        if (Array.isArray(item) && item.length) {
                            // console.log(item);
                            result = result.concat(item)
                        } else if (item.constructor == Object && !item.historyIP && !item.operationSystem && JSON.stringify(item) !== '{}') {
                            result.push(item)
                        }
                    })
                } catch (e) {
                    console.log(e)
                }
            }
            console.log(result)
            return result.slice((this.paramsArry.page - 1) * this.paramsArry.size, this.paramsArry.page * this.paramsArry.size)
        },
        workTaskInfoFinish() {
            let obj = {}
            obj.workOrderObject = this.workTaskInfos.workOrderObject
            obj.dealType = this.workTaskInfos.dealType
            obj.workOrderId = this.workTaskInfos.workOrderId ?? ''
            obj.taskId = this.workTaskInfos.taskId ?? ''
            obj.processInstanceId = this.workTaskInfos.processInstanceId ?? ''
            obj.deploymentId = this.workTaskInfos.deploymentId ?? ''
            if (obj.dealType == 0 || obj.dealType == 1 || obj.dealType === null) {
                obj.approve = 1
            } else {
                obj.approve = this.workTaskInfos.approve ?? 1
            }
            if (this.workTaskInfos.operation || this.workTaskInfos.operation === 0) {
                obj.operation = this.workTaskInfos.operation
            }
            obj.approveOpinion = this.workTaskInfos.approveOpinion ?? ''
            obj.sourceId = this.workTaskInfos.sourceId ?? ''
            obj.receiveTime = this.workTaskInfos.receiveTime ?? ''
            obj.nodeDes = this.workTaskInfos.nodeDes ?? ''
            obj.nodeId = this.workTaskInfos.nodeId ?? ''
            obj.outTime = this.workTaskInfos.outTime ?? ''
            return obj
        },
        workTaskInfo() {
            return this.workTaskInfos
        },
        analysisFormParams() {
            let obj = {}
            obj.isReject = this.analysisForm.isReject
            obj.analyzePro = this.analysisForm.analyzePro
            if (obj.isReject == 1) {
                obj.rejectReason = this.analysisForm.rejectReason
            } else {
                obj.advice = this.analysisForm.advice
            }
            return obj
        },
        handleFormParams() {
            let obj = {}
            obj.isReject = this.handleForm.isReject
            obj.disposalType = this.handleForm.disposalType
            if (obj.isReject == 1) {
                obj.rejectReason = this.handleForm.rejectReason
                obj.actionResults = this.handleForm.actionResults
            } else {
                obj.actionResults = this.handleForm.actionResults
                if (obj.disposalType == 0) {
                    let listArry = this.handleForm.ips.split('\n')
                    let newArry = []
                    listArry.forEach(item => {
                        if (item.replace(/\s/gi, '')) {
                            newArry.push(item.replace(/\s/gi, ''))
                        }
                    })
                    obj.ips = newArry
                }
                if (obj.disposalType == 0 && obj.isReject != 3) {
                    obj.objs = this.handleForm.objs
                }
                if (obj.disposalType == 1) {
                    obj.changeItem = this.handleForm.changeItemZDGZ
                    obj.assetIds = this.handleForm.assetIdsZDGZ
                }
                if (obj.disposalType == 2) {
                    obj.changeItem = this.handleForm.changeItemJCGZ
                    obj.assetIds = this.handleForm.assetIdsJCGZ
                }
                if (obj.disposalType == 3) {
                    obj.assetIds = this.handleForm.assetIdsFWGZ
                }
                if (obj.disposalType == 4) {
                    obj.assetSystemId = this.handleForm.assetSystemId
                    obj.assetUserId = this.handleForm.assetUserId
                }
                if (obj.disposalType != 0 && obj.disposalType != 5) {
                    obj.changeLog = this.handleForm.changeLog
                }
                if (obj.disposalType == 5) {
                    obj.otherMsg = this.handleForm.otherMsg
                }
            }
            return obj
        },
        handleLeakFormParams() {
            let obj = {}
            obj.disposalType = this.handleLeakForm.disposalType
            if (obj.disposalType == 2) {
                obj.des = this.handleLeakForm.des
            }
            return obj
        }
    },
    created() {
        this.currentTab = this.$getsessionStorage('currentTab')
        this.initTask()
    },
    methods: {
        jumpAsset(value) {
            this.$setsessionStorage('currentPath', '/assets/assets_asset_info?ip=' + value)
            window.open(window.location.origin + '/#' + '/assets/assets_asset_info?ip=' + value)
        },
        jumpThreat(value) {
            let obj = {
                queryData: {
                    value
                },
                paramsData: {}
            }
            get_threat_search(obj)
                .then(res => {
                    console.log(res)
                    this.$setsessionStorage('search-item', res)
                    let route = this.$router.resolve({
                        name: 'intelligence_threat_detail',
                        query: {
                            searchStr: value
                        }
                    })
                    window.open(route.href, '_blank')
                })
                .catch(err => {
                    console.log(err + 'err')
                })
        },
        initTask() {
            let workTaskInfo = this.$getsessionStorage('workTaskInfo')
            this.$set(this, 'workTaskInfos', workTaskInfo)
            if (workTaskInfo.workMouldId === '') {
                this.seeForm.xml = xml
                if (workTaskInfo.status != 2) {
                    this.currentWorkIds = ['Activity_0tj581p']
                } else {
                    this.currentWorkIds = []
                }
            } else {
                this.seeWorkImg(workTaskInfo)
            }
            console.log('workTaskInfo', workTaskInfo)
            this.$nextTick(() => {
                // 事件处置需要的数据
                this.assetList = workTaskInfo.disposeData.assets ?? []
                this.userList = workTaskInfo.disposeData.users ?? []
                this.systemList = workTaskInfo.disposeData.systems ?? []
                this.oneKeyList = workTaskInfo.disposeData.closeObject ?? []
                if (workTaskInfo.fields) {
                    this.fieldsForm.fields = workTaskInfo.fields
                }
                this.initDetail(workTaskInfo.sourceId, workTaskInfo.workOrderId, workTaskInfo.workOrderObject)
            })
        },
        getTaskInfo() {
            return new Promise((resolve, reject) => {
                let data = {
                    queryData: {},
                    paramsData: {
                        type: this.$route.query.type,
                        workOrderId: this.$route.query.id
                    }
                }
                get_task_infoAllTask(data)
                    .then(res => {
                        if (res.records.length === 0) {
                            this.$message({
                                message: '该数据没有找到！',
                                type: 'warning'
                            })
                            return
                        }
                        resolve(res.records[0])
                    })
                    .catch(error => {
                        reject(error)
                    })
            })
        },
        toogleTab() {
            if (this.activeTabName === 'one') {
                this.activeTabName = 'two'
            } else {
                this.activeTabName = 'one'
            }
        },
        seeWorkImg(row) {
            this.workStatus = row.status == 2
            let obj = {
                workMouldId: row.workMouldId,
                processInstanceId: row.processInstanceId
            }
            get_one_workAllTask({ paramsData: obj, queryData: {}})
                .then(res => {
                    console.log(res, '查看数据')
                    this.seeForm.xml = res.xml
                    this.currentWorkIds = res?.mouldInfo?.running
                })
                .catch(err => {
                    console.log(err + 'err')
                })
            console.log(this.seeForm)
        },
        handdeelIps(ips) {
            if (typeof ips === 'string') {
                return ips
            } else {
                return ips.join(',')
            }
        },
        // 业务人员
        getassetUserId(type) {
            let selected = this.userList.filter(item => item.id == type)
            if (selected.length > 0) {
                return selected[0].chineseName
            } else {
                return ''
            }
        },
        // 业务系统
        getassetSystemId(type) {
            let selected = this.systemList.filter(item => item.id == type)
            if (selected.length > 0) {
                return selected[0].system_name
            } else {
                return ''
            }
        },
        // 设备
        getassetIds(type) {
            let selected = this.assetList.filter(item => item.id == type)
            if (selected.length > 0) {
                return selected[0].name
            } else {
                return ''
            }
        },
        getObjs(objs) {
            let arr = []
            if (objs.length > 0) {
                objs.forEach(item => {
                    let selected = this.oneKeyList.filter(tag => tag.id === item)
                    if (selected.length > 0) {
                        arr.push(selected[0].device_name)
                    }
                })
            }
            return arr.join(',')
        },
        symbolKey() {
            // eslint-disable-next-line symbol-description
            return Symbol()
        },
        // 富文本图片预览
        imageEnlargement(e) {
            console.log(e)
            if (e.target.nodeName == 'IMG') {
                // 判断点击富文本内容为img图片
                // this.eduitURL = e.target.currentSrc;
                ImagePreview({
                    images: [e.target.currentSrc], // 获取当前图片src
                    showIndex: false,
                    loop: false,
                    closeable: true
                })
            } else {
                console.log('点击内容不为img')
            }
        },
        checkShow(type) {
            this.agreeStatus = type
            this.agreeTitle = type == 1 ? '同意' : '不同意'
            this.checkDialog = true
        },
        finishDialogShow() {
            // console.log()
            let workTaskInfo = this.$getsessionStorage('workTaskInfo')
            if (workTaskInfo.workOrderObject == 1 && workTaskInfo.operation === 0) {
                this.$refs.analysisForm.validate(valid => {
                    if (!valid) {
                        console.log('error submit!!')
                        return false
                    } else {
                        this.finishDialog = true
                    }
                })
            } else if (workTaskInfo.workOrderObject == 1 && workTaskInfo.operation == 2) {
                this.$refs.handleForm.validate(valid => {
                    if (!valid) {
                        console.log('error submit!!')
                        return false
                    } else {
                        this.finishDialog = true
                    }
                })
            } else if (workTaskInfo.workOrderObject == 2 && workTaskInfo.operation == 2) {
                this.$refs.handleLeakForm.validate(valid => {
                    if (!valid) {
                        console.log('error submit!!')
                        return false
                    } else {
                        this.finishDialog = true
                    }
                })
            } else if ((workTaskInfo.workOrderObject == 1 || workTaskInfo.workOrderObject == 2) && workTaskInfo.dealType == 0) {
                this.$refs.fieldsForm.validate(valid => {
                    if (!valid) {
                        console.log('error submit!!')
                        return false
                    } else {
                        this.finishDialog = true
                    }
                })
            } else {
                this.finishDialog = true
            }
        },
        finishConfim() {
            let workTaskInfo = this.$getsessionStorage('workTaskInfo')
            let edit = []
            let handle = {}
            let paramsData = null

            // 字段编辑
            if ((workTaskInfo.workOrderObject == 1 || workTaskInfo.workOrderObject == 2) && workTaskInfo.dealType == 0) {
                edit = this.$deepCopy(this.fieldsForm.fields)
                paramsData = Object.assign(this.workTaskInfoFinish, {
                    edit: edit
                })
            }
            // 分析
            if (workTaskInfo.workOrderObject == 1 && workTaskInfo.operation === 0) {
                handle = this.$deepCopy(this.analysisFormParams)
                if (this.handleFormParams.isReject == 1) {
                    handle.reportStatus = 3
                } else {
                    handle.reportStatus = 1
                }
                paramsData = Object.assign(this.workTaskInfoFinish, {
                    handle: handle
                })
            }
            // 变更状态
            if (workTaskInfo.workOrderObject == 1 && workTaskInfo.operation == 1) {
                handle = this.$deepCopy(this.alarmStatusForm)
                paramsData = Object.assign(this.workTaskInfoFinish, {
                    handle: handle
                })
            }
            // 事件处置
            if (workTaskInfo.workOrderObject == 1 && workTaskInfo.operation == 2) {
                handle = this.$deepCopy(this.handleFormParams)
                if (this.handleFormParams.isReject == 1) {
                    handle.reportStatus = 3
                } else {
                    handle.reportStatus = 2
                }
                paramsData = Object.assign(this.workTaskInfoFinish, {
                    handle: handle
                })
            }
            // 漏洞处置
            if (workTaskInfo.workOrderObject == 2 && workTaskInfo.operation == 2) {
                handle = this.$deepCopy(this.handleLeakFormParams)
                paramsData = Object.assign(this.workTaskInfoFinish, {
                    handle: handle
                })
            }
            // 溯源
            if (workTaskInfo.workOrderObject == 1 && workTaskInfo.operation == 3) {
                handle = this.$deepCopy(this.backForm)
                handle.reportStatus = 1
                handle.isTrace = 1
                paramsData = Object.assign(this.workTaskInfoFinish, {
                    handle: handle
                })
            }
            // 二线分析
            if (workTaskInfo.workOrderObject == 1 && workTaskInfo.operation == 4) {
                handle = this.$deepCopy(this.alarmAddviceForm)
                paramsData = Object.assign(this.workTaskInfoFinish, {
                    handle: handle
                })
            }
            // 审核
            if (this.currentTab == 1 && workTaskInfo.dealType == 2) {
                paramsData = this.$deepCopy(this.workTaskInfoFinish)
                paramsData.approve = this.agreeStatus
                paramsData.approveOpinion = this.checkkForm.approveOpinion
            }
            // 备注
            if (workTaskInfo.workOrderObject != 1 && workTaskInfo.workOrderObject != 2) {
                if (this.checkDialog) {
                    paramsData = this.$deepCopy(this.workTaskInfoFinish)
                    paramsData.approve = this.agreeStatus
                    paramsData.approveOpinion = this.checkkForm.approveOpinion
                }
                if (this.finishDialog) {
                    handle = this.$deepCopy(this.otherForm)
                    this.workTaskInfoFinish.approve = 1
                    paramsData = Object.assign(this.workTaskInfoFinish, {
                        handle: handle
                    })
                }
            }

            console.log('paramsData', paramsData)
            let data = {
                queryData: {},
                paramsData: paramsData
            }
            //
            finish_workTask(data)
                .then(res => {
                    console.log('工单任务完成', res)
                    this.finishDialog = false
                    this.checkDialog = false
                    this.$message({
                        message: '操作成功！',
                        type: 'success'
                    })
                    setTimeout(() => {
                        this.$router.go(-1)
                    }, 1500)
                })
                .catch(err => {
                    console.log(err, 'err')
                })
        },
        dateFormat_inner(row, column, cellValue, index) {
            if (!row.callDateTime) {
                return ''
            }
            var date = new Date(parseInt(row.callDateTime)) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
            var Y = date.getFullYear() + '-'
            var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
            var D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' '
            var h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':'
            var m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':'
            var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
            return Y + M + D + h + m + s
        },
        back() {
            this.$router.go(-1)
        },
        handleSee(activity) {
            this.historyDialog = true
        },
        detailData(row) {
            console.log(row)
            this.detailArr = row
            if (this.detailArr.messaggioOriginale) {
                this.detailArr.messaggioOriginale = this.detailArr.messaggioOriginale.replace(/##/g, '"')
            }
            this.detailDialog = true
        },
        initDetail(sourceId, workOrderId, workOrderObject) {
            let data = {
                queryData: {},
                paramsData: {
                    workOrderObject: workOrderObject,
                    sourceId: sourceId,
                    workOrderId: workOrderId
                }
            }
            get_workTask_detailAllTask(data)
                .then(res => {
                    console.log('工单任务详情', res)
                    this.$set(this, 'leaksInfo', res.leaksInfo)
                    this.$set(this, 'alarmInfo', res.alarmInfo)
                    if (res.alarmInfo) {
                        this.msg = res.alarmInfo.msg
                    }

                    let arr = []
                    if (res.bpmRecord.length > 0) {
                        res.bpmRecord.forEach((item, index) => {
                            item.size = 'large'
                            item.isOpen = true
                            item.color = 'rgba(0,0,0,1)'
                            item.icon = index === 0 ? 'el-icon-circle-check' : 'iconfont icon-circle'
                            item.dealContent = item.dealType === 2 ? item.approveOpinion : JSON.parse(item.dealContent)
                            arr.push(item)
                        })
                    }
                    this.bpmRecord = arr
                })
                .catch(err => {
                    console.log(err, 'err')
                })
        },
        fieldToChinese(params) {
            let obj = {
                // callDateTime: '事件接收时间', // 操作时间
                srcIp: '源地址',
                operation: '操作',
                srcPort: '源端口',
                desIp: '目的地址',
                desPort: '目的端口',
                result: '攻击结果',
                callDuration: '持续时间',
                response: '响应',
                // content: '事件名称',
                eventCategory: '事件分类',
                agreement: '网络协议',
                hostIp: '设备地址',
                alarmName: '设备名称',
                alarmType: '设备类型',
                messaggioOriginale: '原始消息',
                alternateField1: '备用字段1',
                alternateField2: '备用字段2',
                alternateField3: '备用字段3',
                alternateField4: '备用字段4',
                alternateField5: '备用字段5', // 以上安全设备日志
                IPv: 'IP版本',
                protocal: '协议名称',
                streamBegin: '流起始时间',
                streamEnd: '流结束时间',
                // content: '流量包内容',
                sentPacketsNum: '发出的报文包数',
                sentBytesNum: '发出的报文字节数',
                acceptPacketsNum: '接收的报文包数',
                acceptBytesNum: '接收的报文字节数',
                srcIpNAT: 'NAT转换前源地址',
                srcPortNAT: 'NAT转换前源端口',
                desIpNAT: 'NAT转换前目的地址',
                desPortNAT: 'NAT转换前目的端口', // 以上为流日志字段
                userName: '用户名称',
                command: '操作',
                hostName: '主机名称',
                hostType: '设备类型',
                eventLevel: '事件等级',
                subject: '事件名称',
                source: '来源',
                eventId: '事件ID',
                taskType: '任务类别' // 以上为主机日志字段
            }
            if (this.detailArr.agreement) {
                obj.content = '事件名称'
                obj.callDateTime = '事件接收时间'
            } else if (this.detailArr.protocal) {
                obj.content = '流量包内容'
            } else if (this.detailArr.userName) {
                obj.callDateTime = '操作时间'
            }
            if (obj[params]) {
                return obj[params] + ' / ' + params + '：'
            } else {
                return params + '：'
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.table-container {
    display: flex;
    justify-content: flex-start;
    width: 50%;
    // &:nth-child(2n) {
    //     background-color: rgba(29, 65, 105, 0.5);
    // }
}
.work-detail {
    margin: 10px;
}

.click-btn {
    cursor: pointer;
    font-size: 12px;
    i {
        margin-right: 5px;
        color: #0052d9;
    }
    span.val {
        color: #00fffe;
    }
}
.click-btn:hover {
    background: #ebf1f5;
}

.tab-button {
    height: 30px;
    background-color: #fff;
    margin-bottom: 2px;

    & div {
        width: 80px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        cursor: pointer;
        color: rgba(0, 0, 0, 0.6);
        box-sizing: border-box;
        font-size: 14px;

        &.tab-active {
            color: #387dee;
            border-bottom: 1px solid #387dee;;
        }
    }
}
.table-left,
.table-right {
    font-size: 16px;
    border: 1px solid #ddd;
    color: rgba(0, 0, 0, 0.9);
    padding: 4px 10px;
}

.table-left {
    background-color: #ebf1f5;
    flex-shrink: 0;
    border-right: none;
    padding-right: 10px;
    text-align: right;
    width: 160px !important;
    /*white-space: nowrap;*/
}

.table-right {
    width: calc(100% - 160px);
}

.event {
    padding: 0px 0px 0px 0px;
    box-sizing: border-box;
    position: relative;
}
.event-content {
    background-color: #fff;
}
.event ::v-deep .el-timeline-item__wrapper {
    border-left: 1px solid #00b7ee;
    margin-left: 4px;
}
.event ::v-deep .el-timeline-item__node--large {
    z-index: 2;
    background-color: #387dee!important;
}
.event ::v-deep .el-timeline-item__timestamp.is-top {
    margin-bottom: 8px;
    padding-top: 3px;
    position: absolute;
    left: -145px;
    top: 0;
    font-size: 12px;
    width: 130px;
    text-align: right;
    color: rgba(0, 0, 0, 0.9);
}

.event ::v-deep .el-range-input {
    background-color: rgba(0, 0, 0, 0);
    color: rgba(0, 0, 0, 0.9);
}

.event ::v-deep .el-range-separator {
    color: rgba(0, 0, 0, 0.9);
}

.el-tabs ::v-deep .el-tabs__nav-wrap::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1px;
    background-color: rgba(28, 215, 250, 0.2);
    z-index: 1;
}

.el-tabs ::v-deep .el-tabs__active-bar {
    background: #0052d9;
    margin-left: 14px;
}

.el-tabs ::v-deep .el-tabs__item.is-active {
    color: #0052d9;
    height: 34px;
    line-height: 34px;
    border-color: transparent;
}
// .el-tabs ::v-deep .el-tabs__item.is-top {

// }
.info-title {
    // margin-left: 14px;
    font-size: 12px;
    color: #0052d9;
    margin-bottom: 18px;
}

.task-status {
    padding-right: 30px;
    box-sizing: border-box;
    margin: 16px 0 30px;
}

.task-status > div:nth-child(1) {
    color: rgba(0, 0, 0, 0.9);
    font-size: 22px;
}

.assets-big-image ::v-deep .el-image-viewer__close {
    color: #00e1ff !important;
}

.task-status > div:nth-child(2) {
    color: rgba(0, 0, 0, 0.9);
    font-size: 12px;

    span.one {
        color: #c0c0c0;
    }

    span.two {
        color: #fdb900;
    }

    span.three {
        color: #00bffe;
    }
}

.label {
    width: 120px;
    border: 1px solid #ddd;
    height: 32px;
    font-size: 12px;
    padding: 8px;
    color: #999;
    text-align: left;
    background-color: #ebf1f5;
}

.label-val {
    font-size: 12px;
    height: 32px;
    padding: 8px;
    border: 1px solid #ebf1f5;
    color: rgba(0, 0, 0, 0.9);
}

.event ::v-deep .el-timeline-item__tail {
    border-left: 2px solid #00b7ee !important;
}

.event ::v-deep .el-timeline-item__icon.el-icon-circle-check {
    color: #fff !important;
    font-size: 20px !important;
}

.event ::v-deep .el-timeline-item__icon.icon-circle {
    color: #00b7ee !important;
    font-size: 16px !important;
    font-weight: 500;
}

.time-box {
    width: 100%;
    height: 20px;
    margin-bottom: 10px;
}

.time-left > h4 {
    color: rgba(0, 0, 0, 0.9);
    font-weight: 500;
}

.time-left > p {
    color: #999;
    font-size: 12px;
    margin-top: 5px;
}

.time-right > div.one {
    color: #c0c0c0;
}

.time-right > div.two {
    color: #fdb900;
}

.time-right > div.three {
    color: #00bffe;
}

.time-right > p {
    color: rgba(0, 0, 0, 0.9);
    font-size: 12px;
    margin-top: 5px;
}
.event ::v-deep .el-table__empty-block {
    background-color: #fff;
}

.event ::v-deep .edui-editor-iframeholder {
    height: 200px !important;
}
.list-tips .el-icon-sort {
    cursor: pointer;
    margin-left: 10px;
    transform: rotate(90deg);
    color: #00fffe;
}
</style>
<style>
.add-search-order.el-popover{
    background: #fff;
    /* box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.59) inset; */
    border: solid 1px #ddd;
    color: rgba(0, 0, 0, 0.9);
}

.time-text-box {
    padding: 5px;
    background-color: #f5f8fe;
    border-radius: 3px;
    border: solid 1px #dddddd;
}
.time-text-box-item {
    margin: 10px 0;
    overflow: hidden;
}
.time-text-box-left {
    float: left;
    font-size: 12px;
    letter-spacing: 1px;
    color: rgba(0, 0, 0, 0.4);
    margin-right: 10px;
    vertical-align: top;
}
.time-box-item-bottom div {
    display: inline-block;
}
.time-text-box-bottom {
    margin-right: 40px;
}
.time-text-box-bottom i {
    font-size: 10px;
    color: #999;
}
.time-text-box-bottom span {
    font-size: 10px;
    color: #999;
}
.time-text-box-right {
    width: 88%;
    float: left;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.9);
    vertical-align: top;
}
.time-text-box-right * {
    word-break: break-all;
}

.time-text-box-right p {
    font-size: 12px !important;
}

.time-text-box-right img {
    max-width: 50% !important;
}
</style>
