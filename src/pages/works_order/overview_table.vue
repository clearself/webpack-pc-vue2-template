<template>
    <div class="w100 event work-detail" style="overflow-x:hidden;padding: 10px;">
        <div class="ub ub-pj w100" style="margin-bottom: 10px;">
            <div class="list-tips">列表内容</div>
        </div>
        <el-table ref="multipleTable" v-loading="loading" :height="tableHeight" class='bigTable work-overview' border  :data="tableData">
            <!-- <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号"></el-table-column> -->
            <el-table-column label="工单名称" align="center">
                <template slot-scope="scope" width="160">
                    <div>{{scope.row.workOrderName}}</div>
                </template>
            </el-table-column>
            <el-table-column label="参与人" align="center" width="800">
                <template slot-scope="scope">
                    <div>
                        <span style="font-size: 12px;">{{scope.row.userName}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" align="center" width="200">
            </el-table-column>
        </el-table>
        <pagination v-show="total_num>0" :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size" @pagination="get_data" />

    </div>
</template>

<script>
import {
    get_work_order_overview_list
} from '../../server/works_order/api.js'
export default {
    name: 'OverviewTable',
    props: {
        type: {
            type: Number,
            default: 1
        },
        timeType: {
            type: Number,
            default: 0
        },
        search: {
            type: String,
            default: ''
        },
        selectTimes: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            tableHeight: document.body.clientHeight - 446,
            bpmRecord: [],
            detailDialog: false,
            totalPages: 0,
            loading: false,
            get_params: {
                page: 1,
                size: 20
            },
            total_num: 0,
            tableData: [],
            rowIndex: '-1',
            OrderIndexArr: [],
            hoverOrderArr: [],
            workTaskInfo: {
                workOrderObject: ''
            },
            oneKeyList: [],
            userList: [],
            assetList: [],
            systemList: []
        }
    },

    mounted() {
        this.$nextTick(() => {
            this.get_data()
        })
    },
    methods: {
        tableRowClassNameTwo({ row, rowIndex }) {
            if (rowIndex % 2) {
                return 'table-row2'
            } else {
                return 'table-row1'
            }
        },
        reset() {
            this.get_params.page = 1
        },
        arraySpanMethod({ row, column, rowIndex, columnIndex }) {
            if (columnIndex !== 0) {
                return [1, 3]
            }
        },
        tableRowClassName({ row, rowIndex }) {
            let arr = this.hoverOrderArr
            for (let i = 0; i < arr.length; i++) {
                if (rowIndex == arr[i]) {
                    return 'hovered-row'
                }
            }
        },

        cellMouseEnter(row, column, cell, event) {
            this.rowIndex = row.rowIndex
            this.hoverOrderArr = []
            this.OrderIndexArr.forEach(element => {
                if (element.indexOf(this.rowIndex) >= 0) {
                    this.hoverOrderArr = element
                }
            })
        },

        cellMouseLeave(row, column, cell, event) {
            this.rowIndex = '-1'
            this.hoverOrderArr = []
        },
        get_data() {
            let data = {
                queryData: {
                    page: this.get_params.page,
                    pageSize: this.get_params.size
                },
                paramsData: {
                    type: this.type,
                    startTime: '',
                    endTime: '',
                    name: this.search
                }
            }
            console.log('this.timeType', this.timeType)
            if (this.timeType === 1) {
                /* 星期*/
                data.paramsData.startTime = this.dateFormat(1)
                data.paramsData.endTime = this.dateFormat()
            } else if (this.timeType === 2) {
                /* 月份*/
                data.paramsData.startTime = this.dateFormat(2)
                data.paramsData.endTime = this.dateFormat()
            } else if (this.selectTimes) {
                data.paramsData.startTime = this.selectTimes ? this.selectTimes[0] : ''
                data.paramsData.endTime = this.selectTimes ? this.selectTimes[1] : ''
            }
            this.loading = true
            this.tableData = []
            get_work_order_overview_list(data).then(res => {
                console.log(res, '111111111工单列表')
                this.loading = false
                this.total_num = res.total
                let list = res.records
                if (list.length > 0) {
                    this.tableData = list.map(item => {
                        item.userName = item.sub[0].userName
                        item.createTime = item.sub[0].createTime
                        return item
                    })
                    this.$nextTick(() => {
                        this.$refs.multipleTable.doLayout()
                    })
                }
            }).catch(err => {
                this.loading = false
                console.log(err, 'err')
            })
        },
        dateFormat(val) {
            var date0 = Date.now()// 时间戳为10位需*1000，时间戳为13位的话不需乘1000
            if (val === 1) {
                date0 = date0 - 7 * 24 * 60 * 60 * 1000
            } else if (val === 2) {
                date0 = date0 - 30 * 24 * 60 * 60 * 1000
            }
            var date = new Date(date0)
            var Y = date.getFullYear() + '-'
            var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
            var D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' '
            var h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':'
            var m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':'
            var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
            return Y + M + D + h + m + s
        },
        handleSizeChange(val) {
            this.get_params.size = val
            this.get_data()
        },
        handleCurrentChange(val) {
            this.get_params.page = val
            this.get_data()
        },
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        }
    }
}
</script>

