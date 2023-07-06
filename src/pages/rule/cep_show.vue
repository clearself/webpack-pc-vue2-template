<template>
    <div class="container rules-page" id="container" v-loading.lock="loading" element-loading-text="规则处理中......" style="position:relative">
        <div class="even-content starWrapper" style="height:90.5vh;overflow-y:auto;position:relative;overflow-x:hidden;padding-bottom:200px !important">
            <div
                class="list-tip"
                style="display: block;position:fixed;top:90px;z-index: 100;width: 80%;height: 42px;background: #fff;line-height: 42px;margin-top:-9px;">规则编辑
            </div>
            <div class="title-line mt-3">
                <span class="title-name">基础信息</span>
            </div>
            <div class="rulesForm tree">
                <el-form ref="rulesForm" :model="eventData" label-width="100px" label-position="top" style="margin-left:-20px">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="规则名称：" prop="name" :rules="{required: true, message: '规则名称不能为空', trigger: 'blur'}" style="margin-bottom: 16px;width: 92%" class="first">
                                <el-input style="width: 100%" v-model="eventData.name" :disabled="isEdit && isExtend" placeholder="请输入规则名称" size="small"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="规则分组：" style="margin-bottom: 16px;width: 92%">
                                <div class="select-box ruleName">
                                    <div style="cursor:pointer;" class="ub ub-ac select-title" @click.stop="onOff=!onOff">
                                        <div class="ub ub-f1 ub-ac" style="text-indent: 14px;font-size: 12px;line-height: 30px;"><span style="opacity: 0.7;font-size: 12px" v-if="!currentGroup">请选择</span>{{currentGroup}}</div>
                                        <div style="width:30px;height:30px;text-align: center;line-height: 30px;">
                                            <i style="color:rgba(0,0,0,0.4);" :class="{'el-icon-arrow-up':onOff,'el-icon-arrow-down':!onOff}"></i>
                                        </div>
                                    </div>
                                    <div v-show="onOff" class="select-mask">
                                        <el-tree
                                            show-checkbox
                                            ref="tree"
                                            node-key="id"
                                            :default-expand-all="true"
                                            :highlight-current="true"
                                            :data="treeData"
                                            :props='propsData'
                                            @node-click="handleNodeClick"
                                            :check-strictly="true"
                                            :expand-on-click-node="false"
                                            :indent='indent'
                                            @check-change="handleClick">
                                            <span class="custom-tree-node" slot-scope="{node}">
                                                <span style="font-size:12px;">{{ node.label }}</span></span>
                                        </el-tree>
                                    </div>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="规则描述：" style="margin-bottom: 20px;width: 92%">
                                <el-input class="w500" type="textarea" :rows="3" v-model="eventData.des" placeholder="请输入" size="small"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="是否启用：" style="margin-bottom: 20px;width: 40%">
                        <div class="switch-wrapper" :class="{'yes':eventData.status,'no':!eventData.status}"  @click="changeStatus">
                            <div class="ub ub-ac ub-pj" :style="{'background':eventData.status?'#0052d9':'#c5c5c5'}">
                                <div>是</div>
                                <div>否</div>
                            </div>
                            <div class="circle"></div>
                        </div>
                    </el-form-item>
                </el-form>

                <div class="title-line" style="margin-bottom:20px">
                    <span class="title-name">条件信息</span>
                </div>
                <div class="tab-wrapper" style="margin-left:-20px">
                    <!-- <p style="width: 86px;font-size: 12px;color: rgba(0,0,0,.9)" class="mb-1">规则条件：</p> -->
                    <div class="handleArea" style="min-height: 510px;margin-bottom: 10px;">
                        <el-tabs v-model="activeName">
                            <el-tab-pane label="模 型" name="first" style="overflow-x:auto;">
                                <div style="width: calc(100%)">
                                    <div class="handleTile" style="color: #fff;">
                                        <div style="margin-left: 30px;position: relative">
                                            <i @click.stop="toogleAll" :class="{'el-icon-caret-right': true, 'is-show': true, 'fold-arrow': true}" style="position: absolute;cursor: pointer;left: -20px;color:#387dee;font-size:18px"></i>
                                            <el-dropdown trigger="click" style="margin-bottom: 20px">
                                                <el-button type="primary" size="mini" style="background-color: transparent !important;background-image: none !important;border:none">
                                                </el-button>
                                                <el-dropdown-menu v-show="false" slot="dropdown" :append-to-body="false">
                                                    <el-dropdown-item v-show="false" data-type="1" @click.native="selectChange">AND</el-dropdown-item>
                                                </el-dropdown-menu>
                                            </el-dropdown>
                                            <div class="tree-line-vertical">
                                                <div v-for="(item, index) in eventData.sourceList" :key="index" class="bg-area">
                                                    <div class="one-type" v-if="item.type == 0">
                                                        <div class="tree-title ub ub-ac">
                                                            <i @click.stop="toogleChild" :class="{'el-icon-caret-right': true, 'is-show': true, 'fold-arrow': true}" style="position: absolute;cursor: pointer;color:#387dee;font-size:18px"></i>
                                                            <el-select
                                                                v-model="item.factType"
                                                                placeholder="请输入"
                                                                size="mini"
                                                                style="width: 160px"
                                                                @change="eventChange(item)"
                                                                :popper-append-to-body="false"
                                                                popper-class="select-option innerSelect">
                                                                <el-option v-for="(_item,_index) in testData" :value="_item.value" :label="_item.label" :key="_index"></el-option>
                                                            </el-select>
                                                            <div class="box-title" v-if="item.objBindName || slideWindow_sourceList[index].slideValue || after_sourceList[index].afterType">
                                                                <span v-if="item.objBindName">事件变量名：</span><span class="switch-color" style="color: #03864f">{{item.objBindName}}</span>
                                                                <span v-if="slideWindow_sourceList[index].slideValue" style="margin-left: 5px">滑动窗口：</span><span class="switch-color" style="color: #03864f">{{timeToStr(slideWindow_sourceList[index].slideValue)}}</span>
                                                                <span v-if="after_sourceList[index].afterValue" style="margin-left: 10px">时序变量名：</span><span class="switch-color" style="color: #03864f">{{after_sourceList[index].afterValue}}</span>
                                                                <span v-if="after_sourceList[index].afterType" style="margin-left: 5px">时间：</span><span class="switch-color" style="color: #03864f">{{timeToShow(after_sourceList[index].afterType)}}</span>
                                                            </div>
                                                            <div class="operate-btn" style="position: relative;margin-left: 10px">

                                                                <el-tooltip
                                                                    class="item"
                                                                    popper-class="atooltip"
                                                                    effect="dark"
                                                                    content="属性"
                                                                    placement="top">
                                                                    <i class="iconfont icon-shuxing" style="color:#387dee" @click="openEventAttributeDialog(item, index)"></i>
                                                                </el-tooltip>

                                                                <el-dropdown trigger="click">
                                                                    <el-tooltip
                                                                        class="item"
                                                                        popper-class="atooltip"
                                                                        effect="dark"
                                                                        content="向下添加"
                                                                        placement="top">
                                                                        <i class="iconfont icon-xiangxiatianjia" style="font-size: 12px;color: #387dee;margin-right: 10px;cursor: pointer;"></i>
                                                                    </el-tooltip>
                                                                    <el-dropdown-menu slot="dropdown" :append-to-body="false">
                                                                        <el-dropdown-item data-type="1" @click.native="addEventData_down($event, index)">数据源</el-dropdown-item>
                                                                        <el-dropdown-item data-type="2" @click.native="addEventData_down($event, index)">累计</el-dropdown-item>
                                                                    </el-dropdown-menu>
                                                                </el-dropdown>

                                                                <el-dropdown trigger="click">
                                                                    <el-tooltip
                                                                        class="item"
                                                                        popper-class="atooltip"
                                                                        effect="dark"
                                                                        content="向上添加"
                                                                        placement="top">
                                                                        <i class="iconfont icon-xiangshangtianjia" style="font-size: 12px;color: #387dee;margin-right: 10px;cursor: pointer;"></i>
                                                                    </el-tooltip>
                                                                    <el-dropdown-menu slot="dropdown" :append-to-body="false">
                                                                        <el-dropdown-item data-type="1" @click.native="addEventData_up($event, index)">数据源</el-dropdown-item>
                                                                        <el-dropdown-item data-type="2" @click.native="addEventData_up($event, index)">累计</el-dropdown-item>
                                                                    </el-dropdown-menu>
                                                                </el-dropdown>

                                                                <el-tooltip
                                                                    class="item"
                                                                    popper-class="atooltip"
                                                                    effect="dark"
                                                                    content="删除"
                                                                    placement="top">
                                                                    <i class="el-icon-close" style="color:#387dee" @click="deleteEventData(index)"></i>
                                                                </el-tooltip>

                                                                <el-popover
                                                                    class="add-step-popover"
                                                                    ref="add-step-popover"
                                                                    popper-class="popover-select2"
                                                                    :popper-options="{
                                                                        boundariesElement: 'body',
                                                                        gpuAcceleration: true,
                                                                        positionFixed: true,
                                                                        preventOverflow: true
                                                                    }"
                                                                    z-index="2"
                                                                    placement="top"
                                                                    title=""
                                                                    width="200"
                                                                    trigger="hover">
                                                                    <div class="inner-note">
                                                                        <el-input
                                                                            type="textarea"
                                                                            :rows="2"
                                                                            :disabled="noteFlag"
                                                                            size="mini"
                                                                            placeholder="请输入注释"
                                                                            v-model="item.note">
                                                                        </el-input>
                                                                        <p style="text-align: right; padding-right: 5px;">
                                                                            <i style="font-size: 14px;color:rgba(0,0,0,.6);" v-if="noteFlag" class="iconfont icon-bianji" @click="noteFlag = !noteFlag"></i>
                                                                            <i style="font-size: 14px;color:#387dee;" v-if="!noteFlag" class="iconfont icon-baocun" @click="noteFlag = !noteFlag"></i>
                                                                        </p>
                                                                    </div>

                                                                    <i slot="reference" class="iconfont icon-zhushi" style="color:#387dee;"></i>
                                                                </el-popover>

                                                            </div>
                                                        </div>
                                                        <drools_tree_data
                                                            :constraintList="item.constraintList"
                                                            :variate_arr="variate_arr"
                                                            @upResource="upResource"
                                                            @upFields="upFields"
                                                            :testData="testData"
                                                            :factType="item.factType"
                                                            first="true"
                                                            style="margin-left: 52px; margin-top: 10px;position: relative;display: flex;flex-direction: column">
                                                        </drools_tree_data>
                                                    </div>

                                                    <div class="two-type" v-if="item.type == 1">
                                                        <div class="tree-title ub ub-ac">
                                                            <i @click.stop="toogleChild_count" :class="{'el-icon-caret-right': true, 'is-show': true, 'fold-arrow': true}" style="position: absolute;cursor: pointer;left: -20px;color: #387dee;font-size:18px"></i>
                                                            <div class="time-title">
                                                                <span>累积</span>
                                                            </div>
                                                            <div class="box-title" v-if="item.countMap.constraintList[0].fieldBindName || item.countMap.constraintList[0].operator || item.countMap.constraintList[0].value">
                                                                <span v-if="item.countMap.constraintList[0].fieldBindName">变量名：</span><span class="switch-color" style="color: #d4d116">{{item.countMap.constraintList[0].fieldBindName}}</span>
                                                                <span v-if="item.countMap.constraintList[0].operator" style="margin-left: 5px">运算符：</span><span class="switch-color" style="color: #d4d116">{{item.countMap.constraintList[0].operator}}</span>
                                                                <span v-if="item.countMap.constraintList[0].operator" style="margin-left: 5px">数量：</span><span v-if="item.countMap.constraintList[0].operator" class="switch-color" style="color: #d4d116">{{item.countMap.constraintList[0].value}}</span>
                                                            </div>
                                                            <div class="operate-btn" style="margin-left: 10px">
                                                                <el-tooltip
                                                                    class="item"
                                                                    popper-class="atooltip"
                                                                    effect="dark"
                                                                    content="属性"
                                                                    placement="top">
                                                                    <i class="iconfont icon-shuxing" style="color: #387dee" @click="openAccmulateDialog(item, index)"></i>
                                                                </el-tooltip>

                                                                <el-dropdown trigger="click">
                                                                    <el-tooltip
                                                                        class="item"
                                                                        popper-class="atooltip"
                                                                        effect="dark"
                                                                        content="向下添加"
                                                                        placement="top">
                                                                        <i class="iconfont icon-xiangxiatianjia" style="font-size: 12px;color: #387dee;margin-right: 10px;cursor: pointer;"></i>
                                                                    </el-tooltip>
                                                                    <el-dropdown-menu slot="dropdown" :append-to-body="false">
                                                                        <el-dropdown-item data-type="1" @click.native="addEventData_down($event, index)">数据源</el-dropdown-item>
                                                                        <el-dropdown-item data-type="2" @click.native="addEventData_down($event, index)">累计</el-dropdown-item>
                                                                    </el-dropdown-menu>
                                                                </el-dropdown>

                                                                <el-dropdown trigger="click">
                                                                    <el-tooltip
                                                                        class="item"
                                                                        popper-class="atooltip"
                                                                        effect="dark"
                                                                        content="向上添加"
                                                                        placement="top">
                                                                        <i class="iconfont icon-xiangshangtianjia" style="font-size: 12px;color: #387dee;margin-right: 10px;cursor: pointer;"></i>
                                                                    </el-tooltip>
                                                                    <el-dropdown-menu slot="dropdown" :append-to-body="false">
                                                                        <el-dropdown-item data-type="1" @click.native="addEventData_up($event, index)">数据源</el-dropdown-item>
                                                                        <el-dropdown-item data-type="2" @click.native="addEventData_up($event, index)">累计</el-dropdown-item>
                                                                    </el-dropdown-menu>
                                                                </el-dropdown>

                                                                <el-tooltip
                                                                    class="item"
                                                                    popper-class="atooltip"
                                                                    effect="dark"
                                                                    content="删除"
                                                                    placement="top">
                                                                    <i class="el-icon-close" style="color:#387dee" @click="deleteEventData(index)"></i>
                                                                </el-tooltip>

                                                                <el-popover
                                                                    class="add-step-popover"
                                                                    ref="add-step-popover"
                                                                    popper-class="popover-select2"
                                                                    :popper-options="{
                                                                        boundariesElement: 'body',
                                                                        gpuAcceleration: true,
                                                                        positionFixed: true,
                                                                        preventOverflow: true
                                                                    }"
                                                                    z-index="2"
                                                                    placement="top"
                                                                    title=""
                                                                    width="200"
                                                                    trigger="hover">
                                                                    <div class="inner-note">
                                                                        <el-input
                                                                            type="textarea"
                                                                            :rows="2"
                                                                            :disabled="noteFlag"
                                                                            size="mini"
                                                                            placeholder="请输入注释"
                                                                            v-model="item.countMap.note">
                                                                        </el-input>
                                                                        <p style="text-align: right; padding-right: 5px;">
                                                                            <i style="font-size: 14px;color:#387dee;" v-if="noteFlag" class="iconfont icon-bianji" @click="noteFlag = !noteFlag"></i>
                                                                            <i style="font-size: 14px" v-if="!noteFlag" class="iconfont icon-baocun" @click="noteFlag = !noteFlag"></i>
                                                                        </p>
                                                                    </div>
                                                                    <i slot="reference" class="iconfont icon-zhushi" style="color:#387dee"></i>
                                                                </el-popover>
                                                            </div>
                                                        </div>
                                                        <div class="one-module tree-line-count" style="padding-left: 40px;position: relative">
                                                            <i @click.stop="toogleChild_countInner" :class="{'el-icon-caret-right': true, 'is-show': true, 'fold-arrow-inner': true}" style="position: absolute;cursor: pointer;color:red;font-size:18px;color:#387dee;left:72px"></i>
                                                            <div class="tree-title tree-title-accumulate ub ub-ac" style="margin-top: 10px">
                                                                <el-select
                                                                    v-model="item.factMap.factType"
                                                                    placeholder="请输入"
                                                                    size="mini"
                                                                    style="width: 160px;"
                                                                    :popper-append-to-body="false"
                                                                    @change="eventChange(item.factMap)"
                                                                    popper-class="select-option innerSelect">
                                                                    <el-option v-for="(_item,_index) in testData" :value="_item.value" :label="_item.label" :key="_index"></el-option>
                                                                </el-select>
                                                                <div class="box-title" v-if="item.factMap.objBindName || slideWindow_sourceList[index].slideValue || after_sourceList[index].afterType">
                                                                    <span v-if="item.factMap.objBindName">事件变量名：</span><span class="switch-color" style="color: #03864f">{{item.factMap.objBindName}}</span>
                                                                    <span v-if="slideWindow_sourceList[index].slideValue" style="margin-left: 5px">滑动窗口：</span><span class="switch-color" style="color: #03864f">{{timeToStr(slideWindow_sourceList[index].slideValue)}}</span>
                                                                    <span v-if="after_sourceList[index].afterValue" style="margin-left: 10px">时序变量名：</span><span class="switch-color" style="color: #03864f">{{after_sourceList[index].afterValue}}</span>
                                                                    <span v-if="after_sourceList[index].afterType" style="margin-left: 5px">时间：</span><span class="switch-color" style="color: #03864f">{{timeToShow(after_sourceList[index].afterType)}}</span>
                                                                </div>
                                                                <div class="operate-btn" style="margin-left: 10px">
                                                                    <el-tooltip
                                                                        class="item"
                                                                        popper-class="atooltip"
                                                                        effect="dark"
                                                                        content="属性"
                                                                        style="color:#387dee"
                                                                        placement="top">
                                                                        <i class="iconfont icon-shuxing" @click="openEventAttributeDialog(item.factMap, index)"></i>
                                                                    </el-tooltip>

                                                                    <el-popover
                                                                        class="add-step-popover"
                                                                        ref="add-step-popover"
                                                                        popper-class="popover-select2"
                                                                        :popper-options="{
                                                                            boundariesElement: 'body',
                                                                            gpuAcceleration: true,
                                                                            positionFixed: true,
                                                                            preventOverflow: true
                                                                        }"
                                                                        z-index="2"
                                                                        placement="top"
                                                                        title=""
                                                                        width="200"
                                                                        trigger="hover">
                                                                        <div class="inner-note">
                                                                            <el-input
                                                                                type="textarea"
                                                                                :rows="2"
                                                                                :disabled="noteFlag"
                                                                                size="mini"
                                                                                placeholder="请输入注释"
                                                                                v-model="item.factMap.note">
                                                                            </el-input>
                                                                            <p style="text-align: right; padding-right: 5px;">
                                                                                <i style="font-size: 14px" v-if="noteFlag" class="iconfont icon-bianji" @click="noteFlag = !noteFlag"></i>
                                                                                <i style="font-size: 14px;color:#387dee;" v-if="!noteFlag" class="iconfont icon-baocun" @click="noteFlag = !noteFlag"></i>
                                                                            </p>
                                                                        </div>

                                                                        <i slot="reference" class="iconfont icon-zhushi" style="color:#387dee"></i>
                                                                    </el-popover>
                                                                </div>
                                                            </div>
                                                            <drools_tree_data
                                                                @upResource="upResource"
                                                                @upFields="upFields"
                                                                :testData="testData"
                                                                :variate_arr="variate_arr"
                                                                :constraintList="item.factMap.constraintList"
                                                                :factType="item.factMap.factType"
                                                                first="true"
                                                                style="margin-left: 52px; margin-top: 10px;position: relative;display: flex;flex-direction: column">
                                                            </drools_tree_data>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div style="padding-left: 22px;height: 30px;margin-top: 10px;position: relative" class="tree-line-outer">
                                                <i class="el-icon-caret-right" style="color:#387dee;font-size:18px"></i>
                                                <el-dropdown trigger="click">
                                                    <i class="el-icon-circle-plus-outline" style="font-size: 16px;line-height: 30px;color: #387dee;cursor: pointer;margin-left:5px"></i>
                                                    <el-dropdown-menu slot="dropdown" :append-to-body="false">
                                                        <el-dropdown-item data-type="1" @click.native="addEventData">数据源</el-dropdown-item>
                                                        <el-dropdown-item data-type="2" @click.native="addEventData">累计</el-dropdown-item>
                                                    </el-dropdown-menu>
                                                </el-dropdown>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </el-tab-pane>
                            <el-tab-pane label="自定义" name="second">
                                <div v-if="this.activeName == 'second'">
                                    <codemirror ref="myCodemirror" v-model="eventData.define" :options="cmOptions" class="my-codemirror"></codemirror>
                                </div>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </div>
                <!-- 属性 -->
                <el-dialog
                    title="属性"
                    width="700px"
                    :visible.sync="eventAttributeDialog"
                    class="shuxing"
                    custom-class="common-dialog">
                    <el-form ref="addRuleAtt_Form" label-width="100px" label-position="top">
                        <el-form-item label="变量名：" style="margin-bottom: 10px" >
                            <el-input v-model.trim="boundName" placeholder="请输入以$开头的英文变量名" @blur="judgeBoundName(boundName)" size="small" style="width: 100%"></el-input>
                        </el-form-item>
                        <el-form-item label="滑动窗口：" style="margin-bottom: 10px">
                            <el-select
                                v-model="slideType"
                                placeholder="请选择"
                                popper-class="select-option"
                                style="width: 190px;"
                                clearable
                                size="small"
                                @change="slideValue = ''">
                                <el-option
                                    v-for="(item, index) in slidingWindow"
                                    :key="index"
                                    :value="item.value"
                                    :label="item.label">
                                </el-option>
                            </el-select>
                            <span style="color:#ddd;margin:0 9px" v-if="this.slideType ==='time' || this.slideType === 'length'">—-</span>
                            <el-time-picker
                                class="guding"
                                size="small"
                                v-model="slideValue"
                                v-if="this.slideType ==='time'"
                                key="a"
                                :picker-options="{selectableRange: '00:00:00 - 23:59:59'}"
                                style="width: 190px;"
                                value-format="H-m-s"
                                default-value="0"
                                placeholder="时/分/秒">
                            </el-time-picker>
                            <el-input
                                v-model="slideValue"
                                size="small"
                                v-if="this.slideType === 'length'"
                                placeholder="请输入"
                                style="width: 190px;"></el-input>
                        </el-form-item>
                        <el-form-item label="AFTER：" style="margin-bottom: 10px;">
                            <template style="padding-top: 0">
                                <el-select
                                    v-model="timeSign"
                                    placeholder="请选择"
                                    size="small"
                                    clearable
                                    popper-class="select-option"
                                    @change="afterType = ''"
                                    style="width: 190px;">
                                    <el-option
                                        v-for="(item, index) in timeList"
                                        :key="index"
                                        :value="item.value"
                                        :label="item.label">
                                    </el-option>
                                </el-select>
                            </template>
                            <span style="color:#ddd;margin:0 9px" v-if="timeSign === 'fixed'">—-</span>
                            <template>
                                <el-time-picker
                                    class="guding"
                                    v-model="afterType"
                                    v-if="timeSign === 'fixed'"
                                    size="small"
                                    key="ab"
                                    :picker-options="{selectableRange: '00:00:00 - 23:59:59'}"
                                    style="width: 190px;"
                                    value-format="H-m-s"
                                    default-value="0"
                                    placeholder="固定时间">
                                </el-time-picker>
                                <span style="color:#ddd;margin:0 9px">—-</span>
                                <el-time-picker
                                    is-range
                                    size="small"
                                    key="abc"
                                    v-if="timeSign==='range'"
                                    v-model="afterType"
                                    range-separator=""
                                    class="afterTimer suiji"
                                    start-placeholder="开始时间"
                                    end-placeholder="结束时间"
                                    value-format="H-m-s"
                                    default-value="0"
                                    placeholder="选择时间范围">
                                </el-time-picker>
                            </template>
                            <el-input v-model.trim="afterValue" size="small" @blur="judgeAfter(afterValue)" placeholder="变量名" style="width: 190px;"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="eventAttributeDialog=false" size="small">取消</el-button>
                        <el-button type="primary" @click="eventAttributeSuccess" size="small">确认</el-button>
                    </div>
                </el-dialog>
                <!-- 累计属性 -->
                <el-dialog
                    title="累计属性"
                    width="700px"
                    :visible.sync="accmulateDialog"
                    custom-class="common-dialog">
                    <el-form ref="addRuleAtt_Form" label-width="80px" label-position="top">
                        <el-form-item label="变量名：" style="margin-bottom: 10px" >
                            <el-input v-model.trim="accmulateForm.fieldBindName" @blur="judgeFieldBindName(accmulateForm.fieldBindName)" placeholder="请输入以$开头的英文变量名" size="small" style="width: 100%"></el-input>
                        </el-form-item>
                        <el-form-item label="数值：" style="margin-bottom: 10px" >
                            <el-select
                                v-model="accmulateForm.operator"
                                placeholder="请选择"
                                class="showKey1"
                                size="mini"
                                clearable
                                style="width: 190px;font-size: 12px"
                                popper-class="select-option showThen">
                                <el-option
                                    v-for="item in common_options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <span style="color:#ddd;margin:0 9px">—-</span>
                            <el-input-number v-model="accmulateForm.value" label="" :controls="false" style="width: 190px" :disabled="disIsAvg"></el-input-number>
                            <span class="ml-2"></span>
                            <el-checkbox v-model="accmulateForm.isAvg" @change="changeIsAvg">平均访问次数</el-checkbox>
                        </el-form-item>

                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="accmulateDialog=false" size="small">取消</el-button>
                        <el-button @click="accmulateDialogSuccess" size="small" type="primary">确认</el-button>
                    </div>
                </el-dialog>

                <el-dialog
                    title="资源池名称"
                    width="900px"
                    :visible.sync="resourceNameDialog"
                    custom-class="common-dialog pool-name">
                    <el-form ref="poolForm">
                        <el-form-item>
                            <el-input
                                v-model="get_params_resource.name"
                                @submit.native.prevent
                                placeholder="请输入资源名称"
                                style="width: 100%"
                                size="small"
                                clearable>
                                <el-button slot="append" style="color: rgba(0,0,0,.6)" icon="el-icon-search" @click="search_data_resource"></el-button>
                            </el-input>
                        </el-form-item>
                    </el-form>
                    <el-table
                        ref="multipleTable"
                        v-loading="loading_resource"
                        class='bigTable'
                        :data="tableData_resource"
                        :height="294"
                        border
                        stripe
                        tooltip-effect="dark"
                        :row-style="{ height: '32px' }"
                        :header-row-style="{ height: '32px' }">
                        <el-table-column align="center" type="index" width="50" :index="indexMethod_resource" label="序号">
                        </el-table-column>
                        <el-table-column prop="poolName" label="资源池名称" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column label="操作" align="center" width="80">
                            <template slot-scope="scope">
                                <el-button type="text" @click="addResourceName(scope.row)" size="small">选择</el-button>
                            </template>
                        </el-table-column>

                    </el-table>
                    <pagination v-show="total_num_resource>0" :total="total_num_resource" :page.sync="get_params_resource.page" :limit.sync="get_params_resource.size" @pagination="get_data_resource" />
                </el-dialog>

                <el-dialog
                    title="规则继承"
                    width="700px"
                    :visible.sync="extendRulesDialog"
                    custom-class="common-dialog pool-name">
                    <el-form ref="poolForm">
                        <el-form-item>
                            <el-input
                                v-model="get_params_extend.name"
                                @submit.native.prevent
                                placeholder="请输入规则名称"
                                style="width: 100%"
                                size="small"
                                clearable>
                                <el-button slot="append" style="color: #1cd7fa" icon="el-icon-search" @click="search_data_extend"></el-button>
                            </el-input>
                        </el-form-item>
                    </el-form>

                    <el-table
                        ref="multipleTable"
                        v-loading="loading_extend"
                        class='bigTable'
                        :data="tableData_extend"
                        border
                        stripe
                        tooltip-effect="dark"
                        :row-style="{ height: '32px' }"
                        :header-row-style="{ height: '32px' }">
                        <el-table-column align="center" type="index" width="50" :index="indexMethod_extend" label="序号">
                        </el-table-column>
                        <el-table-column prop="name" label="规则名称" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column label="操作" align="center" width="80">
                            <template slot-scope="scope">
                                <el-button type="text" @click="addExtendRules(scope.row)" size="small">选 择</el-button>
                            </template>
                        </el-table-column>

                    </el-table>
                    <pagination v-show="total_num_extend>0" :total="total_num_extend" :page.sync="get_params_extend.page" :limit.sync="get_params_extend.size" @pagination="get_data_extend" />
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="extendRulesDialog=false" size="small">取消</el-button>
                        <el-button type="primary" @click="clearExtend" size="small">清空</el-button>
                    </div>
                </el-dialog>

                <el-dialog
                    title="字段"
                    width="700px"
                    :visible.sync="fieldsDialog"
                    custom-class="common-dialog pool-name">
                    <el-form ref="fieldsForm">
                        <el-row>
                            <el-col   :span="12">
                                <el-form-item label="变量：" label-width="60px">
                                    <el-select size="mini" clearable v-model="fieldsType" @change="changeActive" filterable placeholder="请选择">
                                        <el-option v-for="(item,index) in variate_arr_one" :key="index" :label="item.var" :value="item.var"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col   :span="12" v-if="fieldsType">
                                <el-form-item label="字段名：" label-width="60px">
                                    <el-input placeholder="请输入" clearable v-model="searchKey" size="small" style="width:180px" @input="searchs">
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <el-table
                        ref="multipleTable"
                        class='bigTable innerTable'
                        :data="tableData_fields"
                        border
                        stripe
                        tooltip-effect="dark"
                        :row-style="{ height: '32px' }"
                        :header-row-style="{ height: '32px' }">
                        <el-table-column align="center" type="index" width="50" label="序号">
                        </el-table-column>
                        <el-table-column prop="name" label="字段名称">
                            <template slot-scope="{row}">
                                <span>{{row.name}}（{{row.field}}）</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center" width="80">
                            <template slot-scope="scope">
                                <el-button type="text" @click="addFields(scope.row)" size="small">选择</el-button>
                            </template>
                        </el-table-column>

                    </el-table>
                </el-dialog>

                <div class="title-line">
                    <span class="title-name">输出信息</span>
                </div>

                <div class="output-box">
                    <ul class="showcase_then" style="margin-left: -20px;padding-top:0px">
                        <li
                            v-for="(int, ind) in this.eventData.thenList"
                            :key="ind + 'c'">
                            <el-row type="flex" align="middle" justify="start">
                                <el-col :span="20">
                                    <el-row type="flex" align="middle">
                                        <p :class="{'is-required': ind<=2 || (['workOrderName', 'level', 'workMouldId', 'orderCreateUser'].includes(int.key) && eventData.thenList[8].value === '1'), 'required-msg': requiredFlag && int.value === ''}" v-if="ind <= 14">
                                            <el-select
                                                v-model="int.key"
                                                placeholder="请选择"
                                                class="showKey"
                                                size="mini"
                                                :disabled="true"
                                                style="font-size: 12px;width:90px !important;"
                                                popper-class="select-option showThen">
                                                <el-option
                                                    v-for="item in thenKey"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </p>
                                        <p v-if="ind > 14">
                                            <el-input
                                                v-model="int.key"
                                                placeholder="请输入"
                                                :disabled="false"
                                                clearable
                                                class="value"
                                                style="font-size: 12px;width:300px !important;"></el-input>
                                        </p>
                                        <p style="position: relative" v-if="!['reportStatus','reportType','reportLevel','attackResult','timeQua', 'isBanned','isStart','level','workMouldId','orderCreateUser', 'attChain', 'attCk'].includes(int.key)">
                                            <el-input
                                                v-model="int.value"
                                                placeholder="请输入"
                                                clearable
                                                class="value"
                                                style="font-size: 12px;width:300px !important;"></el-input>
                                            <el-tooltip
                                                class="item"
                                                v-if="int.key === 'workOrderName'"
                                                style="position: absolute;top:30%;left: 220px;"
                                                effect="dark"
                                                content="生成工单时工单名称后缀会追加随机数"
                                                placement="right">
                                                <i class="el-icon-question" style="color: #1cd7fa;"></i>
                                            </el-tooltip>
                                        </p>
                                        <p v-if="int.key === 'reportType'">
                                            <el-select
                                                v-model="int.value"
                                                placeholder="请选择"
                                                size="mini"
                                                class="value"
                                                style="font-size: 12px;width:300px !important;"
                                                popper-class="select-option showThen">
                                                <el-option
                                                    v-for="item in thenType"
                                                    :key="symbolKey(item.id)"
                                                    :label="item.name"
                                                    :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </p>
                                        <p v-if="int.key === 'isBanned'">
                                            <el-select
                                                v-model="int.value"
                                                placeholder="请选择"
                                                size="mini"
                                                class="value"
                                                style="font-size: 12px;width:300px !important;"
                                                popper-class="select-option showThen">
                                                <el-option label="否" value="0"></el-option>
                                                <el-option label="是" value="1"></el-option>
                                            </el-select>
                                        </p>
                                        <p v-if="int.key === 'isStart'">
                                            <el-select
                                                v-model="int.value"
                                                placeholder="请选择"
                                                size="mini"
                                                class="value"
                                                style="font-size: 12px;width:300px !important;"
                                                popper-class="select-option showThen">
                                                <el-option label="否" value="0"></el-option>
                                                <el-option label="是" value="1"></el-option>
                                            </el-select>
                                        </p>
                                        <p v-if="int.key === 'level'">
                                            <el-select
                                                v-model="int.value"
                                                placeholder="请选择"
                                                size="mini"
                                                clearable
                                                class="value"
                                                style="font-size: 12px;width:300px !important;"
                                                popper-class="select-option showThen">
                                                <el-option label="高" value="1"></el-option>
                                                <el-option label="中" value="2"></el-option>
                                                <el-option label="低" value="3"></el-option>
                                            </el-select>
                                        </p>
                                        <p v-if="int.key === 'workMouldId'">
                                            <el-select
                                                v-model="int.value"
                                                placeholder="请选择"
                                                size="mini"
                                                clearable
                                                class="value"
                                                style="font-size: 12px;width:300px !important;"
                                                popper-class="select-option showThen">
                                                <el-option v-for="item in templateList" :label="item.name" :value="item.id" :key="item.id"></el-option>
                                            </el-select>
                                        </p>
                                        <p v-if="int.key === 'orderCreateUser'">
                                            <el-select
                                                v-model="int.value"
                                                placeholder="请选择"
                                                size="mini"
                                                clearable
                                                filterable
                                                class="value"
                                                style="font-size: 12px;width:300px !important;"
                                                popper-class="select-option showThen">
                                                <el-option v-for="item in orderUserList" :label="item.chineseName" :value="item.id" :key="item.id"></el-option>
                                            </el-select>
                                        </p>
                                        <p v-if="int.key === 'timeQua'">
                                            <el-input
                                                type="number"
                                                v-model.trim="int.value"
                                                placeholder="请输入"
                                                clearable
                                                class="value"
                                                style="font-size: 12px;width:300px !important;"></el-input>
                                        </p>
                                        <p v-if="int.key === 'attackResult'">
                                            <el-select
                                                v-model="int.value"
                                                placeholder="请选择"
                                                size="mini"
                                                clearable
                                                class="value"
                                                style="font-size: 12px;width:300px !important;"
                                                popper-class="select-option showThen">
                                                <el-option
                                                    v-for="item in attackResultList"
                                                    :key="symbolKey(item.id)"
                                                    :label="item.name"
                                                    :value="item.name">
                                                </el-option>
                                            </el-select>
                                        </p>
                                        <p v-if="int.key === 'reportStatus'">
                                            <el-select
                                                v-model="int.value"
                                                placeholder="请选择"
                                                size="mini"
                                                class="value"
                                                style="font-size: 12px;width:300px !important;"
                                                popper-class="select-option showThen">
                                                <el-option
                                                    v-for="item in thenStatus"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </p>
                                        <p v-if="int.key === 'reportLevel'">
                                            <el-select
                                                v-model="int.value"
                                                placeholder="请选择"
                                                size="mini"
                                                class="value"
                                                style="font-size: 12px;width:300px !important;"
                                                popper-class="select-option showThen">
                                                <el-option
                                                    v-for="item in thenLevel"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </p>
                                        <p v-if="int.key === 'attChain'">
                                            <el-select
                                                v-model="int.value"
                                                placeholder="请选择"
                                                size="mini"
                                                clearable
                                                class="value"
                                                style="font-size: 12px;width:300px !important;"
                                                popper-class="select-option showThen">
                                                <el-option
                                                    v-for="item in attChainList"
                                                    :key="symbolKey(item.id)"
                                                    :label="item.name"
                                                    :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </p>
                                        <p v-if="int.key === 'attCk'">
                                            <Treeselect
                                                class="attck-tree"
                                                :disable-branch-nodes="true"
                                                style="font-size: 12px;width:300px !important;"
                                                @input="inputChange"
                                                :appendToBody="true"
                                                size="small"
                                                :options="treeDataAtt"
                                                :normalizer="normalizerAtt"
                                                noChildrenText="当前分支无子节点"
                                                noOptionsText="无可用选项"
                                                placeholder="请选择"
                                                v-model="int.value"
                                            />
                                        </p>
                                        <span>
                                            <span class="dottedLine" style="margin: 0 5px"></span>
                                        </span>
                                        <el-col style="width: 20px" v-if="ind >= 14">
                                            <i
                                                @click.stop="add_thenChild(ind)"
                                                class="el-icon-plus"
                                                style="cursor: pointer;font-size:14px;color:#387dee"></i>
                                        </el-col>
                                        <el-col style="width: 20px;" v-if="ind > 14">
                                            <i
                                                @click.stop="del_thenChild(ind)"
                                                class="el-icon-close"
                                                style="cursor: pointer;font-size:14px;color:#387dee"></i>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
                        </li>
                    </ul>
                </div>

                <div class="title-line">
                    <span class="title-name">通知信息</span>
                </div>
                <div class="inform-box" style="margin-left:-20px">
                    <el-form :model="eventData.noticeMap" ref="assetForm" label-width="86px" label-position="top">
                        <el-form-item label="通知方式:" prop="noticeType">
                            <el-checkbox-group v-model="eventData.noticeMap.noticeType">
                                <el-checkbox label="1">邮件</el-checkbox>
                                <el-checkbox label="2">短信</el-checkbox>
                                <el-checkbox label="3">蓝信</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item label="通知人员:" prop="noticeUser" v-if="eventData.noticeMap.noticeType.length">
                            <el-checkbox-group v-model="eventData.noticeMap.noticeUser">
                                <el-checkbox label="1">资产归属人</el-checkbox>
                                <el-checkbox label="2">归属人直接领导</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item label="其他人员:" prop="customUser" v-if="eventData.noticeMap.noticeType.length">
                            <el-select
                                v-model="eventData.noticeMap.userIds"
                                multiple
                                placeholder="选择其他通知人"
                                filterable
                                clearable
                                size="mini"
                                style="width: 640px">
                                <el-option v-for="item in usersList" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div v-if="!this.$route.query.id" class="right_btn" style="position:fixed;top:75px;right:10px;z-index:100">
                <el-button
                    v-if="!this.$route.query.disposal_id"
                    class="releaseBtn"
                    style="right: 110px !important;"
                    size="small"
                    @click="$router.push('/rule/rule_new_rules_type')">取消</el-button>
                <el-button
                    class="releaseBtn"
                    size="small"
                    type="primary"
                    @click="submitRule('rulesForm')">确认</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import drools_tree_data from './drools/drools_tree_data.vue'
