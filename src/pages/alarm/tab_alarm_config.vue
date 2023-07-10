<template>
    <div class="list">
        <div class="w100">
            <div class="tab-button ub" style="background:#fff;padding:0 10px;border: 1px solid #DADEE8;border-bottom:none">
                <div class="draft-btn" v-for=" (item,index) in types" :key="index" @click="tabClick(item,index)" :class="{ 'tab-active': item.isActive }">
                    {{item.name}}
                </div>
            </div>
            <div class="w100 components" style="margin-top:-2px">
                <component :type="type" v-bind:is="currentTabComponent"></component>
            </div>

        </div>
    </div>
</template>

<script>
import attack_results from './attack_results'
import alarm_type_config from './alarm_type_config'
import alarm_config from './alarm_config'
import alarm_rules from './alarm_rules'
import auto_work_order from './auto_work_order'
export default {
    name: 'TabAlarmConfig',
    mixins: [],
    components: { attack_results, alarm_type_config, alarm_config, alarm_rules, auto_work_order },
    data() {
        return {
            types: [
                {
                    id: 1,
                    name: '攻击结果',
                    isActive: true,
                    component: 'attack_results'
                },
                {
                    id: 2,
                    name: '事件类型',
                    isActive: false,
                    component: 'alarm_type_config'
                },
                {
                    id: 3,
                    name: '外发/提示音',
                    isActive: false,
                    component: 'alarm_config'
                },
                {
                    id: 4,
                    name: '事件归并规则',
                    isActive: false,
                    component: 'alarm_rules'
                },
                {
                    id: 5,
                    name: '自动工单配置',
                    isActive: false,
                    component: 'auto_work_order'
                }
            ]
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
    margin-bottom: 2px;
    background-color: rgba(19, 109, 172, 0.2);
    border-radius: 4px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;

    & div {
        padding: 0 10px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        margin-right: 10px;
        cursor: pointer;
        border-radius: 2px;
        background-size: 100%;
        color: rgba(0,0,0,.6);
        box-sizing: border-box;
        font-size: 14px;

        &.tab-active {
            background-size: 100%;
            border-bottom: 1px solid #266fe8;
            color: #266fe8;
        }
    }
}

</style>
