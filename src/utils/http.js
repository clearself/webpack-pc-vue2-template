
import router from '../router/index'
import { Message, MessageBox } from 'element-ui'
import { setsessionStorage, removelocalStorage, removesessionStorage } from '@/assets/js/public_fun.js'
// import store from '@/store/index'

export const getAjax = (result) => {
    return new Promise((resolve, reject) => {
        if (typeof result.code !== 'undefined' && result.code === 1) {
            resolve(result.data)
        } else {
            if (result.code === 2) {
                // 请求成功但流程不对
                Message({
                    message: result.message,
                    showClose: true,
                    type: 'warning'
                })
            } else if (result.code === 9002) {
                Message({
                    message: result.message,
                    showClose: true,
                    type: 'warning'
                })
            } else if (result.code === 9999) {
                MessageBox.confirm('系统报错，点击查看详情?', '提示', {
                    confirmButtonText: '查看',
                    cancelButtonText: '取消',
                    type: 'warning',
                    customClass: 'confirm-box'
                })
                    .then(() => {
                        setsessionStorage('errorInfo', result.message)
                        router.push('/error')
                    })
                    .catch(() => {})
            } else if (result.code === 9005) {
                if (document.getElementsByClassName('el-message').length === 0) {
                    Message({
                        message: '登录已失效，请重新登录！',
                        showClose: true,
                        type: 'warning'
                    })
                }
                removelocalStorage('initUserInfo')
                removesessionStorage('currentPath')
                router.push('/login')
            } else if (result.code === 9006) {
                if (document.getElementsByClassName('el-message').length === 0) {
                    Message({
                        message: '密码已失效，请重新设置密码！',
                        showClose: true,
                        type: 'warning'
                    })
                }
                removelocalStorage('initUserInfo')
                removesessionStorage('currentPath')
                router.push('/retrieve_password')
            } else {
                Message({
                    message: result.message,
                    showClose: true,
                    type: 'warning'
                })
            }
            reject(result.data)
        }
    })
}

export const getAjaxDownLoad = (result, pacp) => {
    return new Promise((resolve, reject) => {
        if (result !== 'undefined') {
            const data = result.data
            const xhr = result.request
            const headers = xhr.getAllResponseHeaders()
            console.log(headers)
            console.log(data)
            const contentDisposition = xhr.getResponseHeader('Content-Disposition')
            const url = URL.createObjectURL(data)
            const fileName = decodeURI(result.headers['content-disposition'].split(';')[1].split('=')[1])
            const link = document.createElement('a')
            if (pacp) {
                let b = fileName.split('.')
                link.download = `${b[0].replace('"', '')}.pcap`
            } else {
                link.download = fileName
            }
            link.href = url
            link.click()
            link.remove()
            resolve(result)
        } else {
            reject(result)
        }
    })
}