import { codemirror } from 'vue-codemirror' // 引入组件
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/cobalt.css'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {
    buildDrools,
    get_one_rule,
    get_mail_users,
    selectResourcePool,
    get_fields,
    get_extendRules,
    updateRule
} from '../../server/rule/attect.js'
import {
    get_alarm_type_rule,
    get_rule_attack_result,
    getAssetsSelect,
    getSubjectLabel,
    allLogFiled
} from '../../server/rule/api.js'
import {
    get_rule_tree,
    get_order_template,
    get_order_user
} from '../../server/rule/inspection'
import {
    getAttCk,
    getAttChain
} from '../../server/alarm/alarm.js'
require('codemirror/mode/clike/clike.js')

export default {
    name: 'DroolsRule',
    components: {
        codemirror,
        Treeselect,
        drools_tree_data
    },
    data() {
        return {
            treeDataAtt: [],
            attChainList: [],
            searchKey: '',
            cmOptions: {
                tabSize: 4, // 制表符的宽度
                mode: 'text/x-java', // 使用的模式
                theme: 'cobalt', // 主题黑色
                // theme: 'darcula', // 主题白色
                lineNumbers: true, // 是否显示行号
                lineWrapping: true, // 是否应滚动或换行以显示长行
                extraKeys: { Ctrl: 'autocomplete' },
                lineWiseCopyCut: true, // 在没有选择的情况下进行复制或剪切将复制或剪切有光标的整行。
                showCursorWhenSelecting: true, // 选择处于活动状态时是否应绘制光标
                maxHighlightLength: Infinity, // 显示长行的时候 这个值是不限制，如果要做限制的话，值是number类型
                matchBrackets: true, // 光标匹配括号
                line: true,
                highlightDifferences: true
                // readOnly: true, // 只读
            },
            testData: [],
            timeList: [
                {
                    label: '固定时间',
                    value: 'fixed'
                },
                {
                    label: '范围时间',
                    value: 'range'
                }
            ],

            /* 资产下拉*/
            // assetTypeList: [],
            // operationSystemList: [],
            // zoneNameList: [],

            // /* 日志标签*/
            // subjectLabelList1: [],
            // subjectLabelList2: [],
            // subjectLabelList3: [],
            activeName: 'first',
            currentSelect: 'AND',
            noteFlag: true,
            enObj: {}, // 中文映射成英文,对象名中文
            cnObj: {}, // 英文映射成中文，对象名英文

            resourceNameDialog: false,
            extendRulesDialog: false,
            fieldsDialog: false,
            resourceItem: '',
            fieldsItem: '',
            fieldsType: '',
            get_params_resource: {
                page: 1,
                size: 10,
                name: ''
            },
            get_params_extend: {
                page: 1,
                size: 10,
                name: ''
            },
            get_params_fields: {
                page: 1,
                size: 10,
                name: ''
            },
            total_num_resource: '',
            total_num_fields: '',
            total_num_extend: '',
            tableData_resource: [],
            tableData_extend: [],
            tableData_fields: [],
            tableData_fields_AlarmEvent: [],
            tableData_fields_TrafficEvent: [],
            tableData_fields_HostEvent: [],
            tableData_fields_AppEvent: [],
            tableData_fields_HistoryIPEvent: [],
            tableData_fields_AssetEvent: [],
            tableData_fields_MenaceEvent: [],
            tableData_fields_OutputEvent: [],
            codeContent: '',
            rules: [],

            loading: false,
            loading_resource: false,
            loading_extend: false,
            groupIsSelected: false,
            onOffAssign: false,
            onOff: false,
            isClick: true,
            indent: 10,
            initId: null,
            depId: '',
            currentNodeId: '',
            currentGroup: '',
            treeData: [],
            propsData: {
                children: 'childTypeInfo',
                label: 'name'
            },
            typeList: [],
            usersList: [],
            typeEvenTitle: '', // 以选择类型
            selectActive: '', // 单选功能
            addFieldRestrictions: [], // 添加字段限制列表
            oldTime: '',
            oneData: '',
            record_id: '',

            isExtend: false,
            isEdit: false,

            multiFieldConstraint: [{
                label: '...',
                value: ''
            },
            {
                label: '所有(并且)',
                value: '&&'
            },
            {
                label: '任意(或)',
                value: '||'
            }],

            // 滑动窗口
            slideType: '',
            slideValue: '',
            slidingWindow: [{
                label: '时间',
                value: 'time'
            }, {
                label: '数量',
                value: 'length'
            }],

            // 滑动窗口
            slideWindow_sourceList: [
                // {
                //   slideType: '',
                //   slideValue: ''
                // }
            ],

            // After
            afterType: '',
            afterValue: '',
            timeSign: '',

            after_sourceList: [
                // {
                //   timeSign:'',
                //   afterType: '',
                //   afterValue: ''
                // }
            ],

            constraintName: '', // 选中约束字段
            // fieldBinding: '',  // 绑定变量
            currentIndex: '', // 当前任意所有 index
            boundName: '',
            record_boundName: '',
            junctionType: '', // 多字段约束

            // 修改事件属性
            eventAttributeDialog: false,

            // 累计属性
            accmulateDialog: false,

            accmulateForm: {
                fieldBindName: '',
                operator: '',
                value: '',
                isAvg: false
            },
            disIsAvg: false,
            record_fieldBindName: '',

            common_options: [{
                label: '等于',
                value: '=='
            }, {
                label: '不等于',
                value: '!='
            }, {
                label: '大于',
                value: '>'
            }, {
                label: '小于',
                value: '<'
            }, {
                label: '大于或等于',
                value: '>='
            }, {
                label: '小于或等于',
                value: '<='
            }, {
                label: 'matches',
                value: 'matches'
            }, {
                label: 'not matches',
                value: 'not matches'
            }, {
                label: 'contains',
                value: 'contains'
            }, {
                label: 'not contains',
                value: 'not contains'
            }, {
                label: 'in',
                value: 'in'
            }, {
                label: 'not in',
                value: 'not in'
            }],

            // 接口动态安全设备事件选项
            // AlarmEvent_options: [],

            // 新建事实类型
            addModelTypes_Dialog: false,
            selectModelType: '',

            // 修改 negeted
            negetedDialog: false,
            currentNegeted: false,

            // 新建渠道
            name: '',

            eventIndex: null,
            countIndex: null,

            /* 输出信息校验*/
            requiredFlag: false,

            // Then 下拉选项
            thenKey: [{
                label: '事件类型',
                value: 'reportType'
            }, {
                label: '事件名称',
                value: 'reportName'
            }, {
                label: '事件级别',
                value: 'reportLevel'
            }, {
                label: '事件状态',
                value: 'reportStatus'
            }, {
                label: '处置建议',
                value: 'advice'
            }, {
                label: '分析过程',
                value: 'analyzePro'
            }, {
                label: '攻击结果',
                value: 'attackResult'
            }, {
                label: '发送流量',
                value: 'sendFlow'
            }, {
                label: '资产IP',
                value: 'assetIp'
            }, {
                label: '资产',
                value: 'asset'
            }, {
                label: '规则描述',
                value: 'reportDesc'
            }, {
                label: '总数',
                value: 'count'
            }, {
                label: '归并时间',
                value: 'timeQua'
            }, {
                label: 'condition-1',
                value: 'condition-1'
            }, {
                label: '是否封禁',
                value: 'isBanned'
            }, {
                label: '是否发起工单',
                value: 'isStart'
            }, {
                label: '工单名称',
                value: 'workOrderName'
            }, {
                label: '优先级',
                value: 'level'
            }, {
                label: '工单模板',
                value: 'workMouldId'
            }, {
                label: '工单发起人',
                value: 'orderCreateUser'
            }, {
                label: '攻击链阶段',
                value: 'attChain'
            }, {
                label: 'ATT&CK',
                value: 'attCk'
            }],

            mailKey: [
                {
                    label: '通知资产归属人',
                    value: 'mailAssets'
                },
                {
                    label: '通知资产归属人直属领导',
                    value: 'mailAssetsLead'
                },
                {
                    label: '通知其他人',
                    value: 'mailUser'
                }
            ],
            messageKey: [
                {
                    label: '通知资产归属人',
                    value: 'messageAssets'
                },
                {
                    label: '通知资产归属人直属领导',
                    value: 'messageAssetsLead'
                },
                {
                    label: '通知其他人',
                    value: 'messageUser'
                }
            ],
            reportForm: {
                name: '',
                type: '',
                mouldId: '',
                status: true
            },
            templateList: [],
            orderUserList: [],

            showThen: [{
                label: '关联规则',
                value: '关联规则'
            }, {
                label: '发送邮件',
                value: 'mail'
            }, {
                label: '发送短信',
                value: 'message'
            }],

            thenType: [], // 事件类型

            attackResultList: [], // 攻击结果

            thenStatus: [
                {
                    label: '待确认',
                    value: '0'
                },
                {
                    label: '已确认',
                    value: '1'
                },
                {
                    label: '已处置',
                    value: '2'
                },
                {
                    label: '已驳回',
                    value: '3'
                }
            ],

            thenLevel: [{
                label: '低',
                value: '0'
            }, {
                label: '中低',
                value: '1'
            }, {
                label: '中',
                value: '2'
            }, {
                label: '中高',
                value: '3'
            }, {
                label: '高',
                value: '4'
            }],
            eventData: {
                id: '',
                name: '',
                extends: '',
                typeId: '',
                des: '',
                status: 0,
                mark: 1,
                define: '',
                sourceList: [
                ],
                thenList: [
                    {
                        key: 'reportType',
                        reportTypeName: '',
                        value: ''
                    },
                    {
                        key: 'reportName',
                        value: ''
                    },
                    {
                        key: 'reportLevel',
                        value: ''
                    },
                    {
                        key: 'reportStatus',
                        value: '0'
                    },
                    {
                        key: 'advice',
                        value: ''
                    },
                    {
                        key: 'analyzePro',
                        value: ''
                    },
                    {
                        key: 'attackResult',
                        value: ''
                    },
                    {
                        key: 'isBanned',
                        value: '0'
                    },
                    {
                        key: 'attChain',
                        value: ''
                    },
                    {
                        key: 'attCk',
                        value: null
                    }
                ],
                noticeMap: {
                    noticeType: [],
                    noticeUser: [],
                    userIds: []
                }
            },
            toogleChildIS: false,
            normalizerAtt(node) {
                return {
                    id: node.id,
                    label: node.name,
                    children: node.child
                }
            },
            tableData_all: []
        }
    },
    created() {
        this.getOptionsField()
        // alert(this.$route.query.disposal_id)
        /* 获取事件类型，输出信息部分使用*/
        this.getAlarmType()
        /* 获取工单模板下拉选，输出信息部分使用*/
        // this.getTemplateList()
        /* 获取工单发起人，输出信息部分使用*/
        // this.getOrderList()
        /* 获取其他人员，通知信息部分使用*/
        this.getUsers()
        /* 获取继承的规则，弹框中table使用*/
        this.get_data_extend()
        /* 获取攻击结果，输出信息部分使用*/
        this.get_rules_result()
        /* 获取规则分组树结构，基础信息部分使用*/
        this.initTree()
        /* 获取资源池表格，弹框中table使用*/
        this.get_data_resource()
        /* 初始化基础数据，判断是其他页面跳转或者新增编辑*/
        this.query_data()
    },
    mounted() {
        console.log(this.testData)
        this.getAttCkFn()
        this.getAttChainFn()
        window.addEventListener('click', (e) => {
            this.onOff = false
        })
    },
    computed: {
        /* 收集变量名*/
        variate_arr() {
            let arr = []
            this.eventData.sourceList.forEach((item, index) => {
                if (item.type == 0 && item.objBindName) {
                    arr.push(item.objBindName)
                } else if (item.type == 1) {
                    if (item.factMap.objBindName) {
                        arr.push(item.factMap.objBindName)
                    } else if (item.countMap.constraintList[0].fieldBindName) {
                        arr.push(item.countMap.constraintList[0].fieldBindName)
                    }
                }
            })
            console.log(arr, '这个是啥')
            return arr
        },
        /* 只收集非累计变量名*/
        variate_arr_one() {
            let arr = []
            this.eventData.sourceList.forEach((item, index) => {
                if (item.type == 0 && item.objBindName) {
                    arr.push({
                        name: item.factType,
                        var: item.objBindName
                    })
                }
            })
            return arr
        },
        getEventOptions() {
            return function(event) {
                this.testData.filter(it => {
                    return it.value === event
                })
            }
        }
    },
    watch: {
        activeName: {
            handler(newVal, oldVal) {
                if (newVal) {
                    newVal === 'first' ? (this.eventData.mark = 1) : (this.eventData.mark = 2) && (this.eventData.extends = '')
                }
            }
        },
        eventAttributeDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.afterValue = ''
                    this.boundName = ''
                    this.afterType = ''
                    this.slideType = ''
                    this.slideValue = ''
                    this.timeSign = ''
                }
            }
        },
        fieldsDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.fieldsType = ''
                    this.tableData_fields = []
                }
            }
        }
    },
    methods: {
        changeIsAvg(val) {
            if (val) {
                this.accmulateForm.value = ''
                this.disIsAvg = true
            } else {
                this.disIsAvg = false
            }
            console.log(val)
        },
        getAttCkFn() {
            getAttCk({}).then(res => {
                console.log(res)
                this.treeDataAtt = res
            }).catch(err => {
                console.log(err)
            })
        },
        getAttChainFn() {
            getAttChain({}).then(res => {
                this.attChainList = res
            }).catch(err => {
                console.log(err)
            })
        },
        inputChange() {},
        searchs() {
            let arr
            let a
            if (this.searchKey) {
                if (/^[a-zA-Z]*$/.test(this.searchKey)) {
                    a = this.searchKey.toUpperCase()
                } else {
                    a = this.searchKey
                }
                arr = this.tableData_fields.filter(e => {
                    return e.name1.indexOf(a) != -1
                })
                console.log(arr)
                // let type = item.name
                this.tableData_fields = arr
                console.log(this.tableData_fields)
            } else {
                let item = this.variate_arr_one.find(_it => _it.var === this.fieldsType)
                console.log(item)
                let type = item.name
                this.tableData_fields = this['tableData_fields_' + type]
            }
        },
        getOptionsField() {
            allLogFiled({}).then(res => {
                console.log(res, '所有下拉选')
                this.testData = res ?? []
            }).catch(e => {
                console.log(e)
            })
        },
        toogleAll(e) {
            // eslint-disable-next-line no-undef
            console.log($(e.target).siblings('.toogle-box'))
            // eslint-disable-next-line no-undef
            if ($(e.target).hasClass('is-show')) {
                // eslint-disable-next-line no-undef
                $(e.target).toggleClass('is-show')
                // eslint-disable-next-line no-undef
                $(e.target).siblings('.tree-line-vertical').hide()
                // eslint-disable-next-line no-undef
                $(e.target).siblings('.tree-line-outer').hide()
            } else {
                // eslint-disable-next-line no-undef
                $(e.target).toggleClass('is-show')
                // eslint-disable-next-line no-undef
                $(e.target).siblings('.tree-line-vertical').show()
                // eslint-disable-next-line no-undef
                $(e.target).siblings('.tree-line-outer').show()
            }
        },
        toogleChild(e) {
            if (this.toogleChildIS) {
                this.toogleChildIS = false
            } else {
                this.toogleChildIS = true
            }
            // eslint-disable-next-line no-undef
            console.log($(e.target).parent().siblings('.toogle-box'))
            // eslint-disable-next-line no-undef
            if ($(e.target).hasClass('is-show')) {
                // eslint-disable-next-line no-undef
                $(e.target).toggleClass('is-show')
                // eslint-disable-next-line no-undef
                $(e.target).parent().siblings('.toogle-box').hide()
            } else {
                // eslint-disable-next-line no-undef
                $(e.target).toggleClass('is-show')
                // eslint-disable-next-line no-undef
                $(e.target).parent().siblings('.toogle-box').show()
            }
        },
        toogleChild_count(e) {
            // eslint-disable-next-line no-undef
            console.log($(e.target).parent().siblings('.tree-line-count'))
            // eslint-disable-next-line no-undef
            if ($(e.target).hasClass('is-show')) {
                // eslint-disable-next-line no-undef
                $(e.target).toggleClass('is-show')
                // eslint-disable-next-line no-undef
                $(e.target).parent().siblings('.tree-line-count').hide()
            } else {
                // eslint-disable-next-line no-undef
                $(e.target).toggleClass('is-show')
                // eslint-disable-next-line no-undef
                $(e.target).parent().siblings('.tree-line-count').show()
            }
        },
        toogleChild_countInner(e) {
            // eslint-disable-next-line no-undef
            console.log($(e.target).siblings('.toogle-box'))
            // eslint-disable-next-line no-undef
            if ($(e.target).hasClass('is-show')) {
                // eslint-disable-next-line no-undef
                $(e.target).toggleClass('is-show')
                // eslint-disable-next-line no-undef
                $(e.target).siblings('.toogle-box').hide()
            } else {
                // eslint-disable-next-line no-undef
                $(e.target).toggleClass('is-show')
                // eslint-disable-next-line no-undef
                $(e.target).siblings('.toogle-box').show()
            }
        },
        changeActive() {
            if (this.fieldsType === '') {
                this.tableData_fields = []
                this.searchKey = ''
                return
            }
            let item = this.variate_arr_one.find(_it => _it.var === this.fieldsType)
            console.log(item)
            let type = item.name
            this.tableData_fields = this['tableData_fields_' + type]
            console.log(this['tableData_fields_' + type])
        },
        changeStatus() {
            if (this.isExtend && this.isEdit) {
                this.$message.warning('该规则已被其它规则继承，不能修改状态')
            } else {
                this.eventData.status = !this.eventData.status
            }
        },
        judgeAfter(after) {
            console.log(after)
            if (after !== '') {
                if (after[0] !== '$') {
                    this.afterValue = ''
                    this.$message.warning('变量名必须以$符开头')
                    return
                }
                if (!this.variate_arr.includes(after)) {
                    this.afterValue = ''
                    this.$message.warning('输入的变量名不存在')
                }
            }
        },
        judgeBoundName(name) {
            console.log(name)
            if (name !== '') {
                if (name[0] !== '$') {
                    this.boundName = ''
                    this.$message.warning('变量名必须以$符开头')
                    return
                }
                /* 校验前先和自己对比*/
                if (this.record_boundName === this.boundName) {
                    return
                }
                if (this.variate_arr.includes(name)) {
                    this.boundName = ''
                    this.$message.warning('事件变量名已存在')
                }
            }
        },
        judgeFieldBindName(name) {
            console.log(name)
            if (name !== '') {
                if (name[0] !== '$') {
                    this.accmulateForm.fieldBindName = ''
                    this.$message.warning('变量名必须以$符开头')
                    return
                }
                /* 校验前先和自己对比*/
                if (this.record_fieldBindName === this.accmulateForm.fieldBindName) {
                    return
                }
                if (this.variate_arr.includes(name)) {
                    this.accmulateForm.fieldBindName = ''
                    this.$message.warning('变量名已存在')
                }
            }
        },
        goResourcePool() {
            this.$setsessionStorage('eventData', JSON.stringify(this.eventData))
            this.$router.push('/rule/rule_resource_list')
        },
        clearExtend() {
            this.eventData.extends = ''
            this.extendRulesDialog = false
        },
        upResource(val) {
            this.resourceNameDialog = true
            this.resourceItem = val
        },
        upFields(val) {
            this.fieldsDialog = true
            this.fieldsItem = val
        },
        indexMethod_resource(index) {
            return (this.get_params_resource.page - 1) * this.get_params_resource.size + index + 1
        },
        indexMethod_extend(index) {
            return (this.get_params_extend.page - 1) * this.get_params_extend.size + index + 1
        },

        handleSizeChange_resource(val) {
            this.get_params_resource.size = val
            this.get_data_resource()
        },
        handleSizeChange_extend(val) {
            this.get_params_extend.size = val
            this.get_data_extend()
        },
        handleCurrentChange_resource(val) {
            this.get_params_resource.page = val
            this.get_data_resource()
        },
        handleCurrentChange_extend(val) {
            this.get_params_extend.page = val
            this.get_data_extend()
        },
        addResourceName(row) {
            console.log(row)
            this.resourceItem.value = `"$$:${row.poolName}"`
            this.resourceNameDialog = false
        },
        addExtendRules(row) {
            console.log(row)
            this.eventData.extends = row.name
            this.extendRulesDialog = false
        },
        addFields(row) {
            console.log(row)
            // 修改一下
            this.fieldsItem.value = this.fieldsType + '.' + row.name
            this.fieldsItem.values = this.fieldsType + '.' + row.handle
            console.log(this.fieldsItem.value)
            this.fieldsDialog = false
        },
        search_data_resource() {
            this.get_params_resource.page = 1
            this.get_data_resource()
        },
        search_data_extend() {
            this.get_params_extend.page = 1
            this.get_data_extend()
        },
        get_data_resource() {
            this.loading_resource = true
            this.tableData_resource = []
            let data = {
                queryData: {
                    page: this.get_params_resource.page,
                    pageSize: this.get_params_resource.size
                },
                paramsData: {
                    name: this.get_params_resource.name
                }
            }
            console.log(data)
            selectResourcePool(data).then(res => {
                // console.log('getList', res);
                this.loading_resource = false
                this.total_num_resource = res.total
                let list = res.records
                if (list.length > 0) {
                    list.forEach(item => {
                        let obj = {}
                        obj.id = item.id
                        obj.poolName = item.poolName
                        this.tableData_resource.push(obj)
                    })
                }
            }).catch(error => {
                this.loading_resource = false
                console.log('error' + error)
            })
        },

        get_data_extend() {
            this.loading_extend = true
            this.tableData_extend = []
            let data = {
                queryData: {
                    page: this.get_params_extend.page,
                    pageSize: this.get_params_extend.size
                },
                paramsData: {
                    ruleName: this.get_params_extend.name,
                    ruleId: this.eventData.id
                }
            }
            get_extendRules(data).then(res => {
                console.log(res)
                this.loading_extend = false
                this.total_num_extend = res.total
                let list = res.records
                if (list.length > 0) {
                    list.forEach(item => {
                        let obj = {}
                        obj.name = item.name
                        this.tableData_extend.push(obj)
                    })
                }
            }).catch(error => {
                this.loading_extend = false
                console.log('error' + error)
            })
        },

        async get_data_fields() {
            // console.log("?????字段")
            /* 此处是根据事件变量，展示弹窗字段名称*/
            this.tableData_fields = []
            this.tableData_fields_AlarmEvent = []
            this.tableData_fields_TrafficEvent = []
            this.tableData_fields_HostEvent = []
            this.tableData_fields_HistoryIPEvent = []
            this.tableData_fields_AssetEvent = []
            this.tableData_fields_MenaceEvent = []
            this.tableData_fields_OutputEvent = []
            this.tableData_fields_AppEvent = []
            let data = {}
            this.tableData_all = []
            let list = this.$getsessionStorage('rule_fields')
            let err
            if (!list.length) {
                [err, list] = await get_fields(data).then(res => {
                    return [null, res]
                }).catch(err => {
                    return [err, null]
                })
            }
            console.log(err)
            this.enObj = {}
            this.cnObj = {}
            console.log(list, '这个是什么东西')
            if (list.length > 0) {
                list.forEach(item => {
                    console.log(item.name, item.handle)
                    this.enObj[item.name] = item.handle
                    this.cnObj[item.handle] = item.name
                    if (item.type === 'AlarmEvent') {
                        let obj = {}
                        obj.field = item.field
                        obj.name = item.name
                        obj.typeName = item.typeName
                        obj.handle = item.handle
                        obj.type = item.type
                        obj.seq = item.seq
                        obj.name1 = item.name.toUpperCase()
                        this.tableData_fields_AlarmEvent.push(obj)
                    } else if (item.type === 'TrafficEvent') {
                        let obj = {}
                        obj.field = item.field
                        obj.name = item.name
                        obj.typeName = item.typeName
                        obj.handle = item.handle
                        obj.type = item.type
                        obj.seq = item.seq
                        obj.name1 = item.name.toUpperCase()
                        this.tableData_fields_TrafficEvent.push(obj)
                    } else if (item.type === 'HostEvent') {
                        let obj = {}
                        obj.field = item.field
                        obj.name = item.name
                        obj.typeName = item.typeName
                        obj.handle = item.handle
                        obj.type = item.type
                        obj.seq = item.seq
                        obj.name1 = item.name.toUpperCase()
                        this.tableData_fields_HostEvent.push(obj)
                    } else if (item.type === 'HistoryIPEvent') {
                        let obj = {}
                        obj.field = item.field
                        obj.name = item.name
                        obj.typeName = item.typeName
                        obj.handle = item.handle
                        obj.type = item.type
                        obj.seq = item.seq
                        obj.name1 = item.name.toUpperCase()
                        this.tableData_fields_HistoryIPEvent.push(obj)
                    } else if (item.type === 'AppEvent') {
                        let obj = {}
                        obj.field = item.field
                        obj.name = item.name
                        obj.typeName = item.typeName
                        obj.handle = item.handle
                        obj.type = item.type
                        obj.seq = item.seq
                        obj.name1 = item.name.toUpperCase()
                        this.tableData_fields_AppEvent.push(obj)
                    } else if (item.type === 'AssetEvent') {
                        let obj = {}
                        obj.field = item.field
                        obj.name = item.name
                        obj.typeName = item.typeName
                        obj.handle = item.handle
                        obj.type = item.type
                        obj.seq = item.seq
                        obj.name1 = item.name.toUpperCase()
                        this.tableData_fields_AssetEvent.push(obj)
                    } else if (item.type === 'MenaceEvent') {
                        let obj = {}
                        obj.field = item.field
                        obj.name = item.name
                        obj.typeName = item.typeName
                        obj.handle = item.handle
                        obj.type = item.type
                        obj.seq = item.seq
                        obj.name1 = item.name.toUpperCase()
                        this.tableData_fields_MenaceEvent.push(obj)
                    } else if (item.type === 'OutputEvent') {
                        let obj = {}
                        obj.field = item.field
                        obj.name = item.name
                        obj.typeName = item.typeName
                        obj.handle = item.handle
                        obj.type = item.type
                        obj.seq = item.seq
                        obj.name1 = item.name.toUpperCase()
                        this.tableData_fields_OutputEvent.push(obj)
                    }
                })
                this.tableData_fields = []
                console.log(this.enObj, '发送')
                console.log(this.cnObj, '接收')
            }
            this.tableData_all = list
            this.init_data()
        },

        selectChange(e) {
            console.log(e.target.dataset.type)
            let dtype = e.target.dataset.type
            if (dtype == 1) {
                this.currentSelect = 'AND'
            } else if (dtype == 2) {
                this.currentSelect = 'OR'
            } else if (dtype == 3) {
                this.currentSelect = 'NOT'
            }
        },
        eventChange(item) {
            item.constraintList = []
        },
        addEventData(e) {
            console.log(e.target.dataset.type)
            let dtype = e.target.dataset.type
            if (dtype == 1) {
                this.eventData.sourceList.push({
                    type: 0,
                    factType: 'AlarmEvent',
                    window: '',
                    after: '',
                    objBindName: '',
                    junctionType: '',
                    note: '',
                    constraintList: []
                })
                this.slideWindow_sourceList.push({ slideType: '', slideValue: '' })
                this.after_sourceList.push({ afterType: '', afterValue: '', timeSign: '' })
            } else if (dtype == 2) {
                this.eventData.sourceList.push({
                    type: 1,
                    countMap: {
                        factType: 'LinkedList',
                        note: '',
                        constraintList: [
                            {
                                constraintName: 'size',
                                operator: '',
                                value: '',
                                attrType: 1,
                                fieldBindName: '',
                                junctionType: '',
                                dataType: '0',
                                constraintList: []
                            }
                        ]
                    },
                    factMap: {
                        factType: 'AlarmEvent',
                        window: '',
                        after: '',
                        objBindName: '',
                        junctionType: '',
                        note: '',
                        constraintList: []
                    }
                })
                this.slideWindow_sourceList.push({ slideType: '', slideValue: '' })
                this.after_sourceList.push({ afterType: '', afterValue: '', timeSign: '' })
            }
        },
        addEventData_down(e, index) {
            let dtype = e.target.dataset.type
            if (dtype == 1) {
                this.eventData.sourceList.splice(index + 1, 0, {
                    type: 0,
                    factType: 'AlarmEvent',
                    window: '',
                    after: '',
                    objBindName: '',
                    junctionType: '',
                    note: '',
                    constraintList: []
                })
                this.slideWindow_sourceList.splice(index + 1, 0, { slideType: '', slideValue: '' })
                this.after_sourceList.splice(index + 1, 0, { afterType: '', afterValue: '', timeSign: '' })
            } else if (dtype == 2) {
                this.eventData.sourceList.splice(index + 1, 0, {
                    type: 1,
                    countMap: {
                        factType: 'LinkedList',
                        note: '',
                        constraintList: [
                            {
                                constraintName: 'size',
                                operator: '',
                                value: '',
                                attrType: 1,
                                fieldBindName: '',
                                junctionType: '',
                                dataType: '0',
                                constraintList: []
                            }
                        ]
                    },
                    factMap: {
                        factType: 'AlarmEvent',
                        window: '',
                        after: '',
                        objBindName: '',
                        junctionType: '',
                        note: '',
                        constraintList: []
                    }
                })
                this.slideWindow_sourceList.splice(index + 1, 0, { slideType: '', slideValue: '' })
                this.after_sourceList.splice(index + 1, 0, { afterType: '', afterValue: '', timeSign: '' })
            }
        },
        addEventData_up(e, index) {
            let dtype = e.target.dataset.type
            if (dtype == 1) {
                this.eventData.sourceList.splice(index, 0, {
                    type: 0,
                    factType: 'AlarmEvent',
                    window: '',
                    after: '',
                    objBindName: '',
                    junctionType: '',
                    note: '',
                    constraintList: []
                })
                this.slideWindow_sourceList.splice(index, 0, { slideType: '', slideValue: '' })
                this.after_sourceList.splice(index, 0, { afterType: '', afterValue: '', timeSign: '' })
            } else if (dtype == 2) {
                this.eventData.sourceList.splice(index, 0, {
                    type: 1,
                    countMap: {
                        type: 'LinkedList',
                        note: '',
                        constraintList: [
                            {
                                constraintName: 'size',
                                operator: '',
                                value: '',
                                attrType: 1,
                                fieldBindName: '',
                                junctionType: '',
                                dataType: '0',
                                constraintList: []
                            }
                        ]
                    },
                    factMap: {
                        factType: 'AlarmEvent',
                        window: '',
                        after: '',
                        objBindName: '',
                        junctionType: '',
                        note: '',
                        constraintList: []
                    }
                })
                this.slideWindow_sourceList.splice(index, 0, { slideType: '', slideValue: '' })
                this.after_sourceList.splice(index, 0, { afterType: '', afterValue: '', timeSign: '' })
            }
        },
        deleteEventData(index) {
            this.eventData.sourceList.splice(index, 1)
            this.slideWindow_sourceList.splice(index, 1)
            this.after_sourceList.splice(index, 1)
        },

        openEventAttributeDialog(item, index) {
            this.eventIndex = index
            this.boundName = this.record_boundName = item.objBindName
            this.slideType = this.slideWindow_sourceList[index].slideType
            this.slideValue = this.slideWindow_sourceList[index].slideValue
            this.timeSign = this.after_sourceList[index].timeSign
            this.afterType = this.after_sourceList[index].afterType
            this.afterValue = this.after_sourceList[index].afterValue
            this.eventAttributeDialog = true
        },

        eventAttributeSuccess() {
            /* if (this.afterValue) {
                if (!this.variate_arr.includes(after)) {
                    this.afterValue = '';
                    this.$message.warning('输入的变量名不存在');
                    return ;
                }
            }*/
            if (this.slideType && !this.slideValue) {
                this.$message.warning('请填写滑动窗口对应值')
                return
            }
            if (this.timeSign && (!this.afterType || !this.afterValue)) {
                this.$message.warning('请填写AFTER的时间和变量名')
                return
            }

            console.log(this.eventIndex)
            console.log(this.eventData)
            /* 判断属性，确定插入普通或累计事件中*/
            console.log(this.eventData.sourceList[this.eventIndex].factMap)
            if ('objBindName' in this.eventData.sourceList[this.eventIndex]) {
                this.eventData.sourceList[this.eventIndex].objBindName = this.boundName
            } else if (this.eventData.sourceList[this.eventIndex].factMap) {
                this.eventData.sourceList[this.eventIndex].factMap.objBindName = this.boundName
            }
            console.log(this.eventData.sourceList[this.eventIndex].factMap)

            this.slideWindow_sourceList[this.eventIndex].slideType = this.slideType
            this.slideWindow_sourceList[this.eventIndex].slideValue = this.slideValue ? this.slideValue : ''

            this.after_sourceList[this.eventIndex].timeSign = this.timeSign
            this.after_sourceList[this.eventIndex].afterType = this.afterType ? this.afterType : ''
            this.after_sourceList[this.eventIndex].afterValue = this.afterValue
            this.eventAttributeDialog = false
        },
        openAccmulateDialog(item, index) {
            this.countIndex = index
            this.accmulateForm.fieldBindName = this.record_fieldBindName = item.countMap.constraintList[0].fieldBindName
            this.accmulateForm.operator = item.countMap.constraintList[0].operator
            this.accmulateForm.value = item.countMap.constraintList[0].value
            this.accmulateForm.isAvg = item.countMap.constraintList[0].isAvg != 0
            this.accmulateDialog = true
        },
        accmulateDialogSuccess() {
            if (this.accmulateForm.operator && this.accmulateForm.value === '') {
                this.$message.warning('请填写完整的数值和关系运算符')
                return
            } else if (!this.accmulateForm.operator && this.accmulateForm.value != 0) {
                this.$message.warning('请填写完整的数值和关系运算符')
                return
            }
            this.eventData.sourceList[this.countIndex].countMap.constraintList[0].fieldBindName = this.accmulateForm.fieldBindName
            this.eventData.sourceList[this.countIndex].countMap.constraintList[0].operator = this.accmulateForm.operator
            this.eventData.sourceList[this.countIndex].countMap.constraintList[0].value = this.accmulateForm.value
            this.eventData.sourceList[this.countIndex].countMap.constraintList[0].isAvg = this.accmulateForm.isAvg == false ? 0 : 1

            this.accmulateDialog = false
        },

        symbolKey(key) {
            return Symbol(key)
        },
        initTree() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_rule_tree(data).then(res => {
                console.log('tree', res)
                let _data = [
                    ...res
                ]
                _data[0].disabled = true
                this.isClick = false
                this.treeData = _data
            }).catch(error => {
                console.log('error' + error)
            })
        },

        handleClick(data, checked, node) {
            if (checked) {
                // this.groupIsSelected = false;
                this.currentNode = data
                this.currentNodeId = data.id
                this.currentGroup = data.name
                this.$refs.tree.setCheckedNodes([data])
                this.eventData.typeId = this.currentNodeId
                let that = this
                setTimeout(() => {
                    that.onOff = false
                }, 0)
            }
        },
        handleNodeClick(node) {
            console.log(node)
        },

        get_rules_type() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            // eslint-disable-next-line no-undef
            get_rule_type(data).then(res => {
                console.log(res)
                this.typeList = res
            }).catch(err => {
                console.log(err)
            })
        },
        get_rules_result() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_rule_attack_result(data).then(res => {
                console.log(res)
                this.attackResultList = res
            }).catch(err => {
                console.log(err)
            })
        },
        getUsers() {
            this.usersList = []
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_mail_users(data).then(res => {
                console.log(res)
                let list = res
                if (list.length > 0) {
                    list.forEach(item => {
                        let obj = {}
                        obj.id = item.id
                        obj.name = item.name
                        obj.mail = `${item.name}(${item.mailbox})`
                        obj.phone = `${item.name}(${item.phone})`
                        // obj.is_sys = item.is_sys;
                        this.usersList.push(obj)
                    })
                }
            }).catch(error => {
                console.log('error' + error)
            })
        },
        getAlarmType() {
            this.thenType = []
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_alarm_type_rule(data).then(res => {
                console.log(res)
                let list = res
                if (list.length > 0) {
                    list.forEach(item => {
                        let obj = {}
                        obj.id = item.id
                        obj.name = item.name
                        // obj.is_sys = item.is_sys;
                        this.thenType.push(obj)
                    })
                }
                console.log(this.thenType)
            }).catch(error => {
                console.log('error' + error)
            })
        },
        getTemplateList() {
            this.templateList = []
            let data = {}
            get_order_template(data).then(res => {
                console.log(res)
                this.templateList = res ?? []
            }).catch(error => {
                console.log('error' + error)
            })
        },
        getOrderList() {
            this.orderUserList = []
            let data = {}
            get_order_user(data).then(res => {
                console.log(res, '工单发起人')
                this.orderUserList = res ?? []
            }).catch(error => {
                console.log('error' + error)
            })
        },
        query_data() {
            this.record_id = ''
            let disposal_id = this.$route.query.disposal_id
            // 从处置任务跳转过来
            if (disposal_id) {
                this.record_id = disposal_id
            }
            // 从事件或分析溯源跳转过来
            if (this.$route.query.id) {
                this.record_id = this.$route.query.id
            }
            if (this.record_id) {
                let data = { id: this.record_id }
                get_one_rule(data).then(res => {
                    console.log(res)
                    this.oneData = res
                    console.log(this.oneData)
                }).then(() => {
                    this.get_data_fields()
                }).catch(err => {
                    console.log(err + 'err')
                })
            } else {
                this.get_data_fields()
            }
        },
        init_data() {
            console.log('编辑', this.$route.params)
            if (this.$route.query.add == 1) {
                return
            }
            // 判断由哪里进入的详情页
            let ids = this.$route.query.ids
            let detail = {}
            if (ids == 'edit') {
                detail = sessionStorage.getItem(`editParams`)
            } else if (ids == 'copy') {
                detail = sessionStorage.getItem(`copyParams`)
            }
            // console.log(this.oneData.modelMap)
            if (this.record_id) {
                let data = []
                if (this.record_id) {
                    console.log(this.oneData.modelMap)
                    data = JSON.parse(this.oneData.modelMap)
                    data.status = this.oneData.status
                    data.typeId = this.oneData.typeId
                    this.currentGroup = this.oneData.typeName
                }
                this.initAttCk(data.thenList)
                this.getFormat_sourceList(data.sourceList)
                this.receiveEnToChinese(data.sourceList)
                this.splitWindow(data.sourceList, 'slideWindow_sourceList')
                this.splitAfter(data.sourceList, 'after_sourceList')

                this.eventData = data
                if (this.eventData.noticeMap.userIds) {
                    this.eventData.noticeMap.userIds = this.eventData.noticeMap.userIds.split(',')
                } else {
                    this.eventData.noticeMap.userIds = []
                }

                if (this.$route.params.modelMap) {
                    this.eventData.id = this.$route.params.id
                    this.eventData.typeId = this.$route.params.typeId
                }
                this.activeName = this.eventData.mark == 1 ? 'first' : 'second'

                this.$setsessionStorage('eventData', JSON.stringify(this.eventData))
                this.$setsessionStorage('data_typeName', JSON.stringify(this.currentGroup))
                // JSON.parse(detail).modelMap
            } else if (ids) {
                let data = []
                if (JSON.parse(detail).modelMap) {
                    data = JSON.parse(JSON.parse(detail).modelMap)
                    this.currentGroup = JSON.parse(detail).typeName
                    this.isEdit = !!JSON.parse(detail).isEdit
                    this.isExtend = JSON.parse(detail).isExtend
                }
                console.log(data)
                this.initAttCk(data.thenList)
                this.getFormat_sourceList(data.sourceList)
                this.receiveEnToChinese(data.sourceList)
                this.splitWindow(data.sourceList, 'slideWindow_sourceList')
                this.splitAfter(data.sourceList, 'after_sourceList')

                this.eventData = data
                if (this.eventData.noticeMap.userIds) {
                    this.eventData.noticeMap.userIds = this.eventData.noticeMap.userIds.split(',')
                } else {
                    this.eventData.noticeMap.userIds = []
                }

                if (this.$route.params.modelMap) {
                    this.eventData.id = this.$route.params.id
                    this.eventData.typeId = this.$route.params.typeId
                }
                this.activeName = this.eventData.mark == 1 ? 'first' : 'second'

                this.$setsessionStorage('eventData', JSON.stringify(this.eventData))
                this.$setsessionStorage('data_typeName', JSON.stringify(this.currentGroup))
            } else {
                // 判断是否新建，不是新建可返回用缓存,资源池返回
                /* if (this.$getsessionStorage('eventData') && this.$route.query.cache) {
                    console.log(this.$getsessionStorage('eventData'))
                    this.eventData = JSON.parse(this.$getsessionStorage('eventData'))
                    this.activeName = this.eventData.mark == 1 ? 'first' : 'second';
                }*/
            }
        },
        initAttCk(thenList) {
            // attck初始化需要为null后端需要空字符串，编辑时候需要转化
            const tmpAttCk = thenList.filter(item => item.key == 'attCk')[0]
            if (!tmpAttCk) {
                thenList.push({
                    key: 'attChain',
                    value: ''
                })
                thenList.push({
                    key: 'attCk',
                    value: null
                })
            } else {
                if (tmpAttCk.value === '') {
                    tmpAttCk.value = null
                }
            }
        },
        submitRule(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.interval(this.sendModelData)
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        interval(callback) {
            let _this = this
            if (this.oldTime) {
                let newTime = new Date()
                let interval = newTime - this.oldTime
                this.oldTime = newTime
                console.log(interval)
                if (interval > 3000) {
                    callback && callback.call(_this)
                }
            } else {
                this.oldTime = new Date()
                callback && callback.call(_this)
            }
        },

        sendModelData() {
            console.log(JSON.stringify(this.eventData))
            // if(this.currentGroup ==''){
            //     this.groupIsSelected = true;
            //     return;
            // }
            this.eventData.name = this.eventData.name.trim()
            if (this.eventData.name === this.eventData.extends) {
                this.$message.warning('规则不能继承它本身')
                return
            }
            if ((this.eventData.thenList[0]?.value === '' || this.eventData.thenList[1]?.value === '' || this.eventData.thenList[2]?.value === '')) {
                this.requiredFlag = true
                // eslint-disable-next-line no-undef
                let scroll = $('.showcase_then')[0]
                scroll.scrollIntoView({ behavior: 'smooth' })
                return
            }
            this.loading = true
            document.getElementById('container').style.overflow = 'hidden'
            let data = JSON.parse(JSON.stringify(this.eventData))

            if (this.activeName === 'first') {
                data.define = ''
                data.mark = 1
            } else {
                data.mark = 2
                data.sourceList = []
            }
            let itemType = this.thenType.find(it => {
                return it.id == data.thenList[0].value
            })
            if (itemType) {
                data.thenList[0].reportTypeName = itemType.name
            }
            console.log(JSON.stringify(data))
            // attCk初始值为null 需转化为空字符串 ''
            const tmpAttCk = data.thenList.filter(thenitem => thenitem.key == 'attCk')[0]
            if (!tmpAttCk.value) {
                tmpAttCk.value = ''
            }
            // 重组window、after
            data.sourceList.forEach((item, index) => {
                if (item.type == '0') {
                    // 重置attCk的空值为''
                    let tmp = item.constraintList.filter(con => con.constraintName == 'attCk')
                    if (tmp[0]) {
                        tmp.forEach(tmpitem => {
                            if (!tmpitem.value) {
                                tmpitem.value = ''
                            }
                        })
                    }
                    // console.log(this.slideWindow_sfactpList, index)
                    if (this.slideWindow_sourceList[index] && this.slideWindow_sourceList[index].slideType && this.slideWindow_sourceList[index].slideValue.trim()) {
                        item.window = 'over window:' + this.slideWindow_sourceList[index].slideType + '(' + this.timeToStr(this.slideWindow_sourceList[index].slideValue) + ')'
                    } else {
                        item.window = ''
                    }
                    if (this.after_sourceList[index] && this.after_sourceList[index].afterType && this.after_sourceList[index].afterValue.trim()) {
                        if (this.after_sourceList[index].timeSign === 'range') {
                            item.after = '[' + this.timeToStr(this.after_sourceList[index].afterType[0]) + ',' + this.timeToStr(this.after_sourceList[index].afterType[1]) + ']' + ' ' + this.after_sourceList[index].afterValue
                        } else if (this.after_sourceList[index].timeSign === 'fixed') {
                            item.after = '[' + this.timeToStr(this.after_sourceList[index].afterType) + ']' + ' ' + this.after_sourceList[index].afterValue
                        }
                    } else {
                        item.after = ''
                    }
                } else if (item.type == '1') {
                    // console.log(this.slideWindow_sfactpList, index)
                    if (this.slideWindow_sourceList[index] && this.slideWindow_sourceList[index].slideType && this.slideWindow_sourceList[index].slideValue.trim()) {
                        item.factMap.window = 'over window:' + this.slideWindow_sourceList[index].slideType + '(' + this.timeToStr(this.slideWindow_sourceList[index].slideValue) + ')'
                    } else {
                        item.factMap.window = ''
                    }
                    if (this.after_sourceList[index] && this.after_sourceList[index].afterType && this.after_sourceList[index].afterValue.trim()) {
                        if (this.after_sourceList[index].timeSign === 'range') {
                            item.factMap.after = '[' + this.timeToStr(this.after_sourceList[index].afterType[0]) + ',' + this.timeToStr(this.after_sourceList[index].afterType[1]) + ']' + ' ' + this.after_sourceList[index].afterValue
                        } else if (this.after_sourceList[index].timeSign === 'fixed') {
                            item.factMap.after = '[' + this.timeToStr(this.after_sourceList[index].afterType) + ']' + ' ' + this.after_sourceList[index].afterValue
                        }
                    } else {
                        item.factMap.after = ''
                    }
                }
            })
            console.log(JSON.stringify(data), '1')
            this.sendFormat_sourceList(data.sourceList)
            this.sendChineseToEn(data.sourceList)
            data.noticeMap.userIds = data.noticeMap.userIds.join(',')
            data.status = data.status ? 1 : 0
            console.log(JSON.stringify(data), '2')
            if (this.$route.query.ids == 'edit') {
                updateRule(data).then(res => {
                    if (document.getElementsByClassName('el-message').length === 0) {
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        })
                    }
                    this.loading = false
                    document.getElementById('container').style.overflow = 'auto'
                    setTimeout(() => {
                        this.$router.push('/rule/rule_new_rules_type')
                    }, 2000)
                }).catch(error => {
                    this.loading = false
                    document.getElementById('container').style.overflow = 'auto'
                    console.log(error + 'error')
                })
            } else {
                buildDrools(data).then(res => {
                    if (document.getElementsByClassName('el-message').length === 0) {
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        })
                    }
                    this.loading = false
                    document.getElementById('container').style.overflow = 'auto'
                    setTimeout(() => {
                        this.$router.push('/rule/rule_new_rules_type')
                    }, 2000)
                }).catch(error => {
                    this.loading = false
                    document.getElementById('container').style.overflow = 'auto'
                    console.log(error + 'error')
                })
            }
        },

        // 解析 function 字段
        splitCondition(val, type) {
            let regex = /\((.+?)\)/g
            if (type === 'checked') {
                let start = val.indexOf('(')
                return val.substring(0, start)
            } else if (type === 'value') {
                let res = val.match(regex)
                if (res) {
                    res = res[0]
                    return res.substring(1, res.length - 1)
                } else {
                    return ''
                }
            } else {
                return ''
            }
        },

        add_thenChild(ind) {
            this.eventData.thenList.splice(ind + 1, 0,
                {
                    key: '',
                    value: ''
                }
            )
        },

        del_thenChild(ind) {
            this.eventData.thenList.splice(ind, 1)
        },

        //  递归回显
        getFormatData(arr) {
            arr.forEach(tmp => {
                if (tmp.operator === 'in' || tmp.operator === 'not in') {
                    if (tmp.value.trim() !== '') {
                        let str = tmp.value.substring(1, tmp.value.length - 1)
                        tmp.value = tmp.value.substring(1, tmp.value.length - 1)
                    } else {
                        tmp.value = ''
                    }
                }
                if (tmp.constraintList && tmp.constraintList.length !== 0) {
                    this.getFormatData(tmp.constraintList)
                }
            })
        },

        //  递归回显第1个数组
        getFormat_sourceList(arr) {
            arr.forEach(item => {
                if (item.type == 0) {
                    this.getFormatData(item.constraintList)
                }
                if (item.type == 1) {
                    this.getFormatData(item.countMap.constraintList)
                    this.getFormatData(item.factMap.constraintList)
                }
            })
        },

        // 发送递归
        sendFormatData(arr) {
            arr.forEach(tmp => {
                if (tmp.operator === 'in' || tmp.operator === 'not in') {
                    if (tmp.value.trim()) {
                        let str = tmp.value.trim().split(',')
                        let newStr = str.map(item => {
                            let reg = /^[0-9]*$/
                            if (item.match(reg)) {
                                return Number(item)
                            } else if (item[0] === '"' && item[item.length - 1] === '"') {
                                return item
                            } else {
                                return '"' + item + '"'
                            }
                        })
                        tmp.value = '(' + newStr.join(',') + ')'
                        // console.log(newStr)
                    } else {
                        tmp.value = ''
                    }
                }
                if (tmp.constraintList && tmp.constraintList.length !== 0) {
                    this.sendFormatData(tmp.constraintList)
                }
            })
        },

        // 递归发送第1个数组
        sendFormat_sourceList(arr) {
            arr.forEach(item => {
                if (item.type == '0') {
                    this.sendFormatData(item.constraintList)
                } else if (item.type == '1') {
                    this.sendFormatData(item.factMap.constraintList)
                }
            })
        },

        // 发送时递归遍历数据，将变量字段中文转英文
        sendChineseToEn(arr) {
            console.log(JSON.stringify(arr))
            arr.forEach(item => {
                console.log(arr)
                if (item.type == 0) {
                    this.cnToEn(item.constraintList, item.factType)
                } else if (item.type == 1) {
                    this.cnToEn(item.factMap.constraintList, item.factMap.factType)
                }
            })
        },

        cnToEn(arr, factType) {
            arr.forEach(it => {
                console.log(it)
                if (it.dataType == 1) {
                    if (it.value.trim() && it.value.includes('.')) {
                        let num = it.value.lastIndexOf('.')
                        let str = it.value.slice(num + 1).trim()
                        // if (str in this.enObj) {
                        //     it.value = it.value.slice(0, num) + this.enObj[str]
                        // }
                        // 中文转英文时，加入了根据变量名筛选的逻辑
                        // this.switchFaceType(factType)
                        const list = this.tableData_all
                        console.log(list, factType)
                        if (list.filter(item => item.name == str)[0]) {
                            it.value = it.value.slice(0, num) + list.filter(item => item.name == str)[0].handle
                        }
                        console.log(list)
                    }
                }
                if (it.constraintList && it.constraintList.length !== 0) {
                    this.cnToEn(it.constraintList, factType)
                }
            })
        },
        switchFaceType(faceType) {
            console.log(faceType)
            let list = []
            switch (faceType) {
                case 'AlarmEvent':
                    list = this.tableData_fields_AlarmEvent
                    break
                case 'HostEvent':
                    list = this.tableData_fields_HostEvent
                    break
                case 'TrafficEvent':
                    list = this.tableData_fields_TrafficEvent
                    break
                case 'AppEvent':
                    list = this.tableData_fields_AppEvent
                    break
                case 'AssetEvent':
                    list = this.tableData_fields_AssetEvent
                    break
                case 'MenaceEvent':
                    list = this.tableData_fields_MenaceEvent
                    break
                case 'HistoryIPEvent':
                    list = this.tableData_fields_HistoryIPEvent
                    break
                case 'OutputEvent':
                    list = this.tableData_fields_OutputEvent
                    break
                default:
                    break
            }
            return list
        },
        // 接收数据时递归遍历数据，将变量字段英文转中文
        receiveEnToChinese(arr) {
            arr.forEach(item => {
                if (item.type == 0) {
                    this.enToCn(item.constraintList)
                } else if (item.type == 1) {
                    this.enToCn(item.factMap.constraintList)
                }
            })
        },

        enToCn(arr) {
            arr.forEach(it => {
                if (it.dataType == 1) {
                    if (it.value.trim() && it.value.includes('.')) {
                        let num = it.value.lastIndexOf('.')
                        let str = it.value.slice(num).trim()
                        console.log(this.cnObj)
                        if (str in this.cnObj) {
                            it.value = it.value.slice(0, num + 1) + this.cnObj[str]
                        }
                    }
                }
                if (it.constraintList && it.constraintList.length !== 0) {
                    this.enToCn(it.constraintList)
                }
            })
        },

        // 解析滑动窗口字段
        splitWindow(arr, type) {
            arr.forEach(item => {
                if (item.type == 0) {
                    let obj = {}
                    if (item.window.includes('time')) {
                        obj.slideType = 'time'
                        let sta = item.window.indexOf('(')
                        let end = item.window.indexOf(')')
                        obj.slideValue = this.strToTime(item.window.substring(sta + 1, end))
                        this[type].push(obj)
                    } else if (item.window.includes('length')) {
                        obj.slideType = 'length'
                        let sta = item.window.indexOf('(')
                        let end = item.window.indexOf(')')
                        obj.slideValue = item.window.substring(sta + 1, end)
                        this[type].push(obj)
                    } else {
                        this[type].push({ slideType: '', slideValue: '' })
                    }
                } else if (item.type == 1) {
                    let obj = {}
                    if (item.factMap.window.includes('time')) {
                        obj.slideType = 'time'
                        let sta = item.factMap.window.indexOf('(')
                        let end = item.factMap.window.indexOf(')')
                        obj.slideValue = this.strToTime(item.factMap.window.substring(sta + 1, end))
                        this[type].push(obj)
                    } else if (item.factMap.window.includes('length')) {
                        obj.slideType = 'length'
                        let sta = item.factMap.window.indexOf('(')
                        let end = item.factMap.window.indexOf(')')
                        obj.slideValue = item.factMap.window.substring(sta + 1, end)
                        this[type].push(obj)
                    } else {
                        this[type].push({ slideType: '', slideValue: '' })
                    }
                }
            })
        },

        // 解析after字段
        splitAfter(arr, type, num) {
            arr.forEach(item => {
                if (item.type == 0) {
                    let obj = {}
                    if (item.after.includes(',')) {
                        let sta = item.after.indexOf('[')
                        let mid = item.after.indexOf(',')
                        let end = item.after.indexOf(']')
                        obj.afterType = []
                        obj.timeSign = 'range'
                        obj.afterType.push(this.strToTime(item.after.substring(sta + 1, mid)))
                        obj.afterType.push(this.strToTime(item.after.substring(mid + 1, end)))
                        obj.afterValue = item.after.trim().split(' ')[1]
                    } else if (!item.after.includes(',') && item.after !== '') {
                        let sta = item.after.indexOf('[')
                        let end = item.after.indexOf(']')
                        obj.afterType = this.strToTime(item.after.substring(sta + 1, end))
                        obj.timeSign = 'fixed'
                        obj.afterValue = item.after.trim().split(' ')[1]
                    } else {
                        obj.afterType = ''
                        obj.afterValue = ''
                        obj.timeSign = ''
                    }
                    this[type].push(obj)
                } else if (item.type == 1) {
                    let obj = {}
                    if (item.factMap.after.includes(',')) {
                        let sta = item.factMap.after.indexOf('[')
                        let mid = item.factMap.after.indexOf(',')
                        let end = item.factMap.after.indexOf(']')
                        obj.afterType = []
                        obj.timeSign = 'range'
                        obj.afterType.push(this.strToTime(item.factMap.after.substring(sta + 1, mid)))
                        obj.afterType.push(this.strToTime(item.factMap.after.substring(mid + 1, end)))
                        obj.afterValue = item.factMap.after.trim().split(' ')[1]
                    } else if (!item.factMap.after.includes(',') && item.factMap.after !== '') {
                        let sta = item.factMap.after.indexOf('[')
                        let end = item.factMap.after.indexOf(']')
                        obj.afterType = this.strToTime(item.factMap.after.substring(sta + 1, end))
                        obj.timeSign = 'fixed'
                        obj.afterValue = item.factMap.after.trim().split(' ')[1]
                    } else {
                        obj.afterType = ''
                        obj.afterValue = ''
                        obj.timeSign = ''
                    }
                    this[type].push(obj)
                }
            })
        },

        // 滑动窗口时间转换
        timeToStr(time, show) {
            // console.log(time)
            if (time.includes('-')) {
                time = time.replace('-', 'h')
                time = time.replace('-', 'm')
                time = time + 's'
                return time
            } else {
                return time
            }
        },

        timeToShow(time) {
            let copy_time = JSON.parse(JSON.stringify(time))
            if (typeof copy_time === 'string') {
                if (copy_time.includes('-')) {
                    copy_time = copy_time.replace('-', 'h')
                    copy_time = copy_time.replace('-', 'm')
                    copy_time = copy_time + 's'
                    return copy_time
                }
            } else if (typeof copy_time === 'object') {
                copy_time[0] = copy_time[0].replace('-', 'h')
                copy_time[0] = copy_time[0].replace('-', 'm')
                if (copy_time[0][copy_time[0].length - 1] !== 's') {
                    copy_time[0] = copy_time[0] + 's'
                }
                copy_time[1] = copy_time[1].replace('-', 'h')
                copy_time[1] = copy_time[1].replace('-', 'm')
                if (copy_time[1][copy_time[1].length - 1] !== 's') {
                    copy_time[1] = copy_time[1] + 's'
                }
                return copy_time
            }
        },

        strToTime(str) {
            str = str.replace('h', '-')
            str = str.replace('m', '-')
            str = str.replace('s', '')
            return str
        }

    }
}

