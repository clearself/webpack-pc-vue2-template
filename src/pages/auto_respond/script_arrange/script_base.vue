<template>
    <div class="event event-wrapper add_template">
        <div class="w100" v-loading="loading">
            <div class="ub w100 relative" style="height: 28px;">
                <div class="title-created">新建剧本</div>
                <div class="ub" style="margin-left: 20px">
                    <el-steps :space="100" :active="activeStep">
                        <el-step><i class="step1 step1Active" slot="icon">剧本基本信息</i></el-step>
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
                    <span class="t1">基本信息</span>
                </div>
                <el-form  ref="formData" :model="formData" label-position="top" :rules="formDataRules" label-width="100px">
                    <div class="ub" style="width:100%;">
                        <el-form-item label="剧本名称：" style="width: calc((100% - 168px) / 3);margin-right: 20px;" prop="name" size="small">
                            <el-input clearable v-model.trim="formData.name" size="small" placeholder="请输入剧本名称"></el-input>
                        </el-form-item>
                        <el-form-item label="剧本类型：" style="width: calc((100% - 168px) / 3);" prop="mouldType" size="small">
                            <el-select filterable clearable v-model="formData.mouldType" size="small" style="width: 100%" placeholder="请选择">
                                <el-option v-for="(item, index) in mouldTypeList" :key="index" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="ub" style="width:100%;">
                        <el-form-item label="剧本描述：" style="width: calc(100% - 84px - ((100% - 168px) / 3));" prop="des" size="small">
                            <vue-ueditor-wrap style="color: #000;" v-model="formData.des" :config="myConfig"></vue-ueditor-wrap>
                        </el-form-item>
                    </div>
                </el-form>
                <div class="title w100">
                    <span class="t1">结束后动作</span>
                </div>
                <div style="min-height: 100px;padding-top: 10px">
                    <p v-if="this.formData.endEvent.type.length === 0" class="operate-color" @click="openFinishDialog" style="border:1px solid #387dee;height:24px;line-height:22px;padding:0 3px"><i class="el-icon-plus"></i>添加结束动作</p>
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
                            <p class="warn-body" style="font-weight:600 !important" v-html="formData.endEvent.title"></p>
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
                        <!-- <el-option label="邮件" value="1"></el-option>
                        <el-option label="短信" value="2"></el-option> -->
                        <el-option label="蓝信" value="0"></el-option>
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
                        :assetOrganizeList="assetOrganizeList"
                        :assetUserList="assetUserList"
                        ref="personRange"
                        @confirmData="confirmData"
                    ></dropdown-box>
                    <span v-if="personFlag" class="red-warn warn-person">请选择人员</span>
                </el-form-item>
                <el-form-item label="提醒内容：" prop="content" label-width="90px" class="red-star insert1">
                    <insert-fields style="width: calc(100% - 2px)" v-if="finishWarnDialog" ref="field" :title="formData.endEvent.title" :mes="formData.endEvent.mes"></insert-fields>
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
import VueUeditorWrap from '@/components/vue-ueditor-wrap.vue' // ES6 Module
import ueditorConfig from '@/mixins/ueditorConfig'
import { groupList } from '@/server/auto_respond/action_manage.js'

