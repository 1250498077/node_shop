const {sequelize} = require('../../core/db');
const {Sequelize, Model, Op} = require('sequelize');
const {Order} = require('./order');
const {Product} = require('./product');
const {ParameterException} = require('../../core/http-exception.js');
// 定义购买商品模型
class ProductPurchased extends Model {
    
    // 前端应该传 orderid 数组 和 parantId（可以不传） ,
    // 利用 parantId 查找 productid数组 ，再利用 orderid 数组查找所有的 productid
    // 遍历 productid数组 和 productid 找到对应哪一个商品，这就属于是分销商品
    // 我根据 orderid 去 order 表查询出商品id和用户id结合
    // 得到两个东西，一个商品详情数组，一个userid
    // 业务逻辑处理: id（自增），buyid（自增）, userid， productid， parantId
    static buyProduct = async (bodyParams) => {

        // 根据订单数组id查取商品数组
        let allNeedBuyProductList = await Order.findAll({
            where: {
                id: bodyParams.orderIds
            }
        });
        // 根据 parentId 找出对应productid
        let parentProduct = await Order.findOne({
            where: {
                id: bodyParams.parentId
            }
        });
        if (''+bodyParams.userId === parentProduct.userId) {
            throw new ParameterException('自己不能购买自己分享的商品');
        }

        // 如果用户将 parantId 传过来就证明可能是分销商品
        let shareProduct = [];
        let normalProduct = [];
        allNeedBuyProductList.map((item) => {
            if (parentProduct && ''+item.productId === ''+parentProduct.productId) {
                shareProduct.push({
                    productId: item.productId,
                    userId: item.userId,
                    parentId: parentProduct.id,
                });
            } else {
                normalProduct.push({
                    productId: item.productId,
                    userId: item.userId,
                });
            }
        });

        const list = await ProductPurchased.bulkCreate(shareProduct.concat(normalProduct));
        return list;
    }

    // 根据 userid 查询已经购买的东西，根据userid获取 数组productid 
    // 根据 数组productid 查询对应的商品详情
    static queryBuyedProduct = async (bodyParams) => {
        let res = await ProductPurchased.findAll({
            where: {
                userId: bodyParams.userId
            }
        })
        let productIds = res.map((item) => item.productId);
        let productLists = await Product.findAll({
            where: {
                [Op.in]: productIds
            }
        })
        return productLists;
    }

    // 用户点击经过该商品的分销按钮获取分销的用户
    // 前端传用户id，找到该条记录的buyid，再将该buyId查询parantid获取到userid数组
    // 使用userid数组查出所有用户
    static query = async (bodyParams) => {
        let res = await ProductPurchased.findAll({
            where: {
                id: bodyParams.id
            }
        })
        return res;
    }
}

// 初始已经购买模型
ProductPurchased.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    productId:Sequelize.INTEGER,
    userId: Sequelize.INTEGER,
    parentId: Sequelize.INTEGER,
}, {
    sequelize,
    tableName: 'product_purchased'
})


module.exports = {
    ProductPurchased
}
