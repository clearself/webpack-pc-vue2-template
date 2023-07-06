<template>
    <div class="container" @click.stop="">
        <div class="show-box ub ub-pj" @click="showMore = !showMore">
            <div class="show-left ub ub-ac" :class="showFlag ? 'is-show' : 'not-show'">
                <el-tag
                    class="tags"
                    :key="index+'e'"
                    v-for="(tag,index) in selectList"
                    closable
                    size="mini"
                    @close="handleClose(tag)">
                    {{tag|showTag}}
                </el-tag>
                <span v-if="!selectList.length" style=" padding-left: 10px;font-size: 12px; color: #c5c5c5; line-height: 26px;">请选择</span>
            </div>
            <div class="show-right ub ub-pj ub-ac">
                <div>
                    <i class="iconfont icon-gengduo"  @click="showFlag = !showFlag"></i>
                </div>
                <div>
                    <i class="iconfont icon-zuo1" :class="showMore ? 'arrow-up' : 'arrow-down'" @click.stop="showMore = !showMore"></i>
                </div>
            </div>
        </div>
        <div class="bottom-box tree" v-if="showMore">
            <el-tabs v-model="activeName">
                <el-tab-pane label="同事" name="first">
                    <span slot="label" style="position: relative;">同事<span class="red-num">{{checkUsers.length}}</span></span>
                    <el-checkbox-group v-model="checkUsers">
                        <el-checkbox v-for="(item,index) in usersList" :key="index" :label="item.id" style="display: block;">{{item.chineseName}}</el-checkbox>
                    </el-checkbox-group>
                </el-tab-pane>
                <el-tab-pane label="部门" name="second">
                    <span slot="label" style="position: relative;">部门<span class="red-num">{{checkDeps.length}}</span></span>
                    <el-checkbox-group v-model="checkDeps">
                        <el-checkbox v-for="(item,index) in depList" :key="index + 'a'" :label="item.id" style="display: block;">{{item.name}}</el-checkbox>
                    </el-checkbox-group>
                </el-tab-pane>
                <el-tab-pane label="角色" name="third">
                    <span slot="label" style="position: relative;">角色<span class="red-num">{{checkRoles.length}}</span></span>
                    <el-checkbox-group v-model="checkRoles">
                        <el-checkbox v-for="(item,index) in rolesList" :key="index + 'b'" :label="item.id" style="display: block;">{{item.roleName}}</el-checkbox>
                    </el-checkbox-group>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Personnel',
    data() {
        return {
            activeName: 'first',
            showFlag: false,
            showMore: false,
            checkUsers: [],
            checkDeps: [],
            checkRoles: []
        }
    },
    props: ['usersList', 'depList', 'rolesList', 'index', 'usersSelected'],

    computed: {
        selectList() {
            let checkUsers = []; let checkDeps = []; let checkRoles = []
            this.checkUsers.map(item => {
                let selected = this.usersList.filter(_item => _item.id === item)
                if (selected.length > 0) {
                    checkUsers.push(selected[0])
                }
            })
            this.checkDeps.map(item => {
                let selected = this.depList.filter(_item => _item.id === item)
                if (selected.length > 0) {
                    checkDeps.push(selected[0])
                }
            })
            this.checkRoles.map(item => {
                let selected = this.rolesList.filter(_item => _item.id === item)
                if (selected.length > 0) {
                    checkRoles.push(selected[0])
                }
            })
            let msg = checkUsers.concat(checkRoles, checkDeps)
            console.log(msg)
            this.$emit('confirmData', {
                val: msg,
                index: this.index
            })
            return msg
        }
    },
    mounted() {
        console.log('dwadaddaadwda', this.rolesList)
        this.initData()
    },
    filters: {
        showTag(tag) {
            console.log(tag)
            if (tag.type === '0') {
                return tag.chineseName
            } else if (tag.type === '1') {
                return tag.name
            } else if (tag.type === '2') {
                return tag.roleName
            } else if (tag.type === '3' || tag.type === '4') {
                return tag.name
            }
        }
    },
    methods: {
        initData() {
            console.log('this.usersSelected', this.usersSelected)
            // 用户
            let checkUsers = []; let checkDeps = []; let checkRoles = []

            checkUsers = this.usersSelected.filter(item => item.type == 0)
            if (checkUsers.length > 0) {
                checkUsers.map(item => {
                    this.checkUsers.push(item.id)
                })
            }
            // 用户
            checkDeps = this.usersSelected.filter(item => item.type == 1)
            if (checkDeps.length > 0) {
                checkDeps.map(item => {
                    this.checkDeps.push(item.id)
                })
            }
            // 用户
            checkRoles = this.usersSelected.filter(item => item.type == 2)
            if (checkRoles.length > 0) {
                checkRoles.map(item => {
                    this.checkRoles.push(item.id)
                })
            }
        },
        handleClose(tag) {
            console.log('tag', tag)
            if (tag.type === '0') {
                let index = this.checkUsers.findIndex(item => item === tag.id)
                this.checkUsers.splice(index, 1)
            } else if (tag.type === '1') {
                let index = this.checkDeps.findIndex(item => item === tag.id)
                this.checkDeps.splice(index, 1)
            } else if (tag.type === '2') {
                let index = this.checkRoles.findIndex(item => item === tag.id)
                this.checkRoles.splice(index, 1)
            }
        }
    }
}
</script>

