<template>
    <div class="event event-wrapper reporting_platform" style="min-height:auto!important;">
        <div class="ub w100" style="box-sizing: border-box;">
            <SearchTop @search="searchData" @reset="reset">
                <el-col :md="12" :lg="8" :xl="6">
                    <el-form :model="get_params">
                        <el-form-item label="IP搜索：" label-width="85px">
                            <el-input size="small" clearable placeholder="请输入" v-model.trim="get_params.content"></el-input>
                        </el-form-item>
                    </el-form>
                </el-col>
            </SearchTop>
        </div>
        <div class="list-container">
            <div class="ub ub-pj w100 mb-1">
                <div class="list-tips">分支机构</div>
                <div>
                    <el-button size="small" icon="el-icon-plus" type="primary" @click="branchesDialog = true">添加数据</el-button>
                </div>
            </div>
            <el-table
                ref="multipleTable"
                v-loading="listLoading"
                class='bigTable'
                :data="tableData"
                border
                stripe
                tooltip-effect="dark"
                :row-class-name="tableRowClassName"
                @selection-change="handleSelectionChange"
                :height="tableHeight"
                :row-style="{ height: '32px' }"
                :header-row-style="{ height: '32px' }">
                <!--<el-table-column align="center" type="selection" :reserve-selection="true" width="50"></el-table-column>-->
                <el-table-column align="center" type="index" width="50" label="序号" :index="indexMethod">
                </el-table-column>
                <el-table-column prop="typeCN" label="匹配方式" width="100">
                </el-table-column>
                <el-table-column prop="orgName" label="分支机构名称">
                </el-table-column>
                <el-table-column prop="province_city" label="所属地域">
                </el-table-column>
                <el-table-column label="IP范围">
                    <template slot-scope="scope">
                        <div>
                            <div v-for="(item,index) in scope.row.content_ip" :key="index">{{item}}</div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="120" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button type="text" size="small" @click="handleDel(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-if="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

        </div>
        <el-dialog title="添加机构" width="800px" :visible.sync="branchesDialog" custom-class="custom-dialog">
            <el-form :model="branchesForm" ref="branchesForm" :rules="rules" label-position="top" class="unit">
                <el-row :gutter="40">
                    <el-col :span="12">
                        <el-form-item style="width:100%;" label="数据匹配方式：" prop="type" label-width="130px">
                            <el-select clearable size="small" v-model.trim="branchesForm.type" placeholder="请选择">
                                <el-option label="IP匹配" value="1"></el-option>
                                <el-option label="定值" value="0"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item style="width:100%;" label="所属区域：" prop="provinceCode" label-width="130px">
                            <el-select clearable size="small" v-model.trim="branchesForm.provinceCode" placeholder="请选择"  @change="changeAreas">
                                <el-option v-for="item in areas" :key="item.id" :label="item.name" :value="item.code">
                                </el-option>
                            </el-select>
                            <el-select clearable size="small" v-model.trim="branchesForm.cityCode" placeholder="请选择">
                                <el-option v-for="item in citys" :key="item.id" :label="item.name" :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="40">
                    <el-col :span="12">
                        <el-form-item style="width:40%;" label="分支机构名称：" prop="orgName" label-width="130px">
                            <el-input size="small" placeholder="请输入" v-model.trim="branchesForm.orgName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="branchesForm.type==1">
                        <el-form-item  style="width:58%;" label="" prop="content" label-width="130px">
                            <span slot="label">IP范围：<el-tooltip placement="top">
                                <div slot="content">示例：<br/>
                                    单个IP范围:<br/>
                                    192.168.1.123<br/>
                                    或<br/>
                                    192.168.1.123-192.168.1.223<br/>
                                    多个IP范围:<br/>
                                    192.168.1.123-192.168.1.178<br/>
                                    192.168.1.189-192.168.1.223</div>
                                <i class="el-icon-info" style="color:#409eff;font-size:13px;"></i>
                            </el-tooltip></span>
                            <el-input type="textarea" :rows="4" :cols="37" size="small" placeholder="请输入" v-model="branchesForm.content"></el-input>

                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form>
            <div slot="footer" class="ub ub-pe dialog-footer">
                <el-button size="small" @click="branchesDialog = false">取 消</el-button>
                <el-button size="small" type="primary" @click="validAdd('branchesForm')">确 认</el-button>
            </div>
        </el-dialog>
        <el-dialog title="编辑机构" width="800px" :visible.sync="branchesDialogEdit" custom-class="custom-dialog">
            <el-form :model="branchesFormEdit" ref="branchesFormEdit" :rules="rules"  label-position="top" class="unit">
                <el-row :gutter="40">
                    <el-col :span="12">
                        <el-form-item style="width:100%;" label="数据匹配方式：" prop="type" label-width="130px">
                            <el-select clearable size="small" v-model.trim="branchesFormEdit.type" placeholder="请选择">
                                <el-option label="IP匹配" value="1"></el-option>
                                <el-option label="定值" value="0"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item style="width:100%;" label="所属区域：" prop="provinceCode" label-width="130px">
                            <el-select clearable size="small" v-model.trim="branchesFormEdit.provinceCode" placeholder="请选择"  @change="changeAreas">
                                <el-option v-for="item in areas" :key="item.id" :label="item.name" :value="item.code">
                                </el-option>
                            </el-select>
                            <el-select clearable size="small" v-model.trim="branchesFormEdit.cityCode" placeholder="请选择">
                                <el-option v-for="item in citys" :key="item.id" :label="item.name" :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="40">
                    <el-col :span="12">
                        <el-form-item style="width:40%;" label="分支机构名称：" prop="orgName" label-width="130px">
                            <el-input size="small" placeholder="请输入" v-model.trim="branchesFormEdit.orgName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="branchesFormEdit.type==1">
                        <el-form-item  style="width:58%;" label="IP范围：" prop="content" label-width="130px">
                            <el-input type="textarea" :rows="4" :cols="37" size="small" placeholder="请输入" v-model="branchesFormEdit.content"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="ub ub-pe dialog-footer">
                <el-button size="small" @click="branchesDialogEdit = false">取 消</el-button>
                <el-button size="small" type="primary" @click="validSaveEdit('branchesFormEdit')">确 认</el-button>
            </div>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="delDialog" width="30%" custom-class="attendance-dialog">
            <span>确定删除吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="delDialog = false">取 消</el-button>
                <el-button size="small" type="primary" @click="delConfim">确 认</el-button>
            </span>
        </el-dialog>
    </div>

