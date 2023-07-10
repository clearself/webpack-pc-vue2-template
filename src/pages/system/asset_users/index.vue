<template>
    <div class="event">
        <div class="ub w100">
            <div class="event-content mr-1" style="width:200px;padding: 20px 5px 10px;box-sizing: border-box;background-color: #fff;overflow: auto;overflow-x: hidden;">
                <div class="tree">
                    <!-- <span style="position: absolute;width:10px;height:10px;background: red;top:50%;right:0;"></span> -->
                    <div class="ub ub-pj ub-ac w100" style="padding-left:10px;margin-bottom: 20px;">
                        <div class="list-tips" style="margin-bottom: 0;font-size:14px;">组织</div>
                        <div class="tree-option" style="font-size:16px;color:#387dee;padding-right:10px;">
                            <el-tooltip class="item" effect="dark" content="新增" placement="top-start">
                                <i class="iconfont icon-tianjia1" @click="addRuleShow"></i>
                            </el-tooltip>
                            <el-tooltip class="item" v-if="currentNode.id!=''" effect="dark" content="编辑" placement="top-start">
                                <i class="iconfont icon-xiugai" @click="editRuleShow"></i>
                            </el-tooltip>
                            <el-tooltip class="item" v-if="currentNode.id!=''" effect="dark" content="删除" placement="top-start">
                                <i class="iconfont icon-shanchu1" @click="delRuleShow"></i>
                            </el-tooltip>
                        </div>
                    </div>
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
                        <span class="custom-tree-node" slot-scope="{ node, data }">
                            <span style="font-size:12px;">{{ node.label }}</span>
                            <span style="color:#718492;font-size:12px;">
                                ({{ data.number }})
                            </span>
                        </span>
                    </el-tree>
                </div>
            </div>
            <div class="ub ub-f1 ub-ver" style="height: 100%;overflow: auto">
                <SearchTop @search="searchCheck" @reset="reset" @isOpen="isOpen1">
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="员工编号：" label-width="80px">
                                <el-input placeholder="请输入员工编号" clearable v-model.trim="get_params.code" @keyup.enter.native="searchCheck" size="small"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="员工姓名：" label-width="80px">
                                <el-input placeholder="请输入员工姓名" clearable v-model.trim="get_params.name" @keyup.enter.native="searchCheck" size="small"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="手机号：" label-width="80px">
                                <el-input placeholder="请输入手机号" clearable v-model.trim="get_params.phone" @keyup.enter.native="searchCheck" size="small"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="邮 箱：" label-width="80px">
                                <el-input placeholder="请输入邮箱" clearable v-model.trim="get_params.email" @keyup.enter.native="searchCheck" size="small"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="座机号：" label-width="80px">
                                <el-input placeholder="请输入座机号" clearable v-model.trim="get_params.landline" @keyup.enter.native="searchCheck" size="small"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </SearchTop>
                <div class="list-container">
                    <div class="ub ub-pj w100 mb-1">
                        <div class="list-tips" style="width:100px">资产用户管理
                        </div>
                        <div>
                            <el-button v-per="['base_asset_sync']" size="small" icon="el-icon-refresh" type="primary" @click="openSyncDialog">数据同步</el-button>
                            <el-button v-per="['base_asset_data']" size="small" icon="iconfont icon-duqu" type="primary" @click="syncAD">AD域数据读取</el-button>
                            <el-button v-per="['base_asset_add']" size="small" icon="el-icon-plus" type="primary" @click="addPersonDialog = true">添 加</el-button>

                            <el-button v-per="['base_asset_set']" size="small" icon="el-icon-refresh" type="primary" @click="$router.push('/system/ad_config')">AD域同步配置</el-button>

                            <el-upload
                                :headers="header"
                                action="/api/base-server/manage/assetsUser/importExcel"
                                name="fileUpload"
                                accept=".xlsx,.xlsx"
                                :file-list="fileList"
                                :show-file-list="false"
                                :on-success="handleSuccess"
                                style="display: inline-block;">
                                <el-button  v-per="['base_asset_import']" size="small" style="margin-right:6px;margin-left:6px" icon="iconfont icon-daoru" type="primary">导 入</el-button>
                            </el-upload>
                            <el-button v-per="['base_asset_export']" size="small" icon="iconfont icon-daochu" type="primary" @click="handleDown">导 出</el-button>
                            <el-button v-per="['base_asset_template']" @click="handleDownTemplate" size="small" icon="el-icon-download" type="primary">下载模板</el-button>
                            <el-button  v-per="['base_asset_del']" @click="handleDeleteAll" size="small" icon="el-icon-delete" type="danger">刪 除</el-button>
                        </div>
                    </div>
                    <!--没加搜索,临时加最小高度-->
                    <el-table
                        :height="tableHeight"
                        ref="multipleTable"
                        v-loading="loading"
                        class='bigTable outer'
                        :data="tableData"
                        border
                        stripe
                        tooltip-effect="dark"
                        :row-class-name="tableRowClassName"
                        :row-style="{ height: '32px' }"
                        :header-row-style="{ height: '32px' }"
                        @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="50">
                        </el-table-column>
                        <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                        </el-table-column>
                        <el-table-column prop="code" label="员工编号" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="name" label="员工姓名" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="depName" label="部门" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="job" label="职位">
                        </el-table-column>
                        <el-table-column prop="landline" label="座机号" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="email" label="邮箱" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="phone" label="手机号" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column align="center" label="操作" width="100">
                            <template slot-scope="scope">
                                <el-button v-per="['base_asset_edit']" type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                                <el-button v-per="['base_asset_del']" type="text" size="small" @click="handleDelete(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <pagination v-show="total_num>0" :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size" @pagination="get_data" />
                </div>
            </div>
        </div>

        <el-dialog title="添加人员" :visible.sync="addPersonDialog" width="700px" custom-class="common-dialog">
            <el-form :model="addPersonForm" :rules="user_rules_add" ref="addPersonForm" inline label-position="top">
                <div class="ub w100 ub-pj">
                    <el-form-item label="所属部门：" prop="department"  label-width="120px"  style="width: 30%;">
                        <!--<el-input style="width:210px;" placeholder="请输入" clearable v-model="addPersonForm.department" size="small"></el-input>-->
                        <div class="select-box tree">
                            <div style="cursor:pointer;" class="ub ub-ac select-title" @click.stop="onOff=!onOff">
                                <div class="ub ub-f1 ub-ac" style="text-indent: 14px;line-height: 32px;"><span style="opacity: 0.7" v-if="!currentGroup_addPerson">请选择</span>{{currentGroup_addPerson}}</div>
                                <div style="width:28px;height:32px;text-align: center;line-height: 32px;">
                                    <i style="color:rgba(0, 0, 0, 0.4);" :class="{'el-icon-arrow-up':onOff,'el-icon-arrow-down':!onOff}"></i>
                                </div>
                            </div>
                            <div v-show="onOff" class="select-mask">
                                <el-tree
                                    show-checkbox
                                    ref="tree_addPerson"
                                    node-key="id"
                                    :default-expand-all="true"
                                    :highlight-current="true"
                                    :data="treeData"
                                    :props='propsData'
                                    :check-strictly="true"
                                    :expand-on-click-node="false"
                                    :indent='indent'
                                    @check-change="handleClick_addPerson">
                                    <span class="custom-tree-node" slot-scope="{ node}">
                                        <span style="font-size:14px;">{{ node.label }}</span></span>
                                </el-tree>
                            </div>
                        <!--<div v-if="!addPersonForm.department" style="position:absolute;left:0;top:32px;line-height:20px;font-size:12px;color:#F56C6C;">请选择所属部门</div>-->
                        </div>
                    </el-form-item>
                    <el-form-item label="员工姓名：" prop="name" label-width="120px"  style="width: 30%;">
                        <el-input style="width:210px;" placeholder="请输入" clearable v-model="addPersonForm.name" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="员工编号：" prop="personNumber" label-width="120px"  style="width: 30%;">
                        <el-input style="width:210px;" placeholder="请输入" clearable v-model="addPersonForm.personNumber" size="small"></el-input>
                    </el-form-item>
                </div>
                <div class="ub w100 ub-pj">
                    <el-form-item label="职位：" prop="post" label-width="120px" style="width: 30%;">
                        <el-input style="width:210px;" placeholder="请输入" clearable v-model="addPersonForm.post" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱：" prop="mail" label-width="120px" style="width: 30%;">
                        <el-input style="width:210px;" placeholder="请输入" clearable v-model="addPersonForm.mail" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号：" prop="phone" label-width="120px" style="width: 30%;">
                        <el-input style="width:210px;" placeholder="请输入" clearable v-model="addPersonForm.phone" size="small"></el-input>
                    </el-form-item>
                </div>
                <el-form-item label="座机号：" prop="tPhone" label-width="120px">
                    <el-input style="width:210px;" placeholder="请输入" clearable v-model="addPersonForm.tPhone" size="small"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" @click="submitPersonForm('addPersonForm')">确 定</el-button>
                <el-button size="small" @click="addPersonDialog = false">取 消</el-button>
            </span>
        </el-dialog>

        <el-dialog title="编辑人员" :visible.sync="editPersonDialog" width="790px" custom-class="common-dialog">
            <el-form :model="editPersonForm" :rules="user_rules_edit" ref="editPersonForm" inline label-position="top">
                <div class="ub w100 ub-pj">
                    <el-form-item label="所属部门：" prop="department"  label-width="120px" style="width: 30%;">
                        <!--<el-input style="width:210px;" placeholder="请输入" clearable v-model="addPersonForm.department" size="small"></el-input>-->
                        <div class="select-box tree">
                            <div style="cursor:pointer;" class="ub ub-ac select-title" @click.stop="onOff=!onOff">
                                <div class="ub ub-f1 ub-ac" style="text-indent: 14px;line-height: 28px;"><span style="opacity: 0.7" v-if="!currentGroup_editPerson">请选择</span>{{currentGroup_editPerson}}</div>
                                <div style="width:28px;height:28px;text-align: center;line-height: 28px;">
                                    <i style="color:#1cd7fa;" :class="{'el-icon-arrow-up':onOff,'el-icon-arrow-down':!onOff}"></i>
                                </div>
                            </div>
                            <div v-show="onOff" class="select-mask">
                                <el-tree
                                    show-checkbox
                                    ref="tree_editPerson"
                                    node-key="id"
                                    :default-expand-all="true"
                                    :highlight-current="true"
                                    :data="treeData"
                                    :props='propsData'
                                    :check-strictly="true"
                                    :expand-on-click-node="false"
                                    :indent='indent'
                                    :default-checked-keys="editPersonDefault"
                                    @check-change="handleClick_editPerson">
                                    <span class="custom-tree-node" slot-scope="{ node}">
                                        <span style="font-size:14px;">{{ node.label }}</span></span>
                                </el-tree>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label="员工姓名：" prop="name" label-width="120px" style="width: 30%;">
                        <el-input style="width:210px;" placeholder="请输入" clearable v-model="editPersonForm.name" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="员工编号：" prop="personNumber" label-width="120px" style="width: 30%;">
                        <el-input style="width:210px;" placeholder="请输入" clearable v-model="editPersonForm.personNumber" size="small"></el-input>
                    </el-form-item>
                </div>
                <div class="ub w100 ub-pj">
                    <el-form-item label="职位：" prop="post" label-width="120px" style="width: 30%;">
                        <el-input style="width:210px;" placeholder="请输入" clearable v-model="editPersonForm.post" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱：" prop="mail" label-width="120px" style="width: 30%;">
                        <el-input style="width:210px;" placeholder="请输入" clearable v-model="editPersonForm.mail" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号：" prop="phone" label-width="120px" style="width: 30%;">
                        <el-input style="width:210px;" placeholder="请输入" clearable v-model="editPersonForm.phone" size="small"></el-input>
                    </el-form-item>
                </div>
                <el-form-item label="座机号：" prop="tPhone" label-width="120px">
                    <el-input style="width:210px;" placeholder="请输入" clearable v-model="editPersonForm.tPhone" size="small"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" @click="submitPersonFormEdit('editPersonForm')">确 定</el-button>
                <el-button size="small" @click="editPersonDialog = false">取 消</el-button>
            </span>
        </el-dialog>

        <el-dialog title="数据同步" :visible.sync="dataSyncDialog" width="940px" custom-class="common-dialog inner-dialog">
            <div class="tab-wrapper">
                <el-tabs v-model="activeName"  @tab-click="get_sync_data">
                    <el-tab-pane label="增加人员" name="first">
                        <div class="tab-table">
                            <div class="tab-btn ub ub-pc ub-pj" style="margin-bottom: 10px">
                                <div></div>
                                <div>
                                    <el-button type="primary" size="small" @click="handleAddSyncAll">批量添加</el-button>
                                </div>
                            </div>
                            <el-table
                                ref="multipleTable"
                                v-loading="add_loading"
                                class='bigTable'
                                :data="add_tableData"
                                border
                                stripe
                                tooltip-effect="dark"
                                @selection-change="handleSelectionChange_add">
                                <el-table-column type="selection" width="30">
                                </el-table-column>
                                <el-table-column align="center" type="index" width="50" :index="indexMethod_add" label="序号">
                                </el-table-column>
                                <el-table-column prop="code" label="员工编号" width="120" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column prop="name" label="员工姓名" width="100">
                                </el-table-column>
                                <el-table-column prop="dep_name" label="部门" width="120" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column prop="job" label="职位" width="100" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column prop="landline" label="座机号" width="120" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column prop="email" label="邮箱" show-overflow-tooltip>
                                </el-table-column>
                                <!--<el-table-column prop="name" label="座机号" show-overflow-tooltip>
                                </el-table-column>-->
                                <el-table-column align="center" label="操作" width="80">
                                    <template slot-scope="scope">
                                        <el-button type="text" @click="handleAddSync(scope.row)">添加</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <pagination v-show="total_num_add>0" :total="total_num_add" :page.sync="get_params_add.page" :limit.sync="get_params_add.size" @pagination="get_sync_data" />
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="删除人员" name="second">
                        <div class="tab-table">
                            <div class="tab-btn ub ub-pc ub-pj" style="margin-bottom: 10px">
                                <div></div>
                                <div>
                                    <el-button type="primary" size="small" @click="handleDeleteSyncAll">批量删除</el-button>
                                </div>
                            </div>
                            <el-table
                                ref="multipleTable"
                                v-loading="del_loading"
                                class='bigTable'
                                :data="del_tableData"
                                border
                                stripe
                                tooltip-effect="dark"
                                @selection-change="handleSelectionChange_del">
                                <el-table-column type="selection" width="30">
                                </el-table-column>
                                <el-table-column align="center" type="index" width="50" :index="indexMethod_del" label="序号">
                                </el-table-column>
                                <el-table-column prop="code" label="员工编号" width="120" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column prop="name" label="员工姓名" width="100">
                                </el-table-column>
                                <el-table-column prop="dep_name" label="部门" width="120" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column prop="job" label="职位" width="100" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column prop="landline" label="座机号" width="120" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column prop="email" label="邮箱" show-overflow-tooltip>
                                </el-table-column>
                                <!--<el-table-column prop="name" label="座机号" show-overflow-tooltip>
                                </el-table-column>-->
                                <el-table-column align="center" label="操作" width="80">
                                    <template slot-scope="scope">
                                        <el-button type="text" @click="handleDeleteSync(scope.row)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <pagination v-show="total_num_del>0" :total="total_num_del" :page.sync="get_params_del.page" :limit.sync="get_params_del.size" @pagination="get_sync_data" />
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="信息变更人员" name="third">
                        <div class="tab-table">
                            <div class="tab-btn ub ub-pc ub-pj" style="margin-bottom: 10px">
                                <div></div>
                                <div>
                                    <el-button type="primary" size="small" @click="handleUpdateSyncAll">批量变更</el-button>
                                </div>
                            </div>
                            <el-table
                                ref="multipleTable"
                                v-loading="update_loading"
                                class='bigTable'
                                :data="update_tableData"
                                border
                                stripe
                                tooltip-effect="dark"
                                @selection-change="handleSelectionChange_update">
                                <el-table-column type="selection" width="30">
                                </el-table-column>
                                <el-table-column align="center" type="index" width="50" :index="indexMethod_update" label="序号">
                                </el-table-column>
                                <el-table-column prop="code" label="员工编号" width="120" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column prop="name" label="员工姓名" width="100">
                                </el-table-column>
                                <el-table-column prop="dep_name" label="部门" width="120" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column prop="job" label="职位" width="100" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column prop="landline" label="座机号" width="120" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column prop="email" label="邮箱" show-overflow-tooltip>
                                </el-table-column>
                                <!--<el-table-column prop="name" label="座机号" show-overflow-tooltip>
                                </el-table-column>-->
                                <el-table-column align="center" label="操作" width="80">
                                    <template slot-scope="scope">
                                        <el-button type="text" @click="handleUpdateSync(scope.row)">变更</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <pagination v-show="total_num_update>0" :total="total_num_update" :page.sync="get_params_update.page" :limit.sync="get_params_update.size" @pagination="get_sync_data" />
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dataSyncDialog = false">取 消</el-button>
            </span>
        </el-dialog>

        <DeleteDialog
            :dialogVisible = deleteItemDialog
            @delete="deleteItemData"
            @cancel="deleteItemDialog = false">
        </DeleteDialog>

        <DeleteDialog
            :dialogVisible = deleteAllDialog
            @delete="deleteAllData"
            @cancel="deleteAllDialog = false">
        </DeleteDialog>

        <el-dialog title="创建部门" :visible.sync="addRuleGroupDialog" width="600px" custom-class="common-dialog">
            <el-form :model="addRuleGroupForm" :rules="group_rules_add" ref="addRuleGroupForm" label-position="top">
                <el-form-item label="部门名称：" prop="name" label-width="120px">
                    <el-input style="width:100%;" placeholder="请输入" clearable v-model.trim="addRuleGroupForm.name" size="small"></el-input>
                </el-form-item>
                <el-form-item label="上级部门：" prop="department" label-width="120px">
                    <!--<el-input style="width:90%;" placeholder="请输入" clearable v-model="addRuleGroupForm.department" size="small"></el-input>-->
                    <div class="select-box tree" style="width: 100%">
                        <div style="cursor:pointer;" class="ub ub-ac select-title" @click.stop="onOff=!onOff">
                            <div class="ub ub-f1 ub-ac" style="text-indent: 14px;line-height: 32px;"><span style="opacity: 0.7" v-if="!currentGroup_addGroup">请选择</span>{{currentGroup_addGroup}}</div>
                            <div style="width:28px;height:32px;text-align: center;line-height: 32px;">
                                <i style="color:rgba(0, 0, 0, 0.4);" :class="{'el-icon-arrow-up':onOff,'el-icon-arrow-down':!onOff}"></i>
                            </div>
                        </div>
                        <div v-show="onOff" class="select-mask">
                            <el-tree
                                show-checkbox
                                ref="tree_addGroup"
                                node-key="id"
                                :default-expand-all="true"
                                :highlight-current="true"
                                :data="treeData"
                                :props='propsData'
                                :check-strictly="true"
                                :expand-on-click-node="false"
                                :indent='indent'
                                @check-change="handleClick_addGroup">
                                <span class="custom-tree-node" slot-scope="{ node,}">
                                    <span style="font-size:14px;">{{ node.label }}</span></span>
                            </el-tree>
                        </div>
                        <!--<div v-if="!addPersonForm.department" style="position:absolute;left:0;top:32px;line-height:20px;font-size:12px;color:#F56C6C;">请选择所属部门</div>-->
                    </div>
                </el-form-item>
                <el-form-item label="负责人：" prop="person" label-width="120px">
                    <!--<el-input style="width:90%;" placeholder="请输入" clearable v-model="addRuleGroupForm.person" size="small"></el-input>-->
                    <el-select size="small" style="width: 100%" clearable v-model="addRuleGroupForm.person" filterable placeholder="请选择">
                        <el-option v-for="(item) in assetUsers" :label="item.name" :value="item.id" :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" @click="submitGroupForm('addRuleGroupForm')">确 定</el-button>
                <el-button size="small" @click="addRuleGroupDialog = false">取 消</el-button>
            </span>
        </el-dialog>

        <el-dialog title="编辑部门" :visible.sync="editRuleGroupDialog" width="600px" custom-class="common-dialog">
            <el-form :model="editRuleGroupForm" :rules="group_rules_edit" ref="editRuleGroupForm" label-position="top">
                <el-form-item label="部门名称：" prop="name" label-width="120px">
                    <el-input style="width:100%;" placeholder="请输入" clearable v-model.trim="editRuleGroupForm.name" size="small"></el-input>
                </el-form-item>
                <el-form-item label="上级部门：" prop="department" label-width="120px">
                    <!--<el-input style="width:90%;" placeholder="请输入" clearable v-model="editRuleGroupForm.department" size="small"></el-input>-->
                    <div class="select-box tree" style="width: 100%">
                        <div style="cursor:pointer;" class="ub ub-ac select-title" @click.stop="onOff=!onOff">
                            <div class="ub ub-f1 ub-ac" style="text-indent: 14px;line-height: 28px;"><span style="opacity: 0.7" v-if="!currentGroup_editGroup">请选择</span>{{currentGroup_editGroup}}</div>
                            <div style="width:28px;height:28px;text-align: center;line-height: 28px;">
                                <i style="color:rgba(0, 0, 0, 0.4);" :class="{'el-icon-arrow-up':onOff,'el-icon-arrow-down':!onOff}"></i>
                            </div>
                        </div>
                        <div v-show="onOff" class="select-mask">
                            <el-tree
                                show-checkbox
                                ref="tree_editGroup"
                                node-key="id"
                                :default-expand-all="true"
                                :highlight-current="true"
                                :data="treeData"
                                :props='propsData'
                                :check-strictly="true"
                                :default-checked-keys="editDefault"
                                :expand-on-click-node="false"
                                :indent='indent'
                                @check-change="handleClick_editGroup">
                                <span class="custom-tree-node" slot-scope="{ node }">
                                    <span style="font-size:14px;">{{ node.label }}</span></span>
                            </el-tree>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="负责人：" prop="person" label-width="120px">
                    <!--<el-input style="width:90%;" placeholder="请输入" clearable v-model="editRuleGroupForm.person" size="small"></el-input>-->
                    <el-select size="small" style="width: 100%" clearable v-model="editRuleGroupForm.person" filterable placeholder="请选择">
                        <el-option v-for="(item) in assetUsers" :label="item.name" :value="item.id" :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" type="primary"  @click="submitGroupFormEdit('editRuleGroupForm')">确 定</el-button>
                <el-button size="small" @click="editRuleGroupDialog = false">取 消</el-button>
            </span>
        </el-dialog>
        <!--删除-->
        <DeleteDialog
            :dialogVisible = delRuleGroupDialog
            @delete="handleDeleteGroupFun"
            @cancel="delRuleGroupDialog = false">
        </DeleteDialog>
    </div>
