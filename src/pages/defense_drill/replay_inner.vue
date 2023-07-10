<template>
    <div class="list" style="height:100%;">
        <div class="w100" style="box-sizing: border-box;height: 100%">
            <div class="event-content w100"  style="background:#fff;position: relative;overflow-y:auto"  :style="{'height':tabHeight+'px'}">
                <div class="ub ub-pj w100 ub-ac" style="padding:10px">
                    <div  style="color:rgba(0,0,0,0.9);font-size:14px">
                        演练复盘
                    </div>
                    <div v-if="is_add!=1">
                        <el-button size="small" @click="back">返回</el-button>
                    </div>
                    <div v-if="is_add==1">
                        <el-button size="small" @click="back">返回</el-button>
                        <el-button size="small" type="primary" @click="addAttrackDialog=true">提交攻击步骤</el-button>
                        <el-button size="small" type="primary" @click="sayDialog=true">总结陈述</el-button>
                        <el-button size="small" type="primary" @click="overReplayDialog = true">结束复盘</el-button>
                    </div>
                </div>
                <div class="ub ub-pj time-line" style="padding-left:100px;">
                    <div class="time-tree" style="width:1022px;padding-top:30px;">
                        <div class="ub ub-pc top-replay">攻击方演练复盘VS防守方演练复盘</div>
                        <div class="ver-line" style="padding-bottom:50px;position:relative">
                            <div class="ub ub-ver ub-f1 ub-pe list">
                                <div class="list-item" v-for="(item,index) in tableData" :key="index">
                                    <div class="list-con">
                                        <div style="width:10px;height:10px;border-radius:10px;background:white;position:absolute;right:-66px;border: 2px solid rgba(56,125,238,1); "></div>
                                        <div class="ub ub-pj w100">
                                            <div class="item-title">{{item.attackStepData.attackData|NullStr}}</div>
                                            <div class="replay-opation" v-if="is_add==1">
                                                <i style="font-size:13px;color: rgba(0,0,0,0.26);margin-right:10px;cursor: pointer;" class="el-icon-edit" @click="handelEditAttrack(item)"></i>
                                                <i style="font-size:13px;color: rgba(0,0,0,0.26);margin-right:10px;cursor: pointer;" class="el-icon-delete" @click="deleteReplayShow(item.attackStepData.id,1)"></i>
                                                <i style="font-size:13px;color: rgba(0,0,0,0.26);cursor: pointer;" class="el-icon-view" @click="handelSeeAttrack(item)"></i>
                                            </div>
                                        </div>
                                        <div class="ub ub-pj">
                                            <div style="font-size:13px;color:rgba(222,116,0,1);text-align: left;">攻击路径：{{item.attackStepData.path|NullStr}}</div>
                                            <div class="time1">{{item.attackStepData.attackTime|NullStr}}</div>
                                        </div>
                                        <div style="height:220px;overflow:auto">
                                            <div class="ub relut">
                                                <div style="font-weight:600">攻击步骤：</div>
                                                <div class="ub ub-f1 htmlStrImg htmlStrImgNew line-2" v-html="item.attackStepData.attackStep"></div>

                                            </div>
                                            <div class="ub relut">
                                                <div style="font-weight:600">攻击成果：</div>
                                                <div class="ub ub-f1 htmlStrImg htmlStrImgNew line-2" v-html="item.attackStepData.gain"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="right-item">
                                        <div v-if="item.defenseStepData===''" class="w100 add">
                                            <div
                                                v-if="is_add==1"
                                                @click="addDefense(item)"
                                                class="ub ub-ver ub-ac ub-pc replay-inner-add-btn"
                                                style="
                                                width:130px;
                                                height:130px;
                                                margin-right: 62px;
                                                cursor:pointer;
                                                background: rgba(235,241,245,0.50);
                                                border: 1px solid rgba(221,221,221,1);
                                                border-radius: 10px;">
                                                <div style="font-size:30px; color: #387DEE;text-shadow: 0 0 20px #387DEE;" class="el-icon-plus"></div>
                                                <div style="font-size:13px; color: #387DEE;">添加步骤</div>
                                                <span class="add-bg"></span>
                                            </div>
                                        </div>
                                        <div v-else class="w100 right">
                                            <div class="list-con">
                                                <div style="width:10px;height:10px;border-radius:10px;background:white;position:absolute;left:-68px;border: 2px solid rgba(227,77,89,1); "></div>
                                                <div class="ub ub-pj w100">
                                                    <div v-if="item.defenseStepData.isFind==1" class="item-title">{{item.defenseStepData.defenseGainData|NullStr}}</div>
                                                    <div v-else class="item-title">未发现</div>
                                                    <div class="replay-opation" v-if="is_add==1">
                                                        <i style="font-size:13px;color: rgba(0,0,0,0.26);margin-right:10px;cursor: pointer;" class="el-icon-edit" @click="handelEditDefense(item)"></i>
                                                        <i style="font-size:13px;color: rgba(0,0,0,0.26);margin-right:10px;cursor: pointer;" class="el-icon-delete" @click="deleteReplayShow(item.defenseStepData.id,2)"></i>
                                                        <i style="font-size:13px;color: rgba(0,0,0,0.26);cursor: pointer;" class="el-icon-view" @click="handelSeeDefense(item)"></i>

                                                    </div>
                                                </div>
                                                <div class="ub ub-pj">
                                                    <div style="font-size:13px;color:#feba01;text-align: left;">{{item.defenseStepData.isFind==1?'已发现':'--'}} {{item.defenseStepData.isDispose==1?'已处置':'--'}}</div>
                                                    <div class="time1">{{item.defenseStepData.defenseTime|NullStr}}</div>
                                                </div>
                                                <div style="height:220px;overflow:auto">
                                                    <div class="ub relut">
                                                        <div style="font-weight:600">防守步骤：</div>
                                                        <div class="ub ub-f1 htmlStrImg htmlStrImgNew line-2" v-html="item.defenseStepData.defenseStep"></div>
                                                    </div>
                                                    <div class="ub relut">
                                                        <div style="font-weight:600">改进意见：</div>
                                                        <div class="ub ub-f1 htmlStrImg htmlStrImgNew line-2" v-html="item.defenseStepData.opinion"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div v-if="is_add==1" class="ub ub-pe w100">
                                <div
                                    @click="addAttrackDialog=true"
                                    class="ub ub-ver ub-ac ub-pc replay-inner-add-btn"
                                    style="
                                    width:130px;
                                    height:130px;
                                    margin-right: 62px;
                                    cursor:pointer;
                                    background: rgba(235,241,245,0.50);
                                    border: 1px solid rgba(221,221,221,1);
                                    border-radius: 10px;">
                                    <div style="font-size:30px; color: #387DEE;text-shadow: 0 0 20px #387DEE;" class="el-icon-plus"></div>
                                    <div style="font-size:13px; color: #387DEE;">添加步骤</div>
                                    <span class="add-bg"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="right-top" style="width:390px;padding:30px 10px;">
                        <div class="right-tips">
                            <div>
                                <div class="tips-title">当前复盘的攻击结果</div>
                                <div class="tips-text">攻击手段：{{replayData.attack_way|NullStr}}</div>
                                <div class="tips-text">攻击得分：<span style="color:#387dee">{{replayData.score|NullStr}}</span></div>
                                <div class="tips-text result">攻击成果<span v-html="replayData.gain"></span></div>
                                <div class="tips-text">攻击时间：{{replayData.attack_time|NullStr}}</div>
                                <div class="tips-text">
                                    <el-button type="text" @click="seeDialog = true">查看详情</el-button>
                                </div>
                            </div>
                        </div>
                        <div class="right-tips" style="margin-top: 20px;">
                            <div>
                                <div class="tips-title">总结陈述</div>
                                <div class="tips-text result">
                                    <div v-html="zongjie"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <el-dialog title="攻击步骤" :visible.sync="addAttrackDialog" width="700px" custom-class="common-dialog">
            <el-form ref="attrackSteps" :model="{}" label-width="100px" label-position="top">
                <div v-for="(item,index) in attrackSteps" :key="index" class="ub ub-ver w100 marB30">
                    <div v-if="attrackSteps.length>1" class="ub ub-ac ub-pj w100">
                        <div style="color:#387DEE;">攻击步骤{{index+1}}</div>
                        <div>
                            <el-button style="color:#d30e18;" type="text" @click="delAttrackStep(index)">删 除</el-button>
                        </div>
                    </div>
                    <div class="w100 attrackSteps" :class="{'active':attrackSteps.length>1}">
                        <div class="ub ub-pj w100">
                            <div class="ub">
                                <el-form-item label="攻击时间：" size="small">
                                    <el-date-picker clearable value-format="yyyy-MM-dd HH:mm:ss" v-model="item.attackTime" type="datetime" placeholder="请选择">
                                    </el-date-picker>
                                </el-form-item>
                            </div>
                            <div class="ub">
                                <el-form-item label="攻击路径：" size="small">
                                    <el-input clearable placeholder="请输入" v-model.trim="item.path" autocomplete="off"></el-input>
                                </el-form-item>
                            </div>
                            <div class="ub">
                                <el-form-item label="攻击手段：" size="small">
                                    <el-select clearable filterable v-model="item.attackMode" placeholder="请选择">
                                        <el-option v-for="item in attrack_ways" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                        </div>
                        <div>
                            <el-form-item label="攻击步骤：" style="width:100%;">
                                <vue-ueditor-wrap v-model="item.attackStep" :config="myConfig"></vue-ueditor-wrap>
                            </el-form-item>
                            <el-form-item label="攻击成果：" style="width:100%;">
                                <vue-ueditor-wrap v-model="item.gain" :config="myConfig"></vue-ueditor-wrap>
                            </el-form-item>
                        </div>
                    </div>

                </div>
                <el-form-item label="">
                    <el-button type="text" icon="el-icon-plus" @click="addAttrackStep">添加步骤</el-button>
                </el-form-item>
            </el-form>
            <span slot="footer" class="ub ub-pe dialog-footer">
                <el-button size="small" style="margin-left: 10px;" @click="addAttrackDialog = false">取消</el-button>
                <el-button title="确 定" size="small" type="primary" @click="addAttrack">确定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="防御步骤" :visible.sync="addDefenseDialog" width="700px" custom-class="common-dialog">
            <el-form ref="defenseSteps" :model="defenseSteps" label-width="100px"  label-position="top">
                <div class="ub ub-ver w100 marB30">
                    <div class="w100 attrackSteps">
                        <div class="ub w100 ub-pj">
                            <div class="ub">
                                <el-form-item label="是否发现：" size="small">
                                    <el-select clearable filterable v-model="defenseSteps.isFind" placeholder="请选择">
                                        <el-option label="否" value="0"></el-option>
                                        <el-option label="是" value="1"></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div v-if="defenseSteps.isFind==1" class="ub">
                                <el-form-item label="是否处置：" size="small">
                                    <el-select clearable filterable v-model="defenseSteps.isDispose" placeholder="请选择">
                                        <el-option label="否" value="0"></el-option>
                                        <el-option label="是" value="1"></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div v-if="defenseSteps.isFind==1" class="ub">
                                <el-form-item label="选择成果：" size="small">
                                    <el-select clearable filterable v-model="defenseSteps.defenseGainId" placeholder="请选择">
                                        <el-option v-for="item in records" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                        </div>
                        <div class="ub w100 ub-pj">
                            <div class="ub" style="width:180px">
                                <el-form-item label="防御时间：" size="small">
                                    <el-date-picker clearable value-format="yyyy-MM-dd HH:mm:ss" v-model="defenseSteps.defenseTime" type="datetime" placeholder="请选择">
                                    </el-date-picker>
                                </el-form-item>
                            </div>
                        </div>
                        <div>
                            <el-form-item label="防守步骤：" style="width:100%;">
                                <vue-ueditor-wrap v-model="defenseSteps.defenseStep" :config="myConfig"></vue-ueditor-wrap>
                            </el-form-item>
                            <el-form-item label="改进意见：" style="width:100%;">
                                <vue-ueditor-wrap v-model="defenseSteps.opinion" :config="myConfig"></vue-ueditor-wrap>
                            </el-form-item>
                        </div>

                    </div>

                </div>
            </el-form>
            <span slot="footer" class="ub ub-pe dialog-footer">
                <el-button size="small" style="margin-left: 10px;" @click="addDefenseDialog = false">取消</el-button>
                <el-button title="确 定" size="small" type="primary" @click="add_defense">确定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="编辑步骤" :visible.sync="editAttrackDialog" width="700px" custom-class="common-dialog">
            <el-form ref="attrackSteps" :model="{}" label-width="100px" label-position="top">
                <div class="ub ub-ver w100 marB30">
                    <div class="w100 attrackSteps">
                        <div class="ub w100 ub-pj">
                            <div class="ub">
                                <el-form-item label="攻击时间：" size="small">
                                    <el-date-picker clearable value-format="yyyy-MM-dd HH:mm:ss" v-model="editAttrack.attackTime" type="datetime" placeholder="请选择">
                                    </el-date-picker>
                                </el-form-item>
                            </div>
                            <div class="ub">
                                <el-form-item label="攻击路径：" size="small">
                                    <el-input clearable placeholder="请输入" v-model.trim="editAttrack.path" autocomplete="off"></el-input>
                                </el-form-item>
                            </div>
                            <div class="ub">
                                <el-form-item label="攻击手段：" size="small">
                                    <el-select clearable filterable v-model="editAttrack.attackMode" placeholder="请选择">
                                        <el-option v-for="item in attrack_ways" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                        </div>
                        <div>
                            <el-form-item label="攻击步骤：" style="width:100%;">
                                <vue-ueditor-wrap v-model="editAttrack.attackStep" :config="myConfig"></vue-ueditor-wrap>
                            </el-form-item>
                            <el-form-item label="攻击成果：" style="width:100%;">
                                <vue-ueditor-wrap v-model="editAttrack.gain" :config="myConfig"></vue-ueditor-wrap>
                            </el-form-item>
                        </div>
                    </div>

                </div>

            </el-form>
            <span slot="footer" class="ub ub-pe dialog-footer">
                <el-button size="small" style="margin-left: 10px;" @click="editAttrackDialog = false">取消</el-button>
                <el-button title="确 定" size="small" type="primary" @click="editAttrackStep">确定</el-button>
            </span>
        </el-dialog>
        <DeleteDialog
            :dialogVisible = deleteDialog
            @delete="deleteReplay"
            @cancel="deleteDialog = false">
        </DeleteDialog>
        <el-dialog title="提示" :visible.sync="overReplayDialog" width="700px" custom-class="common-dialog">
            <span>确定结束复盘吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" style="margin-left: 10px;" @click="overReplayDialog = false">取消</el-button>
                <el-button title="确 定" size="small" type="primary" @click="overReplay">确定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="总结陈述" :visible.sync="sayDialog" width="700px" custom-class="common-dialog">
            <div style="width:100%;margin: 0 auto;">
                <vue-ueditor-wrap v-model="summary" :config="myConfig"></vue-ueditor-wrap>
            </div>
            <span slot="footer" class="ub ub-pe dialog-footer">
                <el-button size="small" style="margin-left: 10px;" @click="sayDialog = false">取消</el-button>
                <el-button title="确 定" size="small" type="primary" @click="addSay">确定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="攻击步骤详情" :visible.sync="detailAttrackDialog" width="700px" custom-class="common-dialog">
            <div class="w100">
                <div class="ub relut w100">
                    <div class="detail">攻击方式：</div>
                    <div style="color: #387DEE;text-shadow: 0px 0px 16px rgb(35,220,2)" class="ub ub-f1">{{detailAttrack.attackData|NullStr}} </div>
                </div>
                <div class="ub relut w100">
                    <div style="color:rgb(254, 186, 1)">攻击路径：</div>
                    <div style="color:rgb(254, 186, 1)" class="ub ub-f1">{{detailAttrack.path|NullStr}} </div>
                </div>
                <div class="ub relut w100">
                    <div class="detail">攻击步骤：</div>
                    <div class="ub ub-f1 htmlStrImg htmlStrImgWhite" v-html="detailAttrack.attackStep"></div>
                </div>
                <div class="ub relut w100">
                    <div class="detail">攻击成果：</div>
                    <div class="ub ub-f1 htmlStrImg htmlStrImgWhite" v-html="detailAttrack.gain"></div>
                </div>
            </div>
        </el-dialog>
        <el-dialog title="当前复盘的攻击结果详情" :visible.sync="seeDialog" width="700px" custom-class="common-dialog">
            <el-descriptions size="mini" title="" :column="1" border>
                <el-descriptions-item label="攻击手段">{{ replayData.attack_way }}</el-descriptions-item>
                <el-descriptions-item label="攻击得分">{{ replayData.score }}</el-descriptions-item>
                <el-descriptions-item label="攻击成果">
                    <div v-html="replayData.gain"></div>
                </el-descriptions-item>
                <el-descriptions-item label="攻击时间">{{ replayData.attack_time }}</el-descriptions-item>
                <el-descriptions-item label="提交人">{{ replayData.create_name }}</el-descriptions-item>
                <el-descriptions-item label="选择演练">{{ replayData.match_name }}</el-descriptions-item>
                <el-descriptions-item label="目标IP">{{ replayData.target_ip }}</el-descriptions-item>
                <el-descriptions-item label="URL">{{ replayData.url }}</el-descriptions-item>
                <el-descriptions-item label="攻击IP">{{ replayData.attack_ip }}</el-descriptions-item>
                <el-descriptions-item label="备注">
                    <div v-html="replayData.remark"></div>
                </el-descriptions-item>
                <el-descriptions-item label="提交时间">{{ replayData.create_time }}</el-descriptions-item>
                <el-descriptions-item label="攻击步骤">
                    <div v-html="replayData.step"></div>
                </el-descriptions-item>
            </el-descriptions>
            <span slot="footer" class="ub ub-pe dialog-footer">
                <el-button size="small" style="margin-left: 10px;" @click="seeDialog = false">取消</el-button>
            </span>
        </el-dialog>
        <el-dialog title="防守步骤详情" :visible.sync="detailDefenseDialog" width="700px" custom-class="common-dialog">
            <div class="w100" style="padding:0 20px;box-sizing: border-box;">
                <div class="ub relut w100 ub-ac">
                    <div class="detail">防守方式：</div>
                    <div v-if="detailDefense.isFind==1"  class="ub ub-f1 item-title">{{detailDefense.defenseGainData|NullStr}} </div>
                    <div v-else class="item-title">未发现</div>
                </div>
                <div class="ub relut w100">
                    <div style="font-size:13px;color:#feba01;text-align: left;margin-top: 10px;">{{detailDefense.isFind==1?'已发现':'--'}} {{detailDefense.isDispose==1?'已处置':'--'}}</div>
                </div>
                <div class="ub relut w100">
                    <div class="detail">防守步骤：</div>
                    <div class="ub ub-f1 htmlStrImg htmlStrImgWhite" v-html="detailDefense.defenseStep"></div>
                </div>
                <div class="ub relut w100">
                    <div class="detail">改进意见：</div>
                    <div class="ub ub-f1 htmlStrImg htmlStrImgWhite" v-html="detailDefense.opinion"></div>
                </div>
            </div>
        </el-dialog>
    </div>

