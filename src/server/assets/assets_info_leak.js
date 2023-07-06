import axios from 'axios'
import request from '@/utils/server'
const CancelToken = axios.CancelToken
const timeoutData = 24 * 60 * 60000
export const getLdInfo = (data) => {
    return request({
        url: 'assets-manage/manage/assets/getLdInfo',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const getLeakList = (data) => {
    return request({
        url: 'assets-manage/manage/scanLeakAssets/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const getLeakTemp = (data) => {
    return request({
        url: 'assets-manage/manage/scanLeakAssets/getWorkMouldBySendId',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const add_workTask = (data) => {
    return request({
        url: 'assets-manage/manage/scanLeakAssets/createOrder',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const getAssetTypePrcent = (data) => {
    return request({
        url: 'assets-manage/manage/scanLeakAssets/assetType',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const getAssetList = (data) => {
    return request({
        url: 'assets-manage/manage/scanLeakAssets/assetPage',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const get_workFlowInfo = (data) => {
    return request({
        url: 'assets-manage/manage/scanLeakAssets/getOrderInfo',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const get_ElementInfo = (data) => {
    return request({
        url: 'assets-manage/manage/scanLeakAssets/getNodeInfo',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

