<template>
    <div class="report-platform">
        <el-dialog :title="status?'编辑':'新建'" :visible.sync="addDialog" width="700px" custom-class="common-dialog">
            <el-form :model="addForm" :rules="rules" ref="addForm" label-position="top">
                <div class="ub ub-pj">
                    <el-form-item label="部署方式：" label-width="90px" prop="upType" style="width: 300px;">
                        <el-select style="width:100%;" size="small" v-model="addForm.upType" filterable placeholder="请选择">
                            <el-option v-for="(item,index) in modes" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="模块名称：" label-width="90px" prop="moduleKey" style="width: 300px;">
                        <el-select style="width:100%;" size="small" v-model="addForm.moduleKey" filterable placeholder="请选择" @change="changeModuleKey">
                            <el-option v-for="(item,index) in modulars" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <el-form-item label="基础目录：" label-width="90px" prop="catalog">
                    <el-input
                        v-model="addForm.catalog"
                        placeholder="请输入"
                        clearable
                        size="small"
                        style="width:100%;" >
                    </el-input>
                </el-form-item>
                <el-form-item label="地址/账号：" class="users" label-width="90px">
                </el-form-item>
                <div class="rule-area">
                    <p class="add-Btn" @click="addUsers">
                        <i class="el-icon-plus" style="margin-right: 5px"></i>添 加
                    </p>
                    <div v-for="(item,index) in addForm.list" :key="index" class="rule-box ub ub-ac" :class="index%2 ? 'odd': 'even'">
                        <div class="rule-select ub ub-ac ub-pj">
                            <el-input
                                v-model="addForm.list[index].ip"
                                placeholder="请输入IP"
                                clearable
                                size="small"
                                style="width: 120px;">
                            </el-input>
                            <span class="connectLine"></span>
                            <el-input
                                v-model="addForm.list[index].port"
                                placeholder="请输入端口"
                                clearable
                                size="small"
                                style="width: 120px;">
                            </el-input>
                            <span class="connectLine"></span>
                            <el-input
                                v-model="addForm.list[index].account"
                                placeholder="请输入用户名"
                                clearable
                                size="small"
                                style="width: 120px;">
                            </el-input>
                            <span class="connectLine"></span>
                            <el-input
                                v-model="addForm.list[index].password"
                                placeholder="请输入密码"
                                clearable
                                size="small"
                                style="width: 120px;">
                            </el-input>
                        </div>
                        <span class="del-btn el-icon-circle-close" @click="delUsers(index)"></span>
                    </div>
                    <div v-if="addForm.list.length === 0" class="empty-array ub ub-ac ub-pc">
                        暂无数据
                    </div>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <Debounce :time="1500" :isDebounce="2">
                    <el-button size="small" type="primary" @click.native="submitForm('addForm')">确 定</el-button>
                </Debounce>
                <el-button size="small" @click="addDialog = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { addUpgrade, update } from '@/server/system/upgrade.js'
