import request from '@/utils/server'

// 保存
export const saveWorkTemplate = (data) => {
    return request({
        url: 'auto-respond/manage/scriptMould/scriptMouldSave',
        method: 'post',
        data: data.paramsData,
        params: data.queryData
    })
}

// 更新
export const updateWorkTemplate = (data) => {
    return request({
        url: 'auto-respond/manage/scriptMould/scriptMouldUpdate',
        method: 'post',
        data: data.paramsData,
        params: data.queryData
    })
}

// 删除
export const deleteWorkTemplateList = (data) => {
    return request({
        url: '/auto-respond/manage/scriptMould/scriptMouldDelete',
        method: 'post',
        data: data.paramsData,
        params: data.queryData
    })
}

// 列表
export const getWorkTemplateList = (data) => {
    return request({
        url: '/auto-respond/manage/scriptMould/scriptMouldPage',
        method: 'post',
        data: data.paramsData,
        params: data.queryData
    })
}

// 获取所有用户
export const getAllUsers = (data) => {
    return request({
        url: 'auto-respond/manage/scriptMould/getAllUsers',
        method: 'post',
        data: data.paramsData,
        params: data.queryData
    })
}

// 获取所有部门
export const getAllDep = (data) => {
    return request({
        url: 'auto-respond/manage/scriptMould/getAllDep',
        method: 'post',
        data: data.paramsData,
        params: data.queryData
    })
}

// 获取所有角色
export const getAllRoles = (data) => {
    return request({
        url: 'auto-respond/manage/scriptMould/getAllUserRoles',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const get_condition = (data) => {
    return request({
        url: 'work-order/manage/workMould/allCondition',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const getWorkAssetsUser = (data) => {
    return request({
        url: 'auto-respond/manage/scriptMould/getWorkAssetsUser',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const getWorkAssetsDep = (data) => {
    return request({
        url: 'auto-respond/manage/scriptMould/getWorkAssetsDep',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
