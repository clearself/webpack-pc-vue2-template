<template>
    <div class="list">
        <SearchTop @search="searchAssets" @reset="reset">
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params">
                    <el-form-item label="安全域名：" label-width="80px">
                        <el-input placeholder="请输入安全域名" clearable v-model="get_params.zoneName" @keyup.enter.native="searchAssets" size="small"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
        </SearchTop>
        <div class="list-container">
            <div class="ub ub-pj w100 mb-1 ub-ac">
                <div class="list-tips">安全域管理</div>
                <div>
                    <el-button size="small" icon="el-icon-plus" type="primary" @click="openAdd" v-per="['assets_safetyzone_add']">添加安全域</el-button>
                    <el-button style="margin-left: 10px;" size="small" icon="el-icon-delete" type="danger" title="删除" @click="delAllUserBtn" v-per="['assets_safetyzone_del']">删除</el-button>
                </div>
            </div>
            <el-table
                ref="multipleTable"
                v-loading="loading"
                class='bigTable'
                :data="tableData"
                border
                stripe
                tooltip-effect="dark"
                :row-class-name="tableRowClassName"
                @selection-change="handleSelectionChange"
                :height="tabHeight"
                :row-style="{ height: '32px' }"
                :header-row-style="{ height: '32px' }">
                <el-table-column align="center" type="selection" width="30"></el-table-column>
                <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                </el-table-column>
                <el-table-column prop="zoneName" label="安全域名称">
                </el-table-column>
                <el-table-column label="安全域拓扑图" align="left" width="110">
                    <template slot-scope="scope">
                        <el-button @click="handleView(scope.row)" type="text" size="small">查看</el-button>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="140">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="handleSee(scope.row)">查看</el-button>
                        <el-button type="text" size="small" @click="handleEdit(scope.row)" v-per="['assets_attack_edit']">编辑</el-button>
                        <el-button type="text" size="small" @click="delUserBtn(scope.row)" v-per="['assets_safetyzone_del']">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size" @pagination="get_data" style="padding-top:10px" v-show="total_num>0"/>
        </div>
        <!--增加内容开始-->
        <el-dialog title="添加安全域" :visible.sync="addDomainDialog" width="700px" custom-class="common-dialog">
            <el-form :model="deviceForm" :rules="rules" ref="deviceForm" class="unit" label-position="top">
                <el-form-item label="安全域名：" prop="zoneName" :label-width="formLabelWidth">
                    <el-input size="small" v-model="deviceForm.zoneName" placeholder="请输入安全域名" autocomplete="off" style="width:100%"></el-input>
                </el-form-item>
                <!-- <el-form-item label="上传图片：" :label-width="formLabelWidth">
                    <el-upload
                        :headers="header"
                        action="/api/base-server/file/upload"
                        list-type="picture-card"
                        name="fileUpload"
                        accept=".jpg,.png,.JPG,.PNG,.bpm,.BPM"
                        :limit="1"
                        :file-list="fileList"
                        :on-exceed="handleExceed"
                        :on-preview="handlePictureCardPreview"
                        :on-success="handleSuccess"
                        :on-remove="handleRemove">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                </el-form-item> -->
                <el-form-item label="拓扑图：" prop="topoName" :label-width="formLabelWidth">
                    <!-- <el-input size="small" v-model="deviceForm.topoName" placeholder="请选择拓扑图" autocomplete="off" style="width:100%"></el-input> -->
                    <el-select v-model="deviceForm.topoName" placeholder="请选择拓扑图" style="width:100%"  size="small" clearable>
                        <el-option
                            v-for="item in options"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDomainDialog=false" size="small">取消</el-button>
                <Debounce :time='1500' :isDebounce="2">
                    <el-button type="primary" @click.native="submitForm('deviceForm')" size="small">确认</el-button>
                </Debounce>
            </span>
        </el-dialog>
        <el-dialog title="图片预览" :visible.sync="dialogVisible" custom-class="common-dialog" width="700px">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
        <!--编辑内容-->
        <el-dialog title="编辑安全域" :visible.sync="editUserDialog" width="700px" custom-class="common-dialog">
            <el-form :model="assetsFormEdit" :rules="rules" ref="assetsFormEdit" class="unit" label-position="top">
                <el-form-item label="安全域名：" prop="zoneName" :label-width="formLabelWidth">
                    <el-input v-model="assetsFormEdit.zoneName" size="small" placeholder="请输入设备名称" autocomplete="off" style="width:100%"></el-input>
                </el-form-item>
                <!-- <el-form-item label="上传图片：" :label-width="formLabelWidth">
                    <el-upload
                        :headers="header"
                        action="/api/base-server/file/upload"
                        list-type="picture-card"
                        name="fileUpload"
                        accept=".jpg,.png,.JPG,.PNG,.bpm,.BPM"
                        :limit="1"
                        :file-list="fileList"
                        :on-exceed="handleExceed"
                        :on-preview="handlePictureCardPreview"
                        :on-success="handleSuccess"
                        :on-remove="handleRemove">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                </el-form-item> -->
                <el-form-item label="拓扑图：" prop="topologyId" :label-width="formLabelWidth">
                    <el-select v-model="assetsFormEdit.topologyId" placeholder="请选择拓扑图" style="width:100%"  size="small" clearable>
                        <el-option
                            v-for="item in options"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editUserDialog=false" size="small">取消</el-button>
                <el-button type="primary" @click="submitFormEdit('assetsFormEdit')" size="small">确认</el-button>
            </span>
        </el-dialog>
        <!--删除-->
        <DeleteDialog
            :dialogVisible = userDeleteDialog
            @delete="handleDelete"
            @cancel="userDeleteDialog = false">
        </DeleteDialog>
        <DeleteDialog
            :dialogVisible = userDeleteAllDialog
            @delete="handleDelete"
            @cancel="userDeleteAllDialog = false">
        </DeleteDialog>
        <el-drawer :visible.sync="seeDialog" direction="rtl" :size="900" title="查看详情" custom-class="drawer-dialog" v-if="seeDialog">
            <div style="padding:0 10px;">
                <div class="title">基本信息</div>
                <div class="container">
                    <el-descriptions size="mini" title="" :column="2" border>
                        <el-descriptions-item label="安全域名称">{{seeForm.zoneName}}</el-descriptions-item>
                    </el-descriptions>
                </div>
                <div class="title mt-1">关联网段信息</div>
                <el-table class='bigTable mt-1' :data="seeForm.gateways" border stripe tooltip-effect="dark" :row-style="{ height: '32px' }"  :header-cell-style="getRowClass">
                    <el-table-column label="网段" align="center">
                        <template slot-scope="scope">
                            <div>{{scope.row.networkStart+'-'+scope.row.networkEnd}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="ipCount" label="IP数量" align="center">
                    </el-table-column>
                    <el-table-column prop="organizationName" label="所属组织" align="center">
                    </el-table-column>
                </el-table>
                <div class="title mt-1">关联资产信息</div>
                <el-table class='bigTable mt-1' :data="assetsCopy" border stripe tooltip-effect="dark" :row-style="{ height: '32px' }"  :header-cell-style="getRowClass">
                    <el-table-column label="资产名称" prop="device_name" align="center">
                    </el-table-column>
                    <el-table-column prop="device_type_name" label="资产类型" align="center">
                    </el-table-column>
                    <el-table-column prop="manufacturer_name" label="厂商" align="center">
                    </el-table-column>
                    <el-table-column prop="modelInfo" label="型号" align="center">
                    </el-table-column>
                    <el-table-column prop="IP" label="IP" align="center">
                        <template slot-scope="scope" v-if="scope.row.ips.length">
                            <el-tag type="success" size="mini" style="border:1px solid rgba(56,125,238,.4);" v-if="scope.row.ips[0].assetsIp">{{scope.row.ips[0].assetsIp}}</el-tag>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column label="端口" align="center">
                        <template slot-scope="scope">
                            <span style="color:#0052d9" v-if="scope.row.ports.length">{{scope.row.ports.join(',')==','?'':scope.row.ports.join(',')}}</span>
                        </template>
                    </el-table-column> -->
                    <el-table-column align="center" label="操作" width="60">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="handleSee1(scope.row)">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-drawer>
        <AssetsDetailDrawer :assetsSeeDialog="drawerSeeDialog" ref="assetsDetailDrawer" :activeName="activeName"></AssetsDetailDrawer>
    </div>
</template>

<script>
import {
    safetyZone,
    addZoom,
    updateZoom,
    delZoom,
    getTopologyAll,
    getSafetyZoneById
} from '../../server/assets/api.js'
import AssetsDetailDrawer from './assets_detail_drawer/index.vue'
export default {
    name: 'User',
    components: {
        AssetsDetailDrawer
    },
    data() {
        return {
            activeName: '',
            tabHeight: document.body.clientHeight - 260,
            formLabelWidth: '100px',
            hole: {
                name: '',
                data: []
            },
            loading: false,
            total_num: 0,
            tableData: [],
            multipleSelection: [],
            get_params: {
                page: 1,
                size: 20,
                zoneName: ''
            },
            userDeleteDialog: false,
            userDeleteAllDialog: false,
            delIds: [],
            addDomainDialog: false,
            editUserDialog: false,
            ips: [{
                value: ''
            }],
            deviceForm: {
                zoneName: '',
                zoneImg: '',
                topoName: ''
            },
            assetsFormEdit: {
                id: '',
                zoneName: '',
                // zoneImg: '',
                // topoName: '',
                topologyId: ''
            },
            rules: {
                zoneName: [{
                    required: true,
                    message: '请输入安全域名',
                    trigger: 'blur'
                }],
                deviceTypeId: [{
                    required: true,
                    message: '请选择设备类型',
                    trigger: 'change'
                }],
                subnetMask: [{
                    required: true,
                    message: '请输入子网掩码',
                    trigger: 'blur'
                }],
                ip: [{
                    required: true,
                    message: '请输入IP地址',
                    trigger: 'blur'
                }],
                topoName: [{
                    required: true,
                    message: '选择拓扑图',
                    trigger: 'blur'
                }],
                topologyId: [{
                    required: true,
                    message: '选择拓扑图',
                    trigger: 'blur'
                }]
            },
            dialogImageUrl: '',
            dialogVisible: false,
            userId: '',
            path: {
                path: ''
            },
            fileList: [],
            options: [],
            seeDialog: false,
            seeForm: {},
            drawerSeeDialog: false,
            assetsCopy: []
        }
    },
    computed: {
        header() {
            return { token: this.$getlocalStorage('initInfo').user.token }
        }
    },
    watch: {
        dialogVisible: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.dialogImageUrl = ''
                }
            }
        },
        addDomainDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.deviceForm.resetFields()
                }
            }
        },
        editUserDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.fileList = []
                }
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.get_data()
            this.getTopology()
            // this.getTypes();
            // this.getSystems();
            // this.chats();
        })
    },
    created() {
        let user = this.$getsessionStorage('userInfo')
        console.log('$getsessionStorage', user.id)
        this.userId = user.id
        this.path.path = '/file_assets/' + user.id + '/'
    },
    methods: {
        handleSee1(row) {
            console.log(row)
            if (row.ips.length > 0) {
                this.$refs.assetsDetailDrawer.ipsData = row.ips.map(item => item.assetsIp)
            }
            this.$refs.assetsDetailDrawer.infoData = row
            this.$refs.assetsDetailDrawer.assetsId = row.id
            this.activeName = 'first'
            this.drawerSeeDialog = true
        },
        getTopology() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            getTopologyAll(data).then(res => {
                this.options = res
            }).catch(err => {
                console.log(err)
            })
        },
        getRowClass({ row, column, rowIndex, columnIndex }) {
            if (rowIndex == 0) {
                return 'background:#EBF1F5'
            } else {
                return ''
            }
        },
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
                zoneName: ''
            }
            this.get_data()
        },
        openAdd() {
            this.addDomainDialog = true
            this.fileList = []
        },
        handleSuccess(response, file, fileList) {
            console.log('response', response)
            if (response.code == 1) {
                this.$message({
                    message: '文件上传成功!',
                    type: 'success'
                })
                this.deviceForm.zoneImg = response.data
                this.assetsFormEdit.zoneImg = response.data
            } else {
                this.$message({
                    message: response.message,
                    type: 'warning'
                })
            }
        },
        handleExceed(files, fileList) {
            this.$message.warning(`只能上传 1 张图片`)
        },
        handleRemove(file, fileList) {
            console.log(file, fileList)
            this.deviceForm.zoneImg = ''
            this.assetsFormEdit.zoneImg = ''
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url
            this.dialogVisible = true
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
        handleSee(row) {
            this.assetsCopy = []
            this.seeForm = {}
            this.seeDialog = true
            let data = {
                queryData: {},
                paramsData: {
                    id: row.id
                }
            }
            getSafetyZoneById(data).then(res => {
                console.log(res)
                res.assets.map(item => {
                    let obj = {}
                    obj.id = item.id
                    obj.device_name = item.deviceName
                    obj.create_time = item.createTime
                    obj.device_type_name = item.deviceTypeName
                    obj.device_type_id = item.deviceTypeId
                    obj.ips = []
                    obj.ports = []
                    if (item.ips && item.ips.length > 0) {
                        item.ips.forEach(_item => {
                            let port = []
                            if (_item.ports.length > 0) {
                                _item.ports.forEach(val => {
                                    port.push(val.port)
                                })
                            }
                            obj.ips.push({
                                assetsIp: _item.assetsIp,
                                gateway: _item.gateway,
                                ipType: _item.ipType,
                                mac: _item.mac,
                                mask: _item.subnetMask,
                                port: port,
                                ports: port.join(',')
                            })
                        })
                    }
                    obj.ips.forEach(_item => {
                        obj.ports.push(_item.ports)
                    })
                    obj.ipsv4 = obj.ips.filter(item => item.ipType == 1)
                    obj.ipsv6 = obj.ips.filter(item => item.ipType == 2)
                    obj.pc_system = item.pcSystem
                    obj.subnet_mask = item.subnetMask
                    obj.is_boundary = item.isBoundary
                    obj.is_domestic = item.isDomestic
                    obj.label_id = item.labelId
                    obj.isBoundaryCN = item.isBoundaryCN
                    obj.labelName = item.labelName
                    obj.is_domestic = item.isDomestic
                    obj.domainList = item.domainList
                    obj.system_id = item.systemId
                    obj.system_name = item.systemName
                    obj.zone_id = item.zoneId
                    obj.zoneName = item.zoneName
                    obj.safety_boundary = item.safetyBoundary
                    obj.safetyBoundaryCN = item.safetyBoundaryCN
                    obj.sftnum = item.sftnum
                    obj.assetsSoftwares = item.assetsSoftwares
                    obj.ldNum = item.ldNum
                    obj.qbNum = item.qbNum
                    obj.gjNum = item.gjNum
                    obj.manufacturerId = item.manufacturerId
                    obj.manufacturer_name = item.manufacturerName
                    obj.modelInfo = item.modelInfo
                    obj.pcSystemVersion = item.pcSystemVersion
                    obj.uniqueCode = item.uniqueCode
                    obj.attr = item.attr ? item.attr : []
                    obj.sysAttr = item.sysAttr ? item.sysAttr : []
                    obj.isInstall = item.isInstall
                    obj.virusVersion = item.virusVersion
                    obj.systemUsers = []
                    if (item.userList && item.userList.length > 0) {
                        obj.systemUsers = this.$deepCopy(item.userList)
                    }
                    this.assetsCopy.push(obj)
                })
                this.seeForm = res
            })
            console.log('handleSee')
        },
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
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
                    zoneName: this.get_params.zoneName
                }
            }
            safetyZone(data).then(res => {
                console.log('safetyZone', res)
                this.loading = false
                this.total_num = res.total
                let list = res.records
                if (list.length > 0) {
                    list.forEach(item => {
                        let obj = {}
                        obj.id = item.id
                        obj.zoneName = item.zoneName
                        obj.createTime = item.createTime
                        obj.zoneImgName = item.zoneImgName
                        obj.zoneImg = item.zoneImg
                        obj.topologyId = item.topologyId
                        obj.topologyName = item.topologyIName
                        this.tableData.push(obj)
                    })
                }
            }).catch(error => {
                this.loading = false
                console.log('error' + error)
            })
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // this.beforeHandel(true);
                    this.addAssets()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        addAssets() {
            console.log('this.deviceForm', this.deviceForm)
            let data = {
                queryData: {},
                paramsData: {
                    zoneName: this.deviceForm.zoneName,
                    zoneImg: this.deviceForm.zoneImg,
                    topologyId: this.deviceForm.topoName
                }
            }
            addZoom(data).then(res => {
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
                // this.addDomainDialog = false
                console.log('error' + error)
            })
        },
        editAssets() {
            let data = {
                queryData: {},
                paramsData: {
                    id: this.assetsFormEdit.id,
                    zoneName: this.assetsFormEdit.zoneName,
                    zoneImg: this.assetsFormEdit.zoneImg,
                    topologyId: this.assetsFormEdit.topologyId
                }
            }
            updateZoom(data).then(res => {
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
                // this.editUserDialog = false
                console.log('error' + error)
            })
        },
        submitFormEdit(formName) {
            console.log(formName)
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // this.beforeHandel(false);
                    this.editAssets()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        delUserBtn(row) {
            this.delIds = []
            this.delIds.push(row.id)
            this.userDeleteDialog = true
        },
        delAllUserBtn() {
            if (this.multipleSelection.length > 0) {
                this.userDeleteAllDialog = true
                this.delIds = this.multipleSelection
            } else {
                this.$message({
                    message: '请选择要删除的安全域',
                    type: 'warning'
                })
            }
        },
        handleDelete() {
            console.log(this.delIds)
            let data = {
                queryData: {},
                paramsData: {
                    ids: this.delIds
                }
            }
            delZoom(data).then(res => {
                this.userDeleteDialog = false
                this.userDeleteAllDialog = false
                console.log('删除成功')
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(error => {
                this.userDeleteDialog = false
                this.userDeleteAllDialog = false
                console.log(error + 'error')
            })
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
            this.assetsFormEdit = {
                id: row.id,
                zoneName: row.zoneName,
                zoneImg: row.zoneImg,
                topologyId: row.topologyId
            }
            this.fileList = []
            if (row.zoneImg != '') {
                this.fileList.push({
                    name: row.zoneImgName,
                    url: '/api/base-server/file/download' + encodeURI(encodeURI(row.zoneImg)) + '?token=' + this.$getlocalStorage('initInfo').user.token
                })
            }
            this.editUserDialog = true
        },
        handleView(row) {
            console.log('handleView', row)
            this.$router.push({
                path: '/assets/assets_topo',
                query: {
                    from: 'safe',
                    id: row.topologyId,
                    name: row.topologyName
                }
            })
            // this.dialogImageUrl = '/api/base-server/file/download' + encodeURI(encodeURI(row.zoneImg)) + '?token=' + this.$getlocalStorage('initInfo').user.token
            // this.dialogVisible = true
        }
    }
}
</script>

<style lang="scss" scoped>
    .drawer-dialog{
        .title{
            font-size: 12px;
            color: #387dee;
            margin-bottom:5px;
        }
        .container{
            ::v-deep .el-descriptions-item__cell{
                width:100px !important;
                height:30px !important;
                font-size:12px !important;
                // background-color: #033254 !important;
                // box-shadow: inset 0px 0px 2px rgba(0, 186, 255, 73%) !important;
            }
            ::v-deep .el-descriptions-item__label{
                // background-color: #00466d !important;
                font-weight: 600;
            }
        }
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
        background: rgba(0, 0, 0, .3);
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
                color: #F56C6C;
            }
        }
    }
    .event ::v-deep .el-upload--picture-card {
        background: rgb(0,0,0);
        border: 1px dashed #1cd7fa;
        box-shadow: 0 0 7px #389bf7 inset;
    }
    .event ::v-deep .el-upload--picture-card i {
        color: #1cd7fa;
    }
</style>
