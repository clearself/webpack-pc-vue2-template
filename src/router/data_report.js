// 上报配置
const Layout = () => import('@/layout')
const report_config = () =>
    import('@/pages/data_report/report_config/index.vue')
// 数据源
const data_source = () =>
    import('@/pages/data_report/report_config/data_source.vue')
// 字段映射
const field_mapping = () =>
    import('@/pages/data_report/report_config/field_mapping.vue')
// 报送数据类型
const data_type = () =>
    import('@/pages/data_report/report_config/data_type.vue')
// 攻击类型
const attack_type = () =>
    import('@/pages/data_report/report_config/attack_type.vue')
// 设备类型
const equipment_type = () =>
    import('@/pages/data_report/report_config/equipment_type.vue')
// 外部网络区域
const network_area = () =>
    import('@/pages/data_report/report_config/network_area.vue')
// 信息系统
const information_system = () =>
    import('@/pages/data_report/report_config/information_system.vue')
// 分支机构
const branch_office = () =>
    import('@/pages/data_report/report_config/branch_office.vue')
// DDOS流量单位
const flow_set = () =>
    import('@/pages/data_report/report_config/flow_set.vue')
// 过滤器
const filter_config = () =>
    import('@/pages/data_report/report_config/filter_config.vue')
// 上报方式
const reporting_mode = () =>
    import('@/pages/data_report/report_config/reporting_mode.vue')
// 机构信息
const organization_information = () =>
    import('@/pages/data_report/report_config/organization_information.vue')
// 邮件提醒
const email_set = () =>
    import('@/pages/data_report/report_config/email_set.vue')

// 待上报模块
const report = () =>
    import('@/pages/data_report/report.vue')
const externalNetwork = () =>
    import('@/pages/data_report/report_pages/externalNetwork.vue')

// 上报结果
const report_fail = () =>
    import('@/pages/data_report/report_fail.vue')
const externalNetwork_fail = () =>
    import('@/pages/data_report/report_fail/externalNetwork.vue')

const statistic = () =>
    import('@/pages/data_report/statistic/index.vue')
