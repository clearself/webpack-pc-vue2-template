<template>
    <div class="wrapper new-search">
        <component :is="currentTab"></component>
    </div>
</template>

<script>
import General from '@/pages/alarm_log/new_search/General'
export default {
    name: 'Index',
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
    height: 32px;
    background-color: #fff;
    border: 1px solid #dadee8;
    border-radius: 4px 4px 0 0;

    // margin-bottom: 2px;

    & div {
        width: 80px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        margin-right: 10px;
        cursor: pointer;
        // border: 1px solid #76dee2;
        border-radius: 2px;
        // background: url("../../../assets/img/tab_btn.jpg") 100% 100% no-repeat;
        color: rgba(0,0,0,0.6);
        box-sizing: border-box;
        font-size: 14px;

        &.tab-active {
            color: #387dee;
            border-bottom: 1px solid #387dee;
            // background: url("../../../assets/img/tab_active.jpg") 100% 100% no-repeat;
        }
    }
}
</style>
<style lang="scss">
.add-search.el-popover{
    background: #fff;
    // box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.59) inset;
    // border: solid 1px #1a5c92;
    color: rgba(0,0,0,0.9);
    .icon-liebiaonei-anquan {
        color: #00ff48;
    }
    .icon-liebiaonei-buanquan {
        color: #ff0000;
    }
    .icon-liebiaonei-weizhi {
        color: #000000;
    }
}
.new-search .el-loading-spinner {
    top: 100px;
}
</style>
