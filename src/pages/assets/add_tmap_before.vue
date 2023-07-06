<template>
    <div class="list add_template" style="overflow-y:hidden">
        <div class="w100" style="background:#fff;padding:10px;height:calc(100vh - 90px)">
            <div class="ub w100 relative">
                <div class="list-tips">选择资产</div>
                <div class="ub" style="margin-left: 20px">
                    <el-steps :space="100" :active="activeStep">
                        <el-step><i class="step1 step1Active" slot="icon">添加拓扑图资产</i></el-step>
                        <el-step><i class="step2 step2Ready" slot="icon">绘制资产拓扑图</i></el-step>
                    </el-steps>
                </div>
                <div class="btn-wrap" style="margin-left: auto;">
                    <el-button @click="cancel" size="small">取消</el-button>
                    <el-button @click="next('formData')" size="small" type="primary">下一步</el-button>
                </div>
            </div>
            <div class="w100 form-wrapper" style="color: #fff;padding-top:20px;">
                <el-form  ref="formData" :model="formData" :rules="formDataRules" label-width="100px" label-position="top">
                    <el-form-item label="拓扑图名称：" style="width: 484px" prop="name" size="small">
                        <el-input clearable v-model.trim="formData.name" size="small" placeholder="请输入"></el-input>
                    </el-form-item>
                    <div class="ub" style="width:100%;">
                        <el-form-item label="选择资产：" style="width: 100%;" prop="userIds" size="small">
                            <div class="w100">
                                <div class="ub" style="margin-bottom:10px;width:50%;">
                                    <div class="ub ub-f1">
                                        <el-input placeholder="资产名称" clearable v-model="get_params.name" size="small" @input="searchCheck" suffix-icon="el-icon-search">
                                        </el-input>
                                    </div>
                                    <div class="ub ub-f1" style="margin-left:20px;">
                                        <el-input placeholder="资产ip" clearable v-model="get_params.ip" size="small" @input="searchCheck" suffix-icon="el-icon-search">
                                        </el-input>
                                    </div>
                                    <div class="ub ub-f1" style="margin-left:20px;">
                                        <treeselect
                                            class="treeselect"
                                            style="width:100%;"
                                            :options="treeData"
                                            :normalizer="normalizer"
                                            noChildrenText="当前分支无子节点"
                                            noOptionsText="无可用选项"
                                            noResultsText="无可用选项"
                                            placeholder="请选择"
                                            v-model="get_params.type"
                                            @input="searchCheck"
                                        />
                                    </div>
                                </div>
                                <el-table
                                    ref="multipleTable"
                                    v-loading="loading"
                                    :row-key="(row)=>{ return row.id}"
                                    class='bigTable add-tmap'
                                    :data="tableData"
                                    border
                                    stripe
                                    :height="tabHeight"
                                    :row-class-name="tableRowClassName"
                                    tooltip-effect="dark"
                                    @selection-change="handleSelectionChange"
                                    :row-style="{ height: '32px' }"
                                    :header-row-style="{ height: '32px' }"
                                >
                                    <el-table-column align="center"  :reserve-selection="true" type="selection" width="30"></el-table-column>
                                    <el-table-column align="center" type="index" width="50" :index="indexMethod" label="序号">
                                    </el-table-column>
                                    <el-table-column prop="deviceName" label="资产名称">
                                    </el-table-column>
                                    <el-table-column prop="deviceTypeName" label="资产类型">
                                    </el-table-column>
                                    <el-table-column label="资产ip">
                                        <template slot-scope="{row}">
                                            <span>{{getAssetsIp(row,1)}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="资产端口">
                                        <template slot-scope="{row}">
                                            <span>{{getAssetsIp(row,2)}}</span>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <pagination :total="total_num" :page.sync="get_params.page" :limit.sync="get_params.size" @pagination="get_data" style="padding-top:10px"/>
                            </div>
                        </el-form-item>
                    </div>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
// import the component
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {
    tmapAssetsType,
    getAssetsList
} from '../../server/assets/api.js'

export default {
    name: 'AddTmap',
    components: {
        Treeselect
    },
    data() {
        return {
            tabHeight: document.body.clientHeight - 350,
            activeStep: 0,
            types: [],
            formData: {
                name: ''
            },
            formDataRules: {
                name: [
                    { required: true, message: '请输入拓扑图名称', trigger: 'blur' }
                ]
            },
            loading: false,
            total_num: 0,
            tableData: [],
            multipleSelection: [],
            treeData: [],
            normalizer(node) {
                if (node.sub && !node.sub.length) {
                    delete node.sub
                }
                return {
                    id: node.id,
                    label: node.name,
                    children: node.sub
                }
            },
            get_params: {
                page: 1,
                size: 20,
                name: '',
                ip: '',
                type: null
            }
        }
    },
    watch: {
        multipleSelection(newVal) {
            this.tableData = this.tableData.map(item => {
                if (newVal.some(e => e.id === item.id)) {
                    item.isSelected = true
                } else {
                    item.isSelected = false
                }
                return item
            })
        }
    },
    mounted() {
        this.$nextTick(() => {
            if (this.$route.query.name) {
                this.formData.name = this.$route.query.name
            }
            this.initType()
            this.get_data()
        })
    },

    methods: {
        tableRowClassName({ row, rowIndex }) {
            console.log(rowIndex)
            if (rowIndex % 2) {
                return 'table-row2'
            } else {
                return 'table-row1'
            }
        },
        getAssetsIp(row, status) {
            if (row.ips && row.ips.length > 0) {
                if (row.ips.some(item => item.ipType == 1)) {
                    let ipv4 = row.ips.filter(item => item.ipType == 1)[0]
                    if (status == 1) {
                        return ipv4.assetsIp
                    } else {
                        let ports = []
                        if (ipv4.ports && ipv4.ports.length) {
                            ports = ipv4.ports.map(e => {
                                return e.port
                            })
                        }
                        return ports.join(',')
                    }
                } else {
                    return ''
                }
            } else {
                return ''
            }
        },
        initType() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            tmapAssetsType(data).then(res => {
                console.log('tree', res)
                let list = res
                if (list.length > 0) {
                    this.treeData = list
                }
            }).catch(error => {
                console.log('error' + error)
            })
        },
        handelSelected(row) {
            this.$refs.multipleTable.toggleRowSelection(row, !row.isSelected)
        },
        indexMethod(index) {
            return (this.get_params.page - 1) * this.get_params.size + index + 1
        },
        searchCheck() {
            this.get_params.page = 1
            this.get_data()
        },
        handleSelectionChange(val) {
            console.log(val)
            this.multipleSelection = val
        },
        handleSizeChange(val) {
            this.get_params.size = val
            this.get_data()
        },
        handleCurrentChange(val) {
            this.get_params.page = val
            this.get_data()
        },
        get_data() {
            this.loading = true
            this.tableData = []
            let data = {
                queryData: {
                    page: this.get_params.page,
                    pageSize: this.get_params.size
                },
                paramsData: {
                    deviceTypeId: this.get_params.type,
                    ip: this.get_params.ip,
                    assetsName: this.get_params.name
                }
            }
            getAssetsList(data).then(res => {
                this.loading = false
                this.total_num = res.total
                let list = res.records
                if (list.length > 0) {
                    this.tableData = list.map(item => {
                        item.isSelected = false
                        return item
                    })
                }
            }).catch(error => {
                this.loading = false
                console.log('error' + error)
            })
        },

        cancel() {
            this.$router.go(-1)
        },
        next(formName) {
            let that = this
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let assetsSelected = this.multipleSelection.map(item => {
                        console.log(item)
                        let obj = {}
                        obj.device_name = item.deviceName
                        obj.device_type_name = item.deviceTypeName
                        obj.device_type_id = item.deviceTypeId
                        obj.device_ip = this.getAssetsIp(item, 1)
                        obj.device_ports = this.getAssetsIp(item, 2)
                        return obj
                    })
                    let data = {
                        name: this.formData.name,
                        assets: assetsSelected
                    }
                    that.$setsessionStorage('assetTopoData', data)
                    that.$router.push({
                        path: '/assets/assets_topo',
                        query: {
                            from: 'add'
                        }
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        }

    }
}
</script>
<style lang="scss">
.vue-treeselect--single .vue-treeselect__option--selected {
    font-weight: normal !important;
}
.vue-treeselect__control{
        height: 30px;
        line-height: 30px;
        font-size: 12px;
}
.vue-treeselect__input{
        vertical-align: middle;
}
</style>
<style lang="scss" scoped>
    .treeselect{
        font-size:12px !important;
        color:rgba(0,0,0,.9) !important;
    }
    .event-content{
        background-color: #111d2b;
    }
    .relative {
        position: relative;
        .btn-wrap {
            position: absolute;
            right: 0;
        }
    }

    .add_template ::v-deep .is-disabled {
        .el-textarea__inner {
            background: transparent;
            border: 1px solid #1cd7fa;
            box-shadow: 0px 0px 7px #389bf7 inset;
            color: #ccc;
        }
    }
    .add_template ::v-deep .el-steps {
        .el-step {
            .el-step__head {
                .el-step__line {
                    display: none;
                    height: 0px;
                }
                .is-text {
                    width: 186px;
                    height: 30px;
                    border-style: hidden;
                    background-color:transparent !important;
                }
            }
            .step1, .step2, .step3 {
                width: 186px;
                color: #ffffff;
                text-indent: 24px;
                margin-left: 6px;
                line-height: 30px;
                font-style: normal;
                height: 30px;
                background-size: 100% 100%;
            }
            .step2, .step3 {
                text-indent: 38px;
            }
        }
    }
.add-tmap{
    span.selected-btn{
        color: #409eff!important;
        opacity: .5;
        cursor: pointer;
    }
    span.selected-btn.active{
        color:#409EFF!important;
        opacity: 1;
    }
}
</style>
