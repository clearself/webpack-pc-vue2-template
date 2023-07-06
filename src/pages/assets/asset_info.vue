<template>
    <div class="list">
        <div class="ub w100" style=" overflow: hidden;height: calc(100vh - 80px);">
            <div style="overflow-y: auto;border-radius: 4px;" class="mr-1 mb-1 tree">
                <div class="asset-tree" style="position: relative;">
                    <div class="ub ub-pj ub-ac w100 mt-1 pl-1 mb-1">
                        <div class="list-tips" style="margin-bottom: 0;font-size: 12px;">分组列表</div>
                        <div class="tree-option" style="padding-right: 10px;font-size: 12px;color: #1cd7fa;">
                            <el-tooltip class="item" effect="dark" content="新增" placement="top-start">
                                <i class="iconfont icon-tianjiashu" style="font-size: 12px;color: #387dee;" @click="addRuleShow"></i>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                                <i v-if="currentNodeData.length < 2 && get_params.groupIds.length>0" class="iconfont icon-xiugaishu" style="font-size: 12px;color: #387dee;" @click="editRuleShow"></i>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                                <i v-if="currentNodeData.length < 2 && get_params.groupIds.length>0" class="iconfont icon-shanchushu" style="font-size: 12px;color: #387dee;" @click="delRuleShow"></i>
                            </el-tooltip>
                        </div>
                    </div>
                    <div style="padding: 0 10px 10px;">
                        <el-input
                            placeholder="请输入关键词搜索"
                            clearable
                            v-model="filterText"
                            class="tree-input"
                            suffix-icon="el-icon-search"
                            size="mini">
                        </el-input>
                    </div>
                    <el-tree
                        show-checkbox
                        ref="asset-tree"
                        node-key="id"
                        :filter-node-method="filterNode"
                        :default-expand-all="false"
                        :highlight-current="!['aqy','zclx','ywxt','zzjg'].includes(currentNode.id)"
                        :data="assetTreeData"
                        :props='assetPropsData'
                        @node-click="handleNodeClick"
                        :expand-on-click-node="true"
                        :check-on-click-node="true"
                        :check-strictly="false"
                        @check="treeCheck"
                        :indent='indent'>
                        <span class="custom-tree-node" slot-scope="{ node }">
                            <span style="font-size: 12px;color: rgb(0 0 0 / 90%);">{{ node.label }}</span>
                        </span>
                    </el-tree>
                </div>
            </div>
            <div class="ub ub-f1 ub-ver mb-1" style="overflow: auto; height: 100%;">
                <div>
                    <SearchTop @search="searchAssets"  @reset="reset" @isOpen="isOpen">
                        <el-col :md="12" :lg="8" :xl="6">
                            <el-form :model="get_params">
                                <el-form-item label="资产名称：" label-width="80px">
                                    <el-input
                                        placeholder="请输入资产名称"
                                        clearable
                                        v-model="get_params.assetsName"
                                        @keyup.enter.native="searchAssets"
                                        size="small"></el-input>
                                </el-form-item>
                            </el-form>
                        </el-col>
                        <el-col :md="12" :lg="8" :xl="6">
                            <el-form :model="get_params">
                                <el-form-item label="IP：" label-width="80px">
                                    <el-input placeholder="请输入IP" clearable v-model="get_params.ip" @keyup.enter.native="searchAssets" size="small"></el-input>
                                </el-form-item>
                            </el-form>
                        </el-col>
                        <el-col :md="12" :lg="8" :xl="6">
                            <el-form :model="get_params">
                                <el-form-item label="操作系统：" label-width="80px">
                                    <el-input placeholder="请输入操作系统" clearable v-model="get_params.system" @keyup.enter.native="searchAssets" size="small"></el-input>
                                </el-form-item>
                            </el-form>
                        </el-col>
                        <el-col :md="12" :lg="8" :xl="6">
                            <el-form :model="get_params">
                                <el-form-item label="系统版本：" label-width="80px">
                                    <el-input placeholder="请输入系统版本" clearable v-model="get_params.version" @keyup.enter.native="searchAssets" size="small"></el-input>
                                </el-form-item>
                            </el-form>
                        </el-col>
                        <el-col :md="12" :lg="8" :xl="6">
                            <el-form :model="get_params">
                                <el-form-item label="组件版本：" label-width="80px">
                                    <el-input
                                        placeholder="请输入组件版本"
                                        clearable
                                        v-model="get_params.app_version"
                                        @keyup.enter.native="searchAssets"
                                        size="small"></el-input>
                                </el-form-item>
                            </el-form>
                        </el-col>
                        <el-col :md="12" :lg="8" :xl="6">
                            <el-form :model="get_params">
                                <el-form-item label="组件：" label-width="80px">
                                    <el-input
                                        placeholder="请输入组件"
                                        clearable
                                        v-model="get_params.software"
                                        @keyup.enter.native="searchAssets"
                                        size="small"></el-input>
                                </el-form-item>
                            </el-form>
                        </el-col>
                        <el-col :md="12" :lg="8" :xl="6">
                            <el-form :model="get_params">
                                <el-form-item label="资产时间：" label-width="80px">
                                    <CustomDate :append-to-body="true" :chart-time-range="chartTimeRange" @getCustomTime="getCustomTime" @getDateData="getDateData" :auto="true" @useing="customDateUse" :current-type="1" :empty="true" ref="customDate"></CustomDate>
                                </el-form-item>
                            </el-form>
                        </el-col>
                        <el-col :md="12" :lg="8" :xl="6">
                            <el-form :model="get_params">
                                <el-form-item label="组织级别：" label-width="80px">
                                    <el-select filterable size="small" v-model="get_params.orgLevel" clearable placeholder="请选择" style="width: 100%;">
                                        <el-option v-for="(item) in orgLevelList" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-form>
                        </el-col>
                    </SearchTop>
                    <div class="ub tab-button">
                        <div class="table-view ub ub-pc" @click="viewTab = 'tableView'" :class="{ 'tab-active': viewTab === 'tableView' }">表格视图</div>
                        <div class="chart-view ub ub-pc" @click="viewTab = 'chartView'" :class="{ 'tab-active': viewTab === 'chartView' }">图表视图</div>
                    </div>
                    <div class="list-container" v-show="viewTab === 'tableView'">
                        <div class="ub ub-pj w100 mb-1 ub-ac">
                            <div class="list-tips">资产库</div>
                            <div>
                                <!-- <el-button @click="$pushRouter('/help_manual/help_asset_center')" type="text" size="small" style="font-size:12px;color:rgba(0,0,0,.4)"><i class="el-icon-question" style="font-size:14px;margin-right:5px"></i>帮助手册</el-button > -->
                                <el-button icon="el-icon-plus" @click="addDomainDialog = true" type="primary" size="small" v-per="['assets_assets_add']">添加资产</el-button>

                                <el-button icon="el-icon-download" @click="downLoad" size="small" type="primary" v-per="['assets_assets_xls']">下载模板</el-button>
                                <el-upload
                                    class="mr-1 ml-1"
                                    action="/api/assets-manage/manage/assets/importExcel"
                                    :headers="header"
                                    :with-credentials="true"
                                    name="fileUpload"
                                    accept=".xlsx,.xlsx"
                                    :file-list="fileList"
                                    :show-file-list="false"
                                    :on-success="handleSuccess"
                                    style="display: inline-block;">
                                    <el-button size="small" type="primary" v-per="['assets_assets_import']" icon="iconfont icon-daoru">导入资产</el-button>
                                </el-upload>
                                <!-- <a :href="downloadUrl" download class="mr-1"> -->
                                <el-button size="small" type="primary" @click="downData" v-per="['assets_assets_export']" icon="iconfont icon-daochu">导出资产</el-button>
                                <!-- </a> -->
                                <el-dropdown trigger="click" :hide-on-click="false" class="mr-1 ml-1">
                                    <el-button icon="el-icon-edit-outline" size="small" type="primary" v-per="['assets_assets_cf']" style="border: 1px solid #bd50d3;background: #bd50d3;">配置表头</el-button>
                                    <el-dropdown-menu slot="dropdown" style="padding-left: 10px;">
                                        <span class="el-icon-info" style="margin-bottom: 10px;font-size: 12px;color: rgb(0 0 0 / 90%);">
                                            <span style="margin-left: 8px;font-size: 12px;">拖拽字段进行排序</span>
                                        </span>
                                        <el-checkbox-group v-model="checkList" @change="changeHeader">

                                            <draggable class="w100" tag="div" v-model="checkListAll" v-bind="{scroll: true,animation: 150}" @end="onEnd">
                                                <transition-group>
                                                    <el-checkbox :label="element" v-for="element in checkListAll" :key="element"></el-checkbox>
                                                </transition-group>
                                            </draggable>
                                        </el-checkbox-group>
                                    </el-dropdown-menu>
                                </el-dropdown>
                                <el-button @click="delAllUserBtn" size="small" icon="el-icon-delete" type="danger" v-per="['assets_assets_del']">删除</el-button>
                            </div>
                        </div>
                        <div :style="{'height': !kaiguan?'calc(100vh - 293px)':'calc(100vh - 343px)','overflow-y':'auto'}">
                            <el-table
                                style="width: 100%;"
                                ref="multipleTable"
                                :row-class-name="tableRowClassName"
                                v-loading="loading"
                                :row-style="{ height: '32px' }"
                                :header-row-style="{ height: '32px' }"
                                class='bigTable fixedTable'
                                :data="tableData"
                                border
                                stripe
                                tooltip-effect="dark"
                                @selection-change="handleSelectionChange">
                                <el-table-column align="center" type="selection" width="30"></el-table-column>
                                <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                                </el-table-column>
                                <template v-for="(it,ix) in checkList">
                                    <el-table-column v-if="it === '资产名称'" :key="ix" show-overflow-tooltip prop="device_name" label="资产名称" width="120">
                                    </el-table-column>
                                    <el-table-column v-if="it === '资产标识'" :key="ix" show-overflow-tooltip prop="uniqueCode" label="资产标识" width="120">
                                    </el-table-column>
                                    <el-table-column v-if="it === '资产类型'" :key="ix" show-overflow-tooltip prop="device_type_name" label="资产类型" width="120">
                                    </el-table-column>
                                    <el-table-column v-if="it === '资产标签'" :key="ix" show-overflow-tooltip prop="labelName" label="资产标签">
                                    </el-table-column>
                                    <el-table-column v-if="it === '厂商'" :key="ix" show-overflow-tooltip prop="manufacturer_name" label="厂商">
                                        <template slot-scope="{row}">
                                            <span v-if="row.manufacturer_name">{{row.manufacturer_name}}</span>
                                            <!-- <span v-else>--</span> -->
                                        </template>
                                    </el-table-column>
                                    <el-table-column v-if="it === '型号'" :key="ix" show-overflow-tooltip prop="modelInfo" label="型号">
                                        <template slot-scope="{row}">
                                            <span v-if="row.modelInfo">{{row.modelInfo}}</span>
                                            <!-- <span v-else>--</span> -->
                                        </template>
                                    </el-table-column>
                                    <el-table-column v-if="it === '操作系统'" :key="ix" show-overflow-tooltip prop="pc_system" label="系统">
                                    </el-table-column>
                                    <el-table-column v-if="it === '是否边界'" :key="ix" show-overflow-tooltip prop="isBoundaryCN" label="是否边界">
                                        <template slot-scope="{row}">
                                            <span v-if="row.isBoundaryCN == '是'" style="color: #0052d9;">是</span>
                                            <span v-else style="color: rgb(0 0 0 / 40%);">否</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column v-if="it === '是否国产'" :key="ix" prop="is_domestic" label="是否国产" align="center">
                                        <template slot-scope="{row}">
                                            <span v-if="row.is_domestic == 1" style="color: #0052d9;">是</span>
                                            <span v-else style="color: rgb(0 0 0 / 40%);">否</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column v-if="it === '业务系统'" :key="ix" show-overflow-tooltip prop="system_name" label="业务系统" width="120">
                                        <template slot-scope="{row}">
                                            {{  row.system_name.length>0 ? row.system_name.join(',') : ''}}
                                        </template>
                                    </el-table-column>
                                    <el-table-column v-if="it === '所属安全域'" :key="ix" show-overflow-tooltip prop="zoneName" label="所属安全域" width="120">
                                        <template slot-scope="{row}">
                                            <span v-if="row.zoneName">{{row.zoneName}}</span>
                                            <!-- <span v-else>--</span> -->
                                        </template>
                                    </el-table-column>
                                    <el-table-column v-if="it === 'IP'" label="IP" :key="ix" width="120">
                                        <template slot-scope="scope" v-if="scope.row.ips.length">
                                            <el-tag type="success" size="mini" style="border: 1px solid rgb(56 125 238 / 40%);" v-for="(item,index) in scope.row.ips" :key="index">{{item.assetsIp}}</el-tag>
                                        </template>
                                    </el-table-column>
                                    <el-table-column v-if="it === '端口'" :key="ix" label="端口" show-overflow-tooltip>
                                        <template slot-scope="scope">
                                            <span style="color: #0052d9;" v-if="scope.row.ports.length">{{scope.row.ports.join(',')==','?'':scope.row.ports.join(',')}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column v-if="it === '创建时间'" :key="ix" prop="create_time" label="创建时间" width="120" show-overflow-tooltip>
                                    </el-table-column>
                                    <el-table-column v-if="it === '资产联系人'" :key="ix" label="资产联系人" width="90" show-overflow-tooltip>
                                        <template slot-scope="scope">
                                            <!--eslint-disable-->
                                        <el-tag  v-if="item.chineseName" type="success" size="mini" v-for="(item,index) in scope.row.systemUsers" :key="index">{{item.chineseName}}</el-tag>
                                        <!--eslint-disable-->
                                    </template>
                                </el-table-column>
                            </template>

                            <el-table-column align="center" label="24小时事件" fixed="right" width="80" class-name="deepBg">
                                <template slot-scope="scope">
                                    <span class="num-btn" style="text-decoration: underline;color: #0052d9;cursor: pointer;" @click="goSee(scope.row,'two')">{{scope.row.sjNum}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="24小时告警" fixed="right" width="80" class-name="deepBg">
                                <template slot-scope="scope">
                                    <span class="num-btn" style="text-decoration: underline;color: #0052d9;cursor: pointer;" @click="goSee(scope.row,'three')">{{scope.row.gjNum}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="24小时日志" fixed="right" width="80" class-name="deepBg">
                                <template slot-scope="scope">
                                    <span class="num-btn" style="text-decoration: underline;color: #0052d9;cursor: pointer;" @click="goSee(scope.row,'four')">{{scope.row.rzNum}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="漏洞数" fixed="right" width="80" class-name="deepBg">
                                <template slot-scope="scope">
                                    <span class="num-btn" style="text-decoration: underline;color: #0052d9;cursor: pointer;" @click="goSee(scope.row,'five')">{{scope.row.ldNum}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="操作" fixed="right" width="120" class-name="deepBg">
                                <template slot-scope="scope">
                                     <el-button size="small" type="text" @click="goSee(scope.row,'first')">查看</el-button>
                                    <el-button size="small" type="text" @click="handleEdit(scope.row)" v-per="['assets_assets_edit']">编辑</el-button>
                                    <el-button size="small" type="text" @click="delUserBtn(scope.row)" v-per="['assets_assets_del']">删除</el-button>
                                </template>
                            </el-table-column>
                            </el-table>
                        </div>
                        <pagination :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size" @pagination="get_data()" style="padding-top: 10px;" v-show="total_num>0" />
                    </div>
                    <div class="chart-wrap" v-show="viewTab === 'chartView'">
                        <ChartContent
                            :type="6"
                            :isOpen="kaiguan"
                            v-loading.lock="loading"
                            element-loading-background="rgba(0, 0, 0, 0.05)"
                            element-loading-text="拼命加载中......"
                            ref="chartContent"
                            :sortFieldObj="sortFieldObj"
                            v-show="viewTab === 'chartView'">
                        </ChartContent>
                    </div>
                </div>
            </div>
        </div>
        <!--增加内容开始-->
        <el-drawer :visible.sync="addDomainDialog" direction="rtl" :size="900" title="添加资产"  :before-close="handleClose" custom-class="drawer-dialog" :wrapperClosable="false">
            <div class="content w100" style="margin-top: -5px;">                
                <el-form :model="deviceForm" :rules="rules" ref="deviceForm" :inline="true" class="unit pb-3" label-position="top">
                    <div class="ub ub-pj">
                        <el-form-item label="资产名称：" prop="deviceName" :label-width="formLabelWidth">
                            <el-input @focus="onFocus" size="small" v-model="deviceForm.deviceName" placeholder="请输入资产名称" autocomplete="off" style="width: 400px;"></el-input>
                        </el-form-item>
                        <el-form-item label="资产标识：" prop="uniqueCode" :label-width="formLabelWidth">
                            <el-input @focus="onFocus" size="small" v-model="deviceForm.uniqueCode" placeholder="请输入资产标识" autocomplete="off" style="width: 400px;"></el-input>
                        </el-form-item>
                    </div>
                    <div class="ub ub-pj">
                        <el-form-item label="业务系统：" :label-width="formLabelWidth">
                            <el-select v-model="deviceForm.systemId" size="small" placeholder="请选择业务系统" style="width: 400px;" filterable multiple collapse-tags>
                                <el-option v-for="(item,index) in systems" :key="index" :label="item.systemName" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="所属安全域：" :label-width="formLabelWidth">
                            <el-select @focus="onFocus" size="small" v-model="deviceForm.zoneId" clearable placeholder="请选择" style="width: 400px;" filterable>
                                <el-option v-for="(item,index) in zoneIds" :key="index" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="ub ub-pj">
                        <el-form-item label="资产类型：" prop="deviceTypeId" :label-width="formLabelWidth">
                            <el-select @focus="onFocus" ref="add-select" size="small" v-model="deviceForm.deviceTypeId" clearable placeholder="请选择" popper-class="tree_dropdown" style="width: 400px;">
                                <el-option :label="innerLabel_add" :value="innerValue_add" style="overflow: scroll;height: 200px;">
                                    <el-tree ref="tree_add" node-key="id" :default-expand-all="true" :highlight-current="true" :data="treeData" :props='propsDataSelect' @node-click="handleNodeClick_add" :check-strictly="true" :expand-on-click-node="false" :indent='indent'>
                                        <span class="custom-tree-node" slot-scope="{ node }">
                                            <span style="font-size: 12px;">{{ node.label }}</span>
                                        </span>
                                    </el-tree>
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <div style="position: relative;">
                            <el-form-item label="厂商：" :label-width="formLabelWidth">
                                <el-select @focus="onFocus" size="small" v-model="deviceForm.manufacturerId" clearable placeholder="请选择" style="width: 400px;" filterable>
                                    <el-option v-for="item in storeOp" :key="item.id" :label="item.name" :value="item.id">
                                    </el-option>
                                </el-select>
                            <el-button icon="el-icon-plus" style="position: absolute;top: -30px;right: 0;" @click="addVendorDialog = true" size="mini" type="text">添加厂商</el-button>
                        </el-form-item>
                        </div>
                    </div>
                    <div class="ub ub-pj">
                        <el-form-item label="型号：" :label-width="formLabelWidth">
                            <el-input @focus="onFocus" size="small" v-model="deviceForm.modelInfo" placeholder="请输入型号" autocomplete="off" style="width: 400px;"></el-input>
                        </el-form-item>
                        <el-form-item label="操作系统：" :label-width="formLabelWidth">
                            <el-input @focus="onFocus" size="small" v-model="deviceForm.pcSystem" placeholder="请输入操作系统"      autocomplete="off" style="width: 400px;"></el-input>
                        </el-form-item>
                    </div>
                    <div class="ub ub-pj">
                        <el-form-item label="系统版本：" :label-width="formLabelWidth">
                            <el-input @focus="onFocus" size="small" v-model="deviceForm.pcSystemVersion" placeholder="请输入系统版本" autocomplete="off" style="width: 400px;"></el-input>
                        </el-form-item>
                        <el-form-item label="资产标签：" :label-width="formLabelWidth">
                            <el-select v-model="deviceForm.labelName" size="small" placeholder="请选择资产标签" style="width: 400px;" filterable>
                                <el-option v-for="(item,index) in assetLabelList" :label="item.name" :value="item.id" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="ub ub-pj">
                        <el-form-item label="是否国产：" :label-width="formLabelWidth">
                            <el-select v-model="deviceForm.isDomestic" size="small" placeholder="请选择" style="width: 400px;" filterable>
                                <el-option label="是" value="1"></el-option>
                                <el-option label="否" value="0"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="是否边界：" :label-width="formLabelWidth">
                            <el-select v-model="deviceForm.isBoundary" size="small" placeholder="请选择" style="width: 400px;" filterable>
                                <el-option label="是" value="1"></el-option>
                                <el-option label="否" value="0"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="ub ub-pj">
                        <el-form-item label="是否安装杀毒：" :label-width="formLabelWidth">
                            <el-select v-model="deviceForm.isInstall" size="small" placeholder="请选择" style="width: 400px;" filterable>
                                <el-option label="是" :value="1"></el-option>
                                <el-option label="否" :value="0"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="杀毒软件版本：" :label-width="formLabelWidth">
                            <el-input @focus="onFocus" size="small" v-model="deviceForm.virusVersion" placeholder="请输入杀毒软件版本" autocomplete="off" style="width: 400px;"></el-input>
                        </el-form-item>
                    </div>
                    <div class="ub ub-pj">
                        <el-form-item label="分组：" :label-width="formLabelWidth">
                            <treeselect
                                size="small"
                                class="treeselect"
                                style="margin-top: 3px;width: 400px;"
                                :options="groupList"
                                :normalizer="normalizer"
                                noChildrenText="当前分支无子节点"
                                noOptionsText="无可用选项"
                                noResultsText="无可用选项"
                                placeholder="请选择"
                                v-model="deviceForm.groupId"
                                loadingText="下拉框无匹配项"
                                :clearable="false"
                            />
                        </el-form-item>
                        <el-form-item label="资产完整性：" :label-width="formLabelWidth" prop="fullStatus">
                            <el-select v-model="deviceForm.fullStatus" size="small" placeholder="请选择" style="width: 400px;" filterable>
                                <el-option label="1" value="1"></el-option>
                                <el-option label="2" value="2"></el-option>
                                <el-option label="3" value="3"></el-option>
                                <el-option label="4" value="4"></el-option>
                                <el-option label="5" value="5"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="ub ub-pj">
                        <el-form-item label="资产可用性：" :label-width="formLabelWidth" prop="usableStatus">
                            <el-select v-model="deviceForm.usableStatus" size="small" placeholder="请选择" style="width: 400px;" filterable>
                                <el-option label="1" value="1"></el-option>
                                <el-option label="2" value="2"></el-option>
                                <el-option label="3" value="3"></el-option>
                                <el-option label="4" value="4"></el-option>
                                <el-option label="5" value="5"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="资产机密性：" :label-width="formLabelWidth" prop="secretStatus">
                            <el-select v-model="deviceForm.secretStatus" size="small" placeholder="请选择" style="width: 400px;" filterable>
                                <el-option label="1" value="1"></el-option>
                                <el-option label="2" value="2"></el-option>
                                <el-option label="3" value="3"></el-option>
                                <el-option label="4" value="4"></el-option>
                                <el-option label="5" value="5"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="ub ub-pj w100">
                        <span style="font-size: 12px;color: rgb(0 0 0 / 90%);" class="star">添加ipv4：</span>
                        <el-button size="mini" icon="el-icon-plus" type="text" @click="addIpv4('add', 4)">添加</el-button>
                    </div>
                    <div class="w100">
                        <el-table :data="deviceForm.ipsv4" class='bigTable fixedTable' border stripe tooltip-effect="dark" style="width: 100%;">
                        <el-table-column label="IP">
                            <template slot="header">
                                <div>IP <i style="color: #f56c6c;">*</i></div>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item :prop="'ipsv4.'+scope.$index+'.ip'" class="mb0" :rules="rules.ip">
                                    <el-input size="mini" v-model="scope.row.ip" placeholder="请输入IP"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="端口" width="140">
                            <template slot="header">
                                <el-tooltip class="item" effect="dark" content="可批量输入，用','分隔" placement="top">
                                    <div>端口 <i class="el-icon-question" style="color: rgb(0 0 0 / 40%);"></i></div>
                                </el-tooltip>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item :prop="'ipsv4.'+scope.$index+'.port'" class="mb0">
                                    <el-input size="mini" v-model="scope.row.port" placeholder="请输入端口"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="MAC" width="140">
                            <template slot-scope="scope">
                                <el-form-item :prop="'ipsv4.'+scope.$index+'.mac'" class="mb0">
                                    <el-input size="mini" v-model="scope.row.mac" placeholder="请输入MAC"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="子网掩码" width="200">
                            <template slot-scope="scope">
                                <el-form-item :prop="'ipsv4.'+scope.$index+'.mask'" class="mb0">
                                    <el-input size="mini" v-model="scope.row.mask" placeholder="请输入子网掩码"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="网关" width="140">
                            <template slot-scope="scope">
                                <el-form-item :prop="'ipsv4.'+scope.$index+'.gateway'" class="mb0">
                                    <el-input size="mini" v-model="scope.row.gateway" placeholder="请输入网关"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="50" align="center">
                            <template slot-scope="scope">
                                <el-button size="mini" icon="el-icon-remove-outline" class="del-btn" type="text" @click="deleteIp('add',scope.$index,4)" style="font-size: 14px;color: #f56c6c;"></el-button>
                            </template>
                        </el-table-column>
                        </el-table>
                    </div>
                    <div class="ub ub-pj w100 mt-1">
                        <span style="font-size: 12px;color: rgb(0 0 0 / 90%);" class="star">添加ipv6：</span>
                        <el-button size="mini" icon="el-icon-plus" type="text" @click="addIpv4('add', 6)">添加</el-button>
                    </div>
                    <div class="w100">
                    <el-table :data="deviceForm.ipsv6" class='bigTable fixedTable' border stripe tooltip-effect="dark" style="width: 100%;">
                        <!-- <el-table-column type="index" width="50" label="序号" align="center"></el-table-column> -->
                        <el-table-column label="IP" width="292">
                            <template slot="header">
                                <div>IP <i style="color: #f56c6c;">*</i></div>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item :prop="'ipsv6.'+scope.$index+'.ip'" class="mb0 w100" :rules="rules.ipv6">
                                    <el-input size="mini" v-model="scope.row.ip" placeholder="请输入IP" style="width: 270px;"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="端口" width="140">
                            <template slot="header">
                                <el-tooltip class="item" effect="dark" content="可批量输入，用','分隔" placement="top">
                                    <div>端口 <i class="el-icon-question" style="color: rgb(0 0 0 / 40%);"></i></div>
                                </el-tooltip>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item :prop="'ipsv6.'+scope.$index+'.port'" class="mb0">
                                    <el-input size="mini" v-model="scope.row.port" placeholder="请输入端口"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="MAC" width="140">
                            <template slot-scope="scope">
                                <el-form-item :prop="'ipsv6.'+scope.$index+'.mac'" class="mb0">
                                    <el-input size="mini" v-model="scope.row.mac" placeholder="请输入MAC"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="子网掩码" width="140">
                            <template slot-scope="scope">
                                <el-form-item :prop="'ipsv6.'+scope.$index+'.mask'" class="mb0">
                                    <el-input size="mini" v-model="scope.row.mask" placeholder="请输入子网掩码"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="网关" width="140">
                            <template slot-scope="scope">
                                <el-form-item :prop="'ipsv6.'+scope.$index+'.gateway'" class="mb0">
                                    <el-input size="mini" v-model="scope.row.gateway" placeholder="请输入网关"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="50" align="center">
                            <template slot-scope="scope">
                                <el-button size="mini" icon="el-icon-remove-outline" class="del-btn" type="text" @click="deleteIp('add',scope.$index,6)" style="font-size: 14px;color: #f56c6c;"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    </div>
                    <div class="w100" v-if="existIp!=''" style="line-height: 20px;vertical-align: top;word-wrap: break-word;word-break: break-all;white-space: normal;color: red;">
                    {{existIp}} 已存在
                    </div>
                    <div class="ub ub-pj w100 mt-1">
                        <span style="font-size: 12px;color: rgb(0 0 0 / 90%);"  class="star">添加组件：</span>
                        <el-button size="mini" type="text" icon="el-icon-plus" @click="addApplication('add')">添加</el-button>
                    </div>
                    <div class="w100">
                    <el-table :data="deviceForm.applications" class='bigTable fixedTable' border stripe tooltip-effect="dark" style="width: 100%;">
                        <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
                        <el-table-column prop="name" label="组件名称">
                            <template slot-scope="scope">
                                <el-form-item :prop="'applications.'+scope.$index+'.name'" class="mb0">
                                    <el-input size="mini" v-model="scope.row.name" placeholder="请输入组件名称"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="softwareVersion" label="版本">
                            <template slot-scope="scope">
                                <el-form-item :prop="'applications.'+scope.$index+'.softwareVersion'" class="mb0">
                                    <el-input size="mini" v-model="scope.row.softwareVersion" placeholder="请输入版本"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="innerPort" label="内网端口号">
                            <template slot-scope="scope">
                                <el-form-item :prop="'applications.'+scope.$index+'.innerPort'" class="mb0">
                                    <el-input size="mini" v-model="scope.row.innerPort" placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="outerPort" label="外网端口号">
                            <template slot-scope="scope">
                                <el-form-item :prop="'applications.'+scope.$index+'.outerPort'" class="mb0">
                                    <el-input size="mini" v-model="scope.row.outerPort" placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="address" label="操作" width="50" align="center">
                            <template slot-scope="scope">
                                <el-button size="mini" icon="el-icon-remove-outline" class="del-btn" type="text" @click="deleteApplication('add',scope.$index)" style="font-size: 14px;color: #f56c6c;"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    </div>
                    <div class="ub ub-pj w100 mt-1">
                    <span style="font-size: 12px;color: rgb(0 0 0 / 90%);" class="star">联系人：</span>
                    <el-button size="mini" icon="el-icon-plus" type="text" @click="addUsers('add')">添加</el-button>
                    </div>
                    <div class="w100">
                    <el-table :data="deviceForm.users" class='bigTable' border stripe tooltip-effect="dark" style="width: 100%;">
                        <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
                        <el-table-column prop="userId" label="联系人" width="142">
                            <template slot-scope="scope">
                                <el-select size="mini" style="width: 120px;" v-model="scope.row.userId" filterable placeholder="请选择" @change="changeUser(scope.row)">
                                    <el-option v-for="item in users" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column prop="code" label="员工编号" width="80">
                        </el-table-column>
                        <el-table-column prop="departmentName" label="组织架构" width="100">
                        </el-table-column>
                        <el-table-column prop="phone" label="电话" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="landline" label="座机" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="mailBox" label="邮箱" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="address" label="操作" width="50" align="center">
                            <template slot-scope="scope">
                                <el-button size="mini" icon="el-icon-remove-outline" class="del-btn" type="text" @click="deleteUsers('add',scope.$index)" style="font-size: 14px;color: #f56c6c;"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    </div>
                    <!--非系统属性-->
                    <div class="extend-box" v-if="deviceForm.extendAttr&&deviceForm.extendAttr.length">
                    <div class="w100" v-for="(item, index) in deviceForm.extendAttr" :key="index">
                        <el-form-item v-if="item.type == 1" :key="'a1' + index" :label="item.name+ '：'" label-width="120px" style="width: 100%;">
                            <el-input size="small" v-model="item.val" placeholder="请输入字符串" autocomplete="off" clearable style="width: 848px;"></el-input>
                        </el-form-item>
                        <el-form-item v-if="item.type == 2" :key="'a2' + index" :label="item.name+ '：'" label-width="120px" style="width: 100%;">
                            <el-input size="small" type="number"  v-model="item.val" oninput ="value=value.replace(/[^0-9.]/g,'')"  @blur="item.val = $event.target.value"  clearable placeholder="请输入数字" autocomplete="off" style="width: 848px;"></el-input>
                        </el-form-item>
                        <el-form-item v-if="item.type == 3" :key="'a3' + index" :label="item.name+ '：'" label-width="120px">
                            <el-date-picker
                                v-model="item.val"
                                align="right"
                                type="date"
                                size="small"
                                placeholder="选择日期"
                                :picker-options="pickerOptions">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item v-if="item.type == 4" :key="'a4' + index" :label="item.name+ '：'" label-width="120px">
                            <el-date-picker
                                v-model="item.val"
                                type="datetime"
                                size="small"
                                placeholder="选择日期时间"
                                align="right"
                                :picker-options="pickerOptions">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item v-if="item.type == 5" :key="'a5' + index" :label="item.name+ '：'" :prop="'extendAttr.' + index + '.val'" label-width="120px" style="width: 100%;" :rules="rules.extendIp">
                            <el-input size="small" v-model="item.val" placeholder="请输入ip" autocomplete="off" clearable style="width: 848px;"></el-input>
                        </el-form-item>
                        <el-form-item v-if="item.type == 6" :key="'a6' + index" :label="item.name+ '：'" label-width="120px" style="width: 100%;">
                            <el-input :show-password="true" size="small" v-model="item.val" placeholder="请输入密码" autocomplete="off" clearable style="width: 848px;"></el-input>
                        </el-form-item>
                        <div class="rich-text" v-if="item.type == 7">
                            <el-form-item :label="item.name+ '：'" label-width="120px" style="margin-bottom: 0 !important;width: 100%;">
                            </el-form-item>
                            <div>
                                <vue-ueditor-wrap :config="myConfig" v-model="item.val"></vue-ueditor-wrap>
                            </div>
                        </div>
                        <el-form-item v-if="item.type == 8" :key="'ss8' + index" :label="item.name+ '：'" label-width="120px" style="width: 100%;">
                            <el-select size="small" v-model="item.val" clearable placeholder="请选择" style="width: 848px;">
                                <el-option v-for="(_it,_inx) in typeof item.items === 'string' ? item.items.split('#') : []" :key="_inx" :label="_it" :value="_it"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item v-if="item.type == 9" :key="'ss9' + index" :label="item.name+ '：'" label-width="120px" style="width: 100%;">
                            <el-select size="small" v-model="item.val" multiple clearable placeholder="请选择" style="width: 848px;">
                                <el-option v-for="(_it,_inx) in typeof item.items === 'string' ? item.items.split('#') : []" :key="_inx" :label="_it" :value="_it"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item v-if="item.type == 10" :key="'ss10' + index" :label="item.name+ '：'" label-width="120px" style="width: 100%;">
                            <el-cascader
                                clearable
                                size="small"
                                v-model="item.val"
                                :props="cityProps"
                                :options="cityOptions"
                            ></el-cascader>
                        </el-form-item>
                    </div>
                    </div>
                    <!--系统属性-->
                    <div class="extend-box system-box" v-if="deviceForm.systemAttr&&deviceForm.systemAttr.length">
                    <div class="w100" v-for="(item, index) in deviceForm.systemAttr" :key="index">
                        <el-form-item v-if="item.type == 1" :key="'s1' + index" :label="item.name+ '：'" label-width="120px">
                            <el-input size="small" v-model="item.val" placeholder="请输入字符串" autocomplete="off" clearable style="width: 848px;"></el-input>
                        </el-form-item>
                        <el-form-item v-if="item.type == 2" :key="'s2' + index" :label="item.name+ '：'" label-width="120px">
                            <el-input size="small" type="number"  v-model="item.val" oninput ="value=value.replace(/[^0-9.]/g,'')"  @blur="item.val = $event.target.value" clearable placeholder="请输入数字" autocomplete="off" style="width: 848px;"></el-input>
                        </el-form-item>
                        <el-form-item v-if="item.type == 3" :key="'s3' + index" :label="item.name+ '：'" label-width="120px">
                            <el-date-picker
                                v-model="item.val"
                                align="right"
                                type="date"
                                size="small"
                                placeholder="选择日期"
                                :picker-options="pickerOptions">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item v-if="item.type == 4" :key="'s4' + index" :label="item.name+ '：'" label-width="120px">
                            <el-date-picker
                                v-model="item.val"
                                type="datetime"
                                size="small"
                                placeholder="选择日期时间"
                                align="right"
                                :picker-options="pickerOptions">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item v-if="item.type == 5" :key="'s5' + index" :label="item.name+ '：'" :prop="'systemAttr.' + index + '.val'" label-width="120px" style="width: 100%;" :rules="rules.extendIp">
                            <el-input size="small" v-model="item.val" placeholder="请输入ip" autocomplete="off" clearable style="width: 848px;"></el-input>
                        </el-form-item>
                        <el-form-item v-if="item.type == 6" :key="'s6' + index" :label="item.name+ '：'" label-width="120px" style="width: 100%;">
                            <el-input :show-password="true" size="small" v-model="item.val" placeholder="请输入密码" autocomplete="off" clearable style="width: 848px;"></el-input>
                        </el-form-item>
                        <div class="rich-text" v-if="item.type == 7">
                            <el-form-item :label="item.name+ '：'" label-width="120px" style="margin-bottom: 0 !important;width: 100%;">
                            </el-form-item>
                            <div >
                                <vue-ueditor-wrap :config="myConfig" v-model="item.val"></vue-ueditor-wrap>
                            </div>
                        </div>
                        <el-form-item v-if="item.type == 8" :key="'ssss8' + index" :label="item.name+ '：'" label-width="120px" style="width: 100%;">
                            <el-select size="small" v-model="item.val" clearable placeholder="请选择" style="width: 848px;">
                                <el-option v-for="(_it,_inx) in typeof item.items === 'string' ? item.items.split('#') : []" :key="_inx" :label="_it" :value="_it"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item v-if="item.type == 9" :key="'ssss9' + index" :label="item.name+ '：'" label-width="120px" style="width: 100%;">
                            <el-select size="small" v-model="item.val" multiple clearable placeholder="请选择" style="width: 848px;">
                                <el-option v-for="(_it,_inx) in typeof item.items === 'string' ? item.items.split('#') : []" :key="_inx" :label="_it" :value="_it"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item v-if="item.type == 10" :key="'ssss10' + index" :label="item.name+ '：'" label-width="120px" style="width: 100%;">
                            <el-cascader
                                clearable
                                size="small"
                                v-model="item.val"
                                :props="cityProps"
                                :options="cityOptions"
                            ></el-cascader>
                        </el-form-item>
                    </div>
                    </div>
                </el-form>
                <div slot="footer" class="dialog-footer" style="position: fixed;right: 0;bottom: 0;z-index: 9999;padding-bottom: 10px;width: 900px;text-align: right;background: transparent;">
                    <el-button @click="handleClose" size="small">取消</el-button>
                    <el-button @click="submitForm('deviceForm')" size="small" type="primary" style="margin-right: 30px;">确定</el-button>
                </div>
            </div>
        </el-drawer>
        <!--编辑内容-->
        <el-drawer :visible.sync="editUserDialog" direction="rtl" :size="900" title="编辑资产"  :before-close="handleClose" custom-class="drawer-dialog" :wrapperClosable="false">

            <div class='content' style="margin-top: -5px;" v-if="editUserDialog">
                <el-form :model="assetsFormEdit" :rules="rules" ref="assetsFormEdit" :inline="true" class="unit  pb-3" label-position="top">
                    <div class="ub ub-pj">
                        <el-form-item label="资产名称：" prop="deviceName" :label-width="formLabelWidth">
                            <el-input @focus="onFocus" size="small" v-model="assetsFormEdit.deviceName" placeholder="请输入资产名称" autocomplete="off" style="width: 400px;"></el-input>
                        </el-form-item>
                        <el-form-item label="资产标识：" prop="uniqueCode" :label-width="formLabelWidth">
                            <el-input @focus="onFocus" size="small" v-model="assetsFormEdit.uniqueCode" placeholder="请输入资产标识" autocomplete="off" style="width: 400px;"></el-input>
                        </el-form-item>
                    </div>
                    <div class="ub ub-pj">
                        <el-form-item label="业务系统：" :label-width="formLabelWidth">
                            <el-select v-model="assetsFormEdit.systemId" size="small" placeholder="请选择业务系统" style="width: 400px;" filterable multiple collapse-tags>
                                <el-option v-for="(item,index) in systems" :key="index" :label="item.systemName" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="所属安全域：" :label-width="formLabelWidth">
                            <el-select @focus="onFocus" size="small" v-model="assetsFormEdit.zoneId" clearable placeholder="请选择" style="width: 400px;" filterable>
                                <el-option v-for="(item,index) in zoneIds" :key="index" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="ub ub-pj">
                        <el-form-item label="资产类型：" prop="deviceTypeId" :label-width="formLabelWidth">
                            <el-select @focus="onFocus" size="small" ref="edit-select" v-model="assetsFormEdit.deviceTypeId" clearable placeholder="请选择" popper-class="tree_dropdown" style="width: 400px;">
                                <el-option :label="innerLabel_edit" :value="innerValue_edit" style="overflow: scroll;height: 200px;">
                                    <el-tree ref="tree_addUser" node-key="id" :default-expand-all="true" :highlight-current="true" :data="treeData" :props='propsDataSelect' @node-click="handleNodeClick_edit" :check-strictly="true" :expand-on-click-node="false" :indent='indent'>
                                        <span class="custom-tree-node" slot-scope="{ node }">
                                            <span style="font-size: 12px;">{{ node.label }}</span>
                                        </span>
                                    </el-tree>
                                </el-option>
                            </el-select>
                            </el-form-item>
                            <el-form-item label="厂商：" :label-width="formLabelWidth">
                                <el-select @focus="onFocus" size="small" v-model="assetsFormEdit.manufacturerId" clearable placeholder="请选择" style="width: 400px;" filterable>
                                    <el-option v-for="item in storeOp" :key="item.id" :label="item.name" :value="item.id">
                                    </el-option>
                                </el-select>
                        </el-form-item>
                    </div>
                    <div class="ub ub-pj">
                        <el-form-item label="型号：" :label-width="formLabelWidth">
                            <el-input @focus="onFocus" size="small" v-model="assetsFormEdit.modelInfo" placeholder="请输入型号"         autocomplete="off" style="width: 400px;"></el-input>
                        </el-form-item>
                        <el-form-item label="操作系统：" :label-width="formLabelWidth">
                            <el-input @focus="onFocus" size="small" v-model="assetsFormEdit.pcSystem" placeholder="请输入操作系统"      autocomplete="off" style="width: 400px;"></el-input>
                        </el-form-item>
                    </div>
                    <div class="ub ub-pj">
                        <el-form-item label="系统版本：" :label-width="formLabelWidth">
                            <el-input @focus="onFocus" size="small" v-model="assetsFormEdit.pcSystemVersion" placeholder="请输入系统版本" autocomplete="off" style="width: 400px;"></el-input>
                        </el-form-item>
                        <el-form-item label="资产标签：" :label-width="formLabelWidth">
                            <el-select v-model="assetsFormEdit.labelId" size="small" placeholder="请选择资产标签" style="width: 400px;" filterable>
                                <el-option v-for="(item,index) in assetLabelList" :label="item.name" :value="item.id" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="ub ub-pj">
                        <el-form-item label="是否国产：" :label-width="formLabelWidth">
                            <el-select v-model="assetsFormEdit.isDomestic" size="small" placeholder="请选择" style="width: 400px;" filterable>
                                <el-option label="是" value="1"></el-option>
                                <el-option label="否" value="0"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="是否边界：" :label-width="formLabelWidth">
                            <el-select v-model="assetsFormEdit.isBoundary" size="small" placeholder="请选择" style="width: 400px;" filterable>
                                <el-option label="是" value="1"></el-option>
                                <el-option label="否" value="0"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="ub ub-pj">
                        <el-form-item label="是否安装杀毒：" :label-width="formLabelWidth">
                            <el-select v-model="assetsFormEdit.isInstall" size="small" placeholder="请选择" style="width: 400px;" filterable>
                                <el-option label="是" :value="1"></el-option>
                                <el-option label="否" :value="0"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="杀毒软件版本：" :label-width="formLabelWidth">
                            <el-input @focus="onFocus" size="small" v-model="assetsFormEdit.virusVersion" placeholder="请输入杀毒软件版本：" autocomplete="off" style="width: 400px;"></el-input>
                        </el-form-item>
                    </div>
                    <div class="ub ub-pj">
                        <el-form-item label="分组：" :label-width="formLabelWidth">
                            <treeselect
                                size="small"
                                class="treeselect"
                                style="margin-top: 3px;width: 400px;"
                                :options="groupList"
                                :normalizer="normalizer"
                                noChildrenText="当前分支无子节点"
                                noOptionsText="无可用选项"
                                noResultsText="无可用选项"
                                placeholder="请选择"
                                v-model="assetsFormEdit.groupId"
                                loadingText="下拉框无匹配项"
                                :clearable="false"
                            />
                        </el-form-item>
                        <el-form-item label="资产完整性：" :label-width="formLabelWidth" prop="fullStatus">
                            <el-select v-model="assetsFormEdit.fullStatus" size="small" placeholder="请选择" style="width: 400px;" filterable>
                                <el-option label="1" value="1"></el-option>
                                <el-option label="2" value="2"></el-option>
                                <el-option label="3" value="3"></el-option>
                                <el-option label="4" value="4"></el-option>
                                <el-option label="5" value="5"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="ub ub-pj">
                        <el-form-item label="资产可用性：" :label-width="formLabelWidth" prop="usableStatus">
                            <el-select v-model="assetsFormEdit.usableStatus" size="small" placeholder="请选择" style="width: 400px;" filterable>
                                <el-option label="1" value="1"></el-option>
                                <el-option label="2" value="2"></el-option>
                                <el-option label="3" value="3"></el-option>
                                <el-option label="4" value="4"></el-option>
                                <el-option label="5" value="5"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="资产机密性：" :label-width="formLabelWidth" prop="secretStatus">
                            <el-select v-model="assetsFormEdit.secretStatus" size="small" placeholder="请选择" style="width: 400px;" filterable>
                                <el-option label="1" value="1"></el-option>
                                <el-option label="2" value="2"></el-option>
                                <el-option label="3" value="3"></el-option>
                                <el-option label="4" value="4"></el-option>
                                <el-option label="5" value="5"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="ub ub-pj w100 mt-1">
                        <span style="font-size: 12px;color: rgb(0 0 0 / 90%);">添加ipv4：</span>
                        <el-button size="mini" icon="el-icon-plus" type="text" @click="addIpv4('edit', 4)">添加</el-button>
                    </div>
                    <div class="w100">
                        <el-table :data="assetsFormEdit.ipsv4" class='bigTable fixedTable' border stripe tooltip-effect="dark" style="width: 100%;">
                            <!-- <el-table-column type="index" width="50" label="序号" align="center"></el-table-column> -->
                            <el-table-column label="IP">
                                <template slot="header">
                                    <div>IP <i style="color: #f56c6c;">*</i></div>
                                </template>
                                <template slot-scope="scope">
                                    <el-form-item :prop="'ipsv4.'+scope.$index+'.assetsIp'" class="mb0" :rules="rules.ip">
                                        <el-input size="mini" v-model="scope.row.assetsIp" placeholder="请输入IP"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column label="端口" width="160">
                                <template slot="header">
                                    <el-tooltip class="item" effect="dark" content="可批量输入，用','分隔" placement="top">
                                        <div>端口 <i class="el-icon-question" style="color: rgb(0 0 0 / 40%);"></i></div>
                                    </el-tooltip>
                                </template>
                                <template slot-scope="scope">
                                    <el-form-item :prop="'ipsv4.'+scope.$index+'.port'" class="mb0">
                                        <el-input size="mini" v-model="scope.row.port" placeholder="请输入端口"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column label="MAC" width="140">
                                <template slot-scope="scope">
                                    <el-form-item :prop="'ipsv4.'+scope.$index+'.mac'" class="mb0">
                                        <el-input size="mini" v-model="scope.row.mac" placeholder="请输入MAC"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column label="子网掩码" width="200">
                                <template slot-scope="scope">
                                    <el-form-item :prop="'ipsv4.'+scope.$index+'.mask'" class="mb0">
                                        <el-input size="mini" v-model="scope.row.mask" placeholder="请输入子网掩码"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column label="网关" width="140">
                                <template slot-scope="scope">
                                    <el-form-item :prop="'ipsv4.'+scope.$index+'.gateway'" class="mb0">
                                        <el-input size="mini" v-model="scope.row.gateway" placeholder="请输入网关"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" width="50" align="center">
                                <template slot-scope="scope">
                                    <el-button size="mini" icon="el-icon-remove-outline" class="del-btn" type="text" @click="deleteIp('edit',   scope.$index,4)" style="font-size: 14px;color: #f56c6c;"></el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="ub ub-pj w100 mt-1">
                        <span style="font-size: 12px;color: rgb(0 0 0 / 90%);">添加ipv6：</span>
                        <el-button size="mini" icon="el-icon-plus" type="text" @click="addIpv4('edit', 6)">添加</el-button>
                    </div>
                    <div class="w100">
                        <el-table :data="assetsFormEdit.ipsv6" class='bigTable fixedTable' border stripe tooltip-effect="dark" style="width: 100%;">
                            <!-- <el-table-column type="index" width="50" label="序号" align="center"></el-table-column> -->
                            <el-table-column label="IP" width="292">
                                <template slot="header">
                                    <div>IP <i style="color: #f56c6c;">*</i></div>
                                </template>
                                <template slot-scope="scope">
                                    <el-form-item :prop="'ipsv6.'+scope.$index+'.assetsIp'" class="mb0" :rules="rules.ipv6">
                                        <el-input size="mini" v-model="scope.row.assetsIp" placeholder="请输入IP" style="width: 270px;"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column label="端口" width="140">
                                <template slot="header">
                                    <el-tooltip class="item" effect="dark" content="可批量输入，用','分隔" placement="top">
                                        <div>端口 <i class="el-icon-question" style="color: rgb(0 0 0 / 40%);"></i></div>
                                    </el-tooltip>
                                </template>
                                <template slot-scope="scope">
                                    <el-form-item :prop="'ipsv6.'+scope.$index+'.port'" class="mb0">
                                        <el-input size="mini" v-model="scope.row.port" placeholder="请输入端口"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column label="MAC" width="140">
                                <template slot-scope="scope">
                                    <el-form-item :prop="'ipsv6.'+scope.$index+'.mac'" class="mb0">
                                        <el-input size="mini" v-model="scope.row.mac" placeholder="请输入MAC"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column label="子网掩码" width="140">
                                <template slot-scope="scope">
                                    <el-form-item :prop="'ipsv6.'+scope.$index+'.mask'" class="mb0">
                                        <el-input size="mini" v-model="scope.row.mask" placeholder="请输入子网掩码"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column label="网关" width="140">
                                <template slot-scope="scope">
                                    <el-form-item :prop="'ipsv6.'+scope.$index+'.gateway'" class="mb0">
                                        <el-input size="mini" v-model="scope.row.gateway" placeholder="请输入网关"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" width="50" align="center">
                                <template slot-scope="scope">
                                    <el-button size="mini" icon="el-icon-remove-outline" class="del-btn" type="text" @click="deleteIp('edit',   scope.$index,6)" style="font-size: 14px;color: #f56c6c;"></el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="w100" v-if="existIp!=''" style="line-height: 20px;vertical-align: top;word-wrap: break-word;  word-break: break-all;white-space: normal;color: red;">
                        {{existIp}} 已存在
                    </div>
                    <div class="ub ub-pj w100 mt-1">
                        <span style="font-size: 12px;color: rgb(0 0 0 / 90%);">添加组件：</span>
                        <el-button size="mini" type="text" icon="el-icon-plus" @click="addApplication('edit')">添加</el-button>
                    </div>
                    <div class="w100">
                        <el-table :data="assetsFormEdit.applications" class='bigTable' border stripe tooltip-effect="dark" style="width: 100%;">
                            <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
                            <el-table-column prop="name" label="组件名称">
                                <template slot-scope="scope">
                                    <el-form-item :prop="'applications.'+scope.$index+'.name'" class="mb0">
                                        <el-input size="mini" v-model="scope.row.name" placeholder="请输入组件名称"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column prop="softwareVersion" label="版本">
                                <template slot-scope="scope">
                                    <el-form-item :prop="'applications.'+scope.$index+'.softwareVersion'" class="mb0">
                                        <el-input size="mini" v-model="scope.row.softwareVersion" placeholder="请输入版本" ></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column prop="innerPort" label="内网端口号">
                            <template slot-scope="scope">
                                <el-form-item :prop="'applications.'+scope.$index+'.innerPort'" class="mb0">
                                    <el-input size="mini" v-model="scope.row.innerPort" placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="outerPort" label="外网端口号">
                            <template slot-scope="scope">
                                <el-form-item :prop="'applications.'+scope.$index+'.outerPort'" class="mb0">
                                    <el-input size="mini" v-model="scope.row.outerPort" placeholder="请输入"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                            <el-table-column prop="address" label="操作" width="50" align="center">
                                <template slot-scope="scope">
                                    <el-button size="mini" icon="el-icon-remove-outline" class="del-btn" type="text"    @click="deleteApplication('edit',scope.$index)" style="font-size: 14px;color: #f56c6c;"></el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="ub ub-pj w100 mt-1">
                        <span style="font-size: 12px;color: rgb(0 0 0 / 90%);">联系人：</span>
                        <el-button size="mini" type="text" icon="el-icon-plus" @click="addUsers('edit')">添加</el-button>
                    </div>
                    <div class="w100">
                        <el-table :data="assetsFormEdit.users" class='bigTable' border stripe tooltip-effect="dark" style="width: 100%;">
                            <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
                            <el-table-column label="联系人" width="142">
                                <template slot-scope="scope">
                                    <el-select size="mini" style="width: 120px;" v-model="scope.row.userId" filterable placeholder="请选择"  @change="changeUser(scope.row)">
                                        <el-option v-for="item in users" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column prop="code" label="员工编号" width="80">
                            </el-table-column>
                            <el-table-column prop="departmentName" label="组织架构" width="100">
                            </el-table-column>
                            <el-table-column prop="phone" label="电话" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column prop="landline" label="座机" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column prop="mailBox" label="邮箱" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column prop="address" label="操作" width="50" align="center">
                                <template slot-scope="scope">
                                    <el-button size="mini" icon="el-icon-remove-outline" class="del-btn" type="text" @click="deleteUsers ('edit',scope.$index)" style="font-size: 14px;color: #f56c6c;"></el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <!--非系统属性-->
                    <div class="extend-box" v-if="assetsFormEdit.extendAttr&&assetsFormEdit.extendAttr.length">
                        <div class="w100" v-for="(item, index) in assetsFormEdit.extendAttr" :key="index">
                            <el-form-item v-if="item.type == 1" :label="item.name+ '：'" label-width="120px" style="width: 100%;">
                                <el-input size="small" v-model="item.val" placeholder="请输入字符串" autocomplete="off" clearable style="width: 848px;"></el-input>
                            </el-form-item>
                            <el-form-item v-if="item.type == 2" :label="item.name+ '：'" label-width="120px" style="width: 100%;">
                                <el-input size="small" type="number" v-model="item.val" oninput ="value=value.replace(/[^0-9.]/g,'')"   @blur="item.val = $event.target.value" placeholder="请输入数字" autocomplete="off" style="width: 848px;"></el-input>
                            </el-form-item>
                            <el-form-item v-if="item.type == 3" :label="item.name+ '：'" label-width="120px">
                                <el-date-picker
                                    v-model="item.val"
                                    align="right"
                                    type="date"
                                    size="small"
                                    placeholder="选择日期"
                                    :picker-options="pickerOptions">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item v-if="item.type == 4" :label="item.name+ '：'" label-width="120px">
                                <el-date-picker
                                    v-model="item.val"
                                    type="datetime"
                                    size="small"
                                    placeholder="选择日期时间"
                                    align="right"
                                    :picker-options="pickerOptions">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item v-if="item.type == 5" :label="item.name+'：'" :prop="'extendAttr.' + index + '.val'"  label-width="120px" style="width: 100%;" :rules="rules.extendIp">
                                <el-input size="small" v-model="item.val" placeholder="请输入ip" autocomplete="off" clearable style="width: 848px;"></el-input>
                            </el-form-item>
                            <el-form-item v-if="item.type == 6" :label="item.name+ '：'" label-width="120px" style="width: 100%;">
                                <el-input :show-password="true" size="small" v-model="item.val" placeholder="请输入密码" autocomplete="off" clearable style="width: 848px;"></el-input>
                            </el-form-item>
                            <div class="rich-text" v-if="item.type == 7">
                                <el-form-item :label="item.name+ '：'" label-width="120px" style="margin-bottom: 0 !important;width: 100%;">
                                </el-form-item>
                                <div>
                                    <vue-ueditor-wrap :config="myConfig" v-model="item.val"></vue-ueditor-wrap>
                                </div>
                            </div>
                            <el-form-item v-if="item.type == 8" :key="'zz8' + index" :label="item.name+ '：'" label-width="120px"   style="width: 100%;">
                                <el-select size="small" v-model="item.val" clearable placeholder="请选择" style="width: 848px;">
                                    <el-option v-for="(_it,_inx) in typeof item.items === 'string' ? item.items.split('#') : []" :key="_inx"    :label="_it" :value="_it"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item v-if="item.type == 9" :key="'zz9' + index" :label="item.name+ '：'" label-width="120px"   style="width: 100%;">
                                <el-select size="small" v-model="item.val" multiple clearable placeholder="请选择" style="width: 848px;">
                                    <el-option v-for="(_it,_inx) in typeof item.items === 'string' ? item.items.split('#') : []" :key="_inx"    :label="_it" :value="_it"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item v-if="item.type == 10" :key="'zz10' + index" :label="item.name+ '：'" label-width="120px" style="width: 100%;">
                            <el-cascader
                                clearable
                                size="small"
                                v-model="item.val"
                                :options="cityOptions"
                                :props="cityProps"
                            ></el-cascader>
                        </el-form-item>
                        </div>
                    </div>
                    <!--系统属性-->
                    <div class="extend-box system-box" v-if="assetsFormEdit.systemAttr&&assetsFormEdit.systemAttr.length">
                        <div class="w100" v-for="(item, index) in assetsFormEdit.systemAttr" :key="index">
                            <el-form-item v-if="item.type == 1" :label="item.name+ '：'" label-width="120px" style="width: 100%;">
                                <el-input size="small" v-model="item.val" placeholder="请输入字符串" autocomplete="off" clearable style="width: 848px;"></el-input>
                            </el-form-item>
                            <el-form-item v-if="item.type == 2" :label="item.name+ '：'" label-width="120px" style="width: 100%;">
                                <el-input size="small" type="number" v-model="item.val" oninput ="value=value.replace(/[^0-9.]/g,'')"   @blur="item.val = $event.target.value" placeholder="请输入数字" autocomplete="off" style="width: 848px;"></el-input>
                            </el-form-item>
                            <el-form-item v-if="item.type == 3" :label="item.name+ '：'" label-width="120px">
                                <el-date-picker
                                    v-model="item.val"
                                    align="right"
                                    type="date"
                                    size="small"
                                    placeholder="选择日期"
                                    :picker-options="pickerOptions">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item v-if="item.type == 4" :label="item.name+ '：'" label-width="120px">
                                <el-date-picker
                                    v-model="item.val"
                                    type="datetime"
                                    size="small"
                                    placeholder="选择日期时间"
                                    align="right"
                                    :picker-options="pickerOptions">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item v-if="item.type == 5" :label="item.name+'：'" :prop="'systemAttr.' + index + '.val'"  label-width="120px" style="width: 100%;" :rules="rules.extendIp">
                                <el-input size="small" v-model="item.val" placeholder="请输入ip" autocomplete="off" clearable style="width: 848px;"></el-input>
                            </el-form-item>
                            <el-form-item v-if="item.type == 6" :label="item.name+ '：'" label-width="120px" style="width: 100%;">
                                <el-input :show-password="true" size="small" v-model="item.val" placeholder="请输入密码" autocomplete="off"     clearable style="width: 848px;"></el-input>
                            </el-form-item>
                            <div class="rich-text" v-if="item.type == 7">
                                <el-form-item :label="item.name+ '：'" label-width="120px" style="margin-bottom: 0 !important;width: 100%;">
                                </el-form-item>
                                <div>
                                    <vue-ueditor-wrap :config="myConfig" v-model="item.val"></vue-ueditor-wrap>
                                </div>
                            </div>
                            <el-form-item v-if="item.type == 8" :key="'zzzz8' + index" :label="item.name+ '：'" label-width="120px"     style="width: 100%;">
                                <el-select size="small" v-model="item.val" clearable placeholder="请选择" style="width: 848px;">
                                    <el-option v-for="(_it,_inx) in typeof item.items === 'string' ? item.items.split('#') : []" :key="_inx"    :label="_it" :value="_it"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item v-if="item.type == 9" :key="'zzzz9' + index" :label="item.name+ '：'" label-width="120px"     style="width: 100%;">
                                <el-select size="small" v-model="item.val" multiple clearable placeholder="请选择" style="width: 848px;">
                                    <el-option v-for="(_it,_inx) in typeof item.items === 'string' ? item.items.split('#') : []" :key="_inx"    :label="_it" :value="_it"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item v-if="item.type == 10" :key="'zzzz10' + index" :label="item.name+ '：'" label-width="120px" style="width: 100%;">
                            <el-cascader
                                clearable
                                size="small"
                                :props="cityProps"
                                v-model="item.val"
                                :options="cityOptions"
                            ></el-cascader>
                        </el-form-item>
                        </div>
                    </div>
                </el-form>
                <div slot="footer" class="dialog-footer" style="position: fixed;right: 0;bottom: 0;z-index: 9999;padding-bottom: 10px;width: 900px;text-align: right;background: #ffffff;">
                    <el-button @click="handleClose" size="small">取消</el-button>
                    <el-button @click="submitFormEdit('assetsFormEdit')" size="small" type="primary" style="margin-right: 30px;">确定</el-button>
                </div>
            </div>
        </el-drawer>
        <!--查看内容-->
        <el-dialog title="查看资产" :visible.sync="seeDialog" width="700px" custom-class="common-dialog">
            <el-form :model="assetsFormEdit" :rules="rules" ref="assetsFormEdit" :inline="true" class="unit">
                <el-form-item label="资产名称：" :label-width="formLabelWidth">
                    <div class="input-div">{{assetsFormEdit.deviceName}}</div>
                </el-form-item>
                <el-form-item label="资产标识：" :label-width="formLabelWidth">
                    <div class="input-div">{{assetsFormEdit.uniqueCode}}</div>
                </el-form-item>
                <el-form-item label="业务系统：" :label-width="formLabelWidth">
                    <div class="input-div">{{ assetsFormEdit.system_name }}</div>
                </el-form-item>
                <el-form-item label="所属安全域：" :label-width="formLabelWidth">
                    <div class="input-div">{{assetsFormEdit.zoneName}}</div>
                </el-form-item>
                <el-form-item label="资产类型：" :label-width="formLabelWidth">
                    <div class="input-div">{{assetsFormEdit.device_type_name}}</div>
                </el-form-item>
                <el-form-item label="厂商：" :label-width="formLabelWidth">
                    <div class="input-div">{{assetsFormEdit.manufacturer_name}}</div>
                </el-form-item>
                <el-form-item label="型号：" :label-width="formLabelWidth">
                    <div class="input-div">{{assetsFormEdit.modelInfo}}</div>
                </el-form-item>
                <el-form-item label="操作系统：" :label-width="formLabelWidth">
                    <div class="input-div">{{assetsFormEdit.pcSystem}}</div>
                </el-form-item>
                <el-form-item label="系统版本：" :label-width="formLabelWidth">
                    <div class="input-div">{{assetsFormEdit.pcSystemVersion}}</div>
                </el-form-item>
                <div class="domain-add">
                    <span class="domain-title">添加ipv4：</span>
                    <!-- <el-button size="mini" icon="el-icon-plus" type="text" @click="addIp('edit')">添加</el-button> -->
                </div>
                <div class="domain-list">
                    <el-table :data="assetsFormEdit.ipsv4" class='bigTable' border stripe tooltip-effect="dark" style="width: 100%;">
                        <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
                        <el-table-column prop="assetsIp" label="IP">
                        </el-table-column>
                        <el-table-column prop="port" label="端口">
                        </el-table-column>
                        <el-table-column prop="mac" label="MAC">
                        </el-table-column>
                        <el-table-column prop="mask" label="子网掩码">
                        </el-table-column>
                        <el-table-column prop="gateway" label="网关">
                        </el-table-column>
                        <!-- <el-table-column label="操作" width="50" align="center">
                            <template slot-scope="scope">
                                <el-button size="mini" icon="el-icon-remove-outline" class="del-btn" type="text" @click="deleteIp('edit',scope.$index)" style="font-size: 20px;color: #F56C6C;"></el-button>
                            </template>
                        </el-table-column> -->
                    </el-table>
                </div>
                <div class="domain-add">
                    <span class="domain-title">添加ipv6：</span>
                    <!-- <el-button size="mini" icon="el-icon-plus" type="text" @click="addIp('edit')">添加</el-button> -->
                </div>
                <div class="domain-list">
                    <el-table :data="assetsFormEdit.ipsv6" class='bigTable' border stripe tooltip-effect="dark" style="width: 100%;">
                        <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
                        <el-table-column prop="assetsIp" label="IP">
                        </el-table-column>
                        <el-table-column prop="port" label="端口">
                        </el-table-column>
                        <el-table-column prop="mac" label="MAC">
                        </el-table-column>
                        <el-table-column prop="mask" label="子网掩码">
                        </el-table-column>
                        <el-table-column prop="gateway" label="网关">
                        </el-table-column>
                        <!-- <el-table-column label="操作" width="50" align="center">
                            <template slot-scope="scope">
                                <el-button size="mini" icon="el-icon-remove-outline" class="del-btn" type="text" @click="deleteIp('edit',scope.$index)" style="font-size: 20px;color: #F56C6C;"></el-button>
                            </template>
                        </el-table-column> -->
                    </el-table>
                </div>
                <!-- <div class="w100" v-if="existIp!=''" style="line-height:20px;vertical-align: top;word-wrap:break-word;word-break:break-all;white-space:normal;color:red;">
                    {{existIp}} 已存在
                </div> -->
                <div class="domain-add">
                    <span class="domain-title">添加组件：</span>
                    <!-- <el-button size="mini" type="text" @click="addApplication('edit')">添加</el-button> -->
                </div>
                <div class="domain-list">
                    <el-table :data="assetsFormEdit.applications" class='bigTable' border stripe tooltip-effect="dark" style="width: 100%;">
                        <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
                        <el-table-column prop="name" label="组件名称">
                        </el-table-column>
                        <el-table-column prop="softwareVersion" label="版本">
                        </el-table-column>
                        <!-- <el-table-column prop="address" label="操作" width="50" align="center">
                            <template slot-scope="scope">
                                <el-button size="mini" icon="el-icon-remove-outline" class="del-btn" type="text" @click="deleteApplication('edit',scope.$index)" style="font-size: 20px;color: #F56C6C;"></el-button>
                            </template>
                        </el-table-column> -->
                    </el-table>
                </div>
                <div class="domain-add">
                    <span class="domain-title">联系人：</span>
                </div>
                <div class="domain-list">
                    <el-table :data="assetsFormEdit.users" class='bigTable' border stripe tooltip-effect="dark" style="width: 100%;">
                        <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
                        <el-table-column prop="chineseName" label="联系人" width="100">
                        </el-table-column>
                        <el-table-column prop="code" label="员工编号" width="90">
                        </el-table-column>
                        <el-table-column prop="departmentName" label="部门" width="100">
                        </el-table-column>
                        <el-table-column prop="phone" label="电话">
                        </el-table-column>
                        <el-table-column prop="landline" label="座机">
                        </el-table-column>
                        <el-table-column prop="mailBox" label="邮箱" show-overflow-tooltip>
                        </el-table-column>
                    </el-table>
                </div>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button title="关 闭" @click="seeDialog = false"></el-button>
            </span>
        </el-dialog>
        <!--删除-->
        <DeleteDialog
            :dialogVisible = userDeleteDialog
            @delete="handleDelete"
            @cancel="userDeleteDialog = false">
        </DeleteDialog>
        <DeleteDialog
            :dialogVisible = userDeleteAllDialog
            @delete="handleDelete"
            @cancel="userDeleteAllDialog = false">
        </DeleteDialog>
        <el-drawer :visible.sync="alarmDialog" direction="rtl" size="50%" :title="alarm.name+'事件详情'">
            <div class="drawer-pad">
                <el-table :height="drawerHeight"  v-loading="loop_loading" class='bigTable fixedTable' :data="alarm.data" border stripe tooltip-effect="dark" :row-style="{ height: '32px' }"
                :header-row-style="{ height: '32px' }" :row-class-name="tableRowClassName">
                    <el-table-column align="center" type="index" width="50" label="序号" :index="indexAlarmMethod">
                    </el-table-column>
                    <el-table-column prop="reportName" label="事件名称" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="reportLevel" label="事件等级" sortable width="100">
                        <template slot-scope="scope">
                            <span v-if="scope.row.reportLevel == 0" style="color: #03864f;">低</span>
                            <span v-if="scope.row.reportLevel == 1" style="color: #0052d9;">中低</span>
                            <span v-if="scope.row.reportLevel == 2" style="color: #ddd000;">中</span>
                            <span v-if="scope.row.reportLevel == 3" style="color: #e47700;">中高</span>
                            <span v-if="scope.row.reportLevel == 4" style="color: #e47700;">高</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="reportTypeName" label="事件类型" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="asset" label="受影响资产" width="120">
                    </el-table-column>
                    <el-table-column prop="alarm_from" label="事件来源" width="100">
                    </el-table-column>
                    <el-table-column prop="createTime" label="事件时间" width="160" sortable>
                    </el-table-column>
                    <el-table-column label="事件状态" width="100">
                        <template slot-scope="scope">
                            <div v-if="scope.row.reportStatus == 0" style="width: 80px;height: 18px;border-radius: 11px;text-align: center;color: #de7400;background: #fde6d8;line-height: 18px;">
                                <div>待确认</div>
                            </div>
                            <div v-if="scope.row.reportStatus == 1" style="width: 80px;height: 18px;border-radius: 11px;text-align: center;color: #03864f;background: #ccf6e4;line-height: 18px;">
                                <div>已确认</div>
                            </div>
                            <div v-if="scope.row.reportStatus == 2" style="width: 80px;height: 18px;border-radius: 11px;text-align: center;color: #0052d9;background: #d5e5fa;line-height: 18px;">
                                <div>已处理</div>
                            </div>
                            <div v-if="scope.row.reportStatus == 3" style="width: 80px;height: 18px;border-radius: 11px;text-align: center;color: #aa0202;background: #fad7dd;line-height: 18px;">
                                <div>已驳回</div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="isTrace" label="是否溯源" align="center">
                            <template slot-scope="scope">
                                <div v-if="scope.row.isTrace == 1">
                                    是
                                </div>
                                <div v-else>
                                    否
                                </div>
                            </template>
                    </el-table-column>
                    <el-table-column prop="isTraceEnd" label="溯源状态" align="center">
                            <template slot-scope="scope">
                                <div v-if="scope.row.isTrace == 1 && scope.row.isTraceEnd == 1">
                                    已溯源
                                </div>
                                <div v-if="scope.row.isTrace == 1 && scope.row.isTraceEnd != 1">
                                    未溯源
                                </div>
                                <div v-if="scope.row.isTrace != 1">
                                    --
                                </div>
                            </template>
                    </el-table-column>
                </el-table>
                <div v-show="alarm.data.length>0" class="pagination pag" style="margin-top: 10px;padding: 0 !important;text-align: right;">
                <el-pagination
                    background
                    @size-change="handleSizeChangeAlarm"
                    @current-change="handleCurrentChangeAlarm"
                    :current-page="alarm_params.page"
                    :page-sizes="[10,20,30,50]"
                    :page-size="alarm_params.size"
                    layout="slot,sizes, prev, next"
                    prev-text="＜ 上一页"
                    next-text="下一页 ＞"></el-pagination>
            </div>
                <!-- <pagination :total="alarm_total_num" :page.sync="alarm_params.page" :limit.sync="alarm_params.size" @pagination="initAlarms(alarm_ips)" style="padding-top:10px" layout="total, sizes, prev, pager, next"/> -->
            </div>
        </el-drawer>
        <el-drawer :visible.sync="holeDialog" direction="rtl" size="50%" :title="hole.name+'漏洞详情'">
            <div class="drawer-content">
                <div class="drawer-pad">
                    <el-table :height="drawerHeight"  v-loading="loop_loading" class='bigTable rightTable' :data="hole.data" border stripe tooltip-effect="dark" :row-style="{ height: '32px' }" :header-row-style="{ height: '32px' }" :row-class-name="tableRowClassName">
                        <el-table-column align="center" type="index" width="50" label="序号" :index="indexMatchUserMethod">
                        </el-table-column>
                        <el-table-column label="漏洞名称" width="130" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <p>{{scope.row.nodeName|NullStr}}</p>
                            </template>
                        </el-table-column>
                        <el-table-column label="漏洞类型">
                            <template slot-scope="scope">
                                <p v-if="scope.row.leakType == '0'">主机漏洞</p>
                                <p v-if="scope.row.leakType == '1'">基线漏洞</p>
                                <p v-if="scope.row.leakType == '2'">网站漏洞</p>
                                <p v-if="scope.row.leakType == '3'">口令猜测</p>
                            </template>
                        </el-table-column>
                        <el-table-column label="漏洞等級" width="100">
                            <template slot-scope="scope">
                                <span style="color: #00a2ff;" v-if="scope.row.riskLevel==1">
                                    低
                                </span>
                                <span style="color: #f2cd00;" v-if="scope.row.riskLevel==2">
                                    中
                                </span>
                                <span style="color: #f86900;" v-if="scope.row.riskLevel==3">
                                    高
                                </span>
                                <span style="color: #19b0b1;" v-if="scope.row.riskLevel==4">
                                    信息
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column label="CVE编号" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <p>{{scope.row.cncveTag|NullStr}}</p>
                            </template>
                        </el-table-column>
                        <el-table-column prop="createTime" label="创建时间" width="170">
                        </el-table-column>
                    </el-table>
                    <pagination :total="hole_total_num" :page.sync="hole_params.page" :limit.sync="hole_params.size" @pagination="initLoop(hole_id)" style="padding-top: 10px;" layout="total, sizes, prev, pager, next"/>
                </div>
            </div>
        </el-drawer>
        <el-drawer :visible.sync="threatDialog" direction="rtl" size="50%" :title="threat_name+'安全情报'">
            <div class="drawer-content">
                <el-table :height="drawerHeight" v-loading="threat_loading" :data="threatData" class='bigTable fixedTable' border stripe :row-style="{ height: '32px' }" :header-row-style="{ height: '32px' }" :row-class-name="tableRowClassName">
                    <el-table-column align="center" type="index" width="50" label="序号" :index="indexMatchThreatMethod">
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="content" label="情报内容" width="100"></el-table-column>
                    <el-table-column prop="typeCN" label="情报类型"></el-table-column>
                    <el-table-column prop="modeCodeCN" label="攻击方式" width="150">
                        <template slot-scope="scope">
                            <div class="mb0 roles" v-if="scope.row.attackModes.length > 0">
                                <el-tag size="mini" type="success" v-for="(names,index) in scope.row.attackModes" :key="index">{{ names.modeCodeCN }}</el-tag>
                            </div>
                            <div v-else>--</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sourcesCN" label="情报来源"></el-table-column>

                    <el-table-column prop="survivalCN" label="情报存活性" width="100"></el-table-column>
                    <el-table-column prop="createTime" label="创建时间" width="170"></el-table-column>
                </el-table>
                <pagination :total="threat_total_num" :page.sync="threat_total_num.page" :limit.sync="threat_total_num.size" @pagination="init_threatData(threatId)" style="padding-top: 10px;"  layout="total, sizes, prev, pager, next"/>
            </div>
        </el-drawer>
        <el-dialog :title="addGroupForm.id?'编辑分组':'创建分组'" :visible.sync="addGroupDialog" width="700px" custom-class="common-dialog">
            <el-form :model="addGroupForm" :rules="addGroupRules" ref="addGroupForm" label-position="top">
                <el-form-item label="分组名称：" prop="name" label-width="100px">
                    <el-input style="width: 100%;" placeholder="请输入" clearable v-model="addGroupForm.name" size="small"></el-input>
                </el-form-item>
                <el-form-item label="上级分组："  label-width="100px">
                <div class="treeselect">
                    <treeselect
                        size="small"
                        class="treeselect"
                        style="margin-top: 3px;width: 680px;"
                        :options="groupList"
                        :normalizer="normalizer"
                        noChildrenText="当前分支无子节点"
                        noOptionsText="无可用选项"
                        noResultsText="无可用选项"
                        placeholder="请选择资产类型"
                        v-model="addGroupForm.parentId"
                        loadingText="下拉框无匹配项"
                        :clearable="false"
                    />
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="addGroupDialog = false">取消</el-button>
                <el-button size="small" type="primary" @click="submitGroupForm('addGroupForm')">确认</el-button>
            </span>
        </el-dialog>
        <DeleteDialog
            :dialogVisible="delGroupDialog"
            @delete="handleDeleteGroupFun"
            @cancel="delGroupDialog = false">
        </DeleteDialog>
        <AssetsDetailDrawer :activeName="activeName" :assetsSeeDialog="drawerSeeDialog" ref="assetsDetailDrawer" ></AssetsDetailDrawer>
        <el-dialog
            title="提示"
            custom-class="common-dialog"
            :visible.sync="addVendorDialog"
            width="30%"
            :before-close="handleClose">
            <span class='tishi'>确定要离开当前页面吗？</span>
            <span slot="footer" class="dialog-footer">
              <el-button @click="addVendorDialog = false">取 消</el-button>
              <el-button type="primary" @click="handleAddVendor">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { provinceAndCityData, CodeToText } from 'element-china-area-data'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import AssetsDetailDrawer from './assets_detail_drawer/index.vue'
import initData from '@/mixins/initData.js'
import VueUeditorWrap from '../../components/vue-ueditor-wrap.vue' // ES6 Module
import draggable from 'vuedraggable'
import ueditorConfig from '../../mixins/ueditorConfig'
import ChartContent from '@/pages/data_manage/chart_option/components/ChartContent'
import CustomDate from './components/custom_date/index.vue'
import {
    deleteGroup,
    findGroup,
    exportExcel,
    getAllManufacturer,
    checkIP,
    get_types,
    add_assets,
    get_assets,
    edit_assets,
    delete_asset,
    getSystemType,
    getScanLeakByIp,
    assetChat,
    get_all_zoneIds,
    get_threatData,
    refresh_assetsSummary,
    getAlarmsByIp,
    get_asset_users, getUsers,
    get_header_list,
    save_header_list,
    get_asset_info_tree,
    get_asset_label,
    get_asset_system_attr,
    template,
    exportExcel1,
    saveGroup,
    getSortFieldAssets,
    getOrgLevel
} from '../../server/assets/api.js'
export default {
    name: 'AssetInfo',
    components: {
        Treeselect,
        VueUeditorWrap,
        draggable,
        ChartContent,
        AssetsDetailDrawer,
        CustomDate
    },
    mixins: [ueditorConfig, initData],
    data() {
        return {
            orgLevelList: [],
            addVendorDialog: false,
            chartTimeRange: [],
            customTime: [],
            dateData: '',
            dateMode: '',
            useDate: {},
            useIndex: '',
            viewTab: 'tableView',
            attrData: [],
            sysAttrData: [],
            cityProps: {
                label: 'label',
                value: 'label'
            },
            cityOptions: provinceAndCityData,
            delGroupDialog: false,
            normalizer(node) {
                if (node.sub && !node.sub.length) {
                    delete node.sub
                }
                return {
                    id: node.id,
                    label: node.name,
                    children: node.sub
                }
            },
            activeName: 'first',
            groupList: [],
            addGroupRules: {
                name: [{
                    required: true,
                    message: '请输入名称',
                    trigger: 'blur'
                }],
                parentId: [{
                    required: true,
                    message: '请选择上级分组',
                    trigger: 'change'
                }]
            },
            addGroupForm: {
                id: '',
                name: '',
                parentId: null

            },
            drawerSeeDialog: false,
            drawerHeight: document.body.clientHeight - 120,
            tabHeight: document.body.clientHeight - 260,
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
            value: '',
            isClick: true,
            isFirst: true,
            indent: 10,
            initId: null,
            depId: '',
            config_id: '',
            assetTreeData: [],
            checkListAll: [
                '资产名称',
                '资产标识',
                '资产标签',
                '资产类型',
                '厂商',
                '型号',
                '操作系统',
                '是否边界',
                '是否国产',
                '业务系统',
                '所属安全域',
                'IP',
                '端口',
                '创建时间',
                '资产联系人'
            ],
            addAssetAttr: [],
            editAssetAttr: [],
            treeData: [],
            assetPropsData: {
                children: 'sub',
                label: 'name'
                // disabled: (node) => {
                //     if (node.flag && node.flag == 5) {
                //         return false
                //     } else {
                //         return true
                //     }
                // }
            },
            propsDataSelect: {
                children: 'sub',
                label: 'name'
            },
            currentNodeKey: '',
            currentNode: {
                id: ''
            },
            currentNodeData: [],
            states: [
                {
                    value: 1,
                    label: '已启用'
                }, {
                    value: 2,
                    label: '已暂停'
                }
            ],
            addRuleForm: {
                rule_name: ''
            },
            addRuleDialog: false,
            // 导入数据
            importDialog: false,
            importForm: {
                name: '',
                state: '1'
            },
            // 编辑数据
            editRuleForm: {
                id: '',
                rule_name: ''
            },
            currentId: '',
            editRuleDialog: false,

            // 自动处置数据
            autoDialog: false,
            task_types: [
                {
                    value: 1,
                    label: '高级'
                }, {
                    value: 2,
                    label: '中级'
                }, {
                    value: 3,
                    label: '低级'
                }
            ],
            prioritys: [
                {
                    value: 1,
                    label: '高级'
                }, {
                    value: 2,
                    label: '中级'
                }, {
                    value: 3,
                    label: '低级'
                }
            ],
            assign_groups: [
                {
                    value: 1,
                    label: '高级'
                }, {
                    value: 2,
                    label: '中级'
                }, {
                    value: 3,
                    label: '低级'
                }
            ],
            autoFrom: {
                handle_way: false,
                checkList: ['1'],
                task_name: '',
                task_type: '',
                priority: '',
                assign_group: '',
                advise: ''
            },
            addGroupDialog: false,
            addRuleGroupForm: {
                name: ''
            },
            editRuleGroupDialog: false,
            editRuleGroupForm: {
                name: ''
            },
            delRuleGroupDialog: false,
            userId: '',
            files_list: [],
            // downloadDialog:false,
            files: [],
            uploadDialog: false,
            file_num: 0,
            flag: null,
            record_row: {},

            currentNodeId: '',

            testData: [],
            detailArr: [],
            detailDialog: false,
            deployDialog: false,
            deployAllDialog: false,
            deleteDialog: false,
            deleteItemId: '',
            deleteItemDialog: false,
            deleteAllDialog: false,
            innerValue_search: '',
            innerLabel_search: '',
            users: [],

            threat_name: '',
            threat_loading: true,
            threat_total_num: 0,
            threatId: '',
            threatData: [],
            threat_params: {
                page: 1,
                size: 20
            },
            threatDialog: false,
            zoneIds: [],
            applications: [{
                name: '',
                version_info: ''
            }],

            innerLabel_add: '',
            innerValue_add: '',

            innerLabel_edit: '',
            innerValue_edit: '',
            checkList: [],
            headerTimer: null,

            formLabelWidth: '100px',
            hole_ips: [],
            loop_loading: false,
            hole_total_num: 0,
            hole_params: {
                page: 1,
                size: 20
            },
            hole: {
                name: '',
                data: []
            },
            alarmDialog: false,
            alarm_ips: [],
            alarm_loading: false,
            alarm_total_num: 0,
            alarm_params: {
                page: 1,
                size: 20
            },
            alarm: {
                name: '',
                data: []
            },

            systems: [],
            existIp: '',
            types: [],
            loading: false,
            total_num: 0,
            tableData: [],
            storeOp: [],
            multipleSelection: [],
            get_params: {
                page: 1,
                size: 20,
                ip: '',
                deviceTypeIds: [],
                assetsName: '',
                systemIds: [],
                orgIds: [],
                system: '',
                version: '',
                software: '',
                app_version: '',
                zoneIds: [],
                groupIds: [],
                orgLevel: ''
            },
            holeDialog: false,
            seeDialog: false,
            userDeleteDialog: false,
            userDeleteAllDialog: false,
            delIds: [],
            addDomainDialog: false,
            editUserDialog: false,
            ips: [{
                ip: '',
                port: '',
                mac: '',
                mask: '',
                gateway: ''
            }],
            upstreamVoList: [{
                state: '1',
                value: ''
            }],
            saveBoundarys: [],
            assetLabelList: [],
            deviceForm: {
                groupId: null,
                isInstall: '',
                virusVersion: '',
                manufacturerId: '',
                modelInfo: '',
                pcSystemVersion: '',
                isBoundary: '1',
                deviceName: '',
                uniqueCode: '',
                deviceTypeId: '',
                subnetMask: '',
                pcSystem: '',
                systemId: [],
                zoneId: '', // 安全域名
                safetyBoundary: '', // 安全边界
                isDomestic: '1', // 是否国产
                labelId: '',

                ipsv4: [
                    /* {
                    ip: '',
                    port: '',
                    mac: '',
                    mask: '',
                    gateway: '',
                    ipType: 1
                    }*/
                ],
                ipsv6: [
                    /* {
                    ip: '',
                    port: '',
                    mac: '',
                    mask: '',
                    gateway: '',
                    ipType: 2
                    }*/
                ],
                applications: [],
                users: [],
                /* 拓展字段*/
                extendAttr: [],
                systemAttr: [],
                fullStatus: '',
                usableStatus: '',
                secretStatus: ''
            },
            assetsFormEdit: {
                groupId: null,
                isInstall: '',
                virusVersion: '',
                id: '',
                deviceName: '',
                deviceTypeId: '',
                subnetMask: '',
                pcSystem: '',
                systemId: [],
                zoneId: '', // 安全域名
                safetyBoundary: '', // 安全边界
                isBoundary: '1',
                manufacturerId: '',
                modelInfo: '',
                pcSystemVersion: '',
                ips: [],
                applications: [],
                users: [],
                isDomestic: '1', // 是否国产
                labelId: '',
                extendAttr: [],
                systemAttr: [],
                fullStatus: '',
                usableStatus: '',
                secretStatus: ''
            },
            systemAttr: [],
            ipRules: {
                pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
                message: '请填写正确的IP',
                trigger: 'blur'
            },
            rules: {
                deviceName: [{
                    required: true,
                    message: '请输入资产名称',
                    trigger: 'blur'
                }],
                deviceTypeId: [{
                    required: true,
                    message: '请选择资产类型',
                    trigger: 'change'
                }],
                uniqueCode: [{
                    required: true,
                    message: '请输入资产标识',
                    trigger: 'blur'
                }],
                ip: [
                    {
                        required: true,
                        message: 'IP不能为空',
                        trigger: 'blur'
                    },
                    {
                        pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
                        message: '请填写正确的IP',
                        trigger: 'blur'
                    }
                ],
                extendIp: [
                    {
                        pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
                        message: '请填写正确的IP',
                        trigger: 'blur'
                    }
                ],
                ipv6: [
                    {
                        required: true,
                        message: 'IP不能为空',
                        trigger: 'blur'
                    },
                    {
                        pattern: /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/,
                        message: '请填写正确的IP',
                        trigger: 'blur'
                    }
                ],
                fullStatus: [{
                    required: true,
                    message: '请选择资产完整性',
                    trigger: 'change'
                }],
                usableStatus: [{
                    required: true,
                    message: '请选择资产可用性',
                    trigger: 'change'
                }],
                secretStatus: [{
                    required: true,
                    message: '请选择资产机密性',
                    trigger: 'change'
                }]
            },
            fileList: [],
            filterText: '',
            kaiguan: false,
            sortFieldObj: null
        }
    },
    computed: {
        downloadUrl() {
            return '/api/assets-manage/manage/assets/exportExcel?deviceTypeId=' + this.resetData(this.get_params.deviceTypeId) + '&assetsName=' + this.resetData(this.get_params.assetsName) + '&systemId=' + this.resetData(this.get_params.systemId) + '&pcSystemVersion=' + this.resetData(this.get_params.pcSystemVersion) + '&softwareVersion=' + this.resetData(this.get_params.softwareVersion) + '&pcSystem=' + this.resetData(this.get_params.pcSystem) + '&ip=' + this.resetData(this.get_params.ip) + '&name=' + this.resetData(this.get_params.name)
        },
        header() {
            return { token: this.$getlocalStorage('initInfo').user.token }
        }
    },
    watch: {

        addDomainDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    try {
                        this.$refs.deviceForm.resetFields()
                    } catch (e) {
                        console.log(e)
                    }
                    this.deviceForm = {
                        groupId: null,
                        manufacturerId: '',
                        modelInfo: '',
                        pcSystemVersion: '',
                        isBoundary: '1',
                        deviceName: '',
                        uniqueCode: '',
                        deviceTypeId: '',
                        subnetMask: '',
                        pcSystem: '',
                        systemId: [],
                        zoneId: '', // 安全域名
                        safetyBoundary: '', // 安全边界
                        isDomestic: '1', // 是否国产
                        labelId: '',
                        extendAttr: [],
                        systemAttr: this.$deepCopy(this.systemAttr)
                    }
                    this.existIp = ''
                    this.deviceForm.ipsv4 = []
                    this.deviceForm.ipsv6 = []
                    this.deviceForm.applications = []
                    this.deviceForm.users = []
                }
            }
        },
        editUserDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.existIp = ''
                    this.assetsFormEdit.ipsv4 = []
                    this.assetsFormEdit.ipsv6 = []
                    this.assetsFormEdit.applications = []
                    this.assetsFormEdit.users = []
                }
            }
        },
        filterText(val) {
            this.$refs['asset-tree'].filter(val)
        }
    },
    created() {
        // console.log('leakSoft',this.getUrlSearch('leakSoft'));
        // console.log('softwareVersion',this.getUrlSearch('softwareVersion'));
        // if(this.getUrlSearch('leakSoft') != null || this.getUrlSearch('softwareVersion') != null || this.getUrlSearch('device_ip') != null){
        this.get_params.software = this.getUrlSearch('leakSoft')
        this.get_params.app_version = this.getUrlSearch('softwareVersion')
        this.get_params.ip = this.getUrlSearch('device_ip')
        // this.isOpen = true;
        // }
        // this.get_data();
        console.log(this.$route.query.ip, 'ip')
        if (this.$route.query?.ip) {
            this.get_params.ip = this.$route.query.ip
        }
    },
    mounted() {
        console.log('provinceAndCityData', provinceAndCityData)
        this.$nextTick(() => {
            this.get_all_zoneIds()
            this.getTypes()
            this.getSystems()
            this.getManufacturer()
            this.initUser()
            this.getHeader()
            this.initTree()
            this.getAssetLabels()
            this.getSystemAttr()
            this.getFindGroup()
            this.getSortFieldFn()
            this.initLevel()
        })
    },
    methods: {
        initLevel() {
            getOrgLevel({
                queryData: {},
                paramsData: {}
            }).then(res => {
                console.log('tree', res)
                this.orgLevelList = []
                for (let i = 1; i < Number(res) + 1; i++) {
                    this.orgLevelList.push({
                        label: `级别${i}`,
                        value: i
                    })
                }
            }).catch(error => {
                console.log('error' + error)
            })
        },
        handleAddVendor() {
            this.$router.push('/assets/assets_asset_store')
        },
        getCustomTime(val, isChartTime) {
            this.customTime = val
            console.log('时间', val)
        },
        getDateData(date, mode, useDate, useIndex) {
            this.dateData = date
            this.dateMode = mode
            this.useDate = useDate
            this.useIndex = useIndex
        },
        customDateUse() {
        },
        getSortFieldFn() {
            getSortFieldAssets({ queryData: {}, paramsData: {}}).then(res => {
                console.log(res)
                this.sortFieldObj = res
            })
        },
        treeCheck(node, list) {
            console.log(node)
            this.currentNode = node
            this.currentNodeData = this.$refs['asset-tree'].getCheckedNodes()
            if (this.currentNodeData.length > 0) {
                this.get_params.zoneIds = this.currentNodeData.filter(item => {
                    return item.flag == 1
                }).map(val => val.id)
                this.get_params.deviceTypeIds = this.currentNodeData.filter(item => {
                    return item.flag == 2
                }).map(val => val.id)
                this.get_params.systemIds = this.currentNodeData.filter(item => {
                    return item.flag == 3
                }).map(val => val.id)
                this.get_params.orgIds = this.currentNodeData.filter(item => {
                    return item.flag == 4
                }).map(val => val.id)
                this.get_params.groupIds = this.currentNodeData.filter(item => {
                    return item.flag == 5
                }).map(val => val.id)
            } else {
                this.get_params.zoneIds = []
                this.get_params.deviceTypeIds = []
                this.get_params.systemIds = []
                this.get_params.orgIds = []
                this.get_params.groupIds = []
            }
            console.log(this.currentNodeData)
            this.initParams()
            this.get_data()
            // if (list.checkedKeys.length == 2) {
            //     this.$refs['asset-tree'].setCheckedKeys([node.PHY_ID])
            //     this.currentNode = { id: '' }
            // }
        },
        handleDeleteGroupFun() {
            let data = {
                queryData: {},
                paramsData: {
                    id: this.currentNode.id
                }
            }
            deleteGroup(data).then(res => {
                this.delGroupDialog = false
                console.log('删除成功')
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.initTree()
                    this.get_data()
                }, 1500)
            }).catch(error => {
                console.log(error + 'error')
            })
        },
        getFindGroup() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            findGroup(data).then(res => {
                this.groupList = res
            }).catch(error => {
                console.log('error' + error)
            })
        },
        submitGroupForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.addGroupFun()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        addGroupFun() {
            let data = {
                queryData: {},
                paramsData: {
                    id: this.addGroupForm.id,
                    name: this.addGroupForm.name,
                    parentId: this.addGroupForm.parentId
                }
            }
            saveGroup(data).then(res => {
                this.addGroupDialog = false
                if (this.addGroupForm.id) {
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    })
                } else {
                    this.$message({
                        message: '已添加到全部组内',
                        type: 'success'
                    })
                }
                setTimeout(() => {
                    this.initTree()
                }, 1500)
            }).catch(error => {
                console.log(error + 'error')
            })
        },
        addRuleShow() {
            this.addGroupForm.id = ''
            this.addGroupForm.name = ''
            this.addGroupForm.parentId = null
            this.addGroupDialog = true
        },
        editRuleShow() {
            let selects = this.$refs['asset-tree'].getCheckedKeys()
            console.log(selects)
            if (selects.length === 0) {
                this.$message({
                    message: '请选择可以勾选的分组',
                    type: 'warning'
                })
                return
            }
            this.addGroupForm.id = this.currentNode.id
            this.addGroupForm.name = this.currentNode.name
            this.addGroupForm.parentId = this.currentNode.parentId == '' ? null : this.currentNode.parentId
            if (this.currentNode.flag && this.currentNode.flag == 5) {
                this.addGroupDialog = true
            } else {
                this.$message({
                    message: '请选择可以勾选的分组',
                    type: 'warning'
                })
            }
        },
        delRuleShow() {
            let selects = this.$refs['asset-tree'].getCheckedKeys()
            if (selects.length === 0) {
                this.$message({
                    message: '请选择可以勾选的分组',
                    type: 'warning'
                })
                return
            }
            if (this.currentNode.flag && this.currentNode.flag == 5) {
                this.delGroupDialog = true
            } else {
                this.$message({
                    message: '请选择可以勾选的分组',
                    type: 'warning'
                })
            }
        },
        goSee(data, val) {
            console.log(data)
            if (data.ips.length > 0) {
                this.$refs.assetsDetailDrawer.ipsData = data.ips.map(item => item.assetsIp)
            }
            this.activeName = val
            this.drawerSeeDialog = true
            this.$refs.assetsDetailDrawer.assetsId = data.id
            this.$refs.assetsDetailDrawer.infoData = data
        },
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex % 2) {
                return 'table-row2'
            } else {
                return 'table-row1'
            }
        },
        handleClose(done) {
            // this.$confirm('确认关闭？')
            //     .then(_ => {
            this.addDomainDialog = false
            this.editUserDialog = false
            //         done()
            //     })
            //     .catch(_ => {})
        },
        reset() {
            this.get_params = {
                page: 1,
                size: 20,
                ip: '',
                deviceTypeIds: [],
                assetsName: '',
                systemIds: [],
                orgIds: [],
                system: '',
                version: '',
                software: '',
                app_version: '',
                zoneIds: [],
                groupIds: [],
                orgLevel: ''
            }
            this.$refs['asset-tree'].setCheckedKeys([])
            this.get_data()
        },
        isOpen(val) {
            console.log(val)
            this.kaiguan = val
        },
        getStyle() {
            console.log(window.screen.width)
            let ws = window.screen.width
            if (ws >= 1680) {
                return {
                    width: '400px'
                }
            } else if (ws < 1680) {
                return {
                    width: '200px'
                }
            }
        },
        getSystemAttr() {
            get_asset_system_attr({
                queryData: {},
                paramsData: {}
            }).then(res => {
                console.log('系统属性', res)
                this.systemAttr = res ?? []
                this.deviceForm.systemAttr = this.$deepCopy(this.systemAttr)
            }).catch(error => {
                console.log('error' + error)
            })
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
        checkSelect(row, index) {
            let isChecked = true
            if (row.isExtend === false) { // 判断里面是否存在某个参数
                isChecked = true
            } else {
                isChecked = false
            }
            return isChecked
        },
        initTree() {
            get_asset_info_tree({
                queryData: {},
                paramsData: {}
            }).then(res => {
                console.log('资产树', res)
                if (this.isFirst) {
                    /* this.depId = res[0].id;
                    this.initId = res[0].id;
                    this.currentNode.id = res[0].id;*/
                    this.get_data()
                }
                this.isFirst = false
                // this.isClick = false;
                this.assetTreeData = res
            }).then(() => {
                this.$refs['asset-tree'].setCurrentKey(this.depId)
                this.isClick = true
            }).catch(error => {
                console.log('error' + error)
            })
        },
        setTreeDisabled(arr) {
            arr.forEach((item) => {
                if (!item.flag) {
                    item.disabled = true
                    // that.$set(item, 'disabled', false)
                    return
                }
                this.loopMuduleTreeDisabled(item.children)
            })
        },

        filterNode(value, data) {
            console.log(value, data)
            if (!value) return true
            return data.name.indexOf(value) !== -1
        },
        initParams() {
            this.get_params.page = 1
            this.get_params.size = 20
            this.total_num = 0
        },
        searchCheck() {
            this.get_params.page = 1
            this.get_data()
        },
        handleNodeClick(node) {
            /* 清除参数*/
            // this.get_params.deviceTypeId = ''
            // this.get_params.zoneId = ''
            // this.get_params.systemId = ''
            // this.get_params.orgId = ''

            // switch (node.flag) {
            //     case 1:
            //         this.get_params.zoneId = node.id
            //         break
            //     case 2:
            //         this.get_params.deviceTypeId = node.id
            //         break
            //     case 3:
            //         this.get_params.systemId = node.id
            //         break
            //     case 4:
            //         this.get_params.orgId = node.id
            //         break
            //     default:
            //         break
            // }
            // if (!node.flag && node.id === 'aqy') {
            //     this.get_params.zoneId = 'all'
            // } else if (!node.flag && node.id === 'ywxt') {
            //     this.get_params.systemId = 'all'
            // }
            console.log(node)
            this.currentNode = node
            if (this.isClick) {
                this.currentNodeId = node.id
            }
            // this.$refs['asset-tree'].setCurrentKey(node.id)
            // this.$refs['asset-tree'].setCheckedNodes([node])

            this.depId = node.id
        },

        /* 资产*/
        initUser() {
            this.users = []
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_asset_users(data).then(res => {
                console.log('获取所有用户', res)
                if (res.length > 0) {
                    res.forEach(item => {
                        let obj = {}
                        obj.value = item.id
                        obj.label = item.chineseName
                        obj.phone = item.phone
                        obj.depName = item.depName
                        obj.mailbox = item.mailbox
                        obj.code = item.code
                        obj.landline = item.landline
                        obj.depId = item.depId
                        this.users.push(obj)
                    })
                }
            }).catch(error => {
                console.log('error' + error)
            })
        },
        getAssetLabels() {
            get_asset_label({
                queryData: {},
                paramsData: {}
            }).then(res => {
                console.log(res, '标签')
                if (res && res.length) {
                    this.assetLabelList = res
                }
            }).catch(err => {
                console.log('err' + err)
            })
        },
        changeHeader() {
            console.log(this.checkList)
            let vm = this
            clearTimeout(this.headerTimer)
            this.headerTimer = setTimeout(function() {
                vm.updateHeader()
            }, 3000)
        },
        getHeader() {
            this.checkList = []
            let data = {
                queryData: {},
                paramsData: {
                    menuTag: 6
                }
            }
            get_header_list(data).then(res => {
                console.log(res)
                if (res) {
                    this.checkList = res.field
                    this.checkListAll = res.allField
                }
            }).catch(err => {
                console.log('err' + err)
            })
        },
        updateHeader() {
            let data = {
                queryData: {},
                paramsData: {
                    menuTag: '6',
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
                资产名称: 'device_name',
                资产标识: 'uniqueCode',
                资产标签: 'labelName',
                资产类型: 'device_type_name',
                厂商: 'manufacturer_name',
                型号: 'modelInfo',
                操作系统: 'pc_system',
                是否边界: 'isBoundaryCN',
                是否国产: 'is_domestic',
                业务系统: 'system_name',
                所属安全域: 'zoneName',
                IP: 'ip',
                端口: 'port',
                创建时间: 'create_time',
                资产联系人: 'systemUsers'
            }
            let newArr = []
            arr.forEach(item => {
                if (obj[item]) {
                    newArr.push(obj[item])
                }
            })

            return newArr
        },
        changeUser(row) {
            let selected = this.users.filter(item => item.value === row.userId)
            console.log('selected', selected)
            if (selected.length > 0) {
                row.phone = selected[0].phone
                row.departmentName = selected[0].depName
                row.mailBox = selected[0].mailbox
                row.code = selected[0].code
                row.landline = selected[0].landline
                row.depId = selected[0].depId
            } else {
                row.phone = ''
                row.departmentName = ''
                row.mailBox = ''
                row.code = ''
                row.landline = ''
                row.depId = ''
            }
        },
        resetData(val) {
            if ((val + '' === '') || (val == null) || (val == undefined) || (val == 'undefined')) {
                return ''
            } else {
                return val
            }
        },
        downData() {
            let data = {
                queryData: {
                },
                paramsData: {
                    groupIds: this.get_params.groupIds,
                    orgIds: this.get_params.orgIds,
                    zoneIds: this.get_params.zoneIds,
                    deviceTypeIds: this.get_params.deviceTypeIds,
                    assetsName: this.resetData(this.get_params.assetsName),
                    systemIds: this.get_params.systemIds,
                    pcSystemVersion: this.resetData(this.get_params.pcSystemVersion),
                    softwareVersion: this.resetData(this.get_params.softwareVersion),
                    pcSystem: this.resetData(this.get_params.pcSystem),
                    ip: this.resetData(this.get_params.ip),
                    name: this.resetData(this.get_params.name),
                    orgLevel: this.get_params.orgLevel
                }
            }
            exportExcel1(data).then(res => {
                console.log(res)
            })
        },
        downLoad() {
            // window.location.href = '/api/assets-manage/manage/assets/template'
            template({ queryData: {}, paramsData: {}}).then(res => {
                console.log(res)
            })
        },
        handleSuccess(response, file, fileList) {
            console.log('response', response)
            if (response.code == 1) {
                this.$message({
                    message: '文件上传成功!',
                    type: 'success'
                })
                this.get_data()
            } else {
                this.$message({
                    message: response.message,
                    type: 'warning'
                })
            }
        },
        getUrlSearch(name) {
            // 未传参，返回空
            if (!name) return null
            // 查询参数：先通过search取值，如果取不到就通过hash来取
            var after = window.location.search
            after = after.substr(1) || window.location.hash.split('?')[1]
            // 地址栏URL没有查询参数，返回空
            if (!after) return null
            // 如果查询参数中没有"name"，返回空
            if (after.indexOf(name) === -1) return null

            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
            // 当地址栏参数存在中文时，需要解码，不然会乱码
            var r = decodeURI(after).match(reg)
            // 如果url中"name"没有值，返回空
            if (!r) return null

            return r[2]
        },
        handleRefresh() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            refresh_assetsSummary(data).then(res => {
                this.$message({
                    message: '刷新成功！',
                    type: 'success'
                })
            }).catch(error => {
                console.log('error' + error)
            })
        },
        get_all_zoneIds() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_all_zoneIds(data).then(res => {
                if (res.length > 0) {
                    res.forEach(item => {
                        let obj = {}
                        obj.value = item.id
                        obj.label = item.zoneName
                        this.zoneIds.push(obj)
                    })
                }
            }).catch(error => {
                console.log('error' + error)
            })
        },
        indexMatchUserMethod(index) {
            return (this.hole_params.page - 1) * this.hole_params.size + index + 1
        },
        indexAlarmMethod(index) {
            return (this.alarm_params.page - 1) * this.alarm_params.size + index + 1
        },
        indexMatchThreatMethod(index) {
            return (this.threat_params.page - 1) * this.threat_params.size + index + 1
        },
        handleAlarm(row) {
            this.alarm_params.page = 1
            this.alarm_ips = []
            if (row.ips.length > 0) {
                row.ips.forEach(item => {
                    this.alarm_ips.push(item.assetsIp)
                })
            }
            this.alarm.name = row.device_name
            this.alarmDialog = true
            this.initAlarms(this.alarm_ips)
        },
        initAlarms(ips) {
            this.alarm_loading = true
            this.alarm.data = []
            let data = {
                queryData: {
                    page: this.alarm_params.page,
                    pageSize: this.alarm_params.size
                },
                paramsData: {
                    ips: ips
                }
            }
            getAlarmsByIp(data).then(res => {
                console.log('关联事件', res)
                this.alarm_loading = false
                this.alarm_total_num = res.total
                let list = res.records
                if (list.length > 0) {
                    list.forEach(item => {
                        let obj = {}
                        obj.id = item.id
                        obj.alarm_from = item.reportFrom == 1 ? '自动' : '手动'
                        obj.reportFrom = item.reportFrom
                        obj.reportName = item.reportName
                        obj.reportDesc = item.reportDesc
                        obj.createTime = item.createTime
                        obj.reportType = item.reportType
                        obj.reportTypeName = item.reportTypeName
                        obj.reportLevel = item.reportLevel
                        obj.reportStatus = item.reportStatus
                        obj.asset = item.assetName
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
                        obj.msg = item.msg ? item.msg : ''
                        obj.reportFrom = item.reportFrom
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

                        this.alarm.data.push(obj)
                    })
                }
            }).catch(error => {
                this.alatm_loading = false
                console.log('error' + error)
            })
        },
        handleSee(obj) {
            // console.log(obj.ips)
            this.hole_params.page = 1
            this.hole_id = obj.id
            /* this.hole_ips = [];
            if (obj.ips.length > 0) {
                obj.ips.forEach(item => {
                    this.hole_ips.push(item.assetsIp)
                })
            }*/
            this.hole.name = obj.device_name
            this.holeDialog = true
            this.initLoop(obj.id)
        },

        initLoop(id) {
            this.loop_loading = true
            this.hole.data = []
            let data = {
                queryData: {
                    page: this.hole_params.page,
                    pageSize: this.hole_params.size
                },
                paramsData: {
                    assetsId: id
                }
            }
            getScanLeakByIp(data).then(res => {
                console.log('关联漏洞', res)
                this.loop_loading = false
                this.hole_total_num = res.total
                let list = res.records
                if (list.length > 0) {
                    list.forEach(item => {
                        let obj = {}
                        obj.id = item.id
                        obj.nodeName = item.nodeName
                        obj.leakType = item.leakType + ''
                        obj.typeCN = item.typeCN
                        obj.riskLevel = item.riskLevel
                        obj.levelCN = item.levelCN
                        obj.createTime = item.createTime
                        obj.bugtraqCode = item.bugtraqCode
                        obj.cncveTag = item.cncveTag
                        obj.cnnvdCode = item.cnnvdCode
                        obj.cnvdCode = item.cnvdCode
                        obj.cvss = item.cvss
                        obj.cveCode = item.cveCode
                        obj.isIndustry = item.isIndustry
                        obj.isIndustryCN = item.isIndustryCN
                        obj.outlineDes = item.outlineDes
                        obj.restorationDes = item.restorationDes
                        obj.detailDes = item.detailDes
                        obj.files = item.atts
                        this.hole.data.push(obj)
                    })
                }
            }).catch(error => {
                this.loop_loading = false
                console.log('error' + error)
            })
        },
        getSystems() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            getSystemType(data).then(res => {
                console.log(res)
                this.systems = res
            }).catch(error => {
                this.loading = false
                console.log('error' + error)
            })
        },
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        onFocus() {
            this.existIp = ''
        },
        addIpv4(type, num) {
            if (type == 'add') {
                if (num === 4) {
                    this.deviceForm.ipsv4.push({
                        ip: '',
                        port: '',
                        mac: '',
                        mask: '',
                        gateway: '',
                        ipType: 1
                    })
                } else if (num === 6) {
                    this.deviceForm.ipsv6.push({
                        ip: '',
                        port: '',
                        mac: '',
                        mask: '',
                        gateway: '',
                        ipType: 2
                    })
                }
            } else {
                if (num === 4) {
                    this.assetsFormEdit.ipsv4.push({
                        ip: '',
                        port: '',
                        mac: '',
                        mask: '',
                        gateway: '',
                        ipType: 1
                    })
                } else if (num === 6) {
                    this.assetsFormEdit.ipsv6.push({
                        ip: '',
                        port: '',
                        mac: '',
                        mask: '',
                        gateway: '',
                        ipType: 2
                    })
                }
            }
        },
        deleteIp(type, index, num) {
            if (type == 'add') {
                if (num === 4) {
                    this.deviceForm.ipsv4.splice(index, 1)
                } else {
                    this.deviceForm.ipsv6.splice(index, 1)
                }
            } else {
                if (num === 4) {
                    this.assetsFormEdit.ipsv4.splice(index, 1)
                } else {
                    this.assetsFormEdit.ipsv6.splice(index, 1)
                }
            }
        },
        addPrevDevice() {
            this.upstreamVoList.push({
                state: '1',
                value: ''
            })
        },
        addApplication(type) {
            if (type == 'add') {
                this.deviceForm.applications.push({
                    name: '',
                    softwareVersion: '',
                    innerPort: '',
                    outerPort: ''
                })
            } else {
                this.assetsFormEdit.applications.push({
                    name: '',
                    softwareVersion: '',
                    innerPort: '',
                    outerPort: ''
                })
            }
        },
        addUsers(type) {
            if (type == 'add') {
                console.log(this.deviceForm.users)
                this.deviceForm.users.push({
                    userId: '',
                    departmentName: '',
                    mailBox: '',
                    phone: '',
                    code: '',
                    landline: '',
                    depId: ''
                })
            } else {
                // console.log(this.assetsFormEdit)
                this.assetsFormEdit.users.push({
                    userId: '',
                    departmentName: '',
                    mailBox: '',
                    phone: '',
                    code: '',
                    landline: '',
                    depId: ''
                })
            }
        },
        deleteApplication(type, index) {
            if (type == 'add') {
                this.deviceForm.applications.splice(index, 1)
            } else {
                this.assetsFormEdit.applications.splice(index, 1)
            }
        },
        deleteUsers(type, index) {
            if (type == 'add') {
                this.deviceForm.users.splice(index, 1)
            } else {
                this.assetsFormEdit.users.splice(index, 1)
            }
        },
        deletePrevDevice(index) {
            this.upstreamVoList.splice(index, 1)
        },

        getManufacturer() {
            this.types = []
            let data = {
                queryData: {},
                paramsData: {}
            }
            getAllManufacturer(data).then(res => {
                console.log(res)
                if (res.length > 0) {
                    res.forEach(item => {
                        let obj = {}
                        obj.id = item.id
                        obj.name = item.name
                        this.storeOp.push(obj)
                    })
                }
            }).catch(error => {
                console.log('error' + error)
            })
        },
        getTypes() {
            this.types = []
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_types(data).then(res => {
                console.log(res)
                this.treeData = res
            }).catch(error => {
                this.loading = false
                console.log('error' + error)
            })
        },

        searchAssets() {
            this.get_params.page = 1
            this.get_data()
        },
        getSearchParams() {
            return {
                queryData: {
                    page: this.get_params.page,
                    pageSize: this.get_params.size
                },
                paramsData: {
                    deviceTypeIds: this.get_params.deviceTypeIds,
                    assetsName: this.get_params.assetsName,
                    systemIds: this.get_params.systemIds,
                    pcSystemVersion: this.get_params.version,
                    softwareVersion: this.get_params.app_version,
                    pcSystem: this.get_params.system,
                    ip: this.get_params.ip,
                    name: this.get_params.software,
                    zoneIds: this.get_params.zoneIds,
                    orgIds: this.get_params.orgIds,
                    groupIds: this.get_params.groupIds,
                    startTime: this.customTime.length ? this.customTime[0] : '',
                    endTime: this.customTime.length ? this.customTime[1] : '',
                    orgLevel: this.get_params.orgLevel,
                    time: this.$getsessionStorage('temporaryAssets').actualTime ? this.$getsessionStorage('temporaryAssets').actualTime : this.dateData,
                    timeStatus: this.$getsessionStorage('temporaryAssets').timeUnit ? this.$getsessionStorage('temporaryAssets').timeUnit : ''
                }
            }
        },
        get_data() {
            let uid = this.config_id = new Date().getTime()
            this.loading = true
            this.tableData = []
            let data = {
                queryData: {
                    page: this.get_params.page,
                    pageSize: this.get_params.size
                },
                paramsData: {
                    deviceTypeIds: this.get_params.deviceTypeIds,
                    assetsName: this.get_params.assetsName,
                    systemIds: this.get_params.systemIds,
                    pcSystemVersion: this.get_params.version,
                    softwareVersion: this.get_params.app_version,
                    pcSystem: this.get_params.system,
                    ip: this.get_params.ip,
                    name: this.get_params.software,
                    zoneIds: this.get_params.zoneIds,
                    orgIds: this.get_params.orgIds,
                    groupIds: this.get_params.groupIds,
                    startTime: this.customTime.length ? this.customTime[0] : '',
                    endTime: this.customTime.length ? this.customTime[1] : '',
                    orgLevel: this.get_params.orgLevel
                }
            }
            get_assets(data).then(res => {
                if (this.config_id != uid) {
                    return
                }
                this.loading = false
                this.total_num = res.total
                let list = res.records
                if (list.length > 0) {
                    list.forEach(item => {
                        let obj = {}
                        obj.id = item.id
                        obj.device_name = item.deviceName
                        obj.create_time = item.createTime
                        obj.device_type_name = item.deviceTypeName
                        obj.device_type_id = item.deviceTypeId
                        obj.ips = []
                        obj.ports = []
                        obj.systemId = []
                        obj.system_name = []
                        if (item.ips && item.ips.length > 0) {
                            item.ips.forEach(_item => {
                                let port = []
                                if (_item.ports.length > 0) {
                                    _item.ports.forEach(val => {
                                        port.push(val.port)
                                    })
                                }
                                obj.ips.push({
                                    assetsIp: _item.assetsIp,
                                    gateway: _item.gateway,
                                    ipType: _item.ipType,
                                    mac: _item.mac,
                                    mask: _item.subnetMask,
                                    port: port,
                                    ports: port.join(',')
                                })
                            })
                        }
                        if (item.systemObj && item.systemObj.length > 0) {
                            item.systemObj.forEach(_item => {
                                obj.systemId.push(_item.systemId)
                                obj.system_name.push(_item.systemName)
                            })
                        }
                        obj.ips.forEach(_item => {
                            obj.ports.push(_item.ports)
                        })
                        obj.ipsv4 = obj.ips.filter(item => item.ipType == 1)
                        obj.ipsv6 = obj.ips.filter(item => item.ipType == 2)
                        obj.pc_system = item.pcSystem
                        obj.subnet_mask = item.subnetMask
                        obj.is_boundary = item.isBoundary
                        obj.is_domestic = item.isDomestic
                        obj.label_id = item.labelId
                        obj.isBoundaryCN = item.isBoundaryCN
                        obj.labelName = item.labelName
                        obj.is_domestic = item.isDomestic
                        obj.domainList = item.domainList
                        // obj.systemObj = item.systemObj
                        obj.zone_id = item.zoneId
                        obj.zoneName = item.zoneName
                        obj.safety_boundary = item.safetyBoundary
                        obj.safetyBoundaryCN = item.safetyBoundaryCN
                        obj.sftnum = item.sftnum
                        obj.assetsSoftwares = item.assetsSoftwares
                        obj.ldNum = item.ldNum
                        obj.qbNum = item.qbNum
                        obj.gjNum = item.gjNum
                        obj.manufacturerId = item.manufacturerId
                        obj.manufacturer_name = item.manufacturerName
                        obj.modelInfo = item.modelInfo
                        obj.pcSystemVersion = item.pcSystemVersion
                        obj.uniqueCode = item.uniqueCode
                        obj.attr = item.attr ? item.attr : []
                        obj.sysAttr = item.sysAttr ? item.sysAttr : []
                        obj.isInstall = item.isInstall
                        obj.virusVersion = item.virusVersion
                        obj.sjNum = item.sjNum
                        obj.gjNum = item.gjNum
                        obj.rzNum = item.rzNum
                        obj.ldNum = item.ldNum
                        obj.groupId = item.groupId
                        obj.fullStatus = item.fullStatus
                        obj.usableStatus = item.usableStatus
                        obj.secretStatus = item.secretStatus

                        obj.systemUsers = []
                        // if (item.sysAttr && item.sysAttr.length > 0) {
                        //     obj.sysAttr = item.sysAttr.map(cell => {
                        //         if (cell.type == 10) {
                        //             return {
                        //                 id: cell.id,
                        //                 items: cell.items,
                        //                 name: cell.name,
                        //                 type: cell.type,
                        //                 val: cell.val.substr(1, cell.val.length - 2).split(',')
                        //             }
                        //         } else {
                        //             return {
                        //                 id: cell.id,
                        //                 items: cell.items,
                        //                 name: cell.name,
                        //                 type: cell.type,
                        //                 val: cell.val
                        //             }
                        //         }
                        //     })
                        // }
                        if (item.userList && item.userList.length > 0) {
                            obj.systemUsers = this.$deepCopy(item.userList)
                        }
                        this.tableData.push(obj)
                    })
                    console.log('this.tableData', this.tableData)
                }
            }).catch(error => {
                this.loading = false
                console.log('error' + error)
            })
        },
        handleNodeClick_add(node) {
            console.log(node)
            // this.depId = node.id;
            this.deviceForm.extendAttr = node.attr.map(item => {
                return {
                    id: item.id,
                    name: item.name,
                    type: item.type,
                    val: '',
                    items: item.items
                }
            })
            this.innerValue_add = node.id
            this.deviceForm.deviceTypeId = node.id
            this.innerLabel_add = node.name
            console.log(this.deviceForm.extendAttr, '1212121')
            this.$refs['add-select'].blur()
        },
        handleNodeClick_search(node) {
            console.log(node)
            // this.depId = node.id;
            this.innerValue_search = node.id
            this.get_params.deviceTypeId = node.id
            this.innerLabel_search = node.name
        },
        handleNodeClick_edit(node) {
            console.log(node)
            // this.depId = node.id;
            this.assetsFormEdit.extendAttr = node.attr.map(item => {
                return {
                    id: item.id,
                    name: item.name,
                    type: item.type,
                    val: '',
                    items: item.items
                }
            })
            this.innerValue_edit = node.id
            this.assetsFormEdit.deviceTypeId = node.id
            this.innerLabel_edit = node.name
            this.$refs['edit-select'].blur()
        },
        addUser() {
            this.addDomainDialog = true
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.beforeHandel(true)
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        beforeHandel(isAdd) {
            let ips = []
            let ckeckIp = []
            let port = []
            let id = ''
            let allIps = []
            if (isAdd) {
                allIps = this.deviceForm.ipsv4.concat(this.deviceForm.ipsv6)
                if (allIps.length === 0) {
                    this.$message.warning('必须添加ip')
                    return
                }
                allIps.forEach(item => {
                    let obj = {}
                    obj.assetsIp = item.ip
                    obj.subnetMask = item.mask
                    obj.gateway = item.gateway
                    obj.ipType = item.ipType
                    obj.mac = item.mac
                    obj.ports = []
                    port = item.port.split(',')
                    if (port.length > 0) {
                        port.forEach(_item => {
                            obj.ports.push({
                                port: _item
                            })
                        })
                    }
                    ckeckIp.push(item.ip)
                    ips.push(obj)
                })
            } else {
                id = this.assetsFormEdit.id
                allIps = this.assetsFormEdit.ipsv4.concat(this.assetsFormEdit.ipsv6)
                if (allIps.length === 0) {
                    this.$message.warning('必须添加ip')
                    return
                }
                allIps.forEach(item => {
                    let obj = {}
                    obj.assetsIp = item.assetsIp
                    obj.subnetMask = item.mask
                    obj.gateway = item.gateway
                    obj.mac = item.mac
                    obj.ipType = item.ipType
                    obj.ports = []
                    port = item.port.split(',')
                    if (port.length > 0) {
                        port.forEach(_item => {
                            obj.ports.push({
                                port: _item
                            })
                        })
                    }
                    ckeckIp.push(item.assetsIp)
                    ips.push(obj)
                })
            }

            console.log('ips', ips)
            console.log('ckeckIp', ckeckIp)
            let data = {
                queryData: {
                    ips: ckeckIp.join(','),
                    assetsId: id
                },
                paramsData: {

                }
            }
            let empty = {}
            for (let i = 0; i < ips.length; i++) {
                let { assetsIp } = ips[i]
                if (empty[assetsIp]) {
                    this.$message.warning('添加的Ip不能重复')
                    return
                } else {
                    empty[assetsIp] = 1
                }
            }
            checkIP(data).then(res => {
                console.log(1111111111, res)
                if (isAdd) {
                    this.addAssets(ips)
                } else {
                    this.editAssets(ips)
                }
            }).catch(error => {
                // this.addDomainDialog = false
                console.log('error' + error)
            })
        },
        getAttr(data) {
            let val = data.map(item => {
                if (item.type == 10) {
                    return {
                        id: item.id,
                        items: item.items,
                        name: item.name,
                        type: item.type,
                        val: item.val.length > 0 ? `${item.val[0]}-${item.val[1]}` : ''
                    }
                } else {
                    return {
                        id: item.id,
                        items: item.items,
                        name: item.name,
                        type: item.type,
                        val: item.val
                    }
                }
            })
            return val
        },
        addAssets(ips) {
            if (this.deviceForm.systemAttr.length > 0) {
                this.sysAttrData = this.getAttr(this.deviceForm.systemAttr)
            }
            if (this.deviceForm.extendAttr.length > 0) {
                this.attrData = this.getAttr(this.deviceForm.extendAttr)
            }
            let zlSystemIds = []
            if (this.deviceForm.systemId.length > 0) {
                zlSystemIds = this.deviceForm.systemId.map(item => {
                    return {
                        assetsId: '',
                        systemId: item
                    }
                })
            }
            let data = {
                queryData: {},
                paramsData: {
                    manufacturerId: this.deviceForm.manufacturerId,
                    modelInfo: this.deviceForm.modelInfo,
                    pcSystemVersion: this.deviceForm.pcSystemVersion,
                    uniqueCode: this.deviceForm.uniqueCode,
                    isBoundary: this.deviceForm.isBoundary,
                    isDomestic: this.deviceForm.isDomestic,
                    label_id: this.deviceForm.label_id,
                    deviceName: this.deviceForm.deviceName,
                    deviceTypeId: this.deviceForm.deviceTypeId,
                    attr: this.attrData,
                    sysAttr: this.sysAttrData,
                    // subnetMask: this.deviceForm.subnetMask,
                    pcSystem: this.deviceForm.pcSystem,
                    zlSystemIds: zlSystemIds,
                    ips: ips,
                    // upstreamVoList: upstreamVoList,
                    zoneId: this.deviceForm.zoneId,
                    // safetyBoundary: this.deviceForm.safetyBoundary,
                    software: this.deviceForm.applications,
                    users: this.deviceForm.users.map(item => { return { userId: item.userId, depId: item.depId } }),
                    isInstall: this.deviceForm.isInstall,
                    virusVersion: this.deviceForm.virusVersion,
                    groupId: this.deviceForm.groupId,
                    fullStatus: this.deviceForm.fullStatus,
                    usableStatus: this.deviceForm.usableStatus,
                    secretStatus: this.deviceForm.secretStatus
                }
            }
            console.log('addAssets', data)
            add_assets(data).then(res => {
                console.log(res)
                this.addDomainDialog = false
                this.$message({
                    message: '添加成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(error => {
                this.addDomainDialog = false
                console.log('error' + error)
            })
        },
        editAssets(ips) {
            console.log('editAssets', ips)
            if (this.assetsFormEdit.systemAttr.length > 0) {
                this.sysAttrData = this.getAttr(this.assetsFormEdit.systemAttr)
            }
            if (this.assetsFormEdit.extendAttr.length > 0) {
                this.attrData = this.getAttr(this.assetsFormEdit.extendAttr)
            }
            let zlSystemIds = []
            if (this.assetsFormEdit.systemId.length > 0) {
                zlSystemIds = this.assetsFormEdit.systemId.map(item => {
                    return {
                        assetsId: '',
                        systemId: item
                    }
                })
            }
            let data = {
                queryData: {},
                paramsData: {
                    id: this.assetsFormEdit.id,
                    deviceName: this.assetsFormEdit.deviceName,
                    deviceTypeId: this.assetsFormEdit.deviceTypeId,
                    subnetMask: this.assetsFormEdit.subnetMask,
                    pcSystem: this.assetsFormEdit.pcSystem,
                    zlSystemIds: zlSystemIds,
                    isBoundary: this.assetsFormEdit.isBoundary,
                    isDomestic: this.assetsFormEdit.isDomestic,
                    labelId: this.assetsFormEdit.labelId,
                    // ips: ips.join(','),
                    // upstreamVoList: upstreamVoList,
                    zoneId: this.assetsFormEdit.zoneId,
                    safetyBoundary: this.assetsFormEdit.safetyBoundary,
                    // software: this.applications,
                    attr: this.attrData,
                    sysAttr: this.sysAttrData,
                    manufacturerId: this.assetsFormEdit.manufacturerId,
                    modelInfo: this.assetsFormEdit.modelInfo,
                    pcSystemVersion: this.assetsFormEdit.pcSystemVersion,
                    uniqueCode: this.assetsFormEdit.uniqueCode,
                    ips: ips,
                    software: this.assetsFormEdit.applications,
                    users: this.assetsFormEdit.users.map(item => { return { userId: item.userId, depId: item.depId } }),
                    isInstall: this.assetsFormEdit.isInstall,
                    virusVersion: this.assetsFormEdit.virusVersion,
                    groupId: this.assetsFormEdit.groupId,
                    fullStatus: this.assetsFormEdit.fullStatus,
                    usableStatus: this.assetsFormEdit.usableStatus,
                    secretStatus: this.assetsFormEdit.secretStatus
                }
            }
            edit_assets(data).then(res => {
                console.log(res)
                this.editUserDialog = false
                this.$message({
                    message: '修改成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(error => {
                // this.editUserDialog = false
                console.log('error' + error)
            })
        },
        submitFormEdit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.beforeHandel(false)
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        handleSelectionChange(val) {
            console.log(val)
            this.multipleSelection = []
            if (val.length > 0) {
                val.forEach(item => {
                    this.multipleSelection.push(item.id)
                })
            }
        },
        delAllUserBtn() {
            if (this.multipleSelection.length > 0) {
                this.userDeleteAllDialog = true
                this.delIds = this.multipleSelection
            } else {
                this.$message({
                    message: '请选择要删除的资产',
                    type: 'warning'
                })
            }
        },
        delUserBtn(row) {
            this.delIds = [row.id]
            this.userDeleteDialog = true
        },
        handleDelete() {
            let data = {
                queryData: {},
                paramsData: {
                    ids: this.delIds
                }
            }
            delete_asset(data).then(res => {
                this.userDeleteDialog = false
                this.userDeleteAllDialog = false

                console.log('删除成功')
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(error => {
                this.userDeleteDialog = false
                this.userDeleteAllDialog = false
                console.log(error + 'error')
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
        handleSizeChangeAlarm(val) {
            this.alarm_params.size = val
            this.initAlarms(this.alarm_ips)
        },
        handleCurrentChangeAlarm(val) {
            this.alarm_params.page = val
            this.initAlarms(this.alarm_ips)
        },
        handleSizeChangeLoop(val) {
            this.hole_params.size = val
            this.initLoop(this.hole_id)
        },
        handleCurrentChangeLoop(val) {
            this.hole_params.page = val
            this.initLoop(this.hole_id)
        },
        handleSizeChangeThreat(val) {
            this.threat_params.size = val
            this.init_threatData(this.threatId)
        },
        handleCurrentChangeThreat(val) {
            this.threat_params.page = val
            this.init_threatData(this.threatId)
        },
        handleEdit(row) {
            console.log('row', row)
            let allIps = row.ipsv6.concat(row.ipsv4)
            if (allIps.length > 0) {
                allIps.forEach(item => {
                    if (Array.isArray(item.port)) {
                        item.port = item.port.join(',')
                    }
                })
            }
            if (row.sysAttr.length > 0) {
                this.sysAttrData = row.sysAttr.map(item => {
                    if (item.type == 10) {
                        return {
                            id: item.id,
                            items: item.items,
                            name: item.name,
                            type: item.type,
                            val: item.val ? item.val.split('-') : []
                        }
                    } else {
                        return {
                            id: item.id,
                            items: item.items,
                            name: item.name,
                            type: item.type,
                            val: item.val
                        }
                    }
                })
            }
            if (row.sysAttr.length > 0) {
                this.attrData = row.attr.map(item => {
                    if (item.type == 10) {
                        return {
                            id: item.id,
                            items: item.items,
                            name: item.name,
                            type: item.type,
                            val: item.val ? item.val.split('-') : []
                        }
                    } else {
                        return {
                            id: item.id,
                            items: item.items,
                            name: item.name,
                            type: item.type,
                            val: item.val
                        }
                    }
                })
            }
            console.log(this.sysAttrData)
            this.assetsFormEdit = {
                id: row.id,
                isBoundary: row.is_boundary + '',
                isDomestic: row.is_domestic + '',
                labelId: row.label_id,
                deviceName: row.device_name,
                deviceTypeId: row.device_type_id,
                subnetMask: row.subnet_mask,
                pcSystem: row.pc_system,
                systemId: row.systemId,
                zoneId: row.zone_id, // 安全域名
                safetyBoundary: row.safety_boundary, // 安全边界

                manufacturerId: row.manufacturerId,
                modelInfo: row.modelInfo,
                pcSystemVersion: row.pcSystemVersion,
                uniqueCode: row.uniqueCode,
                ipsv4: this.$deepCopy(row.ipsv4),
                ipsv6: this.$deepCopy(row.ipsv6),
                applications: row.assetsSoftwares,
                users: [],
                extendAttr: this.attrData,
                systemAttr: this.sysAttrData,
                groupId: row.groupId == '' ? null : row.groupId,
                isInstall: row.isInstall,
                virusVersion: row.virusVersion,
                fullStatus: row.fullStatus,
                usableStatus: row.usableStatus,
                secretStatus: row.secretStatus

            }
            row.systemUsers.forEach(item => {
                this.assetsFormEdit.users.push({
                    userId: item.userId,
                    phone: item.phone,
                    departmentName: item.departmentName,
                    chineseName: item.chineseName,
                    mailBox: item.mailBox,
                    code: item.code,
                    landline: item.landline,
                    depId: item.depId
                })
            })
            this.innerLabel_edit = row.device_type_name
            this.innerValue_edit = row.device_type_id

            this.editUserDialog = true
        },
        handleDetail(row) {
            console.log('row', row)
            let allIps = row.ipsv6.concat(row.ipsv4)
            if (allIps.length > 0) {
                allIps.forEach(item => {
                    if (Array.isArray(item.port)) {
                        item.port = item.port.join(',')
                    }
                })
            }
            this.assetsFormEdit = {
                id: row.id,
                deviceName: row.device_name,
                deviceTypeId: row.device_type_id,
                subnetMask: row.subnet_mask,
                pcSystem: row.pc_system,
                systemId: row.systemId,
                zoneId: row.zone_id, // 安全域名
                safetyBoundary: row.safety_boundary, // 安全边界
                ipsv4: this.$deepCopy(row.ipsv4),
                ipsv6: this.$deepCopy(row.ipsv6),
                system_name: row.system_name,
                device_type_name: row.device_type_name,
                zoneName: row.zoneName,
                manufacturerId: row.manufacturerId,
                manufacturer_name: row.manufacturer_name,
                modelInfo: row.modelInfo,
                pcSystemVersion: row.pcSystemVersion,
                uniqueCode: row.uniqueCode,

                applications: row.assetsSoftwares,
                users: row.systemUsers
            }

            this.seeDialog = true
        },
        handleView(row) {
            this.$setsessionStorage('assetsInfo', row)
            this.$router.push({
                path: this.$route.path + '/tp',
                query: {
                    id: ''
                }
            })
        },
        handleThreaMeaage(row) {
            this.threat_name = row.device_name
            this.threatDialog = true
            this.threatId = row.id
            this.init_threatData(this.threatId)
        },
        init_threatData(id) {
            this.threat_loading = true
            this.threatData = []
            let data = {
                queryData: {
                    page: this.threat_params.page,
                    pageSize: this.threat_params.size
                },
                paramsData: {
                    id: id
                }
            }
            get_threatData(data).then(res => {
                console.log('13234', res)
                this.threat_loading = false
                this.threat_total_num = res.total
                let list = res.records
                if (list.length > 0) {
                    list.forEach(item => {
                        let obj = {}
                        obj.id = item.id
                        obj.content = item.content
                        obj.sourcesCN = item.sourcesCN
                        obj.typeCN = item.typeCN
                        obj.modeCodeCN = item.modeCodeCN
                        obj.survivalCN = item.survivalCN
                        obj.createTime = item.createTime
                        obj.credit = item.credit
                        obj.threatLevel = item.threatLevel
                        obj.attackModes = item.attackModes
                        this.threatData.push(obj)
                    })
                }
            }).catch(error => {
                this.threat_loading = false
                console.log(error + 'error')
            })
        },
        handelRightSee(row) {

        }
    },
    beforeDestroy() {
        if (this.flag) {
            clearTimeout(this.flag)
            this.flag = null
        }
    }
}
</script>

<style lang="scss" scoped>
.custom-star {
    .star {
        color: #ffffff !important;
    }
    .treeselect {
        ::v-deep .vue-treeselect__menu {
            border: 1px solid #1cd7fa;
            border-top-color: #1cd7fa;
            background: transparent;
            background-color: rgb(0 0 0 / 90%);
        }
        ::v-deep .vue-treeselect__option--highlight {
            color: #1cd7fa;
            background: none;
            background-color: rgb(255 255 255 / 20%);
        }
    }
    .tishi {
        color: #ffffff;
    }
    .tree {
        border: 1px solid #1cd7fa;
        border-radius: 4px;
        color: #ffffff;
        background-color: rgb(0 0 0 / 40%);
        box-shadow: 0 0 7px inset #389bf7;
        ::v-deep .el-tree-node__content {
            background-color: #021c31 !important;
        }
        ::v-deep .custom-tree-node {
            span {
                color: #ffffff !important;
            }
        }
        ::v-deep .el-tree__empty-block {
            background-color: #021c31 !important;
        }
    }
    .el-tree {
        .el-tree-node__content {
            .custom-tree-node {
                span {
                    color: #ffffff !important;
                }
            }
        }
    }
}
.tree {
    border: solid 1px #dadee8;
    background: #ffffff;
}
.chart-wrap {
    margin-top: 10px;
    padding: 10px;
    padding-top: 0;
    border: 1px solid #dadee8;
    border-top: none;
    border-radius: 4px;
    background: #ffffff;
    box-shadow: 0 0 8px rgb(140 152 164 / 20%);
    box-sizing: border-box;
}
.custom-star {
    .tab-button {
        border: 1px solid #1cd7fa;
        border-radius: 4px;
        color: #ffffff !important;
        background-color: transparent !important;
        box-shadow: 0 0 7px inset #389bf7;
        & div {
            color: #ffffff !important;
            &.tab-active {
                border-bottom: 1px solid #387dee;
                color: #387dee !important;
            }
        }
    }
    .chart-wrap {
        border: 1px solid #1cd7fa !important;
        background-color: transparent !important;
    }
}
.tab-button {
    margin-top: 10px;
    margin-bottom: -10px;
    height: 32px;
    border: 1px solid #dadee8;
    border-radius: 4px 4px 0 0;
    background-color: #ffffff;
    & div {
        margin-right: 10px;
        width: 80px;
        height: 31px;
        font-size: 14px;
        border-radius: 2px;
        text-align: center;
        color: rgb(0 0 0 / 60%);
        line-height: 32px;
        cursor: pointer;
        box-sizing: border-box;
        &.tab-active {
            border-bottom: 1px solid #387dee;
            color: #387dee;
        }
    }
}
.list-container {
    border-top: none;
    border-radius: 0 0 4px 4px;
}
.list {
    ::v-deep .el-drawer__container {
        background: rgb(0 0 0 / 40%);
    }
}
.el-select {
    ::v-deep .el-input {
        height: 32px !important;
    }
}
.is-error {
    height: 100px !important;
}
.el-date-editor {
    ::v-deep .el-input__prefix {
        height: 32px !important;
    }
}
.fixedTable {
    ::-webkit-scrollbar {
        width: 6px;          /* 纵向滚动条 宽度 */
        height: 5px;         /* 横向滚动条 高度 */
        border-radius: 3px;  /* 整体 圆角 */
    }
}
.pagination {
    padding: 30px 0 20px;
    text-align: right;
}
.el-input.ips {
    display: block;
    width: 100%;
}
.event .drawer-pad {
    padding: 0;
}
.el-form-item {
    margin: 0;
}
.event ::v-deep .el-range-input {
    color: #ffffff;
    background-color: rgb(0 0 0 / 0%);
}
.event ::v-deep .el-range-separator {
    color: #ffffff;
}
.event ::v-deep .el-upload-list__item-name {
    color: #01e9ff;
    i {
        color: #01e9ff;
    }
}
.attendance-dialog .el-form-item {
    margin-bottom: 30px;
}
.upload-demo ::v-deep .el-button--primary {
    border-color: rgb(0 0 0 / 0%);
    // background-image: url(../../assets/img/XZWJ.png);
    background-position: 0 0;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-color: rgb(0 0 0 / 0%);
}
.el-tree {
    background: rgb(0 0 0 / 0%);
}
.event  ::v-deep  .custom-tree-node {
    height: 26px;
    line-height: 26px;
}
.tree ::v-deep .el-tree--highlight-current .el-tree-node>.el-tree-node__content {
    .custom-tree-node {
        span:nth-child(1) {
            color: rbga(0, 0, 0, 0.9)!important;
        }
        span:nth-child(2) {
            color: #86939e!important;
        }
    }
}
.tree ::v-deep .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
    background-color: rgb(0 0 0 / 0%)!important;
    .custom-tree-node {
        span {
            color: #0052d9!important;
        }
    }
}
.tree ::v-deep .el-tree--highlight-current .el-tree-node>.el-tree-node__content:hover {
    background-color: rgb(0 0 0 / 0%)!important;
    .custom-tree-node {
        span {
            color: #0052d9!important;
        }
    }
}
.tree ::v-deep .el-checkbox__input.is-disabled .el-checkbox__inner {
    border-color: #0052d9;
    background-color: #0052d9;
}
.tree ::v-deep .el-checkbox__input .el-checkbox__inner,.auto ::v-deep .el-checkbox__input .el-checkbox__inner {
    border-color: #0052d9!important;
}
.tree ::v-deep .el-checkbox__input.is-focus .el-checkbox__inner,.auto ::v-deep .el-checkbox__input.is-focus .el-checkbox__inner {
    border-color: #0052d9!important;
}
.tree ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner,.auto ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    border-color: #0052d9;
    background-color: rgb(0 0 0 / 0%)!important;
}
.tree-option i {
    margin: 0 3px;
    cursor: pointer;
}
.tree ::v-deep .el-checkbox__inner::after,.auto ::v-deep .el-checkbox__inner::after {
    border-color: #0052d9;
}
.tree ::v-deep .el-tree-node__content {
    background-color: rgb(0 0 0 / 0%)!important;
}
.auto ::v-deep .el-checkbox__input.is-checked+.el-checkbox__label {
    color: #0052d9;
}
.el-form--inline  ::v-deep .mb0 {
    margin: 0!important;
}
.rich-text {
    margin-bottom: 20px;
}
.mb0  ::v-deep .el-form-item__error {
    position: static!important;
}
.bigTable ::v-deep .el-tag.el-tag--success {
    border-color: #01c5ff;
    color: #00fdff;
    background-color: transparent;
}
.pagination {
    padding: 30px 0 20px;
    text-align: right;
}
.el-input.ips {
    display: block;
    width: 100%;
}
.event ::v-deep .attendance-dialog .el-form-item {
    margin-bottom: 20px;
}
.domain-add {
    line-height: 1;
    position: relative;
    padding: 10px 0;
    color: rgb(0 0 0 / 90%);
    .domain-title {
        display: inline-block;
        width: 90px;
        font-size: 12px;
        text-align: right;
    }
    .el-button {
        position: absolute;
        top: 10px;
        right: 20px;
        padding: 0;
        color: #0052d9;
    }
}
.domain-list {
    // background: rgba(0, 0, 0, .3);
    margin: 3px 0 20px;
    padding: 0 20px 0 100px;
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
            color: #f56c6c;
        }
    }
}
.input-div {
    width: 180px;
}
// .dou{
//     &:after{
//         content: ',';
//     }
//     &:last-child:after{
//         content: '';
//     }
// }
.roles ::v-deep .el-tag.el-tag--success {
    border-color: #01c5ff;
    color: #00fdff;
    background-color: rgb(0 0 0 / 0%);
}
.el-select-dropdown__item.selected {
    font-weight: normal;
}
.el-dropdown-menu {
    z-index: 10009!important;
    width: 240px!important;
    border-radius: 4px;

    /* box-sizing: border-box!important; */
}
.el-dropdown-menu__item {
    color: #ffffff!important;

    /* padding:5px 30px 5px 10px!important; */
}
.el-dropdown-menu__item:hover {
    color: rgb(0 0 0 / 90%) !important;
    background: none!important;
}
.tree_dropdown .el-select-dropdown__item.hover span {
    // color: #fff;
}
.tree_dropdown .el-select-dropdown__item.hover {
    background: none !important;
}
.tree_dropdown .el-select-dropdown__item:hover {
    background: none !important;
}
.tree_dropdown .el-select-dropdown__item {
    background: none !important;
}
.el-tree {
    background: rgb(0 0 0 / 0%);
}
.tree_dropdown .el-select-dropdown__item.hover span {
    // color: #fff;
}
.el-dropdown-menu  ::v-deep .el-checkbox__label {
    // color:rgba(0,0,0,.9) !important;
    width: 72px;
    box-sizing: border-box;
    font-size: 12px;
}
.el-dropdown-menu  ::v-deep  .el-checkbox {
    margin-right: 20px;
}
.el-dropdown-menu ::v-deep .el-checkbox__label:hover {
    width: 72px;
    color: #0052d9;
    box-sizing: border-box;
}
.el-dropdown-menu ::v-deep .el-checkbox__label:active {
    width: 72px;
    color: #0052d9;
    box-sizing: border-box;
}
.el-dropdown-menu ::v-deep .el-checkbox__input.is-checked+.el-checkbox__label {
    color: #0052d9;
}
.el-dropdown-menu  ::v-deep  .el-checkbox:nth-of-type(2n+1) {
    margin-right: 30px;
}
// .el-dropdown-menu  ::v-deep .el-checkbox__input.is-checked+.el-checkbox__label {
//     color: rgba(0,0,0,.9);
// }
// .el-dropdown-menu  ::v-deep  .el-checkbox__input.is-checked .el-checkbox__inner::after {
//     border-color: rgba(0,0,0,.9);
// }
// .el-dropdown-menu  ::v-deep  .el-checkbox__input.is-checked .el-checkbox__inner, .el-dropdown-menu  ::v-deep  .el-checkbox__input.is-indeterminate .el-checkbox__inner {
//     background-color: transparent;
//     border-color: rgba(0,0,0,.9);
// }
// .el-dropdown-menu  ::v-deep .el-checkbox__input.is-disabled .el-checkbox__inner,.el-dropdown-menu  ::v-deep  .el-checkbox__inner {
//     background-color: transparent;
//     border-color: rgba(0,0,0,.9);
// }

// .el-select-dropdown__item.selected span {
//     color:rgba(0,0,0,.9) !important;
// }
.extend-box {
    margin-bottom: 10px;
    padding-top: 20px;
    ::v-deep .el-input__inner {
        width: 848px !important;
    }
}
.extend-box.system-box {
    padding-top: 0;
}
</style>
