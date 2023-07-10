<template>
    <div
        class="modules_manage mb-1"
        v-loading="loading"
        element-loading-background="rgba(255,255,255,.8)"
        :style="{'background':tableData.length === 0?'rgba(255,255,255,.8)':'','border-radius':tableData.length===0?'4px':'0'}">
        <!-- 页面头 -->
        <div class="header">
            <div class="ub ub-ac ub-pj w100">
                <div class="list-tips">
                    列表内容
                </div>
                <div>
                    <el-button
                        type="primary"
                        icon="el-icon-plus"
                        size="small"
                        @click="addModuleDialog = true,typeModule='添加模块'"
                        v-per="['base_module_add']"
                    >添加模块</el-button>
                </div>
            </div>
        </div>
        <!-- 页面内容 -->
        <div
            class="content">
            <!-- <draggable  class="module" chosenClass="chonsen" animation="300" @choose="choose(tableData)" @unchoose="unchoose" @start="start" @end="end(tableData)" v-model="tableData">
                <div class="list-first" v-for="(first,index) in tableData" :key="first.id" :style="{paddingBottom:(first.sub === 0||orFoldIndex!==index?'0':'8px')}"> -->
            <draggable  class="module" ghostClass="ghost" chosenClass="chosen" animation="300" @choose="choose(tableData)" @unchoose="unchoose" @start="start" @end="end(tableData)" v-model="tableData">
                <div class="list-first" v-for="(first,index) in tableData" :key="first.id" :style="{paddingBottom:(first.sub === 0||orFoldIndex!==index?'0':'8px')}" @mousemove="choose(tableData)" @mouseleave="unchoose">
                    <div class="list">
                        <div class="img"><i :class="['iconfont', first.icon]"></i></div>
                        <div class="name" style="flex:1;min-width:100px">{{first.name}}</div>
                        <!-- <div style="flex:1"></div> -->
                        <div class="power">
                            <div :class="['status',first.cls]"></div>
                            <div>{{first.statusName}}</div>
                        </div>
                        <div style="width:70px">
                            <el-switch ref="switch" :width="60" v-model="first.status" @change="switchChange(first.status,first.id)" inactive-color="#c5c5c5" :active-value="0" v-per="['base_resources_status']" style="color: transparent;"></el-switch>
                        </div>
                        <div class="btn">
                            <el-button @click = "addMenu(first)" v-per="['base_menu_add']" type="text" size="small">添加</el-button>
                            <el-button @click = "handleEditModule(first)" v-per="['base_module_edit']" type="text" size="small">编辑</el-button>
                            <el-button @click = "handleDelModule(first)" v-per="['base_resources_del']" type="text" size="small">删除</el-button>
                            <el-button @click="orFold(index,first)" type="text" size="small" :style="{'color':(first.sub.length?'':'#c5c5c5')}">
                                {{orFoldIndex!==index?'展开':'收起'}}<i :class="['iconfont','icon-dingbuxiala',orFoldIndex!==index?'icon-select':'icon-select1']" style="font-size:12px;margin-left:2px;"></i>
                            </el-button>
                        </div>
                        <div style="width:10px;height:20px"></div>
                    </div>
                    <draggable ghostClass="ghost" chosenClass="chosen" animation="300" @choose="choose(first.sub)" @unchoose="unchoose" @start="start" @end="end(first.sub)" v-model="first.sub">
                        <div class="list-second" v-for="second in first.sub" :key="second.id" v-show="orFoldIndex===index">
                            <div class="list public">
                                <div class="name" :title="second.name">{{second.name}}</div>
                                <div style="flex:1"></div>
                                <div class="link">
                                    <i class="iconfont icon-lianjie"></i>
                                    <div>{{second.url}}</div>
                                </div>
                                <div class="config">
                                    <i class="iconfont icon-quanxian"></i>
                                    <div>{{second.buttonNames}}</div>
                                </div>
                                <div style="width:60px;margin-right:8px;display:flex">
                                    <el-switch :width="60" inactive-color="#c5c5c5" v-model="second.status" :active-value="0" @change="switchChange(second.status,second.id)" :disabled="first.status===0?false:true" v-per="['base_resources_status']" style="color: transparent;"></el-switch>
                                </div>
                                <div class="btn">
                                    <el-button @click.stop="add(second)" v-per="['base_menu_add']" type="text" size="small">添加</el-button>
                                    <el-button @click.stop="edit(second, first.id,first.name)" v-per="['base_menu_edit']" type="text" size="small">编辑</el-button>
                                    <el-button @click.stop="del(second)" v-per="['base_resources_del']" type="text" size="small">删除</el-button>
                                </div>
                                <div style="width:15px;height:20px"></div>
                            </div>
                            <draggable ghostClass="ghost" chosenClass="chosen" animation="300" @choose="choose(second.sub)" @unchoose="unchoose" @start="start" @end="end(second.sub)" v-model="second.sub">
                                <div class="list-third" v-for="third in second.sub" :key="third.id" v-show="orFoldIndex===index">
                                    <div class="list public">
                                        <div class="name" :title="third.name">{{third.name}}</div>
                                        <div style="flex:1"></div>
                                        <div class="link">
                                            <i class="iconfont icon-lianjie"></i>
                                            <div>{{third.url}}</div>
                                        </div>
                                        <div class="config">
                                            <i class="iconfont icon-quanxian"></i>
                                            <div>{{third.buttonNames}}</div>
                                        </div>
                                        <div style="width:60px;;margin-left:28px;margin-right:8px;display:flex">
                                            <el-switch :width="60" inactive-color="#c5c5c5" v-model="third.status" :active-value="0" @change="switchChange(third.status,third.id)"  :disabled="second.status===0?false:true" v-per="['base_resources_status']" style="color: transparent;"></el-switch>
                                        </div>
                                        <div class="btn">
                                            <el-button @click.stop="edit(third, second.id,second.name)" v-per="['base_menu_edit']" type="text" size="small">编辑</el-button>
                                            <el-button @click.stop="del(third)" v-per="['base_resources_del']" type="text" size="small">删除</el-button>
                                        </div>
                                        <div style="width:15px;height:20px"></div>
                                    </div>
                                </div>
                            </draggable>
                        </div>
                    </draggable>
                </div>
            </draggable>
            <div class="toolTip" v-if="toolTip.show" :style="{position:toolTip.position,top:toolTip.y+'px',left:toolTip.x+'px'}">
                <i class="iconfont icon-fanyebeifen" style="font-size:12px"></i>
                拖拽排序
            </div>
            <div style="display:flex;justify-content:center;line-height:700px;color: #909399;font-size:12px" v-if="tableData.length === 0">
                <div>暂无数据</div>
            </div>
        </div>
        <!-- 模块/一级菜单添加 -->
        <el-dialog :visible.sync="addModuleDialog" :title="typeModule" width="700px" custom-class="common-dialog">
            <el-form ref="addModule" :model="moduleForm" label-width="80px" :rules="moduleRules" label-position="top" :hide-required-asterisk="true" size="small">
                <el-form-item label="模块名称：" prop="name">
                    <label slot="label">模块名称：<span style="color:red">*</span></label>
                    <el-input v-model="moduleForm.name" placeholder="请输入内容" clearable></el-input>
                </el-form-item>
                <el-form-item label="ICON名称：">
                    <el-input v-model="moduleForm.icon" placeholder="请输入内容" clearable></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="addModuleDialog=false" size="small">取消</el-button>
                <el-button type="primary" @click="submitModuleForm('addModule')" size="small">确认</el-button>
            </span>
        </el-dialog>
        <!-- 模块/一级菜单编辑 -->
        <el-dialog :visible.sync="editModuleDialog" :title="typeModule" width="700px" custom-class="common-dialog">
            <el-form ref="editModule" :model="moduleFormEdit" label-width="80px" :rules="moduleRules" label-position="top" :hide-required-asterisk="true" size="small">
                <el-form-item label="模块名称：" prop="name">
                    <label slot="label">模块名称：<span style="color:red">*</span></label>
                    <el-input v-model="moduleFormEdit.name" placeholder="请输入内容" clearable></el-input>
                </el-form-item>
                <el-form-item label="ICON名称：">
                    <el-input v-model="moduleFormEdit.icon" placeholder="请输入内容" clearable></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="editModuleDialog=false" size="small">取消</el-button>
                <el-button type="primary" @click="submitModuleFormEdit('editModule')" size="small">确认</el-button>
            </span>
        </el-dialog>
        <!-- 其他菜单添加编辑 -->
        <el-dialog :visible.sync="otherAddDialog" :title="typeModule" width="800px" custom-class="common-dialog">
            <el-form ref="otherForm" :model="otherForm" label-width="80px" :rules="otherRules" label-position="top" :hide-required-asterisk="true" size="small">
                <el-form-item label="菜单名称：" prop="name">
                    <label slot="label">菜单名称：<span style="color:red">*</span></label>
                    <el-input v-model="otherForm.name" placeholder="请输入内容" clearable></el-input>
                </el-form-item>
                <el-form-item label="父级菜单：">
                    <el-input v-model="otherForm.parentName" placeholder="请输入内容" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="URL：">
                    <el-input v-model="otherForm.url" placeholder="请输入内容" clearable></el-input>
                </el-form-item>
                <el-form-item label="按钮配置：">
                    <el-form-item
                        v-for="(item,index) in otherForm.buttons"
                        :key="index"
                        class="form"
                        style="height:40px"
                    >
                        <el-row :gutter="10">
                            <el-col :span="5">
                                <el-form-item>
                                    <el-input
                                        placeholder="按钮名称"
                                        v-model="item.name"
                                        clearable
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="9">
                                <el-form-item>
                                    <el-input
                                        placeholder="请选择按钮权限"
                                        v-model="item.permissionName"
                                        clearable
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item>
                                    <el-input
                                        placeholder="请选择按钮编号"
                                        v-model="item.code"
                                        clearable
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="3">
                                <el-form-item>
                                    <el-select
                                        v-model="item.codeType"
                                        placeholder="是否必选"
                                        :prop="'buttons.'+index+'.codeType'"
                                        :rules="otherRules.buttons.codeType">
                                        <el-option :label="item.value" :value="item.label" v-for="(item,index) in codeTypeList" :key="index"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="1"><i class="iconfont icon-shanchu" style="font-size:12px;margin-left:8px;color:red;cursor: pointer;" v-if="index != 0" @click="delConfigSe(item,index)"></i></el-col>
                        </el-row>
                    </el-form-item>
                    <div style="color:#0052d9;width:90px;cursor: pointer;" @click="addConfigSe">
                        <i class="iconfont icon-tianjia" style="font-size:12px;margin:0 4px"></i>
                        <span>添加按钮</span>
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="otherAddDialog=false" size="small">取消</el-button>
                <el-button type="primary" @click="submitOtherForm('otherForm')" size="small">确认</el-button>
            </span>
        </el-dialog>
        <DeleteDialog
            :dialogVisible = delModuleDialog
            @delete="moduleDelForm"
            @cancel="delModuleDialog = false">
        </DeleteDialog>
        <DeleteDialog
            :dialogVisible = otherDelDialog
            @delete="handleDeleteOther"
            @cancel="otherDelDialog = false">
        </DeleteDialog>
    </div>
