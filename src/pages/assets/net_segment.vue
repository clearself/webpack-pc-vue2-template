<template>
    <div class="list">
        <SearchTop @search="searchAssets" @reset="reset">
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params">
                    <el-form-item label="开始网段：" label-width="80px">
                        <el-input placeholder="请输入" clearable v-model="get_params.name1" size="small"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params">
                    <el-form-item label="结束网段：" label-width="80px">
                        <el-input placeholder="请输入" clearable v-model="get_params.name2" size="small"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
        </SearchTop>
        <div class="list-container">
            <div class="ub ub-pj w100 mb-1 ub-ac">
                <div class="list-tips">网段管理</div>
                <div>
                    <el-button icon="el-icon-plus" size="small" @click="addUser" type="primary" v-per="['assets_networkSegment_add']">添加网段</el-button>
                    <el-button style="margin-left: 10px;" size="small" icon="el-icon-delete" type="danger" @click="delAllUserBtn" v-per="['assets_networkSegment_del']">删除</el-button>
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
                <el-table-column prop="name" label="网段">
                </el-table-column>
                <el-table-column prop="borders" label="关联安全边界" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="zones" label="关联安全域" show-overflow-tooltip>
                </el-table-column>
                <el-table-column align="center" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="handleEdit(scope.row)" v-per="['assets_networkSegment_edit']">编辑</el-button>
                        <el-button type="text" size="small" @click="delUserBtn(scope.row)" v-per="['assets_networkSegment_del']">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size" @pagination="get_data" class="paginat" v-show="total_num>0"/>
        </div>
        <!--增加内容开始-->
        <el-dialog title="添加网段" :visible.sync="addDomainDialog" width="700px" custom-class="common-dialog">
            <el-form :model="netSegmentForm" :rules="netRules" ref="netSegmentForm" label-width="110px" class="demo-ruleForm addUserForm" label-position="top" >
                <el-form-item label="网段名称：" prop="name">
                    <el-input style="width:317px;" size="small" v-model.trim="netSegmentForm.name1" placeholder="请输入" autocomplete="off"></el-input>
                    -
                    <el-input style="width:317px;" size="small" v-model.trim="netSegmentForm.name2" placeholder="请输入" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="关联安全边界：" prop="borders">
                    <el-select style="width:652px;" size="small" v-model="netSegmentForm.borders" clearable placeholder="请选择" @change="changeAddBorder">
                        <el-option v-for="item in borders" :key="item.id" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="关联安全域：" prop="zones">
                    <el-select style="width:652px;" size="small" v-model="netSegmentForm.zones" clearable placeholder="请选择">
                        <el-option v-for="item in zones" :key="item.id" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDomainDialog = false" size="small">取消</el-button>
                <el-button @click="submitForm('netSegmentForm')" size="small" type="primary">确定</el-button>
            </span>
        </el-dialog>
        <!--编辑内容-->
        <el-dialog title="修改网段" :visible.sync="editUserDialog" width="700px" custom-class="common-dialog">
            <el-form :model="assetsFormEdit" :rules="netRules" ref="assetsFormEdit" label-width="110px" class="demo-ruleForm addUserForm" label-position="top">
                <el-form-item label="网段名称：" prop="name">
                    <el-input style="width:317px;" size="small" v-model.trim="assetsFormEdit.name1" placeholder="请输入" autocomplete="off"></el-input>
                    -
                    <el-input style="width:317px;" size="small" v-model.trim="assetsFormEdit.name2" placeholder="请输入" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="关联安全边界：" prop="borders">
                    <el-select style="width:652px;" size="small" v-model="assetsFormEdit.borders" clearable placeholder="请选择" @change='changeEditBorder'>
                        <el-option v-for="item in borders" :key="item.id" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="关联安全域：" prop="zones">
                    <el-select style="width:652px;" size="small" v-model="assetsFormEdit.zones" clearable placeholder="请选择">
                        <el-option v-for="item in zones" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editUserDialog = false" size="small">取消</el-button>
                <el-button @click="submitFormEdit('assetsFormEdit')" size="small" type="primary">确定</el-button>
            </span>
        </el-dialog>
        <DeleteDialog :dialogVisible="netSegDeleteDialog" @delete="handleDelete" @cancel="netSegDeleteDialog = false"></DeleteDialog>
        <DeleteDialog :dialogVisible="netSegDeleteAllDialog" @delete="handleDelete" @cancel="netSegDeleteAllDialog = false"></DeleteDialog>
    </div>
</template>

