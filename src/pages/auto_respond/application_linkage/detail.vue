<template>
    <div class="list ml-1 mr-1 mb-1">
        <div class="header ub ub-pj pt-1 pr-1 pl-1">
            <div class="ub ub-as">
                <div class="background"></div>
                <div class="title ml-2">{{seeForm.name}}</div>
            </div>
            <el-button size="small" @click="back">返回</el-button>
        </div>
        <div class="device-type ub ub-wrap p2-1 pr-2 mr-1" :style="{'height':moreType?'':'130px','min-height':moreType?'130px':''}">
            <div class="label line-1 ml-1" v-for="item in seeForm.facilitys" :key="item.id" >
                <el-tooltip class="item" effect="dark" :content="item.remarks?item.remarks:'无内容'" placement="top-start" :visible-arrow="false" popper-class="popper">
                    <div class="line-1">{{item.facilityName}}/{{item.programVersion}}</div>
                </el-tooltip>
            </div>
            <div class="lines1"></div>
            <div class="lines2"></div>
            <div class="lines3"></div>
            <div class="more" @click="more" v-if="seeForm.facilitys.length>=16">查看更多</div>
        </div>
        <div class="lines mt-1"></div>
        <div class="cont ub">
            <div class="left pb-1">
                <div class="mt-1 ml-1">
                    <el-select class="custom-select" size="small" v-model="refreshData" placeholder="分组名称" clearable @change="changeGroup">
                        <el-option
                            style="height:24px !important;line-height:24px !important;"
                            v-for="item in options"
                            :key="item.id"
                            :label="item.groupName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </div>
                <div class="box mt-1 mb-1 ml-1 mr-1" v-for="item in actionList" :key="item.id" :class="{'box1':selectedId == item.id}" @click="clickAction(item)">
                    <div class="line"></div>
                    <div class="ub ub-pj ub-ac" style="padding:15px 10px;height:40px">
                        <div class="title line-1">{{item.name}}</div>
                        <div class="time">{{item.updateTime.slice(0,10)}}</div>
                    </div>
                    <div class="des line-1 pl-1 pr-1 pb-2">{{item.description}}</div>
                </div>
            </div>
            <div class="right pl-2 pr-2">
                <div class="list-tips mt-2">参数列表</div>
                <el-tabs v-model="activeName">
                    <el-tab-pane label="输入参数" name="first">
                        <el-table
                            ref="multipleTable"
                            v-loading="loading"
                            class='bigTable'
                            :data="imports"
                            border
                            stripe
                            tooltip-effect="dark"
                            :row-class-name="tableRowClassName"
                            :row-style="{ height: '32px' }"
                            :header-row-style="{ height: '32px' }">
                            <el-table-column
                                label="序号"
                                type="index"
                                width="50">
                            </el-table-column>
                            <el-table-column prop="name" label="参数名称"></el-table-column>
                            <!-- <el-table-column prop="type" label="参数类型" width="120">
                                <template slot-scope="scope">
                                    <div>{{scope.row.type | typeList}}</div>
                                </template>
                            </el-table-column> -->
                            <el-table-column prop="default" label="默认值"></el-table-column>
                            <!-- <el-table-column prop="empty" label="是否必填" width="120">
                                <template slot-scope="scope">
                                    <div>{{scope.row.empty | emptyList}}</div>
                                </template>
                            </el-table-column> -->
                            <!-- <el-table-column prop="parameter" label="参数值"></el-table-column> -->
                            <!-- <el-table-column prop="des" label="参数描述"></el-table-column> -->
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="输出参数" name="second">
                        <el-table
                            ref="multipleTable"
                            v-loading="loading"
                            class='bigTable'
                            :data="outputs"
                            border
                            stripe
                            tooltip-effect="dark"
                            :row-class-name="tableRowClassName"
                            :row-style="{ height: '32px' }"
                            :header-row-style="{ height: '32px' }">
                            <el-table-column
                                label="序号"
                                type="index"
                                width="50">
                            </el-table-column>
                            <el-table-column prop="name" label="参数名称" width="180"></el-table-column>
                            <el-table-column prop="type" label="参数类型" width="120">
                                <template slot-scope="scope">
                                    <div>{{scope.row.type | typeList}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="default" label="默认值" width="120"></el-table-column>
                            <!-- <el-table-column prop="empty" label="是否必填" width="120">
                                <template slot-scope="scope">
                                    <div>{{scope.row.empty | emptyList}}</div>
                                </template>
                            </el-table-column> -->
                            <!-- <el-table-column prop="parameter" label="参数值" width="120"></el-table-column> -->
                            <el-table-column prop="des" label="参数描述"></el-table-column>
                        </el-table>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
</template>
<script>
import { getGroupList, getActionList } from '@/server/auto_respond/application_linkage.js'
export default {
    data() {
        return {
            moreType: false,
            activeName: 'first',
            loading: false,
            tableData: [],
            actionList: [],
            selectedId: '', // 动作ID
            selectedForm: '', // 动作数据
            groupId: '', // 分组ID
            options: [],
            refreshData: '',
            seeForm: {},
            imports: [],
            outputs: []
        }
    },
    created() {
        this.seeForm = this.$route.params
        if (this.seeForm.id != '') {
            this.get_getGroupList()
            this.get_getActionList()
        }
        console.log(this.$route.params)
    },
    filters: {
        typeList(val) {
            console.log(val)
            if (val == 1) {
                return 'String'
            } else if (val == 2) {
                return 'Int'
            } else if (val == 3) {
                return 'Float'
            } else if (val == 4) {
                return 'Boolean'
            } else if (val == 5) {
                return 'ID'
            } else {
                return ''
            }
        },
        emptyList(val) {
            if (val == 1) {
                return '是'
            } else if (val == 2) {
                return '否'
            } else {
                return ''
            }
        }
    },
    methods: {
        back() {
            this.$router.push('/auto_respond/application_linkage')
        },
        changeGroup(id) {
            this.groupId = id
            setTimeout(() => {
                this.get_getActionList()
            }, 500)
        },
        more() {
            this.moreType = !this.moreType
        },
        clickAction(item) {
            this.selectedId = item.id
            this.selectedForm = item
            this.imports = JSON.parse(item.outInput).imports
            this.outputs = JSON.parse(item.outInput).outputs
        },
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex % 2) {
                return 'table-row2'
            } else {
                return 'table-row1'
            }
        },
        get_getGroupList() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            this.options = []
            getGroupList(data).then(res => {
                this.options = res
            }).catch(err => {
                console.log(err)
            })
        },
        get_getActionList() {
            let data = {
                queryData: {},
                paramsData: {
                    grouping: this.groupId,
                    adhibition: this.seeForm.facilityType
                }
            }
            this.selectedId = ''
            this.actionList = []
            this.imports = []
            this.outputs = []
            getActionList(data).then(res => {
                console.log(res)
                this.actionList = res
            }).catch(err => {
                console.log(err)
            })
        }
    }
}
</script>
<style lang="scss" scoped>
    .custom-select {
        position: relative;
        min-width:80px;
        ::v-deep .el-input__inner{
            // border:0px !important;
            box-shadow: none !important;
            // background-color: transparent;
            height:24px !important;
            // color:#0052d9;
        }
        ::v-deep .el-input__icon {
            height:24px !important;
            line-height:24px !important;
            // color:#0052d9 !important;
        }
        ::v-deep .el-input__suffix-inner{
            height:24px !important;
        }
    }
