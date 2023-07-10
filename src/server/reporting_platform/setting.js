import request from '@/utils/server'

// 数据源配置
export const get_data_source_config = (data) => {
    return request({
        url: 'reporting_platform/manage/systemConfig/getConfig',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const save_data_source_config = (data) => {
    return request({
        url: 'reporting_platform/manage/systemConfig/saveDataSources',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 邮件提醒设置
export const get_email_config = (data) => {
    return request({
        url: 'data-report/manage/mailConfig/get',
        method: 'post',
        params: {},
        data: {}
    })
}
export const add_email_config = (data) => {
    return request({
        url: 'data-report/manage/mailConfig/update',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 机构配置
export const add_instruction = (data) => {
    return request({
        url: 'data-report/manage/orgInfo/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_instruction = (data) => {
    return request({
        url: 'data-report/manage/orgInfo/getOrgInfo',
        method: 'get',
        params: data
    })
}
// 上报方式
export const get_report_set = (data) => {
    return request({
        url: 'data-report/manage/systemConfig/getConfig',
        method: 'get',
        params: data
    })
}
export const add_report_set = (data) => {
    return request({
        url: 'data-report/manage/systemConfig/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 过滤器

// 规则配置
export const get_rules_list = (data) => {
    return request({
        url: 'data-report/manage/filterRule/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const save_rules = (data) => {
    return request({
        url: 'data-report/manage/filterRule/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const delete_rules = (data) => {
    return request({
        url: 'data-report/manage/filterRule/delete',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 获取所有目标系统
export const get_allTargetSystem = (data) => {
    return request({
        url: 'reporting_platform/manage/filterRules/getAllTargetSystem',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 获取网络攻击攻击类型/病毒感染病毒类型
export const get_attackType = (data) => {
    return request({
        url: 'reporting_platform/manage/filterRules/getAttackType',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 获取所有分支机构/所属区域
export const get_branch_area = (data) => {
    return request({
        url: 'reporting_platform/manage/filterRules/getAllSubOrg',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 获取过滤器状态
export const get_filter_status = (data) => {
    return request({
        url: 'data-report/manage/filterRule/getFilterRulesFlag',
        method: 'get'
    })
}

// 修改过滤器状态
export const modify_filter_status = (data) => {
    return request({
        url: 'data-report/manage/filterRule/modifyFilterRulesFlag',
        method: 'get'
    })
}
// 流量单位配置
export const add_flow = (data) => {
    return request({
        url: 'data-report/manage/systemConfig/saveAttackFlowUnit',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_flow = (data) => {
    return request({
        url: 'data-report/manage/systemConfig/getConfig',
        method: 'get',
        params: data
    })
}

// 分支机构管理
export const get_branch_city = (data) => {
    return request({
        url: 'data-report/manage/subOrgConfig/getArea',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const add_branches = (data) => {
    return request({
        url: 'data-report/manage/subOrgConfig/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_branches_list = (data) => {
    return request({
        url: 'data-report/manage/subOrgConfig/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const delete_branches = (data) => {
    return request({
        url: 'data-report/manage/subOrgConfig/delete',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 趋势统计-列表
export const get_trend_list = (data) => {
    return request({
        url: 'data-report/manage/reportstatistics/trendPage',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const get_trend = (data) => {
    return request({
        url: 'data-report/manage/reportstatistics/trend',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 概览统计
export const get_statistical_top = () => {
    return request({
        url: 'data-report/manage/reportstatistics/top',
        method: 'get'
    })
}
// 事件统计
export const get_event_bar = (data) => {
    return request({
        url: 'data-report/manage/reportstatistics/eventStatistics',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_attrack_virus = (data) => {
    return request({
        url: 'data-report/manage/reportstatistics/attachTypeStatistics',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_attracked_sys = (data) => {
    return request({
        url: 'data-report/manage/reportstatistics/topTenDestinationSystem',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_attracked_ip = (data) => {
    return request({
        url: 'data-report/manage/reportstatistics/topTenDestinationIp',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
