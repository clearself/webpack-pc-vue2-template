<template>
    <div class="event tag-list" style="box-sizing: border-box;overflow-y: hidden !important;">
        <div class="ub w100" style="height: calc(100vh - 80px); overflow: hidden">
            <div class="event-wrapper event-content mr-1 mb-1" style="width:200px;padding: 20px 5px 10px;box-sizing: border-box;overflow: auto">
                <div>
                    <!-- <span style="position: absolute;width:10px;height:10px;background: red;top:50%;right:0;"></span> -->
                    <div class="ub ub-pj ub-ac w100" style="padding-left:10px;margin-bottom: 20px;box-sizing: border-box">
                        <div class="list-tips" style="margin-bottom: 0;font-size:14px;">仪表盘分组</div>
                        <div class="operate" @click="handleAdd">
                            <span class="iconfont icon-tianjia1"></span>
                        </div>
                    </div>
                    <!-- <div style="padding: 0 5px 10px 5px">
                        <el-input
                            placeholder="请输入关键词搜索"
                            clearable
                            v-model="filterText"
                            class="tree-input"
                            size="mini">
                        </el-input>
                    </div> -->
                    <el-tree
                        class="tree-line"
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
                        <div class="custom-tree-node ub" slot-scope="{ node, data }" @mouseenter="mouseenter(data)" @mouseleave="mouseleave(data)">
                            <div class="node-label" style="color:rgba(0, 0, 0, 0.9); font-size: 12px;margin-right:10px">{{
                                node.label
                            }}</div>
                            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                                <div style="color:rgba(0, 0, 0, 0.9); font-size: 12px;margin-right:6px" class="node-edit iconfont icon-bianji1" v-show="data.grade !== 1&&data.show" @click="editNode( data )"></div>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="删除" placement="top">
                                <div style="color:rgba(0, 0, 0, 0.9); font-size: 12px" class="node-del iconfont icon-shanchu3" v-show="data.show && data.grade !== 1" @click="delNode(data)"></div>
                            </el-tooltip>
                        </div>
                    </el-tree>
                </div>
            </div>
            <div class="ub ub-f1 ub-ver" style="height: 100%;overflow: auto">
                <div>
                    <SearchTop @search="searchData" @reset="reset">
                        <el-col :md="12" :lg="8" :xl="6">
                            <el-form :model="get_params">
                                <el-form-item label="仪表盘名：" label-width="80px">
                                    <el-input
                                        placeholder="请输入仪表盘名称"
                                        clearable
                                        v-model="get_params.name"
                                        class="tree-input"
                                        size="small">
                                    </el-input>
                                </el-form-item>
                            </el-form>
                        </el-col>
                    </SearchTop>
                    <div class="list-container">
                        <div class="ub ub-pj w100 mb-1">
                            <div class="list-tips">仪表盘</div>
                            <div>
                                <el-button v-per="['yc_board_add']" size="small" icon="el-icon-plus" type="primary" @click="add">新 建</el-button>
                                <el-button v-per="['yc_board_del']" size="small" icon="el-icon-delete" type="danger" @click="deleteContent">删 除</el-button>
                            </div>
                        </div>
                        <el-table
                            :height="tableHeight"
                            ref="multipleTable"
                            v-loading="loading"
                            class="bigTable"
                            :data="tableData"
                            :row-key="
                                (row) => {
                                    return row.id;
                                }
                            "
                            :row-class-name="tableRowClassName"
                            :row-style="{ height: '32px' }"
                            :header-row-style="{ height: '32px' }"
                            border
                            stripe
                            tooltip-effect="dark"
                            @selection-change="handleSelectionChange"
                        >
                            <el-table-column align="center" type="selection" :reserve-selection="true" width="50"></el-table-column>
                            <el-table-column align="center" type="index" width="50" label="序号" :index="indexMethod">
                            </el-table-column>
                            <el-table-column prop="name" label="仪表盘名" width="200"> </el-table-column>
                            <el-table-column prop="groupName" label="所属分组" width="200"> </el-table-column>
                            <el-table-column prop="labelName" label="包含的标签页" show-overflow-tooltip> </el-table-column>
                            <el-table-column align="center" label="操作" width="200" fixed="right">
                                <template slot-scope="scope">
                                    <el-button v-if="scope.row.selected===0" type="text" size="small" @click="handleStick(scope.row,1)">设为默认</el-button>
                                    <el-button v-else type="text" size="small" @click="handleStick(scope.row,0)">取消默认</el-button>
                                    <el-button v-per="['yc_board_view']" type="text" size="small" @click="handleSee(scope.row)">查看</el-button>
                                    <el-button v-per="['yc_board_edit']" type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                                    <el-button v-per="['yc_board_del']" type="text" size="small" @click="handleDel(scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <pagination v-show="total_num>0" :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size" @pagination="getList" />
                    </div>
                </div>
            </div>
        </div>
        <el-dialog :title="addForm.id ?  '修改仪表盘' : '新建仪表盘'" width="700px" :visible.sync="addDialog" custom-class="common-dialog">
            <el-form :model="addForm" ref="addForm" :rules="addFormRules" label-position="top">
                <div class="ub ub-pj" style="width:100%;">
                    <el-form-item label="仪表盘名称：" prop="name" label-width="100px" style="width: 48%">
                        <el-input :maxlength="100" size="small" placeholder="请输入仪表盘名称" v-model.trim="addForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="分组：" label-width="100px" style="width: 48%;" class="yibiaopan">
                        <treeselect
                            size="mini"
                            class="treeselect"
                            :options="dataTree"
                            :normalizer="myNormalizer"
                            noChildrenText="当前分支无子节点"
                            noOptionsText="无可用选项"
                            placeholder="请选择分组"
                            v-model="addForm.groupId"
                            loadingText="下拉框无匹配项"
                            :clearable="false"
                        />
                    </el-form-item>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="addDialog=false">取 消</el-button>
                <el-button size="small" type="primary" @click="validAdd('addForm')">确 认</el-button>
            </div>
        </el-dialog>

        <el-dialog :title="addGroup.id?'修改分组':'新建分组'" width="700px" :visible.sync="addGroupDialog" custom-class="common-dialog">
            <el-form :model="addGroup" ref="addGroup" :rules="addGroupRules" label-position="top">
                <div class="ub ub-pj" style="width:100%;">
                    <el-form-item label="组名：" prop="name" label-width="100px" style="width: 48%">
                        <el-input :maxlength="100" size="small" placeholder="请输入仪表盘名称" v-model.trim="addGroup.name"></el-input>
                    </el-form-item>
                    <el-form-item style="width: 48%" label="上级分组："  label-width="100px">
                        <treeselect
                            class="treeselect"
                            :options="dataTree"
                            :normalizer="normalizer"
                            noChildrenText="当前分支无子节点"
                            noOptionsText="无可用选项"
                            placeholder="请选择分组"
                            v-model="addGroup.parentId"
                            loadingText="下拉框无匹配项"
                            :clearable="false"
                        />
                    </el-form-item>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="addGroupDialog=false" >取 消</el-button>
                <el-button size="small" type="primary" @click="handleAddGroup('addGroup')">确 认</el-button>
            </div>
        </el-dialog>

        <DeleteDialog
            :dialogVisible = delDialog
            @delete="delConfim"
            @cancel="delDialog = false">
        </DeleteDialog>
        <DeleteDialog
            :dialogVisible = delTreeDialog
            @delete="handleDelTree"
            @cancel="delTreeDialog = false">
        </DeleteDialog>
    </div>
