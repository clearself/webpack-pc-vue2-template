<template>
    <div>
        <div class="w100" style="height:100%;" v-if="false">
            <div class="event-content w100" style="height:100%;">
                <div class="table-area" style="min-height:100%;">
                    <div class="ub ub-pj w100">
                        <div class="list-tips">编辑任务</div>
                        <div>
                            <cancel-btn @click="back" title="取 消" />
                            <searchBtn style="margin-left:10px;" title="完 成" @click="finishDialogShow" />
                        </div>
                    </div>
                    <el-divider></el-divider>
                    <el-form :model="addForm" ref="addForm" style="width:50%;" class="task">
                        <el-form-item
                            label="任务名称："
                            :label-width="formLabelWidth"
                            prop="name"
                            :rules="{
                                required: true, message: '请输入', trigger: 'blur'
                            }">
                            <el-input placeholder="请输入" clearable v-model="addForm.name" size="small"></el-input>
                        </el-form-item>
                        <el-form-item
                            label="任务类型："
                            prop="taskType"
                            :label-width="formLabelWidth"
                            :rules="{
                                required: true, message: '请选择', trigger: 'change'
                            }">
                            <el-select v-model="addForm.taskType" filterable placeholder="请选择" style="width:100%;"  size="small" clearable>
                                <el-option v-for="(item, index) in types" :key="index" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item
                            label="执行方式："
                            prop="runMethod"
                            :label-width="formLabelWidth"
                            :rules="{
                                required: true, message: '请选择', trigger: 'change'
                            }">
                            <el-select v-model="addForm.runMethod" filterable placeholder="请选择" style="width:100%;"  size="small" clearable>
                                <el-option v-for="(item, index) in runMethods" :key="index" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item
                            v-if="addForm.runMethod==1"
                            label="开始时间："
                            prop="time"
                            :label-width="formLabelWidth"
                            :rules="{
                                required: true, message: '请选择', trigger: 'change'
                            }">
                            <el-date-picker v-model="addForm.time" type="datetime" placeholder="选择开始时间" style="width:100%;" value-format="yyyy-MM-dd HH:mm:ss"  size="small" clearable></el-date-picker>
                        </el-form-item>
                        <el-form-item
                            v-if="addForm.runMethod==2"
                            label="执行时间："
                            prop="type"
                            :label-width="formLabelWidth"
                            :rules="{
                                required: true, message: '请选择', trigger: 'change'
                            }">
                            <el-select v-model="addForm.type" filterable placeholder="请选择" style="width:100%;"  size="small" clearable @change="changeDoTime">
                                <el-option v-for="(item, index) in timeTypes" :key="index" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item
                            v-if="addForm.type!==''"
                            label="扫描时间："
                            prop="time"
                            :label-width="formLabelWidth"
                            :rules="{
                                required: true, message: '请选择', trigger: 'change'
                            }">
                            <el-time-picker v-model="addForm.time" placeholder="选择时间" style="width:100%;" value-format="HH:mm:ss"  size="small" clearable></el-time-picker>
                        </el-form-item>
                        <el-form-item
                            v-if="addForm.type===1"
                            label="星期："
                            prop="day"
                            :label-width="formLabelWidth"
                            :rules="{
                                required: true, message: '请选择', trigger: 'change'
                            }">
                            <el-radio-group v-model="addForm.day" >
                                <el-radio :label="1">星期一</el-radio>
                                <el-radio :label="2">星期二</el-radio>
                                <el-radio :label="3">星期三</el-radio>
                                <el-radio :label="4">星期四</el-radio>
                                <el-radio :label="5">星期五</el-radio>
                                <el-radio :label="6">星期六</el-radio>
                                <el-radio :label="7">星期日</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item
                            v-if="addForm.type===2"
                            label="日期："
                            prop="day"
                            :label-width="formLabelWidth"
                            :rules="{
                                required: true, message: '请选择', trigger: 'change'
                            }">
                            <el-radio-group v-model="addForm.day">
                                <el-radio :label="1">01</el-radio>
                                <el-radio :label="2">02</el-radio>
                                <el-radio :label="3">03</el-radio>
                                <el-radio :label="4">04</el-radio>
                                <el-radio :label="5">05</el-radio>
                                <el-radio :label="6">06</el-radio>
                                <el-radio :label="7">07</el-radio>
                                <el-radio :label="8">08</el-radio>
                                <el-radio :label="9">09</el-radio>
                                <el-radio :label="10">10</el-radio>
                                <el-radio :label="11">11</el-radio>
                                <el-radio :label="12">12</el-radio>
                                <el-radio :label="13">13</el-radio>
                                <el-radio :label="14">14</el-radio>
                                <el-radio :label="15">15</el-radio>
                                <el-radio :label="16">16</el-radio>
                                <el-radio :label="17">17</el-radio>
                                <el-radio :label="18">18</el-radio>
                                <el-radio :label="19">19</el-radio>
                                <el-radio :label="20">20</el-radio>
                                <el-radio :label="21">21</el-radio>
                                <el-radio :label="22">22</el-radio>
                                <el-radio :label="23">23</el-radio>
                                <el-radio :label="24">24</el-radio>
                                <el-radio :label="25">25</el-radio>
                                <el-radio :label="26">07</el-radio>
                                <el-radio :label="27">27</el-radio>
                                <el-radio :label="28">28</el-radio>
                                <el-radio :label="29">29</el-radio>
                                <el-radio :label="30">30</el-radio>
                                <el-radio :label="31">31</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item
                            label="引擎名称："
                            prop="engineType"
                            :label-width="formLabelWidth"
                            :rules="{
                                required: true, message: '请选择', trigger: 'change'
                            }">
                            <el-select v-model="addForm.engineType" filterable placeholder="请选择" style="width:100%;"  size="small" clearable>
                                <el-option v-for="(item, index) in engineTypes" :key="index" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item
                            label="扫描目标类型："
                            prop="scanType"
                            :label-width="formLabelWidth"
                            :rules="{
                                required: true, message: '请选择', trigger: 'change'
                            }">
                            <div class="ub ub-pj ub-ac w100">
                                <div style="width:100%">
                                    <el-select v-model="addForm.scanType" filterable placeholder="请选择" style="width:100%;"  size="small" clearable @change="addForm.objId=''">
                                        <el-option v-for="(item, index) in scanTypes" :key="index" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                </div>
                                <div style="position: absolute;right:-60px;">
                                    <el-checkbox v-model="addForm.checked">IPV6</el-checkbox>
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item
                            v-if="addForm.scanType!==''"
                            :label="addForm.scanType == 0 ?'资产：':'业务系统：'"
                            prop="objId"
                            :label-width="formLabelWidth"
                            :rules="{
                                required: true, message: '请选择', trigger: 'change'
                            }">
                            <el-select v-model="addForm.objId" filterable placeholder="请选择" style="width:100%;"  size="small" clearable>
                                <el-option v-for="(item, index) in addForm.scanType==0?assets:systems" :key="index" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item
                            label="端口类型："
                            prop="portType"
                            :label-width="formLabelWidth"
                            :rules="{
                                required: true, message: '请选择', trigger: 'change'
                            }">
                            <el-select v-model="addForm.portType" filterable placeholder="请选择" style="width:100%;"  size="small" clearable  @change="addForm.port=''">
                                <el-option v-for="(item, index) in portTypes" :key="index" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item
                            v-if="addForm.portType==1||addForm.portType==3"
                            :label="addForm.portType==1?'常用端口：':'自定义端口：'"
                            :label-width="formLabelWidth"
                            prop="port"
                            :rules="{
                                required: true, message: '请输入', trigger: 'blur'
                            }">
                            <el-input type="textarea" placeholder="请输入" clearable v-model="addForm.port" size="small"></el-input>
                        </el-form-item>
                        <el-form-item
                            label="扫描策略："
                            prop="policyId"
                            :label-width="formLabelWidth"
                            :rules="{
                                required: true, message: '请选择', trigger: 'change'
                            }">
                            <el-select v-model="addForm.policyId" filterable placeholder="请选择" style="width:100%;" size="small" clearable >
                                <el-option v-for="item in policys" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
        <el-dialog title="提示" :visible.sync="finishDialog" width="700px" custom-class="common-dialog">
            <span>确定完成吗？</span>
            <span slot="footer" class="dialog-footer">
                <searchBtn title="确 定" @click="finishConfim" />
                <div class="cancelBtn" style="margin-left: 10px;" @click="finishDialog = false">取 消</div>
            </span>
        </el-dialog>
        <el-drawer :visible.sync="addDialog" direction="rtl" :size="720" title="添加新任务" :before-close="handleClose" custom-class="drawer-dialog">
            <el-form :model="addForm" ref="addForm" class="task" label-position="top">
                <div class="ub ub-pj">
                    <el-form-item
                        label="任务名称："
                        :label-width="formLabelWidth"
                        prop="name"
                        :rules="{
                            required: true, message: '请输入', trigger: 'blur'
                        }">
                        <el-input placeholder="请输入" clearable v-model="addForm.name" size="small" style="width:300px"></el-input>
                    </el-form-item>
                    <el-form-item
                        label="任务类型："
                        prop="taskType"
                        :label-width="formLabelWidth"
                        :rules="{
                            required: true, message: '请选择', trigger: 'change'
                        }">
                        <el-select v-model="addForm.taskType" filterable placeholder="请选择" style="width:300px;"  size="small" clearable>
                            <el-option v-for="(item, index) in types" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="ub ub-pj">
                    <el-form-item
                        label="执行方式："
                        prop="runMethod"
                        :label-width="formLabelWidth"
                        :rules="{
                            required: true, message: '请选择', trigger: 'change'
                        }">
                        <el-select v-model="addForm.runMethod" filterable placeholder="请选择" style="width:300px;"  size="small" clearable>
                            <el-option v-for="(item, index) in runMethods" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        v-if="addForm.runMethod==1"
                        label="开始时间："
                        prop="time"
                        :label-width="formLabelWidth"
                        :rules="{
                            required: true, message: '请选择', trigger: 'change'
                        }">
                        <el-date-picker v-model="addForm.time" type="datetime" placeholder="选择开始时间" style="width:300px;" value-format="yyyy-MM-dd HH:mm:ss"  size="small" clearable></el-date-picker>
                    </el-form-item>
                    <el-form-item
                        v-if="addForm.runMethod==2"
                        label="执行时间："
                        prop="type"
                        :label-width="formLabelWidth"
                        :rules="{
                            required: true, message: '请选择', trigger: 'change'
                        }">
                        <el-select v-model="addForm.type" filterable placeholder="请选择" style="width:300px;"  size="small" clearable @change="changeDoTime">
                            <el-option v-for="(item, index) in timeTypes" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <el-form-item
                    v-if="addForm.type!==''"
                    label="扫描时间："
                    prop="time"
                    :label-width="formLabelWidth"
                    :rules="{
                        required: true, message: '请选择', trigger: 'change'
                    }">
                    <el-time-picker v-model="addForm.time" placeholder="选择时间" style="width:300px;" value-format="HH:mm:ss"  size="small" clearable></el-time-picker>
                </el-form-item>
                <el-form-item
                    v-if="addForm.type===1"
                    label="星期："
                    prop="day"
                    :label-width="formLabelWidth"
                    :rules="{
                        required: true, message: '请选择', trigger: 'change'
                    }">
                    <div class="attack-box">
                        <div class="show-box" ref="show-box-add">
                            <div class="wrapper clearfix" ref="wrapper-add">
                                <div class="attack-item" v-for="(item) in dayList" :class="{'active': item.isfold}" :key="item.name" @click="handleClickItem(item.val)">
                                    {{item.name}}
                                    <span class="checkd-img">
                                        <i class="el-icon-check"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item
                    v-if="addForm.type===2"
                    label="日期："
                    prop="day"
                    :label-width="formLabelWidth"
                    :rules="{
                        required: true, message: '请选择', trigger: 'change'
                    }">

                    <div class="attack-box">
                        <div class="show-box" ref="show-box-add">
                            <div class="wrapper clearfix" ref="wrapper-add">
                                <div class="attack-item" v-for="(item) in mouthList" :class="{'active': item.isfold}" :key="item.name" @click="handleClickItem1(item.val)">
                                    {{item.name}}
                                    <span class="checkd-img">
                                        <i class="el-icon-check"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-form-item>
                <div class="ub ub-pj">
                    <el-form-item
                        label="引擎名称："
                        prop="engineType"
                        :label-width="formLabelWidth"
                        :rules="{
                            required: true, message: '请选择', trigger: 'change'
                        }">
                        <el-select v-model="addForm.engineType" filterable placeholder="请选择" style="width:300px;"  size="small" clearable>
                            <el-option v-for="(item, index) in engineTypes" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        label="扫描目标类型："
                        prop="scanType"
                        :label-width="formLabelWidth"
                        :rules="{
                            required: true, message: '请选择', trigger: 'change'
                        }">
                        <div class="ub ub-pj ub-ac w100">
                            <div style="width:300px">
                                <el-select v-model="addForm.scanType" filterable placeholder="请选择" style="width:300px;"  size="small" clearable @change="addForm.objId=''">
                                    <el-option v-for="(item, index) in scanTypes" :key="index" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </div>
                            <div style="position: absolute;right:0px;top:-30px;">
                                <el-checkbox v-model="addForm.checked">IPV6</el-checkbox>
                            </div>
                        </div>
                    </el-form-item>
                </div>
                <el-form-item
                    v-if="addForm.scanType!==''"
                    :label="addForm.scanType == 0 ?'资产：':'业务系统：'"
                    prop="objId"
                    :label-width="formLabelWidth"
                    :rules="{
                        required: true, message: '请选择', trigger: 'change'
                    }">
                    <el-select v-model="addForm.objId" filterable placeholder="请选择" style="width:300px;"  size="small" clearable>
                        <el-option v-for="(item, index) in addForm.scanType==0?assets:systems" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="端口类型："
                    prop="portType"
                    :label-width="formLabelWidth"
                    :rules="{
                        required: true, message: '请选择', trigger: 'change'
                    }">
                    <el-select v-model="addForm.portType" filterable placeholder="请选择" style="width:300px;"  size="small" clearable  @change="addForm.port=''">
                        <el-option v-for="(item, index) in portTypes" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    v-if="addForm.portType==1||addForm.portType==3"
                    :label="addForm.portType==1?'常用端口：':'自定义端口：'"
                    :label-width="formLabelWidth"
                    prop="port"
                    :rules="{
                        required: true, message: '请输入', trigger: 'blur'
                    }">
                    <el-input type="textarea" placeholder="请输入" clearable v-model="addForm.port" size="small"></el-input>
                </el-form-item>
                <el-form-item
                    label="扫描策略："
                    prop="policyId"
                    :label-width="formLabelWidth"
                    :rules="{
                        required: true, message: '请选择', trigger: 'change'
                    }">
                    <el-select v-model="addForm.policyId" filterable placeholder="请选择" style="width:300px;" size="small" clearable >
                        <el-option v-for="item in policys" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div style="position:fixed;bottom:10px;right:20px">
                <el-button @click="back" size="small">取消</el-button>
                <el-button @click="finishDialogShow" size="small" type="primary">确定</el-button>
            </div>
        </el-drawer>
    </div>
