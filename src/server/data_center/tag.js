import request from '@/utils/server'

export const getChannels = (data) => {
    return request({
        url: 'data-center/manage/channelLabel/getChannels',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const get_list = (data) => {
    return request({
        url: 'data-center/manage/channelLabel/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const getAllField = (data) => {
    return request({
        url: 'data-center/manage/channelLabel/allFields',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const getAllCondition = (data) => {
    return request({
        url: 'data-center/manage/channelLabel/allCondition',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const del_tag = (data) => {
    return request({
        url: 'data-center/manage/channelLabel/delete',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const add_reg = (data) => {
    return request({
        url: 'data-center/manage/channelLabel/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const update_reg = (data) => {
    return request({
        url: 'data-center/manage/channelLabel/update',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const get_label_tree = (data) => {
    return request({
        url: 'data-center/manage/channelLabel/getAllDT',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const get_label_name = (data) => {
    return request({
        url: 'data-center/manage/channelLabel/getLabelNames',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

