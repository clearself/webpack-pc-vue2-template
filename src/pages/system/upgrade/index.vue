<template>
    <div class="event upgrade">
        <div class="w100">
            <SearchTop @search="searchCheck" @reset="reset">
                <el-col :md="12" :lg="8" :xl="6">
                    <el-form :model="get_params">
                        <el-form-item label="部署方式：" label-width="60px">
                            <el-select clearable size="small" v-model="get_params.mode" filterable placeholder="请选择" style="width:100%">
                                <el-option v-for="(item,index) in modes" :key="index" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :md="12" :lg="8" :xl="6">
                    <el-form :model="get_params">
                        <el-form-item label="模块名称：" label-width="85px">
                            <el-select clearable size="small" v-model="get_params.modular" filterable placeholder="请选择" style="width:100%">
                                <el-option v-for="(item,index) in modulars" :key="index" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </el-col>
            </SearchTop>
            <div class="list-container">
                <div class="ub ub-pj w100 mb-1">
                    <div class="list-tips">升级管理</div>
                    <div>
                        <el-button v-per="['base_upgrade_add']" size="small" icon="el-icon-plus" type="primary" @click="handleAddTemplate">新建</el-button>
                    </div>
                </div>
                <div class="w100 table-wap">
                    <div v-if="videoFlag == true" class="mask">
                        <div class="ub ub-ver ub-ac ub-pc">
                            <div>升级中请稍等!</div>
                            <el-progress type="circle" :percentage="videoUploadPercent"></el-progress>
                        </div>
                    </div>
                    <div v-if="optionFlag" class="mask">
                        <div class="ub ub-ver ub-ac ub-pc">
                            <div>{{optionTitle}}</div>
                            <div class="loading-icon">
                                <i class="el-icon-loading"></i>
                            </div>
                        </div>
                    </div>
                    <el-table
                        :height="tableHeight"
                        :row-class-name="tableRowClassName"
                        ref="multipleTable"
                        v-loading="loading"
                        class="bigTable"
                        :data="tableData"
                        border
                        stripe
                        tooltip-effect="dark"
                        :row-style="{ height: '32px' }"
                        :header-row-style="{ height: '32px' }"
                    >
                        <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                        </el-table-column>
                        <el-table-column prop="upType" label="部署方式" width="300" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <div>{{scope.row.upType===1?'tomcat':''}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="moduleName" label="模块名称" show-overflow-tooltip> </el-table-column>
                        <el-table-column label="地址/账号" width="300" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <div>
                                    <div v-if="scope.row.list&&scope.row.list.length>0">
                                        <div v-for="(item,index) in scope.row.list" :key="index" class="ub ub-ac w100 ub-pj">
                                            <div>{{item.ip}}/{{item.port}}/{{item.account}}/{{item.password}}</div>
                                            <div v-if="item.health" class="ub ub-ac user-state one">
                                                <div></div>
                                            </div>
                                            <div v-else class="ub ub-ac user-state two">
                                                <div></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-else></div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="catalog" label="基础目录" show-overflow-tooltip> </el-table-column>

                        <el-table-column
                            label="操作"
                            align="center"
                            width="210"
                            fixed="right"
                            class-name="deepBg"
                        >
                            <template slot-scope="scope">
                                <el-upload
                                    :headers="header"
                                    style="display:inline"
                                    :action="'/api/base_info/manage/upModule/upgrade?id='+scope.row.id"
                                    :show-file-list="false"
                                    accept=".war"
                                    :on-success="handleAvatarSuccess1"
                                    :before-upload="beforeAvatarUpload1"
                                    :on-error="handleAvatarError"
                                    :on-progress="uploadVideoProcess"
                                    name="file"
                                >
                                    <el-button v-per="['base_upgrade_up']" type="text" size="small" style="margin-right:6px">升级</el-button>
                                </el-upload>
                                <el-button v-per="['base_upgrade_log']" type="text" size="small" @click="handelSee(1,scope.row)">查看/下载日志</el-button>
                                <el-button v-per="['base_upgrade_reboot']" type="text" size="small" @click="handelSee(2,scope.row)">重启</el-button>

                                <el-dropdown trigger="click">
                                    <span style="color: #409EFF;font-size: 12px;margin-left: 6px;margin-right: 6px;cursor: pointer;">
                                        更多
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item>
                                            <el-button v-per="['base_upgrade_run']" type="text" size="small" @click="handelSee(3,scope.row)">启动</el-button>
                                        </el-dropdown-item>
                                        <el-dropdown-item>
                                            <el-button v-per="['base_upgrade_stop']" :disabled="scope.row.moduleKey=='basic_info'" type="text" size="small" @click="handelSee(4,scope.row)">停止</el-button>
                                        </el-dropdown-item>
                                        <el-dropdown-item>
                                            <el-button v-per="['base_upgrade_rolledback']" type="text" size="small"  @click="handelBack(scope.row)">回滚</el-button>
                                        </el-dropdown-item>
                                        <el-dropdown-item>
                                            <el-button v-per="['base_upgrade_edit']"  type="text" size="small"  @click="handleEdit(scope.row)">编辑</el-button>
                                        </el-dropdown-item>
                                        <el-dropdown-item>
                                            <el-button v-per="['base_upgrade_del']" type="text" size="small"  @click="handleDel(scope.row)">删除</el-button>
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </template>
                        </el-table-column>
                    </el-table>
                    <pagination v-show="total_num>0" :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size" @pagination="get_data" />
                </div>

            </div>
        </div>
        <!--添加任务-->
        <add-upgrade ref="addUpgrade" :status="isEdit" :modes="modes" :modulars="modulars" @submitForm="submitForm"></add-upgrade>
        <el-dialog title="日志列表" :visible.sync="pcacDialog" :fullscreen="true" custom-class="common-dialog export-dialog">
            <div class="w100 pcap-detail" style="height:100%;">
                <el-tabs v-model="tabsValue" type="card" style="height:100%;">
                    <el-tab-pane
                        :key="index"
                        v-for="(item, index) in pacpData"
                        :label="item.name"
                        :name="item.name"
                        style="height:100%;"
                    >
                        <div v-if="item.files.length>0" class="w100">
                            <el-table
                                class="bigTable"
                                :data="item.files"
                                border
                                stripe
                                tooltip-effect="dark"
                            >
                                <el-table-column prop="name" label="文件名称" >
                                </el-table-column>
                                <el-table-column prop="size" label="文件大小" >
                                </el-table-column>
                                <el-table-column
                                    label="操作"
                                    align="center"
                                    width="80"
                                    fixed="right"
                                    class-name="deepBg"
                                >
                                    <template slot-scope="scope">
                                        <el-button type="text" size="small" @click="seeLogs(item.id,scope.row)">查看</el-button>
                                        <el-button type="text" size="small" @click="handleDown(scope.row)">下载</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-tab-pane>
                </el-tabs>

            </div>
        </el-dialog>
        <el-dialog title="日志详情" :visible.sync="logsDialog" :fullscreen="true" custom-class="common-dialog export-dialog logs-dialog">
            <div ref="objContainer" class="w100 pcap-detail log-detail">
                <div v-if="logsDetail!==''">
                    <pre>{{logsDetail}}</pre>
                </div>
            </div>
        </el-dialog>
        <el-dialog :title="optTitle" :visible.sync="detalDialog" width="700px" custom-class="common-dialog">
            <div>
                <el-table
                    ref="multipleTableDetail"
                    class="bigTable"
                    :data="tableDataDetail"
                    border
                    stripe
                    tooltip-effect="dark"
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column align="center" type="selection" width="50">
                    </el-table-column>
                    <el-table-column label="地址/账号" >
                        <template slot-scope="{row}">
                            <div>
                                <div>{{row.ip}}/{{row.port}}/{{row.account}}/{{row.password}}</div>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="detalDialog = false">取 消</el-button>
                <el-button size="small" type="primary" @click="handleSeeFun">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="历史版本" :visible.sync="backDialog" width="700px" custom-class="common-dialog">
            <div>
                <el-table
                    ref="multipleTableBack"
                    class="bigTable"
                    :data="tableDataDetailBack"
                    border
                    stripe
                    tooltip-effect="dark"
                >
                    <el-table-column align="center" type="index" width="50" label="序号">
                    </el-table-column>
                    <el-table-column label="版本号" >
                        <template slot-scope="{row}">
                            <div>
                                <div>{{row.name}}</div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        align="center"
                        width="80"
                        fixed="right"
                        class-name="deepBg"
                    >
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="showBack(scope.row)">确定回滚</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-dialog>
        <!--删除-->
        <DeleteDialog
            :dialogVisible = deleteDialog
            @delete="handleDeleteFun"
            @cancel="deleteDialog = false">
        </DeleteDialog>
        <el-dialog title="回退版本" :visible.sync="versonDialog" width="30%" custom-class="attendance-dialog">
            <span>确定回退到 {{verson}} 版本吗？</span>
            <span slot="footer" class="dialog-footer">
                <i v-if="isBack" class="el-icon-loading"></i>
                <el-button size="small" @click="versonDialog = false">取 消</el-button>
                <el-button size="small" type="primary" @click="handleVerson">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { get_modulars, get_upgrade_list, delete_upgrade, get_logs, startServe, get_back_versons, sure_back_versons, get_logs_detail, downloadLog } from '@/server/system/upgrade.js'

import AddUpgrade from './add_upgrade'

export default {
    name: 'Upgrade',
    mixins: [],
    components: { AddUpgrade },
    props: {
        type: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            tableHeight: document.body.clientHeight - 270,
            dialog: { // dialog显示隐藏
                dialogVisible: false,
                dialogDrag: true, // 可拖拽
                dialogChange: true, // 可拉伸
                title: '详情'
            },
            timer: null,
            configId: '',
            logsDialog: false,
            logsDetail: '',
            isBack: false,
            verson: '',
            versonDialog: false,
            backDialog: false,
            tableDataDetailBack: [],
            optionFlag: false,
            optionTitle: '',
            videoFlag: false,
            videoUploadPercent: 0,
            loading_status: false,
            loading_text: '',
            file: '',
            optTitle: '',
            detalDialog: false,
            optType: '',
            isEdit: false,
            modes: [
                {
                    label: 'tomcat',
                    value: 1
                }
            ],
            modulars: [
                {
                    label: '模块1',
                    value: 1
                }, {
                    label: '模块2',
                    value: 2
                }, {
                    label: '模块3',
                    value: 3
                }
            ],
            deleteDialog: false,
            deleteId: '',
            formLabelWidth: '120px',
            loading: false,
            multipleSelection: [],
            tableData: [],
            tableDataDetail: [],
            total_num: 0,
            get_params: {
                page: 1,
                size: 20,
                modular: '',
                mode: ''
            },
            tabsValue: '',
            pcacDialog: false,
            pacpData: []
        }
    },
    watch: {
        pcacDialog(newVal, oldVal) {
            if (!newVal) {
                this.tabsValue = ''
                this.pacpData = []
            }
        },
        detalDialog(newVal, oldVal) {
            if (!newVal) {
                this.tableDataDetail = []
                this.multipleSelection = []
            }
        },
        logsDialog(newVal, oldVal) {
            if (!newVal) {
                if (this.timer) {
                    clearTimeout(this.timer)
                    this.configId = ''
                    this.logsDetail = ''
                    this.timer = null
                }
            } else {
                var that = this
                var isFirefox = navigator.userAgent.indexOf('Firefox') > -1 // 判断是否Firefox浏览器;
                var addEvent = (function() {
                    if (window.addEventListener) {
                        return function(el, sType, fn, capture) {
                            el.addEventListener(sType, fn, (capture))
                        }
                    } else if (window.attachEvent) {
                        return function(el, sType, fn, capture) {
                            el.attachEvent('on' + sType, fn)
                        }
                    } else {
                        return function() {}
                    }
                })()
                var stopEvent = function(event) {
                    if (event.stopPropagation) {
                        event.stopPropagation()
                    } else {
                        event.cancelBubble = true
                    }
                    if (event.preventDefault) {
                        event.preventDefault()
                    } else {
                        event.returnValue = false
                    }
                }
                // isFirefox 是伪代码，大家可以自行实现
                var mousewheel = isFirefox ? 'DOMMouseScroll' : 'mousewheel'
                // object 是伪代码，你需要注册 Mousewheel 事件的元素
                this.$nextTick(() => {
                    addEvent(that.$refs.objContainer, mousewheel, function(event) {
                        var e = event || window.event
                        stopEvent(e)
                        if (e.wheelDelta) { // 判断浏览器IE，谷歌滑轮事件
                            console.log(e.wheelDelta)
                            if (e.wheelDelta > 0) { // 当滑轮向上滚动时
                                // 事件
                                that.$refs.objContainer.scrollTop = that.$refs.objContainer.scrollTop + 120
                            }
                            if (e.wheelDelta < 0) { // 当滑轮向下滚动时
                                // 事件
                                that.$refs.objContainer.scrollTop = that.$refs.objContainer.scrollTop - 120
                            }
                        } else if (e.detail) { // Firefox滑轮事件
                            console.log('e.detail', e.detail)
                            if (e.detail > 0) { // 当滑轮向上滚动时
                                // 事件
                                that.$refs.objContainer.scrollTop = that.$refs.objContainer.scrollTop - 120
                            }
                            if (e.detail < 0) { // 当滑轮向下滚动时
                                // 事件
                                that.$refs.objContainer.scrollTop = that.$refs.objContainer.scrollTop + 120
                            }
                        }
                    }, false)
                })
            }
        }

    },
    beforeDestroy() {
        if (this.timer) {
            clearTimeout(this.timer)
            this.timer = null
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.initModulars()
            this.get_data()
        })
    },
    computed: {
        header() {
            return { token: this.$getlocalStorage('initInfo').user.token }
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
        handleDown(val) {
            let data = {
                queryData: {
                    id: val.id,
                    name: val.name
                },
                paramsData: {}
            }
            downloadLog(data)
                .then(res => {
                    console.log(res)
                })
                .catch(error => {
                    console.log(error + 'error')
                })
        },
        reset() {
            this.get_params.modular = ''
            this.get_params.mode = ''
        },
        seeLogs(id, row) {
            this.deleteId = id
            this.logsDialog = true
            this.logsName = row.name
            this.get_logs_detail()
        },
        get_logs_detail() {
            let uid = this.configId = new Date().getTime()
            let data = {
                queryData: {},
                paramsData: {
                    id: this.deleteId,
                    name: this.logsName
                }
            }
            get_logs_detail(data)
                .then(res => {
                    if (uid === this.configId) {
                        this.logsDetail = res
                        this.timer = setTimeout(this.get_logs_detail, 5000)
                    }
                })
                .catch(error => {
                    console.log(error + 'error')
                })
        },
        showBack(row) {
            this.verson = row.name
            this.versonDialog = true
        },
        handleVerson() {
            if (this.isBack) {
                return
            }
            let data = {
                queryData: {},
                paramsData: {
                    id: this.deleteId,
                    version: this.verson
                }
            }
            this.isBack = true
            sure_back_versons(data)
                .then(res => {
                    this.$message({
                        message: '版本回退成功',
                        type: 'success'
                    })
                    this.isBack = false
                    this.backDialog = false
                    this.versonDialog = false
                    this.verson = ''
                    setTimeout(() => {
                        this.get_data()
                    }, 1500)
                })
                .catch(error => {
                    this.isBack = false
                    this.versonDialog = false
                    console.log(error + 'error')
                })
        },
        handelBack(row) {
            this.deleteId = row.id
            this.backDialog = true
            this.getBackVersons()
        },

        getBackVersons() {
            this.tableDataDetailBack = []
            let data = {
                queryData: {},
                paramsData: {
                    id: this.deleteId
                }
            }
            get_back_versons(data)
                .then(res => {
                    if (res.length > 0) {
                        this.tableDataDetailBack = res.map(item => {
                            let obj = {
                                name: item
                            }
                            return obj
                        })
                    }
                })
                .catch(error => {
                    console.log(error + 'error')
                })
        },
        uploadVideoProcess(event, file, fileList) {
            this.videoFlag = true
            this.videoUploadPercent = parseInt(file.percentage)
        },
        handleAvatarError() {
            this.$message.error('升级失败')
            setTimeout(() => {
                this.loading_status = false
            }, 500)
        },
        handleAvatarSuccess1(res, file) {
            this.$message({
                message: '升级成功',
                type: 'success'
            })
            this.videoFlag = false
            this.videoUploadPercent = 0
            setTimeout(() => {
                this.loading_status = false
            }, 500)
            setTimeout(() => {
                this.get_data()
            }, 1500)
        },

        beforeAvatarUpload1(file) {
            if (!(file.name.substring(file.name.length - 3, file.name.length) === 'war')) {
                this.$message.error('上传文件格式只能是.war格式!')
                this.loading_status = false
                this.loading_text = ''
                return false
            }
            this.loading_status = true
            return true
        },

        handleDel(row) {
            this.deleteId = row.id
            this.deleteDialog = true
        },
        handleDeleteFun() {
            this.delFun()
        },
        handelSee(type, row) {
            if (type === 2) {
                this.optTitle = '重启'
            } else if (type === 1) {
                this.optTitle = '查看 /下载日志'
            } else if (type === 3) {
                this.optTitle = '启动'
            } else if (type === 4) {
                this.optTitle = '停止'
            }
            this.optType = type
            if (row.list && row.list.length > 0) {
                this.tableDataDetail = row.list.map(item => {
                    return item
                })
                this.$nextTick(() => {
                    this.$refs.multipleTableDetail.toggleAllSelection() // 全选
                })
            }
            this.detalDialog = true
        },
        handleSeeFun() {
            if (this.optType === 1) {
                this.logs()
            } else {
                this.startServe()
            }
            this.detalDialog = false
        },
        startServe() {
            let ids = this.multipleSelection.map(item => {
                return item.id
            })
            let cmd = ''
            if (this.optType === 2) {
                cmd = 'restart'
                this.optionTitle = '重启中请稍等!'
            } else if (this.optType === 3) {
                cmd = 'start'
                this.optionTitle = '启动中请稍等!'
            } else if (this.optType === 4) {
                cmd = 'stop'
                this.optionTitle = '停止中请稍等!'
            }
            let data = {
                queryData: {},
                paramsData: {
                    ids: ids,
                    cmd: cmd
                }
            }
            this.optionFlag = true
            startServe(data).then(res => {
                if (this.optType === 2) {
                    this.optionTitle = '重启成功!'
                } else if (this.optType === 3) {
                    this.optionTitle = '启动成功!'
                } else if (this.optType === 4) {
                    this.optionTitle = '停止成功!'
                }
                setTimeout(() => {
                    this.optionFlag = false
                    this.get_data()
                }, 1500)
            }).catch(error => {
                this.optionFlag = false
                console.log('error' + error)
            })
        },
        initModulars() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_modulars(data).then(res => {
                if (res.length > 0) {
                    this.modulars = res.map(item => {
                        let obj = {}
                        obj.label = item.name
                        obj.value = item.value
                        return obj
                    })
                }
            }).catch(error => {
                console.log('error' + error)
            })
        },
        logs() {
            let ids = this.multipleSelection.map(item => {
                return item.id
            })
            this.pcacDialog = true
            let data = {
                queryData: {},
                paramsData: {
                    ids: ids
                }
            }
            get_logs(data).then(res => {
                console.log('pcac包', res)
                if (res.length > 0) {
                    this.tabsValue = res[0].name
                    this.pacpData = res.map(item => {
                        return item
                    })
                }
            }).catch(error => {
                console.log('error' + error)
            })
        },
        handleSee() {
            this.$refs.detail.detailDialog = true
            this.$refs.detail.init()
        },
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        handleAddTemplate() {
            this.isEdit = false
            this.$refs.addUpgrade.addDialog = true
        },
        handleEdit(row) {
            this.isEdit = true
            this.$refs.addUpgrade.optId = row.id
            this.$refs.addUpgrade.addForm.moduleName = row.moduleName
            this.$refs.addUpgrade.addForm.moduleKey = row.moduleKey
            this.$refs.addUpgrade.addForm.upType = row.upType
            this.$refs.addUpgrade.addForm.catalog = row.catalog
            if (row.list && row.list.length > 0) {
                this.$refs.addUpgrade.addForm.list = row.list.map(item => {
                    let obj = {}
                    obj.ip = item.ip
                    obj.port = item.port
                    obj.account = item.account
                    obj.password = item.password
                    return obj
                })
            } else {
                this.$refs.addUpgrade.addForm.list = []
            }
            this.$refs.addUpgrade.addDialog = true
        },
        searchCheck() {
            this.get_params.page = 1
            this.get_data()
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
                    moduleName: this.get_params.modular,
                    upType: this.get_params.mode
                }
            }
            get_upgrade_list(data)
                .then(res => {
                    this.loading = false
                    this.total_num = res.total
                    this.tableData = res.records
                })
                .catch(error => {
                    this.loading = false
                    console.log('error' + error)
                })
        },

        delFun() {
            let data = {
                queryData: {},
                paramsData: {
                    id: this.deleteId
                }
            }
            delete_upgrade(data)
                .then(res => {
                    this.deleteDialog = false
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    })
                    setTimeout(() => {
                        this.get_data()
                    }, 1500)
                })
                .catch(error => {
                    this.deleteDialog = false
                    console.log(error + 'error')
                })
        },
        submitForm() {
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
        handleSelectionChange(val) {
            console.log(val)
            this.multipleSelection = val
        }
    }
}
</script>

