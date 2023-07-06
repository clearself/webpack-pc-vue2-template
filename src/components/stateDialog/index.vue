<template>
    <el-dialog
        title=""
        custom-class="delete"
        :show-close="false"
        :visible.sync="dialogVisible"
        :append-to-body="true"
        width="380px">
        <div class="ub ub-ver ub-ac">
            <p class="title">{{title}}</p>
            <p class="text">{{text}}</p>
        </div>
        <span slot="footer" class="dialog-footer ub ub-pc">
            <el-button size="small" @click="emitCancel">取 消</el-button>
            <el-button style="margin-left: 72px" size="small" type="primary" @click="emitDelete">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    name: 'StateDialog',
    props: {
        dialogVisible: {
            default: true
        },
        title: {
            default: '是否开启任务？'
        },
        text: {
            default: ''
        }
    },
    methods: {
        emitCancel() {
            this.$emit('cancel')
        },
        emitDelete() {
            this.$emit('delete')
        }
    }
}
</script>

<style scoped lang="scss">
.title {
    color: #266FE8;
    font-size: 16px;
    height: 24px;
    line-height: 24px;
    margin-bottom: 16px;
}
.text {
    color: rgba(0, 0, 0, 0.6);
    font-size: 12px;
    height: 20px;
    line-height: 20px;
}
</style>
<style lang="scss">
.delete {
    .el-dialog__header {
        background-color: #fff;
    }
    .el-dialog__body {
        min-height: auto;
    }
}
</style>
