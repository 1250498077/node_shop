const jwt = require('jsonwebtoken')
const {TokenException} = require('../core/http-exception');
/***
 * 
 */
const findMembers = function (instance, {
    prefix,
    specifiedType,
    filter
}) {
    // 递归函数
    function _find(instance) {
        //基线条件（跳出递归）
        if (instance.__proto__ === null)
            return []

        let names = Reflect.ownKeys(instance)
        names = names.filter((name) => {
            // 过滤掉不满足条件的属性或方法名
            return _shouldKeep(name)
        })

        return [...names, ..._find(instance.__proto__)]
    }

    function _shouldKeep(value) {
        if (filter) {
            if (filter(value)) {
                return true
            }
        }
        if (prefix)
            if (value.startsWith(prefix))
                return true
        if (specifiedType)
            if (instance[value] instanceof specifiedType)
                return true
    }

    return _find(instance)
}

// 颁发令牌
const generateToken = function (uid) {
    const secretKey = global.config.security.secretKey
    const expiresIn = global.config.security.expiresIn
    const token = jwt.sign({
        uid
    }, secretKey, {
        expiresIn
    })

    return token
}

// 验证用户token
const verifyToken = async function (ctx, next) {
    const token = ctx.request.header.token;
    if (!token) {
        throw new TokenException('请在header传入token');
    }
    try {
        var user = jwt.verify(token, global.config.security.secretKey);
        ctx.user = user
    }catch(e) {
        throw new TokenException('toekn无效,请重新登录')
    }
    await next()
}

module.exports = {
    findMembers,
    generateToken,
    verifyToken
}