<template>
    <div class="list">
        <div class="w100">
            <div class="ub w100 search-area" style="box-sizing: border-box;">
                <SearchTop @search="searchCheck" @reset="reset" style="border-top-left-radius:0;border-top-right-radius:0;box-shadow:none">
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="任务名称：" label-width="80px">
                                <el-input
                                    placeholder="请输入"
                                    clearable
                                    v-model.trim="get_params.name"
                                    @keyup.enter.native="searchCheck"
                                    size="small"
                                ></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="时间范围：" label-width="80px">
                                <el-date-picker
                                    style="width:300px;"
                                    :clearable="true"
                                    size="small"
                                    :default-time="['00:00:00', '23:59:59']"
                                    v-model="get_params.time"
                                    type="datetimerange"
                                    range-separator="~"
                                    format="yyyy-MM-dd HH:mm:ss"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                >
                                </el-date-picker>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </SearchTop>
            </div>
            <div class="list-container">
                <div class="ub ub-pj w100 mb-1 ub-ac">
                    <div class="list-tips">手动任务</div>
                    <div>
                        <el-button
                            v-if="currentTab === 1"
                            icon="el-icon-plus"
                            size="small"
                            type="primary"
                            @click="handleAddTemplate"
                            v-per="['link_manage_nft_add']"
                        >添加任务</el-button>
                    </div>
                </div>
                <el-table
                    ref="multipleTable"
                    v-loading="loading"
                    class="bigTable"
                    :data="tableData"
                    border
                    stripe
                    :height="tabHeight"
                    :row-class-name="tableRowClassName"
                    tooltip-effect="dark"
                    @selection-change="handleSelectionChange"
                    :row-style="{ height: '32px' }"
                    :header-row-style="{ height: '32px' }"
                >
                    <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                    </el-table-column>
                    <el-table-column prop="name" label="任务名称" width="300" show-overflow-tooltip> </el-table-column>
                    <el-table-column label="时间范围" width="300" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <div>{{ `${scope.row.startTime} ${scope.row.endTime}` }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="任务开始时间" show-overflow-tooltip> </el-table-column>
                    <el-table-column prop="mode" label="导出模式" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <div>{{ getModeText(scope.row.mode) }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="任务状态">
                        <template slot-scope="scope">
                            <div>{{ getStatusText(scope.row.status) }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        align="center"
                        width="200"
                        fixed="right"
                        class-name="deepBg"
                    >
                        <template slot-scope="scope">
                            <!-- <a :href="scope.row.status==1 ?'/api/data_center/terminal/downloadPacap?logId='+scope.row.logId : 'javascript:;'" download> -->
                            <el-button v-per="['link_manage_nft_pcap']" :disabled="scope.row.status==1" size="small" type="text" @click="download(scope.row.logId)">下载PCAP包</el-button>
                            <!-- </a> -->
                            <el-button :disabled="scope.row.status!=1" size="small" type="text" @click="lookPcac(scope.row)">查看PCAP包</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- v-show="total_num>0"  -->
                <pagination v-show="total_num>0" :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size" @pagination="get_data" style="padding-top:10px"/>
            </div>
        </div>
        <!--添加任务-->
        <add-task ref="addTask" @submitForm="submitForm"></add-task>
        <!--查看任务条件-->
        <task-detail ref="detail" />
        <!-- PCAP包详情 -->
        <el-dialog title="PCAP包详情" :visible.sync="pcacDialog" :fullscreen="true" custom-class="common-dialog">
            <div class="w100 pcap-detail" style="height:100%;">
                <el-tabs v-model="tabsValue" type="card" style="height:100%;">
                    <el-tab-pane
                        :key="index"
                        v-for="(item, index) in pacpData"
                        :label="item.name"
                        :name="item.name"
                        style="height:100%;"
                    >
                        <div v-if="item.content.length>0" class="w100 left-content">
                            <div v-for="(_item,_index) in item.content" :key="_index" class="ub w100 ub-ver">
                                <div v-if="_item.type==='req'" class="ub ub-f1 request" style="width:100%;"><pre>{{_item.payload}}</pre></div>
                                <div v-if="_item.type==='res'" class="ub ub-f1 response" style="width:100%;"><pre>{{_item.payload}}</pre></div>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>

            </div>
        </el-dialog>
        <!--删除-->
        <DeleteDialog
            :dialogVisible="deleteDialog"
            @delete="handleDeleteFun"
            @cancel="deleteDialog = false">
        </DeleteDialog>
    </div>
</template>

<script>
import { getFlowTaskList, get_pcac, downloadPacap } from '../../../server/linkage/full_flow_task'
import TaskDetail from './module/task_detail'
import AddTask from './module/add_task'

export default {
    name: 'FullFlowTask',
    mixins: [],
    components: { TaskDetail, AddTask },
    props: {
        type: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            tabHeight: document.body.clientHeight - 290,
            tabsValue: '',
            currentTab: 0,
            deleteDialog: false,
            deleteId: '',
            formLabelWidth: '120px',
            loading: false,
            multipleSelection: [],
            tableData: [],
            total_num: 0,
            get_params: {
                page: 1,
                size: 20,
                name: '',
                time: [],
                type: 0,
                startTime: '',
                endTime: ''
            },
            pcacDialog: false,
            pacpData: []
        }
    },
    watch: {
        pcacDialog(newVal, oldVal) {
            if (!newVal) {
                this.tabsValue = ''
                this.pacpData = []
            }
        },
        type(newVal, oldVal) {
            if (newVal === 0 || newVal === 1) {
                this.$nextTick(() => {
                    this.get_params = {
                        page: 1,
                        size: 20,
                        name: '',
                        time: [],
                        type: newVal
                    }
                    this.currentTab = newVal
                    this.get_data()
                })
            }
        }

    },
    mounted() {
        this.$nextTick(() => {
            if (this.type === 1) {
                this.currentTab = 1
                this.get_params.type = 1
                this.get_data()
            }
            if (this.type === 0) {
                this.currentTab = 0
                this.get_params.type = 0
                this.get_data()
            }
        })
    },
    computed: {},
    methods: {
        download(logId) {
            downloadPacap({ queryData: { logId }, paramsData: {}}).then(res => {
                console.log(res)
            }).catch(err => {
                console.log(err)
            })
        },
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
                time: [],
                type: 0,
                startTime: '',
                endTime: ''
            }
            this.get_data()
        },
        lookPcac(row) {
            this.pcacDialog = true
            let data = {
                queryData: {},
                paramsData: {
                    logId: row.logId
                }
            }
            get_pcac(data).then(res => {
                console.log('pcac包', res)
                // this.pacpData = res[0].content;
                if (res.length > 0) {
                    this.tabsValue = res[0].name.split('.json')[0]
                    this.pacpData = res.map(item => {
                        item.name = item.name.split('.json')[0]
                        return item
                    })
                }
            }).catch(error => {
                console.log('error' + error)
            })
        },
        getModeText(val) {
            switch (val) {
                case '0':
                    return 'PCAP文件'
                case '1':
                    return '重放'
                case '2':
                    return 'PCAPNG文件'
                default:
                    return ''
            }
        },
        getStatusText(val) {
            switch (val) {
                case 0:
                    return '进行中'
                case 1:
                    return '下载完成'
                default:
                    return ''
            }
        },
        handleSee() {
            this.$refs.detail.detailDialog = true
            this.$refs.detail.init()
        },
        reserFun() {
            this.get_params = {
                page: 1,
                size: 20,
                name: '',
                time: [],
                type: this.get_params.type
            }
        },
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        tabClick(val = '1') {
            this.currentTab = val
            if (val === '1') this.get_params.type = 1
            if (val === '2') this.get_params.type = 0
            this.get_data()
        },
        handleAddTemplate() {
            this.$refs.addTask.addDialog = true
        },
        handleEdit(row) {
            this.$refs.addTask.addForm.id = row.id
            this.$refs.addTask.addForm.name = row.name
            this.$refs.addTask.addForm.time = ['2021-07-03 00:00:00', '2021-07-24 00:00:00']
            this.$refs.addTask.addDialog = true
        },
        searchCheck() {
            this.get_params.page = 1
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
                    type: this.get_params.type,
                    startTime: this.get_params.time && this.get_params.time.length > 0 ? this.get_params.time[0] : '',
                    endTime: this.get_params.time && this.get_params.time.length > 0 ? this.get_params.time[1] : '',
                    name: this.get_params.name
                }
            }
            getFlowTaskList(data)
                .then(res => {
                    this.loading = false
                    this.total_num = res.total
                    this.tableData = res.records
                })
                .catch(error => {
                    this.loading = false
                    console.log('error' + error)
                })
        },
        handleDelete(row) {
            this.deleteId = [`${row.workOrderId}`]
            this.deleteDialog = true
        },
        handleDeleteFun() {
            let data = {
                workOrderIds: this.deleteId
            }
            // eslint-disable-next-line no-undef
            delete_workTask(data)
                .then(res => {
                    this.deleteDialog = false
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    })
                    setTimeout(() => {
                        this.get_data()
                    }, 1500)
                })
                .catch(error => {
                    this.deleteDialog = false
                    console.log(error + 'error')
                })
        },
        submitForm() {
            this.get_data()
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
            console.log(val)
            this.multipleSelection = val
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/css/pacap1.scss';
.el-date-editor {
    ::v-deep input{
        font-size:12px !important;
    }
}

.tab-button {
    height: 30px;
    margin-bottom: 2px;
    background-color: rgba(19, 109, 172, 0.2);

    & div {
        width: 80px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        margin-right: 10px;
        cursor: pointer;
        border: 1px solid #76dee2;
        border-radius: 2px;
        background: url("../../../assets/img/tab_btn.jpg") 100% 100% no-repeat;
        color: #fff;
        box-sizing: border-box;
        font-size: 14px;

        &.tab-active {
            background: url("../../../assets/img/tab_active.jpg") 100% 100% no-repeat;
        }
    }
}
.reset-btn {
    width: 80px;
    height: 30px;
    background-color: #041f38;
    box-shadow: inset 0px 0px 10px 0px rgba(0, 167, 245, 0.97);
    border: solid 1px #39caf3;
    font-size: 12px;
    line-height: 15px;
    letter-spacing: 1px;
    color: #a2ceec;
    border-radius: 5px;
    margin-right: 10px;
    cursor: pointer;
    box-sizing: border-box;
}
.el-input.ips {
    display: block;
    width: 100%;
}
.el-link {
    cursor: pointer;
}
.drawer-pad {
    padding: 0 20px;
}
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
    background: rgba(0, 0, 0, 0.3);
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
            color: #f56c6c;
        }
    }
}
.event  ::v-deep  .el-range-input {
    background-color: rgba(0, 0, 0, 0);
    color: #fff;
}
.event  ::v-deep  .el-range-separator {
    color: #fff;
}
.event  ::v-deep  .el-radio {
    margin: 0 150px 0 30px;
}
.event  ::v-deep  .el-form-item__label {
    padding: 0;
}
.event  ::v-deep  .el-upload-list__item-name {
    color: #01e9ff;
    i {
        color: #01e9ff;
    }
}
.attendance-list.table-area {
    min-height: 717px !important;
}
.event  ::v-deep  .edui-editor-iframeholder {
    height: 200px !important;
}
.event  ::v-deep  .drawer-content {
    .box-title {
        color: #00e9ff;
        font-size: 14px;
        margin: 30px 0 20px;
    }
    .label {
        width: 60px;
        font-size: 12px;
        color: #999;
        text-align: right;
        margin-right: 15px;
    }
    .label-val {
        font-size: 12px;
        color: #fff;
        img {
            max-width: 300px;
        }
    }
}
.event  ::v-deep  .condition-box {
    .part-condition {
        margin-bottom: 10px;
    }
    .condition_black {
        font-size: 12px;
        color: #999;
        margin-right: 6px;
    }
    .condition_white {
        font-size: 12px;
        color: #fff;
        margin-right: 6px;
    }
}
.event  ::v-deep  .warn-wrapper {
    width: 640px;
    padding-left: 10px;
    box-sizing: border-box;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 2px;

    & p {
        font-size: 12px;
        margin: 5px 0;

        &.warn-top {
            color: #fff;
            opacity: 0.6;
        }
        &.warn-body {
            color: #fff;
            word-break: break-all;
        }
    }
}
.event  ::v-deep  .pic-wrapper {
    height: calc(100vh - 190px);
    width: 99%;
    overflow: auto;
    border: 1px solid #1cd7fa;
}
.users  ::v-deep  .el-form-item__label:before {
    content: "*";
    color: #f56c6c;
    margin-right: 4px;
}
.full-flow-task ::v-deep .el-tabs__item.is-active {
    color: #00e9ff;
}
</style>
<style>
.nav-tips {
    pointer-events: none !important;
}
/*下拉菜单*/
.el-dropdown-link.active {
    font-size: 12px;
    color: #409eff;
}
.full-flow-task .el-dropdown-menu__item {
    padding: 0 20px !important;
}
</style>
