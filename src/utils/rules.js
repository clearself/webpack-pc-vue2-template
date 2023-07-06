export function checkPhone(rule, value, callback) {
    console.log(rule)
    if (value === '') {
        if (rule.required) {
            callback(new Error('请输入手机号'))
        } else {
            callback()
        }
    } else if (!(/^1[345678]\d{9}$/.test(value))) {
        callback(new Error('请输入真实手机号'))
    } else {
        callback()
    }
}
export function checkMail(rule, value, callback) {
    if (value === '') {
        if (rule.required) {
            callback(new Error('请输入邮箱'))
        } else {
            callback()
        }
    } else if (!(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/.test(value))) {
        callback(new Error('请输入有效的邮箱地址'))
    } else {
        callback()
    }
}
export function checkPwd(rule, value, callback) {
    if (value === '') {
        if (rule.required) {
            callback(new Error('请输入密码'))
        } else {
            callback()
        }
    } else if (!(/(?=.*[a-z])(?=.*\d)(?=.*[#@!~%^$&*])[a-z\d#@!~%^$&*]{8,30}/i.test(value))) {
        callback(new Error('请输入符合要求的密码'))
    } else {
        callback()
    }
}
export function checkLoginPwd(rule, value, callback) {
    if (value.toString().length === 0) {
        callback(new Error('请输入密码'))
    }
    if (value.toString().length < rule.limit) {
        callback(new Error('密码需在' + rule.limit + '位以上'))
    }
    /* ---包含数字1--*/
    const reg1 = /\d/g
    /* --包含大写字母2--*/
    const reg2 = /[A-Z]/g
    /* --包含小写字母3--*/
    const reg3 = /[a-z]/g
    /* --包含特殊字符4--*/
    const reg4 = /[#@!~%^$&*]/g
    if (rule.pwDefault == 2) {
        let res = true
        let arr = []
        if (rule.pwCustom.includes('1')) {
            arr.push('数字')
            res = res && reg1.test(value)
        }
        if (rule.pwCustom.includes('2')) {
            arr.push('大写字母')
            res = res && reg2.test(value)
        }
        if (rule.pwCustom.includes('3')) {
            arr.push('小写字母')
            res = res && reg3.test(value)
        }
        if (rule.pwCustom.includes('4')) {
            arr.push('特殊符号（#@!~%^$&*）')
            res = res && reg4.test(value)
        }

        if (res) {
            callback()
        } else {
            callback(new Error('密码必须包含' + arr.join('、')))
        }
    } else {
        /* --必须包含数字字母特殊符号--*/
        if (!(/(?=.*[a-z])(?=.*\d)(?=.*[#@!~%^$&*])[a-z\d#@!~%^$&*]/i.test(value))) {
            callback(new Error('密码必须包含数字、字母、特殊符号'))
        } else {
            callback()
        }
    }
}

export default {
    phone: [
        {
            required: true,
            validator: checkPhone,
            trigger: 'blur'
        }
    ],
    mail: [
        {
            required: true,
            validator: checkMail,
            trigger: 'blur'
        }
    ],
    password: [
        {
            required: true,
            validator: checkPwd,
            trigger: 'blur'
        }
    ],
    loginPwd: [
        {
            required: true,
            validator: checkLoginPwd,
            trigger: 'blur'
        }
    ],
    ip: [
        {
            required: true,
            message: '请输入IP',
            trigger: 'blur'
        },
        {
            pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
            message: '请输入正确的IP',
            trigger: 'blur'
        }
    ]
}
