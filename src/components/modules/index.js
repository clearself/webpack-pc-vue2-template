import Vue from 'vue'
import backTop from './backTop/index.js'
// import KSwitch from './KSwitch/index.js'

import { searchBtn, cancelBtn } from './searchBtn/index.js'
import angleBtn from './angleBtn/index.js'
import personnel from './personnel/index.js'
import qmBtn from './qmBtn/index.js'
import optBtn from './optBtn/index.js'
import switchBtn from './switchBtn/index.js'
import OrgSearch from './OrgSearch/index.js'
import TimeSelect from './TimeSelect/index.js'

import { addBtn, otherBtn, deleteBtn, loadBtn } from './colorBtn/index.js'
import codeEdit from './codeEdit/index.js'
import DivEditable from './div-editable/index.js'
const components = [
    backTop,
    searchBtn,
    angleBtn,
    cancelBtn,
    addBtn,
    otherBtn,
    deleteBtn,
    loadBtn,
    personnel,
    qmBtn,
    codeEdit,
    DivEditable,
    optBtn,
    switchBtn,
    OrgSearch,
    TimeSelect
    // KSwitch
]
const install = function(Vue) {
    components.map(component => {
        Vue.component(component.name, component)
    })
}

install(Vue)

export default {
    version: '0.0.1',
    backTop,
    searchBtn,
    angleBtn,
    cancelBtn,
    addBtn,
    otherBtn,
    deleteBtn,
    loadBtn,
    personnel,
    qmBtn,
    codeEdit,
    DivEditable,
    optBtn,
    switchBtn,
    OrgSearch,
    TimeSelect
    // KSwitch
}
