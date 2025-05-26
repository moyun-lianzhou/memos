import { logout } from '@/redux/slices/userSlice';
import store from '@/redux/store'

export const handleTokenExpired = () => {
    store.dispatch(logout())
    // 延迟跳转登录页，让 message 有时间展示
    setTimeout(() => {
        window.location.href = '/login' // 用原生跳转方式，保险且全局有效
    }, 1500)
};
