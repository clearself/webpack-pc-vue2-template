<template>
    <div class="list">
        <div class="ub w100" style="box-sizing: border-box;">
            <div class="event-content w100" :style="{'height':tabHeight+'px'}" style="overflow-y:auto">
                <div class="ub ub-pj w100 ub-ac" style="padding:10px">
                    <div style="color:rgba(0,0,0,0.9);font-size:14px">添加攻击成果
                    </div>
                    <div>
                        <el-button size="small" @click="back">返回</el-button>
                        <el-button @click="validAttrack('form')" size="small" type="primary">添加</el-button>
                    </div>
                </div>
                <el-form ref="form" :model="form" :rules="formRules" label-width="100px" label-position="top">
                    <div class="base-box">
                        <div class="ub ub-pj">
                            <el-form-item label="选择演练：" size="small" prop="match" style="width: calc((100% - 168px) / 3);">
                                <el-select clearable filterable v-model.trim="form.match" placeholder="请选择" style="width:100%">
                                    <el-option v-for="item in matchs" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="攻击时间：" prop="matchTime" size="small" style="width: calc((100% - 168px) / 3);">
                                <el-date-picker clearable value-format="yyyy-MM-dd HH:mm:ss" v-model="form.matchTime" type="datetime" placeholder="请选择" style="width:100%">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="目标系统：" size="small" style="width: calc((100% - 168px) / 3);">
                                <el-input clearable placeholder="目标系统" v-model.trim="form.target_system" autocomplete="off" ></el-input>
                            </el-form-item>
                        </div>
                        <div class="ub ub-pj">
                            <el-form-item label="目标IP：" style="width: calc((100% - 168px) / 3);">
                                <el-input type="textarea" size="small" :autosize="{ minRows: 2}" v-model="target_ips" placeholder="请添加IP或者多个IP,单行显示一个IP"></el-input>
                            </el-form-item>
                            <el-form-item label="URL：" size="small" style="width: calc((100% - 168px) / 3);">
                                <el-input clearable placeholder="请输入" v-model.trim="form.URL" autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="攻击手段：" size="small" style="width: calc((100% - 168px) / 3);">
                                <el-select clearable filterable v-model.trim="form.attrack_way" placeholder="请选择" style="width:100%">
                                    <el-option v-for="item in attrack_ways" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                                <span v-if="form.attrack_way==6" style="color:#fff;">--</span>
                                <el-input v-if="form.attrack_way==6" clearable placeholder="请输入其他攻击手段" v-model.trim="form.other_attrack_way" autocomplete="off"></el-input>
                            </el-form-item>
                        </div>
                        <div class="ub ub-pj">
                            <el-form-item label="攻击IP：" style="width: calc((100% - 168px) / 3);">
                                <el-input type="textarea" size="small" :autosize="{ minRows: 2}" v-model="attrack_ips" placeholder="请添加IP或者多个IP,单行显示一个IP"></el-input>
                            </el-form-item>
                        </div>
                        <el-form-item style="width:100%;" label="攻击步骤：">
                            <vue-ueditor-wrap v-model="form.step" :config="myConfig"></vue-ueditor-wrap>
                        </el-form-item>
                        <el-form-item style="width:100%;" label="攻击成果：">
                            <vue-ueditor-wrap v-model="form.gain" :config="myConfig"></vue-ueditor-wrap>
                        </el-form-item>
                        <el-form-item style="width:100%;" label="备注：">
                            <vue-ueditor-wrap v-model="form.remark" :config="myConfig"></vue-ueditor-wrap>
                        </el-form-item>
                    </div>

                </el-form>
            </div>
        </div>
    </div>

</template>

<script>
import {
    get_record_sets,
    get_attract_defense_match_list_select,
    add_attrack_defense_record
} from '../../../server/defense_drill/defense.js'
import VueUeditorWrap from '../../../components/vue-ueditor-wrap.vue' // ES6 Module
import ueditorConfig from '../../../mixins/ueditorConfig'
export default {
    components: {
        VueUeditorWrap
    },
    name: 'CreateAttrack',
    mixins: [ueditorConfig],
    data() {
        return {
            tabHeight: document.body.clientHeight - 90,
            matchs: [],
            attrack_ways: [],
            target_ips: '',
            attrack_ips: '',
            form: {
                match: '',
                matchTime: '',
                target_system: '',
                targetPort: '',
                attackPort: '',
                URL: '',
                attrack_way: '',
                other_attrack_way: '',
                step: '',
                gain: '',
                remark: ''
            },
            formRules: {
                name: [{
                    required: true,
                    message: '请输入赛事名称',
                    trigger: 'blur'
                }],
                match: [{
                    required: true,
                    message: '请选择演练',
                    trigger: 'change'
                }]
            }

        }
    },

    created() {

    },
    mounted() {
        this.$nextTick(() => {
            this.initMatch()
            this.get_set_info()
        })
    },
    methods: {
        back() {
            this.$router.go(-1)
        },
        validAttrack(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.publickRecord()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        publickRecord() {
            let attrack_ips = this.attrack_ips.replace(/\n/g, '||').split('||')
            let target_ips = this.target_ips.replace(/\n/g, '||').split('||')
            let data = {
                queryData: {},
                paramsData: {
                    gameEventId: this.form.match,
                    type: 1,
                    attackMode: this.form.attrack_way, // 攻击手段
                    attackTime: this.form.matchTime,
                    targetSystem: this.form.target_system,
                    targetPort: this.form.targetPort,
                    attackPort: this.form.attackPort,
                    targetIp: target_ips.join(','),
                    url: this.form.URL,
                    attackIp: attrack_ips.join(','),
                    step: this.form.step,
                    gain: this.form.gain,
                    remark: this.form.remark
                }
            }

            if (this.form.attrack_way == 6) {
                data.paramsData.attackModeContent = this.form.other_attrack_way
            }
            console.log(data)
            add_attrack_defense_record(data).then((res) => {
                console.log('添加攻击成果', res)
                this.$message({
                    message: '添加成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.$router.go(-1)
                }, 1500)
            }).catch((error) => {
                console.log(error)
            })
        },
        get_set_info() {
            get_record_sets({}).then((res) => {
                let gj_means = res.attackMode
                let fy_means = res.defenseMode
                this.initMatchSet(gj_means, this.attrack_ways)
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
        initMatch() {
            let data = {
                type: 1
            }
            get_attract_defense_match_list_select(data).then((res) => {
                console.log('g攻击所有赛事', res)
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
        }
    }
}
</script>

<style lang="scss" scoped>

    .event-content {
        padding-bottom:50px;
        background-color: #fff;
        border-radius:4px;
        ::v-deep .el-form-item__label{
            line-height:32px !important;
        }
    }

    .base-box {
        padding: 0 10px;
        box-sizing: border-box;
        border-radius: 5px;
        width: 100%;
        h4 {
            font-weight: 500;
            color: #ffffff;
        }
    }
</style>
