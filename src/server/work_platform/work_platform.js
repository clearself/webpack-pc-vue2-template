import request from '@/utils/server'

// export const get_history_messages = (data) => {
//     return request({
//         url: 'chat/manage/greeting/getUserTopic',
//         method: 'post',
//         params: data.queryData,
//         data: data.paramsData
//     })
// }

export const get_sys_info_decoding = (data) => {
    return request({
        url: 'base-server/manage/permission/getSysInfo',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const get_user_info_base = (data) => {
    return request({
        url: 'base-server/manage/permission/getUserInfo',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const get_sys_info_base = (data) => {
    return request({
        url: 'base-server/manage/permission/getSysInfo',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const get_three_work_num = (data) => {
    return request({
        url: 'base-server/manage/workPlatform/getThreeData',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const get_out_work_num = (data) => {
    return request({
        url: 'base-server/manage/workPlatform/getOutData',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const get_work_type_num = (data) => {
    return request({
        url: 'base-server/manage/workPlatform/getOrderObjNum',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const get_current_workTable = (data) => {
    return request({
        url: 'base-server/manage/workPlatform/getPersonTask',
        method: 'post',
        data: data.paramsData,
        params: data.queryData
    })
}

export const get_message_list = (data) => {
    return request({
        url: 'base-server/manage/workPlatform/getInsideMessage',
        method: 'post',
        data: data.paramsData,
        params: data.queryData
    })
}

export const markRead = (data) => {
    return request({
        url: 'base-server/manage/workPlatform/updateInsideMessage',
        method: 'post',
        data: data.paramsData,
        params: data.queryData
    })
}

export const get_work_trend = (data) => {
    return request({
        url: 'base-server/manage/workPlatform/getOrderTrend',
        method: 'post',
        data: data.paramsData,
        params: data.queryData
    })
}

export const get_work_pie = (data) => {
    return request({
        url: 'base-server/manage/workPlatform/getOrderTypeSum',
        method: 'post',
        data: data.paramsData,
        params: data.queryData
    })
}

export const get_work_bar = (data) => {
    return request({
        url: 'base-server/manage/workPlatform/getOrderTypeBar',
        method: 'post',
        data: data.paramsData,
        params: data.queryData
    })
}

export const getSafetyTask = (data) => {
    return request({
        url: 'base-server/manage/workPlatform/getSafetyTask',
        method: 'post',
        data: data.paramsData,
        params: data.queryData
    })
}

export const getAutoTask = (data) => {
    return request({
        url: 'base-server/manage/workPlatform/getAutoTask',
        method: 'post',
        data: data.paramsData,
        params: data.queryData
    })
}
