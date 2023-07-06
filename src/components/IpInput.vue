<template>
    <div class="ip-box">
        <el-input
            v-model.number="ip1"
            name="ip"
            maxlength="3"
            onkeyup="value=value.replace(/[^\d]/g,'')"
            @keyup.native="keyupEvent(1, $event)"
            @blur="submitIp"
            @input="val => checkVal(val, 'ip1')"
            ref="ip1"
            class="ip1"
        ></el-input>
        <div class="ip-dot"></div>
        <el-input
            v-model.number="ip2"
            name="ip"
            maxlength="3"
            onkeyup="value=value.replace(/[^\d]/g,'')"
            @keyup.native="keyupEvent(2, $event)"
            @blur="submitIp"
            @input="val => checkVal(val, 'ip2')"
            ref="ip2"
            class="ip2"
        ></el-input>
        <div class="ip-dot"></div>
        <el-input
            v-model.number="ip3"
            name="ip"
            maxlength="3"
            onkeyup="value=value.replace(/[^\d]/g,'')"
            @keyup.native="keyupEvent(3, $event)"
            @blur="submitIp"
            @input="val => checkVal(val, 'ip3')"
            ref="ip3"
            class="ip3"
        ></el-input>
        <div class="ip-dot"></div>
        <el-input
            v-model.number="ip4"
            name="ip"
            maxlength="3"
            onkeyup="value=value.replace(/[^\d]/g,'')"
            @keyup.native="keyupEvent(4, $event)"
            @blur="submitIp"
            @input="val => checkVal(val, 'ip4')"
            ref="ip4"
            class="ip4"
        ></el-input>
        <i class="el-icon-circle-close" @click="clearValue"></i>
    </div>
</template>
<script>
export default {
    name: 'IpInput',
    data() {
        return {
            ip1: null,
            ip2: null,
            ip3: null,
            ip4: null
        }
    },
    props: ['defaultIp'], // 耦合那种填写ip提交后再次打开网页可以看到之前填写的值（需要后端配合）
    created() {
        if (this.defaultIp) {
            let ipList = this.defaultIp.split('.')
            this.ip1 = ipList[0]
            this.ip2 = ipList[1]
            this.ip3 = ipList[2]
            this.ip4 = ipList[3]
        }
    },
    computed: {
        isRightVal() {
            // 判断填入的四个ip值是否为数字，只有有一个为非数字则为true
            let reg = /[^\d]/g
            return reg.test(this.ip1) || reg.test(this.ip2) || reg.test(this.ip3) || reg.test(this.ip4)
        }
    },
    methods: {
        clearValue() {
            // 重置ip输入框
            this.ip1 = null
            this.ip2 = null
            this.ip3 = null
            this.ip4 = null
            this.$emit('getIpVal', '') // 清除输入框传空值
        },
        submitIp() {
            // 失去焦点判断值是否输入完整，并向父组件传整个ip值
            console.log(this.ip1, this.ip2, this.ip3, this.ip4)
            if (this.ip1 && this.ip2 != null && this.ip3 != null && this.ip4 != null) {
                if (this.isRightVal) {
                    // 这里也可以加个提示框之类的提示用户
                    this.$message('请输入正确ip地址')
                    this.clearValue()
                } else {
                    let ipVal = this.ip1 + '.' + this.ip2 + '.' + this.ip3 + '.' + this.ip4
                    this.$emit('getIpVal', ipVal)
                    this.$parent.$emit('el.form.change') // 这是防止elementui的form表单验证必填项时显示文字的也就是required,用不到可不写
                }
            }
        },
        checkVal(val, key) {
            // 判断输入的ip值
            if (parseInt(val) > 255) {
                // 输入值超过255，则显示为255，并且跳到下一个输入框
                switch (key) {
                    case 'ip1':
                        this.ip1 = 255
                        this.focusInput(2)
                        break
                    case 'ip2':
                        this.ip2 = 255
                        this.focusInput(3)
                        break
                    case 'ip3':
                        this.ip3 = 255
                        this.focusInput(4)
                        break
                    case 'ip4':
                        this.ip4 = 255
                        break
                    default:
                        break
                }
            } else if (parseInt(val) <= 255 && parseInt(val) >= 100) {
                // 输入三位数自动跳到下一个输入值
                switch (key) {
                    case 'ip1':
                        this.focusInput(2)
                        break
                    case 'ip2':
                        this.focusInput(3)
                        break
                    case 'ip3':
                        this.focusInput(4)
                        break
                    default:
                        break
                }
            }
        },
        focusInput(index) {
            // 控制输入框的聚焦
            const key = `ip${index}`
            switch (key) {
                case 'ip2':
                    this.$refs.ip2.focus()
                    break
                case 'ip3':
                    this.$refs.ip3.focus()
                    break
                case 'ip4':
                    this.$refs.ip4.focus()
                    break
                default:
                    break
            }
        },
        keyupEvent(index, e) {
            // 按下.键跳到下一个输入框（同理可做出其他按键的跳转输入框）
            if (e.keyCode === 110) {
                // 这里尝试过用this.focusInput发现没有效果（具体原因暂未知....）
                if (index == 1) {
                    this.$refs.ip2.focus()
                } else if (index == 2) {
                    this.$refs.ip3.focus()
                } else {
                    this.$refs.ip4.focus()
                }
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.ip-box {
    width: 100%;
    // border: 1px solid #576372;
    height: 32px;
    display: flex;
    align-items: center;
    position: relative;
    ::v-deep .el-input {
        flex: 1;
    }
    ::v-deep .el-input__inner {
        border-radius: 0 !important;
    }
    ::v-deep .ip1 {
        .el-input__inner {
            border-radius: 4px 0 0 4px !important;
            border-right: none;
        }
    }
    ::v-deep .ip2, ::v-deep .ip3 {
        .el-input__inner {
            border-right: none;
            border-left: none;
        }
    }
    ::v-deep .ip4 {
        .el-input__inner {
            border-left: none;
            border-radius: 0 4px 4px 0 !important;
        }
    }
    .el-icon-circle-close {
        color: #fff;
        display: none;
        font-size: 12px;
        cursor: pointer;
        position: absolute;
        right: 4px;
    }
    &:hover {
        .el-icon-circle-close {
            display: inline-block;
        }
    }
}
.ip-dot {
    display: inline-block;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background-color: #fff;
}
</style>
