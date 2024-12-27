<template>
    <div class="user-consumers">
        <van-nav-bar title="开通记录" left-arrow @click-left="handleBack" />
        <van-cell-group inset class="consumers-list" v-for="(item, index) in data.records" :key="index">
            <img src="../../assets/user/jian.png" class="left-icon" v-show="item.vip_type == 1">
            <img src="../../assets/user/ti.png" class="left-icon" v-show="item.vip_type == 2">
            <img src="../../assets/user/zong.png" class="left-icon" v-show="item.vip_type == 3">
            <div class="user-info">
                <div class="uid">{{ item.uid }}</div>
                <div class="uname">{{ item.name }}</div>
                <div class="time">{{ item.days }}</div>
            </div>
            <div class="point">+{{ item.point }}积分</div>
        </van-cell-group>
    </div>
</template>

<script setup>
import httpRequest from '../../static/request.js';
import config from '../../static/config.js';
import { ref, onMounted } from 'vue';
import cookie from 'js-cookie';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';

const token = ref(cookie.get('shop-token') || '');
const router = useRouter();

const data = ref({
    records: []
});

onMounted(() => {
    if (!token.value) {
        redirectToLogin();
    } else {
        loadConsumersList();
    }
});

const handleBack = () => router.push('/user');
const redirectToLogin = () => router.push('/login');

const loadConsumersList = async () => {
    try {
        const response = await httpRequest({
            url: config.interface.getConsumers,
            method: 'post',
            data: { token: token.value },
        });
        if (response.code === 0) {
            Object.assign(data.value, response.data);
        } else {
            showToast(response.message || '选择失败');
        }
    } catch (error) {
        showToast('请求失败，请稍后重试');
    }
}

</script>

<style>

.user-consumers {
    min-height: 100vh;
    background-color: #fafafa;

    .consumers-list {
        box-shadow: 0 1px 5px 3px #b4b4b41a;
        display: flex;
        margin-top: 1rem;
        padding: 1rem;
        background-color: #fff;

        .no-order-icon {
            width: 100%;
        }

        .left-icon {
            height: 4rem;
        }

        .user-info {
            margin-left: 1rem;
            display: flex;
            flex-direction: column;
            height: 4rem;

            .uid {
                color: #333;
                font-size: .8rem;
            }

            .uname {
                color: #333;
            }

            .time {
                margin-top: auto;
            }
        }

        .point {
            color: var(--theme-color-1);
            margin-left: auto;
            line-height: 4rem;
        }
    }
}
</style>