</template>

<script>
import {
    get_asset_tree,
    add_asset_group,
    delete_asset_group,
    get_asset_list,
    save_asset_person,
    update_user,
    delete_asset_person,
    get_sync_person,
    add_sync_person,
    ad_domain_sync,
    exportData,
    template
} from '@/server/system/asset_users.js'
export default {
    name: 'AssetUsers',
    data() {
        var validatePhone = (rule, value, callback) => {
            if (value === '' || value === null) {
                callback()
            } else {
                if (!(/^1[345678]\d{9}$/.test(value))) {
                    callback(new Error('请输入真实手机号'))
                } else {
                    callback()
                }
            }
        }
        var validateTel = (rule, value, callback) => {
            if (value !== '') {
                if (!/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(value)) {
                    callback(new Error('请输入正确的座机号'))
                } else {
                    callback()
                }
            } else {
                callback()
            }
        }
        var validateAddGroup = (rule, value, callback) => {
            if (value === '' && this.currentGroup_addGroup === '') {
                callback(new Error('请选择上级部门'))
            } else {
                callback()
            }
        }
        var validateEditGroup = (rule, value, callback) => {
            if (value === '' && this.currentGroup_editGroup === '') {
                callback(new Error('请选择上级部门'))
            } else {
                callback()
            }
        }
        var validateAddPerson = (rule, value, callback) => {
            if (value !== '' && this.currentGroup_addPerson === '') {
                callback(new Error('请选择上级部门'))
            } else {
                callback()
            }
        }
        var validateEditPerson = (rule, value, callback) => {
            if (value !== '' && this.currentGroup_editPerson === '') {
                callback(new Error('请选择上级部门'))
            } else {
                callback()
            }
        }
        return {
            kaiguan: '',
            tableHeight: document.body.clientHeight - 270,
            activeName: 'first',
            onOff: false,
            isClick: true,
            isFirst: true,
            indent: 10,
            initId: null,
            depId: '',
            currentGroup_addPerson: '',
            currentGroup_editPerson: '',
            currentGroup_addGroup: '',
            currentGroup_editGroup: '',
            treeData: [],
            select_treeData: [],
            propsData: {
                children: 'childDepInfo',
                label: 'name'
            },
            editDefault: [],
            disabledDefault: [],
            editPersonDefault: [],
            currentNode: {
                id: ''
            },
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
            dataSyncDialog: false,
            addPersonDialog: false,
            editPersonDialog: false,
            // 导入数据
            importDialog: false,
            importForm: {
                name: '',
                state: '1'
            },

            autoFrom: {
                handle_way: false,
                checkList: ['1'],
                task_name: '',
                task_type: '',
                priority: '',
                assign_group: '',
                advise: ''
            },
            addRuleGroupDialog: false,
            addRuleGroupForm: {
                name: '',
                department: '',
                person: ''
            },
            editRuleGroupDialog: false,
            editRuleGroupForm: {
                id: '',
                name: '',
                department: '',
                person: ''
            },
            delRuleGroupDialog: false,
            addPersonForm: {
                department: '',
                name: '',
                personNumber: '',
                post: '',
                mail: '',
                phone: '',
                tPhone: ''
            },
            editPersonForm: {
                id: '',
                department: '',
                name: '',
                personNumber: '',
                post: '',
                mail: '',
                phone: '',
                tPhone: ''
            },
            userId: '',
            files_list: [],
            // downloadDialog:false,
            files: [],
            fileList: [],
            uploadDialog: false,
            file_num: 0,

            rules: {
                rule_name: [{
                    required: true,
                    message: '请输入规则名称',
                    trigger: 'blur'
                }],
                name: [{
                    required: true,
                    message: '请输入部门名称',
                    trigger: 'blur'
                }]
            },
            group_rules_add: {
                name: [{
                    required: true,
                    message: '请输入部门名称',
                    trigger: 'blur'
                }],
                department: [{
                    required: true,
                    validator: validateAddGroup,
                    trigger: 'blur'
                }]
            },
            group_rules_edit: {
                name: [{
                    required: true,
                    message: '请输入部门名称',
                    trigger: 'blur'
                }],
                department: [{
                    required: true,
                    message: '请选择上级部门',
                    validator: validateEditGroup,
                    trigger: 'blur'
                }]
            },
            user_rules_add: {
                department: [{
                    validator: validateAddPerson,
                    message: '请选择所属部门',
                    trigger: 'blur'
                }],
                name: [{
                    required: true,
                    message: '请输入员工姓名',
                    trigger: 'blur'
                }],
                personNumber: [{
                    required: true,
                    message: '请输入员工编号',
                    trigger: 'blur'
                }],
                mail: [{
                    type: 'email',
                    message: '请输入正确的邮箱地址',
                    trigger: 'blur'
                }],
                phone: [{
                    validator: validatePhone,
                    trigger: 'blur'
                }],
                tPhone: [{
                    validator: validateTel,
                    trigger: 'blur'
                }]
            },
            user_rules_edit: {
                department: [{
                    validator: validateEditPerson,
                    message: '请选择所属部门',
                    trigger: 'blur'
                }],
                name: [{
                    required: true,
                    message: '请输入员工姓名',
                    trigger: 'blur'
                }],
                personNumber: [{
                    required: true,
                    message: '请输入员工编号',
                    trigger: 'blur'
                }],
                mail: [{
                    type: 'email',
                    message: '请输入正确的邮箱地址',
                    trigger: 'blur'
                }],
                phone: [{
                    validator: validatePhone,
                    trigger: 'blur'
                }],
                tPhone: [{
                    validator: validateTel,
                    trigger: 'blur'
                }]
            },
            currentNodeId: '',
            parentId: '',
            assetUsers: [],
            testData: [],
            isOpen: false,
            detailArr: [],
            detailDialog: false,
            deployDialog: false,
            deployAllDialog: false,
            deleteDialog: false,
            deleteItemId: '',
            deleteItemDialog: false,
            deleteAllDialog: false,
            formLabelWidth: '100px',
            loading: false,
            add_loading: false,
            del_loading: false,
            update_loading: false,
            total_num: 0,
            total_num_add: 0,
            total_num_del: 0,
            total_num_update: 0,
            multipleSelection: [],
            multipleSelection_add: [],
            multipleSelection_del: [],
            multipleSelection_update: [],
            tableData: [
                // {
                //   id: '1',
                //   modelMap:'你的钱为你的确为',
                //   drl:'eqweqweqwioeq',
                //   createTime: '2019-12-02 15:20:30',
                //   isTest: '1',
                //   isOfficial: '0'
                // }
            ],
            add_tableData: [],
            del_tableData: [],
            update_tableData: [],
            allDeploy: {
                isTest: '',
                isOfficial: ''
            },
            editDeploy: {
                id: '',
                isTest: '',
                isOfficial: ''
            },
            sayTimes: [],
            get_params: {
                page: 1,
                size: 20,
                code: '',
                name: '',
                depId: '',
                phone: '',
                email: '',
                landline: ''
            },
            get_params_add: {
                page: 1,
                size: 10
            },
            get_params_del: {
                page: 1,
                size: 10
            },
            get_params_update: {
                page: 1,
                size: 10
            },
            typeList: []
        }
    },
    watch: {
        kaiguan(val) {
            if (val) {
                this.tableHeight = document.body.clientHeight - 320
            } else {
                this.tableHeight = document.body.clientHeight - 270
            }
        },
        addPersonDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.addPersonForm.resetFields()
                    this.onOff = false
                    this.addPersonForm.department = this.currentGroup_addPerson = ''
                }
            }
        },
        editPersonDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.editPersonForm.resetFields()
                    this.onOff = false
                    this.editPersonForm.department = this.currentGroup_editPerson = ''
                }
            }
        },
        addRuleGroupDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.onOff = false
                    this.addRuleGroupForm.department = this.currentGroup_addGroup = ''
                    this.$refs.addRuleGroupForm.resetFields()
                }
            }
        },
        editRuleGroupDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.editRuleGroupForm.resetFields()
                    this.onOff = false
                    this.editRuleGroupForm.department = this.currentGroup_editGroup = ''
                }
            }
        }
    },
    computed: {
        selectUrl() {
            return '/api/base_info/manage/assetsUser/export?code=' + this.get_params.code + '&name=' + this.get_params.name + '&phone=' + this.get_params.phone + '&email=' + this.get_params.email + '&landline=' + this.get_params.landline + '&depId=' + this.depId
        },
        downLoadUrl() {
            return '/api/base_info/manage/assetsUser/template'
        },
        header() {
            return { token: this.$getlocalStorage('initInfo').user.token }
        }
    },
    mounted() {
        window.addEventListener('click', (e) => {
            this.onOff = false
        })
        this.$nextTick(() => {
            let userInfo = this.$getsessionStorage('userInfo')
            this.userId = userInfo.id
            this.initTree()
            this.get_asset_users()
        })
    },
    methods: {
        isOpen1(val) {
            console.log(val)
            this.kaiguan = val
        },
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex % 2) {
                return 'table-row2'
            } else {
                return 'table-row1'
            }
        },
        handleDownTemplate() {
            let data = {
                paramsData: {},
                queryData: {}
            }
            template(data).then(res => {
                console.log(res + 'res')
            }).catch(err => {
                console.log(err + 'err')
            })
        },
        handleDown() {
            let data = {
                queryData: {
                    code: this.get_params.code,
                    name: this.get_params.name,
                    phone: this.get_params.phone,
                    email: this.get_params.email,
                    landline: this.get_params.landline,
                    depId: this.depId
                },
                paramsData: {
                }
            }
            exportData(data).then(res => {
                console.log(res + 'res')
            }).catch(err => {
                console.log(err + 'err')
            })
        },
        reset() {
            this.get_params.code = ''
            this.get_params.name = ''
            this.get_params.phone = ''
            this.get_params.email = ''
            this.get_params.landline = ''
        },
        initTree() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_asset_tree(data).then(res => {
                console.log('tree', res)
                if (this.isFirst) {
                    this.depId = res[0].id
                    this.initId = res[0].id
                    this.get_data()
                }
                this.isFirst = false
                this.isClick = false
                this.treeData = res
            }).then(() => {
                this.$refs.tree.setCheckedKeys([this.currentNodeId])
                this.$refs.tree.setCurrentKey(this.depId)
                this.isClick = true
            }).catch(error => {
                console.log('error' + error)
            })
        },
        syncAD() {
            let data = {
                paramsData: {},
                queryData: {}
            }
            ad_domain_sync(data).then(res => {
                this.$message({
                    message: 'AD域同步成功',
                    type: 'success'
                })
            }).catch(err => {
                console.log(err + 'err')
            })
        },
        openSyncDialog() {
            this.dataSyncDialog = true
            this.activeName = 'first'
            this.get_sync_data()
        },
        initParams() {
            this.get_params = {
                page: 1,
                size: 10,
                code: '',
                name: '',
                depId: '',
                phone: '',
                email: '',
                landline: ''
            }
            this.total_num = 0
        },
        handleClick(data, checked, node) {
            if (checked) {
                this.currentNode = data
                console.log(this.currentNode)
                if (this.isClick) {
                    this.currentNodeId = data.id
                }
                this.$refs.tree.setCheckedNodes([data])
            }
        },
        handleClick_addPerson(data, checked, node) {
            if (checked) {
                this.addPersonForm.department = data.id
                this.currentGroup_addPerson = data.name
                this.$refs.tree_addPerson.setCheckedNodes([data])
            }
        },
        handleClick_editPerson(data, checked, node) {
            if (checked) {
                this.editPersonForm.department = data.id
                this.currentGroup_editPerson = data.name
                this.$refs.tree_editPerson.setCheckedNodes([data])
            }
        },
        handleClick_addGroup(data, checked, node) {
            if (checked) {
                this.addRuleGroupForm.department = data.id
                this.currentGroup_addGroup = data.name
                this.$refs.tree_addGroup.setCheckedNodes([data])
            }
        },
        handleClick_editGroup(data, checked, node) {
            if (checked) {
                this.editRuleGroupForm.department = data.id
                this.currentGroup_editGroup = data.name
                this.$refs.tree_editGroup.setCheckedNodes([data])
            }
        },
        handleNodeClick(node) {
            console.log(node)
            this.depId = node.id

            this.currentNode = node
            // console.log(this.currentNode)
            if (this.isClick) {
                this.currentNodeId = node.id
            }
            this.$refs.tree.setCheckedNodes([node])

            this.initParams()
            this.get_data()
        },
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        indexMethod_add(index) {
            return (this.get_params_add.page - 1) * this.get_params_add.size + index + 1
        },
        indexMethod_del(index) {
            return (this.get_params_del.page - 1) * this.get_params_del.size + index + 1
        },
        indexMethod_update(index) {
            return (this.get_params_update.page - 1) * this.get_params_update.size + index + 1
        },

        searchCheck() {
            this.get_params.page = 1
            this.get_data()
        },
        handleEdit(row) {
            console.log(row)
            this.editPersonForm.mail = row.email
            this.editPersonForm.phone = row.phone
            this.editPersonForm.name = row.name
            this.editPersonForm.post = row.job
            this.editPersonForm.personNumber = row.code
            this.editPersonForm.tPhone = row.landline
            this.editPersonForm.id = row.id
            this.editPersonForm.department = row.depId
            this.currentGroup_editPerson = row.depName
            this.editPersonDefault = [row.depId]
            this.editPersonDialog = true
        },

        handleDelete(row) {
            this.deleteItemId = row.id
            this.deleteItemDialog = true
        },
        handleAddSync(row) {
            let data = {
                paramsData: {
                    status: 1,
                    codes: [row.code]
                },
                queryData: {}
            }
            add_sync_person(data).then(res => {
                this.$message({
                    message: '添加成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.initTree()
                    this.get_data()
                    this.get_sync_data()
                }, 1500)
            }).catch(err => {
                console.log(err + 'err')
            })
        },
        handleAddSyncAll(row) {
            if (this.multipleSelection_add.length === 0) {
                this.$message.warning('请先勾行数据')
                return
            }
            let data = {
                paramsData: {
                    status: 1,
                    codes: this.multipleSelection_add.map(item => { return item.code })
                },
                queryData: {}
            }
            add_sync_person(data).then(res => {
                this.$message({
                    message: '添加成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.initTree()
                    this.get_data()
                    this.get_sync_data()
                }, 1500)
            }).catch(err => {
                console.log(err + 'err')
            })
        },
        handleDeleteSync(row) {
            let data = {
                paramsData: {
                    status: 2,
                    codes: [row.code]
                },
                queryData: {}
            }
            add_sync_person(data).then(res => {
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.initTree()
                    this.get_data()
                    this.get_sync_data()
                }, 1500)
            }).catch(err => {
                console.log(err + 'err')
            })
        },
        handleDeleteSyncAll(row) {
            if (this.multipleSelection_del.length === 0) {
                this.$message.warning('请先勾行数据')
                return
            }
            let data = {
                paramsData: {
                    status: 2,
                    codes: this.multipleSelection_del.map(item => { return item.code })
                },
                queryData: {}
            }
            add_sync_person(data).then(res => {
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.initTree()
                    this.get_data()
                    this.get_sync_data()
                }, 1500)
            }).catch(err => {
                console.log(err + 'err')
            })
        },
        handleUpdateSync(row) {
            let data = {
                paramsData: {
                    status: 3,
                    codes: [row.code]
                },
                queryData: {}
            }
            add_sync_person(data).then(res => {
                this.$message({
                    message: '变更成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.initTree()
                    this.get_data()
                    this.get_sync_data()
                }, 1500)
            }).catch(err => {
                console.log(err + 'err')
            })
        },
        handleUpdateSyncAll(row) {
            if (this.multipleSelection_update.length === 0) {
                this.$message.warning('请先勾行数据')
                return
            }
            let data = {
                paramsData: {
                    status: 3,
                    codes: this.multipleSelection_update.map(item => { return item.code })
                },
                queryData: {}
            }
            add_sync_person(data).then(res => {
                this.$message({
                    message: '变更成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.initTree()
                    this.get_data()
                    this.get_sync_data()
                }, 1500)
            }).catch(err => {
                console.log(err + 'err')
            })
        },
        handleDeleteGroupFun() {
            let data = {
                paramsData: {},
                queryData: {
                    id: this.currentNode.id
                }
            }
            delete_asset_group(data).then(res => {
                this.delRuleGroupDialog = false
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
        delRuleShow() {
            if (this.depId === this.currentNode.id) {
                this.$message({
                    message: '当前组目前处于显示状态不能删除！',
                    type: 'warning'
                })
                return
            }
            let selects = this.$refs.tree.getCheckedKeys()
            console.log(selects)
            if (selects.length === 0) {
                this.$message({
                    message: '请勾选要删除的部门',
                    type: 'warning'
                })
                return
            }
            this.delRuleGroupDialog = true
        },
        addRuleShow() {
            let selects = this.$refs.tree.getCheckedKeys()
            console.log(selects)
            /* if(selects.length===0){
                this.$message({
                    message: '请勾选新增所在组织',
                    type: 'warning'
                })
                return
            }*/
            this.addRuleGroupDialog = true
        },
        editRuleShow() {
            let selects = this.$refs.tree.getCheckedKeys()
            console.log(selects)
            if (selects.length === 0) {
                this.$message({
                    message: '请勾选编辑所在组织',
                    type: 'warning'
                })
                return
            }
            console.log(this.currentNode)
            this.editRuleGroupForm.name = this.currentNode.name
            this.editRuleGroupForm.person = this.currentNode.manager
            this.editRuleGroupForm.department = this.currentNode.parentId
            this.editRuleGroupForm.id = this.currentNode.id
            this.currentGroup_editGroup = this.currentNode.parentName ? this.currentNode.parentName : '全公司'
            this.editDefault = [this.currentNode.parentId]
            this.editRuleGroupDialog = true
        },
        submitGroupFormEdit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.editGroupFun()
                } else {
                    console.log('error submit!!')
                    return false
                }
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

        submitPersonFormEdit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.editPersonFun()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        submitPersonForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.addPersonFun()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },

        editPersonFun() {
            let data = {
                queryData: {},
                paramsData: {
                    id: this.editPersonForm.id,
                    name: this.editPersonForm.name,
                    code: this.editPersonForm.personNumber,
                    depId: this.editPersonForm.department,
                    phone: this.editPersonForm.phone,
                    email: this.editPersonForm.mail,
                    job: this.editPersonForm.post,
                    landline: this.editPersonForm.tPhone
                }
            }
            update_user(data).then(res => {
                this.editPersonDialog = false
                this.$message({
                    message: '编辑成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.initTree()
                    this.get_data()
                    this.get_asset_users()
                }, 1500)
            }).catch(error => {
                console.log(error + 'error')
            })
        },
        addPersonFun() {
            let data = {
                queryData: {},
                paramsData: {
                    name: this.addPersonForm.name,
                    code: this.addPersonForm.personNumber,
                    depId: this.addPersonForm.department,
                    phone: this.addPersonForm.phone,
                    email: this.addPersonForm.mail,
                    job: this.addPersonForm.post,
                    landline: this.addPersonForm.tPhone
                }
            }
            save_asset_person(data).then(res => {
                this.addPersonDialog = false
                console.log('添加成功')
                this.$message({
                    message: '添加成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.initTree()
                    this.get_data()
                    this.get_asset_users()
                }, 1500)
            }).catch(error => {
                console.log(error + 'error')
            })
        },

        editGroupFun() {
            let data = {
                queryData: {},
                paramsData: {
                    id: this.editRuleGroupForm.id,
                    name: this.editRuleGroupForm.name,
                    manager: this.editRuleGroupForm.person,
                    parentId: this.editRuleGroupForm.department
                }
            }
            add_asset_group(data).then(res => {
                this.editRuleGroupDialog = false
                this.$message({
                    message: '编辑成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.initTree()
                }, 1500)
            }).catch(error => {
                console.log(error + 'error')
            })
        },
        addGroupFun() {
            let data = {
                queryData: {},
                paramsData: {
                    name: this.addRuleGroupForm.name,
                    manager: this.addRuleGroupForm.person,
                    parentId: this.addRuleGroupForm.department
                }
            }
            add_asset_group(data).then(res => {
                this.addRuleGroupDialog = false
                console.log('添加成功')
                this.$message({
                    message: '添加成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.initTree()
                }, 1500)
            }).catch(error => {
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

        handleSizeChange_add(val) {
            this.get_params_add.size = val
            this.get_sync_data()
        },
        handleCurrentChange_add(val) {
            this.get_params_add.page = val
            this.get_sync_data()
        },
        handleSizeChange_del(val) {
            this.get_params_del.size = val
            this.get_sync_data()
        },
        handleCurrentChange_del(val) {
            this.get_params_del.page = val
            this.get_sync_data()
        },
        handleSizeChange_update(val) {
            this.get_params_update.size = val
            this.get_sync_data()
        },
        handleCurrentChange_update(val) {
            this.get_params_update.page = val
            this.get_sync_data()
        },

        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        handleSelectionChange_add(val) {
            this.multipleSelection_add = val
        },
        handleSelectionChange_del(val) {
            this.multipleSelection_del = val
        },
        handleSelectionChange_update(val) {
            this.multipleSelection_update = val
        },

        searchAssets() {
            this.get_params.page = 1
            this.get_data()
        },

        get_asset_users() {
            let data = {
                queryData: {
                    page: 1,
                    pageSize: 99999
                },
                paramsData: {}
            }
            this.assetUsers = []
            get_asset_list(data).then(res => {
                console.log(res)
                let list = res.records
                if (list.length > 0) {
                    list.forEach((item, index) => {
                        // console.log(index)
                        let obj = {}
                        obj.id = item.id
                        obj.name = item.name
                        this.assetUsers.push(obj)
                    })
                }
            }).catch(error => {
                console.log('error' + error)
            })
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
                    depId: this.depId,
                    name: this.get_params.name,
                    code: this.get_params.code,
                    phone: this.get_params.phone,
                    email: this.get_params.email,
                    landline: this.get_params.landline
                }
            }
            get_asset_list(data).then(res => {
                console.log(res)
                this.loading = false
                this.total_num = res.total
                let list = res.records
                if (list.length > 0) {
                    list.forEach((item, index) => {
                        // console.log(index)
                        let obj = {}
                        obj.id = item.id
                        obj.code = item.code
                        obj.depName = item.depName
                        obj.email = item.email
                        obj.job = item.job
                        obj.landline = item.landline
                        obj.name = item.name
                        obj.phone = item.phone
                        obj.depId = item.depId
                        this.tableData.push(obj)
                        // console.log(obj.drl)
                    })
                }
            }).catch(error => {
                this.loading = false
                console.log('error' + error)
            })
        },

        get_sync_data() {
            let pre = ''; let status = ''

            switch (this.activeName) {
                case 'first':
                    pre = 'add'
                    status = 1
                    break
                case 'second':
                    pre = 'del'
                    status = 2
                    break
                case 'third':
                    pre = 'update'
                    status = 3
                    break
            }
            this[pre + '_loading'] = true
            this[pre + '_tableData'] = []
            let data = {
                queryData: {
                    page: this['get_params_' + pre].page,
                    pageSize: this['get_params_' + pre].size
                },
                paramsData: {
                    status: status
                }
            }
            get_sync_person(data).then(res => {
                console.log(res)
                this[pre + '_loading'] = false
                this['total_num_' + pre] = res.total
                let list = res.records
                if (list.length > 0) {
                    list.forEach((item, index) => {
                        let obj = {}
                        obj.id = item.id
                        obj.code = item.code
                        obj.dep_name = item.dep_name
                        obj.email = item.email
                        obj.name = item.name
                        obj.phone = item.phone
                        obj.status = item.status
                        obj.job = item.job
                        obj.version = item.version
                        obj.landline = item.landline
                        this[pre + '_tableData'].push(obj)
                    })
                }
            }).catch(error => {
                this[pre + '_loading'] = false
                console.log('error' + error)
            })
        },

        handleSee(row) {

        },

        deploymentEnvironment(val) {
            this.editDeploy.id = val.id
            this.editDeploy.isTest = val.isTest !== '0'
            this.editDeploy.isOfficial = val.isOfficial !== '0'
            this.deployDialog = true
        },

        deleteItemData() {
            let obj = {
                queryData: {},
                paramsData: {
                    ids: [this.deleteItemId]
                }
            }
            delete_asset_person(obj).then(res => {
                this.deleteItemDialog = false
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.initTree()
                    this.get_data()
                    this.get_asset_users()
                }, 1000)
            }).catch(error => {
                this.deleteItemDialog = false
                console.log(error + 'error')
            })
        },

        deleteAllData() {
            let ids = []
            this.multipleSelection.forEach(item => {
                console.log(item)
                ids.push(item.id)
            })
            let obj = {
                queryData: {},
                paramsData: {
                    ids: ids
                }
            }
            delete_asset_person(obj).then(res => {
                this.deleteAllDialog = false
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.initTree()
                    this.get_data()
                    this.get_asset_users()
                }, 1000)
            }).catch(error => {
                this.deleteAllDialog = false
                console.log(error + 'error')
            })
        },

        handleDeleteAll() {
            if (this.multipleSelection.length === 0) {
                this.$message({
                    message: '请勾选删除的行',
                    type: 'warning'
                })
            } else {
                this.deleteAllDialog = true
            }
        },

        handleSuccess(response, file, fileList) {
            console.log('response', response)
            if (response.code == 1) {
                this.$message({
                    message: '文件上传成功!',
                    type: 'success'
                })
                this.initTree()
                this.get_data()
            } else {
                this.$message({
                    message: response.message,
                    type: 'warning'
                })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
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

.el-form-item {
    margin: 0;
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

.event ::v-deep .el-range-input {
    background-color: rgba(0, 0, 0, 0);
    color: #fff;
}

.event ::v-deep .el-range-separator {
    color: #fff;
}
.event ::v-deep .el-upload-list__item-name {
    color: #01E9FF;

    i {
        color: #01E9FF;
    }
}
.attendance-dialog .el-form-item {
    margin-bottom: 30px;
}
.upload-demo ::v-deep .el-button--primary{
    // background-color: rgba(0,0,0,0);
    // border-color: rgba(0,0,0,0);
    // background-image: url(../../assets/img/XZWJ.png);
    // background-position: 0 0;
    // background-repeat: no-repeat;
    // background-size: 100% 100%;
}
.el-tree{
    background: rgba(0,0,0,0);
}
.tree ::v-deep .el-tree--highlight-current .el-tree-node>.el-tree-node__content {
    .custom-tree-node{
        span:nth-child(1){
            color: rgba(0, 0, 0, 0.9);
        }
        span:nth-child(2){
            color:#86939e;
        }

    }
}
.tree ::v-deep .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
    background-color: rgba(0,0,0,0)!important;
    .custom-tree-node{
        span{
            color:#0052d9;
        }
    }
}
.tree ::v-deep .el-tree--highlight-current .el-tree-node>.el-tree-node__content:hover{
    background-color: rgba(0,0,0,0)!important;
    .custom-tree-node{
        span{
            color:#0052d9;
        }
    }
}
.tree ::v-deep .el-checkbox__input.is-disabled .el-checkbox__inner{
    background-color: #606266;
    border-color: #606266;
}
.tree ::v-deep .el-checkbox__input .el-checkbox__inner,.auto ::v-deep .el-checkbox__input .el-checkbox__inner{
    border-color: #606266;
}
.tree ::v-deep .el-checkbox__input.is-focus .el-checkbox__inner,.auto ::v-deep .el-checkbox__input.is-focus .el-checkbox__inner{
    border-color: #606266;
}
.tree ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner,.auto ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: rgba(0,0,0,0)!important;
    border-color: #606266;
}
.tree-option i{
    margin: 0 3px;
    cursor: pointer;
}
.tree ::v-deep .el-checkbox__inner::after,.auto ::v-deep .el-checkbox__inner::after{
    border-color:#606266;
}
.auto ::v-deep .el-checkbox__input.is-checked+.el-checkbox__label{
    color:#0052d9;
}

.tab-wrapper ::v-deep .el-button--primary {
    //font-size: 14px!important;
    // box-sizing: border-box;
    // background-color: rgba(0, 0, 0, 0);
    // border-color: rgba(0, 0, 0, 0);
    // background-image: url(../../assets/img/XZWJ.png);
    // background-position: 0 0;
    // background-repeat: no-repeat;
    // background-size: 100% 100%;
}
.tab-wrapper ::v-deep .el-tabs__item.is-active {
    color: #0052d9;
    opacity: 1;
    height: 34px;
    line-height: 34px;
}
.el-tabs ::v-deep .el-tabs__nav-wrap::after {
    // content: "";
    // position: absolute;
    // left: 0;
    // bottom: 0;
    // width: 100%;
    // height: 1px;
    // background-color: rgba(28, 215, 250, 0.2);
    // z-index: 1;
}
.el-tabs  ::v-deep  .el-tabs__item.is-active {
    // color: #1cd7fa;
    height: 34px;
    line-height: 34px;
    border: none !important;
    box-shadow: none !important;
}

.el-tabs ::v-deep .el-tabs__active-bar {
    background: #0052d9;
    //margin-left: 14px;
}

.el-tabs ::v-deep .el-tabs__item {
    // color: #ffffff;
    // opacity: .5;
}
.tab-wrapper  ::v-deep .el-table__empty-block{
    // background-color:#042136;
}
.select-box {
    width: 210px;
    height: 28px;
    display: inline-block;
    position: relative;
}
.select-title{
    width:100%;
    height:100%;
    background: transparent;
    border: 1px solid #dcdcdc;
    // box-shadow: 0px 0px 7px #389bf7 inset;
    // color: #fff;
    border-radius:3px;
    box-sizing: border-box;
}
.select-mask{
    width:100%;
    min-height:100px;
    max-height:300px;
    position: absolute;
    left:0;
    top:34px;
    z-index: 999;
    overflow-y: auto;
    background: transparent;
    border: 1px solid #dcdcdc;
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
    color: rgba(0, 0, 0, 0.9);
    border-radius:3px;
    background-color: #fff;
}
.el-tree{
    background: rgba(0,0,0,0);
}
.tree ::v-deep .el-tree--highlight-current .el-tree-node>.el-tree-node__content {
    .custom-tree-node{
        span:nth-child(1){
            color: rgba(0, 0, 0, 0.9);
        }
        span:nth-child(2){
            color:#86939e;
        }

    }
}
.tree ::v-deep .el-tree-node__content {
    background-color: rgba(0,0,0,0)!important;
}
.tree ::v-deep .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
    background-color: rgba(0,0,0,0)!important;
    .custom-tree-node{
        span{
            color:#0052d9;
        }
    }
}
.tree ::v-deep .el-tree--highlight-current .el-tree-node>.el-tree-node__content:hover{
    background-color: rgba(0,0,0,0)!important;
    .custom-tree-node{
        span{
            color:#0052d9;
        }
    }
}
.tree ::v-deep .el-checkbox__input.is-disabled .el-checkbox__inner{
    background-color: #606266;
    border-color: #606266;
}
.tree ::v-deep .el-checkbox__input .el-checkbox__inner,.auto ::v-deep .el-checkbox__input .el-checkbox__inner{
    border-color: #606266;
    background-color: transparent;
}
.tree ::v-deep .el-checkbox__input.is-focus .el-checkbox__inner,.auto ::v-deep .el-checkbox__input.is-focus .el-checkbox__inner{
    border-color: #606266;
}
.tree ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner,.auto ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: rgba(0,0,0,0)!important;
    border-color: #606266;
}
.tree-option i{
    margin: 0 3px;
    cursor: pointer;
}
.tree ::v-deep .el-checkbox__inner::after,.auto ::v-deep .el-checkbox__inner::after{
    border-color:#606266;
}
.home .el-table.outer {
    min-height: 500px !important;
}
.event  ::v-deep  .attendance-dialog.inner-dialog .el-dialog__body {
    padding: 25px 20px !important;
}
</style>
