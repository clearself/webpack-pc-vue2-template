<template>
    <div class="expert-left starWrapper" :class="{'left-fold': leftFold,'event-content':!leftFold}">
        <i class="fold iconfont icon-zhedie" @click="leftFold=!leftFold" style="color:rgba(0,0,0,0.4);margin-top:3px"></i>
        <div v-show="!leftFold">
            <div class="list-tips" style="margin-top:5px">筛选器</div>
            <ul class="w100" style="margin-top:20px;overflow-y:auto">
                <li v-for="item in listData" :key="item.id" :class="{'active':item.isActive}" class="ub ub-ac w100 li-item" @click="clickItem(item)">
                    <div class="title line-1">{{item.title}}</div>
                    <div class="close"  @click.stop="delItem(item)"><i class="el-icon-close"></i></div>
                </li>
            </ul>
        </div>
        <div v-if="!leftFold&&listData.length===0" class="ub ub-f1 ub-ac ub-pc no-data">
            暂无数据
        </div>
    </div>
</template>

<script>
export default {
    name: 'LeftFold',
    props: {
        list: {
            type: Array,
            default: null
        },
        currentId: {
            type: String,
            default: ''
        }
    },
    computed: {
        listData() {
            let arr = []
            if (this.list && this.list.length > 0) {
                arr = this.list.map(item => {
                    if (item.id === this.currentId) {
                        item.isActive = true
                    } else {
                        item.isActive = false
                    }
                    return item
                })
            }
            return arr
        }
    },
    data() {
        return {
            leftFold: false
        }
    },
    methods: {
        clickItem(item) {
            this.$emit('getCurParams', item)
        },
        delItem(item) {
            this.$emit('del', item)
        }
    }
}
</script>

<style lang="scss" scoped>
.expert-left {
    width: 140px;
    padding: 14px 10px;
    position: relative;
    box-shadow: 0px 0px 8px 0px
    rgba(140, 152, 164, 0.2);
    margin-right: 10px;
    transition: width .2s linear;
    position: relative;
    background-color: #ffffff;
    border-radius: 4px;
    border: solid 1px #dadee8;
    margin-bottom:19px;
    overflow-y: auto;
    i.fold {
        position: absolute;
        cursor: pointer;
        color: rgba(255,255,255,.6);
        right: 12px;
        top: 22px;
        z-index: 99;
        font-size: 12px;
    }
    .no-data {
        height: calc(100vh - 200px);
        color:#909399;
        font-size:13px;
    }
}
.expert-left.left-fold {
    width: 10px;
    transition: width .2s linear;

    i.fold {
        right: 5px;
        transform: rotate(180deg);
    }

}
.list-tips{
    overflow: hidden;
}
.li-item{
    padding:5px;
    box-sizing: border-box;
    height: 24px;
    background-color: #fff;
    border-radius: 2px;
    border: solid 1px #dcdcdc;
    margin-bottom:10px;
    cursor: pointer;
    border-radius: 3px;
    .title{
        width:87px;
        font-size: 12px;
        color: rgba(0,0,0,0.4);
    }
    .close{
        margin-left:5px;
        i{
            color: rgba(0,0,0,0.4);
            font-size:12px;
            cursor: pointer;
            line-height:24px;
        }
    }
    &:hover{
         .title{
            color:#0052d9;
        }
        .close{
            i{
                color:#0052d9;
            }
        }
    }
    &.active{
        background-color:#387dee;
        border:none;
         .title{
            color:#fff;
        }
        .close{
            i{
                color:#fff;
            }
        }
    }
}
</style>
