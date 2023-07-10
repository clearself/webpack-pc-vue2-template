import axios from 'axios'
// import { getAjax, getAjaxDownLoad } from '@/utils/http'
import request from '@/utils/server'
const CancelToken = axios.CancelToken
const timeoutData = 24 * 60 * 60000

// 获取所有字段
export const getFieldByAll = (data) => {
    return request({
        url: 'yc-data/manage/search/getAllField',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 获取当前用户字段
export const getUserField = (data) => {
    return request({
        url: 'yc-data/manage/search/getUserField',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 保存用户字段
export const saveUserField = (data) => {
    return request({
        url: 'yc-data/manage/search/saveUserField',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 自定义时间添加
export const saveLogTime = (data) => {
    return request({
        url: 'yc-data/manage/logTime/saveLogTime',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 自定义时间查询
export const getLogTime = (data) => {
    return request({
        url: 'yc-data/manage/logTime/getLogTime',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 自定义时间删除
export const deleteLogTime = (data) => {
    return request({
        url: 'yc-data/manage/logTime/deleteLogTime',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 保存高亮词
export const saveLogHighlight = (data) => {
    return request({
        url: 'yc-data/manage/highlight/saveLogHighlight',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 查询高亮词
export const getLogHighlight = (data) => {
    return request({
        url: 'yc-data/manage/highlight/getLogHighlight',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 历史查询-分页列表
export const pageSearchHistory = (data) => {
    return request({
        url: 'yc-data/manage/search/pageSearchHistory',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 历史查询-删除
export const deleteSearchHistory = (data) => {
    return request({
        url: 'yc-data/manage/search/deleteSearchHistory',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 历史查询-保存
export const saveSearchHistory = (data) => {
    return request({
        url: 'yc-data/manage/search/saveSearchHistory',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 分组-保存和修改
export const saveSearchType = (data) => {
    return request({
        url: 'yc-data/manage/search/saveSearchType',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 分组-树形查询
export const findSearchType = (data) => {
    return request({
        url: 'yc-data/manage/search/findSearchType',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 分组-删除
export const deleteSearchType = (data) => {
    return request({
        url: 'yc-data/manage/search/deleteSearchType',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 查询图表分组树
export const findSearchType1 = (data) => {
    return request({
        url: 'yc-data/manage/groupManage/findSearchType',
        method: 'get',
        params: data.queryData,
        data: data.paramsData
    })
}
// 日志查询
export const getList = (data, cancelObj) => {
    return request({
        url: 'yc-data/manage/search/searchLog',
        method: 'post',
        params: data.queryData,
        data: data.paramsData,
        cancelToken: new CancelToken(function executor(c) {
            // executor 函数接收一个 cancel 函数作为参数
            cancelObj.cancel = c
        })
    })
}
// TOP10
export const getTopField = (data) => {
    return request({
        url: 'yc-data/manage/search/searchTop',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 过滤条件转 sql
export const getFilterSql = (data) => {
    return request({
        url: 'yc-data/manage/search/getFilterSql',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 获取日志详情
export const getLogById = (data) => {
    return request({
        url: 'yc-data/manage/search/getLogById',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
//
export const getGroupField = (data) => {
    return request({
        url: 'yc-data/manage/search/getGroupField',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 查询图表
export const getTableChart = (data) => {
    return request({
        url: 'yc-data/manage/search/statisticsLog',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 添加暂存
export const saveLogStorage = (data) => {
    return request({
        url: 'yc-data/manage/logStorage/saveLogStorage',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 获取KEY
export const getKey = (data) => {
    return request({
        url: 'yc-data//manage/search/getKey',
        method: 'get',
        params: data.queryData,
        data: data.paramsData
    })
}
// 创建PCAP
export const downloadLogPacket = (data) => {
    return request({
        url: 'yun-che/pub/api/flowApi/downloadLogPacket',
        method: 'post',
        params: data.queryData,
        data: [data.paramsData],
        timeout: timeoutData,
        responseType: 'blob',
        baseURL: ''
    })
}
// 下载日志
export const download = (data) => {
    return request({
        url: 'yc-data/manage/search/downloadLog',
        method: 'post',
        params: data.queryData,
        data: data.paramsData,
        timeout: timeoutData,
        responseType: 'blob'
    })
}

export const getMenace = (data) => {
    return request({
        url: 'yc-data/manage/search/getMenace',
        method: 'get',
        params: data.queryData,
        data: data.paramsData
    })
}
