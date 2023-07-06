<template>
    <div class="modules_manage">
        <!-- 页面内容 -->
        <div class="header">
            <div class="ub ub-pj w100">
                <div class="list-tips">
                    列表内容
                </div>
                <!-- <div class="btn">
                    <div @click="addModuleDialog = true,typeModule='添加模块'"><i class="iconfont icon-tianjia" style="font-size:14px;margin-right:2px;"></i>添加模块</div>
                </div> -->
                <div>
                    <el-button
                        type="primary"
                        icon="el-icon-plus"
                        size="mini"
                        style="width:80px;padding-left:6px"
                        @click="addModuleDialog = true,typeModule='添加模块'"
                    >添加模块</el-button>
                </div>
            </div>
        </div>
        <div class="content" v-loading="loading" element-loading-background="rgba(255,255,255,.8)">
            <draggable  class="module" chosenClass="chonsen" animation="300" @choose="choose(tableData)" @unchoose="unchoose" @start="start" @end="end(tableData)" v-model="tableData">
                <div class="list-first" v-for="(first,index) in tableData" :key="first.id" :style="{paddingBottom:(first.sub === 0||orFoldIndex!==index?'0':'8px')}">
                    <div class="list">
                        <i :class="['iconfont', first.icon, 'img']"></i>
                        <div class="name">{{first.name}}</div>
                        <div style="flex:1"></div>
                        <div class="power">
                            <div :class="['status',first.cls]"></div>
                            <div>{{first.statusName}}</div>
                        </div>
                        <div style="width:70px">
                            <el-switch :width="60" v-model="first.status" @change="switchChange(first.status,first.id)" inactive-color="#c5c5c5" :active-value="0"></el-switch>
                        </div>
                        <div class="btn" style="width:140px">
                            <div @click = "addMenu(first)">添加</div>
                            <div @click = "handleEditModule(first)">编辑</div>
                            <div @click = "handleDelModule(first)">删除</div>
                            <div @click="orFold(index,first)">
                                {{orFoldIndex!==index?'展开':'收起'}}<i :class="['iconfont','icon-dingbuxiala',orFoldIndex!==index?'icon-select':'']" style="font-size:12px;margin-left:2px;"></i>
                            </div>
                        </div>
                        <div style="width:10px;height:20px"></div>
                    </div>
                    <draggable chosenClass="chonsen" animation="300" @choose="choose(first.sub)" @unchoose="unchoose" @start="start" @end="end(first.sub)" v-model="first.sub">
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
                                    <el-switch :width="60" inactive-color="#c5c5c5" v-model="second.status" :active-value="0" @change="switchChange(second.status,second.id)" :disabled="first.status===0?false:true"></el-switch>
                                </div>
                                <div class="btn" style="width:92px">
                                    <div @click.stop="add(second)">添加</div>
                                    <div @click.stop="edit(second, first.id,first.name)">编辑</div>
                                    <div @click.stop="del(second)">删除</div>
                                </div>
                                <div style="width:10px;height:20px"></div>
                            </div>
                            <draggable chosenClass="chonsen" animation="300" @choose="choose(second.sub)" @unchoose="unchoose" @start="start" @end="end(second.sub)" v-model="second.sub">
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
                                            <el-switch :width="60" inactive-color="#c5c5c5" v-model="third.status" :active-value="0" @change="switchChange(third.status,third.id)"  :disabled="second.status===0?false:true"></el-switch>
                                        </div>
                                        <div class="btn" style="width:64px">
                                            <div @click.stop="edit(third, second.id,second.name)">编辑</div>
                                            <div @click.stop="del(third)">删除</div>
                                        </div>
                                        <div style="width:10px;height:20px"></div>
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
        </div>

        <!-- 模块/一级菜单添加 -->
        <el-dialog :visible.sync="addModuleDialog" :title="typeModule" width="700">
            <el-form ref="addModule" :model="moduleForm" label-width="80px" :rules="moduleRules" label-position="top" :hide-required-asterisk="true">
                <el-form-item label="模块名称：" prop="name">
                    <label slot="label">模块名称：<span style="color:red">*</span></label>
                    <el-input v-model="moduleForm.name" placeholder="请输入内容" clearable></el-input>
                </el-form-item>
                <el-form-item label="ICON名称：">
                    <el-input v-model="moduleForm.icon" placeholder="请输入内容" clearable></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="addModuleDialog=false">取消</el-button>
                <el-button type="primary" @click="submitModuleForm('addModule')">确认</el-button>
            </span>
        </el-dialog>
        <!-- 模块/一级菜单编辑 -->
        <el-dialog :visible.sync="editModuleDialog" :title="typeModule" width="700">
            <el-form ref="editModule" :model="moduleFormEdit" label-width="80px" :rules="moduleRules" label-position="top" :hide-required-asterisk="true">
                <el-form-item label="模块名称：" prop="name">
                    <label slot="label">模块名称：<span style="color:red">*</span></label>
                    <el-input v-model="moduleFormEdit.name" placeholder="请输入内容" clearable></el-input>
                </el-form-item>
                <el-form-item label="ICON名称：">
                    <el-input v-model="moduleFormEdit.icon" placeholder="请输入内容" clearable></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="editModuleDialog=false">取消</el-button>
                <el-button type="primary" @click="submitModuleFormEdit('editModule')">确认</el-button>
            </span>
        </el-dialog>
        <!-- 其他菜单添加编辑 -->
        <el-dialog :visible.sync="otherAddDialog" :title="typeModule" width="700">
            <el-form ref="otherForm" :model="otherForm" label-width="80px" :rules="otherRules" label-position="top" :hide-required-asterisk="true">
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
                    <label slot="label">按钮配置：<span style="color:red">*</span></label>
                    <div>
                        <el-form-item
                            v-for="(item,index) in otherForm.buttons"
                            :key="index"
                            class="form"
                        >
                            <el-row :gutter="10" style="margin-bottom:20px">
                                <el-col :span="11" style="margin-bottom:10px">
                                    <el-form-item
                                        :prop="'buttons.'+index+'.name'"
                                        :rules="otherRules.buttons.name">
                                        <el-input
                                            placeholder="按钮名称"
                                            v-model="item.name"
                                            clearable
                                        ></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="11" style="margin-bottom:10px">
                                    <el-form-item
                                        :prop="'buttons.'+index+'.permissionName'"
                                        :rules="otherRules.buttons.permissionName">
                                        <el-input
                                            placeholder="按钮权限"
                                            v-model="item.permissionName"
                                            clearable
                                        ></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="11">
                                    <el-form-item
                                        :prop="'buttons.'+index+'.code'"
                                        :rules="otherRules.buttons.code">
                                        <el-input
                                            placeholder="按钮编号"
                                            v-model="item.code"
                                            clearable
                                        ></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="11">
                                    <el-form-item
                                        :prop="'buttons.'+index+'.codeType'"
                                        :rules="otherRules.buttons.codeType">
                                        <el-select
                                            style="width:418px"
                                            v-model="item.codeType"
                                            placeholder="按钮类型"
                                            :prop="'buttons.'+index+'.codeType'"
                                            :rules="otherRules.buttons.codeType">
                                            <el-option :label="item.value" :value="item.label" v-for="(item,index) in codeTypeList" :key="index"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="2"><i class="iconfont icon-shanchu" style="font-size:12px;margin-left:8px;color:red;cursor: pointer;" v-if="index != 0" @click="delConfigSe(item,index)"></i></el-col>
                            </el-row>
                        </el-form-item>
                        <div style="color:#387DEE;width:90px;cursor: pointer;" @click="addConfigSe">
                            <i class="iconfont icon-tianjia" style="font-size:12px;margin:0 4px"></i>
                            <span>添加按钮</span>
                        </div>
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="otherAddDialog=false">取消</el-button>
                <el-button type="primary" @click="submitOtherForm('otherForm')">确认</el-button>
            </span>
        </el-dialog>
        <!-- 删除模块/一级菜单 -->
        <el-dialog title="删除模块" :visible.sync="delModuleDialog" width="30%">
            <span>确定删除吗？</span>
            <span slot="footer">
                <el-button type="primary" @click="moduleDelForm">确定</el-button>
                <el-button @click="delModuleDialog = false">取消</el-button>
            </span>
        </el-dialog>
        <!-- 删除其他菜单 -->
        <el-dialog title="删除菜单" :visible.sync="otherDelDialog" width="30%">
            <span>确定删除吗？</span>
            <span slot="footer">
                <el-button type="primary" @click="handleDeleteOther">确定</el-button>
                <el-button @click="otherDelDialog = false">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import draggable from 'vuedraggable'
