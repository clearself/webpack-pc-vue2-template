<template>
    <div class="event event-wrapper information_system">
        <SearchTop @search="search" @reset="reset">
            <el-col :md="12" :lg="8" :xl="6">
                <el-form :model="searchForm">
                    <el-form-item label="信息系统子类编码:" label-width="120px">
                        <el-input size="small" clearable v-model.trim="searchForm.code" placeholder="请输入"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :md="12" :lg="8" :xl="6">
                <el-form  :model="searchForm">
                    <el-form-item label="信息系统子类名称:" label-width="120px">
                        <el-input size="small" clearable v-model.trim="searchForm.name" placeholder="请输入"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
        </SearchTop>
        <div class="list-container">
            <el-table
                ref="multipleTable"
                v-loading="listLoading"
                class='bigTable'
                :data="tableData"
                border
                stripe
                tooltip-effect="dark"
                :row-class-name="tableRowClassName"
                @selection-change="handleSelectionChange"
                :height="tableHeight"
                :row-style="{ height: '32px' }"
                :header-row-style="{ height: '32px' }">
                <el-table-column align="center" type="index" width="50" label="序号" :index="indexMethod">
                </el-table-column>
                <el-table-column prop="code" label="信息系统子类编码" width="200" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="name" label="信息系统子类名称" width="200" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="bigName" label="信息系统大类名称" width="200" show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="映射关系" show-overflow-tooltip>
                    <template slot-scope="{row}">
                        <div>
                            <div v-if="row.ruleItemList.length>0">
                                <ConditionTips :select-data="columnNames" v-model="row.ruleItemList" />
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="100" fixed="right" class-name="deepBg">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" title="编辑" @click="handleEdit(scope.row)">编辑</el-button>
                        <!-- <el-button type="text" size="small" title="删除" @click="handleDel(scope.row)">删除</el-button> -->
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="get_data" />
        </div>
        <el-dialog title="编辑" width="960px" :visible.sync="addEditDialog" custom-class="attendance-dialog">
            <el-form ref="formData" :model="formData" :rules="rules">

                <el-form-item label="信息系统大类名称：" :label-width="formLabelWidth">
                    <el-input disabled size="small" clearable v-model.trim="formData.bigName"></el-input>
                </el-form-item>
                <el-form-item label="信息系统子类名称：" :label-width="formLabelWidth">
                    <el-input disabled size="small" clearable v-model.trim="formData.typeName"></el-input>
                </el-form-item>
                <el-form-item label="映射关系：" :label-width="formLabelWidth">
                    <ConditionRules :select-data="columnNames" v-model="formData.relationalArr" />
                    <div v-if="formData.relationalArr.length===0||formData.relationalArr[0].children.length === 0" class="rule-area">
                        <div class="empty-array ub ub-ac ub-pc">
                            <div>
                                <el-button size="mini" @click="toAddRule">去添加映射关系</el-button>
                            </div>
                            <!-- 请先选择事件类型！ -->
                        </div>
                    </div>
                    <!-- <div class="rule-area">
                        <div class="ub ub-ac w100">
                            <div v-if="formData.contentArr.length > 0" class="ub ub-pc ub-ac or-btn" style="width:30px;font-size:18px;">or</div>
                            <div class="ub ub-f1 ub-ver">
                                <div class="ub ub-f1 ub-pj mapping-item" style="padding:5px;" v-for="(_item,index) in formData.contentArr" :key="index">
                                    <div class="ub ub-ac ub-f1">
                                        <el-form-item
                                            style="width:30%;margin:0 2px;display:block;"
                                            label=""

                                        >
                                            <el-select filterable clearable size="small" v-model="_item.field" placeholder="请选择" @change="changeFields(_item.field,_item)">
                                                <el-option v-for="item in columnNames" :key="item.codee" :label="item.name" :value="item.code">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <div class="connectLine"></div>
                                        <el-form-item
                                            style="width:30%;margin:0 2px;display:block;"
                                            label=""
                                            label-width="0px"

                                        >
                                            <el-select clearable size="small" v-model="_item.symbol" placeholder="请选择" @change="change_thirdOption(_item)">
                                                <el-option v-for="item in _item.terms"  :key="item.code" :label="item.name" :value="item.code">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <div class="connectLine"></div>
                                        <el-form-item v-if="_item.symbol==12||_item.symbol==13" size="small" label="" label-width="0px" style="width:38%;margin:0 2px;display:block;">
                                            <el-input
                                                size="small"
                                                style="width:100%;height:auto"
                                                :rows="4"
                                                :disabled = "(_item.symbol == 9||_item.symbol == 10)? true :false"
                                                v-model="_item.value"
                                                placeholder="请输入内容"
                                                autocomplete="off"
                                                type="textarea"></el-input>
                                        </el-form-item>
                                        <el-form-item
                                            v-else
                                            style="width:38%;margin:0 2px;display:block;"
                                            label=""
                                            label-width="0px"

                                        >
                                            <el-input
                                                size="small"
                                                placeholder="请输入"
                                                :disabled = "(_item.symbol == 9||_item.symbol == 10)? true :false"
                                                v-model="_item.value"
                                            ></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="ub ub-ac ub-pj btn-list">
                                        <i class="add-btn el-icon-circle-plus-outline" v-if="index+1 == formData.contentArr.length" @click="addMappings"></i>
                                        <i class="del-btn el-icon-delete-solid" v-if="index !== 0" @click="removeMapping(index)"></i>
                                    </div>
                                </div>
                                <div v-if="formData.contentArr.length === 0" class="empty-array ub ub-ac w100 ub-pc">
                                    暂无数据
                                </div>
                            </div>
                        </div>
                    </div> -->
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button size="small" @click="cancel">取消</el-button>
                <el-button size="small" type="primary" @click="submit">确认</el-button>
            </div>
        </el-dialog>
        <DeleteDialog
            :dialogVisible = deleteDialog
            @delete="handleDelete"
            @cancel="deleteDialog = false">
        </DeleteDialog>
    </div>