</script>

<style lang="scss" scoped>
.list-tip {
    height: 24px;
    line-height: 24px;
    font-size: 14px;
    color: #1c1c1c;
    position: relative;
    margin-left:-20px;
}
.value{
    ::v-deep input{
        border-radius: 0px !important;
        border-top-right-radius: 4px !important;
        border-bottom-right-radius: 4px !important;
    }
}
.showcase_then{
    ::v-deep input{
        height:32px !important;
    }
}
.showKey{
    ::v-deep input{
        background:#fff !important;
        width:102px !important;
        color:#0052d9 !important;
        border-right:none !important;
        border-top-right-radius: none !important;
        border-bottom-right-radius: none !important;
        padding-left:10px !important;
    }
}
.shuxing{
    .guding{
        ::v-deep .el-input__icon{
            line-height:40px !important;
        }
    }
    .suiji{
        ::v-deep .el-input__icon{
            line-height:24px !important;
        }
        ::v-deep .el-range-input{
            font-size:12px !important;
        }
    }
}
.container {
    width: 100% !important;
    min-height: 100% !important;
    overflow-x:hidden!important;
    overflow-y:auto;
    //padding-top: 12px;
    box-sizing: border-box;
    min-width: 1100px;
}
.rules-page ::v-deep .CodeMirror{
    flex-grow: 1;
    z-index: 1;
    height: 470px !important;

    .CodeMirror-code {
        line-height: 19px;
    }
}
.rules-page ::v-deep .code-mode-select {
    position:absolute;
    z-index:2;
    right: 10px;
    top: 10px;
    max-width: 130px;
}
.even-content {
    padding: 20px 20px 0px 40px !important;
    position: relative;
    border: solid 1px #dadee8;
    box-shadow: 0px 0px 8px 0px rgba(140, 152, 164, 0.2);
    font-size: 14px;
    font-family: Microsoft YaHei;
    background-color: #fff;

}
.bg-area {
    margin-top: 0px !important;
    padding: 15px 0;
    margin-right:20px;
}
.bg-area:nth-child(odd){
    background-color: #f3f3f3;
}
.bg-area:nth-child(even) {
    background: #e7e7e7;
}
.even-content:before {
    content: '';
    position: absolute;
    left: -1px;
    top: -1px;
    width: 90px;
    height: 28px;
    background: url(/static/img/dotBg.png) no-repeat;
}

