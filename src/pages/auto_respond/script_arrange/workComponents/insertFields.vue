<template>
    <div class="container insert-field" @click="showFidles = false">
        <div id="edit-head-field" ref="editHead" contenteditable>
        </div>
        <span class="head-tip">标题：</span>
        <div class="edit-content">
            <span class="body-tip">内容：</span>
            <div id="edit-body-field" ref="editBody" contenteditable>
            </div>
            <!-- <div class="insert-text">
                <i class="iconfont icon-charubianliang charu" @click.stop="showFidles = !showFidles"> 插入变量</i>
                <div v-if="showFidles" class="fields-box" @click.stop="">
                    <el-tabs v-model="activeName">
                        <el-tab-pane label="对象及字段" name="first">
                            <div class="select-fields">
                                <div v-for="(item,index) in objectList" :key="index">
                                    <p style="cursor: pointer;font-size: 12px" @click.stop="handleInsert(item.label)">{{item.label}}</p>
                                </div>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="工单相关变量" name="second">
                            <div class="select-fields">
                                <div v-for="(_item, _index) in workList" :key="_index">
                                    <p style="cursor: pointer;font-size: 12px" @click.stop="handleInsert(_item.label)">{{ _item.label }}</p>
                                </div>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div> -->
        </div>
    </div>
</template>

<script>
import {
    get_selested_all_fileds,
    get_work_fileds
} from '../../../../server/works_order/api'
export default {
    name: 'InsertFields',
    data() {
        return {
            activeName: 'first',
            showFidles: false,
            // objectList: [],
            // workList: [],
            // alarmList: [],
            // leakList: [
            //     {
            //         label: '漏洞名称'
            //     },
            //     {
            //         label: '漏洞级别'
            //     }
            // ],

            lastEditRange: null // 定义最后光标对象
        }
    },
    props: ['title', 'mes'],
    computed: {

    },
    created() {
        // this.get_alarm_fields()
        // this.get_workFields()
    },
    watch: {
        // sendId(val) {
        //     if (val == 1) {
        //         this.objectList = this.$deepCopy(this.alarmList)
        //     } else if (val == 2) {
        //         this.objectList = this.$deepCopy(this.leakList)
        //     } else {
        //         this.objectList = []
        //     }
        // }
    },
    mounted() {
        this.$nextTick(() => {
            console.log(this.$refs.editHead)
            console.log(this.title, this.mes)
            if (this.title) {
                console.log(this.$refs.editHead)
                this.$refs.editHead.innerText = this.title
            }
            if (this.mes) {
                console.log(this.$refs.editBody)
                this.$refs.editBody.innerText = this.mes
            }
        })
    },

    methods: {
        // get_alarm_fields() {
        //     let data = {
        //         paramsData: {},
        //         queryData: {}
        //     }
        //     get_selested_all_fileds(data).then(res => {
        //         console.log('事件字段', res)
        //         this.alarmList = res
        //         let baseForm = this.$getsessionStorage('baseForm')
        //         if (this.sendId == 1 || (!this.sendId && baseForm.sendId == 1)) {
        //             // 事件
        //             this.objectList = this.$deepCopy(this.alarmList)
        //             console.log(this.objectList)
        //         } else if (this.sendId == 2 || (!this.sendId && baseForm.sendId == 2)) {
        //             // 漏洞
        //             this.objectList = this.$deepCopy(this.leakList)
        //         }
        //     }).catch(err => {
        //         console.log(err)
        //     })
        // },
        // get_workFields() {
        //     let data = {
        //         paramsData: {},
        //         queryData: {}
        //     }
        //     get_work_fileds(data).then(res => {
        //         console.log('工单字段', res)
        //         this.workList = res
        //     }).catch(err => {
        //         console.log(err)
        //     })
        // },
        /* 编辑框点击事件*/
        // editClick() {
        //     // 获取选定对象
        //     var selection = getSelection()
        //     // 设置最后光标对象
        //     this.lastEditRange = selection.getRangeAt(0)
        //     console.log(this.lastEditRange)
        // },
        // /* 编辑框按键弹起事件*/
        // editKeyup() {
        //     var selection = getSelection()
        //     // 设置最后光标对象
        //     this.lastEditRange = selection.getRangeAt(0)
        // }
        // handleInsert(val) {
        //     // 获取编辑框对象
        //     var editHead = this.$refs.editHead
        //     var editBody = this.$refs.editBody

        //     // 编辑框设置焦点
        //     editBody.focus()
        //     // 获取选定对象
        //     var selection = getSelection()
        //     // 判断是否有最后光标对象存在
        //     if (this.lastEditRange) {
        //         // 存在最后光标对象，选定对象清除所有光标并添加最后光标还原之前的状态
        //         selection.removeAllRanges()
        //         selection.addRange(this.lastEditRange)
        //     } else {
        //         this.$message.warning('请先在编辑区内插入光标')
        //         return
        //     }
        //     console.log(this.lastEditRange, '点击时当前光标位置')
        //     let editCurrent
        //     // 判断光标位置，插入头部或者主体
        //     if (this.lastEditRange.commonAncestorContainer === editBody) {
        //         editCurrent = editBody
        //     } else if (this.lastEditRange.commonAncestorContainer === editHead) {
        //         editCurrent = editHead
        //     } else if (this.lastEditRange.commonAncestorContainer.parentElement && this.lastEditRange.commonAncestorContainer.parentElement === editBody) {
        //         console.log('editbody')
        //         editCurrent = editBody
        //     } else if (this.lastEditRange.commonAncestorContainer.parentElement && this.lastEditRange.commonAncestorContainer.parentElement === editHead) {
        //         console.log('edithead')
        //         editCurrent = editHead
        //     }
        //     // 判断选定对象范围是编辑框还是文本节点
        //     console.log(selection.anchorNode.nodeName, '11111111')
        //     if (selection.anchorNode.nodeName != '#text') {
        //         console.log('???')
        //         // 如果是编辑框范围。则创建表情文本节点进行插入
        //         let part = document.createElement('span')
        //         part.innerText = '{' + val + '}'
        //         part.setAttribute('contenteditable', false)
        //         part.setAttribute('style', 'color:#03864f')

        //         console.log(editCurrent.childNodes, 'childnodes')
        //         console.log(selection.anchorOffset)
        //         // debugger
        //         if (editCurrent.childNodes.length > 0) {
        //             // 如果文本框的子元素大于0，则表示有其他元素，则按照位置插入表情节点
        //             for (var i = 0; i <= editCurrent.childNodes.length; i++) {
        //                 if (i == selection.anchorOffset) {
        //                     editCurrent.insertBefore(part, editCurrent.childNodes[i])
        //                 }
        //             }
        //         } else {
        //             // 否则直接插入一个表情元素
        //             editCurrent.appendChild(part)
        //         }
        //         // 创建新的光标对象
        //         var range = document.createRange()
        //         // 光标对象的范围界定为新建的表情节点
        //         range.selectNodeContents(part)
        //         // 光标位置定位在表情节点的最大长度
        //         console.log(part)
        //         range.setStartAfter(part)
        //         // 使光标开始和光标结束重叠
        //         range.collapse(true)
        //         // 清除选定对象的所有光标对象
        //         selection.removeAllRanges()
        //         // 插入新的光标对象
        //         selection.addRange(range)
        //     } else {
        //         console.log(2)
        //         // 如果是文本节点则先获取光标对象
        //         // eslint-disable-next-line no-redeclare
        //         var range = selection.getRangeAt(0)
        //         // 获取光标对象的范围界定对象，一般就是textNode对象
        //         var textNode = range.startContainer
        //         console.log(textNode)
        //         // 获取光标位置
        //         var rangeStartOffset = range.startOffset
        //         console.log(rangeStartOffset)
        //         // 文本节点在光标位置处插入新的表情内容
        //         let part = document.createElement('span')
        //         part.innerText = '{' + val + '}'
        //         part.setAttribute('contenteditable', false)
        //         part.setAttribute('style', 'color:#03864f')
        //         range.insertNode(part)

        //         // textNode.insertData(rangeStartOffset, emojiInput.value)
        //         // 光标移动到到原来的位置加上新内容的长度
        //         range.setStartAfter(part)
        //         // 光标开始和光标结束重叠
        //         range.collapse(true)
        //         // 清除选定对象的所有光标对象
        //         selection.removeAllRanges()
        //         // 插入新的光标对象
        //         selection.addRange(range)
        //     }
        //     // 无论如何都要记录最后光标对象
        //     this.lastEditRange = selection.getRangeAt(0)
        // }
    }
}
</script>

