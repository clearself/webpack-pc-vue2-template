<template>
    <div class="custom-date1">
        <el-popover
            :append-to-body="appendToBody"
            :key="123"
            popper-class="custom-date-picker"
            placement="bottom"
            width="650"
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
                            <div
                                @click="handleRecently(item, index, true)"
                                class="cell-val"
                                :class="{ active: index == isSelectRecently }"
                                v-for="(item, index) in recentlyData"
                                :key="index"
                            >
                                <span class="cell-name">{{ item.name }}</span>
                                <span class="cell-select el-icon-check"></span>
                            </div>
                        </div>
                        <div class="cell">
                            <div class="cell-title">相对</div>
                            <div
                                @click="handleRelative(item, index, true)"
                                class="cell-val"
                                :class="{ active: index == isSelectRelative }"
                                v-for="(item, index) in relativeData"
                                :key="index"
                            >
                                <span class="cell-name">{{ item.name }}</span>
                                <span class="cell-select el-icon-check"></span>
                            </div>
                        </div>
                        <div class="cell">
                            <div class="cell-title">其他</div>
                            <div class="cell-val" :class="{ active: index == isSelectOther }" v-for="(item, index) in otherList" :key="index">
                                <span @click="handleOther(item, index, true)" class="other-name">{{ item.name }}</span>
                                <span class="other-close iconfont icon-guanbi" @click="handleDel(otherList, item)"></span>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="最近" name="2">
                    <div class="recently">
                        <div>开始：</div>
                        <div class="ub">
                            <el-input size="mini" type="number" style="width:224px" v-model="actualTime" placeholder="请输入内容"></el-input>
                            <el-select size="mini" style="width:85px" v-model="timeUnit" placeholder="请选择">
                                <el-option v-for="item in timeUnitList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                            <el-button style="margin-left:230px" size="mini" type="primary" @click="use">应 用</el-button>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="自定义时间范围" name="3">
                    <div style="height: 400px; transform: scale(1)">
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
                            end-placeholder=""
                        ></el-date-picker>
                    </div>
                </el-collapse-item>
            </el-collapse>
            <el-input
                :style="getWidth()"
                @blur="inputBlur"
                :disabled="true"
                slot="reference"
                placeholder="请选择日期"
                v-model="dateData"
                :class="{ 'hover-change': dateData.length > 10 }"
            >
                <i slot="suffix" class="el-input__icon el-icon-arrow-down"></i>
            </el-input>
        </el-popover>
    </div>
</template>

