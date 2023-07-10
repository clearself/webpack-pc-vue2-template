<template>
    <div class="event event-wrapper attendance-list expert" style="overflow:hidden !important">
        <div class="ub w100" style="box-sizing: border-box;padding-top:20px;">
            <div class="w100">
                <div class="ub w100">
                    <div class="ub ub-ver ub-f1">
                        <div class="w100 search-box">
                            <div class="search-more ub ub-as">
                                <div class="search-more ub ub-f1" :class="{'has-more': !isOpen }">
                                    <el-row class="w100">
                                        <el-col :span="6">
                                            <div class="ub ub-ac">
                                                <el-form :model="get_params" label-position="right" :label-width="labelWidth">
                                                    <el-form-item label="数据分类:" style="">
                                                        <treeselect
                                                            class="treeselect"
                                                            style="width:100%;margin-top: 3px"
                                                            :options="dataTree"
                                                            :normalizer="normalizer"
                                                            noChildrenText="当前分支无子节点"
                                                            noOptionsText="无可用选项"
                                                            placeholder="请选择资产类型"
                                                            v-model="get_params.dataType"
                                                            loadingText="下拉框无匹配项"
                                                            :appendToBody="true"
                                                            :clearable="false"
                                                            @select="treeChange"
                                                        />
                                                    </el-form-item>
                                                </el-form>
                                            </div>
                                        </el-col>
                                        <el-col :span="6">
                                            <div>
                                                <el-form :model="get_params" label-position="right" :label-width="labelWidth">
                                                    <el-form-item label="发生时间:">
                                                        <CustomDate :append-to-body="appendToBody" :chart-time-range="chartTimeRange" @getCustomTime="getCustomTime" @getDateData="getDateData" :auto="true" @useing="customDateUse" :current-type="1" :empty="false" ref="customDate"></CustomDate>
                                                    </el-form-item>
                                                </el-form>
                                            </div>
                                        </el-col>
                                        <!--topId === 1, 安全设备日志-->
                                        <el-col v-if="this.get_params.topId === '1' && searchType === 'normal'" :span="6">
                                            <div>
                                                <el-form :model="safeLogForm" label-position="right" :label-width="labelWidth">
                                                    <el-form-item label="事件类型:">
                                                        <el-input
                                                            placeholder="请输入"
                                                            style="width: 100%"
                                                            clearable
                                                            v-model.trim="safeLogForm.attackType"
                                                            size="small">
                                                        </el-input>
                                                    </el-form-item>
                                                </el-form>
                                            </div>
                                        </el-col>
                                        <el-col v-if="this.get_params.topId === '1' && searchType === 'normal'" :span="6">
                                            <div>
                                                <el-form :model="safeLogForm" label-position="right" :label-width="labelWidth">
                                                    <el-form-item label="事件名称:">
                                                        <el-input
                                                            placeholder="请输入"
                                                            clearable
                                                            v-model.trim="safeLogForm.subject"
                                                            size="small">
                                                        </el-input>
                                                    </el-form-item>
                                                </el-form>
                                            </div>
                                        </el-col>

                                        <!--topId === 2, 主机日志-->
                                        <el-col v-if="this.get_params.topId === '2' && searchType === 'normal'" :span="6">
                                            <div>
                                                <el-form :model="hostLogForm" label-position="right" :label-width="labelWidth">
                                                    <el-form-item label="事件名称:">
                                                        <el-input
                                                            placeholder="请输入"
                                                            clearable
                                                            v-model.trim="hostLogForm.subject"
                                                            size="small">
                                                        </el-input>
                                                    </el-form-item>
                                                </el-form>
                                            </div>
                                        </el-col>
                                        <el-col v-if="this.get_params.topId === '2' && searchType === 'normal'" :span="6">
                                            <el-form :model="hostLogForm" label-position="right" :label-width="labelWidth">
                                                <el-form-item label="主机名:">
                                                    <el-input
                                                        placeholder="请输入"
                                                        clearable
                                                        v-model.trim="hostLogForm.alternateField6"
                                                        size="small">
                                                    </el-input>
                                                </el-form-item>
                                            </el-form>
                                        </el-col>

                                        <!--topId === 3, 流日志-->
                                        <el-col v-if="this.get_params.topId === '3' && searchType === 'normal'" :span="6">
                                            <div>
                                                <el-form :model="flowLogForm" label-position="right" :label-width="labelWidth">
                                                    <el-form-item label="源IP:">
                                                        <el-input
                                                            placeholder="请输入"
                                                            clearable
                                                            v-model.trim="flowLogForm.srcIp"
                                                            size="small">
                                                        </el-input>
                                                    </el-form-item>
                                                </el-form>
                                            </div>
                                        </el-col>
                                        <el-col v-if="this.get_params.topId === '3' && searchType === 'normal'" :span="6">
                                            <div>
                                                <el-form :model="flowLogForm" label-position="right" :label-width="labelWidth">
                                                    <el-form-item label="源端口:">
                                                        <el-input
                                                            placeholder="请输入"
                                                            clearable
                                                            v-model.trim="flowLogForm.srcPort"
                                                            size="small">
                                                        </el-input>
                                                    </el-form-item>
                                                </el-form>
                                            </div>
                                        </el-col>

                                        <!--topId === 4, 应用日志-->
                                        <el-col v-if="this.get_params.topId === '4' && searchType === 'normal'" :span="6">
                                            <div>
                                                <el-form :model="applicationLogForm" label-position="right" :label-width="labelWidth">
                                                    <el-form-item label="事件级别:">
                                                        <el-input
                                                            placeholder="请输入"
                                                            clearable
                                                            v-model.trim="applicationLogForm.level"
                                                            size="small">
                                                        </el-input>
                                                    </el-form-item>
                                                </el-form>
                                            </div>
                                        </el-col>
                                        <el-col v-if="this.get_params.topId === '4' && searchType === 'normal'" :span="6">
                                            <div>
                                                <el-form :model="applicationLogForm" label-position="right" :label-width="labelWidth">
                                                    <el-form-item label="源IP:">
                                                        <el-input
                                                            placeholder="请输入"
                                                            clearable
                                                            v-model.trim="applicationLogForm.srcIp"
                                                            size="small">
                                                        </el-input>
                                                    </el-form-item>
                                                </el-form>
                                            </div>
                                        </el-col>
                                    </el-row>

                                    <template  v-if="searchType === 'normal'">
                                        <!--topId === 1, 安全设备日志-->
                                        <el-row class="ub ub-wrap w100" v-show="this.get_params.topId === '1'">
                                            <el-col :span="6">
                                                <div>
                                                    <el-form :model="safeLogForm" label-position="right" :label-width="labelWidth">
                                                        <el-form-item label="源IP:">
                                                            <el-input
                                                                placeholder="请输入"
                                                                clearable
                                                                v-model.trim="safeLogForm.srcIp"
                                                                size="small">
                                                            </el-input>
                                                        </el-form-item>
                                                    </el-form>
                                                </div>
                                            </el-col>
                                            <el-col :span="6">
                                                <div>
                                                    <el-form :model="safeLogForm" label-position="right" :label-width="labelWidth">
                                                        <el-form-item label="源端口:">
                                                            <el-input
                                                                placeholder="请输入"
                                                                clearable
                                                                v-model.trim="safeLogForm.srcPort"
                                                                size="small">
                                                            </el-input>
                                                        </el-form-item>
                                                    </el-form>
                                                </div>
                                            </el-col>
                                            <el-col :span="6">
                                                <div>
                                                    <el-form :model="safeLogForm" label-position="right" :label-width="labelWidth">
                                                        <el-form-item label="目的IP:">
                                                            <el-input
                                                                placeholder="请输入"
                                                                clearable
                                                                v-model.trim="safeLogForm.desIp"
                                                                size="small">
                                                            </el-input>
                                                        </el-form-item>
                                                    </el-form>
                                                </div>
                                            </el-col>
                                            <el-col :span="6">
                                                <div>
                                                    <el-form :model="safeLogForm" label-position="right" :label-width="labelWidth">
                                                        <el-form-item label="目的端口:">
                                                            <el-input
                                                                placeholder="请输入"
                                                                clearable
                                                                v-model.trim="safeLogForm.desPort"
                                                                size="small">
                                                            </el-input>
                                                        </el-form-item>
                                                    </el-form>
                                                </div>
                                            </el-col>
                                            <el-col :span="6">
                                                <div>
                                                    <el-form :model="safeLogForm" label-position="right" :label-width="labelWidth">
                                                        <el-form-item label="协议:">
                                                            <el-input
                                                                placeholder="请输入"
                                                                clearable
                                                                v-model.trim="safeLogForm.protocol"
                                                                size="small">
                                                            </el-input>
                                                        </el-form-item>
                                                    </el-form>
                                                </div>
                                            </el-col>
                                            <el-col :span="6">
                                                <div>
                                                    <el-form :model="safeLogForm" label-position="right" :label-width="labelWidth">
                                                        <el-form-item label="事件级别:">
                                                            <el-input
                                                                placeholder="请输入"
                                                                clearable
                                                                v-model.trim="safeLogForm.level"
                                                                size="small">
                                                            </el-input>
                                                        </el-form-item>
                                                    </el-form>
                                                </div>
                                            </el-col>
                                            <el-col :span="6">
                                                <div>
                                                    <el-form :model="safeLogForm" label-position="right" :label-width="labelWidth">
                                                        <el-form-item label="事件域名:">
                                                            <el-input
                                                                placeholder="请输入"
                                                                clearable
                                                                v-model.trim="safeLogForm.alternateField3"
                                                                size="small">
                                                            </el-input>
                                                        </el-form-item>
                                                    </el-form>
                                                </div>
                                            </el-col>
                                            <el-col :span="6">
                                                <div>
                                                    <el-form :model="safeLogForm" label-position="right" :label-width="labelWidth">
                                                        <el-form-item label="请求URL:">
                                                            <el-input
                                                                placeholder="请输入"
                                                                clearable
                                                                v-model.trim="safeLogForm.alternateField1"
                                                                size="small">
                                                            </el-input>
                                                        </el-form-item>
                                                    </el-form>
                                                </div>
                                            </el-col>
                                            <el-col :span="6">
                                                <div>
                                                    <el-form :model="safeLogForm" label-position="right" :label-width="labelWidth">
                                                        <el-form-item label="动作:">
                                                            <el-input
                                                                placeholder="请输入"
                                                                clearable
                                                                v-model.trim="safeLogForm.alternateField2"
                                                                size="small">
                                                            </el-input>
                                                        </el-form-item>
                                                    </el-form>
                                                </div>
                                            </el-col>
                                        </el-row>

                                        <!--topId === 2, 主机日志-->
                                        <el-row class="ub ub-wrap w100" v-show="this.get_params.topId === '2'">
                                            <el-col :span="6">
                                                <div>
                                                    <el-form :model="hostLogForm" label-position="right" :label-width="labelWidth">
                                                        <el-form-item label="进程ID:">
                                                            <el-input
                                                                placeholder="请输入"
                                                                clearable
                                                                v-model.trim="hostLogForm.alternateField7"
                                                                size="small">
                                                            </el-input>
                                                        </el-form-item>
                                                    </el-form>
                                                </div>
                                            </el-col>
                                            <el-col :span="6">
                                                <div>
                                                    <el-form :model="hostLogForm" label-position="right" :label-width="labelWidth">
                                                        <el-form-item label="用户ID:">
                                                            <el-input
                                                                placeholder="请输入"
                                                                clearable
                                                                v-model.trim="hostLogForm.alternateField8"
                                                                size="small">
                                                            </el-input>
                                                        </el-form-item>
                                                    </el-form>
                                                </div>
                                            </el-col>
                                            <el-col :span="6">
                                                <div>
                                                    <el-form :model="hostLogForm" label-position="right" :label-width="labelWidth">
                                                        <el-form-item label="系统调用ID:">
                                                            <el-input
                                                                placeholder="请输入"
                                                                clearable
                                                                v-model.trim="hostLogForm.alternateField9"
                                                                size="small">
                                                            </el-input>
                                                        </el-form-item>
                                                    </el-form>
                                                </div>
                                            </el-col>
                                            <el-col :span="6">
                                                <div>
                                                    <el-form :model="hostLogForm" label-position="right" :label-width="labelWidth">
                                                        <el-form-item label="程序命令:">
                                                            <el-input
                                                                placeholder="请输入"
                                                                clearable
                                                                v-model.trim="hostLogForm.alternateField10"
                                                                size="small">
                                                            </el-input>
                                                        </el-form-item>
                                                    </el-form>
                                                </div>
                                            </el-col>
                                            <el-col :span="6">
                                                <div>
                                                    <el-form :model="hostLogForm" label-position="right" :label-width="labelWidth">
                                                        <el-form-item label="返回消息:">
                                                            <el-input
                                                                placeholder="请输入"
                                                                clearable
                                                                v-model.trim="hostLogForm.alternateField11"
                                                                size="small">
                                                            </el-input>
                                                        </el-form-item>
                                                    </el-form>
                                                </div>
                                            </el-col>
                                        </el-row>

                                        <!--topId === 3, 流日志-->
                                        <el-row class="ub ub-wrap w100" v-show="this.get_params.topId === '3'">
                                            <el-col :span="6">
                                                <div>
                                                    <el-form :model="flowLogForm" label-position="right" :label-width="labelWidth">
                                                        <el-form-item label="目的IP:">
                                                            <el-input
                                                                placeholder="请输入"
                                                                clearable
                                                                v-model.trim="flowLogForm.desIp"
                                                                size="small">
                                                            </el-input>
                                                        </el-form-item>
                                                    </el-form>
                                                </div>
                                            </el-col>
                                            <el-col :span="6">
                                                <div>
                                                    <el-form :model="flowLogForm" label-position="right" :label-width="labelWidth">
                                                        <el-form-item label="目的端口:">
                                                            <el-input
                                                                placeholder="请输入"
                                                                clearable
                                                                v-model.trim="flowLogForm.desPort"
                                                                size="small">
                                                            </el-input>
                                                        </el-form-item>
                                                    </el-form>
                                                </div>
                                            </el-col>
                                            <el-col :span="6">
                                                <div>
                                                    <el-form :model="flowLogForm" label-position="right" :label-width="labelWidth">
                                                        <el-form-item label="事件域名:">
                                                            <el-input
                                                                placeholder="请输入"
                                                                clearable
                                                                v-model.trim="flowLogForm.alternateField3"
                                                                size="small">
                                                            </el-input>
                                                        </el-form-item>
                                                    </el-form>
                                                </div>
                                            </el-col>
                                            <el-col :span="6">
                                                <div>
                                                    <el-form :model="flowLogForm" label-position="right" :label-width="labelWidth">
                                                        <el-form-item label="响应状态码:">
                                                            <el-input
                                                                placeholder="请输入"
                                                                clearable
                                                                v-model.trim="flowLogForm.alternateField4"
                                                                size="small">
                                                            </el-input>
                                                        </el-form-item>
                                                    </el-form>
                                                </div>
                                            </el-col>
                                            <el-col :span="6">
                                                <div>
                                                    <el-form :model="flowLogForm" label-position="right" :label-width="labelWidth">
                                                        <el-form-item label="会话ID:">
                                                            <el-input
                                                                placeholder="请输入"
                                                                clearable
                                                                v-model.trim="flowLogForm.alternateField5"
                                                                size="small">
                                                            </el-input>
                                                        </el-form-item>
                                                    </el-form>
                                                </div>
                                            </el-col>
                                        </el-row>

                                        <!--topId === 4, 应用日志-->
                                        <el-row class="ub ub-wrap w100" v-show="this.get_params.topId === '4'">
                                            <el-col :span="6">
                                                <div>
                                                    <el-form :model="applicationLogForm" label-position="right" :label-width="labelWidth">
                                                        <el-form-item label="请求类型:">
                                                            <el-input
                                                                placeholder="请输入"
                                                                clearable
                                                                v-model.trim="applicationLogForm.alternateField12"
                                                                size="small">
                                                            </el-input>
                                                        </el-form-item>
                                                    </el-form>
                                                </div>
                                            </el-col>
                                            <el-col :span="6">
                                                <div>
                                                    <el-form :model="applicationLogForm" label-position="right" :label-width="labelWidth">
                                                        <el-form-item label="请求URL:">
                                                            <el-input
                                                                placeholder="请输入"
                                                                clearable
                                                                v-model.trim="applicationLogForm.alternateField1"
                                                                size="small">
                                                            </el-input>
                                                        </el-form-item>
                                                    </el-form>
                                                </div>
                                            </el-col>
                                            <el-col :span="6">
                                                <div>
                                                    <el-form :model="applicationLogForm" label-position="right" :label-width="labelWidth">
                                                        <el-form-item label="状态码:">
                                                            <el-input
                                                                placeholder="请输入"
                                                                clearable
                                                                v-model.trim="applicationLogForm.alternateField13"
                                                                size="small">
                                                            </el-input>
                                                        </el-form-item>
                                                    </el-form>
                                                </div>
                                            </el-col>
                                            <el-col :span="6">
                                                <div>
                                                    <el-form :model="applicationLogForm" label-position="right" :label-width="labelWidth">
                                                        <el-form-item label="日志消息:">
                                                            <el-input
                                                                placeholder="请输入"
                                                                clearable
                                                                v-model.trim="applicationLogForm.msg"
                                                                size="small">
                                                            </el-input>
                                                        </el-form-item>
                                                    </el-form>
                                                </div>
                                            </el-col>
                                            <el-col :span="6">
                                                <div>
                                                    <el-form :model="applicationLogForm" label-position="right" :label-width="labelWidth">
                                                        <el-form-item label="线程号:">
                                                            <el-input
                                                                placeholder="请输入"
                                                                clearable
                                                                v-model.trim="applicationLogForm.alternateField14"
                                                                size="small">
                                                            </el-input>
                                                        </el-form-item>
                                                    </el-form>
                                                </div>
                                            </el-col>
                                        </el-row>
                                    </template>
                                </div>
                                <div class="search-text" v-show="isOpen && searchType==='normal'"  @click="isOpen=false">收 起<i style="margin-left: 10px;" class="el-icon-arrow-up"></i></div>
                                <div class="search-text" v-show="!isOpen && searchType==='normal'"  @click="isOpen=true">展 开<i style="margin-left: 10px;" class="el-icon-arrow-down"></i></div>
                            </div>
                        </div>
                    </div>
                    <div class="ub ub-pe" style="width:180px;margin-top: 4px">
                        <Debounce :time='1500' :isDebounce="2">
                            <el-button size="small"  @click.native="resetFun" style="min-width: 60px !important" >重 置</el-button>
                        </Debounce>
                        <Debounce :time='1500' :isDebounce="2">
                            <el-button :loading="loading" size="small" type="primary" @click.native="searchAssets" style="min-width: 60px !important">搜 索</el-button>
                        </Debounce>
                        <el-tooltip class="item" effect="dark" content="切换至字段搜索" placement="top-start">
                            <div class="ub ub-ac ub-pc  sql-btn" @click="switchSearch">
                                <i class="iconfont icon-chaxunyuju"></i>
                            </div>
                        </el-tooltip>
                    </div>
                </div>
                <div class="sql-box" v-if="searchType === 'sql'">
                    <div class="ub">
                        <p style="width: 58px;color: rgba(0,0,0,0.9);font-size:12px;text-align: right;margin-right:12px;height: 30px;line-height: 30px">语句查询:</p>
                        <CustomSearch class="ub-f1" :auto="true" ref="customSearch" @getData="getData" :type="1" />
                    </div>
                </div>
                <div style="position: relative;margin-top:3px;margin-bottom:10px">
                    <FilterCondition :condition-data="conditionData" />
                    <div v-if="conditionShow" class="condition-area">
                        <ConditionRules
                            :select-data="listAll"
                            :treeData="treeData" />
                        <div class="split-line"></div>
                        <div class="ub ub-pe footer">
                            <!-- <cancelBtn style="margin-right: 10px;" title="取 消" @click="conditionShow = false" /> -->
                            <el-button style="margin-right: 10px;" size="mini" @click="conditionShow = false">取消</el-button>
                            <Debounce :time='1500' :isDebounce="2">
                                <el-button @click.native="addFilterCondition" size="mini" type="primary">{{ conditionData.some(it => it.id === this.recordId) ? '编 辑' :'添 加' }}</el-button>
                                <!-- <searchBtn :title="this.conditionData.some(it => it.id === this.recordId) ? '编 辑' :'添 加'" @click.native="addFilterCondition" /> -->
                            </Debounce>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div
            class="chart-wrapper log_num"
            v-loading.lock="log_loading"
            element-loading-background="rgba(0, 0, 0, 0.05)"
            element-loading-text="拼命加载中......">
            <div class="progress-box">
                <ProgressBar ref="progressBar" :status="barStatus" />
                <div class="ub chart-title">
                    <!-- <div class="table-view ub ub-pc" @click="viewTab = 'tableView'" :class="{'active': viewTab === 'tableView'}">表格视图</div> -->
                    <!--<div class="chart-view ub ub-pc" @click="viewTab = 'chartView'" :class="{'active': viewTab === 'chartView'}">图表视图</div>-->
                    <div class="table-view ub ub-pc" @click="viewTab = 'tableView'" :class="{'active': viewTab === 'tableView'}">
                        <div style="padding-left:0">表格视图</div>
                        <div>
                            <!-- <i class="el-icon-caret-top" v-show="viewChartOpen"  @click="viewChartOpen=false"></i>
                            <i class="el-icon-caret-bottom" v-show="!viewChartOpen"  @click="viewChartOpen=true"></i> -->
                            <i :class="['iconfont', 'icon-a-yibiaopan-xiala1',viewChartOpen?'icon-select1':'icon-select' ]"  @click="viewChartOpen=!viewChartOpen" style="font-size:12px"></i>
                        </div>
                    </div>
                </div>
            </div>
            <!-- <div class="ub ub-pe fold-box">
                <div v-show="viewChartOpen"  @click="viewChartOpen=false">收 起<i style="margin-left: 3px;" class="el-icon-arrow-up"></i></div>
                <div v-show="!viewChartOpen"  @click="viewChartOpen=true">展 开<i style="margin-left: 3px;" class="el-icon-arrow-down"></i></div>
            </div> -->
            <div class="ub w100" v-show="viewTab === 'tableView' && viewChartOpen " style="background:#f2f6fd">
                <div class="chart-num-box" style="width:200px;margin-top:15px">
                    <div class="ub ub-ac mb-3">
                        <p style="font-size: 12px;margin-top:5px">结果总量</p>
                        <el-tooltip v-if="resetShow" class="item" effect="dark" content="还原" placement="top-start">
                            <i style="color: #387dee; font-size: 12px;margin-left: 10px;cursor: pointer" @click="handleChartRefresh" class="iconfont icon-shuaxin"></i>
                        </el-tooltip>
                    </div>
                    <div class="mb-2" style="color: #0052d9;font-size: 24px">{{parseInt(logs_total)}}</div>
                    <div class="chart-bg"></div>
                </div>
                <div class="ub ub-f1" style="height:140px;">
                    <div style="width:100%;height:100%;cursor: pointer;padding: 2px;box-sizing: border-box;position: relative;">
                        <div v-if="log_no_data" class="ub ub-f1 ub-ac ub-pc" style="height:100%;color:#e7e7e7;font-size:16px; cursor: pointer;">
                            暂无数据
                        </div>
                        <TableChart :chart-data="chartData"/>
                        <div class="chart-bg-two"></div>
                        <div class="chart-bg-three"></div>
                    </div>
                </div>
            </div>
        </div>
        <TableContent
            :type="1"
            :viewChartOpen="viewChartOpen"
            v-loading.lock="loading"
            element-loading-background="rgba(0, 0, 0, 0.05)"
            element-loading-text="拼命加载中......"
            ref="tableContent"
            :list-all="listAll"
            :list="list"
            :table-data="tableData"
            :list-can-select="listCanSelect"
            :keywords="highlightKeywords"
            :rank-data="rankData"
            :top-loading="topLoading"
            :searchType="searchType"
            @saveLogIdSuccess="saveLogIdSuccess"
            @createTaskSucess="createTaskSucess"
            @handleDownload="handleDownload"
            v-if="viewTab === 'tableView'">
        </TableContent>

        <Alarm :alarm-dialog="alarmDialog" :select-mode='selectMode' @addAlarmSucess="addAlarmSucess" ref="drawerRef"></Alarm>
        <SaveList :type="1" :save-list-dialog="saveListDialog"></SaveList>

        <el-dialog title="配置高亮词" width="700px" :visible.sync="highlightDialog" custom-class="common-dialog">
            <el-form :model="highlightForm" ref="highlightForm" :rules="rules" label-position="top">
                <el-form-item prop="keywords" label-width="90px">
                    <span slot="label">
                        <span>高亮词名称：</span>
                    </span>
                    <el-input size="mini" style="width: 98%" placeholder="请输入高亮词，多个以英文逗号隔开" v-model.trim="highlightForm.keywords"></el-input>
                    <el-tooltip class="item" effect="dark" content="为优化页面性能，请将高亮词填写详细，修改成功后，需重新搜索" placement="top-start">
                        <i style="color: #0052D9; margin-left: 4px;font-size: 12px;position: absolute" class="iconfont icon-qiangtishi"></i>
                    </el-tooltip>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="closeHighLight">取 消</el-button>
                <el-button size="small" type="primary" @click="sendHighlight">确 认</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import SaveList from './components/save_list/index.vue'
