import request from '@/utils/server'

// 系统列表
export const get_menu = (data) => {
    return request({
        url: 'alarm/manage/permission/getMenu',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 告警字段
export const get_selested_all_fileds = (data) => {
    return request({
        url: 'alarm/manage/workMould/getAlarmField',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_condition = (data) => {
    return request({
        url: 'alarm/manage/workMould/allCondition',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 获取工单字段
export const get_work_fileds = (data) => {
    return request({
        url: 'alarm/manage/workMould/getWorkOrderField',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 获取工单任务详情
export const get_workTask_detail = (data) => {
    return request({
        url: 'alarm/manage/autoOrder/getDetail',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 获取漏洞字段
export const get_leak_fileds = (data) => {
    return request({
        url: 'alarm/manage/workMould/getLeakField',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 告警配置

// 攻击结果
export const get_attack_results = (data) => {
    return request({
        url: 'alarm/manage/attackResult/get',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const save_attack_results = (data) => {
    return request({
        url: 'alarm/manage/attackResult/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const update_attack_results = (data) => {
    return request({
        url: 'alarm/manage/attackResult/update',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const delete_attack_results = (data) => {
    return request({
        url: 'alarm/manage/attackResult/delete',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 告警类型
export const get_alarm_type = (data) => {
    return request({
        url: 'alarm/manage/alarmType/get',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const save_alarm_type = (data) => {
    return request({
        url: 'alarm/manage/alarmType/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const delete_alarm_type = (data) => {
    return request({
        url: 'alarm/manage/alarmType/delete',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 获取已选字段
export const get_selested_fileds = (data) => {
    return request({
        url: 'alarm/manage/alarmList/getCustomField',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 获取专家列表
export const get_expert_list = (data) => {
    return request({
        url: 'alarm/manage/alarmList/customPage',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 获取可选字段
export const get_selested_all_fileds_logs = (data) => {
    return request({
        url: 'alarm/manage/alarmList/getAllField',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const change_fileds = (data) => {
    return request({
        url: 'alarm/manage/alarmList/saveCustomField',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_getLogIndex = (data) => {
    return request({
        url: 'alarm/manage/alarmList/getAllDT',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_top5 = (data) => {
    return request({
        url: 'alarm/manage/alarmList/getFieldTop5',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_pcac = (data) => {
    return request({
        url: 'data_center/manage/syslog/viewPcap',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_alarm_rule_list = (data) => {
    return request({
        url: 'alarm/manage/alarmMerger/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const save_alarm_rule = (data) => {
    return request({
        url: 'alarm/manage/alarmMerger/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const delete_alarm_rule = (data) => {
    return request({
        url: 'alarm/manage/alarmMerger/delete',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_alarm_options = (data) => {
    return request({
        url: 'alarm/manage/alarmType/get',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const change_alarm_start_type = (data) => {
    return request({
        url: 'alarm/manage/alarmMerger/updateStartType',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const get_auto_work_list = (data) => {
    return request({
        url: 'alarm/manage/autoOrder/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const save_auto_work = (data) => {
    return request({
        url: 'alarm/manage/autoOrder/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const update_auto_work = (data) => {
    return request({
        url: 'alarm/manage/autoOrder/update',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const delete_auto_work = (data) => {
    return request({
        url: 'alarm/manage/autoOrder/delete',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const change_auto_work_start = (data) => {
    return request({
        url: 'alarm/manage/autoOrder/updateStartType',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_auto_work_template = (data) => {
    return request({
        url: 'alarm/manage/autoOrder/getAlarmWorkMould',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 发起剧本
export const saveAutoOrder = (data) => {
    return request({
        url: 'alarm/manage/alarmList/saveAutoOrder',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_threat_search = (data) => {
    return request({
        url: 'intelligence/manage/intelligenceQuery/query',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_threat_searchVenus = (data) => {
    return request({
        url: 'intelligence/manage/intelligenceQuery/queryByVenus',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const getStartConfig = (data) => {
    return request({
        url: 'intelligence/manage/collectConfig/getStartConfig',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
