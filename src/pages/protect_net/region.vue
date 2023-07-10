<template>
    <div class='list'>
        <div class="list-container" style="height: 90vh">
            <div class="ub ub-pj ub-ac">
                <div style="font-size: 14px">区域坐席图</div>
                <div>
                    <el-button icon="el-icon-refresh-right" size="small" type="primary" v-per="['protective_seat_reset']" @click="resetDialog = true">重置区域</el-button>
                    <el-button icon="iconfont icon-daochu" size="small" type="primary" @click="toTeam">图例维护</el-button>
                </div>
            </div>
            <div class="ub ub-ver ub-pc h100 ub-ac" v-if="!isBuild">
                <div style="text-align: center;">
                    <i class="iconfont icon-wushuju" style="font-size:70px; opacity: 0.4;"></i>
                </div>
                <div style="font-size:12px;color:#000000;text-align: center;opacity: 0.4;">暂无区域</div>
                <div style="text-align: center;">
                    <a href="javascript:;" style="font-size:12px;color:#0052D9;text-decoration: underline;cursor: pointer;" v-per="['protective_seat_add']" @click="addRegionDialog=true">点击创建区域</a>
                </div>
            </div>
            <div v-if="isBuild" class="ub ub-ac region" :class="{'ub-ps': cols.length > 30, 'ub-pc': cols.length <= 30}">
                <template v-per="['protective_seat_add']">
                    <div class="reject-wrapper">
                        <div class="reject-box">
                            <div class="col">
                                <div v-for="(item,index) in cols" :class="{small:cols.length <= 10,middle:cols.length >10 && cols.length <= 30, big: cols.length >=30 }" :key="index">{{index+1}}</div>
                            </div>
                            <div class="row" :style="{top: getTop(cols.length)}">
                                <div v-for="(item,index) in rows" :class="{small:cols.length <= 10,middle:cols.length >10 && cols.length <= 30, big: cols.length >=30 }" :key="index">{{index+1}}</div>
                            </div>
                            <reject v-for="(item,index) in list" :key="index"  :list="item" @click="selectClick"></reject>
                            <div class="seat-team">
                                <div v-for="(item,index) in teams" :key="index">
                                    <div v-if="item.color!=''">
                                        <i :style="{backgroundColor:item.color}"></i>
                                        <span>{{item.label}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
        <!--添加区域-->
        <el-dialog title="创建区域" :visible.sync="addRegionDialog" width="600px" custom-class="common-dialog">
            <el-form :model="addRegionForm"  :rules="rules" ref="addRegionForm" label-position="top">
                <el-form-item label="区域横排：" prop="row" :label-width="formLabelWidth">
                    <el-input style="width:100%" placeholder="请输入" clearable v-model.trim="addRegionForm.row" size="small"></el-input>
                </el-form-item>
                <el-form-item label="区域纵排：" prop="col" :label-width="formLabelWidth">
                    <el-input style="width:100%" placeholder="请输入" clearable v-model.trim="addRegionForm.col" size="small"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <Debounce :time='1000' :isDebounce="1">
                    <el-button size="small" type="primary" @click.native="submitForm('addRegionForm')">确 定</el-button>
                </Debounce>

                <el-button size="small" @click="addRegionDialog = false">取 消</el-button>
            </span>
        </el-dialog>
        <DeleteDialog
            :dialogVisible = resetDialog
            @delete="handleReset"
            :title="'确定重置区域吗？'"
            :text="'重置后不可恢复？'"
            @cancel="resetDialog = false">
        </DeleteDialog>
        <!-- <el-dialog title="重置区域" :visible.sync="resetDialog" width="30%" custom-class="common-dialog">
            <span>确定重置区域吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" @click="handleReset">确 定</el-button>
                <el-button size="small" @click="resetDialog = false">取 消</el-button>
            </span>
        </el-dialog> -->
        <!--添加队伍-->
        <el-dialog title="添加队伍" :visible.sync="addTeamDialog" width="600px" custom-class="common-dialog">
            <el-form :model="addTeamForm"  :rules="rules" ref="addTeamForm" label-position="top">
                <el-form-item label="选择队伍：" prop="teamId" :label-width="formLabelWidth">
                    <el-select style="width:100%;" size="small" clearable v-model="addTeamForm.teamId" filterable placeholder="请选择">
                        <el-option v-for="item in teams" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" @click="submitTeamForm('addTeamForm')">确 定</el-button>
                <el-button size="small" @click="addTeamDialog = false">取 消</el-button>
            </span>
        </el-dialog>
        <DeleteDialog
            :dialogVisible = resetTeamDialog
            @delete="handleResetTeam"
            :title="'确定清空坐席吗？'"
            :text="'清空后不可恢复？'"
            @cancel="resetTeamDialog = false">
        </DeleteDialog>

        <!-- <el-dialog title="重置区域" :visible.sync="resetTeamDialog" width="380px" custom-class="delete">
            <span>确定清空坐席吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" @click="handleResetTeam">确 定</el-button>
                <el-button size="small" @click="resetTeamDialog = false">取 消</el-button>
            </span>
        </el-dialog> -->
    </div>
</template>

<script>
import {
    add_region,
    get_region,
    clear_region,
    get_region_team,
    add_region_team,
    cleanAgent
} from '../../server/protect_net/api.js'
import Reject from './reject'
export default {
    name: 'Region',
    components: {
        Reject
    },
    data() {
        var reg = /^[1-9]\d*$/
        var isNumber = (rule, value, callback) => {
            if (value != '' && !reg.test(value)) {
                return callback(new Error('请输入大于0整数'))
            } else {
                callback()
            }
        }
        return {
            resetTeam: '',
            resetTeamDialog: false,
            teams: [
                { value: 1, label: 'ceshi' }
            ],
            addTeamDialog: false,
            addTeamForm: {
                teamId: ''
            },
            selectedIds: [],
            resetDialog: false,
            isBuild: false,
            rules: {
                col: [{
                    required: true,
                    validator: isNumber,
                    trigger: 'blur'
                }],
                row: [{
                    required: true,
                    validator: isNumber,
                    trigger: 'blur'

                }],
                teamId: [{
                    required: true,
                    message: '请选择队伍',
                    trigger: 'change'

                }]

            },
            formLabelWidth: '100px',
            addRegionDialog: false,
            addRegionForm: {
                col: '15',
                row: '3'
            },
            col: 10,
            row: 3,
            cols: [],
            rows: [],
            list: []
        }
    },
    watch: {
        addRegionDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.addRegionForm.resetFields()
                }
            }
        },
        addTeamDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.addTeamForm.resetFields()
                    this.selectedIds = []
                }
            }
        }
    },
    mounted() {
        let that = this
        this.$nextTick(() => {
            this.get_teams()
            this.get_data()
        })
    },
    methods: {
        getTop(num) {
            if (num <= 10) {
                return '0'
            } else if (num > 10 && num <= 30) {
                return '0px'
            } else if (num >= 30) {
                return '-7px'
            }
        },
        toTeam() {
            this.$router.push({
                path: 'team'
            })
        },
        toLargeScreen() {
            this.$router.push({
                path: '/largeScreen'
            })
        },

        get_data() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_region(data).then(res => {
                console.log('坐席数据', res)
                this.list = []
                if (res.length == 0) {
                    this.isBuild = false
                } else {
                    this.isBuild = true
                    this.list = res
                    this.initCol(res[0].length)
                    this.initRow(res.length)
                }
            }).catch(error => {
                this.addRegionDialog = false
                console.log(error + 'error')
            })
        },
        get_teams() {
            this.teams = []
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_region_team(data).then(res => {
                console.log('图例数据', res)
                if (res.length > 0) {
                    res.forEach(item => {
                        let obj = {}
                        obj.value = item.id
                        obj.label = item.name
                        obj.color = item.color
                        this.teams.push(obj)
                    })
                }
            }).catch(error => {
                console.log(error + 'error')
            })
        },
        submitTeamForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.addTeamFun()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.addFun()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        addTeamFun() {
            let data = {
                queryData: {},
                paramsData: {
                    ids: this.selectedIds,
                    legendId: this.addTeamForm.teamId
                }
            }
            add_region_team(data).then(res => {
                this.addTeamDialog = false
                console.log('添加成功')
                this.$message({
                    message: '添加成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(error => {
                this.addTeamDialog = false
                console.log(error + 'error')
            })
        },
        addFun() {
            console.log(this.addRegionForm)
            let data = {
                queryData: {},
                paramsData: {
                    x: this.addRegionForm.row,
                    y: this.addRegionForm.col
                }
            }
            add_region(data).then(res => {
                this.addRegionDialog = false
                console.log('添加成功')
                this.$message({
                    message: '添加成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(error => {
                this.addRegionDialog = false
                console.log(error + 'error')
            })
        },
        selectClick(item) {
            console.log(item)
            if (item.name == '') {
                this.selectedIds.push(item.id)
                this.addTeamDialog = true
            } else {
                this.resetTeam = item.id
                this.resetTeamDialog = true
            }
        },
        handleResetTeam() {
            // cleanAgent
            let data = {
                id: this.resetTeam
            }
            cleanAgent(data).then(res => {
                this.resetTeamDialog = false
                console.log('清空坐席成功')
                this.$message({
                    message: '清空坐席成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(error => {
                this.resetTeamDialog = false
                console.log(error + 'error')
            })
        },
        initCol(num) {
            this.cols = []
            for (let i = 0; i < num; i++) {
                this.cols.push(i)
            }
        },
        initRow(num) {
            this.rows = []
            for (let i = 0; i < num; i++) {
                this.rows.push(i)
            }
        },
        initRest() {
            this.list = []
            this.cols = []
            this.rows = []
        },
        handleReset() {
            this.clearRegion()
        },
        clearRegion() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            clear_region(data).then(res => {
                this.isBuild = false
                this.resetDialog = false
                this.initRest()
                console.log('坐席数据', res)
                this.$message({
                    message: '清空区域成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(error => {
                this.addRegionDialog = false
                console.log(error + 'error')
            })
        }
    }
}
</script>

    <style lang="scss" scoped>
    .title {
        color: $danger-color;
        font-size: 16px;
        height: 24px;
        line-height: 24px;
        margin-bottom: 16px;
    }
    .text {
        color: rgba(0, 0, 0, 0.6);
        font-size: 12px;
        height: 20px;
        line-height: 20px;
    }
    .region{
        background-image: url(../../assets/img/region_bg.jpg);
        background-repeat: repeat;
        width:100%;
        height: 95%;
        // position: absolute;
        // left:0;
        // top:20%;
        // bottom:0;
        // right:0;
        overflow: auto;

    }
    .reject-wrapper{
        height:100%;
        padding: 160px 0 20px 50px;
        box-sizing: border-box;
        position: relative;
    }
    .reject-box{
        width:auto;
        position: relative;
    }

    .col{
        position: absolute;
        top:-22px;
        left:0px;
        right:0;
        height:20px;
        font-size:0;
        z-index: 99;
    }
    .col>div.big{
        width:30px;
        height:30px;
        line-height: 30px;
        display: inline-block;
        text-align: center;
        font-size:10px;
        margin-left: -1px;
        margin-top: -15px;
        color:#fff;
        background-color: #95AAC9;
        border: 1px solid #fff;
    }
    .col>div.middle{
        width:40px;
        height:40px;
        line-height: 40px;
        display: inline-block;
        text-align: center;
        line-height: 40px;
        font-size:20px;
        margin-left: 0px;
        margin-top: -18px;
        color:#fff;
        background-color: #95AAC9;
        border: 1px solid #fff;
    }
    .col>div.small{
        width:60px;
        height:60px;
        display: inline-block;
        text-align: center;
        line-height: 60px;
        font-size:30px;
        margin-left: 0px;
        margin-top: -38px;
        color:#fff;
        background-color: #95AAC9;
        border: 1px solid #fff;
    }
    .row{
        position: absolute;
        top:0px;
        left:-22px;
        bottom:0;
        width:20px;
        font-size:0;
        z-index: 99;
    }
    .row>div.big{
        width:30px;
        height:30px;
        text-align: center;
        line-height: 30px;
        font-size:10px;
        margin-left: -10px;
        margin-top: -1px;
        color:#fff;
        background-color: #95AAC9;
        border: 1px solid #fff;
    }

    .row>div.middle{
        width:40px;
        height:40px;
        text-align: center;
        line-height: 42px;
        font-size:20px;
        margin-left: -20px;
        margin-top: 0px;
        color:#fff;
        background-color: #95AAC9;
        border: 1px solid #fff;
    }

    .row>div.small{
        width:62px;
        height:60px;
        text-align: center;
        line-height: 62px;
        font-size:30px;
        margin-left: -44px;
        margin-top: 0px;
        color:#fff;
        background-color: #95AAC9;
        border: 1px solid #fff;
    }

    .event ::v-deep .el-range-input {
        background-color: rgba(0, 0, 0, 0);
        color: #000;
    }
    .no-data{
        width:200px;
        position: absolute;
        left:50%;
        top:50%;
        transform: translate(-50%,-50%);
    }

    .seat-team{
        width:100%;
        margin: 50px 0;
        overflow: hidden;
    }
    .seat-team>div{
        margin: 10px;
        font-size:0;
        float:left;

    }
    .seat-team>div i{
        display: inline-block;
        width:20px;
        height:12px;
        vertical-align: middle;
    }
    .seat-team>div span{
        margin-left: 5px;
        display: inline-block;
        vertical-align: middle;
        font-size:12px;
        color:#000;
    }
    </style>