.title-line {
    // height: 30px;
    // line-height: 30px;
    margin-top:20px;
    margin-bottom: 10px;
    margin-left: -20px;

    .title-name {
        color: #0052d9;
        font-size: 12px;
        display: inline-block;
    }
}
.switch-wrapper{
    width:68px;
    height:30px;
    margin-top: 4px;
    position: relative;
    cursor: pointer;
}
.switch-wrapper>div:nth-child(1){
    width:68px;
    height:26px;
    background-color: #0052d9;
    border-radius: 14px;
    div{
        font-size: 14px;
        line-height: 26px;
        padding:0 8px;
    }
    >div:nth-child(1){
        color: rgba(255,255,255,0.9);
    }
    >div:nth-child(2){
        color: rgba(255,255,255,0.9);
    }
}
.switch-wrapper>div:nth-child(2){
    width: 22px !important;
    height: 22px !important;
    position: absolute;
    // left:2px;
    top:50%;
    margin-top: -13px !important;
    border-radius:100%;
    background-color: #c5c5c5;
}
.switch-wrapper.yes>div:nth-child(2){
    animation: moveone 0s linear forwards;
}
.switch-wrapper.no>div:nth-child(2){
    animation: _moveone 0s linear forwards;
}
@keyframes moveone {
    0% {
        background-color: rgb(255,255,255);
        left: 2px;
    }

    100% {
        background-color: rgb(255,255,255);
        left: 42px;
    }
}
@-webkit-keyframes moveone {
    0% {
        background-color: rgb(255,255,255);
        left: 2px;
    }

    100% {
        background-color: rgb(255,255,255);
        left: 42px;
    }
}
@keyframes _moveone {
    0% {
        background-color: rgb(255,255,255);
        left: 42px;
    }

    100% {
        background-color: rgb(255,255,255);
        left: 2px;
    }
}
@-webkit-keyframes _moveone {
    0% {
        background-color: rgb(255,255,255);
        left: 42px;
    }

    100% {
        background-color: rgb(255,255,255);
        left: 2px;
    }
}

