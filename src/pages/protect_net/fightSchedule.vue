<template>
    <div class="list">
        <div class="ub w100" style="box-sizing: border-box;">
            <SearchTop @search="searchAssets" @reset="reset">
                <el-col :md="12" :lg="8" :xl="6">
                    <el-form :model="get_params">
                        <el-form-item label="值班时间：" class="date-close" label-width="85px">
                            <el-date-picker style="width:100%;" clearable size="small" prefix-icon value-format="yyyy-MM-dd HH:mm:ss" v-model="sayTimes" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :md="12" :lg="8" :xl="6">
                    <el-form :model="get_params">
                        <el-form-item label="值班经理：" label-width="85px">
                            <el-input placeholder="请输入" clearable v-model="get_params.manageName" @keyup.enter.native="searchCheck" size="small"></el-input></el-form-item>
                    </el-form>
                </el-col>
                <el-col :md="12" :lg="8" :xl="6">
                    <el-form :model="get_params">
                        <el-form-item label="值班人员：" label-width="85px">
                            <el-input placeholder="请输入" clearable v-model="get_params.userName" @keyup.enter.native="searchCheck" size="small"></el-input></el-form-item>
                    </el-form>
                </el-col>
            </SearchTop>
        </div>
        <div class="list-container">
            <div class="ub ub-pj w100 mb-1">
                <div class="list-tips">排班列表</div>
                <div class="ub">
                    <el-button icon="el-icon-plus" size="small"  v-per="['protective_wfm_add']" type="primary" @click="addUserDialog = true">添加人员</el-button>
                    <el-button style="margin-left: 10px;" icon="el-icon-delete"  v-per="['protective_wfm_del']" size="small" type="danger" @click="deleteAll">删 除</el-button>
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
                :height="tableHeight"
                @selection-change="handleSelectionChange">
                <el-table-column align="center" type="selection" width="50">
                </el-table-column>
                <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                </el-table-column>
                <el-table-column label="值班时间" width="400">
                    <template slot-scope="scope">
                        <span>{{scope.row.beginTime}} - {{scope.row.endTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="managerName" label="值班经理" width="120">
                </el-table-column>
                <el-table-column label="值班人员">
                    <template slot-scope="scope">
                        <div>
                            <span class="table-schedue" v-for="(item, index) in scope.row.linkList" :key="index">
                                {{item.userName}}
                                <span v-if="item.post == 0">{{'-现场指挥'}}</span>
                                <span v-if="item.post == 1">{{'-主管决策层'}}</span>
                                <span v-if="item.post == 2">{{'-监控'}}</span>
                                <span v-if="item.post == 3">{{'-分析'}}</span>
                                <span v-if="item.post == 4">{{'-处置'}}</span>
                                <span v-if="item.post == 5">{{'-溯源'}}</span>
                                <span v-if="index != scope.row.linkList.length -1 ">、</span>
                            </span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" v-per="['protective_wfm_edit']" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button size="small" type="text" v-per="['protective_wfm_del']" @click="delUserBtn(scope.row)">删除</el-button>
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
        <el-dialog title="添加人员" :visible.sync="addUserDialog" width="700px" custom-class="common-dialog">
            <el-form :model="addUserForm" ref="addUserForm" :rules="rules" label-position="top">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="开始时间：" prop="beginTime" :label-width="formLabelWidth">
                            <el-date-picker
                                v-model="addUserForm.beginTime"
                                type="datetime"
                                size="small"
                                style="width: 100%"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择日期时间">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="结束时间：" prop="endTime" :label-width="formLabelWidth">
                            <el-date-picker
                                v-model="addUserForm.endTime"
                                type="datetime"
                                size="small"
                                style="width: 100%"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择日期时间">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="值班经理：" prop="manager" :label-width="formLabelWidth" style="margin: 10px 0 20px;">
                    <el-select v-model="addUserForm.manager" placeholder="请选择人员" size="small" style="width: 100%;" filterable>
                        <el-option
                            v-for="item in allUserList"
                            :key="item.id"
                            :label="item.chineseName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="添加联系人：" :label-width="formLabelWidth" style="width: 100%;position: relative">
                    <span style="position: absolute;top: -33px; right: 3px;color: #387dee">
                        <i class="el-icon-plus white-color-text" @click="addUserTable" style="font-size: 12px;cursor: pointer">添加</i>
                    </span>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth" style="width: 100%;position: relative">
                    <el-table
                        ref="multipleTable"
                        class='bigTable'
                        :data="addUserForm.list"
                        border
                        stripe
                        :row-class-name="tableRowClassName"
                        :row-style="{ height: '32px' }"
                        :header-row-style="{ height: '32px' }"
                        tooltip-effect="dark"
                        style="min-height: 100px">
                        <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                        </el-table-column>
                        <el-table-column label="值班人员" prop="userId">
                            <template slot-scope="{$index}">
                                <el-select v-model="addUserForm.list[$index].userId" filterable placeholder="请选择值班人员" style="width: 100%;" size="mini">
                                    <el-option
                                        v-for="item in allUserList"
                                        :key="item.id + 1"
                                        :label="item.chineseName"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column label="值班岗位" prop="post">
                            <template slot-scope="{$index}">
                                <el-select v-model="addUserForm.list[$index].post" filterable placeholder="请选择值班岗位" style="width: 100%;" size="mini">
                                    <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="操作" width="60">
                            <template slot-scope="{row, colum, $index}">
                                <i class="el-icon-remove-outline" style="color: red;cursor: pointer" @click="delAddUserTable($index)"></i>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" @click="submitForm('addUserForm')">确 定</el-button>
                <el-button size="small" @click="addUserDialog = false">取 消</el-button>
            </span>
        </el-dialog>
        <!--编辑人员-->
        <el-dialog title="编辑人员" :visible.sync="editUserDialog" width="700px" custom-class="common-dialog">
            <el-form :model="editUserForm" ref="editUserForm" :rules="rules" label-position="top">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="开始时间：" prop="beginTime" :label-width="formLabelWidth">
                            <el-date-picker
                                v-model="editUserForm.beginTime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                type="datetime"
                                style="width: 100%"
                                size="small"
                                format
                                placeholder="选择日期时间">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="结束时间：" prop="endTime" :label-width="formLabelWidth">
                            <el-date-picker
                                v-model="editUserForm.endTime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                type="datetime"
                                style="width: 100%"
                                size="small"
                                format
                                placeholder="选择日期时间">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="值班经理：" prop="manager" :label-width="formLabelWidth" style="margin: 10px 0 20px;">
                    <el-select v-model="editUserForm.manager" placeholder="请选择人员" size="small" style="width: 100%;" filterable>
                        <el-option
                            v-for="item in allUserList"
                            :key="item.id"
                            :label="item.chineseName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="添加联系人：" :label-width="formLabelWidth" style="width: 100%;position: relative">
                    <span style="position: absolute;top: -33px; right: 3px;color: #387dee">
                        <i class="el-icon-plus white-color-text" @click="editUserTable" style="font-size: 12px;cursor: pointer">添加</i>
                    </span>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth" style="width: 100%;position: relative">
                    <el-table
                        ref="multipleTable"
                        class='bigTable'
                        :data="editUserForm.list"
                        border
                        stripe
                        :row-class-name="tableRowClassName"
                        :row-style="{ height: '32px' }"
                        :header-row-style="{ height: '32px' }"
                        tooltip-effect="dark"
                        style="min-height: 100px">
                        <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                        </el-table-column>
                        <el-table-column label="值班人员" prop="userId">
                            <template slot-scope="{$index}">
                                <el-select v-model="editUserForm.list[$index].userId" filterable placeholder="请选择值班人员" style="width: 100%;" size="mini">
                                    <el-option
                                        v-for="item in allUserList"
                                        :key="item.id + 1"
                                        :label="item.chineseName"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column label="值班岗位" prop="post">
                            <template slot-scope="{$index}">
                                <el-select v-model="editUserForm.list[$index].post" filterable placeholder="请选择值班岗位" style="width: 100%;" size="mini">
                                    <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="操作" width="60">
                            <template slot-scope="{row, colum, $index}">
                                <i class="el-icon-remove-outline" style="color: red;cursor: pointer" @click="delEditUserTable($index)"></i>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" @click="submitFormEdit('editUserForm')">确 定</el-button>
                <el-button size="small" @click="editUserDialog = false">取 消</el-button>
            </span>
        </el-dialog>

        <!--删除-->
        <DeleteDialog
            :dialogVisible="userDeleteDialog"
            @delete="handleDelete"
            @cancel="userDeleteDialog = false">
        </DeleteDialog>
        <DeleteDialog
            :dialogVisible="userDeleteAllDialog"
            @delete="handleDeleteAll"
            @cancel="userDeleteAllDialog = false">
        </DeleteDialog>
        <!-- <el-dialog title="删除安全设备" :visible.sync="userDeleteDialog" width="30%" custom-class="attendance-dialog">
            <span>确定删除吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" @click="handleDelete">确 定</el-button>
                <el-button size="small" @click="userDeleteDialog = false">取 消</el-button>
            </span>
        </el-dialog>
        <el-dialog title="删除安全设备" :visible.sync="userDeleteAllDialog" width="30%" custom-class="attendance-dialog">
            <span>确定删除吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" @click="handleDeleteAll">确 定</el-button>
                <el-button size="small" @click="userDeleteAllDialog = false">取 消</el-button>
            </span>
        </el-dialog> -->
    </div>
</template>

<script>
import {
    get_fightSchedule_data,
    add_userTable,
    del_userTable,
    get_allUser,
    del_muti_usertable
} from '../../server/protect_net/api.js'

export default {
    name: 'FightSchedule',
    data() {
        return {
            tableHeight: document.body.clientHeight - 260,
            userDeleteAllDialog: false,
            formLabelWidth: '100px',
            loading: false,
            total_num: 0,
            tableData: [],
            multipleSelection: [],
            sayTimes: [],
            get_params: {
                page: 1,
                size: 20,
                manageName: '',
                userName: ''
            },
            addUserForm: {
                beginTime: '',
                endTime: '',
                manager: '',
                list: [
                    // {
                    //   userId: '',
                    //   post: ''
                    // }
                ]
            },
            editUserForm: {
                id: '',
                beginTime: '',
                endTime: '',
                manager: '',
                list: [
                    // {
                    //   userId: '',
                    //   post: ''
                    // }
                ],
                recordList: []
            },
            options: [
                {
                    label: '现场指挥',
                    value: 0
                }, {
                    label: '主管决策层',
                    value: 1
                }, {
                    label: '监控',
                    value: 2
                }, {
                    label: '分析',
                    value: 3
                }, {
                    label: '处置',
                    value: 4
                }, {
                    label: '溯源',
                    value: 5
                }
            ],
            allUserList: [],
            userDeleteDialog: false,
            delIds: '',
            addUserDialog: false,
            editUserDialog: false,
            deviceForm: {
                device_name: '',
                ip: '',
                index_name: ''
            },
            deviceFormEdit: {
                id: '',
                device_name: '',
                ip: '',
                index_name: ''
            },
            rules: {
                manager: [{
                    required: true,
                    message: '请选择值班经理',
                    trigger: 'change'
                }]
            }
        }
    },
    watch: {
        addUserDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.addUserForm.resetFields()
                    this.addUserForm.list = []
                }
            }
        },
        editUserDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.editUserForm.resetFields()
                }
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.get_data()
            this.get_allUser_data()
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
            this.sayTimes = []
            this.get_params = {
                page: 1,
                size: 20,
                manageName: '',
                userName: ''
            }
            this.get_data()
        },
        get_allUser_data() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_allUser(data).then(res => {
                console.log(res)
                this.allUserList = res
            }).catch(err => {
                console.log(err + 'err')
            })
        },
        deleteAll() {
            if (this.multipleSelection.length == 0) {
                this.$message({
                    message: '请先选择删除项',
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
            this.loading = true
            this.tableData = []
            let page = this.get_params.page
            let pageSize = this.get_params.size
            let data = {
                beginTime: this.sayTimes && this.sayTimes.length > 0 ? this.sayTimes[0] : '',
                endTime: this.sayTimes && this.sayTimes.length > 0 ? this.sayTimes[1] : '',
                manageName: this.get_params.manageName,
                userName: this.get_params.userName
            }
            get_fightSchedule_data(data, page, pageSize).then(res => {
                console.log(res)
                this.loading = false
                this.total_num = res.total
                let list = res.records
                if (list.length > 0) {
                    list.forEach(item => {
                        let obj = {}
                        obj.id = item.id
                        obj.manager = item.manager
                        obj.managerName = item.managerName
                        obj.beginTime = item.beginTime
                        obj.endTime = item.endTime
                        obj.linkList = item.linkList
                        this.tableData.push(obj)
                    })
                }
            }).catch(error => {
                this.loading = false
                console.log('error' + error)
            })
        },
        addUser() {
            this.addUserDialog = true
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
            if (!this.addUserForm.beginTime || !this.addUserForm.endTime || this.addUserForm.beginTime >= this.addUserForm.endTime) {
                this.$message({
                    message: '请输入正确的时间格式',
                    type: 'warning'
                })
                return
            }
            let data = {
                manager: this.addUserForm.manager,
                beginTime: this.addUserForm.beginTime,
                endTime: this.addUserForm.endTime,
                linkList: this.addUserForm.list
            }
            add_userTable(data).then(res => {
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
            if (!this.editUserForm.beginTime || !this.editUserForm.endTime || this.editUserForm.beginTime >= this.editUserForm.endTime) {
                this.$message({
                    message: '请输入正确的时间格式',
                    type: 'warning'
                })
                return
            }
            let data = {
                id: this.editUserForm.id,
                manager: this.editUserForm.manager,
                beginTime: this.editUserForm.beginTime,
                endTime: this.editUserForm.endTime,
                linkList: this.editUserForm.list
            }
            add_userTable(data).then(res => {
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
                id: this.delIds
            }
            del_userTable(data).then(res => {
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
        handleDeleteAll() {
            let obj = {
                ids: []
            }
            this.multipleSelection.map(item => {
                obj.ids.push(item.id)
            })

            del_muti_usertable(obj).then(res => {
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
            // eslint-disable-next-line no-unused-expressions
            this.editUserForm = {
                id: row.id,
                beginTime: row.beginTime,
                endTime: row.endTime,
                manager: row.manager,
                list: JSON.parse(JSON.stringify(row.linkList)),
                recordList: JSON.parse(JSON.stringify(row.linkList))
            }
            this.editUserDialog = true
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        },

        addUserTable() {
            let obj = {
                userId: '',
                post: ''
            }
            this.$nextTick(() => {
                this.addUserForm.list.push(obj)
            })
        },
        delAddUserTable(index) {
            this.addUserForm.list.splice(index, 1)
        },

        editUserTable() {
            let obj = {
                userId: '',
                post: ''
            }
            // console.log(this.editUserForm.list)
            this.editUserForm.list.push(obj)
        },
        delEditUserTable(index) {
            this.editUserForm.list.splice(index, 1)
        }

    }
}
</script>

    <style lang="scss" scoped>
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
