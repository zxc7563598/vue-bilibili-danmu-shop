<template>
    <van-nav-bar title="商品" left-arrow @click-left="handleBack" />
    <van-swipe class="shop-swipe" :autoplay="3000" indicator-color="white">
        <van-swipe-item v-for="(item, index) in productData.carousel_images" :key="index">
            <img :src="item" class="item" />
        </van-swipe-item>
    </van-swipe>
    <van-notice-bar left-icon="volume-o" v-if="productData.tips" :text="productData.tips" class="notice" />
    <div class="commodity-title">
        <van-tag type="danger">{{ productData.type }}</van-tag>
        <span class="commodity-title-content">{{ productData.name }}</span>
    </div>
    <div class="commodity-price">
        <span class="price-symbol">🌟</span> {{ productData.amount }}
        <span class="price-symbol">{{ (productData.amount_type ? productData.amount_type : '积分') }}</span>
        <span class="price-volume">已售{{ productData.sale }}</span>
    </div>
    <van-tabs v-model:active="tabs" color="var(--theme-color-1)">
        <van-tab title="商品详情">
            <img v-for="(img, index) in productData.details_images" :key="index" :src="img" style="width: 100%;" />
        </van-tab>
        <van-tab title="服务说明">
            <img v-for="(img, index) in productData.service_description_images" :key="index" :src="img"
                style="width: 100%;" />
        </van-tab>
    </van-tabs>
    <div style="width:100%;height: 3rem;"></div>
    <van-action-bar>
        <van-action-bar-icon icon="home-o" text="首页" @click="router.push('/')" />
        <van-action-bar-button type="danger"
            color="linear-gradient(to right, var(--theme-color-1), var(--theme-color-2))" text="激情下单"
            @click="show = true" />
    </van-action-bar>
    <van-action-sheet v-model:show="show">
        <div class="action-confirm">
            <div class="commodity-info">
                <img :src="productData.cover_image" class="info-icon">
                <div class="info-content">
                    <div class="info-content-price"><span class="price-symbol">🌟</span>{{ productData.amount
                    }}{{ (productData.amount_type ? productData.amount_type : '积分') }}
                    </div>
                    <div class="info-content-type"> 已选择：{{ (productData.amount_type ? productData.amount_type : '积分') }}兑换
                    </div>
                </div>
            </div>
            <van-divider hairline />
            <div class="commodity-type">
                <div class="commodity-type-title">选择款式<span>最多可选 {{ productData.sub_num }} 项</span></div>
                <van-tag type="default" size="large" class="commodity-type-info" color="var(--theme-color-1)"
                    v-for="(item, index) in productData.commodity_type" :key="index"
                    @click="toggleCommoditySelection(item)" :plain="!productData.sub_id.includes(item.id)">{{ item.name
                    }}</van-tag>
            </div>
            <div class="payment-method">
                <div class="payment-method-title">付款方式</div>
                <van-tag type="default" size="large" color="var(--theme-color-1)">{{ (productData.amount_type ?
                    productData.amount_type : '积分')}}兑换</van-tag>
            </div>
            <van-button type="default" size="normal"
                style="color: white; background: linear-gradient(to right, var(--theme-color-1), var(--theme-color-2)); border: 0px;"
                @click="submitOrder">提交订单</van-button>
        </div>
    </van-action-sheet>
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

const tabs = ref(0);
const show = ref(false);

const productData = ref({
    amount: null,
    amount_type: null,
    carousel_images: [],
    commodity_type: [],
    cover_image: '',
    details_images: [],
    goods_id: null,
    name: '',
    service_description_images: [],
    sub_num: null,
    tips: '',
    type: '',
    sub_id: [],
    sale: 0
});

const token = ref(cookie.get('shop-token') || '');

onMounted(() => {
    if (!token.value) {
        redirectToLogin();
    } else {
        fetchProductDetails();
    }
});

const handleBack = () => router.push('/')

const fetchProductDetails = async () => {
    try {
        const response = await httpRequest({
            url: config.interface.getGoodsDetails,
            method: 'post',
            data: { token: token.value, goods_id: route.params.id },
        });
        if (response.code === 0) {
            Object.assign(productData.value, response.data);
        } else {
            showToast(response.message || '获取失败');
        }
    } catch (error) {
        showToast('请求失败，请稍后重试');
    }
};

const toggleCommoditySelection = (item) => {
    const selectedIds = productData.value.sub_id;
    const maxSelectable = productData.value.sub_num;
    if (selectedIds.includes(item.id)) {
        productData.value.sub_id = selectedIds.filter(id => id !== item.id);
    } else if (selectedIds.length < maxSelectable) {
        productData.value.sub_id = [...selectedIds, item.id];
    } else {
        if (maxSelectable == 1) {
            productData.value.sub_id = [item.id];
        } else {
            showToast(`最多可选择 ${maxSelectable} 项`);
        }
    }
    cookie.set(`shop-goods-${productData.value.goods_id}`, productData.value.sub_id.join(','));
};

const submitOrder = () => {
    if (productData.value.sub_id.length === 0) {
        showToast('请先选择商品款式');
        return;
    }
    router.push(`/shop/confirm/${productData.value.goods_id}`);
};

const redirectToLogin = () => {
    router.push('/login');
};
</script>

<style scoped>
.shop-swipe {
    width: 100%;
}

.shop-swipe .item {
    width: 100%;
}

.notice {
    color: var(--theme-color-1);
    background: rgba(var(--theme-color-1-rgb), 0.2)
}

.commodity-title {
    display: flex;
    margin: 1rem;
}

.commodity-title-content {
    margin-left: 0.5rem;
    word-break: break-word;
    color: #333;
}

.commodity-price {
    margin: 0 1rem 1rem;
    display: flex;
    align-items: flex-end;
    font-size: 1.5rem;
    font-weight: 500;
    color: var(--theme-color-1);
}

.commodity-price .price-symbol {
    font-size: 0.8rem;
    margin-left: 0.2rem;
}

.commodity-price .price-volume {
    margin-left: auto;
    font-size: 0.8rem;
    color: #999;
}

.action-confirm {
    display: flex;
    flex-direction: column;
    padding: 1rem;
}

.commodity-info {
    display: flex;
    margin-bottom: 1rem;
}

.commodity-info .info-icon {
    height: 4rem;
}

.commodity-info .info-content {
    display: flex;
    flex-direction: column;
    margin-left: 1rem;
}

.info-content-price {
    font-size: 1.2rem;
    font-weight: 500;
    color: var(--theme-color-1);
}

.info-content-type {
    font-size: 0.8rem;
    color: #999;
}

.commodity-type {
    margin-bottom: 1rem;
}

.commodity-type-title {
    font-weight: 500;
    color: #333;
}

.commodity-type-title span {
    font-size: 0.8rem;
    margin-left: 0.5rem;
    color: #999;
}

.commodity-type-info {
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
}

.payment-method {
    margin-bottom: 1rem;
}

.payment-method-title {
    font-weight: 500;
    color: #333;
}
</style>
