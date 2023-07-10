<template>
    <div class="list">
        <div class="list-container" style="margin-top: 0px">
            <div class="ub ub-pj w100 mb-1">
                <div class="list-tips">工作规范纪律</div>
            </div>
            <el-table
                ref="multipleTable"
                v-loading="loading"
                class='bigTable'
                :data="tableData"
                :row-class-name="tableRowClassName"
                :row-style="{ height: '32px' }"
                :header-row-style="{ height: '32px' }"
                :height="tableHeight"
                border
                stripe
                tooltip-effect="dark">
                <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                </el-table-column>
                <el-table-column prop="type" label="类型">
                    <template slot-scope="{row}">
                        <div>
                            <span v-if="row.type == 0">日常工作纪律规范</span>
                            <span v-if="row.type == 1">战时工作纪律规范</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" v-per="['protective_rule_view']" @click="handleSee(scope.row)">查看</el-button>
                        <el-button size="small" type="text" v-per="['protective_rule_edit']" @click="handleEdit(scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination
                :total="total_num"
                :page.sync="get_params.page"
                :limit.sync="get_params.size"
                @pagination="get_data"
                style="padding-top:10px"
                v-show="total_num>0"/>
        </div>
        <!--编辑内容开始-->
        <el-drawer
            title="编辑规范"
            :visible.sync="editRuleDialog"
            :size="720"
            :show-close="true"
            :before-close="closeDialog"
            custom-class="drawer-dialog"
            direction="rtl">
            <div class="drawer-pad">
                <el-form style="margin: 0 0 30px -6px" label-position="top">
                    <el-form-item label="规范类型：" label-width="90px">
                        <el-select v-model="editType" placeholder="请选择" size="small" style="width: 100%;">
                            <el-option label="日常工作纪律规范" value="0"></el-option>
                            <el-option label="战时工作纪律规范" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <p style="margin:0 0 8px 14px">情报内容：</p>
                <vue-ueditor-wrap v-model="discipline" :config="myConfig"></vue-ueditor-wrap>
                <div
                    slot="footer"
                    class="demo-drawer__footer"
                    style="
                    position: fixed;
                    bottom: 0;
                    right: 0;
                    z-index: 9999;
                    width: 720px;
                    background: #fff;
                    padding-bottom: 10px;
                    text-align: right;">
                    <el-button @click="closeDialog" size="small" class="mr-1">取消</el-button>
                    <el-button type="primary" @click="editRuleSuccess" size="small" style="margin-right:30px">确认</el-button>
                </div>
            </div>
        </el-drawer>
    </div>
</template>

<script>
import {
    get_ruleStandard_data,
    edit_ruleStandard
} from '../../server/protect_net/api.js'
import VueUeditorWrap from '../../components/vue-ueditor-wrap.vue' // ES6 Module
import ueditorConfig from '../../mixins/ueditorConfig'
export default {
    name: 'RuleStandard',
    components: {
        VueUeditorWrap
    },
    mixins: [ueditorConfig],
    data() {
        return {
            discipline: '',
            appendContent: '', // 追加处置结果内容
            editType: '',
            editId: '',
            tableHeight: document.body.clientHeight - 180,

            formLabelWidth: '100px',
            loading: false,
            total_num: 0,
            tableData: [],
            multipleSelection: [],
            get_params: {
                page: 1,
                size: 20
            },
            delIds: '',
            editRuleDialog: false
        }
    },
    watch: {
        editRuleDialog: {
            handler(newVal, oldVal) {
                if (!newVal) {
                    this.discipline = ''
                    this.editType = ''
                }
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.get_data()
        })
    },
    methods: {
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex % 2) {
                return 'table-row2'
            } else {
                return 'table-row1'
            }
        },
        closeDialog(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    this.editRuleDialog = false
                    done()
                })
                .catch(_ => {})
        },
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        get_data() {
            this.loading = true
            this.tableData = []
            get_ruleStandard_data({}).then(res => {
                console.log(res)
                this.loading = false
                this.total_num = res.length
                let list = res
                if (list.length > 0) {
                    list.forEach(item => {
                        let obj = {}
                        obj.id = item.id
                        obj.discipline = item.discipline
                        obj.type = item.type
                        this.tableData.push(obj)
                    })
                }
            }).catch(error => {
                this.loading = false
                console.log('error' + error)
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
        handleSee(row) {
            this.$router.push({
                path: 'ruleDetail',
                query: {
                    discipline: row.discipline
                }
            })
        },
        handleEdit(row) {
            console.log('row', row)
            this.editType = row.type + ''
            this.editId = row.id
            this.discipline = row.discipline !== null ? row.discipline : ''
            this.editRuleDialog = true
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        },

        editRuleSuccess() {
            let data = {
                id: this.editId,
                discipline: this.discipline,
                type: this.editType * 1
            }
            edit_ruleStandard(data).then((res) => {
                this.editRuleDialog = false
                this.$message({
                    message: '编辑成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(error => {
                console.log(error)
            })
        }

    }
}
</script>

<style lang="scss" scoped>
    .pagination {
        padding: 0px 0 20px;
        text-align: right;
    }

    .el-input.ips {
        display: block;
        width: 100%;
    }

    .drawer-pad {
        padding: 0 20px;
    }

    .el-form-item {
        margin: 0;
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

  .drawer-pad {
    // padding: 0 20px;
    height: calc(100% - 53px);
    overflow-y: auto;
    overflow-x: hidden;
    //   padding-right: 10px;
    .dialog-footer {
        float: right;
        margin-top: 120px;
    }

    & ::v-deep img {
      max-width: 600px;
      max-height: 600px;
    }
    &::-webkit-scrollbar,
    li::-webkit-scrollbar,
    ul::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-track,
    li::-webkit-scrollbar-track,
    ul::-webkit-scrollbar-track {
      background: none;
    }
    .el-form--inline .el-form-item {
        margin-right: 0;
    }
    .kswitch {
        margin-top: 4px;
    }
  }
  .drawer-pad ::v-deep.el-form-item__content {
    font-size: 12px;
  }
  .drawer-pad ::v-deep .el-form-item__label {
    font-size: 12px;
  }
</style>
<style>
    #ue1{
        border: 1px solid #01e9ff!important;
    }
    .edui-default .edui-editor{
        border: 1px solid #dcdcdc!important;
        background-color: rgba(0,0,0,0)!important;
    }
    .edui-default .edui-editor-toolbarboxouter {
        border-bottom: 1px solid #dcdcdc!important;
         background-color: rgba(0,0,0,0)!important;
    }
    .edui-editor-toolbarboxinner.edui-default{
         /*background-color: rgba(0,0,0,1)!important;*/
    }
    #edui_fixedlayer {
        z-index: 9999999!important;
    }
</style>
