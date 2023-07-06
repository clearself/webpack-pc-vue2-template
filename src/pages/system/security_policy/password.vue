<template>
    <div class="container">
        <div class="ub ub-ac">
            <!-- <span class="text" style="margin-right:8px">弱</span> -->
            <div class="cell">
                <div :class="setColor(strength)"></div>
            </div>
            <span class="text" :class="setTextColor(strength)" style="margin-left:8px">{{ getText(strength) }}</span>
        </div>

    </div>
</template>

<script>
export default {
    props: ['strength'],
    data() {
        return {
        }
    },
    methods: {
        getText(val) {
            switch (val) {
                case 0:
                    return ''
                    // eslint-disable-next-line no-unreachable
                    break
                case 1:
                    return '弱'
                    // eslint-disable-next-line no-unreachable
                    break
                case 2:
                    return '中'
                    // eslint-disable-next-line no-unreachable
                    break
                case 3:
                    return '强'
                    // eslint-disable-next-line no-unreachable
                    break

                default:

                    break
            }
        },
        setTextColor(val) {
            switch (val) {
                case 0:
                    return 'text-color-zero'
                    // eslint-disable-next-line no-unreachable
                    break
                case 1:
                    return 'text-color-one'
                    // eslint-disable-next-line no-unreachable
                    break
                case 2:
                    return 'text-color-two'
                    // eslint-disable-next-line no-unreachable
                    break
                case 3:
                    return 'text-color-three'
                    // eslint-disable-next-line no-unreachable
                    break

                default:

                    break
            }
        },
        setColor(val) {
            switch (val) {
                case 0:
                    return 'cell-bg-zero'
                    // eslint-disable-next-line no-unreachable
                    break
                case 1:
                    return 'cell-bg-one'
                    // eslint-disable-next-line no-unreachable
                    break
                case 2:
                    return 'cell-bg-two'
                    // eslint-disable-next-line no-unreachable
                    break
                case 3:
                    return 'cell-bg-three'
                    // eslint-disable-next-line no-unreachable
                    break

                default:

                    break
            }
        }

    },
    watch: {
    }
}
</script>

<style scoped lang="scss">
    .container {
        .cell {
            width: 90px;
            height: 10px;
            background-color: #eee;
            position: relative;
        }
        .cell-bg-zero {
            position: absolute;
            width: 90px;
            height: 10px;
            background-color: #eee;
        }
        .cell-bg-one {
            position: absolute;
            width: 30px;
            height: 10px;
            background-image: url('../../../assets/img/system/strength.png');
            background-repeat: no-repeat;
            overflow: hidden;
        }
        .cell-bg-two {
            position: absolute;
            width: 60px;
            height: 10px;
            background-image: url('../../../assets/img/system/strength.png');
            background-repeat: no-repeat;
            overflow: hidden;
            transition: all 0.5s;
        }
        .cell-bg-three {
            position: absolute;
            width: 90px;
            height: 10px;
            background-image: url('../../../assets/img/system/strength.png');
            background-repeat: no-repeat;
            overflow: hidden;
            transition: all 0.5s;
        }
        .text {
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #48c79c;
            line-height: 20px;
        }
        .text-color-zero {
            color: #48c79c;
        }
        .text-color-one {
            color: #48c79c;
        }
        .text-color-two {
            color: #f7c797;
        }
        .text-color-three {
            color: #e34d59;
        }
    }
</style>
