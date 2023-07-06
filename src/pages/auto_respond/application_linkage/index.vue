<template>
    <div class="list ub mb-1">
        <div class="left mr-1">
            <div class="ub ub-pj w100 ub-ac mt-2 mb-1">
                <div class="list-tips ml-1">分组列表</div>
            </div>
            <el-tree
                class="tree-line"
                ref="tree"
                node-key="id"
                :filter-node-method="filterNode"
                :default-expand-all="true"
                :highlight-current="true"
                :data="treeData"
                :props='propsData'
                :expand-on-click-node="false"
                :indent='indent'>
                <span class="custom-tree-node" slot-scope="{ node, data }" @mouseenter="mouseenter(data)" @mouseleave="mouseleave(data)">
                    <span @click="handleNodeClick(data)" class="node-label" style="color:rgba(0, 0, 0, 0.9); font-size: 12px;margin-right:10px">{{
                        node.label
                    }}</span>
                </span>
            </el-tree>
        </div>
        <div class="right">
            <div class="ub ub-pj ub-wrap">
                <div class="box mb-1" v-for="item in tableData" :key="item.facilityType" @click="handleDetail(item)">
                    <div class="header ub ub-pj ub-ac">
                        <div class="title">{{item.name}}</div>
                        <div class="time">更新：{{item.updateTime?item.updateTime.slice(0,10):''}}</div>
                    </div>
                    <div class="cont mt-2">
                        <div class="ub ub-ac ml-1">
                            <div class="list-tips label">设备名称：</div>
                            <div class="value line-1">{{item.facilitys.length>0?item.facilitys.map(item=>{return item.facilityName}).join(','):'--'}}</div>
                        </div>
                        <div class="ub ub-ac" style="margin:2px 0 15px 10px;">
                            <!-- <div class="list-tips label">内容描述：</div>
                            <div class="value1 line-1">启明启明启明启明启明启明启明启明启明启明启明启明启明启明启明启明启明启明启明启明启明启明启明启明启明启明启明启明启明启明启明启明启明启明启明启明启明启明</div> -->
                        </div>
                        <div class="line mb-2"></div>
                        <div class="ub ub-as ml-1">
                            <div class="list-tips label">动作名称：</div>
                            <div class="ub ub-ps ub-wrap" style="width:85%;height:84px;overflow: hidden;">
                                <div class="action mr-1" v-for="cont in item.actions" :key="cont.id">{{cont.name}}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { getAllManufacturer, getFacilityList } from '@/server/auto_respond/application_linkage.js'
export default {
    data() {
        return {
            treeData: [],
            propsData: {
                id: 'id',
                children: 'sub',
                label: 'name'
            },
            indent: 10,
            depId: '',
            tableData: []
        }
    },
    created() {
        this.get_getAllManufacturer()
        this.get_data()
    },
    methods: {
        handleDetail(item) {
            console.log(item)
            this.$router.push({ name: 'application_detail', params: { ...item }})
        },
        filterNode(value, data) {
            if (!value) return true
            return data.name.indexOf(value) !== -1
        },
        mouseenter(data) {
            this.$set(data, 'show', true)
        },
        mouseleave(data) {
            this.$set(data, 'show', false)
        },
        handleNodeClick(node) {
            console.log(node)
            this.depId = node.id
            this.get_data()
        },
        get_data() {
            let data = {
                queryData: {},
                paramsData: {
                    id: this.depId
                }
            }
            this.tableData = []
            getFacilityList(data).then(res => {
                this.tableData = res
            }).catch(err => {
                console.log(err)
            })
        },
        get_getAllManufacturer() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            getAllManufacturer(data).then(res => {
                this.treeData = [{ name: res.name, id: '', sub: res.manufacturers }]
            }).catch(err => {
                console.log(err)
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.left{
    width:200px;
    background: #FFFFFF;
    border: 1px solid rgba(218,222,232,1);
    box-shadow: 0px 0px 8px 0px rgba(140,152,164,0.2);
    border-radius: 4px;
}
.right{
    width:calc(100% - 200px);
    // width:100%;
    height:100%;
    overflow-y: auto;
    // background:#fff;
    // border: 1px solid rgba(218,222,232,1);
    border-radius: 4px;
    .box{
        width:49.6%;
        // width:720px;
        height:235px;
        background: #FFFFFF;
        border: 1px solid rgba(218,222,232,1);
        box-shadow: 0px 0px 8px 0px rgba(140,152,164,0.2);
        border-radius: 4px;
        cursor: pointer;
    }
    .header{
        height:40px;
        background: url('../../../assets/img/zidonghuadingbu.png') repeat;
        background-size: cover;
        padding:0 10px;
        .title{
            font-size: 16px;
            font-weight: 600;
        }
        .time{
            font-size:12px;
            color:rgba(0,0,0,.4);
        }
    }
    .cont{
        .label{
            font-size:12px;
        }
        .value{
            width:85%;
            font-size: 12px;
            color: #0052D9;
        }
        .value1{
            width:85%;
            font-size: 12px;
            color: rgba(0,0,0,0.40);
        }
        .line{
            border: 1px dashed rgba(231,231,231,1);
        }
        .action{
            min-width:92px;
            height:18px;
            background: #0037FF;
            border-radius: 9px;
            font-size: 12px;
            color:#fff;
            text-align: center;
            padding:0 10px;
            margin-bottom:10px;
            line-height:18px;
        }
    }
}
</style>
<style>
.custom-tree-node span:hover {
    color: #0052d9 !important;
}

.el-tree-node__content {
    background-color: rgba(0, 0, 0, 0) !important;
    color: #0052d9;
}

/*高亮当前点击项*/
.el-tree-node__content:hover,
  .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content .custom-tree-node .node-label {
    background: none !important;
    color: #0052d9 !important;
  }
</style>
