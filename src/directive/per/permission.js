import store from '@/store'
function checkPermission(el, binding) {
    // console.log(el, binding)
    // console.log(store.state.user.per, 'vuexxxxxxxxxxxxxxxxxxxx')
    // console.log('按钮文字', el.innerText)
    // console.log(el.lastElementChild.innerText)
    // el.lastElementChild.innerText = '文字'
    const { value } = binding
    const per = store.getters && store.getters.per
    if (!per.length) {
        el.lastElementChild.innerText = ''
        return
    }
    if (value && value instanceof Array) {
        if (value.length > 0) {
            const permissionRoles = value
            const hasPermission = per.some(item => permissionRoles[0] === item.code)
            if (!hasPermission) {
                el.parentNode && el.parentNode.removeChild(el)
            } else {
                let curBtn = per.filter(item => permissionRoles[0] === item.code)[0]
                el.lastElementChild.innerText = curBtn.name
            }
        }
    }
}

export default {
    inserted(el, binding) {
        checkPermission(el, binding)
    },
    update(el, binding) {
        checkPermission(el, binding)
    }
}
