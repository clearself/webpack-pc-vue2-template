<template>
    <div>
        <el-dialog
            title="提醒"
            :visible.sync="dialogVisible"
            @closed="$emit('close')"
            width="700px"
            @click.native="closeDrop"
            custom-class="common-dialog">
            <el-form :model="formData" ref="formData" label-position="top">
                <div class="ub ub-ver w100" v-for="(item,index) in formData.groups" :key="index">
                    <div class="ub ub-ac w100">
                        <div class="ub ub-ver ub-f1">
                            <el-form-item
                                label="提醒方式："
                                :prop="'groups.'+index+'.warnType'"
                                label-width="90px"
                                :rules="{required: true,message: '请选择提醒方式',trigger: 'change'}
                                ">
                                <el-select
                                    filterable
                                    clearable
                                    v-model="item.warnType"
                                    multiple
                                    size="small"
                                    style="width: 650px;"
                                    placeholder="请选择">
                                    <el-option label="站内消息" value="0"></el-option>
                                    <el-option label="邮件" value="1"></el-option>
                                    <el-option label="短信" value="2"></el-option>
                                    <el-option label="蓝鲸快信" value="3"></el-option>
                                </el-select>
                            </el-form-item>
                            <div>
                                <el-form-item
                                    style="display: inline-block;"
                                    label="时间："
                                    :prop="'groups.'+index+'.warnSendType'"
                                    label-width="90px"
                                    :rules="{required: true,message: '请选择时间',trigger: 'change'}
                                    ">
                                    <el-select filterable clearable v-model="item.warnSendType" size="small" placeholder="请选择"  @clear="item.hours=''" style="width: 530px;">
                                        <el-option label="超时前" value="0"></el-option>
                                        <!-- <el-option label="超时后" value="1"></el-option> -->
                                        <el-option label="完成时" value="2"></el-option>
                                        <el-option label="待办" value="3"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item
                                    v-if="item.warnSendType == 0"
                                    style="display: inline-block;"
                                    label=""
                                    :prop="'groups.'+index+'.hours'"
                                    label-width="0px"
                                    :rules="{required: true,message:'请输入时间',trigger: 'blur'}
                                    ">
                                    <el-input v-if="item.warnSendType===''" style="width:70px;margin-left: 10px;" size="mini" v-model="item.hours" placeholder="请输入"></el-input>
                                    <el-input-number v-else style="width:70px;margin-left: 10px;" size="mini" v-model="item.hours" :controls="false" :min="1" :step="1" :step-strictly="true"></el-input-number>
                                    <span class="ml-1">小时</span>
                                </el-form-item>
                            </div>
                            <el-form-item label="人员范围：" prop="persons" label-width="90px" style="position: relative;z-index: 10;" class="red-star">
                                <div class="ub ub-f1">
                                    <div style="width: 38%">
                                        <el-select size="small" v-model="item.warnUserType" placeholder="请选择" style="width: 100%">
                                            <el-option label="工单发起人" value="0"></el-option>
                                            <el-option label="数据相关人员" value="1"></el-option>
                                            <el-option label="指定节点处理人" value="2"></el-option>
                                            <el-option label="人员,部门,角色,用户组" value="3"></el-option>
                                        </el-select>
                                    </div>
                                    <div v-if="item.warnUserType == 1" style="margin-left: 10px;width:60%;">
                                        <el-select style="width:100%;" size="small" v-model="item.type" placeholder="请选择">
                                            <el-option label="资产负责人" value="0"></el-option>
                                            <el-option label="告警负责人" value="1"></el-option>
                                        </el-select>
                                    </div>
                                    <div v-if="item.warnUserType == 3" style="width:60%;margin-left: 10px;">
                                        <dropdown-box
                                            ref="personRange"
                                            style="width: 100%;"
                                            :usersList="allUserList"
                                            :depList="allDepList"
                                            :rolesList="allRolesList"
                                            :usersShow="item.usersName"
                                            :index="index"
                                            @confirmData="confirmData"
                                        ></dropdown-box>
                                    </div>
                                </div>

                                <span v-if="personFlag" class="red-warn warn-person">请选择人员</span>
                            </el-form-item>
                            <el-form-item label="提醒内容：" label-width="90px" class="red-star">
                                <insert-fields
                                    style="width: 100%"
                                    ref="field"
                                    :title="item.title"
                                    :mes="item.warnMessage"
                                    :refIndex = '0'
                                    :index="index"
                                    @mesChange="mesChange"
                                    @titleChange="titleChange"
                                ></insert-fields>
                                <span v-if="mesFlag" class="red-warn warn-content">请填写提醒内容</span>
                            </el-form-item>
                        </div>
                        <div style="margin: 0 10px 0 10px;font-size:16px;cursor: pointer;" @click="deleteFun(index)"><i style="color: red;" class="iconfont icon-liebiaoshanchu"></i></div>
                    </div>
                    <el-divider v-if="index<formData.groups.length-1"></el-divider>
                </div>
            </el-form>
            <div>
                <el-button style="color: #387dee" size="mini" type="text" icon="el-icon-plus" @click="add">添加</el-button>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" @click="updateWarn">确 定</el-button>
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                <!-- <searchBtn title="确 定" @click="updateWarn" />
                <cancelBtn title="取 消" @click="dialogVisible = false" /> -->
            </span>
        </el-dialog>
    </div>
</template>

<script>
import mixinPanel from '../../../common/mixinPanel'
import insertFields from './insertFields'
import dropdownBox from './dropdownBox'

