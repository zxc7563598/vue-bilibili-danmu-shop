<template>
    <div class="user-complaint">
        <van-nav-bar title="投诉建议" left-arrow @click-left="handleBack" />
        <div class="matrix">
            <img :src="background">
            <div class="overlay"></div>
        </div>
        <van-cell-group inset class="complaint">
            <van-field v-model="title" label="投诉标题" placeholder="请输入您的投诉标题" />
            <van-field v-model="complaint" rows="9" autosize label="投诉内容" type="textarea" maxlength="200"
                placeholder="请输入您的投诉内容" show-word-limit />
        </van-cell-group>
        <div class="operate">
            <div style="padding: 0 1rem;flex:1;">
                <van-button block type="primary"
                    color="linear-gradient(to right, var(--theme-color-1), var(--theme-color-2))" icon="records-o"
                    @click="setComplaint" :loading="loading">
                    进行投诉
                </van-button>
            </div>
        </div>
    </div>
</template>

<script setup>
import httpRequest from '../../static/request.js';
import config from '../../static/config.js';
import { ref, onMounted } from 'vue';
import cookie from 'js-cookie';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';

const router = useRouter();

const loading = ref(false);

const background = ref(null);

const title = ref('');
const complaint = ref('');

const data = ref({
    point: null,
    type: null,
    uid: null,
    uname: null,
    avatar: null
});

const token = ref(cookie.get('shop-token') || '');

// 页面加载时检查 token 并获取用户数据
onMounted(() => {
    if (!token.value) {
        redirectToLogin();
    } else {
        getConfigData();
    }
});

const handleBack = () => router.push('/user');
const redirectToLogin = () => router.push('/login');

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

const setComplaint = async () => {
    if (!title.value) {
        showToast('标题！投诉标题写一个');
        return false;
    }
    if (!complaint.value) {
        showToast('内容！要投诉高低写点内容吧');
        return false;
    }
    try {
        loading.value = true;
        const response = await httpRequest({
            url: config.interface.setComplaint,
            method: 'post',
            data: { token: token.value, title: title.value, complaint: complaint.value },
        });
        if (response.code === 0) {
            showToast('不是，你真提交啊，行，你完了');
            title.value = null;
            complaint.value = null;
        } else {
            showToast(response.message || '获取失败');
        }
        loading.value = false;
    } catch (error) {
        showToast('请求失败，请稍后重试');
        loading.value = false;
    }
}
</script>

<style>
body {
    position: relative;
    z-index: 0;
}

.user-complaint {
    .matrix {
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: -10;

        img {
            width: 100%;
        }

        .overlay {
            position: absolute;
            top: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(to bottom, rgba(255, 255, 255, 0), #FAFAFA);
            z-index: 0;
        }
    }

    .complaint {
        padding: 1rem;
        margin: 3rem 1rem 7rem 1rem;
    }

    .operate {
        width: 100%;
        display: flex;
        position: fixed;
        left: 0;
        bottom: 2rem;
        font-size: .9rem;
    }

}
</style>
