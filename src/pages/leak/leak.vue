<template>
    <div class="event record-list">
        <div class="w100">
            <div class="ub w100 search-area" style="box-sizing: border-box;">
                <SearchTop @search="searchCheck" :has-more="true" @reset="reset" @isOpen="openFn">
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
                            <el-form-item label="漏洞级别："  label-width="80px">
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
                            <el-form-item label="标签："  label-width="80px">
                                <el-select
                                    v-model="get_params.labelId"
                                    filterable
                                    placeholder="请选择"
                                    style="width: 100%"
                                    size="small"
                                    clearable>
                                    <el-option v-for="(item,index) in labels" :key="index" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="时间：" label-width="80px">
                                <el-date-picker
                                    style="width:100%;"
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
                    <!-- <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="业务系统："  label-width="80px">
                                <el-select
                                    v-model="get_params.objId"
                                    filterable
                                    placeholder="请选择"
                                    style="width: 100%"
                                    size="small"
                                    clearable>
                                    <el-option v-for="(item,index) in systems" :key="index" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </el-col> -->
                </SearchTop>
            </div>
            <div class="list-container">
                <div class="ub ub-pj ub-ac w100 mb-1">
                    <div class="list-tips">列表内容</div>
                    <div>
                        <el-button v-per="['leaks_loophole_add']" size="small" type="primary" @click="addDialog = true" icon="el-icon-plus">添加漏洞</el-button>
                        <el-button v-per="['leaks_loophole_label']" size="small" type="primary" @click="labelSetShow" icon="el-icon-plus">标签配置</el-button>
                        <el-button v-per="['leaks_loophole_xsl']" size="small" type="primary" @click="downLoadTemplate" icon="el-icon-download">下载模板</el-button>
                        <el-upload
                            action="/api/leaks/manage/scanLeak/importExcel"
                            name="fileUpload"
                            :headers="header"
                            accept=".xlsx,.xlsx"
                            :file-list="fileList"
                            :show-file-list="false"
                            :on-success="handleSuccess"
                            style="display: inline-block;">
                            <el-button v-per="['leaks_loophole_import']" style="margin-left: 10px;" size="small" type="primary" icon="iconfont icon-daoru">导入</el-button>
                        </el-upload>
                        <el-button v-per="['leaks_loophole_del']" style="margin-left: 10px;" @click="handleDeleteAll" size="small" type="danger" icon="el-icon-delete">刪 除</el-button>
                    </div>
                </div>

                <el-table
                    :height="tableHeight"
                    :row-class-name="tableRowClassName"
                    ref="multipleTable"
                    v-loading="loading"
                    class='bigTable full-table'
                    :data="tableData"
                    border
                    stripe
                    tooltip-effect="dark"
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="50"></el-table-column>
                    <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                    </el-table-column>
                    <el-table-column prop="nodeName" label="漏洞名称" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column label="资产名称">
                        <template slot-scope="scope">
                            <span>
                                {{scope.row.deviceName}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="业务系统">
                        <template slot-scope="scope">
                            <span>
                                {{scope.row.systemName}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="riskLeve" label="漏洞级别" >
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
                    <el-table-column prop="leakTypeCN" label="漏洞类型" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建时间" width="160">
                    </el-table-column>
                    <el-table-column align="left" label="标签">
                        <template slot-scope="scope">
                            <div class="mb0 roles" v-if="scope.row.labels.length > 0">
                                <el-tag size="mini" type="success" v-for="(names,index) in scope.row.labels" :key="index">{{ names.name }}</el-tag>
                            </div>
                            <div v-else>--</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="240">
                        <template slot-scope="scope">
                            <el-button v-per="['leaks_loophole_look']" type="text" @click="handleSee(scope.row)" size="small">查看</el-button>
                            <el-button v-per="['leaks_loophole_order']" :disabled="scope.row.isStart ==1" type="text" @click="changeOption(1,scope.row)" size="small">发起工单</el-button>
                            <el-button v-per="['leaks_loophole_label']" :disabled="scope.row.addType!=0" type="text" @click="changeOption(3,scope.row)" size="small">标签配置</el-button>
                            <el-button v-per="['leaks_loophole_edit']" :disabled="scope.row.addType!=0" type="text" @click="changeOption(2,scope.row)" size="small">编辑</el-button>
                            <el-button v-per="['leaks_loophole_del']" :disabled="canStart(scope.row)" type="text" @click="changeOption(4,scope.row)" size="small">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <pagination v-show="total_num>0" :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size" @pagination="get_data" />
            </div>
        </div>
        <el-dialog v-dialogDrag title="添加" :visible.sync="addDialog" width="700px" custom-class="common-dialog">
            <el-form label-position="top" :model="addForm" ref="addForm" :inline="true">
                <div class="ub ub-pj">
                    <el-form-item
                        label="漏洞名称："
                        :label-width="formLabelWidth"
                        prop="nodeName"
                        style="width: 100%;"
                        :rules="{
                            required: true, message: '请输入', trigger: 'blur'
                        }">
                        <el-input placeholder="请输入" style="width: 100%;" clearable v-model="addForm.nodeName" size="small"></el-input>
                    </el-form-item>
                </div>
                <div class="ub ub-pj">
                    <el-form-item
                        label="漏洞类型："
                        :label-width="formLabelWidth"
                        prop="leakType"
                        style="margin-right: 60px;width: 100%"
                        :rules="{
                            required: true, message: '请选择', trigger: 'change'
                        }">
                        <el-select v-model="addForm.leakType" filterable placeholder="请选择" style="width: 100%;" size="small" clearable>
                            <el-option label="主机漏洞" :value="0"></el-option>
                            <el-option label="基线漏洞" :value="1"></el-option>
                            <el-option label="网站漏洞" :value="2"></el-option>
                            <el-option label="口令猜测" :value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        label="漏洞来源："
                        :label-width="formLabelWidth"
                        prop="fromType"
                        style="width: 100%;"
                        :rules="{
                            required: true, message: '请选择', trigger: 'change'
                        }">
                        <el-select v-model="addForm.fromType" filterable placeholder="请选择" style="width: 100%;" size="small" @change="addForm.objId=''">
                            <el-option label="资产IP" value="0"></el-option>
                            <el-option label="业务系统" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="ub ub-pj">
                    <el-form-item
                        :label="addForm.fromType == 0?'选择资产：':'选择业务系统：'"
                        :label-width="formLabelWidth"
                        prop="objId"
                        style="margin-right: 60px;width: 100%"
                        :rules="{
                            required: true, message: '请选择', trigger: 'change'
                        }">
                        <el-select v-model="addForm.objId" filterable placeholder="请选择" style="width: 100%;" size="small" clearable>
                            <el-option v-for="(item,index) in addForm.fromType==0?assets:systems" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        label="漏洞级别："
                        :label-width="formLabelWidth"
                        prop="riskLevel"
                        style="width: 100%;"
                        :rules="{
                            required: true, message: '请选择', trigger: 'change'
                        }">
                        <el-select v-model="addForm.riskLevel" filterable placeholder="请选择" style="width: 100%;" size="small" clearable>
                            <el-option label="低" value="1"></el-option>
                            <el-option label="中" value="2"></el-option>
                            <el-option label="高" value="3"></el-option>
                            <el-option label="信息类" value="4"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="ub ub-pj">
                    <el-form-item
                        v-if="addForm.leakType===0"
                        label="漏洞端口："
                        :label-width="formLabelWidth"
                        style="width: 100%"
                        prop="port"
                        :rules="{
                            required: true, message: '请输入', trigger: 'blur'
                        }">
                        <el-input placeholder="请输入" style="width: 100%;" clearable v-model="addForm.port" size="small"></el-input>
                    </el-form-item>
                </div>
                <div class="ub ub-pj">
                    <el-form-item
                        v-if="addForm.leakType===1"
                        label="检查结果："
                        :label-width="formLabelWidth"
                        prop="checkResult"
                        style="width: 100%; margin-right: 60px;"
                        :rules="{
                            required: true, message: '请选择', trigger: 'change'
                        }">
                        <el-select v-model="addForm.checkResult" filterable placeholder="请选择" style="width: 100%;" size="small" clearable>
                            <el-option label="合规" :value="0"></el-option>
                            <el-option label="不合规" :value="1"></el-option>
                            <el-option label="不适用" :value="2"></el-option>
                            <el-option label="解析失败" :value="3"></el-option>
                            <el-option label="检查失败" :value="4"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="addForm.leakType===1" style="width: 100%;" label="检查类型：" :label-width="formLabelWidth" prop="checkType">
                        <el-input placeholder="请输入" style="width: 100%" clearable v-model="addForm.checkType" size="small"></el-input>
                    </el-form-item>
                </div>
                <div class="ub ub-pj">
                    <el-form-item v-if="addForm.leakType===1" style="width: 100%" label="CNCVE编号：" :label-width="formLabelWidth" prop="cncveTag">
                        <el-input placeholder="请输入" style="width: 100%" clearable v-model="addForm.cncveTag" size="small"></el-input>
                    </el-form-item>
                </div>
                <el-form-item v-if="addForm.leakType===1" style="width: 100%" label="合规项描述：" :label-width="formLabelWidth" prop="compliance">
                    <el-input style="width:100%;" type="textarea" placeholder="请输入" clearable v-model="addForm.compliance" size="small"></el-input>
                </el-form-item>
                <el-form-item v-if="addForm.leakType===1" style="width: 100%" label="加固方案：" :label-width="formLabelWidth" prop="reinforcement">
                    <el-input style="width:100%;" type="textarea" placeholder="请输入" clearable v-model="addForm.reinforcement" size="small"></el-input>
                </el-form-item>
                <div class="ub ub-pj">
                    <el-form-item v-if="addForm.leakType===2" style="width: 100%;margin-right: 60px;" label="漏洞URL：" :label-width="formLabelWidth">
                        <el-input placeholder="请输入" style="width: 100%;" clearable v-model="addForm.leakUrl" size="small"></el-input>
                    </el-form-item>
                    <el-form-item v-if="addForm.leakType===2" style="width: 100%;" label="网站名称：" :label-width="formLabelWidth" prop="webName">
                        <el-input placeholder="请输入" style="width: 100%;" clearable v-model="addForm.webName" size="small"></el-input>
                    </el-form-item>
                </div>
                <div class="ub ub-pj">
                    <el-form-item v-if="addForm.leakType===2" style="width: 100%" label="提交类型：" :label-width="formLabelWidth" prop="submitType">
                        <el-input placeholder="请输入" style="width: 100%" clearable v-model="addForm.submitType" size="small"></el-input>
                    </el-form-item>
                </div>
                <el-form-item v-if="addForm.leakType===0||addForm.leakType===2||addForm.leakType===3" style="width:100%;" label="修复建议：" :label-width="formLabelWidth">
                    <el-input style="width:100%;" type="textarea" placeholder="请输入" clearable v-model="addForm.repairAdvice" size="small"></el-input>
                </el-form-item>
                <el-form-item v-if="addForm.leakType===0||addForm.leakType===2||addForm.leakType===3" style="width:100%;" label="简短描述：" :label-width="formLabelWidth">
                    <el-input style="width:100%;" type="textarea" placeholder="请输入" clearable v-model="addForm.shortDesc" size="small"></el-input>
                </el-form-item>
                <el-form-item v-if="addForm.leakType===0||addForm.leakType===2||addForm.leakType===3" style="width:100%;" label="详细描述：" :label-width="formLabelWidth">
                    <el-input style="width:100%;" type="textarea" placeholder="请输入" clearable v-model="addForm.fullDesc" size="small"></el-input>
                </el-form-item>
                <el-form-item v-if="addForm.leakType===0" style="width:100%;" label="影响平台：" :label-width="formLabelWidth">
                    <el-input style="width:100%;" type="textarea" placeholder="请输入" clearable v-model="addForm.platforms" size="small"></el-input>
                </el-form-item>
                <el-form-item v-if="addForm.leakType===0" style="width:100%;" label="服务名称：" :label-width="formLabelWidth">
                    <el-input style="width:100%;" type="textarea" placeholder="请输入" clearable v-model="addForm.serviceName" size="small"></el-input>
                </el-form-item>
                <el-form-item v-if="addForm.leakType===2" style="width:100%;" label="测试数据：" :label-width="formLabelWidth" prop="testData">
                    <el-input style="width:100%;" type="textarea" placeholder="请输入" clearable v-model="addForm.testData" size="small"></el-input>
                </el-form-item>
                <el-form-item v-if="addForm.leakType===2" style="width:100%;" label="POST数据：" :label-width="formLabelWidth" prop="postData">
                    <el-input style="width:100%;" type="textarea" placeholder="请输入" clearable v-model="addForm.postData" size="small"></el-input>
                </el-form-item>
                <el-form-item label="上传附件：" :label-width="formLabelWidth">
                    <el-upload
                        accept=".jpg,.jpeg,.png,.zip,.gif,.bmp,.pdf,.doc,.docx,.rar,.ppt,.JPG,.JPEG,.PBG,.ZIP,.GIF,.BMP,.PDF"
                        :limit="1"
                        class="upload-demo"
                        ref="upload"
                        action="/api/base-server/file/upload"
                        :headers="header"
                        :before-upload="beforeUpload"
                        name="fileUpload"
                        :on-success="uploadFileSuccess"
                        :on-error="uploadFileError"
                        :on-exceed="limitFun"
                        :file-list="addFileList">
                        <el-button size="small" type="primary">选择文件</el-button>
                        <span slot="tip" class="el-upload__tip" style="padding-left:10px;">
                            <i style="color:rgba(0, 0, 0, 0.5);font-size:12px;" class="el-icon-info"></i>
                            <span>仅支持ZIP、RAR、DOC、XLSX、PPT、JPG、PDF等格式文件</span>
                        </span>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" @click="submitForm('addForm')">确 定</el-button>
                <el-button size="small" @click="addDialog = false">取 消</el-button>
            </span>
        </el-dialog>
        <!--编辑对象-->
        <el-dialog v-dialogDrag title="编辑" :visible.sync="editDialog" width="750px" custom-class="common-dialog">
            <el-form label-position="top" :model="editForm" ref="editForm" :inline="true">
                <div class="ub ub-pj">
                    <el-form-item
                        label="漏洞名称："
                        :label-width="formLabelWidth"
                        prop="nodeName"
                        style="width: 100%;"
                        :rules="{
                            required: true, message: '请输入', trigger: 'blur'
                        }">
                        <el-input placeholder="请输入" style="width: 100%;" clearable v-model="editForm.nodeName" size="small"></el-input>
                    </el-form-item>
                </div>
                <div class="ub ub-pj">
                    <el-form-item
                        label="漏洞类型："
                        :label-width="formLabelWidth"
                        prop="leakType"
                        style="margin-right: 60px;width: 100%"
                        :rules="{
                            required: true, message: '请选择', trigger: 'change'
                        }">
                        <el-select v-model="editForm.leakType" filterable placeholder="请选择" style="width: 100%;" size="small" clearable>
                            <el-option label="主机漏洞" :value="0"></el-option>
                            <el-option label="基线漏洞" :value="1"></el-option>
                            <el-option label="网站漏洞" :value="2"></el-option>
                            <el-option label="口令猜测" :value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        label="漏洞来源："
                        :label-width="formLabelWidth"
                        prop="fromType"
                        style="width: 100%;"
                        :rules="{
                            required: true, message: '请选择', trigger: 'change'
                        }">
                        <el-select v-model="editForm.fromType" filterable placeholder="请选择" style="width: 100%;" size="small" @change="editForm.objId=''">
                            <el-option label="资产IP" value="0"></el-option>
                            <el-option label="业务系统" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="ub ub-pj">
                    <el-form-item
                        :label="editForm.fromType == 0?'选择资产：':'选择业务系统：'"
                        :label-width="formLabelWidth"
                        prop="objId"
                        style="margin-right: 60px;width: 100%"
                        :rules="{
                            required: true, message: '请选择', trigger: 'change'
                        }">
                        <el-select v-model="editForm.objId" filterable placeholder="请选择" style="width: 100%;" size="small" clearable>
                            <el-option v-for="(item,index) in editForm.fromType==0?assets:systems" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        label="漏洞级别："
                        :label-width="formLabelWidth"
                        prop="riskLevel"
                        style="width: 100%;"
                        :rules="{
                            required: true, message: '请选择', trigger: 'change'
                        }">
                        <el-select v-model="editForm.riskLevel" filterable placeholder="请选择" style="width: 100%;" size="small" clearable>
                            <el-option label="低" value="1"></el-option>
                            <el-option label="中" value="2"></el-option>
                            <el-option label="高" value="3"></el-option>
                            <el-option label="信息类" value="4"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="ub ub-pj">
                    <el-form-item
                        v-if="editForm.leakType===0"
                        label="漏洞端口："
                        :label-width="formLabelWidth"
                        style="width: 100%"
                        prop="port"
                        :rules="{
                            required: true, message: '请输入', trigger: 'blur'
                        }">
                        <el-input placeholder="请输入" style="width: 100%;" clearable v-model="editForm.port" size="small"></el-input>
                    </el-form-item>
                </div>
                <div class="ub ub-pj">
                    <el-form-item
                        v-if="editForm.leakType===1"
                        label="检查结果："
                        :label-width="formLabelWidth"
                        prop="checkResult"
                        style="width: 100%; margin-right: 60px;"
                        :rules="{
                            required: true, message: '请选择', trigger: 'change'
                        }">
                        <el-select v-model="editForm.checkResult" filterable placeholder="请选择" style="width: 100%;" size="small" clearable>
                            <el-option label="合规" :value="0"></el-option>
                            <el-option label="不合规" :value="1"></el-option>
                            <el-option label="不适用" :value="2"></el-option>
                            <el-option label="解析失败" :value="3"></el-option>
                            <el-option label="检查失败" :value="4"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="editForm.leakType===1" style="width: 100%;" label="检查类型：" :label-width="formLabelWidth" prop="checkType">
                        <el-input placeholder="请输入" style="width: 100%" clearable v-model="editForm.checkType" size="small"></el-input>
                    </el-form-item>
                </div>
                <div class="ub ub-pj">
                    <el-form-item v-if="editForm.leakType===1" style="width: 100%" label="CNCVE编号：" :label-width="formLabelWidth" prop="cncveTag">
                        <el-input placeholder="请输入" style="width: 100%" clearable v-model="editForm.cncveTag" size="small"></el-input>
                    </el-form-item>
                </div>
                <el-form-item v-if="editForm.leakType===1" style="width: 100%" label="合规项描述：" :label-width="formLabelWidth" prop="compliance">
                    <el-input style="width:100%;" type="textarea" placeholder="请输入" clearable v-model="editForm.compliance" size="small"></el-input>
                </el-form-item>
                <el-form-item v-if="editForm.leakType===1" style="width: 100%" label="加固方案：" :label-width="formLabelWidth" prop="reinforcement">
                    <el-input style="width:100%;" type="textarea" placeholder="请输入" clearable v-model="editForm.reinforcement" size="small"></el-input>
                </el-form-item>
                <div class="ub ub-pj">
                    <el-form-item v-if="editForm.leakType===2" style="width: 100%;margin-right: 60px;" label="漏洞URL：" :label-width="formLabelWidth">
                        <el-input placeholder="请输入" style="width: 100%;" clearable v-model="editForm.leakUrl" size="small"></el-input>
                    </el-form-item>
                    <el-form-item v-if="editForm.leakType===2" style="width: 100%;" label="网站名称：" :label-width="formLabelWidth" prop="webName">
                        <el-input placeholder="请输入" style="width: 100%;" clearable v-model="editForm.webName" size="small"></el-input>
                    </el-form-item>
                </div>
                <div class="ub ub-pj">
                    <el-form-item v-if="editForm.leakType===2" style="width: 100%" label="提交类型：" :label-width="formLabelWidth" prop="submitType">
                        <el-input placeholder="请输入" style="width: 100%" clearable v-model="editForm.submitType" size="small"></el-input>
                    </el-form-item>
                </div>
                <el-form-item v-if="editForm.leakType===0||editForm.leakType===2||editForm.leakType===3" style="width:100%;" label="修复建议：" :label-width="formLabelWidth">
                    <el-input style="width:100%;" type="textarea" placeholder="请输入" clearable v-model="editForm.repairAdvice" size="small"></el-input>
                </el-form-item>
                <el-form-item v-if="editForm.leakType===0||editForm.leakType===2||editForm.leakType===3" style="width:100%;" label="简短描述：" :label-width="formLabelWidth">
                    <el-input style="width:100%;" type="textarea" placeholder="请输入" clearable v-model="editForm.shortDesc" size="small"></el-input>
                </el-form-item>
                <el-form-item v-if="editForm.leakType===0||editForm.leakType===2||editForm.leakType===3" style="width:100%;" label="详细描述：" :label-width="formLabelWidth">
                    <el-input style="width:100%;" type="textarea" placeholder="请输入" clearable v-model="editForm.fullDesc" size="small"></el-input>
                </el-form-item>
                <el-form-item v-if="editForm.leakType===0" style="width:100%;" label="影响平台：" :label-width="formLabelWidth">
                    <el-input style="width:100%;" type="textarea" placeholder="请输入" clearable v-model="editForm.platforms" size="small"></el-input>
                </el-form-item>
                <el-form-item v-if="editForm.leakType===0" style="width:100%;" label="服务名称：" :label-width="formLabelWidth">
                    <el-input style="width:100%;" type="textarea" placeholder="请输入" clearable v-model="editForm.serviceName" size="small"></el-input>
                </el-form-item>
                <el-form-item v-if="editForm.leakType===2" style="width:100%;" label="测试数据：" :label-width="formLabelWidth" prop="testData">
                    <el-input style="width:100%;" type="textarea" placeholder="请输入" clearable v-model="editForm.testData" size="small"></el-input>
                </el-form-item>
                <el-form-item v-if="editForm.leakType===2" style="width:100%;" label="POST数据：" :label-width="formLabelWidth" prop="postData">
                    <el-input style="width:100%;" type="textarea" placeholder="请输入" clearable v-model="editForm.postData" size="small"></el-input>
                </el-form-item>
                <el-form-item label="上传附件：" :label-width="formLabelWidth">
                    <el-upload
                        accept=".jpg,.jpeg,.png,.zip,.gif,.bmp,.pdf,.doc,.docx,.rar,.ppt,.JPG,.JPEG,.PBG,.ZIP,.GIF,.BMP,.PDF"
                        :limit="1"
                        class="upload-demo"
                        ref="upload"
                        :headers="header"
                        action="/api/base-server/file/upload"
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
                <el-button size="small" type="primary" @click="submitFormEdit('editForm')">确 定</el-button>
                <el-button size="small" @click="editDialog = false">取 消</el-button>
            </span>
        </el-dialog>
        <el-dialog title="发起工单" :visible.sync="taskDialog" width="900px" custom-class="common-dialog">
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
                        <el-option v-for="item in allTemplate" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="width:100%;" label="工单描述：" :label-width="formLabelWidth">
                    <div style="width:100%;">
                        <vue-ueditor-wrap v-model="taskForm.workOrderContent" :config="myConfig"></vue-ueditor-wrap>
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <Debounce :time='1500' :isDebounce="2">
                    <el-button size="small" type="primary" @click.native="submitTaskForm('taskForm')">确 定</el-button>
                </Debounce>
                <el-button size="small" @click="taskDialog = false">取 消</el-button>
            </span>
        </el-dialog>
        <el-drawer :visible.sync="seeDialog" :title="seeForm.nodeName" direction="rtl" size="1020px">
            <div class="drawer-content">
                <div style="position: relative;left:0;top:0;width:100%;height:100%;overflow-y: auto;">
                    <div class="drawer-pad">
                        <el-tabs v-model="activeName">
                            <el-tab-pane label="基本信息" name="first">

                                <div class="ub w100 ub-ver baseInfo-list">
                                    <div class="ub w100 baseInfo-list-item">
                                        <div>漏洞名称 </div>
                                        <div class="ub ub-f1">{{seeForm.nodeName}}</div>
                                    </div>
                                    <div class="ub w100 baseInfo-list-item">
                                        <div>漏洞类型</div>
                                        <div class="ub ub-f1">{{seeForm.leakTypeCN}}</div>
                                    </div>
                                    <div class="ub w100 baseInfo-list-item">
                                        <div>修复建议</div>
                                        <div class="ub ub-f1">{{seeForm.repairAdvice}}</div>
                                    </div>
                                    <div class="ub w100 baseInfo-list-item">
                                        <div>简短描述</div>
                                        <div class="ub ub-f1">{{seeForm.shortDesc}}</div>
                                    </div>
                                    <div class="ub w100 baseInfo-list-item">
                                        <div>详细描述</div>
                                        <div class="ub ub-f1">{{seeForm.fullDesc}}</div>
                                    </div>
                                    <div class="ub w100 baseInfo-list-item">
                                        <div>漏洞CVSS分值</div>
                                        <div class="ub ub-f1">{{seeForm.cvssScore}}</div>
                                    </div>
                                    <div class="ub w100 baseInfo-list-item">
                                        <div>CVE编号</div>
                                        <div class="ub ub-f1">{{seeForm.cveTag}}</div>
                                    </div>
                                    <div class="ub w100 baseInfo-list-item">
                                        <div>CNNVD编号</div>
                                        <div class="ub ub-f1">{{seeForm.cnnvdTag}}</div>
                                    </div>
                                    <div class="ub w100 baseInfo-list-item">
                                        <div>CNVD编号</div>
                                        <div class="ub ub-f1">{{seeForm.cnvdTag}}</div>
                                    </div>
                                    <div class="ub w100 baseInfo-list-item">
                                        <div>CNCVE编号</div>
                                        <div class="ub ub-f1">{{seeForm.cncveTag}}</div>
                                    </div>
                                    <div class="ub w100 baseInfo-list-item">
                                        <div>BUGTRAP</div>
                                        <div class="ub ub-f1">{{seeForm.bugTraqTag}}</div>
                                    </div>

                                    <div class="ub w100 baseInfo-list-item">
                                        <div>更新时间</div>
                                        <div class="ub ub-f1">{{seeForm.updateTime}}</div>
                                    </div>
                                    <div class="ub w100 baseInfo-list-item">
                                        <div>影响平台</div>
                                        <div class="ub ub-f1">{{seeForm.platforms}}</div>
                                    </div>
                                    <div class="ub w100 baseInfo-list-item">
                                        <div>创建时间</div>
                                        <div class="ub ub-f1">{{seeForm.createTime}}</div>
                                    </div>
                                    <div class="ub w100 baseInfo-list-item">
                                        <div>漏洞端口</div>
                                        <div class="ub ub-f1">{{seeForm.port}}</div>
                                    </div>
                                    <div class="ub w100 baseInfo-list-item">
                                        <div>服务名称</div>
                                        <div class="ub ub-f1">{{seeForm.serviceName}}</div>
                                    </div>
                                    <div class="ub w100 baseInfo-list-item">
                                        <div>检查结果</div>
                                        <div class="ub ub-f1">{{seeForm.checkResult|getcheckResult}}</div>
                                    </div>
                                    <div class="ub w100 baseInfo-list-item">
                                        <div>检查类型</div>
                                        <div class="ub ub-f1">{{seeForm.checkType}}</div>
                                    </div>
                                    <div class="ub w100 baseInfo-list-item">
                                        <div>合规项描述</div>
                                        <div class="ub ub-f1">{{seeForm.compliance}}</div>
                                    </div>
                                    <div class="ub w100 baseInfo-list-item">
                                        <div>加固方案</div>
                                        <div class="ub ub-f1">{{seeForm.reinforcement}}</div>
                                    </div>
                                    <div class="ub w100 baseInfo-list-item">
                                        <div>漏洞URL</div>
                                        <div class="ub ub-f1">{{seeForm.leakUrl}}</div>
                                    </div>
                                    <div class="ub w100 baseInfo-list-item">
                                        <div>网站名称</div>
                                        <div class="ub ub-f1">{{seeForm.webName}}</div>
                                    </div>
                                    <div class="ub w100 baseInfo-list-item">
                                        <div>提交类型</div>
                                        <div class="ub ub-f1">{{seeForm.submitType}}</div>
                                    </div><div class="ub w100 baseInfo-list-item">
                                        <div>测试数据</div>
                                        <div class="ub ub-f1">{{seeForm.testData}}</div>
                                    </div>
                                    <div class="ub w100 baseInfo-list-item">
                                        <div>POST数据</div>
                                        <div class="ub ub-f1">{{seeForm.postData}}</div>
                                    </div>
                                    <div class="ub w100 baseInfo-list-item">
                                        <div>附件</div>
                                        <div class="ub ub-f1"><a :href="seeForm.filePath" style="color:#fff;text-decoration: underline;">{{seeForm.filePath|getfilePath}}</a></div>
                                    </div>
                                </div>
                            </el-tab-pane>
                            <el-tab-pane label="受影响资产" name="three">
                                <div v-if="activeName==='three'"  class="w100" style="margin-top: 20px;">
                                    <div class="leak-assets-title" style="font-size:14px;color:rgba(0,0,0,.9);width:100%;margin-bottom: 10px;">资产类型占比</div>
                                    <div class="w100">
                                        <div class="chart-box w100">
                                            <div class="chart-map w100">
                                                <div v-loading="load_loading" style="width:100%;height:210px;">
                                                    <div v-if="load_no_data" class="ub ub-f1 ub-ac ub-pc" style="height:100%;color:#e7e7e7;font-size:16px;">
                                                        暂无数据
                                                    </div>
                                                    <pie v-if="assetTypes.length>0" type="1" :chartData="assetTypes" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="leak-assets-title" style="font-size:14px;color:#rgba(0,0,0,.9);width:100%;margin-bottom: 10px;">影响资产列表</div>
                                    <el-table
                                        ref="multipleTable3"
                                        v-loading="loadingAssets"
                                        class='bigTable'
                                        :data="assetList"
                                        border
                                        stripe
                                        tooltip-effect="dark">
                                        <el-table-column align="center" type="index" :index="indexMethodAssets" width="50" label="序号">
                                        </el-table-column>
                                        <el-table-column prop="deviceName" label="资产名称">
                                        </el-table-column>
                                        <el-table-column prop="systemName" label="业务系统">
                                        </el-table-column>
                                        <el-table-column prop="zoneName" label="安全域">
                                        </el-table-column>
                                        <el-table-column label="IPV4">
                                            <template slot-scope="scope">
                                                <span>{{scope.row.ipv4.join(',')}}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="IPV6">
                                            <template slot-scope="scope">
                                                <span>{{scope.row.ipv6.join(',')}}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="风险等级">
                                            <template slot-scope="scope">
                                                <div>
                                                    <span style="color:#e40205;" v-if="scope.row.riskLevel==0">
                                                        {{scope.row.riskLevelCN}}
                                                    </span>
                                                    <span style="color:#f76801;" v-if="scope.row.riskLevel==1">
                                                        {{scope.row.riskLevelCN}}
                                                    </span>
                                                    <span style="color:#f5ed6b;" v-if="scope.row.riskLevel==2">
                                                        {{scope.row.riskLevelCN}}
                                                    </span>
                                                    <span style="color:#0088d8;" v-if="scope.row.riskLevel==3">
                                                        {{scope.row.riskLevelCN}}
                                                    </span>
                                                    <span style="color:#6bfcfc;" v-if="scope.row.riskLevel==4">
                                                        {{scope.row.riskLevelCN}}
                                                    </span>
                                                </div>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                    <div class="pagination" style="margin-top: 10px;text-align: right;">
                                        <el-pagination
                                            background
                                            @size-change="handleSizeChangeAssets"
                                            @current-change="handleCurrentChangeAssets"
                                            :current-page="get_paramsAssets.page"
                                            :page-sizes="[20, 30, 40,50]"
                                            :page-size="get_paramsAssets.size"
                                            layout="total, sizes, prev, pager, next"
                                            :total="total_numAssets">
                                        </el-pagination>
                                    </div>
                                </div>
                            </el-tab-pane>
                            <el-tab-pane label="工单详情" name="two">
                                <el-form :model="workFlowInfo" ref="workFlowInfo" :inline="true">
                                    <el-row type="flex" justify="start">
                                        <el-form-item label="工单编号：" prop="" style="width: 33%">
                                            {{ workFlowInfo.field.workOrderId }}
                                        </el-form-item>
                                        <el-form-item label="工单名称：" prop="" style="width: 33%">{{ workFlowInfo.field.workOrderName }}
                                        </el-form-item>
                                        <el-form-item label="工单模板：" prop="" style="width: 33%;" class="text-out-auto">
                                            {{ workFlowInfo.field.workMouldName }}
                                        </el-form-item>
                                    </el-row>
                                    <el-row type="flex" justify="start">
                                        <el-form-item label="创建时间：" prop="createTime" style="width: 33%">
                                            {{ workFlowInfo.field.createTime }}
                                        </el-form-item>
                                        <el-form-item label="优先级：" prop="" style="width: 33%">
                                            <span v-if="workFlowInfo.field.level==1" style="color:#ff0000;">{{workFlowInfo.field.level|getLevel}}</span>
                                            <span v-else-if="workFlowInfo.field.level==2" style="color:#ffdd00;">{{workFlowInfo.field.level|getLevel}}</span>
                                            <span v-else style="color:#00e1fd;">{{workFlowInfo.field.level|getLevel}}</span>
                                        </el-form-item>
                                        <el-form-item label="工单状态：" prop="" style="width: 33%">
                                            {{ workFlowInfo.field.status|getTaskStatus }}
                                        </el-form-item>
                                    </el-row>
                                    <el-row type="flex" justify="start">
                                        <el-form-item label="创建人：" prop="" style="width: 33%">
                                            {{ workFlowInfo.field.createUserName }}
                                        </el-form-item>
                                        <el-form-item label="当前节点：" prop="" style="width: 33%">{{ workFlowInfo.field.runningNodeName|getRunningNodeName }}
                                        </el-form-item>
                                        <el-form-item label="当前节点状态：" prop="" style="width: 33%">
                                            <span v-if="workFlowInfo.field.currentNodeStatus==='待处理'" style="color:#ffba00;">{{workFlowInfo.field.currentNodeStatus}}</span>
                                            <span v-if="workFlowInfo.field.currentNodeStatus==='已超时'" style="color:#ff00e4;">{{workFlowInfo.field.currentNodeStatus}}</span>
                                            <span v-if="workFlowInfo.field.currentNodeStatus==='已撤销'" style="color:#ccc;">{{workFlowInfo.field.currentNodeStatus}}</span>
                                            <span v-if="workFlowInfo.field.currentNodeStatus==='已完成'" style="color:lightgreen;">{{workFlowInfo.field.currentNodeStatus}}</span>

                                        </el-form-item>

                                    </el-row>
                                </el-form>
                            </el-tab-pane>

                        </el-tabs>
                        <div v-if="activeName==='two'&&workFlowInfo.flow.xml!=''" style="font-size:14px;color:#rgba(0,0,0,.9);width:100%;margin-bottom: 10px;">工单流程</div>
                        <div v-if="activeName==='two'&&workFlowInfo.flow.xml!=''" class="w100 pic-wrapper" style="color: #fff;position: relative;">

                            <bpmn-modeler
                                ref="refNode"
                                :xml="workFlowInfo.flow.xml"
                                :workStatus="workStatus"
                                :currentWorkIds="currentWorkIds"
                                :is-view="false"
                                @change-element="changeElement"
                            />
                        </div>
                        <div class="w100" v-if="activeName==='two'&&workFlowInfo.flow.xml!=''&&passForm.isPass!==''" style="margin-top: 20px;">
                            <div style="font-size:14px;color:#rgba(0,0,0,.9);width:100%;margin-bottom: 10px;">{{passForm.name}}</div>
                            <div class="w100">
                                <el-form :model="passForm" ref="passForm" :inline="true" style="color: #fff">
                                    <el-row type="flex" justify="start">
                                        <el-form-item label="结果：" prop="" style="width: 50%">
                                            {{passForm.isPass==1?'通过':'未通过'}}
                                        </el-form-item>
                                    </el-row>
                                </el-form>
                            </div>
                        </div>
                        <el-row v-if="activeName==='two'&&workFlowInfo.flow.xml!=''&&passForm.isPass!==''&&bpmRecord.length>0" style='margin:20px 0;' type="flex" justify="center">
                            <el-form :model="passForm" class="w100" ref="passForm" :inline="true" style="color: #fff">
                                <el-form-item label="流转记录：" prop="" style="width: 100%;">
                                    <div
                                        class="work-record "
                                        style="
                                    width:750px;
                                    padding:10px;
                                    box-sizing: border-box;
                                    background-color: rgba(0,0,0,.2);
                                    border-radius: 4px 0px 0px 0px;
                                    border: solid 1px rgba(0,233,255,.3);">
                                        <el-timeline style="width:87%;margin-left: 88px;box-sizing: border-box;">
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
                                                        <h4 style="color: #rgba(0,0,0,.9);font-size: 16px;">{{activity.userName|NullStr}}<sub style="font-size:12px;color: #ffffff;opacity: 0.6;margin-left: 10px;vertical-align: bottom;">{{activity.userRole|NullStr}}</sub></h4>
                                                    </div>
                                                    <div class="time-right" style="width: 150px;text-align: right;">
                                                        <el-button
                                                            type="text"
                                                            style="text-decoration: underline;font-size:12px;"
                                                            :class="{'el-icon-arrow-down':activity.isOpen,'el-icon-arrow-up':!activity.isOpen}"
                                                            @click="activity.isOpen=!activity.isOpen">展开查看</el-button>
                                                    </div>
                                                </div>
                                                <div v-show="activity.isOpen" style="border: solid 1px rgba(0,233,255,.3); padding:10px;">
                                                    <div class="time-text-box" v-if="(workFlowInfo.field.workOrderObject == 1||workFlowInfo.field.workOrderObject == 2)&&activity.dealType==0">
                                                        <div class="ub w100 time-text-box-item" v-for="(item,_index) in activity.dealContent" :key="_index">
                                                            <div class="time-text-box-left">{{item.name}}:</div>
                                                            <div v-if="item.valType==='text'||item.valType==='select'" class="ub ub-f1 ub-ver time-text-box-right">{{item|getVal}}</div>
                                                            <div v-else class="ub ub-f1 ub-ver time-text-box-right" v-html="item.val" @click="imageEnlargement"></div>
                                                        </div>
                                                    </div>

                                                    <!-- 漏洞处置 -->
                                                    <div class="time-text-box" v-if="workFlowInfo.field.workOrderObject == 2&&activity.operation&&activity.operation==2">
                                                        <div class="w100">
                                                            <div class="w100 time-text-box-item">
                                                                <div class="time-text-box-left">处置方式：</div>
                                                                <div class="time-text-box-right">{{ activity.dealContent.disposalType|getdisposalLeakType }}</div>
                                                            </div>
                                                            <div class="w100 time-text-box-item" v-if="activity.dealContent.disposalType == 2" >
                                                                <div class="time-text-box-left">描述：</div>
                                                                <div class="time-text-box-right" v-html="activity.dealContent.des"></div>
                                                            </div>
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
                                                    <div class="time-text-box-bottom"><i class="iconfont icon-jiediankaishishijian"></i> <span>开始：{{activity.receiveTime|NullStr}}</span></div>
                                                    <div class="time-text-box-bottom"><i class="iconfont icon-jiediantingliushijian"></i> <span>停留时长：<strong>{{activity.stayTime|NullStr}}</strong></span></div>
                                                    <div class="time-text-box-bottom"><i class="iconfont icon-jiediantingliushijian"></i> <span>超时时长：<strong>{{activity.allTime|NullStr}}</strong></span></div>
                                                    <div class="time-text-box-bottom"><i class="iconfont icon-chuliren"></i> <span>处理人：<strong class="users">{{activity.players|NullStr}}</strong></span></div>
                                                </div>
                                            </el-timeline-item>
                                        </el-timeline>
                                    </div>
                                </el-form-item>
                            </el-form>

                        </el-row>
                        <div class="w100" v-if="activeName==='two'&&workFlowInfo.flow.xml!=''&&passForm.isPass!==''" style="margin-top: 20px;">
                            <div style="font-size:14px;color:#rgba(0,0,0,.9);width:100%;margin-bottom: 10px;">任务属性</div>
                            <div class="w100">
                                <el-form :model="taskInfo" ref="taskInfo" :inline="true" style="color: #fff">
                                    <el-row type="flex" justify="start">
                                        <el-form-item label="任务开始时间：" prop="" style="width: 50%">
                                            <div class="ub line2" style="width: 270px;">
                                                {{ taskInfo.receiveTime }}
                                            </div>
                                        </el-form-item>
                                        <el-form-item label="任务停留时间：" prop="" style="width: 50%">
                                            <div class="ub line2" style="width: 270px;">
                                                {{ taskInfo.stayTime }}
                                            </div>
                                        </el-form-item>
                                    </el-row>
                                    <el-row type="flex" justify="start">
                                        <el-form-item label="处理人：" prop="createTime" style="width: 50%">
                                            <div class="ub line2" style="width: 270px;">
                                                {{ taskInfo.dealUsers }}
                                            </div>
                                        </el-form-item>
                                        <el-form-item label="任务描述：" prop="" style="width: 50%">
                                            <div class="ub line2" style="width: 270px;">
                                                {{ taskInfo.nodeDes }}
                                            </div>
                                        </el-form-item>
                                    </el-row>
                                </el-form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </el-drawer>
        <el-dialog title="标签配置" :visible.sync="labelDialog" width="700px" custom-class="attendance-dialog">
            <el-form :model="labelForm" :rules="rules" ref="labelForm" label-position="right">
                <el-form-item label="标签：" prop="labels" label-width="60px">
                    <el-select multiple placeholder="请选择" style="width: 100%;" v-model="labelForm.labels" size="small">
                        <el-option v-for="(item,index) in labels" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" @click="submitLabelForm('labelForm')">确 定</el-button>
                <el-button size="small" @click="labelDialog = false">确 定</el-button>
            <!-- <searchBtn title="确 定" @click="submitLabelForm('labelForm')" /> -->
            <!-- <cancel-btn title="取 消" @click="labelDialog = false" /> -->
            </span>
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
    getLeakList,
    deleteLeak,
    saveLeak,
    updateLeak,
    getAssets,
    getSystem,
    getLeakTemp,
    add_workTask,
    getAssetTypePrcent,
    getAssetList,
    add_label,
    getAssetsLabel,
    get_workFlowInfo,
    get_ElementInfo,
    leakExportExcelTemplate
} from '../../server/leak/api.js'
import pie from './charts/pieAssets.vue'
import bpmnModeler from '../../package/detailXml'
import VueUeditorWrap from '../../components/vue-ueditor-wrap.vue' // ES6 Module
import ueditorConfig from '../../mixins/ueditorConfig'
import {
    ImagePreview
} from 'vant'
export default {
    name: 'Leak',
    components: {
        pie,
        bpmnModeler,
        VueUeditorWrap
    },
    mixins: [ueditorConfig],
    data() {
        return {
            tableHeight: document.body.clientHeight - 270,
            addFileList: [],
            fileList: [],
            path: {
                path: '/file_leak/files/'
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
            workStatus: false,
            currentWorkIds: [],
            labelDialog: false,
            labels: [],
            labelForm: {
                labels: []
            },
            load_no_data: false,
            load_loading: false,
            assetTypes: [],
            assetList: [],
            seeDialog: false,
            activeName: 'first',
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
            isOpen: false,
            sourceId: '',
            allTemplate: [],
            taskForm: {
                workOrderName: '',
                workMouldId: '',
                level: '',
                workOrderContent: ''
            },
            taskDialog: false,
            optionType: [{
                label: '发起工单',
                value: 1,
                isActive: false
            }, {
                label: '标签配置',
                value: 3,
                isActive: false
            }, {
                label: '编辑',
                value: 2,
                isActive: false
            }, {
                label: '删除',
                value: 4,
                isActive: false
            }],
            detailDialog: false,
            seeForm: {},
            addDialog: false,
            assets: [],
            systems: [],
            addForm: {
                nodeName: '',
                shortDesc: '',
                fullDesc: '',
                repairAdvice: '',
                riskLevel: '',
                fromType: '0',
                objId: '',
                leakType: '',
                filePath: '',
                port: '',
                platforms: '',
                serviceName: '',
                checkResult: '',
                checkType: '',
                cncveTag: '',
                compliance: '',
                reinforcement: '',
                leakUrl: '',
                webName: '',
                submitType: '',
                testData: '',
                postData: ''
            },
            editForm: {
                id: '',
                nodeName: '',
                shortDesc: '',
                fullDesc: '',
                repairAdvice: '',
                riskLevel: '',
                fromType: '0',
                objId: '',
                leakType: '',
                filePath: '',
                port: '',
                platforms: '',
                serviceName: '',
                checkResult: '',
                checkType: '',
                cncveTag: '',
                compliance: '',
                reinforcement: '',
                leakUrl: '',
                webName: '',
                submitType: '',
                testData: '',
                postData: ''
            },
            rules: {
                nodeName: [{
                    required: true,
                    message: '请输入',
                    trigger: 'blur'
                }],
                riskLevel: [{
                    required: true,
                    message: '请选择',
                    trigger: 'change'
                }],
                fromType: [{
                    required: true,
                    message: '请选择',
                    trigger: 'change'
                }],
                objId: [{
                    required: true,
                    message: '请选择',
                    trigger: 'change'
                }],
                leakType: [{
                    required: true,
                    message: '请选择',
                    trigger: 'change'
                }],
                labels: [{
                    required: true,
                    message: '请选择',
                    trigger: 'change'
                }],
                workOrderName: [{
                    required: true,
                    message: '请输入名称',
                    trigger: 'blur'
                }],
                level: [{
                    required: true,
                    message: '请选择优先级',
                    trigger: 'change'
                }],
                workMouldId: [{
                    required: true,
                    message: '请选择工单模板',
                    trigger: 'change'
                }]

            },
            sayTimes: null,
            deleteDialog: false,
            deleteId: '',
            editDialog: false,
            formLabelWidth: '110px',
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
                riskLevel: '',
                labelId: '',
                fromType: 1,
                objId: ''
            },
            loadingAssets: false,
            total_numAssets: 0,
            get_paramsAssets: {
                page: 1,
                size: 20
            },
            kaiguan: false
        }
    },
    filters: {
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
        getcheckResult(type) {
            let types = [{
                label: '合规',
                value: 0
            }, {
                label: '不合规',
                value: 1
            }, {
                label: '不适用',
                value: 2
            }, {
                label: '解析失败',
                value: 3
            }, {
                label: '检查失败',
                value: 4
            }]
            let selected = types.filter(item => item.value == type)
            if (selected.length > 0) {
                return selected[0].label
            } else {
                return ''
            }
        },
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
        },
        // 漏洞处置
        getdisposalLeakType(type) {
            let types = [{
                label: '补丁',
                value: 0
            }, {
                label: '升级',
                value: 1
            }, {
                label: '其他',
                value: 2
            }]
            let selected = types.filter(item => item.value == type)
            if (selected.length > 0) {
                return selected[0].label
            } else {
                return ''
            }
        },
        getLevel(level) {
            if (level == 1) {
                return '高'
            } else if (level == 2) {
                return '中'
            } else if (level == 3) {
                return '低'
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
        }
    },
    computed: {
        // eslint-disable-next-line vue/return-in-computed-property
        addParams() {
            if (this.addForm.leakType === 0) {
                return {
                    nodeName: this.addForm.nodeName,
                    shortDesc: this.addForm.shortDesc,
                    fullDesc: this.addForm.fullDesc,
                    repairAdvice: this.addForm.repairAdvice,
                    riskLevel: this.addForm.riskLevel,
                    fromType: this.addForm.fromType,
                    objId: this.addForm.objId,
                    leakType: this.addForm.leakType,
                    filePath: this.addForm.filePath,
                    port: this.addForm.port,
                    platforms: this.addForm.platforms,
                    serviceName: this.addForm.serviceName
                }
            } else if (this.addForm.leakType === 1) {
                return {
                    nodeName: this.addForm.nodeName,
                    riskLevel: this.addForm.riskLevel,
                    fromType: this.addForm.fromType,
                    objId: this.addForm.objId,
                    leakType: this.addForm.leakType,
                    filePath: this.addForm.filePath,
                    checkResult: this.addForm.checkResult,
                    checkType: this.addForm.checkType,
                    cncveTag: this.addForm.cncveTag,
                    compliance: this.addForm.compliance,
                    reinforcement: this.addForm.reinforcement
                }
            } else if (this.addForm.leakType === 2) {
                return {
                    nodeName: this.addForm.nodeName,
                    shortDesc: this.addForm.shortDesc,
                    fullDesc: this.addForm.fullDesc,
                    repairAdvice: this.addForm.repairAdvice,
                    riskLevel: this.addForm.riskLevel,
                    fromType: this.addForm.fromType,
                    objId: this.addForm.objId,
                    leakType: this.addForm.leakType,
                    filePath: this.addForm.filePath,
                    leakUrl: this.addForm.leakUrl,
                    webName: this.addForm.webName,
                    submitType: this.addForm.submitType,
                    testData: this.addForm.testData,
                    postData: this.addForm.postData
                }
            } else if (this.addForm.leakType === 3) {
                return {
                    nodeName: this.addForm.nodeName,
                    shortDesc: this.addForm.shortDesc,
                    fullDesc: this.addForm.fullDesc,
                    repairAdvice: this.addForm.repairAdvice,
                    riskLevel: this.addForm.riskLevel,
                    fromType: this.addForm.fromType,
                    objId: this.addForm.objId,
                    leakType: this.addForm.leakType,
                    filePath: this.addForm.filePath
                }
            }
        },
        // eslint-disable-next-line vue/return-in-computed-property
        editParams() {
            if (this.editForm.leakType === 0) {
                return {
                    id: this.editForm.id,
                    nodeName: this.editForm.nodeName,
                    shortDesc: this.editForm.shortDesc,
                    fullDesc: this.editForm.fullDesc,
                    repairAdvice: this.editForm.repairAdvice,
                    riskLevel: this.editForm.riskLevel,
                    fromType: this.editForm.fromType,
                    objId: this.editForm.objId,
                    leakType: this.editForm.leakType,
                    filePath: this.editForm.filePath,
                    port: this.editForm.port,
                    platforms: this.editForm.platforms,
                    serviceName: this.editForm.serviceName
                }
            } else if (this.editForm.leakType === 1) {
                return {
                    id: this.editForm.id,
                    nodeName: this.editForm.nodeName,
                    riskLevel: this.editForm.riskLevel,
                    fromType: this.editForm.fromType,
                    objId: this.editForm.objId,
                    leakType: this.editForm.leakType,
                    filePath: this.editForm.filePath,
                    checkResult: this.editForm.checkResult,
                    checkType: this.editForm.checkType,
                    cncveTag: this.editForm.cncveTag,
                    compliance: this.editForm.compliance,
                    reinforcement: this.editForm.reinforcement
                }
            } else if (this.editForm.leakType === 2) {
                return {
                    id: this.editForm.id,
                    nodeName: this.editForm.nodeName,
                    shortDesc: this.editForm.shortDesc,
                    fullDesc: this.editForm.fullDesc,
                    repairAdvice: this.editForm.repairAdvice,
                    riskLevel: this.editForm.riskLevel,
                    fromType: this.editForm.fromType,
                    objId: this.editForm.objId,
                    leakType: this.editForm.leakType,
                    filePath: this.editForm.filePath,
                    leakUrl: this.editForm.leakUrl,
                    webName: this.editForm.webName,
                    submitType: this.editForm.submitType,
                    testData: this.editForm.testData,
                    postData: this.editForm.postData
                }
            } else if (this.editForm.leakType === 3) {
                return {
                    id: this.editForm.id,
                    nodeName: this.editForm.nodeName,
                    shortDesc: this.editForm.shortDesc,
                    fullDesc: this.editForm.fullDesc,
                    repairAdvice: this.editForm.repairAdvice,
                    riskLevel: this.editForm.riskLevel,
                    fromType: this.editForm.fromType,
                    objId: this.editForm.objId,
                    leakType: this.editForm.leakType,
                    filePath: this.editForm.filePath
                }
            }
        },
        header() {
            return { token: this.$getlocalStorage('initInfo').user.token }
        }
    },
    watch: {
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
        addDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.addForm.resetFields()
                    this.addFileList = []
                    for (let attr in this.addForm) {
                        if (attr === 'fromType') {
                            this.addForm[attr] = '0'
                        } else {
                            this.addForm[attr] = ''
                        }
                    }
                }
            }
        },
        editDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.editForm.resetFields()
                    this.addFileList = []
                    for (let attr in this.editForm) {
                        if (attr === 'fromType') {
                            this.editForm[attr] = '0'
                        } else {
                            this.editForm[attr] = ''
                        }
                    }
                }
            }
        },
        seeDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
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
                    this.bpmRecord = []
                }
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.assetsList()
            this.systemList()
            this.initLabelList()
            this.get_data()
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
        openFn(val) {
            this.kaiguan = val
        },
        reset() {
            this.get_params = {
                page: 1,
                size: 20,
                nodeName: '',
                vulnType: '',
                riskLevel: '',
                labelId: '',
                fromType: 1,
                objId: ''
            }
            this.sayTimes = null
            this.get_data()
        },
        downLoadTemplate() {
            leakExportExcelTemplate({ paramsData: {}, queryData: {}}).then(res => {
                console.log(res)
            })
        },
        canStart(row) {
            if (row.isStart == 1 || row.addType != 0) {
                return true
            } else {
                return false
            }
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
        changeElement({ id, name }) {
            console.log(id, name)
            this.getElementInfo(id, name)
        },
        getElementInfo(id, name) {
            let data = {
                queryData: {},
                paramsData: {
                    nodeId: id,
                    workOrderId: this.workFlowInfo.field.workOrderId
                }
            }
            get_ElementInfo(data).then(res => {
                console.log('节点详情', res)
                if (JSON.stringify(res) === '{}' || !res) {
                    return
                }
                let arr = res.records
                this.passForm.name = name
                this.passForm.isPass = res.isPass
                this.taskInfo = res.attr
                this.bpmRecord = arr.map((item, index) => {
                    item.size = 'large'
                    item.isOpen = true
                    item.color = 'rgba(0,0,0,1)'
                    item.icon = index === 0 ? 'el-icon-circle-check' : 'iconfont icon-circle'
                    item.dealContent = JSON.parse(item.dealContent)
                    return item
                })
            })
        },
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
            }).catch(error => {
                console.log('error' + error)
            })
        },
        labelSetShow() {
            if (this.multipleSelection.length === 0) {
                this.$message.warning('请选择要标签配置的漏洞')
            } else {
                if (this.multipleSelection.some(item => item.addType == 1)) {
                    this.$message.warning('勾选数据中包含漏扫数据不允许编辑')
                    return
                }
                let ids = []
                this.multipleSelection.forEach(item => {
                    ids.push(item.id)
                })
                this.deleteId = ids
                this.labelDialog = true
            }
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
        // 更多操作
        changeOption(value, row) {
            if (value == 1) {
            // 发起工单
                if (row.isStart == 1) {
                    return
                }
                this.sourceId = row.id
                this.get_workMound()
                this.taskDialog = true
            } else if (value == 2) {
            // 编辑
                this.fileList = []
                console.log(row)
                this.editForm.id = row.id
                this.editForm.fromType = row.fromType ? row.fromType + '' : '0'
                this.editForm.objId = row.objId + ''
                this.editForm.filePath = row.filePath
                this.editForm.nodeName = row.nodeName
                this.editForm.shortDesc = row.shortDesc
                this.editForm.fullDesc = row.fullDesc
                this.editForm.repairAdvice = row.repairAdvice
                this.editForm.riskLevel = row.riskLevel
                this.editForm.leakType = row.leakType
                this.editForm.port = row.port
                this.editForm.platforms = row.platforms
                this.editForm.serviceName = row.serviceName
                this.editForm.checkResult = row.checkResult
                this.editForm.checkType = row.checkType
                this.editForm.cncveTag = row.cncveTag
                this.editForm.compliance = row.compliance
                this.editForm.reinforcement = row.reinforcement
                this.editForm.leakUrl = row.leakUrl
                this.editForm.webName = row.webName
                this.editForm.submitType = row.submitType
                this.editForm.testData = row.testData
                this.editForm.postData = row.postData
                if (row.filePath) {
                    let arr = row.filePath.split('/')
                    this.fileList.push({
                        name: arr[arr.length - 1].split('.')[0],
                        url: arr[arr.length - 1]
                    })
                }
                this.editDialog = true
            } else if (value == 3) {
            // 标签配置
                let arr = []
                if (row.labels.length > 0) {
                    row.labels.forEach(_item => {
                        arr.push(_item.id)
                    })
                }
                this.labelForm.labels = arr
                this.deleteId = [`${row.id}`]
                this.labelDialog = true
            } else if (value == 4) {
            // 删除
                this.deleteId = [`${row.id}`]
                this.deleteDialog = true
            }
        },
        submitLabelForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = {
                        queryData: {},
                        paramsData: {
                            ids: this.deleteId,
                            labels: this.labelForm.labels
                        }
                    }
                    add_label(data).then(res => {
                        this.labelDialog = false
                        this.$message({
                            message: '标签配置成功',
                            type: 'success'
                        })
                        setTimeout(() => {
                            this.get_data()
                        }, 1500)
                    }).catch(error => {
                        this.labelDialog = false
                        console.log(error + 'error')
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        submitTaskForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = {
                        queryData: {},
                        paramsData: {
                            sourceId: this.sourceId,
                            workOrderName: this.taskForm.workOrderName,
                            level: this.taskForm.level,
                            workMouldId: this.taskForm.workMouldId,
                            workOrderContent: this.taskForm.workOrderContent,
                            type: 2
                        }
                    }
                    add_workTask(data).then(res => {
                        this.taskDialog = false
                        console.log('发起工单成功')
                        this.$message({
                            message: '发起工单成功',
                            type: 'success'
                        })
                        setTimeout(() => {
                            this.get_data()
                        }, 1500)
                    }).catch(error => {
                        this.taskDialog = false
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
                    id: 2
                }
            }
            getLeakTemp(data).then(res => {
                console.log('可用工单模板', res)
                this.allTemplate = res
            }).catch(err => {
                console.log(err, 'err')
            })
        },
        getAssetsFilter(id) {
            let selected = this.assets.filter(item => item.value === id)
            if (selected.length > 0) {
                return selected[0].label
            } else {
                return ''
            }
        },
        getSystemsFilter(id) {
            let selected = this.systems.filter(item => item.value === id)
            if (selected.length > 0) {
                return selected[0].label
            } else {
                return ''
            }
        },
        searchAssetsSystem(name) {

        },
        // 标签
        initLabelList() {
            this.labels = []
            let data = {
                queryData: {},
                paramsData: {}
            }
            getAssetsLabel(data).then(res => {
                console.log(res, '标签列表')
                if (res.length > 0) {
                    res.forEach(item => {
                        let obj = {}
                        obj.label = item.name
                        obj.value = item.id
                        this.labels.push(obj)
                    })
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // 资产列表
        assetsList() {
            this.assets = []
            let data = {
                queryData: {},
                paramsData: {}
            }
            getAssets(data).then(res => {
                console.log(res, '资产')
                if (res.length > 0) {
                    res.forEach(item => {
                        let obj = {}
                        obj.label = item.name
                        obj.value = item.id
                        this.assets.push(obj)
                    })
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // 业务系统列表
        systemList() {
            this.systems = []
            let data = {
                queryData: {},
                paramsData: {}
            }
            getSystem(data).then(res => {
                console.log(res, '系统')
                if (res.length > 0) {
                    res.forEach(item => {
                        let obj = {}
                        obj.label = item.systemName
                        obj.value = item.id
                        this.systems.push(obj)
                    })
                }
            }).catch(err => {
                console.log(err)
            })
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
            console.log('response', response)
            this.uploading.close()
            if (response.code == 1) {
                this.$message({
                    message: '附件上传成功!',
                    type: 'success'
                })
                var path = response.data.filePath
                if (this.addDialog) {
                    this.addForm.filePath = '/api/base-server/file/download' + encodeURI(encodeURI(path))
                } else {
                    this.editForm.filePath = '/api/base-server/file/download' + encodeURI(encodeURI(path))
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
                    labelId: this.get_params.labelId,
                    objId: this.get_params.objId,
                    fromType: this.get_params.objId ? 1 : '',
                    startTime: this.sayTimes === null ? '' : this.sayTimes[0],
                    endTime: this.sayTimes === null ? '' : this.sayTimes[1]
                }
            }
            getLeakList(data).then(res => {
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
                        obj.fromType = item.fromType
                        obj.objId = item.objId
                        obj.filePath = item.filePath
                        obj.leakType = item.leakType
                        obj.leakTypeCN = item.leakTypeCN
                        obj.labels = item.labels
                        obj.addType = item.addType
                        obj.checkResult = item.checkResult
                        obj.checkType = item.checkType
                        obj.compliance = item.compliance
                        obj.createMonth = item.createMonth
                        obj.ip = item.ip
                        obj.isStart = item.isStart
                        obj.leakUrl = item.leakUrl
                        obj.localTaskId = item.localTaskId
                        obj.logId = item.logId
                        obj.port = item.port
                        obj.postData = item.postData
                        obj.reinforcement = item.reinforcement
                        obj.serviceName = item.serviceName
                        obj.submitType = item.submitType
                        obj.testData = item.testData
                        obj.webName = item.webName
                        obj.deviceName = item.deviceName
                        obj.systemName = item.systemName

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
        indexMethodAssets(index) {
            return (this.get_paramsAssets.page - 1) * this.get_paramsAssets.size + index + 1
        },

        searchCheck() {
            this.get_params.page = 1
            this.get_data()
        },
        handleSee(row) {
            console.log(row)
            this.$set(this, 'seeForm', row)
            this.seeForm = row
            this.initAssetTypePrcent(row.id)
            this.initAssetList(this.seeForm.id)
            this.seeDialog = true
            this.getWorkFlow(row.id)
        },
        // 饼图
        initAssetTypePrcent(id) {
            this.load_loading = true
            this.load_no_data = true
            this.assetTypes = []
            let data = {
                queryData: {},
                paramsData: {
                    id: id
                }
            }
            getAssetTypePrcent(data).then(res => {
                console.log(res, '资产类型占比')
                this.load_loading = false
                if (res.length > 0) {
                    this.load_no_data = false
                    let arr = []
                    res.forEach(item => {
                        let obj = {}
                        obj.name = item.name
                        obj.value = item.num
                        arr.push(obj)
                    })
                    this.assetTypes = this.$deepCopy(arr)
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // 资产列表
        initAssetList(id) {
            this.loadingAssets = true
            this.assetList = []
            let data = {
                queryData: {},
                paramsData: {
                    id: id
                }
            }
            getAssetList(data).then(res => {
                console.log(res, '资产列表')
                this.loadingAssets = false
                this.total_numAssets = res.total
                let list = res.records
                if (list.length > 0) {
                    this.assetList = this.$deepCopy(list)
                }
            }).catch(err => {
                console.log(err)
            })
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
        handleDeleteFun() {
            let data = {
                queryData: {},
                paramsData: {
                    ids: this.deleteId
                }
            }
            deleteLeak(data).then(res => {
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
                        paramsData: this.addParams
                    }
                    saveLeak(data).then(res => {
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
                        paramsData: this.editParams
                    }
                    updateLeak(data).then(res => {
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
        },

        handleSizeChangeAssets(val) {
            this.get_paramsAssets.size = val
            this.initAssetList(this.seeForm.id)
        },
        handleCurrentChangeAssets(val) {
            this.get_paramsAssets.page = val
            this.initAssetList(this.seeForm.id)
        }
    }
}
</script>

<style lang="scss" scoped>
.table-area {
    background-color: #fff;
    padding: 10px;
    box-shadow: 0px 0px 8px 0px rgba(140, 152, 164, 0.2);
    border-radius: 4px;
    border: solid 1px #dadee8;
    margin-top: 10px;
    .pagination {
        margin-top: 20px;
        text-align: right;
    }
}
.haveStart{
    color:rgb(102, 102, 102);
}
.baseInfo-list{
    border-radius: 4px;
}
.baseInfo-list-item{
    min-height: 34px;
    margin-top: -2px;
    background-color: #fff;
}
.baseInfo-list-item:nth-child(1){
    margin-top:0;
}
.baseInfo-list-item>div:nth-child(1){
    width: 200px;
    min-height: 32px;
    line-height:32px;
    text-indent: 10px;
    font-size:12px;
    color: rgba(0, 0, 0, .9);
    background-color: #fff;
    border: solid 1px  #dcdcdc;
}
.baseInfo-list-item>div:nth-child(2){
    min-height: 32px;
    line-height:32px;
    text-indent: 10px;
    font-size:12px;
    color: rgba(0, 0, 0, .9);
    border: solid 1px #dcdcdc;
    border-left: none;
    padding:0 10px;
    box-sizing: border-box;
}
.chart-box {
    position: relative;
    height: 280px;

}
.roles ::v-deep .el-tag.el-tag--success {
    background-color: rgba(0, 0, 0, 0);
    border-color: #01c5ff;
    color: #00fdff;
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
    color: #387dee;
}

.upload-demo ::v-deep .el-upload-list__item:hover {
    background-color: rgba(0, 0, 0, 0);
}
.record-list ::v-deep .el-upload__tip {
    color: rgba(0, 0, 0, 0.5);
}
</style>
