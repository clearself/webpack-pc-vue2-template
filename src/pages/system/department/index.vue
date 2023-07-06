<template>
    <div class="list">
        <!-- <SearchTop @search="search" @reset="reset">
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params">
                    <el-form-item label="部门名称:" label-width="80px">
                        <el-input size="small" clearable v-model.trim="get_params.name" placeholder="请输入"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
        </SearchTop> -->
        <div class="list-container">
            <div class="ub ub-pj w100 mb-1">
                <div class="list-tips">列表内容</div>
                <div>
                    <el-button v-per="['base_dep_add']" size="small" icon="el-icon-plus" type="primary" @click="add">添加部门</el-button>
                    <el-button v-per="['base_dep_del']" size="small" icon="el-icon-delete" type="danger" @click="deleteAll" >删除部门</el-button>
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
                row-key="id"
                default-expand-all
                :tree-props="{ children: 'sub', hasChildren: 'hasChildren'}"
                @selection-change="handleSelectionChange"
                @select="select"
                @select-all="selectAll"
                :height="tableHeight"
                :row-style="{ height: '32px' }"
                :header-row-style="{ height: '32px' }">
                <el-table-column type="selection" width="50"></el-table-column>
                <el-table-column align="center" type="index" width="50" label="序号"></el-table-column>
                <el-table-column align="left" prop="name" label="部门名称"></el-table-column>
                <el-table-column align="left" prop="createTime" label="创建时间" width="170"> </el-table-column>
                <el-table-column label="操作" align="center" width="160" fixed="right">
                    <template slot-scope="scope">
                        <el-button v-per="['base_dep_edit']" type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button v-per="['base_dep_del']" type="text" size="small" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" /> -->
        </div>

        <AddEditDialog
            ref="addEdit"
            @close="addDialog = false"
            @submit="submitAddUser"
            :type="handleType"
            :tree-data="tableData"
            :dialogVisible="addDialog">
        </AddEditDialog>
        <DeleteDialog
            :dialogVisible = deleteDialog
            @delete="sureDelete"
            @cancel="deleteDialog = false">
        </DeleteDialog>
    </div>

</template>

<script>
import initData from '@/mixins/initData.js'
import AddEditDialog from '@/pages/system/department/add_dialog'
import { department_list, department_delete } from '@/server/system/department.js'
export default {
    name: 'Department',
    mixins: [initData],
    components: {
        AddEditDialog
    },
    data() {
        return {
            tableHeight: document.body.clientHeight - 170,
            deleteId: '',
            handleType: 'add',
            get_params: {
                // name: ''
            },
            curId: '',
            deleteDialog: false,
            addDialog: false,
            tableData: [],
            multipleSelection: []
        }
    },
    watch: {
        addDialog(newVal) {
            if (!newVal) {
                this.$refs.addEdit.$refs.departmentForm.resetFields()
                this.$refs.addEdit.departmentForm.parentId = null
            }
        }
    },
    mounted() {
    },
    created() {
        this.initList()
    },
    beforeDestroy() {
        console.log('关闭了')
    },
    methods: {
        setChildren(children, type) {
            children.map((j) => {
                this.toggleSelection(j, type)
                if (j.sub) {
                    this.setChildren(j.sub, type)
                }
            })
        },
        select(selection, row) {
            if (
                selection.some((el) => {
                    return row.id === el.id
                })
            ) {
                if (row.sub) {
                    this.setChildren(row.sub, true)
                }
            } else {
                if (row.sub) {
                    this.setChildren(row.sub, false)
                }
            }
        },
        toggleSelection(row, select) {
            if (row) {
                this.$nextTick(() => {
                    this.$refs.multipleTable && this.$refs.multipleTable.toggleRowSelection(row, select)
                })
            }
        },
        selectAll(selection) {
            const isSelect = selection.some((el) => {
                const tableDataIds = this.tableData.map((j) => j.id)
                return tableDataIds.includes(el.id)
            })
            const isCancel = !this.tableData.every((el) => {
                const selectIds = selection.map((j) => j.id)
                return selectIds.includes(el.id)
            })
            if (isSelect) {
                selection.map((el) => {
                    if (el.sub) {
                        this.setChildren(el.sub, true)
                    }
                })
            }
            if (isCancel) {
                this.tableData.map((el) => {
                    if (el.sub) {
                        this.setChildren(el.sub, false)
                    }
                })
            }
            this.$emit('handleSelect', this.tableData)
        },

        add() {
            this.handleType = 'add'
            this.initDisabled(this.tableData)
            this.addDialog = true
        },
        search() {
            this.initList()
        },
        reset() {
            // this.get_params.name = ''
            this.initList()
        },
        deleteAll() {
            if (this.multipleSelection.length === 0) {
                this.$message({
                    message: '请选择要删除的数据',
                    type: 'warning'
                })
                return
            }
            this.deleteIds = this.multipleSelection.map(item => {
                return item.id
            })
            this.deleteDialog = true
        },
        handleEdit(row) {
            console.log(row)
            this.handleType = 'edit'
            this.curId = row.id
            this.$refs.addEdit.departmentForm.parentId = row.parentId || null
            this.$refs.addEdit.departmentForm.name = row.name
            this.editDisabled(this.tableData)
            this.addDialog = true
        },
        handleDelete(row) {
            this.deleteIds = [row.id]
            this.deleteDialog = true
        },
        sureDelete() {
            let data = {
                queryData: {},
                paramsData: {
                    ids: this.deleteIds
                }
            }
            department_delete(data).then(res => {
                this.deleteDialog = false
                this.$message({
                    message: '操作成功！',
                    type: 'success'
                })
                setTimeout(() => {
                    this.initList()
                }, 500)
            }).catch(error => {
                this.deleteDialog = false
                console.log('error' + error)
            })
        },
        submitAddUser(val) {
            console.log(val, '子组件')
        },

        initList() {
            this.listLoading = true
            this.tableData = []
            let data = {
                queryData: {},
                paramsData: {}
            }
            department_list(data).then(res => {
                console.log('部门列表', res)
                this.listLoading = false
                let list = res
                if (list.length > 0) {
                    this.initDisabled(list)
                    this.tableData = list.map(item => {
                        return item
                    })
                    console.log('this.tableData', this.tableData)
                }
            }).catch(error => {
                this.listLoading = false
                console.log('error' + error)
            })
        },
        editDisabled(arr) {
            if (arr.length === 0) {
                return []
            }
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].id === this.curId) {
                    arr[i].isDisabled = true
                } else {
                    arr[i].isDisabled = false
                }
                if (arr[i].sub.length > 0) {
                    this.editDisabled(arr[i].sub)
                }
            }
        },
        initDisabled(arr) {
            if (arr.length === 0) {
                return []
            }
            for (let i = 0; i < arr.length; i++) {
                arr[i].isDisabled = false
                if (arr[i].sub.length > 0) {
                    this.initDisabled(arr[i].sub)
                }
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        }
    }
}
</script>

<style scoped lang="scss">
</style>
