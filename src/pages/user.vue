<template>
    <div class="user">
        <div class="matrix">
            <img :src="background">
            <div class="overlay"></div>
        </div>
        <div class="user-info">
            <div class="avatar">
                <img :src="data.avatar">
            </div>
            <div class="info">
                <div>
                    <div class="uid">{{ data.uid }}</div>
                </div>
                <div>
                    <div class="name">{{ data.uname }}</div>
                </div>
            </div>
            <div class="logout" @click="logout">
                <img src="../assets/user/quit.png" />
                退出登录
            </div>
        </div>
        <div class="vip-card">
            <img src="../assets/user/vipcard.png">
            <div class="title">{{ data.type }}</div>
            <van-button plain round class="download" size="mini" @click="goToLink">一键爆米</van-button>
            <div class="content">当前积分：{{ data.point }}</div>
            <div class="illustrate">火速冲入直播间&nbsp;&nbsp;·&nbsp;&nbsp;增加积分&nbsp;&nbsp;·&nbsp;&nbsp;兑换心仪商品</div>
        </div>
        <van-cell-group inset class="serve">
            <van-row>
                <van-col span="24" class="serve-title">我的服务</van-col>
            </van-row>
            <van-grid class="serve-item" :border="false">
                <van-grid-item class="serve-item-list">
                    <van-image :src="data.icon.pay_log" class="serve-item-list-icon"
                        @click="router.push('/user/consumers')" />
                    <div class="serve-item-title">开通记录</div>
                </van-grid-item>
                <van-grid-item class="serve-item-list">
                    <van-image :src="data.icon.convertible" class="serve-item-list-icon"
                        @click="router.push('/user/redeeming')" />
                    <div class="serve-item-title">兑换记录</div>
                </van-grid-item>
                <van-grid-item class="serve-item-list">
                    <van-image :src="data.icon.address" class="serve-item-list-icon"
                        @click="router.push('/user/address')" />
                    <div class="serve-item-title">收货地址</div>
                </van-grid-item>
                <van-grid-item class="serve-item-list">
                    <van-image :src="data.icon.complain" class="serve-item-list-icon"
                        @click="router.push('/user/complaint')" />
                    <div class="serve-item-title">投诉建议</div>
                </van-grid-item>
            </van-grid>
        </van-cell-group>
        <div class="sign-out-body">
            <van-button plain round type="primary" size="small" class="sign-out" @click="logout">退出登录</van-button>
        </div>
        <van-tabbar v-model="active" active-color="var(--theme-color-1)" @change="menuSwitch">
            <van-tabbar-item icon="home-o">首页</van-tabbar-item>
            <van-tabbar-item icon="user-o">我的</van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script setup>
import httpRequest from '../static/request.js';
import config from '../static/config.js';
import { ref, onMounted } from 'vue';
import cookie from 'js-cookie';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';

const router = useRouter();
const active = ref(1);

const background = ref(null);

const data = ref({
    icon: {
        pay_log: null,
        convertible: null,
        address: null,
        complain: null
    },
    point: null,
    type: null,
    uid: null,
    uname: null,
    link: null,
    avatar: null
});

const token = ref(cookie.get('shop-token') || '');

// 页面加载时检查 token 并获取用户数据
onMounted(() => {
    if (!token.value) {
        redirectToLogin();
    } else {
        getConfigData();
        fetchUserData();
    }
});

const goToLink = () => {
    window.location.href = data.value.link
}

// 获取配置信息
const getConfigData = async () => {
    try {
        const res = await httpRequest({
            url: config.interface.getUserBackgroundImage,
            method: 'post',
            data: { token: token.value },
        });
        if (res.code == 0) {
            background.value = res.data.background;
        } else {
            showToast(res.message || '获取失败');
        }
    } catch (error) {
        showToast('请求失败，请稍后再试');
        console.log(error)
    }
}

