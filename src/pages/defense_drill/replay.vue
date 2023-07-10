<template>
    <div class="list">
        <SearchTop @search="search_match" @reset="reset">
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params" label-width="80px" >
                    <el-form-item label="演练名称：">
                        <el-select size="small" clearable filterable v-model.trim="get_params.match" placeholder="请选择演练">
                            <el-option v-for="item in matchs" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params" label-width="80px" >
                    <el-form-item label="攻击手段：">
                        <el-select size="small" clearable v-model.trim="get_params.attacker_way" filterable placeholder="请选择攻击手段">
                            <el-option v-for="item in attacker_ways" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params" label-width="80px" >
                    <el-form-item label="攻击时间：">
                        <el-date-picker style="width:270px;" size="small" value-format="yyyy-MM-dd HH:mm:ss" v-model.trim="sayTimes" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                </el-form>
            </el-col>
        </SearchTop>
        <div class="list-container">
            <div class="ub ub-pj w100 mb-1 ub-ac">
                <div class="list-tips">演练复盘</div>
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
                :row-style="{ height: '32px' }"
                :header-row-style="{ height: '32px' }"
                :height="tabHeight">
                <el-table-column align="center" type="index" label="序号" width="50" :index="indexMatchMethod">
                </el-table-column>
                <el-table-column prop="match_name" label="赛事名称" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="target_ip" label="目标IP">
                </el-table-column>
                <el-table-column prop="attack_ip" label="攻击IP">
                </el-table-column>
                <el-table-column prop="attack_way" label="攻击手段">
                </el-table-column>
                <el-table-column prop="attack_time" label="攻击时间" width="170">
                </el-table-column>
                <el-table-column prop="score" label="得分">
                </el-table-column>
                <el-table-column prop="is_add_name" label="复盘状态">
                    <template slot-scope="scope">
                        <div>
                            <div v-if="scope.row.is_add==1" class="ub ub-ac replay one">
                                <div></div>
                                <div>未复盘</div>
                            </div>
                            <div v-if="scope.row.is_add==2" class="ub ub-ac replay two">
                                <div></div>
                                <div>已复盘</div>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="180">
                    <template slot-scope="scope">
                        <el-button @click="handleLink(scope.row)" size="small" type="text" v-per="['defense_fp_pic']">查看链路图</el-button>
                        <el-button @click="handleReplay(scope.row)" size="small" type="text">{{scope.row.is_add==1?'复盘':'查看'}}</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size"  style="padding-top:10px" @pagination="get_data"/>
        </div>
    </div>

</template>

<script>
import {
    get_replay_match_list,
    get_record_attrack_sets,
    get_attract_defense_match_list
} from '../../server/defense_drill/defense.js'

export default {
    name: 'MatchList',
    data() {
        return {
            tabHeight: document.body.clientHeight - 252,
            isOpen: false,
            sayTimes: null,
            matchs: [],
            loading: true,
            totalPages: 0,
            total_num: 0,
            attacker_ways: [],
            get_params: {
                attacker_way: '',
                match: '',
                page: 1,
                size: 20
            },
            tableData: []
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.initMatch()
            this.get_set_info()
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
                attacker_way: '',
                match: '',
                page: 1,
                size: 20
            }
            this.sayTimes = []
            this.get_data()
        },
        initMatch() {
            let data = {
                type: 1
            }
            get_attract_defense_match_list(data).then((res) => {
                console.log('攻击所有赛事', res)
                let list = res
                if (list.length > 0) {
                    list.forEach((item, index) => {
                        let obj = {}
                        obj.value = item.id
                        obj.label = item.name
                        this.matchs.push(obj)
                    })
                }
            }).catch((error) => {
                console.log(error)
            })
        },
        search_match() {
            this.get_params.page = 1
            this.get_data()
        },
        indexMatchMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
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
                    gameEventId: this.get_params.match,
                    attackMode: this.get_params.attacker_way,
                    attackStartTime: this.sayTimes === null ? '' : this.sayTimes[0],
                    attackEndTime: this.sayTimes === null ? '' : this.sayTimes[1]
                }
            }
            get_replay_match_list(data).then((res) => {
                this.loading = false
                console.log('复盘列表', res)
                let list = res.list.records
                this.total_num = res.list.total
                if (list.length > 0) {
                    list.forEach((item, index) => {
                        let obj = {}
                        obj.id = item.id
                        obj.match_name = item.gameEventName
                        obj.match_name_id = item.gameEventId
                        obj.target_ip = item.targetIp
                        obj.attack_ip = item.attackIp
                        obj.attack_way = item.attackModeName
                        obj.attack_way_id = item.attackMode
                        obj.attack_time = item.attackTime
                        obj.score = this.$NullStr(item.score)
                        obj.is_add = item.isAdd
                        obj.gain = item.gain
                        obj.is_add_name = item.isAdd == 1 ? '未复盘' : '已复盘'

                        obj.create_name = item.createName
                        obj.create_time = item.createTime
                        obj.url = item.url
                        obj.remark = item.remark
                        obj.step = item.step
                        this.tableData.push(obj)
                    })
                }
            }).catch((error) => {
                this.loading = false
                console.log(error)
            })
        },
        handleReplay(obj) {
            this.$setsessionStorage('replayData', obj)
            this.$router.push({
                path: this.$route.path + '/inner',
                query: {
                    id: obj.id,
                    is_add: obj.is_add
                }
            })
        },
        handleLink(obj) {
            this.$setsessionStorage('linkData', obj)
            this.$router.push({
                path: this.$route.path + '/link',
                query: {
                    id: obj.id
                }
            })
        },
        get_set_info() {
            get_record_attrack_sets({}).then((res) => {
                let gj_means = res.attackMode
                let fy_means = res.defenseMode
                this.initMatchSet(gj_means, this.attacker_ways)
                console.log('战绩配置', res)
            }).catch((error) => {
                console.log(error)
            })
        },
        initMatchSet(obj, val) {
            if (obj.length > 0) {
                obj.forEach((item, index) => {
                    let _obj = {}
                    _obj.label = item.name
                    _obj.value = item.index
                    val.push(_obj)
                })
            }
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
.list{
    ::v-deep .el-form-item__label{
        line-height:32px !important;
    }
    ::v-deep .el-range-input{
        font-size:12px !important;
    }
}
.replay > div:nth-child(1) {
    width: 10px;
    height: 10px;
    border-radius: 10px;
}
.replay > div:nth-child(2) {
    color: rgba(0,0,0,.9);
    margin-left: 8px;
}
.replay.one > div:nth-child(1) {
    background-color: #00c0ff;
    -webkit-box-shadow: 0px 0px 7px #00c0ff;
}
.replay.two > div:nth-child(1) {
    background-color: #bfc1c0;
    -webkit-box-shadow: 0px 0px 7px #bfc1c0;
}
.el-date-editor{
    ::v-deep input{
        font-size:12px;
    }
}
</style>

