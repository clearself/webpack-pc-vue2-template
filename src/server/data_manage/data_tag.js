import request from '@/utils/server'

// 获取所有字段
export const getTree = (data) => {
    return request({
        url: 'data-center/manage/channelLabel/getTree',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

