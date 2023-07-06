<template>
    <div class="transfer">
        <el-row>
            <el-col :span="22">
                <el-transfer :titles="['未选字段', '已选字段']" class="transfer" filter-placeholder="请输入选项名称" filterable style="text-align: left; display: flex;justify-content: space-between;background-color: rgba(0,0,0,0);" v-model="outputListTemp" :data="inputList" :props="alias" target-order="push" @right-check-change="rightCheck"></el-transfer>
            </el-col>
            <el-col :span="1" style="margin-top: 150px;padding-left: 8px;">
                <div style="margin-bottom: 10px;">
                    <el-button icon="el-icon-arrow-up" circle :disabled="upDownDisable" @click="upData"></el-button>
                </div>
                <div>
                    <el-button icon="el-icon-arrow-down" circle :disabled="upDownDisable" @click="downData"></el-button>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { Message, Notification } from 'element-ui'
export default {
    name: 'MyTransfer',
    props: ['value', 'inputList', 'alias'],
    data() {
        return {
            upDownDisable: true,
            tempSelectionKeys: [],
            outputListTemp: []
        }
    },
    watch: {
        value: {
            handler(newVal, oldVal) {
                this.outputListTemp = newVal
            },
            immediate: true
        },
        outputListTemp(val) {
            this.$emit('input', val)
        }
    },
    mounted() {},
    methods: {
        rightCheck(selectionKeys, changeKeys) {
            this.tempSelectionKeys = selectionKeys
            if (selectionKeys.length > 0) {
                this.upDownDisable = false
            } else {
                this.upDownDisable = true
            }
        },
        upData() {
            if (this.tempSelectionKeys.length > 1) {
                this.$message({
                    type: 'warning',
                    message: '仅支持单选调顺序'
                })
                return
            }
            let indexNum = 0
            for (let i = 0; i < this.tempSelectionKeys.length; i++) {
                indexNum = this.outputListTemp.indexOf(this.tempSelectionKeys[i])
                if (indexNum > 0) {
                    this.outputListTemp.splice(indexNum - 1, 0, this.tempSelectionKeys[i])
                    this.outputListTemp.splice(indexNum + 1, 1)
                }
            }
        },
        downData() {
            if (this.tempSelectionKeys.length > 1) {
                this.$message({
                    type: 'warning',
                    message: '仅支持单选调顺序'
                })
                return
            }
            let indexNum = 0
            for (let i = 0; i < this.tempSelectionKeys.length; i++) {
                indexNum = this.outputListTemp.indexOf(this.tempSelectionKeys[i])
                if (indexNum > -1 && indexNum != this.outputListTemp.length - 1) {
                    this.outputListTemp.splice(indexNum + 2, 0, this.tempSelectionKeys[i])
                    this.outputListTemp.splice(indexNum, 1)
                }
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .transfer ::v-deep .el-checkbox__label{
        color:rgba(0,0,0,.9);
    }
   .transfer   :deep .el-transfer__buttons {
        padding: 150px 0px 0 0px;
        display: block;
        text-align: center;
        width: 60px;
    }

 .transfer :deep .el-transfer-panel {
    background-color: rgba(0, 0, 0, 0);
    // border-color: #1bd7fa;
    width: 300px;
    // box-shadow: inset 0px 0px 7px 0px #389bf7;
}
.transfer :deep .el-transfer-panel .el-checkbox__inner {
    height: 12px;
    width: 12px;
}
.transfer :deep .el-transfer-panel__body {
    height: 316px;
}
@media screen and (max-width: 1366px){
    .transfer :deep .el-transfer-panel__body {
        height: 216px;
    }
    .event :deep .el-transfer__buttons {
        padding: 80px 0px 0 0px;
    }
}
.transfer :deep .el-checkbox__input.is-disabled .el-checkbox__inner {
    background-color: rgba($color: #fff, $alpha: 0);
    // border-color:  rgba($color: #1bd7fa, $alpha: 0.5);
}
.transfer :deep .el-checkbox__input.is-disabled+span.el-checkbox__label {
    // color: rgba($color: #fff, $alpha: 0.5);
}
.transfer :deep .el-transfer-panel__list.is-filterable {
    height: 308px;
}

.transfer :deep .el-transfer-panel .el-transfer-panel__header {
    background-color: #ebf1f5;
    height: 30px;
    line-height: 30px;
}
.transfer :deep .el-transfer-panel__filter .el-input__inner {
    height: 30px;
}
.transfer :deep  .el-transfer-panel .el-transfer-panel__header .el-checkbox {
    line-height: 30px;
}

.transfer :deep .el-transfer-panel .el-transfer-panel__header .el-checkbox .el-checkbox__label {
    font-size: 12px;
    // color: #fff;
}

.transfer :deep .el-transfer-panel .el-transfer-panel__header .el-checkbox .el-checkbox__label span {
    // color: #fff;
}

.trans :deep .el-input__inner {
    border-radius: 4px 4px 0 0;
}

.transfer :deep .el-transfer-panel__item.el-checkbox {
    // color: #fff;
}

.transfer :deep .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #0052d9;
    border-color: #0052d9;
}

.transfer :deep .el-checkbox__input.is-checked .el-checkbox__inner:hover {
    border-color: #0052d9;
}

.transfer :deep .el-checkbox__input.is-indeterminate .el-checkbox__inner {

}

.transfer :deep .el-checkbox__input .el-checkbox__inner:hover {
    // border-color: #01d9f0;
}

.transfer :deep .el-checkbox__inner::after {
    // border-color: #01d9f0;
}

.transfer :deep .el-checkbox__input.is-checked+.el-checkbox__label {
    color: #0052d9;
}

.transfer :deep .el-input__inner,
.transfer :deep .el-textarea__inner,
.chart .el-input__inner {
    box-shadow: none;
}

.transfer :deep .el-transfer__button.is-disabled,
.transfer :deep .el-transfer__button.is-disabled:hover {
    border: 1px solid rgba(0, 0, 0, 0);
    background-color: rgba(0, 0, 0, 0);
}

.transfer :deep .el-transfer__button {
    color: #387dee;
    background-color: rgba($color: #000000, $alpha: 0);
    padding: 0;
}
.transfer :deep .el-button--primary {
    border: none;
}
</style>
