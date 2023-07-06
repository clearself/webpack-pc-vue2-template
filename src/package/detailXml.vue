<template>
    <div v-loading="isView" class="flow-containers" :class="{ 'view-mode': isView }">
        <el-container style="height: 100%">
            <!--<el-header style="border-bottom: 1px solid #dcdcdc;height: auto;">
                <div style="display: flex; padding: 10px 0px; justify-content: space-between;">
                    <div>
                        <el-upload action="" :before-upload="openBpmn" style="margin-right: 10px; display:inline-block;">
                            <el-tooltip effect="dark" content="加载xml" placement="bottom">
                                <el-button size="mini" icon="el-icon-folder-opened" />
                            </el-tooltip>
                        </el-upload>
                        <el-tooltip effect="dark" content="新建" placement="bottom">
                            <el-button size="mini" icon="el-icon-circle-plus" @click="newDiagram" />
                        </el-tooltip>
                        <el-tooltip effect="dark" content="自适应屏幕" placement="bottom">
                            <el-button size="mini" icon="el-icon-rank" @click="fitViewport" />
                        </el-tooltip>
                        <el-tooltip effect="dark" content="放大" placement="bottom">
                            <el-button size="mini" icon="el-icon-zoom-in" @click="zoomViewport(true)" />
                        </el-tooltip>
                        <el-tooltip effect="dark" content="缩小" placement="bottom">
                            <el-button size="mini" icon="el-icon-zoom-out" @click="zoomViewport(false)" />
                        </el-tooltip>
                        <el-tooltip effect="dark" content="预览" placement="bottom">
                            <el-button size="mini" icon="el-icon-view" @click="preView" />
                        </el-tooltip>
                        <el-tooltip effect="dark" content="后退" placement="bottom">
                            <el-button size="mini" icon="el-icon-back" @click="modeler.get('commandStack').undo()" />
                        </el-tooltip>
                        <el-tooltip effect="dark" content="前进" placement="bottom">
                            <el-button size="mini" icon="el-icon-right" @click="modeler.get('commandStack').redo()" />
                        </el-tooltip>
                    </div>
                    <div>
                        <el-button size="mini" icon="el-icon-download" @click="saveXML(true)">下载xml</el-button>
                        <el-button size="mini" icon="el-icon-picture" @click="saveImg('svg', true)">下载svg</el-button>
                        <el-button size="mini" type="primary" @click="save">保存模型</el-button>
                    </div>
                </div>
            </el-header>-->
            <el-container style="align-items: stretch">
                <el-main style="padding: 0;">
                    <div ref="canvas" class="canvas detail-box" />
                </el-main>
                <!-- <el-aside class="panel-wrapper">
                    <panel v-if="modeler" :modeler="modeler" :users="users" :groups="groups" :categorys="categorys" />
                </el-aside> -->
            </el-container>
        </el-container>
        <el-dialog :visible.sync="xmlVisible" title="XML" :fullscreen="false" top="10vh">
            <vue-ace-editor
                v-model="process.xml"
                @init="editorInit"
                lang="xml"
                theme="chrome"
                width="100%"
                height="400"
                :options="{wrap: true, readOnly: true}">
            </vue-ace-editor>
            <span slot="footer" class="dialog-footer">
                <el-button icon="el-icon-document" v-clipboard:copy="process.xml" v-clipboard:success="onCopy">复 制</el-button>
                <el-button icon="el-icon-close" type="primary" @click="xmlVisible = false">关闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {
    append as svgAppend,
    attr as svgAttr,
    create as svgCreate
} from 'tiny-svg'
// 汉化
import customTranslate from './common/customTranslate'
// import customPaletteModule from './components/custom/index'
// import Modeler from 'bpmn-js/lib/Modeler'
import panel from './PropertyPanel'
import BpmData from './BpmData'
import getInitStr from './flowable/init'
import VueAceEditor from 'vue2-ace-editor'
import CustomModeler from './components/bpmn/customModeler'
// 引入camunda的节点文件
// import camundaModdle from './camunda/camunda.json'
import camundaModdleDescriptor from './flowable/camunda.json'
export default {
    name: 'WorkflowBpmnModeler',
    components: {
        // eslint-disable-next-line vue/no-unused-components
        panel,
        VueAceEditor
    },
    props: {
        xml: {
            type: String,
            default: ''
        },
        users: {
            type: Array,
            default: () => []
        },
        groups: {
            type: Array,
            default: () => []
        },
        categorys: {
            type: Array,
            default: () => []
        },
        isView: {
            type: Boolean,
            default: false
        },
        workStatus: {
            type: Boolean,
            default: false
        },
        currentWorkIds: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            nodeName: '',
            process: {
                xml: ''
            },
            xmlVisible: false,
            modeler: null,
            taskList: [],
            zoom: 1,
            nodeList: []
        }
    },
    watch: {
        xml: function(val) {
            if (val) {
                console.log(22222222222, val)
                this.createNewDiagram(val)
            }
        }
    },
    mounted() {
        console.log('44444444444444444')
        console.log(this.xml)
        let themeColor = '#C5C5C5'
        // if (this.$store.state.common.currentTheme === 'white-theme') {
        //     themeColor = '#3f4f57'
        // }
        // 生成实例
        this.modeler = new CustomModeler({
            container: this.$refs.canvas,
            bpmnRenderer: {
                // defaultFillColor: 'green',
                defaultStrokeColor: themeColor
            },
            additionalModules: [
                // customPaletteModule,
                {
                    translate: ['value', customTranslate]
                }
            ],
            moddleExtensions: {
                // camunda: camundaModdle
                camunda: camundaModdleDescriptor
            }
        })
        // eslint-disable-next-line no-undef
        $('.bjs-powered-by').css('display', 'none')
        // 新增流程定义
        if (this.xml) {
            this.createNewDiagram(this.xml)
        }

        this.addBpmnListener()
    },
    methods: {
        onCopy() {
            this.$message({
                message: '复制成功',
                type: 'success'
            })
        },
        // 添加绑定事件
        addBpmnListener() {
            const that = this
            // 获取a标签dom节点
            // 给图绑定事件，当图有发生改变就会触发这个事件
            this.modeler.on('commandStack.changed', function() {
                // eslint-disable-next-line handle-callback-err
                that.saveDiagram(function(err, xml) {
                    let processId = that.$getsessionStorage('processId')
                    that.$emit('getNewXMLInFo', {
                        xml: xml,
                        name: processId
                    })
                })
            })
        },
        async saveDiagram(done) {
            // 把传入的done再传给bpmn原型的saveXML函数调用
            let { err, xml } = await this.modeler.saveXML({ format: true })
            done(err, xml)
        },
        editorInit: function() {
            require('brace/ext/language_tools') // language extension prerequsite...
            require('brace/mode/xml') // language
            require('brace/theme/chrome')
        },
        newDiagram() {
            this.createNewDiagram(getInitStr())
        },
        // 让图能自适应屏幕
        fitViewport() {
            this.zoom = this.modeler.get('canvas').zoom('fit-viewport')
            const bbox = document.querySelector('.flow-containers .viewport').getBBox()
            const currentViewbox = this.modeler.get('canvas').viewbox()
            const elementMid = {
                x: bbox.x + bbox.width / 2 - 65,
                y: bbox.y + bbox.height / 2
            }
            this.modeler.get('canvas').viewbox({
                x: elementMid.x - currentViewbox.width / 2,
                y: elementMid.y - currentViewbox.height / 2,
                width: currentViewbox.width,
                height: currentViewbox.height
            })
            this.zoom = bbox.width / currentViewbox.width * 1.8
        },
        // 放大缩小
        // zoomViewport(zoomIn = true) {
        //     this.zoom = this.modeler.get('canvas').zoom()
        //     this.zoom += (zoomIn ? 0.1 : -0.1)
        //     this.modeler.get('canvas').zoom(this.zoom)
        // },
        async createNewDiagram(data) {
            // 将字符串转换成图显示出来
            // xml = xml.replace(/</g, '&lt;')
            // xml = xml.replace(/>/g, '&gt;')
            data = data.replace(/<!\[CDATA\[(.+)]]>/g, '&lt;![CDATA[$1]]&gt;')
            try {
                await this.modeler.importXML(data)
                this.adjustPalette()
                this.fitViewport()
                this.addEventBusListener()
                this.currentWorkIds.forEach(item => {
                    this.addOverLay(item)
                })
                this.workStatus && this.addOverLay('')
            } catch (err) {
                console.error(err.message, err.warnings)
            }
        },
        addOverLay(nodeId) {
            const elementRegistry = this.modeler.get('elementRegistry')
            !this.workStatus && (this.nodeList = elementRegistry.filter(
                (item) => item.type === 'bpmn:UserTask' || item.type === 'bpmn:Task' || item.type === 'bpmn:ServiceTask'
            ))
            this.workStatus && (this.nodeList = elementRegistry.filter(
                (item) => item.type === 'bpmn:EndEvent'
            ))
            const overlays = this.modeler.get('overlays')
            this.workStatus && (nodeId = this.nodeList[0].id)
            // console.log(nodeId)
            const shape = elementRegistry.get(nodeId)
            console.log(this.nodeList)
            console.log('shape2222', shape)
            if (shape) {
                let $overlayHtml
                if (shape.width == 48) { // 会签审批
                    // eslint-disable-next-line no-undef
                    $overlayHtml = $('<div class="highlight-overlay users"></div>').css({
                        width: shape.width,
                        height: shape.height
                    })
                } else if (shape.width == 40) { // 结束
                    // eslint-disable-next-line no-undef
                    $overlayHtml = $('<div class="highlight-overlay over"></div>').css({
                        width: shape.width,
                        height: shape.height
                    })
                } else {
                    // eslint-disable-next-line no-undef
                    $overlayHtml = $('<div class="highlight-overlay"></div>').css({
                        width: shape.width,
                        height: shape.height,
                        background: '#f4c222'
                    })
                }
                overlays.add(nodeId, {
                    position: { top: 0, left: 0 },
                    html: $overlayHtml
                })
            }
            // 此方法为了解决方式 2 造成的节点点击事件失效问题, 如果采用方式 1, 可忽略此方法
            this.overlayClick()
        },
        overlayClick() {
            // eslint-disable-next-line no-undef
            $('.djs-container').on('click', '.djs-overlays', (e) => {
                console.log(23233)
                const parentEle = e.target.parentElement.parentElement
                const shapeId = parentEle.getAttribute('data-container-id')
                console.log(shapeId)
                const temp = this.nodeList.filter(
                    (item) => item.id === shapeId
                )[0]
                console.log(temp)
                this.nodeName = temp ? temp.businessObject.name : ''
            })
        },
        addEventBusListener() {
            const eventBus = this.modeler.get('eventBus')
            // 为节点注册点击事件, 点击节点, 下方显示点击的节点名称
            eventBus.on('element.click', (e) => {
                const { element } = e
                if (['bpmn:UserTask', 'bpmn:ServiceTask'].includes(element.type)) {
                    this.$emit('change-element', {
                        id: element.businessObject.id,
                        name: element.businessObject.name
                    })
                }
                if (!element.parent) return
                if (!e || element.type === 'bpmn:Process') {
                    return false
                } else {
                    this.nodeName = element.businessObject.name
                }
            })
        },
        // 调整左侧工具栏排版
        adjustPalette() {
            try {
                // 获取 bpmn 设计器实例
                const canvas = this.$refs.canvas
                const djsPalette = canvas.children[0].children[1].children[4]
                const djsPalStyle = {
                    width: '100px',
                    padding: '5px',
                    left: '20px',
                    borderRadius: 0
                }
                for (var key in djsPalStyle) {
                    djsPalette.style[key] = djsPalStyle[key]
                }
                const palette = djsPalette.children[0]
                const allGroups = palette.children
                allGroups[0].style.display = 'none'
                // 修改控件样式
                for (var gKey in allGroups) {
                    const group = allGroups[gKey]
                    for (var cKey in group.children) {
                        const control = group.children[cKey]
                        const controlStyle = {
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            boxSizing: 'border-box',
                            padding: '5px'
                        }
                        if (
                            control.className &&
                            control.dataset &&
                            control.className.indexOf('entry') !== -1
                        ) {
                            const controlProps = new BpmData().getControl(
                                control.dataset.action
                            )
                            control.innerHTML = '<div style="width:30px;height:30px;" class="' + controlProps.icon + '"></div><div class="tool-text" style="font-size: 14px;font-weight:500;margin-left:10px;">' + controlProps.title + '</div>'
                            for (var csKey in controlStyle) {
                                control.style[csKey] = controlStyle[csKey]
                            }
                        }
                    }
                }
            } catch (e) {
                console.log(e)
            }
        },
        fillColor() {
            const canvas = this.modeler.get('canvas')
            this.modeler._definitions.rootElements[0].flowElements.forEach(n => {
                if (n.$type === 'bpmn:UserTask') {
                    const completeTask = this.taskList.find(m => m.key === n.id) || { completed: true }
                    const todoTask = this.taskList.find(m => !m.completed)
                    const endTask = this.taskList[this.taskList.length - 1]
                    if (completeTask) {
                        canvas.addMarker(n.id, completeTask.completed ? 'highlight' : 'highlight-todo')
                    // eslint-disable-next-line no-unused-expressions
                    n.outgoing?.forEach(nn => {
                        const targetTask = this.taskList.find(m => m.key === nn.targetRef.id)
                        if (targetTask) {
                            canvas.addMarker(nn.id, targetTask.completed ? 'highlight' : 'highlight-todo')
                        } else if (nn.targetRef.$type === 'bpmn:ExclusiveGateway') {
                            // canvas.addMarker(nn.id, 'highlight');
                            canvas.addMarker(nn.id, completeTask.completed ? 'highlight' : 'highlight-todo')
                            canvas.addMarker(nn.targetRef.id, completeTask.completed ? 'highlight' : 'highlight-todo')
                        } else if (nn.targetRef.$type === 'bpmn:EndEvent') {
                            if (!todoTask && endTask.key === n.id) {
                                canvas.addMarker(nn.id, 'highlight')
                                canvas.addMarker(nn.targetRef.id, 'highlight')
                            }
                            if (!completeTask.completed) {
                                canvas.addMarker(nn.id, 'highlight-todo')
                                canvas.addMarker(nn.targetRef.id, 'highlight-todo')
                            }
                        }
                    })
                    }
                } else if (n.$type === 'bpmn:ExclusiveGateway') {
                    n.outgoing.forEach(nn => {
                        const targetTask = this.taskList.find(m => m.key === nn.targetRef.id)
                        if (targetTask) {
                            canvas.addMarker(nn.id, targetTask.completed ? 'highlight' : 'highlight-todo')
                        }
                    })
                }
                if (n.$type === 'bpmn:StartEvent') {
                    n.outgoing.forEach(nn => {
                        const completeTask = this.taskList.find(m => m.key === nn.targetRef.id)
                        if (completeTask) {
                            canvas.addMarker(nn.id, 'highlight')
                            canvas.addMarker(n.id, 'highlight')
                        }
                    })
                }
            })
        },
        // 对外 api
        getProcess() {
            const element = this.getProcessElement()
            return {
                id: element.id,
                name: element.name,
                category: element.$attrs['camunda:processCategory']
            }
        },
        getProcessElement() {
            return this.modeler.getDefinitions().rootElements[0]
        },
        async saveXML(download = false) {
            try {
                let { xml } = await this.modeler.saveXML({ format: true })
                xml = xml.replace(/&lt;/g, '<')
                xml = xml.replace(/&gt;/g, '>')
                if (download) {
                    this.downloadFile(`${this.getProcessElement().name}.bpmn20.xml`, xml, 'application/xml')
                }
                return xml
            } catch (err) {
                console.log(err)
            }
        },
        async saveImg(type = 'svg', download = false) {
            try {
                const { svg } = await this.modeler.saveSVG({ format: true })
                if (download) {
                    this.downloadFile(this.getProcessElement().name, svg, 'image/svg+xml')
                }
                return svg
            } catch (err) {
                console.log(err)
            }
        },
        async save() {
            const process = this.getProcess()
            const xml = await this.saveXML()
            const svg = await this.saveImg()
            const result = { process, xml, svg }
            console.log('result', result)
            this.$emit('save', result)
            window.parent.postMessage(result, '*')
        },
        async preView() {
            this.xmlVisible = true
            const xml = await this.saveXML()
            this.process.xml = xml
        },
        openBpmn(file) {
            const reader = new FileReader()
            reader.readAsText(file, 'utf-8')
            reader.onload = () => {
                this.createNewDiagram(reader.result)
            }
            return false
        },
        downloadFile(filename, data, type) {
            var a = document.createElement('a')
            var url = window.URL.createObjectURL(new Blob([data], { type: type }))
            a.href = url
            a.download = filename
            a.click()
            window.URL.revokeObjectURL(url)
        }
    }
}
</script>

