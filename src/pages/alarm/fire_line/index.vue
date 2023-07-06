<template>
    <div class="event work-task">
        <div class="w100">
            <div class="tab-button ub starWrapper">
                <div class="draft-btn" @click="tabClick('1')" :class="{'tab-active': currentTab == '1'}">部门防火线</div>
                <div class="draft-btn" @click="tabClick('2')" :class="{'tab-active': currentTab == '2'}">人员防火线</div>
                <div class="draft-btn" @click="tabClick('3')" :class="{'tab-active': currentTab == '3'}">资产防火线</div>
            </div>
            <div v-if="currentTab==1||currentTab==2" class="ub w100 search-area event-content" style="box-sizing: border-box;padding: 0;">
                <SearchTop @search="searchCheck" :border="false" @reset="reset">
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label-width="70px" label="组织架构：" label-position="left">
                                <OrgSearch ref="OrgSearch" type="1" size="small" v-model="get_params.orgId"></OrgSearch>
                                <!-- <div class="treeselect">
                                    <Treeselect
                                        :appendToBody="true"
                                        size="small"
                                        :options="treeData"
                                        :normalizer="normalizer"
                                        noChildrenText="当前分支无子节点"
                                        noOptionsText="无可用选项"
                                        noResultsText="无可用选项"
                                        placeholder="请选择"
                                        v-model="get_params.orgId"
                                    />
                                </div> -->
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col v-if="currentTab==2" :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="姓名：" label-width="70px">
                                <el-input
                                    placeholder="请输入"
                                    clearable
                                    v-model.trim="get_params.name"
                                    @keyup.enter.native="searchCheck"
                                    size="small"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col v-if="currentTab==2" :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="手机号：" label-width="70px">
                                <el-input
                                    placeholder="请输入"
                                    clearable
                                    v-model.trim="get_params.phone"
                                    @keyup.enter.native="searchCheck"
                                    size="small"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col v-if="currentTab==2" :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="用户名：" label-width="70px">
                                <el-input
                                    placeholder="请输入"
                                    clearable
                                    v-model.trim="get_params.username"
                                    @keyup.enter.native="searchCheck"
                                    size="small"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </SearchTop>
            </div>
            <div class="attendance-list table-area">
                <div class="ub ub-pj w100" style="margin-bottom: 10px;">
                    <div class="list-tips">列表内容</div>
                </div>
                <el-table
                    :height="currentTab==3?tableHeight1:tableHeight"
                    :row-class-name="tableRowClassName"
                    ref="multipleTable"
                    v-loading="loading"
                    class='bigTable full-table'
                    :data="tableData"
                    border
                    stripe
                    tooltip-effect="dark"
                    @selection-change="handleSelectionChange">
                    <el-table-column
                        align="center"
                        type="index"
                        width="50"
                        :index="indexMethod"
                        label="序号">
                    </el-table-column>
                    <el-table-column v-for="item in cols" :key="item.prop" :prop="item.prop" :label="item.label" >
                        <template slot-scope="{ row }">
                            <a class="orgName" href="javascript:;" v-if="item.prop==='orgName'&&currentTab==1" style="text-decoration: underline;" @click="clickOrg(row)">{{ row.orgName }}</a>
                            <span v-else>{{ row[item.prop] }}</span>
                        </template>

                    </el-table-column>
                    <el-table-column prop="alarmNum" label="告警量" >
                    </el-table-column>
                    <el-table-column prop="latestAlarmTime" label="最新告警时间" width="160">
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        align="center"
                        width="90"
                        fixed="right"
                        class-name="deepBg">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="handleSee(scope.row)">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination
                    v-show="total>0"
                    :total="total"
                    :page.sync="get_params.page"
                    :limit.sync="get_params.size"
                    @pagination="init" />
            </div>
        </div>
        <detail :show-dialog="fireLineDialog" :detail-data="detailData" :tab="currentTab" ref="fireLineDetail" />
    </div>
</template>

<script>
// import Treeselect from '@riophae/vue-treeselect'
// import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import Detail from './Detail'
import {
    // getTreeOrg,
    get_dep_fire_line,
    get_personal_fire_line,
    get_assets_fire_line
} from '@/server/alarm/fire_line.js'