</template>

<script>
import { findSearchType, searchPage, saveSearchType, deleteSearchType, addDashboard, updateDashboard, deleteDashboard } from '@/server/stream_data_center/dash_board.js'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
    name: 'DashBoardList',
    components: { Treeselect },
    data() {
        return {
            tableHeight: document.body.clientHeight - 270,
            addGroupDialog: false,
            dataTree: [],
            addGroup: {
                id: '',
                name: '',
                parentId: null
            },
            addGroupRules: {
                name: [
                    {
                        required: true,
                        message: '请输入组名',
                        trigger: 'blur'
                    }
                ],
                parentId: [
                    {
                        required: true,
                        message: '请选择分组',
                        trigger: 'change'
                    }
                ]
            },
            addFormRules: {
                name: [
                    {
                        required: true,
                        message: '请输入仪表盘名',
                        trigger: 'blur'
                    }
                ],
                groupId: [
                    {
                        required: true,
                        message: '请选择分组',
                        trigger: 'change'
                    }
                ]
            },
            addForm: {
                id: '',
                name: '',
                groupId: null
            },
            normalizer(node) {
                if (node.child && !node.child.length) {
                    delete node.child
                }
                return {
                    id: node.id,
                    label: node.name,
                    children: node.child
                }
            },
            myNormalizer(node) {
                if (node.child && !node.child.length) {
                    delete node.child
                }
                return {
                    id: node.id,
                    label: node.name,
                    children: node.child
                }
            },

            isFirst: true,
            indent: 10,
            depId: '',
            config_id: '',
            treeData: [],
            propsData: {
                children: 'child',
                label: 'name'
            },
            currentNode: {
                id: ''
            },
            addDialog: false,
            // editDialog: false,
            delId: '',
            delTreeDialog: false,
            delDialog: false,
            total_num: 0,
            loading: false,
            get_params: {
                page: 1,
                size: 20,
                name: ''
            },
            tableData: [],
            multipleSelection: []
        }
    },
    watch: {
        // filterText(val) {
        //     this.$refs.tree.filter(val)
        // },
        addDialog: function(val, oldVla) {
            if (!val) {
                this.addForm = {
                    groupId: '',
                    name: ''
                }
                this.$refs.addForm.resetFields()
            }
        }
        // editDialog: function(val, oldVla) {
        //     if (!val) {
        //         this.add_paramsEdit = {
        //             id: '',
        //             channelId: '',
        //             name: null,
        //             conts: []
        //         }
        //         this.cutNum = 10
        //         this.$refs.add_paramsEdit.resetFields()
        //     }
        // }
    },
    mounted() {
        this.$nextTick(() => {
            this.initTree()
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
            this.get_params.name = ''
            setTimeout(() => {
                this.getList()
            }, 1500)
        },
        handleAdd() {
            this.dataTreeData()
            this.addGroup.id = ''
            this.addGroup.name = ''
            this.addGroup.parentId = ''
            this.addGroupDialog = true
        },
        handleAddGroup(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = {
                        queryData: {},
                        paramsData: {
                            id: this.addGroup.id,
                            parentId: this.addGroup.parentId,
                            name: this.addGroup.name
                        }
                    }
                    saveSearchType(data).then(res => {
                        this.addGroupDialog = false
                        this.$message({
                            message: '操作成功！',
                            type: 'success'
                        })
                        setTimeout(() => {
                            this.initTree()
                        }, 1500)
                    }).catch(error => {
                        console.log('error', error)
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        delNode(val) {
            this.delTreeDialog = true
            console.log(val)
        },
        handleDelTree() {
            let data = {
                queryData: {},
                paramsData: {
                    id: this.currentNode.id
                }
            }
            deleteSearchType(data).then(res => {
                this.delTreeDialog = false
                this.$message({
                    message: '删除成功！',
                    type: 'success'
                })
                setTimeout(() => {
                    this.initTree()
                }, 1500)
            }).catch(error => {
                console.log('error', error)
            })
        },
        editNode(node) {
            this.dataTreeData()
            this.addGroup.id = node.id
            this.addGroup.name = node.name
            this.addGroup.parentId = node.parentId === null ? '' : node.parentId
            this.addGroupDialog = true
            console.log(node)
        },
        handleStick(row, selectedData) {
            let data = {
                queryData: {},
                paramsData: {
                    id: row.id,
                    indexType: row.indexType,
                    selected: selectedData
                }
            }
            updateDashboard(data).then((res) => {
                console.log(res)
                this.$message({
                    message: '操作成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.getList()
                }, 1500)
            })
        },
        handleSee(row) {
            this.$router.push({
                path: '/stream_data_center/stream_data_manage_dashboard',
                query: {
                    id: row.id,
                    name: row.name,
                    indexType: row.indexType
                }
            })
        },
        mouseleave(data) {
            this.$set(data, 'show', false)
        },
        mouseenter(data) {
            this.$set(data, 'show', true)
        },
        dataTreeData() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            findSearchType(data).then(res => {
                this.dataTree = res
            }).catch(error => {
                console.log('error' + error)
            })
        },
        initTree() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            findSearchType(data).then(res => {
                console.log('tree', res)
                if (this.isFirst) {
                    // this.depId = res[0].child[0].id
                    this.depId = res[0].id
                    this.getList()
                }
                this.isFirst = false
                this.treeData = res
            }).then(() => {
                this.$refs.tree.setCurrentKey(this.depId)
            }).catch(error => {
                console.log('error' + error)
            })
        },
        filterNode(value, data) {
            if (!value) return true
            return data.name.indexOf(value) !== -1
        },
        initParams() {
            this.get_params = {
                page: 1,
                size: 20,
                name: ''
            }
            this.total_num = 0
        },
        handleNodeClick(node) {
            // if (node.grade === 1) return
            this.currentNode = node
            console.log(node)
            this.depId = node.id
            this.initParams()
            this.getList()
        },
        // 添加内容
        add() {
            this.dataTreeData()
            this.addForm.id = ''
            this.addForm.groupId = ''
            this.addForm.name = ''
            this.addDialog = true
        },
        handleEdit(row) {
            this.dataTreeData()
            this.addForm.id = row.id
            this.addForm.groupId = row.group_id
            this.addForm.name = row.name
            this.addDialog = true
        },
        // 删除
        deleteContent() {
            if (this.multipleSelection.length == 0) {
                this.$message({
                    message: '请至少选择一项',
                    type: 'warning'
                })
            } else {
                let idsData = this.multipleSelection.map((item) => {
                    return item.id
                })
                deleteDashboard({ paramsData: { ids: idsData }}).then((res) => {
                    this.delDialog = false
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    })
                    setTimeout(() => {
                        this.getList()
                    }, 1500)
                })
            }
        },

        validAdd(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.addForm.id) {
                        this.editConfirm()
                    } else {
                        this.addConfirm()
                    }
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        addConfirm() {
            let data = {
                queryData: {},
                paramsData: {
                    name: this.addForm.name,
                    groupId: this.addForm.groupId
                }
            }
            addDashboard(data).then((res) => {
                console.log(res)
                this.$message({
                    message: '操作成功',
                    type: 'success'
                })
                this.addDialog = false
                setTimeout(() => {
                    this.getList()
                }, 1500)
            })
        },
        editConfirm() {
            let data = {
                queryData: {},
                paramsData: {
                    id: this.addForm.id,
                    name: this.addForm.name,
                    groupId: this.addForm.groupId
                }
            }
            updateDashboard(data).then((res) => {
                console.log(res)
                this.$message({
                    message: '操作成功',
                    type: 'success'
                })
                this.addDialog = false
                setTimeout(() => {
                    this.getList()
                }, 1500)
            })
        },
        handleDel(row) {
            this.delDialog = true
            this.delId = row.id
        },
        delConfim() {
            deleteDashboard({ paramsData: { ids: [this.delId] }}).then((res) => {
                this.delDialog = false
                this.$message({
                    message: '操作成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.getList()
                }, 1500)
            })
        },
        getList() {
            // let uid = this.config_id = new Date().getTime()
            this.tableData = []
            this.loading = true
            // let queryData = {
            //     page: this.get_params.page,
            //     pageSize: this.get_params.size
            // }
            let data = {
                queryData: {
                    page: this.get_params.page,
                    pageSize: this.get_params.size
                },
                paramsData: {
                    dashboardName: this.get_params.name,
                    groupManageId: this.depId

                }
            }
            searchPage(data)
                .then((res) => {
                    // if (this.config_id != uid) {
                    //     return
                    // }
                    console.log('标签列表', res)
                    this.loading = false
                    this.total_num = res.total
                    this.tableData = res.records
                    // let list = res.content
                    // if (list.length > 0) {
                    //     list.forEach((item) => {
                    //         let obj = {}
                    //         obj.id = item.id
                    //         obj.logTypeId = item.logTypeId
                    //         obj.name = item.name
                    //         obj.channelName = item.channelName
                    //         obj.contentObj = item.contentObj ? item.contentObj : []
                    //         obj.channelId = item.channelId
                    //         obj.version = item.version
                    //         obj.property = item.property
                    //         obj.manufacturer = item.manufacturer
                    //         this.tableData.push(obj)
                    //     })
                    // }
                })
                .catch((error) => {
                    this.loading = false
                    console.log('error', error)
                })
        },

        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        searchData() {
            this.get_params.page = 1
            this.getList()
        },
        handleSizeChange(val) {
            this.get_params.size = val
            this.getList()
        },
        handleCurrentChange(val) {
            this.get_params.page = val
            this.getList()
        },
        handleSelectionChange(val) {
            console.log(val)
            this.multipleSelection = val
        }
    }
}
</script>

