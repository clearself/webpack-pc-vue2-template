<template>
    <div :class="{'before-line': hasDownItem}" class="toogle-box">
        <div v-if="constraintList.length != 0"  class="toogle-box1">
            <div  v-for="(item,index) in constraintList" :key="index" class="tree-line inner-box" :class="{'first': first}" style="position: relative;margin-top: 2px ;padding-left: 40px;min-height: 30px;color: antiquewhite;line-height: 30px;">
                <i @click.stop="toogleChild" :class="{'el-icon-caret-right': item.junctionType, 'is-show': true, 'fold-arrow': item.junctionType}" style="position: absolute;cursor: pointer;font-size: 18px;color: #387dee;" :style="{'left':item.junctionType?'20px':'12px','top':item.junctionType?'5px':'0'}"></i>
                <div style="position: relative;margin-left: 8px;">
                    <el-row style="font-size: 0;" v-if="!item.junctionType">
                        <el-select
                            v-model="item.constraintName"
                            placeholder="请选择"
                            size="mini"
                            filterable
                            style="width: 160px;"
                            @change="clearAfterData(item)"
                            :popper-append-to-body="false"
                            class="select"
                            popper-class="select-option innerSelect">
                            <el-option v-for="(_item,  index) in getEventOptions(factType)" :value="_item.value" :label="_item.label" :key="index"></el-option>
                        </el-select>

                        <el-select
                            v-model="item.operator"
                            placeholder="请选择"
                            v-if="item.constraintName !== 'historyIP'"
                            size="mini"
                            :popper-append-to-body="false"
                            class="select"
                            popper-class="select-option innerSelect"
                            style="margin: 0 10px;width: 120px;">
                            <el-option v-for="(item,index) in (item.attrType == 3 ? callDate_options : common_options)" :key="index" :value="item.value" :label="item.label"></el-option>
                        </el-select>
                        <el-select
                            v-model="item.operator"
                            placeholder="请选择"
                            :popper-append-to-body="false"
                            class="select"
                            v-if="item.constraintName === 'historyIP'"
                            size="mini"
                            popper-class="select-option innerSelect"
                            style="margin: 0 10px;width: 120px;">
                            <el-option value="==" label="等于"></el-option>
                        </el-select>

                        <el-select
                            class="constant-select select1"
                            @change="item.value = ''"
                            :popper-append-to-body="false"
                            v-if="item.constraintName !== 'alarmTime'"
                            v-model="item.dataType"
                            placeholder="请选择"
                            size="mini"
                            style="width: 74px;">
                            <el-option label="常量" value="0"></el-option>
                            <el-option label="变量" value="1"></el-option>
                        </el-select>
                        <el-select
                            class="constant-select select1"
                            @change="item.value = ''"
                            :popper-append-to-body="false"
                            v-if="item.constraintName === 'alarmTime'"
                            v-model="item.dataType"
                            placeholder="请选择"
                            size="mini"
                            style="width: 95px;">
                            <el-option label="常量" value="0"></el-option>
                            <el-option label="变量" value="1"></el-option>
                            <el-option label="起止时间" value="2"></el-option>
                        </el-select>
                        <el-select :popper-append-to-body="false" filterable v-if="item.attrType == 5 && item.constraintName !== 'attCk'" v-model="item.value" placeholder="请选择" size="mini" style="width: 180px;" class="select shuru">
                            <el-option :label="item.label" :value="item.value" v-for="(item, index) in getEnumOptions(factType, item.constraintName)" :key="index"></el-option>
                        </el-select>
                        <!-- attCK的树形结构 -->
                        <Treeselect
                            v-if="item.attrType == 5 && item.constraintName == 'attCk'"
                            class="attck-tree"
                            :disable-branch-nodes="true"
                            style="display: inline-block;margin-top: 1px;width: 180px;font-size: 12px;vertical-align: top;"
                            @input="inputChange"
                            :appendToBody="true"
                            size="small"
                            :options="getEnumOptions(factType, item.constraintName)"
                            :normalizer="normalizerAtt"
                            noChildrenText="当前分支无子节点"
                            noOptionsText="无可用选项"
                            placeholder="请选择"
                            v-model="item.value"
                        />
                        <el-date-picker
                            v-model="item.value"
                            v-if="item.attrType == 3 && item.constraintName === 'alarmTime' && item.dataType != 2"
                            style="width: 180px;font-size: 12px;"
                            class="handleTime"
                            popper-class="handleDrop"
                            type="datetime"
                            size="mini"
                            value-format="timestamp"
                            placeholder="选择日期时间">
                        </el-date-picker>
                        <el-input v-if="item.attrType != 3 && item.attrType != 5" v-model="item.value" :disabled="item.operator === 'in' || item.operator === 'not in'" placeholder="请输入值" size="mini" clearable class="w300 shuru">
                        </el-input>
                        <el-select
                            class="select1"
                            :popper-append-to-body="false"
                            v-if="item.attrType == 3 && item.constraintName === 'alarmTime' && item.dataType == 2"
                            v-model="item.value"
                            placeholder="请选择"
                            size="mini"
                            style="width: 180px;font-size: 12px;">
                            <el-option label="平均开始时间" value="平均开始时间"></el-option>
                            <el-option label="平均结束时间" value="平均结束时间"></el-option>
                        </el-select>
                        <el-dropdown class="constant-select" trigger="click" icon="el-icon-more" v-if="(item.operator === 'in' || item.operator === 'not in') || (item.dataType === '1' && item.operator !== 'in' && item.operator !== 'not in')">
                            <el-button size="mini" class="inner-btn">
                                <i class="el-icon-more" style="color: rgb(0 0 0 / 70%);"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown" :append-to-body="false">
                                <el-dropdown-item data-type="1" v-if="item.operator === 'in' || item.operator === 'not in'" @click.native="moreFields($event,item)">资源池</el-dropdown-item>
                                <el-dropdown-item data-type="2" v-if="item.dataType === '1' && item.operator !== 'in' && item.operator !== 'not in'" @click.native="moreFields($event,item)">字段表</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>

                        <div v-if="item.fieldBindName" class="box-title" style="display: inline-block;margin-top: 1px;margin-right: 0!important;vertical-align: top;">
                            <span style="margin-right: 5px;">变量名：</span><span style="color: #03864f;">{{item.fieldBindName}}</span>
                        </div>

                        <div class="operate-btn data-fields" style="display: inline-block;">
                            <el-tooltip
                                class="item"
                                popper-class="atooltip"
                                effect="dark"
                                content="属性"
                                placement="top">
                                <i class="iconfont icon-shuxing" style="color: #387dee;" @click="openField(item, index)"></i>
                            </el-tooltip>

                            <el-dropdown trigger="click" v-if="factType != 'HistoryIPEvent'">
                                <el-tooltip
                                    class="item"
                                    popper-class="atooltip"
                                    effect="dark"
                                    content="向下添加"
                                    style="color: #387dee;"
                                    placement="top">
                                    <i class="iconfont icon-xiangxiatianjia" style="margin-right: 5px;font-size: 14px;color: #387dee;cursor: pointer;"></i>
                                </el-tooltip>

                                <el-dropdown-menu slot="dropdown" :append-to-body="false">
                                    <el-dropdown-item data-type="1" @click.native="addFields_down($event, index)">字段名</el-dropdown-item>
                                    <el-dropdown-item data-type="2" @click.native="addFields_down($event, index)">逻辑符</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                            <el-dropdown trigger="click" v-if="factType != 'HistoryIPEvent'">
                                <el-tooltip
                                    class="item"
                                    popper-class="atooltip"
                                    effect="dark"
                                    content="向上添加"
                                    style="color: #387dee;"
                                    placement="top">
                                    <i class="iconfont icon-xiangshangtianjia" style="margin-right: 5px;font-size: 14px;color: #387dee;cursor: pointer;"></i>
                                </el-tooltip>

                                <el-dropdown-menu slot="dropdown" :append-to-body="false">
                                    <el-dropdown-item data-type="1" @click.native="addFields_up($event, index)">字段名</el-dropdown-item>
                                    <el-dropdown-item data-type="2" @click.native="addFields_up($event, index)">逻辑符</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                            <el-tooltip
                                class="item"
                                popper-class="atooltip"
                                effect="dark"
                                content="删除"
                                placement="top">
                                <i class="el-icon-close" style="color: #387dee;" @click="deleteFields(index)"></i>
                            </el-tooltip>

                        </div>
                    </el-row>

                    <el-row  v-if="item.junctionType == '||'" style="position: relative;font-size: 0;">
                        <el-dropdown trigger="click" class="fold-arrow-before">
                            <el-button type="primary" size="mini">
                                {{item.junctionType == '&&' ? 'AND' : 'OR'}}<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown" :append-to-body="false" ref="mydropd">
                                <el-dropdown-item data-type="1" @click.native="selectChange($event, item)">AND</el-dropdown-item>
                                <el-dropdown-item data-type="2" @click.native="selectChange($event, item)">OR</el-dropdown-item>
                            <!--<el-dropdown-item data-type="3" @click.native="selectChange">NOT</el-dropdown-item>-->
                            </el-dropdown-menu>
                        </el-dropdown>

                        <div class="operate-btn" style="display: inline-block;">
                            <el-dropdown trigger="click">
                                <el-tooltip
                                    class="item"
                                    popper-class="atooltip"
                                    effect="dark"
                                    content="向下添加"
                                    placement="top">
                                    <i class="iconfont icon-xiangxiatianjia" style="margin-right: 5px;font-size: 14px;color: #387dee;cursor: pointer;"></i>
                                </el-tooltip>

                                <el-dropdown-menu slot="dropdown" :append-to-body="false">
                                    <el-dropdown-item data-type="1" @click.native="addFields_down($event, index)">字段名</el-dropdown-item>
                                    <el-dropdown-item data-type="2" @click.native="addFields_down($event, index)">逻辑符</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                            <el-dropdown trigger="click">
                                <el-tooltip
                                    class="item"
                                    popper-class="atooltip"
                                    effect="dark"
                                    content="向上添加"
                                    placement="top">
                                    <i class="iconfont icon-xiangshangtianjia" style="margin-right: 5px;font-size: 14px;color: #387dee;cursor: pointer;"></i>
                                </el-tooltip>

                                <el-dropdown-menu slot="dropdown" :append-to-body="false">
                                    <el-dropdown-item data-type="1" @click.native="addFields_up($event, index)">字段名</el-dropdown-item>
                                    <el-dropdown-item data-type="2" @click.native="addFields_up($event, index)">逻辑符</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                            <el-dropdown trigger="click">
                                <el-tooltip
                                    class="item"
                                    popper-class="atooltip"
                                    effect="dark"
                                    content="向内添加"
                                    placement="top">
                                    <i class="el-icon-plus" style="margin-right: 5px;font-size: 14px;color: #387dee;cursor: pointer;"></i>
                                </el-tooltip>

                                <el-dropdown-menu slot="dropdown" :append-to-body="false">
                                    <el-dropdown-item data-type="1" @click.native="innerFields($event,item, index)">字段名</el-dropdown-item>
                                    <el-dropdown-item data-type="2" @click.native="innerFields($event,item,index)">逻辑符</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                            <el-tooltip
                                class="item"
                                popper-class="atooltip"
                                effect="dark"
                                content="删除"
                                placement="top">
                                <i class="el-icon-close" @click="deleteFields(index)" style="color: #387dee;"></i>
                            </el-tooltip>

                        </div>
                    </el-row>
                    <el-row  v-if="item.junctionType == '&&'" style="position: relative;font-size: 0;">
                        <el-dropdown trigger="click" class="fold-arrow-before">
                            <el-button type="primary" size="mini">
                                {{item.junctionType == '&&' ? 'AND' : 'OR'}}<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown" :append-to-body="false" ref="mydropd2">
                                <el-dropdown-item data-type="1" @click.native="selectChange($event, item)">AND</el-dropdown-item>
                                <el-dropdown-item data-type="2" @click.native="selectChange($event, item)">OR</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>

                        <div class="operate-btn" style="display: inline-block;">
                            <el-dropdown trigger="click">
                                <el-tooltip
                                    class="item"
                                    popper-class="atooltip"
                                    effect="dark"
                                    content="向下添加"
                                    placement="top">
                                    <i class="iconfont icon-xiangxiatianjia" style="margin-right: 5px;font-size: 14px;color: #387dee;cursor: pointer;"></i>
                                </el-tooltip>

                                <el-dropdown-menu slot="dropdown" :append-to-body="false">
                                    <el-dropdown-item data-type="1" @click.native="addFields_down($event, index)">字段名</el-dropdown-item>
                                    <el-dropdown-item data-type="2" @click.native="addFields_down($event, index)">逻辑符</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                            <el-dropdown trigger="click">
                                <el-tooltip
                                    class="item"
                                    popper-class="atooltip"
                                    effect="dark"
                                    content="向上添加"
                                    placement="top">
                                    <i class="iconfont icon-xiangshangtianjia" style="margin-right: 5px;font-size: 14px;color: #387dee;cursor: pointer;"></i>
                                </el-tooltip>

                                <el-dropdown-menu slot="dropdown" :append-to-body="false">
                                    <el-dropdown-item data-type="1" @click.native="addFields_up($event, index)">字段名</el-dropdown-item>
                                    <el-dropdown-item data-type="2" @click.native="addFields_up($event, index)">逻辑符</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                            <el-dropdown trigger="click">
                                <el-tooltip
                                    class="item"
                                    popper-class="atooltip"
                                    effect="dark"
                                    content="向内添加"
                                    placement="top">
                                    <i class="el-icon-plus" style="margin-right: 5px;font-size: 14px;color: #387dee;cursor: pointer;"></i>
                                </el-tooltip>

                                <el-dropdown-menu slot="dropdown" :append-to-body="false">
                                    <el-dropdown-item data-type="1" @click.native="innerFields($event,item, index)">字段名</el-dropdown-item>
                                    <el-dropdown-item data-type="2" @click.native="innerFields($event,item,index)">逻辑符</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                            <el-tooltip
                                class="item"
                                popper-class="atooltip"
                                effect="dark"
                                content="删除"
                                placement="top">
                                <i class="el-icon-close" @click="deleteFields(index)" style="color: #387dee;"></i>
                            </el-tooltip>

                        </div>
                    </el-row>
                </div>

                <drools-tree-data
                    style="position: relative;"
                    @upResource="upResource"
                    @upFields="upFields"
                    :testData="testData"
                    :variate_arr="variate_arr"
                    :constraintList="item.constraintList"
                    :factType="factType"
                    :hasDownItem="constraintList[index+1] ? true : false">

                </drools-tree-data>
            </div>
        </div>

        <div v-if="constraintList.length == 0 && first" style="margin-top: 10px;padding-left: 20px;color: antiquewhite;" class="tree-line-bottom">
            <el-row style="position: relative;">
                <i class="el-icon-caret-right" style="font-size: 18px;color: #387dee;"></i>
                <el-dropdown trigger="click">
                    <i class="el-icon-circle-plus-outline" style="margin-left: 5px;font-size: 16px;color: #387dee;line-height: 30px;cursor: pointer;"></i>
                    <el-dropdown-menu slot="dropdown" :append-to-body="false">
                        <el-dropdown-item v-if="factType != 'HistoryIPEvent'" data-type="1" @click.native="bottomAddData($event)">逻辑符</el-dropdown-item>
                        <el-dropdown-item data-type="2" @click.native="bottomAddData($event)">字段名</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-row>
        </div>

        <el-dialog
            title="属性"
            width="700px"
            :visible.sync="fieldDialog"
            custom-class="common-dialog">
            <el-form ref="addRuleAtt_Form" label-width="80px" label-position="top">
                <el-form-item label="变量名：" style="margin-bottom: 10px;" >
                    <el-input v-model="fieldBindName" placeholder="请输入以$开头的英文变量名" size="small" style="width: 100%;" @blur="judgeFieldBindName(fieldBindName)"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="fieldDialog=false" size="small">取消</el-button>
                <el-button @click="handleFieldBindName" size="small" type="primary">确认</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
    name: 'DroolsTreeData',
    components: {
        Treeselect
    },
    data() {
        return {
            normalizerAtt(node) {
                return {
                    id: node.value,
                    label: node.label,
                    children: node.child
                }
            },
            test: '',
            currentSelect: 'AND',
            fieldDialog: false,
            fieldBindName: '',
            copyItem: '',
            attackWays: [{ code: 0, name: 'Tor节点' }, { code: 1, name: '木马回连服务器' }, { code: 2, name: '木马下载服务器' }, { code: 3, name: '感染型病毒' }, { code: 4, name: 'voip攻击' }, { code: 5, name: 'Web漏洞攻击' }, { code: 6, name: '网络蠕虫' }, { code: 7, name: 'Sinkhole重定向IP' }, { code: 8, name: '可疑文件' }, { code: 9, name: '记录数据' }, { code: 10, name: '色情' }, { code: 11, name: '赌博' }, { code: 12, name: 'DGA域名' }, { code: 13, name: '全球地域IP' }, { code: 14, name: '中国移动IP' }, { code: 15, name: 'VOIP节点' }, { code: 16, name: 'IDC节点' }, { code: 17, name: 'VPN节点' }, { code: 18, name: 'C2节点' }, { code: 19, name: '僵尸网络' }, { code: 20, name: 'proxy代理' }, { code: 21, name: 'FastFlux节点' }, { code: 22, name: '扫描器节点' }, { code: 23, name: '恶意软件' }, { code: 24, name: '漏洞利用' }, { code: 25, name: '钓鱼网址' }, { code: 26, name: '广告' }, { code: 27, name: 'APT攻击' }, { code: 28, name: '远控木马' }, { code: 29, name: '网银大盗' }, { code: 30, name: '僵尸主机' }, { code: 31, name: '僵尸网络C2' }, { code: 32, name: '爆破攻击' }, { code: 33, name: '挖矿' }, { code: 34, name: 'DDOS攻击' }, { code: 35, name: '欺诈' }, { code: 36, name: '流氓软件' }, { code: 37, name: 'IOT攻击C2' }, { code: 38, name: 'IOT失陷主机' }, { code: 39, name: '宏病毒' }, { code: 40, name: 'MAC恶意软件' }, { code: 41, name: '恶意脚本' }, { code: 42, name: '恶意SSL证书' }, { code: 43, name: '恶意网站' }, { code: 44, name: '勒索软件' }, { code: 45, name: '主机扫描' }, { code: 46, name: 'SinkholeC2' }, { code: 47, name: '网络爬虫' }, { code: 48, name: '间谍软件' }, { code: 49, name: '窃密木马' }],
            common_options: [{
                label: '等于',
                value: '=='
            }, {
                label: '不等于',
                value: '!='
            }, {
                label: '大于',
                value: '>'
            }, {
                label: '小于',
                value: '<'
            }, {
                label: '大于或等于',
                value: '>='
            }, {
                label: '小于或等于',
                value: '<='
            }, {
                label: 'matches',
                value: 'matches'
            }, {
                label: 'not matches',
                value: 'not matches'
            }, {
                label: 'contains',
                value: 'contains'
            }, {
                label: 'not contains',
                value: 'not contains'
            }, {
                label: 'in',
                value: 'in'
            }, {
                label: 'not in',
                value: 'not in'
            }],

            callDate_options: [{
                label: '等于',
                value: '=='
            }, {
                label: '不等于',
                value: '!='
            }, {
                label: '大于',
                value: '>'
            }, {
                label: '小于',
                value: '<'
            }, {
                label: '大于或等于',
                value: '>='
            }, {
                label: '小于或等于',
                value: '<='
            }],

            IP_options: [
                {
                    label: '等于',
                    value: '=='
                }
            ],
            optionsData: [],
            toogleChildIS: false
        }
    },
    props: ['constraintList', 'factType', 'hasDownItem', 'first', 'variate_arr', 'testData'],
    created() {
        console.log(this.constraintList)
        console.log(this.factType)
    },
    mounted() {

    },
    watch: {
        testData: {
            handler(newVal, oldVal) {
                console.log(newVal)
                if (newVal) {
                    this.optionsData = JSON.parse(JSON.stringify(newVal))
                }
            },
            immediate: true
        }
    },
    computed: {
        getEnumOptions() {
            return function(event, labelVal) {
                console.log(this.optionsData)
                let item = this.optionsData.find(it => it.value === event)
                if (item && item.options) {
                    let innerItem = item.options.find(it => it.value === labelVal)
                    if (innerItem && innerItem.options) {
                        return innerItem.options
                    } else {
                        return []
                    }
                } else {
                    return []
                }
            }
        },
        getEventOptions() {
            return function(event) {
                let item = this.optionsData.find(it => it.value === event)
                console.log(item)
                return item ? item.options : []
            }
        }
    },
    methods: {
        inputChange() {},
        toogleChild(e) {
            if (this.toogleChildIS) {
                this.toogleChildIS = false
            } else {
                this.toogleChildIS = true
            }
            // console.log($(e.target).siblings('.toogle-box'))
            // eslint-disable-next-line no-undef
            if ($(e.target).hasClass('is-show')) {
                // eslint-disable-next-line no-undef
                $(e.target).toggleClass('is-show')
                // eslint-disable-next-line no-undef
                $(e.target).siblings('.toogle-box').hide()
            } else {
                // eslint-disable-next-line no-undef
                $(e.target).toggleClass('is-show')
                // eslint-disable-next-line no-undef
                $(e.target).siblings('.toogle-box').show()
            }
        },
        switch_options() {
            if (this.factType) {
                return this[[this.factType] + '_options']
            } else {
                return []
            }
        },
        judgeFieldBindName(name) {
            console.log(name)
            if (name !== '') {
                if (name[0] !== '$') {
                    this.fieldBindName = ''
                    this.$message.warning('变量名必须以$符开头')
                }
            }
        },
        moreFields(e, item) {
            console.log(e.target.dataset.type)
            let type = e.target.dataset.type
            if (type == 1) {
                this.$emit('upResource', item)
            } else if (type == 2) {
                console.log(this.variate_arr)
                console.log(item.value)
                this.$emit('upFields', item)
                // if (this.variate_arr.length == 0 || !this.variate_arr.includes(item.value)) {
                //     this.$message.warning('规则中没有您输入的变量，请输入正确的变量名')
                // } else {
                //     this.$emit('upFields', item, this.factType)
                // }
            }
        },
        upResource(val) {
            this.$emit('upResource', val)
        },
        upFields(val) {
            this.$emit('upFields', val)
        },
        selectChange(e, item) {
            console.log(e.target.dataset.type)
            let type = e.target.dataset.type
            console.log(item)
            if (type == 1) {
                item.junctionType = '&&'
            } else if (type == 2) {
                item.junctionType = '||'
            }
        },
        clearAfterData(item) {
            let arr = this.getEventOptions(this.factType)
            console.log(arr)
            let selectItem = arr.find(it => it.value === item.constraintName)
            if (selectItem) {
                console.log(selectItem)
                item.attrType = selectItem.type
            } else {
                item.attrType = 1
            }

            item.operator = ''
            item.value = ''
            item.dataType = '0'
            item.fieldBindName = ''
            if (item.constraintName == 'attCk') {
                // attck 树状结构初始值为null
                item.value = null
            }
        },
        openField(item, index) {
            console.log(item)
            this.fieldBindName = item.fieldBindName
            this.copyItem = item
            this.fieldDialog = true
        },
        handleFieldBindName() {
            if (this.copyItem) {
                this.copyItem.fieldBindName = this.fieldBindName
            }
            console.log()
            this.fieldDialog = false
        },

        addFields_down(e, index) {
            let dtype = e.target.dataset.type
            if (dtype == 1) {
                this.constraintList.splice(index + 1, 0, {
                    constraintName: '',
                    operator: '',
                    value: '',
                    attrType: 1,
                    fieldBindName: '',
                    junctionType: '',
                    dataType: '0',
                    constraintList: []
                })
            } else if (dtype == 2) {
                this.constraintList.splice(index + 1, 0, {
                    constraintName: '',
                    operator: '',
                    value: '',
                    attrType: 1,
                    fieldBindName: '',
                    junctionType: '&&',
                    dataType: '0',
                    constraintList: []
                })
            }
        },
        addFields_up(e, index) {
            let dtype = e.target.dataset.type
            if (dtype == 1) {
                this.constraintList.splice(index, 0, {
                    constraintName: '',
                    operator: '',
                    value: '',
                    attrType: 1,
                    fieldBindName: '',
                    junctionType: '',
                    dataType: '0',
                    constraintList: []
                })
            } else if (dtype == 2) {
                this.constraintList.splice(index, 0, {
                    constraintName: '',
                    operator: '',
                    value: '',
                    attrType: 1,
                    fieldBindName: '',
                    junctionType: '&&',
                    dataType: '0',
                    constraintList: []
                })
            }
        },

        deleteFields(index) {
            this.constraintList.splice(index, 1)
        },
        innerFields(e, item, index) {
            console.log(item)
            let dtype = e.target.dataset.type
            if (dtype == 1) {
                item.constraintList.push({
                    constraintName: '',
                    operator: '',
                    value: '',
                    attrType: 1,
                    fieldBindName: '',
                    junctionType: '',
                    dataType: '0',
                    constraintList: []
                })
            } else if (dtype == 2) {
                item.constraintList.push({
                    constraintName: '',
                    operator: '',
                    value: '',
                    attrType: 1,
                    fieldBindName: '',
                    junctionType: '&&',
                    dataType: '0',
                    constraintList: []
                })
            }
        },

        bottomAddData(e, item) {
            let dtype = e.target.dataset.type
            if (dtype == 1) {
                this.constraintList.push({
                    constraintName: '',
                    operator: '',
                    value: '',
                    attrType: 1,
                    fieldBindName: '',
                    junctionType: '&&',
                    dataType: '0',
                    constraintList: []
                })
            } else if (dtype == 2) {
                this.constraintList.push({
                    constraintName: '',
                    operator: '',
                    value: '',
                    attrType: 1,
                    fieldBindName: '',
                    junctionType: '',
                    dataType: '0',
                    constraintList: []
                })
            }
        }
    }
}
</script>
<style scoped lang="scss">
.toogle-box {
    ::v-deep .shuru {
        input {
            // border-top-left-radius: 0;
            // border-bottom-left-radius: 0;
            border-radius: 0;
        }
    }
}
.toogle-box1 {
    .fold-arrow-before {
        ::v-deep .el-button--primary {
            padding: 7px;
            width: 60px !important;
            color: #ffffff;
            background-position: 0 0;
            background-repeat: no-repeat;
            background-size: 100% 100%;
            background-color: #387dee !important;
            box-sizing: border-box;
        }
    }
}
.inner-box {
    position: relative;
    white-space: nowrap;
}
.tree-line::before {
    position: absolute;
    top: -25px;
    left: -15px;
    width: 1px;
    height: 40px;
    border-width: 1px;
    border-left: 1px dashed #387dee;
    content: '';
}
.tree-line.first::before {
    position: absolute;
    top: -27px;
    left: -15px;
    width: 1px;
    height: 42px;
    border-width: 1px;
    border-left: 1px dashed #387dee;
    content: '';
}
.tree-line.first::after {
    position: absolute;
    top: 14px;
    left: -14px;
    width: 36px;
    height: 20px;
    border-width: 1px;
    border-top: 1px dashed #387dee;
    content: '';
}
.tree-line::after {
    position: absolute;
    top: 14px;
    left: -14px;
    width: 36px;
    height: 20px;
    border-width: 1px;
    border-top: 1px dashed #387dee;
    content: '';
}
.tree-line-bottom::before {
    position: absolute;
    top: -20px;
    left: -15px;
    width: 1px;
    height: 44px;
    border-width: 1px;
    border-left: 1px dashed #387dee;
    content: '';
}
.tree-line-bottom::after {
    position: absolute;
    top: 24px;
    left: -14px;
    width: 30px;
    height: 20px;
    border-width: 1px;
    border-top: 1px dashed #387dee;
    content: '';
}
.fold-arrow {
    position: absolute;
    top: 0;
    left: 19px;
    z-index: 9;
    width: 14px;
    height: 14px;
    font-size: 14px;
    color: #ffffff;

    /* text-shadow: 0 0 5px #00d2ff; */
}
.fold-arrow.is-show {
    transform: rotate(90deg);
    transform-origin: center center;
}
.fold-arrow-bottom {
    position: absolute;
    top: 8px;
    left: -20px;
    z-index: 9;
    width: 14px;
    height: 14px;
    font-size: 14px;
    color: #ffffff;
    text-shadow: 0 0 8px #00d2ff;
}
.tree-line  ::v-deep .el-input-group__append, .tree-line ::v-deep .el-input-group__prepend {
    border: 1px solid #1cd7fa;
    border-right: none;
    color: #ffffff;
    background-color: transparent !important;
    box-shadow: 0 0 7px #389bf7 inset;
}
.tree-line  ::v-deep .el-input-group__append {
    padding: 0 8px;
}
.operate-btn {
    margin-left: 10px;
    height: 30px;
    font-size: 0;
    line-height: 30px;
}
.operate-btn i {
    margin-right: 10px !important;
    font-size: 12px !important;
    color: #0af0f3;
    cursor: pointer;
}
.data-fields.operate-btn i {
    margin-right: 10px !important;
}
.el-dropdown-menu {
    padding: 5px 0!important;
    width: 60px !important;
    box-sizing: border-box;
}
.el-dropdown-menu__item {
    padding: 0 !important;
    font-size: 12px;
    text-align: center;
}
.w300 {
    width: 260px;
}
.inner-btn {
    padding: 7px 0;
    width: 20px;
    height: 28px;
    border-radius: 0;
    background: transparent !important;
    box-sizing: border-box;

    /* border: 1px solid #1cd7fa; */
    // border-left: none;

    /* -webkit-box-shadow: inset 0px 0px 7px 0px #389bf7;
    box-shadow: inset 0px 0px 7px 0px #389bf7; */
}
.inner-btn:hover {
    /* border: 1px solid #1cd7fa; */
    // border: none;
    border: 1px solid #dcdcdc;
    background: transparent !important;

    /* -webkit-box-shadow: 0px 0px 7px 0px #389bf7 inset; */

    /* box-shadow: 0px 0px 7px 0px #389bf7 inset; */
}
.inner-btn:active {
    // border: none;
    border: 1px solid #dcdcdc;
}
.inner-btn:focus {
    border: 1px solid #dcdcdc;
}
.box-title {
    position: relative;
    overflow: hidden;
    margin: 0 10px;
    padding: 0 10px 0 15px;

    /* border-radius: 0px; */
    width: 160px;
    height: 28px;
    font-size: 12px;
    border: 1px solid #dcdcdc;
    border-radius: 2px;
    text-overflow: ellipsis;
    white-space: nowrap;

    /* -webkit-box-shadow: 0px 0px 7px 0px #389bf7 inset; */

    /* box-shadow: 0px 0px 7px 0px #389bf7 inset; */
    color: rgb(0 0 0 / 90%);
    background-color: #ffffff;
    line-height: 28px;
    box-sizing: border-box;

    /* 超出部分隐藏 */

    /* 超出部分显示省略号 */

    /* 规定段落中的文本不进行换行 */
}

