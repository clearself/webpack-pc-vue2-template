import request from '@/utils/server'

// 获取列表
export const getDrools = (data) => {
    return request({
        url: 'rule/manage/rule/getRule',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 新建列表
export const buildDrools = (data) => {
    return request({
        url: 'rule/manage/rule/saveRule',
        method: 'post',
        data: data
    })
}
// 编辑
export const updateRule = (data) => {
    return request({
        url: 'rule/manage/rule/updateRule',
        method: 'post',
        data: data
    })
}

// 修改部署状态
export const modify_deployData = (data) => {
    return request({
        url: 'rule/manage/rule/updateStatus',
        method: 'post',
        data: data
    })
}
export const enable = (data) => {
    return request({
        url: 'rule/manage/rule/enable',
        method: 'post',
        data: data
    })
}
export const disable = (data) => {
    return request({
        url: 'rule/manage/rule/disable',
        method: 'post',
        data: data
    })
}

export const modify_deployAllData = (data) => {
    return request({
        url: 'rule/manage/rule/updateStatus',
        method: 'post',
        data: data
    })
}

// 删除单条数据
export const delete_singleData = (data) => {
    return request({
        url: 'rule/manage/rule/deleteRule',
        method: 'post',
        data: data
    })
}

// reload
export const reloadData = (data) => {
    return request({
        url: 'rule/manage/rule/reload',
        method: 'post',
        data: data
    })
}

// 添加资源池
export const addResourcePool = (data) => {
    return request({
        url: 'rule/manage/resource/savePool',
        method: 'post',
        data: data
    })
}
// 修改资源池
export const editResourcePool = (data) => {
    return request({
        url: 'rule/manage/resource/updatePool',
        method: 'post',
        data: data
    })
}
// 添加资源
export const addResource = (data) => {
    return request({
        url: 'rule/manage/resource/saveResource',
        method: 'post',
        data: data
    })
}
// 修改资源
export const editResource = (data) => {
    return request({
        url: 'rule/manage/resource/updateResource',
        method: 'post',
        data: data
    })
}
// 查询资源池
export const selectResourcePool = (data) => {
    return request({
        url: 'rule/manage/rule/getResourcePool',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 查询字段
export const get_fields = (data) => {
    return request({
        url: 'rule/manage/rule/getField',
        method: 'post',
        data: data
    })
}
// 规则继承
export const get_extendRules = (data) => {
    return request({
        url: 'rule/manage/rule/getEnableRules',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 查询资源
export const selectResource = (data) => {
    return request({
        url: 'rule/manage/resource/getResource',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 删除资源池
export const deleteResourcePool = (data) => {
    return request({
        url: 'rule/manage/resource/deletePool',
        method: 'post',
        data: data
    })
}
// 删除资源
export const deleteResource = (data) => {
    return request({
        url: 'rule/manage/resource/deleteResource',
        method: 'post',
        data: data
    })
}

// 查询规则详情单条
export const get_one_rule = (data) => {
    return request({
        url: 'rule/manage/rule/getRuleById',
        method: 'post',
        data: data
    })
}

// 查询邮箱/短信人员
export const get_mail_users = (data) => {
    return request({
        url: 'rule/manage/rule/getMailAndPhone',
        method: 'post',
        data: data
    })
}
// 下载模板
export const resourceTemplate = (data) => {
    return request({
        url: 'rule/manage/resource/template',
        method: 'get',
        data: data,
        responseType: 'blob'
    })
}
