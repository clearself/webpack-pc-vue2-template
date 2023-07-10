<template>
    <div class="wrapper ub w100">
        <div class="search-left ub ub-as ub-f1" :class="{'fold': isOpen}">
            <el-row ref="search-left" :gutter="20" class="w100">
                <slot></slot>
            </el-row>
        </div>
        <div class="search-right ub ub-pe ub-as">
            <div class="ub ub-pe" style="width:70px;margin-right: 10px;margin-top:4px;">
                <div v-if="hasMore">
                    <span v-show="isOpen" class="more-search-text" @click="emitIsopen1()" style="cursor: pointer;font-size:12px;">收起<i style="margin-left: 3px;" class="el-icon-arrow-up"></i></span>
                    <span v-show="!isOpen" class="more-search-text" @click="emitIsopen2()" style="cursor: pointer;font-size:12px;">更多搜索<i style="margin-left: 3px;" class="el-icon-arrow-down"></i></span>
                </div>
            </div>
            <div class="ub btn">
                <el-button v-if="hasReset" style="color: rgba(0, 0, 0, 0.4)" size="small" @click="emitReset">重 置</el-button>
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

<style lang="scss">
.wrapper.seaTopBox .el-form-item__label{
    line-height: 38px !important;
}
</style>

<style scoped lang="scss">
.custom-default{
    .search{
        // background:#0052d9;
        // border:1px solid #0052d9;
    }
}
.custom-dark{
    .search{
        background:#2a3142;
    }
}
.custom-purple{
    .search{
        background:#7d55f8;
    }
}
.more-search-text {
    // color: $high-color;
    color:rgba(0,0,0,0.4);
}
.wrapper {
    background-color: #fff;
    padding: 16px 10px 0px;
    border-radius: 4px;
    box-shadow: 0px 0px 8px rgba(140,152,164,.2);
    border: 1px solid #DADEE8;
    box-sizing: border-box;
    &::v-deep .el-form-item__label,
    &::v-deep .el-form-item__content {
        line-height: 32px;
        font-size: 12px;
    }
    &::v-deep .el-input__inner{
        font-size: 12px;
        &::placeholder {
            font-size: 12px;
        }
    }
    .el-range-editor--small .el-range-input {
        font-size: 12px;
    }

}
.search-left{
    height: 46px;
    overflow: hidden;
    & ::v-deep .el-form-item {
        margin-bottom: 16px !important;
    }
}
.search-left.fold{
    height: auto;
    overflow: inherit;
}
</style>
