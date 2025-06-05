import React, { useState } from "react";
import { Layout, theme } from "antd";
import HeadRegion from "./HeadRegion";
import SideRegion from "./SideRegion";
import ContenRegion from "./ContenRegion";
// import FooterRegion from "./FooterRegion";

// ThemeWrapper 组件，负责页面布局和主题切换的渲染
interface ThemeWrapperProps {
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const ThemeWrapper: React.FC<ThemeWrapperProps> = ({isDarkMode, setIsDarkMode,}) => {
  // 确保 useToken 在 ConfigProvider 作用域内
  const { token } = theme.useToken();
  const [collapsed, setCollapsed] = useState(false);
  
  return (
    <Layout style={{ minHeight: '100vh', boxSizing: 'border-box', width:'100vw'}}>
      <SideRegion isDarkMode={isDarkMode} collapsed={collapsed} setCollapsed={setCollapsed} token={token}/>
      <Layout>
      <HeadRegion collapsed={collapsed} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      <ContenRegion collapsed={collapsed} token={token}/>
      {/* <FooterRegion token={token}/> */}
      </Layout>
    </Layout>
  );
};

export default ThemeWrapper;
