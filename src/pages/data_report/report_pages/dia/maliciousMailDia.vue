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
                <el-form-item label="机构简称：" prop="institution_short" :label-width="formLabelWidth">
                    <el-input disabled size="small" placeholder="" v-model.trim="ruleForm.institution_short"></el-input>
                </el-form-item>
                <el-form-item label="机构代码：" prop="institution_code" :label-width="formLabelWidth">
                    <el-input disabled size="small" placeholder="" v-model.trim="ruleForm.institution_code"></el-input>
                </el-form-item>
                <el-form-item label="发件人：" prop="addresser" :label-width="formLabelWidth">
                    <el-input size="small" placeholder="请输入" v-model.trim="ruleForm.addresser"></el-input>
                </el-form-item>
                <el-form-item label="发件人源地址：" prop="addresser_source_ip" :label-width="formLabelWidth">
                    <el-input size="small" placeholder="请输入" v-model.trim="ruleForm.addresser_source_ip"></el-input>
                </el-form-item>
                <el-form-item label="收件人/抄送人：" prop="addressee" :label-width="formLabelWidth">
                    <el-input size="small" placeholder="请输入" v-model.trim="ruleForm.addressee"></el-input>
                </el-form-item>
                <el-form-item label="邮件标题：" prop="mail_title" :label-width="formLabelWidth">
                    <el-input size="small" placeholder="请输入" v-model.trim="ruleForm.mail_title"></el-input>
                </el-form-item>
                <el-form-item label="恶意URL：" prop="mail_url" :label-width="formLabelWidth">
                    <el-input size="small" placeholder="请输入" v-model.trim="ruleForm.mail_url"></el-input>
                </el-form-item>
                <el-form-item label="恶意附件哈希：" prop="mail_attach_hashcode" :label-width="formLabelWidth">
                    <el-input size="small" placeholder="请输入" v-model.trim="ruleForm.mail_attach_hashcode"></el-input>
                </el-form-item>
                <!--                <el-form-item label="感染系统名称：" prop="system_name" :label-width="formLabelWidth">-->
                <!--                    <el-input size="small" placeholder="请输入" v-model.trim="ruleForm.system_name"></el-input>-->
                <!--                </el-form-item>-->
                <!--                <el-form-item label="恶意代码文件哈希值：" prop="field_eydmwjhxz" :label-width="formLabelWidth">-->
                <!--                    <el-input size="small" placeholder="请输入" v-model.trim="ruleForm.field_eydmwjhxz"></el-input>-->
                <!--                </el-form-item>-->
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
                <el-button size="small" :loading="subLoading" type="primary" @click="submit(1)">保存并上报</el-button>
            </div>
        </div>
    </el-drawer>
</template>

<script>
import * as staticDict from '../../config_data'
import { maliciousMailSaveReq } from '@/server/reporting_platform/report_pages'
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
            title: '',
            subLoading: false,
            row: null,
            formLabelWidth: '130px',
            rules: {
                time: [{ required: true, message: '请选择发生时间', trigger: 'change' }],
                institution_code: [{ required: true, message: '请输入机构代码', trigger: 'blur' }],
                institution_short: [{ required: true, message: '请输入机构简称', trigger: 'blur' }],
                addresser: [{ required: true, message: '请输入发件人', trigger: 'blur' }],
                addressee: [{ required: true, message: '请输入收件人/抄送人', trigger: 'blur' }],
                mail_title: [{ required: true, message: '请输入邮件标题', trigger: 'blur' }]
                // system_name: [{ required: true, message: '请输入感染系统名称', trigger: 'blur' }],
                // data_type: [{ required: true, message: '请输入报送数据类型', trigger: 'change' }]
            },
            ruleForm: {
                id: '',
                time: '',
                institution_code: '',
                institution_short: '',
                addresser: '',
                addresser_source_ip: '',
                addressee: '',
                mail_title: '',
                mail_url: '',
                mail_attach_hashcode: '',
                // system_name: '',
                // field_eydmwjhxz: '',
                hash_name: '',
                data_type: ''
            }
        }
    },
    computed: {
        ...mapGetters(['dict', 'orgInfo'])
    },
    methods: {
        initDia(title = '添加恶意邮件', row) {
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
                            await maliciousMailSaveReq(data)
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
                            await maliciousMailSaveReq(data)
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
                addresser: '',
                addresser_source_ip: '',
                addressee: '',
                mail_title: '',
                mail_url: '',
                mail_attach_hashcode: '',
                // system_name: '',
                field_eydmwjhxz: '',
                hash_name: '',
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
