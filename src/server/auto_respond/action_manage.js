import request from '@/utils/server'
// 公共分组查询
export const groupList = (data) => {
    return request({
        url: 'base-server/manage/autoRespond/groupList',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 分组查询
export const groupList1 = (data) => {
    return request({
        url: 'base-server/manage/autoRespond/groupList',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 分组添加
export const saveGroup = (data) => {
    return request({
        url: 'auto-respond/manage/automation/saveGroup',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 分组修改
export const updateGroup = (data) => {
    return request({
        url: 'auto-respond/manage/automation/updateGroup',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 分组删除
export const deleteGroup = (data) => {
    return request({
        url: 'auto-respond/manage/automation/deleteGroup',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 查询设备列表
export const getFacilityList = (data) => {
    return request({
        url: 'auto-respond/manage/automation/getFacilityList',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 方案添加
export const automationSave = (data) => {
    return request({
        url: 'auto-respond/manage/automation/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 方案修改
export const automationUpdate = (data) => {
    return request({
        url: 'auto-respond/manage/automation/update',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 方案删除
export const automationDelete = (data) => {
    return request({
        url: 'auto-respond/manage/automation/delete',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 获取设备
export const findFacilityList = (data) => {
    return request({
        url: 'auto-respond/manage/scriptMould/findFacilityList',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 获取设备
export const getAllUsers = (data) => {
    return request({
        url: 'auto-respond/manage/scriptMould/getAllUsers',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
