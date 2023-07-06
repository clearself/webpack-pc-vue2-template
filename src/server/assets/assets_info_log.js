import axios from 'axios'
import request from '@/utils/server'
const CancelToken = axios.CancelToken
const timeoutData = 24 * 60 * 60000

export const getExpandLog = (data) => {
    return request({
        url: 'assets-manage/manage/syslogAssets/getLogById',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const getFieldByAll = (data) => {
    return request({
        url: 'assets-manage/manage/syslogAssets/getAllField',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const getFilterSql = (data) => {
    return request({
        url: 'assets-manage/manage/syslogAssets/getFilterSql',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const getList = (data, cancelObj) => {
    return request({
        url: 'assets-manage/manage/syslogAssets/searchLog',
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
        url: 'assets-manage/manage/syslogAssets/statisticsLog',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 创建pacp包任务
export const createTask = (data) => {
    return request({
        url: 'assets-manage/manage/syslogAssets/createTask',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
