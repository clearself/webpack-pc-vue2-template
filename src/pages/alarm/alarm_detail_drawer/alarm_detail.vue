<template>
    <div>
        <!-- 详情侧拉框 -->
        <el-drawer :visible.sync="seeDialog" direction="rtl" :size="1200" :wrapperClosable="false" title="查看内容">
            <div class="drawer-content event">
                <div style="position: relative;left:0;top:0;width:100%;height:100%;overflow-y: auto;">
                    <div class="ub ub-pj w100">
                        <div class="list-tip">
                            <span style="font-weight:600">{{ seeForm.reportName }}</span>
                            <span v-if="seeForm.reportLevel == 0" class="title-level zero">低</span>
                            <span v-if="seeForm.reportLevel == 1" class="title-level one">中低</span>
                            <span v-if="seeForm.reportLevel == 2" class="title-level two">中</span>
                            <span v-if="seeForm.reportLevel == 3" class="title-level three">中高</span>
                            <span v-if="seeForm.reportLevel == 4" class="title-level fore">高</span>

                            <span
                                v-if="seeForm.reportStatus == 0"
                                style="color:#e47700;background:rgba(255,186,0,0.3);font-size: 12px;border-radius: 16px;line-height: 1;padding: 3px 15px;">待确认</span>
                            <span
                                v-if="seeForm.reportStatus == 1"
                                style="color:#03864f;background:rgba(0,255,0,0.3);font-size: 12px;border-radius: 16px;line-height: 1;padding: 3px 15px;">已确认</span>
                            <span
                                v-if="seeForm.reportStatus == 2"
                                style="color:#0052d9;background:rgba(0,192,255,0.3);font-size: 12px;border-radius: 16px;line-height: 1;padding: 3px 15px;">已处置</span>
                            <span
                                v-if="seeForm.reportStatus == 3"
                                style="color:#aa0202;background:rgba(255,58,58,0.3);font-size: 12px;border-radius: 16px;line-height: 1;padding: 3px 15px;">已驳回</span>
                        </div>
                        <div class="ub">
                            <div>
                                <el-button style="margin-right: 5px;" icon="el-icon-plus" :disabled="currentRow.isStart==1" type="primary" title="发起工单" @click="changeOption(1,currentRow)" size="small">发起工单</el-button>
                                <el-button style="margin-right: 5px;" icon="el-icon-sort" type="success" title="状态变更"  @click="changeOption(3,currentRow)" size="small">状态变更</el-button>
                                <el-button :disabled="currentRow.reportFrom==1" style="margin-right: 5px;" icon="el-icon-edit" type="primary" title="编辑事件"  @click="changeOption(2,currentRow)" size="small">编辑事件</el-button>
                            </div>
                        </div>
                    </div>
                    <div class="drawer-pad">
                        <el-tabs v-model="activeName" @tab-click="handleClick">
                            <el-tab-pane label="基本信息" name="first">
                                <BasicInfo :seeForm="seeForm"></BasicInfo>
                            </el-tab-pane>
                            <el-tab-pane label="工单详情" name="two" @click.stop>
                                <WorkInfo :workFlowInfo="workFlowInfo"></WorkInfo>
                                <!--  v-if="bpmRecord.length>0" -->
                                <div v-if="bpmRecord.length>0" style="margin-top:20px;font-size: 12px;color: rgba(0,0,0,.9);">流转记录：</div>
                                <el-row v-if="bpmRecord.length>0" style='margin-bottom:20px; width:99%;' type="flex" justify="center">
                                    <el-form :model="passForm" class="w100" ref="passForm" :inline="true" style="color: rgba(0,0,0,.9)">
                                        <el-form-item class="record-item" label="" prop="" style="width:100%;">
                                            <div
                                                class="work-record"
                                                style="
                                                width:100%;
                                                padding-top:10px;
                                                box-sizing: border-box;">
                                                <el-timeline style="width:92%;margin-left: 88px;box-sizing: border-box;">
                                                    <el-timeline-item
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
                                                                <h4 style="color: rgba(0,0,0,0.9);font-size: 14px;">{{activity.userName|NullStr}}<sub style="font-size:12px;color: rgba(0,0,0,0.9);opacity: 0.6;margin-left: 10px;vertical-align: bottom;font-weight:normal">{{activity.userRole|NullStr}}</sub></h4>
                                                            </div>
                                                            <div class="time-right" style="width: 150px;text-align: right;">
                                                                <el-button
                                                                    type="text"
                                                                    style="text-decoration: underline;font-size:12px;"
                                                                    :class="{'el-icon-arrow-down':activity.isOpen,'el-icon-arrow-up':!activity.isOpen}"
                                                                    @click="look(activity,index)"
                                                                >展开查看</el-button>
                                                            </div>
                                                        </div>
                                                        <div v-show="activity.isOpen" style="border: solid 1px #dddddd;">
                                                            <div class="time-text-box" v-if="(workFlowInfo.field.workOrderObject == 1||workFlowInfo.field.workOrderObject == 2)&&activity.dealType==0">
                                                                <div class="ub w100 time-text-box-item" v-for="(item,_index) in activity.dealContent" :key="_index">
                                                                    <div class="time-text-box-left">{{item.name}}:</div>
                                                                    <div v-if="item.valType==='text'||item.valType==='select'" class="ub ub-f1 ub-ver time-text-box-right">{{item|getVal}}</div>
                                                                    <div v-else class="ub ub-f1 ub-ver time-text-box-right" v-html="item.val" @click="imageEnlargement"></div>
                                                                </div>
                                                            </div>
                                                            <!-- 告警分析 -->
                                                            <div class="time-text-box" v-if="workFlowInfo.field.workOrderObject == 1&&activity.operation==0">
                                                                <div class="ub w100 time-text-box-item">
                                                                    <div class="time-text-box-left">是否驳回：</div>
                                                                    <div class="ub ub-f1 ub-ver time-text-box-right">{{activity.dealContent.isReject==1?'是':'否'}}</div>
                                                                </div>
                                                                <div class="ub w100 time-text-box-item">
                                                                    <div class="time-text-box-left">分析过程：</div>
                                                                    <div class="ub ub-f1 ub-ver time-text-box-right" v-html="activity.dealContent.analyzePro" @click="imageEnlargement"></div>
                                                                </div>
                                                                <div class="ub w100 time-text-box-item" v-if="activity.dealContent.isReject==1">
                                                                    <div class="time-text-box-left">驳回理由：</div>
                                                                    <div class="ub ub-f1 ub-ver time-text-box-right" v-html="activity.dealContent.rejectReason" @click="imageEnlargement"></div>
                                                                </div>
                                                                <div v-else class="ub w100 time-text-box-item">
                                                                    <div class="time-text-box-left">处置建议：</div>
                                                                    <div class="ub ub-f1 ub-ver time-text-box-right" v-html="activity.dealContent.advice" @click="imageEnlargement"></div>
                                                                </div>
                                                            </div>
                                                            <!-- 告警处置 -->
                                                            <div class="time-text-box" v-if="workFlowInfo.field.workOrderObject == 1&&activity.operation&&activity.operation==2">
                                                                <div class="ub w100 time-text-box-item">
                                                                    <div class="time-text-box-left">审核状态：</div>
                                                                    <div class="ub ub-f1 ub-ver time-text-box-right">{{activity.dealContent.isReject==1?'驳回':'处置'}}</div>
                                                                </div>
                                                                <div class="ub w100 time-text-box-item" v-if="activity.dealContent.isReject==1">
                                                                    <div class="time-text-box-left">驳回理由：</div>
                                                                    <div class="ub ub-f1 ub-ver time-text-box-right" v-html="activity.dealContent.rejectReason" @click="imageEnlargement"></div>
                                                                </div>
                                                                <div class="w100" v-if="activity.dealContent.isReject!=1">
                                                                    <div class="ub w100 time-text-box-item">
                                                                        <div class="time-text-box-left">处置方式：</div>
                                                                        <div class="ub ub-f1 time-text-box-right">{{ activity.dealContent.disposalType|getdisposalType }}</div>
                                                                    </div>
                                                                    <div class="ub w100 time-text-box-item" v-if="activity.dealContent.disposalType == 0">
                                                                        <div class="time-text-box-left">IP：</div>
                                                                        <div class="ub ub-f1 ub-ver time-text-box-right">{{handdeelIps(activity.dealContent.ips)}}</div>
                                                                    </div>
                                                                    <div class="ub w100 time-text-box-item" v-if="activity.dealContent.disposalType == 0 && activity.dealContent.isReject != 3">
                                                                        <div class="time-text-box-left">封禁对象：</div>
                                                                        <div class="ub ub-f1 ub-ver time-text-box-right">{{getObjs(activity.dealContent.objs)}}</div>
                                                                    </div>
                                                                    <div class="ub w100 time-text-box-item" v-if="activity.dealContent.disposalType == 1||activity.dealContent.disposalType == 2">
                                                                        <div class="time-text-box-left">变更项：</div>
                                                                        <div class="ub ub-f1 ub-ver time-text-box-right">{{ activity.dealContent.changeItem|getchangeItem }}</div>
                                                                    </div>
                                                                    <div class="ub w100 time-text-box-item" v-if="activity.dealContent.disposalType == 1||activity.dealContent.disposalType == 2||activity.dealContent.disposalType == 3">
                                                                        <div class="time-text-box-left">设备：</div>
                                                                        <div class="ub ub-f1 ub-ver time-text-box-right">{{ getassetIds(activity.dealContent.assetIds) }}</div>
                                                                    </div>
                                                                    <div class="ub w100 time-text-box-item" v-if="activity.dealContent.disposalType == 4">
                                                                        <div class="time-text-box-left">业务系统：</div>
                                                                        <div class="ub ub-f1 ub-ver time-text-box-right">{{ getassetSystemId(activity.dealContent.assetSystemId) }}</div>
                                                                    </div>
                                                                    <div class="ub w100 time-text-box-item" v-if="activity.dealContent.disposalType == 4">
                                                                        <div class="time-text-box-left">业务人员：</div>
                                                                        <div class="ub ub-f1 ub-ver time-text-box-right">{{ getassetUserId(activity.dealContent.assetUserId) }}</div>
                                                                    </div>
                                                                    <div class="ub w100 time-text-box-item" v-if="activity.dealContent.disposalType == 5">
                                                                        <div class="time-text-box-left">其他：</div>
                                                                        <div class="ub ub-f1 ub-ver time-text-box-right" v-html="activity.dealContent.otherMsg" @click="imageEnlargement"></div>
                                                                    </div>
                                                                    <div class="ub w100 time-text-box-item" v-if="activity.dealContent.disposalType != 0 && activity.dealContent.disposalType != 5">
                                                                        <div class="time-text-box-left">备注：</div>
                                                                        <div class="ub ub-f1 ub-ver time-text-box-right" v-html="activity.dealContent.changeLog" @click="imageEnlargement"></div>
                                                                    </div>
                                                                    <div class="w100 time-text-box-item">
                                                                        <div class="time-text-box-left">处置结果：</div>
                                                                        <div class="time-text-box-right" v-html="activity.dealContent.actionResults" @click="imageEnlargement"></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <!-- 告警溯源 -->
                                                            <div class="time-text-box" v-if="workFlowInfo.field.workOrderObject == 1&&activity.operation&&activity.operation==3">
                                                                <div class="ub w100 time-text-box-item">
                                                                    <div class="time-text-box-left">溯源结果：</div>
                                                                    <div class="ub ub-f1 ub-ver time-text-box-right" v-html="activity.dealContent.traceResult" @click="imageEnlargement"></div>
                                                                </div>
                                                            </div>
                                                            <!-- 状态变更 -->
                                                            <div class="time-text-box" v-if="workFlowInfo.field.workOrderObject==1&&activity.operation&&activity.operation==1">
                                                                <div class="ub w100 time-text-box-item">
                                                                    <div class="time-text-box-left">事件状态：</div>
                                                                    <div class="ub ub-f1 ub-ver time-text-box-right">{{activity.dealContent.reportStatus|getreportStatus}}</div>
                                                                </div>
                                                            </div>
                                                            <!-- 二线分析 -->
                                                            <div class="time-text-box" v-if="workFlowInfo.field.workOrderObject == 1&&activity.operation&&activity.operation==4">
                                                                <div class="ub w100 time-text-box-item">
                                                                    <div class="time-text-box-left">追加建议：</div>
                                                                    <div class="ub ub-f1 ub-ver time-text-box-right" v-html="activity.dealContent.appendProposal" @click="imageEnlargement"></div>
                                                                </div>
                                                            </div>

                                                            <!-- 备注 -->
                                                            <div class="time-text-box" v-if="workFlowInfo.field.workOrderObject != 1 && workFlowInfo.field.workOrderObject != 2 && activity.dealContent">
                                                                <div class="ub w100 time-text-box-item">
                                                                    <div class="time-text-box-left">备注：</div>
                                                                    <div
                                                                        class="ub ub-f1 ub-ver time-text-box-right"
                                                                        v-html="activity.dealContent?activity.dealContent.remark:''"
                                                                        @click="imageEnlargement"></div>
                                                                </div>
                                                            </div>

                                                            <!-- 审核 -->
                                                            <div class="time-text-box" v-if="activity.dealType&&activity.dealType==2">
                                                                <div class="ub w100 time-text-box-item">
                                                                    <div class="time-text-box-left">审核意见：</div>
                                                                    <div class="ub ub-f1 ub-ver time-text-box-right" v-html="activity.approveOpinion" @click="imageEnlargement"></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="ub w100" style="margin-top: 8px;">
                                                            <div class="time-text-box-bottom mr-1"><i class="iconfont icon-jiediankaishishijian" style="color:#266fe8;font-size:14px"></i> <span>开始：{{activity.receiveTime|NullStr}}</span></div>
                                                            <div class="time-text-box-bottom mr-1"><i class="iconfont icon-jiediantingliushijian" style="color:#266fe8;font-size:14px"></i> <span>停留时长：<strong>{{activity.stayTime|NullStr}}</strong></span></div>
                                                            <div class="time-text-box-bottom mr-1"><i class="iconfont icon-jiediantingliushijian" style="color:#266fe8;font-size:14px"></i> <span>超时时长：<strong>{{activity.allTime|NullStr}}</strong></span></div>
                                                            <div class="time-text-box-bottom mr-1"><i class="iconfont icon-chuliren" style="color:#266fe8;font-size:14px"></i> <span>处理人：<strong class="users">{{activity.players|NullStr}}</strong></span></div>
                                                        </div>
                                                    </el-timeline-item>
                                                </el-timeline>
                                            </div>
                                        </el-form-item>
                                    </el-form>

                                </el-row>
                            </el-tab-pane>
                            <el-tab-pane label="资产信息" name="three">
                                <AssetInfo :assetsInfo="assetsInfo"></AssetInfo>
                                <div v-if="assetsInfo.ips&&assetsInfo.ips.length>0" type="flex" justify="start" class="mt-1">
                                    <el-table
                                        ref="ipstiple"
                                        class='bigTable'
                                        :data="assetsInfo.ips"
                                        border
                                        stripe
                                        tooltip-effect="dark"
                                        :row-style="{ height: '32px' }"
                                        :header-row-style="{ height: '32px' }">
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
                                <Logs ref="logs" :logIds="logIds" :alarmId="alarmId" :tabindex="activeName"></Logs>
                            </el-tab-pane>
                            <el-tab-pane label="归并事件" name="five">
                                <el-table
                                    ref="multipleTable4"
                                    class='bigTable'
                                    :data="reportTableData"
                                    border
                                    stripe
                                    :row-style="{ height: '32px' }"
                                    :header-row-style="{ height: '32px' }"
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
                                    <el-table-column prop="srcIp" label="源ip" width="120">
                                    </el-table-column>
                                    <el-table-column prop="srcPort" label="源端口" width="100">
                                    </el-table-column>
                                    <el-table-column prop="desIp" label="目的ip" width="120">
                                    </el-table-column>
                                    <el-table-column prop="desPort" label="目的端口" width="100">
                                    </el-table-column>
                                    <el-table-column prop="reportTypeName" label="事件类型"  show-overflow-tooltip>
                                    </el-table-column>
                                    <el-table-column align="center" label="操作" fixed="right" class-name="deepBg" width="120">
                                        <template slot-scope="scope">
                                            <el-button type="text" size="small" @click="detailReportData(scope.row)">详情</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <pagination :total="total_report_num" :page.sync="report_params.page" :limit.sync="report_params.size"  style="padding-top:10px" @pagination="get_report_data"/>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </div>
            </div>
        </el-drawer>
        <!--发起事件内容开始-->
        <el-dialog v-dialogDrag title="发起事件" :visible.sync="addDialog" width="700px" custom-class="common-dialog">
            <el-form :model="addForm" :rules="rules" ref="addForm" :inline="true">
                <el-form-item label="事件名称：" :label-width="formLabelWidth" prop="reportName">
                    <el-input placeholder="请输入事件名称" clearable v-model="addForm.reportName" size="small"></el-input>
                </el-form-item>
                <el-form-item label="事件类型：" :label-width="formLabelWidth" prop="reportType">
                    <el-select size="small" v-model="addForm.reportType" clearable placeholder="请选择">
                        <el-option v-for="(item) in typeList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="事件资产：" prop="asset" :label-width="formLabelWidth">
                    <el-input placeholder="请输入资产名称" clearable v-model="addForm.asset" size="small" disabled></el-input>
                </el-form-item>
                <el-form-item label="目的IP：" prop="desIp" :label-width="formLabelWidth">
                    <el-input placeholder="请输入目的IP" v-model="addForm.desIp" size="small">
                        <i slot="suffix" @click="getAsset_add" style="cursor: pointer" class="el-input__icon el-icon-search"></i>
                    </el-input>
                </el-form-item>
                <el-form-item label="事件等级：" :label-width="formLabelWidth" prop="reportLevel">
                    <el-select size="small" v-model="addForm.reportLevel" clearable placeholder="请选择">
                        <el-option label="低" value="0"></el-option>
                        <el-option label="中低" value="1"></el-option>
                        <el-option label="中" value="2"></el-option>
                        <el-option label="中高" value="3"></el-option>
                        <el-option label="高" value="4"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="事件状态：" :label-width="formLabelWidth" prop="reportStatus">
                    <el-select size="small" v-model="addForm.reportStatus" clearable placeholder="请选择" disabled>
                        <el-option label="待确认" value="0"></el-option>
                        <el-option label="已确认" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="源IP：" :label-width="formLabelWidth" prop="srcIp">
                    <el-input placeholder="请输入源IP" clearable v-model="addForm.srcIp" size="small"></el-input>
                </el-form-item>
                <el-form-item label="源端口：" :label-width="formLabelWidth" prop="srcPort">
                    <el-input
                        placeholder="请输入源端口"
                        clearable
                        v-model="addForm.srcPort"
                        type="number"
                        onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                        size="small"></el-input>
                </el-form-item>
                <el-form-item label="目的端口：" :label-width="formLabelWidth" prop="assetPort">
                    <el-input
                        placeholder="请输入目的端口"
                        clearable
                        v-model="addForm.desPort"
                        type="number"
                        onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                        size="small"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <div class="ub w100">
                        <div style="width:100px;text-align:right">
                            事件描述：
                        </div>
                        <div style='width:760px'>
                            <div class="ub ub-pc ub-f1">
                                <vue-ueditor-wrap v-model="addForm.reportDesc" :config="myConfig"></vue-ueditor-wrap>
                            </div>
                        </div>
                    </div>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <Debounce :time='1500' :isDebounce="2">
                    <searchBtn title="确 定" @click.native="submitForm('addForm')" />
                </Debounce>
                <cancelBtn title="取 消" @click="addDialog = false" />
            </span>
        </el-dialog>
        <!--编辑内容开始-->
        <el-dialog v-dialogDrag title="编辑事件" :visible.sync="editDialog" width="700px" custom-class="common-dialog">
            <el-form :model="editForm" :rules="rules" ref="editForm" :inline="true">
                <el-form-item label="事件名称：" :label-width="formLabelWidth" prop="reportName">
                    <el-input placeholder="请输入事件名称" clearable v-model="editForm.reportName" size="small"></el-input>
                </el-form-item>
                <el-form-item label="事件类型：" :label-width="formLabelWidth" prop="reportType">
                    <el-select size="small" v-model="editForm.reportType" clearable placeholder="请选择">
                        <el-option v-for="(item) in typeList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="事件资产：" prop="asset" :label-width="formLabelWidth">
                    <el-input placeholder="请输入资产名称" clearable v-model="editForm.asset" size="small" disabled></el-input>
                </el-form-item>
                <el-form-item label="目的IP：" prop="desIp" :label-width="formLabelWidth">
                    <el-input placeholder="请输入目的IP" v-model="editForm.desIp" size="small">
                        <i slot="suffix" @click="getAsset_edit" style="cursor: pointer" class="el-input__icon el-icon-search"></i>
                    </el-input>
                </el-form-item>
                <el-form-item label="事件等级：" :label-width="formLabelWidth" prop="reportLevel">
                    <el-select size="small" v-model="editForm.reportLevel" clearable placeholder="请选择">
                        <el-option label="低" value="0"></el-option>
                        <el-option label="中低" value="1"></el-option>
                        <el-option label="中" value="2"></el-option>
                        <el-option label="中高" value="3"></el-option>
                        <el-option label="高" value="4"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="事件状态：" :label-width="formLabelWidth" prop="reportStatus">
                    <el-select size="small" v-model="editForm.reportStatus" clearable placeholder="请选择" disabled>
                        <el-option label="待确认" value="0"></el-option>
                        <el-option label="已确认" value="1"></el-option>
                        <el-option label="已处理" value="2"></el-option>
                        <el-option label="已驳回" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="源IP：" :label-width="formLabelWidth" prop="srcIp">
                    <el-input placeholder="请输入源IP" clearable v-model="editForm.srcIp" size="small"></el-input>
                </el-form-item>
                <el-form-item label="源端口：" :label-width="formLabelWidth" prop="srcPort">
                    <el-input
                        placeholder="请输入源端口"
                        type="number"
                        onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                        clearable
                        v-model="editForm.srcPort"
                        size="small"></el-input>
                </el-form-item>
                <el-form-item label="目的端口：" :label-width="formLabelWidth" prop="desPort">
                    <el-input
                        placeholder="请输入目的端口"
                        type="number"
                        onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                        clearable
                        v-model="editForm.desPort"
                        size="small"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <div class="ub w100">
                        <div>
                            事件描述：
                        </div>
                        <div style='width:90%'>
                            <div class="ub ub-pc ub-f1">
                                <vue-ueditor-wrap v-model="editForm.reportDesc" :config="myConfig"></vue-ueditor-wrap>
                            </div>
                        </div>
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <searchBtn title="确 定" @click="submitFormEdit('editForm')" />
                <cancelBtn title="取 消" @click="editDialog = false" />
            </span>
        </el-dialog>
        <!--状态变更内容开始-->
        <el-dialog v-dialogDrag title="事件状态变更" :visible.sync="stateDialog" width="700px" custom-class="common-dialog" style="background:rgba(0,0,0,.4)">
            <el-form :model="stateForm" :rules="rules" ref="stateForm" label-position="top">
                <el-form-item style="width:100%;" label="事件状态：" :label-width="formLabelWidth" prop="reportStatus">
                    <el-select size="small" style="width:660px" v-model="stateForm.reportStatus" placeholder="请选择">
                        <el-option label="待确认" value="0"></el-option>
                        <el-option label="已确认" value="1"></el-option>
                        <el-option label="已处置" value="2"></el-option>
                        <el-option label="已驳回" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="stateForm.reportStatus==0||stateForm.reportStatus==1" style="width:100%;" label="变更原因：" :label-width="formLabelWidth">
                    <div class="ub ub-pc ub-f1">
                        <vue-ueditor-wrap v-model="stateForm.remark" :config="myConfig"></vue-ueditor-wrap>
                    </div>
                </el-form-item>
                <el-form-item v-if="stateForm.reportStatus==2" style="width:100%;" label="处置结果：" :label-width="formLabelWidth">
                    <div class="ub ub-pc ub-f1">
                        <vue-ueditor-wrap v-model="stateForm.actionResults" :config="myConfig"></vue-ueditor-wrap>
                    </div>
                </el-form-item>
                <el-form-item v-if="stateForm.reportStatus==3" style="width:100%;" label="驳回理由：" :label-width="formLabelWidth">
                    <div class="ub ub-pc ub-f1">
                        <vue-ueditor-wrap v-model="stateForm.rejectReason" :config="myConfig"></vue-ueditor-wrap>
                    </div>
                </el-form-item>
                <el-form-item v-if="stateForm.reportStatus==3" style="width:100%;" label="分析过程：" :label-width="formLabelWidth">
                    <div class="ub ub-pc ub-f1">
                        <vue-ueditor-wrap v-model="stateForm.analyzePro" :config="myConfig"></vue-ueditor-wrap>
                    </div>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="stateDialog = false" class="mr-1">取消</el-button>
                <Debounce :time='1500' :isDebounce="2">
                    <el-button @click.native="submitStateForm('stateForm')" size="small" type="primary ">确定</el-button>
                </Debounce>
            </span>
        </el-dialog>
        <!-- 发起工单 -->
        <el-dialog title="发起工单" :visible.sync="taskDialog" width="700px" custom-class="common-dialog" style="background:rgba(0,0,0,.4)">
            <el-form :model="taskForm" :rules="rules" ref="taskForm" label-position="top">
                <el-form-item label="工单名称：" prop="workOrderName" :label-width="formLabelWidth">
                    <el-input placeholder="请输入工单名称" clearable v-model="taskForm.workOrderName" size="small"></el-input>
                </el-form-item>
                <el-form-item label="优先级：" prop="level" :label-width="formLabelWidth">
                    <el-select placeholder="请选择" style="width: 100%;" v-model="taskForm.level" size="small">
                        <el-option label="高" value="1"></el-option>
                        <el-option label="中" value="2"></el-option>
                        <el-option label="低" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="工单模板：" prop="workMouldId" :label-width="formLabelWidth">
                    <el-select placeholder="请选择" style="width: 100%;" v-model="taskForm.workMouldId" size="small">
                        <el-option v-for="(item) in allTemplate" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="width:100%;" label="工单描述：" :label-width="formLabelWidth">
                    <div style="width:100%;">
                        <vue-ueditor-wrap v-model="taskForm.workOrderContent" :config="myConfig"></vue-ueditor-wrap>
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="taskDialog=false" size="small" class="mr-1">取消</el-button>
                <Debounce :time='1500' :isDebounce="2">
                    <el-button :loading="isSubmitTask" type="primary" @click.native="submitTaskForm('taskForm')" size="small">确认</el-button>
                </Debounce>
            </span>
        </el-dialog>
        <!--归并日志详情  -->
        <el-dialog v-dialogDrag title="归并日志详情" :visible.sync="reportDetailDialog" width="65%" custom-class="attendance-dialog">
            <div style="width:90%;margin: 0 auto;display: flex;flex-wrap: wrap">
                <div class="table-container" v-for="(val,key) in detailReportArr" :key="key">
                    <div class="table-left">{{ fieldToChinese(key) }}</div>
                    <div class="table-right" v-html="val"></div>
                </div>
            </div>
        </el-dialog>
        <Alarm :alarm-dialog="alarmDialog"  @addAlarmSucess="addAlarmSucess" ref="alarmRef" class="alarm-dialog"></Alarm>
        <AlarmDetail :alarmSeeDialog="alarmSeeDialog" :seeForm="alarmDetailData" ref="alarmDetail"></AlarmDetail>
    </div>
