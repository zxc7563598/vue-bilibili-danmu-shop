<template>
  <div class="van-safe-area-top"></div>
  <div class="app" v-show="isLoaded">
    <router-view></router-view>
  </div>
  <div class="van-safe-area-bottom"></div>
</template>
<script setup>
import httpRequest from './static/request.js';
import config from './static/config.js';
import { ref, onMounted } from 'vue';
import { showToast } from 'vant';

const isLoaded = ref(false);

const hexToRgb = (hex) => {
  // 去掉可能的 #
  hex = hex.replace('#', '');

  // 将 HEX 拆分为红、绿、蓝三个部分
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  return `${r}, ${g}, ${b}`;
}

onMounted(async () => {
  try {
    const res = await httpRequest({
      url: config.interface.getThemeColor,
      method: 'post',
      data: {},
    });
    if (res.code === 0) {
      document.documentElement.style.setProperty('--theme-color-1', res.data[0]);
      document.documentElement.style.setProperty('--theme-color-2', res.data[1]);
      document.documentElement.style.setProperty('--theme-color-1-rgb', hexToRgb(res.data[0]));
      document.documentElement.style.setProperty('--theme-color-2-rgb', hexToRgb(res.data[1]));
      isLoaded.value = true;
    } else {
      showToast(res.message || '请求失败');
    }
  } catch (error) {
    console.log(error)
    showToast('请求失败，请稍后再试');
  }
});
</script>
<style scoped></style>
