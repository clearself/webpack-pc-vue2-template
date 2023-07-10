<template>
    <div class="list">
        <div class="list-container">
            <div class="ub w100 p-2" style="box-sizing: border-box;">
                <div class="event-content w100">
                    <div class="ub ub-pj w100">
                        <div class="list-tips">{{detailInfo.taskName}}
                            <!-- <div class="back-btn" style="display: inline-block;font-size:12px;color:#387dee;cursor: pointer;margin-left: 20px;" @click="back"><i style="margin-right: 6px;" class="fa fa-mail-reply" aria-hidden="true"></i>返回</div> -->
                        </div>
                        <div>
                            <el-button size="small" style="margin-right: 20px" @click="back">取 消</el-button>
                        </div>
                    </div>
                    <!-- <div class="ub ub-pj w100 task-status">
                        <div>{{detailInfo.taskName}}</div>
                        <div>状态：
                            <span v-if="detailInfo.status==0" class="one">{{detailInfo.statusCN}}</span>
                            <span v-if="detailInfo.status==1" class="two">{{detailInfo.statusCN}}</span>
                            <span v-if="detailInfo.status==2" class="three">{{detailInfo.statusCN}}</span>
                        </div>
                    </div> -->
                    <div class="taskContent mt-2">
                        <div class="info-title">基本信息</div>
                        <div class="basic-info">
                            <el-descriptions size="mini" title="" :column="2" border>
                                <el-descriptions-item label="所属分组">{{detailInfo.groupName}}</el-descriptions-item>
                                <el-descriptions-item label="输出物">{{detailInfo.output}}</el-descriptions-item>
                                <el-descriptions-item label="指派人员">{{detailInfo.users}}</el-descriptions-item>
                                <el-descriptions-item label="发起时间">{{detailInfo.startTime}}</el-descriptions-item>
                                <el-descriptions-item label="完成时间">{{detailInfo.endTime}}</el-descriptions-item>
                                <el-descriptions-item label="耗时">{{detailInfo.hours}}</el-descriptions-item>
                                <el-descriptions-item label="任务描述">
                                    <div v-html="detailInfo.des"></div>
                                </el-descriptions-item>
                                <el-descriptions-item label=""></el-descriptions-item>
                            </el-descriptions>
                        </div>
                    </div>
                    <div class="taskHistory">
                        <div class="info-title mt-2">任务历史</div>
                        <el-row style="margin:20px 0;background: #fff" type="flex" justify="center">
                            <el-timeline style="width:90%;" class="stepList">
                                <el-timeline-item
                                    v-for="(activity ,index) in activities"
                                    :key="index"
                                    :icon="activity.icon"
                                    :type="activity.type"
                                    :color="activity.color"
                                    :size="activity.size"
                                    :hide-timestamp="true"
                                    :timestamp="activity.timestamp">
                                    <div class="ub ub-pj ub-ac time-box">
                                        <div class="ub" style="width: 50%;">
                                            <h4 style="color: rgba(0, 0, 0, 0.9);font-size: 16px;">{{activity.username}}
                                                <sub style="font-size:12px;color: rgba(0, 0, 0, 0.6);opacity: 0.6;margin-left: 10px;vertical-align: bottom;">{{activity.roleName}}</sub>
                                            </h4>
                                        </div>
                                    </div>
                                    <div class="time-text-box">
                                        <div class="w100 time-text-box-item">
                                            <div class="time-text-box-left">更新时间:</div>
                                            <div class="time-text-box-right">{{activity.updateTime}}</div>
                                        </div>
                                        <div class="w100 time-text-box-item">
                                            <div class="time-text-box-left">节点状态:</div>
                                            <div class="time-text-box-right" :class="{one: activity.status === 0, two: activity.status === 1, three: activity.status === 2}">{{activity.statusCN}}</div>
                                        </div>
                                        <div class="w100 time-text-box-item">
                                            <div class="time-text-box-left">详情信息:</div>
                                            <div class="time-text-box-right" v-html="activity.seeContent"></div>
                                        </div>
                                        <div class="w100 time-text-box-item">
                                            <div class="time-text-box-left">反馈信息:</div>
                                            <div class="time-text-box-right" v-html="activity.feedback"></div>
                                        </div>
                                    </div>
                                </el-timeline-item>
                            </el-timeline>
                        </el-row>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CreateAttrack',
    data() {
        return {
            seeForm: {
                username: '',
                timestamp: '',
                status: '',
                statusCN: '',
                roleName: '',
                feedback: ''
            },
            historyDialog: false,
            activities: [],
            activeName: 'first',
            detailInfo: {
                createTime: '',
                des: '',
                hours: '',
                endTime: null,
                groupName: '',
                output: '',
                startTime: '',
                status: '',
                statusCN: '',
                taskName: '',
                feedback: '',
                history: [],
                users: ''
            }

        }
    },
    mounted() {
        this.$nextTick(() => {
            let editInfo = this.$getsessionStorage('editInfo')
            let userInfo = this.$getsessionStorage('userInfo')
            console.log('编辑信息', editInfo)
            let users = []
            this.detailInfo = {
                createTime: editInfo.createTime,
                des: editInfo.des,
                endTime: editInfo.endTime,
                groupName: editInfo.groupName,
                output: editInfo.output,
                startTime: editInfo.startTime,
                status: editInfo.status,
                statusCN: editInfo.statusCN,
                taskName: editInfo.taskName,
                hours: editInfo.hours ? '0' : editInfo.hours,
                feedback: '',
                history: [],
                users: ''
            }
            if (editInfo.users.length > 0) {
                editInfo.users.forEach(item => {
                    users.push(item.userName)
                })
            }
            if (editInfo.history.length > 0) {
                editInfo.history.forEach(item => {
                    let obj = {}
                    obj.id = item.id
                    if (userInfo.id === item.id) {
                        this.detailInfo.feedback = item.feedback
                    }
                    obj.username = item.userName
                    obj.timestamp = item.updateTime
                    obj.size = 'large'
                    obj.color = 'rgba(0,0,0,1)'
                    if (item.status == 2) {
                        obj.icon = 'el-icon-circle-check'
                    } else {
                        obj.icon = 'iconfont icon-circle'
                    }
                    obj.roleName = item.roleName
                    obj.feedback = item.feedback
                    obj.status = item.status
                    obj.statusCN = item.statusCN
                    this.activities.push(obj)
                })
            }
            this.detailInfo.users = users.join(',')
        })
    },
    methods: {
        back() {
            this.$router.go(-1)
        },
        handleSee(activity) {
            this.seeForm = {
                username: activity.username,
                timestamp: activity.timestamp,
                status: activity.status,
                statusCN: activity.statusCN,
                roleName: activity.roleName,
                feedback: activity.feedback
            }
            this.historyDialog = true
        }
    }
}
</script>

    <style lang="scss" scoped>
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
        top:-3px;
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
        .event {
            padding: 0px 20px 20px 0px;
            box-sizing: border-box;
            position: relative;
        }

        .event ::v-deep .el-range-input {
            background-color: rgba(0, 0, 0, 0);
            // color: #fff;
        }

        .event ::v-deep .el-range-separator {
            // color: #fff;
        }

        .el-tabs ::v-deep .el-tabs__nav-wrap::after {
            content: "";
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 1px;
            background-color: #387dee;
            opacity: 0.3;
            z-index: 1;
        }

        .el-tabs ::v-deep .el-tabs__active-bar {
            background: #387dee;
            margin-left: 14px;
        }

        .el-tabs ::v-deep .el-tabs__item.is-active {
            color: #387dee;
            height: 34px;
            line-height: 34px;
            border-color: transparent;
        }

        .el-tabs ::v-deep .el-tabs__item.is-top {
            margin-left: 14px;
            color: #387dee;
            border-bottom: 2px solid #387dee;
        }

        .task-status {
            padding-right: 30px;
            box-sizing: border-box;
            margin: 16px 0 30px;
        }

        .task-status>div:nth-child(1) {
            // color: #fff;
            font-size: 22px;
        }

        .task-status>div:nth-child(2) {
            // color: #fff;
            font-size: 12px;
            span.one {
                color: #c0c0c0;
            }
            span.two {
                color: #fdb900;
            }
            span.three {
                color: #387dee;
            }
        }

        .label {
            width: 100px;
            font-size: 12px;
            color: #999;
            text-align: right;
            margin-right: 15px;
        }

        .label-val {
            font-size: 12px;
            // color: #fff;
        }

        .event ::v-deep .el-timeline-item__tail {
            border-left: 2px solid #387dee!important;
        }

        .event ::v-deep .el-timeline-item__icon.el-icon-circle-check {
            color: #387dee!important;
            font-size: 20px!important;
        }

        .event ::v-deep .el-timeline-item__icon.icon-circle {
            color: #387dee!important;
            font-size: 16px!important;
            font-weight: 500;
        }

        .time-box {
            width: 100%;
        }

        .time-left>h4 {
            // color: #fff;
            font-weight: 500;
        }

        .time-left>p {
            color: #999;
            font-size: 12px;
            margin-top: 5px;
        }

        .time-right>div.one {
            color: #c0c0c0;
        }

        .time-right>div.two {
            color: #fdb900;
        }

        .time-right>div.three {
            color: #387dee;
        }

        .time-right>p {
            // color: #fff;
            font-size: 12px;
            margin-top: 5px;
        }
    </style>
<style>
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
