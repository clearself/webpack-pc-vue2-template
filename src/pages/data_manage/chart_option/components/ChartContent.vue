<template>
    <div class="ub w100" style="margin-top: 10px;min-height: 400px;">
        <div class="expert-left">
            <div>
                <div class="left-title ub ub-ac"><div class="list-tips">字段</div></div>
                <div class="left-tip"><el-input size="mini" placeholder="请输入要搜索的字段名" v-model="searchName"></el-input></div>
                <div :style="{ height: heigLeft, 'overflow-y': 'auto' }">
                    <div v-show="activeChart !== 'target'">
                        <div style="font-size: 12px;color: rgb(0 0 0 / 40%);">维度</div>
                        <div class="w100 drag mb-1" style="" v-if="otherField.length">
                            <draggable
                                class="list-group w100"
                                tag="ul"
                                v-model="otherField"
                                :group="dimensionGroup"
                                v-bind="{ scroll: true, animation: 150 }"
                                :move="onMove"
                                @end="onEnd"
                            >
                                <transition-group>
                                    <li class="list-group-item w100" v-for="element in otherField" :key="element.code">
                                        <div class="ub ub-ac list-item">
                                            <div class="ub ub-f1 line1" style="font-size: 12px;">{{ element.name }}</div>
                                        </div>
                                    </li>
                                </transition-group>
                            </draggable>
                        </div>
                        <div class="w100 mb-1" style="" v-if="otherField.length == 0">
                            <div class="ub ub-ac list-item"><div class="ub ub-f1 line1 ub-pc" style="font-size: 12px;">无筛选项</div></div>
                        </div>
                    </div>
                    <div>
                        <div style="font-size: 12px;color: rgb(0 0 0 / 40%);">度量</div>
                        <div class="w100 drag mb-1" style="" v-if="numField.length && activeChart !== 'target'">
                            <draggable
                                class="list-group w100"
                                tag="ul"
                                v-model="numField"
                                :group="measureGroup"
                                v-bind="{ scroll: true, animation: 150 }"
                                :move="onMove"
                                @end="onEnd"
                            >
                                <transition-group>
                                    <li class="list-group-item w100" v-for="element in numField" :key="element.code">
                                        <div class="ub ub-ac list-item">
                                            <div class="ub ub-f1 line1" style="font-size: 12px;">{{ element.name }}</div>
                                        </div>
                                    </li>
                                </transition-group>
                            </draggable>
                        </div>
                        <div class="w100 mb-1" style="" v-if="numField.length == 0 && activeChart !== 'target'">
                            <div class="ub ub-ac list-item"><div class="ub ub-f1 line1 ub-pc" style="font-size: 12px;">无筛选项</div></div>
                        </div>
                        <div class="w100 drag mb-1" style="" v-if="numFieldCalc.length && activeChart == 'target'">
                            <draggable
                                class="list-group w100"
                                tag="ul"
                                v-model="numFieldCalc"
                                :group="measureGroup"
                                v-bind="{ scroll: true, animation: 150 }"
                                :move="onMove"
                                @end="onEnd"
                            >
                                <transition-group>
                                    <li class="list-group-item w100" v-for="element in numFieldCalc" :key="element.code">
                                        <div class="ub ub-ac list-item">
                                            <div class="ub ub-f1 line1" style="font-size: 12px;">{{ element.name }}</div>
                                        </div>
                                    </li>
                                </transition-group>
                            </draggable>
                        </div>
                        <div class="w100 mb-1" style="" v-if="numFieldCalc.length == 0 && activeChart == 'target'">
                            <div class="ub ub-ac list-item"><div class="ub ub-f1 line1 ub-pc" style="font-size: 12px;">无筛选项</div></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="ub ub-f1 ub-ver expert-right" style="overflow-x: hidden;">
            <div class="ub ub-pj w100 mb-1">
                <div class="tabs-icon">
                    <span v-for="(tab, index) in tabs" :class="{ active: tab.value == activeChart }" :key="index" @click="activeChart = tab.value">
                        <i class="iconfont" :class="tab.icon" style="margin-right: 4px;" :title="tab.label"></i>
                    </span>
                </div>
                <div style="text-align: right;">
                    <div class="save-btn" @click="saveChart">
                        <i class="iconfont icon-sousuotiaojianbaocun" style="margin-right: 6px;"></i>
                        <span>另存为</span>
                    </div>
                </div>
            </div>
            <div :style="{ height: heigRight, 'overflow-y': 'auto' }" class="chart-set">
                <div v-show="activeChart == 'table'" class="table-wrap">
                    <div class="chart-left">
                        <p class="left-header">图表配置</p>
                        <div class="X-axis">
                            <p class="x-header">列</p>
                            <draggable
                                class="list-group w100"
                                v-model="tableOption.data"
                                :group="tableOption.listGroup"
                                v-bind="{ scroll: true, animation: 150 }"
                                :move="onMove"
                                @end="onEnd"
                            >
                                <transition-group :style="style">
                                    <div class="list-group-item w100" v-for="(element, index) in tableOption.data" :key="index">
                                        <MutileSelect
                                            v-if="element.isNum"
                                            @change="obj => changeFieldTable(element, obj)"
                                            :element="element"
                                            :type="1"
                                            @remove="removeThis(tableOption.data, index)"
                                        ></MutileSelect>
                                        <MutileSelect v-else :element="element" :type="2" @remove="removeThis(tableOption.data, index)"></MutileSelect>
                                    </div>
                                    <div class="ub ub-ac list-item empty-add" :key="10000">
                                        <div class="ub ub-f1 ub-ac ub-pc"><i class="iconfont icon-tianjia"></i></div>
                                    </div>
                                </transition-group>
                            </draggable>
                        </div>
                        <el-button class="use" :loading="loading" size="small" type="primary" @click.native="tryUse">应 用</el-button>
                    </div>
                    <div class="chart-right" v-loading.lock="loading" element-loading-background="rgba(0, 0, 0, 0.05)" element-loading-text="拼命加载中......">
                        <TableChart :heigRight="heigRight" :chartData="tableData" :chatTableOption="chatTableOption" :allFieldList="allFieldList"></TableChart>
                    </div>
                </div>
                <div v-show="activeChart == 'bar'" class="bar-wrap">
                    <div class="chart-left">
                        <p class="left-header">图表配置</p>
                        <div class="X-axis">
                            <!-- <p class="x-header">{{ seqBar ? 'X轴' : 'Y轴' }}</p> -->
                            <p class="x-header">X轴</p>
                            <template v-if="seqBar">
                                <draggable
                                    class="list-group w100"
                                    v-model="barOption.xData.field"
                                    :group="barOption.xGroup"
                                    v-bind="{ scroll: true, animation: 150 }"
                                    @start="onStart"
                                    :move="onMove"
                                    @end="onEnd"
                                >
                                    <transition-group :style="style">
                                        <div class="list-group-item w100" v-for="(element, index) in barOption.xData.field" :key="index">
                                            <MutileSelect :element="element" :type="2" @remove="removeThis(barOption.xData.field, index)"></MutileSelect>
                                        </div>
                                        <div class="ub ub-ac list-item empty-add" v-if="barOption.xData.field.length == 0" :key="10000">
                                            <div class="ub ub-f1 ub-ac ub-pc"><i class="iconfont icon-tianjia"></i></div>
                                        </div>
                                    </transition-group>
                                </draggable>
                            </template>
                            <template v-if="!seqBar">
                                <draggable
                                    class="list-group w100"
                                    v-model="barOption.yData.field"
                                    :group="barOption.yGroup"
                                    v-bind="{ scroll: true, animation: 150 }"
                                    :move="onMove"
                                    @end="onEnd"
                                >
                                    <transition-group>
                                        <div class="list-group-item w100" v-for="(element, index) in barOption.yData.field" :key="index">
                                            <MutileSelect
                                                :element="element"
                                                :type="1"
                                                @remove="removeThisY(barOption.yData, index)"
                                                @change="obj => changeField(barOption.yData, obj)"
                                            ></MutileSelect>
                                        </div>
                                        <div class="ub ub-ac list-item empty-add" v-if="barOption.yData.field.length == 0" :key="10000">
                                            <div class="ub ub-f1 ub-ac ub-pc"><i class="iconfont icon-tianjia"></i></div>
                                        </div>
                                    </transition-group>
                                </draggable>
                            </template>
                        </div>
                        <div class="changeXY">
                            <div class="linexy"></div>
                            <div class="icon-change" @click="seqBar = !seqBar"><i class="iconfont icon-tihuan"></i></div>
                        </div>
                        <div class="Y-axis">
                            <!-- <p class="y-header">{{ seqBar ? 'Y轴' : 'X轴' }}</p> -->
                            <p class="x-header">Y轴</p>
                            <template v-if="seqBar">
                                <draggable
                                    class="list-group w100"
                                    v-model="barOption.yData.field"
                                    :group="barOption.yGroup"
                                    v-bind="{ scroll: true, animation: 150 }"
                                    :move="onMove"
                                    @end="onEnd"
                                >
                                    <transition-group>
                                        <div class="list-group-item w100" v-for="(element, index) in barOption.yData.field" :key="index">
                                            <MutileSelect
                                                :element="element"
                                                :type="1"
                                                @remove="removeThisY(barOption.yData, index)"
                                                @change="obj => changeField(barOption.yData, obj)"
                                            ></MutileSelect>
                                        </div>
                                        <div class="ub ub-ac list-item empty-add" v-if="barOption.yData.field.length == 0" :key="10000">
                                            <div class="ub ub-f1 ub-ac ub-pc"><i class="iconfont icon-tianjia"></i></div>
                                        </div>
                                    </transition-group>
                                </draggable>
                            </template>
                            <template v-if="!seqBar">
                                <draggable
                                    class="list-group w100"
                                    v-model="barOption.xData.field"
                                    :group="barOption.xGroup"
                                    v-bind="{ scroll: true, animation: 150 }"
                                    @start="onStart"
                                    :move="onMove"
                                    @end="onEnd"
                                >
                                    <transition-group :style="style">
                                        <div class="list-group-item w100" v-for="(element, index) in barOption.xData.field" :key="index">
                                            <MutileSelect :element="element" :type="2" @remove="removeThis(barOption.xData.field, index)"></MutileSelect>
                                        </div>
                                        <div class="ub ub-ac list-item empty-add" v-if="barOption.xData.field.length == 0" :key="10000">
                                            <div class="ub ub-f1 ub-ac ub-pc"><i class="iconfont icon-tianjia"></i></div>
                                        </div>
                                    </transition-group>
                                </draggable>
                            </template>
                        </div>
                        <div class="attr">
                            <p class="attr-header">属性</p>
                            <p class="attr-type-header">类型：</p>
                            <el-select class="type-select" size="small" v-model="barOption.attr.type" clearable placeholder="请选择" style="width: 100%;">
                                <el-option v-for="item in barOption.typeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                            <p class="attr-color-header ub ub-pj">
                                <span>颜色：</span>
                                <span
                                    v-if="type == 5 && barOption.attr.color[0] && getNameByCode(barOption.attr.color[0].code) == '事件等级'"
                                    style="cursor: pointer;"
                                    @click="showColorSet(barOption)"
                                >
                                    点击配置颜色
                                </span>
                            </p>
                            <draggable
                                class="list-group w100"
                                tag="ul"
                                v-model="barOption.attr.color"
                                :group="barOption.colorGroup"
                                v-bind="{ scroll: true, animation: 150 }"
                                :move="onMove"
                                @end="onEnd"
                            >
                                <transition-group>
                                    <div class="list-group-item w100" v-for="(element, index) in barOption.attr.color" :key="index">
                                        <MutileSelect :element="element" :type="2" @remove="removeThis(barOption.attr.color, index)"></MutileSelect>
                                    </div>
                                    <div class="ub ub-ac list-item empty-add" v-if="barOption.attr.color.length == 0" :key="10000">
                                        <div class="ub ub-f1 ub-ac ub-pc"><i class="iconfont icon-tianjia"></i></div>
                                    </div>
                                </transition-group>
                            </draggable>
                            <p class="attr-measure-header">细分：</p>
                            <draggable
                                class="list-group w100"
                                tag="ul"
                                v-model="barOption.attr.subdivision"
                                :group="barOption.subdivisionGroup"
                                v-bind="{ scroll: true, animation: 150 }"
                                :move="onMove"
                                @end="onEnd"
                            >
                                <transition-group>
                                    <div class="list-group-item w100" v-for="(element, index) in barOption.attr.subdivision" :key="index">
                                        <MutileSelect :element="element" :type="2" @remove="removeThis(barOption.attr.subdivision, index)"></MutileSelect>
                                    </div>
                                    <div class="ub ub-ac list-item empty-add" v-if="barOption.attr.subdivision.length == 0" :key="10000">
                                        <div class="ub ub-f1 ub-ac ub-pc"><i class="iconfont icon-tianjia"></i></div>
                                    </div>
                                </transition-group>
                            </draggable>
                            <template v-if="barOption.yData.field[0] && barOption.yData.field[0].code == 'dlz'">
                                <p class="attr-measure-header">度量列表：</p>
                                <draggable
                                    class="list-group w100"
                                    v-model="barOption.measureList"
                                    :group="barOption.measureGroup"
                                    v-bind="{ scroll: true, animation: 150 }"
                                    :move="onMove"
                                    id="dllb"
                                    @end="onEnd"
                                >
                                    <transition-group>
                                        <div class="list-group-item w100" v-for="(element, index) in barOption.measureList" :key="index">
                                            <MutileSelect
                                                @change="obj => changeMeaField(element, obj)"
                                                :element="element"
                                                :type="1"
                                                :subType="1"
                                                @remove="removeThis(barOption.measureList, index)"
                                            ></MutileSelect>
                                        </div>
                                        <div class="ub ub-ac list-item empty-add" :key="10000">
                                            <div class="ub ub-f1 ub-ac ub-pc"><i class="iconfont icon-tianjia"></i></div>
                                        </div>
                                    </transition-group>
                                </draggable>
                            </template>
                        </div>
                        <el-button class="use" :loading="loading" size="small" type="primary" @click.native="tryUse">应 用</el-button>
                    </div>
                    <div class="chart-right" v-loading.lock="loading" element-loading-background="rgba(0, 0, 0, 0.05)" element-loading-text="拼命加载中......">
                        <BarChart :type="type" :barData="barData" :seq="seqBar" :chatBarOption="chatBarOption" :allFieldList="allFieldList"></BarChart>
                    </div>
                </div>
                <div v-show="activeChart == 'pie'" class="pie-wrap">
                    <div class="chart-left">
                        <p class="left-header">图表配置</p>
                        <div class="attr">
                            <p class="attr-header">属性</p>
                            <p class="attr-type-header">类型：</p>
                            <el-select class="type-select" size="small" v-model="pieOption.attr.type" clearable placeholder="请选择" style="width: 100%;">
                                <el-option v-for="item in pieOption.typeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                            <!-- <p class="attr-color-header">颜色：</p> -->
                            <p class="attr-color-header ub ub-pj">
                                <span>颜色：</span>
                                <span
                                    v-if="type == 5 && pieOption.attr.color[0] && getNameByCode(pieOption.attr.color[0].code) == '事件等级'"
                                    style="cursor: pointer;"
                                    @click="showColorSet(pieOption)"
                                >
                                    点击配置颜色
                                </span>
                            </p>
                            <draggable
                                class="list-group w100"
                                v-model="pieOption.attr.color"
                                :group="pieOption.colorGroup"
                                v-bind="{ scroll: true, animation: 150 }"
                                :move="onMove"
                                @end="onEnd"
                            >
                                <transition-group>
                                    <div class="list-group-item w100" v-for="(element, index) in pieOption.attr.color" :key="index">
                                        <MutileSelect :element="element" :type="2" @remove="removeThis(pieOption.attr.color, index)"></MutileSelect>
                                    </div>
                                    <div class="ub ub-ac list-item empty-add" v-if="pieOption.attr.color.length == 0" :key="10000">
                                        <div class="ub ub-f1 ub-ac ub-pc"><i class="iconfont icon-tianjia"></i></div>
                                    </div>
                                </transition-group>
                            </draggable>
                            <p class="attr-color-header">角度：</p>
                            <draggable
                                class="list-group w100"
                                tag="ul"
                                v-model="pieOption.attr.angle.field"
                                :group="pieOption.angleGroup"
                                v-bind="{ scroll: true, animation: 150 }"
                                :move="onMove"
                                @end="onEnd"
                            >
                                <transition-group>
                                    <div class="list-group-item w100" v-for="(element, index) in pieOption.attr.angle.field" :key="index">
                                        <MutileSelect
                                            @change="obj => changeField(pieOption.attr.angle, obj)"
                                            :element="element"
                                            :type="1"
                                            @remove="removeThisAngle(pieOption.attr.angle, index)"
                                        ></MutileSelect>
                                    </div>
                                    <div class="ub ub-ac list-item empty-add" v-if="pieOption.attr.angle.field.length == 0" :key="10000">
                                        <div class="ub ub-f1 ub-ac ub-pc"><i class="iconfont icon-tianjia"></i></div>
                                    </div>
                                </transition-group>
                            </draggable>
                            <p class="attr-measure-header">细分：</p>
                            <draggable
                                class="list-group w100"
                                tag="ul"
                                v-model="pieOption.attr.subdivision"
                                :group="pieOption.subdivisionGroup"
                                v-bind="{ scroll: true, animation: 150 }"
                                :move="onMove"
                                @end="onEnd"
                            >
                                <transition-group>
                                    <div class="list-group-item w100" v-for="(element, index) in pieOption.attr.subdivision" :key="index">
                                        <MutileSelect :element="element" :type="2" @remove="removeThis(pieOption.attr.subdivision, index)"></MutileSelect>
                                    </div>
                                    <div class="ub ub-ac list-item empty-add" v-if="pieOption.attr.subdivision.length == 0" :key="10000">
                                        <div class="ub ub-f1 ub-ac ub-pc"><i class="iconfont icon-tianjia"></i></div>
                                    </div>
                                </transition-group>
                            </draggable>
                            <template v-if="pieOption.attr.angle.field[0] && pieOption.attr.angle.field[0].code == 'dlz'">
                                <p class="attr-measure-header">度量列表：</p>
                                <draggable
                                    class="list-group w100"
                                    v-model="pieOption.measureList"
                                    :group="pieOption.measureGroup"
                                    v-bind="{ scroll: true, animation: 150 }"
                                    :move="onMove"
                                    id="dllb"
                                    @end="onEnd"
                                >
                                    <transition-group>
                                        <div class="list-group-item w100" v-for="(element, index) in pieOption.measureList" :key="index">
                                            <MutileSelect
                                                @change="obj => changeMeaField(element, obj)"
                                                :element="element"
                                                :type="1"
                                                :subType="1"
                                                @remove="removeThis(pieOption.measureList, index)"
                                            ></MutileSelect>
                                        </div>
                                        <div class="ub ub-ac list-item empty-add" :key="10000">
                                            <div class="ub ub-f1 ub-ac ub-pc"><i class="iconfont icon-tianjia"></i></div>
                                        </div>
                                    </transition-group>
                                </draggable>
                            </template>
                        </div>
                        <el-button class="use" :loading="loading" size="small" type="primary" @click.native="tryUse">应 用</el-button>
                    </div>
                    <div class="chart-right" v-loading.lock="loading" element-loading-background="rgba(0, 0, 0, 0.05)" element-loading-text="拼命加载中......">
                        <PieChart :type="type" :pieData="pieData" :chatPieOption="chatPieOption" :allFieldList="allFieldList"></PieChart>
                    </div>
                </div>
                <div v-show="activeChart == 'line'" class="line-wrap">
                    <div class="chart-left">
                        <p class="left-header">图表配置</p>
                        <div class="X-axis">
                            <!-- <p class="x-header">{{ seqLine ? 'X轴' : 'Y轴' }}</p> -->
                            <p class="x-header">X轴</p>
                            <template v-if="seqLine">
                                <draggable
                                    class="list-group w100"
                                    v-model="lineOption.xData.field"
                                    :group="lineOption.xGroup"
                                    v-bind="{ scroll: true, animation: 150 }"
                                    :move="onMove"
                                    @end="onEnd"
                                >
                                    <transition-group :style="style">
                                        <div class="list-group-item w100" v-for="(element, index) in lineOption.xData.field" :key="index">
                                            <MutileSelect :element="element" :type="2" @remove="removeThis(lineOption.xData.field, index)"></MutileSelect>
                                        </div>
                                        <div class="ub ub-ac list-item empty-add" v-if="lineOption.xData.field.length == 0" :key="10000">
                                            <div class="ub ub-f1 ub-ac ub-pc"><i class="iconfont icon-tianjia"></i></div>
                                        </div>
                                    </transition-group>
                                </draggable>
                            </template>
                            <template v-if="!seqLine">
                                <draggable
                                    class="list-group w100"
                                    v-model="lineOption.yData.field"
                                    :group="lineOption.yGroup"
                                    v-bind="{ scroll: true, animation: 150 }"
                                    :move="onMove"
                                    @end="onEnd"
                                >
                                    <transition-group>
                                        <div class="list-group-item w100" v-for="(element, index) in lineOption.yData.field" :key="index">
                                            <MutileSelect
                                                :element="element"
                                                :type="1"
                                                @remove="removeThisY(lineOption.yData, index)"
                                                @change="obj => changeField(lineOption.yData, obj)"
                                            ></MutileSelect>
                                        </div>
                                        <div class="ub ub-ac list-item empty-add" v-if="lineOption.yData.field.length == 0" :key="10000">
                                            <div class="ub ub-f1 ub-ac ub-pc"><i class="iconfont icon-tianjia"></i></div>
                                        </div>
                                    </transition-group>
                                </draggable>
                            </template>
                        </div>
                        <div class="changeXY">
                            <div class="linexy"></div>
                            <div class="icon-change" @click="seqLine = !seqLine"><i class="iconfont icon-tihuan"></i></div>
                        </div>
                        <div class="Y-axis">
                            <!-- <p class="y-header">{{ seqLine ? 'Y轴' : 'X轴' }}</p> -->
                            <p class="y-header">Y轴</p>
                            <template v-if="seqLine">
                                <draggable
                                    class="list-group w100"
                                    v-model="lineOption.yData.field"
                                    :group="lineOption.yGroup"
                                    v-bind="{ scroll: true, animation: 150 }"
                                    :move="onMove"
                                    @end="onEnd"
                                >
                                    <transition-group>
                                        <div class="list-group-item w100" v-for="(element, index) in lineOption.yData.field" :key="index">
                                            <MutileSelect
                                                :element="element"
                                                :type="1"
                                                @remove="removeThisY(lineOption.yData, index)"
                                                @change="obj => changeField(lineOption.yData, obj)"
                                            ></MutileSelect>
                                        </div>
                                        <div class="ub ub-ac list-item empty-add" v-if="lineOption.yData.field.length == 0" :key="10000">
                                            <div class="ub ub-f1 ub-ac ub-pc"><i class="iconfont icon-tianjia"></i></div>
                                        </div>
                                    </transition-group>
                                </draggable>
                            </template>
                            <template v-if="!seqLine">
                                <draggable
                                    class="list-group w100"
                                    v-model="lineOption.xData.field"
                                    :group="lineOption.xGroup"
                                    v-bind="{ scroll: true, animation: 150 }"
                                    :move="onMove"
                                    @end="onEnd"
                                >
                                    <transition-group :style="style">
                                        <div class="list-group-item w100" v-for="(element, index) in lineOption.xData.field" :key="index">
                                            <MutileSelect :element="element" :type="2" @remove="removeThis(lineOption.xData.field, index)"></MutileSelect>
                                        </div>
                                        <div class="ub ub-ac list-item empty-add" v-if="lineOption.xData.field.length == 0" :key="10000">
                                            <div class="ub ub-f1 ub-ac ub-pc"><i class="iconfont icon-tianjia"></i></div>
                                        </div>
                                    </transition-group>
                                </draggable>
                            </template>
                        </div>
                        <div class="attr">
                            <p class="attr-header">属性</p>
                            <p class="attr-color-header">颜色：</p>
                            <draggable
                                class="list-group w100"
                                tag="ul"
                                v-model="lineOption.attr.color"
                                :group="lineOption.colorGroup"
                                v-bind="{ scroll: true, animation: 150 }"
                                :move="onMove"
                                @end="onEnd"
                            >
                                <transition-group>
                                    <div class="list-group-item w100" v-for="(element, index) in lineOption.attr.color" :key="index">
                                        <MutileSelect :element="element" :type="2" @remove="removeThis(lineOption.attr.color, index)"></MutileSelect>
                                    </div>
                                    <div class="ub ub-ac list-item empty-add" v-if="lineOption.attr.color.length == 0" :key="10000">
                                        <div class="ub ub-f1 ub-ac ub-pc"><i class="iconfont icon-tianjia"></i></div>
                                    </div>
                                </transition-group>
                            </draggable>
                            <p class="attr-measure-header">细分：</p>
                            <draggable
                                class="list-group w100"
                                tag="ul"
                                v-model="lineOption.attr.subdivision"
                                :group="lineOption.subdivisionGroup"
                                v-bind="{ scroll: true, animation: 150 }"
                                :move="onMove"
                                @end="onEnd"
                            >
                                <transition-group>
                                    <div class="list-group-item w100" v-for="(element, index) in lineOption.attr.subdivision" :key="index">
                                        <MutileSelect :element="element" :type="2" @remove="removeThis(lineOption.attr.subdivision, index)"></MutileSelect>
                                    </div>
                                    <div class="ub ub-ac list-item empty-add" v-if="lineOption.attr.subdivision.length == 0" :key="10000">
                                        <div class="ub ub-f1 ub-ac ub-pc"><i class="iconfont icon-tianjia"></i></div>
                                    </div>
                                </transition-group>
                            </draggable>
                            <template v-if="lineOption.yData.field[0] && lineOption.yData.field[0].code == 'dlz'">
                                <p class="attr-measure-header">度量列表：</p>
                                <draggable
                                    class="list-group w100"
                                    v-model="lineOption.measureList"
                                    :group="lineOption.measureGroup"
                                    v-bind="{ scroll: true, animation: 150 }"
                                    :move="onMove"
                                    id="dllb"
                                    @end="onEnd"
                                >
                                    <transition-group>
                                        <div class="list-group-item w100" v-for="(element, index) in lineOption.measureList" :key="index">
                                            <MutileSelect
                                                @change="obj => changeMeaField(element, obj)"
                                                :element="element"
                                                :type="1"
                                                :subType="1"
                                                @remove="removeThis(lineOption.measureList, index)"
                                            ></MutileSelect>
                                        </div>
                                        <div class="ub ub-ac list-item empty-add" :key="10000">
                                            <div class="ub ub-f1 ub-ac ub-pc"><i class="iconfont icon-tianjia"></i></div>
                                        </div>
                                    </transition-group>
                                </draggable>
                            </template>
                        </div>
                        <el-button class="use" :loading="loading" size="small" type="primary" @click.native="tryUse">应 用</el-button>
                    </div>
                    <div class="chart-right" v-loading.lock="loading" element-loading-background="rgba(0, 0, 0, 0.05)" element-loading-text="拼命加载中......">
                        <LineChart :type="type" :chartData="lineData" :seq="seqLine" :chatLineOption="chatLineOption" :allFieldList="allFieldList"></LineChart>
                    </div>
                </div>
                <div v-show="activeChart == 'area'" class="area-wrap">
                    <div class="chart-left">
                        <p class="left-header">图表配置</p>
                        <div class="X-axis">
                            <!-- <p class="x-header">{{ seqArea ? 'X轴' : 'Y轴' }}</p> -->
                            <p class="x-header">X轴</p>
                            <template v-if="seqArea">
                                <draggable
                                    class="list-group w100"
                                    v-model="areaOption.xData.field"
                                    :group="areaOption.xGroup"
                                    v-bind="{ scroll: true, animation: 150 }"
                                    :move="onMove"
                                    @end="onEnd"
                                >
                                    <transition-group :style="style">
                                        <div class="list-group-item w100" v-for="(element, index) in areaOption.xData.field" :key="index">
                                            <MutileSelect :element="element" :type="2" @remove="removeThis(areaOption.xData.field, index)"></MutileSelect>
                                        </div>
                                        <div class="ub ub-ac list-item empty-add" v-if="areaOption.xData.field.length == 0" :key="10000">
                                            <div class="ub ub-f1 ub-ac ub-pc"><i class="iconfont icon-tianjia"></i></div>
                                        </div>
                                    </transition-group>
                                </draggable>
                            </template>
                            <template v-if="!seqArea">
                                <draggable
                                    class="list-group w100"
                                    v-model="areaOption.yData.field"
                                    :group="areaOption.yGroup"
                                    v-bind="{ scroll: true, animation: 150 }"
                                    :move="onMove"
                                    @end="onEnd"
                                >
                                    <transition-group>
                                        <div class="list-group-item w100" v-for="(element, index) in areaOption.yData.field" :key="index">
                                            <MutileSelect
                                                :element="element"
                                                :type="1"
                                                @remove="removeThisY(areaOption.yData, index)"
                                                @change="obj => changeField(areaOption.yData, obj)"
                                            ></MutileSelect>
                                        </div>
                                        <div class="ub ub-ac list-item empty-add" v-if="areaOption.yData.field.length == 0" :key="10000">
                                            <div class="ub ub-f1 ub-ac ub-pc"><i class="iconfont icon-tianjia"></i></div>
                                        </div>
                                    </transition-group>
                                </draggable>
                            </template>
                        </div>
                        <div class="changeXY">
                            <div class="linexy"></div>
                            <div class="icon-change" @click="seqArea = !seqArea"><i class="iconfont icon-tihuan"></i></div>
                        </div>
                        <div class="Y-axis">
                            <!-- <p class="y-header">{{ seqArea ? 'Y轴' : 'X轴' }}</p> -->
                            <p class="y-header">Y轴</p>
                            <template v-if="seqArea">
                                <draggable
                                    class="list-group w100"
                                    v-model="areaOption.yData.field"
                                    :group="areaOption.yGroup"
                                    v-bind="{ scroll: true, animation: 150 }"
                                    :move="onMove"
                                    @end="onEnd"
                                >
                                    <transition-group>
                                        <div class="list-group-item w100" v-for="(element, index) in areaOption.yData.field" :key="index">
                                            <MutileSelect
                                                :element="element"
                                                :type="1"
                                                @remove="removeThisY(areaOption.yData, index)"
                                                @change="obj => changeField(areaOption.yData, obj)"
                                            ></MutileSelect>
                                        </div>
                                        <div class="ub ub-ac list-item empty-add" v-if="areaOption.yData.field.length == 0" :key="10000">
                                            <div class="ub ub-f1 ub-ac ub-pc"><i class="iconfont icon-tianjia"></i></div>
                                        </div>
                                    </transition-group>
                                </draggable>
                            </template>
                            <template v-if="!seqArea">
                                <draggable
                                    class="list-group w100"
                                    v-model="areaOption.xData.field"
                                    :group="areaOption.xGroup"
                                    v-bind="{ scroll: true, animation: 150 }"
                                    :move="onMove"
                                    @end="onEnd"
                                >
                                    <transition-group :style="style">
                                        <div class="list-group-item w100" v-for="(element, index) in areaOption.xData.field" :key="index">
                                            <MutileSelect :element="element" :type="2" @remove="removeThis(areaOption.xData.field, index)"></MutileSelect>
                                        </div>
                                        <div class="ub ub-ac list-item empty-add" v-if="areaOption.xData.field.length == 0" :key="10000">
                                            <div class="ub ub-f1 ub-ac ub-pc"><i class="iconfont icon-tianjia"></i></div>
                                        </div>
                                    </transition-group>
                                </draggable>
                            </template>
                        </div>
                        <div class="attr">
                            <p class="attr-header">属性</p>
                            <p class="attr-color-header">颜色：</p>
                            <draggable
                                class="list-group w100"
                                tag="ul"
                                v-model="areaOption.attr.color"
                                :group="areaOption.colorGroup"
                                v-bind="{ scroll: true, animation: 150 }"
                                :move="onMove"
                                @end="onEnd"
                            >
                                <transition-group>
                                    <div class="list-group-item w100" v-for="(element, index) in areaOption.attr.color" :key="index">
                                        <MutileSelect :element="element" :type="2" @remove="removeThis(areaOption.attr.color, index)"></MutileSelect>
                                    </div>
                                    <div class="ub ub-ac list-item empty-add" v-if="areaOption.attr.color.length == 0" :key="10000">
                                        <div class="ub ub-f1 ub-ac ub-pc"><i class="iconfont icon-tianjia"></i></div>
                                    </div>
                                </transition-group>
                            </draggable>
                            <p class="attr-measure-header">细分：</p>
                            <draggable
                                class="list-group w100"
                                tag="ul"
                                v-model="areaOption.attr.subdivision"
                                :group="areaOption.subdivisionGroup"
                                v-bind="{ scroll: true, animation: 150 }"
                                :move="onMove"
                                @end="onEnd"
                            >
                                <transition-group>
                                    <div class="list-group-item w100" v-for="(element, index) in areaOption.attr.subdivision" :key="index">
                                        <MutileSelect :element="element" :type="2" @remove="removeThis(areaOption.attr.subdivision, index)"></MutileSelect>
                                    </div>
                                    <div class="ub ub-ac list-item empty-add" v-if="areaOption.attr.subdivision.length == 0" :key="10000">
                                        <div class="ub ub-f1 ub-ac ub-pc"><i class="iconfont icon-tianjia"></i></div>
                                    </div>
                                </transition-group>
                            </draggable>
                            <template v-if="areaOption.yData.field[0] && areaOption.yData.field[0].code == 'dlz'">
                                <p class="attr-measure-header">度量列表：</p>
                                <draggable
                                    class="list-group w100"
                                    v-model="areaOption.measureList"
                                    :group="areaOption.measureGroup"
                                    v-bind="{ scroll: true, animation: 150 }"
                                    :move="onMove"
                                    id="dllb"
                                    @end="onEnd"
                                >
                                    <transition-group>
                                        <div class="list-group-item w100" v-for="(element, index) in areaOption.measureList" :key="index">
                                            <MutileSelect
                                                @change="obj => changeMeaField(element, obj)"
                                                :element="element"
                                                :type="1"
                                                :subType="1"
                                                @remove="removeThis(areaOption.measureList, index)"
                                            ></MutileSelect>
                                        </div>
                                        <div class="ub ub-ac list-item empty-add" :key="10000">
                                            <div class="ub ub-f1 ub-ac ub-pc"><i class="iconfont icon-tianjia"></i></div>
                                        </div>
                                    </transition-group>
                                </draggable>
                            </template>
                        </div>
                        <el-button class="use" :loading="loading" size="small" type="primary" @click.native="tryUse">应 用</el-button>
                    </div>
                    <div class="chart-right" v-loading.lock="loading" element-loading-background="rgba(0, 0, 0, 0.05)" element-loading-text="拼命加载中......">
                        <AreaChart :type="type" :chartData="areaData" :seq="seqArea" :chatAreaOption="chatAreaOption" :allFieldList="allFieldList"></AreaChart>
                    </div>
                </div>
                <div v-show="activeChart == 'target'" class="target-wrap">
                    <div class="chart-left">
                        <p class="left-header">图表配置</p>
                        <div class="attr">
                            <p class="attr-header">指标</p>
                            <draggable
                                class="list-group w100"
                                v-model="targetOption.tarData.field"
                                :group="targetOption.tarGroup"
                                v-bind="{ scroll: true, animation: 150 }"
                                :move="onMove"
                                @end="onEnd"
                            >
                                <transition-group>
                                    <div class="list-group-item w100" v-for="(element, index) in targetOption.tarData.field" :key="index">
                                        <MutileSelect
                                            @change="obj => changeField(targetOption.tarData, obj)"
                                            :element="element"
                                            :subType="1"
                                            :type="1"
                                            @remove="removeThisY(targetOption.tarData, index)"
                                        ></MutileSelect>
                                    </div>
                                    <div class="ub ub-ac list-item empty-add" v-if="targetOption.tarData.field.length == 0" :key="10000">
                                        <div class="ub ub-f1 ub-ac ub-pc"><i class="iconfont icon-tianjia"></i></div>
                                    </div>
                                </transition-group>
                            </draggable>
                            <p class="attr-header">指标对比</p>
                            <p class="contrast">对比依据：</p>
                            <div class="ub contrast-sel">
                                <el-select size="small" v-model="targetOption.contrastData.dbField" clearable placeholder="请选择" style="width: 100%;height: 28px;">
                                    <el-option v-for="(item, index) in targetOption.contrastData.list" :key="index" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                                <i class="iconfont icon-shaixuan">
                                    <CustomDate
                                        :append-to-body="true"
                                        :chart-time-range="targetOption.contrastData.occTime"
                                        @getCustomTime="getCustomTime"
                                        @getDateData="getDateData"
                                        :auto="true"
                                        @useing="customDateUse"
                                        :current-type="1"
                                        :empty="false"
                                        ref="customDate"
                                    ></CustomDate>
                                </i>
                            </div>
                            <div class="ub ub-pj" style="margin-top: 10px;">
                                <el-checkbox v-model="targetOption.contrastData.isHb">环比</el-checkbox>
                                <el-checkbox v-model="targetOption.contrastData.isTb" :disabled="yearMore">同比</el-checkbox>
                            </div>
                            <div class="contrast-sel" style="margin-top: 10px;padding-right: 0;" v-show="targetOption.contrastData.isTb">
                                <el-select size="small" v-model="targetOption.contrastData.conValue" placeholder="请选择" style="width: 100%;height: 28px;">
                                    <el-option
                                        v-for="(item, index) in targetOption.contrastData.conList"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value"
                                        :disabled="item.disabled"
                                    ></el-option>
                                </el-select>
                            </div>
                            <div class="ub contrastTime">
                                <el-checkbox v-model="targetOption.contrastData.contrastTime">对比日期</el-checkbox>
                                <i class="iconfont icon-shaixuan">
                                    <CustomDate
                                        :append-to-body="true"
                                        :chart-time-range="targetOption.contrastData.conDate"
                                        @getCustomTime="getCustomTime1"
                                        @getDateData="getDateData1"
                                        :auto="true"
                                        @useing="customDateUse"
                                        :current-type="1"
                                        :empty="false"
                                        ref="customDate1"
                                    ></CustomDate>
                                </i>
                            </div>
                        </div>
                        <el-button class="use" :loading="loading" size="small" type="primary" @click.native="tryUse">应 用</el-button>
                    </div>
                    <div class="chart-right" v-loading.lock="loading" element-loading-background="rgba(0, 0, 0, 0.05)" element-loading-text="拼命加载中......">
                        <TargetChart :chartData="tarData" :heigRight="heigRight" :chatTargetOption="chatTargetOption" :allFieldList="allFieldList"></TargetChart>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog title="保存为趋势图" :visible.sync="saveVisible" width="650px" custom-class="common-dialog chart-dia">
            <div style="margin: 0 auto;width: 100%;">
                <el-form label-width="80px" label-position="top" :rules="rules" ref="addForm" :model="addForm">
                    <el-form-item label="图表名称：" prop="name">
                        <el-input v-model="addForm.name" placeholder="请输入" style="width: 100%;" size="small" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="描述：" prop="description">
                        <el-input v-model="addForm.description" placeholder="请输入" style="width: 100%;" size="small" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="分组：" prop="des">
                        <treeselect
                            size="mini"
                            class="treeselect"
                            :options="dataTree"
                            :normalizer="myNormalizer"
                            noChildrenText="当前分支无子节点"
                            noOptionsText="无可用选项"
                            noResultsText="无可用选项"
                            placeholder="请选择分组"
                            v-model="addForm.groupId"
                            loadingText="下拉框无匹配项"
                            :clearable="false"
                        />
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="saveVisible = false">取消</el-button>
                <el-button size="small" type="primary" @click="submitAdd('addForm')">确认</el-button>
            </span>
        </el-dialog>
        <el-dialog title="颜色配置" :visible.sync="colorSet" width="550px" custom-class="common-dialog chart-dia">
            <div style="position: relative;margin: 0 auto;width: 100%;">
                <div v-for="(c, index) in colorList" :key="index" class="ub ub-ac" style="margin-bottom: 10px;">
                    <div :style="`background-color: ${c.color};width: 40px;height: 40px;margin-right: 20px;cursor: pointer;position: relative;`" @click.stop="colorPickerShow(c)">
                        <ColorPicker
                            @colorChange="
                                v => {
                                    setColor(v, c)
                                }
                            "
                            :color="transtionColor"
                            style="position: absolute; top: 0; left: 40px;"
                            v-if="c.colorPickerVis"
                        ></ColorPicker>
                    </div>
                    <div>{{ c.name }}</div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <!-- <el-button size="small" @click="colorSet = false">取消</el-button> -->
                <el-button size="small" type="primary" @click="submitColorSet">确认</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import VueClipBoard from 'vue-clipboard2'
