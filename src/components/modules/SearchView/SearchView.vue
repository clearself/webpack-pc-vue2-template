<template>
    <div class="ub search-view">
        <div v-for="(item, index) in list" :key="index"><span class="label">{{ item.label }}</span>： <span class="value">{{ item.value }}</span></div>
    </div>
</template>

<script>
export default {
    name: 'SearchView',
    props: {
        curData: {
            type: Object,
            default: null
        },
        fieldList: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        list: {
            get() {
                if (this.curData === null) return ''
                let arr = []
                for (let attr in this.curData) {
                    let obj = {}
                    let cur = this.fieldList.filter(item => item.value === attr)
                    if (cur.length > 0) {
                        obj.label = cur[0].label
                        if (cur[0].type === 'date') {
                            let time = this.curData[attr]
                            obj.value = time ? this.$getTime(new Date(this.curData[attr]).getTime(), '-', true) : ''
                        } else if (cur[0].type === 'select' || cur[0].type === 'radio-group') {
                            let options = cur[0].options
                            let _cur = options.filter(_item => _item.value === this.curData[attr])
                            if (_cur.length > 0) {
                                obj.value = _cur[0].label
                            } else {
                                obj.value = this.curData[attr]
                            }
                        } else {
                            obj.value = this.curData[attr]
                        }
                        arr.push(obj)
                    }
                }
                return arr
            }
        }
    },
    mounted() {
        this.departmentData = [
            {
                id: '1',
                name: '产品部1',
                children: [
                    {
                        id: '2',
                        name: '产品部2'
                    },
                    {
                        id: '3',
                        name: '产品部3'
                    },
                    {
                        id: '4',
                        name: '产品部4'
                    }
                ]
            }
        ]
        let labels = this.flatten(['1', '2'], this.departmentData)
        console.log(labels, 'labels')
    },
    methods: {

        flatten(ids, arr, children = 'children') {
            if (arr.length === 0) {
                return []
            }
            let oldArr = JSON.parse(JSON.stringify(arr)) // 对源数据深度克隆
            let newArr = []
            for (let i = 0; i < oldArr.length; i++) {
                if (oldArr[i][children]) { // childName存在
                    newArr.push(...this.flatten(ids, oldArr[i][children]))
                }
                if (ids.includes(oldArr[i].id)) {
                    let obj = {}
                    obj.id = oldArr[i].id
                    obj.name = oldArr[i].name
                    newArr.push({ ...obj })
                }
            }
            return newArr
        }
    }
}
</script>

<style lang="scss" scoped>
.search-view {
    width: 100%;
    font-size: 13px;
    >div {
        margin: 0 5px;
    }
    .label {
        color: #666666;
    }
    .value {
        color: #000000;
    }
}
</style>
