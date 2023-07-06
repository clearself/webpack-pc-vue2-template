<template>
    <div class="project-search">
        <el-select
            ref="selectDom"
            style="width: 100%;"
            v-model="valId"
            :remote-method="remoteMethod"
            :loading="loading"
            remote
            :clearable="clearable"
            reserve-keyword
            :size="size"
            :filterable="filterable"
            placeholder="请搜索选择"
        >
            <el-option
                v-for="(item, index) in listData"
                :key="index"
                :label="item.name"
                :value="item.id"
            >
            </el-option>
        </el-select>
    </div>
</template>
<script>
import { get_org_fire_line } from '@/server/alarm/fire_line.js'
export default {
    name: 'OrgSearch',
    props: {
        value: {
            type: String,
            default: ''
        },
        name: {
            type: String,
            default: ''
        },
        clearable: {
            type: Boolean,
            default: true
        },
        filterable: {
            type: Boolean,
            default: true
        },
        size: {
            type: String,
            default: 'small'
        },
        type: {
            type: String,
            default: '',
            required: true
        }
    },
    mounted() {
        this.$nextTick(() => {
            if (this.name) {
                this.remoteMethod(this.name)
            }
        })
    },
    data() {
        return {
            loading: false,
            listData: []
        }
    },
    computed: {
        valId: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input', val)
            }
        }
    },
    methods: {
        remoteMethod(query) {
            if (query !== '') {
                this.loading = true
                let req = null
                switch (this.type) {
                    case '1':
                        req = get_org_fire_line
                        break
                    default:
                        req = get_org_fire_line
                        break
                }
                let data = {
                    queryData: {},
                    paramsData: {
                        devName: query
                    }
                }
                req(data).then((res) => {
                    this.loading = false
                    switch (this.type) {
                        case '1':
                            this.listData = res.filter((item) => {
                                return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1
                            })
                            break
                        default:
                            this.listData = res.filter((item) => {
                                return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1
                            })
                            break
                    }
                })
            } else {
                this.listData = []
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.project-search {
    width: 100%;
}
</style>
