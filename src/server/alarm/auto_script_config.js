import request from '@/utils/server'
export const get_auto_work_list = (data) => {
    return request({
        url: 'alarm/manage/autoScriptOrder/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const save_auto_work = (data) => {
    return request({
        url: 'alarm/manage/autoScriptOrder/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const update_auto_work = (data) => {
    return request({
        url: 'alarm/manage/autoScriptOrder/update',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const delete_auto_work = (data) => {
    return request({
        url: 'alarm/manage/autoScriptOrder/delete',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const change_auto_work_start = (data) => {
    return request({
        url: 'alarm/manage/autoScriptOrder/updateStartType',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_auto_work_template = (data) => {
    return request({
        url: 'alarm/manage/autoScriptOrder/getAlarmWorkMould',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
