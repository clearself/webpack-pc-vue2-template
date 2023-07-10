<template>
    <div class="list">
        <SearchTop @search="searchAssets" @reset="reset">
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params">
                    <el-form-item label="IP搜索：" label-width="70px">
                        <el-input
                            placeholder="请输入IP"
                            clearable
                            v-model="get_params.ip"
                            @keyup.enter.native="searchAssets"
                            size="small"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params">
                    <el-form-item label="端口：" label-width="70px">
                        <el-input
                            placeholder="请输入端口"
                            clearable
                            v-model="get_params.port"
                            @keyup.enter.native="searchAssets"
                            size="small"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
        </SearchTop>
        <div class="list-container">
            <div class="ub ub-pj w100 mb-1 ub-ac">
                <div class="list-tips" style="margin-top: 4px">资产发现</div>
                <div></div>
            </div>
            <el-table
                ref="multipleTable"
                v-loading="loading"
                class='bigTable'
                :data="tableData"
                :row-class-name="tableRowClassName"
                border
                stripe
                tooltip-effect="dark"
                @selection-change="handleSelectionChange"
                :height="tabHeight"
                :row-style="{ height: '32px' }"
                :header-row-style="{ height: '32px' }">
                <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                </el-table-column>
                <el-table-column prop="ip" label="IP">
                </el-table-column>
                <el-table-column prop="port" label="端口">
                </el-table-column>
                <el-table-column prop="mac" label="MAC">
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间">
                </el-table-column>
                <el-table-column align="center" label="操作" width="80">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="handleAdd(scope.row)" v-per="['assets_assetsFind_add']">登记</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size" @pagination="get_data" class="paginat" v-show="total_num>0"/>
        </div>
        <!--增加内容开始-->
        <el-dialog title="添加资产" :visible.sync="addDomainDialog" width="700px" custom-class="common-dialog">
            <el-form :model="deviceForm" :rules="rules" ref="deviceForm" :inline="true" class="unit" label-position="top">
                <div class="ub ub-pj">
                    <el-form-item label="资产名称：" prop="deviceName" :label-width="formLabelWidth">
                        <el-input @focus="onFocus" size="small" v-model="deviceForm.deviceName" placeholder="请输入资产名称" autocomplete="off" style="width:300px"></el-input>
                    </el-form-item>
                    <el-form-item label="资产标识：" prop="uniqueCode" :label-width="formLabelWidth">
                        <el-input @focus="onFocus" size="small" v-model="deviceForm.uniqueCode" placeholder="请输入资产标识" autocomplete="off" style="width:300px"></el-input>
                    </el-form-item>
                </div>
                <div class="ub ub-pj">
                    <el-form-item label="业务系统：" :label-width="formLabelWidth">
                        <el-select v-model="deviceForm.systemId" size="small" placeholder="请选择业务系统" style="width:300px">
                            <el-option v-for="(item,index) in systems" :key="index" :label="item.system_name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所属安全域：" :label-width="formLabelWidth">
                        <el-select @focus="onFocus" size="small" v-model="deviceForm.zoneId" clearable placeholder="请选择" style="width:300px">
                            <el-option v-for="(item,index) in zoneIds" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="ub ub-pj">
                    <el-form-item label="设备类型：" prop="deviceTypeId" :label-width="formLabelWidth">
                        <el-select @focus="onFocus" size="small" v-model="deviceForm.deviceTypeId" clearable placeholder="请选择" style="width:300px">
                            <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="厂商：" :label-width="formLabelWidth">
                        <el-select @focus="onFocus" size="small" v-model="deviceForm.manufacturerId" clearable placeholder="请选择" style="width:300px">
                            <el-option v-for="item in storeOp" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="ub ub-pj">
                    <el-form-item label="型号：" :label-width="formLabelWidth">
                        <el-input @focus="onFocus" size="small" v-model="deviceForm.modelInfo" placeholder="请输入型号" autocomplete="off" style="width:300px"></el-input>
                    </el-form-item>
                    <el-form-item label="操作系统：" :label-width="formLabelWidth">
                        <el-input @focus="onFocus" size="small" v-model="deviceForm.pcSystem" placeholder="请输入系统" autocomplete="off" style="width:300px"></el-input>
                    </el-form-item>
                </div>
                <div class="ub ub-pj">
                    <el-form-item label="系统版本：" :label-width="formLabelWidth">
                        <el-input @focus="onFocus" size="small" v-model="deviceForm.pcSystemVersion" placeholder="请输入系统" autocomplete="off" style="width:300px"></el-input>
                    </el-form-item>
                </div>
                <div class="domain-add">
                    <span class="domain-title">添加IP：</span>
                    <el-button size="mini" icon="el-icon-plus" type="text" @click="addIp('add')">添加</el-button>
                </div>
                <div class="domain-list">
                    <el-table
                        :data="deviceForm.ips"
                        class='bigTable'
                        border
                        stripe
                        tooltip-effect="dark"
                        style="width: 100%"
                        :row-style="{ height: '32px' }"
                        :header-row-style="{ height: '32px' }">
                        <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
                        <el-table-column label="IP">
                            <template slot="header">
                                <div>IP <i style="color: #F56C6C;">*</i></div>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item :prop="'ips.'+scope.$index+'.ip'" class="mb0" :rules="rules.ip">
                                    <el-input v-model="scope.row.ip" placeholder="请输入IP"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="端口">
                            <template slot="header">
                                <el-tooltip class="item" effect="dark" content="可批量输入，用','分隔" placement="top">
                                    <div>端口 <i class="el-icon-question" style="color: #0052d9"></i></div>
                                </el-tooltip>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item :prop="'ips.'+scope.$index+'.port'" class="mb0">
                                    <el-input v-model="scope.row.port" placeholder="请输入端口"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="MAC">
                            <template slot-scope="scope">
                                <el-form-item :prop="'ips.'+scope.$index+'.mac'" class="mb0">
                                    <el-input v-model="scope.row.mac" placeholder="请输入MAC"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="子网掩码">
                            <template slot-scope="scope">
                                <el-form-item :prop="'ips.'+scope.$index+'.mask'" class="mb0">
                                    <el-input v-model="scope.row.mask" placeholder="请输入子网掩码"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="网关">
                            <template slot-scope="scope">
                                <el-form-item :prop="'ips.'+scope.$index+'.gateway'" class="mb0">
                                    <el-input v-model="scope.row.gateway" placeholder="请输入网关"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="50" align="center">
                            <template slot-scope="scope">
                                <el-button size="mini" icon="el-icon-remove-outline" class="del-btn" type="text" @click="deleteIp('add',scope.$index)" style="font-size: 16px;color: #F56C6C;"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="w100" v-if="existIp!=''" style="line-height:20px;vertical-align: top;word-wrap:break-word;word-break:break-all;white-space:normal;color:red;">
                    {{existIp}} 已存在
                </div>
                <div class="domain-add">
                    <span class="domain-title">添加组件：</span>
                    <el-button size="mini" type="text" icon="el-icon-plus" @click="addApplication('add')">添加</el-button>
                </div>
                <div class="domain-list">
                    <el-table
                        :data="deviceForm.applications"
                        class='bigTable'
                        border
                        stripe
                        tooltip-effect="dark"
                        style="width: 100%"
                        :row-style="{ height: '32px' }"
                        :header-row-style="{ height: '32px' }">
                        <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
                        <el-table-column prop="name" label="组件名称">
                            <template slot-scope="scope">
                                <el-form-item :prop="'applications.'+scope.$index+'.name'" class="mb0">
                                    <el-input v-model="scope.row.name" placeholder="请输入组件名称"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="softwareVersion" label="版本">
                            <template slot-scope="scope">
                                <el-form-item :prop="'applications.'+scope.$index+'.softwareVersion'" class="mb0">
                                    <el-input v-model="scope.row.softwareVersion" placeholder="请输入版本"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="address" label="操作" width="50" align="center">
                            <template slot-scope="scope">
                                <el-button size="mini" icon="el-icon-remove-outline" class="del-btn" type="text" @click="deleteApplication('add',scope.$index)" style="font-size: 16px;color: #F56C6C;"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDomainDialog = false" size="small">取消</el-button>
                <el-button @click="submitForm('deviceForm')" size="small" type="primary">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {
    assetsFindList,
    assetsFindAdd,

    getAllManufacturer,
    checkIP,
    get_types,
    getSystemType,
    getScanLeakByIp,
    get_all_zoneIds,
    get_threatData,
    edit_assets
} from '../../server/assets/api.js'
import {
    Loading
} from 'element-ui'
export default {
    name: 'User',
    data() {
        return {
            tabHeight: document.body.clientHeight - 252,
            threat_name: '',
            threat_loading: true,
            threatData: [],
            threatDialog: false,
            zoneIds: [],
            applications: [{
                name: '',
                version_info: ''
            }],

            isOpen: false,
            formLabelWidth: '100px',
            hole: {
                name: '',
                data: []
            },
            systems: [],
            existIp: '',
            types: [],
            loading: false,
            total_num: 0,
            tableData: [],
            storeOp: [],
            multipleSelection: [],
            get_params: {
                page: 1,
                size: 20,
                ip: '',
                port: ''
            },
            holeDialog: false,
            seeDialog: false,
            userDeleteDialog: false,
            userDeleteAllDialog: false,
            delIds: [],
            addDomainDialog: false,
            editUserDialog: false,
            ips: [{
                ip: '',
                port: '',
                mac: '',
                mask: '',
                gateway: ''
            }],
            upstreamVoList: [{
                state: '1',
                value: ''
            }],
            saveBoundarys: [],
            deviceForm: {
                manufacturerId: '',
                modelInfo: '',
                pcSystemVersion: '',

                deviceName: '',
                uniqueCode: '',
                deviceTypeId: '',
                subnetMask: '',
                pcSystem: '',
                systemId: '',
                zoneId: '', // 安全域名
                safetyBoundary: '', // 安全边界

                ips: [{
                    ip: '',
                    port: '',
                    mac: '',
                    mask: '',
                    gateway: ''
                }],
                applications: []
            },
            assetsFormEdit: {
                id: '',
                deviceName: '',
                deviceTypeId: '',
                subnetMask: '',
                pcSystem: '',
                systemId: '',
                zoneId: '', // 安全域名
                safetyBoundary: '', // 安全边界

                manufacturerId: '',
                modelInfo: '',
                pcSystemVersion: '',
                ips: [],
                applications: []
            },
            rules: {
                deviceName: [{
                    required: true,
                    message: '请输入域名',
                    trigger: 'blur'
                }],
                deviceTypeId: [{
                    required: true,
                    message: '请选择设备类型',
                    trigger: 'change'
                }],
                uniqueCode: [{
                    required: true,
                    message: '请输入资产标识',
                    trigger: 'blur'
                }],
                ip: [{
                    required: true,
                    message: 'IP不能为空',
                    trigger: 'blur'
                },
                {
                    pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
                    message: '请填写正确的IP',
                    trigger: 'blur'
                }
                ]
            }
        }
    },
    watch: {
        addDomainDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.deviceForm.resetFields()
                    this.deviceForm = {
                        pcSystem: ''
                    }
                    this.existIp = ''
                    this.deviceForm.ips = [{
                        ip: '',
                        port: '',
                        mac: '',
                        mask: '',
                        gateway: ''
                    }]
                    this.deviceForm.applications = [{
                        name: '',
                        softwareVersion: ''
                    }]
                }
            }
        },
        editUserDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.existIp = ''
                    this.assetsFormEdit.ips = [{
                        ip: '',
                        port: '',
                        mac: '',
                        mask: '',
                        gateway: ''
                    }]
                    this.assetsFormEdit.applications = [{
                        name: '',
                        softwareVersion: ''
                    }]
                }
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.get_all_zoneIds()
            this.getTypes()
            this.getSystems()
            this.getManufacturer()
        })
    },
    created() {
        this.get_data()
    },
    methods: {
        tableRowClassName({ row, rowIndex }) {
            console.log(rowIndex)
            if (rowIndex % 2) {
                return 'table-row2'
            } else {
                return 'table-row1'
            }
        },
        reset() {
            this.get_params = {
                page: 1,
                size: 20,
                ip: '',
                port: ''
            }
            this.get_data()
        },
        get_all_zoneIds() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_all_zoneIds(data).then(res => {
                if (res.length > 0) {
                    res.forEach(item => {
                        let obj = {}
                        obj.value = item.id
                        obj.label = item.zoneName
                        this.zoneIds.push(obj)
                    })
                }
            }).catch(error => {
                console.log('error' + error)
            })
        },
        handleSee(obj) {
            // console.log(obj.ips)
            let ips = []
            if (obj.ips.length > 0) {
                obj.ips.forEach(item => {
                    ips.push(item.assetsIp)
                })
            }
            let data = {
                queryData: {},
                paramsData: {
                    ips: ips
                }
            }
            getScanLeakByIp(data).then(res => {
                console.log(res)
                this.holeDialog = true
                this.hole.name = obj.device_name
                this.hole.data = res
                // let list = res.content;
            }).catch(error => {
                console.log('error' + error)
            })
        },
        getSystems() {
            let data = {}
            getSystemType(data).then(res => {
                console.log(res)
                this.systems = res
            }).catch(error => {
                this.loading = false
                console.log('error' + error)
            })
        },
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        onFocus() {
            this.existIp = ''
        },
        addIp(type) {
            if (type == 'add') {
                this.deviceForm.ips.push({
                    ip: '',
                    port: '',
                    mac: '',
                    mask: '',
                    gateway: ''
                })
            } else {
                this.assetsFormEdit.ips.push({
                    ip: '',
                    port: '',
                    mac: '',
                    mask: '',
                    gateway: ''
                })
            }
        },
        deleteIp(type, index) {
            if (type == 'add') {
                if (this.deviceForm.ips.length > 1) {
                    this.deviceForm.ips.splice(index, 1)
                } else {
                    this.$message({
                        message: '设备IP不能为空',
                        type: 'warning'
                    })
                }
            } else {
                if (this.assetsFormEdit.ips.length > 1) {
                    this.assetsFormEdit.ips.splice(index, 1)
                } else {
                    this.$message({
                        message: '设备IP不能为空',
                        type: 'warning'
                    })
                }
            }
        },
        addPrevDevice() {
            this.upstreamVoList.push({
                state: '1',
                value: ''
            })
        },
        addApplication(type) {
            if (type == 'add') {
                this.deviceForm.applications.push({
                    name: '',
                    softwareVersion: ''
                })
            } else {
                this.assetsFormEdit.applications.push({
                    name: '',
                    softwareVersion: ''
                })
            }
        },
        deleteApplication(type, index) {
            if (type == 'add') {
                this.deviceForm.applications.splice(index, 1)
            } else {
                this.assetsFormEdit.applications.splice(index, 1)
            }
        },
        deletePrevDevice(index) {
            this.upstreamVoList.splice(index, 1)
        },

        getManufacturer() {
            this.types = []
            let data = {}
            getAllManufacturer(data).then(res => {
                console.log(res)
                if (res.length > 0) {
                    res.forEach(item => {
                        let obj = {}
                        obj.id = item.id
                        obj.name = item.name
                        this.storeOp.push(obj)
                    })
                }
            }).catch(error => {
                console.log('error' + error)
            })
        },
        getTypes() {
            this.types = []
            let data = {}
            get_types(data).then(res => {
                console.log(res)
                if (res.length > 0) {
                    res.forEach(item => {
                        let obj = {}
                        obj.value = item.id
                        obj.label = item.name
                        this.types.push(obj)
                    })
                }
            }).catch(error => {
                this.loading = false
                console.log('error' + error)
            })
        },

        searchAssets() {
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
                    ip: this.get_params.ip,
                    port: this.get_params.port

                }
            }
            assetsFindList(data).then(res => {
                console.log('assetsFindList', res)
                this.loading = false
                this.total_num = res.total
                let list = res.records
                if (list.length > 0) {
                    list.forEach(item => {
                        let obj = {}
                        obj.id = item.id
                        obj.ip = item.ip
                        obj.port = item.port
                        obj.mac = item.mac
                        obj.createTime = item.createTime
                        this.tableData.push(obj)
                    })
                }
            }).catch(error => {
                this.loading = false
                console.log('error' + error)
            })
        },
        addUser() {
            this.addDomainDialog = true
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.beforeHandel(true)
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        handleAdd(ips) {
            // addDomainDialog
            // this.deviceForm.ips
            console.log('handleAdd', ips)
            this.deviceForm.ips[0].ip = ips.ip
            this.deviceForm.ips[0].port = ips.port
            this.deviceForm.ips[0].mac = ips.mac
            this.addDomainDialog = true
        },
        beforeHandel(isAdd) {
            let ips = []
            let ckeckIp = []
            let port = []
            let id = ''
            if (isAdd) {
                this.deviceForm.ips.forEach(item => {
                    let obj = {}
                    obj.assetsIp = item.ip
                    obj.subnetMask = item.mask
                    obj.gateway = item.gateway
                    obj.mac = item.mac
                    obj.ports = []
                    port = item.port.split(',')
                    if (port.length > 0) {
                        port.forEach(_item => {
                            obj.ports.push({
                                port: _item
                            })
                        })
                    }
                    ckeckIp.push(item.ip)
                    ips.push(obj)
                })
            } else {
                id = this.assetsFormEdit.id
                this.assetsFormEdit.ips.forEach(item => {
                    let obj = {}
                    obj.assetsIp = item.assetsIp
                    obj.subnetMask = item.subnetMask
                    obj.gateway = item.gateway
                    obj.mac = item.mac
                    obj.ports = []
                    port = item.port.split(',')
                    if (port.length > 0) {
                        port.forEach(_item => {
                            obj.ports.push({
                                port: _item
                            })
                        })
                    }
                    ckeckIp.push(item.assetsIp)
                    ips.push(obj)
                })
            }

            console.log('ips', ips)
            console.log('ckeckIp', ckeckIp)
            let data = {
                queryData: {
                    ips: ckeckIp.join(','),
                    assetsId: id
                },
                paramsData: {

                }
            }
            checkIP(data).then(res => {
                console.log(1111111111, res)
                if (isAdd) {
                    this.addAssets(ips)
                } else {
                    this.editAssets(ips)
                }
            }).catch(error => {
                this.addDomainDialog = false
                console.log('error' + error)
            })
        },
        addAssets(ips) {
            let data = {
                queryData: {},
                paramsData: {
                    manufacturerId: this.deviceForm.manufacturerId,
                    modelInfo: this.deviceForm.modelInfo,
                    pcSystemVersion: this.deviceForm.pcSystemVersion,
                    uniqueCode: this.deviceForm.uniqueCode,

                    deviceName: this.deviceForm.deviceName,
                    deviceTypeId: this.deviceForm.deviceTypeId,
                    // subnetMask: this.deviceForm.subnetMask,
                    pcSystem: this.deviceForm.pcSystem,
                    systemId: this.deviceForm.systemId,
                    ips: ips,
                    // upstreamVoList: upstreamVoList,
                    zoneId: this.deviceForm.zoneId,
                    // safetyBoundary: this.deviceForm.safetyBoundary,
                    software: this.deviceForm.applications
                }
            }
            console.log('addAssets', data)
            assetsFindAdd(data).then(res => {
                console.log(res)
                this.addDomainDialog = false
                this.$message({
                    message: '添加成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(error => {
                this.addDomainDialog = false
                console.log('error' + error)
            })
        },
        editAssets(ips) {
            console.log('editAssets', ips)
            let data = {
                queryData: {},
                paramsData: {
                    id: this.assetsFormEdit.id,
                    deviceName: this.assetsFormEdit.deviceName,
                    deviceTypeId: this.assetsFormEdit.deviceTypeId,
                    subnetMask: this.assetsFormEdit.subnetMask,
                    pcSystem: this.assetsFormEdit.pcSystem,
                    systemId: this.assetsFormEdit.systemId,
                    // ips: ips.join(','),
                    // upstreamVoList: upstreamVoList,
                    zoneId: this.assetsFormEdit.zoneId,
                    safetyBoundary: this.assetsFormEdit.safetyBoundary,
                    // software: this.applications,

                    manufacturerId: this.assetsFormEdit.manufacturerId,
                    modelInfo: this.assetsFormEdit.modelInfo,
                    pcSystemVersion: this.assetsFormEdit.pcSystemVersion,
                    uniqueCode: this.assetsFormEdit.uniqueCode,
                    ips: ips,
                    software: this.assetsFormEdit.applications
                }
            }
            edit_assets(data).then(res => {
                console.log(res)
                this.editUserDialog = false
                this.$message({
                    message: '修改成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(error => {
                this.editUserDialog = false
                console.log('error' + error)
            })
        },
        submitFormEdit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.beforeHandel(false)
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        handleSelectionChange(val) {
            console.log(val)
            this.multipleSelection = []
            if (val.length > 0) {
                val.forEach(item => {
                    this.multipleSelection.push(item.id)
                })
            }
        },
        delAllUserBtn() {
            if (this.multipleSelection.length > 0) {
                this.userDeleteAllDialog = true
                this.delIds = this.multipleSelection
            } else {
                this.$message({
                    message: '请选择要删除的资产',
                    type: 'warning'
                })
            }
        },
        delUserBtn(row) {
            this.delIds = [row.id]
            this.userDeleteDialog = true
        },
        handleSizeChange(val) {
            this.get_params.size = val
            this.get_data()
        },
        handleCurrentChange(val) {
            this.get_params.page = val
            this.get_data()
        },
        handleEdit(row) {
            console.log('row', row)
            let ips = []
            if (row.ips.length > 0) {
                row.ips.forEach(item => {
                    let obj = {}
                    obj.assetsIp = item.assetsIp
                    obj.gateway = item.gateway
                    obj.mac = item.mac
                    obj.mask = item.mask
                    obj.port = item.port.join(',')
                    ips.push(obj)
                })
            }
            this.assetsFormEdit = {
                id: row.id,
                deviceName: row.device_name,
                deviceTypeId: row.device_type_id,
                subnetMask: row.subnet_mask,
                pcSystem: row.pc_system,
                systemId: row.system_id,
                zoneId: row.zone_id, // 安全域名
                safetyBoundary: row.safety_boundary, // 安全边界

                manufacturerId: row.manufacturerId,
                modelInfo: row.modelInfo,
                pcSystemVersion: row.pcSystemVersion,
                uniqueCode: row.uniqueCode,
                ips: ips,
                applications: row.assetsSoftwares
            }

            this.editUserDialog = true
        },
        handleDetail(row) {
            console.log('row', row)
            let ips = []
            if (row.ips.length > 0) {
                row.ips.forEach(item => {
                    let obj = {}
                    obj.assetsIp = item.assetsIp
                    obj.gateway = item.gateway
                    obj.mac = item.mac
                    obj.mask = item.mask
                    obj.port = item.port.join(',')
                    ips.push(obj)
                })
            }
            this.assetsFormEdit = {
                id: row.id,
                deviceName: row.device_name,
                deviceTypeId: row.device_type_id,
                subnetMask: row.subnet_mask,
                pcSystem: row.pc_system,
                systemId: row.system_id,
                zoneId: row.zone_id, // 安全域名
                safetyBoundary: row.safety_boundary, // 安全边界

                system_name: row.system_name,
                device_type_name: row.device_type_name,
                zoneName: row.zoneName,
                manufacturerId: row.manufacturerId,
                manufacturer_name: row.manufacturer_name,
                modelInfo: row.modelInfo,
                pcSystemVersion: row.pcSystemVersion,
                uniqueCode: row.uniqueCode,
                ips: ips,
                applications: row.assetsSoftwares

            }

            this.seeDialog = true
        },
        handleView(row) {
            this.$setsessionStorage('assetsInfo', row)
            this.$router.push({
                path: this.$route.path + '/tp',
                query: {
                    id: ''
                }
            })
        },
        handleThreaMeaage(row) {
            this.threat_name = row.device_name
            this.threatDialog = true
            this.init_threatData(row.id)
        },
        init_threatData(id) {
            this.threat_loading = true
            this.threatData = []
            let data = {
                queryData: {},
                paramsData: {
                    id: id
                }
            }
            get_threatData(data).then(res => {
                console.log('13234', res)
                this.threat_loading = false
                this.threatData = res
            }).catch(error => {
                this.threat_loading = false
                console.log(error + 'error')
            })
        },
        handelRightSee(row) {

        }
    }
}

</script>

<style lang="scss" scoped>
.paginat {
    padding-top:10px;
}
.el-form--inline  ::v-deep .mb0{
    margin: 0!important;
    font-size:12px;
}
.el-form--inline  ::v-deep .mb0{
    input{
        height:28px;
        font-size:12px;
    }
}
.mb0  ::v-deep .el-form-item__error{
    position: static!important;
}
.bigTable ::v-deep .el-tag.el-tag--success {
    background-color: transparent;
    border-color: #01c5ff;
    color: #00fdff;
}

.el-input.ips {
    display: block;
    width: 100%;
}

.drawer-pad {
    padding: 0 20px;
}

.domain-add {
    line-height: 1;
    position: relative;
    padding: 10px 0;
    color: rgba(0,0,0,.9);
    font-size:12px;
    .domain-title{
        display: inline-block;
        // width: 100px;
        text-align: right;
    }

    .el-button {
        position: absolute;
        right: 20px;
        top: 10px;
        padding: 0;
        color: #0052d9;
    }
}

.domain-list {
    margin: 3px 0 20px;
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
            color: #F56C6C;
        }
    }
}
.input-div{
    width: 180px;
}
</style>
