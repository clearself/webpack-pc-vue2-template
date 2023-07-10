<template>
    <div class="list">
        <SearchTop @search="search_match" @reset="reset">
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :inline="true" :model="get_params" class="demo-form-inline">
                    <el-form-item label="演练名称：">
                        <el-input size="small" clearable v-model.trim="get_params.name" placeholder="请输入"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
        </SearchTop>
        <div class="list-container">
            <div class="ub ub-pj w100 mb-1 ub-ac">
                <div class="list-tips">演练任务</div>
                <div>
                    <el-button icon="el-icon-plus" size="small" type="primary" @click="createMatch" v-per="['defense_task_add']">创建赛事</el-button>
                    <el-button style="margin-left:10px;" icon="el-icon-delete" size="small" type="danger"  @click="deleteAll" v-per="['defense_task_del']">删除</el-button>
                </div>
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
                @selection-change="handleSelectionChange"
                :row-style="{ height: '32px' }"
                :header-row-style="{ height: '32px' }"
                :height="tabHeight">
                <el-table-column align="center" type="selection" width="50"></el-table-column>
                <el-table-column align="center" type="index" label="序号" width="50" :index="indexMatchMethod">
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="name" label="演练名称" width="180px">
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="game_aims" label="演练目标" width="180px">
                    <template slot-scope="scope">
                        <div>
                            <span v-if="scope.row.game_aims">{{scope.row.game_aims}}</span>
                            <span v-else>--</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip label="演练规则" width="80px">
                    <template slot-scope="scope">
                        <div>
                            <a class="num-btn" v-if="scope.row.game_rule_file_path!=''" style="text-decoration: underline;color:rgba(0,82,217,1);cursor: pointer;" :href="scope.row.game_rule_file_path" :download="scope.row.game_rule_file_name">下载</a>
                            <span v-else>未上传</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="refereer" label="裁判人数" width="100px">
                </el-table-column>
                <el-table-column prop="attacker" label="攻击方人数" width="100px">
                </el-table-column>
                <el-table-column prop="defenser" label="防守方人数" width="100px">
                </el-table-column>
                <el-table-column prop="start_time" label="演练开始时间" width="170px">
                </el-table-column>
                <el-table-column prop="end_time" label="演练结束时间" width="170px">
                </el-table-column>
                <el-table-column  width="100" :render-header="renderHeader">
                    <template slot-scope="scope">
                        <div>
                            <div v-if="scope.row.state_id==1" class="ub ub-ac match-state one">
                                <div style="width:80px;text-align:center">{{scope.row.state}}</div>
                            </div>
                            <div v-if="scope.row.state_id==2" class="ub ub-ac match-state two">
                                <div style="width:80px;text-align:center">{{scope.row.state}}</div>
                            </div>
                            <div v-if="scope.row.state_id==3" class="ub ub-ac match-state three">
                                <div style="width:80px;text-align:center">{{scope.row.state}}</div>
                            </div>
                            <div v-if="scope.row.state_id==4" class="ub ub-ac match-state four">
                                <div style="width:80px;text-align:center">{{scope.row.state}}</div>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="attack_num" label="攻击战绩" width="100px">
                </el-table-column>
                <el-table-column prop="defense_num" label="防御战绩" width="100px">
                </el-table-column>
                <el-table-column label="操作" align="center" width="220px" fixed="right" class-name="deepBg">
                    <template slot-scope="scope">
                        <el-button @click="handleDetail(scope.row)" type="text" size="mini" v-per="['defense_task_view']">查看</el-button>
                        <!-- <el-dropdown trigger="click" :hide-on-click="true" style="margin: 0 10px">
                            <el-button size="small" type="text">更多</el-button>
                            <el-dropdown-menu slot="dropdown" style="width:90px">
                                <el-dropdown-item command="a">
                                    <el-button :disabled="scope.row.state_id==1||scope.row.state_id==4" @click="handleClose(scope.row)" type="text" size="mini" v-per="['defense_task_close']">关闭赛事</el-button>
                                </el-dropdown-item>
                                <el-dropdown-item command="b">
                                    <el-button @click="handleTaiShi(scope.row)" type="text" size="mini" v-per="['defense_task_dp']">态势</el-button>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown> -->
                        <el-button :disabled="scope.row.state_id==1||scope.row.state_id==4" @click="handleClose(scope.row)" type="text" size="mini" v-per="['defense_task_close']">关闭赛事</el-button>
                        <el-button @click="handleTaiShi(scope.row)" type="text" size="mini" v-per="['defense_task_dp']">态势</el-button>
                        <el-button @click="handleEdit(scope.row)"  type="text" size="mini" v-per="['defense_task_edit']">编辑</el-button>
                        <el-button @click="handleDekete(scope.row)" type="text" size="mini" v-per="['defense_task_del']">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size"  style="padding-top:10px" @pagination="get_data"/>
        </div>
        <el-dialog title="关闭赛事" :visible.sync="closeDialog" width="700px" custom-class="common-dialog" >
            <!-- <span>确定关闭该赛事吗？</span> -->
            <el-form ref="form" :model="{}" label-width="100px" label-position="top">
                <el-form-item label="终止原因：">
                    <el-input type="textarea" rows="3" v-model.trim="overReason" placeholder="请输入"></el-input>
                </el-form-item>
            </el-form >
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="closeDialog = false">取消</el-button>
                <el-button size="small" type="primary" @click="close_match">确定</el-button>
            </span>
        </el-dialog>
        <DeleteDialog
            :dialogVisible = deleteDialog
            @delete="delete_match"
            @cancel="deleteDialog = false">
        </DeleteDialog>
        <DeleteDialog
            :dialogVisible = deleteAllAttackDialog
            @delete="delete_all_match"
            @cancel="deleteAllAttackDialog = false">
        </DeleteDialog>
        <match_detail ref="alarmDetailRef"></match_detail>
    </div>
