<template>
    <el-dropdown trigger="click" :hide-on-click="false">
        <el-button style="margin-left: 5px;" icon="el-icon-edit-outline" type="primary" size="small">配置列</el-button>
        <el-dropdown-menu slot="dropdown" style="padding-left: 10px">
            <div class="left-tip"><i class="el-icon-info"></i><span>拖拽字段进行排序</span></div>
            <el-checkbox-group v-model="checkArr" @change="changeHeader">
                <draggable
                    class="w100"
                    tag="div"
                    v-model="checkListAll"
                    v-bind="{scroll: true,animation: 150}"
                    @end="onEnd">
                    <transition-group>
                        <el-checkbox style="display: block" :label="element.label" v-for="element in checkListAll" :key="element.prop"></el-checkbox>
                    </transition-group>
                </draggable>

            </el-checkbox-group>
        </el-dropdown-menu>
    </el-dropdown>
</template>

<script>
import draggable from 'vuedraggable'
import { headerFindReq, headerSaveReq } from '@/server/reporting_platform/report_pages'

export default {
    components: {
        draggable
    },
    props: {
        filter: {
            default: null
        }
    },
    data() {
        return {
            checkArr: [],
            checkListAll: [],
            headerTimer: null
        }
    },
    methods: {
        onEnd() {
            this.changeHeader()
        },
        changeHeader() {
            let checkListAll = this.$_.cloneDeep(this.checkListAll)
            checkListAll.forEach(item => {
                if (this.checkArr.includes(item.label)) {
                    item.isShow = true
                } else {
                    item.isShow = false
                }
            })
            this.checkListAll = checkListAll
            let vm = this
            clearTimeout(this.headerTimer)
            this.headerTimer = setTimeout(function() {
                vm.updateHeader()
            }, 1000)
        },
        getHeader() {
            let data = {
                queryData: this.filter,
                paramsData: {}
            }
            headerFindReq(data).then(res => {
                console.log('表头', res)
                res = res || []
                this.checkListAll = res
                this.checkArr = this.checkListAll.map(item => {
                    if (item.isShow) {
                        return item.label
                    }
                })
                console.log(this.checkArr)
            }).catch(err => {
                console.log('err' + err)
            })
        },
        updateHeader() {
            let data = {
                queryData: {},
                paramsData: {
                    tag: this.filter.tag,
                    items: this.checkListAll
                }
            }
            headerSaveReq(data).then(res => {
                console.log(res)
            }).catch(err => {
                console.log('err' + err)
            })
        }
    },
    watch: {
        checkListAll: {
            handler(newVal) {
                let checkList = newVal.filter(item => {
                    return item.isShow
                })
                this.$emit('updateHeaders', checkList)
                // this.$_.thorttle(this.$emit('updateHeaders', checkList), 1000)
            },
            deep: true,
            immediate: true
        },
        filter: {
            handler(newVal, oldVal) {
                if (!oldVal && newVal) {
                    console.log(newVal, 'newVal')
                    this.$nextTick(() => {
                        this.getHeader()
                    })
                }
            },
            deep: true,
            immediate: true
        }
    }
}
</script>

<style lang="scss" scoped>
    .left-tip {
        .el-icon-info {
            margin-right: 2px;
        }
        margin: 0 0 3px 0;
        font-size: 14px;
    }
</style>
