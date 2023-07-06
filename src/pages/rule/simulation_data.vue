<template>
    <div class="list">
        <div style="background:#ffffff;overflow-y:auto;height: 99%;">
            <div style="position:relative">
                <el-button
                    class="cancelBtn"
                    size="small"
                    style="z-index: 99"
                    @click=reset>重置</el-button>
                <el-button
                    class="releaseBtn"
                    size="small"
                    type="primary"
                    style="z-index: 99"
                    @click=releaseForm >发布</el-button>
            </div>
            <div class="tabs">
                <el-tabs v-model="activeName">
                    <!--安全警告事件-->
                    <el-tab-pane label="安全设备日志" name="first">
                        <el-form ref="form" :model="alarmForm" label-width="140px" label-position="top">
                            <el-form-item class="send-sum" label="发送次数:">
                                <el-input
                                    class="w700 send_num"
                                    size="small"
                                    v-model.number="alarmForm.sum"
                                    oninput ="value=value.replace(/[^0-9.]/g,'')"
                                    @blur="alarmForm.sum = $event.target.value"
                                    placeholder="请输入次数"
                                    clearable></el-input>
                            </el-form-item>
                        </el-form>
                        <virtual-list
                            style="height: 80vh; overflow-y: auto;"
                            class="virtual"
                            :data-key="'id'"
                            :keeps="10000"
                            :data-sources="alarmForm.options"
                            :data-component="itemComponent"
                        />
                    </el-tab-pane>
                    <!--主机日志事件-->
                    <el-tab-pane label="主机日志" name="second">
                        <el-form ref="form" :model="hostForm" label-width="140px" label-position="top">
                            <el-form-item class="send-sum" label="发送次数:">
                                <el-input
                                    class="w700 send_num"
                                    size="small"
                                    v-model.number="hostForm.sum"
                                    oninput ="value=value.replace(/[^0-9.]/g,'')"
                                    @blur="hostForm.sum = $event.target.value"
                                    placeholder="请输入次数"
                                    clearable></el-input>
                            </el-form-item>
                        </el-form>
                        <virtual-list
                            style="height: 80vh; overflow-y: auto;"
                            class="virtual"
                            :data-key="'id'"
                            :keeps="10000"
                            :data-sources="hostForm.options"
                            :data-component="itemComponent"
                        />
                    </el-tab-pane>
                    <!--网络流事件-->
                    <el-tab-pane label="流日志" name="third">
                        <el-form ref="form" :model="trafficForm" label-width="140px" label-position="top">
                            <el-form-item class="send-sum" label="发送次数:">
                                <el-input
                                    class="w700 send_num"
                                    size="small"
                                    v-model.number="trafficForm.sum"
                                    oninput ="value=value.replace(/[^0-9.]/g,'')"
                                    @blur="trafficForm.sum = $event.target.value"
                                    placeholder="请输入次数"
                                    clearable></el-input>
                            </el-form-item>
                        </el-form>
                        <virtual-list
                            style="height: 80vh; overflow-y: auto;"
                            class="virtual"
                            :data-key="'id'"
                            :keeps="10000"
                            :data-sources="trafficForm.options"
                            :data-component="itemComponent"
                        />
                    </el-tab-pane>
                    <!--应用事件-->
                    <el-tab-pane label="应用日志" name="fourth">
                        <el-form ref="form" :model="appForm" label-width="140px" label-position="top">
                            <el-form-item class="send-sum" label="发送次数:">
                                <el-input
                                    class="w700 send_num"
                                    size="small"
                                    v-model.number="appForm.sum"
                                    oninput ="value=value.replace(/[^0-9.]/g,'')"
                                    @blur="appForm.sum = $event.target.value"
                                    placeholder="请输入次数"
                                    clearable></el-input>
                            </el-form-item>
                        </el-form>
                        <virtual-list
                            style="height: 80vh; overflow-y: auto;"
                            class="virtual"
                            :data-key="'id'"
                            :keeps="10000"
                            :data-sources="appForm.options"
                            :data-component="itemComponent"
                        />
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
</template>