export default {
    name: 'AddUpgrade',
    props: {
        modulars: {
            type: Array,
            default: null
        },
        modes: {
            type: Array,
            default: null
        },
        status: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            optId: '',
            addDialog: false,
            addForm: {
                moduleName: '',
                moduleKey: '',
                upType: '',
                list: [
                    {
                        ip: '',
                        port: '',
                        account: '',
                        password: ''
                    }
                ],
                catalog: ''
            },
            formLabelWidth: '120px',
            rules: {
                moduleKey: [
                    {
                        required: true,
                        message: '请选择',
                        trigger: 'change'
                    }
                ],
                upType: [
                    {
                        required: true,
                        message: '请选择',
                        trigger: 'change'
                    }
                ],
                catalog: [
                    {
                        required: true,
                        message: '请输入',
                        trigger: 'blur'
                    }
                ]

            }
        }
    },
    watch: {
        addDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.$refs.addForm.resetFields()
                    this.addForm = {
                        moduleName: '',
                        moduleKey: '',
                        upType: '',
                        list: [
                            {
                                ip: '',
                                port: '',
                                account: '',
                                password: ''
                            }
                        ],
                        catalog: ''
                    }
                }
            }
        }
    },
    methods: {
        changeModuleKey() {
            console.log(this.modulars.some(item => item.value === this.addForm.moduleKey))
            if (this.modulars.some(item => item.value === this.addForm.moduleKey)) {
                this.addForm.moduleName = this.modulars.filter(item => item.value === this.addForm.moduleKey)[0].label
            } else {
                this.addForm.moduleName = ''
            }
            console.log(this.addForm.moduleName)
        },
        delUsers(index) {
            this.addForm.list.splice(index, 1)
        },
        addUsers() {
            this.addForm.list.push({
                ip: '',
                port: '',
                account: '',
                password: ''
            })
        },
        submitForm(formName) {
            if (this.addForm.list.length === 0) {
                this.$message({
                    message: '请添加地址/账号',
                    type: 'warning'
                })
                return
            }
            this.$refs[formName].validate(valid => {
                if (valid) {
                    if (this.status) {
                        this.edit()
                    } else {
                        let data = {
                            queryData: {},
                            paramsData: this.addForm
                        }
                        addUpgrade(data)
                            .then(res => {
                                this.addDialog = false
                                this.$message({
                                    message: '新建成功',
                                    type: 'success'
                                })
                                setTimeout(() => {
                                    this.$emit('submitForm')
                                }, 1500)
                            })
                            .catch(error => {
                                console.log(error + 'error')
                            })
                    }
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        edit() {
            let data = {
                queryData: {},
                paramsData: this.addForm
            }
            data.paramsData.id = this.optId
            update(data)
                .then(res => {
                    this.addDialog = false
                    this.$message({
                        message: '编辑成功',
                        type: 'success'
                    })
                    setTimeout(() => {
                        this.$emit('submitForm')
                    }, 1500)
                })
                .catch(error => {
                    console.log(error + 'error')
                })
        }
    }
}
</script>

<style lang="scss" scoped>
.report-platform ::v-deep .el-form-item {
    margin-bottom: 16px;
}
.el-form-item.users ::v-deep  .el-form-item__label:before {
    content: '*';
    color: #F56C6C;
    margin-right: 4px;
}
 .connectLine {
        width: 16px;
        margin: 0 4px;
        height: 1px;
        content: '';
        box-sizing: border-box;
        display: inline-block;
        background-color: #dddddd;
        vertical-align: middle;
    }

.rule-area {
        width: 100%;
        position: relative;
        left: 0px;
        top: -20px;
        // background: rgba(0, 0, 0 , .2);
        border-radius: 4px 4px 2px 4px;
        padding: 20px;
        box-sizing: border-box;
        border: 1px solid #dddddd;
    }

    .add-Btn {
        position: absolute;
        top: -26px;
        right: 10px;
        color: #0052d9;
        font-size: 12px;
        cursor: pointer;
    }

    .rule-box {
        height: 68px;
        line-height: 68px;
        padding:0 10px;

        &.even {
            // background: rgba(0,192,255,.1);
        }

        &.odd {
            // background: rgba(0,240,255,.1);
        }

        span.number {
            display: inline-block;
            box-sizing: border-box;
            width: 20px;
            text-align: center;
        }

        span.del-btn {
            display: inline-block;
            box-sizing: border-box;
            width: 30px;
            color: #e34d59;
            cursor: pointer;
            text-align: center;
        }
    }

    // .rule-box::before {
    //     content: "";
    //     position: absolute;
    //     top: 0;
    //     left: 21px;
    //     width: 1px;
    //     height: 68px;
    //     background: rgba(0, 0, 0, .8);

    // }

    // .rule-box::after {
    //     content: "";
    //     position: absolute;
    //     top: 0;
    //     right: 28px;
    //     width: 1px;
    //     height: 68px;
    //     background: rgba(0, 0, 0, .8);

    // }

    .empty-array {
        color: #fff;
        height: 68px;
    }

</style>
