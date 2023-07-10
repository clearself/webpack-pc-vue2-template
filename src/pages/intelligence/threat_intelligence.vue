<template>
    <div class="intelligence_lib">
        <div class="ub w100" style="box-sizing: border-box;">
            <SearchTop @search="searchAssets" @reset="reset">
                <el-col :md="12" :lg="8" :xl="6">
                    <el-form :model="get_params">
                        <el-form-item label="情报内容：" label-width="80px">
                            <el-input
                                placeholder="请输入"
                                clearable
                                v-model="get_params.content"
                                size="small"></el-input>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :md="12" :lg="8" :xl="6">
                    <el-form :model="get_params">
                        <el-form-item label="情报类型：" label-width="80px">
                            <el-select style="width:100%;" v-model="get_params.type" placeholder="请选择" clearable size="small">
                                <el-option label="IP" value=0></el-option>
                                <el-option label="URL" value=1></el-option>
                                <el-option label="域名" value=2></el-option>
                                <el-option label="样本信息" value=3></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :md="12" :lg="8" :xl="6">
                    <el-form :model="get_params">
                        <el-form-item label="攻击方式：" label-width="80px">
                            <el-select style="width:100%;" v-model="get_params.mode" placeholder="请选择" size="small">
                                <el-option
                                    v-for="item in attackWays"
                                    :key="item.code"
                                    :label="item.name"
                                    :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :md="12" :lg="8" :xl="6">
                    <el-form :model="get_params">
                        <el-form-item label="创建时间：" label-width="80px">
                            <el-date-picker
                                :default-time="['00:00:00', '23:59:59']"
                                style="width:100%;"
                                size="small"
                                :clearable="false"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                v-model="sayTimes"
                                type="datetimerange"
                                range-separator="~"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-form>
                </el-col>
            </SearchTop>
        </div>
        <div class="intelligence_lib_list">
            <div class="ub ub-pj w100" style="margin-bottom: 10px;">
                <div class="list-tips">列表内容</div>
                <div class="btn-wrap">
                    <el-button v-per="['intelligence_library_add']" type="primary" icon="el-icon-plus" size="small"  @click="openAddDialog">添加情报</el-button>
                    <el-upload
                        :action="action"
                        name="fileUpload"
                        accept=".xlsx,.xlsx"
                        :headers="header"
                        :file-list="fileList"
                        :show-file-list="false"
                        :on-success="handleSuccess"
                        style="display: inline-block;margin: 0 10px">
                        <el-button v-per="['intelligence_library_import']" type="primary" size="small" icon="iconfont icon-daoru">导入内容</el-button>
                    </el-upload>
                    <el-button size="small" v-per="['intelligence_library_export']" @click="downLoadContent" type="primary" icon="iconfont icon-daochu">导出内容</el-button>
                    <!-- </a> -->
                    <!-- <a :href="downloadTemplate" style="margin: 0 10px" download> -->
                    <el-button size="small" v-per="['intelligence_library_download']" @click="downLoadTemplate" type="primary" icon="iconfont icon-xiazai">模板下载</el-button>
                    <!-- </a> -->
                    <el-button size="small" v-per="['intelligence_library_del']" @click="deleteAllDialog = true" type="danger" icon="el-icon-delete">删 除</el-button>
                </div>
            </div>
            <el-table
                :row-class-name="tableRowClassName"
                :height="tableHeight"
                ref="multipleTable"
                v-loading="loading"
                class='bigTable'
                :data="tableData"
                border
                stripe
                tooltip-effect="dark"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50"></el-table-column>
                <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                </el-table-column>
                <el-table-column prop="content" label="情报内容">
                </el-table-column>
                <el-table-column prop="typeCN" label="情报类型" width="100">
                </el-table-column>
                <el-table-column label="攻击方式" show-overflow-tooltip>
                    <template slot-scope="{row}">
                        <!-- eslint-disable-next-line vue/require-v-for-key -->
                        <div>
                            <span v-for="(item,index) in row.attackModes" :key="index">{{ item.modeCodeCN }}
                                <span v-if="row.attackModes.length !== index + 1">、</span>
                            </span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="sourcesCN" label="情报来源" width="90">
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="170">
                </el-table-column>
                <el-table-column prop="updateTime" label="更新时间" width="170">
                </el-table-column>
                <el-table-column label="操作" align="center" width="120">
                    <template slot-scope="scope">
                        <el-button v-per="['intelligence_library_edit']" type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button v-per="['intelligence_library_del']" type="text" size="small" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="total_num>0" :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size" @pagination="get_data" />
        </div>
        <el-dialog title="查看情报" :visible.sync="seeDialog" width="700px" custom-class="common-dialog">
            <div style="width:100%;margin: 0 auto;" class="seeDialog">
                <el-form :model="seeForm" ref="exportsForm" label-width="100px" label-position="right">
                    <el-form-item label="情报内容：" style="margin: 10px 0">
                        {{ seeForm.content }}
                    </el-form-item>
                    <el-row style="margin: 10px 0">
                        <el-col :span="8">
                            <el-form-item label="情报类型：">
                                {{ seeForm.typeCN }}
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="情报来源：">
                                {{ seeForm.sourcesCN }}
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="情报存活性：">
                                {{ seeForm.survivalCN }}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row style="margin: 10px 0">
                        <el-col :span="8">
                            <el-form-item label="信誉度：">
                                {{ seeForm.credit }}
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="威胁程度：">
                                {{ seeForm.threatLevel }}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="攻击方式：" style="margin: 10px 0">
                        {{ seeForm.modeCodeCN }}
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <searchBtn title="确 定" @click="edit_success"/>
                <cancel-btn title="取 消" @click="seeDialog = false"/>
            </span>
        </el-dialog>
        <DeleteDialog
            :dialogVisible = deleteItemDialog
            @delete="handleDeleteItemFun"
            @cancel="deleteItemDialog = false">
        </DeleteDialog>
        <DeleteDialog
            :dialogVisible = deleteAllDialog
            @delete="handleDeleteAllFun"
            @cancel="deleteAllDialog = false">
        </DeleteDialog>
        <el-drawer :visible.sync="editDialog" direction="rtl" :size="900" title="编辑情报"  :before-close="handleClose" custom-class="drawer-dialog">
            <div class="content w100" style="margin-top: -15px;">
                <el-form :model="editForm" ref="editForm" label-width="140px" label-position="top" :rules="editRules">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="情报类型：" prop="type">
                                <el-select
                                    v-model="editForm.type"
                                    placeholder="请选择"
                                    style="width: 300px;"
                                    size="small">
                                    <el-option label="IP" value=0></el-option>
                                    <el-option label="URL" value=1></el-option>
                                    <el-option label="域名" value=2></el-option>
                                    <el-option label="样本信息" value=3></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="情报内容：" prop="content">
                                <el-input
                                    v-model="editForm.content"
                                    :placeholder="editForm.type === '0' ? '请输入IP' : '请输入'"
                                    style="width: 300px;"
                                    size="small"
                                    clearable></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="情报来源：" prop="sources">
                                <el-select
                                    v-model="editForm.sources"
                                    placeholder="请选择"
                                    style="width: 300px;"
                                    size="small">
                                    <el-option label="Venuseye " value=0></el-option>
                                    <el-option label="内部情报" value=1></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="是否存活："  prop="survival">
                                <el-select
                                    v-model="editForm.survival"
                                    placeholder="请选择"
                                    style="width: 300px;"
                                    size="small">
                                    <el-option label="否" value=0></el-option>
                                    <el-option label="是" value=1></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="威胁程度：" prop="threatLevel">
                                <el-input-number
                                    v-model="editForm.threatLevel"
                                    controls-position="right"
                                    :min="0"
                                    :max="100"
                                    size="small"
                                    style="width: 300px;"></el-input-number>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="信誉度：" prop="credit">
                                <el-input-number
                                    v-model="editForm.credit"
                                    controls-position="right"
                                    :min="0"
                                    :max="100"
                                    size="small"
                                    style="width: 300px;"></el-input-number>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="家族：" prop="family">
                                <el-input v-model="editForm.family" placeholder="请输入家族" style="width: 300px;" size="small" clearable>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="攻击组织：" prop="attackOrg">
                                <el-input v-model="editForm.attackOrg" placeholder="请输入攻击组织" style="width: 300px;" size="small" clearable>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="原始来源：" prop="origin">
                                <el-input v-model="editForm.origin" placeholder="请输入原始来源" style="width: 300px;" size="small" clearable>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="原始编号：" prop="originCode">
                                <el-input v-model="editForm.originCode" placeholder="请输入原始编号" style="width: 300px;" size="small" clearable>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="原始信誉度：" prop="originCredit">
                                <el-input-number
                                    v-model="editForm.originCredit"
                                    controls-position="right"
                                    :min="0"
                                    :max="100"
                                    size="small"
                                    style="width: 300px;"></el-input-number>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="存活开始时间：" prop="beginTime">
                                <el-date-picker
                                    style="width: 300px;"
                                    v-model="editForm.beginTime"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    size="small"
                                    type="datetime"
                                    placeholder="选择日期时间">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="存活结束时间：" prop="finishTime">
                                <el-date-picker
                                    style="width: 300px;"
                                    v-model="editForm.finishTime"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    size="small"
                                    type="datetime"
                                    placeholder="选择日期时间">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="攻击方式：" style="margin-top: 20px" prop="modeCode">
                        <div class="attack-box">
                            <div class="show-box" ref="show-box-edit">
                                <div class="wrapper clearfix" ref="wrapper-edit">
                                    <div class="attack-item" v-for="(item) in attackWays" :class="{'active': item.active}" :key="item.code" @click="handleClickEditItem(item)">
                                        {{item.name}}
                                        <span class="checkd-img">
                                            <i class="el-icon-check"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div v-if="editLabel" class="more-btn ub ub-ac" :class="{open: editOpen}" @click="handleEditMore">
                                <p>{{editOpen ? '收 起' : '展开更多'}}</p>
                                <i class="iconfont icon-zuo1"></i>
                            </div>
                        </div>
                    </el-form-item>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="处理建议：" prop="finishTime">
                                <vue-ueditor-wrap v-model="editForm.dealAdvise" :config="myConfig"></vue-ueditor-wrap>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row class="mb-4 mt-2">
                        <el-col :span="24">
                            <el-form-item label="情报描述：" prop="finishTime">
                                <vue-ueditor-wrap v-model="editForm.des" :config="myConfig"></vue-ueditor-wrap>
                            </el-form-item>
                        </el-col>
                    </el-row>

                </el-form>
                <div
                    slot="footer"
                    class="dialog-footer"
                    style="
                    position: fixed;
                    bottom: 0;
                    right: 0;
                    z-index: 9999;
                    width: 900px;
                    background: #fff;
                    padding-bottom: 10px;
                    text-align: right;">
                    <el-button @click="editDialog = false" size="small">取消</el-button>
                    <el-button @click="submitForm_e('editForm')" size="small" type="primary" style="margin-right:30px">确定</el-button>
                </div>
            </div>
        </el-drawer>
        <el-drawer :visible.sync="addDialog" direction="rtl" :size="900" title="添加情报"  :before-close="handleClose" custom-class="drawer-dialog">
            <div class="content w100" style="margin-top: -15px;">
                <el-form :model="addForm" ref="addForm" label-width="100px" label-position="top" :rules="addRules">
                    <div class="row">
                        <el-form-item label="情报类型：" prop="type">
                            <el-select
                                style="width:200px"
                                v-model="addForm.type"
                                placeholder="请选择"
                                size="small">
                                <el-option label="IP" value=0></el-option>
                                <el-option label="URL" value=1></el-option>
                                <el-option label="域名" value=2></el-option>
                                <el-option label="样本信息" value=3></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="情报内容：" prop="content">
                            <el-input style="width:200px" v-model="addForm.content" :placeholder="addForm.type === '0' ? '请输入IP' : '请输入'"  size="small" clearable>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="情报来源：" prop="sources">
                            <el-select
                                style="width:200px"
                                v-model="addForm.sources"
                                placeholder="请选择"
                                size="small">
                                <el-option label="Venuseye " value=0></el-option>
                                <el-option label="内部情报" value=1></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="row">
                        <el-form-item label="是否存活：" prop="survival">
                            <el-select
                                style="width:200px"
                                v-model="addForm.survival"
                                placeholder="请选择"
                                size="small">
                                <el-option label="否" value=0></el-option>
                                <el-option label="是" value=1></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="威胁程度：" prop="threatLevel" label-width="98px">
                            <el-input-number
                                v-model="addForm.threatLevel"
                                controls-position="right"
                                :min="0"
                                :max="100"
                                size="small"
                                style="width:200px"
                            ></el-input-number>
                        </el-form-item>
                        <el-form-item label="信誉度：" prop="credit">
                            <el-input-number
                                v-model="addForm.credit"
                                controls-position="right"
                                :min="0"
                                :max="100"
                                size="small"
                                style="width:200px"
                            >
                            </el-input-number>
                        </el-form-item>

                    </div>
                    <div class="row">
                        <el-form-item label="家族：" prop="family">
                            <el-input style="width:200px" v-model="addForm.family" placeholder="请输入家族"  size="small" clearable>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="攻击组织：" prop="attackOrg">
                            <el-input style="width:200px" v-model="addForm.attackOrg" placeholder="请输入攻击组织"  size="small" clearable>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="原始来源：" prop="origin">
                            <el-input style="width:200px" v-model="addForm.origin" placeholder="请输入原始来源"  size="small" clearable>
                            </el-input>
                        </el-form-item>
                    </div>
                    <div class="row">
                        <el-form-item label="原始编号：" prop="originCode">
                            <el-input style="width:200px" v-model="addForm.originCode" placeholder="请输入原始编号"  size="small" clearable>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="原始信誉度：" prop="originCredit">
                            <el-input-number
                                v-model="addForm.originCredit"
                                controls-position="right"
                                :min="0"
                                :max="100"
                                size="small"
                                style="width:200px"
                            ></el-input-number>
                        </el-form-item>
                        <el-form-item label="存活开始时间：" prop="beginTime">
                            <el-date-picker
                                style="width:200px"
                                v-model="addForm.beginTime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                size="small"
                                type="datetime"
                                placeholder="选择日期时间"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </div>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="存活结束时间：" prop="finishTime">
                                <el-date-picker
                                    v-model="addForm.finishTime"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    size="small"
                                    type="datetime"
                                    placeholder="选择日期时间"
                                    style="width:200px"
                                >
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="攻击方式：" style="margin-top: 20px" prop="modeCode">
                        <div class="attack-box">
                            <div class="show-box" ref="show-box-add">
                                <div class="wrapper clearfix" ref="wrapper-add">
                                    <div class="attack-item" v-for="(item) in attackWays" :class="{'active': item.active}" :key="item.code" @click="handleClickItem(item)">
                                        {{item.name}}
                                        <span class="checkd-img">
                                            <i class="el-icon-check"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div v-if="addLabel" class="more-btn ub ub-ac" :class="{open: addOpen}" @click="handleAddMore">
                                <p>{{addOpen ? '收 起' : '展开更多'}}</p>
                                <i class="iconfont icon-zuo1"></i>
                            </div>
                        </div>
                    </el-form-item>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="处理建议：" prop="finishTime">
                                <vue-ueditor-wrap v-model="addForm.dealAdvise" :config="myConfig"></vue-ueditor-wrap>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row class="mb-4 mt-2">
                        <el-col :span="24">
                            <el-form-item label="情报描述：" prop="finishTime">
                                <vue-ueditor-wrap v-model="addForm.des" :config="myConfig"></vue-ueditor-wrap>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div
                    slot="footer"
                    class="dialog-footer"
                    style="
                    position: fixed;
                    bottom: 0;
                    right: 0;
                    z-index: 9999;
                    width: 900px;
                    background: #fff;
                    padding-bottom: 10px;
                    text-align: right;">
                    <el-button @click="addDialog = false" size="small">取消</el-button>
                    <el-button @click="submitForm('addForm')" size="small" type="primary" style="margin-right:30px">确定</el-button>
                </div>
            </div>
        </el-drawer>
    </div>
