<template>
    <div class="login-container" id="login-container">
        <transition name="van-slide-down">
            <van-cell-group inset class="login" v-show="visible.login">
                <div class="title">我来啦</div>
                <div class="remark">uid可以从「我的」「设置」「个人资料」中查看</div>
                <div class="remark">积分增加可能会有延迟，不要慌喔</div>
                <input type="text" placeholder="请输入UID" class="input" v-model="uid">
                <div class="van-hairline--bottom"></div>
                <van-button color="linear-gradient(to right, var(--theme-color-1), var(--theme-color-2))" size="small"
                    class="submit" block round @click="getUserVip" :loading="loading" loading-text="查询中...">
                    登录
                </van-button>
            </van-cell-group>
        </transition>
        <transition name="van-slide-down">
            <van-cell-group inset class="login" v-show="visible.password">
                <div class="title">登录喔</div>
                <div class="remark">uid可以从「我的」「设置」「个人资料」中查看</div>
                <div class="remark">密码还记得吗记得吗记得吗，不记得可以去找主播变更密码喔</div>
                <input type="text" placeholder="请输入密码" class="input" v-model="password">
                <div class="van-hairline--bottom"></div>
                <van-button color="linear-gradient(to right, var(--theme-color-1), var(--theme-color-2))" size="small"
                    class="submit" block round @click="performLogin" :loading="loading" loading-text="查询中...">
                    登录
                </van-button>
            </van-cell-group>
        </transition>
        <transition name="van-slide-down">
            <van-cell-group inset class="login" v-show="visible.register">
                <div class="title">注册耶</div>
                <div class="remark">你是第一次登录的新用户</div>
                <div class="remark">可以给自己设置一个初始密码，不要忘记喔</div>
                <input type="text" placeholder="请输入密码" class="input" v-model="password">
                <div class="van-hairline--bottom"></div>
                <van-button color="linear-gradient(to right, var(--theme-color-1), var(--theme-color-2))" size="small"
                    class="submit" block round @click="performLogin" :loading="loading" loading-text="查询中...">
                    注册
                </van-button>
            </van-cell-group>
        </transition>
    </div>
</template>

<script setup>
import httpRequest from '../static/request.js';
import config from '../static/config.js';
import { ref, onMounted } from 'vue';
import cookie from 'js-cookie';
import { showToast } from 'vant';
import { useRouter } from 'vue-router';

const router = useRouter();

const visible = ref({
    login: false,
    password: false,
    register: false
});

const loading = ref(false);
const uid = ref('');
const password = ref('');
const passwordShow = ref(true);

// 切换页面的显示状态
const switchPages = (type) => {
    visible.value = { login: false, password: false, register: false };  // 重置所有页面的显示状态
    setTimeout(() => {
        visible.value[type] = true;  // 激活当前页面
    }, 500);
};

// 通用加载状态管理
const setLoading = (isLoading) => {
    loading.value = isLoading;
};

// 获取用户 VIP 信息
const getUserVip = async () => {
    if (!uid.value) {
        showToast('请输入有效uid');
        return;
    }
    setLoading(true);
    try {
        const res = await httpRequest({
            url: config.interface.getUserVip,
            method: 'post',
            data: { uid: uid.value },
        });
        setLoading(false);
        if (res.code === 0) {
            if (passwordShow.value) {
                switchPages(res.data.exist ? 'password' : 'register');
            } else {
                password.value = 'null';
                performLogin();
            }
        } else {
            showToast(res.message || '操作失败');
        }
    } catch (error) {
        setLoading(false);
        showToast('请求失败，请稍后再试');
    }
};

// 执行登录操作
const performLogin = async () => {
    if (!uid.value) {
        showToast('请输入有效uid');
        return;
    }
    if (!password.value) {
        showToast('请输入密码');
        return;
    }
    setLoading(true);
    try {
        const res = await httpRequest({
            url: config.interface.performLogin,
            method: 'post',
            data: { uid: uid.value, password: password.value },
        });
        setLoading(false);
        if (res.code == 0) {
            cookie.set('shop-token', res.data.token);
            router.push('/');
        } else {
            showToast(res.message || '登录失败');
        }
    } catch (error) {
        setLoading(false);
        showToast('请求失败，请稍后再试');
        console.log(error)
    }
};

const getConfigData = async () => {
    try {
        const res = await httpRequest({
            url: config.interface.getLoginConfig,
            method: 'post',
            data: {},
        });
        if (res.code == 0) {
            const box = document.querySelector('.login-container');
            box.style.backgroundImage = "url('" + res.data.background + "')"; // 设置背景图片
            passwordShow.value = res.data.password
        } else {
            showToast(res.message || '获取失败');
        }
    } catch (error) {
        showToast('请求失败，请稍后再试');
        console.log(error)
    }
}

// 初始化页面，默认为显示 login 页面
onMounted(() => {
    switchPages('login');
    getConfigData()
});
</script>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    margin: 0;
    background-size: cover;
    /* 保证背景图自适应并填充整个背景 */
    background-position: center;
    background-repeat: no-repeat;
}

.login {
    padding: 1rem 2rem;
    z-index: 2;
    box-shadow: rgba(9, 10, 12, 0.1) 0px 8px 16px -2px, rgba(9, 10, 12, 0.02) 0px 0px 0px 1px;
    width: 100%;
    /* 使用百分比宽度，使其适应屏幕大小 */
    max-width: 360px;
    /* 最大宽度限制，避免屏幕过大时失衡 */
    border-radius: 8px;
    /* 增加圆角边框 */
    background-color: rgba(255, 255, 255, 0.85);
    /* 半透明白色背景，使背景图片不干扰内容 */
    box-sizing: border-box;
    /* 包括 padding 在内的宽度计算 */
}

.title {
    text-align: center;
    font-size: 1.4rem;
    font-weight: 700;
    margin-bottom: 1rem;
    /* 加大标题与其他元素的间距 */
}

.remark {
    text-align: center;
    font-size: 0.8rem;
    color: #666;
    margin-top: 0.5rem;
    line-height: 1.5;
}

.input {
    width: 100%;
    margin: 1rem auto;
    /* 居中并提供上下间距 */
    padding: 0.5rem;
    font-size: 1rem;
    text-align: center;
    border: 1px solid #e9e9e9;
    border-radius: 4px;
    /* 输入框圆角 */
    outline: none;
    /* 移除默认聚焦时的轮廓 */
    box-sizing: border-box;
    transition: border-color 0.3s ease;
    /* 平滑过渡效果 */
}

.input:focus {
    border-color: var(--theme-color-1);
    /* 聚焦时的边框颜色 */
}

.submit {
    margin-top: 1rem;
    background: linear-gradient(to right, var(--theme-color-1), var(--theme-color-2));
    border-radius: 4px;
    /* 增加按钮圆角 */
    font-size: 1.1rem;
    padding: 0.8rem 1.5rem;
    width: 100%;
}

.submit:disabled {
    background-color: #ddd;
    /* 禁用按钮的背景色 */
    cursor: not-allowed;
    /* 禁用时改变鼠标样式 */
}

.van-button {
    /* 保证 van-button 的样式与自定义样式的兼容性 */
    font-size: 1rem;
    height: 40px;
}
</style>
