<template>
    <div class="wrapper">
        <x-form ref="xForm" v-model="formData" :config="formConfig">
            <template #timeObj>
                <div class="time">
                    <div class="label"><span style="color:red">*</span>延时：</div>
                    <div class="ub">
                        <el-input :disabled="disabled" class="custom-input" style="width: 200px;" size="mini" v-model="timeNum" placeholder="请输入"></el-input>
                        <el-select :disabled="disabled" class="custom-select" style="width: 80px;" size="mini" v-model="unit" placeholder="请选择">
                            <el-option
                                v-for="(item,index ) in unitList"
                                :key="index"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <span class="hint" v-show="!timeNum">请输入延时时间</span>
                </div>
                <div class="describe">
                    <div class="label">描述：</div>
                    <el-input
                        :disabled="disabled"
                        type="textarea"
                        :rows="2"
                        placeholder="请输入"
                        v-model="describe">
                    </el-input>
                </div>
            </template>
        </x-form>>
    </div>
</template>

<script>
import mixinPanel from '../../common/mixinPanel'
import mixinXcrud from '../../common/mixinXcrud'
export default {
    mixins: [mixinPanel, mixinXcrud],
    props: {
        disabled: {
            type: Boolean,
            default: true
        },
        users: {
            type: Array,
            required: true
        },
        groups: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            describe: '',
            timeNum: '',
            unit: '1',
            unitList: [
                {
                    id: '1',
                    name: '天'
                },
                {
                    id: '2',
                    name: '小时'
                },
                {
                    id: '3',
                    name: '分钟'
                },
                {
                    id: '4',
                    name: '秒'
                }
            ],
            formData: {}
        }
    },
    watch: {
        describe: function(val, oldVal) {
            if (val === '') val = ''
            let documentation = JSON.parse(this.formData.documentation)
            documentation.describe = val || ''
            this.formData.documentation = JSON.stringify(documentation)
            this.updateProperties({ 'camunda:describe': val })
        },
        timeNum: function(val, oldVal) {
            if (val === '') val = ''
            let documentation = JSON.parse(this.formData.documentation)
            documentation.timeNum = val || ''
            this.formData.documentation = JSON.stringify(documentation)
            this.updateProperties({ 'camunda:timeNum': val })
        },
        unit: {
            deep: true,
            handler(newValue, oldValue) {
                let documentation = JSON.parse(this.formData.documentation)
                documentation.unit = newValue || '1'
                this.formData.documentation = JSON.stringify(documentation)
                this.updateProperties({ 'camunda:unit': newValue })
            }
        }
    },
    mounted() {},
    created() {
        const cache = {
            ...this.element.businessObject,
            ...this.element.businessObject.$attrs
        }

        // 移除camunda前缀，格式化数组
        for (const key in cache) {
            if (key.indexOf('camunda:') === 0) {
                const newKey = key.replace('camunda:', '')
                cache[newKey] = cache[key]
                delete cache[key]
            }
        }
        console.log('cache', cache)
        let documentation = {
            id: cache.id,
            describe: cache.describe ? cache.describe : '',
            timeNum: cache.timeNum ? cache.timeNum : '',
            unit: cache.unit ? cache.unit : this.unit
        }
        cache.documentation = JSON.stringify(documentation)
        this.formData = cache
        this.describe = cache.describe ? cache.describe : ''
        this.timeNum = cache.timeNum ? cache.timeNum : ''
        this.unit = cache.unit ? cache.unit : '1'
        // console.log('自动节点', JSON.stringify(documentation))
    },
    computed: {
        formConfig() {
            const _this = this
            return {
                inline: false,
                labelPosition: 'top',
                item: [
                    {
                        xType: 'input',
                        name: 'name',
                        label: '节点名称',
                        size: 'mini',
                        disabled: _this.disabled
                    },
                    {
                        slot: 'timeObj'
                    }
                ]
            }
        }
    },
    methods: {

    }
}
</script>

<style scoped lang="scss">
.wrapper {
    .label {
            line-height: 20px;
            font-size: 12px;
            color: rgba(0,0,0,0.90);
            margin-bottom: 8px;
    }
    .time {
        margin-bottom: 16px;
        .hint {
            color:red;
            font-size: 12px;
        }

    }
}
.wrapper .custom-input ::v-deep .el-input__inner {
    border-radius: 4px 0 0 4px;
}
.wrapper .custom-select ::v-deep .el-input__inner {
    border-radius: 0 4px 4px 0;
    color: #0052D9;
}
</style>