import {
    getAllUsers,
    getAllDep,
    getAllRoles,
    getWorkAssetsUser,
    getWorkAssetsDep
} from '../../../server/auto_respond/action_edit.js'

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
            mouldTypeList: [
                {
                    id: 0,
                    name: '分析处置'
                },
                {
                    id: 1,
                    name: '应急响应'
                },
                {
                    id: 2,
                    name: '运维支持'
                }
            ],
            count: 0,
            loading: false, // 右侧整体loading
            formLabelWidth: '120px',
            tableData: [],
            activeStep: 0,
            objectList: [],
            endWarnList: [], // 记录选中的提醒人员item
            record_endWarnList: [], // 打开弹框
            record_send_id: '',
            formData: {
                mouldType: '',
                name: '',
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
                endEvent: {
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
            assetOrganizeList: [],
            assetUserList: [],
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
                    { required: true, message: '请输入剧本名称', trigger: 'blur' }
                ],
                mouldType: [
                    { required: true, message: '请选择剧本类型', trigger: ['change', 'blur'] }
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
        this.groupListFn()
        await this.init()
        this.$nextTick(() => {
            if (this.$route.query.record) {
                this.formData = this.$getsessionStorage('baseForm')
            }
            /* 复制新建或编辑*/
            if (this.$getsessionStorage('copyTemplate')) {
                let form = this.$getsessionStorage('copyTemplate')
                this.formData.mouldType = form.mouldType
                this.formData.name = form.name
                this.formData.xml = form.xml
                this.formData.xmlName = form.xmlName
                this.formData.endEvent = form.endEvent
                this.formData.startConditionObj = form.startConditionObj
                this.formData.id = form.id
                this.formData.des = form.des
                this.warnForm.type = form.endEvent && form.endEvent.type ? form.endEvent.type.map(item => item + '') : []
                if (form.endEvent) {
                    this.copyEditShow(form.endEvent.users)
                }
                /* 编辑*/
            } else if (this.$getsessionStorage('editTemplate')) {
                let form = this.$getsessionStorage('editTemplate')
                console.log('formformformform2222', form)
                this.formData.mouldType = form.mouldType
                this.formData.name = form.name
                this.formData.xml = form.xml
                this.formData.xmlName = form.xmlName
                this.formData.endEvent = form.endEvent
                this.formData.startConditionObj = form.startConditionObj
                this.formData.id = form.id
                this.formData.des = form.des
                this.warnForm.type = form.endEvent && form.endEvent.type ? form.endEvent.type.map(item => item + '') : []
                if (form.endEvent) {
                    this.copyEditShow(form.endEvent.users)
                }
            }
            console.log(this.formData, '回显')
            if (this.formData.endEvent) {
                this.copyEditShow(this.formData.endEvent.users)
            }
        })
    },
    beforeDestroy() {
        this.$removesessionStorage('copyTemplate')
        this.$removesessionStorage('editTemplate')
    },
    computed: {
        show_warn_type() {
            let str = ''
            if (this.formData.endEvent.type.length) {
                this.formData.endEvent.type.forEach(item => {
                    if (item == 0) {
                        str += '蓝信、'
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
                    } else if (item.type == 5) {
                        str += item.name + '、'
                    } else if (item.type == 6) {
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
            return this.formData.endEvent.mes
        }
    },
    methods: {
        groupListFn() {
            let data = {
                queryData: {},
                paramsData: {
                    type: 0
                }
            }
            groupList(data)
                .then(res => {
                    this.$setsessionStorage('customAutoList', res)
                })
                .catch(err => {
                    console.log(err)
                })
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
        async init() {
            await this.get_dep()
            await this.get_roles()
            await this.get_users()
            await this.getTreeData()
            await this.getWorkAssetsUserData()
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
        async getTreeData() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            await getWorkAssetsDep(data).then(res => {
                this.assetOrganizeList = res
                this.$setsessionStorage('assetOrganizeList', res)
            }).catch(error => {
                console.log('error' + error)
            })
        },
        async getWorkAssetsUserData() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            await getWorkAssetsUser(data).then(res => {
                console.log('所有资产用户', res)
                this.assetUserList = res.map(item => {
                    return {
                        type: '6',
                        id: item.id,
                        name: item.name,
                        account: item.accountnum || ''
                    }
                })
                this.$setsessionStorage('assetUserList', res)
            }).catch(error => {
                console.log('error' + error)
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
        handleFinishWarn() {
            let title = this.$refs.field.$refs.editHead.innerHTML
            let mes = this.$refs.field.$refs.editBody.innerHTML

            if (title.trim() === '' || mes.trim() === '') {
                this.mesFlag = true
                return
            } else if (this.formData.endEvent.users.length == 0) {
                this.personFlag = true
                return
            }

            this.$refs.warnForm.validate((valid) => {
                if (valid) {
                    this.mesFlag = this.personFlag = false
                    this.formData.endEvent.title = title
                    this.formData.endEvent.mes = mes
                    this.formData.endEvent.type = this.$deepCopy(this.warnForm.type)
                    this.finishWarnDialog = false
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
            console.log(this.formData.endEvent)
        },
        openFinishDialog() {
            console.log(this.formData)
            this.finishWarnDialog = true
            this.$refs.warnForm && (this.$refs.warnForm.resetFields())
            this.warnForm.type = this.$deepCopy(this.formData.endEvent.type)
            this.warnForm.mes = this.formData.endEvent.mes
            this.warnForm.title = this.formData.endEvent.title
            this.record_endWarnList = this.$deepCopy(this.endWarnList)
        },
        cancelFinish() {
            this.finishWarnDialog = false
            this.endWarnList = this.$deepCopy(this.record_endWarnList)
        },
        deleteEndWarn() {
            this.formData.endEvent.mes = ''
            this.formData.endEvent.title = ''
            this.formData.endEvent.type = []
            this.formData.endEvent.users = []
            this.endWarnList = []
        },
        confirmData(val) {
            console.log('val', val)
            this.endWarnList = this.$deepCopy(val)
            val = val.length ? val : []
            let type0 = []
            let type1 = []
            let type2 = []
            let type3 = []
            let type5 = []
            let type6 = []; let type4
            this.formData.endEvent.users = []
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
                } else if (item.type === '5') {
                    type5.push(item.id)
                } else if (item.type === '6') {
                    type6.push(item.id)
                } else if (item === '流程相关') {
                    type4 = true
                }
            })
            type0.length && this.formData.endEvent.users.push({ userType: '0', ids: type0 })
            type1.length && this.formData.endEvent.users.push({ userType: '1', ids: type1 })
            type2.length && this.formData.endEvent.users.push({ userType: '2', ids: type2 })
            type3.length && this.formData.endEvent.users.push({ userType: '3', ids: type3 })
            type5.length && this.formData.endEvent.users.push({ userType: '5', ids: type5 })
            type6.length && this.formData.endEvent.users.push({ userType: '6', ids: type6 })
            type4 && this.formData.endEvent.users.push({ userType: '4' })
            // console.log(this.formData.endEvent.users, '提醒人列表')
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
                    } else if (item.userType == 5) {
                        /* 遍历所有资产组织架构*/
                        item.ids.forEach(_item => {
                            let obj = this.assetOrganizeList.find(it => it.id == _item)
                            obj && (arr.push(JSON.stringify(obj)))
                        })
                    } else if (item.userType == 6) {
                        /* 遍历所有资产用户*/
                        item.ids.forEach(_item => {
                            let obj = this.assetUserList.find(it => it.id == _item)
                            obj && (arr.push(JSON.stringify(obj)))
                        })
                    }
                })
                this.endWarnList = this.$deepCopy(arr)
                console.log(this.endWarnList, '11111111111111111111')
            }
        },
        cancel() {
            this.$router.push('/auto_respond/script_arrange')
        },
        next() {
            this.$refs.formData.validate((valid) => {
                if (valid) {
                    this.formData.des = this.formData.des.replace(/&nbsp;/g, ' ')
                    let data = this.$deepCopy(this.formData)
                    console.log('this.formData', this.formData)
                    this.$setsessionStorage('baseForm', data)
                    setTimeout(() => {
                        this.$router.push('/auto_respond/script_config')
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
            height: 32px;
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
    .red-star {
        position: relative;
        ::v-deep .el-form-item__label {
            padding-left: 8px;
        }
    }
    .red-star::before {
        content: '*';
        position: absolute;
        left: 0px;
        top: 0px;
        color: #F56C6C;
    }
    .red-warn {
        color: #F56C6C;
        font-size: 12px;
        position: absolute;
        top: calc(100% - 10px);
        left: 0;
    }
    .insert1 .insert-field {
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
