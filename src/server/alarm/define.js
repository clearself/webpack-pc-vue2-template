import request from '@/utils/server'
// 获取所有人
export const getAllUsers = (data) => {
    return request({
        url: 'alarm/manage/workMould/getAllUsers',
        method: 'post',
        data: data
    })
}
// 获取所有部门
export const getAllDep = (data) => {
    return request({
        url: 'alarm/manage/workMould/getAllDep',
        method: 'post',
        data: data
    })
}
// 获取所有角色
export const getAllRoles = (data) => {
    return request({
        url: 'alarm/manage/workMould/getAllUserRoles',
        method: 'post',
        data: data
    })
}
// 获取工单发起对象
export const getSendObject = (data) => {
    return request({
        url: 'alarm/manage/workMould/getSendObj',
        method: 'post',
        data: data
    })
}
// 攻击者分析地图
export const getAttackMap = (data) => {
    return request({
        url: 'alarm/manage/attackAnalysis/mapShow',
        method: 'post',
        data: data
    })
}
export const getAttackTopBar = (data) => {
    return request({
        url: 'alarm/manage/attackAnalysis/attackTop',
        method: 'post',
        data: data
    })
}
export const getAttackStage = (data) => {
    return request({
        url: 'alarm/manage/attackAnalysis/attackStage',
        method: 'post',
        data: data
    })
}
// 获取攻击行为
export const getAlarmType = (data) => {
    return request({
        url: 'alarm/manage/attackAnalysis/alarmType',
        method: 'post',
        data: data
    })
}
// 获取攻击行为
export const getAssetAlarmType = (data) => {
    return request({
        url: 'alarm/manage/assetsAnalysis/alarmType',
        method: 'post',
        data: data
    })
}
// 获取列表
export const getAttackList = (data) => {
    return request({
        url: 'alarm/manage/attackAnalysis/page',
        method: 'post',
        data: data.paramsData,
        params: data.queryData
    })
}
// 查看资产列表
export const getAssetTable = (data) => {
    return request({
        url: 'alarm/manage/attackAnalysis/getAssetsBySrcIp',
        method: 'post',
        data: data.paramsData,
        params: data.queryData
    })
}
// 获取告警列表
export const getAlarmTable = (data) => {
    return request({
        url: 'alarm/manage/attackAnalysis/getAlarmBySrcIp',
        method: 'post',
        data: data.paramsData,
        params: data.queryData
    })
}

// 受害资产分析
export const getAssetList = (data) => {
    return request({
        url: 'alarm/manage/assetsAnalysis/page',
        method: 'post',
        data: data.paramsData,
        params: data.queryData
    })
}
// 所有人
export const getAlarmUsers = (data) => {
    return request({
        url: 'alarm/manage/warnSound/getAllUsers',
        method: 'post',
        data: data
    })
}
// 获取告警模板
export const getAlarmTemplate = (data) => {
    return request({
        url: 'alarm/manage/alarmList/getWorkMould',
        method: 'post',
        data: data
    })
}
// 资产获取告警列表
export const getAssetAlarmTable = (data) => {
    return request({
        url: 'alarm/manage/assetsAnalysis/getAlarmByDesIp',
        method: 'post',
        data: data.paramsData,
        params: data.queryData
    })
}
// 获取攻击者、资产模板
export const getAssetTemplate = (data) => {
    return request({
        url: 'alarm/manage/common/getWorkMouldBySendId',
        method: 'post',
        data: data
    })
}
// 受害资产1图表
export const getAssetBarPie = (data) => {
    return request({
        url: 'alarm/manage/assetsAnalysis/top',
        method: 'post',
        data: data
    })
}
// 受害资产2图表
export const getAssetBar2 = (data) => {
    return request({
        url: 'alarm/manage/assetsAnalysis/speTop',
        method: 'post',
        data: data
    })
}
// 受害资产3图表
export const getAssetBarPie3 = (data) => {
    return request({
        url: 'alarm/manage/assetsAnalysis/topGroup',
        method: 'post',
        data: data
    })
}
// 发起工单
export const addWorkOrder = (data) => {
    return request({
        url: 'alarm/manage/alarmList/createOrder',
        method: 'post',
        data: data.paramsData,
        params: data.queryData
    })
}
// 受害资产发起
export const assetsAnalysisAdd_workTask = (data) => {
    return request({
        url: 'alarm/manage/assetsAnalysis/createOrder',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 攻击者发起
export const attackAnalysisAdd_workTask = (data) => {
    return request({
        url: 'alarm/manage/attackAnalysis/createOrder',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 状态变更
export const changeStatus = (data) => {
    return request({
        url: 'alarm/manage/alarmList/changeStatus',
        method: 'post',
        data: data
    })
}
// 获取告警配置列表
export const getAlarmConfigTable = (data) => {
    return request({
        url: 'alarm/manage/warnSound/page',
        method: 'post',
        data: data.paramsData,
        params: data.queryData
    })
}
// 删除
export const deleteAlarmConfigTable = (data) => {
    return request({
        url: 'alarm/manage/warnSound/delete',
        method: 'post',
        data: data
    })
}
// 条件
export const getConfigCondition = (data) => {
    return request({
        url: 'alarm/manage/warnSound/allCondition',
        method: 'post',
        data: data
    })
}
// 告警字段
export const getAlarmFields = (data) => {
    return request({
        url: 'alarm/manage/warnSound/getAlarmField',
        method: 'post',
        data: data
    })
}
// 编辑
export const saveAlarmConfig = (data) => {
    return request({
        url: 'alarm/manage/warnSound/save',
        method: 'post',
        data: data
    })
}
export const updateAlarmConfig = (data) => {
    return request({
        url: 'alarm/manage/warnSound/update',
        method: 'post',
        data: data
    })
}
// 受害资产详情
export const assetsInfo1 = (data) => {
    return request({
        url: 'alarm/manage/assetsAnalysis/assetsInfo',
        method: 'post',
        data: data
    })
}
// 获取自动响应信息
export const getAutoResponse = (data) => {
    return request({
        url: 'alarm/manage/alarmList/getAutoResponse',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
