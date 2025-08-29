import axios from 'axios'
import config from './config'
import { encryptRequest } from 'hejunjie-encrypted-request'

let cachedPublicKey = null
export async function loadPublicKey() {
	if (cachedPublicKey)
		return cachedPublicKey
	const res = await fetch('/public_key.pem')
	if (!res.ok)
		throw new Error('Failed to load public key')
	const key = await res.text()
	cachedPublicKey = key
	return key
}

const service = axios.create({
	baseURL: config.baseUrl,
	timeout: 10000, // 请求超时时间毫秒
	headers: {
		'Content-Type': 'application/json'
	},
})

// 添加请求拦截器
service.interceptors.request.use(
	async function (config) {
		let token = config.data.token;
		config.data = encryptRequest(config.data, {
			rsaPubKey: await loadPublicKey(),
		});
		if (token) {
			config.data.token = token;
		}
		config.data.lang = 'zh_cn';
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