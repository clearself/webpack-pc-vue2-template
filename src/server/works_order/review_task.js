
import request from '@/utils/server'

// 查询任务
export const safetyTaskPage = (data) => {
    return request({
        url: 'safety-review/manage/safetyTask/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 新增任务
export const safetyTaskSave = (data) => {
    return request({
        url: 'safety-review/manage/safetyTask/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 修改任务
export const safetyTaskUpdate = (data) => {
    return request({
        url: 'safety-review/manage/safetyTask/update',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 删除任务
export const safetyTaskDelete = (data) => {
    return request({
        url: 'safety-review/manage/safetyTask/del',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 撤销任务
export const safetyTaskCancel = (data) => {
    return request({
        url: 'safety-review/manage/safetyTask/cancel',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 下发任务
export const safetyTaskIssue = (data) => {
    return request({
        url: 'safety-review/manage/safetyTask/issue',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 催办任务
export const safetyTaskReminder = (data) => {
    return request({
        url: 'safety-review/manage/safetyTask/reminder',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 获取公司
export const safetyTaskGetOrg = (data) => {
    return request({
        url: 'safety-review/manage/safetyTask/getOrg',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 获取业务系统
export const safetyTaskGetSystem = (data) => {
    return request({
        url: 'safety-review/manage/safetyTask/getSystems',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 获取详情
export const safetyTaskGetDetail = (data) => {
    return request({
        url: 'safety-review/manage/safetyTask/getTaskDetail',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 获取模板
export const safetyTaskGetTemplate = (data) => {
    return request({
        url: 'safety-review/manage/safetyTask/getTemplate',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 分页下发
export const safetyTaskGetIssuePage = (data) => {
    return request({
        url: 'safety-review/manage/taskIssue/getIssuePage',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 通过模板id获取模板内容
export const safetyTaskGetTemplateData = (data) => {
    return request({
        url: '/safety-review/manage/taskIssue/getTemplateData',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 提交填报内容
export const safetyTaskSaveTemplateData = (data) => {
    return request({
        url: '/safety-review/manage/taskIssue/saveTemplateData',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

