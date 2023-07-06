<template>
    <div class="work checkdia">
        <div class="title mb-1">基本信息</div>
        <el-descriptions size="mini" border>
            <el-descriptions-item label="业务系统">{{seeSystem.systemName}}</el-descriptions-item>
        </el-descriptions>
        <div class="title mb-1 mt-1">联系人信息</div>
        <el-table class='bigTable system mt-1' :data="seeSystem.users" border stripe tooltip-effect="dark" :row-style="{ height: '32px' }" :row-class-name="tableRowClassName">
            <el-table-column align="center" type="index" width="50" label="序号">
            </el-table-column>
            <el-table-column label="联系人" prop="chineseName" width="100" align="center">
            </el-table-column>
            <el-table-column prop="code" label="员工编号" width="80" align="center">
            </el-table-column>
            <el-table-column prop="departmentName" label="部门" width="100" align="center">
            </el-table-column>
            <el-table-column prop="phone" label="电话" show-overflow-tooltip align="center">
            </el-table-column>
            <el-table-column prop="landline" label="座机" show-overflow-tooltip align="center">
            </el-table-column>
            <el-table-column prop="mailBox" label="邮箱" align="center">
            </el-table-column>
        </el-table>
        <div class="title mb-1 mt-1">域名信息</div>
        <el-table
            class='bigTable system mt-1'
            :data="seeSystem.infos"
            border
            stripe
            :row-class-name="tableRowClassName"
            tooltip-effect="dark"
            :row-style="{ height: '32px' }"
            :header-row-style="{ height: '32px' }">
            <el-table-column align="center" type="index" width="50" label="序号">
            </el-table-column>
            <el-table-column prop="domainName" label="域名" align="center">
            </el-table-column>
            <el-table-column prop="ip" label="IP" align="center">
            </el-table-column>
            <el-table-column prop="port" label="端口" align="center">
            </el-table-column>
            <!-- <el-table-column prop="extranet_ip" label="外网IP" align="center">
            </el-table-column>
            <el-table-column prop="extranet_port" label="外网端口" align="center">
            </el-table-column>
            <el-table-column prop="fictitious_ip" label="虚IP" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="fictitious_port" label="虚端口" show-overflow-tooltip>
            </el-table-column> -->
        </el-table>
        <div class="title mb-1 mt-1">关联资产信息</div>
        <el-table class='bigTable mt-1' :data="assetsCopy" border stripe tooltip-effect="dark" :row-style="{ height: '32px' }" :row-class-name="tableRowClassName">
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
                    <el-tag type="success" size="mini" style="border: 1px solid rgb(56 125 238 / 40%);" v-if="scope.row.ips[0].assetsIp">{{scope.row.ips[0].assetsIp}}</el-tag>
                </template>
            </el-table-column>
            <!-- <el-table-column label="端口" align="center">
                <template slot-scope="scope">
                    <span style="color:#0052d9" v-if="scope.row.ports.length">{{scope.row.ports.join('')==','?'':scope.row.ports.join(',')}}</span>
                </template>
            </el-table-column> -->
            <el-table-column align="center" label="操作" width="60">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="handleSee1(scope.row)">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        <AssetsDetailDrawer :assetsSeeDialog="drawerSeeDialog" ref="assetsDetailDrawer" :activeName="activeName"></AssetsDetailDrawer>
    </div>
</template>

<script>
// import AssetsDetailDrawer from '../../assets_detail_drawer/index.vue'
import { getAssetsBySysId } from '@/server/assets/api.js'
export default {
    props: ['infoData', 'seeSystem'],
    components: {
        AssetsDetailDrawer: () => import('../../assets_detail_drawer/index.vue')
    },
    data() {
        return {
            // seeForm: {}
            activeName: '',
            drawerSeeDialog: false,
            assetsList: [],
            assetsCopy: []
        }
    },
    mounted() {
        this.assetsCopy = []
        // this.seeForm = this.$getlocalStorage('seeSystem')
        console.log(this.seeSystem)
        let data = {
            queryData: {
                id: this.seeSystem.id
            },
            paramsData: {}
        }
        getAssetsBySysId(data).then(res => {
            res.map(item => {
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
            this.assetsList = res
        }).catch(err => {
            console.log(err)
        })
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
        handleSee1(row) {
            console.log(row)
            if (row.ips.length > 0) {
                this.$refs.assetsDetailDrawer.ipsData = row.ips.map(item => item.assetsIp)
            }
            this.$refs.assetsDetailDrawer.infoData = row
            this.$refs.assetsDetailDrawer.assetsId = row.id
            console.log(this.$refs.assetsDetailDrawer.infoData)
            this.activeName = 'first'
            this.drawerSeeDialog = true
        }
    }
}
</script>

<style lang="scss" scoped>
        .work {
            .title {
                font-size: 12px;
                color: #387dee;
            }
            ::v-deep .el-descriptions-item__label {
                width: 100px !important;
            }
        }
</style>
<style lang="scss">
    .custom-star {
        .checkdia {
            .el-descriptions__body {
                background: unset;
                .el-descriptions-item__label.is-bordered-label {
                    border: 1px solid #1cd7fa!important;
                    color: #ffffff!important;
                    background: unset!important;
                    box-shadow: 0 0 7px inset #389bf7;
                }
                .el-descriptions-item__cell {
                    border: 1px solid #1cd7fa!important;
                    color: #ffffff;
                    box-shadow: 0 0 7px inset #389bf7;
                }
            }
        }
    }
</style>
