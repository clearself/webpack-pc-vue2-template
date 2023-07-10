<template>
    <div class="list">
        <SearchTop @search="searchCheck" @reset="reset">
            <el-col :md="12" :lg="8" :xl="6">
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
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params">
                    <el-form-item label="漏洞类型：" label-width="80px">
                        <el-input
                            placeholder="请输入"
                            clearable
                            v-model="get_params.vulnType"
                            @keyup.enter.native="searchCheck"
                            size="small"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params">
                    <el-form-item label="漏洞级别：" label-width="80px" >
                        <el-select
                            v-model="get_params.riskLevel"
                            filterable
                            placeholder="请选择"
                            style="width: 100%"
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
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params">
                    <el-form-item label="时间：" label-width="60px">
                        <el-date-picker
                            style="width:270px;"
                            :clearable="false"
                            size="small"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            :default-time="['00:00:00', '23:59:59']"
                            v-model="sayTimes"
                            type="datetimerange"
                            range-separator="~"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期" >
                        </el-date-picker>
                    </el-form-item>
                </el-form>
            </el-col>
        </SearchTop>
        <div class="list-container">
            <div class="ub ub-pj w100 mb-1 ub-ac">
                <div class="list-tips">漏洞信息库</div>
                <div>
                    <el-button icon="el-icon-plus" size="small" type="primary" @click="addDialog = true" v-per="['leaks_leakInfo_add']">添加</el-button>
                    <el-button style="margin-left: 10px;" icon="el-icon-delete" size="small" type="danger" @click="handleDeleteAll" v-per="['leaks_leakInfo_del']">删除</el-button>
                </div>
            </div>
            <el-table
                ref="multipleTable"
                v-loading="loading"
                class='bigTable full-table'
                :data="tableData"
                border
                stripe
                :height="tabHeight"
                :row-class-name="tableRowClassName"
                :row-style="{ height: '32px' }"
                :header-row-style="{ height: '32px' }"
                tooltip-effect="dark"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="30" align="center"></el-table-column>
                <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                </el-table-column>
                <el-table-column prop="vulnId" label="漏洞id" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="nodeName" label="漏洞名称" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="vulnType" label="漏洞类型" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="riskLevelCN" label="漏洞级别" >
                    <template slot-scope="scope">
                        <div>
                            <span style="color:#00a2ff;" v-if="scope.row.riskLevel==1">
                                {{scope.row.riskLevelCN}}
                            </span>
                            <span style="color:#f2cd00;" v-if="scope.row.riskLevel==2">
                                {{scope.row.riskLevelCN}}
                            </span>
                            <span style="color:#f86900;" v-if="scope.row.riskLevel==3">
                                {{scope.row.riskLevelCN}}
                            </span>
                            <span style="color:#19b0b1;" v-if="scope.row.riskLevel==4">
                                {{scope.row.riskLevelCN}}
                            </span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="cvssScore" label="CVSS分值">
                </el-table-column>
                <el-table-column prop="cveTag" label="CVE编号" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="cnnvdTag" label="CNNVD编号" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="cnvdTag" label="CNVD编号" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="platforms" label="影响平台" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="updateTime" label="更新时间" width="160">
                </el-table-column>
                <el-table-column label="操作" align="center" width="140">
                    <template slot-scope="scope">
                        <el-button @click="handleSee(scope.row)" size="small" type="text" v-per="['leaks_leakInfo_look']">查看</el-button>
                        <el-button @click="handleEdit(scope.row)" size="small" type="text" v-per="['leaks_leakInfo_edit']">编辑</el-button>
                        <el-button @click="handleDelete(scope.row)" size="small" type="text" v-per="['leaks_leakInfo_del']">删除</el-button>
                    </template>
                </el-table-column>

            </el-table>
            <pagination :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size" @pagination="get_data" style="padding-top:10px"/>
        </div>
        <el-dialog v-dialogDrag title="添加" :visible.sync="addDialog" width="700px" custom-class="common-dialog">
            <el-form :model="addForm" :rules="rules" ref="addForm" label-position="top">
                <div class="row">
                    <el-form-item label="漏洞id：" :label-width="formLabelWidth">
                        <el-input placeholder="请输入" clearable v-model="addForm.vulnId" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="漏洞名称：" :label-width="formLabelWidth" prop="nodeName">
                        <el-input placeholder="请输入" clearable v-model="addForm.nodeName" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="漏洞级别：" :label-width="formLabelWidth">
                        <el-select v-model="addForm.riskLevel" filterable placeholder="请选择" size="small" clearable>
                            <el-option label="低" value="1"></el-option>
                            <el-option label="中" value="2"></el-option>
                            <el-option label="高" value="3"></el-option>
                            <el-option label="信息类" value="4"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="row">
                    <el-form-item label="CVE编号：" :label-width="formLabelWidth">
                        <el-input placeholder="请输入" clearable v-model="addForm.cveTag" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="BUGTRAP：" :label-width="formLabelWidth">
                        <el-input placeholder="请输入" clearable v-model="addForm.bugTraqTag" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="CNNVD编号：" :label-width="formLabelWidth">
                        <el-input placeholder="请输入" clearable v-model="addForm.cnnvdTag" size="small"></el-input>
                    </el-form-item>
                </div>
                <div class="row">
                    <el-form-item label="CNVD编号：" :label-width="formLabelWidth">
                        <el-input placeholder="请输入" clearable v-model="addForm.cnvdTag" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="CNCVE编号：" :label-width="formLabelWidth">
                        <el-input placeholder="请输入" clearable v-model="addForm.cncveTag" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="漏洞类型：" :label-width="formLabelWidth">
                        <el-input placeholder="请输入" clearable v-model="addForm.vulnType" size="small"></el-input>
                    </el-form-item>
                </div>
                <div class="row">
                    <el-form-item label="CVSS分值：" :label-width="formLabelWidth">
                        <el-input placeholder="请输入" type="number" clearable onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" v-model.trim="addForm.cvssScore" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="更新时间：" :label-width="formLabelWidth">
                        <el-date-picker style="width:178px;" size="small" v-model="addForm.updateTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="影响平台：" :label-width="formLabelWidth">
                        <el-input placeholder="请输入" clearable v-model="addForm.platforms" size="small"></el-input>
                    </el-form-item>
                </div>

                <el-form-item label="修复建议：" :label-width="formLabelWidth">
                    <el-input type="textarea" placeholder="请输入" clearable v-model="addForm.repairAdvice" size="small"></el-input>
                </el-form-item>
                <el-form-item  label="简短描述：" :label-width="formLabelWidth">
                    <el-input  type="textarea" placeholder="请输入" clearable v-model="addForm.shortDesc" size="small"></el-input>
                </el-form-item>
                <el-form-item label="详细描述：" :label-width="formLabelWidth">
                    <el-input  type="textarea" placeholder="请输入" clearable v-model="addForm.fullDesc" size="small"></el-input>
                </el-form-item>
                <el-form-item style="width:100%;" label="上传附件：" :label-width="formLabelWidth">
                    <el-upload
                        accept=".jpg,.jpeg,.png,.zip,.gif,.bmp,.pdf,.doc,.docx,.rar,.ppt,.JPG,.JPEG,.PBG,.ZIP,.GIF,.BMP,.PDF"
                        :limit="1"
                        ref="upload"
                        :headers="header"
                        action="/api/base-server/file/upload"
                        :data="path"
                        :before-upload="beforeUpload"
                        name="fileUpload"
                        :on-success="uploadFileSuccess"
                        :on-error="uploadFileError"
                        :on-exceed="limitFun"
                        :file-list="addFileList">
                        <el-button size="small" type="primary">选择文件</el-button>
                        <span slot="tip" class="el-upload__tip" style="padding-left:10px;">
                            <i style="color:#606266;font-size:12px;" class="el-icon-info"></i>
                            <span>仅支持ZIP、RAR、DOC、XLSX、PPT、JPG、PDF等格式文件</span>
                        </span>
                    </el-upload>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="addDialog = false">取消</el-button>
                <el-button size="small" type="primary" @click="submitForm('addForm')">确定</el-button>
            </span>
        </el-dialog>
        <!--编辑对象-->
        <el-dialog v-dialogDrag title="编辑" :visible.sync="editDialog" width="700px" custom-class="common-dialog">
            <el-form :model="editForm" :rules="rules" ref="editForm" label-position="top">
                <div class="row">
                    <el-form-item label="漏洞id：" :label-width="formLabelWidth">
                        <el-input placeholder="请输入" clearable v-model="editForm.vulnId" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="漏洞名称：" :label-width="formLabelWidth" prop="nodeName">
                        <el-input placeholder="请输入" clearable v-model="editForm.nodeName" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="漏洞级别：" :label-width="formLabelWidth">
                        <el-select v-model="editForm.riskLevel" filterable placeholder="请选择" style="width: 100%" size="small" clearable>
                            <el-option label="低" value="1"></el-option>
                            <el-option label="中" value="2"></el-option>
                            <el-option label="高" value="3"></el-option>
                            <el-option label="信息类" value="4"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="row">
                    <el-form-item label="CVE编号：" :label-width="formLabelWidth">
                        <el-input placeholder="请输入" clearable v-model="editForm.cveTag" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="BUGTRAP：" :label-width="formLabelWidth">
                        <el-input placeholder="请输入" clearable v-model="editForm.bugTraqTag" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="CNNVD编号：" :label-width="formLabelWidth">
                        <el-input placeholder="请输入" clearable v-model="editForm.cnnvdTag" size="small"></el-input>
                    </el-form-item>
                </div>
                <div class="row">
                    <el-form-item label="CNVD编号：" :label-width="formLabelWidth">
                        <el-input placeholder="请输入" clearable v-model="editForm.cnvdTag" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="CNCVE编号：" :label-width="formLabelWidth">
                        <el-input placeholder="请输入" clearable v-model="editForm.cncveTag" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="漏洞类型：" :label-width="formLabelWidth">
                        <el-input placeholder="请输入" clearable v-model="editForm.vulnType" size="small"></el-input>
                    </el-form-item>
                </div>
                <div class="row">
                    <el-form-item label="CVSS分值：" :label-width="formLabelWidth">
                        <el-input placeholder="请输入" type="number" clearable onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" v-model.trim="editForm.cvssScore" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="更新时间：" :label-width="formLabelWidth">
                        <el-date-picker style="width:178px;" size="small" v-model="editForm.updateTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="影响平台：" :label-width="formLabelWidth">
                        <el-input placeholder="请输入" clearable v-model="editForm.platforms" size="small"></el-input>
                    </el-form-item>
                </div>
                <el-form-item  label="修复建议：" :label-width="formLabelWidth">
                    <el-input type="textarea" placeholder="请输入" clearable v-model="editForm.repairAdvice" size="small"></el-input>
                </el-form-item>
                <el-form-item  label="简短描述：" :label-width="formLabelWidth">
                    <el-input  type="textarea" placeholder="请输入" clearable v-model="editForm.shortDesc" size="small"></el-input>
                </el-form-item>
                <el-form-item  label="详细描述：" :label-width="formLabelWidth">
                    <el-input  type="textarea" placeholder="请输入" clearable v-model="editForm.fullDesc" size="small"></el-input>
                </el-form-item>
                <el-form-item style="width:100%;" label="上传附件：" :label-width="formLabelWidth">
                    <el-upload
                        accept=".jpg,.jpeg,.png,.zip,.gif,.bmp,.pdf,.doc,.docx,.rar,.ppt,.JPG,.JPEG,.PBG,.ZIP,.GIF,.BMP,.PDF"
                        :limit="1"
                        ref="upload"
                        :headers="header"
                        action="/api/base-server/file/upload"
                        :data="path"
                        :before-upload="beforeUpload"
                        name="fileUpload"
                        :on-success="uploadFileSuccess"
                        :on-error="uploadFileError"
                        :on-exceed="limitFun"
                        :file-list="fileList">
                        <el-button size="small" type="primary">选择文件</el-button>
                        <span slot="tip" class="el-upload__tip" style="padding-left:10px;">
                            <i style="color:#606266;font-size:12px;" class="el-icon-info"></i>
                            <span>仅支持ZIP、RAR、DOC、XLSX、PPT、JPG、PDF等格式文件</span>
                        </span>
                    </el-upload>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="editDialog = false">取消</el-button>
                <el-button size="small" type="primary" @click="submitFormEdit('editForm')">确定</el-button>
            </span>
        </el-dialog>

        <!--详情-->
        <el-dialog v-dialogDrag title="详情" :visible.sync="detailDialog" width="700px" custom-class="common-dialog">
            <div class="ub w100 ub-ver baseInfo-list">
                <div class="ub w100 baseInfo-list-item">
                    <div>漏洞名称 </div>
                    <div class="ub ub-f1">{{detailForm.nodeName}}</div>
                </div>
                <div class="ub w100 baseInfo-list-item">
                    <div>漏洞类型</div>
                    <div class="ub ub-f1">{{detailForm.vulnType}}</div>
                </div>
                <div class="ub w100 baseInfo-list-item">
                    <div>修复建议</div>
                    <div class="ub ub-f1">
                        {{detailForm.repairAdvice}}
                    </div>
                </div>
                <div class="ub w100 baseInfo-list-item">
                    <div>简短描述</div>
                    <div class="ub ub-f1">
                        {{detailForm.shortDesc}}
                    </div>
                </div>
                <div class="ub w100 baseInfo-list-item">
                    <div>详细描述</div>
                    <div class="ub ub-f1">
                        {{detailForm.fullDesc}}
                    </div>
                </div>
                <div class="ub w100 baseInfo-list-item">
                    <div>漏洞CVSS分值</div>
                    <div class="ub ub-f1">{{detailForm.cvssScore}}</div>
                </div>
                <div class="ub w100 baseInfo-list-item">
                    <div>CVE编号</div>
                    <div class="ub ub-f1">{{detailForm.cveTag}}</div>
                </div>
                <div class="ub w100 baseInfo-list-item">
                    <div>CNNVD编号</div>
                    <div class="ub ub-f1">{{detailForm.cnnvdTag}}</div>
                </div>
                <div class="ub w100 baseInfo-list-item">
                    <div>CNVD编号</div>
                    <div class="ub ub-f1">{{detailForm.cnvdTag}}</div>
                </div>
                <div class="ub w100 baseInfo-list-item">
                    <div>CNCVE编号</div>
                    <div class="ub ub-f1">{{detailForm.cncveTag}}</div>
                </div>
                <div class="ub w100 baseInfo-list-item">
                    <div>BUGTRAP</div>
                    <div class="ub ub-f1">{{detailForm.bugTraqTag}}</div>
                </div>

                <div class="ub w100 baseInfo-list-item">
                    <div>更新时间</div>
                    <div class="ub ub-f1">{{detailForm.updateTime}}</div>
                </div>
                <div class="ub w100 baseInfo-list-item">
                    <div>影响平台</div>
                    <div class="ub ub-f1">{{detailForm.platforms}}</div>
                </div>
                <div class="ub w100 baseInfo-list-item">
                    <div>创建时间</div>
                    <div class="ub ub-f1">{{detailForm.createTime}}</div>
                </div>
                <div class="ub w100 baseInfo-list-item">
                    <div>附件</div>
                    <div class="ub ub-f1"><a :href="detailForm.filePath" style="color:#fff;text-decoration: underline;">{{detailForm.filePath|getfilePath}}</a></div>
                </div>
            </div>

        </el-dialog>

        <!--删除资源-->
        <DeleteDialog
            :dialogVisible = deleteDialog
            @delete="handleDeleteFun"
            @cancel="deleteDialog = false">
        </DeleteDialog>
    </div>
