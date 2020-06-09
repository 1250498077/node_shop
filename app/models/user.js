const bcrypt = require('bcryptjs')
const {ParameterException} = require('../../core/http-exception.js');
const {sequelize} = require('../../core/db');
const {Sequelize, Model} = require('sequelize');
const {Role} = require('./role');
const jwt = require('jsonwebtoken');

// 定义用户模型
class User extends Model {

    // 设定访问该接口需要哪个code
    static async isPermission (ctx, code) {
        const headers = ctx.request.header;
        if (!headers.token) {
            throw new ParameterException('该接口需要传递token')
        }
        var user = jwt.verify(headers.token, global.config.security.secretKey);
        // 找到该用户
        let userMod = await User.findOne({
            where: {
                id: user.uid
            }
        });
        // 获取当前的用户角色信息
        let roleMod1 = await Role.findOne({
            where: {
                id: userMod.role_id
            }
        });
        // 获取接口所需要的的角色的信息
        let roleMod2 = await Role.findOne({
            where: {
                role_code: code
            }
        });

        if (code !== roleMod1.role_code || roleMod2.level > roleMod1.level) {
            throw new ParameterException('当前角色没有权限访问该接口');
        }
    }

    // 获取token
    static async getToken (obj) {
        const user = await User.create({
            username: obj.username,
            password: obj.password
        })
        return user;
    }

    // 创建新用户
    static async createNewUser (obj) {
        const user = await User.create({
            username: obj.username,
            password: obj.password
        })
        return user;
    }

    // 根据账号查询用户是否存在
    static async queryUserByUserName (obj) {
        const user = await User.findOne({
            where: {
                username: obj.username
            }
        })
        return user;
    }

    // 获取全部用户
    static async queryUsers () {
        const users = await User.findAll();
        return users;
    }

}

// 初始用户模型
User.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    role_id: Sequelize.INTEGER,
    username: Sequelize.STRING,
    password: {
        // 扩展 设计模式 观察者模式
        // ES6 Reflect Vue3.0
        type: Sequelize.STRING,
        set(val) {
            // 加密
            const salt = bcrypt.genSaltSync(10)
            // 生成加密密码
            const psw = bcrypt.hashSync(val, salt)
            this.setDataValue("password", psw)
        }
    }
}, {
    sequelize,
    tableName: 'user'
})


module.exports = {
    User
}