<script>
import _ from 'lodash'
import VirtualList from 'vue-virtual-scroll-list'
import Item from './item/Item'
import { releaseRuleForm, getSimulation } from '../../server/rule/api'

export default {
    name: 'SimulationData',
    components: {
        VirtualList
    },
    data() {
        return {
            optionsData: [
                { uid: 'unique_1', text: 'abc' }
            ],
            itemComponent: Item,
            activeName: 'first',
            // 日期选择器
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now()
                }
            },
            /* 安全设备事件*/
            alarmForm: {
                type: 'AlarmEvent',
                sum: '',
                options: []
            },
            /* 流事件*/
            trafficForm: {
                type: 'TrafficEvent',
                sum: '',
                options: []
            },
            /* 主机日志事件*/
            hostForm: {
                type: 'HostEvent',
                sum: '',
                options: []
            },
            /* 应用事件*/
            appForm: {
                type: 'AppEvent',
                sum: '',
                options: []
            }
        }
    },
    created() {
        this.getOptions()
    },
    methods: {
        getOptions() {
            getSimulation({}).then(res => {
                console.log(res, '模拟数据')
                if (res && res.length) {
                    res.forEach(item => {
                        if (item.id === '1') {
                            this.alarmForm.options = item.options
                            // this.alarmForm.options.unshift({ field: 'sum', id: '99', label: '发送次数', type: 10, value: '' })
                        } else if (item.id === '2') {
                            this.hostForm.options = item.options
                            // this.hostForm.options.unshift({ field: 'sum', id: '99', label: '发送次数', type: 10, value: '' })
                        } else if (item.id === '3') {
                            this.trafficForm.options = item.options
                            // this.trafficForm.options.unshift({ field: 'sum', id: '99', label: '发送次数', type: 10, value: '' })
                        } else if (item.id === '4') {
                            this.appForm.options = item.options
                            // this.appForm.options.unshift({ field: 'sum', id: '99', label: '发送次数', type: 10, value: '' })
                        }
                    })
                }
            }).catch(err => {
                console.log(err)
            })
        },
        reset() {
            this.alarmForm.options.forEach(it => {
                it.value = ''
            })
            this.hostForm.options.forEach(it => {
                it.value = ''
            })
            this.trafficForm.options.forEach(it => {
                it.value = ''
            })
            this.appForm.options.forEach(it => {
                it.value = ''
            })
            this.alarmForm.sum = ''
            this.trafficForm.sum = ''
            this.hostForm.sum = ''
            this.appForm.sum = ''
        },
        releaseForm() {
            let formVal
            let data = {
                type: '',
                sum: ''
            }
            console.log(this.alarmForm.options)
            let obj1 = {}
            let obj2 = {}
            let obj3 = {}
            let obj4 = {}

            switch (this.activeName) {
                case 'first':
                    if (this.alarmForm.sum.trim() === '') {
                        this.$message.warning('请输入发送次数！')
                        return
                    }
                    data.type = 'AlarmEvent'
                    data.sum = Number(this.alarmForm.sum)

                    this.alarmForm.options.forEach(it => {
                        obj1[it.field] = it.value
                    })
                    data.alarmEvent = obj1
                    break
                case 'third':
                    if (this.trafficForm.sum.trim() === '') {
                        this.$message.warning('请输入发送次数！')
                        return
                    }
                    data.type = 'TrafficEvent'
                    data.sum = Number(this.trafficForm.sum)

                    this.trafficForm.options.forEach(it => {
                        obj2[it.field] = it.value
                    })
                    data.trafficEvent = obj2
                    break
                case 'second':
                    if (this.hostForm.sum.trim() === '') {
                        this.$message.warning('请输入发送次数！')
                        return
                    }
                    data.type = 'HostEvent'
                    data.sum = Number(this.hostForm.sum)

                    this.hostForm.options.forEach(it => {
                        obj3[it.field] = it.value
                    })
                    data.hostEvent = obj3
                    break
                case 'fourth':
                    if (this.appForm.sum.trim() === '') {
                        this.$message.warning('请输入发送次数！')
                        return
                    }
                    data.type = 'AppEvent'
                    data.sum = Number(this.appForm.sum)
                    this.appForm.options.forEach(it => {
                        obj4[it.field] = it.value
                    })
                    data.appEvent = obj4
                    break
            }
            console.log(data, '发送数据')
            releaseRuleForm(data).then(res => {
                this.$message({
                    message: '发布成功',
                    type: 'success'
                })
            }).catch(error => {
                console.log('error' + error)
            })
        }
    }
}
</script>

