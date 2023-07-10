<template>
    <div class="list">
        <div class="ub w100" style="box-sizing: border-box;">
            <div class="event-content w100" :style="{'height':tabHeight+'px'}" style="overflow-y:auto">
                <div class="ub ub-pj w100 ub-ac" style="padding:10px">
                    <div style="color:rgba(0,0,0,0.9);font-size:14px">创建演练
                    </div>
                    <div>
                        <el-button size="small" @click="back">返回</el-button>
                        <el-button @click="validMatch('form')" size="small" type="primary">发布</el-button>
                    </div>
                </div>
                <el-form ref="form" :model="form" :rules="formRules" label-width="100px"  label-position="top">
                    <div class="base-box">
                        <div>
                            <div>
                                <div class="ub ub-pj">
                                    <el-form-item label="演练名称：" prop="name" size="small" style="width: calc((100% - 168px) / 3);">
                                        <el-input v-model.trim="form.name" placeholder="请输入"></el-input>
                                    </el-form-item>
                                    <el-form-item label="演练目标：" prop="gameAims" size="small" style="width: calc((100% - 168px) / 3);">
                                        <el-input v-model.trim="form.gameAims" placeholder="请输入"></el-input>
                                    </el-form-item>
                                    <el-form-item label="演练赛制：" size="small" style="width: calc((100% - 168px) / 3);">
                                        <el-select filterable v-model.trim="form.matchRule" placeholder="请选择" style="width: 100%">
                                            <el-option v-for="item in matchRule" :key="item.id" :label="item.name" :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>
                                <div class="ub ub-pj">
                                    <el-form-item label="演练时间：" prop="matchTime" size="small" style="width: calc((100% - 168px) / 3);">
                                        <el-date-picker prefix-icon="el-icon-date after" v-model.trim="form.matchTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width:100%">
                                        </el-date-picker>
                                    </el-form-item>

                                    <el-form-item label="演练介绍：" style="width: calc((100% - 168px) / 3);">
                                        <el-input type="textarea" rows="2" v-model.trim="form.desc" placeholder="请输入"></el-input>
                                    </el-form-item>
                                    <el-form-item label="注意事项：" style="width: calc((100% - 168px) / 3);">
                                        <el-input type="textarea" rows="2" v-model.trim="form.attention" placeholder="请输入"></el-input>
                                    </el-form-item>
                                </div>
                                <el-form-item style="display: block;" label="演练规则：" label-position="left">
                                    <el-upload :limit="1" ref="upload" action="/api/base-server/file/upload" :before-upload="beforeUpload" name="fileUpload" :data="uploadToken" :on-success="uploadFileSuccess" :on-error="uploadFileError" :on-exceed="limitFun" >
                                        <el-button size="small" type="primary">选择文件</el-button>
                                        <span slot="tip" class="el-upload__tip" style="padding-left:10px;">
                                            <i style="color:#606266;font-size:12px;" class="el-icon-info"></i>
                                            <span>仅支持ZIP、RAR、DOC、XLSX、PPT、JPG、PDF等格式文件，并且大小不超过10M</span>
                                        </span>
                                    </el-upload>
                                </el-form-item>
                            </div>
                        </div>
                    </div>
                    <div class="base-box">
                        <div class="ub ub-ac ub-pj w100 match-title">
                            <div style="color:rgba(0,0,0,.7)">参赛裁判：</div>
                            <div>
                                <el-button class="add" type="text" icon="el-icon-plus" @click="refereeListShow" size="mini">添加裁判</el-button>
                            </div>
                        </div>
                        <div>
                            <el-table :data="refereeData" border class='bigTable' :row-class-name="tableRowClassName">
                                <el-table-column type="index" width="50" label="序号" align="center">
                                </el-table-column>
                                <el-table-column prop="role" label="角色">
                                </el-table-column>
                                <el-table-column prop="name" label="姓名">
                                </el-table-column>
                                <el-table-column prop="idCard" label="邮箱">
                                </el-table-column>
                                <el-table-column prop="phone" label="手机号">
                                </el-table-column>
                                <el-table-column label="操作" width="50px" align="center">
                                    <template slot-scope="scope">
                                        <el-button @click="handleDeketeReferee(scope.row,scope.$index)" title="移除" icon="el-icon-remove-outline" style="color:red;font-size:14px" type="text" size="small"></el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <div class="ub ub-ac ub-pj w100 match-title" style="margin-top: 30px;">
                            <div style="color:rgba(0,0,0,.7)">参赛战队：</div>
                            <div>
                                <el-button type="text" class="add" icon="el-icon-plus" @click="createTeamDialog = true" size="mini">创建战队</el-button>
                            </div>
                        </div>
                        <div>
                            <el-table :data="teamList" border class='bigTable' :row-class-name="tableRowClassName">
                                <el-table-column type="index" width="50" label="序号" align="center">
                                </el-table-column>
                                <el-table-column prop="teamName" label="演练队伍">
                                </el-table-column>
                                <el-table-column prop="teamName" label="演练角色">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.roleId==0" style="font-size:12px;color:#02b3ff;">攻击方</span>
                                        <span v-if="scope.row.roleId==1" style="font-size:12px;color:#ff5d5e;">防守方</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="player_num" label="参加人数">
                                </el-table-column>
                                <el-table-column label="操作" width="80px" align="center">
                                    <template slot-scope="scope">
                                        <el-button @click="handleEditTeam(scope.row,scope.$index)" title="编辑人数" icon="el-icon-circle-plus-outline" style="color:#0052d9;font-size:14px" type="text" size="small"></el-button>
                                        <el-button @click="handleDeketeTeam(scope.row,scope.$index)" title="移除"  icon="el-icon-remove-outline" style="color:red;font-size:14px" type="text" size="small"></el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>

                </el-form>
            </div>
        </div>

        <el-dialog :visible.sync="refereeDialog" width="790px" custom-class="common-dialog" title="裁判列表">
            <div class="ub ub-ac ub-f1 ub-pj" style="margin: 10px 0;">
                <div style="width:40%;">
                    <el-input v-model.trim="get_referee_params.username" size="small" placeholder="搜索裁判姓名">
                        <!-- <i slot="suffix" class="iconfont icon-sousuo" style="line-height:32px;margin-right:5px;color:#387dee;font-size:14px" @click="get_referee"></i> -->
                        <el-button slot="append" icon="el-icon-search" @click="get_referee"></el-button>
                    </el-input>
                </div>
                <div>
                    <el-button icon="el-icon-refresh" type="text" @click="refreshReferee(1)" size="mini">刷 新</el-button>
                </div>
            </div>
            <el-table :data="referee_data" v-loading="referee_loading" ref="multipleTable"  :row-key="(row)=>{ return row.id}" border stripe @select="handleRefereeSelectionChange" class='bigTable' :row-class-name="tableRowClassName" @select-all="handleRefereeSelectionChangeAll">
                <el-table-column type="selection" width="50" align="center">
                </el-table-column>
                <el-table-column prop="role" label="角色">
                </el-table-column>
                <el-table-column prop="name" label="姓名">
                </el-table-column>
                <el-table-column prop="idCard" label="邮箱">
                </el-table-column>
                <el-table-column prop="phone" label="手机号">
                </el-table-column>
            </el-table>
            <pagination :total="total_referee_num" :page.sync="get_referee_params.page" :limit.sync="get_referee_params.size"  style="padding-top:10px" @pagination="get_referee"/>
            <span slot="footer" class="ub ub-pe dialog-footer">
                <el-button size="small" @click="refereeDialog = false">取消</el-button>
                <el-button size="small" type="primary" @click="sureReferee">确定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="创建战队" :visible.sync="createTeamDialog" width="790px" custom-class="common-dialog">
            <el-form ref="createTeamForm" :model="createTeamForm" :rules="createTeamRules" label-width="100px" label-position="top">
                <el-form-item label="战队名称：" prop="teamName" size="small" style="width:100%;margin-bottom: 10px;">
                    <el-input v-model.trim="createTeamForm.teamName" placeholder="战队名称"></el-input>
                </el-form-item>
                <div class="defense_drill_histoty_text" v-if="historyTeam.length>0" style="width:100%;font-size:12px;color:#00bfff;margin-left: 100px"><span>历史战队</span></div>
                <div v-if="historyTeam.length>0" style="width:100%;padding-left:100px;box-sizing: border-box;margin-top: 10px;">
                    <div class="defense_drill-history-list" style="background-color: rgba(0,0,0,.4);padding:20px;">
                        <div v-for="(item,index) in historyTeam" class="ub ub-ac w100 historyTeam active" style="margin: 10px 0;;font-size: 12px" :key="index" @click="getcurrentTeamInfo(item)">
                            <div style="width:50px;">{{index+1}}</div>
                            <div class="ub ub-f1">{{item.name}}</div>
                            <div style="width:50px;">{{item.num}}</div>
                        </div>
                    </div>
                </div>
                <el-form-item label="战队角色" prop="roleId" size="small" style="width:100%;margin-top: 30px;">
                    <el-select filterable v-model.trim="createTeamForm.roleId" placeholder="请选择" style="width: 100%;">
                        <el-option label="攻击方" value="0"></el-option>
                        <el-option label="防守方" value="1"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="ub ub-pe dialog-footer">
                <el-button size="small" @click="createTeamDialog = false">取消</el-button>
                <el-button size="small" type="primary" @click="validTeam('createTeamForm')">确定</el-button>
            </span>
        </el-dialog>
        <DeleteDialog
            :dialogVisible = delDialog
            @delete="delPlayers"
            @cancel="delDialog = false">
        </DeleteDialog>
        <DeleteDialog
            :dialogVisible = deleteDialog
            @delete="delete_team"
            @cancel="deleteDialog = false">
        </DeleteDialog>
        <DeleteDialog
            :dialogVisible = deleteRefereeDialog
            @delete="delete_referee"
            @cancel="deleteRefereeDialog = false">
        </DeleteDialog>
        <DeleteDialog
            :dialogVisible = revPlarersDialog
            @delete="sure_team"
            @cancel="revPlarersDialog = false">
        </DeleteDialog>

        <!-- 编辑战队 -->
        <el-dialog title="编辑人员" :visible.sync="editTeamDialog" width="700px" custom-class="common-dialog">
            <el-form ref="editTeamForm" :model="editTeamForm" :rules="createTeamRules" label-width="100px">
                <div class="transfer" style="text-align: center;position: relative;">
                    <div class="ub ub-ac ub-pj w100">
                        <div class="ub ub-ac" style="font-size:12px; color:#999;">将左侧列表中的人员选中至右侧框进行添加</div>
                        <div>
                            <el-button size="mini" icon="el-icon-refresh" type="text" @click="refreshReferee(2)">刷 新</el-button>
                        </div>
                    </div>

                    <el-transfer
                        style="text-align: left; display: flex;justify-content: space-between;background-color: rgba(0,0,0,0);"
                        v-model.trim="value4"
                        filter-placeholder="请输入人员名称"
                        filterable
                        :titles="['所有人员', '选中人员']"
                        :format="{
                            noChecked: '${total}',
                            hasChecked: '${checked}/${total}'
                        }"
                        :filter-method="filterMethod"
                        :data="transfer_data">
                        <span slot-scope="{ option }">{{ option.label }}</span>
                    </el-transfer>
                </div>
            </el-form>
            <span slot="footer" class="ub ub-pe dialog-footer">
                <el-button size="small" style="margin-left: 10px;" @click="editTeamDialog = false">取消</el-button>
                <el-button size="small" type="primary" @click="editvalidTeam">确定</el-button>
            </span>
        </el-dialog>
    </div>

