<template>
    <div class="shop-loading">
        <van-nav-bar title="下单完成" left-arrow @click-left="handleBack" />
        <div class="dispatch">
            <img :src="data.images" class="status-icon">
            <div class="tips">
                {{ data.title }}
                <div class="tips-content">{{ data.content }}</div>
            </div>
            <div class="next-step-body">
                <div style="padding: 0 1rem;">
                    <van-button color="linear-gradient(to right, var(--theme-color-1), var(--theme-color-2))" block @click="handleBack">{{
                        data.button }}</van-button>
                </div>
            </div>
            <van-cell-group inset class="redemption">
                <van-row class="redemption-list" v-for="(item, index) in data.redemption" :key="index">
                    <van-col span="4" class="redemption-sort" :class="index < 3 ? 'level' + index : ''">{{ index + 1
                        }}</van-col>
                    <van-col span="14" class="redemption-name">{{ item.name }}</van-col>
                    <van-col span="6" class="redemption-number">上线 {{ item.count }} 次</van-col>
                </van-row>
            </van-cell-group>
        </div>
    </div>
</template>

<script setup>
import httpRequest from '../../static/request.js';
import config from '../../static/config.js';
import { ref, onMounted } from 'vue';
import cookie from 'js-cookie';
import { useRoute, useRouter } from 'vue-router';
import { showToast } from 'vant';

const token = ref(cookie.get('shop-token') || '');
const route = useRoute();
const router = useRouter();

const data = ref({
    title: '',
    content: '',
    button: '',
    ranking: 0,
    images: '',
    redemption: []
});

onMounted(() => {
    if (!token.value) {
        redirectToLogin();
    } else {
        loadPageInfo();
    }
});

const handleBack = () => router.push('/')

const redirectToLogin = () => router.push('/login');

// 加载页面数据
const loadPageInfo = async () => {
    try {
        const response = await httpRequest({
            url: config.interface.getTransactionsSuccess,
            method: 'post',
            data: { token: token.value, type: route.params.type },
        });
        if (response.code === 0) {
            Object.assign(data.value, response.data);
        } else {
            showToast(response.message || '获取失败');
        }
    } catch (error) {
        showToast('请求失败，请稍后重试');
    }
};
</script>

<style>
.shop-loading {
    background-color: #fafafa;
    min-height: 100vh;

    .dispatch {
        display: flex;
        flex-direction: column;
        text-align: center;


        .status-icon {
            margin: 4rem auto 1rem;
            width: 8rem
        }

        .tips {
            display: flex;
            flex-direction: column;
            font-size: 1.2rem;
            font-weight: 500;
            color: var(--theme-color-1);

            .tips-content {
                color: #969799;
                font-size: .8rem;
                font-weight: 400;
                margin-top: .5rem;
                white-space: pre-line
            }
        }

        .next-step-body {
            margin-top: 1rem;
            width: 100%;
        }

        .redemption {
            margin-top: 1rem;

            .redemption-list {
                padding: .5rem 1rem;
                font-size: .9rem;
                display: flex
            }

            .redemption-sort,
            .redemption-name {
                text-align: left;
                font-size: .9rem;
                align-self: center
            }

            .redemption-number {
                text-align: right;
                font-size: .9rem;
                align-self: center
            }

            .level0 {
                color: #ffdc7b;
                font-size: 1.5rem
            }

            .level1 {
                color: #7887a8;
                font-size: 1.5rem
            }

            .level2 {
                color: #ad795c;
                font-size: 1.5rem
            }
        }
    }
}
</style>
