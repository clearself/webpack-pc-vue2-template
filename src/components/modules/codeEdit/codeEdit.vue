<template>
    <div class="codeEdit">
        <codemirror
            ref="codemirror"
            v-model="innerText"
            :options="cmOptions"
            @changes="changeText"
            @focus="isChange = false"
            @blur="blur"
        >
        </codemirror>
    </div>
</template>
<script>
import { codemirror } from 'vue-codemirror' // 引入组件
import 'codemirror/lib/codemirror.css'

// theme css
import 'codemirror/theme/base16-light.css'
import 'codemirror/theme/base16-dark.css'
import 'codemirror/theme/cobalt.css'
import 'codemirror/theme/material.css' // 引入控制主题，没有的话主题不起效果
// require('codemirror/mode/nginx/nginx.js')
// require('codemirror/mode/javascript/javascript.js')
import 'codemirror/mode/nginx/nginx.js'
import 'codemirror/mode/javascript/javascript.js'
export default {
    name: 'CodeEdit',
    components: {
        codemirror // 声明组件
    },
    props: {
        value: {
            type: String,
            default: ''
        },
        mode: {
            type: String,
            default: 'javascript'
        },
        readOnly: {
            type: Boolean,
            default: false
        }
    },
    data() {
        let theme = this.$store.state.common.currentTheme
        let themeCode = ''
        switch (theme) {
            case 'white-theme':
                themeCode = 'base16-light'
                break
            case 'black-theme':
                themeCode = 'cobalt'
                break
            default :
                themeCode = 'cobalt'
        }
        return {
            innerText: this.value,
            isChange: true,
            cmOptions: {
                tabSize: 4, // 制表符的宽度
                mode: this.mode, // 使用的模式
                theme: themeCode, // 主题黑色
                // theme: 'darcula', // 主题白色
                lineNumbers: true, // 是否显示行号
                lineWrapping: true, // 是否应滚动或换行以显示长行
                extraKeys: { Ctrl: 'autocomplete' },
                lineWiseCopyCut: true, // 在没有选择的情况下进行复制或剪切将复制或剪切有光标的整行。
                showCursorWhenSelecting: true, // 选择处于活动状态时是否应绘制光标
                maxHighlightLength: Infinity, // 显示长行的时候 这个值是不限制，如果要做限制的话，值是number类型
                matchBrackets: true, // 光标匹配括号
                line: true,
                highlightDifferences: true,
                readOnly: this.readOnly // 只读
            }
        }
    },
    watch: {
        value() {
            if (this.isChange) {
                this.innerText = this.value
            }
        }
    },
    methods: {
        changeText(CodeMirror, changeObj) {
            this.$emit('input', this.innerText)
            this.$emit('change', this.innerText)
        },
        blur() {
            console.log('失去焦点')
            this.isChange = true
            this.$emit('blur')
        }
    }
}
</script>
<style lang="scss" scoped>
    .codeEdit{
        width:100%;
    }
    .codeEdit::v-deep.CodeMirror {
        height: auto;
        min-height: 500px;
    }
    .codeEdit::v-deep.vue-codemirror{
        width:100%;
        min-height:500px;
    }
    .codeEdit::v-deep.CodeMirror {
        border: 1px solid #eee;
        height: auto;
        min-height: 500px;
    }
    .codeEdit::v-deep.CodeMirror-scroll {
        height: 500px;
        overflow-y: hidden;
        overflow-x: auto;
    }
</style>