</template>

<script>
import {
    get_match_list,
    delete_match,
    close_match
} from '../../server/defense_drill/defense.js'
import match_detail from './match/match_detail.vue'

export default {
    name: 'MatchList',
    components: {
        match_detail
    },
    data() {
        return {
            tabHeight: document.body.clientHeight - 262,
            overReason: '',
            deleteAllAttackDialog: false,
            multipleSelection: [],
            closeId: '',
            closeDialog: false,
            deleteId: '',
            deleteDialog: false,
            states: [{
                state: 0,
                name: '全部',
                isActive: true
            },
            {
                state: 1,
                name: '准备中',
                isActive: false
            },
            {
                state: 2,
                name: '进行中',
                isActive: false
            },
            {
                state: 3,
                name: '已结束',
                isActive: false
            },
            {
                state: 4,
                name: '已关闭',
                isActive: false
            }
            ],
            loading: true,
            totalPages: 0,
            total_num: 0,
            get_params: {
                state: 0,
                name: '',
                page: 1,
                size: 20
            },
            tableData: [],
            statusVal: 0
        }
    },
    watch: {
        closeDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.overReason = ''
                }
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
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
        reset() {
            this.get_params = {
                state: 0,
                name: '',
                page: 1,
                size: 20
            }
            this.get_data()
        },
        search_match() {
            this.get_params.page = 1
            this.get_data()
        },
        renderHeader(h, {
            column
        }) { // 下拉框选项
            let filters = [{
                text: '默认',
                value: 0
            },
            {
                text: '准备中',
                value: 1
            },
            {
                text: '进行中',
                value: 2
            },
            {
                text: '已结束',
                value: 3
            },
            {
                text: '已关闭',
                value: 4
            }
            ]

            // 下拉框内容包裹在一个div里面
            return h(
                'div', {
                    style: {
                        height: 'auto'
                    }
                }, [
                    h(
                        'span', {
                            // div里面有一个文字提示：下拉框所属内容
                            style: {},
                            class: 'level-font-class'
                        },
                        '状态'
                    ),
                    h(
                        'el-select', {
                            // el-select实现下拉框
                            class: 'status-selsect iconfont icon-filter-fill',
                            style: {
                                width: '0px',
                                height: '0px',
                                color: '#3aa6e4 !important'
                            },
                            on: {
                                input: value => {
                                    // 随着下拉框的不同，文字框里的内容在边
                                    this.statusVal = value
                                    this.shaixuan(value)
                                }
                            },
                            props: {
                                size: 'mini',
                                value: this.statusVal // 文字框的内容取决于这个value，如果value不存在，会报错
                            }
                        }, [
                            // 下拉框里面填充选项，通过filters遍历map，为每一个选项赋值。
                            filters.map(item => {
                                return h('el-option', {
                                    props: {
                                        value: item.value,
                                        label: item.text
                                    }
                                })
                            })
                        ]
                    )
                ]
            )
        },
        shaixuan(val) {
            this.get_params.state = val
            this.get_data()
        },
        indexMatchMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        handleDetail(obj) {
            this.$setsessionStorage('match_id', obj.id)
            this.$refs.alarmDetailRef.init()
        },
        handleTaiShi(obj) {
            console.log(window.location.host)
            window.open(window.location.origin + '/#/commandDrill?id=' + obj.id)
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
                    state: this.get_params.state,
                    name: this.get_params.name
                }
            }
            get_match_list(data).then((res) => {
                this.loading = false
                console.log('赛事列表', res)
                let list = res.records
                this.totalPages = res.total
                this.total_num = res.total

                if (list.length > 0) {
                    list.forEach((item, index) => {
                        let obj = {}
                        obj.id = item.id
                        obj.name = item.name
                        obj.game_aims = item.gameAims
                        obj.refereer = (item.refereeInfoList && item.refereeInfoList.length > 0) ? item.refereeInfoList.length : 0
                        obj.attacker = item.gjPlayer
                        obj.defenser = item.fsPlayer
                        obj.start_time = item.startTime
                        obj.end_time = item.endTime
                        obj.attack_num = item.attackScore
                        obj.defense_num = item.defenseScore
                        obj.over_reason = item.over_reason
                        obj.game_rule_file_name = item.gameRuleFileName
                        obj.game_rule_file_path = item.gameRuleFilePath
                        let status = item.status
                        obj.state_id = status
                        if (status == 1) {
                            obj.state = '准备中'
                        } else if (status == 2) {
                            obj.state = '进行中'
                        } else if (status == 3) {
                            obj.state = '已结束'
                        } else if (status == 4) {
                            obj.state = '已关闭'
                        }
                        this.tableData.push(obj)
                    })
                }
            }).catch((error) => {
                this.loading = false
                console.log(error)
            })
        },
        createMatch() {
            this.$router.push({
                path: this.$route.path + '/create'
            })
        },
        selectState(val) {
            this.states = this.states.map(item => {
                item.isActive = false
                return item
            })
            val.isActive = true
            this.get_params.state = val.state
            this.get_params.page = 1
            this.get_data()
        },
        handleClose(obj) {
            this.closeId = obj.id
            this.closeDialog = true
            this.overReason = obj.over_reason ? '' : obj.over_reason
            console.log(obj)
        },
        close_match() {
            let data = {
                queryData: {},
                paramsData: {
                    id: this.closeId,
                    overReason: this.overReason
                }
            }
            close_match(data).then((res) => {
                console.log('关闭成功', res)
                this.closeDialog = false
                this.$message({
                    message: '关闭成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch((error) => {
                this.closeDialog = false
                console.log(error)
            })
        },

        handleEdit(obj) {
            this.$setsessionStorage('match_id', obj.id)
            this.$router.push({
                path: this.$route.path + '/edit'
            })
        },
        deleteAll() {
            if (this.multipleSelection.length == 0) {
                this.$message({
                    message: '请先选择演练',
                    type: 'warning'
                })
                return
            }
            this.deleteAllAttackDialog = true
        },
        delete_all_match() {
            let ids = []
            this.multipleSelection.map(item => {
                ids.push(item.id)
            })
            let data = {
                queryData: {},
                paramsData: {
                    ids: ids.join(',')
                }
            }
            delete_match(data).then((res) => {
                console.log('删除成功', res)
                this.deleteAllAttackDialog = false
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch((error) => {
                this.deleteAllAttackDialog = false
                console.log(error)
            })
        },
        handleDekete(obj) {
            console.log(obj, 2323)
            if (obj.state_id == 2) {
                this.$message.warning('进行中的赛事不能删除')
                return
            }
            this.deleteId = obj.id
            this.deleteDialog = true
            console.log(obj)
        },
        delete_match() {
            let data = {
                queryData: {},
                paramsData: {
                    ids: this.deleteId
                }
            }
            delete_match(data).then((res) => {
                console.log('删除成功', res)
                this.deleteDialog = false
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch((error) => {
                this.deleteDialog = false
                console.log(error)
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
            this.multipleSelection = val
        }
    }
}
</script>

<style lang="scss">
    .match-state{
        width:80px;
        height:18px;
        padding:2px 20px;
        border-radius: 11px;
        &.one{
            background-color: #fde6d8;
            color:#de7400;
        }
        &.two{
            background-color: #ccf6e4;
            color:#03864f;
        }
        &.three{
            background-color: #d5e5fa;
            color:#0052d9;
        }
        &.four{
            background-color: #fad7dd;
            color:#aa0202;
        }
    }
.el-table .status-selsect .el-input--mini .el-input__inner {
    display: none !important;
}
.el-table .status-selsect .el-input--mini .el-select__caret{
    display: none !important;
}
</style>
<style lang="scss" scoped>
    .event {
        /*padding: 0px 20px 20px 0px;*/
        box-sizing: border-box;
        position: relative;
    }

    .base-box {
        padding: 20px;
        box-sizing: border-box;
        border-radius: 5px;
        margin-top: 20px;
        background-color: #fff;

        h4 {
            font-weight: 500;
        }
    }

    .select-btns div {
        padding: 4px 10px;
        color: #409eff;
        background: #ecf5ff;
        font-weight: 500;
        border: 1px solid #b3d8ff;
        font-size: 13px;
        cursor: pointer;
    }

    .select-btns div:hover {
        color: #fff;
        background: #409EFF;
        border-color: #409EFF;
    }

    .select-btns>div:first-child {
        border-radius: 20px 0 0 20px;
    }

    .select-btns>div:last-child {
        border-radius: 0 20px 20px 0;
    }

    .select-btns>div.active {
        color: #fff;
        background: #409EFF;
        border-color: #409EFF;
    }

    .el-table {
        min-height: 0;
    }

    .search-right {
        margin-right: -10px;

        .el-form {
            float: right;
            margin-right: -10px;

            .el-form-item {
                margin-bottom: 0;
            }

        }
    }

</style>
