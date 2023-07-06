
import request from '@/utils/server'
// 查询分组树
export const findSearchTypeChart = (data) => {
    return request({
        url: 'data-center/manage/groupManage/findSearchType',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 获取所有字段
export const saveSearchTypeChart = (data) => {
    return request({
        url: 'data-center/manage/groupManage/saveSearchType',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 获取所有字段
export const deleteSearchType = (data) => {
    return request({
        url: 'data-center/manage/groupManage/deleteSearchType',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 添加图表
export const addDashboardChart = (data) => {
    return request({
        url: 'data-center/manage/searchChart/addDashboardChart',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 分页查询图表
export const pageDashboardChart = (data) => {
    return request({
        url: 'data-center/manage/searchChart/pageDashboardChart',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 删除图表
export const deleteDashboardChart = (data) => {
    return request({
        url: 'data-center/manage/searchChart/deleteDashboardChart',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

