import axios from 'axios'
import { Message } from 'element-ui'
import { getAjax } from '@/utils/http'
import request from '@/utils/server'
// return request({
//         url: 'intelligence/manage/intelligenceQuery/getRecord?page=1&pageSize=20',
//         method: 'post',
//         params: data.queryData,
//         data: data.paramsData
//     })
// 威胁情报--获取所有攻击方式
export const get_attackWay = (data) => {
    return request({
        url: 'intelligence/manage/intelligence/getAllAttackMode',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 威胁情报--列表
export const get_attackList = (data) => {
    return request({
        url: `intelligence/manage/intelligence/page`,
        method: 'post',
        data: data.paramsData,
        params: data.queryData
    })
}
// 威胁情报--添加
export const save_attack = (data) => {
    return request({
        url: 'intelligence/manage/intelligence/save',
        method: 'post',
        data: data.paramsData,
        params: data.queryData
    })
}
// 威胁情报--修改
export const update_attack = (data) => {
    return request({
        url: 'intelligence/manage/intelligence/update',
        method: 'post',
        data: data.paramsData,
        params: data.queryData
    })
}
// 威胁情报--删除
export const del_attack = (data) => {
    return request({
        url: 'intelligence/manage/intelligence/delete',
        method: 'post',
        data: data.paramsData,
        params: data.queryData
    })
}

// 导出列表
export const intelligenceExportExcel = (data) => {
    return request({
        url: 'intelligence/manage/intelligence/exportExcel',
        method: 'post',
        params: data.queryData,
        data: data.paramsData,
        responseType: 'blob'
    })
}
// 导出模板
export const intelligenceExportExcelTemplate = (data) => {
    return request({
        url: 'intelligence/manage/intelligence/template',
        method: 'post',
        params: data.queryData,
        data: data.paramsData,
        responseType: 'blob'
    })
}
// 常用端口--列表
export const get_commonPort = (data, page, pageSize) => {
    return axios.request({
        url: `intelligence/manage/port/page?page=${page}&pageSize=${pageSize}`,
        method: 'post',
        data: data
    }).then(result => {
        console.log(result)
        return getAjax(result)
    })
}

export const get_weibuData = (data, type) => {
    return axios.request({
        url: `isr/manage/intelligence/getLost/${type}`,
        method: 'post',
        data: data
    }).then(result => {
        console.log(result)
        return getAjax(result)
    })
}

export const get_weibuList = (data) => {
    return axios.request({
        url: `isr/manage/intelligence/findIntelligenceList`,
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    }).then(result => {
        console.log(result)
        return getAjax(result)
    })
}
