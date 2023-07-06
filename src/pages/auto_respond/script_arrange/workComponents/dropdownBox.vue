<template>
    <div class="container drop-box" @click.stop="">
        <div class="show-box ub ub-pj">
            <div class="show-left ub ub-ac" :class="showFlag ? 'is-show' : 'not-show'">
                <el-tag :key="index + 'e'" v-for="(tag, index) in selectList" closable size="mini" @close="handleClose(tag)">{{ tag | showTag }}</el-tag>
                <el-input class="search-input" v-model="searchTxt" @focus="showMore = true"></el-input>
            </div>
            <div class="show-right ub ub-pj ub-ac">
                <div><i class="iconfont icon-gengduo" @click="showFlag = !showFlag"></i></div>
                <div><i class="iconfont icon-zuo1" :class="showMore ? 'arrow-up' : 'arrow-down'" @click="showMore = !showMore" style="font-size:12px"></i></div>
            </div>
        </div>
        <div class="bottom-box tree" v-if="showMore">
            <el-tabs v-model="activeName">
                <el-tab-pane label="同事" name="first">
                    <span slot="label" style="position: relative">
                        同事
                        <span class="red-num">{{ checkUsers.length }}</span>
                    </span>
                    <el-checkbox-group v-model="checkUsers">
                        <el-checkbox
                            v-for="(item, index) in usersList.filter(user => user.chineseName.includes(searchTxt))"
                            :key="index"
                            :label="JSON.stringify(item)"
                            style="display: block"
                        >
                            {{ item.chineseName }}{{ item.depName ? `-(${item.depName})` : '' }}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-tab-pane>
                <el-tab-pane label="部门" name="second">
                    <span slot="label" style="position: relative">
                        部门
                        <span class="red-num">{{ checkDeps.length }}</span>
                    </span>
                    <el-checkbox-group v-model="checkDeps">
                        <el-checkbox
                            v-for="(item, index) in depList.filter(user => user.name.includes(searchTxt))"
                            :key="index + 'a'"
                            :label="JSON.stringify(item)"
                            style="display: block"
                        >
                            {{ item.name }}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-tab-pane>
                <el-tab-pane label="角色" name="third">
                    <span slot="label" style="position: relative">
                        角色
                        <span class="red-num">{{ checkRoles.length }}</span>
                    </span>
                    <el-checkbox-group v-model="checkRoles">
                        <el-checkbox
                            v-for="(item, index) in rolesList.filter(user => user.roleName.includes(searchTxt))"
                            :key="index + 'b'"
                            :label="JSON.stringify(item)"
                            style="display: block"
                        >
                            {{ item.roleName }}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-tab-pane>
                <el-tab-pane label="数据相关" name="fourth">
                    <span slot="label" style="position: relative;">
                        数据相关
                        <span style="left:45px;" class="red-num">{{ checkData.length }}</span>
                    </span>
                    <el-checkbox-group v-model="checkData">
                        <el-checkbox
                            v-for="(item, index) in dataList.filter(user => user.name.includes(searchTxt))"
                            :key="index + 'bb'"
                            :label="JSON.stringify(item)"
                            style="display: block"
                        >
                            {{ item.name }}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-tab-pane>
                <!-- <el-tab-pane label="流程相关" name="fifth" v-if="!noFlow">
                    <span slot="label" style="position: relative;">流程相关<span style="left:45px;" class="red-num">{{checkFlow.length}}</span></span>
                    <el-checkbox-group v-model="checkFlow">
                        <el-checkbox label="流程相关" style="display: block"></el-checkbox>
                    </el-checkbox-group>
                </el-tab-pane> -->
                <el-tab-pane label="资产组织架构" name="six">
                    <span slot="label" style="position: relative">
                        资产组织架构
                        <span class="red-num" style="left:68px;">{{ checkAssetOrganize.length }}</span>
                    </span>
                    <el-tree
                        ref="tree"
                        :default-expand-all="true"
                        :highlight-current="true"
                        :data="assetOrganizeList"
                        show-checkbox
                        node-key="id"
                        @node-click="handleNodeClick"
                        @check="handleNodeClick"
                        :props="defaultProps"
                        :filter-node-method="filterNode"
                    ></el-tree>
                </el-tab-pane>
                <el-tab-pane label="资产用户" name="seven">
                    <span slot="label" style="position: relative">
                        资产用户
                        <span class="red-num">{{ checkAssetUser.length }}</span>
                    </span>
                    <el-checkbox-group v-model="checkAssetUser">
                        <el-checkbox v-for="(item, index) in assetUserList.filter(user => user.name.includes(searchTxt))" :key="index" :label="JSON.stringify(item)" style="display: block">
                            {{ `${item.name}     ${item.account}` }}{{ item.depName ? `-(${item.depName})` : '' }}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DropdownBox',
    data() {
        return {
            defaultProps: {
                id: 'id',
                children: 'sub',
                label: 'name'
            },
            activeName: 'first',
            showFlag: false,
            showMore: false,
            checkUsers: [],
            checkDeps: [],
            checkRoles: [],
            checkData: [],
            checkFlow: [],
            checkAssetOrganize: [],
            checkAssetUser: [],
            searchTxt: ''
        }
    },
    props: ['usersList', 'depList', 'rolesList', 'dataList', 'usersShow', 'noFlow', 'assetOrganizeList', 'assetUserList'],

    computed: {
        selectList: {
            get() {
                let msg = this.checkUsers.concat(this.checkRoles, this.checkDeps, this.checkData, this.checkFlow, this.checkAssetOrganize, this.checkAssetUser)
                console.log('msg', msg)
                console.log('checkAssetOrganize', this.checkAssetOrganize)
                this.$emit('confirmData', msg)
                return msg
            },
            set(val) {
                this.$emit('confirmData', val)
                return val
            }
        }
    },
    mounted() {
        console.log(this.usersShow, 'wwwwwwwwww')
        if (this.usersShow?.length) {
            this.splitShow(this.usersShow)
        }
    },
    watch: {
        searchTxt(val) {
            this.$refs.tree.filter(val)
        }
    },
    filters: {
        showTag(tag) {
            // console.log(tag)
            if (tag !== '流程相关' && typeof tag === 'string') {
                // console.log(tag)
                tag = JSON.parse(tag)
            }
            if (tag.type === '0') {
                return tag.chineseName
            } else if (tag.type === '1' || tag.type === '3' || tag.type === '5' || tag.type === '6') {
                return tag.name
            } else if (tag.type === '2') {
                return tag.roleName
            } else if (tag === '流程相关') {
                return tag
            }
        }
    },
    methods: {
        filterNode(value, data) {
            if (!value) return true
            return data.name.indexOf(value) !== -1
        },
        handleNodeClick(node) {
            let nodeData = this.$refs.tree.getCheckedNodes()
            console.log('nodeData123', nodeData)
            if (nodeData.length > 0) {
                let cell = nodeData.map(item => {
                    return {
                        id: item.id,
                        name: item.name,
                        type: '5'
                    }
                })
                this.checkAssetOrganize = cell.map(item => JSON.stringify(item))
            }
            console.log('nodeData', nodeData)
        },
        handleClose(tag) {
            if (tag !== '流程相关' && typeof tag === 'string') {
                tag = JSON.parse(tag)
            }
            console.log(this.selectList.indexOf(tag))
            if (tag.type === '0') {
                this.checkUsers.indexOf(JSON.stringify(tag)) !== -1 && this.checkUsers.splice(this.checkUsers.indexOf(JSON.stringify(tag)), 1)
            } else if (tag.type === '1') {
                this.checkDeps.indexOf(JSON.stringify(tag)) !== -1 && this.checkDeps.splice(this.checkDeps.indexOf(JSON.stringify(tag)), 1)
            } else if (tag.type === '2') {
                this.checkRoles.indexOf(JSON.stringify(tag)) !== -1 && this.checkRoles.splice(this.checkRoles.indexOf(JSON.stringify(tag)), 1)
            } else if (tag.type === '3') {
                this.checkData.indexOf(JSON.stringify(tag)) !== -1 && this.checkData.splice(this.checkData.indexOf(JSON.stringify(tag)), 1)
            } else if (tag.type === '5') {
                this.checkAssetOrganize.indexOf(JSON.stringify(tag)) !== -1 && this.checkAssetOrganize.splice(this.checkAssetOrganize.indexOf(JSON.stringify(tag)), 1)
                this.$refs.tree.setCheckedNodes(this.checkAssetOrganize)
                console.log('减少后', this.checkAssetOrganize)
            } else if (tag.type === '6') {
                this.checkAssetUser.indexOf(JSON.stringify(tag)) !== -1 && this.checkAssetUser.splice(this.checkAssetUser.indexOf(JSON.stringify(tag)), 1)
            } else if (tag === '流程相关') {
                this.checkFlow = []
            }
        },
        splitShow(val) {
            this.checkUsers = []
            this.checkDeps = []
            this.checkData = []
            this.checkRoles = []
            this.checkFlow = []
            this.checkAssetOrganize = []
            this.checkAssetUser = []
            val.forEach(tag => {
                console.log(tag)
                if (tag !== '流程相关' && typeof tag === 'string') {
                    console.log(tag)
                    tag = JSON.parse(tag)
                }
                if (tag.type === '0') {
                    this.checkUsers.push(JSON.stringify(tag))
                } else if (tag.type === '1') {
                    this.checkDeps.push(JSON.stringify(tag))
                } else if (tag.type === '2') {
                    this.checkRoles.push(JSON.stringify(tag))
                } else if (tag.type === '3') {
                    this.checkData.push(JSON.stringify(tag))
                } else if (tag.type === '5') {
                    this.checkAssetOrganize.push(JSON.stringify(tag))
                } else if (tag.type === '6') {
                    this.checkAssetUser.push(JSON.stringify(tag))
                } else if (tag === '流程相关') {
                    this.checkFlow.push(JSON.stringify(tag))
                }
            })
            console.log(this.checkUsers)
        }
    }
}
</script>

