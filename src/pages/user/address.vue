<template>
    <div class="user-address">
        <van-nav-bar title="地址管理" left-arrow @click-left="navigateBack" />
        <div v-if="!edit">
            <van-address-list v-model="addressId" :list="data" @add="openEditAddressForm" @edit="openEditAddressForm"
                @select="selectAddress" />
        </div>
        <div v-else>
            <van-address-edit :area-list="areaList" :address-info="addressInfo"
                :area-columns-placeholder="['请选择', '请选择', '请选择']" @save="saveAddressChanges" />
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
import { areaList } from '@vant/area-data';

const token = ref(cookie.get('shop-token') || '');
const edit = ref(false);
const data = ref([]);
const addressId = ref(null);
const addressInfo = ref({
    id: '',
    name: '',
    tel: '',
    province: '',
    city: '',
    county: '',
    addressDetail: ''
});
const route = useRoute();
const router = useRouter();

onMounted(() => {
    if (!token.value) {
        redirectToLogin();
    } else {
        loadAddressList();
    }
});

const navigateBack = () => {
    if (edit.value) {
        edit.value = false;
    } else {
        route.params.id ? router.push(`/shop/confirm/${route.params.id}`) : history.back();
    }
};

const redirectToLogin = () => router.push('/login');

// 加载地址列表数据
const loadAddressList = async () => {
    try {
        edit.value = false;
        const response = await httpRequest({
            url: config.interface.getAddressList,
            method: 'post',
            data: { token: token.value },
        });
        if (response.code === 0) {
            data.value = response.data.address.map(item => ({
                id: item.id,
                name: item.name,
                tel: item.phone,
                address: `${item.province} ${item.city} ${item.county} ${item.detail}`,
            }));
            addressId.value = response.data.address.find(item => item.selected)?.id || null;
        } else {
            showToast(response.message || '获取失败');
        }
    } catch (error) {
        showToast('请求失败，请稍后重试');
    }
};

// 打开编辑地址的表单
const openEditAddressForm = async (item = null) => {
    addressInfo.value = { id: '', name: '', tel: '', province: '', city: '', county: '', addressDetail: '' };
    if (item) {
        try {
            const response = await httpRequest({
                url: config.interface.getAddressDetails,
                method: 'post',
                data: { token: token.value, id: item.id },
            });
            if (response.code === 0) {
                addressInfo.value.id = response.data.record.id;
                addressInfo.value.name = response.data.record.name;
                addressInfo.value.tel = response.data.record.phone;
                addressInfo.value.province = response.data.record.province;
                addressInfo.value.city = response.data.record.city;
                addressInfo.value.county = response.data.record.county;
                addressInfo.value.addressDetail = response.data.record.detail;
            } else {
                showToast(response.message || '获取失败');
            }
        } catch (error) {
            showToast('请求失败，请稍后重试');
        }
    }
    edit.value = true;
};

// 保存地址的变更
const saveAddressChanges = async (event) => {
    try {
        const id = addressInfo.value.id || null;
        const response = await httpRequest({
            url: config.interface.setAddressList,
            method: 'post',
            data: {
                token: token.value,
                id,
                name: event.name,
                phone: event.tel,
                province: event.province,
                city: event.city,
                county: event.county,
                detail: event.addressDetail
            },
        });
        if (response.code === 0) {
            loadAddressList();
        } else {
            showToast(response.message || '保存失败');
        }
    } catch (error) {
        showToast('请求失败，请稍后重试');
    }
};

// 选择地址
const selectAddress = async (item) => {
    try {
        const response = await httpRequest({
            url: config.interface.setAddressSelected,
            method: 'post',
            data: { token: token.value, id: item.id },
        });
        if (response.code === 0) {
            if (route.params.id) {
                navigateBack();
            }
        } else {
            showToast(response.message || '选择失败');
        }
    } catch (error) {
        showToast('请求失败，请稍后重试');
    }
};
</script>

<style>

.user-address {
    min-height: 100vh;
    background-color: #fafafa;

    * button {
        background: linear-gradient(to right, var(--theme-color-1), var(--theme-color-2));
        border: none;
    }
}
</style>
