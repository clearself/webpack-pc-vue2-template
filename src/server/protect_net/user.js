import request from '@/utils/server'

/* 用户管理模块*/
// 获取用户列表
export const get_registerUser = (data) => {
    return request({
        url: 'protective-net/manage/user/getUserList',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 添加用户
export const addNewUser = (data) => {
    return request({
        url: 'protective-net/manage/user/addNewUser',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 更新用户
export const updateUser = (data) => {
    return request({
        url: 'protective-net/manage/user/updateUser',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 删除用户
export const deleteUser = (data) => {
    return delete('protective-net/manage/user/deleteUser', {
        params: data
    })
}
// 审核用户
export const sure_check = (data) => {
    return request({
        url: 'protective-net/manage/user/reviewUserInfo',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 获取区域和行业

export const getAreaIndustry = (data) => {
    return request('protective-net/common/getAreaIndustry', {
        method: 'get',
        params: data
    })
}
// 获取角色
export const getRoles = (data) => {
    return get('protective-net/common/getRoleList', {
        method: 'get',
        params: data
    })
}

// 获取省份或部门
export const get_province_department = (data) => {
    return request({
        url: 'protective-net/common/getChildInfo',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

