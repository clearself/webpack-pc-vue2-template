import request from '@/utils/server'
import axios from 'axios'
const CancelToken = axios.CancelToken
const timeoutData = 24 * 60 * 60000

// 任务执行列表查询
export const autoOrderPage = (data) => {
    return request({
        url: 'auto-respond/manage/autoDrama/page',
        method: 'post',
        data: data.paramsData,
        params: data.queryData
    })
}
// 任务执行列表撤销
export const autoOrderStop = (data) => {
    return request({
        url: 'auto-respond/manage/autoDrama/stop',
        method: 'post',
        data: data.paramsData,
        params: data.queryData
    })
}
// 查询我的任务
export const myTaskPage = (data) => {
    return request({
        url: 'auto-respond/manage/myTask/page',
        method: 'post',
        data: data.paramsData,
        params: data.queryData
    })
}
// 去处理获取详情信息
export const myTaskGetInfo = (data) => {
    return request({
        url: 'auto-respond/manage/myTask/getInfo',
        method: 'get',
        data: data.paramsData,
        params: data.queryData
    })
}
// 审批
export const autoOrderApprove = (data) => {
    return request({
        url: 'auto-respond/manage/autoDrama/approve',
        method: 'post',
        data: data.paramsData,
        params: data.queryData
    })
}
// 综合查询获取字段
export const getFieldByAll = (data) => {
    return request({
        url: 'auto-respond/manage/myTask/getAllField',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 获取用户自定义字段
export const getUserField = (data) => {
    return request({
        url: 'auto-respond/manage/myTask/getUserField',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 数据查询列表
export const getList = (data, cancelObj) => {
    return request({
        url: 'auto-respond/manage/myTask/searchLog',
        method: 'post',
        params: data.queryData,
        data: data.paramsData,
        cancelToken: new CancelToken(function executor(c) {
            // executor 函数接收一个 cancel 函数作为参数
            cancelObj.cancel = c
        })
    })
}
// 获取展开字段日志详情
export const getExpandLog = (data) => {
    return request({
        url: 'auto-respond/manage/myTask/getLogById',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 告警列表字段添加
export const updateAlarmFields = (data) => {
    return request({
        url: 'auto-respond/manage/myTask/saveOtherField',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 动作执行列表
export const actionRecordPage = (data) => {
    return request({
        url: 'auto-respond/manage/actionRecord/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 动作执行列表查询设备
export const actionRecordGetList = (data) => {
    return request({
        url: 'auto-respond/manage/actionRecord/getList',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 重发
export const autoDramaRetransmission = (data) => {
    return request({
        url: 'auto-respond/manage/autoDrama/retransmission',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 查看流程图详情
export const getDealContent = (data) => {
    return request({
        url: 'auto-respond/manage/myTask/getDealContent',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 已办列表
export const getDonePage = (data) => {
    return request({
        url: 'auto-respond/manage/myTask/getDonePage',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