// 获取个人信息
const fetchUserData = async () => {
    try {
        const response = await httpRequest({
            url: config.interface.getMy,
            method: 'post',
            data: { token: token.value },
        });
        if (response.code === 0) {
            Object.assign(data.value, response.data);
        } else {
            showToast(response.message || '获取失败');
        }
    } catch (error) {
        showToast('请求失败，请稍刷新页面');
    }
};

// 退出登录
const logout = async () => {
    try {
        const response = await httpRequest({
            url: config.interface.logout,
            method: 'post',
            data: { token: token.value },
        });

        if (response.code === 0) {
            cookie.remove('shop-token');
            redirectToLogin();
        } else {
            showToast(response.message || '退出失败');
        }
    } catch (error) {
        showToast('请求失败，请稍刷新页面');
    }
};

// 切换菜单
const menuSwitch = (index) => {
    const routes = ['/', '/user'];
    router.push(routes[index]);
};

// 重定向到登录页面
const redirectToLogin = () => router.push('/login');
</script>

<style>
body {
    position: relative;
    z-index: 0;
}

.user {
    .matrix {
        position: fixed;
        z-index: -1;
        width: 100%;

        img {
            width: 100%;
        }

        .overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, #fafafa 100%);
        }
    }

    .user-info {
        display: flex;
        align-items: center;
        padding: 3rem 1rem 0 1rem;
        color: #fff;

        .avatar {
            width: 4.5rem;

            img {
                width: 80%;
                margin: 0 auto;
                border-radius: 50%;
                border: 2px dashed #fff;
            }
        }

        .info {
            flex: 1;
            padding-left: 1rem;

            .uid {
                font-size: 1rem;
                font-weight: 500;
                display: inline-block;
            }

            .name {
                margin-top: 0.5rem;
                padding: 0.2rem 1rem;
                border-radius: 1rem;
                background: rgba(255, 255, 255, 0.2);
                text-align: center;
                display: inline-block;
                color: #fff;
            }
        }

        .logout {
            display: flex;
            flex-direction: column;
            align-items: center;
            font-size: 0.7rem;
            color: #fff;

            img {
                height: 2rem;
                margin-bottom: 0.5rem;
            }
        }
    }

    .vip-card {
        position: relative;
        margin: 2rem 1rem 1rem 1rem;
        color: #fff;

        img {
            width: 100%;
            border-radius: 1rem;
            box-shadow: 0 1px 5px 3px rgba(186, 186, 186, 0.1);
        }

        .title {
            position: absolute;
            top: 8%;
            left: 5%;
            font-size: 1.2rem;
            font-weight: 600;
        }

        .download {
            position: absolute;
            top: 8%;
            right: 5%;
            font-size: 0.8rem;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 1rem;
            padding: 0 1rem;
            color: #fff;
        }

        .content,
        .illustrate {
            position: absolute;
            width: 100%;
            text-align: center;
        }

        .content {
            top: 42%;
        }

        .illustrate {
            bottom: 10%;
            font-size: 0.8rem;
        }
    }

    .serve {
        margin-top: 1.5rem;
        padding: 1rem;
        box-shadow: 0 1px 5px 3px rgba(180, 180, 180, 0.1);

        .serve-title {
            font-size: 1.2rem;
            font-weight: 700;
        }

        .serve-item {
            .serve-item-list {
                text-align: center;

                .serve-item-title {
                    font-size: 0.8rem;
                    color: #333;
                    margin-top: 0.5rem;
                }

                .serve-item-list-icon {
                    height: 2rem;
                }
            }
        }
    }

    .sign-out-body {
        position: fixed;
        bottom: 5.5rem;
        left: 0;
        width: 100%;
        display: flex;
        justify-content: center;

        .sign-out {
            color: #a6a6a6;
            background: #e5e5e5;
            border-radius: 1rem;
            padding: 0.5rem 2rem;
            border-color: #e5e5e5;
        }
    }
}
</style>
