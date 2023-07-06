<template>
    <div class="list" style="margin-top: -2px;">
        <div class="ub w100" style="height: calc(100vh - 110px); overflow: hidden">
            <div style="background:#fff;border: solid 1px #dadee8;border-radius: 4px;overflow-y:auto;border-top-left-radius:0;border-top-right-radius:0;" class="mr-1 mb-1">
                <div class="tree" style="position: relative;">
                    <div class="ub ub-pj ub-ac w100" style="padding-left:10px;margin-bottom: 10px;box-sizing: border-box">
                        <div class="list-tips" style="margin-bottom: 0;font-size:12px;;margin-top:8px">分组列表</div>
                        <div class="tree-option" style="font-size:12px;color:#1cd7fa;padding-right:10px;">
                            <el-tooltip class="item" effect="dark" content="新增" placement="top-start">
                                <i class="iconfont icon-tianjiashu" style="font-size: 12px;color:#387dee" @click="addLabelShow"></i>
                            </el-tooltip>
                            <el-tooltip class="item" v-if="currentNode.id!=''" effect="dark" content="编辑" placement="top-start">
                                <i class="iconfont icon-xiugaishu" style="font-size: 12px;color:#387dee" @click="editLabelShow"></i>
                            </el-tooltip>
                            <el-tooltip class="item" v-if="currentNode.id!=''" effect="dark" content="删除" placement="top-start">
                                <i class="iconfont icon-shanchushu" style="font-size: 12px;color:#387dee" @click="delLabelShow"></i>
                            </el-tooltip>
                        </div>
                    </div>
                    <div style="padding: 0 10px 10px 10px">
                        <el-input
                            placeholder="请输入关键词搜索"
                            clearable
                            v-model="filterText"
                            class="tree-input"
                            suffix-icon="el-icon-search"
                            size="mini">
                        </el-input>
                    </div>
                    <el-tree
                        ref="tree"
                        node-key="id"
                        :filter-node-method="filterNode"
                        :default-expand-all="true"
                        :highlight-current="true"
                        :data="treeData"
                        :props='propsData'
                        @node-click="handleNodeClick"
                        :expand-on-click-node="false"
                        :indent='indent'>
                        <span class="custom-tree-node" slot-scope="{ node }">
                            <span style="font-size: 12px;color:#387dee;margin-right:5px" class="iconfont icon-biaoqianguanli"></span>
                            <span style="color:rgba(0,0,0,.9);font-size:12px;">{{ node.label }}</span>
                        </span>
                    </el-tree>
                </div>
            </div>
            <div class="ub ub-f1 ub-ver" style="overflow: hidden;overflow-y: hidden;">
                <div>
                    <div class="ub w100 search-area" style="box-sizing: border-box;">
                        <SearchTop @search="searchAssets" @reset="reset" style="border-top-left-radius:0;border-top-right-radius:0;">
                            <el-col :md="12" :lg="8" :xl="6">
                                <el-form :model="get_params">
                                    <el-form-item label="标签名称：" label-width="80px">
                                        <el-input placeholder="请输入" clearable v-model.trim="get_params.name" @keyup.enter.native="searchCheck" size="small"></el-input></el-form-item>
                                </el-form>
                            </el-col>
                        </SearchTop>
                    </div>
                    <div class="list-container">
                        <div class="ub ub-pj w100 mb-1 ub-ac">
                            <div class="list-tips">标签管理</div>
                            <div>
                                <el-button icon="el-icon-plus" @click="handleAddLabel" size="small"  type="primary" v-per="['assets_label_add']">添加标签</el-button>
                                <el-button style="margin-left: 10px;" icon="el-icon-delete"  @click="handleDeleteAll" size="small" type="danger" v-per="['assets_label_del']">删除</el-button>
                            </div>
                        </div>
                        <!--没加搜索,临时加最小高度-->
                        <el-table
                            ref="multipleTable"
                            v-loading="loading"
                            class='bigTable full-table'
                            :data="tableData"
                            border
                            stripe
                            tooltip-effect="dark"
                            :height="tabHeight"
                            :row-class-name="tableRowClassName"
                            :row-style="{ height: '32px' }"
                            :header-row-style="{ height: '32px' }"
                            @selection-change="handleSelectionChange">
                            <el-table-column align="center" type="selection" width="30">
                            </el-table-column>
                            <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                            </el-table-column>
                            <el-table-column prop="name" label="标签名称" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column prop="groupName" label="标签组" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column prop="des" label="标签描述" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column align="center" label="操作" width="100">
                                <template slot-scope="scope">
                                    <el-button type="text" size="small" @click="handleEdit(scope.row)" v-per="['assets_label_edit']">编辑</el-button>
                                    <el-button type="text" size="small" @click="handleDelete(scope.row)" v-per="['assets_label_del']">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <pagination :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size" @pagination="get_data" style="padding-top:10px" v-show="total_num>0"/>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog title="添加标签" :visible.sync="addLabelDialog" width="700px" custom-class="common-dialog">
            <el-form :model="addLabelForm" :rules="rules_label" ref="addLabelForm"  label-position="top">
                <el-form-item label="标签名称：" prop="name" label-width="120px">
                    <el-input placeholder="请输入" clearable v-model="addLabelForm.name" size="small"></el-input>
                </el-form-item>
                <el-form-item label="标签组：" prop="groupId" label-width="120px">
                    <el-select size="small" v-model="addLabelForm.groupId" clearable placeholder="请选择" style="width:100%">
                        <el-option v-for="(item,index) in labelList" :key="index" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="标签描述：" prop="des" label-width="120px">
                    <el-input type="textarea" :rows="2" placeholder="请输入" clearable v-model="addLabelForm.des" size="small"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addLabelDialog=false" size="small">取消</el-button>
                <el-button type="primary" @click="submitLabelForm('addLabelForm')" size="small">确认</el-button>
            </span>
        </el-dialog>
        <el-dialog title="编辑标签" :visible.sync="editLabelDialog" width="700px" custom-class="common-dialog">
            <el-form :model="editLabelForm" :rules="rules_label" ref="editLabelForm" label-position="top">
                <el-form-item label="标签名称：" prop="name" label-width="120px">
                    <el-input placeholder="请输入" clearable v-model="editLabelForm.name" size="small"></el-input>
                </el-form-item>
                <el-form-item label="标签组：" prop="groupId" label-width="120px">
                    <el-select size="small" style="width: 100%" v-model="editLabelForm.groupId" clearable placeholder="请选择">
                        <el-option v-for="(item,index) in labelList" :key="index" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="标签描述：" prop="des" label-width="120px">
                    <el-input type="textarea" :rows="2" placeholder="请输入" clearable v-model="editLabelForm.des" size="small"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editLabelDialog=false" size="small">取消</el-button>
                <el-button type="primary" @click="submitEditLabelForm('editLabelForm')" size="small">确认</el-button>
            </span>
        </el-dialog>
        <DeleteDialog
            :dialogVisible = deleteItemDialog
            @delete="deleteItemData"
            @cancel="deleteItemDialog = false">
        </DeleteDialog>
        <DeleteDialog
            :dialogVisible = deleteAllDialog
            @delete="deleteAllData"
            @cancel="deleteAllDialog = false">
        </DeleteDialog>
        <el-dialog title="创建标签组" :visible.sync="addGroupDialog" width="700px" custom-class="common-dialog">
            <el-form :model="addGroupForm" :rules="rules" ref="addGroupForm" label-position="top">
                <el-form-item label="标签组名称：" prop="name" label-width="120px">
                    <el-input placeholder="请输入" clearable v-model="addGroupForm.name" size="small"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addGroupDialog = false" size="small">取消</el-button>
                <el-button @click="submitGroupForm('addGroupForm')" size="small" type="primary">确定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="编辑标签组" :visible.sync="editGroupDialog" width="700px" custom-class="common-dialog">
            <el-form :model="editGroupForm" :rules="rules" ref="editGroupForm" label-position="top">
                <el-form-item label="标签组名称：" prop="name" label-width="120px">
                    <el-input placeholder="请输入" clearable v-model="editGroupForm.name" size="small"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editGroupDialog = false" size="small">取消</el-button>
                <el-button @click="submitGroupFormEdit('editGroupForm')" size="small" type="primary">确定</el-button>
            </span>
        </el-dialog>
        <DeleteDialog
            :dialogVisible = delGroupDialog
            @delete="handleDeleteGroupFun"
            @cancel="delGroupDialog = false">
        </DeleteDialog>
    </div>
