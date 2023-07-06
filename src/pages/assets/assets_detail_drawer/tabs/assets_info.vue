<template>
    <div class="assets-info checkdia">
        <div class="title">基本信息</div>
        <div class="mb-2">
            <el-descriptions size="mini" title="" :column="2" border>
                <el-descriptions-item label="资产名称">{{ infoData.device_name?infoData.device_name:infoData.deviceName }}</el-descriptions-item>
                <el-descriptions-item label="资产唯一标识">{{ infoData.uniqueCode }}</el-descriptions-item>
                <el-descriptions-item label="业务系统">{{ infoData.system_name?infoData.system_name.join(','):infoData.systemName }}</el-descriptions-item>
                <el-descriptions-item label="所属安全域">{{ infoData.zoneName }}</el-descriptions-item>
                <el-descriptions-item label="资产类型">{{ infoData.device_type_name?infoData.device_type_name:infoData.deviceTypeName }}</el-descriptions-item>
                <el-descriptions-item label="厂商">{{ infoData.manufacturer_name?infoData.manufacturer_name:infoData.manufacturerName }}</el-descriptions-item>
                <el-descriptions-item label="型号">{{ infoData.modelInfo }}</el-descriptions-item>
                <el-descriptions-item label="操作系统">{{ infoData.pc_system?infoData.pc_system:infoData.pcSystem }}</el-descriptions-item>
                <el-descriptions-item label="操作版本">{{ infoData.pcSystemVersion }}</el-descriptions-item>
                <el-descriptions-item label="是否国产">{{ infoData.is_domestic==1||infoData.isDomestic == 1 ? '是' : '否' }}</el-descriptions-item>
                <el-descriptions-item label="是否边界">{{ infoData.isBoundaryCN   }}</el-descriptions-item>
                <el-descriptions-item label="是否安装杀毒">{{ infoData.isInstall == 1 ? '是' : '否' }}</el-descriptions-item>
                <el-descriptions-item label="杀毒软件版本">{{ infoData.virusVersion   }}</el-descriptions-item>
                <el-descriptions-item label="资产完整性">{{ infoData.fullStatus   }}</el-descriptions-item>
                <el-descriptions-item label="资产可用性">{{ infoData.usableStatus   }}</el-descriptions-item>
                <el-descriptions-item label="资产机密性">{{ infoData.secretStatus   }}</el-descriptions-item>
            </el-descriptions>
        </div>
        <div class="title">扩展信息</div>
        <div class="mb-2">
            <el-descriptions size="mini" title="" :column="1" border>
                <el-descriptions-item :label="item.name" v-for="(item,index) in extendData" :key="index">
                    <div v-html="item.val == 'null'|| item.val == '-undefined'?'':item.val"></div>
                </el-descriptions-item>
            </el-descriptions>
        </div>
        <div class="title">IP信息</div>
        <div class="title-two">IPV4</div>
        <div class="mb-2">
            <el-table class='bigTable mt-1 fixedTable' :data="infoData.ipsv4" border stripe tooltip-effect="dark" :row-style="{ height: '32px' }">
                <el-table-column prop="assetsIp" label="IP"  align="center">
                </el-table-column>
                <el-table-column prop="port" label="端口" align="center">
                    <template slot-scope="scope">
                        <span style="color: #0052d9;" v-if="scope.row.port.constructor == String">{{scope.row.port}}</span>
                        <span style="color: #0052d9;" v-if="scope.row.port.constructor == Array">{{scope.row.port.join(',')==','?'':scope.row.port.join(',')}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="mac" label="MAC" align="center">
                </el-table-column>
                <el-table-column prop="mask" label="子网掩码" align="center">
                </el-table-column>
                <el-table-column prop="gateway" label="网关" align="center">
                </el-table-column>
            </el-table>
        </div>
        <div class="title-two">IPV6</div>
        <div class="mb-2">
            <el-table class='bigTable mt-1' :data="infoData.ipsv6" border stripe tooltip-effect="dark" :row-style="{ height: '32px' }">
                <el-table-column prop="assetsIp" label="IP"  align="center">
                </el-table-column>
                <el-table-column prop="port" label="端口" align="center">
                    <template slot-scope="scope">
                        <span style="color: #0052d9;" v-if="scope.row.port.constructor == String">{{scope.row.port}}</span>
                        <span style="color: #0052d9;" v-if="scope.row.port.constructor == Array">{{scope.row.port.join(',')==','?'':scope.row.port.join(',')}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="mac" label="MAC" align="center">
                </el-table-column>
                <el-table-column prop="mask" label="子网掩码" align="center">
                </el-table-column>
                <el-table-column prop="gateway" label="网关" align="center">
                </el-table-column>
            </el-table>
        </div>
        <div class="title">组件信息</div>
        <div class="mb-2">
            <el-table class='bigTable mt-1' :data="infoData.assetsSoftwares" border stripe tooltip-effect="dark" :row-style="{ height: '32px' }">
                <el-table-column label="组件名称" prop="name" align="center">
                </el-table-column>
                <el-table-column prop="softwareVersion" label="版本" align="center">
                </el-table-column>

            </el-table>
        </div>
        <div class="title">联系人信息</div>
        <div class="mb-2">
            <el-table class='bigTable mt-1 fixedTable' :data="infoData.systemUsers" border stripe tooltip-effect="dark" :row-style="{ height: '32px' }">
                <el-table-column prop="chineseName" label="联系人"  align="center">
                </el-table-column>
                <el-table-column prop="departmentName" label="组织架构" align="center">
                </el-table-column>
                <el-table-column prop="phone" label="电话" align="center">
                </el-table-column>
                <el-table-column prop="mailBox" label="邮箱" align="center">
                </el-table-column>
                <el-table-column prop="landline" label="座机" align="center">
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
export default {
    props: ['infoData'],
    data() {
        return {
            info: {},
            extendData: []
        }
    },
    created() {
        this.disposeData()
    },
    methods: {
        disposeData() {
            let val = [...this.infoData.sysAttr, ...this.infoData.attr]
            if (val.length > 0) {
                this.extendData = val.map(item => {
                    if (item.type == 9) {
                        return {
                            id: item.id,
                            items: item.items,
                            name: item.name,
                            type: item.type,
                            val: item.val.length === 0 ? '' : item.val.join()
                        }
                    } else {
                        return {
                            id: item.id,
                            items: item.items,
                            name: item.name,
                            type: item.type,
                            val: item.val
                        }
                    }
                })
            }
        }
    }
}
</script>

<style  lang="scss" scoped>
.assets-info {
    .title {
        margin-bottom: 5px;
        font-size: 12px;
        color: #387dee;
    }
    .title-two {
        margin-bottom: 5px;
        font-size: 12px;
        color: #000000;
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
