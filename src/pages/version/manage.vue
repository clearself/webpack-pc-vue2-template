<template>
    <div class="list">
        <div class="ub w100" style="box-sizing: border-box;">
            <SearchTop @search="searchAssets" @reset="reset">
                <el-col :md="12" :lg="8" :xl="6">
                    <el-form :model="get_params">
                        <el-form-item label="版本号：" label-width="85px">
                            <el-input placeholder="请输入" clearable v-model="get_params.versionNo" @keyup.enter.native="searchCheck" size="small"></el-input></el-form-item>
                    </el-form>
                </el-col>
                <el-col :md="12" :lg="8" :xl="6">
                    <el-form :model="get_params">
                        <el-form-item label="版本信息：" label-width="85px">
                            <el-input placeholder="请输入" clearable v-model="get_params.logs" @keyup.enter.native="searchCheck" size="small"></el-input></el-form-item>
                    </el-form>
                </el-col>
            </SearchTop>
        </div>
        <div class="list-container">
            <div class="ub ub-pj w100 mb-1">
                <div class="list-tips">版本列表</div>
                <div class="ub">
                    <el-button icon="el-icon-plus" size="small"  v-per="['im_ver_pub']" type="primary" @click="addUserDialog = true">发布版本</el-button>
                </div>
            </div>
            <el-table
                ref="multipleTable"
                v-loading="loading"
                class='bigTable'
                :data="tableData"
                border
                stripe
                :row-class-name="tableRowClassName"
                :row-style="{ height: '32px' }"
                :header-row-style="{ height: '32px' }"
                tooltip-effect="dark"
                :height="tableHeight">
                <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="versionNo" label="版本号" width="180">
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="logs" label="版本信息">
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="createTime" label="创建时间" width="180">
                </el-table-column>
                <el-table-column align="center" label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" v-per="['im_ver_edit']" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button size="small" style="margin-right: 7px" type="text" v-per="['im_ver_del']" @click="delUserBtn(scope.row)">删除</el-button>
                        <a :href="'/api/im/file/download'+ encodeURI(encodeURI(scope.row.url)) + '?token=' + $getlocalStorage('initInfo').user.token">
                            <el-button size="small" type="text" v-per="['im_ver_download']" @click="download(scope.row)">下载</el-button>
                        </a>
                    </template>
                </el-table-column>
            </el-table>
            <pagination
                :total="total_num"
                :page.sync="get_params.page"
                :limit.sync="get_params.size"
                @pagination="get_data"
                style="padding-top:10px"
                v-show="total_num>0"/>
        </div>
        <!--增加人员-->
        <el-dialog title="发布版本" :visible.sync="addUserDialog" width="700px" custom-class="common-dialog">
            <el-form :model="addUserForm" ref="addUserForm" :rules="rules" label-position="top">
                <el-form-item label="版本号：" prop="versionNo" :label-width="formLabelWidth" style="margin: 10px 0 20px;">
                    <el-input placeholder="请输入" clearable maxlength="50" show-word-limit v-model="addUserForm.versionNo" size="small"></el-input>
                </el-form-item>
                <el-form-item label="版本信息：" prop="logs" :label-width="formLabelWidth" style="margin: 10px 0 20px;">
                    <el-input placeholder="请输入" type="textarea" maxlength="500" show-word-limit :autosize="{ minRows: 3, maxRows: 6}" clearable v-model="addUserForm.logs" size="small"></el-input>
                </el-form-item>
                <el-form-item label="上传文件：" required :label-width="formLabelWidth" style="margin: 10px 0 20px;">
                    <div class="ub">
                        <el-upload
                            name="fileUpload"
                            class="upload-demo"
                            :data="uploadToken"
                            accept=".exe"
                            ref="upload1"
                            :limit="1"
                            :auto-upload="false"
                            action="/api/im/file/upload"
                            :before-upload="beforeAvatarUpload"
                            :on-change="handleChange"
                            :on-remove="handleRemove"
                            :file-list="fileList"
                            :on-exceed="limitFun">
                            <el-button size="small">点击上传文件</el-button>
                        </el-upload>
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" v-if="!uploadLoading" @click="submitForm('addUserForm')">确 定</el-button>
                <div class="btn-dis" style="background-color: #a0cfff" v-else>
                    <i class="el-icon-loading"></i>
                    上传中</div>
                <el-button size="small" @click="addUserDialog = false">取 消</el-button>
            </span>
        </el-dialog>
        <!--编辑人员-->
        <el-dialog title="编辑版本" :visible.sync="editUserDialog" width="700px" custom-class="common-dialog">
            <el-form :model="editUserForm" ref="editUserForm" :rules="rules" label-position="top">
                <el-form-item label="版本号：" prop="versionNo" :label-width="formLabelWidth" style="margin: 10px 0 20px;">
                    <el-input placeholder="请输入" clearable maxlength="50" show-word-limit v-model="editUserForm.versionNo" size="small"></el-input>
                </el-form-item>
                <el-form-item label="版本信息：" prop="logs" :label-width="formLabelWidth" style="margin: 10px 0 20px;">
                    <el-input placeholder="请输入" type="textarea" maxlength="500" show-word-limit :autosize="{ minRows: 3, maxRows: 6}" clearable v-model="editUserForm.logs" size="small"></el-input>
                </el-form-item>
                <el-form-item label="上传文件：" :label-width="formLabelWidth" style="margin: 10px 0 20px;">
                    <div class="ub">
                        <el-upload
                            name="fileUpload"
                            class="upload-demo"
                            :data="uploadToken"
                            accept=".exe"
                            ref="upload1"
                            :limit="1"
                            action="#"
                            :auto-upload="false"
                            :before-upload="beforeAvatarUpload"
                            :on-change="handleChange"
                            :on-remove="handleRemove"
                            :file-list="fileList"
                            :on-exceed="limitFun">
                            <el-button size="small">点击上传文件</el-button>
                        </el-upload>
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" v-if="!uploadLoading" type="primary" @click="submitFormEdit('editUserForm')">确 定</el-button>
                <div class="btn-dis" style="background-color: #a0cfff" v-else>
                    <i class="el-icon-loading"></i>
                    上传中</div>
                <el-button size="small" @click="editUserDialog = false">取 消</el-button>
            </span>
        </el-dialog>

        <!--删除-->
        <DeleteDialog
            :dialogVisible="userDeleteDialog"
            @delete="handleDelete"
            @cancel="userDeleteDialog = false">
        </DeleteDialog>
    </div>
