<template>
    <div class="attck-wrap">
        <div class="ul-item" v-for="(item, key) in attckData" :key="key">
            <div class="li li-header" :class="{'br': key == attckData.length - 1}">
                <div class="header-name">{{item.name}}</div>
                <div class="header-num">{{item.child.length}}项技术</div>
            </div>
            <div class="li li-body" :class="{'br': (key == attckData.length - 1 || attckData[key + 1].child.length - 1 < childKey), 'bb': childKey == item.child.length - 1, 'bgc1': child.num >= total * 0.75, 'bgc2': (child.num >= total * 0.5 && child.num < total * 0.75), 'bgc3': (child.num >= total * 0.25 && child.num < total * 0.5), 'bgc4': (child.num > 0 && child.num < total * 0.25), 'bgdef': total == 0, 'pointer': child.num != 0}" v-for="(child, childKey) in item.child" :key="childKey" @click="checkList(child)">
                <div>{{child.name}} {{child.num == 0 ? '' : child.num}}</div>
            </div>
        </div>
    </div>
</template>

<script>
// import { addReport, getAlarmType, getAlarmWorkMould } from '@/server/alarm/alarm.js'
export default {
    name: 'Attck',
    components: {

    },
    props: {
        attckData: {
            type: Array,
            default() {
                return []
            }
        },
        total: {
            type: Number,
            default() {
                return 0
            }
        }
    },
    watch: {
        alarmDialog(newVal, oldVal) {
            if (!newVal) {
                this.$refs.addForm.resetFields()
            } else {
                this.getAlarmTypeData()
                this.getAlarmWorkMouldData()
            }
        }
    },
    mounted() {
    },
    data() {
        return {}
    },
    computed: {},
    methods: {
        checkList(data) {
            if (data.num == 0) return
            this.$emit('switchList', data)
        }
    }
}
</script>

<style scoped lang="scss">
    .bgc1 {
        background-color: #AF0038 !important;
        color: #fff!important;
    }
    .bgc2 {
        background-color: #DA2104 !important;
        color: #fff!important;
    }
    .bgc3 {
        background-color: #FF3F3F !important;
        color: #fff!important;
    }
    .bgc4 {
        background-color: #FF9292 !important;
        color: #fff!important;
    }
    .bgdef {
        background-color: #fff!important;
        color: #000000!important;
    }
    .attck-wrap {
        display: flex;
        background: #FBFBFB;
        .ul-item {
            flex: 1;
            .li {
                min-width: 80px;
                height: 60px;
                border: 1px solid #dddddd;
                text-align: center;
                padding: 0 8px;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .li-header {
                font-size: 12px;
                flex-direction: column;
                border-bottom: none;
                border-right: none;
                background-color: rgba(0,82,217,.1);
                .header-name {
                    color: #496573;
                }
                .header-num {
                    color: #496573;
                    font-weight: 600;
                }
            }
            .li-body {
                color: #000000;
                font-size: 12px;
                border-bottom: none;
                border-right: none;
                background-color: #fff;
            }
            .br {
                border-right: 1px solid #dddddd;
            }
            .bb {
                border-bottom: 1px solid #dddddd;
            }
            .pointer {
                cursor: pointer;
            }
        }
    }
</style>