<style lang="scss" scoped>
* {
    margin: 0;
    padding: 0;
}
.tabs{
    ::v-deep .el-tabs__content{
        padding:0 10px !important;
    }
}
.virtual{
    ::v-deep div{
        display:flex;
        flex-wrap: wrap;
    }
}
.even-content {
    background-color: #111D2B;
    background-image: url("/static/img/content_bg.png");
    background-repeat: no-repeat;
    background-position-x: right;
    background-position-y: 180px;

}
.even-content ::v-deep .el-form-item .el-icon-time:before {
    color: #1cd7fa;
}
.releaseBtn {
    position: absolute;
    top: 10px;
    right: 10px;
}
.cancelBtn {
    position: absolute;
    top: 10px;
    right: 100px;
    &.btn_box{
        background-image: none;
    }
}
.tabs  ::v-deep .el-tabs__header.is-top {
    // margin-bottom: 20px;
}

.tabs ::v-deep  .el-tabs__item {
    font-size: 14px;
    font-weight: 400;
    color: rgba(0,0,0,0.6);
    line-height: 15px;
    // opacity: 0.6;
}

.tabs  ::v-deep  .el-tabs__item.is-active {
    color: #266fe8;
}

.tabs  ::v-deep  .el-tabs__item:hover {
    color: #266fe8;
}

.tabs  ::v-deep  .el-tabs__active-bar {
    background-color: #266fe8;
}

.tabs  ::v-deep  .el-tabs__nav-wrap::after {
    height: 1px;
    background-color: #e7e7e7;
}

.tabs  ::v-deep  .el-tabs__item.is-top {
    padding-left: 10px !important;
    height: 50px;
    line-height: 50px;
}

.el-form.el-form--label-left {
    margin-left: 30px;
}

.el-form  ::v-deep  .el-form-item__label {
    text-align: right;
}

/*校验*/
.tabs  ::v-deep  .el-form-item__error {
    left: 13px;
}

.tabs  ::v-deep  .sum .el-form-item__error {
    left: 104px;
}

.el-form  ::v-deep  .el-input__inner, .el-form  ::v-deep  .el-textarea__inner {
    height: 100%;
}

.el-form-item {
    /*box-sizing: border-box;*/
    margin-bottom: 20px;
}

.w400 {
    width: 400px !important;
    height: 30px;
    line-height: 30px;
}

.w700 {
    width: 500px;
    height: 30px;
    line-height: 30px;
}

.w180 {
    width: 180px;
    height: 34px;
}

.w700.warning_content {
    height: 78px;
}

/*icon 图标*/
.el-form-item  ::v-deep  .el-icon-time:before {
    content: "\E78E";
    color: #c1c1c1;
    position: relative;
    right: -366px;
}

.el-input--prefix  ::v-deep  .el-input__inner {
    padding-left: 15px;
}

.el-select ::v-deep .el-input__inner {
    height: 30px !important;
    line-height: 30px;
}
.container ::v-deep .el-form-item.send-sum >.el-form-item__label:before {
    content: "*";
    color: #f56c6c;
    margin-right: 4px;
}
.container ::v-deep .el-input__icon.el-input__clear {
    line-height: 30px;
}

</style>
