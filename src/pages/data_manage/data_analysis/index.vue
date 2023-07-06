<template>
    <div class="event rules w100">
        <SearchTop @search="searchData" @reset="reserFun">
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params" >
                    <el-form-item label="解析规则:" label-width="80px">
                        <el-input placeholder="请输入" clearable v-model.trim="get_params.ruleName" size="small"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params" >
                    <el-form-item label="解析类型:" label-width="80px">
                        <el-select size="small" clearable v-model="get_params.parseType" placeholder="请选择" style="width:100%">
                            <el-option v-for="item in parseOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params" >
                    <el-form-item label="接入设备类型:" label-width="90px">
                        <treeselect
                            size="small"
                            :appendToBody="true"
                            class="treeselect"
                            :options="regAssetTypeList"
                            :normalizer="normalizer"
                            noChildrenText="当前分支无子节点"
                            noOptionsText="无可用选项"
                            noResultsText="无可用选项"
                            placeholder="请选择接入设备类型"
                            @select="selectNode"
                            @input="deSelectNode"
                            v-model="get_params.assetsTypeId"
                            :disableBranchNodes="true"
                        />
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="get_params">
                    <el-form-item label="数据源厂商:" label-width="80px">
                        <el-select size="small" clearable v-model="get_params.manufacturerId" placeholder="请选择" @change="searchData" style="width:100%">
                            <el-option v-for="item in compantList" :key="item.busId" :label="item.name" :value="item.busId"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-col>
        </SearchTop>
        <div class="list-container">
            <div class="ub ub-pj w100 mb-1">
                <div class="list-tips">数据解析</div>
                <div class="ub">
                    <el-button v-per="['data_parse_add']" size="small" icon="el-icon-plus" type="primary" @click="addRule">新 建</el-button>
                    <el-upload class="upload-demo" :headers="header" ref="upload" action="/api/data-center/manage/logParse/import" :file-list="fileList" accept=".access" name="file" :on-success="uploadSuccess">
                        <el-button v-per="['data_parse_import']" style="margin-left: 10px;" size="small" icon="iconfont icon-daoru" type="primary">导 入</el-button>
                    </el-upload>
                    <el-button v-per="['data_parse_export']" style="margin-left: 10px;" size="small" icon="iconfont icon-daochu" type="primary" @click="handleDownLoad">导 出</el-button>
                    <el-button v-per="['data_parse_del']" size="small" icon="el-icon-delete" type="danger" @click="deleteRule">删 除</el-button>
                </div>
            </div>
            <el-table
                v-loading="loading"
                class='bigTable'
                :data="tableData"
                border
                stripe
                tooltip-effect="dark"
                @selection-change="handleSelectionChange"
                :row-class-name="tableRowClassName"
                :height="tableHeight"
                :row-style="{ height: '32px' }"
                :header-row-style="{ height: '32px' }">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                </el-table-column>
                <el-table-column align="left" prop="name" label="解析规则">
                </el-table-column>
                <el-table-column align="left" prop="detail" label="解析规则描述">
                </el-table-column>
                <el-table-column align="left" label="解析类型">
                    <template slot-scope="scope">
                        <span v-if="scope.row.type == 1">正则</span>
                        <span v-if="scope.row.type == 2">JSON</span>
                        <span v-if="scope.row.type == 3">不解析</span>
                        <span v-if="scope.row.type == 4">转发透传</span>
                    </template>
                </el-table-column>
                <el-table-column align="left" prop="assetsTypeName" label="接入设备类型">
                </el-table-column>
                <el-table-column align="left" prop="manufacturerName" label="数据源厂商">
                </el-table-column>
                <el-table-column align="center" label="操作" width="120" fixed="right">
                    <template slot-scope="scope">
                        <el-button v-per="['data_parse_edit']"  type="text" size="small"  @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button v-per="['data_parse_del']" type="text" size="small" @click="handleDel(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="get_params.total_num>0" :total="get_params.total_num" :page.sync="get_params.page" :limit.sync="get_params.size" @pagination="initData" />
            <!-- <div class="pagination">
                <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="get_params.page"
                    :page-sizes="[20, 30, 40,50]"
                    :page-size="get_params.size"
                    layout="total, sizes, prev, pager, next"
                    prev-text="上一页"
                    next-text="下一页"
                    :total="get_params.total_num">
                </el-pagination>
            </div> -->
            <!-- <el-dialog title="提示" :visible.sync="delDialog" width="30%" custom-class="attendance-dialog">
                <span>确定删除吗？</span>
                <span slot="footer" class="dialog-footer">
                    <searchBtn title="确 定" @click="delConfim" />
                    <cancel-btn title="取 消" style="margin-left: 10px;" @click="delDialog = false"></cancel-btn>
                </span>
            </el-dialog> -->
            <DeleteDialog
                :dialogVisible = delDialog
                @delete="delConfim"
                @cancel="delDialog = false">
            </DeleteDialog>
        </div>

    </div>
</template>

