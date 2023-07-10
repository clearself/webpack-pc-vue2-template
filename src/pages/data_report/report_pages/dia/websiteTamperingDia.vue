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
                <el-form-item label="机构简称：" prop="institution_short" :label-width="formLabelWidth">
                    <el-input disabled size="small" placeholder="" v-model.trim="ruleForm.institution_short"></el-input>
                </el-form-item>
                <el-form-item label="机构代码：" prop="institution_code" :label-width="formLabelWidth">
                    <el-input disabled size="small" placeholder="" v-model.trim="ruleForm.institution_code"></el-input>
                </el-form-item>
                <el-form-item label="篡改类型：" prop="tamper_type" :label-width="formLabelWidth">
                    <el-select clearable size="small" v-model.trim="ruleForm.tamper_type" placeholder="请选择">
                        <el-option
                            v-for="item in (staticDict['tamper'] || [])"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="篡改意图类型：" prop="tamper_intent" :label-width="formLabelWidth">
                    <el-select clearable size="small" v-model.trim="ruleForm.tamper_intent" placeholder="请选择">
                        <el-option
                            v-for="item in (staticDict['tamper_intention'] || [])"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="篡改路径：" prop="tamper_url" :label-width="formLabelWidth">
                    <el-input size="small" placeholder="请输入" v-model.trim="ruleForm.tamper_url"></el-input>
                </el-form-item>
                <el-form-item label="嵌入的黑链地址：" prop="black_link_url" :label-width="formLabelWidth">
                    <el-input size="small" placeholder="请输入" v-model.trim="ruleForm.black_link_url"></el-input>
                </el-form-item>
                <el-form-item label="处置状态：" prop="state" :label-width="formLabelWidth">
                    <el-radio-group v-model="ruleForm.state">
                        <el-radio label="0">未处置</el-radio>
                        <el-radio label="1">已处置</el-radio>
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
                <el-button size="small" :loading="subLoading" type="primary" @click="submit(true)">保存并上报</el-button>
            </div>
        </div>
    </el-drawer>
</template>

<script>
import * as staticDict from '../../config_data'
import { webTamSaveReq } from '@/server/reporting_platform/report_pages'
import { mapGetters } from 'vuex'

export default {
    props: {
        data_type: {
            type: String,
            default: ''
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
                institution_code: [{ required: true, message: '请输入机构代码', trigger: 'blur' }],
                institution_short: [{ required: true, message: '请输入机构简称', trigger: 'blur' }],
                tamper_type: [{ required: true, message: '请选择篡改类型', trigger: 'change' }],
                tamper_intent: [{ required: true, message: '请选择篡改意图类型', trigger: 'change' }],
                tamper_url: [{ required: true, message: '请输入篡改路径', trigger: 'blur' }],
                state: [{ required: true, message: '请选择处置状态', trigger: 'blur' }]
                // data_type: [{ required: true, message: '请输入报送数据类型', trigger: 'change' }]
            },
            ruleForm: {
                id: '',
                time: '',
                institution_code: '',
                institution_short: '',
                tamper_type: '',
                tamper_intent: '',
                tamper_url: '',
                black_link_url: '',
                state: '',
                data_type: ''
            }
        }
    },
    computed: {
        ...mapGetters(['dict', 'orgInfo'])
    },
    methods: {
        initDia(title = '添加网站篡改', row) {
            this.title = title
            if (row) {
                this.row = this.$_.cloneDeep(row)
                this.ruleForm = this.$_.cloneDeep(row)
            } else {
                this.ruleForm.institution_short = this.orgInfo.orgShort
                this.ruleForm.institution_code = this.orgInfo.orgCode
            }
            this.showDia = true
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
                            await webTamSaveReq(data)
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
                            await webTamSaveReq(data)
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
                institution_code: '',
                institution_short: '',
                tamper_type: '',
                tamper_intent: '',
                tamper_url: '',
                black_link_url: '',
                state: '',
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
