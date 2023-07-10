<template>
    <div class="list">
        <SearchTop @search="searchAssets" @reset="reset">
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params">
                    <el-form-item label="安全域名：" label-width="80px">
                        <el-input placeholder="请输入安全域名" clearable v-model="get_params.zoneName" @keyup.enter.native="searchAssets" size="small"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
        </SearchTop>
        <div class="list-container">
            <div class="ub ub-pj w100 mb-1 ub-ac">
                <div class="list-tips">安全域管理</div>
                <div>
                    <el-button size="small" icon="el-icon-plus" type="primary" @click="openAdd" v-per="['assets_safetyzone_add']">添加安全域</el-button>
                    <el-button style="margin-left: 10px;" size="small" icon="el-icon-delete" type="danger" title="删除" @click="delAllUserBtn" v-per="['assets_safetyzone_del']">删除</el-button>
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
                <el-table-column prop="zoneName" label="安全域名称">
                </el-table-column>
                <el-table-column label="安全域拓扑图" align="left" width="110">
                    <template slot-scope="scope">
                        <el-button :disabled="!scope.row.zoneImg" @click="handleView(scope.row)" type="text" size="small">查看</el-button>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="handleEdit(scope.row)" v-per="['assets_attack_edit']">编辑</el-button>
                        <el-button type="text" size="small" @click="delUserBtn(scope.row)" v-per="['assets_safetyzone_del']">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size" @pagination="get_data" style="padding-top:10px" v-show="total_num>0"/>
        </div>
        <!--增加内容开始-->
        <el-dialog title="添加安全域" :visible.sync="addDomainDialog" width="700px" custom-class="common-dialog">
            <el-form :model="deviceForm" :rules="rules" ref="deviceForm" class="unit" label-position="top">
                <el-form-item label="安全域名：" prop="zoneName" :label-width="formLabelWidth">
                    <el-input size="small" v-model="deviceForm.zoneName" placeholder="请输入安全域名" autocomplete="off" style="width:100%"></el-input>
                </el-form-item>
                <el-form-item label="上传图片：" :label-width="formLabelWidth">
                    <el-upload
                        :headers="header"
                        action="/api/base-server/file/upload"
                        list-type="picture-card"
                        name="fileUpload"
                        accept=".jpg,.png,.JPG,.PNG,.bpm,.BPM"
                        :limit="1"
                        :file-list="fileList"
                        :on-exceed="handleExceed"
                        :on-preview="handlePictureCardPreview"
                        :on-success="handleSuccess"
                        :on-remove="handleRemove">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDomainDialog=false" size="small">取消</el-button>
                <el-button type="primary" @click="submitForm('deviceForm')" size="small">确认</el-button>
            </span>
        </el-dialog>
        <el-dialog title="图片预览" :visible.sync="dialogVisible" custom-class="common-dialog" width="700px">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
        <!--编辑内容-->
        <el-dialog title="编辑安全域" :visible.sync="editUserDialog" width="700px" custom-class="common-dialog">
            <el-form :model="assetsFormEdit" :rules="rules" ref="assetsFormEdit" class="unit" label-position="top">
                <el-form-item label="安全域名：" prop="zoneName" :label-width="formLabelWidth">
                    <el-input v-model="assetsFormEdit.zoneName" size="small" placeholder="请输入设备名称" autocomplete="off" style="width:100%"></el-input>
                </el-form-item>
                <el-form-item label="上传图片：" :label-width="formLabelWidth">
                    <el-upload
                        :headers="header"
                        action="/api/base-server/file/upload"
                        list-type="picture-card"
                        name="fileUpload"
                        accept=".jpg,.png,.JPG,.PNG,.bpm,.BPM"
                        :limit="1"
                        :file-list="fileList"
                        :on-exceed="handleExceed"
                        :on-preview="handlePictureCardPreview"
                        :on-success="handleSuccess"
                        :on-remove="handleRemove">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editUserDialog=false" size="small">取消</el-button>
                <el-button type="primary" @click="submitFormEdit('assetsFormEdit')" size="small">确认</el-button>
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
    </div>
</template>

