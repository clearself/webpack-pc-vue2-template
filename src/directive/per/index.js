
import per from './permission.js'

const install = function(Vue) {
    Vue.directive('per', per)
}

if (window.Vue) {
    window.per = per
    Vue.use(install); // eslint-disable-line
}

per.install = install
export default per
