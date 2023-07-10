<template>
    <div class="event asset overview">
        <div class="w100">
            <div class="event-content w100">
                <div class="ub w100 num-statistic">
                    <div class="ub ub-f1 chart-box bg">
                        <div class="ub ub-f1 ub-ac statistic-item">
                            <div class="ub ub-ver">
                                <div class="text ml-2"><i class="iconfont icon-dengjizichan" style="font-size:14px;color:#8b8b8b;margin-right:5px"></i>登记资产量</div>
                                <div class="num" style="color:#8b8b8b;margin-left:35px">{{assetsStatisticData._djAssetsNum}}<p style="font-size: 24px;display: inline-block;vertical-align: middle;margin-top: -6px">{{assetsStatisticData.djAssetsNum>9999 ? '万': ''}}</p></div>
                            </div>
                            <div class="ub-f1 text-right">
                                <img src="../../assets/img/assets/dengjizichanliang.png">
                            </div>
                        </div>
                    </div>
                    <div class="ub ub-f1 chart-box bg">
                        <div class="ub ub-f1 ub-ac statistic-item">
                            <div class="ub ub-ver">
                                <div class="text ml-2"><i class="iconfont icon-weidengji" style="font-size: 14px;margin-right:5px;color:#f2995f"></i>未登记资产量</div>
                                <div class="num" style="color:#f2995f;margin-left:35px">{{assetsStatisticData._wdjAssetsNum}}<p style="font-size: 24px;display: inline-block;vertical-align: middle;margin-top: -6px">{{assetsStatisticData.wdjAssetsNum>9999 ? '万': ''}}</p></div>
                            </div>
                            <div class="ub-f1 text-right">
                                <img src="../../assets/img/assets/weidengjizichanliang.png">
                            </div>
                        </div>
                    </div>
                    <div class="ub ub-f1 chart-box bg">
                        <div class="ub ub-f1 ub-ac statistic-item">
                            <div class="ub ub-ver">
                                <div class="text ml-2"><i class="iconfont icon-yewuxitong" style="font-size: 14px;margin-right:5px;color:#48c79c"></i>业务系统量</div>
                                <div class="num" style="color:#48c79c;margin-left:35px">{{assetsStatisticData._ywxtNum}}<p style="font-size: 24px;display: inline-block;vertical-align: middle;margin-top: -6px">{{assetsStatisticData.ywxtNum>9999 ? '万': ''}}</p></div>
                            </div>
                            <div class="ub-f1 text-right">
                                <img src="../../assets/img/assets/yewuxitongliang.png">
                            </div>
                        </div>
                    </div>
                    <div class="ub ub-f1 chart-box bg">
                        <div class="ub ub-f1 ub-ac statistic-item">
                            <div class="ub ub-ver">
                                <div class="text ml-2"><i class="iconfont icon-anquanyu" style="font-size: 14px;margin-right:5px;color:#387dee"></i>安全域</div>
                                <div class="num" style="color:#387dee;margin-left:35px">{{assetsStatisticData._aqyNum}}<p style="font-size: 24px;display: inline-block;vertical-align: middle;margin-top: -6px;">{{assetsStatisticData.aqyNum>9999 ? '万': ''}}</p></div>
                            </div>
                            <div class="ub-f1 text-right">
                                <img src="../../assets/img/assets/anquanyu.png">
                            </div>
                        </div>
                    </div>
                </div>
                <div class='ub ub-pj w100' style="margin-top:10px;">
                    <div class="chart-box" style="width:calc(50% - 5px);padding-top:25px;">
                        <div class="ub ub-pj ub-ac w100 chart-top" style="padding:0 10px;box-sizing: border-box;">
                            <div class="title">资产类型分布</div>
                        </div>
                        <div class="ub w100">
                            <div v-loading="assets_type_view_loading" style="width:50%;height:280px">
                                <div v-if="assets_type_view_data" class="ub ub-f1 ub-ac ub-pc" style="height:100%;color:#909399;font-size:16px; cursor: pointer;">
                                    暂无数据
                                </div>
                                <pie :chartData="assetsTypeViewData" v-if="assetsTypeViewData.length>0" type="1" />
                            </div>
                            <div style="width:50%;">
                                <div class="ub ub-ac table-top w100">
                                    <div class="ub ub-ac" style="margin-bottom:5px">
                                        <div class="text">资产总数</div>
                                        <div class="num">{{assetsTypeViewTotalNum}}</div>
                                    </div>
                                </div>
                                <el-table v-loading="assets_type_view_loading" class="drill-table assets-view-table" :data="assetsTypeViewDataTable" style="width: 96%;margin-right:20px;">
                                    <el-table-column type="index" label="序号" width="100">
                                    </el-table-column>
                                    <el-table-column show-overflow-tooltip prop="name" label="资产类型">
                                    </el-table-column>
                                    <el-table-column align="right" prop="value" label="资产数量">
                                    </el-table-column>
                                </el-table>
                                <div class="table-type" @click="asset_fingerprint(assetsTypeViewData)" v-if="assetsTypeViewData.length>7" style="color:rgba(0,0,0,.9);font-size:12px;line-height:40px;text-align: center;cursor: pointer;">更多>></div>
                            </div>
                        </div>
                    </div>
                    <div class="chart-box" style="width: calc(50% - 5px); padding-top:25px;">
                        <div class="ub ub-pj ub-ac w100 chart-top" style="padding:0 10px;box-sizing: border-box;">
                            <div class="title">{{zone_assets_zw_type==0?'安全域资产分布':'业务系统资产'}}</div>
                            <div class="ub ub-f1 ub-ac ub-pe" style="padding-right:5px;cursor: pointer;">
                                <div><i style="font-size:13px;color:#0052d9;" class="el-icon-refresh"></i></div>
                                <div class="table-type" @click="initAssetsZWTypeZone(0)" v-if="zone_assets_zw_type==1" style="font-size:12px;color:rgba(0,0,0,.9);line-height: 12px;margin-left: 5px;">安全域资产分布</div>
                                <div class="table-type" @click="initAssetsZWTypeZone(1)" v-if="zone_assets_zw_type==0" style="font-size:12px;color:rgba(0,0,0,.9);line-height: 12px;margin-left: 5px;">业务系统资产</div>
                            </div>
                        </div>
                        <div class="ub w100">
                            <div v-loading="zone_assets_type_view_loading" style="width:50%;height:280px" :class="{'h320':assetsTypeViewDataZone.length>4}">
                                <div v-if="zone_assets_type_view_data" class="ub ub-f1 ub-ac ub-pc" style="height:100%;color:#909399;font-size:16px; cursor: pointer;">
                                    暂无数据
                                </div>
                                <pie :chartData="assetsTypeViewDataZone" v-if="assetsTypeViewDataZone.length>0" type="2" />
                            </div>
                            <div style="width:50%;">
                                <div class="ub ub-ac table-top w100">
                                    <div class="ub ub-ac" style="margin-bottom:5px">
                                        <div v-if="zone_assets_zw_type==0" class="text">安全域资产总数</div>
                                        <div v-else class="text">业务系统资产总数</div>
                                        <div class="num">{{assetsTypeViewTotalNumZone}}</div>
                                    </div>
                                </div>
                                <el-table v-loading="zone_assets_type_view_loading" class="drill-table assets-view-table" :data="assetsTypeViewDataTableZone" style="width: 96%;margin-right:20px;">
                                    <el-table-column type="index" label="序号" width="100">
                                    </el-table-column>
                                    <el-table-column show-overflow-tooltip prop="name" :label="zone_assets_zw_type==0?'安全域名称':'业务系统名称'">
                                    </el-table-column>
                                    <el-table-column align="right" prop="value" :label="zone_assets_zw_type==0?'安全域数量':'业务系统数量'">
                                    </el-table-column>
                                </el-table>
                                <div class="table-type" @click="asset_zone(assetsTypeViewDataZone)" v-if="assetsTypeViewDataZone.length>7" style="color:rgba(0,0,0,.9);font-size:12px;line-height:40px;text-align: center;cursor: pointer;">更多>></div>
                            </div>
                        </div>

                    </div>
                </div>
                <div class="w100" style="margin-top:10px;">
                    <div class="chart-box border" style="width:100%;padding-top:40px;">
                        <div class="ub ub-pj ub-ac w100 chart-top" style="padding:0 10px;box-sizing: border-box;">
                            <div class="title">{{loop_assets_zw_type==0?'漏洞资产TOP10':'情报资产TOP10'}}</div>
                            <div class="ub ub-f1 ub-ac ub-pe" style="padding-right:5px;cursor: pointer;">
                                <div><i style="font-size:13px;color:#0052d9;" class="el-icon-refresh"></i></div>
                                <div class="table-type" @click="loop_initAssetsZWType(0)" v-if="loop_assets_zw_type==1" style="font-size:12px;color:rgba(0,0,0,.9);line-height: 12px;margin-left: 5px;">漏洞资产TOP10</div>
                                <div class="table-type" @click="loop_initAssetsZWType(1)" v-if="loop_assets_zw_type==0" style="font-size:12px;color:rgba(0,0,0,.9);line-height: 12px;margin-left: 5px;">情报资产TOP10</div>
                            </div>
                        </div>
                        <div class="ub w100">
                            <div v-loading="loop_assets_type_view_loading" style="width:67%;height:320px;margin-right:3%">
                                <div v-if="loop_assets_type_view_data" class="ub ub-f1 ub-ac ub-pc" style="height:100%;color:#909399;font-size:16px; cursor: pointer;">
                                    暂无数据
                                </div>
                                <bar :chartData="loop_assetsTypeViewData" v-if="loop_assetsTypeViewData.length>0" type="1" name="漏洞数量"/>
                            </div>
                            <div style="width:30%;">
                                <el-table v-loading="loop_assets_type_view_loading" class="drill-table assets-view-table" :data="loop_assetsTypeViewDataTable" style="width: 96%;margin-right:20px;">
                                    <el-table-column type="index" label="序号" width="100">
                                    </el-table-column>
                                    <el-table-column show-overflow-tooltip align="center" prop="name" label="资产名称">
                                    </el-table-column>
                                    <el-table-column align="right" prop="value" label="漏洞数量">
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="w100 mb-1" style="margin-top:10px;">
                    <div class="chart-box border" style="width:100%;padding-top:40px;">
                        <div class="ub ub-pj ub-ac w100 chart-top" style="padding:0 10px;box-sizing: border-box;">
                            <div class="title">{{alarm_assets_zw_type==0?'事件资产TOP10':'漏洞指纹'}}</div>
                        </div>
                        <div class="ub w100">
                            <div v-loading="alarm_assets_type_view_loading" style="width:67%;height:320px;margin-right:3%">
                                <div v-if="alarm_assets_type_view_data" class="ub ub-f1 ub-ac ub-pc" style="height:100%;color:#909399;font-size:16px; cursor: pointer;">
                                    暂无数据
                                </div>
                                <bar :chartData="alarm_assetsTypeViewData" v-if="alarm_assetsTypeViewData.length>0" type="2" name="事件数量" />
                            </div>
                            <div style="width:30%;">
                                <el-table v-loading="alarm_assets_type_view_loading" class="drill-table assets-view-table" :data="alarm_assetsTypeViewDataTable" style="width: 96%;margin-right:20px;">
                                    <el-table-column type="index" label="序号" width="100">
                                    </el-table-column>
                                    <el-table-column show-overflow-tooltip align="center" prop="name" label="资产名称">
                                    </el-table-column>
                                    <el-table-column align="right" prop="value" label="事件数量">
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
        <el-dialog :title="assets_zw_type==0?'资产类型分布':'指纹类别'" :visible.sync="asset_fimgt_dialog"  width="700px" custom-class="common-dialog">
            <div style="max-height: 600px;overflow-y: auto;">
                <el-table class="drill-table" :data="assetsTypeViewDataTable_more" style="width: 96%;margin: 0 auto;">
                    <el-table-column type="index" label="序号" width="100">
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="name" :label="assets_zw_type==0?'资产类型':'指纹类别'">
                    </el-table-column>
                    <el-table-column align="right" prop="value" :label="assets_zw_type==0?'资产数量':'指纹数量'">
                    </el-table-column>
                </el-table>
            </div>
        </el-dialog>
        <el-dialog :title="zone_assets_zw_type==0?'安全域资产分布':'业务系统资产'" :visible.sync="asset_zone_dialog" width="700px" custom-class="common-dialog">
            <div style="max-height: 600px;overflow-y: auto;">
                <el-table class="drill-table" :data="assetsTypeViewDataTableZone_more" style="width: 96%;margin: 0 auto;">
                    <el-table-column type="index" label="序号" width="100">
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="name" :label="zone_assets_zw_type==0?'安全域名称':'业务系统名称'">
                    </el-table-column>
                    <el-table-column align="right" prop="value" :label="zone_assets_zw_type==0?'安全域数量':'业务系统数量'">
                    </el-table-column>
                </el-table>
            </div>
        </el-dialog>
    </div>