</template>

<script>
import {
    get_policy,
    get_assets,
    get_system,
    finish_task_update
} from '../../server/leak/api.js'
export default {
    name: 'TaskEdit',
    data() {
        return {
            addDialog: false,
            dayList: [
                { name: '星期一', isfold: false, val: 1 },
                { name: '星期二', isfold: false, val: 2 },
                { name: '星期三', isfold: false, val: 3 },
                { name: '星期四', isfold: false, val: 4 },
                { name: '星期五', isfold: false, val: 5 },
                { name: '星期六', isfold: false, val: 6 },
                { name: '星期日', isfold: false, val: 7 }],
            mouthList: [
                { name: '01', isfold: false, val: 1 },
                { name: '02', isfold: false, val: 2 },
                { name: '03', isfold: false, val: 3 },
                { name: '04', isfold: false, val: 4 },
                { name: '05', isfold: false, val: 5 },
                { name: '06', isfold: false, val: 6 },
                { name: '07', isfold: false, val: 7 },
                { name: '08', isfold: false, val: 8 },
                { name: '09', isfold: false, val: 9 },
                { name: '10', isfold: false, val: 10 },
                { name: '11', isfold: false, val: 11 },
                { name: '12', isfold: false, val: 12 },
                { name: '13', isfold: false, val: 13 },
                { name: '14', isfold: false, val: 14 },
                { name: '15', isfold: false, val: 15 },
                { name: '16', isfold: false, val: 16 },
                { name: '17', isfold: false, val: 17 },
                { name: '18', isfold: false, val: 18 },
                { name: '19', isfold: false, val: 19 },
                { name: '20', isfold: false, val: 20 },
                { name: '21', isfold: false, val: 21 },
                { name: '22', isfold: false, val: 22 },
                { name: '23', isfold: false, val: 23 },
                { name: '24', isfold: false, val: 24 },
                { name: '25', isfold: false, val: 25 },
                { name: '26', isfold: false, val: 26 },
                { name: '27', isfold: false, val: 27 },
                { name: '28', isfold: false, val: 28 },
                { name: '29', isfold: false, val: 29 },
                { name: '30', isfold: false, val: 30 },
                { name: '31', isfold: false, val: 31 }],
            finishDialog: false,
            policys: [],
            portTypes: [
                {
                    label: '常用端口',
                    value: 1
                }, {
                    label: '全端口',
                    value: 2
                }, {
                    label: '自定义端口',
                    value: 3
                }
            ],
            assets: [],
            systems: [],
            scanTypes: [
                {
                    label: '资产',
                    value: 0
                }, {
                    label: '业务系统',
                    value: 1
                }
            ],
            engineTypes: [
                {
                    label: '天境漏扫',
                    value: 1
                }
            ],
            timeTypes: [
                {
                    label: '每天执行',
                    value: 0
                }, {
                    label: '每周执行',
                    value: 1
                }, {
                    label: '每月执行',
                    value: 2
                }
            ],
            runMethods: [
                {
                    label: '立即执行',
                    value: 0
                }, {
                    label: '定时任务',
                    value: 1
                }, {
                    label: '周期任务',
                    value: 2
                }

            ],
            types: [
                {
                    label: '主机漏洞',
                    value: 0
                }, {
                    label: '基线漏洞',
                    value: 1
                }, {
                    label: '网站漏洞',
                    value: 2
                }, {
                    label: '口令猜测',
                    value: 3
                }

            ],
            addForm: {
                name: '',
                taskType: '',
                runMethod: '',
                runConfig: '',
                engineType: '',
                scanType: '',
                objId: '',
                portType: '',
                port: '',
                policyId: '',
                checked: false,
                type: '', // 执行时间类型
                time: '', // 扫描时间
                day: ''
            },
            formLabelWidth: '110px'
        }
    },
    computed: {
        // eslint-disable-next-line vue/return-in-computed-property
        runConfig() {
            if (this.addForm.runMethod == 1) {
                return this.addForm.time
            } else if (this.addForm.runMethod == 2) {
                if (this.addForm.type == 0) {
                    return JSON.stringify({
                        type: this.addForm.type,
                        time: this.addForm.time
                    })
                } else {
                    return JSON.stringify({
                        type: this.addForm.type,
                        day: this.addForm.day,
                        time: this.addForm.time
                    })
                }
            }
        }
    },
    created() {
        // let taskInfo = this.$getlocalStorage('taskInfo')
        // console.log('taskInfo', taskInfo)
        // if (taskInfo !== '') {
        //     this.addForm = {
        //         id: taskInfo.id,
        //         name: taskInfo.name,
        //         taskType: taskInfo.taskType,
        //         runMethod: taskInfo.runMethod,
        //         engineType: taskInfo.engineType,
        //         scanType: taskInfo.scanType,
        //         objId: taskInfo.objId,
        //         portType: taskInfo.portType,
        //         port: taskInfo.port,
        //         policyId: taskInfo.policyId,
        //         checked: taskInfo.checked,
        //         type: taskInfo.type ? taskInfo.type : '',
        //         time: taskInfo.time ? taskInfo.time : '',
        //         day: taskInfo.day ? taskInfo.day : ''
        //     }
        // }
    },
    mounted() {
        // this.$nextTick(() => {
        //     this.init_policy()
        //     this.init_assets()
        //     this.init_system()
        // })
    },
    methods: {
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    this.addDialog = false
                    done()
                })
                .catch(_ => {})
        },
        handleClickItem(val) {
            this.dayList.map(item => {
                if (item.val == val) {
                    item.isfold = true
                } else {
                    item.isfold = false
                }
            })
            this.addForm.day = val
        },
        handleClickItem1(val) {
            this.mouthList.map(item => {
                if (item.val == val) {
                    item.isfold = true
                } else {
                    item.isfold = false
                }
            })
            this.addForm.day = val
        },
        init() {
            let taskInfo = this.$getlocalStorage('taskInfo')
            console.log('taskInfo', taskInfo)
            if (taskInfo !== '') {
                this.addForm = {
                    id: taskInfo.id,
                    name: taskInfo.name,
                    taskType: taskInfo.taskType,
                    runMethod: taskInfo.runMethod,
                    engineType: taskInfo.engineType,
                    scanType: taskInfo.scanType,
                    objId: taskInfo.objId,
                    portType: taskInfo.portType,
                    port: taskInfo.port,
                    policyId: taskInfo.policyId,
                    checked: taskInfo.checked,
                    type: taskInfo.type ? taskInfo.type : '',
                    time: taskInfo.time ? taskInfo.time : '',
                    day: taskInfo.day ? taskInfo.day : ''
                }
            }
            this.init_policy()
            this.init_assets()
            this.init_system()
            this.addDialog = true
        },
        back() {
            this.addDialog = false
        },
        finishDialogShow() {
            this.$refs.addForm.validate((valid) => {
                if (!valid) {
                    console.log('error submit!!')
                    return false
                } else {
                    this.finishDialog = true
                }
            })
        },
        finishConfim() {
            let data = {
                queryData: {},
                paramsData: {
                    name: this.addForm.name,
                    taskType: this.addForm.taskType,
                    runMethod: this.addForm.runMethod,
                    runConfig: this.runConfig,
                    engineType: this.addForm.engineType,
                    scanType: this.addForm.scanType,
                    objId: this.addForm.objId,
                    portType: this.addForm.portType,
                    port: this.addForm.port,
                    policyId: this.addForm.policyId,
                    isIpv6: this.addForm.checked ? 1 : 0
                }
            }
            console.log('data', data)
            //
            finish_task_update(data).then(res => {
                this.finishDialog = false
                console.log('任务完成', res)
                this.$message({
                    message: '操作成功！',
                    type: 'success'
                })
                setTimeout(() => {
                    this.$router.go(-1)
                }, 1500)
            }).catch(err => {
                console.log(err, 'err')
            })
        },
        changeDoTime() {
            this.addForm.day = ''
            this.addForm.time = ''
        },
        init_assets() {
            this.assets = []
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_assets(data).then(res => {
                console.log('资产', res)
                if (res.length > 0) {
                    this.assets = res.map(item => {
                        return {
                            label: item.name,
                            value: item.id
                        }
                    })
                }
            }).catch(error => {
                console.log(error + 'error')
            })
        },
        init_system() {
            this.systems = []
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_system(data).then(res => {
                console.log('系统', res)
                if (res.length > 0) {
                    this.systems = res.map(item => {
                        return {
                            label: item.system_name,
                            value: item.id
                        }
                    })
                }
            }).catch(error => {
                console.log(error + 'error')
            })
        },
        init_policy() {
            this.policys = []
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_policy(data).then(res => {
                console.log('策略', res)
                if (res.length > 0) {
                    res.map(item => {
                        this.policys.push({
                            label: item.policyName,
                            value: item.policyID
                        })
                    })
                }
            }).catch(error => {
                console.log(error + 'error')
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.el-divider{
    background-color: rgba(28,215,250,.2);
    margin-top: 0;
}
.el-form-item{
    margin-bottom: 20px;
}
.task ::v-deep .el-radio{
    margin: 5px 20px 5px 0;
}
.task ::v-deep .el-radio__inner{
    border: 1px solid #00e9ff;
    border-radius: 3px;
    background-color: rgba(0,0,0,0);
}

.task ::v-deep .el-radio__label{
    font-size: 12px;
    color:#00e9ff;
}
.task ::v-deep .el-radio__input.is-checked .el-radio__inner::after{
    width: 100%;
    height: 100%;
    border-radius: 3px;
    background-color: #00e9ff;
}
.task ::v-deep .el-checkbox__label{
    font-size: 12px;
    color:#00e9ff;
}
.task ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner,
.task ::v-deep .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #00e9ff;
    border-color: #00e9ff;
}
.task ::v-deep .el-checkbox__inner{
    border-color: #00e9ff;
}
.task ::v-deep .el-form-item__label{
    text-align: left;

}
</style>
