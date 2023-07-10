<template>
    <div class="wrapper">
        <div class="ub ub-ac">
            <p class="filter-title" style="color: rgba(0, 0, 0, 0.9);font-size: 12px;margin-top: -10px;margin-left: 0px;margin-right: 9px">过滤条件:</p>
            <div class="condition-item ub ub-pj ub-ac" v-for="(item, index) in conditionData" :key="index">
                <p @click.stop="showCondition(item)">{{item.msg}}</p>
                <i class="el-icon-close"  @click.stop="deleteCondition(index)"></i>
            </div>
            <div class="add-btn ub ub-ac"  @click="addCondition">
                <i class="el-icon-plus"></i>
                <p>添加过滤条件</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'FilterCondition',
    props: {
        conditionData: {
            default() {
                return []
            }
        },
        isDrawer: {
            default() {
                return false
            }
        }
    },
    methods: {
        addCondition() {
            if (this.isDrawer) {
                this.$parent.$parent.conditionShow = true
                this.$parent.recordId = ''
            } else {
                this.$parent.conditionShow = true
                this.$parent.recordId = ''
                this.$forceUpdate()
            }
        },
        deleteCondition(index) {
            if (this.isDrawer) {
                this.$parent.$parent.conditionData.splice(index, 1)
            } else {
                this.$parent.conditionData.splice(index, 1)
            }
        },
        showCondition(item) {
            if (this.isDrawer) {
                this.$parent.$parent.treeData = this.$lodash.cloneDeep(item.origin)
                this.$parent.$parent.conditionShow = true
                this.$parent.$parent.recordId = item.id
            } else {
                this.$parent.treeData = this.$lodash.cloneDeep(item.origin)
                this.$parent.conditionShow = true
                this.$parent.recordId = item.id
            }
        }
    }
}
</script>

<style scoped lang="scss">
.wrapper {
    color: #fff;
    // margin-top: 10px;
    &>div {
        flex-wrap: wrap;
    }
    i {
        font-size: 12px;
    }
}
.condition-item {
    cursor: pointer;
    height: 24px;
    line-height: 24px;
    border-radius: 4px;
    box-sizing: border-box;
    border: 1px solid #dcdcdc;
    padding: 0 10px;
    margin-right: 10px;
    margin-bottom: 10px;
    opacity: .8;
    transition: opacity .1s;
    color: rgba(0, 0, 0, 0.9);
    font-size: 12px;

    p {
        max-width: 200px;
        height: 24px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space:nowrap;
    }

    i {
        // margin-left: 20px;
    }
    i:hover {
        color: #1cd7fa;
    }

}
.condition-item:hover {
    opacity: 1;
}
.add-btn {
    cursor: pointer;
    height: 24px;
    line-height: 24px;
    border-radius: 4px;
    box-sizing: border-box;
    border: 1px solid #dcdcdc;
    padding: 0 10px;
    margin-right: 10px;
    margin-bottom: 10px;
    color: rgba(0, 0, 0, 0.4);
    font-size: 12px;

    i {
        margin-right: 4px;
    }
}

</style>

