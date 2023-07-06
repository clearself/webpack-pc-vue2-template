// EventUtil.js
export default {
    // 添加事件
    addHandler(element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false)
        } else if (element.attachEvent) {
            element.attachEvent(`on${type}`, handler)
        } else {
            element[`on${type}`] = handler
        }
    },
    // 取消事件
    removeHandler(element, type, handler) {
        if (element.removeEventListener) {
            element.removeEventListener(type, handler, false)
        } else if (element.detachEvent) {
            element.detachEvent(`on${type}`, handler)
        } else {
            element[`on${type}`] = null
        }
    },
    // 跨浏览器取得event对象
    getEvent(event) {
        return event || window.event
    },
    // 返回事件的实际目标
    getTarget(event) {
        return event.target || event.srcElement
    },
    // 阻止事件的默认行为
    preventDefault(event) {
        if (event.preventDefault) {
            event.preventDefault()
        } else {
            event.returnValue = false
        }
    },
    // 立即停止事件在DOM中的传播
    stopPropagation(event) {
    // 避免触发注册在document.body上面的事件处理程序
        if (event.stopPropagation) {
            event.stopPropagation()
        } else {
            event.cancelBubble = true
        }
    },
    // 获取mouseover和mouseout相关元素
    getRelatedTarget(event) {
        if (event.relatedTarget) {
            return event.relatedTarget
        } else if (event.toElement) { // 兼容IE8-
            return event.toElement
        } else if (event.formElement) {
            return event.formElement
        } else {
            return null
        }
    },
    // 获取mousedown或mouseup按下或释放的按钮是鼠标中的哪一个
    getButton(event) {
        if (document.implementation.hasFeature('MouseEvents', '2.0')) {
            return event.button
        } else {
            switch (event.button) { // 将IE模型下的button属性映射为DOM模型下的button属性
                case 0:
                case 1:
                case 3:
                case 5:
                case 7:
                    return 0 // 按下的是鼠标主按钮（一般是左键）
                case 2:
                case 6:
                    return 2 // 按下的是中间的鼠标按钮
                case 4:
                    return 1 // 鼠标次按钮（一般是右键）
            }
        }
    },
    // 获取表示鼠标滚轮滚动方向的数值
    getWheelDelta(event) {
        if (event.wheelDelta) {
            return event.wheelDelta
        } else {
            return -event.detail * 40
        }
    },
    // 以跨浏览器取得相同的字符编码，需在keypress事件中使用
    getCharCode(event) {
        if (typeof event.charCode === 'number') {
            return event.charCode
        } else {
            return event.keyCode
        }
    }
}
