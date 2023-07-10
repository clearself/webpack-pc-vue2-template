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
                <el-form-item label="设备网络区域：" prop="device_area" :label-width="formLabelWidth">
                    <el-input size="small" placeholder="请输入" v-model.trim="ruleForm.device_area"></el-input>
                </el-form-item>
                <el-form-item label="机构简称：" prop="institution_short" :label-width="formLabelWidth">
                    <el-input disabled size="small" placeholder="" v-model.trim="ruleForm.institution_short"></el-input>
                </el-form-item>
                <el-form-item label="机构代码：" prop="institution_code" :label-width="formLabelWidth">
                    <el-input disabled size="small" placeholder="" v-model.trim="ruleForm.institution_code"></el-input>
                </el-form-item>
                <el-form-item label="风险发生地区：" prop="institution_branch_area" :label-width="formLabelWidth">
                    <el-select
                        style="width: 220px"
                        clearable
                        size="small"
                        v-model.trim="ruleForm.institution_branch_area"
                        placeholder="请选择">
                        <el-option
                            v-for="item in (dict['option_area'] || [])"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="感染设备IP：" prop="device_ip" :label-width="formLabelWidth">
                    <el-input size="small" placeholder="请输入" v-model.trim="ruleForm.device_ip"></el-input>
                </el-form-item>
                <el-form-item label="感染设备类型：" prop="device_type" :label-width="formLabelWidth">
                    <el-radio-group v-model="ruleForm.device_type">
                        <el-radio label="01">终端</el-radio>
                        <el-radio label="02">服务器</el-radio>
                        <el-radio label="03">其他</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="感染设备主机名：" prop="device_host_name" :label-width="formLabelWidth">
                    <el-input size="small" placeholder="请输入" v-model.trim="ruleForm.device_host_name"></el-input>
                </el-form-item>
                <el-form-item
                    label="感染系统类型："
                    prop="system_type"
                    :label-width="formLabelWidth"
                    v-if="ruleForm.device_type == '02'">
                    <el-select
                        @change="beAttackChange"
                        clearable
                        size="small"
                        v-model.trim="ruleForm.system_type_big"
                        placeholder="信息系统大类名称">
                        <el-option
                            :disabled="item.value != '核心机构信息系统'"
                            v-for="item in beAttackOpt"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select
                        @change="beAttackNameChange"
                        style="margin-left: 10px"
                        clearable
                        filterable
                        size="small"
                        v-model.trim="ruleForm.system_type"
                        placeholder="信息系统子类名称">
                        <el-option
                            v-for="item in beAttDeailOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="感染系统名称："
                    prop="system_name"
                    :label-width="formLabelWidth"
                    v-if="ruleForm.device_type == '02'">
                    <el-input size="small" placeholder="请输入" v-model.trim="ruleForm.system_name"></el-input>
                </el-form-item>
                <el-form-item label="恶意代码文件哈希值：" prop="virus_hashcode" :label-width="formLabelWidth">
                    <el-input size="small" placeholder="请输入" v-model.trim="ruleForm.virus_hashcode"></el-input>
                </el-form-item>
                <el-form-item label="哈希算法：" prop="hash_name" :label-width="formLabelWidth">
                    <el-select
                        style="width: 220px"
                        clearable
                        size="small"
                        v-model.trim="ruleForm.hash_name"
                        placeholder="请选择">
                        <el-option
                            v-for="item in (staticDict['hash_name_data'] || [])"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="恶意代码类型：" prop="virus_type" :label-width="formLabelWidth">
                    <el-select
                        style="width: 220px"
                        clearable
                        size="small"
                        v-model.trim="ruleForm.virus_type"
                        placeholder="请选择">
                        <el-option
                            v-for="item in (staticDict['virus_type_data'] || [])"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="恶意代码名称：" prop="virus_name" :label-width="formLabelWidth">
                    <el-input size="small" placeholder="请输入" v-model.trim="ruleForm.virus_name"></el-input>
                </el-form-item>
                <el-form-item label="采集设备产品型号：" prop="anti_virus_product" :label-width="formLabelWidth">
                    <el-input size="small" placeholder="请输入" v-model.trim="ruleForm.anti_virus_product"></el-input>
                </el-form-item>
                <el-form-item label="采集设备供应商：" prop="anti_purveyor" :label-width="formLabelWidth">
                    <el-input size="small" placeholder="请输入" v-model.trim="ruleForm.anti_purveyor"></el-input>
                </el-form-item>
                <el-form-item label="处置动作：" prop="action" :label-width="formLabelWidth">
                    <el-radio-group v-model="ruleForm.action">
                        <el-radio label="1">已查杀/隔离</el-radio>
                        <el-radio label="0">未处置</el-radio>
                    </el-radio-group>
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
                <el-button size="small" :loading="subLoading" type="primary" @click="submit(true)">保存并上报
                </el-button>
            </div>
        </div>
    </el-drawer>
