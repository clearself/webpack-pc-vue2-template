<template>
    <div class="list">
        <div class='list-container' style="margin-top:0;height: 99%;">
            <div class="ub ub-pj w100 ub-ac">
                <div class="list-tips">时间配置</div>
            </div>
            <div style="width:100%;padding-top: 20px">
                <div class="drag-dialog__body">
                    <el-form :model="timeForm"  :rules="rules" ref="timeForm" label-position="top">
                        <el-form-item label="NFT服务器：" prop="ip" :label-width="formLabelWidth">
                            <el-input style="width: 780px" placeholder="请输入NFT服务器的IP或域名" clearable v-model.trim="timeForm.ip"  size="small"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="ub drag-dialog__footer" style="margin: 100px 0 0 700px">
                    <el-button size="small" type="primary" @click="submitTimeForm('timeForm')" v-per="['link_manage_time_add']">确定</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    save_time_config
} from '../../server/linkage/api'
export default {
    name: 'TimeConfig',
    data() {
        return {
            timer: null,
            timeForm: {
                ip: ''
            },
            rules: {
                ip: [{
                    required: true,
                    message: '请输入NFT服务器的IP或域名',
                    trigger: 'blur'
                }]
            },
            formLabelWidth: '100px'
        }
    },
    methods: {
        submitTimeForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.timer && clearTimeout(this.timer)
                    this.timer = setTimeout(() => {
                        this.addTimeFun()
                        this.timer = null
                    }, 1500)
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        addTimeFun() {
            let data = {
                url: this.timeForm.ip
            }
            save_time_config(data).then(res => {
                this.$message({
                    message: '设置成功',
                    type: 'success'
                })
            }).catch(error => {
                console.log(error + 'error')
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.drag-dialog__body  ::v-deep  .el-switch__label.is-active {
    color: #78ddff;
}
.bg-config {
    background-color: #111D2B;
    background-image: url("/static/img/content_bg.png");
    background-repeat: no-repeat;
    background-position-x: right;
    background-position-y: 180px;

}
</style>
