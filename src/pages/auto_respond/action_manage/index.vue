<template>
    <div class="list ub mb-1">
        <div class="left mr-1">
            <div class="ub ub-pj w100 ub-ac mt-2">
                <div class="list-tips ml-1">动作列表</div>
                <div>
                    <el-button type="text" size="small" icon="el-icon-plus" @click="clickGroupAdd">新建组</el-button>
                    <el-button icon="el-icon-plus" size="small" type="primary" style="margin-right:10px" @click="clickAdd">新建动作</el-button>
                </div>
            </div>
            <div style="padding: 10px 10px 10px 10px">
                <el-input
                    placeholder="请输入关键词搜索"
                    clearable
                    v-model="filterText"
                    class="tree-input"
                    suffix-icon="el-icon-search"
                    style="width:328px"
                    @input="changeSearch"
                    size="mini">
                </el-input>
            </div>
            <el-dropdown trigger="click" style="width:100%" size="small" @command="handleCommand">
                <div class="time ub ub-pe mr-1">{{sortName}}<i class="iconfont icon-tihuan"></i></div>
                <el-dropdown-menu slot="dropdown" size="small">
                    <el-dropdown-item style="font-size:12px" command="0">正序</el-dropdown-item>
                    <el-dropdown-item style="font-size:12px" command="1">倒序</el-dropdown-item>
                    <el-dropdown-item style="font-size:12px" command="2">自定义</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <div class="pl-1 pr-1 mt-1">
                <el-date-picker
                    style="width:328px"
                    v-if="sortType == 2"
                    v-model="sayTime"
                    type="daterange"
                    size="small"
                    clearable
                    value-format="yyyy-MM-dd HH:mm:ss"
                    range-separator="至"
                    @change="changTime"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </div>
            <div class="box mt-1" style="height:calc(100% - 148px);overflow: auto;">
                <div v-for="(item,index) in treeData" :key="index">
                    <div class="firstBox ub ub-ac ub-pj pl-1 pr-1">
                        <div class="ub ub-ac" style="line-height: 10px;">
                            <div style="width:15px;">
                                <i :class="!item.cut?'el-icon-caret-right':'el-icon-caret-bottom'" @click="cut(item.cut,index)"></i>
                            </div>
                            <div class="title">{{item.groupName}}</div>
                        </div>
                        <div>
                            <i class="el-icon-edit" @click="clickGroupEdit(item)"></i>
                            <i class="el-icon-delete" @click="clickGroupDel(item.id)"></i>
                        </div>
                    </div>
                    <div class="secondBox" v-for="(cont,ind) in item.actions" :key="ind" v-show="item.cut" @click="clickCont(cont,item.id)" :class="{'selectCont':cont.id == selectedId}">
                        <div class="select" v-if="cont.id == selectedId"></div>
                        <div class="ub ub-ac ub-pj header">
                            <div class="title line-1">{{cont.name}}</div>
                            <div class="time">{{cont.updateTime.slice(0,10)}}</div>
                        </div>
                        <div class="cont line-1 pl-1 pr-1">
                            {{cont.description}}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="right">
            <div class="actionBox ub ub-ac ub-pj pl-1 pr-1" v-show="selectedId">
                <div class="title">{{selectedForm.name}}</div>
                <div class="btn">
                    <el-button type="text" size="small" icon="el-icon-edit" @click="clickEdit">编辑</el-button>
                    <el-button type="text" size="small" icon="iconfont icon-sousuotiaojianbaocun" @click="clickSave">保存</el-button>
                    <el-button type="text" size="small" icon="el-icon-delete" style="color:#E34D59" @click="clickDel">删除</el-button>
                </div>
            </div>
            <div v-if="selectedId" v-loading="loading">
                <codemirror ref="myCodemirror" v-model="eventData.options" :options="cmOptions" class="my-codemirror" @ready="onCmReady"></codemirror>
            </div>
        </div>
        <!-- 新建组编辑组 -->
        <el-dialog
            :title="addGroupForm.id ? '编辑组' : '新增组'"
            :visible.sync="addGroupDialog"
            width="700px"
            custom-class="common-dialog">
            <el-form :model="addGroupForm" :rules="addGroupRules" ref="addGroupForm" label-position="top">
                <el-form-item label="分组名称：" prop="groupName" label-width="100px">
                    <el-input
                        style="width:100%;"
                        placeholder="请输入"
                        clearable
                        v-model.trim="addGroupForm.groupName"
                        size="small"
                        maxlength="20"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="addGroupDialog = false">取消</el-button>
                <el-button size="small" type="primary" @click="submitGroupAdd('addGroupForm')">确认</el-button>
            </span>
        </el-dialog>
        <!-- 删除组 -->
        <DeleteDialog :dialogVisible=delGroupDialog @delete="delGroupConfim" @cancel="delGroupDialog = false">
        </DeleteDialog>
        <!-- 新建动作编辑动作 -->
        <el-drawer :title="addForm.id?'编辑动作':'添加动作'" :visible.sync="addDialog" :size="720" custom-class="drawer-dialog" :before-close="handleClose" :modal="false">
            <div style="position:relative;overflow-y: auto;padding-bottom:50px;overflow-x: hidden;">
                <div class="drawer-title mb-1">基础信息配置</div>
                <el-form label-width="80px" label-position="top" :rules="rules" ref="addForm" :model="addForm">
                    <el-form-item label="动作名称:" prop="name">
                        <el-input maxlength="20" v-model.trim="addForm.name" placeholder="请输入" style="width: 100%" size="small" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="动作分组:" prop="grouping">
                        <el-select v-model="addForm.grouping" placeholder="请选择" size="small" style="width:100%" clearable>
                            <el-option
                                v-for="item in treeData"
                                :key="item.id"
                                :label="item.groupName"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="绑定应用:">
                        <el-select v-model="addForm.adhibitions" placeholder="请选择" size="small" style="width:100%" clearable multiple collapse-tags>
                            <el-option
                                v-for="item in applicationList"
                                :key="item.id"
                                :label="item.value"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="动作描述:" prop="description">
                        <el-input maxlength="200" v-model.trim="addForm.description" placeholder="请输入" style="width: 100%" size="small" clearable type="textarea"></el-input>
                    </el-form-item>
                </el-form>
                <div class="drawer-title mt-1 mb-1">输入参数配置</div>
                <div class="parameter-box mb-1" style="height:240px" v-for="(item,index) in addForm.imports" :key="index">
                    <div class="num">{{index+1}}</div>
                    <div class="del">
                        <el-button type="text" size="small" icon="el-icon-delete" style="color:#E34D59;margin-top:-5px" @click="delNewParameter(1,index)">删除</el-button>
                    </div>
                    <div class="mt-3 pl-1 pr-1">
                        <el-form :model="item">
                            <el-form-item label="">
                                <div class="key">参数名称</div>
                                <el-input maxlength="20" v-model.trim="item.name" placeholder="请输入" style="width: 610px" size="small" clearable></el-input>
                            </el-form-item>
                            <div class="ub ub-pj">
                                <el-form-item label="">
                                    <div class="key">参数类型</div>
                                    <el-select
                                        v-model="item.type"
                                        placeholder="请选择"
                                        size="small"
                                        style="width:262px"
                                        clearable
                                    >
                                        <el-option
                                            v-for="it in typeList"
                                            :key="it.id"
                                            :label="it.value"
                                            :value="it.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="">
                                    <div class="key">默认值</div>
                                    <el-input maxlength="20" v-model.trim="item.default" placeholder="请输入" style="width: 262px" size="small" clearable></el-input>
                                </el-form-item>
                            </div>
                            <div class="ub ub-pj">
                                <el-form-item label="">
                                    <div class="key">是否必填</div>
                                    <el-radio v-model="item.empty" label="1" class="ml-3">是</el-radio>
                                    <el-radio v-model="item.empty" label="2" @input="inputEmpty1(index)">否</el-radio>
                                </el-form-item>
                                <!-- <el-form-item label="" v-if="item.empty == 1">
                                    <div class="key">参数值</div>
                                    <el-input maxlength="20" v-model="item.parameter" placeholder="请输入" style="width: 262px" size="small" clearable></el-input>
                                </el-form-item> -->
                            </div>
                            <el-form-item label="">
                                <div class="key" style="height:52px">参数描述</div>
                                <el-input maxlength="50" v-model.trim="item.des" placeholder="请输入" style="width: 610px" size="small" clearable type="textarea" :autosize="{ minRows: 2, maxRows: 2}"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <el-button type="text" size="small" icon="el-icon-plus" @click="addNewParameter(1)">添加新参数</el-button>
                <div class="drawer-title mt-1 mb-1">输出参数配置</div>
                <div class="parameter-box mb-1" style="height:240px" v-for="(item,index) in addForm.outputs" :key="item+index">
                    <div class="num">{{index+1}}</div>
                    <div class="del">
                        <el-button type="text" size="small" icon="el-icon-delete" style="color:#E34D59;margin-top:-5px" @click="delNewParameter(2,index)">删除</el-button>
                    </div>
                    <div class="mt-3 pl-1 pr-1">
                        <el-form :model="item">
                            <el-form-item label="">
                                <div class="key">参数名称</div>
                                <el-input maxlength="20" v-model.trim="item.name" placeholder="请输入" style="width: 610px" size="small" clearable></el-input>
                            </el-form-item>
                            <div class="ub ub-pj">
                                <el-form-item label="">
                                    <div class="key">参数类型</div>
                                    <el-select v-model="item.type" placeholder="请选择" size="small" style="width:262px" clearable>
                                        <el-option
                                            v-for="it in typeList"
                                            :key="it.id"
                                            :label="it.value"
                                            :value="it.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="">
                                    <div class="key">默认值</div>
                                    <el-input maxlength="20" v-model.trim="item.default" placeholder="请输入" style="width: 262px" size="small" clearable></el-input>
                                </el-form-item>
                            </div>
                            <div class="ub ub-pj">
                                <!-- <el-form-item label="">
                                    <div class="key">是否必填</div>
                                    <el-radio v-model="item.empty" label="1" class="ml-3">是</el-radio>
                                    <el-radio v-model="item.empty" label="2" @input="inputEmpty2(index)">否</el-radio>
                                </el-form-item> -->
                                <!-- <el-form-item label="" v-if="item.empty == 1">
                                    <div class="key">参数值</div>
                                    <el-input maxlength="20" v-model="item.parameter" placeholder="请输入" style="width: 262px" size="small" clearable></el-input>
                                </el-form-item> -->
                            </div>
                            <el-form-item label="">
                                <div class="key" style="height:52px">参数描述</div>
                                <el-input maxlength="50" v-model.trim="item.des" placeholder="请输入" style="width: 610px" size="small" clearable type="textarea" :autosize="{ minRows: 2, maxRows: 2}"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <el-button type="text" size="small" icon="el-icon-plus" @click="addNewParameter(2)">添加新参数</el-button>
                <div slot="footer" class="dialog-footer" style="position: fixed;bottom: 0;right: 0;z-index: 9999;width: 720px;background: #fff;padding-bottom: 10px;text-align: right;">
                    <el-button size="small" @click="submitCloes">取消</el-button>
                    <el-button size="small" type="primary" style="margin-right:10px" @click="submitAdd('addForm')">确定</el-button>
                </div>
            </div>
        </el-drawer>
        <!-- 删除动作 -->
        <DeleteDialog :dialogVisible=delDialog @delete="delConfim" @cancel="delDialog = false">
        </DeleteDialog>
    </div>
