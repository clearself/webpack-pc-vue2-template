<template>
    <div class="alarm-event-list w100">
        <el-table
            :height="tableHeight"
            :row-class-name="tableRowClassName"
            ref="multipleTable"
            class='bigTable full-table'
            :data="tableData"
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
            <el-table-column prop="createTime" label="告警时间">
            </el-table-column>
            <el-table-column prop="srcChineseName" label="源-姓名">
            </el-table-column>
            <el-table-column prop="srcIp" label="源IP">
            </el-table-column>
            <el-table-column prop="srcPort" label="源端口">
            </el-table-column>
            <el-table-column prop="desIp" label="目的IP">
            </el-table-column>
            <el-table-column prop="desPort" label="目的端口">
            </el-table-column>
            <el-table-column prop="reportName" label="告警名称">
            </el-table-column>
            <el-table-column label="告警状态">
                <template slot-scope="{row}">
                    {{row.reportStatus | getreportStatus}}
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="180" fixed="right" class-name="deepBg">
                <template slot-scope="{row}">
                    <el-button type="text" size="small" @click="handleSee(row)">查看</el-button>
                    <el-button size="small" type="text" @click="changeOption(3,row)">状态变更</el-button>
                    <el-button size="small" type="text" :disabled="row.isStart==1" @click="changeOption(1,row)">发起工单</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination
            v-show="total>0"
            :total="total"
            :page.sync="get_params.page"
            :limit.sync="get_params.size"
            @pagination="init" />
        <el-dialog title="发起工单" :modal="false" :visible.sync="taskDialog" width="960px" custom-class="common-dialog" @closed="taskResetForm">
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
                <el-form-item label="模板类型：" prop="mouldType" :label-width="formLabelWidth">
                    <el-select placeholder="请选择" style="width: 100%;" v-model="taskForm.mouldType" size="small" @change="changeMouldType">
                        <el-option v-for="(item, index) in mouldTypeList" :key="index" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="工单模板：" prop="workMouldId" :label-width="formLabelWidth">
                    <el-select placeholder="请选择" style="width: 100%;" v-model="taskForm.workMouldId" size="small">
                        <el-option v-for="(item) in allTemplate" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="width: 100%;" label="工单描述：" :label-width="formLabelWidth">
                    <div style="width: 100%;">
                        <vue-ueditor-wrap v-model="taskForm.workOrderContent" :config="myConfig"></vue-ueditor-wrap>
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="taskDialog=false" size="small">取消</el-button>
                <Debounce :time='1500' :isDebounce="2">
                    <el-button  type="primary" @click.native="submitTaskForm('taskForm')" size="small" :loading="isSubmitTask">确认</el-button>
                </Debounce>
            </span>
        </el-dialog>
        <!--状态变更内容开始-->
        <el-dialog v-dialogDrag title="事件状态变更" :modal="false" :visible.sync="stateDialog" width="960px" custom-class="common-dialog" @closed="stateResetForm">
            <p style="margin-bottom: 10px;font-size: 12px;color: rgb(0 0 0 / 26%);"><span class="iconfont icon-zhushi"></span>“状态变更后列表5秒后生效”</p>
            <el-form :model="stateForm" :rules="rules" ref="stateForm" label-position="top">
                <el-form-item style="width: 100%;" label="事件状态：" :label-width="formLabelWidth" prop="reportStatus">
                    <el-select size="small" style="width: 100%;" v-model="stateForm.reportStatus" placeholder="请选择">
                        <el-option label="待确认" value="0"></el-option>
                        <el-option label="已确认" value="1"></el-option>
                        <el-option label="已处置" value="2"></el-option>
                        <el-option label="已驳回" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <div class="ub w100">
                    <div>
                        <el-form-item style="width: 100%;" label="处置动作：" :label-width="formLabelWidth">
                            <el-radio v-model="stateForm.actionKey" label="1">加黑</el-radio>
                            <el-radio v-model="stateForm.actionKey" label="0">加白</el-radio>
                        </el-form-item>

                    </div>
                    <div>
                        <el-form-item style="width: 100%;" label="处置动作对象" :label-width="formLabelWidth">
                            <el-select size="small" style="width: 100%;" v-model="stateForm.actionValue" placeholder="请选择">
                                <el-option label="源IP" value="0"></el-option>
                                <el-option label="目的IP" value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>

                </div>
                <el-form-item v-if="stateForm.reportStatus==0||stateForm.reportStatus==1" style="width: 100%;" label="变更原因：" :label-width="formLabelWidth">
                    <div class="ub ub-pc ub-f1">
                        <vue-ueditor-wrap v-model="stateForm.remark" :config="myConfig"></vue-ueditor-wrap>
                    </div>
                </el-form-item>
                <el-form-item v-if="stateForm.reportStatus==2" style="width: 100%;" label="处置结果：" :label-width="formLabelWidth">
                    <div class="ub ub-pc ub-f1">
                        <vue-ueditor-wrap v-model="stateForm.actionResults" :config="myConfig"></vue-ueditor-wrap>
                    </div>
                </el-form-item>
                <el-form-item v-if="stateForm.reportStatus==3" style="width: 100%;" label="驳回理由：" :label-width="formLabelWidth">
                    <div class="ub ub-pc ub-f1">
                        <vue-ueditor-wrap v-model="stateForm.rejectReason" :config="myConfig"></vue-ueditor-wrap>
                    </div>
                </el-form-item>
                <el-form-item v-if="stateForm.reportStatus==3" style="width: 100%;" label="分析过程：" :label-width="formLabelWidth">
                    <div class="ub ub-pc ub-f1">
                        <vue-ueditor-wrap v-model="stateForm.analyzePro" :config="myConfig"></vue-ueditor-wrap>
                    </div>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="stateDialog=false" size="small">取消</el-button>
                <Debounce :time='1500' :isDebounce="2">
                    <el-button type="primary" @click.native="submitStateForm('stateForm')" size="small">确认</el-button>
                </Debounce>
            </span>
        </el-dialog>
        <el-drawer :visible.sync="seeDialog" :modal="false" direction="rtl" :size="1200" :wrapperClosable="false" title="详情">
            <div id="drawer-content-inner" class="drawer-content event" ref="drawerContent">
                <div style="position: relative;top: 0;left: 0;">
                    <div class="ub ub-pj w100">
                        <div class="list-tip">
                            <span style="font-weight: 600;">{{ seeForm.reportName }}</span>
                            <span v-if="seeForm.reportLevel == 0" class="title-level zero">低</span>
                            <span v-if="seeForm.reportLevel == 1" class="title-level one">中低</span>
                            <span v-if="seeForm.reportLevel == 2" class="title-level two">中</span>
                            <span v-if="seeForm.reportLevel == 3" class="title-level three">中高</span>
                            <span v-if="seeForm.reportLevel == 4" class="title-level fore">高</span>

                            <span
                                v-if="seeForm.reportStatus == 0"
                                style="padding: 3px 15px;font-size: 12px;border-radius: 16px;color: #e47700;background: rgb(255 186 0 / 30%);line-height: 1;">待确认</span>
                            <span
                                v-if="seeForm.reportStatus == 1"
                                style="padding: 3px 15px;font-size: 12px;border-radius: 16px;color: #03864f;background: rgb(0 255 0 / 30%);line-height: 1;">已确认</span>
                            <span
                                v-if="seeForm.reportStatus == 2"
                                style="padding: 3px 15px;font-size: 12px;border-radius: 16px;color: #0052d9;background: rgb(0 192 255 / 30%);line-height: 1;">已处理</span>
                            <span
                                v-if="seeForm.reportStatus == 3"
                                style="padding: 3px 15px;font-size: 12px;border-radius: 16px;color: #aa0202;background: rgb(255 58 58 / 30%);line-height: 1;">已驳回</span>
                        </div>
                        <div class="ub">
                            <div>
                                <el-button style="margin-right: 5px;" icon="el-icon-plus" :disabled="currentRow.isStart==1" type="primary" title="发起工单" @click="changeOption(1,currentRow)" size="small">发起工单</el-button>
                                <el-button style="margin-right: 5px;color: #ffffff;background: #00a870;"  icon="el-icon-sort" type="primary" title="状态变更"  @click="changeOption(3,currentRow)" size="small">状态变更</el-button>
                            </div>
                        </div>
                    </div>
                    <div class="drawer-pad">
                        <el-tabs v-model="activeName">
                            <el-tab-pane label="基本信息" name="first">
                                <BasicInfo :seeForm="seeForm" v-if="seeDialog"></BasicInfo>
                            </el-tab-pane>
                            <el-tab-pane label="工单详情" name="two" @click.stop>
                                <WorkInfo :workFlowInfo="workFlowInfo"></WorkInfo>
                                <div v-if="bpmRecord.length>0" style="margin-top: 20px;font-size: 12px;color: rgb(0 0 0 / 90%);">流转记录</div>
                                <el-row v-if="bpmRecord.length>0" style="margin-bottom: 20px;width: 99%;" type="flex" justify="center">
                                    <el-form :model="passForm" class="w100" ref="passForm" :inline="true" style="color: rgb(0 0 0 / 90%);">
                                        <el-form-item class="record-item" label="" prop="" style="width: 100%;">
                                            <div
                                                class="work-record"
                                                style="padding-top: 10px;width: 100%;box-sizing: border-box;">
                                                <el-timeline style="margin-left: 88px;width: 94%;box-sizing: border-box;">
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
                                                                <h4 style="font-size: 16px;color: rgb(0 0 0 / 90%);">{{activity.userName|NullStr}}<sub style="margin-left: 10px;font-size: 12px;font-weight: normal;color: rgb(0 0 0 / 90%);opacity: 0.6;vertical-align: bottom;">{{activity.userRole|NullStr}}</sub></h4>
                                                            </div>
                                                            <div class="time-right" style="width: 150px;text-align: right;">
                                                                <el-button
                                                                    type="text"
                                                                    style="font-size: 12px;text-decoration: underline;"
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
                                                            <div class="time-text-box-bottom"><i class="iconfont icon-jiediankaishishijian" style="font-size: 14px;color: #266fe8;"></i> <span>开始：{{activity.receiveTime|NullStr}}</span></div>
                                                            <div class="time-text-box-bottom"><i class="iconfont icon-jiediantingliushijian" style="font-size: 14px;color: #266fe8;"></i> <span>停留时长：<strong>{{activity.stayTime|NullStr}}</strong></span></div>
                                                            <div class="time-text-box-bottom"><i class="iconfont icon-jiediantingliushijian" style="font-size: 14px;color: #266fe8;"></i> <span>超时时长：<strong>{{activity.allTime|NullStr}}</strong></span></div>
                                                            <div class="time-text-box-bottom" style="font-size: 14px;color: #266fe8;"><i class="iconfont icon-chuliren"></i> <span>处理人：<strong class="users">{{activity.players|NullStr}}</strong></span></div>
                                                        </div>
                                                    </el-timeline-item>
                                                </el-timeline>
                                            </div>
                                        </el-form-item>
                                    </el-form>

                                </el-row>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </div>
            </div>
        </el-drawer>
    </div>
