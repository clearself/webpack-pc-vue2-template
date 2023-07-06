<template>
    <div class='event'>
        <div class="list-container">
            <div class="ub ub-pj w100 mb-1" style="padding-top: 12px">
                <div class="list-tips">基础输出配置
                </div>
            </div>
            <div style="width:100%;" class="tab-wrapper">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="logstash节点管理" name="first">
                        <div style="padding-top: 10px">
                            <div class="ub ub-ver ub-ac ub-f1" style="height: 46px;line-height: 46px">
                                <el-row type="flex" class="w100 ub ub-ac" style="border-radius:0 0 5px 5px;">
                                    <el-col :span="22">
                                        <el-form :inline="true" :model="get_params" class="demo-form-inline">
                                            <el-form-item>
                                                <el-input size="small" @keyup.enter.native="searchData" clearable v-model.trim="get_params.name" placeholder="请输入要搜索的节点名称">
                                                    <el-button slot="append" @click="searchData" icon="el-icon-search"></el-button>
                                                </el-input>
                                            </el-form-item>
                                        </el-form>
                                    </el-col>
                                    <el-col :span="2" style="margin-top: -34px">
                                        <div class="ub ub-pe">
                                            <el-button icon="el-icon-plus" v-per="['base_output_add']" size="small" type="primary" @click="(addNodeDialog = true)">添加节点</el-button>
                                        </div>
                                    </el-col>
                                </el-row>
                            </div>
                            <el-table
                                ref="multipleTable"
                                :row-style="{ height: '32px' }"
                                :header-row-style="{ height: '32px' }"
                                :row-class-name="tableRowClassName"
                                v-loading="loading"
                                class='bigTable'
                                :data="tableData"
                                :height="tableHeight"
                                border
                                stripe
                                tooltip-effect="dark">
                                <el-table-column align="center" type="index" width="50" :index="indexMatchUserMethod">
                                </el-table-column>
                                <el-table-column prop="name" label="节点名称">
                                </el-table-column>
                                <el-table-column prop="ip" label="IP地址">
                                </el-table-column>
                                <el-table-column prop="port" label="端口">
                                </el-table-column>
                                <el-table-column prop="username" label="用户名">
                                </el-table-column>
                                <el-table-column prop="password" label="密码">
                                    <template slot-scope="{row}">
                                        <p>
                                            <span v-if="row.flag">******</span>
                                            <span v-else>{{row.password}}</span>
                                            <i style="color: #387dee;cursor: pointer;float: right;margin-top: 5px" @click="row.flag = !row.flag" class="el-icon-view"></i>
                                        </p>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="path" label="部署根目录">
                                </el-table-column>
                                <el-table-column align="center" label="操作" width="120">
                                    <template slot-scope="scope">
                                        <el-button v-per="['base_output_edit']" type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                                        <el-button v-per="['base_output_del']"  type="text" size="small" @click="handleDel(scope.row)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-tab-pane>
                </el-tabs>

                <el-dialog title="添加节点" width="700px" :visible.sync="addNodeDialog" custom-class="common-dialog">
                    <el-form :model="nodeForm" ref="nodeForm" :rules="nodeRules" label-position="top" label-width="120px">
                        <el-form-item label="节点名称：" prop="nodeName">
                            <el-input placeholder="请输入节点名称" v-model.trim="nodeForm.nodeName" size="small"></el-input>
                        </el-form-item>
                        <el-form-item label="IP地址：" prop="ip">
                            <el-input placeholder="请输入IP地址" v-model.trim="nodeForm.ip" size="small"></el-input>
                        </el-form-item>
                        <el-form-item label="端口：" prop="port">
                            <el-input placeholder="请输入端口" v-model.trim="nodeForm.port" size="small"></el-input>
                        </el-form-item>
                        <el-form-item label="用户名：" prop="userName">
                            <el-input placeholder="请输入用户名" v-model.trim="nodeForm.userName" size="small" auto-complete="new-password"></el-input>
                        </el-form-item>
                        <el-form-item label="密码：" prop="password">
                            <el-input placeholder="请输入密码" v-model.trim="nodeForm.password" show-password size="small" auto-complete="new-password"></el-input>
                        </el-form-item>
                        <el-form-item label="部署根目录：" prop="catalogue">
                            <el-input placeholder="请输入部署根目录(例如：/user/logstash)" v-model.trim="nodeForm.catalogue" size="small"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button size="small"  @click="addNodeDialog = false">取 消</el-button>
                        <el-button size="small" type="primary" @click="validAdd('nodeForm')" :loading="addloading">确 定</el-button>
                    </div>
                </el-dialog>

                <el-dialog title="编辑节点" width="700px" :visible.sync="editNodeDialog" custom-class="common-dialog">
                    <el-form :model="editNodeForm" ref="editNodeForm" :rules="nodeRules" label-position="top" label-width="120px">
                        <el-form-item label="节点名称：" prop="nodeName">
                            <el-input placeholder="请输入节点名称" v-model.trim="editNodeForm.nodeName" size="small"></el-input>
                        </el-form-item>
                        <el-form-item label="IP地址：" prop="ip">
                            <el-input placeholder="请输入IP地址" v-model.trim="editNodeForm.ip" size="small"></el-input>
                        </el-form-item>
                        <el-form-item label="端口：" prop="port">
                            <el-input placeholder="请输入端口" v-model.trim="editNodeForm.port" size="small"></el-input>
                        </el-form-item>
                        <el-form-item label="用户名：" prop="userName">
                            <el-input placeholder="请输入用户名" v-model.trim="editNodeForm.userName" size="small"></el-input>
                        </el-form-item>
                        <el-form-item label="密码：" prop="password">
                            <el-input placeholder="请输入密码" v-model.trim="editNodeForm.password" show-password size="small"></el-input>
                        </el-form-item>
                        <el-form-item label="部署根目录：" prop="catalogue">
                            <el-input placeholder="请输入部署根目录" v-model.trim="editNodeForm.catalogue" size="small"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button size="small" @click="editNodeDialog = false">取 消</el-button>
                        <el-button size="small" type="primary" @click="validEdit('editNodeForm')" :loading="addloading">确 定</el-button>
                    </div>
                </el-dialog>

                <DeleteDialog
                    :dialogVisible = delDialog
                    @delete="delConfim"
                    @cancel="delDialog = false">
                </DeleteDialog>

                <DeleteDialog
                    :dialogVisible = channelDialog
                    @delete="del_channel"
                    @cancel="channelDialog = false">
                </DeleteDialog>
            </div>
        </div>
    </div>
