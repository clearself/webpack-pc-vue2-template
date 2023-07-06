<template>
    <div id="container" :value="value" :comboType="comboType" class="container"></div>
</template>
<script>
import insertCss from 'insert-css'
import G6 from '@antv/g6'
export default {
    name: 'Topological',
    props: {
        value: {
            type: Object,
            default: null
        },
        comboType: {
            type: String,
            default: 'circle'
        }
    },
    data() {
        return {
            graph: null,
            chartData: this.value
        }
    },
    computed: {},
    created() {
    },
    watch: {
        value: {
            handler: function(value) {
                this.chartData = value
            }
        }
    },
    mounted() {
        this.initGraph()
    },
    methods: {
        initContextMenu() {
            const contextMenu = new G6.Menu({
                getContent(evt) {
                    let header
                    if (evt.target && evt.target.isCanvas && evt.target.isCanvas()) {
                        header = ''
                    } else if (evt.item) {
                        const itemType = evt.item.getType()
                        header = `${itemType.toUpperCase()} ContextMenu`
                    }
                    return `
                        <ul class="out" style="width:110px;font-size: 12px">
                            <li id='1' class="cell" style="margin-bottom:10px;cursor: pointer;">查询</li>
                            <li id='2' class="cell" style="margin-bottom:10px;cursor: pointer;">删除</li>
                            <li id='3' class="cell" style="cursor: pointer;">连接</li>
                        </ul>`
                },
                handleMenuClick: (target, item) => {
                    console.log(target.id, item)
                    if (target.id == 3) {
                        this.$emit('add', item._cfg.model)
                    }
                    if (target.id == 2) {
                        this.$emit('del', item._cfg.model)
                    }
                    if (target.id == 1) {
                        this.$emit('search', item._cfg.model)
                    }
                },
                // offsetX and offsetY include the padding of the parent container
                // 需要加上父级容器的 padding-left 16 与自身偏移量 10
                offsetX: 16 + 10,
                offsetY: 0,
                itemTypes: ['node']
            })
            return contextMenu
        },
        initTooltip() {
            const tooltip = new G6.Tooltip({
                offsetX: 10,
                offsetY: 10,
                fixToNode: [1, 0.5],
                itemTypes: ['node', 'edge'],
                getContent: (e) => {
                    const outDiv = document.createElement('div')
                    outDiv.style.width = 'fit-content'
                    outDiv.style.height = 'fit-content'
                    const model = e.item.getModel()
                    if (e.item.getType() === 'node') {
                        let isBoundary = this.isNoText(model.data.isBoundary)
                        let isDomestic = this.isNoText(model.data.isDomestic)
                        outDiv.innerHTML = `资产名称:${model.data.deviceName ? model.data.deviceName : ''}</br>资产标签:${model.data.labelName ? model.data.labelName : ''}</br>端口:${model.data.port ? model.data.port : ''}</br>资产标识:${model.data.uniqueCode ? model.data.uniqueCode : ''}</br>资产联系人:${model.data.userList && model.data.userList.length > 0 ? model.data.userList.join(',') : ''}</br>设备类型:${model.data.deviceTypeName ? model.data.deviceTypeName : ''}</br>厂商:${model.data.manufacturerName ? model.data.manufacturerName : ''}</br>型号:${model.data.modelInfo ? model.data.modelInfo : ''}</br>操作系统:${model.data.pcSystem ? model.data.pcSystem : ''}</br>是否边界:${isBoundary}<br>是否国产:${isDomestic}</br>业务系统:${model.data.systemObj && model.data.systemObj.length > 0 ? model.data.systemObj.join(',') : ''}</br>创建时间:${model.data.createTime ? model.data.createTime : ''}</br>所属安全域:${model.data.zoneName ? model.data.zoneName : ''}`
                    } else if (e.item.getType() === 'edge') {
                        let reportLevel = this.levelText(model.data.reportLevel)
                        outDiv.innerHTML = `源IP:${model.data.srcIp ? model.data.srcIp : ''}</br>目的IP:${model.data.desIp ? model.data.desIp : ''}</br>事件类型:${model.data.reportTypeName ? model.data.reportTypeName : ''}</br>事件等级:${reportLevel}</br>事件名称:${model.data.reportName ? model.data.reportName : ''}</br>事件时间:${model.data.createTime ? model.data.createTime : ''}</br>ATT&CK:${model.data.attCk ? model.data.attCk : ''}</br>攻击链阶段:${model.data.attChain ? model.data.attChain : ''}`
                    }
                    return outDiv
                }
            })
            return tooltip
        },
        levelText(val) {
            if (val == 4) {
                return '高'
            } else if (val == 3) {
                return '中高'
            } else if (val == 2) {
                return '中'
            } else if (val == 1) {
                return '中低'
            } else if (val == 0) {
                return '低'
            } else {
                return ''
            }
        },
        isNoText(val) {
            if (val == 0) {
                return '否'
            } else if (val == 1) {
                return '是'
            } else {
                return ''
            }
        },
        initGraph() {
            console.log('里面接收的值', this.chartData)
            const contextMenu = this.initContextMenu()
            const tooltip = this.initTooltip()
            const graphDiv = document.getElementById('container')
            const width = graphDiv.scrollWidth || 1180
            const height = graphDiv.scrollHeight || 400
            this.graph = new G6.Graph({
                container: 'container',
                width,
                height,
                // fitView: true,
                fitViewPadding: 20,
                // 必须将 groupByTypes 设置为 false，带有 combo 的图中元素的视觉层级才能合理
                // groupByTypes: false,
                layout: {
                    // center: [500, 200],
                    // type: 'random',
                    // width: 1174,
                    // height: 400

                    type: 'force',
                    center: [500, 200],
                    preventOverlap: true,
                    nodeSize: 40,
                    nodeSpacing: 100,
                    linkDistance: 150,
                    nodeStrength: -200
                },
                plugins: [tooltip, contextMenu],
                modes: {
                    addEdge: ['click-add-edge', 'click-select'],
                    default: ['drag-canvas', 'zoom-canvas', 'drag-combo', 'collapse-expand-combo', 'drag-node', 'click-select'],
                    addCurveEdge: ['click-add-edge', 'click-select'],
                    preview: [
                        'drag-canvas',
                        {
                            type: 'tooltip',
                            formatText(model) {
                                return model.label
                            }
                        }
                    ]
                },
                defaultNode: {
                    type: 'circle',
                    size: 40,
                    labelCfg: {
                        position: 'center'
                    }
                    // 裁剪图片配置
                    // clipCfg: {
                    //     show: true,
                    //     type: 'rect',
                    //     // circle
                    //     // r: 16,
                    //     // ellipse
                    //     // rx: 0,
                    //     // ry: 0,
                    //     // rect
                    //     width: 15,
                    //     height: 15,
                    //     // 坐标
                    //     x: 0,
                    //     y: 0,
                    // },
                },
                defaultEdge: {
                    style: {
                        stroke: '#dcdcdc',
                        lineWidth: 2,
                        // fill: '',
                        startArrow: false,
                        endArrow: true
                        // strokeOpacity: 1
                    }
                },
                nodeStateStyles: {
                    hover: {
                        lineWidth: 3
                    }
                }
            })
            this.graph.node(function(node) {
                return {
                    label: node.name
                }
            })
            this.graph.edge(function(edge) {
                if (edge.type == 0) {
                    return {
                        style: {
                            startArrow: false,
                            endArrow: false
                        }
                    }
                } else if (edge.type == 1) {
                    return {
                        style: {
                            startArrow: false,
                            endArrow: true
                        }
                    }
                }
            })
            this.graph.data(this.chartData)
            this.graph.render()
            this.graph.on('edge:click', (ev) => {
                console.log('点击边了吗', ev)
                this.$emit('handleEdge', ev.item._cfg.id)
            })
            this.graph.on('node:click', (ev) => {
                const shape = ev.target
                const node = ev.item
                this.$emit('click', node)
                // alert(`你点击的节点是${node._cfg.model.label},节点坐标X:${node._cfg.model.x},Y:${node._cfg.model.y}`)
            })
        },
        changeData() {
            // this.graph.refresh()
            this.graph.changeData(this.chartData, false)
        },
        save() {
            const _t = this
            const changeData = _t.graph.save()
            console.log(JSON.stringify(changeData))
        }
    }
}
</script>

<style lang="scss" scoped>
#container {
    width: 100%;
    height: 400px;
    border: 1px solid #DADEE8;

}
#container  ::v-deep .g6-component-contextmenu .out .cell {
    &:hover {
        color: #5faee3 !important;
    }
}

</style>
