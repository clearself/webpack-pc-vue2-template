<template>
    <div class="list">
        <div class="list-container" style="height: 100%;">
            <div class="attendance-list" style="margin-top: 0px; min-height: 96%"> <!--临时加margin-->
                <div class="ub ub-pj">
                    <div class="list-tips">工作纪律规范
                        <!-- <div class="back-btn" style="display: inline-block;font-size:12px;color:#387dee;cursor: pointer;margin-left: 20px;" @click="$router.go(-1)"><i style="margin-right: 6px;" class="fa fa-mail-reply" aria-hidden="true"></i>返回</div> -->
                    </div>
                    <div class="ub">
                        <el-button icon="iconfont icon-fanhui" size="small" @click="$router.go(-1)">返回</el-button>
                    </div>
                    <!-- <div class="back-btn">
                                    <span style="display: inline-block;font-size:12px;color:#01E9FF;cursor: pointer;margin-left: 12px;"
                            @click="$router.go(-1)"
                            class="fa fa-mail-reply" aria-hidden="true">返回</span>
                            </div>

                        </div> -->
                </div>
                <div class="showArea" style="height: calc(100vh - 170px)" v-html="discipline"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'RuleDetail',
    data() {
        return {
            discipline: '1'
        }
    },
    mounted() {
        // console.log(this.$route.query)
        this.$nextTick(() => {
            this.discipline = this.$route.query.discipline
        })
    }
}
</script>

<style lang="scss" scoped>
    .showArea {
        margin-top: 20px;
        overflow-y: scroll;
    }
</style>
