import request from '@/utils/server'

export const getFlowTaskList = (data) => {
    return request({
        url: 'link-manage/manage/nft/pageFlowTask',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const addFlowTask = (data) => {
    return request({
        url: 'link-manage/manage/nft/addFlowTask',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const conditionPage = (data) => {
    return request({
        url: 'link-manage/manage/nft/conditionPage',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const delCondition = (data) => {
    return request({
        url: 'link-manage/manage/nft/delCondition',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const get_pcac = (data) => {
    return request({
        url: 'data-center/manage/syslog/viewPcap',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const downloadPacap = (data) => {
    return request({
        url: 'data-center/manage/syslog/downloadPcap',
        method: 'get',
        params: data.queryData,
        data: data.paramsData
    })
}
