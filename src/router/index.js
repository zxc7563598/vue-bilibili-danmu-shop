// 1 引入所需方法
// 路由创建：createRouter
// 路由模式(两者任选其一)：createWebHistory - history模式、createWebHashHistory - hash模式
// RouteRecordRaw：意为路由原始信息 （使用vue3+js的不用引入）
import {
    createRouter,
    createWebHistory,
    createWebHashHistory
} from 'vue-router';
import config from '../static/config';
let defaultMeta = [
    { name: "viewport", content: "width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no,viewport-fit=cover" },
    { name: "application-name", content: config.name },
    { name: "apple-mobile-web-app-capable", content: "yes" },
    { name: "apple-mobile-web-app-status-bar-style", content: "default" },
    { name: "theme-color", content: "#ffffff" }
];

let defaultTitle = config.name
// 设置路由规则
const routes = [{
    path: '/',
    component: () => import('../pages/home.vue'),
    meta: {
        title: defaultTitle,
        metaTags: defaultMeta
    }
}, {
    path: '/login',
    component: () => import('../pages/login.vue'),
    meta: {
        title: defaultTitle,
        metaTags: defaultMeta
    }
}, {
    path: '/user',
    component: () => import('../pages/user.vue'),
    meta: {
        title: defaultTitle,
        metaTags: defaultMeta
    }
}, {
    path: '/user/address/:id?',
    component: () => import('../pages/user/address.vue'),
    meta: {
        title: defaultTitle,
        metaTags: defaultMeta
    }
}, {
    path: '/user/redeeming',
    component: () => import('../pages/user/redeeming.vue'),
    meta: {
        title: defaultTitle,
        metaTags: defaultMeta
    }
}, {
    path: '/user/consumers',
    component: () => import('../pages/user/consumers.vue'),
    meta: {
        title: defaultTitle,
        metaTags: defaultMeta
    }
}, {
    path: '/user/complaint',
    component: () => import('../pages/user/complaint.vue'),
    meta: {
        title: defaultTitle,
        metaTags: defaultMeta
    }
}, {
    path: '/shop/details/:id',
    component: () => import('../pages/shop/details.vue'),
    meta: {
        title: defaultTitle,
        metaTags: defaultMeta
    }
}, {
    path: '/shop/confirm/:id',
    component: () => import('../pages/shop/confirm.vue'),
    meta: {
        title: defaultTitle,
        metaTags: defaultMeta
    }
}, {
    path: '/shop/loading/:success/:type',
    component: () => import('../pages/shop/loading.vue'),
    meta: {
        title: defaultTitle,
        metaTags: defaultMeta
    }
}, {
    path: '/protocol/credit/:id/:confirm?',
    component: () => import('../pages/protocol/credit.vue'),
    meta: {
        title: defaultTitle,
        metaTags: defaultMeta
    }
}, {
    // 定义404路由
    path: '/404',
    component: () => import('../pages/notfound.vue'),
    meta: {
        title: defaultTitle,
        metaTags: defaultMeta
    }
}, {
    // 匹配为定义路由然后重定向到404页面
    path: '/:pathMath(.*)',
    redirect: '/404'
}];

// 设置路由
const router = createRouter({
    routes,
    history: createWebHistory()
    // history: createWebHashHistory()
});

// 导出路由
export default router;