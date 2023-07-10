
<template>
    <div class="bg-color mb-1">
        <div
            style="
                    width: 200px;
                    padding: 20px 5px 10px;
                    box-sizing: border-box;
                    overflow: auto;
                ">
            <div>
                <!-- <span style="position: absolute;width:10px;height:10px;background: red;top:50%;right:0;"></span> -->
                <div
                    class="ub ub-pj ub-ac w100"
                    style="
                            padding-left: 10px;
                            margin-bottom: 20px;
                            box-sizing: border-box;
                        ">
                    <div class="list-tips" style="margin-bottom: 0; font-size: 12px">
                        分组列表
                    </div>
                    <div class="operate">
                        <el-tooltip class="item" effect="dark" content="新建" placement="top">
                            <span class="iconfont icon-tianjia1" @click="handleAdd"></span>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="导入" placement="top">
                            <el-upload
                                :headers="header"
                                action="/api/data-center/manage/logType/import"
                                name="file"
                                :file-list="fileList"
                                :show-file-list="false"
                                :on-success="handleSuccess"
                                style="display: inline-block;">
                                <span class="iconfont icon-daoru1"></span>
                            </el-upload>
                        </el-tooltip>
                        <!-- <a :href="downloadUrl" download>
                            <span class="iconfont icon-daochu"></span>
                        </a> -->
                        <el-tooltip class="item" effect="dark" content="导出" placement="top">
                            <span class="iconfont icon-daochu1" @click="handleDownload"></span>
                        </el-tooltip>

                    </div>
                </div>
                <div style="padding: 0 5px 10px 5px">
                    <el-input  suffix-icon="el-icon-search" placeholder="请输入关键词搜索" clearable v-model="filterText" class="tree-input" size="mini">
                    </el-input>
                </div>
                <!-- <div class="tree-container"> -->
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
                    <span class="custom-tree-node" slot-scope="{ node, data }" @mouseenter="mouseenter(data)" @mouseleave="mouseleave(data)">
                        <span class="node-label" style="color:rgba(0, 0, 0, 0.9); font-size: 12px;margin-right:10px">{{
                            node.label
                        }}</span>
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                            <span style="color:rgba(0, 0, 0, 0.9); font-size: 12px;margin-right:6px" class="node-edit iconfont icon-bianji1" v-show="data.show" @click="editNode( data )"></span>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="top">
                            <span style="color:rgba(0, 0, 0, 0.9); font-size: 12px" class="node-del iconfont icon-shanchu3" v-show="data.show && data.grade !== 1 && $route.query.mode!==0 && $route.query.mode!==1" @click="delNode(data)"></span>
                        </el-tooltip>
                    </span>
                </el-tree>
            <!-- </div> -->
            </div>
        </div>
        <el-dialog title="提示" :visible.sync="delDialog" width="30%" custom-class="attendance-dialog">
            <span>确定删除吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="delDialog = false" style="margin-right:10px">取 消</el-button>
                <el-button type="primary" size="small" @click="handleDel">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="seeDialog" width="30%" custom-class="attendance-dialog">
            <span>是否放弃当前编辑的内容</span>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="handleCancel" style="margin-right:10px">取 消</el-button>
                <el-button type="primary" size="small" @click="handleSee">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getTree, deleteData, download } from '@/server/data_manage/data_classify.js'