import CustomDate from './components/custom_date/index.vue'
// import CustomDate from './components/save_list/custom_date.vue'
import {
    saveHighlight,
    getHighlight,
    getDataTree,
    getFieldByType,
    getUserField,
    saveUserField,
    getFilterSql,
    getList,
    getTopField,
    download,
    getTableChart,
    searchFieldVal
} from '@/server/data_manage/new_search.js'
import draggable from 'vuedraggable'
import Prcess from '@/components/prcess.vue'
import condition from '@/components/condition.vue'
import ueditorConfig from '@/mixins/ueditorConfig'
import ProgressBar from '@/pages/data_manage/new_search/components/chart/ProgressBar'
// import the component
import Treeselect from '@riophae/vue-treeselect'
import TableContent from '@/pages/data_manage/new_search/components/content/TableContent'
import Alarm from '@/pages/data_manage/new_search/components/alarm/index.vue'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import FilterCondition from '@/pages/data_manage/new_search/components/FilterCondition'
import CustomSearch from '@/pages/data_manage/new_search/components/custom_search/index'
import ConditionRules from '@/pages/data_manage/new_search/components/ConditionRules'
import TableChart from '@/pages/data_manage/new_search/components/chart/TableChart'
import EventBus from '@/assets/js/bus'
export default {
    name: 'Classify',
    components: {
        // Bar,
        // draggable,
        Treeselect,
        ProgressBar,
        TableContent,
        CustomSearch,
        Alarm,
        FilterCondition,
        ConditionRules,
        TableChart,
        CustomDate,
        SaveList
    },
    mixins: [ueditorConfig],
    data() {
        var checkcallFailedFlowId = (rule, value, callback) => {
            if (value && !Number.isInteger(value)) {
                callback(new Error('请输入数字值'))
            } else {
                callback()
            }
        }
        var validateDesIp = (rule, value, callback) => {
            if (!(/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(value))) {
                callback(new Error('请输入正确的ip'))
            } else {
                callback()
            }
        }
        var validateKeywords = (rule, value, callback) => {
            if (value.trim().split(',').length > 10) {
                callback(new Error('输入高亮词过多，请控制在10个以内'))
            } else {
                callback()
            }
        }
        return {
            recordTopId: '',
            requestFlag: false,
            exactId: '',
            searchLoading: false,
            resetShow: false,
            appendToBody: false,
            selectMode: 0,
            sqlTermData: '',
            customTime: [],
            isOpen: true,
            viewTab: 'tableView', // 'tableView', 'chartView'
            viewChartOpen: false,
            searchType: 'normal', // 'normal', 'sql'
            labelWidth: '100px',
            alarmDialog: false,
            conditionData: [],
            treeData: [
                {
                    connect: 'and',
                    children: [
                        {
                            field: '',
                            operator: '',
                            value: '',
                            dataType: 1, // 1.常量 2.变量
                            attrType: 1
                        }
                    ]
                }
            ],
            eventType: 'AlarmEvent',
            highlightDialog: false,
            highlightForm: {
                keywords: ''
            },
            highlightKeywords: '',
            barStatus: 1, // 0 未开始，1 完成， 2暂停
            cancelObj: {
                cancel: null
            },
            dataTree: [],
            rankData: [],
            rankMarkField: '',
            topLoading: false,
            chartData: [],
            chartTimeRange: [],
            safeLogForm: {
                attackType: '',
                subject: '',
                srcIp: '',
                srcPort: '',
                desIp: '',
                desPort: '',
                protocol: '',
                level: '',
                alternateField3: '',
                alternateField1: '',
                alternateField2: ''
            },
            hostLogForm: {
                subject: '',
                alternateField6: '',
                alternateField7: '',
                alternateField8: '',
                alternateField9: '',
                alternateField10: '',
                alternateField11: ''
            },
            flowLogForm: {
                srcIp: '',
                srcPort: '',
                desIp: '',
                desPort: '',
                alternateField3: '',
                alternateField4: '',
                alternateField5: ''
            },
            applicationLogForm: {
                level: '',
                srcIp: '',
                alternateField12: '',
                alternateField1: '',
                alternateField13: '',
                msg: '',
                alternateField14: ''
            },

            isCanOption: true,
            treeselectWidth: window.screen.width >= 1600 ? 500 : 240,
            tabsValue: '',
            createTaskDialog: false,
            createAllTaskDialog: false,
            createTaskId: '',
            stopIndex: '',
            pacpData: [],
            pcacDialog: false,
            stopId: '',
            stopDialog: false,
            seeSaveDilog: false,
            momentList: [],
            valueConsistsOf: 'LEAF_PRIORITY',
            normalizer(node) {
                if (node.sub && !node.sub.length) {
                    delete node.sub
                }
                return {
                    id: node.id,
                    label: node.name,
                    children: node.child
                }
            },
            limitText(count) {
                return `+${count}`
            },
            isLoadDliog: false,
            loadId: '',
            timestrId: '',
            timestrIdData: '',
            timer: null,
            formLabelWidth: '100px',
            typeList: [],
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
                desPort: '',
                dt: '',
                attackResult: ''
            },
            rules: {
                reportName: [{
                    required: true,
                    message: '请输入名称',
                    trigger: 'blur'
                }],
                keywords: [{
                    validator: validateKeywords,
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
                    required: false,
                    message: '请输入正确的ip',
                    trigger: 'blur'
                }],
                srcPort: [
                    { validator: checkcallFailedFlowId, trigger: 'blur' }
                ],
                desPort: [
                    { validator: checkcallFailedFlowId, trigger: 'blur' }
                ],
                reportLevel: [{
                    required: true,
                    message: '请选择事件等级',
                    trigger: 'change'
                }],
                name: [{
                    required: true,
                    message: '请输入条件名称',
                    trigger: 'blur'
                }]
            },
            searchId: '',
            timeStr: '',
            deleteId: '',
            delDialog: false,
            saveListDialog: false,
            saveForm: {
                name: ''
            },
            saveDialog: false,
            conditionShow: false,
            recordId: '',
            listAll: [],
            listCanSelect: [],
            list: [],
            editable: true,
            isDragging: false,
            delayedDragging: false,
            log_loading: false,
            log_no_data: false,
            logs_total: 0,
            logData: [],
            timeSelectTitle: '年',
            timeSelectId: 2,
            timeType: [{
                label: '年',
                value: 2,
                isActive: true
            }, {
                label: '月',
                value: 1,
                isActive: false
            }, {
                label: '日',
                value: 0,
                isActive: false
            }],
            optionsCanSelect: [],
            options: [],
            fieldsShow: false,
            fields: [{
                label: '事件名称',
                value: 'alarmName'
            }, {
                label: '事件等级',
                value: 'alarmLevel'
            }, {
                label: '事件类型',
                value: 'type'
            }],
            loading: false,
            total_num: 0,
            total__count: 0,
            tableData: [],
            multipleSelection: [],
            sayTimes: null,
            get_params: {
                page: 1,
                size: 50,
                dataType: null,
                topId: '1',
                startTime: '',
                endTime: ''
            },
            loadingSave: false,
            total_numSave: 0,
            tableDataSave: [],
            get_paramsSave: {
                page: 1,
                size: 10,
                name: ''

            },
            loadingHistory: false,
            total_numHistory: 0,
            tableDataHistory: [],
            get_paramsHistory: {
                page: 1,
                size: 10

            },
            historySave: false,
            saveData: null,
            rule_url: '',
            logIds: [],
            dateData: '',
            dateMode: '',
            useDate: {},
            useIndex: '',
            parentID: '',
            first: 0
        }
    },
    computed: {
        tableList() {
            console.log('this.list', this.list)
            return this.list.length > 0 ? this.list : this.listAll
        },
        exportUrl() {
            let startTime = this.sayTimes === null ? '' : this.sayTimes[0]
            let endTime = this.sayTimes === null ? '' : this.sayTimes[1]
            return 'data_center/manage/syslog/export?type=0&dtArr=' + this.get_params.dt + '&content=' + this.get_params.content +
                '&startTime=' + startTime + '&endTime=' + endTime
        },
        exportUrl1() {
            let startTime = this.sayTimes === null ? '' : this.sayTimes[0]
            let endTime = this.sayTimes === null ? '' : this.sayTimes[1]
            return 'data_center/manage/syslog/export?type=1&dtArr=' + this.get_params.dt + '&content=' + this.get_params.content +
                '&startTime=' + startTime + '&endTime=' + endTime
        },
        dragOptions() {
            return {
                animation: 100
                // group: "description",
                // disabled: !this.editable,
                // ghostClass: "ghost"
            }
        },

        listString() {
            return JSON.stringify(this.list, null, 2)
        }
    },
    watch: {
        // chartTimeRange(newVal, oldVal) {
        //     if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
        //         this.customTime[0] = newVal[0]
        //         this.customTime[1] = newVal[1]
        //         this.get_data()
        //         this.get_chart_data()
        //     }
        // },
        alarmDialog(newVal) {
            if (!newVal) {
                this.$refs.tableContent.$refs.multipleTable.clearSelection()
            }
        },
        conditionShow(newVal) {
            if (!newVal) {
                this.treeData = [
                    {
                        connect: 'and',
                        children: [
                            {
                                field: '',
                                operator: '',
                                value: '',
                                dataType: 1, // 1.常量 2.变量
                                attrType: 1
                            }
                        ]
                    }
                ]
            }
        },
        pcacDialog(newVal, oldVal) {
            if (!newVal) {
                this.tabsValue = ''
                this.pacpData = []
            }
        },
        list: {
            handler(newVal, oldVal) {
                let arr = []
                this.listAll.map(item => {
                    if (!newVal.some(_item => item.fieldName === _item.fieldName)) {
                        arr.push(item)
                    }
                })
                this.listCanSelect = this.$deepCopy(arr)
            },
            // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
            immediate: true
        },
        saveDialog(newValue) {
            if (!newValue) {
                this.saveForm.name = ''
                this.historySave = false
            }
        },
        isDragging(newValue) {
            if (newValue) {
                this.delayedDragging = true
                return
            }
            this.$nextTick(() => {
                this.delayedDragging = false
            })
        },
        viewChartOpen(val) {
            if (val && this.first) {
                this.setDate()
                this.get_chart_data()
            }
        }
    },
    created() {
        let momentList = this.$getsessionStorage('momentList')
        if (momentList) {
            this.momentList = momentList
        }
        EventBus.$on('addEqualCondition', this.addEqualCondition)
        EventBus.$on('addUnequalCondition', this.addUnequalCondition)
        EventBus.$on('getTopField', this.getTopFieldFun)
    },
    beforeDestroy() {
        EventBus.$off('getTopField')
        this.$removesessionStorage('saveDate')
    },
    mounted() {
        this.getMinute()
        // if (this.$route.params.markId && this.$route.params.markId.length) {
        //     this.markId = this.$route.params.markId
        // }
        this.getTreeData()
        this.initCanSelectedFileds(true)
        this.isShow = true
        this.$nextTick(() => {
            this.getHighlight()
        })
    },
    methods: {
        customDateUse() {
            this.searchLoading = true
            this.get_params.page = 1
            this.initCanSelectedFileds()
        },
        getDateData(date, mode, useDate, useIndex) {
            this.dateData = date
            this.dateMode = mode
            this.useDate = useDate
            this.useIndex = useIndex
        },
        handleChartRefresh() {
            // this.setDate()
            this.setRecordDate()
            console.log(this.chartTimeRange)
            console.log(this.customTime)
            setTimeout(() => {
                this.get_data()
                this.get_chart_data()
            }, 1000)
        },
        setRecordDate() {
            let recordDate = this.$getsessionStorage('saveDate')

            if (recordDate && recordDate.currentTab) {
                if (recordDate.type === 1) {
                    let time = recordDate.value
                    let interval = new Date(time[1]).getTime() - new Date(time[0]).getTime()
                    let end = Date.now()
                    let start = end - interval

                    let startFormat = this.$moment(start).format('YYYY-MM-DD HH:mm:ss')
                    let endFormat = this.$moment(end).format('YYYY-MM-DD HH:mm:ss')
                    console.log(startFormat)
                    this.chartTimeRange = [startFormat, endFormat, recordDate.title ? recordDate.title : undefined]

                    let saveDate = {
                        value: [startFormat, endFormat],
                        type: 1,
                        currentTab: 1,
                        title: recordDate.title ? recordDate.title : undefined
                    }
                    this.$setsessionStorage('saveDate', saveDate)
                } else {
                    this.chartTimeRange = recordDate.value
                    let saveDate = {
                        value: recordDate.value,
                        type: 2,
                        currentTab: 1
                    }
                    this.$setsessionStorage('saveDate', saveDate)
                }
            }
            setTimeout(() => {
                this.resetShow = false
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
        handleDownload(statusData, multipleSelection) {
            this.$refs.tableContent.downLoading = true
            let data = {
                queryData: {},
                paramsData: {
                    logIds: multipleSelection.length > 0 ? multipleSelection.map(item => item.id) : [],
                    fileType: statusData,
                    searchType: 1,
                    topId: this.get_params.topId,
                    inputTerm: [{ field: 'startTime', value: this.customTime[0] }, { field: 'endTime', value: this.customTime[1] }],
                    sqlTerm: this.searchType === 'sql' ? this.sqlTermData : '',
                    filterTerm: this.conditionData.map(it => it.origin[0]),
                    logType: this.get_params.topId,
                    fields: this.list.map(it => it.fieldName)
                }
            }
            if (this.searchType === 'normal') {
                if (this.get_params.topId === '1') {
                    for (const key in this.safeLogForm) {
                        data.paramsData.inputTerm.push({
                            field: key,
                            value: this.safeLogForm[key]
                        })
                    }
                } else if (this.get_params.topId === '2') {
                    for (const key in this.hostLogForm) {
                        data.paramsData.inputTerm.push({
                            field: key,
                            value: this.hostLogForm[key]
                        })
                    }
                } else if (this.get_params.topId === '3') {
                    for (const key in this.flowLogForm) {
                        data.paramsData.inputTerm.push({
                            field: key,
                            value: this.flowLogForm[key]
                        })
                    }
                } else if (this.get_params.topId === '4') {
                    for (const key in this.applicationLogForm) {
                        data.paramsData.inputTerm.push({
                            field: key,
                            value: this.applicationLogForm[key]
                        })
                    }
                }
            }
            download(data).then(res => {
                this.$refs.tableContent.downLoading = false
                this.$message({
                    message: '下载成功',
                    type: 'success'
                })
            }).catch(error => {
                // this.$message({
                //     message: error,
                //     type: 'error'
                // })
                console.log('error', error)
            })
        },
        createTaskSucess() {
            this.get_data()
        },
        saveLogIdSuccess() {
            this.get_data()
        },
        addAlarmSucess() {
            this.get_data()
        },
        addEqualCondition(data) {
            console.log(data, '新增相等条件')
            this.conditionData.push(data)
        },
        addUnequalCondition(data) {
            console.log(data, '新增不等条件')
            this.conditionData.push(data)
        },
        getData(val) {
            this.sqlTermData = val
            console.log('智能搜索框时间', val)
        },
        getTreeData() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            getDataTree(data).then(res => {
                console.log(res, '数据分类')
                this.dataTree = res ?? []
                // let firstChild = null
                // let defNode = null
                // if (res.length) {
                //     firstChild = res[0].id
                //     defNode = res[0].child
                //     while (defNode && defNode.length) {
                //         firstChild = defNode[0].id
                //         defNode = defNode[0].child
                //     }
                // }
                // this.get_params.dataType = firstChild
                this.get_params.dataType = res.length ? res[0].id : null
                this.get_params.topId = res.length ? res[0].topId : ''
                // if (['1', '2', '3', '4'].includes(firstChild)) {
                //     this.exactId = ''
                // } else {
                //     this.exactId = firstChild
                // }
            })
                .then(res => {
                    // this.initCanSelectedFileds(true)
                })
                .catch(err => {
                    console.log(err)
                })
        },
        treeChange(val) {
            console.log(val)
            this.parentID = val.parentId
            this.get_params.topId = val.topId
            if (['1', '2', '3', '4'].includes(val.id)) {
                this.exactId = ''
            } else {
                this.exactId = val.id
            }
            this.logs_total = 0
            this.chartData = []
            this.tableData = []
            this.initCanSelectedFileds(true)
        },
        getCustomTime(val, isChartTime) {
            this.customTime = val
            if (isChartTime) {
                this.resetShow = true
            } else {
                this.resetShow = false
            }
            if (this.$refs.tableContent.$refs.multipleTable) {
                console.log('时间变了，清空表格')
                this.$refs.tableContent.$refs.multipleTable.clearSelection()
            }
            console.log('时间', val)
        },
        addFilterCondition() {
            let that = this
            console.log(this.treeData)
            let data = {
                queryData: {},
                paramsData: {
                    filterTerm: this.treeData
                }
            }
            getFilterSql(data).then(res => {
                console.log(res, '过滤条件转sql')
                let data = {
                    origin: this.treeData,
                    msg: res ?? '',
                    id: Date.now() + res
                }
                if (this.conditionData.some(it => it.id === this.recordId)) {
                    let index = this.conditionData.findIndex(it => it.id === that.recordId)
                    that.conditionData.splice(index, 1, that.$lodash.cloneDeep(data))
                } else {
                    that.conditionData.push(that.$lodash.cloneDeep(data))
                }
                that.conditionShow = false
                this.searchAssets()
            }).catch(err => {
                console.log(err)
            })
        },
        focus() {
            this.$nextTick(() => {
                document
                    .getElementsByClassName('el-picker-panel__link-btn')[0]
                    .setAttribute('style', 'display:none')
            })
        },
        switchSearch() {
            if (this.searchType === 'normal') {
                this.searchType = 'sql'
                this.$nextTick(() => {
                    this.$refs.customSearch.inputData = this.sqlTermData
                })
            } else {
                this.searchType = 'normal'
            }
        },
        getMinute() {
            const start = this.$moment().add(-15, 'minute').format('YYYY-MM-DD HH:mm:ss')
            const end = this.$moment().format('YYYY-MM-DD HH:mm:ss')
            this.sayTimes = [start, end]
        },
        checkSelectable(row, index) {
            let flag = false
            if (row.nftData === 0) {
                flag = true
            }
            return flag
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        createPackTask(row) {
            this.createTaskId = row.id
            this.createTaskDialog = true
        },
        createAllPackTask(row) {
            if (this.multipleSelection.length === 0) {
                this.$message({
                    message: '请先选择数据！',
                    type: 'warning'
                })
                return
            }
            this.createAllTaskDialog = true
        },
        async top5Show(element) {
            if (element.show) {
                element.show = false
                return
            }
            let top5Obj = await this.getTop5(element.fieldName)
            console.log('top5Obj', top5Obj)
            element.totalNum = top5Obj.totalNum
            element.top5 = top5Obj.top5.map(item => {
                item.percent = ((item.num * 100) / element.totalNum).toFixed(2)
                return item
            })
            element.show = true
        },
        downloadFun() {
            this.$router.push('/home/data_center_download')
        },

        seeSave() {
            this.seeSaveDilog = true
        },
        cancelStay(row) {
            let index = this.momentList.findIndex(item => JSON.stringify(item) === JSON.stringify(row))
            this.momentList.splice(index, 1)
            this.$setsessionStorage('momentList', this.momentList)
            this.$message({
                message: '删除成功',
                type: 'success'
            })
        },
        handleSeeSaveDel(row, index) {
            this.momentList.splice(index, 1)
            this.$setsessionStorage('momentList', this.momentList)
            this.$message({
                message: '删除成功',
                type: 'success'
            })
        },
        momentSave(row) {
            this.momentList.push(row)
            this.$setsessionStorage('momentList', this.momentList)
            this.$message({
                message: '暂存成功',
                type: 'success'
            })
        },
        selectTree(val) {
            if (val.length === 0) {
                this.get_params.dt = []
            }
            console.log('this.get_params.dt', this.get_params.dt)
        },
        createLoad(type) {
            this.loadId = type
            this.isLoadDliog = true
        },
        createRuleFun() {
            /* window.open(this.rule_url+'/#/home/cep_show?data_tule=1');*/
            this.$router.push('/home/rule_cep_show?data_tule=1')
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
        // 排序列改变返回当前需要排序的列
        changeTableSort(e) {
            console.log('e', e)
            // 获取当前列的字段
            const prop = e.prop
            // 如果按降序
            if (e.order === 'descending') {
                // 根据需要对字段进行写排序
                this.tableData = this.tableData.sort((a, b) => {
                    return parseFloat(a[prop]) - parseFloat(b[prop])
                })
            } else { // 发果是降序
                this.tableData = this.tableData.sort((a, b) => {
                    return parseFloat(b[prop]) - parseFloat(a[prop])
                })
            }
        },
        validForm(formName) {
            return new Promise((resolve, reject) => {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        resolve()
                    } else {
                        console.log('error submit!!')
                        reject(new Error('校验失败'))
                        return false
                    }
                })
            })
        },
        getHighlight() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            getHighlight(data).then(res => {
                console.log(res, '关键词！！！！！！！！！！！！！！！！！')
                this.highlightKeywords = res ?? ''
                this.highlightForm.keywords = res ?? ''
            })
                .catch(err => {
                    console.log(err)
                })
        },
        closeHighLight() {
            this.highlightForm.keywords = this.highlightKeywords
            this.highlightDialog = false
        },
        sendHighlight() {
            this.validForm('highlightForm').then(res => {
                console.log('校验成功')
                let data = {
                    queryData: {},
                    paramsData: {
                        highlight: this.highlightForm.keywords
                    }
                }
                saveHighlight(data).then(res => {
                    this.$message.success('操作成功！')
                    this.highlightDialog = false
                    this.getHighlight()
                    this.tableData = []
                    this.get_data()
                })
                    .catch(err => {
                        console.log(err)
                        this.highlightForm.keywords = this.highlightKeywords
                        this.highlightDialog = false
                    })
            }).catch(() => {})
        },
        saveShowFun() {
            this.saveDialog = true
        },
        resetFun() {
            for (let key in this.safeLogForm) {
                this.safeLogForm[key] = ''
            }
            for (let key in this.hostLogForm) {
                this.hostLogForm[key] = ''
            }
            for (let key in this.flowLogForm) {
                this.flowLogForm[key] = ''
            }
            for (let key in this.applicationLogForm) {
                this.applicationLogForm[key] = ''
            }
            this.conditionData = []
            this.sqlTermData = ''
            this.$refs.customSearch.inputData = ''
        },
        onEnd() {},
        delFileds(element) {
            var _index
            this.list.forEach((item, index) => {
                if (element.fieldName === item.fieldName) {
                    _index = index
                }
            })
            this.list.splice(_index, 1)
            let data = {
                queryData: {},
                paramsData: {
                    searchType: 1,
                    fieldIds: this.list.map(it => it.fieldId),
                    topId: this.get_params.topId
                }
            }
            saveUserField(data).then(res => {
                this.requestFlag = true
                this.$message.success('删除成功！')
            })
                .then(() => {

                })
                .catch(err => console.log(err))
        },
        changeFileds() {
            let data = {
                queryData: {},
                paramsData: {
                    searchType: 1,
                    fieldIds: this.list.map(it => it.fieldId),
                    topId: this.get_params.topId
                }
            }

            saveUserField(data).then(res => {
                this.requestFlag = true
                this.$message.success('操作成功！')
            })
                .then(() => {

                })
                .catch(err => console.log(err))
        },
        addFileds(element) {
            if (this.list.some(item => item.fieldName === element.fieldName)) {
                this.$message({
                    message: '该字段已经存在',
                    type: 'warning'
                })
                return
            }
            if (this.list.find(it => it.fieldName === 'alarmTime') && this.list.find(it => it.fieldName === 'message')) {
                this.list.splice(this.list.length - 1, 0, {
                    fieldName: element.fieldName,
                    name: element.name,
                    fieldId: element.fieldId,
                    show: false
                })
            } else if (element.fieldName === 'alarmTime') {
                this.list.unshift({
                    fieldName: element.fieldName,
                    name: element.name,
                    fieldId: element.fieldId,
                    show: false
                })
            } else if (element.fieldName === 'message') {
                this.list.push({
                    fieldName: element.fieldName,
                    name: element.name,
                    fieldId: element.fieldId,
                    show: false
                })
            } else {
                this.list.push({
                    fieldName: element.fieldName,
                    name: element.name,
                    fieldId: element.fieldId,
                    show: false
                })
            }

            let data = {
                queryData: {},
                paramsData: {
                    searchType: 1,
                    topId: this.get_params.topId,
                    fieldIds: this.list.map(it => it.fieldId)
                }
            }
            saveUserField(data).then(res => {
                this.requestFlag = true
                this.$message.success('操作成功！')
            }).then(() => {

            }).catch(err => console.log(err))
            let ids = []
            let copyList = this.tableData
            copyList.map(item => {
                ids.push({ id: item.id, alarmTime: item.alarmTime })
            })
            let fieldVal = {
                queryData: {},
                paramsData: {
                    logType: this.parentID,
                    data: ids,
                    field: element.fieldName
                }
            }
            searchFieldVal(fieldVal).then(res => {
                this.tableData = []
                let list = res
                copyList.map(item => {
                    list.map(items => {
                        if (item.id == items.id) {
                            item[element.fieldName] = items[element.fieldName]
                        }
                    })
                })
                this.tableData = this.$lodash.cloneDeep(copyList)
                console.log(this.tableData)
            }).catch(err => console.log(err))
            // this.get_data()
        },
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        indexMethodSave(index) {
            return (this.get_paramsSave.page - 1) * this.get_paramsSave.size + index + 1
        },
        indexMethodHistory(index) {
            return (this.get_paramsHistory.page - 1) * this.get_paramsHistory.size + index + 1
        },
        timeDiffer() {
            if (this.sayTimes.length > 0) {
                let t1 = this.$moment(this.sayTimes[0])
                let t2 = this.$moment(this.sayTimes[1])
                let timeDifferData = t2.diff(t1, 'hour')
                return timeDifferData
            }
        },
        searchAssets() {
            this.first = 1
            this.get_params.page = 1
            this.setDate()
            /* 分类条件不变时，不重新获取接口*/
            if ((this.get_params.topId && this.get_params.topId === this.recordTopId) && !this.requestFlag) {
                this.get_data()
                if (this.viewChartOpen) {
                    this.get_chart_data()
                }
            } else {
                // this.searchLoading = true
                // this.initCanSelectedFileds()
                this.get_data()
                if (this.viewChartOpen) {
                    this.get_chart_data()
                }
            }
        },
        initSelectedFileds(first = false) {
            let data = {
                queryData: {},
                paramsData: {
                    searchType: 1,
                    topId: this.get_params.topId
                }
            }
            getUserField(data).then(res => {
                this.list = []
                return res
            }).then(res => {
                this.searchLoading = false
                console.log('用户已选字段', res)
                if (res.length > 0) {
                    res.forEach((item, index) => {
                        let obj = {}
                        obj.show = false
                        // obj.fixed = false
                        // obj.top5 = []
                        obj.name = item.name
                        obj.fieldId = item.fieldId
                        obj.fieldName = item.field
                        obj.type = item.type

                        this.list.push(obj)
                        // 事件事件放前面，原始信息放最后
                        // if (this.list.find(it => it.fieldName === 'alarmTime') && obj.fieldName !== 'message') {
                        //     this.list.splice(1, 0, obj)
                        // } else if (obj.fieldName === 'message') {
                        //     this.list.push(obj)
                        // } else {
                        //     this.list.splice(this.list.length - 1, 0, obj)
                        // }
                    })
                }
            }).then(() => {
                if (!first) {
                    this.get_data()
                    this.get_chart_data()
                }
            }).catch(error => {
                console.log('error' + error)
            })
        },
        initCanSelectedFileds(first = false) {
            let data = {
                queryData: {},
                paramsData: {
                    topId: this.get_params.topId
                }
            }
            /* 先获取已选的字段，在获取所有字段，避免左侧抖动*/
            this.initSelectedFileds(first)
            getFieldByType(data).then(res => {
                this.listAll = []
                return res
            })
                .then(res => {
                    console.log('所有可选字段', res)
                    if (res.length > 0) {
                        res.forEach(item => {
                            let obj = {}
                            obj.fieldId = item.fieldId
                            obj.show = false
                            // obj.fixed = false
                            // obj.top5 = []
                            obj.name = item.name
                            obj.fieldName = item.field
                            obj.type = item.type
                            if (item.enums) {
                                obj.enums = item.enums
                            }
                            this.listAll.push(obj)
                        })
                    }
                }).then(() => {
                    this.list = this.$lodash.cloneDeep(this.list)
                }).catch(error => {
                    console.log('error' + error)
                })
        },
        changeTime(item) {
            this.timeType = this.timeType.map(_item => {
                _item.isActive = false
                return _item
            })
            item.isActive = true
            this.timeSelectId = item.value
            this.timeSelectTitle = item.label
            this.initStatistic()
        },
        get_chart_data() {
            this.log_loading = true
            let data = {
                queryData: {},
                paramsData: {
                    inputTerm: [{ field: 'startTime', value: this.customTime[0] }, { field: 'endTime', value: this.customTime[1] }],
                    sqlTerm: this.searchType === 'sql' ? this.sqlTermData : '',
                    filterTerm: this.conditionData.map(it => it.origin[0]),
                    logType: this.get_params.topId,
                    fields: this.list.map(it => it.fieldName)
                }
            }
            if (this.exactId) {
                data.paramsData.inputTerm.push({
                    field: 'dt',
                    value: this.exactId
                })
            }
            if (this.searchType === 'normal') {
                if (this.get_params.topId === '1') {
                    for (const key in this.safeLogForm) {
                        data.paramsData.inputTerm.push({
                            field: key,
                            value: this.safeLogForm[key]
                        })
                    }
                } else if (this.get_params.topId === '2') {
                    for (const key in this.hostLogForm) {
                        data.paramsData.inputTerm.push({
                            field: key,
                            value: this.hostLogForm[key]
                        })
                    }
                } else if (this.get_params.topId === '3') {
                    for (const key in this.flowLogForm) {
                        data.paramsData.inputTerm.push({
                            field: key,
                            value: this.flowLogForm[key]
                        })
                    }
                } else if (this.get_params.topId === '4') {
                    for (const key in this.applicationLogForm) {
                        data.paramsData.inputTerm.push({
                            field: key,
                            value: this.applicationLogForm[key]
                        })
                    }
                }
            }
            getTableChart(data).then(res => {
                this.logs_total = res.total ?? 0
                this.chartData = res.detail ?? []
                this.log_loading = false
                console.log('图表', res)
            }).catch(error => {
                this.log_loading = false
                console.log('error' + error)
            })
        },
        get_data() {
            this.loading = true

            if (this.barStatus === 1) {
                this.barStatus = 0
                this.$refs.progressBar.restart()
            } else {
                this.barStatus = 0
                this.$refs.progressBar.start()
            }

            let data = {
                queryData: {
                    page: this.get_params.page,
                    pageSize: this.get_params.size
                },
                paramsData: {
                    inputTerm: [{ field: 'startTime', value: this.customTime[0] }, { field: 'endTime', value: this.customTime[1] }],
                    sqlTerm: this.searchType === 'sql' ? this.sqlTermData : '',
                    filterTerm: this.conditionData.map(it => it.origin[0]),
                    logType: this.get_params.topId,
                    fields: this.list.map(it => it.fieldName)
                }
            }
            if (this.exactId) {
                data.paramsData.inputTerm.push({
                    field: 'dt',
                    value: this.exactId
                })
            }
            if (this.searchType === 'normal') {
                if (this.get_params.topId === '1') {
                    for (const key in this.safeLogForm) {
                        data.paramsData.inputTerm.push({
                            field: key,
                            value: this.safeLogForm[key]
                        })
                    }
                } else if (this.get_params.topId === '2') {
                    for (const key in this.hostLogForm) {
                        data.paramsData.inputTerm.push({
                            field: key,
                            value: this.hostLogForm[key]
                        })
                    }
                } else if (this.get_params.topId === '3') {
                    for (const key in this.flowLogForm) {
                        data.paramsData.inputTerm.push({
                            field: key,
                            value: this.flowLogForm[key]
                        })
                    }
                } else if (this.get_params.topId === '4') {
                    for (const key in this.applicationLogForm) {
                        data.paramsData.inputTerm.push({
                            field: key,
                            value: this.applicationLogForm[key]
                        })
                    }
                }
            }
            getList(data, this.cancelObj).then(res => {
                /* 标记重新初始化*/
                this.recordTopId = this.get_params.topId
                this.requestFlag = false
                console.log('数据查询列表', res)
                this.tableData = []

                this.loading = false
                this.barStatus = 1
                let arr = res.records
                if (arr.length > 0) {
                    this.tableData = this.$lodash.cloneDeep(arr)
                } else if (arr.length === 0) {
                    if (this.get_params.page > 1) {
                        this.get_params.page = this.get_params.page - 1
                        this.get_data()
                    }
                }
                setTimeout(() => {
                    this.$refs.tableContent.filterKeyword()
                }, 100)
            }).catch(error => {
                this.loading = false
                this.barStatus = 2
                console.log('error' + error)
            })
        },
        getTopFieldFun(params) {
            this.rankData = []
            this.topLoading = true
            let data = {
                queryData: {},
                paramsData: {
                    inputTerm: [{ field: 'startTime', value: this.customTime[0] }, { field: 'endTime', value: this.customTime[1] }],
                    sqlTerm: this.searchType === 'sql' ? this.sqlTermData : '',
                    filterTerm: this.conditionData.map(it => it.origin[0]),
                    logType: this.get_params.topId,
                    fields: params.fields,
                    orderType: params.orderType
                }
            }
            if (this.searchType === 'normal') {
                if (this.get_params.topId === '1') {
                    for (const key in this.safeLogForm) {
                        data.paramsData.inputTerm.push({
                            field: key,
                            value: this.safeLogForm[key]
                        })
                    }
                } else if (this.get_params.topId === '2') {
                    for (const key in this.hostLogForm) {
                        data.paramsData.inputTerm.push({
                            field: key,
                            value: this.hostLogForm[key]
                        })
                    }
                } else if (this.get_params.topId === '3') {
                    for (const key in this.flowLogForm) {
                        data.paramsData.inputTerm.push({
                            field: key,
                            value: this.flowLogForm[key]
                        })
                    }
                } else if (this.get_params.topId === '4') {
                    for (const key in this.applicationLogForm) {
                        data.paramsData.inputTerm.push({
                            field: key,
                            value: this.applicationLogForm[key]
                        })
                    }
                }
            }
            this.rankMarkField = params.fields[0]
            getTopField(data).then(res => {
                console.log('Top10列表', res)
                if (res && res.length && res[0][this.rankMarkField] !== undefined) {
                    this.rankData = res ?? []
                }
                this.topLoading = false
            }).catch(error => {
                console.log('error' + error)
                this.topLoading = false
            })
        },
        handleDel(row) {
            this.deleteId = row.id
            this.delDialog = true
        },
        searchSQLCon() {
            this.get_paramsSave.page = 1
            this.get_dataSave()
        },
        handleSave(row) {
            console.log(row)
            this.saveData = this.$deepCopy(row)
            this.saveDialog = true
            this.historySave = true
        },

        handleSizeChange(val) {
            this.get_params.size = val
            this.get_data()
        },
        handleCurrentChange(val) {
            this.get_params.page = val
            this.get_data()
        },

        handleSizeChangeSave(val) {
            this.get_paramsSave.size = val
            this.get_dataSave()
        },
        handleCurrentChangeSave(val) {
            this.get_paramsSave.page = val
            this.get_dataSave()
        },

        handleSizeChangeHistory(val) {
            this.get_paramsHistory.size = val
            this.get_dataHistory()
        },
        handleCurrentChangeHistory(val) {
            this.get_paramsHistory.page = val
            this.get_dataHistory()
        },
        twoStr(n) {
            return n < 10 ? '0' + n : n
        },
        getCurrentDay() {
            let myDate = new Date()
            let day = myDate.getFullYear() + '-' + this.twoStr(myDate.getMonth() + 1) + '-' + this.twoStr(myDate.getDate())
            return day
        },
        getCurrentWeek() {
            let myDate = new Date()
            let day = myDate.getFullYear() + '-' + this.twoStr(myDate.getMonth() + 1) + '-' + this.twoStr(myDate.getDate())
            return day
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/css/pacap.scss';
.event-wrapper{
    border-top: none;
    border-radius: 0 0 4px 4px;
    box-shadow: 0px 0px 0px 0px rgb(140 152 164 / 20%);
}
.ub-wrap {
    flex-wrap: wrap;
}
.event .sql-btn {
    width: 30px;
    height: 30px;
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
                ::v-deep .el-select {
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
            color:rgba(0,0,0,0.4);
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
.sql-box {
    margin-top: 5px;
}
.split-line {
    width: 100%;
    height: 1px;
    position: absolute;
    left: 0;
    bottom: 50px;
    background: #dcdcdc;
}
.progress-box {
    height: 24px;
    position: relative;
    .chart-title {
        border-radius: 4px 0 0 0;
        position: absolute;
        height: 24px;
        line-height: 24px;
        font-size: 12px;
        color: rgba(255,255,255,.6);
        top: 0;

        div:nth-child(1) {
            padding:0 10px;
            // width: 80px;
            cursor: pointer;
        }
        div.active {
             border-radius: 4px 0 0 0;
            //background-color: #008aff;
            color: #0052d9;
            background-color: rgba(255, 255, 255, 0.5);
            // box-shadow: 0 0 12px rgba(0,180,255,.9) inset;
        }
        .icon-select::before {
            display:inline-block;
            transform: rotate(-180deg);
            transition: .4s;
            transform-origin: center;
        }
        .icon-select1::before {
            display:inline-block;
            transition: .4s;
            transform-origin: center;
        }
    }
}
.fold-box {
    height: 24px;
    line-height: 24px;
    padding-right: 20px;
    box-sizing: border-box;
    color: #fff;
    cursor: pointer;
}
.expert ::v-deep .vue-treeselect__limit-tip-text {
    border: 1px solid #00e9ff;
    color: #00e9ff;
    border-radius:2px;
    padding: 0 2px;
}
.expert ::v-deep .vue-treeselect__limit-tip {
    padding-top: 0;
}
.fields-ver-line {
    width: 2px;
    height: 26px;
    position: absolute;
    left: -8px;
    top: 0;
    background-color: #ffffff;
    box-shadow: 0px 0px 4px 0px #00d0ff,
    0px 0px 6px 0px #00d0ff;
    border-radius: 1px;

}
.expert ::v-deep .el-input-group__append {
    background-color: rgba(0, 0, 0, 0);
    display: table-cell;
    position: relative;
    border: none;
    border-radius: 4px;
    padding: 0 20px;
    width: 1px;
    box-sizing: border-box;
    margin-left: -1px;
}

.expert ::v-deep .el-input-group__append button.el-button,
.expert ::v-deep .el-input-group__append div.el-select .el-input__inner,
.expert ::v-deep .el-input-group__append div.el-select:hover .el-input__inner,
.expert ::v-deep .el-input-group__prepend button.el-button,
.expert ::v-deep .el-input-group__prepend div.el-select .el-input__inner,
.expert ::v-deep .el-input-group__prepend div.el-select:hover .el-input__inner {
    height: 28px;
    // background-color: rgb(4, 33, 54);
    // box-shadow: inset 0px 0px 7px 0px #389bf7;
    border-radius: 0px 2px 2px 0px;
    // border: solid 1px #0052D9;
    box-sizing: border-box;
    // border-left: 1px solid rgba(0, 0, 0, 0);

    i.el-icon-search {
        // color: #0052D9;
    }
}

.expert ::v-deep .el-tabs__item {
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    padding-left: 20px !important;
    color: rgba(0,0,0,0.6);
}

.expert ::v-deep .el-tabs__item.is-active {
    color: #0052d9;
}

.expert ::v-deep .el-tabs__active-bar {
    height: 1px;
    background-color: #0052d9;
}

.expert ::v-deep .el-tabs__nav-wrap::after {
    height: 1px;
    background-color: rgba(210, 216, 57, 0.2);
}

.expert ::v-deep .el-form-item__label {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.9);
}

.popper-item {
    line-height: 30px;
    text-align: center;
    background-color: #1a5c92;
    font-size: 12px;
    color: #ffffff;
    cursor: pointer;
}

.popper-item.active {
    background-color: rgba(0, 186, 255, 0.73);
    font-size: 12px;
    color: #00fffc;
}

.add_expert {
    width: 80px;
    height: 30px;
    color: #63e6ff;
    box-sizing: border-box;
    background-image: url(../../../assets/img/XZWJ.png);
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% 100%;
    opacity: .8;
}
.add_expert:hover{
    color: #63e6ff!important;
    opacity: 1;
}
.export {
    font-size: 12px;
    background-image: url(../../../assets/img/export_bg.png);
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% 100%;
}

.export1 {
    font-size: 12px;
    background-image: url(../../../assets/img/add_expert.png);
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% 100%;
}

.export ::v-deep span,
.export1 ::v-deep span {
    margin-left: 5px;
}

.el-form-item {
    margin-bottom: 0;
}
.alarm-from .el-form-item {
    margin-bottom: 22px;
}
.expert ::v-deep .el-icon-date {
    color:#0034b5;
}

.search-fileds-box ::v-deep .el-form-item {
    margin-bottom: 10px;
}

.add_expert:hover,
.export:hover,
.export1:hover {
    color: #fff;
}

.field-del-icon {
    display: inline-block;
    width: 20px;
    height: 20px;
    cursor: pointer;
    vertical-align: middle;
    font-size: 0px;
    text-align: center;

    >i {
        color: #0052D9;
        font-size: 16px;
        line-height: 18px;
    }
}

.search-option {
    padding-left: 100px;
}

.search-option ::v-deep .el-button--text {
    color: #0052D9;
}

.search-list-btn {
    // margin-top: -10px;

    >div {
        cursor: pointer;
        margin: 0 10px;
    }
}

.search-list-btn i {
    font-size: 12px;
    color: #00e9ff;
    margin-right: 5px;
}

.search-list-btn span {
    font-size: 12px;
    color: #00e9ff;
}

.chart-desc {
    font-size: 12px;
    line-height: 36px;
    color: #ffffff;
}
.event ::v-deep .el-input--small .el-input__inner{
    height: 32px;
    line-height: 32px;
}
.expert ::v-deep .el-radio__label,
.expert ::v-deep .el-checkbox__label {
    font-size: 12px;
}
.chart-num-box {
    margin-right: 10px;
    padding-left: 20px;
    box-sizing: border-box;

    >div:nth-child(1) {
        font-size: 12px;
        line-height: 15px;
         color:rgba(0,0,0,0.9);
    }

    >div:nth-child(2) {
        margin-top: 10px;
        font-size: 12px;
        color: rgba(0,0,0,0.9);
        bottom: 6px;
        // text-shadow: 0px 0px 10px rgba(247, 232, 0, 0.9);
    }
    .chart-bg {
        width: 120px;
        height: 40px;
        background-image: url('../../../assets/img/data_manage/chart_three.png');
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
       opacity: 0.5;
    }
}
.chart-bg-two {
        position: absolute;
        width: 40px;
        height: 40px;
        // background-image: url('../../../assets/img/data_manage/chart_two.png');
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        top: -4px;
        opacity: 0.5;

    }
.chart-bg-three {
        position: absolute;
        width: 40px;
        height: 40px;
        // background-image: url('../../../assets/img/data_manage/chart_one.png');
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        bottom: -8px;
        right: -19px;
        opacity: 0.5;

    }

.expert-left {
    width: 200px;
    padding: 8px 10px;
    background-color: #07101a;
    border: solid 1px rgba(80, 176, 255, 0.4);
    box-sizing: border-box;
    margin-right: 10px;
}

.expert-right {
    padding: 10px;
    background-color: #07101a;
    border: solid 1px rgba(80, 176, 255, 0.4);

}

.left-title {
    font-size: 14px;
    color: #ffffff;
}

.reset-btn, .sql-btn{
    width: 80px;
    height: 30px;
    // background-color: #041f38;
    // box-shadow: inset 0px 0px 10px 0px
    // rgba(0, 167, 245, 0.97);
    border: solid 1px #0052d9;
    font-size: 12px;
    line-height: 15px;
    letter-spacing: 1px;
    color: #0034b5;
    border-radius: 5px;
    margin-left: 10px;
    cursor: pointer;
    box-sizing: border-box;
}

.search-btn ::v-deep .btn {
    width: 80px;
    height: 30px;
    border: none;
    background: none;
    background-image: url(../../../assets/img/expert_search_btn.png);
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;

    i {
        display: none;
    }
}
.chart-wrapper {
    width: 100%;
    box-sizing: border-box;
    background: #dadee8;
    border-radius: 4px;
    // border: solid 1px rgba(80, 176, 255, 0.4);
    // background-image: url(../../../assets/img/log_num.png);
    // background-size: cover;
    // background-repeat: no-repeat;
    // background-position: left top;
    ::v-deep .el-loading-spinner{
        top:40px !important;
    }
}

.left-tip {
    margin-top: 10px;
    font-size: 0;

    >i {
        vertical-align: middle;
        font-size: 12px;
        color: #0052D9;
        margin-right: 5px;
    }

    >span {
        vertical-align: middle;
        font-size: 10px;
        color: #0052D9;
    }
}

.list-group {
    min-height: 26px;

}

.list-title {
    width: 170px;
    height: 26px;
    margin: 0 auto;
    background-image: url(../../../assets/img/field_bg.jpg);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: left top;
}

.list-group-item {
    color: #FFFFFF;
    cursor: move;
    margin: 8px 0;
    // padding:0 10px;
    box-sizing: border-box;
}

.list-group-item1 {
    color: #FFFFFF;
    margin: 8px 0;
    // padding:0 10px;
    box-sizing: border-box;
}

.list-group-item i,
.list-group-item1 i {
    cursor: pointer;
}

.open-box,
.close-box {
    width: 26px;
    height: 100%;
    color: #0052D9;
    text-align: center;
    line-height: 26px;
}

.list-inner-tip {
    font-size: 12px;
    line-height: 15px;
    color: #0052D9;
    margin: 6px 0;
}

.list-inner {
    width: 170px;
    margin: 0 auto;
}

.condition-box {
    width: 1000px;
    padding-bottom: 20px;
    overflow-y: auto;
    position: absolute;
    left: 0;
    top: 106%;
    z-index: 999;
    background-color: #033254;
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.8),
    inset 0px 0px 6px 0px rgba(0, 186, 255, 0.73);
    border-radius: 2px;
    border: solid 1px #0052D9;
}

.condition-area {
    position: absolute;
    left: 80px;
    right: 0;
    top: 27px;
    z-index: 1000;
    background-color: #fff;
    padding: 20px;
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    border: solid 1px #dcdcdc;
    transition: all .3s;
    padding-bottom:40px;
    .footer {
        position: absolute;
        bottom: 1px;
        right: 10px;
        padding-bottom:10px;
    }
}

.attendance-list {
    margin-top: 0;
    height: -webkit-calc(100vh - 126px);
    height: -moz-calc(100vh - 126px);
    height: -ms-calc(100vh - 126px);
    height: calc(100vh - 126px);
    box-sizing: border-box;
    padding: 0 10px;
}

.pagination {
    padding: 30px 0 20px;
    text-align: right;
}

.el-input.ips {
    display: block;
    width: 100%;
}

.drawer-pad {
    padding: 0 20px;
}

.event ::v-deep .el-range-input {
    background-color: rgba(0, 0, 0, 0);
    color: #fff;
}

.event ::v-deep .el-range-separator {
    color: #fff;
}

.event ::v-deep .el-radio__inner {
    background-color: transparent;
}

.event ::v-deep .el-radio__label {
    color: #fff;
}

.event ::v-deep .el-radio__input.is-checked+.el-radio__label {
    color: #409EFF;
}

.event ::v-deep .el-radio__input.is-disabled .el-radio__inner,
.event ::v-deep .el-radio__input.is-disabled.is-checked .el-radio__inner {
    border-color: #409EFF;
    background: transparent;
}
.search ::v-deep .el-tag.el-tag--info{
    background-color: rgba(0,0,0,0);
    border-color: #0052D9;
    color: #0052D9;
}
.search ::v-deep .el-tag.el-tag--info .el-tag__close{
    color: #0052D9;
    font-size:14px!important;
}
.search ::v-deep .el-select .el-tag__close.el-icon-close{
    background-color:rgba(0,0,0,0);
}
.option a {
    margin: 0 3px;
}

.switch-wrapper {
    width: 68px;
    height: 28px;
    position: relative;
    cursor: pointer;
}

.switch-wrapper>div:nth-child(1) {
    width: 68px;
    height: 28px;
    background-color: #001a2c;
    box-shadow: inset 0px 0px 7px 0px #000000;
    border-radius: 14px;

    div {
        font-size: 14px;
        line-height: 28px;
        padding: 0 8px;
    }

    >div:nth-child(1) {
        color: #00d7ff;
        opacity: 0.6;
    }

    >div:nth-child(2) {
        color: #ffaa47;
        opacity: 0.6;
    }
}

.switch-wrapper>div:nth-child(2) {
    width: 32px;
    height: 32px;
    position: absolute;
    left: 0;
    top: 50%;
    margin-top: -16px;
    border-radius: 100%;
}

.switch-wrapper.yes>div:nth-child(2) {
    animation: moveone .3s linear forwards;
}

.switch-wrapper.no>div:nth-child(2) {
    animation: _moveone .3s linear forwards;
}

@keyframes moveone {
    0% {
        background-color: #fa941c;
        box-shadow: 0px 0px 10px 0px #9c5603;
        left: 0;
    }

    100% {
        background-color: #0052D9;
        box-shadow: 0px 0px 10px 0px #058fa9;
        left: 36px;
    }
}

@-webkit-keyframes moveone {
    0% {
        background-color: #fa941c;
        box-shadow: 0px 0px 10px 0px #9c5603;
        left: 0;
    }

    100% {
        background-color: #0052D9;
        box-shadow: 0px 0px 10px 0px #058fa9;
        left: 36px;
    }
}

@keyframes _moveone {
    0% {
        background-color: #0052D9;
        box-shadow: 0px 0px 10px 0px #058fa9;
        left: 36px;
    }

    100% {
        background-color: #fa941c;
        box-shadow: 0px 0px 10px 0px #9c5603;
        left: 0;
    ;
    }
}

@-webkit-keyframes _moveone {
    0% {
        background-color: #0052D9;
        box-shadow: 0px 0px 10px 0px #058fa9;
        left: 36px;
    }

    100% {
        background-color: #fa941c;
        box-shadow: 0px 0px 10px 0px #9c5603;
        left: 0;
    ;
    }
}
div.table-expand::-webkit-scrollbar {
    width: 0px;
    height: 5px;
}
div ::v-deep .vue-treeselect__single-value {
    line-height: 30px;
}
.white-theme .btn_box {
    background-image: none !important;
    background: #3aa6e4 !important;
    border-radius: 4px !important;
    color: #fff !important;
}
</style>
<style lang="scss">
.vue-treeselect--single .vue-treeselect__option--selected {
    font-weight: normal !important;
}
// .vue-treeselect__control{
//         height: 28px;
//         line-height: 28px;
//         font-size: 12px;
// }
// .vue-treeselect__input{
//         vertical-align: middle;
// }
</style>
