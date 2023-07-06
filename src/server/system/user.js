import request from '@/utils/server'
// 获取资产联系人
export const getAllAssetsUser = (data) => {
    return request({
        url: 'base-server/manage/adminUser/getAllAssetsUser',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 下载模板
export const template = (data) => {
    return request({
        url: 'base-server/manage/adminUser/template',
        method: 'post',
        params: data.queryData,
        data: data.paramsData,
        responseType: 'blob'
    })
}

// 新增
export const add_user = (data) => {
    return request({
        url: 'base-server/manage/adminUser/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 修改
export const update_user = (data) => {
    return request({
        url: 'base-server/manage/adminUser/update',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 删除
export const delete_user = (data) => {
    return request({
        url: 'base-server/manage/adminUser/delete',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 启用
export const enable_user = (data) => {
    return request({
        url: 'base-server/manage/adminUser/enable',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 禁用
export const disable_user = (data) => {
    return request({
        url: 'base-server/manage/adminUser/disable',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 列表
export const get_table_list = (data) => {
    return request({
        url: 'base-server/manage/adminUser/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
        // immediate: true
    })
}

// 获取部门
export const get_dep = (data) => {
    return request({
        url: 'base-server/manage/adminUser/getDep',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 获取角色
export const get_role = (data) => {
    return request({
        url: 'base-server/manage/adminUser/getRole',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 获取用户
export const get_all_user = (data) => {
    return request({
        url: 'base-server/manage/adminUser/getAllUser',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 重置密码
export const update_password = (data) => {
    return request({
        url: 'base-server/manage/adminUser/updatePassword',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 获取用户
export const ssoLogin = (data) => {
    return request({
        url: 'base-server/sso/ssoLogin',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
