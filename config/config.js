module.exports = {
    environment: 'dev',
    database: {
        dbName: 'maizhuan',
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '123456'
    },
    security: {
        secretKey: "abcdefg",
        // 过期时间 1小时
        expiresIn: 60 * 60
    },
}