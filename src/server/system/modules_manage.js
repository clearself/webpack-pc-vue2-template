import request from '@/utils/server'
// 查询模块
export const queryModule = (data) => {
    return request({
        url: 'base-server/manage/resources/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 新增模块
export const saveModule = (data) => {
    return request({
        url: 'base-server/manage/resources/saveModule',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 修改模块
export const updateModule = (data) => {
    return request({
        url: 'base-server/manage/resources/updateModule',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 新增菜单
export const saveMenu = (data) => {
    return request({
        url: 'base-server/manage/resources/saveMenu',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 修改菜单
export const updateMenu = (data) => {
    return request({
        url: 'base-server/manage/resources/updateMenu',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 启用禁用
export const updateStatus = (data) => {
    return request({
        url: 'base-server/manage/resources/updateStatus',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 删除
export const deleteMenu = (data) => {
    return request({
        url: 'base-server/manage/resources/delete',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 拖动排序
export const sort = (data) => {
    return request({
        url: 'base-server/manage/resources/sort',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
