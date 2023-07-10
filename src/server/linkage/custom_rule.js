import request from '@/utils/server'

export const getEventType = (data) => {
    return request({
        url: 'link-manage/manage/tar/getEventType',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const getAll = (data) => {
    return request({
        url: 'link-manage/manage/tar/pageCustomRules',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const addCustomRule = (data) => {
    return request({
        url: 'link-manage/manage/tar/saveCustomRules',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const updateCustomRule = (data) => {
    return request({
        url: 'link-manage/manage/tar/updateCustomRules',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const delCustomRule = (data) => {
    return request({
        url: 'link-manage/manage/tar/deleteCustomRules',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

