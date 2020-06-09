const {sequelize} = require('../../core/db');
const {Sequelize, Model} = require('sequelize');
const {Product} = require('./product');
// 定义订单模型
class Order extends Model {

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

    // 用户下单传过来用户id，订单id
    static async addOrder(obj) {
        // 根据商品id查询数据的商品信息
        let product = Product.findOne({ id: obj.productId });
        let order = await Order.create({
            userId: obj.userId,
            productId: obj.productId,
            producTData: product
        });
        return order;
    } 

    // 查询订单接口
    static async  queryOrder(urlParams, bodyParams) {
        // 解析分页为其它查询
        let pageObj = await Order.changePageToLimit(urlParams);

        // 根据userid来查取分页
        const data = await Order.findAndCountAll({
            where: {
              userId: bodyParams.userId
            },
            offset: pageObj.offset,
            limit: pageObj.limit
        });

        return data;
    }
    
    // 删除订单,订单id
    static async removeOrder(obj) {
        let removeObj = await Order.destroy({
            where: {
              id: obj.id
            }
          });
        return removeObj;
    }

    // 修改订单接口 - 现在只提供修改地址接口
    static async editOrder(obj) {
        // 先查到在修改
        const order = await Order.findOne({ id: obj.id });
        order.addr = obj.address;
        return await order.save();;
    }

}

// 初始用户模型
Order.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: Sequelize.STRING,
    productId:Sequelize.INTEGER,
    addr: Sequelize.STRING,
}, {
    sequelize,
    tableName: 'order'
})


module.exports = {
    Order
}
