import axios from 'axios'
import request from '@/utils/server'
const CancelToken = axios.CancelToken
const timeoutData = 24 * 60 * 60000

export const get_threat_search = (data) => {
    return request({
        url: 'assets-manage/manage/intelligenceQueryAssets/query',
        method: 'get',
        params: data.queryData,
        data: data.paramsData
    })
}

export const save_header_list = (data) => {
    return request({
        url: 'assets-manage/manage/alarmListAssets/updateHeader',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const add_workTask = (data) => {
    return request({
        url: 'assets-manage/manage/alarmListAssets/createOrder',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const changeAlarmState = (data) => {
    return request({
        url: 'assets-manage/manage/alarmListAssets/changeStatus',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const getAlarmTemp = (data) => {
    return request({
        url: 'assets-manage/manage/alarmListAssets/getWorkMould',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const get_workFlowInfo = (data) => {
    return request({
        url: 'assets-manage/manage/alarmListAssets/getOrderInfo',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const getAlarmList = (data) => {
    return request({
        url: 'assets-manage/manage/alarmListAssets/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 导出内容
export const download = (data) => {
    return request({
        url: 'assets-manage/manage/alarmListAssets/export',
        method: 'post',
        params: data.queryData,
        data: data.paramsData,
        // timeout: timeoutData,
        responseType: 'blob'
    })
}

// 告警删除
export const delete_auto_alarm = (data) => {
    return request({
        url: 'assets-manage/manage/alarmListAssets/delete',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const getMenace = (data) => {
    return request({
        url: 'assets-manage/manage/alarmListAssets/getMenace',
        method: 'get',
        params: data.queryData
    })
}

// 根据目的ip找对应资产
export const ip_searchAsset = (data) => {
    return request({
        url: 'assets-manage/manage/alarmListAssets/getAssetsInfo',
        method: 'post',
        data: data
    })
}

// 获取报送日志
export const getAlarmReportList = (data) => {
    return request({
        url: 'assets-manage/manage/alarmListAssets/getGbAlarm',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const getSearchRulesData = (data) => {
    return request({
        url: 'assets-manage/manage/alarmListAssets/getAllRule',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 获取头部显示字段接口
export const get_header_list = (data) => {
    return request({
        url: 'assets-manage/manage/alarmListAssets/findHeader',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const getSearchResultData = (data) => {
    return request({
        url: 'assets-manage/manage/alarmListAssets/getAttackResult',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const getChart = (data) => {
    return request({
        url: 'assets-manage/manage/alarmListAssets/chart',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 告警类型
export const get_alarm_type_auto = (data) => {
    return request({
        url: 'assets-manage/manage/alarmListAssets/getAlarmType',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
