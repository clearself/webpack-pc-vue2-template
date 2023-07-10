<template>
    <div>
        <div class="threat-config-list">
            <div class="ub ub-pj w100" style="margin-bottom: 10px; justify-content: space-between;">
                <div class="list-tips">列表内容</div>
                <div>
                    <el-button v-per="['intelligence_collect_add']" size="small" icon="el-icon-plus" type="primary" @click="goAdd">添加情报</el-button>
                </div>
            </div>
            <el-table ref="multipleTable"  v-loading="loading" class="bigTable" :data="tableData" border stripe :row-class-name="tableRowClassName" :height="tableHeight" tooltip-effect="dark">
                <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号"></el-table-column>
                <el-table-column prop="type" label="采集源名称">
                    <template slot-scope="scope">
                        {{ scope.row.type == 1 ? '微步' : 'venusEye' }}
                    </template>
                </el-table-column>
                <el-table-column prop="dockingWay" label="情报对接方式" width="100">
                    <template slot-scope="scope">
                        {{ scope.row.dockingWay == 1 ? '云端查询' : '保存至本地' }}
                    </template>
                </el-table-column>
                <el-table-column label="是否启用" prop="status" width="90">
                    <!-- <template slot-scope="scope">
                        {{ scope.row.status == 1 ? '禁用' : '启用' }}
                    </template> -->
                    <template slot-scope="scope">
                        <div class="switch-wrapper" :class="{'yes':!scope.row.status,'no':scope.row.status}"  @click="handleAction(scope.row)">
                            <div class="ub ub-ac ub-pj" :style="{'background':!scope.row.status?'#0052d9':'#c5c5c5'}">
                                <div style="margin-left: -1px"><i class="el-icon-check"></i></div>
                                <div></div>
                            </div>
                            <div class="circle"></div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="url" label="请求地址" width="auto"></el-table-column>
                <el-table-column prop="isAuto" label="同步方式" width="90">
                    <template slot-scope="scope">
                        {{ scope.row.isAuto == 1 ? '自动同步' : '手动同步' }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="120">
                    <template slot-scope="scope">
                        <el-button v-per="['intelligence_collect_edit']" size="small" type="text" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button v-per="['intelligence_collect_del']" size="small" type="text" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="total_num>0" :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size" @pagination="list" />
            <DeleteDialog
                :dialogVisible = deleteItemDialog
                @delete="handleDeleteItemFun"
                @cancel="deleteItemDialog = false">
            </DeleteDialog>
        </div>
    </div>
</template>

<script>
import { get_threat_config, saveStatus, delete_config } from '@/server/intelligence/api.js'
export default {
    name: 'ThreatIntelligence',
    data() {
        return {
            tableHeight: document.body.clientHeight - 195,
            loading: false,
            tableData: [],
            get_params: {
                page: 1,
                pageSize: 20
            },
            total_num: 0,
            deleteItemDialog: false,
            transitionData: null
        }
    },
    created() {
        this.list()
    },
    methods: {
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex % 2) {
                return 'table-row2'
            } else {
                return 'table-row1'
            }
        },
        list() {
            get_threat_config({ paramsData: { page: this.get_params.page, pageSize: this.get_params.pageSize }, queryData: {}}).then(res => {
                console.log(res)
                this.tableData = res.records
                this.total_num = res.total
            })
        },
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.pageSize + index + 1
        },
        goAdd() {
            this.$router.push('/intelligence/threat_config')
        },
        handleEdit(row) {
            this.$setsessionStorage('configDetail', row)
            this.$router.push(`/intelligence/threat_config?id=${row.id}`)
        },
        handleAction(row) {
            console.log(row)
            saveStatus({ paramsData: { id: row.id, status: row.status ? 0 : 1 }, queryData: {}}).then(res => {
                row.status = row.status ? 0 : 1
                this.$message({
                    message: '修改成功',
                    type: 'success'
                })
                this.list()
            })
        },
        handleDelete(row) {
            this.deleteItemDialog = true
            this.transitionData = row
            console.log(row)
        },
        handleDeleteItemFun() {
            console.log(this.transitionData.id)
            delete_config({ paramsData: { id: this.transitionData.id }, queryData: {}}).then(res => {
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                this.deleteItemDialog = false
                this.transitionData = null
                this.list()
            })
        },
        handleSizeChange(val) {
            this.get_params.pageSize = val
            this.list()
        },
        handleCurrentChange(val) {
            this.get_params.page = val
            this.list()
        }
    }
}
</script>

