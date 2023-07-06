<template>
    <div>
        <el-drawer title="查看详情" :visible.sync="seeDialog" direction="rtl" size="74%" :wrapperClosable="false" @close="closeDrawer" common-class="custom-drawer" :append-to-body="true">
            <div class="drawer-content">
                <div class="drawer-pad" style="overflow-y:hidden">
                    <el-tabs v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane label="基本信息" name="1">
                            <div style="overflow-y:auto;height:calc(100vh - 150px);padding:0 10px;">
                                <div class="title">概览</div>
                                <div class="container">
                                    <el-descriptions size="mini" title="" :column="2" border>
                                        <el-descriptions-item label="发生时间">{{info.mergerStartTime}}</el-descriptions-item>
                                        <el-descriptions-item label="响应时间">{{info.mergerEndTime}}</el-descriptions-item>
                                        <el-descriptions-item label="目的IP">
                                            <el-popover popper-class="add-search" placement="bottom" title="" trigger="click">
                                                <div>
                                                    <p @click="jumpAsset({fieldName:'desIp'},info.desIp)" class="ub ub-ac click-btn">
                                                        <i class="iconfont icon-chaxunzichan" style="font-size:12px"></i>
                                                        <span>查询资产</span>
                                                    </p>
                                                    <p style="margin-top:10px" @click="jumpThreat({fieldName:'desIp'},info.desIp)" class="ub ub-ac click-btn">
                                                        <i class="iconfont icon-chaxunqingbao" style="font-size:12px"></i>
                                                        <span>查询情报</span>
                                                    </p>
                                                </div>
                                                <p class="highlighted" style="cursor: pointer; text-decoration: underline; color: rgb(0, 82, 217); display: inline-block;" slot="reference">
                                                    <!-- <i
                                                        v-if="info.desIpVenusIsSpite != '内网' && info.desIp"
                                                        class="iconfont"
                                                        :style="{
                                                            color: [{ type: '安全', color: '#00ff48' }, { type: '恶意', color: '#ff0000' }, { type: '未知', color: '#7c7c7c' },{ type: 'kong', color: '#7c7c7c' }].filter(
                                                                co => co.type == info.desIpVenusIsSpite
                                                            )[0].color
                                                        }"
                                                        :title="'VenusEye：'+info.desIpVenusIsSpite"
                                                        :class="{
                                                            'icon-liebiaonei-anquan': info.desIpVenusIsSpite == '安全',
                                                            'icon-liebiaonei-buanquan': info.desIpVenusIsSpite == '恶意',
                                                            'icon-liebiaonei-weizhi': info.desIpVenusIsSpite == '未知'
                                                        }"
                                                    ></i> -->
                                                    <i
                                                        v-if="info.desIpIsSpite != '内网' && info.desIp"
                                                        class="iconfont"
                                                        :style="{
                                                            color: [{ type: '安全', color: '#00ff48' }, { type: '恶意', color: '#ff0000' }, { type: '未知', color: '#7c7c7c' },{ type: 'kong', color: '#7c7c7c' }].filter(
                                                                co => co.type == info.desIpIsSpite
                                                            )[0].color
                                                        }"
                                                        :title="'微步：'+info.desIpIsSpite"
                                                        :class="{
                                                            'icon-liebiaonei-anquan': info.desIpIsSpite == '安全',
                                                            'icon-liebiaonei-buanquan': info.desIpIsSpite == '恶意',
                                                            'icon-liebiaonei-weizhi': info.desIpIsSpite == '未知'
                                                        }"
                                                    ></i>
                                                    {{ info.desIp }}
                                                </p>
                                                <!-- <p style="cursor: pointer; text-decoration: underline; color: rgb(0, 82, 217);" slot="reference" v-html="info.desIp"></p> -->
                                            </el-popover>
                                        </el-descriptions-item>
                                        <el-descriptions-item label="目的端口">{{info.desPort}}</el-descriptions-item>
                                        <el-descriptions-item label="源IP">
                                            <el-popover popper-class="add-search" placement="bottom" title="" trigger="click">
                                                <div>
                                                    <p @click="jumpAsset({fieldName:'srcIp'},info.srcIp)" class="ub ub-ac click-btn">
                                                        <i class="iconfont icon-chaxunzichan" style="font-size:12px"></i>
                                                        <span>查询资产</span>
                                                    </p>
                                                    <p style="margin-top:10px" @click="jumpThreat({fieldName:'srcIp'},info.srcIp)" class="ub ub-ac click-btn">
                                                        <i class="iconfont icon-chaxunqingbao" style="font-size:12px"></i>
                                                        <span>查询情报</span>
                                                    </p>
                                                </div>
                                                <p class="highlighted" style="cursor: pointer; text-decoration: underline; color: rgb(0, 82, 217); display: inline-block;" slot="reference">
                                                    <!-- <i
                                                        v-if="info.srcIpVenusIsSpite != '内网' && info.srcIp"
                                                        class="iconfont"
                                                        :style="{
                                                            color: [{ type: '安全', color: '#00ff48' }, { type: '恶意', color: '#ff0000' }, { type: '未知', color: '#7c7c7c' },{ type: 'kong', color: '#7c7c7c' }].filter(
                                                                co => co.type == info.srcIpVenusIsSpite
                                                            )[0].color
                                                        }"
                                                        :title="'VenusEye：'+info.srcIpVenusIsSpite"
                                                        :class="{
                                                            'icon-liebiaonei-anquan': info.srcIpVenusIsSpite == '安全',
                                                            'icon-liebiaonei-buanquan': info.srcIpVenusIsSpite == '恶意',
                                                            'icon-liebiaonei-weizhi': info.srcIpVenusIsSpite == '未知'
                                                        }"
                                                    ></i> -->
                                                    <i
                                                        v-if="info.srcIpIsSpite != '内网' && info.srcIp"
                                                        class="iconfont"
                                                        :style="{
                                                            color: [{ type: '安全', color: '#00ff48' }, { type: '恶意', color: '#ff0000' }, { type: '未知', color: '#7c7c7c' },{ type: 'kong', color: '#7c7c7c' }].filter(
                                                                co => co.type == info.srcIpIsSpite
                                                            )[0].color
                                                        }"
                                                        :title="'微步：'+info.srcIpIsSpite"
                                                        :class="{
                                                            'icon-liebiaonei-anquan': info.srcIpIsSpite == '安全',
                                                            'icon-liebiaonei-buanquan': info.srcIpIsSpite == '恶意',
                                                            'icon-liebiaonei-weizhi': info.srcIpIsSpite == '未知'
                                                        }"
                                                    ></i>
                                                    {{ info.srcIp }}
                                                </p>
                                                <!-- <p style="cursor: pointer; text-decoration: underline; color: rgb(0, 82, 217);" slot="reference" v-html="info.srcIp"></p> -->
                                            </el-popover>
                                        </el-descriptions-item>
                                        <el-descriptions-item label="源端口">{{info.srcPort}}</el-descriptions-item>
                                        <el-descriptions-item label="事件名称">{{info.attackName}}</el-descriptions-item>
                                        <el-descriptions-item label="事件等级">{{info.level}}</el-descriptions-item>
                                        <el-descriptions-item label="事件类型">{{info.attackType}}</el-descriptions-item>
                                        <el-descriptions-item label="域名">{{info.domainName}}</el-descriptions-item>
                                        <el-descriptions-item label="原始信息">{{info.message}}</el-descriptions-item>
                                    </el-descriptions>
                                </div>
                                <div class="title" style="margin-top:20px">告警设备</div>
                                <div class="alarm-device">
                                    <span v-for="(item,index) in dts" :key="item" :style="{'color':index<=colorList.length?colorList[index]:colorList[index-(colorList.length*(index/colorList.length).toFixed(1).slice(0,-1))],'border':`1px solid ${index<=colorList.length?colorList[index]:colorList[index-(colorList.length*(index/colorList.length).toFixed(1).slice(0,-1))]}`,'background':index<=colorList1.length?colorList1[index]:colorList1[index-(colorList1.length*(index/colorList1.length).toFixed(1).slice(0,-1))]}">{{item}}</span>
                                </div>
                                <div class="ub ub-pj w100">
                                    <div class="title" style="margin-top:10px">原始日志</div>
                                    <div class="title" style="margin-top:10px;cursor: pointer;" @click="transferDialog=true">
                                        <i class="el-icon-edit-outline" style="font-size:13px;"></i>
                                        配置表头
                                    </div>
                                </div>
                                <div>
                                    <el-table
                                        style="width:100%;"
                                        v-loading="loading"
                                        ref="multipleTable"
                                        @expand-change="handleExpand"
                                        class='bigTable expert-table'
                                        :row-key="(row)=>{ return row.id}"
                                        :data="tableData"
                                        border
                                        stripe
                                        tooltip-effect="dark"
                                        :expand-row-keys="expandRowKeys"
                                        @sort-change="changeTableSort"
                                        @selection-change="handleSelectionChange">
                                        <el-table-column type="expand" class-name="expand-col" width="40">
                                            <div class="container">
                                                <el-descriptions size="mini" title="" :column="2" border>
                                                    <el-descriptions-item :label="item.name"  v-for="(item,index) in expandJsonDataCopy" :key="index">
                                                        <el-popover popper-class="add-search" placement="bottom" title="" trigger="click">
                                                            <div>
                                                                <p
                                                                    style="margin-top:10px"
                                                                    v-if="['ip'].some(keyWord => item.code.toLowerCase().includes(keyWord))"
                                                                    @click="jumpAsset(item, expandJsonData[item.code])"
                                                                    class="ub ub-ac click-btn"
                                                                >
                                                                    <i class="iconfont icon-chaxunzichan" style="font-size:12px"></i>
                                                                    <span>查询资产</span>
                                                                </p>
                                                                <p
                                                                    style="margin-top:10px"
                                                                    v-if="['ip', 'url', '域名'].some(keyWord => item.code.toLowerCase().includes(keyWord))"
                                                                    @click="jumpThreat(item, expandJsonData[item.code])"
                                                                    class="ub ub-ac click-btn"
                                                                >
                                                                    <i class="iconfont icon-chaxunqingbao" style="font-size:12px"></i>
                                                                    <span>查询情报</span>
                                                                </p>
                                                            </div>
                                                            <p class="highlighted" slot="reference" v-html="expandJsonData[item.code]" v-if="item.code === 'aDate'" style="color:#00c0ff"></p>
                                                            <p
                                                                v-else
                                                                class="highlighted"
                                                                :style="['ip', 'url', '域名'].some(keyWord => item.code.toLowerCase().includes(keyWord)) ? 'cursor: pointer; text-decoration: underline; color: rgb(0, 82, 217);' : 'cursor: default; text-decoration: unset; color: rgba(0, 0, 0, 0.9);'"
                                                                slot="reference"
                                                                v-html="expandJsonData[item.code]"
                                                            ></p>
                                                        </el-popover>
                                                    </el-descriptions-item>
                                                </el-descriptions>
                                            </div>
                                        </el-table-column>
                                        <el-table-column
                                            v-for="(item, index) in tableList"
                                            :key="index"
                                            :label="item.name"
                                            min-width="140"
                                            sortable
                                            show-overflow-tooltip
                                            :prop="item.fieldName">
                                            <template slot-scope="scope">
                                                <div v-if="item.fieldName=='srcIp' || item.fieldName=='desIp'">
                                                    <el-popover popper-class="add-search" placement="bottom" title="" trigger="click">
                                                        <div>
                                                            <p
                                                                style="margin-top:10px"
                                                                v-if="['ip'].some(keyWord => item.fieldName.toLowerCase().includes(keyWord))"
                                                                @click="jumpAsset(item, scope.row[item.fieldName])"
                                                                class="ub ub-ac click-btn"
                                                            >
                                                                <i class="iconfont icon-chaxunzichan" style="font-size:12px"></i>
                                                                <span>查询资产</span>
                                                            </p>
                                                            <p
                                                                style="margin-top:10px"
                                                                v-if="['ip', 'url', '域名'].some(keyWord => item.fieldName.toLowerCase().includes(keyWord))"
                                                                @click="jumpThreat(item, scope.row[item.fieldName])"
                                                                class="ub ub-ac click-btn"
                                                            >
                                                                <i class="iconfont icon-chaxunqingbao" style="font-size:12px"></i>
                                                                <span>查询情报</span>
                                                            </p>
                                                        </div>
                                                        <p class="highlighted" slot="reference" v-html="scope.row[item.fieldName]" v-if="item.fieldName === 'aDate'" style="color:#00c0ff"></p>
                                                        <p
                                                            v-else
                                                            class="highlighted"
                                                            :style="['ip', 'url', '域名'].some(keyWord => item.fieldName.toLowerCase().includes(keyWord)) ? 'cursor: pointer; text-decoration: underline; color: rgb(0, 82, 217);' : 'cursor: default; text-decoration: unset; color: rgba(0, 0, 0, 0.9);'"
                                                            slot="reference"
                                                            v-html="scope.row[item.fieldName]"
                                                        ></p>
                                                    </el-popover>
                                                </div>
                                                <div v-else>
                                                    <p class="highlighted" slot="reference" v-html="scope.row[item.fieldName]" style="color:rgba(0, 0, 0, 0.9);"></p>
                                                </div>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                    <pagination :total="totalOne" :page.sync="get_params.page" :limit.sync="get_params.size" @pagination="get_data" />
                                </div>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="流量日志" name="2">
                            <div style="overflow-y:auto;height:calc(100vh - 150px);padding:0 10px;">
                                <el-form :model="seeForm" ref="seeForm" :inline="true" label-position="left">
                                    <div class="ub ub-pj">
                                        <el-form-item label="目的IP:" label-width="63px" prop="reportName">
                                            <el-input placeholder="请输入目的IP" clearable v-model="seeForm.desIp" size="small" style="width: 100%" disabled></el-input>
                                        </el-form-item>
                                        <el-form-item label="目的端口:" label-width="63px" prop="reportName">
                                            <el-input placeholder="请输入目的端口" clearable v-model="seeForm.desPort" size="small" style="width: 100%" disabled></el-input>
                                        </el-form-item>
                                        <el-form-item label="源IP:" label-width="63px" prop="reportName">
                                            <el-input placeholder="请输入源IP" clearable v-model="seeForm.srcIp" size="small" style="width: 100%" disabled></el-input>
                                        </el-form-item>
                                        <el-form-item label="源端口:" label-width="63px" prop="reportName">
                                            <el-input placeholder="请输入源端口" clearable v-model="seeForm.srcPort" size="small" style="width: 100%"></el-input>
                                        </el-form-item>
                                        <el-button size="small" type="primary" @click='search' style="height:32px">搜 索</el-button>
                                    </div>
                                    <!-- <div class="ub ub-pe">
                                        <addBtn style="margin-left: 10px;margin-bottom:10px" icon="el-icon-download" title="下载PCAP包" />
                                    </div> -->
                                </el-form>
                                <div>
                                    <!-- :row-key="(row)=>{ return row.id}" -->
                                    <el-table
                                        :row-key="(row)=>{ return row.id}"
                                        style="width:100%;"
                                        v-loading="loading"
                                        ref="multipleTable"
                                        @expand-change="handleExpand1"
                                        class='bigTable expert-table'
                                        :data="tableDataYc"
                                        border
                                        stripe
                                        tooltip-effect="dark"
                                        :expand-row-keys="expandRowKeys1"
                                        @sort-change="changeTableSort1"
                                        @selection-change="handleSelectionChange1">
                                        <el-table-column type="expand" class-name="expand-col" width="40">
                                            <div class="container">
                                                <!-- <div v-for="(item,index) in expandJsonDataList" :key="index" >
                                                    <el-descriptions size="mini" title="" :column="2" border v-if="expandJsonData1[item.code]">
                                                        <el-descriptions-item :label="item.name">{{expandJsonData1[item.code]}}</el-descriptions-item>
                                                    </el-descriptions>
                                                </div> -->
                                                <el-descriptions size="mini" title="" :column="2" border>
                                                    <el-descriptions-item :label="item.name"  v-for="(item,index) in expandJsonDataCopy" :key="index">
                                                        <el-popover popper-class="add-search" placement="bottom" title="" trigger="click">
                                                            <div>
                                                                <p
                                                                    style="margin-top:10px"
                                                                    v-if="['ip'].some(keyWord => item.code.toLowerCase().includes(keyWord))"
                                                                    @click="jumpAsset(item, expandJsonData1[item.code])"
                                                                    class="ub ub-ac click-btn"
                                                                >
                                                                    <i class="iconfont icon-chaxunzichan" style="font-size:12px"></i>
                                                                    <span>查询资产</span>
                                                                </p>
                                                                <p
                                                                    style="margin-top:10px"
                                                                    v-if="['ip', 'url', '域名'].some(keyWord => item.code.toLowerCase().includes(keyWord))"
                                                                    @click="jumpThreat(item, expandJsonData1[item.code])"
                                                                    class="ub ub-ac click-btn"
                                                                >
                                                                    <i class="iconfont icon-chaxunqingbao" style="font-size:12px"></i>
                                                                    <span>查询情报</span>
                                                                </p>
                                                            </div>
                                                            <p class="highlighted" slot="reference" v-html="expandJsonData1[item.code]" v-if="item.code === 'aDate'" style="color:#00c0ff"></p>
                                                            <p
                                                                v-else
                                                                class="highlighted"
                                                                :style="['ip', 'url', '域名'].some(keyWord => item.code.toLowerCase().includes(keyWord)) ? 'cursor: pointer; text-decoration: underline; color: rgb(0, 82, 217);' : 'cursor: default; text-decoration: unset; color: rgba(0, 0, 0, 0.9);'"
                                                                slot="reference"
                                                                v-html="expandJsonData1[item.code]"
                                                            ></p>
                                                        </el-popover>
                                                    </el-descriptions-item>
                                                </el-descriptions>
                                            </div>
                                        </el-table-column>
                                        <el-table-column
                                            label="源IP"
                                            min-width="140"
                                            sortable
                                            show-overflow-tooltip
                                            prop="clientIp">
                                            <template slot-scope="scope">
                                                <div>
                                                    <el-popover popper-class="add-search" placement="bottom" title="" trigger="click">
                                                        <div>
                                                            <p
                                                                style="margin-top:10px"
                                                                @click="jumpAsset({fieldName:'clientIp'}, scope.row.clientIp)"
                                                                class="ub ub-ac click-btn"
                                                            >
                                                                <i class="iconfont icon-chaxunzichan" style="font-size:12px"></i>
                                                                <span>查询资产</span>
                                                            </p>
                                                            <p
                                                                style="margin-top:10px"
                                                                @click="jumpThreat({fieldName:'clientIp'}, scope.row.clientIp)"
                                                                class="ub ub-ac click-btn"
                                                            >
                                                                <i class="iconfont icon-chaxunqingbao" style="font-size:12px"></i>
                                                                <span>查询情报</span>
                                                            </p>
                                                        </div>
                                                        <p
                                                            class="highlighted"
                                                            style="'cursor: pointer; text-decoration: underline;color: rgb(0, 82, 217);'"
                                                            slot="reference"
                                                            v-html="scope.row.clientIp"
                                                        ></p>
                                                    </el-popover>
                                                </div>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            label="源端口"
                                            min-width="140"
                                            sortable
                                            show-overflow-tooltip
                                            prop="clientPort">
                                        </el-table-column>
                                        <el-table-column
                                            label="目的IP"
                                            min-width="140"
                                            sortable
                                            show-overflow-tooltip
                                            prop="serverIp">
                                            <template slot-scope="scope">
                                                <div>
                                                    <el-popover popper-class="add-search" placement="bottom" title="" trigger="click">
                                                        <div>
                                                            <p
                                                                style="margin-top:10px"
                                                                @click="jumpAsset({fieldName:'serverIp'}, scope.row.serverIp)"
                                                                class="ub ub-ac click-btn"
                                                            >
                                                                <i class="iconfont icon-chaxunzichan" style="font-size:12px"></i>
                                                                <span>查询资产</span>
                                                            </p>
                                                            <p
                                                                style="margin-top:10px"
                                                                @click="jumpThreat({fieldName:'serverIp'}, scope.row.serverIp)"
                                                                class="ub ub-ac click-btn"
                                                            >
                                                                <i class="iconfont icon-chaxunqingbao" style="font-size:12px"></i>
                                                                <span>查询情报</span>
                                                            </p>
                                                        </div>
                                                        <p
                                                            class="highlighted"
                                                            style="'cursor: pointer; text-decoration: underline; color: rgb(0, 82, 217);' "
                                                            slot="reference"
                                                            v-html="scope.row.serverIp"
                                                        ></p>
                                                    </el-popover>
                                                </div>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            label="目的端口"
                                            min-width="140"
                                            sortable
                                            show-overflow-tooltip
                                            prop="serverPort">
                                        </el-table-column>
                                        <el-table-column label="操作" align="center" width="50" fixed="right" class-name="deepBg">
                                            <template slot-scope="scope">
                                                <opt-btn icon="iconfont icon-liebiao-chuangjianpcapbao" title="创建PCAP包任务" @click="createPackTask(scope.row)"></opt-btn>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                    <pagination :total="totalTwo" :page.sync="get_params1.page" :limit.sync="get_params1.size" @pagination="get_ycdata" />
                                    <!-- <div class="pagination" style="padding:0 !important">
                                        <el-pagination
                                            background
                                            @size-change="handleSizeChange1"
                                            @current-change="handleCurrentChange1"
                                            :current-page="get_params1.page"
                                            :page-sizes="[30,50,100]"
                                            :page-size="get_params1.size"
                                            layout="slot,sizes, prev, next"
                                            prev-text="上一页"
                                            next-text="下一页"></el-pagination>
                                    </div> -->
                                </div>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="资产信息" name="3">
                            <div class="container" style="overflow-y:auto;height:calc(100vh - 150px);padding:0 10px;">
                                <el-descriptions size="mini" title="" :column="2" border>
                                    <el-descriptions-item label="资产名称">{{ assetsInfo.deviceName }}</el-descriptions-item>
                                    <el-descriptions-item label="资产标识">{{ assetsInfo.uniqueCode }}</el-descriptions-item>
                                    <!-- <el-descriptions-item label="端口"></el-descriptions-item>
                                    <el-descriptions-item label="资产标识"></el-descriptions-item>
                                    <el-descriptions-item label="资产联系人"></el-descriptions-item> -->
                                    <el-descriptions-item label="设备类型">{{ assetsInfo.deviceTypeName }}</el-descriptions-item>
                                    <el-descriptions-item label="厂商">{{ assetsInfo.manufacturerName }}</el-descriptions-item>
                                    <el-descriptions-item label="型号">{{assetsInfo.modelInfo}}</el-descriptions-item>
                                    <el-descriptions-item label="操作系统">{{ assetsInfo.pcSystem }}</el-descriptions-item>
                                    <el-descriptions-item label="是否边界">
                                        <p v-if="assetsInfo.isBoundary!==''">{{ assetsInfo.isBoundary|getisBoundary }}</p>
                                    </el-descriptions-item>
                                    <!-- <el-descriptions-item label="是否国产"></el-descriptions-item> -->
                                    <el-descriptions-item label="业务系统">{{assetsInfo.systemName}}</el-descriptions-item>
                                    <el-descriptions-item label="IP">
                                        {{assetsInfo.ip}}
                                        <el-popover popper-class="add-search" placement="bottom" title="" trigger="click">
                                            <div>
                                                <p
                                                    style="margin-top:10px"
                                                    @click="jumpThreat(assetsInfo, assetsInfo.ip)"
                                                    class="ub ub-ac click-btn"
                                                >
                                                    <i class="iconfont icon-chaxunqingbao" style="font-size:12px"></i>
                                                    <span>查询情报</span>
                                                </p>
                                            </div>
                                            <p
                                                class="highlighted"
                                                style="'cursor: default; text-decoration: unset; color: rgb(0, 0, 0, 0.9);"
                                                slot="reference"
                                                v-html="assetsInfo.ip"
                                            ></p>
                                            <p class="highlighted" style="cursor: pointer; text-decoration: underline; color: rgb(0, 82, 217); display: inline-block;" slot="reference">
                                                <i
                                                    v-if="assetsInfo.ipIsSpite != '内网' && assetsInfo.ip"
                                                    class="iconfont"
                                                    :style="{
                                                        color: [{ type: '安全', color: '#00ff48' }, { type: '恶意', color: '#ff0000' }, { type: '未知', color: '#7c7c7c' },{ type: 'kong', color: '#7c7c7c' }].filter(
                                                            co => co.type == assetsInfo.ipIsSpite
                                                        )[0].color
                                                    }"
                                                    :title="assetsInfo.ipIsSpite"
                                                    :class="{
                                                        'icon-liebiaonei-anquan': assetsInfo.ipIsSpite == '安全',
                                                        'icon-liebiaonei-buanquan': assetsInfo.ipIsSpite == '恶意',
                                                        'icon-liebiaonei-weizhi': assetsInfo.ipIsSpite == '未知'
                                                    }"
                                                ></i>
                                                {{ assetsInfo.desIp }}
                                            </p>
                                        </el-popover>
                                    </el-descriptions-item>
                                    <el-descriptions-item label="创建时间">{{assetsInfo.createTime}}</el-descriptions-item>
                                    <el-descriptions-item label="所属安全域">{{ assetsInfo.zoneName }}</el-descriptions-item>
                                </el-descriptions>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </el-drawer>
        <CustomTransfer :list-all="listAll" :list="list" :transfer-dialog="transferDialog" />
        <el-dialog title="提示" :visible.sync="createTaskDialog" width="30%" custom-class="attendance-dialog">
            <span>确定下载PCAP包任务吗？</span>
            <span slot="footer" class="dialog-footer">
                <Debounce :time="3000" :isDebounce="2"><searchBtn title="确 定" @click.native="createTaskConfim" /></Debounce>
                <cancelBtn style="margin-left: 10px;" title="取 消" @click="createTaskDialog = false" />
            </span>
        </el-dialog>
    </div>