</template>

<script>
import {
    add_branches,
    get_branches_list,
    delete_branches,
    get_branch_city
} from '@/server/reporting_platform/setting.js'
import initData from '@/mixins/initData.js'
function isValidIP(ip) {
    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    return reg.test(ip)
}
export default {
    name: 'Branches',
    mixins: [initData],
    data() {
        var isIp = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入发件人源地址'))
            } else if (isValidIP(value)) {
                callback()
            } else {
                callback(new Error('发件人源地址格式不正确'))
            }
        }
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
            tableHeight: document.body.clientHeight - 350,
            reportAllDialog: false,
            reportids: [],
            institution_branch_area: [],
            areas: [],
            citys: [],
            areasProps: {
                label: 'name',
                value: 'id',
                children: 'sub'
            },
            reportId: '',
            reportDialog: false,
            branchesFormEdit: {
                id: '',
                type: '',
                orgName: '',
                content: '',
                provinceCode: '',
                cityCode: ''
            },
            branchesDialogEdit: false,
            deleteId: '',
            delAllDialog: false,
            delDialog: false,
            branchesDialog: false,
            branchesForm: {
                type: '',
                orgName: '',
                content: '',
                provinceCode: '',
                cityCode: ''
            },
            rules: {
                content: [{
                    required: true,
                    validator: isIps,
                    trigger: 'blur'
                }],
                orgName: [{
                    required: true,
                    message: '请输入分支机构名称',
                    trigger: 'blur'
                }],
                type: [{
                    required: true,
                    message: '请选择数据匹配方式',
                    trigger: 'change'
                }],
                provinceCode: [{
                    required: true,
                    message: '请选择所属区域',
                    trigger: 'change'
                }]
            },
            isOpen: false,
            pickerOptions2: {
                disabledDate(time) {
                    return time.getTime() > Date.now()
                },
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                        picker.$emit('pick', [start, end])
                    }
                }]
            },
            formLabelWidth: '110px',
            types: [],
            search_time: null,
            total_num: 0,
            loading: false,
            get_params: {
                content: ''
            },
            tableData: [],
            multipleSelection: []
        }
    },
    watch: {
        branchesDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.branchesForm.resetFields()
                    for (let attr in this.branchesForm) {
                        this.branchesForm[attr] = ''
                    }
                }
            }
        },
        branchesDialogEdit: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.branchesFormEdit.resetFields()
                }
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.getBranchAreas()
            this.getList()
        })
    },
    methods: {
        reset() {
            this.get_params.content = ''
            this.listQuery.page = 1
            this.getList()
        },
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex % 2) {
                return 'table-row2'
            } else {
                return 'table-row1'
            }
        },
        changeAreas(val) {
            console.log(val)
            let selectCity = this.areas.filter(item => item.code == val)
            console.log(selectCity)
            this.branchesForm.cityCode = ''
            if (selectCity.length > 0) {
                this.citys = this.$deepCopy(selectCity[0].sub)
            } else {
                this.citys = []
            }
        },
        changeAreasEdit(val) {
            console.log(val)
            if (val.sub) {
                this.citys = this.$deepCopy(val.sub)
            } else {
                this.citys = []
            }
        },
        getBranchAreas() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_branch_city(data).then(res => {
                console.log('所属区域', res)
                if (res.length > 0) {
                    this.areas = res
                }
            }).catch(error => {
                console.log('error', error)
            })
        },
        beforeUpLoad() {
            this.up_loading = this.$loading({
                lock: true,
                text: '上传中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })
        },
        upLoadExcle(res) {
            this.up_loading.close()
            if (res.code == 1) {
                this.getList()
            } else if (res.code == 2) { // 请求成功但流程不对
                this.$message({
                    message: res.message,
                    type: 'warning'
                })
            } else if (res.code == 9999) {
                this.$setsessionStorage('errorInfo', res.message)
                this.$router.push('/error')
            } else if (res.code == 9005) {
                this.$message({
                    message: '登录已失效，请重新登录！',
                    type: 'warning'
                })
            } else {
                this.$message({
                    message: res.message,
                    type: 'warning'
                })
            }
        },
        // eslint-disable-next-line handle-callback-err
        upLoadError(error) {
            this.up_loading.close()
        },
        getList() {
            this.tableData = []
            this.listLoading = true
            let data = {
                queryData: {
                    page: this.listQuery.page,
                    pageSize: this.listQuery.limit
                },
                paramsData: {
                    content: this.get_params.content
                }
            }
            get_branches_list(data).then(res => {
                console.log('分支机构列表', res)
                this.listLoading = false
                this.total = res.total
                let list = res.records
                if (list.length > 0) {
                    list.forEach(item => {
                        let obj = {}
                        obj.id = item.id
                        obj.type = item.type
                        obj.orgName = item.orgName
                        if (item.type == 1) {
                            obj.typeCN = 'IP匹配'
                        } else {
                            obj.typeCN = '定值'
                        }
                        obj.content = item.content
                        obj.content_ip = item.content ? item.content.split('\n') : []
                        obj.cityCodeCN = item.cityCodeCN
                        obj.provinceCodeCN = item.provinceCodeCN
                        obj.province_city = item.provinceCodeCN + ' ' + item.cityCodeCN
                        obj.provinceCode = item.provinceCode
                        obj.cityCode = item.cityCode
                        this.tableData.push(obj)
                    })
                }
            }).catch(error => {
                this.listLoading = false
                console.log('error', error)
            })
        },

        indexMethod(index) {
            return (this.listQuery.page - 1) * this.listQuery.limit + index + 1
        },
        searchData() {
            this.listQuery.page = 1
            this.getList()
        },

        handleDelAll() {
            if (this.multipleSelection.length > 0) {
                this.delAllDialog = true
            } else {
                this.$message({
                    message: '请选择要删除的数据！',
                    type: 'warning'
                })
            }
        },
        handleDel(obj) {
            this.delDialog = true
            this.deleteId = obj.id
        },
        delConfim() {
            let data = {
                queryData: {},
                paramsData: {
                    id: this.deleteId
                }
            }
            delete_branches(data).then(res => {
                this.delDialog = false
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.getList()
                }, 1500)
            }).catch(error => {
                this.delDialog = false
                console.log('error', error)
            })
        },

        validAdd(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.addData()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        addData() {
            let data = {
                queryData: {},
                paramsData: {
                    type: this.branchesForm.type,
                    orgName: this.branchesForm.orgName,
                    provinceCode: this.branchesForm.provinceCode,
                    cityCode: this.branchesForm.cityCode
                }
            }
            if (this.branchesForm.type == 1) {
                data.paramsData.content = this.branchesForm.content
            } else {
                data.paramsData.content = ''
            }
            console.log(data)
            add_branches(data).then(res => {
                this.branchesDialog = false
                this.$message({
                    message: '添加成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.getList()
                }, 1500)
            }).catch(error => {
                console.log('error', error)
            })
        },
        editData() {
            let data = {
                queryData: {},
                paramsData: {
                    id: this.branchesFormEdit.id,
                    type: this.branchesFormEdit.type,
                    orgName: this.branchesFormEdit.orgName,
                    provinceCode: this.branchesFormEdit.provinceCode,
                    cityCode: this.branchesFormEdit.cityCode
                }
            }
            if (this.branchesFormEdit.type == 1) {
                data.paramsData.content = this.branchesFormEdit.content
            } else {
                data.paramsData.content = ''
            }
            console.log(data)
            add_branches(data).then(res => {
                this.branchesDialogEdit = false
                this.$message({
                    message: '修改成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.getList()
                }, 1500)
            }).catch(error => {
                console.log('error', error)
            })
        },
        handleEdit(obj) {
            console.log(obj)
            this.branchesDialogEdit = true
            this.branchesFormEdit = {
                id: obj.id,
                type: obj.type + '',
                orgName: obj.orgName,
                content: '',
                provinceCode: obj.provinceCode,
                cityCode: obj.cityCode
            }
            if (obj.type == 1) {
                this.branchesFormEdit.content = obj.content
            }

            this.areas.forEach(item => {
                if (obj.provinceCode == item.code) {
                    this.citys = this.$deepCopy(item.sub)
                }
            })
        },
        validSaveEdit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.editData()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        handleSelectionChange(val) {
            console.log(val)
            this.multipleSelection = val
        }
    }
}
</script>

<style lang="scss" scoped>
.upload-demo {
    display: inline-block;
    margin: 0 10px;
}

/* .upload-demo ::v-deep .el-button--primary {
    background-color: rgba(0, 0, 0, 0);
    border-color: rgba(0, 0, 0, 0);
    background-image: url(../../assets/img/XZWJ.png);
    background-position: 0 0;
    background-repeat: no-repeat;
    background-size: 100% 100%;
} */

.event ::v-deep .el-input-group__append,
.event ::v-deep .el-input-group__prepend {
    background-color: rgba(0, 0, 0, 0);
    color: #1cd7fa;
    border: 1px solid #1cd7fa;
    border-left: 0;
}

.upload-demo ::v-deep a,
.upload-demo ::v-deep i {
    color: #1cd7fa;
}

.upload-demo ::v-deep .el-upload-list__item:hover {
    background-color: rgba(0, 0, 0, 0);
}

</style>
