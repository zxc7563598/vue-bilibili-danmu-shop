<template>
    <div class="user-redeeming">
        <van-nav-bar title="兑换记录" left-arrow @click-left="handleBack" />
        <van-cell-group inset class="order-list" v-for="(item, index) in data.order" :key="index">
            <div class="product-to-details">
                <div class="product-status">
                    <div class="order-sn">{{ item.create_time }}</div>
                    <div class="status">{{ item.status }}</div>
                </div>
                <van-divider />
                <div class="product-info">
                    <img :src="item.cover" class="product-info-icon">
                    <div class="product-info-content">
                        <div class="info-content">
                            <div class="info-content-title">
                                <div class="title">{{ item.goods_name }}</div>
                                <div class="price"><span class="price-symbol">积分:</span> {{ item.point }}</div>
                            </div>
                            <div class="info-content-specification"> 规格：{{ item.commodity_type }} </div>
                            <div class="info-content-number"><span round="" class="price-symbol">x</span>1 </div>
                        </div>
                    </div>
                </div>
            </div>
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
    order: []
});

onMounted(() => {
    if (!token.value) {
        redirectToLogin();
    } else {
        loadRedeemingList();
    }
});

const handleBack = () => router.push('/user');
const redirectToLogin = () => router.push('/login');

const loadRedeemingList = async () => {
    try {
        const response = await httpRequest({
            url: config.interface.getRedeeming,
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

.user-redeeming {
    min-height: 100vh;
    background-color: #fafafa;


    .order-list {
        margin: 1rem 1rem 0;
        padding: 1rem;
        box-shadow: 0 1px 5px 3px #b4b4b41a;
        display: flex;
        flex-direction: column;

        .no-order-icon {
            width: 100%;
        }

        .product-to-details {
            display: flex;
            flex-direction: column;

            .product-status {
                display: flex;

                .order-sn {
                    font-size: .8rem;
                    color: #999;
                    font-weight: 700;
                }

                .status {
                    margin-left: auto;
                    font-size: .8rem;
                    color: var(--theme-color-1);
                }
            }

            .product-info {
                display: flex;

                .product-info-icon {
                    height: 5.5rem;
                    margin-right: 1rem;
                }

                .product-info-content {
                    display: flex;
                    flex-direction: column;
                    width: 100%;

                    .info-content {
                        display: flex;
                        flex-direction: column;
                        width: 100%;
                        height: 100%;

                        .info-content-title {
                            display: flex;

                            .title {
                                font-size: .8rem;
                                margin-right: 1rem
                            }

                            .price {
                                margin-left: auto;
                                font-size: 1rem;
                                font-weight: 600;

                                .price-symbol {
                                    font-size: .8rem;
                                    font-weight: 500
                                }
                            }
                        }

                        .info-content-specification {
                            margin-top: .5rem;
                            font-size: .8rem;
                            color: #999
                        }

                        .info-content-number {
                            margin-left: auto;
                            font-size: 1rem;
                            font-weight: 600;
                            color: var(--theme-color-1);
                            margin-top: auto;

                            .price-symbol {
                                font-size: .8rem;
                                font-weight: 500
                            }
                        }
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
                    font-size: .8rem;
                }

                .commodity-list-content {
                    margin-left: auto;
                    color: #999;
                    font-size: .8rem;
                }
            }
        }
    }

}
</style>