import _ from 'loadsh'
import draggable from 'vuedraggable'
import BarChart from '@/pages/data_manage/chart_option/components/BarChart'
import LineChart from '@/pages/data_manage/chart_option/components/LineChart'
import AreaChart from '@/pages/data_manage/chart_option/components/AreaChart'
import TableChart from '@/pages/data_manage/chart_option/components/TableChart'
import PieChart from '@/pages/data_manage/chart_option/components/PieChart'
import TargetChart from '@/pages/data_manage/chart_option/components/TargetChart'
import MutileSelect from '@/pages/data_manage/chart_option/components/MutileSelect'
import Treeselect from '@riophae/vue-treeselect'
import CustomDate from '@/pages/data_manage/new_search/components/custom_date/index.vue'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import ColorPicker from '@/pages/data_manage/chart_option/components/ColorPicker'
import {
    getTableChartSet,
    getBarChartSet,
    getLineChartSet,
    getAreaChartSet,
    getPieChartSet,
    getTarChartSet,
    saveToChart,
    findSearchTypeCahrt,
    getEnumInfo
} from '@/server/data_manage/new_search.js'
import {
    getTablealarmChartSet,
    getBaralarmChartSet,
    getLinealarmChartSet,
    getAreaalarmChartSet,
    getPiealarmChartSet,
    getTaralarmChartSet,
    saveToalarmChart,
    findSearchTypealarmChart,
    getEnumInfoalarm
} from '@/server/alarm/alarm.js'
import {
    getTableassetsChartSet,
    getBarassetsChartSet,
    getLineassetsChartSet,
    getAreaassetsChartSet,
    getPieassetsChartSet,
    getTarassetsChartSet,
    saveToassetsChart,
    findSearchTypeassetsChart,
    getEnumInfoassets
} from '@/server/assets/api.js'
import {
    getTableleaksChartSet,
    getBarleaksChartSet,
    getLineleaksChartSet,
    getArealeaksChartSet,
    getPieleaksChartSet,
    getTarleaksChartSet,
    saveToleaksChart,
    findSearchTypeleaksChart,
    getEnumInfoleaks
} from '@/server/data_manage/leak.js'
export default {
    name: 'TableContent',
    components: {
        // JsonViewer,
        draggable,
        BarChart,
        LineChart,
        AreaChart,
        TableChart,
        PieChart,
        TargetChart,
        MutileSelect,
        Treeselect,
        CustomDate,
        ColorPicker
    },
    props: {
        sortFieldObj: {
            default() {
                return {}
            }
        },
        type: {
            type: Number,
            default: 3
        },
        tab: {
            type: String,
            default: 'classify'
        },
        searchType: {
            type: String,
            default: 'normal'
        },
        isOpen: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            dataTree: [],
            myNormalizer(node) {
                if (node.child && !node.child.length) {
                    delete node.child
                }
                return {
                    id: node.id,
                    label: node.name,
                    children: node.child
                }
            },
            tabObj: {
                bar: 1,
                table: 2,
                pie: 3,
                line: 4,
                area: 5,
                target: 6
            },
            tabs: [
                {
                    label: '表格',
                    value: 'table',
                    icon: 'icon-biaoge'
                },
                {
                    label: '柱状图',
                    value: 'bar',
                    icon: 'icon-zhuzhuangtu'
                },
                {
                    label: '饼图',
                    value: 'pie',
                    icon: 'icon-bingtu'
                },
                {
                    label: '折线图',
                    value: 'line',
                    icon: 'icon-zhexiantu'
                },
                {
                    label: '面积图',
                    value: 'area',
                    icon: 'icon-duidietu'
                },
                {
                    label: '指标图',
                    value: 'target',
                    icon: 'icon-zhibiao'
                }
            ],
            loading: false,
            searchName: '',
            allField: null,
            allFieldList: [],
            otherField: [],
            numField: [],
            activeChart: 'bar', // table bar pie line area target
            dimensionGroup: {
                name: 'originGroup',
                pull: 'clone',
                put: false
            },
            measureGroup: {
                name: 'originGroup',
                pull: 'clone',
                put: false
            },
            seqBar: true,
            seqLine: true,
            seqArea: true,
            style: 'min-height:28px;display: block;',
            tableOption: {
                listGroup: {
                    name: 'originGroup',
                    pull: false,
                    put: true
                },
                data: []
            },
            pieOption: {
                typeList: [
                    {
                        id: 1,
                        name: '饼状图'
                    },
                    {
                        id: 2,
                        name: '环状图'
                    }
                ],
                measureGroup: {
                    name: 'originGroup',
                    pull: false,
                    put: true
                },
                colorGroup: {
                    name: 'originGroup',
                    pull: false,
                    put: () => {
                        return this.pieOption.attr.color.length == 0
                    }
                },
                angleGroup: {
                    name: 'originGroup',
                    pull: false,
                    put: () => {
                        return this.pieOption.attr.angle.field.length == 0
                    }
                },
                subdivisionGroup: {
                    name: 'originGroup',
                    pull: false,
                    put: () => {
                        return this.pieOption.attr.subdivision.length == 0
                    }
                },
                attr: {
                    type: 1,
                    color: [],
                    colorSet: [],
                    subdivision: [],
                    angle: {
                        field: [],
                        aggType: 1,
                        sortType: '',
                        count: 99
                    }
                },
                measureList: []
            },
            lineOption: {
                measureGroup: {
                    name: 'originGroup',
                    pull: false,
                    put: true
                },
                xGroup: {
                    name: 'originGroup',
                    pull: false,
                    put: () => {
                        return this.lineOption.xData.field.length == 0
                    }
                },
                yGroup: {
                    name: 'originGroup',
                    pull: false,
                    put: () => {
                        return this.lineOption.yData.field.length == 0
                    }
                },
                subdivisionGroup: {
                    name: 'originGroup',
                    pull: false,
                    put: () => {
                        return this.lineOption.attr.subdivision.length == 0
                    }
                },
                colorGroup: {
                    name: 'originGroup',
                    pull: false,
                    put: () => {
                        return this.lineOption.attr.color.length == 0
                    }
                },
                xData: {
                    field: []
                },
                yData: {
                    field: [],
                    aggType: 1,
                    sortType: '',
                    count: 99
                },
                attr: {
                    type: 1,
                    color: [],
                    subdivision: []
                },
                measureList: []
            },
            barOption: {
                measureGroup: {
                    name: 'originGroup',
                    pull: false,
                    put: true
                },
                xGroup: {
                    name: 'originGroup',
                    pull: false,
                    put: () => {
                        return this.barOption.xData.field.length == 0
                    }
                },
                yGroup: {
                    name: 'originGroup',
                    pull: false,
                    put: () => {
                        return this.barOption.yData.field.length == 0
                    }
                },
                subdivisionGroup: {
                    name: 'originGroup',
                    pull: false,
                    put: () => {
                        return this.barOption.attr.subdivision.length == 0
                    }
                },
                colorGroup: {
                    name: 'originGroup',
                    pull: false,
                    put: () => {
                        return this.barOption.attr.color.length == 0
                    }
                },
                typeList: [
                    {
                        id: 1,
                        name: '并列柱状图'
                    },
                    {
                        id: 2,
                        name: '堆叠柱状图'
                    }
                ],
                xData: {
                    field: []
                },
                yData: {
                    field: [],
                    aggType: 1,
                    sortType: '',
                    count: 99
                },
                attr: {
                    type: 1,
                    color: [],
                    colorSet: [],
                    subdivision: []
                },
                measureList: []
            },
            areaOption: {
                measureGroup: {
                    name: 'originGroup',
                    pull: false,
                    put: true
                },
                xGroup: {
                    name: 'originGroup',
                    pull: false,
                    put: () => {
                        return this.areaOption.xData.field.length == 0
                    }
                },
                yGroup: {
                    name: 'originGroup',
                    pull: false,
                    put: () => {
                        return this.areaOption.yData.field.length == 0
                    }
                },
                subdivisionGroup: {
                    name: 'originGroup',
                    pull: false,
                    put: () => {
                        return this.areaOption.attr.subdivision.length == 0
                    }
                },
                colorGroup: {
                    name: 'originGroup',
                    pull: false,
                    put: () => {
                        return this.areaOption.attr.color.length == 0
                    }
                },
                xData: {
                    field: []
                },
                yData: {
                    field: [],
                    aggType: 1,
                    sortType: '',
                    count: 99
                },
                attr: {
                    type: 1,
                    color: [],
                    subdivision: []
                },
                measureList: []
            },
            targetOption: {
                tarGroup: {
                    name: 'originGroup',
                    pull: false,
                    put: () => {
                        return this.targetOption.tarData.field.length == 0
                    }
                },
                tarData: {
                    aggType: 1,
                    field: []
                },
                contrastData: {
                    list: [
                        {
                            label: '发生时间',
                            value: 'createTime'
                        }
                    ],
                    dbField: 'createTime',
                    occTime: [],
                    isHb: false,
                    isTb: false,
                    conList: [
                        {
                            label: '月同比',
                            value: 'month',
                            disabled: false
                        },
                        {
                            label: '年同比',
                            value: 'year',
                            disabled: false
                        }
                    ],
                    conValue: 'month',
                    contrastTime: false,
                    conDate: []
                }
            },
            chatBarOption: null,
            chatLineOption: null,
            chatAreaOption: null,
            chatTableOption: null,
            chatPieOption: null,
            chatTargetOption: null,
            barData: null,
            lineData: null,
            areaData: null,
            pieData: null,
            tableData: null,
            tarData: null,
            tabPage: {
                page: 1,
                pageSize: 10,
                total: 0
            },
            saveVisible: false,
            addForm: {
                name: '',
                description: '',
                groupId: null
            },
            rules: {
                name: [
                    {
                        required: true,
                        message: '请输入图表名称',
                        trigger: 'blur'
                    }
                ],
                groupId: [
                    {
                        required: true,
                        message: '请选择分组',
                        trigger: 'blur'
                    }
                ]
            },
            customTime: [],
            dateData: '',
            dateMode: '',
            useDate: {},
            useIndex: '',
            customTime1: [],
            dateData1: '',
            dateMode1: '',
            useDate1: {},
            useIndex1: '',
            getTableChartSet: null,
            getBarChartSet: null,
            getLineChartSet: null,
            getAreaChartSet: null,
            getPieChartSet: null,
            getTarChartSet: null,
            saveToChart: null,
            findSearchTypeCahrt: null,
            getEnumInfo: null,
            enumInfoData: null,
            aggTypeList: {
                1: '求和',
                2: '平均数',
                3: '中位数',
                4: '计数',
                5: '去重计数',
                6: '最大值',
                7: '最小值'
            },
            colorSet: false,
            colorList: [],
            transtionColor: ''
            // specialTimeOption: ['alarmYear', 'alarmTime', 'alarmMonth', '']
        }
    },
    computed: {
        heigRight() {
            let h = ''
            if (this.type == 3) {
                // 日志
                if (this.tab == 'classify') {
                    if (this.searchType == 'normal') {
                        if (this.isOpen) {
                            h = 'calc(100vh - 440px)'
                        } else {
                            h = 'calc(100vh - 320px)'
                        }
                    } else if (this.searchType == 'sql') {
                        h = 'calc(100vh - 360px)'
                    }
                } else if (this.tab == 'general') {
                    h = 'calc(100vh - 350px)'
                }
            } else if (this.type == 5) {
                // 事件
                if (this.isOpen) {
                    h = 'calc(100vh - 430px)'
                } else {
                    h = 'calc(100vh - 260px)'
                }
            } else if (this.type == 6) {
                // 资产
                if (this.isOpen) {
                    h = 'calc(100vh - 296px)'
                } else {
                    h = 'calc(100vh - 246px)'
                }
            } else if (this.type == 7) {
                // 漏洞
                if (this.isOpen) {
                    h = 'calc(100vh - 312px)'
                } else {
                    h = 'calc(100vh - 260px)'
                }
            } else {
                h = 'calc(100vh - 320px)'
            }
            return h
        },
        heigLeft() {
            let h = ''
            if (this.type == 3) {
                if (this.tab == 'classify') {
                    if (this.searchType == 'normal') {
                        if (this.isOpen) {
                            h = 'calc(100vh - 470px)'
                        } else {
                            h = 'calc(100vh - 350px)'
                        }
                    } else if (this.searchType == 'sql') {
                        h = 'calc(100vh - 390px)'
                    }
                } else if (this.tab == 'general') {
                    h = 'calc(100vh - 380px)'
                }
            } else if (this.type == 5) {
                console.log(this.isOpen)
                if (this.isOpen) {
                    h = 'calc(100vh - 460px)'
                } else {
                    h = 'calc(100vh - 320px)'
                }
            } else if (this.type == 6) {
                console.log(this.isOpen)
                if (this.isOpen) {
                    h = 'calc(100vh - 334px)'
                } else {
                    h = 'calc(100vh - 284px)'
                }
            } else if (this.type == 7) {
                if (this.isOpen) {
                    h = 'calc(100vh - 350px)'
                } else {
                    h = 'calc(100vh - 300px)'
                }
            } else {
                h = 'calc(100vh - 350px)'
            }
            return h
        },
        numFieldCalc() {
            return this.numField.filter(item => item.code != 'dlz')
        },
        yearMore() {
            return this.getDiffDate(this.customTime[0], this.customTime[1], 'years') > 1
        }
    },
    watch: {
        sortFieldObj: {
            handler(newVal) {
                console.log(newVal)
                if (!newVal) return
                this.allField = _.cloneDeep(newVal)
                this.allField.numField.forEach(item => {
                    item.isNum = true
                })
                this.allFieldList = this.allFieldList.concat(this.allField.otherField, this.allField.numField)
                this.otherField = _.cloneDeep(this.allField.otherField)
                this.numField = _.cloneDeep(this.allField.numField)
                console.log(this.allField)
            },
            immediate: true
        },
        searchName: {
            handler(newVal) {
                this.otherField = this.allField.otherField.filter(item => item.name.includes(newVal))
                this.numField = this.allField.numField.filter(item => item.name.includes(newVal))
            }
        },
        customTime: {
            handler(newVal) {
                console.log(this.getDiffDate(this.customTime[0], this.customTime[1], 'month'))
                let monthDis = this.getDiffDate(this.customTime[0], this.customTime[1], 'month') > 1
                let yearDis = this.getDiffDate(this.customTime[0], this.customTime[1], 'years') > 1
                if ((this.targetOption.contrastData.conValue == 'month' && monthDis) || (this.targetOption.contrastData.conValue == 'year' && yearDis)) {
                    this.targetOption.contrastData.conValue = ''
                }
                if (yearDis) {
                    this.targetOption.contrastData.isTb = false
                }
                this.targetOption.contrastData.conList.forEach(item => {
                    if (item.value == 'month') {
                        item.disabled = monthDis
                    }
                    if (item.value == 'year') {
                        item.disabled = yearDis
                    }
                })
                console.log(this.targetOption.contrastData.conList)
            },
            immediate: true
        }
    },
    mounted() {
        if (this.type == 3 || this.type == 4) {
            this.getTableChartSet = getTableChartSet
            this.getBarChartSet = getBarChartSet
            this.getLineChartSet = getLineChartSet
            this.getAreaChartSet = getAreaChartSet
            this.getPieChartSet = getPieChartSet
            this.getTarChartSet = getTarChartSet
            this.saveToChart = saveToChart
            this.findSearchTypeCahrt = findSearchTypeCahrt
            this.getEnumInfo = getEnumInfo
        } else if (this.type == 5) {
            console.log(JSON.stringify(getTableChartSet))
            this.getTableChartSet = getTablealarmChartSet
            this.getBarChartSet = getBaralarmChartSet
            this.getLineChartSet = getLinealarmChartSet
            this.getAreaChartSet = getAreaalarmChartSet
            this.getPieChartSet = getPiealarmChartSet
            this.getTarChartSet = getTaralarmChartSet
            this.saveToChart = saveToalarmChart
            this.findSearchTypeCahrt = findSearchTypealarmChart
            this.getEnumInfo = getEnumInfoalarm
        } else if (this.type == 6) {
            this.getTableChartSet = getTableassetsChartSet
            this.getBarChartSet = getBarassetsChartSet
            this.getLineChartSet = getLineassetsChartSet
            this.getAreaChartSet = getAreaassetsChartSet
            this.getPieChartSet = getPieassetsChartSet
            this.getTarChartSet = getTarassetsChartSet
            this.saveToChart = saveToassetsChart
            this.findSearchTypeCahrt = findSearchTypeassetsChart
            this.getEnumInfo = getEnumInfoassets
        } else if (this.type == 7) {
            this.getTableChartSet = getTableleaksChartSet
            this.getBarChartSet = getBarleaksChartSet
            this.getLineChartSet = getLineleaksChartSet
            this.getAreaChartSet = getArealeaksChartSet
            this.getPieChartSet = getPieleaksChartSet
            this.getTarChartSet = getTarleaksChartSet
            this.saveToChart = saveToleaksChart
            this.findSearchTypeCahrt = findSearchTypeleaksChart
            this.getEnumInfo = getEnumInfoleaks
        }
        this.dataTreeData()
        this.enumInfo()
        this.initColor()
        this.windowAddClick()
    },
    beforeDestroy() {
        this.windowRemoveClick()
    },
    methods: {
        getNameByCode(code) {
            return this.allFieldList.filter(i => i.code == code)[0].name
        },
        setColor(color, data) {
            console.log(data, color)
            data.color = color
        },
        windowAddClick() {
            let _this = this
            window.addEventListener('click', this.colorPickerHide)
        },
        windowRemoveClick() {
            window.removeEventListener('click', this.colorPickerHide)
        },
        colorPickerShow(c) {
            this.colorList.forEach(item => (item.colorPickerVis = false))
            this.transtionColor = c.color
            c.colorPickerVis = true
            console.log(this.transtionColor)
        },
        colorPickerHide() {
            this.colorList.forEach(item => (item.colorPickerVis = false))
        },
        initColor() {
            if (this.type == 3) {
                // 日志
                this.colorList = [
                    {
                        name: '告警',
                        color: '',
                        colorPickerVis: false
                    },
                    {
                        name: '警示',
                        color: '',
                        colorPickerVis: false
                    },
                    {
                        name: '通知',
                        color: '',
                        colorPickerVis: false
                    },
                    {
                        name: '信息',
                        color: '',
                        colorPickerVis: false
                    }
                ]
            } else if (this.type == 5) {
                // 事件
                this.colorList = [
                    {
                        name: '低',
                        color: '',
                        colorPickerVis: false
                    },
                    {
                        name: '中低',
                        color: '',
                        colorPickerVis: false
                    },
                    {
                        name: '中',
                        color: '',
                        colorPickerVis: false
                    },
                    {
                        name: '中高',
                        color: '',
                        colorPickerVis: false
                    },
                    {
                        name: '高',
                        color: '',
                        colorPickerVis: false
                    }
                ]
            }
            this.colorList.forEach(item => {
                item.color = this.$color16()
            })
            // this.transition.attr.colorSet = this.colorList
            // this.$color16()
        },
        showColorSet(data) {
            this.transition = data
            this.colorSet = true
        },
        submitColorSet() {
            console.log(this.colorList)
            this.transition.attr.colorSet = this.colorList
            this.colorSet = false
        },
        getDiffDate(a, b, type) {
            let startTime = this.$moment(a)
            let endTime = this.$moment(b)
            return endTime.diff(startTime, type, true)
        },
        getCustomTime(val, isChartTime) {
            this.customTime = val
            console.log('时间', val)
        },
        getCustomTime1(val, isChartTime) {
            this.customTime1 = val
            console.log('时间', val)
        },
        enumInfo() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            this.getEnumInfo(data)
                .then(res => {
                    this.enumInfoData = res
                    console.log(res)
                })
                .catch(error => {
                    console.log('error' + error)
                })
        },
        dataTreeData() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            this.findSearchTypeCahrt(data)
                .then(res => {
                    this.dataTree = res
                })
                .catch(error => {
                    console.log('error' + error)
                })
        },
        getDateData(date, mode, useDate, useIndex) {
            this.dateData = date
            this.dateMode = mode
            this.useDate = useDate
            this.useIndex = useIndex
        },
        getDateData1(date, mode, useDate, useIndex) {
            this.dateData1 = date
            this.dateMode1 = mode
            this.useDate1 = useDate
            this.useIndex1 = useIndex
        },
        customDateUse() {},
        saveChart() {
            this.addForm = {
                name: '',
                description: '',
                groupId: null
            }
            this.saveVisible = true
            this.$nextTick(() => {
                this.$refs.addForm.resetFields()
            })
        },
        submitAdd(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    let param = this.getSaveParams()
                    let data = {
                        queryData: {},
                        paramsData: {
                            name: this.addForm.name,
                            groupId: this.addForm.groupId,
                            description: this.addForm.description,
                            originType: this.type, // 日志图表
                            chartType: this.tabObj[this.activeChart],
                            param
                        }
                    }
                    this.saveToChart(data)
                        .then(res => {
                            this.saveVisible = false
                            this.$message({
                                message: '操作成功！',
                                type: 'success'
                            })
                        })
                        .catch(error => {
                            console.log('error', error)
                        })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        getSaveParams() {
            switch (this.activeChart) {
                case 'bar':
                    return this.submitBar('params')
                case 'line':
                    return this.submitLine('params')
                case 'area':
                    return this.submitArea('params')
                case 'table':
                    return this.submitTable('params')
                case 'pie':
                    return this.submitPie('params')
                case 'target':
                    return this.submitTarget('params')
            }
        },
        changeField(data, obj) {
            data.aggType = obj.juhe
            data.sortType = obj.sort
            data.count = obj.num
        },
        changeFieldTable(data, obj) {
            data.aggType = obj.juhe
            data.sortType = obj.sort
            data.count = obj.num
            // 列表数量以最后改变的为准
            this.tableOption.data.forEach(item => {
                if (item.isNum) {
                    item.num = obj.num
                }
            })
        },
        changeMeaField(data, obj) {
            // 度量列表修改聚合方式
            data.aggType = obj.juhe
        },
        removeThis(list, index, flag) {
            if (flag == 'y') {
                // 移除y轴时，需判断是否为度量值，如果是度量值，则需清空度量列表
                if (list[0].code == 'dlz') {
                    this.barOption.measureList = []
                }
            }
            if (flag == 'angle') {
                // 移除角度时，需判断是否为度量值，如果是度量值，则需清空度量列表
                if (list[0].code == 'dlz') {
                    this.pieOption.measureList = []
                }
            }
            let data = list[index]
            console.log(data)
            let code = data.code
            let other = this.allField.otherField.filter(item => item.code == code)[0]
            if (other) {
                if ('aggType' in other) delete other.aggType
                if ('count' in other) delete other.count
                if ('sortType' in other) delete other.sortType
            }
            let num = this.allField.numField.filter(item => item.code == code)[0]
            if (num) {
                if ('aggType' in num) delete num.aggType
                if ('count' in num) delete num.count
                if ('sortType' in num) delete num.sortType
            }
            list.splice(index, 1)
            console.log(this.targetOption.tarData.field)
        },
        removeThisY(data, index) {
            data.aggType = 1
            data.sortType = ''
            data.count = 99
            this.removeThis(data.field, index, 'y')
        },
        removeThisAngle(data, index) {
            data.aggType = 1
            data.sortType = ''
            data.count = 99
            this.removeThis(data.field, index, 'angle')
        },
        onEnd(e) {
            console.log(e)
            console.log(this.barOption.xData.field)
            console.log('拖拽结束')
            const tmpArr = []
            if (this.activeChart == 'bar') {
                this.barOption.measureList.forEach(item => {
                    if (!tmpArr.some(tp => tp.code == item.code)) {
                        tmpArr.push(item)
                    }
                })
                this.barOption.measureList = tmpArr
            }
            if (this.activeChart == 'pie') {
                this.pieOption.measureList.forEach(item => {
                    if (!tmpArr.some(tp => tp.code == item.code)) {
                        tmpArr.push(item)
                    }
                })
                this.pieOption.measureList = tmpArr
            }
            if (this.activeChart == 'line') {
                this.lineOption.measureList.forEach(item => {
                    if (!tmpArr.some(tp => tp.code == item.code)) {
                        tmpArr.push(item)
                    }
                })
                this.lineOption.measureList = tmpArr
            }
            if (this.activeChart == 'area') {
                this.areaOption.measureList.forEach(item => {
                    if (!tmpArr.some(tp => tp.code == item.code)) {
                        tmpArr.push(item)
                    }
                })
                this.areaOption.measureList = tmpArr
            }
            if (this.activeChart == 'table') {
                this.tableOption.data.forEach(item => {
                    if (!tmpArr.some(tp => tp.code == item.code)) {
                        tmpArr.push(item)
                    }
                })
                this.tableOption.data = tmpArr
            }
        },
        onMove(e) {},
        onStart(e) {
            console.log(e)
        },
        getTesCalc(res) {
            let resTmp = []
            res.forEach(item => {
                let tmpItem = {}
                for (let i in item) {
                    let key = this.$toLine(i)
                    console.log(i, this.enumInfoData.fields)
                    console.log(this.numField)
                    if (this.numField.some(num => key.includes(num.code))) {
                        let ikey = ''
                        if (key.substr(-4) == '_num') {
                            ikey = key.substr(0, key.length - 4)
                        } else {
                            ikey = key
                        }
                        console.log(ikey)
                        if (this.enumInfoData.fields.includes(ikey)) {
                            // 需转义值
                            let itemi = item[i]
                            let tmpValue = this.enumInfoData[ikey][item[i]]
                            if (itemi !== '' && itemi !== 'null' && itemi !== null) {
                                // 存在属性的值
                                if (tmpValue) {
                                    // 存在属性值对应的转义的中文
                                    tmpItem[ikey] = tmpValue
                                } else {
                                    // 不存在属性值对应的转义的中文，则赋值为本身的属性值
                                    tmpItem[ikey] = item[i]
                                }
                            } else {
                                // 属性的值为空，则给此属性值赋值为字符串空格
                                tmpItem[ikey] = ' '
                            }
                        } else {
                            // 无须转义
                            tmpItem[ikey] = item[i]
                        }
                    } else {
                        if (this.enumInfoData.fields.includes(key)) {
                            // 需转义值
                            console.log(item[i])
                            let itemi = item[i]
                            let tmpValue = this.enumInfoData[key][item[i]]
                            if (itemi !== '' && itemi !== 'null' && itemi !== null) {
                                // 存在属性的值
                                if (tmpValue) {
                                    // 存在属性值对应的转义的中文
                                    tmpItem[key] = tmpValue
                                } else {
                                    // 不存在属性值对应的转义的中文，则赋值为本身的属性值
                                    tmpItem[key] = item[i]
                                }
                            } else {
                                // 属性的值为空，则给此属性值赋值为字符串空格
                                tmpItem[key] = ' '
                            }
                        } else {
                            // 无须转义
                            let itemi = item[i]
                            if (itemi !== '' && itemi !== 'null' && itemi !== null) {
                                // 存在属性的值
                                tmpItem[key] = itemi
                            } else {
                                // 属性的值为空，则给此属性值赋值为字符串空格
                                tmpItem[key] = ' '
                            }
                        }
                    }
                }
                resTmp.push(tmpItem)
            })
            console.log(resTmp)
            return resTmp
        },
        getDataFromField(res) {
            res.forEach(item => {
                console.log(this.enumInfoData)
                for (let i in item) {
                    if (this.numField.some(num => i.includes(num.code))) {
                        // 是个度量字段
                        let inum = ''
                        if (i.substr(0, i.length - 3) == 'Num') {
                            inum = i.substr(0, i.length - 3)
                        } else {
                            inum = i
                        }
                        console.log(inum)
                        if (this.enumInfoData.fields.includes(inum)) {
                            // 需转义值
                            // item[i] = this.enumInfoData[inum][item[i]]
                            // 需转义值
                            let itemi = item[i]
                            let tmpValue = this.enumInfoData[inum][item[i]]
                            console.log(this.enumInfoData, inum, item[i])
                            console.log(tmpValue)
                            if (itemi !== '' && itemi !== 'null' && itemi !== null) {
                                // 存在属性的值
                                if (tmpValue) {
                                    // 存在属性值对应的转义的中文
                                    item[i] = tmpValue
                                } else {
                                    // 不存在属性值对应的转义的中文，则赋值为本身的属性值
                                    item[i] = itemi
                                }
                            } else {
                                // 属性的值为空，则给此属性值赋值为字符串空格
                                item[i] = ' '
                            }
                        }
                    } else {
                        if (this.enumInfoData.fields.includes(i)) {
                            // 需转义值
                            // item[i] = this.enumInfoData[i][item[i]]
                            let itemi = item[i]
                            let tmpValue = this.enumInfoData[i][item[i]]
                            if (itemi !== '' && itemi !== 'null' && itemi !== null) {
                                // 存在属性的值
                                if (tmpValue) {
                                    // 存在属性值对应的转义的中文
                                    item[i] = tmpValue
                                } else {
                                    // 不存在属性值对应的转义的中文，则赋值为本身的属性值
                                    item[i] = itemi
                                }
                            } else {
                                // 属性的值为空，则给此属性值赋值为字符串空格
                                item[i] = ' '
                            }
                        }
                    }
                }
            })
            console.log(res)
            return res
        },
        submitTarget(flag) {
            const chatTargetOption = _.cloneDeep(this.targetOption)
            if (flag != 'params') {
                this.chatTargetOption = chatTargetOption
                this.chatTargetOption.nameInfo = {
                    name: this.chatTargetOption.tarData.field[0] ? this.chatTargetOption.tarData.field[0].name : '',
                    aggTypeName: this.chatTargetOption.tarData.field[0] ? this.aggTypeList[this.chatTargetOption.tarData.aggType] : ''
                }
                if (this.chatTargetOption.contrastData.contrastTime) {
                    this.chatTargetOption.contrastData.db = `${this.customTime1[0]}~${this.customTime1[1]}`
                }
            }
            let hb = ''
            let tb = ''
            let db = ''
            if (this.targetOption.contrastData.isHb) {
                let a = this.customTime[0]
                let b = this.customTime[1]
                let second = this.getDiffDate(a, b, 'seconds')
                let c = this.$moment(a)
                    .subtract(second, 'seconds')
                    .format('YYYY-MM-DD HH:mm:ss')
                hb = `${c}~${a}`
            }
            if (this.targetOption.contrastData.isTb) {
                let a = this.customTime[0]
                let b = this.customTime[1]
                if (this.targetOption.contrastData.conValue == 'month') {
                    let c = this.$moment(a)
                        .subtract(1, 'months')
                        .format('YYYY-MM-DD HH:mm:ss')
                    let d = this.$moment(b)
                        .subtract(1, 'months')
                        .format('YYYY-MM-DD HH:mm:ss')
                    tb = `${c}~${d}`
                }
                if (this.targetOption.contrastData.conValue == 'year') {
                    let c = this.$moment(a)
                        .subtract(1, 'years')
                        .format('YYYY-MM-DD HH:mm:ss')
                    let d = this.$moment(b)
                        .subtract(1, 'years')
                        .format('YYYY-MM-DD HH:mm:ss')
                    tb = `${c}~${d}`
                }
            }
            if (this.targetOption.contrastData.contrastTime) {
                db = `${this.customTime1[0]}~${this.customTime1[1]}`
            }
            console.log(this.targetOption)
            const chartTargetParams = {
                tar: {
                    field: this.targetOption.tarData.field.map(t => t.code)[0],
                    aggType: this.targetOption.tarData.aggType
                },
                nameInfo: {
                    name: this.chatTargetOption.tarData.field[0] ? this.chatTargetOption.tarData.field[0].name : '',
                    aggTypeName: this.chatTargetOption.tarData.field[0] ? this.aggTypeList[this.chatTargetOption.tarData.aggType] : ''
                },
                conValue: this.targetOption.contrastData.conValue,
                contrastTime: this.targetOption.contrastData.contrastTime,
                dbField: this.targetOption.contrastData.dbField,
                date: this.customTime[0] ? `${this.customTime[0]}~${this.customTime[1]}` : '',
                hb,
                tb,
                db
            }
            if (this.type == 6 || this.type == 7) {
                chartTargetParams.dbField = this.$toLine(chartTargetParams.dbField)
            }
            if (this.type == 3 || this.type == 4) {
                if (chartTargetParams.dbField) {
                    chartTargetParams.dbField = 'alarmTime'
                } else {
                    chartTargetParams.dbField = ''
                }
            }
            const data = this.$parent.getSearchParams()
            const fields = this.getAllFieldsTarget(this.targetOption)
            data.paramsData.chartInfo = chartTargetParams
            data.paramsData.fields = fields
            data.queryData = {}
            if (this.type == 4) {
                // 针对告警查询
                data.paramsData.menuType = 2
            }
            if (flag == 'params') return data.paramsData
            this.getTarChartSet(data)
                .then(res => {
                    this.loading = false
                    this.tarData = res
                    console.log(res)
                })
                .catch(err => {
                    console.log(err)
                    this.loading = false
                })
        },
        submitBar(flag) {
            // 展示图的options
            const chartBarOption = _.cloneDeep(this.barOption)
            chartBarOption.xData.field = chartBarOption.xData.field.map(x => x.code)
            chartBarOption.yData.field = chartBarOption.yData.field.map(y => y.code)
            chartBarOption.attr.subdivision = chartBarOption.attr.subdivision.map(s => s.code)
            chartBarOption.attr.color = chartBarOption.attr.color.map(s => s.code)
            chartBarOption.measureList = chartBarOption.measureList.map(mea => mea.code)
            if (flag != 'params') {
                this.chatBarOption = chartBarOption
            }
            console.log(this.barOption)
            // 接口参数
            const chartBarParams = _.cloneDeep(chartBarOption)
            console.log(this.barOption.measureList)
            chartBarParams.measureList = this.barOption.measureList.map(item => {
                return {
                    field: item.code,
                    aggType: item.aggType || 1
                }
            })
            console.log(chartBarParams)
            chartBarParams.seq = this.seqBar
            const data = this.$parent.getSearchParams()
            const fields = this.getAllFields(this.barOption)
            data.paramsData.chartInfo = chartBarParams
            data.paramsData.fields = fields
            if (this.type == 4) {
                // 针对告警查询
                data.paramsData.menuType = 2
            }
            if (flag == 'params') return data.paramsData
            this.getBarChartSet(data)
                .then(res => {
                    this.loading = false
                    if (this.type == 6 || this.type == 7) {
                        // 资产和漏洞需要转化为下划线
                        this.barData = this.getTesCalc(res)
                    } else {
                        this.barData = this.getDataFromField(res)
                    }
                    console.log(this.barData)
                })
                .catch(err => {
                    console.log(err)
                    this.loading = false
                })
        },
        submitLine(flag) {
            // 展示图的options
            const chartLineOption = _.cloneDeep(this.lineOption)
            chartLineOption.xData.field = chartLineOption.xData.field.map(x => x.code)
            chartLineOption.yData.field = chartLineOption.yData.field.map(y => y.code)
            chartLineOption.attr.subdivision = chartLineOption.attr.subdivision.map(s => s.code)
            chartLineOption.attr.color = chartLineOption.attr.color.map(s => s.code)
            chartLineOption.measureList = chartLineOption.measureList.map(mea => mea.code)
            if (flag != 'params') {
                this.chatLineOption = chartLineOption
            }
            // 接口参数
            const chartLineParams = _.cloneDeep(chartLineOption)
            chartLineParams.measureList = this.lineOption.measureList.map(item => {
                return {
                    field: item.code,
                    aggType: item.aggType || 1
                }
            })
            console.log(chartLineParams)
            chartLineParams.seq = this.seqLine
            const data = this.$parent.getSearchParams()
            const fields = this.getAllFields(this.lineOption)
            data.paramsData.chartInfo = chartLineParams
            data.paramsData.fields = fields
            if (this.type == 4) {
                // 针对告警查询
                data.paramsData.menuType = 2
            }
            if (flag == 'params') return data.paramsData
            this.getLineChartSet(data)
                .then(res => {
                    if (this.type == 6 || this.type == 7) {
                        // 资产和漏洞需要转化为下划线
                        this.lineData = this.getTesCalc(res)
                    } else {
                        this.lineData = this.getDataFromField(res)
                    }
                    console.log(this.lineData)
                    this.loading = false
                })
                .catch(err => {
                    console.log(err)
                    this.loading = false
                })
        },
        submitArea(flag) {
            // 展示图的options
            const chartAreaOption = _.cloneDeep(this.areaOption)
            chartAreaOption.xData.field = chartAreaOption.xData.field.map(x => x.code)
            chartAreaOption.yData.field = chartAreaOption.yData.field.map(y => y.code)
            chartAreaOption.attr.subdivision = chartAreaOption.attr.subdivision.map(s => s.code)
            chartAreaOption.attr.color = chartAreaOption.attr.color.map(s => s.code)
            chartAreaOption.measureList = chartAreaOption.measureList.map(mea => mea.code)
            if (flag != 'params') {
                this.chatAreaOption = chartAreaOption
            }
            // 接口参数
            const chartAreaParams = _.cloneDeep(chartAreaOption)
            chartAreaParams.measureList = this.areaOption.measureList.map(item => {
                return {
                    field: item.code,
                    aggType: item.aggType || 1
                }
            })
            console.log(chartAreaParams)
            chartAreaParams.seq = this.seqArea
            const data = this.$parent.getSearchParams()
            const fields = this.getAllFields(this.areaOption)
            data.paramsData.chartInfo = chartAreaParams
            data.paramsData.fields = fields
            if (this.type == 4) {
                // 针对告警查询
                data.paramsData.menuType = 2
            }
            if (flag == 'params') return data.paramsData
            this.getAreaChartSet(data)
                .then(res => {
                    if (this.type == 6 || this.type == 7) {
                        // 资产和漏洞需要转化为下划线
                        this.areaData = this.getTesCalc(res)
                    } else {
                        this.areaData = this.getDataFromField(res)
                    }
                    this.loading = false
                    console.log(this.areaData)
                })
                .catch(err => {
                    console.log(err)
                    this.loading = false
                })
        },
        submitPie(flag) {
            // 展示图的options
            const chartPieOption = _.cloneDeep(this.pieOption)
            chartPieOption.attr.color = chartPieOption.attr.color.map(c => c.code)
            chartPieOption.attr.angle = chartPieOption.attr.angle.field.map(a => a.code)
            chartPieOption.attr.angleType = chartPieOption.attr.angle.aggType || 1
            chartPieOption.attr.subdivision = chartPieOption.attr.subdivision.map(s => s.code)
            chartPieOption.measureList = chartPieOption.measureList.map(mea => mea.code)
            if (flag != 'params') {
                this.chatPieOption = chartPieOption
            }
            // 接口参数
            const chartPieParams = {
                color: chartPieOption.attr.color[0],
                colorSet: chartPieOption.attr.colorSet,
                angle: {
                    type: this.pieOption.attr.type,
                    field: chartPieOption.attr.angle[0],
                    aggType: this.pieOption.attr.angle.aggType || 1,
                    sortType: this.pieOption.attr.angle.sortType,
                    count: this.pieOption.attr.angle.count || 99
                },
                subdivision: chartPieOption.attr.subdivision[0]
            }
            chartPieParams.measureList = this.pieOption.measureList.map(item => {
                return {
                    field: item.code,
                    aggType: item.aggType || 1
                }
            })
            console.log(chartPieParams)
            const data = this.$parent.getSearchParams()
            const fields = this.getAllFieldsPie(this.pieOption)
            data.paramsData.chartInfo = chartPieParams
            data.paramsData.fields = fields
            if (this.type == 4) {
                // 针对告警查询
                data.paramsData.menuType = 2
            }
            if (flag == 'params') return data.paramsData
            this.getPieChartSet(data)
                .then(res => {
                    if (this.type == 6 || this.type == 7) {
                        // 资产和漏洞需要转化为下划线
                        this.pieData = this.getTesCalc(res)
                    } else {
                        this.pieData = this.getDataFromField(res)
                    }
                    this.loading = false
                    console.log(this.pieData)
                })
                .catch(err => {
                    console.log(err)
                    this.loading = false
                })
        },
        getAllFields(data) {
            const fields = []
            const avoidField = ['dlz', 'dlmc', 'jls']
            data.xData.field.forEach(x => {
                if (!avoidField.includes(x.code)) {
                    fields.push(x.code)
                }
            })
            data.yData.field.forEach(y => {
                if (!avoidField.includes(y.code)) {
                    fields.push(y.code)
                }
            })
            data.attr.subdivision.forEach(s => {
                if (!avoidField.includes(s.code)) {
                    fields.push(s.code)
                }
            })
            data.measureList.forEach(mea => {
                if (!avoidField.includes(mea.code)) {
                    fields.push(mea.code)
                }
            })
            return fields
        },
        getAllFieldsTarget(data) {
            const fields = []
            data.tarData.field.forEach(y => {
                fields.push(y.code)
            })
            return fields
        },
        getAllFieldsPie(data) {
            const fields = []
            const avoidField = ['dlz', 'dlmc', 'jls']
            data.attr.color.forEach(x => {
                if (!avoidField.includes(x.code)) {
                    fields.push(x.code)
                }
            })
            data.attr.angle.field.forEach(y => {
                if (!avoidField.includes(y.code)) {
                    fields.push(y.code)
                }
            })
            data.attr.subdivision.forEach(s => {
                if (!avoidField.includes(s.code)) {
                    fields.push(s.code)
                }
            })
            data.measureList.forEach(mea => {
                if (!avoidField.includes(mea.code)) {
                    fields.push(mea.code)
                }
            })
            return fields
        },
        submitTable(flag) {
            const chartInfo = {
                columns: []
            }
            const avoidField = ['dlz', 'dlmc', 'jls']
            const fields = []
            console.log(this.tableOption.data)
            const columns = _.cloneDeep(this.tableOption.data)
            if (flag != 'params') {
                this.chatTableOption = _.cloneDeep(columns)
                this.chatTableOption.forEach(item => {
                    if (item.isNum) {
                        if (!(this.type == 6 || this.type == 7)) {
                            // console.log(item.code)
                            // item.code = item.code + 'Num'
                            if (!avoidField.includes(item.code)) {
                                item.code = item.code + 'Num'
                            }
                        }
                        if (item.code == 'jls') {
                            item.code = 'num'
                        }
                    }
                })
            }
            columns.forEach(item => {
                let fie = item.code
                item.field = item.code
                if (item.isNum) {
                    // 度量类
                    if (!item.aggType) item.aggType = 1
                    if (!item.sortType) item.sortType = ''
                    if (!('count' in item)) item.count = 99
                    if (!(this.type == 6 || this.type == 7)) {
                        item.code = item.code + 'Num'
                    }
                }
                if (!avoidField.includes(item.code)) {
                    if (!(this.type == 6 || this.type == 7)) {
                        if (item.isNum) {
                            fie = item.code.substr(0, item.code.length - 3)
                        }
                    }
                    fields.push(fie)
                }
            })
            chartInfo.columns = columns
            console.log(chartInfo)
            const data = this.$parent.getSearchParams()
            data.paramsData.chartInfo = chartInfo
            data.paramsData.fields = fields
            data.queryData = {
                page: this.tabPage.page,
                pageSize: this.tabPage.pageSize
            }
            if (this.type == 4) {
                // 针对告警查询
                data.paramsData.menuType = 2
            }
            if (flag == 'params') return data.paramsData
            this.getTableChartSet(data)
                .then(res => {
                    if (this.type == 6 || this.type == 7) {
                        // 资产和漏洞需要转化为下划线
                        this.tableData = this.getTesCalc(res.records)
                    } else {
                        this.tableData = this.getDataFromField(res.records)
                    }
                    // this.tableData = res.records
                    this.tabPage.total = res.total
                    this.loading = false
                    console.log(this.tableData)
                })
                .catch(err => {
                    console.log(err)
                    this.loading = false
                })
        },
        tryUse() {
            this.loading = true
            switch (this.activeChart) {
                case 'bar':
                    this.submitBar()
                    break
                case 'line':
                    this.submitLine()
                    break
                case 'area':
                    this.submitArea()
                    break
                case 'table':
                    this.submitTable()
                    break
                case 'pie':
                    this.submitPie()
                    break
                case 'target':
                    this.submitTarget()
                    break
            }
        }
    }
}
</script>

