<template>
    <div class="threat-detail" style="padding-top: 12px !important;">
        <div class="search ub ub-ac">
            <el-form ref="form" label-width="80px">
                <el-input
                    maxlength="80"
                    class="input-with-select"
                    v-model.trim="searchValue"
                    :placeholder="searchSelect == 1 ? '输入查询语句进行搜索' : '请选择要上传的文件， 支持的文件类型包括：PE 可执行文件(EXE、DLL、COM 等)，Office 文档(DOC、XLS、PPT 等)，PDF，HTML，Script，MSI，SWF，JAR，LNK ，ELF，各种压缩包(ZIP、RAR、7Z 等)'"
                    style="width: 578px;height: 30px;line-height: 30px"
                    size="small"
                >
                    <el-select
                        size="small"
                        v-model="searchSelect"
                        style="height: 30px;line-height: 30px;width: 80px;box-sizing: border-box;border: none;color: #0052d9;"
                        slot="prepend"
                        placeholder="请选择"
                    >
                        <el-option label="查询" value="1"></el-option>
                        <el-option label="文件" value="2"></el-option>
                    </el-select>
                </el-input>
            </el-form>
            <el-button v-if="searchSelect == 1" @click="searchAssets" style="font-size: 12px;margin-left: 10px;height: 32px;display: flex;align-items: center;" class="search-btn" type="primary">搜 索</el-button>
            <el-upload
                class="upload-demo"
                style="display: flex;"
                :on-success="loadSuccess"
                :on-progress="loadProgressFile"
                :before-upload="beforeUpload"
                name="file"
                :headers="header"
                :on-error="loadError"
                :show-file-list="false"
                :disabled="uploadBtnLoading"
                action="api/intelligence/manage/intelligenceQuery/fileUploadUrl"
            >
                <el-button :loading="uploadBtnLoading" v-if="searchSelect == 2" style="margin-left: 10px;height: 32px;display: flex;align-items: center;" type="primary" size="small" icon="el-icon-plus">上传文件</el-button>
                <p style="margin-left: 10px;display: inline-block;" v-if="uploadBtnLoading">文件上传中... {{precent.toFixed(2)}}%</p>
            </el-upload>
        </div>
        <div class="search-result">
            <div class="title ub ub-ac ub-pj">
                <p>查询结果</p>
                <el-button type="info" style="height: 32px;display: flex;align-items: center;background-color: #fff;color: rgba(0, 0, 0, 0.4);border: solid 1px #dcdcdc;" @click="$router.push('/intelligence/threat_database')">返 回</el-button>
            </div>
            <div class="big-ip ub ub-pj ub-ac">
                <div class="top-box" v-show="searchSelect == 1">
                    <p style="color: rgba(0, 0, 0, 0.9);font-size: 18px;" v-show="one_ip !== '' && one_ip !== null">{{ one_ip }}</p>
                    <div class="tag-box">
                        <template v-if="ipORdomain == 'ip'">
                            <el-tag style="margin-right: 10px;" class="color1" v-for="(item, index) in one_log.judgments" :key="index">{{ item }}</el-tag>
                        </template>
                        <template v-if="ipORdomain == 'domain'">
                            <el-tag style="margin-right: 10px;" class="color1" v-for="(item, index) in second_log.judgments" :key="index">{{ item }}</el-tag>
                        </template>
                    </div>
                    <div class="list-info">
                        <div class="list-item ub ub-pj" style="margin-bottom: 20px">
                            <div style="width: 33%">
                                <span class="left-text">IP数量：</span>
                                <span class="right-text">{{ second_log.cur_ips.length }}</span>
                            </div>
                            <div style="width: 33%">
                                <span class="left-text">子域名数量：</span>
                                <span class="right-text">{{ second_log.cur_whois.name_server.length ? second_log.cur_whois.name_server.split('|').length : '' }}</span>
                            </div>
                            <div style="width: 33%">
                                <span class="left-text">域名上的URL：</span>
                                <span class="right-text">{{ second_log.cur_whois.name_server }}</span>
                            </div>
                        </div>
                        <div class="list-item ub ub-pj" style="margin-bottom: 20px">
                            <div style="width: 33%">
                                <span class="left-text">注册时间：</span>
                                <span class="right-text">{{ second_log.cur_whois.cdate }}</span>
                            </div>
                            <div style="width: 33%">
                                <span class="left-text">过期时间：</span>
                                <span class="right-text">{{ second_log.cur_whois.edate }}</span>
                            </div>
                            <div style="width: 33%">
                                <span class="left-text">域名注册邮箱：</span>
                                <span class="right-text">{{ second_log.cur_whois.registrant_email }}</span>
                            </div>
                        </div>
                        <div class="list-item ub ub-pj" style="margin-bottom: 20px">
                            <div style="width: 33%">
                                <span class="left-text">与该域名通信样本：</span>
                                <span class="right-text">{{ '未知字段' }}</span>
                            </div>
                            <div style="width: 33%">
                                <span class="left-text">域名服务商：</span>
                                <span class="right-text">{{ second_log.cur_whois.registrar_name }}</span>
                            </div>
                            <div style="width: 33%"></div>
                        </div>
                    </div>
                </div>
                <div class="top-box" v-show="searchSelect == 2">
                    <p style="margin-bottom: 10px;">{{ fileData.summary.file_name }}</p>
                    <div class="list-info">
                        <div class="list-item ub ub-pj" style="margin-bottom: 20px">
                            <div style="width: 33%">
                                <span class="left-text">首次提交：</span>
                                <span class="right-text">{{ fileData.summary.submit_time }}</span>
                            </div>
                            <div style="width: 33%">
                                <span class="left-text">文件大小：</span>
                                <span class="right-text">{{ fileData.summary.file_size }}B</span>
                            </div>
                            <div style="width: 33%">
                                <span class="left-text">文件类型：</span>
                                <span class="right-text">{{ fileData.static.basic.file_type }}</span>
                            </div>
                        </div>
                        <div class="list-item ub ub-pj" style="margin-bottom: 20px">
                            <div style="width: 100%">
                                <span class="left-text">分析环境：</span>
                                <span class="right-text">{{ fileData.summary.sandbox_type }}</span>
                            </div>
                        </div>
                        <div class="list-item ub ub-pj"><div style="width: 100%; color: rgb(1, 155, 137);">HASH</div></div>
                        <div class="list-item ub ub-pj" style="margin-bottom: 20px">
                            <div style="width: 100%; color: rgb(1, 155, 137);">
                                <span class="left-text">SHA256：</span>
                                <span class="right-text">{{ fileData.static.basic.sha256 }}</span>
                            </div>
                        </div>
                        <div class="list-item ub ub-pj" style="margin-bottom: 20px">
                            <div style="width: 100%; color: rgb(1, 155, 137);">
                                <span class="left-text">MD5：</span>
                                <span class="right-text">{{ fileData.static.basic.md5 }}</span>
                            </div>
                        </div>
                        <div class="list-item ub ub-pj" style="margin-bottom: 20px">
                            <div style="width: 100%; color: rgb(1, 155, 137);">
                                <span class="left-text">SHA1：</span>
                                <span class="right-text">{{ fileData.static.basic.sha1 }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="ub-f1 ub ub-ac ub-pc" v-show="searchSelect == 1">
                    <div v-if="isSpite == '安全'" class="safe-img"></div>
                    <div v-if="isSpite == '恶意'" class="eyi-img"></div>
                    <div v-if="isSpite == '可疑'" class="keyi-img"></div>
                    <div v-if="isSpite == '未知'" class="weizhi-img"></div>
                </div>
                <div class="ub-f1 ub ub-ac ub-pc" v-show="searchSelect == 2">
                    <div v-if="fileData.summary.threat_level == 'clean'" class="safe-img"></div>
                    <div v-if="fileData.summary.threat_level == 'Malicious'" class="eyi-img"></div>
                    <div v-if="fileData.summary.threat_level == 'suspicious'" class="keyi-img"></div>
                    <div v-if="fileData.summary.threat_level == ''" class="weizhi-img"></div>
                </div>
            </div>
            <div class="safe-event" v-show="searchSelect == 1">
                <el-tabs v-model="activeName">
                    <el-tab-pane :label="returnTitle1()" name="first">
                        <p class="table-title" style="margin-bottom: 10px;color: #0052d9;font-size: 14px;margin-top: 10px;">{{ '开源情报' }}</p>
                        <template v-if="ipORdomain == 'ip'">
                            <el-table ref="multipleTable" v-loading="loading" class="bigTable" :data="one_log.intelligences.threatbook_lab" border stripe tooltip-effect="dark">
                                <el-table-column prop="source" label="情报源"></el-table-column>
                                <el-table-column prop="find_time" label="时间" width="160"></el-table-column>
                                <el-table-column label="威胁类型">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.intel_types.join('、') }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="标签信息">
                                    <template slot-scope="scope">
                                        <div v-if="scope.row.intel_tags.length">
                                            <span>类型：{{ scope.row.intel_tags.map(item => item.tags_type).join('、') }}</span>
                                            ；
                                            <span>标签：{{ scope.row.intel_tags.map(item => item.tags).join('、') }}</span>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="status" label="状态" width="120">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.expired ? '已过期' : '有效' }}</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </template>
                        <template v-if="ipORdomain == 'domain'">
                            <el-table ref="multipleTable" v-loading="loading" class="bigTable" :data="second_log.intelligences.threatbook_lab" border stripe tooltip-effect="dark">
                                <el-table-column prop="source" label="情报源"></el-table-column>
                                <el-table-column prop="find_time" label="时间" width="160"></el-table-column>
                                <el-table-column label="威胁类型">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.intel_types.join('、') }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="标签信息">
                                    <template slot-scope="scope">
                                        <div v-if="scope.row.intel_tags.length">
                                            <span>类型：{{ scope.row.intel_tags.map(item => item.tags_type).join('、') }}</span>
                                            <span>标签：{{ scope.row.intel_tags.map(item => item.tags).join('、') }}</span>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="status" label="状态" width="120">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.expired ? '已过期' : '有效' }}</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </template>
                        <p class="table-title" style="margin: 10px auto;color: #0052d9;font-size: 14px;margin-top: 20px;">{{ '相关样本' }}</p>
                        <template v-if="ipORdomain == 'ip'">
                            <el-table ref="multipleTable" v-loading="loading" class="bigTable" :data="one_log.samples" border stripe tooltip-effect="dark">
                                <el-table-column prop="sha256" label="文件hash" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="scan_time" label="活动时间" width="160"></el-table-column>
                                <el-table-column prop="ratio" label="检出率" width="120"></el-table-column>
                                <el-table-column prop="malware_type" label="恶意类型" width="200"></el-table-column>
                                <el-table-column prop="malware_family" label="家族信息" width="200"></el-table-column>
                            </el-table>
                        </template>
                        <template v-if="ipORdomain == 'domain'">
                            <el-table ref="multipleTable" v-loading="loading" class="bigTable" :data="second_log.samples" border stripe tooltip-effect="dark">
                                <el-table-column prop="sha256" label="文件hash" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="scan_time" label="活动时间" width="160"></el-table-column>
                                <el-table-column prop="ratio" label="检出率" width="120"></el-table-column>
                                <el-table-column prop="malware_type" label="恶意类型" width="200"></el-table-column>
                                <el-table-column prop="malware_family" label="家族信息" width="200"></el-table-column>
                            </el-table>
                        </template>

                        <!-- <p class="table-title" style="margin: 10px auto;color: #00ffe4;font-size: 14px;margin-top: 20px;">{{ '相关URL' }}</p> -->
                        <!-- {{ '表格数据没有--涉及字段-url、恶意类型、家族信息、' }} -->
                        <!-- <el-table
                            ref="multipleTable"
                            v-loading="loading"
                            class='bigTable'
                            :data="one_log.intelligenceAgg.relationalUrl"
                            border
                            stripe
                            tooltip-effect="dark">
                            <el-table-column prop="url" label="url">
                            </el-table-column>
                            <el-table-column prop="balefulType" label="恶意类型" width="160">
                            </el-table-column>
                            <el-table-column prop="familyInfo" label="家族信息">
                            </el-table-column>
                        </el-table> -->
                    </el-tab-pane>
                    <el-tab-pane :label="returnTitle2()" name="second">
                        <div class="field-box">
                            <div class="ub ub-ac">
                                <p class="field-label">IP地址</p>
                                <p class="field-value ub-f1">{{ ipORdomain == 'ip' ? one_ip : second_log.cur_ips.length ? second_log.cur_ips[0].ip : '' }}</p>
                            </div>
                            <div class="ub ub-ac">
                                <p class="field-label">ASN</p>
                                <p class="field-value ub-f1">{{ one_log.asn.info }}</p>
                            </div>
                            <div class="ub ub-ac">
                                <p class="field-label">地理位置</p>
                                <p class="field-value ub-f1">{{ one_log.basic.location.country }} {{ one_log.basic.location.city }} {{ one_log.basic.location.province }}</p>
                            </div>
                            <div class="ub ub-ac">
                                <p class="field-label">端口开放信息</p>
                                <p class="field-value ub-f1">{{ one_log.ports.map(item => item.port).join('、') }}</p>
                            </div>
                        </div>
                        <p class="table-title" style="margin: 10px auto;color: #0052d9;font-size: 14px;margin-top: 20px;">{{ '历史解析记录' }}</p>
                        <el-table ref="multipleTable" v-loading="loading" class="bigTable" :data="second_log.cur_ips" border stripe tooltip-effect="dark">
                            <el-table-column prop="ip" label="IP"></el-table-column>
                            <el-table-column prop="time" label="时间" width="160">
                                <template>
                                    未知字段
                                </template>
                            </el-table-column>
                            <el-table-column label="国家">
                                <template slot-scope="scope">
                                    {{ scope.row.location.country }}
                                </template>
                            </el-table-column>
                            <el-table-column label="省/州">
                                <template slot-scope="scope">
                                    {{ scope.row.location.province }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="carrier" label="运营商"></el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane :label="returnTitle3()" name="third">
                        <p class="table-title" style="margin-bottom: 10px;;color: #0052d9;font-size: 14px;margin-top: 20px;">{{ '子域名' }}</p>
                        <el-table ref="multipleTable" v-loading="loading" class="bigTable" :data="second_log.cur_whois.subDomainInfo" border stripe tooltip-effect="dark">
                            <el-table-column prop="domain" label="子域名"></el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane :label="returnTitle4()" name="fourth">
                        <div class="field-box">
                            <div class="ub ub-ac">
                                <p class="field-label">注册者</p>
                                <p class="field-value ub-f1">{{ second_log.cur_whois.registrar_name }}</p>
                            </div>
                            <div class="ub ub-ac">
                                <p class="field-label">注册机构</p>
                                <p class="field-value ub-f1">{{ second_log.cur_whois.registrant_company }}</p>
                            </div>
                            <div class="ub ub-ac">
                                <p class="field-label">邮箱</p>
                                <p class="field-value ub-f1">{{ second_log.cur_whois.registrant_email }}</p>
                            </div>
                            <div class="ub ub-ac">
                                <p class="field-label">地址</p>
                                <p class="field-value ub-f1">{{ second_log.cur_whois.registrant_address }}</p>
                            </div>
                            <div class="ub ub-ac">
                                <p class="field-label">电话</p>
                                <p class="field-value ub-f1">{{ second_log.cur_whois.registrant_phone }}</p>
                            </div>
                            <div class="ub ub-ac">
                                <p class="field-label">注册时间</p>
                                <p class="field-value ub-f1">{{ second_log.cur_whois.cdate }}</p>
                            </div>
                            <div class="ub ub-ac">
                                <p class="field-label">过期时间</p>
                                <p class="field-value ub-f1">{{ second_log.cur_whois.edate }}</p>
                            </div>
                            <div class="ub ub-ac">
                                <p class="field-label">更新时间</p>
                                <p class="field-value ub-f1">{{ second_log.cur_whois.udate }}</p>
                            </div>
                            <div class="ub ub-ac">
                                <p class="field-label">域名服务商</p>
                                <p class="field-value ub-f1">{{ second_log.cur_whois.registrar_name }}</p>
                            </div>
                            <div class="ub ub-ac">
                                <p class="field-label">域名服务器</p>
                                <p class="field-value ub-f1">{{ second_log.cur_whois.name_server }}</p>
                            </div>
                        </div>
                        <!-- <p class="table-title" style="margin: 10px auto;color: #00ffe4;font-size: 14px;">{{ '历史注册信息' }}</p> -->
                        <!-- 无数据 ---字段 日期 重要信息更新 -->
                        <!-- <el-table
                            ref="multipleTable"
                            v-loading="loading"
                            class='bigTable'
                            :data="one_log.whois.historyRegister"
                            border
                            stripe
                            tooltip-effect="dark">
                            <el-table-column prop="date" label="日期" width="160">
                            </el-table-column>
                            <el-table-column prop="majorInfo" label="重要信息更新">
                            </el-table-column>
                        </el-table> -->
                    </el-tab-pane>
                    <el-tab-pane :label="returnTitle5()" name="five">
                        <div class="field-box" v-for="(cas, index) in second_log.cas" :key="index">
                            <div class="ub ub-ac">
                                <p class="field-label">使用者</p>
                                <p class="field-value ub-f1">{{ cas ? cas.subject : '' }}</p>
                            </div>
                            <div class="ub ub-ac">
                                <p class="field-label">颁发者</p>
                                <p class="field-value ub-f1">{{ cas ? cas.issuer : '' }}</p>
                            </div>
                            <div class="ub ub-ac">
                                <p class="field-label">开始时间</p>
                                <p class="field-value ub-f1">{{ cas ? cas.begin : '' }}</p>
                            </div>
                            <div class="ub ub-ac">
                                <p class="field-label">失效时间</p>
                                <p class="field-value ub-f1">{{ cas ? cas.end : '' }}</p>
                            </div>
                            <div class="ub ub-ac">
                                <p class="field-label">证书指纹</p>
                                <p class="field-value ub-f1">{{ cas ? cas.fingerprint : '' }}</p>
                            </div>
                            <div class="ub ub-ac">
                                <p class="field-label">状态</p>
                                <p class="field-value ub-f1">{{ cas ? cas.status_desc : '' }}</p>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane :label="returnTitle6()" name="six">
                        <p class="table-title" style="margin-bottom: 10px;color: #0052d9;font-size: 14px;margin-top: 10px;">{{ '当前开放端口及服务' }}</p>
                        <div>
                            <span class="portspan" :key="index" v-for="(item, index) in one_log.ports">{{ item.port }}</span>
                        </div>
                        <p class="table-title" style="margin: 10px auto;color: #0052d9;font-size: 14px;margin-top: 20px;">{{ '端口详情' }}</p>
                        <div class="ub port-inner">
                            <div class="portdetail" v-for="(item, index) in one_log.ports" :key="index">
                                <div class="port-title">{{ item.port }}</div>
                                <div class="port-line">
                                    <span class="port-line-key">ip开放端口号：</span>
                                    <span class="port-line-value">{{ item.port }}</span>
                                </div>
                                <div class="port-line">
                                    <span class="port-line-key">应用协议：</span>
                                    <span class="port-line-value">{{ item.module }}</span>
                                </div>
                                <div class="port-line">
                                    <span class="port-line-key">应用名称：</span>
                                    <span class="port-line-value">{{ item.product }}</span>
                                </div>
                                <div class="port-line">
                                    <span class="port-line-key">应用版本：</span>
                                    <span class="port-line-value">{{ item.version }}</span>
                                </div>
                                <div class="port-line">
                                    <span class="port-line-key">应用详情：</span>
                                    <span class="port-line-value">{{ item.detail }}</span>
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <div class="safe-event" v-show="searchSelect == 2">
                <el-tabs v-model="activeName1">
                    <el-tab-pane label="基础信息" name="basic">
                        <div class="field-box">
                            <div class="ub ub-ac">
                                <p class="field-label">文件名称</p>
                                <p class="field-value ub-f1">{{ fileData.summary.file_name }}</p>
                            </div>
                            <div class="ub ub-ac">
                                <p class="field-label">文件类型</p>
                                <p class="field-value ub-f1">{{ fileData.static.basic.file_type }}</p>
                            </div>
                            <div class="ub ub-ac">
                                <p class="field-label">文件大小</p>
                                <p class="field-value ub-f1">{{ fileData.static.basic.file_size }}</p>
                            </div>
                            <div class="ub ub-ac">
                                <p class="field-label">SHA256</p>
                                <p class="field-value ub-f1">{{ fileData.static.basic.sha256 }}</p>
                            </div>
                            <div class="ub ub-ac">
                                <p class="field-label">SHA1</p>
                                <p class="field-value ub-f1">{{ fileData.static.basic.sha1 }}</p>
                            </div>
                            <div class="ub ub-ac">
                                <p class="field-label">MD5</p>
                                <p class="field-value ub-f1">{{ fileData.static.basic.md5 }}</p>
                            </div>
                            <!-- <div class="ub ub-ac">
                                <p class="field-label">CRC32</p>
                                <p class="field-value ub-f1">{{  }}</p>
                            </div> -->
                            <div class="ub ub-ac">
                                <p class="field-label">SSDEEP</p>
                                <p class="field-value ub-f1">{{ fileData.static.basic.ssdeep }}</p>
                            </div>
                            <!-- <div class="ub ub-ac">
                                <p class="field-label">TLSH</p>
                                <p class="field-value ub-f1">{{  }}</p>
                            </div> -->
                            <div class="ub ub-ac">
                                <p class="field-label">Tags</p>
                                <p class="field-value ub-f1">{{ fileData.static.details.tag }}</p>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
</template>

<script>
import { get_threat_search } from '../../server/intelligence/api.js'

export default {
    name: 'IpList',
    data() {
        return {
            ipORdomain: '',
            isSpite: '',
            uploadBtnLoading: false,
            precent: 0,
            limit: 1,
            one_ip: '',
            one_log: {
                // ip 信息
                samples: [],
                tags_classes: [],
                judgments: [],
                intelligences: {
                    threatbook_lab: []
                },
                scene: '',
                basic: {
                    carrier: '',
                    location: {
                        country: '',
                        province: '',
                        city: '',
                        lng: '',
                        lat: '',
                        country_code: ''
                    }
                },
                asn: {
                    rank: '',
                    info: '',
                    number: ''
                },
                ports: [],
                cas: [],
                update_time: '',
                rdns_list: [],
                sum_cur_domains: ''
            },
            second_log: {
                // 如果是查询ip，需要根据ip下的域名再次查询获取whois和数字证书信息
                samples: [],
                intelligences: {
                    threatbook_lab: []
                },
                cas: [],
                cur_whois: {
                    cdate: '',
                    edate: '',
                    udate: '',
                    alexa: '',
                    registrar_name: '',
                    name_server: '',
                    registrant_name: '',
                    registrant_email: '',
                    registrant_company: '',
                    registrant_address: '',
                    registrant_phone: ''
                },
                cur_ips: []
            },
            loading: false,
            searchSelect: '1',
            searchValue: '',
            activeName: 'first',
            activeName1: 'basic',
            fileData: {
                multiengines: {
                    detect_rate: '',
                    result: {},
                    scan_time: ''
                },
                summary: {
                    file_name: '',
                    file_size: 0,
                    file_type: '',
                    is_whitelist: false,
                    malware_family: '',
                    malware_type: '',
                    md5: '',
                    multi_engines: '',
                    sample_sha256: '',
                    sandbox_type: '',
                    sandbox_type_list: [],
                    sha1: '',
                    submit_time: '',
                    tag: { s: [], x: [] },
                    threat_level: '',
                    threat_score: 0
                },
                static: {
                    basic: {
                        file_name: '',
                        file_size: 0,
                        file_type: '',
                        md5: '',
                        sha1: '',
                        sha256: '',
                        ssdeep: ''
                    },
                    details: { tag: [] }
                }
            }
        }
    },
    mounted() {
        // console.log(222222222222222222222)
        this.$setsessionStorage('currentPath', this.$router.currentRoute.fullPath)
        this.$nextTick(() => {
            if (this.$route.query.searchStr) {
                this.one_ip = this.$route.query.searchStr
                const tmpLog = this.$getsessionStorage('search-item')
                this.ipORdomain = tmpLog.ipORdomain
                this.isSpite = tmpLog.isSpite
                if (this.ipORdomain == 'ip') {
                    this.one_log = tmpLog[this.one_ip]
                    if (this.one_log.rdns_list.length) {
                        // 根据ip查旗下的第一个域名
                        this.secondSearch(this.one_log.rdns_list[0].rdns)
                    }
                }
                if (this.ipORdomain == 'domain') {
                    this.second_log = tmpLog[this.one_ip]
                    // 处理子域名
                    this.second_log.cur_whois.subDomainInfo = []
                    if (this.second_log.cur_whois.name_server) {
                        this.second_log.cur_whois.name_server.split('|').forEach(item => {
                            this.second_log.cur_whois.subDomainInfo.push({
                                domain: item
                            })
                        })
                    }
                    if (this.second_log.cur_ips.length) {
                        // 根据域名查旗下的第一个ip
                        this.oneSearch(this.second_log.cur_ips[0].ip)
                    }
                }
                this.searchSelect = '1'
            } else if (this.$route.query.file) {
                this.fileData = this.$getsessionStorage('file-item')
                this.searchSelect = '2'
            } else {
                if (this.$getsessionStorage('log-item')) {
                    try {
                        this.one_ip = this.$getsessionStorage('log-item').value
                        const tmpLog = JSON.parse(this.$getsessionStorage('log-item').result)
                        this.ipORdomain = tmpLog.ipORdomain
                        this.isSpite = tmpLog.isSpite
                        if (this.ipORdomain == 'ip') {
                            this.one_log = tmpLog[this.one_ip]
                            if (this.one_log.rdns_list.length) {
                                this.secondSearch(this.one_log.rdns_list[0].rdns)
                            }
                        }
                        if (this.ipORdomain == 'domain') {
                            this.second_log = tmpLog[this.one_ip]
                            // 处理子域名
                            this.second_log.cur_whois.subDomainInfo = []
                            if (this.second_log.cur_whois.name_server) {
                                this.second_log.cur_whois.name_server.split('|').forEach(item => {
                                    this.second_log.cur_whois.subDomainInfo.push({
                                        domain: item
                                    })
                                })
                            }
                            if (this.second_log.cur_ips.length) {
                                // 根据域名查旗下的第一个ip
                                this.oneSearch(this.second_log.cur_ips[0].ip)
                            }
                        }
                    } catch (err) {
                        console.log(err)
                    }
                }
                console.log(this.one_log)
                this.searchSelect = '1'
            }
        })
    },
    watch: {
        searchSelect: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.searchValue = ''
                }
            }
        }
    },
    computed: {
        header() {
            return { token: this.$getlocalStorage('initInfo').user.token }
        }
    },
    methods: {
        searchAssets() {
            // const ipRules = /^((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9]))$/
            // let res = ipRules.test(this.input.trim())
            if (this.searchValue === '') {
                this.$message({
                    message: '请输入查询条件',
                    type: 'warning'
                })
                return
            }
            // let res = true // 不校验输入框了
            let obj = {
                value: this.searchValue
            }
            get_threat_search({ queryData: obj, paramsData: {}})
                .then(res => {
                    console.log(res)
                    if (JSON.stringify(res) !== '{}' && res) {
                        // this.one_log = res
                        this.one_ip = this.searchValue
                        const tmpLog = res
                        this.ipORdomain = tmpLog.ipORdomain
                        this.isSpite = tmpLog.isSpite
                        if (this.ipORdomain == 'ip') {
                            this.one_log = tmpLog[this.one_ip]
                            if (this.one_log.rdns_list.length) {
                                // 根据ip查旗下的第一个域名
                                this.secondSearch(this.one_log.rdns_list[0].rdns)
                            }
                        }
                        if (this.ipORdomain == 'domain') {
                            this.second_log = tmpLog[this.one_ip]
                            // 处理子域名
                            this.second_log.cur_whois.subDomainInfo = []
                            if (this.second_log.cur_whois.name_server) {
                                this.second_log.cur_whois.name_server.split('|').forEach(item => {
                                    this.second_log.cur_whois.subDomainInfo.push({
                                        domain: item
                                    })
                                })
                            }
                            if (this.second_log.cur_ips.length) {
                                // 根据域名查旗下的第一个ip
                                this.oneSearch(this.second_log.cur_ips[0].ip)
                            }
                        }
                    } else {
                        this.resetTxt()
                    }
                })
                .catch(err => {
                    console.log(err + 'err')
                })
        },
        secondSearch(value) {
            // 根据域名查询放到second里
            let obj = {
                value
            }
            get_threat_search({ queryData: obj, paramsData: {}})
                .then(res => {
                    if (JSON.stringify(res) !== '{}' && res) {
                        this.second_log = res[value]
                        this.second_log.cur_whois.subDomainInfo = []
                        if (this.second_log.cur_whois.name_server) {
                            this.second_log.cur_whois.name_server.split('|').forEach(item => {
                                this.second_log.cur_whois.subDomainInfo.push({
                                    domain: item
                                })
                            })
                        }
                        console.log(this.second_log.cur_whois.name_server, this.second_log.cur_whois.subDomain)
                    } else {
                        this.resetSecond()
                    }
                })
                .catch(err => {
                    console.log(err + 'err')
                })
        },
        oneSearch(value) {
            // 根据ip查询放到one里
            let obj = {
                value
            }
            get_threat_search({ queryData: obj, paramsData: {}})
                .then(res => {
                    if (JSON.stringify(res) !== '{}' && res) {
                        this.one_log = res[value]
                        console.log(this.one_log)
                    } else {
                        this.resetOne()
                    }
                })
                .catch(err => {
                    console.log(err + 'err')
                })
        },
        dateFormat(times) {
            // console.log(row,column)
            if (!times) {
                return ''
            }
            if (JSON.stringify(times).length === 10) {
                times = times * 1000
            }
            var date = new Date(times) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
            var Y = date.getFullYear() + '-'
            var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
            var D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' '
            var h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':'
            var m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':'
            var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
            return Y + M + D + h + m + s
        },
        loadSuccess(response) {
            console.log('response', response)
            if (response.code == 1) {
                this.$message({
                    message: '文件上传成功!',
                    type: 'success'
                })
                this.uploadBtnLoading = false
                if (JSON.stringify(response.data) !== '{}') {
                    this.fileData = response.data
                }
            } else {
                this.uploadBtnLoading = false
                this.$message({
                    message: response.message,
                    type: 'warning'
                })
            }
        },
        resetOne() {
            this.one_log = {
                // ip 信息
                samples: [],
                tags_classes: [],
                judgments: [],
                intelligences: {
                    threatbook_lab: []
                },
                scene: '',
                basic: {
                    carrier: '',
                    location: {
                        country: '',
                        province: '',
                        city: '',
                        lng: '',
                        lat: '',
                        country_code: ''
                    }
                },
                asn: {
                    rank: '',
                    info: '',
                    number: ''
                },
                ports: [],
                cas: [],
                update_time: '',
                rdns_list: [],
                sum_cur_domains: ''
            }
        },
        resetSecond() {
            this.second_log = {
                // 如果是查询ip，需要根据ip下的域名再次查询获取whois和数字证书信息
                samples: [],
                intelligences: {
                    threatbook_lab: []
                },
                cas: [],
                cur_whois: {
                    cdate: '',
                    edate: '',
                    udate: '',
                    alexa: '',
                    registrar_name: '',
                    name_server: '',
                    registrant_name: '',
                    registrant_email: '',
                    registrant_company: '',
                    registrant_address: '',
                    registrant_phone: ''
                },
                cur_ips: []
            }
        },
        resetTxt() {
            this.one_ip = ''
            this.isSpite = '未知'
            this.ipORdomain = ''
            this.resetOne()
            this.resetSecond()
        },
        loadProgressFile(event, file, fileList) {
            this.uploadBtnLoading = true
            this.precent = event.percent
            console.log(event)
            console.log(file)
            console.log(fileList)
        },
        loadError(err) {
            console.log(err)
        },
        beforeUpload(file) {
            // const allowTypes = ['zip', 'docx', 'pdf', 'doc', 'jpg', 'jpeg', 'png', 'rar']
            // console.log(file)
            // let arr = file.name.split('.')
            // if (!allowTypes.includes(arr[arr.length - 1])) {
            //     this.$message.warning('请上传正确格式文件')
            //     return false
            // }
            if (file.size > 100 * 1024 * 1024) {
                this.$message.warning('请上传小于100M文件')
                return false
            }
        },
        returnTitle1() {
            return '情报聚合'
        },
        returnTitle2() {
            return '域名解析'
        },
        returnTitle3() {
            return '子域名'
        },
        returnTitle4() {
            return 'WHOIS'
        },
        returnTitle5() {
            return '数字证书'
        },
        returnTitle6() {
            return '开放端口'
        }
    },
    beforeDestroy() {
        if (this.$getsessionStorage('search-item')) {
            sessionStorage.removeItem('search-item')
        }
        if (this.$getsessionStorage('log-item')) {
            sessionStorage.removeItem('log-item')
        }
        if (this.$getsessionStorage('file-item')) {
            sessionStorage.removeItem('file-item')
        }
    }
}
</script>