export default {
    name: 'FireLine',
    components: {
        // Treeselect,
        Detail
    },
    data() {
        return {
            detailData: {},
            fireLineDialog: false,
            normalizer(node) {
                return {
                    id: node.id,
                    label: node.name,
                    children: node.sub
                }
            },
            treeData: [],
            tableHeight: document.body.clientHeight - 290,
            tableHeight1: document.body.clientHeight - 225,
            type: 1,
            currentTab: '1',
            formLabelWidth: '80px',
            loading: false,
            total: 0,
            multipleSelection: [],
            itemSelection: [],
            tableData: [
                {
                    name: '测试',
                    orgName: '组织架构名称',
                    phone: '13621054218',
                    assetsName: '服务器',
                    personalNum: '10',
                    abnormalPersonalNum: '20',
                    assetsIp: '192.168.1.123',
                    assetsLeader: '资产负责人',
                    alarmNum: '34',
                    alarmTime: '2023-05-04'
                }
            ],
            sayTimes: [],
            get_params: {
                page: 1,
                size: 20,
                orgId: null,
                name: '',
                phone: '',
                username: ''
            }
        }
    },
    computed: {
        cols() {
            if (this.currentTab == 1) {
                return [
                    {
                        label: '组织架构',
                        prop: 'orgName'
                    }, {
                        label: '人员数量',
                        prop: 'personNum'
                    }, {
                        label: '异常人员数量',
                        prop: 'exceptionPersonNum'
                    }
                ]
            } else if (this.currentTab == 2) {
                return [
                    {
                        label: '姓名',
                        prop: 'chineseName'
                    }, {
                        label: '组织架构',
                        prop: 'orgName'
                    }, {
                        label: '手机号',
                        prop: 'phone'
                    }
                ]
            } else {
                return [
                    {
                        label: '资产名称',
                        prop: 'assetName'
                    }, {
                        label: '资产IP',
                        prop: 'assetIps'
                    }, {
                        label: '资产责任人',
                        prop: 'assetPerson'
                    }
                ]
            }
        }
    },
    mounted() {
        // this.initTree()
        this.init()
    },
    methods: {
        // initTree() {
        //     let data = {
        //         queryData: {},
        //         paramsData: {}
        //     }
        //     getTreeOrg(data).then(res => {
        //         console.log('tree', res)
        //         this.treeData = res
        //     }).catch(error => {
        //         console.log('error' + error)
        //     })
        // },
        searchCheck() {
            this.get_params.page = 1
            this.init()
        },
        clickOrg(row) {
            this.currentTab = '2'
            this.get_params.page = 1
            this.get_params.size = 20
            this.$refs.OrgSearch.remoteMethod(row.orgName)
            this.get_params.orgId = row.orgId
            this.get_params.name = ''
            this.get_params.phone = ''
            this.get_params.username = ''
            this.init()
        },
        tabClick(val = '1') {
            this.currentTab = val
            this.get_params.page = 1
            this.get_params.size = 20
            this.get_params.orgId = null
            this.get_params.name = ''
            this.get_params.phone = ''
            this.get_params.username = ''
            this.init()
        },
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex % 2) {
                return 'table-row2'
            } else {
                return 'table-row1'
            }
        },
        reset() {
            this.get_params.page = 1
            this.get_params.size = 20
            this.get_params.orgId = null
            this.get_params.name = ''
            this.get_params.phone = ''
            this.get_params.username = ''
            this.init()
        },

        handleSee(row) {
            console.log(row, 'row')
            row.tab = this.currentTab
            this.$set(this, 'detailData', row)
            this.fireLineDialog = true
        },

        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },

        init() {
            let req = null
            this.loading = true
            this.tableData = []
            switch (this.currentTab) {
                case '1':
                    req = get_dep_fire_line
                    break
                case '2':
                    req = get_personal_fire_line
                    break
                case '3':
                    req = get_assets_fire_line
                    break
                default:
                    req = get_dep_fire_line
                    break
            }
            let data = {
                queryData: {
                    page: this.get_params.page,
                    pageSize: this.get_params.size
                },
                paramsData: {}
            }
            if (this.currentTab == 1) {
                data.paramsData.departmentId = this.get_params.orgId === null ? '' : this.get_params.orgId
            }
            if (this.currentTab == 2) {
                data.paramsData.departmentId = this.get_params.orgId === null ? '' : this.get_params.orgId
                data.paramsData.chineseName = this.get_params.name
                data.paramsData.phone = this.get_params.phone
                data.paramsData.username = this.get_params.username
            }
            req(data).then(res => {
                this.loading = false
                console.log('this.currentTab' + this.currentTab, res)
                this.total = res.total
                this.tableData = res.records
            }).catch(error => {
                this.loading = false
                console.log('error' + error)
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
            console.log(val)
            this.multipleSelection = val
        }
    }
}
</script>