<style lang="scss">
.chart-dia {
    .el-dialog__body {
        min-height: 300px;
    }
}
</style>
<style scoped lang="scss">
@import '../../../../assets/css/pacap';
i.fold {
    position: absolute;
    top: 18px;
    right: 15px;
    font-size: 12px;
    color: #999999;
    cursor: pointer;
}
.tabs-icon {
    font-size: 16px;
    span {
        margin-right: 10px;
        color: rgb(235 238 240);
        cursor: pointer;
    }
    .active {
        color: #387dee;
    }
}
.empty-add {
    height: 100%;
    font-size: 12px;
    border: 1px dashed rgb(56 125 238 / 100%);
    border-radius: 4px;
    color: rgb(56 125 238 / 100%);
    background: rgb(56 125 238 / 5%);
    .iconfont {
        font-size: 12px;
    }
}
.custom-star {
    .expert-left {
        border: none;
        background-color: rgb(0 0 0 / 40%);
    }
    .expert-right {
        border: none;
        background-color: rgb(0 0 0 / 40%);
    }
    .list-tips {
        font-size: 14px;
        color: #ffffff !important;
    }
    .chart-set {
        border: 1px solid #1cd7fa;
        background-color: rgb(0 0 0 / 40%);
        box-shadow: 0 0 7px inset #389bf7;
    }
    .chart-left {
        border-right: 1px solid #1cd7fa !important;
        background-color: rgb(0 0 0 / 40%) !important;
        box-shadow: 0 0 7px inset #389bf7;
    }
}
.expert-left {
    position: relative;
    padding: 10px 0;
    width: 190px;
    border: solid 1px #ffffff;
    background-color: #ffffff;
    // margin-right: 10px;
    transition: width 0.2s linear;
    box-sizing: border-box;
    ::v-deep .el-input__suffix-inner {
        line-height: 32px;
    }
}
.expert-left.left-fold {
    width: 30px;
    transition: width 0.2s linear;
    i.fold {
        right: 8px;
        color: #999999;
        transform: rotate(180deg);
    }
}
.drag {
    overflow: scroll;
    max-height: 200px;
}
.expert-right {
    padding: 10px 0 10px 10px;
    border: solid 1px #ffffff;
    background-color: #ffffff;
    ::v-deep .el-button--primary {
        border-color: #ffffff;
    }
    ::v-deep .el-button--text {
        // color: #0052d9;
    }
    .bigTable {
        ::v-deep .el-form-item {
            margin-bottom: 0;
        }
    }
    .save-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 24px;
        font-size: 12px;
        color: #0052d9;
        line-height: 24px;
        cursor: pointer;
    }
}
.left-title {
    font-size: 14px;
    color: #191919;
}
.left-mark {
    width: 5px;
    height: 24px;
    border-radius: 4px;
    background-color: #387dee;
}
.left-tip {
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 0;
    > i {
        margin-right: 5px;
        font-size: 12px;
        color: #bdbdbd;
        vertical-align: middle;
    }
    > span {
        vertical-align: middle;
        font-size: 10px;
        color: #bdbdbd;
    }
}
.list-group {
    margin-top: 10px;
    min-height: 26px;
}
.list-item {
    position: relative;
    padding: 0 10px;
    width: 180px;
    height: 28px;
    border-radius: 4px;
    .vertical-line {
        position: absolute;
        left: -6px;
        width: 2px;
        height: 28px;
        background: rgb(255 255 255 / 20%);
        &.active {
            // background: #fff;
            // box-shadow: 0 0 4px #00d0ff, 0 0 6px #00d0ff;
        }
    }
}
.list-group-item.forbid {
    .vertical-line.active {
        // background: red;
    }
}
.list-group-item {
    margin: 4px 0;
    color: #ffffff;
    cursor: move;
    // padding:0 10px;
    box-sizing: border-box;
    .list-item {
        background-color: #387dee;
    }
}
.list-inner {
    margin: 10px 0;
    width: 170px;
}
// ::-webkit-scrollbar {
//     width: 0 !important;
// }
.chart-set {
    border: 1px solid rgb(221 221 221 / 100%);
    border-radius: 4px;
    background-color: rgb(56 125 238 / 5%);
    .bar-wrap,
    .line-wrap,
    .area-wrap,
    .table-wrap,
    .target-wrap,
    .pie-wrap {
        display: flex;
        min-height: 100%;
    }
    .table-wrap {
        overflow: hidden;
    }
    .target-wrap {
        .contrast {
            margin-top: 10px;
            font-size: 12px;
            color: rgb(0 0 0 / 60%);
        }
        .contrastTime {
            margin-top: 10px;
            .icon-shaixuan {
                position: relative;
                overflow: hidden;
                margin-left: 12px;
                height: 20px;
                font-size: 12px;
                color: #387dee;
                cursor: pointer;
                line-height: 20px;
                .custom-date {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    opacity: 0;
                }
            }
        }
        .contrast-sel {
            margin-top: 4px;
            padding-right: 10px;
            border: 1px solid #dcdcdc;
            border-radius: 4px;
            ::v-deep .el-input__inner {
                height: 28px;
                line-height: 28px;
                border: none !important;
            }
            ::v-deep .el-input__suffix {
                line-height: 28px;
                .el-input__icon {
                    line-height: 28px;
                }
            }
            .icon-shaixuan {
                position: relative;
                overflow: hidden;
                height: 28px;
                font-size: 12px;
                color: #387dee;
                cursor: pointer;
                line-height: 28px;
                .custom-date {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    opacity: 0;
                }
            }
        }
    }
    .chart-left {
        padding: 10px;
        width: 200px;
        min-height: 100%;
        border-right: 1px solid rgb(221 221 221 / 100%);
        background-color: #ffffff;
        .left-header {
            font-size: 14px;
            font-weight: 400;
            color: rgb(0 0 0 / 90%);
            line-height: 22px;
        }
        .x-header,
        .y-header,
        .attr-header {
            margin-top: 10px;
            font-size: 12px;
            font-weight: 400;
            color: #0052d9;
            line-height: 20px;
        }
        .changeXY {
            position: relative;
            margin-top: 20px;
            height: 28px;
            text-align: center;
            line-height: 28px;
            .linexy {
                position: absolute;
                top: 14px;
                left: 0;
                width: 100%;
                height: 1px;
                background: #dcdcdc;
            }
            .icon-change {
                position: relative;
                display: inline-block;
                width: 20px;
                background-color: #ffffff;
                cursor: pointer;
            }
            .iconfont {
                display: inline-block;
                transform: rotate(90deg);
            }
        }
        .attr-type-header {
            margin-top: 10px;
            margin-bottom: 4px;
            font-size: 12px;
            font-weight: 400;
            color: rgb(0 0 0 / 60%);
            line-height: 20px;
        }
        .attr-color-header {
            margin-top: 4px;
            margin-bottom: 4px;
            font-size: 12px;
            font-weight: 400;
            color: rgb(0 0 0 / 60%);
            line-height: 20px;
        }
        .attr-measure-header {
            margin-top: 4px;
            margin-bottom: 4px;
            font-size: 12px;
            font-weight: 400;
            color: rgb(0 0 0 / 60%);
            line-height: 20px;
        }
        .type-select {
            ::v-deep .el-input {
                .el-input__inner {
                    height: 28px;
                    line-height: 28px;
                }
            }
        }
        .use {
            margin-top: 20px;
            width: 100%;
            height: 30px;
        }
    }
    .chart-right {
        overflow: scroll;
        overflow-x: hidden;
        width: 100%;
        flex: 1;
    }
}
</style>
