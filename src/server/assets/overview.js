import request from '@/utils/server'
// 演练统计
export const getAssetsStatistic = (data) => {
    return request({
        url: 'assets-manage/manage/overviewChart/getAssetsNum',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_tuoputu = (data) => {
    return request({
        url: 'assets-manage/manage/overviewChart/getPath',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const getAssetsZWType = (data) => {
    return request({
        url: 'assets-manage/manage/overviewChart/getAssetsTypeOrFingerprintType',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const getAssetsZWTypeZone = (data) => {
    return request({
        url: 'assets-manage/manage/overviewChart/getZoneOrSystemNum',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const getLoopAssets = (data) => {
    return request({
        url: 'assets-manage/manage/overviewChart/getLeakOrIntelligenceTop10',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const getAlarmAssets = (data) => {
    return request({
        url: 'assets-manage/manage/overviewChart/getReportTop10',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 安全界管理
export const get_doamins = (data) => {
    return request({
        url: 'assets-manage/manage/safetyBoundary/getAllSafetyZone',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const get_devices = (data) => {
    return request({
        url: 'assets-manage/manage/safetyBoundary/getAllCompanyAssets',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const add_safe_border = (data) => {
    return request({
        url: 'assets-manage/manage/safetyBoundary/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_safe_borders = (data) => {
    return request({
        url: 'assets-manage/manage/safetyBoundary/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const delete_safe_border = (data) => {
    return request({
        url: 'assets-manage/manage/safetyBoundary/delete',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