</template>

<script>
import {
    get_label_tree,
    get_label_list,
    save_label_group,
    delete_label_group,
    save_label,
    update_label,
    delete_label
} from '../../server/assets/api.js'
export default {
    name: 'AssetLabel',
    data() {
        return {
            tabHeight: document.body.clientHeight - 292,
            isClick: true,
            isFirst: true,
            indent: 10,
            depId: '',
            config_id: '',
            treeData: [],
            propsData: {
                children: 'childTypeInfo',
                label: 'name'
            },

            currentNode: {
                id: '',
                name: ''
            },
            currentId: '',
            addGroupDialog: false,
            addGroupForm: {
                name: ''
            },
            editGroupDialog: false,
            editGroupForm: {
                name: ''
            },
            delGroupDialog: false,
            flag: null,
            record_row: {},

            rules: {
                name: [{
                    required: true,
                    message: '请输入标签组名称',
                    trigger: 'blur'
                }]
            },
            rules_label: {
                name: [{
                    required: true,
                    message: '请输入标签名称',
                    trigger: 'blur'
                }],
                groupId: [{
                    required: true,
                    message: '请选择标签组',
                    trigger: 'change'
                }]
            },
            currentNodeId: '',
            addLabelDialog: false,
            editLabelDialog: false,
            labelList: [],
            addLabelForm: {
                groupId: '',
                name: '',
                des: ''
            },
            editLabelForm: {
                groupId: '',
                id: '',
                name: '',
                des: ''
            },
            testData: [],
            isOpen: false,
            detailArr: [],
            detailDialog: false,
            deployDialog: false,
            deployAllDialog: false,
            deleteDialog: false,
            deleteItemId: '',
            deleteItemDialog: false,
            deleteAllDialog: false,
            formLabelWidth: '100px',
            loading: false,
            total_num: 0,
            multipleSelection: [],
            tableData: [],
            allDeploy: {
                status: ''
            },
            editDeploy: {
                id: '',
                status: ''
            },
            sayTimes: [],
            get_params: {
                page: 1,
                size: 20,
                name: '',
                groupId: ''
            },
            typeList: [],
            filterText: ''
        }
    },
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val)
        },
        addRuleDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.addRuleForm.resetFields()
                }
            }
        },
        addGroupDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.addGroupForm.resetFields()
                }
            }
        },
        addLabelDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.addLabelForm.resetFields()
                }
            }
        },
        editLabelDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.editLabelForm.resetFields()
                }
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.initTree()
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
                name: ''
            }
            this.get_data()
        },
        initTree() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_label_tree(data).then(res => {
                console.log('tree', res)
                this.labelList = this.$deepCopy(res)
                res.unshift({ name: '全部', id: '' })
                if (this.isFirst) {
                    this.depId = res[0].id
                    this.get_data()
                }
                this.isFirst = false
                this.isClick = false

                this.treeData = res
            }).then(() => {
                this.$refs.tree.setCheckedKeys([this.currentNodeId])
                this.$refs.tree.setCurrentKey(this.depId)
                this.isClick = true
            }).catch(error => {
                console.log('error' + error)
            })
        },
        filterNode(value, data) {
            if (!value) return true
            return data.name.indexOf(value) !== -1
        },
        initParams() {
            this.get_params.page = 1
            this.get_params.size = 20
            this.total_num = 0
        },

        handleNodeClick(node) {
            this.currentNode = node
            if (this.isClick) {
                this.currentNodeId = node.id
            }
            this.$refs.tree.setCheckedNodes([node])

            console.log(node)
            this.depId = node.id
            this.initParams()
            this.get_data()
        },
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },

        searchCheck() {
            this.get_params.page = 1
            this.get_data()
        },
        handleEdit(row) {
            this.editLabelForm.name = row.name
            this.editLabelForm.des = row.des
            this.editLabelForm.id = row.id
            this.editLabelForm.groupId = row.groupId
            this.editLabelDialog = true
        },
        handleDelete(row) {
            this.deleteItemId = row.id
            this.deleteItemDialog = true
        },

        handleDeleteGroupFun() {
            let data = {
                id: this.currentNode.id
            }
            delete_label_group(data).then(res => {
                this.delGroupDialog = false
                console.log('删除成功')
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                this.isFirst = true
                setTimeout(() => {
                    this.initTree()
                }, 1500)
            }).catch(error => {
                this.delGroupDialog = false
                console.log(error + 'error')
            })
        },
        delLabelShow() {
            this.delGroupDialog = true
        },
        addLabelShow() {
            this.addGroupDialog = true
        },
        editLabelShow() {
            this.editGroupForm.name = this.currentNode.name
            this.editGroupDialog = true
        },
        submitGroupFormEdit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.editGroupFun()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        submitGroupForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.addGroupFun()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },

        editGroupFun() {
            let data = {
                queryData: {},
                paramsData: {
                    name: this.editGroupForm.name,
                    id: this.currentNode.id
                }
            }
            save_label_group(data).then(res => {
                this.editGroupDialog = false
                this.$message({
                    message: '编辑成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.initTree()
                }, 1500)
            }).catch(error => {
                // this.editGroupDialog = false
                console.log(error + 'error')
            })
        },
        addGroupFun() {
            let data = {
                queryData: {},
                paramsData: {
                    name: this.addGroupForm.name
                }
            }
            save_label_group(data).then(res => {
                this.addGroupDialog = false
                console.log('添加成功')
                this.$message({
                    message: '添加成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.initTree()
                }, 1500)
            }).catch(error => {
                // this.addGroupDialog = false
                console.log(error + 'error')
            })
        },
        submitLabelForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.addLabel()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        submitEditLabelForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.editLabel()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        addLabel() {
            let data = {
                queryData: {},
                paramsData: {
                    groupId: this.addLabelForm.groupId,
                    name: this.addLabelForm.name,
                    des: this.addLabelForm.des
                }
            }
            save_label(data).then(res => {
                this.addLabelDialog = false
                this.$message({
                    message: '添加成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(error => {
                // this.addLabelDialog = false
                console.log(error + 'error')
            })
        },
        editLabel() {
            let data = {
                queryData: {},
                paramsData: {
                    groupId: this.editLabelForm.groupId,
                    id: this.editLabelForm.id,
                    name: this.editLabelForm.name,
                    des: this.editLabelForm.des
                }
            }
            update_label(data).then(res => {
                this.editLabelDialog = false
                this.$message({
                    message: '编辑成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(error => {
                // this.editLabelDialog = false
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

        handleSelectionChange(val) {
            this.multipleSelection = val
        },

        searchAssets() {
            this.get_params.page = 1
            this.get_data()
        },

        get_data() {
            let uid = this.config_id = new Date().getTime()
            this.loading = true
            this.tableData = []
            let data = {
                queryData: {
                    page: this.get_params.page,
                    pageSize: this.get_params.size
                },
                paramsData: {
                    name: this.get_params.name,
                    groupId: this.depId
                }
            }
            get_label_list(data).then(res => {
                if (this.config_id != uid) {
                    return
                }
                console.log(res)
                this.loading = false
                this.testData = res
                this.total_num = res.total
                let list = res.records
                if (list.length > 0) {
                    list.forEach((item, index) => {
                        // console.log(index)
                        let obj = {}
                        obj.id = item.id
                        obj.name = item.name
                        obj.groupName = item.groupName
                        obj.createTime = item.createTime
                        obj.groupId = item.groupId
                        obj.des = item.des
                        this.tableData.push(obj)
                    })
                }
            }).catch(error => {
                this.loading = false
                console.log('error' + error)
            })
        },

        deleteItemData() {
            let obj = {
                ids: [this.deleteItemId]
            }
            delete_label(obj).then(res => {
                this.deleteItemDialog = false
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1000)
            }).catch(error => {
                this.deleteItemDialog = false
                console.log(error + 'error')
            })
        },

        deleteAllData() {
            let ids = []
            this.multipleSelection.forEach(item => {
                console.log(item)
                ids.push(item.id)
            })
            let obj = {
                ids: ids
            }
            delete_label(obj).then(res => {
                this.deleteAllDialog = false
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1000)
            }).catch(error => {
                this.deleteAllDialog = false
                console.log(error + 'error')
            })
        },
        handleAddLabel() {
            this.addLabelForm.groupId = this.depId ? this.depId : ''
            this.addLabelDialog = true
        },
        handleDeleteAll() {
            if (this.multipleSelection.length === 0) {
                this.$message({
                    message: '请勾选删除的行',
                    type: 'warning'
                })
            } else {
                this.deleteAllDialog = true
            }
        },

        handleDeployAll(val) {
            if (this.multipleSelection.length === 0) {
                this.$message({
                    message: '请勾选规则行',
                    type: 'warning'
                })
            } else {
                this.submitAllDeployForm(val)
            }
        }
    },
    beforeDestroy() {
        if (this.flag) {
            clearTimeout(this.flag)
            this.flag = null
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

// .el-form-item {
//     margin: 0;
// }

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

.event ::v-deep .el-range-input {
    background-color: rgba(0, 0, 0, 0);
    color: #fff;
}

.event ::v-deep .el-range-separator {
    color: #fff;
}
.event ::v-deep .el-upload-list__item-name {
    color: #01E9FF;

    i {
        color: #01E9FF;
    }
}
.attendance-dialog .el-form-item {
    margin-bottom: 30px;
}
.upload-demo ::v-deep .el-button--primary{
    background-color: rgba(0,0,0,0);
    border-color: rgba(0,0,0,0);
    // background-image: url(../../assets/img/XZWJ.png);
    background-position: 0 0;
    background-repeat: no-repeat;
    background-size: 100% 100%;
}
.el-tree{
    background: rgba(0,0,0,0);
}
.tree ::v-deep .el-tree--highlight-current .el-tree-node:not(:first-child) {
    padding-left: 10px;
}
.tree ::v-deep .el-tree--highlight-current .el-tree-node>.el-tree-node__content {
    .custom-tree-node{
        span:nth-child(1){
            color:#bfdce4;
        }
        span:nth-child(2){
            color:#86939e;
        }

    }
}
.tree ::v-deep .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
    background-color: rgba(0,0,0,0)!important;
    .custom-tree-node{
        span{
            color:#1cd7fa;
        }
    }
}
.tree ::v-deep .el-tree--highlight-current .el-tree-node>.el-tree-node__content:hover{
    background-color: rgba(0,0,0,0)!important;
    .custom-tree-node{
        span{
            color:#1cd7fa;
        }
    }
}
.tree ::v-deep .el-checkbox__input.is-disabled .el-checkbox__inner{
    background-color: #1cd7fa;
    border-color: #1cd7fa;
}
.tree ::v-deep .el-checkbox__input .el-checkbox__inner,.auto ::v-deep .el-checkbox__input .el-checkbox__inner{
    border-color: #1cd7fa;
}
.tree ::v-deep .el-checkbox__input.is-focus .el-checkbox__inner,.auto ::v-deep .el-checkbox__input.is-focus .el-checkbox__inner{
    border-color: #1cd7fa;
}
.tree ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner,.auto ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: rgba(0,0,0,0)!important;
    border-color: #1cd7fa;
}
.tree-option i{
    margin: 0 3px;
    cursor: pointer;
}
.tree ::v-deep .el-checkbox__inner::after,.auto ::v-deep .el-checkbox__inner::after{
    border-color:#1cd7fa;
}
.tree ::v-deep .el-tree-node__content {
    background-color: rgba(0,0,0,0)!important;
}
.auto ::v-deep .el-checkbox__input.is-checked+.el-checkbox__label{
    color:#1cd7fa;
}
.event  ::v-deep  .bigTable.el-table td {
    min-height: 34px !important;
    padding: 4px 0 !important;
}
</style>
