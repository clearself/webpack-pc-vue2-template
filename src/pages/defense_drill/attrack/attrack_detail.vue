<template>
    <div class="list">
        <div class="ub w100" style="box-sizing: border-box;">
            <div class="event-content w100" :style="{'height':tabHeight+'px'}" style="overflow-y:auto">
                <div class="ub ub-pj w100 ub-ac" style="padding:10px">
                    <div style="color:rgba(0,0,0,0.9);font-size:14px">查看攻击成果详情
                    </div>
                    <div v-if="isReferee">
                        <el-button size="small" @click="back">返回</el-button>
                        <el-button @click="handlecheck" size="small" type="primary">审核</el-button>
                        <el-button @click="handleReject" size="small" type="danger">驳回</el-button>
                    </div>
                    <div v-else>
                        <el-button size="small" @click="back">返回</el-button>
                    </div>
                </div>
                <div class="pl-1 pr-1 seedetail">
                    <el-descriptions size="mini" border :column="2">
                        <el-descriptions-item label="提交人">{{form.submitter}}</el-descriptions-item>
                        <el-descriptions-item label="提交时间">{{form.submit_time}}</el-descriptions-item>
                        <el-descriptions-item label="选择演练">{{form.match}}</el-descriptions-item>
                        <el-descriptions-item label="攻击时间">{{form.matchTime}}</el-descriptions-item>
                        <el-descriptions-item label="目标系统">{{form.target_system}}</el-descriptions-item>
                        <el-descriptions-item label="目标IP">{{target_ips}}</el-descriptions-item>
                        <el-descriptions-item label="URL">{{form.URL}}</el-descriptions-item>
                        <el-descriptions-item label="攻击手段">
                            <span>{{form.attrack_way}}</span>
                            <span v-if="form.attrack_way_id==6&&form.other_attrack_way!=''" style="color:#fff;">--</span>
                            <span v-if="form.attrack_way_id==6">{{form.other_attrack_way}}</span>
                        </el-descriptions-item>
                        <el-descriptions-item label="攻击IP">{{attrack_ips}}</el-descriptions-item>
                    </el-descriptions>
                    <div style="margin-top:10px"></div>
                    <el-descriptions size="mini" border :column="1">
                        <el-descriptions-item label="攻击步骤"><div v-html="defaultMsg1"></div></el-descriptions-item>
                        <el-descriptions-item label="攻击成果"><div v-html="defaultMsg2"></div></el-descriptions-item>
                        <el-descriptions-item label="备注"><div v-html="defaultMsg3"></div></el-descriptions-item>
                    </el-descriptions>
                    <div style="margin-top:10px" v-if="last_state_id==2">
                        <el-descriptions size="mini" border :column="1">
                            <el-descriptions-item label="裁判打分">{{form.score}}</el-descriptions-item>
                            <el-descriptions-item label="理由">{{form.reason}}</el-descriptions-item>
                            <el-descriptions-item label="审核时间">{{form.check_time}}</el-descriptions-item>
                        </el-descriptions>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog title="赛事审核" :visible.sync="checkDialog" width="700px" custom-class="common-dialog">
            <el-form ref="checkForm" :model="checkForm" :rules="checkFormRule" label-width="100px" label-position="top">
                <div style="position:relative">
                    <el-form-item label="打 分:" prop="score">
                        <el-input size="mini" style="width:100%;" clearable placeholder="演练打分" v-model.trim="checkForm.score" autocomplete="off"></el-input>
                    </el-form-item>
                    <div style="position:absolute;top:0;right:0">
                        <el-checkbox style="color:#409eff;margin-left: 30px;" v-model="checkForm.isReplay">加入复盘演练</el-checkbox>
                    </div>
                </div>
                <el-form-item style="margin-top: 30px;" label="打分理由" prop="reason">
                    <el-input type="textarea" :rows="3" v-model="checkForm.reason" placeholder="请输入理由"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="ub ub-pe dialog-footer">
                <el-button size="small" style="margin-left: 10px;" @click="checkDialog = false">取消</el-button>
                <el-button title="确 定" size="small" type="primary" @click="submitScoreForm('checkForm')">确定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="赛事驳回" :visible.sync="rejectDialog" width="700px" custom-class="common-dialog">
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
    sure_attrack_check
} from '../../../server/defense_drill/defense.js'
function isNum(val) {
    var re = /^[0-9]+(.[0-9]{2})?$/
    if (re.test(val)) {
        return true
    } else {
        return false
    }
}
export default {
    name: 'AttrackDetail',
    data() {
        var isNumber = (rule, value, callback) => {
            if (value === '' || isNum(value)) {
                callback()
            } else {
                callback(new Error('分数不能为负数，保留两位小数'))
            }
        }
        return {
            tabHeight: document.body.clientHeight - 90,
            checkForm: {
                score: '',
                reason: '',
                isReplay: false
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
            rejectDialog: false,
            checkDialog: false,
            isReferee: false,
            defaultMsg1: '',
            defaultMsg2: '',
            defaultMsg3: '',
            target_ips: '',
            attrack_ips: '',
            last_state_id: '',
            form: {
                match: '',
                matchTime: '',
                target_system: '',
                attackPort: '',
                targetPort: '',
                URL: '',
                attrack_way: '',
                other_attrack_way: '',
                attrack_way_id: '',
                submitter: '',
                submit_time: '',
                score: '',
                reason: '',
                check_time: ''
            }

        }
    },

    created() {
        this.isReferee = this.$route.query.isReferee
    },
    mounted() {
        this.$nextTick(() => {
            let changeAttackDetail = this.$getsessionStorage('changeAttackDetail')
            this.form = {
                match: changeAttackDetail.match,
                matchTime: changeAttackDetail.matchTime,
                target_system: changeAttackDetail.target_system,
                attackPort: changeAttackDetail.attackPort,
                targetPort: changeAttackDetail.targetPort,
                URL: changeAttackDetail.URL,
                attrack_way: changeAttackDetail.attrack_way,
                attrack_way_id: changeAttackDetail.attrack_way_id,
                other_attrack_way: changeAttackDetail.other_attrack_way,
                submitter: changeAttackDetail.submitter,
                submit_time: changeAttackDetail.submit_time,
                score: changeAttackDetail.score,
                reason: changeAttackDetail.scoring_reason,
                check_time: changeAttackDetail.reviewer_time
            }
            this.target_ips = changeAttackDetail.target_ips
            this.attrack_ips = changeAttackDetail.attrack_ips
            this.defaultMsg1 = changeAttackDetail.step
            this.defaultMsg2 = changeAttackDetail.gain
            this.defaultMsg3 = changeAttackDetail.remark
            this.last_state_id = changeAttackDetail.last_state_id
        })
    },
    methods: {
        back() {
            this.$router.go(-1)
        },

        handlecheck() {
            this.checkDialog = true
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
                    id: this.$route.query.id,
                    score: this.checkForm.score,
                    status: 2,
                    scoringReason: this.checkForm.reason,
                    isAdd: this.checkForm.isReplay ? 1 : 0
                }
            }
            sure_attrack_check(data).then((res) => {
                console.log(res)
                this.checkDialog = false
                this.$message({
                    message: '审核成功',
                    type: 'success'
                })
            }).catch(error => {
                this.checkDialog = false
                console.log(error)
            })
        },
        handleReject() {
            this.rejectDialog = true
        },
        attack_reject() {
            let data = {
                queryData: {},
                paramsData: {
                    id: this.$route.query.id,
                    status: 3,
                    rejectReason: this.rejectForm.reason
                }
            }
            sure_attrack_check(data).then((res) => {
                console.log(res)
                this.rejectDialog = false
                this.$message({
                    message: '驳回成功',
                    type: 'success'
                })
            }).catch(error => {
                this.rejectDialog = false
                console.log(error)
            })
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

    .event-content{
        ::v-deep .el-form-item__label{
            line-height:32px !important;
        }
        ::v-deep .el-range-input{
            font-size:12px !important;
        }
    }
    .event-content {
        padding-bottom:185px;
        background-color: #fff;
        border-radius:4px;
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
    }
</style>
