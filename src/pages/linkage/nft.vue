<template>
    <div class="list">
        <div class="tab-button ub" style="background:#fff;padding:0 10px;margin:0 1px">
            <div class="draft-btn" v-for=" (item,index) in types" :key="index" @click="tabClick(item,index)" :class="{ 'tab-active': item.isActive }">
                {{item.name}}
            </div>
        </div>
        <div class="w100 components">
            <component :type="type" v-bind:is="currentTabComponent"></component>
        </div>
    </div>
</template>

<script>
import Manual from './full_flow_task/index'
import Device from './interlocking_equipment'

export default {
    name: 'NFT',
    mixins: [],
    components: { Manual, Device },
    data() {
        return {
            types: [
                /* {
                    id:0,
                    name:'自动任务',
                    isActive:true,
                    component:'Auto'
                },*/
                {
                    id: 1,
                    name: '手动任务',
                    isActive: true,
                    component: 'Manual'
                },
                {
                    id: 2,
                    name: '设备管理',
                    isActive: false,
                    component: 'Device'
                }
                // {
                //     id: 3,
                //     name: '设备监控',
                //     isActive: false,
                //     component: 'Monitor'
                // }
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
            if (this.$route.params.back) {
                this.types.forEach(it => {
                    if (it.id !== 3) {
                        it.isActive = false
                    } else {
                        it.isActive = true
                    }
                })
            }
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
        background-color: rgba(19,109,172,.2);
        margin-bottom: 2px;
        border-radius: 4px;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        & div {
            width: 80px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            margin-right: 10px;
            cursor: pointer;
            // border-radius: 2px;
            // background: url("../../assets/img/tab_btn.jpg") 100% 100% no-repeat;
            color: rgba(0,0,0,.6);
            box-sizing: border-box;
            font-size: 14px;

            &.tab-active {
                color: #387dee;
                border-bottom:1px solid #387dee;
            }
        }
    }

</style>
