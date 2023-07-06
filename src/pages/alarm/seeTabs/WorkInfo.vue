<template>
    <div class="container">
        <el-descriptions size="mini" title="" :column="2" border>
            <el-descriptions-item label="工单编号">{{ workFlowInfo.field.workOrderId }}</el-descriptions-item>
            <el-descriptions-item label="工单名称">{{ workFlowInfo.field.workOrderName }}</el-descriptions-item>
            <el-descriptions-item label="工单模板">{{ workFlowInfo.field.workMouldName }}</el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ workFlowInfo.field.createTime }}</el-descriptions-item>
            <el-descriptions-item label="优先级">
                <span v-if="workFlowInfo.field.level==1" style="color:#ff0000;">{{workFlowInfo.field.level|getLevel}}</span>
                <span v-else-if="workFlowInfo.field.level==2" style="color:#ffdd00;">{{workFlowInfo.field.level|getLevel}}</span>
                <span v-else style="color:#00e1fd;">{{workFlowInfo.field.level|getLevel}}</span>
            </el-descriptions-item>
            <el-descriptions-item label="工单状态">{{ workFlowInfo.field.status|getTaskStatus }}</el-descriptions-item>
            <el-descriptions-item label="创建人">{{ workFlowInfo.field.createUserName }}</el-descriptions-item>
            <el-descriptions-item label="当前节点">{{ workFlowInfo.field.runningNodeName|getRunningNodeName }}</el-descriptions-item>
            <el-descriptions-item label="当前节点状态" :span="2">
                <span v-if="workFlowInfo.field.currentNodeStatus==='待处理'" style="color:#ffba00;">{{workFlowInfo.field.currentNodeStatus}}</span>
                <span v-if="workFlowInfo.field.currentNodeStatus==='已超时'" style="color:#ff00e4;">{{workFlowInfo.field.currentNodeStatus}}</span>
                <span v-if="workFlowInfo.field.currentNodeStatus==='已撤销'" style="color:#ccc;">{{workFlowInfo.field.currentNodeStatus}}</span>
                <span v-if="workFlowInfo.field.currentNodeStatus==='已完成'" style="color:lightgreen;">{{workFlowInfo.field.currentNodeStatus}}</span>
            </el-descriptions-item>

        </el-descriptions>
    </div>
</template>

<script>
export default {
    name: 'WorkInfo',
    props: {
        workFlowInfo: {
            field: {}
        }
    },
    filters: {
        getLevel(level) {
            if (level == 1) {
                return '高'
            } else if (level == 2) {
                return '中'
            } else if (level == 3) {
                return '低'
            }
        },
        getTaskStatus(status) {
            if (status == 0 && status !== '') {
                return '已撤销'
            } else if (status == 1) {
                return '进行中'
            } else if (status == 3) {
                return '已完成'
            } else {
                return ''
            }
        },
        getRunningNodeName(arr) {
            if (arr && arr.length > 0) {
                return arr.join(',')
            } else {
                return ''
            }
        }
    }
}
</script>

<style scoped lang="scss">
.container {
    margin-bottom: 20px;
}
.container ::v-deep .el-descriptions__body .el-descriptions__table {
    border-radius: 4px;
}
.black-theme .container ::v-deep .el-descriptions__body {
    background: #033254;
    color: #fff;
}
.black-theme .container ::v-deep .el-descriptions-item__label.is-bordered-label {
    background: #00466d;
    color: #fff;
    box-shadow: inset 0px 0px 2px rgba(0, 186, 255, 0.73);
}
.container ::v-deep .el-descriptions-item__label.is-bordered-label {
    width: 100px;
}
.black-theme .container ::v-deep .el-descriptions .is-bordered .el-descriptions-item__cell {
    border: 1px solid #1a5c92;
}
.black-theme .container ::v-deep .el-descriptions-row {
    box-shadow: inset 0px 0px 6px 0px
    rgba(0, 186, 255, 0.73),
    inset 0px -1px 0px 0px
    rgba(40, 82, 124, 0.5) !important;
}
</style>
