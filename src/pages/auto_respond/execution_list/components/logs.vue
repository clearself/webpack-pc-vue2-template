<template>
    <div style="width: 100%;">
        <div class="ub ub-pe" style="margin-bottom: 10px;">
            <div class="set-header" @click="transferDialog = true">
                <span style="margin-right: 5px;font-size: 12px;" class="iconfont icon-zidingyibiaotou"></span>
                <span style="font-size: 12px;">自定表头</span>
            </div>
        </div>
        <div>
            <el-table
                style="width: 100%;"
                v-loading="loading"
                ref="myTable"
                @expand-change="handleExpand"
                class="bigTable fixedTable"
                :row-class-name="tableRowClassName"
                :row-key="
                    row => {
                        return row.id
                    }
                "
                :data="tableData"
                border
                stripe
                tooltip-effect="dark"
                :row-style="{ height: '32px' }"
                :header-row-style="{ height: '32px' }"
                :expand-row-keys="expandRowKeys"
            >
                <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号"></el-table-column>
                <el-table-column type="expand" class-name="expand-col" width="40" style="margin-left: 20px;">
                    <template slot-scope="{ row }">
                        <el-tabs>
                            <el-tab-pane label="键/值" style="padding: 0 0 0 20px ;" class="demo-table-left">
                                <div class="table-expand" style="overflow-y: auto;height: 500px;">
                                    <el-form label-position="left" label-width="150px">
                                        <el-form-item :label="item.name" v-for="(item, index) in expandData" :key="index + row.id" style="margin-bottom: 0;">
                                            <div v-if="item.name != '源IP'" style="width: 800px;text-align: justify;word-break: break-all;">
                                                <span style="font-size: 12px;">{{ item.value }}</span>
                                            </div>
                                            <div v-if="item.name == '源IP'" style="max-width: 800px;text-align: justify;word-break: break-all;">
                                                <el-popover popper-class="add-search" placement="bottom" title="" trigger="click">
                                                    <div>
                                                        <p
                                                            @click="jumpAsset(item.value)"
                                                            class="ub ub-ac click-btn"
                                                        >
                                                            <i class="el-icon-s-promotion" style="font-size: 12px;"></i>
                                                            <span>查询资产</span>
                                                        </p>
                                                        <p
                                                            style="margin-top: 10px;"
                                                            @click="jumpThreat(item.value)"
                                                            class="ub ub-ac click-btn"
                                                        >
                                                            <i class="iconfont icon-chaxunqingbao" style="font-size: 12px;"></i>
                                                            <span>查询情报</span>
                                                        </p>
                                                    </div>
                                                    <span
                                                        class="highlighted-inner"
                                                        style="cursor: pointer; text-decoration: underline; color: #387dee;"
                                                        slot="reference"
                                                    >
                                                        <!-- <i
                                                                    v-if="item.value && item.srcIpVenusIsSpite != '内网'"
                                                                    class="iconfont"
                                                                    :style="{
                                                                        color: [
                                                                            { type: '安全', color: '#00ff48' },
                                                                            { type: '恶意', color: '#ff0000' },
                                                                            { type: '未知', color: '#7c7c7c' }
                                                                        ].filter(co => co.type == item.srcIpVenusIsSpite)[0].color
                                                                    }"
                                                                    :title="'VenusEye：'+item.srcIpVenusIsSpite"
                                                                    :class="{
                                                                        'icon-liebiaonei-anquan': item.srcIpVenusIsSpite == '安全',
                                                                        'icon-liebiaonei-buanquan': item.srcIpVenusIsSpite == '恶意',
                                                                        'icon-liebiaonei-weizhi': item.srcIpVenusIsSpite == '未知'
                                                                    }"
                                                                ></i> -->
                                                        <i
                                                            v-if="item.value && item.srcIpIsSpite != '内网'"
                                                            class="iconfont"
                                                            :style="{
                                                                color: [
                                                                    { type: '安全', color: '#00ff48' },
                                                                    { type: '恶意', color: '#ff0000' },
                                                                    { type: '未知', color: '#7c7c7c' }
                                                                ].filter(co => co.type == item.srcIpIsSpite)[0].color
                                                            }"
                                                            :title="'微步：'+item.srcIpIsSpite"
                                                            :class="{
                                                                'icon-liebiaonei-anquan': item.srcIpIsSpite == '安全',
                                                                'icon-liebiaonei-buanquan': item.srcIpIsSpite == '恶意',
                                                                'icon-liebiaonei-weizhi': item.srcIpIsSpite == '未知'
                                                            }"
                                                        ></i>
                                                        {{ item.value }}
                                                    </span>
                                                </el-popover>
                                            </div>
                                        </el-form-item>
                                    </el-form>
                                </div>
                            </el-tab-pane>
                            <el-tab-pane label="JSON" style="overflow: hidden;padding: 0 20px;">
                                <div class="table-expand" style="overflow-y: auto;width: 800px;height: 500px;font-size: 12px;text-align: justify;word-break: break-all;">
                                    <json-viewer :value="expandJsonData" :expand-depth="5" copyable theme="my-awesome-json-theme" sort></json-viewer>
                                </div>
                            </el-tab-pane>
                        </el-tabs>
                    </template>
                </el-table-column>
                <el-table-column
                    v-for="(item, index) in tableList"
                    :key="index"
                    :label="item.name"
                    min-width="140"
                    :sortable="item.type === 3 || item.type === 2"
                    show-overflow-tooltip
                    :prop="item.fieldName"
                >
                    <template slot-scope="scope">
                        <div>
                            <el-popover popper-class="add-search" placement="bottom" title="" trigger="click">
                                <div>
                                    <!-- <p
                                        v-if="item.fieldName !== 'message' && item.fieldName !== 'dt'"
                                        class="ub ub-ac click-btn"
                                        @click="
                                            equalVal({
                                                key: item.fieldName,
                                                name: item.name,
                                                attrType: item.type,
                                                value: scope.row[item.fieldName]
                                            })
                                        "
                                    >
                                        <i class="el-icon-plus"></i>
                                        <span>{{ item.name }}</span>
                                        <span>=</span>
                                        <span class="val">{{ scope.row[item.fieldName] }}</span>
                                    </p> -->
                                    <!-- <p
                                        v-if="item.fieldName !== 'message' && item.fieldName !== 'dt'"
                                        class="ub ub-ac click-btn"
                                        style="margin: 10px 0"
                                        @click="
                                            unequalVal({
                                                key: item.fieldName,
                                                name: item.name,
                                                attrType: item.type,
                                                value: scope.row[item.fieldName]
                                            })
                                        "
                                    >
                                        <i class="el-icon-plus"></i>
                                        <span>{{ item.name }}</span>
                                        <span>!=</span>
                                        <span class="val">{{ scope.row[item.fieldName] }}</span>
                                    </p> -->
                                    <!-- <p
                                        @click="item.visible = false"
                                        class="ub ub-ac click-btn"
                                        v-clipboard:copy="scope.row[item.fieldName]"
                                        v-clipboard:success="firstCopySuccess"
                                        v-clipboard:error="firstCopyError"
                                    >
                                        <i class="el-icon-document-copy"></i>
                                        <span>复制</span>
                                    </p> -->
                                    <p
                                        style="margin-top: 10px;"
                                        v-if="['ip'].some(keyWord => item.fieldName.toLowerCase().includes(keyWord))"
                                        @click="jumpAsset(scope.row[item.fieldName])"
                                        class="ub ub-ac click-btn"
                                    >
                                        <i class="iconfont icon-chaxunzichan" style="font-size: 12px;"></i>
                                        <span>查询资产</span>
                                    </p>
                                    <p
                                        style="margin-top: 10px;"
                                        v-if="['ip', 'url', '域名'].some(keyWord => item.fieldName.toLowerCase().includes(keyWord))"
                                        @click="jumpThreat(scope.row[item.fieldName])"
                                        class="ub ub-ac click-btn"
                                    >
                                        <i class="iconfont icon-chaxunqingbao" style="font-size: 12px;"></i>
                                        <span>查询情报</span>
                                    </p>
                                </div>
                                <p slot="reference" v-if="item.fieldName === 'aDate'" style="color: rgb(0 0 0 / 90%);">{{ scope.row[item.fieldName] }}</p>
                                <p
                                    v-else
                                    slot="reference"
                                    :style="
                                        ['ip', 'url', '域名'].some(keyWord => item.fieldName.toLowerCase().includes(keyWord))
                                            ? 'cursor: pointer; text-decoration: underline; color: #387dee;'
                                            : 'cursor: default; text-decoration: unset; '
                                    "
                                >
                                    {{ scope.row[item.fieldName] }}
                                </p>
                            </el-popover>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <pagination :page.sync="get_params.page" :limit.sync="get_params.size"  style="padding-top: 10px;" @pagination="get_data" :total="total_num" />
        <CustomTransfer :list-all="listAll" :list="list" :transfer-dialog="transferDialog" />
    </div>
