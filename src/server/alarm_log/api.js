import axios from 'axios'
// import { getAjax, getAjaxDownLoad } from '@/utils/http'
import request from '@/utils/server'
const CancelToken = axios.CancelToken
const timeoutData = 24 * 60 * 60000

// 历史查询-分组树形查询
export const findSearchType = (data) => {
    return request({
        url: 'data-center/manage/agg/findSearchType',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 历史查询-分组保存和修改
export const saveSearchType = (data) => {
    return request({
        url: 'data-center/manage/agg/saveSearchType',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 历史查询-分组删除
export const deleteSearchType = (data) => {
    return request({
        url: 'data-center/manage/agg/deleteSearchType',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 历史查询-保存
export const saveSearchHistory = (data) => {
    return request({
        url: 'data-center/manage/agg/saveSearchHistory',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 历史查询-分页列表
export const pageSearchHistory = (data) => {
    return request({
        url: 'data-center/manage/agg/pageSearchHistory',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 历史查询-删除
export const deleteSearchHistory = (data) => {
    return request({
        url: 'data-center/manage/agg/deleteSearchHistory',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 刷新时间-添加时间
export const saveLogTime = (data) => {
    return request({
        url: 'data-center/manage/agg/saveLogTime',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 刷新时间-添加时间
export const getLogTime = (data) => {
    return request({
        url: 'data-center/manage/agg/getLogTime',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 刷新时间-删除时间
export const deleteLogTime = (data) => {
    return request({
        url: 'data-center/manage/agg/deleteLogTime',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 离线任务-分页
export const pageSearchTask = (data) => {
    return request({
        url: 'data-center/manage/agg/pageSearchTask',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 离线任务-保存
export const saveSearchTask = (data) => {
    return request({
        url: 'data-center/manage/agg/saveSearchTask',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 离线任务-删除
export const deleteSearchTask = (data) => {
    return request({
        url: 'data-center/manage/agg/deleteSearchTask',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 离线任务-开始暂停
export const startOrStop = (data) => {
    return request({
        url: 'data-center/manage/agg/startOrStop',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 高亮保存
export const saveHighlight = (data) => {
    return request({
        url: 'data-center/manage/agg/saveLogHighlight',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 高亮查询
export const getHighlight = (data) => {
    return request({
        url: 'data-center/manage/agg/getLogHighlight',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 智能搜索
export const getAllField = (data) => {
    return request({
        url: 'data-center/manage/agg/getAllField',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const getGroupField = (data) => {
    return request({
        url: 'data-center/manage/agg/getGroupField',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 发起告警-获取告警类型
export const getAlarmType = (data) => {
    return request({
        url: 'data-center/manage/agg/getAlarmType',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 发起告警-获取工单模板
export const getAlarmWorkMould = (data) => {
    return request({
        url: 'data-center/manage/agg/getAlarmWorkMould',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 发起告警
export const saveAlarm = (data) => {
    console.log(data)
    return request({
        url: 'data-center/manage/agg/saveAlarm',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 数据分类树形查询
export const getDataTree = (data) => {
    return request({
        url: 'data-center/manage/agg/getLogTypeTree',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 根据数据分类获取字段
export const getFieldByType = (data) => {
    return request({
        url: 'data-center/manage/agg/getFieldByType',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 综合查询获取字段
export const getFieldByAll = (data) => {
    return request({
        url: 'data-center/manage/agg/getAllField',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 获取用户自定义字段
export const getUserField = (data) => {
    return request({
        url: 'data-center/manage/agg/getUserField',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 保存自定义字段
export const saveUserField = (data) => {
    return request({
        url: 'data-center/manage/agg/saveUserField',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 过滤条件转 sql
export const getFilterSql = (data) => {
    return request({
        url: 'data-center/manage/agg/getFilterSql',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 数据查询列表
export const getList = (data, cancelObj) => {
    return request({
        url: 'data-center/manage/agg/searchLog',
        method: 'post',
        params: data.queryData,
        data: data.paramsData,
        cancelToken: new CancelToken(function executor(c) {
            // executor 函数接收一个 cancel 函数作为参数
            cancelObj.cancel = c
        })
    })
}

// 告警所有数据
export const getLogInfo = (data) => {
    return request({
        url: 'data-center/manage/agg/getLogInfo',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 获取字段 top10
export const getTopField = (data) => {
    return request({
        url: 'data-center/manage/agg/searchTop',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 日志暂存-添加
export const saveLogIds = (data) => {
    return request({
        url: 'data-center/manage/agg/saveLogIds',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 创建pacp包任务
export const createTask = (data) => {
    return request({
        url: 'data-center/manage/agg/createTask',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 获取展开字段日志详情
export const getExpandLog = (data) => {
    return request({
        url: 'data-center/manage/agg/getLogById',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 导出
export const download = (data) => {
    return request({
        url: 'data-center/manage/agg/export',
        method: 'post',
        params: data.queryData,
        data: data.paramsData,
        timeout: timeoutData,
        responseType: 'blob'
    })
}

// 暂存导出
export const downloadTwo = (data) => {
    return request({
        url: 'data-center/manage/agg/download',
        method: 'post',
        params: data.queryData,
        data: data.paramsData,
        timeout: timeoutData,
        responseType: 'blob'
    })
}

// 查询pcap
export const viewPcap = (data) => {
    return request({
        url: 'data-center/manage/agg/viewPcap',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const getTableChart = (data) => {
    return request({
        url: 'data-center/manage/agg/statisticsLog',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 单个添加时候搜索
export const searchFieldVal = (data) => {
    return request({
        url: 'data-center/manage/agg/searchFieldVal',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 查询单条日志详情
export const getLogById = (data) => {
    return request({
        url: 'data-center/manage/agg/getLogById',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 查询单条日志的原始日志
export const getAggLog = (data) => {
    return request({
        url: 'data-center/manage/agg/getAggLog',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 查询单条日志的资产
export const getAssetsInfo = (data) => {
    return request({
        url: 'data-center/manage/agg/getAssetsInfo',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 查询单条日志的资产
export const getAggLogById = (data) => {
    return request({
        url: 'data-center/manage/agg/getAggLogById',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 获取流量日志
export const getYcData = (data) => {
    return request({
        url: 'data-center/manage/agg/getYcData',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 获取流量日志详情
export const getYcInfo = (data) => {
    return request({
        url: 'data-center/manage/agg/getYcInfo',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 获取全部字段
export const getYcField = (data) => {
    return request({
        url: 'data-center/manage/agg/getYcField',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 获取KEY
export const getKey = (data) => {
    return request({
        url: 'yc-data/manage/search/getKey',
        method: 'get',
        params: data.queryData,
        data: data.paramsData
    })
}
// 创建PCAP
export const downloadLogPacket = (data, pacp) => {
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
// 创建图表时获取维度字段和度量
export const getSortField = (data) => {
    return request({
        url: 'data-center/manage/chartSet/getGjSortField',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

