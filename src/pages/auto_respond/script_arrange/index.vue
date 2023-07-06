<template>
    <div class="event">
        <div class="w100" v-show="!firstShow">
            <div class="tab-button ub" style="background:#fff;padding:0 10px;border: 1px solid #DADEE8;border-bottom:none;border-radius: 4px 4px 0 0;height: 26px;">
                <div style="height: 26px;line-height: 26px;font-size: 13px;" class="work-btn" @click="tabClick('1')" :class="{'tab-active': currentTab === '1'}">剧本</div>
                <div style="height: 26px;line-height: 26px;font-size: 13px;" class="draft-btn" @click="tabClick('2')" :class="{'tab-active': currentTab === '2'}">草 稿</div>
            </div>
            <div>
                <SearchTop @search="searchCheck" @reset="reset" class="search-custom" :border="false">
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="剧本名称：" label-width="70px">
                                <el-input
                                    placeholder="请输入"
                                    clearable
                                    :maxlength="20"
                                    style="width: 100%;"
                                    v-model="get_params.name"
                                    @keyup.enter.native="searchCheck"
                                    size="small"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <!-- <el-col :md="12" :lg="8" :xl="6" v-if="currentTab === '1'">
                        <el-form :model="get_params">
                            <el-form-item label="剧本状态：" label-width="70px">
                                <el-select
                                    placeholder="请选择"
                                    clearable
                                    style="width: 100%;"
                                    v-model="get_params.status"
                                    size="small">
                                    <el-option label="未启用" value="2"></el-option>
                                    <el-option label="已启用" value="1"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </el-col> -->
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="剧本类型：" label-width="70px">
                                <el-select
                                    placeholder="请选择"
                                    clearable
                                    style="width: 100%;"
                                    v-model="get_params.mouldType"
                                    size="small">
                                    <el-option v-for="(item, index) in mouldTypeList" :key="index" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :md="12" :lg="8" :xl="6">
                        <el-form :model="get_params">
                            <el-form-item label="创建时间：" label-width="70px">
                                <el-date-picker
                                    :clearable="false"
                                    size="small"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    v-model="sayTimes"
                                    style="width: 100%;"
                                    type="datetimerange"
                                    :default-time="['00:00:00', '23:59:59']"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </SearchTop>
            </div>
            <div class="attendance-list table-area">
                <div class="ub ub-pj ub-ac w100" style="margin-bottom: 10px;">
                    <div class="list-tips">列表内容</div>
                    <div>
                        <el-button v-if="currentTab === '1'" v-per="['auto_jb_add']" size="small" icon="el-icon-plus" type="primary" @click="handleAddTemplate">添加模板</el-button>
                        <el-button v-if="currentTab === '2'" v-per="['auto_cg_add']" size="small" icon="el-icon-plus" type="primary" @click="handleAddTemplate">添加模板</el-button>
                    </div>
                </div>
                <el-table
                    :row-class-name="tableRowClassName"
                    :height="tableHeight"
                    ref="multipleTable"
                    v-loading="loading"
                    class='bigTable'
                    :data="tableData"
                    border
                    stripe
                    tooltip-effect="dark"
                    v-if="get_params.type != 1"
                    :key="1"
                    @selection-change="handleSelectionChange">
                    <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                    </el-table-column>
                    <el-table-column prop="name" label="剧本名称" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="mouldName" label="剧本类型" width="200">
                    </el-table-column>
                    <el-table-column prop="createUserCN" label="创建人"  width="100">
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建时间" width="160">
                    </el-table-column>
                    <el-table-column label="描述" width="400">
                        <template slot-scope="scope">
                            <span v-if="scope.row.des" @click="showDesc(scope.row.des)" style="text-decoration: underline; color: #409eff; cursor: pointer;">描述内容</span>
                            <span v-else>--</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="160">
                        <template slot-scope="scope">
                            <el-button size="small" type="text" v-per="['auto_jb_copy']" @click="handleCopyAdd(scope.row)">复制并新建</el-button>
                            <el-button size="small" v-per="['auto_jb_edit']" v-if="scope.row.isUse !== 1" type="text" @click="handleEdit(scope.row)">编辑</el-button>
                            <el-tooltip v-if="scope.row.isUse === 1" class="item" effect="dark" content="有正在进行中的剧本，禁止操作" placement="top-start">
                                <div style="display: inline-block;margin-left: 10px;">
                                    <el-button size="small" v-per="['auto_cg_edit']" :disabled="(scope.row.isUse === 1)" type="text" @click="handleEdit(scope.row)">编辑</el-button>
                                </div>
                            </el-tooltip>
                            <el-button size="small" v-if="scope.row.isUse !== 1" v-per="['auto_jb_del']" type="text" @click="handleDelete(scope.row)">删除</el-button>
                            <el-tooltip v-if="scope.row.isUse === 1" class="item" effect="dark" content="有正在进行中的剧本，禁止操作" placement="top-start">
                                <div style="display: inline-block;margin-left: 10px;">
                                    <el-button size="small" v-per="['auto_cg_del']" :disabled="(scope.row.isUse === 1)" type="text" @click="handleDelete(scope.row)">删除</el-button>
                                </div>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
                <el-table
                    :row-class-name="tableRowClassName"
                    :height="tableHeight"
                    ref="multipleTable"
                    v-loading="loading"
                    class='bigTable'
                    :data="tableData"
                    border
                    stripe
                    tooltip-effect="dark"
                    v-if="get_params.type == 1"
                    :key="2"
                    @selection-change="handleSelectionChange">
                    <!--<el-table-column type="selection" width="40"></el-table-column>-->
                    <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                    </el-table-column>
                    <el-table-column prop="name" label="剧本名称" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="mouldName" label="剧本类型" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="createUserCN" label="创建人"  width="100">
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建时间" width="160">
                    </el-table-column>
                    <el-table-column label="描述" width="400">
                        <template slot-scope="scope">
                            <!-- <span v-html="scope.row.des"></span> -->
                            <span v-if="scope.row.des" @click="showDesc(scope.row.des)" style="text-decoration: underline; color: #409eff; cursor: pointer;">描述内容</span>
                            <span v-else>--</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="160">
                        <template slot-scope="scope">
                            <el-button v-per="['work_mould_edit']" type="text" @click="handleEdit(scope.row)">编辑草稿</el-button>
                            <el-button v-per="['work_mould_del']" type="text" @click="handleDelete(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination v-show="total_num>0" :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size" @pagination="get_data" />
            </div>
        </div>
        <DeleteDialog
            :dialogVisible = deleteDialog
            @delete="handleDeleteFun"
            @cancel="deleteDialog = false">
        </DeleteDialog>
        <el-dialog title="描述详情" :visible.sync="descVis" width="700px" custom-class="common-dialog " @click.native="closeDrop">
            <div v-html="descHtml" style="position: relative;"></div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="closeDrop">取 消</el-button>
                <!-- <el-button type="primary" size="small" @click="closeDrop">确 定</el-button> -->
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {
    deleteWorkTemplateList,
    getWorkTemplateList
} from '@/server/auto_respond/action_edit.js'
// import bpmnModeler from '../../../package/detailXml.vue'
import axios from 'axios'
export default {
    name: 'WorkObject',
    components: {
        // bpmnModeler
    },
    data() {
        return {
            tableHeight: document.body.clientHeight - 300,
            mouldTypeList: [
                {
                    id: 0,
                    name: '分析处置'
                },
                {
                    id: 1,
                    name: '应急响应'
                },
                {
                    id: 2,
                    name: '运维支持'
                }
            ],
            that: this,
            currentTab: '1',
            flag: null,
            config_id: '',

            firstShow: false,
            deleteDialog: false,
            deleteId: '',
            formLabelWidth: '120px',
            loading: false,
            total_num: 0,
            multipleSelection: [],
            itemSelection: [],
            tableData: [],
            sayTimes: [],
            get_params: {
                page: 1,
                size: 20,
                name: '',
                // sendId: '',
                status: '',
                type: 0,
                mouldType: ''
            },
            descVis: false,
            descHtml: ''
        }
    },
    watch: {
    },
    mounted() {
        this.init()
        this.$nextTick(() => {
            this.get_data()
        })
    },
    filters: {
    },
    computed: {
    },
    methods: {
        showDesc(desc) {
            this.descVis = true
            this.descHtml = desc
        },
        closeDrop() {
            this.descVis = false
            this.descHtml = ''
        },
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex % 2) {
                return 'table-row2'
            } else {
                return 'table-row1'
            }
        },
        reset() {
            this.sayTimes = []
            this.get_params = {
                page: 1,
                size: 20,
                name: '',
                sendId: '',
                status: '',
                mouldType: '',
                type: this.currentTab == '1' ? 0 : 1
            }
            this.get_data()
        },
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        indexInnerMethod(index) {
            return (this.get_inner_params.page - 1) * this.get_inner_params.size + index + 1
        },
        tabClick(val = '1') {
            this.currentTab = val
            val === '1' && (this.get_params.type = 0)
            val === '2' && (this.get_params.type = 1)
            // this.get_data()
            this.reset()
        },
        handleAddTemplate() {
            this.$router.push('/auto_respond/script_base')
        },

        searchCheck() {
            // alert(123)
            this.get_params.page = 1
            this.get_data()
        },
        searchCheckItem() {
            this.get_inner_params.page = 1
            this.get_Item()
        },

        get_data() {
            this.loading = true
            this.tableData = []
            let uid = this.config_id = new Date().getTime()
            let data = {
                queryData: {
                    page: this.get_params.page,
                    pageSize: this.get_params.size
                },
                paramsData: {
                    name: this.get_params.name,
                    status: this.get_params.type == 0 ? 1 : 0,
                    mouldType: this.get_params.mouldType,
                    startTime: this.sayTimes && this.sayTimes.length > 0 ? this.sayTimes[0] : '',
                    endTime: this.sayTimes && this.sayTimes.length > 0 ? this.sayTimes[1] : ''
                }
            }
            getWorkTemplateList(data).then(res => {
                console.log('模板列表', res)
                this.loading = false
                if (this.config_id !== uid) {
                    return
                }
                this.total_num = res.total
                let list = res.records
                if (list.length > 0) {
                    list.forEach(item => {
                        let obj = {}
                        obj.id = item.id
                        obj.name = item.name
                        obj.startConditionObj = item.startConditionObj
                        obj.xmlName = item.xmlName
                        obj.xml = item.xml
                        obj.endEvent = item.endEvent
                        obj.des = item.des
                        obj.createTime = item.createTime
                        obj.createUserId = item.createId
                        obj.createUserCN = item.createUserCN
                        obj.deploymentId = item.deploymentId
                        // obj.userIds = item.userIds
                        obj.isUse = item.isUse
                        obj.mouldType = item.mouldType
                        obj.mouldName = this.mouldTypeList.filter(i => i.id == item.mouldType)[0].name
                        this.tableData.push(obj)
                    })
                }
            }).catch(error => {
                this.loading = false
                console.log('error' + error)
            })
        },
        init() {
            // this.getSeeList()
        },
        handleCopyAdd(row) {
            let form = this.$deepCopy(row)
            form.id = ''
            form.name = form.name + '--copy'
            this.$setsessionStorage('copyTemplate', form)
            this.$setsessionStorage('copyAdd', true)
            this.$router.push('/auto_respond/script_base')
        },
        handleEdit(row) {
            let form = this.$deepCopy(row)
            this.$setsessionStorage('editTemplate', form)
            this.$router.push('/auto_respond/script_base')
        },
        handleDeleteAll() {
            if (this.multipleSelection.length == 0) {
                this.$message({
                    message: '请先选择类型',
                    type: 'warning'
                })
                return
            } else {
                let ids = []
                this.multipleSelection.forEach(item => {
                    ids.push(item.id)
                })
                this.deleteId = ids
                // console.log(this.deleteId)
            }
            this.deleteDialog = true
        },
        handleDelete(row) {
            this.deleteId = row.id
            this.deleteDialog = true
        },
        handleDeleteFun() {
            let data = {
                id: this.deleteId
            }
            deleteWorkTemplateList({ paramsData: data, queryData: {}}).then(res => {
                this.deleteDialog = false
                console.log('删除成功')
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(error => {
                this.deleteDialog = false
                console.log(error + 'error')
            })
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
            console.log(val)
            this.multipleSelection = val
        }
    },
    beforeDestroy() {
        if (this.flag) {
            clearTimeout(this.flag)
            this.flag = null
        }
        if (this.$getsessionStorage('send_object_change') || this.$getsessionStorage('send_object_change') === false) {
            this.$removesessionStorage('send_object_change')
        }
    }
}
</script>

