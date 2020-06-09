const Koa = require('koa');
const Router = require('koa-router')
const router = new Router();
const {ParameterException} = require('../../core/http-exception.js');
const {generateToken} = require('../../middlewares/util.js');
// 记得导出来要用括号包住
const {ProductPurchased} = require('../models/productPurchased');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {verifyToken} = require('../../middlewares/util')
// router.post('/user/:id', testMiddleware, async (ctx, next) => {
//     console.log('路由中间件', ctx);
//     // 获取路径的参数，必须配合上面的:id一起
//     const path = ctx.params
//     // ? 后面的参数
//     const query = ctx.request.query
//     // 获取header里面的参数
//     const headers = ctx.request.header
//     // 获取body的参数要借助 koa-bodyparser 模块
//     const body = ctx.request.body
//     // ctx.response.body = `<h5>Hello, ${name}!</h5>`;
//     if (body.id && ''+body.id === '1') {
//         throw new ParameterException();
//     } else {
//         ctx.body = {
//             userID: ctx.params.id ? ctx.params.id : ''
//         }
//     }
// });

// 购买该订单
router.post('/buy', verifyToken, async (ctx, next) => {
    const body = ctx.request.body
    var order = await ProductPurchased.buyProduct({
        orderIds: body.orderIds,
        parentId: body.parentId,
        userId: ctx.user.uid
    });
    ctx.body = {
        data: order
    }
});

// 获取订单列表
router.post('/buy/product', verifyToken, async (ctx, next) => {
    const body = ctx.request.body
    var orderList = await ProductPurchased.queryBuyedProduct({
        userId: body.uid
    });
    ctx.body = {
        data: orderList
    }
});

router.post('/share/user', verifyToken, async (ctx, next) => {
    const body = ctx.request.body
    var orderList = await ProductPurchased.queryBuyedProduct({
        id: body.id
    });
    ctx.body = {
        data: orderList
    }
});



module.exports =  router;