</template>

<script>
import {
    getAssetsStatistic,
    get_tuoputu,
    getAssetsZWType,
    getAssetsZWTypeZone,
    getLoopAssets,
    getAlarmAssets
} from '../../server/assets/overview.js'
import pie from './charts/pie.vue'
import bar from './charts/bar.vue'
export default {
    name: 'Overview',
    components: {
        pie,
        bar
    },
    data() {
        return {
            assetsStatisticData: {
                zwNum: 0,
                djAssetsNum: 0,
                aqyNum: 0,
                wdjAssetsNum: 0,
                ywxtNum: 0,

                _zwNum: 0,
                _djAssetsNum: 0,
                _aqyNum: 0,
                _wdjAssetsNum: 0,
                _ywxtNum: 0
            },
            imageSize: 100,
            url: '',
            // srcList: [],
            // 资产类型 指纹
            asset_fimgt_dialog: false,
            assetsTypeViewDataTable_more: [],
            assets_zw_type: 0,
            assetsTypeViewTotalNum: 0,
            assetsTypeViewData: [],
            assetsTypeViewDataTable: [],
            assets_type_view_loading: true,
            assets_type_view_data: true,
            // 安全域业务系统
            asset_zone_dialog: false,
            assetsTypeViewDataTableZone_more: [],
            zone_assets_zw_type: 0,
            assetsTypeViewTotalNumZone: 0,
            assetsTypeViewDataZone: [],
            assetsTypeViewDataTableZone: [],
            zone_assets_type_view_loading: true,
            zone_assets_type_view_data: true,
            // 漏洞或情报资产统计
            loop_assets_zw_type: 0,
            loop_assetsTypeViewTotalNum: 0,
            loop_assetsTypeViewData: [],
            loop_assetsTypeViewDataTable: [],
            loop_assets_type_view_loading: true,
            loop_assets_type_view_data: true,
            // 事件资产top10
            alarm_assets_zw_type: 0,
            alarm_assetsTypeViewTotalNum: 0,
            alarm_assetsTypeViewData: [],
            alarm_assetsTypeViewDataTable: [],
            alarm_assets_type_view_loading: true,
            alarm_assets_type_view_data: true
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.initDrillStatistic()
            this.initAssetsZWType(this.assets_zw_type)
            this.initAssetsZWTypeZone(this.zone_assets_zw_type)
            this.loop_initAssetsZWType(this.loop_assets_zw_type)
            this.alarm_initAssetsZWType(this.alarm_assets_zw_type)
        })
    },
    methods: {
        asset_zone(assetsTypeViewDataZone) {
            this.asset_zone_dialog = true
            this.assetsTypeViewDataTableZone_more = this.$deepCopy(assetsTypeViewDataZone)
        },
        asset_fingerprint(assetsTypeViewDataTable) {
            this.asset_fimgt_dialog = true
            this.assetsTypeViewDataTable_more = this.$deepCopy(assetsTypeViewDataTable)
        },
        initDrillStatistic() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            getAssetsStatistic(data).then(res => {
                console.log('演练统计', res)
                this.assetsStatisticData = res

                this.assetsStatisticData._zwNum = this.$numChange((res.zwNum ? res.zwNum : 0))
                this.assetsStatisticData._djAssetsNum = this.$numChange((res.djAssetsNum ? res.djAssetsNum : 0))
                this.assetsStatisticData._aqyNum = this.$numChange((res.aqyNum ? res.aqyNum : 0))
                this.assetsStatisticData._wdjAssetsNum = this.$numChange((res.wdjAssetsNum ? res.wdjAssetsNum : 0))
                this.assetsStatisticData._ywxtNum = this.$numChange((res.ywxtNum ? res.ywxtNum : 0))
            }).catch(error => {
                console.log('error' + error)
            })
        },
        initAssetsZWType(type) {
            this.assets_zw_type = type
            this.assetsTypeViewTotalNum = 0
            this.assets_type_view_loading = true
            this.assets_type_view_data = true
            this.assetsTypeViewData = []
            this.assetsTypeViewDataTable = []
            let data = {
                queryData: {},
                paramsData: {
                    type: type
                }
            }
            getAssetsZWType(data).then(res => {
                console.log('资产类型指纹类型统计', res)
                this.assets_type_view_loading = false
                if (res.length > 0) {
                    this.assets_type_view_data = false
                    res.sort((pre, next) => {
                        return next.num - pre.num
                    })
                    res.forEach((item, index) => {
                        let obj = {}
                        obj.name = item.name
                        obj.value = item.num
                        this.assetsTypeViewTotalNum += item.num
                        this.assetsTypeViewData.push(obj)
                        if (index <= 6) {
                            this.assetsTypeViewDataTable.push(obj)
                        }
                    })
                }
            }).catch(error => {
                this.assets_type_view_loading = false
                console.log('error' + error)
            })
        },
        initAssetsZWTypeZone(type) {
            this.zone_assets_zw_type = type
            this.assetsTypeViewTotalNumZone = 0
            this.zone_assets_type_view_loading = true
            this.zone_assets_type_view_data = true
            this.assetsTypeViewDataZone = []
            this.assetsTypeViewDataTableZone = []
            let data = {
                queryData: {},
                paramsData: {
                    type: type
                }
            }
            getAssetsZWTypeZone(data).then(res => {
                console.log('安全域业务系统', res)
                this.zone_assets_type_view_loading = false
                if (res.length > 0) {
                    this.zone_assets_type_view_data = false
                    res.forEach((item, index) => {
                        let obj = {}
                        obj.name = type == 0 ? item.zoneName : item.systemName
                        obj.value = item.num
                        this.assetsTypeViewTotalNumZone += item.num
                        this.assetsTypeViewDataZone.push(obj)
                        if (index <= 6) {
                            this.assetsTypeViewDataTableZone.push(obj)
                        }
                    })
                }
            }).catch(error => {
                this.zone_assets_type_view_loading = false
                console.log('error' + error)
            })
        },
        loop_initAssetsZWType(type) {
            this.loop_assets_zw_type = type
            this.loop_assetsTypeViewTotalNum = 0
            this.loop_assets_type_view_loading = true
            this.loop_assets_type_view_data = true
            this.loop_assetsTypeViewData = []
            this.loop_assetsTypeViewDataTable = []
            let data = {
                queryData: {},
                paramsData: {
                    type: type
                }
            }
            getLoopAssets(data).then(res => {
                console.log('漏洞情报资产', res)
                this.loop_assets_type_view_loading = false
                if (res.length > 0) {
                    this.loop_assets_type_view_data = false
                    res.forEach((item, index) => {
                        let obj = {}
                        obj.name = item.deviceName
                        obj.value = item.num
                        this.loop_assetsTypeViewData.push(obj)
                        this.loop_assetsTypeViewDataTable.push(obj)
                    })
                }
            }).catch(error => {
                this.loop_assets_type_view_loading = false
                console.log('error' + error)
            })
        },
        alarm_initAssetsZWType(type) {
            this.alarm_assets_zw_type = type
            this.alarm_assetsTypeViewTotalNum = 0
            this.alarm_assets_type_view_loading = true
            this.alarm_assets_type_view_data = true
            this.alarm_assetsTypeViewData = []
            this.alarm_assetsTypeViewDataTable = []
            let data = {
                queryData: {},
                paramsData: {}
            }
            getAlarmAssets(data).then(res => {
                console.log('事件资产TOP10', res)
                this.alarm_assets_type_view_loading = false
                if (res.length > 0) {
                    this.alarm_assets_type_view_data = false
                    res.forEach((item, index) => {
                        let obj = {}
                        obj.name = item.deviceName
                        obj.value = item.num
                        this.alarm_assetsTypeViewData.push(obj)
                        this.alarm_assetsTypeViewDataTable.push(obj)
                    })
                }
            }).catch(error => {
                this.alarm_assets_type_view_loading = false
                console.log('error' + error)
            })
        }

    }
}
</script>

