import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import { getAjax, getAjaxSome, getAjaxFile } from '@/utils/http'
import request from '@/utils/server'
// 系统列表
export const get_menu = (data) => {
    return request({
        url: 'leaks/manage/permission/getMenu',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    }).then(result => {
        console.log(result)
        return getAjaxSome(result)
    })
}

export const getEngTypes = (data) => {
    return request({
        url: 'leaks/manage/scanEngine/getAllType',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const getFactoryTypes = (data) => {
    return request({
        url: 'leaks/manage/scanEngine/getAllFactory',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const getEngList = (data) => {
    return request({
        url: 'leaks/manage/scanEngine/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const deleteEng = (data) => {
    return request({
        url: 'leaks/manage/scanEngine/delete',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const saveEng = (data) => {
    return request({
        url: 'leaks/manage/scanEngine/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const updateEng = (data) => {
    return request({
        url: 'leaks/manage/scanEngine/update',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 漏洞信息库

export const getLoopholeList = (data) => {
    return request({
        url: 'leaks/manage/leakInfo/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const deleteLoophole = (data) => {
    return request({
        url: 'leaks/manage/leakInfo/delete',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const saveLoophole = (data) => {
    return request({
        url: 'leaks/manage/leakInfo/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const updateLoophole = (data) => {
    return request({
        url: 'leaks/manage/leakInfo/update',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 漏洞管理

export const getLeakList = (data) => {
    return request({
        url: 'leaks/manage/scanLeak/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const deleteLeak = (data) => {
    return request({
        url: 'leaks/manage/scanLeak/delete',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const saveLeak = (data) => {
    return request({
        url: 'leaks/manage/scanLeak/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const updateLeak = (data) => {
    return request({
        url: 'leaks/manage/scanLeak/update',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const getAssets = (data) => {
    return request({
        url: 'leaks/manage/scanLeak/getAllAssets',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const getSystem = (data) => {
    return request({
        url: 'leaks/manage/scanLeak/getAllSystem',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const getLeakTemp = (data) => {
    return request({
        url: 'leaks/manage/scanLeak/getWorkMouldBySendId',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const add_workTask = (data) => {
    return request({
        url: 'leaks/manage/scanLeak/createOrder',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_workFlowInfo = (data) => {
    return request({
        url: 'leaks/manage/scanLeak/getOrderInfo',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_ElementInfo = (data) => {
    return request({
        url: 'leaks/manage/scanLeak/getNodeInfo',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const getAssetTypePrcent = (data) => {
    return request({
        url: 'leaks/manage/scanLeak/assetType',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const getAssetList = (data) => {
    return request({
        url: 'leaks/manage/scanLeak/assetPage',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const add_label = (data) => {
    return request({
        url: 'leaks/manage/scanLeak/saveLabel',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const getAssetsLabel = (data) => {
    return request({
        url: 'leaks/manage/scanLeak/getAllLabel',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 标签
export const getLabelList = (data) => {
    return request({
        url: 'leaks/manage/labelInfo/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const deleteLabel = (data) => {
    return request({
        url: 'leaks/manage/labelInfo/delete',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const saveLabel = (data) => {
    return request({
        url: 'leaks/manage/labelInfo/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const updateLabel = (data) => {
    return request({
        url: 'leaks/manage/labelInfo/update',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 任务
export const getTaskList = (data) => {
    return request({
        url: 'leaks/manage/taskManage/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_policy = (data) => {
    return request({
        url: 'leaks/manage/taskManage/getPolicy',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const get_assets = (data) => {
    return request({
        url: 'leaks/manage/taskManage/getAllAssets',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const get_system = (data) => {
    return request({
        url: 'leaks/manage/taskManage/getAllSystem',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const finish_task = (data) => {
    return request({
        url: 'leaks/manage/taskManage/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const finish_task_update = (data) => {
    return request({
        url: 'leaks/manage/taskManage/update',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const deleteTask = (data) => {
    return request({
        url: 'leaks/manage/taskManage/delete',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const getTaskListLog = (data) => {
    return request({
        url: 'leaks/manage/taskManage/getTaskInfoLogPage',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const switchScan = (data) => {
    return request({
        url: 'leaks/manage/taskManage/open',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const reScan = (data) => {
    return request({
        url: 'leaks/manage/taskManage/reScanTask',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 概览
export const get_leak_type = (data) => {
    return request({
        url: 'leaks/manage/overview/getLeakTypeDisByMonth',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_leak_level = (data) => {
    return request({
        url: 'leaks/manage/overview/getRiskLevelNum',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_year_statistic = (data) => {
    return request({
        url: 'leaks/manage/overview/getMonthLeak',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_leak_type_tend = (data) => {
    return request({
        url: 'leaks/manage/overview/getLeakType',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_leak_type_level = (data) => {
    return request({
        url: 'leaks/manage/overview/getLeakTypeDis',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_system_leak = (data) => {
    return request({
        url: 'leaks/manage/overview/getSystemDis',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_overview_table = (data) => {
    return request({
        url: 'leaks/manage/overview/getLeakTop20',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 导出模板
export const leakExportExcelTemplate = (data) => {
    return request({
        url: 'leaks/manage/scanLeak/template',
        method: 'get',
        params: data.queryData,
        data: data.paramsData,
        responseType: 'blob'
    })
}
