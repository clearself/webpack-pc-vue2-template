<template>
    <div class="wrapper dashboard-wrap">
        <div class="dashboard-header-wrap">
            <div class="dashboardheader ub ub-ac ub-pj" @click="showList" style="cursor: pointer;">
                <div class="name">
                    <div class="left-bar"></div>
                    <div>{{ boardName }}</div>
                </div>
                <div class="show-list"><i @click="showList" class="iconfont icon-a-yibiaopan-xiala1"></i></div>
            </div>
            <div class="list-detail-wrap" v-show="showListVisible"><ListDetail @see="showDetail"></ListDetail></div>
        </div>
        <div class="back" @click.stop="backList">
            <i class="iconfont icon-fanhui"></i>
            返回列表
        </div>
        <el-tabs :before-leave="beforeLeave" v-model="currentTab" type="card" :addable="false" >
            <el-tab-pane v-for="tag in tags" :key="tag.labelId" :label="tag.labelName" :name="tag.name">
                <span slot="label" v-if="tag.labelId == 0">
                    <i class="iconfont icon-tianjia"></i>
                    添加标签页
                </span>
                <span slot="label" @mouseover="tag.hover = true" @mouseout="tag.hover = false" class="label-hover" v-if="tag.labelId !== 0">
                    {{ tag.labelName }}
                    <span class="operate-tag">
                        <i class="iconfont icon-xiugai" @click.stop="editTag(tag)"></i>
                        <i class="iconfont icon-guanbi" @click.stop="deleteTag(tag)"></i>
                    </span>
                </span>
                <Inner v-if="tag.labelId !== 0" :data="tag" :dashboardId="dashboardId"></Inner>
            </el-tab-pane>
        </el-tabs>
        <el-dialog :title="dialogTxt" :visible.sync="addDialog" width="700px" custom-class="common-dialog">
            <div style="width:100%;margin: 0 auto;">
                <el-form label-width="100px" label-position="top" :rules="rules" ref="addForm" :model="addForm">
                    <el-row :gutter="40">
                        <el-col :span="24">
                            <el-form-item label="标签页名称：" prop="name">
                                <el-input v-model="addForm.name" placeholder="请输入标签页名称" style="width: 100%" size="small" clearable></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="addDialog = false">取 消</el-button>
                <el-button size="small" type="primary" @click="submitAdd('addForm')">确 定</el-button>
            </span>
        </el-dialog>
        <DeleteDialog
            :dialogVisible = delDialog
            @delete="delConfim"
            @cancel="delDialog = false">
        </DeleteDialog>
    </div>
</template>

