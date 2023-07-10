<template>
    <el-drawer
        size="576px"
        custom-class="report-drawer"
        :wrapperClosable="false"
        :title="title"
        :visible.sync="showDia"
        @closed="resetForm">
        <div class="drawerWraper">
            <el-form ref="ruleForm" :rules="rules" :model="ruleForm">
                <el-form-item label="发生时间：" prop="time" :label-width="formLabelWidth">
                    <el-date-picker
                        placeholder="请选择时间"
                        size="small"
                        v-model.trim="ruleForm.time"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="外部网络区域：" prop="external_area" :label-width="formLabelWidth">
                    <el-select
                        style="width: 220px"
                        clearable
                        size="small"
                        v-model.trim="ruleForm.external_area"
                        placeholder="请选择">
                        <el-option
                            v-for="item in (staticDict['area_data'] || [])"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="机构简称：" prop="institution_short" :label-width="formLabelWidth">
                    <el-input disabled size="small" placeholder="" v-model.trim="ruleForm.institution_short"></el-input>
                </el-form-item>
                <el-form-item label="机构代码：" prop="institution_code" :label-width="formLabelWidth">
                    <el-input disabled size="small" placeholder="" v-model.trim="ruleForm.institution_code"></el-input>
                </el-form-item>
                <el-form-item label="结束时间：" prop="end_time" :label-width="formLabelWidth">
                    <el-date-picker
                        placeholder="请选择时间"
                        size="small"
                        v-model.trim="ruleForm.end_time"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="被攻击ip：" prop="destination_ip" :label-width="formLabelWidth">
                    <el-input size="small" placeholder="请输入" v-model.trim="ruleForm.destination_ip"></el-input>
                </el-form-item>

                <el-form-item label="被攻击系统类型：" prop="destination_system_type" :label-width="formLabelWidth">
                    <el-select
                        @change="beAttackChange"
                        clearable
                        size="small"
                        v-model.trim="ruleForm.destination_system_type_big"
                        placeholder="信息系统大类名称">
                        <el-option :disabled="item.value != '核心机构信息系统'" v-for="item in beAttackOpt" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select
                        @change="beAttackNameChange"
                        style="margin-left: 10px"
                        clearable
                        filterable
                        size="small"
                        v-model.trim="ruleForm.destination_system_type"
                        placeholder="信息系统子类名称">
                        <el-option v-for="item in beAttDeailOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="被攻击系统名称：" prop="destination_system" :label-width="formLabelWidth">
                    <el-input size="small" placeholder="请输入" v-model.trim="ruleForm.destination_system"></el-input>
                </el-form-item>
                <el-form-item label="攻击类型细分子类：" prop="attack_type_sub" :label-width="formLabelWidth">
                    <el-input size="small" placeholder="请输入" v-model.trim="ruleForm.attack_type_sub"></el-input>
                </el-form-item>
                <el-form-item label="峰值流速率：" prop="peak_flows_rate" :label-width="formLabelWidth">
                    <el-input size="small" placeholder="请输入" v-model.trim="ruleForm.peak_flows_rate"></el-input>
                    Mbps
                </el-form-item>
                <el-form-item label="峰值包速率：" prop="peak_packages_rate" :label-width="formLabelWidth">
                    <el-input size="small" placeholder="请输入" v-model.trim="ruleForm.peak_packages_rate"></el-input>
                    pps
                </el-form-item>
                <el-form-item label="攻击总流量：" prop="attack_flow" :label-width="formLabelWidth">
                    <el-input size="small" placeholder="请输入" v-model.trim="ruleForm.attack_flow"></el-input>
                    Gb
                </el-form-item>
                <!--                <el-form-item label="报送数据类型：" prop="data_type" :label-width="formLabelWidth">-->
                <!--                    <el-select clearable size="small" v-model.trim="ruleForm.data_type" placeholder="请选择">-->
                <!--                        <el-option-->
                <!--                            v-for="item in (dict['report_data_type'] || [])"-->
                <!--                            :key="item.value"-->
                <!--                            :label="item.label"-->
                <!--                            :value="item.value">-->
                <!--                        </el-option>-->
                <!--                    </el-select>-->
                <!--                </el-form-item>-->
            </el-form>
            <div style="text-align: right">
                <el-button size="small" @click="showDia = false">取消</el-button>
                <el-button size="small" :loading="subLoading" type="primary" @click="submit(false)">保存</el-button>
                <el-button size="small" :loading="subLoading" type="primary" @click="submit(true)">保存并上报</el-button>
            </div>
        </div>
    </el-drawer>
