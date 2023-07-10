<template>
    <div class="event event-wrapper report-platform" style="box-sizing: border-box;">
        <div class="attendance-list content btn-1366" style="margin-top: 0;height:100%;box-sizing: border-box;">
            <!-- <img  v-if="$store.state.common.currentTheme==='white-theme'" src="../../../public/static/img/white_angle_left.png" alt="" class="angle-img-left">
            <img  v-if="$store.state.common.currentTheme==='white-theme'" src="../../../public/static/img/white_angle_right.png" alt="" class="angle-img-right"> -->
            <div class="ub ub-pj w100">
                <div class="list-tips">DDOS流量单位设置</div>
            </div>
            <el-divider></el-divider>
            <div class="ub ub-ac ub-ver w100 flow-content mt-2">
                <div class="from-box">
                    <el-form :model="flowForm" ref="flowForm" :rules="rules" :inline="true" class="unit">
                        <el-form-item label="DDOS攻击流量单位：" prop="attackFlowUnit" label-width="200px">
                            <el-select clearable v-model.trim="flowForm.attackFlowUnit" placeholder="请选择">
                                <el-option v-for="item in units" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
                <div style="margin-top: 90px;">
                    <el-button size="small" type="primary" @click="validAdd('flowForm')">保 存</el-button>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import {
    get_flow,
    add_flow
} from '@/server/reporting_platform/setting.js'

export default {
    name: 'Flow',
    data() {
        return {
            units: [
                // {
                //     value: 0,
                //     label: 'B'
                // }, {
                //     value: 1,
                //     label: 'KB'
                // }, {
                //     value: 2,
                //     label: 'M'
                // },
                {
                    value: 3,
                    label: 'Gb'
                }
            ],
            flowForm: {
                attackFlowUnit: ''
            },
            rules: {
                attackFlowUnit: [{
                    required: true,
                    message: '请选择流量单位',
                    trigger: 'change'
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
                    attackFlowUnit: this.flowForm.attackFlowUnit
                }
            }
            if (this.flowForm.id) {
                data.paramsData.id = this.flowForm.id
            }
            console.log(data)
            add_flow(data).then(res => {
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
            get_flow(data).then(res => {
                console.log('获取机构配置', res)
                this.flowForm = res
            }).catch(error => {
                console.log('error', error)
            })
        }

    }
}
</script>

<style lang="scss" scoped>
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
.flow-content{
    position: absolute;
    left:0;
    top:100px;
    bottom:0;
}
.from-box{
    transform: translateX(-30px);
}
.from-box>>>.el-date-editor.el-input{
    width:220px!important;
}
</style>
