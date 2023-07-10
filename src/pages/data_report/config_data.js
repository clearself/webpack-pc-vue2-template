// 机构代码数据源
export const institutionCodeOpt = [
    { label: '机构1', value: '110' },
    { label: '机构2', value: '111' }
]
// 本地外连设备类型数据源
export const options_blocked = [
    { label: '否', value: '0' },
    { label: '是', value: '1' }
]
// 异常外连类型数据源
export const options_deviceType = [
    { label: '终端', value: '01' },
    { label: '服务器', value: '02' },
    { label: '其他', value: '99' }
]
// 连接情况数据源
export const external_type_data = [
    { label: '访问恶意链接', value: 'F03-01' },
    { label: '恶意程序下载', value: 'F03-02' },
    { label: '外发攻击', value: 'F03-03' },
    { label: '数据外传', value: 'F03-04' },
    { label: '其他', value: 'F03-99' }
]
// 连接情况数据源
export const connect_condition_data = [
    { label: '尝试连接', value: '1' },
    { label: '成功建立连接', value: '2' }
]
// 外联区域数据源
export const area_data = [
    { label: '互联网边界', value: '01' },
    { label: '证联网边界', value: '02' }
]
//  哈希算法
export const hash_name_data = [
    { label: 'MD5算法', value: '01' },
    { label: 'SHA-1算法', value: '02' },
    { label: 'SHA-256算法', value: '03' },
    { label: 'SM3算法', value: '04' },
    { label: '其他算法', value: '99' }
]
//  恶意代码类型
export const virus_type_data = [
    { label: '蠕虫', value: 'F02-01' },
    { label: '木马', value: 'F02-02' },
    { label: '僵尸网络', value: 'F02-03' },
    { label: '病毒', value: 'F02-04' },
    { label: '勒索', value: 'F02-05' },
    { label: '挖矿', value: 'F02-06' },
    { label: '其他', value: 'F02-99' }
]
//   处置动作
export const action_data = [
    { label: '已查杀/隔离', value: '1' },
    { label: '未处置', value: '2' }
]
// 涉及交易情况
export const trade_condition = [
    { label: '不涉及交易', value: '0' },
    { label: '涉及交易', value: '1' }
]
// 篡改类型数据源
export const tamper = [
    { label: '网页涂鸦', value: '01' },
    { label: '暗链植入', value: '02' },
    { label: '数据改写', value: '03' },
    { label: '文件改写', value: '04' },
    { label: '其他', value: '99' }
]
// 篡改意图类型数据源
export const tamper_intention = [
    { label: '政治宣传', value: '01' },
    { label: '涉黄', value: '02' },
    { label: '赌博、诈骗', value: '03' },
    { label: '引流', value: '04' },
    { label: '其他', value: '99' }
]
// 时间日期字段条件数据源
export const options_time = [
    { label: '等于', value: '3' },
    { label: '小于', value: '6' },
    { label: '大于', value: '5' },
    { label: '自定义', value: '11' }
]
// 攻击流量字段条件数据源
export const options_attackTraffic = [
    { label: '等于', value: '3' },
    { label: '不等于', value: '4' },
    { label: '大于', value: '5' },
    { label: '小于', value: '6' }
]
// 其他字段条件数据源
export const options_other = [
    { label: '大于', value: '5' },
    { label: '小于', value: '6' },
    { label: '大于等于', value: '7' },
    { label: '小于等于', value: '8' },
    { label: '等于', value: '3' },
    { label: '不等于', value: '4' },
    { label: '包含', value: '1' },
    { label: '不包含', value: '2' },
    { label: '为空', value: '9' },
    { label: '不为空', value: '10' }
]

export const opt_string = [
    { label: '等于', value: '3' },
    { label: '不等于', value: '4' },
    { label: '包含', value: '1' },
    { label: '不包含', value: '2' },
    { label: '为空', value: '9' },
    { label: '不为空', value: '10' }
]
// 其他字段条件数据源
export const options_others = [
    { label: '大于', value: '5' },
    { label: '小于', value: '6' },
    { label: '大于等于', value: '7' },
    { label: '小于等于', value: '8' },
    { label: '等于', value: '3' }
]

// ip字段
export const options_ips = [
    { label: '存在于', value: '12' },
    { label: '不存在于', value: '13' }
]
// 所有条件数据源

export const allCondition = {
    1: '包含',
    2: '不包含',
    3: '等于',
    4: '不等于',
    5: '大于',
    6: '小于',
    7: '大于等于',
    8: '小于等于',
    9: '为空',
    10: '不为空',
    11: '自定义'
}
// 所有下拉选字段
export const selectData = [
    'external_area', // 外部网络区域
    'destination_system_type', // 被攻击系统类型
    'attack_type', // 攻击类型
    'is_blocked', // 是否封禁/阻断
    'data_type', // 报送数据类型
    'area', // 外联区域
    'external_type', // 异常外连类型
    'local_device_type', // 本地外连设备类型
    'local_system_type', // 本地外连系统类型
    'connect_condition', //  连接情况
    'external_type', // 异常外连类型
    'external_type', // 异常外连类型
    'external_type', // 异常外连类型
    'external_type', // 异常外连类型
    'institution_branch_area', // 风险发生地区
    'device_type', // 感染设备类型
    'system_type', // 感染系统类型
    'hash_name', //  哈希算法
    'virus_type', //  恶意代码类型
    'action', //   处置动作
    'befaked_url_type', // 被仿冒网站业务类型
    'trade_condition' // 涉及交易情况
]
// 时间类型的字段
export const timeData = ['time', 'end_time']

// 事件数据
export const event_data = [
    { label: '外部网络攻击', value: 'externalnetworkattack', type: 1, code: 'S01' },
    { label: '内部网络攻击', value: 'internalnetworkattack', type: 2, code: 'S02' },
    { label: '证联网接入区安全告警', value: 'networkaccesszonealarm', type: 3, code: 'S03' },
    { label: '异常外连', value: 'abnormalexternalconnection', type: 4, code: 'S04' },
    { label: 'DDOS攻击', value: 'ddosattack', type: 5, code: 'S05' },
    { label: '恶意代码感染', value: 'maliciouscodeinfection', type: 6, code: 'S06' },
    { label: '恶意邮件', value: 'maliciousmail', type: 7, code: 'S07' },
    { label: '仿冒/钓鱼网站', value: 'fakephishingwebsite', type: 8, code: 'S08' },
    { label: '仿冒APP', value: 'fakeapp', type: 9, code: 'S09' },
    { label: '网站篡改', value: 'websitetampering', type: 10, code: 'S10' },
    { label: '上报统计校验', value: 'statisticalverification', type: 11, code: 'S11' }
]

