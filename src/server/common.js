
import request from '@/utils/server'
export const get_menus = (data) => {
    return request({
        url: 'base-server/manage/permission/getIndexMenu',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_update_password_state = (data) => {
    return request({
        url: 'base-server/manage/permission/needUpdatePassword',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const update_password_new = (data) => {
    return request({
        url: 'base-server/manage/permission/updatePassword',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_time = (data) => {
    return request({
        url: 'common/terminal/getSystemTime',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 查询仪表盘是否有默认
export const searchDefault = (data) => {
    return request({
        url: 'dashboard/manage/dashboard/searchDefault',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
