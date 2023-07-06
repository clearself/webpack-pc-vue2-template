<template>
    <div class="list">
        <div class="ub w100" style=" overflow: hidden;height: calc(100vh - 80px);">
            <!-- <div style="background:#fff;border: solid 1px #dadee8;border-radius: 4px;overflow-y:auto" class="mr-1 mb-1">
                <div class="asset-tree" style="position: relative">
                    <div class="ub ub-pj ub-ac w100" style="padding-left:10px;margin-bottom: 10px;box-sizing: border-box;margin-top:8px">
                        <div class="list-tips" style="margin-bottom: 0;font-size:12px;">分组列表</div>
                    </div>
                    <div style="padding: 0 10px 10px 10px">
                        <el-input placeholder="请输入关键词搜索" clearable v-model="filterText" class="tree-input" suffix-icon="el-icon-search" size="mini"></el-input>
                    </div>
                    <el-tree
                        ref="asset-tree"
                        node-key="id"
                        :filter-node-method="filterNode"
                        :default-expand-all="false"
                        :highlight-current="!['aqy', 'zzjg'].includes(currentNode.id)"
                        :data="assetTreeData"
                        :props="assetPropsData"
                        @node-click="handleNodeClick"
                        :expand-on-click-node="false"
                        :indent="indent"
                    >
                        <span class="custom-tree-node" slot-scope="{ node }">
                            <span style="color:rgba(0,0,0,.9);font-size:12px;">{{ node.label }}</span>
                        </span>
                    </el-tree>
                </div>
            </div> -->
            <div class="ub ub-f1 ub-ver mb-1" style="overflow: auto; height: 100%;">
                <div>
                    <SearchTop @search="searchAssets" @reset="reset" @isOpen="isOpen">
                        <el-col :md="12" :lg="8" :xl="6">
                            <el-form :model="get_params">
                                <el-form-item label="发现时间：" label-width="80px">
                                    <CustomDate
                                        :append-to-body="true"
                                        :auto="true"
                                        @getCustomTime="getCustomTime"
                                        @getDateData="getDateData"
                                        @actualTime="actualTimeData"
                                        style="width: 100%;"
                                        @timeUnit="timeUnitData"
                                        :empty="false"
                                        :chartTimeRange="customTimeRange"
                                        ref="customDate"
                                    ></CustomDate>
                                </el-form-item>
                            </el-form>
                        </el-col>
                        <el-col :md="12" :lg="8" :xl="6">
                            <el-form :model="get_params">
                                <el-form-item label="IP：" label-width="80px">
                                    <el-input placeholder="请输入IP" clearable v-model="get_params.ip" @keyup.enter.native="searchAssets" size="small"></el-input>
                                </el-form-item>
                            </el-form>
                        </el-col>
                        <!-- <el-col :md="12" :lg="8" :xl="6">
                            <el-form :model="get_params">
                                <el-form-item label="来源：" label-width="80px">
                                    <el-select v-model="get_params.source" size="small" placeholder="请选择业务系统" style="width:100%">
                                        <el-option v-for="(item, index) in sourceList" :key="index" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-form>
                        </el-col> -->
                        <el-col :md="12" :lg="8" :xl="6">
                            <el-form :model="get_params">
                                <el-form-item label="IP范围：" label-width="80px">
                                    <el-col :span="11" style="padding: 0;">
                                        <el-input placeholder="请输入IP范围" v-model="get_params.startIp" @keyup.enter.native="searchAssets" size="small"></el-input>
                                    </el-col>
                                    <el-col :span="2" style="padding: 0; text-align: center;">-</el-col>
                                    <el-col :span="11" style="padding: 0;">
                                        <el-input placeholder="请输入IP范围" v-model="get_params.endIp" @keyup.enter.native="searchAssets" size="small"></el-input>
                                    </el-col>
                                </el-form-item>
                            </el-form>
                        </el-col>
                    </SearchTop>
                    <div class="list-container">
                        <div class="ub ub-pj w100 mb-1 ub-ac">
                            <div class="list-tips">无主资产库</div>
                            <div>
                                <el-button v-per="['assets_blacklist_restore']" size="small" type="primary" @click="leaveblacklistMutile">恢复</el-button>
                                <!-- <el-dropdown trigger="click" :hide-on-click="false" class="mr-1 ml-1">
                                    <el-button
                                        icon="el-icon-edit-outline"
                                        size="small"
                                        type="primary"
                                        v-per="['assets_assets_cf']"
                                        style="background:#bd50d3;border:1px solid #bd50d3"
                                    >
                                        配置表头
                                    </el-button>
                                    <el-dropdown-menu slot="dropdown" style="padding-left: 10px">
                                        <span class="el-icon-info" style="color: rgba(0,0,0,.9);margin-bottom: 10px;font-size:12px">
                                            <span style="margin-left: 8px;font-size:12px">拖拽字段进行排序</span>
                                        </span>
                                        <el-checkbox-group v-model="checkList" @change="changeHeader">
                                            <draggable class="w100" tag="div" v-model="checkListAll" v-bind="{ scroll: true, animation: 150 }" @end="onEnd">
                                                <transition-group><el-checkbox :label="element" v-for="element in checkListAll" :key="element"></el-checkbox></transition-group>
                                            </draggable>
                                        </el-checkbox-group>
                                    </el-dropdown-menu>
                                </el-dropdown> -->
                            </div>
                        </div>
                        <div :style="{ height: !kaiguan ? 'calc(100vh - 263px)' : 'calc(100vh - 313px)', 'overflow-y': 'auto' }">
                            <el-table
                                style="width: 100%;"
                                ref="multipleTable"
                                :row-class-name="tableRowClassName"
                                v-loading="loading"
                                :row-style="{ height: '32px' }"
                                :header-row-style="{ height: '32px' }"
                                class="bigTable fixedTable"
                                :data="tableData"
                                border
                                stripe
                                tooltip-effect="dark"
                                @selection-change="handleSelectionChange"
                            >
                                <el-table-column align="center" type="selection" width="30"></el-table-column>
                                <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="createTime" label="创建时间"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="zoneName" label="安全域"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="ip" label="IP"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="port" label="端口"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="mac" label="mac"></el-table-column>
                                <el-table-column align="center" label="操作" fixed="right" width="250" class-name="deepBg">
                                    <template slot-scope="scope">
                                        <el-button size="small" type="text" @click="handleDetail(scope.row)">查看</el-button>
                                        <el-button size="small" type="text" @click="leaveblacklist(scope.row)">恢复</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <pagination
                            :total="total_num"
                            :page.sync="get_params.page"
                            :limit.sync="get_params.size"
                            @pagination="get_data()"
                            style="padding-top: 10px;"
                            v-show="total_num > 0"
                        />
                    </div>
                </div>
            </div>
        </div>
        <!--查看内容-->
        <el-drawer :visible.sync="seeDialog" direction="rtl" size="50%" title="查看资产" custom-class="checkdia">
            <div class="drawer-pad">
                <div class="container">
                    <el-descriptions size="mini" title="" :column="2" border>
                        <el-descriptions-item label="IP">{{assetsFormSee.ip}}</el-descriptions-item>
                        <el-descriptions-item label="端口">{{assetsFormSee.port}}</el-descriptions-item>
                        <!-- <el-descriptions-item label="资产类型">{{assetsFormSee.port}}</el-descriptions-item>
                        <el-descriptions-item label="操作系统">{{assetsFormSee.port}}</el-descriptions-item> -->
                        <el-descriptions-item label="安全域">{{assetsFormSee.zoneName}}</el-descriptions-item>
                        <el-descriptions-item label="创建时间">{{assetsFormSee.createTime}}</el-descriptions-item>
                    </el-descriptions>
                </div>
            </div>
        </el-drawer>
    </div>
