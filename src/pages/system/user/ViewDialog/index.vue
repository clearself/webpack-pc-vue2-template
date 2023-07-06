<template>
    <el-dialog custom-class="common-dialog" width="700px" title="查看用户" :visible.sync="dialogVisible" :before-close="cancel">
        <el-descriptions class="margin-top" size="mini" border :column="1" label-class-name="des-label">
            <el-descriptions-item labelClassName="common-label" label="用户名">
                {{ userForm.username | noneData }}
            </el-descriptions-item>
            <el-descriptions-item label="姓名">
                {{ userForm.chineseName | noneData }}
            </el-descriptions-item>
            <!-- <el-descriptions-item label="首次登录密码">
                 {{ userForm.chineseName }}
            </el-descriptions-item> -->
            <el-descriptions-item label="所属部门">
                {{ userForm.departmentName | noneData }}
            </el-descriptions-item>
            <el-descriptions-item label="直接上级">
                {{ userForm.parentName | noneData }}
            </el-descriptions-item>
            <el-descriptions-item label="联系方式">
                {{ userForm.phone | noneData }}
            </el-descriptions-item>
            <el-descriptions-item label="邮箱号码">
                {{ userForm.mailbox | noneData }}
            </el-descriptions-item>
            <el-descriptions-item label="设置用户角色">
                {{ userForm.roleName | noneData }}
            </el-descriptions-item>
            <el-descriptions-item label="状态">
                <!-- <span class="is-active">已启用</span>
                <span class="is-inactive">已禁用</span> -->
                <span :class="{'is-active':userForm.status===0, 'is-inactive':userForm.status===2}">{{ userForm.status | statusFilter }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="IP地址登录">
                {{ userForm.isLimit | isLimitFilter }}
            </el-descriptions-item>
            <el-descriptions-item v-for="(item,index) in userForm.ips" :key="index" :label="`IP地址${index+1}`">
                {{ item.value | noneData }}
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">
                {{ userForm.createTime | noneData }}
            </el-descriptions-item>
        </el-descriptions>
        <div slot="footer">
            <el-button size="small" @click="cancel">取消</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
    name: 'Index',
    props: {
        dialogVisible: {
            default: false
        },
        seeForm: {
            default: {}
        }
    },
    filters: {
        noneData(val) {
            if (val) {
                return val
            } else {
                return '--'
            }
        },
        isLimitFilter(val) {
            if (val == 0) {
                return '不限定IP地址登录'
            } else if (val == 1) {
                return '仅限特定IP地址登录'
            } else {
                return '--'
            }
        },
        statusFilter(val) {
            switch (val) {
                case 0:
                    return '启用'
                case 2:
                    return '禁用'
                default:
                    return '--'
            }
        }
    },
    data() {
        return {
            formLabelWidth: '80px',
            userForm: {
                username: '',
                chineseName: '',
                password: '',
                departmentName: '',
                parentName: '',
                phone: '',
                mailbox: '',
                roleName: '',
                status: '',
                isLimit: 0,
                createTime: '',
                ips: [
                    { value: '' }
                ]
            }
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
$blue: #387DEE;
.is-active {
    color: #00d95c;
}
.is-inactive {
    color: #E34D59;
}
.role-item {
    color: $blue;
}
.el-descriptions {
    width: 652px;
}
.common-dialog ::v-deep .common-label {
    width: 100px;
}
</style>
<style>
#app .el-descriptions .is-bordered .el-descriptions-item__cell {
    border: solid 1px #1cd7fa !important;
    background-color: #052942;
    color: #fff;
}
</style>