</template>

<script>
import {
    getPages,
    publish,
    del,
    update,
    upload
} from '../../server/version/manage.js'
export default {
    name: 'FightSchedule',
    data() {
        return {
            fileList: [],
            uploadToken: {
                token: ''
                // path: '/file_logos/files/'
            },
            tableHeight: document.body.clientHeight - 260,
            formLabelWidth: '100px',
            loading: false,
            total_num: 0,
            tableData: [],
            get_params: {
                page: 1,
                size: 20,
                versionNo: '',
                logs: ''
            },
            addUserForm: {
                url: '',
                versionNo: '',
                logs: '',
                fileSize: '',
                fileName: ''
            },
            editUserForm: {
                id: '',
                url: '',
                versionNo: '',
                fileSize: '',
                logs: '',
                fileName: ''
            },
            userDeleteDialog: false,
            delIds: '',
            addUserDialog: false,
            editUserDialog: false,
            rules: {
                versionNo: [{
                    required: true,
                    message: '请输入版本号',
                    trigger: 'change'
                }],
                logs: [{
                    required: true,
                    message: '请输入版本信息',
                    trigger: 'change'
                }]
            },
            uploadLoading: false
        }
    },
    watch: {
        addUserDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.addUserForm = {
                        url: '',
                        versionNo: '',
                        logs: '',
                        fileName: ''
                    }
                    this.fileList = []
                    this.$refs.addUserForm.resetFields()
                } else {
                    this.addUserForm = {
                        url: '',
                        versionNo: '',
                        logs: '',
                        fileName: ''
                    }
                    this.fileList = []
                }
            }
        },
        editUserDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.fileList = []
                    this.editUserForm = {
                        id: '',
                        url: '',
                        versionNo: '',
                        logs: '',
                        fileName: ''
                    }
                    this.$refs.editUserForm.resetFields()
                }
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.get_data()
            this.getToken()
        })
    },
    methods: {
        getToken() {
            let initInfo = this.$getlocalStorage('initInfo')
            this.uploadToken.token = initInfo.user.token
        },
        tableRowClassName({ row, rowIndex }) {
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
                versionNo: '',
                logs: ''
            }
            this.get_data()
        },
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },

        searchAssets() {
            this.get_params.page = 1
            this.get_data()
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
                    versionNo: this.get_params.versionNo,
                    logs: this.get_params.logs
                }
            }
            getPages(data).then(res => {
                console.log(res)
                this.loading = false
                this.total_num = res.total
                this.tableData = res.records
            }).catch(error => {
                this.loading = false
                console.log('error' + error)
            })
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.addUserSuccess()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        addUserSuccess() {
            if (this.addUserForm.url == '') {
                this.$message({
                    message: '请上传版本文件',
                    type: 'warning'
                })
                return false
            }
            let data = {
                queryData: {},
                paramsData: {
                    versionNo: this.addUserForm.versionNo,
                    logs: this.addUserForm.logs,
                    url: this.addUserForm.url,
                    fileName: this.addUserForm.fileName,
                    fileSize: this.addUserForm.fileSize
                }
            }
            publish(data).then(res => {
                console.log(res)
                this.addUserDialog = false
                this.$message({
                    message: '添加成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(error => {
                // this.addUserDialog = false
                console.log('error' + error)
            })
        },
        editUserSuccess() {
            if (this.editUserForm.url == '') {
                this.$message({
                    message: '请上传版本文件',
                    type: 'warning'
                })
                return false
            }
            let data = {
                queryData: {},
                paramsData: {
                    id: this.editUserForm.id,
                    versionNo: this.editUserForm.versionNo,
                    logs: this.editUserForm.logs,
                    url: this.editUserForm.url,
                    fileName: this.editUserForm.fileName,
                    fileSize: this.editUserForm.fileSize
                }
            }
            update(data).then(res => {
                console.log(res)
                this.editUserDialog = false
                this.$message({
                    message: '编辑成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(error => {
                this.addUserDialog = false
                console.log('error' + error)
            })
        },
        submitFormEdit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.editUserSuccess()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        delUserBtn(row) {
            this.delIds = row.id
            this.userDeleteDialog = true
        },
        handleDelete() {
            let data = {
                queryData: {},
                paramsData: {
                    id: this.delIds
                }
            }
            del(data).then(res => {
                this.userDeleteDialog = false
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
                console.log(error + 'error')
            })
        },
        handleEdit(row) {
            console.log('row', row)
            // eslint-disable-next-line no-unused-expressions
            this.editUserForm = {
                id: row.id,
                versionNo: row.versionNo,
                logs: row.logs,
                url: row.url,
                fileName: row.fileName,
                fileSize: row.fileSize
            }
            this.fileList.push({
                name: row.fileName,
                url: '/api/base-server/file/download' + encodeURI(encodeURI(row.url)) + '?token=' + this.$getlocalStorage('initInfo').user.token
            })
            setTimeout(() => {
                this.editUserDialog = true
            }, 350)
        },
        handleChange(file, fileList) {
            let testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
            console.log(testmsg, '222')
            const extension = testmsg === 'exe'
            const isLt50M = file.size / 1024 / 1024 < 200
            if (!extension) {
                this.$message({
                    message: '上传文件只能是exe 格式!',
                    type: 'error'
                })
                this.fileList = []
                return false // 必须加上return false; 才能阻止
            }
            console.log(file)
            if (!isLt50M) {
                this.$message({
                    message: '上传文件大小不能超过 200MB!',
                    type: 'error'
                })
                this.fileList = []
                return false
            }
            console.log('file', file, fileList)
            let formData = new FormData()
            formData.append('file', file.raw)
            this.uploadLoading = true
            upload({ paramsData: formData }).then(res => {
                console.log(res, '上传结果')
                this.$message.success('上传成功')
                if (this.addUserDialog) {
                    this.addUserForm.url = res
                    this.addUserForm.fileName = file.name
                    this.addUserForm.fileSize = file.size
                    console.log('文件地址' + this.addUserForm.url)
                }
                if (this.editUserDialog) {
                    this.editUserForm.url = res
                    this.editUserForm.fileName = file.name
                    this.editUserForm.fileSize = file.size
                    console.log('文件地址' + this.editUserForm.url)
                }
                this.uploadLoading = false
            }).catch(err => {
                console.log(err)
                this.fileList = []
                this.uploadLoading = false
            })
        },
        // 上传图片相关
        limitFun(files, fileList) {
            this.$message({
                message: '附件只能上传一份！',
                type: 'warning'
            })
        },
        beforeAvatarUpload(file) {
            let testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
            console.log(testmsg, '222')
            const extension = testmsg === 'exe'
            const isLt50M = file.size / 1024 / 1024 < 200
            if (!extension) {
                this.$message({
                    message: '上传文件只能是exe 格式!',
                    type: 'error'
                })
                return false // 必须加上return false; 才能阻止
            }
            console.log(file)
            if (!isLt50M) {
                this.$message({
                    message: '上传文件大小不能超过 200MB!',
                    type: 'error'
                })
                return false
            }
            return extension || isLt50M
        },
        handleRemove(file, fileList) {
            this.fileList = []
            if (this.addUserDialog) {
                this.addUserForm.url = ''
                this.addUserForm.fileName = ''
                this.addUserForm.fileSize = ''
                console.log(this.addUserForm.url)
            }
            if (this.editUserDialog) {
                this.editUserForm.url = ''
                this.editUserForm.fileName = ''
                this.editUserForm.fileSize = ''
                console.log(this.editUserForm.url)
            }
        }
    }
}
</script>

    <style lang="scss" scoped>
        .btn-dis {
            display: inline-block;
            width: 80px;
            height: 32px;
            color: #fff;
            position: relative;
            top: 1px;
            background-color: #a0cfff;
            border-color: #a0cfff;
            margin-left: 10px;
            margin-right: 10px;
            padding: 9px 15px 9px 0px;
            font-size: 12px;
            border-radius: 3px;
        }
        .pagination {
            padding: 0px 0 20px;
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

        .event ::v-deep .el-range-input {
            background-color: rgba(0, 0, 0, 0);
            color: #fff;
        }

        .event ::v-deep .el-range-separator {
            color: #fff;
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
        .date-close ::v-deep .el-date-editor .el-range__close-icon {
            margin-right: 10px;
        }
    </style>
