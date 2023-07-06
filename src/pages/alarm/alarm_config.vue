<template>
    <div class="list">
        <SearchTop @search="searchCheck" @reset="reset" style="border-top-left-radius: 0;border-top-right-radius: 0;box-shadow: none;">
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params">
                    <el-form-item label="配置名称：" label-width="90px">
                        <el-input
                            placeholder="请输入"
                            clearable
                            v-model="get_params.name"
                            @keyup.enter.native="searchCheck"
                            size="small"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params">
                    <el-form-item label="创建人：" label-width="90px">
                        <el-select
                            v-model="get_params.createUser"
                            filterable
                            placeholder="请选择"
                            style="width: 100%;"
                            size="small"
                            clearable>
                            <el-option
                                v-for="(item, index) in allUsers"
                                :key="index"
                                :label="item.chineseName"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params">
                    <el-form-item label="创建时间：" label-width="90px">
                        <el-date-picker
                            size="small"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            :default-time="['00:00:00', '23:59:59']"
                            v-model="sayTimes"
                            class="riqi"
                            style="width: 100%;"
                            prefix-icon="iconfont icon-riqi"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            :clearable="false"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                </el-form>
            </el-col>
        </SearchTop>
        <div class="list-container">
            <div class="ub ub-pj w100 mb-1 ub-ac">
                <div class="list-tips">外发/提示音</div>
                <div>
                    <el-button icon="el-icon-plus" type="primary" size="small" @click="addDialog = true" v-per="['alarm_sound_add']">添加配置</el-button>
                    <el-button style="margin-left: 10px;" icon="el-icon-delete" size="small" type="danger" @click="handleDeleteAll" v-per="['alarm_sound_del']">删除</el-button>
                </div>
            </div>
            <el-table
                ref="multipleTable"
                v-loading="loading"
                class='bigTable'
                :data="tableData"
                border
                stripe
                tooltip-effect="dark"
                :row-class-name="tableRowClassName"
                :height="tabHeight"
                :row-style="{ height: '32px' }"
                :header-row-style="{ height: '32px' }"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="30" align="center"></el-table-column>
                <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                </el-table-column>
                <el-table-column prop="name" label="配置名称" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="des" label="动作" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="createUserCN" label="创建人"  width="200">
                </el-table-column>
                <el-table-column prop="createTime" label="创建日期" width="160">
                </el-table-column>
                <el-table-column label="操作" align="center" width="100">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" @click="handleEdit(scope.row)" v-per="['alarm_sound_edit']">编辑</el-button>
                        <el-button size="small" type="text" @click="handleDelete(scope.row)" v-per="['alarm_sound_del']">删除</el-button>
                    </template>
                </el-table-column>

            </el-table>
            <pagination :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size"  style="padding-top: 10px;" @pagination="get_data" v-show="total_num>0"/>
        </div>

        <!--增加对象-->
        <el-dialog title="添加配置" :visible.sync="addDialog" width="700px" custom-class="common-dialog">
            <el-form :model="addForm" :rules="rules" ref="addForm" label-position="top">
                <el-form-item label="配置名称：" prop="name" :label-width="formLabelWidth">
                    <el-input placeholder="请输入" clearable v-model="addForm.name" size="small"></el-input>
                </el-form-item>
                <el-form-item label="配置描述：" prop="des" :label-width="formLabelWidth">
                    <el-input
                        type="textarea"
                        :rows="3"
                        placeholder="请输入"
                        clearable
                        v-model="addForm.des"
                        size="small"></el-input>
                </el-form-item>
                <el-form-item label="配置动作：" prop="type" :label-width="formLabelWidth">
                    <el-select style="width: 100%;" size="small" clearable v-model="addForm.type" filterable placeholder="请选择">
                        <el-option label="事件提示语" value="0"></el-option>
                        <el-option label="发送syslog" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="addForm.type !== ''" label="规则范围：" prop="rules" :label-width="formLabelWidth">
                    <div class="rule-condition ub ub-ac">
                        <div class="left-condition">AND</div>
                        <div class="ub ub-ver">
                            <div class="part-condition" v-for="(_item, _index) in addForm.rules" :key="_index">
                                <el-select filterable clearable v-model="_item.field" size="mini" style="width: 100px;" placeholder="请选择" @change="()=>{_item.val = ''}">
                                    <el-option v-for="(item, index) in fieldsList" :key="index" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                                <span style="color: #dddddd;"> — </span>
                                <el-select filterable clearable v-model="_item.condition" size="mini" style="margin: 0;width: 100px;" placeholder="请选择" @change="_item.val=''">
                                    <el-option v-for="(item, index) in conditionList" :key="index" :label="item.name" :value="item.value"></el-option>
                                </el-select>
                                <span style="color: #dddddd;"> — </span>
                                <el-input v-if="showValue(_item) === 'text'&&(_item.condition!=4&&_item.condition!=5)" v-model="_item.val" clearable size="mini" style="width: 280px;" placeholder="请输入"></el-input>
                                <el-select v-if="showValue(_item) === 'select'&&(_item.condition!=4&&_item.condition!=5)"  placeholder="请选择" style="width: 280px;" v-model="_item.val" size="mini">
                                    <el-option v-for="(tag,_index) in _item.item" :label="tag.value" :value="tag.key" :key="_index"></el-option>
                                </el-select>
                                <i
                                    @click.stop="deleteOneRule(_index)"
                                    v-if="_index != 0"
                                    class="el-icon-remove-outline"
                                    style="margin-left: 10px;font-size: 14px;color: #ff0000;cursor: pointer;"></i>
                                <i class="el-icon-circle-plus-outline" style="margin-left: 10px;font-size: 14px;color: #266fe8;cursor: pointer;" @click="addOneRule" v-if="_index == addForm.rules.length -1"></i>
                            </div>
                            <!-- <p class="del-btn">
                                <i class="el-icon-circle-plus-outline" style="font-size:14px;color:#266fe8;margin-left:10px" @click="addOneRule"></i>
                            </p> -->
                        </div>
                    </div>
                </el-form-item>
                <el-form-item v-if="addForm.type !== '' && addForm.type == 0" key="a" label="提示语：" prop="warn" :label-width="formLabelWidth">
                    <el-select style="width: 100%;" size="small" clearable v-model="addForm.warn" filterable placeholder="请选择">
                        <el-option v-for="(item,index) in soundList" :key="index" :label="item.label" :value="item.value">
                            <span style="float: left;">{{ item.label }}</span>
                            <span @click.stop="listenMisuc(item)" style="float: right; font-size: 12px; color: #3aa6e4;">试听</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="parseInt(addForm.type) == 1" key="b" label="IP地址：" prop="ip" :label-width="formLabelWidth">
                    <el-input placeholder="请输入" clearable v-model.trim="addForm.ip" size="small"></el-input>
                </el-form-item>
                <el-form-item v-if="parseInt(addForm.type) == 1" key="c" label="端口：" prop="port" :label-width="formLabelWidth">
                    <el-input placeholder="请输入" clearable v-model.trim="addForm.port" size="small"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialog=false" size="small">取消</el-button>
                <el-button type="primary" @click="submitForm('addForm')" size="small">确认</el-button>
            </span>
        </el-dialog>
        <!--编辑对象-->
        <el-dialog title="编辑配置" :visible.sync="editDialog" width="700px" custom-class="common-dialog">
            <el-form :model="editForm" :rules="rules" ref="editForm" label-position="top">
                <el-form-item label="配置名称：" prop="name" :label-width="formLabelWidth">
                    <el-input placeholder="请输入" clearable v-model="editForm.name" size="small"></el-input>
                </el-form-item>
                <el-form-item label="配置描述：" prop="des" :label-width="formLabelWidth">
                    <el-input
                        type="textarea"
                        :rows="3"
                        placeholder="请输入"
                        clearable
                        v-model="editForm.des"
                        size="small"></el-input>
                </el-form-item>
                <el-form-item label="配置动作：" prop="type" :label-width="formLabelWidth">
                    <el-select style="width: 100%;" size="small" clearable v-model="editForm.type" filterable placeholder="请选择">
                        <el-option label="事件提示语" value="0"></el-option>
                        <el-option label="发送syslog" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="editForm.type !== ''" label="规则范围：" prop="rules" :label-width="formLabelWidth">
                    <div class="rule-condition ub ub-ac">
                        <div class="left-condition">AND</div>
                        <div class="ub ub-ver">
                            <div class="part-condition" v-for="(_item, _index) in editForm.rules" :key="_index">
                                <el-select filterable clearable v-model="_item.field" size="mini" style="width: 100px;" placeholder="请选择"  @change="()=>{_item.val = ''}">
                                    <el-option v-for="(item, index) in fieldsList" :key="index" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                                <span style="margin: 0 3px;color: #dddddd;">—</span>
                                <el-select filterable clearable v-model="_item.condition" size="mini" style="margin: 0;width: 100px;" placeholder="请选择" @change="_item.val=''">
                                    <el-option v-for="(item, index) in conditionList" :key="index" :label="item.name" :value="item.value"></el-option>
                                </el-select>
                                <span v-if="showValue(_item) === 'text'&&(_item.condition!=4&&_item.condition!=5)" style="margin: 0 3px;color: #dddddd;">—</span>
                                <el-input v-if="showValue(_item) === 'text'&&(_item.condition!=4&&_item.condition!=5)" v-model="_item.val" clearable size="mini" style="width: 280px;" placeholder="请输入"></el-input>
                                <span v-if="showValue(_item) === 'select'&&(_item.condition!=4&&_item.condition!=5)" style="margin: 0 3px;color: #dddddd;">—</span>
                                <el-select v-if="showValue(_item) === 'select'&&(_item.condition!=4&&_item.condition!=5)"  placeholder="请选择" style="width: 280px;" v-model="_item.val" size="mini">
                                    <el-option v-for="(tag,_index) in _item.item" :label="tag.value" :value="tag.key" :key="_index"></el-option>
                                </el-select>
                                <i
                                    @click.stop="deleteOneRuleEdit(_index)"
                                    v-if="_index != 0"
                                    class="el-icon-remove-outline"
                                    style="margin-left: 10px;font-size: 14px;color: #ff0000;cursor: pointer;"></i>
                                <i class="el-icon-circle-plus-outline" style="margin-left: 10px;font-size: 14px;color: #266fe8;cursor: pointer;" @click="addOneRuleEdit" v-if="_index == editForm.rules.length -1"></i>
                            </div>
                            <!-- <p class="del-btn">
                                <i class="el-icon-circle-plus-outline" style="font-size:14px;color:#266fe8;margin-left:10px" @click="addOneRuleEdit"></i>
                            </p> -->
                        </div>
                    </div>
                </el-form-item>
                <el-form-item v-if="editForm.type !== '' && editForm.type == 0" key="aa" label="提示语：" prop="warn" :label-width="formLabelWidth">
                    <el-select style="width: 100%;" size="small" clearable v-model="editForm.warn" filterable placeholder="请选择">
                        <el-option v-for="(item,index) in soundList" :key="index" :label="item.label" :value="item.value">
                            <span style="float: left;">{{ item.label }}</span>
                            <span @click.stop="listenMisuc(item)" style="float: right; font-size: 12px; color: #3aa6e4;">试听</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="parseInt(editForm.type) == 1" key="bb" label="IP地址：" prop="ip" :label-width="formLabelWidth">
                    <el-input placeholder="请输入" clearable v-model="editForm.ip" size="small"></el-input>
                </el-form-item>
                <el-form-item v-if="parseInt(editForm.type) == 1" key="cc" label="端口：" prop="port" :label-width="formLabelWidth">
                    <el-input placeholder="请输入" clearable v-model="editForm.port" size="small"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialog=false" size="small">取消</el-button>
                <el-button type="primary" @click="submitFormEdit('editForm')" size="small">确认</el-button>
            </span>
        </el-dialog>
        <!--删除资源-->
        <DeleteDialog
            :dialogVisible = deleteDialog
            @delete="handleDeleteFun"
            @cancel="deleteDialog = false">
        </DeleteDialog>
        <audio ref="alarm" preload="preload">
            <source :src="alarm" type="audio/wav">
        </audio>
        <audio ref="alarm2" preload="preload">
            <source :src="alarm2" type="audio/wav">
        </audio>
        <audio ref="planeBells" preload="preload">
            <source :src="planeBells" type="audio/wav">
        </audio>
        <audio ref="alarmBells" preload="preload">
            <source :src="alarmBells" type="audio/wav">
        </audio>
        <audio ref="oh" preload="preload">
            <source :src="oh" type="audio/wav">
        </audio>
        <audio ref="waterDrop" preload="preload">
            <source :src="waterDrop" type="audio/wav">
        </audio>
        <audio ref="dripDrip" preload="preload">
            <source :src="dripDrip" type="audio/wav">
        </audio>
        <audio ref="danger" preload="preload">
            <source :src="danger" type="audio/wav">
        </audio>
        <audio ref="systemAlarm" preload="preload">
            <source :src="systemAlarm" type="audio/wav">
        </audio>
        <audio ref="signal" preload="preload">
            <source :src="signal" type="audio/wav">
        </audio>
        <audio ref="inDanger" preload="preload">
            <source :src="inDanger" type="audio/wav">
        </audio>
        <audio ref="bells" preload="preload">
            <source :src="bells" type="audio/wav">
        </audio>
    </div>
