<template>
    <div class="protocol-credit">
        <van-nav-bar :title="data.title" left-arrow @click-left="handleBack" />
        <div class="protocol-body">
            <div class="protocol-name">{{ data.title }}</div>
            <div class="protocol-text">协议编号：{{ data.sn }}</div>
            <div class="protocol-text">甲方（用户）：{{ data.real_name }}</div>
            <div class="protocol-text">UID：{{ data.id_card }}</div>
            <div class="protocol-text">乙方（主播）：{{ data.company.name }}</div>
            <div class="protocol-text">UID：{{ data.company.uid }}</div>
            <div v-html="data.protocols" class="protocol-content"></div>
            <div class="protocol-text">甲方/用户（签字/盖章）： <img v-if="data.signing" :src="data.signing" class="user-signing"
                    @click="show = true"></div>
            <div class="protocol-text">签约日期：{{ data.signing_date }}</div>
            <div class="protocol-text">乙方/主播（签字/盖章）： <img v-if="data.company.face" :src="data.company.face"
                    class="user-signing"></div>
            <div class="protocol-text">签约日期：{{ data.signing_date }}</div>
        </div>
        <div class="sign">
            <div class="sign-button">
                <van-button type="default" block
                    color="linear-gradient(to right, var(--theme-color-1), var(--theme-color-2))" @click="confirme"
                    v-if="data.signing && route.params.confirm == 1">本人已阅读协议并签字确认，同意下单</van-button>
                <van-button type="default" block
                    color="linear-gradient(to right, var(--theme-color-1), var(--theme-color-2))" @click="show = true"
                    v-if="!data.signing">签署协议</van-button>
            </div>
        </div>
        <van-dialog v-model:show="show" title="请在框体内签名" show-cancel-button :showCancelButton="false"
            :showConfirmButton="false">
            <van-signature @submit="signatureSubmit" @clear="show = false" class="signature" />
        </van-dialog>
    </div>
</template>

<script setup>
import httpRequest from '../../static/request.js';
import config from '../../static/config.js';
import { ref, onMounted } from 'vue';
import cookie from 'js-cookie';
import { useRoute, useRouter } from 'vue-router';
import { showToast } from 'vant';

const route = useRoute();
const router = useRouter();
const token = ref(cookie.get('shop-token') || '');
const show = ref(false);

const data = ref({
    company: { face: "", name: null, uid: "" },
    id_card: null,
    real_name: null,
    signing: null,
    signing_date: null,
    protocols: null,
    title: null,
    sn: null
});

onMounted(() => {
    if (!token.value) {
        redirectToLogin();
    } else {
        fetchProtocolCredit();
    }
});

const handleBack = () => router.push(`/shop/confirm/${route.params.id}`);
const redirectToLogin = () => router.push('/login');

const fetchProtocolCredit = async () => {
    try {
        const response = await httpRequest({
            url: config.interface.getProtocolCredit,
            method: 'post',
            data: { token: token.value, goods_id: route.params.id },
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

// 提交签名信息
const signatureSubmit = async (event) => {
    try {
        const response = await httpRequest({
            url: config.interface.uploadSigning,
            method: 'post',
            data: { token: token.value, base64: event.image },
        });
        if (response.code === 0) {
            data.value.signing = response.data.url;
            show.value = false;
            if (route.params.confirm != 1) {
                handleBack();
            }
        } else {
            showToast(response.message || '上传失败');
        }
    } catch (error) {
        showToast('上传失败，请稍后重试');
    }
};

// 确认订单
const confirme = async () => {
    try {
        let email = cookie.get(`shop-email-${route.params.id}`) || '';
        let sub_id = cookie.get(`shop-goods-${route.params.id}`) || '';
        const response = await httpRequest({
            url: config.interface.confirmProduct,
            method: 'post',
            data: { token: token.value, goods_id: route.params.id, sub_id: sub_id, email: email },
        });
        if (response.code === 0) {
            let success = response.data.risk ? 1 : 0;
            let type = response.data.type;
            router.push(`/shop/loading/${success}/${type}`);
        } else {
            showToast(response.message || '下单失败');
        }
    } catch (error) {
        showToast('上传失败，请稍后重试');
    }
}

</script>

<style>
.protocol-credit {
    .protocol-body {
        padding: 1rem;
        margin-bottom: 6rem;

        .protocol-name {
            font-size: 1.2rem;
            font-weight: 700;
            margin: 1rem 0;
        }

        .protocol-title {
            font-size: 1rem;
            font-weight: 500;
            margin-top: 1rem;
        }

        .protocol-content {
            margin-top: .5rem;
            font-size: .8rem;

            * {
                font-size: .8rem;
            }
        }

        .protocol-special {
            font-size: .8rem;
            font-weight: 500;
            margin-top: .5rem;
        }

        .protocol-text {
            font-size: .8rem;
            font-weight: 400;
            margin-top: .5rem;
            display: flex;
            align-items: center;

            .user-signing {
                height: 3rem;
            }
        }
    }

    .sign {
        position: fixed;
        left: 0;
        bottom: 1rem;
        width: 100%;

        .sign-button {
            padding: 0 1rem;
        }
    }

    .signature>*>button {
        width: 100%;
        margin: .5rem;
    }
}
</style>
