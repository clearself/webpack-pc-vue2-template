<template>
    <div class="list auto">
        <SearchTop @search="search" @reset="reset" style="border-top-left-radius:0;border-top-right-radius:0;box-shadow:none">
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params">
                    <el-form-item label="动作名称：" label-width="80px">
                        <el-input placeholder="请输入" clearable v-model="get_params.name" size="small" maxlength="20"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :md="13" :lg="9" :xl="7">
                <el-form :model="get_params">
                    <el-form-item label="执行时间：" class="date-close" label-width="85px">
                        <el-date-picker style="width:100%;" clearable size="small" prefix-icon="iconfont icon-riqi" value-format="yyyy-MM-dd HH:mm:ss" v-model="sayTimes" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                </el-form>
            </el-col>
        </SearchTop>
        <div class="list-container">
            <div class="ub ub-pj w100 mb-1 ub-ac">
                <div class="list-tips">动作执行列表</div>
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
                :height="tabHeight"
                :row-style="{ height: '32px' }"
                :header-row-style="{ height: '32px' }">
                <el-table-column type="index" width="50" label="序号" align="center" :index="indexMethod">
                </el-table-column>
                <el-table-column prop="actionName" label="动作名称"></el-table-column>
                <el-table-column prop="facilityCount" label="关联设备(个)"></el-table-column>
                <el-table-column prop="startTime" label="动作执行时间"></el-table-column>
                <el-table-column prop="statusName" label="动作执行状态">
                    <template slot-scope="scope">
                        <span
                            style="display: inline-block;width: 140px; heihgt: 20px;text-align: center;border-radius: 24px;color:#03864F;background-color: #CCF5E4;"
                            v-if="scope.row.statusName == '进行中'"
                        >
                            进行中
                        </span>
                        <span
                            style="display: inline-block;width: 140px; heihgt: 20px;text-align: center;border-radius: 24px;color:#0052D9;background-color: #D5E5FA;"
                            v-if="scope.row.statusName == '已完成'"
                        >
                            已完成
                        </span>
                        <span
                            style="display: inline-block;width: 140px; heihgt: 20px;text-align: center;border-radius: 24px;color:#A502CF;background-color: #FAD7F6;"
                            v-if="scope.row.statusName == '已撤销'"
                        >
                            已撤销
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="动作执行结果">
                    <template slot-scope="scoped">
                        <div>{{scoped.row.proceedCount}}/{{scoped.row.completeCount}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="endTime" label="动作结束时间"></el-table-column>
                <el-table-column align="center" label="操作" width="60">
                    <template slot-scope="scope">
                        <el-button v-per="['auto_dz_look']" type="text" size="small" @click="handleSee(scope.row)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size" @pagination="get_data" style="padding-top:10px;" v-show="total_num>0"/>
        </div>
        <el-drawer title="查看" :visible.sync="seeDialog" :size="720">
            <el-descriptions :column="1" size="mini" border>
                <el-descriptions-item label="动作名称">{{seeForm.actionName||'--'}}</el-descriptions-item>
                <el-descriptions-item label="分组名称">{{seeForm.grouping||'--'}}</el-descriptions-item>
                <el-descriptions-item label="绑定应用">{{seeForm.systemName||'--'}}</el-descriptions-item>
                <el-descriptions-item label="动作描述">{{seeForm.description||'--'}}</el-descriptions-item>
            </el-descriptions>
            <div class="title mt-1 mb-1">关联设备</div>
            <el-table
                ref="multipleTable"
                v-loading="loading"
                class='bigTable'
                :data="alarmList"
                border
                stripe
                tooltip-effect="dark"
                :row-class-name="tableRowClassName"
                :row-style="{ height: '32px' }"
                :header-row-style="{ height: '32px' }">
                <el-table-column type="index" width="50" label="序号" align="center">
                </el-table-column>
                <el-table-column prop="facilityName" label="设备名称"></el-table-column>
                <el-table-column prop="orgName" label="所属组织"></el-table-column>
                <el-table-column prop="statusName" label="动作执行状态"></el-table-column>
            </el-table>
            <el-tabs v-model="activeName">
                <el-tab-pane label="输入参数" name="first">
                    <el-table
                        ref="multipleTable"
                        v-loading="loading"
                        class='bigTable'
                        :data="imports"
                        border
                        stripe
                        tooltip-effect="dark"
                        :row-class-name="tableRowClassName"
                        :row-style="{ height: '32px' }"
                        :header-row-style="{ height: '32px' }">
                        <el-table-column type="index" width="50" label="序号" align="center">
                        </el-table-column>
                        <el-table-column prop="name" label="参数名称"></el-table-column>
                        <el-table-column prop="paramData" label="参数值"></el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="输出参数" name="second">
                    <el-table
                        ref="multipleTable"
                        v-loading="loading"
                        class='bigTable'
                        :data="outputs"
                        border
                        stripe
                        tooltip-effect="dark"
                        :row-class-name="tableRowClassName"
                        :row-style="{ height: '32px' }"
                        :header-row-style="{ height: '32px' }">
                        <el-table-column
                            label="序号"
                            type="index"
                            width="50">
                        </el-table-column>
                        <el-table-column prop="name" label="参数名称"></el-table-column>
                        <el-table-column prop="type" label="参数类型">
                            <template slot-scope="scope">
                                <div>{{scope.row.type | typeList}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="default" label="默认值"></el-table-column>
                        <!-- <el-table-column prop="parameter" label="参数值"></el-table-column> -->
                        <el-table-column prop="des" label="参数描述"></el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-drawer>
    </div>
</template>
<script>
import { actionRecordPage, actionRecordGetList } from '@/server/auto_respond/execution_list'
export default {
    data() {
        return {
            get_params: {
                page: 1,
                size: 20,
                name: '',
                type: ''
            },
            sayTimes: [],
            loading: false,
            tableData: [],
            tabHeight: document.body.clientHeight - 286,
            total_num: 0,
            seeDialog: false,
            activeName: 'first',
            seeForm: {},
            imports: [],
            outputs: [],
            alarmList: []
        }
    },
    watch: {
        seeDialog(val) {
            if (!val) {
                this.seeForm = {}
                this.imports = []
                this.outputs = []
                this.alarmList = []
            }
        }
    },
    filters: {
        typeList(val) {
            console.log(val)
            if (val == 1) {
                return 'String'
            } else if (val == 2) {
                return 'Int'
            } else if (val == 3) {
                return 'Float'
            } else if (val == 4) {
                return 'Boolean'
            } else if (val == 5) {
                return 'ID'
            } else {
                return ''
            }
        }
    },
    created() {
        this.get_data()
    },
    methods: {
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        handleSee(row) {
            this.imports = typeof row.paramList == 'string' ? JSON.parse(row.paramList) : []
            this.outputs = JSON.parse(row.outInput).outputs
            this.seeForm = row
            let data = {
                queryData: {},
                paramsData: {
                    id: row.id,
                    adhibition: row.adhibition
                }
            }
            actionRecordGetList(data).then(res => {
                this.alarmList = res
                this.seeDialog = true
            }).catch(err => {
                console.log(err)
            })
        },
        search() {
            this.get_params.page = 1
            this.get_data()
        },
        reset() {
            this.get_params = {
                page: 1,
                size: 20,
                name: '',
                type: ''
            }
            this.sayTimes = []
            this.get_data()
        },
        get_data() {
            let data = {
                queryData: {
                    page: this.get_params.page,
                    pageSize: this.get_params.size
                },
                paramsData: {
                    actionName: this.get_params.name,
                    startTime: this.sayTimes[0] || '',
                    endTime: this.sayTimes[1] || ''
                }
            }
            this.loading = true
            actionRecordPage(data).then(res => {
                console.log(res)
                this.tableData = res.records
                this.total_num = res.total
                this.loading = false
            }).catch(err => {
                this.loading = false
                console.log(err)
            })
        },
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex % 2) {
                return 'table-row2'
            } else {
                return 'table-row1'
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .title{
        font-size:12px;
        color:#0052D9;
    }
    .auto{
        ::v-deep .el-descriptions-item__label {
                width: 120px !important;
            }
    }
</style>
