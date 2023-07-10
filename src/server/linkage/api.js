import request from '@/utils/server'
/* 设备联动*/
export const get_link_device = (data) => {
    return request({
        url: 'link-manage/manage/nft/pageLinkDevice',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_tar_link_device = (data) => {
    return request({
        url: 'link-manage/manage/tar/pageLinkDevice',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const save_link_device = (data) => {
    return request({
        url: 'link-manage/manage/nft/saveLinkDevice',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const update_link_device = (data) => {
    return request({
        url: 'link-manage/manage/nft/updateLinkDevice',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const save_tar_link_device = (data) => {
    return request({
        url: 'link-manage/manage/tar/saveLinkDevice',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const update_tar_link_device = (data) => {
    return request({
        url: 'link-manage/manage/tar/updateLinkDevice',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const delete_link_device = (data) => {
    return request({
        url: 'link-manage/manage/nft/deleteLinkDevice',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const delete_tar_link_device = (data) => {
    return request({
        url: 'link-manage/manage/tar/deleteLinkDevice',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const switch_link_device_status = (data) => {
    return request({
        url: 'link-manage/manage/nft/onLinkDevice',
        method: 'post',
        data: data
    })
}
export const switch_tar_link_device_status = (data) => {
    return request({
        url: 'link-manage/manage/tar/onLinkDevice',
        method: 'post',
        data: data
    })
}
/* 时间设置*/
export const save_time_config = (data) => {
    return request({
        url: 'link-manage/manage/timeConfig/sync',
        method: 'post',
        data: data
    })
}

/* 全景流量概览*/
export const get_run_time = (data) => {
    return request({
        url: 'link-manage/manage/nft/runtime',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_ntf_use = (data) => {
    return request({
        url: 'link-manage/manage/nft/metric',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_ntf_save = (data) => {
    return request({
        url: 'link-manage/manage/nft/storage',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_alarm = (data) => {
    return request({
        url: 'link-manage/manage/nft/count',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_line_data = (data) => {
    return request({
        url: 'link-manage/manage/nft/chart',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const stop_task = (data) => {
    return request({
        url: 'link-manage/manage/syslog/saveTaskCondition',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_pcac = (data) => {
    return request({
        url: 'link-manage/manage/syslog/viewPcap',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// tar
export const get_tar_lib_list = (data) => {
    return request({
        url: 'link-manage/manage/tar/pageFeatureLibrary',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const add_tar_lib = (data) => {
    return request({
        url: 'link-manage/manage/tar/saveFeatureLibrary',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const delete_tar_lib_list = (data) => {
    return request({
        url: 'link-manage/manage/tar/deleteFeatureLibrary',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const revert_tar_lib_list = (data) => {
    return request({
        url: 'link-manage/manage/tar/rolbackFeatureLibrary',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
