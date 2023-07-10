<template>
    <div class="list">
        <SearchTop @reset="reset" @search="search">
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="searchForm">
                    <el-form-item label="用户角色:" label-width="64px">
                        <el-select @change="search" size="small" style="width:100%;" clearable v-model="searchForm.roleId" placeholder="请选择">
                            <el-option v-for="item in roles" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="searchForm">
                    <el-form-item label="日期:" label-width="80px">
                        <el-date-picker
                            size="small"
                            style="width:100%;"
                            :clearable="false"
                            v-model="searchForm.time"
                            type="daterange"
                            value-format="yyyy-MM-dd"
                            prefix-icon="iconfont icon-riqi"
                            range-separator="~"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            @change="search"
                        >
                        </el-date-picker>
                    </el-form-item>
                </el-form>
            </el-col>
        </SearchTop>
        <div class="list-container">
            <div class="ub ub-pj w100 mb-1">
                <div class="list-tips">列表内容</div>
                <div>
                    <el-tooltip class="item" effect="dark" content="最多支持导出1万条数据" placement="top">
                        <el-button v-per="['base_log_oper_exp']" size="small" icon="el-icon-download" type="primary" @click="exoprtFile">导 出</el-button>
                    </el-tooltip>
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
                @selection-change="handleSelectionChange"
                :height="tableHeight"
                :row-style="{ height: '32px' }"
                :header-row-style="{ height: '32px' }"
                :row-key="row => {return row.id}"
            >
                <el-table-column type="selection" :reserve-selection="true" width="50"></el-table-column>
                <el-table-column align="center" type="index" width="50" label="序号">
                </el-table-column>
                <el-table-column prop="username" label="用户名">
                </el-table-column>
                <el-table-column prop="ip" label="登录IP">
                </el-table-column>
                <el-table-column prop="operationBeginTime" label="操作开始时间">
                </el-table-column>
                <el-table-column prop="url" label="业务功能">
                </el-table-column>
                <el-table-column prop="status" label="操作是否成功">
                    <template slot-scope="{row}">
                        <div><span>{{row.status==1?'是':'否'}}</span></div>
                    </template>
                </el-table-column>
                <el-table-column prop="operationEndTime" label="操作结束时间">
                </el-table-column>
            </el-table>
            <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="initList" />
        </div>
    </div>

</template>

<script>

import { get_option_logos_list, export_option_logos } from '@/server/system/logos.js'
import initData from '@/mixins/initData.js'
export default {
    name: 'OptionLogs',
    mixins: [initData],
    props: {
        roles: {
            type: Array,
            default: null
        }
    },
    data() {
        return {
            tableHeight: document.body.clientHeight - 310,
            searchForm: {
                time: [],
                roleId: ''
            },
            multipleSelection: []

        }
    },
    filters: {
        filter_quitReason(val) {
            if (val == 1) {
                return '正常退出'
            } else if (val == 2) {
                return '顶掉 3'
            } else {
                return '强制退出'
            }
        }
    },
    mounted() {},
    created() {
        this.initList()
    },
    beforeDestroy() {
        console.log('关闭了')
    },
    methods: {
        exoprtFile() {
            let ids = this.multipleSelection.length > 0 ? this.multipleSelection.map(item => item.id) : []
            let data = {
                queryData: {},
                paramsData: {
                    roleId: this.searchForm.roleId,
                    beginTime: this.searchForm.time === null ? '' : this.searchForm.time[0],
                    endTime: this.searchForm.time === null ? '' : this.searchForm.time[1],
                    ids: ids
                }
            }
            export_option_logos(data).then(res => {
                console.log(res, this, '----------数据')
                this.download(res)
            })
        },
        download(data) {
            if (!data) {
                return
            }
            let url = window.URL.createObjectURL(new Blob([data]))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.id = 'logosDownloadElement'
            link.setAttribute('download', '操作日志.xls') // 命名可能会出现问题，格式一定和后端下载的格式一样
            document.body.appendChild(link)
            link.click()
            document.getElementById('logosDownloadElement').remove()
        },
        search() {
            this.listQuery.page = 1
            this.initList()
        },
        reset() {
            this.$refs.multipleTable.clearSelection()
            this.searchForm.time = []
            this.searchForm.roleId = ''
            this.initList()
        },
        initList() {
            this.listLoading = true
            this.tableData = []
            let data = {
                queryData: {
                    page: this.listQuery.page,
                    pageSize: this.listQuery.limit
                },
                paramsData: {
                    roleId: this.searchForm.roleId,
                    beginTime: this.searchForm.time === null ? '' : this.searchForm.time[0],
                    endTime: this.searchForm.time === null ? '' : this.searchForm.time[1]
                }
            }
            get_option_logos_list(data).then(res => {
                console.log('登录日志', res)
                this.listLoading = false
                this.total = res.total
                let list = res.records
                if (list.length > 0) {
                    this.tableData = list.map(item => {
                        return item
                    })
                }
            }).catch(error => {
                this.listLoading = false
                console.log('error' + error)
            })
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        }
    }
}
</script>

<style scoped lang="scss">

</style>
