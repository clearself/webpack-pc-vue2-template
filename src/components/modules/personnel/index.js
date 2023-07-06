import personnel from './personnel.vue'

/* istanbul ignore next */
personnel.install = function(Vue) {
    Vue.component(personnel.name, personnel)
}

export default personnel
