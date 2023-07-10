<template>
    <div class="event event-wrapper add_template">
        <div class="w100" v-loading="loading">
            <div class="ub w100 relative" style="height: 32px;">
                <div class="title-created">新建模板</div>
                <div class="ub" style="margin-left: 20px">
                    <el-steps :space="100" :active="activeStep">
                        <el-step><i class="step1 step1Active" slot="icon">工单基本信息</i></el-step>
                        <el-step><i class="step2 step2Ready" slot="icon">配置流程信息</i></el-step>
                    </el-steps>
                </div>
                <div class="btn-wrap" style="margin-left: auto;">
                    <el-button size="small" style="color: rgba(0, 0, 0, 0.4);" @click="cancel">取消</el-button>
                    <el-button size="small" style="background-color: #387dee;" type="primary" @click="next">下一步</el-button>
                </div>
            </div>
            <div class="w100 form-wrapper" style="color: #fff;">
                <div class="title w100">
                    <span class="t1 mt-1">基本信息</span>
                </div>
                <el-form  ref="formData" :model="formData" label-position="top" :rules="formDataRules" label-width="100px">
                    <div class="ub ub-pj" style="width:100%;">
                        <el-form-item label="模板名称：" style="width: calc((100% - 168px) / 3);" prop="name" size="small">
                            <el-input clearable v-model.trim="formData.name" size="small" placeholder="请输入模板名称"></el-input>
                        </el-form-item>
                        <el-form-item label="发起类型：" style="width: calc((100% - 168px) / 3);" prop="sendId" size="small">
                            <el-select filterable clearable v-model="formData.sendId" size="small" style="width: 100%" placeholder="请选择" @change="changeObject">
                                <el-option v-for="(item, index) in sendObjectList" :key="index" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="发起人范围：" style="width: calc((100% - 168px) / 3);" prop="userIds" size="small">
                            <el-select  v-model="formData.userIds" size="small" filterable multiple collapse-tags style="width: 100%" placeholder="请选择">
                                <el-option v-for="(item, index) in allUserList" :key="index" :label="item.chineseName" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="ub" style="width:100%;">
                        <el-form-item label="工单描述：" style="width: calc(100% - 84px - ((100% - 168px) / 3));" prop="des" size="small">
                            <vue-ueditor-wrap style="color: #000;" v-model="formData.des" :config="myConfig"></vue-ueditor-wrap>
                        </el-form-item>
                    </div>
                </el-form>
                <div class="title w100" v-if="this.formData.sendId == 1" style="margin-bottom: 16px;">
                    <span class="t1">手动触发条件</span>
                </div>
                <div style="min-height: 100px;background-color: rgba(56, 125, 238, 0.02);border-radius: 4px;border: solid 1px #dddddd;" v-if="this.formData.sendId == 1">
                    <div style="padding: 10px 0 0 20px">
                        <div class="single-condition" v-for="(item, index) in formData.startConditionObj" :key="index">
                            <el-divider v-if="index != 0">OR</el-divider>
                            <div class="ub ub-ac">
                                <div class="left-condition">AND</div>
                                <div class="ub ub-ver ub-f1">
                                    <div class="part-condition" v-for="(_item, _index) in item.and" :key="_index">
                                        <el-select filterable clearable v-model="_item.field" size="small" style="width: 36%;" @change="changeFiled(_item)" placeholder="请选择">
                                            <el-option v-for="(item, index) in formData.sendId == 1 ? alarmList : []" :key="index" :label="item.label" :value="item.value"></el-option>
                                        </el-select>
                                        <el-select filterable clearable v-model="_item.condition" size="small" style="margin: 0 6px;width: 21%" placeholder="请选择">
                                            <el-option v-for="(item, index) in conditionList" :key="index" :label="item.name" :value="item.value"></el-option>
                                        </el-select>
                                        <el-input v-if="getFieldType(_item) === 'text'" v-model="_item.val" clearable size="small" style="width: 36%" placeholder="请输入"></el-input>
                                        <el-select v-if="getFieldType(_item) === 'select'"  placeholder="请选择" style="width: 36%;" v-model="_item.val" size="small">
                                            <el-option v-for="(tag,_index) in _item.item" :label="tag.value" :value="tag.key" :key="_index"></el-option>
                                        </el-select>
                                        <i
                                            @click.stop="addConditionChild(item.and)"
                                            class="el-icon-plus"
                                            style="cursor: pointer;font-size:12px;color:#1cd7fa;margin-left: 5px"></i>
                                        <i
                                            @click.stop="deleteConditionChild(item.and,_item)"
                                            v-if="_index != 0"
                                            class="el-icon-close"
                                            style="cursor: pointer;font-size:12px;color:#1cd7fa"></i>
                                    </div>
                                    <p class="del-btn" v-if="index != 0">
                                        <i class="el-icon-close" @click="deleteCondition(item)"> 删除组</i>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p class="operate-color">
                        <i class="el-icon-plus" @click="addCondition"> 添加触发条件</i>
                    </p>
                </div>
                <div class="title w100">
                    <span class="t1">结束后动作</span>
                </div>
                <div style="min-height: 100px;padding-top: 10px">
                    <p v-if="this.formData.endEventObj.type.length === 0" class="operate-color" @click="openFinishDialog" style="border:1px solid #387dee;height:24px;line-height:22px;padding:0 3px"><i class="el-icon-plus"></i>添加结束动作</p>
                    <div v-else class="warn-wrapper">
                        <div class="ub ub-pj ub-ac">
                            <p style="font-size: 12px;color: rgba(0, 0, 0, 0.9);">提醒</p>
                            <p>
                                <i class="el-icon-edit" style="font-size: 12px;color: #387dee;cursor: pointer;margin-right: 10px;" @click="openFinishDialog"></i>
                                <i class="el-icon-close" style="font-size: 12px;color: #387dee;cursor: pointer" @click="deleteEndWarn"></i>
                            </p>
                        </div>
                        <div>
                            <p class="warn-top">提醒方式：</p>
                            <p class="warn-body">{{show_warn_type}}</p>
                            <p class="warn-top">提醒人员范围：</p>
                            <p class="warn-body">{{show_warn_user}}</p>
                            <p class="warn-top">提醒内容：</p>
                            <p class="warn-body" style="font-weight:600 !important">{{formData.endEventObj.title}}</p>
                            <p class="warn-body" v-html="show_warn_mes"></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog title="提醒" :visible.sync="finishWarnDialog" width="700px" custom-class="common-dialog " @click.native="closeDrop">
            <el-form :model="warnForm" :rules="warnRules" ref="warnForm" label-position="top">
                <el-form-item label="提醒方式：" prop="type" label-width="90px">
                    <el-select filterable clearable v-model="warnForm.type" multiple size="small" style="width: 100%;" placeholder="请选择">
                        <el-option label="站内消息" value="0"></el-option>
                        <el-option label="邮件" value="1"></el-option>
                        <el-option label="短信" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="人员范围：" prop="users" label-width="90px" class="red-star">
                    <dropdown-box
                        v-if="finishWarnDialog"
                        :usersList="allUserList"
                        :depList="allDepList"
                        :rolesList="allRolesList"
                        :usersShow="endWarnList"
                        :dataList="dataList"
                        ref="personRange"
                        @confirmData="confirmData"
                    ></dropdown-box>
                    <span v-if="personFlag" class="red-warn warn-person">请选择人员</span>
                </el-form-item>
                <el-form-item label="提醒内容：" prop="content" label-width="90px" class="red-star insert1">
                    <insert-fields style="width: calc(100% - 2px)" v-if="finishWarnDialog" ref="field" :title="formData.endEventObj.title" :mes="formData.endEventObj.mes" :sendId="formData.sendId"></insert-fields>
                    <span v-if="mesFlag" class="red-warn warn-content">请填写提醒内容</span>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="cancelFinish">取 消</el-button>
                <el-button type="primary" size="small" @click="handleFinishWarn">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import dropdownBox from './workComponents/dropdownBox'
