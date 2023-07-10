<template>
    <div class="list">
        <div class="list-container" @click="preventFun">
            <div class="ub w100" style="box-sizing: border-box;">
                <div class="event-content w100">
                    <div class="ub ub-pj w100">
                        <div class="list-tips">新建任务
                            <!-- <div class="back-btn" style="display: inline-block;font-size:12px;color:#387dee;cursor: pointer;margin-left: 20px;" @click="back"><i
                                style="margin-right: 6px;"
                                class="fa fa-mail-reply"
                                aria-hidden="true"></i>返回</div> -->
                        </div>
                        <div>
                            <el-button size="small" @click="back">取 消</el-button>
                            <el-button size="small" style="margin-right: 20px;" type="primary" @click="validAttrack('form')">发 布</el-button>
                        </div>
                    </div>
                    <el-form ref="form" :model="form" :rules="formRules" label-width="100px" label-position="top">
                        <div class="base-box tree">
                            <div class="ub ub-ver match-con" style="width:100%;">
                                <div class="ub ub-ver" style="width:50%;">
                                    <el-form-item label="选择分组：" size="mini" class="addRules">
                                        <div class="select-box">
                                            <div style="cursor:pointer;" class="ub ub-ac select-title" @click.stop="onOff=!onOff">
                                                <div class="ub ub-f1 ub-ac" style="text-indent: 20px;line-height: 28px;">{{currentGroup}}</div>
                                                <div style="width:28px;height:28px;text-align: center;line-height: 28px;">
                                                    <i style="color:#dcdcdc;" :class="{'el-icon-arrow-up':onOff,'el-icon-arrow-down':!onOff}"></i>
                                                </div>
                                            </div>
                                            <div v-show="onOff" class="select-mask">
                                                <el-tree
                                                    ref="tree"
                                                    node-key="id"
                                                    :default-expand-all="true"
                                                    :highlight-current="true"
                                                    :data="treeData"
                                                    :props='propsData'
                                                    @node-click="handleNodeClick"
                                                    :check-strictly="true"
                                                    :expand-on-click-node="false"
                                                    :indent='indent'
                                                    @check-change="handleClick">
                                                    <span class="custom-tree-node" slot-scope="{ node }">
                                                        <span style="font-size:12px;">{{ node.label }}</span></span>
                                                </el-tree>
                                            </div>
                                            <div v-if="groupIsSelected" style="position:absolute;left:0;top:28px;line-height:20px;font-size:12px;color:#F56C6C;">请选择分组</div>
                                        </div>

                                    </el-form-item>

                                    <el-form-item label="任务名称：" size="small" prop="task_name">
                                        <el-input clearable placeholder="请输入" v-model.trim="form.task_name" autocomplete="off"></el-input>
                                    </el-form-item>
                                    <el-form-item label="输出物：" size="small" prop="outThing">
                                        <el-input clearable placeholder="请输入" v-model.trim="form.outThing" autocomplete="off"></el-input>
                                    </el-form-item>
                                    <el-form-item label="指派人：" size="mini">
                                        <div class="select-box">
                                            <div style="cursor:pointer;" class="ub ub-ac select-title" @click.stop="onOffAssign=!onOffAssign">
                                                <div class="ub ub-f1 line1" style="text-indent: 20px;text-align:left;line-height: 28px;">{{getSelectAssignUser}}</div>
                                                <div style="width:28px;height:28px;text-align: center;line-height: 28px;">
                                                    <i style="color:#dcdcdc;" :class="{'el-icon-arrow-up':onOff,'el-icon-arrow-down':!onOff}"></i>
                                                </div>
                                            </div>
                                            <div v-show="onOffAssign" class="select-mask assign" style="padding:10px 0;" @click.stop>
                                                <div class="assign-box w100" v-for="(item,index) in assignUsers" :key="index">
                                                    <div class="ub ub-pj assign-title w100" style="padding:0 10px;box-sizing: border-box;">
                                                        <div>{{item.roleName}}</div>
                                                        <div class="allSelect" style="font-size: 12px" :class="{'active':item.checked}" @click.stop="allSelectFun(item)">全选</div>
                                                    </div>
                                                    <div v-for="(_item,_index) in item.children" :key="_index" class="ub assign-user w100" style="box-sizing: border-box;padding:0 10px 0 20px;background-color: #f5f5f5;"  @click.stop="SingleSelectFun(_item,item)">
                                                        <div class="ub ub-f1 assign-name" :class="{'active':_item.checked}">{{_item.username}}</div>
                                                        <div style="color:#00C0FE;" class="right-icon" :class="{'el-icon-check':_item.checked}"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </el-form-item>
                                </div>
                                <el-form-item style="width:80%;" label="内容编辑：" class="addRules">
                                    <vue-ueditor-wrap v-model="form.des" :config="myConfig"></vue-ueditor-wrap>
                                </el-form-item>
                            </div>
                        </div>

                    </el-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    get_rule_tree,
    get_assign_users,
    addTask
} from '../../../server/protect_net/inspection.js'
import {
// getStoreUsers
} from '../../../server/protect_net/base.js'
import VueUeditorWrap from '../../../components/vue-ueditor-wrap.vue' // ES6 Module
import ueditorConfig from '../../../mixins/ueditorConfig'
export default {
    components: {
        VueUeditorWrap
    },
    name: 'CreateAttrack',
    mixins: [ueditorConfig],
    data() {
        return {
            groupIsSelected: false,
            assignUsersIds: [],
            assignUsers: [],

            form: {
                task_name: '',
                outThing: '',
                des: ''
            },
            formRules: {
                task_name: [{
                    required: true,
                    message: '请输入任务名称',
                    trigger: 'blur'
                }],
                outThing: [{
                    required: true,
                    message: '请输入输出物',
                    trigger: 'blur'
                }]
            },
            onOffAssign: false,
            onOff: false,
            isClick: true,
            indent: 5,
            initId: null,
            depId: '',
            currentNodeId: '',
            currentGroup: '',
            treeData: [],
            propsData: {
                children: 'sub',
                label: 'name'
            }

        }
    },

    computed: {
        getSelectAssignUser() {
            let users = []; let names = []
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.assignUsersIds = []
            this.assignUsers.forEach(item => {
                let selecteds = item.children.filter(_item => _item.checked)
                users = users.concat(selecteds)
            })
            users.forEach(item => {
                names.push(item.username)
                this.assignUsersIds.push(item.id)
            })
            return names.join(',')
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.initTree()
            this.initAssignUsers()
        })
    },
    methods: {
        back() {
            this.$router.go(-1)
        },
        preventFun() {
            this.onOff = false
            this.onOffAssign = false
        },
        validAttrack(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.publickRecord()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        handleClick(data, checked, node) {
            if (checked) {
                this.groupIsSelected = false
                this.currentNode = data
                this.currentNodeId = data.id
                this.currentGroup = data.name
                this.$refs.tree.setCheckedNodes([data])
            }
        },

        handleNodeClick(node) {
            console.log(node)
            this.groupIsSelected = false
            this.currentNode = node
            this.currentNodeId = node.id
            this.currentGroup = node.name
        },
        allSelectFun(item) {
            if (item.checked) {
                item.children = item.children.map(_item => {
                    _item.checked = false
                    return _item
                })
            } else {
                item.children = item.children.map(_item => {
                    _item.checked = true
                    return _item
                })
            }
            item.checked = !item.checked
        },
        SingleSelectFun(_item, item) {
            if (!_item.checked) {
                _item.checked = !_item.checked
                if (!item.children.some(_items => _items.checked === false)) {
                    item.checked = true
                }
            } else {
                _item.checked = !_item.checked
                item.checked = false
            }
        },
        initAssignUsers() {
            this.assignUsers = []
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_assign_users(data).then(res => {
                console.log('11111111111', res)
                if (res.length > 0) {
                    res.forEach(item => {
                        if (item.users.length > 0) {
                            let obj = {}
                            obj.id = item.id
                            obj.checked = false
                            obj.roleName = item.roleName
                            obj.children = []
                            item.users.forEach(_item => {
                                let _obj = {}
                                _obj.id = _item.id
                                _obj.checked = false
                                _obj.username = _item.chineseName
                                obj.children.push(_obj)
                            })
                            this.assignUsers.push(obj)
                        }
                    })
                }
            }).catch(error => {
                console.log('error' + error)
            })
        },
        initTree() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_rule_tree(data).then(res => {
                console.log('tree', res)
                let _data = [
                    res
                ]
                _data[0].disabled = true
                this.isClick = false
                this.treeData = _data
            }).catch(error => {
                console.log('error' + error)
            })
        },
        publickRecord() {
            console.log(this.currentNodeId)
            if (this.currentNodeId == '') {
                this.groupIsSelected = true
                return
            }
            let data = {
                queryData: {},
                paramsData: {
                    groupId: this.currentNodeId,
                    taskName: this.form.task_name,
                    output: this.form.outThing,
                    des: this.form.des,
                    userIds: this.assignUsersIds
                }
            }

            addTask(data).then((res) => {
                this.$message({
                    message: '新建成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.$router.go(-1)
                }, 1500)
            }).catch((error) => {
                console.log(error)
            })
        }
    }
}
</script>

    <style lang="scss" scoped>
        .event {
            padding: 0px 20px 20px 0px;
            box-sizing: border-box;
            position: relative;
        }

        .base-box {
            padding: 0 20px;
            box-sizing: border-box;
            border-radius: 5px;
            width: 100%;

            h4 {
                font-weight: 500;
                // color: #ffffff;
            }
        }

        .match-con {
            margin-top: 20px;
        }

        .match-btns {
            width: 100%;

            div {
                font-size: 12px;
                color: #606ea6;
                padding: 0px 30px;
                // background-color: #eef1f7;
                border: 1px solid #4bacf9;
                margin-right: 20px;
                cursor: pointer;
            }

            div:last-child {
                margin-right: 0;
            }

            div.active {
                background-color: #12a4ef;
                border-color: #12a4ef;
                // color: #fff;
            }
        }

        .match-title {
            margin: 20px 0 10px 0;
        }

        .match-title>div:nth-child(1) {
            font-size: 14px;
            // color: #fff;
        }

        .el-table {
            min-height: 0;
        }

        .player-title {
            line-height: 70px;
            font-size: 18px;
        }

        .event ::v-deep .el-range-input {
            background-color: rgba(0, 0, 0, 0);
            // color: #fff;
        }

        .event ::v-deep .el-range-separator {
            // color: #fff;
        }

        // .el-form-item {
        //     margin-bottom: 10px;
        // }

        .historyTeam>div {
            color: #a2a9af;
            cursor: pointer;
        }

        .historyTeam.active>div {
            color: #00c0fe;
        }

        .transfer ::v-deep .el-transfer-panel {
            background-color: rgba(0, 0, 0, 0);
            border-color: #1bd7fa;
        }

        .transfer ::v-deep .el-transfer-panel .el-transfer-panel__header {
            background-color: rgba(0, 0, 0, 0);
            border-color: #1bd7fa;
        }

        .transfer ::v-deep .el-transfer-panel .el-transfer-panel__header .el-checkbox .el-checkbox__label {
            // color: #fff;
        }

        .transfer ::v-deep .el-transfer-panel .el-transfer-panel__header .el-checkbox .el-checkbox__label span {
            // color: #fff;
        }

        .trans ::v-deep .el-input__inner {
            border-radius: 4px 4px 0 0;
        }

        .transfer ::v-deep .el-transfer-panel__item.el-checkbox {
            // color: #fff;
        }

        .transfer ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner {
            background-color: #024861;
            border-color: #01d9f0;
        }

        .transfer ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner:hover {
            border-color: #01d9f0;
        }

        .transfer ::v-deep .el-checkbox__input.is-indeterminate .el-checkbox__inner {
            background-color: #024861;
            border-color: #01d9f0;
        }

        .transfer ::v-deep .el-checkbox__input .el-checkbox__inner:hover {
            border-color: #01d9f0;
        }

        .transfer ::v-deep .el-checkbox__inner::after {
            border-color: #01d9f0;
        }

        .transfer ::v-deep .el-checkbox__input.is-checked+.el-checkbox__label {
            color: #01d9f0;

        }

        .transfer ::v-deep .el-input__inner,
        .transfer ::v-deep .el-textarea__inner,
        .chart .el-input__inner {
            box-shadow: none;
            border-color: #01d9f0;
        }

        .transfer ::v-deep .el-transfer__button.is-disabled,
        .transfer ::v-deep .el-transfer__button.is-disabled:hover {
            border: 1px solid rgba(0, 0, 0, 0);
            background-color: rgba(0, 0, 0, .5);
            color: #C0C4CC;
        }

        .transfer ::v-deep .el-transfer__button {
            // color: #fff;
            background-color: #01d9f0;
        }
        .upload-demo ::v-deep .el-button--primary{
            background-color: rgba(0,0,0,0);
            border-color: rgba(0,0,0,0);
            /*background-image: url(../../assets/img/XZWJ.png);
            background-position: 0 0;
            background-repeat: no-repeat;
            background-size: 100% 100%;*/
        }

        .event ::v-deep .el-input-group__append, .event ::v-deep .el-input-group__prepend{
                background-color: rgba(0,0,0,0);
                color: #1cd7fa;

                border: 1px solid #1cd7fa;
                border-left:0;
        }
        .upload-demo ::v-deep a,.upload-demo ::v-deep i{
            color:#1cd7fa;
        }
        .upload-demo ::v-deep .el-upload-list__item:hover {
            background-color: rgba(0,0,0,0);
        }
        .el-tree{
            background: rgba(0,0,0,0);
        }
        .tree ::v-deep .el-tree--highlight-current .el-tree-node>.el-tree-node__content {
            .custom-tree-node{
                span:nth-child(1){
                    color:#777!important;
                }
                span:nth-child(2){
                    color:#777!important;
                }

            }
        }
        .tree ::v-deep .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
            background-color: rgba(0,0,0,0)!important;
            .custom-tree-node{
                span{
                    color:#387dee!important;
                }
            }
        }
        .tree ::v-deep .el-tree--highlight-current .el-tree-node>.el-tree-node__content:hover{
            background-color: rgba(0,0,0,0)!important;
            .custom-tree-node{
                span{
                    color:#387dee!important;
                }
            }
        }
        .tree ::v-deep .el-checkbox__input.is-disabled .el-checkbox__inner{
            // background-color: #387dee;
            border-color: #387dee;
        }
        .tree ::v-deep .el-checkbox__input .el-checkbox__inner,.auto ::v-deep .el-checkbox__input .el-checkbox__inner{
             border-color: #387dee!important;
        }
        .tree ::v-deep .el-checkbox__input.is-focus .el-checkbox__inner,.auto ::v-deep .el-checkbox__input.is-focus .el-checkbox__inner{
             border-color: #387dee!important;
        }
        .tree ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner,.auto ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
            background-color: rgba(0,0,0,0)!important;
            border-color: #387dee;
        }
        .tree-option i{
            margin: 0 3px;
            cursor: pointer;
        }
        .tree ::v-deep .el-checkbox__inner::after,.auto ::v-deep .el-checkbox__inner::after{
            border-color:#387dee;
        }
        .auto ::v-deep .el-checkbox__input.is-checked+.el-checkbox__label{
            color:#387dee;
        }
        .white-theme .tree ::v-deep .el-tree--highlight-current .el-tree-node>.el-tree-node__content {
            .custom-tree-node{
                span:nth-child(1){
                    color:#3f4f57!important;
                }
                span:nth-child(2){
                    color:#3f4f57!important;
                }

            }
        }
        .white-theme .tree ::v-deep .el-tree--highlight-current .el-tree-node>.el-tree-node__content:hover{
            background-color: rgba(0,0,0,0)!important;
            .custom-tree-node{
                span{
                    color:#3aa6e4!important;
                }
            }
        }
        .white-theme .tree ::v-deep .el-tree--highlight-current .el-tree-node>.el-tree-node__content:hover{
            background-color: rgba(0,0,0,0)!important;
            .custom-tree-node{
                span{
                    color:#3aa6e4!important;
                }
            }
        }
        .white-theme .tree ::v-deep .el-tree--highlight-current .el-tree-node>.el-tree-node__content:hover{
            background-color: rgba(0,0,0,0)!important;
            .custom-tree-node{
                span{
                    color:#3aa6e4 !important;
                }
            }
        }
        .white-theme .tree ::v-deep .el-checkbox__input.is-disabled .el-checkbox__inner{
            background-color: #3f4f57;
            border-color: #3f4f57;
        }
        .white-theme .tree ::v-deep .el-checkbox__input .el-checkbox__inner,.auto ::v-deep .el-checkbox__input .el-checkbox__inner{
             border-color: #3f4f57!important;
        }
        .white-theme .tree ::v-deep .el-checkbox__input.is-focus .el-checkbox__inner,.auto ::v-deep .el-checkbox__input.is-focus .el-checkbox__inner{
             border-color: #3f4f57!important;
        }
        .white-theme .tree ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner,.auto ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
            background-color: rgba(0,0,0,0)!important;
            border-color: #3f4f57;
        }
        .white-theme .tree-option i{
            margin: 0 3px;
            cursor: pointer;
        }
        .white-theme .tree ::v-deep .el-checkbox__inner::after,.auto ::v-deep .el-checkbox__inner::after{
            border-color:#3f4f57;
        }
        .white-theme .auto ::v-deep .el-checkbox__input.is-checked+.el-checkbox__label{
            color:#3aa6e4 ;
        }
        .el-select{
            width:100%;
        }
        .select-box{
            width:100%;
            height:28px;
            position: relative;
        }
        .select-title{
            width:100%;
            height:100%;
            background: transparent;
            border: 1px solid #dcdcdc;
            // box-shadow: 0px 0px 7px #389bf7 inset;
            // color: #fff;
            border-radius:3px;
        }
        .select-mask{
            width:100%;
            min-height:100px;
            max-height:300px;
            position: absolute;
            left:0;
            top:34px;
            z-index: 999;
            overflow-y: auto;
            background: transparent;
            border: 1px solid #dcdcdc;
            // box-shadow: 0px 0px 7px #389bf7 inset;
            // color: #777;
            border-radius:3px;
            background-color: #fff;
        }
        .assign-box{
            /*padding:10px;*/
            box-sizing: border-box;
        }
        .assign-title,.assign-user{
            line-height: 28px;
            cursor: pointer;
        }
        .assign-name{
            font-size:12px;
            cursor: pointer;
        }
        .assign-name:hover{
            color:#387dee
        }
        .assign-name.active{
            color:#387dee
        }
        .allSelect.active{
            color:#387dee
        }
        .addRules ::v-deep .el-form-item__label:before {
            content: '*';
            color: #F56C6C;
            margin-right: 4px;
        }
    </style>
    <style>

        #ue2{
            border: 1px solid #387dee!important;
        }
        .edui-default .edui-editor{
            border: 1px solid #dcdcdc!important;
            background-color: rgba(0,0,0,0)!important;
        }
        .edui-default .edui-editor-toolbarboxouter {
            border-bottom: 1px solid #dcdcdc!important;
             background-color: rgba(0,0,0,0)!important;
        }
        /*.edui-editor-toolbarboxinner.edui-default{
             background-color: rgba(0,0,0,1)!important;
        }*/
    </style>
