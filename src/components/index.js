import Vue from 'vue'
import SearchTop from '@/components/SearchTop'
import Breadcrumb from '@/components/Breadcrumb'
import Pagination from '@/components/Pagination'
import DeleteDialog from '@/components/DeleteDialog'
import KSwitch from '@/components/KSwitch'
const components = [
    SearchTop,
    Breadcrumb,
    Pagination,
    DeleteDialog,
    KSwitch
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
