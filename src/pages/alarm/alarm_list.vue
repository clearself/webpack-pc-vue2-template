<template>
    <div class="list" style="overflow-y:hidden">
        <div class="ub w100 alarmm-wrapper">
            <LeftFold @getCurParams="getCurParams" @del="delCurSearch" :current-id="curSearchId" :list="searchList"></LeftFold>
            <div class="ub ub-ver ub-f1 right-wrapper">
                <div class="event-content ub w100" style="background:#fff;border: solid 1px #dadee8;border-radius: 4px;padding: 11px 10px">
                    <div class="ub ub-ver ub-f1">
                        <div class="w100 search-box">
                            <div class="search-more ub ub-as">
                                <div class="search-more ub ub-f1" :class="{'has-more': !isOpen }">
                                    <el-row class="w100" style="height: 48px;">
                                        <el-col  :span="6">
                                            <div class="mr-2">
                                                <el-form :model="get_params" label-position="right" :label-width="labelWidth">
                                                    <el-form-item label="事件时间：">
                                                        <CustomDate
                                                            :append-to-body="true"
                                                            :auto="true"
                                                            @getCustomTime="getCustomTime"
                                                            @getDateData="getDateData"
                                                            @actualTime="actualTimeData"
                                                            style="width:100%"
                                                            @timeUnit="timeUnitData"
                                                            :empty="false"
                                                            :chartTimeRange="customTimeRange"
                                                            ref="customDate"></CustomDate>
                                                    </el-form-item>
                                                </el-form>
                                            </div>
                                        </el-col>
                                        <el-col   :span="6">
                                            <div class="mr-2">
                                                <el-form :model="get_params" label-position="right" :label-width="labelWidth">
                                                    <el-form-item label="事件状态：">
                                                        <el-select
                                                            v-model="get_params.reportStatus"
                                                            placeholder="请选择"
                                                            filterable
                                                            style="width:100%"
                                                            multiple
                                                            collapse-tags
                                                            size="small">
                                                            <el-option v-for="(item, index) in alarmStates" :key="index" :label="item.text" :value="item.value">
                                                            </el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                </el-form>
                                            </div>
                                        </el-col>
                                        <el-col   :span="6">
                                            <div class="mr-2">
                                                <el-form :model="get_params" label-position="right" :label-width="labelWidth">
                                                    <el-form-item label="事件名称：">
                                                        <el-input placeholder="请输入" clearable v-model="get_params.reportName" size="small" style="width:100%">
                                                        </el-input>
                                                    </el-form-item>
                                                </el-form>
                                            </div>
                                        </el-col>
                                        <el-col   :span="6">
                                            <div class="mr-2">
                                                <el-form :model="get_params" label-position="right" :label-width="labelWidth">
                                                    <el-form-item label="事件等级：">
                                                        <el-select
                                                            v-model="get_params.reportLevel"
                                                            style="width:100%"
                                                            placeholder="请选择"
                                                            multiple
                                                            filterable
                                                            size="small"
                                                            collapse-tags
                                                            clearable>
                                                            <el-option v-for="(item, index) in levels" :key="index" :label="item.name" :value="item.value">
                                                            </el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                </el-form>
                                            </div>
                                        </el-col>
                                    </el-row>
                                    <el-row class="w100" style="height: 48px;">
                                        <el-col  :span="6">
                                            <div class="mr-2">
                                                <el-form :model="get_params" label-position="right" :label-width="labelWidth">
                                                    <el-form-item label="事件类型：">
                                                        <el-select size="small" v-model="get_params.reportType" multiple clearable placeholder="请选择" style="width:100%" collapse-tags>
                                                            <el-option v-for="(item) in typeList" :key="item.id" :label="item.name" :value="item.id">
                                                            </el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                </el-form>
                                            </div>
                                        </el-col>
                                        <el-col  :span="6">
                                            <div class="mr-2">
                                                <el-form :model="get_params" label-position="right" :label-width="labelWidth">
                                                    <el-form-item label="源IP：">
                                                        <el-input placeholder="请输入" clearable v-model="get_params.srcIp" size="small" style="width:100%">
                                                        </el-input>
                                                    </el-form-item>
                                                </el-form>
                                            </div>
                                        </el-col>
                                        <el-col  :span="6">
                                            <div class="mr-2">
                                                <el-form :model="get_params" label-position="right" :label-width="labelWidth">
                                                    <el-form-item label="源端口：">
                                                        <el-input placeholder="请输入" clearable v-model="get_params.srcPort" size="small" style="width:100%">
                                                        </el-input>
                                                    </el-form-item>
                                                </el-form>
                                            </div>
                                        </el-col>
                                        <el-col  :span="6">
                                            <div class="mr-2">
                                                <el-form :model="get_params" label-position="right" :label-width="labelWidth">
                                                    <el-form-item label="目的IP：">
                                                        <el-input placeholder="请输入" clearable v-model="get_params.desIp" size="small" style="width:100%">
                                                        </el-input>
                                                    </el-form-item>
                                                </el-form>
                                            </div>
                                        </el-col>
                                    </el-row>
                                    <el-row class="w100" style="height: 48px;">
                                        <el-col  :span="6">
                                            <div class="mr-2">
                                                <el-form :model="get_params" label-position="right" :label-width="labelWidth">
                                                    <el-form-item label="目的端口：">
                                                        <el-input placeholder="请输入" clearable v-model="get_params.desPort" size="small" style="width:100%">
                                                        </el-input>
                                                    </el-form-item>
                                                </el-form>
                                            </div>
                                        </el-col>
                                        <el-col  :span="6">
                                            <div class="mr-2">
                                                <el-form :model="get_params" label-position="right" :label-width="labelWidth">
                                                    <el-form-item label="攻击结果：">
                                                        <el-select filterable size="small" v-model="get_params.attackResult" multiple clearable placeholder="请选择" style="width:100%" collapse-tags>
                                                            <el-option v-for="(item) in attackResultList" :key="item.id" :label="item.name" :value="item.name">
                                                            </el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                </el-form>
                                            </div>
                                        </el-col>
                                        <el-col  :span="6">
                                            <div class="mr-2">
                                                <el-form :model="get_params" label-position="right" :label-width="labelWidth">
                                                    <el-form-item label="事件来源：">
                                                        <el-select size="small" v-model="get_params.reportFrom" clearable placeholder="请选择" style="width:100%" multiple collapse-tags>
                                                            <el-option v-for="(item) in reportFromList" :key="item.id" :label="item.name" :value="item.id">
                                                            </el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                </el-form>
                                            </div>
                                        </el-col>
                                        <el-col  :span="6">
                                            <div class="mr-2">
                                                <el-form :model="get_params" label-position="right" :label-width="labelWidth">
                                                    <el-form-item label="关联规则：">
                                                        <el-select filterable size="small" v-model="get_params.ruleIds" clearable placeholder="请选择" style="width:100%" multiple collapse-tags>
                                                            <el-option v-for="(item) in relevanceRuleList" :key="item.id" :label="item.name" :value="item.id">
                                                            </el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                </el-form>
                                            </div>
                                        </el-col>
                                    </el-row>
                                </div>
                                <div class="search-text" v-show="isOpen"  @click="isOpen=false">收 起<i style="margin-left: 3px;" class="el-icon-arrow-up"></i></div>
                                <div class="search-text" v-show="!isOpen " @click="isOpen=true">展 开<i style="margin-left: 3px;" class="el-icon-arrow-down"></i></div>
                            </div>
                        </div>
                    </div>
                    <div class="ub ub-pe" style="width:180px;margin-top: 4px">
                        <div class="iconfont icon-sousuotiaojianbaocun ub ub-ac ub-pc save-btn" @click="saveSearch"></div>
                        <Debounce :time='1500' :isDebounce="2">
                            <div class="ub ub-ac ub-pc reset-btn" @click="resetFun">重 置</div>
                        </Debounce>
                        <Debounce :time='1500' :isDebounce="2">
                            <el-button class="search" style="min-width: 60px;height:30px;padding: 8px 15px;" title="搜 索" @click.native="searchCheck" size="small" type="primary">搜 索</el-button>
                        </Debounce>
                    </div>
                </div>
                <div class="w100 list-container">
                    <div class="ub ub-pj list-tips ststistic-nav">
                        <div class="ub">
                            <div class="left-tongji">统计</div>
                            <div class="ub left-refresh">
                                <span>页面刷新:</span>
                                <Refresh @selectChange="selectChange" />
                            </div>
                        </div>
                        <div class="right-up" @click="isChartOpen=!isChartOpen"><span>{{isChartOpen?'收起':'展开'}}</span><i class="el-icon-arrow-up" :class="{'el-icon-arrow-down':!isChartOpen}"></i></div>
                    </div>
                    <div v-show="isChartOpen" class="chart-row" style="margin-bottom:10px;">
                        <div class="chart-left">
                            <div class="chart-box">
                                <div class="ub ub-pj ub-ac w100 chart-top" style="padding:0 10px;box-sizing: border-box;">
                                    <div class="title">事件等级统计</div>
                                </div>
                                <div class="chart-map">
                                    <!--  v-loading="load_loading" -->
                                    <div style="height:230px;" v-loading="load_loading" element-loading-background="transparent">
                                        <div v-if="load_no_data" class="ub ub-f1 ub-ac ub-pc" style="height:100%;color:rgb(144, 147, 153);font-size:14px;">
                                            暂无数据
                                        </div>
                                        <pie v-if="levelData.length>0" type="1" :chartData="levelData" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="chart-right">
                            <div class="chart-box">
                                <div class="ub ub-pj ub-ac w100 chart-top" style="padding:0 10px;box-sizing: border-box;">
                                    <div class="title">事件趋势统计</div>
                                </div>
                                <div class="chart-map">
                                    <!-- v-loading="load_loading1"  -->
                                    <div class="ub ub-f1" style="height:230px;" v-loading="load_loading1" element-loading-background="transparent">
                                        <div v-if="load_no_data1" class="ub ub-f1 ub-ac ub-pc" style="height:100%;color:rgb(144, 147, 153);font-size:14px;">
                                            暂无数据
                                        </div>
                                        <brokenLine v-if="load_data.length>0" :chartData="load_data" :sayTimes="sayTimes" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="w100 search-box">
                        <div class="ub w100 ub-pj mb-1 ub-ac">
                            <div class="list-tips">列表内容</div>
                            <div>
                                <el-button icon="el-icon-plus" @click="handleAlarm" size="small" type="primary" v-per="['alarm_event_add']">发起事件</el-button>
                                <el-button :loading="downLoading" icon="iconfont icon-daochu"  size="small" type="primary" @click="handleExport" v-per="['alarm_event_export']">导出内容</el-button>
                                <el-button style="margin-right: 10px;background:#00a870;color:#fff" icon="el-icon-sort" @click="changeAllState" size="small" v-per="['alarm_event_status']">状态变更</el-button>
                                <el-dropdown trigger="click" :hide-on-click="false" style="margin-right: 5px">
                                    <el-button icon="el-icon-edit-outline" size="small" style="background:#b500ff;color:#fff" v-per="['alarm_event_cf']">配置列</el-button>
                                    <el-dropdown-menu slot="dropdown" style="padding-left: 10px">
                                        <div class="left-tip"><i class="el-icon-info"></i><span>拖拽字段进行排序</span></div>
                                        <el-checkbox-group v-model="checkList" @change="changeHeader">
                                            <draggable class="w100" tag="div" v-model="checkListAll" v-bind="{scroll: true,animation: 150}" @end="onEnd">
                                                <transition-group>
                                                    <el-checkbox :label="element" v-for="element in checkListAll" :key="element"></el-checkbox>
                                                </transition-group>
                                            </draggable>

                                        </el-checkbox-group>
                                    </el-dropdown-menu>
                                </el-dropdown>
                                <el-button style="margin-left:5px" icon="el-icon-delete" size="small" type="danger" @click="judgeDelete" v-per="['alarm_event_del']">删除</el-button>
                            </div>
                        </div>
                    </div>
                    <div :style="{'height':tabHeight,'overflow-y':'auto'}">
                        <el-table
                            style="width:100%;"
                            ref="multipleTable1"
                            v-loading="loading"
                            class='bigTable fixedTable'
                            :data="tableData"
                            :row-class-name="tableRowClassName"
                            :row-style="{ height: '32px' }"
                            :header-row-style="{ height: '32px' }"
                            border
                            stripe
                            tooltip-effect="dark"
                            @selection-change="handleSelectionChange">
                            <el-table-column type="selection" width="30" align="center"></el-table-column>
                            <template v-for="(it, index) in checkList">
                                <el-table-column v-if="it === '事件ID'" :key="index" prop="id" label="事件ID" min-width="120">
                                </el-table-column>
                                <el-table-column
                                    v-if="it === '事件名称'"
                                    :key="index"
                                    prop="reportName"
                                    label="事件名称"
                                    min-width="220"
                                    show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <div>
                                            <el-popover
                                                placement="top"
                                                width="180"
                                                popper-class="desIp-popover-box"
                                                trigger="click">
                                                <div class="desIp-popover">
                                                    <div class="click-btn" @click="addSearch('reportName',scope.row.reportName)">
                                                        <i class="el-icon-plus"></i>
                                                        <span>事件名称 = {{scope.row.reportName}}</span>
                                                    </div>
                                                    <div >
                                                        <i
                                                            class="el-icon-document-copy"
                                                            v-clipboard:copy="scope.row.reportName"
                                                            v-clipboard:success="firstCopySuccess"
                                                            v-clipboard:error="firstCopyError"
                                                        ></i>
                                                        <span>复制</span>
                                                    </div>
                                                </div>
                                                <span slot="reference">{{scope.row.reportName}}</span>
                                            </el-popover>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column v-if="it === '事件等级'" :key="index" prop="reportLevel" label="事件等级" min-width="100" align="center" sortable>
                                    <template slot-scope="scope">
                                        <div>
                                            <el-popover
                                                placement="top"
                                                width="180"
                                                popper-class="desIp-popover-box"
                                                trigger="click">
                                                <div class="desIp-popover">
                                                    <div class="click-btn" @click="addSearch('reportLevel',scope.row.reportLevel)">
                                                        <i class="el-icon-plus"></i>
                                                        <span>事件等级 = {{scope.row.reportLevel | getLevel }}</span>
                                                    </div>
                                                    <div >
                                                        <i
                                                            class="el-icon-document-copy"
                                                            v-clipboard:copy="scope.row.reportLevel"
                                                            v-clipboard:success="firstCopySuccess"
                                                            v-clipboard:error="firstCopyError"
                                                        ></i>
                                                        <span>复制</span>
                                                    </div>
                                                </div>
                                                <div slot="reference">
                                                    <span v-if="scope.row.reportLevel == 0" style="color:#03864f">低</span>
                                                    <span v-if="scope.row.reportLevel == 1" style="color:#0052d9">中低</span>
                                                    <span v-if="scope.row.reportLevel == 2" style="color:#ddd000">中</span>
                                                    <span v-if="scope.row.reportLevel == 3" style="color:#e47700">中高</span>
                                                    <span v-if="scope.row.reportLevel == 4" style="color:#e47700">高</span>
                                                </div>
                                            </el-popover>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column v-if="it === '发起工单'"  label="发起工单" :key="index" min-width="120" align="center">
                                    <template slot-scope="scope">
                                        <div>
                                            <span style="color:#c1c1c1;" v-if="scope.row.isStart === 0">否</span>
                                            <span v-else>是</span>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column v-if="it === '事件类型'" :key="index" prop="reportTypeName" show-overflow-tooltip label="事件类型" min-width="160">
                                    <template slot-scope="scope">
                                        <div>
                                            <el-popover
                                                placement="top"
                                                width="180"
                                                popper-class="desIp-popover-box"
                                                trigger="click">
                                                <div class="desIp-popover">
                                                    <div class="click-btn" @click="addSearch('reportType',scope.row.reportType)">
                                                        <i class="el-icon-plus"></i>
                                                        <span>事件类型 = {{scope.row.reportTypeName }}</span>
                                                    </div>
                                                    <div >
                                                        <i
                                                            class="el-icon-document-copy"
                                                            v-clipboard:copy="scope.row.reportTypeName"
                                                            v-clipboard:success="firstCopySuccess"
                                                            v-clipboard:error="firstCopyError"
                                                        ></i>
                                                        <span>复制</span>
                                                    </div>
                                                </div>
                                                <span slot="reference">
                                                    {{  scope.row.reportTypeName }}
                                                </span>
                                            </el-popover>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column v-if="it === '受影响资产'" :key="index" prop="assetName" label="受影响资产" min-width="120" show-overflow-tooltip>
                                </el-table-column>
                                <!-- 事件来源 -->
                                <!-- :render-header="renderHeader" -->
                                <el-table-column v-if="it === '事件来源'" :key="index"  min-width="120" prop="alarm_from" label="事件来源">
                                    <template slot-scope="scope">
                                        <div>
                                            <el-popover
                                                placement="top"
                                                width="180"
                                                popper-class="desIp-popover-box"
                                                trigger="click">
                                                <div class="desIp-popover">
                                                    <div class="click-btn" @click="addSearch('reportFrom',scope.row.alarm_from)">
                                                        <i class="el-icon-plus"></i>
                                                        <span>事件来源 = {{scope.row.alarm_from |  getReportFrom}}</span>
                                                    </div>
                                                    <div >
                                                        <i
                                                            class="el-icon-document-copy"
                                                            v-clipboard:copy="scope.row.alarm_from"
                                                            v-clipboard:success="firstCopySuccess"
                                                            v-clipboard:error="firstCopyError"
                                                        ></i>
                                                        <span>复制</span>
                                                    </div>
                                                </div>
                                                <span slot="reference">
                                                    <span :class="{'report-from': scope.row.alarm_from==1}">
                                                        {{  scope.row.alarm_from | getReportFrom }}
                                                    </span>
                                                </span>
                                            </el-popover>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column v-if="it === '源IP'" :key="index" prop="srcIp" label="源IP" min-width="120" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <div>
                                            <el-popover
                                                placement="top"
                                                width="180"
                                                popper-class="desIp-popover-box"
                                                trigger="click">
                                                <div class="desIp-popover">
                                                    <div class="click-btn" @click="addSearch('srcIp',scope.row.srcIp)">
                                                        <i class="el-icon-plus"></i>
                                                        <span>源IP = {{scope.row.srcIp}}</span>
                                                    </div>
                                                    <div>
                                                        <i
                                                            class="el-icon-document-copy"
                                                            v-clipboard:copy="scope.row.srcIp"
                                                            v-clipboard:success="firstCopySuccess"
                                                            v-clipboard:error="firstCopyError"
                                                        ></i>
                                                        <span>复制</span>
                                                    </div>
                                                    <p
                                                        style="margin-top:10px"
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
                                                    style="cursor: pointer; text-decoration: underline; color: #0052d9;"
                                                    slot="reference"
                                                    v-html="scope.row.srcIp"
                                                ></p>
                                            </el-popover>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column v-if="it === '源端口'" :key="index" prop="srcPort" label="源端口" min-width="90" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <div>
                                            <el-popover
                                                placement="top"
                                                width="180"
                                                popper-class="desIp-popover-box"
                                                trigger="click">
                                                <div class="desIp-popover">
                                                    <div class="click-btn" @click="addSearch('srcPort',scope.row.srcPort)">
                                                        <i class="el-icon-plus"></i>
                                                        <span>源端口 = {{scope.row.srcPort}}</span>
                                                    </div>
                                                    <div >
                                                        <i
                                                            class="el-icon-document-copy"
                                                            v-clipboard:copy="scope.row.srcPort"
                                                            v-clipboard:success="firstCopySuccess"
                                                            v-clipboard:error="firstCopyError"
                                                        ></i>
                                                        <span>复制</span>
                                                    </div>
                                                </div>
                                                <span slot="reference">{{scope.row.srcPort}}</span>
                                            </el-popover>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column v-if="it === '目的IP'" :key="index" prop="desIp" label="目的IP" min-width="120" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <div>
                                            <el-popover
                                                placement="top"
                                                width="180"
                                                popper-class="desIp-popover-box"
                                                trigger="click">
                                                <div class="desIp-popover">
                                                    <div class="click-btn" @click="addSearch('desIp',scope.row.desIp)">
                                                        <i class="el-icon-plus"></i>
                                                        <span>目的IP = {{scope.row.desIp}}</span>
                                                    </div>
                                                    <div>
                                                        <i
                                                            class="el-icon-document-copy"
                                                            v-clipboard:copy="scope.row.desIp"
                                                            v-clipboard:success="firstCopySuccess"
                                                            v-clipboard:error="firstCopyError"
                                                        ></i>
                                                        <span>复制</span>
                                                    </div>
                                                    <p
                                                        style="margin-top:10px"
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
                                                    style="cursor: pointer; text-decoration: underline; color: #0052d9;"
                                                    slot="reference"
                                                    v-html="scope.row.desIp"
                                                ></p>
                                            </el-popover>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column v-if="it === '目的端口'" :key="index" prop="desPort" label="目的端口" min-width="90" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <div>
                                            <el-popover
                                                placement="top"
                                                width="180"
                                                popper-class="desIp-popover-box"
                                                trigger="click">
                                                <div class="desIp-popover">
                                                    <div class="click-btn" @click="addSearch('desPort',scope.row.desPort)">
                                                        <i class="el-icon-plus"></i>
                                                        <span>目的端口 = {{scope.row.desPort}}</span>
                                                    </div>
                                                    <div >
                                                        <i
                                                            class="el-icon-document-copy"
                                                            v-clipboard:copy="scope.row.desPort"
                                                            v-clipboard:success="firstCopySuccess"
                                                            v-clipboard:error="firstCopyError"
                                                        ></i>
                                                        <span>复制</span>
                                                    </div>
                                                </div>
                                                <span slot="reference">{{scope.row.desPort}}</span>
                                            </el-popover>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column v-if="it === '域名'" :key="index" prop="domainName" label="域名" min-width="120" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column
                                    v-if="it === '安全域'"
                                    :key="index"
                                    prop="securityDomain"
                                    label="安全域"
                                    min-width="120"
                                    show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column
                                    v-if="it === '归并量'"
                                    :key="index"
                                    prop="gbNum"
                                    label="归并量"
                                    sortable
                                    min-width="100"
                                    show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column
                                    v-if="it === '攻击结果'"
                                    :key="index"
                                    prop="attackResult"
                                    label="攻击结果"
                                    min-width="90"
                                    show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column
                                    v-if="it === '审核状态'"
                                    :key="index"
                                    prop="checkStatus"
                                    label="审核状态"
                                    min-width="100"
                                    align="center">
                                    <template slot-scope="scope">
                                        <div>
                                            <span v-if="scope.row.checkStatus == 1">是</span>
                                            <span v-if="scope.row.checkStatus == 0 && scope.row.checkStatus !== ''">否</span>
                                            <span v-if="scope.row.checkStatus === ''">--</span>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column v-if="it === '日志来源'" :key="index" prop="dt" label="日志来源" min-width="100" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column v-if="it === '事件时间'" :key="index" prop="createTime" label="事件时间" min-width="160" sortable>
                                </el-table-column>
                                <el-table-column v-if="it === '事件状态'" label="事件状态" :key="index" prop="reportStatus" min-width="100">
                                    <template slot-scope="scope">
                                        <div>
                                            <el-popover
                                                placement="top"
                                                width="180"
                                                popper-class="desIp-popover-box"
                                                trigger="click">
                                                <div class="desIp-popover">
                                                    <div class="click-btn"  @click="addSearch('reportStatus',scope.row.reportStatus)">
                                                        <i class="el-icon-plus"></i>
                                                        <span>事件状态 = {{scope.row.reportStatus | getreportStatus}}</span>
                                                    </div>
                                                    <div >
                                                        <i
                                                            class="el-icon-document-copy"
                                                            v-clipboard:copy="scope.row.desIp"
                                                            v-clipboard:success="firstCopySuccess"
                                                            v-clipboard:error="firstCopyError"
                                                        ></i>
                                                        <span>复制</span>
                                                    </div>
                                                </div>
                                                <div slot="reference">
                                                    <div v-if="scope.row.reportStatus == 0" class="ub ub-ac ub-pc alarm-state one">
                                                        <div>待确认</div>
                                                    </div>
                                                    <div v-if="scope.row.reportStatus == 1" class="ub ub-ac ub-pc alarm-state two">
                                                        <div>已确认</div>
                                                    </div>
                                                    <div v-if="scope.row.reportStatus == 2" class="ub ub-ac ub-pc alarm-state three">
                                                        <div>已处置</div>
                                                    </div>
                                                    <div v-if="scope.row.reportStatus == 3" class="ub ub-ac ub-pc alarm-state four">
                                                        <div>已驳回</div>
                                                    </div>
                                                </div>
                                            </el-popover>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column v-if="it === '是否封禁'" :key="index" prop="isBanned" label="是否封禁" min-width="100" align="center">
                                    <template slot-scope="scope">
                                        <div>
                                            <span v-if="scope.row.isBanned == 1">是</span>
                                            <span v-if="scope.row.isBanned == 0 && scope.row.isBanned !== ''">否</span>
                                            <span v-if="scope.row.isBanned === ''"></span>
                                        </div>
                                    </template>
                                </el-table-column>
                            </template>
                            <el-table-column label="操作" align="center" width="160" fixed="right" class-name="deepBg">
                                <template slot-scope="scope">
                                    <div>
                                        <el-button @click="handleSee(scope.row)" size="small" type="text" v-per="['alarm_event_look']">查看</el-button>
                                        <el-button :disabled="scope.row.reportFrom==1" size="small" type="text" @click="changeOption(2,scope.row)" v-per="['alarm_event_edit']">编辑</el-button>
                                        <el-dropdown trigger="click" :hide-on-click="true" style="margin: 0 10px">
                                            <el-button size="small" type="text">更多</el-button>
                                            <el-dropdown-menu slot="dropdown" style="width:90px">
                                                <el-dropdown-item command="a">
                                                    <el-button size="small" type="text" :disabled="scope.row.isStart==1" @click="changeOption(1,scope.row)" v-per="['alarm_event_order']">发起工单</el-button>
                                                </el-dropdown-item>
                                                <el-dropdown-item command="b">
                                                    <el-button size="small" type="text" @click="changeOption(3,scope.row)" v-per="['alarm_event_status']">状态变更</el-button>
                                                </el-dropdown-item>
                                            </el-dropdown-menu>
                                        </el-dropdown>
                                        <el-button :disabled="scope.row.isStart==1" size="small" type="text" @click="changeOption(4,scope.row)" v-per="['alarm_event_del']">删除</el-button>
                                    </div>
                                </template>
                            </el-table-column>

                        </el-table>
                    </div>
                    <div v-show="tableData.length>0" class="pagination pag mt-1" style="padding: 0px !important;text-align: right;margin-top:10px">
                        <el-pagination
                            background
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="get_params.page"
                            :page-sizes="[10, 20, 30, 50]"
                            :page-size="get_params.size"
                            layout="slot,sizes, prev, next"
                            prev-text="＜ 上一页"
                            next-text="下一页 ＞"></el-pagination>
                    </div>
                    <!-- <pagination :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size" @pagination="get_data" style="padding-top:10px" v-show="total_num>0"/> -->
                </div>
            </div>
        </div>

        <el-drawer :visible.sync="seeDialog" direction="rtl" :size="1200" :wrapperClosable="false" title="详情">
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
                                <el-button style="margin-right: 5px;background:#00a870;color:#fff"  icon="el-icon-sort" type="primary" title="状态变更"  @click="changeOption(3,currentRow)" size="small">状态变更</el-button>
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
                                <div v-if="bpmRecord.length>0" style="margin-top:20px;font-size: 12px;color: rgba(0,0,0,0.9);">流转记录</div>
                                <el-row v-if="bpmRecord.length>0" style='margin-bottom:20px;width:99%;' type="flex" justify="center">
                                    <el-form :model="passForm" class="w100" ref="passForm" :inline="true" style="color: rgba(0,0,0,.9)">
                                        <el-form-item class="record-item" label="" prop="" style="width:100%;">
                                            <div
                                                class="work-record"
                                                style="width:100%;padding-top:10px;box-sizing: border-box;">
                                                <el-timeline style="width:94%;margin-left: 88px;box-sizing: border-box;">
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
                                                                <h4 style="color: rgba(0,0,0,0.9);font-size: 16px;">{{activity.userName|NullStr}}<sub style="font-size:12px;color: rgba(0,0,0,0.9);opacity: 0.6;margin-left: 10px;vertical-align: bottom;font-weight:normal">{{activity.userRole|NullStr}}</sub></h4>
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
                                                            <div class="time-text-box-bottom"><i class="iconfont icon-jiediankaishishijian" style="color:#266fe8;font-size:14px"></i> <span>开始：{{activity.receiveTime|NullStr}}</span></div>
                                                            <div class="time-text-box-bottom"><i class="iconfont icon-jiediantingliushijian" style="color:#266fe8;font-size:14px"></i> <span>停留时长：<strong>{{activity.stayTime|NullStr}}</strong></span></div>
                                                            <div class="time-text-box-bottom"><i class="iconfont icon-jiediantingliushijian" style="color:#266fe8;font-size:14px"></i> <span>超时时长：<strong>{{activity.allTime|NullStr}}</strong></span></div>
                                                            <div class="time-text-box-bottom" style="color:#266fe8;font-size:14px"><i class="iconfont icon-chuliren"></i> <span>处理人：<strong class="users">{{activity.players|NullStr}}</strong></span></div>
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
                                        :row-style="{ height: '32px' }"
                                        :header-row-style="{ height: '32px' }"
                                        tooltip-effect="dark">
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
                                    <!-- <el-table-column prop="pid" label="父事件ID" width="140">
                                    </el-table-column> -->
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
                                            <el-button type="text" @click="detailReportData(scope.row)">详情</el-button>
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
        <el-dialog v-dialogDrag title="发起事件" :visible.sync="addDialog" width="980px" custom-class="attendance-dialog">
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
        <el-dialog v-dialogDrag title="编辑事件" :visible.sync="editDialog" width="980px" custom-class="attendance-dialog">
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
        <el-dialog v-dialogDrag title="事件状态变更" :visible.sync="stateDialog" width="700px" custom-class="common-dialog">
            <p style="margin-bottom:10px;color: rgba(0, 0, 0, 0.26);font-size:12px"><span class="iconfont icon-zhushi"></span>“状态变更后列表5秒后生效”</p>
            <el-form :model="stateForm" :rules="rules" ref="stateForm" label-position="top">
                <el-form-item style="width:100%;" label="事件状态：" :label-width="formLabelWidth" prop="reportStatus">
                    <el-select size="small" style="width:100%" v-model="stateForm.reportStatus" placeholder="请选择">
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
                <el-button @click="stateDialog=false" size="small">取消</el-button>
                <Debounce :time='1500' :isDebounce="2">
                    <el-button type="primary" @click.native="submitStateForm('stateForm')" size="small">确认</el-button>
                </Debounce>
            </span>
        </el-dialog>
        <el-dialog title="发起工单" :visible.sync="taskDialog" width="700px" custom-class="common-dialog">
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
                <el-button @click="taskDialog=false" size="small">取消</el-button>
                <Debounce :time='1500' :isDebounce="2">
                    <el-button  type="primary" @click.native="submitTaskForm('taskForm')" size="small" :loading="isSubmitTask">确认</el-button>
                </Debounce>
            </span>
        </el-dialog>
        <DeleteDialog
            :dialogVisible = deleteDialog
            @delete="handleDelete"
            @cancel="deleteDialog = false">
        </DeleteDialog>
        <DeleteDialog
            :dialogVisible = delDialog
            @delete="handleDel"
            @cancel="delDialog = false">
        </DeleteDialog>
        <el-dialog v-dialogDrag title="原始日志详情" :visible.sync="detailDialog" width="65%" custom-class="attendance-dialog">
            <div style="width:90%;margin: 0 auto;display: flex;flex-wrap: wrap">
                <div class="table-container" v-for="(val,key) in detailArr" :key="key">
                    <div class="table-left">{{ fieldToChinese(key) }}</div>
                    <div class="table-right" v-html="val"></div>
                </div>
            </div>
        </el-dialog>
        <el-dialog v-dialogDrag title="归并事件详情" :visible.sync="reportDetailDialog" width="65%" custom-class="attendance-dialog">
            <div style="width:90%;margin: 0 auto;display: flex;flex-wrap: wrap">
                <div class="table-container" v-for="(val,key) in detailReportArr" :key="key">
                    <div class="table-left">{{ fieldToChinese(key) }}</div>
                    <div class="table-right" v-html="val"></div>
                </div>
            </div>
        </el-dialog>
        <el-dialog title="保存搜索条件" width="700px" :visible.sync="saveSearchDialog" custom-class="common-dialog">
            <el-form :model="searchForm" ref="searchForm" :rules="searchRules" label-position="top">
                <el-form-item label="名称：" prop="name" label-width="80px">
                    <el-input size="mini" placeholder="请输入" v-model="searchForm.name"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="saveSearchDialog=false" size="small">取消</el-button>
                <el-button type="primary" @click="handleSaveSearch('searchForm')" size="small">确认</el-button>
            </div>
        </el-dialog>
        <Alarm :alarm-dialog="alarmDialog"  @addAlarmSucess="addAlarmSucess" ref="alarmRef"></Alarm>
        <AlarmDetail :alarmSeeDialog="alarmSeeDialog" :seeForm="alarmDetailData" ref="alarmDetail"></AlarmDetail>
    </div>
