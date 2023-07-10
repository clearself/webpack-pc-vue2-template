import axios from 'axios'
// import { getAjax, getAjaxDownLoad } from '@/utils/http'
import request from '@/utils/server'
const CancelToken = axios.CancelToken
const timeoutData = 24 * 60 * 60000

// 历史查询-分组树形查询
export const findSearchType = (data) => {
    return request({
        url: 'data-center/manage/syslog/findSearchType',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 历史查询-分组保存和修改
export const saveSearchType = (data) => {
    return request({
        url: 'data-center/manage/syslog/saveSearchType',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 历史查询-分组删除
export const deleteSearchType = (data) => {
    return request({
        url: 'data-center/manage/syslog/deleteSearchType',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 历史查询-保存
export const saveSearchHistory = (data) => {
    return request({
        url: 'data-center/manage/syslog/saveSearchHistory',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 历史查询-分页列表
export const pageSearchHistory = (data) => {
    return request({
        url: 'data-center/manage/syslog/pageSearchHistory',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 历史查询-删除
export const deleteSearchHistory = (data) => {
    return request({
        url: 'data-center/manage/syslog/deleteSearchHistory',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 刷新时间-添加时间
export const saveLogTime = (data) => {
    return request({
        url: 'data-center/manage/logTime/saveLogTime',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 刷新时间-添加时间
export const getLogTime = (data) => {
    return request({
        url: 'data-center/manage/logTime/getLogTime',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 刷新时间-删除时间
export const deleteLogTime = (data) => {
    return request({
        url: 'data-center/manage/logTime/deleteLogTime',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 离线任务-分页
export const pageSearchTask = (data) => {
    return request({
        url: 'data-center/manage/syslog/pageSearchTask',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 离线任务-保存
export const saveSearchTask = (data) => {
    return request({
        url: 'data-center/manage/syslog/saveSearchTask',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 离线任务-删除
export const deleteSearchTask = (data) => {
    return request({
        url: 'data-center/manage/syslog/deleteSearchTask',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 离线任务-开始暂停
export const startOrStop = (data) => {
    return request({
        url: 'data-center/manage/syslog/startOrStop',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 高亮保存
export const saveHighlight = (data) => {
    return request({
        url: 'data-center/manage/highlight/saveLogHighlight',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 高亮查询
export const getHighlight = (data) => {
    return request({
        url: 'data-center/manage/highlight/getLogHighlight',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 智能搜索
export const getAllField = (data) => {
    return request({
        url: 'data-center/manage/syslog/getAllField',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const getGroupField = (data) => {
    return request({
        url: 'data-center/manage/syslog/getGroupField',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 发起告警-获取告警类型
export const getAlarmType = (data) => {
    return request({
        url: 'data-center/manage/syslog/getAlarmType',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 发起告警-获取工单模板
export const getAlarmWorkMould = (data) => {
    return request({
        url: 'data-center/manage/syslog/getAlarmWorkMould',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 发起告警
export const saveAlarm = (data) => {
    return request({
        url: 'data-center/manage/syslog/saveAlarm',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 数据分类树形查询
export const getDataTree = (data) => {
    return request({
        url: 'data-center/manage/syslog/getLogTypeTree',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 根据数据分类获取字段
export const getFieldByType = (data) => {
    return request({
        url: 'data-center/manage/syslog/getFieldByType',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 综合查询获取字段
export const getFieldByAll = (data) => {
    return request({
        url: 'data-center/manage/syslog/getAllField',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 获取用户自定义字段
export const getUserField = (data) => {
    return request({
        url: 'data-center/manage/syslog/getUserField',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 保存自定义字段
export const saveUserField = (data) => {
    return request({
        url: 'data-center/manage/syslog/saveUserField',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 过滤条件转 sql
export const getFilterSql = (data) => {
    return request({
        url: 'data-center/manage/syslog/getFilterSql',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 数据查询列表
export const getList = (data, cancelObj) => {
    return request({
        url: 'data-center/manage/syslog/searchLog',
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
        url: 'data-center/manage/syslog/getLogInfo',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 获取字段 top10
export const getTopField = (data) => {
    return request({
        url: 'data-center/manage/syslog/searchTop',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 日志暂存-添加
export const saveLogIds = (data) => {
    return request({
        url: 'data-center/manage/logQuery/saveLogIds',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 创建pacp包任务
export const createTask = (data) => {
    return request({
        url: 'data-center/manage/syslog/createTask',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 获取展开字段日志详情
export const getExpandLog = (data) => {
    return request({
        url: 'data-center/manage/syslog/getLogById',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 导出
export const download = (data) => {
    return request({
        url: 'data-center/manage/syslog/download',
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
        url: 'data-center/manage/logQuery/download',
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
        url: 'data-center/manage/syslog/viewPcap',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const getTableChart = (data) => {
    return request({
        url: 'data-center/manage/syslog/statisticsLog',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 单个添加时候搜索
export const searchFieldVal = (data) => {
    return request({
        url: 'data-center/manage/syslog/searchFieldVal',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

