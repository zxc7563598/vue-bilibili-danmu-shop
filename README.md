# vue-bilibili-danmu-shop

​`vue-bilibili-danmu-shop`​ 是一个基于 Vue 3 和 Vite 构建的前端项目，用于配合 [php-bilibili-danmu](https://github.com/zxc7563598/php-bilibili-danmu) 项目的积分商城模块。该前端页面为用户提供商品浏览与积分兑换等交互功能，依赖后端提供的 API 实现积分管理和订单处理等服务。

> 如果你选择通过 Docker 一键部署整套系统，则无需关注该前端仓库，部署过程将自动完成。

## 项目特点

- **前后端分离架构**：前端基于 Vue 3 构建，后端使用 PHP 提供 RESTful API 接口。
- **实时积分管理**：用户在直播间互动（如发送弹幕、开通大航海）可获得积分。
- **积分商城兑换**：用户可使用积分兑换商城内的虚拟或实物商品。

## 预览

| <img src="https://raw.githubusercontent.com/zxc7563598/vue-bilibili-danmu-shop/src/assets/preview/demo01.png"> | <img src="https://raw.githubusercontent.com/zxc7563598/vue-bilibili-danmu-shop/src/assets/preview/demo02.png"> | <img src="https://raw.githubusercontent.com/zxc7563598/vue-bilibili-danmu-shop/src/assets/preview/demo03.png"> |
| --- | --- | --- |
| <img src="https://raw.githubusercontent.com/zxc7563598/vue-bilibili-danmu-shop/src/assets/preview/demo04.png"> | <img src="https://raw.githubusercontent.com/zxc7563598/vue-bilibili-danmu-shop/src/assets/preview/demo05.png"> | <img src="https://raw.githubusercontent.com/zxc7563598/vue-bilibili-danmu-shop/src/assets/preview/demo06.png"> |
| <img src="https://raw.githubusercontent.com/zxc7563598/vue-bilibili-danmu-shop/src/assets/preview/demo07.png"> | <img src="https://raw.githubusercontent.com/zxc7563598/vue-bilibili-danmu-shop/src/assets/preview/demo08.png"> | <img src="https://raw.githubusercontent.com/zxc7563598/vue-bilibili-danmu-shop/src/assets/preview/demo09.png"> |



## 安装与运行

### 1. 克隆项目

```bash
git clone https://github.com/zxc7563598/vue-bilibili-danmu-shop.git
cd vue-bilibili-danmu-shop
```

### 2. 安装 Node.js

请前往 Node.js 官网下载安装适合你操作系统的版本：

👉 [https://nodejs.org/zh-cn](https://nodejs.org/zh-cn)

建议使用长期支持（LTS）版本。

### 3. 配置环境变量

复制 `.env.example`​ 为 `.env`​：

```bash
cp .env.example .env
```

根据你的部署情况，填写后端 API 地址、密钥等参数。相关信息可在机器人控制台的系统配置中查看。

### 4. 安装依赖并构建项目

```bash
npm install
npm run build
```

构建完成后，静态文件将生成于 `dist/`​ 目录中，可部署至任意静态资源服务器（如 Nginx、Vercel 等）。

---

## 🧩 配套项目

[![Core](https://img.shields.io/badge/php--bilibili--danmu--core-B站交互核心模块-blueviolet?style=for-the-badge&logo=php)](https://github.com/zxc7563598/php-bilibili-danmu-core)
[![Docker](https://img.shields.io/badge/php--bilibili--danmu--docker-Docker一键部署容器-2496ed?style=for-the-badge&logo=docker)](https://github.com/zxc7563598/php-bilibili-danmu-docker)
[![API](https://img.shields.io/badge/php--bilibili--danmu-项目本体-007acc?style=for-the-badge&logo=php)](https://github.com/zxc7563598/php-bilibili-danmu)
[![Admin](https://img.shields.io/badge/vue--bilibili--danmu--admin-前端：管理后台-42b883?style=for-the-badge&logo=vue.js)](https://github.com/zxc7563598/vue-bilibili-danmu-admin)
[![Shop](https://img.shields.io/badge/vue--bilibili--danmu--shop-前端：移动端积分商城-3eaf7c?style=for-the-badge&logo=vue.js)](https://github.com/zxc7563598/vue-bilibili-danmu-shop)