</template>

<script>
import AlarmDetail from '@/pages/alarm/new_alarm/components/AlarmDetail.vue'
import Refresh from '@/pages/alarm/new_alarm/components/refresh/index.vue'
import Alarm from '@/pages/alarm/new_alarm/components/alarm/index.vue'
import CustomDate from '@/pages/alarm/new_alarm/components/custom_date/index.vue'
import {
    search_alarms,
    save_header_list,

    // 新接口
    getAlarmList,
    getAlarmReportList,
    ip_searchAsset,
    addReport,
    editReport,
    get_header_list,
    delete_auto_alarm,
    get_alarm_type_auto,
    changeAlarmState,
    getChart,
    getAlarmTemp,
    add_workTask,
    get_workFlowInfo,
    getSearchData,
    delSearchData,
    saveSearchTask,
    getSearchResultData,
    getSearchRulesData,
    download,
    getMenace
} from '../../server/alarm/alarm.js'
import {
    get_time
} from '../../server/common.js'
import { get_threat_search } from '@/server/intelligence/api.js'
import LeftFold from '@/pages/alarm/new_alarm/components/leftFold.vue'
import draggable from 'vuedraggable'
import brokenLine from '@/pages/alarm/new_alarm/components/brokenLine.vue'
// import middleLine from './charts/line.vue'
import pie from './charts/pie.vue'
import VueUeditorWrap from '../../components/vue-ueditor-wrap.vue' // ES6 Module
import ueditorConfig from '../../mixins/ueditorConfig'
// import bpmnModeler from '../../package/detailXml'
import BasicInfo from './seeTabs/BasicInfo'
import WorkInfo from './seeTabs/WorkInfo'
import AssetInfo from './seeTabs/AssetInfo'
import Logs from './seeTabs/Logs'
import 'vant/lib/index.css'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {
    ImagePreview
} from 'vant'
export default {
    name: 'AlarmList',
    mixins: [ueditorConfig],
    components: {
        Refresh,
        Alarm,
        CustomDate,
        VueUeditorWrap,
        // middleLine,
        brokenLine,
        pie,
        draggable,
        // Treeselect,
        BasicInfo,
        WorkInfo,
        AssetInfo,
        Logs,
        LeftFold,
        AlarmDetail
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
            downLoading: false,
            isSubmitTask: false,
            tabHeight: 'calc(100vh - 585px)',
            alarmDetailData: {},
            alarmSeeDialog: false,
            isChartOpen: true,
            refreshVal: '',
            alarmDialog: false,
            searchForm: {
                name: ''
            },
            saveSearchDialog: false,
            customTimeRange: [],
            actualTime: '',
            timeUnit: '',
            dateData: '',
            dateMode: '',
            useDate: {},
            useIndex: '',
            relevanceRuleList: [],
            reportFromList: [
                {
                    name: '手动',
                    id: 0
                },
                {
                    name: '自动',
                    id: 1
                }
            ],
            attackResultList: [],
            labelWidth: '80px',
            searchList: [],
            curSearchId: '',
            alarmId: '',
            logType: '',
            timeDiffer: '',
            taskClick: false,
            statusVal: 0,
            currentRow: {},
            logIds: [],
            isOpen: false,
            assetsInfo: {
                // systemId: '',
                // deviceTypeId: '',
                // topology: '',
                // manufacturerName: '',
                // manufacturerId: '',
                // deviceTypeName: '',
                // updateTime: '',
                // subnetMask: '',
                // deviceName: '',
                // version: '',
                // domainId: '',
                // pcSystem: '',
                // pcSystemVersion: '',
                // safetyBoundary: '',
                // uniqueCode: '',
                // modelInfo: '',
                // createTime: '',
                // isBoundary: '',
                // zoneId: '',
                // id: '',
                // zoneName: '',
                // systemName: '',
                // ips: [],
                // systemUsers: []
            },
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
            fields: [],
            relationships: [],
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
            searchRules: {
                name: [{
                    required: true,
                    message: '请输入名称',
                    trigger: 'blur'
                }]
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
            optionType: [{
                label: '发起工单',
                value: 1,
                isActive: false
            }, {
                label: '编辑',
                value: 2,
                isActive: false
            }, {
                label: '状态变更',
                value: 3,
                isActive: false
            }, {
                label: '删除',
                value: 4,
                isActive: false
            }],
            checkListAll: [
                // '事件ID',
                // '事件名称',
                // '事件等级',
                // '事件类型',
                // '受影响资产',
                // '事件来源',
                // '源IP',
                // '源端口',
                // '目的IP',
                // '目的端口',
                // '域名',
                // '安全域',
                // '归并量',
                // '攻击结果',
                // '事件时间',
                // '事件状态',
                // // '是否溯源',
                // // '溯源状态',
                // '是否封禁',
                // '日志来源',
                // '审核状态',
                // '发起工单'
            ],
            startStates: [
                {
                    text: '默认',
                    value: ''
                },
                {
                    text: '否',
                    value: 0
                },
                {
                    text: '是',
                    value: 1
                }
            ],
            alarmStates: [
                {
                    text: '待确认',
                    value: 0
                },
                {
                    text: '已确认',
                    value: 1
                },
                {
                    text: '已处置',
                    value: 2
                }, {
                    text: '已驳回',
                    value: 3
                }
            ],
            alarmFroms: [{
                text: '默认',
                value: ''
            },
            {
                text: '自动',
                value: 1
            },
            {
                text: '手动',
                value: 0
            }
            ],
            pickerOptions: {
                shortcuts: [{
                    text: '1小时内',
                    onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    text: '1天内',
                    onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    text: '7天内',
                    onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    text: '本月',
                    onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setDate(1)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                        picker.$emit('pick', [start, end])
                    }
                }]
            },
            modelMap: {},

            typeList: [], // 事件类型
            levels: [{
                name: '高',
                value: 4
            }, {
                name: '中高',
                value: 3
            }, {
                name: '中',
                value: 2
            }, {
                name: '中低',
                value: 1
            }, {
                name: '低',
                value: 0
            }],
            domainNameList: [],
            checkList: [],
            headerTimer: null,
            load_loading: true,
            load_no_data: true,
            load_loading1: true,
            load_no_data1: true,
            levelData: [],
            load_data: [],
            // load_data: {
            //     date: [],
            //     data: []
            // },
            meargeData: [],

            activeName: 'first',
            seeDialog: false,
            alarmDisposalDialog: false,
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
            logList: [],
            detailArr: {},
            detailReportArr: {},
            esId: '',
            detailDialog: false,
            reportDetailDialog: false,
            msg: '',
            paramsArry: {
                page: 1,
                size: 5
            },
            meargeArry: {
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
            templateId: '',
            deleteDialog: false,
            ruleDialog: false,
            deleteId: '',
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
            valueConsistsOf: 'LEAF_PRIORITY',
            normalizer(node) {
                if (node.sub && !node.sub.length) {
                    delete node.sub
                }
                return {
                    id: node.codeNum,
                    label: node.name,
                    children: node.sub
                }
            },
            optionsCanSelect: [],
            options: [],
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
            isName: true,
            isTimeChected: false,
            timer: null,
            timestrId: '',
            timestrIdData: '',
            oldTime: ''
        }
    },
    computed: {
        msgTable() {
            let result = []
            if (this.msg) {
                try {
                    JSON.parse(this.msg).map(item => {
                        if (Array.isArray(item) && item.length) {
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
            console.log(result)
            return result.slice((this.paramsArry.page - 1) * this.paramsArry.size, this.paramsArry.page * this.paramsArry.size)
        }
    },
    watch: {
        isChartOpen(val) {
            if (val) {
                if (this.isOpen) {
                    this.tabHeight = 'calc(100vh - 689px)'
                } else {
                    this.tabHeight = 'calc(100vh - 585px)'
                }
            } else {
                if (this.isOpen) {
                    this.tabHeight = 'calc(100vh - 399px)'
                } else {
                    this.tabHeight = 'calc(100vh - 295px)'
                }
            }
        },
        isOpen(val) {
            if (val) {
                if (this.isChartOpen) {
                    this.tabHeight = 'calc(100vh - 689px)'
                } else {
                    this.tabHeight = 'calc(100vh - 399px)'
                }
            } else {
                if (this.isChartOpen) {
                    this.tabHeight = 'calc(100vh - 585px)'
                } else {
                    this.tabHeight = 'calc(100vh - 295px)'
                }
            }
        },
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
        saveSearchDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.searchForm.resetFields()
                    this.searchForm = {
                        name: ''
                    }
                }
            }
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
                    this.assetsInfo = {
                        // systemId: '',
                        // deviceTypeId: '',
                        // topology: '',
                        // manufacturerName: '',
                        // manufacturerId: '',
                        // deviceTypeName: '',
                        // updateTime: '',
                        // subnetMask: '',
                        // deviceName: '',
                        // version: '',
                        // domainId: '',
                        // pcSystem: '',
                        // pcSystemVersion: '',
                        // safetyBoundary: '',
                        // uniqueCode: '',
                        // modelInfo: '',
                        // createTime: '',
                        // isBoundary: '',
                        // zoneId: '',
                        // id: '',
                        // zoneName: '',
                        // systemName: '',
                        // ips: [],
                        // systemUsers: []
                    }
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
        getReportFrom(type) {
            if (type == 0) {
                return '手动'
            } else if (type == 1) {
                return '自动'
            }
        },
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
        getLevel(level) {
            if (level == 0) {
                return '低'
            } else if (level == 1) {
                return '中低'
            } else if (level == 2) {
                return '中'
            } else if (level == 3) {
                return '中高'
            } else if (level == 4) {
                return '高'
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
    async mounted() {
        if (this.$route.query.searchId) {
            this.get_params.id = this.$route.query.searchId
        } else {
            // let timeObj = await this.initStartTime()
            // let currentTime = timeObj.ms + (15 * 1000)
            // console.log('currentTime', currentTime)
            // let currentTime15 = currentTime - 7 * 24 * 60 * 60 * 1000
            // this.sayTimes = []
            // this.sayTimes[1] = this.$getTime(currentTime, '-', true)
            // this.sayTimes[0] = this.$getTime(currentTime15, '-', true)
            // console.log('currentTime', this.sayTimes)
        }
        this.$nextTick(() => {
            // this.initIndex()
            this.initSearchData()
            // 获取搜索结果列表
            this.initSearchResultData()
            // 获取关联规则列表
            this.initSearchRulesData()
            this.get_data()
            this.get_chart()
            this.getHeader()
            this.getAlarmType()
        })
    },
    beforeDestroy() {
        if (this.timer) {
            clearInterval(this.timer)
            this.timer = null
        }
    },
    methods: {
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex % 2) {
                return 'table-row2'
            } else {
                return 'table-row1'
            }
        },
        jumpAsset(value) {
            this.$setsessionStorage('currentPath', '/assets/assets_asset_info?ip=' + value)
            window.open(window.location.origin + '/#' + '/assets/assets_asset_info?ip=' + value)
        },
        jumpThreat(value) {
            console.log(value)
            let obj = {
                queryData: { value },
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
        actualTimeData(val) {
            this.actualTime = val
        },
        timeUnitData(val) {
            this.timeUnit = val
        },
        handleExport() {
            this.downLoading = true
            let ids = this.multipleSelection.map(item => {
                return item.id
            })
            this.setDate()
            let data = {
                queryData: {

                },
                paramsData: {
                    ids: ids,
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
                    ruleIds: this.get_params.ruleIds, // 规则集合
                    spare: this.translationHeader(this.checkList)
                }
            }
            download(data).then(res => {
                this.downLoading = false
                this.$message({
                    message: '下载成功',
                    type: 'success'
                })
            }).catch(error => {
                this.downLoading = false
                this.$message({
                    message: error,
                    type: 'error'
                })
                console.log('error', error)
            })
        },
        handleAlarm() {
            this.$refs.alarmRef.addForm.id = ''
            this.$refs.alarmRef.addForm.reportDesc = ''
            this.$refs.alarmRef.addForm.reportName = ''
            this.$refs.alarmRef.addForm.reportType = ''
            this.$refs.alarmRef.addForm.reportLevel = ''
            this.$refs.alarmRef.addForm.reportStatus = 0
            this.$refs.alarmRef.addForm.srcIp = ''
            this.$refs.alarmRef.addForm.srcPort = ''
            this.$refs.alarmRef.addForm.desIp = ''
            this.$refs.alarmRef.addForm.desPort = ''
            this.$refs.alarmRef.addForm.isStart = false
            this.alarmDialog = true
        },
        // 获取关联规则列表
        initSearchRulesData() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            getSearchRulesData(data).then(res => {
                console.log('获取搜索关联规则列表', res)
                if (res.length > 0) {
                    this.relevanceRuleList = res.map(item => {
                        let obj = {}
                        obj.id = item.id
                        obj.name = item.name
                        return obj
                    })
                }
            }).catch(error => {
                console.log('error', error)
            })
        },
        // 获取搜索结果列表
        initSearchResultData() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            getSearchResultData(data).then(res => {
                console.log('获取搜索结果列表', res)
                if (res.length > 0) {
                    this.attackResultList = res.map(item => {
                        let obj = {}
                        obj.id = item.id
                        obj.name = item.name
                        return obj
                    })
                }
            }).catch(error => {
                console.log('error', error)
            })
        },
        selectChange(val) {
            this.refreshVal = val
            if (this.refreshVal == 0) {
                clearInterval(this.timer)
                this.timer = null
            } else if (this.refreshVal == 1) {
                this.refreshData(60000)
            } else if (this.refreshVal == 2) {
                this.refreshData(5 * 60000)
            } else if (this.refreshVal == 3) {
                this.refreshData(15 * 60000)
            } else if (this.refreshVal == 4) {
                this.refreshData(30 * 60000)
            } else if (this.refreshVal == 5) {
                this.refreshData(60 * 60000)
            } else if (this.refreshVal == 6) {
                this.refreshData(2 * 60 * 60000)
            } else if (this.refreshVal == 7) {
                this.refreshData(12 * 60 * 60000)
            } else if (this.refreshVal == 8) {
                this.refreshData(24 * 60 * 60000)
            } else if (this.refreshVal.length > 0) {
                let timeData = this.refreshVal[0].actualTime
                let unitData = this.getTimeUnit(this.refreshVal[0].timeUnit)
                this.refreshData(timeData * unitData)
            }
            console.log('刷新', val)
        },
        getTimeUnit(val) {
            if (val == 0) {
                return 1000
            } else if (val == 1) {
                return 60000
            } else if (val == 2) {
                return 60 * 60000
            } else if (val == 3) {
                return 24 * 60 * 60000
            }
        },
        refreshData(val) {
            this.timer = setInterval(() => {
                this.get_params.page = 1
                this.get_chart()
                this.get_data()
            }, val)
        },
        // 获取搜索条件列表
        initSearchData() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            getSearchData(data).then(res => {
                console.log('获取搜索条件列表', res)
                if (res.length > 0) {
                    this.searchList = res.map(item => {
                        let obj = {}
                        obj.id = item.id
                        obj.title = item.name
                        obj.detail = item.detail
                        return obj
                    })
                } else {
                    this.searchList = []
                }
            }).catch(error => {
                console.log('error', error)
            })
        },
        addAlarmSucess() {
            setTimeout(() => {
                this.get_data()
            }, 1500)
        },
        handleSaveSearch(formName) {
            console.log('dateData-----------', this.dateData)
            // 时间
            let searchData = {
                dateData: '',
                dateMode: '',
                useDate: '',
                useIndex: '',
                actualTime: '',
                timeUnit: '',
                ...this.get_params
            }
            searchData.dateData = this.dateData
            searchData.dateMode = this.dateMode
            searchData.useDate = this.useDate
            searchData.useIndex = this.useIndex
            searchData.actualTime = this.actualTime
            searchData.timeUnit = this.timeUnit
            console.log('searchData-----------', searchData)
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = {
                        queryData: {},
                        paramsData: {
                            name: this.searchForm.name,
                            detail: JSON.stringify(searchData)
                        }
                    }
                    saveSearchTask(data).then(res => {
                        this.$message({
                            message: '保存成功！',
                            type: 'success'
                        })
                        setTimeout(() => {
                            this.initSearchData()
                        }, 500)
                        this.saveSearchDialog = false
                    }).catch(error => {
                        console.log('error', error)
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        saveSearch() {
            this.saveSearchDialog = true
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
                this.$refs.customDate.actualTime = this.actualTime
                this.$refs.customDate.timeUnit = this.timeUnit
                this.$refs.customDate.isSelectRelative = null
                this.$refs.customDate.isSelectRecently = null
                this.$refs.customDate.isSelectOther = null
                this.$refs.customDate.handleUse()
            }
            // else if (this.dateMode === 'custom') {
            //     this.sayTimes = this.customTimeRange
            //     this.$refs.customDate.isSelectRelative = null
            //     this.$refs.customDate.isSelectRecently = null
            //     this.$refs.customDate.isSelectOther = null
            // }
        },
        getDateData(date, mode, useDate, useIndex) {
            this.dateData = date
            this.dateMode = mode
            console.log('getDateData----dateData', this.dateData)
            this.useDate = useDate
            this.useIndex = useIndex
        },
        getCustomTime(val, isChartTime) {
            this.sayTimes = val
            console.log('时间', val)
        },
        firstCopySuccess(e) {
            console.log('copy arguments e:', e)
            this.$message({
                message: '复制成功!',
                type: 'success'
            })
        },
        firstCopyError(e) {
            console.log('copy arguments e:', e)
            this.$message({
                message: '复制失败!',
                type: 'warning'
            })
        },
        addSearch(type, val) {
            if (type === 'desIp') {
                this.get_params.desIp = val || ''
            } else if (type === 'reportName') {
                this.get_params.reportName = val || ''
            } else if (type === 'reportStatus') {
                this.get_params.reportStatus = [val] || []
            } else if (type === 'reportLevel') {
                this.get_params.reportLevel = [val] || []
            } else if (type === 'reportType') {
                this.get_params.reportType = [val] || []
            } else if (type === 'srcIp') {
                this.get_params.srcIp = val || ''
            } else if (type === 'srcPort') {
                this.get_params.srcPort = val || ''
            } else if (type === 'desPort') {
                this.get_params.desPort = val || ''
            } else if (type === 'reportFrom') {
                this.get_params.reportFrom = [val] || []
            }
        },
        resetFun() {
            this.get_params.reportStatus = []
            this.get_params.reportName = ''
            this.get_params.reportLevel = []
            this.get_params.reportType = []
            this.get_params.srcIp = ''
            this.get_params.srcPort = ''
            this.get_params.desIp = ''
            this.get_params.desPort = ''
            this.get_params.attackResult = []
            this.get_params.reportFrom = []
            this.get_params.ruleIds = []
            this.$refs.customDate.handleRecently({ value: 3, name: '最近1天' }, 3)
        },
        // 点击左侧获取当先信息
        getCurParams(val) {
            console.log('当前搜索条件信息', val)
            this.curSearchId = val.id
            this.get_params = JSON.parse(val.detail)
            if (JSON.parse(val.detail).dateMode == 'custom') {
                this.customTimeRange = JSON.parse(val.detail).dateData.split('~')
                this.dateMode = JSON.parse(val.detail).dateMode
                this.sayTimes = this.customTimeRange
                this.$refs.customDate.isSelectRelative = null
                this.$refs.customDate.isSelectRecently = null
                this.$refs.customDate.isSelectOther = null
                this.get_chart()
                this.get_data()
            } else if (JSON.parse(val.detail).dateMode == 'useTwo') {
                this.dateData = JSON.parse(val.detail).dateData
                this.dateMode = JSON.parse(val.detail).dateMode
                this.actualTime = JSON.parse(val.detail).actualTime
                this.timeUnit = JSON.parse(val.detail).timeUnit
                this.get_chart()
                this.get_data()
            } else {
                // 时间
                this.dateData = JSON.parse(val.detail).dateData ? JSON.parse(val.detail).dateData : '最近1天'
                this.dateMode = JSON.parse(val.detail).dateMode ? JSON.parse(val.detail).dateMode : 'noUse'
                this.useDate = JSON.parse(val.detail).useDate ? JSON.parse(val.detail).useDate : { value: 3, name: '最近1天' }
                this.useIndex = JSON.parse(val.detail).useIndex ? JSON.parse(val.detail).useIndex : 3
                this.get_chart()
                this.get_data()
            }
        },
        delCurSearch(val) {
            console.log('删除当前搜索条件信息', val)
            let data = {
                queryData: {},
                paramsData: {
                    id: val.id
                }
            }
            delSearchData(data).then(res => {
                console.log('删除搜索条件列表', res)
                this.$message({
                    message: '删除成功!',
                    type: 'success'
                })
                setTimeout(() => {
                    this.initSearchData()
                }, 500)
            }).catch(error => {
                console.log('error', error)
            })
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
        renderHeader(h, {
            column
        }) { // 下拉框选项
            let filters = [{
                text: '默认',
                value: ''
            },
            {
                text: '自动',
                value: 1
            },
            {
                text: '手动',
                value: 0
            }
            ]

            // 下拉框内容包裹在一个div里面
            return h(
                'div', {
                    style: {
                        height: 'auto'
                    }
                }, [
                    h(
                        'span', {
                            // div里面有一个文字提示：下拉框所属内容
                            style: {},
                            class: 'level-font-class'
                        },
                        '事件来源'
                    ),
                    h(
                        'el-select', {
                            // el-select实现下拉框
                            class: 'status-selsect iconfont icon-filter-fill',
                            style: {
                                width: '0px',
                                height: '0px',
                                color: '#00fffb'

                            },
                            on: {
                                input: value => {
                                    // 随着下拉框的不同，文字框里的内容在边
                                    this.statusVal = value
                                    this.shaixuan_alarmFroms(value)
                                }
                            },
                            props: {
                                size: 'mini',
                                value: this.statusVal // 文字框的内容取决于这个value，如果value不存在，会报错
                            }
                        }, [
                            // 下拉框里面填充选项，通过filters遍历map，为每一个选项赋值。
                            filters.map(item => {
                                return h('el-option', {
                                    props: {
                                        value: item.value,
                                        label: item.text
                                    }
                                })
                            })
                        ]
                    )
                ]
            )
        },
        look(item, index) {
            if (item.isOpen) {
                item.isOpen = false
            } else {
                item.isOpen = true
            }
            this.$forceUpdate()
        },
        selectTree(val) {
            console.log('this.get_params.dt', this.get_params.dt)
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
        changeFiled(item) {
            console.log(item)
            item.val = ''
        },
        deleteCon(and, index) {
            and.splice(index, 1)
        },
        addFun(and) {
            and.push({
                field: '',
                condition: '',
                val: ''
            })
        },
        getFieldType(item, index) {
            let field = item.field
            let selected = this.fields.filter(tag => tag.value === field)
            if (selected.length > 0) {
                if (selected[0].type === 'text') {
                    item.type = 'text'
                    return 'text'
                }
                if (selected[0].type === 'select') {
                    item.type = 'select'
                    item.item = this.$deepCopy(selected[0].item)
                    return 'select'
                }
            } else {
                item.type = 'text'
                return 'text'
            }
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
                            this.get_data()
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
        changeAllState() {
            if (this.multipleSelection.length === 0) {
                this.$message.warning('请选择要变更状态的事件')
            } else {
                this.isStateAll = true
                this.stateDialog = true
            }
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
                    editReport(data).then(res => {
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
        onEnd() {
            let arr = []
            this.checkListAll.map(item => {
                if (this.checkList.some(tag => tag === item)) {
                    arr.push(item)
                }
            })
            this.checkList = this.$deepCopy(arr)
            this.changeHeader()
        },
        changeHeader() {
            console.log(this.checkList)
            let vm = this
            clearTimeout(this.headerTimer)
            this.headerTimer = setTimeout(function() {
                vm.updateHeader()
            }, 3000)
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
        getHeader() {
            this.checkList = []
            let data = {
                queryData: {},
                paramsData: {
                    menuTag: '2'
                }
            }
            get_header_list(data).then(res => {
                console.log('1111111111111111111', res)
                if (res.allField && res.allField.length) {
                    this.checkListAll = res.allField
                }

                if (res.field && res.field.length) {
                    this.checkList = res.field
                }
            }).catch(err => {
                console.log('err' + err)
            })
        },
        updateHeader() {
            let data = {
                queryData: {},
                paramsData: {
                    menuTag: '2',
                    field: this.checkList,
                    spare: this.translationHeader(this.checkList),
                    allField: this.checkListAll
                }
            }
            save_header_list(data).then(res => {
                this.$message({
                    message: '修改列表头成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.getHeader()
                }, 1500)
            }).catch(err => {
                console.log('err' + err)
            })
        },
        translationHeader(arr) {
            let obj = {
                事件ID: 'id',
                事件名称: 'reportName',
                事件等级: 'reportLevel',
                事件类型: 'reportTypeName',
                受影响资产: 'asset',
                事件来源: 'reportFrom',
                源IP: 'srcIp',
                源端口: 'srcPort',
                目的IP: 'desIp',
                目的端口: 'desPort',
                域名: 'domainName',
                安全域: 'securityDomain',
                归并量: 'gbNum',
                攻击结果: 'attackResult',
                事件时间: 'createTime',
                事件状态: 'reportStatus',
                是否溯源: 'isTrace',
                溯源状态: 'isTraceEnd',
                是否封禁: 'isBanned',
                日志来源: 'dt',
                审核状态: 'checkStatus',
                发起工单: 'isStart'
            }
            let newArr = []
            arr.forEach(item => {
                if (obj[item]) {
                    newArr.push(obj[item])
                }
            })

            return newArr
        },
        getAlarmType() {
            this.typeList = []
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_alarm_type_auto(data).then(res => {
                console.log(res)
                let list = res
                if (list.length > 0) {
                    list.forEach(item => {
                        let obj = {}
                        obj.id = item.id
                        obj.name = item.name
                        this.typeList.push(obj)
                    })
                }
            }).catch(error => {
                console.log('error' + error)
            })
        },
        shaixuanstartstate(val) {
            this.get_params.isStart = val
            console.log(this.visible)
            this.get_data()
        },
        shaixuan(val) {
            console.log(val)
            this.get_params.reportStatus = val
            console.log(this.visible)
            this.get_data()
        },
        shaixuan_alarmFroms(val) {
            this.get_params.reportFrom = val
            this.get_data()
        },
        shaixuan_isBanned(e) {
            console.log(e)
            this.visible_banned = false
            this.get_params.isBanned = e.target.dataset.type
            this.get_data()
        },
        shaixuan_taskType(e) {
            console.log(e)
            this.get_params.taskType = e.target.dataset.type
            this.get_data()
        },
        shaixuan_checkStatus(e) {
            console.log(e)
            this.visible_status = false
            this.get_params.checkStatus = e.target.dataset.type
            this.get_data()
        },
        resetData(val) {
            if ((val + '' === '') || (val == null) || (val == undefined) || (val == 'undefined')) {
                return ''
            } else {
                if (typeof (val) === 'object') {
                    return val.join(',')
                } else {
                    return val
                }
            }
        },
        fromMap(reportFrom) {
            if (reportFrom == 0) {
                return '手动'
            } else if (reportFrom == 1) {
                return '自动'
            } else if (reportFrom == 2) {
                return '模型'
            }
        },
        typeMap(reportType) {
            if (reportType == 0) {
                return '漏洞攻击'
            } else if (reportType == 1) {
                return '暴力破解'
            } else if (reportType == 2) {
                return '钓鱼邮件'
            } else if (reportType == 3) {
                return '拒绝服务'
            } else if (reportType == 4) {
                return '木马后门'
            } else if (reportType == 5) {
                return '数据窃取'
            } else if (reportType == 6) {
                return '异常登录'
            }
        },
        findRule(id) {
            if (!id) {
                this.$message.warning('无法查询对应规则')
                return
            }
            this.$router.push({
                path: '/rule/cep_show',
                query: {
                    id: id
                }
            })
        },

        // downData() {
        //     let beginDate = ''
        //     let endDate = ''
        //     beginDate = this.sayTimes === null ? '' : this.sayTimes[0]
        //     endDate = this.sayTimes === null ? '' : this.sayTimes[1]
        //     window.location.href = 'api/manage/autoSafeReport/export?reportName=' + this.resetData(this.get_params.reportName) +
        //                 '&reportType=' + this.resetData(this.get_params.reportType) + '&reportLevel=' + this.resetData(this.get_params.reportLevel) +
        //                 '&beginDate=' + this.resetData(beginDate) + '&endDate=' + this.resetData(endDate)
        // },
        get_chart() {
            this.setDate()
            // let uid = this.timestrId = new Date().getTime()
            this.load_loading = true
            this.load_no_data = true
            this.load_loading1 = true
            this.load_no_data1 = true
            this.levelData = []
            this.load_data = []
            // this.load_data = {
            //     date: [],
            //     data: []
            // }
            let data = {
                queryData: {},
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
            getChart(data).then(res => {
                // if (this.timestrId != uid) {
                //     return
                // }
                console.log('getChart', res)
                this.load_loading = false
                this.load_loading1 = false
                let list = res
                if (list.pie.length > 0) {
                    this.load_no_data = false
                    list.pie.forEach((item, index) => {
                        let level = {}
                        level.value = item.num
                        level.name = item.name
                        this.levelData.push(level)
                    })
                }
                if (list.line.length > 0) {
                    this.load_no_data1 = false
                    list.line.forEach((item, index) => {
                        let level = {}
                        level.value = item.num
                        level.name = item.time
                        this.load_data.push(level)
                    })
                }

                // this.load_data = [
                //     {
                //         name: '2022-02',
                //         value: 123
                //     }, {
                //         name: '2022-03',
                //         value: 153
                //     }, {
                //         name: '2022-04',
                //         value: 173
                //     }, {
                //         name: '2022-05',
                //         value: 183
                //     }, {
                //         name: '2022-06',
                //         value: 153
                //     }, {
                //         name: '2022-07',
                //         value: 123
                //     }
                // ]
            }).catch(error => {
                this.load_loading = false
                this.load_no_data = false
                console.log('error' + error)
            })
        },
        dateFormat(row, column, cellValue, index) {
            if (!row.createTime) {
                return ''
            }
            console.log(row.createTime)
            var date = new Date(row.createTime) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
            console.log(date)
            var Y = date.getFullYear() + '-'
            var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
            var D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' '
            var h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':'
            var m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':'
            var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
            return Y + M + D + h + m + s
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
        detailData(row) {
            console.log(row)
            this.detailArr = row
            if (this.detailArr.messaggioOriginale) {
                this.detailArr.messaggioOriginale = this.detailArr.messaggioOriginale.replace(/##/g, '"')
            }
            this.detailDialog = true
        },
        async detailReportData(row) {
            this.$refs.alarmDetail.alarmId = row.id
            this.$refs.alarmDetail.activeName = 'first'
            this.alarmDetailData = row
            if (this.alarmDetailData.srcIp) {
                try {
                    let srcIpIsSpite = await getMenace({
                        queryData: {
                            value: row.srcIp
                        }
                    })
                    console.log(srcIpIsSpite)
                    this.alarmDetailData.srcIpIsSpite = srcIpIsSpite
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
                    this.alarmDetailData.desIpIsSpite = desIpIsSpite
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

            // this.get_report_data()
        },
        handleDel(row) {
            let data = {
                queryData: {},
                paramsData: {
                    ids: [this.delId]
                }
            }
            delete_auto_alarm(data).then(res => {
                this.delDialog = false
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(error => {
                this.delDialog = false
                console.log(error + 'error')
            })
        },
        judgeDelete() {
            if (this.multipleSelection.length === 0) {
                this.$message.warning('请选择要删除事件')
            } else {
                // if (this.multipleSelection.some(tag => tag.reportFrom == 1 || tag.reportStatus != 0 || tag.isStart == 1)) {
                //     this.$message.warning('仅手动告警且事件状态为待确认、且未发起工单的可删除')
                //     return
                // }
                this.deleteDialog = true
            }
        },
        handleDelete() {
            let ids = this.multipleSelection.map(item => {
                return item.id
            })
            console.log(ids)
            let data = {
                queryData: {},
                paramsData: {
                    ids: ids
                }
            }
            delete_auto_alarm(data).then(res => {
                this.deleteDialog = false
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(error => {
                this.deleteDialog = false
                console.log(error + 'error')
            })
        },
        findMsg(data) {
            this.meargeData = []
            search_alarms(data).then(res => {
                console.log(res)
                if (res.length) {
                    this.meargeData = res
                }
            }).catch(err => {
                console.log(err + 'err')
            })
        },
        selectAll() {
            this.alarmDisposalForm.userIdList = []
            if (this.checked) {
                this.assignList.map(item => {
                    this.alarmDisposalForm.userIdList.push(item.id)
                })
            } else {
                this.alarmDisposalForm.userIdList = []
            }
        },
        async handleSee(row) {
            this.alarmId = row.id
            this.logType = row.logType
            this.timeDiffer = row.createTime
            console.log('see', row)
            this.$set(this, 'currentRow', row)
            this.activeName = 'first'
            this.seeForm = row
            if (this.seeForm.srcIp) {
                try {
                    let srcIpIsSpite = await getMenace({
                        queryData: {
                            value: row.srcIp
                        }
                    })
                    console.log(srcIpIsSpite)
                    this.seeForm.srcIpIsSpite = srcIpIsSpite
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
                    // console.log(desIpIsSpite)
                    this.seeForm.desIpIsSpite = desIpIsSpite
                } catch (e) {
                    console.log(e)
                }
            }
            this.alarmDisposalForm.id = row.id
            this.alarmDisposalForm.desIp = row.desIp ? row.desIp : ''
            this.alarmDisposalForm.reportFrom = row.reportFrom
            this.msg = row.msg
            if (row.msg) {
                console.log('msgmsg', JSON.parse(row.msg))
                let msgData = JSON.parse(row.msg)
                if (msgData.length > 0) this.logIds = [...new Set(msgData.map(item => item.id))]
            } else {
                this.logIds = []
            }
            // this.$nextTick(() => )
            this.seeDialog = true
            console.log('this.logIds', this.logIds)

            this.getWorkFlow(row.id)

            this.report_params.id = row.id
            if (row.desIp) {
                this.getAssetsInfo(row.desIp)
            }

            this.get_report_data()
        },
        handleJumpLog(row) {
            let msg = []
            try {
                if (row.msg) {
                    msg = JSON.parse(row.msg)
                }
            } catch (err) {
                console.log(err)
            }
            let arr = []
            if (Array.isArray(msg)) {
                msg.forEach(it => {
                    if (it.logId) {
                        arr.push(it.logId)
                    }
                })
            }
            console.log({ msg, arr })
            setTimeout(() => {
                this.$router.push({
                    name: 'expert',
                    params: {
                        logId: arr
                    }
                })
            }, 500)
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
        // changeElement({ id, name }) {
        //     console.log(id, name)
        //     this.getElementInfo()
        // },
        // getElementInfo() {
        //     let data = {
        //         queryData: {},
        //         paramsData: {
        //             workOrderId: this.workFlowInfo.field.workOrderId
        //         }
        //     }
        //     get_ElementInfo(data).then(res => {
        //         console.log('节点详情', res)
        //         if (JSON.stringify(res) === '{}' || !res) {
        //             return
        //         }
        //         let arr = res.records
        //         // this.passForm.name = name
        //         // this.passForm.isPass = res.isPass
        //         this.taskInfo = res.attr
        //         this.bpmRecord = arr.map((item, index) => {
        //             item.size = 'large'
        //             item.isOpen = true
        //             item.color = 'rgba(0,0,0,1)'
        //             item.icon = index === 0 ? 'el-icon-circle-check' : 'iconfont icon-circle'
        //             item.dealContent = JSON.parse(item.dealContent)
        //             return item
        //         })
        //     })
        // },

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
        indexMethod_report(index) {
            return (this.report_params.page - 1) * this.report_params.size + index + 1
        },
        searchCheck() {
            this.get_params.page = 1
            console.log('this.get_params22222222', this.get_params)
            setTimeout(() => {
                this.get_data()
                this.get_chart()
            }, 100)
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
                this.total_num = res.total
                /* 动态设置总页数*/
                // if (this.get_params.page < 4 && total > 7 * this.get_params.size) {
                //     this.total_num = 7 * this.get_params.size
                // } else if (this.get_params.page >= 4 && (total > (this.get_params.page + 3) * this.get_params.size)) {
                //     this.total_num = (this.get_params.page + 3) * this.get_params.size
                // } else {
                //     this.total_num = res.total
                // }
                let list = res.records
                if (list.length > 0) {
                    list.forEach(item => {
                        let obj = {}
                        obj.id = item.id
                        obj.count = item.count ? item.count : ''
                        obj.assetName = item.assetName
                        obj.alarm_from = item.reportFrom
                        obj.reportFrom = item.reportFrom
                        obj.reportName = item.reportName
                        obj.reportDesc = item.reportDesc
                        obj.createTime = item.createTime
                        obj.reportType = `${item.reportType}`
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
        handleDisposal(row) {
            this.alarmDisposalDialog = true
            this.alarmDisposalForm.id = row.id
            this.alarmDisposalForm.desIp = row.desIp ? row.desIp : ''
            this.alarmDisposalForm.reportFrom = row.reportFrom
            console.log(this.alarmDisposalForm.reportFrom)
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
        },
        handleSelectionChange(val) {
            console.log(val)
            this.multipleSelection = val
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
    .fixedTable{
        ::-webkit-scrollbar {
            width: 20px;          /* 纵向滚动条 宽度 */
            height: 5px;         /* 横向滚动条 高度 */
            border-radius: 10px;  /* 整体 圆角 */
        }
    }
    .list-tip{
        height: 24px;
        line-height: 24px;
        font-size: 14px;
        color: #1c1c1c;
        position: relative;
    }
    .alarm-state{
        width:80px;
        height:18px;
        padding:2px 5px;
        border-radius: 11px;
        &.one{
            background-color: #fde6d8;
            color:#de7400;
        }
        &.two{
            background-color: #ccf6e4;
            color:#03864f;
        }
        &.three{
            background-color: #d5e5fa;
            color:#0052d9;
        }
        &.four{
            background-color: #fad7dd;
            color:#aa0202;
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
            font-size:12px;
        }
    }
    .click-btn:hover {
        // background: #0d4873;
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
            overflow-y: hidden;
        }
    }
     .chart-top {
        /* position: absolute;
        left: 0;
        top: 0; */
        height: 30px;
        .title {
            // color: #fff;
            font-size: 12px;
            /*font-weight: bold;*/
            // text-shadow: 0px 0px 6px #00cffb, 0px 0px 6px #00cffb;
        }
    }
    .record-item ::v-deep .el-form-item__content{
        width: 90%!important;
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
            color: rgba(0,0,0,.9);
            margin-right: 5px;
        }

        >span {
            vertical-align: middle;
            font-size: 10px;
            color: rgba(0,0,0,.9);
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
        // border: 1px solid $zero;
        // background: rgba($zero, .2);
        color: $zero;
        font-size: 12px;
        border-radius: 3px;
        line-height: 1;
        padding: 2px 10px;
        margin: 0 5px;

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
    .domain-add {
        line-height: 1;
        position: relative;
        padding: 0 20px;
        color: #1cd7fa;

        .el-button {
            position: absolute;
            right: 20px;
            top: 0;
            padding: 0;
            color: #1cd7fa;
        }
    }

    .domain-list {
        background: rgba(0, 0, 0, .3);
        margin: 3px 0 20px;
        padding: 20px 0 1px;

        .list-tit {
            width: 100px;
            text-align: right;
        }

        .ub {
            margin-bottom: 20px;
        }

        .list-btn {
            padding-left: 20px;

            .el-button {
                color: #F56C6C;
            }
        }
    }

    .el-select ::v-deep .el-tag {
        background-color: transparent;
        // border-color: #1bd7fa;
        // color: #1bd7fa;
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
        // color: #fff;
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
        .el-select{
            ::v-deep .el-input{
                // height:32px !important;
            }
        }
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
                    height: 3px;
                    line-height: 32px;
                }
            }
            & ::v-deep .el-form-item {
                margin-bottom: 16px !important;
            }
        }
        .search-text {
            display: block;
            width: 80px;
            color:rgba(0,0,0,0.4);
            cursor: pointer;
            font-size:12px;
            height: 30px;
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
        font-size: 12px;
        line-height: 15px;
        letter-spacing: 1px;
        color: rgba(0,0,0,0.4);
        border-radius: 5px;
        margin-right: 10px;
        cursor: pointer;
        box-sizing: border-box;
        background-color: #ffffff;
        border-radius: 4px;
        border: solid 1px #dcdcdc;
    }
    .save-btn {
        width: 30px;
        height: 30px;
        font-size: 12px;
        line-height: 15px;
        letter-spacing: 1px;
        color: rgba(0,0,0,.4);
        border-radius: 5px;
        margin-right: 10px;
        cursor: pointer;
        box-sizing: border-box;
        background-color: #ffffff;
        border-radius: 4px;
        border: solid 1px #dcdcdc;
    }

    .chart-row {
        position: relative;
        padding-left: 380px;

        .chart-left {
            position: absolute;
            left: 0;
            top: 0;
            width: 368px;
        }
    }

    .chart-box {
        position: relative;
        height: 280px;
        background:rgba(56,125,238,0.05);
        border-radius: 6px;
        .chart-title {
            margin: 20px 0 20px 20px;
        }
        .title{
            color:rgba(0,0,0,0.9);
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
        // background-color: rgba(28, 215, 250, 0.2);
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

    .el-dropdown-menu{
        width:240px;
    }

    .el-dropdown-menu ::v-deep .el-checkbox__label {
        color: rgba(0,0,0,.9);
        width: 72px;
        box-sizing: border-box;
        font-size:12px;
    }
    .el-dropdown-menu ::v-deep .el-checkbox__label:hover {
        color: #0052d9;
        width: 72px;
        box-sizing: border-box;
    }
    .el-dropdown-menu ::v-deep .el-checkbox__label:active {
        color: #0052d9;
        width: 72px;
        box-sizing: border-box;
    }

    .el-dropdown-menu ::v-deep .el-checkbox {
        margin-right: 22px;
    }

    // .el-dropdown-menu ::v-deep .el-checkbox__input.is-checked+.el-checkbox__label {
    //     color: rgba(0,0,0,.9);
    // }
    .el-dropdown-menu ::v-deep .el-checkbox__input.is-checked+.el-checkbox__label {
        color: #0052d9;
    }

    // .el-dropdown-menu ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner::after {
    //     border-color: rgba(0,0,0,.9);
    // }

    // .el-dropdown-menu ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner,
    // .el-dropdown-menu ::v-deep .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    //     background-color: transparent;
    //     border-color: #0052d9;
    // }
    // .el-dropdown-menu ::v-deep .el-checkbox__input.is-indeterminate .el-checkbox__inner:hover {
    //     background-color: #0052d9;
    //     border-color: #0052d9;
    // }

    // .el-dropdown-menu ::v-deep .el-checkbox__input.is-disabled .el-checkbox__inner,
    // .el-dropdown-menu ::v-deep .el-checkbox__inner {
    //     background-color: transparent;
    //     border-color: #dcdcdc;
    // }
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
        text-align: center;
        line-height: 26px;
        cursor: pointer;
        color: #387dee;
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
        font-size: 20px;
    }
    .event ::v-deep .el-timeline-item__icon.icon-circle {
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

    .time-text-box-bottom {
        margin-right: 40px;
        >i {
            font-size: 10px;
            color: #999;
        }
        >span {
            font-size: 10px;
            color: #999;
        }
        strong {
            font-size: 10px;
            color: #0052d9;
            font-weight: normal;
        }
        strong.users {
            color: #0052d9;
        }
    }
    .report-message {
        border: 1px solid rgba(28,215,250,.5);
        background-color: #031e31;
        border-radius: 4px;
        height: 100%;
        padding: 20px;
        box-sizing: border-box;

        .message-item {
            .message-title {
                border: 1px solid rgba(28,215,250,.6);
                background-color: #00466d;
                box-shadow: 0 0 6px rgba(0, 186, 255, 0.73) inset;
                border-radius: 4px 4px 0 0;
                font-size: 14px;
                font-weight: bold;
                height: 34px;
                line-height: 34px;
                padding-left: 10px;
                color: #fff;
            }
            .message-body {
                height: 100px;
                padding: 10px;
                font-size: 12px;
                color: #fff;
                background-color: #033254;
                border-radius: 0px 0px 4px 4px;
                border: solid 1px #1a5c92;
                box-shadow: 0 0 2px rgba(0, 186, 255, 0.73) inset;
                word-wrap: break-word;
            }
        }
    }
.ststistic-nav{
    margin-bottom:10px;
    padding-right:5px;
    box-sizing: border-box;
    border-radius: 4px;
    background-color: rgba(56, 125, 238, 0.1);
    .left-tongji{
        span{
            font-size: 13px;
            color: #fff;
        }
    }
    .left-refresh {
        margin-left: 20px;
        font-size: 12px;
    }
    .right-up{
        cursor: pointer;
        span{
            font-size: 12px;
            color: #0052d9;
        }
        i{
            font-size: 14px;
            margin-right:3px;
            color: #0052d9;
        }
    }
}

.desIp-popover{
    i{
        font-size:12px;
        margin-right:10px;
        cursor: pointer;
        color: #0052d9;
        &:hover{
            opacity:0.8;
        }
    }
    span{
        font-size:12px;
        color: rgba(0,0,0,.9);
    }
    >div:nth-child(1){
        margin-bottom:10px;
    }
}
</style>
