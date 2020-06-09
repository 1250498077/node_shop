const Router = require('koa-router')
const requireDirectory = require('require-directory')
const config = require('../config/config')
const ChatSocket = require('../app/socket/chatSocket');

class InitManager {
    static initCore(app) {
        this.app = app;
        // 初始化全部路由文件
        InitManager.initLoadRouters();
        // 初始化配置信息
        InitManager.loadConfig()
        
        new ChatSocket();
    }

    // 加载全部路由文件
    static initLoadRouters() {
        const apiDirectory = process.cwd() + '/app/api';
        requireDirectory(module, apiDirectory, {
            visit: whenLoadModule
        })

        // 判断 requireDirectory 加载的模块是否为路由
        function whenLoadModule(obj) {
            if (obj instanceof Router) {
                InitManager.app.use(obj.routes())
            }
        }
    }

    // 将配置文件全部注册到global全部变量中
    static loadConfig() {
        global.config = config
    }

}
// 上面定义的都是一个静态方法
module.exports = InitManager