</template>

<script>
import draggable from 'vuedraggable'
import { queryModule, saveModule, updateModule, deleteMenu, updateStatus, saveMenu, sort, updateMenu } from '@/server/system/modules_manage.js'
export default {
    components: {
        draggable
    },
    data() {
        return {
            addModuleDialog: false,
            editModuleDialog: false,
            delModuleDialog: false,
            moduleDelId: '',
            moduleForm: {
                name: '',
                icon: ''
            },
            moduleFormEdit: {
                name: '',
                icon: '',
                id: ''
            },
            moduleRules: {
                name: [{
                    required: true,
                    message: '请输入模块名称',
                    trigger: 'blur'
                }]
            },
            tableData: [],
            model: '',
            otherAddDialog: false,
            otherForm: {
                id: '',
                name: '',
                parentId: '',
                parentName: '',
                url: '',
                buttons: [
                    {
                        name: '',
                        code: '',
                        codeType: '非必选',
                        permissionName: ''
                    }
                ]
            },
            otherRules: {
                name: [{
                    required: true,
                    message: '请输入菜单名称',
                    trigger: 'blur'
                }],
                buttons: {
                    name: [{
                        required: true,
                        message: '请输入按钮名称',
                        trigger: 'blur'
                    }],
                    code: [{
                        required: true,
                        message: '请输入按钮编号',
                        trigger: 'blur'
                    }],
                    codeType: [{
                        required: true,
                        message: '请输入按钮类型',
                        trigger: 'blur'
                    }],
                    permissionName: [{
                        required: true,
                        message: '请输入按钮权限',
                        trigger: 'blur'
                    }]
                }
            },
            otherDelId: '',
            otherDelDialog: false,
            orFoldIndex: null,
            level: 0,
            typeModule: '',
            loading: false,
            codeTypeList: [
                { label: 0, value: '非必选' },
                { label: 1, value: '必选' }],
            toolTip: {
                position: 'fixed',
                show: false,
                x: '',
                y: '',
                picth: '#387dee'
            },
            timeOut: ''
        }
    },
    watch: {
        addModuleDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.addModule.resetFields()
                    this.moduleForm = {
                        name: '',
                        icon: ''
                    }
                }
            }
        },
        editModuleDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.editModule.resetFields()
                    this.moduleFormEdit = {
                        name: '',
                        icon: '',
                        id: ''
                    }
                }
            }
        },
        otherAddDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.otherForm.resetFields()
                    this.otherForm = {
                        id: '',
                        name: '',
                        parentId: '',
                        parentName: '',
                        url: '',
                        buttons: [
                            {
                                name: '',
                                code: '',
                                codeType: '非必选',
                                permissionName: ''
                            }
                        ]
                    }
                }
            }
        }
    },
    created() {
        this.get_data()
    },
    methods: {
        // 初始化数据
        async get_data() {
            this.loading = true
            let data = { queryData: {}, paramsData: {}}
            await queryModule(data).then((res) => {
                res.map(item => {
                    let list = this.$flatten(item.sub, 'sub')
                    let statusList = []
                    list.map(i => {
                        statusList.push(i.status)
                    })
                    statusList.push(item.status)
                    if (statusList.includes(0) && statusList.includes(1)) {
                        item.statusName = '部分启用'
                        item.cls = 'status1'
                    } else if (statusList.includes(0) || (item.status === 0 && item.sub.length === 0)) {
                        item.statusName = '全部启用'
                        item.cls = 'status2'
                    } else if (statusList.includes(1) || (item.status === 1 && item.sub.length === 0)) {
                        item.statusName = '全部禁用'
                        item.cls = 'status0'
                    }
                })
                this.forData(res, this.level)
                this.tableData = res
                this.loading = false
            }).catch(error => {
                this.loading = false
                console.log(error)
            })
        },
        // 拖拽完成初始化数据没有loading
        async get_dataEnd() {
            let data = { queryData: {}, paramsData: {}}
            await queryModule(data).then((res) => {
                res.map(item => {
                    let list = this.$flatten(item.sub, 'sub')
                    let statusList = []
                    list.map(i => {
                        statusList.push(i.status)
                    })
                    statusList.push(item.status)
                    if (statusList.includes(0) && statusList.includes(1)) {
                        item.statusName = '部分启用'
                        item.cls = 'status1'
                    } else if (statusList.includes(0) || (item.status === 0 && item.sub.length === 0)) {
                        item.statusName = '全部启用'
                        item.cls = 'status2'
                    } else if (statusList.includes(1) || (item.status === 1 && item.sub.length === 0)) {
                        item.statusName = '全部禁用'
                        item.cls = 'status0'
                    }
                })
                this.forData(res, this.level)
                this.tableData = res
            }).catch(error => {
                console.log(error)
            })
        },
        // 递归给tree数据添加等级
        forData(arr, level) {
            level += 1
            for (var i = 0; i < arr.length; i++) {
                let obj = arr[i]
                obj.level = level
                if (obj.sub) {
                    this.forData(obj.sub, level)
                }
            }
        },
        // 点击展开收起
        orFold(value, item) {
            console.log(this.orFoldIndex, value)
            if (item.sub.length != 0) {
                if (this.orFoldIndex === value) {
                    this.orFoldIndex = null
                } else {
                    this.orFoldIndex = value
                }
            } else {
                this.orFoldIndex = null
            }
        },
        // 添加模块点击确认向后台发请求
        submitModuleForm(formName) {
            let data = {
                queryData: {},
                paramsData: {
                    name: this.moduleForm.name,
                    icon: this.moduleForm.icon
                }
            }
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    saveModule(data).then((res) => {
                        this.addModuleDialog = false
                        this.loading = true
                        this.$message({
                            message: '添加成功',
                            type: 'success'
                        })
                        setTimeout(() => {
                            this.loading = false
                            this.get_data()
                        }, 1500)
                    }).catch(error => {
                        this.addModuleDialog = false
                        this.loading = false
                        console.log(error)
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
            console.log('添加模块', this.moduleForm)
        },
        // 编辑模块点击确认向后台发请求
        submitModuleFormEdit(formName) {
            console.log(this.moduleFormEdit)
            let data = {
                queryData: {},
                paramsData: {
                    name: this.moduleFormEdit.name,
                    icon: this.moduleFormEdit.icon,
                    id: this.moduleFormEdit.id
                }
            }
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    updateModule(data).then((res) => {
                        this.loading = true
                        this.editModuleDialog = false
                        this.$message({
                            message: '编辑成功',
                            type: 'success'
                        })
                        setTimeout(() => {
                            this.loading = false
                            this.get_data()
                        }, 1500)
                    }).catch(error => {
                        this.editModuleDialog = false
                        this.loading = false
                        console.log(error)
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
            console.log('编辑模块', this.moduleFormEdit)
        },
        // 点击编辑，展开模块弹框，把数据复制给moduleForm
        handleEditModule(list) {
            this.editModuleDialog = true
            this.typeModule = '编辑模块'
            this.moduleFormEdit.id = list.id
            this.moduleFormEdit.name = list.name
            this.moduleFormEdit.icon = list.icon
        },
        // 点击删除，展开模块弹框
        handleDelModule(list) {
            this.delModuleDialog = true
            this.moduleDelId = list.id
            console.log(list)
        },
        // 点击删除模块，确认向后台发请求
        moduleDelForm() {
            let data = {
                queryData: {},
                paramsData: {
                    id: this.moduleDelId
                }
            }
            deleteMenu(data).then((res) => {
                this.loading = true
                this.delModuleDialog = false
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.loading = false
                    this.get_data()
                }, 1500)
            }).catch(error => {
                this.delModuleDialog = false
                this.loading = false
                console.log(error)
            })
            console.log('删除模块')
        },
        // 滑块状态改变
        switchChange(status, id) {
            let data = {
                queryData: {},
                paramsData: {
                    id: id,
                    status: status === false || 0 ? 1 : 0
                }
            }
            updateStatus(data).then(res => {
                this.loading = true
                setTimeout(() => {
                    this.loading = false
                    this.get_data()
                }, 500)
            }).catch(error => {
                this.loading = false
                console.log(error)
            })
            // console.log('模块滑块状态改变', status, id)
        },
        // 一级菜单添加
        addMenu(list) {
            this.otherForm.parentId = list.id
            this.otherForm.parentName = list.name
            this.otherAddDialog = true
            this.typeModule = '添加菜单'
        },

        // 其他菜单功能
        add(list) {
            console.log('添加菜单', list)
            this.otherForm.parentId = list.id
            this.otherForm.parentName = list.name
            this.otherAddDialog = true
            this.typeModule = '添加菜单'
        },
        edit(list, parentId, parentName) {
            console.log('编辑菜单', list, parentId, parentName)
            this.otherForm.id = list.id
            this.otherForm.parentId = parentId
            this.otherForm.parentName = parentName
            this.otherForm.url = list.url
            this.otherForm.name = list.name
            this.otherForm.buttons = list.buttons.map(item => {
                return {
                    name: item.name,
                    code: item.code,
                    codeType: item.codeType,
                    permissionName: item.permissionName
                }
            })
            this.otherAddDialog = true
            this.typeModule = '编辑菜单'
        },
        del(list, parentId) {
            console.log('删除菜单', list, parentId)
            this.otherDelId = list.id
            this.otherDelDialog = true
        },

        // 其他菜单添加
        submitOtherForm(formName) {
            let buttons = []
            this.otherForm.buttons.map((item) => {
                if (item.codeType === '非必选') {
                    item.codeType = 0
                }
                if (item.name != '') {
                    buttons.push(item)
                }
            })
            let data = {
                queryData: {},
                paramsData: {
                    name: this.otherForm.name,
                    parentId: this.otherForm.parentId,
                    url: this.otherForm.url,
                    buttons: buttons,
                    id: this.otherForm.id ? this.otherForm.id : ''
                }
            }
            console.log(data)
            if (this.otherForm.id) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        updateMenu(data).then(res => {
                            this.loading = true
                            this.otherAddDialog = false
                            setTimeout(() => {
                                this.loading = false
                                this.get_data()
                            }, 1500)
                        }).catch(error => {
                            this.loading = false
                            console.log(error)
                        })
                    } else {
                        console.log('error submit!!')
                        return false
                    }
                })
            } else {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        saveMenu(data).then(res => {
                            this.loading = true
                            this.otherAddDialog = false
                            setTimeout(() => {
                                this.loading = false
                                this.get_data()
                            }, 1500)
                        }).catch(error => {
                            this.loading = false
                            console.log(error)
                        })
                    } else {
                        console.log('error submit!!')
                        return false
                    }
                })
            }
        },
        // 其他菜单表单配置添加
        addConfigSe() {
            console.log('配置添加')
            this.otherForm.buttons.push({
                name: '',
                code: '',
                codeType: '非必选',
                permissionName: ''
            })
        },
        // 其他菜单表单配置删除
        delConfigSe(i, v) {
            this.otherForm.buttons.splice(v, 1)
        },
        // 其他菜单删除
        handleDeleteOther() {
            let data = {
                queryData: {},
                paramsData: {
                    id: this.otherDelId
                }
            }
            deleteMenu(data).then((res) => {
                this.loading = true
                this.otherDelDialog = false
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.loading = false
                    this.get_data()
                }, 1500)
            }).catch(error => {
                this.otherDelDialog = false
                this.loading = false
                console.log(error)
            })
            console.log('删除模块')
        },

        // 拖拽插件事件
        choose(list) {
            this.toolTip.x = window.event.clientX - 30
            this.toolTip.y = window.event.clientY + 30
            this.toolTip.show = true
            // list.map(item => {
            //     if (item.level === 1) {
            //         this.orFoldIndex = null
            //     }
            // })
            this.timeOut = setTimeout(() => {
            }, 80)
        },
        unchoose() {
            clearTimeout(this.timeOut)
            this.toolTip.show = false
            this.toolTip.x = ''
            this.toolTip.y = ''
        },
        start() {
            this.toolTip.show = false
            this.toolTip.x = ''
            this.toolTip.y = ''
        },
        end(list) {
            let ids = []
            if (list) {
                list.map((item, index) => {
                    ids.push(item.id)
                })
            }
            let data = {
                queryData: {},
                paramsData: { ids: ids }
            }
            sort(data).then(res => {
                setTimeout(() => {
                    this.get_dataEnd()
                }, 700)
                this.$message({
                    message: '操作成功',
                    type: 'success'
                })
                console.log('拖拽成功')
            }).catch(error => {
                console.log(error)
            })
            console.log('向后台发送请求', this.tableData)
        }
    }
}
</script>