<style scoped lang="scss">
.container {
    width: 100%;
    position: relative;
}
.show-box {
    min-height: 32px;
    border: 1px solid #dcdcdc;
    border-radius: 3px;

    .show-right {
        width: 50px;
        height: 30px;

        & > div {
            width: 24px;
            height: 30px;
            line-height: 30px;

            & i {
                color: #909399;
                font-size: 14px;
                cursor: pointer;

                &.arrow-up:before {
                    display: inline-block;
                    transform: rotate(90deg);
                }
                &.arrow-down:before {
                    display: inline-block;
                    transform: rotate(-90deg);
                }
            }
        }
    }

    .show-left {
        width: calc(100% - 50px);
        display: flex;
        flex-wrap: wrap;
        margin: 3px 5px 0 5px;
        & ::v-deep .el-tag {
            margin-left: 5px;
            height: 24px;
            line-height: 24px;
            // border-color: rgba(0, 0, 0, .9);
            margin-right: 5px;
            margin-bottom: 4px;
        }
        .search-input {
            display: flex;
            flex: 1;
            height: 24px;
            line-height: 24px;
            border: none;
            margin-bottom: 4px;
            ::v-deep .el-input__inner {
                height: 100%;
                border: none!important;
            }
        }
    }
    .show-left.not-show {
        height: 26px;
        overflow: hidden;
    }
    .show-left.is-show {
        min-height: 30px;
    }
}
.bottom-box {
    margin-top: 10px;
    padding-left: 10px;
    box-sizing: border-box;
    border: 1px solid #dcdcdc;
    // box-shadow: inset 0px 0px 7px 0px #389bf7;
    border-radius: 3px;
    background-color: #fff;
    position: absolute;
    width: 100%;
    z-index: 999;
    min-height: 180px;

    ::v-deep .el-tabs__item.is-active,
    ::v-deep .el-tabs__item:hover {
        color: #909399;
        opacity: 1;
        border: none;
        box-shadow: none;
    }
    ::v-deep .el-tabs__active-bar {
        background-color: #409eff;
    }
    ::v-deep .el-tabs__item {
        color: #909399;
        opacity: 0.4;
        font-size: 12px;
        padding: 0 10px;
    }
    ::v-deep .el-tabs__nav-wrap::after {
        // background-color: rgba(28,215,250,.2);
    }
    ::v-deep .el-tabs__content {
        max-height: 240px;
        overflow-y: auto;
    }
    ::v-deep .el-checkbox__label {
        font-size: 12px;
    }
    ::v-deep .red-num {
        position: absolute;
        width: 20px;
        height: 20px;
        text-align: center;
        font-size: 12px;
        line-height: 20px;
        background: #ff3d3d;
        color: #fff;
        border-radius: 50%;
        left: 20px;
        top: -10px;
    }
}
.drop-box {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
</style>