.addRuleBtn.el-button--primary {
    background-color: rgba(0,0,0,0);
    border-color: rgba(0,0,0,0);
    background-image: url(../.././assets/img/XZWJ.png);
    background-position: 0 0;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    padding: 9px 15px;
}

.list-tips {
    margin-bottom: 20px;
    margin-left: -22px;
}

.releaseBtn {
    position: absolute;
    top: 15px;
    right: 20px;
}

.ruleAttr.w300 {
    width: 300px;
    height: 34px;
}

.el-form ::v-deep .el-input__inner {
    height: 30px;
}

.container ::v-deep .el-input__inner,.inner-note ::v-deep .el-input__inner, .container ::v-deep .el-textarea__inner,.inner-note ::v-deep .el-textarea__inner{
    // background-color: transparent !important;
    // border: 1px solid #1cd7fa;
    // box-shadow: 0px 0px 7px #389bf7 inset;
    // color: rgba(0,0,0,.9);
    font-size: 12px;
}
.container  ::v-deep  .el-checkbox__label {
    font-size: 12px;
}
.container  ::v-deep  .el-select .el-input .el-select__caret {
    // color: #1cd7fa;
}
.handleArea {
    background-color: rgba(56,125,238,0.02);
    border: 1px solid #dddddd;
}

