<template>
    <div class="event event-wrapper report-platform" style="box-sizing: border-box;">
        <div class="attendance-list content btn-1366" style="margin-top: 0;height:100%;box-sizing: border-box;">
            <img src="@/assets/img/data_report/white_angle_left.png" alt="" class="angle-img-left">
            <img src="@/assets/img/data_report/white_angle_right.png" alt="" class="angle-img-right">
            <div class="ub ub-pj w100">
                <div class="list-tips">数据源设置</div>
            </div>
            <!-- <el-divider></el-divider> -->
            <div class="ub ub-ac ub-ver w100 instruction-content mt-2">
                <div class="from-box">
                    <el-form :model="dataSourceForm" ref="dataSourceForm" :rules="rules"  :inline="true" class="unit">
                        <el-form-item label="数据源：" prop="type" label-width="130px">
                            <el-select clearable size="small" v-model="dataSourceForm.type" placeholder="请选择">
                                <el-option label="日志" :value="0"></el-option>
                                <el-option label="事件" :value="1"></el-option>
                            </el-select>
                        </el-form-item>
                        <div class="ub ub-pc" style="margin-top: 90px;">
                            <el-button size="small" type="primary" @click="validAdd('dataSourceForm')">确 定</el-button>
                        </div>
                    </el-form>
                </div>
            </div>
        </div>

        <el-dialog title="提示" width="30%" :visible.sync="autoDialog" custom-class="attendance-dialog">
            <div>确定更新数据源配置吗？</div>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="autoDialog = false">取 消</el-button>
                <el-button size="small" type="primary" @click="addData">确 定</el-button>
            </div>
        </el-dialog>
    </div>

</template>

<script>
import {
    get_data_source_config,
    saveDataSources
} from '@/server/reporting_platform/report_config.js'

export default {
    name: 'AutoSet',
    data() {
        return {
            autoDialog: false,
            dataSourceForm: {
                type: ''
            },
            formLabelWidth: '80px',
            rules: {
                type: [{
                    required: true,
                    message: '请选择',
                    trigger: 'change'
                }]
            }
        }
    },
    watch: {
        autoDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.dataSourceForm.resetFields()
                }
            }
        }
    },
    mounted() {
        this.getList()
    },
    methods: {
        getList() {
            get_data_source_config().then(res => {
                console.log('获取数据源配置', res)
                this.dataSourceForm.type = res.dataSources ?? ''
            }).catch(error => {
                console.log('error', error)
            })
        },
        validAdd(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.autoDialog = true
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        addData() {
            this.autoDialog = false
            let data = {
                queryData: {},
                paramsData: {
                    dataSources: this.dataSourceForm.type
                }
            }
            saveDataSources(data).then(res => {
                this.$message({
                    message: '保存成功',
                    type: 'success'
                })
                this.autoDialog = false
                this.getList()
            }).catch(error => {
                console.log('error', error)
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.content{

    /* background: url("../../assets/img/content_bg.png") center bottom no-repeat;
    background-color: rgba(17,29,43,.8);
    background-size: contain;
    position: relative; */
}
.instruction-content{
    position: absolute;
    left:0;
    top:100px;
    bottom:0;
}
.auto-code{
    color:#fff;
    min-width: 200px;
    max-width: 350px;
    font-size:13px;
    line-height: 22px;
    word-break: break-all;
}
.angle-img-left {
    position: absolute;
    left: 20px;
    top: 20px;
}
.angle-img-right {
    position: absolute;
    right: 20px;
    bottom: 20px;
}
    </style>