</template>

<script>
import {
    get_attackWay,
    get_attackList,
    save_attack,
    update_attack,
    del_attack,
    intelligenceExportExcel,
    intelligenceExportExcelTemplate
} from '../../server/intelligence/intelligence.js'
import VueUeditorWrap from '../../components/vue-ueditor-wrap.vue'
import ueditorConfig from '../../mixins/ueditorConfig'
export default {
    name: 'ThreatIntelligence',
    components: {
        VueUeditorWrap
    },
    mixins: [ueditorConfig],
    data() {
        return {
            tableHeight: document.body.clientHeight - 270,
            isOpen: false,
            detailArr: [],
            addDialog: false,
            editDialog: false,
            seeDialog: false,
            deleteItemDialog: false,
            deleteAllDialog: false,
            delId: '',
            fileList: [],
            multipleSelection: [],
            row: {},
            num: 1,
            addForm: {
                content: '',
                type: '',
                threatLevel: '',
                credit: '',
                sources: '',
                survival: '',
                attackModes: [],
                modeCode: [],
                /* 新增*/
                family: '',
                attackOrg: '',
                origin: '',
                originCode: '',
                originCredit: '',
                dealAdvise: '',
                des: '',
                beginTime: '',
                finishTime: ''
            },
            addRules: {
                content: { required: true, message: '请输入情报内容', trigger: 'blur' },
                type: { required: true, message: '请选择情报类型', trigger: 'change' },
                sources: { required: true, message: '请选择情报来源', trigger: 'change' },
                survival: { required: true, message: '请选择情报存活性', trigger: 'change' },
                modeCode: { required: true, message: '请选择攻击方式', trigger: 'blur' }
            },
            editForm: {
                id: '',
                content: '',
                type: '',
                threatLevel: '',
                credit: '',
                sources: '',
                survival: '',
                attackModes: [],
                modeCode: [],
                /* 新增*/
                family: '',
                attackOrg: '',
                origin: '',
                originCode: '',
                originCredit: '',
                dealAdvise: '',
                des: '',
                beginTime: '',
                finishTime: ''
            },
            editRules: {
                content: { required: true, message: '请输入', trigger: 'blur' },
                type: { required: true, message: '请选择情报类型', trigger: 'change' },
                sources: { required: true, message: '请选择情报来源', trigger: 'change' },
                survival: { required: true, message: '请选择情报存活性', trigger: 'change' },
                modeCode: { required: true, message: '请选择攻击方式', trigger: 'blur' }
            },
            seeForm: {
                id: '',
                content: '',
                typeCN: '',
                sourcesCN: '',
                survivalCN: '',
                credit: '',
                threatLevel: ''
            },
            loading: false,
            total_num: 0,
            tableData: [
                {}
            ],
            sayTimes: [],
            get_params: {
                page: 1,
                size: 20,
                content: '',
                type: '',
                mode: ''
            },
            attackWays: [],
            addOpen: false,
            editOpen: false,
            addLabel: false,
            editLabel: false
        }
    },

    mounted() {
        this.$nextTick(() => {
            this.init_attackWay()
            this.get_data()
        })
    },
    computed: {
        header() {
            return { token: this.$getlocalStorage('initInfo').user.token }
        },
        // downloadUrl() {
        //     return '/api/intelligence/manage/intelligence/exportExcel?startTime=' + (this.sayTimes && this.sayTimes.length > 0 ? this.sayTimes[0] : '') + '&endTime=' + (this.sayTimes && this.sayTimes.length > 0 ? this.sayTimes[1] : '') + '&content=' + this.get_params.content + '&type=' + this.get_params.type + '&mode=' + this.get_params.mode
        // },
        // downloadTemplate() {
        //     return '/api/intelligence/manage/intelligence/template'
        // },
        action() {
            return '/api/intelligence/manage/intelligence/importExcel'
        }
    },
    watch: {
        addDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.addForm.resetFields()
                    this.addOpen = false
                    this.addLabel = false
                    // eslint-disable-next-line no-return-assign
                    this.attackWays.forEach(item => item.active = false)
                    this.addForm.des = ''
                    this.addForm.dealAdvise = ''
                }
            }
        },
        editDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.editForm.resetFields()
                    this.editOpen = false
                    this.editLabel = false
                    // eslint-disable-next-line no-return-assign
                    this.attackWays.forEach(item => item.active = false)
                }
            }
        }
    },
    methods: {
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    this.editDialog = false
                    this.addDialog = false
                    done()
                })
                .catch(_ => {})
        },
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex % 2) {
                return 'table-row2'
            } else {
                return 'table-row1'
            }
        },
        reset() {
            this.sayTimes = []
            this.get_params = {
                page: 1,
                size: 20,
                content: '',
                type: '',
                mode: ''
            }
            this.get_data()
        },
        /**
         * 根据 攻击方式长度设置容器溢出隐藏
         * @param show 展示盒子
         * @param wrapper 包裹盒子
         * @param label 是否展示标签字段
         */
        getShowStyle(show, wrapper, label) {
            let that = this
            this.$nextTick(() => {
                if (show && wrapper) {
                    console.log(show, wrapper)
                    console.log(show.offsetHeight)
                    console.log(wrapper.offsetHeight)
                    if (wrapper.offsetHeight > 70) {
                        console.log(show.style)
                        show.style.height = '70px'
                        show.style.overflow = 'hidden'
                        console.log(label)
                        that[label] = true
                    } else {
                        that[label] = false
                    }
                }
            })
        },
        downLoadContent() {
            const paramsData = {
                startTime: this.sayTimes && this.sayTimes.length > 0 ? this.sayTimes[0] : '',
                endTime: this.sayTimes && this.sayTimes.length > 0 ? this.sayTimes[1] : '',
                content: this.get_params.content,
                type: this.get_params.type,
                mode: this.get_params.mode
            }
            intelligenceExportExcel({ paramsData, queryData: {}}).then(res => {
                console.log(res)
            })
        },
        downLoadTemplate() {
            intelligenceExportExcelTemplate({ paramsData: {}, queryData: {}}).then(res => {
                console.log(res)
            })
        },
        handleAddMore() {
            this.addOpen = !this.addOpen
            if (this.addOpen) {
                this.$refs['show-box-add'].style.height = 'auto'
                this.$refs['show-box-add'].style.overflow = 'auto'
            } else {
                this.$refs['show-box-add'].style.height = '70px'
                this.$refs['show-box-add'].style.overflow = 'hidden'
            }
        },
        handleEditMore() {
            this.editOpen = !this.editOpen
            if (this.editOpen) {
                this.$refs['show-box-edit'].style.height = 'auto'
                this.$refs['show-box-edit'].style.overflow = 'auto'
            } else {
                this.$refs['show-box-edit'].style.height = '70px'
                this.$refs['show-box-edit'].style.overflow = 'hidden'
            }
        },
        openAddDialog() {
            this.addDialog = true
            setTimeout(() => {
                this.getShowStyle(this.$refs['show-box-add'], this.$refs['wrapper-add'], 'addLabel')
            }, 0)
        },
        handleClickItem(item) {
            console.log(item)
            console.log(this.addForm.modeCode)
            if (this.addForm.modeCode.includes(item.code)) {
                this.addForm.modeCode.splice(this.addForm.modeCode.indexOf(item.code), 1)
                item.active = false
                this.attackWays.push() // 使数组发生变化
            } else {
                this.addForm.modeCode.push(item.code)
                item.active = true
                this.attackWays.push()
            }
        },
        handleClickEditItem(item) {
            console.log(item)
            console.log(this.editForm.modeCode)
            if (this.editForm.modeCode.includes(item.code)) {
                this.editForm.modeCode.splice(this.editForm.modeCode.indexOf(item.code), 1)
                item.active = false
                this.attackWays.push() // 使数组发生变化
            } else {
                this.editForm.modeCode.push(item.code)
                item.active = true
                this.attackWays.push()
            }
        },
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        searchAssets() {
            this.get_params.page = 1
            this.get_data()
        },
        init_attackWay() {
            get_attackWay({ queryData: {}, paramsData: {}}).then(res => {
                console.log(res)
                this.attackWays = res
                this.attackWays.forEach(item => {
                    item.active = false
                })
            }).catch(err => {
                console.log(err + 'err')
            })
        },
        get_data() {
            this.loading = true
            this.tableData = []
            let data = {
                startTime: this.sayTimes && this.sayTimes.length > 0 ? this.sayTimes[0] : '',
                endTime: this.sayTimes && this.sayTimes.length > 0 ? this.sayTimes[1] : '',
                content: this.get_params.content,
                type: this.get_params.type !== '' ? this.get_params.type * 1 : '',
                mode: this.get_params.mode,
                page: this.get_params.page,
                pageSize: this.get_params.size
            }
            // let page = this.get_params.page
            // let pageSize = this.get_params.size
            get_attackList({ paramsData: data, queryData: {}}).then(res => {
                console.log(res)
                this.loading = false
                this.total_num = res.total
                let list = res.records
                if (list.length > 0) {
                    list.forEach(item => {
                        let obj = {}
                        obj.sources = item.sources
                        obj.survival = item.survival
                        obj.sourcesCN = item.sourcesCN
                        obj.updateTime = item.updateTime
                        obj.typeCN = item.typeCN
                        obj.survivalCN = item.survivalCN
                        obj.type = item.type
                        obj.version = item.version
                        obj.port = item.port
                        obj.content = item.content
                        obj.createTime = item.createTime
                        obj.id = item.id
                        obj.attackModes = item.attackModes
                        obj.credit = item.credit
                        obj.threatLevel = item.threatLevel
                        /* 新增*/
                        obj.family = item.family
                        obj.attackOrg = item.attackOrg
                        obj.origin = item.origin
                        obj.originCode = item.originCode
                        obj.originCredit = item.originCredit
                        obj.dealAdvise = item.dealAdvise
                        obj.des = item.des
                        obj.beginTime = item.beginTime
                        obj.finishTime = item.finishTime

                        this.tableData.push(obj)
                    // console.log(this.tableData)
                    })
                }
            }).catch(error => {
                this.loading = false
                console.log('error' + error)
            })
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.addDialog = false
                    this.add_success()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        submitForm_e(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.editDialog = false
                    this.edit_success()
                } else {
                    console.log('error submit!!')
                    return false
                }
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
        handleSee(row) {
            let modeCodeCN = []
            row.attackModes.forEach(item => {
                modeCodeCN.push(item.modeCodeCN)
            })
            modeCodeCN = modeCodeCN.join('、')
            this.seeForm.content = row.content
            this.seeForm.typeCN = row.typeCN
            this.seeForm.survivalCN = row.survivalCN
            this.seeForm.sourcesCN = row.sourcesCN
            this.seeForm.credit = row.credit
            this.seeForm.threatLevel = row.threatLevel
            this.seeForm.modeCodeCN = modeCodeCN
            this.seeDialog = true
        },
        handleEdit(row) {
            let modeCode = []
            row.attackModes.forEach(item => {
                modeCode.push(item.modeCode)
            })
            this.editForm.id = row.id
            this.editForm.content = row.content
            this.editForm.type = row.type + ''
            this.editForm.threatLevel = row.threatLevel
            this.editForm.credit = row.credit
            this.editForm.sources = row.sources + ''
            this.editForm.survival = row.survival + ''
            this.editForm.modeCode = modeCode
            this.editForm.family = row.family
            this.editForm.attackOrg = row.attackOrg
            this.editForm.origin = row.origin
            this.editForm.originCode = row.originCode
            this.editForm.originCredit = row.originCredit
            this.editForm.dealAdvise = row.dealAdvise
            this.editForm.des = row.des
            this.editForm.beginTime = row.beginTime
            this.editForm.finishTime = row.finishTime
            this.editForm.modeCode.forEach(item => {
                this.attackWays.forEach(_it => {
                    if (item === _it.code) {
                        _it.active = true
                    }
                })
            })
            this.editDialog = true
            setTimeout(() => {
                this.getShowStyle(this.$refs['show-box-edit'], this.$refs['wrapper-edit'], 'editLabel')
            }, 0)
        },
        handleDelete(row) {
            this.delId = row.id
            this.deleteItemDialog = true
        },
        handleSizeChange(val) {
            this.get_params.size = val
            this.get_data()
        },
        handleCurrentChange(val) {
            this.get_params.page = val
            this.get_data()
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        add_success() {
            let attackModes = []
            this.addForm.modeCode.forEach(item => {
                attackModes.push({
                    modeCode: item
                })
            })
            let data = {
                content: this.addForm.content,
                type: this.addForm.type * 1,
                threatLevel: this.addForm.threatLevel,
                credit: this.addForm.credit,
                sources: this.addForm.sources * 1,
                survival: this.addForm.survival * 1,
                attackModes: attackModes,
                family: this.addForm.family,
                attackOrg: this.addForm.attackOrg,
                origin: this.addForm.origin,
                originCredit: this.addForm.originCredit,
                originCode: this.addForm.originCode,
                dealAdvise: this.addForm.dealAdvise,
                des: this.addForm.des,
                beginTime: this.addForm.beginTime,
                finishTime: this.addForm.finishTime
            }
            save_attack({ paramsData: data, queryData: {}}).then(res => {
                this.$message({
                    message: '添加成功',
                    type: 'success'
                })
                this.addDialog = false
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(err => {
                // this.addDialog = false
                console.log(err + 'err')
            })
        },
        edit_success() {
            let attackModes = []
            this.editForm.modeCode.forEach(item => {
                attackModes.push({
                    modeCode: item
                })
            })
            let data = {
                id: this.editForm.id,
                content: this.editForm.content,
                type: this.editForm.type * 1,
                threatLevel: this.editForm.threatLevel,
                credit: this.editForm.credit,
                sources: this.editForm.sources * 1,
                survival: this.editForm.survival * 1,
                attackModes: attackModes,
                family: this.editForm.family,
                attackOrg: this.editForm.attackOrg,
                origin: this.editForm.origin,
                originCredit: this.editForm.originCredit,
                originCode: this.editForm.originCode,
                dealAdvise: this.editForm.dealAdvise,
                des: this.editForm.des,
                beginTime: this.editForm.beginTime,
                finishTime: this.editForm.finishTime
            }
            update_attack({ paramsData: data, queryData: {}}).then(res => {
                this.$message({
                    message: '编辑成功',
                    type: 'success'
                })
                this.editDialog = false
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(err => {
                // this.editDialog = false
                console.log(err + 'err')
            })
        },
        handleDeleteItemFun() {
            let obj = {
                ids: [this.delId]
            }
            del_attack({ paramsData: obj, queryData: {}}).then(res => {
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                this.deleteItemDialog = false
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(err => {
                this.deleteItemDialog = false
                console.log(err + 'err')
            })
        },
        handleDeleteAllFun() {
            let data = {
                ids: []
            }
            this.multipleSelection.map(item => {
                data.ids.push(item.id)
            })
            del_attack({ paramsData: data, queryData: {}}).then(res => {
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                this.deleteAllDialog = false
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(err => {
                this.deleteAllDialog = false
                console.log(err + 'err')
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.intelligence_lib ::v-deep .el-input--small .el-input__inner {
    height: 30px;
    line-height: 30px;
}
.row {
    display:flex;
    justify-content: space-between;
}
.pagination {
    padding: 30px 0 20px;
    text-align: right;
}

.el-input.ips {
    display: block;
    width: 100%;
}
.edit-row {
    cursor: pointer;
    margin-right: 6px;
    color: #0052d9;
}
.delete-row {
    cursor: pointer;
    color: #0052d9;
}
.intelligence_lib_list {
    background-color: #fff;
    padding: 10px;
    border-radius: 4px;
    border: solid 1px #dadee8;
    box-shadow: 0px 0px 8px 0px rgba(140, 152, 164, 0.2);
    margin-top: 10px;
    .btn-wrap {
        display: flex;
        .el-button {
            // width: 80px;
            // height: 32px;
            // display: flex;
            // align-items: center;
            // justify-content: center;
            // border-radius: 4px;
            // color: #fff;
            // font-size: 12px;
            // ::v-deep span {
            //     margin-left: 5px;
            // }
        }
        .el-button--primary {
            // background-color: #387dee;
        }
        .el-button--danger {
            background-color: #e34d59;
        }
    }
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
    color: #dcdcdc;

    .el-button {
        position: absolute;
        right: 20px;
        top: 0;
        padding: 0;
        color: #dcdcdc;
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
.intelligence_lib  ::v-deep  .el-input-number__decrease {
    border-left: 1px solid #dcdcdc;
    color: #dcdcdc;
}
.intelligence_lib  ::v-deep  .el-input-number__increase {
    border-left: 1px solid #dcdcdc;
    border-bottom: 1px solid #dcdcdc;
    color: #dcdcdc;
}
.intelligence_lib  ::v-deep  .el-range-input {
    background-color: rgba(0, 0, 0, 0);
    // color: #fff;
}

.intelligence_lib  ::v-deep  .el-range-separator {
    // color: #fff;
}

.intelligence_lib  ::v-deep  .el-checkbox__label {
    color: rgba(255, 255, 255, .7);
}

.intelligence_lib  ::v-deep  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #dcdcdc;
}

.seeDialog  ::v-deep  .el-form-item__label {
    color: rgba(255, 255, 255, .5) !important;
}

.intelligence_lib  ::v-deep  .el-input-number__decrease, .intelligence_lib  ::v-deep  .el-input-number__increase {
    background-color: transparent;
}
.attack-box {

    .show-box {
        height: 70px;
        overflow: hidden;
        width: 100%;

        .attack-item {
            color: #8e979f;
            float: left;
            cursor: pointer;
            position: relative;
            box-sizing: border-box;
            height: 30px;
            line-height: 30px;
            margin-right: 10px;
            margin-bottom: 10px;
            padding: 0px 30px 0 10px;
            font-size: 12px;
            border: 1px solid #dcdcdc;
            border-radius: 2px;

            .checkd-img {
                position: absolute;
                width: 0;
                height: 0;
                border-width: 10px;
                border-style: solid;
                border-color: #387dee #387dee transparent transparent;
                top: 0;
                right: 0;

                i {
                    color: #fff;
                    position: absolute;
                    top: -10px;
                    right: -10px;
                    font-size: 12px;
                }
            }
        }

        .attack-item.active {
            background-color: #0052d9;
            color: #fff;
        }

        .attack-item:hover {
            background-color: #0052d9;
            color: #fff;
        }
    }

    .more-btn {
        height: 20px;
        font-size: 12px;
        color: #dcdcdc;
        cursor: pointer;
        p {
            margin-right: 4px;
        }

        i {
            font-size: 12px;
            display: inline-block;
            transform: rotate(-90deg);
        }
    }

    .more-btn.open {
        i {
            transform: rotate(90deg);
        }
    }
}
</style>
<style>
#ue1 {
    border: 1px solid #dcdcdc !important;
}

.edui-default .edui-editor {
    border: 1px solid #dcdcdc !important;
    background-color: rgba(0, 0, 0, 0) !important;
}

.edui-default .edui-editor-toolbarboxouter {
    border-bottom: 1px solid #dcdcdc !important;
    background-color: rgba(0, 0, 0, 0) !important;
}

#edui_fixedlayer {
    z-index: 999999 !important;
}
</style>
