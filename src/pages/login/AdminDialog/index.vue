<template>
    <el-dialog
        title=""
        custom-class="admin-dialog"
        :show-close="false"
        :visible.sync="dialogVisible"
        :modal="false"
        top="40vh"
        width="380px">
        <div class="ub ub-ver ub-ac">
            <p class="title">{{title}}</p>
            <p class="text">请联系管理员：{{text}}</p>
        </div>
        <span slot="footer" class="dialog-footer ub ub-pc">
            <!--<el-button size="small" @click="emitCancel">取 消</el-button>-->
            <el-button  size="small" type="danger" @click="emitSure">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    name: 'AdminDialog',
    props: {
        dialogVisible: {
            default: true
        },
        title: {
            default: '账号申诉'
        },
        text: {
            default: '13845123XXX'
        }
    },
    methods: {
        emitCancel() {
            this.$emit('cancel')
        },
        emitSure() {
            this.$emit('sure')
        }
    }
}
</script>

<style scoped lang="scss">
$blue: #387dee;
.title {
    color: $blue;
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
<style>
.admin-dialog .el-dialog__body {
    padding: 0 20px 20px;
}
</style>