</template>
<script>
import { codemirror } from 'vue-codemirror' // 引入组件
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/cobalt.css'
import { groupList1, saveGroup, updateGroup, deleteGroup, getFacilityList, automationSave, automationUpdate, automationDelete } from '@/server/auto_respond/action_manage.js'
require('codemirror/mode/clike/clike.js')
export default {
    components: {
        codemirror
    },
    data() {
        return {
            eventData: {
                options: ''
            },
            cmOptions: {
                tabSize: 4, // 制表符的宽度
                mode: 'text/x-java', // 使用的模式
                theme: 'cobalt', // 主题黑色
                // theme: 'darcula', // 主题白色
                lineNumbers: true, // 是否显示行号
                lineWrapping: true, // 是否应滚动或换行以显示长行
                extraKeys: { Ctrl: 'autocomplete' },
                lineWiseCopyCut: true, // 在没有选择的情况下进行复制或剪切将复制或剪切有光标的整行。
                showCursorWhenSelecting: true, // 选择处于活动状态时是否应绘制光标
                maxHighlightLength: Infinity, // 显示长行的时候 这个值是不限制，如果要做限制的话，值是number类型
                matchBrackets: true, // 光标匹配括号
                line: true,
                highlightDifferences: true,
                autoRefresh: true
                // readOnly: true, // 只读
            },
            filterText: '',
            treeData: [],
            selectedId: '', // 选中的动作ID
            selectedForm: {}, // 选中的动作数据
            selGroupId: '', // 选中的组ID
            addGroupDialog: false,
            addGroupForm: {
                id: '',
                groupName: ''
            },
            addGroupRules: {
                groupName: [{
                    required: true,
                    message: '请输入分组名称',
                    trigger: 'blur'
                }]
            },
            delGroupDialog: false,
            delGroupId: '',
            sortType: 1,
            sortName: '倒序',
            sayTime: [],
            delDialog: false,
            addDialog: false,
            addForm: {
                id: '',
                name: '',
                grouping: '',
                description: '',
                adhibitions: [],
                outInput: '',
                script: '',
                imports: [],
                outputs: []
            },
            rules: {
                name: { required: true, message: '请输入动作名称', trigger: 'blur' },
                description: { required: true, message: '请输入动作描述', trigger: 'blur' },
                adhibitions: [{ required: true, message: '请选择绑定应用', trigger: 'change' }],
                grouping: [{ required: true, message: '请选择动作分组', trigger: 'change' }]
            },
            applicationList: [
                { id: 1, value: '启明星辰防火墙' },
                { id: 2, value: '山石网科防火墙' },
                { id: 3, value: '360杀毒' }
            ],
            typeList: [
                { id: '1', value: 'String' },
                { id: '2', value: 'Int' },
                { id: '3', value: 'Float' },
                { id: '4', value: 'Boolean' },
                { id: '5', value: 'ID' }
            ],
            loading: false
        }
    },
    watch: {
        addGroupDialog(val) {
            if (!val) {
                this.$refs.addGroupForm.resetFields()
                this.addGroupForm = {
                    id: '',
                    groupName: ''
                }
            }
        },
        addDialog(val) {
            if (!val) {
                this.$refs.addForm.resetFields()
                this.addForm = {
                    id: '',
                    name: '',
                    grouping: '',
                    description: '',
                    adhibitions: [],
                    outInput: '',
                    script: '',
                    imports: [],
                    outputs: []
                }
            }
        }
    },
    created() {
        this.get_group()
        this.get_device()
    },
    methods: {
        refresh() {
            this.$refs.myCodemirror && this.$refs.myCodemirror.refresh()
        },
        inputEmpty1(index) {
            this.addForm.imports[index].parameter = ''
        },
        inputEmpty2(index) {
            this.addForm.outputs[index].parameter = ''
        },
        clickSave() {
            if (this.eventData.options == '') {
                this.$message({
                    message: '输入的代码为空！',
                    type: 'warning'
                })
                return
            }
            let obj = {
                id: this.selectedForm.id,
                script: this.eventData.options,
                name: this.selectedForm.name,
                grouping: this.selectedForm.grouping,
                description: this.selectedForm.description,
                adhibitions: this.selectedForm.adhibitions,
                outInput: this.selectedForm.outInput,
                imports: this.selectedForm.outInput != '' ? JSON.parse(this.selectedForm.outInput).imports : [],
                outputs: this.selectedForm.outInput != '' ? JSON.parse(this.selectedForm.outInput).outputs : []
            }
            console.log(this.addForm)
            let data = {
                queryData: {},
                paramsData: { ...obj }
            }
            automationUpdate(data).then(res => {
                this.$message({
                    message: '添加成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_group()
                }, 1000)
            }).catch(err => {
                console.log(err)
            })
        },
        delNewParameter(val, index) {
            if (val == 1) {
                this.addForm.imports.splice(index, 1)
            } else if (val == 2) {
                this.addForm.outputs.splice(index, 1)
            }
        },
        addNewParameter(val) {
            if (val == 1) {
                this.addForm.imports.push({ name: '', type: '', default: '', empty: '2', parameter: '' })
            } else if (val == 2) {
                this.addForm.outputs.push({ name: '', type: '', default: '', empty: '2', parameter: '' })
            }
        },
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    this.submitCloes()
                    done()
                })
                .catch(_ => {})
        },
        submitCloes() {
            this.addDialog = false
        },
        submitAdd(formName) {
            console.log(this.addForm)
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.addForm.outInput = JSON.stringify({ imports: this.addForm.imports, outputs: this.addForm.outputs })
                    this.addDialog = false
                    if (this.addForm.id) {
                        this.editSuccess()
                    } else {
                        this.addSuccess()
                    }
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        editSuccess() {
            let data = {
                queryData: {},
                paramsData: { ...this.addForm }
            }
            automationUpdate(data).then(res => {
                console.log(res)
                this.addDialog = false
                this.selectedForm = res
                this.$message({
                    message: '修改成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_group()
                }, 1000)
            }).catch(err => {
                console.log(err)
            })
        },
        addSuccess() {
            let data = {
                queryData: {},
                paramsData: { ...this.addForm }
            }
            automationSave(data).then(res => {
                this.addDialog = false
                this.$message({
                    message: '添加成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_group()
                }, 1000)
            }).catch(err => {
                console.log(err)
            })
        },
        clickEdit() {
            console.log(this.selectedForm)
            this.addForm = {
                id: this.selectedForm.id,
                name: this.selectedForm.name,
                grouping: this.selectedForm.grouping,
                description: this.selectedForm.description,
                adhibitions: this.selectedForm.adhibitions,
                outInput: this.selectedForm.outInput,
                script: this.selectedForm.script,
                imports: this.selectedForm.outInput != '' ? JSON.parse(this.selectedForm.outInput).imports : [],
                outputs: this.selectedForm.outInput != '' ? JSON.parse(this.selectedForm.outInput).outputs : []
            }
            this.eventData.options = this.selectedForm.script
            this.addDialog = true
        },
        clickAdd() {
            this.addDialog = true
        },
        delConfim() {
            automationDelete({ paramsData: { id: this.selectedId }}).then((res) => {
                this.delDialog = false
                this.$message({
                    type: 'success',
                    message: '删除成功'
                })
                this.selectedId = ''
                setTimeout(() => {
                    this.get_group()
                }, 1000)
            })
        },
        clickDel() {
            this.delDialog = true
        },
        clickGroupEdit(row) {
            console.log(row)
            this.addGroupForm.groupName = row.groupName
            this.addGroupForm.id = row.id
            this.addGroupDialog = true
        },
        clickGroupDel(id) {
            this.delGroupId = id
            this.delGroupDialog = true
        },
        delGroupConfim() {
            deleteGroup({ paramsData: { id: this.delGroupId }}).then((res) => {
                this.delGroupDialog = false
                this.$message({
                    type: 'success',
                    message: '删除成功'
                })
                setTimeout(() => {
                    this.get_group()
                }, 1000)
            })
        },
        clickGroupAdd() {
            this.addGroupDialog = true
        },
        submitGroupAdd(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.addGroupDialog = false
                    if (this.addGroupForm.id) {
                        this.editGroupSuccess()
                    } else {
                        this.addGroupSuccess()
                    }
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        editGroupSuccess() {
            let data = {
                queryData: {},
                paramsData: { ...this.addGroupForm }
            }
            updateGroup(data).then(res => {
                this.addGroupDialog = false
                this.$message({
                    message: '修改成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_group()
                }, 1000)
            }).catch(err => {
                console.log(err)
            })
        },
        addGroupSuccess() {
            let data = {
                queryData: {},
                paramsData: { ...this.addGroupForm }
            }
            saveGroup(data).then(res => {
                this.addGroupDialog = false
                this.$message({
                    message: '添加成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_group()
                }, 1000)
            }).catch(err => {
                console.log(err)
            })
        },
        onCmReady() {
            this.$refs.myCodemirror.codemirror.setSize('-webkit-fill-available', '770')
        },
        cut(val, ind) {
            this.treeData[ind].cut = !val
        },
        clickCont(val, selGroupId) {
            console.log(val)
            this.selectedId = val.id// 选中的ID
            this.selectedForm = val// 选中的数据
            this.eventData.options = val.script || ''
            this.refresh()
            this.selGroupId = selGroupId
        },
        handleCommand(val) {
            console.log(val)
            this.sortType = Number(val)
            if (val == 0) {
                this.sortName = '正序'
                setTimeout(() => {
                    this.get_group()
                }, 300)
                this.sayTime = []
            } else if (val == 1) {
                this.sortName = '倒序'
                setTimeout(() => {
                    this.get_group()
                }, 300)
                this.sayTime = []
            } else if (val == 2) {
                this.sortName = '自定义'
            }
        },
        changTime(val) {
            console.log('选中时间', val)
            setTimeout(() => {
                this.get_group()
            }, 300)
        },
        changeSearch() {
            this.selectedId = ''
            this.selectedForm = {}
            this.get_group()
        },
        get_group() {
            console.log(this.sayTime)
            this.loading = true
            let data = {
                queryData: {},
                paramsData: {
                    type: this.sortType,
                    startTime: this.sayTime != null ? this.sayTime[0] : '',
                    endTime: this.sayTime != null ? this.sayTime[1] : '',
                    name: this.filterText
                }
            }
            this.treeData = []
            groupList1(data).then(res => {
                res.map((item, index) => {
                    if (item.actions.length != 0) {
                        item.cut = true
                    } else {
                        item.cut = false
                    }
                    // if (index == 0) {
                    //     item.cut = true
                    // } else {
                    //     item.cut = true
                    // }
                })
                this.loading = false
                this.treeData = res
                this.$setsessionStorage('customAutoList', res)
            }).catch(err => {
                this.loading = false
                console.log(err)
            })
        },
        get_device() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            getFacilityList(data).then(res => {
                console.log(res, '设备')
            }).catch(err => {
                console.log(err)
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.list{
    ::v-deep .CodeMirror{
    flex-grow: 1;
    z-index: 1;
    height: 770px !important;

    .CodeMirror-code {
        line-height: 19px;
    }
}
    .drawer-title{
        font-size:12px;
        color:#0052D9;
    }
    // overflow: hidden;
    .my-codemirror {
        width:100%;padding:0;
        height:100%;
        text-align:left;
        font-size: 14px;
        ::v-deep .CodeMirror-gutters {
            border-right: 1px solid #ddd;
        }
        ::v-deep .CodeMirror  {
            background:#fff !important;
            height:770px !important;
        }
    }
    .left{
        width:348px !important;
        height:100%;
        background:#fff;
        border: 1px solid rgba(218,222,232,1);
        box-shadow: 0px 0px 8px 0px rgba(140,152,164,0.2);
        border-radius: 4px;
    }
    .right{
        width:calc(100% - 348px);
        // width:100%;
        height:100%;
        background:#fff;
        border: 1px solid rgba(218,222,232,1);
        border-radius: 4px;
    }
    .actionBox{
        height:65px;
        border-bottom: 1px solid #E7E7E7;
        .title{
            font-weight: 700;
            width:250px;
        }
    }
    .time{
        font-size:12px;
        cursor: pointer;
        text-align: right;
        .iconfont{
            font-size:13px;
            color:#387DEE;
            transform: rotate(90deg);
            display: inline-block;
        }
    }
    .box{
        .firstBox{
            background: #F3F3F3;
            height:32px;
            width:100%;
            // margin-bottom:5px;
            .el-icon-caret-bottom{
                font-size:12px;
                margin-right:3px;
                cursor: pointer;
            }
            .el-icon-caret-right{
                font-size:12px;
                margin-right:3px;
                cursor: pointer;
            }
            .title{
                font-size:12px;
            }
            .el-icon-edit{
                font-size:12px;
                margin-right:5px;
                color:rgba(0,0,0,.4);
                // color:#387DEE;
                cursor: pointer;
            }
            .el-icon-edit:hover{
                color:#387DEE;
            }
            .el-icon-delete:hover{
                color:#387DEE;
            }
            .el-icon-delete{
                color:rgba(0,0,0,.4);
                font-size:12px;
                cursor: pointer;
            }
        }
        .secondBox{
            height:60px;
            // border-top:1px solid #E7E7E7;
            border-bottom:1px solid #E7E7E7;
            cursor: pointer;
            position: relative;
            .header{
                padding:10px 10px 6px 10px;
                .title{
                    font-size:14px;
                    font-weight: 700;
                }
                .time{
                    font-size: 12px;
                    opacity: 0.26;
                }
            }
            .cont{
                font-size:12px;
                opacity: 0.4;
            }
            .select{
                position: absolute;
                width:3px;
                height:60px;
                background: #387DEE;
            }
        }
        .selectCont{
            background: rgba(56,125,238,0.05);
        }
        .secondBox:hover{
            background: rgba(56,125,238,0.05);
        }
    }
    .parameter-box{
        background: rgba(56,125,238,0.02);
        border: 1px solid rgba(221,221,221,1);
        border-radius: 4px;
        position: relative;
        .num{
            position: absolute;
            left:0;
            width:66px;
            height:24px;
            background: rgba(101,101,101,0.05);
            border: 1px solid rgba(221,221,221,1);
            border-top:none;
            border-left:none;
            border-radius: 0px 0px 12px 0px;
            text-align: center;
            line-height: 24px;
            font-size: 12px;
            color:#000;
            font-weight: 700;
        }
        .del{
            position:absolute;
            right:0;
            width:66px;
            height:24px;
            // background: #DDDDDD;
            border: 1px solid rgba(221,221,221,1);
            border-top:none;
            border-right:none;
            border-radius: 0px 0px 0px 12px;
            text-align: center;
            font-size: 12px;
            font-weight: 700;
        }
        .key{
            width: 66px;
            height:32px;
            border: 1px solid #DCDCDC;
            color: #0052D9;
            font-size: 12px;
            border-radius: 4px 0 4px 0;
            text-align: center;
        }
        ::v-deep .el-form-item__content{
            display: flex;
            label{
                line-height:32px;
            }
        }
        ::v-deep .el-input__inner{
            border-left: none !important;
            border-radius: 0 4px 4px 0;
        }
        ::v-deep .el-textarea__inner{
            border-left: none !important;
            border-radius: 0 4px 4px 0;
            max-height:52px;
        }
    }
}
</style>