/* 表示逻辑符下面还有上一级的同级 */
.before-line::before {
    position: absolute;
    top: -26px;
    left: -55px;
    width: 1px;
    height: calc(100% + 10px);
    border-width: 1px;
    border-left: 1px dashed #387dee;
    content: '';
}
.tree-line  ::v-deep  .constant-select .el-input__inner, .tree-line  ::v-deep  .constant-select {
    border: #1cd7fa;

    /* background: rgba(0,198,255,.15) !important; */
    color: #0052d9;

    /* border-radius: 0; */
}
.constant-select ::v-deep .el-select__caret {
    color: #0052d9;
}
.tree-line  ::v-deep  .constant-select .el-input__inner {
    border: 1px solid #1cd7fa;
    border-right: none;
}

/* .toogle-box  ::v-deep .atooltip{
    border: 1px solid #1cd7fa !important;
    padding: 8px 10px;
    background: #042136 !important;
    border: 1px solid #1cd7fa;
    -webkit-box-shadow: 0px 0px 7px #389bf7 inset;
    box-shadow: 0px 0px 7px #389bf7 inset;
    color: #fff;
} */
.toogle-box  ::v-deep  .iconfont.icon-zhedie.fold-arrow {
    /* text-shadow: 0px 0px 8px #00d2ff; */
}
.el-select-dropdown__item {
    padding: 0 !important;
}
.el-select-dropdown__item.selected {
    font-weight: normal;
}
.el-select-dropdown__item.selected span {
    color: #ffffff;
}
.tree_dropdown .el-select-dropdown__item.hover span {
    color: #ffffff;
}
.el-tree {
    background: rgb(0 0 0 / 0%);
}
.tree_dropdown .el-select-dropdown__item.hover span {
    color: #ffffff;
}
</style>
<style lang="scss" scoped>
.select {
    ::v-deep .el-select-dropdown__item span {
        // background:#042136 !important;
        z-index: 1000 !important;
        display: inline-block !important;
        padding-left: 14px !important;
        width: 158px !important;
        height: 34px !important;
    }
}
.toogle-box1 {
    .attck-tree {
        height: 28px;
        ::v-deep .vue-treeselect__control {
            padding-left: 10px;
            height: 28px !important;
            border-radius: 0;
            .vue-treeselect__value-container {
                line-height: 26px;
                .vue-treeselect__single-value {
                    line-height: 26px;
                }
            }
        }
        ::v-deep .vue-treeselect__placeholder {
            line-height: 28px;
        }
    }
}
.select1 {
    ::v-deep .el-select-dropdown__item {
        span {
            // background:#042136 !important;
            z-index: 1000 !important;
            display: block;
            display: inline-block !important;
            padding-left: 14px !important;
            width: 72px !important;
            height: 34px !important;
        }
    }
    ::v-deep input {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        border-right: 0;
    }
}
.custom-tree-node span:hover {
    color: #0052d9 !important;
}
.el-tree-node__content {
    background-color: rgb(0 0 0 / 0%)!important;
}

/* li::-webkit-scrollbar {
        display: none!important;
    } */
.el-tree-node__content:hover,.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
    background: none !important;
}

</style>