<style scoped lang="scss">
.charu{
    color:rgba(0,0,0,.4) !important;
}
.charu:hover{
    color:#0052d9 !important;
}
.container{
    ::v-deep .el-tabs__nav-wrap::after{
        height:1px !important;
    }
    ::v-deep .el-tabs__active-bar{
        height:1px !important;
    }
}
.container {
    width: 100%;
    height: 160px;
    border: 1px solid #dcdcdc;
    // box-shadow: inset 0px 0px 7px 0px #389bf7;
    border-radius: 3px;
    position: relative;
}
#edit-head-field {
    height: 30px;
    line-height: 30px;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    padding: 0 5px;
    // text-indent: 40px;
    font-size: 12px;
    margin-left: 40px;
}
.head-tip {
    position: absolute;
    left: 14px;
    top: -1px;
    font-size: 12px;
}
.edit-content {
    width: 100%;
    height: 130px;
    position: relative;

    .body-tip {
        position: absolute;
        left: 14px;
        top: 0;
        font-size: 12px;
    }

    #edit-body-field {
        height: 100px;
        padding: 0 5px;
        font-size: 12px;
        padding-left: 50px;
        overflow-y: auto;
    }

    #edit-body-field::before {
        content: '';
        width: 100%;
        height: 0;
        position: absolute;
        border-bottom:1px #DCDCDC dashed;
        top: 1px;
        left: 0;
    }

    .insert-text {
        position: absolute;
        width: 80px;
        height: 16px;
        line-height: 16px;
        right: 0px;
        bottom: 6px;

        i {
            font-size: 12px;
            color: #606266;
            cursor: pointer;
        }
    }
    .fields-box {
        position: absolute;
        bottom: 20px;
        right: -3px;
        width: 200px;
        height: 190px;
        background: #fff;
        z-index: 99;
        border: solid 1px #dcdcdc;
        border-radius: 4px;
        box-shadow: 0px 3px 14px 2px rgba(0, 0, 0, 0.05), 0px 8px 10px 1px rgba(0, 0, 0, 0.06), 0px 5px 5px -3px rgba(0, 0, 0, 0.1);
        ::v-deep  .el-tabs__item.is-active,  ::v-deep .el-tabs__item:hover{
            color: #409eff;
            opacity: 1;

        }
        ::v-deep .el-tabs__active-bar {
            background-color: #409eff;
        }
        ::v-deep  .el-tabs__item {
            color: #606266;
            opacity: 0.4;
            font-size: 12px;
            padding: 0 10px;
        }
        ::v-deep .el-tabs__nav-wrap::after {
            // background-color: rgba(28,215,250,.2);
        }
    }
    .select-fields {
        height: 130px;
        overflow-y: auto;
        padding: 0 10px;
        box-sizing: border-box;

        & div {
            margin-bottom: 10px;
        }

        & p:hover {
            color:#409eff;
        }
    }
}
</style>
