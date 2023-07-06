import request from '@/utils/server'

export const get_modulars = (data) => {
    return request({
        url: 'base-server/manage/upModule/getModule',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const get_upgrade_list = (data) => {
    return request({
        url: 'base-server/manage/upModule/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const delete_upgrade = (data) => {
    return request({
        url: 'base-server/manage/upModule/delete',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const get_logs = (data) => {
    return request({
        url: 'base-server/manage/upModule/getLogs',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const startServe = (data) => {
    return request({
        url: 'base-server/manage/upModule/operation',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const get_back_versons = (data) => {
    return request({
        url: 'base-server/manage/upModule/getRollbackVersion',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const sure_back_versons = (data) => {
    return request({
        url: 'base-server/manage/upModule/rollbackVersion',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const get_logs_detail = (data) => {
    return request({
        url: 'base-server/manage/upModule/tailLog',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const addUpgrade = (data) => {
    return request({
        url: 'base-server/manage/upModule/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const update = (data) => {
    return request({
        url: 'base-server/manage/upModule/update',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const downloadLog = (data) => {
    return request({
        url: 'base-server/manage/upModule/downloadLog',
        method: 'post',
        params: data.queryData,
        data: data.paramsData,
        responseType: 'blob'
    })
}