</template>

<script>
import {
    get_es_config,
    save_es_config,
    save_channel_config,
    delete_channel_config,
    get_channel_config,
    get_logstash,
    save_logstash,
    updateLogstashNodes,
    delete_logstash
} from '@/server/system/system_params.js'

export default {
    name: 'SystemParams',
    data() {
        var hasId = (rule, value, callback) => {
            if (this.esForm.idRadio == '1' && value === '') {
                return callback(new Error('请输入document_id'))
            } else {
                callback()
            }
        }
        return {
            addloading: false,
            tableHeight: document.body.clientHeight - 270,
            deleteId: '',
            matches: [],
            addNodeDialog: false,
            editNodeDialog: false,
            delDialog: false,
            channelDialog: false,
            recordDeleteItem: '',
            timer: null,
            esForm: {
                index: '',
                topic_id: '',
                id: ''
            },
            consumeForm: {
                names: [
                    {
                        name: '',
                        id: ''
                    }
                ]
            },
            nodeForm: {
                nodeName: '',
                ip: '',
                port: '',
                userName: '',
                password: '',
                catalogue: ''
            },
            editNodeForm: {
                id: '',
                nodeName: '',
                ip: '',
                port: '',
                userName: '',
                password: '',
                catalogue: ''
            },
            total_num: 0,
            get_params: {
                name: '',
                size: 10,
                page: 1
            },
            loading: false,
            tableData: [],
            esRules: {
                topic_id: [{
                    required: true,
                    message: '请输入topic_id',
                    trigger: 'blur'
                }],
                index: [{
                    required: true,
                    message: '请输入index',
                    trigger: 'blur'
                }]
            },
            nodeRules: {
                nodeName: [{
                    required: true,
                    message: '请输入节点名称',
                    trigger: 'blur'
                }],
                ip: [{
                    required: true,
                    message: '请输入IP地址',
                    trigger: 'blur'
                },
                {
                    pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
                    message: '请填写正确的IP',
                    trigger: 'blur'
                }],
                port: [{
                    required: true,
                    message: '请输入端口',
                    trigger: 'blur'
                }],
                userName: [{
                    required: true,
                    message: '请输入用户名称',
                    trigger: 'blur'
                }],
                password: [{
                    required: true,
                    message: '请输入密码',
                    trigger: 'blur'
                }],
                catalogue: [{
                    required: true,
                    message: '请输入部署根目录',
                    trigger: 'blur'
                }]
            },
            formLabelWidth: '140px',
            activeName: 'first'
        }
    },

    mounted() {
        this.$nextTick(() => {
            this.get_data()
            // this.getEsConfig();
        })
    },
    watch: {
        'esForm.idRadio': {
            handler(newVal, oldVal) {
                if (newVal == '2') {
                    console.log(newVal)
                    this.$refs.esForm.clearValidate('document_id')
                }
            }
        },
        addNodeDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.nodeForm.resetFields()
                }
            }
        }
    },
    methods: {
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex % 2) {
                return 'table-row2'
            } else {
                return 'table-row1'
            }
        },
        indexMatchUserMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        searchData() {
            this.get_params.page = 1
            this.get_data()
        },
        handleSizeChange(val) {
            this.get_params.size = val
            this.get_data()
        },
        handleCurrentChange(val) {
            this.get_params.page = val
            this.get_data()
        },

        get_data() {
            let data = {
                queryData: {},
                paramsData: {
                    name: this.get_params.name
                }
            }
            this.loading = true
            get_logstash(data).then(res => {
                this.loading = false
                console.log(res, 'list')
                this.tableData = []
                if (res && res.length) {
                    res.forEach(item => {
                        let obj = {}
                        obj.id = item.id
                        obj.name = item.name
                        obj.createTime = item.createTime
                        obj.ip = item.ip
                        obj.port = item.port
                        obj.password = item.password
                        obj.path = item.path
                        obj.username = item.username
                        obj.flag = true
                        this.tableData.push(obj)
                    })
                }
            }).catch(err => {
                this.loading = false
                console.log(err + 'err')
            })
        },
        handleClick() {
            if (this.activeName === 'one') {
                this.getEsConfig()
            } else if (this.activeName === 'two') {
                this.getChannelConfig()
            } else if (this.activeName === 'third') {
                this.get_data()
            }
        },
        getEsConfig() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_es_config(data).then(res => {
                console.log(res, '配置参数')
                this.esForm.index = res.esIndex
                this.esForm.topic_id = res.kafkaTopic
            }).catch(err => {
                console.log(err + 'err')
            })
        },
        getChannelConfig() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_channel_config(data).then(res => {
                console.log(res, '通道')
                this.consumeForm.names = []
                if (res && res.length) {
                    res.forEach(item => {
                        let obj = {}
                        obj.id = item.id
                        obj.name = item.name
                        obj.createTime = item.createTime
                        this.consumeForm.names.push(obj)
                    })
                } else {
                    this.consumeForm.names.push({
                        name: '',
                        id: ''
                    })
                }
            }).catch(err => {
                console.log(err + 'err')
            })
        },
        handleEdit(obj) {
            console.log(obj)
            this.editNodeDialog = true
            this.editNodeForm = {
                id: obj.id,
                nodeName: obj.name,
                ip: obj.ip,
                port: obj.port,
                userName: obj.username,
                password: obj.password,
                catalogue: obj.path
            }
        },
        handleDel(obj) {
            this.delDialog = true
            this.deleteId = obj.id
        },
        delConfim() {
            let data = {
                queryData: {},
                paramsData: {
                    ids: [this.deleteId]
                }
            }
            delete_logstash(data).then(res => {
                this.delDialog = false
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(error => {
                this.delDialog = false
                console.log('error', error)
            })
        },
        addResource() {
            this.consumeForm.names.push({
                name: '',
                id: ''
            })
        },
        deleteResource(item, index) {
            if (item.id === '') {
                this.consumeForm.names.splice(index, 1)
                return
            }
            this.channelDialog = true
            this.recordDeleteItem = item
        },
        del_channel(item) {
            let data = {
                queryData: {},
                paramsData: {
                    id: this.recordDeleteItem.id
                }
            }
            delete_channel_config(data).then(res => {
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                this.channelDialog = false
                setTimeout(() => {
                    this.getChannelConfig()
                }, 1000)
            }).catch(error => {
                this.channelDialog = false
                console.log('error', error)
            })
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.timer) {
                        return
                    }
                    this.timer = setTimeout(() => {
                        this.saveEs()
                        this.timer = null
                    }, 1000)
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        submitForm2(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.timer) {
                        return
                    }
                    this.timer = setTimeout(() => {
                        this.saveCs()
                        this.timer = null
                    }, 1000)
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        saveEs() {
            let data = {
                queryData: {},
                paramsData: {
                    esIndex: this.esForm.index,
                    kafkaTopic: this.esForm.topic_id
                }
            }
            save_es_config(data).then(res => {
                this.$message.success('保存成功')
                setTimeout(() => {
                    this.getEsConfig()
                }, 1500)
            }).catch(err => {
                console.log(err)
            })
        },
        saveCs() {
            let data = {
                queryData: {},
                paramsData: {
                    channels: this.consumeForm.names
                }
            }
            save_channel_config(data).then(res => {
                this.$message.success('保存成功')
                setTimeout(() => {
                    this.getChannelConfig()
                }, 1500)
            }).catch(err => {
                console.log(err)
            })
        },
        validAdd(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.addNode()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        validEdit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.editNode()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        addNode() {
            let data = {
                queryData: {},
                paramsData: {
                    ip: this.nodeForm.ip,
                    port: this.nodeForm.port,
                    name: this.nodeForm.nodeName,
                    username: this.nodeForm.userName,
                    password: this.nodeForm.password,
                    path: this.nodeForm.catalogue
                }
            }
            this.addloading = true
            save_logstash(data).then(res => {
                this.$message.success('新增节点成功')
                this.addloading = false
                this.addNodeDialog = false
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(err => {
                this.addloading = false
                // this.addNodeDialog = false
                console.log(err)
            })
        },
        editNode() {
            let data = {
                queryData: {},
                paramsData: {
                    id: this.editNodeForm.id,
                    ip: this.editNodeForm.ip,
                    port: this.editNodeForm.port,
                    name: this.editNodeForm.nodeName,
                    username: this.editNodeForm.userName,
                    password: this.editNodeForm.password,
                    path: this.editNodeForm.catalogue
                }
            }
            this.addloading = true
            updateLogstashNodes(data).then(res => {
                this.$message.success('编辑节点成功')
                this.editNodeDialog = false
                this.addloading = false
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(err => {
                this.addloading = false
                // this.editNodeDialog = false
                console.log(err)
            })
        },
        saveFun() {
            let data = {}
            switch (this.activeName) {
                case 'first':

                    break
                case 'second':

                    break
                case 'third':

                    break
                case 'four':

                    break
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.drag-dialog__body  ::v-deep  .el-switch__label.is-active {
    color: #78ddff;
}
.bg-config {
    // background-color: #111D2B;
    // background-image: url("/static/img/content_bg.png");
    // background-repeat: no-repeat;
    // background-position-x: right;
    // background-position-y: 180px;

}
.tab-wrapper ::v-deep .el-tabs__item.is-active {
    color: #387dee;
    opacity: 1;
    height: 34px;
    line-height: 34px;
    box-shadow: none !important;
    border: none !important;
}
.el-tabs ::v-deep .el-tabs__nav-wrap::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1px;
    // background-color: rgba(28, 215, 250, 0.2);
    z-index: 1;
}
.el-tabs ::v-deep .el-tabs__active-bar {
    background: #387dee;
    //margin-left: 14px;
}
.el-tabs ::v-deep .el-tabs__item {
    color: #ffffff;
    opacity: .5;
}

.event  ::v-deep .el-radio__input.is-checked+.el-radio__label {
    color: #1bd7fa;
}
.event  ::v-deep .el-radio__input.is-checked .el-radio__inner::after {
    background: #1bd7fa;
}
.event  ::v-deep .el-radio__inner {
    border: 1px solid #1bd7fa;
    background-color: rgba(0,0,0,0);
}
.event ::v-deep  .el-input-group__append button.el-button{
    border-color: transparent !important;
    background-color: transparent !important;
    color: inherit;
    border-top: 0;
    border-bottom: 0;
}
.event ::v-deep  .el-input-group__append, .event ::v-deep  .el-input-group__prepend {
    background-color: transparent;
    // color: #1cd7fa;
    // border-color: #1cd7fa;
    padding: 0 15px;
    // box-shadow: 0px 0px 7px #389bf7 inset;
}
.custom-star {
    .event ::v-deep .el-tabs__header {
        .el-tabs__active-bar {
            background-color: #1cd7fa;
        }
        .el-tabs__item {
            color: #fff;
        }
        .is-active {
            color: #1cd7fa;
        }
    }
    .drag-dialog__body  ::v-deep  .el-switch__label.is-active {
        color: #78ddff;
    }
    .bg-config {
        // background-color: #111D2B;
        // background-image: url("/static/img/content_bg.png");
        // background-repeat: no-repeat;
        // background-position-x: right;
        // background-position-y: 180px;

    }
    .tab-wrapper ::v-deep .el-tabs__item.is-active {
        color: #1cd7fa;
        opacity: 1;
        height: 34px;
        line-height: 34px;
        box-shadow: none !important;
        border: none !important;
    }
    .el-tabs ::v-deep .el-tabs__nav-wrap::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 1px;
        // background-color: rgba(28, 215, 250, 0.2);
        z-index: 1;
    }
    .el-tabs ::v-deep .el-tabs__active-bar {
        background: #387dee;
        //margin-left: 14px;
    }
    .el-tabs ::v-deep .el-tabs__item {
        color: #ffffff;
        opacity: .5;
    }

    .event  ::v-deep .el-radio__input.is-checked+.el-radio__label {
        color: #1bd7fa;
    }
    .event  ::v-deep .el-radio__input.is-checked .el-radio__inner::after {
        background: #1bd7fa;
    }
    .event  ::v-deep .el-radio__inner {
        border: 1px solid #1bd7fa;
        background-color: rgba(0,0,0,0);
    }
    .event ::v-deep  .el-input-group__append button.el-button{
        border-color: transparent !important;
        background-color: transparent !important;
        color: inherit;
        border-top: 0;
        border-bottom: 0;
    }
    .event ::v-deep  .el-input-group__append, .event ::v-deep  .el-input-group__prepend {
        background-color: transparent;
        // color: #1cd7fa;
        // border-color: #1cd7fa;
        padding: 0 15px;
        // box-shadow: 0px 0px 7px #389bf7 inset;
    }
}
</style>

