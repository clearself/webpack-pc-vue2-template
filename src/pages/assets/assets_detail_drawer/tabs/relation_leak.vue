<template>
    <div class="leak">
        <div class="statistics">
            <div class="title ml-1 mt-1 mb-1">漏洞统计</div>
            <div class="ub ub-pj ml-1 mr-1">
                <div class="box ub">
                    <div class="circle ub ub-pc ub-ac mt-2 ml-2" style="background: #108eff;"><i class="iconfont icon-loudongguanli"></i></div>
                    <div class="" style="margin: auto 0 auto 20px;">
                        <div style="font-size: 15px;color: #929292;">待处理漏洞</div>
                        <div style="font-size: 25px;color: #272727;">{{ ldInfo.dcl }}</div>
                    </div>
                </div>
                <div class="box ub">
                    <div class="circle ub ub-pc ub-ac mt-2 ml-2" style="background: #fd6c6c;"><i class="iconfont icon-loudongguanli"></i></div>
                    <div class="" style="margin: auto 0 auto 20px;">
                        <div style="font-size: 15px;color: #929292;">待处理高危漏洞</div>
                        <div style="font-size: 25px;color: #fd6c6c;">{{ ldInfo.dclD }}</div>
                    </div>
                </div>
                <div class="box ub">
                    <div class="circle ub ub-pc ub-ac mt-2 ml-2" style="background: #fdd46c;"><i class="iconfont icon-loudongguanli"></i></div>
                    <div class="" style="margin: auto 0 auto 20px;">
                        <div style="font-size: 15px;color: #929292;">待处理中危漏洞</div>
                        <div style="font-size: 25px;color: #fdd46c;">{{ ldInfo.dclZ }}</div>
                    </div>
                </div>
                <div class="box ub">
                    <div class="circle ub ub-pc ub-ac mt-2 ml-2" style="background: #82abfa;"><i class="iconfont icon-loudongguanli"></i></div>
                    <div class="" style="margin: auto 0 auto 20px;">
                        <div style="font-size: 15px;color: #929292;">待处理低危漏洞</div>
                        <div style="font-size: 25px;color: #82abfa;">{{ ldInfo.dclG }}</div>
                    </div>
                </div>
                <div class="box ub">
                    <div class="circle ub ub-pc ub-ac mt-2 ml-2" style="background: #4bdab1;"><i class="iconfont icon-loudongguanli"></i></div>
                    <div class="" style="margin: auto 0 auto 20px;">
                        <div style="font-size: 15px;color: #929292;">待处理信息漏洞</div>
                        <div style="font-size: 25px;color: #4bdab1;">{{ ldInfo.dclX }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="w100 mt-1">
            <div class="search-area">
                <SearchTop @search="searchCheck" @reset="reset">
                    <el-col :xl="8">
                        <el-form :model="get_params">
                            <el-form-item label="漏洞名称：" label-width="80px">
                                <el-input
                                    placeholder="请输入"
                                    clearable
                                    v-model="get_params.nodeName"
                                    @keyup.enter.native="searchCheck"
                                    size="small"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :xl="8">
                        <el-form :model="get_params">
                            <el-form-item label="漏洞级别："  label-width="80px">
                                <el-select
                                    v-model="get_params.riskLevel"
                                    filterable
                                    placeholder="请选择"
                                    style="width: 100%;"
                                    size="small"
                                    clearable>
                                    <el-option label="低" value="1"></el-option>
                                    <el-option label="中" value="2"></el-option>
                                    <el-option label="高" value="3"></el-option>
                                    <el-option label="信息类" value="4"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :xl="8">
                        <el-form :model="get_params">
                            <el-form-item label="漏洞状态："  label-width="80px">
                                <el-select
                                    v-model="get_params.status"
                                    filterable
                                    placeholder="请选择"
                                    style="width: 100%;"
                                    size="small"
                                    clearable>
                                    <el-option label="待处理" value="1"></el-option>
                                    <el-option label="已整改" value="2"></el-option>
                                    <el-option label="误报" value="3"></el-option>
                                    <el-option label="无法整改" value="4"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </SearchTop>
            </div>
            <div class="list-container">
                <div class="ub ub-pj ub-ac w100 mb-1">
                    <div class="list-tips">列表内容</div>
                </div>
                <el-table
                    :row-class-name="tableRowClassName"
                    ref="multipleTable"
                    v-loading="loading"
                    class='bigTable full-table'
                    :data="tableData"
                    border
                    stripe
                    tooltip-effect="dark"
                >
                    <el-table-column type="selection" width="50"></el-table-column>
                    <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                    </el-table-column>
                    <el-table-column prop="nodeName" label="漏洞名称" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column label="资产名称">
                        <template slot-scope="scope">
                            <span>
                                {{scope.row.deviceName}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="业务系统">
                        <template slot-scope="scope">
                            <span>
                                {{scope.row.systemName}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="riskLeve" label="漏洞级别" >
                        <template slot-scope="scope">
                            <div>
                                <span style="color: #00a2ff;" v-if="scope.row.riskLevel==1">
                                    {{scope.row.riskLevelCN}}
                                </span>
                                <span style="color: #f2cd00;" v-if="scope.row.riskLevel==2">
                                    {{scope.row.riskLevelCN}}
                                </span>
                                <span style="color: #f86900;" v-if="scope.row.riskLevel==3">
                                    {{scope.row.riskLevelCN}}
                                </span>
                                <span style="color: #19b0b1;" v-if="scope.row.riskLevel==4">
                                    {{scope.row.riskLevelCN}}
                                </span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="leakTypeCN" label="漏洞类型" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建时间" width="160">
                    </el-table-column>
                    <el-table-column label="漏洞状态" prop="status">
                        <template slot-scope="scope">
                            <div>
                                <div v-if="scope.row.status == 1" class="ub ub-ac ub-pc alarm-state one">
                                    <div>待处理</div>
                                </div>
                                <div v-if="scope.row.status == 2" class="ub ub-ac ub-pc alarm-state two">
                                    <div>已整改</div>
                                </div>
                                <div v-if="scope.row.status == 3" class="ub ub-ac ub-pc alarm-state three">
                                    <div>误报</div>
                                </div>
                                <div v-if="scope.row.status == 4" class="ub ub-ac ub-pc alarm-state four">
                                    <div>无法整改</div>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="120">
                        <template slot-scope="scope">
                            <el-button type="text" @click="handleSee(scope.row)" size="small">查看</el-button>
                            <el-button :disabled="scope.row.isStart ==1" type="text" @click="changeOption(1,scope.row)" size="small">发起工单</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <pagination v-show="total_num>0" :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size" @pagination="get_data" />
            </div>
        </div>
        <el-drawer :visible.sync="seeDialog" :title="seeForm.nodeName" direction="rtl" size="1020px" :modal="false" custom-class="drawer-dialog">
            <div class="drawer-content">
                <div style="position: relative;top: 0;left: 0;overflow-y: auto;width: 100%;height: 100%;">
                    <div class="drawer-pad">
                        <el-tabs v-model="activeName">
                            <el-tab-pane label="基本信息" name="first">

                                <div class="ub w100 ub-ver baseInfo-list">
                                    <div class="ub w100 baseInfo-list-item">
                                        <div>漏洞名称 </div>
                                        <div class="ub ub-f1">{{seeForm.nodeName}}</div>
                                    </div>
                                    <div class="ub w100 baseInfo-list-item">
                                        <div>漏洞类型</div>
                                        <div class="ub ub-f1">{{seeForm.leakTypeCN}}</div>
                                    </div>
                                    <div class="ub w100 baseInfo-list-item">
                                        <div>修复建议</div>
                                        <div class="ub ub-f1">{{seeForm.repairAdvice}}</div>
                                    </div>
                                    <div class="ub w100 baseInfo-list-item">
                                        <div>简短描述</div>
                                        <div class="ub ub-f1">{{seeForm.shortDesc}}</div>
                                    </div>
                                    <div class="ub w100 baseInfo-list-item">
                                        <div>详细描述</div>
                                        <div class="ub ub-f1">{{seeForm.fullDesc}}</div>
                                    </div>
                                    <div class="ub w100 baseInfo-list-item">
                                        <div>漏洞CVSS分值</div>
                                        <div class="ub ub-f1">{{seeForm.cvssScore}}</div>
                                    </div>
                                    <div class="ub w100 baseInfo-list-item">
                                        <div>CVE编号</div>
                                        <div class="ub ub-f1">{{seeForm.cveTag}}</div>
                                    </div>
                                    <div class="ub w100 baseInfo-list-item">
                                        <div>CNNVD编号</div>
                                        <div class="ub ub-f1">{{seeForm.cnnvdTag}}</div>
                                    </div>
                                    <div class="ub w100 baseInfo-list-item">
                                        <div>CNVD编号</div>
                                        <div class="ub ub-f1">{{seeForm.cnvdTag}}</div>
                                    </div>
                                    <div class="ub w100 baseInfo-list-item">
                                        <div>CNCVE编号</div>
                                        <div class="ub ub-f1">{{seeForm.cncveTag}}</div>
                                    </div>
                                    <div class="ub w100 baseInfo-list-item">
                                        <div>BUGTRAP</div>
                                        <div class="ub ub-f1">{{seeForm.bugTraqTag}}</div>
                                    </div>

                                    <div class="ub w100 baseInfo-list-item">
                                        <div>更新时间</div>
                                        <div class="ub ub-f1">{{seeForm.updateTime}}</div>
                                    </div>
                                    <div class="ub w100 baseInfo-list-item">
                                        <div>影响平台</div>
                                        <div class="ub ub-f1">{{seeForm.platforms}}</div>
                                    </div>
                                    <div class="ub w100 baseInfo-list-item">
                                        <div>创建时间</div>
                                        <div class="ub ub-f1">{{seeForm.createTime}}</div>
                                    </div>
                                    <div class="ub w100 baseInfo-list-item">
                                        <div>漏洞端口</div>
                                        <div class="ub ub-f1">{{seeForm.port}}</div>
                                    </div>
                                    <div class="ub w100 baseInfo-list-item">
                                        <div>服务名称</div>
                                        <div class="ub ub-f1">{{seeForm.serviceName}}</div>
                                    </div>
                                    <div class="ub w100 baseInfo-list-item">
                                        <div>检查结果</div>
                                        <div class="ub ub-f1">{{seeForm.checkResult|getcheckResult}}</div>
                                    </div>
                                    <div class="ub w100 baseInfo-list-item">
                                        <div>检查类型</div>
                                        <div class="ub ub-f1">{{seeForm.checkType}}</div>
                                    </div>
                                    <div class="ub w100 baseInfo-list-item">
                                        <div>合规项描述</div>
                                        <div class="ub ub-f1">{{seeForm.compliance}}</div>
                                    </div>
                                    <div class="ub w100 baseInfo-list-item">
                                        <div>加固方案</div>
                                        <div class="ub ub-f1">{{seeForm.reinforcement}}</div>
                                    </div>
                                    <div class="ub w100 baseInfo-list-item">
                                        <div>漏洞URL</div>
                                        <div class="ub ub-f1">{{seeForm.leakUrl}}</div>
                                    </div>
                                    <div class="ub w100 baseInfo-list-item">
                                        <div>网站名称</div>
                                        <div class="ub ub-f1">{{seeForm.webName}}</div>
                                    </div>
                                    <div class="ub w100 baseInfo-list-item">
                                        <div>提交类型</div>
                                        <div class="ub ub-f1">{{seeForm.submitType}}</div>
                                    </div><div class="ub w100 baseInfo-list-item">
                                        <div>测试数据</div>
                                        <div class="ub ub-f1">{{seeForm.testData}}</div>
                                    </div>
                                    <div class="ub w100 baseInfo-list-item">
                                        <div>POST数据</div>
                                        <div class="ub ub-f1">{{seeForm.postData}}</div>
                                    </div>
                                    <div class="ub w100 baseInfo-list-item">
                                        <div>附件</div>
                                        <div class="ub ub-f1"><a :href="seeForm.filePath" style="text-decoration: underline;color: #ffffff;">{{seeForm.filePath|getfilePath}}</a></div>
                                    </div>
                                </div>
                            </el-tab-pane>
                            <el-tab-pane label="受影响资产" name="three">
                                <div v-if="activeName==='three'"  class="w100" style="margin-top: 20px;">
                                    <div class="leak-assets-title" style="margin-bottom: 10px;width: 100%;font-size: 14px;color: rgb(0 0 0 / 90%);">资产类型占比</div>
                                    <div class="w100">
                                        <div class="chart-box w100">
                                            <div class="chart-map w100">
                                                <div v-loading="load_loading" style="width: 100%;height: 210px;">
                                                    <div v-if="load_no_data" class="ub ub-f1 ub-ac ub-pc" style="height: 100%;font-size: 16px;color: #e7e7e7;">
                                                        暂无数据
                                                    </div>
                                                    <pie v-if="assetTypes.length>0" type="1" :chartData="assetTypes" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="leak-assets-title" style="margin-bottom: 10px;width: 100%;font-size: 14px;color: #rgba(0, 0, 0, 0.9);">影响资产列表</div>
                                    <el-table
                                        ref="multipleTable3"
                                        v-loading="loadingAssets"
                                        class='bigTable'
                                        :data="assetList"
                                        border
                                        stripe
                                        tooltip-effect="dark">
                                        <el-table-column align="center" type="index" :index="indexMethodAssets" width="50" label="序号">
                                        </el-table-column>
                                        <el-table-column prop="deviceName" label="资产名称">
                                        </el-table-column>
                                        <el-table-column prop="systemName" label="业务系统">
                                        </el-table-column>
                                        <el-table-column prop="zoneName" label="安全域">
                                        </el-table-column>
                                        <el-table-column label="IPV4">
                                            <template slot-scope="scope">
                                                <span>{{scope.row.ipv4.join(',')}}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="IPV6">
                                            <template slot-scope="scope">
                                                <span>{{scope.row.ipv6.join(',')}}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="风险等级">
                                            <template slot-scope="scope">
                                                <div>
                                                    <span style="color: #e40205;" v-if="scope.row.riskLevel==0">
                                                        {{scope.row.riskLevelCN}}
                                                    </span>
                                                    <span style="color: #f76801;" v-if="scope.row.riskLevel==1">
                                                        {{scope.row.riskLevelCN}}
                                                    </span>
                                                    <span style="color: #f5ed6b;" v-if="scope.row.riskLevel==2">
                                                        {{scope.row.riskLevelCN}}
                                                    </span>
                                                    <span style="color: #0088d8;" v-if="scope.row.riskLevel==3">
                                                        {{scope.row.riskLevelCN}}
                                                    </span>
                                                    <span style="color: #6bfcfc;" v-if="scope.row.riskLevel==4">
                                                        {{scope.row.riskLevelCN}}
                                                    </span>
                                                </div>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                    <div class="pagination" style="margin-top: 10px;text-align: right;">
                                        <el-pagination
                                            background
                                            @size-change="handleSizeChangeAssets"
                                            @current-change="handleCurrentChangeAssets"
                                            :current-page="get_paramsAssets.page"
                                            :page-sizes="[20, 30, 40,50]"
                                            :page-size="get_paramsAssets.size"
                                            layout="total, sizes, prev, pager, next"
                                            :total="total_numAssets">
                                        </el-pagination>
                                    </div>
                                </div>
                            </el-tab-pane>
                            <el-tab-pane label="工单详情" name="two">
                                <el-form :model="workFlowInfo" ref="workFlowInfo" :inline="true">
                                    <el-row type="flex" justify="start">
                                        <el-form-item label="工单编号：" prop="" style="width: 33%;">
                                            {{ workFlowInfo.field.workOrderId }}
                                        </el-form-item>
                                        <el-form-item label="工单名称：" prop="" style="width: 33%;">{{ workFlowInfo.field.workOrderName }}
                                        </el-form-item>
                                        <el-form-item label="工单模板：" prop="" style="width: 33%;" class="text-out-auto">
                                            {{ workFlowInfo.field.workMouldName }}
                                        </el-form-item>
                                    </el-row>
                                    <el-row type="flex" justify="start">
                                        <el-form-item label="创建时间：" prop="createTime" style="width: 33%;">
                                            {{ workFlowInfo.field.createTime }}
                                        </el-form-item>
                                        <el-form-item label="优先级：" prop="" style="width: 33%;">
                                            <span v-if="workFlowInfo.field.level==1" style="color: #ff0000;">{{workFlowInfo.field.level|getLevel}}</span>
                                            <span v-else-if="workFlowInfo.field.level==2" style="color: #ffdd00;">{{workFlowInfo.field.level|getLevel}}</span>
                                            <span v-else style="color: #00e1fd;">{{workFlowInfo.field.level|getLevel}}</span>
                                        </el-form-item>
                                        <el-form-item label="工单状态：" prop="" style="width: 33%;">
                                            {{ workFlowInfo.field.status|getTaskStatus }}
                                        </el-form-item>
                                    </el-row>
                                    <el-row type="flex" justify="start">
                                        <el-form-item label="创建人：" prop="" style="width: 33%;">
                                            {{ workFlowInfo.field.createUserName }}
                                        </el-form-item>
                                        <el-form-item label="当前节点：" prop="" style="width: 33%;">{{ workFlowInfo.field.runningNodeName|getRunningNodeName }}
                                        </el-form-item>
                                        <el-form-item label="当前节点状态：" prop="" style="width: 33%;">
                                            <span v-if="workFlowInfo.field.currentNodeStatus==='待处理'" style="color: #ffba00;">{{workFlowInfo.field.currentNodeStatus}}</span>
                                            <span v-if="workFlowInfo.field.currentNodeStatus==='已超时'" style="color: #ff00e4;">{{workFlowInfo.field.currentNodeStatus}}</span>
                                            <span v-if="workFlowInfo.field.currentNodeStatus==='已撤销'" style="color: #cccccc;">{{workFlowInfo.field.currentNodeStatus}}</span>
                                            <span v-if="workFlowInfo.field.currentNodeStatus==='已完成'" style="color: lightgreen;">{{workFlowInfo.field.currentNodeStatus}}</span>

                                        </el-form-item>

                                    </el-row>
                                </el-form>
                            </el-tab-pane>

                        </el-tabs>
                        <div v-if="activeName==='two'&&workFlowInfo.flow.xml!=''" style="margin-bottom: 10px;width: 100%;font-size: 14px;color: #rgba(0, 0, 0, 0.9);">工单流程</div>
                        <div v-if="activeName==='two'&&workFlowInfo.flow.xml!=''" class="w100 pic-wrapper" style="position: relative;color: #ffffff;">

                            <bpmn-modeler
                                ref="refNode"
                                :xml="workFlowInfo.flow.xml"
                                :workStatus="workStatus"
                                :currentWorkIds="currentWorkIds"
                                :is-view="false"
                                @change-element="changeElement"
                            />
                        </div>
                        <div class="w100" v-if="activeName==='two'&&workFlowInfo.flow.xml!=''&&passForm.isPass!==''" style="margin-top: 20px;">
                            <div style="margin-bottom: 10px;width: 100%;font-size: 14px;color: #rgba(0, 0, 0, 0.9);">{{passForm.name}}</div>
                            <div class="w100">
                                <el-form :model="passForm" ref="passForm" :inline="true" style="color: #ffffff;">
                                    <el-row type="flex" justify="start">
                                        <el-form-item label="结果：" prop="" style="width: 50%;">
                                            {{passForm.isPass==1?'通过':'未通过'}}
                                        </el-form-item>
                                    </el-row>
                                </el-form>
                            </div>
                        </div>
                        <el-row v-if="activeName==='two'&&workFlowInfo.flow.xml!=''&&passForm.isPass!==''&&bpmRecord.length>0" style="margin: 20px 0;" type="flex" justify="center">
                            <el-form :model="passForm" class="w100" ref="passForm" :inline="true" style="color: #ffffff;">
                                <el-form-item label="流转记录：" prop="" style="width: 100%;">
                                    <div
                                        class="work-record "
                                        style="padding: 10px;width: 750px;border: solid 1px rgb(0 233 255 / 30%);border-radius: 4px 0 0;background-color: rgb(0 0 0 / 20%);box-sizing: border-box;">
                                        <el-timeline style="margin-left: 88px;width: 87%;box-sizing: border-box;">
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
                                                        <h4 style="font-size: 16px;color: #rgba(0, 0, 0, 0.9);">{{activity.userName|NullStr}}<sub style="margin-left: 10px;font-size: 12px;color: #ffffff;opacity: 0.6;vertical-align: bottom;">{{activity.userRole|NullStr}}</sub></h4>
                                                    </div>
                                                    <div class="time-right" style="width: 150px;text-align: right;">
                                                        <el-button
                                                            type="text"
                                                            style="font-size: 12px;text-decoration: underline;"
                                                            :class="{'el-icon-arrow-down':activity.isOpen,'el-icon-arrow-up':!activity.isOpen}"
                                                            @click="activity.isOpen=!activity.isOpen">展开查看</el-button>
                                                    </div>
                                                </div>
                                                <div v-show="activity.isOpen" style=" padding: 10px;border: solid 1px rgb(0 233 255 / 30%);">
                                                    <div class="time-text-box" v-if="(workFlowInfo.field.workOrderObject == 1||workFlowInfo.field.workOrderObject == 2)&&activity.dealType==0">
                                                        <div class="ub w100 time-text-box-item" v-for="(item,_index) in activity.dealContent" :key="_index">
                                                            <div class="time-text-box-left">{{item.name}}:</div>
                                                            <div v-if="item.valType==='text'||item.valType==='select'" class="ub ub-f1 ub-ver time-text-box-right">{{item|getVal}}</div>
                                                            <div v-else class="ub ub-f1 ub-ver time-text-box-right" v-html="item.val" @click="imageEnlargement"></div>
                                                        </div>
                                                    </div>

                                                    <!-- 漏洞处置 -->
                                                    <div class="time-text-box" v-if="workFlowInfo.field.workOrderObject == 2&&activity.operation&&activity.operation==2">
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
                                                    <div class="time-text-box-bottom"><i class="iconfont icon-jiediankaishishijian"></i> <span>开始：{{activity.receiveTime|NullStr}}</span></div>
                                                    <div class="time-text-box-bottom"><i class="iconfont icon-jiediantingliushijian"></i> <span>停留时长：<strong>{{activity.stayTime|NullStr}}</strong></span></div>
                                                    <div class="time-text-box-bottom"><i class="iconfont icon-jiediantingliushijian"></i> <span>超时时长：<strong>{{activity.allTime|NullStr}}</strong></span></div>
                                                    <div class="time-text-box-bottom"><i class="iconfont icon-chuliren"></i> <span>处理人：<strong class="users">{{activity.players|NullStr}}</strong></span></div>
                                                </div>
                                            </el-timeline-item>
                                        </el-timeline>
                                    </div>
                                </el-form-item>
                            </el-form>

                        </el-row>
                        <div class="w100" v-if="activeName==='two'&&workFlowInfo.flow.xml!=''&&passForm.isPass!==''" style="margin-top: 20px;">
                            <div style="margin-bottom: 10px;width: 100%;font-size: 14px;color: #rgba(0, 0, 0, 0.9);">任务属性</div>
                            <div class="w100">
                                <el-form :model="taskInfo" ref="taskInfo" :inline="true" style="color: #ffffff;">
                                    <el-row type="flex" justify="start">
                                        <el-form-item label="任务开始时间：" prop="" style="width: 50%;">
                                            <div class="ub line2" style="width: 270px;">
                                                {{ taskInfo.receiveTime }}
                                            </div>
                                        </el-form-item>
                                        <el-form-item label="任务停留时间：" prop="" style="width: 50%;">
                                            <div class="ub line2" style="width: 270px;">
                                                {{ taskInfo.stayTime }}
                                            </div>
                                        </el-form-item>
                                    </el-row>
                                    <el-row type="flex" justify="start">
                                        <el-form-item label="处理人：" prop="createTime" style="width: 50%;">
                                            <div class="ub line2" style="width: 270px;">
                                                {{ taskInfo.dealUsers }}
                                            </div>
                                        </el-form-item>
                                        <el-form-item label="任务描述：" prop="" style="width: 50%;">
                                            <div class="ub line2" style="width: 270px;">
                                                {{ taskInfo.nodeDes }}
                                            </div>
                                        </el-form-item>
                                    </el-row>
                                </el-form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </el-drawer>
        <el-dialog title="发起工单" :visible.sync="taskDialog" width="900px" custom-class="common-dialog" :modal="false">
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
                        <el-option v-for="item in allTemplate" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="width: 100%;" label="工单描述：" :label-width="formLabelWidth">
                    <div style="width: 100%;">
                        <vue-ueditor-wrap v-model="taskForm.workOrderContent" :config="myConfig"></vue-ueditor-wrap>
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="taskDialog = false">取 消</el-button>
                <Debounce :time='1500' :isDebounce="2">
                    <el-button size="small" type="primary" @click.native="submitTaskForm('taskForm')">确 定</el-button>
                </Debounce>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {
    getLdInfo,
    getLeakList,
    getLeakTemp,
    add_workTask,
    getAssetTypePrcent,
    getAssetList,
    get_workFlowInfo,
    get_ElementInfo
} from '@/server/assets/assets_info_leak.js'
import pie from '../../charts/pieAssets.vue'
import bpmnModeler from '@/package/detailXml'
import VueUeditorWrap from '../../../../components/vue-ueditor-wrap.vue' // ES6 Module
import ueditorConfig from '../../../../mixins/ueditorConfig'
export default {
    components: {
        pie,
        bpmnModeler,
        VueUeditorWrap
    },
    mixins: [ueditorConfig],
    props: {
        ipsData: {
            type: Array,
            default() {
                return []
            }
        },
        assetsId: {
            type: String,
            default() {
                return ''
            }
        }
    },
    data() {
        return {
            ldInfo: {
                dcl: 0,
                dclG: 0,
                dclZ: 0,
                dclD: 0,
                dclX: 0
            },
            rules: {
                nodeName: [{
                    required: true,
                    message: '请输入',
                    trigger: 'blur'
                }],
                riskLevel: [{
                    required: true,
                    message: '请选择',
                    trigger: 'change'
                }],
                fromType: [{
                    required: true,
                    message: '请选择',
                    trigger: 'change'
                }],
                objId: [{
                    required: true,
                    message: '请选择',
                    trigger: 'change'
                }],
                leakType: [{
                    required: true,
                    message: '请选择',
                    trigger: 'change'
                }],
                labels: [{
                    required: true,
                    message: '请选择',
                    trigger: 'change'
                }],
                workOrderName: [{
                    required: true,
                    message: '请输入名称',
                    trigger: 'blur'
                }],
                level: [{
                    required: true,
                    message: '请选择优先级',
                    trigger: 'change'
                }],
                workMouldId: [{
                    required: true,
                    message: '请选择工单模板',
                    trigger: 'change'
                }]
            },
            formLabelWidth: '110px',
            get_params: {
                page: 1,
                size: 10,
                nodeName: '',
                vulnType: '',
                riskLevel: '',
                status: '1',
                fromType: 1,
                objId: ''
            },
            labels: [],
            tableHeight: document.body.clientHeight - 270,
            loading: false,
            tableData: [],
            total_num: 0,
            seeForm: {},
            seeDialog: false,
            load_loading: false,
            load_no_data: false,
            assetTypes: [],
            loadingAssets: false,
            assetList: [],
            total_numAssets: 0,
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
            activeName: 'first',
            passForm: {
                name: '',
                isPass: ''
            },
            bpmRecord: [],
            get_paramsAssets: {
                page: 1,
                size: 20
            },
            sourceId: '',
            taskDialog: false,
            allTemplate: [],
            taskForm: {
                workOrderName: '',
                workMouldId: '',
                level: '',
                workOrderContent: ''
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
        getcheckResult(type) {
            let types = [{
                label: '合规',
                value: 0
            }, {
                label: '不合规',
                value: 1
            }, {
                label: '不适用',
                value: 2
            }, {
                label: '解析失败',
                value: 3
            }, {
                label: '检查失败',
                value: 4
            }]
            let selected = types.filter(item => item.value == type)
            if (selected.length > 0) {
                return selected[0].label
            } else {
                return ''
            }
        },
        getfilePath(path) {
            console.log(222222, path)
            if (path) {
                let arr = path.split('/')
                return arr[arr.length - 1]
            } else {
                return ''
            }
        },
        getriskLevel(val) {
            if (val == 1) {
                return '低'
            } else if (val == 2) {
                return '中'
            } else if (val == 3) {
                return '高'
            } else if (val == 4) {
                return '信息类'
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
            if (status == 0 && status !== '') {
                return '已撤销'
            } else if (status == 1) {
                return '进行中'
            } else if (status == 3) {
                return '已完成'
            } else {
                return ''
            }
        },
        getRunningNodeName(arr) {
            if (arr && arr.length > 0) {
                return arr.join(',')
            } else {
                return ''
            }
        }
    },
    watch: {
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
        }
    },
    // mounted() {
    //     this.$nextTick(() => {
    //         // this.assetsList()
    //         // this.systemList()
    //         // this.initLabelList()
    //         this.get_data()
    //     })
    // },
    created() {
        this.get_data()
        this.getLdInfoData()
    },
    methods: {
        getLdInfoData() {
            let data = {
                queryData: {},
                paramsData: {
                    id: this.assetsId
                }
            }
            getLdInfo(data).then(res => {
                this.ldInfo = res
            }).catch(error => {
                console.log(error + 'error')
            })
        },
        searchCheck() {
            this.get_params.page = 1
            this.get_data()
        },
        reset() {
            this.get_params = {
                page: 1,
                size: 20,
                nodeName: '',
                vulnType: '',
                riskLevel: '',
                status: '',
                fromType: 1,
                objId: ''
            }
            this.get_data()
        },
        submitTaskForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = {
                        queryData: {},
                        paramsData: {
                            sourceId: this.sourceId,
                            workOrderName: this.taskForm.workOrderName,
                            level: this.taskForm.level,
                            workMouldId: this.taskForm.workMouldId,
                            workOrderContent: this.taskForm.workOrderContent,
                            type: 2
                        }
                    }
                    add_workTask(data).then(res => {
                        this.taskDialog = false
                        console.log('发起工单成功')
                        this.$message({
                            message: '发起工单成功',
                            type: 'success'
                        })
                        setTimeout(() => {
                            this.get_data()
                        }, 1500)
                    }).catch(error => {
                        this.taskDialog = false
                        console.log(error + 'error')
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        changeOption(value, row) {
            if (value == 1) {
            // 发起工单
                if (row.isStart == 1) {
                    return
                }
                this.sourceId = row.id
                this.get_workMound()
                this.taskDialog = true
            }
        },
        get_workMound(id) {
            let data = {
                queryData: {},
                paramsData: {
                    id: 2
                }
            }
            getLeakTemp(data).then(res => {
                console.log('可用工单模板', res)
                this.allTemplate = res
            }).catch(err => {
                console.log(err, 'err')
            })
        },
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex % 2) {
                return 'table-row2'
            } else {
                return 'table-row1'
            }
        },
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        get_data() {
            this.loading = true
            this.tableData = []
            let data = {
                queryData: {
                    page: this.get_params.page,
                    pageSize: this.get_params.size
                },
                paramsData: {
                    nodeName: this.get_params.nodeName,
                    vulnType: this.get_params.vulnType,
                    riskLevel: this.get_params.riskLevel,
                    status: this.get_params.status,
                    objId: this.assetsId,
                    fromType: this.get_params.objId ? 1 : '',
                    startTime: '',
                    endTime: ''
                }
            }
            getLeakList(data).then(res => {
                console.log('列表', res)
                this.loading = false
                this.total_num = res.total
                let list = res.records
                if (list.length > 0) {
                    list.forEach(item => {
                        let obj = {}
                        obj.id = item.id
                        obj.vulnId = item.vulnId
                        obj.nodeName = item.nodeName
                        obj.shortDesc = item.shortDesc
                        obj.fullDesc = item.fullDesc
                        obj.repairAdvice = item.repairAdvice
                        obj.riskLevel = item.riskLevel
                        obj.platforms = item.platforms
                        obj.cncveTag = item.cncveTag
                        obj.createTime = item.createTime
                        obj.cveTag = item.cveTag
                        obj.cnnvdTag = item.cnnvdTag
                        obj.cnvdTag = item.cnvdTag
                        obj.cvssScore = item.cvssScore
                        obj.bugTraqTag = item.bugTraqTag
                        obj.updateTime = item.updateTime
                        obj.vulnType = item.vulnType
                        obj.type = item.type
                        obj.riskLevelCN = item.riskLevelCN
                        obj.fromType = item.fromType
                        obj.objId = item.objId
                        obj.filePath = item.filePath
                        obj.leakType = item.leakType
                        obj.leakTypeCN = item.leakTypeCN
                        obj.labels = item.labels
                        obj.addType = item.addType
                        obj.checkResult = item.checkResult
                        obj.checkType = item.checkType
                        obj.compliance = item.compliance
                        obj.createMonth = item.createMonth
                        obj.ip = item.ip
                        obj.isStart = item.isStart
                        obj.leakUrl = item.leakUrl
                        obj.localTaskId = item.localTaskId
                        obj.logId = item.logId
                        obj.port = item.port
                        obj.postData = item.postData
                        obj.reinforcement = item.reinforcement
                        obj.serviceName = item.serviceName
                        obj.submitType = item.submitType
                        obj.testData = item.testData
                        obj.webName = item.webName
                        obj.deviceName = item.deviceName
                        obj.systemName = item.systemName
                        obj.status = item.status

                        this.tableData.push(obj)
                    })
                }
            }).catch(error => {
                this.loading = false
                console.log('error' + error)
            })
        },
        handleSee(row) {
            console.log(row)
            this.$set(this, 'seeForm', row)
            this.seeForm = row
            this.initAssetTypePrcent(row.id)
            this.initAssetList(this.seeForm.id)
            this.seeDialog = true
            this.getWorkFlow(row.id)
        },
        // 饼图
        initAssetTypePrcent(id) {
            this.load_loading = true
            this.load_no_data = true
            this.assetTypes = []
            let data = {
                queryData: {},
                paramsData: {
                    id: id
                }
            }
            getAssetTypePrcent(data).then(res => {
                console.log(res, '资产类型占比')
                this.load_loading = false
                if (res.length > 0) {
                    this.load_no_data = false
                    let arr = []
                    res.forEach(item => {
                        let obj = {}
                        obj.name = item.name
                        obj.value = item.num
                        arr.push(obj)
                    })
                    this.assetTypes = this.$deepCopy(arr)
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // 资产列表
        initAssetList(id) {
            this.loadingAssets = true
            this.assetList = []
            let data = {
                queryData: {},
                paramsData: {
                    id: id
                }
            }
            getAssetList(data).then(res => {
                console.log(res, '资产列表')
                this.loadingAssets = false
                this.total_numAssets = res.total
                let list = res.records
                if (list.length > 0) {
                    this.assetList = this.$deepCopy(list)
                }
            }).catch(err => {
                console.log(err)
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
            }).catch(error => {
                console.log('error' + error)
            })
        },
        changeElement({ id, name }) {
            console.log(id, name)
            this.getElementInfo(id, name)
        },
        getElementInfo(id, name) {
            let data = {
                queryData: {},
                paramsData: {
                    nodeId: id,
                    workOrderId: this.workFlowInfo.field.workOrderId
                }
            }
            get_ElementInfo(data).then(res => {
                console.log('节点详情', res)
                if (JSON.stringify(res) === '{}' || !res) {
                    return
                }
                let arr = res.records
                this.passForm.name = name
                this.passForm.isPass = res.isPass
                this.taskInfo = res.attr
                this.bpmRecord = arr.map((item, index) => {
                    item.size = 'large'
                    item.isOpen = true
                    item.color = 'rgba(0,0,0,1)'
                    item.icon = index === 0 ? 'el-icon-circle-check' : 'iconfont icon-circle'
                    item.dealContent = JSON.parse(item.dealContent)
                    return item
                })
            })
        },
        indexMethodAssets(index) {
            return (this.get_paramsAssets.page - 1) * this.get_paramsAssets.size + index + 1
        },
        handleSizeChangeAssets(val) {
            this.get_paramsAssets.size = val
            this.initAssetList(this.seeForm.id)
        },
        handleCurrentChangeAssets(val) {
            this.get_paramsAssets.page = val
            this.initAssetList(this.seeForm.id)
        }
    }
}
</script>

<style lang="scss" scoped>
.alarm-state {
    padding: 2px 5px;
    width: 80px;
    height: 18px;
    border-radius: 11px;
    &.one {
        color: #de7400;
        background-color: #fde6d8;
    }
    &.two {
        color: #03864f;
        background-color: #ccf6e4;
    }
    &.three {
        color: #0052d9;
        background-color: #d5e5fa;
    }
    &.four {
        color: #aa0202;
        background-color: #fad7dd;
    }
}
.leak {
    ::v-deep .el-drawer__container {
        background: rgb(0 0 0 / 40%);
    }
    ::v-deep .el-dialog__wrapper {
        background: rgb(0 0 0 / 40%);
    }
}
.search-area {
    .wrapper {
        box-shadow: none !important;
    }
}
.leak {
    .statistics {
        width: 100%;
        height: 150px;
        border: 1px solid #ebf1f5;
        .title {
            font-size: 12px;
        }
        .box {
            width: 222px;
            height: 100px;
            border: 1px solid #e9e9e9;
            .circle {
                width: 60px;
                height: 60px;
                border-radius: 100%;
                i {
                    font-size: 35px;
                    color: #ffffff;
                }
            }
        }
    }
}
.baseInfo-list {
    border-radius: 4px;
}
.baseInfo-list-item {
    margin-top: -2px;
    min-height: 34px;
    background-color: #ffffff;
}
.baseInfo-list-item:nth-child(1) {
    margin-top: 0;
}
.baseInfo-list-item>div:nth-child(1) {
    width: 120px;
    min-height: 32px;
    font-size: 12px;
    border: solid 1px  #dcdcdc;
    text-indent: 10px;
    color: rgb(0 0 0 / 90%);
    background-color: #ebf1f5;
    line-height: 32px;
}
.baseInfo-list-item>div:nth-child(2) {
    padding: 0 10px;
    max-width: 876px !important;
    min-height: 32px;
    font-size: 12px;
    border: solid 1px #dcdcdc;
    border-left: none;
    text-indent: 10px;
    color: rgb(0 0 0 / 90%);
    word-wrap: break-word !important;
    word-break: break-all !important;
    line-height: 32px;
    box-sizing: border-box;
}

</style>
