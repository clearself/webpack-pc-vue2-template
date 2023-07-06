import request from '@/utils/server'
// 资产概览组织树
export const getTreeOrg = (data) => {
    console.log(data)
    return request({
        url: 'assets-manage/manage/system/getTreeOrg',
        method: 'get',
        params: data.queryData,
        data: data.paramsData
    })
}
// 获取业务系统分组树
export const getTree = (data) => {
    console.log(data)
    return request({
        url: 'assets-manage/manage/system/getTree',
        method: 'get',
        params: data.queryData,
        data: data.paramsData
    })
}
// 添加业务系统分组树
export const addGroup = (data) => {
    console.log(data)
    return request({
        url: 'assets-manage/manage/system/addGroup',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 删除资业务系统分组
export const updateGroup = (data) => {
    console.log(data)
    return request({
        url: 'assets-manage/manage/system/updateGroup',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 获取资产分组树
export const findGroup = (data) => {
    console.log(data)
    return request({
        url: 'assets-manage/manage/assets/findGroup',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 添加资产分组树
export const saveGroup = (data) => {
    console.log(data)
    return request({
        url: 'assets-manage/manage/assets/saveGroup',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 删除资产分组
export const deleteGroup = (data) => {
    console.log(data)
    return request({
        url: 'assets-manage/manage/assets/deleteGroup',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 添加域名
export const addDomainName = (data) => {
    console.log(data)
    return request({
        url: 'assets-manage/manage/domainInfo/saveDomain',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 获取域名
export const get_domain = (data) => {
    console.log(data)
    return request({
        url: 'assets-manage/manage/domainInfo/domainPage',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 获取域名下子域名
export const get_domain_children = (data) => {
    console.log(data)
    return request({
        url: 'assets-manage/manage/domainInfo/subDomainPage',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 获取域名下子域名
export const get_domain_tree = (data) => {
    console.log(data)
    return request({
        url: 'assets-manage/manage/domainInfo/domainMap',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 删除域名
export const delete_domain = (data) => {
    console.log(data)
    return request({
        url: 'assets-manage/manage/domainInfo/delDomain',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 添加资产
export const add_assets = (data) => {
    console.log(data)
    return request({
        url: 'assets-manage/manage/assets/addAssets',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 获取资产类型
export const get_types = (data) => {
    return request({
        url: 'assets-manage/manage/assets/getDeviceTypeTree',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 获取厂商
export const getAllManufacturer = (data) => {
    return request({
        url: 'assets-manage/manage/assets/getAllManufacturer',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 查询资产
export const get_assets = (data) => {
    return request({
        url: 'assets-manage/manage/assets/queryAssetsList',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 修改资产
export const edit_assets = (data) => {
    return request({
        url: 'assets-manage/manage/assets/updateAssets',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 删除资产类型
export const delete_asset = (data) => {
    return request({
        url: 'assets-manage/manage/assets/deleteAssets',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 拓扑图数据
export const get_tuopu_data = (data) => {
    return delete ('assets-manage/manage/topology/getTopology', { // params参数必写 , 如果没有参数传{}也可以
        params: data
    })
}
// 刷新域名
export const refresh_data = (data) => {
    return request({
        url: 'assets-manage/manage/domainInfo/searchDomain',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 获取应用系统
export const getSystemType = (data) => {
    return request({
        url: 'assets-manage/manage/assets/getSystemType',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 根据ip获取漏洞信息
export const getScanLeakByIp = (data) => {
    return request({
        url: 'assets-manage/manage/assets/getScanLeakByAssetsId',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 查询IP是否已存在
export const checkIP = (data) => {
    return request({
        url: 'assets-manage/manage/assets/checkIPBug',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 应用系统查询
export const getSystem = (data) => {
    return request({
        url: 'assets-manage/manage/system/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 添加应用系统
export const addSystem = (data) => {
    return request({
        url: 'assets-manage/manage/system/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const updateSystem = (data) => {
    return request({
        url: 'assets-manage/manage/system/update',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 删除应用系统
export const delectSystem = (data) => {
    return request({
        url: 'assets-manage/manage/system/delete',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 修改应用系统
export const assetChat = (data) => {
    return request({
        url: 'assets-manage/manage/statistics/getStatistics',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 系统列表
export const get_menu = (data) => {
    return request({
        url: 'assets-manage/manage/permission/getMenu',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 安全域分页
export const safetyZone = (data) => {
    return request({
        url: 'assets-manage/manage/safetyZone/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 安全域添加
export const addZoom = (data) => {
    return request({
        url: 'assets-manage/manage/safetyZone/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const updateZoom = (data) => {
    return request({
        url: 'assets-manage/manage/safetyZone/update',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 安全域删除
export const delZoom = (data) => {
    return request({
        url: 'assets-manage/manage/safetyZone/delete',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 获取所有安全域
export const get_all_zoneIds = (data) => {
    return request({
        url: 'assets-manage/manage/assets/getAllZone',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 获取资产危情数据
export const get_threatData = (data) => {
    return request({
        url: 'assets-manage/manage/assets/getIntelligenceById',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const getAlarmsByIp = (data) => {
    return request({
        url: 'assets-manage/manage/assets/getReportByIp',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 获取映射

export const findIpLinkList = (data) => {
    return request({
        url: 'assets-manage/manage/ipLink/findIpLinkList',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 搜索单个映射
export const findOneIpLink = (data) => {
    return request('assets-manage/manage/ipLink/findOneIpLink', {
        params: data
    })
}

export const deleteIpLink = (data) => {
    return request({
        url: 'assets-manage/manage/ipLink/deleteIpLink',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 新增映射
export const addIpLink = (data) => {
    return request({
        url: 'assets-manage/manage/ipLink/addIpLink',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const updateIpLink = (data) => {
    return request({
        url: 'assets-manage/manage/ipLink/updateIpLink',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 修改映射
export const editIpLink = (data) => {
    return request({
        url: 'assets-manage/manage/ipLink/modifyIpLink',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 安全域拓扑图
export const seeTopology = (data) => {
    return request({
        url: 'assets-manage/manage/safetyZone/topology',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 刷新資產數據
export const refresh_assetsSummary = (data) => {
    return request({
        url: 'assets-manage/manage/assets/assetsSummary',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 指纹分类---添加,修改
export const addType = (data) => {
    return request({
        url: 'assets-manage/manage/fingerprintType/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 指纹分类---列表
export const getType = (data) => {
    return request({
        url: 'assets-manage/manage/fingerprintType/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 指纹分类---删除
export const delType = (data) => {
    return request({
        url: 'assets-manage/manage/fingerprintType/delete',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 指纹---获取分类
export const getFingerType = (data) => {
    return request({
        url: 'assets-manage/manage/fingerprintWarehouse/findFingerprintType',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 指纹---添加,修改
export const addFinger = (data) => {
    return request({
        url: 'assets-manage/manage/fingerprintWarehouse/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 指纹---列表
export const getFinger = (data) => {
    return request({
        url: 'assets-manage/manage/fingerprintWarehouse/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 指纹---删除
export const delFinger = (data) => {
    return request({
        url: 'assets-manage/manage/fingerprintWarehouse/delete',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 资产发现---列表
export const assetsFindList = (data) => {
    return request({
        url: 'assets-manage/manage/assetsFind/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 资产发现---添加
export const assetsFindAdd = (data) => {
    return request({
        url: 'assets-manage/manage/assetsFind/addAssets',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 拓扑管理---保存图片
export const savePath = (data) => {
    return request({
        url: 'assets-manage/manage/topologyImg/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const updatePath = (data) => {
    return request({
        url: 'assets-manage/manage/topologyImg/update',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 拓扑管理---获取图片
export const getPath = (data) => {
    return request({
        url: 'assets-manage/manage/topologyImg/getPath',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 资产信息库---导出数据
export const exportExcel = (data) => {
    return request('assets-manage/manage/assets/exportExcel', {
        params: data,
        responseType: 'arraybuffer'
    })
}

export const getUsers = (data) => {
    return request({
        url: 'assets-manage/manage/system/getAllUsers',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 网段
export const getBorder = (data) => {
    return request({
        url: 'assets-manage/manage/networkSegment/getAllSafetyBoundary',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const getZones = (data) => {
    return request({
        url: 'assets-manage/manage/networkSegment/getSafetyBoundaryZone',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const addNetSegment = (data) => {
    return request({
        url: 'assets-manage/manage/networkSegment/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const updateNetSegment = (data) => {
    return request({
        url: 'assets-manage/manage/networkSegment/update',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const getNetSegment = (data) => {
    return request({
        url: 'assets-manage/manage/networkSegment/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const delNetSegment = (data) => {
    return request({
        url: 'assets-manage/manage/networkSegment/delete',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 资产类型--获取设备类型树
export const getDeviceTypeTree = (data) => {
    console.log(data)
    return request({
        url: 'assets-manage/manage/deviceType/getDeviceTypeTree',
        method: 'post',
        data: data
    })
}
// 资产类型--添加修改
export const saveDeviceType = (data) => {
    return request({
        url: 'assets-manage/manage/deviceType/save',
        method: 'post',
        data: data
    })
}
export const updateDeviceType = (data) => {
    return request({
        url: 'assets-manage/manage/deviceType/update',
        method: 'post',
        data: data
    })
}
// 资产类型--删除
export const delDeviceType = (data) => {
    return request({
        url: 'assets-manage/manage/deviceType/delete',
        method: 'post',
        data: data
    })
}

// 资产联系人
export const get_asset_users = (data) => {
    return request({
        url: 'assets-manage/manage/assets/getAllUsers',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 资产自定义表头
export const get_header_list = (data) => {
    return request({
        url: 'assets-manage/manage/assets/findHeader',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const save_header_list = (data) => {
    return request({
        url: 'assets-manage/manage/assets/updateHeader',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 资产信息库树结构
export const get_asset_info_tree = (data) => {
    return request({
        url: 'assets-manage/manage/assets/getTree',
        method: 'post',
        data: data
    })
}
export const get_asset_label = (data) => {
    return request({
        url: 'assets-manage/manage/assets/getLabel',
        method: 'post',
        data: data
    })
}
// 资产系统属性
export const get_asset_system_attr = (data) => {
    return request({
        url: 'assets-manage/manage/assets/getSysAttr',
        method: 'post',
        data: data
    })
}
// 资产标签
export const get_label_tree = (data) => {
    return request({
        url: 'assets-manage/manage/label/getGroup',
        method: 'post',
        data: data
    })
}
export const save_label_group = (data) => {
    return request({
        url: 'assets-manage/manage/label/saveGroup',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const delete_label_group = (data) => {
    return request({
        url: 'assets-manage/manage/label/deleteGroup',
        method: 'post',
        data: data
    })
}
export const get_label_list = (data) => {
    return request({
        url: 'assets-manage/manage/label/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const save_label = (data) => {
    return request({
        url: 'assets-manage/manage/label/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const update_label = (data) => {
    return request({
        url: 'assets-manage/manage/label/update',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const delete_label = (data) => {
    return request({
        url: 'assets-manage/manage/label/delete',
        method: 'post',
        data: data
    })
}
// 资产属性
export const get_device_attr = (data) => {
    return request({
        url: 'assets-manage/manage/deviceType/getType',
        method: 'post',
        data: data
    })
}
export const get_attr_list = (data) => {
    return request({
        url: 'assets-manage/manage/deviceType/pageAttr',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const save_attr = (data) => {
    return request({
        url: 'assets-manage/manage/deviceType/saveAttr',
        method: 'post',
        data: data
    })
}
export const update_attr = (data) => {
    return request({
        url: 'assets-manage/manage/deviceType/updateAttr',
        method: 'post',
        data: data
    })
}
export const delete_attr = (data) => {
    return request({
        url: 'assets-manage/manage/deviceType/deleteAttr',
        method: 'post',
        data: data
    })
}

export const getTmapList = (data) => {
    return request({
        url: 'assets-manage/manage/topologyImg/getTopologyPage',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const deleteTmap = (data) => {
    return request({
        url: 'assets-manage/manage/topologyImg/deleteTopology',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const tmapAssetsType = (data) => {
    return request({
        url: 'assets-manage/manage/topologyImg/getDeviceTypeTree',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const getAssetsList = (data) => {
    return request({
        url: 'assets-manage/manage/topologyImg/queryAssetsList',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const getOneTypeAssets = (data) => {
    return request({
        url: 'assets-manage/manage/topologyImg/getAssets',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 下载模板
export const template = (data) => {
    return request({
        url: 'assets-manage/manage/assets/template',
        method: 'post',
        params: data.queryData,
        data: data.paramsData,
        responseType: 'blob'
    })
}
// 导出资产
export const exportExcel1 = (data) => {
    return request({
        url: 'assets-manage/manage/assets/exportExcel',
        method: 'post',
        params: data.queryData,
        data: data.paramsData,
        responseType: 'blob'
    })
}
// 系统下载模板
export const systemTemplate = (data) => {
    return request({
        url: 'assets-manage/manage/system/template',
        method: 'post',
        params: data.queryData,
        data: data.paramsData,
        responseType: 'blob'
    })
}
// 导出资产
export const systemExportExcel1 = (data) => {
    return request({
        url: 'assets-manage/manage/system/exportExcel',
        method: 'post',
        params: data.queryData,
        data: data.paramsData,
        responseType: 'blob'
    })
}
// 查看拓扑图
export const getTopologyAll = (data) => {
    return request({
        url: 'assets-manage/manage/safetyZone/getTopologyAll',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 安全域查看
export const getSafetyZoneById = (data) => {
    return request({
        url: 'assets-manage/manage/safetyZone/getSafetyZoneById',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 资产发现库左侧结构树
export const find_asset_info_tree = (data) => {
    return request({
        url: 'assets-manage/manage/assetsFind/getTree',
        method: 'post',
        data: data
    })
}
// 资产发现查询
export const find_assets = (data) => {
    return request({
        url: 'assets-manage/manage/assetsFind/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 资产发现获取厂商
export const findAllManufacturer = (data) => {
    return request({
        url: 'assets-manage/manage/assetsFind/getAllManufacturer',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const getAssetsBySysId = (data) => {
    return request({
        url: 'assets-manage/manage/system/getAssetsBySysId',
        method: 'get',
        params: data.queryData,
        data: data.paramsData
    })
}
// 资产发现获取资产类型
export const findTypes = (data) => {
    return request({
        url: 'assets-manage/manage/assetsFind/getDeviceTypeTree',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 资产发现入库资产
export const findAssets = (data) => {
    console.log(data)
    return request({
        url: 'assets-manage/manage/assetsFind/addAssets',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 资产发现获取应用系统
export const findSystemType = (data) => {
    return request({
        url: 'assets-manage/manage/assetsFind/getSystemType',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 资产发现获取所有安全域
export const findAllZoneIds = (data) => {
    return request({
        url: 'assets-manage/manage/assetsFind/getAllZone',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// label
export const findAssetLabel = (data) => {
    return request({
        url: 'assets-manage/manage/assetsFind/getLabel',
        method: 'post',
        data: data
    })
}

// 资产发现获取所有资产联系人
export const findAssetusers = (data) => {
    return request({
        url: 'assets-manage/manage/assetsFind/getAllUsers',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 添加应用系统
export const findSystem = (data) => {
    return request({
        url: 'assets-manage/manage/assetsFind/addSystem',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 资产系统属性
export const findAssetSystemAttr = (data) => {
    return request({
        url: 'assets-manage/manage/assetsFind/getSysAttr',
        method: 'post',
        data: data
    })
}

// 加黑名单
export const findSaveBalck = (data) => {
    return request({
        url: 'assets-manage/manage/assetsFind/updateBalck',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 资产发现 获取工单模板
export const findTemp = (data) => {
    return request({
        url: 'assets-manage/manage/assetsFind/getWorkMould',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 资产发现发起工单
export const findWorkTask = (data) => {
    return request({
        url: 'assets-manage/manage/assetsFind/createOrder',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 资产发现发现任务新增
export const saveTaskMaster = (data) => {
    return request({
        url: 'assets-manage/manage/assetsFind/saveTaskMaster',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 资产发现发现任务编辑
export const updateTaskMaster = (data) => {
    return request({
        url: 'assets-manage/manage/assetsFind/updateTaskMaster',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 资产发现发现任务列表
export const findTaskMaster = (data) => {
    return request({
        url: 'assets-manage/manage/assetsFind/findTaskMaster',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 资产发现发现任务子任务
export const findTaskSub = (data) => {
    return request({
        url: 'assets-manage/manage/assetsFind/findTaskSub',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 资产发现发现任务子任务执行结果
export const findSubData = (data) => {
    return request({
        url: 'assets-manage/manage/assetsFind/findSubData',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 资产发现发现任务删除
export const deleteTaskMaster = (data) => {
    return request({
        url: 'assets-manage/manage/assetsFind/deleteTaskMaster',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 资产发现发现任务开启关闭
export const assetsFindOpen = (data) => {
    return request({
        url: 'assets-manage/manage/assetsFind/open',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const getField = (data) => {
    return request({
        url: 'assets-manage/manage/menuField/getField',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const saveField = (data) => {
    return request({
        url: 'assets-manage/manage/menuField/saveField',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const getSortFieldAssets = (data) => {
    return request({
        url: 'assets-manage/manage/assetsChartSet/getSortField',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 表格提交
export const getTableassetsChartSet = (data) => {
    return request({
        url: 'assets-manage/manage/assetsChartSet/getTableChart',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 柱状图提交
export const getBarassetsChartSet = (data) => {
    return request({
        url: 'assets-manage/manage/assetsChartSet/getBarChart',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 折线图提交
export const getLineassetsChartSet = (data) => {
    return request({
        url: 'assets-manage/manage/assetsChartSet/getLineChart',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 面积图提交
export const getAreaassetsChartSet = (data) => {
    return request({
        url: 'assets-manage/manage/assetsChartSet/getAreaChart',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 饼图提交
export const getPieassetsChartSet = (data) => {
    return request({
        url: 'assets-manage/manage/assetsChartSet/getPieChart',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 指标提交
export const getTarassetsChartSet = (data) => {
    return request({
        url: 'assets-manage/manage/assetsChartSet/getTarChart',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 保存成图表
export const saveToassetsChart = (data) => {
    return request({
        url: 'assets-manage/manage/assetsChartSet/saveToChart',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 获取组
export const findSearchTypeassetsChart = (data) => {
    return request({
        url: 'assets-manage/manage/assetsChartSet/findSearchType',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 获取field对应的中文
export const getEnumInfoassets = (data) => {
    return request({
        url: 'assets-manage/manage/assetsChartSet/getEnumInfo',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const getOrgLevel = (data) => {
    console.log(data)
    return request({
        url: 'assets-manage/manage/assets/getOrgLevel',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
