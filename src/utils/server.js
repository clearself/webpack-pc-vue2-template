import axios from 'axios'
import router from '../router/index'
import store from '@/store/index'
import { Notification } from 'element-ui'
import { getAjax, getAjaxDownLoad } from '@/utils/http'
import md5 from 'js-md5'
import { getlocalStorage, removelocalStorage, setlocalStorage } from '@/assets/js/public_fun.js'
import { addPendingRequest, removePendingRequest } from './cancel'
const isObject = obj => obj !== null && typeof obj === 'object'
// 创建axios实例
const service = axios.create({
    baseURL: '/api/',
    timeout: 10 * 60 * 1000
})
const exculdUrls = [
    'base-server/terminal/getUserConfig',
    'base-server/loginUser',
    'base-server/forgetPassword',
    'base-server/sendCode'
]
console.log(process.env.NODE_ENV)
// request拦截器
service.interceptors.request.use(
    (config) => {
        console.log(config, '111')
        // console.log(config, '请求头')
        if (!config.immediate) {
            removePendingRequest(config) // 检查是否存在重复请求，若存在则取消已发的请求
            addPendingRequest(config) // 把当前请求添加到pendingRequest对象中
        }
        /* ----添加token---*/
        if (!exculdUrls.includes(config.url)) {
            console.log(getlocalStorage('initInfo'))
            let initInfo = getlocalStorage('initInfo')
            console.log(initInfo)
            if (initInfo && initInfo.user && initInfo.user.token) {
                config.headers.token = initInfo.user.token
            }
        }
        /* ----测试环境加签---*/
        if (config.method === 'post') {
            console.log(config.data)
            let data = JSON.parse(JSON.stringify(config.data))
            let tempTag = {} // 升序后生成sign
            let keys = Object.keys(data).sort()
            keys.forEach(item => {
                if (data[item] !== null) {
                    if (isObject(data[item])) {
                        tempTag[item] = JSON.stringify(data[item])
                    } else {
                        tempTag[item] = data[item]
                    }
                }
            })
            let str = ''
            for (let attr in tempTag) {
                str += '&' + attr + '=' + tempTag[attr]
            }
            str = str.substring(1)
            console.log('strstrstr', str)
            let timestamp = Date.now()
            let sign
            if (str) {
                if (!exculdUrls.includes(config.url)) {
                    let initInfo = getlocalStorage('initInfo')
                    if (initInfo && initInfo.user && initInfo.user.token) {
                        str = str + '&timestamp=' + timestamp + '&key=' + initInfo.user.token
                    }
                } else {
                    str = str + '&timestamp=' + timestamp
                }
            }
            console.log(str, '我是字符串')
            sign = str ? md5(str) : ''

            if (sign) {
                config.headers.sign = sign
                config.headers.timestamp = timestamp
            }

            console.log('body参数加签', config.data)
        }

        if (config.method === 'post' && config.headers['Content-Type']) {
            // eslint-disable-next-line no-self-assign
            config.headers['Content-Type'] = config.headers['Content-Type']
        } else {
            config.headers['Content-Type'] = 'application/json'
        }

        return config
    },
    (error) => {
        // Do something with request error
        console.log(error) // for debug
        Promise.reject(error)
    }
)
// response 拦截器
service.interceptors.response.use(
    (response) => {
        console.log(response)
        const code = response.status
        if (!response.config.immediate) {
            removePendingRequest(response.config) // 从pendingRequest对象中移除请求
        }
        if (code >= 200 && code < 300) {
            if (response.config.responseType === 'blob' || response.config.responseType === 'arraybuffer') {
                return getAjaxDownLoad(response)
            } else {
                return getAjax(response.data)
            }
        } else {
            Notification.error({
                title: response.data.message
            })
            return Promise.reject(response.data.message)
        }
    },
    (error) => {
        let code = 0
        console.dir(error, '错误')
        try {
            code = error?.response?.data?.code
            removePendingRequest(error.config || {}) // 从pendingRequest对象中移除请求
            if (axios.isCancel(error)) {
                console.log('已取消的重复请求：' + error.message)
                error.isCancel = true
                return Promise.reject(error)
            }
        } catch (e) {
            if (error.toString().indexOf('Error: timeout') !== -1) {
                Notification.error({
                    title: '网络请求超时',
                    duration: 2500
                })
                return Promise.reject(error)
            }
            if (error.toString().indexOf('Error: Network Error') !== -1) {
                Notification.error({
                    title: '网络请求错误',
                    duration: 2500
                })
                return Promise.reject(error)
            }
        }
        if (code === 401) {
            router.push({ path: '/401' })
            // 需要创建401页面
            // router.push({ path: '/401' })
        } else if (code === 403) {
            // 需要创建403页面
            // router.push({ path: '/403' })
        } else if (code === 404) {
            // 需要创建404页面
            // router.push({ path: '/404' })
        } else {
            console.log(error)
            const errorMsg = error.response.data.message
            if (errorMsg === '不允许访问') {
                // 需要创建401页面
                // router.push({ path: '/401' })
            }
        }
        return Promise.reject(error)
    }
)

export default service