#tab-first {
    width: 60px;
    height: 34px;
}

.showcase ::v-deep  .line-put .el-input__inner,.showcase_then  ::v-deep .el-input__inner {
    height: 26px;
}

.container ::v-deep .el-input__inner:hover {
    border-color: #C0C4CC;
}

.showcase .el-input {
    width: 160px;
}
.showcase_then  ::v-deep .el-input__inner,
.showcase_then  ::v-deep .el-select {
    // width: 200px !important;
    // color:#0052d9 !important;
    // background:#fff !important;
}
.showcase_then  ::v-deep  .el-input__suffix .el-input__icon{
    height: 26px;
    line-height: 26px;
}
.bottom_3 .el-input,.bottom_4 .el-input{
    width: 100px;
}

.bottom_3 .el-input  ::v-deep  .el-input__inner, .bottom_4 .el-input  ::v-deep  .el-input__inner{
    height: 20px;
    line-height: 20px;
}

.addRuleBtn {
    margin-bottom: 20px;
}
.container ::v-deep .el-tabs ,.container ::v-deep .el-tabs .el-tab-pane {
    font-size:12px;
    height: calc(100% - 20px);
}
/*使下拉不被隐藏*/
.container ::v-deep .el-tabs .el-tabs__content #pane-first{
    height: calc(100%);
    padding-bottom: 200px;
}

