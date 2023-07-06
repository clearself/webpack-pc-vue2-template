import Vue from 'vue'
import SearchTop from '@/components/SearchTop'
import Breadcrumb from '@/components/Breadcrumb'
import Pagination from '@/components/Pagination'
import DeleteDialog from '@/components/DeleteDialog'
import StateDialog from '@/components/stateDialog'
import KSwitch from '@/components/KSwitch'
import VClamp from '@/components/Clamp'
const components = [
    SearchTop,
    Breadcrumb,
    Pagination,
    DeleteDialog,
    KSwitch,
    StateDialog,
    VClamp
]

const install = function(Vue) {
    components.map((component) => {
        Vue.component(component.name, component)
    })
}
install(Vue)

export default {
    ...components
}