</template>

<script>
import {
    getLoopholeList,
    deleteLoophole,
    saveLoophole,
    updateLoophole
} from '../../server/leak/api.js'

export default {
    name: 'Loophole',
    data() {
        return {
            tabHeight: document.body.clientHeight - 254,
            addFileList: [],
            fileList: [],
            path: {
                path: '/file_leak/files/'
            },
            detailDialog: false,
            detailForm: {},
            addDialog: false,
            addForm: {
                vulnId: '',
                nodeName: '',
                shortDesc: '',
                filePath: '',
                fullDesc: '',
                repairAdvice: '',
                riskLevel: '',
                platforms: '',
                cncveTag: '',
                cveTag: '',
                cnnvdTag: '',
                cnvdTag: '',
                cvssScore: '',
                bugTraqTag: '',
                updateTime: '',
                vulnType: ''
            },
            editForm: {
                id: '',
                vulnId: '',
                nodeName: '',
                shortDesc: '',
                filePath: '',
                fullDesc: '',
                repairAdvice: '',
                riskLevel: '',
                platforms: '',
                cncveTag: '',
                cveTag: '',
                cnnvdTag: '',
                cnvdTag: '',
                cvssScore: '',
                bugTraqTag: '',
                updateTime: '',
                vulnType: ''
            },
            rules: {
                vulnId: [{
                    required: true,
                    message: '请输入',
                    trigger: 'blur'
                }],
                nodeName: [{
                    required: true,
                    message: '请输入',
                    trigger: 'blur'
                }]

            },
            sayTimes: null,
            deleteDialog: false,
            deleteId: '',
            editDialog: false,
            formLabelWidth: '92px',
            loading: false,
            uploading: null,
            total_num: 0,
            multipleSelection: [],
            tableData: [],
            types: [],
            factorys: [],
            get_params: {
                page: 1,
                size: 20,
                nodeName: '',
                vulnType: '',
                riskLevel: ''
            }

        }
    },
    computed: {
        header() {
            return { token: this.$getlocalStorage('initInfo').user.token }
        }
    },
    filters: {
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
        }
    },
    watch: {
        addDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.addForm.resetFields()
                    this.addFileList = []
                    for (let attr in this.addForm) {
                        this.addForm[attr] = ''
                    }
                }
            }
        },
        editDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.editForm.resetFields()
                    for (let attr in this.editForm) {
                        this.editForm[attr] = ''
                    }
                }
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.get_data()
        })
    },
    methods: {
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
                nodeName: '',
                vulnType: '',
                riskLevel: ''
            }
            this.sayTimes = null
            this.get_data()
        },
        limitFun(files, fileList) {
            this.$message({
                message: '附件只能上传一份！',
                type: 'warning'
            })
        },
        beforeUpload() {
            this.uploading = this.$loading({
                lock: true,
                text: '上传中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })
        },
        uploadFileSuccess(response, file, fileList) {
            this.uploading.close()
            if (response.code == 1) {
                this.$message({
                    message: '附件上传成功!',
                    type: 'success'
                })
                var path = response.data.filePath
                if (this.addDialog) {
                    this.addForm.filePath = response.data
                } else {
                    this.editForm.filePath = response.data
                }
            } else {
                this.$message({
                    message: response.message,
                    type: 'warning'
                })
            }
        },
        uploadFileError(obj) {
            this.uploading.close()
            this.$message({
                message: '上传失败！请重新上传。',
                type: 'warning'
            })
            console.log('error', obj)
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
                    startTime: this.sayTimes === null ? '' : this.sayTimes[0],
                    endTime: this.sayTimes === null ? '' : this.sayTimes[1]
                }
            }
            getLoopholeList(data).then(res => {
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
                        obj.filePath = item.filePath
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
                        this.tableData.push(obj)
                    })
                }
            }).catch(error => {
                this.loading = false
                console.log('error' + error)
            })
        },

        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        searchCheck() {
            this.get_params.page = 1
            this.get_data()
        },

        handleEdit(row) {
            console.log(row)
            this.fileList = []
            this.editForm.id = row.id
            this.editForm.vulnId = row.vulnId
            this.editForm.filePath = row.filePath
            this.editForm.nodeName = row.nodeName
            this.editForm.shortDesc = row.shortDesc
            this.editForm.fullDesc = row.fullDesc
            this.editForm.repairAdvice = row.repairAdvice
            this.editForm.riskLevel = row.riskLevel
            this.editForm.platforms = row.platforms
            this.editForm.cncveTag = row.cncveTag
            this.editForm.cveTag = row.cveTag
            this.editForm.cnnvdTag = row.cnnvdTag
            this.editForm.cnvdTag = row.cnvdTag
            this.editForm.cvssScore = row.cvssScore
            this.editForm.bugTraqTag = row.bugTraqTag
            this.editForm.updateTime = row.updateTime
            this.editForm.vulnType = row.vulnType
            if (row.filePath) {
                let arr = row.filePath.split('/')
                this.fileList.push({
                    name: arr[arr.length - 1].split('.')[0],
                    url: arr[arr.length - 1]
                })
            }

            this.editDialog = true
        },
        handleSee(row) {
            console.log(row)
            this.$set(this, 'detailForm', row)
            this.detailDialog = true
        },
        handleDeleteAll() {
            if (this.multipleSelection.length == 0) {
                this.$message({
                    message: '请先选择行',
                    type: 'warning'
                })
                return
            } else {
                let ids = []
                this.multipleSelection.forEach(item => {
                    ids.push(item.id)
                })
                this.deleteId = ids
            }
            this.deleteDialog = true
        },
        handleDelete(row) {
            this.deleteId = [`${row.id}`]
            this.deleteDialog = true
        },
        handleDeleteFun() {
            let data = {
                queryData: {},
                paramsData: {
                    ids: this.deleteId
                }
            }
            deleteLoophole(data).then(res => {
                this.deleteDialog = false
                console.log('删除成功')
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

        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = {
                        queryData: {},
                        paramsData: {
                            vulnId: this.addForm.vulnId,
                            nodeName: this.addForm.nodeName,
                            shortDesc: this.addForm.shortDesc,
                            fullDesc: this.addForm.fullDesc,
                            repairAdvice: this.addForm.repairAdvice,
                            riskLevel: this.addForm.riskLevel,
                            platforms: this.addForm.platforms,
                            cncveTag: this.addForm.cncveTag,
                            cveTag: this.addForm.cveTag,
                            cnnvdTag: this.addForm.cnnvdTag,
                            cnvdTag: this.addForm.cnvdTag,
                            filePath: this.addForm.filePath,
                            cvssScore: this.addForm.cvssScore,
                            bugTraqTag: this.addForm.bugTraqTag,
                            updateTime: this.addForm.updateTime,
                            vulnType: this.addForm.vulnType
                        }
                    }
                    saveLoophole(data).then(res => {
                        this.addDialog = false
                        console.log('添加成功')
                        this.$message({
                            message: '添加成功',
                            type: 'success'
                        })
                        setTimeout(() => {
                            this.get_data()
                        }, 1500)
                    }).catch(error => {
                        // this.addDialog = false
                        console.log(error + 'error')
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        submitFormEdit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = {
                        queryData: {},
                        paramsData: {
                            id: this.editForm.id,
                            vulnId: this.editForm.vulnId,
                            nodeName: this.editForm.nodeName,
                            shortDesc: this.editForm.shortDesc,
                            fullDesc: this.editForm.fullDesc,
                            repairAdvice: this.editForm.repairAdvice,
                            riskLevel: this.editForm.riskLevel,
                            platforms: this.editForm.platforms,
                            cncveTag: this.editForm.cncveTag,
                            cveTag: this.editForm.cveTag,
                            cnnvdTag: this.editForm.cnnvdTag,
                            cnvdTag: this.editForm.cnvdTag,
                            filePath: this.editForm.filePath,
                            cvssScore: this.editForm.cvssScore,
                            bugTraqTag: this.editForm.bugTraqTag,
                            updateTime: this.editForm.updateTime,
                            vulnType: this.editForm.vulnType
                        }
                    }
                    updateLoophole(data).then(res => {
                        this.editDialog = false
                        console.log('编辑成功')
                        this.$message({
                            message: '编辑成功',
                            type: 'success'
                        })
                        setTimeout(() => {
                            this.get_data()
                        }, 1500)
                    }).catch(error => {
                        // this.editDialog = false
                        console.log(error + 'error')
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
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
        handleSelectionChange(val) {
            console.log(val)
            this.multipleSelection = val
        }
    }
}
</script>

<style lang="scss" scoped>
.el-form-item__content{
    ::v-deep .el-icon-time{
        line-height:38px;
    }
}
.el-date-editor{
    ::v-deep input{
        font-size:12px;
    }
}
.event ::v-deep .el-input--small .el-input__inner {
    height: 30px;
    line-height: 30px;
}
.upload-demo ::v-deep .el-button--primary {
    width: 110px;
    height: 30px;
    font-size: 12px!important;
    box-sizing: border-box;
    background-color: rgba(0, 0, 0, 0);
    border-color: rgba(0, 0, 0, 0);
    background-image: url(../../assets/img/XZWJ.png);
    background-position: 0 0;
    background-repeat: no-repeat;
    background-size: 100% 100%;
}
.row {
    display:flex;
    justify-content: space-between;
}
.upload-demo ::v-deep .el-button--primary {
    width: 110px;
    height: 34px;
    font-size: 14px!important;
    box-sizing: border-box;
    border-color: rgba(0, 0, 0, 0);
}
.upload-demo ::v-deep a,
.upload-demo ::v-deep i {
    color: #1cd7fa;
}

.upload-demo ::v-deep .el-upload-list__item:hover {
    background-color: rgba(0, 0, 0, 0);
}
.baseInfo-list {
    border-radius: 4px;
    border-bottom: solid 1px #dddddd;
}

.baseInfo-list-item{
    min-height: 34px;
    margin-top: -2px;
}
.baseInfo-list-item:nth-child(1){
    margin-top:0;
}
.baseInfo-list-item>div:nth-child(1){
    width: 100px;
    min-height: 32px;
    line-height:32px;
    text-indent: 10px;
    font-size:12px;
    color:rgba(0,0,0,0.9);
    box-sizing: border-box;
    background-color: #ebf1f5;
    border: 1px solid #ddd;
}
.baseInfo-list-item>div:nth-child(2){
    min-height: 32px;
    line-height:32px;
    text-indent: 10px;
    font-size:12px;
    color:rgba(0,0,0,0.9);
    padding:0 10px;
    box-sizing: border-box;
    border-top:1px solid #ddd;
    border-right:1px solid #ddd;
}

</style>
<style>
.detail .el-form-item__label{
    color:#999 !important;
}
</style>