<style lang="scss" scoped>
.yibiaopan{
    ::v-deep .el-form-item__label{
        padding-bottom:5px !important;
    }
}
.treeselect{
    ::v-deep .el-form-item__label{
        padding-bottom:5px;
    }
}
.node-label {
        max-width:100px;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        word-break:keep-all;
    }
 .operate {
     .iconfont {
         color: #0052d9;
         font-size:14px;
     }
     span {
         margin-right: 10px;
         &:hover {
             cursor: pointer;
         }
     }
 }
.el-tree{
    // background: rgba(0,0,0,0);
}
.event  ::v-deep  .custom-tree-node{
    height: 26px;
    line-height: 26px;
}
.tree ::v-deep .el-tree--highlight-current .el-tree-node>.el-tree-node__content {
    .custom-tree-node{
        span:nth-child(1){
            color:#bfdce4!important;
        }
        span:nth-child(2){
            color:#fff!important;
        }

    }
}
.tree ::v-deep .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
    background-color: rgba(0,0,0,0)!important;
    .custom-tree-node{
        span{
            color:#1cd7fa!important;
        }
    }
}
.tree ::v-deep .el-tree--highlight-current .el-tree-node>.el-tree-node__content:hover{
    background-color: rgba(0,0,0,0)!important;
    .custom-tree-node{
        span{
            color:#1cd7fa!important;
        }
    }
}
.hightlight {
    color: #00fcff;
}

