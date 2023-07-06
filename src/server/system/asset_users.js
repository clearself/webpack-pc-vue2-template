import request from '@/utils/server'

// 资产用户管理
export const get_asset_tree = (data) => {
    return request({
        url: '/base-server/manage/assetsUser/getDep',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const add_asset_group = (data) => {
    return request({
        url: 'base-server/manage/assetsUser/saveDep',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const delete_asset_group = (data) => {
    return request({
        url: 'base-server/manage/assetsUser/delDep',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const get_asset_list = (data) => {
    return request({
        url: 'base-server/manage/assetsUser/getUser',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const save_asset_person = (data) => {
    return request({
        url: 'base-server/manage/assetsUser/saveUser',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const update_user = (data) => {
    return request({
        url: 'base-server/manage/assetsUser/updateUser',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const delete_asset_person = (data) => {
    return request({
        url: 'base-server/manage/assetsUser/delUser',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const get_sync_person = (data) => {
    return request({
        url: 'base-server/manage/assetsUser/getSyncData',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const add_sync_person = (data) => {
    return request({
        url: 'base-server/manage/assetsUser/saveSyncUser',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const ad_domain_sync = (data) => {
    return request({
        url: 'base-server/manage/assetsUser/getAd',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const exportData = (data) => {
    return request({
        url: 'base-server/manage/assetsUser/export',
        method: 'get',
        params: data.queryData,
        data: data.paramsData,
        responseType: 'blob'
    })
}

export const template = (data) => {
    return request({
        url: 'base-server/manage/assetsUser/template',
        method: 'get',
        params: data.queryData,
        data: data.paramsData,
        responseType: 'blob'
    })
}

export const get_ad_config = (data) => {
    return request({
        url: 'base-server/manage/adDomain/get',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const save_ad_config = (data) => {
    return request({
        url: 'base-server/manage/adDomain/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
