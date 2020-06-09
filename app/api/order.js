const Koa = require('koa');
const Router = require('koa-router')
const router = new Router();
const {ParameterException} = require('../../core/http-exception.js');
const {generateToken} = require('../../middlewares/util.js');
// 记得导出来要用括号包住
const {Order} = require('../models/order.js');
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

// 根据个人id查询订单  分页查询
router.post('/order/list', verifyToken, async (ctx, next) => {
    const query = ctx.request.query
    var list = await Order.queryOrder({
        page: query.page ? query.page : 1,
        size: query.szie ? query.size : 10
    }, {
        userId: ctx.user.uid
    });
    ctx.body = {
        data: list
    }
});

// 下单接口
router.post('/order', verifyToken, async (ctx, next) => {
    const body = ctx.request.body
    if (!body.productId) {
        throw new ParameterException('productId参数必填');
    }
    var order = await Order.addOrder({
        userId: ctx.user.uid,
        productId: body.productId
    });
    ctx.body = {
        data: order
    }
});

// 删除订单
router.delete('/order', verifyToken, async (ctx, next) => {
    const body = ctx.request.body
    var order = await Order.removeOrder({
        id: body.id
    });
    ctx.body = {
        data: order
    }
});

// 修改订单
router.put('/order', verifyToken, async (ctx, next) => {
    const body = ctx.request.body
    var order = await Order.editOrder({
        id: body.id,
        address: body.address
    });
    ctx.body = {
        data: order
    }
});

module.exports =  router;

