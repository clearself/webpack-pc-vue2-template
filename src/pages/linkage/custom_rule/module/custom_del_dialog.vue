<template>
    <DeleteDialog
        :dialogVisible="deleteDialog"
        @delete="handleDeleteFun"
        @cancel="deleteDialog = false">
    </DeleteDialog>
</template>

<script>
import { delCustomRule } from '@/server/linkage/custom_rule'
export default {
    name: 'DelDialog',
    data() {
        return {
            deleteDialog: false,
            deleteId: ''
        }
    },
    watch: {},
    methods: {
        handleDeleteFun() {
            let data = {
                queryData: {},
                paramsData: {
                    ids: [this.deleteId]
                }
            }
            delCustomRule(data)
                .then(res => {
                    this.deleteDialog = false
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    })
                    setTimeout(() => {
                        this.$emit('handleConfirm')
                    }, 1500)
                })
                .catch(error => {
                    this.deleteDialog = false
                    console.log(error + 'error')
                })
        }
    }
}
</script>

<style></style>
