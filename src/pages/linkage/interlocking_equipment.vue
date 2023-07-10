<template>
    <div class="list">
        <div class="ub w100 search-area" style="box-sizing: border-box;">
            <SearchTop @search="searchAssets" @reset="reset" style="border-top-left-radius:0;border-top-right-radius:0;box-shadow:none">
                <el-col :md="12" :lg="8" :xl="6">
                    <el-form :model="get_params">
                        <el-form-item label="设备IP：" label-width="60px">
                            <el-input placeholder="请输入" clearable v-model.trim="get_params.ip" size="small"></el-input>
                        </el-form-item>
                    </el-form>
                </el-col>
            </SearchTop>
        </div>
        <div class="list-container" style="padding-bottom: 10px">
            <div class="ub ub-pj w100 mb-1 ub-ac">
                <div class="list-tips">设备管理</div>
                <div class="ub">
                    <el-button icon="el-icon-plus" size="small" type="primary" @click="addDialog = true" v-per="['link_manage_device_add']">添加设备</el-button>
                </div>
            </div>
            <el-table
                ref="multipleTable"
                v-loading="loading"
                class='bigTable full-table'
                :data="tableData"
                :row-class-name="tableRowClassName"
                border
                stripe
                tooltip-effect="dark"
                :height="tabHeight"
                :row-style="{ height: '32px' }"
                :header-row-style="{ height: '32px' }"
                @selection-change="handleSelectionChange">
                <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                </el-table-column>
                <el-table-column prop="url" label="设备IP">
                </el-table-column>
                <el-table-column prop="port" label="端口号">
                </el-table-column>
                <el-table-column prop="appKey" label="key">
                    <template slot-scope="{row}">
                        <p>
                            <span v-if="row.flagKey">******</span>
                            <span v-else>{{row.appKey}}</span>
                            <i style="color: #387dee;cursor: pointer;float: right;margin-top: 5px" @click="row.flagKey = !row.flagKey" class="el-icon-view"></i>
                        </p>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="160">
                </el-table-column>
                <el-table-column prop="" width="100" align="center">
                    <template slot="header">
                        是否启用
                    </template>
                    <template slot-scope="{row}">
                        <div class="switch-wrapper" :class="{'yes':row.status,'no':!row.status}"  @click="deploymentEnvironment(row)">
                            <div class="ub ub-ac ub-pj" :style="{'background':row.status?'#0052d9':'#c5c5c5'}">
                                <div style="margin-left: -1px">是</div>
                                <div>否</div>
                            </div>
                            <div class="circle"></div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button @click="handleEdit(scope.row)" size="small" type="text" v-per="['link_manage_device_edit']">编辑</el-button>
                        <el-button @click="delDevice(scope.row)" size="small" type="text" v-per="['link_manage_device_del']">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="total_num>0" :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size" @pagination="get_data" style="padding-top:10px"/>
        </div>
        <!--增加内容开始-->
        <el-dialog title="添加设备" :visible.sync="addDialog" width="700px" custom-class="common-dialog">
            <el-form :model="addForm" :rules="rules" ref="addForm" :inline="true" class="unit" label-position="top">
                <el-form-item label="设备IP：" prop="ip" :label-width="formLabelWidth">
                    <el-input size="small" style="width: 652px" v-model="addForm.ip" placeholder="请输入" autocomplete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="端口号：" prop="port" :label-width="formLabelWidth">
                    <el-input size="small" style="width: 652px" v-model="addForm.port" placeholder="请输入" autocomplete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="key：" prop="appKey" :label-width="formLabelWidth">
                    <el-input size="small" style="width: 652px" v-model="addForm.appKey" placeholder="请输入" autocomplete="off" clearable></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="addDialog = false">取消</el-button>
                <el-button size="small" type="primary" @click.native="submitForm('addForm')">确认</el-button>
            </span>
        </el-dialog>
        <!--编辑内容开始-->
        <el-dialog title="编辑设备" :visible.sync="editDialog" width="700px" custom-class="common-dialog">
            <el-form :model="editForm" :rules="rules" ref="editForm" :inline="true" class="unit" label-position="top">
                <el-form-item label="设备IP：" prop="ip" :label-width="formLabelWidth">
                    <el-input size="small" style="width: 652px" v-model="editForm.ip" placeholder="请输入" autocomplete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="端口号：" prop="port" :label-width="formLabelWidth">
                    <el-input size="small" style="width: 652px" v-model="editForm.port" placeholder="请输入" autocomplete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="key：" prop="appKey" :label-width="formLabelWidth">
                    <el-input size="small" style="width: 652px" v-model="editForm.appKey" placeholder="请输入" autocomplete="off" clearable></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="editDialog = false">取消</el-button>
                <el-button size="small" type="primary" @click.native="submitFormEdit('editForm')">确认</el-button>
            </span>
        </el-dialog>
        <!--删除-->
        <DeleteDialog
            :dialogVisible="deleteDialog"
            @delete="handleDelete"
            @cancel="deleteDialog = false">
        </DeleteDialog>
    </div>
