<template>
    <div
        ref="div-editable"
        :style="{'-webkit-user-modify': disabled ? 'read-only' : '', '-moz-user-modify': disabled ? 'read-only' : ''}"
        class="div_editable"
        :contenteditable="!disabled"
        :placeholder="placeholder"
        @focus="focus($event)"
        @blur="blur($event)"
        @keydown="$emit('keydown', $event)"
        @keyup="$emit('keyup', $event)"
        @input="domInput"
    ></div>
</template>

<script>
import EventUtil from './EventUtil.js'
export default {
    name: 'DivEditable',
    props: {
        value: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: '请输入内容'
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isInput: false
        }
    },
    watch: {
        value(newVal) {
            if (!this.isInput) {
                this.$el.innerHTML = this.value
            }
        }
    },
    mounted() {
        // 组件初始化，对innerHTML赋值
        this.$el.innerHTML = this.value
        // 一旦div的dom发生插入值的操作，调用domChange()方法传递值至父组件
        EventUtil.addHandler(this.$el, 'DOMNodeInserted', this.domChange)
    },
    beforeDestroy() {
        // 销毁
        EventUtil.removeHandler(this.$el, 'DOMNodeInserted', this.domChange)
    },
    methods: {
        focus($event) {
            this.isInput = true
            this.$emit('focus', $event)
        },
        blur($event) {
            this.isInput = false
            this.$emit('blur', $event)
        },
        domChange(event) {
            this.$emit('input', this.$el.innerHTML, this.$el.dataset.index, event)
        },
        emptyInnerHTML() {
            this.$el.innerHTML = ''
            this.$emit('input', this.$el.innerHTML, this.$el.dataset.index, event)
        },
        domInput(event) {
            if (this.$el.innerHTML == '<br>') {
                this.$el.innerHTML = ''
            }
            this.$emit('input', this.$el.innerHTML, this.$el.dataset.index, event)
        }
    }
}
</script>
<style scoped>
.div_editable{
    background: transparent;
    border: 1px solid #1cd7fa;
    box-shadow: 0px 0px 7px #389bf7 inset;
    color: #fff;
    border-radius: 4px;
    width: 100%;
    box-sizing: border-box;
    min-height: 60px;
    max-height:80px;
    padding: 5px 7px;
    line-height: 1.5;
    overflow-y: auto;
    word-break: break-all;
    outline: none;
    user-select: text;
    white-space: pre-wrap;
    text-align: left;
}
div.div_editable::-webkit-scrollbar {
    width: 1px!important;
    height: 5px!important;
}
.div_editable:focus {
    border: 1px solid #1cd7fa;
}

.div_editable[contenteditable='plaintext-only']:empty:before{
    content: attr(placeholder);
    display: block;
    color: #999;
}

/* 白版 */
.white-theme .div_editable{
    background: #fff;
    border: 1px solid #d1dbe5;
    box-shadow: none;
    color: #333;
}
.white-theme .div_editable:focus {
    border: 1px solid #3FAAF5;
}
</style>
