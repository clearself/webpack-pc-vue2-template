import request from '@/utils/server'
// 获取用户登录成功后的系统入口列表
export const getSysMenus = (data) => {
    return request({
        url: 'base_info/manage/permission/getSysMenus',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 退出
export const exit = (data) => {
    return request({
        url: 'base_info/exit',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 获取用户信息
export const get_user_info = (data) => {
    return request({
        url: 'base_info/manage/permission/getUserInfo',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const getStoreUsers = (data) => {
    return request({
        url: 'base_info/terminal/getAllUsers',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const getNewSysMenus = (data) => {
    return request({
        url: 'base_info/manage/permission/getNavigateList',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_time = (data) => {
    return request({
        url: 'defense-drill/terminal/getSystemTime',
        method: 'post',
        params: data.queryData,
        data: data.paramsData

    })
}
export const get_user_info_base = (data) => {
    return request({
        url: 'base_info/manage/permission/getUserInfo',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