<script>
import {
    safetyZone,
    addZoom,
    updateZoom,
    delZoom
} from '../../server/assets/api.js'
export default {
    name: 'User',
    data() {
        return {
            tabHeight: document.body.clientHeight - 260,
            formLabelWidth: '100px',
            hole: {
                name: '',
                data: []
            },
            loading: false,
            total_num: 0,
            tableData: [],
            multipleSelection: [],
            get_params: {
                page: 1,
                size: 20,
                zoneName: ''
            },
            userDeleteDialog: false,
            userDeleteAllDialog: false,
            delIds: [],
            addDomainDialog: false,
            editUserDialog: false,
            ips: [{
                value: ''
            }],
            deviceForm: {
                zoneName: '',
                zoneImg: ''
            },
            assetsFormEdit: {
                id: '',
                zoneName: '',
                zoneImg: ''
            },
            rules: {
                zoneName: [{
                    required: true,
                    message: '请输入安全域名',
                    trigger: 'blur'
                }],
                deviceTypeId: [{
                    required: true,
                    message: '请选择设备类型',
                    trigger: 'change'
                }],
                subnetMask: [{
                    required: true,
                    message: '请输入子网掩码',
                    trigger: 'blur'
                }],
                ip: [{
                    required: true,
                    message: '请输入IP地址',
                    trigger: 'blur'
                }]
            },
            dialogImageUrl: '',
            dialogVisible: false,
            userId: '',
            path: {
                path: ''
            },
            fileList: []
        }
    },
    computed: {
        header() {
            return { token: this.$getlocalStorage('initInfo').user.token }
        }
    },
    watch: {
        dialogVisible: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.dialogImageUrl = ''
                }
            }
        },
        addDomainDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.deviceForm.resetFields()
                }
            }
        },
        editUserDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.fileList = []
                }
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.get_data()
            // this.getTypes();
            // this.getSystems();
            // this.chats();
        })
    },
    created() {
        let user = this.$getsessionStorage('userInfo')
        console.log('$getsessionStorage', user.id)
        this.userId = user.id
        this.path.path = '/file_assets/' + user.id + '/'
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
                zoneName: ''
            }
            this.get_data()
        },
        openAdd() {
            this.addDomainDialog = true
            this.fileList = []
        },
        handleSuccess(response, file, fileList) {
            console.log('response', response)
            if (response.code == 1) {
                this.$message({
                    message: '文件上传成功!',
                    type: 'success'
                })
                this.deviceForm.zoneImg = response.data
                this.assetsFormEdit.zoneImg = response.data
            } else {
                this.$message({
                    message: response.message,
                    type: 'warning'
                })
            }
        },
        handleExceed(files, fileList) {
            this.$message.warning(`只能上传 1 张图片`)
        },
        handleRemove(file, fileList) {
            console.log(file, fileList)
            this.deviceForm.zoneImg = ''
            this.assetsFormEdit.zoneImg = ''
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url
            this.dialogVisible = true
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
        handleSee(obj) {
            console.log('handleSee')
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
                    zoneName: this.get_params.zoneName
                }
            }
            safetyZone(data).then(res => {
                console.log('safetyZone', res)
                this.loading = false
                this.total_num = res.total
                let list = res.records
                if (list.length > 0) {
                    list.forEach(item => {
                        let obj = {}
                        obj.id = item.id
                        obj.zoneName = item.zoneName
                        obj.createTime = item.createTime
                        obj.zoneImgName = item.zoneImgName
                        obj.zoneImg = item.zoneImg
                        this.tableData.push(obj)
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
                    // this.beforeHandel(true);
                    this.addAssets()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        addAssets() {
            console.log('this.deviceForm', this.deviceForm)
            let data = {
                queryData: {},
                paramsData: {
                    zoneName: this.deviceForm.zoneName,
                    zoneImg: this.deviceForm.zoneImg
                }
            }
            addZoom(data).then(res => {
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
                    zoneName: this.assetsFormEdit.zoneName,
                    zoneImg: this.assetsFormEdit.zoneImg
                }
            }
            updateZoom(data).then(res => {
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
                    // this.beforeHandel(false);
                    this.editAssets()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        delUserBtn(row) {
            this.delIds = []
            this.delIds.push(row.id)
            this.userDeleteDialog = true
        },
        delAllUserBtn() {
            if (this.multipleSelection.length > 0) {
                this.userDeleteAllDialog = true
                this.delIds = this.multipleSelection
            } else {
                this.$message({
                    message: '请选择要删除的安全域',
                    type: 'warning'
                })
            }
        },
        handleDelete() {
            console.log(this.delIds)
            let data = {
                queryData: {},
                paramsData: {
                    ids: this.delIds
                }
            }
            delZoom(data).then(res => {
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
        handleEdit(row) {
            console.log('row', row)
            this.assetsFormEdit = {
                id: row.id,
                zoneName: row.zoneName,
                zoneImg: row.zoneImg
            }
            this.fileList = []
            if (row.zoneImg != '') {
                this.fileList.push({
                    name: row.zoneImgName,
                    url: '/api/base-server/file/download' + encodeURI(encodeURI(row.zoneImg)) + '?token=' + this.$getlocalStorage('initInfo').user.token
                })
            }
            this.editUserDialog = true
        },
        handleView(row) {
            console.log('handleView', row)
            this.dialogImageUrl = '/api/base-server/file/download' + encodeURI(encodeURI(row.zoneImg)) + '?token=' + this.$getlocalStorage('initInfo').user.token
            this.dialogVisible = true
        }
    }
}
</script>

<style lang="scss" scoped>
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
    .event ::v-deep .el-upload--picture-card {
        background: rgb(0,0,0);
        border: 1px dashed #1cd7fa;
        box-shadow: 0 0 7px #389bf7 inset;
    }
    .event ::v-deep .el-upload--picture-card i {
        color: #1cd7fa;
    }
</style>