</template>
<script>
import { get_threat_search, getStartConfig, get_threat_searchVenus } from '@/server/alarm/api.js'
import { getFieldByAll, getUserField, getList, getExpandLog, updateAlarmFields } from '@/server/auto_respond/execution_list.js'
import CustomTransfer from '@/pages/data_manage/new_search/components/custom_transfer/index.vue'
export default {
    components: { CustomTransfer },
    props: ['id', 'logId'],
    data() {
        return {
            startData: [],
            transferDialog: false,
            get_params: {
                page: 1,
                size: 10
            },
            total_num: 0,
            loading: false,
            expandRowKeys: [],
            tableData: [],
            expandData: [],
            list: [],
            listAll: [],
            expandJsonData: []
        }
    },
    created() {
        this.getStartConfigData()
        this.initCanSelectedFileds()
    },
    computed: {
        tableList() {
            console.log('this.list', this.list)
            return this.list.length > 0 ? this.list : this.listAll
        }
    },
    methods: {
        getStartConfigData() {
            getStartConfig({ queryData: {}, paramsData: {}}).then(res => {
                this.startData = res
            })
        },
        jumpAsset(value) {
            this.$setsessionStorage('currentPath', '/assets/assets_asset_info?ip=' + value)
            window.open(window.location.origin + '/#' + '/assets/assets_asset_info?ip=' + value)
        },
        get_data() {
            let data = {
                queryData: {
                    page: this.get_params.page,
                    pageSize: this.get_params.size
                },
                paramsData: {
                    alarmId: this.id,
                    inputTerm: [],
                    sqlTerm: '',
                    filterTerm: [],
                    fields: this.list.map(it => it.fieldName),
                    logIds: [this.logId]
                }
            }
            getList(data, {}).then(res => {
                let arr = res.records
                this.total_num = res.total
                this.tableData = this.$lodash.cloneDeep(arr)
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
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        initSelectedFileds() {
            let data = { queryData: { searchType: 2 }, paramsData: { searchType: 2 }}
            getUserField(data)
                .then(res => {
                    this.list = []
                    return res
                })
                .then(res => {
                    console.log('用户已选字段', res)
                    if (res.length > 0) {
                        res.forEach((item, index) => {
                            let obj = {}
                            obj.show = false
                            // obj.fixed = false
                            // obj.top5 = []
                            obj.name = item.name
                            obj.fieldId = item.fieldId
                            obj.fieldName = item.field
                            obj.type = item.type

                            // 事件时间放前面，原始信息放最后
                            if (this.list.find(it => it.fieldName === 'alarmTime') && obj.fieldName !== 'message') {
                                this.list.splice(1, 0, obj)
                            } else if (obj.fieldName === 'message') {
                                this.list.push(obj)
                            } else {
                                this.list.splice(this.list.length - 1, 0, obj)
                            }
                        })
                    }
                })
                .then(() => {
                    this.get_data()
                })
                .catch(error => {
                    console.log('error' + error)
                })
        },
        initCanSelectedFileds() {
            let data = { queryData: {}, paramsData: {}}
            this.loading = true
            /* 先获取已选的字段，在获取所有字段，避免左侧抖动*/
            this.initSelectedFileds()
            getFieldByAll(data)
                .then(res => {
                    this.listAll = []
                    console.log('所有综合可选字段', res)
                    if (res.length > 0) {
                        res.forEach(item => {
                            let obj = {}
                            obj.fieldId = item.fieldId
                            obj.show = false
                            // obj.fixed = false
                            // obj.top5 = []
                            obj.name = item.name
                            obj.fieldName = item.field
                            obj.type = item.type
                            if (item.enums) {
                                obj.enums = item.enums
                            }
                            this.listAll.push(obj)
                        })
                    }
                })
                .then(() => {
                    this.loading = false
                    this.list = this.$lodash.cloneDeep(this.list)
                })
                .catch(error => {
                    this.loading = false
                    console.log('error' + error)
                })
        },
        jumpThreat(value) {
            console.log(value)
            let obj = {
                queryData: {},
                paramsData: { value }
            }
            if (this.startData.includes(1)) {
                this.searchWeibu(obj, value)
            } else if (this.startData.includes(0)) {
                this.searchVenus(obj, value)
            }
        },
        searchWeibu(obj, value) {
            get_threat_search(obj)
                .then(res => {
                    console.log(res)
                    this.$setsessionStorage('search-item', res)
                    window.open(window.location.origin + '/#' + '/intelligence/threat_detail?searchStr=' + value)
                })
                .catch(err => {
                    console.log(err + 'err')
                })
        },
        searchVenus(obj, value) {
            get_threat_searchVenus(obj, value)
                .then(res => {
                    console.log(res)
                    this.$setsessionStorage('search-item', res)
                    window.open(window.location.origin + '/#' + '/intelligence/threat_detail?searchStr=' + value)
                })
                .catch(err => {
                    this.btnLoading = false
                    console.log(err + 'err')
                })
        },
        handleExpand(row, expandedRows) {
            // this.filterKeyword()
            let that = this
            if (expandedRows.length) {
                that.expandRowKeys = []
                if (row) {
                    that.expandRowKeys.push(row.id)

                    console.log(row, '展开')
                    this.expandData = []
                    this.expandJsonData = {}
                    let data = {
                        queryData: {
                        },
                        paramsData: {
                            id: row.id,
                            logType: row.logType,
                            alarmTime: row.alarmTime
                        }
                    }
                    getExpandLog(data)
                        .then(res => {
                            let arr = []
                            let obj = {}
                            let messageObj = null
                            let alarmTimeObj = null
                            console.log(res, '展开信息')
                            for (const resKey in res) {
                                if (res[resKey] !== '') {
                                    if (resKey === 'message') {
                                        messageObj = {
                                            name: '原始字段',
                                            value: res.message
                                        }
                                        continue
                                    }
                                    if (resKey === 'alarmTime') {
                                        alarmTimeObj = {
                                            name: '发生时间',
                                            value: res.alarmTime
                                        }
                                        continue
                                    }
                                    let item = this.listAll.find(it => it.fieldName === resKey)
                                    if (item) {
                                        const obj1 = {
                                            fieldName: item.fieldName,
                                            name: item.name,
                                            value: res[resKey],
                                            type: item.type
                                        }
                                        if (obj1.fieldName == 'srcIp' || obj1.fieldName == 'desIp') {
                                            const field = `${obj1.fieldName}IsSpite`
                                            obj1[field] = res[field]
                                            const field1 = `${obj1.fieldName}VenusIsSpite`
                                            obj1[field1] = res[field1]
                                            console.log(res[field])
                                        }
                                        arr.push(obj1)
                                        obj[item.fieldName] = res[resKey]
                                    }
                                }
                            }
                            if (messageObj) {
                                arr.push(messageObj)
                            }
                            if (alarmTimeObj) {
                                arr.unshift(alarmTimeObj)
                            }
                            this.expandData = arr
                            this.expandJsonData = obj
                        })
                        .then(() => {
                            if (row.nftData === 2) {
                                that.lookPcac(row)
                            }
                        })
                        .catch(err => {
                            console.log(err)
                        })
                }
            } else {
                that.expandRowKeys = []
            }
        },
        editSelectFields(list) {
            console.log(list, '已选字段')
            let data = {
                queryData: {},
                paramsData: {
                    fieldIds: list
                }
            }
            updateAlarmFields(data)
                .then(res => {
                    this.transferDialog = false
                    this.$message.success('操作成功')
                    this.initCanSelectedFileds()
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
}
</script>
<style lang="scss" scoped>
.set-header {
    color: #0052d9;
    cursor: pointer;
}
.click-btn {
    cursor: pointer;
    font-size: 12px;
    i {
        margin-right: 5px;
        color: #387dee;
    }
    span .val {
        color: #387dee;
    }
}
div ::v-deep .el-table__expand-column.expand-col {
    width: 30px;
    border: none;
}
.el-tabs__nav-scroll {
    margin-left: 20px !important;
}
</style>
