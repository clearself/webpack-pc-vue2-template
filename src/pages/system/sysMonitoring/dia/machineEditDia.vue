<template>
    <el-dialog
        :title="title"
        :visible.sync="showDia"
        width="700px"
        @close="resetForm">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="ruleFormBox">
            <el-form-item label="设备IP" prop="ip">
                <el-input maxlength="20" v-model="ruleForm.ip"></el-input>
            </el-form-item>
            <el-form-item label="设备端口" prop="port">
                <el-input maxlength="20" v-model="ruleForm.port"></el-input>
            </el-form-item>
            <el-form-item label="设备名称" prop="name">
                <el-input maxlength="20" v-model="ruleForm.name"></el-input>
            </el-form-item>
            <!-- <el-form-item label="设备类型" prop="type">
                <el-select style="width: 100%" clearable v-model="ruleForm.type" placeholder="请选择设备类型">
                    <el-option filterable v-for="item in typeList" :label="item.name" :value="item.id" :key="item.id"></el-option>
                </el-select> -->
            <!--                <el-select style="width:100%;" ref="edit-select" placeholder="请选择" v-model="editForm.id"-->
            <!--                           size="small">-->
            <!--                    <el-option label="作为顶级类型" value="null"></el-option>-->
            <!--                    <el-option :label="editLabel" :value="editValue" style="overflow:scroll;height: 200px">-->
            <!--                        <el-tree ref="tree_addUser" node-key="id" :default-expand-all="true" :highlight-current="true"-->
            <!--                                 :data="treeData" :props='propsData' @node-click="handleNodeClick_edit"-->
            <!--                                 :check-strictly="true" :expand-on-click-node="false" :indent='indent'>-->
            <!--                                <span class="custom-tree-node" slot-scope="{ node, data }">-->
            <!--                                    <span style="font-size:12px;">{{ node.label }}</span>-->
            <!--                                </span>-->
            <!--                        </el-tree>-->
            <!--                    </el-option>-->
            <!--                </el-select>-->
            <!-- </el-form-item>
            <el-form-item label="设备单位" prop="company">
                <el-input maxlength="20" v-model="ruleForm.company"></el-input>
            </el-form-item> -->
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="showDia = false">取 消</el-button>
            <el-button size="small" type="primary" :loading="subLoading" @click="submit">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import {
    addServerReq,
    updateServerReq
} from '@/server/system/sysMonitoring.js'

export default {
    props: {
        typeList: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            showDia: false,
            title: '',
            row: {},
            ruleForm: {
                port: '',
                name: '',
                type: '',
                company: ''
            },
            rules: {
                ip: [
                    { required: true, message: '设备ip不能为空', trigger: 'blur' }
                ],
                port: [
                    { required: true, message: '设备端口不能为空', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '设备名称不能为空', trigger: 'blur' }
                ],
                type: [
                    { required: true, message: '设备类型不能为空', trigger: 'change' }
                ]
            },
            subLoading: false
        }
    },
    methods: {
        initDia(title, row) {
            this.title = title
            if (title == '编辑设备') {
                this.row = this.$deepCopy(row)
                this.ruleForm = {
                    ip: row.ip,
                    port: row.port,
                    name: row.name,
                    type: row.type,
                    company: row.company
                }
            }
            this.showDia = true
        },
        resetForm() {
            this.ruleForm = {
                port: '',
                name: '',
                type: '',
                company: ''
            }
            this.$refs.ruleForm.resetFields()
            // this.$nextTick(() => {
            //
            // })
        },
        submit() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.subLoading = true
                    if (this.title == '编辑设备') {
                        let data = {
                            queryData: {},
                            paramsData: {
                                ...this.ruleForm,
                                id: this.row.id,
                                serverType: '2'
                            }
                        }
                        updateServerReq(data).then(res => {
                            this.subLoading = false
                            this.$message.success('保存成功')
                            this.$emit('refresh')
                            this.showDia = false
                        }).catch(error => {
                            this.subLoading = false
                            console.log('error' + error)
                        })
                    } else {
                        let data = {
                            queryData: {},
                            paramsData: {
                                ...this.ruleForm,
                                serverType: '2'
                            }
                        }
                        addServerReq(data).then(res => {
                            this.subLoading = false
                            this.$message.success('保存成功')
                            this.$emit('refresh')
                            this.showDia = false
                        }).catch(error => {
                            this.subLoading = false
                            console.log('error' + error)
                        })
                    }
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.ruleFormBox {
    padding: 0 20px 0 0;
    box-sizing: border-box;
}

::v-deep .el-dialog__footer {
    padding-top: 0 !important;
}
</style>