<style lang="scss">
/*左边工具栏以及编辑节点的样式*/
@import "~bpmn-js/dist/assets/diagram-js.css";
@import "~bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
@import "~bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
@import "~bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
.view-mode {
    .el-header, .el-aside, .djs-palette, .bjs-powered-by {
        display: none;
    }
    .el-loading-mask {
        background-color: initial;
    }
    .el-loading-spinner {
        display: none;
    }
}
.flow-containers {
    // background-color: #ffffff;
    width: 100%;
    height: 100%;
    .canvas {
        width: 100%;
        height: 100%;
    }
    .panel {
        position: absolute;
        right: 0;
        top: 50px;
        width: 300px;

    }
    .load {
        margin-right: 10px;
    }
    .el-form-item__label{
        font-size: 13px;
    }
    .detail-box .djs-palette{
        display: none !important;

    }
    .djs-palette .icon-custom{
        cursor:pointer!important;
    }
    .djs-palette .tool-text{
        color: #387dee!important;
        // text-shadow: 0px 0px 4px  #00ffff!important;
        cursor:pointer!important;
    }
    .djs-container svg {
        min-height: 650px;
    }
    .djs-label {
        fill: #333333!important;
    }
    .djs-element.selected .djs-outline {
        stroke: #C5C5C5!important;
    }

    .panel-wrapper{
        width: 400px;
        min-height: 650px;
        max-height: 100%;
        overflow-y:auto;
        background-color: #fff;
        // box-shadow: -12px 0px 10px 0px rgba(0, 0, 0, 0.7), inset 0px 0px 18px 0px #00b4ff;
        border: solid 1px #50b0ff;
        // background-color: rgba(17, 29, 43, .9);
        // background-image: url(../assets/img/dialog-bg2.png);
        // background-position: right 150px;
        // background-repeat: no-repeat;
        // background-size: 150px 220px;
    }
    .djs-direct-editing-parent{
        // background-color: #052942!important;
        // border: solid 1px #50b0ff!important;
    }
    .djs-direct-editing-content{
        color:#333333!important;
    }
    .djs-context-pad .entry{
        // background-color:#000!important;
        // border: solid 1px #50b0ff!important;
        // box-shadow: 0 0 2px 1px #052942!important;
    }
    .el-divider.el-divider--horizontal{
        background-color: #dcdcdc;
        opacity: 0.2;
        margin: 16px 0;
    }
    .detail-box .djs-context-pad {
        display: none !important;
    }
}
.highlight-overlay.users {
    background: url("./images/higth_task.png") no-repeat;
    background-size: 100% 100%;
}
.highlight-overlay.over {
    background: url("./images/hight_over.png") no-repeat;
    background-size: 100% 100%;
}
</style>
