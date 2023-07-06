
import request from '@/utils/server'

export const saveTag = (data) => {
    return request({
        url: 'data-center/manage/labelNames/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_tag_copy_list = (data) => {
    return request({
        url: 'data-center/manage/labelNames/getTwoLevelNames',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 获取可选字段
export const get_selested_all_fileds = (data) => {
    return request({
        url: 'data-center/manage/syslog/getAllField',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

