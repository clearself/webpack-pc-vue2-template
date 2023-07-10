import request from '@/utils/server'
// 查询分组树
export const findSearchType = (data) => {
    return request({
        url: 'yc-data/manage/groupManage/findSearchType',
        method: 'get',
        params: data.queryData,
        data: data.paramsData
    })
}
// 获取所有字段
export const saveSearchType = (data) => {
    return request({
        url: 'yc-data/manage/groupManage/saveSearchType',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 获取所有字段
export const deleteSearchType = (data) => {
    return request({
        url: 'yc-data/manage/groupManage/deleteSearchType',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 添加图表
export const addDashboardChart = (data) => {
    return request({
        url: 'yc-data/manage/searchChart/addDashboardChart',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 分页查询图表
export const pageDashboardChart = (data) => {
    return request({
        url: 'yc-data/manage/searchChart/pageDashboardChart',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 删除图表
export const deleteDashboardChart = (data) => {
    return request({
        url: 'yc-data/manage/searchChart/deleteDashboardChart',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
