<template>
    <el-dialog title="自定表头" :visible.sync="transferDialog" width="700px" custom-class="common-dialog" :before-close="cancel" :append-to-body="true">
        <div class="content" style="width:100%;">
            <MyTransfer v-model="selectData" :inputList="listAll" :alias="{key: 'fieldId',label: 'name'}"></MyTransfer>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="cancel">取消</el-button>
            <el-button size="small" type="primary" @click="handleQuery">确认</el-button>
        </span>
    </el-dialog>
</template>

<script>
import MyTransfer from './myTransfer.vue'
export default {
    name: 'CustomTransfer',
    props: {
        transferDialog: {
            type: Boolean,
            default: false
        },
        listAll: {
            type: Array,
            default() {
                return []
            }
        },
        list: {
            type: Array,
            default() {
                return []
            }
        }
    },
    components: {
        MyTransfer
    },
    watch: {
        list(newValue, oldValue) {
            this.selectData = this.list.map(it => it.fieldId)
            console.log(this.selectData)
        },
        transferDialog(newVal) {
            if (!newVal) {
                this.selectData = this.list.map(it => it.fieldId)
            }
        }
    },
    data() {
        return {
            selectData: []
        }
    },
    methods: {
        handleQuery() {
            this.$parent.editSelectFields(this.selectData)
            console.log('穿梭框', this.selectData)
        },
        cancel() {
            this.$parent.transferDialog = false
        }
    }
}
</script>

<style lang="scss">
// body .v-modal {
//     z-index: 999 !important;
// }
</style>
