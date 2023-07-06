<template>
    <div class="container drop-box user-drop" @click.stop>
        <div class="show-box ub ub-pj">
            <div class="show-left ub ub-ac" :class="showFlag ? 'is-show' : 'not-show'" @click="showMore = !showMore">
                <el-tag
                    class="tags"
                    :key="index+'e'"
                    v-for="(tag,index) in selectList"
                    closable
                    size="mini"
                    @close="handleClose(tag)">
                    {{tag|showTag}}
                </el-tag>
            </div>
            <div class="show-right ub ub-pj ub-ac">
                <div>
                    <i class="iconfont icon-gengduo"  @click.stop="showFlag = !showFlag"></i>
                </div>
                <div>
                    <i class="iconfont icon-zuo1" :class="showMore ? 'arrow-up' : 'arrow-down'" @click="showMore = !showMore"></i>
                </div>
            </div>
        </div>
        <div class="bottom-box tree" v-if="showMore">
            <el-tabs v-model="activeName">
                <el-tab-pane label="同事" name="first">
                    <span slot="label" style="position: relative;">同事<span class="red-num">{{checkUsers.length}}</span></span>
                    <el-checkbox-group v-model="checkUsers">
                        <el-checkbox v-for="(item,index) in usersList" :key="index" :label="JSON.stringify(item)" style="display: block;">{{item.chineseName}}</el-checkbox>
                    </el-checkbox-group>
                </el-tab-pane>
                <el-tab-pane label="部门" name="second">
                    <span slot="label" style="position: relative;">部门<span class="red-num">{{checkDeps.length}}</span></span>
                    <el-checkbox-group v-model="checkDeps">
                        <el-checkbox v-for="(item,index) in depList" :key="index + 'a'" :label="JSON.stringify(item)" style="display: block;">{{item.name}}</el-checkbox>
                    </el-checkbox-group>
                </el-tab-pane>
                <el-tab-pane label="角色" name="third">
                    <span slot="label" style="position: relative;">角色<span class="red-num">{{checkRoles.length}}</span></span>
                    <el-checkbox-group v-model="checkRoles">
                        <el-checkbox v-for="(item,index) in rolesList" :key="index + 'b'" :label="JSON.stringify(item)" style="display: block;">{{item.roleName}}</el-checkbox>
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
            activeName: 'first',
            showFlag: false,
            showMore: false,
            checkUsers: [],
            checkDeps: [],
            checkRoles: []

        }
    },
    props: ['usersList', 'depList', 'rolesList'],

    computed: {
        selectList: {
            get() {
                let msg = this.checkUsers.concat(this.checkRoles, this.checkDeps)
                console.log('2222222222222', msg)
                return msg
            },
            set(val) {
                return val
            }
        }
    },
    watch: {
        selectList(newVal) {
            this.$emit('confirmData', newVal)
        }
    },
    filters: {
        showTag(tag) {
            // console.log(tag)
            if (typeof tag === 'string') {
                tag = JSON.parse(tag)
            }
            if (tag.type === '0') {
                return tag.chineseName
            } else if (tag.type === '1') {
                return tag.name
            } else if (tag.type === '2') {
                return tag.roleName
            }
        }
    },
    methods: {
        handleClose(tag) {
            tag = JSON.parse(tag)
            console.log(this.selectList.indexOf(tag))
            if (tag.type === '0') {
                (this.checkUsers.indexOf(JSON.stringify(tag)) !== -1) && this.checkUsers.splice(this.checkUsers.indexOf(JSON.stringify(tag)), 1)
            } else if (tag.type === '1') {
                (this.checkDeps.indexOf(JSON.stringify(tag)) !== -1) && this.checkDeps.splice(this.checkDeps.indexOf(JSON.stringify(tag)), 1)
            } else if (tag.type === '2') {
                (this.checkRoles.indexOf(JSON.stringify(tag)) !== -1) && this.checkRoles.splice(this.checkRoles.indexOf(JSON.stringify(tag)), 1)
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
    color: #909399;
    background-color: #f4f4f5;
}
.container {
    position: relative;
    width: 100%;
}
.show-box {
    height: 100%;
    min-height: 20px;
    border: 1px solid #dddddd;
    border-radius: 3px;
    .show-right {
        width: 50px;
        height: 20px;
        &>div {
            width: 24px;
            height: 20px;
            line-height: 25px;
            & i {
                font-size: 13px;
                color: #1cd7fa;
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
            color: #909399;
            background-color: #f4f4f5;
            & .el-tag__close {
                color: #909399;
            }
            & .el-tag__close:hover {
                color: #000000;
                background-color: #909399;
            }
        }
    }
    .show-left.not-show {
        overflow: hidden;
        height: 28px;
    }
    .show-left.is-show {overflow: hidden;
        min-height: 28px;
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
    ::v-deep .el-tabs__nav-wrap::after {
        background-color: #dddddd;
    }
    ::v-deep .el-tabs__content {
        overflow-y: auto;
        max-height: 240px !important;
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
    .bottom-box {
        background: transparent;
    }
}
.drop-box {
    -webkit-touch-callout: none;
    user-select: none;
    user-select: none;
    user-select: none;
    user-select: none;
    user-select: none;
}

</style>
<style>
.white-theme .user-drop .show-box {
    border: 1px solid #c1c1c1 !important;
    box-shadow: none !important;
}
.white-theme .user-drop.container {
    box-shadow: none !important;

    /* border: 1px solid #c1c1c1 !important; */
}
.white-theme .user-drop.container .bottom-box.tree {
    border: 1px solid #c1c1c1 !important;
    box-shadow: none !important;
}
.white-theme .user-drop .operate-color,
.white-theme .show-box .show-right > div i {
    color: #3aa6e4 !important;
}
.white-theme .user-drop.drop-box .bottom-box {
    background: #ffffff !important;
}
.white-theme .user-drop.drop-box .el-tag .el-icon-close {
    top: -3px !important;
}
</style>
