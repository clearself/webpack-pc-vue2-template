import request from '@/utils/server'
// 组织树
export const get_org_fire_line = (data) => {
    return request({
        url: 'alarm/manage/firebreak/getDepartList',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 获取部门防火线
export const get_dep_fire_line = (data) => {
    return request({
        url: 'alarm/manage/firebreak/findDepartmentByPage',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 获取人员防火线
export const get_personal_fire_line = (data) => {
    return request({
        url: 'alarm/manage/firebreak/findUserByPage',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 获取资产防火线
export const get_assets_fire_line = (data) => {
    return request({
        url: 'alarm/manage/firebreak/findAssetsByPage',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 获取部门防火线详情极限图
export const get_dep_fire_line_chart = (data) => {
    return request({
        url: 'alarm/manage/firebreak/depViewDetailChart',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 获取人员防火线详情极限图
export const get_personal_fire_line_chart = (data) => {
    return request({
        url: 'alarm/manage/firebreak/userViewDetailChart',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 获取资产防火线详情极限图
export const get_assets_fire_line_chart = (data) => {
    return request({
        url: 'alarm/manage/firebreak/assetViewDetailChart',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 获取部门防火线详情告警列表
export const get_dep_fire_line_alarm = (data) => {
    return request({
        url: 'alarm/manage/firebreak/depViewDetailByPage',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 获取人员防火线详情告警列表
export const get_personal_fire_line_alarm = (data) => {
    return request({
        url: 'alarm/manage/firebreak/userViewDetailByPage',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 获取资产防火线详告警列表
export const get_assets_fire_line_alarm = (data) => {
    return request({
        url: 'alarm/manage/firebreak/assetViewDetailByPage',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 获取资产防火线详告警列表
export const change_status = (data) => {
    return request({
        url: 'alarm/manage/firebreak/updateAlarmEmergenct',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

