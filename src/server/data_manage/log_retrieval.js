import axios from 'axios'
import { getAjax } from '@/utils/http'

// 获取所有字段
export const getSelectField = (data) => {
    return axios.request({
        url: 'data-center/manage/syslog/getSelectField',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    }).then(result => {
        console.log(result)
        return getAjax(result)
    })
}
