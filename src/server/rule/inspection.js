import request from '@/utils/server'

// 规则组接口
export const get_rule_tree = (data) => {
    return request({
        url: 'rule/manage/rule/findRuleType',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const add_rule_group = (data) => {
    return request({
        url: 'rule/manage/rule/saveRuleType',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const delete_rule_group = (data) => {
    return request({
        url: 'rule/manage/rule/deleteRuleType',
        method: 'post',
        data: data
    })
}
export const modify_rules_group = (data) => {
    return request({
        url: 'rule/manage/rule/updateType',
        method: 'post',
        data: data
    })
}
export const get_order_template = (data) => {
    return request({
        url: 'rule/manage/rule/getAlarmWorkMould',
        method: 'post',
        data: data
    })
}
export const get_order_user = (data) => {
    return request({
        url: 'rule/manage/rule/getUser',
        method: 'post',
        data: data
    })
}

