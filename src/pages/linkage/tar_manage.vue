<template>
    <div class="list">
        <SearchTop @search="searchAssets" @reset="reset" style="border-top-left-radius:0;border-top-right-radius:0;box-shadow:none">
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params">
                    <el-form-item label="设备IP：" label-width="80px">
                        <el-input placeholder="请输入" clearable v-model.trim="get_params.ip" size="small"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
        </SearchTop>
        <div class="list-container" style="padding-bottom: 10px">
            <div class="ub ub-pj w100 mb-1 ub-ac">
                <div class="list-tips">设备管理</div>
                <div class="ub">
                    <el-button icon="el-icon-plus" @click="addDialog = true" size="small" type="primary" v-per="['link_manage_tar_add']">添加设备</el-button>
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
                <el-table-column prop="appKey" label="apiKey">
                    <template slot-scope="{row}">
                        <p>
                            <span v-if="row.flagKey">******</span>
                            <span v-else>{{row.appKey}}</span>
                            <i style="color: #387dee;cursor: pointer;float: right;margin-top: 5px" @click="row.flagKey = !row.flagKey" class="el-icon-view"></i>
                        </p>
                    </template>
                </el-table-column>
                <el-table-column prop="appToken" label="apiSecret">
                    <template slot-scope="{row}">
                        <p>
                            <span v-if="row.flagToken">******</span>
                            <span v-else>{{row.appToken}}</span>
                            <i style="color: #387dee;cursor: pointer;float: right;margin-top: 5px" @click="row.flagToken = !row.flagToken" class="el-icon-view"></i>
                        </p>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="160">
                </el-table-column>
                <el-table-column align="center" label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button @click="handleEdit(scope.row)" type="text" size="small" v-per="['link_manage_tar_edit']">编辑</el-button>
                        <el-button @click="delDevice(scope.row)" type="text" size="small" v-per="['link_manage_tar_del']">删除</el-button>
                        <el-button v-if="scope.row.status == 1" @click="receiveData(scope.row)" type="text" size="small">暂不接收</el-button>
                        <el-button v-if="scope.row.status != 1" @click="receiveData(scope.row)" type="text" size="small">接收数据</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="total_num>0" :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size" @pagination="get_data" style="padding-top:10px"/>
        </div>
        <!--增加内容开始-->
        <el-dialog title="添加设备" :visible.sync="addDialog" width="700px" custom-class="common-dialog">
            <el-form :model="addForm" :rules="rules" ref="addForm" :inline="true" class="unit" label-position="top">
                <el-form-item label="设备IP：" prop="ip">
                    <el-input size="small" style="width: 652px" v-model="addForm.ip" placeholder="请输入" autocomplete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="apiSecret：" prop="appToken">
                    <el-input size="small" style="width: 652px" v-model="addForm.appToken" placeholder="请输入" autocomplete="off">
                        <i slot="suffix" class="el-input__icon el-icon-refresh" style="cursor: pointer" @click="uuid_api_secret(addForm)"></i>
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="addDialog = false">取消</el-button>
                <el-button size="small" type="primary" @click.native="submitForm('addForm')">确认</el-button>
            </span>
        </el-dialog>
        <!--编辑内容开始-->
        <el-dialog title="编辑设备" :visible.sync="editDialog" width="700px" custom-class="common-dialog" label-position="top">
            <el-form :model="editForm" :rules="rules" ref="editForm" :inline="true" class="unit">
                <el-form-item label="设备IP：" prop="ip">
                    <el-input size="small" style="width: 652px" v-model="editForm.ip" placeholder="请输入" autocomplete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="apiSecret：" prop="appToken">
                    <el-input size="small" style="width: 652px" v-model="editForm.appToken" placeholder="请输入" autocomplete="off">
                        <i slot="suffix" class="el-input__icon el-icon-refresh" style="cursor: pointer" @click="uuid_api_secret(editForm)"></i>
                    </el-input>
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
        <!--是否接收数据-->
        <el-dialog :title="receiveName" :visible.sync="receiveDialog" width="700px" custom-class="common-dialog">
            <span>确定{{receiveName}}吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="receiveDialog = false">取消</el-button>
                <el-button size="small" type="primary" @click.native="handleReceive">确认</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {
    get_tar_link_device,
    save_tar_link_device,
    update_tar_link_device,
    delete_tar_link_device,
    switch_tar_link_device_status
} from '../../server/linkage/api'
import { uuid } from '@/assets/js/public_fun.js'
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
                type: 2,
                ip: ''
            },
            res: '',
            deleteDialog: false,
            receiveDialog: false,
            receiveName: '',
            delIds: '',
            receiveId: '',
            receiveStatus: '',
            addDialog: false,
            editDialog: false,
            addForm: {
                ip: '',
                type: 2,
                appToken: ''
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
                type: 2,
                appToken: ''
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
                appToken: [{
                    required: true,
                    message: '请输入',
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
            currentTab: '1',
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
                if (_this.$route.path === 'home/interlocking_equipment' && _this.currentTab === '1') {
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
                type: 2,
                ip: ''
            }
            this.get_data()
        },
        tabClick(val = '1') {
            if (this.currentTab === val) return
            this.currentTab = val
            if (val === '2') {
                this.clearSetTimer()
            } else {
                this.get_data()
            }
        },
        uuid_api_key(form) {
            let str = uuid(32, 16)
            form.appKey = str.toLowerCase()
        },
        uuid_api_secret(form) {
            let str = uuid(32, 16)
            form.appToken = str.toLowerCase()
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
            switch_tar_link_device_status(obj).then(res => {
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
                    type: 2,
                    url: this.get_params.ip
                }
            }
            let uid = this.uinId = new Date().getTime()
            get_tar_link_device(data).then(res => {
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
                    type: 2,
                    url: this.addForm.ip,
                    appToken: this.addForm.appToken
                }
            }
            save_tar_link_device(data).then(res => {
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
                    type: 2,
                    url: this.editForm.ip,
                    appToken: this.editForm.appToken
                }
            }
            update_tar_link_device(data).then(res => {
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
        receiveData(row) {
            this.receiveId = row.id
            this.receiveStatus = row.status === 1 ? 0 : 1
            this.receiveName = row.status === 1 ? '暂不接收数据' : '接收数据'
            this.receiveDialog = true
        },
        handleDelete() {
            let data = {
                queryData: {},
                paramsData: {
                    id: this.delIds
                }
            }
            delete_tar_link_device(data).then(res => {
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
        handleReceive() {
            let obj = {}
            obj.id = this.receiveId
            obj.status = this.receiveStatus
            switch_tar_link_device_status(obj).then(res => {
                if (document.getElementsByClassName('el-message').length === 0) {
                    this.$message({
                        message: '操作成功',
                        type: 'success'
                    })
                }
                this.receiveDialog = false
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(error => {
                this.receiveDialog = false
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
                type: 2,
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
