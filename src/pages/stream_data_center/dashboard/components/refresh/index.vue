<template>
    <div class="refresh" ref="selfRefresh" style="margin-top:-5px">
        <el-select class="custom-select dashboard-select" size="small" v-model="refreshData" placeholder="请选择" @change="selectChange" @visible-change="visibleChange" popper-class="refresh-select">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
        </el-select>
        <div class="custom" v-if="customShow">
            <div class="title">自定义</div>
            <div class="title-two">开始</div>
            <div class="ub input">
                <el-input-number :min="minData" size="mini" style="width:83px" v-model="actualTime" placeholder="请输入" :controls="false"></el-input-number>
                <el-select size="mini" style="width:76px" v-model="timeUnit" placeholder="请选择" @change="unitChange">
                    <el-option
                        v-for="item in timeUnitList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>

            </div>
            <div style="color: rgba(0, 0, 0, 0.8);width: 159px;margin-bottom: 30px">说明：当单位选择秒时最少可选择30秒，当单位选择分钟时最多可选择60分钟，当单位选择小时时最多可选择24小时</div>
            <el-button  style="margin-left:100px" size="mini" type="primary" @click="use">应 用</el-button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Refresh',
    components: {},
    data() {
        return {
            minData: 0,
            customShow: false,
            actualTime: '',
            timeUnit: 0,
            refreshData: 1,
            timeUnitList: [
                {
                    value: 0,
                    label: '秒'
                },
                {
                    value: 1,
                    label: '分钟'
                },
                {
                    value: 2,
                    label: '小时'
                }
            ],
            options: [
                {
                    value: 0,
                    label: '不刷新'
                },
                {
                    value: 1,
                    label: '刷新（1分钟）'
                },
                {
                    value: 2,
                    label: '刷新（5分钟）'
                },
                {
                    value: 3,
                    label: '刷新（15分钟）'
                },
                {
                    value: 4,
                    label: '刷新（30分钟）'
                },
                {
                    value: 5,
                    label: '刷新（1小时）'
                },
                {
                    value: 6,
                    label: '刷新（2小时）'
                },
                {
                    value: 7,
                    label: '刷新（12小时）'
                },
                {
                    value: 8,
                    label: '刷新（24小时）'
                },
                {
                    value: 9,
                    label: '自定义'
                }
            ]
        }
    },
    mounted() {
        this.setMinData()
    },
    created() {
        document.addEventListener('click', e => {
            if (this.$refs.selfRefresh) {
                let isSelf = this.$refs.selfRefresh.contains(e.target)
                if (!isSelf) {
                    this.customShow = false
                }
            }
        })
    },
    methods: {
        setMinData() {
            if (this.timeUnit === 0) {
                this.minData = 30
            } else {
                this.minData = 0
            }
        },
        unitChange(val) {
            if (val === 0) {
                this.minData = 30
                this.actualTime = 30
            } else if (val === 1) {
                this.minData = 1
                this.maxData = 60
                this.actualTime = 60
            } else if (val === 2) {
                this.minData = 1
                this.maxData = 24
                this.actualTime = 24
            }
        },
        visibleChange(val) {
            if (val) {
                // this.customShow = false
                if (this.refreshData === 9) {
                    this.customShow = true
                } else {
                    this.customShow = false
                }
            } else {
                if (this.refreshData !== 9) {
                    this.customShow = false
                }
            }
        },
        use() {
            if (this.actualTime) {
                let data = `${this.actualTime}${this.unitText(this.timeUnit)}`
                let obj = [{
                    actualTime: this.actualTime,
                    timeUnit: this.timeUnit
                }]
                this.refreshData = data
                this.customShow = false
                this.$emit('selectChange', obj)
            }
        },
        unitText(val) {
            if (val === 0) {
                return '秒'
            } else if (val === 1) {
                return '分钟'
            } else if (val === 2) {
                return '小时'
            } else if (val === 3) {
                return '天'
            }
        },
        selectChange(val) {
            this.$emit('selectChange', val)
            if (val === 9) {
                this.customShow = true
            }
        }
    }

}
</script>

<style lang="scss" scoped>
.refresh {
    ::v-deep .el-input-number {
        line-height: 24px !important;
    }
    .custom-select {
        position: relative;
        ::v-deep .el-input__inner{
            border: none !important;
            // border:0px !important;
            box-shadow: none !important;
            // background-color: rgba(28, 215, 250, 0.2) !important;
            height:24px !important;
        }
        ::v-deep .el-input__icon {
            // height:24px !important;
            // line-height:24px !important;
        }
    }
    .dashboard-select {
        ::v-deep .el-input__inner {
            border: none;
            box-shadow: none;
            text-align: right;
            color: rgba(0,0,0,0.4);
            width: 140px;
            margin-top: 6px;
        }
        ::v-deep .el-input__suffix{
            top:5px !important;
        }
    }
    .custom {
        z-index: 1000;
        position: absolute;
        // top: 168px;
        // left: 253px;
        width: 180px;
        height: 260px;
        padding: 14px 0 0 10px;
        box-sizing: border-box;
        background-color: #fff;
        border-radius: 2px;
        border: solid 1px #dcdcdc;
        font-size: 12px;
        margin-top: 2px;
        box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
        // box-shadow: 0px 0px 10px 0p#000000,inset 0px 0px 6px 0px rgba(0, 186, 255, 0.73),inset 0px -1px 0px 0px rgba(40, 82, 124, 0.5);
        .title {
            color: #0052d9;
            margin-bottom: 36px;
        }
        .title-two {
            color: rgba(0, 0, 0, 0.9);
            margin-bottom: 6px;
        }
        .input {
            margin-bottom: 10px
            // margin-bottom: 106px;
        }
    }
    .btn_box {
        margin-left: 100px !important;
    }
    ::v-deep .el-input--mini .el-input__inner {
        height: 24px;
        line-height: 24px;
        // background: transparent;
        // border: 1px solid #00ffe4;
        // box-shadow: 0px 0px 7px #389bf7 inset;
        // color: #fff;
        font-size: 12px !important;
        border-radius: 2px 0 0 2px;
        border-right: hidden;
    }
    ::v-deep  .el-select--mini .el-input__inner {
        // color: #00ffe4;
        border-radius: 0 2px 2px 0;
        // border-right: 1px solid #00ffe4;
    }
    ::v-deep .el-select .el-input .el-select__caret {
        // color: #00ffe4;
        font-size: 12px;
    }
}

</style>
<style lang="scss">
.refresh-select {
    width: 180px !important;
    margin-top: 2px;
}
</style>

