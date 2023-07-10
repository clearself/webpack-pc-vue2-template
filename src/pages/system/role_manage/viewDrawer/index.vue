<template>
    <el-drawer custom-class="role-drawer-show" title="查看角色权限" :visible.sync="drawer" :direction="direction" :before-close="handleClose">
        <el-table :cell-class-name="setCellClass" :show-header="false" :data="firstTable" style="width: 100%;border-bottom: none;" row-key="index" border>
            <el-table-column prop="label" label="" width="100" class-name="column-style" label-class-name="header-border"></el-table-column>
            <el-table-column prop="val" label="" width="auto"></el-table-column>
        </el-table>
        <el-table
            :cell-class-name="setCellClass"
            :tree-props="{ children: 'none', hasChildren: 'none' }"
            :span-method="objectSpanMethod"
            :data="routesData"
            style="width: 100%;border-top: none;"
            row-key="index"
            border
        >
            <el-table-column prop="set" label="" width="100" class-name="column-style" label-class-name="header-border"></el-table-column>
            <el-table-column show-overflow-tooltip prop="first" label="一级菜单" width="180">
                <template slot-scope="scope">
                    <span v-if="scope.row.status1 !== 0">{{ scope.row.first }}</span>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="second" label="二级/三级菜单" width="180">
                <template slot-scope="scope">
                    <div v-if="scope.row.second && !scope.row.third">
                        <span v-if="scope.row.status2 !== 0">{{ scope.row.second }}</span>
                    </div>
                    <div v-if="scope.row.third" class="third_level">
                        <i class="iconfont icon-fudongcaidanliebiaoshu"></i>
                        <span v-if="scope.row.status3 !== 0">{{ scope.row.third }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="action" label="权限配置细则">
                <template slot-scope="scope">
                    <span :key="index" v-for="(item, index) in scope.row.btns">
                        <template v-if="item.status">
                            {{ item.btn }}、
                        </template>
                    </span>
                </template>
            </el-table-column>
        </el-table>
    </el-drawer>
</template>

<script>
export default {
    props: {
        propRoute: {
            type: Array,
            default: () => []
        },
        desc: {
            type: String,
            default: ''
        },
        name: {
            type: String,
            default: ''
        },
        time: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            drawer: false,
            direction: 'rtl',
            rules: {
                roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
                role: [{ required: true, message: '请选择权限', trigger: 'blur' }]
            },
            roleForm: {
                roleName: '',
                roleDesc: '',
                role: null
            },
            firstTable: [{ label: '角色名称', val: '' }, { label: '角色描述', val: '' }, { label: '创建时间', val: '' }],
            routes: [],
            routesData: []
        }
    },
    mounted() {},
    watch: {
        routes: {
            deep: true,
            handler: function(oldval, newval) {
                console.log(1)
                this.watchRoute(this.routes)
                this.watchRoot(this.routes)
            }
        }
    },
    computed: {},
    methods: {
        init() {
            setTimeout(() => {
                this.drawer = true
                this.routes = JSON.parse(JSON.stringify(this.propRoute))
                this.firstTable[0].val = this.name
                this.firstTable[1].val = this.desc
                this.firstTable[2].val = this.time
                this.rowCalc()
                this.routeTableData()
            })
        },
        submit() {
            console.log(this.routes)
            if (this.routes.some(item => item.status1 != 0)) {
                this.roleForm.role = this.routes
            } else {
                this.roleForm.role = null
            }
            this.$refs.roleForm.validate(valid => {
                if (valid) {
                    this.$emit('addRole', this.roleForm)
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        cancel() {
            // 关闭抽屉
            this.drawer = false
            this.routes = []
            this.routesData = []
            this.roleForm.roleName = ''
            this.roleForm.roleDesc = ''
            this.roleForm.role = null
        },
        openDrawer() {
            this.drawer = true
        },
        switchLevel(i) {
            let status
            if (i.id3) {
                status = '3'
            } else if (i.id2) {
                status = '2'
            } else {
                status = '1'
            }
            return status
        },
        watchRoute(route) {
            route.forEach(item => {
                if (item.children && item.children.length) {
                    let status = this.switchLevel(item)
                    if (item.btns && item.btns.length) {
                        item.btns.forEach(btn => {
                            if (btn.status === 1) {
                                btn.status = true
                            }
                            if (btn.status === 0) {
                                btn.status = false
                            }
                        })
                        if (item.btns.every(b => b.status)) {
                            let c = item.children
                            if (c.every(i => i.btns.every(n => n.status))) {
                                item[`status${status}`] = 2
                                item[`checked${status}`] = true
                            } else {
                                item[`status${status}`] = 1
                                item[`checked${status}`] = false
                            }
                        } else if (item.btns.some(b => b.status)) {
                            item[`status${status}`] = 1
                        } else {
                            // 二级菜单的选中状态
                            // 三级菜单不一定有按钮
                            let c = item.children
                            let cHasBtns = c.some(i => i.btns.length)
                            if (cHasBtns) {
                                if (c.some(i => i.btns.some(n => n.status))) {
                                    item[`status${status}`] = 1
                                    item[`checked${status}`] = false
                                } else {
                                    item[`status${status}`] = 0
                                    item[`checked${status}`] = false
                                }
                            } else {
                                // 首次加载
                                item[`status${status}`] = item.isCheck
                                item[`checked${status}`] = !!item.isCheck
                            }
                        }
                    } else {
                        // 有下级菜单，本身没有按钮，一级菜单不需要处理，三级菜单不存在这种情况，只需要处理二级菜单
                        if (status == '2') {
                            // console.log(JSON.stringify(c))
                            let c = item.children
                            console.log(JSON.stringify(c))
                            console.log(c.some(i => i.checked3))
                            console.log(c.every(i => i.checked3))
                            console.log(c.some(i => i.btns.every(n => n.status)))
                            if (c.every(i => i.btns.every(n => n.status)) && c.every(i => i.checked3)) {
                                item[`status${status}`] = 2
                                item[`checked${status}`] = true
                            } else if (c.some(i => i.btns.some(n => n.status)) || c.some(i => i.checked3)) {
                                item[`status${status}`] = 1
                                item[`checked${status}`] = false
                            } else {
                                item[`status${status}`] = 0
                                item[`checked${status}`] = false
                            }
                        }
                        // console.log(status)
                        // console.log(item)
                    }
                    this.watchRoute(item.children)
                } else {
                    let status = this.switchLevel(item)
                    // console.log(item.btns)
                    if (item.btns && item.btns.length) {
                        item.btns.forEach(btn => {
                            if (btn.status === 1) {
                                btn.status = true
                            }
                            if (btn.status === 0) {
                                btn.status = false
                            }
                        })

                        if (item.btns.every(b => b.status)) {
                            item[`status${status}`] = 2
                            item[`checked${status}`] = true
                        } else if (item.btns.some(b => b.status)) {
                            item[`status${status}`] = 1
                        } else {
                            item[`status${status}`] = 0
                            item[`checked${status}`] = false
                        }
                    } else {
                        // 无下级，无按钮
                        // console.log(item)
                        // console.log(status)
                        // item[`status${status}`] = item.isCheck
                        // item[`checked${status}`] = !!item.isCheck
                        // console.log(item)
                    }
                }
            })
        },
        watchRoot(route) {
            console.log(route)
            route.forEach(item => {
                if (item.children && item.children.length && item.children.every(r => r.status2 == 2)) {
                    item.status1 = 2
                    item.checked1 = true
                } else if (item.children && item.children.length && item.children.some(r => r.status2 !== 0)) {
                    item.status1 = 1
                    item.checked1 = false
                } else {
                    if (item.children.length !== 0) {
                        item.status1 = 0
                        item.checked1 = false
                    }
                }
                this.routesData.forEach(r => {
                    r.set = '配置权限'
                    if (r.id1 == item.id) {
                        // 说明是第一级数据，赋值给第一层，二层以后不需要赋值，地址引用
                        r.checked1 = item.checked1
                        r.status1 = item.status1
                    }
                })
            })
        },
        refeshTable() {
            this.routesData.splice()
        },
        changeBtns(row) {
            this.setBtns(this.routes, row.id, row.btns)
        },
        setBtns(route, id, btns) {
            route.forEach(item => {
                if (item.children && item.children.length) {
                    this.setBtns(item.children, id, btns)
                } else {
                    if (item.id == id) {
                        item.btns = btns
                    }
                }
            })
        },
        change1(row) {
            console.log(row)
            const first = this.routes.filter(item => {
                return item.id == row.id1
            })[0]
            first.children &&
                first.children.length &&
                first.children.forEach(sec => {
                    sec.checked2 = row.checked1
                    this.change2(sec)
                    sec.children &&
                        sec.children.length &&
                        sec.children.forEach(thr => {
                            thr.checked3 = row.checked1
                            this.change3(thr)
                        })
                })
            if (!first.children.length) {
                if (row.checked1) {
                    row.status1 = 2
                } else {
                    row.status1 = 0
                }
            }
            this.refeshTable()
        },
        change2(row) {
            row.btns.forEach(btn => {
                btn.status = row.checked2
            })
            if (row.children && row.children.length) {
                row.children &&
                    row.children.length &&
                    row.children.forEach(thr => {
                        thr.checked3 = row.checked2
                        this.change3(thr)
                    })
            } else {
                if (!row.btns.length) {
                    if (row.checked2) {
                        row.status2 = 2
                    } else {
                        row.status2 = 0
                    }

                    this.routes.splice()
                }
            }
            this.refeshTable()
        },
        change3(row) {
            row.btns.forEach(btn => {
                btn.status = row.checked3
            })
            if (!row.btns.length) {
                if (row.checked3) {
                    row.status3 = 2
                } else {
                    row.status3 = 0
                }
                this.routes.splice()
            }
            this.refeshTable()
        },
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 1) {
                if (this.routesData[rowIndex].rowSpan) {
                    return {
                        rowspan: this.routesData[rowIndex].rowSpan,
                        colspan: 1
                    }
                } else {
                    // delete this.routesData[rowIndex].checked1
                    return {
                        rowspan: 0,
                        colspan: 0
                    }
                }
            } else if (columnIndex === 0) {
                if (rowIndex === 0) {
                    return {
                        rowspan: this.routesData.length,
                        colspan: 1
                    }
                } else {
                    return {
                        rowspan: 0,
                        colspan: 0
                    }
                }
            }
        },
        handleClose(done) {
            // this.$confirm('确认关闭？')
            //     .then(_ => {
            this.cancel()
            done()
            // })
            // .catch(_ => {})
        },
        rowCalc() {
            this.routes = this.routes.filter(r => r.isCheck)
            this.routes.forEach(item => {
                item.children = item.children.filter(i => i.isCheck)
                if (item.children && item.children.length) {
                    let num = item.children.length
                    item.children.forEach(sec => {
                        sec.children = sec.children.filter(s => s.isCheck)
                        if (sec.children && sec.children.length) {
                            num += sec.children.length
                        }
                    })
                    item.row = num
                } else {
                    item.row = 1
                }
            })
        },
        routeTableData() {
            this.routes.forEach(item => {
                if (item.children && item.children.length) {
                    item.children.forEach((sec, index) => {
                        const children = sec.children
                        sec.first = item.name
                        sec.second = sec.name
                        // status一级级选中状态 0 --未选中 1--选中但非全部操作权限 2--选中且有全部操作权限
                        sec.checked1 = false
                        sec.status1 = 0
                        // status二级选中状态 0 --未选中 1--选中但非全部操作权限 2--选中且有全部操作权限
                        sec.checked2 = false
                        sec.status2 = 0
                        if (!sec.btns.length && !children.length) {
                            // 二级菜单不存在按钮,且不存在子节点
                            sec.checked2 = !!sec.isCheck
                            sec.status2 = sec.isCheck ? 2 : 0
                        }
                        sec.id1 = item.id
                        sec.id2 = sec.id
                        if (index == 0) {
                            sec.rowSpan = item.row
                        }
                        // delete sec.children
                        this.routesData.push(sec)
                        if (children && children.length) {
                            children.forEach(thr => {
                                thr.id1 = item.id
                                thr.id2 = sec.id
                                thr.id3 = thr.id
                                thr.first = item.name
                                thr.second = sec.name
                                thr.third = thr.name
                                // status三级选中状态 0 --未选中 1--选中但非全部操作权限 2--选中且有全部操作权限
                                thr.checked3 = false
                                thr.status3 = 0
                                if (!thr.btns.length) {
                                    thr.checked3 = !!thr.isCheck
                                    thr.status3 = thr.isCheck ? 2 : 0
                                }
                                this.routesData.push(thr)
                            })
                        }
                    })
                } else {
                    item.first = item.name
                    item.id1 = item.id
                    item.second = ''
                    item.checked1 = !!item.isCheck
                    item.status1 = item.isCheck ? 2 : 0
                    item.rowSpan = item.row
                    this.routesData.push(item)
                }
            })
            this.routes.splice()
        },
        setCellClass(row, column, rowidx, colidx) {
            return 'mouse_enter_td'
        }
    }
}
</script>

<style type="text/css" lang="scss">
.role-drawer-show {
    width: 37.5% !important;
    .header-border {
        border-bottom: none !important;
        background-color: #ebf1f5 !important;
    }
    .el-table--enable-row-hover .el-table__body .el-table__row .column-style {
        background-color: #ebf1f5 !important;
    }
    .el-table--enable-row-hover .el-table__body tr:hover > td {
        background-color: rgba(0, 0, 0, 0) !important;
    }
    .el-table--enable-row-hover .el-table__body .mouse_enter_td:hover {
        background-color: #f5f7fa !important;
    }
}
</style>
<style lang="scss" scoped>
.add-role-form {
    display: flex;
    justify-content: center;
    .el-form-item {
        flex: 1;
        &:first-child {
            margin-right: 32px;
        }
        &:last-child {
            margin-right: 0;
        }
    }
}
.third_level {
    display: flex;
    .iconfont {
        color: rgb(220, 223, 231);
        font-size: 12px;
        padding-left: 4px;
        margin-top: -5px;
        margin-right: 5px;
    }
    .unchoosed {
        color: rgb(220, 223, 231);
    }
    .choosed {
        color: rgb(0, 82, 217);
    }
}
.btn-wrap {
    float: right;
}
</style>