</template>

<script>
import {
    get_record_attrack_sets,
    add_Attrack_relay,
    get_Attrack_defense_relay,
    get_replay_record,
    edit_defense_relay,
    edit_Attrack_relay,
    deleteReplay,
    add_say,
    voer_replay
} from '../../server/defense_drill/defense.js'
import VueUeditorWrap from '../../components/vue-ueditor-wrap.vue' // ES6 Module
import ueditorConfig from '../../mixins/ueditorConfig'
export default {
    components: {
        VueUeditorWrap
    },
    name: 'ReplayInner',
    mixins: [ueditorConfig],
    data() {
        return {
            tabHeight: document.body.clientHeight - 90,
            seeForm: {},
            seeDialog: false,
            is_add: 0,
            overReplayDialog: false,
            detailDialog: false,
            detailCon: '',
            sayDialog: false,
            detailDefense: {
                defenseGainData: '',
                defenseStep: '',
                defenseTime: '',
                isDispose: '',
                isFind: '',
                opinion: ''
            },
            detailDefenseDialog: false,
            detailAttrack: {
                attackData: '',
                attackStep: '',
                attackTime: '',
                createTime: '',
                gain: '',
                path: '123.123.123.1'
            },
            detailAttrackDialog: false,
            summary: '', // 总结陈述
            isAddZJ: true,
            zongjie: '',
            zongjieId: '',
            deleteDialog: false,
            editAttrackDialog: false,
            editAttrack: {
                attackTime: '',
                path: '',
                attackMode: '',
                attackStep: '',
                gain: ''
            },
            attrackId: '',
            addDefenseDialog: false,
            addAttrackDialog: false,
            attrackSteps: [{
                attackTime: '',
                path: '',
                attackMode: '',
                attackStep: '',
                gain: ''
            }],

            defenseSteps: {
                defenseTime: '',
                isFind: '',
                isDispose: '',
                defenseGainId: '',
                defenseStep: '',
                opinion: ''
            },
            attrack_ways: [],
            defense_ways: [],
            tableData: [],
            records: [],
            isDefenseAdd: false,
            type: '',
            replayData: {
                attack_ip: '',
                attack_time: '',
                attack_way: '',
                attack_way_id: '',
                is_add: '',
                is_add_name: '',
                match_name: '',
                match_name_id: '',
                score: 0,
                gain: '',
                target_ip: ''
            }
        }
    },
    watch: {
        addAttrackDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.attrackSteps = [{
                        attackTime: '',
                        path: '',
                        attackMode: '',
                        attackStep: '',
                        gain: ''
                    }]
                }
            }
        },
        addDefenseDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.defenseSteps = {
                        defenseTime: '',
                        isFind: '',
                        isDispose: '',
                        defenseGainId: '',
                        defenseStep: '',
                        opinion: ''
                    }
                }
            }
        },
        sayDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    if (this.isAddZJ) {
                        this.$refs.summary = ''
                    }
                }
            }
        }
    },

    created() {
        this.is_add = this.$route.query.is_add
        let replayData = this.$getsessionStorage('replayData')
        console.log('replayData', replayData)
        this.replayData = this.$deepCopy(replayData)
    },
    mounted() {
        this.$nextTick(() => {
            this.get_set_info()
            this.initRecord()
            this.initSteps()
        })
    },
    methods: {
        ready(editorInstance) {
            // eslint-disable-next-line no-undef
            UE.dom.domUtils.setStyles(editorInstance.body, {
                color: '#fff', 'font-family': "'Microsoft Yahei','Helvetica Neue', Helvetica, STHeiTi, Arial, sans-serif", 'font-size': '14px'
            })
            console.log(`实例${editorInstance.key}已经初始化:`, editorInstance)
        },
        back() {
            this.$router.go(-1)
        },
        lookAll(str) {
            this.detailCon = str
            this.detailDialog = true
        },
        overReplay() {
            voer_replay({
                recordId: this.$route.query.id
            }).then((res) => {
                this.overReplayDialog = false
                this.$message({
                    message: '结束复盘成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.$router.go(-1)
                }, 1000)
            }).catch((error) => {
                console.log(error)
            })
        },
        addSay() {
            let data = {
                queryData: {},
                paramsData: {
                    recordId: this.$route.query.id,
                    stateContent: this.summary
                }
            }
            if (!this.isAddZJ) {
                data.paramsData.id = this.zongjieId
            }
            add_say(data).then((res) => {
                console.log('步骤', res)
                this.sayDialog = false
                if (this.isAddZJ) {
                    this.$message({
                        message: '添加成功',
                        type: 'success'
                    })
                } else {
                    this.$message({
                        message: '编辑成功',
                        type: 'success'
                    })
                }
                setTimeout(() => {
                    this.initSteps()
                }, 1500)
            }).catch((error) => {
                console.log(error)
            })
        },
        deleteReplayShow(id, type) {
            this.attrackId = id
            this.type = type
            this.deleteDialog = true
        },
        deleteReplay() {
            deleteReplay({
                type: this.type,
                id: this.attrackId
            }).then((res) => {
                this.deleteDialog = false
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.initSteps()
                }, 1500)
            }).catch((error) => {
                console.log(error)
            })
        },
        addAttrackStep() {
            this.attrackSteps.push({
                attackTime: '',
                path: '',
                attackMode: '',
                attackStep: '',
                gain: ''
            })
        },
        delAttrackStep(index) {
            this.attrackSteps.splice(index, 1)
        },
        initSteps() {
            let data = {
                queryData: {
                    recordId: this.$route.query.id
                },
                paramsData: {}
            }
            get_Attrack_defense_relay(data).then((res) => {
                console.log('步骤', res)

                if (res.stateGainData) {
                    this.zongjie = res.stateGainData.stateContent
                    this.zongjieId = res.stateGainData.id
                    this.isAddZJ = false
                }
                if (res.stepData.length > 0) {
                    this.tableData = res.stepData
                }
            }).catch((error) => {
                console.log(error)
            })
        },
        addAttrack() {
            this.attrackSteps = this.attrackSteps.map(item => {
                item.recordId = this.$route.query.id
                return item
            })
            let data = {
                queryData: {},
                paramsData: {
                    attackStepList: this.attrackSteps
                }
            }
            add_Attrack_relay(data).then((res) => {
                this.addAttrackDialog = false
                this.$message({
                    message: '添加成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.initSteps()
                }, 1500)
            }).catch((error) => {
                console.log(error)
            })
        },
        editAttrackStep() {
            console.log(' this.editAttrack', this.editAttrack)
            let data = {
                queryData: {},
                paramsData: {
                    id: this.attrackId,
                    attackTime: this.editAttrack.attackTime,
                    path: this.editAttrack.path,
                    attackMode: this.editAttrack.attackMode,
                    attackStep: this.editAttrack.attackStep,
                    gain: this.editAttrack.gain
                }
            }
            edit_Attrack_relay(data).then((res) => {
                this.editAttrackDialog = false
                this.$message({
                    message: '编辑成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.initSteps()
                }, 1500)
            }).catch((error) => {
                console.log(error)
            })
        },
        handelEditDefense(item) {
            this.isDefenseAdd = false
            this.attrackId = item.defenseStepData.id
            this.addDefenseDialog = true
            setTimeout(() => {
                this.defenseSteps.defenseTime = item.defenseStepData.defenseTime
                this.defenseSteps.isFind = item.defenseStepData.isFind + ''
                this.defenseSteps.isDispose = item.defenseStepData.isDispose + ''
                this.defenseSteps.defenseGainId = item.defenseStepData.defenseGainId + ''
                this.defenseSteps.defenseStep = item.defenseStepData.defenseStep
                this.defenseSteps.opinion = item.defenseStepData.opinion
            }, 1000)
        },
        handelEditAttrack(item) {
            console.log(item)
            this.attrackId = item.attackStepData.id
            this.editAttrackDialog = true
            setTimeout(() => {
                this.editAttrack.attackTime = item.attackStepData.attackTime
                this.editAttrack.path = item.attackStepData.path
                this.editAttrack.attackMode = item.attackStepData.attackMode
                this.editAttrack.attackStep = item.attackStepData.attackStep
                this.editAttrack.gain = item.attackStepData.gain
            }, 1000)
        },
        handelSeeAttrack(item) {
            console.log(item)
            this.detailAttrackDialog = true
            this.detailAttrack = item.attackStepData
        },
        handelSeeDefense(item) {
            console.log(item)
            this.detailDefenseDialog = true
            this.detailDefense = item.defenseStepData
        },

        addDefense(item) {
            this.isDefenseAdd = true
            this.attrackId = item.attackStepData.id
            this.addDefenseDialog = true
        },
        add_defense() {
            console.log('this.defenseSteps', this.defenseSteps)
            if (this.isDefenseAdd) {
                let data = {
                    queryData: {},
                    paramsData: {
                        defenseStep: {
                            attackStepId: this.attrackId,
                            defenseTime: this.defenseSteps.defenseTime,
                            isFind: this.defenseSteps.isFind,
                            isDispose: this.defenseSteps.isDispose,
                            defenseGainId: this.defenseSteps.defenseGainId,
                            defenseStep: this.defenseSteps.defenseStep,
                            opinion: this.defenseSteps.opinion
                        }
                    }
                }
                add_Attrack_relay(data).then((res) => {
                    this.addDefenseDialog = false
                    this.$message({
                        message: '添加成功',
                        type: 'success'
                    })
                    setTimeout(() => {
                        this.initSteps()
                    }, 1500)
                }).catch((error) => {
                    console.log(error)
                })
            } else {
                let data = {
                    queryData: {},
                    paramsData: {
                        id: this.attrackId,
                        defenseTime: this.defenseSteps.defenseTime,
                        isFind: this.defenseSteps.isFind,
                        isDispose: this.defenseSteps.isDispose,
                        defenseGainId: this.defenseSteps.defenseGainId,
                        defenseStep: this.defenseSteps.defenseStep,
                        opinion: this.defenseSteps.opinion
                    }
                }
                edit_defense_relay(data).then((res) => {
                    this.addDefenseDialog = false
                    this.$message({
                        message: '添加成功',
                        type: 'success'
                    })
                    setTimeout(() => {
                        this.initSteps()
                    }, 1500)
                }).catch((error) => {
                    console.log(error)
                })
            }
        },
        initRecord() {
            get_replay_record({
                gameEventId: this.$route.query.id
            }).then((res) => {
                if (res.length > 0) {
                    res.forEach((item, index) => {
                        let _obj = {}
                        _obj.label = item.defense_gain
                        _obj.value = item.record_id
                        this.records.push(_obj)
                    })
                }
                console.log('成果', res)
            }).catch((error) => {
                console.log(error)
            })
        },
        get_set_info() {
            get_record_attrack_sets({}).then((res) => {
                let gj_means = res.attackMode
                let fy_means = res.defenseMode
                this.initMatchSet(gj_means, this.attrack_ways)
                this.initMatchSet(fy_means, this.defense_ways)
                console.log('战绩配置', res)
            }).catch((error) => {
                console.log(error)
            })
        },
        initMatchSet(obj, val) {
            if (obj.length > 0) {
                obj.forEach((item, index) => {
                    let _obj = {}
                    _obj.label = item.name
                    _obj.value = item.index
                    val.push(_obj)
                })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .list{
        ::v-deep .el-descriptions-item__label{
            width:100px;
        }
    }
    .attrackSteps  ::v-deep .el-date-editor.el-input{
        width: 100%;
    }
    .event {
        /*padding: 0px 20px 20px 0px;*/
        box-sizing: border-box;
        position: relative;
    }
    .time-line>div {
        background-position: center -100px;
        background-repeat: no-repeat;
        background-size: 100% auto;
        position: relative;
    }

    .top-replay {
        width: 70%;
        position: absolute;
        left: 50%;
        margin-left: -35%;
        top: 10px;
        color: rgba(0,0,0,0.90);
        font-size: 20px;
        font-weight: 700;
    }

    .ver-line {
        width: 50%;
        padding-top: 60px;
        border-right: 2px solid rgba(0,0,0,.4);
    }

    .list-item {
        width: 450px;
        height:300px;
        padding: 10px;
        box-sizing: border-box;
        display: inline-block;
        margin-bottom: 80px;
        position: relative;
        border: 1px solid rgba(221,221,221,1);
        background: #EBF1F5;
        border-radius: 10px;
        .time1 {
            font-size: 12px;
            color: rgba(0,0,0,0.26);
        }
        img{
            height:100px;
            width:100px;
        }
    }

    .right-item {
        width: 450px;
        height:300px;
        position: absolute;
        top: 60%;
        right: -128%;
        img{
            height:100px;
            width:100px;
        }
    }

    .right-item>div.right {
        width: 100%;
        height: 100%;
        padding: 10px;
        box-sizing: border-box;
        display: inline-block;
        position: relative;
        border: 1px solid rgba(221,221,221,1);
        background: #F5EBEB;
        border-radius: 10px;
        .time1 {
            // width: 100%;
            // text-align: left;
            // position: absolute;
            // left: 60px;
            // top: -16px;
            font-size: 12px;
            color: rgba(0,0,0,0.26);
        }
    }

    .right-item>div.add {
        width: 100%;
        height: 100%;
    }

    .right-item>div.add .add-bg {
        width: 228px;
        height: 23px;
        position: absolute;
        top: -20px;
        left: -62px;
        box-sizing: border-box;
        // background-image: url(../../assets/img/add_bg_right.png);
        background-position: 0 0;
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }

    .list-con {
        box-sizing: border-box;
    }

    .right-item .list-con {
        width: 100%;
        height: 95%;
        box-sizing: border-box;
    }

    .item-title {
        width: 70%;
        line-height: 30px;
        font-weight: 600;
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #387DEE;
        font-weight: 700;
        font-size: 16px;
    }

    .right-item .item-title {
        color: #de4d38;
        text-shadow: 0px 0px 16px rgba(222, 77, 56, .8);
    }

    .relut {
        color: rgba(0,0,0,.9);
        font-size: 13px;
        line-height: 22px;
        text-align: justify;
        margin-top: 10px;
        strong {
            vertical-align: top;
        }
    }

    .attrackSteps {
        box-sizing: border-box;
    }

    .attrackSteps.active {
        // background-color: rgba(0, 0, 0, .2);
    }

    .addAttrackDialog ::v-deep .el-dialog__body {
        padding-left: 0!important;
        padding-right: 0!important;
    }

    .add-bg {
        width: 228px;
        height: 23px;
        position: absolute;
        top: -20px;
        right: -62px;
        box-sizing: border-box;
        background-position: 0 0;
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }
    .right-tips {
        width:100%;
        min-height:210px;
        background: #FFFFFF;
        border: 1px solid rgba(221,221,221,1);
        border-radius: 10px;
        position: relative;
        padding: 10px;
        box-sizing: border-box;
    }

    .tips-title {
        color: rgba(0,0,0,0.90);
        margin-bottom: 12px;
        font-size: 16px;
        font-weight: 700;
    }

    .tips-text {
        color: rgba(0,0,0,0.90);
        font-size: 12px;
        margin: 5px 0;
        ;
        span {
            color: rgba(0,0,0,0.90);
        }
    }

    .upload-demo ::v-deep .el-button--primary {
        background-color: rgba(0, 0, 0, 0);
        border-color: rgba(0, 0, 0, 0);
        background-image: url(../../assets/img/XZWJ.png);
        background-position: 0 0;
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }

    .upload-demo ::v-deep a,
    .upload-demo ::v-deep i {
        color: #1cd7fa;
    }

    .upload-demo ::v-deep .el-upload-list__item:hover {
        background-color: rgba(0, 0, 0, 0);
    }

    .upload-demo ::v-deep .el-button--primary span {
        color: #01e9ff;
    }

</style>