<style lang="scss" scoped>
@import './../../../assets/css/ana_star';
.search-area {
    .wrapper {
        border: none;
        border-top: 1px solid #dadee8;
        border-radius: 0 0 4px 4px;
        box-shadow: none;
    }
}
.tab-button {
    height: 30px;
    border-radius: 4px 0 0 4px;
    background-color: #ffffff;
    & div {
        margin-right: 15px;
        width: 80px;
        height: 30px;
        font-size: 14px;
        text-align: center;
        color: rgb(0 0 0 / 60%);
        line-height: 30px;
        cursor: pointer;
        box-sizing: border-box;
        &:hover {
            color: #387dee;
        }
        &.tab-active {
            border-bottom: 1px solid #387dee;
            color: #387dee;
        }
    }
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
        top: 0;
        right: 20px;
        padding: 0;
        color: #1cd7fa;
    }
}
.domain-list {
    margin: 3px 0 20px;
    padding: 20px 0 1px;
    background: rgb(0 0 0 / 30%);
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
    color: #ffffff;
    background-color: rgb(0 0 0 / 0%);
}
.event  ::v-deep  .el-range-separator {
    color: #ffffff;
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
    margin-top: 10px;
    padding: 10px;
    border: solid 1px #dadee8;
    border-radius: 4px;
    background-color: #ffffff;
}
.event ::v-deep .edui-editor-iframeholder {
    height: 200px !important;
}
.event  ::v-deep  .drawer-content {
    .box-title {
        margin: 30px 0 20px;
        font-size: 14px;
        color: #00e9ff;
    }
    .label {
        margin-right: 15px;
        width: 60px;
        font-size: 12px;
        text-align: right;
        color: #999999;
    }
    .label-val {
        font-size: 12px;
        word-break: break-all;
        color: #ffffff;
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
        margin-right: 6px;
        font-size: 12px;
        color: #999999;
    }
    .condition_white {
        margin-right: 6px;
        font-size: 12px;
        color: #ffffff;
    }
}
.event  ::v-deep  .warn-wrapper {
    padding-left: 10px;
    width: 640px;
    border-radius: 2px;
    background: rgb(0 0 0 / 20%);
    box-sizing: border-box;
    & p {
        margin: 5px 0;
        font-size: 12px;
        &.warn-top {
            color: #ffffff;
            opacity: 0.6;
        }
        &.warn-body {
            color: #ffffff;
            word-break: break-all;
        }
    }
}
.event  ::v-deep  .pic-wrapper {
    overflow: auto;
    width: 99%;
    height: calc(100vh - 190px);
    border: 1px solid #1cd7fa;
}
.users  ::v-deep  .el-form-item__label::before {
    margin-right: 4px;
    color: #f56c6c;
    content: '*';
}
.fields-wapper {
    width: 100%;
    box-sizing: border-box;
    >div {
        padding: 10px;
        min-height: 100px;
        border: 1px solid #dcdcdc;
        border-radius: 5px;
        background-color: rgb(56 125 238 / 2%);
        .el-form-item {
            margin-bottom: 10px;
        }
    }
}
.work-task ::v-deep .attendance-dialog .el-dialog__body {
    height: 410px;
}
.custom-star {
    .orgName {
        color: #01e9ff;
    }
}
</style>
<style>
.nav-tips {
    pointer-events: none !important;
}

/* 下拉菜单 */
.el-dropdown-link.active {
    font-size: 12px;
    color: #409eff;
}
.work-task .el-dropdown-menu__item {
    padding: 0 20px !important;
}
</style>
