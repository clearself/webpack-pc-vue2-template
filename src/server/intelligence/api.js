import axios from 'axios'
import {
    Message
} from 'element-ui'
import {
    getAjax
} from '@/utils/http'

import request from '@/utils/server'

// 系统列表
export const get_menu = (data) => {
    return axios.request({
        url: 'intelligence/manage/permission/getMenu',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    }).then(result => {
        console.log(result)
        return getAjax(result)
    })
}

// 恶意iP库
export const get_ip_detail = (data) => {
    return axios.request({
        url: 'intelligence/manage/spiteIp/getSpiteIp',
        method: 'post',
        data: data
    }).then(result => {
        console.log(result)
        return getAjax(result)
    })
}

// 采集配置
export const get_threat_config = (data) => {
    return request({
        url: 'intelligence/manage/collectConfig/get',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const saveStatus = (data) => {
    return request({
        url: 'intelligence/manage/collectConfig/saveStatus',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const save_threat_config = (data) => {
    return request({
        url: 'intelligence/manage/collectConfig/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const update_threat_config = (data) => {
    return request({
        url: 'intelligence/manage/collectConfig/update',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const test_threat_config = (data) => {
    return request({
        url: 'intelligence/manage/collectConfig/test',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
/* 情报查询*/
export const get_threat_log = (data) => {
    return request({
        url: 'intelligence/manage/intelligenceQuery/getRecord?page=1&pageSize=20',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_threat_search = (data) => {
    return request({
        url: 'intelligence/manage/intelligenceQuery/query',
        method: 'get',
        params: data.queryData,
        data: data.paramsData
    })
}

export const delete_config = (data) => {
    return request({
        url: `intelligence/manage/collectConfig/delete`,
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
