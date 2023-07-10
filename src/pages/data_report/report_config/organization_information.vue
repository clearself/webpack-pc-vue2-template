<template>
    <div class="event event-wrapper report-platform" style="box-sizing: border-box;">
        <div class="attendance-list content btn-1366" style="margin-top: 0;height:100%;box-sizing: border-box;">
            <!-- <img  v-if="$store.state.common.currentTheme==='white-theme'" src="../../../public/static/img/white_angle_left.png" alt="" class="angle-img-left">
            <img  v-if="$store.state.common.currentTheme==='white-theme'" src="../../../public/static/img/white_angle_right.png" alt="" class="angle-img-right"> -->
            <div class="ub ub-pj w100">
                <div class="list-tips">机构信息</div>
            </div>
            <el-divider></el-divider>
            <div class="ub ub-ac ub-ver w100 instruction-content mt-2">
                <div class="from-box">
                    <el-form :model="instructionForm" ref="instructionForm" :rules="rules" :inline="true" class="unit">
                        <el-form-item label="机构简称：" prop="orgShort" label-width="90px">
                            <el-input placeholder="请输入" v-model.trim="instructionForm.orgShort"></el-input>
                        </el-form-item>
                        <el-form-item style="margin-left: 10px;" label="机构编码：" prop="orgCode" label-width="90px">
                            <el-input placeholder="请输入" v-model.trim="instructionForm.orgCode"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <div style="margin-top: 90px;">
                    <el-button size="small" type="primary" @click="validAdd('instructionForm')">保 存</el-button>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import {
    get_instruction,
    add_instruction
} from '@/server/reporting_platform/setting.js'

export default {
    name: 'Instruction',
    data() {
        return {
            instructionForm: {
                orgCode: '',
                orgShort: ''
            },
            rules: {
                orgCode: [{
                    required: true,
                    message: '请输入机构编码',
                    trigger: 'blur'
                }],
                orgShort: [{
                    required: true,
                    message: '请输入机构简称',
                    trigger: 'blur'
                }]
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.getList()
        })
    },
    methods: {
        validAdd(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.addData()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        addData() {
            let data = {
                queryData: {},
                paramsData: {
                    orgCode: this.instructionForm.orgCode,
                    orgShort: this.instructionForm.orgShort
                }
            }
            if (this.instructionForm.id) {
                data.paramsData.id = this.instructionForm.id
            }
            console.log(data)
            add_instruction(data).then(res => {
                this.$message({
                    message: '保存成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.getList()
                }, 1500)
            }).catch(error => {
                console.log('error', error)
            })
        },
        getList() {
            let data = {}
            get_instruction(data).then(res => {
                console.log('获取机构配置', res)
                this.instructionForm = res
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
.instruction-content{
    position: absolute;
    left:0;
    top:100px;
    bottom:0;
}
</style>
