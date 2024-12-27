<template>
    <van-nav-bar title="确认订单" left-arrow @click-left="handleBack" />
    <div v-if="data.product.address">
        <van-cell-group inset class="shipping-address" v-if="data.user_address"
            @click="router.push(`/user/address/${route.params.id}`)">
            <div class="address-area">
                {{ data.user_address.province }}&nbsp;{{ data.user_address.city }}&nbsp;{{ data.user_address.county }}
            </div>
            <div class="address-city">
                <div class="address-city-info">{{ data.user_address.detail }}</div>
                <div class="address-city-edit">
                    <van-icon name="arrow" />
                </div>
            </div>
            <div class="address-user">
                <div class="address-user-name">{{ data.user_address.name }}<span class="address-user-phone">{{
                    data.user_address.phone }}</span></div>
            </div>
        </van-cell-group>
        <van-cell-group inset class="shipping-address" v-else @click="router.push(`/user/address/${route.params.id}`)">
            <div class="address-city">
                <div class="address-city-info">选择收货地址</div>
                <div class="address-city-edit"><van-icon name="arrow" /></div>
            </div>
        </van-cell-group>
    </div>
    <van-cell-group inset class="commodity">
        <div class="commodity-info">
            <img class="commodity-info-icon" :src="data.product.cover">
            <div class="commodity-info-content">
                <div class="content-title">{{ data.product.name }}</div>
                <div class="content-specification"> 规格：{{ data.product.commodity_type }} </div>
            </div>
        </div>
        <div class="commodity-price">
            <div class="price-info"><span class="price-symbol">积分&nbsp;</span>{{ data.product.amount }}</div>
        </div>
        <div class="commodity-list" v-for="(item, index) in data.product.details" :key="index">
            <div class="commodity-list-title">{{ item.key }}</div>
            <div class="commodity-list-content">{{ item.value }}</div>
        </div>
    </van-cell-group>
    <div class="protocols" @click="router.push(`/protocol/credit/${route.params.id}`)">
        <van-icon name="success" :class="data.product.protocols ? 'icon-success' : 'icon'" />
        <div class="protocols-text">我已阅读并同意签署<a href="javascript:;" class="protocols-text-href">《{{data.protocols_title}}》</a></div>
    </div>
    <div class="buy-body">
        <van-button color="linear-gradient(to right, var(--theme-color-1), var(--theme-color-2))" block @click="buying">
            火速下单
        </van-button>
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

const data = ref({
    user_address: {},
    product: {},
    protocols_title: ''
});

onMounted(() => {
    if (!token.value) {
        redirectToLogin();
    } else {
        fetchProductDetails();
    }
});

const handleBack = () => router.push(`/shop/details/${route.params.id}`);
const redirectToLogin = () => router.push('/login');

// 获取页面数据
const fetchProductDetails = async () => {
    const sub_id = cookie.get(`shop-goods-${route.params.id}`) || '';
    if (!sub_id) {
        showToast('信息异常，请重新下单');
        setTimeout(() => {
            router.push('/');
        }, 500);
        return;
    }
    try {
        const response = await httpRequest({
            url: config.interface.getConfirm,
            method: 'post',
            data: { token: token.value, goods_id: route.params.id, sub_id },
        });
        if (response.code === 0) {
            data.value = response.data;
        } else {
            showToast(response.message || '获取失败');
        }
    } catch (error) {
        showToast('请求失败，请稍后重试');
    }
};

// 下单
const buying = () => {
    if (data.value.product.address && !data.value.user_address) {
        showToast('请选择您的地址');
        return;
    }
    router.push(`/protocol/credit/${route.params.id}/1`)
}
</script>


<style scoped>
.shipping-address {
    box-shadow: 0 1px 5px 3px #b4b4b41a;
    display: flex;
    flex-direction: column;
    margin-top: 1rem;
    padding: 1rem;

    .address-area {
        font-size: .8rem;
        color: #999;
    }

    .address-city {
        display: flex;
        margin: .2rem 0;
        font-weight: 400;

        .address-city-info {
            font-weight: 500;
            color: #333;
        }

        .address-city-edit {
            margin-left: auto;
            color: #999;
        }
    }

    .address-user {
        display: flex;

        .address-user-name {
            color: #333;
            margin-top: auto;
        }

        .address-user-phone {
            color: #999;
            font-size: .9rem;
            margin-left: 1rem;
        }
    }
}

.commodity {
    box-shadow: 0 1px 5px 3px #b4b4b41a;
    display: flex;
    flex-direction: column;
    margin-top: 1rem;
    padding: 1rem;

    .commodity-info {
        display: flex;

        .commodity-info-icon {
            height: 6rem;
            margin-right: 1rem
        }

        .commodity-info-content {
            display: flex;
            flex-direction: column;

            .content-title {
                color: #333;
                font-size: .9rem
            }

            .content-specification {
                margin-top: .5rem;
                color: #999;
                font-size: .8rem
            }
        }
    }

    .commodity-price {
        display: flex;

        .price-info {
            margin-left: auto;
            font-size: 1.5rem;
            font-size: 500;
            color: var(--theme-color-1);

            .price-symbol {
                font-size: .8rem;
                color: var(--theme-color-1);
                margin-top: auto;
            }
        }
    }

    .commodity-list {
        display: flex;
        margin-top: 1rem;

        .commodity-list-title {
            display: flex;
            color: #333;
            align-items: center;
        }

        .commodity-list-content {
            margin-left: auto;
            color: #999;
        }
    }
}

.protocols {
    margin: 1rem 2rem 0;
    display: flex;
    justify-content: center;
    align-items: center;

    .icon {
        background: #e3e3e3;
        border-radius: 100%;
        font-size: .6rem;
        width: .8rem;
        height: .8rem;
        color: #e3e3e3;
        text-align: center;
        line-height: .8rem;
        margin-right: 0.2rem;
        border: 1px solid #c9c9c9;
    }

    .icon-success {
        background: var(--theme-color-1);
        border-radius: 100%;
        font-size: .6rem;
        width: .8rem;
        height: .8rem;
        color: #fff;
        text-align: center;
        line-height: .8rem;
        margin-right: 0.2rem;
        border: 1px solid var(--theme-color-1);
    }

    .protocols-text {
        font-size: .8rem;

        .protocols-text-href {
            font-size: .8rem;
            color: var(--theme-color-1)
        }
    }
}

.buy-body {
    margin: 1rem
}
</style>
