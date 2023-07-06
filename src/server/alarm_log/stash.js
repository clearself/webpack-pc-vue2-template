
import request from '@/utils/server'

// 获取暂存列表字段
export const getStashField = (data) => {
    return request({
        url: 'data-center/manage/agg/getLogStorage',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 获取暂存列表数据
export const getStashList = (data) => {
    return request({
        url: 'data-center/manage/agg/logIdsPage',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 缓存列表字段添加
export const updateStashFields = (data) => {
    return request({
        url: 'data-center/manage/agg/saveLogStorage',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 告警列表字段添加
export const updateAlarmFields = (data) => {
    return request({
        url: 'data-center/manage/agg/saveOtherField',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 清空暂存列表
export const clearStashFields = (data) => {
    return request({
        url: 'data-center/manage/agg/deleteLogStorage',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
