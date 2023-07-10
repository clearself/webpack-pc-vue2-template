<template>
    <div class="event data-access">
        <div class="event-content w100">
            <div class="ub w100 ub-pj">
                <div class="list-tips" style="margin-bottom: 4px;">
                    新建接入
                </div>
                <div class="ub ub-pe">
                    <el-button size="small" @click="back">取 消</el-button>
                    <el-button size="small" @click="reserFun">重 置</el-button>
                    <el-button size="small" type="primary" @click="validAdd('formData')">保 存</el-button>
                </div>

            </div>
            <div style="padding:30px 0 0 0px;">
                <el-form ref="formData" :model="formData" label-width="105px" :rules="formDataRules" label-position="top">
                    <div class="ub w100 ub-pj">
                        <el-form-item label="任务名称：" style="width: 30%" prop="taskName" size="small">
                            <el-input clearable v-model="formData.taskName" size="small" placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="工作节点：" style="width: 30%;" prop="nodeId" size="small">
                            <el-select filterable v-model="formData.nodeId" size="small" style="width: 100%" placeholder="请选择">
                                <el-option v-for="(item, index) in nodeIdList" :key="index" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="接入类型：" style="width: 30%;" prop="type" size="small">
                            <el-select filterable  v-model="formData.type" size="small" style="width: 100%" placeholder="请选择">
                                <el-option v-for="(item, index) in typeList" :key="index" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="ub w100 ub-pj">

                        <el-form-item label="解析规则："  style="width: 30%;" prop="ruleIdList" size="small">
                            <el-select filterable v-model="formData.ruleIdList" size="small" style="width: 100%" placeholder="请选择" multiple collapse-tags>
                                <el-option v-for="(item, index) in ruleIdList" :key="index" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </el-form>
                <!-- 目录 -->
                <el-form ref="catalogueForm" :model="catalogueForm" label-width="105px" :rules="catalogueRules"  v-if="formData.type===1" label-position="top">
                    <div class="ub w100 ub-as">
                        <el-form-item label="编码：" style="width: 30%;" prop="encode" size="small">
                            <el-select filterable  v-model="catalogueForm.encode" size="small" style="width: 100%" placeholder="请选择">
                                <el-option v-for="(item, index) in encodeList" :key="index" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="文件路径：" style="width: 30%; margin-left:5%" prop="path" size="small">
                            <el-input clearable v-model="catalogueForm.path" size="small" placeholder="请填写文件路径"></el-input>
                        </el-form-item>
                    </div>
                </el-form>
                <!-- 数据库 -->
                <el-form ref="databaseForm" :model="databaseForm" label-width="105px" :rules="databaseRules"  v-if="formData.type===2" label-position="top">
                    <div class="ub w100 ub-pj">
                        <el-form-item label="数据库类型：" style="width: 30%;" prop="dbType" size="small">
                            <el-select filterable  v-model="databaseForm.dbType" size="small" style="width: 100%" placeholder="请选择">
                                <el-option v-for="(item, index) in dbTypeList" :key="index" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="库或实例名：" style="width: 30%;" prop="database" size="small">
                            <el-input clearable v-model="databaseForm.database" size="small" placeholder="请填写库或实例名"></el-input>
                        </el-form-item>
                        <el-form-item label="数据库地址：" style="width: 30%;" prop="ip" size="small">
                            <el-input clearable v-model="databaseForm.ip" size="small" placeholder="请输入"></el-input>
                        </el-form-item>
                    </div>
                    <div class="ub w100 ub-pj">
                        <el-form-item label="端口：" style="width: 30%;" prop="port" size="small">
                            <el-input clearable v-model="databaseForm.port" size="small" placeholder="请填写端口"></el-input>
                        </el-form-item>
                        <el-form-item label="用户名：" style="width: 30%;" prop="username" size="small">
                            <el-input clearable v-model="databaseForm.username" size="small" placeholder="请填写用户名"></el-input>
                        </el-form-item>
                        <el-form-item label="密码：" style="width: 30%;" prop="password" size="small">
                            <el-input  show-password clearable v-model="databaseForm.password" size="small" placeholder="请填写密码"></el-input>
                        </el-form-item>
                    </div>
                    <div class="ub w100 ub-pj">
                        <el-form-item label="表名：" style="width: 30%;" prop="table" size="small">
                            <el-input clearable v-model="databaseForm.table" size="small" placeholder="请填写表名"></el-input>
                        </el-form-item>
                        <el-form-item label="递增字段：" style="width: 30%;" prop="incrementalField" size="small">
                            <el-input clearable v-model="databaseForm.incrementalField" size="small" placeholder="请填写递增字段"></el-input>
                        </el-form-item>
                        <el-form-item label="索引类型：" style="width: 30%;" prop="incrementalType" size="small">
                            <el-select filterable v-model="databaseForm.incrementalType" size="small" style="width: 100%" placeholder="请选择">
                                <el-option v-for="(item, index) in incrementalTypeList" :key="index" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="ub w100 ub-pj">
                        <el-form-item label="索引列：" style="width: 30%;" prop="indexColumn" size="small">
                            <el-input clearable v-model="databaseForm.indexColumn" size="small" placeholder="请填写索引列"></el-input>
                        </el-form-item>
                        <el-form-item label="索引起始位置：" style="width: 30%;" prop="indexStart" size="small">
                            <el-input-number v-model="databaseForm.indexStart" controls-position="right"  size="small" placeholder="请选择" style="width: 100%"></el-input-number>
                        </el-form-item>
                        <el-form-item label="索引步长：" style="width: 30%;" prop="indexPace" size="small">
                            <el-input-number v-model="databaseForm.indexPace " controls-position="right"  size="small" style="width: 100%"></el-input-number>
                        </el-form-item>
                    </div>
                    <div class="ub w100 ub-pj">
                        <el-form-item label="修改偏移：" style="width: 30%;" prop="indexOffset" size="small">
                            <el-select filterable  v-model="databaseForm.indexOffset" size="small" style="width: 100%" placeholder="请选择">
                                <el-option v-for="(item, index) in indexOffsetList" :key="index" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </el-form>
                <!-- kafka -->
                <el-form ref="kafkaForm" :model="kafkaForm" label-width="105px" :rules="kafkaRules"  v-if="formData.type===3" label-position="top">
                    <div class="ub w100 ub-pj">
                        <el-form-item label="kafka地址：" style="width: 30%;" prop="ip" size="small">
                            <el-input clearable v-model="kafkaForm.ip" size="small" placeholder="请填写Kafka地址"></el-input>
                        </el-form-item>
                        <el-form-item label="topic：" style="width: 30%;" prop="topic" size="small">
                            <el-input clearable v-model="kafkaForm.topic" size="small" placeholder="匹配通配符后，匹配多个topic，log*匹配所有log开头的topic"></el-input>
                        </el-form-item>
                        <el-form-item label="kafka版本号：" style="width: 30%;" prop="kafkaType" size="small">
                            <el-input clearable v-model="kafkaForm.kafkaType " size="small" placeholder="请填写kafka版本号"></el-input>
                        </el-form-item>
                    </div>
                    <div class="ub w100 ub-pj">
                        <el-form-item label="消费组ID：" style="width: 30%;" prop="consumeId" size="small">
                            <el-input clearable v-model="kafkaForm.consumeId" size="small" placeholder="请填写消费组ID"></el-input>
                        </el-form-item>
                        <el-form-item label="客户端ID：" style="width: 30%;" prop="customeId" size="small">
                            <el-input clearable v-model="kafkaForm.customeId " size="small" placeholder="请填写客户端ID"></el-input>
                        </el-form-item>
                        <el-form-item label="编码：" style="width: 30%;" prop="encode" size="small">
                            <el-select filterable  v-model="kafkaForm.encode" size="small" style="width: 100%" placeholder="请选择">
                                <el-option v-for="(item, index) in encodeList" :key="index" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="ub w100 ub-pj">
                        <el-form-item label="启用通配符：" style="width: 30%;" prop="wildcard" size="small">
                            <el-select filterable  v-model="kafkaForm.wildcard" size="small" style="width: 100%" placeholder="请选择">
                                <el-option v-for="(item, index) in wildcardList" :key="index" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="修改偏移：" style="width: 30%;" prop="indexOffset" size="small">
                            <el-select filterable  v-model="kafkaForm.indexOffset" size="small" style="width: 100%" placeholder="请选择">
                                <el-option v-for="(item, index) in indexOffsetList" :key="index" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="权限校验：" style="width: 30%;" prop="permissionCheck" size="small">
                            <el-select filterable  v-model="kafkaForm.permissionCheck" size="small" style="width: 100%" placeholder="请选择">
                                <el-option v-for="(item, index) in permissionCheckList" :key="index" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </el-form>
                <!-- syslog -->
                <el-form ref="syslogForm" :model="syslogForm" label-width="105px" :rules="syslogRules"  v-if="formData.type===4" label-position="top">
                    <div class="ub w100 ub-pj">
                        <el-form-item label="端口：" style="width: 30%;" prop="port" size="small">
                            <el-input clearable v-model="syslogForm.port " size="small" placeholder="请填写端口"></el-input>
                        </el-form-item>
                        <el-form-item label="编码：" style="width: 30%;" prop="encode" size="small">
                            <el-select filterable  v-model="syslogForm.encode" size="small" style="width: 100%" placeholder="请选择">
                                <el-option v-for="(item, index) in encodeList" :key="index" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="报送设备：" style="width: 30%;" prop="ip" size="small">
                            <el-input clearable v-model="syslogForm.ip" size="small" placeholder="请填写IP，多个IP以,隔开"></el-input>
                        </el-form-item>
                    </div>
                </el-form>
                <!-- HDFS -->
                <el-form ref="hdfsForm" :model="hdfsForm" label-width="105px" :rules="hdfsRules"  v-if="formData.type===5" label-position="top">
                    <div class="ub w100 ub-pj">
                        <el-form-item label="HDFS地址：" style="width: 30%;" prop="ip" size="small">
                            <el-input clearable v-model="hdfsForm.ip" size="small" placeholder="请填写HDFS地址"></el-input>
                        </el-form-item>
                        <el-form-item label="端口：" style="width: 30%;" prop="port" size="small">
                            <el-input clearable v-model="hdfsForm.port" size="small" placeholder="请填写端口"></el-input>
                        </el-form-item>
                        <el-form-item label="编码：" style="width: 30%;" prop="encode" size="small">
                            <el-select filterable  v-model="hdfsForm.encode" size="small" style="width: 100%" placeholder="请选择">
                                <el-option v-for="(item, index) in encodeList" :key="index" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="ub w100 ub-as">
                        <el-form-item label="修改偏移：" style="width: 30%;" prop="indexOffset" size="small">
                            <el-select filterable  v-model="hdfsForm.indexOffset" size="small" style="width: 100%" placeholder="请选择">
                                <el-option v-for="(item, index) in indexOffsetList" :key="index" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="文件路径：" style="width: 30%;margin-left: 5%" prop="path" size="small">
                            <el-input clearable v-model="hdfsForm.path" size="small" placeholder="请填写文件的绝对路径"></el-input>
                        </el-form-item>
                    </div>
                </el-form>
                <!-- ES -->
                <el-form ref="esForm" :model="esForm" label-width="105px" :rules="esRules"  v-if="formData.type===6" label-position="top">
                    <div class="ub w100 ub-pj">
                        <el-form-item label="ES索引：" style="width: 30%;" prop="esIndex" size="small">
                            <el-input clearable v-model="esForm.esIndex" size="small" placeholder="请填写ES索引"></el-input>
                        </el-form-item>
                        <el-form-item label="ES索引类型：" style="width: 30%;" prop="esincrementalType" size="small">
                            <el-input clearable v-model="esForm.esincrementalType" size="small" placeholder="请填写ES索引类型"></el-input>
                        </el-form-item>
                        <el-form-item label="查询语句：" style="width: 30%;" prop="queryStatement" size="small">
                            <el-input clearable v-model="esForm.queryStatement" size="small" placeholder="请填写查询语句"></el-input>
                        </el-form-item>
                    </div>
                    <div class="ub w100 ub-pj">

                        <el-form-item label="索引列：" style="width: 30%;" prop="indexColumn" size="small">
                            <el-input clearable v-model="esForm.indexColumn" size="small" placeholder="请填写索引列"></el-input>
                        </el-form-item>
                        <el-form-item label="索引列类型：" style="width: 30%;" prop="incrementalType" size="small">
                            <el-select filterable v-model="esForm.incrementalType" size="small" style="width: 100%" placeholder="请选择">
                                <el-option v-for="(item, index) in incrementalTypeList" :key="index" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="索引步长：" style="width: 30%;" prop="indexPace" size="small">
                            <el-input-number v-model="esForm.indexPace " controls-position="right"  size="small" style="width: 100%"></el-input-number>
                        </el-form-item>
                    </div>
                    <div class="ub w100 ub-pj">
                        <el-form-item label="集群名称：" style="width: 30%;" prop="colonyName" size="small">
                            <el-input clearable v-model="esForm.colonyName" size="small" placeholder="请填写集群名称"></el-input>
                        </el-form-item>
                    </div>
                    <div class="" style="width:100%;">
                        <div v-for="(item, index) in esForm.ips" :key="index" style="width:30%;">
                            <div class="ub" >
                                <el-form-item label="主机及端口：" style="width: 60%"  :prop="'ips.'+index+'.ip'" size="small" :rules="[{ required: true, message: '请输入主机', trigger: 'blur' }]">
                                    <el-input  clearable v-model="item.ip" size="small" placeholder="请输入"></el-input>
                                </el-form-item>
                                <div style="background: #dcdcdc;margin: 50px 10px 0px 10px;width:25px;height:2px"></div>
                                <el-form-item style="width: 30%;margin-top: 30px" :prop="'ips.'+index+'.port'"  size="small" label-width="0px" :rules="[{ required: true, message: '请输入端口', trigger: 'blur' }]">
                                    <el-input  clearable v-model="item.port" size="small" placeholder="请输入"></el-input>
                                </el-form-item>
                                <i v-show="esForm.ips.length>1" @click.stop="removeInfo(esForm.ips, index)" class="el-icon-remove-outline" style="color: #ff2727;cursor:pointer;font-size:14px;margin-left:10px;line-height: 90px"></i>
                                <i  @click.stop="addInfo(esForm.ips)" class="el-icon-circle-plus-outline" style="color: #0052d9;cursor:pointer;margin-left:10px;font-size:14px;line-height: 90px"></i>
                            </div>
                        </div>
                    </div>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
