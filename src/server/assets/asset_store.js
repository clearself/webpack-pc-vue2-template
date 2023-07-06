import request from '@/utils/server'

// 获取厂商列表
export const getDepsAll = (data) => {
    return request({
        url: 'assets-manage/manage/manufacturer/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 添加厂商
export const addDeps = (data) => {
    return request({
        url: 'assets-manage/manage/manufacturer/saveManufacturer',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 删除厂商
export const delDeps = (data) => {
    return request({
        url: 'assets-manage/manage/manufacturer/del',
        method: 'post',

        params: data.queryData,
        data: data.paramsData
    })
}
