export default [
    {
        label: '安全设备事件',
        value: 'AlarmEvent',
        options: [
            {
                label: '事件',
                value: 'alarm',
                type: 'string',
                options: null
            },
            {
                label: '标签',
                value: 'label',
                type: 'enum',
                options: [
                    {
                        label: '标签一',
                        value: 'label1'
                    }
                ]
            },
            {
                label: '时间',
                value: 'time',
                type: 'time',
                options: [
                    {
                        label: '小时',
                        value: 'hour'
                    }
                ]
            }
        ]
    }
]
