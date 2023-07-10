<template>
    <div class="drop-box">
        <el-dialog
            title="添加处理人"
            :visible.sync="dialogVisible"
            width="700px"
            :close-on-click-modal="false"
            @click.native="closeDrop"
            :close-on-press-escape="false"
            :show-close="false"
            @closed="$emit('close')"
            custom-class="attendance-dialog">
            <div class="w100" style="min-height:300px;">
                <el-form label-width="80px" :model="formData">
                    <el-form-item :label="'处理人'+(index+1)+':'" v-for="(item,index) in formData.selectedList" :key="index">
                        <div class="ub ub-pj w100" style="padding-right:20px;box-sizing: border-box;">
                            <div class="ub ub-f1 ub-ac">
                                <div>
                                    <el-select size="small" v-model="item.dealUserType" placeholder="请选择">
                                        <el-option label="工单发起人" value="0"></el-option>
                                        <el-option label="数据相关人员" value="1"></el-option>
                                        <el-option label="人员,部门,角色,用户组" value="2"></el-option>
                                    </el-select>
                                </div>
                                <div v-if="item.dealUserType == 1" style="margin-left: 10px;width:300px;">
                                    <el-select style="width:100%;" size="small" v-model="item.type" placeholder="请选择">
                                        <el-option label="资产负责人" value="0"></el-option>
                                        <el-option label="告警负责人" value="1"></el-option>
                                    </el-select>
                                </div>
                                <div v-if="item.dealUserType == 2" style="width:300px;margin-left: 10px;">
                                    <personnel
                                        :index="index"
                                        ref="personRange"
                                        :usersSelected="item._users?item._users:[]"
                                        :usersList="allUserList"
                                        :depList="allDepList"
                                        :rolesList="allRolesList"
                                        :dataList="dataList"
                                        :processList="processList"
                                        @confirmData="confirmData"
                                        style="z-index:99"
                                        class="tags"
                                    ></personnel>
                                </div>
                            </div>
                            <div v-if="index!=0" class="close-btn" @click="del(index)">
                                <i class="el-icon-circle-close"></i>
                            </div>
                        </div>
                    </el-form-item>
                </el-form>
                <div style="padding-left:20px;margin-top: 10px;" v-if="formData.selectedList.length<3">
                    <el-button style="color:#387dee" type="text" size="mini" icon="el-icon-plus" @click="add">添加处理人</el-button>
                </div>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" @click="changeSet">确 定</el-button>
                <el-button size="small" @click="closeDialog">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
// import dropdownBox from '../../../../pages/works_order/workFlow/workComponents/dropdownBox'
import mixinPanel from '../../../common/mixinPanel'

