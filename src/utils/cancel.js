import axios from 'axios'
import Qs from 'qs'
const pendingRequest = new Map()

function generateReqKey(config) {
    const { method, url, params, data } = config
    return [method, url, Qs.stringify(params), Qs.stringify(data)].join(
        '&'
    )
}

function addPendingRequest(config) {
    const requestKey = generateReqKey(config)
    config.cancelToken =
        config.cancelToken ||
        new axios.CancelToken((cancel) => {
            if (!pendingRequest.has(requestKey)) {
                pendingRequest.set(requestKey, cancel)
            }
        })
}

function removePendingRequest(config) {
    const requestKey = generateReqKey(config)
    if (pendingRequest.has(requestKey)) {
        const cancel = pendingRequest.get(requestKey)
        cancel(requestKey)
        pendingRequest.delete(requestKey)
    }
}
export {
    generateReqKey,
    addPendingRequest,
    removePendingRequest
}