export default {
    props: [],
    data() {
        return {
            mode: '',
            busId: '',
            parentId: '',
            fileList: [],
            seeDialog: false,
            delDialog: false,
            currentNodekey: '',
            grade: '',
            indent: 10,
            // depId: '',
            treeData: [],

            propsData: {
                children: 'child',
                label: 'name'
            },
            currentNode: {},
            filterText: ''
        }
    },
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val)
        }
    },
    mounted() {
        // this.$nextTick(() => {
        this.initTree()
        // })
    },
    computed: {
        downloadUrl() {
            return '/api/data_center/manage/logType/download'
        },
        header() {
            return { token: this.$getlocalStorage('initInfo').user.token }
        }
    },
    methods: {
        handleSee() {
            setTimeout(() => {
                this.$router.push({
                    name: 'data_manage_data_classify',
                    query: {
                        id: this.currentNode.id
                    }
                })
            }, 1500)
        },
        handleDownload() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            download(data).then(res => {
                this.$message({
                    message: '下载成功',
                    type: 'success'
                })
            }).catch(error => {
                console.log('error', error)
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
        handleSuccess(response, file, fileList) {
            console.log('response', response)
            if (response.code == 1) {
                this.$message({
                    message: '文件上传成功!',
                    type: 'success'
                })
                setTimeout(() => {
                    this.initTree()
                }, 1000)
            } else {
                this.$message({
                    message: response.message,
                    type: 'warning'
                })
            }
        },
        handleAdd() {
            this.$emit('getMode', 0)
            this.getParentId(this.currentNode)
            this.$setlocalStorage('treeClassifyData', {})
            this.$router.push({
                name: 'data_manage_data_classify_add',
                query: {
                    mode: 0,
                    id: this.currentNode.id,
                    parentId: this.parentId
                }
            })
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
            getTree(data).then(res => {
                this.treeData = res
                console.log(this.$route)
                // debugger
                if (this.$route.query.id) {
                    let currentNode = this.$getlocalStorage('treeClassifyData')
                    // this.getParentId(this.currentNode)
                    // this.$emit('getParentIdData', this.parentId)
                    // this.$emit('getCurrentNode', this.currentNode)
                    // console.log(this.currentNode)
                    this.getParentId(currentNode)
                    this.$emit('getParentIdData', this.parentId)
                    this.$emit('getCurrentNode', currentNode)
                    console.log(currentNode)
                    // debugger
                    this.$nextTick(() => {
                        this.$refs.tree.setCurrentKey(this.$route.query.id)
                    })
                } else {
                    this.currentNodekey = res[0].id
                    console.log(this.currentNodekey)
                    // debugger
                    this.grade = res[0].grade
                    this.currentNode = res[0]
                    this.$emit('getCurrentNode', this.currentNode)
                    this.$nextTick(() => {
                        this.$refs.tree.setCurrentKey(this.currentNodekey)
                        console.log(this.currentNodekey)
                    })
                }
                this.$emit('getTreeData', this.treeData)
            }).catch(error => {
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
            console.log(node)
            this.mode = 'edit'
            this.currentNode = node
            this.getParentId(this.currentNode)
            this.$setlocalStorage('treeClassifyData', this.currentNode)
            this.$emit('getCurrentNode', this.currentNode)
            this.$emit('editNode', node)
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
            deleteData(data).then(res => {
                this.delDialog = false
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
        filterNode(value, data) {
            if (!value) return true
            return data.name.indexOf(value) !== -1
        },
        handleCancel() {
            this.seeDialog = false
        },
        handleNodeClick(node) {
            if (this.mode === 'edit') {
                return
            }
            this.mode = 'handle'
            this.currentNode = node
            // this.depId = node.id
            this.grade = node.grade
            this.getParentId(this.currentNode)
            this.$emit('click', node)
            this.$emit('getParentIdData', this.parentId)
            this.$emit('getCurrentNode', this.currentNode)
            this.$setlocalStorage('treeClassifyData', this.currentNode)
            if (this.$route.query.mode === 1 && this.mode === 'handle') {
                this.seeDialog = true
                this.$setlocalStorage('treeClassifyData', node)
            }
        }
        // 关于树操作结束
    }

}
</script>

<style lang="scss" scoped>
.tree-line {
    height: 750px;
    overflow-y: auto;
}
 .operate {
     .iconfont {
         color: #387dee;
         font-size:14px;
     }
     span {
         margin-right: 10px;
         &:hover {
             cursor: pointer;
         }
     }
 }
// .list-tips {
//     height: 24px;
//     line-height: 24px;
//     &::before {
//         height: 24px;
//     }
// }
//  .operate {
//      .iconfont {
//          color: #1cd7fa;
//          font-size:12px;
//      }
//      span {
//          margin-right: 10px;
//          &:hover {
//              cursor: pointer;
//          }
//      }
//  }
//  .el-tree {
//     background: rgba(0, 0, 0, 0);
//   }
//     .tree ::v-deep .el-tree--highlight-current .el-tree-node > .el-tree-node__content {
//     .custom-tree-node {
//       span:nth-child(1) {
//         color: #bfdce4 !important;
//       }
//       span:nth-child(2) {
//         color: #fff !important;
//       }
//     }
//   }
//   .tree ::v-deep .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
//     background-color: rgba(0, 0, 0, 0) !important;
//     .custom-tree-node {
//       span {
//         color: #1cd7fa !important;
//       }
//     }
//   }
//   .tree ::v-deep .el-tree--highlight-current .el-tree-node > .el-tree-node__content:hover {
//     background-color: rgba(0, 0, 0, 0) !important;
//     .custom-tree-node {
//       span {
//         color: #fff !important;
//       }
//     }
//   }

</style>
<style lang="scss">
//   .event-content .custom-tree-node .node-label:hover {
//     color: #fff !important;
//   }
  /* .custom-tree-node .node-edit:hover {
    color: #00e9ff !important;;
  }
  .custom-tree-node .node-del:hover {
    color: #00e9ff !important;
  }
  .el-tree-node__content {
    background-color: rgba(0, 0, 0, 0) !important;
    color: #fff;
  }

  .el-tree-node__content:hover,
  .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content .custom-tree-node .node-label {
    background: none !important;
    color: #1cd7fa !important;
  } */
</style>