<style scoped lang="scss">
  .chosen{
      >.list{
          border:1px solid $high-color
      }

  }
  .ghost{
    >.list{
          border:1px solid $high-color
      }
  }
    .modules_manage{
        height:100%;
        overflow-y:hidden !important;
        .header{
            //.list-tips{
            //    height: 22px;
            //    line-height: 22px;
            //    font-size: 14px;
            //    color: #000000;
            //    padding-left: 14px;
            //    font-weight: 500;
            //    margin: 0 0 10px;
            //    position: relative;
            //}
            //.list-tips::before{
            //    width: 4px;
            //    height: 24px;
            //    content: " ";
            //    position: absolute;
            //    left: 0px;
            //    top: 50%;
            //    border-radius: 4px;
            //    background: #387dee;
            //    transform: translateY(-50%);
            //}
            .btn{
                width: 80px;
                height: 32px;
                border-radius: 4px;
                background: #387dee;
                color:#fff;
                font-size: 12px;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
            }
        }
        .content{
            height:100%;
            overflow-y:auto !important;
            margin-top:10px;
            padding-bottom:100px;
            .list-first{
                background:white;
                border-radius: 4px;
                margin-bottom: 16px;
                border:1px solid #dadee8;
                box-shadow: 0 0 8px rgba(140,152,164,0.2);
                transition: all .6s ease;
                .list{
                    display: flex;
                    align-items: center;
                    line-height: 48px;
                    font-size: 12px;
                    .img{
                        width:32px;
                        height:32px;
                        display:flex;
                        margin-left:16px;
                        border-radius: 4px;
                        background:#387dee;
                        justify-content: center;
                        align-items: center;
                        color:#fff;
                    }
                    .name{
                        width:1000px;
                        margin-left: 8px;
                        font-size: 14px;
                    }
                    .power{
                        width:300px;
                        display: flex;
                        align-items: center;
                        .status{
                            width: 6px;
                            height: 6px;
                            border-radius: 100%;
                            margin-right: 6px;
                        }
                        .status0{
                            background-color: #c5c5c5;
                        }
                        .status1{
                            background-color: #f2995f;
                        }
                        .status2{
                            background-color: #48c79c;;
                        }
                    }
                }
                .list-second{
                    .list{
                        display: flex;
                        align-items: center;
                        line-height: 40px;
                        margin-left: 20px;
                        border-radius: 4px;
                        margin-bottom: 8px;
                        background: #f3f3f3;
                        margin-right:20px;
                    }
                    .list-third{
                        .list{
                            display: flex;
                            align-items: center;
                            line-height: 32px;
                            background: #dcdcdc;
                            margin:0 20px 8px 36px;
                            border-radius: 4px;
                            font-size: 12px;
                        }
                    }
                }
                .btn{
                    display: flex;
                    justify-content: flex-end;
                    color: #387DEE;
                    font-size: 12px;
                    cursor: pointer;
                    .icon-select::before {
                        display:inline-block;
                        transform: rotate(-90deg);
                        transition: .4s;
                        transform-origin: center;
                    }
                    .icon-select1::before {
                        display:inline-block;
                        transition: .4s;
                        transform-origin: center;
                    }
                }
                .public{
                        .name{
                            margin-left: 36px;
                            font-size: 12px;
                            width:150px;
                            overflow:hidden;
                            text-overflow:ellipsis;
                            white-space:nowrap;
                        }
                        .link{
                            width:500px;
                            display:flex;
                            i{
                                font-size:12px;
                                margin-right:6px;
                                color:blue
                            }
                            div{
                                width:300px;
                                overflow:hidden;
                                text-overflow:ellipsis;
                                white-space:nowrap;
                            }
                        }
                        .config{
                            width:620px;
                            display:flex;
                            i{
                                font-size:12px;
                                margin-right:6px;
                                color:blue;
                            }
                            div{
                                width:350px;
                                overflow:hidden;
                                text-overflow:ellipsis;
                                white-space:nowrap;
                            }
                        }
                }
            }
        }
        .list-first ::v-deep .el-switch__core::before {
            content: "停用";
            position: absolute;
            top: -2px;
            right: 7px;
            color: #fff;
            font-size:12px;
        }
        .list-first .is-checked ::v-deep .el-switch__core::before {
            content: "启用";
            position: absolute;
            top: -2px;
            left: 7px;
            color: #fff;
            font-size:12px;
        }
        // 排序提示框
        .chonsen{
            cursor: pointer;
        }
        .module:hover{
            cursor: pointer;
        }
        .toolTip{
            width: 80px;
            height: 26px;
            background: black;
            color: #fff;
            border-radius: 4px;
            text-align: center;
            line-height: 26px;
            font-size: 12px;
        }
    }
</style>
