<template>
    <dv-full-screen-container class="event main drill-screen">
        <div class="fire-bg" :class="{'animated':aniFire}"></div>
        <div class="top-title">
            <div class="ub ub-pc title">演练指挥态势</div>
            <div class="ub ub-pj entrance-top">
                <div style="padding-top:16px;">{{timeStr}}</div>
                <!-- <div style="padding-top:16px;">{{dateTime+'&nbsp;&nbsp;&nbsp;'}}{{hourMinute+'&nbsp;&nbsp;&nbsp;'}}{{week}}</div> -->
            </div>
            <div class="ub exit" style="padding-top:16px; position: absolute;top:0;right:20px;z-index: 10;color:#fff;">
                <div class="home" style="margin-right: 10px;font-size:0px;">
                    <a :href="baseInfo+'#/entrance'" class="link-home" title="首页"><i style="font-size:22px;cursor: pointer;color:#fff;" class="el-icon-s-home bell"></i></a>
                </div>
                <div>您好，{{userInfo.cnName}}</div>
            </div>
            <div class="ub ub-pj statistic-box">
                <div class="ub ub-pj left" style="width:30%;">
                    <div class="ub ub-ac ub-f1 ub-ver">
                        <div class="ub ub-ac ub-pc num-box" :class="{'overOne':statistics.gjScoreRealy>9999}">
                            <span class="num gj" id="num1">
                                {{statistics.gjScore}}
                            </span>
                            <span v-if="statistics.gjScoreRealy>9999" style="color:#fff;font-size:12px;vertical-align: bottom;position: relative;top:-20px;">万</span>
                        </div>
                        <div class="num-desc">攻击得分</div>
                    </div>
                    <div class="ub ub-ac ub-f1 ub-ver">
                        <div class="ub ub-ac ub-pc num-box" :class="{'overOne':statistics.gjNumRealy>9999}">
                            <span class="num gj" id="num2">
                                {{statistics.dshgjNum}}
                            </span>
                            <span v-if="statistics.gjNumRealy>9999" style="color:#fff;font-size:12px;vertical-align: bottom;position: relative;top:-20px;">万</span>
                        </div>
                        <div class="num-desc">攻击次数</div>
                    </div>
                    <div class="ub ub-ac ub-f1 ub-ver">
                        <div class="ub ub-ac ub-pc num-box" :class="{'overOne':statistics.dshgjNumRealy>9999}">
                            <span class="num gj" id="num3">
                                {{statistics.dshgjNum}}
                            </span>
                            <span v-if="statistics.dshgjNumRealy>9999" style="color:#fff;font-size:12px;vertical-align: bottom;position: relative;top:-20px;">万</span>
                        </div>
                        <div class="num-desc">待审核攻击</div>
                        <div @click="attrack_defense(1)" class="tips" style="width:100px;position: absolute;right:-80px;bottom:10px;color:#fff;cursor: pointer;"><i style="font-size:16px;" class="el-icon-info"></i><span style="font-size: 14px;margin-left: 5px;">点击查看</span></div>
                    </div>
                </div>

                <div class="ub ub-pj left" style="width:30%;">
                    <div class="ub ub-ac ub-f1 ub-ver">
                        <div class="ub ub-ac ub-pc num-box" :class="{'overOne':statistics.gjfNumRealy>9999}">
                            <span class="num gj" id="num4">
                                {{statistics.gjfNum}}
                            </span>
                            <span v-if="statistics.gjfNumRealy>9999" style="color:#fff;font-size:12px;vertical-align: bottom;position: relative;top:-20px;">万</span>
                        </div>
                        <div class="num-desc">攻击方人数</div>
                    </div>
                    <div class="ub ub-ac ub-f1 ub-ver">
                        <div class="ub ub-ac ub-pc num-box" :class="{'overOne':statistics.cpNumRealy>9999}">
                            <span class="num" id="num5">
                                {{statistics.cpNum}}
                            </span>
                            <span v-if="statistics.cpNumRealy>9999" style="color:#fff;font-size:12px;vertical-align: bottom;position: relative;top:-20px;">万</span>
                        </div>
                        <div class="num-desc">裁判人数</div>
                    </div>
                    <div class="ub ub-ac ub-f1 ub-ver">
                        <div class="ub ub-ac ub-pc num-box" :class="{'overOne':statistics.fsfNumRealy>9999}">
                            <span class="num fs" id="num6">
                                {{statistics.fsfNum}}
                            </span>
                            <span v-if="statistics.fsfNumRealy>9999" style="color:#fff;font-size:12px;vertical-align: bottom;position: relative;top:-20px;">万</span>
                        </div>
                        <div class="num-desc fs">防守方人数</div>
                    </div>
                </div>

                <div class="ub ub-pj left" style="width:30%;">
                    <div class="ub ub-ac ub-f1 ub-ver">
                        <div class="ub ub-ac ub-pc num-box" :class="{'overOne':statistics.fsScoreRealy>9999}">
                            <span class="num fs" id="num7">
                                {{statistics.fsScore}}
                            </span>
                            <span v-if="statistics.fsScoreRealy>9999" style="color:#fff;font-size:12px;vertical-align: bottom;position: relative;top:-20px;">万</span>
                        </div>
                        <div class="num-desc fs">防守得分</div>
                    </div>
                    <div class="ub ub-ac ub-f1 ub-ver">
                        <div class="ub ub-ac ub-pc num-box" :class="{'overOne':statistics.fsNumRealy>9999}">
                            <span class="num fs" id="num8">
                                {{statistics.fsNum}}
                            </span>
                            <span v-if="statistics.fsNumRealy>9999" style="color:#fff;font-size:12px;vertical-align: bottom;position: relative;top:-20px;">万</span>
                        </div>
                        <div class="num-desc fs">防守次数</div>
                    </div>
                    <div class="ub ub-ac ub-f1 ub-ver">
                        <div class="ub ub-ac ub-pc num-box" :class="{'overOne':statistics.dshfsNumRealy>9999}">
                            <span class="num fs" id="num9">
                                {{statistics.dshfsNum}}
                            </span>
                            <span v-if="statistics.dshfsNumRealy>9999" style="color:#fff;font-size:12px;vertical-align: bottom;position: relative;top:-20px;">万</span>
                        </div>
                        <div class="num-desc fs">待审核防守</div>
                        <div @click="attrack_defense(2)" class="tips" style="width:100px;position: absolute;right:-80px;bottom:10px;color:#fff;cursor: pointer;"><i style="font-size:16px;" class="el-icon-info"></i><span style="font-size: 14px;margin-left: 5px;">点击查看</span></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="topList">
            <div class="leftLogo" style="width:24%;height:100%;">
            </div>
            <div class="topCenter" style="width:52%;height:100%;position: relative;">
                <!--<i class="iconfont icon-defen"></i>-->
                <div class="tableList top-table" style="width: 100%;height: 100%;">
                    <div class="c-content right-scroll" style="padding-top:20px;box-sizing: border-box;">
                        <div class="ub ub-pc dv-data_0" style="width:80%;height:100px;">
                            <dv-scroll-board class="dv-scroll-board"  style="width:600px;" :config="bord0" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="rightLogo" style="width:24%;height:100%;">

            </div>
        </div>
        <div class="ub container">
            <div class="leftChart">
                <div class="left_bar">
                    <div class="lunbo" style="left:500px;">
                        <div class="swiper-container deviceLogs" @click="rankDetailShow">
                            <div v-if="configRank.data.length==0" class="ub ub-f1 ub-ac ub-pc" style="width:100%;height:100%;color:#e7e7e7;font-size:16px; cursor: pointer;background-color: rgba(0,0,0,.2);">
                                暂无数据
                            </div>
                            <dv-scroll-ranking-board class="configRank" :config="configRank" style="width:100%;height:240px;" />
                            <div class="ub ub-ac lunbo-top">
                                <div class="lunbo-title">攻击方排名</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="left_table">
                    <div class="tableTitle">
                        <div class="c-top">攻击方成果</div>
                        <div class="tableNum">
                            <div class="Num">
                                <dv-digital-flop :config="configNum10" style="width:60%;height:60%;" />
                                <div class="num-desc_s">目标IP</div>
                            </div>
                            <div class="Num">
                                <dv-digital-flop :config="configNum11" style="width:60%;height:60%;" />
                                <div class="num-desc_s">攻击源</div>
                            </div>
                            <div class="Num">
                                <dv-digital-flop :config="configNum12" style="width:60%;height:60%;" />
                                <div class="num-desc_s">攻击手段</div>
                            </div>
                        </div>
                    </div>
                    <div class="tableList" style="margin-top: 10px;">
                        <div class="c-content right-scroll">
                            <div class="dv-data" style="width:100%">
                                <dv-scroll-board style="width:100%!important" :config="bord1" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="centerShow" style="position: relative;">
                <div class="center-top" style="width:100%;height:64%;position: relative;overflow: hidden;">
                    <div class="ub attrack_defense_score-box" :class="{'animated':aniScore}">
                        <div class="ub ub-ac ub-pc score score-left">{{attrackScore}}</div>
                        <div class="ub ub-ac ub-pc score-middle">
                            <div v-for="(item,index) in scoreProgress" :key="index" :class="{'attrackTeam':item.isAttrack==1,'defenseTeam':item.isAttrack==2}"></div>
                        </div>
                        <div class="ub ub-ac ub-pc score score-right">{{defenseScore}}</div>
                        <div class="ub ub-ac ub-pc time-box">
                            <span>{{match_start_time}} ~ {{match_end_time}}</span>&nbsp;&nbsp;&nbsp;&nbsp;距离结束：{{day}}天{{hour}}小时{{min}}分{{second}}秒
                        </div>
                    </div>
                    <div class="ad-left-fire" :class="{'animated':aniFire}"></div>
                    <div class="ad-right-fire" :class="{'animated':aniFire}"></div>
                    <div class="middle-long" :class="{'animated':aniLong}"></div>
                    <div class="middle-vs" :class="{'animated':aniVs}"></div>
                    <div class="ad-left-shou" :class="{'animated':aniLeftShou}"></div>
                    <div class="ad-right-shou" :class="{'animated':aniRightShou}"></div>
                    <div class="ub ub-ac ub-pc teamnames" :class="{'animated':aniFire}">
                        <span>攻方战队</span>
                        <span>守方战队</span>
                    </div>
                </div>
                <div class="ub ub-pj center-footer" style="width:100%;height:36%;padding:0 20px;box-sizing: border-box;z-index: 2;">
                    <div class="chart-box border" style="width:48%;height:100%;">
                        <span class="angle1"></span>
                        <span class="angle2"></span>
                        <span class="angle3"></span>
                        <span class="angle4"></span>
                        <div class="ub ub-pj ub-ac w100 chart-top" style="padding:0 20px;box-sizing: border-box;">
                            <div class="chart-title defense-title">攻击方趋势</div>
                        </div>
                        <div style="width:100%;height:100%;padding-top: 8px;box-sizing: border-box;">
                            <div v-if="attackTrend.length==0" class="ub ub-f1 ub-ac ub-pc" style="width:100%;height:100%;color:#e7e7e7;font-size:16px; cursor: pointer;background-color: rgba(0,0,0,.2);">
                                暂无数据
                            </div>
                            <brokenLineMut v-if="attackTrend.length>0" :chartData="attackTrend" type="1" />
                        </div>
                    </div>
                    <div class="chart-box border" style="width:48%;height:100%;">
                        <span class="angle1"></span>
                        <span class="angle2"></span>
                        <span class="angle3"></span>
                        <span class="angle4"></span>
                        <div class="ub ub-pj ub-ac w100 chart-top" style="padding:0 20px;box-sizing: border-box;">
                            <div class="chart-title defense-title">防守方趋势</div>
                        </div>
                        <div style="width:100%;height:100%;padding-top: 8px;box-sizing: border-box;">
                            <div v-if="defenseTrend.length==0" class="ub ub-f1 ub-ac ub-pc" style="width:100%;height:100%;color:#e7e7e7;font-size:16px; cursor: pointer;background-color: rgba(0,0,0,.2);">
                                暂无数据
                            </div>
                            <brokenLineMut v-if="defenseTrend.length>0" :chartData="defenseTrend" type="1" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="rightChart">
                <div class="right_pie">
                    <div class="lunbo">
                        <div class="swiper-container attackWay">
                            <div class="swiper-wrapper">
                                <div class="ub ub-ac ub-pc swiper-slide">
                                    <div v-if="attackWayData.length==0" class="ub ub-f1 ub-ac ub-pc" style="width:100%;height:100%;color:#e7e7e7;font-size:16px; cursor: pointer;background-color: rgba(0,0,0,.2);">
                                        暂无数据
                                    </div>
                                    <AttackWay v-if="attackWayData.length>0" :chartData="attackWayData" type="1"/>
                                </div>
                            </div>
                            <div class="ub ub-ac lunbo-top">
                                <div class="lunbo-title">防御成果统计</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="right_table">
                    <div class="tableTitle">
                        <div class="c-top">防守方成果</div>
                        <div class="tableNum">
                            <div class="Num">
                                <dv-digital-flop :config="configNum13" style="width:60%;height:60%;" />
                                <!--{{statistics[0].num}}-->
                                <div class="num-desc_s">攻击手段</div>
                            </div>
                            <div class="Num">
                                <dv-digital-flop :config="configNum14" style="width:60%;height:60%;" />
                                <!--{{statistics[0].num}}-->
                                <div class="num-desc_s">攻击源</div>
                            </div>
                            <div class="Num">
                                <dv-digital-flop :config="configNum15" style="width:60%;height:60%;" />
                                <!--{{statistics[0].num}}-->
                                <div class="num-desc_s">防守手段</div>
                            </div>
                        </div>
                    </div>
                    <div class="tableList" style="margin-top: 10px;">
                        <div class="c-content right-scroll">
                            <div class="dv-data" style="width:100%;">
                                <dv-scroll-board style="width:100%!important;" :config="bord2" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog :title="alarm_title" :visible.sync="detailDialog" width="700px" custom-class="common-dialog">
            <div class="ub ub-ac w100" style='margin: 0px 0 40px;'>
                <div class="ub ub-ac ub-f1 ub-ver drawer-info">
                    <div class="alarm-num">{{tableDetailData.teamScore}}</div>
                    <div style="font-size:13px;color:#fff;margin-top:5px;">战队得分</div>
                </div>
                <el-divider direction="vertical"></el-divider>
                <div class="ub ub-ac ub-f1 ub-ver drawer-info">
                    <div class="alarm-num total">{{tableDetailData.teamPeopleNum}}</div>
                    <div style="font-size:13px;color:#fff;margin-top:5px;">战队人数</div>
                </div>
            </div>
            <el-table class='bigTable safe-defense' v-loading="loading" :data="tableData" border stripe tooltip-effect="dark">
                <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                </el-table-column>
                <el-table-column prop="name" label="姓名">
                </el-table-column>
                <el-table-column prop="score" label="得分">
                </el-table-column>
            </el-table>
            <div class="pagination mt-1 text-right">
                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="get_params.page" :page-sizes="[10, 20, 30, 40,50]" :page-size="get_params.size" layout="total, sizes, prev, pager, next" prev-text="上一页" next-text="下一页" :total="total_num">
                </el-pagination>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button class="cancelBtn" @click="detailDialog = false" size="small">关闭</el-button>
            </span>
        </el-dialog>
        <el-dialog :title="attrack_defense_title" :visible.sync="attrack_defenseDialog" width="700px" custom-class="common-dialog">
            <div class="ub ub-ac w100" style='margin: 0px 0 40px;'>
                <div class="ub ub-ac ub-f1 ub-ver drawer-info">
                    <div class="alarm-num">{{allNum}}</div>
                    <div style="font-size:13px;color:#fff;margin-top:5px;">攻击提交量</div>
                </div>
                <el-divider direction="vertical"></el-divider>
                <div class="ub ub-ac ub-f1 ub-ver drawer-info">
                    <div class="alarm-num total">{{passNum}}</div>
                    <div style="font-size:13px;color:#fff;margin-top:5px;">待审核总量</div>
                </div>
            </div>
            <el-table class='bigTable safe-defense' v-loading="attrack_defenseloading" :data="attrack_defenseData" border stripe tooltip-effect="dark">
                <el-table-column align="center" type="index" width="50" :index="indexMethodAttrack" label="序号">
                </el-table-column>
                <el-table-column prop="mode_name" :label="attrack_defense_type==1?'攻击手段':'防守手段'">
                </el-table-column>
                <el-table-column prop="time" :label="attrack_defense_type==1?'攻击时间':'防守时间'">
                </el-table-column>
                <el-table-column prop="target_ip" label="目标IP">
                </el-table-column>
                <el-table-column prop="attack_ip" label="攻击源">
                </el-table-column>
                <el-table-column prop="create_user" label="提交人">
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <div>
                            <div v-if="scope.row.status==1" class="ub ub-ac last-state one">
                                <div></div>
                                <div>{{scope.row.statsCN}}</div>
                            </div>
                            <div v-if="scope.row.status==2" class="ub ub-ac last-state two">
                                <div></div>
                                <div>{{scope.row.statsCN}}</div>
                            </div>
                            <div v-if="scope.row.status==3" class="ub ub-ac last-state three">
                                <div></div>
                                <div>{{scope.row.statsCN}}</div>
                            </div>
                            <div v-if="scope.row.status==4" class="ub ub-ac last-state four">
                                <div></div>
                                <div>{{scope.row.statsCN}}</div>
                            </div>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination mt-1 text-right">
                <el-pagination background @size-change="handleSizeChangeAttrack" @current-change="handleCurrentChangeAttrack" :current-page="get_paramsAttrack.page" :page-sizes="[10, 20, 30, 40,50]" :page-size="get_paramsAttrack.size" layout="total, sizes, prev, pager, next" prev-text="上一页" next-text="下一页" :total="total_numAttrack">
                </el-pagination>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button class="cancelBtn" @click="attrack_defenseDialog = false" size="small">关闭</el-button>
            </span>
        </el-dialog>
    </dv-full-screen-container>

