<template>
    <div class="list">
        <SearchTop @search="searchAssets" @reset="reset">
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params">
                    <el-form-item label="队伍名称：" label-width="90px">
                        <el-input placeholder="请输入" style="width: 100%" clearable v-model.trim="get_params.name" @keyup.enter.native="searchAssets" size="small"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
        </SearchTop>
        <div class="list-container">
            <div class="ub ub-pj w100 mb-1">
                <div class="list-tips">团队管理
                    <!-- <div style="display: inline-block;font-size:12px;color:#387dee;cursor: pointer;margin-left: 12px;" @click="back">
                        <i style="margin-right: 6px;" class="fa fa-mail-reply" aria-hidden="true"></i>
                        返回
                    </div> -->
                </div>
                <div class="ub">
                    <el-button icon="iconfont icon-fanhui" size="small" @click="back">返回</el-button>
                    <el-button icon="el-icon-plus" size="small" type="primary" v-per="['protective_legend_add']" @click="addTeamDialog = true">添加图例</el-button>
                </div>
            </div>
            <!--@selection-change="handleSelectionChange"-->
            <el-table
                ref="multipleTable"
                v-loading="loading"
                class='bigTable full-table'
                :data="tableData"
                border
                stripe
                :height="tableHeight"
                :row-class-name="tableRowClassName"
                tooltip-effect="dark">
                <!--<el-table-column type="selection" width="55">
        </el-table-column>-->
                <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                </el-table-column>
                <el-table-column prop="name" label="图例名称">
                </el-table-column>
                <el-table-column prop="type_name" label="类型">
                </el-table-column>
                <el-table-column align="center" label="颜色" width="150">
                    <template slot-scope="scope">
                        <div class="team-color" :style="{backgroundColor:scope.row.color}"></div>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" @click="handleEdit(scope.row)"  v-per="['protective_legend_edit']">编辑</el-button>
                        <el-button size="mini" type="text" @click="delBtn(scope.row)"  v-per="['protective_legend_del']">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <!-- <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="get_params.page" :page-sizes="[10, 20, 30, 40,50]" :page-size="get_params.size" layout="total, sizes, prev, pager, next" prev-text="上一页" next-text="下一页" :total="total_num">
                </el-pagination> -->
                <pagination
                    :total="total_num"
                    :page.sync="get_params.page"
                    :limit.sync="get_params.size"
                    @pagination="get_data"
                    style="padding-top:10px"
                    v-show="total_num>0"/>
            </div>
            <!--</div>
    </div>-->
        </div>
        <!--添加图例-->
        <el-dialog title="添加图例" :visible.sync="addTeamDialog" width="700px" custom-class="common-dialog">
            <el-form :model="addTeamForm"  :rules="rules" ref="addTeamForm" label-position="top">
                <el-form-item label="图例名称：" prop="name" :label-width="formLabelWidth">
                    <el-input style="width:100%" placeholder="请输入" clearable v-model.trim="addTeamForm.name" size="small"></el-input>
                </el-form-item>
                <el-form-item label="类型选择：" prop="type" :label-width="formLabelWidth">
                    <el-select style="width:100%;" size="small" clearable v-model="addTeamForm.type" filterable placeholder="请选择">
                        <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="颜色选择：" prop="type" :label-width="formLabelWidth">
                    <div class="color-box">
                        <div @click="openColor" class="color-inner-box" :style="{backgroundColor:colorBg}">
                            <i :class="{'el-icon-arrow-up':!isUp,'el-icon-arrow-down':isUp}"></i>
                        </div>
                        <div v-if="!isUp" class="colors-box">
                            <div v-for="(item,index) in colors" :key="index" :style="{backgroundColor:item.value}" @click="handelColor(item)">
                                <i :class="{'el-icon-check':item.isActive}"></i>
                            </div>
                        </div>
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" @click="submitForm('addTeamForm')">确 定</el-button>
                <el-button size="small" @click="addTeamDialog = false">取 消</el-button>
            </span>
        </el-dialog>

        <!--编辑图例-->
        <el-dialog title="编辑图例" :visible.sync="editTeamDialog" width="700px" custom-class="common-dialog">
            <el-form :model="editTeamForm"  :rules="rules" ref="editTeamForm" label-position="top">
                <el-form-item label="图例名称：" prop="name" :label-width="formLabelWidth">
                    <el-input style="width:100%" placeholder="请输入" clearable v-model.trim="editTeamForm.name" size="small"></el-input>
                </el-form-item>
                <el-form-item label="类型选择：" prop="type" :label-width="formLabelWidth">
                    <el-select style="width:100%;" size="small" clearable v-model="editTeamForm.type" filterable placeholder="请选择">
                        <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="颜色选择：" prop="type" :label-width="formLabelWidth">
                    <div class="color-box">
                        <div @click="openColorEdit" class="color-inner-box" :style="{backgroundColor:colorBgEdit}">
                            <i :class="{'el-icon-arrow-up':isUpEdit,'el-icon-arrow-down':!isUpEdit}"></i>
                        </div>
                        <div v-if="!isUpEdit" class="colors-box">
                            <div v-for="(item,index) in colors" :key="index" :style="{backgroundColor:item.value}" @click="handelColorEdit(item)">
                                <i :class="{'el-icon-check':item.isActive}"></i>
                            </div>
                        </div>
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" @click="submitFormEdit('editTeamForm')">确 定</el-button>
                <el-button size="small" @click="editTeamDialog = false">取 消</el-button>
            </span>
        </el-dialog>
        <!-- <el-dialog title="删除" :visible.sync="deleteDialog" width="30%" custom-class="common-dialog">
            <span>确定删除吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleDelete">确 定</el-button>
                <el-button @click="deleteDialog = false">取 消</el-button>
            </span>
        </el-dialog> -->
        <DeleteDialog
            :dialogVisible = "deleteDialog"
            @delete="handleDelete"
            @cancel="deleteDialog = false">
        </DeleteDialog>
    </div>
