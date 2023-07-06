<template>
    <!-- 自定义树形穿梭框组件、理论上左右均可选择是否为树形结构，目前固定为左侧树形、右侧无层级结构 -->
    <div class="tree-transfer">
        <!-- 穿梭框左侧 -->
        <div class="tree-transfer-left">
            <!-- 左侧采用element-ui的el-tree -->
            <div class="checkall">
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            </div>
            <el-input class="input-left" placeholder="输入关键字进行过滤" v-model="filterTextLeft"></el-input>
            <el-tree ref="treeLeft" :data="dataLeft" show-checkbox node-key="id" :props="defaultProps" @check="changeLeft" :filter-node-method="filterNode">
                <span class="custom-tree-node ub ub-pj" style="width: 100%" slot-scope="{ node }">
                    <span class="node-label" style="color:rgba(0, 0, 0, 0.9); font-size: 12px;margin-right:10px">{{ node.label }}</span>
                </span>
            </el-tree>
        </div>
        <!-- 穿梭框中间按钮区域 -->
        <div class="tree-transfer-middle">
            <i class="iconfont icon-right-arrow" @click="add"></i>
            <i class="iconfont icon-right-arrow rotate" @click="remove"></i>
        </div>
        <!-- 穿梭框右侧 -->
        <div class="tree-transfer-right">
            <!-- 右侧直接放置结果 -->
            <!-- 这里也采用tree结构，默认是对数据进行处理使得没有树形结构，也可以选择有树形结构 -->
            <div class="checkall">
                <el-checkbox :indeterminate="isIndeterminateRight" v-model="checkAllRight" @change="handleCheckAllChangeRight">全选</el-checkbox>
            </div>
            <el-tree ref="treeRight" :data="dataRight" show-checkbox node-key="id" :props="defaultProps" @check="changeRight">
                <span class="custom-tree-node ub ub-pj" style="width: 100%" slot-scope="{ node, data }">
                    <span class="node-label" style="color:rgba(0, 0, 0, 0.9); font-size: 12px;margin-right:10px">{{ node.label }}</span>
                    <span style="color:rgba(0, 0, 0, 0.4); font-size: 12px;padding-right: 10px;">{{ data.pName }}</span>
                </span>
            </el-tree>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TreeTransfer',
    props: ['datas', 'defaultProps', 'dataRights'],
    data() {
        return {
            yuansiData: [],
            dataLeft: [],
            dataRight: [],
            filterTextLeft: '',
            checkAll: false,
            isIndeterminate: false,
            isIndeterminateRight: false,
            checkAllRight: false
        }
    },
    watch: {
        filterTextLeft(val) {
            this.$refs.treeLeft.filter(val)
        }
    },
    computed: {
        allLength() {
            let num = 0
            this.dataLeft.forEach(item => {
                num++
                if (item.parameterInfoList && item.parameterInfoList.length) {
                    item.parameterInfoList.forEach(c => {
                        num++
                    })
                }
            })
            return num
        },
        allLengthRight() {
            let num = 0
            this.dataRight.forEach(item => {
                num++
                if (item.parameterInfoList && item.parameterInfoList.length) {
                    item.parameterInfoList.forEach(c => {
                        num++
                    })
                }
            })
            return num
        }
    },
    mounted() {
        let data = this.$lodash.cloneDeep(this.datas)
        this.setParent(data)
        this.dataLeft = data
        this.dataRight = this.$lodash.cloneDeep(this.dataRights)
        this.yuansiData = this.$lodash.cloneDeep(data)
    },
    methods: {
        changeLeft() {
            let length = this.$refs.treeLeft.getCheckedNodes().length
            if (length) {
                this.isIndeterminate = true
                if (length == this.allLength) {
                    this.checkAll = true
                    this.isIndeterminate = false
                } else {
                    this.checkAll = false
                }
            } else {
                this.isIndeterminate = false
                this.checkAll = false
            }
            console.log(this.checkAll, this.isIndeterminate)
        },
        changeRight() {
            let length = this.$refs.treeRight.getCheckedNodes().length
            if (length) {
                this.isIndeterminateRight = true
                if (length == this.allLengthRight) {
                    this.checkAllRight = true
                    this.isIndeterminateRight = false
                } else {
                    this.checkAllRight = false
                }
            } else {
                this.isIndeterminateRight = false
                this.checkAllRight = false
            }
        },
        handleCheckAllChange() {
            console.log(this.checkAll)
            if (this.checkAll) {
                let arr = []
                this.dataLeft.forEach(item => {
                    arr.push(item)
                    if (item.parameterInfoList && item.parameterInfoList.length) {
                        item.parameterInfoList.forEach(c => {
                            arr.push(c)
                        })
                    }
                })
                console.log(arr)
                this.$refs.treeLeft.setCheckedNodes(arr)
            } else {
                this.$refs.treeLeft.setCheckedNodes([])
            }
            this.isIndeterminate = false
        },
        handleCheckAllChangeRight() {
            if (this.checkAllRight) {
                let arr = []
                this.dataRight.forEach(item => {
                    arr.push(item)
                    if (item.parameterInfoList && item.parameterInfoList.length) {
                        item.parameterInfoList.forEach(c => {
                            arr.push(c)
                        })
                    }
                })
                console.log(arr)
                this.$refs.treeRight.setCheckedNodes(arr)
            } else {
                this.$refs.treeRight.setCheckedNodes([])
            }
            this.isIndeterminateRight = false
        },
        filterNode(value, data) {
            if (!value) return true
            return data.name.indexOf(value) !== -1
        },
        setParent(data) {
            data.forEach(item => {
                let pName = item.name
                let pId = item.id
                if (item.parameterInfoList && item.parameterInfoList.length) {
                    console.log(item)
                    item.parameterInfoList.forEach(c => {
                        c.pId = pId
                        c.pName = pName
                    })
                    this.setParent(item.parameterInfoList)
                }
            })
        },
        add() {
            // 定义一个递归过滤的方法，用来删掉父级中给的元素
            // 获取所有选中的项并且去掉父级
            let list = this.$refs.treeLeft.getCheckedNodes()
            // 走原始数据中删掉已经选择的
            // 1.父级的删除
            const parList = list.filter(item => {
                return item.parameterInfoList
            })
            for (let item1 of parList) {
                let index = this.dataLeft.findIndex(item2 => {
                    return item2.id == item1.id
                })
                if (index >= 0) {
                    this.dataLeft.splice(index, 1)
                }
            }
            // 2.子级的删除
            list = list.filter(item => {
                return !item.parameterInfoList
            })
            // 这里做了三重循环，如果有可能需要对其进行优化
            for (let item of list) {
                for (let ind in this.dataLeft) {
                    if (this.dataLeft[ind].parameterInfoList.length) {
                        let index = this.dataLeft[ind].parameterInfoList.findIndex(item2 => {
                            return item2.id == item.id
                        })
                        if (index >= 0) {
                            this.dataLeft[ind].parameterInfoList.splice(index, 1)
                        }
                    }
                }
            }
            this.$refs.treeLeft.setCheckedNodes([])
            // 将选择的项添加到右侧
            this.dataRight.push(...list)
            this.changeLeft()
            this.changeRight()
        },
        remove() {
            // 从右侧移除时的方法
            // 1.从右侧删除选中的数据
            let list = this.$refs.treeRight.getCheckedNodes()
            for (let item of list) {
                let index = this.dataRight.findIndex(item2 => {
                    return item.id == item2.id
                })
                if (index >= 0) {
                    this.dataRight.splice(index, 1)
                }
            }
            // 2.把右侧删除的数据添加给左侧,但是要注意父级的问题
            this.dataLeft = JSON.parse(JSON.stringify(this.yuansiData))
            for (let index in this.dataLeft) {
                // 如果有子级去删除子级
                for (let item of this.dataRight) {
                    let ind = this.dataLeft[index].parameterInfoList.findIndex(item2 => {
                        return item2.id == item.id
                    })
                    if (ind >= 0) {
                        this.dataLeft[index].parameterInfoList.splice(ind, 1)
                    }
                }
                this.dataLeft = this.dataLeft.filter(item2 => {
                    return item2.parameterInfoList.length != 0
                })
            }
            this.changeLeft()
            this.changeRight()
        },
        getResult() {
            return this.dataRight
        }
    }
}
</script>

<style scoped lang="scss">
.tree-transfer {
    display: flex;
    min-height: 250px;
    .tree-transfer-left {
        width: 320px;
        background: #ffffff;
        border: 1px solid rgba(221, 221, 221, 1);
        border-radius: 4px;
        .input-left {
            ::v-deep .el-input__inner {
                height: 32px;
                background: #ffffff;
                border-top: none;
                border-left: none;
                border-right: none;
                border-bottom: 1px solid rgba(220, 220, 220, 1);
                border-radius: 2px;
                font-size: 12px;
            }
        }
    }
    .checkall {
        width: 100%;
        padding-left: 10px;
        height: 32px;
        line-height: 32px;
        background: #EBF1F5;
        border-bottom: 1px solid rgba(221,221,221,1);
        border-radius: 4px 4px 0px 0px;
        font-size: 12px;
    }
    .tree-transfer-middle {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 40px;
        .rotate {
            transform: rotate(180deg);
        }
        i {
            display: block;
            cursor: pointer;
            font-size: 18px;
        }
    }
    .tree-transfer-right {
        width: 320px;
        background: #ffffff;
        border: 1px solid rgba(221, 221, 221, 1);
        border-radius: 4px;
    }
}
</style>
