<template>
    <div class="event work-detail" style="position: relative;">
        <div class="ub w100" style="box-sizing: border-box;">
            <div class="event-content w100" :style="{'min-height': window.screen.width > 1600 ? '820px' : '510px'}">
                <div class="tab-button ub" @click="toogleTab">
                    <div class="work-btn"  :class="{'tab-active': activeTabName === 'one'}">任务详情</div>
                    <div class="draft-btn" :class="{'tab-active': activeTabName === 'two'}">流程图</div>
                </div>
                <div class="ub ub-pj w100" style="padding: 20px;">
                    <div>{{ workTaskInfo.workOrderName }}</div>
                    <div>
                        <!-- <cancel-btn @click="back" title="返 回" /> -->
                        <el-button @click="back" size="small">返 回</el-button>
                        <el-button type="primary" v-if="currentTab==1&&workTaskInfo.dealType==2 && activeTabName==='one'" size="small" @click="checkShow(0)">不同意</el-button>
                        <!-- <searchBtn style="margin-left:10px;" v-if="currentTab==1&&workTaskInfo.dealType==2 && activeTabName==='one'" title="不同意" bgc="no_aggary" @click="checkShow(0)" /> -->
                        <!-- <searchBtn style="margin-left:10px;" v-if="currentTab==1&&workTaskInfo.dealType==2 && activeTabName==='one'" title="同 意" @click="checkShow(1)" /> -->
                        <el-button type="primary" v-if="currentTab==1&&workTaskInfo.dealType==2 && activeTabName==='one'" size="small" @click="checkShow(1)">同 意</el-button>
                        <el-button type="primary" v-if="currentTab==1&&workTaskInfo.dealType!=2 && activeTabName==='one'" size="small" @click="finishDialogShow">完成任务</el-button>
                        <!-- <searchBtn style="margin-left:10px;" v-if="currentTab==1&&workTaskInfo.dealType!=2 && activeTabName==='one'" title="完成任务" @click="finishDialogShow" /> -->
                    </div>
                </div>
                <div v-if="activeTabName === 'one'" style="padding: 0 20px 20px;">
                    <div class="info-title">基本信息</div>
                    <div class="basic-info">
                        <el-descriptions size="mini" title="" :column="2" border>
                            <el-descriptions-item label="工单编号">{{workTaskInfo.workOrderId | NullStr}}</el-descriptions-item>
                            <el-descriptions-item label="工单名称">{{workTaskInfo.workOrderName | NullStr}}</el-descriptions-item>
                            <el-descriptions-item label="工单类型">{{workTaskInfo.workOrderObjectName | NullStr}}</el-descriptions-item>
                            <el-descriptions-item label="优先级">
                                <span v-if="workTaskInfo.level==1" style="color: #ff0000;">
                                    {{workTaskInfo.level|getLevel}}
                                </span>
                                <span v-else-if="workTaskInfo.level==2" style="color: #ffdd00;">
                                    {{workTaskInfo.level|getLevel}}
                                </span>
                                <span v-else style="color: #00e1fd;">
                                    {{workTaskInfo.level|getLevel}}
                                </span>
                            </el-descriptions-item>
                            <el-descriptions-item label="工单状态">
                                {{workTaskInfo.status|getTaskStatus}}
                            </el-descriptions-item>
                            <el-descriptions-item label="当前节点">
                                {{workTaskInfo.runningNodeName|getRunningNodeName}}
                            </el-descriptions-item>
                            <el-descriptions-item label="当前节点状态">
                                <span v-if="workTaskInfo.currentNodeStatus==='待处理'" style="color: #ffba00;">{{workTaskInfo.currentNodeStatus}}</span>
                                <span v-if="workTaskInfo.currentNodeStatus==='已超时'" style="color: #ff00e4;">{{workTaskInfo.currentNodeStatus}}</span>
                                <span v-if="workTaskInfo.currentNodeStatus==='已撤销'" style="color: #cccccc;">{{workTaskInfo.currentNodeStatus}}</span>
                                <span v-if="workTaskInfo.currentNodeStatus==='已完成'" style="color: lightgreen;">{{workTaskInfo.currentNodeStatus}}</span>
                            </el-descriptions-item>
                            <el-descriptions-item label="创建人">
                                {{workTaskInfo.createUser | NullStr}}
                            </el-descriptions-item>
                            <el-descriptions-item label="创建时间">
                                {{workTaskInfo.createTime | NullStr}}
                            </el-descriptions-item>
                            <el-descriptions-item label="接收时间">
                                {{workTaskInfo.receiveTime | NullStr}}
                            </el-descriptions-item>
                            <el-descriptions-item :label="currentTab === '1' ? '当前节点处理人' : '待办节点处理人'">
                                {{workTaskInfo.players | NullStr}}
                            </el-descriptions-item>
                            <el-descriptions-item :label="currentTab === '1' ? '当前节点描述' : '待办节点描述'">
                                {{workTaskInfo.nodeDes | NullStr}}
                            </el-descriptions-item>
                            <el-descriptions-item label="工单描述">
                                <div v-html="workTaskInfo.workOrderContent"></div>
                            </el-descriptions-item>
                            <el-descriptions-item label=""></el-descriptions-item>
                        </el-descriptions>
                        <img class="chapter" v-if="workTaskInfo.status==0" src="../../assets/img/work_order/ycx.png" alt="">
                        <img class="chapter" v-if="workTaskInfo.status==1" src="../../assets/img/work_order/jxz.png" alt="">
                        <img class="chapter" v-if="workTaskInfo.status==2" src="../../assets/img/work_order/ywc.png" alt="">
                    </div>
                    <div v-if="workTaskInfo.workOrderObject == 1" style="margin-top: 20px;" class="info-title">事件详情</div>
                    <div v-if="workTaskInfo.workOrderObject == 1">
                        <el-row style='margin: 20px 0;' type="flex" justify="start">
                            <div class="ub" style="width: 100%;">
                                <!-- <div class="label">原始日志：</div> -->
                                <div class="ub ub-f1">
                                    <div class="ub ub-ver ub-f1">
                                        <el-table
                                            ref="multipleTable3"
                                            v-loading="loading"
                                            class='bigTable'
                                            style="min-height: auto;"
                                            :data="alarmInfoTable"
                                            border
                                            stripe
                                            tooltip-effect="dark">
                                            <el-table-column
                                                fixed="left"
                                                align="center"
                                                type="index"
                                                width="50"
                                                class-name="deepBg"
                                                :index="(dex) => (paramsArry.page-1) * paramsArry.size + dex + 1"
                                                label="序号">
                                            </el-table-column>
                                            <el-table-column prop="createTime" label="事件时间"></el-table-column>
                                            <el-table-column prop="reportName" label="事件名称"></el-table-column>
                                            <el-table-column prop="srcIp" label="源IP">
                                                <template slot-scope="scope">
                                                    <div>
                                                        <el-popover popper-class="add-search-order-detail" placement="bottom" title="" trigger="click">
                                                            <div>
                                                                <p
                                                                    @click="jumpAsset(scope.row.srcIp)"
                                                                    class="ub ub-ac click-btn"
                                                                >
                                                                    <i class="iconfont icon-chaxunzichan" style="font-size: 12px;"></i>
                                                                    <span>查询资产</span>
                                                                </p>
                                                                <p
                                                                    style="margin-top: 10px;"
                                                                    @click="jumpThreat(scope.row.srcIp)"
                                                                    class="ub ub-ac click-btn"
                                                                >
                                                                    <i class="iconfont icon-chaxunqingbao" style="font-size: 12px;"></i>
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
                                            <el-table-column prop="desIp" label="目的IP">
                                                <template slot-scope="scope">
                                                    <div>
                                                        <el-popover popper-class="add-search-order-detail" placement="bottom" title="" trigger="click">
                                                            <div>
                                                                <p
                                                                    @click="jumpAsset(scope.row.desIp)"
                                                                    class="ub ub-ac click-btn"
                                                                >
                                                                    <i class="iconfont icon-chaxunzichan" style="font-size: 12px;"></i>
                                                                    <span>查询资产</span>
                                                                </p>
                                                                <p
                                                                    style="margin-top: 10px;"
                                                                    @click="jumpThreat(scope.row.desIp)"
                                                                    class="ub ub-ac click-btn"
                                                                >
                                                                    <i class="iconfont icon-chaxunqingbao" style="font-size: 12px;"></i>
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
                                            <el-table-column prop="desPort" label="目的端口"></el-table-column>
                                            <el-table-column prop="reportTypeName" label="事件类型"></el-table-column>
                                            <el-table-column prop="reportStatus" label="事件状态">
                                                <template slot-scope="scope">
                                                    <div>
                                                        <div v-if="scope.row.reportStatus == 0" class="ub ub-ac match-state one">
                                                            <div></div>
                                                            <div>待确认</div>
                                                        </div>
                                                        <div v-if="scope.row.reportStatus == 1" class="ub ub-ac match-state two">
                                                            <div></div>
                                                            <div>已确认</div>
                                                        </div>
                                                        <div v-if="scope.row.reportStatus == 2" class="ub ub-ac match-state three">
                                                            <div></div>
                                                            <div>已处置</div>
                                                        </div>
                                                        <div v-if="scope.row.reportStatus == 3" class="ub ub-ac match-state alarm four">
                                                            <div></div>
                                                            <div>已驳回</div>
                                                        </div>
                                                    </div>
                                                </template>
                                            </el-table-column>
                                            <el-table-column align="center" label="操作" fixed="right" class-name="deepBg" width="80">
                                                <template slot-scope="scope">
                                                    <el-button type="text" @click="detailData(scope.row)">详情</el-button>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </div>
                                </div>
                            </div>
                        </el-row>
                    </div>
                    <div v-if="workTaskInfo.workOrderObject == 2" style="margin-top: 20px;" class="info-title">漏洞详情</div>
                    <div v-if="workTaskInfo.workOrderObject == 2">
                        <el-row style='margin: 10px 0;' type="flex" justify="start">
                            <div class="ub" style="width: 33%;">
                                <div class="label">漏洞名称：</div>
                                <div class="ub ub-f1 line1 label-val">{{leaksInfo.nodeName | NullStr}}</div>
                            </div>
                            <div class="ub" style="width: 33%;">
                                <div class="label">漏洞类型：</div>
                                <div class="ub ub-f1 line1 label-val">{{leaksInfo.leakTypeCN | NullStr}}</div>
                            </div>
                            <div class="ub" style="width: 33%;">
                                <div class="label">漏洞级别：</div>
                                <div class="ub ub-f1 line1 label-val">
                                    <span style="color: #00a2ff;" v-if="leaksInfo.riskLevel==1">
                                        {{leaksInfo.riskLevelCN}}
                                    </span>
                                    <span style="color: #f2cd00;" v-if="leaksInfo.riskLevel==2">
                                        {{leaksInfo.riskLevelCN}}
                                    </span>
                                    <span style="color: #f86900;" v-if="leaksInfo.riskLevel==3">
                                        {{leaksInfo.riskLevelCN}}
                                    </span>
                                    <span style="color: #19b0b1;" v-if="leaksInfo.riskLevel==4">
                                        {{leaksInfo.riskLevelCN}}
                                    </span>
                                </div>
                            </div>
                        </el-row>
                        <el-row style='margin: 20px 0;' type="flex" justify="start">
                            <div class="ub" style="width: 33%;">
                                <div class="label">修复建议：</div>
                                <div class="ub ub-f1 line1 label-val">
                                    {{leaksInfo.repairAdvice | NullStr}}
                                </div>
                            </div>
                            <div class="ub" style="width: 33%;">
                                <div class="label">简短描述：</div>
                                <div class="ub ub-f1 line1 label-val">{{leaksInfo.shortDesc | NullStr}}</div>
                            </div>
                            <div class="ub" style="width: 33%;">
                                <div class="label">详细描述：</div>
                                <div class="ub ub-f1 line1 label-val">{{leaksInfo.fullDesc | NullStr}}</div>
                            </div>
                        </el-row>
                        <el-row style='margin: 20px 0;' type="flex" justify="start">
                            <div class="ub" style="width: 33%;">
                                <div class="label">漏洞CVSS分值：</div>
                                <div class="ub ub-f1 line1 label-val">{{leaksInfo.cvssScore | NullStr}}</div>
                            </div>
                            <div class="ub" style="width: 33%;">
                                <div class="label">CVE编号：</div>
                                <div class="ub ub-f1 line1 label-val">{{leaksInfo.cveTag | NullStr}}</div>
                            </div>
                            <div class="ub" style="width: 33%;">
                                <div class="label">CNVD编号：</div>
                                <div class="ub ub-f1 line1 label-val">{{leaksInfo.cnvdTag | NullStr}}</div>
                            </div>
                        </el-row>
                        <el-row style='margin: 20px 0;' type="flex" justify="start">
                            <div class="ub" style="width: 33%;">
                                <div class="label">CNNVD编号：</div>
                                <div class="ub ub-f1 line1 label-val">{{leaksInfo.cnnvdTag | NullStr}}</div>
                            </div>
                            <div class="ub" style="width: 33%;">
                                <div class="label">CNCVE编号：</div>
                                <div class="ub ub-f1 line1 label-val">{{leaksInfo.cncveTag | NullStr}}</div>
                            </div>
                            <div class="ub" style="width: 33%;">
                                <div class="label">BUGTRAP：</div>
                                <div class="ub ub-f1 line1 label-val">{{leaksInfo.bugTraqTag | NullStr}}</div>
                            </div>
                        </el-row>
                        <el-row style='margin: 20px 0;' type="flex" justify="start">
                            <div class="ub" style="width: 33%;">
                                <div class="label">更新时间：</div>
                                <div class="ub ub-f1 line1 label-val">{{leaksInfo.updateTime | NullStr}}</div>
                            </div>
                            <div class="ub" style="width: 33%;">
                                <div class="label">影响平台：</div>
                                <div class="ub ub-f1 line1 label-val">{{leaksInfo.platforms | NullStr}}</div>
                            </div>
                            <div class="ub" style="width: 33%;">
                                <div class="label">创建时间：</div>
                                <div class="ub ub-f1 line1 label-val">{{leaksInfo.createTime | NullStr}}</div>
                            </div>
                        </el-row>
                        <el-row style='margin: 20px 0;' type="flex" justify="start">
                            <div class="ub" style="width: 33%;">
                                <div class="label">漏洞端口：</div>
                                <div class="ub ub-f1 line1 label-val">{{leaksInfo.port | NullStr}}</div>
                            </div>
                            <div class="ub" style="width: 33%;">
                                <div class="label">服务名称：</div>
                                <div class="ub ub-f1 line1 label-val">{{leaksInfo.serviceName | NullStr}}</div>
                            </div>
                            <div class="ub" style="width: 33%;">
                                <div class="label">检查结果：</div>
                                <div class="ub ub-f1 line1 label-val">{{leaksInfo.checkResult | NullStr}}</div>
                            </div>
                        </el-row>
                        <el-row style='margin: 20px 0;' type="flex" justify="start">
                            <div class="ub" style="width: 33%;">
                                <div class="label">检查类型：</div>
                                <div class="ub ub-f1 line1 label-val">{{leaksInfo.checkType | NullStr}}</div>
                            </div>
                            <div class="ub" style="width: 33%;">
                                <div class="label">合规项描述：</div>
                                <div class="ub ub-f1 line1 label-val">{{leaksInfo.compliance | NullStr}}</div>
                            </div>
                            <div class="ub" style="width: 33%;">
                                <div class="label">加固方案：</div>
                                <div class="ub ub-f1 line1 label-val">{{leaksInfo.reinforcement | NullStr}}</div>
                            </div>
                        </el-row>
                        <el-row style='margin: 20px 0;' type="flex" justify="start">
                            <div class="ub" style="width: 33%;">
                                <div class="label">漏洞URL：</div>
                                <div class="ub ub-f1 line1 label-val">{{leaksInfo.leakUrl | NullStr}}</div>
                            </div>
                            <div class="ub" style="width: 33%;">
                                <div class="label">网站名称：</div>
                                <div class="ub ub-f1 line1 label-val">{{leaksInfo.webName | NullStr}}</div>
                            </div>
                            <div class="ub" style="width: 33%;">
                                <div class="label">提交类型：</div>
                                <div class="ub ub-f1 line1 label-val">{{leaksInfo.submitType | NullStr}}</div>
                            </div>
                        </el-row>
                        <el-row style='margin: 20px 0;' type="flex" justify="start">
                            <div class="ub" style="width: 33%;">
                                <div class="label">测试数据：</div>
                                <div class="ub ub-f1 line1 label-val">{{leaksInfo.testData | NullStr}}</div>
                            </div>
                            <div class="ub" style="width: 33%;">
                                <div class="label">post数据：</div>
                                <div class="ub ub-f1 line1 label-val">{{leaksInfo.postData | NullStr}}</div>
                            </div>
                        </el-row>
                    </div>

                    <div class="w100" v-if="currentTab==1">
                        <div class="info-title">{{workTaskInfo.dealType===2?'审批内容':'节点操作'}}</div>
                        <div class="w100">
                            <!-- 事件/漏洞 字段编辑 -->
                            <div class="w100" v-if="(workTaskInfo.workOrderObject == 1||workTaskInfo.workOrderObject == 2)&&(workTaskInfo.dealType===0||workTaskInfo.dealType===2)">
                                <el-form class="w100" :model="fieldsForm" ref="fieldsForm" :inline="true">
                                    <div
                                        :style="{
                                            display:'inline-block',
                                            width:item.valType==='richText'?'100%':'48%',
                                            marginBottom: '10px',
                                        }"
                                        v-for="(item,index) in fieldsForm.fields"
                                        :key="index">
                                        <div v-if="item.valType==='text'" style="width: 100%;">
                                            <el-form-item
                                                v-if="item.type=='0'"
                                                :style="{
                                                    width:'100%',
                                                    marginBottom: '20px',
                                                }"
                                                :label="item.name+':'"
                                                :label-width="formLabelWidth">
                                                <el-input
                                                    disabled
                                                    style="width: 400px;"
                                                    placeholder="请输入"
                                                    v-model="item.val"
                                                    size="small"></el-input>
                                            </el-form-item>

                                            <el-form-item
                                                v-else
                                                :style="{
                                                    width:'100%',
                                                    marginBottom: '20px',
                                                }"
                                                :label="item.name+':'"
                                                :prop="'fields.'+ index +'.val'"
                                                :rules="[
                                                    { required: true, message: item.name, trigger: 'blur' },
                                                ]"
                                                :label-width="formLabelWidth">
                                                <el-input
                                                    style="width: 400px;"
                                                    placeholder="请输入"
                                                    clearable
                                                    v-model="item.val"
                                                    size="small"></el-input>
                                            </el-form-item>

                                        </div>
                                        <div v-if="item.valType==='textArea'" style="width: 100%;">
                                            <el-form-item
                                                v-if="item.type=='0'"
                                                :style="{
                                                    width:'100%',
                                                    marginBottom: '20px',
                                                }"
                                                :label="item.name+':'"
                                                :label-width="formLabelWidth">
                                                <el-input
                                                    type="textarea"
                                                    disabled
                                                    style="width: 400px;"
                                                    placeholder="请输入"
                                                    v-model="item.val"
                                                    size="small"></el-input>
                                            </el-form-item>

                                            <el-form-item
                                                v-else
                                                :style="{
                                                    width:'100%',
                                                    marginBottom: '20px',
                                                }"
                                                :label="item.name+':'"
                                                :prop="'fields.'+ index +'.val'"
                                                :rules="[
                                                    { required: true, message: item.name, trigger: 'blur' },
                                                ]"
                                                :label-width="formLabelWidth">
                                                <el-input
                                                    type="textarea"
                                                    style="width: 400px;"
                                                    placeholder="请输入"
                                                    clearable
                                                    v-model="item.val"
                                                    size="small"></el-input>
                                            </el-form-item>

                                        </div>

                                        <div v-if="item.valType==='select'" style="width: 100%;">
                                            <el-form-item
                                                v-if="item.type=='0'"
                                                :style="{
                                                    width:'100%',
                                                    marginBottom: '20px',
                                                }"
                                                :label="item.name+':'"
                                                :label-width="formLabelWidth"
                                            >

                                                <el-select
                                                    disabled
                                                    placeholder="请选择"
                                                    style="width: 400px;"
                                                    v-model="item.val"
                                                    size="small">
                                                    <el-option v-for="(tag,_index) in item.item" :label="tag.value" :value="tag.key" :key="_index"></el-option>
                                                </el-select>

                                            </el-form-item>
                                            <el-form-item
                                                v-else
                                                :style="{
                                                    width:'100%',
                                                    marginBottom: '20px',
                                                }"
                                                :label="item.name+':'"
                                                :prop="'fields.'+ index +'.val'"
                                                :rules="[
                                                    { required: true, message: item.name, trigger: 'change' },
                                                ]"
                                                :label-width="formLabelWidth">

                                                <el-select
                                                    placeholder="请选择"
                                                    style="width: 400px;"
                                                    v-model="item.val"
                                                    size="small">
                                                    <el-option v-for="(tag,_index) in item.item" :label="tag.value" :value="tag.key" :key="_index"></el-option>
                                                </el-select>

                                            </el-form-item>
                                        </div>
                                        <div v-if="item.valType==='richText'" class="w100">
                                            <el-form-item
                                                v-if="item.type=='0'"
                                                :style="{
                                                    width:'100%',
                                                    marginBottom: '20px',
                                                }"
                                                :label="item.name+':'"
                                                :label-width="formLabelWidth">
                                                <div class="ub ub-pc rich-text-width" style="position: relative;">
                                                    <vue-ueditor-wrap v-model="item.val" :config="myConfig" :readonly="true"></vue-ueditor-wrap>
                                                </div>
                                            </el-form-item>
                                            <el-form-item
                                                v-else
                                                :style="{
                                                    width:'100%',
                                                    marginBottom: '20px',
                                                }"
                                                :label="item.name+':'"
                                                :prop="'fields.'+ index +'.val'"
                                                :rules="[
                                                    { required: true, message: item.name, trigger: 'blur' },
                                                ]"
                                                :label-width="formLabelWidth">
                                                <div class="ub ub-pc rich-text-width" style="position: relative;">
                                                    <vue-ueditor-wrap v-model="item.val" :config="myConfig" ></vue-ueditor-wrap>
                                                </div>
                                            </el-form-item>
                                        </div>
                                    </div>

                                </el-form>
                            </div>

                            <!-- 自定义 字段编辑 -->
                            <div class="w100" v-if="!['1','2','3','4','5'].includes(workTaskInfo.workOrderObject)">
                                <el-form class="w100" :model="fieldsForm" ref="fieldsForm" :inline="true">
                                    <div
                                        :style="{
                                            display:'inline-block',
                                            width:item.fieldType==5?'100%':'48%',
                                            marginBottom: '10px',
                                        }"
                                        v-for="(item,index) in fieldsForm.fields"
                                        :key="index">
                                        <div v-if="item.fieldType==1" style="width: 100%;">
                                            <el-form-item
                                                v-if="item.type=='0'"
                                                :style="{
                                                    width:'100%',
                                                    marginBottom: '20px',
                                                }"
                                                :label="item.name+':'"
                                                :label-width="formLabelWidth">
                                                <el-input
                                                    disabled
                                                    style="width: 400px;"
                                                    placeholder="请输入"
                                                    v-model="item.val"
                                                    maxlength="50"
                                                    size="small"></el-input>
                                            </el-form-item>

                                            <el-form-item
                                                v-else
                                                :style="{
                                                    width:'100%',
                                                    marginBottom: '20px',
                                                }"
                                                :label="item.name+':'"
                                                :prop="'fields.'+ index +'.val'"
                                                :rules="[
                                                    { required: true, message: item.name, trigger: 'blur' },
                                                ]"
                                                :label-width="formLabelWidth">
                                                <el-input
                                                    style="width: 400px;"
                                                    placeholder="请输入"
                                                    clearable
                                                    v-model="item.val"
                                                    maxlength="50"
                                                    size="small"></el-input>
                                            </el-form-item>

                                        </div>
                                        <div v-if="item.fieldType==2" style="width: 100%;">
                                            <el-form-item
                                                v-if="item.type=='0'"
                                                :style="{
                                                    width:'100%',
                                                    marginBottom: '20px',
                                                }"
                                                :label="item.name+':'"
                                                :label-width="formLabelWidth">
                                                <el-input
                                                    disabled
                                                    type="number"
                                                    style="width: 400px;"
                                                    placeholder="请输入"
                                                    v-model="item.val"
                                                    maxlength="50"
                                                    size="small"></el-input>
                                            </el-form-item>

                                            <el-form-item
                                                v-else
                                                :style="{
                                                    width:'100%',
                                                    marginBottom: '20px',
                                                }"
                                                :label="item.name+':'"
                                                :prop="'fields.'+ index +'.val'"
                                                :rules="[
                                                    { required: true, message: item.name, trigger: 'blur' },
                                                ]"
                                                :label-width="formLabelWidth">
                                                <el-input
                                                    style="width: 400px;"
                                                    placeholder="请输入"
                                                    clearable
                                                    type="number"
                                                    v-model="item.val"
                                                    maxlength="50"
                                                    size="small"></el-input>
                                            </el-form-item>

                                        </div>
                                        <div v-if="item.fieldType==3" style="width: 100%;">
                                            <el-form-item
                                                v-if="item.type=='0'"
                                                :style="{
                                                    width:'100%',
                                                    marginBottom: '20px',
                                                }"
                                                :label="item.name+':'"
                                                :label-width="formLabelWidth">
                                                <el-date-picker
                                                    disabled
                                                    style="width: 400px;"
                                                    v-model="item.val"
                                                    align="right"
                                                    type="date"
                                                    size="small"
                                                    value-format="yyyy-MM-dd"
                                                    placeholder="选择日期"
                                                    :picker-options="pickerOptions">
                                                </el-date-picker>
                                            </el-form-item>

                                            <el-form-item
                                                v-else
                                                :style="{
                                                    width:'100%',
                                                    marginBottom: '20px',
                                                }"
                                                :label="item.name+':'"
                                                :prop="'fields.'+ index +'.val'"
                                                :rules="[
                                                    { required: true, message: item.name, trigger: ['change','blur'] },
                                                ]"
                                                :label-width="formLabelWidth">
                                                <el-date-picker
                                                    style="width: 400px;"
                                                    v-model="item.val"
                                                    align="right"
                                                    type="date"
                                                    size="small"
                                                    value-format="yyyy-MM-dd"
                                                    placeholder="选择日期"
                                                    :picker-options="pickerOptions">
                                                </el-date-picker>
                                            </el-form-item>

                                        </div>
                                        <div v-if="item.fieldType==4" style="width: 100%;">
                                            <el-form-item
                                                v-if="item.type=='0'"
                                                :style="{
                                                    width:'100%',
                                                    marginBottom: '20px',
                                                }"
                                                :label="item.name+':'"
                                                :label-width="formLabelWidth">
                                                <el-date-picker
                                                    disabled
                                                    style="width: 400px;"
                                                    v-model="item.val"
                                                    type="datetime"
                                                    size="small"
                                                    value-format="yyyy-MM-dd HH:mm:ss"
                                                    placeholder="选择日期时间"
                                                    :picker-options="pickerOptionsTime">
                                                </el-date-picker>
                                            </el-form-item>

                                            <el-form-item
                                                v-else
                                                :style="{
                                                    width:'100%',
                                                    marginBottom: '20px',
                                                }"
                                                :label="item.name+':'"
                                                :prop="'fields.'+ index +'.val'"
                                                :rules="[
                                                    { required: true, message: item.name,  trigger: ['change','blur'] },
                                                ]"
                                                :label-width="formLabelWidth">
                                                <el-date-picker
                                                    style="width: 400px;"
                                                    v-model="item.val"
                                                    type="datetime"
                                                    size="small"
                                                    value-format="yyyy-MM-dd HH:mm:ss"
                                                    placeholder="选择日期时间"
                                                    :picker-options="pickerOptionsTime">
                                                </el-date-picker>
                                            </el-form-item>

                                        </div>
                                        <div v-if="item.fieldType==6" style="width: 100%;">
                                            <el-form-item
                                                v-if="item.type=='0'"
                                                :style="{
                                                    width:'100%',
                                                    marginBottom: '20px',
                                                }"
                                                :label="item.name+':'"
                                                :label-width="formLabelWidth"
                                            >

                                                <el-select
                                                    disabled
                                                    placeholder="请选择"
                                                    style="width: 400px;"
                                                    v-model="item.val"
                                                    size="small">
                                                    <el-option v-for="(tag,_index) in item.item" :label="tag.value" :value="tag.key" :key="_index"></el-option>
                                                </el-select>

                                            </el-form-item>
                                            <el-form-item
                                                v-else
                                                :style="{
                                                    width:'100%',
                                                    marginBottom: '20px',
                                                }"
                                                :label="item.name+':'"
                                                :prop="'fields.'+ index +'.val'"
                                                :rules="[
                                                    { required: true, message: item.name, trigger: 'change' },
                                                ]"
                                                :label-width="formLabelWidth">

                                                <el-select
                                                    placeholder="请选择"
                                                    style="width: 400px;"
                                                    v-model="item.val"
                                                    size="small">
                                                    <el-option v-for="(tag,_index) in item.item" :label="tag.value" :value="tag.key" :key="_index"></el-option>
                                                </el-select>

                                            </el-form-item>
                                        </div>
                                        <div v-if="item.fieldType==7" style="width: 100%;">
                                            <el-form-item
                                                v-if="item.type=='0'"
                                                :style="{
                                                    width:'100%',
                                                    marginBottom: '20px',
                                                }"
                                                :label="item.name+':'"
                                                :label-width="formLabelWidth"
                                            >

                                                <el-select
                                                    disabled
                                                    multiple
                                                    placeholder="请选择"
                                                    style="width: 400px;"
                                                    v-model="item.val"
                                                    size="small">
                                                    <el-option v-for="(tag,_index) in item.item" :label="tag.value" :value="tag.key" :key="_index"></el-option>
                                                </el-select>

                                            </el-form-item>
                                            <el-form-item
                                                v-else
                                                :style="{
                                                    width:'100%',
                                                    marginBottom: '20px',
                                                }"
                                                :label="item.name+':'"
                                                :prop="'fields.'+ index +'.val'"
                                                :rules="[
                                                    { required: true, message: item.name, trigger: 'change' },
                                                ]"
                                                :label-width="formLabelWidth">

                                                <el-select
                                                    multiple
                                                    placeholder="请选择"
                                                    style="width: 400px;"
                                                    v-model="item.val"
                                                    size="small">
                                                    <el-option v-for="(tag,_index) in item.item" :label="tag.value" :value="tag.key" :key="_index"></el-option>
                                                </el-select>

                                            </el-form-item>
                                        </div>
                                        <div v-if="item.fieldType==5" class="w100">
                                            <el-form-item
                                                v-if="item.type=='0'"
                                                :style="{
                                                    width:'100%',
                                                    marginBottom: '20px',
                                                }"
                                                :label="item.name+':'"
                                                :label-width="formLabelWidth">
                                                <div class="ub ub-pc rich-text-width" style="position: relative;">
                                                    <vue-ueditor-wrap v-model="item.val" :config="myConfig" :readonly="true"></vue-ueditor-wrap>
                                                </div>
                                            </el-form-item>
                                            <el-form-item
                                                v-else
                                                :style="{
                                                    width:'100%',
                                                    marginBottom: '20px',
                                                }"
                                                :label="item.name+':'"
                                                :prop="'fields.'+ index +'.val'"
                                                :rules="[
                                                    { required: true, message: item.name, trigger: 'blur' },
                                                ]"
                                                :label-width="formLabelWidth">
                                                <div class="ub ub-pc rich-text-width" style="position: relative;">
                                                    <vue-ueditor-wrap v-model="item.val" :config="myConfig" ></vue-ueditor-wrap>
                                                </div>
                                            </el-form-item>
                                        </div>
                                    </div>

                                </el-form>
                            </div>
                            <!-- 备注 -->
                            <div class="w100" v-if="(workTaskInfo.workOrderObject == 3 || workTaskInfo.workOrderObject == 4|| workTaskInfo.workOrderObject == 5 || (workTaskInfo.runningNodeName?workTaskInfo.runningNodeName[0] == 'User Task':''))">
                                <el-form class="w100" :model="otherForm" :rules="rules" ref="otherForm" :inline="true">
                                    <el-form-item style="margin-bottom: 20px;width: 100%;" label="备注：" prop="" :label-width="formLabelWidth">
                                        <div class="ub ub-pc rich-text-width" style="position: relative;">
                                            <vue-ueditor-wrap v-model="otherForm.remark" :config="myConfig"></vue-ueditor-wrap>
                                        </div>
                                    </el-form-item>
                                </el-form>
                            </div>
                            <!-- 事件处置 -->

                            <div class="w100" v-if="workTaskInfo.workOrderObject==1&&workTaskInfo.operation&&workTaskInfo.operation==2">
                                <el-form class="w100" :model="handleForm" :rules="disposalRules" ref="handleForm" :inline="true">
                                    <el-form-item style="margin-bottom: 20px;width: 48%;" label="审核状态：" prop="isReject" :label-width="formLabelWidth">
                                        <el-select placeholder="请选择" style="width: 400px;" v-model="handleForm.isReject" size="small">
                                            <el-option label="处置" value="0"></el-option>
                                            <el-option label="驳回" value="1"></el-option>
                                        </el-select>

                                    </el-form-item>
                                    <el-form-item
                                        v-if="handleForm.isReject != 1"
                                        style="margin-bottom: 20px;width: 48%;"
                                        label="处理方式："
                                        prop="disposalType"
                                        :label-width="formLabelWidth">
                                        <el-select placeholder="请选择" style="width: 400px;" v-model="handleForm.disposalType" size="small">
                                            <el-option label="一键封堵" value=0></el-option>
                                            <el-option label="阻断规则变更" value=1></el-option>
                                            <el-option label="检测规则变更" value=2></el-option>
                                            <el-option label="访问规则变更" value=3></el-option>
                                            <el-option label="业务安全检查变更" value=4></el-option>
                                            <el-option label="其他" value=5></el-option>
                                        </el-select>
                                    </el-form-item>

                                    <el-form-item
                                        v-if="handleForm.disposalType == 0  && handleForm.isReject != 1"
                                        style="margin-bottom: 20px;width: 48%;"
                                        label="IP："
                                        prop=""
                                        :label-width="formLabelWidth">
                                        <el-input style="width: 400px;" type="textarea" placeholder="请输入" clearable v-model="handleForm.ips" size="small"></el-input>
                                        <el-tooltip
                                            class="item"
                                            style="position: absolute;top: 40%;right: -20px;"
                                            effect="dark"
                                            content="多个ip录入时，记录每行为一个ip，按Enter折行批量录入"
                                            placement="right">
                                            <i class="el-icon-question" style="color: #387dee;"></i>
                                        </el-tooltip>
                                    </el-form-item>
                                    <el-form-item
                                        v-if="handleForm.disposalType == 0  && handleForm.isReject != 3"
                                        style="margin-bottom: 20px;width: 48%;"
                                        label="封禁对象："
                                        prop=""
                                        :label-width="formLabelWidth">
                                        <el-select placeholder="请选择" style="width: 400px;" multiple v-model="handleForm.objs" size="small">
                                            <el-option v-for="(item,index) in oneKeyList" :key="index" :label="item.device_name" :value="item.id"></el-option>
                                        </el-select>

                                    </el-form-item>
                                    <div style="margin-bottom: 20px;" v-if="handleForm.disposalType == 1 && handleForm.isReject != 1">
                                        <el-form-item label="变更项：" style="width: 48%;" :label-width="formLabelWidth">
                                            <el-select v-model="handleForm.changeItemZDGZ" placeholder="请选择" style="width: 400px;" size="small">
                                                <el-option label="WAF规则变更" value=0></el-option>
                                                <el-option label="IPS规则变更" value=1></el-option>
                                                <el-option label="FW规则变更" value=2></el-option>
                                                <el-option label="IDS规则变更" value=3></el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="选择设备：" style="width: 48%;" :label-width="formLabelWidth">
                                            <el-select v-model="handleForm.assetIdsZDGZ" placeholder="请选择" multiple style="width: 400px;" size="small">
                                                <el-option v-for="(item,index) in assetList" :key="index" :label="item.name" :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                    <div style="margin-bottom: 20px;" v-if="handleForm.disposalType == 2 && handleForm.isReject != 1">
                                        <el-form-item label="变更项：" style="width: 48%;" :label-width="formLabelWidth">
                                            <el-select v-model="handleForm.changeItemJCGZ" placeholder="请选择" style="width: 400px;" size="small">
                                                <el-option label="WAF规则变更" value=0></el-option>
                                                <el-option label="IPS规则变更" value=1></el-option>
                                                <el-option label="FW规则变更" value=2></el-option>
                                                <el-option label="IDS规则变更" value=3></el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="选择设备：" style="width: 48%;" :label-width="formLabelWidth">
                                            <el-select v-model="handleForm.assetIdsJCGZ" placeholder="请选择" multiple style="width: 400px;" size="small">
                                                <el-option v-for="(item,index) in assetList" :key="index" :label="item.name" :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                    <el-form-item
                                        label="选择设备："
                                        prop=""
                                        :label-width="formLabelWidth"
                                        v-if="handleForm.disposalType == 3 && handleForm.isReject != 1"
                                        style="margin-bottom: 20px;width: 48%;">
                                        <el-select v-model="handleForm.assetIdsFWGZ" placeholder="请选择" multiple style="width: 400px;" size="small">
                                            <el-option v-for="item in assetList" :key="item.id" :label="item.name" :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <div style="margin-bottom: 20px;" v-if="handleForm.disposalType == 4 && handleForm.isReject != 1">
                                        <el-form-item label="业务系统：" style="width: 48%;" :label-width="formLabelWidth">
                                            <el-select v-model="handleForm.assetSystemId" placeholder="请选择" style="width: 400px;" size="small">
                                                <el-option v-for="item in systemList" :key="item.id" :label="item.system_name" :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>

                                        <el-form-item label="业务员：" class="business" style="width: 48%;" :label-width="formLabelWidth">
                                            <el-select v-model="handleForm.assetUserId" placeholder="请选择" style="width: 400px;" size="small">
                                                <el-option v-for="item in userList" :key="item.id" :label="item.chineseName" :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>

                                    <el-form-item
                                        label="备注："
                                        :label-width="formLabelWidth"
                                        prop="changeLog"
                                        style="margin-bottom: 20px;width: 48%;"
                                        v-if="handleForm.disposalType != 0 && handleForm.disposalType != 5  && handleForm.isReject != 1">
                                        <el-input
                                            style="width: 400px;font-size: 12px;"
                                            type="textarea"
                                            :autosize="{ minRows: 3, maxRows: 5}"
                                            v-model="handleForm.changeLog"
                                            clearable></el-input>
                                    </el-form-item>
                                    <el-form-item
                                        v-if="handleForm.isReject == 1"
                                        style="margin-bottom: 20px;width: 100%;"
                                        label="驳回理由:"
                                        :label-width="formLabelWidth">
                                        <div class="ub ub-pc rich-text-width">
                                            <vue-ueditor-wrap v-model="handleForm.rejectReason" :config="myConfig"></vue-ueditor-wrap>
                                        </div>
                                    </el-form-item>
                                    <el-form-item
                                        style=" margin-bottom: 20px;width: 100%;"
                                        v-if="handleForm.disposalType == 5"
                                        label="其他:"
                                        :label-width="formLabelWidth">
                                        <div class="ub ub-pc rich-text-width">
                                            <vue-ueditor-wrap v-model="handleForm.otherMsg" :config="myConfig"></vue-ueditor-wrap>
                                        </div>
                                    </el-form-item>
                                    <el-form-item style=" margin-bottom: 20px;width: 100%;" label="处置结果：" prop="" :label-width="formLabelWidth">
                                        <div class="ub ub-pc rich-text-width">
                                            <vue-ueditor-wrap v-model="handleForm.actionResults" :config="myConfig"></vue-ueditor-wrap>
                                        </div>
                                    </el-form-item>
                                </el-form>
                            </div>

                            <!-- 漏洞处置 -->
                            <div class="w100" v-if="workTaskInfo.workOrderObject==2&&workTaskInfo.operation&&workTaskInfo.operation==2">
                                <el-form class="w100" :model="handleLeakForm" :rules="disposalRules" ref="handleLeakForm" :inline="true">
                                    <el-form-item
                                        style="margin-bottom: 20px;width: 48%;"
                                        label="处理方式："
                                        prop="disposalType"
                                        :label-width="formLabelWidth">
                                        <el-select placeholder="请选择" style="width: 400px;" v-model="handleLeakForm.disposalType" size="small">
                                            <el-option label="补丁" value=0></el-option>
                                            <el-option label="升级" value=1></el-option>
                                            <el-option label="其他" value=2></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item v-if="handleLeakForm.disposalType==2" style=" margin-bottom: 20px;width: 100%;" label="处理方式描述：" prop="" :label-width="formLabelWidth">
                                        <div class="ub ub-pc rich-text-width">
                                            <vue-ueditor-wrap v-model="handleLeakForm.des" :config="myConfig"></vue-ueditor-wrap>
                                        </div>
                                    </el-form-item>
                                </el-form>
                            </div>

                            <!-- 事件分析 -->
                            <div class="w100" v-if="workTaskInfo.workOrderObject==1&&workTaskInfo.operation===0">
                                <el-form class="w100" :model="analysisForm" :rules="analysisRules" ref="analysisForm" :inline="true">
                                    <el-form-item style="margin-bottom: 20px;width: 100%;" label="是否驳回：" prop="isReject" :label-width="formLabelWidth">
                                        <el-select placeholder="请选择" class="rich-text-width" v-model="analysisForm.isReject" size="small">
                                            <el-option label="是" value="1"></el-option>
                                            <el-option label="否" value="0"></el-option>

                                        </el-select>
                                    </el-form-item>
                                    <el-form-item style="margin-bottom: 20px;width: 100%;" label="分析过程：" prop="" :label-width="formLabelWidth">
                                        <div class="ub ub-pc rich-text-width">
                                            <vue-ueditor-wrap v-model="analysisForm.analyzePro" :config="myConfig"></vue-ueditor-wrap>
                                        </div>
                                    </el-form-item>
                                    <el-form-item
                                        v-if="analysisForm.isReject==1"
                                        style="margin-bottom: 20px;width: 100%;"
                                        label="驳回理由"
                                        prop=""
                                        :label-width="formLabelWidth">
                                        <div class="ub ub-pc rich-text-width">
                                            <vue-ueditor-wrap v-model="analysisForm.rejectReason" :config="myConfig"></vue-ueditor-wrap>
                                        </div>
                                    </el-form-item>
                                    <el-form-item v-else style="margin-bottom: 20px;width: 100%;" label="处置建议" prop="" :label-width="formLabelWidth">
                                        <div class="ub ub-pc rich-text-width">
                                            <vue-ueditor-wrap v-model="analysisForm.advice" :config="myConfig"></vue-ueditor-wrap>
                                        </div>
                                    </el-form-item>
                                </el-form>
                            </div>
                            <!-- 事件溯源 -->
                            <div class="w100" v-if="workTaskInfo.workOrderObject==1&&workTaskInfo.operation&&workTaskInfo.operation==3">
                                <el-form class="w100" :model="backForm" :rules="rules" ref="backForm" :inline="true">
                                    <el-form-item style="margin-bottom: 20px;width: 100%;" label="溯源结果：" prop="" :label-width="formLabelWidth">
                                        <div class="ub ub-pc rich-text-width" style="position: relative;">
                                            <vue-ueditor-wrap v-model="backForm.traceResult" :config="myConfig"></vue-ueditor-wrap>
                                        </div>
                                    </el-form-item>
                                </el-form>
                            </div>
                            <!-- 事件二线分析-->
                            <div class="w100" v-if="workTaskInfo.workOrderObject==1&&workTaskInfo.operation&&workTaskInfo.operation==4">
                                <el-form class="w100" :model="alarmAddviceForm" :rules="rules" ref="alarmAddviceForm" :inline="true">
                                    <el-form-item style="margin-bottom: 20px;width: 100%;" label="追加建议：" prop="" :label-width="formLabelWidth">
                                        <div class="ub ub-pc rich-text-width">
                                            <vue-ueditor-wrap v-model="alarmAddviceForm.appendProposal" :config="myConfig"></vue-ueditor-wrap>
                                        </div>
                                    </el-form-item>
                                </el-form>
                            </div>
                            <!-- 事件状态变更-->
                            <div class="w100" v-if="workTaskInfo.workOrderObject==1&&workTaskInfo.operation&&workTaskInfo.operation==1">
                                <el-form class="w100" :model="alarmStatusForm" :rules="rules" ref="alarmStatusForm" :inline="true">
                                    <el-form-item style="margin-bottom: 20px;width: 100%;" label="事件状态：" prop="" :label-width="formLabelWidth">
                                        <div class="ub ub-pc" style="width: 400px;">
                                            <el-select placeholder="请选择" style="width: 400px;" v-model="alarmStatusForm.reportStatus" size="small">
                                                <el-option label="待确认" value="0"></el-option>
                                                <el-option label="已确认" value="1"></el-option>
                                                <el-option label="已处置" value="2"></el-option>
                                                <el-option label="已驳回" value="3"></el-option>
                                            </el-select>
                                        </div>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </div>
                    </div>
                    <div v-if="bpmRecord.length > 0" style="margin-top: 20px;" class="info-title">流转记录</div>
                    <div class="ub ub-ac ub-pe w100" v-if="workTaskInfo.status==2&&bpmRecord.length>0">
                        <el-button type="text" icon="el-icon-download" v-on:click="getPdf('pdfPrint',workTaskInfo.workOrderName)">生成PDF</el-button>
                    </div>
                    <div class="w100 work-record" id="pdfPrint">
                        <el-row style="margin: 20px 0;background: #ffffff;" type="flex" justify="center">
                            <el-timeline style="margin-left: 140px;width: 90%;">
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
                                    placement="top">
                                    <div class="ub ub-pj ub-ac time-box">
                                        <div class="ub" style="width: 50%;">
                                            <h4 style="font-size: 16px;color: rgb(0 0 0 / 90%);">{{activity.userName|NullStr}}
                                                <sub style="margin-left: 10px;font-size: 12px;color: rgb(0 0 0 / 60%);opacity: 0.6;vertical-align: bottom;">{{activity.userRole|NullStr}}</sub>
                                                <sub style="margin-left: 10px;font-size: 12px;color: rgb(0 0 0 / 60%);opacity: 0.6;vertical-align: bottom;">当前节点：{{activity.nodeName ? activity.nodeName:''}}</sub>
                                            </h4>
                                        </div>
                                        <div class="time-right" style="width: 150px;text-align: right;">
                                            <el-button
                                                type="text"
                                                style="font-size: 12px;text-decoration: underline;"
                                                :class="{'el-icon-arrow-down':activity.isOpen,'el-icon-arrow-up':!activity.isOpen}"
                                                @click="activity.isOpen=!activity.isOpen">{{activity.isOpen?'收起内容':'展开查看'}}</el-button>
                                        </div>
                                    </div>

                                    <div v-show="activity.isOpen">
                                        <div class="time-text-box" v-if="(workTaskInfo.workOrderObject == 1||workTaskInfo.workOrderObject == 2)&&activity.dealType==0">
                                            <div class="w100 time-text-box-item" v-for="(item,_index) in activity.dealContent" :key="_index">
                                                <div class="time-text-box-left">{{item.name}}:</div>
                                                <div v-if="item.valType==='text'||item.valType==='select'" class="ub ub-f1 ub-ver time-text-box-right">{{item|getVal}}</div>
                                                <div v-else class="time-text-box-right" v-html="item.val" @click="imageEnlargement"></div>
                                            </div>
                                        </div>
                                        <div class="time-text-box" v-if="!['1', '2', '3', '4', '5','6'].includes(workTaskInfo.workOrderObject)&&activity.dealType!=2">
                                            <div class="w100 time-text-box-item" v-for="(item,_index) in activity.dealContent" :key="_index">
                                                <div class="time-text-box-left">{{_index}}：</div>
                                                <div class="time-text-box-right" v-html="item" @click="imageEnlargement"></div>
                                            </div>
                                        </div>
                                        <!-- 通知公告 -->
                                        <div class="time-text-box" v-if="['6'].includes(workTaskInfo.workOrderObject)&&activity.dealType==1">
                                            <div class="w100 time-text-box-item" v-for="(item, _index) in activity.dealContent" :key="_index">
                                                <div class="time-text-box-left">{{ _index }}：</div>
                                                <div class="time-text-box-right" v-html="item" @click="imageEnlargement"></div>
                                            </div>
                                        </div>
                                        <div class="w100 time-text-box" v-if="workTaskInfo.workOrderObject == 1&&activity.operation==0">
                                            <div class="w100 time-text-box-item">
                                                <div class="time-text-box-left">是否驳回：</div>
                                                <div class="time-text-box-right">{{activity.dealContent.isReject==1?'是':'否'}}</div>
                                            </div>
                                            <div class="w100 time-text-box-item">
                                                <div class="time-text-box-left">分析过程：</div>
                                                <div class="time-text-box-right" v-html="activity.dealContent.analyzePro" @click="imageEnlargement"></div>
                                            </div>
                                            <div class="w100 time-text-box-item" v-if="activity.dealContent.isReject==1">
                                                <div class="time-text-box-left">驳回理由：</div>
                                                <div class="time-text-box-right" v-html="activity.dealContent.rejectReason" @click="imageEnlargement"></div>
                                            </div>
                                            <div v-else class="w100 time-text-box-item">
                                                <div class="time-text-box-left">处置建议：</div>
                                                <div class="time-text-box-right" v-html="activity.dealContent.advice" @click="imageEnlargement"></div>
                                            </div>
                                        </div>
                                        <!-- 漏洞处置 -->
                                        <div class="time-text-box" v-if="workTaskInfo.workOrderObject == 2&&activity.operation&&activity.operation==2">
                                            <div class="w100">
                                                <div class="w100 time-text-box-item">
                                                    <div class="time-text-box-left">处置方式：</div>
                                                    <div class="time-text-box-right">{{ activity.dealContent.disposalType|getdisposalLeakType }}</div>
                                                </div>
                                                <div class="w100 time-text-box-item" v-if="activity.dealContent.disposalType == 2" >
                                                    <div class="time-text-box-left">描述：</div>
                                                    <div class="time-text-box-right" v-html="activity.dealContent.des"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- 事件处置 -->
                                        <div class="time-text-box" v-if="workTaskInfo.workOrderObject == 1&&activity.operation&&activity.operation==2">
                                            <div class="w100 time-text-box-item">
                                                <div class="time-text-box-left">审核状态：</div>
                                                <div class="time-text-box-right">{{activity.dealContent.isReject==1?'驳回':'处置'}}</div>
                                            </div>
                                            <div class="w100 time-text-box-item" v-if="activity.dealContent.isReject==1">
                                                <div class="time-text-box-left">驳回理由：</div>
                                                <div class="time-text-box-right" v-html="activity.dealContent.rejectReason" @click="imageEnlargement"></div>
                                            </div>
                                            <div class="w100" v-if="activity.dealContent.isReject!=1">
                                                <div class="w100 time-text-box-item">
                                                    <div class="time-text-box-left">处置方式：</div>
                                                    <div class="time-text-box-right">{{ activity.dealContent.disposalType|getdisposalType }}</div>
                                                </div>
                                                <div class="w100 time-text-box-item" v-if="activity.dealContent.disposalType == 0">
                                                    <div class="time-text-box-left">IP：</div>
                                                    <div class="time-text-box-right">{{handdeelIps(activity.dealContent.ips)}}</div>
                                                </div>
                                                <div class="w100 time-text-box-item" v-if="activity.dealContent.disposalType == 0 && activity.dealContent.isReject != 3">
                                                    <div class="time-text-box-left">封禁对象：</div>
                                                    <div class="time-text-box-right">{{getObjs(activity.dealContent.objs)}}</div>
                                                </div>
                                                <div class="w100 time-text-box-item" v-if="activity.dealContent.disposalType == 1||activity.dealContent.disposalType == 2">
                                                    <div class="time-text-box-left">变更项：</div>
                                                    <div class="time-text-box-right">{{ activity.dealContent.changeItem|getchangeItem }}</div>
                                                </div>
                                                <div class="w100 time-text-box-item" v-if="activity.dealContent.disposalType == 1||activity.dealContent.disposalType == 2||activity.dealContent.disposalType == 3">
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
                                        <div class="time-text-box" v-if="workTaskInfo.workOrderObject == 1&&activity.operation&&activity.operation==3">
                                            <div class="w100 time-text-box-item">
                                                <div class="time-text-box-left">溯源结果：</div>
                                                <div class="time-text-box-right" v-html="activity.dealContent.traceResult" @click="imageEnlargement"></div>
                                            </div>
                                        </div>
                                        <!-- 状态变更 -->
                                        <div class="time-text-box" v-if="workTaskInfo.workOrderObject==1&&activity.operation&&activity.operation==1">
                                            <div class="w100 time-text-box-item">
                                                <div class="time-text-box-left">事件状态：</div>
                                                <div class="time-text-box-right">{{activity.dealContent.reportStatus|getreportStatus}}</div>
                                            </div>
                                        </div>
                                        <!-- 二线分析 -->
                                        <div class="time-text-box" v-if="workTaskInfo.workOrderObject == 1&&activity.operation&&activity.operation==4">
                                            <div class="w100 time-text-box-item">
                                                <div class="time-text-box-left">追加建议：</div>
                                                <div class="time-text-box-right" v-html="activity.dealContent.appendProposal" @click="imageEnlargement"></div>
                                            </div>
                                        </div>

                                        <!-- 备注 -->
                                        <div class="time-text-box" v-if="(workTaskInfo.workOrderObject == 3 || workTaskInfo.workOrderObject == 4 || workTaskInfo.workOrderObject == 5)&&activity.dealContent">
                                            <div class="w100 time-text-box-item">
                                                <div class="time-text-box-left">备注：</div>
                                                <div
                                                    class="time-text-box-right"
                                                    v-html="activity.dealContent?activity.dealContent.remark:''"
                                                    @click="imageEnlargement"></div>
                                            </div>
                                        </div>

                                        <!-- 审核 -->
                                        <div class="time-text-box" v-if="activity.dealType&&activity.dealType==2">
                                            <div class="w100 time-text-box-item">
                                                <div class="time-text-box-left">审核意见：</div>
                                                <div class="time-text-box-right" v-html="activity.approveOpinion" @click="imageEnlargement"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="w100 time-box-item-bottom" style="margin-top: 8px;">
                                        <div class="time-text-box-bottom"><i class="iconfont icon-jiediankaishishijian"></i> <span>开始：{{activity.receiveTime|NullStr}}</span></div>
                                        <div class="time-text-box-bottom"><i class="iconfont icon-jiediantingliushijian"></i> <span>停留时长：<strong>{{activity.stayTime|NullStr}}</strong></span></div>
                                        <div class="time-text-box-bottom"><i class="iconfont icon-jiediantingliushijian"></i> <span>超时时长：<strong>{{activity.allTime|NullStr}}</strong></span></div>
                                        <div class="time-text-box-bottom"><i class="iconfont icon-chuliren"></i> <span>处理人：<strong class="users">{{activity.players|NullStr}}</strong></span></div>
                                    </div>
                                </el-timeline-item>
                            </el-timeline>
                        </el-row>
                    </div>
                </div>
                <div v-if="activeTabName === 'two'" style="padding: 20px;">
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
        <el-dialog title="提示" :visible.sync="finishDialog" :width="isNeedSelected?'60%':'30%'" custom-class="common-dialog">
            <el-form v-if="isNeedSelected" class="w100" :model="checkkForm"  ref="checkkForm">
                <el-form-item style="margin-bottom: 20px;width: 100%;" label="下一节点处理人：" prop="selectUsers" :rules="rules.selectUsers" :label-width="formLabelWidth">
                    <div class="ub ub-pc ub-f1">
                        <el-select filterable clearable multiple v-model="checkkForm.selectUsers" size="small" style="width: 100%;" placeholder="请选择">
                            <el-option v-for="(item, index) in selectUsersAll" :key="index" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </div>
                </el-form-item>
            </el-form>
            <span v-else>确定完成吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" @click="finishConfim">确 定</el-button>
                <el-button size="small" @click="finishDialog = false">取 消</el-button>
                <!-- <cancel-btn style="margin-left: 10px;" title="取 消" @click="finishDialog = false"/> -->
            </span>
        </el-dialog>
        <el-dialog v-dialogDrag :title="agreeTitle" :visible.sync="checkDialog" width="65%" custom-class="attendance-dialog">
            <el-form class="w100" :model="checkkForm"  ref="checkkForm">
                <el-form-item style="margin-bottom: 20px;width: 100%;" label="审批意见：" prop="" :label-width="formLabelWidth">
                    <div class="ub ub-pc ub-f1">
                        <vue-ueditor-wrap v-model="checkkForm.approveOpinion" :config="myConfig"></vue-ueditor-wrap>
                    </div>
                </el-form-item>
                <el-form-item v-if="isNeedSelected" style="margin-bottom: 20px;width: 100%;" label="下一节点处理人：" prop="selectUsers" :rules="rules.selectUsers" :label-width="formLabelWidth">
                    <div class="ub ub-pc ub-f1">
                        <el-select filterable clearable multiple v-model="checkkForm.selectUsers" size="small" style="width: 100%;" placeholder="请选择">
                            <el-option v-for="(item, index) in selectUsersAll" :key="index" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" type="primary"  @click="finishConfim">确 定</el-button>
                <el-button size="small" @click="checkDialog = false">取 消</el-button>
            </span>
        </el-dialog>
        <el-drawer :visible.sync="detailDialog" direction="rtl" size="78%" :wrapperClosable="false" title="详情">
            <div class="drawer-content" style="height: 100%;">
                <div style="position: relative;top: 0;left: 0;overflow-y: auto;width: 100%;height: 100%;">
                    <div class="ub ub-pj w100">
                        <div class="list-tips">
                            {{ detailArr.reportName }}
                            <span v-if="detailArr.reportLevel == 0" class="title-level zero">低</span>
                            <span v-if="detailArr.reportLevel == 1" class="title-level one">中低</span>
                            <span v-if="detailArr.reportLevel == 2" class="title-level two">中</span>
                            <span v-if="detailArr.reportLevel == 3" class="title-level three">中高</span>
                            <span v-if="detailArr.reportLevel == 4" class="title-level fore">高</span>

                            <span
                                v-if="detailArr.reportStatus == 0"
                                style="padding: 3px 10px;font-size: 12px;border-radius: 2px;color: #eeb174;background: #fde6d8;line-height: 1;">待确认</span>
                            <span
                                v-if="detailArr.reportStatus == 1"
                                style="padding: 3px 10px;font-size: 12px;border-radius: 2px;color: #3fa87b;background: #ccf6e4;line-height: 1;">已确认</span>
                            <span
                                v-if="detailArr.reportStatus == 2"
                                style="padding: 3px 10px;font-size: 12px;border-radius: 2px;color: #3c7ce2;background: #d5e5fa;line-height: 1;">已处置</span>
                            <span
                                v-if="detailArr.reportStatus == 3"
                                style="padding: 3px 10px;font-size: 12px;border-radius: 2px;color: #aa0202;background: #fad7dd;line-height: 1;">已驳回</span>
                        </div>
                        <!-- <div class="ub">
                            <div>
                                <i class="el-icon-close" style="color:#00b3ca;font-size:20px;cursor: pointer;" @click="detailDialog=false"></i>
                            </div>
                        </div> -->
                    </div>
                    <div class="drawer-pad">
                        <el-tabs class="drawer-tabs" style="height: 100%;" v-model="alarmActiveName" @tab-click="handleClick">
                            <el-tab-pane label="基本信息" name="first">
                                <BasicInfo :seeForm="detailArr"></BasicInfo>
                            </el-tab-pane>
                            <el-tab-pane label="资产信息" name="three">
                                <AssetInfo :assetsInfo="assetsInfo"></AssetInfo>
                                <div v-if="assetsInfo.ips&&assetsInfo.ips.length>0" type="flex" justify="start">
                                    <el-table ref="ipstiple" class='bigTable' :data="assetsInfo.ips" border stripe tooltip-effect="dark">
                                        <el-table-column prop="assetsIp" label="IP">
                                        </el-table-column>
                                        <el-table-column label="端口">
                                            <template slot-scope="scope">
                                                <div v-if="scope.row.ports.length>0">
                                                    <span style="margin: 10px;" v-for="(item,index) in scope.row.ports" :key="index">{{item.port}}</span>
                                                </div>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </el-tab-pane>
                            <el-tab-pane label="原始日志" name="four">
                                <Logs ref="logs" :logIds="logIds" :alarmId="alarmId" :tabindex="alarmActiveName"></Logs>
                            </el-tab-pane>
                            <el-tab-pane label="归并事件" name="five">
                                <el-table
                                    :height="tableHeight"
                                    ref="multipleTable4"
                                    class='bigTable'
                                    :data="reportTableData"
                                    border
                                    stripe
                                    tooltip-effect="dark">
                                    <el-table-column
                                        align="center"
                                        type="index"
                                        width="50"
                                        :index="indexMethod"
                                        label="序号">
                                    </el-table-column>
                                    <el-table-column prop="createTime" label="事件时间" width="140">
                                    </el-table-column>
                                    <el-table-column prop="reportName" label="事件名称" show-overflow-tooltip>
                                    </el-table-column>
                                    <!-- <el-table-column prop="pid" label="父事件id" width="140">
                                    </el-table-column> -->
                                    <el-table-column prop="srcIp" label="源ip" width="120">
                                        <template slot-scope="scope">
                                            <div>
                                                <el-popover popper-class="add-search-order-detail" placement="bottom" title="" trigger="click">
                                                    <div>
                                                        <p
                                                            @click="jumpAsset(scope.row.srcIp)"
                                                            class="ub ub-ac click-btn"
                                                        >
                                                            <i class="iconfont icon-chaxunzichan" style="font-size: 12px;"></i>
                                                            <span>查询资产</span>
                                                        </p>
                                                        <p
                                                            style="margin-top: 10px;"
                                                            @click="jumpThreat(scope.row.srcIp)"
                                                            class="ub ub-ac click-btn"
                                                        >
                                                            <i class="iconfont icon-chaxunqingbao" style="font-size: 12px;"></i>
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
                                    <el-table-column prop="srcPort" label="源端口" width="100">
                                    </el-table-column>
                                    <el-table-column prop="desIp" label="目的ip" width="120">
                                        <template slot-scope="scope">
                                            <div>
                                                <el-popover popper-class="add-search-order-detail" placement="bottom" title="" trigger="click">
                                                    <div>
                                                        <p
                                                            @click="jumpAsset(scope.row.desIp)"
                                                            class="ub ub-ac click-btn"
                                                        >
                                                            <i class="iconfont icon-chaxunzichan" style="font-size: 12px;"></i>
                                                            <span>查询资产</span>
                                                        </p>
                                                        <p
                                                            style="margin-top: 10px;"
                                                            @click="jumpThreat(scope.row.desIp)"
                                                            class="ub ub-ac click-btn"
                                                        >
                                                            <i class="iconfont icon-chaxunqingbao" style="font-size: 12px;"></i>
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
                                    <el-table-column prop="desPort" label="目的端口" width="100">
                                    </el-table-column>
                                    <el-table-column prop="reportTypeName" label="事件类型"  show-overflow-tooltip>
                                    </el-table-column>
                                    <!-- <el-table-column prop="attackResult" label="攻击结果" width="120" show-overflow-tooltip>
                                    </el-table-column> -->
                                    <!-- <el-table-column prop="ruleName" label="规则名称" width="120" show-overflow-tooltip>
                                    </el-table-column> -->
                                    <el-table-column align="center" label="操作" fixed="right" class-name="deepBg" width="120">
                                        <template slot-scope="scope">
                                            <el-button type="text" @click="detailReportData(scope.row)">详情</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <pagination :total="total_report_count" :page.sync="report_params.page" :limit.sync="report_params.size" @pagination="get_report_data" />
                                <!-- <div class="pagination">
                                    <el-pagination
                                        background
                                        @size-change="handleSizeChangeReport"
                                        @current-change="handleCurrentChangeReport"
                                        :current-page="report_params.page"
                                        :page-sizes="[20, 30, 40,50]"
                                        :page-size="report_params.size"
                                        layout="slot, sizes, prev, pager, next"
                                        :total="total_report_num">
                                        <span>共{{total_report_count}}条</span>
                                    </el-pagination>
                                </div> -->
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </div>
            </div>
        </el-drawer>
        <AlarmDetail :alarmSeeDialog="alarmSeeDialog" :seeForm="alarmDetailData" ref="alarmDetail"></AlarmDetail>
    </div>