</template>

<script>
// import { dvFullScreenContainer } from '@jiaminghi/data-view'
import AttackWay from '@/components/defenseComponents/pie/AttackWay.vue'
import barMut from '@/components/charts/barMut.vue'
import brokenLineMut from '@/components/charts/brokenLineMut.vue'
import ResultPie_1 from '@/components/defenseComponents/pie/ResultPie_1.vue'
import ResultPie_2 from '@/components/defenseComponents/pie/ResultPie_2.vue'
import {
    get_screen_drill_static,
    get_rank_data,
    get_attrack_result,
    get_defense_data,
    get_submit_result,
    get_attack_way,
    get_trend,
    get_topList,
    get_drill_team_detail,
    get_link_data,
    get_attrack_defense_detail,
    get_matchTime
} from '../../server/defense_drill/overview.js'
import {
    get_user_info,
    get_time
} from '../../server/defense_drill/base.js'
import axios from 'axios'
var options = {
    useEasing: true, // 使用缓和
    useGrouping: true, // 使用分组(是否显示千位分隔符,一般为 true)
    separator: '', // 分隔器(千位分隔符,默认为',')
    decimal: '.', // 十进制(小数点符号,默认为 '.')
    prefix: '', // 字首(数字的前缀,根据需要可设为 $,¥,￥ 等)
    suffix: ''// 后缀(数字的后缀 ,根据需要可设为 元,个,美元 等),

}
export default {
    name: 'CommandDrill',
    data() {
        return {
            match_start_time: '',
            match_end_time: '',
            attrackAllNum: 0,
            attrackPassNum: 0,
            defenseAllNum: 0,
            defensePassNum: 0,
            attrack_defenseDialog: false,
            attrack_defense_title: '',
            allNum: 0,
            passNum: 0,
            attrack_defenseData: [],
            get_paramsAttrack: {
                page: 1,
                size: 10
            },
            attrack_defenseloading: false,
            total_numAttrack: 0,
            attrack_defense_type: '',
            // 控制动画
            aniScore: false,
            aniLong: false,
            aniVs: false,
            aniLeftShou: false,
            aniRightShou: false,
            aniFire: false,

            attackTrend: [],
            defenseTrend: [],
            attrackScore: 0,
            defenseScore: 0,
            scoreProgress: [],

            end: '',
            now: '',
            isTrue: true,
            curStartTime: '',
            curEndTime: '',
            day: '0',
            hour: '00',
            min: '00',
            second: '00',

            detatilInfo: {
                attackTime: '',
                attackModeCN: '',
                path: '',
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

            configNum1: {
                number: [0],
                content: '{nt}',
                style: {
                    fontSize: 38,
                    fill: '#fff',
                    fontFamily: 'Acens',
                    lineWidth: 20,
                    textShadow: '0px 0px 10px #00aaff, 0px 0px 10px #00aaff'
                }
            },
            configNum2: {
                number: [0],
                content: '{nt}',
                style: {
                    fontSize: 38,
                    fill: '#fff',
                    fontFamily: 'Acens',
                    lineWidth: 20,
                    textShadow: '0px 0px 10px #00aaff, 0px 0px 10px #00aaff'
                }
            },
            configNum3: {
                number: [0],
                content: '{nt}',
                style: {
                    fontSize: 38,
                    fill: '#fff',
                    fontFamily: 'Acens',
                    lineWidth: 20,
                    textShadow: '0px 0px 10px #00aaff, 0px 0px 10px #00aaff'
                }
            },
            configNum4: {
                number: [0],
                content: '{nt}',
                style: {
                    fontSize: 38,
                    fill: '#fff',
                    fontFamily: 'Acens',
                    lineWidth: 20
                }
            },
            configNum5: {
                number: [0],
                content: '{nt}',
                style: {
                    fontSize: 38,
                    fill: '#fff',
                    fontFamily: 'Acens',
                    lineWidth: 20
                }
            },
            configNum6: {
                number: [0],
                content: '{nt}',
                style: {
                    fontSize: 38,
                    fill: '#fff',
                    fontFamily: 'Acens',
                    lineWidth: 20
                }
            },
            configNum7: {
                number: [0],
                content: '{nt}',
                style: {
                    fontSize: 38,
                    fill: '#fff',
                    fontFamily: 'Acens',
                    lineWidth: 20,
                    textShadow: '0px 0px 10px #fe110c, 0px 0px 10px #fe110c'
                }
            },
            configNum8: {
                number: [0],
                content: '{nt}',
                style: {
                    fontSize: 38,
                    fill: '#fff',
                    fontFamily: 'Acens',
                    lineWidth: 20,
                    textShadow: '0px 0px 10px #fe110c, 0px 0px 10px #fe110c'
                }
            },
            configNum9: {
                number: [0],
                content: '{nt}',
                style: {
                    fontSize: 38,
                    fill: '#fff',
                    fontFamily: 'Acens',
                    lineWidth: 20,
                    textShadow: '0px 0px 10px #fe110c, 0px 0px 10px #fe110c'
                }
            },
            configNum10: {
                number: [0],
                content: '{nt} 个',
                style: {
                    fontSize: 28,
                    fill: '#00f9ff',
                    fontFamily: 'Acens',
                    lineWidth: 20
                }
            },
            configNum11: {
                number: [0],
                content: '{nt} 个',
                style: {
                    fontSize: 28,
                    fill: '#42c4ff',
                    fontFamily: 'Acens',
                    lineWidth: 20
                }
            },
            configNum12: {
                number: [0],
                content: '{nt} 种',
                style: {
                    fontSize: 28,
                    fill: '#fff',
                    fontFamily: 'Acens',
                    lineWidth: 20
                }
            },
            configNum13: {
                number: [0],
                content: '{nt} 个',
                style: {
                    fontSize: 28,
                    fill: '#00f9ff',
                    fontFamily: 'Acens',
                    lineWidth: 20
                }
            },
            configNum14: {
                number: [0],
                content: '{nt} 个',
                style: {
                    fontSize: 28,
                    fill: '#42c4ff',
                    fontFamily: 'Acens',
                    lineWidth: 20
                }
            },
            configNum15: {
                number: [0],
                content: '{nt} 种',
                style: {
                    fontSize: 28,
                    fill: '#fff',
                    fontFamily: 'Acens',
                    lineWidth: 20
                }
            },
            week: '',
            hourMinute: '',
            dateTime: '',
            userInfo: {
                cnName: ''
            },
            baseInfo: '',
            statistics: {
                gjfNum: 0,
                fsNum: 0,
                gjScore: 0,
                dshgjNum: 0,
                fsScore: 0,
                dshfsNum: 0,
                cpNum: 0,
                gjNum: 0,
                fsfNum: 0
            },
            attackWayIndex: 0,
            attackSubmitIndex: 0,
            trendIndex: 0,
            wayList: ['攻击手段'],
            submitList: ['攻击成果', '防御成果'],
            trendList: ['攻击成果', '防御成果'],

            // 攻击方排名
            configRank: {
                // waitTime:1000000,
                data: []
                // carousel: 'page'
            },

            // 成果提交分析
            attackData1: [],
            defenseData1: [],

            attackData2: [
                // {value: 0}
            ],

            defenseData2: [
                // {value: 0}
            ],

            // 演练趋势
            trendData1: [{
                x: [],
                y1: [],
                y2: []
            }],
            trendData2: [{
                x: [],
                y1: [],
                y2: []
            }],
            alarm_title: '战狼战队',
            detailDialog: false,
            get_params: {
                page: 1,
                size: 10
            },
            timer: 0,
            total_num: 0,
            loading: false,
            tableDetailData: {
                teamPeopleNum: 0,
                teamScore: 0
            },
            tableData: [],
            currentId: '',
            // 攻击手段
            attackWayData: [],

            bord0: {
                header: ['序号', '姓名', '战队名称', '提交时间', '得分'],
                headerHeight: 28,
                headerBGC: 'rgba(0, 0, 0, 0.2)',
                oddRowBGC: 'rgba(0, 0, 0, 0.2)',
                evenRowBGC: 'rgba(0, 0, 0, 0.2)',
                align: ['center', 'center', 'center', 'center', 'center'],
                columnWidth: ['50', '160', '160', '180', '50'],
                rowNum: 3,
                data: []
            },

            bord1: {
                header: ['攻击手段', '攻击时间', '目标IP', '攻击源', '提交人', '得分'],
                headerBGC: 'rgba(0, 0, 0, 0.1)',
                oddRowBGC: 'rgba(255,255,255,0)',
                evenRowBGC: 'rgba(255,255,255,0)',
                rowNum: 5,
                data: []
            },
            bord2: {
                header: ['攻击手段', '攻击源', '防守手段', '提交人', '得分'],
                headerBGC: 'rgba(0, 0, 0, 0.1)',
                oddRowBGC: 'rgba(255,255,255,0)',
                evenRowBGC: 'rgba(255,255,255,0)',
                align: ['center', 'center', 'center', 'center', 'center'],
                columnWidth: ['80'],
                rowNum: 5,
                data: []
            },
            timeStr: null
        }
    },
    components: {
        AttackWay,
        // eslint-disable-next-line vue/no-unused-components
        barMut,
        // eslint-disable-next-line vue/no-unused-components
        ResultPie_1,
        // eslint-disable-next-line vue/no-unused-components
        ResultPie_2,
        brokenLineMut
    },
    created() {
        this.userInfo.cnName = this.$getlocalStorage('initInfo')?.user?.chineseName
        get_user_info({}).then((res) => {
            console.log('42424434324', res)
            let userInfo = {
                cnName: res.info.chineseName,
                id: res.info.id,
                type: res.info.roleId
            }
            this.$setsessionStorage('userInfo', userInfo)
            this.userInfo = userInfo
            this.baseInfo = this.$getCookie(res.tokenName + 'baseInfo')
        }).catch(error => {
            console.log('error', error)
        })
    },
    computed: {
        getCurrentWay() {
            return this.wayList[this.attackWayIndex]
        },
        getCurrentSubmit() {
            return this.submitList[this.attackSubmitIndex]
        },
        getCurrentTrend() {
            return this.trendList[this.trendIndex]
        },
        detailStyle() {
            return {
                left: this.detail_left + 'px',
                top: this.detail_top + 'px'
            }
        }
    },
    watch: {
        trendData1: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.trendData1 = newVal
                }
            },
            deep: true
        },
        trendData2: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.trendData2 = newVal
                }
            },
            deep: true
        }
    },
    mounted() {
        let vm = this
        this.$el.onclick = function() {
            if (document.documentElement.RequestFullScreen) {
                document.documentElement.RequestFullScreen()
            }
            // 兼容火狐
            if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen()
            }
            // 兼容谷歌
            if (document.documentElement.webkitRequestFullScreen) {
                document.documentElement.webkitRequestFullScreen()
            }
            // 兼容IE,只能写msRequestFullscreen
            if (document.documentElement.msRequestFullscreen) {
                document.documentElement.msRequestFullscreen()
            }
        }

        this.$nextTick(() => {
            setTimeout(() => {
                this.aniLong = true
            }, 1000)
            setTimeout(() => {
                this.aniFire = true
                this.aniLeftShou = true
                this.aniRightShou = true
                this.aniVs = true
            }, 2000)
            this.initTime()
            this.initPage()

            this._timer = setInterval(() => {
                this.initPage()
            }, 1000 * 60)
        })
    },
    methods: {
        initTime() {
            let data = {
                queryData: {},
                paramsData: {
                    gameId: this.$route.query.id
                }
            }
            get_matchTime(data).then(res => {
                console.log('时间', res)
                this.curStartTime = res.systemTime
                this.curEndTime = res.endTime
                this.match_start_time = res.startTime
                this.match_end_time = res.endTime
                this.now = new Date(this.curStartTime).getTime()
                this.end = new Date(this.curEndTime).getTime()
                this.countTime()
            }).catch(error => {
                console.log(error + 'error')
            })
        },
        backAll() {
            this.isSingle = false
            this.singleData = {
                attackIp: '',
                link: []
            }
        },
        overIn(e, device) {
            console.log('e', e)
            this.detailShow = true
            this.detail_left = e.pageX - 100
            this.detail_top = e.pageY - 240
            this.detatilInfo = {
                attackTime: device.attackTime,
                attackModeCN: device.attackModeCN,
                path: device.path,
                defenseInfo: device.defenseInfo
            }
            console.log('device', device)
        },
        overOut(e, device) {
            console.log('e', e)
            this.detailShow = false
        },
        changeSigle(item) {
            this.isSingle = true
            this.singleData = {
                attackIp: item.attackIp,
                isAddCN: item.isAddCN,
                link: this.$deepCopy(item.link)
            }
        },
        attrack_defense(type) {
            this.attrack_defense_type = type

            if (type == 1) {
                this.attrack_defense_title = '待审核攻击'
                this.allNum = this.attrackAllNum
                this.passNum = this.attrackPassNum
            } else {
                this.attrack_defense_title = '待审核防守'
                this.allNum = this.defenseAllNum
                this.passNum = this.defensePassNum
            }

            this.attrack_defenseDialog = true
            this.init_attrack_defense(this.attrack_defense_type)
        },
        init_attrack_defense(type) {
            this.attrack_defenseloading = true
            this.attrack_defenseData = []
            let data = {
                queryData: {
                    page: this.get_paramsAttrack.page,
                    pageSize: this.get_paramsAttrack.size
                },
                paramsData: {
                    gameEventId: this.$route.query.id,
                    type: type
                }
            }
            get_attrack_defense_detail(data).then(res => {
                this.attrack_defenseloading = false
                console.log('攻防', res)
                this.total_numAttrack = res.totalElements
                if (res.content.length > 0) {
                    res.content.forEach(item => {
                        this.attrack_defenseData.push({
                            mode_name: type == 1 ? item.attack_mode_name : item.defense_mode_name,
                            time: type == 1 ? item.attack_time : item.defense_time,
                            target_ip: item.target_ip,
                            attack_ip: item.attack_ip,
                            create_user: item.create_user,
                            status: item.status,
                            statsCN: item.statsCN
                        })
                    })
                }
            }).catch(error => {
                this.attrack_defenseloading = false
                console.log(error + 'error')
            })
        },
        rankDetailShow(event) {
            console.log(event)
            if (event.target.className === 'teamName') {
                this.alarm_title = event.target.innerText
                this.detailDialog = true
                this.currentId = event.target.dataset.teamid
                this.get_team_data(this.currentId)
            }
        },

        initLinkData() {
            this.list = []
            let data = {
                queryData: {},
                paramsData: {
                    gameId: this.$route.query.id
                }
            }
            get_link_data(data).then(res => {
                this.loading = false
                console.log('连路途', res)
                if (res.length > 0) {
                    res.forEach(item => {
                        let obj = {}
                        obj.attackIp = item.attackIp
                        obj.isAdd = item.isAdd
                        obj.isAddCN = item.isAddCN
                        obj.link = []
                        let steps = item.link
                        if (steps.length > 0) {
                            steps.forEach(_item => {
                                obj.link.push({
                                    attacks: [_item]
                                })
                            })
                        }
                        console.log('3333333333333333333', obj)
                        this.list.push(obj)
                    })
                }
            }).catch(error => {
                console.log(error + 'error')
            })
        },

        get_team_data(id) {
            this.loading = true
            this.tableData = []
            let data = {
                queryData: {
                    page: this.get_params.page,
                    pageSize: this.get_params.size
                },
                paramsData: {
                    gameId: this.$route.query.id,
                    teamId: id
                }
            }
            get_drill_team_detail(data).then(res => {
                this.loading = false
                console.log('排名详情', res)
                this.tableDetailData = {
                    teamPeopleNum: res.teamPeopleNum,
                    teamScore: res.teamScore
                }
                this.total_num = res.page.totalElements
                if (res.page.content.length > 0) {
                    res.page.content.forEach(item => {
                        this.tableData.push({
                            name: item.createUserName,
                            score: item.score
                        })
                    })
                }
            }).catch(error => {
                console.log(error + 'error')
            })
        },

        initPage() {
            // 顶部统计
            this.init_static()
            this.initRank()
            this.init_attackWay_pie()
            this.init_topList()
            this.initAttackList()
            this.initDefenseList()
            this.initStatisticTime()
            this.init_resultSubmit()
            this.init_trend()
            this.initLinkData()
        },
        initStatisticTime() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_time(data).then(res => {
                console.log('32132132', res)
                this.timeStr = res.time.substring(0, 16) + ' ' + res.week
                // this.writeCurrentDate(this.timeStr)
            }).catch(error => {
                console.log('error', error)
            })
        },
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        indexMethodAttrack(index) {
            return (this.get_paramsAttrack.page - 1) * this.get_paramsAttrack.size + index + 1
        },
        indexMethodLog(index) {
            return (this.get_params_log.page - 1) * this.get_params_log.size + index + 1
        },
        splitArray(data, num) {
            var result = []
            for (var i = 0; i < data.length; i += num) {
                result.push(data.slice(i, i + num))
            }
            return result
        },
        init_static() {
            let data = {
                queryData: {},
                paramsData: {
                    gameId: this.$route.query.id
                }
            }
            get_screen_drill_static(data).then(res => {
                console.log('顶部数据统计', res)
                this.attrackScore = res.gjScore
                this.defenseScore = res.fsScore

                this.attrackAllNum = res.gjNum
                this.attrackPassNum = res.dshgjNum
                this.defenseAllNum = res.fsNum
                this.defensePassNum = res.dshfsNum
                this.statistics = {
                    gjfNum: this.$numChange(res.gjfNum),
                    fsNum: this.$numChange(res.fsNum),
                    gjScore: this.$numChange(res.gjScore),
                    dshgjNum: this.$numChange(res.dshgjNum),
                    fsScore: this.$numChange(res.fsScore),
                    dshfsNum: this.$numChange(res.dshfsNum),
                    cpNum: this.$numChange(res.cpNum),
                    gjNum: this.$numChange(res.gjNum),
                    fsfNum: this.$numChange(res.fsfNum),

                    gjfNumRealy: res.gjfNum,
                    fsNumRealy: res.fsNum,
                    gjScoreRealy: res.gjScore,
                    dshgjNumRealy: res.dshgjNum,
                    fsScoreRealy: res.fsScore,
                    dshfsNumRealy: res.dshfsNum,
                    cpNumRealy: res.cpNum,
                    gjNumRealy: res.gjNum,
                    fsfNumRealy: res.fsfNum
                }
                // eslint-disable-next-line no-undef
                new CountUp('num1', 0, this.statistics.gjScore, this.statistics.gjScoreRealy > 9999 ? 1 : 0, 3, options).start()
                // eslint-disable-next-line no-undef
                new CountUp('num2', 0, this.statistics.gjNum, this.statistics.gjNumRealy > 9999 ? 1 : 0, 3, options).start()
                // eslint-disable-next-line no-undef
                new CountUp('num3', 0, this.statistics.dshgjNum, this.statistics.dshgjNumRealy > 9999 ? 1 : 0, 3, options).start()
                // eslint-disable-next-line no-undef
                new CountUp('num4', 0, this.statistics.gjfNum, this.statistics.gjfNumRealy > 9999 ? 1 : 0, 3, options).start()
                // eslint-disable-next-line no-undef
                new CountUp('num5', 0, this.statistics.cpNum, this.statistics.cpNumRealy > 9999 ? 1 : 0, 3, options).start()
                // eslint-disable-next-line no-undef
                new CountUp('num6', 0, this.statistics.fsfNum, this.statistics.fsfNumRealy > 9999 ? 1 : 0, 3, options).start()
                // eslint-disable-next-line no-undef
                new CountUp('num7', 0, this.statistics.fsScore, this.statistics.fsScoreRealy > 9999 ? 1 : 0, 3, options).start()
                // eslint-disable-next-line no-undef
                new CountUp('num8', 0, this.statistics.fsNum, this.statistics.fsNumRealy > 9999 ? 1 : 0, 3, options).start()
                // eslint-disable-next-line no-undef
                new CountUp('num9', 0, this.statistics.dshfsNum, this.statistics.dshfsNumRealy > 9999 ? 1 : 0, 3, options).start()
            }).then(() => {
                this.scoreProgress = []
                let attrackIndex = Math.floor((this.attrackScore / (this.attrackScore + this.defenseScore)) * 100)

                for (let i = 0; i < 100; i++) {
                    if (this.attrackScore == 0 && this.defenseScore == 0) {
                        this.scoreProgress.push({
                            isAttrack: 3
                        })
                    } else {
                        if (i < attrackIndex) {
                            this.scoreProgress.push({
                                isAttrack: 1
                            })
                        } else {
                            this.scoreProgress.push({
                                isAttrack: 2
                            })
                        }
                    }
                }
                setTimeout(() => {
                    this.aniScore = true
                }, 3000)
            }).catch(error => {
                console.log(error + 'error')
            })
        },
        // 获取排名

        initRank() {
            this.configRank.data = []
            let rank_data = []
            let data = {
                queryData: {},
                paramsData: {
                    gameId: this.$route.query.id
                }
            }
            get_rank_data(data).then(res => {
                console.log('排名数据', res)
                if (res.length > 0) {
                    res.forEach((item, index) => {
                        rank_data.push({
                            name: `<div class="teamName" style="text-align:left;" data-teamid="${item.id}">${item.teamName}</div>`,
                            value: item.score
                        })
                    })
                    this.configRank = {
                        data: rank_data
                    }
                }
            }).catch(error => {
                console.log(error + 'error')
            })
        },

        // 攻击手段
        init_attackWay_pie() {
            let vm = this
            this.attackWayData = []
            let data = {
                queryData: {},
                paramsData: {
                    gameId: this.$route.query.id
                }
            }
            get_attack_way(data).then(res => {
                console.log(res)
                if (res.length > 0) {
                    // console.log(src)
                    res.forEach(item => {
                        this.attackWayData.push({
                            name: item.attackModeName,
                            value: item.num
                        })
                    })
                }
            }).catch(err => {
                console.log('err' + err)
            })
        },
        // 成果提交分析
        init_resultSubmit() {
            let vm = this
            let data1 = {
                queryData: {},
                paramsData: {
                    gameId: this.$route.query.id,
                    type: '1'
                }
            }
            let data2 = {
                queryData: {},
                paramsData: {
                    gameId: this.$route.query.id,
                    type: '2'
                }
            }
            axios.all([get_submit_result(data1), get_submit_result(data2)])
                .then(axios.spread((attack, defense) => {
                    console.log(attack)
                    if (JSON.stringify(attack) !== '{}') {
                        // console.log(src)
                        this.attackData1 = [{
                            name: '审核通过数',
                            value: attack.allPassNum
                        },
                        {
                            name: '提交总数',
                            value: attack.allNum
                        }
                        ]
                        this.attackData2 = [{
                            value: attack.passRate
                        }]
                        console.log(this.attackData1, this.attackData2)
                    }

                    if (JSON.stringify(defense) !== '{}') {
                        this.defenseData1 = [{
                            name: '审核通过数',
                            value: attack.allPassNum
                        },
                        {
                            name: '提交总数',
                            value: attack.allNum
                        }
                        ]
                        this.defenseData2 = [{
                            value: attack.passRate
                        }]
                    }
                })).then(() => {
                    // eslint-disable-next-line no-undef
                    var attackAnalysis = new Swiper('.attackAnalysis', {
                        autoplay: {
                            delay: 10000,
                            stopOnLastSlide: false,
                            disableOnInteraction: false
                        },
                        navigation: {
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev'
                        },
                        resistanceRatio: 0,
                        on: {
                            slideChangeTransitionEnd: function() {
                                vm.attackSubmitIndex = this.activeIndex
                            }
                        }
                    })
                    this.attackSubmitIndex = attackAnalysis.activeIndex
                }).catch(err => {
                    console.log('err' + err)
                })
        },

        // 演练趋势
        init_trend() {
            let vm = this
            this.attackTrend = []
            this.defenseTrend = []
            let data1 = {
                queryData: {},
                paramsData: {
                    gameId: this.$route.query.id,
                    type: '1'
                }
            }
            let data2 = {
                queryData: {},
                paramsData: {
                    gameId: this.$route.query.id,
                    type: '2'
                }
            }
            axios.all([get_trend(data1), get_trend(data2)])
                .then(axios.spread((attack, defense) => {
                    console.log('演练趋势')
                    console.log(attack, defense)
                    if (attack.length > 0) {
                        attack.forEach(item => {
                            this.attackTrend.push(item)
                        })
                    }

                    if (defense.length > 0) {
                        defense.forEach(item => {
                            this.defenseTrend.push(item)
                        })
                    }
                })).then(() => {
                    // eslint-disable-next-line no-undef
                    var trend = new Swiper('.trend', {
                        autoplay: {
                            delay: 10000,
                            stopOnLastSlide: false,
                            disableOnInteraction: false
                        },
                        navigation: {
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev'
                        },
                        resistanceRatio: 0,
                        on: {
                            slideChangeTransitionEnd: function() {
                                vm.trendIndex = this.activeIndex
                            }
                        }
                    })
                    this.trendIndex = trend.activeIndex
                }).catch(err => {
                    console.log('err' + err)
                })
        },

        // 顶部列表
        init_topList() {
            let bord_data = []
            let data = {
                queryData: {},
                paramsData: {
                    gameId: this.$route.query.id
                }
            }
            get_topList(data).then(res => {
                console.log('战队数据', res)
                if (res.length > 0) {
                    res.forEach((item, index) => {
                        let obj = []
                        obj[0] = index + 1
                        obj[1] = item.createUserName
                        obj[2] = `<span style="color: ${item.teamType == '防守队' ? 'red' : '#00fff9'}">${item.teamType}</span>`
                        obj[3] = item.teamName
                        obj[4] = item.createTime
                        obj[5] = `<span style="color:#00fff9;">${item.score}</span>`
                        bord_data.push(obj)
                    })
                    if (window.screen.width > 1680) {
                        this.bord0 = {
                            header: ['序号', '姓名', '战队类型', '战队名称', '提交时间', '得分'],
                            headerHeight: 28,
                            headerBGC: 'rgba(0, 0, 0, 0.2)',
                            oddRowBGC: 'rgba(0, 0, 0, 0.2)',
                            evenRowBGC: 'rgba(0, 0, 0, 0.2)',
                            align: ['center', 'center', 'center', 'left', 'center', 'center'],
                            columnWidth: ['50', '140', '100', '200', '200', '70'],
                            rowNum: 3,
                            data: bord_data
                        }
                    } else {
                        this.bord0 = {
                            header: ['序号', '姓名', '战队类型', '战队名称', '提交时间', '得分'],
                            headerHeight: 28,
                            headerBGC: 'rgba(0, 0, 0, 0.2)',
                            oddRowBGC: 'rgba(0, 0, 0, 0.2)',
                            evenRowBGC: 'rgba(0, 0, 0, 0.2)',
                            align: ['center', 'center', 'center', 'left', 'center', 'center'],
                            columnWidth: ['50', '100', '100', '140', '160', '70'],
                            rowNum: 3,
                            data: bord_data
                        }
                    }
                }
            }).catch(error => {
                console.log(error + 'error')
            })
        },

        // 攻击方成果
        initAttackList() {
            let bord_data = []
            let data = {
                queryData: {
                    page: 1,
                    pageSize: 20
                },
                paramsData: {
                    gameId: this.$route.query.id
                }
            }
            get_attrack_result(data).then(res => {
                console.log('攻击成果', res)
                this.configNum10 = {
                    number: [res.targetIpNum],
                    content: '{nt}',
                    style: {
                        fontSize: 28,
                        fill: '#00f3ff',
                        fontFamily: 'Acens',
                        lineWidth: 20
                    }
                }
                this.configNum11 = {
                    number: [res.attackIpNum],
                    content: '{nt}',
                    style: {
                        fontSize: 28,
                        fill: '#3bb1ff',
                        fontFamily: 'Acens',
                        lineWidth: 20
                    }
                }
                this.configNum12 = {
                    number: [res.attackModeNum],
                    content: '{nt}',
                    style: {
                        fontSize: 28,
                        fill: '#fff',
                        fontFamily: 'Acens',
                        lineWidth: 20
                    }
                }
                if (res.attackHistoryTop20.length > 0) {
                    res.attackHistoryTop20.forEach((item, index) => {
                        let obj = []
                        obj[0] = item.attackModeName
                        obj[1] = item.attackTime
                        obj[2] = `<span style="color:#00fff9;">${item.targetIp}</span>`
                        obj[3] = item.attackIpNum
                        obj[4] = item.createUserName
                        obj[5] = `<span style="color:#00fff9;">${item.score}</span>`
                        bord_data.push(obj)
                    })
                    this.bord1 = {
                        header: ['攻击手段', '攻击时间', '目标IP', '攻击源', '提交人', '得分'],
                        headerHeight: 28,
                        headerBGC: 'rgba(0, 0, 0, 0.2)',
                        oddRowBGC: 'rgba(0, 0, 0, 0.2)',
                        evenRowBGC: 'rgba(0, 0, 0, 0.2)',
                        columnWidth: ['80'],
                        rowNum: 5,
                        data: bord_data
                    }
                }
            }).catch(error => {
                console.log(error + 'error')
            })
        },

        // 防守方成果
        initDefenseList() {
            let bord_data = []
            let data = {
                queryData: {
                    page: 1,
                    pageSize: 20
                },
                paramsData: {
                    gameId: this.$route.query.id
                }
            }
            get_defense_data(data).then(res => {
                console.log('防守成果', res)
                this.configNum13 = {
                    number: [res.attackModeNum],
                    content: '{nt}',
                    style: {
                        fontSize: 28,
                        fill: '#00f3ff',
                        fontFamily: 'Acens',
                        lineWidth: 20
                    }
                }
                this.configNum14 = {
                    number: [res.attackIpNum],
                    content: '{nt}',
                    style: {
                        fontSize: 28,
                        fill: '#3bb1ff',
                        fontFamily: 'Acens',
                        lineWidth: 20
                    }
                }
                this.configNum15 = {
                    number: [res.defenseModeNum],
                    content: '{nt}',
                    style: {
                        fontSize: 28,
                        fill: '#fff',
                        fontFamily: 'Acens',
                        lineWidth: 20
                    }
                }
                if (res.attackHistoryTop20.length > 0) {
                    res.attackHistoryTop20.forEach((item, index) => {
                        let obj = []
                        obj[0] = item.attackModeName
                        obj[1] = item.attackIp
                        obj[2] = `<span style="color:#00fff9;">${item.defenseModeName}</span>`
                        obj[3] = item.createUserName
                        obj[4] = `<span style="color:#00fff9;">${item.score}</span>`
                        bord_data.push(obj)
                    })
                    this.bord2 = {
                        header: ['攻击手段', '攻击源', '防守手段', '提交人', '得分'],
                        headerHeight: 28,
                        headerBGC: 'rgba(0, 0, 0, 0.2)',
                        oddRowBGC: 'rgba(0, 0, 0, 0.2)',
                        evenRowBGC: 'rgba(0, 0, 0, 0.2)',
                        align: ['center', 'center', 'center', 'center', 'right'],
                        rowNum: 5,
                        data: bord_data
                    }
                }
            }).catch(error => {
                console.log(error + 'error')
            })
        },

        handleSizeChange(val) {
            this.get_params.size = val
            this.get_team_data(this.currentId)
        },
        handleCurrentChange(val) {
            this.get_params.page = val
            this.get_team_data(this.currentId)
        },
        handleSizeChangeAttrack(val) {
            this.get_paramsAttrack.size = val
            this.init_attrack_defense(this.attrack_defense_type)
        },
        handleCurrentChangeAttrack(val) {
            this.get_paramsAttrack.page = val
            this.init_attrack_defense(this.attrack_defense_type)
        },
        countTime() {
            let leftTime = this.end - this.now
            console.log(leftTime)
            // 定义变量 d,h,m,s保存倒计时的时间
            if (leftTime >= 0) {
                // 天
                console.log(111111)
                this.day = Math.floor(leftTime / 1000 / 60 / 60 / 24)
                // 时
                let h = Math.floor(leftTime / 1000 / 60 / 60 % 24)
                this.hour = h < 10 ? '0' + h : h
                // 分
                let m = Math.floor(leftTime / 1000 / 60 % 60)
                this.min = m < 10 ? '0' + m : m
                // 秒
                let s = Math.floor(leftTime / 1000 % 60)
                this.second = s < 10 ? '0' + s : s
            } else {
                this.day = 0
                this.hour = '00'
                this.min = '00'
                this.second = '00'
            }

            // 等于0的时候不调用
            if (Number(this.hour) === 0 && Number(this.day) === 0 && Number(this.min) === 0 && Number(this.second) === 0) {

            } else {
                this.now = ((this.now / 1000) + 1) * 1000
                // 递归每秒调用countTime方法，显示动态时间效果,
                setTimeout(this.countTime, 1000)
            }
        },
        writeCurrentDate(date) {
            var now = new Date(date)
            var year = now.getFullYear() // 得到年份
            var month = now.getMonth() // 得到月份
            // eslint-disable-next-line no-redeclare
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
            // eslint-disable-next-line no-array-constructor
            var arr_week = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六')
            this.week = arr_week[day]
            this.hourMinute = hour + ':' + minu
            this.dateTime = year + '-' + month + '-' + date
            // 设置得到当前日期的函数的执行间隔时间，每1000毫秒刷新一次。
            this.timer = setTimeout(() => {
                this.timeStr += 1000
                this.writeCurrentDate(this.timeStr)
            }, 1000)
        }
    }
}
</script>

