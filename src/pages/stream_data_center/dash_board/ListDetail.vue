<template>
    <div class="event list-detail ub">
        <div class="left">
            <div class="title" style="margin-bottom: 20px">仪表盘分组</div>
            <el-tree
                class="tree-line"
                ref="tree"
                node-key="id"
                :default-expand-all="true"
                :highlight-current="true"
                :data="treeData"
                :props="propsData"
                @node-click="handleNodeClick"
                :expand-on-click-node="false"
                :indent="indent"
            >
                <div class="custom-tree-node ub" slot-scope="{ node }">
                    <div class="node-label" style="color:rgba(0, 0, 0, 0.9);font-size: 12px;margin-right:10px">{{ node.label }}</div>
                </div>
            </el-tree>
        </div>
        <div class="right">
            <div class="title" style="margin-bottom: 10px">仪表盘列表</div>
            <div class="search">
                <el-input placeholder="请输入仪表盘名称" clearable v-model="get_params.name" class="tree-input" size="small" style="width: 500px">
                    <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
                </el-input>
            </div>
            <el-table
                ref="multipleTable"
                v-loading="loading"
                class="bigTable"
                :data="tableData"
                :row-key="
                    row => {
                        return row.id
                    }
                "
                :row-class-name="tableRowClassName"
                :row-style="{ height: '32px' }"
                :header-row-style="{ height: '32px' }"
                border
                stripe
                tooltip-effect="dark"
            >
                <!-- <el-table-column align="center" type="selection" :reserve-selection="true" width="50"></el-table-column> -->
                <el-table-column align="center" type="index" width="50" label="序号" :index="indexMethod"></el-table-column>
                <el-table-column prop="name" label="仪表盘名" width="200"></el-table-column>
                <el-table-column prop="groupName" label="所属分组" width="200">
                    <template slot-scope="scope">
                        {{ scope.row.groupName || '--' }}
                    </template>
                </el-table-column>
                <el-table-column prop="labelName" label="包含的标签页" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ scope.row.labelName || '--' }}
                    </template>
                </el-table-column>
                <el-table-column prop="user_name" label="创建人" width="200">
                    <template slot-scope="scope">
                        {{ scope.row.user_name || '--' }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="80" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="handleSee(scope.row)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="total_num>0" :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size" @pagination="getList" />
            <!-- <div class="pagination">
                <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="get_params.page"
                    :page-sizes="[20, 30, 40, 50]"
                    :page-size="get_params.size"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total_num"
                ></el-pagination>
            </div> -->
        </div>
    </div>
</template>

<script>
import { findSearchType, searchPage } from '@/server/stream_data_center/dash_board.js'
export default {
    data() {
        return {
            loading: false,
            currentNode: {
                id: ''
            },
            isFirst: true,
            indent: 10,
            propsData: {
                children: 'child',
                label: 'name'
            },
            depId: '',
            treeData: [],
            tableData: [],
            total_num: 0,
            get_params: {
                page: 1,
                size: 20,
                name: ''
            }
        }
    },
    mounted() {
        this.initTree()
    },
    methods: {
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex % 2) {
                return 'table-row2'
            } else {
                return 'table-row1'
            }
        },
        handleSearch() {
            this.get_params.page = 1
            this.getList()
        },
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        initTree() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            findSearchType(data)
                .then(res => {
                    console.log('tree', res)
                    if (this.isFirst) {
                        // this.depId = res[0].child[0].id
                        this.depId = res[0].id
                        this.getList()
                    }
                    this.isFirst = false
                    this.treeData = res
                })
                .then(() => {
                    this.$refs.tree.setCurrentKey(this.depId)
                })
                .catch(error => {
                    console.log('error' + error)
                })
        },
        handleSee(row) {
            this.$emit('see', row)
        },
        initParams() {
            this.get_params = {
                page: 1,
                size: 20,
                name: ''
            }
            this.total_num = 0
        },
        getList() {
            this.tableData = []
            this.loading = true
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
                .then(res => {
                    this.loading = false
                    this.total_num = res.total
                    this.tableData = res.records
                })
                .catch(error => {
                    this.loading = false
                    console.log('error', error)
                })
        },
        handleNodeClick(node) {
            // if (node.grade === 1) return
            this.currentNode = node
            console.log(node)
            this.depId = node.id
            this.initParams()
            this.getList()
        },
        handleSizeChange(val) {
            this.get_params.size = val
            this.getList()
        },
        handleCurrentChange(val) {
            this.get_params.page = val
            this.getList()
        }
    }
}
</script>