import {
    getAllUsers,
    getAllDep,
    getAllRoles
} from '../../../../server/works_order/define.js'
export default {
    mixins: [mixinPanel],
    components: {
        // eslint-disable-next-line vue/no-unused-components
        // dropdownBox
    },
    props: {
        users: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            allUserList: [], // 所有人
            allDepList: [], // 所有部门
            allRolesList: [], // 所有角色
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
            processList: [
                {
                    name: '流程相关',
                    type: '4',
                    id: 0
                }
            ],
            dialogVisible: true,
            showParamDialog: false,
            nowIndex: null,
            formData: {
                selectedList: []
            },
            allList: [{
                id: 1,
                title: '测试1',
                isSelected: false
            }, {
                id: 2,
                title: '测试2',
                isSelected: false
            }, {
                id: 3,
                title: '测试3',
                isSelected: false
            }, {
                id: 4,
                title: '测试4',
                isSelected: false
            }]

        }
    },
    mounted() {
        console.log('this.users1111111', this.users)
        this.formData.selectedList = this.$deepCopy(this.users.length == 0 ? [{
            dealUserType: ''
        }] : this.users)
        console.log('this.formData.selectedList1111111', this.formData.selectedList)
        this.$nextTick(() => {
            this.init()
        })
    },
    methods: {
        closeDrop() {
            if (Array.isArray(this.$refs.personRange)) {
                this.$refs.personRange.forEach(item => {
                    item.showMore = false
                })
            }
        },
        del(index) {
            this.formData.selectedList.splice(index, 1)
        },
        add() {
            this.formData.selectedList.push({
                dealUserType: ''
            })
        },
        init() {
            this.get_dep()
            this.get_roles()
            this.get_users()
        },
        get_users() {
            getAllUsers({ queryData: {}, paramsData: {}}).then(res => {
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
        get_roles() {
            getAllRoles({ queryData: {}, paramsData: {}}).then(res => {
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
        get_dep() {
            getAllDep({ queryData: {}, paramsData: {}}).then(res => {
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
        confirmData({ val, index }) {
            console.log('val', val)
            console.log('index', index)
            val = val.length ? val : []
            let type0 = []
            let type1 = []
            let type2 = []
            let type3 = []; let type4
            this.formData.selectedList[index].users = []
            this.formData.selectedList[index]._users = val
            val.forEach(item => {
                if (item.type === '0') {
                    type0.push(item.id)
                } else if (item.type === '1') {
                    /* 部门*/
                    type1.push(item.id)
                } else if (item.type === '2') {
                    type2.push(item.id)
                } else if (item.type === '3') {
                    type3.push(item.id)
                } else if (item.type === '4') {
                    type4 = true
                }
            })
            type0.length && this.formData.selectedList[index].users.push({ type: '0', ids: type0 })
            type1.length && this.formData.selectedList[index].users.push({ type: '1', ids: type1 })
            type2.length && this.formData.selectedList[index].users.push({ type: '2', ids: type2 })
            type3.length && this.formData.selectedList[index].users.push({ type: '3', ids: type3 })
            type4 && this.formData.selectedList[index].users.push({ type: '4' })
            console.log(this.formData.selectedList[index].users, '提醒人列表')
        },
        changeSet() {
            console.log('this.formData.selectedList2222222', this.formData.selectedList)
            // return
            let userInfo = this.$getsessionStorage('userInfo')
            this.closeDialog()
            let arr = []
            this.formData.selectedList.map(item => {
                let obj = {}
                if (item.dealUserType == 0) {
                    obj.dealUserType = item.dealUserType
                    obj.dealUserTypeNmae = '工单发起人'
                    obj.userStr = userInfo.cnName
                } else if (item.dealUserType == 1) {
                    obj.dealUserTypeNmae = '数据相关人员'
                    obj.dealUserType = item.dealUserType
                    if (item.type == '') {
                        obj.users = []
                    } else {
                        obj.users = [{
                            id: item.type,
                            name: item.type == 0 ? '资产负责人' : '告警创建人'
                        }]
                    }
                    obj.userStr = obj.users.length > 0 ? obj.users[0].name : ''
                } else if (item.dealUserType == 2) {
                    obj.dealUserTypeNmae = '人员,部门,角色,用户组'
                    obj.dealUserType = item.dealUserType
                    obj._users = item._users.length ? item._users : []
                    obj.users = item.users.length ? item.users : []
                    obj.userStr = ''
                    let names = []

                    if (obj._users.length > 0) {
                        obj._users.map(tag => {
                            if (tag.type === '0') {
                                names.push(tag.chineseName)
                            } else if (tag.type === '1' || tag.type === '3' || tag.type === '4') {
                                names.push(tag.name)
                            } else if (tag.type === '2') {
                                names.push(tag.roleName)
                            }
                        })
                        obj.userStr = names.join(',')
                    }
                }
                arr.push(obj)
            })
            this.$emit('getUsersSet', {
                data1: this.formData.selectedList,
                data2: arr
            })
        },
        closeDialog() {
            // this.updateElement()
            this.dialogVisible = false
        }
    }
}
</script>

<style lang="scss" scoped>
    .flow-containers .el-badge__content.is-fixed {
        top: 18px;
    }

    .close-btn{
        cursor: pointer;
        font-size:16px;
        color:#ff6060;
    }
    .tags{
        ::v-deep .el-tag{
            border-color:#ddd!important;
            color: #909399 !important;
            background-color: rgba(0, 0, 0, 0)!important;
        }
    }
</style>
