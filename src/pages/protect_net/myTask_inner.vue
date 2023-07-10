<template>
    <div class="list">
        <div class="list-container">
            <div class="ub w100 p-2" style="box-sizing: border-box;">
                <div class="event-content w100">
                    <div class="ub ub-pj w100">
                        <div>{{row.taskName}}</div>
                        <div>
                            <el-button size="small" @click="back" :style="{'margin-right': from === 'disposal' ? '' : '20px'}">取 消</el-button>
                            <el-button v-if="from === 'disposal'" size="small" type="primary" @click="submitSuccess" style="margin-right: 20px;">提 交</el-button>
                        </div>
                    </div>
                    <div class="contentBox">
                        <div class="taskContent mt-2">
                            <div class="info-title">基本信息</div>
                            <div class="basic-info">
                                <el-descriptions size="mini" title="" :column="2" border>
                                    <el-descriptions-item label="所属分组">{{row.groupName}}</el-descriptions-item>
                                    <el-descriptions-item label="输出物">{{row.output}}</el-descriptions-item>
                                    <el-descriptions-item label="指派人员">{{findUsers()}}</el-descriptions-item>
                                    <el-descriptions-item label="发起时间">{{row.startTime}}</el-descriptions-item>
                                    <el-descriptions-item label="完成时间">{{row.endTime}}</el-descriptions-item>
                                    <el-descriptions-item label="耗时">{{row.hours}}</el-descriptions-item>
                                    <el-descriptions-item label="任务描述">
                                        <div v-html="row.des"></div>
                                    </el-descriptions-item>
                                    <el-descriptions-item label=""></el-descriptions-item>
                                </el-descriptions>
                            </div>
                        </div>
                        <div class="feedback mt-1" v-if="from === 'disposal'">
                            <div class="info-title">我的反馈</div>
                            <vue-ueditor-wrap v-model="feedback" :config="myConfig"></vue-ueditor-wrap>
                        </div>
                        <div class="feedback mt-1" v-if="from === 'see'">
                            <div class="info-title">我的反馈</div>
                            <el-descriptions size="mini" title="" :column="2" border>
                                <el-descriptions-item label="内容编辑">
                                    <div v-html="row.userFeedback"></div>
                                </el-descriptions-item>
                                <el-descriptions-item label=""></el-descriptions-item>
                            </el-descriptions>
                        </div>
                        <div class="taskHistory">
                            <div class="info-title">任务历史</div>
                            <el-row style="margin:20px 0;background: #fff" type="flex" justify="center">
                                <el-timeline style="width:90%;" class="stepList">
                                    <el-timeline-item
                                        v-for="(item ,index) in row.history"
                                        :key="index"
                                        :icon="item.status === 2 ? 'el-icon-circle-check': 'iconfont icon-circle'"
                                        color="rgba(0,0,0,1)"
                                        placement="top">
                                        <div class="ub ub-pj ub-ac time-box">
                                            <div class="ub" style="width: 50%;">
                                                <h4 style="color: rgba(0, 0, 0, 0.9);font-size: 16px;">{{item.userName}}
                                                    <sub style="font-size:12px;color: rgba(0, 0, 0, 0.6);opacity: 0.6;margin-left: 10px;vertical-align: bottom;">{{item.roleName}}</sub>
                                                </h4>
                                            </div>
                                        </div>
                                        <div class="time-text-box">
                                            <div class="w100 time-text-box-item">
                                                <div class="time-text-box-left">更新时间:</div>
                                                <div class="time-text-box-right">{{item.updateTime}}</div>
                                            </div>
                                            <div class="w100 time-text-box-item">
                                                <div class="time-text-box-left">节点状态:</div>
                                                <div class="time-text-box-right" :class="{status0: item.status === 0, status1: item.status === 1, status2: item.status === 2}">{{item.statusCN}}</div>
                                            </div>
                                            <div class="w100 time-text-box-item">
                                                <div class="time-text-box-left">详情信息:</div>
                                                <div class="time-text-box-right" v-html="seeContent"></div>
                                            </div>
                                        </div>
                                    </el-timeline-item>
                                </el-timeline>
                            </el-row>
                        </div>
                    </div>
                </div>
            </div>
            <el-dialog title="查看详情" :visible.sync="seeDialog" width="720px" custom-class="common-dialog">
                <div v-html="seeContent" class="html-con"></div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" size="small" @click="seeDialog = false">关 闭</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import {
    disposal_myTask
} from '../../server/protect_net/api.js'

