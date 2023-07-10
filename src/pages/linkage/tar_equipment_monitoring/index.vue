<template>
    <div class="list">
        <SearchTop @search="searchCheck" @reset="reset" style="border-top-left-radius:0;border-top-right-radius:0;box-shadow:none">
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params">
                    <el-form-item label="设备IP：" label-width="80px">
                        <el-input
                            placeholder="请输入"
                            clearable
                            v-model="get_params.ip"
                            @keyup.enter.native="searchCheck"
                            size="small"
                        ></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params">
                    <el-form-item label="授权状态：" label-width="80px">
                        <el-select
                            clearable
                            filterable
                            v-model="get_params.accreditStatus"
                            placeholder="请选择"
                            style="width: 100%"
                            size="small"
                        >
                            <el-option
                                v-for="item in accreditStatusData"
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
            </el-col>
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params">
                    <el-form-item label="系统服务状态：" label-width="100px">
                        <el-select
                            clearable
                            filterable
                            v-model="get_params.serveStatus"
                            placeholder="请选择"
                            style="width: 100%"
                            size="small"
                        >
                            <el-option
                                v-for="item in serveStatusData"
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
                    <el-form-item label="授权到期时间：" label-width="100px">
                        <el-date-picker
                            style="width:252px;"
                            size="small"
                            v-model="expireTime"
                            type="datetimerange"
                            :default-time="['00:00:00', '23:59:59']"
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
        <div class="list-container" style="padding-bottom: 10px">
            <div class="ub ub-pj w100 mb-1 ub-ac">
                <div class="list-tips">设备监控</div>
            </div>
            <el-table
                ref="multipleTable"
                v-loading="loading"
                class="bigTable full-table"
                :data="tableData"
                border
                stripe
                :height="tabHeight"
                :row-class-name="tableRowClassName"
                :row-style="{ height: '32px' }"
                :header-row-style="{ height: '32px' }"
                tooltip-effect="dark">
                <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                </el-table-column>
                <el-table-column prop="vendorDeviceIp" label="设备IP" show-overflow-tooltip> </el-table-column>
                <el-table-column prop="authorityStatus" label="授权状态" show-overflow-tooltip>
                    <template slot-scope="{row}">
                        <div>
                            <span>{{row.authorityStatus|getauthorityStatus}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="expireTime" label="授权到期时间" width="160"> </el-table-column>
                <el-table-column prop="serviceStatus" label="系统服务状态" show-overflow-tooltip>
                    <template slot-scope="{row}">
                        <div>
                            <span>{{row.serviceStatus==1?'异常':'正常'}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop=" " label="CPU利用率">
                    <template slot-scope="{row}">
                        <div>
                            <span>{{row.info|getCpu}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop=" " label="内存利用率">
                    <template slot-scope="{row}">
                        <div>
                            <span>{{row.info|getmem}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop=" " label="内存大小">
                    <template slot-scope="{row}">
                        <div>
                            <span>{{row.info|getmem_size}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop=" " label="已使用大小">
                    <template slot-scope="{row}">
                        <div>
                            <span>{{row.info|getmem_size_used}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="120">
                    <template slot-scope="{row}">
                        <el-button @click="handleSee(row)" size="small" type="text">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="total_num>0" :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size" @pagination="get_data" style="padding-top:10px"/>
        </div>
    </div>
</template>

<script>
import {
    get_tar_monitor_list,
    get_tar_accreditStatus
} from '../../../server/linkage/tar.js'
export default {
    name: 'TarEquipmentMonitoring',
    data() {
        return {
            tabHeight: document.body.clientHeight - 282,
            serveStatusData: [
                {
                    label: '正常',
                    value: 0
                },
                {
                    label: '异常',
                    value: 1
                }
            ],
            accreditStatusData: [
                {
                    label: '授权正常',
                    value: 0
                },
                {
                    label: '授权已过期',
                    value: 1
                },
                {
                    label: '未授权',
                    value: 2
                }
            ],
            formLabelWidth: '120px',
            loading: false,
            total_num: 0,
            expireTime: null,
            tableData: [],
            get_params: {
                page: 1,
                size: 20,
                ip: '',
                accreditStatus: '',
                serveStatus: ''
            },
            timer: null
        }
    },
    filters: {
        getmem_size_used(info) {
            info = JSON.parse(info)
            return (info.used || info.used === 0) ? (info.used / 1024 / 1024).toFixed(2) + 'GB' : '--'
        },
        getmem_size(info) {
            info = JSON.parse(info)
            return (info.mem_size || info.mem_size === 0) ? (info.mem_size / 1024 / 1024).toFixed(2) + 'GB' : '--'
        },
        getmem(info) {
            info = JSON.parse(info)
            return info.mem_percent + '%'
        },
        getCpu(info) {
            info = JSON.parse(info) ? JSON.parse(info) : ''
            return info.cpu_percent + '%'
        },
        getauthorityStatus(val) {
            if (val == 0) {
                return '正常'
            } else if (val == 1) {
                return '已过期'
            } else if (val == 2) {
                return '未授权'
            }
        }
    },
    watch: {},
    mounted() {
        this.clearSetTimer()
        this.$nextTick(() => {
            this.get_data()
            this.timer = setInterval(this.get_data, 60 * 1000)
        })
    },
    beforeDestroy() {
        this.clearSetTimer()
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
                ip: '',
                accreditStatus: '',
                serveStatus: ''
            }
            this.expireTime = null
            this.get_data()
        },
        handleSee(row) {
            this.$router.push({
                path: '/linkage/linkage_tar_over_view',
                query: {
                    id: row.appKey,
                    ip: row.vendorDeviceIp
                }
            })
        },
        clearSetTimer() {
            if (this.timer) {
                clearTimeout(this.timer)
            }
            this.timer = null
        },
        reserFun() {
            this.expireTime = null
            this.get_params = {
                page: 1,
                size: 20,
                ip: '',
                accreditStatus: '',
                serveStatus: ''
            }
        },
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        getStyle() {
            let ws = window.screen.width
            if (ws >= 1680) {
                return {
                    width: '280px'
                }
            } else if (ws < 1680) {
                return {
                    width: '280px'
                }
            }
        },
        searchCheck() {
            this.get_params.page = 1
            this.get_data()
        },
        get_data() {
            this.loading = true
            console.log('enenne')
            this.tableData = []
            let data = {
                queryData: {
                    size: this.get_params.size,
                    pageSize: this.get_params.page
                },
                paramsData: {
                    vendorDeviceIp: this.get_params.ip,
                    authorityStatus: this.get_params.accreditStatus,
                    startTime: this.expireTime === null ? '' : this.expireTime[0],
                    endTime: this.expireTime === null ? '' : this.expireTime[1],
                    serviceStatus: this.get_params.serveStatus
                }
            }
            get_tar_monitor_list(data).then(res => {
                console.log(res, '查询')
                this.loading = false
                this.total_num = res.total
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
        }
    }
}
</script>

<style lang="scss" scoped>
.el-date-editor {
    ::v-deep input{
        font-size:12px !important;
    }
}
.tar-equipment-monitoring {
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
