const {sequelize} = require('../../core/db');
const {Sequelize, Model} = require('sequelize');

// 定义角色模型
class Role extends Model {

    // 根据角色id获取角色
    static getRole = async (id) => {
        let role = await Role.findOne({
            id: id
        });
        return role;
    }

}

// 初始角色模型
Role.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    role_name: Sequelize.STRING,
    role_code:Sequelize.STRING,
    level: Sequelize.INTEGER,
}, {
    sequelize,
    tableName: 'role'
})


module.exports = {
    Role
}
