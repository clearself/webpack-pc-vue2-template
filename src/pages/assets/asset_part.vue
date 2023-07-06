<template>
    <div class="list">
        <div class="ub w100" style=" overflow: hidden;height: calc(100vh - 80px);">
            <!-- <div style="background:#fff;border: solid 1px #dadee8;border-radius: 4px;overflow-y:auto" class="mr-1 mb-1">
                <div class="asset-tree" style="position: relative">
                    <div class="ub ub-pj ub-ac w100" style="padding-left:10px;margin-bottom: 10px;box-sizing: border-box;margin-top:8px">
                        <div class="list-tips" style="margin-bottom: 0;font-size:12px;">分组列表</div>
                    </div>
                    <div style="padding: 0 10px 10px 10px">
                        <el-input placeholder="请输入关键词搜索" clearable v-model="filterText" class="tree-input" suffix-icon="el-icon-search" size="mini"></el-input>
                    </div>
                    <el-tree
                        ref="asset-tree"
                        node-key="id"
                        :filter-node-method="filterNode"
                        :default-expand-all="false"
                        :highlight-current="!['aqy', 'zzjg'].includes(currentNode.id)"
                        :data="assetTreeData"
                        :props="assetPropsData"
                        @node-click="handleNodeClick"
                        :expand-on-click-node="false"
                        :indent="indent"
                    >
                        <span class="custom-tree-node" slot-scope="{ node }">
                            <span style="color:rgba(0,0,0,.9);font-size:12px;">{{ node.label }}</span>
                        </span>
                    </el-tree>
                </div>
            </div> -->
            <div class="ub ub-f1 ub-ver mb-1" style="overflow: auto; height: 100%;">
                <div>
                    <SearchTop @search="searchAssets" @reset="reset" @isOpen="isOpen">
                        <el-col :md="12" :lg="8" :xl="6">
                            <el-form :model="get_params">
                                <el-form-item label="发现时间：" label-width="80px">
                                    <CustomDate
                                        :append-to-body="true"
                                        :auto="true"
                                        @getCustomTime="getCustomTime"
                                        @getDateData="getDateData"
                                        @actualTime="actualTimeData"
                                        style="width: 100%;"
                                        @timeUnit="timeUnitData"
                                        :empty="false"
                                        :chartTimeRange="customTimeRange"
                                        ref="customDate"
                                    ></CustomDate>
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
                        <!-- <el-col :md="12" :lg="8" :xl="6">
                            <el-form :model="get_params">
                                <el-form-item label="来源：" label-width="80px">
                                    <el-select v-model="get_params.source" size="small" placeholder="请选择业务系统" style="width:100%">
                                        <el-option v-for="(item, index) in sourceList" :key="index" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-form>
                        </el-col> -->
                        <el-col :md="12" :lg="8" :xl="6">
                            <el-form :model="get_params">
                                <el-form-item label="IP范围：" label-width="80px">
                                    <el-col :span="11" style="padding: 0;">
                                        <el-input placeholder="请输入IP范围" v-model="get_params.startIp" @keyup.enter.native="searchAssets" size="small"></el-input>
                                    </el-col>
                                    <el-col :span="2" style="padding: 0; text-align: center;">-</el-col>
                                    <el-col :span="11" style="padding: 0;">
                                        <el-input placeholder="请输入IP范围" v-model="get_params.endIp" @keyup.enter.native="searchAssets" size="small"></el-input>
                                    </el-col>
                                </el-form-item>
                            </el-form>
                        </el-col>
                    </SearchTop>
                    <div class="list-container">
                        <div class="ub ub-pj w100 mb-1 ub-ac">
                            <div class="list-tips">无主资产库</div>
                            <div>
                                <el-button v-per="['assets_find_addblack']" size="small" @click="addblacklistMultiple" type="primary">加黑名单</el-button>
                                <!-- <el-dropdown trigger="click" :hide-on-click="false" class="mr-1 ml-1">
                                    <el-button
                                        icon="el-icon-edit-outline"
                                        size="small"
                                        type="primary"
                                        v-per="['assets_assets_cf']"
                                        style="background:#bd50d3;border:1px solid #bd50d3"
                                    >
                                        配置表头
                                    </el-button>
                                    <el-dropdown-menu slot="dropdown" style="padding-left: 10px">
                                        <span class="el-icon-info" style="color: rgba(0,0,0,.9);margin-bottom: 10px;font-size:12px">
                                            <span style="margin-left: 8px;font-size:12px">拖拽字段进行排序</span>
                                        </span>
                                        <el-checkbox-group v-model="checkList" @change="changeHeader">
                                            <draggable class="w100" tag="div" v-model="checkListAll" v-bind="{ scroll: true, animation: 150 }" @end="onEnd">
                                                <transition-group><el-checkbox :label="element" v-for="element in checkListAll" :key="element"></el-checkbox></transition-group>
                                            </draggable>
                                        </el-checkbox-group>
                                    </el-dropdown-menu>
                                </el-dropdown> -->
                            </div>
                        </div>
                        <div :style="{ height: !kaiguan ? 'calc(100vh - 263px)' : 'calc(100vh - 313px)', 'overflow-y': 'auto' }">
                            <el-table
                                style="width: 100%;"
                                ref="multipleTable"
                                :row-class-name="tableRowClassName"
                                v-loading="loading"
                                :row-style="{ height: '32px' }"
                                :header-row-style="{ height: '32px' }"
                                class="bigTable fixedTable"
                                :data="tableData"
                                border
                                stripe
                                tooltip-effect="dark"
                                @selection-change="handleSelectionChange"
                            >
                                <el-table-column align="center" type="selection" width="30"></el-table-column>
                                <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="createTime" label="创建时间"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="zoneName" label="安全域"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="ip" label="IP"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="port" label="端口"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="mac" label="mac"></el-table-column>
                                <el-table-column align="center" label="操作" fixed="right" width="250" class-name="deepBg">
                                    <template slot-scope="scope">
                                        <el-button size="small" type="text" @click="handleDetail(scope.row)">查看</el-button>
                                        <el-dropdown @command="(key) => {handleCommand(key, scope.row)}" trigger="click" :hide-on-click="true" class="mr-1 ml-1">
                                            <el-button size="small" type="text">登记入库</el-button>
                                            <el-dropdown-menu slot="dropdown">
                                                <el-dropdown-item command="ass">登记资产库</el-dropdown-item>
                                                <el-dropdown-item command="bussiness">登记业务系统库</el-dropdown-item>
                                            </el-dropdown-menu>
                                        </el-dropdown>
                                        <el-button size="small" type="text" @click="addblacklist(scope.row)">加黑</el-button>
                                        <el-button size="small" type="text" @click="startWorkOrder(scope.row)">发起工单</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <pagination
                            :total="total_num"
                            :page.sync="get_params.page"
                            :limit.sync="get_params.size"
                            @pagination="get_data()"
                            style="padding-top: 10px;"
                            v-show="total_num > 0"
                        />
                    </div>
                </div>
            </div>
        </div>
        <!--资产入库-->
        <el-drawer :visible.sync="editUserDialog" direction="rtl" :size="900" title="编辑资产" :before-close="handleClose" custom-class="drawer-dialog">
            <div class="content" style="margin-top: -5px;" v-if="editUserDialog">
                <el-form :model="assetsFormEdit" :rules="rules" ref="assetsFormEdit" :inline="true" class="unit  pb-3" label-position="top">
                    <div class="ub ub-pj">
                        <el-form-item label="资产名称：" prop="deviceName" :label-width="formLabelWidth">
                            <el-input
                                @focus="onFocus"
                                size="small"
                                v-model="assetsFormEdit.deviceName"
                                placeholder="请输入资产名称"
                                autocomplete="off"
                                style="width: 400px;"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="资产标识：" prop="uniqueCode" :label-width="formLabelWidth">
                            <el-input
                                @focus="onFocus"
                                size="small"
                                v-model="assetsFormEdit.uniqueCode"
                                placeholder="请输入资产标识"
                                autocomplete="off"
                                style="width: 400px;"
                            ></el-input>
                        </el-form-item>
                    </div>
                    <div class="ub ub-pj">
                        <el-form-item label="业务系统：" :label-width="formLabelWidth">
                            <el-select v-model="assetsFormEdit.systemId" size="small" placeholder="请选择业务系统" style="width: 400px;">
                                <el-option v-for="(item, index) in systems" :key="index" :label="item.systemName" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="所属安全域：" :label-width="formLabelWidth">
                            <el-select @focus="onFocus" size="small" v-model="assetsFormEdit.zoneId" clearable placeholder="请选择" style="width: 400px;">
                                <el-option v-for="(item, index) in zoneIds" :key="index" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="ub ub-pj">
                        <el-form-item label="资产类型：" prop="deviceTypeId" :label-width="formLabelWidth">
                            <el-select
                                @focus="onFocus"
                                size="small"
                                ref="edit-select"
                                v-model="assetsFormEdit.deviceTypeId"
                                clearable
                                placeholder="请选择"
                                popper-class="tree_dropdown"
                                style="width: 400px;"
                            >
                                <el-option :label="innerLabel_edit" :value="innerValue_edit" style="overflow: scroll;height: 200px;">
                                    <el-tree
                                        ref="tree_addUser"
                                        node-key="id"
                                        :default-expand-all="true"
                                        :highlight-current="true"
                                        :data="treeData"
                                        :props="propsDataSelect"
                                        @node-click="handleNodeClick_edit"
                                        :check-strictly="true"
                                        :expand-on-click-node="false"
                                        :indent="indent"
                                    >
                                        <span class="custom-tree-node" slot-scope="{ node }">
                                            <span style="font-size: 12px;">{{ node.label }}</span>
                                        </span>
                                    </el-tree>
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="厂商：" :label-width="formLabelWidth">
                            <el-select @focus="onFocus" size="small" v-model="assetsFormEdit.manufacturerId" clearable placeholder="请选择" style="width: 400px;">
                                <el-option v-for="item in storeOp" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="ub ub-pj">
                        <el-form-item label="型号：" :label-width="formLabelWidth">
                            <el-input @focus="onFocus" size="small" v-model="assetsFormEdit.modelInfo" placeholder="请输入型号" autocomplete="off" style="width: 400px;"></el-input>
                        </el-form-item>
                        <el-form-item label="操作系统：" :label-width="formLabelWidth">
                            <el-input
                                @focus="onFocus"
                                size="small"
                                v-model="assetsFormEdit.pcSystem"
                                placeholder="请输入操作系统"
                                autocomplete="off"
                                style="width: 400px;"
                            ></el-input>
                        </el-form-item>
                    </div>
                    <div class="ub ub-pj">
                        <el-form-item label="系统版本：" :label-width="formLabelWidth">
                            <el-input
                                @focus="onFocus"
                                size="small"
                                v-model="assetsFormEdit.pcSystemVersion"
                                placeholder="请输入系统版本"
                                autocomplete="off"
                                style="width: 400px;"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="资产标签：" :label-width="formLabelWidth">
                            <el-select v-model="assetsFormEdit.labelId" size="small" placeholder="请选择资产标签" style="width: 400px;">
                                <el-option v-for="(item, index) in assetLabelList" :label="item.name" :value="item.id" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="ub ub-pj">
                        <el-form-item label="是否国产：" :label-width="formLabelWidth">
                            <el-select v-model="assetsFormEdit.isDomestic" size="small" placeholder="请选择" style="width: 400px;">
                                <el-option label="是" value="1"></el-option>
                                <el-option label="否" value="0"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="是否边界：" :label-width="formLabelWidth">
                            <el-select v-model="assetsFormEdit.isBoundary" size="small" placeholder="请选择" style="width: 400px;">
                                <el-option label="是" value="1"></el-option>
                                <el-option label="否" value="0"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="ub ub-pj">
                        <el-form-item label="资产完整性：" :label-width="formLabelWidth" prop="fullStatus">
                            <el-select v-model="assetsFormEdit.fullStatus" size="small" placeholder="请选择" style="width: 400px;" filterable>
                                <el-option label="1" value="1"></el-option>
                                <el-option label="2" value="2"></el-option>
                                <el-option label="3" value="3"></el-option>
                                <el-option label="4" value="4"></el-option>
                                <el-option label="5" value="5"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="资产可用性：" :label-width="formLabelWidth" prop="usableStatus">
                            <el-select v-model="assetsFormEdit.usableStatus" size="small" placeholder="请选择" style="width: 400px;" filterable>
                                <el-option label="1" value="1"></el-option>
                                <el-option label="2" value="2"></el-option>
                                <el-option label="3" value="3"></el-option>
                                <el-option label="4" value="4"></el-option>
                                <el-option label="5" value="5"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="ub ub-pj">
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
                        <el-button size="mini" icon="el-icon-plus" type="text" @click="addIpv4(4)">添加</el-button>
                    </div>
                    <div class="w100">
                        <el-table :data="assetsFormEdit.ipsv4" class="bigTable fixedTable" border stripe tooltip-effect="dark" style="width: 100%;">
                            <!-- <el-table-column type="index" width="50" label="序号" align="center"></el-table-column> -->
                            <el-table-column label="IP" width="182">
                                <template slot="header">
                                    <div>
                                        IP
                                        <i style="color: #f56c6c;">*</i>
                                    </div>
                                </template>
                                <template slot-scope="scope">
                                    <el-form-item :prop="'ipsv4.' + scope.$index + '.assetsIp'" class="mb0" :rules="rules.ip">
                                        <el-input size="mini" v-model="scope.row.assetsIp" placeholder="请输入IP"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column label="端口" width="160">
                                <template slot="header">
                                    <el-tooltip class="item" effect="dark" content="可批量输入，用','分隔" placement="top">
                                        <div>
                                            端口
                                            <i class="el-icon-question" style="color: rgb(0 0 0 / 40%);"></i>
                                        </div>
                                    </el-tooltip>
                                </template>
                                <template slot-scope="scope">
                                    <el-form-item :prop="'ipsv4.' + scope.$index + '.port'" class="mb0">
                                        <el-input size="mini" v-model="scope.row.port" placeholder="请输入端口"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column label="MAC" width="140">
                                <template slot-scope="scope">
                                    <el-form-item :prop="'ipsv4.' + scope.$index + '.mac'" class="mb0">
                                        <el-input size="mini" v-model="scope.row.mac" placeholder="请输入MAC"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column label="子网掩码" width="200">
                                <template slot-scope="scope">
                                    <el-form-item :prop="'ipsv4.' + scope.$index + '.mask'" class="mb0">
                                        <el-input size="mini" v-model="scope.row.mask" placeholder="请输入子网掩码"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column label="网关" width="140">
                                <template slot-scope="scope">
                                    <el-form-item :prop="'ipsv4.' + scope.$index + '.gateway'" class="mb0">
                                        <el-input size="mini" v-model="scope.row.gateway" placeholder="请输入网关"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" width="50" align="center">
                                <template slot-scope="scope">
                                    <el-button
                                        size="mini"
                                        icon="el-icon-remove-outline"
                                        class="del-btn"
                                        type="text"
                                        @click="deleteIp(scope.$index, 4)"
                                        style="font-size: 14px;color: #f56c6c;"
                                    ></el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="ub ub-pj w100 mt-1">
                        <span style="font-size: 12px;color: rgb(0 0 0 / 90%);">添加ipv6：</span>
                        <el-button size="mini" icon="el-icon-plus" type="text" @click="addIpv4(6)">添加</el-button>
                    </div>
                    <div class="w100">
                        <el-table :data="assetsFormEdit.ipsv6" class="bigTable fixedTable" border stripe tooltip-effect="dark" style="width: 100%;">
                            <!-- <el-table-column type="index" width="50" label="序号" align="center"></el-table-column> -->
                            <el-table-column label="IP" width="292">
                                <template slot="header">
                                    <div>
                                        IP
                                        <i style="color: #f56c6c;">*</i>
                                    </div>
                                </template>
                                <template slot-scope="scope">
                                    <el-form-item :prop="'ipsv6.' + scope.$index + '.assetsIp'" class="mb0" :rules="rules.ipv6">
                                        <el-input size="mini" v-model="scope.row.assetsIp" placeholder="请输入IP" style="width: 270px;"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column label="端口" width="140">
                                <template slot="header">
                                    <el-tooltip class="item" effect="dark" content="可批量输入，用','分隔" placement="top">
                                        <div>
                                            端口
                                            <i class="el-icon-question" style="color: rgb(0 0 0 / 40%);"></i>
                                        </div>
                                    </el-tooltip>
                                </template>
                                <template slot-scope="scope">
                                    <el-form-item :prop="'ipsv6.' + scope.$index + '.port'" class="mb0">
                                        <el-input size="mini" v-model="scope.row.port" placeholder="请输入端口"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column label="MAC" width="140">
                                <template slot-scope="scope">
                                    <el-form-item :prop="'ipsv6.' + scope.$index + '.mac'" class="mb0">
                                        <el-input size="mini" v-model="scope.row.mac" placeholder="请输入MAC"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column label="子网掩码" width="140">
                                <template slot-scope="scope">
                                    <el-form-item :prop="'ipsv6.' + scope.$index + '.mask'" class="mb0">
                                        <el-input size="mini" v-model="scope.row.mask" placeholder="请输入子网掩码"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column label="网关" width="140">
                                <template slot-scope="scope">
                                    <el-form-item :prop="'ipsv6.' + scope.$index + '.gateway'" class="mb0">
                                        <el-input size="mini" v-model="scope.row.gateway" placeholder="请输入网关"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" width="50" align="center">
                                <template slot-scope="scope">
                                    <el-button
                                        size="mini"
                                        icon="el-icon-remove-outline"
                                        class="del-btn"
                                        type="text"
                                        @click="deleteIp(scope.$index, 6)"
                                        style="font-size: 14px;color: #f56c6c;"
                                    ></el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="w100" v-if="existIp != ''" style="line-height: 20px;vertical-align: top;word-wrap: break-word;  word-break: break-all;white-space: normal;color: red;">
                        {{ existIp }} 已存在
                    </div>
                    <div class="ub ub-pj w100 mt-1">
                        <span style="font-size: 12px;color: rgb(0 0 0 / 90%);">添加组件：</span>
                        <el-button size="mini" type="text" icon="el-icon-plus" @click="addApplication('edit')">添加</el-button>
                    </div>
                    <div class="w100">
                        <el-table :data="assetsFormEdit.applications" class="bigTable" border stripe tooltip-effect="dark" style="width: 100%;">
                            <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
                            <el-table-column prop="name" label="组件名称">
                                <template slot-scope="scope">
                                    <el-form-item :prop="'applications.' + scope.$index + '.name'" class="mb0">
                                        <el-input size="mini" v-model="scope.row.name" placeholder="请输入组件名称"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column prop="softwareVersion" label="版本">
                                <template slot-scope="scope">
                                    <el-form-item :prop="'applications.' + scope.$index + '.softwareVersion'" class="mb0">
                                        <el-input size="mini" v-model="scope.row.softwareVersion" placeholder="请输入版本"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column prop="address" label="操作" width="50" align="center">
                                <template slot-scope="scope">
                                    <el-button
                                        size="mini"
                                        icon="el-icon-remove-outline"
                                        class="del-btn"
                                        type="text"
                                        @click="deleteApplication('edit', scope.$index)"
                                        style="font-size: 14px;color: #f56c6c;"
                                    ></el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="ub ub-pj w100 mt-1">
                        <span style="font-size: 12px;color: rgb(0 0 0 / 90%);">联系人：</span>
                        <el-button size="mini" type="text" icon="el-icon-plus" @click="addUsers">添加</el-button>
                    </div>
                    <div class="w100">
                        <el-table :data="assetsFormEdit.users" class="bigTable" border stripe tooltip-effect="dark" style="width: 100%;">
                            <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
                            <el-table-column label="联系人" width="142">
                                <template slot-scope="scope">
                                    <el-select size="mini" style="width: 120px;" v-model="scope.row.userId" filterable placeholder="请选择" @change="changeUser(scope.row)">
                                        <el-option v-for="item in users" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column prop="code" label="员工编号" width="80"></el-table-column>
                            <el-table-column prop="departmentName" label="部门" width="100"></el-table-column>
                            <el-table-column prop="phone" label="电话" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="landline" label="座机" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="mailBox" label="邮箱" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="address" label="操作" width="50" align="center">
                                <template slot-scope="scope">
                                    <el-button
                                        size="mini"
                                        icon="el-icon-remove-outline"
                                        class="del-btn"
                                        type="text"
                                        @click="deleteUsers('edit', scope.$index)"
                                        style="font-size: 14px;color: #f56c6c;"
                                    ></el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <!--非系统属性-->
                    <div class="extend-box" v-if="assetsFormEdit.extendAttr && assetsFormEdit.extendAttr.length">
                        <div class="w100" v-for="(item, index) in assetsFormEdit.extendAttr" :key="index">
                            <el-form-item v-if="item.type == 1" :label="item.name + '：'" label-width="120px" style="width: 100%;">
                                <el-input size="small" v-model="item.val" placeholder="请输入字符串" autocomplete="off" clearable style="width: 848px;"></el-input>
                            </el-form-item>
                            <el-form-item v-if="item.type == 2" :label="item.name + '：'" label-width="120px" style="width: 100%;">
                                <el-input
                                    size="small"
                                    type="number"
                                    v-model="item.val"
                                    oninput="value=value.replace(/[^0-9.]/g,'')"
                                    @blur="item.val = $event.target.value"
                                    placeholder="请输入数字"
                                    autocomplete="off"
                                    style="width: 848px;"
                                ></el-input>
                            </el-form-item>
                            <el-form-item v-if="item.type == 3" :label="item.name + '：'" label-width="120px">
                                <el-date-picker v-model="item.val" align="right" type="date" size="small" placeholder="选择日期" :picker-options="pickerOptions"></el-date-picker>
                            </el-form-item>
                            <el-form-item v-if="item.type == 4" :label="item.name + '：'" label-width="120px">
                                <el-date-picker
                                    v-model="item.val"
                                    type="datetime"
                                    size="small"
                                    placeholder="选择日期时间"
                                    align="right"
                                    :picker-options="pickerOptions"
                                ></el-date-picker>
                            </el-form-item>
                            <el-form-item
                                v-if="item.type == 5"
                                :label="item.name + '：'"
                                :prop="'extendAttr.' + index + '.val'"
                                label-width="120px"
                                style="width: 100%;"
                                :rules="rules.extendIp"
                            >
                                <el-input size="small" v-model="item.val" placeholder="请输入ip" autocomplete="off" clearable style="width: 848px;"></el-input>
                            </el-form-item>
                            <el-form-item v-if="item.type == 6" :label="item.name + '：'" label-width="120px" style="width: 100%;">
                                <el-input
                                    :show-password="true"
                                    size="small"
                                    v-model="item.val"
                                    placeholder="请输入密码"
                                    autocomplete="off"
                                    clearable
                                    style="width: 848px;"
                                ></el-input>
                            </el-form-item>
                            <div class="rich-text" v-if="item.type == 7">
                                <el-form-item :label="item.name + '：'" label-width="120px" style="margin-bottom: 0 !important;width: 100%;"></el-form-item>
                                <div><vue-ueditor-wrap :config="myConfig" v-model="item.val"></vue-ueditor-wrap></div>
                            </div>
                            <el-form-item v-if="item.type == 8" :key="'zz8' + index" :label="item.name + '：'" label-width="120px" style="width: 100%;">
                                <el-select size="small" v-model="item.val" clearable placeholder="请选择" style="width: 848px;">
                                    <el-option v-for="(_it, _inx) in typeof item.items === 'string' ? item.items.split('#') : []" :key="_inx" :label="_it" :value="_it"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item v-if="item.type == 9" :key="'zz9' + index" :label="item.name + '：'" label-width="120px" style="width: 100%;">
                                <el-select size="small" v-model="item.val" multiple clearable placeholder="请选择" style="width: 848px;">
                                    <el-option v-for="(_it, _inx) in typeof item.items === 'string' ? item.items.split('#') : []" :key="_inx" :label="_it" :value="_it"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </div>
                    <!--系统属性-->
                    <div class="extend-box system-box" v-if="assetsFormEdit.systemAttr && assetsFormEdit.systemAttr.length">
                        <div class="w100" v-for="(item, index) in assetsFormEdit.systemAttr" :key="index">
                            <el-form-item v-if="item.type == 1" :label="item.name + '：'" label-width="120px" style="width: 100%;">
                                <el-input size="small" v-model="item.val" placeholder="请输入字符串" autocomplete="off" clearable style="width: 848px;"></el-input>
                            </el-form-item>
                            <el-form-item v-if="item.type == 2" :label="item.name + '：'" label-width="120px" style="width: 100%;">
                                <el-input
                                    size="small"
                                    type="number"
                                    v-model="item.val"
                                    oninput="value=value.replace(/[^0-9.]/g,'')"
                                    @blur="item.val = $event.target.value"
                                    placeholder="请输入数字"
                                    autocomplete="off"
                                    style="width: 848px;"
                                ></el-input>
                            </el-form-item>
                            <el-form-item v-if="item.type == 3" :label="item.name + '：'" label-width="120px">
                                <el-date-picker v-model="item.val" align="right" type="date" size="small" placeholder="选择日期" :picker-options="pickerOptions"></el-date-picker>
                            </el-form-item>
                            <el-form-item v-if="item.type == 4" :label="item.name + '：'" label-width="120px">
                                <el-date-picker
                                    v-model="item.val"
                                    type="datetime"
                                    size="small"
                                    placeholder="选择日期时间"
                                    align="right"
                                    :picker-options="pickerOptions"
                                ></el-date-picker>
                            </el-form-item>
                            <el-form-item
                                v-if="item.type == 5"
                                :label="item.name + '：'"
                                :prop="'systemAttr.' + index + '.val'"
                                label-width="120px"
                                style="width: 100%;"
                                :rules="rules.extendIp"
                            >
                                <el-input size="small" v-model="item.val" placeholder="请输入ip" autocomplete="off" clearable style="width: 848px;"></el-input>
                            </el-form-item>
                            <el-form-item v-if="item.type == 6" :label="item.name + '：'" label-width="120px" style="width: 100%;">
                                <el-input
                                    :show-password="true"
                                    size="small"
                                    v-model="item.val"
                                    placeholder="请输入密码"
                                    autocomplete="off"
                                    clearable
                                    style="width: 848px;"
                                ></el-input>
                            </el-form-item>
                            <div class="rich-text" v-if="item.type == 7">
                                <el-form-item :label="item.name + '：'" label-width="120px" style="margin-bottom: 0 !important;width: 100%;"></el-form-item>
                                <div><vue-ueditor-wrap :config="myConfig" v-model="item.val"></vue-ueditor-wrap></div>
                            </div>
                            <el-form-item v-if="item.type == 8" :key="'zzzz8' + index" :label="item.name + '：'" label-width="120px" style="width: 100%;">
                                <el-select size="small" v-model="item.val" clearable placeholder="请选择" style="width: 848px;">
                                    <el-option v-for="(_it, _inx) in typeof item.items === 'string' ? item.items.split('#') : []" :key="_inx" :label="_it" :value="_it"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item v-if="item.type == 9" :key="'zzzz9' + index" :label="item.name + '：'" label-width="120px" style="width: 100%;">
                                <el-select size="small" v-model="item.val" multiple clearable placeholder="请选择" style="width: 848px;">
                                    <el-option v-for="(_it, _inx) in typeof item.items === 'string' ? item.items.split('#') : []" :key="_inx" :label="_it" :value="_it"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </div>
                </el-form>
                <div
                    slot="footer"
                    class="dialog-footer"
                    style="position: fixed;right: 0;bottom: 0;
                    z-index: 9999;
                    padding-bottom: 10px;
                    width: 900px;
                    text-align: right;
                    background: #ffffff;"
                >
                    <el-button @click="handleClose" size="small">取消</el-button>
                    <el-button @click="submitFormEdit('assetsFormEdit')" size="small" type="primary" style="margin-right: 30px;">确定</el-button>
                </div>
            </div>
        </el-drawer>
        <!--查看内容-->
        <el-drawer :visible.sync="seeDialog" direction="rtl" size="50%" title="查看资产"  custom-class="checkdia">
            <div class="drawer-pad">
                <div class="container">
                    <el-descriptions size="mini" title="" :column="2" border>
                        <el-descriptions-item label="IP">{{assetsFormSee.ip}}</el-descriptions-item>
                        <el-descriptions-item label="端口">{{assetsFormSee.port}}</el-descriptions-item>
                        <el-descriptions-item label="安全域">{{assetsFormSee.zoneName}}</el-descriptions-item>
                        <el-descriptions-item label="创建时间">{{assetsFormSee.createTime}}</el-descriptions-item>
                        <el-descriptions-item label="mac">{{assetsFormSee.mac}}</el-descriptions-item>
                        <!-- <el-descriptions-item label="资产类型">{{assetsFormSee.device_type_name}}</el-descriptions-item>
                        <el-descriptions-item label="操作系统">{{assetsFormSee.pc_system}}</el-descriptions-item>
                        <el-descriptions-item label="系统版本">{{assetsFormSee.port}}</el-descriptions-item>
                        <el-descriptions-item label="杀毒软件版本">{{assetsFormSee.port}}</el-descriptions-item>
                        <el-descriptions-item label="资产MAC地址">{{assetsFormSee.port}}</el-descriptions-item> -->
                    </el-descriptions>
                </div>
            </div>
        </el-drawer>
        <!-- 登记业务系统 -->
        <el-dialog title="登记业务系统" :visible.sync="editUserDialog1"  width="700px" custom-class="common-dialog">
            <el-form :model="assetsFormEdit1" :inline="true" :rules="rules1" ref="assetsFormEdit1" label-width="100px" label-position="top">
                <el-form-item label="系统名称：" prop="systemName">
                    <el-input size="small"  style="width: 652px !important;" clearable v-model="assetsFormEdit1.systemName" placeholder="请输入业务系统名称" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="资产完整性：" :label-width="formLabelWidth" prop="fullStatus">
                    <el-select v-model="assetsFormEdit1.fullStatus" size="small" placeholder="请选择" style="width: 652px;" filterable>
                        <el-option label="1" value="1"></el-option>
                        <el-option label="2" value="2"></el-option>
                        <el-option label="3" value="3"></el-option>
                        <el-option label="4" value="4"></el-option>
                        <el-option label="5" value="5"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="资产可用性：" :label-width="formLabelWidth" prop="usableStatus">
                    <el-select v-model="assetsFormEdit1.usableStatus" size="small" placeholder="请选择" style="width: 652px;" filterable>
                        <el-option label="1" value="1"></el-option>
                        <el-option label="2" value="2"></el-option>
                        <el-option label="3" value="3"></el-option>
                        <el-option label="4" value="4"></el-option>
                        <el-option label="5" value="5"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="资产机密性：" :label-width="formLabelWidth" prop="secretStatus">
                    <el-select v-model="assetsFormEdit1.secretStatus" size="small" placeholder="请选择" style="width: 652px;" filterable>
                        <el-option label="1" value="1"></el-option>
                        <el-option label="2" value="2"></el-option>
                        <el-option label="3" value="3"></el-option>
                        <el-option label="4" value="4"></el-option>
                        <el-option label="5" value="5"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="width: 100%;">
                    <div class="ub ub-pj w100">
                        <div style="font-size: 12px;color: rgb(0 0 0 / 90%);">联系人：</div>
                        <div style="cursor: pointer;" @click="editPeoples(assetsFormEdit1)">
                            <i style="color: #0052d9;" class="el-icon-plus"></i><span style="margin-left: 3px;font-size: 12px;color: #0052d9;">添加</span>
                        </div>
                    </div>
                    <div>
                        <el-table class='bigTable system' :data="assetsFormEdit1.users" border stripe tooltip-effect="dark">
                            <el-table-column align="center" type="index" width="50" label="序号">
                            </el-table-column>
                            <el-table-column label="联系人" prop="userId" align="center" width="130">
                                <template slot-scope="scope">
                                    <el-select style="width: 100px;" size="mini" v-model="scope.row.userId" filterable placeholder="请选择" @change="changeUser1(scope.row)">
                                        <el-option v-for="item in users" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column prop="code" label="员工编号" width="80" align="center">
                            </el-table-column>
                            <el-table-column prop="departmentName" label="部门" width="90" align="center">
                            </el-table-column>
                            <el-table-column prop="phone" label="电话" align="center" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column prop="landline" label="座机" show-overflow-tooltip align="center">
                            </el-table-column>
                            <el-table-column prop="mailBox" label="邮箱" show-overflow-tooltip align="center">
                            </el-table-column>
                            <el-table-column align="center" label="操作" width="50">
                                <template slot-scope="scope">
                                    <el-button @click="handleEditDelete(scope.$index,assetsFormEdit1)" title="删除" icon="el-icon-remove-outline" type="text" style="color: red;"></el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-form-item>
                <el-form-item style="margin-bottom: 0;width: 100%;">
                    <div class="ub ub-pj w100">
                        <div style="font-size: 12px;color: rgb(0 0 0 / 90%);">域名：</div>
                        <div style="cursor: pointer;" @click="editAddress(assetsFormEdit1)">
                            <i style="color: #0052d9;" class="el-icon-plus"></i><span style="margin-left: 3px;font-size: 12px;color: #0052d9;">添加</span>
                        </div>
                    </div>
                </el-form-item>
                <div>
                    <el-table class='bigTable system' :data="assetsFormEdit1.infos" border stripe tooltip-effect="dark">
                        <el-table-column align="center" type="index" width="50" label="序号">
                        </el-table-column>
                        <el-table-column label="域名" align="center">
                            <template slot-scope="scope">
                                <el-form-item :prop="'infos.' + scope.$index + '.domainName'" class="mb0" :rules="rules1.domainName">
                                    <el-input size="mini" v-model.trim="scope.row.domainName" placeholder="请输入域名" autocomplete="off"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="IP" align="center">
                            <template slot-scope="scope">
                                <el-form-item :prop="'infos.' + scope.$index + '.ip'" class="mb0" :rules="rules1.ip">
                                    <el-input size="mini" v-model.trim="scope.row.ip" placeholder="请输入IP" autocomplete="off"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="端口" align="center">
                            <template slot-scope="scope">
                                <el-form-item :prop="'infos.' + scope.$index + '.port'" class="mb0" :rules="rules1.port">
                                    <el-input size="mini" type="number" v-model.trim="scope.row.port" placeholder="请输入端口" autocomplete="off"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="操作" width="50">
                            <template slot-scope="scope">
                                <el-button @click="editAddressDelete(scope.$index,assetsFormEdit1)" title="删除" icon="el-icon-remove-outline" type="text" style="color: red;"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editUserDialog1=false" size="small">取消</el-button>
                <el-button type="primary" @click="submitFormEdit1('assetsFormEdit1')" size="small">确认</el-button>
            </span>
        </el-dialog>
        <el-dialog title="发起工单" :visible.sync="taskDialog" width="700px" custom-class="common-dialog">
            <el-form :model="taskForm" :rules="rulesOrder" ref="taskForm" label-position="top">
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
                <el-form-item label="模板类型:" prop="mouldType" :label-width="formLabelWidth">
                    <el-select style="width: 100%;" size="small" v-model="taskForm.mouldType" clearable placeholder="请选择"  @change="changeMouldType">
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
    </div>