<style lang="scss" scoped>
.search-custom {
    border-radius: 0 0 4px 4px;
    box-shadow: 0;
}
.tab-button {
    height: 30px;
    border-bottom: 1px solid #e7e7e7;
    background-color: #fff;
    & div {
        width: 80px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        margin-right: 10px;
        cursor: pointer;
        border-radius: 2px;
        color: rgba(0, 0, 0, 0.6);
        box-sizing: border-box;
        font-size: 14px;

        &.tab-active {
            color: #387dee;
            border-bottom: 1px solid #387dee;
        }
    }
}
.help {
    display: inline-block;
    color: rgba(0, 0, 0, 0.26);
    font-size: 12px;
    margin-right: 24px;
    cursor: pointer;
    i {
        margin-right: 6px ;
    }
}
.search-area {
    .wrapper {
        border-radius: 0;
        border: 0;
        box-shadow: none;
    }
}
.el-input.ips {
    display: block;
    width: 100%;
}
.el-link {
    cursor: pointer;
}
.drawer-pad {
    padding: 0 20px;
}
.domain-add {
    line-height: 1;
    position: relative;
    padding: 0 20px;
    color: #1cd7fa;

    .el-button {
        position: absolute;
        right: 20px;
        top: 0;
        padding: 0;
        color: #1cd7fa;
    }
}
.domain-list {
    background: rgba(0, 0, 0, .3);
    margin: 3px 0 20px;
    padding: 20px 0 1px;

    .list-tit {
        width: 100px;
        text-align: right;
    }

    .ub {
        margin-bottom: 20px;
    }

    .list-btn {
        padding-left: 20px;

        .el-button {
            color: #F56C6C;
        }
    }
}
.event  ::v-deep  .el-range-input {
    background-color: rgba(0, 0, 0, 0);
}
.event  ::v-deep  .el-range-separator {
    // color: #fff;
}
.event  ::v-deep  .el-radio {
    margin: 0 150px 0 30px;
}
.event  ::v-deep  .el-form-item__label {
    padding: 0;
}
.event  ::v-deep  .el-upload-list__item-name {
    color: #01E9FF;

    i {
        color: #01E9FF;
    }
}
.switch-wrapper{
    width:56px;
    height:20px;
    position: relative;
    cursor: pointer;
    margin-left: 15px;
}
.switch-wrapper>div:nth-child(1){
    width:48px;
    height:20px;
    background-color: #0052d9;
    color: #fff;
    // box-shadow: inset 0px 0px 7px 0px #000000;
    border-radius: 14px;
    div{
        font-size: 12px;
        line-height: 20px;
        padding:0 8px;
    }
    >div:nth-child(1){
        color: #fff;
        opacity: 1;
    }
    >div:nth-child(2){
        color: #fff;
        opacity: 1;
    }
}
.switch-wrapper>div:nth-child(2){
    width: 18px;
    height: 18px;
    position: absolute;
    left:2px;
    top:50%;
    margin-top: -9px;
    border-radius:100%;
}
.switch-wrapper.yes>div:nth-child(2){
    animation: moveone 0s linear forwards;
}
.switch-wrapper.no>div:nth-child(2){
    animation: _moveone 0s linear forwards;
}
.switch-wrapper.no>div:nth-child(1){
    background-color: #c5c5c5;
}
@keyframes moveone {
    0% {
        background-color: #fff;
        box-shadow: 0px 0px 6px 0px #fff;
        left: 2px;
    }

    100% {
        background-color: #fff;
        box-shadow: 0px 0px 6px 0px #fff;
        left: 28px;
    }
}
@-webkit-keyframes moveone {
    0% {
        background-color: #fff;
        box-shadow: 0px 0px 6px 0px #fff;
        left: 2px;
    }

    100% {
        background-color: #fff;
        box-shadow: 0px 0px 6px 0px #fff;
        left: 28px;
    }
}
@keyframes _moveone {
    0% {
        background-color: #fff;
        box-shadow: 0px 0px 6px 0px #fff;
        left: 28px;
    }

    100% {
        background-color: #fff;
        box-shadow: 0px 0px 6px 0px #fff;
        left: 2px;
    }
}
@-webkit-keyframes _moveone {
    0% {
        background-color: #fff;
        box-shadow: 0px 0px 6px 0px #fff;
        left: 28px;
    }

    100% {
        background-color: #fff;
        box-shadow: 0px 0px 6px 0px #fff;
        left: 2px;
    }
}
.attendance-list.table-area {
    background-color: #fff;
    padding: 10px 10px;
    box-shadow: 0px 0px 8px 0px rgba(140, 152, 164, 0.2);
    border-radius: 4px;
    border: solid 1px #dadee8;
    margin-top: 10px;
    .pagination {
        margin-top: 20px;
        text-align: right;
    }
}
.bigTable ::v-deep tr {
    height: 32px;
}
.event  ::v-deep  .drawer-content {
    .box-title {
        color: #00e9ff;
        font-size: 14px;
        margin: 30px 0 20px;
    }
    .label {
        width: 60px;
        font-size: 12px;
        color: #999;
        text-align: right;
        margin-right: 15px;
    }
    .label-val {
        font-size: 12px;
        color: #fff;
        img {
            max-width: 300px;
        }
    }
}
.event  ::v-deep  .condition-box {
    .part-condition {
        margin-bottom: 10px;
    }
    .condition_black {
        font-size: 12px;
        color: #999;
        margin-right: 6px;
    }
    .condition_white {
        font-size: 12px;
        color: #fff;
        margin-right: 6px;
    }
}
.event  ::v-deep  .warn-wrapper {
    width: 640px;
    padding-left: 10px;
    box-sizing: border-box;
    background: rgba(0,0,0,.2);
    border-radius: 2px;

    & p {
        font-size: 12px;
        margin: 5px 0;

        &.warn-top {
            color: #fff;
            opacity: .6;
        }
        &.warn-body {
            color: #fff;
            word-break: break-all;
        }
    }
}
.event  ::v-deep  .pic-wrapper {
    height: calc(100vh - 190px);
    width: 99%;
    overflow: auto;
    border: 1px solid #1cd7fa;
}
@keyframes moveone_white {
    0% {
        background-color: #fff;
        left: 1px;
    }

    100% {
        background-color: #fff;
        left: 37px;
    }
}
@-webkit-keyframes moveone_white {
    0% {
        background-color: #fff;
        left: 1px;
    }

    100% {
        background-color: #fff;
        left: 37px;
    }
}
@keyframes _moveone_white {
    0% {
        background-color: #fff;
        left: 37px;
    }

    100% {
        background-color: #fff;
        left: 1px;;
    }
}
@-webkit-keyframes _moveone_white {
    0% {
        background-color: #fff;
        left: 37px;
    }

    100% {
        background-color: #fff;
        left: 1px;
    }
}
.white-theme .switch-wrapper.yes>div:nth-child(2){
    animation: moveone_white 0s linear forwards;
}
.white-theme .switch-wrapper.no>div:nth-child(2){
    animation: _moveone_white 0s linear forwards;
}
</style>
<style>
.nav-tips {
    pointer-events: none !important;
}
</style>
