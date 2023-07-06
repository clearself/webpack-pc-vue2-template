import request from '@/utils/server'

export const get_login_logos_list = (data) => {
    return request({
        url: 'base-server/manage/log/getLoginLog',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_roles = (data) => {
    return request({
        url: 'base-server/manage/log/getRole',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const export_login_logos = (data) => {
    return request({
        url: 'base-server/manage/log/exportLoginLog',
        method: 'post',
        params: data.queryData,
        data: data.paramsData,
        responseType: 'blob'
    })
}
export const get_option_logos_list = (data) => {
    return request({
        url: 'base-server/manage/log/getOperationLog',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const export_option_logos = (data) => {
    return request({
        url: 'base-server/manage/log/exportOperationLog',
        method: 'post',
        params: data.queryData,
        data: data.paramsData,
        responseType: 'blob'
    })
}