</template>

<script>
import {
    getAlarmUsers,
    getAlarmConfigTable,
    deleteAlarmConfigTable,
    getConfigCondition,
    getAlarmFields,
    saveAlarmConfig,
    updateAlarmConfig
} from '../../server/alarm/define.js'

export default {
    name: 'AlarmConfig',
    data() {
        return {
            tabHeight: document.body.clientHeight - 290,
            alarm: require('../common/audio/警报.wav'),
            alarm2: require('../common/audio/警报2.wav'),
            planeBells: require('../common/audio/飞机上广播的钟声.wav'),
            alarmBells: require('../common/audio/警铃.wav'),
            oh: require('../common/audio/哦哦提示.wav'),
            waterDrop: require('../common/audio/水滴.wav'),
            dripDrip: require('../common/audio/水滴滴答.wav'),
            danger: require('../common/audio/危险信号.wav'),
            systemAlarm: require('../common/audio/系统告警.wav'),
            signal: require('../common/audio/信号.wav'),
            inDanger: require('../common/audio/遇到险情.wav'),
            bells: require('../common/audio/钟声.wav'),
            fileList: [],
            data_id: '',
            editItemDialog: false,
            file_num: 0,
            arr: [{}, {}],

            addDialog: false,
            addForm: {
                name: '',
                des: '',
                type: '',
                rules: [
                    {
                        field: '',
                        condition: '',
                        val: ''
                    }
                ],
                warn: '',
                ip: '',
                port: ''
            },
            editForm: {
                id: '',
                name: '',
                des: '',
                type: '',
                rules: [],
                warn: '',
                ip: '',
                port: ''
            },
            allUsers: [],
            conditionList: [],
            fieldsList: [],
            recordId: '',
            rules: {
                name: [{
                    required: true,
                    message: '请输入',
                    trigger: 'blur'
                }],
                des: [{
                    required: true,
                    message: '请输入',
                    trigger: 'blur'
                }],
                type: [{
                    required: true,
                    message: '请选择',
                    trigger: 'change'
                }],
                warn: [{
                    required: true,
                    message: '请选择',
                    trigger: 'change'
                }],
                ip: [{
                    required: true,
                    message: '请输入',
                    trigger: 'blur'
                }],
                port: [{
                    required: true,
                    message: '请输入',
                    trigger: 'blur'
                }]
            },
            firstShow: false,
            isOpen: false,
            inner_name: '',
            templateId: '',
            deleteItemDialog: false,
            deleteDialog: false,
            deleteId: '',
            deleteItemId: '',
            editDialog: false,
            formLabelWidth: '100px',
            loading: false,
            total_num: 0,
            multipleSelection: [],
            itemSelection: [],
            tableData: [],
            sayTimes: [],
            get_params: {
                page: 1,
                size: 20,
                name: '',
                createUser: '',
                createTime: ''
            },
            soundList: [
                {
                    label: '警报',
                    value: 'alarm'
                }, {
                    label: '警报2',
                    value: 'alarm2'
                }, {
                    label: '飞机上广播的钟声',
                    value: 'planeBells'
                }, {
                    label: '警铃',
                    value: 'alarmBells'
                }, {
                    label: '哦哦提示',
                    value: 'oh'
                }, {
                    label: '水滴',
                    value: 'waterDrop'
                }, {
                    label: '水滴滴答',
                    value: 'dripDrip'
                }, {
                    label: '危险信号',
                    value: 'danger'
                }, {
                    label: '系统告警',
                    value: 'systemAlarm'
                }, {
                    label: '信号',
                    value: 'signal'
                }, {
                    label: '遇到险情',
                    value: 'inDanger'
                }, {
                    label: '钟声',
                    value: 'bells'
                }
            ]
        }
    },
    watch: {
        addDialog: {
            handler(newVal, oldVal) {
                // console.log(newVal, oldVal,'---------------------')
                if (!newVal) {
                    this.$refs.addForm.resetFields()
                    this.addForm.rules = [
                        {
                            field: '',
                            condition: '',
                            val: ''
                        }
                    ]
                }
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.get_data()
            this.getAllUsers()
            this.getCondition()
            this.getFields()
        })
    },
    methods: {
        tableRowClassName({ row, rowIndex }) {
            console.log(rowIndex)
            if (rowIndex % 2) {
                return 'table-row2'
            } else {
                return 'table-row1'
            }
        },
        reset() {
            this.get_params = {
                page: 1,
                size: 20,
                name: '',
                createUser: '',
                createTime: ''
            }
            this.sayTimes = []
            this.get_data()
        },
        listenMisuc(item) {
            this.$refs[item.value].play()
        },
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        indexInnerMethod(index) {
            return (this.get_inner_params.page - 1) * this.get_inner_params.size + index + 1
        },
        searchCheck() {
            // alert(123)
            this.get_params.page = 1
            this.get_data()
        },
        searchCheckItem() {
            this.get_inner_params.page = 1
            this.get_Item()
        },
        addOneRule() {
            this.addForm.rules.push({
                field: '',
                condition: '',
                val: ''
            })
        },
        deleteOneRule(index) {
            this.addForm.rules.splice(index, 1)
        },
        addOneRuleEdit() {
            this.editForm.rules.push({
                field: '',
                condition: '',
                val: ''
            })
        },
        deleteOneRuleEdit(index) {
            this.editForm.rules.splice(index, 1)
        },
        getAllUsers() {
            this.allUsers = []
            getAlarmUsers({}).then(res => {
                console.log(res, '所有人')
                this.allUsers = res
            }).catch(err => {
                console.log(err)
            })
        },
        getCondition() {
            this.conditionList = []
            getConfigCondition({}).then(res => {
                console.log(res, '条件')
                this.conditionList = res
            }).catch(err => {
                console.log(err)
            })
        },
        getFields() {
            this.fieldsList = []
            getAlarmFields({}).then(res => {
                console.log(res, '字段')
                this.fieldsList = res
            }).catch(err => {
                console.log(err)
            })
        },
        showValue(item) {
            let field = item.field
            let arr = this.fieldsList.find(item => item.value == field)
            if (arr) {
                if (arr.type === 'text') {
                    item.type = 'text'
                    return 'text'
                } else if (arr.type === 'select') {
                    item.type = 'select'
                    item.item = arr.item
                    return 'select'
                }
            } else {
                item.type = 'text'
                return 'text'
            }
        },
        get_data() {
            this.loading = true
            this.tableData = []
            let data = {
                queryData: {
                    page: this.get_params.page,
                    pageSize: this.get_params.size
                },
                paramsData: {
                    name: this.get_params.name,
                    createUser: this.get_params.createUser,
                    startTime: this.sayTimes && this.sayTimes.length > 0 ? this.sayTimes[0] : '',
                    endTime: this.sayTimes && this.sayTimes.length > 0 ? this.sayTimes[1] : ''
                }
            }
            getAlarmConfigTable(data).then(res => {
                console.log('列表', res)
                this.loading = false
                this.total_num = res.total
                let list = res.records
                if (list.length > 0) {
                    list.forEach(item => {
                        let obj = {}
                        obj.id = item.id
                        obj.createUserCN = item.createUserCN
                        obj.des = item.des ? item.des : '--'
                        obj.port = item.port
                        obj.ip = item.ip
                        obj.createTime = item.createTime
                        obj.startConditionObj = item.startConditionObj
                        obj.createUser = item.createUser
                        obj.name = item.name
                        obj.type = item.type
                        obj.soundName = item.soundName
                        this.tableData.push(obj)
                    })
                }
            }).catch(error => {
                this.loading = false
                console.log('error' + error)
            })
        },
        handleEdit(row) {
            console.log(row)
            this.editForm.id = row.id
            this.editForm.name = row.name
            this.editForm.des = row.des
            this.editForm.type = row.type + ''
            this.editForm.rules = row.startConditionObj
            this.editForm.warn = row.soundName
            this.editForm.ip = row.ip
            this.editForm.port = row.port
            this.editDialog = true
        },
        handleDeleteAll() {
            if (this.multipleSelection.length == 0) {
                this.$message({
                    message: '请先选择行',
                    type: 'warning'
                })
                return
            } else {
                let ids = []
                this.multipleSelection.forEach(item => {
                    ids.push(item.id)
                })
                this.deleteId = ids
                // console.log(this.deleteId)
            }
            this.deleteDialog = true
        },
        handleDelete(row) {
            this.deleteId = [`${row.id}`]
            this.deleteDialog = true
        },
        handleDeleteFun() {
            let data = {
                ids: this.deleteId
            }
            deleteAlarmConfigTable(data).then(res => {
                this.deleteDialog = false
                console.log('删除成功')
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(error => {
                this.deleteDialog = false
                console.log(error + 'error')
            })
        },

        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = {
                        name: this.addForm.name,
                        type: this.addForm.type,
                        startConditionObj: this.addForm.rules,
                        soundName: this.addForm.warn,
                        des: this.addForm.des,
                        ip: this.addForm.ip,
                        port: this.addForm.port
                    }
                    saveAlarmConfig(data).then(res => {
                        this.addDialog = false
                        console.log('添加成功')
                        this.$message({
                            message: '添加成功',
                            type: 'success'
                        })
                        setTimeout(() => {
                            this.get_data()
                        }, 1500)
                    }).catch(error => {
                        // this.addDialog = false
                        console.log(error + 'error')
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        submitFormEdit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = {
                        id: this.editForm.id,
                        name: this.editForm.name,
                        type: this.editForm.type,
                        startConditionObj: this.editForm.rules,
                        soundName: this.editForm.warn,
                        des: this.editForm.des,
                        ip: this.editForm.ip,
                        port: this.editForm.port
                    }
                    updateAlarmConfig(data).then(res => {
                        this.editDialog = false
                        console.log('编辑成功')
                        this.$message({
                            message: '编辑成功',
                            type: 'success'
                        })
                        setTimeout(() => {
                            this.get_data()
                        }, 1500)
                    }).catch(error => {
                        // this.editDialog = false
                        console.log(error + 'error')
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        handleSizeChange(val) {
            this.get_params.size = val
            this.get_data()
        },
        handleCurrentChange(val) {
            this.get_params.page = val
            this.get_data()
        },
        handleSelectionChange(val) {
            console.log(val)
            this.multipleSelection = val
        }
    }
}
</script>

<style lang="scss" scoped>
.riqi {
    ::v-deep .el-range-input {
        font-size: 12px !important;
    }
}
.el-input.ips {
    display: block;
    width: 100%;
}
.el-link {
    cursor: pointer;
}
.drawer-pad {
    padding: 0 20px;
}
.domain-add {
    line-height: 1;
    position: relative;
    padding: 0 20px;
    color: #1cd7fa;
    .el-button {
        position: absolute;
        top: 0;
        right: 20px;
        padding: 0;
        color: #1cd7fa;
    }
}
.domain-list {
    margin: 3px 0 20px;
    padding: 20px 0 1px;
    background: rgb(0 0 0 / 30%);
    .list-tit {
        width: 100px;
        text-align: right;
    }
    .ub {
        margin-bottom: 20px;
    }
    .list-btn {
        padding-left: 20px;
        .el-button {
            color: #f56c6c;
        }
    }
}
.event  ::v-deep  .el-range-input {
    color: #ffffff;
    background-color: rgb(0 0 0 / 0%);
}
.event  ::v-deep  .el-range-separator {
    color: #ffffff;
}
.event  ::v-deep  .el-radio {
    margin: 0 150px 0 30px;
}
.event  ::v-deep  .el-form-item__label {
    padding: 0;
}
.event  ::v-deep  .el-upload-list__item-name {
    color: #01e9ff;
    i {
        color: #01e9ff;
    }
}
.rule-condition {
    margin-top: 0;
    padding: 10px;
    box-sizing: border-box;
    flex-wrap: wrap;
    border: 1px solid rgb(0 0 0 / 10%);
    border-radius: 4px;
    background-color: rgb(56 125 238 / 2%);
}
.part-condition {
    margin-top: 10px;
}
.left-condition {
    margin-top: 5px;
    margin-right: 20px;
    width: 30px;
    height: 100%;
    font-size: 12px;
}
</style>
