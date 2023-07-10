import axios from 'axios'
import { getAjax, getAjaxSome, getAjaxFile } from '@/utils/http'
import request from '@/utils/server'
// 系统列表
// export const get_menu = (data) => {
//     return axios.request({
//         url: 'work-order/manage/permission/getMenu',
//         method: 'post',
//         params: data.queryData,
//         data: data.paramsData
//     }).then(result => {
//         console.log(result)
//         return getAjaxSome(result)
//     })
// }
// 告警字段
export const get_selested_all_fileds = (data) => {
    return request({
        url: 'work-order/manage/workMould/getAlarmField',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_condition = (data) => {
    return request({
        url: 'work-order/manage/workMould/allCondition',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 获取工单字段
export const get_work_fileds = (data) => {
    return request({
        url: 'work-order/manage/workMould/getWorkOrderField',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 获取工单任务详情
export const get_workTask_detail = (data) => {
    return request({
        url: 'work-order/manage/workOrder/getDetail',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 获取工单任务详情
export const get_workTask_detailAllTask = (data) => {
    return request({
        url: 'work-order/manage/allOrder/getDetail',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 获取漏洞字段
export const get_leak_fileds = (data) => {
    return request({
        url: 'work-order/manage/workMould/getLeakField',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 工单完成
export const finish_workTask = (data) => {
    return request({
        url: 'work-order/manage/workOrder/approve',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 工单任务获取流程图
export const get_one_work = (data) => {
    return request({
        url: 'work-order/manage/workOrder/getWorkMouldById',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 工单任务获取流程图
export const get_one_workAllTask = (data) => {
    return request({
        url: 'work-order/manage/allOrder/getWorkMouldById',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const get_selested_all_leak_fileds = (data) => {
    return request({
        url: 'work-order/manage/workMould/getLeakField',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const getAlarmFieldcusor = (data) => {
    return request({
        url: 'work-order/manage/workMould/getAlarmFieldcusor',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_task_info = (data) => {
    return request({
        url: 'work-order/manage/workOrder/get',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_task_infoAllTask = (data) => {
    return request({
        url: 'work-order/manage/allOrder/get',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const get_work_users = (data) => {
    return request({
        url: 'work-order/manage/workOrderView/getOrderUser',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const get_work_order_data = (data) => {
    return request({
        url: 'work-order/manage/workOrderView/getView',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const get_work_detail_data = (data) => {
    return request({
        url: 'work-order/manage/workOrderView/getTable',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_work_order_statistic = (data) => {
    return request({
        url: 'work-order/manage/workOrderTime/getOrderNum',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const get_work_order_overview_list = (data) => {
    return request({
        url: 'work-order/manage/workOrderTime/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_statistic_workTask_detail = (data) => {
    return request({
        url: 'work-order/manage/workOrderTime/getBpmRecord',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_timeVal = (data) => {
    return request({
        url: 'work-order/manage/workOrderTime/getAvgTime',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_sys_users = (data) => {
    return request({
        url: 'work-order/manage/workOrder/getAllUsers',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const needSelected = (data) => {
    return request({
        url: 'work-order/manage/workOrder/checkSelect',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