</template>

<script>
import * as staticDict from '../../config_data'
import { ddocSaveReq } from '@/server/reporting_platform/report_pages'
import { mapGetters } from 'vuex'
export default {
    props: {
        data_type: {
            type: String,
            default: ''
        },
        beAttackOpt: {
            type: Array,
            default: () => []
        },
        attackOpt: {
            type: Array,
            default: () => []
        }
    },
    data() {
        var isIp = (rule, value, callback) => {
            function isValidIP(ip) {
                var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
                return reg.test(ip)
            }
            if (isValidIP(value)) {
                callback()
            } else {
                callback(new Error('ip地址格式不正确'))
            }
        }
        return {
            staticDict,

            showDia: false,
            subLoading: false,
            title: '',
            row: null,
            formLabelWidth: '130px',
            rules: {
                time: [{ required: true, message: '请选择发生时间', trigger: 'change' }],
                external_area: [{ required: true, message: '请选择外部网络区域', trigger: 'change' }],
                institution_code: [{ required: true, message: '请输入机构代码', trigger: 'blur' }],
                institution_short: [{ required: true, message: '请输入机构简称', trigger: 'blur' }],
                end_time: [{ required: true, message: '请选择结束时间', trigger: 'blur' }],
                destination_ip: [{ required: true, validator: isIp, trigger: 'blur' }],
                destination_system_type: [{ required: true, message: '请选择被攻击系统类型', trigger: 'change' }],
                destination_system: [{ required: true, message: '请输入被攻击系统名称', trigger: 'blur' }],
                attack_type_sub: [{ required: true, message: '请输入攻击类型细分子类', trigger: 'blur' }],
                peak_flows_rate: [{ required: true, message: '请输入峰值流速率', trigger: 'blur' }],
                peak_packages_rate: [{ required: true, message: '请输入峰值包速率', trigger: 'blur' }],
                attack_flow: [{ required: true, message: '请输入攻击总流量', trigger: 'blur' }]
                // data_type: [{ required: true, message: '请输入报送数据类型', trigger: 'change' }]
            },
            ruleForm: {
                id: '',
                time: '',
                external_area: '',
                institution_code: '',
                institution_short: '',
                end_time: '',
                destination_ip: '',
                field_bgjxtlx: '',
                destination_system_type: '',
                destination_system: '',
                attack_type_sub: '',
                peak_flows_rate: '',
                peak_packages_rate: '',
                attack_flow: '',
                data_type: ''
            },
            beAttDeailOptions: [],
            attackDeailOptions: []
        }
    },
    computed: {
        ...mapGetters(['dict', 'orgInfo'])
    },
    methods: {
        initDia(title = '添加DDOS攻击', row) {
            this.title = title
            if (row) {
                this.row = this.$_.cloneDeep(row)
                this.ruleForm = this.$_.cloneDeep(row)
                this.initSecSel()
            } else {
                this.ruleForm.institution_short = this.orgInfo.orgShort
                this.ruleForm.institution_code = this.orgInfo.orgCode
                this.ruleForm.destination_system_type_big = '核心机构信息系统'
                this.beAttackChange('核心机构信息系统')
            }
            if (this.$refs.ruleForm) {
                this.$nextTick(() => {
                    this.$refs.ruleForm.clearValidate(['destination_system_type'])
                })
            }
            this.showDia = true
        },
        initSecSel() {
            if (this.ruleForm.destination_system_type) {
                this.beAttackOpt.forEach(item => {
                    let children = item.children
                    for (let i = 0; i < children.length; i++) {
                        const element = children[i]
                        if (element.value == this.ruleForm.destination_system_type) {
                            this.beAttDeailOptions = children
                            this.ruleForm.destination_system_type_big = item.value
                        }
                    }
                })
            }
            if (this.ruleForm.attack_type) {
                this.attackOpt.forEach(item => {
                    let children = item.children
                    for (let i = 0; i < children.length; i++) {
                        const element = children[i]
                        if (element.value == this.ruleForm.attack_type) {
                            this.attackDeailOptions = children
                            this.ruleForm.attack_type_big = item.value
                        }
                    }
                })
            }
        },
        beAttackChange(value) {
            this.ruleForm.destination_system_type = ''
            if (!value) {
                this.beAttDeailOptions = []
                return
            }
            let chooseItem = this.beAttackOpt.find(item => item.value == value)
            this.beAttDeailOptions = (chooseItem && chooseItem.children) ? chooseItem.children : []
        },
        beAttackNameChange(value) {
            if (!value) return
            let chooseOne = this.beAttDeailOptions.find(item => item.value == value)
            this.ruleForm.destination_system = chooseOne.label
            this.$refs.ruleForm.clearValidate(['destination_system'])
        },
        attackChange(value) {
            this.ruleForm.attack_type = ''
            if (!value) {
                this.attackDeailOptions = []
                return
            }
            let chooseItem = this.attackOpt.find(item => item.value == value)
            this.attackDeailOptions = (chooseItem && chooseItem.children) ? chooseItem.children : []
        },
        submit(save_and_send = false) {
            this.$refs.ruleForm.validate(async valid => {
                if (valid) {
                    console.log(this.ruleForm, 'form')
                    if (!this.row) {
                        this.subLoading = true
                        let data = {
                            queryData: {},
                            paramsData: {
                                ...this.ruleForm,
                                save_and_send,
                                data_type: this.data_type
                            }
                        }
                        data.paramsData.approve_status = '1'
                        data.paramsData.source_type = '2'
                        try {
                            await ddocSaveReq(data)
                            this.subLoading = false
                            this.showDia = false
                            this.$message({
                                message: '添加成功',
                                type: 'success'
                            })
                            this.$emit('refresh')
                        } catch (e) {
                            this.subLoading = false
                            console.log(e)
                        }
                    } else {
                        let data = {
                            queryData: {},
                            paramsData: {
                                ...this.ruleForm,
                                save_and_send,
                                data_type: this.data_type
                            }
                        }
                        this.subLoading = true
                        try {
                            await ddocSaveReq(data)
                            this.subLoading = false
                            this.showDia = false
                            this.$message({
                                message: '修改成功',
                                type: 'success'
                            })
                            this.$emit('refresh')
                        } catch (e) {
                            this.subLoading = false
                            console.log(e)
                        }
                    }
                }
            })
        },
        resetForm() {
            this.ruleForm = {
                id: '',
                time: '',
                external_area: '',
                institution_code: '',
                institution_short: '',
                end_time: '',
                destination_ip: '',
                field_bgjxtlx: '',
                destination_system_type: '',
                destination_system: '',
                attack_type_sub: '',
                peak_flows_rate: '',
                peak_packages_rate: '',
                attack_flow: '',
                data_type: ''
            }
            this.$refs.ruleForm.resetFields()
            this.row = null
        }
    }
}
</script>

<style lang="scss" scoped>
::v-deep .report-drawer .el-input.el-input--small {
    width: 190px;
}

::v-deep .el-form-item__content {
    line-height: 40px;
}
</style>