<style scoped lang="scss">
.upload-demo {
    .el-upload {
        display: flex;
        align-items: center;
    }
}
.threat-detail {
    color: rgba(0, 0, 0, 0.9);
    position: relative;
    box-sizing: border-box;
    min-height: 98%;
    font-family: '微软雅黑', 'digital-7', '宋体', 'Helvetica';

    & .title {
        height: 32px;
        line-height: 32px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.9);
        font-weight: 500;
    }
}
.portspan {
    width: 80px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.1);
    border: solid 1px rgba(0, 0, 0, 0.5);
    margin-right: 8px;
    color: rgba(0, 0, 0, .9);
    font-size: 12px;
    display: inline-block;
}
.port-inner {
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
    .portdetail {
        width: 33%;
        // margin-right: 15px;
        margin-bottom: 10px;
        box-sizing: border-box;
        padding: 10px;
        min-height: 200px;
        background-color: rgba(56, 125, 238, 0.02);
        border: solid 1px #ddd;
        .port-title {
            font-size: 16px;
            margin-bottom: 18px;
        }
        .port-line {
            margin-bottom: 16px;
            font-size: 12px;
            .port-line-key {
                opacity: 0.5;
            }
            .port-line-value {
                word-break: break-all;
            }
        }
    }
}
.search-result {
    background-color: #fff;
    box-shadow: 0px 0px 8px 0px rgba(140, 152, 164, 0.2);
    border-radius: 4px;
    border: solid 1px #dadee8;
    margin-top: 10px;
    padding: 20px;
    ::v-deep .el-table__header-wrapper {
        font-size: 14px;
    }
}
.safe-event {
    margin-top: 10px;
}
.big-ip {
    color: #47f1ff;
    font-size: 26px;
    align-items: stretch;

    & .el-tag {
        font-size: 12px;
        height: 20px;
        line-height: 18px;
        margin-bottom: 10px;
    }
}
.top-box {
    width: 70%;

    p {
        font-size: 20px;
        height: 24px;
        line-height: 24px;
        color: #fff;
    }
}
.safe-img {
    width: 215px;
    height: 247px;
    background: url('../../assets/img/intelligence/safe.png') 100% 100% no-repeat;
    background-size: contain;
}

