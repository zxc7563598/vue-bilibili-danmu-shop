<template>
    <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoadMore">
        <van-row gutter="10" class="shop-list">
            <van-col span="12" v-for="(item, index) in data" :key="item.goods_id">
                <div class="shop" @click="goDetails(item.goods_id)">
                    <van-skeleton style="padding: 0;" v-show="item.loading">
                        <template #template>
                            <div :style="{ display: 'flex', width: '100%' }">
                                <van-skeleton-image style="flex: 1; height: 40vw;" />
                            </div>
                        </template>
                    </van-skeleton>
                    <img :src="item.cover_image" class="cover" @load="onImageLoad(index)" v-show="!item.loading" />
                    <div class="name">
                        <van-text-ellipsis position="middle" :content="item.name" />
                    </div>
                    <div class="price">
                        <van-text-ellipsis position="middle" :content="item.amount + '积分'" />
                    </div>
                </div>
            </van-col>
        </van-row>
    </van-list>

    <van-tabbar v-model="active" active-color="var(--theme-color-1)" @change="menuSwitch">
        <van-tabbar-item icon="home-o">首页</van-tabbar-item>
        <van-tabbar-item icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
</template>


<script setup>
import httpRequest from '../static/request.js';
import config from '../static/config.js';
import { ref, onMounted } from 'vue';
import cookie from 'js-cookie';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';

const router = useRouter();

const active = ref(0);

// 初始化数据和token
const data = ref([]);
const token = ref(cookie.get('shop-token') || '');

const loading = ref(false);
const finished = ref(false);
const pageNo = ref(1); // 当前页码
const pageSize = 10;

// 加载更多数据
const onLoadMore = async () => {
  loading.value = true;
  try {
    const res = await httpRequest({
      url: config.interface.getGoodsV2,
      method: 'post',
      data: {
        token: token.value,
        pageNo: pageNo.value,
        pageSize
      }
    });

    if (res.code === 0) {
      const newItems = res.data.pageData.map(item => ({
        ...item,
        loading: true
      }));

      data.value.push(...newItems);
      pageNo.value++;

      if (newItems.length < pageSize) {
        finished.value = true; // 数据不足一页，认为已加载完
      }
    } else {
      showToast(res.message || '加载失败');
      finished.value = true;
    }
  } catch (e) {
    showToast('加载失败');
    finished.value = true;
  } finally {
    loading.value = false;
  }
};


// 页面加载时检查token并获取商品数据
onMounted(() => {
    if (!token.value) {
        router.push('/login');
    }
});


// 图片加载完成后，更新 loading 状态
const onImageLoad = (index) => {
    data.value[index].loading = false;
};

// 切换菜单
const menuSwitch = (index) => {
    switch (index) {
        case 0:
            router.push('/');
            break;
        case 1:
            router.push('/user');
            break;
    }
};

// 前往详情
const goDetails = (id) => {
    router.push(`/shop/details/${id}`);
}
</script>

<style>
.shop-list {
    padding: 1rem 10px;
    margin-bottom: 3rem;
}

.shop {
    border-radius: 0.5rem;
    background-color: #fff;
    box-shadow: rgba(9, 10, 12, 0.1) 0px 8px 16px -2px, rgba(9, 10, 12, 0.02) 0px 0px 0px 1px;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    margin-bottom: 10px;
}

.cover {
    width: 100%;
    height: auto;
    object-fit: cover;
}

.name {
    color: #666;
    font-size: .9rem;
    text-align: right;
    padding: 0 .5rem;
    margin-top: .2rem;
}

.price {
    font-size: .8rem;
    font-weight: 500;
    color: var(--theme-color-1);
    text-align: right;
    padding: 0 .5rem;
    margin-bottom: .5rem;
}
</style>
