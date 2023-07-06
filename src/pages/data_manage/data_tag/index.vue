<template>
    <div class="event tag-list">
        <div class="ub w100" style="height: calc(100vh - 80px); overflow: hidden">
            <div class="bg-color mb-1 mr-1" style="width:200px;padding: 20px 5px 10px;box-sizing: border-box;">
                <div style="position: relative;">
                    <!-- <span style="position: absolute;width:10px;height:10px;background: red;top:50%;right:0;"></span> -->
                    <div class="ub ub-pj ub-ac w100" style="padding-left:10px;margin-bottom: 20px;box-sizing: border-box">
                        <div class="list-tips" style="margin-bottom: 0;font-size:12px;">分组列表</div>
                    </div>
                    <div style="padding: 0 5px 10px 5px">
                        <el-input
                            placeholder="请输入关键词搜索"
                            clearable
                            v-model="filterText"
                            class="tree-input"
                            size="mini">
                        </el-input>
                    </div>
                    <el-tree
                        class="tree-line"
                        ref="tree"
                        node-key="id"
                        :filter-node-method="filterNode"
                        :default-expand-all="true"
                        :highlight-current="true"
                        :data="treeData"
                        :props='propsData'
                        @node-click="handleNodeClick"
                        :expand-on-click-node="false"
                        :indent='indent'>
                        <span class="custom-tree-node" slot-scope="{ node }">
                            <span style="font-size:12px;">{{ node.label }}</span>
                        </span>
                    </el-tree>
                </div>
            </div>
            <div class="ub ub-f1 ub-ver" style="height: 100%;overflow: auto">
                <div>
                    <SearchTop @search="searchData" @reset="reset">
                        <el-col :md="12" :lg="8" :xl="6">
                            <el-form :model="get_params">
                                <el-form-item label="标签名称：" label-width="80px" style="height: 32px">
                                    <div class="treeselect">
                                        <Treeselect
                                            :appendToBody="true"
                                            size="small"
                                            style="width:100%;"
                                            :options="labelData"
                                            :normalizer="normalizer"
                                            noChildrenText="当前分支无子节点"
                                            noResultsText="无可用选项"
                                            noOptionsText="无可用选项"
                                            placeholder="请选择"
                                            v-model="get_params.name"
                                        />
                                    </div>
                                </el-form-item>
                            </el-form>
                        </el-col>
                    </SearchTop>
                    <div class="list-container">
                        <div class="ub ub-pj w100 mb-1">
                            <div class="list-tips">数据标签</div>
                            <div>
                                <el-button v-per="['data_label_add']" size="small" icon="el-icon-plus" type="primary" @click="add">新 建</el-button>
                                <el-button v-per="['data_label_del']" size="small" icon="el-icon-delete" type="danger" @click="deleteContent">删 除</el-button>
                            </div>
                        </div>
                        <el-table
                            ref="multipleTable"
                            v-loading="loading"
                            class='bigTable'
                            :data="tableData"
                            :row-key="
                                (row) => {
                                    return row.id;
                                }
                            "
                            border
                            stripe
                            tooltip-effect="dark"
                            :height="tableHeight"
                            :row-class-name="tableRowClassName"
                            @selection-change="handleSelectionChange"
                            :row-style="{ height: '32px' }"
                            :header-row-style="{ height: '32px' }"
                        >
                            <el-table-column align="center" type="selection" :reserve-selection="true" width="50"></el-table-column>
                            <el-table-column align="center" type="index" width="50" label="序号" :index="indexMethod">
                            </el-table-column>
                            <el-table-column prop="name" label="标签名称" width="200"> </el-table-column>
                            <el-table-column label="映射关系">
                                <template slot-scope="scope">
                                    <div>
                                        <div v-for="(cont, index) in scope.row.contentObj.slice(0, 10)" :key="index">
                                            <div v-for="(item, _index) in cont.and" :key="_index">
                                                <span class="hightlight">{{ fieldObj[item.field] }}</span>
                                                <span>{{ conditionObj[item.condition] }}</span>
                                                <span class="hightlight">{{ item.val }}</span>
                                            </div>
                                        </div>
                                        <p v-if="scope.row.contentObj && scope.row.contentObj.length > 10">......</p>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="property" label="资产类型" width="200"> </el-table-column>
                            <el-table-column prop="manufacturer" label="厂商" width="200"> </el-table-column>
                            <!--<el-table-column prop="channelName" label="消费通道名称">
                                <template slot-scope="scope">
                                    <span class="tag-item">{{ scope.row.channelName }}</span>
                                </template>
                            </el-table-column>-->
                            <el-table-column align="center" label="操作" width="100" fixed="right">
                                <template slot-scope="scope">
                                    <el-button v-per="['data_label_edit']" type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                                    <el-button v-per="['data_label_del']" type="text" size="small" @click="handleDel(scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <pagination v-show="total_num>0" :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size" @pagination="getList" />
                    </div>
                </div>
            </div>
        </div>

        <el-dialog title="添加标签映射" :visible.sync="addDialog" width="700px" custom-class="common-dialog">
            <div class="ub ub-ac dialog-conten">
                <div class="ub ub-pj w100" style="padding:10px 10px 0 10px;box-sizing: border-box;">
                    <el-form
                        ref="add_params"
                        :model="add_params"
                        label-width="110px"
                        class="w100"
                        label-position="top"
                        :rules="add_paramsEditRules"
                    >
                        <div style="position:relative">
                            <div class="btns">
                                <el-button icon="el-icon-plus" @click="addTagName" size="mini" type="text">添加标签名称</el-button>
                            </div>
                            <el-form-item label="标签名称：" prop="name">
                                <div class="ub ub-ac">
                                    <treeselect
                                        style="width: 100%;height: 32px"
                                        :options="labelData"
                                        noChildrenText="当前分支无子节点"
                                        noOptionsText="无可用选项"
                                        noResultsText="无可用选项"
                                        :normalizer="normalizer"
                                        placeholder="请选择"
                                        v-model="add_params.name"
                                    />
                                </div>
                            </el-form-item>
                        </div>

                        <div
                            class="data_center_tags-content"
                            style="width: 100%;box-sizing: border-box"
                        >
                            <div>
                                <div class="tag-cont-wrap">
                                    <div class="tag-cont">
                                        <div class="cont-inner">
                                            <div v-for="(cont, index) in add_params.conts" :key="index">
                                                <el-divider v-if="index != 0" content-position="left">OR</el-divider>
                                                <div
                                                    class="cont-item"
                                                    v-for="(_item, _index) in cont.and"
                                                    :key="_index"
                                                >
                                                    <el-row :gutter="0">
                                                        <el-col :span="4">
                                                            <el-form-item
                                                                label-width="0"
                                                                class="w100"
                                                                :prop="'conts.' + index + '.and.' + _index + '.field'"
                                                                :rules="[
                                                                    {
                                                                        required: true,
                                                                        message: '请选择',
                                                                        trigger: 'change',
                                                                    },
                                                                ]"
                                                            >
                                                                <el-select
                                                                    clearable
                                                                    style="width: 100%"
                                                                    v-model="_item.field"
                                                                    placeholder="请选择"
                                                                    size="small"
                                                                    filterable
                                                                    @change="changeFiled(_item)"
                                                                >
                                                                    <el-option
                                                                        v-for="item in fieldList"
                                                                        :key="item.id"
                                                                        :label="item.name"
                                                                        :value="item.code"
                                                                    >
                                                                    </el-option>
                                                                </el-select>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="1">
                                                            <span class="sep-line">—</span>
                                                        </el-col>

                                                        <el-col :span="4">
                                                            <el-form-item
                                                                label-width="0"
                                                                class="w100"
                                                                :prop="
                                                                    'conts.' + index + '.and.' + _index + '.condition'
                                                                "
                                                                :rules="[
                                                                    {
                                                                        required: true,
                                                                        message: '请选择',
                                                                        trigger: 'change',
                                                                    },
                                                                ]"
                                                            >
                                                                <el-select
                                                                    style="width: 100%"
                                                                    clearable
                                                                    v-model="_item.condition"
                                                                    placeholder="请选择"
                                                                    size="small"
                                                                >
                                                                    <el-option
                                                                        v-for="item in conditionList"
                                                                        :key="item.value"
                                                                        :label="item.name"
                                                                        :value="item.value"
                                                                    >
                                                                    </el-option>
                                                                </el-select>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="1">
                                                            <span class="sep-line">—</span>
                                                        </el-col>
                                                        <el-col
                                                            :span="12"
                                                            v-if="_item.type===3"
                                                        >
                                                            <el-form-item
                                                                label-width="0"
                                                                class="w100"
                                                                :prop="'conts.' + index + '.and.' + _index + '.val'"
                                                                :rules="[
                                                                    {
                                                                        required: true,
                                                                        message: '请选择',
                                                                        trigger: 'change',
                                                                    },
                                                                ]"
                                                            >
                                                                <el-date-picker
                                                                    style="width: 100%"
                                                                    size="small"
                                                                    v-model="_item.val"
                                                                    type="datetime"
                                                                    value-format="timestamp"
                                                                    placeholder="选择日期时间"
                                                                >
                                                                </el-date-picker>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col
                                                            :span="12"
                                                            v-if="_item.type===2"
                                                        >
                                                            <el-form-item
                                                                label-width="0"
                                                                class="w100"
                                                                :prop="'conts.' + index + '.and.' + _index + '.val'"
                                                                :rules="[
                                                                    {
                                                                        required: true,
                                                                        message: '请选择',
                                                                        trigger: 'blur',
                                                                    },
                                                                ]"
                                                            >
                                                                <el-input-number placeholder="请输入" style="width: 100%" size="small" v-model.trim="_item.val" :controls="false"></el-input-number>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col
                                                            :span="12"
                                                            v-if="_item.type===4"
                                                        >
                                                            <el-form-item
                                                                label-width="0"
                                                                class="w100"
                                                                :prop="'conts.' + index + '.and.' + _index + '.val'"
                                                                :rules="[
                                                                    {
                                                                        required: true,
                                                                        message: '请选择',
                                                                        trigger: 'blur',
                                                                    },
                                                                ]"
                                                            >
                                                                <el-input
                                                                    style="width: 100%"
                                                                    placeholder="请输入"
                                                                    clearable
                                                                    v-model.trim="_item.val"
                                                                    size="small"
                                                                ></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col
                                                            :span="12"
                                                            v-if="_item.type===5"
                                                        >
                                                            <el-form-item
                                                                label-width="0"
                                                                class="w100"
                                                                :prop="'conts.' + index + '.and.' + _index + '.val'"
                                                                :rules="[
                                                                    {
                                                                        required: true,
                                                                        message: '请选择',
                                                                        trigger: 'change',
                                                                    },
                                                                ]"
                                                            >
                                                                <el-select
                                                                    clearable
                                                                    style="width: 100%"
                                                                    v-model="_item.val"
                                                                    placeholder="请选择"
                                                                    size="small"
                                                                >
                                                                    <el-option
                                                                        v-for="item in _item.enums"
                                                                        :key="item.value"
                                                                        :label="item.label"
                                                                        :value="item.value"
                                                                    >
                                                                    </el-option>
                                                                </el-select>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col  v-if="_item.type===1" :span="12">
                                                            <el-form-item
                                                                label-width="0"
                                                                class="w100"
                                                                :prop="'conts.' + index + '.and.' + _index + '.val'"
                                                                :rules="[
                                                                    {
                                                                        required: true,
                                                                        message: '请输入',
                                                                        trigger: 'blur',
                                                                    },
                                                                ]"
                                                            >
                                                                <el-input
                                                                    style="width: 100%"
                                                                    placeholder="请输入"
                                                                    clearable
                                                                    v-model.trim="_item.val"
                                                                    size="small"
                                                                ></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="2">
                                                            <div class="ub" style="margin-top: 15px">
                                                                <i
                                                                    @click.stop="addConditionChild(cont.and)"
                                                                    class="el-icon-circle-plus-outline"
                                                                    style="
                                                                        cursor: pointer;
                                                                        font-size: 12px;
                                                                        color: #387dee;
                                                                        margin-left: 10px;
                                                                    "
                                                                ></i>
                                                                <i
                                                                    @click.stop="deleteConditionChild(cont.and, _item)"
                                                                    v-if="_index != 0"
                                                                    class="el-icon-remove-outline"
                                                                    style="
                                                                        cursor: pointer;
                                                                        font-size: 12px;
                                                                        color: #ff3a3a;
                                                                        margin-left: 10px;
                                                                    "
                                                                ></i>
                                                            </div>
                                                        </el-col>
                                                    </el-row>
                                                </div>
                                                <div class="ub grpop" :class="{'active':index===add_params.conts.length-1}">
                                                    <p class="del-btn">
                                                        <i class="el-icon-close" @click="deleteCondition(cont)">
                                                            删除组</i
                                                        >
                                                    </p>
                                                </div>
                                            </div>
                                            <p class="ub operate-color" :class="{'active':add_params.conts.length>0}">
                                                <i class="el-icon-plus" @click="addCondition"> 新增组</i>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-form>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="addDialog = false">取消</el-button>
                <el-button size="small" type="primary" @click="validAdd('add_params')">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="编辑标签映射" :visible.sync="editDialog" width="700px" custom-class="common-dialog">
            <div class="ub ub-ac dialog-conten">
                <div class="ub ub-pj w100" style="padding:10px 10px 0 10px;box-sizing: border-box;">
                    <el-form
                        ref="add_paramsEdit"
                        :model="add_paramsEdit"
                        label-width="110px"
                        class="w100"
                        label-position="top"
                        :rules="add_paramsEditRules"
                    >
                        <div style="position:relative">
                            <div class="btns">
                                <el-button icon="el-icon-plus" @click="addTagName" size="mini" type="text">添加标签名称</el-button>
                            </div>
                            <el-form-item label="标签名称：" prop="name">
                                <div class="ub ub-ac">
                                    <Treeselect
                                        size="small"
                                        style="width:100%;"
                                        :options="labelData"
                                        :normalizer="normalizer"
                                        noChildrenText="当前分支无子节点"
                                        noOptionsText="无可用选项"
                                        noResultsText="无可用选项"
                                        placeholder="请选择"
                                        v-model="add_paramsEdit.name"
                                    />
                                </div>
                            </el-form-item>
                        </div>
                        <div
                            class="data_center_tags-content"
                            style="width: 100%;box-sizing: border-box"
                        >
                            <div>
                                <div class="tag-cont-wrap">
                                    <div class="tag-cont">
                                        <div class="cont-inner infinite-list" v-infinite-scroll="loadMore">
                                            <div
                                                v-for="(cont, index) in add_paramsEdit.conts.slice(0, this.cutNum)"
                                                :key="index"
                                            >
                                                <el-divider v-if="index != 0" content-position="left">OR</el-divider>
                                                <div
                                                    class="cont-item"
                                                    v-for="(_item, _index) in cont.and"
                                                    :key="_index"
                                                >
                                                    <el-row>
                                                        <el-col :span="4">
                                                            <el-form-item
                                                                label-width="0"
                                                                class="w100"
                                                                :prop="'conts.' + index + '.and.' + _index + '.field'"
                                                                :rules="[
                                                                    {
                                                                        required: true,
                                                                        message: '请选择',
                                                                        trigger: 'change',
                                                                    },
                                                                ]"
                                                            >
                                                                <el-select
                                                                    clearable
                                                                    style="width: 100%"
                                                                    v-model="_item.field"
                                                                    placeholder="请选择"
                                                                    size="small"
                                                                    @change="changeFiled(_item)"
                                                                    filterable
                                                                >
                                                                    <el-option
                                                                        v-for="item in fieldList"
                                                                        :key="item.id"
                                                                        :label="item.name"
                                                                        :value="item.code"
                                                                    >
                                                                    </el-option>
                                                                </el-select>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="1">
                                                            <span class="sep-line">—</span>
                                                        </el-col>
                                                        <el-col :span="4">
                                                            <el-form-item
                                                                label-width="0"
                                                                class="w100"
                                                                :prop="
                                                                    'conts.' + index + '.and.' + _index + '.condition'
                                                                "
                                                                :rules="[
                                                                    {
                                                                        required: true,
                                                                        message: '请选择',
                                                                        trigger: 'change',
                                                                    },
                                                                ]"
                                                            >
                                                                <el-select
                                                                    clearable
                                                                    style="width: 100%"
                                                                    v-model="_item.condition"
                                                                    placeholder="请选择"
                                                                    size="small"
                                                                >
                                                                    <el-option
                                                                        v-for="item in conditionList"
                                                                        :key="item.value"
                                                                        :label="item.name"
                                                                        :value="item.value"
                                                                    >
                                                                    </el-option>
                                                                </el-select>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="1">
                                                            <span class="sep-line">—</span>
                                                        </el-col>

                                                        <el-col
                                                            :span="12"
                                                            v-if="_item.type===3"
                                                        >
                                                            <el-form-item
                                                                label-width="0"
                                                                class="w100"
                                                                :prop="'conts.' + index + '.and.' + _index + '.val'"
                                                                :rules="[
                                                                    {
                                                                        required: true,
                                                                        message: '请选择',
                                                                        trigger: 'change',
                                                                    },
                                                                ]"
                                                            >
                                                                <el-date-picker
                                                                    style="width: 100%"
                                                                    size="small"
                                                                    v-model="_item.val"
                                                                    type="datetime"
                                                                    value-format="timestamp"
                                                                    placeholder="选择日期时间"
                                                                >
                                                                </el-date-picker>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col
                                                            :span="12"
                                                            v-if="_item.type===2"
                                                        >
                                                            <el-form-item
                                                                label-width="0"
                                                                class="w100"
                                                                :prop="'conts.' + index + '.and.' + _index + '.val'"
                                                                :rules="[
                                                                    {
                                                                        required: true,
                                                                        message: '请选择',
                                                                        trigger: 'blur',
                                                                    },
                                                                ]"
                                                            >
                                                                <el-input-number placeholder="请输入" style="width: 100%" size="small" v-model.trim="_item.val" :controls="false"></el-input-number>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col
                                                            :span="12"
                                                            v-if="_item.type===4"
                                                        >
                                                            <el-form-item
                                                                label-width="0"
                                                                class="w100"
                                                                :prop="'conts.' + index + '.and.' + _index + '.val'"
                                                                :rules="[
                                                                    {
                                                                        required: true,
                                                                        message: '请选择',
                                                                        trigger: 'blur',
                                                                    },
                                                                ]"
                                                            >
                                                                <el-input
                                                                    style="width: 100%"
                                                                    placeholder="请输入"
                                                                    clearable
                                                                    v-model.trim="_item.val"
                                                                    size="small"
                                                                ></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col
                                                            :span="12"
                                                            v-if="_item.type===5"
                                                        >
                                                            <el-form-item
                                                                label-width="0"
                                                                class="w100"
                                                                :prop="'conts.' + index + '.and.' + _index + '.val'"
                                                                :rules="[
                                                                    {
                                                                        required: true,
                                                                        message: '请选择',
                                                                        trigger: 'change',
                                                                    },
                                                                ]"
                                                            >
                                                                <el-select
                                                                    clearable
                                                                    style="width: 100%"
                                                                    v-model="_item.val"
                                                                    placeholder="请选择"
                                                                    size="small"
                                                                >
                                                                    <el-option
                                                                        v-for="item in _item.enums"
                                                                        :key="item.value"
                                                                        :label="item.label"
                                                                        :value="item.value"
                                                                    >
                                                                    </el-option>
                                                                </el-select>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col  v-if="_item.type===1" :span="12">
                                                            <el-form-item
                                                                label-width="0"
                                                                class="w100"
                                                                :prop="'conts.' + index + '.and.' + _index + '.val'"
                                                                :rules="[
                                                                    {
                                                                        required: true,
                                                                        message: '请输入',
                                                                        trigger: 'blur',
                                                                    },
                                                                ]"
                                                            >
                                                                <el-input
                                                                    style="width: 100%"
                                                                    placeholder="请输入"
                                                                    clearable
                                                                    v-model.trim="_item.val"
                                                                    size="small"
                                                                ></el-input>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-col :span="2">
                                                            <div class="ub" style="margin-top: 15px">
                                                                <i
                                                                    @click.stop="addConditionChild(cont.and)"
                                                                    class="el-icon-circle-plus-outline"
                                                                    style="
                                                                        cursor: pointer;
                                                                        font-size: 12px;
                                                                        color: #387dee;
                                                                        margin-left: 10px;
                                                                    "
                                                                ></i>
                                                                <i
                                                                    @click.stop="deleteConditionChild(cont.and, _item)"
                                                                    v-if="_index != 0"
                                                                    class="el-icon-remove-outline"
                                                                    style="
                                                                        cursor: pointer;
                                                                        font-size: 12px;
                                                                        color: #ff3a3a;
                                                                        margin-left: 10px;
                                                                    "
                                                                ></i>
                                                            </div>
                                                        </el-col>
                                                    </el-row>
                                                </div>
                                                <div class="ub grpop" :class="{'active':index===add_paramsEdit.conts.slice(0,cutNum).length-1}">
                                                    <p class="del-btn">
                                                        <i class="el-icon-close" @click="deleteConditionEdit(cont)">
                                                            删除组</i
                                                        >
                                                    </p>
                                                </div>
                                            </div>
                                            <p class="ub operate-color" :class="{'active':add_paramsEdit.conts.slice(0, cutNum).length>0}">
                                                <i class="el-icon-plus" @click="addConditionEdit"> 新增组</i>
                                            </p>
                                            <p
                                                style="text-align: center; font-size: 12px; opacity: 0.5"
                                                v-if="this.cutNum >= this.add_paramsEdit.conts.length"
                                            >
                                                没有更多了
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-form>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="editDialog = false">取消</el-button>
                <el-button size="small" type="primary" @click="validAddEdit('add_paramsEdit')">确 定</el-button>
            </span>
        </el-dialog>
        <DeleteDialog
            :dialogVisible = delDialog
            @delete="delConfim"
            @cancel="delDialog = false">
        </DeleteDialog>
        <el-dialog title="添加标签" :visible.sync="addTypeDialog" width="700px" custom-class="common-dialog">
            <el-form :model="addTypeForm" ref="addTypeForm" label-position="top">
                <el-form-item label="上级标签：" label-width="120px">
                    <treeselect
                        class="treeselect"
                        :options="tableDataCopy"
                        :normalizer="normalizerTag"
                        noChildrenText="当前分支无子节点"
                        noOptionsText="无可用选项"
                        noResultsText="无可用选项"
                        placeholder="请选择"
                        v-model="addTypeForm.parentId"
                    />
                </el-form-item>
                <el-form-item
                    label="标签名称："
                    label-width="120px"
                    label-position="left"
                    prop="name"
                    :rules="[
                        {
                            required: true,
                            message: '请输入名称',
                            trigger: 'blur'
                        }
                    ]">
                    <el-input placeholder="请输入" clearable v-model="addTypeForm.name" size="small"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="addTypeDialog = false">取消</el-button>
                <el-button size="small" type="primary" @click="submitAddType('addTypeForm')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
