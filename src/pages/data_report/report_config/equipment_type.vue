<template>
    <div class="event event-wrapper equipment_type" style="min-height:auto!important;">
        <div>
            <div class="ub ub-pj w100 mb-1">
                <div class="list-tips">设备类型</div>
                <div>
                    <el-button icon="el-icon-plus" size="mini" type="primary" @click="handleAdd">添加数据</el-button>
                </div>
            </div>
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
                <el-table-column prop="name" label="设备类型" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="ipRange" label="IP范围" show-overflow-tooltip>
                </el-table-column>
                <el-table-column align="center" label="操作" width="150" fixed="right" class-name="deepBg">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" title="编辑" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button type="text" size="small" title="删除" @click="handleDel(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="get_data" />
        </div>
        <el-dialog custom-class="common-dialog" :title="type === 'add' ? '添加设备' : '编辑设备'" width="700px" :visible.sync="addEditDialog">
            <el-form ref="formData" :model="formData" label-position="top" :rules="rules">
                <el-row :gutter="50">
                    <el-col :span="12">
                        <el-form-item size="small" label="设备配型：" prop="code" :label-width="formLabelWidth">
                            <el-select size="small" v-model="formData.code" placeholder="请选择" style="width: 100%">
                                <el-option v-for="item in options_deviceType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item size="small" label="与IP范围关系：" prop="code" :label-width="formLabelWidth">
                            <el-radio v-model="formData.extra1" label="1">存在于</el-radio>
                            <el-radio v-model="formData.extra1" label="0">不存在与</el-radio>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item size="small" label="IP范围：" prop="ipRange" :label-width="formLabelWidth">
                            <el-input size="small" v-model="formData.ipRange" placeholder="请输入内容" autocomplete="off" type="textarea"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
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
    public_add,
    public_edit,
    public_del,
    public_page
} from '@/server/reporting_platform/report_config.js'
import {
    options_deviceType
} from '../config_data.js'
import initData from '@/mixins/initData.js'
function isValidIP(ip) {
    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    return reg.test(ip)
}
export default {
    name: 'EquipmentType',
    mixins: [initData],
    data() {
        const isIps = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入IP范围'))
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
                    callback(new Error('请输入IP范围'))
                } else if (_ips.every(item => isValidIP(item))) {
                    callback()
                } else {
                    callback(new Error('IP范围格式有不正确'))
                }
            } else if (isValidIP(value)) {
                callback()
            } else {
                let ips = value.split('-')
                if (ips.every(item => isValidIP(item))) {
                    callback()
                } else {
                    callback(new Error('IP范围格式不正确'))
                }
            }
        }
        return {
            options_deviceType: options_deviceType,
            deleteDialog: false,
            deleteId: '',
            addEditDialog: false,
            type: 'add',
            tableData: [],
            formLabelWidth: '80px',
            formData: {
                id: '',
                code: '',
                extra1: '1',
                ipRange: ''
            },
            rules: {
                code: [{
                    required: true,
                    message: '请选择设备配型',
                    trigger: 'change'
                }],
                ipRange: [{
                    required: true,
                    validator: isIps,
                    trigger: 'blur'
                }]
            }
        }
    },
    watch: {
        addEditDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.formData.resetFields()
                    this.formData.extra1 = '1'
                }
            }
        }
    },
    mounted() {
        this.get_data()
    },
    methods: {
        indexMethod(index) {
            return (this.listQuery.page - 1) * this.listQuery.limit + index + 1
        },
        handleAdd() {
            this.formData.id = ''
            this.formData.code = ''
            this.formData.extra1 = '1'
            this.formData.ipRange = ''
            this.addEditDialog = true
            this.type = 'add'
        },
        handleEdit(row) {
            this.formData.id = row.id
            this.formData.code = row.code
            this.formData.extra1 = row.extra1 || '1'
            this.formData.ipRange = row.ipRange
            this.addEditDialog = true
            this.type = 'edit'
        },
        handleDel(row) {
            this.deleteDialog = true
            this.deleteId = row.id
        },
        submit() {
            this.$refs.formData.validate((valid) => {
                if (valid) {
                    if (this.formData.id) {
                        this.editEquipment()
                    } else {
                        this.addEquipment()
                    }
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        addEquipment() {
            let cur_options_deviceType = options_deviceType.filter(item => item.value === this.formData.code)
            let data = {
                queryData: {},
                paramsData: {
                    type: 3,
                    name: cur_options_deviceType.length > 0 ? cur_options_deviceType[0].label : '',
                    code: this.formData.code,
                    extra1: this.formData.extra1,
                    ipRange: this.formData.ipRange
                }
            }
            public_add(data).then(res => {
                this.addEditDialog = false
                this.$message({
                    message: '添加成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 500)
            })
        },
        editEquipment() {
            let cur_options_deviceType = options_deviceType.filter(item => item.value === this.formData.code)
            let data = {
                queryData: {},
                paramsData: {
                    id: this.formData.id,
                    type: 3,
                    name: cur_options_deviceType.length > 0 ? cur_options_deviceType[0].label : '',
                    code: this.formData.code,
                    extra1: this.formData.extra1,
                    ipRange: this.formData.ipRange
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
                    type: 3
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
        get_data() {
            let data = {
                queryData: {
                    page: this.listQuery.page,
                    pageSize: this.listQuery.limit
                },
                paramsData: {
                    type: 3
                }
            }
            this.listLoading = true
            this.tableData = []
            public_page(data).then(res => {
                this.listLoading = false
                this.tableData = res.records
                this.total = res.total
            }).catch((error) => {
                this.listLoading = false
                console.log('error' + error)
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.upload-demo {
    display: inline-block;
    margin: 0 10px;
}

.event ::v-deep .el-input-group__append,
.event ::v-deep .el-input-group__prepend {
    background-color: rgba(0, 0, 0, 0);
    color: #1cd7fa;
    border: 1px solid #1cd7fa;
    border-left: 0;
}

.upload-demo ::v-deep a,
.upload-demo ::v-deep i {
    color: #1cd7fa;
}

.upload-demo ::v-deep .el-upload-list__item:hover {
    background-color: rgba(0, 0, 0, 0);
}
.rule-area {
    width: 88%;
    position: relative;
    left: 100px;
    top: -20px;
    background: rgba(0, 0, 0 , .2);
    border-radius: 4px 4px 2px 4px;
    padding: 20px;
    box-sizing: border-box;
    border: 1px solid rgba(28,215,250,.2);
}

.add-Btn {
    position: absolute;
    top: -26px;
    right: 10px;
    color: #01e9ff;
    font-size: 14px;
    cursor: pointer;
}
.del-btn {
    display: inline-block;
    box-sizing: border-box;
    width: 30px;
    color: #1cd7fa;
    cursor: pointer;
    text-align: center;
}
.connectLine {
    width: 16px;
    /*margin: 0 4px;*/
    height: 1px;
    content: '';
    font-size:0;
    box-sizing: border-box;
    display: inline-block;
    background-color: #fff;
}
.empty-array {
    color: #fff;
    height: 68px;
}
.mapping-item:nth-child(odd){
    background-color: rgba(0,192,255,.1);
}
.mapping-item:nth-child(even){
    background-color: rgba(0,240,255,.2);
}
</style>
