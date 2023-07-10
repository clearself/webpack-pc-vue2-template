<template>
    <dv-full-screen-container class="full-screen">
        <!--<img style="width:296px;position:fixed;z-index:2000;left:50%;margin-left:-148px;top:20px;" src="../assets/img/title.png"
             alt="">-->
        <div class="ub ub-pc title">大厅坐席</div>
        <div class="ub ub-pj entrance-top">
            <div style="padding-top:16px;">{{dateTime+'&nbsp;&nbsp;&nbsp;'}}{{hourMinute+'&nbsp;&nbsp;&nbsp;'}}{{week}}</div>
        </div>
        <div class="ub exit" style="padding-top:16px; position: absolute;top:0;right:20px;z-index: 1000;color:#fff;">
            <div>您好，{{userInfo.cnName}}</div>
            <!--<div style="margin-left: 10px;font-size:16px">
                    <i class="iconfont icon-xiugaimima"></i>
                </div>-->
            <!--<div style="margin-left: 10px;font-size:16px;cursor: pointer;" @click="changePasswordDialog = true">修改密码</div>
                <div style="margin-left: 10px;font-size:16px;cursor: pointer;" @click="exit">退 出</div>-->
        </div>
        <div class="ub ub-pj statistic-box">
            <div class="ub ub-pj left" style="width:30%;">
                <div class="ub ub-ac ub-f1 ub-ver">
                    <div class="num">
                        <dv-digital-flop :config="configNum1" style="width:100%;height:100%;" />
                        <!--{{statistics[0].num}}-->
                    </div>
                    <div v-if="statistics.length>0" class="num-desc">{{statistics[0].name}}</div>
                </div>
                <div class="ub ub-ac ub-f1 ub-ver">
                    <div class="num">
                        <dv-digital-flop :config="configNum2" style="width:100%;height:100%;" />
                    </div>
                    <div v-if="statistics.length>0" class="num-desc">{{statistics[1].name}}</div>
                </div>
            </div>
            <div class="ub ub-pj left" style="width:30%;">
                <div class="ub ub-ac ub-f1 ub-ver">
                    <div class="num">
                        <dv-digital-flop :config="configNum3" style="width:100%;height:100%;" />
                    </div>
                    <div v-if="statistics.length>0" class="num-desc">{{statistics[2].name}}</div>
                </div>
                <div class="ub ub-ac ub-f1 ub-ver">
                    <div class="num">
                        <dv-digital-flop :config="configNum4" style="width:100%;height:100%;" />
                    </div>
                    <div v-if="statistics.length>0" class="num-desc">{{statistics[3].name}}</div>
                </div>
            </div>
        </div>
        <div class='top-bg'></div>
        <div class="ub ub-ac ub-pc region">
            <div class="reject-wrapper">
                <div class="reject-box">
                    <div class="col">
                        <div v-for="(item,index) in cols" :class="{small:cols.length <= 10,middle:cols.length >10 && cols.length <= 30, big: cols.length >=30 }" :key="index">{{index+1}}</div>
                    </div>
                    <div class="row">
                        <div v-for="(item,index) in rows" :class="{small:cols.length <= 10,middle:cols.length >10 && cols.length <= 30, big: cols.length >=30 }" :key="index">{{index+1}}</div>
                    </div>
                    <reject v-for="(item,index) in list" :key="index"  :list="item"></reject>

                </div>
            </div>
            <!--<div class="reject-wrapper">
                        <div class="reject-box">
                            <div class="col">
                                <div v-for="(item,index) in cols" :key="index">{{index+1}}</div>
                            </div>
                            <div class="row">
                                <div v-for="(item,index) in rows" :key="index">{{index+1}}</div>
                            </div>
                            <reject v-for="(item,index) in list" :key="index"  :list="item"></reject>
                        </div>
                </div>-->
        </div>
        <div class="seat-list">
            <div class="seat-title">坐席列表</div>
            <div class="seat-team">
                <div v-for="(item,index) in teams" :key="index">
                    <i :style="{backgroundColor:item.color}"></i>
                    <div>{{item.name}}</div>
                </div>

            </div>
        </div>
    </dv-full-screen-container>
</template>

