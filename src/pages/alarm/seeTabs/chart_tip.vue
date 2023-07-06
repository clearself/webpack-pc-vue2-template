<template>
    <div class="echart-tip" :style="styleObj" @click.stop>
        <el-button size="mini" type="text" @click="selectVal('A')">A级区域</el-button>
        <el-button size="mini" type="text" @click="selectVal('B')">B级区域</el-button>
    </div>
</template>

<script>
import {
    change_status
} from '@/server/alarm/fire_line.js'
export default {
    name: 'EchartTip',
    props: {
        styleObj: {
            type: Object,
            default: () => {}
        },
        curData: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {}
    },
    methods: {
        selectVal(val) {
            console.log(this.curData, 'curData')

            let data = {
                queryData: {},
                paramsData: {
                    alarmId: this.curData.id,
                    emergency: val
                }
            }
            change_status(data).then(res => {
                if (document.getElementsByClassName('echart-tip').length > 0) {
                    let curNode = document.getElementsByClassName('echart-tip')[0]
                    let parentNode = curNode.parentNode
                    parentNode.parentNode && parentNode.parentNode.removeChild(parentNode)
                }
                // 刷新极限图
                this.$store.dispatch('analysis/refreshPolar')
            }).catch(error => {
                console.log('error' + error)
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.echart-tip {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999999;
    overflow: hidden;
    width: 0;
    height: 0;
    border-radius: 10px;
    text-align: center;
    background-color: rgb(0 0 0 / 50%);
    opacity: 0;
    line-height: 50px;
    transform-origin: center;
    transform: translateZ(-50px);
    transform-style: preserve-3d;
    animation: fadeIn 0.3s ease-in-out forwards;
    .el-button {
        color: #ffffff;
    }
}
@keyframes fadeIn {
    0% {
        width: 0;
        height: 0;
        opacity: 0;
        transform: translateZ(-50px);
    }
    100% {
        width: 120px;
        height: 50px;
        opacity: 1;
        transform: translateZ(0);
    }
}
</style>
