import request from '@/utils/server'

// 列表
export const ipRosterPageReq = (data) => {
    return request({
        url: 'work-order/manage/ipRoster/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 新增
export const ipRosterAddReq = (data) => {
    return request({
        url: 'work-order/manage/ipRoster/add',
        method: 'post',
        data: data.paramsData,
        params: data.queryData
    })
}

// 删除
export const ipRosterDelReq = (data) => {
    return request({
        url: 'work-order/manage/ipRoster/delete',
        method: 'post',
        data: data.paramsData,
        params: data.queryData
    })
}

// 按名字查询
export const getAssetsUserReq = (data) => {
    return request({
        url: 'work-order/manage/ipRoster/getAssetsUser',
        method: 'get',
        data: data.paramsData,
        params: data.queryData
    })
}
