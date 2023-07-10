import request from '@/utils/server'
export const get_tar_statistic = (data) => {
    return request({
        url: 'link-manage/manage/tar/getTarInfo',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_tar_line_data = (data) => {
    return request({
        url: 'link-manage/manage/tar/getTarTrend',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const get_tar_monitor_list = (data) => {
    return request({
        url: 'link-manage/manage/tar/pageTarInfo',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