<style lang="scss" scoped>

.bigTable {
    ::v-deep .caret-wrapper {
        height: 22px;
    }
    ::v-deep .sort-caret.ascending {
        border-bottom-color: #fff;
        top: 0;
    }
    ::v-deep .sort-caret.descending {
        border-top-color: #fff;
        bottom: 0;
    }
    ::v-deep .descending .sort-caret.descending {
        border-top-color: #01fdfe;
    }
    ::v-deep .ascending .sort-caret.ascending {
        border-bottom-color: #01fdfe;
    }
}

.event ::v-deep .el-timeline-item__timestamp.is-top {
    margin-bottom: 8px;
    padding-top: 3px;
    position: absolute;
    left: -145px;
    top: 0;
    font-size: 12px;
    width: 130px;
    text-align: right;
    color: #fff;
}

.event ::v-deep .el-range-input {
    background-color: rgba(0, 0, 0, 0);
    color: #fff;
}

.event ::v-deep .el-range-separator {
    color: #fff;
}

.el-tabs ::v-deep .el-tabs__nav-wrap::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1px;
    background-color: rgba(28, 215, 250, 0.2);
    z-index: 1;
}

.el-tabs ::v-deep .el-tabs__active-bar {
    background: #1cd7fa;
    margin-left: 14px;
}

.el-tabs ::v-deep .el-tabs__item.is-active {
    color: #1cd7fa;
    height: 34px;
    line-height: 34px;
    border-color: transparent;
}

.el-tabs ::v-deep .el-tabs__item.is-top {
    margin-left: 14px;
    color: #1cd7fa;
    border-bottom: 2px solid #1cd7fa;
}

.task-status {
    padding-right: 30px;
    box-sizing: border-box;
    margin: 16px 0 30px;
}

.task-status>div:nth-child(1) {
    color: #fff;
    font-size: 22px;
}

.assets-big-image ::v-deep .el-image-viewer__close {
    color: #00E1FF !important;
}

.task-status>div:nth-child(2) {
    color: #fff;
    font-size: 12px;

    span.one {
        color: #c0c0c0;
    }

    span.two {
        color: #fdb900;
    }

    span.three {
        color: #00bffe;
    }
}

.label {
    width: 100px;
    font-size: 12px;
    color: #999;
    text-align: right;
    margin-right: 15px;
}

.label-val {
    font-size: 12px;
    color: #fff;
}

.event ::v-deep .el-timeline-item__tail {
    border-left: 2px solid #00B7EE !important;
}

.event ::v-deep .el-timeline-item__icon.el-icon-circle-check {
    color: #00B7EE !important;
    font-size: 20px !important;
}

.event ::v-deep .el-timeline-item__icon.icon-circle {
    color: #00B7EE !important;
    font-size: 16px !important;
    font-weight: 500;
}

.time-box {
    width: 100%;
}

.time-left>h4 {
    color: #fff;
    font-weight: 500;
}

.time-left>p {
    color: #999;
    font-size: 12px;
    margin-top: 5px;
}

.time-right>div.one {
    color: #c0c0c0;
}

.time-right>div.two {
    color: #fdb900;
}

.time-right>div.three {
    color: #00bffe;
}

.time-right>p {
    color: #fff;
    font-size: 12px;
    margin-top: 5px;
}
</style>
<style>
    .time-text-box-right * {
        word-break: break-all;
    }

    .time-text-box-right p {
        font-size: 12px !important;
    }

    .time-text-box-right img {
        max-width: 50% !important;
    }
    .work-overview.el-table tr{
        box-shadow:none!important;
        /* max-height: 36px!important; */
    }
    .work-overview.el-table .hovered-row {
        background: #f5f7fa!important;
    }
    /* .work-overview.el-table tr:hover {
      background-color: rgba(0,0,0,0)!important;
    } */
    .work-overview .cell{
        padding:0!important;
        /* line-height: 36px; */
    }
    .work-overview.el-table td {
        padding: 0 !important;

    }

    .work-overview-inner.el-table--border::after, .work-overview-inner.el-table--group::after, .work-overview-inner.el-table::before {
        background-color: rgba(0,0,0,0) !important;
    }
    .work-overview-inner.el-table tbody>tr td {
        /* max-height: 36px!important; */
    }
    .work-overview-inner.el-table tbody>tr:last-of-type td {
        border-bottom: 1px solid rgba(0,0,0,0) !important;
    }
    .white-theme .work-overview-inner.el-table--border::after, .white-theme .work-overview-inner.el-table::before {
        background-color: rgba(0,0,0,0) !important;
    }
</style>