</template>

<script>
import {
    public_edit,
    public_del,
    getSymbolList,
    getLogFieldList,
    public_page
} from '@/server/reporting_platform/report_config.js'
import ConditionRules from './components/ConditionRules'
import ConditionTips from './components/ConditionTips'
import initData from '@/mixins/initData.js'
import {
    opt_string,
    options_others,
    options_other,
    options_ips
} from '../config_data.js'
function isValidIP(ip) {
    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    return reg.test(ip)
}
const isIps = (value) => {
    if (value === '') {
        return true
    } else if (value.indexOf('\n') > -1) {
        console.log(value)
        value = value.replace(/(\r)|(\r\n)/g, '\n')
        console.log(value)
        let ips = value.split('\n')
        let _ips = []
        ips.forEach(item => {
            if (item != '') {
                let ips = item.split('-')
                _ips = _ips.concat(ips)
            }
        })
        console.log('_ips', _ips)
        if (_ips.length == 0) {
            return true
        } else if (_ips.every(item => isValidIP(item))) {
            return true
        } else {
            return false
        }
    } else if (isValidIP(value)) {
        return true
    } else {
        let ips = value.split('-')
        if (ips.every(item => isValidIP(item))) {
            return true
        } else {
            return false
        }
    }
}
export default {
    name: 'InformationSystem',
    mixins: [initData],
    components: {
        ConditionRules,
        ConditionTips
    },
    data() {
        return {
            tableHeight: document.body.clientHeight - 310,
            searchForm: {
                name: '',
                code: ''
            },
            tableData: [],
            deleteDialog: false,
            deleteId: '',
            addEditDialog: false,
            formLabelWidth: '120px',
            formData: {
                id: '',
                bigName: '',
                typeName: '',
                type: 5,
                contentArr: [],
                relationalArr: [
                    {
                        intersymbol: 'y',
                        children: [
                            {
                                field: '',
                                symbol: '',
                                value: ''
                            }
                        ]
                    }
                ]
            },
            terms: [],
            columnNames: [],
            rules: {},
            vm: this
        }
    },
    watch: {
        addEditDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.formData.resetFields()
                    this.formData.contentArr = []
                }
            }
        }
    },
    filters: {
        getCondition(val, vm) {
            if (!val) {
                return ''
            }
            let current = vm.terms.filter(item => item.code === val)
            if (current.length > 0) {
                return current[0].name
            } else {
                return ''
            }
        },
        getName(val, vm) {
            if (!val) {
                return ''
            }
            let current = vm.columnNames.filter(item => item.field === val)
            if (current.length > 0) {
                return current[0].name
            } else {
                return ''
            }
        }
    },
    methods: {
        get_tj(field, columnNames = []) {
            let terms = []
            if (field) {
                let cur = columnNames.filter(item => item.code === field)
                if (cur.length > 0) {
                    // options_ips
                    if (['srcIp', 'desIp'].includes(field)) {
                        let options = cur[0].type == 1 ? [...opt_string, options_ips] : [...options_others, ...options_ips]
                        terms = options.map(item => {
                            return {
                                code: item.value,
                                name: item.label
                            }
                        })
                    } else {
                        terms = cur[0].type == 1 ? opt_string.map(item => {
                            return {
                                code: item.value,
                                name: item.label
                            }
                        }) : options_others.map(item => {
                            return {
                                code: item.value,
                                name: item.label
                            }
                        })
                    }
                } else {
                    if (['srcIp', 'desIp'].includes(field)) {
                        let options = [...options_other, ...options_ips]
                        terms = options.map(item => {
                            return {
                                code: item.value,
                                name: item.label
                            }
                        })
                    } else {
                        terms = options_other.map(item => {
                            return {
                                code: item.value,
                                name: item.label
                            }
                        })
                    }
                }
            } else {
                terms = options_other.map(item => {
                    return {
                        code: item.value,
                        name: item.label
                    }
                })
            }
            return terms
        },
        change_thirdOption(obj) {
            if (obj.symbol == 9) {
                obj.value = ''
            }
        },
        changeFields(val, obj) {
            let list = this.get_tj(val, this.columnNames)
            obj.symbol = ''
            obj.terms = list
        },
        indexMethod(index) {
            return (this.listQuery.page - 1) * this.listQuery.limit + index + 1
        },
        search() {
            this.listQuery.page = 1
            this.get_data()
        },
        reset() {
            this.searchForm = {
                name: '',
                code: ''
            }
            setTimeout(() => {
                this.get_data()
            }, 500)
        },
        handleEdit(row) {
            console.log(row, 'row')
            this.addEditDialog = true
            this.formData.id = row.id
            this.formData.bigName = row.bigName
            this.formData.typeName = row.name
            this.formData.type = row.type
            if (row.ruleItemList.length > 0) {
                let ruleCnDTO = row.ruleItemList[0]
                ruleCnDTO.children = ruleCnDTO.children.map(item => {
                    if (item.intersymbol) { // 组
                        item.children = item.children.map(t => {
                            t.symbol = t.symbol + ''
                            return t
                        })
                    } else {
                        item.symbol = item.symbol + ''
                    }
                    return item
                })
                this.formData.relationalArr = this.$deepCopy(row.ruleItemList)
            } else {
                this.formData.relationalArr = [
                    {
                        intersymbol: 'y',
                        children: [
                            {
                                field: '',
                                symbol: '',
                                value: '',
                                fieldType: ''
                            }
                        ]
                    }
                ]
            }
            // let ruleItems = row.ruleItems.map(item => {
            //     let list = this.get_tj(item.field, this.columnNames)
            //     console.log(list, 'list')
            //     return {
            //         field: item.field,
            //         symbol: item.symbol ? item.symbol + '' : '',
            //         value: item.value,
            //         terms: list
            //     }
            // })
            // this.formData.contentArr = ruleItems || []
            // if (this.formData.contentArr.length == 0) {
            //     this.formData.contentArr.push({
            //         field: '',
            //         symbol: '',
            //         value: '',
            //         terms: []
            //     })
            // }
        },
        toAddRule() {
            this.formData.relationalArr = [
                {
                    intersymbol: 'y',
                    children: [
                        {
                            field: '',
                            symbol: '',
                            value: '',
                            fieldType: ''
                        }
                    ]
                }
            ]
        },
        handleDel(row) {
            this.deleteDialog = true
            this.deleteId = row.id
        },
        removeMapping(index) {
            this.formData.contentArr.splice(index, 1)
        },
        addMappings() {
            this.formData.contentArr.push({
                field: '',
                symbol: '',
                value: '',
                terms: []
            })
        },
        submit() {
            this.$refs.formData.validate((valid) => {
                if (valid && this.validateRel()) {
                    this.editMapping()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        validateRel() {
            let list = []
            let arr = this.$deepCopy(this.formData.relationalArr[0].children)
            arr.map(item => {
                if (item.intersymbol) { // 组
                    list = [...list, ...item.children]
                } else {
                    list = [...list, ...[item]]
                }
            })
            let validateRes = true
            if (list.some(item => item.field != '' && (item.symbol == '' || (item.symbol != 9 && item.symbol != 10 && item.value == '')))) {
                this.$message({
                    message: '字段/条件/值有一个不为空时，其余两个不能为空',
                    type: 'warning'
                })
                validateRes = false
            }
            if (list.some(item => ((item.symbol != '' && item.symbol != 9 && item.symbol != 10 && (item.field == '' || item.value == ''))) || ((item.symbol == 9 || item.symbol == 10) && item.field == ''))) {
                this.$message({
                    message: '条件为空/不为空时，字段不能为空',
                    type: 'warning'
                })
                validateRes = false
            }
            if (list.some(item => item.value != '' && (item.symbol == '' || item.field == ''))) {
                this.$message({
                    message: '字段/条件/值有一个不为空时，其余两个不能为空',
                    type: 'warning'
                })
                validateRes = false
            }
            if (list.some(item => item.symbol == 9 && item.field == '')) {
                this.$message({
                    message: '条件为空时，所选字段不能为空',
                    type: 'warning'
                })
                validateRes = false
            }
            if (list.some(item => (item.symbol == 12 || item.symbol == 13) && !isIps(item.value))) {
                this.$message({
                    message: 'IP范围格式不正确',
                    type: 'warning'
                })
                validateRes = false
            }
            return validateRes
        },
        editMapping() {
            console.log(this.formData.relationalArr, ' this.formData.relationalArr')
            let intersymbol = this.formData.relationalArr[0].intersymbol
            let list = this.formData.relationalArr[0].children
            let _list = []
            list.map(item => {
                let arr = []
                if (item.intersymbol) { // 组
                    if (item.children.length === 1) {
                        let obj = {}
                        obj.field = item.children[0].field
                        obj.symbol = item.children[0].symbol
                        obj.value = item.children[0].value
                        obj.fieldType = item.children[0].fieldType
                        arr.push(obj)
                    } else if (item.children.length > 1) {
                        item.children.forEach(e => {
                            let obj = {}
                            obj.field = e.field
                            obj.symbol = e.symbol
                            obj.value = e.value
                            obj.fieldType = e.fieldType
                            arr.push(obj)
                        })
                        arr.push({
                            intersymbol: item.intersymbol
                        })
                    }
                } else { // 条件
                    let obj = {}
                    obj.field = item.field
                    obj.symbol = item.symbol
                    obj.value = item.value
                    obj.fieldType = item.fieldType
                    arr.push(obj)
                }
                _list.push(arr)
            })
            console.log(_list, '_list')
            _list = _list.map(item => JSON.stringify(item))
            let str = intersymbol === 'y' ? _list.join('&&') : _list.join('||')
            console.log(str, 'str')
            let data = {
                queryData: {},
                paramsData: {
                    type: 5,
                    id: this.formData.id,
                    mapping: str
                }
            }
            public_edit(data).then(res => {
                this.addEditDialog = false
                this.$message({
                    message: '编辑成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 500)
            })
        },
        cancel() {
            this.addEditDialog = false
        },
        handleDelete() {
            let data = {
                queryData: {},
                paramsData: {
                    id: this.deleteId,
                    type: 5
                }
            }
            public_del(data).then(res => {
                this.deleteDialog = false
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 500)
            })
        },
        get_symbol() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            this.terms = []
            getSymbolList(data).then(res => {
                this.terms = res.filter(item => item.code != 11)
            })
        },
        get_field() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            this.terms = []
            getLogFieldList(data).then(res => {
                this.columnNames = res
            })
        },
        get_data() {
            let data = {
                queryData: {
                    page: this.listQuery.page,
                    pageSize: this.listQuery.limit
                },
                paramsData: {
                    type: 5,
                    name: this.searchForm.name,
                    code: this.searchForm.code
                }
            }
            this.listLoading = true
            this.tableData = []
            public_page(data).then(res => {
                this.listLoading = false
                this.tableData = res.records.map(e => {
                    let obj = {
                        id: e.id,
                        code: e.code,
                        name: e.name,
                        bigName: e.bigName,
                        type: e.type,
                        ruleItemList: e.ruleCnDTO ? [e.ruleCnDTO] : []
                    }
                    return obj
                })
                this.total = res.total
            }).catch((error) => {
                this.listLoading = false
                console.log('error' + error)
            })
        }
    },
    beforeDestroy() {
        this.$eventBus.$off('del-first')
    },
    mounted() {
        this.$eventBus.$on('del-first', () => {
            let index = this.formData.relationalArr[0].children.findIndex(item => item.intersymbol && item.children.length === 0)
            if (index > -1) {
                this.formData.relationalArr[0].children.splice(index, 1)
            }
        })
        this.get_field()
        this.get_data()
    }
}
</script>

<style lang='scss' scoped>
.rule-area {
    // width: 81.5%;
    // position: relative;
    // left: 120px;
    // top: -30px;
    // background: rgba(0, 0, 0 , .1);
    border-radius: 4px 4px 2px 4px;
    padding: 20px;
    box-sizing: border-box;
    border: 1px solid #ddd;
}
.btn-list{
    margin-left: 10px;
    width: 40px;
}
.add-btn {
    cursor: pointer;
    text-align: center;
}
.del-btn {
    cursor: pointer;
    text-align: center;
}
.empty-array {
    color: #fff;
    height: 68px;
}
</style>