.eyi-img {
    width: 215px;
    height: 247px;
    background: url('../../assets/img/intelligence/eyi.png') 100% 100% no-repeat;
    background-size: contain;
}

.weizhi-img {
    width: 215px;
    height: 247px;
    background: url('../../assets/img/intelligence/weizhi.png') 100% 100% no-repeat;
    background-size: contain;
}

.keyi-img {
    width: 215px;
    height: 247px;
    background: url('../../assets/img/intelligence/keyi.png') 100% 100% no-repeat;
    background-size: contain;
}
.tag-box {
    width: 100%;
    margin: 20px 0 0;
    font-size: 0;
    .add-tag {
        display: inline-block;
        font-size: 12px;
        height: 20px;
        line-height: 18px;
        padding: 0 10px;
        text-align: center;
        color: #777;
        border-radius: 4px;
        border: solid 1px #777;
        box-sizing: border-box;
        cursor: pointer;
        i {
            font-weight: bold;
        }
    }
}
.list-info {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    border: 1px solid #ddd;
    font-size: 12px;
    background-color: rgba(56, 125, 238, 0.02);
    border-radius: 4px;
    .left-text {
        color: #a8a9ab;
    }
    .right-text {
        color: rgba(0, 0, 0, 0.9);
        word-break: break-all;
    }
}

