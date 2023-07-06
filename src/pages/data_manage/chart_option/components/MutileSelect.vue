<template>
    <div class="ub ub-ac list-item">
        <div class="ub ub-f1 ub-pj" style="font-size:12px;">
            <div>{{ elementName }}</div>
            <div>
                <i class="iconfont icon-right-arrow" v-if="type == 1" @click.stop="showOrHide"></i>
                <i class="iconfont icon-guanbi" @click="removeThis"></i>
            </div>
        </div>
        <div class="options-select" v-show="showMutile" v-if="type == 1">
            <div class="sel-item" @click.stop="pmFn">
                <div style="width: 100px;">聚合方式</div>
                <div>({{polymerizationMode.filter(p => p.value == juhe)[0] ? polymerizationMode.filter(p => p.value == juhe)[0].label : ''}})</div>
                <div class="iconfont icon-right-arrow"></div>
                <div class="right-sel" v-show="pmSHow">
                    <div class="rsel-item" v-for="(item, key) in polymerizationMode" :key="key" @click.stop="changePolymerizationMode(item)">
                        <div>{{item.label}}</div>
                        <div class="choosed" v-show="item.value == juhe"><i class="el-icon-check"></i></div>
                    </div>
                </div>
            </div>
            <div class="sel-item" v-if="element.code != 'dlz' && subType != 1" @click.stop="stFn">
                <div style="width: 100px;">排序</div>
                <div>({{sort.filter(p => p.value == sortValue)[0] ? sort.filter(p => p.value == sortValue)[0].label : ''}})</div>
                <div class="iconfont icon-right-arrow"></div>
                <div class="right-sel" v-show="stSHow">
                    <div class="rsel-item" v-for="(item, key) in sort" :key="key" @click.stop="changeSort(item)">
                        <div>{{item.label}}</div>
                        <div class="choosed" v-show="item.value == sortValue"><i class="el-icon-check"></i></div>
                    </div>
                </div>
            </div>
            <div class="sel-item" v-if="element.code != 'dlz' && subType != 1">
                <div>数量</div>
                <div class="input-num" @click.stop><el-input-number :controls="false" v-model="num" @change="returnObject" controls-position="right" :min="1"></el-input-number></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MutileSelect',
    props: {
        fieldName: {
            type: String,
            default: ''
        },
        type: {
            type: Number,
            default: 1
        },
        subType: {
            type: Number,
            default: 0
        },
        element: {
            type: Object,
            defalut: () => {}
        }
    },
    data() {
        return {
            showMutile: false,
            polymerizationMode: [
                {
                    value: 1,
                    label: '求和'
                },
                {
                    value: 2,
                    label: '平均数'
                },
                {
                    value: 3,
                    label: '中位数'
                },
                {
                    value: 4,
                    label: '计数'
                },
                {
                    value: 5,
                    label: '去重计数'
                },
                {
                    value: 6,
                    label: '最大值'
                },
                {
                    value: 7,
                    label: '最小值'
                }
            ],
            sort: [
                {
                    value: 'asc',
                    label: '升序'
                },
                {
                    value: 'desc',
                    label: '降序'
                },
                {
                    value: '',
                    label: '默认'
                }
            ],
            num: undefined,
            pmSHow: false,
            stSHow: false,
            juhe: 1,
            sortValue: ''
        }
    },
    watch: {
        element: {
            deep: true, // 深度监听
            handler(newVal, oldVal) {
                console.log(newVal)
            }
        }
    },
    computed: {
        elementName() {
            let name = ''
            if (this.type == 1) {
                const pm = this.polymerizationMode.filter(s => s.value == this.juhe)[0]
                name = `(${pm.label})${this.element.name}`
            } else if (this.type == 2) {
                name = this.element.name
            }
            return name
        }
    },
    mounted() {
        this.windowAddClick()
    },
    created() {
    },
    beforeDestroy() {
        this.windowRemoveClick()
    },
    methods: {
        pmFn() {
            this.stSHow = false
            this.pmSHow = !this.pmSHow
        },
        stFn() {
            this.pmSHow = false
            this.stSHow = !this.stSHow
        },
        showOrHide() {
            this.showMutile = !this.showMutile
        },
        hideAll() {
            this.showMutile = false
            this.pmSHow = false
        },
        windowAddClick() {
            let _this = this
            window.addEventListener('click', this.hideAll)
        },
        windowRemoveClick() {
            window.removeEventListener('click', this.hideAll)
        },
        changePolymerizationMode(pm) {
            console.log(pm)
            this.juhe = pm.value
            this.returnObject()
        },
        changeSort(st) {
            console.log(st)
            this.sortValue = st.value
            this.returnObject()
        },
        removeThis() {
            this.$emit('remove')
        },
        returnObject() {
            let obj = {
                juhe: this.juhe,
                sort: this.sortValue,
                num: this.num
            }
            this.$emit('change', obj)
        }
    }
}
</script>

<style scoped lang="scss">
.list-item {
    width: 180px;
    height: 28px;
    position: relative;
    border-radius: 4px;
    padding: 0 10px;
    .iconfont {
        cursor: pointer;
        font-size: 14px;
    }
    .icon-right-arrow {
        font-size: 16px;
        display: inline-block;
        transform: rotate(90deg);
        margin-right: 10px;
    }
    .icon-guanbi {
        display: inline-block;
        opacity: 0.5;
        &:hover {
            opacity: 1;
        }
    }
    .options-select {
        color: rgba(0, 0, 0, 0.6);
        position: absolute;
        top: 32px;
        font-size: 12px;
        left: 0;
        background-color: #fff;
        width: 180px;
        border-radius: 4px;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.15);
        z-index: 1;
        .sel-item {
            height: 32px;
            padding: 10px;
            display: flex;
            position: relative;
            justify-content: space-between;
            align-items: center;
            cursor: default;
            .icon-right-arrow {
                font-size: 16px;
                display: inline-block;
                transform: rotate(0deg);
                margin: 0;
            }
            .input-num {
                width: 80px;
                height: 24px;
                background: #ffffff;
                border-radius: 2px;
                .el-input-number {
                    width: 100%;
                    height: 100%;
                    ::v-deep .el-input {
                        width: 100%;
                        height: 100%;
                        line-height: 24px;
                        input {
                            height: 100%;
                            border-radius: 2px;
                            font-size: 12px;
                        }
                    }
                }
            }
            &:hover {
                background: #ecf2fe;
                color: #0052d9;
                .icon-right-arrow {
                    color: #0052d9;
                    font-size: 16px;
                    display: inline-block;
                    transform: rotate(0deg);
                    margin: 0;
                }
            }
            .right-sel {
                position: absolute;
                width: 180px;
                background-color: #fff;
                width: 180px;
                border-radius: 4px;
                box-shadow: 0 0 15px rgba(0, 0, 0, 0.15);
                left: 180px;
                top: 0;
                .rsel-item {
                    height: 32px;
                    line-height: 32px;
                    padding: 0 10px;
                    cursor: pointer;
                    color: rgba(0, 0, 0, 0.6);
                    display: flex;
                    justify-content: space-between;
                    .el-icon-check {
                       color: #0052d9;
                    }
                    &:hover {
                        color: #0052d9;
                    }
                }
            }
        }
    }
}
</style>
