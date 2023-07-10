<template>
    <div class="list" style="min-height:100%;">
        <div class="w100" style="box-sizing: border-box;min-height: 100%">
            <div class="event-content w100" style="background:#fff;position: relative;overflow-y:auto"  :style="{'height':tabHeight+'px'}">
                <div class="ub ub-pj w100 ub-ac" style="padding:10px">
                    <div  style="color:rgba(0,0,0,0.9);font-size:14px">
                        演练复盘
                    </div>
                    <div>
                        <el-button size="small" @click="back">返回</el-button>
                    </div>
                </div>
                <div class="time-line1" style="width:99%;margin:0 0.5%;margin-bottom:30px">
                    <div class="top-title">
                        <div id="main" style="position:absolute;width: 100%;left:0;top:51px;bottom:0;"></div>
                    </div>
                    <div class="center-content">
                        <div class="left-show" style="min-height: 700px">
                            <div style="position: relative;min-height: 100px;margin-bottom: 40px">
                                <div class="right-top1" ref="roght_top1">
                                    <div class="right-tips">
                                        <div>
                                            <div class="tips-title">步骤列表</div>
                                            <el-table
                                                :data="tableData"
                                                style="width: 100%;min-height: 100px;"
                                                ref="multipleTable"
                                                class='bigTable'>
                                                <el-table-column align="center" type="index" label="" width="30">
                                                </el-table-column>
                                                <el-table-column prop="attackModeCN" label="攻击方式">
                                                </el-table-column>
                                                <el-table-column prop="defenseInfo" label="防御情况">
                                                    <template slot-scope="{row}">
                                                        <span v-if="row.defenseInfo.isFind === 0" style="color:red">未发现</span>
                                                        <span v-if="row.defenseInfo.isFind === 1 && row.defenseInfo.isDispose === 0" style="color:orange">未处置</span>
                                                        <span v-if="row.defenseInfo.isFind === 1 && row.defenseInfo.isDispose === 1" style="color: greenyellow">已处置</span>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column prop="attackTime" label="攻击时间" width="160">
                                                </el-table-column>
                                                <el-table-column label="操作" align="center" width="60">
                                                    <template slot-scope="scope">
                                                        <opt-btn @click="sliceData(scope.row.index)" title="回放" icon="iconfont icon-huifang"></opt-btn>
                                                    </template>
                                                </el-table-column>
                                            </el-table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="chainArea" style="font-size:0;padding:0px 0 0 20px">
                                <div class="ub ub-ac w100 link-item">
                                    <div class="start">
                                        <div class="start-img"></div>
                                        <div class="start-text">
                                            <span style="color: #0052D9;;padding:0px 4px;border-radius:2px;font-size:10px;">{{singleData.isAddCN}}</span>
                                        </div>
                                    </div>
                                    <div class="ub ub-ac ub-pc ub-ver step" v-for="(step,_index) in singleData.link" :key="_index" :class="{'lastStepOne':true}">
                                        <div @mouseover="overIn($event,step)" @mouseleave="overOut($event,step)" class="device" :class="{'alarm':step.defenseInfo.isDispose==0}"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="detailShow" ref="showBox" class="device-detail-box ub ub-pj" :style="detailStyle()">
            <div class="box first text-right" style="padding-right:5px">
                <div style="font-size:16px;color:#387DEE;margin-top:10px;">{{detatilInfo.attackModeCN}}</div>
                <div style="font-size:12px;color:#DE7400;margin-top:5px;">攻击路径：{{detatilInfo.path}}</div>
                <div style="font-size:12px;color:#000000;margin-top:5px;">{{detatilInfo.attackTime}}</div>
            </div>
            <div class="box second" style="padding-left:5px">
                <div style="font-size:16px;color:#E34D59;margin-top:10px;">{{detatilInfo.defenseInfo.isFindCN}}</div>
                <div style="font-size:12px;color:#DE7400;margin-top:5px;">攻击路径：{{detatilInfo.path}}</div>
                <div style="font-size:12px;color:#000000;margin-top:5px;">{{detatilInfo.attackTime}}</div>
            </div>
        </div>
    </div>

</template>

