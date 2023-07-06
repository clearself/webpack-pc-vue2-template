<template>
    <div class="event">
        <el-dialog custom-class="common-dialog" width="700px"  title="查看" :visible.sync="dialogVisible" :before-close="cancel">
            <div style="width:100%;margin: 0 auto;">
                <el-descriptions class="margin-top" title="" :column="1" size="mini" border>
                    <el-descriptions-item>
                        <template slot="label">
                            任务名称
                        </template>
                        {{ seeForm.taskName }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template slot="label">
                            工作节点
                        </template>
                        {{ seeForm.nodeName }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template slot="label">
                            接入类型
                        </template>
                        {{ seeForm.type | typeText }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template slot="label">
                            解析规则
                        </template>
                        {{ seeForm.ruleName }}
                    </el-descriptions-item>
                    <!-- 选择目录 -->
                    <el-descriptions-item v-if="seeForm.type===1">
                        <template slot="label">
                            文件路径
                        </template>
                        {{ configContentData.path }}
                    </el-descriptions-item>
                    <el-descriptions-item v-if="seeForm.type===1">
                        <template slot="label">
                            编码
                        </template>
                        {{ configContentData.encode | encodeText }}
                    </el-descriptions-item>
                    <!-- 选择数据库 -->
                    <el-descriptions-item v-if="seeForm.type===2">
                        <template slot="label">
                            数据库类型
                        </template>
                        {{ configContentData.dbType | dbTypeText }}
                    </el-descriptions-item>
                    <el-descriptions-item v-if="seeForm.type===2">
                        <template slot="label">
                            库或实例名
                        </template>
                        {{ configContentData.database }}
                    </el-descriptions-item>
                    <el-descriptions-item v-if="seeForm.type===2">
                        <template slot="label">
                            数据库地址
                        </template>
                        {{ configContentData.ip }}
                    </el-descriptions-item>
                    <el-descriptions-item v-if="seeForm.type===2">
                        <template slot="label">
                            端口
                        </template>
                        {{ configContentData.port }}
                    </el-descriptions-item>
                    <el-descriptions-item v-if="seeForm.type===2">
                        <template slot="label">
                            用户名
                        </template>
                        {{ configContentData.username }}
                    </el-descriptions-item>
                    <el-descriptions-item v-if="seeForm.type===2">
                        <template slot="label">
                            密码
                        </template>
                        {{ configContentData.password }}
                    </el-descriptions-item>
                    <el-descriptions-item v-if="seeForm.type===2">
                        <template slot="label">
                            表名
                        </template>
                        {{ configContentData.table }}
                    </el-descriptions-item>
                    <el-descriptions-item v-if="seeForm.type===2">
                        <template slot="label">
                            递增字段
                        </template>
                        {{ configContentData.incrementalField }}
                    </el-descriptions-item>
                    <el-descriptions-item v-if="seeForm.type===2">
                        <template slot="label">
                            索引类型
                        </template>
                        {{ configContentData.incrementalType | incrementalTypeText }}
                    </el-descriptions-item>
                    <el-descriptions-item v-if="seeForm.type===2">
                        <template slot="label">
                            索引列
                        </template>
                        {{ configContentData.indexColumn }}
                    </el-descriptions-item>
                    <el-descriptions-item v-if="seeForm.type===2">
                        <template slot="label">
                            索引起始位置
                        </template>
                        {{ configContentData.indexStart }}
                    </el-descriptions-item>
                    <el-descriptions-item v-if="seeForm.type===2">
                        <template slot="label">
                            索引步长
                        </template>
                        {{ configContentData.indexPace }}
                    </el-descriptions-item>
                    <el-descriptions-item v-if="seeForm.type===2">
                        <template slot="label">
                            修改偏移
                        </template>
                        {{ configContentData.indexOffset | isNoText }}
                    </el-descriptions-item>
                    <!-- 选择kafka -->
                    <el-descriptions-item v-if="seeForm.type===3">
                        <template slot="label">
                            kafka地址
                        </template>
                        {{ configContentData.ip }}
                    </el-descriptions-item>
                    <el-descriptions-item v-if="seeForm.type===3">
                        <template slot="label">
                            topic
                        </template>
                        {{ configContentData.topic }}
                    </el-descriptions-item>
                    <el-descriptions-item v-if="seeForm.type===3">
                        <template slot="label">
                            Kafka版本号
                        </template>
                        {{ configContentData.kafkaType }}
                    </el-descriptions-item>
                    <el-descriptions-item v-if="seeForm.type===3">
                        <template slot="label">
                            消费组ID
                        </template>
                        {{ configContentData.consumeId }}
                    </el-descriptions-item>
                    <el-descriptions-item v-if="seeForm.type===3">
                        <template slot="label">
                            客户端ID
                        </template>
                        {{ configContentData.customeId }}
                    </el-descriptions-item>
                    <el-descriptions-item v-if="seeForm.type===3">
                        <template slot="label">
                            编码
                        </template>
                        {{ configContentData.encode| encodeText }}
                    </el-descriptions-item>
                    <el-descriptions-item v-if="seeForm.type===3">
                        <template slot="label">
                            启用通配符
                        </template>
                        {{ configContentData.wildcard | isNoText }}
                    </el-descriptions-item>
                    <el-descriptions-item v-if="seeForm.type===3">
                        <template slot="label">
                            修改偏移
                        </template>
                        {{ configContentData.indexOffset | isNoText }}
                    </el-descriptions-item>
                    <el-descriptions-item v-if="seeForm.type===3">
                        <template slot="label">
                            权限校验
                        </template>
                        {{ configContentData.permissionCheck | permissionCheckText }}
                    </el-descriptions-item>
                    <!-- 选择syslog -->
                    <el-descriptions-item v-if="seeForm.type===4">
                        <template slot="label">
                            端口
                        </template>
                        {{ configContentData.port }}
                    </el-descriptions-item>
                    <el-descriptions-item v-if="seeForm.type===4">
                        <template slot="label">
                            编码
                        </template>
                        {{ configContentData.encode | encodeText }}
                    </el-descriptions-item>
                    <el-descriptions-item v-if="seeForm.type===4">
                        <template slot="label">
                            报送设备
                        </template>
                        {{ configContentData.ip }}
                    </el-descriptions-item>
                    <!-- 选择HDFS -->
                    <el-descriptions-item v-if="seeForm.type===5">
                        <template slot="label">
                            HDFS地址
                        </template>
                        {{ configContentData.ip }}
                    </el-descriptions-item>
                    <el-descriptions-item v-if="seeForm.type===5">
                        <template slot="label">
                            端口
                        </template>
                        {{ configContentData.port }}
                    </el-descriptions-item>
                    <el-descriptions-item v-if="seeForm.type===5">
                        <template slot="label">
                            文件路径
                        </template>
                        {{ configContentData.path }}
                    </el-descriptions-item>
                    <el-descriptions-item v-if="seeForm.type===5">
                        <template slot="label">
                            编码
                        </template>
                        {{ configContentData.encode | encodeText }}
                    </el-descriptions-item>
                    <el-descriptions-item v-if="seeForm.type===5">
                        <template slot="label">
                            修改偏移
                        </template>
                        {{ configContentData.indexOffset | isNoText }}
                    </el-descriptions-item>
                    <!-- 选择ES -->
                    <el-descriptions-item v-if="seeForm.type===6">
                        <template slot="label">
                            集群名称
                        </template>
                        {{ configContentData.colonyName }}
                    </el-descriptions-item>
                    <el-descriptions-item v-if="seeForm.type===6">
                        <template slot="label">
                            主机
                        </template>
                        {{ configContentData.ip }}
                    </el-descriptions-item>
                    <el-descriptions-item v-if="seeForm.type===6">
                        <template slot="label">
                            端口
                        </template>
                        {{ configContentData.port }}
                    </el-descriptions-item>
                    <el-descriptions-item v-if="seeForm.type===6">
                        <template slot="label">
                            ES索引
                        </template>
                        {{ configContentData.esIndex }}
                    </el-descriptions-item>
                    <el-descriptions-item v-if="seeForm.type===6">
                        <template slot="label">
                            ES索引类型
                        </template>
                        {{ configContentData.esincrementalType }}
                    </el-descriptions-item>
                    <el-descriptions-item v-if="seeForm.type===6">
                        <template slot="label">
                            查询语句
                        </template>
                        {{ configContentData.queryStatement }}
                    </el-descriptions-item>
                    <el-descriptions-item v-if="seeForm.type===6">
                        <template slot="label">
                            索引列
                        </template>
                        {{ configContentData.indexColumn }}
                    </el-descriptions-item>
                    <el-descriptions-item v-if="seeForm.type===6">
                        <template slot="label">
                            索引列类型
                        </template>
                        {{ configContentData.incrementalType }}
                    </el-descriptions-item>
                    <el-descriptions-item v-if="seeForm.type===6">
                        <template slot="label">
                            索引步长
                        </template>
                        {{ configContentData.indexPace | indexPaceText }}
                    </el-descriptions-item>

                </el-descriptions>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="cancel">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'ViewDialog',
    props: {
        dialogVisible: {
            default: false
        },
        seeForm: {
            default: {}
        },
        configContentData: {
            default: {}
        }
    },
    filters: {
        permissionCheckText(val) {
            if (val === 0) {
                return '无'
            } else if (val === 1) {
                return 'plain'
            } else if (val === 2) {
                return 'Kerberos'
            } else if (val === 3) {
                return 'ssl'
            } else {

            }
        },
        isNoText(val) {
            if (val === 0) {
                return '否'
            } else if (val === 1) {
                return '是'
            } else {
                return ''
            }
        },
        indexPaceText(val) {
            if (val === 1) {
                return '自增数字'
            } else if (val === 2) {
                return '时间类型'
            } else {
                return ''
            }
        },
        incrementalTypeText(val) {
            if (val === 1) {
                return '自增数字'
            } else if (val === 2) {
                return '时间类型'
            } else {
                return ''
            }
        },
        dbTypeText(val) {
            if (val === 1) {
                return 'mysql'
            } else {
                return ''
            }
        },
        encodeText(val) {
            if (val === 1) {
                return 'UTF-8'
            } else if (val === 2) {
                return 'GBK'
            } else {
                return ''
            }
        },
        typeText(val) {
            if (val == '1') {
                return '目录 '
            } else if (val == '2') {
                return '数据库'
            } else if (val == '3') {
                return 'KAFKA'
            } else if (val == '4') {
                return 'SYSLOG'
            } else if (val == '5') {
                return 'HDFS'
            } else if (val == '6') {
                return 'ES'
            } else {
                return ''
            }
        }
    },
    data() {
        return {

        }
    },
    methods: {
        cancel() {
            this.$emit('close')
        }
    }
}
</script>

<style scoped lang="scss">
.event{
    ::v-deep .el-descriptions-item__label{
        width:100px !important;
    }
}
.black-theme .event ::v-deep .el-descriptions__body {
    background: #033254;
    color: #fff;
}
.black-theme .event ::v-deep .el-descriptions .is-bordered .el-descriptions-item__cell {
    border: 1px solid #3990d8;
    box-shadow: inset 0px 0px 6px 0px rgba(0, 186, 255, 0.73), inset 0px -1px 0px 0px rgba(40, 82, 124, 0.5);
}
.black-theme .event ::v-deep .el-descriptions-item__label.is-bordered-label {
    width: 120px;
    background:#00466d;
    color: #fff;
    border-left: 1px solid #3990d8 !important;
    border-right: 1px solid #3990d8 !important;
}
.black-theme .event ::v-deep .el-descriptions__table tbody:first-child .is-bordered-label {
    border-top: 1px solid #3990d8 !important;
}
.black-theme .event ::v-deep .el-descriptions__table tbody:last-child .is-bordered-label {
    border-bottom: 1px solid #3990d8 !important;
}
//.event ::v-deep .el-descriptions__table tbody:first-child td {
//    border-top: 1px solid #3990d8 !important;
//}
//.event ::v-deep .el-descriptions__table tbody:last-child td {
//    border-bottom: 1px solid #3990d8 !important;
//}
.black-theme .event ::v-deep .el-descriptions__table tbody td {
    border-right: 1px solid #3990d8 !important;
}
.event ::v-deep .attendance-dialog .el-dialog__body {
    max-height: 440px;
    overflow-y: auto;
}
</style>
