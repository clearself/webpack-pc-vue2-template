<template>
    <div class="event w100">
        <div class="topBox">
            <el-button v-per="['base_mon_warn']" style="height: 31px" size="mini" type="primary" @click="toSetWarn">告警配置</el-button>
            <el-button
                v-per="['base_mon_add']"
                style="margin-right: 19px;height: 31px"
                size="mini"
                type="primary"
                icon="el-icon-plus"
                @click="toAdd">添加
            </el-button>
        </div>
        <div class="machineWrap">
            <div v-for="item in machineList" :key="item.id" class="machineItem">
                <div class="infoBox">
                    <div @click="toDetail(item)" :class="{'err':item.status != 1}" class="statusLogo"></div>
                    <div v-if="item.status == 1" class="statusTex">正常</div>
                    <div v-else class="statusTex err">异常</div>
                    <div class="infoTit">{{ item.ip }}</div>
                    <div class="controlBox">
                        <div @click="toDetail(item)" class="conOne"><i
                            style="margin-right: 7px"
                            class="el-icon-date"></i>详情
                        </div>
                        <div v-per="['base_mon_edit']" @click="toEdit(item)" class="conOne">
                            <i style="margin-right: 7px" class="el-icon-edit"></i>
                            <span>编辑</span>
                        </div>
                        <div v-per="['base_mon_del']" @click="toDel(item)" class="conOne">
                            <i style="margin-right: 7px" class="el-icon-delete"></i>
                            <span>删除</span>
                        </div>
                    </div>
                    <div class="desItem">设备名称：{{ item.name }}</div>
                    <div class="desItem">设备端口：{{ item.port }}</div>
                    <div class="desItem">设备类型：{{ desType(item.type) }}</div>
                    <div class="desItem">设备单位：{{ item.company }}</div>
                </div>
            </div>
        </div>
        <machineEditDia ref="machineEditDia" :typeList="typeList" @refresh="get_data"></machineEditDia>
        <warnSetDia :assetUser="assetUser" :systemUser="systemUser" ref="warnSetDia" @refresh="get_data"></warnSetDia>
        <DeleteDialog
            :dialogVisible="deleteDialog"
            @delete="handleDeleteFun"
            @cancel="deleteDialog = false">
        </DeleteDialog>
    </div>
</template>

<script>
import machineEditDia from '@/pages/system/sysMonitoring/dia/machineEditDia.vue'
import warnSetDia from '@/pages/system/sysMonitoring/dia/warnSetDia.vue'

import {
    getNoticeUserReq,
    serverPageReq,
    deleteServerReq,
    getTypeReq,
    getAlarmConfigReq
} from '@/server/system/sysMonitoring.js'