<style lang="scss" scoped>
// @import '../../assets/css/pacap.scss';
.reset-btn {
    width: 80px;
    height: 30px;
    background-color: #041f38;
    box-shadow: inset 0px 0px 10px 0px rgba(0, 167, 245, 0.97);
    border: solid 1px #39caf3;
    font-size: 12px;
    line-height: 15px;
    letter-spacing: 1px;
    color: #a2ceec;
    border-radius: 5px;
    margin-right: 10px;
    cursor: pointer;
    box-sizing: border-box;
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
        right: 20px;
        top: 0;
        padding: 0;
        color: #1cd7fa;
    }
}
.domain-list {
    background: rgba(0, 0, 0, 0.3);
    margin: 3px 0 20px;
    padding: 20px 0 1px;

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
    background-color: rgba(0, 0, 0, 0);
    color: #fff;
}
.event  ::v-deep  .el-range-separator {
    color: #fff;
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
.attendance-list.table-area {
    min-height: 717px !important;
}
.event  ::v-deep  .edui-editor-iframeholder {
    height: 200px !important;
}
.event  ::v-deep  .drawer-content {
    .box-title {
        color: #00e9ff;
        font-size: 14px;
        margin: 30px 0 20px;
    }
    .label {
        width: 60px;
        font-size: 12px;
        color: #999;
        text-align: right;
        margin-right: 15px;
    }
    .label-val {
        font-size: 12px;
        color: #fff;
        img {
            max-width: 300px;
        }
    }
}
.event  ::v-deep  .condition-box {
    .part-condition {
        margin-bottom: 10px;
    }
    .condition_black {
        font-size: 12px;
        color: #999;
        margin-right: 6px;
    }
    .condition_white {
        font-size: 12px;
        color: #fff;
        margin-right: 6px;
    }
}
.event  ::v-deep  .warn-wrapper {
    width: 640px;
    padding-left: 10px;
    box-sizing: border-box;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 2px;

    & p {
        font-size: 12px;
        margin: 5px 0;

        &.warn-top {
            color: #fff;
            opacity: 0.6;
        }
        &.warn-body {
            color: #fff;
            word-break: break-all;
        }
    }
}
.event  ::v-deep  .pic-wrapper {
    height: calc(100vh - 190px);
    width: 99%;
    overflow: auto;
    border: 1px solid #1cd7fa;
}
.users  ::v-deep  .el-form-item__label:before {
    content: "*";
    color: #f56c6c;
    margin-right: 4px;
}
.upgrade ::v-deep .el-tabs__item.is-active {
    color: #00e9ff;
}

.user-state > div:nth-child(1) {
    width: 10px;
    height: 10px;
    border-radius: 10px;
}
.user-state.one > div:nth-child(1) {
    background-color: #70B603;
    -webkit-box-shadow: 0px 0px 7px #70B603;
}
.user-state.two > div:nth-child(1) {
    background-color: rgb(217, 0, 27);
    -webkit-box-shadow: 0px 0px 7px rgb(217, 0, 27);
}
.white-theme .user-state > div:nth-child(1){
    -webkit-box-shadow:none !important;
}
.table-wap{
    position: relative;
    >div.mask{
         position: absolute;
            left:0;
            top:0;
            bottom:0;
            right:0;
            z-index: 99999;
            background-color: rgba(0,0,0,.8);
            >div{
                width:150px;
                position: absolute;
                left:50%;
                top:15%;
                transform: translate(-50%,50%);
                >div:nth-child(1){
                    color:#1cd7fa;
                    font-size:22px;
                    text-align: center;
                    line-height: 26px;
                    margin-bottom:20px;
                }
                 ::v-deep .el-progress .el-progress__text{
                    color:#1cd7fa;
                }
                .loading-icon{
                    i{
                        font-size:22px;
                         color:#1cd7fa;
                    }
                }
            }
        }
}

.white-theme .table-wap{
    position: relative;
    >div.mask{
            >div{
                >div:nth-child(1){
                    color:#3aa6e4;
                }
                 ::v-deep .el-progress .el-progress__text{
                    color:#3aa6e4;
                }
                .loading-icon{
                    i{
                        font-size:22px;
                        color:#606266;
                    }
                }
            }
        }
}
.dialog-footer{
    >i{
        font-size:18px;
        color:#1cd7fa;
        margin-right:10px;
    }
}
.white-theme .dialog-footer{
    >i{
        font-size:18px;
        color:#606266;
    }
}
.log-detail{
    height: calc(100vh - 100px);
    overflow: auto;
    transform: rotate(180deg);
    -webkit-transform: rotate(180deg);
    direction: rtl;
}
.log-detail>div{
    transform: rotate(180deg);
    -webkit-transform: rotate(180deg);
    direction: ltr;
}

.upgrade ::v-deep .el-dialog.logs-dialog.is-fullscreen{
    overflow: hidden!important;
}
</style>
<style>
    .log-detail::-webkit-scrollbar {
        height: 0px!important;
    }
    .white-theme .log-detail::-webkit-scrollbar {
        height: 0px!important;
    }
</style>
