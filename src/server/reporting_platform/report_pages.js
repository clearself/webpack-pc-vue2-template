import request from '@/utils/server'

// 自定仪表头查询
export const headerFindReq = (data) => {
    return request({
        url: 'data-report/manage/configcommondata/header/find',
        method: 'get',
        params: data.queryData,
        data: data.paramsData
    })
}

// 自定仪表头保存
export const headerSaveReq = (data) => {
    return request({
        url: 'data-report/terminal/header/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 级联字典查询
export const dictQueryReq = (data) => {
    return request({
        url: 'data-report/manage/configcommondata/getAllData',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 外部网络攻击列表
export const externalNetworkPageReq = (data) => {
    return request({
        url: 'data-report/manage/externalnetworkattack/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 外部网络攻击列表_上报结果
export const externalNetworkResPageReq = (data) => {
    return request({
        url: 'data-report/manage/externalnetworkattack/resultPage',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 外部网络攻击保存
export const externalNetworkSaveReq = (data) => {
    return request({
        url: 'data-report/manage/externalnetworkattack/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 外部网络攻击删除
export const externalNetworkDelReq = (data) => {
    return request({
        url: 'data-report/manage/externalnetworkattack/delete',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 外部网络攻击审核
export const externalNetworkAudReq = (data) => {
    return request({
        url: 'data-report/manage/externalnetworkattack/audit',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 外部网络攻击导出
export const externalNetworkExpReq = (data) => {
    return request({
        url: 'data-report/manage/externalnetworkattack/export',
        method: 'post',
        params: data.queryData,
        data: data.paramsData,
        responseType: 'blob'
    })
}

// 外部网络攻击上报
export const externalNetworkRepReq = (data) => {
    return request({
        url: 'data-report/manage/externalnetworkattack/send',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 内部网络攻击列表
export const internalNetworkPageReq = (data) => {
    return request({
        url: 'data-report/manage/internalnetworkattack/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 内部网络攻击列表_上报结果
export const internalNetworkResPageReq = (data) => {
    return request({
        url: 'data-report/manage/internalnetworkattack/resultPage',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 内部网络攻击保存
export const internalNetworkSaveReq = (data) => {
    return request({
        url: 'data-report/manage/internalnetworkattack/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 内部网络攻击删除
export const internalNetworkDelReq = (data) => {
    return request({
        url: 'data-report/manage/internalnetworkattack/delete',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 内部网络攻击审核
export const internalNetworkAudReq = (data) => {
    return request({
        url: 'data-report/manage/internalnetworkattack/audit',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 内部网络攻击导出
export const internalNetworkExpReq = (data) => {
    return request({
        url: 'data-report/manage/internalnetworkattack/export',
        method: 'post',
        params: data.queryData,
        data: data.paramsData,
        responseType: 'blob'
    })
}

// 内部网络攻击上报
export const internalNetworkRepReq = (data) => {
    return request({
        url: 'data-report/manage/internalnetworkattack/send',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 证联网接入区安全告警数据列表
export const certificateNetworkPageReq = (data) => {
    return request({
        url: 'data-report/manage/networkaccesszonealarm/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 证联网接入区安全告警数据列表_上报结果
export const certificateNetworkResPageReq = (data) => {
    return request({
        url: 'data-report/manage/networkaccesszonealarm/resultPage',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 证联网接入区安全告警数据保存
export const certificateNetworkSaveReq = (data) => {
    return request({
        url: 'data-report/manage/networkaccesszonealarm/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 证联网接入区安全告警数据删除
export const certificateNetworkDelReq = (data) => {
    return request({
        url: 'data-report/manage/networkaccesszonealarm/delete',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 证联网接入区安全告警数据审核
export const certificateNetworkAudReq = (data) => {
    return request({
        url: 'data-report/manage/networkaccesszonealarm/audit',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 证联网接入区安全告警数据导出
export const certificateNetworkExpReq = (data) => {
    return request({
        url: 'data-report/manage/networkaccesszonealarm/export',
        method: 'post',
        params: data.queryData,
        data: data.paramsData,
        responseType: 'blob'
    })
}

// 证联网接入区安全告警数据上报
export const certificateNetworkRepReq = (data) => {
    return request({
        url: 'data-report/manage/networkaccesszonealarm/send',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 异常外连数据列表
export const abnormalOutreachPageReq = (data) => {
    return request({
        url: 'data-report/manage/abnormalexternalconnection/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 异常外连数据列表_上报结果
export const abnormalOutreachResPageReq = (data) => {
    return request({
        url: 'data-report/manage/abnormalexternalconnection/resultPage',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 异常外连数据保存
export const abnormalOutreachSaveReq = (data) => {
    return request({
        url: 'data-report/manage/abnormalexternalconnection/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 异常外连数据删除
export const abnormalOutreachDelReq = (data) => {
    return request({
        url: 'data-report/manage/abnormalexternalconnection/delete',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 异常外连数据审核
export const abnormalOutreachAudReq = (data) => {
    return request({
        url: 'data-report/manage/abnormalexternalconnection/audit',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 异常外连数据导出
export const abnormalOutreachExpReq = (data) => {
    return request({
        url: 'data-report/manage/abnormalexternalconnection/export',
        method: 'post',
        params: data.queryData,
        data: data.paramsData,
        responseType: 'blob'
    })
}

// 异常外连数据上报
export const abnormalOutreachRepReq = (data) => {
    return request({
        url: 'data-report/manage/abnormalexternalconnection/send',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// ddos攻击列表
export const ddocPageReq = (data) => {
    return request({
        url: 'data-report/manage/ddosattack/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const ddocResPageReq = (data) => {
    return request({
        url: 'data-report/manage/ddosattack/resultPage',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// ddos攻击保存
export const ddocSaveReq = (data) => {
    return request({
        url: 'data-report/manage/ddosattack/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// ddos攻击删除
export const ddocDelReq = (data) => {
    return request({
        url: 'data-report/manage/ddosattack/delete',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// ddos攻击审核
export const ddocAudReq = (data) => {
    return request({
        url: 'data-report/manage/ddosattack/audit',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// ddos攻击导出
export const ddocExpReq = (data) => {
    return request({
        url: 'data-report/manage/ddosattack/export',
        method: 'post',
        params: data.queryData,
        data: data.paramsData,
        responseType: 'blob'
    })
}

// ddos攻击上报
export const ddocRepReq = (data) => {
    return request({
        url: 'data-report/manage/ddosattack/send',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 恶意代码感染列表
export const maliciousCodePageReq = (data) => {
    return request({
        url: 'data-report/manage/maliciouscodeinfection/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const maliciousCodeResPageReq = (data) => {
    return request({
        url: 'data-report/manage/maliciouscodeinfection/resultPage',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 恶意代码感染保存
export const maliciousCodeSaveReq = (data) => {
    return request({
        url: 'data-report/manage/maliciouscodeinfection/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 恶意代码感染删除
export const maliciousCodeDelReq = (data) => {
    return request({
        url: 'data-report/manage/maliciouscodeinfection/delete',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 恶意代码感染审核
export const maliciousCodeAudReq = (data) => {
    return request({
        url: 'data-report/manage/maliciouscodeinfection/audit',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 恶意代码感染导出
export const maliciousCodeExpReq = (data) => {
    return request({
        url: 'data-report/manage/maliciouscodeinfection/export',
        method: 'post',
        params: data.queryData,
        data: data.paramsData,
        responseType: 'blob'
    })
}

// 恶意代码感染上报
export const maliciousCodeRepReq = (data) => {
    return request({
        url: 'data-report/manage/maliciouscodeinfection/send',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 恶意邮件列表
export const maliciousMailPageReq = (data) => {
    return request({
        url: 'data-report/manage/maliciousMail/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const maliciousMailResPageReq = (data) => {
    return request({
        url: 'data-report/manage/maliciousMail/resultPage',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 恶意邮件保存
export const maliciousMailSaveReq = (data) => {
    return request({
        url: 'data-report/manage/maliciousMail/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 恶意邮件删除
export const maliciousMailDelReq = (data) => {
    return request({
        url: 'data-report/manage/maliciousMail/delete',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 恶意邮件审核
export const maliciousMailAudReq = (data) => {
    return request({
        url: 'data-report/manage/maliciousMail/audit',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 恶意邮件导出
export const maliciousMailExpReq = (data) => {
    return request({
        url: 'data-report/manage/maliciousMail/export',
        method: 'post',
        params: data.queryData,
        data: data.paramsData,
        responseType: 'blob'
    })
}

// 恶意邮件上报
export const maliciousMailRepReq = (data) => {
    return request({
        url: 'data-report/manage/maliciousMail/send',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 仿冒/钓鱼网站列表
export const fakePhiWebPageReq = (data) => {
    return request({
        url: 'data-report/manage/fakePhishingWebsite/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const fakePhiWebResPageReq = (data) => {
    return request({
        url: 'data-report/manage/fakePhishingWebsite/resultPage',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 仿冒/钓鱼网站保存
export const fakePhiWebSaveReq = (data) => {
    return request({
        url: 'data-report/manage/fakePhishingWebsite/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 仿冒/钓鱼网站删除
export const fakePhiWebDelReq = (data) => {
    return request({
        url: 'data-report/manage/fakePhishingWebsite/delete',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 仿冒/钓鱼网站审核
export const fakePhiWebAudReq = (data) => {
    return request({
        url: 'data-report/manage/fakePhishingWebsite/audit',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 仿冒/钓鱼网站导出
export const fakePhiWebExpReq = (data) => {
    return request({
        url: 'data-report/manage/fakePhishingWebsite/export',
        method: 'post',
        params: data.queryData,
        data: data.paramsData,
        responseType: 'blob'
    })
}

// 仿冒/钓鱼网站上报
export const fakePhiWebRepReq = (data) => {
    return request({
        url: 'data-report/manage/fakePhishingWebsite/send',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 仿冒APP列表
export const fakeAppPageReq = (data) => {
    return request({
        url: 'data-report/manage/fakeApp/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const fakeAppResPageReq = (data) => {
    return request({
        url: 'data-report/manage/fakeApp/resultPage',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 仿冒APP保存
export const fakeAppSaveReq = (data) => {
    return request({
        url: 'data-report/manage/fakeApp/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 仿冒APP删除
export const fakeAppDelReq = (data) => {
    return request({
        url: 'data-report/manage/fakeApp/delete',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 仿冒APP审核
export const fakeAppAudReq = (data) => {
    return request({
        url: 'data-report/manage/fakeApp/audit',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 仿冒APP导出
export const fakeAppExpReq = (data) => {
    return request({
        url: 'data-report/manage/fakeApp/export',
        method: 'post',
        params: data.queryData,
        data: data.paramsData,
        responseType: 'blob'
    })
}

// 仿冒APP上报
export const fakeAppRepReq = (data) => {
    return request({
        url: 'data-report/manage/fakeApp/send',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 网站篡改列表
export const webTamPageReq = (data) => {
    return request({
        url: 'data-report/manage/websiteTampering/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const webTamResPageReq = (data) => {
    return request({
        url: 'data-report/manage/websiteTampering/resultPage',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

//  网站篡改保存
export const webTamSaveReq = (data) => {
    return request({
        url: 'data-report/manage/websiteTampering/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

//  网站篡改删除
export const webTamDelReq = (data) => {
    return request({
        url: 'data-report/manage/fakePhishingWebsite/delete',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 网站篡改审核
export const webTamAudReq = (data) => {
    return request({
        url: 'data-report/manage/websiteTampering/audit',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 网站篡改导出
export const webTamExpReq = (data) => {
    return request({
        url: 'data-report/manage/websiteTampering/export',
        method: 'post',
        params: data.queryData,
        data: data.paramsData,
        responseType: 'blob'
    })
}

// 网站篡改上报
export const webTamRepReq = (data) => {
    return request({
        url: 'data-report/manage/websiteTampering/send',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 上报统计校验列表
export const staVerPageReq = (data) => {
    return request({
        url: 'data-report/manage/statisticalVerification/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const staVerResPageReq = (data) => {
    return request({
        url: 'data-report/manage/statisticalVerification/resultPage',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 上报统计校验保存
export const staVerSaveReq = (data) => {
    return request({
        url: 'data-report/manage/statisticalVerification/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 上报统计校验删除
export const staVerDelReq = (data) => {
    return request({
        url: 'data-report/manage/statisticalVerification/delete',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 上报统计校验审核
export const staVerAudReq = (data) => {
    return request({
        url: 'data-report/manage/statisticalVerification/audit',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 上报统计校验导出
export const staVerExpReq = (data) => {
    return request({
        url: 'data-report/manage/statisticalVerification/export',
        method: 'post',
        params: data.queryData,
        data: data.paramsData,
        responseType: 'blob'
    })
}

// 上报统计校验上报
export const staVerRepReq = (data) => {
    return request({
        url: 'data-report/manage/statisticalVerification/send',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 下载导入模板
export const downloadTemReq = (url) => {
    return request({
        url,
        method: 'get',
        params: {},
        data: {},
        responseType: 'blob'
    })
}