</template>

<script>
import initData from '@/mixins/initData.js'
// import draggable from 'vuedraggable'
import ueditorConfig from '../../mixins/ueditorConfig'
import CustomDate from '@/pages/assets/assets_detail_drawer/components/custom_date/index.vue'
import {
    // get_assets,
    get_header_list,
    save_header_list,
    // get_asset_info_tree
    find_asset_info_tree,
    find_assets,
    findSaveBalck
} from '../../server/assets/api.js'
export default {
    name: 'AssetPart',
    components: {
        // draggable,
        CustomDate
    },
    mixins: [ueditorConfig, initData],
    data() {
        return {
            customTimeRange: [],
            actualTime: '',
            timeUnit: '',
            dateData: '',
            dateMode: '',
            useDate: {},
            useIndex: '',
            value: '',
            isClick: true,
            isFirst: true,
            indent: 10,
            initId: null,
            depId: '',
            config_id: '',
            assetTreeData: [],
            checkListAll: [
                '资产名称',
                '资产标识',
                '资产标签',
                '资产类型',
                '厂商',
                '型号',
                '操作系统',
                '是否边界',
                '是否国产',
                '业务系统',
                '所属安全域',
                'IP',
                '端口',
                '创建时间',
                '资产联系人'
            ],
            assetPropsData: {
                children: 'sub',
                label: 'name'
            },
            currentNode: {
                id: ''
            },
            sourceList: [
                {
                    label: '天擎',
                    value: 1
                },
                {
                    label: '奇安信',
                    value: 2
                },
                {
                    label: '360',
                    value: 3
                }
            ],
            flag: null,

            currentNodeId: '',

            innerLabel_edit: '',
            innerValue_edit: '',
            checkList: [],
            headerTimer: null,

            formLabelWidth: '100px',
            loading: false,
            total_num: 0,
            tableData: [],
            multipleSelection: [],
            get_params: {
                page: 1,
                size: 20,
                ip: '',
                deviceTypeId: '',
                assetsName: '',
                systemId: '',
                orgId: '',
                zoneId: '',
                startIp: '',
                endIp: ''
            },
            seeDialog: false,
            ips: [
                {
                    ip: '',
                    port: '',
                    mac: '',
                    mask: '',
                    gateway: ''
                }
            ],
            filterText: '',
            kaiguan: '',
            assetsFormSee: {
                ip: '',
                port: ''
            }
        }
    },
    computed: {
    },
    watch: {
        filterText(val) {
            this.$refs['asset-tree'].filter(val)
        }
    },
    created() {
    },
    mounted() {
        this.$nextTick(() => {
            this.getHeader()
            this.initTree()
        })
    },
    methods: {
        leaveblacklist(row) {
            // 恢复黑名单
            const blackList = [{ id: row.id, status: 0 }]
            this.updateBlack(blackList)
        },
        leaveblacklistMutile() {
            const blackList = []
            if (this.multipleSelection.length == 0) {
                this.$message({
                    message: '请先选择行',
                    type: 'warning'
                })
                return
            }
            this.multipleSelection.forEach(item => {
                blackList.push({
                    id: item,
                    status: 0
                })
            })
            this.updateBlack(blackList)
        },
        updateBlack(data) {
            findSaveBalck({
                queryData: {},
                paramsData: {
                    assetsFindList: data
                }
            }).then(res => {
                this.$message({
                    message: '移出黑名单成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            })
        },
        getCustomTime(val, isChartTime) {
            this.sayTimes = val
            console.log('时间', val)
        },
        getDateData(date, mode, useDate, useIndex) {
            this.dateData = date
            this.dateMode = mode
            console.log('getDateData----dateData', this.dateData)
            this.useDate = useDate
            this.useIndex = useIndex
        },
        actualTimeData(val) {
            this.actualTime = val
        },
        timeUnitData(val) {
            this.timeUnit = val
        },
        tableRowClassName({ row, rowIndex }) {
            // console.log(rowIndex)
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
                ip: '',
                startIp: '',
                endIp: '',
                deviceTypeId: '',
                assetsName: '',
                systemId: '',
                orgId: '',
                zoneId: ''
            }
            this.get_data()
        },
        isOpen(val) {
            console.log(val)
            this.kaiguan = val
        },
        onEnd() {
            let arr = []
            this.checkListAll.map(item => {
                if (this.checkList.some(tag => tag === item)) {
                    arr.push(item)
                }
            })
            this.checkList = this.$deepCopy(arr)
            this.changeHeader()
        },
        initTree() {
            find_asset_info_tree({
                queryData: {},
                paramsData: {}
            })
                .then(res => {
                    console.log('资产树', res)
                    if (this.isFirst) {
                        /* this.depId = res[0].id;
                    this.initId = res[0].id;
                    this.currentNode.id = res[0].id;*/
                        this.get_data()
                    }
                    this.isFirst = false
                    // this.isClick = false;
                    this.assetTreeData = res
                })
                .then(() => {
                    this.$refs['asset-tree'].setCurrentKey(this.depId)
                    this.isClick = true
                })
                .catch(error => {
                    console.log('error' + error)
                })
        },
        filterNode(value, data) {
            console.log(value, data)
            if (!value) return true
            return data.name.indexOf(value) !== -1
        },
        initParams() {
            this.get_params.page = 1
            this.get_params.size = 20
            this.total_num = 0
        },
        searchCheck() {
            this.get_params.page = 1
            this.get_data()
        },
        handleNodeClick(node) {
            /* 清除参数*/
            this.get_params.zoneId = ''
            this.get_params.orgId = ''

            switch (node.flag) {
                case 1:
                    this.get_params.zoneId = node.id
                    break
                case 4:
                    this.get_params.orgId = node.id
                    break
                default:
                    break
            }
            if (!node.flag && node.id === 'aqy') {
                this.get_params.zoneId = 'all'
            } else if (!node.flag && node.id === 'zzjg') {
                this.get_params.orgId = 'all'
            }
            console.log(node)
            this.currentNode = node
            if (this.isClick) {
                this.currentNodeId = node.id
            }
            this.$refs['asset-tree'].setCurrentKey(node.id)

            this.depId = node.id
            this.initParams()
            this.get_data()
        },
        changeHeader() {
            console.log(this.checkList)
            let vm = this
            clearTimeout(this.headerTimer)
            this.headerTimer = setTimeout(function() {
                vm.updateHeader()
            }, 3000)
        },
        getHeader() {
            this.checkList = []
            let data = {
                queryData: {},
                paramsData: {
                    menuTag: '6'
                }
            }
            get_header_list(data)
                .then(res => {
                    console.log(res)
                    if (res) {
                        this.checkList = res.field
                        this.checkListAll = res.allField
                    }
                })
                .catch(err => {
                    console.log('err' + err)
                })
        },
        updateHeader() {
            let data = {
                queryData: {},
                paramsData: {
                    menuTag: '6',
                    field: this.checkList,
                    spare: this.translationHeader(this.checkList),
                    allField: this.checkListAll
                }
            }
            save_header_list(data)
                .then(res => {
                    this.$message({
                        message: '修改列表头成功',
                        type: 'success'
                    })
                    setTimeout(() => {
                        this.getHeader()
                    }, 1500)
                })
                .catch(err => {
                    console.log('err' + err)
                })
        },
        translationHeader(arr) {
            let obj = {
                资产名称: 'device_name',
                资产标识: 'uniqueCode',
                资产标签: 'labelName',
                资产类型: 'device_type_name',
                厂商: 'manufacturer_name',
                型号: 'modelInfo',
                操作系统: 'pc_system',
                是否边界: 'isBoundaryCN',
                是否国产: 'is_domestic',
                业务系统: 'system_name',
                所属安全域: 'zoneName',
                IP: 'ip',
                端口: 'port',
                创建时间: 'create_time',
                资产联系人: 'systemUsers'
            }
            let newArr = []
            arr.forEach(item => {
                if (obj[item]) {
                    newArr.push(obj[item])
                }
            })
            return newArr
        },
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        resetData(val) {
            if (val + '' === '' || val == null || val == undefined || val == 'undefined') {
                return ''
            } else {
                return val
            }
        },
        searchAssets() {
            this.setDate()
            this.get_params.page = 1
            this.get_data()
        },
        setDate() {
            if (this.dateMode === 'noUse') {
                if (this.dateData === '最近10分钟') {
                    this.$refs.customDate.handleRecently({ value: 0, name: '最近10分钟' }, 0)
                } else if (this.dateData === '最近30分钟') {
                    this.$refs.customDate.handleRecently({ value: 1, name: '最近30分钟' }, 1)
                } else if (this.dateData === '最近1小时') {
                    this.$refs.customDate.handleRecently({ value: 2, name: '最近1小时' }, 2)
                } else if (this.dateData === '最近1天') {
                    this.$refs.customDate.handleRecently({ value: 3, name: '最近1天' }, 3)
                } else if (this.dateData === '最近2天') {
                    this.$refs.customDate.handleRecently({ value: 4, name: '最近2天' }, 4)
                } else if (this.dateData === '最近7天') {
                    this.$refs.customDate.handleRecently({ value: 5, name: '最近7天' }, 5)
                } else if (this.dateData === '今天') {
                    this.$refs.customDate.handleRelative({ value: 0, name: '今天' }, 0)
                } else if (this.dateData === '昨天') {
                    this.$refs.customDate.handleRelative({ value: 1, name: '昨天' }, 1)
                } else if (this.dateData === '本周') {
                    this.$refs.customDate.handleRelative({ value: 2, name: '本周' }, 2)
                } else if (this.dateData === '上周') {
                    this.$refs.customDate.handleRelative({ value: 3, name: '上周' }, 3)
                } else if (this.dateData === '本月') {
                    this.$refs.customDate.handleRelative({ value: 4, name: '本月' }, 4)
                } else if (this.dateData === '上月') {
                    this.$refs.customDate.handleRelative({ value: 5, name: '上月' }, 5)
                }
            } else if (this.dateMode === 'use') {
                this.$refs.customDate.handleOther(this.useDate, this.useIndex)
            } else if (this.dateMode === 'useTwo') {
                this.$refs.customDate.handleUse()
            }
        },
        get_data() {
            let uid = (this.config_id = new Date().getTime())
            this.loading = true
            this.tableData = []
            let data = {
                queryData: {
                    page: this.get_params.page,
                    pageSize: this.get_params.size
                },
                paramsData: {
                    status: -1,
                    deviceTypeId: this.get_params.deviceTypeId,
                    ip: this.get_params.ip,
                    startIp: this.get_params.startIp,
                    endIp: this.get_params.endIp,
                    zoneId: this.get_params.zoneId,
                    orgId: this.get_params.orgId,
                    source: this.get_params.source,
                    startTime: this.sayTimes[0],
                    endTime: this.sayTimes[1]
                }
            }
            find_assets(data)
                .then(res => {
                    if (this.config_id != uid) {
                        return
                    }
                    this.loading = false
                    this.total_num = res.total
                    let list = res.records
                    if (list.length > 0) {
                        this.tableData = this.$lodash.cloneDeep(list)
                        // console.log('this.tableData', this.tableData)
                    }
                })
                .catch(error => {
                    this.loading = false
                    console.log('error' + error)
                })
        },
        handleSelectionChange(val) {
            console.log(val)
            this.multipleSelection = []
            if (val.length > 0) {
                val.forEach(item => {
                    this.multipleSelection.push(item.id)
                })
            }
        },
        handleDetail(row) {
            this.assetsFormSee = this.$deepCopy(row)
            this.seeDialog = true
        }
    },
    beforeDestroy() {
        if (this.flag) {
            clearTimeout(this.flag)
            this.flag = null
        }
    }
}
</script>
<style lang="scss">
    .custom-star {
        .checkdia {
            .el-descriptions__body {
                background: unset;
                .el-descriptions-item__label.is-bordered-label {
                    border: 1px solid #1cd7fa!important;
                    color: #ffffff!important;
                    background: unset!important;
                }
                .el-descriptions-item__cell {
                    border: 1px solid #1cd7fa!important;
                    color: #ffffff;
                }
            }
        }
    }
</style>

<style lang="scss" scoped>
.el-select {
    ::v-deep .el-input {
        height: 32px !important;
    }
}
.is-error {
    height: 100px !important;
}
.el-date-editor {
    ::v-deep .el-input__prefix {
        height: 32px !important;
    }
}
.fixedTable {
    ::-webkit-scrollbar {
        width: 6px; /* 纵向滚动条 宽度 */
        height: 5px; /* 横向滚动条 高度 */
        border-radius: 3px; /* 整体 圆角 */
    }
}
.pagination {
    padding: 30px 0 20px;
    text-align: right;
}
.el-input.ips {
    display: block;
    width: 100%;
}
.event .drawer-pad {
    padding: 0;
}
.el-form-item {
    margin: 0;
}
.event ::v-deep .el-range-input {
    color: #ffffff;
    background-color: rgb(0 0 0 / 0%);
}
.event ::v-deep .el-range-separator {
    color: #ffffff;
}
.event ::v-deep .el-upload-list__item-name {
    color: #01e9ff;
    i {
        color: #01e9ff;
    }
}
.attendance-dialog .el-form-item {
    margin-bottom: 30px;
}
.upload-demo ::v-deep .el-button--primary {
    border-color: rgb(0 0 0 / 0%);
    // background-image: url(../../assets/img/XZWJ.png);
    background-position: 0 0;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-color: rgb(0 0 0 / 0%);
}
.el-tree {
    background: rgb(0 0 0 / 0%);
}
.event ::v-deep .custom-tree-node {
    height: 26px;
    line-height: 26px;
}
.tree ::v-deep .el-tree--highlight-current .el-tree-node > .el-tree-node__content {
    .custom-tree-node {
        span:nth-child(1) {
            color: rbga(0, 0, 0, 0.9) !important;
        }
        span:nth-child(2) {
            color: #86939e !important;
        }
    }
}
.tree ::v-deep .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
    background-color: rgb(0 0 0 / 0%) !important;
    .custom-tree-node {
        span {
            color: #0052d9 !important;
        }
    }
}
.tree ::v-deep .el-tree--highlight-current .el-tree-node > .el-tree-node__content:hover {
    background-color: rgb(0 0 0 / 0%) !important;
    .custom-tree-node {
        span {
            color: #0052d9 !important;
        }
    }
}
.tree ::v-deep .el-checkbox__input.is-disabled .el-checkbox__inner {
    border-color: #0052d9;
    background-color: #0052d9;
}
.tree ::v-deep .el-checkbox__input .el-checkbox__inner,
.auto ::v-deep .el-checkbox__input .el-checkbox__inner {
    border-color: #0052d9 !important;
}
.tree ::v-deep .el-checkbox__input.is-focus .el-checkbox__inner,
.auto ::v-deep .el-checkbox__input.is-focus .el-checkbox__inner {
    border-color: #0052d9 !important;
}
.tree ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner,
.auto ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
    border-color: #0052d9;
    background-color: rgb(0 0 0 / 0%) !important;
}
.tree-option i {
    margin: 0 3px;
    cursor: pointer;
}
.tree ::v-deep .el-checkbox__inner::after,
.auto ::v-deep .el-checkbox__inner::after {
    border-color: #0052d9;
}
.tree ::v-deep .el-tree-node__content {
    background-color: rgb(0 0 0 / 0%) !important;
}
.auto ::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #0052d9;
}
.el-form--inline ::v-deep .mb0 {
    margin: 0 !important;
}
.rich-text {
    margin-bottom: 20px;
}
.mb0 ::v-deep .el-form-item__error {
    position: static !important;
}
.bigTable ::v-deep .el-tag.el-tag--success {
    border-color: #01c5ff;
    color: #00fdff;
    background-color: transparent;
}
.pagination {
    padding: 30px 0 20px;
    text-align: right;
}
.el-input.ips {
    display: block;
    width: 100%;
}
.event ::v-deep .attendance-dialog .el-form-item {
    margin-bottom: 20px;
}
.domain-add {
    line-height: 1;
    position: relative;
    padding: 10px 0;
    color: rgb(0 0 0 / 90%);
    .domain-title {
        display: inline-block;
        width: 90px;
        font-size: 12px;
        text-align: right;
    }
    .el-button {
        position: absolute;
        top: 10px;
        right: 20px;
        padding: 0;
        color: #0052d9;
    }
}
.domain-list {
    // background: rgba(0, 0, 0, .3);
    margin: 3px 0 20px;
    padding: 0 20px 0 100px;
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
.input-div {
    width: 180px;
}
// .dou{
//     &:after{
//         content: ',';
//     }
//     &:last-child:after{
//         content: '';
//     }
// }
.roles ::v-deep .el-tag.el-tag--success {
    border-color: #01c5ff;
    color: #00fdff;
    background-color: rgb(0 0 0 / 0%);
}
.el-select-dropdown__item.selected {
    font-weight: normal;
}
.el-dropdown-menu {
    z-index: 10009 !important;
    width: 240px !important;
    border-radius: 4px;

    /* box-sizing: border-box!important; */
}
.el-dropdown-menu__item {
    // color: #fff !important;

    /* padding:5px 30px 5px 10px!important; */
}
.el-dropdown-menu__item:hover {
    color: rgb(0 0 0 / 90%) !important;
    background: none !important;
}
.tree_dropdown .el-select-dropdown__item.hover span {
    // color: #fff;
}
.tree_dropdown .el-select-dropdown__item.hover {
    background: none !important;
}
.tree_dropdown .el-select-dropdown__item:hover {
    background: none !important;
}
.tree_dropdown .el-select-dropdown__item {
    background: none !important;
}
.el-tree {
    background: rgb(0 0 0 / 0%);
}
.tree_dropdown .el-select-dropdown__item.hover span {
    // color: #fff;
}
.el-dropdown-menu ::v-deep .el-checkbox__label {
    // color:rgba(0,0,0,.9) !important;
    width: 72px;
    box-sizing: border-box;
    font-size: 12px;
}
.el-dropdown-menu ::v-deep .el-checkbox {
    margin-right: 20px;
}
.el-dropdown-menu ::v-deep .el-checkbox__label:hover {
    width: 72px;
    color: #0052d9;
    box-sizing: border-box;
}
.el-dropdown-menu ::v-deep .el-checkbox__label:active {
    width: 72px;
    color: #0052d9;
    box-sizing: border-box;
}
.el-dropdown-menu ::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #0052d9;
}
.el-dropdown-menu ::v-deep .el-checkbox:nth-of-type(2n + 1) {
    margin-right: 30px;
}
.extend-box {
    margin-bottom: 10px;
    padding-top: 20px;
    ::v-deep .el-input__inner {
        width: 848px !important;
    }
}
.extend-box.system-box {
    padding-top: 0;
}
.registeassets {
    color: #606266;
}
</style>
