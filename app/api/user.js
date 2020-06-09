const Koa = require('koa');
const Router = require('koa-router')
const router = new Router();
const {ParameterException} = require('../../core/http-exception.js');
const {generateToken} = require('../../middlewares/util.js');
// 记得导出来要用括号包住
const {User} = require('../models/user.js');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
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

// 登录接口
router.post('/login', async (ctx, next) => {
    const body = ctx.request.body;
    // 现根据账号查询当前用户是否存在
    var v = await User.queryUserByUserName(body);
    var tokenType = '登录成功';
    // 如果 账号 不存在就创建用户
    if (!v) {
        v = await User.createNewUser(body);
        tokenType = '注册成功';
    } else {
        // 如果账号存在就对比密码
        const correct = bcrypt.compareSync(body.password, v.get('password'));
        // 正确就返回token
        if (!correct) {
            tokenType = '密码错误';
        }
    }

    // 返回token
    const token = generateToken(v.get('id'))

    ctx.body = {
        username: v.get('username'),
        password: v.get('password'),
        correct: tokenType,
        token: token
    }
    // 如果用户存在就直接返回token，不存在就先注册再返回token
    // if (user) {

    // } else {

    // }
});


// 验证token
router.post('/token', async (ctx, next) => {
    const headers = ctx.request.header
    let isToken = true
    try {
        var decode = jwt.verify(headers.token, global.config.security.secretKey);
    } catch (error) {
        isToken = false
    }
    ctx.body = {
        token: isToken,
        user: decode
    }
});

// 获取所有用户
router.post('/user', async (ctx, next) => {
    // 接口权限验证
    await User.isPermission(ctx, 'admin');
    let users = await User.queryUsers();
    ctx.body = {
        list: users
    }
});




module.exports =  router;