.color1 {
    color: #59afff;
    background-color: rgba(23, 143, 255, 0.1);
    border: 1px solid #178fff;
}
.search ::v-deep .el-button--primary {
    background-color: #387dee;
    color: #fff;
}

.basic-info table {
    width: 100%;
    border-collapse: collapse;
    border-radius: 4px;
    border-style: hidden; // 利用box-shadow做一个假边框
    box-shadow: 0 0 0 1px #3990d8;

    & th {
        width: 100px;
        border: 1px solid #3990d8;
        font-size: 14px;
    }

    & tr {
        background: rgba(3, 50, 84, 0.5);
        color: #fff;
        box-shadow: 0 0 6px rgba(0, 186, 255, 0.73) inset;

        &:nth-child(2) {
            background-color: rgba(29, 65, 105, 0.5);
        }

        &:nth-child(4) {
            background-color: rgba(29, 65, 105, 0.5);
        }

        & td {
            &:nth-of-type(1) {
                width: 200px;
            }

            &:nth-of-type(2) {
                width: 300px;
            }

            &:nth-of-type(3) {
                width: 200px;
            }
        }
    }

    & td {
        border: 1px solid #3990d8;
        height: 48px;
        padding-left: 10px;
        font-size: 14px;
        word-break: break-all; // 换行
    }
}

.event ::v-deep .el-tabs__item {
    color: rgba(255, 255, 255, 0.6);
    font-size: 14px;
}

.event ::v-deep .el-tabs__item.is-active {
    color: #00e9ff;
}

.event ::v-deep .el-tabs__active-bar {
    background-color: #00e9ff;
}

.event ::v-deep .el-tabs__nav-wrap::after {
    background-color: #113d4e;
    height: 1px;
}
.field-box {
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 20px;
    background: #fff;

    div {
        border-bottom: 1px solid #ddd;
        line-height: 34px;
        box-sizing: border-box;
        align-items: stretch;

        .field-label {
            display: flex;
            align-items: center;
            width: 200px;
            color: #496573;
            box-sizing: border-box;
            padding-left: 10px;
            font-size: 14px;
            font-weight: bold;
            border-right: 1px solid #ddd;
        }
        .field-value {
            display: flex;
            align-items: center;
            box-sizing: border-box;
            padding-left: 10px;
            font-size: 12px;
        }
    }
}
</style>
