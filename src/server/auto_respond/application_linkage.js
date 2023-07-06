import request from '@/utils/server'
// 厂商查询
export const getAllManufacturer = (data) => {
    return request({
        url: 'auto-respond/manage/applicationlinkage/getAllManufacturer',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 列表查询
export const getFacilityList = (data) => {
    return request({
        url: 'auto-respond/manage/applicationlinkage/getFacilityList',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 分组查询
export const getGroupList = (data) => {
    return request({
        url: 'auto-respond/manage/applicationlinkage/getGroupList',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 动作查询
export const getActionList = (data) => {
    return request({
        url: 'auto-respond/manage/applicationlinkage/getActionList',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
