<template>
    <div class="ub w100" style="margin-top: 10px;min-height: 400px;">
        <div class="expert-left" :class="{ 'left-fold': leftFold }">
            <i class="fold iconfont icon-zhedie" @click="leftFold = !leftFold"></i>
            <div v-show="!leftFold">
                <div v-if="list.length > 0" class="left-title ub">
                    <div class="left-mark mr-1"></div>
                    <div>已选字段</div>
                </div>
                <div class="left-title" v-if="list.length == 0">可选字段</div>
                <div v-if="list.length > 0" class="left-tip">
                    <i class="el-icon-info"></i>
                    <span>拖拽字段进行排序</span>
                </div>
                <div :style="{ height: heigLeft, 'overflow-y': 'auto' }">
                    <div v-if="list.length > 0" class="w100 drag drag-top mb-1" style="">
                        <draggable
                            class="list-group w100"
                            tag="ul"
                            :disabled="!isCanOption"
                            filter=".forbid"
                            v-model="innerList"
                            v-bind="{ scroll: true, animation: 150 }"
                            :move="onMove"
                            @end="onEnd"
                        >
                            <transition-group>
                                <li
                                    class="list-group-item w100"
                                    :class="element.fieldName === 'alarmTime' || element.fieldName === 'message' ? 'forbid' : ''"
                                    v-for="element in list"
                                    :key="element.fieldName"
                                >
                                    <div class="ub ub-ac list-title">
                                        <div class="vertical-line active"></div>
                                        <div class="open-box" v-if="element.type != 4">
                                            <i
                                                v-if="element.fieldName !== 'alarmTime' && element.fieldName !== 'message' && element.fieldName !== 'isAlarm'"
                                                :class="element.show ? 'el-icon-arrow-down' : 'el-icon-arrow-right'"
                                                @click="top10Show(element)"
                                                aria-hidden="true"
                                            ></i>
                                        </div>
                                        <div class="ub ub-f1 line1" style="font-size:12px;padding-left:10px" :style="{ paddingLeft: element.type == 4 ? '25px' : '' }">
                                            {{ element.name }}
                                        </div>
                                        <div class="close-box" @click="$parent.delFileds(element)"><i class="el-icon-close"></i></div>
                                        <span class="fields-ver-line"></span>
                                    </div>
                                    <div v-if="element.show" class="list-inner"><RankChart :rank-data="rankData" :top-loading="topLoading" :element-data="element" /></div>
                                </li>
                            </transition-group>
                        </draggable>
                    </div>
                    <div class="left-title ub" v-if="listCanSelect.length > 0 && list.length > 0">
                        <div class="left-mark mr-1" style="background-color: #dcdcdc"></div>
                        <div>可选字段</div>
                    </div>
                    <el-input
                        v-if="listCanSelect.length > 0"
                        placeholder="请输入字段"
                        style="width: 180px;margin: 10px 0 0 0px"
                        size="small"
                        v-model="filterCanFields"
                        clearable
                    >
                        <i slot="suffix" class="iconfont icon-sousuo"></i>
                    </el-input>
                    <div class="w100 drag" style="margin-top: 10px;margin-bottom: 40px;max-height: 3000px;">
                        <ul>
                            <li
                                class="list-group-item1 w100"
                                v-for="(element, index) in filterCanFields.trim() ? listCanSelect.filter(it => it.name.includes(filterCanFields.trim())) : listCanSelect"
                                :key="index"
                            >
                                <div class="ub ub-ac list-title">
                                    <div class="vertical-line"></div>
                                    <div class="open-box" v-if="element.type != 4">
                                        <i
                                            v-if="element.fieldName !== 'alarmTime' && element.fieldName !== 'message' && element.fieldName !== 'isAlarm'"
                                            :class="element.show ? 'el-icon-arrow-down' : 'el-icon-arrow-right'"
                                            @click="top10Show(element)"
                                            aria-hidden="true"
                                        ></i>
                                    </div>
                                    <div class="ub ub-f1 line1" style="font-size:12px;padding-left:10px" :style="{ paddingLeft: element.type == 4 ? '25px' : '' }">
                                        {{ element.name }}
                                    </div>
                                    <div class="close-box" @click="$parent.addFileds(element)"><i class="el-icon-plus"></i></div>
                                </div>
                                <div v-if="element.show" class="list-inner"><RankChart :rank-data="rankData" :top-loading="topLoading" :element-data="element" /></div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="ub ub-f1 ub-ver expert-right" style="overflow-x:hidden;">
            <div class="ub ub-pj w100 mb-1">
                <div class="list-tips active">日志查询</div>
                <!-- <div class="pagination pag" style="padding: 0px 0px 10px 0 !important;">
                    <el-pagination
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="$parent.get_params.page"
                        :page-sizes="[30, 50, 100]"
                        :page-size="$parent.get_params.size"
                        layout="slot,sizes, prev, next"
                        prev-text="＜ 上一页"
                        next-text="下一页 ＞"
                    ></el-pagination>
                </div> -->
                <div style="flex:1;text-align:right">
                    <!-- <addBtn style="margin-left: 10px" icon="iconfont icon-faqigaojinganniu" @click="handleAlarm" title="发起事件"/> -->
                    <el-button class="custom-btn" size="small" icon="iconfont icon-sousuotiaojianbaocun" type="primary" @click="handleSaveLogIds" style="border-radius: 4px;">暂 存</el-button>
                    <el-button class="custom-btn" size="small" icon="iconfont icon-zancunliebiao" type="primary" @click="handleSaveList" style="border-radius: 4px;">暂存列表</el-button>
                    <!-- <addBtn @click="createAllPackTask" style="margin-left: 10px" icon="iconfont icon-tianjia" title="创建PCAP包任务" /> -->
                    <el-dropdown trigger="click" @command="handleCommand">
                        <span class="el-dropdown-link">
                            <el-button style="margin-left: 10px;border-radius: 4px;" :loading="downLoading" size="small" icon="iconfont icon-daochu" type="primary">导 出</el-button>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="0">导出json</el-dropdown-item>
                            <el-dropdown-item command="1">导出excel</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-button class="custom-btn-two" style="margin-left: 10px;border-radius: 4px;" size="small" icon="iconfont icon-shezhi" type="primary" @click="$parent.highlightDialog = true">配置高亮词</el-button>
                    <!--<addBtn icon="el-icon-download" title="下载任务" @click="downloadFun" />-->
                    <!--<addBtn style="margin-left:10px;" icon="el-icon-box" title="创建PCAP包任务" @click="createAllPackTask" />-->
                </div>
            </div>
            <div :style="{ height: heigRight, 'overflow-y': 'auto' }">
                <el-table
                    :row-class-name="tableRowClassName"
                    style="width:100%;"
                    ref="multipleTable"
                    class="bigTable expert-table"
                    :row-key="
                        row => {
                            return row.id
                        }
                    "
                    :data="tableData"
                    border
                    stripe
                    tooltip-effect="dark"
                    :row-style="{ height: '32px' }"
                    :header-row-style="{ height: '32px' }"
                    @sort-change="changeTableSort"
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column align="center" :reserve-selection="true" type="selection" width="50"></el-table-column>
                    <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号"></el-table-column>
                    <el-table-column
                        v-for="(item, index) in tableList"
                        :key="index"
                        :label="item.name"
                        min-width="140"
                        :sortable="item.type === 3 || item.type === 2"
                        show-overflow-tooltip
                        :prop="item.fieldName"
                    >
                        <template slot-scope="scope">
                            <div>
                                <el-popover popper-class="add-search" placement="bottom" title="" trigger="click">
                                    <div>
                                        <p
                                            v-if="item.fieldName !== 'message' && item.fieldName !== 'dt'"
                                            class="ub ub-ac click-btn"
                                            @click="
                                                equalVal({
                                                    key: item.fieldName,
                                                    attrType: item.type,
                                                    name: item.name,
                                                    value:
                                                        item.fieldName == 'requestTimeNs' || item.fieldName == 'responseTimeNs'
                                                            ? scope.row[item.fieldName + '1']
                                                            : scope.row[item.fieldName]
                                                })
                                            "
                                        >
                                            <i class="el-icon-plus"></i>
                                            <span>{{ item.name }}</span>
                                            <span>=</span>
                                            <span class="val">{{ scope.row[item.fieldName] }}</span>
                                        </p>
                                        <p
                                            v-if="item.fieldName !== 'message' && item.fieldName !== 'dt'"
                                            class="ub ub-ac click-btn"
                                            style="margin: 10px 0"
                                            @click="
                                                unequalVal({
                                                    key: item.fieldName,
                                                    attrType: item.type,
                                                    name: item.name,
                                                    value:
                                                        item.fieldName == 'requestTimeNs' || item.fieldName == 'responseTimeNs'
                                                            ? scope.row[item.fieldName + '1']
                                                            : scope.row[item.fieldName]
                                                })
                                            "
                                        >
                                            <i class="el-icon-plus"></i>
                                            <span>{{ item.name }}</span>
                                            <span>&lt;&gt;</span>
                                            <span class="val">{{ scope.row[item.fieldName] }}</span>
                                        </p>
                                        <p
                                            @click="item.visible = false"
                                            class="ub ub-ac click-btn"
                                            v-clipboard:copy="
                                                String(
                                                    item.fieldName == 'requestTimeNs' || item.fieldName == 'responseTimeNs'
                                                        ? scope.row[item.fieldName + '1']
                                                        : scope.row[item.fieldName]
                                                )
                                            "
                                            v-clipboard:success="firstCopySuccess"
                                            v-clipboard:error="firstCopyError"
                                        >
                                            <i class="el-icon-document-copy"></i>
                                            <span>复制</span>
                                        </p>
                                        <p
                                            style="margin-top:10px"
                                            v-if="['ip'].some(keyWord => item.fieldName.toLowerCase().includes(keyWord))"
                                            @click="jumpAsset(scope.row[item.fieldName])"
                                            class="ub ub-ac click-btn"
                                        >
                                            <i class="iconfont icon-chaxunzichan" style="font-size:12px"></i>
                                            <span>查询资产</span>
                                        </p>
                                        <p
                                            style="margin-top:10px"
                                            v-if="['ip', 'url', '域名'].some(keyWord => item.fieldName.toLowerCase().includes(keyWord))"
                                            @click="jumpThreat(scope.row[item.fieldName])"
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
                                        :style="
                                            ['ip', 'url', '域名'].some(keyWord => item.fieldName.toLowerCase().includes(keyWord))
                                                ? 'cursor: pointer; text-decoration: underline; color: #0052D9;'
                                                : 'cursor: default; text-decoration: unset; color: #191919;'
                                        "
                                        slot="reference"
                                        v-html="scope.row[item.fieldName]"
                                    ></p>
                                </el-popover>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="220" fixed="right" class-name="deepBg">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="handleSee(scope.row)">查看</el-button>
                            <el-button type="text" size="small" @click="hanleSave(scope.row)">暂存</el-button>
                            <!-- <opt-btn icon="iconfont icon-chakan1" :disabled="scope.row.nftData===2" title="查看PCAP包" @click="lookPcac(scope.row)"></opt-btn> -->
                            <!-- <opt-btn icon="el-icon-loading" v-if="scope.row.nftData===1" title="加载中"></opt-btn> -->
                            <el-button  @click="createPackTask(scope.row)" type="text" size="small">下载PCAP包任务</el-button>
                            <!-- <opt-btn icon="iconfont icon-fasong" title="发起事件" @click="changeOption(scope.row)"></opt-btn> -->
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div v-show="tableData.length>0" class="pagination pag" style="padding: 0px !important;text-align: right;">
                <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="$parent.get_params.page"
                    :page-sizes="[30,50,100]"
                    :page-size="$parent.get_params.size"
                    layout="slot,sizes, prev, next"
                    prev-text="＜ 上一页"
                    next-text="下一页 ＞"></el-pagination>
            </div>
        </div>
        <el-dialog title="提示" :visible.sync="createTaskDialog" width="30%" custom-class="attendance-dialog">
            <span>确定下载PCAP包任务吗？</span>
            <span slot="footer" class="dialog-footer">
                <Debounce :time="3000" :isDebounce="2">
                    <el-button size="small" type="primary" @click.native="createTaskConfim">确 定</el-button>
                </Debounce>
                <el-button size="small" @click="createTaskDialog = false">取消</el-button>
            </span>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="createAllTaskDialog" width="30%" custom-class="attendance-dialog">
            <span>确定下载所选PCAP包任务吗？</span>
            <span slot="footer" class="dialog-footer">
                <Debounce :time="3000" :isDebounce="2">
                    <el-button size="small" type="primary" @click.native="createAllTaskConfim">确 定</el-button>
                </Debounce>
                <el-button size="small" @click="createAllTaskDialog = false">取 消</el-button>
            </span>
        </el-dialog>
        <el-dialog title="查看" :visible.sync="seeTaskDialog" width="50%" custom-class="common-dialog" class="see-dialog" style="overflow-x:hidden">
            <div class="container see" v-if="seeTaskDialog">
                <el-button style="margin-bottom:10px;float:right" size="small" type="primary" @click="createPackTask()">下载PCAP包任务</el-button>
                <div class="title" style="margin-top:30px">连接信息</div>
                <el-descriptions size="mini" title="" :column="2" border>
                    <el-descriptions-item label="标题">{{ seeDetail.title }}</el-descriptions-item>
                    <el-descriptions-item label="日期">{{ seeDetail.date }}</el-descriptions-item>
                    <el-descriptions-item label="客户端IP">
                        <el-popover popper-class="add-search" placement="bottom" title="" trigger="click">
                            <div>
                                <p @click="jumpAsset(seeDetail.clientIp)" class="ub ub-ac click-btn">
                                    <i class="iconfont icon-chaxunzichan" style="font-size:12px"></i>
                                    <span>查询资产</span>
                                </p>
                                <p style="margin-top:10px" @click="jumpThreat(seeDetail.clientIp)" class="ub ub-ac click-btn">
                                    <i class="iconfont icon-chaxunqingbao" style="font-size:12px"></i>
                                    <span>查询情报</span>
                                </p>
                            </div>
                            <p class="highlighted" style="cursor: pointer; text-decoration: underline; color: #03a5dd; display: inline-block;" slot="reference">
                                <i
                                    v-if="seeDetail.clientIpIsSpite != '内网' && seeDetail.clientIp"
                                    class="iconfont"
                                    :style="{
                                        color: [{ type: '安全', color: '#00ff48' }, { type: '恶意', color: '#ff0000' }, { type: '未知', color: '#7c7c7c' }].filter(
                                            co => co.type == seeDetail.clientIpIsSpite
                                        )[0].color
                                    }"
                                    :title="seeDetail.clientIpIsSpite"
                                    :class="{
                                        'icon-liebiaonei-anquan': seeDetail.clientIpIsSpite == '安全',
                                        'icon-liebiaonei-buanquan': seeDetail.clientIpIsSpite == '恶意',
                                        'icon-liebiaonei-weizhi': seeDetail.clientIpIsSpite == '未知'
                                    }"
                                ></i>
                                {{ seeDetail.clientIp }}
                            </p>
                            <!-- <p style="cursor: pointer; text-decoration: underline; color: #03a5dd;" slot="reference" v-html="seeDetail.clientIp"></p> -->
                        </el-popover>
                    </el-descriptions-item>
                    <el-descriptions-item label="客户端IP(ipv6)">
                        <el-popover popper-class="add-search" placement="bottom" title="" trigger="click">
                            <div>
                                <p @click="jumpAsset(seeDetail.clientIpV6)" class="ub ub-ac click-btn">
                                    <i class="iconfont icon-chaxunzichan" style="font-size:12px"></i>
                                    <span>查询资产</span>
                                </p>
                                <p style="margin-top:10px" @click="jumpThreat(seeDetail.clientIpV6)" class="ub ub-ac click-btn">
                                    <i class="iconfont icon-chaxunqingbao" style="font-size:12px"></i>
                                    <span>查询情报</span>
                                </p>
                            </div>
                            <p class="highlighted" style="cursor: pointer; text-decoration: underline; color: #03a5dd; display: inline-block;" slot="reference">
                                <i
                                    v-if="seeDetail.clientIpV6IsSpite != '内网' && seeDetail.clientIpV6"
                                    class="iconfont"
                                    :style="{
                                        color: [{ type: '安全', color: '#00ff48' }, { type: '恶意', color: '#ff0000' }, { type: '未知', color: '#7c7c7c' }].filter(
                                            co => co.type == seeDetail.clientIpV6IsSpite
                                        )[0].color
                                    }"
                                    :title="seeDetail.clientIpV6IsSpite"
                                    :class="{
                                        'icon-liebiaonei-anquan': seeDetail.clientIpV6IsSpite == '安全',
                                        'icon-liebiaonei-buanquan': seeDetail.clientIpV6IsSpite == '恶意',
                                        'icon-liebiaonei-weizhi': seeDetail.clientIpV6IsSpite == '未知'
                                    }"
                                ></i>
                                {{ seeDetail.clientIpV6 }}
                            </p>
                            <!-- <p style="cursor: pointer; text-decoration: underline; color: #03a5dd;" slot="reference" v-html="seeDetail.clientIpV6"></p> -->
                        </el-popover>
                    </el-descriptions-item>
                    <el-descriptions-item label="客户端端口">{{ seeDetail.clientPort }}</el-descriptions-item>
                    <el-descriptions-item label="服务器IP">
                        <el-popover popper-class="add-search" placement="bottom" title="" trigger="click">
                            <div>
                                <p @click="jumpAsset(seeDetail.serverIp)" class="ub ub-ac click-btn">
                                    <i class="iconfont icon-chaxunzichan" style="font-size:12px"></i>
                                    <span>查询资产</span>
                                </p>
                                <p style="margin-top:10px" @click="jumpThreat(seeDetail.serverIp)" class="ub ub-ac click-btn">
                                    <i class="iconfont icon-chaxunqingbao" style="font-size:12px"></i>
                                    <span>查询情报</span>
                                </p>
                            </div>
                            <p class="highlighted" style="cursor: pointer; text-decoration: underline; color: #03a5dd; display: inline-block;" slot="reference">
                                <i
                                    v-if="seeDetail.serverIpIpIsSpite != '内网' && seeDetail.serverIp"
                                    class="iconfont"
                                    :style="{
                                        color: [{ type: '安全', color: '#00ff48' }, { type: '恶意', color: '#ff0000' }, { type: '未知', color: '#7c7c7c' }].filter(
                                            co => co.type == seeDetail.serverIpIsSpite
                                        )[0].color
                                    }"
                                    :title="seeDetail.serverIpIsSpite"
                                    :class="{
                                        'icon-liebiaonei-anquan': seeDetail.serverIpIsSpite == '安全',
                                        'icon-liebiaonei-buanquan': seeDetail.serverIpIsSpite == '恶意',
                                        'icon-liebiaonei-weizhi': seeDetail.serverIpIsSpite == '未知'
                                    }"
                                ></i>
                                {{ seeDetail.serverIp }}
                            </p>
                            <!-- <p style="cursor: pointer; text-decoration: underline; color: #03a5dd;" slot="reference" v-html="seeDetail.serverIp"></p> -->
                        </el-popover>
                    </el-descriptions-item>
                    <el-descriptions-item label="服务器IP(ipv6)">
                        <el-popover popper-class="add-search" placement="bottom" title="" trigger="click">
                            <div>
                                <p @click="jumpAsset(seeDetail.serverIpV6)" class="ub ub-ac click-btn">
                                    <i class="iconfont icon-chaxunzichan" style="font-size:12px"></i>
                                    <span>查询资产</span>
                                </p>
                                <p style="margin-top:10px" @click="jumpThreat(seeDetail.serverIpV6)" class="ub ub-ac click-btn">
                                    <i class="iconfont icon-chaxunqingbao" style="font-size:12px"></i>
                                    <span>查询情报</span>
                                </p>
                            </div>
                            <p class="highlighted" style="cursor: pointer; text-decoration: underline; color: #03a5dd; display: inline-block;" slot="reference">
                                <i
                                    v-if="seeDetail.serverIpV6IsSpite != '内网' && seeDetail.serverIpV6"
                                    class="iconfont"
                                    :style="{
                                        color: [{ type: '安全', color: '#00ff48' }, { type: '恶意', color: '#ff0000' }, { type: '未知', color: '#7c7c7c' }].filter(
                                            co => co.type == seeDetail.serverIpV6IsSpite
                                        )[0].color
                                    }"
                                    :title="seeDetail.serverIpV6IsSpite"
                                    :class="{
                                        'icon-liebiaonei-anquan': seeDetail.serverIpV6IsSpite == '安全',
                                        'icon-liebiaonei-buanquan': seeDetail.serverIpV6IsSpite == '恶意',
                                        'icon-liebiaonei-weizhi': seeDetail.serverIpV6IsSpite == '未知'
                                    }"
                                ></i>
                                {{ seeDetail.serverIpV6 }}
                            </p>
                            <!-- <p style="cursor: pointer; text-decoration: underline; color: #03a5dd;" slot="reference" v-html="seeDetail.serverIpV6"></p> -->
                        </el-popover>
                    </el-descriptions-item>
                    <el-descriptions-item label="服务器端口">{{ seeDetail.serverPort }}</el-descriptions-item>
                    <el-descriptions-item label="请求时间">{{ seeDetail.requestTimeNs | formatText }}</el-descriptions-item>
                    <el-descriptions-item label="响应时间">{{ seeDetail.responseTimeNs | formatText }}</el-descriptions-item>
                    <el-descriptions-item label="状态码">{{ seeDetail.responseStatusCode }}</el-descriptions-item>
                    <el-descriptions-item label="请求全URL">
                        <el-popover popper-class="add-search" placement="bottom" title="" trigger="click">
                            <div>
                                <p @click="jumpAsset(seeDetail.requestFullUrl)" class="ub ub-ac click-btn">
                                    <i class="iconfont icon-chaxunzichan" style="font-size:12px"></i>
                                    <span>查询资产</span>
                                </p>
                                <p style="margin-top:10px" @click="jumpThreat(seeDetail.requestFullUrl)" class="ub ub-ac click-btn">
                                    <i class="iconfont icon-chaxunqingbao" style="font-size:12px"></i>
                                    <span>查询情报</span>
                                </p>
                            </div>
                            <p style="cursor: pointer; text-decoration: underline; color: #03a5dd;" slot="reference" v-html="seeDetail.requestFullUrl"></p>
                        </el-popover>
                    </el-descriptions-item>
                    <el-descriptions-item label="分析设备ID">{{ seeDetail.deviceId }}</el-descriptions-item>
                    <el-descriptions-item label="kafkakey">{{ seeDetail.kafkakey }}</el-descriptions-item>
                    <el-descriptions-item label="链路ID">{{ seeDetail.probeIds }}</el-descriptions-item>
                </el-descriptions>
                <div class="title" style="margin-top:10px;">请求头</div>
                <el-descriptions size="mini" title="" :column="1" border>
                    <el-descriptions-item label="请求url" v-if="seeDetail.requestUrl">{{ seeDetail.requestUrl }}</el-descriptions-item>
                    <el-descriptions-item label="请求主机信息" v-if="seeDetail.requestHost">{{ seeDetail.requestHost }}</el-descriptions-item>
                    <el-descriptions-item label="请求客户端代理信息" v-if="seeDetail.requestUserAgent">{{ seeDetail.requestUserAgent }}</el-descriptions-item>
                    <el-descriptions-item label="请求内容类型" v-if="seeDetail.requestContentType">{{ seeDetail.requestContentType }}</el-descriptions-item>
                    <el-descriptions-item label="请求cookie" v-if="seeDetail.requestCookie">{{ seeDetail.requestCookie }}</el-descriptions-item>
                    <el-descriptions-item label="访问来源" v-if="seeDetail.requestReferer">{{ seeDetail.requestReferer }}</el-descriptions-item>
                    <el-descriptions-item label="请求链接信息" v-if="seeDetail.requestConnection">{{ seeDetail.requestConnection }}</el-descriptions-item>
                    <el-descriptions-item label="请求接收协议" v-if="seeDetail.requestAcceptCharset">{{ seeDetail.requestAcceptCharset }}</el-descriptions-item>
                    <el-descriptions-item label="请求接受编码" v-if="seeDetail.requestAcceptEncoding">{{ seeDetail.requestAcceptEncoding }}</el-descriptions-item>
                    <el-descriptions-item label="请求接受语言" v-if="seeDetail.requestAcceptLanguage">{{ seeDetail.requestAcceptLanguage }}</el-descriptions-item>
                    <el-descriptions-item label="请求内容长度" v-if="seeDetail.requestContentLength">{{ seeDetail.requestContentLength }}</el-descriptions-item>
                    <el-descriptions-item label="请求代理认证" v-if="seeDetail.requestProxyAuthorization">{{ seeDetail.requestProxyAuthorization }}</el-descriptions-item>
                    <el-descriptions-item label="请求通道" v-if="seeDetail.requestVia">{{ seeDetail.requestVia }}</el-descriptions-item>
                    <el-descriptions-item label="requestRang" v-if="seeDetail.requestRang">{{ seeDetail.requestRang }}</el-descriptions-item>
                    <el-descriptions-item label="requestIFRANG" v-if="seeDetail.requestIfRang">{{ seeDetail.requestIfRang }}</el-descriptions-item>
                    <!-- <el-descriptions-item label="请求负载" v-if="seeDetail.requestPayload">{{seeDetail.requestPayload}}</el-descriptions-item> -->
                    <el-descriptions-item label="同Id" v-if="seeDetail.requestId">{{ seeDetail.requestId }}</el-descriptions-item>
                    <el-descriptions-item label="请求认证信息" v-if="seeDetail.requestAuth">{{ seeDetail.requestAuth }}</el-descriptions-item>
                    <el-descriptions-item label="请求接收类型" v-if="seeDetail.requestAccept">{{ seeDetail.requestAccept }}</el-descriptions-item>
                    <el-descriptions-item label="HTTP请求类型" v-if="seeDetail.requestMethod">{{ seeDetail.requestMethod }}</el-descriptions-item>
                    <el-descriptions-item label="请求其他数据" v-if="seeDetail.requestOtherData">{{ seeDetail.requestOtherData }}</el-descriptions-item>
                    <el-descriptions-item label="请求转发" v-if="seeDetail.requestXForwardedFor">{{ seeDetail.requestXForwardedFor }}</el-descriptions-item>
                    <el-descriptions-item label="错误信息" v-if="seeDetail.errorInfo">{{ seeDetail.errorInfo }}</el-descriptions-item>
                    <el-descriptions-item label="请求协议组" v-if="seeDetail.requestClass">{{ seeDetail.requestClass }}</el-descriptions-item>
                    <el-descriptions-item label="请求域名" v-if="seeDetail.requestDomain">{{ seeDetail.requestDomain }}</el-descriptions-item>
                </el-descriptions>
                <div class="title" style="margin-top:10px;">请求负载</div>
                <div class="box" v-if="seeDetail.requestPayload">{{ seeDetail.requestPayload }}</div>
                <div class="title" style="margin-top:10px;">响应头</div>
                <el-descriptions size="mini" title="" :column="1" border>
                    <el-descriptions-item label="响应版本号" v-if="seeDetail.responseVersion">{{ seeDetail.responseVersion }}</el-descriptions-item>
                    <el-descriptions-item label="响应状态码" v-if="seeDetail.responseStatusCode">{{ seeDetail.responseStatusCode }}</el-descriptions-item>
                    <el-descriptions-item label="响应服务" v-if="seeDetail.responseServer">{{ seeDetail.responseServer }}</el-descriptions-item>
                    <el-descriptions-item label="响应设置COOKIE" v-if="seeDetail.responseSetCookie">{{ seeDetail.responseSetCookie }}</el-descriptions-item>
                    <el-descriptions-item label="响应内容类型" v-if="seeDetail.responseContentType">{{ seeDetail.responseContentType }}</el-descriptions-item>
                    <el-descriptions-item label="响应链接信息" v-if="seeDetail.responseConnection">{{ seeDetail.responseConnection }}</el-descriptions-item>
                    <el-descriptions-item label="响应内容长度" v-if="seeDetail.responseContentLength">{{ seeDetail.responseContentLength }}</el-descriptions-item>
                    <el-descriptions-item label="响应内容配置" v-if="seeDetail.responseContentDisposition">{{ seeDetail.responseContentDisposition }}</el-descriptions-item>
                    <el-descriptions-item label="响应内容编码" v-if="seeDetail.responseContentEncoding">{{ seeDetail.responseContentEncoding }}</el-descriptions-item>
                    <el-descriptions-item label="响应重定向" v-if="seeDetail.responseLocation">{{ seeDetail.responseLocation }}</el-descriptions-item>
                    <el-descriptions-item label="响应代理认证" v-if="seeDetail.responseProxyAuthorization">{{ seeDetail.responseProxyAuthorization }}</el-descriptions-item>
                    <el-descriptions-item label="响应通道" v-if="seeDetail.responseVia">{{ seeDetail.responseVia }}</el-descriptions-item>
                    <el-descriptions-item label="认证网站" v-if="seeDetail.responseWwwAuthorization">{{ seeDetail.responseWwwAuthorization }}</el-descriptions-item>
                    <el-descriptions-item label="响应其他数据" v-if="seeDetail.responseOtherData">{{ seeDetail.responseOtherData }}</el-descriptions-item>
                    <!-- <el-descriptions-item label="响应负载" v-if="seeDetail.responsePayload">{{seeDetail.responsePayload}}</el-descriptions-item> -->
                    <el-descriptions-item label="响应ttl" v-if="seeDetail.responseTtl">{{ seeDetail.responseTtl }}</el-descriptions-item>
                    <el-descriptions-item label="响应别名" v-if="seeDetail.responseCName">{{ seeDetail.responseCName }}</el-descriptions-item>
                    <el-descriptions-item label="响应计数" v-if="seeDetail.responseCount">{{ seeDetail.responseCount }}</el-descriptions-item>
                </el-descriptions>
                <div class="title" style="margin-top:10px;">响应负载</div>
                <div class="box" v-if="seeDetail.responsePayload">{{ seeDetail.responsePayload }}</div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import VueClipBoard from 'vue-clipboard2'
