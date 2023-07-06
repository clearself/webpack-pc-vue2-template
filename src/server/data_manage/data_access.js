import request from '@/utils/server'

// 获取所有字段
export const list = (data) => {
    return request({
        url: 'data-center/manage/dataAccess/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 保存
export const saveData = (data) => {
    return request({
        url: 'data-center/manage/dataAccess/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 编辑
export const update = (data) => {
    return request({
        url: 'data-center/manage/dataAccess/update',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 删除
export const deleteData = (data) => {
    return request({
        url: 'data-center/manage/dataAccess/delete',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 获取工作节点
export const getLogstashNodes = (data) => {
    return request({
        url: 'data-center/manage/dataAccess/getLogstashNodes',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 失效
export const stop = (data) => {
    return request({
        url: 'data-center/manage/dataAccess/stop',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 生效
export const start = (data) => {
    return request({
        url: 'data-center/manage/dataAccess/start',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 发送
export const send = (data) => {
    return request({
        url: 'data-center/manage/dataAccess/send',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 导出
export const download = (data) => {
    return request({
        url: 'data-center/manage/dataAccess/download',
        method: 'post',
        params: data.queryData,
        data: data.paramsData,
        responseType: 'blob'
    })
}

// 获取所有字段
export const getRules = (data) => {
    return request({
        url: 'data-center/manage/dataAccess/getRules',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const downloadLogstash = (data) => {
    return request({
        url: 'data-center/manage/dataAccess/downloadLogstash',
        method: 'get',
        params: data.queryData,
        data: data.paramsData
    })
}