<style lang="scss" scoped>
    .threat-config-list {
        padding: 10px;
        background-color: #ffffff;
        box-shadow: 0px 0px 8px 0px rgba(140, 152, 164, 0.2);
        border-radius: 4px;
        border: solid 1px #dadee8;
        // height: calc(100vh - 80px);
    }
    .switch-wrapper{
    width:46px;
    height:20px;
    position: relative;
    cursor: pointer;
    // margin-left: 10px;
}
.switch-wrapper>div:nth-child(1){
    width:46px;
    height:20px;
    background-color: #0052d9;
    border-radius: 12px;
    div{
        font-size: 12px;
        line-height: 20px;
        padding:0 8px;
    }
    >div:nth-child(1){
        color: rgba(255,255,255,0.9);
    }
    >div:nth-child(2){
        color: rgba(255,255,255,0.9);
    }
}
.switch-wrapper>div:nth-child(2){
    width: 18px;
    height: 18px;
    position: absolute;
    left:0;
    top:53%;
    margin-top: -10px;
    border-radius:100%;
    background-color: #c5c5c5;
}
.switch-wrapper.yes>div:nth-child(2){
    animation: moveone 0s linear forwards;
}
.switch-wrapper.no>div:nth-child(2){
    animation: _moveone 0s linear forwards;
}
@keyframes moveone {
    0% {
        background-color: rgb(255,255,255);
        left: 0;
    }

    100% {
        background-color: rgb(255,255,255);
        left: 26px;
    }
}
@-webkit-keyframes moveone {
    0% {
        background-color: rgb(255,255,255);
        left: 1px;
    }

    100% {
        background-color: rgb(255,255,255);
        left: 26px;
    }
}
@keyframes _moveone {
    0% {
        background-color: rgb(255,255,255);
        left: 26px;
    }

    100% {
        background-color: rgb(255,255,255);
        left: 1px;
    }
}
@-webkit-keyframes _moveone {
    0% {
        background-color: rgb(255,255,255);
        left: 26px;
    }

    100% {
        background-color: rgb(255,255,255);
        left: 1px;
    }
}
.event  ::v-deep  .bigTable.el-table td {
    min-height: 34px !important;
    padding: 4px 0 !important;
}
@keyframes moveone_white {
    0% {
        background-color: #fff;
        box-shadow: 0px 0px 10px 0px #e5e5e5;
        left: 1px;
    }

    100% {
        background-color: #fff;
        box-shadow: 0px 0px 10px 0px #e5e5e5;
        left: 37px;
    }
}
@-webkit-keyframes moveone_white {
    0% {
        background-color: #fff;
        box-shadow: 0px 0px 10px 0px #e5e5e5;
        left: 1px;
    }

    100% {
        background-color: #fff;
        box-shadow: 0px 0px 10px 0px #e5e5e5;
        left: 37px;
    }
}
@keyframes _moveone_white {
    0% {
        background-color: #fff;
        box-shadow: 0px 0px 10px 0px #e5e5e5;
        left: 37px;
    }

    100% {
        background-color: #fff;
        box-shadow: 0px 0px 10px 0px #e5e5e5;
        left: 1px;
    }
}
@-webkit-keyframes _moveone_white {
    0% {
        background-color: #fff;
        box-shadow: 0px 0px 10px 0px #e5e5e5;
        left: 37px;
    }

    100% {
        background-color: #fff;
        box-shadow: 0px 0px 10px 0px #e5e5e5;
        left: 1px;
    }
}
</style>