// import initData from '@/mixins/initData.js'
import { saveTag, get_tag_copy_list } from '@/server/data_center/api.js'
import { getTree } from '@/server/data_manage/data_tag.js'
import {
    getChannels,
    get_list,
    del_tag,
    getAllField,
    getAllCondition,
    add_reg,
    update_reg,
    get_label_name
} from '@/server/data_center/tag.js'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
    name: 'TagList',
    // mixins: [initData],
    components: { Treeselect },
    data() {
        return {
            tableHeight: document.body.clientHeight - 230,
            currentThreeShow: false,
            currentSelect: {
                type: 1
            },
            tableDataCopy: [],
            addTypeForm: {
                name: '',
                parentId: null

            },
            addTypeDialog: false,
            normalizerTag(node) {
                if (node.sub && !node.sub.length) {
                    delete node.sub
                }
                return {
                    id: node.id,
                    label: node.name,
                    children: node.sub
                }
            },
            normalizer(node) {
                if (node.sub && !node.sub.length) {
                    delete node.sub
                }
                return {
                    id: node.name,
                    label: node.name,
                    children: node.sub
                }
            },

            isClick: true,
            isFirst: true,
            indent: 10,
            initId: null,
            depId: '',
            config_id: '',
            treeData: [],
            labelData: [],
            propsData: {
                children: 'child',
                label: 'name'
            },
            currentNode: {
                id: ''
            },
            currentNodeId: '',
            filterText: '',
            currentId: '',
            addLabelGroupDialog: false,
            addLabelGroupForm: {
                name: ''
            },
            editLabelGroupDialog: false,
            editLabelGroupForm: {
                name: ''
            },
            delLabelGroupDialog: false,

            cutNum: 10,
            addDialog: false,
            editDialog: false,
            delId: '',
            delDialog: false,
            add_params: {
                channelId: '',
                name: null,
                logTypeId: '',
                conts: []
            },
            add_paramsEdit: {
                id: '',
                logTypeId: '',
                channelId: '',
                name: null,
                conts: []
            },
            add_paramsEditRules: {
                name: [
                    {
                        required: true,
                        message: '请输入标签名称',
                        trigger: 'blur'
                    }
                ],
                channelId: [
                    {
                        required: true,
                        message: '请选择消费通道',
                        trigger: 'change'
                    }
                ]
            },
            channelNameList: [],
            total_num: 0,
            loading: false,
            get_params: {
                page: 1,
                size: 20,
                name: null,
                channelName: ''
            },
            fieldObj: {},
            fieldList: [],
            conditionObj: {},
            conditionList: [],
            tableData: [],
            multipleSelection: []
        }
    },
    watch: {
        addTypeDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.addTypeForm.resetFields()
                    this.addTypeForm = {
                        name: '',
                        parentId: null
                    }
                }
            }
        },
        filterText(val) {
            this.$refs.tree.filter(val)
        },
        addDialog: function(val, oldVla) {
            if (!val) {
                this.add_params = {
                    channelId: '',
                    name: null,
                    conts: []
                }
                this.$refs.add_params.resetFields()
            }
        },
        editDialog: function(val, oldVla) {
            if (!val) {
                this.add_paramsEdit = {
                    id: '',
                    channelId: '',
                    name: null,
                    conts: []
                }
                this.cutNum = 10
                this.$refs.add_paramsEdit.resetFields()
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.getDict()
            // this.getList()
            this.initTree()
            this.initLabelName()
            this.get_copy_data()
        })
    },
    methods: {
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex % 2) {
                return 'table-row2'
            } else {
                return 'table-row1'
            }
        },
        reset() {
            this.get_params.name = null
            setTimeout(() => {
                this.getList()
            }, 1500)
        },
        addTagName() {
            this.addTypeDialog = true
        },
        get_copy_data() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_tag_copy_list(data).then(res => {
                this.tableDataCopy = this.$deepCopy(res)
            }).catch(error => {
                console.log('error' + error)
            })
        },
        submitAddType(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.addTypeDialog = false
                    this.handleSuccess()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        handleSuccess() {
            let data = {
                queryData: {},
                paramsData: {
                    name: this.addTypeForm.name
                }
            }
            if (this.addTypeForm.parentId) {
                data.paramsData.parentId = this.addTypeForm.parentId
            }
            saveTag(data).then(res => {
                this.addTypeDialog = false
                this.$message({
                    type: 'success',
                    message: '添加成功'
                })
                setTimeout(() => {
                    this.initLabelName()
                    this.get_copy_data()
                }, 1500)
            }).catch(err => {
                console.log(err + 'err')
            })
        },
        initTree() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            getTree(data).then(res => {
                console.log('tree', res)
                if (this.isFirst) {
                    this.depId = res[0].child[0].id
                    this.getList()
                }
                this.isFirst = false
                this.treeData = res
            }).then(() => {
                this.$refs.tree.setCurrentKey(this.depId)
            }).catch(error => {
                console.log('error' + error)
            })
        },
        initLabelName() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_label_name(data).then(res => {
                console.log('标签名称', res)
                this.labelData = res
            }).catch(error => {
                console.log('error' + error)
            })
        },
        filterNode(value, data) {
            if (!value) return true
            return data.name.indexOf(value) !== -1
        },
        initParams() {
            this.get_params = {
                page: 1,
                size: 20,
                name: null,
                channelName: ''
            }
            this.total_num = 0
        },
        handleNodeClick(node) {
            if (node.grade === 1) return
            this.currentNode = node
            console.log(node)
            this.depId = node.id
            this.initParams()
            this.getList()
        },

        loadMore() {
            this.cutNum += 10
        },
        changeFiled(item) {
            // console.log(item, index, _index)
            // debugger
            let data = this.fieldList.filter(val => {
                return val.code === item.field
            })
            item.type = data[0].type
            if (data[0].type === 5)item.enums = data[0].enums

            console.log(this.currentSelect.type)
            // debugger

            // item.val = ''
        },
        changeFiledEdit(item) {
            item.val = ''
        },
        // 添加内容
        add() {
            this.addDialog = true
        },
        addConditionChild(and) {
            and.push({
                field: '',
                condition: '',
                val: '',
                type: 1
            })
        },
        deleteConditionChild(and, item) {
            and.splice(and.indexOf(item), 1)
        },
        addCondition() {
            this.add_params.conts.push({
                and: [
                    {
                        field: '',
                        condition: '',
                        val: '',
                        type: 1
                    }
                ]
            })
        },
        deleteCondition(item) {
            this.add_params.conts.splice(this.add_params.conts.indexOf(item), 1)
        },
        // 编辑
        addConditionChildEdit(and) {
            and.push({
                field: '',
                condition: '',
                val: '',
                type: 1
            })
        },
        deleteConditionChildEdit(and, item) {
            and.splice(and.indexOf(item), 1)
        },
        addConditionEdit() {
            this.add_paramsEdit.conts.push({
                and: [
                    {
                        field: '',
                        condition: '',
                        val: '',
                        type: 1
                    }
                ]
            })
        },
        deleteConditionEdit(item) {
            this.add_paramsEdit.conts.splice(this.add_paramsEdit.conts.indexOf(item), 1)
        },
        // 弹窗添加标签内容
        addTagContent() {
            this.add_params.conts.push({
                field: '',
                condition: '',
                val: ''
            })
        },
        addTagContentEdit() {
            this.add_paramsEdit.conts.push({
                field: '',
                condition: '',
                val: ''
            })
        },
        removeTagCont(i) {
            this.add_params.conts.splice(i, 1)
        },
        removeTagContEdit(i) {
            this.add_paramsEdit.conts.splice(i, 1)
        },
        handleEdit(row) {
            console.log(row)
            // let channelId = "";
            // if (this.channelNameList.some((item) => item.value === row.channelId)) {
            //     channelId = row.channelId;
            // }
            this.add_paramsEdit = {
                id: row.id,
                logTypeId: this.depId,
                name: row.name,
                conts: this.$deepCopy(row.contentObj)
            }
            this.editDialog = true
            // debugger
        },
        getDict() {
            let PromiseArr = [getChannels({
                queryData: {},
                paramsData: {}
            }), getAllField({
                queryData: {},
                paramsData: {}
            }), getAllCondition({
                queryData: {},
                paramsData: {}
            })]
            Promise.all(PromiseArr)
                .then((result) => {
                    let channel = result[0]
                    let field = result[1]
                    let condition = result[2]
                    console.log('field', field)
                    channel.forEach((item) => {
                        this.channelNameList.push({
                            value: item.id,
                            label: item.name
                        })
                    })
                    this.fieldList = field
                    this.conditionList = condition
                    field.forEach((item) => {
                        this.fieldObj[item.fieldName] = item.name
                    })
                    condition.forEach((item) => {
                        this.conditionObj[item.value] = item.name
                    })
                    console.log(field, condition)
                })
                .catch((err) => {
                    console.log('error', err)
                })
        },
        // 导出
        exportContent() {},
        // 导入
        importContent() {},
        // 删除
        deleteContent() {
            if (this.multipleSelection.length == 0) {
                this.$message({
                    message: '请至少选择一项',
                    type: 'warning'
                })
            } else {
                let ids = this.multipleSelection.map((item) => {
                    return item.id
                })
                del_tag({ paramsData: { ids }}).then((res) => {
                    this.delDialog = false
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    })
                    this.getList()
                })
            }
        },

        validAdd(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.addConfirm()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        validAddEdit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.addConfirmEdit()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        addConfirm() {
            console.log(this.add_params.conts)
            console.log('this.add_params', this.add_params)
            let paramsData = {
                name: this.add_params.name,
                logTypeId: this.depId,
                contentObj: this.add_params.conts
            }
            add_reg({ paramsData: paramsData }).then((res) => {
                console.log(res)
                this.$message({
                    message: '操作成功',
                    type: 'success'
                })
                this.addDialog = false
                setTimeout(() => {
                    this.getList()
                }, 1500)
            })
        },
        addConfirmEdit() {
            console.log(this.add_params.conts)
            console.log('this.add_params', this.add_params)
            let paramsData = {
                id: this.add_paramsEdit.id,
                name: this.add_paramsEdit.name,
                logTypeId: this.depId,
                contentObj: this.add_paramsEdit.conts
            }
            update_reg({ paramsData: paramsData }).then((res) => {
                console.log(res)
                this.$message({
                    message: '操作成功',
                    type: 'success'
                })
                this.editDialog = false
                setTimeout(() => {
                    this.getList()
                }, 1500)
            })
        },
        handleDel(row) {
            this.delDialog = true
            this.delId = row.id
        },
        delConfim() {
            del_tag({ paramsData: { ids: [this.delId] }}).then((res) => {
                this.delDialog = false
                this.$message({
                    message: '操作成功',
                    type: 'success'
                })
                this.getList()
            })
        },
        getList() {
            let uid = this.config_id = new Date().getTime()
            this.tableData = []
            this.loading = true
            let data = {
                queryData: {
                    page: this.get_params.page,
                    pageSize: this.get_params.size
                },
                paramsData: {
                    logTypeId: this.depId,
                    name: this.get_params.name,
                    channelName: this.get_params.channelName
                }
            }
            get_list(data)
                .then((res) => {
                    if (this.config_id != uid) {
                        return
                    }
                    console.log('标签列表', res)
                    this.loading = false
                    this.total_num = res.total
                    let list = res.records
                    if (list.length > 0) {
                        list.forEach((item) => {
                            let obj = {}
                            obj.id = item.id
                            obj.logTypeId = item.logTypeId
                            obj.name = item.name
                            obj.channelName = item.channelName
                            obj.contentObj = item.contentObj ? item.contentObj : []
                            obj.channelId = item.channelId
                            obj.version = item.version
                            obj.property = item.property
                            obj.manufacturer = item.manufacturer
                            this.tableData.push(obj)
                        })
                    }
                })
                .catch((error) => {
                    this.loading = false
                    console.log('error', error)
                })
        },

        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        searchData() {
            this.get_params.page = 1
            this.getList()
        },
        handleSizeChange(val) {
            this.get_params.size = val
            this.getList()
        },
        handleCurrentChange(val) {
            this.get_params.page = val
            this.getList()
        },
        handleSelectionChange(val) {
            console.log(val)
            this.multipleSelection = val
        }
    }
}
</script>