</template>

<script>
import {
    get_link_device,
    save_link_device,
    update_link_device,
    delete_link_device,
    switch_link_device_status
} from '../../server/linkage/api'
function isValidIP(ip) {
    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    return reg.test(ip)
}
export default {
    name: 'InterlockingEquipment',
    data() {
        var isIps = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入IP范围'))
            } else if (value.indexOf('\n') > -1) {
                console.log(value)
                value = value.replace(/(\r)|(\r\n)/g, '\n')
                console.log(value)
                let ips = value.split('\n')
                let _ips = []
                ips.forEach(item => {
                    if (item != '') {
                        let ips = item.split('-')
                        _ips = _ips.concat(ips)
                    }
                })
                console.log('_ips', _ips)
                if (_ips.length == 0) {
                    callback(new Error('请输入IP范围'))
                } else if (_ips.every(item => isValidIP(item))) {
                    callback()
                } else {
                    callback(new Error('IP范围格式有不正确'))
                }
            } else if (isValidIP(value)) {
                callback()
            } else {
                let ips = value.split('-')
                if (ips.every(item => isValidIP(item))) {
                    callback()
                } else {
                    callback(new Error('IP范围格式不正确'))
                }
            }
        }
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
                type: 1,
                ip: ''
            },
            res: '',
            deleteDialog: false,
            delIds: '',
            addDialog: false,
            editDialog: false,
            addForm: {
                ip: '',
                type: 1,
                appKey: '',
                appToken: '',
                port: ''
            },
            record_row: {

            },
            flag: null,
            editDeploy: {
                id: '',
                status: ''
            },
            editForm: {
                id: '',
                ip: '',
                type: 1,
                appKey: '',
                appToken: '',
                port: ''
            },
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
                    message: '请输入appKey',
                    trigger: 'blur'
                }],
                port: [{
                    required: true,
                    message: '请输入port',
                    trigger: 'blur'
                }],
                appToken: [{
                    required: true,
                    message: '请输入appToken',
                    trigger: 'blur'
                }],
                type: [{
                    required: true,
                    message: '请输入设备类型',
                    trigger: 'change'
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
    watch: {
        addDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.addForm.resetFields()
                }
            }
        },
        editDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.editForm.resetFields()
                }
            }
        }
    },
    mounted() {
        let _this = this
        document.addEventListener('visibilitychange', () => {
            if (_this.timer) {
                _this.clearSetTimer()
            }
            if (document.visibilityState == 'visible') {
                if (_this.$route.path === 'home/interlocking_equipment') {
                    _this.get_data()
                }
            }
        })
        this.clearSetTimer()
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
                type: 1,
                ip: ''
            }
            this.get_data()
        },
        clearSetTimer() {
            if (this.timer) {
                clearTimeout(this.timer)
            }
            this.timer = null
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
        deploymentEnvironment(val) {
            if (this.flag && this.record_row.id && val.id === this.record_row.id) {
                return
            }
            this.flag = setTimeout(() => {
                this.record_row = {}
                this.flag = null
            }, 1000)
            console.log(val.id, this.record_row.id)
            this.record_row = val
            this.editDeploy.id = val.id
            console.log(val.status)
            this.editDeploy.status = val.status = (val.status == 1 ? 0 : 1)
            this.submitDeployForm()
        },

        submitDeployForm(row) {
            let obj = {}
            obj.id = this.editDeploy.id
            obj.status = this.editDeploy.status
            switch_link_device_status(obj).then(res => {
                if (document.getElementsByClassName('el-message').length === 0) {
                    this.$message({
                        message: '状态修改成功',
                        type: 'success'
                    })
                }
                clearTimeout(this.listTimer)
                this.listTimer = setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(error => {
                console.log(error + 'error')
            })
        },

        searchAssets() {
            this.get_params.page = 1
            this.get_data()
        },
        get_data() {
            this.clearSetTimer()
            // LoadingBar.start();
            this.loading = true
            this.tableData = []
            let data = {
                queryData: {},
                paramsData: {
                    type: 1,
                    url: this.get_params.ip
                }
            }
            let uid = this.uinId = new Date().getTime()
            get_link_device(data).then(res => {
            // LoadingBar.finish();
                console.log(res, '查询')
                this.loading = false
                if (this.uinId === uid) {
                    this.total_num = res.total ?? 0
                    let list = res.records
                    if (list.length > 0) {
                        list.forEach(item => {
                            let obj = {}
                            obj.id = item.id
                            obj.createTime = item.createTime
                            obj.appToken = item.appToken
                            obj.appKey = item.appKey
                            obj.type = item.type
                            obj.url = item.url
                            obj.port = item.port
                            obj.status = item.status
                            obj.flagKey = true
                            obj.flagToken = true

                            this.tableData.push(obj)
                        })
                    }
                }
                this.timer = setTimeout(this.get_data, 60 * 1000)
            }).catch(error => {
            // LoadingBar.error();
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
                    type: this.addForm.type,
                    url: this.addForm.ip,
                    appKey: this.addForm.appKey,
                    port: this.addForm.port
                    // appToken: this.addForm.appToken
                }
            }
            save_link_device(data).then(res => {
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
                // this.addDialog = false
                console.log('error' + error)
            })
        },
        editDevice() {
            let data = {
                queryData: {},
                paramsData: {
                    id: this.editForm.id,
                    type: 1,
                    url: this.editForm.ip,
                    appKey: this.editForm.appKey,
                    port: this.editForm.port
                    // appToken: this.editForm.appToken
                }
            }
            update_link_device(data).then(res => {
                console.log(res)
                this.editDialog = false
                this.$message({
                    message: '修改成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(error => {
                // this.editDialog = false
                console.log('error' + error)
            })
        },
        submitFormEdit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.editDevice(false)
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        delDevice(row) {
            this.delIds = row.id
            this.deleteDialog = true
        },
        handleDelete() {
            let data = {
                queryData: {},
                paramsData: {
                    id: this.delIds
                }
            }
            delete_link_device(data).then(res => {
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
            this.editForm = {
                id: row.id,
                ip: row.url,
                port: row.port,
                type: 1,
                appKey: row.appKey,
                appToken: row.appToken
            }
            this.editDialog = true
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        }
    }
}
</script>

<style lang="scss" scoped>
.tab-button {
    height: 30px;
    background-color: rgba(19,109,172,.2);
    margin-bottom: 2px;

    & div {
        width: 80px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        margin-right: 10px;
        cursor: pointer;
        border: 1px solid #76dee2;
        border-radius: 2px;
        background: url("../../assets/img/tab_btn.jpg") 100% 100% no-repeat;
        color: #fff;
        box-sizing: border-box;
        font-size: 14px;

        &.tab-active {
            background: url("../../assets/img/tab_active.jpg") 100% 100% no-repeat;
        }
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
    background-color: #0052d9;
    border-radius: 14px;
    div{
        font-size: 12px;
        line-height: 20px;
        padding:0 8px;
    }
    >div:nth-child(1){
        color: rgba(255,255,255,0.9);
    }
    >div:nth-child(2){
        color: rgba(255,255,255,0.9);
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
        background-color: rgb(255,255,255);
        left: 1px
    }

    100% {
        background-color: rgb(255,255,255);
        left: 35px;
    }
}
@-webkit-keyframes moveone {
    0% {
        background-color: rgb(255,255,255);
        left: 1px;
    }

    100% {
        background-color: rgb(255,255,255);
        left: 35px;
    }
}
@keyframes _moveone {
    0% {
        background-color: rgb(255,255,255);
        left: 35px;
    }

    100% {
        background-color: rgb(255,255,255);
        left: 1px;
    }
}
@-webkit-keyframes _moveone {
    0% {
        background-color: rgb(255,255,255);
        left: 35px;
    }

    100% {
        background-color: rgb(255,255,255);
        left: 1px;
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
