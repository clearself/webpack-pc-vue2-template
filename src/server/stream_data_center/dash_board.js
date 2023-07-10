// import axios from 'axios'
// import {
//     getAjax
// } from '@/utils/http'
import request from '@/utils/server'

// 查询分组树
export const findSearchType = (data) => {
    return request({
        url: 'yc-data/manage/dashboard/findSearchType',
        method: 'get',
        params: data.queryData,
        data: data.paramsData
    })
}

// 添加或修改分组
export const saveSearchType = (data) => {
    return request({
        url: 'yc-data/manage/dashboard/saveSearchType',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 删除分组
export const deleteSearchType = (data) => {
    return request({
        url: 'yc-data/manage/dashboard/deleteSearchType',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 分页查询仪表盘
export const searchPage = (data) => {
    return request({
        url: 'yc-data/manage/dashboard/searchPage',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 查询标签内部信息
export const findTagsContent = (data) => {
    return request({
        url: 'yc-data/manage/dashboardlabel/queryLabel',
        method: 'get',
        params: data.queryData,
        data: data.paramsData
    })
}

// 更新
export const saveAndUpdateTags = (data) => {
    return request({
        url: 'yc-data/manage/dashboardlabel/saveOrUpdateLabel',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 添加仪表盘
export const addDashboard = (data) => {
    return request({
        url: 'yc-data/manage/dashboard/addDashboard',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 编辑仪表盘
export const updateDashboard = (data) => {
    return request({
        url: 'yc-data/manage/dashboard/updateDashboard',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 删除仪表盘
export const deleteDashboard = (data) => {
    return request({
        url: 'yc-data/manage/dashboard/deleteDashboard',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 查询仪表盘是否有默认
export const searchDefault = (data) => {
    return request({
        url: 'yc-data/manage/dashboard/searchDefault',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 查询添加图表时的列表
export const getAddChartListFn = (data) => {
    return request({
        url: 'yc-data/manage/dashboardChart/pageDashboardChart',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 查询添加图表时的分组树形数据
export const findSearchTypeDetail = (data) => {
    return request({
        url: 'yc-data/manage/dashboardChart/findSearchType',
        method: 'get',
        params: data.queryData,
        data: data.paramsData
    })
}

// 查询单个图表数据
export const getChartList = (data) => {
    return request({
        url: 'yc-data/manage/dashboardChart/addDashboardChart',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 刷新时间-添加时间
export const saveLogTime = (data) => {
    return request({
        url: 'yc-data/manage/dashboardlabel/saveLogTime',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 刷新时间-添加时间
export const getLogTime = (data) => {
    return request({
        url: 'yc-data/manage/dashboardlabel/getLogTime',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 刷新时间-删除时间
export const deleteLogTime = (data) => {
    return request({
        url: 'yc-data/manage/dashboardlabel/deleteLogTime',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 智能搜索
export const getAllField = (data) => {
    return request({
        url: 'yc-data/manage/dashboardlabel/getAllField',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const getGroupField = (data) => {
    return request({
        url: 'yc-data/manage/dashboardlabel/getGroupField',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 历史查询-分页列表
export const pageSearchHistory = (data) => {
    return request({
        url: 'yc-data/manage/dashboardlabel/pageSearchHistory',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 综合查询获取字段
export const getFieldByAll = (data) => {
    return request({
        url: 'yc-data/manage/dashboardlabel/getAllField',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 过滤条件转 sql
export const getFilterSql = (data) => {
    return request({
        url: 'yc-data/manage/dashboardlabel/getFilterSql',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 删除标签页
export const deleteLabel = (data) => {
    return request({
        url: 'yc-data/manage/dashboardlabel/deleteLabel',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