<script>
import { saveLogTime, getLogTime, deleteLogTime } from '@/server/stream_data_center/dash_board.js'
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
        },
        chartid: {
            type: String,
            default: ''
        },
        time: {
            type: String,
            default: ''
        },
        timeStatus: {
            type: String,
            default: ''
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
        chartTimeRange(val, old) {
            if (val) {
                console.log(val, old)
                console.log(val === old)
                console.log('传过来时间值了吗1111111111111', val)
                console.log(this.time, this.timeStatus)
                if (old && val[0] == old[0] && val[1] == old[1]) {
                    return null
                } else {
                    this.customTime = []
                    if (val[2]) {
                        this.dateData = val[2]
                    } else {
                        this.dateData = val.join('~')
                    }
                    this.formatDate(this.time, this.timeStatus, val)
                }
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
    computed: {},
    methods: {
        formatDate(time, timeStatus, val) {
            if (timeStatus) {
                let unitText1 = this.getUnitText1(timeStatus)
                let name = '最近' + time + unitText1
                let useDate = { id: '', name, time: time, timeUnit: timeStatus - 1 }
                console.log(useDate)
                console.log(name)
                console.log(this.otherList)
                let index = this.otherList.map(item => item.name).indexOf(name)
                this.handleOther(useDate, index)
            } else {
                if (time === '最近10分钟') {
                    this.handleRecently({ value: 0, name: '最近10分钟' }, 0)
                } else if (time === '最近30分钟') {
                    this.handleRecently({ value: 1, name: '最近30分钟' }, 1)
                } else if (time === '最近1小时') {
                    this.handleRecently({ value: 2, name: '最近1小时' }, 2)
                } else if (time === '最近1天') {
                    this.handleRecently({ value: 3, name: '最近1天' }, 3)
                } else if (time === '最近2天') {
                    this.handleRecently({ value: 4, name: '最近2天' }, 4)
                } else if (time === '最近7天') {
                    this.handleRecently({ value: 5, name: '最近7天' }, 5)
                } else if (time === '今天') {
                    this.handleRelative({ value: 0, name: '今天' }, 0)
                } else if (time === '昨天') {
                    this.handleRelative({ value: 1, name: '昨天' }, 1)
                } else if (time === '本周') {
                    this.handleRelative({ value: 2, name: '本周' }, 2)
                } else if (time === '上周') {
                    this.handleRelative({ value: 3, name: '上周' }, 3)
                } else if (time === '本月') {
                    this.handleRelative({ value: 4, name: '本月' }, 4)
                } else if (time === '上月') {
                    this.handleRelative({ value: 5, name: '上月' }, 5)
                } else {
                    this.$emit('getCustomTime', val, true)
                    this.$emit('getDateData', this.dateData, 'custom')
                }
            }
        },
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
                this.dateData = '最近10分钟'
                console.log('this.dateData走了吗', this.dateData)
                let startTime = this.$moment()
                    .add(-10, 'minute')
                    .format('YYYY-MM-DD HH:mm:ss')
                let endTime = this.$moment().format('YYYY-MM-DD HH:mm:ss')
                let timeData = [startTime, endTime]
                this.$emit('getCustomTime', timeData)
                this.$emit('getDateData', this.dateData, 'noUse')
                let saveDate = {
                    value: timeData,
                    type: 1,
                    currentTab: this.currentType,
                    title: this.dateData
                }
                this.$setsessionStorage('saveDate', saveDate)
            }
        },
        handleDel(list, item) {
            // list.splice(list.indexOf(item), 1)
            this.deleteLogTimeData(item.id)
        },
        deleteLogTimeData(val) {
            let data = {
                queryData: {},
                paramsData: {
                    id: val
                }
            }
            deleteLogTime(data)
                .then(res => {
                    // this.$message({
                    //     message: '删除成功',
                    //     type: 'success'
                    // })
                    setTimeout(() => {
                        this.getLogTimeData()
                    }, 1500)
                })
                .catch(error => {
                    console.log(error + 'error')
                })
        },
        handleOther(data, index, hands) {
            this.$setsessionStorage(`temporary${this.chartid}`, { actualTime: data.time, timeUnit: data.timeUnit + 1 })
            this.isSelectRelative = null
            this.isSelectRecently = null
            this.isSelectOther = index
            this.dateData = data.name
            let num = -data.time
            let endTime = this.$moment().format('YYYY-MM-DD HH:mm:ss')
            let unitText = this.getUnitText(data.timeUnit)
            let startTime = this.$moment()
                .add(num, unitText)
                .format('YYYY-MM-DD HH:mm:ss')
            let timeData = [startTime, endTime]
            console.log('我是手动调用')
            this.$emit('getDateData', this.dateData, 'use', data, index)
            this.$emit('getCustomTime', timeData, false, hands)
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
        getUnitText1(val) {
            if (val == 1) {
                return '秒'
            } else if (val == 2) {
                return '分钟'
            } else if (val == 3) {
                return '小时'
            } else if (val == 4) {
                return '天'
            }
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
        handleRelative(data, index, hand) {
            this.$setsessionStorage(`temporary${this.chartid}`, { actualTime: '', timeUnit: '' })
            this.isSelectOther = null
            this.isSelectRecently = null
            this.isSelectRelative = index
            this.dateData = data.name
            this.$emit('getDateData', this.dateData, 'noUse')
            console.log('我是手动调用')
            if (data.value === 0) {
                let startTime = this.$moment()
                    .startOf('day')
                    .format('YYYY-MM-DD HH:mm:ss')
                let endTime = this.$moment()
                    .endOf('day')
                    .format('YYYY-MM-DD HH:mm:ss')
                let timeData = [startTime, endTime]
                this.$emit('getCustomTime', timeData, false, hand)
                let saveDate = {
                    value: timeData,
                    type: 1,
                    currentTab: this.currentType,
                    title: this.dateData
                }
                this.$setsessionStorage('saveDate', saveDate)
                console.log(timeData)
            } else if (data.value === 1) {
                let startTime = this.$moment()
                    .subtract(1, 'day')
                    .startOf('day')
                    .format('YYYY-MM-DD HH:mm:ss')
                let endTime = this.$moment()
                    .subtract(1, 'day')
                    .endOf('day')
                    .format('YYYY-MM-DD HH:mm:ss')
                let timeData = [startTime, endTime]
                this.$emit('getCustomTime', timeData, false, hand)
                let saveDate = {
                    value: timeData,
                    type: 2,
                    currentTab: this.currentType
                }
                this.$setsessionStorage('saveDate', saveDate)
                console.log(timeData)
            } else if (data.value === 2) {
                let startTime = this.$moment()
                    .startOf('isoWeek')
                    .format('YYYY-MM-DD HH:mm:ss')
                let endTime = this.$moment()
                    .endOf('isoWeek')
                    .format('YYYY-MM-DD HH:mm:ss')
                let timeData = [startTime, endTime]
                this.$emit('getCustomTime', timeData, false, hand)
                let saveDate = {
                    value: timeData,
                    type: 1,
                    currentTab: this.currentType,
                    title: this.dateData
                }
                this.$setsessionStorage('saveDate', saveDate)
                console.log(timeData)
            } else if (data.value === 3) {
                let startTime = this.$moment()
                    .subtract(1, 'isoWeek')
                    .startOf('isoWeek')
                    .format('YYYY-MM-DD HH:mm:ss')
                let endTime = this.$moment()
                    .subtract(1, 'isoWeek')
                    .endOf('isoWeek')
                    .format('YYYY-MM-DD HH:mm:ss')
                let timeData = [startTime, endTime]
                this.$emit('getCustomTime', timeData, false, hand)
                let saveDate = {
                    value: timeData,
                    type: 2,
                    currentTab: this.currentType
                }
                this.$setsessionStorage('saveDate', saveDate)
                console.log(timeData)
            } else if (data.value === 4) {
                let startTime = this.$moment()
                    .startOf('month')
                    .format('YYYY-MM-DD HH:mm:ss')
                let endTime = this.$moment()
                    .endOf('month')
                    .format('YYYY-MM-DD HH:mm:ss')
                let timeData = [startTime, endTime]
                this.$emit('getCustomTime', timeData, false, hand)
                let saveDate = {
                    value: timeData,
                    type: 1,
                    currentTab: this.currentType,
                    title: this.dateData
                }
                this.$setsessionStorage('saveDate', saveDate)
                console.log(timeData)
            } else if (data.value === 5) {
                let startTime = this.$moment()
                    .subtract(1, 'month')
                    .startOf('month')
                    .format('YYYY-MM-DD HH:mm:ss')
                let endTime = this.$moment()
                    .subtract(1, 'month')
                    .endOf('month')
                    .format('YYYY-MM-DD HH:mm:ss')
                let timeData = [startTime, endTime]
                this.$emit('getCustomTime', timeData, false, hand)
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
        handleRecently(data, index, hands) {
            this.$setsessionStorage(`temporary${this.chartid}`, { actualTime: '', timeUnit: '' })
            this.isSelectOther = null
            this.isSelectRelative = null
            this.isSelectRecently = index
            this.dateData = data.name
            this.$emit('getDateData', this.dateData, 'noUse')
            console.log('我是手动调用 hands为true')
            if (data.value === 0) {
                let startTime = this.$moment()
                    .add(-10, 'minute')
                    .format('YYYY-MM-DD HH:mm:ss')
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
                this.$emit('getCustomTime', timeData, false, hands)
            } else if (data.value === 1) {
                let startTime = this.$moment()
                    .add(-30, 'minute')
                    .format('YYYY-MM-DD HH:mm:ss')
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
                this.$emit('getCustomTime', timeData, false, hands)
            } else if (data.value === 2) {
                let startTime = this.$moment()
                    .add(-1, 'hour')
                    .format('YYYY-MM-DD HH:mm:ss')
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
                this.$emit('getCustomTime', timeData, false, hands)
            } else if (data.value === 3) {
                let startTime = this.$moment()
                    .add(-1, 'days')
                    .format('YYYY-MM-DD HH:mm:ss')
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
                this.$emit('getCustomTime', timeData, false, hands)
            } else if (data.value === 4) {
                let startTime = this.$moment()
                    .add(-2, 'days')
                    .format('YYYY-MM-DD HH:mm:ss')
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
                this.$emit('getCustomTime', timeData, false, hands)
            } else if (data.value === 5) {
                let startTime = this.$moment()
                    .add(-7, 'days')
                    .format('YYYY-MM-DD HH:mm:ss')
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
                this.$emit('getCustomTime', timeData, false, hands)
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
            document
                .querySelector('.time-date-picker')
                .querySelector('input')
                .focus()
            this.$refs.datePopver.doClose()
            // this.$refs.time.focus()
        },
        selectChange(val) {
            if (val === '3') {
                setTimeout(() => {
                    this.$refs.time.focus()
                    // document.querySelector('.time-date-picker').querySelector('input').focus()
                    // document.querySelector('.time-date-picker').querySelector('.el-range-input').focus()
                    // document.querySelector('.time-date-picker').querySelector('.el-range-input').focus()
                    // if (document.querySelector('.time-panel-picker')) document.querySelector('.time-panel-picker').style.zIndex = '99999'
                    // if (document.querySelector('.time-panel-picker')) document.querySelector('.time-panel-picker').style.display = 'block'
                    // if (document.querySelector('.time-panel-picker')) document.querySelector('.time-panel-picker').style.position = 'absolute'
                    // if (document.querySelector('.time-panel-picker')) document.querySelector('.time-panel-picker').style.left = '556px'
                }, 100)
                // this.$refs.time.focus()
            } else {
                // setTimeout(() => {
                //     document.querySelector('.time-date-picker').querySelector('input').blur()
                // }, 50)
                // this.$refs.time.hidePicker()
                // document.querySelector('.time-date-picker').querySelector('input').blur()
                // document.querySelector('.time-panel-picker').style.display = 'none'
                if (document.querySelector('.time-panel-picker')) document.querySelector('.time-panel-picker').style.zIndex = '-1000'
                // this.$refs.time.blur()
            }
            this.$setsessionStorage(`temporary${this.chartid}`, { actualTime: '', timeUnit: '' })
            console.log(val)
        },
        dateChange(value) {
            console.log('我是手动调用')
            if (value) {
                this.isSelectOther = null
                this.isSelectRelative = null
                this.isSelectRecently = null
                this.$refs.datePopver.doClose()
                this.dateData = value.join('~')
                console.log(value)
                this.$emit('getDateData', this.dateData, 'custom')
                this.$emit('getCustomTime', value, false, true)
                let saveDate = {
                    value: value,
                    type: 2,
                    currentTab: this.currentType
                }
                this.$setsessionStorage('saveDate', saveDate)
            }
        },
        use() {
            // let name = `最近${this.actualTime}${this.unitText(this.timeUnit)}`
            this.addTime()
            // if (this.actualTime && this.otherList.length < 6) {
            //     this.addTime()
            // } else if (this.actualTime) {
            //     this.deleteLogTimeData(this.otherList[0].id)
            //     setTimeout(() => {
            //         this.addTime()
            //     }, 100)
            // }
        },
        addTime() {
            let userId = this.$getsessionStorage('userInfo').id
            let data = {
                queryData: {},
                paramsData: {
                    userId: userId,
                    time: this.actualTime,
                    timeStatus: this.timeUnit
                }
            }
            saveLogTime(data)
                .then(res => {
                    this.$message({
                        message: '应用成功',
                        type: 'success'
                    })
                    this.$setsessionStorage(`temporary${this.chartid}`, { actualTime: this.actualTime, timeUnit: this.timeUnit + 1 })
                    this.handleUse()
                    this.$refs.datePopver.doClose()
                    setTimeout(() => {
                        this.getLogTimeData()
                        this.isSelectRelative = null
                        this.isSelectRecently = null
                        this.isSelectOther = 0
                    }, 500)
                })
                .catch(error => {
                    console.log(error + 'error')
                })
        },
        handleUse() {
            let endTime = this.$moment().format('YYYY-MM-DD HH:mm:ss')
            let unitText = this.getUnitText(this.timeUnit)
            let startTime = this.$moment()
                .add(-this.actualTime, unitText)
                .format('YYYY-MM-DD HH:mm:ss')
            let timeData = [startTime, endTime]
            this.dateData = `最近${this.actualTime}${this.unitText(this.timeUnit)}`
            console.log('我是手动调用')
            this.$emit('getDateData', this.dateData, 'useTwo')
            this.$emit('getCustomTime', timeData, false, true)
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
            let userId = this.$getsessionStorage('userInfo').id
            let data = {
                queryData: {},
                paramsData: {
                    userId: userId
                }
            }
            getLogTime(data)
                .then(res => {
                    if (res.length > 0) {
                        this.otherList = res.map(item => {
                            return {
                                name: `最近${item.time}${this.unitText(item.timeStatus)}`,
                                timeUnit: item.timeStatus,
                                time: item.time,
                                id: item.id
                            }
                        })
                    }
                    console.log('查询时间', res)
                })
                .catch(error => {
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
// background: transparent;
//     border: 1px solid #1cd7fa;
//     box-shadow: 0px 0px 7px #389bf7 inset;
//     color: #fff;
//     font-size: 12px !important;
.custom-date1 {
    & ::v-deep .el-input__inner {
        height: 30px;
        line-height: 30px;
        color: #606266;
        box-shadow: 0px 0px 7px rgba(0, 0, 0, 0) inset;
    }
    ::v-deep .el-input {
        overflow: hidden;
    }
    & ::v-deep .el-input.is-disabled .el-input__inner {
        cursor: pointer;
        border: none !important;
        box-shadow: none;
        text-align: right;
        color: rgba(0,0,0,0.4);
        text-overflow: ellipsis;
        word-break: keep-all;
        overflow: hidden;
        font-size: 12px;
    }
    & ::v-deep .el-input.is-disabled .el-input__icon {
        cursor: pointer;
        line-height: 30px;
    }
    & ::v-deep.el-input.is-disabled .el-input__inner {
        color: #fff;
    }
    ::v-deep.hover-change {
        &:hover {
            .el-input__inner {
                width: 300px;
                text-overflow: initial;
                animation: 3s siderbar linear infinite normal;
                z-index: 0;
            }
            .el-input__suffix {
                display: none;
            }
        }
        @keyframes siderbar {
            0% {
                transform: translateX(0);
                -webkit-transform: translateX(0);
            }
            100% {
                transform: translateX(-100px);
                -webkit-transform: translateX(-100px);
            }
        }
    }
}

.el-range-editor.el-input__inner {
    border-color: rgba(255, 255, 255, 0);
    height: 20px;
    background: rgba(255, 255, 255, 0);
}
.el-range-editor.is-active,
.el-range-editor.is-active:hover {
    border-color: rgba(255, 255, 255, 0);
    height: 20px;
    background: rgba(255, 255, 255, 0);
}
</style>
<style lang="scss">
.custom-date-picker {
    border: solid 1px #1cd7fa;
    background-color: #033254;
    padding: 0;
    .el-range-editor.el-input__inner {
        height: 1px !important;
        border: hidden;
        background-color: rgba(0, 0, 0, 0);
    }
    .el-collapse-item__content {
        background-color: #033254;
        color: #fff;
        font-size: 12px;
    }
    .el-collapse-item__header {
        padding-left: 10px;
        border: hidden !important;
        height: 24px;
        background-color: #0d4873;
        color: #fff;
        font-size: 12px;
    }
    .el-collapse-item__content {
        border: hidden !important;
        // padding-left: 10px;
    }
    .el-collapse-item__wrap {
        border: hidden !important;
    }
    .el-collapse {
        border: hidden;
    }
    .el-collapse-item__header.is-active {
        color: #00fcff;
    }
    .el-input--mini .el-input__inner {
        height: 24px;
        line-height: 24px;
        background: transparent;
        // border: 1px solid #00ffe4;
        // box-shadow: 0px 0px 7px #389bf7 inset;
        color: #fff;
        font-size: 12px !important;
        border-radius: 2px 0 0 2px;
        border-right: hidden;
    }
    .el-select--mini .el-input__inner {
        color: #00ffe4;
        border-radius: 0 2px 2px 0;
        border-right: 1px solid #00ffe4;
    }
    .el-select .el-input .el-select__caret {
        color: #00ffe4;
        font-size: 12px;
        margin-top: -6px;
    }
    .el-select .el-input .el-select__caret.is-reverse {
        margin-top: -2px;
    }
    .btn_box {
        text-align: center;
        width: 60px;
        height: 24px;
        line-height: 24px;
        background-size: 100% 24px;
    }
    .btn_inner_box p {
        width: 60px;
    }
    .fast {
        padding: 30px 10px 10px 10px;
        box-sizing: border-box;
        .cell-title {
            opacity: 0.5;
            margin-bottom: 12px;
        }
        .cell-val {
            box-sizing: border-box;
            width: 210px;
            height: 24px;
            line-height: 24px;
            .other-name {
                margin-right: 10px;
            }
            .other-close {
                font-size: 12px;
                &:hover {
                    cursor: pointer;
                    color: #00fcff;
                }
            }
            .cell-select {
                &:before {
                    content: '';
                }
            }
            &:hover {
                background-color: #0d4873;
            }
        }
        .active {
            background-color: rgba(255, 255, 255, 0);
            color: #00fcff;
            .cell-select {
                margin-left: 10px;
                &:before {
                    content: '\e6da';
                }
            }
        }
    }
    .recently {
        padding: 30px 10px 10px 10px;
        margin-bottom: 95px;
    }
    // .time-panel-picker {
    //     top: -6px !important;
    // }
}
.custom-date {
}
.time-panel-picker {
    top: 0 !important;
    left: 0 !important;
    .el-time-panel {
        width: 150px !important;
    }
}
</style>
