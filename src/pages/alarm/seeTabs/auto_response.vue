<template>
    <div class="auto">
        <div class="title mb-1">剧本信息</div>
        <el-descriptions :column="2" size="mini" border>
            <el-descriptions-item label="任务ID">{{seeForm.autoId||'--'}}</el-descriptions-item>
            <el-descriptions-item label="剧本名称">{{seeForm.autoName||'--'}}</el-descriptions-item>
            <el-descriptions-item label="剧本类型">
                <div v-if="seeForm.mouldType == 1">应急响应</div>
                <div v-if="seeForm.mouldType == 0">分析处置</div>
                <div v-if="seeForm.mouldType == 2">运维支持</div>
                <div v-if="seeForm.mouldType == null">--</div>
            </el-descriptions-item>
            <el-descriptions-item label="任务状态">{{seeForm.statusName||'--'}}</el-descriptions-item>
            <el-descriptions-item label="创建人">{{seeForm.createUser||'--'}}</el-descriptions-item>
            <el-descriptions-item label="任务开始时间">{{seeForm.createTime||'--'}}</el-descriptions-item>
            <el-descriptions-item label="任务结束时间">{{seeForm.endTime||'--'}}</el-descriptions-item>
            <el-descriptions-item label="任务描述">
                <div v-html="seeForm.autoOrderContent"></div>
            </el-descriptions-item>
        </el-descriptions>
        <div>
            <div class="title mb-1 mt-1">剧本详情</div>
            <bpmn-modeler
                v-if="workFlowInfo.xml"
                ref="refNode"
                :xml="workFlowInfo.xml"
                :workStatus="workStatus"
                :currentWorkIds="currentWorkIds"
                :is-view="false"
            />
        </div>
    </div>
</template>
<script>
import bpmnModeler from '../../../script_flow/detailXml'
import { getAutoResponse } from '@/server/alarm/define.js'
export default {
    components: { bpmnModeler },
    props: ['id', 'tabindex'],
    data() {
        return {
            loading: false,
            tableData: [],
            total_num: 10,
            get_params: {
                page: 1,
                size: 10
            },
            workFlowInfo: {
                xml: ''
            },
            workStatus: false,
            currentWorkIds: [],
            addForm: {
                des: ''
            },
            seeForm: {
                xml: '',
                autoId: '',
                autoName: '',
                mouldType: '',
                mouldName: '',
                status: '',
                statusName: '',
                createUser: '',
                createTime: '',
                endTime: '',
                autoOrderContent: ''
            },
            activeName: false
        }
    },
    watch: {
        tabindex(val) {
            if (val) {
                // this.seeForm = {
                //     xml: '',
                //     autoId: '',
                //     autoName: '',
                //     mouldType: '',
                //     mouldName: '',
                //     status: '',
                //     statusName: '',
                //     createUser: '',
                //     createTime: '',
                //     endTime: '',
                //     autoOrderContent: ''
                // }
                // this.workFlowInfo = {
                //     xml: ''
                // }
                // this.get_data()
            }
        }
    },
    created() {
        console.log(this.id)
        // this.$nextTick(() => {
        this.get_data()
        // })
    },
    methods: {
        submitCloes() {
            console.log(this.$parent)
            this.$emit('submitCloes')
        },
        submitAdd() {
            this.$emit('submitCloes')
        },
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex % 2) {
                return 'table-row2'
            } else {
                return 'table-row1'
            }
        },
        handleSee(row) {},
        // 获取工作流
        getWorkFlow() {},
        // 获取原始日志
        get_data() {
            let data = {
                queryData: {},
                paramsData: {
                    id: this.id
                }
            }
            getAutoResponse(data).then(res => {
                this.activeName = true
                this.seeForm = {
                    xml: res.xml,
                    autoId: res.autoOrder ? res.autoOrder.autoOrderId : '',
                    autoName: res.autoName,
                    mouldType: res.autoOrder ? res.autoOrder.mouldType : null,
                    mouldName: res.autoOrder ? res.autoOrder.mouldName : '',
                    status: res.autoOrder ? res.autoOrder.status : '',
                    statusName: res.autoOrder ? res.autoOrder.statusName : '',
                    createUser: res.autoOrder ? res.autoOrder.createName : '',
                    createTime: res.autoOrder ? res.autoOrder.createTime : '',
                    endTime: res.autoOrder ? res.autoOrder.endTime : '',
                    autoOrderContent: res.autoOrder ? res.autoOrder.autoOrderContent : ''
                }
                this.workFlowInfo.xml = res.xml
                this.workStatus = res.autoOrder.statusName != '进行中'
                this.currentWorkIds = res?.mouldInfo?.running
            }).catch(err => {
                console.log(err)
            })
        }
        // 获取基本信息
    }
}
</script>
<style lang="scss" scoped>
    .title{
        font-size:12px;
        color:#0052D9;
    }
    .auto{
        ::v-deep .el-descriptions-item__label {
                width: 120px !important;
            }
    }
</style>