export default [

    {
        path: '/data_report',
        name: 'data_report',
        component: Layout,
        meta: {
            title: '数据报送'
        },
        redirect: '/data_report/report_pages',
        children: [
            {
                path: 'statistic',
                name: 'statistic',
                component: statistic,
                meta: {
                    title: '数据报送'
                }
            },
            {
                path: 'report_pages',
                name: 'report_pages',
                component: report,
                redirect: '/data_report/report_pages/externalNetwork',
                meta: {
                    title: '待上报数据'
                },
                children: [
                    {
                        path: 'externalNetwork',
                        name: 'externalNetwork',
                        component: externalNetwork,
                        meta: {
                            title: '外部网络攻击数据',
                            guidePath: true,
                            jumpPath: '/data_report/report_pages'
                        }
                    },
                    {
                        path: 'internalNetwork',
                        name: 'internalNetwork',
                        component: externalNetwork,
                        meta: {
                            title: '内部网络攻击数据',
                            guidePath: true,
                            jumpPath: '/data_report/report_pages'
                        }
                    },
                    {
                        path: 'certificateNetwork',
                        name: 'certificateNetwork',
                        component: externalNetwork,
                        meta: {
                            title: '证联网接入区安全告警数据',
                            guidePath: true,
                            jumpPath: '/data_report/report_pages'
                        }
                    },
                    {
                        path: 'abnormalOutreach',
                        name: 'abnormalOutreach',
                        component: externalNetwork,
                        meta: {
                            title: '异常外联数据',
                            guidePath: true,
                            jumpPath: '/data_report/report_pages'
                        }
                    },
                    {
                        path: 'ddoc',
                        name: 'ddoc',
                        component: externalNetwork,
                        meta: {
                            title: 'DDOS攻击数据',
                            guidePath: true,
                            jumpPath: '/data_report/report_pages'
                        }
                    },
                    {
                        path: 'maliciousCode',
                        name: 'maliciousCode',
                        component: externalNetwork,
                        meta: {
                            title: '恶意代码感染数据',
                            guidePath: true,
                            jumpPath: '/data_report/report_pages'
                        }
                    },
                    {
                        path: 'maliciousMail',
                        name: 'maliciousMail',
                        component: externalNetwork,
                        meta: {
                            title: '恶意邮件数据',
                            guidePath: true,
                            jumpPath: '/data_report/report_pages'
                        }
                    },
                    {
                        path: 'phishingWebsite',
                        name: 'phishingWebsite',
                        component: externalNetwork,
                        meta: {
                            title: '仿冒/钓鱼网站数据',
                            guidePath: true,
                            jumpPath: '/data_report/report_pages'
                        }
                    },
                    {
                        path: 'fakeApp',
                        name: 'fakeApp',
                        component: externalNetwork,
                        meta: {
                            title: '仿冒App数据',
                            guidePath: true,
                            jumpPath: '/data_report/report_pages'
                        }
                    },
                    {
                        path: 'websiteTampering',
                        name: 'websiteTampering',
                        component: externalNetwork,
                        meta: {
                            title: '网站篡改数据',
                            guidePath: true,
                            jumpPath: '/data_report/report_pages'
                        }
                    },
                    {
                        path: 'reportStatistics',
                        name: 'reportStatistics',
                        component: externalNetwork,
                        meta: {
                            title: '上报统计校验数据',
                            guidePath: true,
                            jumpPath: '/data_report/report_pages'
                        }
                    }]
            },
            {
                path: 'report_fail',
                name: 'report_fail',
                component: report_fail,
                redirect: '/data_report/report_fail/externalNetwork',
                meta: {
                    title: '上报结果'
                },
                children: [
                    {
                        path: 'externalNetwork',
                        name: 'externalNetwork_fail',
                        component: externalNetwork_fail,
                        meta: {
                            title: '外部网络攻击数据',
                            guidePath: true,
                            jumpPath: '/data_report/report_fail'
                        }
                    },
                    {
                        path: 'internalNetwork',
                        name: 'internalNetwork_fail',
                        component: externalNetwork_fail,
                        meta: {
                            title: '内部网络攻击数据',
                            guidePath: true,
                            jumpPath: '/data_report/report_fail'
                        }
                    },
                    {
                        path: 'certificateNetwork',
                        name: 'certificateNetwork_fail',
                        component: externalNetwork_fail,
                        meta: {
                            title: '证联网接入区安全告警数据',
                            guidePath: true,
                            jumpPath: '/data_report/report_fail'
                        }
                    },
                    {
                        path: 'abnormalOutreach',
                        name: 'abnormalOutreach_fail',
                        component: externalNetwork_fail,
                        meta: {
                            title: '异常外联数据',
                            guidePath: true,
                            jumpPath: '/data_report/report_fail'
                        }
                    },
                    {
                        path: 'ddoc',
                        name: 'ddoc_fail',
                        component: externalNetwork_fail,
                        meta: {
                            title: 'DDOS攻击数据',
                            guidePath: true,
                            jumpPath: '/data_report/report_fail'
                        }
                    },
                    {
                        path: 'maliciousCode',
                        name: 'maliciousCode_fail',
                        component: externalNetwork_fail,
                        meta: {
                            title: '恶意代码感染数据',
                            guidePath: true,
                            jumpPath: '/data_report/report_fail'
                        }
                    },
                    {
                        path: 'maliciousMail',
                        name: 'maliciousMail_fail',
                        component: externalNetwork_fail,
                        meta: {
                            title: '恶意邮件数据',
                            guidePath: true,
                            jumpPath: '/data_report/report_fail'
                        }
                    },
                    {
                        path: 'phishingWebsite',
                        name: 'phishingWebsite_fail',
                        component: externalNetwork_fail,
                        meta: {
                            title: '仿冒/钓鱼网站数据',
                            guidePath: true,
                            jumpPath: '/data_report/report_fail'
                        }
                    },
                    {
                        path: 'fakeApp',
                        name: 'fakeApp_fail',
                        component: externalNetwork_fail,
                        meta: {
                            title: '仿冒App数据',
                            guidePath: true,
                            jumpPath: '/data_report/report_fail'
                        }
                    },
                    {
                        path: 'websiteTampering',
                        name: 'websiteTampering_fail',
                        component: externalNetwork_fail,
                        meta: {
                            title: '网站篡改数据',
                            guidePath: true,
                            jumpPath: '/data_report/report_fail'
                        }
                    },
                    {
                        path: 'reportStatistics',
                        name: 'reportStatistics_fail',
                        component: externalNetwork_fail,
                        meta: {
                            title: '上报统计校验数据',
                            guidePath: true,
                            jumpPath: '/data_report/report_fail'
                        }
                    }]
            },
            {
                path: 'report_config',
                name: 'report_config',
                component: report_config,
                redirect: '/data_report/report_config/report_data_source',
                meta: {
                    title: '上报配置'
                },
                children: [
                    {
                        path: 'report_data_source',
                        name: 'report_data_source',
                        component: data_source,
                        meta: {
                            title: '数据源',
                            guidePath: true,
                            jumpPath: '/data_report/report_config'
                        }
                    },
                    {
                        path: 'report_field_mapping',
                        name: 'report_field_mapping',
                        component: field_mapping,
                        meta: {
                            title: '字段映射',
                            guidePath: true,
                            jumpPath: '/data_report/report_config'
                        }
                    },
                    {
                        path: 'report_data_type',
                        name: 'report_data_type',
                        component: data_type,
                        meta: {
                            title: '报送数据类型',
                            guidePath: true,
                            jumpPath: '/data_report/report_config'
                        }
                    },
                    {
                        path: 'report_attack_type',
                        name: 'report_attack_type',
                        component: attack_type,
                        meta: {
                            title: '攻击类型',
                            guidePath: true,
                            jumpPath: '/data_report/report_config'
                        }
                    },
                    {
                        path: 'report_equipment_type',
                        name: 'report_equipment_type',
                        component: equipment_type,
                        meta: {
                            title: '设备类型',
                            guidePath: true,
                            jumpPath: '/data_report/report_config'
                        }
                    },
                    {
                        path: 'report_network_area',
                        name: 'report_network_area',
                        component: network_area,
                        meta: {
                            title: '外部网络区域',
                            guidePath: true,
                            jumpPath: '/data_report/report_config'
                        }
                    },
                    {
                        path: 'report_information_system',
                        name: 'report_information_system',
                        component: information_system,
                        meta: {
                            title: '信息系统',
                            guidePath: true,
                            jumpPath: '/data_report/report_config'
                        }
                    },
                    {
                        path: 'report_branch_office',
                        name: 'report_branch_office',
                        component: branch_office,
                        meta: {
                            title: '分支机构',
                            guidePath: true,
                            jumpPath: '/data_report/report_config'
                        }
                    },
                    {
                        path: 'report_flow_set',
                        name: 'report_flow_set',
                        component: flow_set,
                        meta: {
                            title: 'DDOS流量单位',
                            guidePath: true,
                            jumpPath: '/data_report/report_config'
                        }
                    },
                    {
                        path: 'report_filter_config',
                        name: 'report_filter_config',
                        component: filter_config,
                        meta: {
                            title: '过滤器',
                            guidePath: true,
                            jumpPath: '/data_report/report_config'
                        }
                    },
                    {
                        path: 'report_pagesing_mode',
                        name: 'report_pagesing_mode',
                        component: reporting_mode,
                        meta: {
                            title: '上报方式',
                            guidePath: true,
                            jumpPath: '/data_report/report_config'
                        }
                    },
                    {
                        path: 'report_organization_information',
                        name: 'report_organization_information',
                        component: organization_information,
                        meta: {
                            title: '机构信息',
                            guidePath: true,
                            jumpPath: '/data_report/report_config'
                        }
                    },
                    {
                        path: 'report_email_set',
                        name: 'report_email_set',
                        component: email_set,
                        meta: {
                            title: '邮件提醒',
                            guidePath: true,
                            jumpPath: '/data_report/report_config'
                        }
                    }
                ]
            }
        ]
    }

]