import Enum from './enum.js'
import Rules from './rules.js'
import { getLogstashNodes, saveData, update, getRules } from '@/server/data_manage/data_access.js'
export default {
    name: 'DataAccessAdd',
    data() {
        return {
            permissionCheckList: Enum.permissionCheckList(),
            wildcardList: Enum.wildcardList(),
            indexOffsetList: Enum.indexOffsetList(),
            incrementalTypeList: Enum.incrementalTypeList(),
            dbTypeList: Enum.dbTypeList(),
            encodeList: Enum.encodeList(),
            typeList: Enum.typeList(),

            formDataRules: Rules.formDataRules(),
            catalogueRules: Rules.catalogueRules(),
            esRules: Rules.esRules(),
            hdfsRules: Rules.hdfsRules(),
            syslogRules: Rules.syslogRules(),
            kafkaRules: Rules.kafkaRules(),
            databaseRules: Rules.databaseRules(),
            ruleIdList: [],
            nodeIdList: [],
            formData: {
                id: '',
                taskName: '',
                type: '',
                nodeId: '',
                ruleIdList: [],
                dataSourceType: 1,
                dataSourceTaget: '',
                status: 2
            },
            esForm: {
                colonyName: '',
                // ip: '',
                // port: '',
                esIndex: '',
                incrementalType: 1,
                queryStatement: '',
                indexColumn: '',
                esincrementalType: '',
                indexPace: 1,
                ips: [{
                    ip: '',
                    port: ''
                }]
            },
            hdfsForm: {
                ip: '',
                path: '',
                encode: 1,
                indexOffset: 0,
                port: ''
            },
            syslogForm: {
                encode: 1,
                port: '',
                ip: ''
            },
            kafkaForm: {
                ip: '',
                topic: '',
                kafkaType: '',
                consumeId: '',
                customeId: '',
                encode: 1,
                wildcard: 0,
                indexOffset: 0,
                permissionCheck: 0
            },
            databaseForm: {
                dbType: 1,
                database: '',
                ip: '',
                port: '',
                username: '',
                password: '',
                table: '',
                incrementalField: '',
                incrementalType: 1,
                indexColumn: '',
                indexStart: 1,
                indexPace: 1,
                indexOffset: 0
            },
            catalogueForm: {
                path: '',
                encode: 1
            }
        }
    },
    watch: {
        'formData.type': function(val, oldVla) {
            if (oldVla === 1) {
                this.$refs.catalogueForm.resetFields()
                // for (let attr in this.catalogueForm) {
                //     this.catalogueForm[attr] = ''
                // }
            } else if (oldVla == 2) {
                this.$refs.databaseForm.resetFields()
                // for (let attr in this.databaseForm) {
                //     this.databaseForm[attr] = ''
                // }
            } else if (oldVla == 3) {
                this.$refs.kafkaForm.resetFields()
                // for (let attr in this.kafkaForm) {
                //     this.kafkaForm[attr] = ''
                // }
            } else if (oldVla == 4) {
                this.$refs.syslogForm.resetFields()
                // for (let attr in this.syslogForm) {
                //     this.syslogForm[attr] = ''
                // }
            } else if (oldVla == 5) {
                this.$refs.hdfsForm.resetFields()
                // for (let attr in this.hdfsForm) {
                //     this.hdfsForm[attr] = ''
                // }
            } else if (oldVla == 6) {
                this.$refs.esForm.resetFields()
                this.esForm.colonyName = ''
                this.esForm.esIndex = ''
                this.esForm.incrementalType = 1
                this.esForm.queryStatement = ''
                this.esForm.indexColumn = ''
                this.esForm.esincrementalType = ''
                this.esForm.indexPace = 1
                this.esForm.ips = [{ ip: '', port: '' }]
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.getLogstashNodesData()
            this.getRulesData()
            let dataAccessInfo = this.$getlocalStorage('dataAccessInfo')
            if (dataAccessInfo.id) {
                this.initEditData()
            }
        })
    },
    beforeDestroy() {
        this.$removelocalStorage('dataAccessInfo')
    },
    methods: {
        addInfo(data) {
            data.push({
                ip: '',
                port: ''
            })
        },
        removeInfo(data, index) {
            data.splice(index, 1)
        },
        getRulesData() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            getRules(data).then(res => {
                this.ruleIdList = res
            }).catch(error => {
                console.log('error', error)
            })
        },
        initEditData() {
            let dataAccessInfo = this.$getlocalStorage('dataAccessInfo')
            this.formData.id = dataAccessInfo.id
            this.formData.taskName = dataAccessInfo.taskName
            this.formData.type = dataAccessInfo.type
            this.formData.nodeId = dataAccessInfo.nodeId
            if (dataAccessInfo.ruleId) {
                this.formData.ruleIdList = dataAccessInfo.ruleId.split(',')
            } else {
                this.formData.ruleIdList = []
            }
            this.formData.dataSourceType = dataAccessInfo.dataSourceType
            this.formData.dataSourceTaget = dataAccessInfo.dataSourceTaget
            this.formData.status = dataAccessInfo.status
            let configContent = JSON.parse(dataAccessInfo.configContent)
            if (dataAccessInfo.type === 1) {
                this.catalogueForm = configContent
            } else if (dataAccessInfo.type === 2) {
                this.databaseForm = configContent
            } else if (dataAccessInfo.type === 3) {
                this.kafkaForm = configContent
            } else if (dataAccessInfo.type === 4) {
                this.syslogForm = configContent
            } else if (dataAccessInfo.type === 5) {
                this.hdfsForm = configContent
            } else if (dataAccessInfo.type === 6) {
                this.esForm = configContent
            }
        },
        getLogstashNodesData() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            getLogstashNodes(data).then(res => {
                this.nodeIdList = res
            }).catch(error => {
                console.log('error', error)
            })
        },
        reserFun() {
            this.$refs.formData.resetFields()
            if (this.formData.type === 1) {
                this.$refs.catalogueForm.resetFields()
                // for (let attr in this.catalogueForm) {
                //     this.catalogueForm[attr] = ''
                // }
            } else if (this.formData.type == 2) {
                this.$refs.databaseForm.resetFields()
                // for (let attr in this.databaseForm) {
                //     this.databaseForm[attr] = ''
                // }
            } else if (this.formData.type == 3) {
                this.$refs.kafkaForm.resetFields()
                // for (let attr in this.kafkaForm) {
                //     this.kafkaForm[attr] = ''
                // }
            } else if (this.formData.type == 4) {
                this.$refs.syslogForm.resetFields()
                // for (let attr in this.syslogForm) {
                //     this.syslogForm[attr] = ''
                // }
            } else if (this.formData.type == 5) {
                this.$refs.hdfsForm.resetFields()
                // for (let attr in this.hdfsForm) {
                //     this.hdfsForm[attr] = ''
                // }
            } else if (this.formData.type == 6) {
                this.$refs.esForm.resetFields()
                this.esForm.colonyName = ''
                this.esForm.esIndex = ''
                this.esForm.incrementalType = 1
                this.esForm.queryStatement = ''
                this.esForm.indexColumn = ''
                this.esForm.esincrementalType = ''
                this.esForm.indexPace = 1
                this.esForm.ips = [{ ip: '', port: '' }]
            }
        },
        back() {
            this.$router.go(-1)
        },
        validAdd(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.formData.type === 1) {
                        this.formData.dataSourceTaget = this.catalogueForm.path
                        this.validChild('catalogueForm')
                    } else if (this.formData.type === 2) {
                        this.formData.dataSourceTaget = this.databaseForm.ip + this.databaseForm.port
                        this.validChild('databaseForm')
                    } else if (this.formData.type === 3) {
                        this.formData.dataSourceTaget = this.kafkaForm.ip
                        this.validChild('kafkaForm')
                    } else if (this.formData.type === 4) {
                        this.formData.dataSourceTaget = this.syslogForm.ip
                        this.validChild('syslogForm')
                    } else if (this.formData.type === 5) {
                        this.formData.dataSourceTaget = this.hdfsForm.ip
                        this.validChild('hdfsForm')
                    } else if (this.formData.type === 6) {
                        let dataSourceTaget = []
                        this.esForm.ips.forEach(item => {
                            dataSourceTaget.push(`${item.ip}:${item.port}`)
                        })
                        this.formData.dataSourceTaget = dataSourceTaget.join(',')
                        this.validChild('esForm')
                    }
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        validChild(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.formData.id) {
                        this.edit()
                    } else {
                        this.save()
                    }
                    console.log('验证通过', formName)
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        edit() {
            let data = {}
            if (this.formData.type === 1) {
                data = {
                    queryData: {},
                    paramsData: { ...this.formData, configContentObj: { ...this.catalogueForm }}
                }
            } else if (this.formData.type === 2) {
                data = {
                    queryData: {},
                    paramsData: { ...this.formData, configContentObj: { ...this.databaseForm }}
                }
            } else if (this.formData.type === 3) {
                data = {
                    queryData: {},
                    paramsData: { ...this.formData, configContentObj: { ...this.kafkaForm }}
                }
            } else if (this.formData.type === 4) {
                data = {
                    queryData: {},
                    paramsData: { ...this.formData, configContentObj: { ...this.syslogForm }}
                }
            } else if (this.formData.type === 5) {
                data = {
                    queryData: {},
                    paramsData: { ...this.formData, configContentObj: { ...this.hdfsForm }}
                }
            } else if (this.formData.type === 6) {
                data = {
                    queryData: {},
                    paramsData: { ...this.formData, configContentObj: { ...this.esForm }}
                }
            }
            update(data).then(res => {
                this.$message({
                    message: '修改成功！',
                    type: 'success'
                })
                setTimeout(this.back, 1500)
            }).catch(error => {
                console.log('error', error)
            })
        },
        save() {
            let data = {}
            if (this.formData.type === 1) {
                data = {
                    queryData: {},
                    paramsData: { ...this.formData, configContentObj: { ...this.catalogueForm }}
                }
            } else if (this.formData.type === 2) {
                data = {
                    queryData: {},
                    paramsData: { ...this.formData, configContentObj: { ...this.databaseForm }}
                }
            } else if (this.formData.type === 3) {
                data = {
                    queryData: {},
                    paramsData: { ...this.formData, configContentObj: { ...this.kafkaForm }}
                }
            } else if (this.formData.type === 4) {
                data = {
                    queryData: {},
                    paramsData: { ...this.formData, configContentObj: { ...this.syslogForm }}
                }
            } else if (this.formData.type === 5) {
                data = {
                    queryData: {},
                    paramsData: { ...this.formData, configContentObj: { ...this.hdfsForm }}
                }
            } else if (this.formData.type === 6) {
                data = {
                    queryData: {},
                    paramsData: { ...this.formData, configContentObj: { ...this.esForm }}
                }
            }
            saveData(data).then(res => {
                console.log('保存成功', res)
                this.$message({
                    message: '保存成功！',
                    type: 'success'
                })
                setTimeout(this.back, 1500)
            }).catch(error => {
                console.log('error', error)
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .event-wrapper{
        height:100%;
        box-sizing: border-box;

    }
    .event-content {
        height: -webkit-calc(100vh - 98px);
        height: -moz-calc(100vh - 98px);
        height: -ms-calc(100vh - 98px);
        height: calc(100vh - 98px);
        box-sizing: border-box;
        padding:20px;
        background-color: #fff;
        // background-image: url(../../../assets/img/dialog-bg2.png);
        // background-position: right 200px;
        // background-repeat: no-repeat;
        // background-size: 200px 320px;
        overflow-y: auto;
    }
    .sure-btn{
        margin: 50px;
        box-sizing: border-box;
    }
    .match-con ::v-deep .el-checkbox__label{
        color:#fff;
    }
    .match-con ::v-deep .is-checked .el-checkbox__label{
        color:#409EFF;
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
    .event  ::v-deep  .el-input-number__decrease {
        // border-left: 1px solid #1cd7fa;
        // color: #1cd7fa;
    }
    .event  ::v-deep  .el-input-number__increase {
        // border-left: 1px solid #1cd7fa;
        // border-bottom: 1px solid #1cd7fa;
        // color: #1cd7fa;
    }
    .event  ::v-deep  .el-input-number__decrease, .event  ::v-deep  .el-input-number__increase {
        background-color: transparent;
    }
    .el-select-dropdown.is-multiple .el-select-dropdown__item.selected::after{
        // color: #1cd7fa;
    }
</style>
