import request from '@/utils/server'

// 列表
export const list = (data) => {
    return request({
        url: '/base-server/manage/role/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 新增
export const add_role = (data) => {
    return request({
        url: 'base-server/manage/role/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 修改
export const update_role = (data) => {
    return request({
        url: 'base-server/manage/role/update',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 获取menus
export const get_resources = (data) => {
    return request({
        url: 'base-server/manage/role/getResources',
        method: 'post',
        data: data
    })
}

// 删除角色
export const delete_role = (data) => {
    return request({
        url: 'base-server/manage/role/delete',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

