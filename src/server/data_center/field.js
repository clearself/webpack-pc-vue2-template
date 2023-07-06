import axios from 'axios'
import { getAjax } from '@/utils/http'

export const get_field = (data) => {
    return axios.request({
        url: 'data-center/manage/logfield/getAllField',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    }).then(result => {
        console.log(result)
        return getAjax(result)
    })
}

export const save_field = (data) => {
    return axios.request({
        url: 'data-center/manage/logfield/saveFiled',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    }).then(result => {
        console.log(result)
        return getAjax(result)
    })
}
export const change_field_status = (data) => {
    return axios.request({
        url: 'data-center/manage/logfield/updateStatus',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    }).then(result => {
        console.log(result)
        return getAjax(result)
    })
}