<style lang="scss" scoped>

    $zero: #7efcfb;
    $one: #00c7ff;
    $two: #fdfe7f;
    $three: #fc7f00;
    $fore: #fd0001;
    $status1:#ffdd00;
    $status2:#01ff01;
    $status3:#00e1fd;
    $status4:#e1e2e4;
    .num-statistic>div {
        height: 80px;
        margin-right: 10px;
    }
    .num-statistic>div:last-child {
        margin-right: 0px;
    }
    .chart-box {
        background:#fff;
        border-radius:4px;
        position: relative;
        span {
            position: absolute;
            left: -1px;
            top: -1px;
            width: 10px;
            height: 10px;
            background: url('/static/img/icon-jiao.png') no-repeat;
            &.angle2 {
                left: auto;
                right: -1px;
                transform: rotate(90deg);
            }
            &.angle3 {
                left: auto;
                right: -1px;
                top: auto;
                bottom: -1px;
                transform: rotate(180deg);
            }
            &.angle4 {
                top: auto;
                bottom: -1px;
                transform: rotate(270deg);
            }
        }
    }
    .num-statistic .chart-box {
        width: 1%;
    }
    .chart-box .image {
        width: 100%;
        height: 100%;
        background-position: center;
        background-repeat: no-repeat;
    }
    .chart-box .options {
        width: 50px;
        position: absolute;
        right: 0;
        bottom: 0;
    }
    .chart-box .options div {
        width: 30px;
        height: 30px;
        cursor: pointer;
        i {
            font-size: 20px;
            color: #00CFFB;
        }
    }
    .statistic-item{
        background:#fff;
        border-radius:4px;
    }
    .statistic-item>.icon {
        font-size: 0px;
        margin-right: 15px;
        margin-left: 15px;
        i {
            font-size: 30px;
            color: #00FE00;
        }
    }
    .statistic-item .text {
        font-size: 12px;
        color: rgba(0,0,0,.9);
    }
    .statistic-item .num {
        margin-top: 8px;
        font-size: 20px;
        color: #fff;
    }
    .table-top .text {
        font-size: 12px;
        margin-right:5px;
        color: rgba(0,0,0,.9);
    }
    .table-top .num {
        font-size: 20px;
        color: #387dee;
    }
    .chart-top {
        position: absolute;
        left: 0;
        top: 0;
        height: 30px;
        .title {
            font-size: 14px;
            color: rgba(0, 0, 0, 0.9);
        }
        .defense-title {
            text-shadow: 0px 0px 6px #98370a, 0px 0px 6px #98370a;
        }
        .options {
            font-size: 0;
        }
        .options>div {
            display: inline-block;
            padding: 0 8px;
            color: #666;
            font-size: 12px;
            cursor: pointer;
        }
        .options>div.active {
            color: #fff;
        }
    }
    .title-level {
        border: 1px solid $zero;
        background: rgba($zero, .2);
        color: $zero;
        font-size: 12px;
        border-radius: 3px;
        line-height: 1;
        padding: 2px 10px;
        margin: 0 5px;
        &.one {
            border-color: $one;
            background: rgba($one, .2);
            color: $one;
        }
        &.two {
            border-color: $two;
            background: rgba($two, .2);
            color: $two;
        }
        &.three {
            border-color: $three;
            background: rgba($three, .2);
            color: $three;
        }
        &.fore {
            border-color: $fore;
            background: rgba($fore, .2);
            color: $fore;
        }
    }
    .title-status {
        border: 1px solid $status1;
        background: $status1;
        color: #fff;
        font-size: 12px;
        border-radius: 3px;
        line-height: 1;
        padding: 2px 10px;
        &.one {
            border-color: $status2;
            background: $status2;
        }
        &.two {
            border-color: $status3;
            background: $status3;
        }
        &.three {
            border-color: $status4;
            background: $status4;
        }
        .chart-title {
            margin: 20px 0 20px 20px;
        }
    }
    .text-color {
        color: #fff;
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
        height: calc(100% - 53px);
        overflow-y: auto;
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
    .event ::v-deep .el-range-input {
        background-color: rgba(0, 0, 0, 0);
        color: #fff;
    }
    .event ::v-deep .el-range-separator {
        color: #fff;
    }
    .event ::v-deep .el-radio__label,
    .event ::v-deep .el-checkbox__label {
        color: #fff;
    }
    .bigTable {
        ::v-deep .caret-wrapper {
            height: 22px;
        }
        ::v-deep .sort-caret.ascending {
            border-bottom-color: #fff;
            top: 0;
        }
        ::v-deep .sort-caret.descending {
            border-top-color: #fff;
            bottom: 0;
        }
        ::v-deep .descending .sort-caret.descending {
            border-top-color: #01fdfe;
        }
        ::v-deep .ascending .sort-caret.ascending {
            border-bottom-color: #01fdfe;
        }
    }
    .div-table {
        color: #fff;
        border: 1px solid #1a5c92;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        .table-title {
            line-height: 48px;
            padding: 0 30px;
            border-bottom: 1px solid #1a5c92;
            background: rgba(29, 65, 105, 0.5);
        }
        dl {
            position: relative;
            line-height: 46px;
            height: 46px;
            background: rgba(3, 50, 84, 0.5);
            box-shadow: 0 0 3px rgba(0, 186, 255, .73) inset;
            border-bottom: 1px solid #1a5c92;
            dt {
                position: absolute;
                width: 50%;
                padding: 0 30px;
                border-right: 1px solid #1a5c92;
                box-sizing: border-box;
            }
            dd {
                padding-left: calc(50% + 30px);
            }
            &:nth-child(2n+1) {
                background: rgba(29, 65, 105, 0.5);
            }
        }
    }
    .search-box {
        margin: 60px 0 20px;
    }
    .chart-row {
        position: relative;
        padding-left: 380px;
        .chart-left {
            position: absolute;
            left: 0;
            top: 0;
            width: 340px;
        }
    }
    .statistic-item>.icon i.color1,
    .statistic-item .color1 {
        color: #ca86fe;
    }
    .statistic-item>.icon i.color2,
    .statistic-item .color2 {
        color: #d03979;
    }
    .statistic-item>.icon i.color3,
    .statistic-item .color3 {
        color: #f5cb05;
    }
    .statistic-item>.icon i.color4,
    .statistic-item .color4 {
        color: #01f406;
    }
    .statistic-item>.icon i.color5,
    .statistic-item .color5 {
        color: #00e1ff;
    }
    .assets-big-image ::v-deep .el-image-viewer__close {
        color: #00E1FF!important;
    }
    .h320 {
        height: 320px!important;
    }
    </style>
    <style>
    .drill-table {
        background: rgba(0, 0, 0, 0)!important;
        min-height: 0!important;
    }
    .drill-table th,
    .drill-table tr {
        background: rgba(0, 0, 0, 0)!important;
    }
    .asset.overview .drill-table td,
    .asset.overview .drill-table th.is-leaf {
        border-color: #343537;
        color: rgba(0,0,0,.9);
    }
    .drill-table.el-table--enable-row-hover .el-table__body tr:hover>td {
        background: rgba(0, 0, 0, 0)!important;
    }
    .drill-table .cell {
        color: rgba(0,0,0,.9);
    }
    .overview th .cell {
        color: #0052d9;
    }
    .assets-view-table td,
    .assets-view-table th {
        padding: 2px 0!important;
        line-height: 18px!important;
        font-size: 12px!important;
    }
    .el-image__error,
    .el-image__placeholder {
        background: none!important;
    }
</style>