<style scoped lang="scss">
    .main {
        background-color: #000;
        background-image: url(../../assets/img/situation_bg.jpg) !important;
        background-repeat: no-repeat;
        /*overflow: auto;*/
    }

    .title {
        width: 400px;
        font-family: Mnjlx;
        position: absolute;
        left: 50%;
        top: 10px;
        margin-left: -200px;
        font-size: 46px;
        color: #fff;
        z-index: 101;
        letter-spacing: 10px;
    }

    .full-screen {
        /*background-image:url(../../assets/img/MK_top.jpg)!important;*/
        display: flex;
        flex-direction: column;
    }

    .entrance-top {
        width: 100%;
        height: 106px;
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        color: #fff;
        padding: 0 30px;
        box-sizing: border-box;
        font-size: 14px;
        background-image: url(../../assets/img/MK_top.png);
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% 100%;
    }

    .entrance-top div:nth-child(1) span {
        color: #008fff;
    }

    .statistic-box {
        width: 100%;
        height: 70px;
        top: 90px;
        left: 0;
        position: absolute;
    }

    .num-box{
        width:100%;
        height: 50px;
        position: relative;
        margin-bottom: 6px;
    }
    .num-box .num {
        width: auto;
        color: #fff;
        font-size: 44px;
        letter-spacing: 8px;
        font-family: 'Acens';
        text-shadow:0 0 12px rgba(0,216,255,.5);
    }
    .num-box .num.fs{
        text-shadow:0 0 12px rgba(255,0,0,.5);
    }
    .num-box.overOne .num{
        letter-spacing: 12px;
    }
    .num-desc {
        color: #fff;
        font-size: 16px;
        font-family: 'Bdzyjt';
        text-shadow: 0 0 12px rgba(0,216,255,.5)!important;
    }
    .num-desc.fs{
        text-shadow:0 0 12px rgba(255,0,0,.5)!important;
    }
    .num-desc_s {
        color: #fff;
        font-size: 14px;
        flex: 1;
        font-family: 'Bdzyjt';
    }

    .top-bg {
        width: 70%;
        position: absolute;
        left: 15%;
        top: 200px;
        height: 70px;
        /*background-image:url(../../assets/img/Large_screen.png);*/
        background-position: center;
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }

    .seat-list {
        width: 10%;
        height: 20px;
        position: absolute;
        left: 10px;
        top: 30%;
    }

    .seat-title {
        color: #FFFFFF;
        line-height: 20px;
        font-size: 18px;
        padding-left: 6px;
        border-left: 4px solid #00CFFB;
        text-shadow: 0px 2px 8px #00cffb, 0px 0px 8px #00cffb;
    }

    .seat-team {
        margin-top: 50px;
        background-color: rgba(0, 0, 0, .3);
        padding: 2px 0 2px 6px;
    }

    .seat-team>div {
        margin: 10px 0;
        font-size: 0;
        padding-left: 10px;
        position: relative;
    }

    .seat-team>div i {
        width: 10px;
        position: absolute;
        left: 5px;
        top: 4px;
        vertical-align: middle;
        height: 10px;
    }

    .seat-team>div div {
        font-size: 13px;
        color: #fff;
        margin-left: 10px;
    }

    .top-title {
        height: 150px;
    }

    .topList {
        width: 100%;
        height: 110px;
        display: flex;
        justify-content: space-between;
    }

    .leftLogo {
        background-image: url("../../assets/img/gj.gif");
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
        mix-blend-mode:lighten;
    }

    .rightLogo {
        background-image: url("../../assets/img/fs.gif");
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
        mix-blend-mode:lighten;
    }

    .icon-defen {
        position: absolute;
        font-size: 50px;
        left: 12%;
        top: 5%;
    }

    .container {
        width: 98%;
        position: absolute;
        left: 1%;
        top: 280px;
        right:1%;
        bottom: 10px;
    }
    .leftChart {
        width: 22%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .leftChart .left_bar {
        width: 100%;
        height: 45%;
    }

    .leftChart .left_table {
        width: 100%;
        height: 55%;
        margin-top: 30px;
        /*background-color: blueviolet;*/
    }

    .centerShow {
        width: 56%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .centerShow .chainArea {
        width: 100%;
        height: 62%;
        /*background-color: cyan;*/
    }

    .centerShow .chartArea {
        width: 100%;
        height: 38%;
        /*background-color: white;*/
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .chartArea .center_left,
    .chartArea .center_right {
        width: 50%;
        height: 100%;
        position: relative;
        /*background-color: yellowgreen;*/
    }

    .rightChart {
        width: 22%;
        height: 100%;
        /*background-color: yellow;*/
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .rightChart .right_pie {
        width: 100%;
        height: 45%;
        /*background-color: wheat;*/
    }

    .rightChart .right_table {
        width: 100%;
        height: 55%;
        margin-top: 30px;
        /*background-color: blueviolet;*/
    }

    .tableTitle {
        width: 100%;
        height: 30%;
        /*background-color: rosybrown;*/
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .tableList {
        width: 100%;
        height: 70%;
    }

    .tableNum {
        width: 100%;
        height: 100%;
        padding-top: 5px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-around;
    }

    .tableNum .Num {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
    }

    .dv-data_0 {
        /*position: absolute;*/
        /*left: 0;*/
        /*top: 0;*/
        margin: auto;
        width: 60%;
        height: 140px;
        z-index: 1;
    }

    .dv-data {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        /*background-color: rgba(0,0,0,0.1);*/
    }

    .chentuo {
        position: absolute;
        z-index: 2;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        /*background-image: linear-gradient(rgba(0,0,0,0) , rgba(0,0,0,0.5));*/
    }

    .c-top {
        padding-left: 5px;
        color: #fff;
        text-align: left;
        font-size: 16px;
        text-shadow: 0px 0px 6px #00cffb, 0px 0px 6px #00cffb;
        border-left: 4px solid #00E9FF;
    }

    .c-content {
        width: 100%;
        height: 100%;
        position: relative;
    }

    .lunbo {
        height: 100%;
    }

    span.row,
    span.col {
        position: absolute;
        padding: 3px;
        border-style: solid;
        border-color: #00cffb;
    }

    .row1 {
        border-width: 1px 0 0 1px;
        top: 2px;
        left: 1px;
    }

    .row2 {
        border-width: 1px 1px 0 0;
        top: 2px;
        right: 1px;
    }

    .col1 {
        border-width: 0 0 1px 1px;
        bottom: 2px;
        left: 1px;
    }

    .col2 {
        border-width: 0 1px 1px 0;
        bottom: 2px;
        right: 1px;
    }

    .commonBox {
        display: flex;
        justify-content: space-around;
    }

    .leftBox,
    .rightBox {
        width: 46%;
        height: 100%;
    }

    .swiper-container {
        padding-top: 40px;
        box-sizing: border-box;
        width: 100%;
        /*height: 180px;*/
        height: 100%;
        position: relative;
    }

    .swiper-button-prev {
        position: absolute;
        top: 20px;
        left: auto;
        right: 100px;
        z-index: 1000;
    }

    .swiper-button-next {
        position: absolute;
        top: 20px;
        left: auto;
        right: 0px;
        z-index: 1000;
    }

    .swiper-button-prev:after,
    .swiper-button-next:after {
        font-size: 12px;
    }

    .lunbo-top {
        width: 100%;
        height: 40px;
        position: absolute;
        top: 0px;
        left: 0;
        z-index: 150;
    }

    .lunbo-top .lunbo-title {
        padding-left: 5px;
        color: #fff;
        text-align: left;
        font-size: 16px;
        text-shadow: 0px 0px 6px #00cffb, 0px 0px 6px #00cffb;
        border-left: 4px solid #00E9FF;
    }

    .lunbo-top .lunbo-title2 {
        padding-left: 5px;
        color: #fff;
        text-align: left;
        font-size: 16px;
        font-weight: bold;
    }

    .current-title {
        width: 80px;
        height: 40px;
        position: absolute;
        top: 0px;
        left: auto;
        right: 20px;
        font-size: 12px;
        line-height: 40px;
        z-index: 1000;
        color: #fff;
    }

    .swiper-pagination {
        width: 100px;
        height: 40px;
        position: absolute;
        top: 0px;
        left: auto;
        right: 20px;
        font-size: 12px;
        line-height: 40px;
        z-index: 1000;
    }

    .start {
        width: 60px;
    }

    .start .start-img {
        width: 100%;
        height: 60px;
        background-image: url("../../assets/img/Malicious_IP.png");
        background-position: center;
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }

    .start .start-text {
        width: 100%;
        font-size: 12px;
        color: #fff;
        margin-top: 5px;
        text-align: center;
        cursor: pointer;
    }

    .step {
        width: 100px;
        min-height: 20px;
        border-left: 2px solid rgba(0, 0, 0, 0);
        border-right: 2px solid rgba(0, 0, 0, 0);
        padding: 20px 0;
        margin: 0 20px;
    }

    .step.moreOne {
        border-left: 2px solid #D2D2D7;
        border-right: 2px solid #D2D2D7;
    }

    .step.moreOne>div:nth-child(1) {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .step.moreOne>div:last-child {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 50%);
    }

    .step::before {
        box-sizing: inherit;
        content: '';
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: -22px;
        border-top: 2px solid #D2D2D7;
        width: 22px;
    }

    .step::after {
        box-sizing: inherit;
        content: '';
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: -22px;
        border-top: 2px solid #D2D2D7;
        width: 22px;
    }

    .link-item .step:last-child::after {
        width: 0px;
    }

    .step .device {
        width: 60px;
        height: 60px;
        cursor: pointer;
        position: relative;
        background-image: url("../../assets/img/SB_Success.png");
        background-position: right top;
        background-repeat: no-repeat;
        background-size: 80% 80%;
    }

    .step .device.alarm {
        background-image: url("../../assets/img/SB_fail.png");
    }

    .step .device::before {
        box-sizing: inherit;
        content: '';
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: -20px;
        border-top: 2px solid #D2D2D7;
        width: 20px;
    }

    .step .device::after {
        box-sizing: inherit;
        content: '';
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: -20px;
        border-top: 2px solid #D2D2D7;
        width: 20px;
    }

    .step.moreOne>div:nth-child(1)::before,
    .step.moreOne>div:nth-child(1)::after {
        width: 20px;
    }

    .step.moreOne>div:last-child::before,
    .step.moreOne>div:last-child::after {
        width: 20px;
    }

    .link-item .step:last-child.lastStepOne .device::after {
        width: 0px;
    }

    .device-detail-box {
        position: fixed;
        width: 500px;
        height: 118px;
        padding: 20px;
        background: rgba(0, 0, 0, .8);
        left: 0;
        top: 0;
        z-index: 99999;
        box-shadow: 0 0 8px #f00;
        border: 1px solid #fff;
    }

    .device-detail-box:before {
        box-sizing: inherit;
        width: 30px;
        height: 10px;
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        background-image: url("../../assets/img/Popup_topBorder.png");
        background-position: left center;
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }

    .device-detail-box:after {
        box-sizing: inherit;
        width: 30px;
        height: 10px;
        content: '';
        position: absolute;
        bottom: 0;
        right: 0;
        background-image: url("../../assets/img/Popup_bottomBorder.png");
        background-position: left center;
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }

    .top-table {
        box-sizing: border-box;
    }
    .center-top{
        background-image: url("../../assets/img/BIG_bg.png");
        background-position: center;
        background-repeat: no-repeat;
        background-size: 100%;
    }
    .attrack_defense_score-box {
        width: 510px;
        height: 26px;
        box-sizing: border-box;
        position: absolute;
        left: 50%;
        top: -100px;
        z-index: 10;
        opacity: 0;
        margin-left: -255px;
        border:2px solid rgba(255,255,255,.5);
        background: rgba(0,0,0,.5);
        border-radius: 2px;
    }

    .attrack_defense_score-box.animated{
        animation: moveone 1s forwards;
    }
    @keyframes moveone {
        0% {
            top: -100px;
            opacity: 0;
        }

        100% {
            top: 0px;
            opacity: 1;
        }
    }
    .score {
        width: 50px;
        height: 100%;
        color: #fff;
        font-family: 'Acens';
    }

    .score-left {
        text-shadow: 0px 0px 10px #00aaff, 0px 0px 10px #00aaff;
    }

    .score-right {
        text-shadow: 0px 0px 10px #fe110c, 0px 0px 10px #fe110c;
    }

    .score-middle {
        width: 410px;
        height: 100%;
    }

    .score-middle>div {
        width: 3px;
        height: 50%;
        margin-right: 1px;
        background-color: rgba(153, 153, 153, .3);
    }

    .score-middle>div.attrackTeam {
        background-color: #00aaff;
    }

    .score-middle>div.defenseTeam {
        background-color: #fe110c;
    }

    .time-box {
        width: 100%;
        position: absolute;
        left: 0;
        top: 25px;
        height: 30px;
        color: #fff;
        font-size: 13px;
    }

    .time-box span {
        color: #fff;
        font-size: 16px;
        font-family: 'digital-7', '微软雅黑', '宋体', 'Helvetica';
    }

    .chart-box {
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

    .chart-box.border {
        border: 1px solid #00274e;
    }

    .chart-box.bg {
        background-color: rgba(75, 172, 249, .2);
    }

    .chart-top {
        position: absolute;
        left: 0;
        top: 0;
        height: 36px;

        .chart-title {
            color: #fff;
            font-size: 16px;
        }
        .defense-title {
            font-family: 'Bdzyjt';
            color: #fff;
            font-size: 16px;
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
    .ad-left-fire{
        width:40%;
        height:90%;
        position: absolute;
        left:3%;
        top:50%;
        z-index: 2;
        opacity: 0;
        background-image: url("../../assets/img/r1.gif");
        background-position:right center;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        transform: translateY(-50%);
        mix-blend-mode:lighten;
    }
    .ad-right-fire{
        width:40%;
        height:90%;
        position: absolute;
        right:3%;
        top:55%;
        z-index: 2;
        opacity: 0;
        background-image: url("../../assets/img/r2.gif");
        background-position:left center;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        transform: translateY(-50%);
        mix-blend-mode:lighten;
    }
    .ad-left-fire.animated,.ad-right-fire.animated,.fire-bg.animated,.teamnames.animated{
        animation: moveFire 3s forwards;
    }
    @keyframes moveFire {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }
    .middle-long{
        width:30%;
        height:80%;
        position: absolute;
        left:50%;
        top:100%;
        z-index: 1;
        opacity: 0;
        transform: translate(-50%,-50%);
        background-image: url("../../assets/img/Long.png");
        background-position: center;
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }
    .middle-long.animated{
        animation: moveLong 1s forwards;
    }
    @keyframes moveLong {
        0% {
            top: 100%;
            opacity: 0;
        }

        100% {
            top:50%;
            opacity: 1;
        }
    }
    .ad-left-shou{
        width:30%;
        height:50%;
        position: absolute;
        left:0;
        top:50%;
        z-index: 5;
        opacity: 0;
        background-image: url("../../assets/img/left_hand.png");
        background-position: center;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        transform: translateY(-50%);
    }
    .ad-left-shou.animated{
        animation: moveLeftSou 1.5s forwards;
    }
    @keyframes moveLeftSou {
        0% {
            left:0;
            opacity: 0;
        }

        30% {
            left:26%;
            opacity: 1;
        }
        100% {
            left:15%;
            opacity: 1;
        }
    }
    .ad-right-shou{
        width:30%;
        height:50%;
        position: absolute;
        right:0;
        top:50%;
        z-index: 5;
        opacity: 0;
        background-image: url("../../assets/img/right_hand.png");
        background-position: center;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        transform: translateY(-50%);
    }
    .ad-right-shou.animated{
        animation: moveRightSou 1.5s forwards;
    }
    @keyframes moveRightSou {
        0% {
            right:0;
            opacity: 0;
        }
        30% {
            right:26%;
            opacity: 1;
        }
        100% {
            right:15%;
            opacity: 1;
        }
    }
    .middle-vs{
        width:26%;
        height:70%;
        position: absolute;
        left:37%;
        top:15%;
        opacity: 0;
        z-index: 6;
        /*transform: translate(-50%,-50%);*/
        background-image: url("../../assets/img/advs.png");
        background-position: center;
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }
    .middle-vs.animated{
        -webkit-backface-visibility: visible !important;
        backface-visibility: visible !important;
        animation: flipInX 1s forwards;
        visibility: visible !important;
        -webkit-animation-fill-mode: both;
        animation-fill-mode: both;
    }
    @keyframes flipInX {
        from {
            -webkit-transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
            transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
            -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
            opacity: 0;
        }

        40% {
            -webkit-transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
            transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
            -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
        }

        60% {
            -webkit-transform: perspective(400px) rotate3d(1, 0, 0, 10deg);
            transform: perspective(400px) rotate3d(1, 0, 0, 10deg);
            opacity: 0.5;
        }

        80% {
            -webkit-transform: perspective(400px) rotate3d(1, 0, 0, -5deg);
            transform: perspective(400px) rotate3d(1, 0, 0, -5deg);
            opacity: 1;
        }

        100%{
            -webkit-transform: perspective(400px);
            transform: perspective(400px);
            opacity: 1;
        }
    }
    .fire-bg{
        width:60%;
        height:55%;
        position: absolute;
        left:50%;
        top:50%;
        z-index: 10;
        opacity: 0;
        transform: translate(-50%,-50%);
        background-image: url("../../assets/img/spark.png");
        background-position: center;
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }
    .teamnames{
        width:100%;
        height:40px;
        position: absolute;
        left:0;
        bottom:0;
        opacity: 0;
        span{
            font-size:18px;
            margin: 0 20px;
            font-weight: 600;
        }
    }
    .teamnames>span:nth-child(1){
        color:#10adfc;
    }
    .teamnames>span:nth-child(2){

        color:#ff100a;
    }
</style>
<style>
    html,
    body,
    #app {
        height: 100%;
        background-color: #010205;
        min-width: auto!important;
    }

    .configRank .info-name {
        text-indent: 15px;
        text-align: left;
        color: #44c3fe;
    }

    .configRank.dv-scroll-ranking-board .ranking-column {
        border-bottom: 2px solid rgba(68, 195, 254, 0.5)
    }

    .configRank.dv-scroll-ranking-board .ranking-column .inside-column {
        background: #44c3fe;
    }

    .configRank.dv-scroll-ranking-board .ranking-info .rank {
        color: #44c3fe;
    }

    .configRank.dv-scroll-ranking-board .ranking-info .ranking-value {
        color: #44c3fe;
        font-size: 18px;
    }

    .v-modal {
        z-index: 998!important;
    }

    .defense-command .el-dialog__header {
        text-align: left;
    }

    .swiper-pagination .swiper-pagination-bullet {
        width: 16px;
        height: 16px;
        line-height: 16px;
        background: none;
    }

    .deviceLogs .swiper-button-prev {
        position: absolute;
        top: 20px;
        left: auto;
        right: 110px;
        z-index: 1000;
    }

    .dv-scroll-board .header .header-item {
        padding: 0 4px;
        font-size:12px;
    }
    .dv-scroll-board .rows .row-item{
        font-size:12px;
    }
</style>