import _ from 'loadsh'
import draggable from 'vuedraggable'
import RankChart from '@/pages/stream_data_center/data_manage/components/chart/RankChart'
import EventBus from '@/assets/js/bus'
import axios from 'axios'
import {
    getExpandLog,
    // saveLogIds,
    createTask,
    viewPcap
} from '@/server/data_manage/new_search'
import { get_threat_search } from '@/server/intelligence/api.js'
import { getLogById, saveLogStorage, getKey, downloadLogPacket, getMenace } from '@/server/stream_data_center/data_manage.js'
export default {
    name: 'TableContent',
    inject: ['indexTypeData'],
    components: {
        RankChart,
        draggable
    },
    props: {
        startTime: {
            default() {
                return ''
            }
        },
        endTime: {
            default() {
                return ''
            }
        },
        listAll: {
            default() {
                return []
            }
        },
        list: {
            default() {
                return []
            }
        },
        listCanSelect: {
            default() {
                return []
            }
        },
        tableData: {
            default() {
                return []
            }
        },
        keywords: {
            default() {
                return ''
            }
        },
        rankData: {
            default() {
                return []
            }
        },
        topLoading: {
            default: false
        },
        viewChartOpen: {
            default: false
        }
    },
    data() {
        return {
            downLoading: false,
            leftFold: false,
            tabsValue: '',
            pacpData: [],
            createTaskId: '',
            createAllTaskDialog: false,
            createTaskDialog: false,
            highColor: ['#ff0000', '#ea00ff', '#ffd200', '#00ff06', '#ff4aca', '#3888ff', '#ff8400', '#7e00ff', '#00ffea', '#aeff00'],
            isCanOption: true,
            // listAll: [],
            // listCanSelect: [],
            // list: [],
            filterCanFields: '',
            innerList: [],
            editable: true,
            isDragging: false,
            delayedDragging: false,
            expandRowKeys: [],
            expandData: [],
            expandJsonData: [],
            get_params: {
                // page: 1,
                // size: 100,
                // content: '',
                // startTime: '',
                // endTime: '',
                // dt_type: '',
                // dt: null,
                // dstIpType: '',
                // dstPortType: '',
                // srcIpType: '',
                // srcPortType: '',
                // protocolType: '',
                // desIp: '',
                // desPort: '',
                // srcIp: '',
                // srcPort: '',
                // protocol: ''
            },
            loading: false,
            total_num: 0,
            total__count: 0,
            // tableData: [],
            multipleSelection: [],
            sayTimes: null,
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
            seeTaskDialog: false,
            seeDetail: {
                clientIp: '',
                clientPort: '',
                serverIp: '',
                serverPort: '',
                requestTimeNs: '',
                responseTimeNs: '',
                title: '',
                requestFullUrl: '',
                requestPayload: '',
                requestOtherData: '',
                requestIfRang: '',
                requestRang: '',
                requestVia: '',
                requestProxyAuthorization: '',
                requestContentLength: '',
                requestAcceptLanguage: '',
                requestAcceptEncoding: '',
                requestAcceptCharset: '',
                requestConnection: '',
                requestReferer: '',
                requestCookie: '',
                requestContentType: '',
                requestUserAgent: '',
                requestUrl: '',
                requestHost: '',
                responseVersion: '',
                responseStatusCode: '',
                responseServer: '',
                responseSetCookie: '',
                responseContentType: '',
                responseConnection: '',
                responseContentLength: '',
                responseContentDisposition: '',
                responseContentEncoding: '',
                responseLocation: '',
                responseProxyAuthorization: '',
                responseVia: '',
                responseWwwAuthorization: '',
                responseOtherData: '',
                responsePayload: '',
                id: '',
                date: '',
                deviceId: '',
                kafkakey: '',
                probeIds: '',
                requestId: '',
                clientIpV6: '',
                serverIpV6: '',
                requestAuth: '',
                requestAccept: '',
                requestXForwardedFor: '',
                errorInfo: '',
                responseTtl: '',
                requestClass: '',
                requestDomain: '',
                responseCName: '',
                responseCount: ''
            },
            keyDetail: '',
            heigRight: 'calc(100vh - 350px)',
            heigLeft: 'calc(100vh - 315px)'
        }
    },
    computed: {
        tableList() {
            console.log('this.list', this.list)
            return this.list.length > 0 ? this.list : [{ fieldName: 'id', name: 'ID' }]
        },
        // exportUrl() {
        //     let startTime = this.sayTimes === null ? '' : this.sayTimes[0]
        //     let endTime = this.sayTimes === null ? '' : this.sayTimes[1]
        //     return 'data_center/manage/syslog/export?type=0&dtArr=' + this.get_params.dt + '&content=' + this.get_params.content +
        //         '&startTime=' + startTime + '&endTime=' + endTime
        // },
        // exportUrl1() {
        //     let startTime = this.sayTimes === null ? '' : this.sayTimes[0]
        //     let endTime = this.sayTimes === null ? '' : this.sayTimes[1]
        //     return 'data_center/manage/syslog/export?type=1&dtArr=' + this.get_params.dt + '&content=' + this.get_params.content +
        //         '&startTime=' + startTime + '&endTime=' + endTime
        // },
        dragOptions() {
            return {
                animation: 100
            }
        },

        listString() {
            return JSON.stringify(this.list, null, 2)
        }
    },
    watch: {
        viewChartOpen(val) {
            if (val) {
                this.heigRight = 'calc(100vh - 500px)'
                this.heigLeft = 'calc(100vh - 415px)'
            } else {
                this.heigRight = 'calc(100vh - 350px)'
                this.heigLeft = 'calc(100vh - 315px)'
            }
        },
        // list: {
        //     handler(newVal, oldVal) {
        //         let arr = []
        //         this.listAll.map(item => {
        //             if (!newVal.some(_item => item.fieldName === _item.fieldName)) {
        //                 arr.push(item)
        //             }
        //         })
        //         this.listCanSelect = this.$deepCopy(arr)
        //     },
        //     // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
        //     immediate: true
        // },
        list: {
            handler(newVal) {
                this.innerList = _.cloneDeep(newVal)
            },
            immediate: true
        },
        innerList: {
            handler(newVal) {
                if (JSON.stringify(newVal) !== JSON.stringify(this.list)) {
                    this.$parent.list = _.cloneDeep(newVal)
                }
            }
        },
        isDragging(newValue) {
            if (newValue) {
                this.delayedDragging = true
                return
            }
            this.$nextTick(() => {
                this.delayedDragging = false
            })
        }
    },
    mounted() {},
    filters: {
        formatText(val) {
            var moment = require('moment')
            console.log(Number(String(val).substring(0, String(val).length - 6)))
            return moment(Number(String(val).substring(0, String(val).length - 6))).format('YYYY-MM-DD HH:mm:ss')
            // return new Date(Number(String(val).substring(0, String(val).length - 6)))
        }
    },
    methods: {
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex % 2) {
                return 'table-row2'
            } else {
                return 'table-row1'
            }
        },
        handleSee(row) {
            // setTimeout(() => {
            //     this.seeTaskDialog = true
            // }, 500)
            let data = {
                queryData: {},
                paramsData: {
                    id: row.id,
                    indexType: this.indexTypeData,
                    startTime: this.startTime,
                    endTime: this.endTime
                }
            }
            getLogById(data).then(async res => {
                this.seeDetail.clientIp = res.clientIp
                if (res.clientIp) {
                    try {
                        let clientIpIsSpite = await getMenace({
                            queryData: {
                                value: res.clientIp
                            }
                        })
                        this.seeDetail.clientIpIsSpite = clientIpIsSpite
                    } catch (e) {
                        console.log(e)
                    }
                }
                this.seeDetail.clientPort = res.clientPort
                this.seeDetail.serverIp = res.serverIp
                if (res.serverIp) {
                    try {
                        let serverIpIsSpite = await getMenace({
                            queryData: {
                                value: res.serverIp
                            }
                        })
                        this.seeDetail.serverIpIsSpite = serverIpIsSpite
                    } catch (e) {
                        console.log(e)
                    }
                }
                this.seeDetail.serverPort = res.serverPort
                this.seeDetail.requestTimeNs = res.requestTimeNs
                this.seeDetail.responseTimeNs = res.responseTimeNs
                this.seeDetail.title = res.title
                this.seeDetail.requestFullUrl = res.requestFullUrl
                this.seeDetail.requestPayload = res.requestPayload
                this.seeDetail.requestOtherData = res.requestOtherData
                this.seeDetail.requestIfRang = res.requestIfRang
                this.seeDetail.requestRang = res.requestRang
                this.seeDetail.requestVia = res.requestVia
                this.seeDetail.requestProxyAuthorization = res.requestProxyAuthorization
                this.seeDetail.requestContentLength = res.requestContentLength
                this.seeDetail.requestAcceptLanguage = res.requestAcceptLanguage
                this.seeDetail.requestAcceptEncoding = res.requestAcceptEncoding
                this.seeDetail.requestAcceptCharset = res.requestAcceptCharset
                this.seeDetail.requestConnection = res.requestConnection
                this.seeDetail.requestReferer = res.requestReferer
                this.seeDetail.requestCookie = res.requestCookie
                this.seeDetail.requestContentType = res.requestContentType
                this.seeDetail.requestUserAgent = res.requestUserAgent
                this.seeDetail.requestUrl = res.requestUrl
                this.seeDetail.requestHost = res.requestHost
                this.seeDetail.responseVersion = res.responseVersion
                this.seeDetail.responseStatusCode = res.responseStatusCode
                this.seeDetail.responseServer = res.responseServer
                this.seeDetail.responseSetCookie = res.responseSetCookie
                this.seeDetail.responseContentType = res.responseContentType
                this.seeDetail.responseConnection = res.responseConnection
                this.seeDetail.responseContentLength = res.responseContentLength
                this.seeDetail.responseContentDisposition = res.responseContentDisposition
                this.seeDetail.responseContentEncoding = res.responseContentEncoding
                this.seeDetail.responseLocation = res.responseLocation
                this.seeDetail.responseProxyAuthorization = res.responseProxyAuthorization
                this.seeDetail.responseVia = res.responseVia
                this.seeDetail.responseWwwAuthorization = res.responseWwwAuthorization
                this.seeDetail.responseOtherData = res.responseOtherData
                this.seeDetail.responsePayload = res.responsePayload
                this.seeDetail.id = res.id
                this.seeDetail.date = res.date
                this.seeDetail.deviceId = res.deviceId
                this.seeDetail.kafkakey = res.kafkakey
                this.seeDetail.probeIds = res.probeIds
                this.seeDetail.requestId = res.requestId
                this.seeDetail.clientIpV6 = res.clientIpV6
                if (res.clientIpV6) {
                    try {
                        let clientIpV6IsSpite = await getMenace({
                            queryData: {
                                value: res.clientIpV6
                            }
                        })
                        this.seeDetail.clientIpV6IsSpite = clientIpV6IsSpite
                    } catch (e) {
                        console.log(e)
                    }
                }
                this.seeDetail.serverIpV6 = res.serverIpV6
                if (res.serverIpV6) {
                    try {
                        let serverIpV6IsSpite = await getMenace({
                            queryData: {
                                value: res.serverIpV6
                            }
                        })
                        this.seeDetail.serverIpV6IsSpite = serverIpV6IsSpite
                    } catch (e) {
                        console.log(e)
                    }
                }
                this.seeDetail.requestAuth = res.requestAuth
                this.seeDetail.requestAccept = res.requestAccept
                this.seeDetail.requestXForwardedFor = res.requestXForwardedFor
                this.seeDetail.errorInfo = res.errorInfo
                this.seeDetail.responseTtl = res.responseTtl
                this.seeDetail.requestClass = res.requestClass
                this.seeDetail.requestDomain = res.requestDomain
                this.seeDetail.responseCName = res.responseCName
                this.seeDetail.responseCount = res.responseCount

                this.seeTaskDialog = true
            })
        },
        jumpAsset(value) {
            this.$setsessionStorage('currentPath', '/assets/assets_asset_info?ip=' + value)
            window.open(window.location.origin + '/#' + '/assets/assets_asset_info?ip=' + value)
        },
        jumpThreat(value) {
            let obj = {
                queryData: {
                    value
                },
                paramsData: {}
            }
            get_threat_search(obj)
                .then(res => {
                    console.log(res)
                    this.$setsessionStorage('search-item', res)
                    let route = this.$router.resolve({
                        name: 'intelligence_threat_detail',
                        query: {
                            searchStr: value
                        }
                    })
                    window.open(route.href, '_blank')
                })
                .catch(err => {
                    console.log(err + 'err')
                })
        },
        handleSaveList() {
            this.$parent.saveListDialog = true
        },
        handleCommand(command) {
            this.$emit('handleDownload', command, this.multipleSelection)
        },
        createAllPackTask() {
            if (this.multipleSelection.length === 0) {
                this.$message({
                    message: '请先选择数据！',
                    type: 'warning'
                })
                return
            }
            this.createAllTaskDialog = true
        },
        createAllTaskConfim() {
            let sysLogList = []
            sysLogList = this.multipleSelection.map(item => {
                return {
                    srcIp: item.srcIp,
                    desIp: item.desIp,
                    srcPort: item.srcPort,
                    desPort: item.desPort,
                    aDate: item.aDate,
                    logId: item.logId
                }
            })
            let data = {
                queryData: {},
                paramsData: {
                    sysLogList: sysLogList
                }
            }
            createTask(data)
                .then(res => {
                    this.createAllTaskDialog = false
                    this.$message.success('操作成功！')
                    setTimeout(() => {
                        this.$emit('createTaskSucess')
                    }, 1500)
                })
                .catch(err => {
                    console.log(err + 'err')
                    if (String(err).indexOf(404) != -1) {
                        this.$message({
                            message: '设备未连通！',
                            type: 'warning'
                        })
                    }
                })
        },
        createPackTask(row) {
            let data = {
                queryData: {},
                paramsData: {
                    id: row ? row.id : this.seeDetail.id,
                    indexType: this.indexTypeData,
                    startTime: this.startTime,
                    endTime: this.endTime
                }
            }
            getLogById(data).then(res => {
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
            })
            let keyData = {
                queryData: {},
                paramsData: {}
            }
            getKey(keyData).then(res => {
                this.keyDetail = res
            })
            setTimeout(() => {
                this.createTaskDialog = true
            }, 800)
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
            const timeoutData = 24 * 60 * 60000
            downloadLogPacket(data)
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
            // axios({
            //     url: `yun-che/pub/api/flowApi/downloadLogPacket?key=${this.keyDetail}`,
            //     method: 'post',
            //     data: [data.paramsData],
            //     timeout: timeoutData,
            //     baseURL: '',
            //     responseType: 'blob'
            // }).then(res => {
            //     this.createTaskDialog = false
            //     this.$message.success('操作成功！')
            //     setTimeout(() => {
            //         this.$emit('createTaskSucess')
            //     }, 1500)
            // }).catch(err => {
            //     if (String(err).indexOf(404) != -1) {
            //         this.$message({
            //             message: '设备未连通！',
            //             type: 'warning'
            //         })
            //     }
            // })
        },
        handleSaveLogIds() {
            if (this.multipleSelection.length === 0) {
                this.$message({
                    message: '请先选择数据！',
                    type: 'warning'
                })
            } else {
                // let idsData = this.multipleSelection.map((item) => {
                //     return {
                //         alarmTime: item.alarmTime,
                //         id: item.id
                //     }
                // })
                let idsData = []
                this.multipleSelection.map(item => {
                    idsData.push(item.id)
                })
                this.saveLogIdsData(idsData)
            }
        },
        hanleSave(row) {
            let idsData = [row.id]
            this.saveLogIdsData(idsData)
        },
        saveLogIdsData(idsData) {
            // let userId = this.$getsessionStorage('userInfo').id
            let data = {
                queryData: {},
                paramsData: {
                    logIds: idsData,
                    indexType: this.indexTypeData
                }
            }
            saveLogStorage(data)
                .then(res => {
                    this.$message({
                        message: '暂存成功',
                        type: 'success'
                    })
                    setTimeout(() => {
                        this.$emit('saveLogIdSuccess')
                    }, 1000)
                })
                .catch(error => {
                    console.log(error + 'error')
                })
        },
        changeOption(row) {
            this.$setlocalStorage('newSearchRowData', row)
            this.$parent.selectMode = 1
            this.$parent.alarmDialog = true
        },
        handleAlarm() {
            console.log('multipleSelection', this.multipleSelection)
            // debugger
            if (this.multipleSelection.length <= 1) {
                this.$message({
                    message: '请至少选择两条数据！',
                    type: 'warning'
                })
            } else {
                this.$parent.selectMode = 2
                this.$setlocalStorage('newSearchMoreRowData', this.multipleSelection)
                this.$parent.alarmDialog = true
            }
        },
        handleExpand(row, expandedRows) {
            let that = this
            if (expandedRows.length) {
                that.expandRowKeys = []
                if (row) {
                    that.expandRowKeys.push(row.id)

                    console.log(row, '展开')
                    this.expandData = []
                    this.expandJsonData = {}
                    let data = {
                        queryData: {},
                        paramsData: {
                            id: row.id,
                            logType: row.logType,
                            alarmTime: row.alarmTime
                        }
                    }
                    getExpandLog(data)
                        .then(res => {
                            let arr = []
                            let obj = {}
                            let messageObj = null
                            let alarmTimeObj = null
                            console.log(res, '展开信息')
                            for (const resKey in res) {
                                if (res[resKey] !== '') {
                                    if (resKey === 'message') {
                                        messageObj = {
                                            name: '原始字段',
                                            fieldName: 'message',
                                            value: res.message,
                                            type: 1
                                        }
                                        continue
                                    }
                                    if (resKey === 'alarmTime') {
                                        alarmTimeObj = {
                                            name: '发生时间',
                                            fieldName: 'alarmTime',
                                            value: res.alarmTime,
                                            type: 3
                                        }
                                        continue
                                    }
                                    let item = this.listAll.find(it => it.fieldName === resKey)
                                    // console.log(item, '字段信息')
                                    if (item) {
                                        arr.push({
                                            fieldName: item.fieldName,
                                            name: item.name,
                                            value: res[resKey],
                                            type: item.type
                                        })
                                        obj[item.fieldName] = res[resKey]
                                    }
                                }
                            }
                            if (messageObj) {
                                arr.push(messageObj)
                            }
                            if (alarmTimeObj) {
                                arr.unshift(alarmTimeObj)
                            }
                            this.expandData = arr
                            this.expandJsonData = obj
                        })
                        .then(() => {
                            this.filterKeyword('highlighted-inner')
                            if (row.nftData === 2) {
                                that.lookPcac(row)
                            }
                        })
                        .catch(err => {
                            console.log(err)
                        })
                }
            } else {
                that.expandRowKeys = []
            }
        },
        lookPcac(row) {
            this.tabsValue = ''
            this.pacpData = []
            let data = {
                queryData: {},
                paramsData: {
                    logId: row.id
                }
            }
            viewPcap(data)
                .then(res => {
                    console.log('pcac包', res)
                    // let arr = []
                    // for(let i=0;i<20;i++){
                    //     arr.push(res[0])
                    // }
                    if (res.length > 0) {
                        this.tabsValue = res[0].name.split('.json')[0]
                        this.pacpData = res.map(item => {
                            item.name = item.name.split('.json')[0]
                            return item
                        })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        defHighlight(node, keyword, index) {
            const reg = new RegExp(keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'))
            // console.log(node.nodeType)
            if (node.nodeType == 3) {
                // 只处理文本节点
                const match = node.data.match(new RegExp(reg))
                if (match) {
                    console.log('匹配到了')
                    const highlightEl = document.createElement('b')
                    highlightEl.style.color = this.highColor[index]
                    const wordNode = node.splitText(match.index)
                    wordNode.splitText(match[0].length) // 切割成前 关键词 后三个Text 节点
                    const wordNew = document.createTextNode(wordNode.data)
                    highlightEl.appendChild(wordNew) // highlight 节点构建成功
                    wordNode.parentNode.replaceChild(highlightEl, wordNode) // 替换该文本节点
                }
            } else {
                for (var i = 0; i < node.childNodes.length; i++) {
                    this.defHighlight(node.childNodes[i], keyword, index)
                    i++
                }
            }
        },
        filterKeyword(className = 'highlighted') {
            if (this.keywords.trim() === '') return
            this.$nextTick(() => {
                let arr = [...document.getElementsByClassName(className)]
                arr.forEach(it => {
                    // console.log(it)
                    let keywordsArr = this.keywords.split(',').filter(it => it !== '')
                    keywordsArr.forEach((item, index) => {
                        this.defHighlight(it, item, index)
                    })
                })
            }, 100)
        },
        equalVal(item) {
            console.log(item)
            let data = {
                origin: [{ connect: 'and', children: [{ field: item.key, operator: '=', value: item.value, dataType: 1, attrType: item.attrType }] }],
                msg: `((${item.name} = ${item.value}))`,
                id: Date.now() + Math.random()
            }
            this.$parent.conditionData.push(data)
            this.$message.success('添加成功')
            console.log(item.value)
            item.visible = false
            this.$parent.searchAssets()
        },
        unequalVal(item) {
            let data = {
                origin: [{ connect: 'and', children: [{ field: item.key, operator: '<>', value: item.value, dataType: 1, attrType: item.attrType }] }],
                msg: `((${item.name} <> ${item.value}))`,
                id: Date.now() + Math.random()
            }
            this.$parent.conditionData.push(data)
            this.$message.success('添加成功')
            console.log(item.value)
            item.visible = false
            this.$parent.searchAssets()
        },

        firstCopySuccess(e) {
            console.log('copy arguments e:', e)
            this.$message.success('复制成功')
        },
        firstCopyError(e) {
            console.log('copy arguments e:', e)
            this.$message.error('复制失败')
        },
        onEnd() {
            console.log('拖拽结束')
            this.$parent.changeFileds()
        },
        onMove(e) {
            console.log(e.relatedContext.element.fieldName)
            if (e.relatedContext.element.fieldName === 'alarmTime' || e.relatedContext.element.fieldName === 'message') return false
            return true
        },
        top10Show(element) {
            if (element.show) {
                element.show = false
                return
            }
            console.log(element)
            this.$parent.listAll.forEach(it => {
                if (it.fieldName !== element.fieldName) {
                    it.show = false
                }
            })
            this.$parent.list.forEach(it => {
                if (it.fieldName !== element.fieldName) {
                    it.show = false
                }
            })
            this.$parent.listCanSelect.forEach(it => {
                if (it.fieldName !== element.fieldName) {
                    it.show = false
                }
            })
            this.$emit('getTopField', {
                fields: [element.fieldName],
                orderType: 'desc'
            })
            // EventBus.$emit('getTopField', {
            //     fields: [element.fieldName],
            //     orderType: 'desc'
            // })
            // EventBus.$emit('getTopFieldTwo', {
            //     fields: [element.fieldName],
            //     orderType: 'desc'
            // })

            // let top5Obj = await this.getTop5(element.fieldName)
            // console.log('top5Obj', top5Obj)
            // element.totalNum = top5Obj.totalNum
            // element.top5 = top5Obj.top5.map(item => {
            //     item.percent = ((item.num * 100) / element.totalNum).toFixed(2)
            //     return item
            // })
            element.show = true
        },
        handleSizeChange(val) {
            this.$parent.get_params.size = val
            this.$parent.get_data()
        },
        handleCurrentChange(val) {
            this.$parent.get_params.page = val
            this.$parent.get_data()
        },
        indexMethod(index) {
            return (this.$parent.get_params.page - 1) * this.$parent.get_params.size + index + 1
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
            } else {
                // 发果是降序
                this.tableData = this.tableData.sort((a, b) => {
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
        handleSelectionChange(val) {
            this.multipleSelection = []
            this.multipleSelection = val
        }
    }
}
</script>
<style scoped lang="scss">
@import '../../../../../assets/css/pacap.scss';
.custom-btn {
    @include themeify {
         background-color: themed('save-btn-color')
    }
    }
    .custom-btn-two {
        @include themeify {
         background-color: themed('config-high-btn-color')
    }
    }
i.fold {
    position: absolute;
    cursor: pointer;
    color: #999999;
    right: 15px;
    top: 18px;
    font-size: 12px;
}
.pag {
    ::v-deep .el-input__inner {
        border: none !important;
    }
    ::v-deep .btn-prev {
        margin-left: -5px !important;
        border: none !important;
        background: none !important;
        box-shadow: none !important;
        span {
            font-size: 12px !important;
            color: #676a71 !important;
        }
        span:hover {
            color: #0052D9 !important;
        }
    }
    ::v-deep .btn-next {
        border: none !important;
        background: none !important;
        box-shadow: none !important;
        span {
            font-size: 12px !important;
            color: #676a71 !important;
        }
        span:hover {
            color: #0052D9 !important;
        }
    }
}
.pcap-btn {
    background-image: url(../../../../../assets/img/XZWJ.png);
    background-position: 0 0;
    background-repeat: no-repeat;
    background-size: 100% 100%;
}
.expert-left {
    width: 190px;
    padding: 10px 0;
    background-color: #fff;
    position: relative;
    border: solid 1px #fff;
    box-sizing: border-box;
    // margin-right: 10px;
    transition: width 0.2s linear;
    ::v-deep .el-input__suffix-inner {
        line-height: 32px;
    }
}
.expert-left.left-fold {
    width: 30px;
    transition: width 0.2s linear;

    i.fold {
        color: #999999;
        right: 8px;
        transform: rotate(180deg);
    }
}

.expert-right {
    padding: 10px 0 10px 10px;
    background-color: #fff;
    border: solid 1px #fff;
    ::v-deep .el-button--primary {
        border-color: #FFF;
    }
    ::v-deep .el-button--text {
        // color: #0052d9;
    }
    .bigTable  {
       ::v-deep .el-form-item {
            margin-bottom: 0px
       }
    }
}
.left-title {
    font-size: 14px;
    color: #191919;
}
.left-mark {
    width: 5px;
    height: 24px;
    background-color: #387dee;
    border-radius: 4px;
}
.left-tip {
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 0;

    > i {
        vertical-align: middle;
        font-size: 12px;
        color: #bdbdbd;
        margin-right: 5px;
    }

    > span {
        vertical-align: middle;
        font-size: 10px;
        color: #bdbdbd;
    }
}

.list-group {
    min-height: 26px;
}

.list-title {
    width: 180px;
    height: 26px;
    // margin-left: 6px;
    position: relative;
    border-radius: 4px;
    // background-image: url(../../../../../assets/img/field_bg.jpg);
    // background-size: 100% 100%;
    // background-repeat: no-repeat;
    // background-position: left top;

    .vertical-line {
        position: absolute;
        width: 2px;
        height: 26px;
        background: rgba(255, 255, 255, 0.2);
        left: -6px;

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
    color: #ffffff;
    cursor: move;
    margin: 4px 0;
    // padding:0 10px;
    box-sizing: border-box;
    .list-title {
        background-color: #387dee;
    }
}

.list-group-item1 {
    color: #616161;
    margin: 8px 0;
    // padding:0 10px;
    box-sizing: border-box;
    .list-title {
        background-color: #e7e7e7;
    }
    .open-box,
    .close-box {
        color: #5c5c5c;
    }
}

.list-group-item i,
.list-group-item1 i {
    cursor: pointer;
}

.open-box,
.close-box {
    width: 26px;
    height: 100%;
    color: #fff;
    text-align: center;
    line-height: 26px;
}

.list-inner-tip {
    font-size: 12px;
    line-height: 15px;
    color: #0052D9;
    margin: 6px 0;
}

.list-inner {
    width: 170px;
    margin: 10px 0;
}
div ::v-deep .store.btn_box {
    background-image: url('../../../../../components/modules/colorBtn/images/downloadBg.png');
}
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
    background: #f3f3f3;
}
::-webkit-scrollbar {
    width: 0 !important;
}
div ::v-deep .el-table__expand-column.expand-col {
    border: none;
    width: 30px;
}
.el-dropdown-menu {
    width: 120px !important;
}
</style>
