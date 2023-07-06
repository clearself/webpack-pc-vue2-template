<template>
    <div class='event'>
        <div class='list-container'>
            <div class="ub w100" style="padding-top: 12px">
                <div class="list-tips">AD域同步配置</div>
                <div class="back-btn" style="display: inline-block;font-size:14px;color:#0052d9;cursor: pointer;margin: 0px 0 0 20px;" @click="$router.go(-1)">
                    <i style="margin-right: 6px;" class="iconfont icon-fanhui" aria-hidden="true"></i>返回
                </div>
            </div>
            <div style="width:100%;padding-top: 20px">
                <div class="drag-dialog__body">
                    <el-form :model="timeForm"  :rules="rules" ref="timeForm">
                        <el-form-item label="AD域同步时间：" prop="showId" :label-width="formLabelWidth">
                            <el-select size="small" v-model="timeForm.showId" filterable placeholder="请选择" style="width:780px">
                                <el-option label="每天" value="1"></el-option>
                                <el-option label="每周" value="2"></el-option>
                                <el-option label="每月" value="3"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="是否开启：" prop="switch" :label-width="formLabelWidth">
                            <el-switch
                                v-model="timeForm.switch"
                                active-color="#13ce66"
                                inactive-color="#ff4949"
                                active-text="开"
                                inactive-text="关">
                            </el-switch>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="ub drag-dialog__footer" style="margin: 100px 0 0 760px">
                    <el-button size="small" type="primary" @click="submitTimeForm('timeForm')">确 定</el-button>
                <!--<searchBtn title="取 消" @click="cancel" />-->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    get_ad_config,
    save_ad_config
} from '@/server/system/asset_users.js'
export default {
    name: 'AdConfig',
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
            matches: [],
            timer: null,
            timeForm: {
                showId: '',
                switch: false
            },
            rules: {
                showId: [{
                    required: true,
                    message: '请选择同步时间',
                    trigger: 'change'
                }]
            },
            formLabelWidth: '140px'
        }
    },

    mounted() {
        this.$nextTick(() => {
            this.get_config()
        })
    },
    methods: {
        get_config() {
            let data = {
                paramsData: {},
                queryData: {}
            }
            get_ad_config(data).then(res => {
                this.timeForm.showId = res.syncTime + ''
                this.timeForm.switch = res.status == 1
            }).catch(error => {
                console.log(error + 'error')
            })
        },
        cancel() {
            this.timeForm = {
                showId: '',
                switch: false
            }
        },
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
            console.log(this.timeForm.switch)
            let data = {
                paramsData: {},
                queryData: {
                    syncTime: Number(this.timeForm.showId),
                    status: this.timeForm.switch ? 1 : 0
                }
            }
            save_ad_config(data).then(res => {
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
.list-container {
    height: calc(100vh - 100px);
}
.drag-dialog__body  ::v-deep  .el-switch__label.is-active {
    color: #0052d9;
}
.bg-config {
    background-color: #fff;
    // background-image: url("/static/img/content_bg.png");
    // background-repeat: no-repeat;
    // background-position-x: right;
    // background-position-y: 180px;

}
</style>