.list{
    width:100%;
    background: #FFFFFF;
    border: 1px solid rgba(218,222,232,1);
    box-shadow: 0px 0px 8px 0px rgba(140,152,164,0.2);
    border-radius: 4px;
    padding: 0 !important;
    ::v-deep .el-tabs__nav-wrap::after{
        height:1px !important;
    }
    ::v-deep .el-tabs__item{
        font-size:13px !important;
    }
    // overflow-y: hidden !important;
    .cont{
        // height:100%;
        // overflow-y: auto;
        .left{
            width:370px;
            height:100%;
            min-height: 700px;
            background-color: #f5f5f5;
            // border-right: 1px solid rgba(218,222,232,1);
            box-shadow: 1px 1px 5px #ccc;
            .box{
                height:72px;
                background: #EEEEEE;
                border-radius: 4px;
                cursor: pointer;
                .title{
                    font-size:14px;
                    font-weight: 700;
                }
                .time{
                    font-size: 12px;
                    color:rgba(0,0,0,.4);
                }
                .des{
                    font-size: 12px;
                    color:rgba(0,0,0,.6);
                }
            }
            .box1{
                background-image: linear-gradient(270deg, #FFFFFF 35%, #EEF2FF 100%);
                margin-right:-5px;
                position: relative;
                border-radius: 4px 0 0 4px;
                .time{
                    margin-right: 16px !important;
                }
                .title{
                    color:#0052D9;
                }
                .line{
                    position: absolute;
                    width:2px;
                    height:50px;
                    top:11px;
                    background:#387DEE ;
                }
            }
        }
        .right{
            width:calc(100vw - 650px);
        }
    }
    .header{
        height:120px;
    }
    .background{
        width:80px;
        height:80px;
        background-image: url('../../../assets/img/fnaghuoqiang.png');
    }
    .title{
        font-size:20px;
        font-weight: 700;
        line-height: 60px;
    }
    .device-type{
        // width:100%;
        min-height:130px;
        max-height:250px;
        background: rgba(0,0,0,0.02);
        border-radius: 4px;
        margin-left:110px;
        margin-right:10px;
        position: relative;
        overflow:hidden;
    }
    .lines1{
        position: absolute;
        margin-left:24.5%;
        width:1px;
        height:90%;
        background: #E7E7E7;
        top:5%;
    }
    .lines2{
        position: absolute;
        margin-left:49%;
        width:1px;
        height:90%;
        background: #E7E7E7;
        top:5%;
    }
    .lines3{
        position: absolute;
        margin-left:73.5%;
        width:1px;
        height:90%;
        background: #E7E7E7;
        top:5%;
    }
    .lines{
        width:100%;
        border-top: 1px solid rgba(218,222,232,1);
    }
    .label{
        width:24.5%;
        height:40px;
        font-size:12px;
        color:rgba(0,0,0,.6);
        line-height:40px;
        margin-right:0.5%;
    }
    .more{
        position: absolute;
        right:10px;
        bottom: 10px;
        font-size: 12px;
        color:rgba(0,0,0,.4);
        text-decoration:underline;
        cursor: pointer;
    }
}
</style>
<style lang="scss">
.popper{
    // left:350px !important;
    min-width:100px !important;
    max-width:800px !important;
}

</style>
