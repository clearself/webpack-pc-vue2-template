import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import { getAjax } from '@/utils/http'
// form表单五返回code
var getAjaxVal = result => {
    return new Promise((resolve, reject) => {
        if (result.status == 200) {
            resolve('success')
        } else {
            Message({
                message: result.data.message,
                type: 'warning'
            })
            reject(result.data)
        }
    })
}

// 目标系统管理

export const get_targetSystem_list = (data) => {
    return axios.request({
        url: 'reporting_platform/manage/targetSystemConfig/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    }).then(result => {
        console.log(result)
        return getAjax(result)
    })
}

export const add_targetSystem = (data) => {
    return axios.request({
        url: 'reporting_platform/manage/targetSystemConfig/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    }).then(result => {
        console.log(result)
        return getAjax(result)
    })
}

export const del_targetSystem = (data) => {
    return axios.request({
        url: 'reporting_platform/manage/targetSystemConfig/delete',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    }).then(result => {
        console.log(result)
        return getAjax(result)
    })
}

// 数据匹配设置

export const get_dataMatching_list = (data) => {
    return axios.request({
        url: 'reporting_platform/manage/eventTypeConfig/getAllEventTypeConfig',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    }).then(result => {
        console.log(result)
        return getAjax(result)
    })
}

export const add_dataMatching = (data) => {
    return axios.request({
        url: 'reporting_platform/manage/eventTypeConfig/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    }).then(result => {
        console.log(result)
        return getAjax(result)
    })
}

export const del_dataMatching_list = (data) => {
    return axios.request({
        url: 'reporting_platform/manage/eventTypeConfig/delete',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    }).then(result => {
        console.log(result)
        return getAjax(result)
    })
}

export const getDataType = (data) => {
    return axios.request({
        url: 'reporting_platform/manage/eventTypeConfig/getSource',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    }).then(result => {
        console.log(result)
        return getAjax(result)
    })
}

export const getOriginType = (data) => {
    return axios.request({
        url: 'reporting_platform/manage/eventTypeConfig/getDataType',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    }).then(result => {
        console.log(result)
        return getAjax(result)
    })
}

