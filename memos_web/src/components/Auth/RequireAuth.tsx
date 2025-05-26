import { Navigate, Outlet } from 'react-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

// 全局路由守卫-防止未登录用户用路径访问主页
const RequireAuth = () => {
  const userId = useSelector((state: RootState) => state.user.userId);

  if (!userId) {
    // 未登录，跳转到登录页面
    return <Navigate to="/login" replace />;
  }

  // 已登录，正常渲染子路由
  return <Outlet />;
};

export default RequireAuth;
