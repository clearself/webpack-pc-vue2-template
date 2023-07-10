<template>
    <div class='event event-wrapper attendance-list bg-config' style="margin-top: 0!important;">
        <div class="ub ub-pj w100" style="padding-top: 12px">
            <div class="list-tips">时间设置</div>
        </div>
        <div style="width:100%;padding-top: 20px">
            <div class="drag-dialog__body">
                <el-form :model="timeForm"  :rules="rules" ref="timeForm">
                    <el-form-item label="监控分析：" prop="monitor" :label-width="formLabelWidth">
                        <el-input style="width:780px" placeholder="请输入" clearable v-model.trim="timeForm.monitor" size="small"></el-input> <span style="color: #fff">分钟</span>
                    </el-form-item>
                    <el-form-item label="分析研判：" prop="judgment" :label-width="formLabelWidth">
                        <el-input style="width:780px" placeholder="请输入" clearable v-model.trim="timeForm.judgment" size="small" ></el-input> <span style="color: #fff">分钟</span>
                    </el-form-item>
                    <el-form-item label="响应处置：" prop="disposal" :label-width="formLabelWidth">
                        <el-input style="width:780px" placeholder="请输入" clearable v-model.trim="timeForm.disposal" size="small"></el-input> <span style="color: #fff">分钟</span>
                    </el-form-item>
                    <el-form-item label="朔源：" prop="tracing" :label-width="formLabelWidth">
                        <el-input style="width:780px" placeholder="请输入" clearable v-model.trim="timeForm.tracing" size="small"></el-input> <span style="color: #fff">分钟</span>
                    </el-form-item>
                </el-form>
            </div>
            <div class="ub drag-dialog__footer" style="margin: 100px 0 0 760px">
                <searchBtn title="确 定" @click="submitTimeForm('timeForm')"/>
                <!--<searchBtn title="取 消" @click="cancel" />-->
            </div>
        </div>
    </div>
</template>

<script>
import {
    get_set_time,
    add_set_time
} from '../../server/protect_net/api.js'
export default {
    name: 'TimeSet',
    data() {
        var reg = /^[1-9]\d*$/
        var isNumber = (rule, value, callback) => {
            if (!reg.test(value)) {
                return callback(new Error('请输入大于0整数'))
            } else {
                callback()
            }
        }
        return {
            timeForm: {
                monitor: '',
                judgment: '',
                disposal: '',
                tracing: ''
            },
            rules: {
                monitor: [{
                    required: true,
                    validator: isNumber,
                    trigger: 'blur'
                }],
                judgment: [{
                    required: true,
                    validator: isNumber,
                    trigger: 'blur'

                }],
                disposal: [{
                    required: true,
                    validator: isNumber,
                    trigger: 'blur'

                }],
                tracing: [{
                    required: true,
                    validator: isNumber,
                    trigger: 'blur'

                }]

            },
            formLabelWidth: '100px'
        }
    },

    mounted() {
        this.$nextTick(() => {
            this.get_time()
        })
    },
    methods: {
        get_time() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_set_time(data).then(res => {
                console.log('1111', res)
                this.timeForm = res
            }).catch(error => {
                console.log(error + 'error')
            })
        },
        cancel() {
            this.timeForm = {
                monitor: '',
                judgment: '',
                disposal: '',
                tracing: ''
            }
        },
        submitTimeForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.addTimeFun()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        addTimeFun() {
            let data = {
                queryData: {},
                paramsData: {
                    monitor: this.timeForm.monitor,
                    judgment: this.timeForm.judgment,
                    disposal: this.timeForm.disposal,
                    tracing: this.timeForm.tracing
                }
            }
            if (this.timeForm.id) {
                data.paramsData.id = this.timeForm.id
            }
            add_set_time(data).then(res => {
                this.$message({
                    message: '保存成功',
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
.event{
    width:100%;
    height:100%;
    position: relative;
}
.time_set_box{
    width:300px;
    height:200px;
    background: #fff;
    position: absolute;
    left:50%;
    top:50%;
    transform: translate(-50%,-50%);
}
.region{
    width:100%;
    position: absolute;
    left:0;
    top:20%;
    bottom:0;
    right:0;
    overflow: auto;

}
.reject-wrapper{
    height:100%;
    padding:50px 0 20px 50px;
    box-sizing: border-box;
    position: relative;
}
.reject-box{
    width:auto;
    position: relative;
}

.col{
    position: absolute;
    top:-22px;
    left:0px;
    right:0;
    height:20px;
    font-size:0;
    z-index: 99;
}
.col>div{
    width:22px;
    height:22px;
    display: inline-block;
    text-align: center;
    line-height: 10px;
    font-size:10px;
    margin-left: -1px;
    margin-top: -1px;
    color:#007aff;
}
.row{
    position: absolute;
    top:0px;
    left:-22px;
    bottom:0;
    width:20px;
    font-size:0;
    z-index: 99;
}
.row>div{
    width:22px;
    height:22px;
    line-height: 22px;
    font-size:10px;
    margin-left: -1px;
    margin-top: -1px;
    color:#007aff;
}
.event ::v-deep .el-range-input {
    background-color: rgba(0, 0, 0, 0);
    color: #fff;
}
.no-data{
    width:200px;
    position: absolute;
    left:50%;
    top:50%;
    transform: translate(-50%,-50%);
}
.top-bg{
    width:80%;
    margin: 20px auto 0px;
    height:60px;
    background-image:url(../../assets/img/Large_screen.png);
    background-position: center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    z-index: 999;
}

.seat-team{
    width:100%;
    margin: 50px 0;
    overflow: hidden;
}
.seat-team>div{
    margin: 10px;
    font-size:0;
    float:left;

}
.seat-team>div i{
    display: inline-block;
    width:20px;
    height:12px;
    vertical-align: middle;
}
.seat-team>div span{
    margin-left: 5px;
    display: inline-block;
    vertical-align: middle;
    font-size:12px;
    color:#fff;
}
.bg-config {
    background-color: #111D2B;
    background-image: url("/static/img/content_bg.png");
    background-repeat: no-repeat;
    background-position-x: right;
    background-position-y: 180px;

}
</style>
