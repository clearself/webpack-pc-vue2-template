import request from '@/utils/server'

// 系统列表
export const get_menu = (data) => {
    return request({
        url: 'rule/manage/permission/getMenu',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 告警类型--规则
export const get_alarm_type_rule = (data) => {
    return request({
        url: 'rule/manage/rule/getAlarmType',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 提示音
// ip映射
export const add_voice = (data) => {
    console.log(data)
    return request({
        url: 'rule/manage/warnSound/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 获取映射列表
export const get_voice = (data) => {
    return request({
        url: 'rule/manage/warnSound/getAllWarnSound',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 获取映射列表
export const edit_voice = (data) => {
    return request({
        url: 'rule/manage/warnSound/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const delete_voice = (data) => {
    return request({
        url: 'rule/manage/warnSound/delete',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_voice_level = (data) => {
    return request({
        url: 'rule/manage/warnSound/getLevel',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 规则-获取攻击结果
export const get_rule_attack_result = (data) => {
    return request({
        url: 'rule/manage/rule/getAttackResult',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 规则--资产下拉
export const getAssetsSelect = (data) => {
    return request({
        url: 'rule/manage/rule/getAssetsData',
        method: 'post',
        data: data
    })
}
// 规则--标签
export const getSubjectLabel = (data) => {
    return request({
        url: 'rule/manage/rule/getLabels',
        method: 'post',
        data: data
    })
}
// 模拟数据
export const releaseRuleForm = (data) => {
    return request({
        url: 'rule/manage/cep/sendData',
        method: 'post',
        data: data
    })
}

// 获取事件选择
export const getSimulation = (data) => {
    return request({
        url: 'rule/manage/cep/getImitateFiled',
        method: 'post',
        data: data
    })
}

// 规则事件下拉选
export const allLogFiled = (data) => {
    return request({
        url: 'rule/manage/rule/getLogFiled',
        method: 'post',
        data: data
    })
}
// 导出
export const ruleExport = (data) => {
    return request({
        url: 'rule/manage/rule/export',
        method: 'get',
        data: data,
        responseType: 'blob'
    })
}
