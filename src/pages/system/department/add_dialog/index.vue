<template>
    <el-dialog custom-class="common-dialog" width="700px" :title="type === 'add' ? '添加部门' : '编辑部门'" :visible.sync="dialogVisible" :before-close="cancel">
        <el-form ref="departmentForm" :rules="rules" label-position="top" :model="departmentForm" label-width="80px">
            <el-row :gutter="50">
                <el-col :span="12">
                    <el-form-item size="small" label="上级部门：" :label-width="formLabelWidth">
                        <div class="treeselect w100">
                            <Treeselect
                                style="width:100%;height:32px"
                                :options="treeData"
                                :normalizer="normalizer"
                                noChildrenText="无子集数据"
                                placeholder="请选择"
                                v-model="departmentForm.parentId"
                            />
                        </div>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item size="small" label="部门名称：" prop="name" :label-width="formLabelWidth">
                        <el-input size="small" v-model="departmentForm.name" placeholder="请输入" autocomplete="off"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer">
            <el-button size="small" @click="cancel">取消</el-button>
            <el-button size="small" type="primary" @click="submit">确认</el-button>
        </div>
    </el-dialog>
</template>

<script>
// import myRules from '@/utils/rules.js'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { department_save, department_update } from '@/server/system/department.js'

export default {
    name: 'AddDialog',
    components: {
        Treeselect
    },
    props: {
        dialogVisible: {
            default: false
        },
        type: {
            default: 'add'
        },
        treeData: {
            default: []
        }
    },
    data() {
        return {
            normalizer(node) {
                // if (node.sub && !node.sub.length) {
                //     delete node.sub
                // }
                return {
                    id: node.id,
                    label: node.name,
                    children: node.sub
                }
            },
            formLabelWidth: '80px',
            departmentForm: {
                parentId: null,
                name: ''
            },
            rules: {
                preName: [{
                    required: true,
                    message: '请输入上级部门',
                    trigger: 'blur'
                }],
                name: [{
                    required: true,
                    message: '请输入部门名称',
                    trigger: 'blur'
                }]
            }
        }
    },
    watch: {
        dialogVisible(val) {
            if (!val) {
                this.reset()
            }
        }
    },
    methods: {
        cancel() {
            this.$emit('close')
        },
        reset() {
            this.$refs.departmentForm.resetFields()
            this.departmentForm.parentId = null
            this.departmentForm.name = ''
        },
        submitForm() {
            let data = {
                queryData: {},
                paramsData: {
                    parentId: this.departmentForm.parentId ? this.departmentForm.parentId : '',
                    name: this.departmentForm.name
                }
            }
            // 编辑部门
            if (this.type === 'edit') {
                data.paramsData.id = this.$parent.curId
                department_update(data).then(res => {
                    this.$parent.addDialog = false
                    this.$message({
                        message: '操作成功！',
                        type: 'success'
                    })
                    setTimeout(() => {
                        this.$parent.initList()
                    }, 500)
                }).catch(error => {
                    console.log('error' + error)
                })
            } else { // 添加部门
                department_save(data).then(res => {
                    this.$parent.addDialog = false
                    this.$message({
                        message: '操作成功！',
                        type: 'success'
                    })
                    setTimeout(() => {
                        this.$parent.initList()
                    }, 500)
                }).catch(error => {
                    console.log('error' + error)
                })
            }
        },
        submit() {
            this.$refs.departmentForm.validate(valid => {
                if (valid) {
                    this.submitForm(this.type)
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        }
    }
}
</script>

<style scoped lang="scss">
// 树状下拉选样式
$borderColor:#DCDFE6;
.treeselect{
    //padding:4px 0;
    ::v-deep .vue-treeselect__control{
        height: 30px;
        line-height: 30px;
        border-color: $borderColor;
    }
    ::v-deep .vue-treeselect__input{
        vertical-align: middle;
    }
}
.add-ip {
    cursor: pointer;
    color: $high-color;
    width: 76px;
    i {
        font-size: 14px;
        margin-right: 2px;
    }
    span {
        font-size: 12px;
    }
}
.delete-btn {
    color: $danger-color;
    position: absolute;
    right: 0;
    top: -40px;
    font-size: 14px;
    cursor: pointer;
}
</style>