export default {
    name: 'Index',
    components: {
        machineEditDia,
        warnSetDia
    },
    data() {
        return {
            assetUser: [],
            systemUser: [],
            typeList: [],
            machineList: [],
            deleteId: null,
            deleteDialog: false
        }
    },
    mounted() {
        this.getUser()
        this.getType()
        // this.get_data()
    },
    computed: {},
    watch: {},
    methods: {
        get_data() {
            this.loading = true
            this.tableData = []
            let data = {
                queryData: {},
                paramsData: {
                    serverType: 1
                }
            }
            serverPageReq(data).then(res => {
                this.machineList = res.records
                console.log(this.machineList, 'machineList')
            }).catch(error => {
                this.loading = false
                console.log('error' + error)
            })
        },
        getType() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            getTypeReq(data).then(res => {
                this.typeList = res
                this.get_data()
                console.log(this.typeList, '12222222222222222222')
            }).catch(error => {
                console.log('error' + error)
            })
        },
        getUser() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            getNoticeUserReq(data).then(res => {
                this.assetUser = res.assetUser
                this.systemUser = res.systemUser
            }).catch(error => {
                this.loading = false
                console.log('error' + error)
            })
        },
        desType(type) {
            let res = type
            this.typeList.forEach(item => {
                if (item.id == type) {
                    res = item.name
                }
            })
            return res
        },
        toAdd() {
            this.$refs.machineEditDia.initDia('添加设备')
        },
        toSetWarn() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            getAlarmConfigReq(data).then(res => {
                res.cpuUsage = Number(res.cpuUsage)
                res.dataDiskUsage = Number(res.dataDiskUsage)
                res.memaryUsage = Number(res.memaryUsage)
                res.systemDiskUsage = Number(res.systemDiskUsage)
                res.sendTo = res.sendToList
                console.log(res)
                this.$refs.warnSetDia.initDia(res)
            }).catch(error => {
                console.log('error' + error)
            })
        },
        toDetail(item) {
            console.log(item)
            this.$setsessionStorage('machiDetail', item)
            this.$router.push({
                path: '/system/sysMonitoring/sysDetail'
            })
        },
        toEdit(item) {
            this.$refs.machineEditDia.initDia('编辑设备', item)
        },
        handleDeleteFun() {
            let data = {
                queryData: {},
                paramsData: {
                    id: this.deleteId
                }
            }

            deleteServerReq(data).then(res => {
                this.deleteDialog = false
                console.log('删除成功')
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                setTimeout(() => {
                    this.get_data()
                }, 1500)
            }).catch(error => {
                this.deleteDialog = false
                console.log(error + 'error')
            })
        },
        toDel(item) {
            console.log(item)
            this.deleteId = item.id
            this.deleteDialog = true
        }
    }
}
</script>

<style lang="scss" scoped>
.topBox {
    padding: 0 19px;
    width: 100%;
    height: 65px;
    background-color: #ffffff;
    border-radius: 2px;
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
    box-sizing: border-box;
}

.machineWrap {
    margin: 11px 0 0 0;
    padding: 0 0 0 0;
    width: 100%;
    display: flex;
    box-sizing: border-box;
    flex-wrap: wrap;
    //justify-content: space-between;
    .machineItem {
        margin: 0 10px 10px 0;
        width: calc(25% - 8px);
        padding: 43px 0 40px 0;
        background-color: #ffffff;
        border-radius: 4px;
        border: solid 1px #d7dfe3;

        .infoBox {
            margin: 0 auto;
            width: 73.8%;
            display: flex;
            flex-direction: column;
            align-items: center;

            .statusLogo {
                width: 239px;
                height: 239px;
                background-image: url(../../../assets/img/sysMan/scSuc.png);
                background-size: 100% 100%;
                cursor: pointer;
            }

            .statusLogo.err {
                background-image: url(../../../assets/img/sysMan/scErr.png);
            }

            .statusTex {
                margin-top: 26px;
                line-height: 33px;
                font-family: AdobeHeitiStd-Regular;
                font-size: 36px;
                font-weight: normal;
                font-stretch: normal;
                letter-spacing: 0px;
                color: #22b1a8;
            }

            .statusTex.err {
                color: #cc1336;
            }

            .infoTit {
                width: 100%;
                text-align: left;
                margin-top: 29px;
                line-height: 20px;
                font-family: PingFangSC-Medium;
                font-size: 20px;
                font-weight: normal;
                font-stretch: normal;
                color: #154259;
            }

            .controlBox {
                margin: 16px 0 30px 0;
                width: 100%;
                display: flex;

                .conOne {
                    cursor: pointer;
                    margin-right: 20px;
                    color: #2976eb;
                    font-size: 12px;
                }
            }

            .desItem {
                margin-bottom: 18px;
                width: 100%;
                font-family: PingFangSC-Regular;
                font-size: 18px;
                font-weight: normal;
                font-stretch: normal;
                line-height: 19px;
                letter-spacing: 0px;
                color: #646464;
            }
        }
    }

    .machineItem:nth-of-type(4n) {
        margin-right: 0;
    }
}
</style>
