import axios from 'axios'
import request from '@/utils/server'
const CancelToken = axios.CancelToken
const timeoutData = 24 * 60 * 60000

// 资产侧拉告警
export const getExpandLog = (data) => {
    return request({
        url: 'assets-manage/manage/aggAssets/getLogById',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const getFieldByAll = (data) => {
    return request({
        url: 'assets-manage/manage/aggAssets/getAllField',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const getFieldByAllAlarm = (data) => {
    return request({
        url: 'assets-manage/manage/aggAssets/getAllField',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const getFilterSql = (data) => {
    return request({
        url: 'assets-manage/manage/aggAssets/getFilterSql',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const getList = (data, cancelObj) => {
    return request({
        url: 'assets-manage/manage/aggAssets/searchLog',
        method: 'post',
        params: data.queryData,
        data: data.paramsData,
        cancelToken: new CancelToken(function executor(c) {
            // executor 函数接收一个 cancel 函数作为参数
            cancelObj.cancel = c
        })
    })
}

export const getTableChart = (data) => {
    return request({
        url: 'assets-manage/manage/aggAssets/statisticsLog',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const createTask = (data) => {
    return request({
        url: 'assets-manage/manage/aggAssets/createTask',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 刷新时间-添加时间
export const saveLogTime = (data) => {
    return request({
        url: 'assets-manage/manage/alarmTimeAssets/saveLogTime',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 刷新时间-添加时间
export const getLogTime = (data) => {
    return request({
        url: 'assets-manage/manage/alarmTimeAssets/getLogTime',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 刷新时间-删除时间
export const deleteLogTime = (data) => {
    return request({
        url: 'assets-manage/manage/alarmTimeAssets/deleteLogTime',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
