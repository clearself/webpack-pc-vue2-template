<template>
    <div class="list">
        <div class="ub w100" style=" overflow: hidden;height: calc(100vh - 80px);">
            <div style="overflow-y: auto;border-radius: 4px;" class="mr-1 mb-1 tree">
                <div class="asset-tree" style="position: relative;">
                    <div class="ub ub-pj ub-ac w100" style="margin-top: 8px;margin-bottom: 10px;padding-left: 10px;box-sizing: border-box;">
                        <div class="list-tips" style="margin-bottom: 0;font-size: 12px;">分组列表</div>
                        <div class="tree-option" style="padding-right: 10px;font-size: 12px;color: #1cd7fa;">
                            <el-tooltip class="item" effect="dark" content="新增" placement="top-start">
                                <i class="iconfont icon-tianjiashu" style="font-size: 12px;color: #387dee;" @click="addRuleShow"></i>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                                <i v-if="get_params.groupIds.length<2" class="iconfont icon-xiugaishu" style="font-size: 12px;color: #387dee;" @click="editRuleShow"></i>
                            </el-tooltip>
                            <!-- <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                                <i class="iconfont icon-shanchushu" style="font-size: 12px;color:#387dee" @click="delRuleShow"></i>
                            </el-tooltip> -->
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
                        :data="groupList"
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
                <SearchTop @search="searchAssets" @reset="reset">
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="业务系统：" label-width="80px">
                                <el-input placeholder="请输入" clearable v-model.trim="get_params.systemName" @keyup.enter.native="searchAssets" size="small"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="域名：" label-width="80px">
                                <el-input placeholder="请输入" clearable v-model.trim="get_params.domainName" @keyup.enter.native="searchAssets" size="small"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="IP：" label-width="80px">
                                <el-input placeholder="请输入" clearable v-model.trim="get_params.ip" @keyup.enter.native="searchAssets" size="small"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </SearchTop>
                <div class="list-container">
                    <div class="ub ub-pj w100 mb-1 ub-ac">
                        <div class="list-tips">业务系统库</div>
                        <div>
                            <el-button size="small" icon="el-icon-plus" type="primary" title="添加业务系统" @click="addUser" v-per="['assets_system_add']">添加业务系统</el-button>
                            <el-button style="margin-left: 10px;" size="small" icon="el-icon-download" type="primary" @click="downLoad" v-per="['assets_system_xls']">下载模板</el-button>
                            <el-upload
                                action="/api/assets-manage/manage/system/importExcel"
                                name="fileUpload"
                                accept=".xlsx,.xlsx"
                                :headers="header"
                                :file-list="fileList"
                                :show-file-list="false"
                                :on-success="handleSuccess"
                                style="display: inline-block;">
                                <el-button style="margin-left: 10px;" type="primary" size="small" v-per="['assets_system_imp']" icon="iconfont icon-daoru">导入</el-button>
                            </el-upload>
                            <el-button style="margin-left: 10px;" type="primary" size="small" @click="downData" v-per="['assets_system_exp']" icon="iconfont icon-daochu">导出</el-button>
                            <el-button style="margin-left: 10px;" size="small" icon="el-icon-delete" type="danger" @click="delAllUserBtn" v-per="['assets_system_del']">删除</el-button>
                        </div>
                    </div>
                    <el-table
                        ref="multipleTable"
                        v-loading="loading"
                        class='bigTable'
                        :data="tableData"
                        border
                        stripe
                        tooltip-effect="dark"
                        :row-class-name="tableRowClassName"
                        @selection-change="handleSelectionChange"
                        :height="tabHeight"
                        :row-style="{ height: '32px' }"
                        :header-row-style="{ height: '32px' }">
                        <el-table-column align="center" type="selection" width="30"></el-table-column>
                        <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                        </el-table-column>
                        <el-table-column prop="systemName" label="业务系统名称" show-overflow-tooltip width="180">
                        </el-table-column>
                        <el-table-column prop="domainName" label="域名" show-overflow-tooltip width="180">
                            <template slot-scope="{row}">
                                <p v-for="(item,index) in row.infos" :key="index">{{item.domainName}}</p>
                            </template>
                        </el-table-column>
                        <el-table-column prop="ip" label="IP" width="180">
                            <template slot-scope="{row}">
                                <el-tag v-for="(item, index) in row.infos" :key="index" type="success" size="mini">{{item.ip}}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="users" label="资产联系人">
                            <template slot-scope="scope">
                                <!--eslint-disable-->
                        <el-tag v-if="item.chineseName" type="success" size="mini" v-for="(item,index) in scope.row.users" :key="index">{{item.chineseName}}</el-tag>
                        <!--eslint-disable-->
                    </template>
                </el-table-column>
                <el-table-column prop="" align="center" label="24小时事件" width="80"  fixed="right">
                    <template slot-scope="scope">
                        <span class="num-btn" style="text-decoration: underline;color: #0052d9;cursor: pointer;" @click="goSee(scope.row,'two')">{{scope.row.sjNum || 0}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="" align="center" label="24小时告警" width="80" fixed="right">
                    <template slot-scope="scope">
                        <span class="num-btn" style="text-decoration: underline;color: #0052d9;cursor: pointer;" @click="goSee(scope.row,'three')">{{scope.row.gjNum || 0}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="" align="center" label="24小时日志" width="80" fixed="right">
                    <template slot-scope="scope">
                        <span class="num-btn" style="text-decoration: underline;color: #0052d9;cursor: pointer;" @click="goSee(scope.row,'four')">{{scope.row.rzNum || 0}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="" align="center" label="待处理漏洞" width="80" fixed="right">
                    <template slot-scope="scope">
                        <span class="num-btn" style="text-decoration: underline;color: #0052d9;cursor: pointer;" @click="goSee(scope.row,'five')">{{scope.row.ldNum || 0}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="120" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="handleSee(JSON.parse(JSON.stringify(scope.row)))" v-per="['assets_system_look']">查看</el-button>
                        <el-button type="text" size="small" @click="handleEdit(scope.row)" v-per="['assets_system_edit']">编辑</el-button>
                        <el-button type="text" size="small" @click="delUserBtn(scope.row)" v-per="['assets_system_del']">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size" @pagination="get_data" style="padding-top: 10px;" v-show="total_num>0"/>
            </div>
        </div>
    </div>
        <!--增加内容开始-->
        <el-dialog title="添加业务系统" :visible.sync="addDomainDialog" width="700px" custom-class="common-dialog">
            <el-form :model="deviceForm" :inline="true" :rules="rules" ref="deviceForm" label-width="100px" label-position="top">
                <el-form-item label="系统名称：" prop="systemName">
                    <el-input size="small" clearable v-model="deviceForm.systemName" placeholder="请输入业务系统名称" autocomplete="off" style="width: 652px !important;"></el-input>
                </el-form-item>
                <el-form-item label="自定义分组：" prop="groupId">
                    <!-- <el-input size="small" clearable v-model="deviceForm.systemName" placeholder="请选择自定义分组" autocomplete="off" style="width:652px !important"></el-input> -->
                        <treeselect
                            node-key="id"
                            size="small"
                            class="treeselect"
                            style="margin-top: 3px;width: 652px;"
                            :options="groupList1"
                            :normalizer="normalizer"
                            noChildrenText="当前分支无子节点"
                            noOptionsText="无可用选项"
                            noResultsText="无可用选项"
                            placeholder="请选择自定义分组"
                            v-model="deviceForm.groupId"
                            loadingText="下拉框无匹配项"
                            :clearable="false"
                        />
                </el-form-item>
                <el-form-item label="业务系统描述：" prop="des">
                    <el-input size="small" clearable v-model="deviceForm.des" placeholder="请输入业务系统描述" autocomplete="off" style="width: 652px !important;"></el-input>
                </el-form-item>
                <el-form-item label="系统开发商：" prop="sysDeveloper">
                    <el-input size="small" clearable v-model="deviceForm.sysDeveloper" placeholder="请输入系统开发商" autocomplete="off" style="width: 652px !important;"></el-input>
                </el-form-item>
                <el-form-item label="系统维护商：" prop="sysMaintain">
                    <el-input size="small" clearable v-model="deviceForm.sysMaintain" placeholder="请输入系统维护商" autocomplete="off" style="width: 652px !important;"></el-input>
                </el-form-item>
                <el-form-item label="是否为互联网系统：" prop="sysInternet">
                    <el-select
                        v-model="deviceForm.sysInternet"
                        filterable
                        placeholder="请选择"
                        style="width: 652px;"
                        size="small"
                        clearable>
                        <el-option label="否" :value="0"></el-option>
                        <el-option label="是" :value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="系统开发语言：" prop="sysPerl">
                    <el-input size="small" clearable v-model="deviceForm.sysPerl" placeholder="请输入系统开发语言" autocomplete="off" style="width: 652px !important;"></el-input>
                </el-form-item>
                <el-form-item label="业务持续性：" prop="continuity">
                    <el-select
                        v-model="deviceForm.continuity"
                        filterable
                        placeholder="请选择"
                        style="width: 652px;"
                        size="small"
                        clearable>
                        <el-option label="低" :value="0"></el-option>
                        <el-option label="中" :value="1"></el-option>
                        <el-option label="高" :value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="资产完整性：" :label-width="formLabelWidth" prop="fullStatus">
                    <el-select v-model="deviceForm.fullStatus" size="small" placeholder="请选择" style="width: 652px;" filterable>
                        <el-option label="1" value="1"></el-option>
                        <el-option label="2" value="2"></el-option>
                        <el-option label="3" value="3"></el-option>
                        <el-option label="4" value="4"></el-option>
                        <el-option label="5" value="5"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="资产可用性：" :label-width="formLabelWidth" prop="usableStatus">
                    <el-select v-model="deviceForm.usableStatus" size="small" placeholder="请选择" style="width: 652px;" filterable>
                        <el-option label="1" value="1"></el-option>
                        <el-option label="2" value="2"></el-option>
                        <el-option label="3" value="3"></el-option>
                        <el-option label="4" value="4"></el-option>
                        <el-option label="5" value="5"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="资产机密性：" :label-width="formLabelWidth" prop="secretStatus">
                    <el-select v-model="deviceForm.secretStatus" size="small" placeholder="请选择" style="width: 652px;" filterable>
                        <el-option label="1" value="1"></el-option>
                        <el-option label="2" value="2"></el-option>
                        <el-option label="3" value="3"></el-option>
                        <el-option label="4" value="4"></el-option>
                        <el-option label="5" value="5"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="width: 100%;">
                    <div class="ub ub-pj w100">
                        <div style="font-size: 12px;color: rgb(0 0 0 / 90%);" class="star">联系人：</div>
                        <div style="cursor: pointer;" @click="addPeoples(deviceForm)">
                            <i style="color: #0052d9;" class="el-icon-plus"></i><span style="margin-left: 3px;font-size: 12px;color: #0052d9;">添加</span>
                        </div>
                    </div>
                    <div>
                        <el-table class='bigTable system' :data="deviceForm.users" border stripe tooltip-effect="dark">
                            <el-table-column align="center" type="index" width="50" label="序号">
                            </el-table-column>
                            <el-table-column label="联系人" align="center" width="130">
                                <template slot-scope="scope">
                                    <el-select style="width: 100px;" size="mini" v-model="scope.row.userId"  placeholder="请选择" @change="changeUser(scope.row)">
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
                                    <el-button @click="handleAddDelete(scope.$index,deviceForm)" icon="el-icon-remove-outline" title="删除" type="text" style="color: red;"></el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-form-item>

                <el-form-item style="margin-bottom: 0;width: 100%;">
                    <div class="ub ub-pj w100">
                        <div style="font-size: 12px;color: rgb(0 0 0 / 90%);" class="star"><span style="margin-right: 3px;color: red;">*</span>域名：</div>
                        <div style="cursor: pointer;" @click="addAddress(deviceForm)">
                            <i style="color: #0052d9;" class="el-icon-plus"></i><span style="margin-left: 3px;font-size: 12px;color: #0052d9;">添加</span>
                        </div>
                    </div>
                </el-form-item>
                <div>
                    <el-table class='bigTable system' :data="deviceForm.infos" border stripe tooltip-effect="dark">
                        <el-table-column align="center" type="index" width="50" label="序号">
                        </el-table-column>
                        <el-table-column label="域名" align="center">
                            <template slot-scope="scope">
                                <el-form-item :prop="'infos.' + scope.$index + '.domainName'" class="mb0" :rules="rules.domainName">
                                    <el-input size="mini" v-model.trim="scope.row.domainName" placeholder="请输入域名" autocomplete="off"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="IP" align="center">
                            <template slot-scope="scope">
                                <el-form-item :prop="'infos.' + scope.$index + '.ip'" class="mb0" :rules="rules.ip">
                                    <el-input size="mini" v-model.trim="scope.row.ip" placeholder="请输入IP" autocomplete="off"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="端口" align="center">
                            <template slot-scope="scope">
                                <el-form-item :prop="'infos.' + scope.$index + '.port'" class="mb0" :rules="rules.port">
                                    <el-input size="mini" type="number" v-model.trim="scope.row.port" placeholder="请输入端口" autocomplete="off"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="操作" width="50">
                            <template slot-scope="scope">
                                <el-button @click="handleAdressDelete(scope.$index,deviceForm)" title="删除" icon="el-icon-remove-outline" type="text" style="color: red;"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="addDomainDialog=false" size="small">取消</el-button>
                <el-button type="primary" @click="submitForm('deviceForm')" size="small">确认</el-button>
            </span>
        </el-dialog>
        <!--编辑内容-->
        <el-dialog title="编辑业务系统" :visible.sync="editUserDialog"  width="700px" custom-class="common-dialog">
            <el-form :model="assetsFormEdit" :inline="true" :rules="rules" ref="assetsFormEdit" label-width="100px" label-position="top">
                <el-form-item label="系统名称：" prop="systemName">
                    <el-input size="small"  style="width: 652px !important;" clearable v-model="assetsFormEdit.systemName" placeholder="请输入业务系统名称" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="自定义分组：" prop="groupId">
                        <treeselect
                        node-key="id"
                            size="small"
                            class="treeselect"
                            style="margin-top: 3px;width: 652px;"
                            :options="groupList1"
                            :normalizer="normalizer"
                            noChildrenText="当前分支无子节点"
                            noOptionsText="无可用选项"
                            noResultsText="无可用选项"
                            placeholder="请选择资产类型"
                            v-model="assetsFormEdit.groupId"
                            loadingText="下拉框无匹配项"
                            :clearable="false"
                        />
                </el-form-item>
                <el-form-item label="业务系统描述：" prop="des">
                    <el-input size="small" clearable v-model="assetsFormEdit.des" placeholder="请输入业务系统描述" autocomplete="off" style="width: 652px !important;"></el-input>
                </el-form-item>
                <el-form-item label="系统开发商：" prop="sysDeveloper">
                    <el-input size="small" clearable v-model="assetsFormEdit.sysDeveloper" placeholder="请输入系统开发商" autocomplete="off" style="width: 652px !important;"></el-input>
                </el-form-item>
                <el-form-item label="系统维护商：" prop="sysMaintain">
                    <el-input size="small" clearable v-model="assetsFormEdit.sysMaintain" placeholder="请输入系统开发商" autocomplete="off" style="width: 652px !important;"></el-input>
                </el-form-item>
                <el-form-item label="是否为互联网系统：" prop="sysInternet">
                    <el-select
                        v-model="assetsFormEdit.sysInternet"
                        filterable
                        placeholder="请选择"
                        style="width: 652px;"
                        size="small"
                        clearable>
                        <el-option label="不是" :value="0"></el-option>
                        <el-option label="是" :value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="系统开发语言：" prop="sysPerl">
                    <el-input size="small" clearable v-model="assetsFormEdit.sysPerl" placeholder="请输入系统开发语言" autocomplete="off" style="width: 652px !important;"></el-input>
                </el-form-item>
                <el-form-item label="业务持续性：" prop="continuity">
                    <el-select
                        v-model="assetsFormEdit.continuity"
                        filterable
                        placeholder="请选择"
                        style="width: 652px;"
                        size="small"
                        clearable>
                        <el-option label="低" :value="0"></el-option>
                        <el-option label="中" :value="1"></el-option>
                        <el-option label="高" :value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="资产完整性：" :label-width="formLabelWidth" prop="fullStatus">
                    <el-select v-model="assetsFormEdit.fullStatus" size="small" placeholder="请选择" style="width: 652px;" filterable>
                        <el-option label="1" value="1"></el-option>
                        <el-option label="2" value="2"></el-option>
                        <el-option label="3" value="3"></el-option>
                        <el-option label="4" value="4"></el-option>
                        <el-option label="5" value="5"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="资产可用性：" :label-width="formLabelWidth" prop="usableStatus">
                    <el-select v-model="assetsFormEdit.usableStatus" size="small" placeholder="请选择" style="width: 652px;" filterable>
                        <el-option label="1" value="1"></el-option>
                        <el-option label="2" value="2"></el-option>
                        <el-option label="3" value="3"></el-option>
                        <el-option label="4" value="4"></el-option>
                        <el-option label="5" value="5"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="资产机密性：" :label-width="formLabelWidth" prop="secretStatus">
                    <el-select v-model="assetsFormEdit.secretStatus" size="small" placeholder="请选择" style="width: 652px;" filterable>
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
                        <div style="cursor: pointer;" @click="editPeoples(assetsFormEdit)">
                            <i style="color: #0052d9;" class="el-icon-plus"></i><span style="margin-left: 3px;font-size: 12px;color: #0052d9;">添加</span>
                        </div>
                    </div>
                    <div>
                        <el-table class='bigTable system' :data="assetsFormEdit.users" border stripe tooltip-effect="dark">
                            <el-table-column align="center" type="index" width="50" label="序号">
                            </el-table-column>
                            <el-table-column label="联系人" prop="userId" align="center" width="130">
                                <template slot-scope="scope">
                                    <el-select style="width: 100px;" size="mini" v-model="scope.row.userId" filterable placeholder="请选择" @change="changeUser(scope.row)">
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
                                    <el-button @click="handleEditDelete(scope.$index,assetsFormEdit)" title="删除" icon="el-icon-remove-outline" type="text" style="color: red;"></el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-form-item>

                <el-form-item style="margin-bottom: 0;width: 100%;">
                    <div class="ub ub-pj w100">
                        <div style="font-size: 12px;color: rgb(0 0 0 / 90%);"><span style="margin-right: 3px;color: red;">*</span>域名：</div>
                        <div style="cursor: pointer;" @click="editAddress(assetsFormEdit)">
                            <i style="color: #0052d9;" class="el-icon-plus"></i><span style="margin-left: 3px;font-size: 12px;color: #0052d9;">添加</span>
                        </div>
                    </div>
                </el-form-item>
                <div>
                    <el-table class='bigTable system' :data="assetsFormEdit.infos" border stripe tooltip-effect="dark">
                        <el-table-column align="center" type="index" width="50" label="序号">
                        </el-table-column>
                        <el-table-column label="域名" align="center">
                            <template slot-scope="scope">
                                <el-form-item :prop="'infos.' + scope.$index + '.domainName'" class="mb0" :rules="rules.domainName">
                                    <el-input size="mini" v-model.trim="scope.row.domainName" placeholder="请输入域名" autocomplete="off"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="IP" align="center">
                            <template slot-scope="scope">
                                <el-form-item :prop="'infos.' + scope.$index + '.ip'" class="mb0" :rules="rules.ip">
                                    <el-input size="mini" v-model.trim="scope.row.ip" placeholder="请输入IP" autocomplete="off"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="端口" align="center">
                            <template slot-scope="scope">
                                <el-form-item :prop="'infos.' + scope.$index + '.port'" class="mb0" :rules="rules.port">
                                    <el-input size="mini" type="number" v-model.trim="scope.row.port" placeholder="请输入端口" autocomplete="off"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="操作" width="50">
                            <template slot-scope="scope">
                                <el-button @click="editAddressDelete(scope.$index,assetsFormEdit)" title="删除" icon="el-icon-remove-outline" type="text" style="color: red;"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editUserDialog=false" size="small">取消</el-button>
                <el-button type="primary" @click="submitFormEdit('assetsFormEdit')" size="small">确认</el-button>
            </span>
        </el-dialog>

        <!--查看内容-->
        <el-dialog title="查看业务系统" :visible.sync="seeDetaildialog" width="700px" custom-class="common-dialog" class="seedetail">
                <el-descriptions size="mini" border>
                    <el-descriptions-item label="业务系统">{{seeForm.systemName}}</el-descriptions-item>
                </el-descriptions>
                        <el-table class='bigTable system mt-1' :data="seeForm.users" border stripe tooltip-effect="dark" :row-style="{ height: '32px' }">
                            <el-table-column align="center" type="index" width="50" label="序号">
                            </el-table-column>
                            <el-table-column label="联系人" prop="chineseName" width="100" align="center">
                            </el-table-column>
                            <el-table-column prop="code" label="员工编号" width="80" align="center">
                            </el-table-column>
                            <el-table-column prop="departmentName" label="部门" width="100" align="center">
                            </el-table-column>
                            <el-table-column prop="phone" label="电话" show-overflow-tooltip align="center">
                            </el-table-column>
                            <el-table-column prop="landline" label="座机" show-overflow-tooltip align="center">
                            </el-table-column>
                            <el-table-column prop="mailBox" label="邮箱" align="center">
                            </el-table-column>
                        </el-table>
                        <el-table class='bigTable system mt-1' :data="seeForm.infos" border stripe tooltip-effect="dark" :row-style="{ height: '32px' }"
                :header-row-style="{ height: '32px' }">
                            <el-table-column align="center" type="index" width="50" label="序号">
                            </el-table-column>
                            <el-table-column prop="domainName" label="域名" align="center">
                            </el-table-column>
                            <el-table-column prop="ip" label="IP" align="center">
                            </el-table-column>
                            <el-table-column prop="port" label="端口" align="center">
                            </el-table-column>
                            <el-table-column prop="extranet_ip" label="外网IP" align="center">
                            </el-table-column>
                            <el-table-column prop="extranet_port" label="外网端口" align="center">
                            </el-table-column>
                            <el-table-column prop="fictitious_ip" label="虚IP" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column prop="fictitious_port" label="虚端口" show-overflow-tooltip>
                            </el-table-column>
                        </el-table>
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
        <AssetsDetailDrawer :assetsSeeDialog="drawerSeeDialog" ref="assetsDetailDrawer"  :activeName="activeName" :system="system"></AssetsDetailDrawer>
        <el-dialog :title="addGroupForm.id?'编辑分组':'创建分组'" :visible.sync="addGroupDialog" width="700px" custom-class="common-dialog">
            <el-form :model="addGroupForm" :rules="addGroupRules" ref="addGroupForm" label-position="top">
                <el-form-item label="分组名称：" prop="name" label-width="100px">
                    <el-input style="width: 100%;" placeholder="请输入" clearable v-model="addGroupForm.name" size="small"></el-input>
                </el-form-item>
                <el-form-item label="上级分组：" prop="parentId" label-width="100px">
                    <treeselect
                        size="small"
                        class="treeselect"
                        style="margin-top: 3px;width: 680px;"
                        :options="groupList1"
                        :normalizer="normalizer"
                        noChildrenText="当前分支无子节点"
                        noOptionsText="无可用选项"
                        noResultsText="无可用选项"
                        placeholder="请选择资产类型"
                        v-model="addGroupForm.parentId"
                        loadingText="下拉框无匹配项"
                        :clearable="false"
                    />
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
    </div>
</template>

<script>
import {
    get_types,
    addSystem,
    updateSystem,
    getSystem,
    delectSystem,
    getUsers,
    systemExportExcel1,
    systemTemplate,
    get_asset_info_tree,
    getTree,
    addGroup,
    updateGroup
} from '../../server/assets/api.js'

import AssetsDetailDrawer from './assets_detail_drawer/index.vue'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
    name: 'User',
    components: {
        AssetsDetailDrawer,
        Treeselect
    },
    data() {
        return {
            formLabelWidth: '100px',
            system: '',
            activeName: '',
            addGroupDialog: false,
            groupList: [],
            groupList1: [],
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
            delGroupDialog: false,
            normalizer(node) {
                if (node.children && !node.children.length) {
                    delete node.children
                }
                return {
                    id: node.id,
                    label: node.name,
                    children: node.children
                }
            },
            addGroupForm: {
                id: '',
                name: '',
                parentId: null

            },
            filterText: '',
            drawerSeeDialog: false,
            tabHeight: document.body.clientHeight - 260,
            fileList: [],
            existIp: '',
            types: [],
            loading: false,
            total_num: 0,
            tableData: [],
            multipleSelection: [],
            get_params: {
                page: 1,
                size: 20,
                systemName: '',
                domainName: '',
                ip: '',
                groupIds: [],
                orgIds: []
            },
            userDeleteDialog: false,
            userDeleteAllDialog: false,
            delIds: [],
            addDomainDialog: false,
            editUserDialog: false,
            seeDetaildialog: false,
            ips: [{
                value: ''
            }],
            upstreamVoList: [{
                state: '1',
                value: ''
            }],
            deviceForm: {
                systemName: '',
                domainName: '',
                ip: '',
                port: '',
                users: [],
                infos: [],
                groupId: null,
                des: '',
                sysDeveloper: '',
                sysMaintain: '',
                sysInternet: '',
                sysPerl: '',
                continuity: '',
                fullStatus: '',
                usableStatus: '',
                secretStatus: ''
            },
            assetsFormEdit: {
                id: '',
                systemName: '',
                domainName: '',
                ip: '',
                port: '',
                users: [],
                infos: [],
                groupId: null,
                des: '',
                sysDeveloper: '',
                sysMaintain: '',
                sysInternet: '',
                sysPerl: '',
                continuity: '',
                fullStatus: '',
                usableStatus: '',
                secretStatus: ''
            },
            seeForm: {
                id: '',
                systemName: '',
                users: [],
                infos: []
            },
            users: [],
            rules: {
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
            currentNode: {
                id: ''
            },
            currentNodeData: [],
            assetPropsData: {
                id: 'id',
                children: 'children',
                label: 'name'
                // disabled: (node) => {
                //     if (node.type && node.type == 1) {
                //         return false
                //     } else {
                //         return true
                //     }
                // }
            },
            assetTreeData: [],
            indent: 10
        }
    },
    watch: {
        addDomainDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.deviceForm.resetFields()
                    this.deviceForm.infos = []
                    this.deviceForm.users = []
                }
            }
        },
        editUserDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.assetsFormEdit.resetFields()
                    this.assetsFormEdit.infos = []
                    this.assetsFormEdit.users = []
                }
            }
        },
        filterText(val) {
            this.$refs['asset-tree'].filter(val)
        }
    },
    mounted() {
        this.$nextTick(() => {
            // this.getTypes();
            this.initUser()
            this.get_data()
            // this.initTree()
            this.getFindGroup()
        })
    },
    computed: {
        header() {
            return { token: this.$getlocalStorage('initInfo').user.token }
        }
    },
    methods: {
        treeCheck(node, list) {
            console.log(node)
            this.currentNode = node
            this.currentNodeData = this.$refs['asset-tree'].getCheckedNodes()
            if (this.currentNodeData.length > 0) {
                this.get_params.groupIds = this.currentNodeData.filter(item => {
                    return item.type == 1
                }).map(val => val.id)
                this.get_params.orgIds = this.currentNodeData.filter(item => {
                    return item.type == 0
                }).map(val => val.id)
            } else {
                this.get_params.groupIds = []
                this.get_params.orgIds = []
            }
            this.initParams()
            this.get_data()
            // if (list.checkedKeys.length == 2) {
            //     this.$refs['asset-tree'].setCheckedKeys([node.PHY_ID])
            //     this.currentNode = { id: '' }
            // }
        },
        goSee(data, val) {
            console.log(data)
            this.seeForm = {
                id: data.id,
                systemName: data.systemName,
                users: JSON.parse(JSON.stringify(data.users)),
                infos: JSON.parse(JSON.stringify(data.infos))
            }
            if (data.infos.length > 0) {
                this.$refs.assetsDetailDrawer.ipsData = data.infos.map(item => item.ip)
            }
            this.$refs.assetsDetailDrawer.assetsId = data.id
            this.$refs.assetsDetailDrawer.seeSystem = this.seeForm
            this.system = 'system'
            this.activeName = val
            this.drawerSeeDialog = true
        },
        getFindGroup() {
            this.groupList = []
            this.groupList1 = []
            let data = {
                queryData: {},
                paramsData: {}
            }
            getTree(data).then(res => {
                this.groupList = res
                res.map(item => {
                    if (item.type == 1) {
                        this.groupList1.push(item)
                    }
                })
            }).catch(error => {
                console.log('error' + error)
            })
        },
        handleDeleteGroupFun() {
            let data = {
                queryData: {},
                paramsData: {
                    id: this.currentNode.id
                }
            }
            console.log(data)
            // deleteGroup(data).then(res => {
            //     this.delGroupDialog = false
            //     console.log('删除成功')
            //     this.$message({
            //         message: '删除成功',
            //         type: 'success'
            //     })
            //     setTimeout(() => {
            //         this.initTree()
            //         this.get_data()
            //     }, 1500)
            // }).catch(error => {
            //     console.log(error + 'error')
            // })
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
            if (this.addGroupForm.id) {
                let data = {
                    queryData: {},
                    paramsData: {
                        id: this.addGroupForm.id,
                        name: this.addGroupForm.name,
                        parentId: this.addGroupForm.parentId == 'zdy' ? '' : this.addGroupForm.parentId
                    }
                }
                updateGroup(data).then(res => {
                    this.addGroupDialog = false
                    if (this.addGroupForm.id) {
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        })
                    } else {
                        this.$message({
                            message: '添加成功',
                            type: 'success'
                        })
                    }
                    setTimeout(() => {
                        this.getFindGroup()
                    }, 1500)
                }).catch(error => {
                    console.log(error + 'error')
                })
            } else {
                let data = {
                    queryData: {},
                    paramsData: {
                        name: this.addGroupForm.name,
                        parentId: this.addGroupForm.parentId
                    }
                }
                addGroup(data).then(res => {
                    this.addGroupDialog = false
                    if (this.addGroupForm.id) {
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        })
                    } else {
                        this.$message({
                            message: '添加成功',
                            type: 'success'
                        })
                    }
                    setTimeout(() => {
                        this.getFindGroup()
                    }, 1500)
                }).catch(error => {
                    console.log(error + 'error')
                })
            }
        },
        addRuleShow() {
            this.addGroupForm.id = ''
            this.addGroupForm.name = ''
            this.addGroupForm.parentId = null
            this.addGroupDialog = true
        },
        editRuleShow() {
            this.addGroupForm.id = ''
            this.addGroupForm.name = ''
            this.addGroupForm.parentId = null
            if (this.currentNode.name == '自定义分组') {
                this.$message({
                    message: '顶级组织不可以编辑',
                    type: 'warning'
                })
                return
            }
            let selects = this.$refs['asset-tree'].getCheckedKeys()
            console.log(this.currentNode)
            if (selects.length === 0) {
                this.$message({
                    message: '请勾选',
                    type: 'warning'
                })
                return
            }
            this.addGroupForm.id = this.currentNode.id
            this.addGroupForm.name = this.currentNode.name
            this.addGroupForm.parentId = this.currentNode.parentId ? this.currentNode.parentId : 'zdy'
            this.addGroupDialog = true
        },
        delRuleShow() {
            this.delGroupDialog = true
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
        initParams() {
            this.get_params.page = 1
            this.get_params.size = 20
            this.total_num = 0
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
            // console.log(node)
            this.currentNode = node
            if (this.isClick) {
                this.currentNodeId = node.id
            }
            // this.$refs['asset-tree'].setCurrentKey(node.id)

            this.depId = node.id
        },
        filterNode(value, data) {
            console.log(value, data)
            if (!value) return true
            return data.name.indexOf(value) !== -1
        },
        tableRowClassName({ row, rowIndex }) {
            console.log(rowIndex)
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
                systemName: '',
                domainName: '',
                ip: '',
                groupIds: [],
                orgIds: []
            }
            this.$refs['asset-tree'].setCheckedKeys([])
            if (this.loading == false) {
                this.get_data()
            }
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
                    systemName: this.resetData(this.get_params.systemName),
                    domainName: this.get_params.domainName,
                    ip: this.get_params.ip,
                    groupIds: this.get_params.groupIds,
                    orgIds: this.get_params.orgIds
                }
            }
            systemExportExcel1(data).then(res => {
                console.log(res)
            })
        },
        downLoad() {
            // window.location.href = '/api/assets-manage/manage/system/template'
            let data = {
                queryData: {},
                paramsData: {}
            }
            systemTemplate(data).then(res => {
                console.log(res)
            })
        },
        addPeoples(deviceForm) {
            deviceForm.users.push({
                userId: '',
                departmentName: '',
                mailBox: '',
                phone: '',
                code: '',
                landline: ''
            })
        },
        addAddress(deviceForm) {
            deviceForm.infos.push({
                domainName: '',
                ip: '',
                port: ''
            })
        },
        handleAddDelete(index, deviceForm) {
            deviceForm.users.splice(index, 1)
        },
        handleAdressDelete(index, deviceForm) {
            deviceForm.infos.splice(index, 1)
        },
        editPeoples(assetsFormEdit) {
            assetsFormEdit.users.push({
                userId: '',
                departmentName: '',
                mailBox: '',
                phone: '',
                code: '',
                landline: ''
            })
        },
        editAddress(assetsFormEdit) {
            console.log(assetsFormEdit)
            assetsFormEdit.infos.push({
                domainName: '',
                ip: '',
                port: ''
            })
        },
        handleEditDelete(index, assetsFormEdit) {
            assetsFormEdit.users.splice(index, 1)
        },
        editAddressDelete(index, assetsFormEdit) {
            console.log(index, assetsFormEdit)
            assetsFormEdit.infos.splice(index, 1)
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
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        initUser() {
            this.users = []
            let data = {
                queryData: {},
                paramsData: {}
            }
            getUsers(data).then(res => {
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
            }).catch(error => {
                console.log('error' + error)
            })
        },
        getTypes() {
            this.types = []
            let data = {}
            get_types(data).then(res => {
                console.log(res)
                if (res.length > 0) {
                    res.forEach(item => {
                        let obj = {}
                        obj.value = item.id
                        obj.label = item.name
                        this.types.push(obj)
                    })
                }
            }).catch(error => {
                console.log('error' + error)
            })
        },

        searchAssets() {
            this.get_params.page = 1
            if (this.loading == false) {
                this.get_data()
            }
        },
        get_data() {
            // if (this.currentNode.id == 'zzjg' || this.currentNode.id == 'zdy') {
            //     return
            // }
            console.log(this.currentNode)
            this.loading = true
            this.tableData = []
            let data = {
                queryData: {
                    page: this.get_params.page,
                    pageSize: this.get_params.size
                },
                paramsData: {
                    groupIds: this.get_params.groupIds,
                    orgIds: this.get_params.orgIds,
                    systemName: this.get_params.systemName,
                    domainName: this.get_params.domainName,
                    ip: this.get_params.ip
                    // type: this.currentNode.type,
                    // groupId: this.currentNode.id == 'zzjg' || this.currentNode.id == 'zdy' ? '' : this.currentNode.id
                }
            }
            getSystem(data).then(res => {
                console.log('getSystem', res)
                this.total_num = res.total
                if (res.records.length > 0) {
                    this.tableData = res.records.map(item => {
                        return {
                            create_time: item.createTime,
                            systemName: item.systemName,
                            id: item.id,
                            status: item.status,
                            version: item.version,
                            users: item.users,
                            infos: item.infos,
                            groupId: item.groupId,
                            des: item.des,
                            sysDeveloper: item.sysDeveloper,
                            sysMaintain: item.sysMaintain,
                            sysInternet: item.sysInternet,
                            sysPerl: item.sysPerl,
                            continuity: item.continuity,
                            ldNum: item.ldNum,
                            sjNum: item.sjNum,
                            rzNum: item.rzNum,
                            gjNum: item.gjNum,
                            fullStatus: item.fullStatus,
                            usableStatus: item.usableStatus,
                            secretStatus: item.secretStatus
                        }
                    })
                } else {
                    this.tableData = []
                }
                this.loading = false
            }).catch(error => {
                this.loading = false
                console.log('error' + error)
            })
        },
        addUser() {
            this.addDomainDialog = true
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.addAssets()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        addAssets() {
            console.log(this.deviceForm)
            let data = {
                queryData: {},
                paramsData: {
                    systemName: this.deviceForm.systemName,
                    users: this.deviceForm.users.map(item => { return { userId: item.userId } }),
                    infos: this.deviceForm.infos,
                    groupId: this.deviceForm.groupId,
                    des: this.deviceForm.des,
                    sysDeveloper: this.deviceForm.sysDeveloper,
                    sysMaintain: this.deviceForm.sysMaintain,
                    sysInternet: this.deviceForm.sysInternet,
                    sysPerl: this.deviceForm.sysPerl,
                    continuity: this.deviceForm.continuity,
                    fullStatus: this.deviceForm.fullStatus,
                    usableStatus: this.deviceForm.usableStatus,
                    secretStatus: this.deviceForm.secretStatus
                }
            }
            if (this.deviceForm.infos.length == 0) {
                this.$message.warning('请添加域名')
                return
            }
            if (this.deviceForm.users && this.deviceForm.users[0] && !this.deviceForm.users[0].userId) {
                this.$message.warning('已添加联系人不能为空')
                return
            }
            if (this.deviceForm.infos && this.deviceForm.infos[0] && (!this.deviceForm.infos[0].domainName || !this.deviceForm.infos[0].ip)) {
                this.$message.warning('已添加域名或ip不能为空')
                return
            }
            console.log('data', data)
            addSystem(data).then(res => {
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
                // this.addDomainDialog = false
                console.log('error' + error)
            })
        },
        editAssets() {
            let data = {
                queryData: {},
                paramsData: {
                    id: this.assetsFormEdit.id,
                    systemName: this.assetsFormEdit.systemName,
                    users: this.assetsFormEdit.users.map(item => { return { userId: item.userId } }),
                    infos: this.assetsFormEdit.infos,
                    groupId: this.assetsFormEdit.groupId,
                    des: this.assetsFormEdit.des,
                    sysDeveloper: this.assetsFormEdit.sysDeveloper,
                    sysMaintain: this.assetsFormEdit.sysMaintain,
                    sysInternet: this.assetsFormEdit.sysInternet,
                    sysPerl: this.assetsFormEdit.sysPerl,
                    continuity: this.assetsFormEdit.continuity,
                    fullStatus: this.assetsFormEdit.fullStatus,
                    usableStatus: this.assetsFormEdit.usableStatus,
                    secretStatus: this.assetsFormEdit.secretStatus
                }
            }
            if (this.assetsFormEdit.infos.length == 0) {
                this.$message.warning('请添加域名')
                return
            }
            if (this.assetsFormEdit.users && this.assetsFormEdit.users[0] && !this.assetsFormEdit.users[0].userId) {
                this.$message.warning('已添加联系人不能为空')
                return
            }
            if (this.assetsFormEdit.infos && this.assetsFormEdit.infos[0] && (!this.assetsFormEdit.infos[0].domainName || !this.assetsFormEdit.infos[0].ip)) {
                this.$message.warning('已添加域名或ip不能为空')
                return
            }
            updateSystem(data).then(res => {
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
                    this.editAssets()
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
                    message: '请选择要删除的业务系统',
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
                queryData: {
                },
                paramsData: {
                    ids: this.delIds
                }
            }
            delectSystem(data).then(res => {
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
        handleSee(row) {
            this.system = 'system'
            this.activeName = 'first'
            this.seeForm = {
                id: row.id,
                systemName: row.systemName,
                users: JSON.parse(JSON.stringify(row.users)),
                infos: JSON.parse(JSON.stringify(row.infos))
            }
            if (row.infos.length > 0) {
                this.$refs.assetsDetailDrawer.ipsData = row.infos.map(item => item.ip)
            }
            this.$refs.assetsDetailDrawer.seeSystem = this.seeForm
            this.$refs.assetsDetailDrawer.assetsId = row.id
            this.$refs.assetsDetailDrawer.seeSystem = this.seeForm
            // this.$setsessionStorage('seeSystem', this.seeForm)
            // this.seeDetaildialog = true
            this.drawerSeeDialog = true
        },
        handleEdit(row) {
            console.log('row', row)
            this.editUserDialog = true
            this.assetsFormEdit = {
                id: row.id,
                systemName: row.systemName,
                users: [],
                infos: [],
                groupId: row.groupId ? row.groupId : null,
                des: row.des,
                sysDeveloper: row.sysDeveloper,
                sysMaintain: row.sysMaintain,
                sysInternet: row.sysInternet,
                sysPerl: row.sysPerl,
                continuity: row.continuity,
                fullStatus: row.fullStatus,
                usableStatus: row.usableStatus,
                secretStatus: row.secretStatus
            }
            row.users.forEach(item => {
                this.assetsFormEdit.users.push({
                    userId: item.userId,
                    phone: item.phone,
                    departmentName: item.departmentName,
                    chineseName: item.chineseName,
                    mailBox: item.mailBox,
                    code: item.code,
                    landline: item.landline
                })
            })
            row.infos.forEach(item => {
                this.assetsFormEdit.infos.push({
                    domainName: item.domainName,
                    ip: item.ip,
                    port: item.port
                })
            })
        },
        handleView(row) {
            this.$setsessionStorage('assetsInfo', row)
            this.$router.push({
                path: this.$route.path + '/tp'
            })
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
    .tree {
        border: 1px solid #1cd7fa;
        border-radius: 4px;
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
}
.tree {
    border: solid 1px #dadee8;
    background: #ffffff;
}
.list {
    ::v-deep .el-drawer__container {
        background: rgb(0 0 0 / 40%);
    }
}
.tree-option i {
    margin: 0 3px;
    cursor: pointer;
}
.seedetail {
    ::v-deep .el-descriptions-item__label {
        width: 100px !important;
    }
}
.el-input.ips {
    display: block;
    width: 100%;
}
.roles ::v-deep .el-tag.el-tag--success {
    border-color: #01c5ff;
    color: #00fdff;
    background-color: rgb(0 0 0 / 0%);
}
.event  ::v-deep  .el-dialog {
    position: absolute;
    top: 110px;
    left: 50%;
    display: flex;
    margin: 0 !important;
    max-width: calc(100% - 50px);
    max-height: calc(100% - 150px);
    transform: translateX(-50%);
    flex-direction: column;
}
.event  ::v-deep .el-dialog__body {
    overflow: auto;
}
.el-form--inline  ::v-deep .mb0 {
    margin: 0!important;
}
.mb0  ::v-deep .el-form-item__error {
    position: static!important;
    text-align: left;
}
.bigTable ::v-deep .el-tag.el-tag--success {
    border-color: #01c5ff;
    color: #00fdff;
    background-color: transparent;
}
.event .el-input.is-disabled .el-input__inner {
    box-shadow: none;
}
</style>
