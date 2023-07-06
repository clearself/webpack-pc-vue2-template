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
import task_execution_list from './components/task_execution_list.vue'
import action_execution_list from './components/action_execution_list.vue'
import my_task from './components/my_task.vue'
import completed_task from './components/completedTask.vue'
export default {
    components: { task_execution_list, action_execution_list, my_task, completed_task },
    data() {
        return {
            types: [
                {
                    id: 1,
                    name: '任务执行列表',
                    isActive: true,
                    component: 'task_execution_list'
                },
                {
                    id: 2,
                    name: '动作执行列表',
                    isActive: false,
                    component: 'action_execution_list'
                },
                {
                    id: 3,
                    name: '我的任务',
                    isActive: false,
                    component: 'my_task'
                },
                {
                    id: 4,
                    name: '已办任务',
                    isActive: false,
                    component: 'completed_task'
                }
            ]
        }
    },
    mounted() {
        console.log(this.$route.query)
        if (this.$route.query.id) {
            // 从工作台来的
            this.types = this.types.map(e => {
                e.isActive = false
                return e
            })
            this.types.filter(i => i.id == 3)[0].isActive = true
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
    height: 32px;
    margin-bottom: 2px;
    background-color: rgba(19, 109, 172, 0.2);
    border-radius: 4px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;

    & div {
        padding: 0 10px;
        height: 32px;
        line-height: 32px;
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
    .draft-btn{
        font-size:13px !important;
    }
}

</style>
