import request from '@/utils/server'

// 配置参数
export const get_es_config = (data) => {
    return request({
        url: 'base-server/manage/platformConfig/getPlatformConfig',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const save_es_config = (data) => {
    return request({
        url: 'base-server/manage/platformConfig/saveEsAndKafka',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const save_channel_config = (data) => {
    return request({
        url: 'base-server/manage/platformConfig/saveChannel',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const delete_channel_config = (data) => {
    return request({
        url: 'base-server/manage/platformConfig/deleteChannels',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const get_channel_config = (data) => {
    return request({
        url: 'base-server/manage/platformConfig/getChannels',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const get_logstash = (data) => {
    return request({
        url: 'base-server/manage/platformConfig/getLogstashNodes',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const save_logstash = (data) => {
    return request({
        url: 'base-server/manage/platformConfig/saveLogstashNodes',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const updateLogstashNodes = (data) => {
    return request({
        url: 'base-server/manage/platformConfig/updateLogstashNodes',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const delete_logstash = (data) => {
    return request({
        url: 'base-server/manage/platformConfig/deleteLogstashNodes',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

