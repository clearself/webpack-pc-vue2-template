<template>
    <div class="wrapper">
        <el-form
            ref="alarmForm"
            label-width="120px"
            label-position="top">
            <!-- <el-form-item v-if="source.type === 10" :label="source.label+':'">
                <el-input
                    class="w700 send_num"
                    size="small"
                    v-model.number="source.value"
                    oninput ="value=value.replace(/[^0-9.]/g,'')"
                    placeholder="请输入次数"
                    clearable></el-input>
            </el-form-item> -->
            <el-form-item v-if="source.type === 1 || source.type === 2 || source.type === 4" :label="source.label+':'">
                <el-input
                    size="small"
                    class="w700 target_ip"
                    v-model="source.value"
                    placeholder="请输入"
                    clearable></el-input>
            </el-form-item>

            <el-form-item v-if="source.type ===3" :label="source.label+':'">
                <el-date-picker
                    style="width:500px"
                    size="small"
                    class="w700 warning_time"
                    v-model="source.value"
                    type="datetime"
                    value-format="timestamp"
                    :picker-options="pickerOptions"
                    placeholder="请选择">
                </el-date-picker>
            </el-form-item>
            <el-form-item v-if="source.type ===5" :label="source.label+':'">
                <el-select clearable v-model="source.value" size="small" class="w700" placeholder="请选择">
                    <el-option v-for="(item, index) in source.options" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: 'Item',
    data() {
        return {
            // 日期选择器
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now()
                }
            }
        }
    },
    props: {
        index: { // 每一行的索引
            type: Number
        },
        source: { // 每一行的内容
            type: Object,
            default() {
                return {}
            }
        }
    }
}
</script>

<style scoped lang="scss">
.wrapper {
    /* padding: 0 20px; */
    width:500px;
    margin-right:20px;
    ::v-deep .el-input__suffix{
        top:-3px !important;
    }
    ::v-deep .el-date-editor--datetime{
        .el-input__prefix{
            top:-4px !important;
        }
    }
    ::v-deep .el-form-item{
        margin-bottom:16px !important;
    }
}
.w700 {
    width: 500px;
}
</style>
