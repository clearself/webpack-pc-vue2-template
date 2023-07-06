<template>
    <div class="container">
        <el-descriptions size="mini" title="" :column="2" border>
            <el-descriptions-item label="资产名称">{{ assetsInfo.deviceName }}</el-descriptions-item>
            <el-descriptions-item label="资产标识">{{ assetsInfo.uniqueCode }}</el-descriptions-item>
            <el-descriptions-item label="设备类型">{{ assetsInfo.deviceTypeName }}</el-descriptions-item>
            <el-descriptions-item label="厂商"> {{ assetsInfo.manufacturerName }}</el-descriptions-item>
            <el-descriptions-item label="型号">{{ assetsInfo.modelInfo }}</el-descriptions-item>
            <el-descriptions-item label="系统">{{ assetsInfo.pcSystem }}</el-descriptions-item>
            <el-descriptions-item label="是否边界">
                <p v-if="assetsInfo.isBoundary!==''">{{ assetsInfo.isBoundary|getisBoundary }}</p>
            </el-descriptions-item>
            <el-descriptions-item
                label="
                    业务系统">{{ assetsInfo.systemName }}</el-descriptions-item>
            <el-descriptions-item label="所属安全域">{{ assetsInfo.zoneName }}</el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ assetsInfo.createTime }}</el-descriptions-item>
            <el-descriptions-item label="资产联系人" :span="2">
                <!--eslint-disable-->
                <el-tag style="margin: 10px;" v-if="item.chineseName" type="success" color="lightgreen" size="mini" v-for="(item,index) in assetsInfo.systemUsers" :key="index">{{item.chineseName}}</el-tag>
            </el-descriptions-item>

        </el-descriptions>
    </div>
</template>

<script>
export default {
    name: 'AssetInfo',
    props: {
        assetsInfo: {
            default: null
        }
    },
    filters: {
        getisBoundary(val) {
            if (val == 1) {
                return '是'
            } else if (val == 0) {
                return '否'
            } else {
                return ''
            }
        }
    }
}
</script>

<style scoped lang="scss">
.container ::v-deep .el-descriptions__body .el-descriptions__table {
    border-radius: 4px;
}
.black-theme .container ::v-deep .el-descriptions__body {
    background: #033254;
    color: #fff;
}
.black-theme .container ::v-deep .el-descriptions-item__label.is-bordered-label {
    background: #00466d;
    color: #fff;
    box-shadow: inset 0px 0px 2px rgba(0, 186, 255, 0.73);
}
.container ::v-deep .el-descriptions-item__label.is-bordered-label {
    width: 100px;
}
.black-theme .container ::v-deep .el-descriptions .is-bordered .el-descriptions-item__cell {
    border: 1px solid #1a5c92;
}
.black-theme .container ::v-deep .el-descriptions-row {
    box-shadow: inset 0px 0px 6px 0px
    rgba(0, 186, 255, 0.73),
    inset 0px -1px 0px 0px
    rgba(40, 82, 124, 0.5) !important;
}
</style>
