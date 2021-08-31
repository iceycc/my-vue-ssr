const Vue = require('vue');
const VueServerRender = require('vue-server-renderer')
const fs = require('fs');
const path = require('path');
const vm = new Vue({
    data() {
        return {
            name: 'wby'
        }
    },
    template: `
      <div>{{ name }}</div>
    `
});
const template = fs.readFileSync(path.resolve(__dirname, 'template.html'), 'utf8')
const render = VueServerRender.createRenderer({
    template: template
})

const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa();
const router = new Router()
app.use(router.routes()); // 加载路由系统
router.get('/', async (ctx) => {
    ctx.body = await render.renderToString(vm)
})

app.listen(3000, () => {
    console.log('start in http://localhost:3000')
});