<script>
import Inner from './inner'
import ListDetail from '../dash_board/ListDetail.vue'
import { saveAndUpdateTags, findTagsContent, deleteLabel } from '@/server/stream_data_center/dash_board.js'
export default {
    name: 'Index',
    components: {
        Inner,
        ListDetail
    },
    provide() {
        return {
            indexTypeData: this.$route.query.indexType
        }
    },
    data() {
        return {
            delDialog: false,
            transitionTag: null,
            tags: [],
            boardName: '',
            currentTab: '',
            addDialog: false,
            rules: {
                name: { required: true, message: '请输入', trigger: 'blur' }
            },
            addForm: {
                name: ''
            },
            dashboardId: '',
            showListVisible: false,
            dialogTxt: '添加标签页'
        }
    },
    created() {
        this.dashboardId = this.$route.query.id
        this.boardName = this.$route.query.name
        this.getTags()
    },
    methods: {
        editTag(tag) {
            this.transitionTag = tag
            this.addForm.name = tag.labelName
            this.addDialog = true
            this.dialogTxt = '编辑标签页'
        },
        deleteTag(tag) {
            console.log(tag)
            this.transitionTag = tag
            this.delDialog = true
        },
        delConfim() {
            this.tags.forEach((tag, index) => {
                if (tag.labelId == this.transitionTag.labelId) {
                    this.tags.splice(index, 1)
                    if (this.transitionTag.labelId == this.currentTab) {
                        this.currentTab = this.tags[0].labelId
                    }
                }
            })
            this.delDialog = false
            let data = {
                queryData: {},
                paramsData: {
                    labelId: this.transitionTag.labelId
                }
            }
            deleteLabel(data).then(res => {
                this.delDialog = false
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
            })
        },
        showDetail(row) {
            console.log(row)
            this.boardName = row.name
            this.dashboardId = row.id
            this.getTags()
        },
        backList() {
            this.$router.push({
                path: '/stream_data_center/dash_board',
                query: {}
            })
        },
        getTags() {
            this.tags = []
            findTagsContent({
                queryData: {
                    dashboardId: this.dashboardId
                },
                paramsData: {}
            }).then(res => {
                console.log(res)
                res.forEach(item => {
                    this.tags.push({
                        labelName: item.labelName || '--',
                        labelId: item.labelId,
                        name: item.labelId,
                        chartList: item.chartList || [],
                        hover: false
                    })
                })
                this.tags.push({
                    labelName: '添加标签页',
                    labelId: 0,
                    name: 'addTag'
                })
                this.currentTab = this.tags[0].name
            })
        },
        beforeLeave(activeName, oldActiveName) {
            if (activeName == 'addTag') {
                this.addDialog = true
                this.addForm.name = ''
                this.dialogTxt = '添加标签页'
                return false
            }
        },
        addTag() {
            console.log(this.tags)
            let data = {
                queryData: {},
                paramsData: {
                    dashboardId: this.dashboardId,
                    pageLayoutList: [
                        {
                            chartList: [],
                            labelName: this.addForm.name
                        }
                    ],
                    indexType: this.$route.query.indexType
                }
            }
            saveAndUpdateTags(data).then(res => {
                this.tags.splice(-1, 0, {
                    labelName: this.addForm.name,
                    labelId: res,
                    hover: false,
                    name: res,
                    chartList: []
                })
                this.addDialog = false
            })
        },
        editTagRequest() {
            let data = {
                queryData: {},
                paramsData: {
                    dashboardId: this.dashboardId,
                    pageLayoutList: [
                        {
                            chartList: this.transitionTag.chartList,
                            labelName: this.addForm.name,
                            labelId: this.transitionTag.labelId
                        }
                    ],
                    indexType: this.$route.query.indexType
                }
            }
            saveAndUpdateTags(data).then(res => {
                this.addDialog = false
            })
        },
        submitAdd(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    if (this.dialogTxt == '编辑标签页') {
                        this.tags.forEach(tag => {
                            if (tag.labelId == this.transitionTag.labelId) {
                                tag.labelName = this.addForm.name
                            }
                        })
                        this.editTagRequest()
                    }
                    if (this.dialogTxt == '添加标签页') {
                        this.addTag()
                    }
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        showList() {
            this.showListVisible = !this.showListVisible
        }
    }
}
</script>

<style lang="scss" scoped>
.dashboard-wrap ::v-deep .el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
    border-bottom-color: #387dee !important;
    box-shadow: none !important;
}
.dashboard-wrap ::v-deep .el-tabs__item.is-active {
    color: #387dee;
}
.dashboard-wrap {
    overflow: hidden !important;
    position: relative;
    .back {
        // background-color: rgba(19, 109, 172, 0.2);
        position: absolute;
        color: #0052d9;
        font-size: 12px;
        height: 30px;
        line-height: 30px;
        cursor: pointer;
        right: 0;
        padding-right: 20px;
        z-index:1;
    }
    ::v-deep .el-tabs {
        background-color: #fff;
        border-radius: 4px 4px 0 0;
    }
    ::v-deep .el-tabs__header {
        // margin-right: 88px;
    }
    ::v-deep .el-tabs__nav-prev {
        height: 30px;
        line-height: 30px;
    }
    ::v-deep .el-tabs__nav-next {
        height: 30px;
        line-height: 30px;
    }
    ::v-deep .el-tabs__active-bar {
        display: none;
    }
    ::v-deep .el-tabs__nav {
        border: none;
        border-radius: 0;
    }
    ::v-deep .el-tabs__header {
        height: 30px;
        background-color: #fff;
        margin-bottom: 0px;
        border: 1px solid #DADEE8;
        border-bottom:none;
    }
    ::v-deep .el-tabs__item {
        width: 114px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        margin-right: 10px;
        cursor: pointer;
        // border: 1px solid #76dee2;
        // border-radius: 2px;
        // background: url('../../../assets/img/tab_btn.jpg') 100% 100% no-repeat;
        // background-size: cover;
        color: rgba(0, 0, 0, 0.6);
        box-sizing: border-box;
        font-size: 14px;
        padding: 0 10px !important;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        position: relative;
        border-right: none;
        border-left: none;
        &:first-child {
            border-radius: 4px 0 0 0;
            border-right: none;
        }
        .label-hover {
            display: inline-block;
            width: 100%;
            height: 100%;
            .operate-tag {
                display: inline-block;
                position: absolute;
                right: 0;
                // background-color: rgba(19, 109, 172, 0.6);
                padding: 0 6px;
                .iconfont {
                    font-size: 12px;
                    display: inline-block;
                    &:first-child {
                        margin-right: 6px;
                    }
                    &:hover {
                        // color: #00fffc;
                    }
                }
            }
        }
    }
    ::v-deep #tab-addTag {
        // background-color: #000000;
        color: rgba(0, 0, 0, 0.4);
        font-size: 12px;
        .iconfont {
            font-size: 12px;
            margin-right: 4px;
        }
    }
    ::v-deep .is-active {
        // background: url('../../../assets/img/tab_active.jpg') 100% 100% no-repeat;
        // background-size: cover;
        // border-bottom-color: #387dee !important;
    }
    .dashboard-header-wrap {
        position: relative;
        .dashboardheader {
            height: 40px;
            padding: 0 20px;
            box-sizing: border-box;
            background-color: #fff;
            box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
            // box-shadow: inset 0px 0px 18px 0px rgba(0, 180, 255, 0.5);
            background-image: url('../../../assets/img/stream_data_center/bg.png');
            background-repeat: no-repeat;
            background-size: cover;
            // border: solid 1px #50b0ff;
            margin-bottom: 10px;
            color: rgba(0,0,0,0.9);
            font-size: 14px;
            border-radius: 4px;
            .name {
                font-size: 14px;
                position: relative;
                padding-left: 14px;
                .left-bar {
                    width: 4px;
                    height: 18px;
                    content: ' ';
                    position: absolute;
                    left: 0px;
                    top: 0;
                    border-radius: 3px;
                    background: #387dee;
                }
            }
            .show-list {
                .iconfont {
                    cursor: pointer;
                    color: #387dee;
                }
            }
        }
        .list-detail-wrap {
            margin-top: -6px;
            width: 100%;
            z-index: 100;
            background-color: #000000;
            position: absolute;
        }
    }
}
.wrapper {
    overflow-y: hidden;
}
</style>
<style>
.add-search.el-popover {
    background: #fff;
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
    border: solid 1px #dcdcdc;
    color: rgba(0,0,0,0.9);
}
.dashboard-wrap .el-loading-spinner {
    top: 100px;
}
</style>