import insertFields from './workComponents/insertFields'
import VueUeditorWrap from '../../../components/vue-ueditor-wrap.vue' // ES6 Module
import ueditorConfig from '../../../mixins/ueditorConfig'

import {
    getAllUsers,
    getAllDep,
    getAllRoles,
    getSendObject
} from '../../../server/works_order/define.js'

import {
    get_selested_all_fileds,
    get_condition,
    get_leak_fileds
} from '../../../server/works_order/api.js'
export default {
    name: 'WorkBase',
    components: {
        VueUeditorWrap,
        insertFields,
        dropdownBox
    },
    mixins: [ueditorConfig],
    data() {
        return {
            count: 0,
            loading: false, // 右侧整体loading
            formLabelWidth: '120px',
            tableData: [],
            activeStep: 0,
            conditionList: [],
            alarmList: [],
            leakList: [],
            objectList: [],
            endWarnList: [], // 记录选中的提醒人员item
            record_endWarnList: [], // 打开弹框
            record_send_id: '',
            formData: {
                name: '',
                userIds: [],
                sendId: '',
                startConditionObj: [
                    {
                        and: [
                            {
                                field: '',
                                condition: '',
                                val: ''
                            }
                        ]
                    }
                ],
                id: '',
                status: '',
                endEventObj: {
                    users: [
                        // {
                        //     userType: '0',
                        //     ids: []
                        // }
                    ],
                    title: '',
                    mes: '',
                    type: []
                },
                des: '',
                xml: '',
                xmlName: ''
            },
            mesFlag: false,
            personFlag: false,
            finishWarnDialog: false,
            warnForm: { // 消息提醒
                type: [],
                users: '',
                title: '',
                mes: ''
            },
            allUserList: [], // 所有人
            allDepList: [], // 所有部门
            allRolesList: [], // 所有角色
            sendObjectList: [], // 工单发起类型
            dataList: [
                {
                    name: '资产负责人',
                    type: '3',
                    id: 0
                },
                {
                    name: '事件创建人',
                    type: '3',
                    id: 1
                }
            ],
            formDataRules: {
                name: [
                    { required: true, message: '请输入模板名称', trigger: 'blur' }
                ],
                sendId: [
                    { required: true, message: '请选择发起类型', trigger: ['change', 'blur'] }
                ],
                userIds: [
                    { required: true, message: '请选择发起人范围', trigger: ['change', 'blur'] }
                ]
            },
            warnRules: {
                type: [
                    { required: true, message: '请选择提醒方式', trigger: 'change' }
                ]
            }
        }
    },
    async mounted() {
        this.$removesessionStorage('processId')
        await this.init()
        this.$nextTick(() => {
            if (this.$route.query.record) {
                this.formData = this.$getsessionStorage('baseForm')
                this.record_send_id = this.formData.sendId
            }
            /* 复制新建或编辑*/
            if (this.$getsessionStorage('copyTemplate')) {
                let form = this.$getsessionStorage('copyTemplate')
                this.formData.name = form.name
                this.formData.xml = form.xml
                this.formData.xmlName = form.xmlName
                this.formData.sendId = this.record_send_id = form.sendId
                this.formData.endEventObj = form.endEventObj
                this.formData.startConditionObj = form.startConditionObj
                this.formData.id = form.id
                this.formData.userIds = form.userIds.map(item => item.userId)
                this.formData.des = form.des
                this.warnForm.type = form.endEventObj.type ? form.endEventObj.type.map(item => item + '') : []
                this.copyEditShow(form.endEventObj.users)
                /* 编辑*/
            } else if (this.$getsessionStorage('editTemplate')) {
                let form = this.$getsessionStorage('editTemplate')
                console.log('formformformform2222', form)
                this.formData.name = form.name
                this.formData.xml = form.xml
                this.formData.xmlName = form.xmlName
                this.formData.sendId = this.record_send_id = form.sendId
                this.formData.endEventObj = form.endEventObj
                this.formData.startConditionObj = form.startConditionObj
                this.formData.id = form.id
                this.formData.userIds = form.userIds.map(item => item.userId)
                this.formData.des = form.des
                this.warnForm.type = form.endEventObj.type ? form.endEventObj.type.map(item => item + '') : []

                this.copyEditShow(form.endEventObj.users)
            }
            console.log('this.sendObjectList1111', this.sendObjectList)
            console.log('form1111', this.formData)

            if (this.sendObjectList.some(item => item.id === this.formData.sendId)) {
                let selected = this.sendObjectList.filter(item => item.id === this.formData.sendId)[0]
                if (selected.fields && selected.fields.length > 0) {
                    this.objectList = selected.fields
                }
            }
            console.log('this.objectList', this.objectList)
            console.log(this.formData, '回显')
            this.copyEditShow(this.formData.endEventObj.users)
            this.$removesessionStorage('alarmList')
        })
    },
    beforeDestroy() {
        this.$removesessionStorage('copyTemplate')
        this.$removesessionStorage('editTemplate')
    },
    computed: {
        show_warn_type() {
            let str = ''
            if (this.formData.endEventObj.type.length) {
                this.formData.endEventObj.type.forEach(item => {
                    if (item == 0) {
                        str += '站内消息、'
                    } else if (item == 1) {
                        str += '邮件、'
                    } else if (item == 2) {
                        str += '短信、'
                    } else if (item == 3) {
                        str += '蓝鲸快信、'
                    }
                })
            }
            (str[str.length - 1] === '、') && (str = str.slice(0, str.length - 1))
            return str
        },
        show_warn_user() {
            let str = ''
            console.log(this.endWarnList)
            if (this.endWarnList.length) {
                this.endWarnList.forEach(item => {
                    if (item !== '流程相关') {
                        item = JSON.parse(item)
                    }
                    if (item.type == 0) {
                        str += item.chineseName + '、'
                    } else if (item.type == 1) {
                        str += item.name + '、'
                    } else if (item.type == 2) {
                        str += item.roleName + '、'
                    } else if (item.type == 3) {
                        str += item.name + '、'
                    } else if (item == '流程相关') {
                        str += item + '、'
                    }
                })
            }
            (str[str.length - 1] === '、') && (str = str.slice(0, str.length - 1))
            return str
        },
        show_warn_mes() {
            return this.formData.endEventObj.mes
        }
    },
    methods: {
        changeObject(val) {
            console.log('val', val)
            if (this.sendObjectList.some(item => item.id == val)) {
                let selected = this.sendObjectList.filter(item => item.id == val)[0]
                console.log('selected', selected)
                if (selected.fields) {
                    this.objectList = this.$deepCopy(selected.fields)
                } else {
                    this.objectList = []
                }
            }
            if (this.record_send_id && this.record_send_id !== this.formData.sendId) {
                this.$setsessionStorage('send_object_change', true)
                this.$notify({
                    title: '提醒',
                    message: '发起类型已变化，请重新配置流程模板',
                    type: 'warning'
                })
            } else {
                this.$setsessionStorage('send_object_change', false)
            }
        },
        closeDrop() {
            if (this.$refs.field) {
                this.$refs.field.showFidles = false
            }
            if (this.$refs.personRange) {
                this.$refs.personRange.showMore = false
            }
        },
        changeFiled(item) {
            console.log(item)
            item.val = ''
        },
        getFieldType(item) {
            let field = item.field
            let selected = this.alarmList.filter(tag => tag.value === field)
            if (selected.length > 0) {
                if (selected[0].type === 'text') {
                    item.type = 'text'
                    return 'text'
                }
                if (selected[0].type === 'select') {
                    item.type = 'select'
                    item.item = selected[0].item
                    return 'select'
                }
            } else {
                item.type = 'text'
                return 'text'
            }
        },
        async init() {
            this.sendObjectList = await this.get_sendObject()
            this.$setsessionStorage('sendObjectList', this.sendObjectList)
            await this.get_dep()
            await this.get_roles()
            await this.get_users()
            await this.get_alarmList()
            // await this.get_leakList()
            await this.get_conditionList()
        },
        async get_users() {
            await getAllUsers({ queryDat: {}, paramsData: {}}).then(res => {
                console.log('所有人员', res)
                res.forEach(item => {
                    item.type = '0'
                })
                this.allUserList = res
                this.$setsessionStorage('allUserList', res)
            }).catch(err => {
                console.log(err, 'err')
            })
        },
        async get_roles() {
            await getAllRoles({ queryData: {}, paramsData: {}}).then(res => {
                console.log('所有角色', res)
                res.forEach(item => {
                    item.type = '2'
                })
                this.allRolesList = res
                this.$setsessionStorage('allRolesList', res)
            }).catch(err => {
                console.log(err, 'err')
            })
        },
        async get_dep() {
            await getAllDep({ queryData: {}, paramsData: {}}).then(res => {
                console.log('所有部门', res)
                res.forEach(item => {
                    item.type = '1'
                })
                this.allDepList = res
                this.$setsessionStorage('allDepList', res)
            }).catch(err => {
                console.log(err, 'err')
            })
        },
        async get_sendObject() {
            return new Promise(function(resolve, reject) {
                getSendObject({ queryData: {}, paramsData: {}}).then(res => {
                    console.log('工单发起类型', res)
                    resolve(res)
                }).catch(err => {
                    console.log(err, 'err')
                    reject(err)
                })
            })
        },
        async get_alarmList() {
            let data = {
                paramsData: {},
                queryData: {}
            }
            await get_selested_all_fileds(data).then(res => {
                console.log('事件字段', res)
                this.alarmList = res
            }).catch(err => {
                console.log(err)
            })
        },
        async get_conditionList() {
            let data = {
                paramsData: {},
                queryData: {}
            }
            await get_condition(data).then(res => {
                console.log('条件', res)
                this.conditionList = res
            }).catch(err => {
                console.log(err)
            })
        },
        async get_leakList() {
            let data = {
                paramsData: {},
                queryData: {}
            }
            await get_leak_fileds(data).then(res => {
                console.log('漏洞字段', res)
                this.leakList = res
            }).catch(err => {
                console.log(err)
            })
        },
        handleFinishWarn() {
            let title = this.$refs.field.$refs.editHead.innerHTML
            let mes = this.$refs.field.$refs.editBody.innerHTML

            if (title.trim() === '' || mes.trim() === '') {
                this.mesFlag = true
                return
            } else if (this.formData.endEventObj.users.length == 0) {
                this.personFlag = true
                return
            }

            this.$refs.warnForm.validate((valid) => {
                if (valid) {
                    this.mesFlag = this.personFlag = false
                    this.formData.endEventObj.title = title
                    this.formData.endEventObj.mes = mes
                    this.formData.endEventObj.type = this.$deepCopy(this.warnForm.type)
                    this.finishWarnDialog = false
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
            console.log(this.formData.endEventObj)
        },
        openFinishDialog() {
            console.log(this.formData)
            this.finishWarnDialog = true
            this.$refs.warnForm && (this.$refs.warnForm.resetFields())
            this.warnForm.type = this.$deepCopy(this.formData.endEventObj.type)
            this.warnForm.mes = this.formData.endEventObj.mes
            this.warnForm.title = this.formData.endEventObj.title
            this.record_endWarnList = this.$deepCopy(this.endWarnList)
        },
        cancelFinish() {
            this.finishWarnDialog = false
            this.endWarnList = this.$deepCopy(this.record_endWarnList)
        },
        deleteEndWarn() {
            this.formData.endEventObj.mes = ''
            this.formData.endEventObj.title = ''
            this.formData.endEventObj.type = []
            this.formData.endEventObj.users = []
            this.endWarnList = []
        },
        confirmData(val) {
            this.endWarnList = this.$deepCopy(val)
            val = val.length ? val : []
            let type0 = []
            let type1 = []
            let type2 = []
            let type3 = []; let type4
            this.formData.endEventObj.users = []
            val.forEach(item => {
                if (item !== '流程相关') {
                    item = JSON.parse(item)
                }
                if (item.type === '0') {
                    type0.push(item.id)
                } else if (item.type === '1') {
                    type1.push(item.id)
                } else if (item.type === '2') {
                    type2.push(item.id)
                } else if (item.type === '3') {
                    type3.push(item.id)
                } else if (item === '流程相关') {
                    type4 = true
                }
            })
            type0.length && this.formData.endEventObj.users.push({ userType: '0', ids: type0 })
            type1.length && this.formData.endEventObj.users.push({ userType: '1', ids: type1 })
            type2.length && this.formData.endEventObj.users.push({ userType: '2', ids: type2 })
            type3.length && this.formData.endEventObj.users.push({ userType: '3', ids: type3 })
            type4 && this.formData.endEventObj.users.push({ userType: '4' })
            // console.log(this.formData.endEventObj.users, '提醒人列表')
        },
        /* 复制新建、编辑时回显*/
        copyEditShow(users) {
            if (users.length) {
                this.endWarnList = []
                let arr = []
                console.log(users)
                users.forEach(item => {
                    console.log(item.userType)
                    if (item.userType == 0) {
                        console.log(22222)
                        /* 遍历所有人员*/
                        item.ids.forEach(_item => {
                            console.log(_item, this.allUserList)
                            let obj = this.allUserList.find(it => it.id == _item)
                            obj && (arr.push(JSON.stringify(obj)))
                        })
                    } else if (item.userType == 1) {
                        /* 遍历所有部门*/
                        item.ids.forEach(_item => {
                            let obj = this.allDepList.find(it => it.id == _item)
                            obj && (arr.push(JSON.stringify(obj)))
                        })
                    } else if (item.userType == 2) {
                        /* 遍历所有角色*/
                        item.ids.forEach(_item => {
                            let obj = this.allRolesList.find(it => it.id == _item)
                            obj && (arr.push(JSON.stringify(obj)))
                        })
                    } else if (item.userType == 3) {
                        /* 遍历数据人员*/
                        item.ids.forEach(_item => {
                            let obj = this.dataList.find(it => it.id == _item)
                            obj && (arr.push(JSON.stringify(obj)))
                        })
                    } else if (item.userType == 4) {
                        let obj = { userType: '4' }
                        arr.push(JSON.stringify(obj))
                    }
                })
                this.endWarnList = this.$deepCopy(arr)
                console.log(this.endWarnList, '11111111111111111111')
            }
        },
        cancel() {
            this.$router.push('/works_order/work_template')
        },
        next() {
            this.$refs.formData.validate((valid) => {
                if (valid) {
                    this.formData.des = this.formData.des.replace(/&nbsp;/g, ' ')
                    let data = this.$deepCopy(this.formData)
                    console.log('this.formData', this.formData)
                    console.log('this.objectList', this.objectList)
                    if (this.formData.sendId == 3 || this.formData.sendId == 4 || this.formData.sendId == 5) {
                        this.$removesessionStorage('alarmList')
                    } else {
                        this.$setsessionStorage('alarmList', this.objectList)
                    }
                    // if (this.formData.sendId == 1) {
                    //     this.$setsessionStorage('alarmList', this.alarmList)
                    // } else if (this.formData.sendId == 2) {
                    //     this.$setsessionStorage('alarmList', this.leakList)
                    // } else {

                    // }
                    this.$setsessionStorage('baseForm', data)
                    setTimeout(() => {
                        this.$router.push('/works_order/work_config')
                    }, 500)
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        addConditionChild(and) {
            and.push({
                field: '',
                condition: '',
                val: ''
            })
        },
        deleteConditionChild(and, item) {
            and.splice(and.indexOf(item), 1)
        },
        addCondition() {
            this.formData.startConditionObj.push({
                and: [
                    {
                        field: '',
                        condition: '',
                        val: ''
                    }
                ]
            })
        },
        deleteCondition(item) {
            this.formData.startConditionObj.splice(this.formData.startConditionObj.indexOf(item), 1)
        }
    }
}
</script>

<style lang="scss" scoped>
    .event-content{
        background-color: #111d2b;
    }
    .add_template.second-view {
        margin-left: 10px;
        margin-right: 10px;
        padding: 20px 20px;
    }
    .title-created {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.9);
        height: 28px;
        line-height: 28px;
    }
    .add_template ::v-deep .el-form {
        .el-form-item__label {
            font-size: 12px;
        }
    }
    .relative {
        position: relative;
        .btn-wrap {
            position: absolute;
            right: 0;
        }
    }

    .add_template ::v-deep .is-disabled {
        .el-textarea__inner {
            background: transparent;
            border: 1px solid #1cd7fa;
            box-shadow: 0px 0px 7px #389bf7 inset;
            color: #ccc;
        }
    }
    .add_template ::v-deep .el-steps {
        .el-step {
            .el-step__head {
                .el-step__line {
                    display: none;
                    height: 0px;
                }
                .is-text {
                    height: 28px;
                    width: 200px;
                    margin-left: 20px;
                    border-style: hidden;
                    background-color:transparent !important;
                }
            }
            .step1, .step2, .step3 {
                color: rgba(0, 0, 0, 0.26);
                text-indent: 20px;
                width: 200px;
                line-height: 28px;
                font-style: normal;
                height: 28px;
                background-color: #f3f3f3;
            }
            .step2, .step3 {
                text-indent: 40px;
            }
            .step1Active {
                color: #fff;
                background-color: #387dee;
                position: relative;
                &:after {
                    position: absolute;
                    top: 0;
                    right: -20px;
                    content: '';
                    width: 0;
                    height: 0;
                    border-left: 20px solid #387dee;
                    border-top: 14px solid transparent;
                    border-bottom: 14px solid transparent;
                    border-right: none;
                }
            }
            .step2Active,.step3Active {
                color: #fff;
                background-color: #387dee;
                &:after {
                    position: absolute;
                    top: 0;
                    right: -20px;
                    content: '';
                    width: 0;
                    height: 0;
                    border-left: 20px solid #387dee;
                    border-top: 14px solid transparent;
                    border-bottom: 14px solid transparent;
                    border-right: none;
                }
                &:before {
                    position: absolute;
                    top: 0;
                    left: 0;
                    content: '';
                    width: 0;
                    height: 0;
                    border-left: 20px solid #fff;
                    border-top: 14px solid transparent;
                    border-bottom: 14px solid transparent;
                    border-right: none;
                }
            }
            .step1Finish {
                color: #fff;
                background-color: #387dee;
                position: relative;
                &:after {
                    position: absolute;
                    top: 0;
                    right: -20px;
                    content: '';
                    width: 0;
                    height: 0;
                    border-left: 20px solid #387dee;
                    border-top: 14px solid transparent;
                    border-bottom: 14px solid transparent;
                    border-right: none;
                }
            }
            .step2Finish,.step3Finish {
                color: #fff;
                background-color: #387dee;
                &:after {
                    position: absolute;
                    top: 0;
                    right: -20px;
                    content: '';
                    width: 0;
                    height: 0;
                    border-left: 20px solid #387dee;
                    border-top: 14px solid transparent;
                    border-bottom: 14px solid transparent;
                    border-right: none;
                }
                &:before {
                    position: absolute;
                    top: 0;
                    left: 0;
                    content: '';
                    width: 0;
                    height: 0;
                    border-left: 20px solid #fff;
                    border-top: 14px solid transparent;
                    border-bottom: 14px solid transparent;
                    border-right: none;
                }
            }
            .step1Ready{
                background-color: #f3f3f3;
                color: rgba(0, 0, 0, 0.26);
                &:after {
                    position: absolute;
                    top: 0;
                    right: -20px;
                    content: '';
                    width: 0;
                    height: 0;
                    border-left: 20px solid #f3f3f3;
                    border-top: 14px solid transparent;
                    border-bottom: 14px solid transparent;
                    border-right: none;
                }
            }
            .step2Ready,.step3Ready {
                background-color: #f3f3f3;
                color: rgba(0, 0, 0, 0.26);
                &:after {
                    position: absolute;
                    top: 0;
                    right: -20px;
                    content: '';
                    width: 0;
                    height: 0;
                    border-left: 20px solid #f3f3f3;
                    border-top: 14px solid transparent;
                    border-bottom: 14px solid transparent;
                    border-right: none;
                }
                &:before {
                    position: absolute;
                    top: 0;
                    left: 0;
                    content: '';
                    width: 0;
                    height: 0;
                    border-left: 20px solid #fff;
                    border-top: 14px solid transparent;
                    border-bottom: 14px solid transparent;
                    border-right: none;
                }
            }
        }
    }

    .title {
        .t1 {
            line-height: 32px;
            display: inline-block;
            font-size: 12px;
            color: #0052d9;
            // margin-top: 10px;
        }
    }
    .form-wrapper {
        padding-right: 10px;
        height: calc(100vh - 154px);
        overflow: auto;
    }
    .form-wrapper ::v-deep .el-form {
        // padding: 10px;
    }
    .arrow {
        width: 52px;
        height: 31px;
        display: inline-block;
        margin-left: 84px;
        margin-right: 84px;
        background-image: url(../../../assets/img/work_order/arrow.png);
    }

    .dis {
        cursor: no-drop;
    }
    .del-btn {
        font-size: 12px;
        width: 60px;
        color: #387dee;
        margin-top: 10px;
        margin-left: 0px;
        border-radius: 3px;
        cursor: pointer;
        display: inline-block;
        i {
            margin-right: 4px;
        }
    }
    .operate-color {
        font-size: 12px;
        display: inline-block;
        border-radius: 3px;
        color: #387dee;
        margin-top: 10px;
        margin-bottom: 40px;
        cursor: pointer;

        i {
            margin-right: 4px;
        }
    }
    .single-condition {
        margin-top: 0px;
        flex-wrap: wrap;
    }
    .part-condition {
        margin-top: 10px;
    }
    .left-condition {
        font-size: 12px;
        margin-right: 10px;
        margin-top: 10px;
        width: 30px;
        height: 100%;
        color: #387dee;
    }
    .single-condition  ::v-deep  .el-divider {
        background-color: rgba(28,215,250,.2);
    }
    .single-condition  ::v-deep .el-divider__text {
        background-color: #fff;
        color: #387dee;
        // border: 1px solid #387dee;
    }
    .single-condition  ::v-deep .el-divider--horizontal {
        width: 99%;
    }
    .event  ::v-deep  .edui-editor-iframeholder {
        height: 300px !important;
    }
    .event  ::v-deep  .warn-wrapper {
        margin-top: 10px;
        width: 620px;
        padding: 0 10px;
        background-color: rgba(56, 125, 238, 0.05);
        border-radius: 6px;
        overflow: hidden;
        & p {
            font-size: 12px;
            margin: 5px 0;

            &.warn-top {
                color: rgba(0, 0, 0, 0.4);
            }
            &.warn-body {
                color: rgba(0, 0, 0, 0.9);
                word-break: break-all;
            }
        }

    }
    .attendance-dialog .red-star {
        position: relative;
    }
    .attendance-dialog .red-star::before {
        content: '*';
        position: absolute;
        left: -7px;
        top: 12px;
        color: #F56C6C;
    }
    .attendance-dialog .red-warn {
        color: #F56C6C;
        font-size: 12px;
        position: absolute;
        top: calc(100% - 10px);
        left: 0;
    }
    .attendance-dialog .insert1 .insert-field {
        ::v-deep .head-tip {
            line-height: 30px;
            top: 0;
        }
    }
</style>
<style>
/*#ue1 {*/
/*    border: 1px solid #01e9ff !important;*/
/*}*/
.edui-default .edui-editor {
    background-color: rgba(0, 0, 0, 0) !important;
}

.edui-default .edui-editor-toolbarboxouter {
    /* border-bottom: 1px solid #01e9ff !important; */
    background-color: rgba(0, 0, 0, 0) !important;
}
#edui_fixedlayer {
    z-index: 999999 !important;
}
</style>