<style lang="scss" scoped>
.btns{
    text-align: right;
    position: absolute;
    right: 0px;
    top: -5px;
}
.tree-line {
    height: 750px;
    overflow-y: auto;
}
.btn {
    width: 86px;
    height: 30px;
    background-color: #00c6ff;
    box-shadow: inset 0px 0px 7px 0px#389bf7;
    border-radius: 0px 2px 2px 0px;
    border: solid 1px #1cd7fa;
}
// .list-tips {
//     height: 24px;
//     line-height: 24px;
//     &::before {
//         height: 24px;
//     }
// }
.data_center_tags-content {
    position: relative;
}

.data_center_tags-content:before {
    content: "标签内容：";
    font-size: 12px;
    position: absolute;
    color: #fff;
    left: 40px;
}

.tag-item {
    display: inline-block;
    width: 68px;
    color: #00fcff;
    font-size: 12px;
    line-height: 20px;
    text-align: center;
    height: 20px;
    border-radius: 4px;
    border: solid 1px #00c6ff;
}
.el-tree{
    background: rgba(0,0,0,0);
    ::v-deep .custom-tree-node {
        span {
            color:rgba(0, 0, 0, 0.9);
        }
    }
}
.event  ::v-deep  .custom-tree-node{
    height: 26px;
    line-height: 26px;
}
.tree ::v-deep .el-tree--highlight-current .el-tree-node>.el-tree-node__content {
    .custom-tree-node{
        span:nth-child(1){
            color:#bfdce4!important;
        }
        span:nth-child(2){
            color:#fff!important;
        }

    }
}
.tree ::v-deep .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
    background-color: rgba(0,0,0,0)!important;
    .custom-tree-node{
        span{
            color:#1cd7fa!important;
        }
    }
}
.tree ::v-deep .el-tree--highlight-current .el-tree-node>.el-tree-node__content:hover{
    background-color: rgba(0,0,0,0)!important;
    .custom-tree-node{
        span{
            color:#1cd7fa!important;
        }
    }
}
.hightlight {
    color: #387dee;
}