</template>
<script>
import CustomTransfer from '../../components/custom_transfer/index.vue'
import {
    getLogById,
    getFieldByAll,
    getUserField,
    saveUserField,
    getAggLog,
    getAssetsInfo,
    getAggLogById,
    getYcData,
    getYcInfo,
    getYcField,
    getKey,
    downloadLogPacket
} from '@/server/alarm_log/api.js'
import { get_threat_search, getStartConfig, get_threat_searchVenus } from '@/server/alarm/api.js'
export default {
    components: {
        CustomTransfer
    },
    data() {
        return {
            startData: [],
            transferDialog: false,
            activeName: '1',
            seeDialog: false,
            colorList: ['#266FE8', '#009A66', '#D80012', '#EC5E00', '#DDC900', '#00E5E3', '#0125B0', '#8D00D5', '#E10079', '#00D161'],
            colorList1: ['rgba(38,111,232,.1)', 'rgba(0,154,102,.1)', 'rgba(216,0,18,.1)', 'rgba(236,94,0,.1)', 'rgba(221,201,0,.1)', 'rgba(0,229,227,.1)', 'rgba(1,37,176,.1)', 'rgba(141,0,213,.1)', 'rgba(225,0,121,.1)', 'rgba(0,209,97,.1)'],
            loading: false,
            get_params: {
                page: 1,
                size: 50
            },
            get_params1: {
                page: 1,
                size: 50
            },
            totalOne: 0,
            totalTwo: 0,
            tableData: [],
            tableDataYc: [],
            expandRowKeys: [],
            expandRowKeys1: [],
            expandJsonData: {
                // mergerStartTime: '',
                // mergerEndTime: '',
                // desIp: '',
                // desPort: '',
                // srcIp: '',
                // srcPort: '',
                // attackName: '',
                // level: '',
                // attackType: '',
                // domainName: '',
                // message: ''
            },
            expandJsonData1: {},
            expandJsonDataCopy: [],
            expandJsonDataList: [],
            multipleSelection: [],
            multipleSelection1: [],
            list: [],
            listAll: [],
            selectAll: [],
            seeForm: {
                desIp: '',
                desPort: '',
                srcIp: '',
                srcPort: ''
            },
            details: {
                id: '',
                alarmTime: '',
                fields: [],
                desIp: ''
            },
            editSelect: false,
            dts: [], // 告警设备
            info: {
                // mergerStartTime: '',
                // mergerEndTime: '',
                // desIp: '',
                // desPort: '',
                // srcIp: '',
                // srcPort: '',
                // attackName: '',
                // level: '',
                // attackType: '',
                // domainName: '',
                // message: '',
                // desIpIsSpite: '未知'
            }, // 概览
            tableList: [],
            assetsInfo: {},
            sysLogListData: [
                {
                    clientIp: '',
                    clientPort: '',
                    serverIp: '',
                    serverPort: '',
                    packeCut: '',
                    probeIds: '',
                    deviceId: '',
                    requestTimeNs: '',
                    responseTimeNs: '',
                    id: ''
                }
            ],
            keyDetail: '',
            createTaskDialog: false
        }
    },
    mounted() {
        // this.getStartConfigData()
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
    },
    computed: {
        // tableList() {
        //     console.log('this.list', this.list)
        //     return this.list.length > 0 ? this.details.fields : this.listAll
        // }
    },
    methods: {
        getStartConfigData() {
            getStartConfig({ queryData: {}, paramsData: {}}).then(res => {
                this.startData = res
            })
        },
        jumpAsset(item, value) {
            this.$setsessionStorage('currentPath', '/assets/assets_asset_info?ip=' + value)
            window.open(window.location.origin + '/#' + '/assets/assets_asset_info?ip=' + value)
        },
        jumpThreat(item, value) {
            console.log(value)
            let obj = {
                queryData: {},
                paramsData: { value }
            }
            if (this.startData.includes(1)) {
                this.searchWeibu(obj, value)
            } else if (this.startData.includes(0)) {
                this.searchVenus(obj, value)
            }
        },
        searchWeibu(obj, value) {
            get_threat_search(obj)
                .then(res => {
                    console.log(res)
                    this.$setsessionStorage('search-item', res)
                    window.open(window.location.origin + '/#' + '/intelligence/threat_detail?searchStr=' + value)
                })
                .catch(err => {
                    console.log(err + 'err')
                })
        },
        searchVenus(obj, value) {
            get_threat_searchVenus(obj, value)
                .then(res => {
                    console.log(res)
                    this.$setsessionStorage('search-item', res)
                    window.open(window.location.origin + '/#' + '/intelligence/threat_detail?searchStr=' + value)
                })
                .catch(err => {
                    this.btnLoading = false
                    console.log(err + 'err')
                })
        },
        init(row, list) {
            this.details.id = row.id
            this.details.desIp = row.desIp
            this.details.alarmTime = row.alarmTime
            this.details.fields = list
            this.seeDialog = true
            this.seeForm = {
                desIp: row.desIp,
                desPort: row.desPort,
                srcIp: row.srcIp,
                srcPort: ''
            }
            this.get_logId()
            // this.quanbu()
            this.initSelectedFileds()
            this.initCanSelectedFileds()
        },
        createTaskConfim() {
            let data = {
                queryData: {
                    key: this.keyDetail
                },
                paramsData: {
                    ...this.sysLogListData[0]
                }
            }
            downloadLogPacket(data, 'pacp')
                .then(res => {
                    this.createTaskDialog = false
                    this.$message.success('操作成功！')
                    setTimeout(() => {
                        this.$emit('createTaskSucess')
                    }, 1500)
                })
                .catch(err => {
                    console.log('error' + err)
                    if (String(err).indexOf(404) != -1) {
                        this.$message({
                            message: '设备未连通！',
                            type: 'warning'
                        })
                    }
                })
        },
        // 下载pcap包
        createPackTask(row) {
            console.log(row)
            let data = {
                queryData: {},
                paramsData: {
                    id: row.id
                }
            }
            getYcInfo(data).then(res => {
                this.sysLogListData[0].clientIp = res.clientIp
                this.sysLogListData[0].clientPort = res.clientPort ? String(res.clientPort) : ''
                this.sysLogListData[0].serverIp = res.serverIp
                this.sysLogListData[0].serverPort = res.serverPort ? String(res.serverPort) : ''
                this.sysLogListData[0].packeCut = res.packeCut
                this.sysLogListData[0].probeIds = res.probeIds
                this.sysLogListData[0].deviceId = res.deviceId
                this.sysLogListData[0].requestTimeNs = res.requestTimeNs ? String(res.requestTimeNs) : ''
                this.sysLogListData[0].responseTimeNs = res.responseTimeNs ? String(res.responseTimeNs) : ''
                this.sysLogListData[0].id = res.id
            }).catch(err => {
                console.log(err)
            })
            let val = {
                queryData: {},
                paramsData: {}
            }
            getKey(val).then(res => {
                this.keyDetail = res
            })
            setTimeout(() => {
                this.createTaskDialog = true
            }, 800)
        },
        search() {
            this.get_ycdata()
        },
        closeDrawer() {
            console.log(this.editSelect)
            if (this.editSelect) {
                this.$parent.$parent.initCanSelectedFileds()
                this.$parent.$parent.initSelectedFileds1()
                this.editSelect = false
            }
            this.activeName = '1'
        },
        editSelectFields(list) {
            let data = {
                queryData: {},
                paramsData: {
                    fieldIds: list
                }
            }
            saveUserField(data).then(res => {
                this.transferDialog = false
                this.editSelect = true
                this.$message.success('操作成功！')
                setTimeout(() => {
                    this.initSelectedFileds()
                    this.initCanSelectedFileds()
                }, 1000)
            }).catch(err => {
                this.editSelect = false
                console.log(err)
            })
        },
        initSelectedFileds() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            getUserField(data).then(res => {
                this.list = []
                this.tableList = []
                return res
            }).then(res => {
                console.log('用户已选字段', res)
                this.searchLoading = false
                if (res.length > 0) {
                    res.forEach((item, index) => {
                        let obj = {}
                        obj.show = false
                        obj.name = item.name
                        obj.fieldId = item.fieldId
                        obj.fieldName = item.field
                        obj.type = item.type

                        this.list.push(obj)
                        this.tableList.push(obj)
                    })
                }
            }).then(res => {
                this.get_data()
            }).catch(error => {
                console.log('error' + error)
            })
        },
        initCanSelectedFileds() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            getFieldByAll(data).then(res => {
                this.listAll = []
                return res
            }).then(res => {
                console.log('所有综合可选字段', res)
                if (res.length > 0) {
                    res.forEach(item => {
                        let obj = {}
                        obj.fieldId = item.fieldId
                        obj.show = false
                        // obj.fixed = false
                        // obj.top5 = []
                        obj.name = item.name
                        obj.fieldName = item.field
                        obj.type = item.type
                        if (item.enums) {
                            obj.enums = item.enums
                        }
                        this.listAll.push(obj)
                    })
                }
            }).then(() => {
                this.list = this.$lodash.cloneDeep(this.list)
            }).catch(error => {
                console.log('error' + error)
            })
        },
        handleClick() {
            this.get_params.page = 1
            this.get_params1.page = 1
            if (this.activeName == '3') {
                this.get_info()
            } else if (this.activeName == '2') {
                this.get_ycdata()
            } else if (this.activeName == '1') {
                this.get_data()
            }
        },
        handleSizeChange(val) {
            this.get_params.size = val
            this.get_data()
        },
        handleCurrentChange(val) {
            this.get_params.page = val
            this.get_data()
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        handleSizeChange1(val) {
            this.get_params1.size = val
            this.get_ycdata()
        },
        handleCurrentChange1(val) {
            this.get_params1.page = val
            this.get_ycdata()
        },
        handleSelectionChange1(val) {
            this.multipleSelection1 = val
        },
        handleExpand(row, expandedRows) {
            let that = this
            if (expandedRows.length) {
                that.expandRowKeys = []
                if (row) {
                    that.expandRowKeys.push(row.id)

                    console.log(row, '展开')
                    let data = {
                        queryData: {},
                        paramsData: {
                            id: row.id,
                            alarmTime: row.alarmTime
                        }
                    }
                    this.expandJsonDataCopy = []
                    getAggLogById(data).then(res => {
                        this.expandJsonData = res
                        this.listAll.filter(item => {
                            if (res[item.fieldName]) {
                                this.expandJsonDataCopy.push({ code: item.fieldName, name: item.name })
                            }
                        })
                        console.log(this.expandJsonDataCopy)
                    }).catch(err => {
                        console.log(err)
                    })
                }
            } else {
                that.expandRowKeys = []
            }
        },
        handleExpand1(row, expandedRows) {
            let that = this
            if (expandedRows.length) {
                that.expandRowKeys1 = []
                if (row) {
                    that.expandRowKeys1.push(row.id)

                    console.log(row, '展开')
                    let data = {
                        queryData: {},
                        paramsData: {
                            id: row.id
                        }
                    }
                    this.expandJsonDataCopy = []
                    getYcInfo(data).then(res => {
                        this.expandJsonData1 = res
                        this.expandJsonDataList.filter(item => {
                            if (res[item.code]) {
                                this.expandJsonDataCopy.push({ code: item.code, name: item.name })
                            }
                        })
                    }).catch(err => {
                        console.log(err)
                    })
                }
            } else {
                that.expandRowKeys1 = []
            }
        },
        // 排序列改变返回当前需要排序的列
        changeTableSort(e) {
            console.log('e', e)
            // 获取当前列的字段
            const prop = e.prop
            // 如果按降序
            if (e.order === 'descending') {
                // 根据需要对字段进行写排序
                this.tableData = this.tableData.sort((a, b) => {
                    return parseFloat(a[prop]) - parseFloat(b[prop])
                })
            } else { // 发果是降序
                this.tableData = this.tableData.sort((a, b) => {
                    return parseFloat(b[prop]) - parseFloat(a[prop])
                })
            }
        },
        changeTableSort1(e) {
            console.log('e', e)
            // 获取当前列的字段
            const prop = e.prop
            // 如果按降序
            if (e.order === 'descending') {
                // 根据需要对字段进行写排序
                this.tableDataYc = this.tableDataYc.sort((a, b) => {
                    return parseFloat(a[prop]) - parseFloat(b[prop])
                })
            } else { // 发果是降序
                this.tableDataYc = this.tableDataYc.sort((a, b) => {
                    return parseFloat(b[prop]) - parseFloat(a[prop])
                })
            }
        },
        checkSelectable(row, index) {
            let flag = false
            if (row.nftData === 0) {
                flag = true
            }
            return flag
        },
        get_data() {
            this.loading = true
            let data = {
                queryData: {
                    page: this.get_params.page,
                    pageSize: this.get_params.size
                },
                paramsData: {
                    id: this.details.id,
                    alarmTime: this.details.alarmTime,
                    fields: this.list.map(item => { return item.fieldName })
                }
            }
            getAggLog(data).then(res => {
                this.tableData = []
                return res
            }).then(res => {
                console.log('数据暂存列表', res)
                this.loading = false
                let arr = res.records
                this.totalOne = res.total ? res.total : 0
                if (arr.length > 0) {
                    this.tableData = this.$lodash.cloneDeep(arr)
                } else if (arr.length === 0) {
                    if (this.get_params.page > 1) {
                        this.get_params.page = this.get_params.page - 1
                        this.get_data()
                    }
                }
            }).catch(error => {
                this.loading = false
                console.log('error' + error)
            })
        },
        get_logId() {
            this.dts = []
            this.info = {}
            let data = {
                queryData: {},
                paramsData: {
                    id: this.details.id,
                    alarmTime: this.details.alarmTime
                }
            }
            getLogById(data).then(res => {
                this.dts = res.dts
                // res.info.desIpIsSpite = '未知'
                // res.info.srcIpIsSpite = '安全'
                this.info = res.info
                this.seeForm.desIp = this.seeForm.desIp ? this.seeForm.desIp : this.info.desIp
                this.seeForm.desPort = this.seeForm.desPort ? this.seeForm.desPort : this.info.desPort
                this.seeForm.srcIp = this.seeForm.srcIp ? this.seeForm.srcIp : this.info.srcIp
            })
        },
        get_info() {
            let data = {
                queryData: {},
                paramsData: {
                    ip: this.details.desIp
                }
            }
            getAssetsInfo(data).then(res => {
                this.assetsInfo = res
                console.log(res)
            })
        },
        // 资产信息
        get_ycdata() {
            this.tableDataYc = []
            this.get_params1.page = 1
            let data = {
                queryData: {
                    page: this.get_params1.page,
                    pageSize: this.get_params1.size
                },
                paramsData: {
                    ...this.seeForm
                }
            }
            getYcData(data).then(res => {
                this.totalTwo = res.total ? res.total : 0
                this.tableDataYc = res.records
                console.log(res)
            })
        },
        // 获取全部字段
        quanbu() {
            let map = new Map()
            let data = {
                queryData: {},
                paramsData: {}
            }
            getYcField(data).then(res => {
                console.log(res, '全部')
                for (let item of res) {
                    if (!map.has(item.code)) {
                        map.set(item.code, item)
                    }
                }
                this.expandJsonDataList = [...map.values()]
                console.log(this.expandJsonDataList)
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.click-btn {
    cursor: pointer;
    font-size: 12px;
    i {
        margin-right: 5px;
        color: #0052D9;
    }
    span.val {
        color: #0052D9;
    }
}
.click-btn:hover {
    // background: #0d4873;
}
.label{
    width:100px;
    height:30px;
    line-height:30px;
    padding-left:10px;
}
.alarm-device{
    margin-top:10px;
    span{
        font-size: 12px;
        padding:5px 15px;
        border:solid 1px #dcdcdc;
        border-radius: 4px;
        color: rgba(0, 0, 0, 0.9);
        margin-right:10px;
        margin-bottom:10px;
        display:inline-block;
    }
}
.container{
    ::v-deep .el-descriptions-item__label{
                width:100px !important;
                background-color: #EBF1F5 !important;
            }
}
.el-table{
    ::v-deep .el-table__expanded-cell{
        padding:10px !important;
        .container{
            .el-descriptions-item__content{
                width:500px !important;
                height:30px !important;
                font-size:12px !important;
                // background-color: #033254 !important;
                // border: none !important;
                // padding: 0 10px !important;
                // box-shadow: inset 0px 0px 2px rgba(0, 186, 255, 73%) !important;
            }
            .el-descriptions-item__label{
                width:100px !important;
                background-color: #EBF1F5 !important;
                font-weight: 600;
            }
        }
    }
}
.container ::v-deep .el-descriptions__body .el-descriptions__table {
    border-radius: 4px;
    font-weight: 600;
}
.black-theme .container ::v-deep .el-descriptions__body {
    // background: #033254;
    // color: #fff;
}
.black-theme .container ::v-deep .el-descriptions-item__label.is-bordered-label {
    // background: #00466d;
    // color: #fff;
    // box-shadow: inset 0px 0px 2px rgba(0, 186, 255, 0.73);
}
.container ::v-deep .el-descriptions-item__label.is-bordered-label {
    width: 120px;
}
.black-theme .container ::v-deep .el-descriptions .is-bordered .el-descriptions-item__cell {
    // border: 1px solid #1a5c92;
}
.black-theme .container ::v-deep .el-descriptions-row {
    // box-shadow: inset 0px 0px 6px 0px
    // rgba(0, 186, 255, 0.73),
    // inset 0px -1px 0px 0px
    // rgba(40, 82, 124, 0.5) !important;
}
.title{
    font-size: 12px;
    color: #387dee;
    margin-bottom:5px;
}
.el-tabs ::v-deep .el-tabs__nav-wrap::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1px;
    // background-color: rgba(28, 215, 250, 0.2);
    z-index: 1;
}
.el-tabs ::v-deep .el-tabs__active-bar {
    // background: #0052D9;
    // margin-left: 14px;
}
.el-tabs ::v-deep .el-tabs__item.is-active {
    color: #387dee;
    height: 34px;
    line-height: 34px;
    border: none !important;
    box-shadow: none !important;
}
.drawer-pad {
    height: calc(100% - 53px);
    overflow-y: auto;
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
.drawer-pad :deep .el-form-item__content {
    font-size: 12px;
}
.drawer-pad ::v-deep .el-form-item__label{
    font-size: 12px;
    color: #999!important
}
</style>

