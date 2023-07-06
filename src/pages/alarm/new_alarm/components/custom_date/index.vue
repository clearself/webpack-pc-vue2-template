<template>
    <div class="custom-date">
        <el-popover
            :append-to-body="appendToBody"
            :key="123"
            popper-class="custom-date-picker"
            placement="bottom-start"
            width="672"
            trigger="click"
            @hide="popoverHide"
            @show="popoverShow"
            ref="datePopver"
        >
            <el-collapse v-model="activeName" accordion @change="selectChange">
                <el-collapse-item title="快捷选项" name="1">
                    <div class="ub fast">
                        <div class="cell">
                            <div class="cell-title">最近</div>
                            <div @click="handleRecently(item,index)" class="cell-val"  :class="{active:index == isSelectRecently }" v-for="(item,index) in recentlyData" :key="index">
                                <span class="cell-name">{{ item.name }}</span>
                                <span class="cell-select el-icon-check"></span>
                            </div>
                        </div>
                        <div class="cell">
                            <div class="cell-title">相对</div>
                            <div @click="handleRelative(item,index)" class="cell-val"  :class="{active:index == isSelectRelative }" v-for="(item,index) in relativeData" :key="index">
                                <span class="cell-name">{{ item.name }}</span>
                                <span class="cell-select el-icon-check"></span>
                            </div>
                        </div>
                        <div class="cell">
                            <div class="cell-title">其他</div>
                            <div class="cell-val" :class="{active:index == isSelectOther }"  v-for="(item,index) in otherList" :key="index">
                                <span @click="handleOther(item,index)" class="other-name">{{ item.name }}</span>
                                <span class="other-close iconfont icon-guanbi" @click="handleDel(otherList,item)"></span>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="最近" name="2">
                    <div class="recently">
                        <div>开始：</div>
                        <div class="ub">
                            <el-input size="mini" type="number" style="width:224px;line-height:28px" v-model="actualTime" placeholder="请输入内容"></el-input>
                            <el-select size="mini" style="width:85px;line-height:28px" v-model="timeUnit" placeholder="请选择">
                                <el-option
                                    v-for="item in timeUnitList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <el-button style="margin-left:230px" size="mini" type="primary" @click.native="use">应用</el-button>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="自定义时间范围" name="3">
                    <div style="height: 400px">
                        <el-date-picker
                            :default-time="['00:00:00', '23:59:59']"
                            :append-to-body="false"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            style="height: 20px"
                            format="yyyy-MM-dd HH:mm:ss"
                            @blur="handleBlur"
                            @change="dateChange"
                            id="dateSelect"
                            popper-class="time-panel-picker"
                            ref="time"
                            class="time-date-picker"
                            v-model="customTime"
                            type="datetimerange"
                            range-separator=""
                            start-placeholder=""
                            end-placeholder="">
                        </el-date-picker>
                    </div>
                </el-collapse-item>
            </el-collapse>
            <el-input
                :style="getWidth()"
                @blur="inputBlur"
                :disabled="true"
                slot="reference"
                placeholder="请选择日期"
                v-model="dateData">
                <i slot="suffix" class="iconfont icon-riqi"></i>
            </el-input>
        </el-popover>

    </div>
</template>