</template>

<script>
import BasicInfo from '../seeTabs/BasicInfo'
import WorkInfo from '../seeTabs/WorkInfo'
import VueUeditorWrap from '@/components/vue-ueditor-wrap.vue' // ES6 Module
import ueditorConfig from '@/mixins/ueditorConfig'
import {
    get_dep_fire_line_alarm,
    get_personal_fire_line_alarm,
    get_assets_fire_line_alarm
} from '@/server/alarm/fire_line.js'
import {
    changeAlarmState,
    getAlarmTemp,
    add_workTask,
    getMenace,
    get_workFlowInfo,
    ip_searchAsset,
    getAlarmReportList
} from '@/server/alarm/alarm_analysis.js'
export default {
    name: 'AlarmEventList',
    mixins: [ueditorConfig],
    components: {
        VueUeditorWrap,
        BasicInfo,
        WorkInfo
    },
    props: ['detailData', 'tab'],
    data() {
        return {
            seeDialog: false,
            tableHeight: 300,
            total: 0,
            get_params: {
                page: 1,
                size: 20
            },
            isSubmitTask: false,
            formLabelWidth: '100px',
            isStateAll: false,
            stateForm: {
                reportStatus: '0',
                actionKey: '',
                actionValue: '',
                actionResults: '',
                analyzePro: '',
                rejectReason: '',
                remark: ''
            },
            stateId: '',
            stateDialog: false,
            mouldTypeList: [
                {
                    id: 0,
                    name: '分析'
                },
                {
                    id: 1,
                    name: '应急'
                },
                {
                    id: 2,
                    name: '通报'
                }
            ],
            sourceId: '',
            allTemplate: [],
            taskForm: {
                workOrderName: '',
                workMouldId: '',
                level: '',
                workOrderContent: '',
                mouldType: ''
            },
            rules: {
                // actionValue: [{
                //     required: true,
                //     message: '请选择动作设置',
                //     trigger: 'change'
                // }],
                // actionKey: [{
                //     required: true,
                //     message: '请选择动作设置',
                //     trigger: 'change'
                // }],
                mouldType: [{
                    required: true,
                    message: '请选择模板类型',
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
            taskDialog: false,
            tableData: [],
            taskClick: false,
            alarmId: '',
            logType: '',
            timeDiffer: '',
            activeName: 'first',
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
                rejectReason: '',
                srcIpIsSpite: '',
                srcIpVenusIsSpite: '',
                desIpIsSpite: '',
                desIpVenusIsSpite: ''
            },
            currentRow: {},
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
            msg: '',
            logIds: [],
            total_report_num: 0,
            total_report_count: 0,
            reportTableData: [],
            report_params: {
                id: '',
                page: 1,
                size: 20
            },
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
            bpmRecord: [],
            assetsInfo: {},
            curRow: {}
        }
    },
    filters: {
        getreportStatus(status) {
            if (status == 0) {
                return '待确认'
            } else if (status == 1) {
                return '已确认'
            } else if (status == 2) {
                return '已处理'
            } else if (status == 3) {
                return '已驳回'
            }
        }
    },
    methods: {
        init() {
            let reqAlarmList = null
            switch (this.tab) {
                case '1':
                    reqAlarmList = get_dep_fire_line_alarm
                    break
                case '2':
                    reqAlarmList = get_personal_fire_line_alarm
                    break
                case '3':
                    reqAlarmList = get_assets_fire_line_alarm
                    break
                default:
                    reqAlarmList = get_dep_fire_line_alarm
                    break
            }
            let data = {
                queryData: {
                    page: this.get_params.page,
                    pageSize: this.get_params.size
                },
                paramsData: {}
            }
            if (this.tab == 1) { // 部门
                data.paramsData.departmentId = this.detailData.orgName === null ? '' : this.detailData.orgName
            }
            if (this.tab == 2) { // 人员
                data.paramsData.departmentId = this.detailData.orgName === null ? '' : this.detailData.orgName
                data.paramsData.username = this.detailData.userName
            }
            if (this.tab == 3) { // 资产
                data.paramsData.assetIps = this.detailData.assetIps
            }
            reqAlarmList(data).then(res => {
                // this.list = []
                this.total = res.alarmPage.total
                this.tableData = res.alarmPage.records
            }).catch(error => {
                console.log('error' + error)
            })
        },
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        async handleSee(row) {
            console.log('row', row)
            this.alarmId = row.id
            this.logType = row.logType
            this.timeDiffer = row.createTime
            console.log('see', row)
            this.$set(this, 'currentRow', row)
            this.activeName = 'first'
            this.$set(this, 'seeForm', row)
            if (this.seeForm.srcIp) {
                try {
                    let srcIpIsSpite = await getMenace({
                        queryData: {
                            value: row.srcIp
                        }
                    })
                    console.log(srcIpIsSpite, 'srcIpIsSpite')
                    this.seeForm.srcIpVenusIsSpite = srcIpIsSpite[0]
                    this.seeForm.srcIpIsSpite = srcIpIsSpite[1]
                } catch (e) {
                    console.log(e)
                }
            }
            if (this.seeForm.desIp) {
                try {
                    let desIpIsSpite = await getMenace({
                        queryData: {
                            value: row.desIp
                        }
                    })
                    console.log(desIpIsSpite, 'desIpIsSpite')
                    this.seeForm.desIpVenusIsSpite = desIpIsSpite[0]
                    this.seeForm.desIpIsSpite = desIpIsSpite[1]
                } catch (e) {
                    console.log(e)
                }
            }
            this.alarmDisposalForm.id = row.id
            this.alarmDisposalForm.desIp = row.desIp ? row.desIp : ''
            this.alarmDisposalForm.reportFrom = row.reportFrom
            this.msg = row.msg
            if (row.msg) {
                try {
                    let msgData = JSON.parse(row.msg)
                    if (msgData.length > 0) this.logIds = [...new Set(msgData.map(item => item.id))]
                } catch (e) {
                    console.log(e)
                }
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
        getAssetsInfo(ip) {
            let data = {
                ip: ip
            }
            ip_searchAsset(data).then(res => {
                console.log('3333333333333', res)
                let list = this.$deepCopy(res)
                this.$set(this, 'assetsInfo', list)
                this.$refs.alarmDetail.assetsInfo = list
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
        submitTaskForm(formName) {
            this.$refs[formName].validate((valid) => {
                this.isSubmitTask = true
                if (valid) {
                    let data = {
                        queryData: {},
                        paramsData: {
                            sourceId: this.sourceId,
                            workOrderName: this.taskForm.workOrderName,
                            level: this.taskForm.level,
                            workMouldId: this.taskForm.workMouldId,
                            mouldType: this.taskForm.mouldType,
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
                        this.taskClick = false
                        this.taskDialog = false
                        this.isSubmitTask = false
                        console.log('发起工单成功')
                        this.$message({
                            message: '发起工单成功',
                            type: 'success'
                        })
                        setTimeout(() => {
                            if (this.seeDialog) {
                                this.seeDialog = false
                            }
                            this.init()
                        }, 1500)
                    }).catch(error => {
                        this.taskClick = false
                        this.taskDialog = false
                        this.isSubmitTask = false
                        console.log(error + 'error')
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        get_workMound() {
            let data = {
                queryData: {},
                paramsData: {
                    id: this.sourceId,
                    mouldType: this.taskForm.mouldType
                }
            }
            getAlarmTemp(data).then(res => {
                console.log('可用工单模板', res)
                this.allTemplate = res
            }).catch(err => {
                console.log(err, 'err')
            })
        },
        changeMouldType(val) {
            if (val !== '') {
                this.get_workMound()
            } else {
                this.allTemplate = []
            }
        },
        stateResetForm() {
            this.$refs.stateForm.resetFields()
            this.stateForm = {
                reportStatus: '0',
                actionKey: '',
                actionValue: '',
                actionResults: '',
                analyzePro: '',
                rejectReason: '',
                remark: ''
            }
        },
        taskResetForm() {
            this.$refs.taskForm.resetFields()
            this.taskForm = {
                workOrderName: '',
                workMouldId: '',
                level: '',
                workOrderContent: '',
                mouldType: ''
            }
        },
        // 变更状态
        submitStateForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = {
                        queryData: {},
                        paramsData: {
                            ids: [this.stateId],
                            reportStatus: this.stateForm.reportStatus,
                            actionKey: this.stateForm.actionKey,
                            actionValue: this.stateForm.actionValue,
                            ip: this.stateForm.actionValue == 1 ? this.curRow.desIp : this.curRow.srcIp
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
                            this.init()
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
            this.$set(this, 'curRow', row)
            if (val == 1) {
                // 发起工单
                if (row.isStart == 1) {
                    return
                }
                this.sourceId = row.id
                this.taskForm.workOrderName = row.reportName + '--' + row.createTime ?? ''
                this.taskDialog = true
            } else if (val == 3) {
                // 状态变更
                this.stateId = row.id
                this.stateDialog = true
            }
        },
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex % 2) {
                return 'table-row2'
            } else {
                return 'table-row1'
            }
        }
    }
}
</script>
<style lang="scss" scoped>
$zero: #03864f;
$one: #0052d9;
$two: #ddd000;
$three: #e47700;
$fore: #e47700;

$status1: #ffdd00;
$status2: #01ff01;
$status3: #00e1fd;
$status4: #e1e2e4;
.drawer-content {
    overflow-y: auto;
    padding: 10px 20px;
    height: calc(100vh - 40px);
}
::v-deep {
    .el-drawer__body {
        padding: 0!important;
    }
}
.list-tip {
    position: relative;
    height: 24px;
    font-size: 14px;
    color: #1c1c1c;
    line-height: 24px;
}
.title-level {
    margin: 0 5px;
    padding: 2px 10px;
    font-size: 12px;
    border-radius: 3px;
    // border: 1px solid $zero;
    // background: rgba($zero, .2);
    color: $zero;
    line-height: 1;
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
.drawer-pad {
    overflow-y: auto;
    // padding: 0 20px;
    height: calc(100% - 53px);
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
.drawer-pad ::v-deep .el-form-item__label {
    font-size: 12px;
    color: #999999!important;
}
</style>
