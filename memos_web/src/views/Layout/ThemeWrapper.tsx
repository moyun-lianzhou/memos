import React, { useRef, useState } from "react";
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

const ThemeWrapper: React.FC<ThemeWrapperProps> = ({ isDarkMode, setIsDarkMode, }) => {
  const { token } = theme.useToken(); // 确保 useToken 在 ConfigProvider 作用域内
  const [collapsed, setCollapsed] = useState(false); // 控制侧边栏的折叠状态
  const toggleButtonRef = useRef<HTMLButtonElement>(null); // head区域控制侧边栏状态按钮的Dom引用

  return (
    <Layout style={{ minHeight: '100vh', boxSizing: 'border-box', width: '100vw' }}>
      <HeadRegion
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        toggleButtonRef={toggleButtonRef}
      />
      <Layout>
        <SideRegion
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          isDarkMode={isDarkMode}
          token={token}
          toggleButtonRef={toggleButtonRef}
        />
        {/* <Layout> */}
          <div style={{overflow:'scroll'}}><ContenRegion token={token} /></div>
          
        {/* </Layout> */}
      </Layout>
      {/* <FooterRegion token={token}/> */}
    </Layout>
  );
};

export default ThemeWrapper;
