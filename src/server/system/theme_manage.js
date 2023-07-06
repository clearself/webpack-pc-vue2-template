import request from '@/utils/server'

// 主题设置
export const update_subject = (data) => {
    return request({
        url: 'base-server/manage/systemConfig/updateSubject',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 侧滑主题设置
export const update_subject_sideslip = (data) => {
    return request({
        url: 'base-server/manage/systemConfig/updateSubjectSideslip',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

