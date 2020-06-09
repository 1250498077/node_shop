require('module-alias/register')

const Koa = require('koa')
const InitManager = require('./core/init')
const parser = require('koa-bodyparser')
const catchError = require('./middlewares/exceptions')
const delay = require('./middlewares/delay')

const app = new Koa()

app.use(catchError)
app.use(parser())
// 设置跨域
app.use(async (ctx, next) => {
    ctx.set("Access-Control-Allow-Origin", "*");
    await next();
})


InitManager.initCore(app)

app.listen(3000)
