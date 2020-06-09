const Router = require('koa-router')
const router = new Router();
const {ParameterException} = require('../../core/http-exception.js');
const {generateToken} = require('../../middlewares/util.js');
// 记得导出来要用括号包住
const {Product} = require('../models/product.js');

// 登录接口
router.post('/product-list', async (ctx, next) => {

    const query = ctx.request.query
    var v = await Product.queryAllProductList({
        page: query.page ? query.page : 1,
        size: query.szie ? query.size : 10
    }, {});

    ctx.body = {
        list: v
    }
});

module.exports =  router;