</template>

<script>
import {
    get_match_sets,
    get_match_referee,
    public_match,
    get_historyTeam,
    get_current_team_info
} from '../../../server/defense_drill/defense.js'
import {
    getStoreUsers
} from '../../../server/defense_drill/base.js'
export default {
    name: 'CreateMatch',
    data() {
        return {
            uploadToken: {
                token: ''
                // path: '/file_logos/files/'
            },
            tabHeight: document.body.clientHeight - 90,
            revPlarers: [],
            revPlarersStr: '',
            revPlarersDialog: false,
            path: {
                path: '/file_defense/files/'
            },
            referee_loading: false,
            historyTeam: [],
            transfer_data: [],
            value4: [],
            curStoreId: '',
            deleteRefereeId: '',
            deleteRefereeDialog: false,
            editTeamDialog: false,
            group_totalPages: 0,
            total_group_num: 0,
            get_group_params: {
                name: '',
                page: 1,
                size: 10
            },
            getRefereeKeys(row) {
                return row.id
            },
            getGroupKeys(row) {
                return row.id
            },
            referee_totalPages: 0,
            total_referee_num: 0,
            get_referee_params: {
                username: '',
                page: 1,
                size: 10
            },
            multipleGroupSelection: [],
            groupData: [],
            createTeamDialog: false,
            refereeDialog: false,
            multipleRefereeSelection: [],
            referee_data: [],
            referee_data_cache: [],
            form: {
                name: '',
                gameAims: '',
                matchTime: [],
                startTime: '',
                endTime: '',
                seeForm: 1,
                seeTheme: 1,
                matchForm: 1,
                matchRule: '',
                ruleFileName: '',
                ruleFilePath: '',
                rule: '',
                desc: '',
                attention: ''
            },
            formRules: {
                name: [{
                    required: true,
                    message: '请输入赛事名称',
                    trigger: 'blur'
                }],
                matchTime: [{
                    required: true,
                    message: '请选择时间',
                    trigger: 'change'
                }]
            },
            storeOp: [],
            createTeamForm: {
                teamName: '',
                roleId: '',
                page: 1,
                size: 2000
            },
            editTeamForm: {
                id: '',
                storeId: ''
            },
            createTeamRules: {
                teamName: [{
                    required: true,
                    message: '请输入战队名称',
                    trigger: 'blur'
                }],
                roleId: [{
                    required: true,
                    message: '请选择战队角色',
                    trigger: 'change'
                }]
            },
            seeForm: [],
            seeTheme: [],
            matchForm: [],
            matchRule: [],
            data: {},
            loading: null,
            storeIdSelect: '',
            teamList: [],
            delPlayersId: '',
            delDialog: false,
            deleteId: '',
            deleteDialog: false,
            notifyPromise: Promise.resolve(),
            refereeList: [],
            url: '',
            current_players: [],
            current_players_rev: []
        }
    },
    computed: {
        refereeData() {
            return this.$store.state.referee.data
        },
        teamData() {
            console.log('this.$store.state.referee.teamData', this.$store.state.referee.teamData)
            return this.$store.state.referee.teamData
        }
    },
    created() {
        this.$removesessionStorage('team_data')
        this.$removesessionStorage('refresh_data')
        this.$store.dispatch('getRefresh', {
            data: []
        })
        this.$store.dispatch('getTeam', {
            data: {
                data: [],
                first: true
            }
        })
    },
    mounted() {
        this.$nextTick(() => {
            this.get_sets()
            this.get_referee()
            // this.getUsers()
            this.get_historyTeam()
            this.getToken()
        })
    },
    methods: {
        getToken() {
            let initInfo = this.$getlocalStorage('initInfo')
            this.uploadToken.token = initInfo.user.token
        },
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex % 2) {
                return 'table-row2'
            } else {
                return 'table-row1'
            }
        },
        getcurrentTeamInfo(item) {
            this.current_players = []
            console.log('11111', item)
            let data = {
                queryData: {},
                paramsData: {
                    teamId: item.id
                }
            }
            get_current_team_info(data).then((res) => {
                this.createTeamForm.teamName = item.name
                this.createTeamForm.roleId = item.type
                if (res.length > 0) {
                    this.current_players_rev = res
                    res.forEach(_item => {
                        this.current_players.push(_item.id)
                    })
                }
            }).catch((error) => {
                console.log(error)
            })
        },
        get_historyTeam() {
            get_historyTeam({}).then((res) => {
                console.log('历史战队', res)
                if (res.length > 0) {
                    res.forEach(item => {
                        let obj = {}
                        obj.id = item.id
                        obj.name = item.teamName
                        obj.num = item.num + '人'
                        obj.type = item.type + ''
                        this.historyTeam.push(obj)
                    })
                }
            }).catch((error) => {
                console.log(error)
            })
        },
        refreshReferee(state) {
            // if (state == 1) {
            //     this.get_referee()
            // } else {
            //     this.getUsers()
            // }
            this.get_referee()
        },
        addReferee() {
            if (this.$window.location.host === '10.11.102.43:20070') {
                window.open(encodeURI('http://10.11.102.43:20010?resourceName=基础信息维护'), '_blank')
            } else if (this.$window.location.host === '10.11.102.15:9780') {
                window.open(encodeURI('http://10.11.102.15:9180?resourceName=基础信息维护'), '_blank')
            }
        },
        filterMethod(value, row) {
            console.log(value)
            return row.label.indexOf(value) > -1
        },

        back() {
            this.$router.go(-1)
        },
        handleEditTeam(row, index) {
            console.log(row)
            console.log('index', index)
            let allPlayers = []

            this.teamList.map((item, _index) => {
                if (_index != index) {
                    allPlayers = allPlayers.concat(item.players)
                }
            })
            console.log(allPlayers)
            this.transfer_data = this.transfer_data.map(item => {
                if (allPlayers.some(_item => _item === item.key)) {
                    item.disabled = true
                } else {
                    item.disabled = false
                }
                return item
            })
            this.value4 = this.$deepCopy(row.players)
            this.editTeamId = row.id
            this.editTeamDialog = true
            this.editTeamForm.id = index
            this.editTeamForm.teamName = row.teamName
            // this.editTeamForm.storeId = this.storeOp[0].id;
            // this.getUsers(this.editTeamForm.storeId);
        },
        handleDeketeReferee(obj, index) {
            this.deleteRefereeId = index
            this.deleteRefereeDialog = true
        },
        handleDeketeTeam(obj, index) {
            this.deleteId = index
            this.deleteDialog = true
        },
        delete_team() {
            let team_data = this.teamList
            team_data.splice(this.deleteId, 1)
            this.teamList = team_data
            this.deleteDialog = false
        },
        delete_referee() {
            let referee_data = this.$store.state.referee.data
            referee_data.splice(this.deleteRefereeId, 1)
            this.$setsessionStorage('refresh_data', referee_data)
            this.$store.dispatch('getRefresh', {
                data: referee_data
            })
            this.deleteRefereeDialog = false
        },
        delPlayers() {
            let playerId = this.createTeamForm.userActiveData
            playerId.splice(this.delPlayersId, 1)
            this.createTeamForm.userActiveData = playerId

            let playerId2 = this.editTeamForm.userActiveData
            playerId2.splice(this.delPlayersId, 1)
            this.editTeamForm.userActiveData = playerId2

            this.delDialog = false
        },
        getUsers() {
            this.transfer_data = []
            let data = {
                queryData: {},
                paramsData: {}
            }
            getStoreUsers(data).then((res) => {
                console.log('users', res)
                if (res.length > 0) {
                    res.forEach(item => {
                        this.transfer_data.push({
                            key: item.id,
                            disabled: false,
                            label: item.chineseName + '-' + item.mfName
                        })
                    })
                }
            }).catch((error) => {
                console.log(error)
            })
        },
        validMatch(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.publickMatch()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        publickMatch() {
            console.log('form', this.form)
            let startTime = this.form.matchTime[0]
            let endTime = this.form.matchTime[1]
            let ids = []
            this.refereeData.forEach((item, index) => {
                ids.push(item.id)
            })
            let teamList = []
            let list = this.teamList
            list.forEach((item, index) => {
                let obj = {}
                obj.teamName = item.teamName
                let ids = []
                item.players.forEach((val, num) => {
                    ids.push(val)
                })
                obj.type = item.roleId
                obj.playerIdStr = ids.join(',')
                teamList.push(obj)
            })
            console.log('teamList', teamList)
            let data = {
                queryData: {},
                paramsData: {
                    name: this.form.name,
                    startTime: startTime,
                    endTime: endTime,
                    gameAims: this.form.gameAims,
                    // viewType:this.form.seeForm,
                    // viewTheme:this.form.seeTheme,
                    gameRuleFilePath: this.form.ruleFilePath,
                    gameRuleFileName: this.form.ruleFileName,
                    // /gameMode: this.form.matchForm,
                    gameSetting: this.form.matchRule,
                    gameSynopsis: this.form.desc,
                    precautions: this.form.attention,
                    refereeIdStr: ids.join(','),
                    gameEventTeamList: teamList
                }
            }
            console.log('data', data)
            public_match(data).then((res) => {
                console.log(res)
                this.$message({
                    message: '创建成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.$router.go(-1)
                }, 1500)
            }).catch((error) => {
                console.log(error)
            })
        },
        get_referee() {
            this.referee_loading = true
            this.referee_data = []
            let data = {
                queryData: {
                    page: this.get_referee_params.page,
                    size: this.get_referee_params.size
                },
                paramsData: {
                    refereeName: this.get_referee_params.username
                }
            }
            get_match_referee(data).then((res) => {
                this.referee_loading = false
                console.log('裁判', res)
                let list = res.records
                this.referee_totalPages = res.total
                this.total_referee_num = res.total
                if (list.length > 0) {
                    list.forEach((item, index) => {
                        let obj = {}
                        obj.id = item.id
                        obj.name = this.$NullStr(item.chineseName)
                        obj.role = this.$NullStr(item.roleName)
                        obj.idCard = this.$NullStr(item.mailbox)
                        obj.phone = this.$NullStr(item.phone)
                        this.referee_data.push(obj)
                        this.transfer_data.push({
                            key: item.id,
                            disabled: false,
                            label: item.chineseName
                        })
                    })
                }
                console.log(this.referee_data, 11111)
            }).then(() => {
                this.referee_data.forEach(item => {
                    if (this.referee_data_cache.some(_item => _item.id === item.id)) {
                        this.$refs.multipleTable.toggleRowSelection(item, true)
                        console.log(item)
                    }
                })
            }).catch((error) => {
                this.referee_loading = false
                console.log(error)
            })
        },
        get_sets() {
            get_match_sets({}).then((res) => {
                console.log('配置', res)
                // let seeForm = res.viewType;
                // let seeTheme = res.viewTheme;
                let matchForm = res.gameMode
                let matchRule = res.gameSetting
                console.log('matchRule', matchRule)
                // this.initMatchSet(seeForm, this.seeForm);
                // this.initMatchSet(seeTheme, this.seeTheme);
                // this.initMatchSet(matchForm, this.matchForm);
                this.initMatchSet(matchRule, this.matchRule)
            }).catch((error) => {
                console.log(error)
            })
        },
        initMatchSet(obj, val) {
            if (obj.length > 0) {
                obj.forEach((item, index) => {
                    let _obj = {}
                    if (index == 0) {
                        _obj.isActive = true
                    } else {
                        _obj.isActive = false
                    }
                    _obj.name = item.name
                    _obj.id = item.index
                    val.push(_obj)
                })
            }
        },
        validTeam(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.revPlarers = []
                    let allPlaters = []
                    this.teamList.forEach(item => {
                        allPlaters = allPlaters.concat(item.players)
                    })
                    allPlaters.forEach(item => {
                        if (this.current_players.some(_item => item === _item)) {
                            this.revPlarers.push(item)
                        }
                    })
                    if (this.revPlarers.length > 0) {
                        //
                        let names = []
                        this.revPlarersDialog = true
                        this.revPlarers.forEach(item => {
                            this.current_players_rev.forEach(_item => {
                                if (item === _item.id) {
                                    names.push(_item.chineseName)
                                }
                            })
                        })
                        this.revPlarersStr = this.createTeamForm.teamName + '战队成员：' + names.join('、') + ',在其它战队已经存在，是否删除继续添加？'
                    } else {
                        this.sureTeam()
                        this.$refs[formName].resetFields()
                        this.createTeamForm.roleId = ''
                        this.current_players = []
                    }
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        sure_team() {
            if (this.revPlarers.length > 0) {
                this.revPlarers.forEach(item => {
                    let index = this.current_players.findIndex(_item => _item === item)
                    this.current_players.splice(index, 1)
                })
            }
            this.sureTeam()
            this.$refs.createTeamForm.resetFields()
            this.createTeamForm.roleId = ''
            this.current_players = []
            this.revPlarersDialog = false
        },

        sureTeam() {
            this.createTeamDialog = false
            let obj = {}
            obj.teamName = this.createTeamForm.teamName
            if (this.current_players.length > 0) {
                obj.players = this.$deepCopy(this.current_players)
                obj.player_num = this.current_players.length
            } else {
                obj.players = []
                obj.player_num = obj.players.length
            }

            obj.roleId = this.createTeamForm.roleId
            this.teamList.push(obj)
        },
        editvalidTeam() {
            this.teamList = this.teamList.map((item, index) => {
                if (index == this.editTeamForm.id) {
                    item.players = this.$deepCopy(this.value4)
                    item.player_num = item.players.length
                }
                return item
            })
            this.editTeamDialog = false
            this.value4 = []
        },
        sureReferee() {
            this.refereeDialog = false
            this.$setsessionStorage('refresh_data', this.referee_data_cache)
            this.$store.dispatch('getRefresh', {
                data: this.referee_data_cache
            })
        },
        teamListShow() {
            this.createTeamDialog = true
        },
        refereeListShow() {
            this.refereeDialog = true
            this.referee_data_cache = this.$deepCopy(this.$store.state.referee.data)
            setTimeout(() => {
                this.$refs.multipleTable.clearSelection()
                this.referee_data.forEach(item => {
                    if (this.referee_data_cache.some(_item => _item.id === item.id)) {
                        this.$refs.multipleTable.toggleRowSelection(item, true)
                        console.log(item)
                    }
                })
            }, 0)
        },
        limitFun(files, fileList) {
            this.$message({
                message: '规则文件只能上传一份！',
                type: 'warning'
            })
        },
        beforeUpload(file) {
            if (file.size / 1024 / 1024 > 10) {
                this.$message({
                    message: '上传的附件不能大于10M！',
                    type: 'warning'
                })
                return false
            } else {
                this.loading = this.$loading({
                    lock: true,
                    text: '上传中...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                })
            }
        },
        uploadFileSuccess(response, file, fileList) {
            this.loading.close()
            console.log('上传图片', response)
            if (response.code == 1) {
                this.$message({
                    message: '文件上传成功!',
                    type: 'success'
                })
                var path = response.data
                this.form.ruleFilePath = '/api/base-server/file/download' + encodeURI(encodeURI(path))
                this.form.ruleFileName = path.substring(path.indexOf('files/') + 6, path.length)
            } else {
                this.$message({
                    message: response.message,
                    type: 'warning'
                })
            }
        },

        uploadFileError(obj) {
            this.loading.close()
            this.$message({
                message: '上传失败！请重新上传。',
                type: 'warning'
            })
            console.log('error', obj)
        },
        handleRefereeSizeChange(val) {
            this.referee_data = []
            this.get_referee_params.size = val
            this.get_referee()
            console.log('444444444444444', this.multipleRefereeSelection)
        },
        handleRefereeCurrentChange(val) {
            this.referee_data = []
            this.get_referee_params.page = val
            this.get_referee()
            console.log('55555555555', this.multipleRefereeSelection)
        },
        handleRefereeSelectionChange(selection, row) {
            console.log('selection', selection)
            console.log('row', row)
            let isSelect = selection.filter(item => item.id === row.id)
            if (isSelect.length > 0) {
                this.referee_data_cache.push(row)
            } else {
                let index = this.referee_data_cache.findIndex(item => item.id === row.id)
                this.referee_data_cache.splice(index, 1)
            }
            // this.multipleRefereeSelection = val;
        },
        handleRefereeSelectionChangeAll(selection) {
            console.log(selection)
            if (selection.length > 0) {
                this.referee_data_cache = selection
            } else {
                this.referee_data_cache = []
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.event-content{
    ::v-deep .el-form-item__label{
        line-height:32px !important;
    }
    ::v-deep .el-range-input{
        font-size:12px !important;
    }
}
.event {
    padding: 0px 20px 20px 0px;
    box-sizing: border-box;
    position: relative;
    .el-button--text {
        color: #a2ceec;
    }
    .el-button--text.add {
        color: #1cd7fa;
    }
    ::v-deep .el-transfer-panel__filter{
        margin: 0px;
        .el-input__inner {
            border-radius: 0px;
        }
    }

    ::v-deep .el-transfer__buttons {
        padding: 100px 0px 0 0px;
        display: block;
    }
    ::v-deep .el-button+.el-button {
        margin-left: 0px;
    }
}

.event-content {
    padding-bottom:50px;
    background-color: #fff;
    border-radius:4px;
}

.base-box {
    padding: 0px 10px;
    box-sizing: border-box;
    border-radius: 5px;
    width: 100%;
    h4 {
        font-weight: 500;
        color: #ffffff;
    }
}

.match-title {
    margin:0px 0 10px 0;
}

.match-title>div:nth-child(1) {
    font-size: 12px;
    color: #babbbd;
}

.el-table {
    min-height: 0;
}

.player-title {
    line-height: 70px;
    font-size: 18px;
}

.event ::v-deep .el-range-input {
    background-color: rgba(0, 0, 0, 0);
    color: #fff;
}

.event ::v-deep .el-range-separator {
    color: #fff;
}
.event ::v-deep .el-date-editor .el-range-input {
    width: 40% !important;
}

.el-form-item {
    margin-bottom: 30px;
}

.historyTeam>div {
    color: #a2a9af;
    cursor: pointer;
}

.historyTeam.active>div {
    color: #00c0fe;
}
.attendance-dialog .el-dialog__headerbtn .el-dialog__close {
    font-size: 12px;
}

.trans ::v-deep .el-input__inner {
    border-radius: 4px 4px 0 0;
}

.event ::v-deep .el-input-group__append,
.event ::v-deep .el-input-group__prepend {
    background-color: rgba(0, 0, 0, 0);
    color: #1cd7fa;
    border: 1px solid #1cd7fa;
    border-left: 0;
}

.event ::v-deep .el-icon-date.after {
    position: absolute;
    left: 655px;
    color: #1cd7fa;
}

.upload-demo ::v-deep a,
.upload-demo ::v-deep i {
    color: #1cd7fa;
}

.upload-demo ::v-deep .el-upload-list__item:hover {
    background-color: rgba(0, 0, 0, 0);
}
</style>
<style lang="scss" scoped>
    .transfer ::v-deep .el-checkbox__label{
        color:rgba(0,0,0,.9);
    }
   .transfer   :deep .el-transfer__buttons {
        padding: 150px 0px 0 0px;
        display: block;
        text-align: center;
    }

 .transfer :deep .el-transfer-panel {
    background-color: rgba(0, 0, 0, 0);
    // border-color: #1bd7fa;
    width: 270px;
    // box-shadow: inset 0px 0px 7px 0px #389bf7;
}
.transfer :deep .el-transfer-panel .el-checkbox__inner {
    height: 12px;
    width: 12px;
}
.transfer :deep .el-transfer-panel__body {
    height: 316px;
}
@media screen and (max-width: 1366px){
    .transfer :deep .el-transfer-panel__body {
        height: 216px;
    }
    .event :deep .el-transfer__buttons {
        padding: 80px 0px 0 0px;
    }
}
.transfer :deep .el-checkbox__input.is-disabled .el-checkbox__inner {
    background-color: rgba($color: #fff, $alpha: 0);
    // border-color:  rgba($color: #1bd7fa, $alpha: 0.5);
}
.transfer :deep .el-checkbox__input.is-disabled+span.el-checkbox__label {
    // color: rgba($color: #fff, $alpha: 0.5);
}
.transfer :deep .el-transfer-panel__list.is-filterable {
    height: 308px;
}

.transfer :deep .el-transfer-panel .el-transfer-panel__header {
    background-color: #ebf1f5;
    height: 30px;
    line-height: 30px;
}
.transfer :deep .el-transfer-panel__filter .el-input__inner {
    height: 30px;
}
.transfer :deep  .el-transfer-panel .el-transfer-panel__header .el-checkbox {
    line-height: 30px;
}

.transfer :deep .el-transfer-panel .el-transfer-panel__header .el-checkbox .el-checkbox__label {
    font-size: 12px;
    // color: #fff;
}

.transfer :deep .el-transfer-panel .el-transfer-panel__header .el-checkbox .el-checkbox__label span {
    // color: #fff;
}

.trans :deep .el-input__inner {
    border-radius: 4px 4px 0 0;
}

.transfer :deep .el-transfer-panel__item.el-checkbox {
    // color: #fff;
}

.transfer :deep .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #0052d9;
    border-color: #0052d9;
}

.transfer :deep .el-checkbox__input.is-checked .el-checkbox__inner:hover {
    border-color: #0052d9;
}

.transfer :deep .el-checkbox__input.is-indeterminate .el-checkbox__inner {

}

.transfer :deep .el-checkbox__input .el-checkbox__inner:hover {
    // border-color: #01d9f0;
}

.transfer :deep .el-checkbox__inner::after {
    // border-color: #01d9f0;
}

.transfer :deep .el-checkbox__input.is-checked+.el-checkbox__label {
    color: #0052d9;
}

.transfer :deep .el-input__inner,
.transfer :deep .el-textarea__inner,
.chart .el-input__inner {
    box-shadow: none;
}

.transfer :deep .el-transfer__button.is-disabled,
.transfer :deep .el-transfer__button.is-disabled:hover {
    border: 1px solid rgba(0, 0, 0, 0);
    background-color: rgba(0, 0, 0, 0);
}

.transfer :deep .el-transfer__button {
    color: #387dee;
    background-color: rgba($color: #000000, $alpha: 0);
}
.transfer :deep .el-button--primary {
    border: none;
}
</style>
