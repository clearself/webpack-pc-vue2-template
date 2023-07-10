
import request from '@/utils/server'

// 保存es
export const esSave = (data) => {
    return request({
        url: 'yc-data/manage/dataconfig/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 保存kafka
export const kafkaSave = (data) => {
    return request({
        url: 'yc-data/manage/dataconfig/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// es 和kafka测试
export const testConnect = (data) => {
    return request({
        url: 'yc-data/manage/dataconfig/testConnect',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 获取数据
export const getDataConfig = (data) => {
    return request({
        url: 'yc-data/manage/dataconfig/getDataConfig',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

