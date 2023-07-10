import request from '@/utils/server'

// 数据源设置
export const saveDataSources = (data) => {
    return request({
        url: 'data-report/manage/systemConfig/saveDataSources',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 获取数据源设置
export const get_data_source_config = (data) => {
    return request({
        url: 'data-report/manage/systemConfig/getConfig',
        method: 'get'
    })
}

// 事件类型
export const getLeftMenu = (data) => {
    return request({
        url: 'data-report/manage/fieldmapping/getLeftMenu',
        method: 'get'
    })
}

// 获取符号列表信息
export const getSymbolList = (data) => {
    return request({
        url: 'data-report/manage/configcommondata/getSymbolList',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 获取所有字段信息
export const getLogFieldList = (data) => {
    return request({
        url: 'data-report/manage/configcommondata/getLogFieldList',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 获取上报字段数据集合
export const getReportField = (data) => {
    return request({
        url: `data-report/manage/fieldmapping/getReportField?type=${data}`,
        method: 'get'
    })
}
// 获取上报配置-字段映射数据
export const getFieldMapping = (data) => {
    return request({
        url: `data-report//manage/fieldmapping/getFieldMapping?type=` + data,
        method: 'get'
    })
}
// 编辑字段映射
export const saveFieldMapping = (data) => {
    return request({
        url: 'data-report//manage/fieldmapping/saveFieldMapping',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 公共新增
export const public_add = (data) => {
    return request({
        url: 'data-report/manage/configcommondata/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 公共编辑
export const public_edit = (data) => {
    return request({
        url: 'data-report/manage/configcommondata/edit',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 公共删除
export const public_del = (data) => {
    return request({
        url: 'data-report/manage/configcommondata/delete',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 公共列表查询
export const public_page = (data) => {
    return request({
        url: 'data-report/manage/configcommondata/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