import VueUeditorWrap from '../../components/vue-ueditor-wrap.vue' // ES6 Module
import ueditorConfig from '../../mixins/ueditorConfig'
export default {
    components: {
        VueUeditorWrap
    },
    mixins: [ueditorConfig],
    name: 'MyTaskInner',
    data() {
        return {
            assignUsers: [],
            row: '',
            from: '',
            feedback: '',
            seeDialog: false,
            seeContent: ''

        }
    },

    created() {

    },
    mounted() {
        this.$nextTick(() => {
            console.log(this.$route.params)
            if (this.$route.params.row) {
                this.row = this.$route.params.row
                this.from = this.$route.params.from
                this.$setsessionStorage('row', this.$route.params.row)
                this.$setsessionStorage('from', this.$route.params.from)
            } else {
                this.row = this.$getsessionStorage('row')
                this.from = this.$getsessionStorage('from')
            }
        })
    },
    methods: {
        back() {
            this.$router.go(-1)
        },
        submitSuccess() {
            let data = {
                taskId: this.row.id,
                feedback: this.feedback
            }
            disposal_myTask(data).then(res => {
                this.$message({
                    message: '发布成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.back()
                }, 1500)
            }).catch(error => {
                console.log(error)
            })
        },
        findUsers() {
            if (this.row) {
                let str = ''
                this.row.users.forEach((item, index) => {
                    str += item.userName
                    if (index !== this.row.users.length - 1) {
                        str = str + '、'
                    }
                })
                return str
            }
        },
        handleSee(feedback) {
            this.seeContent = `<span style="float: left">内容文本：</span>` + (feedback || '')
            // console.log(this.seeContent)
            this.seeDialog = true
        }
    }
}
</script>

    <style lang="scss" scoped>
        .event {
            padding: 0px 20px 20px 0px;
            box-sizing: border-box;
            position: relative;
        }
        .el-form-item {
            margin-bottom: 10px;
            // color: #fff;
        }
        .event  ::v-deep  .el-form-item__label {
            color: rgba(255,255,255, .8);
        }
        .title {
            display: flex;
            justify-content: space-between;
            margin: 0px 0 20px;
            height: 60px;
            line-height: 60px;

            .left {
                font-size: 22px;
                // color: #fff;
            }
            .right {
                margin-right: 40px;
                font-size: 16px;
                // color: #fff;
            }
        }
        .contentBox {
            padding: 0 20px 0 0;
        }
        .lineStyle {
            border-bottom: 1px solid #e4e7ed ;
            margin-bottom: 20px;

            p {
                display: inline-block;
                border-bottom: 2px solid #387dee;
                margin-bottom: -1px;
                padding: 5px 10px;
                margin-left: 20px;
                color: #387dee;
                font-size: 16px;
            }
        }
        .feedback {
            margin: 10px auto;
        }
        .event  ::v-deep  .el-timeline-item__content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
        }
        .status0 {
            color: #c0c0c0;
        }
        .status1 {
            color: #ffba00;
        }
        .status2 {
            color: #00c0ff;
        }
        .btn {
            border: 1px solid #387dee;
            background-color: #1e3e67;
            color: #888;
        }
        .event ::v-deep .el-timeline-item__tail {
            border-left: 2px solid #00B7EE!important;
        }

        .event ::v-deep .el-timeline-item__icon.el-icon-circle-check {
            color: #00B7EE!important;
            font-size: 20px!important;
        }

        .event ::v-deep .el-timeline-item__icon.icon-circle {
            color: #00B7EE!important;
            font-size: 16px!important;
            font-weight: 500;
        }
        .btn:focus,.btn:hover {
            border: 1px solid #33c4f1;
            background-color: #1e3e67;
            // color: #fff;
        }
        .img-des img {
            max-width: 90%;
        }
    .basic-info {
        position: relative;
        .chapter {
            position: absolute;
            right: 30px;
            top: 20px;
            transform: rotateZ(15deg);
        }
    }
    .basic-info ::v-deep .el-descriptions__body .el-descriptions__table {
        border-radius: 4px;
    }
    .black-theme .basic-info ::v-deep .el-descriptions__body {
        background: #033254;
        color: #fff;
    }
    .black-theme .basic-info ::v-deep .el-descriptions-item__label.is-bordered-label {
        background: #00466d;
        color: #fff;
        box-shadow: inset 0px 0px 2px rgba(0, 186, 255, 0.73);
    }
    .basic-info ::v-deep .el-descriptions-item__label.is-bordered-label {
        width: 120px;
    }
    .black-theme .basic-info ::v-deep .el-descriptions .is-bordered .el-descriptions-item__cell {
        border: 1px solid #1a5c92;
    }
    .black-theme .basic-info ::v-deep .el-descriptions-row {
    box-shadow: inset 0px 0px 6px 0px
    rgba(0, 186, 255, 0.73),
    inset 0px -1px 0px 0px
    rgba(40, 82, 124, 0.5) !important;
    }
    .info-title {
        // margin-left: 14px;
        font-size: 12px;
        color: #0052d9;
        margin-bottom: 18px;
    }
    .list ::v-deep .el-timeline-item__tail {
        border-left: 2px solid #00B7EE !important;
    }
    .list ::v-deep .el-timeline-item__node {
        z-index: 2;
        background-color: #387dee!important;
    }

    .list ::v-deep .el-timeline-item__icon.el-icon-circle-check {
        color: #fff !important;
        font-size: 20px !important;
    }
    .list ::v-deep .el-timeline-item__wrapper {
        top:-16px;
    }
    .list ::v-deep .el-timeline-item__icon.icon-circle {
        color: #00b7ee !important;
        font-size: 16px !important;
        font-weight: 500;
    }
    .time-box {
        width: 100%;
        height: 20px;
        margin-bottom: 10px;
    }
    .time-box-item-bottom div {
        display: inline-block;
    }

    </style>
    <style>

        #ue1{
            border: 1px solid #01e9ff!important;
        }
        .edui-default .edui-editor{
            border: 1px solid #dcdcdc!important;
            background-color: rgba(0,0,0,0)!important;
        }
        .edui-default .edui-editor-toolbarboxouter {
            border-bottom: 1px solid #dcdcdc!important;
             background-color: rgba(0,0,0,0)!important;
        }
        .edui-editor-toolbarboxinner.edui-default{
             /*background-color: rgba(0,0,0,1)!important;*/
        }
        #edui_fixedlayer {
            z-index: 9999999!important;
        }
    .time-text-box {
        padding: 5px;
        background-color: #f5f8fe;
        border-radius: 3px;
        border: solid 1px #dddddd;
    }
    .time-text-box-item {
        margin: 10px 0;
        overflow: hidden;
    }
    .time-text-box-left {
        float: left;
        font-size: 12px;
        letter-spacing: 1px;
        color: rgba(0, 0, 0, 0.4);
        margin-right: 10px;
        vertical-align: top;
    }
    .time-box-item-bottom div {
        display: inline-block;
    }
    .time-text-box-bottom {
        margin-right: 40px;
    }
    .time-text-box-bottom i {
        font-size: 10px;
        color: #999;
    }
    .time-text-box-bottom span {
        font-size: 10px;
        color: #999;
    }
    .time-text-box-right {
        width: 88%;
        float: left;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.9);
        vertical-align: top;
    }
    .time-text-box-right * {
        word-break: break-all;
    }

    .time-text-box-right p {
        font-size: 12px !important;
    }

    .time-text-box-right img {
        max-width: 50% !important;
    }
    </style>
