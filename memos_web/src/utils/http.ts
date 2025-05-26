import axios from "axios";
import { message } from 'antd';
import { handleTokenExpired } from '@/utils/tokenAuth';

const instance = axios.create({
    // baseURL: 'http://129.211.15.65:3000', // 生产模式
    baseURL: 'http://localhost:3000', // 开发模式
    timeout: 30000,
})

// 请求拦截器
instance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token'); // 读取 Token
        // console.log('携带的token', token);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }, error => {
        return Promise.reject(error);
    });

// 响应拦截器
instance.interceptors.response.use(
    response => { // 2xx 范围内的状态码
        if (response.headers['x-refresh-token']) { // 检查是否有新的 token
            const newToken = response.headers['x-refresh-token']
            localStorage.setItem('token', newToken);
        }
        return response;
    }, error => { // 超出 2xx 范围的状态码
        if (error.response?.status === 401) {
            handleTokenExpired()  // token 过期处理
        }
        console.log(error);
        message.error(error.response.data.msg || '请求失败'); // 拦截错误显示到页面
        return Promise.reject(error);
    });

// 封装 GET 请求
const get = (url: string, params = {}) => {
    return instance.get(url, { params });
};

// 封装 POST 请求
const post = (url: string, data = {}) => {
    return instance.post(url, data);
};

// 封装 PUT 请求
const put = (url: string, data = {}) => {
    return instance.put(url, data);
};

// 封装 DELETE 请求
const del = (url: string, params = {}) => {
    return instance.delete(url, { params });
};

export { get, post, put, del }