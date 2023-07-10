<template>
    <div class="list">
        <div class="ub mb-1" style="justify-content: space-around;">
            <div class="ub ub-f1 chart-box mr-1">
                <div class="ub ub-f1 ub-ac statistic-item">
                    <div class="ub ub-ver">
                        <div class="ml-2" style="font-size:12px"><i class="iconfont icon-dengjizichan" style="font-size:12px;color:#efcef7;margin-right:5px"></i>防守总量</div>
                        <div style="color:#cf68e6;margin-left:35px;font-size: 20px;margin-top:5px">{{top_data.num1}}</div>
                    </div>
                    <div class="ub-f1 text-right" style="padding-right: 1px;padding-top: 3px;">
                        <img style="height:82px" src="../../assets/img/defense_drill/defense_top1.png" alt="">
                    </div>
                </div>
            </div>
            <div class="ub ub-f1 chart-box mr-1">
                <div class="ub ub-f1 ub-ac statistic-item">
                    <div class="ub ub-ver">
                        <div class="ml-2" style="font-size:12px"><i class="iconfont icon-gongjifangcheng-shenhe" style="font-size:12px;color:#61cfa9;margin-right:5px"></i>已审核防守</div>
                        <div style="color:#61cfa9;margin-left:35px;font-size: 20px;margin-top:5px">{{top_data.num2}}</div>
                    </div>
                    <div class="ub-f1 text-right" style="padding-right: 0px;padding-top: 3px;">
                        <img style="height:82px" src="../../assets/img/defense_drill/defense_top2.png" alt="">
                    </div>
                </div>
            </div>
            <div class="ub ub-f1 chart-box mr-1">
                <div class="ub ub-f1 ub-ac statistic-item">
                    <div class="ub ub-ver">
                        <div class="ml-2" style="font-size:12px"><i class="iconfont icon-gongjifangcheng-daishenhe" style="font-size:12px;color:#f29960;margin-right:5px"></i>待审核防守</div>
                        <div style="color:#f29960;margin-left:35px;font-size: 20px;margin-top:5px">{{top_data.num3}}</div>
                    </div>
                    <div class="ub-f1 text-right" style="padding-right: 0px;padding-top: 3px;">
                        <img style="height:82px" src="../../assets/img/defense_drill/defense_top3.png" alt="">
                    </div>
                </div>
            </div>
            <div class="ub ub-f1 chart-box">
                <div class="ub ub-f1 ub-ac statistic-item">
                    <div class="ub ub-ver">
                        <div class="ml-2" style="font-size:12px"><i class="iconfont icon-gongjifangchengguo-defen" style="font-size:12px;color:#4a89f0;margin-right:5px"></i>防守得分</div>
                        <div style="color:#4a89f0;margin-left:35px;font-size: 20px;margin-top:5px">{{top_data.num4}}</div>
                    </div>
                    <div class="ub-f1 text-right" style="padding-right: 0px;padding-top: 3px;">
                        <img style="height:82px" src="../../assets/img/defense_drill/defense_top4.png" alt="">
                    </div>
                </div>
            </div>
        </div>
        <SearchTop @search="search_attack" @reset="reset">
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params">
                    <el-form-item label="演练任务：" label-width="80px">
                        <el-select size="small" clearable filterable v-model.trim="get_params.match" placeholder="请选择演练">
                            <el-option v-for="item in matchs" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-col>
        </SearchTop>
        <div class="list-container" style="margin-top:-2px;box-shadow:none">
            <div class="ub ub-pj w100 mb-1 ub-ac">
                <div class="list-tips">防守方成果</div>
                <div>
                    <el-button icon="el-icon-plus" size="small" type="primary" @click="showCreateRecord" v-per="['defense_fs_add']">添加成果</el-button>
                    <el-button size="small" type="primary" @click="downData" icon="iconfont icon-daochu" v-per="['defense_fs_exp']">导出成果</el-button>
                    <el-button style="margin-left: 10px;" icon="iconfont icon-daoru" title="成果导入" @click="uploadDialog=true" size="small" type="primary" v-per="['defense_fs_imp']">导入成果</el-button>
                    <el-button icon="el-icon-download" @click="downLoad" size="small" type="primary"  style="margin-left: 10px;" v-per="['defense_fs_download']">下载模板</el-button>
                    <el-button size="small" type="danger" style="margin-left:10px" icon="el-icon-delete" @click="deleteAll" v-per="['defense_fs_del']">删除</el-button>
                </div>
            </div>
            <el-table
                class="bigTable"
                v-loading="loading"
                style="margin-top: 10px;"
                :data="tableData"
                border
                stripe
                @selection-change="handleSelectionChange"
                :row-class-name="tableRowClassName"
                :height="tabHeight"
                :row-style="{ height: '32px' }"
                :header-row-style="{ height: '32px' }">
                <el-table-column align="center" type="selection" width="50"></el-table-column>
                <el-table-column align="center" type="index" label="序号" width="50" :index="indexAttackMethod">
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="match_name" label="演练名称" width="200px">
                </el-table-column>
                <el-table-column prop="last_state" label="状态" width="100" :render-header="renderHeader">
                    <template slot-scope="scope">
                        <div>
                            <div v-if="scope.row.last_state_id==1" class="ub ub-ac last-state one">
                                <div style="width:80px;text-align:center">{{scope.row.last_state}}</div>
                            </div>
                            <div v-if="scope.row.last_state_id==2" class="ub ub-ac last-state two">
                                <div style="width:80px;text-align:center">{{scope.row.last_state}}</div>
                            </div>
                            <div v-if="scope.row.last_state_id==3" class="ub ub-ac last-state three">
                                <div style="width:80px;text-align:center">{{scope.row.last_state}}</div>
                            </div>
                            <div v-if="scope.row.last_state_id==4" class="ub ub-ac last-state four">
                                <div style="width:80px;text-align:center">{{scope.row.last_state}}</div>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="target_system" label="目标系统" width="200px">
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="target_ip" label="目标ip" width="170px">
                </el-table-column>
                <el-table-column prop="URL" label="URL" width="150px" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="attack_way" label="攻击手段">
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="attack_ip" label="攻击IP" width="170px">
                </el-table-column>
                <el-table-column prop="defense_way" label="防御手段">
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="defense_time" label="防御时间" width="170px">
                </el-table-column>
                <el-table-column label="得分">
                    <template slot-scope="scope">
                        <span class="num-btn" style="color:#0052D9;">{{scope.row.score}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="submitter" label="提交人">
                </el-table-column>
                <el-table-column prop="submit_time" label="提交时间" width="170px">
                </el-table-column>
                <el-table-column prop="reviewer_time" label="审核时间" width="170px">
                </el-table-column>
                <el-table-column align="center" fixed="right" label="操作" width="160px" class-name="deepBg">
                    <template slot-scope="scope">
                        <el-button @click="handleAttackSee(scope.row)" size="small" type="text" v-per="['defense_fs_view']">查看</el-button>
                        <el-button :disabled="scope.row.isCheck" @click="handleAttackEdit(scope.row)" size="small" type="text" v-per="['defense_fs_edit']">编辑</el-button>
                        <el-button :disabled="scope.row.isCheck" @click="handleAttackdelete(scope.row)" size="small" type="text" v-per="['defense_fs_del']">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size"  style="padding-top:10px" @pagination="get_attack_record"/>
        </div>

        <el-dialog title="赛事审核" :visible.sync="checkDialog" width="700px" custom-class="common-dialog">
            <el-form ref="checkForm" :model="checkForm" :rules="checkFormRule" label-width="100px" label-position="top">
                <el-form-item label="打 分:" prop="score">
                    <el-input size="mini" style="width:100%;" clearable placeholder="演练打分" v-model.trim="checkForm.score" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item style="margin-top: 30px;" label="打分理由:">
                    <el-input type="textarea" :rows="3" v-model="checkForm.reason" placeholder="请输入理由"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="ub ub-pe dialog-footer">
                <el-button size="small" style="margin-left: 10px;" @click="checkDialog = false">取消</el-button>
                <el-button title="确 定" size="small" type="primary" @click="sure_check">确定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="成果导入" :visible.sync="uploadDialog" width="700px" custom-class="common-dialog">
            <el-form ref="uploadForm" :model="uploadForm" :rules="uploadFormRule" label-width="100px" label-position="top">
                <el-form-item label="演练:" prop="match">
                    <el-select size="small" clearable filterable v-model.trim="uploadForm.match" placeholder="请选择" style="width:100%">
                        <el-option v-for="item in matchs" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="margin-top: 30px;" label="上传附件:">
                    <el-upload :headers="header" ref="upload" action="api/defense-drill/manage/record/importExcel" :file-list="fileList" :data="{'type':2,'id':uploadForm.match}" :auto-upload="false" multiple name="file" :on-success="uploadSuccess">
                        <el-button size="small" type="primary">选择附件</el-button>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer" class="ub ub-pe dialog-footer">
                <el-button size="small" style="margin-left: 10px;" @click="uploadDialog = false">取消</el-button>
                <el-button title="确 定" size="small" type="primary" @click="submitUpload">确定</el-button>
            </span>
        </el-dialog>
        <DeleteDialog
            :dialogVisible = deleteAttackDialog
            @delete="delete_attack"
            @cancel="deleteAttackDialog = false">
        </DeleteDialog>
        <DeleteDialog
            :dialogVisible = deleteAllAttackDialog
            @delete="delete_all_attack"
            @cancel="deleteAllAttackDialog = false">
        </DeleteDialog>
    </div>
</template>

<script>
import {
    get_records,
    get_attract_defense_match_list_select,
    sure_check,
    delete_record,
    recordTemplate,
    recordExportExcel
} from '../../server/defense_drill/defense.js'
function isNum(val) {
    var re = /^[0-9]+(.[0-9]{2})?$/
    if (re.test(val)) {
        return true
    } else {
        return false
    }
}
export default {
    name: 'Record',
    data() {
        var isNumber = (rule, value, callback) => {
            if (isNum(value)) {
                callback()
            } else {
                callback(new Error('分数不能为负数，保留两位小数'))
            }
        }
        return {
            tabHeight: document.body.clientHeight - 338,
            fileList: [],
            file_num: 0,
            uploadDialog: false,
            uploadForm: {
                match: ''
            },
            top_data: {
                num1: 0,
                num2: 0,
                num3: 0,
                num4: 0,
                num5: 0
            },
            visible: false,
            deleteAllAttackDialog: false,
            checkId: '',
            checkDialog: false,
            checkForm: {
                score: '',
                reason: ''
                // isReplay:false,
            },
            uploadFormRule: {
                match: [{
                    required: true,
                    message: '请选择演练',
                    trigger: 'change'
                }]
            },
            checkFormRule: {
                score: [{
                    required: true,
                    trigger: 'blur',
                    validator: isNumber
                }]
            },
            deleteAttackId: '',
            deleteAttackDialog: false,
            matchs: [],
            loading: true,
            get_params: {
                match: '',
                lastState: '',
                size: 20,
                page: 1
            },
            total_num: 0,
            tableData: [],
            multipleSelection: [],
            statusVal: ''

        }
    },
    watch: {
        recordDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.recordForm.resetFields()
                    for (var attr in this.recordForm) {
                        this.recordForm[attr] = ''
                    }
                }
            }
        },
        checkDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.checkForm = {
                        score: '',
                        reason: '',
                        isReplay: false
                    }
                }
            }
        }
    },
    computed: {
        header() {
            return { token: this.$getlocalStorage('initInfo').user.token }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.initMatch()
            this.get_attack_record()
        })
    },
    methods: {
        downData() {
            recordExportExcel({ queryData: { type: 2 }, paramsData: {}}).then(res => {
                console.log(res)
            }).catch(err => {
                console.log(err)
            })
        },
        downLoad() {
            recordTemplate({ queryData: { type: 2 }, paramsData: {}}).then(res => {
                console.log(res)
            }).catch(error => {
                console.log(error)
            })
        },
        tableRowClassName({ row, rowIndex }) {
            console.log(rowIndex)
            if (rowIndex % 2) {
                return 'table-row2'
            } else {
                return 'table-row1'
            }
        },
        reset() {
            this.get_params = {
                match: '',
                lastState: '',
                size: 20,
                page: 1
            }
            this.get_attack_record()
        },
        renderHeader(h, {
            column
        }) { // 下拉框选项
            let filters = [{
                text: '默认',
                value: ''
            },
            {
                text: '待审核',
                value: 1
            },
            {
                text: '已审核',
                value: 2
            },
            {
                text: '驳回',
                value: 3
            }
            ]

            // 下拉框内容包裹在一个div里面
            return h(
                'div', {
                    style: {
                        height: 'auto'
                    }
                }, [
                    h(
                        'span', {
                            // div里面有一个文字提示：下拉框所属内容
                            style: {},
                            class: 'level-font-class'
                        },
                        '状态'
                    ),
                    h(
                        'el-select', {
                            // el-select实现下拉框
                            class: 'status-selsect iconfont icon-filter-fill',
                            style: {
                                width: '0px',
                                height: '0px',
                                color: '#3aa6e4 !important'
                            },
                            on: {
                                input: value => {
                                    // 随着下拉框的不同，文字框里的内容在边
                                    this.statusVal = value
                                    this.shaixuan(value)
                                }
                            },
                            props: {
                                size: 'mini',
                                value: this.statusVal // 文字框的内容取决于这个value，如果value不存在，会报错
                            }
                        }, [
                            // 下拉框里面填充选项，通过filters遍历map，为每一个选项赋值。
                            filters.map(item => {
                                return h('el-option', {
                                    props: {
                                        value: item.value,
                                        label: item.text
                                    }
                                })
                            })
                        ]
                    )
                ]
            )
        },
        shaixuan(val) {
            this.get_params.lastState = val
            this.get_attack_record()
        },
        deleteAll() {
            if (this.multipleSelection.length == 0) {
                this.$message({
                    message: '请先选择成绩',
                    type: 'warning'
                })
                return
            }
            this.deleteAllAttackDialog = true
        },
        delete_all_attack() {
            let ids = []
            this.multipleSelection.map(item => {
                ids.push(item.id)
            })
            let data = {
                queryData: {},
                paramsData: {
                    ids: ids.join(',')
                }
            }
            delete_record(data).then((res) => {
                console.log('删除成功', res)
                this.deleteAllAttackDialog = false
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_attack_record()
                }, 1500)
            }).catch((error) => {
                this.deleteAllAttackDialog = false
                console.log(error)
            })
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        },

        indexAttackMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        handleAttackSee(obj) {
            let changeAttackDetail = {
                id: obj.id,
                match: obj.match_name,
                matchTime: obj.defense_time,
                target_system: obj.target_system,
                targetPort: obj.targetPort,
                attackPort: obj.attackPort,
                URL: obj.URL,
                attrack_way: obj.attack_way,
                attrack_way_id: obj.attack_way_id,
                other_attrack_way: obj.attack_mode_content == null ? '' : obj.attack_mode_content,
                defense_way: obj.defense_way,
                defense_way_id: obj.defense_way_id,
                other_defense_way: obj.defense_mode_content == null ? '' : obj.defense_mode_content,
                target_ips: obj.target_ip,
                attrack_ips: obj.attack_ip,
                step: obj.step,
                gain: obj.gain,
                remark: obj.remark,
                submitter: obj.submitter,
                last_state_id: obj.last_state_id,
                submit_time: obj.submit_time,
                score: obj.score == '--' ? '' : obj.score,
                scoring_reason: obj.scoring_reason == '--' ? '' : obj.scoring_reason,
                reviewer_time: obj.reviewer_time
            }
            this.$setsessionStorage('changeAttackDetail', changeAttackDetail)
            this.$router.push({
                path: this.$route.path + '/detail',
                query: {
                    id: obj.id
                }
            })
        },
        handlecheck(obj) {
            let userInfo = this.$getsessionStorage('userInfo')
            let refenses = obj.refereeInfo
            if (refenses && refenses.length > 0) {
                let selectedRefense = refenses.filter(item => item.id === userInfo.id)
                if (selectedRefense && selectedRefense.length > 0) {
                    this.checkId = obj.id
                    this.checkDialog = true
                } else {
                    this.$message({
                        message: '对不起，您不是该赛事裁判不能审核！',
                        type: 'warning'
                    })
                }
            } else {
                this.$message({
                    message: '该战绩暂无裁判',
                    type: 'warning'
                })
            }
        },
        sure_check() {
            let data = {
                queryData: {},
                paramsData: {
                    id: this.checkId,
                    score: this.checkForm.score,
                    scoringReason: this.checkForm.reason
                }
            }
            sure_check(data).then((res) => {
                console.log(res)
                this.checkDialog = false
                this.$message({
                    message: '审核成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_attack_record()
                }, 1500)
            }).catch(error => {
                this.checkDialog = false
                console.log(error)
            })
        },
        showCreateRecord() {
            this.$router.push({
                path: this.$route.path + '/create'
            })
        },
        search_attack() {
            this.get_params.page = 1
            this.get_attack_record()
        },
        get_attack_record() {
            this.loading = true
            this.tableData = []
            let data = {
                queryData: {
                    page: this.get_params.page,
                    pageSize: this.get_params.size
                },
                paramsData: {
                    gameEventId: this.get_params.match,
                    status: this.get_params.lastState, // 最终状态
                    type: 2
                }
            }
            get_records(data).then((res) => {
                this.loading = false
                console.log('防守战绩列表', res)
                this.top_data = {
                    num1: res.countMap.amountCount,
                    num2: res.countMap.haveReviewCount,
                    num3: res.countMap.notReviewCount,
                    num4: res.countMap.amountScore,
                    num5: res.countMap.rank
                }
                this.total_num = res.list.total
                let list = res.list.records
                let userInfo = this.$getsessionStorage('userInfo')
                console.log('userInfo', userInfo)
                if (list.length > 0) {
                    list.forEach((item, index) => {
                        let obj = {}
                        obj.id = item.id
                        obj.match_name = item.gameEventName
                        obj.match_name_id = item.gameEventId
                        obj.target_system = item.targetSystem
                        obj.attackPort = item.attackPort
                        obj.targetPort = item.targetPort
                        obj.target_ip = item.targetIp
                        obj.URL = item.url
                        obj.attack_way = item.attackModeName
                        obj.attack_way_id = item.attackMode
                        obj.defense_way = item.defenseModeName
                        obj.defense_way_id = item.defenseMode
                        obj.attack_ip = item.attackIp
                        obj.defense_time = item.defenseTime
                        obj.score = this.$NullStr(item.score)
                        obj.scoring_reason = this.$NullStr(item.scoringReason)
                        obj.submitter = item.createName
                        obj.submit_time = item.createTime
                        obj.state = item.gameEventStatus
                        obj.last_state = item.statusName
                        obj.last_state_id = item.status
                        obj.attack_mode_content = item.attackModeContent
                        obj.defense_mode_content = item.defenseModeContent
                        obj.step = item.step
                        obj.gain = item.gain
                        obj.remark = item.remark
                        obj.reviewer_time = this.$NullStr(item.reviewerTime)
                        obj.refereeInfo = item.refereeInfo
                        if (item.refereeInfo && item.refereeInfo.length > 0) {
                            let newArr = []
                            item.refereeInfo.forEach(item => {
                                if (item) {
                                    newArr.push(item)
                                }
                            })
                            let selectedRefense = newArr.filter(item => {
                                console.log(item.id)
                                return item.id === userInfo.id
                            })
                            if (selectedRefense && selectedRefense.length > 0) {
                                obj.isCheck = true
                            } else {
                                obj.isCheck = false
                            }
                        } else {
                            obj.isCheck = false
                        }

                        this.tableData.push(obj)
                    })
                }
                console.log(this.tableData)
            }).catch((error) => {
                this.loading = false
                console.log(error)
            })
        },

        initMatch() {
            let data = {
                type: 2
            }
            get_attract_defense_match_list_select(data).then((res) => {
                console.log('防守所有赛事', res)
                let list = res
                if (list.length > 0) {
                    list.forEach((item, index) => {
                        let obj = {}
                        obj.value = item.id
                        obj.label = item.name
                        this.matchs.push(obj)
                    })
                }
            }).catch((error) => {
                console.log(error)
            })
        },

        handleAttackdelete(obj) {
            this.deleteAttackId = obj.id
            this.deleteAttackDialog = true
        },
        delete_attack() {
            let data = {
                queryData: {
                },
                paramsData: {
                    ids: this.deleteAttackId
                }
            }
            delete_record(data).then((res) => {
                console.log('删除成功', res)
                this.deleteAttackDialog = false
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_attack_record()
                }, 1500)
            }).catch((error) => {
                this.deleteAttackDialog = false
                console.log(error)
            })
        },
        handleAttackEdit(obj) {
            console.log(obj)
            if (obj.state == 1) {
                this.$message('该赛事已关闭，不能编辑！')
                return
            }
            let changeAttackForm = {
                id: obj.id,
                match: obj.match_name_id,
                matchTime: obj.defense_time,
                target_system: obj.target_system,
                targetPort: obj.targetPort,
                attackPort: obj.attackPort,
                URL: obj.URL,
                attrack_way: obj.attack_way_id,
                other_attrack_way: obj.attack_mode_content == null ? '' : obj.attack_mode_content,
                defense_way: obj.defense_way_id,
                other_defense_way: obj.defense_mode_content == null ? '' : obj.defense_mode_content,
                target_ips: obj.target_ip,
                attrack_ips: obj.attack_ip,
                step: obj.step,
                gain: obj.gain,
                remark: obj.remark
            }
            this.$setsessionStorage('changeAttackForm', changeAttackForm)
            this.$router.push({
                path: this.$route.path + '/edit',
                query: {
                    id: obj.id
                }
            })
        },
        handleAttackSizeChange(val) {
            this.get_params.size = val
            this.get_attack_record()
        },
        handleAttackCurrentChange(val) {
            this.get_params.page = val
            this.get_attack_record()
        },
        submitUpload() {
            this.$refs.upload.submit()
        },
        uploadSuccess(response, file, fileList) {
            this.file_num++
            if (this.file_num === fileList.length) {
                this.$message({
                    message: '上传成功！',
                    type: 'success'
                })
                this.uploadDialog = false
                this.fileList = []
                this.file_num = 0
                setTimeout(() => {
                    this.get_attack_record()
                }, 1200)
            }
        }
    }
}
</script>
<style lang="scss">
.last-state{
    width:80px;
    height:18px;
    padding:2px 20px;
    border-radius: 11px;
    &.one{
        background-color: #fde6d8;
        color:#de7400;
    }
    &.two{
        background-color: #ccf6e4;
        color:#03864f;
    }
    &.three{
        background-color: #d5e5fa;
        color:#0052d9;
    }
    &.four{
        background-color: #fad7dd;
        color:#aa0202;
    }
}
.el-table .status-selsect .el-input--mini .el-input__inner {
    display: none !important;
}
.el-table .status-selsect .el-input--mini .el-select__caret{
    display: none !important;
}
</style>
<style lang="scss" scoped>
.chart-box{
    height:80px;
    background:#fff;
    border-radius:4px;
}
</style>
