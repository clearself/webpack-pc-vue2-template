function isValidIP(ip) {
    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    return reg.test(ip)
}

export const requireIp = (rule, value, callback) => {
    if (value && isValidIP(value)) {
        callback()
    } else {
        callback(new Error('ip地址格式不正确'))
    }
}

export const isIp = (rule, value, callback) => {
    if (!value) {
        callback()
    }
    if (isValidIP(value)) {
        callback()
    } else {
        callback(new Error('ip地址格式不正确'))
    }
}