.container ::v-deep .el-tabs__item:hover {
    color: #0052d9;
}
.container ::v-deep  .el-tabs__item {
    color: rgba(0,0,0,0.6);
    font-size:12px;
}
.showcase ::v-deep .el-select {
    width: 120px;
}
.container ::v-deep #tab-first{
    margin-left:20px;
}

.el-select-dropdown__item {
    padding-left: 14px;
    /*font-size: 12px;*/
    // color: rgba(0,0,0,.9);
}

.showThen .el-select-dropdown__item {
    font-size: 12px;
}

.el-input.is-disabled .el-input__inner {
    // background-color: transparent !important;
    border: 1px solid #1cd7fa !important;
    color: #fff !important;
}

.el-select-dropdown__item:hover, .el-select-dropdown__item.hover{
    // background-color: #043254;
}

.el-select-dropdown__item.selected {
    // color: rgba(0,0,0,.9);
}

.container ::v-deep .el-radio__inner::after {
    /*display: none;*/
    background-color: red;
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
.el-tabs  ::v-deep  .el-tabs__item.is-active {
    border: none !important;
    box-shadow: none !important;
}
.container  ::v-deep .el-tabs__header {
    margin-bottom: 1px !important;
}

.container ::v-deep .el-tabs__active-bar {
    margin-left:20px;
    // width:100px !important;
    background: #0052d9;
}

.container ::v-deep .el-tabs__item.is-active {
    color: #0052d9;
    height: 24px;
    line-height: 24px;
    font-size:12px;
}
.container ::v-deep .el-tabs--top .el-tabs__item.is-top {
    // padding-left: 30px;
    line-height:24px;
}
.container ::v-deep .el-tabs__nav-scroll{
    height:24px !important;
}
.container ::v-deep .el-tabs__nav{
    height:24px !important;
}
.container ::v-deep .el-tabs--top .el-tabs__item.el-tabs__active-bar {
    line-height:24px;
}
.handleTile {
    margin-bottom: 20px;
    margin-top: 24px;
}

div.addRule {
    padding: 20px 30px;
    margin: 0 20px;
    background: #052136;
    border: 1px solid #1cd7fa;
}

/*下方展示区*/
.output-box {
    padding: 5px 0 0 0;
}
.showcase,.showcase_then {
    color:#fff;
    // min-height: 200px;
    box-sizing: border-box;
    padding: 10px 0;
    border-radius: 4px;
    font-size: 12px;
}

.showcase>li {
    padding-left: 20px;
}

.selectActive {
    color: #00b4ff;
}

.conditionName {
    /*border-bottom: 1px solid transparent;*/
    text-decoration: underline transparent;
}

.conditionName:hover {
    text-decoration: underline #fff;
    /*border-color: #FFF;*/
    cursor: pointer;
}

.container ::v-deep .el-select,.container ::v-deep .el-input.is-focus{
    border-color: #409EFF;
    background-color: transparent;
    color: #fff;
}

.showcase>li,.showcase_then>li {
    position: relative;
    line-height: 34px;
    display: inline-block;
    width: 33.3%;
    margin-bottom: 10px;
    /*margin-top: 0;*/
}

.el-icon-circle-plus-outline.inner {
    position: absolute;
    right: 40px;
    top:50%;
    transform: translateY(-50%);
    z-index: 10;
}

.el-icon-circle-close {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
}

.showcase_then  ::v-deep  .el-tag.el-tag--info {
    background-color: rgba(0,0,0,0)!important;
    border-color: #00E9FF!important;
    color: rgba(0,0,0,.9)!important;
}

.showcase_then  ::v-deep  .el-tag.el-tag--info .el-tag__close {
    color: #00e9ff;
}

.showcase_then  ::v-deep  .el-select .el-tag__close.el-icon-close {
    background-color: transparent;
}
// 处理input type = number的上下箭头
.showcase_then  ::v-deep  input::-webkit-outer-spin-button,
.showcase_then  ::v-deep  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}
.showcase_then  ::v-deep  input[type="number"]{
    -moz-appearance: textfield;
}

