import React, { useState } from "react";
import { theme, ConfigProvider } from "antd";
import ThemeWrapper from "./ThemeWrapper";
import { App } from "antd";

const Layout: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <App>
      <ConfigProvider
        theme={{
          algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: {
            
          },
          components: {
            Layout: {
              headerHeight: 64, // 头部高度
            },
            Menu: {
              itemHeight: 48, // 菜单项高度
              itemColor: "black", // 菜单项文字颜色
              itemActiveBg: "f0f5ff", // 菜单项激活态背景色
              itemHoverBg: "#F6F6F6", // 菜单悬浮背景色
              itemSelectedBg: "#ECEDF6", // 菜单项选中态背景色
              itemSelectedColor: "#4352AD", // 菜单项文字选中颜色

              iconSize:18, // 菜单图标大小
              darkItemHoverColor: "#AECCF9", // 暗色模式下的菜单项悬浮颜色
              darkItemSelectedBg: "#111419", // 暗色模式下的菜单项选中背景色
              darkItemSelectedColor: "#AECCF9", // 暗色模式下的菜单项选中颜色
            },
          },
        }}
      >
        {/* useToken 必须在 ConfigProvider 作用域内 */}
        <ThemeWrapper isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      </ConfigProvider>
    </App>
  );
};

export default Layout;
