<template>
    <div class="list">
        <div class="w100">
            <div class="ub w100 search-area" style="box-sizing: border-box;">
                <SearchTop @search="searchCheck" @reset="reserFun" @isOpen="isOpen1" style="border-top-left-radius:0;border-top-right-radius:0;box-shadow:none">
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="规则名称：" label-width="80px">
                                <el-input
                                    placeholder="请输入"
                                    clearable
                                    v-model="get_params.ruleName"
                                    @keyup.enter.native="searchCheck"
                                    size="small"
                                ></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="威胁类型：" label-width="80px">
                                <el-select
                                    clearable
                                    filterable
                                    v-model="get_params.eventType"
                                    placeholder="请选择"
                                    style="width: 100%"
                                    size="small"
                                    @change="eventTypeChange"
                                >
                                    <el-option
                                        v-for="item in eventTypeData"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="威胁子类型：" label-width="90px">
                                <el-select
                                    clearable
                                    filterable
                                    v-model="get_params.eventSubType"
                                    placeholder="请选择"
                                    style="width: 100%"
                                    size="small"
                                >
                                    <el-option
                                        v-for="item in eventSubTypeData"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="威胁级别：" label-width="80px">
                                <el-select
                                    clearable
                                    filterable
                                    v-model="get_params.eventServerity"
                                    style="width: 100%"
                                    placeholder="请选择"
                                    size="small"
                                >
                                    <el-option
                                        v-for="item in eventServerityData"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="源IP：" label-width="80px">
                                <el-input
                                    placeholder="请输入"
                                    clearable
                                    v-model="get_params.sourceIp"
                                    @keyup.enter.native="searchCheck"
                                    size="small"
                                ></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="源端口：" label-width="80px">
                                <el-input
                                    placeholder="请输入"
                                    clearable
                                    v-model="get_params.sourcePort"
                                    @keyup.enter.native="searchCheck"
                                    size="small"
                                ></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="目的IP：" label-width="80px">
                                <el-input
                                    placeholder="请输入"
                                    clearable
                                    v-model="get_params.destinationIp"
                                    @keyup.enter.native="searchCheck"
                                    size="small"
                                ></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="目的端口：" label-width="80px">
                                <el-input
                                    placeholder="请输入"
                                    clearable
                                    v-model="get_params.destinationPort"
                                    @keyup.enter.native="searchCheck"
                                    size="small"
                                ></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </SearchTop>
            </div>
            <div class="list-container" style="padding-bottom: 10px">
                <div class="ub ub-pj w100 mb-1 ub-ac">
                    <div class="list-tips">自定义规则</div>
                    <div>
                        <el-button icon="el-icon-plus" size="small" type="primary" @click="handleAdd" v-per="['link_manage_rule_add']">新增规则</el-button>
                    </div>
                </div>
                <el-table
                    ref="multipleTable"
                    v-loading="loading"
                    class="bigTable full-table"
                    :data="tableData"
                    border
                    :row-class-name="tableRowClassName"
                    stripe
                    :height="tabHeight"
                    tooltip-effect="dark"
                    :row-style="{ height: '32px' }"
                    :header-row-style="{ height: '32px' }"
                >
                    <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                    </el-table-column>
                    <el-table-column prop="ruleName" label="规则名称" show-overflow-tooltip> </el-table-column>
                    <el-table-column prop="eventType" label="威胁类型" show-overflow-tooltip> </el-table-column>
                    <el-table-column prop="eventSubType" label="威胁子类型" show-overflow-tooltip> </el-table-column>
                    <el-table-column prop="eventServerityCN" label="威胁级别" show-overflow-tooltip> </el-table-column>
                    <el-table-column prop="sourceIp" label="源IP" show-overflow-tooltip> </el-table-column>
                    <el-table-column prop="sourcePort" label="源端口" show-overflow-tooltip> </el-table-column>
                    <el-table-column prop="destinationIp" label="目的IP" show-overflow-tooltip> </el-table-column>
                    <el-table-column prop="destinationPort" label="目的端口" show-overflow-tooltip> </el-table-column>
                    <el-table-column prop="featureValue" label="特征值" show-overflow-tooltip> </el-table-column>
                    <el-table-column prop="updateStatus" label="升级状态">
                        <template slot-scope="{row}">
                            <div>
                                <span v-if="row.updateStatus === 1">升级完成</span>
                                <span v-if="row.updateStatus === 0">升级中</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="updateEndTime" label="升级时间" width="160">
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="160" fixed="right" class-name="deepBg">
                        <template slot-scope="scope">
                            <el-button @click="handleEdit(scope.row)" size="small" type="text" v-per="['link_manage_rule_edit']">编辑</el-button>
                            <el-button size="small" type="text" @click="handleDelete(scope.row)" v-per="['link_manage_rule_del']">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination v-show="total_num>0" :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size" @pagination="get_data" style="padding-top:10px"/>
            </div>
        </div>
        <!--新增编辑规则-->
        <add-custom-rule ref="addCustomRule" @handleConfirm="handleConfirm" :sumData="sumData" :eventTypeData="eventTypeData" :eventServerityData="eventServerityData"></add-custom-rule>
        <!--删除-->
        <custom-del-dialog ref="customDelDialog" @handleConfirm="handleConfirm"></custom-del-dialog>
    </div>