</template>
<script>
import AlarmDetail from '@/pages/alarm/new_alarm/components/AlarmDetail.vue'
import Alarm from '@/pages/alarm/new_alarm/components/alarm/index.vue'
import {
    getAlarmList,
    getAlarmReportList,
    ip_searchAsset,
    addReport,
    changeAlarmState,
    getAlarmTemp,
    get_workFlowInfo,
    add_workTask
} from '@/server/alarm/alarm.js'
import {
    get_time
} from '@/server/common.js'
import {
    ImagePreview
} from 'vant'
import VueUeditorWrap from '@/components/vue-ueditor-wrap.vue' // ES6 Module
import ueditorConfig from '@/mixins/ueditorConfig'
import BasicInfo from '../seeTabs/BasicInfo'
import WorkInfo from '../seeTabs/WorkInfo'
import AssetInfo from '../seeTabs/AssetInfo'
import Logs from '../seeTabs/Logs'
export default {
    mixins: [ueditorConfig],
    components: {
        VueUeditorWrap,
        BasicInfo,
        WorkInfo,
        AssetInfo,
        Logs,
        Alarm,
        AlarmDetail
    },
    watch: {
        get_params: {
            handler(newVal, oldVal) {
                if (this.searchList.some(item => item.detail === JSON.stringify(newVal))) {
                    let cur = this.searchList.filter(item => item.detail === JSON.stringify(newVal))[0]
                    this.curSearchId = cur.id
                } else {
                    this.curSearchId = ''
                }
            },
            deep: true
        },
        addDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.addForm.resetFields()
                    this.addForm = {
                        reportDesc: '',
                        reportName: '',
                        reportType: '',
                        reportLevel: '',
                        reportStatus: '0',
                        asset: '',
                        srcIp: '',
                        srcPort: '',
                        desIp: '',
                        desPort: ''
                    }
                }
            }
        },
        editDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.editForm.resetFields()
                    this.editForm = {
                        id: '',
                        reportDesc: '',
                        reportName: '',
                        reportType: '',
                        reportLevel: '',
                        reportStatus: '0',
                        asset: '',
                        srcIp: '',
                        srcPort: '',
                        desIp: '',
                        desPort: ''
                    }
                }
            }
        },
        stateDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.stateForm.resetFields()
                    this.stateForm = {
                        reportStatus: '0',
                        actionResults: '',
                        analyzePro: '',
                        rejectReason: '',
                        remark: ''
                    }
                }
            }
        },
        taskDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.taskForm.resetFields()
                    this.taskForm = {
                        workOrderName: '',
                        workMouldId: '',
                        level: '',
                        workOrderContent: ''
                    }
                }
            }
        },
        seeDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.paramsArry = {
                        page: 1,
                        size: 5
                    }
                    this.workFlowInfo = {
                        field: {
                            workOrderId: '',
                            workOrderName: '',
                            workOrderContent: '',
                            workMouldId: '',
                            workMouldName: '',
                            sourceId: '',
                            level: '',
                            workOrderObject: '',
                            status: '',
                            deploymentId: '',
                            processInstanceId: '',
                            createUser: '',
                            createUserName: '',
                            createTime: '',
                            runningNodeName: '',
                            currentNodeStatus: ''
                        },
                        flow: {
                            xml: ''
                        }
                    }
                    this.taskInfo = {
                        dealUsers: '',
                        nodeDes: '',
                        outTime: '',
                        receiveTime: '',
                        stayTime: ''
                    }
                    this.passForm = {
                        name: '',
                        isPass: ''
                    }
                    this.assetsInfo = {}
                    this.bpmRecord = []
                    this.logList_drawer = []
                    this.alarmDisposalForm.noticeType = []
                    this.alarmDisposalForm.noticeUser = []
                    this.alarmDisposalForm.customUser = []
                }
            }
        }
    },
    filters: {
        getVal(item) {
            if (item.valType === 'text') {
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
    data() {
        var validateDesIp = (rule, value, callback) => {
            if (value.trim() === '') {
                callback(new Error('请输入正确的ip'))
            } else if (!(/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(value))) {
                callback(new Error('请输入正确的ip'))
            } else {
                callback()
            }
        }
        return {
            isSubmitTask: false,
            alarmDetailData: {},
            alarmSeeDialog: false,
            alarmDialog: false,
            dateData: '',
            dateMode: '',
            useDate: {},
            useIndex: '',
            searchList: [],
            curSearchId: '',
            alarmId: '',
            logType: '',
            timeDiffer: '',
            currentRow: {},
            logIds: [],
            isOpen: true,
            assetsInfo: {},
            taskInfo: {
                dealUsers: '',
                nodeDes: '',
                outTime: '',
                receiveTime: '',
                stayTime: ''
            },
            passForm: {
                name: '',
                isPass: ''
            },
            bpmRecord: [],
            assetList: [],
            userList: [],
            systemList: [],
            oneKeyList: [],
            workStatus: false,
            currentWorkIds: [],
            workFlowInfo: {
                field: {
                    workOrderId: '',
                    workOrderName: '',
                    workOrderContent: '',
                    workMouldId: '',
                    workMouldName: '',
                    sourceId: '',
                    level: '',
                    workOrderObject: '',
                    status: '',
                    deploymentId: '',
                    processInstanceId: '',
                    createUser: '',
                    createUserName: '',
                    createTime: '',
                    runningNodeName: '',
                    currentNodeStatus: ''
                },
                flow: {
                    xml: ''
                }
            },
            searchData: {
                and: [{
                    field: '',
                    condition: '',
                    val: ''
                }]
            },
            sourceId: '',
            allTemplate: [],
            taskForm: {
                workOrderName: '',
                workMouldId: '',
                level: '',
                workOrderContent: ''
            },
            taskDialog: false,
            delId: '',
            delDialog: false,
            isStateAll: false,
            stateForm: {
                reportStatus: '0',
                actionResults: '',
                analyzePro: '',
                rejectReason: '',
                remark: ''
            },
            stateDialog: false,
            stateId: '',
            addForm: {
                reportDesc: '',
                reportName: '',
                reportType: '',
                reportLevel: '',
                reportStatus: '0',
                asset: '',
                srcIp: '',
                srcPort: '',
                desIp: '',
                desPort: ''
            },
            editForm: {
                id: '',
                reportDesc: '',
                reportName: '',
                reportType: '',
                reportLevel: '',
                reportStatus: '0',
                asset: '',
                srcIp: '',
                srcPort: '',
                desIp: '',
                desPort: ''
            },
            rules: {
                reportName: [{
                    required: true,
                    message: '请输入名称',
                    trigger: 'blur'
                }],
                reportType: [{
                    required: true,
                    message: '请选择事件类型',
                    trigger: 'change'
                }],
                status: [{
                    required: true,
                    message: '请选择变更状态',
                    trigger: 'change'
                }],
                desIp: [{
                    required: true,
                    validator: validateDesIp,
                    trigger: 'blur'
                }],
                srcIp: [{
                    required: true,
                    message: '请输入正确的ip',
                    trigger: 'blur'
                }],

                reportLevel: [{
                    required: true,
                    message: '请选择事件等级',
                    trigger: 'change'
                }],
                workOrderName: [{
                    required: true,
                    message: '请输入名称',
                    trigger: 'blur'
                }],
                level: [{
                    required: false,
                    message: '请选择优先级',
                    trigger: 'change'
                }],
                workMouldId: [{
                    required: true,
                    message: '请选择工单模板',
                    trigger: 'change'
                }]
            },
            editDialog: false,
            addDialog: false,
            typeList: [], // 事件类型

            activeName: 'first',
            seeDialog: false,
            checked: false,
            alarmDisposalForm: {
                id: '',
                advice: '',
                reportStatus: '',
                analyzePro: '',
                noticeType: [],
                noticeUser: [],
                customUser: [],
                reportFrom: '',
                userIdList: [],
                actionResults: '',
                desIp: ''
            },
            detailReportArr: {},
            reportDetailDialog: false,
            msg: '',
            paramsArry: {
                page: 1,
                size: 5
            },
            seeForm: {
                id: '',
                reportName: '',
                reportType: '',
                createTime: '',
                reportDesc: '',
                analyzePro: '',
                advice: '',
                sourcePort: '',
                sourceAddr: '',
                targetAddr: '',
                targetPort: '',
                object: '',
                result: '',
                sendFlow: '',
                duraTime: '',
                initMsg: '',
                operate: '',
                actionType: '',
                actionResults: '',
                appendProposal: '',
                rejectReason: ''
            },
            formLabelWidth: '100px',
            loading: false,
            total_count: 0,
            total_num: 0,
            total_report_num: 0,
            total_report_count: 0,
            multipleSelection: [],
            tableData: [],
            reportTableData: [],
            sayTimes: [],
            get_params: {
                id: '',
                page: 1,
                size: 20,
                reportName: '',
                reportLevel: [],
                reportFrom: [],
                reportStatus: [],
                srcIp: '',
                srcPort: '',
                desIp: '',
                desPort: '',
                reportType: [],
                attackResult: [],
                ruleIds: [],
                ids: []
            },
            report_params: {
                id: '',
                page: 1,
                size: 20
            },
            timestrIdData: '',
            oldTime: '',
            detailArr: {}
        }
    },
    methods: {
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
                taskType: '任务类别', // 以上为主机日志字段

                /* 归并日志*/
                pid: '父事件ID',
                reportStatus: '事件状态',
                reportLevel: '事件等级',
                reportType: '事件类型',
                reportTypeName: '事件类型名',
                checkStatus: '审核状态',
                isBanned: '是否封禁',
                ruleName: '规则名称',
                ruleId: '规则id'

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
        },
        addAlarmSucess() {
            setTimeout(() => {
                this.seeDialog = false
                this.$emit('back', true)
                this.get_data()
            }, 1500)
        },
        setDate() {
            if (this.dateMode === 'noUse') {
                if (this.dateData === '最近10分钟') {
                    this.$refs.customDate.handleRecently({ value: 0, name: '最近10分钟' }, 0)
                } else if (this.dateData === '最近30分钟') {
                    this.$refs.customDate.handleRecently({ value: 1, name: '最近30分钟' }, 1)
                } else if (this.dateData === '最近1小时') {
                    this.$refs.customDate.handleRecently({ value: 2, name: '最近1小时' }, 2)
                } else if (this.dateData === '最近1天') {
                    this.$refs.customDate.handleRecently({ value: 3, name: '最近1天' }, 3)
                } else if (this.dateData === '最近2天') {
                    this.$refs.customDate.handleRecently({ value: 4, name: '最近2天' }, 4)
                } else if (this.dateData === '最近7天') {
                    this.$refs.customDate.handleRecently({ value: 5, name: '最近7天' }, 5)
                } else if (this.dateData === '今天') {
                    this.$refs.customDate.handleRelative({ value: 0, name: '今天' }, 0)
                } else if (this.dateData === '昨天') {
                    this.$refs.customDate.handleRelative({ value: 1, name: '昨天' }, 1)
                } else if (this.dateData === '本周') {
                    this.$refs.customDate.handleRelative({ value: 2, name: '本周' }, 2)
                } else if (this.dateData === '上周') {
                    this.$refs.customDate.handleRelative({ value: 3, name: '上周' }, 3)
                } else if (this.dateData === '本月') {
                    this.$refs.customDate.handleRelative({ value: 4, name: '本月' }, 4)
                } else if (this.dateData === '上月') {
                    this.$refs.customDate.handleRelative({ value: 5, name: '上月' }, 5)
                }
            } else if (this.dateMode === 'use') {
                this.$refs.customDate.handleOther(this.useDate, this.useIndex)
            } else if (this.dateMode === 'useTwo') {
                this.$refs.customDate.handleUse()
            }
        },
        initStartTime() {
            return new Promise((resolve, reject) => {
                let data = {
                    queryData: {},
                    paramsData: {}
                }
                get_time(data).then(res => {
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        look(item, index) {
            if (item.isOpen) {
                item.isOpen = false
            } else {
                item.isOpen = true
            }
            this.$forceUpdate()
        },
        get_dtId(data, obj) {
            if (data.length > 0) {
                data.forEach(item => {
                    if (item.sub && item.sub.length > 0) {
                        this.get_dtId(item.sub, obj)
                    } else {
                        obj.push(item.codeNum)
                    }
                })
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
        get_workMound(id) {
            let data = {
                queryData: {},
                paramsData: {
                    id: id
                }
            }
            getAlarmTemp(data).then(res => {
                console.log('可用工单模板', res)
                this.allTemplate = res
            }).catch(err => {
                console.log(err, 'err')
            })
        },
        // 变更状态
        submitStateForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let ids = []
                    if (this.isStateAll) {
                        ids = this.multipleSelection.map(item => {
                            return item.id
                        })
                    } else {
                        ids = [this.stateId]
                    }
                    let data = {
                        queryData: {},
                        paramsData: {
                            ids: ids,
                            reportStatus: this.stateForm.reportStatus
                        }
                    }
                    if (this.stateForm.reportStatus == 0 || this.stateForm.reportStatus == 1) {
                        // 备注待确认
                        data.paramsData.changeLog = this.stateForm.remark
                    } else if (this.stateForm.reportStatus == 2) {
                        data.paramsData.actionResults = this.stateForm.actionResults
                    } else {
                        data.paramsData.rejectReason = this.stateForm.rejectReason
                        data.paramsData.analyzePro = this.stateForm.analyzePro
                    }
                    changeAlarmState(data).then(res => {
                        this.$message({
                            message: '状态变更成功',
                            type: 'success'
                        })
                        console.log(res)
                        this.stateDialog = false
                        setTimeout(() => {
                            if (this.seeDialog) {
                                this.seeDialog = false
                            }
                            this.$emit('back', true)
                            this.get_data()
                        }, 1500)
                    }).catch(error => {
                        this.stateDialog = false
                        console.log(error + 'error')
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        // 更多操作
        changeOption(val, row) {
            console.log(val, row)
            if (val == 1) {
                // 发起工单
                if (row.isStart == 1) {
                    return
                }
                this.sourceId = row.id
                this.get_workMound(row.id)
                this.taskForm.workOrderName = row.reportName + '--' + row.createTime ?? ''
                this.taskDialog = true
            } else if (val == 2) {
                if (row.reportFrom == 1) {
                    return
                }
                this.$refs.alarmRef.addForm.isStart = false
                this.$refs.alarmRef.addForm.id = row.id
                this.$refs.alarmRef.addForm.reportDesc = row.reportDesc
                this.$refs.alarmRef.addForm.reportName = row.reportName
                this.$refs.alarmRef.addForm.reportType = row.reportType
                this.$refs.alarmRef.addForm.reportLevel = row.reportLevel
                this.$refs.alarmRef.addForm.reportStatus = row.reportStatus
                this.$refs.alarmRef.addForm.srcIp = row.srcIp
                this.$refs.alarmRef.addForm.srcPort = row.srcPort
                this.$refs.alarmRef.addForm.desIp = row.desIp
                this.$refs.alarmRef.addForm.desPort = row.desPort
                this.alarmDialog = true
            } else if (val == 3) {
                // 状态变更
                this.stateId = row.id
                this.stateDialog = true
                this.isStateAll = false
            } else if (val == 4) {
                // 删除
                this.delId = row.id
                this.delDialog = true
            }
        },
        // 发起事件
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let reportTypeName = this.typeList.filter(item => item.id == this.addForm.reportType)[0].name
                    let data = {
                        queryData: {},
                        paramsData: {
                            reportDesc: this.addForm.reportDesc,
                            reportName: this.addForm.reportName,
                            reportType: this.addForm.reportType,
                            reportLevel: this.addForm.reportLevel,
                            reportStatus: this.addForm.reportStatus,
                            srcIp: this.addForm.srcIp,
                            srcPort: this.addForm.srcPort,
                            desIp: this.addForm.desIp,
                            desPort: this.addForm.desPort,
                            reportTypeName: reportTypeName
                        }
                    }
                    addReport(data).then(res => {
                        console.log('发起事件成功')
                        this.$message({
                            message: '发起事件成功',
                            type: 'success'
                        })
                        console.log(res)
                        this.addDialog = false
                        setTimeout(async() => {
                            let timeObj = await this.initStartTime()
                            let currentTime = timeObj.ms + (15 * 1000)
                            console.log('currentTime', currentTime)
                            let currentTime15 = currentTime - 7 * 24 * 60 * 60 * 1000
                            this.sayTimes = []
                            this.sayTimes[1] = this.$getTime(currentTime, '-', true)
                            this.sayTimes[0] = this.$getTime(currentTime15, '-', true)
                            // let currentTime = new Date().getTime()
                            // let currentTime15 = currentTime - 7 * 24 * 60 * 60 * 1000
                            // this.sayTimes = []
                            // this.sayTimes[1] = this.$getTime(currentTime, '-', true)
                            // this.sayTimes[0] = this.$getTime(currentTime15, '-', true)
                            this.get_data()
                        }, 1500)
                    }).catch(error => {
                        this.addDialog = false
                        console.log(error + 'error')
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        // 发起事件
        submitFormEdit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let reportTypeName = this.typeList.filter(item => item.id == this.editForm.reportType)[0].name

                    let data = {
                        queryData: {},
                        paramsData: {
                            id: this.editForm.id,
                            reportDesc: this.editForm.reportDesc,
                            reportName: this.editForm.reportName,
                            reportType: this.editForm.reportType,
                            reportLevel: this.editForm.reportLevel,
                            reportStatus: this.editForm.reportStatus,
                            srcIp: this.editForm.srcIp,
                            srcPort: this.editForm.srcPort,
                            desIp: this.editForm.desIp,
                            desPort: this.editForm.desPort,
                            reportTypeName: reportTypeName
                        }
                    }
                    addReport(data).then(res => {
                        this.$message({
                            message: '编辑事件成功',
                            type: 'success'
                        })
                        console.log(res)
                        this.editDialog = false
                        setTimeout(() => {
                            if (this.seeDialog) {
                                this.seeDialog = false
                            }
                            this.$emit('back', true)
                            this.get_data()
                        }, 1500)
                    }).catch(error => {
                        this.editDialog = false
                        console.log(error + 'error')
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        // 发起工单
        submitTaskForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.isSubmitTask = true
                    let data = {
                        queryData: {},
                        paramsData: {
                            sourceId: this.sourceId,
                            workOrderName: this.taskForm.workOrderName,
                            level: this.taskForm.level,
                            workMouldId: this.taskForm.workMouldId,
                            workOrderContent: this.taskForm.workOrderContent,
                            type: 1
                        }
                    }
                    if (this.taskClick) {
                        this.$message({
                            message: '正在发起工单,请稍等！',
                            type: 'info'
                        })
                        return
                    }
                    if (!this.taskClick) {
                        this.taskClick = true
                    }

                    add_workTask(data).then(res => {
                        this.isSubmitTask = false
                        this.taskClick = false
                        this.taskDialog = false
                        console.log('发起工单成功')
                        this.$message({
                            message: '发起工单成功',
                            type: 'success'
                        })
                        setTimeout(() => {
                            if (this.seeDialog) {
                                this.seeDialog = false
                            }
                            this.get_data()
                        }, 1500)
                    }).catch(error => {
                        this.isSubmitTask = false
                        this.taskClick = false
                        this.taskDialog = false
                        console.log(error + 'error')
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        getAsset_edit() {
            let data = {
                ip: this.editForm.desIp
            }
            ip_searchAsset(data).then(res => {
                console.log(res)
                if (res.deviceName) {
                    this.editForm.asset = res.deviceName
                } else {
                    this.editForm.asset = ''
                }
            }).catch(error => {
                console.log(error + 'error')
            })
        },
        getAsset_add() {
            let data = {
                ip: this.addForm.desIp
            }
            ip_searchAsset(data).then(res => {
                console.log(res)
                if (res.deviceName) {
                    this.addForm.asset = res.deviceName
                } else {
                    this.addForm.asset = ''
                }
            }).catch(error => {
                console.log(error + 'error')
            })
        },
        handleClick(tab, event) {
            console.log(tab, event)
            if (tab.name === 'four') {
                // this.$refs.logs.getMinute()
                // this.$refs.logs.isSearch = false
                // this.$refs.logs.initIndex()
            }
        },
        interval(callback) {
            let _this = this
            if (this.oldTime) {
                let newTime = new Date()
                let interval = newTime - this.oldTime
                this.oldTime = newTime
                console.log(interval)
                if (interval > 2000) {
                    callback && callback.call(_this)
                }
            } else {
                this.oldTime = new Date()
                callback && callback.call(_this)
            }
        },
        detailReportData(row) {
            this.$refs.alarmDetail.alarmId = row.id
            this.$refs.alarmDetail.activeName = 'first'
            this.alarmDetailData = row
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
        // 初始化数据的方法
        handleSee(row) {
            this.alarmId = row.id
            this.logType = row.logType
            this.timeDiffer = row.createTime
            console.log('see', row)
            this.$set(this, 'currentRow', row)
            this.activeName = 'first'
            this.seeForm = row
            this.alarmDisposalForm.id = row.id
            this.alarmDisposalForm.desIp = row.desIp ? row.desIp : ''
            this.alarmDisposalForm.reportFrom = row.reportFrom
            this.msg = row.msg
            if (row.msg) {
                console.log('msgmsg', JSON.parse(row.msg))
                let msgData = JSON.parse(row.msg)
                if (msgData.length > 0) this.logIds = [...new Set(msgData.map(item => item.logId))]
            } else {
                this.logIds = []
            }
            this.seeDialog = true
            console.log('this.logIds', this.logIds)

            this.getWorkFlow(row.id)

            this.report_params.id = row.id
            if (row.desIp) {
                this.getAssetsInfo(row.desIp)
            }

            this.get_report_data()
        },
        getAssetsInfo(ip) {
            let data = {
                ip: ip
            }
            ip_searchAsset(data).then(res => {
                console.log('3333333333333', res)
                let list = this.$deepCopy(res)
                this.$set(this, 'assetsInfo', list)
            }).catch(error => {
                console.log(error + 'error')
            })
        },

        getWorkFlow(id) {
            let data = {
                queryData: {},
                paramsData: {
                    id: id
                }
            }
            get_workFlowInfo(data).then(res => {
                console.log('工单详情', res)
                if (JSON.stringify(res) === '{}' || !res) {
                    return
                }
                this.$set(this, 'workFlowInfo', res)
                this.workStatus = res.field.status == 2
                this.currentWorkIds = res.field.nodeIds
                if (res.field.status == 1) {
                    this.workFlowInfo.field.currentNodeStatus = '待处理'
                } else if (res.field.status == 0) {
                    this.workFlowInfo.field.currentNodeStatus = '已撤销'
                } else if (res.field.status == 2) {
                    this.workFlowInfo.field.currentNodeStatus = '已完成'
                }
                this.bpmRecord = res.record.map((item, index) => {
                    item.size = ''
                    item.isOpen = true
                    item.color = '#387dee'
                    item.icon = index === 0 ? 'el-icon-circle-check' : 'iconfont icon-circle'
                    item.dealContent = JSON.parse(item.dealContent)
                    return item
                })
            }).catch(error => {
                console.log('error' + error)
            })
        },

        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        get_data() {
            this.setDate()
            // let uid = this.timestrIdData = new Date().getTime()
            this.loading = true
            this.tableData = []
            // let dtArr = []
            // if (this.get_params.dt) {
            //     dtArr = this.$deepCopy(this.get_params.dt)
            // }
            console.log('this.get_params11111', this.get_params)
            let data = {
                queryData: {
                    page: this.get_params.page,
                    pageSize: this.get_params.size
                },
                paramsData: {
                    id: this.get_params.id,
                    reportFrom: this.get_params.reportFrom, // 事件来源
                    reportStatus: this.get_params.reportStatus, // 事件状态
                    reportName: this.get_params.reportName, // 事件名称
                    reportLevel: this.get_params.reportLevel, // 事件等级
                    reportType: this.get_params.reportType, // 事件类型
                    startTime: this.sayTimes.length === 0 ? '' : this.sayTimes[0], // 开始时间
                    endTime: this.sayTimes.length === 0 ? '' : this.sayTimes[1], // 结束时间
                    srcIp: this.get_params.srcIp, // 源IP
                    srcPort: this.get_params.srcPort, // 源端口
                    desIp: this.get_params.desIp, // 目的IP
                    desPort: this.get_params.desPort, // 目的端口
                    attackResult: this.get_params.attackResult, // 攻击结果
                    ruleIds: this.get_params.ruleIds // 规则集合

                }
            }
            console.log('data', data)
            getAlarmList(data).then(res => {
                console.log('getAlarmList', res)
                // if (this.timestrIdData != uid) {
                //     return
                // }
                this.loading = false
                this.total_count = res.total
                let total = res.total
                /* 动态设置总页数*/
                // if (this.get_params.page < 4 && total > 7 * this.get_params.size) {
                //     this.total_num = 7 * this.get_params.size
                // } else if (this.get_params.page >= 4 && (total > (this.get_params.page + 3) * this.get_params.size)) {
                //     this.total_num = (this.get_params.page + 3) * this.get_params.size
                // } else {
                this.total_num = res.total
                // }
                let list = res.records
                if (list.length > 0) {
                    list.forEach(item => {
                        let obj = {}
                        obj.id = item.id
                        obj.count = item.count ? item.count : ''
                        obj.assetName = item.assetName
                        obj.alarm_from = item.reportFrom == 1 ? '自动' : '手动'
                        obj.reportFrom = item.reportFrom
                        obj.reportName = item.reportName
                        obj.reportDesc = item.reportDesc
                        obj.createTime = item.createTime
                        obj.reportType = item.reportType
                        obj.reportTypeName = item.reportTypeName
                        obj.reportLevel = item.reportLevel
                        obj.reportStatus = item.reportStatus
                        obj.asset = item.asset
                        obj.sourcePort = item.sourcePort
                        obj.sourceAddr = item.sourceAddr
                        obj.targetAddr = item.targetAddr
                        obj.targetPort = item.targetPort
                        obj.object = item.object
                        obj.result = item.result
                        obj.sendFlow = item.sendFlow
                        obj.duraTime = item.duraTime
                        obj.initMsg = item.initMsg
                        obj.operate = item.operate
                        obj.analyzePro = item.analyzePro
                        obj.advice = item.advice
                        obj.actionType = item.actionType
                        obj.actionResults = item.actionResults
                        obj.appendProposal = item.appendProposal
                        obj.rejectReason = item.rejectReason
                        obj.msg = item.msg ? item.msg : '[]'
                        obj.assetIp = item.assetIp
                        obj.actionType = item.actionType
                        obj.actionResults = item.actionResults
                        obj.appendProposal_disposal = item.appendProposal_disposal ? item.appendProposal_disposal : ''
                        obj.appendProposal_analysis = item.appendProposal_analysis ? item.appendProposal_analysis : ''
                        obj.appendProposal_report = item.appendProposal_report ? item.appendProposal_report : ''
                        obj.appendProposal_trace = item.appendProposal_trace ? item.appendProposal_trace : ''
                        obj.traceResult = item.traceResult ? item.traceResult : ''
                        obj.isTrace = item.isTrace
                        obj.isTraceEnd = item.isTraceEnd
                        obj.isAnalysis = item.isAnalysis
                        obj.isBanned = item.isBanned === '0' ? 0 : item.isBanned
                        obj.isStart = item.isStart
                        obj.ruleName = item.ruleName
                        obj.ruleId = item.ruleId
                        obj.srcIp = item.srcIp
                        obj.srcPort = item.srcPort
                        obj.desIp = item.desIp
                        obj.desPort = item.desPort
                        obj.domainName = item.domainName
                        obj.securityDomain = item.securityDomain
                        obj.gbNum = item.gbNum
                        obj.attackResult = item.attackResult
                        obj.dt = item.dt
                        obj.logId = item.logId ?? ''
                        obj.logType = item.logType ?? ''
                        obj.taskType = item.taskType ? item.taskType : ''
                        obj.checkStatus = item.checkStatus === '0' ? 0 : item.checkStatus
                        obj.records = item.records

                        this.tableData.push(obj)
                    })
                    this.$nextTick(() => {
                        if (this.$refs.multipleTable1) {
                            this.$refs.multipleTable1.doLayout()
                        }
                    })
                }
            }).catch(error => {
                this.loading = false
                console.log('error' + error)
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
                this.total_report_count = res.totalElements
                let total = res.totalElements
                /* 动态设置总页数*/
                // if (this.report_params.page < 4 && total > 7 * this.report_params.size) {
                //     this.total_report_num = 7 * this.report_params.size
                // } else if (this.report_params.page >= 4 && (total > (this.report_params.page + 3) * this.report_params.size)) {
                //     this.total_report_num = (this.report_params.page + 3) * this.report_params.size
                // } else {
                this.total_report_num = res.total
                // }
                this.reportTableData = res.records ?? []
            }).catch(error => {
                console.log('error' + error)
            })
        },
        handleSizeChange(val) {
            this.get_params.size = val
            this.get_data()
        },
        handleCurrentChange(val) {
            this.get_params.page = val
            this.get_data()
        },
        handleSizeChangeReport(val) {
            this.report_params.size = val
            this.get_report_data()
        },
        handleCurrentChangeReport(val) {
            this.report_params.page = val
            this.get_report_data()
        }
    }
}
</script>
<style lang="scss" scoped>

    $zero: #6cfeff;
    $one: #00a2ff;
    $two: #fff76c;
    $three: #f86900;
    $fore: #ff0000;
    $status1: #ffdd00;
    $status2: #01ff01;
    $status3: #00e1fd;
    $status4: #e1e2e4;
    .list-tip{
        height: 24px;
        line-height: 24px;
        font-size: 14px;
        color: #1c1c1c;
        position: relative;
    }
    .alarm-dialog{
        ::v-deep .el-drawer__wrapper{
            background:rgba(0,0,0,.4);
        }
    }
    .alarm-state{
        padding:0px 5px;
        border-radius: 4px;
        &.one{
            background-color: rgba(255,186,0,.3);
            border: 1px solid rgb(255,186,0);
            color:rgb(255,186,0);
        }
        &.two{
            background-color: rgba(150,255,150,.3);
            border: 1px solid rgb(150,255,150);
            color:rgb(150,255,150);
        }
        &.three{
            background-color: rgba(0,192,255,.3);
            border: 1px solid rgb(0,192,255);
            color:rgb(0,192,255);
        }
        &.four{
            background-color: rgba(255,58,58,.3);
            border: 1px solid rgb(255,58,58);
            color:rgb(255,58,58);
        }
    }
    .click-btn {
        cursor: pointer;
        font-size: 12px;
        i {
            margin-right: 5px;
            color: #1cd7fa;
        }
        span.val {
            color: #1cd7fa;
        }
    }
    .click-btn:hover {
        background: #0d4873;
    }
    .alarm-list{
        width:100%;
        overflow: hidden;
        .report-from {
            color: #00ffe4;
        }
    }
    .alarm-list  ::v-deep  .el-table__empty-text {
        line-height: 34px;
    }
    .alarm-list  ::v-deep  .el-table__empty-block {
        min-height: 34px;
    }
    .alarmm-wrapper{
        height: calc(100vh - 70px);
        overflow: hidden;
        .right-wrapper{
            height:100%;
            overflow: hidden;
            overflow-y: auto;
        }
    }
     .chart-top {
        /* position: absolute;
        left: 0;
        top: 0; */
        height: 50px;
        .title {
            color: #fff;
            font-size: 14px;
            /*font-weight: bold;*/
            text-shadow: 0px 0px 6px #00cffb, 0px 0px 6px #00cffb;
        }
    }
    .record-item ::v-deep .el-form-item__content{
        width: 100%!important;
    }
    .haveStart{
        color:rgb(102, 102, 102);
    }
    .left-tip {
        margin-bottom: 10px;
        font-size: 0;

        >i {
            vertical-align: middle;
            font-size: 12px;
            color: #1cd7fa;
            margin-right: 5px;
        }

        >span {
            vertical-align: middle;
            font-size: 10px;
            color: #1cd7fa;
        }
    }
    .event ::v-deep .el-divider {
        background-color: #50b0ff;
        opacity: 0.5;
    }
    .event-btn-col{
        margin-bottom: 10px;
    }
    .searchData ::v-deep .el-form-item {
        margin-bottom: 0;
    }

    .title-level {
        color: $zero;
        font-size: 12px;
        border-radius: 3px;
        line-height: 1;
        padding: 2px 10px;
        margin: 0 5px;
        border-radius:100%;
        &.one {
            // border-color: $one;
            // background: rgba($one, .2);
            color: $one;
        }

        &.two {
            // border-color: $two;
            // background: rgba($two, .2);
            color: $two;
        }

        &.three {
            // border-color: $three;
            // background: rgba($three, .2);
            color: $three;
        }

        &.fore {
            // border-color: $fore;
            // background: rgba($fore, .2);
            color: $fore;
        }
    }

    .title-status {
        border: 1px solid $status1;
        background: $status1;
        color: #fff;
        font-size: 12px;
        border-radius: 3px;
        line-height: 1;
        padding: 2px 10px;

        &.one {
            border-color: $status2;
            background: $status2;
        }

        &.two {
            border-color: $status3;
            background: $status3;
        }

        &.three {
            border-color: $status4;
            background: $status4;
        }
    }

    .text-color {
        color: #fff;
    }

    .el-input.ips {
        display: block;
        width: 100%;
    }

    .el-link {
        cursor: pointer;
    }

    .drawer-pad {
        // padding: 0 20px;
        height: calc(100% - 53px);
        overflow-y: auto;

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
    .drawer-pad ::v-deep.el-form-item__content {
        font-size: 12px;
    }
    .drawer-pad ::v-deep .el-form-item__label{
        font-size: 12px;
        color: #999!important
    }

    .el-select ::v-deep .el-tag {
        background-color: transparent;
        border-color: #1bd7fa;
        color: #1bd7fa;
    }
    .event ::v-deep .el-checkbox__inner {
        //background: rgba(225, 225, 225,0.7);
    }
    .event ::v-deep .el-range-input {
        background-color: rgba(0, 0, 0, 0);
        color: #fff;
    }

    .event ::v-deep .el-range-separator {
        color: #fff;
    }

    .event ::v-deep .el-radio__label,
    .event ::v-deep .el-checkbox__label {
        color: #fff;
    }

    .bigTable {
         ::v-deep .sort-caret.ascending {
            border-bottom-color: #C0C4CC;
        }

        ::v-deep .sort-caret.descending {
            border-top-color: #C0C4CC;
        }

        ::v-deep .descending .sort-caret.descending {
            border-top-color: #3aa6e4;
        }

        ::v-deep .ascending .sort-caret.ascending {
            border-bottom-color: #3aa6e4;
        }
    }
    .white-hteme .bigTable {
        ::v-deep .sort-caret.ascending {
            border-bottom-color: #fff;
        }

        ::v-deep .sort-caret.descending {
            border-top-color: #fff;
        }

        ::v-deep .descending .sort-caret.descending {
            border-top-color: #01fdfe;
        }

        ::v-deep .ascending .sort-caret.ascending {
            border-bottom-color: #01fdfe;
        }
    }

    .div-table {
        color: #fff;
        border: 1px solid #1a5c92;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;

        .table-title {
            line-height: 48px;
            padding: 0 30px;
            border-bottom: 1px solid #1a5c92;
            background: rgba(29, 65, 105, 0.5);
        }

        dl {
            position: relative;
            line-height: 46px;
            height: 46px;
            background: rgba(3, 50, 84, 0.5);
            box-shadow: 0 0 3px rgba(0, 186, 255, .73) inset;
            border-bottom: 1px solid #1a5c92;

            dt {
                position: absolute;
                width: 50%;
                padding: 0 30px;
                border-right: 1px solid #1a5c92;
                box-sizing: border-box;
            }

            dd {
                padding-left: calc(50% + 30px);
            }

            &:nth-child(2n+1) {
                background: rgba(29, 65, 105, 0.5);
            }
        }
    }

    .search-box {
    .search-more {
        display: flex;
        flex-wrap: wrap;
        .has-more{
            height: 40px !important;
            overflow-y: hidden;
        }
        .search-more-left {
            display: flex;
            flex-wrap: wrap;
            div {
                padding: 5px 0;
                margin-right: 20px;
                ::v-deep.el-select {
                    width: 253px;
                }
                ::v-deep .el-input__inner {
                    height: 30px;
                    line-height: 30px;
                }
            }
        }
        .search-text {
            display: block;
            width: 80px;
            color:#03e9ff;
            cursor: pointer;
            font-size:12px;
            height: 20px;
            margin-top: 10px;
            text-align: right;
        }
    }
    & ::v-deep .el-form-item__label {
        line-height: 40px !important;
    }
    & ::v-deep .el-form-item__content {
        line-height: 40px !important;
    }

    }
    .reset-btn, .sql-btn{
        width: 60px;
        height: 30px;
        background-color: #041f38;
        box-shadow: inset 0px 0px 10px 0px
        rgba(0, 167, 245, 0.97);
        border: solid 1px #39caf3;
        font-size: 12px;
        line-height: 15px;
        letter-spacing: 1px;
        color: #a2ece8;
        border-radius: 5px;
        margin-right: 10px;
        cursor: pointer;
        box-sizing: border-box;
    }
    .save-btn {
        width: 30px;
        height: 30px;
        background-color: #041f38;
        box-shadow: inset 0px 0px 10px 0px rgba(0, 167, 245, 0.97);
        border: solid 1px #39caf3;
        font-size: 12px;
        line-height: 15px;
        letter-spacing: 1px;
        color: #a2ece8;
        border-radius: 5px;
        margin-right: 10px;
        cursor: pointer;
        box-sizing: border-box;
    }

    .chart-row {
        position: relative;
        padding-left: 380px;

        .chart-left {
            position: absolute;
            left: 0;
            top: 0;
            width: 360px;
        }
    }

    .chart-box {
        position: relative;
        height: 280px;
        border: 1px solid #00274e;

        span {
            position: absolute;
            left: -1px;
            top: -1px;
            width: 10px;
            height: 10px;
            background: url('/static/img/icon-jiao.png') no-repeat;

            &.angle2 {
                left: auto;
                right: -1px;
                transform: rotate(90deg);
            }

            &.angle3 {
                left: auto;
                right: -1px;
                top: auto;
                bottom: -1px;
                transform: rotate(180deg);
            }

            &.angle4 {
                top: auto;
                bottom: -1px;
                transform: rotate(270deg);
            }
        }

        .chart-title {
            margin: 20px 0 20px 20px;
        }
    }

    .tabsForm {
        margin-bottom: 40px;

        .el-form-item {
            margin: 10px 0;
        }
    }

    .home .el-table {
        min-height: 0;
    }

    .el-tabs ::v-deep .el-tabs__nav-wrap::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 1px;
        background-color: #e7e7e7;
        z-index: 1;
    }

    .el-tabs ::v-deep .el-tabs__active-bar {
        background: #387dee;
        // margin-left: 14px;
    }

    .el-tabs ::v-deep .el-tabs__item.is-active {
        color: #387dee;
        height: 34px;
        line-height: 34px;
        border: none !important;
        box-shadow: none !important;
    }

    .originTable {
        margin: 40px 0;
        color: #fff;
        border: 1px solid #1a5c92;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        border-collapse: collapse;
        table-layout: fixed;

        & .title {
            text-align: center;
            background: rgba(0, 168, 255, .4);
            color: #fff;
        }

        & td {
            /*width: 50%;*/
            height: 40px;
            padding: 0 20px;
            border-bottom: 1px solid #1a5c92;
            border-right: 1px solid #1a5c92;
        }

        tr:nth-child(odd) {
            background: rgba(3, 50, 84, 0.5);
            color: #fff;
            box-shadow: 0 0 6px rgba(0, 186, 255, .73) inset;
        }

        //奇数
        tr:nth-child(even) {
            box-shadow: 0 0 6px rgba(0, 186, 255, .73) inset;
        }

        //偶数
    }

    ._el-item ::v-deep .el-form-item__content {
        margin-left: 0 !important;
    }

    .table-container {
        display: flex;
        justify-content: flex-start;
        width: 50%;

        &:nth-child(2n) {
            background: rgba(29, 65, 105, 0.5);
        }

    }

    .table-left,
    .table-right {
        font-size: 16px;
        border: 1px solid #1a5c92;
        padding: 4px 10px;
        background: rgba(3, 50, 84, 0.5);
    }

    .table-left {
        color: #fff;
        opacity: .6;
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

    .event ::v-deep .el-checkbox-button--small .el-checkbox-button__inner {
        padding: 9px 10px;
    }

    .el-dropdown-menu ::v-deep .el-checkbox__label {
        color: #fff;
        width: 72px;
        box-sizing: border-box;
    }

    .el-dropdown-menu ::v-deep .el-checkbox {
        margin-right: 22px;
    }

    .el-dropdown-menu ::v-deep .el-checkbox__input.is-checked+.el-checkbox__label {
        color: #387dee;
    }

    .el-dropdown-menu ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner::after {
        border-color: #387dee;
    }

    .el-dropdown-menu ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner,
    .el-dropdown-menu ::v-deep .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background-color: transparent;
        border-color: #387dee;
    }

    .el-dropdown-menu ::v-deep .el-checkbox__input.is-disabled .el-checkbox__inner,
    .el-dropdown-menu ::v-deep .el-checkbox__inner {
        background-color: transparent;
        border-color: #387dee;
    }
    .access_state {
        span {
            color: #fff;
            margin-right: 6px;
        }
        i {
            font-size: 15px;
            color: #387dee;
        }
    }
    .close-box {
        width: 26px;
        // height: 100%;
        color: #387dee;
        text-align: center;
        line-height: 26px;
        cursor: pointer;
    }
    .event ::v-deep .el-timeline-item__timestamp.is-top {
        margin-bottom: 8px;
        padding-top: 3px;
        position: absolute;
        left: -93px;
        top: 0;
        font-size: 12px;
        width: 80px;
        text-align: right;
        line-height:14px;
        // color: #fff;
    }
    .event ::v-deep .pic-wrapper {
        height: 500px;
        overflow: auto;
        border: 1px solid rgba(0,0,0,.1);
    }
    .record-item ::v-deep .el-timeline-item__tail {
        border-left: 2px solid #387dee !important;
    }
    .event ::v-deep .el-timeline-item__icon.el-icon-circle-check {
        // color: #387dee;
        font-size: 20px;
    }
    .event ::v-deep .el-timeline-item__icon.icon-circle {
        // color: #387dee !important;
        font-size: 16px !important;
        font-weight: 500;
    }
    .time-box {
        width: 100%;
    }
    .time-left>h4 {
        color: rgba(0,0,0,.9);
        font-weight: 500;
    }
    .time-left>p {
        color: #999;
        font-size: 12px;
        margin-top: 5px;
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
        color: rgba(0,0,0,.9);
        font-size: 12px;
        margin-top: 5px;
    }
    .time-text-box {
        padding: 5px;
        background-color: #f5f8fe;
    }
    .time-text-box-item {
        margin: 10px 0;
    }

    .time-text-box-left {
        text-align: right;
        min-width: 70px;
        font-size: 12px;
        letter-spacing: 1px;
        color: rgba(0,0,0,.4);
        margin-right: 10px;
        vertical-align: top;
    }

    .time-text-box-right {
        font-size: 12px;
        color: rgba(0,0,0,.9);
        vertical-align: top;
        img {
            max-width: 50% !important;
        }
    }
</style>