.event .el-divider {
    background-color: rgba(255, 255, 255, 0.2);
}

.event  ::v-deep  .el-divider__text {
    background-color: #1D3141;
    padding: 0 5px;
    color: #fff;
}

.event > .el-divider--horizontal {
    width: 97%;
}
.el-table th > .cell {
    white-space: pre-line;
    text-align: center;
}

.tag-list > .attendance-dialog {
    .el-dialog__header {
        .el-dialog__title {
            font-size: 14px;
        }
    }

    .el-form-item__label {
        font-size: 12px;
    }

    .el-input__inner,
    .el-textarea__inner {
        font-size: 12px;
    }
}

.dialog-item {
    margin-bottom: 30px;
}

.w50 {
    width: 50%;
}

.dialog-item {
    .dialog-label {
        display: inline-block;
        text-align: right;
        width: 86px;
        color: #fff;
        opacity: 0.6;
    }
}
.event ::v-deep .vue-treeselect__control {
    // height: 32px !important;
}
.tag-list ::v-deep .vue-treeselect__placeholder {
    line-height: 30px;
}
</style>
<style>
.vue-treeselect__single-value {
    line-height: 28px;
}
.vue-treeselect__control{
        height: 28px;
        line-height: 28px;
        font-size: 12px;
}
.custom-tree-node .node-label:hover {
    color: #0052d9 !important;
  }
  .custom-tree-node .node-edit:hover {
    color: #0052d9 !important;;
  }
  .custom-tree-node .node-del:hover {
    color: #0052d9 !important;
  }
  .el-tree-node__content {
    background-color: rgba(0, 0, 0, 0) !important;
    color: #0052d9;
  }
  /*高亮当前点击项*/
  .el-tree-node__content:hover,
  .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content .custom-tree-node .node-label {
    background: none !important;
    color: #0052d9 !important;
  }
</style>
