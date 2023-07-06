import request from '@/utils/server'
const timeoutData = 24 * 60 * 60000
// 系统列表
export const get_menu = (data) => {
    return request({
        url: 'alarm/manage/permission/getMenu',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 新增或修改合规模板
export const addTemplate = (data) => {
    return request({
        url: 'alarm/manage/hgTemplate/saveOrModifyHgTemplate',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 模板列表
export const getList = (data) => {
    return request({
        url: 'alarm/manage/hgTemplate/findHgTemplateList',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 新增或编辑合规项
export const addItem = (data) => {
    return request({
        url: 'alarm/manage/hgTemplate/addOrModifyHgItem',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 合规项list
export const getItemList = (data) => {
    return request({
        url: 'alarm/manage/hgTemplate/findHgItemList',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 删除模板
export const delTemplate = (data) => {
    return request({
        url: 'alarm//manage/hgTemplate/deleteHgTemplate',
        method: 'delete',
        params: data
    })
}
// 删除合规项
export const delItem = (data) => {
    return request({
        url: 'alarm//manage/hgTemplate/deleteHgItem',
        method: 'delete',
        params: data
    })
}

// 攻击溯源------手动告警列表
export const getReportList = (data) => {
    return request({
        url: 'alarm/manage/operSafeReport/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 攻击溯源------发起告警

// 攻击溯源------编辑告警
export const editReport = (data) => {
    return request({
        url: 'alarm/manage/operSafeReport/update',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const editReportCommand = (data) => {
    return request({
        url: 'alarm/manage/operSafeReportCommander/update',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 攻击溯源------手动处置
export const dealReport = (data) => {
    return request({
        url: 'alarm/manage/operSafeReport/deal',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 攻击溯源------自动告警列表
export const getAutoList = (data) => {
    return request({
        url: 'alarm/manage/autoSafeReport/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 攻击溯源------自动处置
export const autoReport = (data) => {
    return request({
        url: 'alarm/manage/autoSafeReport/deal',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 攻击溯源------自动忽略
export const ignore = (data) => {
    return request({
        url: 'alarm/manage/autoSafeReport/ignore',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 攻击溯源------告警图表

// 攻击溯源------手动列表获取小组
export const allSysRoles = (data) => {
    return request({
        url: 'alarm/manage/operSafeReport/allSysRoles',
        method: 'get',
        params: data
    })
}
// 攻击溯源------自动列表获取小组
export const allAutoRoles = (data) => {
    return request({
        url: 'alarm/manage/autoSafeReport/allSysRoles',
        method: 'get',
        params: data
    })
}

// 手动告警（指挥调度）
export const addReportCommand = (data) => {
    return request({
        url: 'alarm/manage/operSafeReport/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const getReportListCommand = (data) => {
    return request({
        url: 'alarm/manage/operSafeReportCommander/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 手动告警--处置
export const sendManualDisposal = (data) => {
    return request({
        url: 'alarm/manage/operSafeReport/isAnalysis',
        method: 'post',
        data: data
    })
}
export const sendManualDisposalCommand = (data) => {
    return request({
        url: 'alarm/manage/operSafeReportCommander/isAnalysis',
        method: 'post',
        data: data
    })
}
export const getManualUsers = (data) => {
    return request({
        url: 'alarm/manage/operSafeReport/getAllUsers',
        method: 'post',
        data: data
    })
}
export const getManualUsersCommand = (data) => {
    return request({
        url: 'alarm/manage/operSafeReportCommander/getAllUsers',
        method: 'post',
        data: data
    })
}
export const dealReportCommand = (data) => {
    return request({
        url: 'alarm/manage/operSafeReportCommander/deal',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const allSysRolesCommand = (data) => {
    return request({
        url: 'alarm/manage/operSafeReportCommander/allSysRoles',
        method: 'get',
        params: data
    })
}
// 自动告警--处置
export const sendAutoDisposal = (data) => {
    return request({
        url: 'alarm/manage/autoSafeReport/isAnalysis',
        method: 'post',
        data: data
    })
}
export const sendAutoDisposalCommand = (data) => {
    return request({
        url: 'alarm/manage/autoSafeReportCommander/isAnalysis',
        method: 'post',
        data: data
    })
}
export const getAutoUsers = (data) => {
    return request({
        url: 'alarm/manage/autoSafeReport/getAllUsers',
        method: 'post',
        data: data
    })
}
export const getAutoUsersCommand = (data) => {
    return request({
        url: 'alarm/manage/autoSafeReportCommander/getAllUsers',
        method: 'post',
        data: data
    })
}
// 分析任务---主页展示 管理人员
export const getAnalysisTask = (data) => {
    return request({
        url: 'alarm/manage/analysisTaskCommander/selectTask',
        method: 'post',
        data: data
    })
}
// 分析任务---追加建议 管理人员
export const appendAdvice = (data) => {
    return request({
        url: 'alarm/manage/analysisTaskCommander/appendProposal',
        method: 'post',
        data: data
    })
}
// 分析任务 --告警分析 管理人员
export const alarmAnalysis_data = (data) => {
    return request({
        url: 'alarm/manage/analysisTaskCommander/insertDispose',
        method: 'post',
        data: data
    })
}
// 分析任务--告警分析人员列表 管理人员
export const alarmAllUsers = (data) => {
    return request({
        url: 'alarm/manage/analysisTaskCommander/getAllUsers',
        method: 'post',
        data: data
    })
}

// 分析任务--周期报告预览 管理人员
export const previewReport = (data) => {
    return request({
        url: 'alarm/manage/analysisTaskCommander/periodicSummary',
        method: 'post',
        data: data
    })
}

// 分析任务---主页展示 普通用户
export const getAnalysisTask_1 = (data) => {
    return request({
        url: 'alarm/manage/analysisTask/selectTask',
        method: 'post',
        data: data
    })
}

// 分析任务 --告警分析 普通用户
export const alarmAnalysis_data_1 = (data) => {
    return request({
        url: 'alarm/manage/analysisTask/insertDispose',
        method: 'post',
        data: data
    })
}
// 分析任务--告警分析人员列表 普通用户
export const alarmAllUsers_1 = (data) => {
    return request({
        url: 'alarm/manage/analysisTask/getAllUsers',
        method: 'post',
        data: data
    })
}
// 分析任务--周期报告预览 普通用户
export const previewReport_1 = (data) => {
    return request({
        url: 'alarm/manage/analysisTask/periodicSummary',
        method: 'post',
        data: data
    })
}

// 分析任务--溯源
export const sendEventSource = (data) => {
    return request({
        url: 'alarm/terminal/isTrace',
        method: 'post',
        data: data
    })
}

// 追加建议
export const add_addvice = (data) => {
    return request({
        url: 'alarm/manage/operSafeReportCommander/appendProposal',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 溯源任务--主页展示 普通用户
export const getSourceTask = (data) => {
    return request({
        url: 'alarm/terminal/selectTask',
        method: 'post',
        data: data
    })
}

//

export const addReport_auto = (data) => {
    return request({
        url: 'alarm/manage/autoSafeReportCommander/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const ignore_auto = (data) => {
    return request({
        url: 'alarm/manage/autoSafeReportCommander/ignore',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const getAutoList_auto = (data) => {
    return request({
        url: 'alarm/manage/autoSafeReportCommander/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 攻击溯源------自动处置
export const autoReport_auto = (data) => {
    return request({
        url: 'alarm/manage/autoSafeReportCommander/deal',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const getChart_auto = (data) => {
    return request({
        url: 'alarm/manage/autoSafeReportCommander/chart',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const allAutoRoles_auto = (data) => {
    return request({
        url: 'alarm/manage/autoSafeReportCommander/allSysRoles',
        method: 'get',
        params: data
    })
}
export const add_auto_addvice = (data) => {
    return request({
        url: 'alarm/manage/autoSafeReportCommander/appendProposal',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 自动告警
export const auto_getLog = (data) => {
    return request({
        url: 'alarm/manage/autoSafeReport/getLog',
        method: 'post',
        data: data
    })
}
// 手动告警
export const manual_getLog = (data) => {
    return request({
        url: 'alarm/manage/operSafeReport/getLog',
        method: 'post',
        data: data
    })
}
// 手动告警--指挥人员
export const manual_getLogCommand = (data) => {
    return request({
        url: 'alarm/manage/operSafeReportCommander/getLog',
        method: 'post',
        data: data
    })
}
// 自动告警--指挥人员
export const auto_getLog_commander = (data) => {
    return request({
        url: 'alarm/manage/autoSafeReportCommander/getLog',
        method: 'post',
        data: data
    })
}
// 内网端口异动
export const get_net_port_list = (data) => {
    return request({
        url: 'alarm/manage/lanChange/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_net_port_detail = (data) => {
    return request({
        url: 'alarm/manage/lanChange/getCompanyAssetsByIp',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_net_port_history = (data) => {
    return request({
        url: 'alarm/manage/lanChange/getVisitHistory',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_net_port_table = (data) => {
    return request({
        url: 'alarm/manage/lanChange/getVisitHistoryPage',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 资产端口移动
export const get_assets_ip_list = (data) => {
    return request({
        url: 'alarm/manage/assetsChange/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const get_asset_port_history = (data) => {
    return request({
        url: 'alarm/manage/assetsChange/getVisitHistory',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_asset_port_table = (data) => {
    return request({
        url: 'alarm/manage/assetsChange/getVisitHistoryPage',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_logs_table = (data) => {
    return request({
        url: 'alarm/terminal/lyPage',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 安全日志信息
export const get_logs = (data) => {
    return request({
        url: 'alarm/terminal/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const sendAlarm = (data) => {
    return request({
        url: 'alarm/manage/attackshow/drools/saveOperSafeReport',
        method: 'post',
        data: data
    })
}
export const exportData = (data) => {
    return request({
        url: 'alarm/terminal/downLoadEsWaf',
        method: 'post',
        responseType: 'arraybuffer',
        params: data.queryData,
        data: data.paramsData
    })
}
// 网络流信息
export const get_warning_logs = (data) => {
    return request({
        url: 'alarm/terminal/lyPage',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const exportStreamData = (data) => {
    return request({
        url: 'alarm/terminal/downLoadEsLy',
        method: 'post',
        responseType: 'arraybuffer',
        params: data.queryData,
        data: data.paramsData
    })
}

// 查询相关告警
export const search_alarms = (data) => {
    return request({
        url: 'alarm/terminal/getESDataByIdAndTime',
        method: 'post',
        data: data
    })
}

// 溯源--溯源结果
export const sourceResult = (data) => {
    return request({
        url: 'alarm/terminal/traceEnd',
        method: 'post',
        data: data
    })
}
// 溯源--追加建议
export const addSourceResult = (data) => {
    return request({
        url: 'alarm/terminal/appendProposalTrace',
        method: 'post',
        data: data
    })
}

// 发起告警，ip查询资产

// ip映射
export const add_device = (data) => {
    console.log(data)
    return request({
        url: 'alarm/terminal/addIPMapper',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 获取映射列表
export const get_device = (data) => {
    return request({
        url: 'alarm/terminal/iPMapperpage',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 获取映射列表
export const edit_device = (data) => {
    return request({
        url: 'alarm/terminal/updateIPMapper',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const delete_device = (data) => {
    return request({
        url: 'alarm/terminal/delIPMapper',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 告警类型管理
export const get_alarm_type = (data) => {
    return request({
        url: 'alarm/manage/alarmType/find',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_alarm_type_log = (data) => {
    return request({
        url: 'alarm/terminal/findAlarmType',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const get_alarm_type_auto_commander = (data) => {
    return request({
        url: 'alarm/manage/autoSafeReportCommander/findAlarmType',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 受影响资产
export const get_affect_assets = (data) => {
    return request({
        url: 'alarm/terminal/findAssets',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 安全域
export const get_safetyZone = (data) => {
    return request({
        url: 'alarm/terminal/findSafetyZone',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 域名
export const get_domainName = (data) => {
    return request({
        url: 'alarm/terminal/findDomainName',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const save_header_list = (data) => {
    return request({
        url: 'alarm/manage/alarmList/updateHeader',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 告警类型--手动告警
export const get_alarm_type_manual = (data) => {
    return request({
        url: 'alarm/manage/operSafeReport/findAlarmType',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 告警类型--手动告警--管理人员
export const get_alarm_type_manualM = (data) => {
    return request({
        url: 'alarm/manage/operSafeReportCommander/findAlarmType',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 告警类型--分析任务
export const get_alarm_type_analysis = (data) => {
    return request({
        url: 'alarm/manage/analysisTask/findAlarmType',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 告警类型--分析任务--管理人员
export const get_alarm_type_analysisM = (data) => {
    return request({
        url: 'alarm/manage/analysisTaskCommander/findAlarmType',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 告警类型--溯源
export const get_alarm_type_source = (data) => {
    return request({
        url: 'alarm/terminal/findAlarmType',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 告警类型--规则
export const get_alarm_type_rule = (data) => {
    return request({
        url: 'alarm/manage/attackshow/drools/findAlarmType',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const save_alarm_type = (data) => {
    return request({
        url: 'alarm/manage/alarmType/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const update_alarm_type = (data) => {
    return request({
        url: 'alarm/manage/alarmType/update',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const delete_alarm_type = (data) => {
    return request({
        url: 'alarm/manage/alarmType/delete',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 规则类别管理
export const get_rule_type = (data) => {
    return request({
        url: 'alarm/manage/droolstype/find',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const save_rule_type = (data) => {
    return request({
        url: 'alarm/manage/droolstype/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const delete_rule_type = (data) => {
    return request({
        url: 'alarm/manage/droolstype/delete',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 提示音

// ip映射
export const add_voice = (data) => {
    console.log(data)
    return request({
        url: 'alarm/manage/warnSound/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 获取映射列表
export const get_voice = (data) => {
    return request({
        url: 'alarm/manage/warnSound/getAllWarnSound',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 获取映射列表
export const edit_voice = (data) => {
    return request({
        url: 'alarm/manage/warnSound/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const delete_voice = (data) => {
    return request({
        url: 'alarm/manage/warnSound/delete',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_voice_level = (data) => {
    return request({
        url: 'alarm/manage/warnSound/getLevel',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 攻击结果
export const get_attack_results = (data) => {
    return request({
        url: 'alarm/manage/attackresult/find',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const save_attack_results = (data) => {
    return request({
        url: 'alarm/manage/attackresult/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const delete_attack_results = (data) => {
    return request({
        url: 'alarm/manage/attackresult/delete',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 规则-获取攻击结果
export const get_rule_attack_result = (data) => {
    return request({
        url: 'alarm/manage/attackshow/drools/findAttackResult',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const delete_auto_alarm_commander = (data) => {
    return request({
        url: 'alarm/manage/autoSafeReportCommander/delReport',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 安全日志--所有人员
export const get_log_users = (data) => {
    return request({
        url: 'alarm/manage/attackshow/drools/getAllUsers',
        method: 'post',
        data: data
    })
}
// 溯源--获取通知人员
export const sourceMessageUsers = (data) => {
    return request({
        url: 'alarm/terminal/getAllUsers',
        method: 'post',
        data: data
    })
}

// 告警列表

export const getAlarmList = (data) => {
    return request({
        url: 'alarm/manage/alarmList/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 获取报送日志
export const getAlarmReportList = (data) => {
    return request({
        url: 'alarm/manage/alarmList/getGbAlarm',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 根据目的ip找对应资产
export const ip_searchAsset = (data) => {
    return request({
        url: 'alarm/manage/alarmList/getAssetsInfo',
        method: 'post',
        data: data
    })
}
// 获取头部显示字段接口
export const get_header_list = (data) => {
    return request({
        url: 'alarm/manage/alarmList/findHeader',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 告警类型
export const get_alarm_type_auto = (data) => {
    return request({
        url: 'alarm/manage/alarmList/getAlarmType',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 告警删除
export const delete_auto_alarm = (data) => {
    return request({
        url: 'alarm/manage/alarmList/delete',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const addReport = (data) => {
    return request({
        url: 'alarm/manage/alarmList/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const updateReport = (data) => {
    return request({
        url: 'alarm/manage/alarmList/update',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const changeAlarmState = (data) => {
    return request({
        url: 'alarm/manage/alarmList/changeStatus',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const getChart = (data) => {
    return request({
        url: 'alarm/manage/alarmList/chart',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const getAlarmTemp = (data) => {
    return request({
        url: 'alarm/manage/alarmList/getWorkMould',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const add_workTask = (data) => {
    return request({
        url: 'alarm/manage/alarmList/createOrder',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
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
export const get_workFlowInfo = (data) => {
    return request({
        url: 'alarm/manage/alarmList/getOrderInfo',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_ElementInfo = (data) => {
    return request({
        url: 'alarm/manage/alarmList/getNodeInfo',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_getLogIndex = (data) => {
    return request({
        url: 'alarm/manage/alarmList/getAllDT',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
/* 规则*/
export const get_rule_detail = (data) => {
    return request({
        url: 'alarm/manage/alarmList/getRuleInfo',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const getSearchData = (data) => {
    return request({
        url: 'alarm/manage/alarmList/getFilter',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const delSearchData = (data) => {
    return request({
        url: 'alarm/manage/alarmList/deleteFilter',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const saveSearchTask = (data) => {
    return request({
        url: 'alarm/manage/alarmList/saveFilter',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const getSearchResultData = (data) => {
    return request({
        url: 'alarm/manage/alarmList/getAttackResult',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const getSearchRulesData = (data) => {
    return request({
        url: 'alarm/manage/alarmList/getAllRule',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 刷新时间-添加时间
export const saveLogTime = (data) => {
    return request({
        url: 'alarm/manage/alarmTime/saveLogTime',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 刷新时间-获取时间
export const getLogTime = (data) => {
    return request({
        url: 'alarm/manage/alarmTime/getLogTime',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 刷新时间-删除时间
export const deleteLogTime = (data) => {
    return request({
        url: 'alarm/manage/alarmTime/deleteLogTime',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 发起告警-获取告警类型
export const getAlarmType = (data) => {
    return request({
        url: 'alarm/manage/alarmList/getAlarmType',
        method: 'post',
        data: data
    })
}

// 发起告警-获取工单模板
export const getAlarmWorkMould = (data) => {
    return request({
        url: 'alarm/manage/alarmList/getAlarmWorkMould',
        method: 'post',
        data: data
    })
}

// 导出内容
export const download = (data) => {
    return request({
        url: 'alarm/manage/alarmList/export',
        method: 'post',
        params: data.queryData,
        data: data.paramsData,
        // timeout: timeoutData,
        responseType: 'blob'
    })
}

export const getMenace = (data) => {
    return request({
        url: 'alarm/manage/alarmList/getMenace',
        method: 'get',
        params: data.queryData
    })
}

// 公共-获取ATT CK数据 下拉
export const getAttCk = (data) => {
    return request({
        url: 'alarm/manage/common/getAttCk',
        method: 'post',
        data: data
    })
}

// 公共-获取攻击链分析数据 下拉
export const getAttChain = (data) => {
    return request({
        url: 'alarm/manage/common/getAttChain',
        method: 'post',
        data: data
    })
}

// 公共-概览组织树
export const getTreeOrg = (data) => {
    return request({
        url: 'alarm/manage/common/getOrg',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const getAttCkChart = (data) => {
    return request({
        url: 'alarm/manage/alarmList/getAttCkChart',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const getAttCkTotal = (data) => {
    return request({
        url: 'alarm/manage/alarmList/getAttCkTotal',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const getAttChainNum = (data) => {
    return request({
        url: 'alarm/manage/alarmList/getAttChainNum',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const getAttChainChart = (data) => {
    return request({
        url: 'alarm/manage/alarmList/getAttChainChart',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const acquireAttackChain = (data) => {
    return request({
        url: 'alarm/manage/alarmList/acquireAttackChain',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const editWireEdge = (data) => {
    return request({
        url: 'alarm/manage/alarmList/editWireEdge',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const nextAttackChain = (data) => {
    return request({
        url: 'alarm/manage/alarmList/nextAttackChain',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const addNodeAttackChain = (data) => {
    return request({
        url: 'alarm/manage/alarmList/addNodeAttackChain',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const deleteNodeAttackChain = (data) => {
    return request({
        url: 'alarm/manage/alarmList/deleteNodeAttackChain',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const getSortFieldAlarm = (data) => {
    return request({
        url: 'alarm/manage/alarmChartSet/getSortField',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 表格提交
export const getTablealarmChartSet = (data) => {
    return request({
        url: 'alarm/manage/alarmChartSet/getTableChart',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 柱状图提交
export const getBaralarmChartSet = (data) => {
    return request({
        url: 'alarm/manage/alarmChartSet/getBarChart',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 折线图提交
export const getLinealarmChartSet = (data) => {
    return request({
        url: 'alarm/manage/alarmChartSet/getLineChart',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 面积图提交
export const getAreaalarmChartSet = (data) => {
    return request({
        url: 'alarm/manage/alarmChartSet/getAreaChart',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 饼图提交
export const getPiealarmChartSet = (data) => {
    return request({
        url: 'alarm/manage/alarmChartSet/getPieChart',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 指标提交
export const getTaralarmChartSet = (data) => {
    return request({
        url: 'alarm/manage/alarmChartSet/getTarChart',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 保存成图表
export const saveToalarmChart = (data) => {
    return request({
        url: 'alarm/manage/alarmChartSet/saveToChart',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 获取组
export const findSearchTypealarmChart = (data) => {
    return request({
        url: 'alarm/manage/alarmChartSet/findSearchType',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 获取field对应的中文
export const getEnumInfoalarm = (data) => {
    return request({
        url: 'alarm/manage/alarmChartSet/getEnumInfo',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 资产概览组织最大级别
export const getOrgLevel = (data) => {
    console.log(data)
    return request({
        url: 'alarm/manage/alarmList/getOrgLevel',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// chart图请求接口
export const reqChart = (data) => {
    return request({
        url: 'alarm/manage/firebreak/userViewDetailChart',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
