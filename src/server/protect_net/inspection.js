import request from '@/utils/server'
import { getAjaxFile } from '@/utils/http'

// h获取合规模板
export const get_templates = (data) => {
    return request({
        url: 'protective-net/manage/inspection/findHgTemplateList',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 添加迎检项
export const add_inspection = (data) => {
    return request({
        url: 'protective-net/manage/inspection/addOrModifyInspection',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 迎检列表
export const get_inspections = (data) => {
    return request({
        url: 'protective-net/manage/inspection/findInspectionList',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// s删除迎检
export const delete_inspection = (data) => {
    return request('protective-net/manage/inspection/deleteInspection', {
        method: 'post',
        params: data
    })
}
export const get_inspections_inner = (data) => {
    return request({
        url: 'protective-net/manage/inspection/findAllInspectionItem',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const sure_shenhe = (data) => {
    return request({
        url: 'protective-net/manage/inspection/verifyInspectionItem',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 左侧树结构接口

// 模型接口
export const get_rule_tree = (data) => {
    return request({
        url: 'protective-net/manage/baseTask/getGroup',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const add_rule_group = (data) => {
    return request({
        url: 'protective-net/manage/baseTask/saveGroup',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const delete_rule_group = (data) => {
    return request({
        url: 'protective-net/manage/baseTask/deleteGroup',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const get_task_list = (data) => {
    return request({
        url: 'protective-net/manage/baseTask/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_assign_users = (data) => {
    return request({
        url: 'protective-net/manage/baseTask/getAllRolesAndUsers',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const addTask = (data) => {
    return request({
        url: 'protective-net/manage/baseTask/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 导出renwu任务列表
export const exportTask = (data) => {
    return request({
        url: `protective-net/manage/baseTask/exportExcel`,
        method: 'get',
        responseType: 'blob',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        data: data.paramsData,
        params: data.queryData
    }).then(result => {
        console.log(result)
        return getAjaxFile(result)
    })
}
// 导出模板
export const exportTemplate = (data) => {
    return request({
        url: `protective-net/manage/baseTask/template`,
        method: 'get',
        responseType: 'blob',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        data: data.paramsData,
        params: data.queryData
    }).then(result => {
        console.log(result)
        return getAjaxFile(result)
    })
}
export const assign_user = (data) => {
    return request({
        url: 'protective-net/manage/baseTask/assign',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const import_module = (data) => {
    return request({
        url: 'gjsy/manage/model/importModelData',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const statrt_stop = (data) => {
    return request('gjsy/manage/model/stateControl', {
        method: 'get',
        params: data
    })
}

export const delete_task = (data) => {
    return request({
        url: 'protective-net/manage/baseTask/delete',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

