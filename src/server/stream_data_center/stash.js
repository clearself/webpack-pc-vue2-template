import axios from 'axios'
import request from '@/utils/server'
const timeoutData = 24 * 60 * 60000

// 获取暂存列表字段
export const getLogStorageField = (data) => {
    return request({
        url: 'yc-data/manage/logStorage/getLogStorageField',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 获取暂存列表数据
export const pageLogStorage = (data) => {
    return request({
        url: 'yc-data/manage/logStorage/pageLogStorage',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 删除暂存日志
export const deleteLogStorage = (data) => {
    return request({
        url: 'yc-data/manage/logStorage/deleteLogStorage',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 下载日志暂存
export const downloadLogStorage = (data) => {
    return request({
        url: 'yc-data/manage/logStorage/downloadLogStorage',
        method: 'post',
        params: data.queryData,
        data: data.paramsData,
        timeout: timeoutData,
        responseType: 'blob'
    })
}
// 修改暂存日志表头
export const updateLogStorageField = (data) => {
    return request({
        url: 'yc-data/manage/logStorage/updateLogStorageField',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
