'use strict'
import Koa from 'koa';
import convert from 'koa-convert';
import error from 'koa-error';
import cors from 'koa-cors';
import koaBody from 'koa-body';

import config from './config/config';
import router from './router';


const app = new Koa();

//body解析
app.use(convert(koaBody({
    formidable: {
        uploadDir: config.uploadDir
    },
    multipart: true
})));
/*
 跨域支持
 */
app.use(convert(cors()));

//禁止缓存  开发环境使用
if (config.env == 'development') {
    app.use(function(ctx, next) {
        ctx.set('Cache-Control', 'no-cache, no-store, must-revalidate'); // HTTP 1.1.
        ctx.set('Pragma', 'no-cache'); // HTTP 1.0.
        ctx.set('Expires', '0'); // Proxies.
        return next();
    });
}

//输出错误日志 开发环境使用
if (config.env == 'development') {
    app.use(convert(error()));
} else {
    app.on('error', function(err, ctx) {
        ctx.status = err.status || 500;
        ctx.body = err.message;
    });
}



//注册路由
router(app);


//启动监听
app.listen(config.port,()=>{
    console.log(`server start at port ${config.port}`)
});
