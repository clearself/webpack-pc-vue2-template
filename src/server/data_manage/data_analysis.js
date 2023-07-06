import request from '@/utils/server'

// 列表
export const list = (data) => {
    return request({
        url: 'data-center/manage/logParse/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// JSON解析
export const parseJsonLog = (data) => {
    return request({
        url: 'data-center/manage/logParse/parseJsonLog',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// JSON解析
export const parseRegLog = (data) => {
    return request({
        url: 'data-center/manage/logParse/parseRegLog',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 保存
export const save = (data) => {
    return request({
        url: 'data-center/manage/logParse/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 修改
export const update = (data) => {
    return request({
        url: 'data-center/manage/logParse/update',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 删除
export const deleteLog = (data) => {
    return request({
        url: 'data-center/manage/logParse/delete',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 获取所有字段-系统字段的四个类型，与设备类型联动
export const getAllField = (data) => {
    return request({
        url: 'data-center/manage/logParse/getAllFields',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 获取三级菜单树
export const getLogTree = (data) => {
    return request({
        url: 'data-center/manage/logParse/getLogTree',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 导出
export const downLoad = (data) => {
    return request({
        url: 'data-center/manage/logParse/download',
        method: 'post',
        params: data.queryData,
        data: data.paramsData,
        responseType: 'blob'
    })
}