<style lang="scss" scoped>
.list-detail {
    background-color: #fff;
    box-shadow: 0px 0px 8px 0px rgba(140, 152, 164, 0.2);
    ::v-deep .el-tree-node__content:hover {
        background-color: unset;
        .node-label {
            // color: #fff!important;
        }
    }
    ::v-deep .el-tree-node__content {
        background-color: unset!important;
    }
    ::v-deep .el-table__header {
        th {
            height: 30px!important;
            box-sizing: border-box;
            padding: 0;
        }
        .cell {
            height: 29px!important;
            line-height: 29px;
        }
        td {
            height: 30px!important;
        }
        tr {
            height: 30px!important;
            box-sizing: border-box;
        }
    }
    ::v-deep .el-table__body-wrapper {
        .cell {
            height: 29px!important;
            line-height: 29px;
        }
        .el-table__row {
            td {
                height: 30px!important;
                box-sizing: border-box;
                padding: 0!important;
            }
        }
        tr {
            height: 30px!important;
            box-sizing: border-box;
        }
    }
    ::v-deep .el-table__fixed-right {
        .cell {
            height: 29px!important;
            line-height: 29px;
        }
        .el-table__row {
            td {
                height: 30px!important;
                box-sizing: border-box;
                padding: 0!important;
            }
        }
        tr {
            height: 30px!important;
            box-sizing: border-box;
        }
    }
}
.node-label {
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: keep-all;
}
.search {
    margin-bottom: 10px;
}
.title {
    font-family: MicrosoftYaHei;
    font-size: 14px;
    color: rgba(0,0,0,0.9);
    // box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.61);
}
.right {
    width: calc(100% - 200px);
    border: 1px solid #dadee8;
    box-sizing: border-box;
    padding: 10px 10px 10px 10px;
    border-left: none;
}
.left {
    width: 200px;
    border: 1px solid #dadee8;
    box-sizing: border-box;
    padding: 10px 20px 20px 10px;
}
.el-tree {
    // background: rgba(0, 0, 0, 0);
}
.event ::v-deep .custom-tree-node {
    height: 26px;
    line-height: 26px;
}
.tree ::v-deep .el-tree--highlight-current .el-tree-node > .el-tree-node__content {
    .custom-tree-node {
        span:nth-child(1) {
            color: #bfdce4 !important;
        }
        span:nth-child(2) {
            color: #fff !important;
        }
    }
}
.tree ::v-deep .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
    background-color: rgba(0, 0, 0, 0) !important;
    .custom-tree-node {
        span {
            color: #1cd7fa !important;
        }
    }
}
.tree ::v-deep .el-tree--highlight-current .el-tree-node > .el-tree-node__content:hover {
    background-color: rgba(0, 0, 0, 0) !important;
    .custom-tree-node {
        span {
            color: #1cd7fa !important;
        }
    }
}
.hightlight {
    color: #00fcff;
}
</style>
<style lang="scss">
.el-input-group__append,
.el-input-group__prepend {
    // background-color: rgba($color: #000000, $alpha: 0);
    // color: #00e9ff;
    // border: solid 1px #1cd7fa;
    border-left: none;
    // box-shadow: inset 0px 0px 7px 0px #389bf7;
    padding: 0 10px;
    line-height: 20px;
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