.sep-line {
    width: 26px;
    // margin: 0 5px;
    display: inline-block;
    text-align: center;
    margin-top: 10px;
    color:rgba(0,0,0,0.4);
}

.operate-wrap {
    display: inline-block;
    color: #389bf7;
    width: 26px;
    text-align: center;

    i {
        cursor: pointer;
        font-size: 16px;
    }
}

.tag-cont-wrap {
    //   text-align: right;
    .addbtn {
        cursor: pointer;
        display: inline-block;
        color: #01e9ff;
        font-size: 14px;

        span {
            margin-left: 9px;
        }
    }

    .tag-cont {
        background: rgba(56,125,238,0.02) !important;
        border-radius: 4px 4px 2px 4px;
        border: 1px solid #dddddd !important;
        padding: 10px;
        .el-form-item {
            margin-bottom: 20px;
        }
    }

    .cont-inner {
        background: rgba(255, 255, 255, 0.1);
        padding: 10px 10px 10px 10px;
        height: 400px;
        overflow-y: auto;
    }

    .cont-inner .cont-item:not(:nth-last-child(2)) {
        // margin-bottom: 10px;
    }
}

.event .el-divider {
    background-color: #dddddd;
}

.event  ::v-deep  .el-divider__text {
    background-color: #fff;
    padding: 0 5px;
    color: #0052d9;
}