</template>

<script>
import { getEventType, getAll, addCustomRule } from '@/server/linkage/custom_rule.js'
import AddCustomRule from './module/add_custom_rule'
import CustomDelDialog from './module/custom_del_dialog'
export default {
    name: 'CustomRule',
    components: { AddCustomRule, CustomDelDialog },
    data() {
        return {
            tabHeight: document.body.clientHeight - 290,
            isOpen: false,
            eventServerityData: [
                {
                    value: 1,
                    label: '一般'
                },
                {
                    value: 2,
                    label: '较大'
                },
                {
                    value: 3,
                    label: '重大'
                },
                {
                    value: 4,
                    label: '特别重大'
                }
            ],
            sumData: [],
            eventTypeData: [],
            eventSubTypeData: [],
            formLabelWidth: '120px',
            loading: false,
            total_num: 0,
            tableData: [],
            get_params: {
                page: 1,
                size: 20,
                ruleName: '',
                eventType: '',
                eventSubType: '',
                eventServerity: '',
                sourceIp: '',
                sourcePort: '',
                destinationIp: '',
                destinationPort: ''
            },
            timer: null,
            kaiguan: false
        }
    },
    watch: {
        kaiguan(val) {
            if (val) {
                this.tabHeight = document.body.clientHeight - 340
            } else {
                this.tabHeight = document.body.clientHeight - 290
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.getEventTypeData()
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
        isOpen1(val) {
            console.log(val)
            this.kaiguan = val
        },
        getKeyValue(val) {
            val.map(item => {
                return {
                    value: item,
                    label: item
                }
            })
        },
        eventTypeChange(val) {
            this.get_params.eventSubType = ''
            let optionData = []
            this.sumData.forEach(item => {
                if (item.name === val) {
                    optionData = item.sub
                }
            })
            if (optionData.length > 0 && val) {
                this.eventSubTypeData = optionData.map(item => {
                    return {
                        value: item,
                        label: item
                    }
                })
            } else {
                this.eventSubTypeData = []
            }
        },
        getEventTypeData() {
            getEventType({})
                .then(res => {
                    this.sumData = res
                    this.eventTypeData = res.map(item => {
                        return {
                            value: item.name,
                            label: item.name
                        }
                    })
                })
                .catch(error => {
                    console.log('error' + error)
                })
        },
        handleConfirm() {
            this.get_data()
        },
        handleDelete(row) {
            this.$refs.customDelDialog.deleteId = row.id
            this.$refs.customDelDialog.deleteDialog = true
        },
        handleEdit(row) {
            this.$refs.addCustomRule.addForm.id = row.id
            this.$refs.addCustomRule.addForm.ruleName = row.ruleName
            this.$refs.addCustomRule.addForm.eventType = row.eventType
            this.$refs.addCustomRule.addForm.eventSubType = row.eventSubType
            this.$refs.addCustomRule.addForm.eventServerity = row.eventServerity
            this.$refs.addCustomRule.addForm.sourceIp = row.sourceIp
            this.$refs.addCustomRule.addForm.sourcePort = row.sourcePort
            this.$refs.addCustomRule.addForm.destinationIp = row.destinationIp
            this.$refs.addCustomRule.addForm.destinationPort = row.destinationPort
            this.$refs.addCustomRule.addForm.featureValue = row.featureValue
            this.$refs.addCustomRule.setEventSubTypeData(row.eventType)
            this.$refs.addCustomRule.addDialog = true
        },
        handleAdd() {
            this.$refs.addCustomRule.addDialog = true
        },
        reserFun() {
            this.expireTime = []
            this.get_params = {
                page: 1,
                size: 20,
                ruleName: '',
                eventType: '',
                eventSubType: '',
                eventServerity: '',
                sourceIp: '',
                sourcePort: '',
                destinationIp: '',
                destinationPort: ''
            }
            this.get_data()
        },
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
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
                    ruleName: this.get_params.ruleName,
                    eventType: this.get_params.eventType,
                    eventSubType: this.get_params.eventSubType,
                    eventServerity: this.get_params.eventServerity,
                    sourceIp: this.get_params.sourceIp,
                    sourcePort: this.get_params.sourcePort,
                    destinationIp: this.get_params.destinationIp,
                    destinationPort: this.get_params.destinationPort
                }
            }
            getAll(data)
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
.custom-rule {
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
</style>
