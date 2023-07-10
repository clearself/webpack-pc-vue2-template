<template>
    <div class="list">
        <div class="ub mb-1" style="justify-content: space-around;">
            <div class="ub ub-f1 chart-box mr-1">
                <div class="ub ub-f1 ub-ac statistic-item">
                    <div class="ub ub-ver">
                        <div class="ml-2" style="font-size:12px"><i class="iconfont icon-gongjifangchengguo-gongjizongliang" style="font-size:12px;color:#cf68e6;margin-right:5px"></i>防守总量</div>
                        <div style="color:#cf68e6;margin-left:35px;font-size: 20px;margin-top:5px">{{top_data.num1}}</div>
                    </div>
                    <div class="ub-f1 text-right" style="padding-right: 1px;padding-top: 3px;">
                        <img style="height:82px" src="../../assets/img/defense_drill/defense_top1.png" alt="">
                    </div>
                </div>
            </div>
            <div class="ub ub-f1 chart-box mr-1">
                <div class="ub ub-f1 ub-ac statistic-item">
                    <div class="ub ub-ver">
                        <div class="ml-2" style="font-size:12px"><i class="iconfont icon-gongjifangcheng-shenhe" style="font-size:12px;color:#61cfa9;margin-right:5px"></i>已审核防守</div>
                        <div style="color:#61cfa9;margin-left:35px;font-size: 20px;margin-top:5px">{{top_data.num2}}</div>
                    </div>
                    <div class="ub-f1 text-right" style="padding-right: 0px;padding-top: 3px;">
                        <img style="height:82px" src="../../assets/img/defense_drill/defense_top2.png" alt="">
                    </div>
                </div>
            </div>
            <div class="ub ub-f1 chart-box mr-1">
                <div class="ub ub-f1 ub-ac statistic-item">
                    <div class="ub ub-ver">
                        <div class="ml-2" style="font-size:12px"><i class="iconfont icon-gongjifangcheng-daishenhe" style="font-size:12px;color:#f29960;margin-right:5px"></i>待审核防守</div>
                        <div style="color:#f29960;margin-left:35px;font-size: 20px;margin-top:5px">{{top_data.num3}}</div>
                    </div>
                    <div class="ub-f1 text-right" style="padding-right: 0px;padding-top: 3px;">
                        <img style="height:82px" src="../../assets/img/defense_drill/defense_top3.png" alt="">
                    </div>
                </div>
            </div>
            <div class="ub ub-f1 chart-box">
                <div class="ub ub-f1 ub-ac statistic-item">
                    <div class="ub ub-ver">
                        <div class="ml-2" style="font-size:12px"><i class="iconfont icon-gongjifangchengguo-defen" style="font-size:12px;color:#4a89f0;margin-right:5px"></i>防守得分</div>
                        <div style="color:#4a89f0;margin-left:35px;font-size: 20px;margin-top:5px">{{top_data.num4}}</div>
                    </div>
                    <div class="ub-f1 text-right" style="padding-right: 0px;padding-top: 3px;">
                        <img style="height:82px" src="../../assets/img/defense_drill/defense_top4.png" alt="">
                    </div>
                </div>
            </div>
        </div>
        <SearchTop @search="search_attack" @reset="reset">
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params">
                    <el-form-item label="演练任务：" label-width="80px">
                        <el-select size="small" clearable filterable v-model.trim="get_params.match" placeholder="请选择演练">
                            <el-option v-for="item in matchs" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-col>
        </SearchTop>
        <div class="list-container" style="margin-top:-2px;box-shadow:none">
            <div class="ub ub-pj w100 mb-1 ub-ac">
                <div class="list-tips">防守方成果(裁判)</div>
                <div>
                    <el-button icon="iconfont icon-daochu" size="small" type="primary"  @click="downData" v-per="['defense_fscp_exp']">导出成果</el-button>
                </div>
            </div>
            <el-table class="bigTable" v-loading="loading" style="margin-top: 10px;" :data="tableData" border stripe :height="tabHeight" :row-style="{ height: '32px' }" :header-row-style="{ height: '32px' }" :row-class-name="tableRowClassName">
                <el-table-column align="center" type="index" label="序号" width="50" :index="indexAttackMethod">
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="match_name" label="演练名称" width="200px">
                </el-table-column>
                <el-table-column prop="last_state" label="状态" width="100" :render-header="renderHeader">
                    <template slot-scope="scope">
                        <div>
                            <div v-if="scope.row.last_state_id==1" class="ub ub-ac last-state one">
                                <div style="width:80px;text-align:center">{{scope.row.last_state}}</div>
                            </div>
                            <div v-if="scope.row.last_state_id==2" class="ub ub-ac last-state two">
                                <div style="width:80px;text-align:center">{{scope.row.last_state}}</div>
                            </div>
                            <div v-if="scope.row.last_state_id==3" class="ub ub-ac last-state three">
                                <div style="width:80px;text-align:center">{{scope.row.last_state}}</div>
                            </div>
                            <div v-if="scope.row.last_state_id==4" class="ub ub-ac last-state four">
                                <div style="width:80px;text-align:center">{{scope.row.last_state}}</div>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="target_system" label="目标系统" width="200px">
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="target_ip" label="目标ip" width="170px">
                </el-table-column>
                <el-table-column prop="URL" label="URL" width="150px" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="attack_way" label="攻击手段">
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="attack_ip" label="攻击IP" width="170px">
                </el-table-column>
                <el-table-column prop="defense_way" label="防御手段">
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="defense_time" label="防御时间" width="170px">
                </el-table-column>
                <el-table-column label="得分">
                    <template slot-scope="scope">
                        <span style="color:#0052D9;">{{scope.row.score}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="submitter" label="提交人">
                </el-table-column>
                <el-table-column prop="submit_time" label="提交时间" width="170px">
                </el-table-column>
                <el-table-column prop="reviewer_time" label="审核时间" width="170px">
                </el-table-column>
                <el-table-column align="center" fixed="right" label="操作" width="160px" class-name="deepBg">
                    <template slot-scope="scope">
                        <el-button @click="handleAttackSee(scope.row)" size="mini" type="text" v-per="['defense_fscp_view']">查看</el-button>
                        <el-button :disabled="scope.row.isCheck" @click="handlecheck(scope.row)" size="mini" type="text" v-per="['defense_fscp_verify']">审核</el-button>
                        <el-button :disabled="scope.row.isCheck" @click="handleReject(scope.row)" size="mini" type="text" v-per="['defense_fscp_reject']">驳回</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size"  style="padding-top:10px" @pagination="get_attack_record"/>
        </div>
        <el-dialog title="赛事审核" :visible.sync="checkDialog"  width="700px" custom-class="common-dialog">
            <el-form ref="checkForm" :model="checkForm" :rules="checkFormRule" label-width="100px" label-position="top">
                <el-form-item label="打 分:" prop="score">
                    <el-input size="mini" style="width:100%;" clearable placeholder="演练打分" v-model.trim="checkForm.score" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item style="margin-top: 30px;" label="打分理由:" prop="reason">
                    <el-input type="textarea" :rows="3" v-model="checkForm.reason" placeholder="请输入理由"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="ub ub-pe dialog-footer">
                <el-button size="small" style="margin-left: 10px;" @click="checkDialog = false">取消</el-button>
                <el-button title="确 定" size="small" type="primary" @click="submitScoreForm('checkForm')">确定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="赛事驳回" :visible.sync="rejectDialog"  width="700px" custom-class="common-dialog">
            <el-form ref="rejectForm" :model="rejectForm" :rules="checkFormRule" label-width="100px" label-position="top">
                <el-form-item label="驳回理由:" prop="reason">
                    <el-input type="textarea" :rows="3" v-model="rejectForm.reason" placeholder="请输入理由"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="ub ub-pe dialog-footer">
                <el-button size="small" style="margin-left: 10px;" @click="rejectDialog = false">取消</el-button>
                <el-button title="确 定" size="small" type="primary" @click="submitRejectForm('rejectForm')">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {
    get_record_referee,
    get_defense_match_list,
    sure_defense_check,
    defenseRefereeExportExcel
} from '../../server/defense_drill/defense.js'
function isNum(val) {
    var re = /^[0-9]+(.[0-9]{2})?$/
    if (re.test(val)) {
        return true
    } else {
        return false
    }
}
export default {
    name: 'Record',
    data() {
        var isNumber = (rule, value, callback) => {
            if (value === '' || isNum(value)) {
                callback()
            } else {
                callback(new Error('分数不能为负数，保留两位小数'))
            }
        }
        return {
            tabHeight: document.body.clientHeight - 338,
            currentId: '',
            rejectDialog: false,
            checkDialog: false,
            checkForm: {
                score: '',
                reason: ''
            },
            rejectForm: {
                reason: ''
            },
            checkFormRule: {
                score: [{
                    trigger: 'blur',
                    validator: isNumber
                }],
                reason: [{
                    required: true,
                    message: '请输入理由',
                    trigger: 'blur'
                }]
            },

            top_data: {
                num1: 0,
                num2: 0,
                num3: 0,
                num4: 0,
                num5: 0
            },

            matchs: [],
            loading: true,
            get_params: {
                match: '',
                lastState: 1,
                size: 20,
                page: 1
            },
            total_num: 0,
            tableData: [],
            multipleSelection: [],
            statusVal: 1

        }
    },
    mounted() {
        this.$nextTick(() => {
            this.initMatch()
            this.get_attack_record()
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
                match: '',
                lastState: 1,
                size: 20,
                page: 1
            }
            this.get_attack_record()
        },
        downData() {
            defenseRefereeExportExcel({ queryData: {}, paramsData: {}}).then(res => {
                console.log(res)
            }).catch(err => {
                console.log(err)
            })
        },
        renderHeader(h, {
            column
        }) { // 下拉框选项
            let filters = [{
                text: '默认',
                value: ''
            },
            {
                text: '待审核',
                value: 1
            },
            {
                text: '已审核',
                value: 2
            },
            {
                text: '驳回',
                value: 3
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
            this.get_params.lastState = val
            this.get_attack_record()
        },

        indexAttackMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        handleAttackSee(obj) {
            let changeAttackDetail = {
                id: obj.id,
                match: obj.match_name,
                matchTime: obj.defense_time,
                target_system: obj.target_system,
                targetPort: obj.targetPort,
                attackPort: obj.attackPort,
                URL: obj.URL,
                attrack_way: obj.attack_way,
                attrack_way_id: obj.attack_way_id,
                other_attrack_way: obj.attack_mode_content == null ? '' : obj.attack_mode_content,
                defense_way: obj.defense_way,
                defense_way_id: obj.defense_way_id,
                other_defense_way: obj.defense_mode_content == null ? '' : obj.defense_mode_content,
                target_ips: obj.target_ip,
                attrack_ips: obj.attack_ip,
                step: obj.step,
                gain: obj.gain,
                remark: obj.remark,
                submitter: obj.submitter,
                last_state_id: obj.last_state_id,
                submit_time: obj.submit_time,
                score: obj.score == '--' ? '' : obj.score,
                scoring_reason: obj.scoring_reason == '--' ? '' : obj.scoring_reason,
                reviewer_time: obj.reviewer_time
            }
            this.$setsessionStorage('changeAttackDetail', changeAttackDetail)
            this.$router.push({
                path: '/defense/defense_record/detail',
                query: {
                    id: obj.id,
                    isReferee: true
                }
            })
        },
        handlecheck(obj) {
            this.checkDialog = true
            this.currentId = obj.id
        },
        submitRejectForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.attack_reject()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        submitScoreForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.sure_check()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        sure_check() {
            let data = {
                queryData: {},
                paramsData: {
                    id: this.currentId,
                    score: this.checkForm.score,
                    status: 2,
                    scoringReason: this.checkForm.reason
                }
            }
            sure_defense_check(data).then((res) => {
                console.log(res)
                this.checkDialog = false
                this.$message({
                    message: '审核成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_attack_record()
                }, 1500)
            }).catch(error => {
                this.checkDialog = false
                console.log(error)
            })
        },

        handleReject(obj) {
            this.rejectDialog = true
            this.currentId = obj.id
        },
        attack_reject() {
            let data = {
                queryData: {},
                paramsData: {
                    id: this.currentId,
                    status: 3,
                    rejectReason: this.rejectForm.reason
                }
            }
            sure_defense_check(data).then((res) => {
                console.log(res)
                this.rejectDialog = false
                this.$message({
                    message: '驳回成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_attack_record()
                }, 1500)
            }).catch(error => {
                this.rejectDialog = false
                console.log(error)
            })
        },
        search_attack() {
            this.get_params.page = 1
            this.get_attack_record()
        },
        get_attack_record() {
            this.loading = true
            this.tableData = []
            let data = {
                queryData: {
                    page: this.get_params.page,
                    pageSize: this.get_params.size
                },
                paramsData: {
                    gameEventId: this.get_params.match,
                    status: this.get_params.lastState,
                    type: 2
                }
            }
            get_record_referee(data).then((res) => {
                this.loading = false
                console.log('防守战绩列表（裁判）', res)
                this.top_data = {
                    num1: res.countMap.amountCount,
                    num2: res.countMap.haveReviewCount,
                    num3: res.countMap.notReviewCount,
                    num4: res.countMap.amountScore,
                    num5: res.countMap.rank
                }
                this.total_num = res.list.total
                let list = res.list.records
                let userInfo = this.$getsessionStorage('userInfo')
                console.log('userInfo', userInfo)
                if (list.length > 0) {
                    list.forEach((item, index) => {
                        let obj = {}
                        obj.id = item.id
                        obj.match_name = item.gameEventName
                        obj.match_name_id = item.gameEventId
                        obj.target_system = item.targetSystem
                        obj.attackPort = item.attackPort
                        obj.targetPort = item.targetPort
                        obj.target_ip = item.targetIp
                        obj.URL = item.url
                        obj.attack_way = item.attackModeName
                        obj.attack_way_id = item.attackMode
                        obj.defense_way = item.defenseModeName
                        obj.defense_way_id = item.defenseMode
                        obj.attack_ip = item.attackIp
                        obj.defense_time = item.defenseTime
                        obj.score = this.$NullStr(item.score)
                        obj.scoring_reason = this.$NullStr(item.scoringReason)
                        obj.submitter = item.createName
                        obj.submit_time = item.createTime
                        obj.state = item.game_eventStatus
                        obj.last_state = item.statusName
                        obj.last_state_id = item.status
                        obj.attack_mode_content = item.attackModeContent
                        obj.defense_mode_content = item.defenseModeContent
                        obj.step = item.step
                        obj.gain = item.gain
                        obj.remark = item.remark
                        obj.reviewer_time = this.$NullStr(item.reviewerTime)
                        obj.refereeInfo = item.refereeInfo
                        if (item.refereeInfo && item.refereeInfo.length > 0) {
                            let selectedRefense = item.refereeInfo.filter(item => item.id === userInfo.id)
                            if (selectedRefense && selectedRefense.length > 0) {
                                obj.isCheck = true
                            } else {
                                obj.isCheck = false
                            }
                        } else {
                            obj.isCheck = false
                        }

                        this.tableData.push(obj)
                    })
                }
            }).catch((error) => {
                this.loading = false
                console.log(error)
            })
        },

        initMatch() {
            let data = {
                type: 2
            }
            get_defense_match_list(data).then((res) => {
                console.log('防守所有赛事', res)
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

        handleAttackSizeChange(val) {
            this.get_params.size = val
            this.get_attack_record()
        },
        handleAttackCurrentChange(val) {
            this.get_params.page = val
            this.get_attack_record()
        }
    }
}
</script>
<style lang="scss">
.last-state{
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
.chart-box{
    height:80px;
    background:#fff;
    border-radius:4px;
}
.defense_top{
}
.drill-record ::v-deep .el-input--small .el-input__inner {
    height: 30px;
    line-height: 30px;
}
.marB20 {
    margin-bottom: 20px!important;
}

.event {
    /*padding: 0px 20px 20px 0px;*/
    box-sizing: border-box;
    position: relative;
}
.h1{
    height:252px;
}
.top-text{
    color:#fff;
    font-size:15px;
    position: absolute;
    left:50%;
    bottom:43px;
    transform: translateX(-50%);
}
.top-num{
    color:#fff;
    font-size:40px;
    position: absolute;
    left:50%;
    top:30%;
    transform: translate(-50%,-50%);

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

.export-box {
    width: 300px;
    position: absolute;
    top: 0;
    right: 10px;
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

.el-form-item {
    margin-bottom: 0;
}

.event ::v-deep .el-range-input {
    background-color: rgba(0, 0, 0, 0);
    color: #fff;
}

.event ::v-deep .el-range-separator {
    color: #fff;
}
.event ::v-deep .el-table__fixed-right::before, .el-table__fixed::before{
    background-color: rgba(0, 0, 0, 0);
}
.event ::v-deep .el-input-group__append, .event ::v-deep .el-input-group__prepend{
    background-color: rgba(0,0,0,0);
    color: #1cd7fa;

    border: 1px solid #1cd7fa;
    border-left:0;
}
.upload-demo ::v-deep .el-button--primary{
    background-color: rgba(0,0,0,0);
    border-color: rgba(0,0,0,0);
    background-image: url(../../assets/img/XZWJ.png);
    background-position: 0 0;
    background-repeat: no-repeat;
    background-size: 100% 100%;
}
.upload-demo ::v-deep a,.upload-demo ::v-deep i{
    color:#1cd7fa;
}
.upload-demo ::v-deep .el-upload-list__item:hover {
    background-color: rgba(0,0,0,0);
}
</style>