<script>
// import initData from '@/mixins/initData.js'
import {
    list,
    getLogTree,
    deleteLog,
    downLoad
} from '@/server/data_manage/data_analysis.js'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
    name: 'ParseRule',
    // mixins: [initData],
    data() {
        return {
            tableHeight: document.body.clientHeight - 270,
            normalizer(node) {
                return {
                    id: node.id,
                    label: node.name,
                    children: node.child
                }
            },
            loading: false,
            tableData: [],
            fileList: [],
            file_num: 0,
            parseOptions: [
                {
                    value: 1,
                    label: '正则'
                },
                {
                    value: 3,
                    label: '不解析'
                },
                {
                    value: 4,
                    label: '转发透传'
                },
                {
                    value: 2,
                    label: 'JSON'
                }
            ],
            multipleSelection: [],
            delDialog: false,
            get_params: {
                page: 1,
                size: 20,
                ruleName: '',
                parseType: '',
                logType: '',
                assetsTypeId: null,
                assetsTypeIdBus: '',
                manufacturerId: '',
                total_num: 0
            },
            transition: [],
            allDeviceType: [],
            regAssetTypeList: [],
            compantList: []
        }
    },
    computed: {
        header() {
            return { token: this.$getlocalStorage('initInfo').user.token }
        }
    },
    components: { Treeselect },
    mounted() {
        this.$nextTick(() => {
            this.initData()
            this.getLogTreeOp()
        })
    },
    watch: {
    },
    methods: {
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex % 2) {
                return 'table-row2'
            } else {
                return 'table-row1'
            }
        },
        reserFun() {
            this.get_params.ruleName = ''
            this.get_params.parseType = ''
            this.get_params.assetsTypeId = null
            this.get_params.manufacturerId = ''
            this.get_params.assetsTypeIdBus = ''
            setTimeout(() => {
                this.initData()
                // this.getLogTreeOp()
            }, 1000)
        },
        handleDownLoad() {
            let data = {
                queryData: {
                    page: this.get_params.page,
                    pageSize: this.get_params.size
                },
                paramsData: {
                    ids: this.multipleSelection.map(item => item.id),
                    name: this.get_params.ruleName,
                    type: this.get_params.parseType,
                    assetsTypeId: this.get_params.assetsTypeId,
                    manufacturerId: this.get_params.manufacturerId
                }
            }
            downLoad(data).then(res => {
                console.log(res)
            }).catch(e => {
                console.log(e)
            })
        },
        deleteRule() {
            if (this.multipleSelection.length) {
                this.delDialog = true
                this.transition = this.multipleSelection.map(item => { return item.id })
            } else {
                this.$message({
                    message: '请至少选择一项',
                    type: 'warning'
                })
            }
        },
        selectNode(node, instanceId) {
            console.log(node)
            this.get_params.logType = node.parentId // 一级id
            this.get_params.assetsTypeIdBus = node.busId // 二级取busId
            this.getThridLevel(node.id)
            this.get_params.manufacturerId = ''
            // this.initData()
        },
        deSelectNode(value, instanceId) {
            if (!value) {
                this.get_params.logType = '' // 一级id
                this.get_params.assetsTypeIdBus = '' // 二级取busId
                this.get_params.manufacturerId = ''
                // this.initData()
            }
        },
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
        delConfim() {
            console.log(this.transition)
            deleteLog({ paramsData: { ids: this.transition }}).then(res => {
                this.$message({
                    type: 'success',
                    message: '操作成功'
                })
                this.delDialog = false
                this.initData()
            })
        },
        searchData() {
            this.get_params.page = 1
            this.initData()
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        handleEdit(row) {
            sessionStorage.setItem('analysisData', JSON.stringify(row))
            this.$router.push({
                path: '/data_manage/data_manage_data_analysis_add',
                query: {
                    id: row.id
                }
            })
        },
        getLogTreeOp() {
            getLogTree({
                queryData: {},
                paramsData: {}
            }).then(res => {
                // this.formatTreeData(res)
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
            })
        },
        handleDel(row) {
            this.transition = []
            this.transition.push(row.id)
            this.delDialog = true
        },
        addRule() {
            this.$router.push('/data_manage/data_manage_data_analysis_add')
        },
        importRule() {

        },
        exportRule() {

        },
        uploadSuccess(response, file, fileList) {
            console.log('response', response)
            if (response.code == 1) {
                this.$message({
                    message: '文件上传成功!',
                    type: 'success'
                })
                this.uploadDialog = false
                this.fileList = []
                this.file_num = 0
                setTimeout(() => {
                    this.initData()
                }, 1200)
            } else {
                this.$message({
                    message: response.message,
                    type: 'warning'
                })
            }
        },
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        initData() {
            this.loading = true
            this.tableData = []
            let data = {
                queryData: {
                    page: this.get_params.page,
                    pageSize: this.get_params.size
                },
                paramsData: {
                    name: this.get_params.ruleName,
                    type: this.get_params.parseType,
                    assetsTypeId: this.get_params.assetsTypeIdBus
                    // manufacturerId: this.get_params.manufacturerId
                }
            }
            list(data).then(res => {
                this.loading = false
                this.get_params.total_num = res.total
                this.tableData = res.records
                console.log(res)
            })
        },
        handleSizeChange(val) {
            this.get_params.size = val
            this.initData()
        },
        handleCurrentChange(val) {
            this.get_params.page = val
            this.initData()
        }

    }
}
</script>

<style lang="scss" scoped>
    // .rules ::v-deep .btn {
    //     width: 80px;
    // }
    .rules {
        .treeselect {
           ::v-deep .vue-treeselect__single-value {
                font-size: 12px;
                line-height: 30px;
            }
            ::v-deep .vue-treeselect__placeholder {
                font-size: 12px;
                line-height: 30px;
            }
            ::v-deep .vue-treeselect__menu {
                font-size: 12px;
            }
        }
    }

    .rules ::v-deep .edit {
        color: rgb(239, 191, 0);
    }

    .rules ::v-deep .delete {
        color: rgb(255, 114, 0);
        &:hover {
            opacity: 1;
        }
    }
    .reset-btn {
        width: 80px;
        height: 30px;
        background-color: #041f38;
        box-shadow: inset 0px 0px 10px 0px rgba(0, 167, 245, 0.97);
        border: solid 1px #39caf3;
        font-size: 12px;
        line-height: 15px;
        letter-spacing: 1px;
        color: #a2ceec;
        border-radius: 5px;
        margin-right: 10px;
        cursor: pointer;
        box-sizing: border-box;
    }

</style>
