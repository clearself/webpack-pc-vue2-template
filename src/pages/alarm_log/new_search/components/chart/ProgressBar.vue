<template>
    <div class="wrapper">
        <div class="ub ub-pe ub-ac bar-title">
            <p>{{ objText[status]}}</p>
            <el-tooltip v-if="status === 0" style="margin-left: 10px" class="item" effect="dark" content="暂停" placement="top">
                <i class="el-icon-video-pause" @click="pause"></i>
            </el-tooltip>
            <el-tooltip v-if="status === 2" style="margin-left: 10px" class="item" effect="dark" content="启动" placement="top">
                <i class="el-icon-video-play" @click="$parent.searchAssets()" style="margin-left: 10px"></i>
            </el-tooltip>
            <p style="margin-left: 20px"></p>
        </div>
        <el-progress
            :stroke-width="1"
            :percentage="percentage"
            :show-text="false"
            :color="customColor">
        </el-progress>
    </div>
</template>

<script>
export default {
    name: 'ProgressBar',
    props: {
        status: {
            type: Number,
            default() {
                return 1
            }
        }
    },
    data() {
        return {
            objText: {
                0: '加载中...',
                1: '加载完成',
                2: '已暂停'
            },
            percentage: 0,
            customColor: '#00baff',
            timer: null
        }
    },
    watch: {
        status(newValue, oldValue) {
            if (newValue === 1) {
                // 设置成已完成
                if (this.timer) clearInterval(this.timer)
                this.timer = null
                this.percentage = 100
            } else if (newValue === 2) {
                // 停止定时器
                if (this.timer) clearInterval(this.timer)
                this.timer = null
            }
        }
    },
    methods: {
        /**
         * Des: 继续执行
         */
        start() {
            if (this.timer) clearInterval(this.timer)
            this.timer = setInterval(() => {
                if (this.percentage < 15) {
                    this.percentage += (100 - this.percentage) * 0.005
                } else if (this.percentage < 30) {
                    this.percentage += (100 - this.percentage) * 0.007
                } else if (this.percentage < 50) {
                    this.percentage += (100 - this.percentage) * 0.008
                } else if (this.percentage < 98) {
                    this.percentage += (100 - this.percentage) * 0.01
                } else {
                    if (!this.status) {
                        if (this.timer) clearInterval(this.timer)
                        this.timer = null
                    }
                }
            }, 100)
        },

        pause() {
            if (this.timer) clearInterval(this.timer)
            if (typeof this.$parent.cancelObj.cancel === 'function') {
                this.$parent.cancelObj.cancel()
            }
            this.$parent.barStatus = 2
        },
        /**
         * Des: 重新执行
         */
        restart() {
            if (this.timer) clearInterval(this.timer)
            this.percentage = 0
            setTimeout(() => {
                this.start()
            }, 100)
        }

    },
    beforeDestroy() {
        if (this.timer) {
            clearInterval(this.timer)
            this.timer = null
        }
    }
}
</script>

<style scoped lang="scss">
.wrapper {
    & ::v-deep .el-progress-bar__outer {
        background-color: rgba(80,176,255,0.4);
        overflow: visible;
    }

    & ::v-deep .el-progress-bar__inner {
        transition: width .3s ease;
    }

    & ::v-deep .el-progress-bar__inner:after {
        position: absolute;
        content: '';
        top: -1px;
        width: 3px;
        height: 3px;
        border-radius: 50%;
        background: #fff;
        box-shadow:  0 0 2px #00e4ff;
        z-index: 99;
    }
    .bar-title {
        font-size: 12px;
        height: 23px;
        line-height: 23px;
        p {
            color: #0052d9;
        }
        & ::v-deep i {
            color: #0052d9;
            font-size: 14px;
            cursor: pointer;
        }
        & ::v-deep i:last-child {
            margin-right: 20px;
        }
    }
}

</style>
