import Vant from 'vant';
import { createApp } from 'vue'
import config from './static/config'
import router from './router/index'
import App from './App.vue'
import './style.css'
import 'vant/lib/index.css';

const app = createApp(App)
// 全量注册Vant
app.use(Vant);
app.config.globalProperties.$config = config;

// 在路由切换时修改页面的title和meta标签
router.beforeEach((to, from, next) => {
    document.title = to.meta.title
    const metaTags = to.meta.metaTags || []
    metaTags.forEach(tag => {
        const tagElement = document.createElement('meta')
        Object.keys(tag).forEach(key => {
            tagElement.setAttribute(key, tag[key])
        })
        document.head.appendChild(tagElement)
    })
    next()
})

app.use(router)
app.mount('#app')