<template>
    <el-drawer :visible="detailDialog" direction="rtl" :size="900"  title="演练详情" :before-close="back">
        <div class="seedetail">
            <el-descriptions size="mini" border :column="1">
                <el-descriptions-item label="演练名称">{{form.name}}</el-descriptions-item>
                <el-descriptions-item label="演练目标">{{form.gameAims}}</el-descriptions-item>
                <el-descriptions-item label="演练赛制">{{form.settingName}}</el-descriptions-item>
                <el-descriptions-item label="演练时间">{{form.matchTime[0]}}&nbsp;  至&nbsp;  {{form.matchTime[1]}}</el-descriptions-item>
                <el-descriptions-item label="演练简介">{{form.desc}}</el-descriptions-item>
                <el-descriptions-item label="注意事项">{{form.attention}}</el-descriptions-item>
                <el-descriptions-item label="演练规则">{{form.ruleFileName}}</el-descriptions-item>
                <el-descriptions-item label="演练状态">{{form.status}}</el-descriptions-item>
                <el-descriptions-item label="终止原因">{{form.overReason}}</el-descriptions-item>
            </el-descriptions>
            <div class="ub ub-ac ub-pj w100 match-title" style="margin-top: 30px;">
                <div>参赛战队:</div>
            </div>
            <div>
                <el-table :data="refereeData" border class='bigTable' :row-class-name="tableRowClassName">
                    <el-table-column type="index" width="50" label="序号">
                    </el-table-column>
                    <el-table-column prop="role" label="角色">
                    </el-table-column>
                    <el-table-column prop="name" label="姓名">
                    </el-table-column>
                    <el-table-column prop="phone" label="手机号">
                    </el-table-column>
                </el-table>
            </div>
            <div class="ub ub-ac ub-pj w100 match-title" style="margin-top: 30px;">
                <div>参赛裁判:</div>
            </div>
            <div>
                <el-table :data="teamList" border class='bigTable' :row-class-name="tableRowClassName">
                    <el-table-column type="index" width="50" label="序号">
                    </el-table-column>
                    <el-table-column prop="teamName" label="演练队伍">
                    </el-table-column>
                    <el-table-column prop="teamName" label="演练角色">
                        <template slot-scope="scope">
                            <span v-if="scope.row.roleId==0" style="font-size:12px;color:#ff5d5e;">攻击方</span>
                            <span v-if="scope.row.roleId==1" style="font-size:12px;color:#02b3ff;">防守方</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="players" label="参加人员">
                        <template slot-scope="scope">
                            <span>{{scope.row.players.join('，')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="player_num" label="参加人数">
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </el-drawer>
</template>

<script>
import {
    get_match_sets,
    get_match_info
} from '../../../server/defense_drill/defense.js'
export default {
    name: 'CreateMatch',
    data() {
        return {
            detailDialog: false,
            refereeData: [],
            form: {
                name: '',
                gameAims: '',
                matchTime: [],
                startTime: '',
                endTime: '',
                // seeForm: 1,
                // seeTheme: 1,
                // matchForm: 1,
                matchRule: '',
                settingName: '',
                ruleFileName: '',
                ruleFilePath: '',
                rule: '',
                desc: '',
                attention: ''
            },
            formRules: {
                name: [{
                    required: true,
                    message: '请输入赛事名称',
                    trigger: 'blur'
                }],
                matchTime: [{
                    required: true,
                    message: '请选择时间',
                    trigger: 'change'
                }]
            },

            createTeamRules: {
                teamName: [{
                    required: true,
                    message: '请输入战队名称',
                    trigger: 'blur'
                }]
            },
            seeForm: [],
            seeTheme: [],
            matchForm: [],
            matchRule: [],
            data: {},
            teamList: [],
            refereeList: []
        }
    },
    // created() {
    //     this.$removesessionStorage('team_data')
    //     this.$removesessionStorage('refresh_data')
    // },
    // mounted() {
    //     this.$nextTick(() => {
    //         this.get_info()
    //     })
    // },
    methods: {
        init() {
            console.log('进来了')
            this.detailDialog = true
            this.$removesessionStorage('team_data')
            this.$removesessionStorage('refresh_data')
            this.get_info()
        },
        tableRowClassName({ row, rowIndex }) {
            console.log(rowIndex)
            if (rowIndex % 2) {
                return 'table-row2'
            } else {
                return 'table-row1'
            }
        },
        back() {
            // this.$router.go(-1)
            this.detailDialog = false
        },

        get_info() {
            let _id = this.$getsessionStorage('match_id')
            let data = {
                id: _id
            }
            get_match_info(data).then((res) => {
                console.log('赛事详情', res)
                this.form = {
                    name: res.name,
                    gameAims: res.gameAims,
                    matchTime: [res.startTime, res.endTime],
                    // matchForm: res.gameMode,
                    settingName: res.settingName,
                    matchRule: res.gameSetting == 0 ? '' : res.gameSetting,
                    ruleFileName: res.gameRuleFileName,
                    ruleFilePath: res.gameRuleFilePath,
                    desc: res.gameSynopsis,
                    attention: res.precautions,
                    overReason: res.overReason,
                    status: ''
                }
                let status = res.status
                if (status == 1) {
                    this.form.status = '准备中'
                } else if (status == 2) {
                    this.form.status = '进行中'
                } else if (status == 3) {
                    this.form.status = '已结束'
                } else if (status == 4) {
                    this.form.status = '已关闭'
                } else {
                    this.form.status = ''
                }

                let referee_data = []
                if (res.refereeInfoList.length > 0) {
                    res.refereeInfoList.forEach(item => {
                        let obj = {}
                        obj.id = item.userId
                        console.log('裁判id', item.userId)
                        obj.name = this.$NullStr(item.chineseName)
                        obj.role = this.$NullStr(item.roleName)
                        obj.idCard = this.$NullStr(item.mailbox)
                        obj.phone = this.$NullStr(item.phone)
                        referee_data.push(obj)
                    })
                }
                this.refereeData = referee_data
                let team_data = []
                if (res.teamPlayerInfoList.length > 0) {
                    res.teamPlayerInfoList.forEach((item, index) => {
                        let obj = {}
                        obj.teamName = item.teamName
                        obj.players = []
                        obj.player_num = item.player
                        obj.roleId = item.teamTypeNumber
                        if (item.playerInfoList && item.playerInfoList.length > 0) {
                            item.playerInfoList.forEach(_item => {
                                obj.players.push(_item.userName)
                            })
                        }
                        team_data.push(obj)
                    })
                }
                this.teamList = team_data
            }).then(() => {
                // this.get_sets();
            }).catch((error) => {
                console.log(error)
            })
        },

        get_sets() {
            get_match_sets({}).then((res) => {
                console.log('配置', res)
                // let seeForm = res.viewType;
                // let seeTheme = res.viewTheme;
                let matchForm = res.gameMode
                let matchRule = res.gameSetting
                // this.initMatchSet(seeForm, this.seeForm);
                // this.initMatchSet(seeTheme, this.seeTheme);
                this.initMatchSet(matchForm, this.matchForm, this.form.matchForm)
                this.initMatchSet(matchRule, this.matchRule, this.form.matchRule)
            }).catch((error) => {
                console.log(error)
            })
        },
        initMatchSet(obj, val, value) {
            if (obj.length > 0) {
                obj.forEach((item, index) => {
                    let _obj = {}
                    if ((index + 1) == value) {
                        _obj.isActive = true
                    } else {
                        _obj.isActive = false
                    }
                    _obj.name = item.name
                    _obj.type = item.index
                    val.push(_obj)
                })
            }
        }

    }
}
</script>

<style lang="scss" scoped>
    .seedetail{
        ::v-deep .el-descriptions-item__label{
            width:100px !important;
        }
    }

    .base-box {
        padding: 0 20px;
        box-sizing: border-box;
        border-radius: 5px;
        width: 100%;
        h4 {
            font-weight: 500;
            color: #ffffff;
        }
        span {
            color: #fff;
            font-size: 12px;
        }
    }

    .match-con {
        margin-top: 20px;
    }

    .match-btns {
        width: 100%;
        div {
            font-size: 12px;
            color: #606ea6;
            padding: 0px 30px;
            // background-color: #eef1f7;
            border: 1px solid #4bacf9;
            margin-right: 20px;
            cursor: pointer;
        }
        div:last-child {
            margin-right: 0;
        }
        div.active {
            background-color: #12a4ef;
            border-color: #12a4ef;
            color: #fff;
        }
    }

    .match-title {
        margin: 0px 0 10px 0;
    }

    .match-title>div:nth-child(1) {
        font-size: 12px;
        color: #babbbd;
    }

    .el-table {
        min-height: 0;
    }

    .player-title {
        line-height: 70px;
        font-size: 18px;
    }

    .event ::v-deep .el-range-input {
        background-color: rgba(0, 0, 0, 0);
        color: #fff;
    }

    .event ::v-deep .el-range-separator {
        color: #fff;
    }

    .el-form-item {
        margin-bottom: 30px;
    }

    .historyTeam>div {
        color: #a2a9af;
        cursor: pointer;
    }

    .historyTeam.active>div {
        color: #00c0fe;
    }

    .transfer ::v-deep .el-transfer-panel {
        background-color: rgba(0, 0, 0, 0);
        border-color: #1bd7fa;
    }

    .transfer ::v-deep .el-transfer-panel .el-transfer-panel__header {
        background-color: rgba(0, 0, 0, 0);
        border-color: #1bd7fa;
    }

    .transfer ::v-deep .el-transfer-panel .el-transfer-panel__header .el-checkbox .el-checkbox__label {
        color: #fff;
    }

    .transfer ::v-deep .el-transfer-panel .el-transfer-panel__header .el-checkbox .el-checkbox__label span {
        color: #fff;
    }

    .trans ::v-deep .el-input__inner {
        border-radius: 4px 4px 0 0;
    }

    .transfer ::v-deep .el-transfer-panel__item.el-checkbox {
        color: #fff;
    }

    .transfer ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner {
        background-color: #024861;
        border-color: #01d9f0;
    }

    .transfer ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner:hover {
        border-color: #01d9f0;
    }

    .transfer ::v-deep .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background-color: #024861;
        border-color: #01d9f0;
    }

    .transfer ::v-deep .el-checkbox__input .el-checkbox__inner:hover {
        border-color: #01d9f0;
    }

    .transfer ::v-deep .el-checkbox__inner::after {
        border-color: #01d9f0;
    }

    .transfer ::v-deep .el-checkbox__input.is-checked+.el-checkbox__label {
        color: #01d9f0;
    }

    .transfer ::v-deep .el-input__inner,
    .transfer ::v-deep .el-textarea__inner,
    .chart .el-input__inner {
        box-shadow: none;
        border-color: #01d9f0;
    }

    .transfer ::v-deep .el-transfer__button.is-disabled,
    .transfer ::v-deep .el-transfer__button.is-disabled:hover {
        border: 1px solid rgba(0, 0, 0, 0);
        background-color: rgba(0, 0, 0, .5);
        color: #C0C4CC;
    }

    .transfer ::v-deep .el-transfer__button {
        color: #fff;
        background-color: #01d9f0;
    }
</style>