.event > .el-divider--horizontal {
    width: 97%;
}

.del-btn {
    font-size: 12px;
    color: #e34d59;
    margin-left: 0px;
    cursor: pointer;

    i {
        margin-right: 4px;
    }
}

.operate-color {
    font-size: 12px;
    color: #0052d9;
    cursor: pointer;
    position: relative;
    z-index: 10;
    width:70px;
    &.active{
        top:-14px;
    }

    i {
        margin-right: 4px;
    }
}
.grpop.active{
    padding-left:70px;
}
.el-table th > .cell {
    white-space: pre-line;
    text-align: center;
}

.dialog-conten {
    width: 100%;
}

.tag-list > .attendance-dialog {
    .el-dialog__header {
        .el-dialog__title {
            font-size: 14px;
        }
    }

    .el-form-item__label {
        font-size: 12px;
    }

    .el-input__inner,
    .el-textarea__inner {
        font-size: 12px;
    }
}

.dialog-item {
    margin-bottom: 30px;
}

.w50 {
    width: 50%;
}

.dialog-item {
    .dialog-label {
        display: inline-block;
        text-align: right;
        width: 86px;
        color: #fff;
        opacity: 0.6;
    }
}
.treeselect{
    padding: 0;
    ::v-deep .vue-treeselect__control{
        height: 32px;
        line-height: 32px;
    }
    ::v-deep .vue-treeselect__input{
        vertical-align: middle;
    }
}
// .event .vue-treeselect__control {
//     height: 32px !important;
// }
// .tag-list ::v-deep .vue-treeselect__placeholder {
//     line-height: 30px;
// }
.event ::v-deep .vue-treeselect__control{
        height: 32px;
        line-height: 32px;
        font-size: 12px;
}
.event ::v-deep .vue-treeselect__input{
        vertical-align: middle !important;
}
.custom-star {
    #app {
        .bg-color {
            background: unset;
        }
        .el-tree {
            ::v-deep .custom-tree-node {
                color: red;
                span {
                    color:rgba(255, 255, 255, 0.9);
                }
            }
        }
        .vue-treeselect__portal-target .vue-treeselect__menu .vue-treeselect__option {
            color: #fff;
        }
    }
}
</style>
<style>
    .custom-star {
        .vue-treeselect__portal-target .vue-treeselect__option {
            color: #fff;
        }
        .vue-treeselect--single .vue-treeselect__option--selected {
            color: #1cd7fa;
            background-color: rgba(255,255,255,.2);
        }
    }
    .custom-tree-node span:hover {
        color: #0052d9 !important;
    }
    .el-tree-node__content {
        background-color: rgba(0,0,0,0)!important;
        color: #0052d9;
    }
    /*高亮当前点击项*/
    /* .el-tree-node__content:hover,.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content .custom-tree-node span{
        background: none !important;
        color: #1cd7fa !important;
    } */
     .el-tree-node__children .el-tree-node.is-current>.el-tree-node__content .custom-tree-node span{
        background: none !important;
        color: #0052d9 !important;
    }
</style>
