<template>
    <div class="event add_rules">
        <div class="event-content event-wrapper w100" v-loading="loading">
            <div class="ub w100 relative">
                <div class="list-tips">{{this.$route.query.id?'编辑规则':'新建规则'}}</div>
                <div class="btn-wrap" style="margin-left: auto;">
                    <!-- <cancel-btn title="取 消"  @click="cancel"></cancel-btn>
                    <cancel-btn title="重 置" style="margin-right: 10px;" @click="reset"></cancel-btn>
                    <searchBtn title="提 交" @click.native="finish" /> -->
                    <el-button size="small" @click="cancel" style="z-index: 9999">取 消</el-button>
                    <el-button size="small" @click="reset"  style="z-index: 9999">重 置</el-button>
                    <el-button size="small" type="primary" @click="finish" style="z-index: 9999">提 交</el-button>
                </div>
            </div>
            <div class="content-rule">
                <div class="w100 form-wrapper">
                    <div class="title w100"><span class="t1">基础信息</span></div>
                    <el-form ref="formData" :model="formData" :rules="formDataRules" label-width="120px" label-position="top">
                        <div class="ub" style="width:100%; justify-content: space-between;">
                            <el-form-item label="解析规则名称：" style="width: 22%" prop="name" size="small">
                                <el-input clearable v-model.trim="formData.name" placeholder="请输入规则名称"></el-input>
                            </el-form-item>
                            <el-form-item label="接入设备类型：" style="width: 22%" prop="name" size="small">
                                <treeselect
                                    size="small"
                                    :appendToBody="true"
                                    class="treeselect"
                                    style="width:100%;"
                                    :options="regAssetTypeList"
                                    :normalizer="normalizer"
                                    noChildrenText="当前分支无子节点"
                                    noOptionsText="无可用选项"
                                    placeholder="请选择接入设备类型"
                                    v-model="formData.deviceType"
                                    @input="treeChange"
                                    @select="selectNode"
                                    :disableBranchNodes="true"
                                />
                            </el-form-item>
                            <el-form-item label="数据源厂商：" style="width: 22%" size="small">
                                <el-select @change="changeCpy" style="width: 100%;" filterable clearable v-model.trim="formData.company" placeholder="请选择">
                                    <el-option v-for="(item, index) in compantList" :key="index" :label="item.name" :value="item.busId"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item style="width: 22%;" label="解析类型：" prop="type" size="small">
                                <el-select style="width: 100%;" filterable clearable v-model.trim="formData.type" placeholder="请选择">
                                    <el-option v-for="(item, index) in types" :key="index" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <el-form-item label="解析规则描述：" prop="analysisDesc" size="small">
                            <el-input type="textarea" :autosize="{ minRows: 3 }" placeholder="请填写解析规则描述" v-model="formData.analysisDesc"></el-input>
                        </el-form-item>
                        <el-form-item label="样例日志：" prop="contentExample" size="small">
                            <el-input type="textarea" :autosize="{ minRows: 3 }" placeholder="为了验证规则准确性，请输入一条原始日志" v-model="formData.contentExample"></el-input>
                        </el-form-item>
                        <el-form-item v-if="formData.type == '正则'" label="规则表达式：" prop="ruleExpression" size="small">
                            <el-input
                                @mouseup.native="replaceText"
                                @mouseleave.native="mouseLeave"
                                @blur="ruleBlur"
                                @input="changePer"
                                ref="replaceInput"
                                type="textarea"
                                :autosize="{ minRows: 3 }"
                                placeholder="为了验证需要，请输入规则表达式"
                                v-model="formData.ruleExpression"
                            ></el-input>
                        </el-form-item>
                        <el-form-item v-if="formData.type == '转发透传'" label="转发地址：" prop="forwardingAddress" size="small">
                            <el-input clearable v-model.trim="formData.forwardingAddress" placeholder="请输入转发地址"></el-input>
                        </el-form-item>
                    </el-form>
                    <template v-if="formData.type != '转发透传' && formData.type != '不解析'">
                        <div class="title w100"><span class="t1">数据过滤</span></div>
                        <el-form label-width="120px" label-position="top">
                            <div class="data-filter">
                                <div v-for="(item, index) in filters" :key="index">
                                    <el-form-item :label="'规则$' + index + '：'" size="small">
                                        <div class="filter-item">
                                            <div class="del-item" style="font-size:12px;" @click="removeFilter(index)">
                                                <i class="el-icon-close" style="color: #e34d59;cursor:pointer;"></i>
                                                删除
                                            </div>
                                            <el-select
                                                @change="
                                                    data => {
                                                        changeType(item, data)
                                                    }
                                                "
                                                style="width: 40%;margin-bottom: 20px;"
                                                filterable
                                                v-model.trim="item.type"
                                                placeholder="请选择"
                                            >
                                                <el-option v-for="(item, index) in filtersTypes" :key="index" :label="item.label" :value="item.value"></el-option>
                                            </el-select>
                                            <template v-if="item.type == 'add'">
                                                <div v-for="(info, i) in item.fields" :key="i" class="key-value">
                                                    <!-- <el-form-item :prop="`filters.${index}`" style="margin-bottom: 0;width: 100%; display: inline-block;" size="small"> -->
                                                    <el-select style="width: 40%;" filterable clearable v-model.trim="info.targetField" @change="(data) => { changeAddField(data, info, i) }" placeholder="请选择字段名称">
                                                        <el-option v-for="(item, index) in systemFieldOptins" :key="index" :label="item.label" :value="item.value"></el-option>
                                                    </el-select>
                                                    <!-- </el-form-item> -->
                                                    <i style="margin-left: 10px;margin-right: 10px; color: #dcdcdc; font: 14px;" class="iconfont icon-lianjie"></i>
                                                    <el-input v-if="info.type != 5" style="width: 40%;" clearable v-model.trim="info.sourceField" placeholder="请输入字段值"></el-input>
                                                    <el-select v-if="info.type == 5" style="width: 40%;" filterable clearable v-model.trim="info.sourceField" placeholder="请选择字段值">
                                                        <el-option v-for="(item, index) in info.option" :key="index" :label="item.label" :value="item.value"></el-option>
                                                    </el-select>
                                                    <i
                                                        v-show="item.fields.length != 1"
                                                        @click.stop="removeInfo(item.fields, i)"
                                                        class="el-icon-remove-outline"
                                                        style="padding-left: 10px;color: #ff2727;cursor:pointer;"
                                                    ></i>
                                                    <i
                                                        class="el-icon-circle-plus-outline"
                                                        @click.stop="addInfo(item.fields)"
                                                        style="color: #0052d9;cursor:pointer;margin-left:10px;"
                                                    ></i>
                                                </div>
                                            </template>
                                            <template v-if="item.type == 'merge'">
                                                <div v-for="(info, i) in item.fields" :key="i" class="key-value">
                                                    <div class="merge-item-wrap">
                                                        <div
                                                            :class="{
                                                                'last-merge': info.sourceField.length > 1 && idxfie + 1 == info.sourceField.length,
                                                                'only-merge': info.sourceField.length == 1
                                                            }"
                                                            class="merge-inner"
                                                            v-for="(fie, idxfie) in info.sourceField"
                                                            :key="idxfie"
                                                        >
                                                            <el-input clearable v-model.trim="fie.value" placeholder="要合并的字段"></el-input>
                                                            <el-tooltip class="item" effect="dark" content="删除合并字段" placement="top">
                                                                <i
                                                                    v-show="info.sourceField.length != 1"
                                                                    @click.stop="removeInfo(info.sourceField, i)"
                                                                    class="el-icon-minus"
                                                                    style="padding-left: 10px;color: #ff2727;cursor:pointer; padding-right: 11px;"
                                                                ></i>
                                                            </el-tooltip>
                                                            <el-tooltip class="item" effect="dark" content="添加合并字段" placement="top">
                                                                <i
                                                                    v-show="idxfie + 1 == info.sourceField.length"
                                                                    class="el-icon-plus"
                                                                    @click.stop="addMerge(info.sourceField)"
                                                                    :style="`padding-left: ${info.sourceField.length != 1 ? '0' : '10px'};color: #dcdcdc;cursor:pointer;`"
                                                                ></i>
                                                            </el-tooltip>
                                                        </div>
                                                    </div>
                                                    <div class="merge-with">
                                                        <el-input style="width: calc(26.66% - 12px); margin-right: 36px;" clearable v-model.trim="info.with" placeholder="特殊值说明">
                                                            <template slot="prepend">
                                                                WITH
                                                            </template>
                                                        </el-input>
                                                        <el-input style="width: calc(26.66% - 12px); margin-right: 36px;" clearable v-model="info.connectStr" placeholder="合并字段时中间的连接符">
                                                            <template slot="prepend">
                                                                连接符
                                                            </template>
                                                        </el-input>
                                                        <el-input style="width: calc(26.66% - 12px);" clearable v-model.trim="info.targetField" placeholder="合并后字段名称">
                                                            <template slot="prepend">
                                                                合并为
                                                            </template>
                                                        </el-input>
                                                        <el-tooltip class="item" effect="dark" content="删除合并字段组" placement="top">
                                                            <i
                                                                v-show="item.fields.length != 1"
                                                                @click.stop="removeInfo(item.fields, i)"
                                                                class="el-icon-remove-outline"
                                                                style="color: #ff2727;cursor:pointer; padding-left:10px;"
                                                            ></i>
                                                        </el-tooltip>
                                                        <el-tooltip class="item" effect="dark" content="添加合并字段组" placement="top">
                                                            <i
                                                                v-show="item.fields.length === i + 1"
                                                                class="el-icon-circle-plus-outline"
                                                                @click.stop="addMergeItem(item.fields)"
                                                                style="color: #0052d9;cursor:pointer;margin-left: 10px;"
                                                            ></i>
                                                        </el-tooltip>
                                                    </div>
                                                </div>
                                            </template>
                                            <template v-if="item.type == 'tailoring'">
                                                <div v-for="(info, i) in item.fields" :key="i" class="key-value">
                                                    <el-input style="width: 40%;" clearable v-model.trim="info.sourceField" placeholder="字段名称"></el-input>
                                                    <div class="length-wrap" style="width: 40%;">
                                                        <el-input-number
                                                            style="width: calc(50% - 10px);"
                                                            controls-position="right"
                                                            clearable
                                                            v-model.trim="info.start"
                                                            :min="0"
                                                            placeholder="截取起始位置"
                                                        >
                                                        </el-input-number>
                                                        <el-input-number
                                                            style="width: calc(50% - 10px);margin-left: 20px;"
                                                            controls-position="right"
                                                            clearable
                                                            v-model.trim="info.length"
                                                            :min="1"
                                                            placeholder="截取长度"
                                                        ></el-input-number>
                                                    </div>
                                                    <i
                                                        v-show="item.fields.length != 1"
                                                        @click.stop="removeInfo(item.fields, i)"
                                                        class="el-icon-remove-outline"
                                                        style="color: #ff2727;cursor:pointer;margin-left:10px;"
                                                    ></i>
                                                    <i
                                                        class="el-icon-circle-plus-outline"
                                                        @click.stop="addTailoring(item.fields)"
                                                        style="color: #0052d9;cursor:pointer;margin-left:10px;"
                                                    ></i>
                                                </div>
                                            </template>
                                        </div>
                                    </el-form-item>
                                </div>
                                <el-form-item class="add-rule" label="" size="small">
                                    <i style="font-size: 12px;color: #0052d9;" @click.stop.prevent="addFilter" class="el-icon-plus"></i>
                                    <span style="font-size: 12px; color: #0052d9;" @click.stop.prevent="addFilter">添加数据过滤规则</span>
                                </el-form-item>
                                <div class="ub ub-pc">
                                    <el-button size="small" type="primary" @click="parseing">解 析</el-button>
                                </div>
                            </div>
                        </el-form>
                        <div class="title w100"><span class="t1">解析结果</span></div>
                        <div class="parse">
                            <div class="parse-res" v-if="parseingResult.length">
                                <el-form label-width="auto" class="parse-form" :key="key" v-for="(parseItem, key) in parseingResult">
                                    <div class="ub mb20" style="width:92.4%; justify-content: space-between;">
                                        <el-form-item style="flex: 1; margin-right: 70px;" label="原始字段：" size="small">
                                            <el-input disabled v-model.trim="parseItem.sourceField"></el-input>
                                        </el-form-item>
                                        <el-form-item style="flex: 1; margin-right: 70px;" label="系统字段：" size="small">
                                            <el-select style="width: 100%;" filterable clearable v-model.trim="parseItem.systemField" @change="() => parseItem.default = ''" placeholder="请选择">
                                                <el-option v-for="(item, index) in systemFieldOptins" :key="index" :label="item.label" :value="item.id"></el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item style="flex: 1;" label="默认值：" size="small">
                                            <template v-if="getSystemField(parseItem) && getSystemField(parseItem).type == 5">
                                                <el-select style="width: 100%;" filterable clearable v-model.trim="parseItem.default" placeholder="请选择">
                                                    <el-option v-for="(item, index) in getSystemField(parseItem).enums" :key="index" :label="item.label" :value="item.value"></el-option>
                                                </el-select>
                                            </template>
                                            <template v-else-if="getSystemField(parseItem) && getSystemField(parseItem).type == 3">
                                                <el-date-picker
                                                    style="width: 100%;"
                                                    v-model="parseItem.default"
                                                    value-format="yyyy-MM-dd HH:mm:ss"
                                                    type="datetime"
                                                    placeholder="选择日期时间">
                                                </el-date-picker>
                                            </template>
                                            <template v-else-if="getSystemField(parseItem) && getSystemField(parseItem).type == 2">
                                                <el-input-number v-model="parseItem.default" controls-position="right" style="width: 100%;"></el-input-number>
                                            </template>
                                            <template v-else-if="getSystemField(parseItem) && getSystemField(parseItem).type == 4">
                                                <ip-input :defaultIp="parseItem.default" @getIpVal="(val) => { parseItem.default = val }"></ip-input>
                                            </template>
                                            <template v-else>
                                                <el-input v-model.trim="parseItem.default"></el-input>
                                            </template>
                                        </el-form-item>
                                    </div>
                                    <div class="ub mb20" style="justify-content: space-between;">
                                        <el-form-item style="width:92.4%;" label="匹配结果：" size="small">
                                            <el-input  disabled v-model.trim="parseItem.matchingResult"></el-input>
                                        </el-form-item>
                                        <div class="parse-action ub ub-ac" style="width: 7.6%;" @click="addMap(parseItem)">
                                            <i class="el-icon-plus" @click.stop="addInfo(item.fields)" style="color: #0052d9;cursor:pointer;margin-left:10px;"></i>
                                            添加映射
                                        </div>
                                    </div>
                                    <div class="map_list">
                                        <div class="map_item ub mb20" :key="mapidx" v-for="(mapItem, mapidx) in parseItem.mapping">
                                            <!-- 文本 1 -->
                                            <!-- base64解码 2 -->
                                            <!-- Unicode解码 3 -->
                                            <!-- 重定义 4 -->
                                            <div style="width:92.4%;" v-if="mapItem.type == '1'" class="ub ub-pj">
                                                <el-form-item style="flex: 1;margin-right: 70px;" label="映射类型：" size="small">
                                                    <el-select filterable style="width: 100%;" v-model.trim="mapItem.type" @change="changeMapType(mapItem)" placeholder="请选择">
                                                        <el-option v-for="(typeItem, tpidx) in mapTypeList" :key="tpidx" :label="typeItem.label" :value="typeItem.value"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                                <el-form-item style="flex: 1;margin-right: 70px;" label="匹配值：" size="small">
                                                    <el-input v-model.trim="mapItem.matchingValue"></el-input>
                                                </el-form-item>
                                                <el-form-item style="flex: 1;" label="映射值：" size="small"><el-input v-model.trim="mapItem.mappingValue"></el-input></el-form-item>
                                            </div>
                                            <div style="width:92.4%;" v-if="mapItem.type == '2'" class="ub ub-pj">
                                                <el-form-item style="width: calc((100% - 140px)/3);" label="映射类型：" size="small">
                                                    <el-select filterable style="width: 100%;" v-model.trim="mapItem.type" @change="changeMapType(mapItem)" placeholder="请选择">
                                                        <el-option v-for="(typeItem, tpidx) in mapTypeList" :key="tpidx" :label="typeItem.label" :value="typeItem.value"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                                <el-form-item style="width: calc(100% - (100% - 140px)/3 - 70px);" label="编码：" size="small">
                                                    <el-input v-model.trim="mapItem.codingMode"></el-input>
                                                </el-form-item>
                                            </div>
                                            <div style="width:92.4%;" v-if="mapItem.type == '3'" class="ub ub-pj">
                                                <el-form-item style="width: calc((100% - 140px)/3);" label="映射类型：" size="small">
                                                    <el-select filterable style="width: 100%;" v-model.trim="mapItem.type" @change="changeMapType(mapItem)" placeholder="请选择">
                                                        <el-option v-for="(typeItem, tpidx) in mapTypeList" :key="tpidx" :label="typeItem.label" :value="typeItem.value"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </div>
                                            <div style="width:92.4%;" v-if="mapItem.type == '4'" class="ub ub-pj">
                                                <el-form-item style="width: calc((100% - 140px)/3);" label="映射类型：" size="small">
                                                    <el-select filterable style="width: 100%;" v-model.trim="mapItem.type" placeholder="请选择">
                                                        <el-option v-for="(typeItem, tpidx) in mapTypeList" :key="tpidx" :label="typeItem.label" :value="typeItem.value"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                                <el-form-item style="width: calc(100% - (100% - 140px)/3 - 70px);" label="重定义字段：" size="small">
                                                    <el-input v-model.trim="mapItem.redefinition"></el-input>
                                                </el-form-item>
                                            </div>
                                            <div class="map-action ub ub-ac">
                                                <i @click.stop="removeInfo(parseItem.mapping, mapidx)" class="el-icon-remove-outline" style="color: #ff2727;cursor:pointer;"></i>
                                            </div>
                                        </div>
                                    </div>
                                </el-form>
                            </div>
                            <div @click="review" v-if="parseingResult.length" class="parse-btn">预 览</div>
                            <div v-else style="height: 80px;line-height: 80px;color: rgba(0,0,0,.4);font-size:12px">无数据</div>
                        </div>
                    </template>
                </div>
                <div v-if="formData.type != '转发透传' && formData.type != '不解析'" class="w100 preview-wrapper">
                    <div class="title w100"><span class="t1">内容预览</span></div>
                    <div class="preview" v-if="previewData.length">
                        <div class="p-item" v-for="(pre, index) in previewData" :key="index">
                            <div class="ub pre-line">
                                <div class="inner ub ub-ac">
                                    <div class="pre-key">字段名称</div>
                                    <div class="pre-value">{{ pre.fieldName || '--' }}</div>
                                </div>
                                <div class="inner ub ub-ac">
                                    <div class="pre-key">属性名称</div>
                                    <div class="pre-value">{{ pre.attrName || '--' }}</div>
                                </div>
                            </div>
                            <div class="ub pre-line">
                                <div class="inner ub ub-ac">
                                    <div class="pre-key">参考值</div>
                                    <div class="pre-value">{{ pre.referenceValue || '--' }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else style="height: 80px;line-height: 80px;color: rgba(0,0,0,.4);font-size:12px">无数据</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import IpInput from '@/components/IpInput.vue'
import { parseJsonLog, parseRegLog, save, getAllField, getLogTree, update } from '@/server/data_manage/data_analysis.js'

export default {
    name: 'AddRule',
    components: { Treeselect, IpInput },
    data() {
        let checkRuleExp = (rule, value, callback) => {
            if (this.formData.type == '正则') {
                // 是正则
                if (value === '') {
                    callback(new Error('请输入规则表达式'))
                } else {
                    callback()
                }
            } else {
                callback()
            }
        }
        let checkForwardAdd = (rule, value, callback) => {
            if (this.formData.type == '转发透传') {
                // 是正则
                if (value === '') {
                    callback(new Error('请输入转发地址'))
                } else {
                    callback()
                }
            } else {
                callback()
            }
        }

        return {
            normalizer(node) {
                return {
                    id: node.id,
                    label: node.name,
                    children: node.child
                }
            },
            assetTypeList: [],
            regAssetTypeList: [],
            loading: false, // 右侧整体loading
            formData: {
                ruleExpression: '', // 规则表达式
                analysisDesc: '', // 解析规则描述
                contentExample: '', // 样例日志
                forwardingAddress: '', // 转发地址
                name: '', // 解析规则名称
                deviceType: null, // 接入设备类型
                type: '', // 解析模式
                company: '', // 数据源厂商
                logType: '', // 接入设备类型的一级id
                dtsec: '', // 缓存二级接入设备id
                dt: '' // 二级或三级接入设备id
            },
            filters: [],
            parseRes: {
                result: ''
            },
            filtersTypes: [
                {
                    label: '添加字段',
                    value: 'add'
                },
                {
                    label: '合并字段',
                    value: 'merge'
                },
                {
                    label: '字段剪裁',
                    value: 'tailoring'
                }
            ],
            types: [
                {
                    label: '正则',
                    value: '正则'
                },
                {
                    label: '不解析',
                    value: '不解析'
                },
                {
                    label: '转发透传',
                    value: '转发透传'
                },
                {
                    label: 'JSON',
                    value: 'JSON'
                }
            ],
            mapTypeList: [
                {
                    label: '文本',
                    value: '1'
                },
                {
                    label: 'base64解码',
                    value: '2'
                },
                {
                    label: 'Unicode解码',
                    value: '3'
                }
            ],
            // 解析结果
            parseingResult: [],
            // 系统字段列表
            systemFieldOptins: [],
            formDataRules: {
                ruleExpression: [{ required: true, validator: checkRuleExp, trigger: 'blur' }],
                forwardingAddress: [{ required: true, validator: checkForwardAdd, trigger: 'blur' }],
                contentExample: [{ required: true, message: '为了验证规则准确性，请输入一条原始日志', trigger: 'blur' }],
                deviceType: [{ required: true, message: '请选择接入设备类型', trigger: 'change' }],
                name: [{ required: true, message: '请输入规则名称', trigger: 'blur' }],
                type: [{ required: true, message: '请选择解析类型', trigger: 'change' }]
            },
            valiFilterAdd: {},
            addRules: {
                // name0: [{ required: true, message: '请输入字段名称', trigger: ['blur', 'change'] }]
            },
            previewData: [],
            fieldPlaceholder: 'field',
            replaceTxt: '<%>',
            compantList: [],
            systemAll: [] // 所有的字段
        }
    },
    filters: {
        setIdx(value) {
            console.log(this)
            console.log(value)
            let txt = ''
            value.split('<%>').forEach((item, index) => {
                if (item) {
                    txt += `${item}<%${index}>`
                }
            })
            return txt
        }
    },
    mounted() {
        this.getLogTreeOp()
        this.getSystemOption()
        if (this.$route.query.id) {
            this.formData.id = this.$route.query.id
            this.backFill()
        }
    },
    watch: {
        'formData.contentExample': function(newval, oldval) {
            console.log(this.formData.ruleExpression)
            if (this.formData.ruleExpression == '') {
                this.formData.ruleExpression = this.formData.contentExample
            }
        },
        'formData.deviceType': function(newval, oldval) {
            if (this.systemAll.length && this.formData.logType) {
                this.systemFieldOptins = this.systemAll.filter(item => item.id == this.formData.logType)[0].child
            }
        }
    },
    computed: {
        getSystemField() {
            return function(parseItem) {
                return this.systemFieldOptins.filter(sys => sys.id == parseItem.systemField)[0]
            }
        }
    },
    methods: {
        changePer(value) {
            // console.log(value)
            const oriTxt = this.replacePer(value)
            // console.log(oriTxt)
            let txt = ''
            const oriTxtArr = oriTxt.split('<%>')
            oriTxtArr.forEach((item, index) => {
                if (item && index != oriTxtArr.length - 1) {
                    txt += `${item}<%${index}>`
                } else {
                    txt += item
                }
            })
            this.formData.ruleExpression = txt
        },
        replacePer(value) {
            let reg = /(?<=\<%)\d*(?=\>)/g
            return value.replaceAll(reg, '')
        },
        changeAddField(select, info, i) {
            const selobj = this.systemFieldOptins.filter(item => item.value == select)[0]
            // info.targetField = select
            info.type = selobj ? selobj.type : ''
            info.option = selobj ? selobj.enums || [] : []
            console.log(info)
        },
        replaceText(event) {
            let el = this.$refs.replaceInput.$el.children[0]
            setTimeout(() => {
                const start = el.selectionStart
                const end = el.selectionEnd
                if (start !== end) {
                    const ruleExp = this.formData.ruleExpression.substr(0, start) + this.replaceTxt + this.formData.ruleExpression.substr(end)
                    this.changePer(ruleExp)
                }
            })
        },
        getSystemOption() {
            getAllField({
                queryData: {},
                paramsData: {}
            }).then(res => {
                this.systemAll = res
                this.systemFieldOptins = this.formData.logType ? this.systemAll.filter(item => item.id == this.formData.logType)[0].child : []
            })
        },
        ruleBlur() {
            this.replaceText()
        },
        // 获取三级树
        getLogTreeOp() {
            getLogTree({
                queryData: {},
                paramsData: {}
            }).then(res => {
                const list = this.$deepCopy(res)
                list.forEach(item => {
                    if (item.child && item.child.length) {
                        item.child.forEach(c => {
                            if (c.child && c.child.length) {
                                delete c.child
                            }
                        })
                    }
                })
                this.allDeviceType = res
                this.regAssetTypeList = list
                // 如果是编辑，设置回显数据源厂商
                if (this.$route.query.id) {
                    console.log(this.formData.deviceTypeBus)
                    this.getThridLevelBus(this.formData.deviceTypeBus)
                    // id这个是
                    console.log(this.formData.deviceType)
                    this.getThridLevel(this.formData.deviceType)
                }
            })
        },
        treeChange(value, instanceId) {
            console.log(value)
            if (!value) {
                this.formData.logType = '' // 一级id
                this.formData.deviceTypeBus = '' // 二级取busId
                this.formData.dt = '' // 先存储id，如果数据源厂商有选择就在存储一下
                this.formData.dtsec = '' // 如果数据源厂商清空选择，用二级数据覆盖
                this.formData.company = ''
                this.compantList = []
            }
        },
        selectNode(node, instanceId) {
            console.log(node)
            this.formData.logType = node.parentId // 一级id
            this.formData.deviceTypeBus = node.busId // 二级取busId
            this.formData.dt = node.id // 先存储id，如果数据源厂商有选择就在存储一下
            this.formData.dtsec = node.id // 如果数据源厂商清空选择，用二级数据覆盖
            this.getThridLevel(node.id)
            this.formData.company = ''
        },
        changeCpy(busId) {
            console.log(busId)
            let id
            if (busId) {
                id = this.compantList.filter(item => item.busId == busId)[0].id
            } else {
                id = this.formData.dtsec
            }
            this.formData.dt = id
        },
        // 根据id获取第三级数据
        getThridLevel(id) {
            this.allDeviceType.forEach(item => {
                if (item.child && item.child.length) {
                    item.child.forEach(c => {
                        if (c.id == id) {
                            this.compantList = c.child
                        }
                    })
                }
            })
            console.log(this.compantList)
        },
        // 根据busid获取deviceType
        getThridLevelBus(busid) {
            const firstLevel = this.allDeviceType.filter(item => item.id == this.formData.logType)[0]
            // console.log(firstLevel)
            if (firstLevel.child && firstLevel.child.length) {
                firstLevel.child.forEach(c => {
                    // console.log(c)
                    if (c.busId == busid) {
                        // console.log(c)
                        this.formData.deviceType = c.id
                    }
                })
            }
        },
        // 改变映射类型，如果为2，添加默认值
        changeMapType(MapItem) {
            if (MapItem.type == '2') {
                MapItem.codingMode = 'UTF-8'
            }
        },
        mouseLeave() {},
        // 预览
        review() {
            this.previewData = []
            this.parseingResult.forEach(item => {
                let sys = this.systemFieldOptins.filter(sys => {
                    return sys.id == item.systemField
                })[0]
                let referenceValue = item.default || item.matchingResult
                if (item.mapping && item.mapping.length) {
                    referenceValue = this.mapToDoList(item.mapping, referenceValue)
                }
                this.previewData.push({
                    fieldName: sys ? sys.label : '',
                    attrName: sys ? sys.value : '',
                    referenceValue
                })
            })
        },
        // 匹配映射用于预览
        mapToDoList(list, value) {
            let i = 0
            let finallyReturnValue = ''
            function recMappding(i, finallyValue, list) {
                // <!-- 文本 1 -->
                // <!-- base64解码 2 -->
                // <!-- Unicode解码 3 -->
                const item = list[i]
                // console.log(item)
                // console.log(finallyValue)
                if (item) {
                    switch (item.type) {
                        case '1':
                            if (item.matchingValue == finallyValue) {
                                // 匹配成功
                                finallyReturnValue = item.mappingValue
                            } else {
                                finallyReturnValue = finallyValue
                            }
                            break
                        case '2':
                            try {
                                finallyReturnValue = atob(finallyValue)
                            } catch (err) {
                                console.log(err)
                                finallyReturnValue = ''
                            }
                            break
                        case '3':
                            try {
                                finallyReturnValue = decodeURIComponent(finallyValue)
                            } catch (err) {
                                console.log(err)
                                finallyReturnValue = ''
                            }
                    }
                    i++
                    recMappding(i, finallyReturnValue, list)
                }
            }
            recMappding(i, value, list)
            // console.log(finallyReturnValue)
            return finallyReturnValue
        },
        // 添加映射
        addMap(data) {
            data.mapping.push({
                type: '1',
                matchingValue: '',
                mappingValue: ''
            })
        },
        // 数据过滤增加规则
        addFilter() {
            this.filters.push({
                type: 'add',
                fields: [
                    {
                        sourceField: '',
                        targetField: ''
                    }
                ]
            })
        },
        // 编辑回填数据
        backFill() {
            let data = JSON.parse(sessionStorage.getItem('analysisData'))
            console.log(data)
            // 基础信息部分
            this.formData.analysisDesc = data.detail || ''
            this.formData.contentExample = data.logExample || ''
            this.formData.dt = data.dt || ''
            // 规则表达式给<%> 添加index，异步赋值
            setTimeout(() => {
                // console.log(this.changePer(data.expression))
                this.changePer(data.expression)
            })
            this.formData.forwardingAddress = data.forwardUrl || ''
            this.formData.name = data.name || ''
            this.formData.deviceTypeBus = data.assetsTypeId || ''
            this.formData.logType = data.logType || ''
            switch (data.type) {
                case 1:
                    this.formData.type = '正则'
                    break
                case 2:
                    this.formData.type = 'JSON'
                    break
                case 3:
                    this.formData.type = '不解析'
                    break
                case 4:
                    this.formData.type = '转发透传'
                    break
            }
            this.formData.company = data.manufacturerId || ''
            // console.log(data)
            // 数据过滤部分
            this.filters = []
            data.filters.forEach(item => {
                const filter = {}
                switch (item.type) {
                    case 1:
                        filter.type = 'add'
                        filter.fields = item.detail.map(f => {
                            return { sourceField: f.fieldValue, targetField: f.fieldName }
                        })
                        break
                    case 2:
                        filter.type = 'merge'
                        filter.fields = item.detail.map(f => {
                            return {
                                sourceField: f.fieldName.split(',').map(fn => {
                                    return { value: fn }
                                }),
                                with: f.withValue,
                                targetField: f.newField,
                                connectStr: f.connectStr
                            }
                        })
                        break
                    case 3:
                        filter.type = 'tailoring'
                        filter.fields = item.detail.map(f => {
                            return { sourceField: f.fieldName, start: f.subPosition, length: f.subLength }
                        })
                        break
                }
                this.filters.push(filter)
            })
            console.log(this.filters)
            // 解析结果部分
            this.parseingResult = []
            data.results.forEach(item => {
                this.parseingResult.push({
                    sourceField: item.originalField,
                    matchingResult: item.matchValue,
                    systemField: item.systemFieldId,
                    default: item.defaultValue,
                    mapping: item.mapping.map(mp => {
                        const mapObj = {}
                        switch (mp.type) {
                            case 1:
                                mapObj.type = '1'
                                mapObj.matchingValue = mp.matchValue
                                mapObj.mappingValue = mp.mappingValue
                                break
                            case 2:
                                mapObj.type = '2'
                                mapObj.codingMode = mp.encoded
                                break
                            case 3:
                                mapObj.type = '3'
                                break
                        }
                        return mapObj
                    })
                })
            })
            this.previewData = []
            console.log(this.formData)
        },
        // 数据过滤删除规则
        removeFilter(index) {
            this.filters.splice(index, 1)
        },
        // 数据过滤校验必填项
        validateFilter() {
            let validFlag = true
            let validMsg = ''
            for (let i = 0; i < this.filters.length; i++) {
                let item = this.filters[i]
                switch (item.type) {
                    case 'add':
                        item.fields.forEach(fie => {
                            if (fie.targetField == '') {
                                validFlag = false
                                validMsg = '添加字段时，请输入字段名称'
                            }
                        })
                        break
                    case 'merge':
                        item.fields.forEach(fie => {
                            if (fie.sourceField.every(i => i.value == '')) {
                                validFlag = false
                                validMsg = '合并字段时，要合并的字段不能为空'
                            }
                            if (fie.targetField == '') {
                                validFlag = false
                                validMsg = '合并字段时，合并后字段不能为空'
                            }
                        })
                        break
                    case 'tailoring':
                        item.fields.forEach(fie => {
                            if (fie.sourceField == '') {
                                validFlag = false
                                validMsg = '字段剪裁时，字段名称不能为空'
                            }
                        })
                        break
                }
                if (validFlag == false) {
                    this.$message.warning(validMsg)
                    break
                }
            }
            return validFlag
        },
        // 数据过滤增加字段
        addInfo(data) {
            data.push({
                sourceField: '',
                targetField: ''
            })
        },
        // 数据过滤合并字段添加要合并的字段
        addMerge(data) {
            data.push({
                value: ''
            })
        },
        // 数据过滤合并字段添加新的合并
        addMergeItem(data) {
            data.push({
                sourceField: [{ value: '' }],
                with: '',
                targetField: ''
            })
        },
        // 数据过滤字段剪裁
        addTailoring(data) {
            data.push({
                sourceField: '',
                start: undefined,
                length: undefined
            })
        },
        // 数据过滤删除字段
        removeInfo(data, index) {
            data.splice(index, 1)
        },
        // 处理基础信息
        baseDataFormat() {
            const data = this.$deepCopy(this.formData)
            let type
            switch (data.type) {
                case '正则':
                    type = 1
                    break
                case 'JSON':
                    type = 2
                    break
                case '不解析':
                    type = 3
                    break
                case '转发透传':
                    type = 4
                    break
            }
            const baseData = {
                name: data.name,
                logType: data.logType,
                assetsTypeId: data.deviceTypeBus,
                manufacturerId: data.company,
                type,
                detail: data.analysisDesc,
                forwardUrl: data.forwardingAddress,
                logExample: data.contentExample,
                expression: this.replacePer(data.ruleExpression),
                dt: data.dt
            }
            return baseData
        },
        // 处理解析数据
        filterDataFormat() {
            const data = this.$deepCopy(this.filters)
            const filters = []
            data.forEach(item => {
                const filterObj = {}
                switch (item.type) {
                    case 'add':
                        filterObj.type = 1
                        filterObj.detail = []
                        item.fields.forEach(fie => {
                            filterObj.detail.push({
                                fieldName: fie.targetField,
                                fieldValue: fie.sourceField
                            })
                        })
                        break
                    case 'merge':
                        filterObj.type = 2
                        filterObj.detail = []
                        item.fields.forEach(fie => {
                            filterObj.detail.push({
                                withValue: fie.with,
                                newField: fie.targetField,
                                connectStr: fie.connectStr,
                                fieldName: fie.sourceField.filter(i => i.value).map(i => i.value).join(',')
                            })
                        })
                        break
                    case 'tailoring':
                        filterObj.type = 3
                        filterObj.detail = []
                        item.fields.forEach(fie => {
                            filterObj.detail.push({
                                subLength: fie.length,
                                subPosition: fie.start,
                                fieldName: fie.sourceField
                            })
                        })
                        break
                }
                filters.push(filterObj)
            })
            return filters
        },
        // 解析结果处理
        parseResFormat() {
            const data = this.$deepCopy(this.parseingResult)
            const result = []
            data.forEach(item => {
                const mapping = []
                item.mapping.forEach(mp => {
                    const mpObj = {}
                    switch (mp.type) {
                        case '1':
                            mpObj.type = 1
                            mpObj.matchValue = mp.matchingValue
                            mpObj.mappingValue = mp.mappingValue
                            break
                        case '2':
                            mpObj.type = 2
                            mpObj.encoded = mp.codingMode
                            break
                        case '3':
                            mpObj.type = 3
                            break
                    }
                    mapping.push(mpObj)
                })

                result.push({
                    originalField: item.sourceField,
                    systemFieldId: item.systemField,
                    defaultValue: item.default,
                    matchValue: item.matchingResult,
                    mapping
                })
            })
            return result
        },
        // 解析按钮
        parseing() {
            let request
            if (!this.formData.contentExample) {
                this.$message({
                    message: '请输入样例日志'
                })
                return
            }
            if (!this.formData.deviceType) {
                this.$message({
                    message: '请选择接入设备类型'
                })
                return
            }
            let params = {
                logExample: this.formData.contentExample
            }
            if (this.formData.type == '正则') {
                if (!this.formData.ruleExpression) {
                    this.$message({
                        message: '请输入规则表达式'
                    })
                    return
                }
                params.expression = this.replacePer(this.formData.ruleExpression)
                console.log(params.expression)
                request = parseRegLog
            }
            const valid = this.validateFilter()
            if (valid == false) return
            console.log(valid)
            if (this.formData.type == 'JSON') {
                request = parseJsonLog
            }
            console.log(this.filterDataFormat())
            params.filters = this.filterDataFormat()
            request({
                queryData: {},
                paramsData: params
            }).then(res => {
                console.log(res)
                this.parseingResult = []
                res.forEach(item => {
                    this.parseingResult.push({
                        sourceField: item.originalField,
                        matchingResult: item.matchValue,
                        systemField: '',
                        default: '',
                        mapping: []
                    })
                })
                console.log(this.systemFieldOptins)
            })
        },
        cancel() {
            this.$router.back(-1)
        },
        // 数据过滤类型变化
        changeType(item, data) {
            console.log(item, data)
            if (data == 'add') {
                item.fields = [{ sourceField: '', targetField: '' }]
            }
            if (data == 'merge') {
                item.fields = [{ sourceField: [{ value: '' }], with: '', targetField: '', connectStr: '' }]
            }
            if (data == 'tailoring') {
                item.fields = [{ sourceField: '', start: undefined, length: undefined }]
            }
        },
        resetBaseForm() {
            this.formData.ruleExpression = ''
            this.formData.analysisDesc = ''
            this.formData.contentExample = ''
            this.formData.forwardingAddress = ''
            this.formData.name = ''
            this.formData.deviceType = null
            this.formData.type = ''
        },
        resetFilter() {
            this.filters = []
        },
        resetResult() {
            this.parseingResult = []
        },
        resetPreview() {
            this.previewData = []
        },
        reset() {
            this.resetBaseForm()
            this.resetFilter()
            this.resetResult()
            this.resetPreview()
        },
        finish() {
            const valid = this.validateFilter()
            if (valid == false) return
            this.$refs.formData.validate((valid, field) => {
                console.log(valid)
                if (valid) {
                    if (this.formData.id) {
                        this.edit()
                    } else {
                        const params = this.baseDataFormat()
                        if (this.formData.type == '正则' || this.formData.type == 'JSON') {
                            const filters = this.filterDataFormat()
                            const parseData = this.parseResFormat()
                            params.filters = filters
                            params.results = parseData
                        }
                        save({
                            paramsData: params
                        }).then(res => {
                            console.log(res)
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            })
                            this.$router.push('/data_manage/data_analysis')
                        })
                    }
                }
            })
        },
        edit() {
            const params = this.baseDataFormat()
            if (this.formData.type == '正则' || this.formData.type == 'JSON') {
                const filters = this.filterDataFormat()
                const parseData = this.parseResFormat()
                params.filters = filters
                params.results = parseData
            }
            if (this.formData.id) {
                params.id = this.formData.id
            }
            update({
                paramsData: params
            }).then(res => {
                console.log(res)
                this.$message({
                    message: '操作成功',
                    type: 'success'
                })
                this.$router.push('/data_manage/data_analysis')
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.parse-res{
    ::v-deep .el-form-item__label{
        color:#0052d9 !important;
    }
}
.event-content{
    ::v-deep .el-input-group__prepend{
        color:#0052d9 !important;
    }
}
.event-content {
    // padding-bottom: 20px;
    background-color: #fff;
    // background-image: url('/static/img/dialog-bg2.013a7ba.png');
    // background-position: right 200px;
    // background-repeat: no-repeat;
    // background-size: 200px 320px;
    padding: 20px 20px 14px 20px;
}
.add_rules ::v-deep .el-form {
    .el-form-item__label {
        font-size: 12px;
    }
}
.relative {
    position: relative;
    .btn-wrap {
        position: absolute;
        right: 0;
        z-index:999;
        ::v-deep .cancel {
            .btn {
                p {
                    color: #a2ceec;
                }
            }
        }
        ::v-deep .cancel:hover {
            .btn {
                p {
                    color: #ffffff;
                }
            }
        }
    }
}

// .add_rules {
//     .treeselect {
//         ::v-deep .vue-treeselect__single-value {
//             font-size: 12px;
//             line-height: 30px;
//         }
//         ::v-deep .vue-treeselect__placeholder {
//             font-size: 12px;
//             line-height: 30px;
//         }
//         ::v-deep .vue-treeselect__menu {
//             font-size: 12px;
//         }
//     }
// }
.add_rules ::v-deep .is-disabled {
    .el-textarea__inner {
        background: transparent;
        border: 1px solid #dcdcdc;
        box-shadow: 0px 0px 7px #389bf7 inset;
        color: #ccc;
    }
}

.add-rules-btn {
    width: 80px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    background-color: #041f38;
    display: inline-block;
    box-shadow: inset 0px 0px 10px 0px rgba(0, 167, 245, 0.97);
    border: solid 1px #39caf3;
    font-size: 12px;
    letter-spacing: 1px;
    color: #a2ceec;
    border-radius: 5px;
    margin-right: 10px;
    cursor: pointer;
    box-sizing: border-box;
}

.reset,
.finish {
    // background-image: url(../../../assets/img/searchBg.png);
    border: none;
    background-repeat: no-repeat;
    background-position: right 0;
    background-size: 100% 30px;
    box-shadow: none;
}

.title {
    margin-top: 30px;
    line-height: 20px;
    // border-bottom: 1px solid rgba(0, 233, 255, 0.5);
    .t1 {
        display: inline-block;
        font-size: 12px;
        // border-bottom: 1px solid rgba(0, 233, 255, 0.5);
        // margin-left: 23px;
        color: #0052d9;
    }
    .tips {
        font-size: 12px;
        letter-spacing: 0px;
        color: #ffd8d8;
        text-shadow: 0px 0px 4px rgba(255, 0, 0, 0.5);
        // box-shadow: 0px 0px 4px 0px rgba(255, 0, 0, 0.5);
        opacity: 0.8;
        margin-left: 30px;
        .iconfont {
            font-size: 12px;
        }
    }
}
.form-wrapper ::v-deep .el-form {
    padding-top: 20px;
    padding-right: 40px;
}

.parse-btn {
    width: 90px;
    height: 30px;
    line-height: 26px;
    font-size: 12px;
    text-align: center;
    cursor: pointer;
    box-sizing: border-box;
    margin: 30px auto 0;
    // background-image: url(../../../assets/img/parse.png);
    opacity: 0.8;
    &:hover {
        opacity: 1;
    }
    background: #387dee;
    color: #fff;
    border-radius: 4px;
}
.separator ::v-deep .label-tit {
    .el-form-item__label {
        color: #00ffe4;
    }
}
.data-filter {
    .label-tit ::v-deep .el-form-item__label {
        color: #00ffe4;
    }

    .filter-item {
        background:rgba(56,125,238,0.02);
        position: relative;
        padding: 20px;
        border-radius: 2px;
        border: solid 1px #dddddd;
        // background: rgba(0,0,0,.25);
        .key-value:not(:last-child) {
            margin-bottom: 20px;
        }
        .del-item {
            width:66px;
            height: 24px;
            cursor: pointer;
            position: absolute;
            top: 0;
            right: 0px;
            color: #e34d59 !important;
            border: solid 1px #dddddd;
            text-align: center;
            line-height: 24px;
            border-top: none;
            border-right: none;
            border-radius:0 0 0 10px !important;
        }
    }
    .add-rule ::v-deep .el-form-item__content {
        color: #0052d9;
        cursor: pointer;
        display: inline-block;
        border: solid 1px #387dee;
        border-radius: 3px;
        padding-left: 10px;
        padding-right: 10px;
        height:24px;
        line-height:24px;
    }
}
.field-wrap {
    display: flex;
    padding: 30px 20px;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    .field-table ::v-deep .cell {
        height: 30px;
        line-height: 30px;
    }
    .edit-table ::v-deep .el-input__inner {
        height: 26px;
        line-height: 26px;
    }
    .edit-table ::v-deep .el-input__icon {
        line-height: 30px;
    }
    .edit-table ::v-deep .cell {
        height: 30px;
        line-height: 30px;
    }
}
.length-wrap {
    display: inline-block;
    margin-left: 36px;
}
.merge-item-wrap {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    .merge-inner {
        width: calc(40% + 36px);
        display: flex;
        align-items: center;
        margin-bottom: 20px;
    }
    .last-merge {
        width: calc(40% + 50px);
    }
    .only-merge {
        width: calc(40% + 25px);
        .el-icon-circle-plus-outline {
            margin-left: 11px;
        }
    }
}

.form-wrapper .parse-form {
    padding: 0;
    padding-top: 20px;
    padding-left: 20px;
    margin: 20px 40px 0 0px;
    background-color: rgba(0, 0, 0, .25);
    border-radius: 2px 2px 0px 2px;
    border: solid 1px rgba(28, 215, 250, 0.5);
    .mb20 {
        margin-bottom: 20px;
        .el-form-item {
            margin-bottom: 0;
        }
        .map-action {
            margin-left: 10px;
        }
    }
    .parse-action {
        cursor: pointer;
        color: #0052d9;
        font-size: 12px;
        i {
            margin-right: 6px;
        }
    }
}
.parse-form:last-child {
    margin-bottom: 20px;
}
.parse-form ::v-deep .el-form-item__label-wrap {
    // margin: 0!important;
}
.map_item {
    // border-radius: 2px 2px 0px 2px;
    // border: solid 1px #dcdcdc;
    // opacity: 0.5;
}
.preview-wrapper {
    .preview {
        margin: 20px 40px;
        color: #fff;
        border-radius: 4px 0px 0px 0px;
        .p-item {
            margin-bottom: 10px;
        }
        .pre-line {
            background: transparent;
            // border: 1px solid #dcdcdc;
            // box-shadow: 0px 0px 7px #389bf7 inset;
            height: 30px;
            line-height: 30px;
            justify-content: space-between;
        }
        .inner {
            flex: 1;
            .pre-key {
                width: 100px;
                padding-left: 9px;
                box-sizing: border-box;
                background-color: #ebf1f5;
                // box-shadow: inset 0px 0px 6px 0px rgba(0, 186, 255, 0.73);
            }
            .pre-value {
                padding-left: 20px;
            }
        }
    }
}
.arrow {
    width: 52px;
    height: 31px;
    display: inline-block;
    margin-left: 84px;
    margin-right: 84px;
    // background-image: url(../../../assets/img/arrow.png);
    transform: rotate(180deg);
    -webkit-transform: rotate(180deg);
}
.dis {
    cursor: no-drop;
}
.add_rules ::v-deep .el-radio__inner::after {
    background-color: #00e9ff;
}
.add_rules ::v-deep .el-input-number__decrease {
    border-left: 1px solid #dcdcdc;
    color: #dcdcdc;
}
.add_rules ::v-deep .el-input-number__increase {
    border-left: 1px solid #dcdcdc;
    border-bottom: 1px solid #dcdcdc;
    color: #dcdcdc;
}
.add_rules ::v-deep .el-input-number__decrease,
.add_rules ::v-deep .el-input-number__increase {
    background-color: transparent;
}
.content-rule {
    height: calc(100vh - 82px - 70px);
    overflow: scroll;
    border-top: none;
    &::before {
        display: none!important;
    }
}
.is_fixed {
    position: fixed;
    background: rgba(0,0,0,.1);
    width: calc(100% - 222px - 10px - 46px);
    z-index: 1;
}
// .white-theme {
    .form-wrapper .parse-form {
        padding: 0;
        padding-top: 20px;
        padding-left: 20px;
        margin: 20px 40px 0 0px;
        border-radius: 2px 2px 0px 2px;
        border: solid 1px #dddddd;
        background-color: #fff;
    }
    .preview-wrapper {

        .preview {
            margin: 20px 40px;
            margin-left: 0;
            color: #3f4f57;
            .p-item {
                border-top: 1px solid #dddddd;
                border-right: 1px solid #dddddd;
                border-left: 1px solid #dddddd;
                margin-bottom: 20px;
            }
            .pre-line {
                border-radius: 4px 0px 0px 0px;
                background: transparent;
                // box-shadow: 0px 0px 7px #dddddd inset;
                border-bottom: 1px solid #dddddd;
                height: 30px;
                line-height: 30px;
                justify-content: space-between;
            }
            .inner {
                flex: 1;
                .pre-key {
                    width: 100px;
                    padding-left: 9px;
                    box-sizing: border-box;
                    background-color: #ebf1f5;
                    // box-shadow: inset 0px 0px 6px 0px rgba(0, 186, 255, 0.73);
                    border-right: solid 1px #dddddd;
                    border-bottom: solid 1px #dddddd;
                    border-top: solid 1px #dddddd;
                    font-size: 12px;
                }
                .pre-value {
                    padding-left: 20px;
                    font-size: 12px;
                }
            }
        }
    }
// }
</style>
