import { Navigate, Outlet } from 'react-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

// 全局路由守卫-防止已经登录的用户在输入/login导航到登录页面
const RedirectIfAuthenticated = () => {
  const userId = useSelector((state: RootState) => state.user.userId);
  
  if (userId) {
    // 已登录，跳转到主页
    return <Navigate to="/" replace />;
  }
  // 未登录，允许访问登录页面
  return <Outlet />;
};

export default RedirectIfAuthenticated;
