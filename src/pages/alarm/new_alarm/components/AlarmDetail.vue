<template>
    <el-drawer :visible.sync="alarmSeeDialog" direction="rtl" :size="1200" :wrapperClosable="false" :before-close="handleClose" title="详情">
        <div class="drawer-content">
            <div style="position: relative;top: 0;left: 0;overflow-y: auto;width: 100%;height: 100%;">
                <div class="ub ub-pj w100">
                    <div class="list-tip">
                        <span style="font-weight: 600;">{{ seeForm.reportName }}</span>
                        <span v-if="seeForm.reportLevel == 0" class="title-level zero">低</span>
                        <span v-if="seeForm.reportLevel == 1" class="title-level one">中低</span>
                        <span v-if="seeForm.reportLevel == 2" class="title-level two">中</span>
                        <span v-if="seeForm.reportLevel == 3" class="title-level three">中高</span>
                        <span v-if="seeForm.reportLevel == 4" class="title-level fore">高</span>

                        <span
                            v-if="seeForm.reportStatus == 0"
                            style="padding: 3px 15px;font-size: 12px;border-radius: 16px;color: #eeb174;background: #fde6d8;line-height: 1;">待确认</span>
                        <span
                            v-if="seeForm.reportStatus == 1"
                            style="padding: 3px 15px;font-size: 12px;border-radius: 16px;color: #3fa87b;background: #ccf6e4;line-height: 1;">已确认</span>
                        <span
                            v-if="seeForm.reportStatus == 2"
                            style="padding: 3px 15px;font-size: 12px;border-radius: 16px;color: #3c7ce2;background: #d5e5fa;line-height: 1;">已处置</span>
                        <span
                            v-if="seeForm.reportStatus == 3"
                            style="padding: 3px 15px;font-size: 12px;border-radius: 16px;color: #aa0202;background: #fad7dd;line-height: 1;">已驳回</span>
                    </div>
                </div>
                <div class="drawer-pad">
                    <el-tabs v-model="activeName">
                        <el-tab-pane label="基本信息" name="first">
                            <BasicInfo :seeForm="seeForm"></BasicInfo>
                        </el-tab-pane>
                        <el-tab-pane label="资产信息" name="three">
                            <AssetInfo :assetsInfo="assetsInfo"></AssetInfo>
                            <div v-if="assetsInfo.ips&&assetsInfo.ips.length>0" type="flex" justify="start"  class="mt-1">
                                <el-table
                                    ref="ipstiple"
                                    class='bigTable'
                                    :data="assetsInfo.ips"
                                    border
                                    stripe
                                    tooltip-effect="dark"
                                    :row-style="{ height: '32px' }"
                                    :header-row-style="{ height: '32px' }">
                                    <el-table-column prop="assetsIp" label="IP">
                                    </el-table-column>
                                    <el-table-column label="端口">
                                        <template slot-scope="scope">
                                            <div v-if="scope.row.ports.length>0">
                                                <span style="margin: 10px;" v-for="(item,index) in scope.row.ports" :key="index">{{item.port}}</span>
                                            </div>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="原始日志" name="four">
                            <Logs ref="logs" :logIds="logIds" :alarmId="alarmId" :tabindex="activeName"></Logs>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </div>
    </el-drawer>
</template>

<script>
import BasicInfo from '@/pages/alarm/seeTabs/BasicInfo'
import AssetInfo from '@/pages/alarm/seeTabs/AssetInfo'
import Logs from '@/pages/alarm/seeTabs/Logs'
export default {
    props: ['seeForm', 'alarmSeeDialog'],
    components: {
        BasicInfo,
        AssetInfo,
        Logs
    },
    data() {
        return {
            activeName: 'first',
            assetsInfo: {},
            logIds: [],
            alarmId: ''
        }
    },
    methods: {
        handleClose() {
            this.$parent.alarmSeeDialog = false
        }
    }
}
</script>

<style lang="scss" scoped>
    $zero: #00bcd4;
    $one: #00c7ff;
    $two: #f2cd00;
    $three: #fc7f00;
    $fore: #fd0001;
    $status1: #ffdd00;
    $status2: #01ff01;
    $status3: #00e1fd;
    $status4: #e1e2e4;
    .list-tip {
        position: relative;
        height: 24px;
        font-size: 14px;
        color: #1c1c1c;
        line-height: 24px;
    }
    .drawer-pad {
        overflow-y: auto;
        // padding: 0 20px;
        height: calc(100% - 53px);
        & ::v-deep img {
            max-width: 600px;
            max-height: 600px;
        }
        &::-webkit-scrollbar, li::-webkit-scrollbar, ul::-webkit-scrollbar {
            width: 4px;
        }
        &::-webkit-scrollbar-track, li::-webkit-scrollbar-track, ul::-webkit-scrollbar-track {
            background: none;
        }
    }
    .drawer-pad ::v-deep .el-form-item__content {
        font-size: 12px;
    }
    .drawer-pad ::v-deep .el-form-item__label {
        font-size: 12px;
        color: #999999!important;
    }
    .title-level {
        margin: 0 5px;
        padding: 2px 10px;
        font-size: 12px;
        border-radius: 3px;
        color: $zero;
        line-height: 1;
        &.one {
            color: $one;
        }
        &.two {
            color: $two;
        }
        &.three {
            color: $three;
        }
        &.fore {
            color: $fore;
        }
    }
    .el-tabs ::v-deep .el-tabs__nav-wrap::after {
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 1;
        width: 100%;
        height: 1px;
        background-color: #e7e7e7;
        content: '';
    }
    .el-tabs ::v-deep .el-tabs__active-bar {
        background: #387dee;
        // margin-left: 14px;
    }
    .el-tabs ::v-deep .el-tabs__item.is-active {
        height: 34px;
        border: none !important;
        color: #387dee;
        box-shadow: none !important;
        line-height: 34px;
    }

</style>
