<template>
    <div class="wrapper">
        <div class="title ub ub-pj">
            <p>TOP10</p>
            <div class="rank-btn ub ub-pe">
                <p class="ub ub-ac" @click="ascending">
                    <i class="sort iconfont icon-shengxu" :class="{active: order === 'asc'}"></i>
                    <span>升序</span>
                </p>
                <p class="ub ub-ac" @click="descending">
                    <i class="sort iconfont icon-jiangxu" :class="{active: order === 'desc'}"></i>
                    <span>降序</span>
                </p>
            </div>
        </div>
        <div
            v-if="!rankData.length"
            v-loading="topLoading"
            element-loading-text="加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.05)"
            class="loading-text ub ub-pc ub-ac">
            <p v-if="!topLoading">暂无数据</p>
        </div>
        <el-popover
            placement="bottom"
            popper-class="add-search"
            title=""
            width="200"
            trigger="click"
            v-model="item.visible"
            v-for="(item,index) in rankData"
            :key="index"
        >
            <div>
                <p class="ub ub-ac click-btn" @click="equalVal(item)">
                    <i class="el-icon-plus"></i>
                    <span>{{elementData.name}}</span>
                    <span>&nbsp;=&nbsp;</span>
                    <span class="val">{{item[elementData.fieldName]}}</span>
                </p>
                <p class="ub ub-ac click-btn" style="margin: 10px 0" @click="unequalVal(item)">
                    <i class="el-icon-plus"></i>
                    <span>{{elementData.name}}</span>
                    <span>&nbsp;!=&nbsp;</span>
                    <span class="val">{{item[elementData.fieldName]}}</span>
                </p>
                <p
                    @click="item.visible = false"
                    class="ub ub-ac click-btn"
                    v-clipboard:copy="item.value"
                    v-clipboard:success="firstCopySuccess"
                    v-clipboard:error="firstCopyError">
                    <i class="el-icon-document-copy"></i>
                    <span>复制</span>
                </p>
            </div>
            <Prcess
                :chart-data="{value: item[elementData.fieldName], percent: (item.num*100/item.total).toFixed(2)}"
                slot="reference"></Prcess>
        </el-popover>

    </div>
</template>

<script>
import VueClipBoard from 'vue-clipboard2'
import Prcess from '@/components/prcess'
import EventBus from '@/assets/js/bus'
export default {
    name: 'RankChart',
    components: {
        Prcess
    },
    props: ['rankData', 'elementData', 'topLoading'],
    data() {
        return {
            order: 'desc' // asc
        }
    },
    methods: {
        /* 升序*/
        ascending() {
            if (this.order === 'asc') return
            this.order = 'asc'
            EventBus.$emit('getTopField', {
                fields: [this.elementData.fieldName],
                orderType: 'asc'
            })
            EventBus.$emit('getTopFieldTwo', {
                fields: [this.elementData.fieldName],
                orderType: 'asc'
            })
        },
        /* 降序*/

        descending() {
            if (this.order === 'desc') return
            this.order = 'desc'
            EventBus.$emit('getTopField', {
                fields: [this.elementData.fieldName],
                orderType: 'desc'
            })
            EventBus.$emit('getTopFieldTwo', {
                fields: [this.elementData.fieldName],
                orderType: 'desc'
            })
        },
        equalVal(item) {
            item.visible = false
            let data = {
                origin: [{ connect: 'and', children: [{ field: this.elementData.fieldName, operator: '=', value: item[this.elementData.fieldName], dataType: 1, attrType: this.elementData.type }] }],
                msg: `((${this.elementData.name} = ${item[this.elementData.fieldName]}))`,
                id: Date.now() + Math.random()
            }
            EventBus.$emit('addEqualCondition', data)
        },
        unequalVal(item) {
            item.visible = false
            let data = {
                origin: [{ connect: 'and', children: [{ field: this.elementData.fieldName, operator: '!=', value: item[this.elementData.fieldName], dataType: 1, attrType: this.elementData.type }] }],
                msg: `((${this.elementData.name} != ${item[this.elementData.fieldName]}))`,
                id: Date.now() + Math.random()
            }
            EventBus.$emit('addUnequalCondition', data)
        },

        firstCopySuccess(e) {
            console.log('copy arguments e:', e)
            this.$message.success('复制成功')
        },
        firstCopyError(e) {
            console.log('copy arguments e:', e)
            this.$message.error('复制失败')
        }
    }

}
</script>

<style scoped lang="scss">
.wrapper {
    width: 170px;
    font-size: 12px;
    .title {
       color: rgba(0, 0, 0, 0.9);
        margin-bottom: 10px;
        .rank-btn p{
            cursor: pointer;
            margin-left: 10px;
            font-size:12px;
            span {
                color: #c0c0c0;
            }
            i {
                color: #c0c0c0;
                margin-right: 2px;
                font-size:12px;
            }
            i.active {
                color: #0052d9;
            }
            i.active + span{
                color: #0052d9;
            }
        }
    }
    & ::v-deep .el-loading-spinner .el-loading-text {
        color: rgba(0,0,0,.4) !important;
    }
}
.loading-text {
    width: 180px;
    height: 200px;
    background: rgba(0, 0, 0, 0.05);
    color: rgba(0,0,0,.4) !important;
}

</style>
<style lang="scss" scoped>
.click-btn {
    cursor: pointer;
    font-size: 12px;
    i {
        margin-right: 5px;
        color: #0052D9;
    }
    span.val {
        color: #0052D9;
    }
}
.click-btn:hover {
    background: #0d4873;
}
</style>