<style scoped lang="scss">
.tags {
    margin-right: 5px;
    margin-bottom: 4px;
    height: 26px;
    line-height: 26px;
}
.container {
    position: relative;
    width: 100%;
}
.show-box {
    cursor: pointer;
    min-height: 32px;
    border: 1px solid #dddddd;
    // box-shadow: inset 0px 0px 7px 0px #389bf7;
    border-radius: 3px;
    .show-right {
        width: 50px;
        height: 30px;
        &>div {
            width: 24px;
            height: 30px;
            line-height: 30px;
            & i {
                font-size: 14px;
                color: #dddddd;
                cursor: pointer;
                &.arrow-up::before {
                    display: inline-block;
                    transform: rotate(90deg);
                }
                &.arrow-down::before {
                    display: inline-block;
                    transform: rotate(-90deg);
                }
            }
        }
    }
    .show-left {
        display: flex;
        margin: 2px 5px 0;
        width: calc(100% - 50px);
        flex-wrap: wrap;
        &::v-deep.el-tag {
            margin-left: 5px;
            height: 20px;
            border-color: #387dee;
            color: #387dee;
            background-color: transparent;
            line-height: 20px;
            & .el-tag__close {
                color: #387dee;
            }
            & .el-tag__close:hover {
                color: #000000;
                background-color: #387dee;
            }
        }
    }
    .show-left.not-show {
        overflow: hidden;
        height: 26px;
    }
    .show-left.is-show {
        min-height: 30px;
    }
}
.bottom-box {
    position: absolute;
    margin-top: 10px;
    padding-left: 10px;
    width: 100%;
    border: 1px solid #dddddd;
    // box-shadow: inset 0px 0px 7px 0px #389bf7;
    border-radius: 3px;
    background-color: #ffffff;
    box-sizing: border-box;
    ::v-deep .el-tabs__item.is-active, ::v-deep.el-tabs__item:hover {
        border: none;
        color: #387dee;
        opacity: 1;
        box-shadow: none;
    }
    ::v-deep.el-tabs__active-bar {
        background-color: #387dee;
    }
    ::v-deep .el-tabs__item {
        padding: 0 10px;
        font-size: 12px;
        color: #387dee;
        opacity: 0.4;
    }
    ::v-deep.el-tabs__nav-wrap::after {
        background-color: rgb(28 215 250 / 20%);
    }
    ::v-deep.el-tabs__content {
        overflow-y: auto;
        max-height: 240px;
    }
    ::v-deep.el-checkbox__label {
        font-size: 12px;
    }
    ::v-deep .red-num {
        position: absolute;
        top: -10px;
        left: 20px;
        width: 20px;
        height: 20px;
        font-size: 12px;
        border-radius: 50%;
        text-align: center;
        color: #ffffff;
        background: #ff3d3d;
        line-height: 20px;
    }
}
.custom-star {
    .show-box {
        border-color: #1cd7fa!important;
    }
    .bottom-box {
        border: 1px solid #1cd7fa;
        background-color: #052942!important;
        ::v-deep .el-tabs__nav-wrap::after {
            background-color: #1cd7fa!important;
        }
    }
}
</style>
