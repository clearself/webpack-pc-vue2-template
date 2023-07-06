<template>
    <div class="event full-flow-task">
        <div class="w100">
            <div class="tab-button ub">
                <div class="draft-btn" v-for=" (item,index) in types" :key="index" @click="tabClick(item,index)" :class="{ 'tab-active': item.isActive }">
                    {{item.name}}
                </div>
                <span class="hide-total" @click="hideTotal"><i class="iconfont" :class="{'icon-tongjizhedie': !hide, 'icon-tongjizhankai': hide}"></i> {{!hide ? '折叠' : '展开'}}统计</span>
            </div>
            <div class="w100 components">
                <component ref="component" :type="type" v-bind:is="currentTabComponent"></component>
            </div>

        </div>
    </div>
</template>

<script>
import statistical_order_person from './statistical_order'
import works_order from './overview'

export default {
    name: 'TabStatistics',
    mixins: [],
    components: { statistical_order_person, works_order },
    data() {
        return {
            types: [
                {
                    id: 1,
                    name: '人员统计',
                    isActive: true,
                    component: 'statistical_order_person'
                },
                {
                    id: 2,
                    name: '工单统计',
                    isActive: false,
                    component: 'works_order'
                }
            ],
            hide: false
        }
    },
    computed: {
        currentTabComponent() {
            let component = this.types.filter(item => item.isActive)[0].component
            return component
        },
        type() {
            let component = this.types.filter(item => item.isActive)[0]
            return component.id
        }
    },
    mounted() {
        this.$nextTick(() => {
            // if(this.$route.params.back) {
            //     this.types.forEach(it => {
            //         if(it.id !== 3) {
            //             it.isActive = false
            //         } else {
            //             it.isActive = true
            //         }
            //     })
            // }
        })
    },
    methods: {
        hideTotal() {
            this.$refs.component.hide = !this.$refs.component.hide
            this.hide = this.$refs.component.hide
        },
        tabClick(item, index) {
            this.types = this.types.map(e => {
                e.isActive = false
                return e
            })
            item.isActive = true
        }
    }
}
</script>

<style lang="scss" scoped>
.tab-button {
    height: 30px;
    background-color: #fff;
    border-radius: 4px 0 0 4px;
    border-bottom: 1px solid #ddd;
    position: relative;
    & div {
        width: 80px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        cursor: pointer;
        color: rgba(0, 0, 0, 0.6);
        box-sizing: border-box;
        font-size: 14px;
        &.tab-active {
            color: #387dee;
            border-bottom: 1px solid #387dee;
        }
    }
    .hide-total {
        display: inline-block;
        position: absolute;
        right: 20px;
        height: 20px;
        line-height: 20px;
        color: #0052d9;
        font-size: 12px;
        top: 5px;
        cursor: pointer;
        .iconfont {
            font-size: 12px;
            margin-right: 4px;
        }
    }
}
</style>
