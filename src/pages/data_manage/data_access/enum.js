class Enum {
    // eslint-disable-next-line no-useless-constructor
    constructor() {}
    dbTypeList() {
        const dbTypeListData = [
            {
                name: 'MySQL',
                id: 1
            }

        ]
        return dbTypeListData
    }

    incrementalTypeList() {
        const incrementalTypeListData = [
            {
                name: '自增数字',
                id: 1
            },
            {
                name: '时间类型',
                id: 2
            }
        ]
        return incrementalTypeListData
    }

    indexOffsetList() {
        const indexOffsetListData = [
            {
                name: '否',
                id: 0
            },
            {
                name: '是',
                id: 1
            }
        ]
        return indexOffsetListData
    }

    wildcardList() {
        const wildcardListData = [
            {
                name: '否',
                id: 0
            },
            {
                name: '是',
                id: 1
            }
        ]
        return wildcardListData
    }

    permissionCheckList() {
        const permissionCheckListData = [
            {
                name: '无',
                id: 0
            },
            {
                name: 'plain',
                id: 1
            },
            {
                name: 'Kerberos',
                id: 2
            },
            {
                name: 'ssl',
                id: 3
            }
        ]
        return permissionCheckListData
    }

    encodeList() {
        const encodeListData = [
            {
                name: 'UTF-8',
                id: 1
            },
            {
                name: 'GBK',
                id: 2
            }
        ]
        return encodeListData
    }

    typeList() {
        const typeListData = [
            {
                name: '目录',
                id: 1
            },
            {
                name: '数据库',
                id: 2
            },
            {
                name: 'KAFKA',
                id: 3
            },
            {
                name: 'SYSLOG',
                id: 4
            },
            {
                name: 'HDFS',
                id: 5
            },
            {
                name: 'ES',
                id: 6
            }
        ]
        return typeListData
    }
}
export default new Enum()
