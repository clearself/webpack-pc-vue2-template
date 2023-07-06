<template>
    <div class="list">
        <SearchTop @search="searchDomain" @reset="reset">
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params">
                    <el-form-item label="拓扑名称：" label-width="80px">
                        <el-input placeholder="请输入" clearable v-model="get_params.name" @keyup.enter.native="searchDomain" size="small"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params">
                    <el-form-item label="资产名称：" label-width="80px">
                        <el-input placeholder="请输入" clearable v-model="get_params.assetsName" @keyup.enter.native="searchDomain" size="small"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
        </SearchTop>
        <div class="list-container">
            <div class="ub ub-pj w100 mb-1 ub-ac">
                <div class="list-tips">拓扑管理</div>
                <div>
                    <el-button icon="el-icon-plus" @click="select_assets" size="small" type="primary" v-per="['assets_topologyImg_add']">添加拓扑图</el-button>
                    <el-button style="margin-left: 10px;" @click="delAllTmap" size="small" type="danger" v-per="['assets_topologyImg_del']" icon="el-icon-delete">删除</el-button>
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
                <el-table-column prop="name" label="拓扑名称">
                </el-table-column>
                <el-table-column label="资产" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="tmap-assetsName">{{getAssets(scope.row.assets)}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="160">
                </el-table-column>
                <el-table-column align="center" label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="handleSee(scope.row)" v-per="['assets_topologyImg_look']">查看</el-button>
                        <el-button type="text" size="small" @click="handleEdit(scope.row)" v-per="['assets_topologyImg_edit']">编辑</el-button>
                        <el-button type="text" size="small" @click="delTmapBtn(scope.row)" v-per="['assets_topologyImg_del']">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size" @pagination="get_data" style="padding-top:10px;" v-show="total_num>0"/>
        </div>
        <DeleteDialog
            :dialogVisible = TmapAllDeleteDialog
            @delete="handleDeleteAll"
            @cancel="TmapAllDeleteDialog = false">
        </DeleteDialog>
        <DeleteDialog
            :dialogVisible = TmapDeleteDialog
            @delete="handleDelete"
            @cancel="TmapDeleteDialog = false">
        </DeleteDialog>
    </div>
</template>

<script>
import {
// addTmap,
    getTmapList,
    deleteTmap
} from '../../server/assets/api.js'
export default {
    name: 'Tmap',
    data() {
        return {
            tabHeight: document.body.clientHeight - 260,
            delIds: [],
            TmapAllDeleteDialog: false,
            TmapDeleteDialog: false,
            loading: false,
            total_num: 0,
            tableData: [],
            multipleSelection: [],
            get_params: {
                page: 1,
                size: 20,
                name: '',
                assetsName: ''
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
                name: '',
                assetsName: ''
            }
            this.get_data()
        },
        getAssets(assets) {
            if (assets && assets.length > 0) {
                let names = assets.map(item => {
                    return item.assetsName
                })
                return names.join(',')
            } else {
                return ''
            }
        },
        select_assets() {
            this.$router.push({
                name: 'assets_add_tmap_before'
            })
        },
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        searchDomain() {
            this.get_params.page = 1
            this.get_data()
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
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
                    name: this.get_params.name,
                    assetsName: this.get_params.assetsName
                }
            }
            getTmapList(data).then(res => {
                this.loading = false
                this.total_num = res.total
                let list = res.records
                if (list.length > 0) {
                    this.tableData = list
                }
            }).catch(error => {
                this.loading = false
                console.log('error' + error)
            })
        },

        delAllTmap() {
            if (this.multipleSelection.length === 0) {
                this.$message({
                    message: '请选择要删除的数据',
                    type: 'warning'
                })
            } else {
                this.TmapAllDeleteDialog = true
            }
        },
        handleDeleteAll() {
            this.deleteFun(true)
        },
        delTmapBtn(row) {
            this.delIds = [row.id]
            this.TmapDeleteDialog = true
        },
        handleDelete() {
            this.deleteFun()
        },
        deleteFun(isAll) {
            if (isAll) {
                this.delIds = this.multipleSelection.map(item => {
                    return item.id
                })
            }
            let data = {
                queryData: {},
                paramsData: {
                    ids: this.delIds
                }
            }
            deleteTmap(data).then(res => {
                this.TmapDeleteDialog = false
                this.TmapAllDeleteDialog = false
                console.log('删除成功')
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
        handleEdit(row) {
            this.$router.push({
                path: '/assets/assets_topo',
                query: {
                    from: 'edit',
                    id: row.id,
                    name: row.name
                }
            })
        },
        handleSee(row) {
            this.$router.push({
                path: '/assets/assets_topo',
                query: {
                    from: 'preview',
                    id: row.id,
                    name: row.name
                }
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
.row {
    display: flex;
    justify-content: space-between;
}
.event ::v-deep .el-input--small .el-input__inner {
    height: 30px;
    line-height: 30px;
}
.tmap-assetsName{
    color:#387dee;
    border-radius: 4px;
    border: solid 1px rgb(56, 125, 238,.4);
    background-color: rgba(56, 125, 238, 0.2);
    padding:2px 7px;
}
</style>
