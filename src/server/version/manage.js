import request from '@/utils/server'

// 发布版本
export const publish = (data) => {
    return request({
        url: 'im/manage/versions/publish',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 编辑
export const update = (data) => {
    return request({
        url: 'im/manage/versions/update',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 删除
export const del = (data) => {
    return request({
        url: 'im/manage/versions/del',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 分页
export const getPages = (data) => {
    return request({
        url: 'im/manage/versions/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 下载地址
export const getUrl = (data) => {
    return request({
        url: 'im/manage/versions/download',
        method: 'get',
        params: data.queryData,
        data: data.paramsData
    })
}

// 上传
export const upload = (data) => {
    return request({
        url: 'im/file/upload',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 检查更新
export const checkUp = (data) => {
    return request({
        url: 'im/manage/versions/checkForUp',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