</template>ueditorConfig

<script>
import AlarmDetail from '@/pages/alarm/new_alarm/components/AlarmDetail.vue'
import { get_rule_detail, ip_searchAsset, getAlarmReportList, getMenace } from '@/server/alarm/alarm.js'
import BasicInfo from '@/pages/alarm/seeTabs/BasicInfo.vue'
import AssetInfo from '@/pages/alarm/seeTabs/AssetInfo.vue'
import Logs from '@/pages/alarm/seeTabs/Logs'
import xml from '@/components/buit-inTemplate.js'
import 'vant/lib/index.css'
import {
    ImagePreview
} from 'vant'
import VueUeditorWrap from '@/components/vue-ueditor-wrap.vue' // ES6 Module
import ueditorConfig from '@/mixins/ueditorConfig'
import {
    get_workTask_detail,
    finish_workTask,
    get_one_work,
    get_task_info,
    get_sys_users,
    needSelected
} from '../../server/works_order/api.js'
import { get_threat_search, getStartConfig, get_threat_searchVenus } from '@/server/alarm/api.js'
import bpmnModeler from '../../package/detailXml'
export default {
    name: 'TaskDetail',
    components: {
        VueUeditorWrap,
        bpmnModeler,
        BasicInfo,
        AssetInfo,
        Logs,
        AlarmDetail
    },
    mixins: [ueditorConfig],
    data() {
        return {
            startData: [],
            tableHeight: document.body.clientHeight - 150,
            get_params: {
                page: 1,
                size: 20
            },
            alarmDetailData: {},
            alarmSeeDialog: false,
            reportFrom: '',
            alarmId: '',
            logType: '',
            timeDiffer: '',
            taskClick: false,
            total_report_num: 0,
            total_report_count: 0,
            reportTableData: [],
            report_params: {
                id: '',
                page: 1,
                size: 20
            },
            logIds: [],
            assetsInfo: {
                systemId: '',
                deviceTypeId: '',
                topology: '',
                manufacturerName: '',
                manufacturerId: '',
                deviceTypeName: '',
                updateTime: '',
                subnetMask: '',
                deviceName: '',
                version: '',
                domainId: '',
                pcSystem: '',
                pcSystemVersion: '',
                safetyBoundary: '',
                uniqueCode: '',
                modelInfo: '',
                createTime: '',
                isBoundary: '',
                zoneId: '',
                id: '',
                zoneName: '',
                systemName: '',
                ips: [],
                systemUsers: []
            },
            modelMap: {},
            ruleDialog: false,
            alarmActiveName: 'first',
            isNeedSelected: false,
            pickerOptionsTime: {
                shortcuts: [{
                    text: '今天',
                    onClick(picker) {
                        picker.$emit('pick', new Date())
                    }
                }, {
                    text: '昨天',
                    onClick(picker) {
                        const date = new Date()
                        date.setTime(date.getTime() - 3600 * 1000 * 24)
                        picker.$emit('pick', date)
                    }
                }, {
                    text: '一周前',
                    onClick(picker) {
                        const date = new Date()
                        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
                        picker.$emit('pick', date)
                    }
                }]
            },
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now()
                },
                shortcuts: [{
                    text: '今天',
                    onClick(picker) {
                        picker.$emit('pick', new Date())
                    }
                }, {
                    text: '昨天',
                    onClick(picker) {
                        const date = new Date()
                        date.setTime(date.getTime() - 3600 * 1000 * 24)
                        picker.$emit('pick', date)
                    }
                }, {
                    text: '一周前',
                    onClick(picker) {
                        const date = new Date()
                        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
                        picker.$emit('pick', date)
                    }
                }]
            },
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
            alarmInfoTable: [],
            loading: false,
            checkDialog: false,
            fieldsForm: {
                fields: []
            },

            users: [
                { name: '张三', id: 'zhangsan' },
                { name: '李四', id: 'lisi' },
                { name: '王五', id: 'wangwu' }
            ],
            groups: [
                { name: 'web组', id: 'web' },
                { name: 'java组', id: 'java' },
                { name: 'python组', id: 'python' }
            ],
            categorys: [
                { name: 'OA', id: 'oa' },
                { name: '财务', id: 'finance' }
            ],
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
                approveOpinion: '',
                selectUsers: []
            },
            selectUsersAll: [],
            rules: {
                selectUsers: [{
                    required: true,
                    message: '请选择',
                    trigger: 'change'
                }]
            },
            disposalRules: {
                isReject: [{
                    required: true,
                    message: '请选择',
                    trigger: 'change'
                }],
                disposalType: [{
                    required: true,
                    message: '请选择',
                    trigger: 'change'
                }]
            },
            analysisRules: {
                isReject: [{
                    required: true,
                    message: '请选择',
                    trigger: 'change'
                }]
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
    watch: {
        detailDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.assetsInfo = {
                        systemId: '',
                        deviceTypeId: '',
                        topology: '',
                        manufacturerName: '',
                        manufacturerId: '',
                        deviceTypeName: '',
                        updateTime: '',
                        subnetMask: '',
                        deviceName: '',
                        version: '',
                        domainId: '',
                        pcSystem: '',
                        pcSystemVersion: '',
                        safetyBoundary: '',
                        uniqueCode: '',
                        modelInfo: '',
                        createTime: '',
                        isBoundary: '',
                        zoneId: '',
                        id: '',
                        zoneName: '',
                        systemName: '',
                        ips: [],
                        systemUsers: []
                    }
                }
            }
        }
    },
    filters: {
        // 变更项
        getchangeItem(type) {
            let types = [{
                label: 'WAF规则变更',
                value: 0
            }, {
                label: 'IPS规则变更',
                value: 1
            }, {
                label: 'FW规则变更',
                value: 2
            }, {
                label: 'IDS规则变更',
                value: 3
            }]
            let selected = types.filter(item => item.value == type)
            if (selected.length > 0) {
                return selected[0].label
            } else {
                return ''
            }
        },
        // 漏洞处置
        getdisposalLeakType(type) {
            let types = [{
                label: '补丁',
                value: 0
            }, {
                label: '升级',
                value: 1
            }, {
                label: '其他',
                value: 2
            }]
            let selected = types.filter(item => item.value == type)
            if (selected.length > 0) {
                return selected[0].label
            } else {
                return ''
            }
        },
        // 处置方式
        getdisposalType(type) {
            let types = [{
                label: '一键封堵',
                value: 0
            }, {
                label: '阻断规则变更',
                value: 1
            }, {
                label: '检测规则变更',
                value: 2
            }, {
                label: '访问规则变更',
                value: 3
            }, {
                label: '业务安全检查变更',
                value: 4
            }, {
                label: '其他',
                value: 5
            }]
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
                        } else if (item.constructor == Object && !item.historyIP && !item.operationSystem && JSON.stringify(
                            item) !== '{}') {
                            result.push(item)
                        }
                    })
                } catch (e) {
                    console.log(e)
                }
            }
            console.log('msgTable', result)
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
            let runningNodeName = this.workTaskInfos.runningNodeName ?? []
            obj.nodeName = this.getRunningNodeName(runningNodeName)
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
                        if (item.replace(/\s/ig, '')) {
                            newArry.push(item.replace(/\s/ig, ''))
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
        this.currentTab = this.$route.query.type
        this.initTask()
        this.initUsers()
        // this.getStartConfigData()
    },
    methods: {
        getStartConfigData() {
            getStartConfig({ queryData: {}, paramsData: {}}).then(res => {
                this.startData = res
            })
        },
        jumpAsset(value) {
            this.$setsessionStorage('currentPath', '/assets/assets_asset_info?ip=' + value)
            window.open(window.location.origin + '/#' + '/assets/assets_asset_info?ip=' + value)
        },
        jumpThreat(value) {
            console.log(value)
            let obj = {
                queryData: {},
                paramsData: { value }
            }
            if (this.startData.includes(1)) {
                this.searchWeibu(obj, value)
            } else if (this.startData.includes(0)) {
                this.searchVenus(obj, value)
            }
        },
        searchWeibu(obj, value) {
            get_threat_search(obj)
                .then(res => {
                    console.log(res)
                    this.$setsessionStorage('search-item', res)
                    window.open(window.location.origin + '/#' + '/intelligence/threat_detail?searchStr=' + value)
                })
                .catch(err => {
                    console.log(err + 'err')
                })
        },
        searchVenus(obj, value) {
            get_threat_searchVenus(obj, value)
                .then(res => {
                    console.log(res)
                    this.$setsessionStorage('search-item', res)
                    window.open(window.location.origin + '/#' + '/intelligence/threat_detail?searchStr=' + value)
                })
                .catch(err => {
                    this.btnLoading = false
                    console.log(err + 'err')
                })
        },
        get_report_data() {
            this.reportTableData = []
            let data = {
                queryData: {
                    page: this.report_params.page,
                    pageSize: this.report_params.size
                },
                paramsData: {
                    id: this.report_params.id
                }
            }
            getAlarmReportList(data).then(res => {
                console.log('归并日志', res)
                this.total_report_count = res.total
                let total = res.total
                /* 动态设置总页数*/
                if (this.report_params.page < 4 && total > 7 * this.report_params.size) {
                    this.total_report_num = 7 * this.report_params.size
                } else if (this.report_params.page >= 4 && (total > (this.report_params.page + 3) * this.report_params.size)) {
                    this.total_report_num = (this.report_params.page + 3) * this.report_params.size
                } else {
                    this.total_report_num = res.total
                }
                this.reportTableData = res.records ?? []
            }).catch(error => {
                console.log('error' + error)
            })
        },
        handleSizeChangeReport(val) {
            this.report_params.size = val
            this.get_report_data()
        },
        handleCurrentChangeReport(val) {
            this.report_params.page = val
            this.get_report_data()
        },
        async  detailReportData(row) {
            // this.detailReportArr = row
            // for (let i in this.detailReportArr) {
            //     if (i === 'reportStatus') {
            //         let obj = {
            //             0: '待确认',
            //             1: '已确认',
            //             2: '已处理',
            //             3: '已驳回'
            //         }
            //         this.detailReportArr[i] = obj[this.detailReportArr[i]] ?? ''
            //     } else if (i === 'reportLevel') {
            //         let obj = {
            //             0: '低',
            //             1: '中低',
            //             2: '中',
            //             3: '中高',
            //             4: '高'
            //         }
            //         this.detailReportArr[i] = obj[this.detailReportArr[i]] ?? ''
            //     } else if (i === 'checkStatus') {
            //         let obj = {
            //             0: '否',
            //             1: '是'
            //         }
            //         this.detailReportArr[i] = obj[this.detailReportArr[i]] ?? ''
            //     } else if (i === 'isBanned') {
            //         let obj = {
            //             0: '否',
            //             1: '是'
            //         }
            //         this.detailReportArr[i] = obj[this.detailReportArr[i]] ?? ''
            //     }
            // }
            // this.reportDetailDialog = true
            this.$refs.alarmDetail.alarmId = row.id
            this.$refs.alarmDetail.activeName = 'first'
            this.alarmDetailData = row
            this.$refs.alarmDetail.assetsInfo = this.assetsInfo
            if (this.alarmDetailData.srcIp) {
                try {
                    let srcIpIsSpite = await getMenace({
                        queryData: {
                            value: row.srcIp
                        }
                    })
                    console.log(srcIpIsSpite)
                    this.alarmDetailData.srcIpVenusIsSpite = srcIpIsSpite[0]
                    this.alarmDetailData.srcIpIsSpite = srcIpIsSpite[1]
                } catch (e) {
                    console.log(e)
                }
            }
            if (this.alarmDetailData.desIp) {
                try {
                    let desIpIsSpite = await getMenace({
                        queryData: {
                            value: row.desIp
                        }
                    })
                    // console.log(desIpIsSpite)
                    this.alarmDetailData.desIpVenusIsSpite = desIpIsSpite[0]
                    this.alarmDetailData.desIpIsSpite = desIpIsSpite[1]
                } catch (e) {
                    console.log(e)
                }
            }
            if (row.msg) {
                console.log('msgmsg', JSON.parse(row.msg))
                let msgData = JSON.parse(row.msg)
                if (msgData.length > 0) this.$refs.alarmDetail.logIds = [...new Set(msgData.map(item => item.id))]
            } else {
                this.$refs.alarmDetail.logIds = []
            }
            this.alarmSeeDialog = true
            if (row.desIp) {
                this.getAssetsInfo(row.desIp)
            }
        },
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        handleClick(tab, event) {
            console.log(tab, event)
            if (tab.name === 'four') {
                // this.$refs.logs.resetFun()
            }
        },
        initUsers() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_sys_users(data).then(res => {
                console.log('所有用', res)
                if (res.length > 0) {
                    this.selectUsersAll = res.map(item => {
                        let obj = {}
                        obj.name = item.chineseName
                        obj.id = item.id
                        return obj
                    })
                }
            }).catch(error => {
                console.log(error)
            })
        },
        async initTask() {
            let res = await this.getTaskInfo()
            console.log('工单信息', res)
            let workTaskInfo = {}
            workTaskInfo.createTime = res.createTime
            workTaskInfo.createUser = res.createUser
            workTaskInfo.deploymentId = res.deploymentId
            workTaskInfo.outTime = res.outTime
            workTaskInfo.status = res.status
            workTaskInfo.currentTime = res.currentTime
            workTaskInfo.currentNodeStatus = ''
            workTaskInfo.workMouldName = res.workMouldName ? res.workMouldName : '--'
            workTaskInfo.workMouldId = res.workMouldId
            workTaskInfo.workOrderContent = res.workOrderContent
            workTaskInfo.nodeIds = res.nodeIds
            if (res.status == 1) {
                if (res.currentTime <= res.outTime || !res.outTime) {
                    workTaskInfo.currentNodeStatus = '待处理'
                }
                if (res.currentTime > res.outTime) {
                    workTaskInfo.currentNodeStatus = '已超时'
                }
            } else if (res.status == 0) {
                workTaskInfo.currentNodeStatus = '已撤销'
            } else if (res.status == 2) {
                workTaskInfo.currentNodeStatus = '已完成'
            }

            workTaskInfo.nodeDes = res.nodeDes
            workTaskInfo.dealType = res.dealType
            if (res.operation || res.operation === 0) {
                workTaskInfo.operation = res.operation
            }

            if (res.disposeData) {
                workTaskInfo.disposeData = this.$deepCopy(res.disposeData)
            } else {
                workTaskInfo.disposeData = {}
            }
            if (res.fields) {
                workTaskInfo.fields = res.fields
            }

            workTaskInfo.players = res.players
            workTaskInfo.approveOpinion = res.approveOpinion
            workTaskInfo.approve = res.approve
            workTaskInfo.nodeId = res.nodeId
            workTaskInfo.nodeType = res.nodeType
            workTaskInfo.level = res.level
            workTaskInfo.processInstanceId = res.processInstanceId
            workTaskInfo.receiveTime = res.receiveTime ? res.receiveTime : '--'
            workTaskInfo.runningNodeName = res.runningNodeName
            workTaskInfo.sourceId = res.sourceId

            workTaskInfo.taskId = res.taskId
            workTaskInfo.workOrderContent = res.workOrderContent
            workTaskInfo.workOrderId = res.workOrderId
            workTaskInfo.workOrderObject = res.workOrderObject
            workTaskInfo.workOrderName = res.workOrderName
            workTaskInfo.workOrderObjectName = res.workOrderObjectName
            workTaskInfo.orderFrom = res.orderFrom
            workTaskInfo.userIds = res.userIds
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
                        taskId: this.$route.query.taskId,
                        workOrderId: this.$route.query.id
                    }
                }
                get_task_info(data).then(res => {
                    if (res.records.length === 0) {
                        this.$message({
                            message: '该数据没有找到！',
                            type: 'warning'
                        })
                        return
                    }
                    resolve(res.records[0])
                }).catch(error => {
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
            get_one_work({ paramsData: obj, queryData: {}}).then(res => {
                console.log(res, '查看数据')
                this.seeForm.xml = res.xml
                this.currentWorkIds = res?.mouldInfo?.running
            }).catch(err => {
                console.log(err + 'err')
            })
            console.log(this.seeForm)
        },
        getRunningNodeName(arr) {
            if (arr && arr.length > 0) {
                return arr.join(',')
            } else {
                return ''
            }
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
            if (e.target.nodeName == 'IMG') { // 判断点击富文本内容为img图片
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
        async checkShow(type) {
            this.agreeStatus = type
            this.agreeTitle = type == 1 ? '同意' : '不同意'
            let isNeedSelected = await this.needSelected(true)
            this.isNeedSelected = isNeedSelected
            this.checkDialog = true
        },
        needSelected(isTrue) {
            return new Promise((resolve, reject) => {
                let obj = {
                    queryData: {},
                    paramsData: {
                        nodeId: this.workTaskInfos.nodeId,
                        count: this.$route.query.userNum,
                        designee: this.$route.query.designee,
                        nodeType: this.workTaskInfos.nodeType,
                        workOrderId: this.workTaskInfos.workOrderId
                    }
                }
                if (isTrue) {
                    obj.paramsData.agree = this.agreeStatus
                }
                needSelected(obj).then(res => {
                    resolve(res)
                }).catch(err => {
                    reject(err)
                    console.log(err + 'err')
                })
            })
        },
        async finishDialogShow() {
            let workTaskInfo = this.$deepCopy(this.workTaskInfos)
            console.log('workTaskInfo', workTaskInfo)

            if ((workTaskInfo.workOrderObject == 1) && workTaskInfo.operation === 0) {
                // this.$refs.analysisForm.validate((valid) => {
                //     if (!valid) {
                //         console.log('error submit!!')
                //         return false
                //     } else {
                //         this.finishDialog = true
                //     }
                // })
                this.$refs.analysisForm.validate().then(async res => {
                    if (!workTaskInfo.runningNodeName[0] == 'User Task') {
                        let isNeedSelected = await this.needSelected()
                        this.isNeedSelected = isNeedSelected
                    }
                    this.finishDialog = true
                })
            } else if ((workTaskInfo.workOrderObject == 1) && workTaskInfo.operation == 2) {
                // this.$refs.handleForm.validate((valid) => {
                //     if (!valid) {
                //         console.log('error submit!!')
                //         return false
                //     } else {
                //         this.finishDialog = true
                //     }
                // })
                this.$refs.handleForm.validate().then(async res => {
                    if (!workTaskInfo.runningNodeName[0] == 'User Task') {
                        let isNeedSelected = await this.needSelected()
                        this.isNeedSelected = isNeedSelected
                    }
                    this.finishDialog = true
                })
            } else if ((workTaskInfo.workOrderObject == 2) && workTaskInfo.operation == 2) {
                // this.$refs.handleLeakForm.validate((valid) => {
                //     if (!valid) {
                //         console.log('error submit!!')
                //         return false
                //     } else {
                //         this.finishDialog = true
                //     }
                // })
                this.$refs.handleLeakForm.validate().then(async res => {
                    if (!workTaskInfo.runningNodeName[0] == 'User Task') {
                        let isNeedSelected = await this.needSelected()
                        this.isNeedSelected = isNeedSelected
                    }
                    this.finishDialog = true
                })
            } else if ((((workTaskInfo.workOrderObject == 1 || workTaskInfo.workOrderObject == 2) && workTaskInfo.dealType == 0) || (!['1', '2', '3', '4', '5'].includes(workTaskInfo.workOrderObject))) && workTaskInfo.runningNodeName[0] != 'User Task') {
                console.log(11111, this.$refs.fieldsForm.validate())
                // this.$refs.fieldsForm.validate((valid) => {
                //     if (!valid) {
                //         console.log('error submit!!')
                //         return false
                //     } else {
                //         this.finishDialog = true
                //     }
                // })
                this.$refs.fieldsForm.validate().then(async res => {
                    if (!workTaskInfo.runningNodeName[0] == 'User Task') {
                        let isNeedSelected = await this.needSelected()
                        this.isNeedSelected = isNeedSelected
                    }
                    this.finishDialog = true
                })
            } else if (workTaskInfo.runningNodeName[0] == 'User Task') {
                // workTaskInfo.handle = this.otherForm.remark
                // this.sureConfirm(workTaskInfo)
                this.finishDialog = true
            } else {
                if (!workTaskInfo.runningNodeName[0] == 'User Task') {
                    let isNeedSelected = await this.needSelected()
                    this.isNeedSelected = isNeedSelected
                }
                this.finishDialog = true
            }
        },
        finishConfim() {
            let workTaskInfo = this.$deepCopy(this.workTaskInfos)
            // this.$getsessionStorage('workTaskInfo');
            let edit = []
            let handle = {}
            let paramsData = null
            // 字段编辑
            if ((workTaskInfo.workOrderObject == 1 || workTaskInfo.workOrderObject == 2) && workTaskInfo.dealType == 0) {
                edit = this.$deepCopy(this.fieldsForm.fields)
                paramsData = Object.assign(this.workTaskInfoFinish, {
                    edit: edit
                })
                if (this.isNeedSelected) {
                    paramsData.selectUsers = this.checkkForm.selectUsers
                    this.$refs.checkkForm.validate(valid => {
                        if (valid) {
                            this.sureConfirm(paramsData)
                        }
                    })
                } else {
                    this.sureConfirm(paramsData)
                }
            }
            // 分析
            if ((workTaskInfo.workOrderObject == 1) && workTaskInfo.operation === 0) {
                console.log('分析')
                handle = this.$deepCopy(this.analysisFormParams)
                if (this.handleFormParams.isReject == 1) {
                    handle.reportStatus = 3
                } else {
                    handle.reportStatus = 1
                }
                paramsData = Object.assign(this.workTaskInfoFinish, {
                    handle: handle
                })
                this.sureConfirm(paramsData)
            }
            // 变更状态
            if ((workTaskInfo.workOrderObject == 1) && workTaskInfo.operation == 1) {
                handle = this.$deepCopy(this.alarmStatusForm)
                paramsData = Object.assign(this.workTaskInfoFinish, {
                    handle: handle
                })
                if (this.isNeedSelected) {
                    paramsData.selectUsers = this.checkkForm.selectUsers
                    this.$refs.checkkForm.validate(valid => {
                        if (valid) {
                            this.sureConfirm(paramsData)
                        }
                    })
                } else {
                    this.sureConfirm(paramsData)
                }
            }
            // 事件处置
            if ((workTaskInfo.workOrderObject == 1) && workTaskInfo.operation == 2) {
                handle = this.$deepCopy(this.handleFormParams)
                if (this.handleFormParams.isReject == 1) {
                    handle.reportStatus = 3
                } else {
                    handle.reportStatus = 2
                }
                paramsData = Object.assign(this.workTaskInfoFinish, {
                    handle: handle
                })
                if (this.isNeedSelected) {
                    paramsData.selectUsers = this.checkkForm.selectUsers
                    this.$refs.checkkForm.validate(valid => {
                        if (valid) {
                            this.sureConfirm(paramsData)
                        }
                    })
                } else {
                    this.sureConfirm(paramsData)
                }
            }
            // 漏洞处置
            if ((workTaskInfo.workOrderObject == 2) && workTaskInfo.operation == 2) {
                handle = this.$deepCopy(this.handleLeakFormParams)
                paramsData = Object.assign(this.workTaskInfoFinish, {
                    handle: handle
                })
                if (this.isNeedSelected) {
                    paramsData.selectUsers = this.checkkForm.selectUsers
                    this.$refs.checkkForm.validate(valid => {
                        if (valid) {
                            this.sureConfirm(paramsData)
                        }
                    })
                } else {
                    this.sureConfirm(paramsData)
                }
            }
            // 溯源
            if ((workTaskInfo.workOrderObject == 1) && workTaskInfo.operation == 3) {
                handle = this.$deepCopy(this.backForm)
                handle.reportStatus = 1
                handle.isTrace = 1
                paramsData = Object.assign(this.workTaskInfoFinish, {
                    handle: handle
                })
                if (this.isNeedSelected) {
                    paramsData.selectUsers = this.checkkForm.selectUsers
                    this.$refs.checkkForm.validate(valid => {
                        if (valid) {
                            this.sureConfirm(paramsData)
                        }
                    })
                } else {
                    this.sureConfirm(paramsData)
                }
            }
            // 二线分析
            if ((workTaskInfo.workOrderObject == 1) && workTaskInfo.operation == 4) {
                handle = this.$deepCopy(this.alarmAddviceForm)
                paramsData = Object.assign(this.workTaskInfoFinish, {
                    handle: handle
                })
                if (this.isNeedSelected) {
                    paramsData.selectUsers = this.checkkForm.selectUsers
                    this.$refs.checkkForm.validate(valid => {
                        if (valid) {
                            this.sureConfirm(paramsData)
                        }
                    })
                } else {
                    this.sureConfirm(paramsData)
                }
            }
            // 审核
            if (this.currentTab == 1 && workTaskInfo.dealType == 2) {
                console.log('shenhe')
                paramsData = this.$deepCopy(this.workTaskInfoFinish)
                paramsData.approve = this.agreeStatus
                paramsData.approveOpinion = this.checkkForm.approveOpinion
                if (this.isNeedSelected) {
                    paramsData.selectUsers = this.checkkForm.selectUsers
                    this.$refs.checkkForm.validate(valid => {
                        if (valid) {
                            this.sureConfirm(paramsData)
                        }
                    })
                } else {
                    this.sureConfirm(paramsData)
                }
            }
            // 备注
            // (workTaskInfo.workOrderObject != 1) && (workTaskInfo.workOrderObject != 2)
            //
            if (!['1', '2', '3', '4', '5'].includes(workTaskInfo.workOrderObject) && workTaskInfo.runningNodeName[0] != 'User Task') {
                console.log('12345')
                if (this.finishDialog) {
                    let fields = this.$deepCopy(this.fieldsForm.fields)
                    fields.map(item => {
                        handle[item.field] = item.val
                    })
                    this.workTaskInfoFinish.approve = 1
                    paramsData = Object.assign(this.workTaskInfoFinish, {
                        handle: handle
                    })
                    if (this.isNeedSelected) {
                        paramsData.selectUsers = this.checkkForm.selectUsers
                        this.$refs.checkkForm.validate(valid => {
                            if (valid) {
                                this.sureConfirm(paramsData)
                            }
                        })
                    } else {
                        this.sureConfirm(paramsData)
                    }
                }
            }
            if (workTaskInfo.workOrderObject == 3 || workTaskInfo.workOrderObject == 4 || workTaskInfo.workOrderObject == 5) {
                if (this.checkDialog) {
                    paramsData = this.$deepCopy(this.workTaskInfoFinish)
                    paramsData.approve = this.agreeStatus
                    paramsData.approveOpinion = this.checkkForm.approveOpinion
                    if (this.isNeedSelected) {
                        paramsData.selectUsers = this.checkkForm.selectUsers
                        this.$refs.checkkForm.validate(valid => {
                            if (valid) {
                                this.sureConfirm(paramsData)
                            }
                        })
                    } else {
                        this.sureConfirm(paramsData)
                    }
                }
                if (this.finishDialog) {
                    handle = this.$deepCopy(this.otherForm)
                    this.workTaskInfoFinish.approve = 1
                    paramsData = Object.assign(this.workTaskInfoFinish, {
                        handle: handle
                    })
                    if (this.isNeedSelected) {
                        paramsData.selectUsers = this.checkkForm.selectUsers
                        this.$refs.checkkForm.validate(valid => {
                            if (valid) {
                                this.sureConfirm(paramsData)
                            }
                        })
                    } else {
                        this.sureConfirm(paramsData)
                    }
                }
            }
            // 无模板
            if (workTaskInfo.runningNodeName[0] == 'User Task') {
                if (this.finishDialog) {
                    console.log(1)
                    handle = this.$deepCopy(this.otherForm)
                    this.workTaskInfoFinish.approve = 1
                    paramsData = Object.assign(this.workTaskInfoFinish, {
                        handle: handle
                    })
                    this.$refs.otherForm.validate(valid => {
                        if (valid) {
                            this.sureConfirm(paramsData)
                        }
                    })
                }
            }
        },
        sureConfirm(paramsData) {
            console.log(2)
            let data = {
                queryData: {},
                paramsData: paramsData
            }
            if (this.taskClick) {
                this.$message({
                    message: '正在发送请求中,请稍等！',
                    type: 'info'
                })
                return
            }
            if (!this.taskClick) {
                this.taskClick = true
            }
            console.log('paramsData.handle', paramsData)
            finish_workTask(data).then(res => {
                console.log('工单任务完成', res)
                this.taskClick = false
                this.finishDialog = false
                this.checkDialog = false
                this.isNeedSelected = false
                this.$message({
                    message: '操作成功！',
                    type: 'success'
                })
                setTimeout(() => {
                    this.$router.go(-1)
                }, 1500)
            }).catch(err => {
                this.taskClick = false
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
            this.alarmActiveName = 'first'
            this.reportFrom = row.reportFrom
            this.alarmId = row.id
            this.logType = row.logType
            this.timeDiffer = row.createTime
            this.detailArr = row
            if (row.msg) {
                console.log('msgmsg', JSON.parse(row.msg))
                let msgData = JSON.parse(row.msg)
                if (msgData.length > 0) this.logIds = [...new Set(msgData.map(item => item.id))]
            } else {
                this.logIds = []
            }
            this.report_params.id = row.id
            if (row.desIp) {
                this.getAssetsInfo(row.desIp)
            }
            this.get_report_data()
            this.detailDialog = true
        },
        getAssetsInfo(ip) {
            let data = {
                ip: ip
            }
            ip_searchAsset(data).then(res => {
                console.log('3333333333333', res)
                this.assetsInfo = this.$deepCopy(res)
            }).catch(error => {
                console.log(error + 'error')
            })
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
            get_workTask_detail(data).then(res => {
                console.log('工单任务详情', res)
                this.$set(this, 'leaksInfo', res.leaksInfo)
                this.$set(this, 'alarmInfo', res.alarmInfo)
                if (res.alarmInfo) {
                    this.msg = res.alarmInfo.msg
                    this.alarmInfoTable = [res.alarmInfo]
                    this.timeDiffer = res.createTime
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
            }).catch(err => {
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
$zero: #00bcd4;
$one: #00c7ff;
$two: #f2cd00;
$three: #fc7f00;
$fore: #fd0001;
$status1: #ffdd00;
$status2: #01ff01;
$status3: #00e1fd;
$status4: #e1e2e4;
.work-detail ::v-deep  .drawer-tabs.el-tabs .el-tabs__item.is-top {
    border-bottom: none !important;
}
.click-btn {
    cursor: pointer;
    font-size: 12px;
    i {
        margin-right: 5px;
        color: #387dee;
    }
    span.val {
        color: #387dee;
    }
}
.click-btn:hover {
    background: #dddddd;
}
.table-container {
    display: flex;
    justify-content: flex-start;
    width: 50%;
    &:nth-child(2n) {
        background-color: rgb(29 65 105 / 50%);
    }
}
.table-left,
.table-right {
    padding: 4px 10px;
    font-size: 16px;
    border: 1px solid #1a5c92;
    background: rgb(3 50 84 / 50%);
}
.table-left {
    padding-right: 10px;
    width: 160px !important;
    border-right: none;
    text-align: right;
    color: #ffffff;
    opacity: 0.6;
    flex-shrink: 0;

    /* white-space: nowrap; */
}
.table-right {
    width: calc(100% - 160px);
}
.event {
    position: relative;
    padding: 0;
    box-sizing: border-box;
}
.event-content {
    margin: 10px;
    background-color: #ffffff;
}
.custom-star {
    .event-content {
        background-color: #052942!important;
    }
    .tab-button {
        border: solid 1px #50b0ff;
        background-color: rgba($color: #136dac, $alpha: 20%);
        box-shadow: inset 0 0 18px 0
            #00b4ff;
        & div {
            color: #ffffff;
        }
    }
    .text-name {
        color: #ffffff;
    }
    .label {
        border: 1px solid #1cd7fa;
        color: #ffffff;
        background-color: #052942;
    }
    .label-val {
        border: 1px solid #1cd7fa;
        color: #ffffff;
    }
    .basic-info ::v-deep {
        .el-descriptions__body .el-descriptions-item__label.is-bordered-label,.el-descriptions__body .el-descriptions-item__label.is-bordered-label {
            border: 1px solid #1cd7fa !important;
            color: #ffffff !important;
            background: #052942 !important;
        }
        .el-descriptions .is-bordered .el-descriptions-item__cell {
            border: 1px solid #1cd7fa!important;
            color: #ffffff;
        }
        .el-descriptions__body {
            background-color: #052942!important;
        }
    }
}
.event ::v-deep .el-timeline-item__timestamp.is-top {
    position: absolute;
    top: 0;
    left: -145px;
    margin-bottom: 8px;
    padding-top: 3px;
    width: 130px;
    font-size: 12px;
    text-align: right;
    color: rgb(0 0 0 / 90%);
}
.event ::v-deep .el-range-input {
    color: #ffffff;
    background-color: rgb(0 0 0 / 0%);
}
.event ::v-deep .el-range-separator {
    color: #ffffff;
}
.el-tabs ::v-deep .el-tabs__nav-wrap::after {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 1px;
    background-color: rgb(28 215 250 / 20%);
    content: '';
}
.el-tabs ::v-deep .el-tabs__active-bar {
    background: #387dee;
    // margin-left: 14px;
}
.el-tabs ::v-deep .el-tabs__item.is-active {
    height: 34px;
    border: none !important;
    color: #387dee;
    box-shadow: none !important;
    line-height: 34px;
}
.el-tabs ::v-deep .el-tabs__item.is-top,
.container ::v-deep .el-tabs__active-bar.is-top {
    // margin-left: 14px;
}
.el-tabs ::v-deep .el-tabs__item.is-top {
    margin-left: 14px;
    border-bottom: 1px solid #387dee;
    color: #387dee;
}
.drawer-tabs ::v-deep .el-tabs__item.is-top {
    margin-left: 0;
    border-bottom: none;
    color: rgb(0 0 0 / 60%);
}
.drawer-tabs ::v-deep .el-tabs__content {
    height: calc(100% - 54px);
    .el-tab-pane {
        height: 100%;
    }
}
.drawer-tabs ::v-deep .el-tabs__item.is-active {
    color: #387dee;
}
.el-drawer__wrapper .el-tabs__item:hover {
    color: #387dee;
}
.el-drawer__wrapper .el-tabs__item {
    color: rgb(0 0 0 / 60%);
    box-shadow: none;
}
.info-title {
    margin-bottom: 18px;
    // margin-left: 14px;
    font-size: 12px;
    color: #0052d9;
}
.task-status {
    margin: 16px 0 30px;
    padding-right: 30px;
    box-sizing: border-box;
}
.task-status>div:nth-child(1) {
    font-size: 22px;
    color: rgb(0 0 0 / 90%);
}
.assets-big-image ::v-deep .el-image-viewer__close {
    color: #00e1ff !important;
}
.task-status>div:nth-child(2) {
    font-size: 12px;
    color: rgb(0 0 0 / 90%);
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
.title-level {
    margin: 0 5px;
    padding: 2px 21px;
    font-size: 12px;
    border: 1px solid $zero;
    border-radius: 3px;
    color: $zero;
    background: rgba($zero, 0.2);
    line-height: 1;
    &.one {
        border-color: $one;
        color: $one;
        background: rgba($one, 0.2);
    }
    &.two {
        border-color: $two;
        color: $two;
        background: rgba($two, 0.2);
    }
    &.three {
        border-color: $three;
        color: $three;
        background: rgba($three, 0.2);
    }
    &.fore {
        border-color: $fore;
        color: $fore;
        background: rgba($fore, 0.2);
    }
}
.drawer-pad {
    overflow-y: auto;
    // padding: 0 20px;
    height: calc(100% - 24px);
    & ::v-deep img {
        max-width: 600px;
        max-height: 600px;
    }
    &::-webkit-scrollbar, li::-webkit-scrollbar, ul::-webkit-scrollbar {
        width: 4px;
    }
    &::-webkit-scrollbar-track, li::-webkit-scrollbar-track, ul::-webkit-scrollbar-track {
        background: none;
    }
}
.drawer-pad ::v-deep .el-form-item__content {
    font-size: 12px;
}
.drawer-pad ::v-deep .el-form-item__label {
    font-size: 12px;
    color: #999999!important;
}
.basic-info {
    position: relative;
    .chapter {
        position: absolute;
        top: 20px;
        right: 30px;
        transform: rotateZ(15deg);
    }
}
.basic-info ::v-deep .el-descriptions__body .el-descriptions__table {
    border-radius: 4px;
}
.black-theme .basic-info ::v-deep .el-descriptions__body {
    color: #ffffff;
    background: #033254;
}
.black-theme .basic-info ::v-deep .el-descriptions-item__label.is-bordered-label {
    color: #ffffff;
    background: #00466d;
    box-shadow: inset 0 0 2px rgb(0 186 255 / 73%);
}
.basic-info ::v-deep .el-descriptions-item__label.is-bordered-label {
    width: 120px;
}
.black-theme .basic-info ::v-deep .el-descriptions .is-bordered .el-descriptions-item__cell {
    border: 1px solid #1a5c92;
}
.black-theme .basic-info ::v-deep .el-descriptions-row {
    box-shadow: inset 0 0 6px 0
        rgb(0 186 255 / 73%),
        inset 0 -1px 0 0
        rgb(40 82 124 / 50%) !important;
}
.label {
    margin-right: 15px;
    width: 100px;
    font-size: 12px;
    text-align: right;
    color: #999999;
    line-height: 32px;
}
.label-val {
    padding: 8px;
    min-height: 32px;
    font-size: 12px;
    border: 1px solid #ebf1f5;
    color: rgb(0 0 0 / 90%);
    word-break: break-all;
}
.event ::v-deep .el-timeline-item__tail {
    border-left: 2px solid #00b7ee !important;
}
.event ::v-deep .el-timeline-item__node--large {
    z-index: 2;
    background-color: #387dee!important;
}
.event ::v-deep .el-timeline-item__icon.el-icon-circle-check {
    font-size: 20px !important;
    color: #ffffff !important;
}
.event ::v-deep .el-timeline-item__icon.icon-circle {
    font-size: 16px !important;
    font-weight: 500;
    color: #00b7ee !important;
}
.time-box {
    margin-bottom: 10px;
    width: 100%;
    height: 20px;
}
.time-left>h4 {
    font-weight: 500;
    color: rgb(0 0 0 / 90%);
}
.time-left>p {
    margin-top: 5px;
    font-size: 12px;
    color: #999999;
}
.time-right>div.one {
    color: #c0c0c0;
}
.time-right>div.two {
    color: #fdb900;
}
.time-right>div.three {
    color: #00bffe;
}
.time-right>p {
    margin-top: 5px;
    font-size: 12px;
    color: #ffffff;
}
.event ::v-deep .el-table__empty-block {
    background-color: #ffffff;
}
.event ::v-deep .edui-editor-iframeholder {
    height: 200px !important;
}
.list-tips .el-icon-sort {
    cursor: pointer;
    margin-left: 10px;
    transform: rotate(90deg);
    color: #387dee;
}
.tab-button {
    margin-bottom: 2px;
    height: 30px;
    background-color: #ffffff;
    & div {
        width: 80px;
        height: 30px;
        font-size: 14px;
        text-align: center;
        color: rgb(0 0 0 / 60%);
        line-height: 30px;
        cursor: pointer;
        box-sizing: border-box;
        &.tab-active {
            border-bottom: 1px solid #387dee;
            color: #387dee;
        }
    }
}
</style>
<style lang="scss">
    .add-search-order-detail.el-popover {
        border: solid 1px #dddddd;
        color: rgb(0 0 0 / 60%);
        background: #ffffff;
    }
    .time-text-box {
        padding: 5px;
        border: solid 1px #dddddd;
        border-radius: 3px;
        background-color: #f5f8fe;
    }
    .time-text-box-item {
        overflow: hidden;
        margin: 10px 0;
    }
    .time-text-box-left {
        float: left;
        margin-right: 10px;
        font-size: 12px;
        color: rgb(0 0 0 / 40%);
        letter-spacing: 1px;
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
        color: #999999;
    }
    .time-text-box-bottom span {
        font-size: 10px;
        color: #999999;
    }
    .time-text-box-right {
        float: left;
        width: 88%;
        font-size: 12px;
        color: rgb(0 0 0 / 90%);
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