<script>
import { saveLogTime, getLogTime, deleteLogTime } from '@/server/alarm/alarm.js'
export default {
    name: 'CustomDate',
    props: {
        appendToBody: {
            type: Boolean,
            default: false
        },
        inputWidth: {
            type: [Number],
            default: 240
        },
        currentType: {
            type: [Number],
            default: null
        },
        chartTimeRange: {
            type: Array,
            default() {
                return []
            }
        },
        auto: {
            default: false
        },
        empty: {
            type: Boolean,
            default: false
        }
    },
    components: {
        // DatePanel
    },
    data() {
        return {
            isSelectOther: null,
            isSelectRecently: null,
            isSelectRelative: null,
            customTime: [],
            timeUnit: 0,
            otherList: [],
            timeUnitList: [
                {
                    value: 0,
                    label: '秒前'
                },
                {
                    value: 1,
                    label: '分钟前'
                },
                {
                    value: 2,
                    label: '小时前'
                },
                {
                    value: 3,
                    label: '天前'
                }
            ],
            actualTime: '',
            relativeData: [
                {
                    value: 0,
                    name: '今天'
                },
                {
                    value: 1,
                    name: '昨天'
                },
                {
                    value: 2,
                    name: '本周'
                },
                {
                    value: 3,
                    name: '上周'
                },
                {
                    value: 4,
                    name: '本月'
                },
                {
                    value: 5,
                    name: '上月'
                }
            ],
            recentlyData: [
                {
                    value: 0,
                    name: '最近10分钟'
                },
                {
                    value: 1,
                    name: '最近30分钟'
                },
                {
                    value: 2,
                    name: '最近1小时'
                },
                {
                    value: 3,
                    name: '最近1天'
                },
                {
                    value: 4,
                    name: '最近2天'
                },
                {
                    value: 5,
                    name: '最近7天'
                }
            ],
            dateData: '',
            activeName: '1',
            emptyData: this.empty
        }
    },
    watch: {
        chartTimeRange(val) {
            if (val) {
                console.log('传过来时间值了吗', val)
                this.customTime = []
                if (val[2]) {
                    this.dateData = val[2]
                } else {
                    this.dateData = val.join('~')
                }
                this.$emit('getCustomTime', val, true)
                this.$emit('getDateData', this.dateData, 'custom')
            }
        },
        empty(val) {
            this.emptyData = val
            if (val) {
                this.dateData = ''
            }
        }
    },
    mounted() {
        this.initData()
        this.$nextTick(() => {
            this.getLogTimeData()
        })
    },
    computed: {

    },
    methods: {
        getWidth() {
            if (this.auto) {
                return { width: '100%' }
            } else {
                return { width: this.inputWidth + 'px' }
            }
        },
        initData() {
            console.log('emptyData过来了吗', this.emptyData)
            if (!this.emptyData) {
                this.dateData = '最近1天'
                let startTime = this.$moment().add(-1, 'days').format('YYYY-MM-DD HH:mm:ss')
                let endTime = this.$moment().format('YYYY-MM-DD HH:mm:ss')
                let timeData = [startTime, endTime]
                console.log(timeData)
                this.$emit('getCustomTime', timeData)
                this.$emit('getDateData', this.dateData, 'noUse')
            }
        },
        handleDel(list, item) {
            // list.splice(list.indexOf(item), 1)
            this.deleteLogTimeData(item.id)
        },
        deleteLogTimeData(val) {
            let data = {
                queryData: {
                },
                paramsData: {
                    id: val
                }
            }
            deleteLogTime(data).then(res => {
                // this.$message({
                //     message: '删除成功',
                //     type: 'success'
                // })
                setTimeout(() => {
                    this.getLogTimeData()
                }, 1500)
            }).catch(error => {
                console.log(error + 'error')
            })
        },
        handleOther(data, index) {
            this.isSelectRelative = null
            this.isSelectRecently = null
            this.isSelectOther = index
            this.dateData = data.name
            let num = -data.time
            this.$setsessionStorage('temporaryAlarm', { actualTime: data.time, timeUnit: data.timeUnit + 1 })
            let endTime = this.$moment().format('YYYY-MM-DD HH:mm:ss')
            let unitText = this.getUnitText(data.timeUnit)
            let startTime = this.$moment().add(num, unitText).format('YYYY-MM-DD HH:mm:ss')
            let timeData = [startTime, endTime]
            this.$emit('getCustomTime', timeData)
            this.$emit('getDateData', this.dateData, 'use', data, index)
            let saveDate = {
                value: timeData,
                type: 1,
                currentTab: this.currentType,
                title: this.dateData
            }
            this.$setsessionStorage('saveDate', saveDate)
            console.log(timeData)
            this.$refs.datePopver.doClose()
        },
        getUnitText(val) {
            if (val === 0) {
                return 'second'
            } else if (val === 1) {
                return 'minute'
            } else if (val === 2) {
                return 'hour'
            } else if (val === 3) {
                return 'days'
            }
        },
        handleRelative(data, index) {
            this.$setsessionStorage('temporaryAlarm', { actualTime: '', timeUnit: '' })
            this.isSelectOther = null
            this.isSelectRecently = null
            this.isSelectRelative = index
            this.dateData = data.name
            this.$emit('getDateData', this.dateData, 'noUse')
            if (data.value === 0) {
                let startTime = this.$moment().startOf('day').format('YYYY-MM-DD HH:mm:ss')
                let endTime = this.$moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')
                let timeData = [startTime, endTime]
                this.$emit('getCustomTime', timeData)
                let saveDate = {
                    value: timeData,
                    type: 1,
                    currentTab: this.currentType,
                    title: this.dateData
                }
                this.$setsessionStorage('saveDate', saveDate)
                console.log(timeData)
            } else if (data.value === 1) {
                let startTime = this.$moment().subtract(1, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss')
                let endTime = this.$moment().subtract(1, 'day').endOf('day').format('YYYY-MM-DD HH:mm:ss')
                let timeData = [startTime, endTime]
                this.$emit('getCustomTime', timeData)
                let saveDate = {
                    value: timeData,
                    type: 2,
                    currentTab: this.currentType
                }
                this.$setsessionStorage('saveDate', saveDate)
                console.log(timeData)
            } else if (data.value === 2) {
                let startTime = this.$moment().startOf('isoWeek').format('YYYY-MM-DD HH:mm:ss')
                let endTime = this.$moment().endOf('isoWeek').format('YYYY-MM-DD HH:mm:ss')
                let timeData = [startTime, endTime]
                this.$emit('getCustomTime', timeData)
                let saveDate = {
                    value: timeData,
                    type: 1,
                    currentTab: this.currentType,
                    title: this.dateData
                }
                this.$setsessionStorage('saveDate', saveDate)
                console.log(timeData)
            } else if (data.value === 3) {
                let startTime = this.$moment().subtract(1, 'isoWeek').startOf('isoWeek').format('YYYY-MM-DD HH:mm:ss')
                let endTime = this.$moment().subtract(1, 'isoWeek').endOf('isoWeek').format('YYYY-MM-DD HH:mm:ss')
                let timeData = [startTime, endTime]
                this.$emit('getCustomTime', timeData)
                let saveDate = {
                    value: timeData,
                    type: 2,
                    currentTab: this.currentType
                }
                this.$setsessionStorage('saveDate', saveDate)
                console.log(timeData)
            } else if (data.value === 4) {
                let startTime = this.$moment().startOf('month').format('YYYY-MM-DD HH:mm:ss')
                let endTime = this.$moment().endOf('month').format('YYYY-MM-DD HH:mm:ss')
                let timeData = [startTime, endTime]
                this.$emit('getCustomTime', timeData)
                let saveDate = {
                    value: timeData,
                    type: 1,
                    currentTab: this.currentType,
                    title: this.dateData
                }
                this.$setsessionStorage('saveDate', saveDate)
                console.log(timeData)
            } else if (data.value === 5) {
                let startTime = this.$moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD HH:mm:ss')
                let endTime = this.$moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD HH:mm:ss')
                let timeData = [startTime, endTime]
                this.$emit('getCustomTime', timeData)
                let saveDate = {
                    value: timeData,
                    type: 2,
                    currentTab: this.currentType
                }
                this.$setsessionStorage('saveDate', saveDate)
                console.log(timeData)
            }
            this.$refs.datePopver.doClose()
        },
        handleRecently(data, index) {
            this.$setsessionStorage('temporaryAlarm', { actualTime: '', timeUnit: '' })
            this.isSelectOther = null
            this.isSelectRelative = null
            this.isSelectRecently = index
            this.dateData = data.name
            this.$emit('getDateData', this.dateData, 'noUse')
            if (data.value === 0) {
                let startTime = this.$moment().add(-10, 'minute').format('YYYY-MM-DD HH:mm:ss')
                let endTime = this.$moment().format('YYYY-MM-DD HH:mm:ss')
                let timeData = [startTime, endTime]
                let saveDate = {
                    value: timeData,
                    type: 1,
                    currentTab: this.currentType,
                    title: this.dateData
                }
                this.$setsessionStorage('saveDate', saveDate)
                console.log(timeData)
                this.$emit('getCustomTime', timeData)
            } else if (data.value === 1) {
                let startTime = this.$moment().add(-30, 'minute').format('YYYY-MM-DD HH:mm:ss')
                let endTime = this.$moment().format('YYYY-MM-DD HH:mm:ss')
                let timeData = [startTime, endTime]
                let saveDate = {
                    value: timeData,
                    type: 1,
                    currentTab: this.currentType,
                    title: this.dateData
                }
                this.$setsessionStorage('saveDate', saveDate)
                console.log(timeData)
                this.$emit('getCustomTime', timeData)
            } else if (data.value === 2) {
                let startTime = this.$moment().add(-1, 'hour').format('YYYY-MM-DD HH:mm:ss')
                let endTime = this.$moment().format('YYYY-MM-DD HH:mm:ss')
                let timeData = [startTime, endTime]
                let saveDate = {
                    value: timeData,
                    type: 1,
                    currentTab: this.currentType,
                    title: this.dateData
                }
                this.$setsessionStorage('saveDate', saveDate)
                console.log(timeData)
                this.$emit('getCustomTime', timeData)
            } else if (data.value === 3) {
                let startTime = this.$moment().add(-1, 'days').format('YYYY-MM-DD HH:mm:ss')
                let endTime = this.$moment().format('YYYY-MM-DD HH:mm:ss')
                let timeData = [startTime, endTime]
                let saveDate = {
                    value: timeData,
                    type: 1,
                    currentTab: this.currentType,
                    title: this.dateData
                }
                this.$setsessionStorage('saveDate', saveDate)
                console.log(timeData)
                this.$emit('getCustomTime', timeData)
            } else if (data.value === 4) {
                let startTime = this.$moment().add(-2, 'days').format('YYYY-MM-DD HH:mm:ss')
                let endTime = this.$moment().format('YYYY-MM-DD HH:mm:ss')
                let timeData = [startTime, endTime]
                let saveDate = {
                    value: timeData,
                    type: 1,
                    currentTab: this.currentType,
                    title: this.dateData
                }
                this.$setsessionStorage('saveDate', saveDate)
                console.log(timeData)
                this.$emit('getCustomTime', timeData)
            } else if (data.value === 5) {
                let startTime = this.$moment().add(-7, 'days').format('YYYY-MM-DD HH:mm:ss')
                let endTime = this.$moment().format('YYYY-MM-DD HH:mm:ss')
                let timeData = [startTime, endTime]
                let saveDate = {
                    value: timeData,
                    type: 1,
                    currentTab: this.currentType,
                    title: this.dateData
                }
                this.$setsessionStorage('saveDate', saveDate)
                console.log(timeData)
                this.$emit('getCustomTime', timeData)
            }
            this.$refs.datePopver.doClose()
        },
        popoverShow() {
            this.activeName = '1'
        },
        popoverHide() {
            if (document.querySelector('.time-panel-picker')) document.querySelector('.time-panel-picker').style.zIndex = '-1000'
        },
        inputBlur() {
            if (document.querySelector('.time-panel-picker')) document.querySelector('.time-panel-picker').style.zIndex = '-1000'
        },
        handleBlur() {
            document.querySelector('.time-date-picker').querySelector('input').focus()
            this.$refs.datePopver.doClose()
            // this.$refs.time.focus()
        },
        selectChange(val) {
            if (val === '3') {
                setTimeout(() => {
                    this.$refs.time.focus()
                }, 100)
            } else {
                if (document.querySelector('.time-panel-picker')) document.querySelector('.time-panel-picker').style.zIndex = '-1000'
            }
            this.$setsessionStorage('temporaryAlarm', { actualTime: '', timeUnit: '' })
            console.log(val)
        },
        dateChange(value) {
            if (value) {
                this.isSelectOther = null
                this.isSelectRelative = null
                this.isSelectRecently = null
                this.$refs.datePopver.doClose()
                this.dateData = value.join('~')
                console.log(value)
                this.$emit('getCustomTime', value)
                this.$emit('getDateData', this.dateData, 'custom')
                let saveDate = {
                    value: value,
                    type: 2,
                    currentTab: this.currentType
                }
                this.$setsessionStorage('saveDate', saveDate)
            }
        },
        use() {
            this.addTime()
        },
        addTime() {
            let data = {
                queryData: {
                },
                paramsData: {
                    time: this.actualTime,
                    timeStatus: this.timeUnit
                }
            }
            saveLogTime(data).then(res => {
                this.$message({
                    message: '应用成功',
                    type: 'success'
                })
                this.$setsessionStorage('temporaryAlarm', { actualTime: this.actualTime, timeUnit: this.timeUnit + 1 })
                this.handleUse()
                this.$refs.datePopver.doClose()
                setTimeout(() => {
                    this.getLogTimeData()
                    this.isSelectRelative = null
                    this.isSelectRecently = null
                    this.isSelectOther = 0
                }, 500)
            }).catch(error => {
                console.log(error + 'error')
            })
        },
        handleUse() {
            let endTime = this.$moment().format('YYYY-MM-DD HH:mm:ss')
            let unitText = this.getUnitText(this.timeUnit)
            let startTime = this.$moment().add(-this.actualTime, unitText).format('YYYY-MM-DD HH:mm:ss')
            let timeData = [startTime, endTime]
            this.dateData = `最近${this.actualTime}${this.unitText(this.timeUnit)}`
            this.$emit('actualTime', this.actualTime)
            this.$emit('timeUnit', this.timeUnit)
            this.$emit('getCustomTime', timeData)
            this.$emit('getDateData', this.dateData, 'useTwo')
            this.$emit('useing')
            let saveDate = {
                value: timeData,
                type: 1,
                currentTab: this.currentType,
                title: this.dateData
            }
            this.$setsessionStorage('saveDate', saveDate)
        },
        getLogTimeData() {
            let data = {
                queryData: {
                },
                paramsData: {
                }
            }
            getLogTime(data).then(res => {
                if (res.length > 0) {
                    this.otherList = res.map(item => {
                        return {
                            name: `最近${item.time}${this.unitText(item.timeStatus)}`,
                            timeUnit: item.timeStatus,
                            time: item.time,
                            id: item.id
                        }
                    })
                } else {
                    this.otherList = []
                }
                console.log('查询时间', res)
            }).catch(error => {
                console.log(error + 'error')
            })
        },
        unitText(val) {
            if (val === 0) {
                return '秒'
            } else if (val === 1) {
                return '分钟'
            } else if (val === 2) {
                return '小时'
            } else if (val === 3) {
                return '天'
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.custom-date {
    & ::v-deep .el-input__inner {
        height: 32px;
        line-height: 32px;
        color: #606266;
        box-shadow: 0px 0px 7px rgba(0, 0, 0, 0) inset;
        font-size:12px;
        background: #fff !important;
    }
    & ::v-deep .el-input.is-disabled .el-input__inner {
        cursor: pointer;
    }
    & ::v-deep .el-input.is-disabled .el-input__icon {
        cursor: pointer;
        line-height: 20px;
    }
    & ::v-deep.el-input.is-disabled .el-input__inner {
        color: #fff;
    }

}
.el-range-editor.el-input__inner {
    border-color: rgba(255, 255, 255, 0);
    height: 20px;
     background:rgba(255, 255, 255, 0);
}
.el-range-editor.is-active, .el-range-editor.is-active:hover {
    border-color: rgba(255, 255, 255, 0);
    height: 20px;
    background:rgba(255, 255, 255, 0);
}

</style>