// 规则组
.select-box{
    width:100%;
    height:30px;
    position: relative;
}
.select-title{
    width:100%;
    height:100%;
    border: 1px solid #dcdcdc;
    border-radius:4px;
    box-sizing: border-box;
}
.select-mask{
    width:100%;
    min-height:100px;
    max-height:300px;
    position: absolute;
    left:0;
    top:36px;
    z-index: 999;
    overflow-y: auto;
    border: 1px solid rgba(0,0,0,.2);
    color: rgba(0,0,0,.9);
    border-radius:4px;
}

.inform-box {
    margin-bottom: 80px;

    ::v-deep  .el-form-item {
        margin-bottom: 10px;

        .el-checkbox__label {
            margin-left:10px;
            color: rgba(0,0,0,.9);
        }
        .el-checkbox__input.is-checked+.el-checkbox__label {
            color: rgba(0,0,0,.9);
        }
    }

}

.el-select  ::v-deep  .el-tag {
    background-color: transparent;
    border-color: #1bd7fa;
    color: #1bd7fa;
}
.el-select  ::v-deep .el-tag__close.el-icon-close {
    background-color: transparent;
}
.el-select  ::v-deep .el-tag.el-tag--info .el-tag__close {
    color: #00e9ff;
}
.el-select  ::v-deep .el-select__tags {
    flex-wrap: inherit !important;
    overflow-x: auto !important;
}
.tab-wrapper ::v-deep .el-button--primary {
    //font-size: 14px!important;
    padding: 7px 7px;
    width: 60px !important;
    box-sizing: border-box;
    // background-color: #fff !important;
    border-color: #dddddd;
    // background-image: url(../../assets/img/and_or.png);
    background-position: 0 0;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    // color:rgba(0,0,0,.9);
}
.el-dropdown-menu.el-popper {
    width: 60px !important;
    .el-dropdown-menu__item {
        padding: 0!important;
        text-align: center;
        line-height: 30px;
    }
}
.my-codemirror {
    width:100%;padding:0;
    text-align:left;
    font-size: 14px;
}
.fold-arrow {
    position: absolute;
    width: 14px;
    height: 14px;
    left: -21px;
    top: 7px;
    font-size: 14px;
    z-index: 9;
    color: #fff;
    // text-shadow: 0 0 5px #00d2ff;
}
.fold-arrow.is-show {
    transform: rotate(90deg);
    transform-origin: center center;
}
.fold-arrow-inner {
    position: absolute;
    width: 14px;
    height: 14px;
    left: 70px;
    top: 7px;
    font-size: 14px;
    z-index: 9;
    color: #fff;
    // text-shadow: 0 0 5px #00d2ff;
}
.fold-arrow-inner.is-show {
    transform: rotate(90deg);
    transform-origin: center center;
}
.fold-arrow-bottom {
    position: absolute;
    text-shadow: 0px 0px 8px #00d2ff;
    width: 14px;
    height: 14px;
    left: 32px;
    top: 8px;
    font-size: 14px;
    z-index: 9;
    color: #fff;
}
.tree-title {
    /*margin-top: 20px;*/
    margin-left: 53px;
    white-space: nowrap;
    position:relative;
}
/*.tree-title::before {
    content: "";
    height: calc(100% - 80px);
    width: 1px;
    position: absolute;
    left: 15px;
    top: 30px;
    border-width: 1px;
    border-left: 1px dashed #52627C;
}*/
.tree-title-accumulate::after {
    display: none !important;
}
.tree-title::after {
    content: "";
    width: 50px;
    height: 20px;
    position: absolute;
    left: -68px;
    top: 14px;
    border-width: 1px;
    border-top: 1px dashed #387dee;
}

.box-title, .time-title {
    position: relative;
    height: 28px;
    line-height: 28px;
    box-sizing: border-box;
    border-radius: 4px;
    background-color: #ffffff;
    border: 1px solid #dcdcdc;
    // -webkit-box-shadow: 0px 0px 7px #389bf7 inset;
    // box-shadow: 0px 0px 7px #389bf7 inset;
    color: rgba(0,0,0,0.9);
    font-size: 12px;
    padding: 0 10px 0 15px;
    overflow:hidden;
    margin-left: 10px;
    text-overflow:ellipsis;
    white-space:nowrap;
}
.box-title {
    max-width: 612px !important;
    min-width: 200px !important;
    border-radius: 4px;
}
.time-title {
    width: 160px !important;
    margin: 0 !important;
}
.time-title::before {
    content: "";
    height: 30px;
    width: 1px;
    position: absolute;
    left: -16px;
    top: 24px;
    border-width: 1px;
    border-left: 1px dashed #387dee;
}
.operate-btn {
    height: 30px;
    line-height: 30px;
    font-size: 0;
}
.operate-btn i,.inner-note i {
    font-size: 12px !important;
    color: rgba(0,0,0,.9);
    margin-right: 10px;
    cursor: pointer;
}
.tree-line-outer::before {
    content: "";
    height: 13px;
    width: 1px;
    position: absolute;
    left: -15px;
    top: 2px;
    border-width: 1px;
    border-left: 1px dashed #387dee;
}
.tree-line-vertical {
    position: relative;
}
.tree-line-vertical::before {
    content: "";
    height: calc(100% + 40px);
    width: 1px;
    position: absolute;
    left: -15px;
    top: -20px;
    border-width: 1px;
    border-left: 1px dashed #387dee;
}
.tree-line-outer::after {
    content: "";
    width: 40px;
    height: 20px;
    position: absolute;
    left: -14px;
    top: 14px;
    border-width: 1px;
    border-top: 1px dashed #387dee;
}
.container{
    ::v-deep .el-dropdown-menu__item{
        font-size:12px;
    }
}
.tree-line-count::before {
    content: "";
    height: 40px;
    width: 1px;
    position: absolute;
    left: 38px;
    top: -26px;
    border-width: 1px;
    border-left: 1px dashed #387dee;
}
.tree-line-count::after {
    content: "";
    width: 40px;
    height: 20px;
    position: absolute;
    left: 38px;
    top: 14px;
    border-width: 1px;
    border-top: 1px dashed #387dee;
}
/*.container  ::v-deep  .el-input__inner {
    border-radius: 0 !important;
}*/
.fields-title {
    height: 40px;
    margin-bottom: 10px;
    line-height: 50px;
    border-bottom: 1px solid rgba(28,215,250,.2);
    p {
        position: relative;
        font-size: 16px;
        margin-right: 15px;
        color: #fff;
        opacity: .5;
    }
    p.active {
        color: #1cd7fa;
        opacity: 1;
    }
    p.active::after {
        position: absolute;
        content: '';
        width: 100%;
        height: 1px;
        bottom: -1px;
        left: 0;
        background: #1cd7fa;
        opacity: 1;
        z-index: 9;
    }
    p:hover {
        cursor: pointer;
        // color: #1cd7fa;
        opacity: 1;
    }
}
.container  ::v-deep  .el-select-dropdown__list {
    max-height: 260px !important;
}
.container  ::v-deep  .el-button.is-disabled, .el-button.is-disabled:focus, .el-button.is-disabled:hover {
    // color: rgba(0,0,0,.4);
    cursor: not-allowed;
    background-image: none;
    background-color: transparent;
    border-color: transparent;
}
.rulesForm  ::v-deep .el-input-group__append, .rulesForm  ::v-deep .el-input-group__prepend {
    background: transparent !important;
    // border: 1px solid #1cd7fa;
    //border-radius: 0;
    border-left: none;
    // -webkit-box-shadow: 0px 0px 7px #389bf7 inset;
    // box-shadow: 0px 0px 7px #389bf7 inset;
    color: #fff;
}
.rulesForm {
    .first{
    ::v-deep .el-form-item__label{
        margin-bottom: -4px !important;
    }
    }
}

.showcase_then  ::v-deep  .showKey .el-input__suffix {
    display: none;
}
.attck-tree {
    ::v-deep .vue-treeselect__control {
        border-radius: 0 4px 5px 0;
        width:300px !important;
        .vue-treeselect__value-container {
            .vue-treeselect__single-value {
                line-height: 30px;
            }
            .vue-treeselect__input-container {
                height: 30px;
            }
        }
    }
    // ::v-deep .vue-treeselect__input-container {
    //     height: 30px;
    // }
    // ::v-deep .vue-treeselect__single-value {
    //     line-height: 30px;
    // }
    ::v-deep .vue-treeselect__input {
        height: auto!important;
    }
}
.container  ::v-deep  .iconfont.icon-zhedie.fold-arrow {
    text-shadow: 0px 0px 8px #00d2ff;
}
//.rulesForm  ::v-deep  .el-textarea__inner {
//    border-radius: 0 !important;
//}
p.is-required::before {
    content: "*";
    position: absolute;
    left: -14px;
    top: -4px;
    color: #f56c6c;
}
p.is-required.required-msg::after {
    content: "该字段不能为空";
    position: absolute;
    left: 210px;
    bottom: -20px;
    color: #f56c6c;
}

@keyframes moveone_white {
    0% {
        background-color: #fff;
        left: 1px;
    }

    100% {
        background-color: #fff;
        left: 43px;
    }
}
@-webkit-keyframes moveone_white {
    0% {
        background-color: #fff;
        left: 1px;
    }

    100% {
        background-color: #fff;
        left: 43px;
    }
}
@keyframes _moveone_white {
    0% {
        background-color: #fff;
        left: 43px;
    }

    100% {
        background-color: #fff;
        left: 1px;
    }
}
@-webkit-keyframes _moveone_white {
    0% {
        background-color: #fff;
        left: 43px;
    }

    100% {
        background-color: #fff;
        left: 1px;
    }
}
.white-theme .switch-wrapper.yes>div:nth-child(2){
    animation: moveone_white 0s linear forwards;
}
.white-theme .switch-wrapper.no>div:nth-child(2){
    animation: _moveone_white 0s linear forwards;
}
</style>
<style lang="scss" scoped>
.select-option {
    width: 100px;
    // background:#0D4874 !important;
    border: none;
}
.el-input.is-disabled .el-input__inner {
    background-color: transparent;
    border: 1px solid #1cd7fa ;
    color: #fff !important;
}
.cm-s-cobalt .CodeMirror-gutters {
    // border-right: 1px solid rgba(28,215,250,0.2) !important;
    background:#fbfcff !important;
}
.cm-s-cobalt .CodeMirror-scroll{
    background:#fbfcff !important;
    color:rgba(0,0,0,.9) !important;
}
.el-popover.popover-select{
    min-width: 80px;
    background: rgb(4, 33, 54)!important;
    border: 1px solid #1a5c92;
    padding:10px 0;
    top: 568px !important;

    .popover-list>div{
        height:30px;
        text-align: center;
        line-height: 30px;
        font-size:15px;
        color:#fff;
        cursor: pointer;
    }
    .popover-list>div:nth-child(2n){
        background-color: rgb(4, 33, 54);
    }
    .popover-list>div:hover{
        // color:#01f7f6;
    }
}
.el-popover.popover-select2{
    position: absolute;
    background:#fff !important;
    // background: rgb(4, 33, 54)!important;
    // border: 1px solid #1cd7fa;
    padding:0 !important;
    // -webkit-box-shadow: 0px 0px 7px #389bf7 inset;
    // box-shadow: 0px 0px 7px #389bf7 inset;
}
.el-popper[x-placement^=bottom].popover-select .popper__arrow{
    border-bottom-color: #EBEEF5;
}
.el-popper[x-placement^=bottom].popover-select .popper__arrow::after{
    /*background: #043254;*/
    border-bottom-color: rgb(4,33,54);
}
.inner-note .el-textarea__inner {
    border: none !important;
    box-shadow: none !important;
    padding: 5px 10px !important;
}
.el-select-dropdown__list .el-select-dropdown__item, .el-select-dropdown__list .el-select-dropdown__item:hover{
    // background: rgb(4,33,54);
}
.black-theme .rules-page .el-select-dropdown__list .el-select-dropdown__item,
.black-theme .rules-page .el-select-dropdown__list .el-select-dropdown__item:hover{
    // background: rgb(4,33,54) !important;
}
.black-theme .rules-page .el-table::before {
    background: none !important;
}
.clearfix:after{
    content: '.';
    position: relative;
    display: block;
    height: 0;
    visibility: hidden;
    clear: both;
}
.bigTable.innerTable.el-table::before {
    background: transparent;
}

.custom-star .list-tip {
    background-color: rgba(0,0,0,0) !important;
    color: #fff;
}
.custom-star .container ::v-deep .el-tabs--top .el-tabs__item.is-top {
    color: #fff;
}
.custom-star #app .showcase_then .showKey ::v-deep .el-input__inner{
    border: none !important;
    background-color: rgba(0,0,0,0) !important;
    color: #fff !important;
    box-shadow: none !important;
}

.custom-star #app .bg-area:nth-child(odd){
    background: rgba(0,0,0,0);
}
.custom-star #app .bg-area:nth-child(even) {
    background: rgba(0,0,0,0);
}
.custom-star #app .select-title {
    border: 1px solid #1cd7fa;
    color: #ffffff;
    background-color: rgb(0 0 0 / 0%);
    box-shadow: 0 0 7px inset #389bf7;
    border-radius: 4px;

}
.custom-star #app .even-content {
    background-color: rgba(0,0,0,0);
}
</style>