import { queryModule, saveModule, updateModule, deleteMenu, enable, disable, saveMenu, sort, updateMenu } from '@/server/system/modules_manage.js'
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
                        codeType: '',
                        permissionName: ''
                    }
                ]
            },
            otherRules: {
                name: [{
                    required: true,
                    message: '请输入父级菜单',
                    trigger: 'blur'
                }],
                buttons: {
                    name: [{
                        required: true,
                        message: '请输入配置名称',
                        trigger: 'blur'
                    }],
                    code: [{
                        required: true,
                        message: '请输入配置编号',
                        trigger: 'blur'
                    }],
                    codeType: [{
                        required: true,
                        message: '请输入配置类型',
                        trigger: 'blur'
                    }],
                    permissionName: [{
                        required: true,
                        message: '请输入配置权限',
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
                { label: 0, value: '添加' },
                { label: 1, value: '编辑' },
                { label: 2, value: '删除' },
                { label: 3, value: '其他' }],
            toolTip: {
                position: 'fixed',
                show: false,
                x: '',
                y: ''
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
                                codeType: '',
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
                console.log(error)
            })
            console.log('删除模块')
        },
        // 滑块状态改变
        switchChange(status, id) {
            let data = {
                queryData: {},
                paramsData: {
                    id: id
                }
            }
            if (status === 0 || false) {
                enable(data).then(res => {
                    this.loading = true
                    // this.$message({
                    //     message: '状态修改成功',
                    //     type: 'success'
                    // })
                    setTimeout(() => {
                        this.loading = false
                        this.get_data()
                    }, 500)
                }).catch(error => {
                    console.log(error)
                })
            } else {
                disable(data).then(res => {
                    this.loading = true
                    // this.$message({
                    //     message: '状态修改成功',
                    //     type: 'success'
                    // })
                    setTimeout(() => {
                        this.loading = false
                        this.get_data()
                    }, 500)
                }).catch(error => {
                    console.log(error)
                })
            }
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
            let data = {
                queryData: {},
                paramsData: {
                    name: this.otherForm.name,
                    parentId: this.otherForm.parentId,
                    url: this.otherForm.url,
                    buttons: this.otherForm.buttons,
                    id: this.otherForm.id ? this.otherForm.id : ''
                }
            }
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
                codeType: '',
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
                console.log(error)
            })
            console.log('删除模块')
        },

        // 拖拽插件事件
        choose(list) {
            this.toolTip.x = window.event.clientX - 30
            this.toolTip.y = window.event.clientY + 30
            this.timeOut = setTimeout(() => {
                this.toolTip.show = true
                list.map(item => {
                    if (item.level === 1) {
                        this.orFoldIndex = null
                    }
                })
            }, 120)
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
                this.loading = true
                setTimeout(() => {
                    this.loading = false
                    this.get_data()
                }, 700)
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
    .modules_manage{
        .header{
            .list-tips{
                height: 22px;
                line-height: 22px;
                font-size: 14px;
                color: #000000;
                padding-left: 14px;
                font-weight: 500;
                margin: 0 0 10px;
                position: relative;
            }
            .list-tips::before{
                width: 4px;
                height: 24px;
                content: " ";
                position: absolute;
                left: 0px;
                top: 50%;
                border-radius: 4px;
                background: #387dee;
                transform: translateY(-50%);
            }
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
            margin-top:10px;
            .list-first{
                background:white;
                border-radius: 4px;
                margin-bottom: 16px;
                box-shadow: 0px 0px 10px 0px rgba(41, 48, 66, 0.1);
                .list{
                    display: flex;
                    align-items: center;
                    line-height: 48px;
                    font-size: 12px;
                    .img{
                        margin-left:16px;
                        border-radius: 4px;
                        display:inline-block;
                        font-size:13px;
                    }
                    .name{
                        width:1070px;
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
                    justify-content: space-around;
                    color: #387DEE;
                    font-size: 12px;
                    cursor: pointer;
                    .icon-select::before {
                        display:inline-block;
                        transform: rotate(-90deg);
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
        .form::before{
            content:"";
            width:850px;
            border-top:1px solid #ccc;
            margin-bottom:20px;
        }
        .form:first-child::before{
            content:"";
            width:0;
            border-bottom:0;
            margin-bottom:0;
        }
    }
</style>