<script>
import {
    getBorder,
    getZones,
    addNetSegment,
    updateNetSegment,
    getNetSegment,
    delNetSegment
} from '../../server/assets/api.js'
import initData from '@/mixins/initData.js'
export default {
    name: 'NetSegment',
    mixins: [initData],
    data() {
        var validateNameAdd = (rule, value, callback) => {
            if (this.addDomainDialog && (this.netSegmentForm.name1 === '' || this.netSegmentForm.name2 === '')) {
                callback(new Error('请填写名称'))
            } else if (this.editUserDialog && (this.assetsFormEdit.name1 === '' || this.assetsFormEdit.name2 === '')) {
                callback(new Error('请填写名称'))
            } else {
                callback()
            }
        }
        return {
            tabHeight: document.body.clientHeight - 260,
            loading: true,
            total_num: 0,
            tableData: [],
            multipleSelection: [],
            get_params: {
                page: 1,
                size: 20,
                name1: '',
                name2: ''
            },
            netSegDeleteDialog: false,
            netSegDeleteAllDialog: false,
            delIds: [],
            addDomainDialog: false,
            editUserDialog: false,
            zones: [],
            borders: [],
            netSegmentForm: {
                name1: '',
                name2: '',
                zones: '',
                borders: ''
            },
            assetsFormEdit: {
                id: '',
                name1: '',
                name2: '',
                zones: '',
                borders: ''
            },
            rules: {
                name: [{
                    required: true,
                    message: '请输入类别名称',
                    trigger: 'blur'
                }]
            },
            netRules: {
                name: [{
                    required: true,
                    validator: validateNameAdd,
                    trigger: 'blur'
                }],
                zones: [{
                    required: true,
                    message: '请选择安全域',
                    trigger: 'change'
                }],
                borders: [{
                    required: true,
                    message: '请选择安全边界',
                    trigger: 'change'
                }]
            }
        }
    },
    watch: {
        addDomainDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.netSegmentForm.resetFields()
                }
            }
        },
        editUserDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.assetsFormEdit.resetFields()
                }
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            // this.getTypes();
            this.initBorder()
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
                name1: '',
                name2: ''
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
        changeAddBorder() {
            if (this.netSegmentForm.borders != '') {
                this.netSegmentForm.zones = ''
                this.initZone(this.netSegmentForm.borders)
            } else {
                this.netSegmentForm.zones = ''
                this.zones = []
            }
        },
        changeEditBorder() {
            if (this.assetsFormEdit.borders != '') {
                this.assetsFormEdit.zones = ''
                this.initZone(this.assetsFormEdit.borders)
            } else {
                this.assetsFormEdit.zones = ''
                this.zones = []
            }
        },
        initBorder() {
            this.users = []
            let data = {
                queryData: {},
                paramsData: {}
            }
            getBorder(data).then(res => {
                console.log('获取安全边界', res)
                if (res.length > 0) {
                    res.forEach(item => {
                        let obj = {}
                        obj.value = item.id
                        obj.label = item.name
                        this.borders.push(obj)
                    })
                }
            }).catch(error => {
                console.log('error' + error)
            })
        },
        initZone(id) {
            this.zones = []
            let data = {
                queryData: {},
                paramsData: {
                    id: id
                }
            }
            getZones(data).then(res => {
                console.log('获取安全边界', res)
                if (res.length > 0) {
                    res.forEach(item => {
                        let obj = {}
                        obj.value = item.safetyZoneId
                        obj.label = item.zoneName
                        this.zones.push(obj)
                    })
                }
            }).catch(error => {
                console.log('error' + error)
            })
        },
        get_data() {
            this.tableData = []
            let data = {
                queryData: {
                    page: this.get_params.page,
                    pageSize: this.get_params.size
                },
                paramsData: {
                    networkStart: this.get_params.name1,
                    networkEnd: this.get_params.name2
                }
            }
            getNetSegment(data).then(res => {
                console.log('获取网段分页', res)
                this.total_num = res.total
                if (res.records.length > 0) {
                    res.records.forEach(item => {
                        this.tableData.push({
                            name: item.networkStart + '-' + item.networkEnd,
                            networkEnd: item.networkEnd,
                            boundaryId: item.boundaryId,
                            createTime: item.createTime,
                            zoneId: item.zoneId,
                            networkStart: item.networkStart,
                            id: item.id,
                            zones: item.zoneName,
                            borders: item.boundaryName
                        })
                    })
                }
                this.loading = false
            }).catch(error => {
                this.loading = false
                console.log('error' + error)
            })
        },
        addUser() {
            this.addDomainDialog = true
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.addAssets()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        addAssets() {
            let data = {
                queryData: {},
                paramsData: {
                    networkStart: this.netSegmentForm.name1,
                    networkEnd: this.netSegmentForm.name2,
                    boundaryId: this.netSegmentForm.borders,
                    zoneId: this.netSegmentForm.zones
                }
            }
            addNetSegment(data).then(res => {
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
                    networkStart: this.assetsFormEdit.name1,
                    networkEnd: this.assetsFormEdit.name2,
                    boundaryId: this.assetsFormEdit.borders,
                    zoneId: this.assetsFormEdit.zones
                }
            }
            updateNetSegment(data).then(res => {
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
                    this.editAssets()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
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
        delAllUserBtn() {
            if (this.multipleSelection.length > 0) {
                this.netSegDeleteAllDialog = true
                this.delIds = this.multipleSelection
            } else {
                this.$message({
                    message: '请选择要删除的类别名称',
                    type: 'warning'
                })
            }
        },
        delUserBtn(row) {
            this.delIds = [row.id]
            this.netSegDeleteDialog = true
        },
        handleDelete() {
            let data = {
                queryData: {
                },
                paramsData: {
                    ids: this.delIds
                }
            }
            delNetSegment(data).then(res => {
                this.netSegDeleteDialog = false
                this.netSegDeleteAllDialog = false
                console.log('删除成功')
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(error => {
                this.netSegDeleteDialog = false
                this.netSegDeleteAllDialog = false
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
            this.editUserDialog = true
            this.assetsFormEdit = {
                id: row.id,
                name1: row.networkStart,
                name2: row.networkEnd,
                zones: row.zoneId,
                borders: row.boundaryId
            }
            this.initZone(this.assetsFormEdit.borders)
        }
    }
}
</script>

<style lang="scss" scoped>
    .paginat {
        padding-top:10px;
    }
    .el-input.ips {
        display: block;
        width: 100%;
    }
</style>
