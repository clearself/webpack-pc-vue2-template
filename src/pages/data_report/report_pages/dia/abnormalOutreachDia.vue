<template>
    <el-drawer size="576px" custom-class="report-drawer" :wrapperClosable="false" :title="title" :visible.sync="showDia" @closed="resetForm">
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
                <el-form-item label="外连区域：" prop="area" :label-width="formLabelWidth">
                    <el-select
                        style="width: 220px"
                        clearable
                        size="small"
                        v-model.trim="ruleForm.area"
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
                <el-form-item label="异常外连类型：" prop="external_type" :label-width="formLabelWidth">
                    <el-select
                        style="width: 220px"
                        clearable
                        size="small"
                        v-model.trim="ruleForm.external_type"
                        placeholder="请选择">
                        <el-option
                            v-for="item in (staticDict['external_type_data'] || [])"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="本地外连IP：" prop="local_ip" :label-width="formLabelWidth">
                    <el-input size="small" placeholder="请输入" v-model.trim="ruleForm.local_ip"></el-input>
                </el-form-item>
                <!--                <el-form-item label="攻击源端口：" prop="source_port" :label-width="formLabelWidth">-->
                <!--                    <el-input size="small" placeholder="请输入" v-model.trim="ruleForm.source_port"></el-input>-->
                <!--                </el-form-item>-->
                <el-form-item label="本地外连端口：" prop="local_port" :label-width="formLabelWidth">
                    <el-input size="small" placeholder="请输入" v-model.trim="ruleForm.local_port"></el-input>
                </el-form-item>
                <el-form-item label="本地网络区域：" prop="local_area" :label-width="formLabelWidth">
                    <el-input size="small" placeholder="请输入" v-model.trim="ruleForm.local_area"></el-input>
                </el-form-item>
                <el-form-item label="本地外连设备类型：" prop="local_device_type" :label-width="formLabelWidth">
                    <el-radio-group v-model="ruleForm.local_device_type">
                        <el-radio label="01">终端</el-radio>
                        <el-radio label="02">服务器</el-radio>
                        <el-radio label="03">其他</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                    label="本地外连系统类型："
                    prop="local_system_type"
                    :label-width="formLabelWidth"
                    v-if="ruleForm.local_device_type == '02'">
                    <el-select
                        @change="beAttackChange"
                        clearable
                        size="small"
                        v-model.trim="ruleForm.local_system_type_big"
                        placeholder="信息系统大类名称">
                        <el-option :disabled="item.value != '核心机构信息系统'" v-for="item in beAttackOpt" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select
                        style="margin-left: 10px"
                        clearable
                        filterable
                        size="small"
                        v-model.trim="ruleForm.local_system_type"
                        placeholder="信息系统子类名称">
                        <el-option v-for="item in beAttDeailOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="本地外连系统名称："
                    prop="local_system_name"
                    :label-width="formLabelWidth"
                    v-if="ruleForm.local_device_type == '02'">
                    <el-input size="small" placeholder="请输入" v-model.trim="ruleForm.local_system_name"></el-input>
                </el-form-item>
                <el-form-item label="外连IP：" prop="connect_ip" :label-width="formLabelWidth">
                    <el-input size="small" placeholder="请输入" v-model.trim="ruleForm.connect_ip"></el-input>
                </el-form-item>
                <el-form-item label="连接情况：" prop="connect_condition" :label-width="formLabelWidth">
                    <el-radio-group v-model="ruleForm.connect_condition">
                        <el-radio label="0">尝试连接</el-radio>
                        <el-radio label="1">成功建立连接</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                    label="外连端口："
                    prop="connect_port"
                    :label-width="formLabelWidth"
                    :rules="ruleForm.connect_condition == '1' ? { required: true, message: '请输入外连端口', trigger: 'blur' } : {}">
                    <el-input size="small" placeholder="请输入" v-model.trim="ruleForm.connect_port"></el-input>
                </el-form-item>
                <el-form-item label="外连域名：" prop="connect_url" :label-width="formLabelWidth">
                    <el-input size="small" placeholder="请输入" v-model.trim="ruleForm.connect_url"></el-input>
                </el-form-item>
                <el-form-item label="协议：" prop="protocol" :label-width="formLabelWidth">
                    <el-input size="small" placeholder="请输入" v-model.trim="ruleForm.protocol"></el-input>
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
import { requireIp, isIp } from '@/utils/validate'
import * as staticDict from '../../config_data'
import { abnormalOutreachSaveReq } from '@/server/reporting_platform/report_pages'
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
            formLabelWidth: '130px',
            rules: {
                time: [{ required: true, message: '请选择发生时间', trigger: 'change' }],
                area: [{ required: true, message: '请选择外部网络区域', trigger: 'change' }],
                institution_code: [{ required: true, message: '请输入机构代码', trigger: 'blur' }],
                institution_short: [{ required: true, message: '请输入机构简称', trigger: 'blur' }],
                external_type: [{ required: true, message: '请选择异常外联类型', trigger: 'change' }],
                local_ip: [{ required: true, validator: requireIp, trigger: 'blur' }],
                // source_port: [{ required: true, message: '请输入攻击源端口', trigger: 'blur' }],
                local_port: [{ required: true, message: '请输入本地外联端口', trigger: 'blur' }],
                local_device_type: [{ required: true, message: '请选择本地外联设备类型', trigger: 'change' }],
                local_system_type: [{ required: true, message: '请选择本地外连系统类型', trigger: 'change' }],
                // local_system_type: null,
                local_system_name: [{ required: true, message: '请输入本地外连系统名称', trigger: 'blur' }],
                // local_system_name: null,
                connect_ip: [{ required: true, validator: requireIp, trigger: 'change' }],
                connect_condition: [{ required: true, message: '请选择连接情况', trigger: 'change' }],
                // connect_port: [{ required: true, message: '请输入外连端口', trigger: 'change' }],
                connect_port: null
                // data_type: [{ required: true, message: '请输入报送数据类型', trigger: 'change' }]
            },
            ruleForm: {
                id: '',
                time: '',
                area: '',
                institution_code: '',
                institution_short: '',
                external_type: '',
                local_ip: '',
                // source_port: '',
                local_port: '',
                local_area: '',
                local_device_type: '',
                local_system_type: '',
                local_system_name: '',
                connect_ip: '',
                connect_condition: '',
                connect_port: '',
                connect_url: '',
                protocol: '',
                data_type: ''
            },
            beAttDeailOptions: []
        }
    },
    computed: {
        ...mapGetters(['dict', 'orgInfo'])
    },
    watch: {
        'ruleForm.local_device_type': {
            handler(newVal) {
                if (newVal != '02') {
                    if (this.$refs.ruleForm) {
                        this.$refs.ruleForm.local_system_type = ''
                        this.$refs.ruleForm.local_system_name = ''
                    }
                } else {
                    this.ruleForm.local_system_type_big = '核心机构信息系统'
                    this.beAttackChange('核心机构信息系统')
                }
            }
        },
        'ruleForm.connect_condition': {
            handler(newVal) {
                if (newVal != '1') {
                    if (this.$refs.ruleForm) {
                        this.$refs.ruleForm.clearValidate(['connect_port'])
                    }
                }
            }
        }
    },
    methods: {
        initDia(title = '添加异常外连', row) {
            this.title = title
            if (row) {
                this.row = this.$_.cloneDeep(row)
                this.ruleForm = this.$_.cloneDeep(row)
                this.initSecSel()
            } else {
                this.ruleForm.institution_short = this.orgInfo.orgShort
                this.ruleForm.institution_code = this.orgInfo.orgCode
            }
            this.showDia = true
        },
        initSecSel() {
            if (this.ruleForm.local_system_type) {
                this.beAttackOpt.forEach(item => {
                    let children = item.children
                    for (let i = 0; i < children.length; i++) {
                        const element = children[i]
                        if (element.value == this.ruleForm.local_system_type) {
                            this.beAttDeailOptions = children
                            this.ruleForm.local_system_type_big = item.value
                        }
                    }
                })
            }
        },
        beAttackChange(value) {
            this.ruleForm.local_system_type = ''
            if (!value) {
                this.beAttDeailOptions = []
                return
            }
            let chooseItem = this.beAttackOpt.find(item => item.value == value)
            this.beAttDeailOptions = (chooseItem && chooseItem.children) ? chooseItem.children : []
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
                        console.log(data)
                        try {
                            await abnormalOutreachSaveReq(data)
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
                            await abnormalOutreachSaveReq(data)
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
                area: '',
                institution_code: '',
                institution_short: '',
                external_type: '',
                local_ip: '',
                // source_port: '',
                local_port: '',
                local_area: '',
                local_device_type: '',
                local_system_type: '',
                local_system_name: '',
                connect_ip: '',
                connect_condition: '',
                connect_port: '',
                connect_url: '',
                protocol: '',
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
