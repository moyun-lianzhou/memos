import React from "react";
import { Layout, theme } from "antd";
import { Outlet } from "react-router";
import Header from "./Header";

const { Content, Footer } = Layout;

// ThemeWrapper 组件，负责页面布局和主题切换的渲染
interface ThemeWrapperProps {
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const ThemeWrapper: React.FC<ThemeWrapperProps> = ({isDarkMode, setIsDarkMode,}) => {
  const { token } = theme.useToken(); // 确保 useToken 在 ConfigProvider 作用域内
  
  return (
    <Layout style={{ minHeight: '100vh', boxSizing: 'border-box', width:'100%'}}>
      <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      <Content className="flex py-2 w-full">
        {/* 左侧留白：先收缩，minWidth 限制最小 */}
        <div className="hidden md:block shrink grow max-w-[240px] min-w-[50px]"/>

        {/* 主内容区 */}
        <div
          style={{background: token.colorBgContainer,borderRadius: token.borderRadius,}}
          className="p-6 shrink grow basis-[1200px]"
        >
          <Outlet />
        </div>

        {/* 右侧留白：同左侧 */}
        <div className="hidden md:block shrink grow max-w-[240px] min-w-[50px]"/>

      </Content>

      <Footer
        style={{ background: token.colorBgElevated}}
        className="text-center"
      >
        © 2025 Moyunlianzhou — Made with passion & purpose
      </Footer>
    </Layout>
  );
};

export default ThemeWrapper;
