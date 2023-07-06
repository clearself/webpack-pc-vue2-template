
<template>
    <div>
        <div class="classify">
            <div>
                <!-- <span style="position: absolute;width:10px;height:10px;background: red;top:50%;right:0;"></span> -->
                <div
                    class="ub ub-pj ub-ac w100"
                    style="margin-bottom: 10px;box-sizing: border-box;">
                    <div class="" style="margin-bottom: 0; font-size: 12px">
                        分类管理
                    </div>
                    <div class="operate">
                        <el-tooltip class="item" effect="dark" content="新建" placement="top">
                            <span class="iconfont icon-tianjia" @click="handleAdd"></span>
                        </el-tooltip>
                    </div>
                </div>
                <!--<div style="padding: 0 0 10px 0">-->
                <!-- <el-input suffix-icon="el-icon-search" placeholder="请输入关键词搜索" clearable v-model="filterText" class="tree-input" size="mini">
                    </el-input> -->
                <!--</div>-->
                <el-tree
                    ref="tree"
                    class="tree-line"
                    node-key="id"
                    :filter-node-method="filterNode"
                    :current-node-key="currentNodekey"
                    :default-expand-all="true"
                    :highlight-current="true"
                    :data="treeData"
                    :props="propsData"
                    @node-click="handleNodeClick"
                    :expand-on-click-node="false"
                    :indent="indent">
                    <span class="custom-tree-node ub" slot-scope="{ node, data }" @mouseenter="mouseenter(data)" @mouseleave="mouseleave(data)">
                        <el-tooltip class="item" effect="dark" :content="node.label" placement="top" :open-delay="1000">
                            <div class="node-label" style="color: #36373a; font-size: 12px;margin-right:5px;width:50px !important">{{
                                node.label
                            }}</div>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                            <span style="color: #fff; font-size: 12px;margin-right:6px" class="node-edit iconfont icon-bianji1" v-show="data.show&&data.grade!==1" @click="editNode( data )"></span>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="top">
                            <span style="color: #fff; font-size: 12px" class="node-del iconfont icon-shanchu3" v-show="data.show&&data.grade!==1" @click="delNode(data)"></span>
                        </el-tooltip>
                    </span>
                </el-tree>
            <!-- </div> -->
            </div>
        </div>
        <DeleteDialog
            :dialogVisible = delDialog
            @delete="handleDel"
            @cancel="delDialog = false">
        </DeleteDialog>
        <el-dialog :append-to-body="true" :title="addForm.id?'编辑分组':'添加分组'" :visible.sync="addDialog" width="700px" custom-class="common-dialog">
            <div style="width:100%;margin: 0 auto;">
                <el-form label-width="80px" label-position="top" :rules="rules" ref="addForm" :model="addForm">
                    <el-form-item label="父级:">
                        <treeselect
                            class="treeselect"
                            style="width:100%;"
                            :options="treeData"
                            :normalizer="normalizer"
                            noChildrenText="当前分支无子节点"
                            noOptionsText="无可用选项"
                            noResultsText="无可用选项"
                            placeholder="请选择"
                            v-model="addForm.parentId"
                        />
                    </el-form-item>
                    <el-form-item label="名称:" prop="name">
                        <el-input maxlength="100" v-model="addForm.name" placeholder="请输入" style="width: 100%" size="small" clearable></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="addDialog = false">取 消</el-button>
                <el-button size="small" type="primary" @click="submitAdd('addForm')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { findSearchType, saveSearchType, deleteSearchType } from '@/server/data_manage/new_search.js'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
    props: ['recordDialog'],
    components: { Treeselect },
    data() {
        return {
            normalizer(node) {
                // if (node.child && !node.child.length) {
                //     delete node.child
                // }
                return {
                    id: node.id,
                    label: node.name,
                    children: node.child
                }
            },
            rules: {
                name: { required: true, message: '请输入', trigger: 'blur' }
            },
            addDialog: false,
            addForm: {
                id: '',
                name: '',
                parentId: ''
            },
            mode: '',
            busId: '',
            parentId: '',
            fileList: [],
            delDialog: false,
            currentNodekey: '',
            indent: 2,
            // depId: '',
            treeData: [],

            propsData: {
                children: 'child',
                label: 'name'
            },
            currentNode: {
                id: ''
            },
            filterText: ''
        }
    },
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val)
        },
        recordDialog(val) {
            if (val) {
                this.initTree()
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.initTree()
        })
    },
    computed: {},
    methods: {
        submitAdd(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.addForm.id) {
                        this.editSuccess()
                    } else {
                        this.addSuccess()
                    }
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        addSuccess() {
            let obj = {
                queryData: {},
                paramsData: {
                    name: this.addForm.name,
                    parentId: this.addForm.parentId
                }
            }
            saveSearchType(obj).then(res => {
                console.log(res)
                this.addDialog = false
                this.$message({
                    message: '添加成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.initTree()
                }, 1000)
            }).catch(err => {
                this.addDialog = false
                console.log(err + 'err')
            })
        },
        editSuccess() {
            let obj = {
                queryData: {},
                paramsData: {
                    id: this.addForm.id,
                    name: this.addForm.name,
                    parentId: this.addForm.parentId
                }
            }
            saveSearchType(obj).then(res => {
                console.log(res)
                this.addDialog = false
                this.$message({
                    message: '修改成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.initTree()
                }, 1000)
            }).catch(err => {
                this.addDialog = false
                console.log(err + 'err')
            })
        },
        findAllParent(node, tree, parentNodes = [], index = 0) {
            if (!node || node.fid == 0) {
                return
            }
            this.findParent(node, parentNodes, tree)
            let parentNode = parentNodes[index]
            this.findAllParent(parentNode, tree, parentNodes, ++index)
            return parentNodes
        },
        findParent(node, parentNodes, tree) {
            for (let i = 0; i < tree.length; i++) {
                let item = tree[i]
                if (item.id === node.fid) {
                    parentNodes.push(item)
                    return
                }
                if (item.child && item.child.length > 0) {
                    this.findParent(node, parentNodes, item.child)
                }
            }
        },
        handleAdd() {
            this.addForm.id = ''
            this.addDialog = true
        },
        getParentId(currentNode) {
            if (currentNode.grade == 3) {
                let nodes = []
                let twoNode = this.findAllParent({ id: currentNode.id, fid: currentNode.parentId }, this.treeData, nodes)
                this.parentId = twoNode[0].parentId
                this.busId = twoNode[0].busId
                this.$emit('getBusIdData', this.busId)
            } else if (currentNode.grade == 2) {
                this.parentId = currentNode.parentId
            } else if (currentNode.grade == 1) {
                this.parentId = currentNode.id
            }
        },
        // 关于树操作开始
        initTree() {
            this.treeData = []
            let data = {
                queryData: {},
                paramsData: {}
            }
            findSearchType(data)
                .then(res => {
                    this.treeData = res
                    console.log(this.$route)
                    // debugger

                    this.currentNodekey = res[0].id
                    console.log(this.currentNodekey)
                    // debugger
                    this.currentNode = res[0]
                    this.$emit('getCurrentNode', this.currentNode)
                    this.$nextTick(() => {
                        this.$refs.tree.setCurrentKey(this.currentNodekey)
                        console.log(this.currentNodekey)
                    })

                    this.$emit('getTreeData', this.treeData)
                })
                .catch(error => {
                    console.log('error' + error)
                })
        },
        // 树节点鼠标移入移出
        mouseenter(data) {
            this.$set(data, 'show', true)
        },
        mouseleave(data) {
            this.$set(data, 'show', false)
        },
        editNode(node) {
            this.mode = 'edit'
            this.currentNode = node
            this.addForm.parentId = node.parentId
            this.addForm.id = node.id
            this.addForm.name = node.name
            this.editDisabled(this.treeData)
            this.addDialog = true
            // this.getParentId(this.currentNode)
            this.$emit('getCurrentNode', this.currentNode)
            this.$emit('editNode', node)
        },
        editDisabled(arr) {
            if (arr.length === 0) {
                return []
            }
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].id == this.currentNode.id) {
                    arr[i].isDisabled = true
                } else {
                    arr[i].isDisabled = false
                }
                if (arr[i].child.length > 0) {
                    this.editDisabled(arr[i].child)
                }
            }
        },
        delNode(val) {
            this.delDialog = true
            console.log(val)
        },
        handleDel() {
            let data = {
                queryData: {},
                paramsData: {
                    id: this.currentNode.id
                }
            }
            deleteSearchType(data)
                .then(res => {
                    this.delDialog = false
                    this.$message({
                        message: '删除成功！',
                        type: 'success'
                    })
                    setTimeout(() => {
                        this.initTree()
                    }, 1500)
                })
                .catch(error => {
                    console.log('error', error)
                })
        },
        filterNode(value, data) {
            if (!value) return true
            return data.name.indexOf(value) !== -1
        },
        handleNodeClick(node) {
            if (this.mode === 'edit') {
                return
            }
            this.mode = 'handle'
            this.currentNode = node
            // this.depId = node.id
            // this.grade = node.grade
            this.getParentId(this.currentNode)
            this.$emit('click', node)
            this.$emit('getParentIdData', this.parentId)
            this.$emit('getCurrentNode', this.currentNode)
            this.$setlocalStorage('treeClassifyData', this.currentNode)
        }
    // 关于树操作结束
    }
}
</script>
<style lang="scss" scoped>
  // .list-tips {
  //     height: 24px;
  //     line-height: 24px;
  //     &::before {
  //         height: 24px;
  //     }
  // }
  .classify {
    border-radius: 4px;
    background-color: rgba(56, 125, 238, 0.1);
    width: 180px;
    padding: 10px;
    box-sizing: border-box;
    // position: absolute;
    // left: 0px;
    // top: 0px;
    bottom: 0;
    border: solid 1px #dddddd;
    overflow: auto;
    min-height: 380px;
  }
  .operate {
    .iconfont {
      color: #0052D9;
      font-size: 12px;
    }
    span {
      margin-right: 10px;
      &:hover {
        cursor: pointer;
      }
    }
  }
  .el-tree {
    background: rgba(0, 0, 0, 0);
  }
</style>
<style lang="scss">
.common-dialog {
    .el-input__inner {
        // background: transparent;
        // border: 1px solid #0052D9;
        // box-shadow: 0px 0px 7px #389bf7 inset;
        // color: #fff;
        font-size: 12px !important;
    }
    .custom-tree-node {
     .node-label {
        width:40px;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        word-break:keep-all;
      }
    }
}
  .classify .el-tree--highlight-current .el-tree-node > .el-tree-node__content {
    .custom-tree-node {
      //   span:nth-child(1) {
      //     color: #bfdce4 !important;
      //   }
      //   span:nth-child(2) {
      //     color: #fff !important;
      //   }
    }
  }
  .classify .el-tree--highlight-current .el-tree-node > .el-tree-node__content:hover {
    background-color: rgba(0, 0, 0, 0) !important;
    .custom-tree-node {
      span {
        color: #767d88 !important;
      }
      .item:hover {
        color: #397eee !important;
      }
    }
  }
  .classify .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
    background-color: rgba(0, 0, 0, 0) !important;
    .custom-tree-node {
     .node-label {
        color: #3375e1 !important;
      }
    }
  }

  // .classify .el-tree .custom-tree-node .item:hover {
  //     color: #0052D9 !important;
  //   }
</style>