<script>
import {
    get_screen_data,
    get_screen_teams,
    get_screen_static
} from '../../server/protect_net/api.js'
import Reject from './screenReject'
export default {
    name: 'LargeScreen',
    components: {
        Reject
    },
    data() {
        return {
            configNum1: {
                number: [0],
                content: '{nt}',
                style: {
                    fontSize: 46,
                    fill: '#fff',
                    fontFamily: 'Acens',
                    lineWidth: 40
                }
            },
            configNum2: {
                number: [0],
                content: '{nt}',
                style: {
                    fontSize: 46,
                    fill: '#fff',
                    fontFamily: 'Acens',
                    lineWidth: 40
                }
            },
            configNum3: {
                number: [0],
                content: '{nt}',
                style: {
                    fontSize: 46,
                    fill: '#fff',
                    fontFamily: 'Acens',
                    lineWidth: 40
                }
            },
            configNum4: {
                number: [0],
                content: '{nt}',
                style: {
                    fontSize: 46,
                    fill: '#fff',
                    fontFamily: 'Acens',
                    lineWidth: 40
                }
            },
            week: '',
            hourMinute: '',
            dateTime: '',
            userInfo: {},
            col: 10,
            row: 3,
            cols: [],
            rows: [],
            list: [],
            teams: [],
            statistics: []
        }
    },
    created() {
        let userInfo = this.$getsessionStorage('userInfo')
        console.log('userInfo', userInfo)
        if (userInfo != '') {
            this.userInfo = userInfo
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.init_static()
            this.init_teams()
            this.get_data()
        })
        this.writeCurrentDate()
    },
    methods: {
        get_data() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_screen_data(data).then(res => {
                console.log('坐席数据', res)
                if (res.length == 0) {
                    this.isBuild = false
                } else {
                    this.list = res
                    this.initCol(res[0].length)
                    this.initRow(res.length)
                }
            }).catch(error => {
                console.log(error + 'error')
            })
        },
        init_teams() {
            this.teams = []
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_screen_teams(data).then(res => {
                console.log('图例数据', res)
                if (res.length > 0) {
                    res.forEach(item => {
                        let obj = {}
                        obj.id = item.id
                        obj.name = item.name
                        obj.color = item.color
                        this.teams.push(obj)
                    })
                }
            }).catch(error => {
                console.log(error + 'error')
            })
        },
        init_static() {
            this.statistics = []
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_screen_static(data).then(res => {
                console.log('1111', res)
                if (res.length > 0) {
                    this.configNum1 = {
                        number: [res[0].num],
                        content: '{nt}',
                        style: {
                            fontSize: 46,
                            fill: '#fff',
                            fontFamily: 'Acens',
                            lineWidth: 40
                        }
                    }
                    this.configNum2 = {
                        number: [res[1].num],
                        content: '{nt}',
                        style: {
                            fontSize: 46,
                            fill: '#fff',
                            fontFamily: 'Acens',
                            lineWidth: 40
                        }
                    }
                    this.configNum3 = {
                        number: [res[2].num],
                        content: '{nt}',
                        style: {
                            fontSize: 46,
                            fill: '#fff',
                            fontFamily: 'Acens',
                            lineWidth: 40
                        }
                    }
                    this.configNum4 = {
                        number: [res[3].num],
                        content: '{nt}',
                        style: {
                            fontSize: 46,
                            fill: '#fff',
                            fontFamily: 'Acens',
                            lineWidth: 40
                        }
                    }
                    res.forEach(item => {
                        let obj = {}
                        obj.num = item.num
                        obj.name = item.typeCN
                        this.statistics.push(obj)
                    })
                }
            }).catch(error => {
                console.log(error + 'error')
            })
        },
        initCol(num) {
            this.cols = []
            for (let i = 0; i < num; i++) {
                this.cols.push(i)
            }
        },
        initRow(num) {
            this.rows = []
            for (let i = 0; i < num; i++) {
                this.rows.push(i)
            }
        },
        writeCurrentDate() {
            var now = new Date()
            var year = now.getFullYear() // 得到年份
            var month = now.getMonth() // 得到月份
            var date = now.getDate() // 得到日期
            var day = now.getDay() // 得到周几
            var hour = now.getHours() // 得到小时
            var minu = now.getMinutes() // 得到分钟
            var sec = now.getSeconds() // 得到秒

            var MS = now.getMilliseconds() // 获取毫秒
            month = month + 1
            if (month < 10) month = '0' + month
            if (date < 10) date = '0' + date
            if (hour < 10) hour = '0' + hour
            if (minu < 10) minu = '0' + minu
            if (sec < 10) sec = '0' + sec
            if (MS < 100) MS = '0' + MS
            // eslint-disable-next-line
            var arr_week = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六')
            this.week = arr_week[day]
            this.hourMinute = hour + ':' + minu
            this.dateTime = year + '-' + month + '-' + date
            // 设置得到当前日期的函数的执行间隔时间，每1000毫秒刷新一次。
            this.timer = setTimeout(() => {
                this.writeCurrentDate()
            }, 1000)
        }
    }
}
</script>

    <style lang="scss" scoped>
         html, body, #app {
          width: 100%;
          height: 100%;
          margin: 0px;
          padding: 0px;

        }
        .title{
            width:400px;
            font-family: Mnjlx;
            position: absolute;
            left: 50%;
            top:10px;
            margin-left: -200px;
            font-size: 46px;
            color:#fff;
            z-index: 9999;
            letter-spacing: 10px;
        }
        .full-screen{
            background-image:url(../../assets/img/KSH_bg.jpg)!important;
        }
        .entrance-top {
            width: 100%;
            height: 106px;
            position: absolute;
            left: 0;
            top: 0;
            color: #fff;
            padding: 0 30px;
            box-sizing: border-box;
            font-size: 14px;
            background-image: url(../../assets/img/MK_top.png);
            background-repeat: no-repeat;
            background-position: center;
            background-size: 100% 100%;

            div:nth-child(1) span {
                color: #008fff;
            }
        }
        .statistic-box{
            width:100%;
            height:70px;
            top:90px;
            left:0;
            position: absolute;
        }
        .num{
            width:auto;
            height:50px;
            color:#fff;
            font-size:30px;
        }
        .num-desc{
            color:#fff;
            font-size:16px;
            font-family: 'Bdzyjt';
        }
        /*.region{
            width:80%;
            position: absolute;
            top:280px;
            left:10%;
            bottom:10px;
            overflow: auto;
        }
    .reject-box{
        width:auto;
        height:100%;
        padding:20px 0 20px 20px;
        box-sizing: border-box;
        position: relative;
    }
    .reject-wrapper{
        width:100%;
        height:100%;
        position: relative;
    }*/
    .region{
        width:88%;
        position: absolute;
        top:280px;
        left:10%;
        bottom:20px;
        overflow: auto;

    }
    .reject-wrapper{
        height:100%;
        padding:50px 0 20px 50px;
        box-sizing: border-box;
        position: relative;
    }
        .reject-box{
            width:auto;
            position: relative;
        }
    .col{
        position: absolute;
        top:-22px;
        left:0px;
        right:0;
        height:20px;
        font-size:0;
        z-index: 99;
    }

     .col>div.big{
         width:22px;
         height:22px;
         display: inline-block;
         text-align: center;
         line-height: 10px;
         font-size:10px;
         margin-left: -1px;
         margin-top: -1px;
         color:#007aff;
     }
     .col>div.middle{
         width:42px;
         height:42px;
         display: inline-block;
         text-align: center;
         line-height: 10px;
         font-size:20px;
         margin-left: -1px;
         margin-top: -10px;
         color:#007aff;
     }
     .col>div.small{
         width:62px;
         height:62px;
         display: inline-block;
         text-align: center;
         line-height: 30px;
         font-size:30px;
         margin-left: -1px;
         margin-top: -26px;
         color:#007aff;
     }
    .row{
        position: absolute;
        top:0px;
        left:-22px;
        bottom:0;
        width:20px;
        font-size:0;
        z-index: 99;
    }
     .row>div.big{
         width:22px;
         height:22px;
            text-align: center;
         line-height: 22px;
         font-size:10px;
         margin-left: -1px;
         margin-top: -1px;
         color:#007aff;
     }

     .row>div.middle{
         width:42px;
         height:42px;
            text-align: center;
         line-height: 42px;
         font-size:20px;
         margin-left: -20px;
         margin-top: -1px;
         color:#007aff;
     }

     .row>div.small{
         width:62px;
         height:62px;
            text-align: center;
         line-height: 62px;
         font-size:30px;
         margin-left: -44px;
         margin-top: -1px;
         color:#007aff;
     }
    .top-bg{
        width:70%;
        position: absolute;
        left:15%;
        top:200px;
        height:70px;
        background-image:url(../../assets/img/Large_screen.png);
        background-position: center;
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }
    .seat-list{
        width:10%;
        height:20px;
        position: absolute;
        left:10px;
        top:30%;

    }
    .seat-title{
        color:#FFFFFF;
        line-height: 20px;
        font-size:18px;
        padding-left:6px;
        border-left:4px solid #00CFFB;
        text-shadow: 0px 2px 8px #00cffb, 0px 0px 8px #00cffb;
    }
    .seat-team{
        margin-top: 50px;
        background-color: rgba(0,0,0,.3);
        padding:2px 0 2px 6px;

    }
    .seat-team>div{
        margin: 10px 0;
        font-size:0;
        padding-left:10px;
        position: relative;

    }
    .seat-team>div i{
        width:10px;
        position: absolute;
        left:5px;
        top:4px;
        vertical-align: middle;
        height:10px;
    }
    .seat-team>div div{
        font-size:13px;
        color:#fff;
        margin-left: 10px;
    }
    </style>
