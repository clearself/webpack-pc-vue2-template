class Rules {
    // eslint-disable-next-line no-useless-constructor
    constructor() {}
    catalogueRules() {
        const catalogueRulesData = {
            path: [{
                required: true,
                message: '请输入',
                trigger: 'blur'
            }],
            encode: [{
                required: true,
                message: '请选择',
                trigger: 'change'
            }]
        }
        return catalogueRulesData
    }

    formDataRules() {
        const formDataRulesData = {
            taskName: [{
                required: true,
                message: '请输入',
                trigger: 'blur'
            }],
            nodeId: [{
                required: true,
                message: '请选择',
                trigger: 'change'
            }],
            type: [{
                required: true,
                message: '请选择',
                trigger: 'change'
            }],
            ruleIdList: [{
                required: true,
                message: '请选择',
                trigger: 'change'
            }]
        }
        return formDataRulesData
    }

    esRules() {
        const esRulesData = {
            colonyName: [{
                required: true,
                message: '请输入',
                trigger: 'blur'
            }],
            ip: [{
                required: true,
                message: '请输入',
                trigger: 'blur'
            }],
            port: [
                {
                    required: true,
                    message: '请输入',
                    trigger: 'blur'
                }
            ],
            esIndex: [
                {
                    required: true,
                    message: '请输入',
                    trigger: 'blur'
                }
            ],
            incrementalType: [
                {
                    required: true,
                    message: '请输入',
                    trigger: 'blur'
                }
            ],
            esincrementalType: [
                {
                    required: true,
                    message: '请输入',
                    trigger: 'blur'
                }
            ],
            queryStatement: [
                {
                    required: true,
                    message: '请输入',
                    trigger: 'blur'
                }
            ],
            indexColumn: [
                {
                    required: true,
                    message: '请输入',
                    trigger: 'blur'
                }
            ],
            indexColumnType: [{
                required: true,
                message: '请选择',
                trigger: 'change'
            }],
            indexPace: [{
                required: true,
                message: '请选择',
                trigger: 'blur'
            }]
        }
        return esRulesData
    }

    hdfsRules() {
        const hdfsRulesData = {
            ip: [{
                required: true,
                message: '请输入',
                trigger: 'blur'
            }],
            port: [{
                required: true,
                message: '请输入',
                trigger: 'blur'
            }],
            path: [{
                required: true,
                message: '请输入',
                trigger: 'blur'
            }],
            encode: [{
                required: true,
                message: '请选择',
                trigger: 'change'
            }],
            indexOffset: [{
                required: true,
                message: '请选择',
                trigger: 'change'
            }]
        }
        return hdfsRulesData
    }

    syslogRules() {
        const syslogRulesData = {
            port: [{
                required: true,
                message: '请输入',
                trigger: 'blur'
            }],
            encode: [{
                required: true,
                message: '请选择',
                trigger: 'change'
            }],
            ip: [{
                required: true,
                message: '请输入',
                trigger: 'blur'
            }]
        }
        return syslogRulesData
    }

    kafkaRules() {
        const kafkaRulesData = {
            ip: [{
                required: true,
                message: '请输入',
                trigger: 'blur'
            }],
            topic: [{
                required: true,
                message: '请输入',
                trigger: 'blur'
            }],
            kafkaType: [{
                required: true,
                message: '请输入',
                trigger: 'blur'
            }],
            consumeId: [{
                required: true,
                message: '请输入',
                trigger: 'blur'
            }],
            customeId: [{
                required: true,
                message: '请输入',
                trigger: 'blur'
            }],
            encode: [{
                required: true,
                message: '请选择',
                trigger: 'change'
            }],
            wildcard: [{
                required: true,
                message: '请选择',
                trigger: 'change'
            }],
            indexOffset: [{
                required: true,
                message: '请选择',
                trigger: 'change'
            }],
            permissionCheck: [{
                required: true,
                message: '请选择',
                trigger: 'change'
            }]
        }
        return kafkaRulesData
    }

    databaseRules() {
        const databaseRulesData = {
            dbType: [{
                required: true,
                message: '请选择',
                trigger: 'change'
            }],
            database: [{
                required: true,
                message: '请输入',
                trigger: 'blur'
            }],
            ip: [{
                required: true,
                message: '请输入',
                trigger: 'blur'
            }],
            port: [{
                required: true,
                message: '请输入',
                trigger: 'blur'
            }],
            username: [{
                required: true,
                message: '请输入',
                trigger: 'blur'
            }],
            password: [{
                required: true,
                message: '请输入',
                trigger: 'blur'
            }],
            table: [{
                required: true,
                message: '请输入',
                trigger: 'blur'
            }],
            incrementalField: [{
                required: true,
                message: '请输入',
                trigger: 'blur'
            }],
            incrementalType: [{
                required: true,
                message: '请选择',
                trigger: 'change'
            }],
            indexColumn: [{
                required: true,
                message: '请输入',
                trigger: 'blur'
            }],
            indexStart: [{
                required: true,
                message: '请输入',
                trigger: 'blur'
            }],
            indexPace: [{
                required: true,
                message: '请输入',
                trigger: 'blur'
            }],
            indexOffset: [{
                required: true,
                message: '请选择',
                trigger: 'change'
            }]
        }
        return databaseRulesData
    }
}
export default new Rules()
