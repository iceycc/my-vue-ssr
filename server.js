const VueServerRender = require('vue-server-renderer');
const Koa = require('koa');
const static = require('koa-static')
const Router = require('koa-router');
const fs = require('fs');
const path = require('path');


const bundle = fs.readFileSync(path.resolve(__dirname, 'dist/server.bundle.js'), 'utf8')
const template = fs.readFileSync(path.resolve(__dirname, 'dist/index.ssr.html'), 'utf8')

// bundle打包出来是个函数
const render = VueServerRender.createBundleRenderer(bundle, {
    template
})

const app = new Koa();
const router = new Router();
// 先找静态文件
app.use(static(path.resolve(__dirname, 'dist')))
// 再走路由
app.use(router.routes())
router.get('/', async ctx => {
    // ctx.body = await render.renderToString() // 一个bug，样式现在只能使用回调方式
    try {
        ctx.body = await new Promise((resolve, reject) => {
            render.renderToString((err, html) => {
                if (err) reject('404')
                resolve(html)
            })
        })
    } catch (e) {
        ctx.body = e
    }
});

router.get("/(.*)", async ctx => {
    try {
        ctx.body = await new Promise((resolve, reject) => {
            render.renderToString({url: ctx.url}, (err, html) => {
                if (err) {
                    return reject('Not found 11');
                }
                resolve(html); // 当前路径访问不到直接返回首页，前端路由 会根据路径 进行跳转
            })
        })
    } catch (err) {
        ctx.body = err
    }
});

app.listen(3000, () => {
    console.log('start in http://localhost:3000')
})