<script>
import options from './tp_options'
import {
    get_link
} from '../../server/defense_drill/defense.js'
export default {
    name: 'ReplayLinkPicture',
    components: {
    },
    data() {
        return {
            tabHeight: document.body.clientHeight - 90,
            detatilInfo: {
                attackTime: '',
                attackModeCN: '',
                path: '',
                gain: '',
                opinion: '',
                linkData: [],
                defenseInfo: {
                    isFindCN: ''
                }
            },
            detail_left: 0,
            detail_top: 0,
            detailShow: false,
            singleData: {
                attackIp: '',
                isAddCN: '',
                link: []
            },
            isSingle: false,
            list: [],

            id: '',
            tableData: [],
            records: [],
            type: ''
        }
    },

    mounted() {
        this.$nextTick(() => {
            this.id = this.$route.query.id
            console.log(this.id)
            if (!this.id) {
                this.id = this.$getsessionStorage('linkData').id
                // console.log(this.id)
            }
            this.initLink()
            // eslint-disable-next-line no-undef
            this.chart = echarts.init(document.getElementById('main'))
            this.chart.setOption(options({}))
        })
    },
    methods: {

        back() {
            this.$router.go(-1)
        },
        overIn(e, device) {
            console.log('e', e)
            this.detailShow = true
            this.detail_left = e.pageX - 260
            this.$nextTick(() => {
                let h = this.$refs.showBox.clientHeight
                this.detail_top = e.pageY - h - 150
            })

            this.detatilInfo = {
                attackTime: device.attackTime,
                attackModeCN: device.attackModeCN,
                path: device.path,
                defenseInfo: device.defenseInfo,
                gain: device.gain,
                opinion: device.opinion
            }
            console.log('device', device)
        },
        overOut(e, device) {
            console.log('e', e)
            this.detailShow = false
        },
        detailStyle() {
            console.log(this.detail_left)
            return {
                position: 'absolute',
                left: this.detail_left + 'px',
                top: this.detail_top + 'px'
            }
        },
        sliceData(index) {
            let data = JSON.parse(JSON.stringify(this.linkData))
            this.singleData.link = data.slice(0, index + 1)
        },
        initLink() {
            let data = {
                id: this.id
            }
            get_link(data).then(res => {
                this.singleData.attackIp = res.attackIp
                this.singleData.link = res.link
                this.singleData.isAddCN = res.isAddCN
                console.log(res)
                let list = this.linkData = res.link
                if (list.length > 0) {
                    list.forEach((item, index) => {
                        let obj = {}
                        obj.path = item.path
                        obj.attackTime = item.attackTime
                        obj.attackModeCN = item.attackModeCN
                        obj.attackMode = item.attackMode
                        obj.defenseInfo = item.defenseInfo
                        obj.index = index
                        this.tableData.push(obj)
                    })
                }
            }).catch(err => {
                console.log(err + 'err')
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .event {
        /*padding: 0px 20px 20px 0px;*/
        box-sizing: border-box;
        position: relative;
    }
    .event-content:before {
        // background-image: url(../../assets/img/right_top_icon.png);
    }
    .time-line1{
        border-radius: 4px;
        background: rgba(51,51,51,0.02);
        border: 1px solid rgba(221,221,221,1);
    }

    .top-title {
        display: flex;
        justify-content: center;
        color: #9f9f9f;
        height: 20px;
        line-height: 20px;
        background: rgba(51,51,51,0.02);
        border-bottom:1px solid rgba(221,221,221,1);
    }
    .top-title span {
        margin: 0 10px;
    }

    .center-content {
        overflow: auto;
    }

    .left-show {
        position: relative;
    }

    .right-top1 {
        float: right;
        margin: 20px 20px;
        width: 440px;
    }

    .right-item{
        width:450px;
        height:192px;
        position: absolute;
        top:60%;
        right:-100%;

    }
    .list-con{
        width:87%;
        height:95%;
        padding-left:10px;
        box-sizing: border-box;
    }

    .right-tips{
        width:100%;
        position: relative;
        padding:10px;
        box-sizing: border-box;
        background: #FFFFFF;
        border: 1px solid rgba(221,221,221,1);
        border-radius: 10px;
        min-height:200px;
    }
    .tips-title{
        font-size: 16px;
        color: #000000;
        font-weight: 700;
    }
    .tips-text {
        color: #fff;
        font-size: 13px;
        margin: 5px 0;;

        span {
            color: #01c3de;
        }
    }
    .start {
        width:60px;
    }
    .start .start-img{
        width:100%;
        height:60px;
        background-image:url("../../assets/img/Malicious_IP.png");
        background-position: center;
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }
    .start .start-text{
        width:100%;
        font-size:12px;
        color:#fff;
        margin-top:5px;
        text-align: center;
        cursor: pointer;
    }
    .step{
        width:100px;
        min-height: 20px;
        border-left:2px solid rgba(0,0,0,0);
        border-right:2px solid rgba(0,0,0,0);
        padding:20px 0;
        margin: 0 20px;
    }
    .step.moreOne{
        border-left:2px solid #D2D2D7;
        border-right:2px solid #D2D2D7;
        /*border:2px solid #D2D2D7;*/
    }
    .step.moreOne>div:nth-child(1){
        position: absolute;
        top: 0;
        left:50%;
        transform: translate(-50%,-50%);
    }
    .step.moreOne>div:last-child{
        position: absolute;
        bottom: 0;
        left:50%;
        transform: translate(-50%,50%);
    }
    .step::before{
        box-sizing:inherit;
        content: '';
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: -22px;
        border-top: 2px solid #D2D2D7;
        width: 22px;
    }
    .step::after{
        box-sizing:inherit;
        content: '';
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: -22px;
        border-top: 2px solid #D2D2D7;
        width: 22px;
    }
    .link-item .step:last-child::after{
        width: 0px;
    }
    .step .device{
        width:60px;
        height:60px;
        cursor: pointer;
        position: relative;
        background-image:url("../../assets/img/SB_Success.png");
        background-position:right top;
        background-repeat: no-repeat;
        background-size:80% 80%;
    }
    .step .device.alarm{
        background-image:url("../../assets/img/SB_fail.png");
    }
    .step .device::before{
        box-sizing:inherit;
        content: '';
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: -20px;
        border-top: 2px solid #D2D2D7;
        width: 20px;
    }
    .step .device::after{
        box-sizing:inherit;
        content: '';
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: -20px;
        border-top: 2px solid #D2D2D7;
        width: 20px;
    }
    .step.moreOne>div:nth-child(1)::before,.step.moreOne>div:nth-child(1)::after{
        width: 20px;
    }
    .step.moreOne>div:last-child::before,.step.moreOne>div:last-child::after{
        width: 20px;
    }
    .link-item .step:last-child.lastStepOne .device::after{
        width: 0px;
    }
    .device-detail-box{
        width:410px;
        height:90px;
        .box{
            width:200px;
            height:90px;
            border-radius: 4px;
        }
        .first{
                background: #EBF1F5;
            }
        .second{
            background: #F5EBEB;
        }
    }
    .bottomBox {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
</style>

