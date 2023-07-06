import request from '@/utils/server'

// 安全策略和主题查看
export const get_user_system_config = (data) => {
    return request({
        url: 'base-server/manage/systemConfig/getSafeConfig',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 安全修改
export const update_safety = (data) => {
    return request({
        url: 'base-server/manage/systemConfig/updateSafety',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// // 修改
// export const update_user = (data) => {
//     return request({
//         url: 'base-server/manage/adminUser/update',
//         method: 'post',
//         params: data.queryData,
//         data: data.paramsData
//     })
// }