</template>

<script>
import initData from '@/mixins/initData.js'
import VueUeditorWrap from '../../components/vue-ueditor-wrap.vue' // ES6 Module
// import draggable from 'vuedraggable'
import ueditorConfig from '../../mixins/ueditorConfig'
import CustomDate from '@/pages/assets/assets_detail_drawer/components/custom_date/index.vue'
import {
    find_asset_info_tree,
    find_assets,
    findAllManufacturer,
    findTypes,
    findAssets,
    findSystemType,
    findAllZoneIds,
    findAssetusers,
    findAssetLabel,
    findAssetSystemAttr,
    findSystem,
    findSaveBalck,
    findTemp,
    findWorkTask,
    // s
    // getAllManufacturer,
    // get_types,
    // get_assets,
    // add_assets,
    checkIP,
    get_header_list,
    save_header_list
} from '../../server/assets/api.js'
export default {
    name: 'AssetPart',
    components: {
        VueUeditorWrap,
        // draggable,
        CustomDate
    },
    mixins: [ueditorConfig, initData],
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
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now()
                },
                shortcuts: [
                    {
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date())
                        }
                    },
                    {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date()
                            date.setTime(date.getTime() - 3600 * 1000 * 24)
                            picker.$emit('pick', date)
                        }
                    },
                    {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date()
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
                            picker.$emit('pick', date)
                        }
                    }
                ]
            },
            sourceList: [
                {
                    label: '天擎',
                    value: 1
                },
                {
                    label: '奇安信',
                    value: 2
                },
                {
                    label: '360',
                    value: 3
                }
            ],
            customTimeRange: [],
            actualTime: '',
            timeUnit: '',
            dateData: '',
            dateMode: '',
            useDate: {},
            useIndex: '',
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
            treeData: [],
            assetPropsData: {
                children: 'sub',
                label: 'name'
            },
            propsDataSelect: {
                children: 'sub',
                label: 'name'
            },
            currentNode: {
                id: ''
            },
            userId: '',
            flag: null,
            currentNodeId: '',
            users: [],
            zoneIds: [],
            applications: [
                {
                    name: '',
                    version_info: ''
                }
            ],

            innerLabel_edit: '',
            innerValue_edit: '',
            checkList: [],
            headerTimer: null,
            formLabelWidth: '100px',
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
                orgId: '',
                zoneId: '',
                startIp: '',
                endIp: '',
                source: ''
            },
            holeDialog: false,
            seeDialog: false,
            userDeleteDialog: false,
            userDeleteAllDialog: false,
            delIds: [],
            editUserDialog: false,
            ips: [
                {
                    ip: '',
                    port: '',
                    mac: '',
                    mask: '',
                    gateway: ''
                }
            ],
            upstreamVoList: [
                {
                    state: '1',
                    value: ''
                }
            ],
            saveBoundarys: [],
            assetLabelList: [],
            assetsFormEdit: {
                id: '',
                deviceName: '',
                deviceTypeId: '',
                subnetMask: '',
                pcSystem: '',
                systemId: '',
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
                deviceName: [
                    {
                        required: true,
                        message: '请输入域名',
                        trigger: 'blur'
                    }
                ],
                deviceTypeId: [
                    {
                        required: true,
                        message: '请选择资产类型',
                        trigger: 'change'
                    }
                ],
                uniqueCode: [
                    {
                        required: true,
                        message: '请输入资产标识',
                        trigger: 'blur'
                    }
                ],
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
            filterText: '',
            kaiguan: '',
            assetsFormEdit1: {
                id: '',
                systemName: '',
                domainName: '',
                ip: '',
                port: '',
                users: [],
                infos: [],
                fullStatus: '',
                usableStatus: '',
                secretStatus: ''
            },
            assetsFormSee: {
                ip: '',
                port: ''
            },
            rules1: {
                systemName: [{
                    required: true,
                    message: '请输入业务系统名称',
                    trigger: 'blur'
                }],
                ip: [{
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
                port: [{
                    required: true,
                    message: '请输入端口',
                    trigger: 'blur'
                }],
                domainName: [{
                    required: true,
                    message: '请输入域名',
                    trigger: 'blur'
                }],
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
            editUserDialog1: false,
            sourceId: '',
            taskDialog: false,
            rulesOrder: {
                mouldType: [{
                    required: true,
                    message: '请选择模板类型',
                    trigger: 'change'
                }],
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
            taskForm: {
                mouldType: '',
                workOrderName: '',
                workMouldId: '',
                level: '',
                workOrderContent: ''
            },
            isSubmitTask: false,
            allTemplate: []
        }
    },
    computed: {
    },
    watch: {
        taskDialog: {
            handler(newval) {
                if (!newval) {
                    this.$refs.taskForm.resetFields()
                    this.taskForm = {
                        mouldType: '',
                        workOrderName: '',
                        workMouldId: '',
                        level: '',
                        workOrderContent: ''
                    }
                }
            }
        },
        editUserDialog1: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.assetsFormEdit1.resetFields()
                    this.assetsFormEdit1.infos = []
                    this.assetsFormEdit1.users = []
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
    },
    mounted() {
        this.$nextTick(() => {
            this.get_all_zoneIds()
            this.getTypes()
            this.getSystems()
            this.getManufacturer()
            this.initUser()
            // this.getHeader()
            this.initTree()
            this.getAssetLabels()
            this.getSystemAttr()
        })
    },
    methods: {
        changeMouldType(val) {
            if (val !== '') {
                this.get_workMound()
            } else {
                this.allTemplate = []
            }
        },
        handleEditDelete(index, assetsFormEdit) {
            assetsFormEdit.users.splice(index, 1)
        },
        editAddressDelete(index, assetsFormEdit) {
            console.log(index, assetsFormEdit)
            assetsFormEdit.infos.splice(index, 1)
        },
        submitFormEdit1(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.editAssets1()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        editAssets1() {
            let data = {
                queryData: {},
                paramsData: {
                    assetsFindId: this.assetsFormEdit1.id,
                    // id: this.assetsFormEdit1.id,
                    systemName: this.assetsFormEdit1.systemName,
                    users: this.assetsFormEdit1.users.map(item => { return { userId: item.userId } }),
                    infos: this.assetsFormEdit1.infos,
                    fullStatus: this.assetsFormEdit1.fullStatus,
                    usableStatus: this.assetsFormEdit1.usableStatus,
                    secretStatus: this.assetsFormEdit1.secretStatus
                }
            }
            if (this.assetsFormEdit1.infos.length == 0) {
                this.$message.warning('请添加域名')
                return
            }
            if (this.assetsFormEdit1.users && this.assetsFormEdit1.users[0] && !this.assetsFormEdit1.users[0].userId) {
                this.$message.warning('已添加联系人不能为空')
                return
            }
            if (this.assetsFormEdit1.infos && this.assetsFormEdit1.infos[0] && (!this.assetsFormEdit1.infos[0].domainName || !this.assetsFormEdit1.infos[0].ip)) {
                this.$message.warning('已添加域名或ip不能为空')
                return
            }
            findSystem(data).then(res => {
                console.log(res)
                this.editUserDialog1 = false
                this.$message({
                    message: '入库成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(error => {
                console.log('error' + error)
            })
        },
        editAddress(assetsFormEdit1) {
            console.log(assetsFormEdit1)
            assetsFormEdit1.infos.push({
                domainName: '',
                ip: '',
                port: ''
            })
        },
        get_workMound(id) {
            let data = {
                queryData: {},
                paramsData: {
                    id: this.sourceId,
                    mouldType: this.taskForm.mouldType
                }
            }
            findTemp(data).then(res => {
                console.log('可用工单模板', res)
                this.allTemplate = res
            }).catch(err => {
                console.log(err, 'err')
            })
        },
        startWorkOrder(row) {
            console.log(row)
            this.sourceId = row.id
            // this.get_workMound(row.id)
            this.taskForm.workOrderName = `未知资产确认工单${row.createTime}`
            this.taskDialog = true
        },
        changeUser1(row) {
            let selected = this.users.filter(item => item.value === row.userId)
            console.log('selected', selected)
            if (selected.length > 0) {
                row.phone = selected[0].phone
                row.departmentName = selected[0].depName
                row.mailBox = selected[0].mailbox
                row.code = selected[0].code
                row.landline = selected[0].landline
            } else {
                row.phone = ''
                row.departmentName = ''
                row.mailBox = ''
                row.code = ''
                row.landline = ''
            }
        },
        editPeoples(assetsFormEdit1) {
            assetsFormEdit1.users.push({
                userId: '',
                departmentName: '',
                mailBox: '',
                phone: '',
                code: '',
                landline: ''
            })
        },
        registerBus(row) {
            console.log(row)
            // 登记业务系统库
            this.editUserDialog1 = true
            this.assetsFormEdit1 = {
                id: row.id,
                systemName: row.system_name,
                users: [],
                infos: []
            }
            // row.users.forEach(item => {
            //     this.assetsFormEdit1.users.push({
            //         userId: item.userId,
            //         phone: item.phone,
            //         departmentName: item.departmentName,
            //         chineseName: item.chineseName,
            //         mailBox: item.mailBox,
            //         code: item.code,
            //         landline: item.landline
            //     })
            // })
            // row.infos.forEach(item => {
            //     this.assetsFormEdit1.infos.push({
            //         domainName: item.domainName,
            //         ip: item.ip,
            //         port: item.port
            //     })
            // })
        },
        addblacklistMultiple(row) {
            // 加黑名单
            // console.log(this.multipleSelection)
            if (this.multipleSelection.length == 0) {
                this.$message({
                    message: '请先选择行',
                    type: 'warning'
                })
                return
            }
            const blackList = []
            this.multipleSelection.forEach(item => {
                blackList.push({
                    id: item,
                    status: -1
                })
            })
            this.updateBlack(blackList)
        },
        addblacklist(row) {
            // 加黑名单
            // console.log(this.multipleSelection)
            const blackList = [{ id: row.id, status: -1 }]
            this.updateBlack(blackList)
        },
        updateBlack(data) {
            findSaveBalck({
                queryData: {},
                paramsData: {
                    assetsFindList: data
                }
            }).then(res => {
                this.$message({
                    message: '加入黑名单成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
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
                    findWorkTask(data).then(res => {
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
        getCustomTime(val, isChartTime) {
            this.sayTimes = val
            console.log('时间', val)
        },
        getDateData(date, mode, useDate, useIndex) {
            this.dateData = date
            this.dateMode = mode
            console.log('getDateData----dateData', this.dateData)
            this.useDate = useDate
            this.useIndex = useIndex
        },
        actualTimeData(val) {
            this.actualTime = val
        },
        timeUnitData(val) {
            this.timeUnit = val
        },
        tableRowClassName({ row, rowIndex }) {
            // console.log(rowIndex)
            if (rowIndex % 2) {
                return 'table-row2'
            } else {
                return 'table-row1'
            }
        },
        reset() {
            this.get_params = {
                page: 1,
                size: 20,
                ip: '',
                startIp: '',
                endIp: '',
                orgId: '',
                zoneId: ''
            }
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
            findAssetSystemAttr({
                queryData: {},
                paramsData: {}
            })
                .then(res => {
                    console.log('系统属性', res)
                    this.systemAttr = res ?? []
                })
                .catch(error => {
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
            if (row.isExtend === false) {
                // 判断里面是否存在某个参数
                isChecked = true
            } else {
                isChecked = false
            }
            return isChecked
        },
        initTree() {
            find_asset_info_tree({
                queryData: {},
                paramsData: {}
            })
                .then(res => {
                    console.log('资产树', res)
                    if (this.isFirst) {
                        this.get_data()
                    }
                    this.isFirst = false
                    this.assetTreeData = res
                })
                .then(() => {
                    this.$refs['asset-tree'].setCurrentKey(this.depId)
                    this.isClick = true
                })
                .catch(error => {
                    console.log('error' + error)
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
            console.log(node)
            /* 清除参数*/
            this.get_params.zoneId = ''
            this.get_params.orgId = ''

            switch (node.flag) {
                case 1:
                    this.get_params.zoneId = node.id
                    break
                case 4:
                    this.get_params.orgId = node.id
                    break
                default:
                    break
            }
            if (!node.flag && node.id === 'aqy') {
                this.get_params.zoneId = 'all'
            } else if (!node.flag && node.id === 'zzjg') {
                this.get_params.orgId = 'all'
            }
            console.log(node)
            this.currentNode = node
            if (this.isClick) {
                this.currentNodeId = node.id
            }
            this.$refs['asset-tree'].setCurrentKey(node.id)

            this.depId = node.id
            this.initParams()
            this.get_data()
        },

        /* 资产*/
        initUser() {
            this.users = []
            let data = {
                queryData: {},
                paramsData: {}
            }
            findAssetusers(data)
                .then(res => {
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
                            this.users.push(obj)
                        })
                    }
                })
                .catch(error => {
                    console.log('error' + error)
                })
        },
        getAssetLabels() {
            findAssetLabel({
                queryData: {},
                paramsData: {}
            })
                .then(res => {
                    console.log(res, '标签')
                    if (res && res.length) {
                        this.assetLabelList = res
                    }
                })
                .catch(err => {
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
                    menuTag: '6'
                }
            }
            get_header_list(data)
                .then(res => {
                    console.log(res)
                    if (res) {
                        this.checkList = res.field
                        this.checkListAll = res.allField
                    }
                })
                .catch(err => {
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
            save_header_list(data)
                .then(res => {
                    this.$message({
                        message: '修改列表头成功',
                        type: 'success'
                    })
                    setTimeout(() => {
                        this.getHeader()
                    }, 1500)
                })
                .catch(err => {
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
            } else {
                row.phone = ''
                row.departmentName = ''
                row.mailBox = ''
                row.code = ''
                row.landline = ''
            }
        },
        get_all_zoneIds() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            findAllZoneIds(data)
                .then(res => {
                    if (res.length > 0) {
                        res.forEach(item => {
                            let obj = {}
                            obj.value = item.id
                            obj.label = item.zoneName
                            this.zoneIds.push(obj)
                        })
                    }
                })
                .catch(error => {
                    console.log('error' + error)
                })
        },
        getSystems() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            findSystemType(data)
                .then(res => {
                    console.log(res)
                    this.systems = res
                })
                .catch(error => {
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
        addIpv4(num) {
            console.log('??/')
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
        },
        deleteIp(index, num) {
            if (num === 4) {
                this.assetsFormEdit.ipsv4.splice(index, 1)
            } else {
                this.assetsFormEdit.ipsv6.splice(index, 1)
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
                    softwareVersion: ''
                })
            } else {
                this.assetsFormEdit.applications.push({
                    name: '',
                    softwareVersion: ''
                })
            }
        },
        addUsers() {
            this.assetsFormEdit.users.push({
                userId: '',
                departmentName: '',
                mailBox: '',
                phone: '',
                code: '',
                landline: ''
            })
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
            findAllManufacturer(data)
                .then(res => {
                    console.log(res)
                    if (res.length > 0) {
                        res.forEach(item => {
                            let obj = {}
                            obj.id = item.id
                            obj.name = item.name
                            this.storeOp.push(obj)
                        })
                    }
                })
                .catch(error => {
                    console.log('error' + error)
                })
        },
        getTypes() {
            this.types = []
            let data = {
                queryData: {},
                paramsData: {}
            }
            findTypes(data)
                .then(res => {
                    console.log(res)
                    this.treeData = res
                })
                .catch(error => {
                    this.loading = false
                    console.log('error' + error)
                })
        },
        searchAssets() {
            this.setDate()
            this.get_params.page = 1
            this.get_data()
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
        get_data() {
            console.log(this.sayTimes)
            let uid = (this.config_id = new Date().getTime())
            this.loading = true
            this.tableData = []
            let data = {
                queryData: {
                    page: this.get_params.page,
                    pageSize: this.get_params.size
                },
                paramsData: {
                    ip: this.get_params.ip,
                    startIp: this.get_params.startIp,
                    endIp: this.get_params.endIp,
                    zoneId: this.get_params.zoneId,
                    orgId: this.get_params.orgId,
                    startTime: this.sayTimes[0],
                    endTime: this.sayTimes[1],
                    status: 0,
                    source: this.get_params.source
                }
            }
            find_assets(data)
                .then(res => {
                    if (this.config_id != uid) {
                        return
                    }
                    this.loading = false
                    this.total_num = res.total
                    let list = res.records
                    if (list.length > 0) {
                        this.tableData = this.$lodash.cloneDeep(list)
                    }
                })
                .catch(error => {
                    this.loading = false
                    console.log('error' + error)
                })
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
        addAssets(ips) {
            let data = {
                queryData: {},
                paramsData: {
                    assetsFindId: this.assetsFormEdit.id,
                    manufacturerId: this.assetsFormEdit.manufacturerId,
                    modelInfo: this.assetsFormEdit.modelInfo,
                    pcSystemVersion: this.assetsFormEdit.pcSystemVersion,
                    uniqueCode: this.assetsFormEdit.uniqueCode,
                    isBoundary: this.assetsFormEdit.isBoundary,
                    isDomestic: this.assetsFormEdit.isDomestic,
                    label_id: this.assetsFormEdit.label_id,
                    deviceName: this.assetsFormEdit.deviceName,
                    deviceTypeId: this.assetsFormEdit.deviceTypeId,
                    attr: this.assetsFormEdit.extendAttr,
                    sysAttr: this.assetsFormEdit.systemAttr,
                    pcSystem: this.assetsFormEdit.pcSystem,
                    systemId: this.assetsFormEdit.systemId,
                    ips: ips,
                    zoneId: this.assetsFormEdit.zoneId,
                    software: this.assetsFormEdit.applications,
                    users: this.assetsFormEdit.users.map(item => { return { userId: item.userId } }),
                    fullStatus: this.assetsFormEdit.fullStatus,
                    usableStatus: this.assetsFormEdit.usableStatus,
                    secretStatus: this.assetsFormEdit.secretStatus
                }
            }
            console.log('addAssets', data)
            findAssets(data).then(res => {
                console.log(res)
                this.editUserDialog = false
                this.$message({
                    message: '登记资产库成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(error => {
                this.editUserDialog = false
                console.log('error' + error)
            })
        },
        submitFormEdit(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.beforeHandel()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        beforeHandel() {
            let ips = []
            let ckeckIp = []
            let port = []
            let id = ''
            let allIps = []
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
            console.log('ips', ips)
            console.log('ckeckIp', ckeckIp)
            let data = {
                queryData: {
                    ips: ckeckIp.join(',')
                },
                paramsData: {}
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
                this.addAssets(ips)
            }).catch(error => {
                // this.addDomainDialog = false
                console.log('error' + error)
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
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    this.editUserDialog = false
                    done()
                })
                .catch(_ => {})
        },
        handleCommand(key, row) {
            console.log(key)
            switch (key) {
                case 'ass':
                    this.registerAss(row)
                    break
                case 'bussiness':
                    this.registerBus(row)
                    break
                default:
                    break
            }
        },
        registerAss(row) {
            console.log('row', row)
            // let allIps = row.ipsv6.concat(row.ipsv4)
            // if (allIps.length > 0) {
            //     allIps.forEach(item => {
            //         if (Array.isArray(item.port)) {
            //             item.port = item.port.join(',')
            //         }
            //     })
            // }
            this.assetsFormEdit = {
                id: row.id,
                isBoundary: '0',
                isDomestic: '0',
                labelId: row.label_id || '',
                deviceName: row.device_name || '',
                deviceTypeId: row.device_type_id || '',
                subnetMask: row.subnet_mask || '',
                pcSystem: row.pc_system || '',
                systemId: row.system_id || '',
                zoneId: row.zone_id || '', // 安全域名
                safetyBoundary: row.safety_boundary || '', // 安全边界

                manufacturerId: row.manufacturerId || '',
                modelInfo: row.modelInfo || '',
                pcSystemVersion: row.pcSystemVersion || '',
                uniqueCode: row.uniqueCode || '',
                ipsv4: [],
                ipsv6: [],
                applications: [],
                users: [],
                extendAttr: [],
                systemAttr: []
            }
            // row.systemUsers.forEach(item => {
            //     this.assetsFormEdit.users.push({
            //         userId: item.userId,
            //         phone: item.phone,
            //         departmentName: item.departmentName,
            //         chineseName: item.chineseName,
            //         mailBox: item.mailBox,
            //         code: item.code,
            //         landline: item.landline
            //     })
            // })
            this.innerLabel_edit = row.device_type_name || ''
            this.innerValue_edit = row.device_type_id || ''

            this.editUserDialog = true
        },
        handleDetail(row) {
            console.log('row', row)
            this.assetsFormSee = this.$deepCopy(row)
            this.seeDialog = true
        },
        handelRightSee(row) {}
    },
    beforeDestroy() {
        if (this.flag) {
            clearTimeout(this.flag)
            this.flag = null
        }
    }
}
</script>
<style lang="scss">
    .custom-star {
        .el-dialog__body {
            .el-descriptions__body {
                background: unset;
                .el-descriptions-item__label.is-bordered-label {
                    border: 1px solid #1cd7fa!important;
                    color: #ffffff!important;
                    background: unset!important;
                }
                .el-descriptions-item__cell {
                    border: 1px solid #1cd7fa!important;
                    color: #ffffff;
                }
            }
        }
    }
</style>

<style lang="scss" scoped>
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
.container ::v-deep .el-descriptions-item__label.is-bordered-label {
    width: 120px;
}
.fixedTable {
    ::-webkit-scrollbar {
        width: 6px; /* 纵向滚动条 宽度 */
        height: 5px; /* 横向滚动条 高度 */
        border-radius: 3px; /* 整体 圆角 */
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
.event ::v-deep .custom-tree-node {
    height: 26px;
    line-height: 26px;
}
.tree ::v-deep .el-tree--highlight-current .el-tree-node > .el-tree-node__content {
    .custom-tree-node {
        span:nth-child(1) {
            color: rbga(0, 0, 0, 0.9) !important;
        }
        span:nth-child(2) {
            color: #86939e !important;
        }
    }
}
.tree ::v-deep .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
    background-color: rgb(0 0 0 / 0%) !important;
    .custom-tree-node {
        span {
            color: #0052d9 !important;
        }
    }
}
.tree ::v-deep .el-tree--highlight-current .el-tree-node > .el-tree-node__content:hover {
    background-color: rgb(0 0 0 / 0%) !important;
    .custom-tree-node {
        span {
            color: #0052d9 !important;
        }
    }
}
.tree ::v-deep .el-checkbox__input.is-disabled .el-checkbox__inner {
    border-color: #0052d9;
    background-color: #0052d9;
}
.tree ::v-deep .el-checkbox__input .el-checkbox__inner,
.auto ::v-deep .el-checkbox__input .el-checkbox__inner {
    border-color: #0052d9 !important;
}
.tree ::v-deep .el-checkbox__input.is-focus .el-checkbox__inner,
.auto ::v-deep .el-checkbox__input.is-focus .el-checkbox__inner {
    border-color: #0052d9 !important;
}
.tree ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner,
.auto ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
    border-color: #0052d9;
    background-color: rgb(0 0 0 / 0%) !important;
}
.tree-option i {
    margin: 0 3px;
    cursor: pointer;
}
.tree ::v-deep .el-checkbox__inner::after,
.auto ::v-deep .el-checkbox__inner::after {
    border-color: #0052d9;
}
.tree ::v-deep .el-tree-node__content {
    background-color: rgb(0 0 0 / 0%) !important;
}
.auto ::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #0052d9;
}
.el-form--inline ::v-deep .mb0 {
    margin: 0 !important;
}
.rich-text {
    margin-bottom: 20px;
}
.mb0 ::v-deep .el-form-item__error {
    position: static !important;
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
    z-index: 10009 !important;
    width: 240px !important;
    border-radius: 4px;

    /* box-sizing: border-box!important; */
}
.el-dropdown-menu__item {
    // color: #fff !important;

    /* padding:5px 30px 5px 10px!important; */
}
.el-dropdown-menu__item:hover {
    color: rgb(0 0 0 / 90%) !important;
    background: none !important;
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
.el-dropdown-menu ::v-deep .el-checkbox__label {
    // color:rgba(0,0,0,.9) !important;
    width: 72px;
    box-sizing: border-box;
    font-size: 12px;
}
.el-dropdown-menu ::v-deep .el-checkbox {
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
.el-dropdown-menu ::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #0052d9;
}
.el-dropdown-menu ::v-deep .el-checkbox:nth-of-type(2n + 1) {
    margin-right: 30px;
}
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
.registeassets {
    color: #606266;
}
</style>
