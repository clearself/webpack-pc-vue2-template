import request from '@/utils/server'

// 数据属性--列表
export const getAttrList = (data) => {
    return request({
        url: 'data-center/manage/logField/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 数据属性--新增编辑
export const saveAttrList = (data) => {
    return request({
        url: 'data-center/manage/logField/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 数据属性--编辑
export const updateAttrList = (data) => {
    return request({
        url: 'data-center/manage/logField/update',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 数据属性--删除
export const deleteAttrList = (data) => {
    return request({
        url: 'data-center/manage/logField/delete',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 数据属性--导出
export const downLoad = (data) => {
    return request({
        url: 'data-center/manage/logField/download',
        method: 'post',
        params: data.queryData,
        data: data.paramsData,
        responseType: 'blob'
    })
}
// 动态资源池
export const getPoolSetting = (data) => {
    return request({
        url: 'data-center/manage/poolConfig/get',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const addPoolSetting = (data) => {
    return request({
        url: 'data-center/manage/poolConfig/update',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

