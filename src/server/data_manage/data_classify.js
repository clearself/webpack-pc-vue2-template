import request from '@/utils/server'

// 获取所有字段
export const getAllFiled = (data) => {
    return request({
        url: 'data-center/manage/logType/getAllFiled',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 获取设备树
export const getAssetsType = (data) => {
    return request({
        url: 'data-center/manage/logType/getAssetsType',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 获取厂商
export const getManufacturer = (data) => {
    return request({
        url: 'data-center/manage/logType/getManufacturer',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 一级保存
export const updateParent = (data) => {
    return request({
        url: 'data-center/manage/logType/updateParent',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 子级保存
export const saveChild = (data) => {
    return request({
        url: 'data-center/manage/logType/saveChild',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 子级修改
export const updateChild = (data) => {
    return request({
        url: 'data-center/manage/logType/updateChild',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 左侧树
export const getTree = (data) => {
    return request({
        url: 'data-center/manage/logType/getTree',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 点击树获取详情
export const getDetail = (data) => {
    return request({
        url: 'data-center/manage/logType/getDetail',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 新增厂商
export const saveManufacturer = (data) => {
    return request({
        url: 'data-center/manage/logType/saveManufacturer',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 获取所有字段
export const getAllField = (data) => {
    return request({
        url: 'data-center/manage/logType/getAllField',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 删除
export const deleteData = (data) => {
    return request({
        url: 'data-center/manage/logType/delete',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 导出
export const download = (data) => {
    return request({
        url: 'data-center/manage/logType/download',
        method: 'post',
        params: data.queryData,
        data: data.paramsData,
        responseType: 'blob'
    })
}
// 添加时获取字段属性详情
export const getDetailByBusId = (data) => {
    return request({
        url: 'data-center/manage/logType/getDetailByBusId',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
