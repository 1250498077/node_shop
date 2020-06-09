const Sequelize = require('sequelize')

const {
    dbName,
    host,
    port,
    user,
    password
} = require('../config/config').database

const sequelize = new Sequelize(dbName, user, password, {
    dialect: 'mysql',
    host,
    port,
    logging: true,
    // 指定东8时区，很重要
    timezone: '+08:00',
    define: {
        // create_time && update_time
        timestamps: false
    }
})

// 创建模型
sequelize.sync({
    force: false
})

module.exports = {
    sequelize
}