export default {
    components: { insertFields, dropdownBox },
    mixins: [mixinPanel],
    data() {
        return {
            dialogVisible: true,
            showParamDialog: false,
            nowIndex: null,
            allUserList: [],
            allDepList: [],
            allRolesList: [],
            dataList: [
                {
                    name: '资产负责人',
                    type: '3',
                    id: 0
                },
                {
                    name: '告警创建人',
                    type: '3',
                    id: 1
                }
            ],
            mesFlag: false,
            personFlag: false,

            // usersShow: [],
            formData: {
                groups: [
                    {
                        warnType: [],
                        warnMessage: '',
                        title: '',
                        warnUserType: '',
                        warnSendType: '',
                        hours: '',
                        type: '',
                        users: [],
                        usersName: []
                    }
                ]
            }
        }
    },
    props: ['usersName'],
    computed: {

    },
    mounted() {
        console.log('this.usersName', this.usersName)
        this.$getsessionStorage('allUserList') && (this.allUserList = this.$getsessionStorage('allUserList'))
        this.$getsessionStorage('allRolesList') && (this.allRolesList = this.$getsessionStorage('allRolesList'))
        this.$getsessionStorage('allDepList') && (this.allDepList = this.$getsessionStorage('allDepList'))
        this.formData.groups = this.$deepCopy(this.usersName.length == 0 ? [
            {
                warnUserType: '',
                type: '',
                warnType: [],
                warnMessage: '',
                title: '',
                warnSendType: '',
                hours: '',
                users: [],
                usersName: []
            }
        ] : this.usersName)
    },
    methods: {
        closeDrop() {
            if (this.$refs.field) {
                if (Array.isArray(this.$refs.field)) {
                    this.$refs.field.forEach(item => {
                        item.showFidles = false
                    })
                }
            }
            if (this.$refs.personRange) {
                if (Array.isArray(this.$refs.personRange)) {
                    this.$refs.personRange.forEach(item => {
                        item.showMore = false
                    })
                }
            }
        },
        deleteFun(index) {
            this.formData.groups.splice(index, 1)
        },
        add() {
            this.formData.groups.push({
                warnUserType: '',
                type: '',
                warnType: [],
                warnMessage: '',
                title: '',
                warnSendType: '',
                hours: '',
                users: [],
                usersName: []
            })
        },
        titleChange({ data, index }) {
            this.formData.groups[index].title = data
            console.log(this.formData, index)
        },
        mesChange({ data, index }) {
            this.formData.groups[index].warnMessage = data
            console.log(this.formData, index)
        },
        configParam(index) {
            this.nowIndex = index
            const nowObj = this.formData.taskListener[index]
            if (!nowObj.params) {
                nowObj.params = []
            }
            this.showParamDialog = true
        },
        confirmData({ val, index }) {
            val = val.length ? val : []
            let type0 = []
            let type1 = []
            let type2 = []
            this.formData.groups[index].users = []
            val.forEach(item => {
                item = JSON.parse(item)
                if (item.type === '0') {
                    type0.push(item.id)
                } else if (item.type === '1') {
                    type1.push(item.id)
                } else if (item.type === '2') {
                    type2.push(item.id)
                }
            })
            this.formData.groups[index].usersName = val || []
            type0.length && this.formData.groups[index].users.push({ type: '0', ids: type0 })
            type1.length && this.formData.groups[index].users.push({ type: '1', ids: type1 })
            type2.length && this.formData.groups[index].users.push({ type: '2', ids: type2 })
            console.log(this.formData.groups[index].users, '提醒人列表')
        },
        updateWarn() {
            // console.log(this.$refs.field.$refs)
            // console.log(this.$refs.field.$refs['editHead'].innerHTML, 'ooooooooooooo')
            // this.formData.title = this.$refs.field.$refs['editHead'].innerHTML;
            // this.formData.mes = this.$refs.field.$refs['editBody'].innerHTML;

            // if (this.formData.title.trim() === '' || this.formData.mes.trim()==='') {
            //     this.mesFlag = true;
            //     return ;
            // } else if (this.formData.users.length == 0) {
            //     this.personFlag = true;
            //     return ;
            // }

            this.$refs.formData.validate((valid) => {
                if (valid) {
                    this.$emit('getNewWarnSet', this.formData.groups)
                    // this.mesFlag = this.personFlag = true;
                    this.dialogVisible = false
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        }
    }
}
</script>

<style>
.flow-containers .el-badge__content.is-fixed {
    top: 18px;
}
.warn-num {
    margin-left: 10px;
    width: 99%;
    height: 20px;
    line-height: 20px;
    position: relative;
    padding: 20px 0 10px 0;
    font-size: 14px;
    border-bottom: 1px solid rgba(0,0,0,.8);
}
.warn-num span {
    width: 60px;
    display: inline-block;
    color: #dcdcdc;
    text-align: center;
    border-bottom: 1px solid #dcdcdc;
}
.warn-num i {
    float: right;
    font-size: 14px;
    color: #ff7200;
}
.attendance-dialog .red-star {
    position: relative;
}
.attendance-dialog .red-star::before {
    content: '*';
    position: absolute;
    left: 8px;
    top: 8px;
    color: #F56C6C;
}
.attendance-dialog .red-warn {
    color: #F56C6C;
    font-size: 12px;
    position: absolute;
    top: calc(100% - 10px);
    left: 0;
}
</style>
