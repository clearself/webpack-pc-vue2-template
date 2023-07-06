<template>
    <div class="event">
        <CustomDate @getTime="getTime" />
        <Refresh @selectChange="selectChange" />
        <Alarm :alarm-dialog="alarmDialog" :row-data="rowData" ref="drawerRef"></Alarm>
        <HistoryRecord :record-dialog='recordDialog' ref="historyRecordRef"></HistoryRecord>
        <OffLineTask :task-dialog="taskDialog" ref="offLineTask"></OffLineTask>
        <CustomTransfer :transfer-dialog="transferDialog"></CustomTransfer>
        <el-button @click="handAlarm">发起事件</el-button>
        <el-button @click="handRecord">历史查询记录</el-button>
        <el-button @click="handTask">离线任务查询</el-button>
        <el-button @click="handTransfer">穿梭框</el-button>
        <CustomSearch />
        <ConditionRules
            :event-type="eventType"
            :operator-options="operatorOptions"
            :test-data="testData"
            :treeData="treeData" />
        <button @click="print">打印数据</button>
        <TableChart style="width: 100%;height: 440px"></TableChart>
        <RankChart :rank-data="rankData" style="margin-top: 100px"></RankChart>
        <ProgressBar></ProgressBar>
        <FilterCondition></FilterCondition>
    </div>
</template>

<script>
import CustomTransfer from './components/custom_transfer/index.vue'
import OffLineTask from './components/off_line_task/index.vue'
import HistoryRecord from './components/history_record/index.vue'
import CustomDate from './components/custom_date/index.vue'
import Refresh from './components/refresh/index.vue'
import Alarm from './components/alarm/index.vue'
import CustomSearch from './components/custom_search/index.vue'
import ConditionRules from '@/pages/data_manage/new_search/components/ConditionRules'
import TableChart from '@/pages/data_manage/new_search/components/chart/TableChart'
import RankChart from '@/pages/data_manage/new_search/components/chart/RankChart'
import ProgressBar from '@/pages/data_manage/new_search/components/chart/ProgressBar'
import FilterCondition from '@/pages/data_manage/new_search/components/FilterCondition'
export default {
    name: 'Demo',
    components: {
        CustomDate,
        Refresh,
        ConditionRules,
        TableChart,
        RankChart,
        ProgressBar,
        Alarm,
        CustomSearch,
        HistoryRecord,
        OffLineTask,
        FilterCondition,
        CustomTransfer
    },
    data() {
        return {
            transferDialog: false,
            taskDialog: false,
            recordDialog: false,
            alarmDialog: false,
            treeData: require('./components/treeData.js').treeData,
            eventType: 'AlarmEvent',
            operatorOptions: [
                { label: '=', value: '=' },
                { label: '>', value: '>' }
            ],
            testData: require('./components/treeData.js').testData,
            rankData: [
                { value: 'port1', percent: 51 },
                { value: 'port2', percent: 52 },
                { value: 'port3', percent: 53 },
                { value: 'port4', percent: 54 },
                { value: 'port5', percent: 55 }
            ],
            rowData: {
                reportName: '事件名字1'
            }
        }
    },
    methods: {
        handTransfer() {
            this.transferDialog = true
        },
        handTask() {
            this.taskDialog = true
        },
        handAlarm() {
            // this.rowData = {
            //     reportName: '事件名字1'
            // }
            // this.alarmDialog = true
        },
        handRecord() {
            this.recordDialog = true
        },
        selectChange(val) {
            console.log('刷新', val)
        },
        getTime(val) {
            console.log('时间', val)
        },
        print() {
            console.log(this.treeData)
        }
    }
}
</script>

<style scoped>

</style>
