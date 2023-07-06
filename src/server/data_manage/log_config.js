
import request from '@/utils/server'

// 查询
export const getData = (data) => {
    return request({
        url: 'data-center/manage/logSet/get',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 保存
export const saveData = (data) => {
    return request({
        url: 'data-center/manage/logSet/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