</template>

<script>
import { requireIp } from '@/utils/validate'
import * as staticDict from '../../config_data'
import { maliciousCodeSaveReq } from '@/server/reporting_platform/report_pages'
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
        }
    },
    data() {
        return {
            staticDict,

            showDia: false,
            subLoading: false,
            title: '',
            row: null,
            formLabelWidth: '142px',
            rules: {
                time: [{ required: true, message: '请选择发生时间', trigger: 'change' }],
                institution_code: [{ required: true, message: '请输入机构代码', trigger: 'blur' }],
                institution_short: [{ required: true, message: '请输入机构简称', trigger: 'blur' }],
                institution_branch_area: [{ required: true, message: '请选择风险发生地区', trigger: 'change' }],
                device_ip: [{ required: true, validator: requireIp, trigger: 'blur' }],
                device_type: [{ required: true, message: '请选择感染设备类型', trigger: 'change' }],
                system_type: [{ required: true, message: '请选择感染系统类型', trigger: 'change' }],
                // system_type: null,
                system_name: [{ required: true, message: '请输入感染系统名称', trigger: 'blur' }],
                // system_name: null,
                virus_type: [{ required: true, message: '请选择恶意代码类型', trigger: 'change' }],
                virus_name: [{ required: true, message: '请输入恶意代码名称', trigger: 'blur' }],
                anti_virus_product: [{ required: true, message: '请输入采集设备产品型号', trigger: 'blur' }],
                anti_purveyor: [{ required: true, message: '请输入采集设备供应商', trigger: 'blur' }],
                action: [{ required: true, message: '请选择处置动作', trigger: 'change' }]
                // data_type: [{ required: true, message: '请输入报送数据类型', trigger: 'change' }]
            },
            ruleForm: {
                id: '',
                time: '',
                device_area: '',
                institution_code: '',
                institution_short: '',
                institution_branch_area: '',
                device_ip: '',
                device_type: '',
                device_host_name: '',
                system_type: '',
                system_name: '',
                virus_hashcode: '',
                virus_type: '',
                virus_name: '',
                anti_virus_product: '',
                anti_purveyor: '',
                action: '',
                data_type: ''
            },
            beAttDeailOptions: []
        }
    },
    computed: {
        ...mapGetters(['dict', 'orgInfo'])
    },
    watch: {
        'ruleForm.device_type': {
            handler(newVal) {
                if (newVal != '02') {
                    if (this.$refs.ruleForm) {
                        this.$refs.ruleForm.clearValidate(['system_type'])
                        this.$refs.ruleForm.clearValidate(['system_name'])
                    }
                } else {
                    this.ruleForm.system_type_big = '核心机构信息系统'
                    this.beAttackChange('核心机构信息系统')
                }
            }
        }
    },
    methods: {
        initDia(title = '添加恶意代码感染', row) {
            this.title = title
            if (row) {
                this.row = this.$_.cloneDeep(row)
                this.ruleForm = this.$_.cloneDeep(row)
                this.initSecSel()
            } else {
                this.ruleForm.institution_short = this.orgInfo.orgShort
                this.ruleForm.institution_code = this.orgInfo.orgCode
                this.ruleForm.institution_branch_area = '210000'
            }
            this.showDia = true
        },
        initSecSel() {
            if (this.ruleForm.system_type) {
                this.beAttackOpt.forEach(item => {
                    let children = item.children
                    for (let i = 0; i < children.length; i++) {
                        const element = children[i]
                        if (element.value == this.ruleForm.system_type) {
                            this.beAttDeailOptions = children
                            this.ruleForm.system_type_big = item.value
                        }
                    }
                })
            }
        },
        beAttackChange(value) {
            this.ruleForm.system_type = ''
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
            this.ruleForm.system_name = chooseOne.label
            this.$refs.ruleForm.clearValidate(['system_name'])
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
                            await maliciousCodeSaveReq(data)
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
                            await maliciousCodeSaveReq(data)
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
                device_area: '',
                institution_code: '',
                institution_short: '',
                institution_branch_area: '',
                device_ip: '',
                device_type: '',
                device_host_name: '',
                system_type: '',
                system_name: '',
                virus_hashcode: '',
                virus_type: '',
                virus_name: '',
                anti_virus_product: '',
                anti_purveyor: '',
                action: '',
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
