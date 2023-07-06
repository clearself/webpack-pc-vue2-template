import request from '@/utils/server'

export const department_list = (data) => {
    return request({
        url: 'base-server/manage/department/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const department_save = (data) => {
    return request({
        url: 'base-server/manage/department/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const department_update = (data) => {
    return request({
        url: 'base-server/manage/department/update',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const department_delete = (data) => {
    return request({
        url: 'base-server/manage/department/delete',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

