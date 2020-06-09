const bcrypt = require('bcryptjs')

const {sequelize} = require('../../core/db');
const {Sequelize, Model} = require('sequelize');

// 定义用户模型
class Product extends Model {

    static FILTER = {
        name: '',
        desc: '',
        price: 0,
    }

    // 查询表的总数
    static async getSumNumber () {
        return await Product.count();
    }

    // 解析分页参数
    static changePageToLimit = async (obj) => {
        let page = parseInt(obj.page);
        let size = parseInt(obj.size);

        // 参数校验
        if (page < 1 || size < 1) {
            console.log('分页参数错误，page或者size不能为负数或0');
        }
        return {
            offset: (page - 1)*size,
            limit: page*size
        }
    }

    // 查询结果
    static async queryAllProductList (urlParams, bodyParams) {
        // 解析分页参数
        let pageObj = await Product.changePageToLimit(urlParams)
        let list = await Product.findAll({ offset: pageObj.offset, limit: pageObj.limit });
        return list;
    }
}

// 初始用户模型
Product.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.STRING,
    price:Sequelize.INTEGER,
    img: Sequelize.STRING,
    desc: Sequelize.STRING,
}, {
    sequelize,
    tableName: 'product'
})


module.exports = {
    Product
}
