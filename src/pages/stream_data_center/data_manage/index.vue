<template>
    <div class="wrapper new-search">
        <!-- <div class="ub tab-button">
            <div @click="currentTab = 'General'" :class="{'tab-active': currentTab === 'General'}">综合查询</div>
        </div> -->
        <!--<keep-alive>-->
        <component :is="currentTab"></component>
        <!--</keep-alive>-->
    </div>
</template>

<script>
import General from '@/pages/stream_data_center/data_manage/General'
export default {
    name: 'FlowDataManage',
    components: {
        General
    },
    data() {
        return {
            currentTab: 'General'
        }
    }
}
</script>

<style lang="scss" scoped>
.wrapper {
    overflow-y: hidden;
}
.tab-button {
    height: 30px;
    background-color: rgba(19,109,172,.2);
    margin-bottom: 2px;

    & div {
        width: 80px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        margin-right: 10px;
        cursor: pointer;
        border: 1px solid #76dee2;
        border-radius: 2px;
        background: url("../../../assets/img/tab_btn.jpg") 100% 100% no-repeat;
        color: #fff;
        box-sizing: border-box;
        font-size: 14px;

        &.tab-active {
            background: url("../../../assets/img/tab_active.jpg") 100% 100% no-repeat;
        }
    }
}
</style>
<style>
.add-search.el-popover{
    background: #033254;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.59) inset;
    border: solid 1px #1a5c92;
    color: #fff;
}
.new-search .el-loading-spinner {
    top: 100px;
}
</style>
