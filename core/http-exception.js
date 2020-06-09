class HttpException extends Error {
    constructor(msg = '服务器异常', errorCode = 10000, code = 400) {
        super()
        this.errorCode = errorCode
        this.code = code
        this.msg = msg
    }
}

class ParameterException extends HttpException {
    constructor(msg, errorCode) {
        super()
        this.errorCode = errorCode || 10000
        this.code = 400
        this.msg = msg || '参数错误'
    }
}

class TokenException extends HttpException {
    constructor(msg, errorCode) {
        super()
        this.errorCode = errorCode || 10000
        this.code = 11
        this.msg = msg || ''
    }
}

module.exports = {
    HttpException,
    ParameterException,
    TokenException
}
