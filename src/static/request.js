import axios from 'axios'
import CryptoJS from 'crypto-js'
import config from './config'

const service = axios.create({
	baseURL: config.baseUrl,
	timeout: 10000, // 请求超时时间毫秒
	headers: {
		'Content-Type': 'application/json'
	},
})

// 添加请求拦截器
service.interceptors.request.use(
	function (config) {
		let token = config.data.token;
		let timestamp = Math.floor(Date.now() / 1000);
		let en_data = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(JSON.stringify(config.data)),
			CryptoJS.enc.Utf8.parse(import.meta.env.VITE_API_AES_KEY), {
			iv: CryptoJS.enc.Utf8.parse(import.meta.env.VITE_API_AES_IV),
			mode: CryptoJS.mode.CBC, // 使用 CBC 模式
			padding: CryptoJS.pad.Pkcs7 // 使用 PKCS#7 填充
		}).toString();
		let sign = CryptoJS.MD5(import.meta.env.VITE_API_KEY + timestamp).toString(CryptoJS.enc.Hex);
		config.data = {
			"en_data": en_data,
			"timestamp": timestamp,
			"sign": sign,
			"lang": 'zh_cn'
		}
		if (token) {
			config.data.token = token;
		}
		return config
	},
	function (error) {
		return Promise.reject(error)
	}
)

// 添加响应拦截器
service.interceptors.response.use(
	function (response) {
		switch (String(response.data.code)) {
			case '900006':
			case '800004':
				window.location.href = '/login'
				break;
		}
		return response.data
	},
	function (error) {
		return Promise.reject(error)
	}
)
export default service