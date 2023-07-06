import request from '@/utils/server'
// 添加修改拓扑图
export const saveGraph = (data) => {
    return request({
        url: 'assets-manage/manage/topologyImg/saveTopology',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 获取拓扑图详情
export const getTopoInfo = (data) => {
    return request({
        url: 'assets-manage/manage/topologyImg/getTopologyInfo',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

