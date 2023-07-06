<template>
    <div class="wrapper ub w100">
        <div class="search-left ub ub-as ub-f1" :class="{'fold': isOpen}">
            <el-row ref="search-left" :gutter="20" class="w100">
                <slot></slot>
            </el-row>
        </div>
        <div class="search-right ub ub-pe ub-as">
            <div class="ub ub-pe" style="margin-top: 4px;margin-right: 10px;width: 70px;">
                <div v-if="hasMore">
                    <span v-show="isOpen" class="more-search-text" @click="emitIsopen1()" style="cursor: pointer;font-size: 12px;">收起<i style="margin-left: 3px;" class="el-icon-arrow-up"></i></span>
                    <span v-show="!isOpen" class="more-search-text" @click="emitIsopen2()" style="cursor: pointer;font-size: 12px;">更多搜索<i style="margin-left: 3px;" class="el-icon-arrow-down"></i></span>
                </div>
            </div>
            <div class="ub btn">
                <el-button class="reset-btn" v-if="hasReset" style="color: rgb(0 0 0 / 40%);" size="small" @click="emitReset">重 置</el-button>
                <el-button v-if="hasSearch" size="small" type="primary" @click="emitSearch" class="search">搜 索</el-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SearchTop',
    props: {
        hasReset: {
            default: true
        },
        hasSearch: {
            default: true
        }
        // hasMore: {
        //     default: false
        // }
    },
    data() {
        return {
            hasMore: false,
            isOpen: false,
            elementNum: 0,
            timer: null
        }
    },
    computed: {

    },
    mounted() {
        let that = this
        this.$nextTick(() => {
            this.judgeHeight()
            window.addEventListener('resize', this.judgeHeight)
        })
    },
    methods: {
        emitIsopen1() {
            this.isOpen = false
            this.$emit('isOpen', this.isOpen)
        },
        emitIsopen2() {
            this.isOpen = true
            this.$emit('isOpen', this.isOpen)
        },
        emitSearch() {
            this.$emit('search')
        },
        emitReset() {
            this.$emit('reset')
        },
        judgeHeight() {
            if (this.timer) {
                clearTimeout(this.timer)
            }
            let that = this
            this.timer = setTimeout(() => {
                try {
                    let h = that.$refs['search-left'].$el
                    if (h && h.clientHeight > 50) {
                        that.hasMore = true
                    } else {
                        that.hasMore = false
                    }
                    this.timer = null
                } catch (e) {
                    // console.log(e)
                }
            }, 100)
        }
    }
}
</script>

<style scoped lang="scss">
.custom-default {
    .search {
        // background:#0052d9;
        // border:1px solid #0052d9;
    }
}
.custom-dark {
    .search {
        background: #2a3142;
    }
}
.custom-purple {
    .search {
        background: #7d55f8;
    }
}
.more-search-text {
    // color: $high-color;
    color: rgb(0 0 0 / 40%);
}
.wrapper {
    padding: 16px 10px 0;
    border: 1px solid #dadee8;
    border-radius: 4px;
    background-color: #ffffff;
    box-shadow: 0 0 8px rgb(140 152 164 / 20%);
    box-sizing: border-box;
    &::v-deep .el-form-item__label,
    &::v-deep .el-form-item__content {
        line-height: 32px;
        font-size: 12px;
    }
    &::v-deep .el-input__inner {
        font-size: 12px;
        &::placeholder {
            font-size: 12px;
        }
    }
    .el-range-editor--small .el-range-input {
        font-size: 12px;
    }
}
.search-left {
    overflow: hidden;
    height: 46px;
    & ::v-deep .el-form-item {
        margin-bottom: 16px !important;
    }
}
.search-left.fold {
    overflow: inherit;
    height: auto;
}
.custom-star #app {
    .wrapper {
        border: 1px solid #1cd7fa;
        border-radius: 4px;
        background-color: rgba(0 0 0 / 40%);
        box-shadow: 0 0 7px inset #389bf7;
    }
    .more-search-text {
        color: rgba(255 255 255 / 80%);
    }
    .reset-btn {
        border: 1px solid #39caf3;
        background: transparent;
        box-shadow: 0 0 10px inset rgba(0 167 255.9);
        ::v-deep span {
            color: #a2ceec!important;
        }
    }
}

</style>
