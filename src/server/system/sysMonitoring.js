import request from '@/utils/server'

// 增加系统|kafka|ck监控
export const addServerReq = (data) => {
    return request({
        url: 'base-server/manage/serviceWatch/addServer',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 编辑系统|kafka|ck监控
export const updateServerReq = (data) => {
    return request({
        url: 'base-server/manage/serviceWatch/updateServer',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 删除系统|kafka|ck监控
export const deleteServerReq = (data) => {
    return request({
        url: 'base-server/manage/serviceWatch/deleteServer',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 系统|kafka|ck监控-分页
export const serverPageReq = (data) => {
    return request({
        url: 'base-server/manage/serviceWatch/serverPage',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 保存告警配置
export const saveAlarmConfigReq = (data) => {
    return request({
        url: 'base-server/manage/alarmConfig/saveAlarmConfig',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 获取通知人
export const getNoticeUserReq = (data) => {
    return request({
        url: 'base-server/manage/alarmConfig/getNoticeUser',
        method: 'get',
        params: data
    })
}

// 获取通知人
export const getAlarmConfigReq = (data) => {
    return request({
        url: 'base-server/manage/alarmConfig/getAlarmConfig',
        method: 'get',
        params: data
    })
}

// 获取通知人
export const getTypeReq = (data) => {
    return request({
        url: 'assets-manage/manage/deviceType/getType',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 获取详情接口
export const getSystemMonitorInfoReq = (data) => {
    return request({
        url: 'base-server/manage/clusterMonitor/getSystemMonitorInfo',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