</template>

<script>
import {
    get_team,
    add_team,
    delete_team
} from '../../server/protect_net/api.js'
export default {
    name: 'Team',
    data() {
        return {
            colors: [
                { value: '#E34D59', isActive: false },
                { value: '#5382FF', isActive: false },
                { value: '#FF409B', isActive: false },
                { value: '#9A43FF', isActive: false },
                { value: '#66cc67', isActive: false },
                { value: '#67ff66', isActive: false },
                { value: '#0125B0', isActive: false },
                { value: '#009A66', isActive: false },
                { value: '#ff2828', isActive: false },
                { value: '#9a6666', isActive: false },
                { value: '#ff6666', isActive: false },
                { value: '#ff6599', isActive: false },
                { value: '#ff9967', isActive: false },
                { value: '#ff999a', isActive: false },
                { value: '#ff99cc', isActive: false },
                { value: '#ff66ff', isActive: false },
                { value: '#DDC900', isActive: false },
                { value: '#ffffcc', isActive: false },
                { value: '#ffff9a', isActive: false },
                { value: '#ffff67', isActive: false },
                { value: '#A2B7D2', isActive: false },
                { value: '#ffcc99', isActive: false },
                { value: '#ffcccc', isActive: false },
                { value: '#ffccff', isActive: false }
            ],
            isUp: true,
            colorBg: 'rgba(0,0,0,0)',
            formLabelWidth: '100px',
            addTeamDialog: false,
            tableHeight: document.body.clientHeight - 270,
            types: [
                {
                    value: 0,
                    label: '攻击'
                }, {
                    value: 1,
                    label: '防守'
                }, {
                    value: 2,
                    label: '领导'
                }, {
                    value: 3,
                    label: '其他'
                }
            ],
            rules: {
                name: [{
                    required: true,
                    message: '请输入图例名称',
                    trigger: 'blur'
                }],
                type: [{
                    required: true,
                    message: '请选择类型',
                    trigger: 'change'

                }],
                color: [{
                    required: true,
                    message: '请选择颜色',
                    trigger: 'change'

                }]
            },
            addTeamForm: {
                name: '',
                type: '',
                color: ''
            },
            isUpEdit: true,
            colorBgEdit: 'rgba(0,0,0,0)',
            editTeamDialog: false,
            editTeamForm: {
                id: '',
                name: '',
                type: '',
                color: ''
            },
            get_params: {
                name: '',
                page: 1,
                size: 20
            },
            total_num: 0,
            loading: false,
            tableData: [],
            deleteDialog: false,
            deleteId: ''
        }
    },
    watch: {
        addTeamDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.addTeamForm.resetFields()
                    this.isUp = true
                    this.colorBg = ''
                    this.colors = this.colors.map(_item => {
                        _item.isActive = false
                        return _item
                    })
                }
            }
        },
        editTeamDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.editTeamForm.resetFields()
                    this.isUpEdit = true
                    this.colorBgEdit = ''
                    this.colors = this.colors.map(_item => {
                        _item.isActive = false
                        return _item
                    })
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
            if (rowIndex % 2) {
                return 'table-row2'
            } else {
                return 'table-row1'
            }
        },
        back() {
            this.$router.go(-1)
        },
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        reset() {
            this.get_params = {
                name: '',
                page: 1,
                size: 20
            }
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
                    name: this.get_params.name
                }
            }
            get_team(data).then(res => {
                console.log('队伍数据', res)
                this.loading = false
                this.total_num = res.total
                let list = res.records
                if (list.length > 0) {
                    list.forEach(item => {
                        let obj = {}
                        obj.id = item.id
                        obj.name = item.name
                        obj.color = item.color
                        obj.createTime = item.createTime
                        obj.type = item.type
                        obj.type_name = this.types.filter(_item => _item.value === item.type)[0].label
                        this.tableData.push(obj)
                    })
                }
            }).catch(error => {
                this.addRegionDialog = false
                console.log(error + 'error')
            })
        },
        openColor() {
            this.isUp = !this.isUp
        },
        openColorEdit() {
            this.isUpEdit = !this.isUpEdit
        },
        searchAssets() {
            this.get_params.page = 1
            this.get_data()
        },
        handelColor(item) {
            this.colors = this.colors.map(_item => {
                _item.isActive = false
                return _item
            })
            item.isActive = true
            this.colorBg = item.value
            this.addTeamForm.color = item.value
        },
        handelColorEdit(item) {
            this.colors = this.colors.map(_item => {
                _item.isActive = false
                return _item
            })
            item.isActive = true
            this.colorBgEdit = item.value
            this.editTeamForm.color = item.value
        },
        handleEdit(row) {
            console.log(row)
            this.editTeamDialog = true
            this.editTeamForm = {
                id: row.id,
                name: row.name,
                type: row.type,
                color: row.color
            }
            this.colorBgEdit = row.color
            this.colors = this.colors.map(_item => {
                if (_item.value === row.color) {
                    _item.isActive = true
                } else {
                    _item.isActive = false
                }
                return _item
            })
        },
        delBtn(row) {
            this.deleteDialog = true
            this.deleteId = row.id
        },
        handleDelete() {
            let data = {
                queryData: {},
                paramsData: {
                    ids: [this.deleteId]
                }
            }
            delete_team(data).then(res => {
                this.deleteDialog = false
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(error => {
                console.log(error + 'error')
            })
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.addFun()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        submitFormEdit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.editFun()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        addFun() {
            console.log(this.addTeamForm)
            let data = {
                queryData: {},
                paramsData: {
                    name: this.addTeamForm.name,
                    color: this.addTeamForm.color,
                    type: this.addTeamForm.type
                }
            }
            add_team(data).then(res => {
                this.addTeamDialog = false
                console.log('添加成功')
                this.$message({
                    message: '添加成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(error => {
                this.addTeamDialog = false
                console.log(error + 'error')
            })
        },
        editFun() {
            console.log(this.editTeamForm)
            let data = {
                queryData: {},
                paramsData: {
                    id: this.editTeamForm.id,
                    name: this.editTeamForm.name,
                    color: this.editTeamForm.color,
                    type: this.editTeamForm.type
                }
            }
            add_team(data).then(res => {
                this.editTeamDialog = false
                console.log('编辑成功')
                this.$message({
                    message: '编辑成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(error => {
                this.editTeamDialog = false
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
        }
    }
}
</script>

<style lang="scss" scoped>
    .color-box{
        display: inline-block;
        width:66px;
        height:26px;
        font-size:0px;
        border:1px solid #dcdcdc;
        border-radius:3px;
        position: relative;
    }
    .color-inner-box{
        width:60px;
        height:20px;
        position: absolute;
        left:2px;
        top:2px;
        line-height: 20px;
        font-size:16px;
        text-align: center;
        color:#dcdcdc;
        cursor: pointer;
    }
    .colors-box{
        width:514px;
        position: absolute;
        top:32px;
        left:0;
        // box-shadow: 0px 0px 4px #4bacf9 inset;
    }
    .colors-box>div{
        width:44px;
        height:20px;
        text-align: center;
        font-size:0;
        line-height:20px!important;
        margin: 10px;
        float:left;
        cursor: pointer;
    }
    .colors-box>div i{
        margin-top: 2px;
        color:#fff;
        font-size:16px;
    }
    .team-color{
        display: inline-block;
        vertical-align: middle;
        width:60px;
        height:26px;
    }
</style>
