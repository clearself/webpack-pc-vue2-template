<template>
    <div class="list">
        <SearchTop @search="searchAssets" @reset="reset" style="border-top-left-radius:0;border-top-right-radius:0;box-shadow:none">
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params">
                    <el-form-item label="名称：" label-width="80px">
                        <el-input placeholder="请输入" clearable v-model.trim="get_params.name" size="small"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params">
                    <el-form-item label="版本：" label-width="80px">
                        <el-input placeholder="请输入" clearable v-model.trim="get_params.version" size="small"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
        </SearchTop>
        <div class="list-container" style="padding-bottom: 10px">
            <div class="ub ub-pj w100 mb-1 ub-ac">
                <div class="list-tips">特征库</div>
                <div class="ub">
                    <el-button icon="iconfont icon-daoru" title="上传升级包" @click="addDialog = true" size="small" type="primary" v-per="['link_manage_trait_import']">上传升级包</el-button>
                </div>
            </div>
            <el-table
                ref="multipleTable"
                v-loading="loading"
                class='bigTable full-table'
                :row-class-name="tableRowClassName"
                :data="tableData"
                border
                stripe
                tooltip-effect="dark"
                :height="tabHeight"
                :row-style="{ height: '32px' }"
                :header-row-style="{ height: '32px' }"
                @selection-change="handleSelectionChange">
                <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                </el-table-column>
                <el-table-column prop="name" label="名称">
                </el-table-column>
                <el-table-column prop="versionNum" label="版本号">
                </el-table-column>
                <el-table-column prop="type" label="特征库">
                    <template slot-scope="{row}">
                        <div>
                            <span v-if="row.type === 0">事件库</span>
                            <span v-if="row.type === 1">病毒库</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="updateStatus" label="升级状态">
                    <template slot-scope="{row}">
                        <div>
                            <span v-if="row.updateStatus === 1">升级完成</span>
                            <span v-if="row.updateStatus === 0">升级中</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="updateEndTime" label="升级时间" width="160">
                </el-table-column>
                <el-table-column align="center" label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button title="回滚" @click="revert(scope.row)" size="small" type="text" v-per="['link_manage_trait_edit']">回滚</el-button>
                        <el-button title="删除" @click="delDevice(scope.row)" size="small" type="text" v-per="['link_manage_trait_del']">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="total_num>0" :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size" @pagination="get_data" style="padding-top:10px"/>
        </div>

        <!--增加-->
        <el-dialog title="上传升级包" :visible.sync="addDialog" width="700px" :close-on-click-modal="false" custom-class="common-dialog">
            <el-form :model="addForm" :rules="rules" ref="addForm" class="unit" label-position="top">
                <el-form-item label="名称：" prop="name" :label-width="formLabelWidth">
                    <el-input size="small" style="width: 652px" v-model="addForm.name" placeholder="请输入" autocomplete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="版本：" prop="version" :label-width="formLabelWidth">
                    <el-input size="small" style="width: 652px" v-model="addForm.version" placeholder="请输入" autocomplete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="特征库：" prop="type" :label-width="formLabelWidth">
                    <el-select clearable v-model="addForm.type" placeholder="请选择" size="small" style="width: 652px">
                        <el-option label="事件库" :value="0"></el-option>
                        <el-option label="病毒库" :value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="升级包：" class="package" :label-width="formLabelWidth">
                    <el-upload
                        :limit="1"
                        class="upload-demo"
                        ref="upload"
                        :headers="header"
                        action="/api/base-server/file/upload"
                        accept=".zip"
                        name="fileUpload"

                        :file-list="fileList"
                        :before-upload = "checkFileType"
                        :on-success="uploadFileSuccess"
                        :on-error="uploadFileError"
                        :on-exceed="limitFun">
                        <el-button size="small" type="primary">选择文件</el-button>
                        <span slot="tip" class="el-upload__tip" style="padding-left:10px;">
                            <i style="color:#606266;font-size:12px;" class="el-icon-info"></i>
                            <span>仅支持 zip 格式文件</span>
                        </span>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="addDialog = false">取消</el-button>
                <el-button size="small" type="primary" @click.native="submitForm('addForm')">确认</el-button>
            </span>
        </el-dialog>

        <!--删除-->
        <DeleteDialog
            :dialogVisible="deleteDialog"
            @delete="handleDelete"
            @cancel="deleteDialog = false">
        </DeleteDialog>
        <!--回滚-->
        <el-dialog title="回滚" :visible.sync="revertDialog" width="700px" custom-class="common-dialog">
            <span>确定回滚吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="revertDialog = false">取消</el-button>
                <el-button size="small" type="primary" @click.native="handleRevert">确认</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {
    get_tar_lib_list,
    add_tar_lib,
    delete_tar_lib_list,
    revert_tar_lib_list
} from '../../server/linkage/api'
export default {
    name: 'InterlockingEquipment',
    data() {
        return {
            tabHeight: document.body.clientHeight - 290,
            userDeleteAllDialog: false,
            formLabelWidth: '120px',
            loading: false,
            total_num: 0,
            tableData: [],
            multipleSelection: [],
            get_params: {
                page: 1,
                size: 20,
                name: '',
                version: ''
            },
            sayTimes: [],
            res: '',
            addForm: {
                version: '',
                name: '',
                type: '',
                path: ''
            },
            path: {
                path: '/file_linkage/files/'
            },
            addDialog: false,
            updateDialog: false,
            enableDialog: false,
            deleteDialog: false,
            revertDialog: false,
            record_id: '',
            flag: null,
            editDeploy: {
                id: '',
                status: ''
            },

            files: [],
            fileList: [],

            rules: {
                ip: [{
                    required: true,
                    message: '请输入设备IP',
                    trigger: 'blur'
                },
                {
                    pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
                    message: '请填写正确的IP',
                    trigger: 'blur'
                }
                ],
                appKey: [{
                    required: true,
                    message: '请输入',
                    trigger: 'blur'
                }],
                appToken: [{
                    required: true,
                    message: '请输入',
                    trigger: 'blur'
                }],
                type: [{
                    required: true,
                    message: '请选择特征库',
                    trigger: 'change'
                }],
                name: [{
                    required: true,
                    message: '请输入名称',
                    trigger: 'blur'
                }],
                version: [{
                    required: true,
                    message: '请输入版本',
                    trigger: 'blur'
                }]
            },
            types: [
                {
                    label: 'NFT',
                    value: 1
                },
                {
                    label: 'TAR',
                    value: 2
                },
                {
                    label: 'IPS',
                    value: 3
                }
            ],
            timer: null,
            uinId: '',
            listTimer: null
        }
    },
    computed: {
        header() {
            return { token: this.$getlocalStorage('initInfo').user.token }
        }
    },
    watch: {
        addDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.addForm.resetFields()
                    this.fileList = []
                    this.$refs.upload.clearFiles()
                }
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.get_data()
        })
    },
    beforeDestroy() {
        this.clearSetTimer()
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
                name: '',
                version: ''
            }
            this.get_data()
        },
        clearSetTimer() {
            if (this.timer) {
                clearTimeout(this.timer)
            }
            this.timer = null
        },
        checkFileType(file) {
            const fileName = file.name
            const fileType = fileName.substring(fileName.lastIndexOf('.'))
            if (fileType === '.zip') {
                console.log('是.zip文件')
            } else {
                this.$message({
                    message: '仅支持 zip 格式文件!',
                    type: 'warning'
                })
                return false
            }
        },
        uploadFileSuccess(response, file, fileList) {
            if (response.code == 1) {
                this.$message({
                    message: '文件上传成功!',
                    type: 'success'
                })
                // var path = response.data.filePath
                // console.log(path)
                this.addForm.path = response.data
            } else {
                this.$message({
                    message: response.message,
                    type: 'warning'
                })
            }
        },

        uploadFileError(obj) {
            this.$message({
                message: '上传失败！请重新上传。',
                type: 'warning'
            })
            console.log('error', obj)
        },
        limitFun(files, fileList) {
            this.$message({
                message: '文件只能上传一份！',
                type: 'warning'
            })
        },
        deleteAll() {
            if (this.multipleSelection.length == 0) {
                this.$message({
                    message: '请先选择事件类型',
                    type: 'warning'
                })
                return
            }
            this.userDeleteAllDialog = true
        },
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },

        searchAssets() {
            this.get_params.page = 1
            this.get_data()
        },
        get_data() {
            this.clearSetTimer()
            this.loading = true
            this.tableData = []
            let data = {
                queryData: {},
                paramsData: {
                    name: this.get_params.name,
                    versionNum: this.get_params.version
                }
            }
            get_tar_lib_list(data).then(res => {
                console.log(res, 'tar特征库')
                this.loading = false
                this.total_num = res.total ?? 0
                let list = res.records
                if (list.length > 0) {
                    list.forEach(item => {
                        let obj = {}
                        obj.id = item.id
                        obj.name = item.name
                        obj.versionNum = item.versionNum
                        obj.createTime = item.createTime
                        obj.updateEndTime = item.updateEndTime
                        obj.updateStatus = item.updateStatus
                        obj.path = item.path
                        obj.status = item.status
                        obj.type = item.type
                        this.tableData.push(obj)
                    })
                }
            }).catch(error => {
                this.loading = false
                console.log('error' + error)
            })
        },
        addUser() {
            this.addDialog = true
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.addDevice()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        addDevice() {
            let data = {
                queryData: {},
                paramsData: {
                    name: this.addForm.name,
                    versionNum: this.addForm.version,
                    type: this.addForm.type,
                    path: this.addForm.path
                }
            }

            if (!this.addForm.path) {
                this.$message({
                    message: '请先上传升级包',
                    type: 'warning'
                })
                return
            }
            add_tar_lib(data).then(res => {
                console.log(res)
                this.addDialog = false
                this.$message({
                    message: '添加成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(error => {
                this.addDialog = false
                console.log('error' + error)
            })
        },
        delDevice(row) {
            this.record_id = row.id
            this.deleteDialog = true
        },
        revert(row) {
            this.record_id = row.id
            this.revertDialog = true
        },
        handleDelete() {
            let data = {
                queryData: {},
                paramsData: {
                    ids: [this.record_id]
                }
            }
            delete_tar_lib_list(data).then(res => {
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
        handleRevert() {
            let data = {
                queryData: {},
                paramsData: {
                    id: this.record_id
                }
            }
            revert_tar_lib_list(data).then(res => {
                this.revertDialog = false
                console.log('回滚成功')
                this.$message({
                    message: '回滚成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(error => {
                this.revertDialog = false
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
        handleUpdate(row) {
            console.log('row', row)
            this.record_id = row.id
            this.updateDialog = true
        },
        handleEnabled(row) {
            console.log('row', row)
            this.record_id = row.id
            this.enableDialog = true
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
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
.event  ::v-deep  .el-form-item.package .el-form-item__label:before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
}

.event  ::v-deep  .el-upload-list {
    width: 48%;
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
.event  ::v-deep  .unit .el-input--small .el-input__inner {
    width: 300px;
}
.switch-wrapper{
    width:56px;
    height:20px;
    position: relative;
    cursor: pointer;
    margin-left: 10px;
}
.switch-wrapper>div:nth-child(1){
    width:56px;
    height:20px;
    background-color: #001a2c;
    box-shadow: inset 0px 0px 7px 0px #000000;
    border-radius: 14px;
    div{
        font-size: 12px;
        line-height: 20px;
        padding:0 8px;
    }
    >div:nth-child(1){
        color: #00d7ff;
        opacity: 0.6;
    }
    >div:nth-child(2){
        color: #ffaa47;
        opacity: 0.6;
    }
}
.switch-wrapper>div:nth-child(2){
    width: 20px;
    height: 20px;
    position: absolute;
    left:0;
    top:50%;
    margin-top: -10px;
    border-radius:100%;
}
.switch-wrapper.yes>div:nth-child(2){
    animation: moveone 0s linear forwards;
}
.switch-wrapper.no>div:nth-child(2){
    animation: _moveone 0s linear forwards;
}
@keyframes moveone {
    0% {
        background-color: #fa941c;
        box-shadow: 0px 0px 6px 0px #9c5603;
        left: 0;
    }

    100% {
        background-color: #1cd7fa;
        box-shadow: 0px 0px 6px 0px #058fa9;
        left: 36px;
    }
}
@-webkit-keyframes moveone {
    0% {
        background-color: #fa941c;
        box-shadow: 0px 0px 6px 0px #9c5603;
        left: 0;
    }

    100% {
        background-color: #1cd7fa;
        box-shadow: 0px 0px 6px 0px #058fa9;
        left: 36px;
    }
}
@keyframes _moveone {
    0% {
        background-color: #1cd7fa;
        box-shadow: 0px 0px 6px 0px #058fa9;
        left: 36px;
    }

    100% {
        background-color: #fa941c;
        box-shadow: 0px 0px 6px 0px #9c5603;
        left: 0;;
    }
}
@-webkit-keyframes _moveone {
    0% {
        background-color: #1cd7fa;
        left: 36px;
    }

    100% {
        background-color: #fa941c;
        left: 0;
    }
}
.event  ::v-deep  .bigTable.el-table td {
    min-height: 34px !important;
    padding: 4px 0 !important;
}
@keyframes moveone_white {
    0% {
        background-color: #fff;
        box-shadow: 0px 0px 10px 0px #e5e5e5;
        left: 1px;
    }

    100% {
        background-color: #fff;
        box-shadow: 0px 0px 10px 0px #e5e5e5;
        left: 37px;
    }
}
@-webkit-keyframes moveone_white {
    0% {
        background-color: #fff;
        box-shadow: 0px 0px 10px 0px #e5e5e5;
        left: 1px;
    }

    100% {
        background-color: #fff;
        box-shadow: 0px 0px 10px 0px #e5e5e5;
        left: 37px;
    }
}
@keyframes _moveone_white {
    0% {
        background-color: #fff;
        box-shadow: 0px 0px 10px 0px #e5e5e5;
        left: 37px;
    }

    100% {
        background-color: #fff;
        box-shadow: 0px 0px 10px 0px #e5e5e5;
        left: 1px;
    }
}
@-webkit-keyframes _moveone_white {
    0% {
        background-color: #fff;
        box-shadow: 0px 0px 10px 0px #e5e5e5;
        left: 37px;
    }

    100% {
        background-color: #fff;
        box-shadow: 0px 0px 10px 0px #e5e5e5;
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
